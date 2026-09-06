---
title: "Enterprise IAM Lab: Hybrid Identity for a Regulated Bank"
kicker: "Identity · Hybrid identity · Biira Bank"
summary: "On-prem Active Directory with a tiered admin model, federated to Okta Workforce Identity and Microsoft Entra ID over SAML, OIDC and SWA, with network-aware conditional access and graduated MFA. Built to the regulatory drivers a real bank would have to satisfy."
category: identity
status: active
statusLabel: "Phase 5 of 6"
order: 10
featured: true
period: "2025 to present"
role: "Design, build, operate, document"
repo: https://github.com/noble-antwi/enterprise-iam-lab
docs: https://github.com/noble-antwi/enterprise-iam-lab/tree/main/docs/guides
docsLabel: "Phase guides"
stack: ["Active Directory", "Windows Server 2025", "Okta Workforce Identity", "Microsoft Entra ID", "SAML 2.0", "OIDC", "SWA", "Okta Expression Language", "PowerShell", "Conditional Access"]
relatedTags: ["okta", "sc-300", "identity", "iam", "entra-id"]
hero: ../../assets/work/enterprise-iam-lab/iam-architecture.png
heroAlt: "Hybrid identity architecture diagram: network zones and authentication policies above Okta and Entra ID, with Active Directory on premises reached by the Okta AD Agent"
heroCaption: "Authentication flows top to bottom. A request is evaluated against the network zones first, then against the authentication policies in priority order. Okta is the primary IdP; Active Directory stays the source of record, reached by the AD Agent over outbound HTTPS only."
stats:
  - { value: "35", label: "Accounts" }
  - { value: "20", label: "Organisational units" }
  - { value: "15", label: "Security groups" }
  - { value: "3", label: "Auth policy rules" }
gallery:
  - src: ../../assets/work/enterprise-iam-lab/p1-okta-branded-login.png
    alt: "Biira Bank branded Okta sign-in page"
    caption: "The branded sign-in page at login.biira.online. The bank has a real domain, a real tenant and a real brand, so the lab reads like an organisation."
  - src: ../../assets/work/enterprise-iam-lab/p2-admin-groups.png
    alt: "Tiered admin groups in Active Directory Users and Computers"
    caption: "Tier 0, 1 and 2 admin groups. Domain admins never touch workstations; workstation admins never touch domain controllers."
  - src: ../../assets/work/enterprise-iam-lab/p2-admin-accounts-hardened.png
    alt: "Admin account properties showing hardened settings"
    caption: "Admin accounts hardened: sensitive, cannot be delegated, and the built-in Administrator disabled."
  - src: ../../assets/work/enterprise-iam-lab/p3-directory-integration.png
    alt: "Okta directory integration page showing the AD agent"
    caption: "The Okta AD Agent as the only bridge between cloud and on-prem: outbound HTTPS, no inbound ports."
  - src: ../../assets/work/enterprise-iam-lab/p3-import-results.png
    alt: "Okta import results after directory sync"
    caption: "First full import from AD into Okta: users, groups and attribute mappings, on a 15-minute schedule thereafter."
  - src: ../../assets/work/enterprise-iam-lab/p4-expression-language-rule.png
    alt: "Okta group rule using Expression Language"
    caption: "Dynamic group membership with Okta Expression Language, driven by the AD country attribute."
  - src: ../../assets/work/enterprise-iam-lab/p4-dropbox-saml.png
    alt: "Dropbox Business SAML configuration in Okta"
    caption: "Dropbox Business over SAML 2.0 with automated provisioning; Box over SWA with password vaulting, to cover both protocol families."
  - src: ../../assets/work/enterprise-iam-lab/p4-provisioning-audit.png
    alt: "Okta provisioning audit dashboard"
    caption: "Provisioning audit view: every create, update and deactivate is a logged, attributable event."
  - src: ../../assets/work/enterprise-iam-lab/p5-corporate-network-zone.png
    alt: "Corporate network IP zone definition in Okta"
    caption: "The corporate network defined as an IP zone. Where you are changes what you must prove."
  - src: ../../assets/work/enterprise-iam-lab/p5-corporate-network-rule.png
    alt: "Authentication policy rule for the corporate network"
    caption: "Policy priority 3: corporate network, standard MFA. Priority 2 demands hardware-protected MFA from public networks; priority 1 denies restricted countries outright."
  - src: ../../assets/work/enterprise-iam-lab/p5-tor-403.png
    alt: "Okta returning 403 Forbidden to a Tor exit node"
    caption: "A sign-in attempt through Tor, blocked by the anonymiser zone before a password is ever evaluated."
  - src: ../../assets/work/enterprise-iam-lab/p5-tor-blocking-logs.png
    alt: "Okta system log entries for blocked Tor attempts"
    caption: "The same event in the system log: the evidence an investigator would pull."
