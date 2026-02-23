
---
layout: default
title: Blog
description: "Noble Antwi's technical blog — lab notes, project updates, learning journals, and cloud security articles covering AWS, Azure, IAM, and DevSecOps."
---

<h1><i class="fas fa-blog"></i> Technical Blog & Articles</h1>

<p style="text-align: center; font-size: 1.1rem; color: var(--text-secondary); margin-bottom: 3rem;">
  Lab notes, project updates, learning journals, and deep-dive security articles from my cloud security journey.
  <br><a href="https://medium.com/@noble-antwi" target="_blank" style="color: var(--accent); font-weight: 600; text-decoration: none;">Also on Medium →</a>
</p>

<!-- LOCAL POSTS: Lab Notes & Project Updates -->
{% assign local_posts = site.posts %}
{% if local_posts.size > 0 %}
<h2 style="margin-top: 1rem;"><i class="fas fa-flask"></i> Lab Notes & Project Updates</h2>
<p style="color: var(--text-secondary); margin-bottom: 2rem; font-size: 0.95rem;">Personal notes on what I'm building, learning, and experimenting with — direct from the lab.</p>

<div style="display: grid; gap: 1.5rem; margin-bottom: 3rem;">
{% for post in local_posts %}
  <div class="card" style="border-left: 4px solid var(--accent);">
    <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.8rem;">
      <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
        {% if post.category == "lab-notes" %}
          <span style="background: rgba(76, 175, 80, 0.2); color: #4caf50; padding: 0.2rem 0.6rem; border-radius: 10px; font-size: 0.8rem; border: 1px solid #4caf50;"><i class="fas fa-flask"></i> Lab Notes</span>
        {% elsif post.category == "project-update" %}
          <span style="background: rgba(33, 150, 243, 0.2); color: #2196f3; padding: 0.2rem 0.6rem; border-radius: 10px; font-size: 0.8rem; border: 1px solid #2196f3;"><i class="fas fa-code-branch"></i> Project Update</span>
        {% elsif post.category == "til" %}
          <span style="background: rgba(255, 193, 7, 0.2); color: #ffc107; padding: 0.2rem 0.6rem; border-radius: 10px; font-size: 0.8rem; border: 1px solid #ffc107;"><i class="fas fa-lightbulb"></i> TIL</span>
        {% elsif post.category == "learning" %}
          <span style="background: rgba(156, 39, 176, 0.2); color: #9c27b0; padding: 0.2rem 0.6rem; border-radius: 10px; font-size: 0.8rem; border: 1px solid #9c27b0;"><i class="fas fa-graduation-cap"></i> Learning</span>
        {% else %}
          <span style="background: rgba(6, 182, 212, 0.2); color: var(--accent); padding: 0.2rem 0.6rem; border-radius: 10px; font-size: 0.8rem; border: 1px solid var(--accent);"><i class="fas fa-pen"></i> {{ post.category }}</span>
        {% endif %}
      </div>
      <span style="color: var(--text-muted); font-size: 0.85rem;"><i class="fas fa-calendar"></i> {{ post.date | date: "%B %-d, %Y" }}</span>
    </div>
    <h3 style="margin: 0 0 0.7rem; font-size: 1.15rem;">{{ post.title }}</h3>
    <p style="color: var(--text-secondary); margin-bottom: 1rem; font-size: 0.95rem; line-height: 1.7;">{{ post.excerpt | strip_html | truncate: 200 }}</p>
    {% if post.tags %}
    <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1rem;">
      {% for tag in post.tags %}
      <span style="background: rgba(6, 182, 212, 0.1); color: var(--accent); padding: 0.15rem 0.5rem; border-radius: 8px; font-size: 0.8rem;">{{ tag }}</span>
      {% endfor %}
    </div>
    {% endif %}
    <a href="{{ post.url }}" style="color: var(--accent); text-decoration: none; font-weight: 600; font-size: 0.95rem;">Read Full Post <i class="fas fa-arrow-right"></i></a>
  </div>
{% endfor %}
</div>

<hr style="border: none; border-top: 1px solid rgba(6, 182, 212, 0.2); margin: 2rem 0;">
{% endif %}

