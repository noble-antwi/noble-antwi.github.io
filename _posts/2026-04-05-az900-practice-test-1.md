---
layout: post
title: "My AZ-900 Journey: First Practice Test - 83.78% and What It Revealed"
date: 2026-04-05
category: learning
tags: [azure, cloud, certification, az-900, microsoft, practice-test]
read_time: 8
---

After working through all the core AZ-900 course material, from cloud concepts and Azure architecture all the way through to governance, monitoring, and infrastructure as code, it was time to put that knowledge to the test. I sat my first full practice test from **Tutorial Dojo**, and this post is an honest account of how it went, what the results revealed, and what I am taking away from it.

<br>

## The Result

<img src="/assets/az900/00_practice_test_1.png" alt="AZ-900 Practice Test 1 result showing 83.78% score" style="max-width:100%; border-radius:10px; border:1px solid rgba(6,182,212,0.3); margin:1.5rem 0;" />

<div style="background:linear-gradient(135deg,#1e293b 0%,#0f172a 100%); border:1px solid rgba(6,182,212,0.4); border-radius:14px; padding:2rem; margin:2rem 0; text-align:center; box-shadow:0 0 30px rgba(6,182,212,0.12);">
  <div style="font-size:0.85rem; color:#94a3b8; text-transform:uppercase; letter-spacing:2px; margin-bottom:0.5rem;">Overall Score</div>
  <div style="font-size:4rem; font-weight:900; background:linear-gradient(135deg,#06b6d4,#22d3ee); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; line-height:1.1;">83.78%</div>
  <div style="color:#cbd5e1; font-size:1.1rem; margin-top:0.5rem;">62 out of 74 points</div>
  <div style="display:inline-block; margin-top:1rem; background:rgba(16,185,129,0.15); border:1px solid #10b981; border-radius:50px; padding:0.4rem 1.4rem; color:#10b981; font-weight:700; font-size:0.95rem; letter-spacing:1px;">PASSED</div>
</div>

<div style="display:grid; grid-template-columns:repeat(3,1fr); gap:1rem; margin:1.5rem 0;">
  <div style="background:#1e293b; border:1px solid rgba(6,182,212,0.25); border-radius:10px; padding:1.2rem; text-align:center;">
    <div style="font-size:1.8rem; font-weight:800; color:#06b6d4;">50</div>
    <div style="font-size:0.8rem; color:#94a3b8; text-transform:uppercase; letter-spacing:1px; margin-top:0.3rem;">Questions</div>
  </div>
  <div style="background:#1e293b; border:1px solid rgba(6,182,212,0.25); border-radius:10px; padding:1.2rem; text-align:center;">
    <div style="font-size:1.8rem; font-weight:800; color:#06b6d4;">23:02</div>
    <div style="font-size:0.8rem; color:#94a3b8; text-transform:uppercase; letter-spacing:1px; margin-top:0.3rem;">Time Taken</div>
  </div>
  <div style="background:#1e293b; border:1px solid rgba(6,182,212,0.25); border-radius:10px; padding:1.2rem; text-align:center;">
    <div style="font-size:1.8rem; font-weight:800; color:#10b981;">70%</div>
    <div style="font-size:0.8rem; color:#94a3b8; text-transform:uppercase; letter-spacing:1px; margin-top:0.3rem;">Pass Threshold</div>
  </div>
</div>

That is a pass. The AZ-900 exam requires a score of 700 out of 1000 (roughly 70%), so sitting at 83.78% on the first attempt at a practice test is an encouraging starting position. That said, the gap between 83% and the confidence I want going into the real exam is where the work still lives.

<br>

## Breakdown by Category

