---
title: "What Wazuh Hears When Vault Says No"
date: 2026-11-09
category: lab-notes
tags: [hashicorp-vault, wazuh, detection-engineering, siem, homelab, mitre-attack]
description: "Every refusal Vault makes lands in its audit log as JSON. I gave Wazuh six rules to read it: a wrong password, a guessing run, a bad token, an expired browser tab that should stay quiet, and the burst of quiet ones that should not. The replay follows each event through the rules."
read_time: 6
replay: vault-rules
---

VAULT01 holds the secrets of the Biira Bank lab. When it refuses someone, I want the SIEM to know, and I want it to tell the difference between my own typo and someone working through a list. The replay above is the whole design in fifty seconds; the rest of this note is why it is built that way.

## What lives where

| Machine | What runs there | Its part |
|---|---|---|
| VAULT01 | HashiCorp Vault 2.2.1, file audit device | Writes `/var/log/vault/audit.log`: one JSON line for each request and one for each response |
| VAULT01 | Wazuh agent, in the agent group `vault` | Follows the log (`log_format json`) and ships every new line |
| SIEM01 | Wazuh manager 4.14 | `vault_rules.xml`, rules 100500 to 100505 |
| VAULT01 | logrotate | Rotates the log daily or at 100 MB, then tells Vault to reopen it |

The collection setting lives once, in the agent group on the manager. Any machine placed in the group inherits it, so a second Vault node would need nothing extra.

## Two lines for every call

Vault records each call twice: once when the request arrives and once when the answer goes back. An error only appears on the answer, so every rule that reads an error also checks that the line's `type` is `response`.

Tokens and passwords never appear in the log in clear. Vault replaces them with an HMAC, a one-way fingerprint. The same token always produces the same fingerprint, so one token can be followed across every event it touched without anyone ever seeing it.

Vault also refuses to act on anything it cannot write down. If the audit log cannot be written, the request fails. For a secrets store that is the right choice, and it is why the log is rotated: a full disk would not just lose records, it would stop Vault answering at all.

## Six rules, read as pairs

| Rule | Level | Catches |
|---|---|---|
| 100500 | 0 | Every Vault line. Silent; the parent of the rest |
| 100501 | 5 | A failed login |
| 100502 | 10 | Five failed logins in two minutes from one address (MITRE T1110) |
| 100503 | 5 | An invalid token used |
| 100504 | 1 | The web page checking its own expired token |
| 100505 | 10 | Ten of those in two minutes from one address (MITRE T1550.001) |

One event is a note; many from the same place, fast, is an alarm. 100501 and 100502 are that idea for passwords, 100504 and 100505 for tokens.

## What the build taught me

**Write the rule from the log, not the screen.** My first failed-login rule used the words the login page shows, "invalid username or password". The audit log says "invalid credentials". The rule loaded without complaint and would never have fired. Now I cause the event first, read the real line, and write the rule from that.

**Quiet the noise without going blind.** Every time the Vault page opens with an old session, it asks Vault about its own token and gets "invalid token" back. Alerting on that would only teach me to ignore the alert. Silencing it outright would hide something real, though: anyone holding a list of stolen tokens can test them the same way, one quiet check at a time. So 100504 keeps the single check quiet and 100505 counts them.

**A level 0 rule cannot be counted.** The first 100504 was level 0. I sent ten fake-token checks, all ten reached the SIEM, and nothing fired. Wazuh drops a level 0 match before it reaches the memory that counting rules read. Level 1 still sits below the alert threshold of 3, so nothing is alerted, but the match is remembered. One digit was the whole fix.

## How each rule was proven

Every rule was tested by causing its event on VAULT01 and finding the result on SIEM01. Five wrong passwords gave four 100501 alerts and one 100502, because the fifth is promoted rather than counted twice. A made-up token used on `sys/mounts` gave 100503; the same token on `auth/token/lookup-self` stayed quiet; ten in a row gave 100505, with the earlier events attached to the alert as evidence. For rotation, I forced one, checked that Vault was writing into the new empty file, and watched the next alert arrive from it.

The rules and the agent group are in the [detections folder](https://github.com/noble-antwi/enterprise-security-homelab/tree/main/detections) of the homelab repo, each with a note on why it exists.

## Checklist

- Vault's audit device on, writing to a file the Wazuh agent can read
- An agent group that reads the file as JSON
- Every rule written from a real log line, not from what a screen says
- Anything silenced that might ever need counting set to level 1, not 0
- A counting rule above each quiet one
- Log rotation that reloads Vault, proven with one forced rotation
