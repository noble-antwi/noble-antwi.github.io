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

Figure 1 is that setting, and Figure 2 shows VAULT01 as the group's first member.

![The agent.conf of the vault group in the Wazuh dashboard: one localfile block with log_format json and the location /var/log/vault/audit.log.](/assets/posts/what-wazuh-hears-when-vault-says-no/vault-01-agent-group-conf.png)

*Figure 1: The agent group's whole configuration: read `/var/log/vault/audit.log` as JSON.*

![The Wazuh dashboard managing the agents of group vault: agent 007, VAULT01, is the one agent in the group.](/assets/posts/what-wazuh-hears-when-vault-says-no/vault-02-vault01-in-vault-group.png)

*Figure 2: VAULT01, agent 007, placed in the `vault` group.*

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

Figure 3 is what the page says. Figure 4 is the alert the corrected rule raised, written from the log's own wording.

![The Vault sign-in page showing an error: authentication failed, invalid username or password.](/assets/posts/what-wazuh-hears-when-vault-says-no/vault-03-ui-login-refused.png)

*Figure 3: The login page's wording, "invalid username or password". The audit log words the same refusal differently.*

![Wazuh Discover filtered to rule 100501 in the vault group: four hits, with the rule description reading Vault: failed login.](/assets/posts/what-wazuh-hears-when-vault-says-no/vault-04-rule-100501-failed-login.png)

*Figure 4: Rule 100501 firing on a failed login read from `/var/log/vault/audit.log`. The account and the address are redacted.*

**Quiet the noise without going blind.** Every time the Vault page opens with an old session, it asks Vault about its own token and gets "invalid token" back. Alerting on that would only teach me to ignore the alert. Silencing it outright would hide something real, though: anyone holding a list of stolen tokens can test them the same way, one quiet check at a time. So 100504 keeps the single check quiet and 100505 counts them.

**A level 0 rule cannot be counted.** The first 100504 was level 0. I sent ten fake-token checks, all ten reached the SIEM, and nothing fired. Wazuh drops a level 0 match before it reaches the memory that counting rules read. Level 1 still sits below the alert threshold of 3, so nothing is alerted, but the match is remembered. One digit was the whole fix.

## How each rule was proven

Every rule was tested by causing its event on VAULT01 and finding the result on SIEM01. Five wrong passwords gave four 100501 alerts and one 100502, because the fifth is promoted rather than counted twice. A made-up token used on `sys/mounts` gave 100503; the same token on `auth/token/lookup-self` stayed quiet; ten in a row gave 100505, with the earlier events attached to the alert as evidence. For rotation, I forced one, checked that Vault was writing into the new empty file, and watched the next alert arrive from it.

The evidence, in the order it was gathered: the two password rules side by side (Figure 5), a made-up token refused by Vault (Figure 6), the alert it raised (Figure 7), and the rules as deployed on the manager (Figure 8).

![A Wazuh field summary of rule.id over ten failed-login records: 100501 on 90 percent and 100502 on 10 percent.](/assets/posts/what-wazuh-hears-when-vault-says-no/vault-05-top-rules-100501-100502.png)

*Figure 5: The two password rules in one view: 100501 for single failures, 100502 where a run of them was promoted.*

![A terminal on VAULT01: a vault token lookup with a made-up token answered with code 403, permission denied, invalid token.](/assets/posts/what-wazuh-hears-when-vault-says-no/vault-06-invalid-token-403.png)

*Figure 6: A made-up token, refused by Vault with a 403.*

![Wazuh Discover filtered to rule 100503: one hit from VAULT01, with the error permission denied, invalid token.](/assets/posts/what-wazuh-hears-when-vault-says-no/vault-07-rule-100503-invalid-token.png)

*Figure 7: Rule 100503 raising that refusal on SIEM01. The token appears only as its HMAC fingerprint.*

![The vault_rules.xml file in the Wazuh rules editor, showing rules 100503, 100504 and 100505 with their comments.](/assets/posts/what-wazuh-hears-when-vault-says-no/vault-08-rules-file-100503-to-100505.png)

*Figure 8: Rules 100503 to 100505 as deployed, each with a comment saying why it exists.*

Rotation was proven the same way. Figure 9 is the rotation policy, Figure 10 forces a rotation, and Figure 11 is an alert raised a minute later from the new, empty file.

![The logrotate policy for the Vault audit log: daily, 100 MB maximum, seven copies kept, compressed, and a reload of Vault after rotation.](/assets/posts/what-wazuh-hears-when-vault-says-no/vault-09-logrotate-config.png)

*Figure 9: The rotation policy: daily or at 100 MB, seven copies kept, then Vault is told to reopen its log.*

![A terminal forcing a rotation with logrotate, then listing an empty audit.log beside the rotated audit.log.1.](/assets/posts/what-wazuh-hears-when-vault-says-no/vault-10-forced-rotation.png)

*Figure 10: A forced rotation: a new, empty `audit.log` beside the old one.*

![Wazuh Discover filtered to rule 100503: one hit from VAULT01 timed one minute after the rotation.](/assets/posts/what-wazuh-hears-when-vault-says-no/vault-11-alert-after-rotation.png)

*Figure 11: An alert from the new file, one minute after the rotation. Nothing was lost in the handover.*

The rules and the agent group are in the [detections folder](https://github.com/noble-antwi/enterprise-security-homelab/tree/main/detections) of the homelab repo, each with a note on why it exists.

## Checklist

- Vault's audit device on, writing to a file the Wazuh agent can read
- An agent group that reads the file as JSON
- Every rule written from a real log line, not from what a screen says
- Anything silenced that might ever need counting set to level 1, not 0
- A counting rule above each quiet one
- Log rotation that reloads Vault, proven with one forced rotation
