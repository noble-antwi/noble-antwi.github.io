---
layout: default
title: Blog
description: "Noble Antwi's writing: lab notes from the homelab and IAM builds, certification study logs, and published articles on AWS security, identity, and threat analysis."
---

<div class="page-head">
  <p class="page-kicker">Writing</p>
  <h1 class="page-title">Lab notes, study logs, and the occasional long read</h1>
  <p class="page-lead">Raw notes from what I'm building and studying, written as I go, plus polished articles published on Medium.</p>
</div>

{% assign posts = site.posts %}
{% assign learning_count = posts | where: "category", "learning" | size %}
{% assign labnotes_count = posts | where: "category", "lab-notes" | size %}
{% assign project_count = posts | where: "category", "project-update" | size %}
{% assign cloudsec_count = posts | where: "category", "cloud-security" | size %}
{% assign til_count = posts | where: "category", "til" | size %}

<section class="blog-section" id="journal">
  <div class="section-head">
    <div>
      <h2>Journal</h2>
      <p>{{ posts.size }} entries. Things I built, things I learned, and the parts that confused me until they didn't.</p>
    </div>
    <a href="/feed.xml" class="section-link"><i class="fas fa-rss"></i> RSS</a>
  </div>

  <div class="filter-tabs" data-filter-group="posts" role="group" aria-label="Filter posts">
    <button class="filter-tab is-active" data-filter="all" aria-pressed="true">All <span class="count">{{ posts.size }}</span></button>
    {% if labnotes_count > 0 %}<button class="filter-tab" data-filter="lab-notes" aria-pressed="false"><i class="fas fa-flask"></i> Lab notes <span class="count">{{ labnotes_count }}</span></button>{% endif %}
    {% if learning_count > 0 %}<button class="filter-tab" data-filter="learning" aria-pressed="false"><i class="fas fa-graduation-cap"></i> Learning <span class="count">{{ learning_count }}</span></button>{% endif %}
    {% if project_count > 0 %}<button class="filter-tab" data-filter="project-update" aria-pressed="false"><i class="fas fa-code-branch"></i> Project updates <span class="count">{{ project_count }}</span></button>{% endif %}
    {% if cloudsec_count > 0 %}<button class="filter-tab" data-filter="cloud-security" aria-pressed="false"><i class="fas fa-cloud"></i> Cloud security <span class="count">{{ cloudsec_count }}</span></button>{% endif %}
    {% if til_count > 0 %}<button class="filter-tab" data-filter="til" aria-pressed="false"><i class="fas fa-lightbulb"></i> TIL <span class="count">{{ til_count }}</span></button>{% endif %}
  </div>

  <div class="post-grid-v2">
    {% for post in posts %}
    <a href="{{ post.url }}" class="post-card-v2" data-filter-item data-filter-group="posts" data-cat="{{ post.category }}">
      <div class="post-meta-v2">
        {% if post.category %}<span class="cat">{{ post.category | replace: "-", " " }}</span><span>·</span>{% endif %}
        <span>{{ post.date | date: "%b %-d, %Y" }}</span>
        {% if post.read_time %}<span>·</span><span>{{ post.read_time }} min</span>{% endif %}
      </div>
      <h3>{{ post.title }}</h3>
      <p>{{ post.description | default: post.excerpt | strip_html | strip_newlines | truncate: 160 }}</p>
      {% if post.tags and post.tags.size > 0 %}
      <div class="tag-row">
        {% for tag in post.tags limit:4 %}<span>{{ tag }}</span>{% endfor %}
      </div>
      {% endif %}
    </a>
    {% endfor %}
  </div>

  <div class="filter-empty" data-filter-group="posts">
    <i class="fas fa-search" style="font-size: 1.6rem; opacity: 0.5;"></i>
    <p>No posts in this category yet.</p>
  </div>
</section>

