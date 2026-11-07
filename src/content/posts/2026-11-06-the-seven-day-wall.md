---
title: "The Seven-Day Wall"
date: 2026-11-06
category: lab-notes
tags: [azure, az-104, blob-storage, lifecycle-management, event-grid, logic-apps]
description: "I wrote an Azure lifecycle rule to walk three files from Hot to Archive in three days, and wired every tier change to my phone so I could watch it happen. Cool and Cold arrived on schedule. Archive did not. The reason was a condition the portal adds by default, named for one thing and counting another, and it had been on screen since the first rule."
read_time: 6
---

Three small text files, uploaded Hot on a Saturday evening. A lifecycle rule to move them to Cool after one day, Cold after two and Archive after three. A phone that buzzes every time one of them changes tier. The plan was to watch a storage policy do its job over a few days, instead of reading about it.

Cool arrived on time. Cold arrived on time. Then, on the night Archive was due, the phone reported a rule run in which nothing moved at all.

This note is about why, because the answer is a small lesson in reading what a system will actually do rather than what its form says.

## The lab

The second of my [Azure labs](/work/azure-labs/) asks what Blob Storage's four access tiers really cost and what it takes to get a file back from the coldest one. Hot, Cool and Cold are all online; Archive is offline, and a file there cannot be opened at all until it is rehydrated, which took about 37 minutes at High priority and over three hours at Standard.

Moving files between tiers by hand does not scale, so Azure offers **lifecycle management**: rules that run once a day and move or delete blobs by age. The realistic rule in the lab moves files to Cool after 30 days and to Archive after 180. A 30-day rule cannot be watched inside a week, so a second rule, `fast-demo`, used the shortest gaps a rule accepts, counted in days since each file was last modified.

![The fast-demo rule in the portal: move to Cool after 1 day, Cold after 2, Archive after 3, with the box "Skip blobs that have been rehydrated in the last 7 days" ticked under the Archive step.](/assets/posts/the-seven-day-wall/02-27-fast-demo-1-2-3.png)

To watch it rather than poll it, the storage account's events went to Event Grid, Event Grid triggered a Logic App, and the Logic App pushed a one-line alert to my phone: the file, the old tier, the new tier, and which API made the change. Each night's run also sent a summary with a count for every action.

## Four nights

| Night (UTC) | What the files did | The run's own summary |
|---|---|---|
| 31 Oct | Stayed Hot | Nothing due: under a day old |
| 1 Nov | Hot to Cool, all three | `tierToCool` 3 of 3 |
| 2 Nov | Cool to Cold, all three | `tierToCold` 3 of 3 |
| 3 Nov | **Nothing** | Every count zero |

The second night looked like this on the phone. The lifecycle engine changes tiers through `SetBlobTier`, the same call a person makes in the portal; only the timing is automated.

![Phone alerts: lc-1, lc-2 and lc-3 each moving Cool to Cold by SetBlobTier, and the nightly summary showing tierToColdSummary with 3 of 3 succeeded.](/assets/posts/the-seven-day-wall/02-48-phone-cool-to-cold.png)

The third night was the one that mattered, and every count was zero. The rule had run. It had simply found nothing it was allowed to archive.

![The nightly summary for 3 November: tierToArchive, tierToCool and tierToCold all show zero objects.](/assets/posts/the-seven-day-wall/02-49-phone-archive-skipped.png)

## What the rule actually said

A lifecycle rule built in the portal is stored as JSON, and the portal has a **Code View** that shows it. The Archive action in `fast-demo` did not have one condition. It had two:

```json
"tierToArchive": {
  "daysAfterModificationGreaterThan": 3,
  "daysAfterLastTierChangeGreaterThan": 7
}
```

The second line came from a checkbox that is ticked by default under the Archive step: *Skip blobs that have been rehydrated in the last 7 days*. Its purpose is sensible. If someone has just pulled a file back out of Archive because they need it, the rule should not put it straight back the following night.

But the condition it writes does not say "rehydrated". It says **last tier change**, and any tier change counts. My files had moved Cool to Cold on 2 November, which was a tier change, so Archive could not happen until seven days after that. The rule was doing exactly what it said. The form had described it more narrowly than it behaves.

The part worth admitting: that line was on my screen from the start. The Code View of the realistic 30/180 rule, captured when it was built, shows `daysAfterLastTierChangeGreaterThan: 7` under `tierToArchive`. With the checkbox's wording in mind, it reads like the rehydration guard and nothing more.

![Code View of the tier-by-age rule: tierToCool after 30 days; tierToArchive with daysAfterLastTierChangeGreaterThan 7 and daysAfterModificationGreaterThan 180.](/assets/posts/the-seven-day-wall/02-26-lifecycle-code-view.png)

In that rule it does no harm. A file moved to Cool at day 30 has been in Cool for 150 days by the time Archive is due at 180, far beyond any seven-day wait. The condition only bites when tiers follow each other closely, as they did in a rule built to be watched, or when a file has been moved by hand shortly before its Archive date.

## The fix, and what it cost

On 4 November I removed the second condition from `fast-demo` only, in Code View, and left it on the realistic rule, where its intent is still worth having. A rule change can take up to a day to take effect, and that night's run, two minutes after the edit, still used the old version. The run on 5 November archived all three files.

![Phone alerts: lc-1, lc-2 and lc-3 each moving Cold to Archive by SetBlobTier, after the nightly summary showing tierToArchive 3 of 3.](/assets/posts/the-seven-day-wall/02-50-phone-cold-to-archive.png)

The walk took five nightly runs instead of three. The runs were not at a fixed time either: 22:26 four nights in a row, then 22:57. Lifecycle management promises once a day, not a time of day.

## What I took from it

**The JSON is the rule.** A form is a summary of a policy, written for the common case. Whenever a setting matters, read what it stores, not what its label says. Azure makes that easy here: Code View is one click away, and it is also the version that goes into Git when the lab is rebuilt in Bicep.

**Name the condition, not the intention.** "Skip if rehydrated" describes why the condition exists. "Days since last tier change" describes what it checks. Those two are the same only in the case the label was written for. The same gap shows up in firewall rules, conditional access policies and alert rules, anywhere a friendly label sits on top of a precise condition.

**Make the system tell you.** Without the phone alerts, the third night would have looked like a rule that had not run yet. The nightly summary, with an explicit zero for every action, is what turned "nothing happened" into a question worth asking.

**A default is a decision someone else made.** This one was reasonable. It still had to be found, understood, and kept or removed on purpose.

The full build, including the rehydration timings, the keys-off test and the alert pipeline, is in the [Lab 02 write-up](https://github.com/noble-antwi/azure-labs/tree/master/02-storage-tiers).
