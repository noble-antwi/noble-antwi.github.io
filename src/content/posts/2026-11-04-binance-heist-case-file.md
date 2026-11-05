---
title: "Five Months of Preparation, Four Minutes to Empty the Wallets"
date: 2026-11-04
category: case-files
tags: [incident-analysis, supply-chain, social-engineering, ai-agents, agent-identity, secrets-management, mitre-attack]
description: "A plain-words reading of Binance's report on the 29 October 2026 theft: a poisoned download, a fake job interview, an internal AI tool with too much reach and one long-lived token on a laptop. Each of the seven links, the control that could have broken it, and where the same control lives in my lab."
read_time: 10
casefile: binance-2026-10-29
short: "The $6.34B Binance theft, link by link"
---

The page is drawn by the case file component; this text is the summary that feeds and search use.

Binance's initial report on the 29 October 2026 theft describes a seven-link chain: a tampered Homebrew installer in June, a fake job interview in September, a developer tool replaced on the engineer's laptop, an internal AI tool used to reach two wallet engineers, a deployment token that never expired, four minutes of signing outside the normal withdrawal process, and an EIP-7702 delegation that kept working after withdrawals were switched off. This case file walks each link, names the control that could have broken it, maps the chain to MITRE ATT&CK, and points to where the same control lives in the Biira Bank lab.
