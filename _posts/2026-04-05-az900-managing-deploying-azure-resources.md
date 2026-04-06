---
layout: post
title: "My AZ-900 Journey: Managing and Deploying Azure Resources"
date: 2026-04-05
category: learning
tags: [azure, cloud, certification, az-900, microsoft, iac, azure-arc]
read_time: 15
---

Continuing from the previous post on governance and compliance, this entry covers the tools Azure provides for managing and deploying resources, the difference between Site-to-Site and Point-to-Site VPN connectivity, Azure Arc for hybrid and multi-cloud management, and Infrastructure as Code with ARM Templates.

---

## Tools for Managing Azure Resources

Azure gives you several ways to interact with your resources. Each tool suits a different workflow, and most organisations end up using a combination of them depending on the task at hand.

### 1. Azure Portal

The **Azure Portal** is the browser-based graphical interface at portal.azure.com. It provides a visual way to create, configure, and monitor Azure resources without writing any code or commands.

The portal is excellent for:

- Exploring services you are not yet familiar with, since wizards and forms guide you through required settings.
- One-off administrative tasks such as resizing a VM or reviewing a cost report.
- Monitoring dashboards that surface metrics, alerts, and resource health at a glance.

The limitation of the portal is repeatability. Any task performed through the portal is a manual, point-and-click operation. If you need to create the same set of resources ten times or reproduce an environment reliably, the portal alone is not the right tool.

### 2. Azure REST API

Every action you take in Azure, whether through the portal, CLI, or PowerShell, ultimately calls the **Azure REST API** underneath. It is the underlying interface that all Azure management tools are built on top of.

The REST API accepts standard HTTP requests (GET, POST, PUT, DELETE, PATCH) and returns JSON responses. You would interact with it directly when:

- Building custom applications or scripts that need to manage Azure resources programmatically.
- Integrating Azure management into an existing platform or workflow tool that is not natively Azure-aware.
- Accessing functionality that has not yet been surfaced in the CLI or portal.

Authentication to the REST API uses Azure Active Directory (Microsoft Entra ID) tokens, so all the same RBAC rules that govern portal access apply here too.

### 3. Azure PowerShell

**Azure PowerShell** is a set of cmdlets (commands) for managing Azure resources from a PowerShell terminal. The current module is the **Az PowerShell module**, which replaced the older AzureRM module.

Once installed, you authenticate with `Connect-AzAccount` and then use cmdlets like:

- `Get-AzResourceGroup` to list resource groups
- `New-AzVm` to create a virtual machine
- `Remove-AzResource` to delete a resource

PowerShell is particularly well suited to Windows-heavy environments and to engineers who are already comfortable writing PowerShell scripts. Because Azure PowerShell is cross-platform (it runs on Windows, macOS, and Linux), it is not limited to Windows environments.

The real power comes from scripting: you can write PowerShell scripts that create entire environments, configure networking, assign policies, and deploy applications in a fully automated and repeatable way.

### 4. Azure CLI

The **Azure CLI** is a cross-platform command-line tool that uses the `az` command prefix. It is the preferred tool for engineers who work in Linux or macOS environments or who are more comfortable with Bash than PowerShell.

Equivalent to the PowerShell examples above, the CLI equivalents would be:

- `az group list` to list resource groups
- `az vm create` to create a virtual machine
- `az resource delete` to delete a resource

Azure CLI and Azure PowerShell overlap significantly in capability. The choice between them often comes down to personal preference and the environment you are working in. Both are fully supported and kept up to date by Microsoft.

### 5. Azure Cloud Shell

**Azure Cloud Shell** is a browser-based shell environment accessible directly from the Azure Portal (the `>_` icon in the top navigation bar). It provides either a PowerShell or Bash terminal, pre-authenticated with your Azure account and pre-loaded with common tools including:

- Azure CLI
- Azure PowerShell (Az module)
- Terraform
- kubectl
- git

The key advantages of Cloud Shell are that there is nothing to install and you are always authenticated. Microsoft backs Cloud Shell storage with an Azure Files share, so your files and scripts persist between sessions.

Cloud Shell is ideal for quick administrative tasks, running scripts on-the-go, or situations where you need a terminal but are working from a machine where you cannot install tools locally.

---

## Site-to-Site vs Point-to-Site VPN

Both options use an **Azure VPN Gateway** to establish encrypted tunnels between Azure and external networks, but they serve different purposes.

### Site-to-Site (S2S) VPN

A **Site-to-Site VPN** connects an entire on-premises network to an Azure Virtual Network. The connection is established between the Azure VPN Gateway and an on-premises VPN device (a hardware router or firewall that supports IPsec/IKE).

| Characteristic | Detail |
| --- | --- |
| **Use case** | Connecting a branch office or data centre to Azure |
| **Who connects** | All devices on the on-premises network |
| **Setup** | Requires a compatible VPN device on-premises |
| **Protocol** | IPsec/IKE |
| **Connection** | Persistent, always-on tunnel |

Once the tunnel is up, all devices on the on-premises network can reach resources in the Azure VNet as if they were on the same local network. This is the standard choice for hybrid connectivity between a corporate office or data centre and Azure.

### Point-to-Site (P2S) VPN

A **Point-to-Site VPN** connects individual devices to an Azure Virtual Network. Each device establishes its own VPN connection to the Azure VPN Gateway.

| Characteristic | Detail |
| --- | --- |
| **Use case** | Remote workers connecting to Azure resources |
| **Who connects** | Individual laptops or workstations |
| **Setup** | VPN client software installed on each device |
| **Protocols** | SSTP, OpenVPN, or IKEv2 |
| **Connection** | On-demand, initiated by the user |

