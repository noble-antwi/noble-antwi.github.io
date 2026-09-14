---
title: "Enterprise Security Homelab"
kicker: "Infrastructure · Detection · Biira Bank"
summary: "A six-VLAN, default-deny network for a fictional regional bank: pfSense, managed switching, a Proxmox hypervisor on a trunk port, a Windows Server 2025 domain controller, a Wazuh SIEM with three agents reporting, a Greenbone scanner whose identity is administrator on member machines and nothing on the domain, and every firewall rule justified and mapped to a NIST control."
category: detection
status: active
statusLabel: "In active build"
order: 20
featured: true
period: "2025 to present"
role: "Design, build, operate, document"
repo: https://github.com/noble-antwi/enterprise-security-homelab
docs: https://github.com/noble-antwi/enterprise-security-homelab/tree/main/docs
docsLabel: "19 runbooks (md + PDF)"
stack: ["pfSense", "802.1Q VLANs", "Proxmox VE", "Windows Server 2025", "Wazuh 4.14", "Greenbone CE", "Group Policy", "Kali Linux", "Ansible", "Tailscale", "CIS Benchmarks"]
relatedTags: ["homelab", "proxmox", "pfsense", "vlan", "networking", "wazuh", "siem", "greenbone", "group-policy"]
hero: ../../assets/work/enterprise-security-homelab/network-architecture.png
heroAlt: "Network architecture diagram: internet, pfSense, two switches and six VLAN security zones with firewall status"
heroCaption: "Current-state architecture. Switch 1 trunks to pfSense and to Switch 2, which carries every tagged VLAN to the Proxmox host; the six zones show their firewall hardening status."
stats:
  - { value: "6", label: "VLAN security zones" }
  - { value: "3 / 6", label: "Rulesets hardened" }
  - { value: "3", label: "Wazuh agents reporting" }
  - { value: "4", label: "CIS baselines recorded" }
