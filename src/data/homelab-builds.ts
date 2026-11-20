/* The Enterprise Security Homelab, one entry per thing that is built.
   Each entry is a page at /work/enterprise-security-homelab/<slug>/ with its own write-up and its own
   screenshots, and a card on the case study. To add an implementation: add an entry here, put its
   screenshots in src/assets/work/enterprise-security-homelab/, and add its card to the case study.
   `lead` and `more` are HTML. Never put a secret, or an open weakness, in this file. */

export interface BuildShot { file: string; alt: string; caption: string }
export interface Build {
  slug: string;
  group: string;
  title: string;
  lead: string;
  more: string;
  /** The runbook chapter in the repository's docs folder, when there is one. */
  runbook: string;
  shots: BuildShot[];
}

export const HOMELAB_DOCS = 'https://github.com/noble-antwi/enterprise-security-homelab/blob/main/docs/';

export const BUILDS: Build[] = [
  {
    "slug": "default-deny-segmentation",
    "group": "Network and segmentation",
    "title": "Default-deny segmentation",
    "lead": "On three of the six interfaces (MANAGEMENT, ENTERPRISELAN, REDTEAM).",
    "more": "<p>Every rule carries a business justification and a NIST SP 800-53 control mapping in a living rule register, with a change log that records tester, rollback and validation evidence. The register now has a ninth principle, learned the hard way: a saved rule is not an enforced rule until the filter is reloaded.</p>",
    "runbook": "13-firewall-rulebase-governance.md",
    "shots": [
      {
        "file": "net-01-switch-vlan-table.png",
        "alt": "802.1Q VLAN table on the TP-Link managed switch",
        "caption": "The 802.1Q VLAN table on the managed switch: six VLANs, two trunk ports, six access ports."
      },
      {
        "file": "net-04-pfsense-vlan-gateways.png",
        "alt": "pfSense interface list showing a gateway on every VLAN",
        "caption": "pfSense holds the .1 gateway on every segment, so every inter-VLAN packet crosses the firewall."
      },
      {
        "file": "packet-path.svg",
        "alt": "Flow diagram: a packet from the Kali guest passes the VLAN-aware bridge and the trunk to pfSense, where the RedTeam ruleset permits only DNS, NTP and internet",
        "caption": "The path of one packet from the attack segment: tagged at the guest, carried on the trunk, decided by the RedTeam ruleset. Everything not listed is blocked and logged."
      },
      {
        "file": "fw-08-mgmt-rules-complete.png",
        "alt": "Completed MANAGEMENT interface ruleset in pfSense",
        "caption": "The MANAGEMENT ruleset after hardening: explicit rules, then default deny. Each carries a justification and a control mapping in the rule register."
      },
      {
        "file": "fw-17-ent-05-rule.png",
        "alt": "pfSense ENT-05 rule allowing the domain controller to reach the Wazuh manager",
        "caption": "ENT-05: agents dial out, so the rule that lets DC01 report lives on the ENTERPRISELAN interface, not the BlueTeam one. It failed twice before it passed traffic; the runbook records both reasons."
      },
      {
        "file": "pve-06-interfaces-vlan-aware.png",
        "alt": "/etc/network/interfaces on Proxmox with a VLAN-aware bridge",
        "caption": "The VLAN-aware bridge on Proxmox. A VM's segment is decided by one tag on its virtual NIC, not by cabling."
      }
    ]
  },
  {
    "slug": "management-plane-isolation",
    "group": "Network and segmentation",
    "title": "Management-plane isolation",
    "lead": "Verified by before-and-after testing: VLAN 50 cannot reach the pfSense administrative interface on any address, while it keeps the DNS, NTP and internet access it legitimately needs.",
    "more": "",
    "runbook": "13-firewall-rulebase-governance.md",
    "shots": [
      {
        "file": "fw-10-ent-isolation-after.png",
        "alt": "Test output showing VLAN 50 cannot reach the pfSense admin interface",
        "caption": "Management-plane isolation, proven rather than assumed: EnterpriseLAN cannot reach the firewall's admin interface on any VLAN, while DNS, NTP and internet still work."
      }
    ]
  },
  {
    "slug": "kali01-attack-host",
    "group": "Network and segmentation",
    "title": "KALI01",
    "lead": "The attack host, as a Proxmox guest on VLAN 30 with no standing path to any other segment, no ICMP-to-any, and a clean-install snapshot to roll back to after every exercise.",
    "more": "<p>Its containment is proven by a test from the host itself, and the runbook is explicit about what that test does and does not prove.</p>",
    "runbook": "15-kali-attack-host-build.md",
    "shots": [
      {
        "file": "red-02-vm-network-vlan30.png",
        "alt": "Proxmox network device settings for KALI01 with VLAN tag 30",
        "caption": "KALI01's placement is one number on its virtual NIC. Nothing inside the guest can move it to another segment, which is why the tag lives at the hypervisor."
      },
      {
        "file": "red-14-redteam-rules-final.png",
        "alt": "Final RedTeam interface ruleset in pfSense",
        "caption": "The RedTeam ruleset: DNS and NTP to the firewall, internet for tooling, and nothing else. No ICMP-to-any, so the segment cannot discover internal hosts."
      },
      {
        "file": "red-16-containment-test.png",
        "alt": "Containment test run from the Kali host",
        "caption": "Containment test from KALI01: no reachability to the domain controller or the firewall management plane, and the attempt is logged."
      },
      {
        "file": "red-17-clean-install-snapshot.png",
        "alt": "Proxmox snapshot of KALI01 taken after the clean build",
        "caption": "A clean-install snapshot of the attack host. Every exercise starts from here and rolls back afterwards, so nothing carries over between engagements."
      }
    ]
  },
  {
    "slug": "remote-access",
    "group": "Network and segmentation",
    "title": "Remote access",
    "lead": "Over Tailscale with WireGuard, with pfSense as the subnet router.",
    "more": "<p>Every remote connection now arrives with the real device's address instead of the firewall's, proven in the SSH session itself and in a Wazuh logon event, so logs and rules can name the device. Written up in chapter 5.</p>",
    "runbook": "05-remote-access.md",
    "shots": []
  },
  {
    "slug": "public-tier",
    "group": "Network and segmentation",
    "title": "A public tier",
    "lead": "<code>biirabank.com</code>, served as Cloudflare Worker static assets and graded F to A+ by an independent header checker.",
    "more": "<p>Testing found the site still answering on its default <code>workers.dev</code> hostname, where none of the zone-level controls applied.</p>",
    "runbook": "18-public-web-presence-and-edge-hardening.md",
    "shots": [
      {
        "file": "web-02-securityheaders-after-aplus.png",
        "alt": "An independent security header grader reporting A plus for biirabank.com",
        "caption": "The public tier after hardening, graded from outside rather than from the hosting platform's own dashboard. It started at F."
      }
    ]
  },
  {
    "slug": "backups",
    "group": "Network and segmentation",
    "title": "Nightly Proxmox backups",
    "lead": "To a separate physical disk with a tested restore (NIST CP-9), and SHA256 verification of every installation image before use (SI-7).",
    "more": "",
    "runbook": "14-proxmox-storage-backup-capacity.md",
    "shots": [
      {
        "file": "pve-04-backup-job.png",
        "alt": "Proxmox scheduled backup job",
        "caption": "Nightly backup job, verified by an on-demand restore point. Mapped to NIST CP-9 in the runbook."
      }
    ]
  },
  {
    "slug": "dc01-domain-controller",
    "group": "Identity and secrets",
    "title": "DC01",
    "lead": "A Windows Server 2025 domain controller with AD-integrated forward and reverse DNS zones and a clean <code>dcdiag</code>.",
    "more": "<p>It was the first agent.</p>",
    "runbook": "11-domain-controller-firewall.md",
    "shots": []
  },
  {
    "slug": "forest-rebuild",
    "group": "Identity and secrets",
    "title": "A forest rebuilt from an export",
    "lead": "<code>corp.biirabank.com</code> replacing the retired <code>ad.biira.online</code>, by demoting and repromoting the same hardware rather than renaming it.",
    "more": "<p>A password typed back under a different keyboard layout locked the controller out after the promotion reboot, and the recovery is recorded as an incident rather than quietly fixed.</p>",
    "runbook": "17-domain-migration-corp-biirabank.md",
    "shots": [
      {
        "file": "dc-01-rename-to-dc01.png",
        "alt": "Renaming the Windows Server host to DC01",
        "caption": "DC01, the Windows Server 2025 domain controller, being brought into the role-based naming scheme."
      }
    ]
  },
  {
    "slug": "ca01-certificate-authority",
    "group": "Identity and secrets",
    "title": "CA01, the bank's own certificate authority",
    "lead": "An enterprise root CA on the Tier 0 VLAN beside the domain controller.",
    "more": "<p><code>DC01</code> enrolled itself through a certificate template, generating its key pair locally so the private key never left it, and now answers LDAPS on 636. Proven from inside the domain with <code>ldp.exe</code> and from a laptop that never joined it: with the root, checked against its published SHA-256 fingerprint, <code>Verification: OK</code>; without it, error 20. The first consumer is an <a href=\"/work/ai-agent-identity-lab/\">AI agent with its own identity</a>. Written up in chapter 22.</p>",
    "runbook": "22-certificate-authority-ca01-and-ldaps.md",
    "shots": [
      {
        "file": "pki-07-root-ca-alive-and-details.png",
        "alt": "The Biira Bank Root CA running on CA01, with its certificate details",
        "caption": "CA01 alive: an enterprise root CA, RSA 4096 and SHA-256, valid for ten years. A CA is a Tier 0 asset, so it lives beside the domain controller it serves."
      },
      {
        "file": "pki-10-dc01-enrolled.png",
        "alt": "DC01 holding one certificate for DC01.corp.biirabank.com issued by Biira Bank Root CA, with client and server authentication",
        "caption": "DC01 enrolled itself: gpupdate and certutil -pulse, and its own store holds a certificate for DC01.corp.biirabank.com. The private key was made on DC01 and has never left it."
      },
      {
        "file": "pki-12-ldp-ldaps-rootdse.png",
        "alt": "ldp.exe connected to ldaps://DC01.corp.biirabank.com on port 636, returning the directory root entry",
        "caption": "LDAPS answering on 636, by name. Before the CA, the same connection was reset at the handshake."
      },
      {
        "file": "pki-14-root-certificate-sha256.png",
        "alt": "certutil computing the SHA-256 fingerprint of the exported root certificate",
        "caption": "The root certificate fingerprinted before it went anywhere. Trusting a root is the most powerful trust decision a machine makes, so it is never made on an unchecked file."
      },
      {
        "file": "pki-15-openssl-verified-with-root.png",
        "alt": "openssl s_client from a laptop outside the domain: TLS 1.3, peer DC01.corp.biirabank.com, Verification OK",
        "caption": "From a laptop that never joined the domain, holding the checked root: TLS 1.3, Verification: OK, verified peer name DC01.corp.biirabank.com."
      },
      {
        "file": "pki-16-openssl-without-root.png",
        "alt": "The same openssl command without the root certificate failing with error 20, unable to get local issuer certificate",
        "caption": "The same command without the root: error 20. The connection is encrypted, but nothing proves who is at the other end, so a real client stops here."
      }
    ]
  },
  {
    "slug": "idp01-identity-provider",
    "group": "Identity and secrets",
    "title": "IDP01, the bank's identity provider",
    "lead": "Keycloak 26.8.1 and PostgreSQL 18.6 in Docker Compose on a hardened Ubuntu guest beside the domain controller, with keys-only SSH, the database unreachable from outside its container network, and HTTPS from a CA01 certificate whose private key never left the machine.",
    "more": "<p>Keycloak reads Active Directory over LDAPS with its own read-only account, limited to the Employees OU, and never stores a password: a Biira Bank employee signed in with her directory password and DC01 checked it. The administrator signs in with a one-time code, and the bootstrap administrator was deleted. Written up in chapter 23.</p>",
    "runbook": "23-identity-provider-idp01-keycloak.md",
    "shots": [
      {
        "file": "idp-50-emily-account-console.png",
        "alt": "Keycloak account console for Emily Davis at idp01.corp.biirabank.com, her details read from Active Directory and greyed out",
        "caption": "IDP01 federated to Active Directory: a Biira Bank employee signs in with her directory password, and Keycloak shows details it read from AD but cannot change. Keycloak stored none of it; DC01 checked the password."
      }
    ]
  },
  {
    "slug": "machine-identity",
    "group": "Identity and secrets",
    "title": "The first machine identity",
    "lead": "The AI agent signs in to IDP01 as its own confidential client, with client credentials only and tokens that last five minutes.",
    "more": "<p>Disabling the client refused every request with <code>invalid_client</code>, while Keycloak's event log recorded the real reason, <code>client_disabled</code>, under the agent's name.</p>",
    "runbook": "23-identity-provider-idp01-keycloak.md",
    "shots": [
      {
        "file": "idp-52-agent-client-capability.png",
        "alt": "Keycloak client capability settings: client authentication on, only service account roles ticked, every browser flow off",
        "caption": "The AI agent's own identity on IDP01: a confidential client that must prove itself with a secret, and only service account roles. With every browser flow off, no person can sign in through it."
      },
      {
        "file": "idp-56-agent-token-claims.png",
        "alt": "PowerShell decoding the agent's token: issuer the biira realm on IDP01, azp agent-ask-siem, expiring five minutes after issue",
        "caption": "A token for the agent, valid for 300 seconds: issued by the biira realm on IDP01, to agent-ask-siem, as its own service account. The secret itself never appears on screen."
      },
      {
        "file": "idp-58-agent-invalid-client.png",
        "alt": "Token requests succeeding, then refused with invalid_client while the client is disabled, then succeeding again",
        "caption": "The off switch: one token issued, every request refused with invalid_client while the client is disabled, tokens again once it is re-enabled."
      },
      {
        "file": "idp-59-agent-client-disabled-event.png",
        "alt": "Keycloak user events: CLIENT_LOGIN for the agent's service account, then CLIENT_LOGIN_ERROR with error client_disabled",
        "caption": "The caller is told only invalid_client; Keycloak's own record keeps the real reason, client_disabled, under the agent's name."
      }
    ]
  },
  {
    "slug": "vault01-secrets",
    "group": "Identity and secrets",
    "title": "VAULT01, being built",
    "lead": "HashiCorp Vault 2.2.1 on its own guest with the other Tier 0 systems, initialised with five key shares of which any three unseal it, a CA01 certificate, an audit device on from the start, and Wazuh agent 007.",
    "more": "<p>Six Wazuh rules now read its audit log: a failed login, a password-guessing run, an invalid token, and an expired browser session that stays quiet unless it repeats. They were proven live from VAULT01 to SIEM01, including after a forced log rotation. Written up in <a href=\"/lab-notes/2026/11/09/what-wazuh-hears-when-vault-says-no.html\">What Wazuh Hears When Vault Says No</a>. The first short-lived credentials follow.</p>",
    "runbook": "",
    "shots": []
  },
  {
    "slug": "siem01",
    "group": "Detection",
    "title": "SIEM01",
    "lead": "Wazuh 4.14.7, rebuilt on dedicated hardware after the original host died.",
    "more": "<p>The failure became a role swap: the 16 GB machine that had been running Grafana went to the memory-hungry, data-bearing SIEM, and monitoring moves to a hypervisor guest. Written up in <a href=\"/lab-notes/2026/09/08/standing-up-wazuh-twice.html\">Standing Up Wazuh Twice</a>.</p>",
    "runbook": "16-siem01-build.md",
    "shots": [
      {
        "file": "siem-15-three-agents.png",
        "alt": "Wazuh agents view showing DC01, ADM01 and PVE01 active",
        "caption": "The first three agents, across two operating-system families: the domain controller, the administrative workstation and the hypervisor. WKS01 joined later as agent 004."
      },
      {
        "file": "siem-10-sca-baseline.png",
        "alt": "Wazuh Security Configuration Assessment showing 127 failing checks on SIEM01",
        "caption": "The SIEM assessing itself on first boot: 147 passed, 127 failed against CIS Ubuntu 24.04. Captured before any change, because a baseline cannot be recreated later."
      }
    ]
  },
  {
    "slug": "agents",
    "group": "Detection",
    "title": "Seven agents reporting",
    "lead": "DC01, ADM01, PVE01, WKS01, APP01, IDP01 and VAULT01, with Sysmon on the three Windows machines, and APP01 shipping an application's identity audit log rather than operating-system events.",
    "more": "<p>Enrolling ADM01 exposed that its traffic was bypassing the firewall over Tailscale; the fix, and the evidence, are in the runbook.</p>",
    "runbook": "16-siem01-build.md",
    "shots": [
      {
        "file": "siem-12-agent-dc01-detail.png",
        "alt": "Wazuh agent detail for DC01: inventory, MITRE ATT&CK tactics, vulnerabilities and a CIS benchmark run",
        "caption": "DC01 as the SIEM sees it. Inventory, ATT&CK tactic counts, vulnerability detection and a CIS Windows Server 2025 run, from one agent install."
      },
      {
        "file": "idp-14-wazuh-agent-006-active.png",
        "alt": "agent_control on SIEM01 listing six active agents, IDP01 enrolled as agent 006",
        "caption": "IDP01 enrolled with the SIEM as agent 006 before Keycloak went on it. An identity provider is a Tier 0 system, so it was watched from its first day."
      }
    ]
  },
  {
    "slug": "detection-engineering",
    "group": "Detection",
    "title": "Detection engineering, with the evidence kept",
    "lead": "A built-in rule fired at level 15 all day on PowerShell checking its own execution policy.",
    "more": "<p>It is now tuned by an exception that needs two conditions, so the rule still catches everything else, and the scanner's 2,051 sign-in alerts per scan became a silent rule for SCAN01 and a level 12 alert for the same account from anywhere else. Archives are on, so a silenced alert still leaves its event on the record. The rules live in the repository and are deployed from it. Written up in <a href=\"/lab-notes/2026/09/26/the-alert-that-cried-wolf.html\">The Alert That Cried Wolf</a>.</p>",
    "runbook": "20-detection-engineering-tuning-and-archives.md",
    "shots": [
      {
        "file": "siem-23-rule-92213-level-15-t1105.png",
        "alt": "Wazuh rule 92213 firing at level 15 with MITRE technique T1105",
        "caption": "The first piece of detection engineering. A built-in rule at the top of the severity scale, tagged as an attacker transferring tools, firing several times an hour on every Windows endpoint. It was PowerShell checking its own execution policy."
      },
      {
        "file": "siem-30-92213-last-alert-before-rule.png",
        "alt": "A search for rule 92213 across one day returning a single hit at 11:42",
        "caption": "Proof on live data: one alert from that rule all day, at 11:42. The tuned ruleset went in at 11:56, and nothing has fired since. The exception needs two conditions, so the rule itself still alerts on anything else."
      },
      {
        "file": "siem-21-wks01-scan-logon-events.png",
        "alt": "Wazuh events showing thousands of successful sign-ins by the scan account, classified as possible pass-the-hash",
        "caption": "What the SIEM made of it: about two thousand successful sign-ins in an hour from one service account, flagged as possible credential abuse. The rule is not wrong, so the fix was a pair of rules rather than a switch-off."
      },
      {
        "file": "siem-20-wks01-scan-window-dashboard.png",
        "alt": "Wazuh dashboard for agent 004 over one hour: 2,051 authentication events and no failures",
        "caption": "The scan window as the SIEM saw it: 2,051 successful sign-ins and no failures in one hour. A credentialed scan is a very large number of successful logons in a very short time."
      },
      {
        "file": "siem-29-archives-index-first-events.png",
        "alt": "The wazuh-archives index in the Wazuh dashboard returning 2,121 events in 24 minutes",
        "caption": "Archives switched on: 2,121 events in the first 24 minutes, including events that raised no alert. Before this, about 5% of what the SIEM saw was ever written down, so a silenced alert also erased its evidence."
      }
    ]
  },
  {
    "slug": "application-identity-rules",
    "group": "Detection",
    "title": "Detection rules for an application's identity log",
    "lead": "Stock Copilot, an internal app on APP01, writes an audit event for every sign-in, refused token, SCIM call, key rotation and break-glass use.",
    "more": "<p>Thirty Wazuh rules turn that log into alerts mapped to MITRE ATT&amp;CK: forged SAML and unsigned tokens at level 12, password guessing counted per device, signing keys changed outside a declared rotation. They were tested before deployment against 61 sample events and a replay of 676 real ones, and went live on 23 October 2026: the app's attack probe produced 18 alerts, all decoded on SIEM01. The first password-guessing rule raised seven false alerts on the lab's own traffic, because it counted refusals by policy as well as wrong credentials; it now counts credentials only. The rules and their deployment steps live in the repository's <code>detections/</code> folder. Written up in <a href=\"/lab-notes/2026/10/27/watching-the-front-door.html\">Watching the Front Door</a>.</p>",
    "runbook": "../detections/README.md",
    "shots": []
  },
  {
    "slug": "scan01-scanner",
    "group": "Assessment and hardening",
    "title": "SCAN01",
    "lead": "A Greenbone Community Edition scanner on VLAN 20 with all four feeds loaded and 186,567 vulnerability tests, built as a VM rather than a container because a scanner stores administrative credentials for everything it scans.",
    "more": "<p>Nessus Essentials was the first choice and was ruled out on its own current terms: five addresses on a thirty-day licence cannot cover nine hosts, or sustain a loop of scanning, fixing and scanning again. Written up in <a href=\"/lab-notes/2026/09/14/a-scanner-that-is-not-a-domain-admin.html\">A Scanner That Is Not a Domain Admin</a>.</p>",
    "runbook": "19-vulnerability-scanning-scan01.md",
    "shots": [
      {
        "file": "scan-17-feed-status-all-loaded.png",
        "alt": "Greenbone feed status page showing all four feeds loaded and scanning available",
        "caption": "All four feeds loaded, after an initial load of about four hours and three separate failures. In this deployment the feeds never update themselves, so how often they are refreshed is a control rather than housekeeping."
      },
      {
        "file": "scan-25-greenbone-credentialed-baseline-running.png",
        "alt": "Greenbone showing a credentialed baseline scan task running against the first domain-joined workstation",
        "caption": "The first credentialed scan, 19 September. The target is a name rather than an address, because the workstation holds a DHCP lease and a pinned address would eventually point at something else."
      }
    ]
  },
  {
    "slug": "scan-identity",
    "group": "Assessment and hardening",
    "title": "A scan identity that is an administrator on member machines and nothing on the domain",
    "lead": "One service account in one group, and a Group Policy that places that group in each machine's local Administrators, linked to the member OUs only so the Domain Controllers OU sits structurally outside the grant.",
    "more": "<p>Four of the five ways to sign in to Windows are then denied to the account, leaving network logon alone, and the closed door is proven by a Remote Desktop session refused with the correct password.</p>",
    "runbook": "19-vulnerability-scanning-scan01.md",
    "shots": [
      {
        "file": "scan-identity-chain.svg",
        "alt": "Diagram: a service account sits in a security group, a Group Policy scoped to the member OUs places that group in each machine's local Administrators, and the Domain Controllers OU sits outside the link",
        "caption": "How the scanner becomes an administrator of member machines without gaining anything on the domain. Four links, each doing one job, and the Domain Controllers OU deliberately outside the chain."
      },
      {
        "file": "scan-16-gpo-local-administrators-item.png",
        "alt": "Group Policy Preferences local group item adding a security group to the built-in Administrators group",
        "caption": "The grant itself. Action Update so existing administrators survive, the built-in Administrators group picked from the list so its well-known identifier is stored rather than a typed name, and the member added rather than the list replaced."
      },
      {
        "file": "scanner-logon-rights.svg",
        "alt": "Diagram of the five Windows logon types, four denied to the scan identity and only network logon permitted",
        "caption": "Five ways to sign in to Windows, four of them closed to the scanner. Its password is stored in a database and never expires, so the design assumes the credential leaks and narrows what a leak is worth."
      },
      {
        "file": "sys-10-rdp-refused-svc-greenbone.png",
        "alt": "Windows refusing a Remote Desktop sign-in for the scanner service account",
        "caption": "The closed door, tried. The account is an administrator of this machine and the password is correct, and Windows still refuses, because deny overrides both. A configuration screen is not proof that a right is enforced."
      },
      {
        "file": "scan-24-gpo-smb-rule-scoped-to-scan01.png",
        "alt": "Windows Firewall inbound rule for SMB with its remote address scoped to the scanner",
        "caption": "The workstation's SMB rule, scoped to one remote address: SCAN01. A scan does not need a port opened to a segment, only to a host."
      }
    ]
  },
  {
    "slug": "find-fix-prove",
    "group": "Assessment and hardening",
    "title": "The first finding found, fixed and proved closed",
    "lead": "A credentialed scan found TLS 1.0 and 1.1 on WKS01's Remote Desktop.",
    "more": "<p>A scoped, reversible Group Policy removed them, each step was verified on the machine, and a third scan proved them gone from three directions. WMI stays closed to the scanner by decision, because it would let a stolen scan credential run commands everywhere. Written up in <a href=\"/lab-notes/2026/10/09/find-fix-prove.html\">Find, Fix, Prove</a>.</p>",
    "runbook": "21-find-fix-prove-tls-on-wks01.md",
    "shots": [
      {
        "file": "scan-26-report-two-tls-1-0-and-1-1-found.png",
        "alt": "Greenbone report showing TLS 1.0 and 1.1 offered on port 3389 of WKS01",
        "caption": "The first finding chosen for the remediation loop: Remote Desktop on WKS01 still offering TLS 1.0 and 1.1, confirmed by handshake. Not the highest score on the report, but real, the lab's own configuration, and fixable by policy."
      },
      {
        "file": "scan-28-gpo-tls-linked-to-workstations-ou.png",
        "alt": "Group Policy Management showing the TLS hardening policy linked only to the Workstations OU",
        "caption": "One policy with one job, linked to the Workstations OU only, after the directory confirmed where the target lives. The first link would have reached the servers too."
      },
      {
        "file": "sys-17-wks01-schannel-values-verified.png",
        "alt": "PowerShell reading the SCHANNEL registry values on WKS01",
        "caption": "Proved on the machine before any rescan: the values written. A reboot then put them in force, and Remote Desktop still connected on TLS 1.2."
      },
      {
        "file": "scan-34-report-three-tls-1-2-and-1-3-only.png",
        "alt": "Greenbone report three listing only TLS 1.2 and TLS 1.3 on the Remote Desktop port",
        "caption": "The finding closed, from three directions: absent from the report, the supported versions listed as TLS 1.2 and 1.3 only, and a separate test unable to negotiate TLS 1.0. The same scan raised zero false sign-in alerts in the SIEM."
      },
      {
        "file": "scan-35-report-three-wmi-checks-timed-out.png",
        "alt": "Greenbone error messages showing WMI checks timing out",
        "caption": "A result left alone on purpose. WMI would let the scan account start processes on every workstation, so it stays closed and a few inventory checks time out. The trade-off is recorded, not chased."
      }
    ]
  },
  {
    "slug": "cis-baselines",
    "group": "Assessment and hardening",
    "title": "Four CIS baselines recorded before any hardening",
    "lead": "One per host and operating system.",
    "more": "<p>They are the \"before\" half of a before-and-after, and the runbook explains why the four scores must not be read as a ranking.</p>",
    "runbook": "16-siem01-build.md",
    "shots": [
      {
        "file": "cis-baseline-comparison.png",
        "alt": "Chart of CIS benchmark baselines for DC01, ADM01, PVE01 and SIEM01, bars proportional to benchmark size",
        "caption": "Four CIS baselines captured before any hardening: DC01 26%, ADM01 26%, PVE01 43%, SIEM01 53.6%. Bars are proportional to benchmark size on purpose; the Windows benchmarks have twice the checks, which is most of the score difference."
      }
    ]
  }
];
