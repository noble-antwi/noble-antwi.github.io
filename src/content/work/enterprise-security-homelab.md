---
title: "Enterprise Security Homelab"
kicker: "Infrastructure · Detection · Biira Bank"
summary: "A six-VLAN, default-deny network built and documented as the infrastructure of a fictional regional bank, with its own directory, certificate authority, identity provider, secrets vault, SIEM and vulnerability scanner. Every firewall rule is justified and mapped to a NIST control, and every control is tested, not just described."
teaser: "A six-VLAN, default-deny network for a fictional bank, with its own certificate authority, identity provider, SIEM and scanner, and every firewall rule justified."
category: detection
status: active
statusLabel: "In active build"
order: 20
featured: true
period: "2025 to present"
role: "Design, build, operate, document"
repo: https://github.com/noble-antwi/enterprise-security-homelab
docs: https://github.com/noble-antwi/enterprise-security-homelab/tree/main/docs
docsLabel: "23 runbooks"
stack: ["pfSense", "802.1Q VLANs", "Proxmox VE", "Windows Server 2025", "Wazuh 4.14", "Sysmon", "Greenbone CE", "Group Policy", "AD CS", "LDAPS", "Keycloak", "Docker Compose", "HashiCorp Vault", "Kali Linux", "Ansible", "Tailscale", "CIS Benchmarks"]
relatedTags: ["homelab", "proxmox", "pfsense", "vlan", "networking", "wazuh", "siem", "greenbone", "group-policy", "detection-engineering", "vulnerability-management"]
hero: ../../assets/work/enterprise-security-homelab/network-architecture.png
heroAlt: "Network architecture diagram: internet and Tailscale into the pfSense firewall, two switches, the Proxmox hypervisor and its guests, six VLAN security zones with the hosts in each, the Tier 0 identity group, and the trust flows between them"
heroCaption: "Current-state architecture on corp.biirabank.com, as of 4 November 2026. Switch 1 trunks to pfSense and to Switch 2, which carries every tagged VLAN to the Proxmox host. Each zone shows its hosts and which of them report to the SIEM, and the arrows show who signs in to, issues certificates for or calls whom."
stats:
  - { value: "6", label: "VLAN security zones" }
  - { value: "3 / 6", label: "Rulesets hardened" }
  - { value: "7", label: "Wazuh agents reporting" }
  - { value: "4", label: "CIS baselines recorded" }
---

## The scenario

Most homelabs are a pile of services on a flat network. This one is built and documented as the infrastructure of **Biira Bank**, a fictional state-chartered bank, because working to a named organisation forces the decisions a real environment forces: who needs to reach what, why a rule exists, what an auditor would ask, and what happens when something fails. Financial services was chosen deliberately. It is the sector where segmentation, least privilege, change control and evidence are least optional.

The domain is real, the segmentation is real, and the controls are tested rather than described. The sibling [Enterprise IAM Lab](/work/enterprise-iam-lab/) is the same organisation's identity estate and runs on top of this network.

## Architecture

Internet enters through **pfSense**, which holds the `.1` gateway on all six VLANs, so every packet that crosses a segment boundary is a firewall decision. A TP-Link managed switch carries the 802.1Q tags: Port 1 trunks to pfSense, Port 2 trunks to a second switch feeding the **Proxmox VE** hypervisor, and the remaining ports are single-VLAN access ports for physical hosts.

| VLAN | Zone | Subnet | What lives there |
|------|------|--------|------------------|
| 10 | Management | `192.168.10.0/24` | pfSense, PVE01 (the hypervisor), ADM01 (the admin workstation), a lab Ubuntu box |
| 20 | BlueTeam | `192.168.20.0/24` | SIEM01: Wazuh manager, indexer and dashboard. SCAN01: Greenbone vulnerability scanner |
| 30 | RedTeam | `192.168.30.0/24` | KALI01, the attack host, as a Proxmox guest |
| 40 | DevOps | `192.168.40.0/24` | APP01, two web applications behind Tailscale Serve |
| 50 | EnterpriseLAN | `192.168.50.0/24` | The Tier 0 identity systems: DC01, the `corp.biirabank.com` domain controller; CA01, the root CA; IDP01, the identity provider; VAULT01, the secrets server, being built. And WKS01, the first member workstation |
| 60 | Monitoring | `192.168.60.0/24` | MON01, Grafana and Prometheus, being rebuilt as a guest |