gallery:
  - src: ../../assets/work/enterprise-security-homelab/packet-path.svg
    alt: "Flow diagram: a packet from the Kali guest passes the VLAN-aware bridge and the trunk to pfSense, where the RedTeam ruleset permits only DNS, NTP and internet"
    caption: "The path of one packet from the attack segment: tagged at the guest, carried on the trunk, decided by the RedTeam ruleset. Everything not listed is blocked and logged."
  - src: ../../assets/work/enterprise-security-homelab/cis-baseline-comparison.png
    alt: "Chart of CIS benchmark baselines for DC01, ADM01, PVE01 and SIEM01, bars proportional to benchmark size"
    caption: "Four CIS baselines captured before any hardening: DC01 26%, ADM01 26%, PVE01 43%, SIEM01 53.6%. Bars are proportional to benchmark size on purpose; the Windows benchmarks have twice the checks, which is most of the score difference."
  - src: ../../assets/work/enterprise-security-homelab/siem-15-three-agents.png
    alt: "Wazuh agents view showing DC01, ADM01 and PVE01 active"
    caption: "Three agents active across two operating-system families: the domain controller, the administrative workstation and the hypervisor."
  - src: ../../assets/work/enterprise-security-homelab/siem-12-agent-dc01-detail.png
    alt: "Wazuh agent detail for DC01: inventory, MITRE ATT&CK tactics, vulnerabilities and a CIS benchmark run"
    caption: "DC01 as the SIEM sees it. Inventory, ATT&CK tactic counts, vulnerability detection and a CIS Windows Server 2025 run, from one agent install."
  - src: ../../assets/work/enterprise-security-homelab/siem-10-sca-baseline.png
    alt: "Wazuh Security Configuration Assessment showing 127 failing checks on SIEM01"
    caption: "The SIEM assessing itself on first boot: 147 passed, 127 failed against CIS Ubuntu 24.04. Captured before any change, because a baseline cannot be recreated later."
  - src: ../../assets/work/enterprise-security-homelab/fw-17-ent-05-rule.png
    alt: "pfSense ENT-05 rule allowing the domain controller to reach the Wazuh manager"
    caption: "ENT-05: agents dial out, so the rule that lets DC01 report lives on the ENTERPRISELAN interface, not the BlueTeam one. It failed twice before it passed traffic; the runbook records both reasons."
  - src: ../../assets/work/enterprise-security-homelab/net-01-switch-vlan-table.png
    alt: "802.1Q VLAN table on the TP-Link managed switch"
    caption: "The 802.1Q VLAN table on the managed switch: six VLANs, two trunk ports, six access ports."
  - src: ../../assets/work/enterprise-security-homelab/net-04-pfsense-vlan-gateways.png
    alt: "pfSense interface list showing a gateway on every VLAN"
    caption: "pfSense holds the .1 gateway on every segment, so every inter-VLAN packet crosses the firewall."
  - src: ../../assets/work/enterprise-security-homelab/fw-08-mgmt-rules-complete.png
    alt: "Completed MANAGEMENT interface ruleset in pfSense"
    caption: "The MANAGEMENT ruleset after hardening: explicit rules, then default deny. Each carries a justification and a control mapping in the rule register."
  - src: ../../assets/work/enterprise-security-homelab/fw-10-ent-isolation-after.png
    alt: "Test output showing VLAN 50 cannot reach the pfSense admin interface"
    caption: "Management-plane isolation, proven rather than assumed: EnterpriseLAN cannot reach the firewall's admin interface on any VLAN, while DNS, NTP and internet still work."
  - src: ../../assets/work/enterprise-security-homelab/red-14-redteam-rules-final.png
    alt: "Final RedTeam interface ruleset in pfSense"
    caption: "The RedTeam ruleset: DNS and NTP to the firewall, internet for tooling, and nothing else. No ICMP-to-any, so the segment cannot discover internal hosts."
  - src: ../../assets/work/enterprise-security-homelab/red-02-vm-network-vlan30.png
    alt: "Proxmox network device settings for KALI01 with VLAN tag 30"
    caption: "KALI01's placement is one number on its virtual NIC. Nothing inside the guest can move it to another segment, which is why the tag lives at the hypervisor."
  - src: ../../assets/work/enterprise-security-homelab/red-16-containment-test.png
    alt: "Containment test run from the Kali host"
    caption: "Containment test from KALI01: no reachability to the domain controller or the firewall management plane, and the attempt is logged."
  - src: ../../assets/work/enterprise-security-homelab/red-17-clean-install-snapshot.png
    alt: "Proxmox snapshot of KALI01 taken after the clean build"
    caption: "A clean-install snapshot of the attack host. Every exercise starts from here and rolls back afterwards, so nothing carries over between engagements."
  - src: ../../assets/work/enterprise-security-homelab/pve-06-interfaces-vlan-aware.png
    alt: "/etc/network/interfaces on Proxmox with a VLAN-aware bridge"
    caption: "The VLAN-aware bridge on Proxmox. A VM's segment is decided by one tag on its virtual NIC, not by cabling."
  - src: ../../assets/work/enterprise-security-homelab/pve-04-backup-job.png
    alt: "Proxmox scheduled backup job"
    caption: "Nightly backup job, verified by an on-demand restore point. Mapped to NIST CP-9 in the runbook."
  - src: ../../assets/work/enterprise-security-homelab/dc-01-rename-to-dc01.png
    alt: "Renaming the Windows Server host to DC01"
    caption: "DC01, the Windows Server 2025 domain controller, being brought into the role-based naming scheme."
  - src: ../../assets/work/enterprise-security-homelab/scan-identity-chain.svg
    alt: "Diagram: a service account sits in a security group, a Group Policy scoped to the member OUs places that group in each machine's local Administrators, and the Domain Controllers OU sits outside the link"
    caption: "How the scanner becomes an administrator of member machines without gaining anything on the domain. Four links, each doing one job, and the Domain Controllers OU deliberately outside the chain."
  - src: ../../assets/work/enterprise-security-homelab/scan-16-gpo-local-administrators-item.png
    alt: "Group Policy Preferences local group item adding a security group to the built-in Administrators group"
    caption: "The grant itself. Action Update so existing administrators survive, the built-in Administrators group picked from the list so its well-known identifier is stored rather than a typed name, and the member added rather than the list replaced."
  - src: ../../assets/work/enterprise-security-homelab/scanner-logon-rights.svg
    alt: "Diagram of the five Windows logon types, four denied to the scan identity and only network logon permitted"
    caption: "Five ways to sign in to Windows, four of them closed to the scanner. Its password is stored in a database and never expires, so the design assumes the credential leaks and narrows what a leak is worth."
  - src: ../../assets/work/enterprise-security-homelab/sys-10-rdp-refused-svc-greenbone.png
    alt: "Windows refusing a Remote Desktop sign-in for the scanner service account"
    caption: "The closed door, tried. The account is an administrator of this machine and the password is correct, and Windows still refuses, because deny overrides both. A configuration screen is not proof that a right is enforced."
  - src: ../../assets/work/enterprise-security-homelab/scan-17-feed-status-all-loaded.png
    alt: "Greenbone feed status page showing all four feeds loaded and scanning available"
    caption: "All four feeds loaded, after an initial load of about four hours and three separate failures. In this deployment the feeds never update themselves, so how often they are refreshed is a control rather than housekeeping."
  - src: ../../assets/work/enterprise-security-homelab/web-02-securityheaders-after-aplus.png
    alt: "An independent security header grader reporting A plus for biirabank.com"
    caption: "The public tier after hardening, graded from outside rather than from the hosting platform's own dashboard. It started at F."
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
| 40 | DevOps | `192.168.40.0/24` | APP01, two web applications behind Tailscale Serve; VAULT01 planned |
| 50 | EnterpriseLAN | `192.168.50.0/24` | DC01, the `corp.biirabank.com` domain controller; WKS01, the first member workstation |
| 60 | Monitoring | `192.168.60.0/24` | MON01, Grafana and Prometheus, being rebuilt as a guest |

