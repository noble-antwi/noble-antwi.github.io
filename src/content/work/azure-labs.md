---
title: "Azure Labs: Built Twice, Portal Then Bicep"
kicker: "Cloud · Azure · Built twice"
summary: "Hands-on Azure labs, each built twice: by hand in the portal to see what the service really does, then from scratch as Bicep and compared. Lab 01 tested four Azure Policy rules and a delete lock until they broke, then rebuilt them as code in ten seconds. Lab 02, storage access tiers, is running."
category: cloud
status: active
statusLabel: "Lab 1 of 20 complete"
order: 27
period: "October 2026 to present"
role: "Build, break, rebuild as code, document"
repo: https://github.com/noble-antwi/azure-labs
docs: https://github.com/noble-antwi/azure-labs/tree/master/01-governance-tagging
docsLabel: "Lab 01 write-up"
stack: ["Azure Policy", "Resource locks", "Managed identity", "Azure RBAC", "Bicep", "Azure CLI", "what-if", "Activity log", "Blob Storage tiers"]
relatedTags: ["az-104", "bicep", "azure-policy"]
stats:
  - { value: "4", label: "Policy rules tested to failure" }
  - { value: "7", label: "Deliberate breaks, recorded" }
  - { value: "10 s", label: "To rebuild it all as Bicep" }
  - { value: "1 / 20", label: "Labs complete" }
gallery:
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

## Lab 02, running: storage access tiers

The second lab asks what hot, cool, cold and archive storage really cost to keep and to read back, what it takes to bring an archived file back online, what moving a file to a colder tier too early costs, and, added mid-lab after noticing the portal quietly uses the account key, who can still read the files once the account's keys are switched off. Predictions are written; the build is under way.

## What is next

Twenty labs in three groups. **Foundations:** storage tiers, a virtual machine deep dive, a custom RBAC role, Entra ID users and groups at scale, Azure Files. **Composition:** a three-tier network, hub-and-spoke with Bastion, load balancer failover, monitoring and alerts, backup and restore, Key Vault with managed identity, VNet-to-VNet VPN, App Service slots, private endpoints. **Applied:** a Bicep CI/CD pipeline, a Defender for Cloud baseline, a cost guardrail, Conditional Access with PIM, and a full environment built and destroyed from one template.
