## In plain words

The lab's company directory, the system that holds every account and group, was still named after a web domain that was being retired. I replaced it with a new directory named for the current brand by exporting the contents, rebuilding the server that runs it, and recreating the contents from the export. I then compared the export with the result to confirm the rebuilt directory matched.

## What I did, step by step

1. Chose a full rebuild over a rename, because the small directory could be exported to files and replayed as a script.
2. Exported the organisational units, users and group memberships to files and copied them off the machine.
3. Demoted the domain controller to a standalone server, then promoted it as the first controller of the new directory.
4. Recovered from a password lockout by resetting the administrator password offline, at the console, from installation media (Figure 8.2).
5. Recreated the organisational units and users from the export, giving each account a temporary password to change at first sign-in (Figure 8.3).
6. Restored the twelve security groups and their members under the new directory (Figure 8.4).
7. Compared the export with the result: user counts and group membership counts matched, group for group (Figure 8.5).

## The background

Biira Bank's public brand moved to `biirabank.com` while its Active Directory forest was still called `ad.biira.online`, after a domain that was being retired. I replaced it with a new forest, `corp.biirabank.com` (NetBIOS `CORP`), by taking the existing domain controller down to a standalone server, promoting it again as the first controller of the new forest, and recreating the directory from an export.

## Why a rebuild and not a rename

There were three options:

1. **Add a UPN suffix only.** Five minutes and no downtime, but the forest keeps a name tied to a domain no longer owned.
2. **Rename the forest with `rendom`.** Supported, but a multi-stage procedure that reboots every controller and every member twice, with no clean rollback if a stage fails.
3. **Demote and repromote into a new forest**, then replay the contents from an export.

I chose the third. The directory held roughly 35 accounts, 21 organisational units and a set of groups, all of which export to CSV and replay as a script.

The new forest is `corp.biirabank.com` and not a flat `biirabank.com`. A domain controller becomes the DNS authority for its own name, so the flat name would have made it authoritative for the public zone and broken the public website from inside the lab. Staff still sign in as `name@biirabank.com` through a UPN suffix.

The hardware did not change. Figure 8.1 shows the same controller on the old forest, just after it took the name DC01, with its DNS tests passing.

![A PowerShell session on the domain controller: Netlogon restarted, then dcdiag /test:dns passing for DC01 and for the old forest](../../assets/work/enterprise-security-homelab/dc-01-rename-to-dc01.png)

*Figure 8.1: The same controller on the old forest, just after it took the name DC01: Netlogon restarted and its DNS tests passing.*

## Export first, then demote and promote

The export is the only irreversible moment, so it came first. Organisational units, users and group memberships went to CSV files and were copied off the machine.

The demotion refused at first, because the controller was the last DNS server for an AD-integrated reverse lookup zone. That is a safety check, not a failure: the zone goes with the domain, so I added the documented flag and ran it again. The server rebooted as a standalone workgroup machine. When the first controller of a new forest is promoted, the local Administrator account is carried up to become the domain Administrator, keeping its password.

## The lockout

After the promotion reboot, the sign-in screen rejected the password I expected. I had set it over a Remote Desktop session, where a symbol was transmitted under one keyboard layout and typed back under another, so the stored value did not match what I was typing. The sign-in also showed a longer string than the password I had set, which pointed to a mismatch rather than a forgotten password.

Remote Desktop could not fix it, because every reset method needs console access. With a physical screen and keyboard attached, I booted the server from Windows Server installation media and reset the local Administrator password offline. Afterwards Server Manager showed AD DS, DNS and File and Storage Services all manageable on the new forest, as Figure 8.2 shows. It is in the runbook as an incident, not quietly fixed.

![Server Manager on the rebuilt controller at 192.168.50.2, with the AD DS, DNS and File and Storage Services tiles showing green manageability](../../assets/work/enterprise-security-homelab/dc-02-server-manager-corp-biirabank.png)

*Figure 8.2: Server Manager after the recovery: AD DS, DNS and File and Storage Services all report as manageable. The promotion had completed and the lockout was resolved without data loss.*

## Rebuilding the directory, and checking it

The new forest starts empty. I added the `biirabank.com` UPN suffix, then recreated the organisational units top down. Users were recreated from the export, filtered to the `BIIRA` tree so the built-in accounts were not touched, and each was placed back in its original unit. Every account received a temporary password that must be changed at first logon, because passwords are not exported and must not be. Figure 8.3 shows the rebuild as it ran.

![A PowerShell session creating the organisational unit tree under BIIRA, then recreating the users from export-users.csv with a hidden temporary password, ending with a count of the accounts](../../assets/work/enterprise-security-homelab/dc-03-directory-rebuild-ous-users.png)

*Figure 8.3: The organisational unit tree and the user accounts recreated on `corp.biirabank.com` from the exported CSV files, ending with the account count.*

I verified the rebuild by comparing the source data with the result, not by trusting the run:

| Check | Exported | Rebuilt |
|---|---:|---:|
| User accounts under the `BIIRA` tree | 32 | 32 |
| Members of the six departmental groups | 25 | 25 |
| Members of the three tiered administration groups | 7 | 7 |

Twenty organisational units and twelve security groups were restored, and the membership counts matched the export group for group. The Tier 0 administrators group holds one account and the MFA exemption group is empty, which is what both should look like.

Figure 8.4 shows the twelve groups in the new forest, and Figure 8.5 the membership counts taken from the export file.

![Active Directory Users and Computers on corp.biirabank.com listing twelve security groups with the SG- prefix under the SecurityGroups unit](../../assets/work/enterprise-security-homelab/dc-04-security-groups-rebuilt.png)

*Figure 8.4: The twelve security groups restored under the SecurityGroups unit, in three families: departmental, tiered administration and Okta integration.*

![PowerShell counting members per group from export-group-members.csv: ten groups, from 1 member in the Tier 0 group to 25 in the all-users group](../../assets/work/enterprise-security-homelab/dc-05-group-membership-verified.png)

*Figure 8.5: Membership counts derived from the export file, which the rebuilt directory matched group for group. The two groups absent from this list are the two that were empty before the migration.*

## What I took from it

Set a password that will be typed at a console with simple, layout-safe characters, or set it at the console itself. A control is only in place when a login proves it, not when the tool reports success. And export before the step that cannot be undone: that is why the lockout cost time and not data.

The full runbook, with every command, is [chapter 17 in the repository](https://github.com/noble-antwi/enterprise-security-homelab/blob/main/docs/17-domain-migration-corp-biirabank.md).
