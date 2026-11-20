---
title: "Azure Labs: Built Twice, Portal Then Bicep"
kicker: "Cloud · Azure · Built twice"
summary: "Twenty hands-on Azure labs, each built twice: first by hand in the portal to see what the service really does, then from scratch as Bicep, and compared. Every lab starts with predictions written down before anything is created."
cardImage: ../../assets/work/azure-labs/02-storage-tiers/architecture.png
heroAlt: "Architecture diagram of the storage tiers lab: a storage account, its container, lifecycle rules and the alert pipeline"
category: cloud
status: active
statusLabel: "5 of 20 labs built"
order: 27
period: "October 2026 to present"
role: "Build, break, rebuild as code, document"
repo: https://github.com/noble-antwi/az-104-labs
docs: https://github.com/noble-antwi/az-104-labs
docsLabel: "Lab write-ups"
stack: ["Azure Policy", "Resource locks", "Managed identity", "Azure RBAC", "Bicep", "Azure CLI", "what-if", "Activity log", "Blob Storage tiers", "Lifecycle management", "Event Grid", "Logic Apps", "Data-plane RBAC", "User delegation SAS", "Cost Management", "Virtual machines", "Network security groups", "Run Command", "Custom RBAC roles", "Entra SSH login", "Entra ID groups", "B2B guests", "Microsoft Graph"]
relatedTags: ["az-104", "bicep", "azure-policy"]
stats: []
---

## Why every lab is built twice

Clicking through the portal is the fastest way to learn what a setting does. It is also impossible to repeat exactly, review, or keep in Git. Code is the opposite: repeatable and reviewable, but easy to write without understanding what it creates.

So every lab here is built twice. First by hand, with predictions written down before anything is created and something broken on purpose. Then from scratch as Bicep, deployed to a clean resource group, and compared with what the portal built. The differences between the two are usually where the lesson is.

Each lab follows the same five steps: build it in the portal, break something deliberately, export what Azure created, write the Bicep and deploy it, then write up the findings and tear everything down. Every resource carries `environment`, `purpose`, `lab` and `autoDelete` tags, and a script checks for anything left running.

From lab 06 on, anything an earlier lab already built by hand is deployed from Bicep at the start, so portal time goes only to what is new.
