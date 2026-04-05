---
layout: post
title: "My AZ-900 Journey: Organising Resources, Governance, and Compliance"
date: 2026-04-04
category: learning
tags: [azure, cloud, certification, az-900, microsoft, governance]
read_time: 14
---

It has been a while since my last update. Academic pressure kept me away from writing, but I am back to working through my AZ-900 preparation and picking up where I left off. This post covers resource organisation with tags, Azure governance tools, Azure Policy, Resource Locks, and Microsoft Purview.

---

## Organising Your Infrastructure with Resource Tags

In a previous post I covered subscriptions, resource groups, and management groups as ways to organise Azure resources. Another layer on top of that is **Resource Tags**.

Resource tags are **key-value pairs** applied directly to Azure resources to add metadata. Where subscriptions and resource groups provide structural hierarchy, tags provide flexible, queryable labels that can be applied regardless of where a resource lives in that hierarchy.

A few examples of common tagging patterns:

| Key | Value |
| --- | --- |
| `Environment` | `Production` |
| `Department` | `Finance` |
| `CostCenter` | `CC-1042` |
| `Owner` | `noble.antwi@example.com` |
| `Project` | `DataPlatform` |

### Key Characteristics of Resource Tags

- Tags are applied at the **resource**, **resource group**, or **subscription** level.
- Each resource can have up to **50 tags**.
- Tag names are **case-insensitive**, but tag values are **case-sensitive** (so `production` and `Production` are treated as different values).
- Tags are **not inherited** by default. A tag applied to a resource group does not automatically appear on the resources inside it. This is an important distinction from Azure Policy, where settings do inherit downward.

### Why Tags Matter

Tags serve several practical purposes beyond simple labelling:

**Cost management and billing.** Tags are one of the primary ways to slice Azure cost reports. By tagging resources with a `CostCenter` or `Department` value, finance teams can generate accurate chargebacks and identify which teams are driving spend.

**Automation.** Tags can drive automated operations. For example, a runbook could be configured to start and stop virtual machines each evening based on an `AutoShutdown: true` tag, avoiding compute costs outside business hours.

**Security and compliance classification.** Tags like `DataClassification: Confidential` help teams identify which resources handle sensitive data, making it easier to scope security controls and audit reviews.

**Operational filtering.** When an incident occurs at 2am, being able to filter all resources tagged `Environment: Production` in a specific region helps on-call engineers locate affected resources faster.

### Enforcing Tags with Azure Policy

Tags only deliver value if they are consistently applied. Azure Policy can be used to enforce tagging standards:

- **Require a tag on resources** - denies resource creation if a specific tag is absent.
- **Add or replace a tag** - automatically appends a tag to any resource that does not already have it.
- **Inherit a tag from the resource group** - propagates the parent resource group's tag values down to child resources.

This enforcement is where tags shift from a nice-to-have convention into a reliable governance tool.

---

## Azure Governance and Compliance

As cloud environments grow, maintaining consistent standards across them becomes increasingly difficult. Azure provides a set of governance tools to enforce rules, restrict actions, and audit activity across subscriptions and resource groups.

Before looking at individual tools, it is worth framing what governance rules look like in practice:

- All servers must be running software within Microsoft Extended Support guidelines.
- Firewalls must block all inbound ports from the internet except port 443.
- Only the Operations support team can reboot a production server.
- All servers must be backed up at least every 24 hours.
- Resources may only be deployed in approved Azure regions.

These are the kinds of policies a governance framework needs to codify and enforce. Azure provides several mechanisms to do this.

---

## Azure Policy

**Azure Policy** is the primary tool for creating and enforcing rules on Azure resources. Policies can be assigned at the management group, subscription, resource group, or individual resource level, and they inherit downward through the hierarchy.

### What Policies Do

Each policy defines a **condition** and an **effect**. When a resource matches the condition, Azure applies the effect. Common effects include:

| Effect | Behaviour |
| --- | --- |
| **Deny** | Blocks the resource from being created or modified if it violates the rule |
| **Audit** | Allows the action but logs a compliance warning |
| **Append** | Adds additional fields to the resource request (for example, forcing a tag) |
| **Modify** | Adds, updates, or removes properties on resources |
| **DeployIfNotExists** | Deploys a related resource automatically if it does not already exist |

### Built-in Policies

Azure ships with a large library of built-in policies ready to assign. Examples include:

- Allowed storage account SKUs
- Limit deployments to certain Azure regions
- Allowed virtual machine SKUs
- Not allowed resource types
- Require SQL Server version 12.0 or later

### Custom Policies

When the built-in library does not cover a specific organisational requirement, you can write **custom policies using JSON**. A custom policy definition specifies the condition logic and the desired effect, and can then be assigned just like any built-in policy.

### Policy Initiatives

An **initiative** (also called a policy set) is a collection of related policies grouped together so they can be assigned as a single unit. For example, a "CIS Azure Benchmark" initiative might bundle dozens of individual security-related policies that you want to enforce together. This avoids having to assign and track each policy separately.