<div style="background:#1e293b; border:1px solid rgba(6,182,212,0.2); border-radius:12px; padding:1.8rem; margin:2rem 0;">

  <div style="margin-bottom:1.6rem;">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
      <span style="color:#f1f5f9; font-weight:600; font-size:0.95rem;">Describe Cloud Concepts</span>
      <span style="color:#06b6d4; font-weight:700;">85.71%</span>
    </div>
    <div style="background:#0f172a; border-radius:50px; height:10px; overflow:hidden;">
      <div style="width:85.71%; height:100%; background:linear-gradient(90deg,#06b6d4,#22d3ee); border-radius:50px;"></div>
    </div>
  </div>

  <div style="margin-bottom:1.6rem;">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
      <span style="color:#f1f5f9; font-weight:600; font-size:0.95rem;">Describe Azure Architecture and Services</span>
      <span style="color:#06b6d4; font-weight:700;">84.21%</span>
    </div>
    <div style="background:#0f172a; border-radius:50px; height:10px; overflow:hidden;">
      <div style="width:84.21%; height:100%; background:linear-gradient(90deg,#06b6d4,#22d3ee); border-radius:50px;"></div>
    </div>
  </div>

  <div style="margin-bottom:0.4rem;">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
      <span style="color:#f1f5f9; font-weight:600; font-size:0.95rem;">Describe Azure Management and Governance</span>
      <span style="color:#f59e0b; font-weight:700;">81.82%</span>
    </div>
    <div style="background:#0f172a; border-radius:50px; height:10px; overflow:hidden;">
      <div style="width:81.82%; height:100%; background:linear-gradient(90deg,#f59e0b,#fbbf24); border-radius:50px;"></div>
    </div>
  </div>

  <div style="margin-top:1.2rem; padding-top:1.2rem; border-top:1px solid rgba(6,182,212,0.15); font-size:0.82rem; color:#64748b;">
    All three domains cleared the 70% passing threshold.
  </div>
</div>

All three categories came in above the passing threshold, which confirms that the foundation is solid across the board. But the pattern in the numbers tells a story worth paying attention to.

**Cloud Concepts** being the strongest at 85.71% is not surprising. These are the most conceptual topics, covering cloud models, deployment types, shared responsibility, and the core value proposition of cloud computing. They are also the areas I have the most prior exposure to from working with AWS.

**Architecture and Services** at 84.21% covers the largest surface area of the exam: compute, networking, storage, identity, and the core Azure service catalogue. The score here is solid, but given how many services fall into this domain, a few percentage points of improvement likely require sharpening knowledge on specific service distinctions rather than fixing any broad conceptual gap.

**Management and Governance** at 81.82% is the lowest of the three and the area that most warrants focused revision. This domain covers Azure Policy, RBAC, resource locks, cost management, and the management and monitoring tools. Several of these topics involve nuanced distinctions that are easy to conflate under exam pressure.

<br>

## Reflections on the Attempt

### Timing

Completing 50 questions in just over 23 minutes works out to roughly **28 seconds per question**. The real AZ-900 exam allows 60 minutes for between 40 and 60 questions, so time is not the constraint here. The risk of moving quickly is that it becomes easy to read past subtleties in how questions are worded. AZ-900 questions are often designed to test the distinction between two similar-sounding services or concepts, and those distinctions require careful reading.

### What Caught Me Out

The questions I was least confident on tended to fall into a few patterns:

**Service scope and boundaries.** Questions that ask which tool is responsible for a specific type of task are easy to get wrong when similar-sounding services exist. For example, distinguishing what Azure Service Health reports on versus what Azure Monitor surfaces, or understanding where Azure Advisor fits relative to both of them. The lines between these tools are clear in theory but can blur under exam conditions.

**Pricing and cost management specifics.** The Management and Governance domain includes several cost management tools: the Pricing Calculator, the Total Cost of Ownership (TCO) Calculator, and Azure Cost Management. Getting specific about which tool is designed for which purpose is an area worth tightening up. Estimating future spend, comparing on-premises costs to cloud costs, and monitoring actual spend are three different tasks that require three different tools.