<!-- AWS & Cloud Security Articles -->
<h2 style="margin-top: 3rem;"><i class="fab fa-aws"></i> AWS & Cloud Security</h2>

<div class="card">
  <h3><i class="fas fa-lock"></i> Why Cloud Security is No Longer Optional for Growing Businesses</h3>
  <p style="color: var(--text-muted); margin-bottom: 1rem;"><i class="fas fa-calendar"></i> July 8, 2025</p>
  <p>Cloud computing has fundamentally reshaped how businesses operate. This article explores why cloud security is critical for growing businesses and the evolving threat landscape in modern cloud environments.</p>
  <div style="margin: 1.5rem 0;">
    <span style="background: rgba(6, 182, 212, 0.15); color: var(--accent); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem; margin-right: 0.5rem; border: 1px solid var(--accent);">Cloud Security</span>
    <span style="background: rgba(6, 182, 212, 0.15); color: var(--accent); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem; margin-right: 0.5rem; border: 1px solid var(--accent);">AWS</span>
    <span style="background: rgba(6, 182, 212, 0.15); color: var(--accent); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem; border: 1px solid var(--accent);">Best Practices</span>
  </div>
  <a href="https://aws.plainenglish.io/why-cloud-security-is-no-longer-optional-for-growing-businesses-812f04a708cb" target="_blank" style="display: inline-block; margin-top: 1rem; color: var(--accent); text-decoration: none; font-weight: 600;">Read Full Article →</a>
</div>

<div class="card">
  <h3><i class="fas fa-shield-alt"></i> Using Service Control Policies (SCPs) to Restrict AWS Account Access</h3>
  <p style="color: var(--text-muted); margin-bottom: 1rem;"><i class="fas fa-calendar"></i> April 16, 2025 | <i class="fas fa-fw"></i> AWS in Plain English</p>
  <p>A comprehensive hands-on guide on implementing Service Control Policies to enforce security controls and restrict access across AWS accounts. Learn how to leverage AWS Organizations for effective multi-account security governance.</p>
  <div style="margin: 1.5rem 0;">
    <span style="background: rgba(6, 182, 212, 0.15); color: var(--accent); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem; margin-right: 0.5rem; border: 1px solid var(--accent);">AWS Organizations</span>
    <span style="background: rgba(6, 182, 212, 0.15); color: var(--accent); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem; margin-right: 0.5rem; border: 1px solid var(--accent);">SCPs</span>
    <span style="background: rgba(6, 182, 212, 0.15); color: var(--accent); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem; margin-right: 0.5rem; border: 1px solid var(--accent);">IAM</span>
    <span style="background: rgba(6, 182, 212, 0.15); color: var(--accent); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem; border: 1px solid var(--accent);">Access Control</span>
  </div>
  <a href="https://aws.plainenglish.io/using-service-control-policies-scps-to-restrict-aws-account-access-a-hands-on-guide-f818be31c88f" target="_blank" style="display: inline-block; margin-top: 1rem; color: var(--accent); text-decoration: none; font-weight: 600;">Read Full Article →</a>
</div>

<div class="card">
  <h3><i class="fas fa-sitemap"></i> Building an AWS Multi-Account Structure with AWS Organizations</h3>
  <p style="color: var(--text-muted); margin-bottom: 1rem;"><i class="fas fa-calendar"></i> April 15, 2025</p>
  <p>A practical hands-on lab walkthrough on implementing AWS Organizations for multi-account management. Learn the steps to structure multiple AWS accounts for scalability, security, and cost optimization.</p>
  <div style="margin: 1.5rem 0;">
    <span style="background: rgba(6, 182, 212, 0.15); color: var(--accent); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem; margin-right: 0.5rem; border: 1px solid var(--accent);">AWS Organizations</span>
    <span style="background: rgba(6, 182, 212, 0.15); color: var(--accent); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem; margin-right: 0.5rem; border: 1px solid var(--accent);">Multi-Account</span>
    <span style="background: rgba(6, 182, 212, 0.15); color: var(--accent); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem; border: 1px solid var(--accent);">Infrastructure</span>
  </div>
  <a href="https://medium.com/@noble-antwi/building-an-aws-multi-account-structure-with-aws-organizations-hands-on-guide-e09a0f0d2bf6?postPublishedType=repub" target="_blank" style="display: inline-block; margin-top: 1rem; color: var(--accent); text-decoration: none; font-weight: 600;">Read Full Article →</a>
