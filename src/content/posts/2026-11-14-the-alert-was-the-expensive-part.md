---
title: "The Alert Was the Expensive Part"
date: 2026-11-14
category: lab-notes
tags: [azure, az-104, cost-management, blob-storage, logic-apps, bicep]
description: "My second Azure lab ran for twelve days and cost about 1.2 cents. The portal rounded every line of that bill to less than a cent, so I asked the billing API instead. Roughly half the money went on the Logic App that told my phone what the storage was doing, not on the storage. Then 120 lines of Bicep rebuilt the lab in 26 seconds."
read_time: 5
---

My second [Azure lab](/work/azure-labs/) asked what Blob Storage's four tiers really cost. I predicted Cool would come out cheapest. Twelve days later the bill arrived, and the honest answer to my own question was that I had been looking in the wrong place.

The whole lab cost about 1.2 cents. Almost none of it was for keeping files, and about half of it was not for storage at all.

## A bill that rounds to nothing

Cost analysis, filtered to the lab's resource group and grouped by meter, draws the shape of it clearly: nothing until the build on 31 October, one step that day, then a slow climb.

![Cost Management chart for the lab's resource group, accumulated cost grouped by meter: flat until 31 October, a step that day, then a gradual climb to about one cent by 11 November.](/assets/posts/the-alert-was-the-expensive-part/02-52-cost-by-meter-chart.png)

The table view is less helpful. It lists 88 rows, and every one of them reads the same.

![Cost analysis table for the lab's resource group, grouped by meter: every row shows a cost of less than $0.01.](/assets/posts/the-alert-was-the-expensive-part/02-51-cost-by-meter.png)

A column of "less than a cent" cannot tell you which line was a thousand times bigger than another. The Cost Management query API can. It is read-only, takes the same filter and the same grouping, and returns the figures unrounded.

## Where the cent went

| Meter | Service | Cost (USD) | What caused it |
|---|---|---:|---|
| Standard connector actions | Logic Apps | 0.0055 | 44 HTTP posts, one per phone alert |
| Archive priority read operations | Storage | 0.0050 | one High-priority rehydration |
| Built-in actions | Logic Apps | 0.00055 | the steps inside each run |
| All other operations | Storage | 0.00020 | lifecycle tier changes, listing |
| Cold, Archive and Cool writes | Storage | 0.00017 | uploads and tier moves |
| Data retention | Logic Apps | 0.00006 | run history |
| Cold and Cool reads, data retrieval | Storage | 0.00003 | opening the files |
| Cold LRS early delete | Storage | 0.0000000072 | leaving Cold after 3 of 90 days |

Three things stand out.

**Keeping was free.** No line for stored data appears in any tier. A few kilobytes for twelve days round to zero in Hot, Cool, Cold and Archive alike. My prediction that Cool would be cheapest could not be tested at this size, because every cent came from doing things to the files: writing them, moving them and, above all, reading one back in a hurry.

**One urgent read cost almost as much as everything else in storage combined.** Bringing a single 150-byte file out of Archive at High priority cost half a cent. The same file brought back at Standard priority, which took over three hours instead of 37 minutes, did not appear as a separate charge at all. Speed is the thing Archive sells back to you.

**Leaving early is billed the other way round from how I guessed.** I had predicted that moving a file out of a tier too soon would cost one day. In fact you pay for the days you did not stay. The lifecycle rule moved three files out of Cold after 3 of its 90 days, nothing blocked it, and an early-delete line appeared for the rest. For files this small it came to seven billionths of a dollar, but it sat exactly where the pricing page said it would.

## The alert was the expensive part

The largest line on the bill is not storage. It is the Logic App that turned every tier change into a push alert on my phone.

Each alert is one HTTP post. Forty-four of them, plus the built-in steps and the run history, came to about 0.6 cents: roughly half the bill, and more than the tiers it was reporting on.

I do not regret a single one of those alerts. Without them I would not have caught [the night the lifecycle rule ran and moved nothing](/lab-notes/2026/11/06/the-seven-day-wall.html). But the proportion is worth remembering. At this scale the amounts are a joke. At a real one, a pipeline that fires on every event grows with the number of events, while the cost of keeping a file in a cold tier barely grows at all. Watching a thing can cost more than the thing, and that belongs in the design conversation, not on the first invoice.

## Twenty-six seconds

With the questions answered, I rebuilt the lab as code. Before writing anything I exported the portal-built resource group, which produced a template listing every property Azure knows about, defaults included. The two settings I had actually cared about, shared key access off and TLS 1.2 as the minimum, were in there among dozens I had never touched.

The hand-written Bicep file is about 120 lines: the storage account, the container, both lifecycle rules and one data role scoped to the container. The lifecycle rules were copied straight from the portal's Code View, hidden seven-day condition included. The alert pipeline was left out on purpose, and the reader's identity is passed in at deploy time, so no identifier sits in the repository.

The deployment took 26 seconds. Reading the settings back afterwards, they matched the portal build one for one. The portal build had taken about an hour of clicking across two sessions.

## What I took from it

**Ask the bill, not the price list.** I had been reasoning about storage prices per gigabyte. The bill said the money was in operations and in the tooling around them.

**Rounding hides the ranking.** A screen full of "less than a cent" looks like nothing to learn. The unrounded figures spanned six orders of magnitude.

**Monitoring is a cost line.** It is usually worth paying. It should still be counted.

**The export is for reading, the template is for keeping.** An export shows everything Azure set. The file worth committing holds only the choices you made.

The full cost table, the Bicep file and the read-back checks are in the [Lab 02 write-up](/work/azure-labs/02-storage-tiers/).
