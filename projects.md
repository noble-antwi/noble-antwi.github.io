---
layout: default
title: Projects
description: "Noble Antwi's cloud security and identity projects: a hybrid identity lab across Active Directory, Okta and Entra ID, a segmented security homelab with Wazuh, a multi-cloud posture dashboard, and enterprise security assessments."
---

<div class="page-head">
  <p class="page-kicker">Projects</p>
  <h1 class="page-title">Labs and builds, documented like production</h1>
  <p class="page-lead">Every project here has a repository and a write-up. Open a card for the full case study: objective, stack, what got built, and where it stands.</p>
</div>

<div class="stat-strip">
  <div class="stat-tile"><strong>7</strong><span>Case studies</span></div>
  <div class="stat-tile"><strong>7</strong><span>Public repositories</span></div>
  <div class="stat-tile"><strong>2</strong><span>Labs in active build</span></div>
  <div class="stat-tile"><strong>3</strong><span>Focus areas</span></div>
</div>

<div class="filter-tabs" data-filter-group="proj" role="group" aria-label="Filter projects">
  <button class="filter-tab is-active" data-filter="all" aria-pressed="true">All <span class="count">9</span></button>
  <button class="filter-tab" data-filter="identity" aria-pressed="false"><i class="fas fa-user-shield"></i> Identity <span class="count">3</span></button>
  <button class="filter-tab" data-filter="cloud" aria-pressed="false"><i class="fas fa-cloud"></i> Cloud <span class="count">2</span></button>
  <button class="filter-tab" data-filter="detection" aria-pressed="false"><i class="fas fa-crosshairs"></i> Detection &amp; infrastructure <span class="count">2</span></button>
  <button class="filter-tab" data-filter="assessment" aria-pressed="false"><i class="fas fa-clipboard-check"></i> Assessments <span class="count">2</span></button>
</div>

<div class="proj-grid">
<details class="proj" id="cspm-dashboard" data-filter-item data-filter-group="proj" data-cat="cloud">
  <summary class="proj-card">
    <div class="proj-top">
      <span class="proj-kicker">Cloud posture · AWS + Azure</span>
      <span class="pill pill-ok">Completed</span>
    </div>
    <h3 class="proj-title">Cloud Security Posture Dashboard</h3>
    <p class="proj-summary">Terraform deploys deliberately misconfigured AWS and Azure resources, Prowler and ScoutSuite scan them, and a Flask dashboard normalises 500+ checks into one findings schema with remediation commands and CIS / NIST / PCI mapping.</p>
    <div class="tag-row"><span>Terraform</span><span>Prowler</span><span>ScoutSuite</span><span>Python</span><span>Flask</span><span>AWS</span><span>Azure</span></div>
    <div class="proj-foot">
      <span><i class="fab fa-github"></i> noble-antwi/cloud-security-posture-dashboard</span>
      <span class="proj-open"><span class="when-closed">Read case study</span><span class="when-open">Collapse</span><i class="fas fa-chevron-down"></i></span>
    </div>
  </summary>
  <div class="proj-body">
    <div class="proj-body-inner">
