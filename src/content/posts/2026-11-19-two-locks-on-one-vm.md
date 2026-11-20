---
title: "Two Locks on One VM"
date: 2026-11-19
category: lab-notes
tags: [azure, az-104, rbac, least-privilege, entra-id, bicep]
description: "Azure's built-in role for looking after virtual machines holds 412 actions, delete included, and still cannot log in to one. I wrote a role with five actions, gave it to a test user, and tried everything it should and should not allow. Managing a machine and getting inside it turned out to be two separate locks, and a plain SSH key sits outside both."
read_time: 5
---

Someone on the team needs to start and stop virtual machines. The obvious thing to hand them is Azure's built-in role, **Virtual Machine Contributor**. It sounds right. It is also far more than the job needs, and, oddly, less than you might assume.

The fourth of my [Azure labs](/work/azure-labs/) took that role apart, wrote a smaller one, and then tried to break it from both sides.

<video controls muted loop playsinline preload="none" poster="/assets/work/azure-labs/lab04-two-planes-poster.jpg" width="1200" height="760" aria-label="Animation: five requests from a test user. Start is allowed, delete is denied, Entra SSH is denied and then allowed once User Login is added, and sudo is denied">
  <source src="/assets/work/azure-labs/lab04-two-planes.mp4" type="video/mp4" />
</video>

## Read the role before you assign it

Opened in the portal, Virtual Machine Contributor lists **412 actions**. The JSON view shows why: one line, `Microsoft.Compute/virtualMachines/*`. The wildcard means every VM action, including delete, and every action Microsoft adds later.

The same role has **zero data actions**. It can delete a machine, but it cannot log in to one. That gap is the whole lesson, and I will come back to it.

So I wrote a role from scratch with exactly five actions: read, start, deallocate, restart and power off. No write, no delete, no wildcard.

![The custom role Lab VM Operator in JSON: five actions on virtual machines and empty lists for notActions, dataActions and notDataActions.](/assets/posts/two-locks-on-one-vm/04-08-custom-role-json.png)

A role has two scopes that are easy to confuse. The **assignable scope** is where the role may be handed out: the menu. The **assignment scope** is where it actually is handed out: the gift. Mine was assignable across the subscription and assigned on one resource group only.

## The first lock: managing the machine

I created a test user, gave it the new role and nothing else, and signed in as that user in a private window.

**Start worked.** The machine came up. But look at the networking fields.

![The VM overview as the test user: the start command succeeded, and the public IP, private IP and virtual network fields all show a dash.](/assets/posts/two-locks-on-one-vm/04-15-operator-started-vm.png)

Every address shows a dash. The operator can see the machine but not where it lives, because the public IP, the private IP and the network are separate resources, and the role reads only the VM. Least privilege has a cost you can see, and it is worth knowing before a colleague asks why the portal looks broken.

**Delete was offered, then refused.** The portal still showed the Delete button and opened the confirmation dialog. Only when the request reached Azure did it fail.

![An error in the portal: the test user does not have authorization to perform the virtual machine delete action.](/assets/posts/two-locks-on-one-vm/04-17-delete-denied.png)

The portal is not the control. The check happens on the request, not on the menu, so a button being visible tells you nothing about whether it will work.

## The second lock: getting inside

Could the operator log in to the machine it was allowed to start? This is where the two planes separate.

Azure roles do not govern a plain SSH key at all. Anyone holding the private key gets in, whatever their role says. To bring logins under access control, the machine has to use Entra ID sign-in, and that needs two things in order: the VM gets an identity of its own, then the login extension is installed. I did them the wrong way round first, and the extension failed with *Managed System Identity is required*. The machine has to be someone before it can check who anyone else is.

With that in place:

- **With only the operator role:** permission denied. A role that manages the machine opens nothing inside it.
- **After adding Virtual Machine User Login**, a role with a single data action: signed in, as the Entra user, with no key file anywhere.
- **Then `sudo`:** refused.

![A terminal on the VM: sudo whoami answers that the user is not in the sudoers file.](/assets/posts/two-locks-on-one-vm/04-21-sudo-denied.png)

Logging in and being an administrator are different roles too. A shell takes User Login; `sudo` takes Administrator Login.

## Rebuilt as code

Role definitions live at the subscription, so the Bicep file deploys there and passes the assignment to a module scoped to the one resource group. Role names must be unique in a tenant, so the code's copy had to carry a different name while the portal's still existed. It deployed first time, and a check from the command line showed both roles holding the identical five actions.

## What I took from it

I predicted all four outcomes correctly before testing, and still learned four things I had not written down.

**Read the actions list, not the role name.** "Contributor" for one resource type sounds modest. One wildcard line made it 412 actions.

**Management and data are separate locks.** A role that can delete a machine cannot log in to it, and a role that can log in cannot delete it. Reviewing access means checking both, and remembering that a shared SSH key bypasses both.

**The interface is not the control.** The portal offered a button Azure refused, and showed dashes where the role could not read. Trust the refusal, not the screen.

**Narrow access shows.** The operator's view had gaps in it. That is the design working, and it is better explained in advance than discovered.

Every step, the role's JSON and the Bicep are in the [Lab 04 write-up](/work/azure-labs/04-custom-rbac-role/).
