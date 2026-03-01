---
layout: post
title: "My AZ-900 Journey: Learning Azure Fundamentals from the Ground Up"
date: 2026-02-24
category: learning
tags: [azure, cloud, certification, az-900, microsoft]
read_time: 12
---

After spending considerable time in AWS, I have decided to broaden my cloud knowledge by pursuing the **Microsoft Azure Fundamentals (AZ-900)** certification. This post documents what I have been learning and serves as both a study reference and a record of my journey into the Azure ecosystem.

## Why AZ-900?

The AZ-900 certification covers the foundational concepts of cloud computing and Azure services. For someone looking to work across multiple cloud platforms or transition into Azure-focused roles, this certification provides the essential groundwork. It covers core Azure services, pricing, SLAs, and the fundamental architectural concepts that underpin everything else in Azure.

---

## Core Azure Concepts

### Regions and Region Pairs

Azure infrastructure is organised into **regions** — physical locations around the world where Microsoft operates data centres. Each region is paired with another region within the same geography (at least 300 miles apart) to provide disaster recovery capabilities. If one region experiences an outage, services can fail over to the paired region.

### Availability Zones

Within a region, **Availability Zones** are physically separate data centres with independent power, cooling, and networking. Deploying resources across multiple availability zones protects applications from data centre-level failures. This is similar to AWS Availability Zones — a concept I was already familiar with.

### Resources and Resource Groups

In Azure, a **resource** is any manageable item — a virtual machine, storage account, database, or virtual network. **Resource groups** are logical containers that hold related resources for an Azure solution. They make it easier to manage, monitor, and control access to resources as a unit.

### Subscriptions

A **subscription** is a billing and access control boundary in Azure. It provides authenticated and authorised access to Azure products and services. Organisations often use multiple subscriptions to separate environments (development, staging, production) or departments.

### Management Groups

**Management groups** provide a level of scope above subscriptions. They are particularly useful for:

- Applying **Azure policies** across multiple subscriptions
- Managing access control at scale
- Governance for large organisations

Key points about management groups:

- There is a **root management group** at the top of the hierarchy
- The hierarchy can be up to **6 levels deep**
- Each subscription must belong to **exactly one** management group
- The real power lies in **inheritance** — policies applied at a management group level cascade down to all subscriptions and resources below

Management groups are crucial for governance at scale, especially in enterprise environments with many subscriptions.

---

## Azure Compute Services

Azure offers several compute options depending on your needs and how much control you want over the underlying infrastructure.

### Virtual Machines

Azure Virtual Machines provide full control over the operating system and software stack. This is Infrastructure as a Service (IaaS) at its core.

**Virtual Machine Scale Sets** allow you to create and manage a group of identical, load-balanced VMs. Scale sets can automatically increase or decrease the number of VM instances based on:

- **Demand** — such as CPU utilisation thresholds
- **Schedules** — predefined scaling at specific times

This is similar to AWS Auto Scaling Groups (the name I could not remember while studying). Scale sets can be configured to scale up to **1,000 VM instances** when using platform images. A **load balancer** sits in front of the scale set to distribute traffic — this is how Azure achieves the **elasticity** that is fundamental to cloud computing.

### Availability Sets and Proximity Placement Groups

**Availability Sets** apply to multiple VMs that perform identical functions. They ensure VMs are distributed across:

| Concept | Purpose |
| --- | --- |
| **Fault Domains** | Protect against unplanned hardware failures — VMs in different fault domains do not share common power or network switches |
| **Update Domains** | Protect against planned maintenance — Microsoft updates one update domain at a time, ensuring some VMs remain available |

**Proximity Placement Groups** ensure VMs are placed physically close together in the same data centre, reducing network latency between them. This is useful for workloads that require low-latency communication.

### App Service (Web Apps)

Azure App Service is a **Platform as a Service (PaaS)** offering. You package your code and configuration, upload it to Azure, and Azure runs it according to your performance tier. You do not manage the underlying VMs — Microsoft handles patching, scaling, and infrastructure maintenance.

This abstraction allows developers to focus purely on application code rather than infrastructure management.

### Containers

Azure provides several container options:

| Service | Description |
| --- | --- |
| **Azure Container Instances (ACI)** | The simplest way to run a container in Azure — no VM management, no orchestration |
| **Web App for Containers** | A container-based version of App Service |
| **Azure Container Apps** | A serverless container platform — simpler than Kubernetes but more capable than ACI |
| **Azure Kubernetes Service (AKS)** | Fully managed Kubernetes for complex container orchestration needs |

Containers package all application files, libraries, and dependencies together, ensuring consistent behaviour across environments.

### Azure Virtual Desktop

Azure Virtual Desktop provides virtualised Windows desktops and applications in the cloud. Users can access a full Windows experience from any device, with the compute happening in Azure rather than locally.

### Azure Functions

Azure Functions is a **serverless compute** service. Functions are small pieces of code designed to:

- Perform a **specific task**
- Run for a **short duration**
- Execute in response to **triggers** (HTTP requests, queue messages, timer schedules, etc.)

This is ideal for event-driven architectures where you only pay for the compute time your code actually uses.

---

## Networking Services

### Virtual Network Connectivity

Azure Virtual Networks (VNets) allow resources to communicate privately. Key concepts include:

- **Subnets** — segments within a VNet to organise resources
- **VNet Peering** — allows private communication between VMs in different VNets without traffic going over the public internet

### Azure DNS

Azure DNS provides hosting for DNS domains, allowing you to manage DNS records using Azure infrastructure.

### ExpressRoute

**ExpressRoute** provides a **dedicated, private connection** between your on-premises infrastructure and Azure. Unlike VPN connections that traverse the public internet, ExpressRoute offers:

- Higher bandwidth
- Lower latency
- More consistent network performance
- Enhanced security (traffic does not traverse the public internet)

---

## Understanding Public and Private Endpoints

How you access Azure resources depends on your security requirements:

### Public Access

Traffic from the public internet can reach the resource. The resource is **discoverable** and **reachable**, but this does not mean it is accessible to everyone — authentication and authorisation still apply.

### Public Access from Selected Networks (Service Endpoints)

**Service endpoints** restrict access to specific virtual networks or IP addresses. Traffic travels over the **Azure backbone network** rather than the public internet, providing:

- Better security
- Lower latency
- Simpler network configuration

### Private Endpoints (Disabled Public Access)

**Private endpoints** completely disable public access. To reach the resource, you must:

1. Create a private endpoint
2. Connect via **Azure Private Link**
3. Access only from private resources within your network

This is the most secure option for sensitive workloads.

---

## Azure Storage

Azure Storage is considered **Infrastructure as a Service (IaaS)** and comes in several forms:

| Type | Description |
| --- | --- |
| **Managed Storage (GPv2)** | General-purpose v2 accounts — the recommended storage account type for most scenarios |
| **Blob Storage** | Object storage for unstructured data (images, videos, backups, logs) |
| **File Storage** | Fully managed file shares accessible via the SMB and NFS protocols |
| **Unmanaged Storage** | Used primarily with VMs where you manage the underlying storage disks yourself |

### Azure Storage Tools

Two essential tools for working with Azure Storage:

- **AzCopy** — a command-line utility that efficiently copies data to and from Azure Storage accounts. It supports high-performance transfers and can be used to move data between storage accounts, to/from on-premises, or within Azure itself.
- **Azure Storage Explorer** — a free graphical desktop application that provides a visual interface for browsing and managing Azure Storage resources, including blobs, files, queues, and tables. It is the easiest way to interact with storage accounts without writing code.

Both tools ensure data moves quickly and securely across Azure.

### Azure File Sync

**Azure File Sync** is a hybrid service that extends Azure File Storage to your on-premises environment. It works by:

1. Installing an agent on Windows Server
2. Creating a sync group between the server endpoint and an Azure file share
3. Tiering infrequently accessed files to the cloud, while keeping hot files local

This is sometimes described as turning Windows Server into a fast local cache of your Azure file share. It is particularly valuable for organisations that want cloud-scale storage while retaining on-premises access speed.

---

## Migrating to Azure

### Azure Migrate

**Azure Migrate** is a centralised hub of tools for discovering, assessing, and migrating workloads to Azure. It co-ordinates with specialised migration tools and supports migration of:

- Physical servers
- VMware VMs (using the Azure Migrate appliance)
- ASP.NET web applications
- Virtual desktops
- SQL Server databases

The typical workflow is: **Discover → Assess → Migrate**. Azure Migrate provides dependency mapping, readiness reports, and cost estimates before you commit to migration.

### Moving Large Datasets — The Azure Data Box Family

When internet-based data transfer is too slow or too expensive, Azure offers physical data transfer appliances:

| Device | Capacity | Use Case |
| --- | --- | --- |
| **Azure Data Disk** | Up to 8 TB | Small datasets — ship a standard encrypted disk |
| **Azure Data Box** | Up to 100 TB | Mid-size migrations — ruggedised RAID appliance |
| **Azure Data Box Heavy** | Up to 1 Petabyte | Massive datasets — large wheeled appliance for data centres |

The workflow is consistent across all three: Microsoft ships the device to you, you copy data locally, ship it back, and Microsoft uploads the data securely into your Azure Storage account. This is the practical solution for "sneakernet at scale."

---

## Up Next: Identity and Access Management

The next area of study covers **Azure Identity and Access Management (IAM)**, which is a significant part of the AZ-900 exam. This includes:

- **Microsoft Entra ID** (formerly Azure Active Directory) — the cloud-based identity provider that underpins authentication across Azure and Microsoft 365
- **Traditional Active Directory vs. Entra ID** — understanding how on-premises AD differs from cloud-based identity
- **Authentication and Authorisation** — how Azure verifies who you are and what you are allowed to do
- **External Identities** — how to manage access for guests, partners, and B2C customers outside your organisation

These identity concepts are foundational to understanding how access control works throughout Azure, so I am looking forward to getting into that material.

---

## What Comes Next

This is an ongoing record of my AZ-900 preparation. Coming from an AWS background, I find it helpful to draw parallels between the two platforms — for example, VM Scale Sets map closely to AWS Auto Scaling Groups, and Azure Blob Storage maps to S3 — while also appreciating where Azure takes a different approach or introduces its own terminology.

---

If you are also preparing for AZ-900 or transitioning from AWS to Azure, feel free to [reach out](/contact). Always happy to compare notes.
