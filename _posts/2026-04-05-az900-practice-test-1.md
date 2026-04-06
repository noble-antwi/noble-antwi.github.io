---
layout: post
title: "My AZ-900 Journey: First Practice Test - 83.78% and What It Revealed"
date: 2026-04-05
category: learning
tags: [azure, cloud, certification, az-900, microsoft, practice-test]
read_time: 8
---

After working through all the core AZ-900 course material — from cloud concepts and Azure architecture all the way through to governance, monitoring, and infrastructure as code — it was time to put that knowledge to the test. I sat my first full practice test from **Tutorial Dojo**, and this post is an honest account of how it went, what the results revealed, and what I am taking away from it.

---

## The Result

![AZ-900 Practice Test 1 result — 82 out of 98 points, 83.78%](/assets/az900/00_practice_test_1.png)

**62 out of 74 points — 83.78%**

50 questions. Timed mode. Completed in **23 minutes and 2 seconds**.

That is a pass. The AZ-900 exam requires a score of 700 out of 1000 (roughly 70%), so sitting at 83.78% on the first attempt at a practice test is an encouraging starting position. That said, the gap between 83% and the confidence I want to walk into the real exam with is where the work still lives.

---

## Breakdown by Category

| Domain | Score |
| --- | --- |
| Describe Cloud Concepts | 85.71% |
| Describe Azure Architecture and Services | 84.21% |
| Describe Azure Management and Governance | 81.82% |

All three categories cleared the 70% passing threshold, which confirms that the foundation is there across the board. But the pattern in the numbers tells a story worth paying attention to.

**Cloud Concepts** being the strongest at 85.71% is not surprising. These are the most conceptual topics — cloud models, deployment types, shared responsibility, and the core value proposition of cloud computing. They are also the areas I have the most prior exposure to from working with AWS.

**Architecture and Services** at 84.21% covers the largest surface area of the exam: compute, networking, storage, identity, and the core Azure service catalogue. The score here is solid, but given how many services fall into this domain, a few percentage points of improvement likely require sharpening knowledge on specific service distinctions rather than fixing any broad conceptual gap.

**Management and Governance** at 81.82% is the lowest of the three and the area that most warrants focused revision. This domain covers Azure Policy, RBAC, resource locks, cost management, and the management and monitoring tools. Several of these topics involve nuanced distinctions — for example, understanding exactly when to use a resource lock versus a policy, or how Azure Advisor's recommendations differ in scope from Azure Monitor's alerts — that are easy to conflate under exam pressure.

---

## Reflections on the Attempt

### Timing

Completing 50 questions in just over 23 minutes works out to roughly **28 seconds per question**. The real AZ-900 exam allows 60 minutes for between 40 and 60 questions, so time is not the constraint here. The risk of moving quickly is that it is easy to read past subtleties in how questions are worded — AZ-900 questions are often designed to test the distinction between two similar-sounding services or concepts, and those distinctions require careful reading.

### What Caught Me Out

The questions I was least confident on tended to fall into a few patterns:

**Service scope and boundaries.** Questions that ask which tool is responsible for a specific type of task — for example, distinguishing what Azure Service Health reports on versus what Azure Monitor surfaces — are easy to get wrong when similar-sounding services exist. The lines between them are clear in theory but blur under exam conditions.

**Pricing and cost management specifics.** The Management and Governance domain includes cost management tools: the Pricing Calculator, the Total Cost of Ownership (TCO) Calculator, and Azure Cost Management. Getting specific about which tool is designed for which purpose (estimating future spend vs comparing on-premises to cloud costs vs monitoring actual spend) is an area I want to tighten up.

**SLA and compliance details.** Questions involving specific SLA percentages for Azure services, or which compliance certifications apply to which services, require factual recall rather than conceptual understanding. These are the kinds of details that practice tests are particularly good at exposing.

---

## What I Am Going Back To Review

Based on the practice test, these are the areas I am prioritising before the next run:

**Azure Management and Governance in depth.** This domain had the lowest score and covers several tools with overlapping-sounding purposes. I want to be completely clear on Azure Advisor, Azure Monitor, Azure Service Health, Microsoft Purview, and Cost Management as distinct tools with distinct scopes.

**Cost management tools.** Clearly understanding the Pricing Calculator, TCO Calculator, and Azure Cost Management as three separate instruments with three separate use cases is a revision priority.

**SLA specifics.** Revisiting the availability guarantees for key services and understanding how composite SLAs are calculated when multiple services are combined in an architecture.

**Identity and access nuances.** The distinction between authentication and authorisation, the role of Microsoft Entra ID (formerly Azure Active Directory), and how Conditional Access policies work are areas worth revisiting with more precision.

---

## The Bigger Picture

An 83.78% on a first timed practice test, completed without any review pass, is a result I am genuinely pleased with. It reflects the work put in across all the study posts that preceded it.

But practice tests serve a specific function: they reveal what you do not yet know with the precision that passive study cannot. The 16.22% that did not score is now the most useful data point in the entire preparation process. Every question I got wrong is a pointer to something worth revisiting, and that is exactly how practice tests are supposed to work.

The plan from here is to review the Tutorial Dojo explanations for every question I missed, revisit the relevant material, and sit another practice test before scheduling the real exam.

---

If you are preparing for AZ-900 and have thoughts on the exam or the Tutorial Dojo material, feel free to [reach out](/contact). Always good to compare notes with others on the same path.
