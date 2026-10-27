---
title: "Watching the Front Door: Detection Rules for an Application's Identity Log"
date: 2026-10-27
category: lab-notes
tags: [detection-engineering, wazuh, identity, mitre-attack, saml, oauth, scim, homelab]
description: "An application that signs people in also writes down every refusal. Thirty Wazuh rules turn that log into alerts mapped to MITRE ATT&CK, tested before they reached the SIEM. Most of the work was deciding what should never page anyone, and two rules that were wrong in ways no test of the happy path would have shown."
read_time: 8
---

Most of my lab's alerts come from operating systems: Windows event logs, Sysmon, a Linux audit trail. They see a process start or a file land. They do not see a forged SAML assertion, a token used past its scope, or someone resetting the break-glass account. Only the application that checked the credential knows it refused one, and why.

Stock Copilot is an internal app on APP01, in the DevOps segment. It signs people in through more than one identity provider, provisions accounts over SCIM, issues API tokens and rotates its own signing keys. Every one of those decisions writes a line to an audit log. This note is about turning that log into alerts.

## The log, before any rule

Each event is one line of JSON with the same shape: who (`user.name`), from where (`source.tailnet_node`, the device on the tailnet), which provider (`idp.key`), what happened, and for refusals a `detail.reason` in plain words. That consistency is what made the rest possible. A rule that has to guess at field names fails silently, and Wazuh never tells you a rule did not match.

The Wazuh agent on APP01 (agent 005) reads the file with `log_format json`, so the fields arrive already decoded. Every rule hangs off one parent, rule 100400, which claims an event only when `service.name` is `stock-copilot` and `service.type` is `identity`. On its own it is silent, at level 0. Its job is to make sure nothing else in the ruleset ever looks at an event that is not this app's.

## Thirty rules: twenty that page, ten that only record

| What it watches | ATT&CK | Level |
|---|---|---|
| A token signed with `alg: none` or an HMAC algorithm | T1606 | 12 |
| An unsigned, wrapped or tampered SAML assertion | T1606.002 | 12 |
| The break-glass owner reset on APP01 | T1098 | 12 |
| A provider's signing keys changed outside any declared rotation | T1556 | 12 |
| A refused attempt to link an identity | T1098 | 12 |
| Five refused credentials from one device in two minutes | T1110 | 10 |
| A SCIM call with no credential, or a guessed one | T1136 | 10 |
| A replayed nonce, callback state or assertion | T1550.001 | 10 |
| A new identity provider trusted | T1484.002 | 10 |
| The break-glass login used at all | T1078.003 | 10 |
| An API token used beyond its scopes | T1550.001 | 8 |
| A sign-in link that would land on another site | T1566.002 | 8 |

That is a sample. The full table, all thirty with their parents and MITRE mapping, is in the repository's [detections folder](https://github.com/noble-antwi/enterprise-security-homelab/tree/main/detections).

Some mappings are nearest fits, and I wrote the reason down rather than pretend they are exact. A signing key the app trusts **is** its authentication process, so an unplanned key change is T1556, Modify Authentication Process: whoever controls that key can sign in as anyone.

## The quiet rules were most of the work

Ten of the thirty never page anyone. A sign-in is level 3. A refused sign-in is level 5. A scheduled key rotation, an access review signed off, the directory deactivating someone: all level 3, on the record and in nobody's queue.

They matter for two reasons. First, they are the building blocks. The password-guessing alert does not look at raw events; it counts a quiet rule firing. Second, they encode the decisions that are hardest to get right: which routine actions should never alert. A key rotation that was declared in advance is a drill. The same change with no declaration is a level 12. The difference is one field, and the rule has to know which is which before it goes anywhere near a pager.

## Tested before it reached the SIEM

A malformed rules file stops `wazuh-manager` from starting at all, which takes the whole SIEM offline, not just one rule. So nothing was copied to SIEM01 until it had passed somewhere disposable.

The test starts a throwaway Wazuh manager container with no network, loads the rules file, and replays events through `wazuh-logtest`, the tool that reports which decoder parsed an event and which rule it reached:

- **61 sample events**, one written by the app's own audit code for every rule, all 61 reaching the rule they were written for;
- **676 real events** from the lab's own history: earlier attack scenarios, key rotation drills and an attack probe. Every refusal in them landed on its rule. The forged-token rule fired nine times, the forged-SAML rule twice, the SCIM rule thirteen times.

The rules went live on SIEM01 on 23 October 2026. That evening the app's attack probe fired at 19:42, and all 18 of its events arrived on SIEM01 decoded, as alerts under `rule.groups: stock_copilot`.

## Two rules that were wrong

Both of these passed a test of the happy path. Both would have paged the wrong thing.

**Count credentials, not refusals.** The first password-guessing rule counted every refused sign-in. On the lab's own traffic it raised seven alerts, and none of them were guessing. They were refusals by policy: a person who was never provisioned, a group with no mapping to any role. A wrong password and "you are not allowed in here" are different events, even though both end in a refusal. The rule now counts only refused credentials, and it counts them per tailnet device rather than per username, because a refused passkey names nobody, and a guesser can change the email on every try.

**A word is not a meaning.** The forged-SAML rule first matched any refusal whose reason contained the word "assertion". That would have caught "assertion expired", which is usually two clocks a minute apart, and paged it at level 12 as forgery. It now matches only the signature failures. A test in the app's repository checks every rule against the app's real refusal wording, so if the wording changes, the test fails before the rule quietly stops matching.

## What I took from it

- **The application is the only witness to its own refusals.** Operating-system logs cannot see a forged token being turned away.
- **One consistent log shape is worth more than any single rule.** Every rule here is short because every event has the same fields.
- **Decide what stays quiet first.** The alerting rules were the easy part. The ten that never page are where the judgment is.
- **Test against your own history, not only samples.** Synthetic events prove a rule can fire. Real traffic shows what else it fires on.
- **A refusal is not an attack.** Most refusals are policy doing its job. An alert has to tell the difference, or people stop reading it.

The rules, the numbering blocks and the deployment steps are in the homelab's [detections folder](https://github.com/noble-antwi/enterprise-security-homelab/tree/main/detections). The tuning that came before them, for the operating-system alerts, is in [The Alert That Cried Wolf](/lab-notes/2026/09/26/the-alert-that-cried-wolf.html).