<div class="proj-links">
      <a href="https://github.com/noble-antwi/cloud-security-posture-dashboard" target="_blank">
        <i class="fab fa-github"></i> GitHub Repository
      </a>
    </div>

    <p><strong>Objective:</strong> Build a comprehensive multi-cloud security assessment platform that automates the deployment of intentionally misconfigured cloud resources, performs security scanning using industry-standard tools, aggregates findings into unified formats, and visualizes results through an interactive dashboard with automated remediation guidance and compliance mapping.</p>

    <h5><i class="fas fa-cogs"></i> Core Technologies & Stack</h5>
    <div class="tech-stack">
      <span class="tech-tag">Terraform</span>
      <span class="tech-tag">Python</span>
      <span class="tech-tag">Flask</span>
      <span class="tech-tag">Prowler</span>
      <span class="tech-tag">ScoutSuite</span>
      <span class="tech-tag">AWS</span>
      <span class="tech-tag">Azure</span>
      <span class="tech-tag">Bootstrap 5</span>
      <span class="tech-tag">Chart.js</span>
      <span class="tech-tag">JSON</span>
      <span class="tech-tag">IAM</span>
      <span class="tech-tag">S3</span>
      <span class="tech-tag">Azure Storage</span>
    </div>

    <div class="quick-stats">
      <div class="stat-item">
        <div class="stat-number">500+</div>
        <div class="stat-label">Security Checks</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">2</div>
        <div class="stat-label">Cloud Platforms</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">6+</div>
        <div class="stat-label">Compliance Frameworks</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">100%</div>
        <div class="stat-label">Automated</div>
      </div>
    </div>

    <h5><i class="fas fa-rocket"></i> Key Features</h5>
    <ul class="proj-list">
      <li><strong>Multi-Cloud Support:</strong> Automated security assessment across AWS and Azure cloud platforms with unified findings aggregation</li>
      <li><strong>Infrastructure as Code:</strong> Terraform-based deployment of intentionally misconfigured resources for testing security controls and scanner accuracy</li>
      <li><strong>Industry-Standard Scanning:</strong> Integration with Prowler 3.x (AWS) and ScoutSuite (Azure) for comprehensive security assessments covering 500+ checks</li>
      <li><strong>Unified Findings Schema:</strong> Python-based aggregation engine that normalizes findings from multiple scanning tools into a consistent format</li>
      <li><strong>Interactive Dashboard:</strong> Flask web application with Bootstrap 5 UI featuring real-time visualization, severity breakdown charts, and filterable findings tables</li>
      <li><strong>Automated Remediation:</strong> Built-in remediation engine with AWS CLI commands for S3 encryption, public access blocking, versioning, and IAM Access Analyzer setup</li>
      <li><strong>Compliance Mapping:</strong> Findings mapped to CIS 2.0, CIS 1.4, CIS 1.5, NIST, PCI-DSS, HIPAA, and GDPR compliance frameworks</li>
      <li><strong>Dry-Run Mode:</strong> Safe testing of remediation scripts before applying changes to production environments</li>
      <li><strong>Batch Remediation:</strong> Support for remediating multiple security findings across resources simultaneously</li>
      <li><strong>Export Capabilities:</strong> JSON and CSV export formats for integration with SIEM tools and reporting systems</li>
    </ul>

    <h5><i class="fas fa-cloud"></i> Supported Cloud Services & Resources</h5>
    <div>
      <div class="callout callout-warn">
        <h6><strong>AWS Resources</strong></h6>
        <p>S3 buckets (encryption, versioning, public access policies), IAM Access Analyzer, CloudTrail logging, VPC security groups, EC2 security configurations, RDS encryption, Lambda security, and 500+ additional security checks via Prowler</p>
      </div>

      <div class="callout callout-info">
        <h6><strong>Azure Resources</strong></h6>
        <p>Storage accounts (security settings, encryption), Network Security Groups, Key Vaults, Virtual Machines, SQL Databases, Active Directory configurations, and comprehensive service coverage via ScoutSuite</p>
      </div>
    </div>

    <h5><i class="fas fa-chart-pie"></i> Dashboard Visualization Features</h5>
    <ul class="proj-list">
      <li><strong>Real-Time Metrics:</strong> Summary cards displaying total findings, critical/high/medium/low severity counts, and affected resources</li>
      <li><strong>Severity Distribution:</strong> Interactive doughnut chart showing the proportion of findings by severity level</li>
      <li><strong>Cloud Provider Comparison:</strong> Bar chart comparing security findings across AWS and Azure environments</li>
      <li><strong>Searchable Findings Table:</strong> Filter and search capabilities for quickly locating specific security issues</li>
      <li><strong>Detailed Findings View:</strong> Expandable rows with remediation guidance, affected resources, and compliance framework mapping</li>
      <li><strong>Severity Badges:</strong> Color-coded severity indicators (Critical=Red, High=Orange, Medium=Yellow, Low=Blue)</li>
    </ul>

    <h5><i class="fas fa-tools"></i> Five-Stage Security Pipeline</h5>
    <div class="callout">
      <p><strong>1. Deploy:</strong> Terraform provisions intentionally misconfigured AWS and Azure resources for testing</p>
      <p><strong>2. Scan:</strong> Prowler and ScoutSuite perform automated security assessments with 500+ checks</p>
      <p><strong>3. Aggregate:</strong> Python scripts normalize findings from multiple tools into unified JSON schema</p>
      <p><strong>4. Visualize:</strong> Flask dashboard displays findings with charts, filters, and detailed remediation guidance</p>
      <p><strong>5. Remediate:</strong> Automated scripts fix identified issues with dry-run mode for safe testing</p>
    </div>

    <h5><i class="fas fa-shield-alt"></i> Use Cases & Applications</h5>
    <ul class="proj-list">
      <li><strong>Security Tool Validation:</strong> Test and validate security scanning tools in controlled environments before production deployment</li>
      <li><strong>Cloud Security Training:</strong> Learn common cloud misconfigurations and remediation techniques in safe sandbox environments</li>
      <li><strong>DevSecOps Pipeline Integration:</strong> Build security automation pipelines with automated scanning and remediation capabilities</li>
      <li><strong>Compliance Auditing:</strong> Map security findings to compliance frameworks (CIS, NIST, PCI-DSS, HIPAA, GDPR) for audit preparation</li>
      <li><strong>Security Posture Assessment:</strong> Continuously monitor multi-cloud security posture with unified visibility across AWS and Azure</li>
    </ul>

    <h5><i class="fas fa-graduation-cap"></i> Technical Skills Demonstrated</h5>
    <div class="callout callout-ok">
      <p><strong>Cloud Security:</strong> AWS security services (IAM, S3, CloudTrail), Azure security (Storage, NSG, Key Vault), security scanning tools (Prowler, ScoutSuite)</p>
      <p><strong>Infrastructure as Code:</strong> Terraform for multi-cloud resource provisioning and management</p>
      <p><strong>Security Automation:</strong> Python scripting for findings aggregation, automated remediation, and compliance mapping</p>
      <p><strong>Web Development:</strong> Flask backend, Bootstrap 5 frontend, Chart.js data visualization, RESTful API design</p>
      <p><strong>DevSecOps:</strong> CI/CD security integration, automated security testing, remediation automation, compliance-as-code</p>
    </div>
    </div>
  </div>
</details>

<details class="proj" id="iam-job-scout" data-filter-item data-filter-group="proj" data-cat="identity">
  <summary class="proj-card">
    <div class="proj-top">
      <span class="proj-kicker">Identity · Tooling</span>
      <span class="pill pill-ok">Completed</span>
    </div>
    <h3 class="proj-title">IAM Job Scout</h3>
    <p class="proj-summary">A FastAPI job board that pulls IAM roles from three job APIs, de-duplicates with fuzzy matching, filters out senior titles, and ships with Prometheus metrics, a Grafana dashboard, and Docker Compose deployment.</p>
    <div class="tag-row"><span>Python</span><span>FastAPI</span><span>PostgreSQL</span><span>Docker</span><span>Prometheus</span><span>Grafana</span></div>
    <div class="proj-foot">
      <span><i class="fab fa-github"></i> noble-antwi/iam-job-scout</span>
      <span class="proj-open"><span class="when-closed">Read case study</span><span class="when-open">Collapse</span><i class="fas fa-chevron-down"></i></span>
    </div>
  </summary>
  <div class="proj-body">
    <div class="proj-body-inner">
