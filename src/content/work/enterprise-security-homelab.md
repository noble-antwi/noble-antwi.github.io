---
title: "Enterprise Security Homelab"
kicker: "Infrastructure · Detection · Biira Bank"
summary: "A six-VLAN, default-deny network for a fictional regional bank: pfSense, managed switching, a Proxmox hypervisor on a trunk port, a Windows Server 2025 domain controller, Wazuh as the SIEM, and every firewall rule justified and mapped to a NIST control."
category: detection
status: active
statusLabel: "In active build"
order: 20
featured: true
period: "2025 to present"
role: "Design, build, operate, document"
repo: https://github.com/noble-antwi/enterprise-security-homelab
docs: https://github.com/noble-antwi/enterprise-security-homelab/tree/main/docs
docsLabel: "17 runbooks (md + PDF)"
stack: ["pfSense", "802.1Q VLANs", "Proxmox VE", "Windows Server 2025", "Wazuh", "Ansible", "Grafana", "Prometheus", "Tailscale", "Kali Linux"]
relatedTags: ["homelab", "proxmox", "pfsense", "vlan", "networking"]
hero: ../../assets/work/enterprise-security-homelab/network-architecture.png
heroAlt: "Network architecture diagram: internet, pfSense, two switches and six VLAN security zones with firewall status"
heroCaption: "Current-state architecture. Switch 1 trunks to pfSense and to Switch 2, which carries every tagged VLAN to the Proxmox host; the six zones show their firewall hardening status."
stats:
  - { value: "6", label: "VLAN security zones" }
  - { value: "3 / 6", label: "Rulesets hardened" }
  - { value: "17", label: "Runbooks published" }
  - { value: "10", label: "Systems in the estate" }
gallery:
  - src: ../../assets/work/enterprise-security-homelab/packet-path.svg
    alt: "Flow diagram: a packet from the Kali guest passes the VLAN-aware bridge and the trunk to pfSense, where the RedTeam ruleset permits only DNS, NTP and internet"
    caption: "The path of one packet from the attack segment: tagged at the guest, carried on the trunk, decided by the RedTeam ruleset. Everything not listed is blocked and logged."
  - src: ../../assets/work/enterprise-security-homelab/net-01-switch-vlan-table.png
    alt: "802.1Q VLAN table on the TP-Link managed switch"
    caption: "The 802.1Q VLAN table on the managed switch: six VLANs, two trunk ports, six access ports."
  - src: ../../assets/work/enterprise-security-homelab/net-04-pfsense-vlan-gateways.png
    alt: "pfSense interface list showing a gateway on every VLAN"
    caption: "pfSense holds the .1 gateway on every segment, so every inter-VLAN packet crosses the firewall."
  - src: ../../assets/work/enterprise-security-homelab/fw-08-mgmt-rules-complete.png
    alt: "Completed MANAGEMENT interface ruleset in pfSense"
    caption: "The MANAGEMENT ruleset after hardening: ten explicit rules, then default deny. Each carries a justification in docs/13."
  - src: ../../assets/work/enterprise-security-homelab/fw-10-ent-isolation-after.png
    alt: "Test output showing VLAN 50 cannot reach the pfSense admin interface"
    caption: "Management-plane isolation, proven rather than assumed: EnterpriseLAN cannot reach the firewall's admin interface on any VLAN, while DNS, NTP and internet still work."
  - src: ../../assets/work/enterprise-security-homelab/fw-12-redteam-rules.png
    alt: "RedTeam interface ruleset in pfSense"
    caption: "RedTeam (VLAN 30) has no standing path to any other segment. Exercise access is granted per engagement and withdrawn afterwards."
  - src: ../../assets/work/enterprise-security-homelab/pve-06-interfaces-vlan-aware.png
    alt: "/etc/network/interfaces on Proxmox with a VLAN-aware bridge"
    caption: "The VLAN-aware bridge on Proxmox. A VM's segment is decided by one tag on its virtual NIC, not by cabling."
  - src: ../../assets/work/enterprise-security-homelab/pve-01-datacenter-summary.png
    alt: "Proxmox datacenter summary"
    caption: "The hypervisor: 8 cores, 32 GiB, 2.67 TiB, with nightly backups to a dedicated second disk."
  - src: ../../assets/work/enterprise-security-homelab/pve-04-backup-job.png
    alt: "Proxmox scheduled backup job"
    caption: "Nightly backup job, verified by an on-demand restore point. Mapped to NIST CP-9 in the runbook."
  - src: ../../assets/work/enterprise-security-homelab/red-16-containment-test.png
    alt: "Containment test run from the Kali host"
    caption: "Containment test from KALI01: no reachability to the domain controller or the firewall management plane."
  - src: ../../assets/work/enterprise-security-homelab/dc-01-rename-to-dc01.png
    alt: "Renaming the Windows Server host to DC01"
    caption: "DC01, the Windows Server 2025 domain controller for ad.biira.online, being brought into the role-based naming scheme."
