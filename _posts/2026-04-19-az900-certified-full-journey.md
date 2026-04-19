---
layout: post
title: "AZ-900 Certified: From Zero to 873 - The Full Journey"
date: 2026-04-19
category: learning
tags: [azure, az-900, microsoft, certification, cloud, study-notes]
read_time: 12
---

It is done. On April 19, 2026, I passed the Microsoft Azure AZ-900 Fundamentals exam with a score of **873 out of 1000**. The passing threshold is 700. This post is the full story of how I got there.

---

<div style="background: linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(16,185,129,0.15) 100%); border: 2px solid rgba(16,185,129,0.4); border-radius: 16px; padding: 2.5rem; text-align: center; margin: 2rem 0;">
  <div style="font-size: 0.95rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem;">Microsoft Certified</div>
  <div style="font-size: 1.6rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.5rem;">Azure Fundamentals</div>
  <div style="font-size: 4rem; font-weight: 900; color: #10b981; line-height: 1; margin: 1rem 0;">873</div>
  <div style="font-size: 1rem; color: var(--text-secondary); margin-bottom: 1.5rem;">out of 1000 &nbsp;|&nbsp; Passing Score: 700</div>
  <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
    <span style="background: #10b981; color: white; padding: 0.5rem 1.5rem; border-radius: 20px; font-weight: 700; font-size: 1.1rem;">PASS</span>
    <span style="background: rgba(6,182,212,0.2); color: #06b6d4; padding: 0.5rem 1.5rem; border-radius: 20px; font-weight: 600; border: 1px solid rgba(6,182,212,0.3);">April 19, 2026</span>
  </div>
</div>

---

## Where It Started

A few weeks ago I was preparing for a potential AWS Data Centre interview and decided to use the time productively. AZ-900 had been on my list for a long time. I already had real-world Azure experience from years of working across cloud platforms, but I wanted the credential to reflect that formally. The timing made sense: structured review of Azure fundamentals would reinforce what I already knew and close any gaps before going deeper into Azure administration with AZ-104.

So I cleared my study schedule, opened Tutorial Dojo, and started working.

---

## The Study Materials

Rather than taking a traditional course, I built my own notes from scratch. As I worked through each topic, I wrote up what I learned and published it here. The posts became a useful reference as I moved toward the exam.

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; margin: 1.5rem 0;">
  <a href="/learning/2026/02/24/az900-azure-fundamentals-journey.html" style="text-decoration: none;">
    <div style="background: rgba(6,182,212,0.07); border: 1px solid rgba(6,182,212,0.2); border-radius: 10px; padding: 1.2rem; transition: border-color 0.2s; cursor: pointer;">
      <div style="font-size: 0.8rem; color: #06b6d4; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">Study Notes <i class="fas fa-arrow-right" style="font-size: 0.7rem;"></i></div>
      <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 0.3rem;">Cloud Concepts</div>
      <div style="font-size: 0.9rem; color: var(--text-secondary);">IaaS, PaaS, SaaS, shared responsibility, cloud models</div>
    </div>
  </a>
  <a href="/learning/2026/04/04/az900-governance-tags-and-compliance.html" style="text-decoration: none;">
    <div style="background: rgba(6,182,212,0.07); border: 1px solid rgba(6,182,212,0.2); border-radius: 10px; padding: 1.2rem; transition: border-color 0.2s; cursor: pointer;">
      <div style="font-size: 0.8rem; color: #06b6d4; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">Study Notes <i class="fas fa-arrow-right" style="font-size: 0.7rem;"></i></div>
      <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 0.3rem;">Governance and Compliance</div>
      <div style="font-size: 0.9rem; color: var(--text-secondary);">Azure Policy, Resource Locks, RBAC, Purview, Tags</div>
    </div>
  </a>
  <a href="/learning/2026/04/05/az900-managing-deploying-azure-resources.html" style="text-decoration: none;">
    <div style="background: rgba(6,182,212,0.07); border: 1px solid rgba(6,182,212,0.2); border-radius: 10px; padding: 1.2rem; transition: border-color 0.2s; cursor: pointer;">
      <div style="font-size: 0.8rem; color: #06b6d4; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">Study Notes <i class="fas fa-arrow-right" style="font-size: 0.7rem;"></i></div>
      <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 0.3rem;">Management Tools and Deployment</div>
      <div style="font-size: 0.9rem; color: var(--text-secondary);">Azure Portal, CLI, PowerShell, Azure Arc, Bicep, ARM, VPN types</div>
    </div>
  </a>
  <a href="/learning/2026/04/05/az900-monitoring-tools.html" style="text-decoration: none;">
    <div style="background: rgba(6,182,212,0.07); border: 1px solid rgba(6,182,212,0.2); border-radius: 10px; padding: 1.2rem; transition: border-color 0.2s; cursor: pointer;">
      <div style="font-size: 0.8rem; color: #06b6d4; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">Study Notes <i class="fas fa-arrow-right" style="font-size: 0.7rem;"></i></div>
      <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 0.3rem;">Monitoring and Observability</div>
      <div style="font-size: 0.9rem; color: var(--text-secondary);">Azure Advisor, Service Health, Azure Monitor, Log Analytics</div>
    </div>
  </a>
