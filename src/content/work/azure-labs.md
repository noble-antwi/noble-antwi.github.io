---
title: "Azure Labs: Built Twice, Portal Then Bicep"
kicker: "Cloud · Azure · Built twice"
summary: "Twenty hands-on Azure labs, each built twice: first by hand in the portal to see what the service really does, then from scratch as Bicep, and compared. Every lab starts with predictions written down before anything is created."
category: cloud
status: active
statusLabel: "4 of 20 labs built"
order: 27
period: "October 2026 to present"
role: "Build, break, rebuild as code, document"
repo: https://github.com/noble-antwi/azure-labs
docs: https://github.com/noble-antwi/azure-labs
docsLabel: "Lab write-ups"
stack: ["Azure Policy", "Resource locks", "Managed identity", "Azure RBAC", "Bicep", "Azure CLI", "what-if", "Activity log", "Blob Storage tiers", "Lifecycle management", "Event Grid", "Logic Apps", "Data-plane RBAC", "User delegation SAS", "Cost Management", "Virtual machines", "Network security groups", "Run Command", "Custom RBAC roles", "Entra SSH login"]
relatedTags: ["az-104", "bicep", "azure-policy"]
stats: []
gallery:
  - src: ../../assets/work/azure-labs/lab01-architecture.png
    alt: "Lab 01 architecture: four policy assignments, P1 Modify and P2 to P4 Deny, a managed identity for P1, the resource group with its tags and a CanNotDelete lock, the networks created before and after the policies, and a West US network that was never created"
    caption: "Lab 01 as built: P1 to P3 on the resource group, P4 on the subscription, a delete lock on the group. The faded network in West US was refused by P4 and never existed."
    group: "Lab 01 · Governance and tagging"
  - src: ../../assets/work/azure-labs/01-35-activity-log-modify-then-deny.png
    alt: "Azure Activity log showing a Modify policy action followed by a deny policy action on the same request"
    caption: "The answer to question 3, in Azure's own log: on every request, Modify runs first and the Deny rules check what it produced."
    group: "Lab 01 · Governance and tagging"
  - src: ../../assets/work/azure-labs/01-26-control-deployment-failed.png
    alt: "A failed deployment in the Azure portal: the control network, created with P1 switched to Do not enforce, refused by P2"
    caption: "The control test. With P1 switched to Do not enforce, P2 refuses the same untagged network that P1 had just rescued."
    group: "Lab 01 · Governance and tagging"
  - src: ../../assets/work/azure-labs/01-21-p2-test-validation-passed.png
    alt: "The portal's Validation passed banner on a deployment that Azure Policy later refused"
    caption: "Validation passed is not Policy's verdict. Policy runs when the request reaches Azure Resource Manager, after this screen."
    group: "Lab 01 · Governance and tagging"
  - src: ../../assets/work/azure-labs/01-45-p4-test-deployment-failed.png
    alt: "A deployment to West US refused by the Allowed locations policy assigned to the subscription"
    caption: "P4 at subscription scope: a network in West US, owner tag and all, refused before it existed."
    group: "Lab 01 · Governance and tagging"
  - src: ../../assets/work/azure-labs/01-51-remediation-blocked-by-p3.png
    alt: "A remediation task for P1 failing with PolicyRemediationFailure because the update it sends is refused by P3"
    caption: "The surprise of the lab. A remediation is an ordinary update, so every Deny rule still checks it: P3 blocked P1's fix until the owner tag was added by hand."
    group: "Lab 01 · Governance and tagging"
  - src: ../../assets/work/azure-labs/01-58-lock-blocks-delete.png
    alt: "Azure refusing to delete a virtual network because of a CanNotDelete lock on its resource group"
    caption: "A delete lock beats permissions: an Owner cannot delete under it. It stops deletion and nothing else."
    group: "Lab 01 · Governance and tagging"
  - src: ../../assets/work/azure-labs/01-43-compliance-all-four.png
    alt: "Azure Policy compliance view listing the four assignments and their compliance state"
    caption: "All four rules assigned and evaluated. Old resources are reported within minutes, and changed only on their next update."
    group: "Lab 01 · Governance and tagging"
  - src: ../../assets/work/azure-labs/01-64-iac-remediation-nothing-left.png
    alt: "A re-run of the remediation task after the Bicep deployment finding zero resources left to fix"
    caption: "After the Bicep rebuild: the remediation re-run finds nothing left to fix. P1 had already put costCenter back inside the redeploy itself."
    group: "Lab 01 · Governance and tagging"
  - src: ../../assets/work/azure-labs/lab02-architecture.png
    alt: "Lab 02 architecture: a storage account with key access off, a private container holding one file per tier, two lifecycle rules, a Storage Blob Data Reader assignment, and Event Grid feeding a Logic App that pushes phone alerts"
    caption: "Lab 02 as built: one file per tier, two lifecycle rules, master keys switched off, one data role on one container, and every tier change routed through Event Grid and a Logic App to a phone."
    group: "Lab 02 · Storage tiers"
  - src: ../../assets/work/azure-labs/02-15-archive-not-permitted.png
    alt: "The portal refusing to open report-archive.txt: this operation is not permitted on an archived blob"
    caption: "Archive is offline, not slow. The file is there and billed, but cannot be opened or downloaded until it is brought back to an online tier."
    group: "Lab 02 · Storage tiers"
  - src: ../../assets/work/azure-labs/02-21-both-rehydrating.png
    alt: "Two archived files both showing Archive (rehydrating to Hot), one at High priority and one at Standard"
    caption: "Both archived files on their way back to Hot, started 20 seconds apart. High priority was online in about 37 minutes; Standard took about 3 hours 15 minutes for the same 150-byte file."
    group: "Lab 02 · Storage tiers"
  - src: ../../assets/work/azure-labs/02-49-phone-archive-skipped.png
    alt: "Phone alerts of daily lifecycle runs, one with every count at zero"
    caption: "The seven-day wall, as it arrived on the phone: the run that should have archived three files moved nothing. A hidden condition was waiting for seven days after the last tier change."
    group: "Lab 02 · Storage tiers"
  - src: ../../assets/work/azure-labs/02-50-phone-cold-to-archive.png
    alt: "Phone alerts showing lc-1, lc-2 and lc-3 moving Cold to Archive by SetBlobTier, after the daily run summary"
    caption: "With the condition removed from the demo rule, the next run archived all three, through the same SetBlobTier call a person uses in the portal. Five daily runs instead of three."
    group: "Lab 02 · Storage tiers"
  - src: ../../assets/work/azure-labs/02-39-owner-cannot-read-data.png
    alt: "The tiers container listing nothing for the subscription Owner, with a message that the user account has no permission to list the data"
    caption: "Master keys switched off: the subscription Owner cannot list a single file. Owner manages the account; reading its data needs a separate data role."
    group: "Lab 02 · Storage tiers"
  - src: ../../assets/work/azure-labs/02-46-sas-tampered-refused.png
    alt: "A browser showing AuthenticationFailed: signature did not match, for a SAS URL with one character changed"
    caption: "A one-hour, read-only user delegation SAS opened the file with no sign-in. Change one character of its signature and it is refused, so the only lever a holder has is waiting for it to expire."
    group: "Lab 02 · Storage tiers"
  - src: ../../assets/work/azure-labs/02-52-cost-by-meter-chart.png
    alt: "Cost Management chart for the lab's resource group, accumulated cost grouped by meter, flat until 31 October and then climbing to about one cent"
    caption: "Lab 02's whole bill, about 1.2 cents. The dark band is one High-priority rehydration; the light band underneath is the Logic App sending the phone alerts, which came to about half the total."
    group: "Lab 02 · Storage tiers"
  - src: ../../assets/work/azure-labs/lab03-architecture.png
    alt: "Lab 03 architecture: one VM in a subnet with its network interface, network security group, OS disk, static public IP, temporary disk and auto-shutdown schedule, each marked as free or still billing while deallocated"
    caption: "Lab 03 as built: one VM is seven resources. Deallocated, the OS disk and the public IP keep billing, and the temporary disk is wiped."
    group: "Lab 03 · A virtual machine, taken apart"
  - src: ../../assets/work/azure-labs/03-02-rg-seven-resources.png
    alt: "The resource group listing seven resources for one VM: the virtual machine, its disk, network interface, public IP address, network security group, virtual network and a shutdown schedule"
    caption: "Seven resources for one VM, once hidden types are shown. Deleting the VM alone leaves six of them behind."
    group: "Lab 03 · A virtual machine, taken apart"
  - src: ../../assets/work/azure-labs/03-06-status-stopped-not-deallocated.png
    alt: "The VM overview after a shutdown from inside Linux, with Status showing Stopped"
    caption: "After shutting down from inside Linux: Stopped, not Stopped (deallocated). The server is still reserved and compute is still billed."
    group: "Lab 03 · A virtual machine, taken apart"
  - src: ../../assets/work/azure-labs/03-07-stop-deallocate-prompt.png
    alt: "The portal's Stop prompt: deallocating stops the charges for compute, while storage and networking continue to be charged"
    caption: "Azure's own Stop prompt answers the billing question: compute charges stop, storage and networking continue."
    group: "Lab 03 · A virtual machine, taken apart"
  - src: ../../assets/work/azure-labs/03-10-proof-after-restart.png
    alt: "Run Command output after a deallocate and start: the file on the OS disk prints, the file on the temporary disk returns No such file or directory"
    caption: "After a deallocate and a start: the file on the OS disk survived, the file on the temporary disk did not. Never keep data on /mnt."
    group: "Lab 03 · A virtual machine, taken apart"
  - src: ../../assets/work/azure-labs/lab04-architecture.png
    alt: "Lab 04 architecture: two custom role definitions at the subscription, three role assignments for one test user on one resource group, the VM with its own identity, and the result of each test"
    caption: "Lab 04 as built: a five-action role defined at the subscription and assigned on one resource group, tested on the management plane and the data plane."
    group: "Lab 04 · A custom role, on both planes"
  - src: ../../assets/work/azure-labs/04-08-custom-role-json.png
    alt: "The custom role Lab VM Operator in JSON: five actions on virtual machines, read, start, deallocate, restart and powerOff, with no data actions"
    caption: "The whole role: five actions, no write, no delete, no wildcard. Virtual Machine Contributor holds 412."
    group: "Lab 04 · A custom role, on both planes"
  - src: ../../assets/work/azure-labs/04-15-operator-started-vm.png
    alt: "The VM overview as the test user: the start command succeeded, and the public IP, private IP and virtual network fields all show a dash"
    caption: "Least privilege, felt. The operator started the VM, but its addresses show a dash: they live on other resources the role cannot read."
    group: "Lab 04 · A custom role, on both planes"
  - src: ../../assets/work/azure-labs/04-17-delete-denied.png
    alt: "An error in the portal: the test user does not have authorization to perform the virtual machine delete action"
    caption: "The portal offered Delete and Azure refused it. The check happens on the request, not on the menu."
    group: "Lab 04 · A custom role, on both planes"