Proxmox sits on a trunk port with a single VLAN-aware Linux bridge, so a VM's network placement is one tag on its virtual NIC. Moving the hypervisor from an access port to the trunk without locking myself out is written up in [Proxmox on a Trunk Port](/lab-notes/2026/05/25/proxmox-vlan-trunk-configuration.html).

## What is built

Twenty things are built and proven, in four areas. Each has its own write-up, with the screenshots that prove it.

<p class="built-jump"><a href="#built-network">Network and segmentation <b>6</b></a><a href="#built-identity">Identity and secrets <b>6</b></a><a href="#built-detection">Detection <b>4</b></a><a href="#built-assessment">Assessment and hardening <b>4</b></a></p>

<section class="built" id="built-network">
<h3>Network and segmentation</h3>
<div class="built-grid">
<a class="built-card" href="/work/enterprise-security-homelab/default-deny-segmentation/"><span class="built-t">Default-deny segmentation</span><span class="built-s">On three of the six interfaces (MANAGEMENT, ENTERPRISELAN, REDTEAM).</span><span class="built-go">6 screenshots · write-up <span aria-hidden="true">→</span></span></a>
<a class="built-card" href="/work/enterprise-security-homelab/management-plane-isolation/"><span class="built-t">Management-plane isolation</span><span class="built-s">Verified by before-and-after testing: VLAN 50 cannot reach the pfSense administrative interface on any address, while it keeps the DNS, NTP and internet access it legitimately needs.</span><span class="built-go">1 screenshot · write-up <span aria-hidden="true">→</span></span></a>
<a class="built-card" href="/work/enterprise-security-homelab/kali01-attack-host/"><span class="built-t">KALI01</span><span class="built-s">The attack host, as a Proxmox guest on VLAN 30 with no standing path to any other segment, no ICMP-to-any, and a clean-install snapshot to roll back to after every exercise.</span><span class="built-go">4 screenshots · write-up <span aria-hidden="true">→</span></span></a>
<a class="built-card" href="/work/enterprise-security-homelab/remote-access/"><span class="built-t">Remote access</span><span class="built-s">Over Tailscale with WireGuard, with pfSense as the subnet router.</span><span class="built-go">Write-up <span aria-hidden="true">→</span></span></a>
<a class="built-card" href="/work/enterprise-security-homelab/public-tier/"><span class="built-t">A public tier</span><span class="built-s"><code>biirabank.com</code>, served as Cloudflare Worker static assets and graded F to A+ by an independent header checker.</span><span class="built-go">1 screenshot · write-up <span aria-hidden="true">→</span></span></a>
<a class="built-card" href="/work/enterprise-security-homelab/backups/"><span class="built-t">Nightly Proxmox backups</span><span class="built-s">To a separate physical disk with a tested restore (NIST CP-9), and SHA256 verification of every installation image before use (SI-7).</span><span class="built-go">1 screenshot · write-up <span aria-hidden="true">→</span></span></a>
</div>
</section>