<div class="proj-links">
      <a href="https://github.com/noble-antwi/iam-job-scout" target="_blank">
        <i class="fab fa-github"></i> GitHub Repository
      </a>
      <a href="https://github.com/noble-antwi/iam-job-scout/blob/main/docs/MONITORING.md" target="_blank">
        <i class="fas fa-book"></i> Documentation
      </a>
    </div>

    <p><strong>Objective:</strong> Build an automated, production-grade web application that helps junior to mid-level Identity & Access Management (IAM) professionals discover relevant job opportunities across the USA. The application automatically searches for IAM job postings using multiple job APIs (JSearch, Adzuna, and RemoteOK) with intelligent deduplication, filters out senior positions, and presents them in a clean, searchable interface with smart filtering and monitoring capabilities.</p>

    <h5><i class="fas fa-cogs"></i> Core Technologies & Stack</h5>
    <div class="tech-stack">
      <span class="tech-tag">Python</span>
      <span class="tech-tag">FastAPI</span>
      <span class="tech-tag">Jinja2 Templates</span>
      <span class="tech-tag">TailwindCSS</span>
      <span class="tech-tag">SQLite</span>
      <span class="tech-tag">PostgreSQL</span>
      <span class="tech-tag">APScheduler</span>
      <span class="tech-tag">Prometheus</span>
      <span class="tech-tag">Grafana</span>
      <span class="tech-tag">Docker</span>
      <span class="tech-tag">Docker Compose</span>
      <span class="tech-tag">JSearch API</span>
      <span class="tech-tag">Adzuna API</span>
      <span class="tech-tag">RemoteOK API</span>
    </div>

    <div class="quick-stats">
      <div class="stat-item">
        <div class="stat-number">12+</div>
        <div class="stat-label">API Endpoints</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">30+</div>
        <div class="stat-label">Metrics Tracked</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">3</div>
        <div class="stat-label">Deployment Options</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">100%</div>
        <div class="stat-label">Dockerized</div>
      </div>
    </div>

    <h5><i class="fas fa-rocket"></i> Key Features</h5>
    <ul class="proj-list">
      <li><strong>Multi-API Integration:</strong> Searches JSearch (Indeed, LinkedIn, Glassdoor), Adzuna, and RemoteOK concurrently for comprehensive job coverage across multiple platforms</li>
      <li><strong>Smart Deduplication:</strong> Uses fuzzy matching algorithms to automatically eliminate duplicate job listings from different sources</li>
      <li><strong>Smart Job Filtering:</strong> Automatically excludes senior/advanced roles while focusing on junior to mid-level positions (0-5 years experience)</li>
      <li><strong>Full-Text Search:</strong> Search across job title, company name, and description with real-time results</li>
      <li><strong>Location Filtering:</strong> Geographic filtering to find jobs in specific regions</li>
      <li><strong>Multiple Sorting Options:</strong> Sort by newest, oldest, relevance, or company name</li>
      <li><strong>Job Status Tracking:</strong> Mark jobs as saved, applied, or hidden to manage your application process</li>
      <li><strong>Auto-Cleanup:</strong> Jobs older than 30 days are automatically removed to keep listings fresh</li>
      <li><strong>Scheduled Scanning:</strong> Configurable automatic job searches (default: Monday/Wednesday/Saturday)</li>
      <li><strong>Similar Job Suggestions:</strong> View related opportunities when viewing job details</li>
      <li><strong>Admin Panel:</strong> Secure, password-protected admin interface for manual job scanning</li>
      <li><strong>Demo Mode:</strong> Works without API keys using sample data for testing</li>
      <li><strong>API Token Protection:</strong> Secure endpoints for cron-triggered operations</li>
      <li><strong>Production Monitoring:</strong> Built-in Prometheus metrics and Grafana dashboard support</li>
    </ul>

    <h5><i class="fas fa-filter"></i> Intelligent Filtering Logic</h5>
    <div class="callout">
      <p><strong>Excluded Keywords (Senior Roles):</strong> senior, sr, principal, architect, lead, manager, director, head, vp, staff, distinguished, chief</p>
      <p><strong>Included Keywords (Junior/Mid Roles):</strong> analyst, associate, administrator, engineer, specialist, iam, identity, okta, entra, azure ad, sso, saml, oidc, scim, iga, pam, sailpoint, saviynt, ping, cyberark</p>
      <p><strong>Experience Filters:</strong> Include 0-5, 1-3, 2-4, 3-5 years | Exclude 7+, 10+, 12+ years</p>
    </div>

    <h5><i class="fas fa-chart-line"></i> Production-Grade Monitoring & Observability</h5>
    <div>
      <div class="callout callout-ok">
        <h6><strong>Application Performance Metrics</strong></h6>
        <p>HTTP request duration histograms (p50, p95, p99), request rate by endpoint, error rate tracking, and concurrent request monitoring</p>
      </div>

      <div class="callout callout-info">
        <h6><strong>Business Metrics</strong></h6>
        <p>Total jobs in database, new jobs this week, saved/applied job tracking, scan success rate, and last successful scan timestamp</p>
      </div>

      <div class="callout callout-warn">
        <h6><strong>Database & System Metrics</strong></h6>
        <p>Query duration tracking, active connection pool utilization, database operations by type, memory usage, and Python garbage collection metrics</p>
      </div>
    </div>

    <h5><i class="fas fa-server"></i> API Endpoints & Architecture</h5>
    <div class="callout">
      <p><strong>Public Endpoints:</strong> Main job board with search/filters, individual job details, admin login, JSON API for jobs/stats, health check, Prometheus metrics</p>
      <p><strong>Protected Endpoints (Session Auth or API Token):</strong> Manual job scan trigger, automatic cleanup of old jobs (30+ days)</p>
    </div>

    <h5><i class="fas fa-cloud"></i> Deployment Options</h5>
    <div class="callout-grid">
      <div class="callout callout-ok">
        <h6><i class="fas fa-rocket"></i> Render (Recommended)</h6>
        <p>Easiest deployment with built-in cron job support, automatic HTTPS, and zero-config environment</p>
      </div>

      <div class="callout callout-info">
        <h6><i class="fab fa-docker"></i> Fly.io</h6>
        <p>Docker-based deployment with generous free tier and global edge network support</p>
      </div>

      <div class="callout callout-warn">
        <h6><i class="fas fa-server"></i> VPS</h6>
        <p>Full control deployment on DigitalOcean, AWS Lightsail, or Ubuntu Server with Docker Compose</p>
      </div>
    </div>

    <h5><i class="fas fa-shield-alt"></i> Security Features</h5>
    <ul class="proj-list">
      <li><strong>Password-Protected Admin Panel:</strong> Secure authentication for manual job scanning operations</li>
      <li><strong>API Token Authentication:</strong> X-ADMIN-TOKEN header validation for cron job endpoints</li>
      <li><strong>Session Secret Encryption:</strong> Secure session management with cryptographic session keys</li>
      <li><strong>Environment Variable Configuration:</strong> Sensitive credentials stored outside codebase</li>
      <li><strong>Production Security Recommendations:</strong> Documented best practices for secure deployment</li>
    </ul>

    <h5><i class="fas fa-lightbulb"></i> Technical Highlights & Best Practices</h5>
    <div>
      <div class="progress-row">
        <div class="progress-label">
          <span><strong>FastAPI Modern Python Backend</strong></span>
        </div>
        <p>Asynchronous API with automatic OpenAPI documentation, type hints, and validation</p>
      </div>

      <div class="progress-row">
        <div class="progress-label">
          <span><strong>Production Monitoring Stack</strong></span>
        </div>
        <p>Prometheus metrics with Grafana dashboards for real-time performance tracking and alerting</p>
      </div>

      <div class="progress-row">
        <div class="progress-label">
          <span><strong>Automated Job Scheduling</strong></span>
        </div>
        <p>APScheduler for background tasks with configurable daily scanning and automatic cleanup</p>
      </div>

      <div class="progress-row">
        <div class="progress-label">
          <span><strong>Containerized Architecture</strong></span>
        </div>
        <p>Docker and Docker Compose setup for consistent deployment across all environments</p>
      </div>

      <div class="progress-row">
        <div class="progress-label">
          <span><strong>Flexible Database Support</strong></span>
        </div>
        <p>SQLite for development/small deployments, PostgreSQL support for production scale</p>
      </div>
    </div>

    <h5><i class="fas fa-tools"></i> Comprehensive Documentation</h5>
    <div class="callout callout-purple">
      <p>Quick Start Guide - Get monitoring running in 10 minutes</p>
      <p>Complete Monitoring Guide - Comprehensive documentation with examples</p>
      <p>Architecture Diagram - Visual guide to monitoring setup</p>
      <p>Docker Networking Guide - Tips for container deployments</p>
      <p>Prometheus Configuration Examples - Ready-to-use configs</p>
      <p>Alert Rules - Production-ready alerting setup</p>
    </div>
    </div>
  </div>
