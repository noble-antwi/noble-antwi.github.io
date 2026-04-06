---
layout: post
title: "My AZ-900 Journey: Monitoring Tools in Azure"
date: 2026-04-05
category: learning
tags: [azure, cloud, certification, az-900, microsoft, monitoring]
read_time: 10
---

This post covers the monitoring tools available in Azure, which also happens to be the last section of the core course content I have been working through. After this it is on to practice tests, so this feels like a natural milestone.

Azure provides a set of tools that serve different but complementary purposes. Understanding the difference between them is important for the exam, since it is easy to confuse their scope.

---

## Azure Advisor

**Azure Advisor** is a personalised recommendation engine that analyses your Azure subscription and surfaces actionable suggestions for improvement. It does not just report on current state — it actively tells you what to do and why.

Recommendations are organised into five categories:

| Category | What It Covers |
| --- | --- |
| **Cost** | Identifies underutilised or idle resources, right-sizing opportunities, and reserved instance recommendations to reduce your Azure bill |
| **Security** | Surfaces misconfigurations and vulnerabilities, and integrates with Microsoft Defender for Cloud to highlight security risks |
| **Reliability** | Recommends changes to improve availability and business continuity, such as enabling geo-redundant backups or adding redundancy to single-instance VMs |
| **Performance** | Identifies bottlenecks and suggests improvements to speed up applications, such as upgrading storage tiers or enabling caching |
| **Operational Excellence** | Recommends best practices around service health alerts, deployments, and resource hygiene |

Each recommendation includes a description of the issue, the specific resource affected, and a recommended action. Many recommendations can be acted on directly from within Advisor without navigating elsewhere in the portal.

### Key Points for AZ-900

- Advisor is **subscription-scoped** — its recommendations are based on the resources in your subscription.
- Recommendations are **personalised** — they reflect what is actually deployed and how it is being used, not generic advice.
- The **Cost** category is particularly useful for identifying savings, such as shutting down VMs that have been running at near-zero CPU utilisation for weeks.

---

## Azure Service Health

**Azure Service Health** gives you visibility into the health of Azure services and infrastructure at a platform level. This is distinct from monitoring your own resources — Service Health is about Azure itself.

It is made up of three components:

### Azure Status

A global view of the health of all Azure services across all regions. This is publicly accessible and shows active incidents and outages at the broadest level. If you have ever checked a cloud provider's status page during an outage, this is the Azure equivalent.

### Service Health (in the portal)

A personalised view that filters down to the Azure services and regions you actually use. This is where you want to spend your time rather than the global status page, since it removes the noise of incidents in regions or services that do not affect you.

You can configure **Service Health alerts** to notify you by email, SMS, or webhook when:

- A service incident is active in a region you use
- Planned maintenance is scheduled that could affect your resources
- A health advisory is issued for a service you depend on

Alerts can be scoped by subscription, region, and service type, so you only receive notifications relevant to your environment.

### Resource Health

The most granular component. **Resource Health** gives you the health status of individual resources in your subscription, such as whether a specific virtual machine is available and running correctly. It also provides a history of availability events for that resource, which is useful when investigating intermittent issues.

### Key Distinction for AZ-900

Azure Service Health tells you about problems with Azure's infrastructure. Azure Monitor (below) tells you about problems with your workloads running on top of that infrastructure. Both are necessary — a slow application could be caused by either.

---

## Azure Monitor

**Azure Monitor** is the centralised platform for collecting, analysing, and acting on telemetry data from your Azure resources and applications. Where Azure Advisor gives you recommendations and Azure Service Health tracks platform-level incidents, Azure Monitor is where all the operational data lives.

It collects two primary types of data:

| Data Type | Description |
| --- | --- |
| **Metrics** | Numerical values collected at regular intervals — CPU percentage, memory usage, request count, response time, etc. Metrics are lightweight and well suited to real-time dashboards and alerting. |
| **Logs** | Structured records of events and operations. Logs contain richer information than metrics and can be queried using **Kusto Query Language (KQL)** in Log Analytics. |

### Log Analytics

**Log Analytics** is the query and analysis interface within Azure Monitor. You write KQL queries against collected log data to investigate issues, identify trends, and build custom reports. For example, you could query for all failed authentication attempts across your VMs in the last 24 hours, or identify which resources generated the most errors in a given time window.

### Azure Monitor Alerts

Alerts can be configured to trigger on either metric thresholds or log query results. When an alert fires, it can:

- Send a notification (email, SMS, push notification)
- Trigger a webhook to integrate with an external system like PagerDuty or Slack
- Execute an Azure Logic App or Automation Runbook to take automated remediation action

This last option is powerful: Azure Monitor can not only detect that a VM is running low on disk space but also automatically extend the disk or send a ticket to a helpdesk system.

### Application Insights

**Application Insights** is an application performance monitoring (APM) feature within Azure Monitor. It is designed for monitoring live web applications and provides:

- Request rates, response times, and failure rates
- Dependency tracking (calls to databases, external APIs, etc.)
- Exception details and stack traces
- User behaviour analytics

Application Insights requires a small instrumentation SDK to be added to the application, after which it streams telemetry directly to Azure Monitor.

### Azure Monitor Workbooks

**Workbooks** are the reporting and visualisation layer within Azure Monitor. They provide interactive dashboards that can combine metrics charts, log query results, and text into a single shareable report. Microsoft provides several built-in workbook templates for common scenarios, and you can build custom ones for your specific needs.

The two primary views when exploring data in Azure Monitor are:

- **Metrics view** — for charting and analysing numerical metric data over time.
- **Logs view** — for querying and exploring log data using KQL.

---

## How the Three Tools Relate

It is worth being clear on the boundaries between these tools, since the AZ-900 exam tests this:

| Tool | Scope | Purpose |
| --- | --- | --- |
| **Azure Advisor** | Your subscription | Gives recommendations to improve cost, security, reliability, performance, and operations |
| **Azure Service Health** | Azure platform | Reports on incidents, planned maintenance, and health advisories for Azure services and regions |
| **Azure Monitor** | Your resources and applications | Collects metrics and logs, enables alerting, and provides analysis and visualisation of operational data |

A useful mental model: Azure Advisor tells you what to change before something goes wrong, Azure Service Health tells you when Azure itself is having a problem, and Azure Monitor tells you what is happening in your own environment right now.

---

## Wrapping Up the Core Content

That covers the last section of the AZ-900 course material. The topics across all the posts have covered:

- Core Azure concepts: regions, availability zones, resources, resource groups, subscriptions, and management groups
- Compute services: virtual machines, scale sets, App Service, containers, and Azure Functions
- Networking: virtual networks, DNS, ExpressRoute, VPN Gateway, and private endpoints
- Storage: storage account types, AzCopy, Storage Explorer, and Azure File Sync
- Migration: Azure Migrate and the Data Box family
- Identity: Microsoft Entra ID, authentication, authorisation, and external identities
- Governance: resource tags, Azure Policy, Resource Locks, RBAC, and Microsoft Purview
- Management tools: Azure Portal, CLI, PowerShell, Cloud Shell, REST API, Azure Arc, and IaC with ARM Templates
- Monitoring: Azure Advisor, Azure Service Health, and Azure Monitor

Next up is working through the Tutorial Dojo practice tests to identify gaps and solidify understanding before sitting the exam.

---

If you are also preparing for AZ-900, feel free to [reach out](/contact). Always happy to compare notes.