<section class="built" id="built-identity">
<h3>Identity and secrets</h3>
<div class="built-grid">
<a class="built-card" href="/work/enterprise-security-homelab/dc01-domain-controller/"><span class="built-t">DC01</span><span class="built-s">A Windows Server 2025 domain controller with AD-integrated forward and reverse DNS zones and a clean <code>dcdiag</code>.</span><span class="built-go">Write-up <span aria-hidden="true">→</span></span></a>
<a class="built-card" href="/work/enterprise-security-homelab/forest-rebuild/"><span class="built-t">A forest rebuilt from an export</span><span class="built-s"><code>corp.biirabank.com</code> replacing the retired <code>ad.biira.online</code>, by demoting and repromoting the same hardware rather than renaming it.</span><span class="built-go">1 screenshot · write-up <span aria-hidden="true">→</span></span></a>
<a class="built-card" href="/work/enterprise-security-homelab/ca01-certificate-authority/"><span class="built-t">CA01, the bank's own certificate authority</span><span class="built-s">An enterprise root CA on the Tier 0 VLAN beside the domain controller.</span><span class="built-go">6 screenshots · write-up <span aria-hidden="true">→</span></span></a>
<a class="built-card" href="/work/enterprise-security-homelab/idp01-identity-provider/"><span class="built-t">IDP01, the bank's identity provider</span><span class="built-s">Keycloak 26.8.1 and PostgreSQL 18.6 in Docker Compose on a hardened Ubuntu guest beside the domain controller, with keys-only SSH, the database unreachable from outside its container network, and HTTPS from a CA01 certificate whose private key never left the machine.</span><span class="built-go">1 screenshot · write-up <span aria-hidden="true">→</span></span></a>
<a class="built-card" href="/work/enterprise-security-homelab/machine-identity/"><span class="built-t">The first machine identity</span><span class="built-s">The AI agent signs in to IDP01 as its own confidential client, with client credentials only and tokens that last five minutes.</span><span class="built-go">4 screenshots · write-up <span aria-hidden="true">→</span></span></a>
<a class="built-card" href="/work/enterprise-security-homelab/vault01-secrets/"><span class="built-t">VAULT01, being built</span><span class="built-s">HashiCorp Vault 2.2.1 on its own guest with the other Tier 0 systems, initialised with five key shares of which any three unseal it, a CA01 certificate, an audit device on from the start, and Wazuh agent 007.</span><span class="built-go">Write-up <span aria-hidden="true">→</span></span></a>
</div>
</section>

<section class="built" id="built-detection">
<h3>Detection</h3>
<div class="built-grid">
<a class="built-card" href="/work/enterprise-security-homelab/siem01/"><span class="built-t">SIEM01</span><span class="built-s">Wazuh 4.14.7, rebuilt on dedicated hardware after the original host died.</span><span class="built-go">2 screenshots · write-up <span aria-hidden="true">→</span></span></a>
<a class="built-card" href="/work/enterprise-security-homelab/agents/"><span class="built-t">Seven agents reporting</span><span class="built-s">DC01, ADM01, PVE01, WKS01, APP01, IDP01 and VAULT01, with Sysmon on the three Windows machines, and APP01 shipping an application's identity audit log rather than operating-system events.</span><span class="built-go">2 screenshots · write-up <span aria-hidden="true">→</span></span></a>
<a class="built-card" href="/work/enterprise-security-homelab/detection-engineering/"><span class="built-t">Detection engineering, with the evidence kept</span><span class="built-s">A built-in rule fired at level 15 all day on PowerShell checking its own execution policy.</span><span class="built-go">5 screenshots · write-up <span aria-hidden="true">→</span></span></a>
<a class="built-card" href="/work/enterprise-security-homelab/application-identity-rules/"><span class="built-t">Detection rules for an application's identity log</span><span class="built-s">Stock Copilot, an internal app on APP01, writes an audit event for every sign-in, refused token, SCIM call, key rotation and break-glass use.</span><span class="built-go">Write-up <span aria-hidden="true">→</span></span></a>
</div>
</section>

<section class="built" id="built-assessment">
<h3>Assessment and hardening</h3>
<div class="built-grid">
<a class="built-card" href="/work/enterprise-security-homelab/scan01-scanner/"><span class="built-t">SCAN01</span><span class="built-s">A Greenbone Community Edition scanner on VLAN 20 with all four feeds loaded and 186,567 vulnerability tests, built as a VM rather than a container because a scanner stores administrative credentials for everything it scans.</span><span class="built-go">2 screenshots · write-up <span aria-hidden="true">→</span></span></a>
<a class="built-card" href="/work/enterprise-security-homelab/scan-identity/"><span class="built-t">A scan identity that is an administrator on member machines and nothing on the domain</span><span class="built-s">One service account in one group, and a Group Policy that places that group in each machine's local Administrators, linked to the member OUs only so the Domain Controllers OU sits structurally outside the grant.</span><span class="built-go">5 screenshots · write-up <span aria-hidden="true">→</span></span></a>
<a class="built-card" href="/work/enterprise-security-homelab/find-fix-prove/"><span class="built-t">The first finding found, fixed and proved closed</span><span class="built-s">A credentialed scan found TLS 1.0 and 1.1 on WKS01's Remote Desktop.</span><span class="built-go">5 screenshots · write-up <span aria-hidden="true">→</span></span></a>
<a class="built-card" href="/work/enterprise-security-homelab/cis-baselines/"><span class="built-t">Four CIS baselines recorded before any hardening</span><span class="built-s">One per host and operating system.</span><span class="built-go">1 screenshot · write-up <span aria-hidden="true">→</span></span></a>
</div>
</section>

