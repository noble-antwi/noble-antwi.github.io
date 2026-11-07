---
title: "Azure Labs: Built Twice, Portal Then Bicep"
kicker: "Cloud · Azure · Built twice"
summary: "Hands-on Azure labs, each built twice: by hand in the portal to see what the service really does, then from scratch as Bicep and compared. Lab 01 tested four Azure Policy rules and a delete lock until they broke, then rebuilt them as code in ten seconds. Lab 02 walked files down the storage tiers into Archive and back, with a phone alert on every move, and switched the account's master keys off. Lab 03, a virtual machine taken apart, is under way."
category: cloud
status: active
statusLabel: "2 of 20 labs built"
order: 27
period: "October 2026 to present"
role: "Build, break, rebuild as code, document"
repo: https://github.com/noble-antwi/azure-labs
docs: https://github.com/noble-antwi/azure-labs
docsLabel: "Lab write-ups"
stack: ["Azure Policy", "Resource locks", "Managed identity", "Azure RBAC", "Bicep", "Azure CLI", "what-if", "Activity log", "Blob Storage tiers", "Lifecycle management", "Event Grid", "Logic Apps", "Data-plane RBAC", "User delegation SAS"]
relatedTags: ["az-104", "bicep", "azure-policy"]
stats:
  - { value: "4", label: "Policy rules tested to failure" }
  - { value: "37 min", label: "Archive back to Hot, High priority" }
  - { value: "10 s", label: "To rebuild lab 01 as Bicep" }
  - { value: "2 / 20", label: "Labs built" }
gallery:
  - src: ../../assets/work/azure-labs/lab02-architecture.png
    alt: "Lab 02 architecture: a storage account with key access off, a private container holding one file per tier, two lifecycle rules, a Storage Blob Data Reader assignment, and Event Grid feeding a Logic App that pushes phone alerts"
    caption: "Lab 02 as built: one file per tier, two lifecycle rules, master keys switched off, one data role on one container, and every tier change routed through Event Grid and a Logic App to a phone."
  - src: ../../assets/work/azure-labs/02-15-archive-not-permitted.png
    alt: "The portal refusing to open report-archive.txt: this operation is not permitted on an archived blob"
    caption: "Archive is offline, not slow. The file is there and billed, but cannot be opened or downloaded until it is brought back to an online tier."
  - src: ../../assets/work/azure-labs/02-21-both-rehydrating.png
    alt: "Two archived files both showing Archive (rehydrating to Hot), one at High priority and one at Standard"
    caption: "Both archived files on their way back to Hot, started 20 seconds apart. High priority was online in about 37 minutes; Standard took about 3 hours 15 minutes for the same 150-byte file."
  - src: ../../assets/work/azure-labs/02-49-phone-archive-skipped.png
    alt: "Phone alerts of daily lifecycle runs, one with every count at zero"
    caption: "The seven-day wall, as it arrived on the phone: the run that should have archived three files moved nothing. A hidden condition was waiting for seven days after the last tier change."
  - src: ../../assets/work/azure-labs/02-50-phone-cold-to-archive.png
    alt: "Phone alerts showing lc-1, lc-2 and lc-3 moving Cold to Archive by SetBlobTier, after the daily run summary"
    caption: "With the condition removed from the demo rule, the next run archived all three, through the same SetBlobTier call a person uses in the portal. Five daily runs instead of three."
  - src: ../../assets/work/azure-labs/02-39-owner-cannot-read-data.png
    alt: "The tiers container listing nothing for the subscription Owner, with a message that the user account has no permission to list the data"
    caption: "Master keys switched off: the subscription Owner cannot list a single file. Owner manages the account; reading its data needs a separate data role."
  - src: ../../assets/work/azure-labs/02-46-sas-tampered-refused.png
    alt: "A browser showing AuthenticationFailed: signature did not match, for a SAS URL with one character changed"
    caption: "A one-hour, read-only user delegation SAS opened the file with no sign-in. Change one character of its signature and it is refused, so the only lever a holder has is waiting for it to expire."
  - src: ../../assets/work/azure-labs/lab01-architecture.png
    alt: "Lab 01 architecture: four policy assignments, P1 Modify and P2 to P4 Deny, a managed identity for P1, the resource group with its tags and a CanNotDelete lock, the networks created before and after the policies, and a West US network that was never created"
    caption: "Lab 01 as built: P1 to P3 on the resource group, P4 on the subscription, a delete lock on the group. The faded network in West US was refused by P4 and never existed."
  - src: ../../assets/work/azure-labs/01-35-activity-log-modify-then-deny.png
    alt: "Azure Activity log showing a Modify policy action followed by a deny policy action on the same request"
    caption: "The answer to question 3, in Azure's own log: on every request, Modify runs first and the Deny rules check what it produced."
  - src: ../../assets/work/azure-labs/01-26-control-deployment-failed.png
    alt: "A failed deployment in the Azure portal: the control network, created with P1 switched to Do not enforce, refused by P2"
    caption: "The control test. With P1 switched to Do not enforce, P2 refuses the same untagged network that P1 had just rescued."
  - src: ../../assets/work/azure-labs/01-21-p2-test-validation-passed.png
    alt: "The portal's Validation passed banner on a deployment that Azure Policy later refused"
    caption: "Validation passed is not Policy's verdict. Policy runs when the request reaches Azure Resource Manager, after this screen."
  - src: ../../assets/work/azure-labs/01-45-p4-test-deployment-failed.png
    alt: "A deployment to West US refused by the Allowed locations policy assigned to the subscription"
    caption: "P4 at subscription scope: a network in West US, owner tag and all, refused before it existed."
  - src: ../../assets/work/azure-labs/01-51-remediation-blocked-by-p3.png
    alt: "A remediation task for P1 failing with PolicyRemediationFailure because the update it sends is refused by P3"
    caption: "The surprise of the lab. A remediation is an ordinary update, so every Deny rule still checks it: P3 blocked P1's fix until the owner tag was added by hand."
  - src: ../../assets/work/azure-labs/01-58-lock-blocks-delete.png
    alt: "Azure refusing to delete a virtual network because of a CanNotDelete lock on its resource group"
    caption: "A delete lock beats permissions: an Owner cannot delete under it. It stops deletion and nothing else."
  - src: ../../assets/work/azure-labs/01-43-compliance-all-four.png
    alt: "Azure Policy compliance view listing the four assignments and their compliance state"
    caption: "All four rules assigned and evaluated. Old resources are reported within minutes, and changed only on their next update."
  - src: ../../assets/work/azure-labs/01-64-iac-remediation-nothing-left.png
    alt: "A re-run of the remediation task after the Bicep deployment finding zero resources left to fix"
    caption: "After the Bicep rebuild: the remediation re-run finds nothing left to fix. P1 had already put costCenter back inside the redeploy itself."