</details>

<details class="proj" id="enterprise-iam-lab" data-filter-item data-filter-group="proj" data-cat="identity">
  <summary class="proj-card">
    <div class="proj-top">
      <span class="proj-kicker">Identity lab · Hybrid identity</span>
      <span class="pill pill-warn">In progress</span>
    </div>
    <h3 class="proj-title">Enterprise IAM Lab: Hybrid Identity Architecture</h3>
    <p class="proj-summary">A mid-size organisation's identity stack, built for real: on-prem Active Directory with a tiered admin model, federated to Okta Workforce Identity and Microsoft Entra ID over SAML, OIDC and WS-Fed, with network-aware conditional access and graduated MFA.</p>
    <div class="tag-row"><span>Active Directory</span><span>Okta</span><span>Entra ID</span><span>SAML 2.0</span><span>OIDC</span><span>Conditional Access</span><span>PowerShell</span></div>
    <div class="proj-foot">
      <span><i class="fab fa-github"></i> noble-antwi/enterprise-iam-lab</span>
      <span class="proj-open"><span class="when-closed">Read case study</span><span class="when-open">Collapse</span><i class="fas fa-chevron-down"></i></span>
    </div>
  </summary>
  <div class="proj-body">
    <div class="proj-body-inner">
<div class="proj-links">
      <a href="https://github.com/noble-antwi/enterprise-iam-lab" target="_blank">
        <i class="fab fa-github"></i> GitHub Repository
      </a>
      <a href="https://github.com/noble-antwi/enterprise-iam-lab/blob/main/docs/guides/" target="_blank">
        <i class="fas fa-book"></i> Documentation
      </a>
    </div>

    <p><strong>Objective:</strong> Build a comprehensive 500-1000 user enterprise Identity and Access Management (IAM) environment. This production-grade homelab simulates a medium-sized organization's hybrid identity infrastructure with industry best practices for zero-trust security and modern access management.</p>

    <h5><i class="fas fa-cogs"></i> Core Technologies & Protocols</h5>
    <div class="tech-stack">
      <span class="tech-tag">Windows Server 2022</span>
      <span class="tech-tag">Active Directory</span>
      <span class="tech-tag">OKTA Workforce Identity</span>
      <span class="tech-tag">Microsoft Entra ID</span>
      <span class="tech-tag">PowerShell</span>
      <span class="tech-tag">SAML 2.0</span>
      <span class="tech-tag">OAuth 2.0</span>
      <span class="tech-tag">OIDC</span>
      <span class="tech-tag">SWA</span>
      <span class="tech-tag">LDAP</span>
      <span class="tech-tag">Kerberos</span>
      <span class="tech-tag">WS-Federation</span>
      <span class="tech-tag">OKTA Expression Language</span>
      <span class="tech-tag">Conditional Access</span>
    </div>

    <div class="quick-stats">
      <div class="stat-item">
        <div class="stat-number">35</div>
        <div class="stat-label">User Accounts</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">20</div>
        <div class="stat-label">Organization Units</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">15</div>
        <div class="stat-label">Security Groups</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">6</div>
        <div class="stat-label">Project Phases</div>
      </div>
    </div>

    <h5><i class="fas fa-rocket"></i> Key Features</h5>
    <ul class="proj-list">
      <li><strong>Hybrid Identity Architecture:</strong> Seamless AD + OKTA + Microsoft Entra ID integration</li>
      <li><strong>Tiered Admin Model:</strong> Microsoft Tier 0/1/2 with privilege separation</li>
      <li><strong>Network-Based Conditional Access:</strong> IP zones, geographic controls, Tor blocking</li>
      <li><strong>Graduated MFA:</strong> Hardware-protected for public networks, standard for corporate</li>
      <li><strong>Multi-Protocol Support:</strong> SAML 2.0, OAuth 2.0, OIDC, SWA, LDAP, Kerberos, WS-Federation</li>
      <li><strong>Automated Provisioning:</strong> OKTA Expression Language for dynamic group assignment</li>
    </ul>

    <h5><i class="fas fa-chart-line"></i> Implementation Progress</h5>
    <div>
      <div class="progress-row">
        <div class="progress-label">
          <span>Phases 1-4</span>
          <b>100%</b>
        </div>
        <div class="bar">
          <div class="bar-fill is-ok" style="width: 100%"></div>
        </div>
      </div>
      <div class="progress-row">
        <div class="progress-label">
          <span>Phase 5 (Advanced Security)</span>
          <b>40%</b>
        </div>
        <div class="bar">
          <div class="bar-fill is-warn" style="width: 40%"></div>
        </div>
      </div>
      <div>
        <div class="progress-label">
          <span>Phase 6 (Entra ID)</span>
          <b>Planned</b>
        </div>
        <div class="bar">
          <div class="bar-fill is-purple" style="width: 0%"></div>
        </div>
      </div>
    </div>
    </div>
  </div>
</details>

