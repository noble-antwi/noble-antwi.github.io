---
title: "A Scanner That Is Not a Domain Admin"
date: 2026-09-14
category: lab-notes
tags: [greenbone, vulnerability-management, active-directory, group-policy, least-privilege, homelab, windows-server, dns]
description: "A vulnerability scanner needs administrative rights inside every machine it scans, which is the most tempting reason in the world to hand it Domain Admin. Here is the chain I built instead, the policy that turned out to apply to nothing, and the DNS fix that looked like it worked for a day."
read_time: 12
---

A credentialed vulnerability scan is worth several times an uncredentialed one. From outside, a scanner learns that port 445 answers. From inside, it learns that this machine is missing a specific update that was published in June. Getting inside a Windows machine remotely, reading its registry, its installed software and its patch level, requires membership of that machine's local **Administrators** group.

So the scanner needs administrative rights on nearly every host in the estate. The lazy way to arrange that is one line long: put the service account in Domain Admins and never think about it again. The credential then sits in a scanner's database, does not expire, and controls the forest.

This note is the other way. It is a chain of four pieces, each doing one job, and the useful property is that breaking any single link removes the access entirely.

## First, why not Nessus

Nessus Essentials was my first choice, purely because Tenable's interface is the one that turns up in job descriptions. I read the current terms on 8 September rather than trusting the write-ups: **five IP addresses, thirty-day licence**. Older posts still say sixteen addresses on a perpetual licence, which was true once.

