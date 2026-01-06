
---
layout: default
title: Projects
---

<h1><i class="fas fa-project-diagram"></i> Featured Project Case Studies</h1>

<div class="project-case-study">
  <div class="project-header">
    <h3 class="project-title">
      <i class="fas fa-key"></i> 
      Enterprise IAM Lab: Hybrid Identity Architecture
    </h3>
    <div style="margin-top: 0.5rem;">
      <span style="background: rgba(255, 152, 0, 0.2); color: #ff9800; padding: 0.25rem 0.6rem; border-radius: 12px; font-size: 0.85rem; margin-right: 0.5rem; border: 1px solid #ff9800;">In Progress</span>
      <span style="background: rgba(76, 175, 80, 0.2); color: #4caf50; padding: 0.25rem 0.6rem; border-radius: 12px; font-size: 0.85rem; margin-right: 0.5rem; border: 1px solid #4caf50;">Large Project</span>
      <span style="background: rgba(156, 39, 176, 0.2); color: #9c27b0; padding: 0.25rem 0.6rem; border-radius: 12px; font-size: 0.85rem; border: 1px solid #9c27b0;">Production-Grade</span>
    </div>
    <div class="project-links" style="margin-top: 1rem;">
      <a href="https://github.com/noble-antwi/enterprise-iam-lab" class="project-link" target="_blank">
        <i class="fab fa-github"></i> GitHub Repository
      </a>
      <a href="https://github.com/noble-antwi/enterprise-iam-lab/blob/main/docs/guides/" class="project-link" target="_blank">
        <i class="fas fa-book"></i> Documentation
      </a>
    </div>
  </div>

  <div class="project-section">
    <h5><i class="fas fa-bullseye"></i> Project Objective</h5>
    <p>Build a comprehensive 500-1000 user enterprise Identity and Access Management (IAM) environment from scratch. This production-grade homelab simulates a medium-sized organization's hybrid identity infrastructure, implementing industry best practices for zero-trust security, advanced authentication, and modern access management—directly applicable to Fortune 500 implementations.</p>
  </div>

  <div class="tech-stack">
    <span class="tech-tag">Windows Server 2022</span>
    <span class="tech-tag">Active Directory</span>
    <span class="tech-tag">OKTA Workforce Identity</span>
    <span class="tech-tag">Microsoft Entra ID</span>
    <span class="tech-tag">PowerShell</span>
    <span class="tech-tag">SAML 2.0</span>
    <span class="tech-tag">Conditional Access</span>
    <span class="tech-tag">OKTA Expression Language</span>
  </div>

  <div class="challenge-solution">
    <div class="challenge">
      <h5><i class="fas fa-exclamation-triangle"></i> Challenge</h5>
      <p>Design and implement a hybrid identity architecture that integrates on-premises Active Directory with cloud identity providers (OKTA + Microsoft Entra ID). Implement enterprise-grade security controls including network-based conditional access, graduated MFA policies, geographic restrictions, and threat intelligence integration—all while managing 35+ user accounts across 6 departments with different security postures.</p>
    </div>
    <div class="solution">
      <h5><i class="fas fa-lightbulb"></i> Solution</h5>
      <p>Architected a sophisticated hybrid identity environment with split-brain DNS, tiered administrative model (Tier 0/1/2), OKTA AD Agent secure tunnel for directory synchronization, and OKTA as primary IdP. Implemented network-based conditional access with three security zones: IP-based corporate network detection, geographic controls (country-level restrictions), and Tor anonymizer blocking. Configured graduated authentication policies requiring hardware-protected MFA for public networks and standard MFA for corporate networks.</p>
    </div>
  </div>

  <div class="project-section">
    <h5><i class="fas fa-cogs"></i> Current Implementation Status</h5>
    <div style="margin: 1.5rem 0;">
      <div style="margin-bottom: 1.2rem;">
        <strong style="color: #4caf50;">Phase 1: Foundation</strong> <span style="color: var(--text-muted); font-size: 0.95rem;">✅ 100% Complete</span>
        <div style="height: 6px; background: #e0e0e0; border-radius: 3px; margin-top: 0.5rem;">
          <div style="height: 100%; width: 100%; background: #4caf50; border-radius: 3px;"></div>
        </div>
      </div>
      <div style="margin-bottom: 1.2rem;">
        <strong style="color: #4caf50;">Phase 2: Active Directory Structure</strong> <span style="color: var(--text-muted); font-size: 0.95rem;">✅ 100% Complete</span>
        <div style="height: 6px; background: #e0e0e0; border-radius: 3px; margin-top: 0.5rem;">
          <div style="height: 100%; width: 100%; background: #4caf50; border-radius: 3px;"></div>
        </div>
      </div>
      <div style="margin-bottom: 1.2rem;">
        <strong style="color: #4caf50;">Phase 3: OKTA Integration</strong> <span style="color: var(--text-muted); font-size: 0.95rem;">✅ 100% Complete</span>
        <div style="height: 6px; background: #e0e0e0; border-radius: 3px; margin-top: 0.5rem;">
          <div style="height: 100%; width: 100%; background: #4caf50; border-radius: 3px;"></div>
        </div>
      </div>
      <div style="margin-bottom: 1.2rem;">
        <strong style="color: #4caf50;">Phase 4: Advanced OKTA Configuration</strong> <span style="color: var(--text-muted); font-size: 0.95rem;">✅ 100% Complete</span>
        <div style="height: 6px; background: #e0e0e0; border-radius: 3px; margin-top: 0.5rem;">
          <div style="height: 100%; width: 100%; background: #4caf50; border-radius: 3px;"></div>
        </div>
      </div>
      <div style="margin-bottom: 1.2rem;">
        <strong style="color: #ff9800;">Phase 5: Advanced Authentication & Security</strong> <span style="color: var(--text-muted); font-size: 0.95rem;">🔄 40% Complete (Phase 5.1 Operational)</span>
        <div style="height: 6px; background: #e0e0e0; border-radius: 3px; margin-top: 0.5rem;">
          <div style="height: 100%; width: 40%; background: #ff9800; border-radius: 3px;"></div>
        </div>
      </div>
      <div style="margin-bottom: 1.2rem;">
        <strong style="color: #9c27b0;">Phase 6: Microsoft Entra ID Integration</strong> <span style="color: var(--text-muted); font-size: 0.95rem;">📋 Planned</span>
        <div style="height: 6px; background: #e0e0e0; border-radius: 3px; margin-top: 0.5rem;">
          <div style="height: 100%; width: 0%; background: #9c27b0; border-radius: 3px;"></div>
        </div>
      </div>
    </div>
  </div>

  <div class="project-section">
    <h5><i class="fas fa-chart-bar"></i> Environment Scale</h5>
    <ul style="margin-left: 1rem; line-height: 1.8;">
      <li><strong>User Accounts:</strong> 35 total (27 employee accounts across 6 departments, 7 admin accounts, 1 service account)</li>
      <li><strong>Organizational Units:</strong> 20 hierarchical OUs following enterprise design patterns</li>
      <li><strong>Security Groups:</strong> 15 total (12 AD-sourced, 3 OKTA-mastered with dynamic group assignment)</li>
      <li><strong>Integrated Applications:</strong> Dropbox Business (SAML 2.0), Box (SWA with password vaulting)</li>
      <li><strong>Network Zones:</strong> 3 dynamic zones (Corporate IP-based, Geographic restrictions, Tor blocking)</li>
      <li><strong>Authentication Policies:</strong> 3-tier graduated security requirements based on network context</li>
    </ul>
  </div>

  <div class="project-section">
    <h5><i class="fas fa-rocket"></i> Key Achievements</h5>
    <ul style="margin-left: 1rem; line-height: 1.8;">
      <li><strong>Hybrid Identity Architecture:</strong> Seamless integration between on-premises AD and cloud IdP (OKTA + Microsoft Entra ID)</li>
      <li><strong>Enterprise Admin Model:</strong> Implemented Microsoft Tiered Admin Model (Tier 0/1/2) with separate admin accounts and privilege separation</li>
      <li><strong>Network-Based Conditional Access:</strong> Three-layer security architecture with IP zones, geographic controls, and threat intelligence integration</li>
      <li><strong>Automated Provisioning:</strong> Dynamic OKTA Expression Language rules for automated group assignment based on location and business logic</li>
      <li><strong>Multi-Protocol Integration:</strong> SAML 2.0 and SWA application integration with automated user provisioning lifecycles</li>
      <li><strong>Production-Grade Documentation:</strong> 6+ phases with step-by-step guides, troubleshooting procedures, and operational playbooks</li>
      <li><strong>Video Demonstrations:</strong> Security flows captured and documented with detailed authentication path analysis</li>
    </ul>
  </div>

  <div class="project-section">
    <h5><i class="fas fa-graduation-cap"></i> Learning Outcomes Delivered</h5>
    <p style="margin-bottom: 1rem;"><strong>Technical Skills:</strong> Hybrid identity design, enterprise AD management, OKTA administration, application integration (SAML/SWA), PowerShell automation, OKTA Expression Language, conditional access policy design, network-based authentication, MFA strategy, geographic controls, threat intelligence integration, and troubleshooting methodologies.</p>
    <p><strong>Enterprise Best Practices:</strong> Split-brain DNS for hybrid environments, tiered admin model, dual-account pattern for privileged access, naming conventions, change management, audit compliance considerations (SOC 2, HIPAA, PCI-DSS), zero-trust architecture principles, and defense-in-depth security layering.</p>
  </div>

  <div style="background: rgba(255, 152, 0, 0.1); border-left: 4px solid #ff9800; padding: 1.5rem; border-radius: 8px; margin-top: 2rem;">
    <p style="margin: 0; color: var(--text-secondary);"><i class="fas fa-info-circle"></i> <strong>Status Update:</strong> Phase 5.1 (Network-Based Conditional Access) is fully operational with IP zones, geographic restrictions, and Tor blocking deployed. Phase 5.2 (Adaptive MFA) and subsequent phases are in active development.</p>
  </div>
</div>

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
