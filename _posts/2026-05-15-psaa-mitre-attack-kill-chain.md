---
layout: post
title: "PSAA Training: Reconstructing an Attack Kill Chain with MITRE ATT&CK"
date: 2026-05-15
category: learning
tags: [mitre-attack, soc, incident-response, psaa, tcm-security, threat-analysis, kill-chain]
read_time: 12
---

Part of my Practical SOC Analyst (PSAA) training through TCM Security involves working through realistic incident response scenarios and mapping observed attacker behaviour to the MITRE ATT&CK framework. This exercise presented a simulated compromise at Permalink Software and asked me to reconstruct the full attack kill chain from the available evidence.

This post documents my analysis of each stage.

---

## The Scenario

The SOC team at Permalink Software detected an unusual spike in traffic from one of their endpoints communicating with a known malicious IP address. The network intrusion detection system (NIDS) flagged the activity, and threat intelligence feeds correlated it with additional indicators of compromise. The task was to use MITRE ATT&CK to identify each technique used and reconstruct the full kill chain.

---

## The Kill Chain

<div style="display: flex; flex-direction: column; gap: 0; margin: 2rem 0;">

  <div style="display: flex; align-items: stretch; gap: 0;">
    <div style="display: flex; flex-direction: column; align-items: center; min-width: 48px;">
      <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #06b6d4, #0284c7); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 0.85rem; flex-shrink: 0;">1</div>
      <div style="width: 2px; background: rgba(6,182,212,0.3); flex: 1; margin-top: 4px;"></div>
    </div>
    <div style="background: rgba(6,182,212,0.06); border: 1px solid rgba(6,182,212,0.2); border-radius: 10px; padding: 1.1rem 1.3rem; margin: 0 0 0 0.8rem; flex: 1; margin-bottom: 0.5rem;">
      <div style="font-size: 0.75rem; color: #06b6d4; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.3rem;">Reconnaissance</div>
      <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 0.2rem;">Active Scanning: Vulnerability Scanning</div>
      <code style="font-size: 0.82rem; background: rgba(6,182,212,0.12); color: #06b6d4; padding: 0.15rem 0.5rem; border-radius: 4px;">T1595.002</code>
    </div>
  </div>

  <div style="display: flex; align-items: stretch; gap: 0;">
    <div style="display: flex; flex-direction: column; align-items: center; min-width: 48px;">
      <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 0.85rem; flex-shrink: 0;">2</div>
      <div style="width: 2px; background: rgba(6,182,212,0.3); flex: 1; margin-top: 4px;"></div>
    </div>
    <div style="background: rgba(245,158,11,0.06); border: 1px solid rgba(245,158,11,0.2); border-radius: 10px; padding: 1.1rem 1.3rem; margin: 0 0 0 0.8rem; flex: 1; margin-bottom: 0.5rem;">
      <div style="font-size: 0.75rem; color: #f59e0b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.3rem;">Initial Access</div>
      <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 0.2rem;">Exploit Public-Facing Application</div>
      <code style="font-size: 0.82rem; background: rgba(245,158,11,0.12); color: #f59e0b; padding: 0.15rem 0.5rem; border-radius: 4px;">T1190</code>
    </div>
  </div>

  <div style="display: flex; align-items: stretch; gap: 0;">
    <div style="display: flex; flex-direction: column; align-items: center; min-width: 48px;">
      <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #ef4444, #dc2626); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 0.85rem; flex-shrink: 0;">3</div>
      <div style="width: 2px; background: rgba(6,182,212,0.3); flex: 1; margin-top: 4px;"></div>
    </div>
    <div style="background: rgba(239,68,68,0.06); border: 1px solid rgba(239,68,68,0.2); border-radius: 10px; padding: 1.1rem 1.3rem; margin: 0 0 0 0.8rem; flex: 1; margin-bottom: 0.5rem;">
      <div style="font-size: 0.75rem; color: #ef4444; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.3rem;">Execution</div>
      <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 0.2rem;">Command and Scripting Interpreter: Windows Command Shell</div>
      <code style="font-size: 0.82rem; background: rgba(239,68,68,0.12); color: #ef4444; padding: 0.15rem 0.5rem; border-radius: 4px;">T1059.003</code>
    </div>
  </div>

  <div style="display: flex; align-items: stretch; gap: 0;">
    <div style="display: flex; flex-direction: column; align-items: center; min-width: 48px;">
      <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #8b5cf6, #7c3aed); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 0.85rem; flex-shrink: 0;">4</div>
      <div style="width: 2px; background: rgba(6,182,212,0.3); flex: 1; margin-top: 4px;"></div>
    </div>
    <div style="background: rgba(139,92,246,0.06); border: 1px solid rgba(139,92,246,0.2); border-radius: 10px; padding: 1.1rem 1.3rem; margin: 0 0 0 0.8rem; flex: 1; margin-bottom: 0.5rem;">
      <div style="font-size: 0.75rem; color: #8b5cf6; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.3rem;">Privilege Escalation</div>
      <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 0.2rem;">Access Token Manipulation: Token Impersonation</div>
      <code style="font-size: 0.82rem; background: rgba(139,92,246,0.12); color: #8b5cf6; padding: 0.15rem 0.5rem; border-radius: 4px;">T1134.001</code>
    </div>
  </div>

  <div style="display: flex; align-items: stretch; gap: 0;">
    <div style="display: flex; flex-direction: column; align-items: center; min-width: 48px;">
      <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 0.85rem; flex-shrink: 0;">5</div>
      <div style="width: 2px; background: rgba(6,182,212,0.3); flex: 1; margin-top: 4px;"></div>
    </div>
    <div style="background: rgba(16,185,129,0.06); border: 1px solid rgba(16,185,129,0.2); border-radius: 10px; padding: 1.1rem 1.3rem; margin: 0 0 0 0.8rem; flex: 1; margin-bottom: 0.5rem;">
      <div style="font-size: 0.75rem; color: #10b981; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.3rem;">Persistence</div>
      <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 0.2rem;">Create or Modify System Process: Windows Service</div>
      <code style="font-size: 0.82rem; background: rgba(16,185,129,0.12); color: #10b981; padding: 0.15rem 0.5rem; border-radius: 4px;">T1543.003</code>
    </div>
  </div>

  <div style="display: flex; align-items: stretch; gap: 0;">
    <div style="display: flex; flex-direction: column; align-items: center; min-width: 48px;">
      <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 0.85rem; flex-shrink: 0;">6</div>
      <div style="width: 2px; background: rgba(6,182,212,0.3); flex: 1; margin-top: 4px;"></div>
    </div>
    <div style="background: rgba(245,158,11,0.06); border: 1px solid rgba(245,158,11,0.2); border-radius: 10px; padding: 1.1rem 1.3rem; margin: 0 0 0 0.8rem; flex: 1; margin-bottom: 0.5rem;">
      <div style="font-size: 0.75rem; color: #f59e0b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.3rem;">Defense Evasion</div>
      <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 0.2rem;">Impair Defenses: Disable or Modify Tools</div>
      <code style="font-size: 0.82rem; background: rgba(245,158,11,0.12); color: #f59e0b; padding: 0.15rem 0.5rem; border-radius: 4px;">T1562.001</code>
    </div>
  </div>

  <div style="display: flex; align-items: stretch; gap: 0;">
    <div style="display: flex; flex-direction: column; align-items: center; min-width: 48px;">
      <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #06b6d4, #0284c7); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 0.85rem; flex-shrink: 0;">7</div>
      <div style="width: 2px; background: rgba(6,182,212,0.3); flex: 1; margin-top: 4px;"></div>
    </div>
    <div style="background: rgba(6,182,212,0.06); border: 1px solid rgba(6,182,212,0.2); border-radius: 10px; padding: 1.1rem 1.3rem; margin: 0 0 0 0.8rem; flex: 1; margin-bottom: 0.5rem;">
      <div style="font-size: 0.75rem; color: #06b6d4; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.3rem;">Collection</div>
      <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 0.2rem;">Data from Local System (ccf32)</div>
      <code style="font-size: 0.82rem; background: rgba(6,182,212,0.12); color: #06b6d4; padding: 0.15rem 0.5rem; border-radius: 4px;">TA0009</code>
    </div>
  </div>

  <div style="display: flex; align-items: stretch; gap: 0;">
    <div style="display: flex; flex-direction: column; align-items: center; min-width: 48px;">
      <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #ef4444, #dc2626); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 0.85rem; flex-shrink: 0;">8</div>
      <div style="width: 2px; background: rgba(6,182,212,0.3); flex: 1; margin-top: 4px;"></div>
    </div>
    <div style="background: rgba(239,68,68,0.06); border: 1px solid rgba(239,68,68,0.2); border-radius: 10px; padding: 1.1rem 1.3rem; margin: 0 0 0 0.8rem; flex: 1; margin-bottom: 0.5rem;">
      <div style="font-size: 0.75rem; color: #ef4444; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.3rem;">Exfiltration</div>
      <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 0.2rem;">Data pushed to public GitHub repository</div>
      <code style="font-size: 0.82rem; background: rgba(239,68,68,0.12); color: #ef4444; padding: 0.15rem 0.5rem; border-radius: 4px;">M1021 Mitigation</code>
    </div>
  </div>

  <div style="display: flex; align-items: stretch; gap: 0;">
    <div style="display: flex; flex-direction: column; align-items: center; min-width: 48px;">
      <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #ef4444, #991b1b); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 0.85rem; flex-shrink: 0;">9</div>
    </div>
    <div style="background: rgba(239,68,68,0.08); border: 2px solid rgba(239,68,68,0.3); border-radius: 10px; padding: 1.1rem 1.3rem; margin: 0 0 0 0.8rem; flex: 1;">
      <div style="font-size: 0.75rem; color: #ef4444; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.3rem;">Impact</div>
      <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 0.2rem;">Defacement: External Defacement</div>
      <code style="font-size: 0.82rem; background: rgba(239,68,68,0.12); color: #ef4444; padding: 0.15rem 0.5rem; border-radius: 4px;">T1491.002</code>
    </div>
  </div>