<section class="blog-section" id="articles">
  <div class="section-head">
    <div>
      <h2>Published articles</h2>
      <p>Longer, edited pieces on Medium and AWS in Plain English.</p>
    </div>
    <a href="https://medium.com/@noble-antwi" class="section-link" target="_blank" rel="noopener">Medium profile <i class="fas fa-external-link-alt"></i></a>
  </div>

  <div class="filter-tabs" data-filter-group="articles" role="group" aria-label="Filter articles">
    <button class="filter-tab is-active" data-filter="all" aria-pressed="true">All <span class="count">11</span></button>
    <button class="filter-tab" data-filter="aws" aria-pressed="false"><i class="fab fa-aws"></i> AWS &amp; cloud <span class="count">6</span></button>
    <button class="filter-tab" data-filter="threat" aria-pressed="false"><i class="fas fa-crosshairs"></i> Threat analysis <span class="count">5</span></button>
  </div>

  <div class="article-list">
    <a class="article-row" data-filter-item data-filter-group="articles" data-cat="aws" href="https://aws.plainenglish.io/why-cloud-security-is-no-longer-optional-for-growing-businesses-812f04a708cb" target="_blank" rel="noopener">
      <div>
        <h3>Why Cloud Security Is No Longer Optional for Growing Businesses</h3>
        <div class="article-meta"><b>AWS in Plain English</b> · July 8, 2025 · Cloud security, AWS, best practices</div>
      </div>
      <span class="article-go">Read <i class="fas fa-arrow-right"></i></span>
    </a>
    <a class="article-row" data-filter-item data-filter-group="articles" data-cat="aws" href="https://aws.plainenglish.io/using-service-control-policies-scps-to-restrict-aws-account-access-a-hands-on-guide-f818be31c88f" target="_blank" rel="noopener">
      <div>
        <h3>Using Service Control Policies (SCPs) to Restrict AWS Account Access: A Hands-On Guide</h3>
        <div class="article-meta"><b>AWS in Plain English</b> · April 16, 2025 · AWS Organizations, SCPs, IAM</div>
      </div>
      <span class="article-go">Read <i class="fas fa-arrow-right"></i></span>
    </a>
    <a class="article-row" data-filter-item data-filter-group="articles" data-cat="aws" href="https://medium.com/@noble-antwi/building-an-aws-multi-account-structure-with-aws-organizations-hands-on-guide-e09a0f0d2bf6" target="_blank" rel="noopener">
      <div>
        <h3>Building an AWS Multi-Account Structure with AWS Organizations</h3>
        <div class="article-meta"><b>Medium</b> · April 15, 2025 · AWS Organizations, multi-account, governance</div>
      </div>
      <span class="article-go">Read <i class="fas fa-arrow-right"></i></span>
    </a>
    <a class="article-row" data-filter-item data-filter-group="articles" data-cat="aws" href="https://medium.com/@noble-antwi/guardduty-runtime-monitoring-for-ec2-a-hands-on-guide-with-troubleshooting-3d4976cb4158" target="_blank" rel="noopener">
      <div>
        <h3>GuardDuty Runtime Monitoring for EC2: A Hands-On Guide with Troubleshooting</h3>
        <div class="article-meta"><b>Medium</b> · February 27, 2025 · GuardDuty, EC2, threat detection</div>
      </div>
      <span class="article-go">Read <i class="fas fa-arrow-right"></i></span>
    </a>
    <a class="article-row" data-filter-item data-filter-group="articles" data-cat="aws" href="https://medium.com/@noble-antwi/implementing-envelope-encryption-with-aws-kms-a-step-by-step-guide-91fda46879c4" target="_blank" rel="noopener">
      <div>
        <h3>Implementing Envelope Encryption with AWS KMS: A Step-by-Step Guide</h3>
        <div class="article-meta"><b>Medium</b> · February 16, 2025 · KMS, encryption, data security</div>
      </div>
      <span class="article-go">Read <i class="fas fa-arrow-right"></i></span>
    </a>
    <a class="article-row" data-filter-item data-filter-group="articles" data-cat="aws" href="https://aws.plainenglish.io/data-loss-prevention-in-the-cloud-a-comprehensive-guide-with-a-focus-on-aws-d49e37f31b39" target="_blank" rel="noopener">
      <div>
        <h3>Data Loss Prevention in the Cloud: A Comprehensive Guide with a Focus on AWS</h3>
        <div class="article-meta"><b>AWS in Plain English</b> · Data protection, DLP, compliance</div>
      </div>
      <span class="article-go">Read <i class="fas fa-arrow-right"></i></span>
    </a>
    <a class="article-row" data-filter-item data-filter-group="articles" data-cat="threat" href="https://medium.com/@noble-antwi/digital-deception-dissecting-a-phishing-email-and-its-malicious-payload-e1eb61985a0a" target="_blank" rel="noopener">
      <div>
        <h3>Digital Deception: Dissecting a Phishing Email and Its Malicious Payload</h3>
        <div class="article-meta"><b>Medium</b> · January 13, 2025 · Phishing, malware analysis, threat intel</div>
      </div>
      <span class="article-go">Read <i class="fas fa-arrow-right"></i></span>
    </a>
    <a class="article-row" data-filter-item data-filter-group="articles" data-cat="threat" href="https://medium.com/@noble-antwi/advanced-techniques-in-email-header-analysis-for-phishing-detection-c5567f1caa00" target="_blank" rel="noopener">
      <div>
        <h3>Advanced Techniques in Email Header Analysis for Phishing Detection</h3>
        <div class="article-meta"><b>Medium</b> · January 13, 2025 · Email forensics, header analysis, detection</div>
      </div>
      <span class="article-go">Read <i class="fas fa-arrow-right"></i></span>
    </a>
    <a class="article-row" data-filter-item data-filter-group="articles" data-cat="threat" href="https://medium.com/@noble-antwi/phishing-attack-detection-and-response-a-case-study-of-mighty-solutions-inc-c8c302fea859" target="_blank" rel="noopener">
      <div>
        <h3>Phishing Detection and Mitigation in Practice: The Mighty Solutions, Inc. Case</h3>
        <div class="article-meta"><b>Medium</b> · January 10, 2025 · Incident response, mitigation, case study</div>
      </div>
      <span class="article-go">Read <i class="fas fa-arrow-right"></i></span>
    </a>
    <a class="article-row" data-filter-item data-filter-group="articles" data-cat="threat" href="https://medium.com/@noble-antwi/microsoft-security-updates-critical-fixes-and-zero-day-vulnerabilities-5398b24aa041" target="_blank" rel="noopener">
      <div>
        <h3>Microsoft Security Updates: Critical Fixes and Zero-Day Vulnerabilities</h3>
        <div class="article-meta"><b>Medium</b> · January 2025 · Security updates, vulnerabilities, patch management</div>
      </div>
      <span class="article-go">Read <i class="fas fa-arrow-right"></i></span>
    </a>
    <a class="article-row" data-filter-item data-filter-group="articles" data-cat="threat aws" href="https://medium.com/@noble-antwi/launching-an-ec2-linux-hands-on-lab-94a1a6d6d49b" target="_blank" rel="noopener">
      <div>
        <h3>Launching an EC2 Linux Hands-On Lab</h3>
        <div class="article-meta"><b>Medium</b> · 2025 · EC2, Linux, hands-on lab</div>
      </div>
      <span class="article-go">Read <i class="fas fa-arrow-right"></i></span>
    </a>
  </div>

  <div class="filter-empty" data-filter-group="articles">
    <p>No articles in this category yet.</p>
  </div>
</section>

<div class="cta-band">
  <p>Want to talk through any of this, or working on something similar?</p>
  <a href="/contact" class="btn"><i class="fas fa-envelope"></i> Get in touch</a>
</div>