<details class="proj" id="enterprise-security-homelab" data-filter-item data-filter-group="proj" data-cat="detection">
  <summary class="proj-card">
    <div class="proj-top">
      <span class="proj-kicker">Infrastructure · Detection</span>
      <span class="pill pill-warn">In progress</span>
    </div>
    <h3 class="proj-title">Enterprise Security Homelab</h3>
    <p class="proj-summary">A six-VLAN lab behind pfSense with a Windows Server domain, Linux and Windows hosts under Ansible, Wazuh as the SIEM, Grafana and Prometheus for observability, and Tailscale for remote access. Blue Team first, Red Team VLAN reserved.</p>
    <div class="tag-row"><span>pfSense</span><span>VLANs</span><span>Wazuh</span><span>Ansible</span><span>Windows Server 2022</span><span>Proxmox</span><span>Grafana</span></div>
    <div class="proj-foot">
      <span><i class="fab fa-github"></i> noble-antwi/enterprise-security-homelab</span>
      <span class="proj-open"><span class="when-closed">Read case study</span><span class="when-open">Collapse</span><i class="fas fa-chevron-down"></i></span>
    </div>
  </summary>
  <div class="proj-body">
    <div class="proj-body-inner">
<div class="proj-links">
      <a href="https://github.com/noble-antwi/enterprise-security-homelab" target="_blank">
        <i class="fab fa-github"></i> GitHub Repository
      </a>
      <a href="https://github.com/noble-antwi/enterprise-security-homelab/tree/main/docs" target="_blank">
        <i class="fas fa-book"></i> Complete Documentation
      </a>
    </div>

    <p><strong>Objective:</strong> Build a comprehensive, enterprise-grade cybersecurity homelab implementing professional security practices. This advanced lab environment mimics real-world infrastructure for Blue Team operations, Red Team simulation, and DevSecOps practices across both Linux and Windows platforms with cross-platform automation, SIEM monitoring, and secure remote access.</p>

    <h5><i class="fas fa-cogs"></i> Core Technologies & Infrastructure</h5>
    <div class="tech-stack">
      <span class="tech-tag">pfSense Firewall</span>
      <span class="tech-tag">VLAN Segmentation</span>
      <span class="tech-tag">Wazuh SIEM</span>
      <span class="tech-tag">Grafana/Prometheus</span>
      <span class="tech-tag">Ansible Automation</span>
      <span class="tech-tag">Tailscale Mesh VPN</span>
      <span class="tech-tag">Ubuntu 24.04</span>
      <span class="tech-tag">Rocky Linux 9.6</span>
      <span class="tech-tag">Windows Server 2022</span>
      <span class="tech-tag">WinRM</span>
      <span class="tech-tag">SSH ED25519</span>
      <span class="tech-tag">WireGuard</span>
    </div>

    <div class="quick-stats">
      <div class="stat-item">
        <div class="stat-number">7</div>
        <div class="stat-label">Managed Systems</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">6</div>
        <div class="stat-label">VLAN Segments</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">3</div>
        <div class="stat-label">Active VLANs</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">100%</div>
        <div class="stat-label">Cross-Platform Mgmt</div>
      </div>
    </div>

    <h5><i class="fas fa-rocket"></i> Key Features & Architecture</h5>
    <ul class="proj-list">
      <li><strong>pfSense Enterprise Firewall:</strong> Advanced VLAN routing with 6-VLAN segmentation and security policies</li>
      <li><strong>Cross-Platform Automation:</strong> Ansible managing 6 systems across Linux and Windows seamlessly with service accounts</li>
      <li><strong>Comprehensive Security Monitoring:</strong> Wazuh SIEM collecting and analyzing logs from all platforms in real-time</li>
      <li><strong>Infrastructure Observability:</strong> Grafana + Prometheus monitoring system health and performance metrics</li>
      <li><strong>Secure Remote Access:</strong> Tailscale mesh VPN with WireGuard encryption for global connectivity</li>
      <li><strong>Professional Authentication:</strong> SSH ED25519 keys for Linux, WinRM with service accounts for Windows</li>
      <li><strong>VLAN Isolation:</strong> Management (10), BlueTeam SIEM (20), RedTeam Reserved (30), DevOps (40), Enterprise (50), Monitoring (60)</li>
    </ul>

    <h5><i class="fas fa-chart-line"></i> Deployed Infrastructure</h5>
    <div class="callout">
      <p><strong>Linux Systems (4):</strong> Ansible Controller (Ubuntu), TCM Ubuntu, Grafana Server (Ubuntu), Wazuh SIEM (Rocky Linux)</p>
      <p><strong>Windows Systems (2):</strong> Windows Host Laptop (Dev/Testing), Windows Server 2022 (Enterprise Services)</p>
      <p><strong>Network:</strong> pfSense Firewall, TP-Link Managed Switch with VLAN support</p>
    </div>

    <h5><i class="fas fa-list-check"></i> Implementation Status</h5>
    <div>
      <div class="progress-row">
        <div class="progress-label">
          <span>Phase 1: Foundation (Network & Security)</span>
          <b>100%</b>
        </div>
        <div class="bar">
          <div class="bar-fill is-ok" style="width: 100%"></div>
        </div>
      </div>
      <div class="progress-row">
        <div class="progress-label">
          <span>Phase 2: Advanced Security & Monitoring</span>
          <b>In Progress</b>
        </div>
        <div class="bar">
          <div class="bar-fill is-warn" style="width: 75%"></div>
        </div>
      </div>
      <div class="progress-row">
        <div class="progress-label">
          <span>Phase 3: Red Team Capabilities</span>
          <b>Planned</b>
        </div>
        <div class="bar">
          <div class="bar-fill is-info" style="width: 0%"></div>
        </div>
      </div>
      <div>
        <div class="progress-label">
          <span>Phase 4: DevSecOps Integration</span>
          <b>Future</b>
        </div>
        <div class="bar">
          <div class="bar-fill is-purple" style="width: 0%"></div>
        </div>
      </div>
    </div>

    <h5><i class="fas fa-shield-alt"></i> Use Cases & Capabilities</h5>
    <ul class="proj-list">
      <li><strong>Blue Team Operations:</strong> Comprehensive threat detection with Wazuh SIEM monitoring across all platforms</li>
      <li><strong>Cross-Platform Management:</strong> Unified Ansible automation for consistent Linux and Windows configuration</li>
      <li><strong>Infrastructure Observability:</strong> Real-time performance monitoring and dashboards via Grafana/Prometheus</li>
      <li><strong>Red Team Simulation:</strong> Dedicated VLAN for controlled attack simulation and penetration testing (planned)</li>
      <li><strong>Security Research:</strong> Multi-platform testing environment for security tools and configurations</li>
      <li><strong>DevSecOps Development:</strong> Foundation for CI/CD security pipeline integration (future)</li>
    </ul>
    </div>
  </div>