Point-to-Site is the right choice when individual users need secure access to Azure resources without routing all traffic through a corporate network. It is commonly used for remote developers or administrators who need to reach Azure VMs or services that are not exposed to the public internet.

### Quick Comparison

| | Site-to-Site | Point-to-Site |
| --- | --- | --- |
| **Connects** | Network to network | Device to network |
| **Typical user** | IT / Network team | Individual remote users |
| **On-premises hardware required** | Yes (VPN device) | No |
| **Number of connections** | One tunnel covers all devices | One tunnel per device |

---

## Azure Arc

**Azure Arc** extends the Azure management plane to resources that live outside of Azure, whether in your own data centre, in another cloud provider, or at the network edge.

The core idea is that you can use familiar Azure tools, Azure Policy, RBAC, monitoring, and security, on non-Azure resources, without having to move those resources to Azure.

### What Azure Arc Supports

**Servers (Windows and Linux).** Arc-enabled servers can be physical machines or virtual machines running in an on-premises environment or in another cloud like AWS or GCP. Once an Arc agent is installed on the machine, it appears in the Azure Portal as a resource. You can then apply Azure Policy to it, use Microsoft Defender for Cloud to monitor its security posture, and use Azure Monitor to collect logs and metrics.

**Kubernetes clusters.** Azure Arc can attach to any conformant Kubernetes cluster, regardless of where it is running. Once attached, you can deploy applications to it using GitOps-based workflows and apply Azure Policy to enforce configuration standards across the cluster.

**Databases.** Azure Arc supports running Azure data services (Azure SQL Managed Instance and Azure Database for PostgreSQL) on infrastructure you own. This gives you cloud-like capabilities such as automated patching and elastic scaling on your own hardware, which is valuable for organisations with data residency requirements that prevent them from moving databases to the cloud.

### Why It Matters for AZ-900

Azure Arc reflects a broader shift in how Microsoft positions Azure: not purely as a public cloud destination, but as a management and governance layer that can span wherever your workloads happen to run. For the exam, the key point is that Arc enables a single pane of glass for managing hybrid and multi-cloud environments using Azure-native tooling.

---

## Infrastructure as Code (IaC)

**Infrastructure as Code** is the practice of defining and managing infrastructure through code and configuration files rather than through manual processes. Instead of clicking through the portal to build an environment, you write a file that describes what you want, and a tool provisions it for you.

The benefits are significant:

- **Repeatability.** Running the same template always produces the same environment, eliminating configuration drift.
- **Version control.** Infrastructure definitions live in Git alongside application code, giving you a history of every change.
- **Recovery.** If an environment is accidentally destroyed, you can recreate it by running the template again rather than rebuilding manually.
- **Consistency across environments.** The same template can create development, staging, and production environments with only minor variable differences.

### ARM Templates

**Azure Resource Manager (ARM) Templates** are Microsoft's native IaC format for Azure. They are JSON files that declaratively describe the resources you want to deploy, their configuration, and their dependencies.

A minimal ARM template has four main sections:

- **schema** - specifies the ARM template schema version.
- **contentVersion** - a version number you control for tracking changes.
- **parameters** - input values that can be provided at deployment time, making the template reusable across environments.
- **resources** - the list of Azure resources to create, each with a type, API version, and properties.

ARM templates are **idempotent**, meaning you can run the same template multiple times and Azure will only make changes if the current state differs from the desired state. If a resource already exists and matches the template, it is left untouched.

ARM templates are the Microsoft-recommended approach for IaC on Azure and are deeply integrated with Azure services. You can deploy them through the portal, via the CLI (`az deployment group create`), through PowerShell, or as part of a CI/CD pipeline in Azure DevOps or GitHub Actions.

### Bicep

Worth knowing for the AZ-900 exam context: Microsoft has developed **Bicep** as a more approachable alternative to raw ARM JSON. Bicep is a domain-specific language that compiles down to ARM template JSON. It has a much cleaner syntax, better tooling support, and is now Microsoft's preferred way to author ARM-based deployments. Under the hood, a Bicep file and an ARM JSON template are equivalent, since Bicep compiles to ARM before deployment.

### Third-Party IaC Tools

Azure also has strong support for **Terraform**, the widely-used open-source IaC tool from HashiCorp. Terraform uses its own HCL (HashiCorp Configuration Language) syntax and can manage resources across multiple cloud providers in a single configuration, which makes it popular in multi-cloud environments. For the AZ-900 exam the focus is on ARM Templates and Bicep, but knowing that Terraform is a supported option is useful context.

---

## How the Tools Fit Together

It helps to think about these tools in terms of when you would reach for each one:

| Scenario | Recommended Tool |
| --- | --- |
| Exploring a new Azure service | Azure Portal |
| One-off administrative task | Azure Portal or Cloud Shell |
| Repeatable scripting in a Windows environment | Azure PowerShell |
| Repeatable scripting in a Linux/Mac environment | Azure CLI |
| Deploying infrastructure from a CI/CD pipeline | ARM Templates / Bicep |
| Managing on-premises or multi-cloud resources | Azure Arc |
| Building custom integrations with Azure | Azure REST API |

---

## Up Next

The next area to work through covers Azure cost management, pricing models, and how to use tools like the Azure Pricing Calculator and the Total Cost of Ownership (TCO) Calculator to estimate and optimise spend. That feeds directly into one of the exam objective areas, so it deserves its own post.

---

If you are also working through AZ-900 or have questions on any of the above, feel free to [reach out](/contact).