---

## Why build everything twice

Clicking through the portal is the fastest way to learn what a setting does. It is also impossible to repeat exactly, review, or keep in Git. Code is the opposite: repeatable and reviewable, but easy to write without understanding what it creates.

So every lab here is built twice. First by hand, with predictions written down before anything is created and something broken on purpose. Then from scratch as Bicep, deployed to a clean resource group, and compared with what the portal built. The differences between the two are usually where the lesson is.

Each lab follows the same five steps: build it in the portal, break something deliberately, export what Azure created, write the Bicep and deploy it, then write up the findings and tear everything down. Every resource carries `environment`, `purpose`, `lab` and `autoDelete` tags, and a script checks for anything left running.

<section class="lab-sec" id="lab-01">
<div class="lab-band"><span class="lab-no">Lab 01</span><span class="pill pill-ok">Built twice</span><a href="https://github.com/noble-antwi/azure-labs/tree/master/01-governance-tagging" target="_blank" rel="noopener">Full write-up ↗</a></div>

## Governance and tagging

Three questions, each with a prediction written before the build:

| Question | Prediction | What happened |
|---|---|---|
| Do resource group tags flow down to the resources inside? | No | Correct. A network created in a group with six tags carried none. Inheritance takes a policy, one per tag name. |
| What happens to resources that existed before a policy? | Left alone | Half right. Not changed, but reported non-compliant within minutes, and fixed only by a remediation task. |
| If one policy adds a tag and another denies resources missing it, which wins? | The one that adds | Correct, and proven both ways. Modify runs before Deny; with the Modify rule switched off, the Deny rule refused the same request. |