</details>

<details class="proj" id="aws-cost-optimizer" data-filter-item data-filter-group="proj" data-cat="cloud">
  <summary class="proj-card">
    <div class="proj-top">
      <span class="proj-kicker">Cloud · Automation</span>
      <span class="pill pill-warn">In progress</span>
    </div>
    <h3 class="proj-title">AWS Cost Optimizer</h3>
    <p class="proj-summary">A Boto3 tool that scans an AWS account for idle and oversized resources, scores right-sizing and reserved-capacity opportunities, and can apply the safe ones behind an approval step.</p>
    <div class="tag-row"><span>Python</span><span>Boto3</span><span>Cost Explorer</span><span>EC2</span><span>RDS</span><span>Automation</span></div>
    <div class="proj-foot">
      <span><i class="fab fa-github"></i> noble-antwi/aws-cost-optimizer</span>
      <span class="proj-open"><span class="when-closed">Read case study</span><span class="when-open">Collapse</span><i class="fas fa-chevron-down"></i></span>
    </div>
  </summary>
  <div class="proj-body">
    <div class="proj-body-inner">
<div class="proj-links">
      <a href="https://github.com/noble-antwi/aws-cost-optimizer" target="_blank">
        <i class="fab fa-github"></i> GitHub Repository
      </a>
    </div>

    <p><strong>Objective:</strong> Develop an automated AWS cost optimization tool that identifies and implements cost-saving opportunities across AWS infrastructure. This project combines infrastructure analysis, intelligent recommendations, and automated remediation to help organizations reduce cloud spending without compromising performance or reliability.</p>

    <h5><i class="fas fa-cogs"></i> Core Technologies & Components</h5>
    <div class="tech-stack">
      <span class="tech-tag">Python</span>
      <span class="tech-tag">AWS SDK (Boto3)</span>
      <span class="tech-tag">AWS Cost Explorer</span>
      <span class="tech-tag">AWS Trusted Advisor</span>
      <span class="tech-tag">EC2</span>
      <span class="tech-tag">RDS</span>
      <span class="tech-tag">Elastic Load Balancing</span>
      <span class="tech-tag">Data Analysis</span>
      <span class="tech-tag">Reporting</span>
    </div>

    <div class="quick-stats">
      <div class="stat-item">
        <div class="stat-number">Multiple</div>
        <div class="stat-label">AWS Services Analyzed</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">Real-time</div>
        <div class="stat-label">Cost Insights</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">Automated</div>
        <div class="stat-label">Remediation</div>
      </div>
    </div>

    <h5><i class="fas fa-rocket"></i> Key Features</h5>
    <ul class="proj-list">
      <li><strong>Infrastructure Analysis:</strong> Comprehensive scanning of AWS resources to identify underutilized and oversized instances</li>
      <li><strong>Intelligent Recommendations:</strong> Data-driven suggestions for cost optimization including instance rightsizing, reserved instance strategies, and storage optimization</li>
      <li><strong>Automated Remediation:</strong> Implement cost-saving actions automatically or with approval workflows</li>
      <li><strong>Cost Tracking:</strong> Monitor estimated savings and actual cost reductions over time</li>
      <li><strong>Reporting Dashboard:</strong> Detailed reports and visualizations of optimization opportunities and savings</li>
    </ul>

    <h5><i class="fas fa-chart-line"></i> Optimization Areas</h5>
    <div class="callout">
      <p><strong>Compute Optimization:</strong> EC2 instance rightsizing, stopping idle instances, reserved instance recommendations</p>
      <p><strong>Database Optimization:</strong> RDS instance rightsizing, storage optimization, backup retention policies</p>
      <p><strong>Network Optimization:</strong> Unused Elastic IPs, cross-AZ data transfer optimization, NAT gateway efficiency</p>
      <p><strong>Storage Optimization:</strong> Unattached volumes, S3 storage class analysis, old snapshot cleanup</p>
    </div>

    <h5><i class="fas fa-dollar-sign"></i> Cost-Saving Mechanisms</h5>
    <div>
      <div class="callout callout-ok">
        <h6><strong>1. Right-Sizing Analysis</strong></h6>
        <p>Analyzes CPU, memory, and network utilization patterns over time to recommend optimal instance types. Organizations typically save 20-40% by downsizing over-provisioned instances.</p>
      </div>

      <div class="callout callout-ok">
        <h6><strong>2. Reserved Instance (RI) Optimization</strong></h6>
        <p>Identifies consistent workloads suitable for Reserved Instances and Savings Plans, providing up to 70% savings compared to on-demand pricing. Tool recommends optimal RI purchase strategies.</p>
      </div>

      <div class="callout callout-ok">
        <h6><strong>3. Idle Resource Elimination</strong></h6>
        <p>Detects and flags unused EC2 instances, RDS databases, EBS volumes, and Elastic IPs. Quick wins for cleanup typically yield 10-25% immediate cost reduction.</p>
      </div>

      <div class="callout callout-ok">
        <h6><strong>4. Storage Tiering</strong></h6>
        <p>Recommends moving infrequently accessed data to cheaper storage classes (S3 Standard-IA, Glacier). Can save 70-90% on storage costs for archival data.</p>
      </div>

      <div class="callout callout-ok">
        <h6><strong>5. Automation Scheduling</strong></h6>
        <p>Implements automated start/stop schedules for non-production environments, saving 40-60% on compute for development and testing workloads.</p>
      </div>
    </div>
    </div>
  </div>
</details>

<details class="proj" id="collins-aerospace-audit" data-filter-item data-filter-group="proj" data-cat="assessment">
  <summary class="proj-card">
    <div class="proj-top">
      <span class="proj-kicker">Assessment · IT audit</span>
      <span class="pill pill-info">Academic · Completed</span>
    </div>
    <h3 class="proj-title">Collins Aerospace IT Audit: Post-Incident Assessment</h3>
    <p class="proj-summary">A graduate IT-audit engagement on a simulated aerospace breach: COBIT-framed planning, NIST 800-30 risk assessment, CMMC Level 3 gap analysis, five headline findings, and a costed remediation roadmap.</p>
    <div class="tag-row"><span>COBIT 2019</span><span>NIST 800-30</span><span>NIST 800-171</span><span>CMMC 2.0</span><span>ISO 27001</span><span>Risk assessment</span></div>
    <div class="proj-foot">
      <span><i class="fab fa-github"></i> noble-antwi/collins-aerospace-audit</span>
      <span class="proj-open"><span class="when-closed">Read case study</span><span class="when-open">Collapse</span><i class="fas fa-chevron-down"></i></span>
    </div>
  </summary>
  <div class="proj-body">
    <div class="proj-body-inner">
