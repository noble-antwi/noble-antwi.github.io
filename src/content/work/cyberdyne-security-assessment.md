---
title: "Cyberdyne Systems: Enterprise Security Assessment"
kicker: "Assessment · Security program"
summary: "A defense-in-depth program for a fictional 400-person manufacturer across two countries: 16 vulnerabilities, 13 technical controls, 11 policies, and a three-phase rollout that starts with the end-of-life fleet and identity."
category: assessment
status: academic
statusLabel: "Academic · Completed"
order: 70
period: "Fall 2025 · ITMO 558, Illinois Tech"
repo: https://github.com/noble-antwi/cyberdyne-security-assessment
docs: https://github.com/noble-antwi/cyberdyne-security-assessment/blob/main/deliverables/Cyberdyne_Security_Assessment_Report.md
docsLabel: "Assessment report"
stack: ["NIST CSF", "NIST 800-171", "Active Directory", "SIEM", "Defense in depth"]
relatedTags: ["incident-response"]
stats:
  - { value: "16", label: "Vulnerabilities found" }
  - { value: "13", label: "Technical controls" }
  - { value: "11", label: "Security policies" }
  - { value: "800+", label: "Devices assessed" }
---

Conduct a comprehensive enterprise security assessment for Cyberdyne Systems Corporation, a fictional AI and robotics manufacturing company with 400 employees across California and Taiwan. The assessment identifies critical vulnerabilities and provides a complete defense-in-depth security program addressing technology, policy, and human factors.

## Frameworks & Technologies Evaluated

NIST CSF · NIST 800-171 · CCPA · Active Directory · Kerberos · Group Policy · LUKS Encryption · BitLocker · UFW/iptables · SIEM · VPN/MFA · MDM

## Key Findings by Category

> |  |  |  |
> | --- | --- | --- |
> | **End-of-Life Systems** | Critical | 800+ devices running EOL OS (Ubuntu 10.04, Windows 10 v1607) |
> | **Endpoint Protection** | Critical | No centralized antivirus deployment |
> | **Data Protection** | Critical | Unencrypted data transport between facilities |
> | **Access Management** | High | No centralized identity management |
> | **Hardware Security** | High | Excessive USB ports, insufficient resources |

## Defense-in-Depth Strategy

> **Human Layer:** 8 training programs including role-based specialized training
>
> **Policy Layer:** 11 security policies (AUP, Data Classification, Incident Response)
>
> **Technology Layer:** 13 controls (AD, SIEM, VPN/MFA, Encryption, DLP)

## Recommended Controls (Phased)

- **Phase 1 (Immediate):** OS Upgrade Program, Enterprise Endpoint Protection, Full-Disk Encryption, Active Directory
- **Phase 2:** SIEM Implementation, VPN with MFA, Mobile Device Management, Host Firewalls
- **Phase 3:** Standardized Imaging, Data Loss Prevention, Asset Management, USB Device Control

## Organization Profile

> **Employees:** 400 across 9 job categories
>
> **Locations:** California (HQ/R&D) and Taiwan (Manufacturing)
>
> **Device Mix:** 300 Windows laptops, 200 Linux desktops, 150 Android tablets, 100+ servers
>
> **Compliance:** CCPA, PDPC, NIST 800-171, FAR/DFARS

## Academic Context

Completed as part of ITMO-X58 - Operating System Security at Illinois Institute of Technology (Fall 2025). This capstone project integrates concepts from Linux security mechanisms, Windows security technologies, mobile security, and defense-in-depth architecture.