</div>

---

## Stage-by-Stage Breakdown

### Stage 1 - Reconnaissance: T1595.002

The NIDS flagged a large spike in inbound traffic carrying the user-agent string `Mozilla/5.0 (compatible; Nmap Scripting Engine;)`. This is the fingerprint of Nmap's scripting engine, which was being used to systematically probe the organisation's external-facing services for vulnerabilities.

This maps to **T1595.002 - Active Scanning: Vulnerability Scanning**, a sub-technique of Active Scanning (T1595). The attacker was gathering intelligence about what was exposed and exploitable before taking any action.

---

### Stage 2 - Initial Access: T1190

With a target identified, the attacker exploited an SQL injection vulnerability in one of Permalink Software's external-facing web applications. The tool used was **sqlmap** (MITRE Software ID: **S0225**), which automates the discovery and exploitation of SQL injection flaws.

This maps to **T1190 - Exploit Public-Facing Application**. SQL injection as an initial access vector remains one of the most common and preventable entry points in real-world breaches.

---

### Stage 3 - Execution: T1059.003

After achieving remote code execution through the SQL injection exploit, the attacker established a reverse shell by spawning a `cmd.exe` process on the compromised server. This gave them an interactive command-line session running on the target system, controlled from a remote machine.

This maps to **T1059.003 - Command and Scripting Interpreter: Windows Command Shell**.