Four built-in policies made the test: **P1** inherits `costCenter` from the group (Modify), **P2** requires `costCenter` (Deny), **P3** requires `owner` (Deny), and **P4** allows East US only, assigned to the whole subscription. A `CanNotDelete` lock sat on the group.

### Broken on purpose

| Attempt | Result | Refused by |
|---|---|---|
| A network with no tags, P1 and P2 on | Created, `costCenter` added | nothing |
| The same, P1 switched to *Do not enforce* | Refused | P2 |
| A network with no `owner` tag | Refused | P3 |
| A network in West US | Refused | P4 |
| A remediation task fixing an old network | Failed | P3, because a remediation is just another update |
| Adding a tag to a network with no owner | Refused | P3, not the lock |
| Deleting a network under the lock | Refused | the lock |

The remediation failure was the finding worth the lab. A remediation task applies a Modify rule by sending an ordinary update, and every Deny rule still checks that update. Adding the missing `owner` tag by hand let P1 add `costCenter` in the same request.

### Rebuilt as code

The portal export was the first lesson: it held only the networks. Policy assignments and locks are extension resources, attached *to* the group rather than *in* it, so an exported template is not a backup of a group's governance.

The Bicep rebuild deploys at subscription scope: the group and P4 from `main.bicep`, everything inside the group from a module. Built-in policy and role IDs are looked up, never remembered, and looking them up caught a wrong one. `what-if` listed eight creates and no changes; the deployment took ten seconds. Three things only the code build showed:

- **Rules and resources in one deployment race.** A network created seconds after its rules came out untagged and unrefused, because neither rule had taken effect yet. Rules belong in their own deployment, before the resources they govern.
- **Tag Contributor is enough.** The portal quietly gave P1's managed identity Contributor. In code the role assignment is its own resource, and the narrow Tag Contributor role did the job, proven by the Activity log.
- **Redeploying re-runs Modify.** A second deployment sent the network's tags as owner only, and P1 put `costCenter` back inside that same request.

<p class="lab-more"><a href="#evidence-lab-01">Screenshots from this lab ↓</a><a href="https://github.com/noble-antwi/azure-labs/tree/master/01-governance-tagging" target="_blank" rel="noopener">Every step, in the repository ↗</a></p>

</section>

<section class="lab-sec" id="lab-02">
<div class="lab-band"><span class="lab-no">Lab 02</span><span class="pill pill-ok">Built twice</span><a href="https://github.com/noble-antwi/azure-labs/tree/master/02-storage-tiers" target="_blank" rel="noopener">Full write-up ↗</a></div>

## Storage tiers

Blob Storage keeps files in four tiers. The colder the tier, the cheaper it is to keep a file and the dearer it is to read it back, and Archive is so cold the file goes offline. One file went into each tier, two more were archived to time the way back, and three were left for a lifecycle rule to walk down the tiers on its own.

| Question | Prediction | What happened |
|---|---|---|
| What does it take to open an archived file? | It steps back through Cold and Cool to Hot first | Half right. It cannot be read at all until it is rehydrated, but it goes straight to any online tier. High priority took about **37 minutes**, Standard about **3 hours 15 minutes**, for the same 150-byte file. |
| Once the master keys are off, can the Owner read the files? | No | Correct. Owner manages the account; reading what is in it needs a separate data role. |
| What does each tier cost, and what does leaving one early cost? | Cool is cheapest overall; an early move costs a day | Keeping kilobytes cost nothing measurable in any tier; every cent came from reading, writing and rehydrating. Leaving early was the wrong way round: you pay for the days you did not stay. Nothing was blocked, and a **Cold LRS Early Delete** line appeared for leaving Cold after 3 of its 90 days. |

**Every tier change on a phone.** The storage account publishes an event for each tier change and each daily lifecycle run. Event Grid routes them to a Logic App, which formats a one-line alert, such as `lc-1.txt: Cold -> Archive (by SetBlobTier)`, and pushes it to a phone. The trigger first failed without a word: the `Microsoft.EventGrid` resource provider had never been registered on the subscription. Registering it and publishing again created the subscription.

**The seven-day wall.** A fast lifecycle rule was meant to move three files to Cool after one day, Cold after two and Archive after three. Cool and Cold arrived on schedule; Archive did not. The rule's JSON held a condition the form had not shown: the portal's *skip blobs rehydrated in the last 7 days* box, on by default, adds `daysAfterLastTierChangeGreaterThan: 7`, and it counts any tier change, not only a rehydration. Removed from the demo rule only, the next run archived all three, five days in instead of three. Written up in [The Seven-Day Wall](/lab-notes/2026/11/06/the-seven-day-wall.html).