</div>

Writing the notes helped. Explaining something in your own words is a different level of processing than reading a bullet list. By the time I sat the exam, the material felt familiar rather than memorised.

---

## The Practice Test Journey

I used **Tutorial Dojo** for all practice tests. The question sets are well written and the explanations are detailed enough to actually learn from, not just check answers.

Here is how the test scores progressed:

<div style="margin: 2rem 0;">
  <div style="background: var(--bg-card, rgba(255,255,255,0.03)); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; overflow: hidden;">
    <div style="display: grid; grid-template-columns: auto 1fr auto; gap: 1rem; padding: 0.8rem 1.2rem; background: rgba(6,182,212,0.1); font-size: 0.85rem; font-weight: 700; color: #06b6d4; text-transform: uppercase; letter-spacing: 0.05em;">
      <div>Test</div>
      <div>Set</div>
      <div>Score</div>
    </div>

    <div style="display: grid; grid-template-columns: auto 1fr auto; gap: 1rem; align-items: center; padding: 1rem 1.2rem; border-bottom: 1px solid rgba(255,255,255,0.05);">
      <div style="font-weight: 700; color: var(--text-primary); min-width: 60px;">Test 1</div>
      <div>
        <div style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 0.4rem;">Tutorial Dojo - Set 1, First Attempt</div>
        <div style="background: rgba(255,255,255,0.06); height: 6px; border-radius: 3px;">
          <div style="background: #f59e0b; height: 100%; width: 83.78%; border-radius: 3px;"></div>
        </div>
      </div>
      <div style="font-weight: 700; color: #f59e0b; min-width: 60px; text-align: right;">83.78%</div>
    </div>

    <div style="display: grid; grid-template-columns: auto 1fr auto; gap: 1rem; align-items: center; padding: 1rem 1.2rem; border-bottom: 1px solid rgba(255,255,255,0.05);">
      <div style="font-weight: 700; color: var(--text-primary); min-width: 60px;">Test 2</div>
      <div>
        <div style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 0.4rem;">Tutorial Dojo - Set 1, Second Attempt</div>
        <div style="background: rgba(255,255,255,0.06); height: 6px; border-radius: 3px;">
          <div style="background: #10b981; height: 100%; width: 94.59%; border-radius: 3px;"></div>
        </div>
      </div>
      <div style="font-weight: 700; color: #10b981; min-width: 60px; text-align: right;">94.59%</div>
    </div>

    <div style="display: grid; grid-template-columns: auto 1fr auto; gap: 1rem; align-items: center; padding: 1rem 1.2rem; border-bottom: 1px solid rgba(255,255,255,0.05);">
      <div style="font-weight: 700; color: var(--text-primary); min-width: 60px;">Test 3</div>
      <div>
        <div style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 0.4rem;">Tutorial Dojo - Set 2, First Attempt</div>
        <div style="background: rgba(255,255,255,0.06); height: 6px; border-radius: 3px;">
          <div style="background: #f59e0b; height: 100%; width: 81.82%; border-radius: 3px;"></div>
        </div>
      </div>
      <div style="font-weight: 700; color: #f59e0b; min-width: 60px; text-align: right;">81.82%</div>
    </div>

    <div style="display: grid; grid-template-columns: auto 1fr auto; gap: 1rem; align-items: center; padding: 1rem 1.2rem;">
      <div style="font-weight: 700; color: var(--text-primary); min-width: 60px;">Test 4</div>
      <div>
        <div style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 0.4rem;">Tutorial Dojo - Set 3, First Attempt</div>
        <div style="background: rgba(255,255,255,0.06); height: 6px; border-radius: 3px;">
          <div style="background: #ef4444; height: 100%; width: 78.38%; border-radius: 3px;"></div>
        </div>
      </div>
      <div style="font-weight: 700; color: #ef4444; min-width: 60px; text-align: right;">78.38%</div>
    </div>
  </div>
</div>

The drop from 94.59% on the second attempt to 78.38% on Set 3 was not encouraging. That third question set exposed real weaknesses, particularly in Management and Governance, where I scored below 70% for the first time. Rather than panic, I treated it as exactly what practice tests are for: finding the gaps before the real thing.

I went back through the weak areas, revisited my notes, and made sure I understood the reasoning behind the answers rather than just memorising them.

---

## Exam Day: Section Performance

The actual exam matched the format I had practised. Three domains, each with a clear weight. Here is how I did across all three:

<div style="margin: 2rem 0;">
  <div style="margin-bottom: 1.5rem;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
      <span style="font-weight: 600; color: var(--text-primary);">Describe Cloud Concepts</span>
      <span style="font-weight: 700; color: #10b981;">Strong</span>
    </div>
    <div style="background: rgba(255,255,255,0.06); height: 10px; border-radius: 5px;">
      <div style="background: linear-gradient(90deg, #10b981, #06b6d4); height: 100%; width: 88%; border-radius: 5px;"></div>
    </div>
    <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.3rem;">IaaS, PaaS, SaaS, shared responsibility model, cloud deployment types</div>
  </div>

  <div style="margin-bottom: 1.5rem;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
      <span style="font-weight: 600; color: var(--text-primary);">Describe Azure Architecture and Services</span>
      <span style="font-weight: 700; color: #10b981;">Strong</span>
    </div>
    <div style="background: rgba(255,255,255,0.06); height: 10px; border-radius: 5px;">
      <div style="background: linear-gradient(90deg, #10b981, #06b6d4); height: 100%; width: 85%; border-radius: 5px;"></div>
    </div>
    <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.3rem;">Compute, networking, storage, identity, security services</div>
  </div>

  <div style="margin-bottom: 1.5rem;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
      <span style="font-weight: 600; color: var(--text-primary);">Describe Azure Management and Governance</span>
      <span style="font-weight: 700; color: #10b981;">Strong</span>
    </div>
    <div style="background: rgba(255,255,255,0.06); height: 10px; border-radius: 5px;">
      <div style="background: linear-gradient(90deg, #10b981, #06b6d4); height: 100%; width: 87%; border-radius: 5px;"></div>
    </div>
    <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.3rem;">Cost management, Azure Policy, RBAC, resource locks, monitoring tools</div>
  </div>
</div>

The section that had caused problems in practice, Management and Governance, held up on the real exam. That is what the extra review time was for.

---

## The Credential

<div style="background: rgba(6,182,212,0.06); border: 1px solid rgba(6,182,212,0.25); border-radius: 12px; padding: 1.5rem; margin: 1.5rem 0;">
  <div style="display: grid; grid-template-columns: auto 1fr; gap: 1rem; align-items: start;">
    <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #06b6d4, #0284c7); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
      <i class="fab fa-microsoft" style="color: white; font-size: 1.4rem;"></i>
    </div>
    <div>
      <div style="font-weight: 700; color: var(--text-primary); font-size: 1.05rem;">Microsoft Certified: Azure Fundamentals</div>
      <div style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.2rem;">Earned April 19, 2026</div>
      <div style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 0.4rem;">Credential ID: 59914E901AC5CF08 &nbsp;|&nbsp; Cert No: 950F3F-VB3714</div>
      <div style="margin-top: 0.8rem;">
        <a href="https://learn.microsoft.com/api/credentials/share/en-us/nobleantwi/59914E901AC5CF08?sharingId=3DD1334494500325" target="_blank" style="display: inline-flex; align-items: center; gap: 0.4rem; background: rgba(6,182,212,0.15); border: 1px solid rgba(6,182,212,0.3); color: #06b6d4; padding: 0.4rem 1rem; border-radius: 6px; font-size: 0.9rem; font-weight: 600; text-decoration: none;">
          <i class="fas fa-external-link-alt" style="font-size: 0.75rem;"></i> Verify on Microsoft Learn
        </a>
      </div>
    </div>
  </div>
</div>

---

## What I Would Do Differently

Nothing significant. The approach worked: build your own notes, practice with a good question bank, go deep on the areas that fall below threshold, and trust the preparation.

One thing I would say to anyone starting AZ-900: the practice test score that worried you most is the most useful data point you will get. Set 3 dropping to 78.38% forced a focused review of Management and Governance that almost certainly made the difference in that section on exam day.

Do not chase high practice scores. Chase understanding.

---

## What Is Next

The AZ-900 is the foundation. The natural next step is **AZ-104**, the Azure Administrator Associate exam. Where AZ-900 covers the concepts, AZ-104 goes deep into the hands-on administration: virtual networks, storage accounts, identity configuration, resource monitoring, and troubleshooting real deployments.

I already have the AZ-104 course from Udemy at 93% completion. The gap between course completion and exam readiness is where Tutorial Dojo will come in again.

Alongside that, I am continuing with CCNA networking fundamentals and CompTIA Server+ as preparation for infrastructure work. Both are running in parallel.

The study notes will keep coming.

---

<div style="background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.25); border-radius: 12px; padding: 1.5rem; margin: 1.5rem 0; text-align: center;">
  <div style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem;">AZ-900: Certified</div>
  <div style="font-size: 0.95rem; color: var(--text-secondary);">873/1000 &nbsp;|&nbsp; Microsoft Certified: Azure Fundamentals &nbsp;|&nbsp; April 2026</div>
  <div style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.5rem;">Next: AZ-104 Microsoft Azure Administrator</div>
</div>

If you are working through AZ-900 or planning to start, feel free to [reach out](/contact). Always good to compare notes on what works.