---

### Stage 4 - Privilege Escalation: T1134.001

With a foothold established, the attacker needed higher privileges to move further. They abused **SeImpersonatePrivilege** to impersonate an administrator's security token - a well-known Windows privilege escalation path. The Windows API call **DuplicateToken** is one of the monitored calls associated with this technique, as it allows one process to copy another's access token.

This maps to **T1134.001 - Access Token Manipulation: Token Impersonation/Theft**.

---

### Stage 5 - Persistence: T1543.003

To survive reboots and analyst intervention, the attacker modified an existing Windows service's image path to point to their malicious reverse shell payload. This means every time that service starts, the attacker's payload executes automatically.

This maps to **T1543.003 - Create or Modify System Process: Windows Service**. Modifying an existing service is a stealthier approach than creating a new one, since existing services are less likely to trigger alerts.

---

### Stage 6 - Defense Evasion: T1562.001

Endpoint logs in the SIEM recorded that the organisation's EDR tool was disabled during the same timeframe as the initial compromise. Disabling the EDR removes the primary tool the SOC relies on for endpoint visibility, buying the attacker more time to operate undetected.

This maps to **T1562.001 - Impair Defenses: Disable or Modify Tools**. EDR tampering is a strong indicator of a deliberate, hands-on attacker rather than automated malware.