<div class="proj-links">
      <a href="https://github.com/noble-antwi/collins-aerospace-audit" target="_blank">
        <i class="fab fa-github"></i> GitHub Repository
      </a>
      <a href="https://github.com/noble-antwi/collins-aerospace-audit/blob/main/docs/audit-findings-report.md" target="_blank">
        <i class="fas fa-file-alt"></i> Full Audit Report
      </a>
    </div>

    <p><strong>Objective:</strong> Conduct a comprehensive IT audit engagement of Collins Aerospace's information security controls following a simulated cybersecurity incident. This graduate-level project demonstrates practical application of IT audit frameworks, risk assessment methodologies, CMMC Level 3 gap analysis, and remediation planning for an enterprise aerospace organization.</p>

    <h5><i class="fas fa-cogs"></i> Frameworks & Methodologies Applied</h5>
    <div class="tech-stack">
      <span class="tech-tag">COBIT 2019</span>
      <span class="tech-tag">NIST SP 800-30</span>
      <span class="tech-tag">NIST SP 800-53</span>
      <span class="tech-tag">NIST SP 800-171/172</span>
      <span class="tech-tag">CMMC 2.0</span>
      <span class="tech-tag">ISO/IEC 27001:2022</span>
      <span class="tech-tag">COSO</span>
      <span class="tech-tag">Risk Assessment</span>
      <span class="tech-tag">Control Testing</span>
      <span class="tech-tag">Remediation Planning</span>
    </div>

    <div class="quick-stats">
      <div class="stat-item">
        <div class="stat-number">5</div>
        <div class="stat-label">Key Findings</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">$4.5M+</div>
        <div class="stat-label">Remediation Cost</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">$2.3B</div>
        <div class="stat-label">Contracts at Risk</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">18</div>
        <div class="stat-label">Risks Identified</div>
      </div>
    </div>

    <h5><i class="fas fa-exclamation-triangle"></i> Critical Audit Findings</h5>
    <div class="callout callout-danger">
      <table class="findings-table">
        <tr>
          <td><strong>1. Inadequate MFA</strong></td>
          <td class="sev sev-critical">CRITICAL</td>
          <td>60.5% of VPN accounts lack MFA</td>
        </tr>
        <tr>
          <td><strong>2. Privileged Access Gaps</strong></td>
          <td class="sev sev-high">HIGH</td>
          <td>No reviews in 30 months</td>
        </tr>
        <tr>
          <td><strong>3. Incident Response</strong></td>
          <td class="sev sev-high">HIGH</td>
          <td>16-18 hour detection delay</td>
        </tr>
        <tr>
          <td><strong>4. Backup & DR</strong></td>
          <td class="sev sev-critical">CRITICAL</td>
          <td>No air-gapped backups</td>
        </tr>
        <tr>
          <td><strong>5. Vendor Security</strong></td>
          <td class="sev sev-medium">MEDIUM</td>
          <td>47 vendors unassessed</td>
        </tr>
      </table>
    </div>

    <h5><i class="fas fa-folder-open"></i> Project Deliverables</h5>
    <ul class="proj-list">
      <li><strong>Audit Planning Memo:</strong> Comprehensive planning documentation and scope definition</li>
      <li><strong>Executive Presentation:</strong> Board-level findings and recommendations presentation</li>
      <li><strong>Control Testing Procedures:</strong> Detailed testing methodology and evidence collection</li>
      <li><strong>Remediation Roadmap:</strong> Prioritized implementation plan with cost estimates</li>
      <li><strong>Incident Timeline Analysis:</strong> Attack timeline reconstruction and root cause analysis</li>
      <li><strong>NIST Risk Assessment:</strong> 8 complete assessment tables with threat modeling</li>
    </ul>

    <h5><i class="fas fa-chart-line"></i> Business Impact Analysis</h5>
    <div class="callout">
      <p><strong>Direct Incident Costs:</strong> $15M+ in losses</p>
      <p><strong>Operational Impact:</strong> 217 flights cancelled, 2.8M transactions lost</p>
      <p><strong>Compliance Risk:</strong> CMMC Level 3 certification required Q2 2026</p>
    </div>

    <h5><i class="fas fa-graduation-cap"></i> Academic Context</h5>
    <p>Completed as part of ITMM 586 - Information Technology Auditing at Illinois Institute of Technology (Fall 2025). The project included 12+ weekly discussions on audit concepts, ethics case studies, and real-world incident analysis including the CrowdStrike global outage (July 2024).</p>
    </div>
  </div>
</details>

<details class="proj" id="cyberdyne-security-assessment" data-filter-item data-filter-group="proj" data-cat="assessment">
  <summary class="proj-card">
    <div class="proj-top">
      <span class="proj-kicker">Assessment · Security program</span>
      <span class="pill pill-info">Academic · Completed</span>
    </div>
    <h3 class="proj-title">Cyberdyne Systems: Enterprise Security Assessment</h3>
    <p class="proj-summary">A defense-in-depth program for a fictional 400-person manufacturer across two countries: 16 vulnerabilities, 13 technical controls, 11 policies, and a three-phase rollout that starts with the EOL fleet and identity.</p>
    <div class="tag-row"><span>NIST CSF</span><span>NIST 800-171</span><span>Active Directory</span><span>SIEM</span><span>Defense in depth</span><span>Policy</span></div>
    <div class="proj-foot">
      <span><i class="fab fa-github"></i> noble-antwi/cyberdyne-security-assessment</span>
      <span class="proj-open"><span class="when-closed">Read case study</span><span class="when-open">Collapse</span><i class="fas fa-chevron-down"></i></span>
    </div>
  </summary>
  <div class="proj-body">
    <div class="proj-body-inner">