Proxmox sits on a trunk port with a single VLAN-aware Linux bridge, so a VM's network placement is one tag on its virtual NIC. Moving the hypervisor from an access port to the trunk without locking myself out is written up in [Proxmox on a Trunk Port](/lab-notes/2026/05/25/proxmox-vlan-trunk-configuration.html).

## What is built

- **Default-deny segmentation** on three of the six interfaces (MANAGEMENT, ENTERPRISELAN, REDTEAM). Every rule carries a business justification and a NIST SP 800-53 control mapping in a living rule register, with a change log that records tester, rollback and validation evidence. The register now has a ninth principle, learned the hard way: a saved rule is not an enforced rule until the filter is reloaded.
- **Management-plane isolation**, verified by before-and-after testing: VLAN 50 cannot reach the pfSense administrative interface on any address, while it keeps the DNS, NTP and internet access it legitimately needs.
- **KALI01**, the attack host, as a Proxmox guest on VLAN 30 with no standing path to any other segment, no ICMP-to-any, and a clean-install snapshot to roll back to after every exercise. Its containment is proven by a test from the host itself, and the runbook is explicit about what that test does and does not prove.
- **SIEM01**, Wazuh 4.14.7, rebuilt on dedicated hardware after the original host died. The failure became a role swap: the 16 GB machine that had been running Grafana went to the memory-hungry, data-bearing SIEM, and monitoring moves to a hypervisor guest. Written up in [Standing Up Wazuh Twice](/lab-notes/2026/09/08/standing-up-wazuh-twice.html).
- **Three agents reporting**: DC01, ADM01 and PVE01, each with its own firewall rule on the interface its traffic actually arrives on. Enrolling ADM01 exposed that its traffic was bypassing the firewall over Tailscale; the fix, and the evidence, are in the runbook.
- **SCAN01**, a Greenbone Community Edition scanner on VLAN 20 with all four feeds loaded and 186,567 vulnerability tests, built as a VM rather than a container because a scanner stores administrative credentials for everything it scans. Nessus Essentials was the first choice and was ruled out on its own current terms: five addresses on a thirty-day licence cannot cover nine hosts, or sustain a loop of scanning, fixing and scanning again. Written up in [A Scanner That Is Not a Domain Admin](/lab-notes/2026/09/14/a-scanner-that-is-not-a-domain-admin.html).
- **A scan identity that is an administrator on member machines and nothing on the domain.** One service account in one group, and a Group Policy that places that group in each machine's local Administrators, linked to the member OUs only so the Domain Controllers OU sits structurally outside the grant. Four of the five ways to sign in to Windows are then denied to the account, leaving network logon alone, and the closed door is proven by a Remote Desktop session refused with the correct password.
- **A forest rebuilt from an export**, `corp.biirabank.com` replacing the retired `ad.biira.online`, by demoting and repromoting the same hardware rather than renaming it. A password typed back under a different keyboard layout locked the controller out after the promotion reboot, and the recovery is recorded as an incident rather than quietly fixed.
- **A public tier**, `biirabank.com`, served as Cloudflare Worker static assets and graded F to A+ by an independent header checker. Testing found the site still answering on its default `workers.dev` hostname, where none of the zone-level controls applied.
- **Four CIS baselines recorded before any hardening**, one per host and operating system. They are the "before" half of a before-and-after, and the runbook explains why the four scores must not be read as a ranking.
- **DC01**, a Windows Server 2025 domain controller with AD-integrated forward and reverse DNS zones and a clean `dcdiag`. It was the first agent.
- **Nightly Proxmox backups** to a separate physical disk with a tested restore (NIST CP-9), and SHA256 verification of every installation image before use (SI-7).
- **Remote access** over Tailscale with WireGuard, with its ability to bypass per-interface rules recorded as a known, risk-accepted hardening item rather than ignored.

