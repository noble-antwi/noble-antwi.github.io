---
title: "Cloud Security Posture Dashboard"
kicker: "Cloud posture · AWS + Azure"
summary: "Terraform deploys deliberately misconfigured AWS and Azure resources, Prowler and ScoutSuite scan them, and a Flask dashboard normalises 500+ checks into one findings schema with remediation commands and CIS, NIST and PCI mapping."
category: cloud
status: complete
statusLabel: "Completed"
order: 30
period: "2025"
repo: https://github.com/noble-antwi/cloud-security-posture-dashboard
stack: ["Terraform", "Prowler", "ScoutSuite", "Python", "Flask", "AWS", "Azure"]
relatedTags: ["cloud-security", "aws", "azure"]
stats:
  - { value: "500+", label: "Security checks" }
  - { value: "2", label: "Cloud platforms" }
  - { value: "6+", label: "Compliance frameworks" }
  - { value: "5", label: "Pipeline stages" }
hero: ../../assets/work/cloud-security-posture-dashboard/diagram.svg
heroAlt: "Pipeline diagram: deploy misconfigured resources with Terraform, scan with Prowler and ScoutSuite, aggregate into one schema, visualise in Flask, remediate with dry-run"
heroCaption: "The five-stage pipeline. Remediation loops back into a re-scan so a finding is only closed when the scanner agrees."
---

Build a comprehensive multi-cloud security assessment platform that automates the deployment of intentionally misconfigured cloud resources, performs security scanning using industry-standard tools, aggregates findings into unified formats, and visualizes results through an interactive dashboard with automated remediation guidance and compliance mapping.

## Core Technologies & Stack

Terraform · Python · Flask · Prowler · ScoutSuite · AWS · Azure · Bootstrap 5 · Chart.js · JSON · IAM · S3 · Azure Storage

## Key Features

- **Multi-Cloud Support:** Automated security assessment across AWS and Azure cloud platforms with unified findings aggregation
- **Infrastructure as Code:** Terraform-based deployment of intentionally misconfigured resources for testing security controls and scanner accuracy
- **Industry-Standard Scanning:** Integration with Prowler 3.x (AWS) and ScoutSuite (Azure) for comprehensive security assessments covering 500+ checks
- **Unified Findings Schema:** Python-based aggregation engine that normalizes findings from multiple scanning tools into a consistent format
- **Interactive Dashboard:** Flask web application with Bootstrap 5 UI featuring real-time visualization, severity breakdown charts, and filterable findings tables
- **Automated Remediation:** Built-in remediation engine with AWS CLI commands for S3 encryption, public access blocking, versioning, and IAM Access Analyzer setup
- **Compliance Mapping:** Findings mapped to CIS 2.0, CIS 1.4, CIS 1.5, NIST, PCI-DSS, HIPAA, and GDPR compliance frameworks
- **Dry-Run Mode:** Safe testing of remediation scripts before applying changes to production environments
- **Batch Remediation:** Support for remediating multiple security findings across resources simultaneously
- **Export Capabilities:** JSON and CSV export formats for integration with SIEM tools and reporting systems

## Supported Cloud Services & Resources

> #### **AWS Resources**
>
> S3 buckets (encryption, versioning, public access policies), IAM Access Analyzer, CloudTrail logging, VPC security groups, EC2 security configurations, RDS encryption, Lambda security, and 500+ additional security checks via Prowler

> #### **Azure Resources**
>
> Storage accounts (security settings, encryption), Network Security Groups, Key Vaults, Virtual Machines, SQL Databases, Active Directory configurations, and comprehensive service coverage via ScoutSuite

## Dashboard Visualization Features

- **Real-Time Metrics:** Summary cards displaying total findings, critical/high/medium/low severity counts, and affected resources
- **Severity Distribution:** Interactive doughnut chart showing the proportion of findings by severity level
- **Cloud Provider Comparison:** Bar chart comparing security findings across AWS and Azure environments
- **Searchable Findings Table:** Filter and search capabilities for quickly locating specific security issues
- **Detailed Findings View:** Expandable rows with remediation guidance, affected resources, and compliance framework mapping
- **Severity Badges:** Color-coded severity indicators (Critical=Red, High=Orange, Medium=Yellow, Low=Blue)

## Five-Stage Security Pipeline

> **1. Deploy:** Terraform provisions intentionally misconfigured AWS and Azure resources for testing
>
> **2. Scan:** Prowler and ScoutSuite perform automated security assessments with 500+ checks
>
> **3. Aggregate:** Python scripts normalize findings from multiple tools into unified JSON schema
>
> **4. Visualize:** Flask dashboard displays findings with charts, filters, and detailed remediation guidance
>
> **5. Remediate:** Automated scripts fix identified issues with dry-run mode for safe testing

## Use Cases & Applications

- **Security Tool Validation:** Test and validate security scanning tools in controlled environments before production deployment
- **Cloud Security Training:** Learn common cloud misconfigurations and remediation techniques in safe sandbox environments
- **DevSecOps Pipeline Integration:** Build security automation pipelines with automated scanning and remediation capabilities
- **Compliance Auditing:** Map security findings to compliance frameworks (CIS, NIST, PCI-DSS, HIPAA, GDPR) for audit preparation
- **Security Posture Assessment:** Continuously monitor multi-cloud security posture with unified visibility across AWS and Azure

## Technical Skills Demonstrated

> **Cloud Security:** AWS security services (IAM, S3, CloudTrail), Azure security (Storage, NSG, Key Vault), security scanning tools (Prowler, ScoutSuite)
>
> **Infrastructure as Code:** Terraform for multi-cloud resource provisioning and management
>
> **Security Automation:** Python scripting for findings aggregation, automated remediation, and compliance mapping
>
> **Web Development:** Flask backend, Bootstrap 5 frontend, Chart.js data visualization, RESTful API design
>
> **DevSecOps:** CI/CD security integration, automated security testing, remediation automation, compliance-as-code