### Seeing Policies in Action

In practice, a policy like "Allowed Locations" can be assigned to a subscription and configured with a list of approved Azure regions. Once active, any attempt to create a resource in an unapproved region is blocked at deployment time with a clear error message. This kind of guardrail is especially useful in organisations that need to keep data within specific geographic boundaries for regulatory reasons.

---

## Template Specs and Deployment Stacks

Two additional governance tools worth noting:

**Template Specs** allow you to store and version ARM templates (Azure Resource Manager templates) in Azure itself, making them reusable across teams. Instead of every team maintaining their own copy of a template, a central team publishes a Template Spec and others reference it in their deployments.

**Deployment Stacks** go a step further by treating a group of resources deployed together as a single managed unit. They can enforce that no resources outside the stack can modify the resources within it, and they simplify cleanup by allowing you to delete the entire stack rather than hunting down individual resources.

---

## Resource Locks

**Resource Locks** restrict modification or deletion of Azure resources, regardless of what RBAC permissions a user holds. They act as an additional safety layer on top of access control.

There are two types of resource lock:

| Lock Type | Effect |
| --- | --- |
| **ReadOnly** | Prevents any modifications to the resource. Read operations are still allowed. |
| **Delete** | Prevents the resource from being deleted. Modifications are still allowed. |

Locks can be applied at the resource, resource group, or subscription level and are inherited downward. A Delete lock on a resource group protects every resource inside it from accidental deletion.

### Important Caveats

Resource locks are a **preventive control against accidents**, not a security boundary. They are designed to protect against an administrator accidentally deleting a production database or modifying a critical network configuration. They are not designed to prevent a determined insider with elevated access from causing harm.

For that reason, resource locks are best thought of as a sensible operational safeguard rather than a primary security control. They work well alongside RBAC and Azure Policy, not as a replacement for either.

---

## Role-Based Access Control (RBAC)

**Azure RBAC** (Role-Based Access Control) governs who can do what to which resources. Permissions are granted by assigning a **role** to a **security principal** (a user, group, or service principal) at a defined **scope**.

Built-in roles include:

- **Owner** - full access to all resources, including the ability to delegate access to others.
- **Contributor** - can create and manage resources but cannot grant access to others.
- **Reader** - can view existing resources but cannot make changes.

Beyond these, there are dozens of service-specific built-in roles (for example, "Storage Blob Data Contributor" or "Virtual Machine Contributor"), and you can create **custom roles** when the built-in options do not match your requirements.

The principle to follow is **least privilege** - assign the minimum permissions required for a person or service to do their job, scoped as narrowly as possible.

---

## Microsoft Purview

**Microsoft Purview** is a unified platform for data governance, risk, and compliance. Where Azure Policy focuses on infrastructure-level rules, Purview focuses on data itself and how it is handled across the organisation.

### Core Capabilities

**Data Map and Data Catalogue.** Purview can scan data sources across Azure, on-premises environments, and other clouds to automatically discover and classify data assets. The Data Catalogue provides a searchable inventory of data assets with metadata, lineage, and classification labels.

**Auditing.** Purview provides detailed audit logs of user and admin activity across Microsoft 365 services, helping security and compliance teams answer questions about who accessed what data and when.

**Communication Compliance.** This feature monitors communications for policy violations relevant to regulated industries, including:

- SEC and FINRA compliance requirements for financial services firms
- Detection of sensitive or confidential information being shared inappropriately
- Identification of harassing, threatening, or discriminatory language in communications
- Detection of adult content being shared over corporate channels

**Insider Risk Management.** Purview can identify patterns of behaviour that indicate potential insider threats, whether malicious or inadvertent. Use cases include:

- Intellectual property theft (for example, large data exports shortly before an employee's last day)
- Data leakage to external parties
- Security policy violations such as accessing restricted data outside of normal hours

Purview positions itself as a one-stop shop for organisations navigating complex data governance requirements, particularly in regulated industries where audit trails and compliance evidence need to be readily available.

---

## Putting It Together

The tools covered here form a layered governance model:

1. **Tags** provide metadata for cost management, automation, and operational visibility.
2. **Azure Policy** enforces infrastructure standards and prevents non-compliant resources from being created.
3. **Template Specs and Deployment Stacks** standardise how resources are deployed in the first place.
4. **Resource Locks** add a final safety net against accidental changes to critical resources.
5. **RBAC** controls who can take action on which resources at all.
6. **Microsoft Purview** extends governance down to the data level, covering compliance, auditing, and insider risk.

Each layer addresses a different failure mode: a resource without the right tag might get missed in a cost report, a resource without the right policy might get deployed in the wrong region, and a resource without a lock might get accidentally deleted by someone who had every right to do so but should not have.

---

## Up Next

The next area to work through is Azure cost management and pricing models, including the pricing calculator, total cost of ownership (TCO) comparisons, and how to use Azure Advisor to optimise spending. That will likely feed into a post of its own.

---

If you are also working through AZ-900 or have thoughts on any of the topics above, feel free to [reach out](/contact).