</div>

<div class="card">
  <h3><i class="fas fa-satellite"></i> GuardDuty - Runtime Monitoring for EC2: A Hands-on Guide</h3>
  <p style="color: var(--text-muted); margin-bottom: 1rem;"><i class="fas fa-calendar"></i> February 27, 2025</p>
  <p>Learn how to implement AWS GuardDuty for runtime monitoring of EC2 instances. Includes hands-on implementation steps and troubleshooting techniques for detecting and responding to threats in your AWS environment.</p>
  <div style="margin: 1.5rem 0;">
    <span style="background: rgba(6, 182, 212, 0.15); color: var(--accent); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem; margin-right: 0.5rem; border: 1px solid var(--accent);">GuardDuty</span>
    <span style="background: rgba(6, 182, 212, 0.15); color: var(--accent); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem; margin-right: 0.5rem; border: 1px solid var(--accent);">EC2</span>
    <span style="background: rgba(6, 182, 212, 0.15); color: var(--accent); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem; border: 1px solid var(--accent);">Threat Detection</span>
  </div>
  <a href="https://medium.com/@noble-antwi/guardduty-runtime-monitoring-for-ec2-a-hands-on-guide-with-troubleshooting-3d4976cb4158" target="_blank" style="display: inline-block; margin-top: 1rem; color: var(--accent); text-decoration: none; font-weight: 600;">Read Full Article →</a>
</div>

<div class="card">
  <h3><i class="fas fa-key"></i> Implementing Envelope Encryption with AWS KMS</h3>
  <p style="color: var(--text-muted); margin-bottom: 1rem;"><i class="fas fa-calendar"></i> February 16, 2025</p>
  <p>A step-by-step guide on implementing envelope encryption using AWS Key Management Service (KMS). Understand how to secure your data at rest with advanced cryptographic techniques.</p>
  <div style="margin: 1.5rem 0;">
    <span style="background: rgba(6, 182, 212, 0.15); color: var(--accent); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem; margin-right: 0.5rem; border: 1px solid var(--accent);">KMS</span>
    <span style="background: rgba(6, 182, 212, 0.15); color: var(--accent); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem; margin-right: 0.5rem; border: 1px solid var(--accent);">Encryption</span>
    <span style="background: rgba(6, 182, 212, 0.15); color: var(--accent); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem; border: 1px solid var(--accent);">Data Security</span>
  </div>
  <a href="https://medium.com/@noble-antwi/implementing-envelope-encryption-with-aws-kms-a-step-by-step-guide-91fda46879c4" target="_blank" style="display: inline-block; margin-top: 1rem; color: var(--accent); text-decoration: none; font-weight: 600;">Read Full Article →</a>
</div>

<!-- Security & Incident Response -->
<h2 style="margin-top: 3rem;"><i class="fas fa-exclamation-triangle"></i> Security & Threat Analysis</h2>

<div class="card">
  <h3><i class="fas fa-envelope"></i> Digital Deception: Dissecting a Phishing Email and Its Malicious Payload</h3>
  <p style="color: var(--text-muted); margin-bottom: 1rem;"><i class="fas fa-calendar"></i> January 13, 2025</p>
  <p>A deep technical analysis of a phishing attack, breaking down the attack chain, payload analysis, and indicators of compromise. Learn how to identify and respond to sophisticated phishing attempts.</p>
  <div style="margin: 1.5rem 0;">
    <span style="background: rgba(6, 182, 212, 0.15); color: var(--accent); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem; margin-right: 0.5rem; border: 1px solid var(--accent);">Phishing</span>
    <span style="background: rgba(6, 182, 212, 0.15); color: var(--accent); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem; margin-right: 0.5rem; border: 1px solid var(--accent);">Malware Analysis</span>
    <span style="background: rgba(6, 182, 212, 0.15); color: var(--accent); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem; border: 1px solid var(--accent);">Threat Intel</span>
  </div>
  <a href="https://medium.com/@noble-antwi/digital-deception-dissecting-a-phishing-email-and-its-malicious-payload-e1eb61985a0a" target="_blank" style="display: inline-block; margin-top: 1rem; color: var(--accent); text-decoration: none; font-weight: 600;">Read Full Article →</a>