---

### Stage 7 - Collection: TA0009

The ccf32 software was transferred to the host shortly after the initial compromise. Its purpose in this context is collection - gathering sensitive data, files, and intellectual property from the compromised system before exfiltration.

This maps to tactic **TA0009 - Collection**.

---

### Stage 8 - Exfiltration

The attacker pushed staged data to a public GitHub repository. Using a legitimate, trusted external service for exfiltration is a deliberate choice - it blends into normal web traffic and bypasses basic network controls that block unknown destinations.

The mitigation that could have prevented this is **M1021 - Restrict Web-Based Content**: blocking or monitoring access to unauthorised external web services, including code-hosting platforms, from production environments.

---

### Stage 9 - Impact: T1491.002

To complete the attack, the organisation's public-facing corporate website was modified to display propaganda messages. This is the final visible action - the attacker had achieved their objectives and chose to make their presence known.

This maps to **T1491.002 - Defacement: External Defacement**.

---

## Full ATT&CK Reference Table

<div style="overflow-x: auto; margin: 1.5rem 0;">
<table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
  <thead>
    <tr style="background: rgba(6,182,212,0.1); border-bottom: 2px solid rgba(6,182,212,0.3);">
      <th style="text-align: left; padding: 0.7rem 1rem; color: #06b6d4; font-weight: 700;">Stage</th>
      <th style="text-align: left; padding: 0.7rem 1rem; color: #06b6d4; font-weight: 700;">Tactic</th>
      <th style="text-align: left; padding: 0.7rem 1rem; color: #06b6d4; font-weight: 700;">Technique / Sub-technique</th>
      <th style="text-align: left; padding: 0.7rem 1rem; color: #06b6d4; font-weight: 700;">ID</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
      <td style="padding: 0.7rem 1rem; color: var(--text-secondary);">1</td>
      <td style="padding: 0.7rem 1rem; color: var(--text-primary);">Reconnaissance</td>
      <td style="padding: 0.7rem 1rem; color: var(--text-primary);">Active Scanning: Vulnerability Scanning</td>
      <td style="padding: 0.7rem 1rem;"><code style="background: rgba(6,182,212,0.1); color: #06b6d4; padding: 0.1rem 0.4rem; border-radius: 3px;">T1595.002</code></td>
    </tr>
    <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
      <td style="padding: 0.7rem 1rem; color: var(--text-secondary);">2</td>
      <td style="padding: 0.7rem 1rem; color: var(--text-primary);">Initial Access</td>
      <td style="padding: 0.7rem 1rem; color: var(--text-primary);">Exploit Public-Facing Application</td>
      <td style="padding: 0.7rem 1rem;"><code style="background: rgba(6,182,212,0.1); color: #06b6d4; padding: 0.1rem 0.4rem; border-radius: 3px;">T1190</code></td>
    </tr>
    <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
      <td style="padding: 0.7rem 1rem; color: var(--text-secondary);">2a</td>
      <td style="padding: 0.7rem 1rem; color: var(--text-primary);">Software</td>
      <td style="padding: 0.7rem 1rem; color: var(--text-primary);">sqlmap</td>
      <td style="padding: 0.7rem 1rem;"><code style="background: rgba(6,182,212,0.1); color: #06b6d4; padding: 0.1rem 0.4rem; border-radius: 3px;">S0225</code></td>
    </tr>
    <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
      <td style="padding: 0.7rem 1rem; color: var(--text-secondary);">3</td>
      <td style="padding: 0.7rem 1rem; color: var(--text-primary);">Execution</td>
      <td style="padding: 0.7rem 1rem; color: var(--text-primary);">Command and Scripting Interpreter: Windows Command Shell</td>
      <td style="padding: 0.7rem 1rem;"><code style="background: rgba(6,182,212,0.1); color: #06b6d4; padding: 0.1rem 0.4rem; border-radius: 3px;">T1059.003</code></td>
    </tr>
    <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
      <td style="padding: 0.7rem 1rem; color: var(--text-secondary);">4</td>
      <td style="padding: 0.7rem 1rem; color: var(--text-primary);">Privilege Escalation</td>
      <td style="padding: 0.7rem 1rem; color: var(--text-primary);">Access Token Manipulation: Token Impersonation</td>
      <td style="padding: 0.7rem 1rem;"><code style="background: rgba(6,182,212,0.1); color: #06b6d4; padding: 0.1rem 0.4rem; border-radius: 3px;">T1134.001</code></td>
    </tr>
    <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
      <td style="padding: 0.7rem 1rem; color: var(--text-secondary);">5</td>
      <td style="padding: 0.7rem 1rem; color: var(--text-primary);">Persistence</td>
      <td style="padding: 0.7rem 1rem; color: var(--text-primary);">Create or Modify System Process: Windows Service</td>
      <td style="padding: 0.7rem 1rem;"><code style="background: rgba(6,182,212,0.1); color: #06b6d4; padding: 0.1rem 0.4rem; border-radius: 3px;">T1543.003</code></td>
    </tr>
    <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
      <td style="padding: 0.7rem 1rem; color: var(--text-secondary);">6</td>
      <td style="padding: 0.7rem 1rem; color: var(--text-primary);">Defense Evasion</td>
      <td style="padding: 0.7rem 1rem; color: var(--text-primary);">Impair Defenses: Disable or Modify Tools</td>
      <td style="padding: 0.7rem 1rem;"><code style="background: rgba(6,182,212,0.1); color: #06b6d4; padding: 0.1rem 0.4rem; border-radius: 3px;">T1562.001</code></td>
    </tr>
    <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
      <td style="padding: 0.7rem 1rem; color: var(--text-secondary);">7</td>
      <td style="padding: 0.7rem 1rem; color: var(--text-primary);">Collection</td>
      <td style="padding: 0.7rem 1rem; color: var(--text-primary);">Data Collection via ccf32</td>
      <td style="padding: 0.7rem 1rem;"><code style="background: rgba(6,182,212,0.1); color: #06b6d4; padding: 0.1rem 0.4rem; border-radius: 3px;">TA0009</code></td>
    </tr>
    <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
      <td style="padding: 0.7rem 1rem; color: var(--text-secondary);">8</td>
      <td style="padding: 0.7rem 1rem; color: var(--text-primary);">Exfiltration</td>
      <td style="padding: 0.7rem 1rem; color: var(--text-primary);">Data to public GitHub (Mitigation: Restrict Web-Based Content)</td>
      <td style="padding: 0.7rem 1rem;"><code style="background: rgba(6,182,212,0.1); color: #06b6d4; padding: 0.1rem 0.4rem; border-radius: 3px;">M1021</code></td>
    </tr>
    <tr>
      <td style="padding: 0.7rem 1rem; color: var(--text-secondary);">9</td>
      <td style="padding: 0.7rem 1rem; color: var(--text-primary);">Impact</td>
      <td style="padding: 0.7rem 1rem; color: var(--text-primary);">Defacement: External Defacement</td>
      <td style="padding: 0.7rem 1rem;"><code style="background: rgba(6,182,212,0.1); color: #06b6d4; padding: 0.1rem 0.4rem; border-radius: 3px;">T1491.002</code></td>
    </tr>
  </tbody>
</table>
</div>

---

## Key Takeaways

Working through this scenario reinforced a few things that are easy to understand in theory but more concrete when applied to a realistic case:

**The attacker disabled the EDR before the noisiest activity.** Defense evasion (Stage 6) came before collection and exfiltration. By the time sensitive data was being staged, the primary detection tool was already off. A SOC that only relies on EDR alerts would have missed the latter stages entirely.

**Persistence was quiet by design.** Modifying an existing Windows service rather than creating a new one is a deliberate choice - new services get logged and noticed. Existing ones blend in.

**Exfiltration via GitHub is a bypass strategy.** Firewalls and DLP tools that block unknown destinations do not block GitHub by default. Restricting which external web services production systems can reach (M1021) is a control that specifically addresses this.

**SQL injection as initial access is still very common.** T1190 via SQL injection is not a novel technique, yet it provided the entry point in this scenario. Input validation and web application firewalls remain essential first-line controls.

---

This exercise is part of my ongoing preparation for the Practical SOC Analyst Associate (PSAA) certification through TCM Security. More scenarios and notes to follow.

---

If you are working through PSAA or studying MITRE ATT&CK, feel free to [reach out](/contact).