---

## The scenario

Most homelabs are a pile of services on a flat network. This one is built and documented as the infrastructure of **Biira Bank**, a fictional state-chartered bank, because working to a named organisation forces the decisions a real environment forces: who needs to reach what, why a rule exists, what an auditor would ask, and what happens when something fails. Financial services was chosen deliberately. It is the sector where segmentation, least privilege, change control and evidence are least optional.

The domain is real (`ad.biira.online`), the segmentation is real, and the controls are tested rather than described. The sibling [Enterprise IAM Lab](/work/enterprise-iam-lab/) is the same organisation's identity estate and runs on top of this network.

## Architecture

Internet enters through **pfSense**, which holds the `.1` gateway on all six VLANs, so every packet that crosses a segment boundary is a firewall decision. A TP-Link managed switch carries the 802.1Q tags: Port 1 trunks to pfSense, Port 2 trunks to a second switch feeding the **Proxmox VE** hypervisor, and Ports 3 to 8 are single-VLAN access ports for physical hosts.

| VLAN | Zone | Subnet | What lives there |
|------|------|--------|------------------|
| 10 | Management | `192.168.10.0/24` | pfSense, Proxmox, the Ansible controller, the admin workstation |
| 20 | BlueTeam | `192.168.20.0/24` | SIEM01: Wazuh manager, indexer and dashboard |
| 30 | RedTeam | `192.168.30.0/24` | KALI01, the attack host, as a Proxmox VM |
| 40 | DevOps | `192.168.40.0/24` | HashiCorp Vault host (staged) |
| 50 | EnterpriseLAN | `192.168.50.0/24` | DC01, Windows Server 2025 domain controller |
| 60 | Monitoring | `192.168.60.0/24` | Grafana and Prometheus |

Proxmox sits on a trunk port with a single VLAN-aware Linux bridge, so a VM's network placement is one tag on its virtual NIC. Moving the hypervisor from an access port to the trunk without locking myself out is written up in [Proxmox on a Trunk Port](/lab-notes/2026/05/25/proxmox-vlan-trunk-configuration.html).

## What is built

- **Default-deny segmentation** on three of the six interfaces so far (MANAGEMENT, ENTERPRISELAN, REDTEAM). Every rule in those rulesets carries a business justification and a NIST SP 800-53 control mapping in a living rule register, with a change log that records tester, rollback and validation evidence.
- **Management-plane isolation**, verified by before-and-after testing: VLAN 50 cannot reach the pfSense administrative interface on any address, while it keeps the DNS, NTP and internet access it legitimately needs.
- **Attack-segment containment.** KALI01 on VLAN 30 has no standing path to the domain controller or any other VLAN. The containment test is recorded as evidence, and the runbook is explicit about what the test does and does not prove about reachability.
- **DC01**, a Windows Server 2025 domain controller for `ad.biira.online` with AD-integrated forward and reverse DNS zones and a clean `dcdiag`. It is the first Wazuh agent.
- **SIEM01**, Wazuh 4.14 on dedicated hardware after a role swap: the original SIEM host died, and the rebuild was the chance to give the Wazuh indexer the 16 GB box and move Grafana and Prometheus, which need about 2 GB, into a Proxmox guest.
- **Nightly Proxmox backups** to a separate physical disk, with a documented and tested restore (NIST CP-9), and **SHA256 verification** of every installation image before use (SI-7).
- **Remote access** over Tailscale with WireGuard, with its ability to bypass per-interface rules recorded as a known, risk-accepted hardening item rather than ignored.
- **Cross-platform automation** with Ansible: role-based playbooks, a dedicated service account, SSH ED25519 keys for Linux and WinRM for Windows.

## Decisions worth explaining

**Rules are written for the auditor, not the firewall.** A rule that works but cannot be justified is a finding waiting to happen. The rule register in `docs/13` lists the eight principles auditors check against a rulebase and applies them to every rule: purpose, owner, least privilege, control mapping, review date.

**Failure is treated as design input.** Two hardware failures (a NIC, then the SIEM host) are documented as incidents with a decision record, not quietly fixed. The second one produced a better topology than the original.

**Naming is a control.** Every machine follows `<ROLE><NN>` (`DC01`, `SIEM01`, `ANS01`, `KALI01`) and every screenshot follows `<area>-<NN>-<subject>` so evidence can be traced to the configuration it proves. That is what CIS Control 12.4 and NIST AU-3 actually ask for.

## What is next

- Harden the remaining three rulesets (BlueTeam, DevOps, Monitoring), which are still permissive.
- Rebuild ANS01 and MON01 as Proxmox guests, and bring Ansible back online.
- Roll Wazuh agents out across the estate, then write custom detections and dashboards against real telemetry.
- Scope Tailscale to close hardening item H-02.
- Grow the Windows estate (a replica DC, a CA, member workstations) per the lab-expansion roadmap, so the identity lab has realistic endpoints to protect and to attack.
