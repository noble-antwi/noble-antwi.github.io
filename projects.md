
---

layout: default
title: Projects
---

<h1><i class="fas fa-project-diagram"></i> Featured Project Case Studies</h1>

<style>
.project-accordion {
  border: 1px solid rgba(6, 182, 212, 0.3);
  border-radius: 12px;
  margin-bottom: 2rem;
  overflow: visible;
  background: var(--bg-light);
}

.project-accordion summary {
  padding: 1.5rem;
  cursor: pointer;
  background: rgba(6, 182, 212, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.3s ease;
  user-select: none;
  list-style: none;
  border-bottom: 1px solid rgba(6, 182, 212, 0.2);
}

.project-accordion summary::-webkit-details-marker {
  display: none !important;
}

.project-accordion summary:hover {
  background: rgba(6, 182, 212, 0.1);
}

.project-accordion summary h3 {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex: 1;
  color: var(--accent);
  font-size: 1.3rem;
}

.project-accordion summary .chevron {
  font-size: 1.2rem;
  color: var(--accent);
  transition: transform 0.3s ease;
  margin-left: 1rem;
  flex-shrink: 0;
}

.project-accordion[open] summary {
  border-bottom: 1px solid rgba(6, 182, 212, 0.3);
}

.project-accordion[open] summary .chevron {
  transform: rotate(180deg);
}

.project-accordion .project-content {
  padding: 2rem;
  border-top: 1px solid rgba(6, 182, 212, 0.2);
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.quick-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
  padding: 1.5rem;
  background: rgba(6, 182, 212, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(6, 182, 212, 0.2);
}

.stat-item {
  text-align: center;
  padding: 0.5rem;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--accent);
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-top: 0.3rem;
}

.accordion-badges {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.accordion-links {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.accordion-links a {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background: rgba(6, 182, 212, 0.1);
  color: var(--accent);
  text-decoration: none;
  border-radius: 6px;
  border: 1px solid var(--accent);
  transition: all 0.3s;
  font-size: 0.95rem;
}

.accordion-links a:hover {
  background: rgba(6, 182, 212, 0.2);
}
</style>

<details class="project-accordion">
  <summary>
    <h3><i class="fas fa-key"></i> Enterprise IAM Lab: Hybrid Identity Architecture</h3>
    <span class="chevron"><i class="fas fa-chevron-down"></i></span>
  </summary>
  
  <div class="project-content">
    <div class="accordion-badges">
      <span style="background: rgba(255, 152, 0, 0.2); color: #ff9800; padding: 0.25rem 0.6rem; border-radius: 12px; font-size: 0.85rem; border: 1px solid #ff9800;">In Progress</span>
      <span style="background: rgba(76, 175, 80, 0.2); color: #4caf50; padding: 0.25rem 0.6rem; border-radius: 12px; font-size: 0.85rem; border: 1px solid #4caf50;">Large Project</span>
      <span style="background: rgba(156, 39, 176, 0.2); color: #9c27b0; padding: 0.25rem 0.6rem; border-radius: 12px; font-size: 0.85rem; border: 1px solid #9c27b0;">Production-Grade</span>
    </div>

    <div class="accordion-links">
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

    <h5 style="margin-top: 1.5rem;"><i class="fas fa-rocket"></i> Key Features</h5>
    <ul style="margin-left: 1.5rem; line-height: 1.8;">
      <li><strong>Hybrid Identity Architecture:</strong> Seamless AD + OKTA + Microsoft Entra ID integration</li>
      <li><strong>Tiered Admin Model:</strong> Microsoft Tier 0/1/2 with privilege separation</li>
      <li><strong>Network-Based Conditional Access:</strong> IP zones, geographic controls, Tor blocking</li>
      <li><strong>Graduated MFA:</strong> Hardware-protected for public networks, standard for corporate</li>
      <li><strong>Multi-Protocol Support:</strong> SAML 2.0, OAuth 2.0, OIDC, SWA, LDAP, Kerberos, WS-Federation</li>
      <li><strong>Automated Provisioning:</strong> OKTA Expression Language for dynamic group assignment</li>
    </ul>

    <h5 style="margin-top: 1.5rem;"><i class="fas fa-chart-line"></i> Implementation Progress</h5>
    <div style="margin: 1rem 0;">
      <div style="margin-bottom: 0.8rem;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.3rem;">
          <span style="font-size: 0.95rem;">Phases 1-4</span>
          <span style="color: #4caf50; font-weight: bold;">100%</span>
        </div>
        <div style="height: 6px; background: #e0e0e0; border-radius: 3px;">
          <div style="height: 100%; width: 100%; background: #4caf50; border-radius: 3px;"></div>
        </div>
      </div>
      <div style="margin-bottom: 0.8rem;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.3rem;">
          <span style="font-size: 0.95rem;">Phase 5 (Advanced Security)</span>
          <span style="color: #ff9800; font-weight: bold;">40%</span>
        </div>
        <div style="height: 6px; background: #e0e0e0; border-radius: 3px;">
          <div style="height: 100%; width: 40%; background: #ff9800; border-radius: 3px;"></div>
        </div>
      </div>
      <div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.3rem;">
          <span style="font-size: 0.95rem;">Phase 6 (Entra ID)</span>
          <span style="color: #9c27b0; font-weight: bold;">Planned</span>
        </div>
        <div style="height: 6px; background: #e0e0e0; border-radius: 3px;">
          <div style="height: 100%; width: 0%; background: #9c27b0; border-radius: 3px;"></div>
        </div>
      </div>
    </div>
  </div>
</details>

<details class="project-accordion">
  <summary>
    <h3><i class="fas fa-network-wired"></i> Enterprise Security Homelab: Cross-Platform Infrastructure</h3>
    <span class="chevron"><i class="fas fa-chevron-down"></i></span>
  </summary>
  
  <div class="project-content">
    <div class="accordion-badges">
      <span style="background: rgba(255, 152, 0, 0.2); color: #ff9800; padding: 0.25rem 0.6rem; border-radius: 12px; font-size: 0.85rem; border: 1px solid #ff9800;">In Progress</span>
      <span style="background: rgba(76, 175, 80, 0.2); color: #4caf50; padding: 0.25rem 0.6rem; border-radius: 12px; font-size: 0.85rem; border: 1px solid #4caf50;">Complex Lab</span>
      <span style="background: rgba(156, 39, 176, 0.2); color: #9c27b0; padding: 0.25rem 0.6rem; border-radius: 12px; font-size: 0.85rem; border: 1px solid #9c27b0;">Enterprise-Ready</span>
    </div>

    <div class="accordion-links">
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

    <h5 style="margin-top: 1.5rem;"><i class="fas fa-rocket"></i> Key Features & Architecture</h5>
    <ul style="margin-left: 1.5rem; line-height: 1.8;">
      <li><strong>pfSense Enterprise Firewall:</strong> Advanced VLAN routing with 6-VLAN segmentation and security policies</li>
      <li><strong>Cross-Platform Automation:</strong> Ansible managing 6 systems across Linux and Windows seamlessly with service accounts</li>
      <li><strong>Comprehensive Security Monitoring:</strong> Wazuh SIEM collecting and analyzing logs from all platforms in real-time</li>
      <li><strong>Infrastructure Observability:</strong> Grafana + Prometheus monitoring system health and performance metrics</li>
      <li><strong>Secure Remote Access:</strong> Tailscale mesh VPN with WireGuard encryption for global connectivity</li>
      <li><strong>Professional Authentication:</strong> SSH ED25519 keys for Linux, WinRM with service accounts for Windows</li>
      <li><strong>VLAN Isolation:</strong> Management (10), BlueTeam SIEM (20), RedTeam Reserved (30), DevOps (40), Enterprise (50), Monitoring (60)</li>
    </ul>

    <h5 style="margin-top: 1.5rem;"><i class="fas fa-chart-line"></i> Deployed Infrastructure</h5>
    <div style="margin: 1rem 0; padding: 1rem; background: rgba(6, 182, 212, 0.05); border-radius: 8px; border-left: 3px solid var(--accent);">
      <p style="margin: 0 0 0.5rem 0;"><strong>Linux Systems (4):</strong> Ansible Controller (Ubuntu), TCM Ubuntu, Grafana Server (Ubuntu), Wazuh SIEM (Rocky Linux)</p>
      <p style="margin: 0 0 0.5rem 0;"><strong>Windows Systems (2):</strong> Windows Host Laptop (Dev/Testing), Windows Server 2022 (Enterprise Services)</p>
      <p style="margin: 0;"><strong>Network:</strong> pfSense Firewall, TP-Link Managed Switch with VLAN support</p>
    </div>

    <h5 style="margin-top: 1.5rem;"><i class="fas fa-list-check"></i> Implementation Status</h5>
    <div style="margin: 1rem 0;">
      <div style="margin-bottom: 0.8rem;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.3rem;">
          <span style="font-size: 0.95rem;">Phase 1: Foundation (Network & Security)</span>
          <span style="color: #4caf50; font-weight: bold;">100%</span>
        </div>
        <div style="height: 6px; background: #e0e0e0; border-radius: 3px;">
          <div style="height: 100%; width: 100%; background: #4caf50; border-radius: 3px;"></div>
        </div>
      </div>
      <div style="margin-bottom: 0.8rem;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.3rem;">
          <span style="font-size: 0.95rem;">Phase 2: Advanced Security & Monitoring</span>
          <span style="color: #ff9800; font-weight: bold;">In Progress</span>
        </div>
        <div style="height: 6px; background: #e0e0e0; border-radius: 3px;">
          <div style="height: 100%; width: 75%; background: #ff9800; border-radius: 3px;"></div>
        </div>
      </div>
      <div style="margin-bottom: 0.8rem;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.3rem;">
          <span style="font-size: 0.95rem;">Phase 3: Red Team Capabilities</span>
          <span style="color: #2196f3; font-weight: bold;">Planned</span>
        </div>
        <div style="height: 6px; background: #e0e0e0; border-radius: 3px;">
          <div style="height: 100%; width: 0%; background: #2196f3; border-radius: 3px;"></div>
        </div>
      </div>
      <div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.3rem;">
          <span style="font-size: 0.95rem;">Phase 4: DevSecOps Integration</span>
          <span style="color: #9c27b0; font-weight: bold;">Future</span>
        </div>
        <div style="height: 6px; background: #e0e0e0; border-radius: 3px;">
          <div style="height: 100%; width: 0%; background: #9c27b0; border-radius: 3px;"></div>
        </div>
      </div>
    </div>

    <h5 style="margin-top: 1.5rem;"><i class="fas fa-shield-alt"></i> Use Cases & Capabilities</h5>
    <ul style="margin-left: 1.5rem; line-height: 1.8;">
      <li><strong>Blue Team Operations:</strong> Comprehensive threat detection with Wazuh SIEM monitoring across all platforms</li>
      <li><strong>Cross-Platform Management:</strong> Unified Ansible automation for consistent Linux and Windows configuration</li>
      <li><strong>Infrastructure Observability:</strong> Real-time performance monitoring and dashboards via Grafana/Prometheus</li>
      <li><strong>Red Team Simulation:</strong> Dedicated VLAN for controlled attack simulation and penetration testing (planned)</li>
      <li><strong>Security Research:</strong> Multi-platform testing environment for security tools and configurations</li>
      <li><strong>DevSecOps Development:</strong> Foundation for CI/CD security pipeline integration (future)</li>
    </ul>
  </div>
</details>

<details class="project-accordion">
  <summary>
    <h3><i class="fab fa-aws"></i> AWS Cost Optimizer</h3>
    <span class="chevron"><i class="fas fa-chevron-down"></i></span>
  </summary>
  
  <div class="project-content">
    <div class="accordion-badges">
      <span style="background: rgba(255, 152, 0, 0.2); color: #ff9800; padding: 0.25rem 0.6rem; border-radius: 12px; font-size: 0.85rem; border: 1px solid #ff9800;">In Progress</span>
      <span style="background: rgba(76, 175, 80, 0.2); color: #4caf50; padding: 0.25rem 0.6rem; border-radius: 12px; font-size: 0.85rem; border: 1px solid #4caf50;">Cloud Cost Management</span>
      <span style="background: rgba(156, 39, 176, 0.2); color: #9c27b0; padding: 0.25rem 0.6rem; border-radius: 12px; font-size: 0.85rem; border: 1px solid #9c27b0;">Automation</span>
    </div>

    <div class="accordion-links">
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

    <h5 style="margin-top: 1.5rem;"><i class="fas fa-rocket"></i> Key Features</h5>
    <ul style="margin-left: 1.5rem; line-height: 1.8;">
      <li><strong>Infrastructure Analysis:</strong> Comprehensive scanning of AWS resources to identify underutilized and oversized instances</li>
      <li><strong>Intelligent Recommendations:</strong> Data-driven suggestions for cost optimization including instance rightsizing, reserved instance strategies, and storage optimization</li>
      <li><strong>Automated Remediation:</strong> Implement cost-saving actions automatically or with approval workflows</li>
      <li><strong>Cost Tracking:</strong> Monitor estimated savings and actual cost reductions over time</li>
      <li><strong>Reporting Dashboard:</strong> Detailed reports and visualizations of optimization opportunities and savings</li>
    </ul>

    <h5 style="margin-top: 1.5rem;"><i class="fas fa-chart-line"></i> Optimization Areas</h5>
    <div style="margin: 1rem 0; padding: 1rem; background: rgba(6, 182, 212, 0.05); border-radius: 8px; border-left: 3px solid var(--accent);">
      <p style="margin: 0 0 0.5rem 0;"><strong>Compute Optimization:</strong> EC2 instance rightsizing, stopping idle instances, reserved instance recommendations</p>
      <p style="margin: 0 0 0.5rem 0;"><strong>Database Optimization:</strong> RDS instance rightsizing, storage optimization, backup retention policies</p>
      <p style="margin: 0 0 0.5rem 0;"><strong>Network Optimization:</strong> Unused Elastic IPs, cross-AZ data transfer optimization, NAT gateway efficiency</p>
      <p style="margin: 0;"><strong>Storage Optimization:</strong> Unattached volumes, S3 storage class analysis, old snapshot cleanup</p>
    </div>
  </div>
</details>

<details class="project-accordion">
  <summary>
    <h3><i class="fas fa-clipboard-check"></i> Collins Aerospace IT Audit: Post-Incident Security Assessment</h3>
    <span class="chevron"><i class="fas fa-chevron-down"></i></span>
  </summary>
  
  <div class="project-content">
    <div class="accordion-badges">
      <span style="background: rgba(76, 175, 80, 0.2); color: #4caf50; padding: 0.25rem 0.6rem; border-radius: 12px; font-size: 0.85rem; border: 1px solid #4caf50;">Completed</span>
      <span style="background: rgba(244, 67, 54, 0.2); color: #f44336; padding: 0.25rem 0.6rem; border-radius: 12px; font-size: 0.85rem; border: 1px solid #f44336;">Academic Project</span>
      <span style="background: rgba(33, 150, 243, 0.2); color: #2196f3; padding: 0.25rem 0.6rem; border-radius: 12px; font-size: 0.85rem; border: 1px solid #2196f3;">IT Audit</span>
    </div>

    <div class="accordion-links">
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

    <h5 style="margin-top: 1.5rem;"><i class="fas fa-exclamation-triangle"></i> Critical Audit Findings</h5>
    <div style="margin: 1rem 0; padding: 1rem; background: rgba(244, 67, 54, 0.05); border-radius: 8px; border-left: 3px solid #f44336;">
      <table style="width: 100%; border-collapse: collapse; font-size: 0.95rem;">
        <tr style="border-bottom: 1px solid rgba(6, 182, 212, 0.2);">
          <td style="padding: 0.5rem 0;"><strong>1. Inadequate MFA</strong></td>
          <td style="color: #f44336; font-weight: bold;">CRITICAL</td>
          <td>60.5% of VPN accounts lack MFA</td>
        </tr>
        <tr style="border-bottom: 1px solid rgba(6, 182, 212, 0.2);">
          <td style="padding: 0.5rem 0;"><strong>2. Privileged Access Gaps</strong></td>
          <td style="color: #ff9800; font-weight: bold;">HIGH</td>
          <td>No reviews in 30 months</td>
        </tr>
        <tr style="border-bottom: 1px solid rgba(6, 182, 212, 0.2);">
          <td style="padding: 0.5rem 0;"><strong>3. Incident Response</strong></td>
          <td style="color: #ff9800; font-weight: bold;">HIGH</td>
          <td>16-18 hour detection delay</td>
        </tr>
        <tr style="border-bottom: 1px solid rgba(6, 182, 212, 0.2);">
          <td style="padding: 0.5rem 0;"><strong>4. Backup & DR</strong></td>
          <td style="color: #f44336; font-weight: bold;">CRITICAL</td>
          <td>No air-gapped backups</td>
        </tr>
        <tr>
          <td style="padding: 0.5rem 0;"><strong>5. Vendor Security</strong></td>
          <td style="color: #2196f3; font-weight: bold;">MEDIUM</td>
          <td>47 vendors unassessed</td>
        </tr>
      </table>
    </div>

    <h5 style="margin-top: 1.5rem;"><i class="fas fa-folder-open"></i> Project Deliverables</h5>
    <ul style="margin-left: 1.5rem; line-height: 1.8;">
      <li><strong>Audit Planning Memo:</strong> Comprehensive planning documentation and scope definition</li>
      <li><strong>Executive Presentation:</strong> Board-level findings and recommendations presentation</li>
      <li><strong>Control Testing Procedures:</strong> Detailed testing methodology and evidence collection</li>
      <li><strong>Remediation Roadmap:</strong> Prioritized implementation plan with cost estimates</li>
      <li><strong>Incident Timeline Analysis:</strong> Attack timeline reconstruction and root cause analysis</li>
      <li><strong>NIST Risk Assessment:</strong> 8 complete assessment tables with threat modeling</li>
    </ul>

    <h5 style="margin-top: 1.5rem;"><i class="fas fa-chart-line"></i> Business Impact Analysis</h5>
    <div style="margin: 1rem 0; padding: 1rem; background: rgba(6, 182, 212, 0.05); border-radius: 8px; border-left: 3px solid var(--accent);">
      <p style="margin: 0 0 0.5rem 0;"><strong>Direct Incident Costs:</strong> $15M+ in losses</p>
      <p style="margin: 0 0 0.5rem 0;"><strong>Operational Impact:</strong> 217 flights cancelled, 2.8M transactions lost</p>
      <p style="margin: 0;"><strong>Compliance Risk:</strong> CMMC Level 3 certification required Q2 2026</p>
    </div>

    <h5 style="margin-top: 1.5rem;"><i class="fas fa-graduation-cap"></i> Academic Context</h5>
    <p style="line-height: 1.8;">Completed as part of ITMM 586 - Information Technology Auditing at Illinois Institute of Technology (Fall 2025). The project included 12+ weekly discussions on audit concepts, ethics case studies, and real-world incident analysis including the CrowdStrike global outage (July 2024).</p>
  </div>
</details>

<details class="project-accordion">
  <summary>
    <h3><i class="fas fa-shield-virus"></i> Cyberdyne Systems: Enterprise Security Assessment</h3>
    <span class="chevron"><i class="fas fa-chevron-down"></i></span>
  </summary>
  
  <div class="project-content">
    <div class="accordion-badges">
      <span style="background: rgba(76, 175, 80, 0.2); color: #4caf50; padding: 0.25rem 0.6rem; border-radius: 12px; font-size: 0.85rem; border: 1px solid #4caf50;">Completed</span>
      <span style="background: rgba(244, 67, 54, 0.2); color: #f44336; padding: 0.25rem 0.6rem; border-radius: 12px; font-size: 0.85rem; border: 1px solid #f44336;">Academic Project</span>
      <span style="background: rgba(156, 39, 176, 0.2); color: #9c27b0; padding: 0.25rem 0.6rem; border-radius: 12px; font-size: 0.85rem; border: 1px solid #9c27b0;">Defense-in-Depth</span>
    </div>

    <div class="accordion-links">
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

    <h5 style="margin-top: 1.5rem;"><i class="fas fa-exclamation-triangle"></i> Key Findings by Category</h5>
    <div style="margin: 1rem 0; padding: 1rem; background: rgba(244, 67, 54, 0.05); border-radius: 8px; border-left: 3px solid #f44336;">
      <table style="width: 100%; border-collapse: collapse; font-size: 0.95rem;">
        <tr style="border-bottom: 1px solid rgba(6, 182, 212, 0.2);">
          <td style="padding: 0.5rem 0;"><strong>End-of-Life Systems</strong></td>
          <td style="color: #f44336; font-weight: bold;">CRITICAL</td>
          <td>800+ devices running EOL OS (Ubuntu 10.04, Windows 10 v1607)</td>
        </tr>
        <tr style="border-bottom: 1px solid rgba(6, 182, 212, 0.2);">
          <td style="padding: 0.5rem 0;"><strong>Endpoint Protection</strong></td>
          <td style="color: #f44336; font-weight: bold;">CRITICAL</td>
          <td>No centralized antivirus deployment</td>
        </tr>
        <tr style="border-bottom: 1px solid rgba(6, 182, 212, 0.2);">
          <td style="padding: 0.5rem 0;"><strong>Data Protection</strong></td>
          <td style="color: #f44336; font-weight: bold;">CRITICAL</td>
          <td>Unencrypted data transport between facilities</td>
        </tr>
        <tr style="border-bottom: 1px solid rgba(6, 182, 212, 0.2);">
          <td style="padding: 0.5rem 0;"><strong>Access Management</strong></td>
          <td style="color: #ff9800; font-weight: bold;">HIGH</td>
          <td>No centralized identity management</td>
        </tr>
        <tr>
          <td style="padding: 0.5rem 0;"><strong>Hardware Security</strong></td>
          <td style="color: #ff9800; font-weight: bold;">HIGH</td>
          <td>Excessive USB ports, insufficient resources</td>
        </tr>
      </table>
    </div>

    <h5 style="margin-top: 1.5rem;"><i class="fas fa-layer-group"></i> Defense-in-Depth Strategy</h5>
    <div style="margin: 1rem 0; padding: 1rem; background: rgba(6, 182, 212, 0.05); border-radius: 8px; border-left: 3px solid var(--accent);">
      <p style="margin: 0 0 0.5rem 0;"><strong>Human Layer:</strong> 8 training programs including role-based specialized training</p>
      <p style="margin: 0 0 0.5rem 0;"><strong>Policy Layer:</strong> 11 security policies (AUP, Data Classification, Incident Response)</p>
      <p style="margin: 0;"><strong>Technology Layer:</strong> 13 controls (AD, SIEM, VPN/MFA, Encryption, DLP)</p>
    </div>

    <h5 style="margin-top: 1.5rem;"><i class="fas fa-tasks"></i> Recommended Controls (Phased)</h5>
    <ul style="margin-left: 1.5rem; line-height: 1.8;">
      <li><strong>Phase 1 (Immediate):</strong> OS Upgrade Program, Enterprise Endpoint Protection, Full-Disk Encryption, Active Directory</li>
      <li><strong>Phase 2:</strong> SIEM Implementation, VPN with MFA, Mobile Device Management, Host Firewalls</li>
      <li><strong>Phase 3:</strong> Standardized Imaging, Data Loss Prevention, Asset Management, USB Device Control</li>
    </ul>

    <h5 style="margin-top: 1.5rem;"><i class="fas fa-building"></i> Organization Profile</h5>
    <div style="margin: 1rem 0; padding: 1rem; background: rgba(6, 182, 212, 0.05); border-radius: 8px; border-left: 3px solid var(--accent);">
      <p style="margin: 0 0 0.5rem 0;"><strong>Employees:</strong> 400 across 9 job categories</p>
      <p style="margin: 0 0 0.5rem 0;"><strong>Locations:</strong> California (HQ/R&D) and Taiwan (Manufacturing)</p>
      <p style="margin: 0 0 0.5rem 0;"><strong>Device Mix:</strong> 300 Windows laptops, 200 Linux desktops, 150 Android tablets, 100+ servers</p>
      <p style="margin: 0;"><strong>Compliance:</strong> CCPA, PDPC, NIST 800-171, FAR/DFARS</p>
    </div>

    <h5 style="margin-top: 1.5rem;"><i class="fas fa-graduation-cap"></i> Academic Context</h5>
    <p style="line-height: 1.8;">Completed as part of ITMO-X58 - Operating System Security at Illinois Institute of Technology (Fall 2025). This capstone project integrates concepts from Linux security mechanisms, Windows security technologies, mobile security, and defense-in-depth architecture.</p>
  </div>
</details>

<div class="project-case-study">
  <div class="project-header">
    <h3 class="project-title">
      <i class="fab fa-aws"></i>
      Three-Tier Web Architecture on AWS
    </h3>
    <div class="project-links">
      <a href="https://github.com/{{ site.social.github }}/aws-three-tier-architecture" class="project-link" target="_blank">
        <i class="fab fa-github"></i> Source Code
      </a>
      <a href="#" class="project-link">
        <i class="fas fa-external-link-alt"></i> Live Demo
      </a>
    </div>
  </div>

  <div class="project-section">
    <h5><i class="fas fa-bullseye"></i> Project Objective</h5>
    <p>Design and implement a highly available, fault-tolerant web application architecture on AWS following industry best practices for scalability, security, and cost optimization.</p>
  </div>

  <div class="tech-stack">
    <span class="tech-tag">AWS EC2</span>
    <span class="tech-tag">Application Load Balancer</span>
    <span class="tech-tag">Amazon RDS</span>
    <span class="tech-tag">Auto Scaling</span>
    <span class="tech-tag">CloudFormation</span>
    <span class="tech-tag">VPC</span>
    <span class="tech-tag">IAM</span>
    <span class="tech-tag">CloudWatch</span>
  </div>

  <div class="challenge-solution">
    <div class="challenge">
      <h5><i class="fas fa-exclamation-triangle"></i> Challenge</h5>
      <p>Create a scalable architecture that can handle variable traffic loads while maintaining high availability across multiple availability zones, with proper database isolation and security controls.</p>
    </div>
    <div class="solution">
      <h5><i class="fas fa-lightbulb"></i> Solution</h5>
      <p>Implemented a three-tier architecture with web servers in public subnets, application servers in private subnets, and RDS in database subnets across multiple AZs with automated scaling and monitoring.</p>
    </div>
  </div>

  <div class="project-section">
    <h5><i class="fas fa-cogs"></i> Key Implementation Details</h5>
    <ul style="margin-left: 1rem; line-height: 1.8;">
      <li><strong>Infrastructure as Code:</strong> Used CloudFormation templates for consistent, repeatable deployments</li>
      <li><strong>High Availability:</strong> Multi-AZ deployment with health checks and automated failover</li>
      <li><strong>Security:</strong> Implemented security groups, NACLs, and IAM roles following least privilege principle</li>
      <li><strong>Monitoring:</strong> CloudWatch dashboards and alarms for proactive incident response</li>
      <li><strong>Cost Optimization:</strong> Reserved instances and auto-scaling policies to minimize costs</li>
    </ul>
  </div>

  <div class="project-section">
    <h5><i class="fas fa-chart-line"></i> Results & Impact</h5>
    <p>Successfully deployed a production-ready architecture capable of handling 10,000+ concurrent users with 99.9% uptime, 30% cost reduction through optimization, and automated scaling that responds to traffic within 2 minutes.</p>
  </div>
</div>

<div class="card">
  <h3><i class="fab fa-microsoft"></i> Multi-Factor Authentication in Azure</h3>
  <p><strong>Technologies:</strong> Azure Active Directory, Conditional Access, RBAC, PowerShell</p>
  <p>Implemented comprehensive identity and access management solutions for a simulated enterprise environment. Configured MFA policies, conditional access rules, and role-based access control to enhance organizational security posture.</p>
  
  <div style="margin-top: 1rem;">
    <span style="background: var(--bg-light); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem; margin-right: 0.5rem;">Azure AD</span>
    <span style="background: var(--bg-light); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem; margin-right: 0.5rem;">MFA</span>
    <span style="background: var(--bg-light); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem; margin-right: 0.5rem;">Conditional Access</span>
    <span style="background: var(--bg-light); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem;">RBAC</span>
  </div>
</div>

<div class="card">
  <h3><i class="fas fa-network-wired"></i> Network Traffic Analysis with Wireshark</h3>
  <p><strong>Technologies:</strong> Wireshark, tcpdump, Network Protocols, Security Analysis</p>
  <p>Conducted in-depth packet analysis to identify and investigate security threats including reconnaissance attempts, port scanning, and brute force attacks. Developed expertise in reading network protocols and identifying malicious patterns in traffic flows.</p>
  
  <div style="margin-top: 1rem;">
    <span style="background: var(--bg-light); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem; margin-right: 0.5rem;">Wireshark</span>
    <span style="background: var(--bg-light); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem; margin-right: 0.5rem;">Packet Analysis</span>
    <span style="background: var(--bg-light); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem; margin-right: 0.5rem;">Threat Detection</span>
    <span style="background: var(--bg-light); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem;">Forensics</span>
  </div>
</div>

<div class="project-case-study">
  <div class="project-header">
    <h3 class="project-title">
      <i class="fas fa-shield-alt"></i>
      Enterprise SIEM Implementation with Wazuh
    </h3>
    <div class="project-links">
      <a href="https://github.com/{{ site.social.github }}/wazuh-siem-deployment" class="project-link" target="_blank">
        <i class="fab fa-github"></i> Configuration
      </a>
      <a href="#" class="project-link">
        <i class="fas fa-file-alt"></i> Documentation
      </a>
    </div>
  </div>

  <div class="project-section">
    <h5><i class="fas fa-bullseye"></i> Project Objective</h5>
    <p>Deploy and configure a comprehensive Security Information and Event Management (SIEM) solution using Wazuh to monitor, detect, and respond to security threats across a hybrid cloud environment.</p>
  </div>

  <div class="tech-stack">
    <span class="tech-tag">Wazuh SIEM</span>
    <span class="tech-tag">Elasticsearch</span>
    <span class="tech-tag">Kibana</span>
    <span class="tech-tag">Linux</span>
    <span class="tech-tag">Docker</span>
    <span class="tech-tag">Python</span>
    <span class="tech-tag">Suricata</span>
    <span class="tech-tag">MITRE ATT&CK</span>
  </div>

  <div class="challenge-solution">
    <div class="challenge">
      <h5><i class="fas fa-exclamation-triangle"></i> Challenge</h5>
      <p>Organization needed centralized security monitoring across 200+ endpoints with custom detection rules, automated threat response, and compliance reporting for SOC 2 requirements.</p>
    </div>
    <div class="solution">
      <h5><i class="fas fa-lightbulb"></i> Solution</h5>
      <p>Designed and deployed a scalable Wazuh cluster with custom detection rules, automated incident response playbooks, and real-time dashboards for security analysts.</p>
    </div>
  </div>

  <div class="project-section">
    <h5><i class="fas fa-cogs"></i> Key Implementation Details</h5>
    <ul style="margin-left: 1rem; line-height: 1.8;">
      <li><strong>Architecture:</strong> Multi-node Wazuh cluster with load balancing and high availability</li>
      <li><strong>Detection Rules:</strong> Custom rules based on MITRE ATT&CK framework for advanced threat detection</li>
      <li><strong>Integration:</strong> Connected with Active Directory, firewalls, and cloud services for comprehensive coverage</li>
      <li><strong>Automation:</strong> Python-based response scripts for automatic threat containment</li>
      <li><strong>Dashboards:</strong> Executive and analyst dashboards for different stakeholder needs</li>
    </ul>
  </div>

  <div class="project-section">
    <h5><i class="fas fa-chart-line"></i> Results & Impact</h5>
    <p>Reduced mean time to detection (MTTD) from 4 hours to 15 minutes, automated 80% of Level 1 SOC tasks, and achieved 100% compliance with SOC 2 security monitoring requirements. Blocked 150+ security incidents in the first month.</p>
  </div>
</div>

<div class="project-case-study">
  <div class="project-header">
    <h3 class="project-title">
      <i class="fab fa-aws"></i>
      Secure Static Website with Global CDN
    </h3>
    <div class="project-links">
      <a href="https://github.com/{{ site.social.github }}/secure-static-website" class="project-link" target="_blank">
        <i class="fab fa-github"></i> Infrastructure
      </a>
    </div>
  </div>

  <div class="project-section">
    <h5><i class="fas fa-bullseye"></i> Project Objective</h5>
    <p>Build and deploy a secure, globally distributed static website with SSL/TLS encryption, custom domain configuration, and CDN optimization for improved performance and security.</p>
  </div>

  <div class="tech-stack">
    <span class="tech-tag">AWS S3</span>
    <span class="tech-tag">CloudFront</span>
    <span class="tech-tag">Route 53</span>
    <span class="tech-tag">ACM</span>
    <span class="tech-tag">IAM</span>
    <span class="tech-tag">CloudFormation</span>
    <span class="tech-tag">Lambda@Edge</span>
  </div>

  <div class="challenge-solution">
    <div class="challenge">
      <h5><i class="fas fa-exclamation-triangle"></i> Challenge</h5>
      <p>Create a cost-effective, secure hosting solution for a static website with global reach, automatic SSL renewal, and protection against common web attacks.</p>
    </div>
    <div class="solution">
      <h5><i class="fas fa-lightbulb"></i> Solution</h5>
      <p>Implemented a serverless architecture using S3 for storage, CloudFront for global distribution, and Lambda@Edge for dynamic security headers and redirects.</p>
    </div>
  </div>

  <div class="project-section">
    <h5><i class="fas fa-cogs"></i> Key Implementation Details</h5>
    <ul style="margin-left: 1rem; line-height: 1.8;">
      <li><strong>Security:</strong> Implemented security headers, HTTPS redirect, and S3 bucket policies for access control</li>
      <li><strong>Performance:</strong> Configured CloudFront caching and compression for optimal load times</li>
      <li><strong>Monitoring:</strong> CloudWatch metrics and alarms for uptime and performance monitoring</li>
      <li><strong>Automation:</strong> CI/CD pipeline for automated deployments and invalidations</li>
    </ul>
  </div>

  <div class="project-section">
    <h5><i class="fas fa-chart-line"></i> Results & Impact</h5>
    <p>Achieved 99.99% uptime, reduced page load times by 60% globally, and maintained hosting costs under $2/month while serving 10,000+ monthly visitors with enterprise-level security.</p>
  </div>
</div>

<div style="text-align: center; margin-top: 3rem;">
  <p style="color: var(--text-light); font-size: 1.1rem;">Interested in seeing more of my work?</p>
  <a href="https://github.com/{{ site.social.github }}" class="btn" target="_blank">
    <i class="fab fa-github"></i> View on GitHub
  </a>
</div>