---

## Why build everything twice

Clicking through the portal is the fastest way to learn what a setting does. It is also impossible to repeat exactly, review, or keep in Git. Code is the opposite: repeatable and reviewable, but easy to write without understanding what it creates.

So every lab here is built twice. First by hand, with predictions written down before anything is created and something broken on purpose. Then from scratch as Bicep, deployed to a clean resource group, and compared with what the portal built. The differences between the two are usually where the lesson is.

Each lab follows the same five steps: build it in the portal, break something deliberately, export what Azure created, write the Bicep and deploy it, then write up the findings and tear everything down. Every resource carries `environment`, `purpose`, `lab` and `autoDelete` tags, and a script checks for anything left running.

## Lab 01: governance and tagging

Three questions, each with a prediction written before the build:

| Question | Prediction | What happened |
|---|---|---|
| Do resource group tags flow down to the resources inside? | No | Correct. A network created in a group with six tags carried none. Inheritance takes a policy, one per tag name. |
| What happens to resources that existed before a policy? | Left alone | Half right. Not changed, but reported non-compliant within minutes, and fixed only by a remediation task. |
| If one policy adds a tag and another denies resources missing it, which wins? | The one that adds | Correct, and proven both ways. Modify runs before Deny; with the Modify rule switched off, the Deny rule refused the same request. |

Four built-in policies made the test: **P1** inherits `costCenter` from the group (Modify), **P2** requires `costCenter` (Deny), **P3** requires `owner` (Deny), and **P4** allows East US only, assigned to the whole subscription. A `CanNotDelete` lock sat on the group.

## Broken on purpose

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

## Rebuilt as code

The portal export was the first lesson: it held only the networks. Policy assignments and locks are extension resources, attached *to* the group rather than *in* it, so an exported template is not a backup of a group's governance.