</div>

<div class="card">
  <h3><i class="fas fa-code"></i> Advanced Techniques in Email Header Analysis for Phishing Detection</h3>
  <p style="color: var(--text-muted); margin-bottom: 1rem;"><i class="fas fa-calendar"></i> January 13, 2025</p>
  <p>Master the techniques of email header analysis to detect and prevent phishing attacks. Learn how to trace email origins, identify spoofing attempts, and extract valuable forensic information from email metadata.</p>
  <div style="margin: 1.5rem 0;">
    <span style="background: rgba(6, 182, 212, 0.15); color: var(--accent); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem; margin-right: 0.5rem; border: 1px solid var(--accent);">Email Forensics</span>
    <span style="background: rgba(6, 182, 212, 0.15); color: var(--accent); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem; margin-right: 0.5rem; border: 1px solid var(--accent);">Header Analysis</span>
    <span style="background: rgba(6, 182, 212, 0.15); color: var(--accent); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem; border: 1px solid var(--accent);">Detection</span>
  </div>
  <a href="https://medium.com/@noble-antwi/advanced-techniques-in-email-header-analysis-for-phishing-detection-c5567f1caa00" target="_blank" style="display: inline-block; margin-top: 1rem; color: var(--accent); text-decoration: none; font-weight: 600;">Read Full Article →</a>
</div>

<div class="card">
  <h3><i class="fas fa-shield-alt"></i> Phishing Detection and Mitigation in Practice: The Mighty Solutions, Inc. Case</h3>
  <p style="color: var(--text-muted); margin-bottom: 1rem;"><i class="fas fa-calendar"></i> January 10, 2025</p>
  <p>A real-world case study on identifying and mitigating phishing attacks in an organizational context. Learn practical strategies for threat detection, incident response, and employee security awareness.</p>
  <div style="margin: 1.5rem 0;">
    <span style="background: rgba(6, 182, 212, 0.15); color: var(--accent); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem; margin-right: 0.5rem; border: 1px solid var(--accent);">Incident Response</span>
    <span style="background: rgba(6, 182, 212, 0.15); color: var(--accent); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem; margin-right: 0.5rem; border: 1px solid var(--accent);">Mitigation</span>
    <span style="background: rgba(6, 182, 212, 0.15); color: var(--accent); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem; border: 1px solid var(--accent);">Case Study</span>
  </div>
  <a href="https://medium.com/@noble-antwi/phishing-attack-detection-and-response-a-case-study-of-mighty-solutions-inc-c8c302fea859" target="_blank" style="display: inline-block; margin-top: 1rem; color: var(--accent); text-decoration: none; font-weight: 600;">Read Full Article →</a>
</div>

<div class="card">
  <h3><i class="fas fa-database"></i> Data Loss Prevention in the Cloud: A Comprehensive Guide with a Focus on AWS</h3>
  <p style="color: var(--text-muted); margin-bottom: 1rem;"><i class="fas fa-calendar"></i> AWS in Plain English</p>
  <p>Learn comprehensive data loss prevention strategies in cloud environments with a deep focus on AWS. Understand how to protect sensitive data at rest and in transit using AWS services and best practices.</p>
  <div style="margin: 1.5rem 0;">
    <span style="background: rgba(6, 182, 212, 0.15); color: var(--accent); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem; margin-right: 0.5rem; border: 1px solid var(--accent);">Data Protection</span>
    <span style="background: rgba(6, 182, 212, 0.15); color: var(--accent); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem; margin-right: 0.5rem; border: 1px solid var(--accent);">DLP</span>
    <span style="background: rgba(6, 182, 212, 0.15); color: var(--accent); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem; border: 1px solid var(--accent);">Compliance</span>
  </div>
  <a href="https://aws.plainenglish.io/data-loss-prevention-in-the-cloud-a-comprehensive-guide-with-a-focus-on-aws-d49e37f31b39" target="_blank" style="display: inline-block; margin-top: 1rem; color: var(--accent); text-decoration: none; font-weight: 600;">Read Full Article →</a>