**Keys off, least privilege on.** The portal had been reading the files with the account's master key the whole time. With key access disabled, the subscription Owner could not list a single file. Storage Blob Data Reader, on the one container and for the one user, restored reading and nothing else: upload was refused. Sharing still worked without the key: a one-hour, read-only user delegation SAS, signed through Entra ID, opened the file in a private browser window, and changing one character of its signature was refused.

<video controls muted loop playsinline preload="none" poster="/assets/work/azure-labs/lab02-tier-flow-poster.jpg" width="1200" height="760" aria-label="Animation: a file moving from Hot to Cool, Cold and Archive under a lifecycle rule, rehydrating back, with each tier change sent to a phone">
  <source src="/assets/work/azure-labs/lab02-tier-flow.mp4" type="video/mp4" />
</video>

**The bill, by meter.** Twelve days of the lab cost about **1.2 cents**. Cost analysis shows every line as less than a cent, so the exact figures came from the Cost Management query API, grouped by meter. No line for stored data appeared in any tier. One High-priority rehydration of a 150-byte file cost half a cent, almost as much as all other storage activity combined. And the Logic App sending the phone alerts was about half the bill, more than the storage it was watching. Written up in [The Alert Was the Expensive Part](/lab-notes/2026/11/14/the-alert-was-the-expensive-part.html).

**Rebuilt as code.** About 120 lines of Bicep rebuild the storage account, the container, both lifecycle rules and the one data role. The lifecycle rules were copied from Code View, hidden seven-day condition included. The deployment took **26 seconds**, and read-back checks matched the portal build setting for setting. The alert pipeline was left out on purpose, and the reader's identity is passed at deploy time, so no identifier sits in the repository. Both resource groups were then deleted.

<p class="lab-more"><a href="#evidence-lab-02">Screenshots from this lab ↓</a><a href="https://github.com/noble-antwi/azure-labs/tree/master/02-storage-tiers" target="_blank" rel="noopener">Every step, in the repository ↗</a></p>

</section>

<section class="lab-sec" id="lab-03">
<div class="lab-band"><span class="lab-no">Lab 03</span><span class="pill pill-ok">Built twice</span><a href="https://github.com/noble-antwi/azure-labs/tree/master/03-vm-deep-dive" target="_blank" rel="noopener">Full write-up ↗</a></div>

## A virtual machine, taken apart

A virtual machine looks like one thing in the portal, but Azure builds it from separate resources, each billed and deleted on its own terms. The third lab built one small Linux VM with no inbound ports open, managed it through Run Command instead of SSH, and tested the two ways of turning it off: shutting down inside Linux, and deallocating in Azure.

| Question | Prediction | What happened |
|---|---|---|
| What is a VM made of, and what still costs money when it is off? | The OS disk and the public IP keep billing | Right. "One VM" is **seven resources**. Deallocated, the OS disk and the static public IP keep billing; the other five cost nothing. |
| Is shutting down inside the OS the same as stopping it in Azure? | Yes, it stops the compute charge | Wrong. The portal showed **Stopped**, not *Stopped (deallocated)*. The server is still reserved, so compute keeps billing. Only Azure can deallocate. |
| What survives a deallocate? | The OS disk file is lost, the temp disk file is lost, the public IP stays, the private IP changes | Two of four. The OS disk file survived and the temp disk file did not. Both addresses stayed, because they belong to the network interface and the public IP resource, not to the server. |

<video controls muted loop playsinline preload="none" poster="/assets/work/azure-labs/lab03-vm-states-poster.jpg" width="1200" height="760" aria-label="Animation: a VM running, shut down inside the OS, deallocated and started again, showing what bills and what survives at each step">
  <source src="/assets/work/azure-labs/lab03-vm-states.mp4" type="video/mp4" />
</video>

**The quota wall.** The cheap burstable size was listed but greyed out: the subscription's quota for that family was 0 vCPUs. The automatic increase was refused, and a support request was approved a day later. Quota is a ceiling on how many vCPUs of a family can run at once, it costs nothing to hold, and a low one is a guardrail.

**The portal can keep a default without saying so.** A size chosen on the create form did not stick, and the VM deployed with the portal's default. It cost the same per hour and had the temporary disk the test needed, so it stayed. The lesson is to read the size on the Review page, not the Basics tab.

**A public IP is an address, not an open door.** With no inbound rule, SSH timed out: the default rules dropped the packets before they reached anything. One rule allowing TCP 22 from one address fixed it.