## Decisions worth explaining

**Rules are written for the auditor, not the firewall.** A rule that works but cannot be justified is a finding waiting to happen. The rule register lists the principles auditors check against a rulebase and applies them to every rule: purpose, owner, least privilege, control mapping, review date.

**Failure is treated as design input.** Two hardware failures (a NIC, then the SIEM host) are documented as incidents with a decision record, not quietly fixed. The second produced a better topology than the original: the data-bearing service on dedicated hardware, the light, reproducible one on the hypervisor.

**Measure before you harden.** Every host's CIS baseline was captured on enrolment and cannot be recreated later. A score on its own proves nothing; a score that moves proves the work happened, which is what an auditor is actually asking for.

**Privilege is a chain, and every link should be removable.** The scanner is an administrator of a machine only while the account is in the group, the group is in that machine's Administrators list, and the machine is in the policy's scope. Break any link and the access is gone. The retirement procedure was written at the same time as the grant, because the mechanism that adds the membership leaves it behind when the policy stops applying.

**Silence the alert, never the evidence.** Tuning is what keeps an alert queue readable, but by default Wazuh stores alerts and discards everything else, so a suppression also erased the event. Archives went on before the tuning was called finished.

**Fix what matters here, not what scores highest.** The first finding fixed was not the top of the report. It was the one that was real, belonged to this environment, could be fixed by policy and could be proved closed. Several higher scores came from files that ship with Windows and will never change.

**Naming is a control.** Every machine follows `<ROLE><NN>` (`DC01`, `SIEM01`, `KALI01`, `APP01`) and every screenshot follows `<area>-<NN>-<subject>`, so evidence can be traced to the configuration it proves. That is what CIS Control 12.4 and NIST AU-3 actually ask for.

## What is next

- Bring CA01 into the SIEM with a Wazuh agent and Sysmon, so every certificate issued and every change to the CA is recorded centrally. Give each LDAPS consumer outside VLAN 50 TCP 636 to the domain controller only, recorded in the rule register as it arrives.
- Harden DC01 and ADM01 against their CIS baselines (both 26%), re-run the assessment and record the delta.
- Keep the remediation loop turning. TLS on WKS01 was the first finding closed; the next pass extends the same pattern to servers and the domain controller once they are assessed, starting with an unauthenticated scan of DC01, because there is no least-privilege way to credential-scan a domain controller.
- Track findings from open to closed in DefectDojo, now that the condition set for adopting it, three reports and one closed finding, has been met.
- A retention policy for the new archive index, sized from the growth measured on the first day rather than an estimate.
- Write the BLUETEAM, DEVOPS and MONITORING rulesets. The BlueTeam one is driven by the traffic SCAN01 actually needs, and the DevOps one starts with `DEV-01`, the rule that lets APP01's agent report to SIEM01.
- Close the scanner's password debt: VAULT01 issuing a short-lived credential per scan, retiring the non-expiring password that is currently recorded as a tracked exception.
- Finish VAULT01: retire the root token, and let the AI agent trade its Keycloak token for a short-lived, read-only SIEM credential, retiring a static password.
- Put applications behind IDP01, each with its own scoped firewall rule, and send Keycloak's events to Wazuh so failed sign-ins on the identity provider are watched alongside the domain controller's.
- Rebuild MON01 and ANS01 as Proxmox guests.
- Scope Tailscale to close hardening item H-02, and build PAW01, a dedicated administrative workstation, to close H-01.
- Rebuild the identity estate on the bank's new public domain, `biirabank.com`, with a new forest and a new Okta org, from a decision record this time. That work opens a Version 2 chapter here and in the IAM case study.