</div>

<div class="card">
  <h3><i class="fas fa-shield-alt"></i> Microsoft Security Updates: Critical Fixes and Zero-Day Vulnerabilities</h3>
  <p style="color: var(--text-muted); margin-bottom: 1rem;"><i class="fas fa-calendar"></i> January 2025</p>
  <p>Stay informed on the latest Microsoft security updates, critical patches, and zero-day vulnerability disclosures. Learn how to prioritize and implement security updates in your Microsoft environment.</p>
  <div style="margin: 1.5rem 0;">
    <span style="background: rgba(6, 182, 212, 0.15); color: var(--accent); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem; margin-right: 0.5rem; border: 1px solid var(--accent);">Security Updates</span>
    <span style="background: rgba(6, 182, 212, 0.15); color: var(--accent); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem; margin-right: 0.5rem; border: 1px solid var(--accent);">Vulnerability</span>
    <span style="background: rgba(6, 182, 212, 0.15); color: var(--accent); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem; border: 1px solid var(--accent);">Patch Management</span>
  </div>
  <a href="https://medium.com/@noble-antwi/microsoft-security-updates-critical-fixes-and-zero-day-vulnerabilities-5398b24aa041" target="_blank" style="display: inline-block; margin-top: 1rem; color: var(--accent); text-decoration: none; font-weight: 600;">Read Full Article →</a>
</div>

<h2 style="margin-top: 3rem;"><i class="fas fa-server"></i> Infrastructure & Hands-On Labs</h2>

<div class="card">
  <h3><i class="fas fa-cloud-upload-alt"></i> Launching an EC2 Linux Hands-On Lab</h3>
  <p style="color: var(--text-muted); margin-bottom: 1rem;"><i class="fas fa-calendar"></i> 2025</p>
  <p>A practical hands-on guide to launching and configuring EC2 Linux instances on AWS. Learn best practices for instance configuration, security, and management in a lab environment.</p>
  <div style="margin: 1.5rem 0;">
    <span style="background: rgba(6, 182, 212, 0.15); color: var(--accent); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem; margin-right: 0.5rem; border: 1px solid var(--accent);">EC2</span>
    <span style="background: rgba(6, 182, 212, 0.15); color: var(--accent); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem; margin-right: 0.5rem; border: 1px solid var(--accent);">Linux</span>
    <span style="background: rgba(6, 182, 212, 0.15); color: var(--accent); padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem; border: 1px solid var(--accent);">Hands-On Lab</span>
  </div>
  <a href="https://medium.com/@noble-antwi/launching-an-ec2-linux-hands-on-lab-94a1a6d6d49b" target="_blank" style="display: inline-block; margin-top: 1rem; color: var(--accent); text-decoration: none; font-weight: 600;">Read Full Article →</a>
</div>

<div style="background: rgba(6, 182, 212, 0.1); border-left: 4px solid var(--accent); padding: 2rem; border-radius: 12px; margin-top: 3rem; text-align: center;">
  <h3 style="color: var(--accent); margin-bottom: 1rem;">Want to Read More?</h3>
  <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Visit my Medium profile for the complete collection of articles and stay updated with new technical write-ups.</p>
  <a href="https://medium.com/@noble-antwi" target="_blank" style="display: inline-block; padding: 0.8rem 2rem; background: var(--accent); color: var(--bg-dark); text-decoration: none; border-radius: 8px; font-weight: 600;">Visit Medium Profile →</a>
</div>

<div style="text-align: center;">
  <p style="color: var(--text-light);">Want to discuss these topics or collaborate?</p>
  <a href="/contact" class="btn">Get In Touch</a>
</div>