**Rebuilt as code.** The Bicep file builds the same seven resources, with the SSH public key and the allowed address passed at deploy time so nothing personal sits in the repository. It deployed first time, SSH worked straight away because the rule was part of the template, and the VM again took `10.30.0.4`, the first free address in the subnet. The copy was deleted once verified. The bill is still to come, and the portal build stays deallocated until it is read.

The sentence to keep: *a stopped VM is not a free VM until Azure says "deallocated".*

<p class="lab-more"><a href="#evidence-lab-03">Screenshots from this lab ↓</a><a href="https://github.com/noble-antwi/azure-labs/tree/master/03-vm-deep-dive" target="_blank" rel="noopener">Every step, in the repository ↗</a></p>

</section>

<section class="lab-sec" id="lab-04">
<div class="lab-band"><span class="lab-no">Lab 04</span><span class="pill pill-ok">Built twice</span><a href="https://github.com/noble-antwi/azure-labs/tree/master/04-custom-rbac-role" target="_blank" rel="noopener">Full write-up ↗</a></div>

## A custom role, tested on both planes

Built-in roles are broad. Virtual Machine Contributor, the obvious choice for someone who looks after VMs, holds 412 actions behind one wildcard line, delete included, and no data actions at all: it can delete a VM but cannot log in to it. The fourth lab wrote a role with only the five actions an operator needs (read, start, deallocate, restart and power off), gave it to a test user on one resource group, and tried everything the role should and should not allow. It reused the lab 03 VM.

| Question | Prediction | What happened |
|---|---|---|
| Can a Virtual Machine Contributor delete a VM? | Yes | Right. `virtualMachines/*` covers delete. |
| With only start and stop actions, what happens on Delete? | A permission error | Right. The portal still offered the button and the dialog; Azure refused the request. |
| Does a management-plane role let someone log in to the VM? | No | Right. Entra SSH was refused until Virtual Machine User Login, a role with one data action, was added. |
| Does a User Login role give `sudo`? | No | Right. *Not in the sudoers file.* That takes Virtual Machine Administrator Login. |

<video controls muted loop playsinline preload="none" poster="/assets/work/azure-labs/lab04-two-planes-poster.jpg" width="1200" height="760" aria-label="Animation: five requests from the test user. Start is allowed, delete is denied, Entra SSH is denied and then allowed once User Login is added, and sudo is denied">
  <source src="/assets/work/azure-labs/lab04-two-planes.mp4" type="video/mp4" />
</video>

**Least privilege has a visible cost.** The operator could start the VM but saw a dash where its addresses should be, because the public IP, the private IP and the network are separate resources the role cannot read.

**The portal shows buttons it will not honour.** Delete was offered, the dialog opened, and Azure refused the call. The check is on the request, not the menu.

**Two planes, two locks.** A role that can delete a VM cannot log in to it, and a role that can log in cannot delete it. A plain SSH key sits outside both, so the VM was given its own identity and the Entra login extension, which lets Entra decide who gets a shell. The extension failed until the identity existed.

**Rebuilt as code.** Role definitions live at the subscription, so the Bicep file deploys there and hands the assignment to a module scoped to the one resource group. Role names must be unique in a tenant, so the code's copy carries its own name. It deployed first time, and both roles hold the identical five actions.

The sentence to keep: *read the actions list, not the role name.*

<p class="lab-more"><a href="#evidence-lab-04">Screenshots from this lab ↓</a><a href="https://github.com/noble-antwi/azure-labs/tree/master/04-custom-rbac-role" target="_blank" rel="noopener">Every step, in the repository ↗</a></p>

</section>

<section class="lab-sec" id="lab-05">
<div class="lab-band"><span class="lab-no">Lab 05</span><span class="pill pill-warn">Running</span><a href="https://github.com/noble-antwi/azure-labs/tree/master/05-entra-users-groups" target="_blank" rel="noopener">Full write-up ↗</a></div>

## Entra ID users and groups at scale

The fifth lab moves from one test user to many: users created in bulk, guests invited, and groups filled by dynamic membership rules and used for licensing, with one question to answer: where do dynamic rules lag? The build is under way.

<p class="lab-more"><a href="https://github.com/noble-antwi/azure-labs/tree/master/05-entra-users-groups" target="_blank" rel="noopener">Follow the build in the repository ↗</a></p>

</section>