![Tenable's current Nessus Essentials terms](/assets/posts/scan01-greenbone/scan-03-nessus-essentials-terms.png)

Five addresses cannot cover nine hosts, and coverage is most of what vulnerability management is. A licence that expires in a month cannot sustain the loop that makes scanning worth anything: scan, fix, scan again, show the finding closed. Greenbone Community Edition has no target limit and no expiry, so that is what runs on SCAN01.

It took about four hours and three separate failures to get the feeds in, which is a story about LVM, a half-written Postgres cluster and a manager that crashes if you open the web interface mid-load. That is in the runbook. What matters here is the end state.

![Greenbone reporting 186,567 vulnerability tests loaded](/assets/posts/scan01-greenbone/scan-08-gvmd-186567-vts-loaded.png)

One decision from the build is worth repeating, because it is an identity decision wearing a hypervisor costume. The lab's default is to run Linux services as containers. SCAN01 is a VM instead, because a scanner is a Tier 0 asset: it stores administrative credentials for every host it scans, so compromising it yields the estate. That earns a hardware isolation boundary rather than a shared kernel.

## The chain

Four pieces. An account, a group, a policy, and a scope.

![The four links that give the scanner local administrator rights](/assets/posts/scan01-greenbone/scan-identity-chain.svg)

The Domain Controllers organisational unit sits outside the link on purpose, and I will come back to why that is structural rather than a setting anyone can tick off by accident.

### The account

`svc-greenbone`, a non-human identity: an account belonging to software, with one purpose and a named human owner. Four settings on it are deliberate.

**User cannot change password: on.** A service account should never rotate its own credential. If it did, the copy stored in Greenbone would go stale, and an attacker holding the password could lock the owner out of their own scanner.

**Password never expires: on.** Chosen for availability, and recorded as a debt rather than a decision I am happy with. A scan credential that silently expires stops scanning, and nobody notices for a fortnight. It closes when Vault issues a short-lived credential per scan.

**Account is sensitive and cannot be delegated: on.** This is the important one and the creation wizard does not offer it. The account authenticates to nearly every member host. Without this flag, Kerberos delegation would let a compromised host reuse the scanner's ticket to reach other systems as the scanner.

**A description naming purpose, granting group and owner.** An account nobody can explain is an account nobody dares remove.

![The account settings read back from the directory](/assets/posts/scan01-greenbone/scan-13-svc-greenbone-verified.png)

I read those settings back out of the directory rather than trusting the boxes I had ticked. It is a two-line command and it has caught me before.

**Why a domain account and not a local one on each host.** Three reasons, and the third is the one I did not know before this build. A domain account is disabled, audited or rotated once, for every machine at the same moment. A local `scanner` account with the same password everywhere is the textbook lateral movement setup, which is the entire problem LAPS exists to solve. And Windows filters the administrative token of *local* accounts connecting over the network, through UAC remote restrictions, but does not filter domain accounts. A local account could not scan properly without first weakening a security setting to make it work.

### The group

`SG-Scanner-LocalAdmin`, holding exactly one member.

Rights go to groups, never to accounts. That sounds like bureaucracy until you need to answer "who can do this?" and the answer is one list you can read. It also means adding a second scanner, or swapping to Vault-issued accounts, changes a membership list and not a policy.

The group grants nothing by itself. It is a list of names, and it only carries power because the policy names it.

### The policy

Each Windows machine keeps its own local account database, which Active Directory cannot edit directly. A Group Policy object is how one instruction, written centrally, gets carried out by every machine on itself.

![The Group Policy item adding the group to local Administrators](/assets/posts/scan01-greenbone/scan-16-gpo-local-administrators-item.png)

Three fields in that screen decided how safe it is.

**Action: Update, not Replace.** Update adds the member and leaves everyone else alone. Replace deletes the group's membership and rebuilds it, which on a real estate removes administrators nobody meant to remove. This is why Group Policy Preferences is the right mechanism here and the older Restricted Groups is not: Preferences can add, Restricted Groups replaces.

**Administrators (built-in), chosen from the list rather than typed.** Picking it from the list stores the well-known identifier `S-1-5-32-544`, which is identical on every Windows installation in every language. A typed name breaks the first time the policy meets a non-English build.

**Both "delete all members" boxes clear.** Either one, ticked, removes every existing administrator on every machine in scope.

### The scope, which is the actual control

The policy is linked to the organisational unit holding member servers and workstations. It is not linked at the domain root, and never to the Domain Controllers unit.

The reason is what "local Administrators" means on each kind of machine. On a member server it governs that one machine. A domain controller has no local account database at all: its Administrators group is the domain's built-in Administrators, which is effectively control of the forest. The same instruction that makes the scanner an administrator of one application server would, on a domain controller, make a never-expiring credential in a scanner's database one of the most privileged objects in the directory.

Because domain controllers live in their own container, separate from the member units, linking the policy to the member units excludes them **structurally**. Not by a checkbox someone can untick, and not by a filter someone can widen. By where the link is.

That leaves an honest gap: how do you credential-scan a domain controller? You do not, cleanly. I cover it in layers instead. An unauthenticated scan still finds exposed services, weak TLS and patch levels that announce themselves on the wire. Wazuh's configuration assessment already runs CIS checks locally on that host through an agent that has the access anyway, so no new privilege is created. If full credentialed scanning of a controller ever becomes a requirement, it gets a separate vaulted account, a scheduled window, and an alert on every use.

## The policy that applied to nothing

Before going further I checked which machines the policy would actually reach.

![Get-ADComputer returning only the domain controller](/assets/posts/scan01-greenbone/dc-06-get-adcomputer-dc01-only.png)

One computer. The domain controller, sitting in the unit the policy deliberately excludes.

Every member machine had been joined to the old forest and lost its membership when I rebuilt the directory the week before, and none had rejoined. So the policy was correctly written, correctly linked, and applied to precisely zero machines. Silently, with nothing anywhere reporting a problem.

**A policy linked to an empty unit is not a control.** It is a document. The control exists when a real machine reports that it received the policy and the resulting state is visible on that machine.

So I built one. `WKS01` was pre-staged, meaning its computer account was created inside the target unit before the machine joined, so it lands inside the policy's scope from its first boot rather than in the default container, which is not an organisational unit and cannot receive a policy link.

## The detour: DNS that looked fixed

Before the join I checked the workstation's network settings and found DHCP on that segment handing out public resolvers and a leftover connection suffix from a personal domain. A domain join finds its controller through DNS. Against public resolvers it cannot find the domain at all. Every Windows machine placed on that segment would have failed the same way.

Fine: fix the scope, not the machine. I changed it in pfSense, renewed the lease, and the workstation reported the correct DNS server. Done.

It was not done. The connection suffix still read the old value.

That mismatch is the tell. Both values arrive in the same DHCP reply, so a correct server with a stale suffix means the reply was not the source of either. The correct-looking DNS server was the manual entry I had set on the adapter the day before while troubleshooting, and a manual setting survives a release and renew. The machine looked right while the network behind it had not changed at all.

Windows keeps the two stories in two places. `DhcpNameServer` is what the last DHCP reply contained. `NameServer` is what a person typed into the adapter, and it wins whenever it is present. Reading those settled it: the server really was still sending the old value.

The proof was in the daemon's own configuration file. pfSense saves interface changes into its configuration, but the DHCP daemon runs from a generated file, and on this build that file belongs to Kea. It was five days old and still listed public resolvers for every segment. The settings had been saved and never applied, so the daemon had never seen them.

![The regenerated DHCP configuration](/assets/posts/scan01-greenbone/net-06-kea-config-regenerated.png)

Regenerating it and restarting the service fixed the thing that was actually broken.

![The workstation taking both DNS settings from DHCP](/assets/posts/scan01-greenbone/sys-12-wks01-dns-and-suffix-from-dhcp.png)

The suffix is the half that proves it, because it can only have come from the reply. Then I cleared the manual override I had set during troubleshooting, which was harmless while it agreed with the scope and still wrong: a machine with a hand-set resolver ignores every later change to the scope, and nothing in the estate records that someone set it.

Two lessons, and I think the second is the more expensive one.

**Saved is not applied.** A setting can sit correctly in a console for days while the service runs from an older generated file. Check the file and its timestamp, not the form you filled in.

**Clear the workaround before you test the fix.** A manual override on a client hides a broken server perfectly. My first test passed and proved nothing.

One more detail worth stating, because it is a common and painful mistake: the scope hands out **one** DNS server, not the domain controller plus a public resolver as a fallback. Windows does not treat the second entry as a fallback. It will query whichever answers, and a public resolver knows nothing about an internal domain, so lookups fail intermittently. Intermittent is much harder to diagnose than broken.

## Proof on a real machine

With the workstation joined and inside scope, the policy could finally be checked where it counts.

![The group in the workstation's local Administrators](/assets/posts/scan01-greenbone/sys-06-wks01-local-administrators-proof.png)

The group is in the local Administrators list, placed there by the policy rather than by hand. Through it, the scanner account is an administrator of this machine and of nothing it has not been scoped to.

The same screen showed something I did not put there. `Domain Admins` is inserted into every member machine's local Administrators group automatically at the moment it joins. That is how domain administrators manage member machines, and it is exactly why tiered administration exists: any domain administrator who signs in to a workstation leaves a credential on it that controls the whole domain. Denying domain administrators every kind of logon to member machines is the standard countermeasure, and it is on my list rather than done.

## One door open, four closed

Membership makes the scanner an administrator, and an administrator may sign in to Windows every way it offers. The scanner needs exactly one of them.

![The five Windows logon types, four denied to the scanner](/assets/posts/scan01-greenbone/scanner-logon-rights.svg)

Every sign-in answers two separate questions. Whether the account is who it claims to be, which the domain controller settles by checking the password. And whether that account may sign in *this way on this machine*, which each machine settles from its own logon rights. A correct password still fails the second question if the door is closed.

The threat being addressed here is the scanner's own credential. It lives in a database and does not expire, so the design assumes it leaks. Without logon restrictions, a leaked scanner password is a console session, a Remote Desktop session, a scheduled task and a service on every member machine. With them, it is network access and nothing else.

Two rules shaped the settings. **Deny beats allow**, so the account keeps the administrator membership that scanning requires while losing every door it does not use. And **defining a right replaces it**: a user rights setting in a policy becomes the machine's entire list for that right, while a right left undefined keeps the machine's own value. So I exported the workstation's existing deny rights before defining anything, and found two already populated. Defining one of them with only the scanner group would have silently deleted an entry that was already there.

![The deny rights before and after the policy](/assets/posts/scan01-greenbone/sys-09-wks01-deny-rights-after.png)

Two deny rights became five. Four name the scanner group. The network logon right is deliberately left undefined, because that is the scanner's one working door and the machine's own entry should survive.

A configuration screen cannot prove a right is enforced, so I tried the closed door.

![Remote Desktop refused for the scanner account](/assets/posts/scan01-greenbone/sys-10-rdp-refused-svc-greenbone.png)

The account is an administrator of that machine. The password is correct. Windows refuses before a desktop appears and explains exactly why. Deny overrides both.

## What this does not solve

An administrator arriving over the network can still do real damage. These rights narrow what a stolen credential is worth; they do not neutralise it. Two things still owed: a Wazuh alert on any use of the scanner account outside a scan window, and Vault issuing a short-lived credential per scan so the non-expiring password stops being a standing exception.

There is also a retirement problem that is easy to miss. The mechanism that adds the group to Administrators leaves its change behind when the policy stops applying. Unlinking the policy does **not** remove the access. Retirement has to be ordered: disable the account first, delete the stored credential, flip the policy item from add to remove and let every machine refresh, and only then unlink and delete. Delete the group first and every machine is left with an unresolvable identifier in its Administrators list, which is exactly the kind of thing an auditor is right to flag.

Plan the removal when you plan the grant. That is the part I would have skipped a year ago.

## What I would tell myself at the start

- **Rights go to groups, and a grant should read as a chain.** If you cannot say which four things have to be true for this access to exist, you cannot revoke it confidently either.
- **Scope structurally, not by setting.** The domain controllers are excluded because of where the link is, not because of a box that is ticked.
- **A policy linked to an empty unit is not a control.** Prove it on a real machine before you write it up.
- **Read the machine's current list before a policy overwrites it.** Defining a right replaces it.
- **Saved is not applied, and a client-side workaround will fake a passing test.**
- **Try the closed door.** A screenshot of a setting is a claim. A refused sign-in is evidence.