The Bicep rebuild deploys at subscription scope: the group and P4 from `main.bicep`, everything inside the group from a module. Built-in policy and role IDs are looked up, never remembered, and looking them up caught a wrong one. `what-if` listed eight creates and no changes; the deployment took ten seconds. Three things only the code build showed:

- **Rules and resources in one deployment race.** A network created seconds after its rules came out untagged and unrefused, because neither rule had taken effect yet. Rules belong in their own deployment, before the resources they govern.
- **Tag Contributor is enough.** The portal quietly gave P1's managed identity Contributor. In code the role assignment is its own resource, and the narrow Tag Contributor role did the job, proven by the Activity log.
- **Redeploying re-runs Modify.** A second deployment sent the network's tags as owner only, and P1 put `costCenter` back inside that same request.

## Lab 02: storage tiers

Blob Storage keeps files in four tiers. The colder the tier, the cheaper it is to keep a file and the dearer it is to read it back, and Archive is so cold the file goes offline. One file went into each tier, two more were archived to time the way back, and three were left for a lifecycle rule to walk down the tiers on its own.

| Question | Prediction | What happened |
|---|---|---|
| What does it take to open an archived file? | It steps back through Cold and Cool to Hot first | Half right. It cannot be read at all until it is rehydrated, but it goes straight to any online tier. High priority took about **37 minutes**, Standard about **3 hours 15 minutes**, for the same 150-byte file. |
| Once the master keys are off, can the Owner read the files? | No | Correct. Owner manages the account; reading what is in it needs a separate data role. |
| What does each tier cost, and what does leaving one early cost? | Cool is cheapest overall; an early move costs a day | Waiting on the bill. Azure let a file leave Cool minutes after entering it: the 30-day minimum is billed, not enforced. |

**Every tier change on a phone.** The storage account publishes an event for each tier change and each daily lifecycle run. Event Grid routes them to a Logic App, which formats a one-line alert, such as `lc-1.txt: Cold -> Archive (by SetBlobTier)`, and pushes it to a phone. The trigger first failed without a word: the `Microsoft.EventGrid` resource provider had never been registered on the subscription. Registering it and publishing again created the subscription.

**The seven-day wall.** A fast lifecycle rule was meant to move three files to Cool after one day, Cold after two and Archive after three. Cool and Cold arrived on schedule; Archive did not. The rule's JSON held a condition the form had not shown: the portal's *skip blobs rehydrated in the last 7 days* box, on by default, adds `daysAfterLastTierChangeGreaterThan: 7`, and it counts any tier change, not only a rehydration. Removed from the demo rule only, the next run archived all three, five days in instead of three. Written up in [The Seven-Day Wall](/lab-notes/2026/11/06/the-seven-day-wall.html).

**Keys off, least privilege on.** The portal had been reading the files with the account's master key the whole time. With key access disabled, the subscription Owner could not list a single file. Storage Blob Data Reader, on the one container and for the one user, restored reading and nothing else: upload was refused. Sharing still worked without the key: a one-hour, read-only user delegation SAS, signed through Entra ID, opened the file in a private browser window, and changing one character of its signature was refused.

Still to come: the bill, which answers the cost questions, and the Bicep rebuild. The lifecycle rules will translate almost line for line, because the portal's Code View already shows them as JSON.

## Lab 03, running: a virtual machine, taken apart

A virtual machine looks like one thing in the portal, but Azure builds it from separate resources: a size, an OS disk, a network interface, often a public address and a network security group, each billed and deleted on its own terms. The third lab builds one small Linux VM with no inbound ports open at all, manages it without SSH, and tests the two ways of turning it off: shutting down inside Linux, and deallocating in Azure. Predictions are written; the build is under way.

## What is next

Twenty labs in three groups. **Foundations:** storage tiers (done), a virtual machine deep dive (running), a custom RBAC role, Entra ID users and groups at scale, Azure Files. **Composition:** a three-tier network, hub-and-spoke with Bastion, load balancer failover, monitoring and alerts, backup and restore, Key Vault with managed identity, VNet-to-VNet VPN, App Service slots, private endpoints. **Applied:** a Bicep CI/CD pipeline, a Defender for Cloud baseline, a cost guardrail, Conditional Access with PIM, and a full environment built and destroyed from one template.