---

## The scenario

Biira Bank is a fictional state-chartered commercial bank: FDIC-insured, SEC-reporting, with the regulatory obligations that implies. Its identity architecture is not designed to a checklist of features but to the drivers a real bank would be examined against: GLBA safeguards, SOX separation of duties, PCI-DSS unique IDs and MFA for administrators, and the FFIEC's 2021 authentication guidance on risk-based access. Every phase of the build names the regulation it answers.

The identity estate runs on the network documented in the sibling [Enterprise Security Homelab](/work/enterprise-security-homelab/); this project is the workload on top of it.

## Architecture

**Active Directory** (`ad.biira.online`, on DC01, Windows Server 2025, VLAN 50) is the source of record for employee identity. **Okta Workforce Identity** is the primary identity provider that applications federate to, reached through the Okta AD Agent over outbound HTTPS only, so nothing on the internet can initiate a connection to the domain controller. **Microsoft Entra ID** is the second cloud directory, planned for hybrid synchronisation and Microsoft 365 in Phase 6.

Authentication is evaluated in two layers. First the request is classified by **network zone**: an IP zone for the corporate network, a dynamic geographic zone for allowed countries, and a threat zone that recognises Tor exit nodes. Then the **authentication policies** apply in priority order, and the first match decides the assurance required:

1. Restricted countries: deny.
2. Public network: hardware-protected MFA.
3. Corporate network: standard MFA.

## What is built

- **Directory structure for a bank.** Twenty organisational units, 27 employee accounts across six departments, 15 security groups, and a Microsoft-style **tiered admin model** (Tier 0 / 1 / 2) with seven hardened administrative accounts and the built-in Administrator disabled.
- **AD to Okta synchronisation** with attribute mapping, OU-scoped user and group sync, a dedicated service account, and administrative accounts deliberately excluded from the cloud directory.
- **Application federation across protocol families.** Dropbox Business over **SAML 2.0** with automated provisioning and attribute mapping; Box over **SWA** with password vaulting; group-based assignment so access follows role, not individuals.
- **Dynamic groups** with Okta Expression Language, driven by the AD country attribute, so a change in the directory changes application access without a ticket.
- **Network-based conditional access** (Phase 5.1): three zones, three policy rules, tested with pilot users from both sides of the corporate boundary, with the flows recorded on video.
- **Regulatory traceability.** Each phase guide names the driver it satisfies, from FFIEC IT examination requirements in Phase 1 to BSA/AML geographic controls in Phase 5.

## Decisions worth explaining

**Okta is primary, not Entra.** A bank of this profile typically federates to a best-of-breed IdP and keeps Microsoft as one of several relying parties. Making Okta primary also forces the harder integration work (agent, attribute mapping, protocol variety) rather than the path of least resistance.

**Admin accounts do not sync to the cloud.** Tier 0 identity stays on the domain. If the cloud IdP is compromised, the blast radius stops short of the directory that everything else depends on.

**Where you are changes what you must prove.** Graduated MFA by network zone is more honest than a blanket policy: it pushes hardware-backed factors to the risky context (public networks) without punishing every corporate login, and it makes a deny-by-geography rule a first-class control rather than an afterthought.

## What is next

- **Phase 5.2 to 5.5:** adaptive, risk-based MFA; device trust and posture; privileged access management; behavioural analytics.
- **Phase 6:** Entra ID hybrid synchronisation, seamless SSO and Microsoft 365, with federation decisions between Okta and Entra documented as a decision record.
- Grow the endpoint estate on the homelab side so the identity policies have realistic workstations to protect.
