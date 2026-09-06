---
layout: default
title: Home
description: "Noble Antwi: Cloud Security and Identity Engineer. AWS and Azure IAM, Entra ID, Okta, Active Directory, HashiCorp Vault, Zero Trust, and detection engineering with Wazuh and Microsoft Sentinel."
---

<section class="hero-v2">
  <p class="hero-eyebrow">Hi, I'm Noble Antwi</p>
  <h1 class="hero-title">I secure identities <span class="hero-accent">and the cloud they live in.</span></h1>
  <p class="hero-lead">Cloud Security and Identity Engineer. I design least-privilege access on AWS and Azure, run hybrid identity across Active Directory, Entra ID and Okta, manage secrets with HashiCorp Vault, and build the detection that catches what slips through.</p>
  <div class="hero-actions">
    <a href="/projects" class="btn"><i class="fas fa-folder-open"></i> See my work</a>
    <a href="/contact" class="btn btn-secondary"><i class="fas fa-envelope"></i> Get in touch</a>
  </div>
  <div class="hero-social">
    <a href="https://linkedin.com/in/{{ site.social.linkedin }}" class="social-link" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
    <a href="https://github.com/{{ site.social.github }}" class="social-link" target="_blank" rel="noopener" aria-label="GitHub"><i class="fab fa-github"></i></a>
    <a href="mailto:{{ site.social.email }}" class="social-link" aria-label="Email"><i class="fas fa-envelope"></i></a>
  </div>
</section>

<div class="proof-strip">
  <a href="/cloud-certifications" class="proof-item"><i class="fab fa-aws"></i> AWS Security Specialty</a>
  <a href="/cloud-certifications" class="proof-item"><i class="fas fa-cloud"></i> CCSP</a>
  <a href="/cloud-certifications" class="proof-item"><i class="fab fa-microsoft"></i> SC-300 Identity Administrator</a>
  <a href="/cloud-certifications" class="proof-item"><i class="fas fa-id-badge"></i> Okta Certified Professional</a>
  <a href="/security-certifications" class="proof-item"><i class="fas fa-shield-alt"></i> CompTIA Security+</a>
  <span class="proof-item"><i class="fas fa-graduation-cap"></i> M.S. Cybersecurity, Illinois Tech</span>
</div>

<section class="home-section">
  <div class="section-head">
    <div>
      <h2>What I focus on</h2>
      <p>Three areas, and they overlap on purpose: identity is the control plane for the cloud, and detection is how you know the controls held.</p>
    </div>
  </div>
  <div class="focus-grid">
    <div class="focus-card">
      <div class="focus-icon"><i class="fas fa-user-shield"></i></div>
      <h3>Identity &amp; Access Management</h3>
      <p>Workforce identity end to end: directory design, SSO and federation, conditional access, privileged access, and the lifecycle work that keeps entitlements honest.</p>
      <div class="tag-row">
        <span>Active Directory</span><span>Entra ID</span><span>Okta</span><span>SAML / OIDC</span><span>Conditional Access</span><span>PAM</span><span>Zero Trust</span>
      </div>
    </div>
    <div class="focus-card">
      <div class="focus-icon"><i class="fas fa-cloud"></i></div>
      <h3>Cloud Security</h3>
      <p>Least-privilege IAM, posture assessment, and infrastructure as code on AWS and Azure, with secrets kept out of the codebase and out of the tickets.</p>
      <div class="tag-row">
        <span>AWS IAM</span><span>Azure RBAC</span><span>Terraform</span><span>HashiCorp Vault</span><span>Prowler</span><span>ScoutSuite</span>
      </div>
    </div>
    <div class="focus-card">
      <div class="focus-icon"><i class="fas fa-crosshairs"></i></div>
      <h3>Detection &amp; Response</h3>
      <p>Getting the right telemetry into a SIEM, mapping detections to ATT&amp;CK, and running the response playbook when identity or cloud controls are the ones being tested.</p>
      <div class="tag-row">
        <span>Wazuh</span><span>Microsoft Sentinel</span><span>MITRE ATT&amp;CK</span><span>pfSense</span><span>Wireshark</span><span>Incident Response</span>
      </div>
    </div>
  </div>
</section>