**SLA and compliance details.** Questions involving specific SLA percentages for Azure services, or which compliance certifications apply to which services, require factual recall rather than conceptual understanding. These are exactly the kinds of details that practice tests are good at exposing.

<br>

## What I Am Going Back To Review

<div style="background:#1e293b; border:1px solid rgba(6,182,212,0.2); border-radius:12px; padding:1.8rem; margin:2rem 0;">
  <div style="color:#06b6d4; font-weight:700; font-size:1rem; margin-bottom:1.2rem; text-transform:uppercase; letter-spacing:1px;">Revision Priority List</div>

  <div style="display:flex; align-items:flex-start; gap:1rem; margin-bottom:1rem;">
    <div style="width:28px; height:28px; min-width:28px; background:rgba(6,182,212,0.15); border:1px solid #06b6d4; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.8rem; font-weight:700; color:#06b6d4;">1</div>
    <div>
      <div style="color:#f1f5f9; font-weight:600;">Azure Management and Governance tools in depth</div>
      <div style="color:#94a3b8; font-size:0.9rem; margin-top:0.2rem;">Clearly distinguish Azure Advisor, Azure Monitor, Azure Service Health, Microsoft Purview, and Cost Management as tools with separate scopes and purposes.</div>
    </div>
  </div>

  <div style="display:flex; align-items:flex-start; gap:1rem; margin-bottom:1rem;">
    <div style="width:28px; height:28px; min-width:28px; background:rgba(6,182,212,0.15); border:1px solid #06b6d4; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.8rem; font-weight:700; color:#06b6d4;">2</div>
    <div>
      <div style="color:#f1f5f9; font-weight:600;">Cost management tools</div>
      <div style="color:#94a3b8; font-size:0.9rem; margin-top:0.2rem;">Nail the distinction between the Pricing Calculator, TCO Calculator, and Azure Cost Management as three instruments with three different use cases.</div>
    </div>
  </div>

  <div style="display:flex; align-items:flex-start; gap:1rem; margin-bottom:1rem;">
    <div style="width:28px; height:28px; min-width:28px; background:rgba(6,182,212,0.15); border:1px solid #06b6d4; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.8rem; font-weight:700; color:#06b6d4;">3</div>
    <div>
      <div style="color:#f1f5f9; font-weight:600;">SLA specifics and composite SLAs</div>
      <div style="color:#94a3b8; font-size:0.9rem; margin-top:0.2rem;">Revisit availability guarantees for key services and understand how SLAs multiply when multiple services are combined in an architecture.</div>
    </div>
  </div>

  <div style="display:flex; align-items:flex-start; gap:1rem;">
    <div style="width:28px; height:28px; min-width:28px; background:rgba(6,182,212,0.15); border:1px solid #06b6d4; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.8rem; font-weight:700; color:#06b6d4;">4</div>
    <div>
      <div style="color:#f1f5f9; font-weight:600;">Identity and access nuances</div>
      <div style="color:#94a3b8; font-size:0.9rem; margin-top:0.2rem;">Revisit the distinction between authentication and authorisation, the role of Microsoft Entra ID, and how Conditional Access policies work.</div>
    </div>
  </div>
</div>

<br>

## The Bigger Picture

An 83.78% on a first timed practice test, completed without any review pass, is a result I am genuinely pleased with. It reflects the work put in across all the study posts that preceded it.

But practice tests serve a specific function: they reveal what you do not yet know with a precision that passive study cannot. The 16.22% that did not score is now the most useful data point in the entire preparation process. Every question I got wrong is a pointer to something worth revisiting, and that is exactly how practice tests are supposed to work.

The plan from here is to review the Tutorial Dojo explanations for every question I missed, revisit the relevant material, and sit another practice test before scheduling the real exam.

<br>

---

If you are preparing for AZ-900 and have thoughts on the exam or the Tutorial Dojo material, feel free to [reach out](/contact). Always good to compare notes with others on the same path.