<div class="proj-links">
      <a href="https://github.com/noble-antwi/cyberdyne-security-assessment" target="_blank">
        <i class="fab fa-github"></i> GitHub Repository
      </a>
      <a href="https://github.com/noble-antwi/cyberdyne-security-assessment/blob/main/deliverables/Cyberdyne_Security_Assessment_Report.md" target="_blank">
        <i class="fas fa-file-alt"></i> Full Assessment Report
      </a>
    </div>

    <p><strong>Objective:</strong> Conduct a comprehensive enterprise security assessment for Cyberdyne Systems Corporation, a fictional AI and robotics manufacturing company with 400 employees across California and Taiwan. The assessment identifies critical vulnerabilities and provides a complete defense-in-depth security program addressing technology, policy, and human factors.</p>

    <h5><i class="fas fa-cogs"></i> Frameworks & Technologies Evaluated</h5>
    <div class="tech-stack">
      <span class="tech-tag">NIST CSF</span>
      <span class="tech-tag">NIST 800-171</span>
      <span class="tech-tag">CCPA</span>
      <span class="tech-tag">Active Directory</span>
      <span class="tech-tag">Kerberos</span>
      <span class="tech-tag">Group Policy</span>
      <span class="tech-tag">LUKS Encryption</span>
      <span class="tech-tag">BitLocker</span>
      <span class="tech-tag">UFW/iptables</span>
      <span class="tech-tag">SIEM</span>
      <span class="tech-tag">VPN/MFA</span>
      <span class="tech-tag">MDM</span>
    </div>

    <div class="quick-stats">
      <div class="stat-item">
        <div class="stat-number">16</div>
        <div class="stat-label">Vulnerabilities Found</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">13</div>
        <div class="stat-label">Technical Controls</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">11</div>
        <div class="stat-label">Security Policies</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">800+</div>
        <div class="stat-label">Devices Assessed</div>
      </div>
    </div>

    <h5><i class="fas fa-exclamation-triangle"></i> Key Findings by Category</h5>
    <div class="callout callout-danger">
      <table class="findings-table">
        <tr>
          <td><strong>End-of-Life Systems</strong></td>
          <td class="sev sev-critical">CRITICAL</td>
          <td>800+ devices running EOL OS (Ubuntu 10.04, Windows 10 v1607)</td>
        </tr>
        <tr>
          <td><strong>Endpoint Protection</strong></td>
          <td class="sev sev-critical">CRITICAL</td>
          <td>No centralized antivirus deployment</td>
        </tr>
        <tr>
          <td><strong>Data Protection</strong></td>
          <td class="sev sev-critical">CRITICAL</td>
          <td>Unencrypted data transport between facilities</td>
        </tr>
        <tr>
          <td><strong>Access Management</strong></td>
          <td class="sev sev-high">HIGH</td>
          <td>No centralized identity management</td>
        </tr>
        <tr>
          <td><strong>Hardware Security</strong></td>
          <td class="sev sev-high">HIGH</td>
          <td>Excessive USB ports, insufficient resources</td>
        </tr>
      </table>
    </div>

    <h5><i class="fas fa-layer-group"></i> Defense-in-Depth Strategy</h5>
    <div class="callout">
      <p><strong>Human Layer:</strong> 8 training programs including role-based specialized training</p>
      <p><strong>Policy Layer:</strong> 11 security policies (AUP, Data Classification, Incident Response)</p>
      <p><strong>Technology Layer:</strong> 13 controls (AD, SIEM, VPN/MFA, Encryption, DLP)</p>
    </div>

    <h5><i class="fas fa-tasks"></i> Recommended Controls (Phased)</h5>
    <ul class="proj-list">
      <li><strong>Phase 1 (Immediate):</strong> OS Upgrade Program, Enterprise Endpoint Protection, Full-Disk Encryption, Active Directory</li>
      <li><strong>Phase 2:</strong> SIEM Implementation, VPN with MFA, Mobile Device Management, Host Firewalls</li>
      <li><strong>Phase 3:</strong> Standardized Imaging, Data Loss Prevention, Asset Management, USB Device Control</li>
    </ul>

    <h5><i class="fas fa-building"></i> Organization Profile</h5>
    <div class="callout">
      <p><strong>Employees:</strong> 400 across 9 job categories</p>
      <p><strong>Locations:</strong> California (HQ/R&D) and Taiwan (Manufacturing)</p>
      <p><strong>Device Mix:</strong> 300 Windows laptops, 200 Linux desktops, 150 Android tablets, 100+ servers</p>
      <p><strong>Compliance:</strong> CCPA, PDPC, NIST 800-171, FAR/DFARS</p>
    </div>

    <h5><i class="fas fa-graduation-cap"></i> Academic Context</h5>
    <p>Completed as part of ITMO-X58 - Operating System Security at Illinois Institute of Technology (Fall 2025). This capstone project integrates concepts from Linux security mechanisms, Windows security technologies, mobile security, and defense-in-depth architecture.</p>
    </div>
  </div>
</details>
</div>

<div class="filter-empty" data-filter-group="proj"><p>No projects in this category yet.</p></div>

<section class="home-section" style="margin-top: 4rem;">
  <div class="section-head">
    <div>
      <h2>Smaller labs</h2>
      <p>Shorter exercises that fed into the bigger builds. More of these live in the <a href="/blog?posts=lab-notes" class="section-link">lab notes</a>.</p>
    </div>
  </div>
  <div class="mini-grid">
    <div class="mini-card" data-filter-item data-filter-group="proj" data-cat="identity">
      <h3><i class="fab fa-microsoft"></i> Multi-Factor Authentication in Azure</h3>
      <p>Configured MFA, conditional access rules and role-based access control for a simulated enterprise tenant in Entra ID, scripted with PowerShell.</p>
      <div class="tag-row"><span>Entra ID</span><span>MFA</span><span>Conditional Access</span><span>RBAC</span><span>PowerShell</span></div>
    </div>
    <div class="mini-card" data-filter-item data-filter-group="proj" data-cat="detection">
      <h3><i class="fas fa-network-wired"></i> Network Traffic Analysis with Wireshark</h3>
      <p>Packet-level investigation of reconnaissance, port scanning and brute-force attempts: reading the protocols, spotting the patterns, and writing up what the traffic actually showed.</p>
      <div class="tag-row"><span>Wireshark</span><span>tcpdump</span><span>Packet analysis</span><span>Threat detection</span></div>
    </div>
  </div>
</section>

<div class="cta-band">
  <p>The repositories are public, and the documentation is written so someone else could rebuild the lab.</p>
  <a href="https://github.com/{{ site.social.github }}" class="btn" target="_blank" rel="noopener"><i class="fab fa-github"></i> Browse GitHub</a>
  <a href="/contact" class="btn btn-secondary"><i class="fas fa-envelope"></i> Get in touch</a>
</div>