<section class="home-section">
  <div class="section-head">
    <div>
      <h2>Featured work</h2>
      <p>Labs I build and document as if a team had to inherit them.</p>
    </div>
    <a href="/projects" class="section-link">All projects <i class="fas fa-arrow-right"></i></a>
  </div>
  <div class="work-grid">
    <div class="work-card">
      <div class="work-kicker">Identity lab</div>
      <h3>Enterprise IAM Lab: Hybrid Identity</h3>
      <p>A production-style hybrid identity environment: on-prem Active Directory federated with Okta Workforce Identity and Microsoft Entra ID, with SAML, OIDC and conditional access policies modelled on a mid-size organisation.</p>
      <div class="tag-row">
        <span>Active Directory</span><span>Okta</span><span>Entra ID</span><span>SAML 2.0</span><span>OIDC</span><span>PowerShell</span>
      </div>
      <div class="work-links">
        <a href="https://github.com/noble-antwi/enterprise-iam-lab" target="_blank" rel="noopener"><i class="fab fa-github"></i> Repository</a>
        <a href="/projects">Case study</a>
      </div>
    </div>
    <div class="work-card">
      <div class="work-kicker">Infrastructure + detection</div>
      <h3>Enterprise Security Homelab</h3>
      <p>A segmented lab network behind pfSense, with a Windows Server domain controller, Linux and Windows hosts managed by Ansible, Wazuh for SIEM, and Grafana for visibility. Built as a Blue Team environment first.</p>
      <div class="tag-row">
        <span>pfSense</span><span>VLANs</span><span>Windows Server 2022</span><span>Wazuh</span><span>Ansible</span><span>Proxmox</span>
      </div>
      <div class="work-links">
        <a href="https://github.com/noble-antwi/enterprise-security-homelab" target="_blank" rel="noopener"><i class="fab fa-github"></i> Repository</a>
        <a href="/projects">Case study</a>
      </div>
    </div>
    <div class="work-card">
      <div class="work-kicker">Cloud posture</div>
      <h3>Cloud Security Posture Dashboard</h3>
      <p>Terraform deploys deliberately misconfigured AWS and Azure resources, Prowler and ScoutSuite scan them, and a Flask dashboard normalises the findings with remediation guidance and compliance mapping.</p>
      <div class="tag-row">
        <span>Terraform</span><span>AWS</span><span>Azure</span><span>Prowler</span><span>ScoutSuite</span><span>Python</span>
      </div>
      <div class="work-links">
        <a href="https://github.com/noble-antwi/cloud-security-posture-dashboard" target="_blank" rel="noopener"><i class="fab fa-github"></i> Repository</a>
        <a href="/projects">Case study</a>
      </div>
    </div>
  </div>
</section>

<section class="home-section">
  <div class="section-head">
    <div>
      <h2>Latest writing</h2>
      <p>Lab notes and study logs, written as I go.</p>
    </div>
    <a href="/blog" class="section-link">All posts <i class="fas fa-arrow-right"></i></a>
  </div>
  <div class="post-grid-v2">
    {% for post in site.posts limit:3 %}
    <a href="{{ post.url }}" class="post-card-v2">
      <div class="post-meta-v2">
        {% if post.category %}<span class="cat">{{ post.category | replace: "-", " " }}</span><span>·</span>{% endif %}
        <span>{{ post.date | date: "%b %-d, %Y" }}</span>
        {% if post.read_time %}<span>·</span><span>{{ post.read_time }} min</span>{% endif %}
      </div>
      <h3>{{ post.title }}</h3>
      <p>{{ post.description | default: post.excerpt | strip_html | strip_newlines | truncate: 150 }}</p>
    </a>
    {% endfor %}
  </div>
</section>

<section class="home-section about-v2">
  <h2>About</h2>
  <p>I spent four years administering and securing IT infrastructure before moving fully into security, and I am now completing an M.S. in Cybersecurity and Digital Forensics at the Illinois Institute of Technology. The through-line in my work is identity: who or what is asking, what it should be allowed to do, and how you would know if that went wrong.</p>
  <p>I document everything I build, partly so others can reuse it and partly because writing it down is how I find the gaps.</p>
  <p class="about-note">Off the clock: Gospel, Lovers Rock, Afrobeat and Highlife, and Chelsea FC on the weekends I can manage it.</p>
</section>