## Decisions worth explaining

**Rules are written for the auditor, not the firewall.** A rule that works but cannot be justified is a finding waiting to happen. The rule register lists the principles auditors check against a rulebase and applies them to every rule: purpose, owner, least privilege, control mapping, review date.

**Failure is treated as design input.** Two hardware failures (a NIC, then the SIEM host) are documented as incidents with a decision record, not quietly fixed. The second produced a better topology than the original: the data-bearing service on dedicated hardware, the light, reproducible one on the hypervisor.

**Measure before you harden.** Every host's CIS baseline was captured on enrolment and cannot be recreated later. A score on its own proves nothing; a score that moves proves the work happened, which is what an auditor is actually asking for.

**Privilege is a chain, and every link should be removable.** The scanner is an administrator of a machine only while the account is in the group, the group is in that machine's Administrators list, and the machine is in the policy's scope. Break any link and the access is gone. The retirement procedure was written at the same time as the grant, because the mechanism that adds the membership leaves it behind when the policy stops applying.

**Naming is a control.** Every machine follows `<ROLE><NN>` (`DC01`, `SIEM01`, `KALI01`, `APP01`) and every screenshot follows `<area>-<NN>-<subject>`, so evidence can be traced to the configuration it proves. That is what CIS Control 12.4 and NIST AU-3 actually ask for.

## What is next

- The last unmonitored host: a `DEV-01` rule and a Wazuh agent on APP01, the first real rule on the DEVOPS interface.
- Harden DC01 and ADM01 against their CIS baselines (both 26%), re-run the assessment and record the delta.
- Run the first scans: credentialed against WKS01, and unauthenticated against DC01 alongside its Wazuh configuration assessment, because there is no least-privilege way to credential-scan a domain controller.
- Write the BLUETEAM, DEVOPS and MONITORING rulesets, which are still permissive. The BlueTeam one is now driven by the traffic SCAN01 actually needs, and a scanner has to cross every boundary the firewall exists to enforce.
- Close the scanner's password debt: VAULT01 issuing a short-lived credential per scan, retiring the non-expiring password that is currently recorded as a tracked exception.
- Rebuild MON01 and ANS01 as Proxmox guests, and give Vault its own guest (VAULT01) rather than a share of APP01.
- Scope Tailscale to close hardening item H-02, and build PAW01, a dedicated administrative workstation, to close H-01.
- Rebuild the identity estate on the bank's new public domain, `biirabank.com`, with a new forest and a new Okta org, from a decision record this time. That work opens a Version 2 chapter here and in the IAM case study.
