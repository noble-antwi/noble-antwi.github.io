DC01 is the domain controller for Biira Bank: a Windows Server 2025 machine on dedicated hardware at `192.168.50.2`, on the EnterpriseLAN segment (VLAN 50). It runs Active Directory Domain Services and DNS, with AD-integrated forward and reverse zones, and it answers a clean `dcdiag`.

## What a domain controller asks of the network

Every machine that joins the domain relies on DC01 for four things: finding it (DNS), proving who you are at logon (Kerberos), reading the directory (LDAP), and downloading policy (SMB). None of these is a single port. Together they are roughly a dozen ports across TCP and UDP, and blocking even one does not give a clean failure. A machine joins but nobody can log on, or logon works and Group Policy silently fails.

pfSense sits between every VLAN in the lab, so before any machine outside VLAN 50 could be a domain member, the firewall needed rules that open exactly that bundle to exactly this host.

## How access to it is built

One rule per port would mean about thirteen rules per source VLAN that nobody could read. I used pfSense aliases instead, so each rule states its intent.

| Alias | Holds | Purpose |
|---|---|---|
| `SRV1_DC` | `192.168.50.2` | The domain controller itself |
| `AD_TCP` | 53, 88, 135, 389, 445, 464, 636, 3268 | TCP ports a domain member needs |
| `AD_UDP` | 53, 88, 123, 389, 464 | UDP ports a domain member needs |
| `AD_RPC_DYNAMIC` | 49152 to 65535 | RPC high ports negotiated at runtime |
| `MGMT_TCP` | 3389, 5985, 5986 | RDP and WinRM, for administration only |

The split is deliberate. The three `AD_` aliases are what it takes to be a member of the domain. `MGMT_TCP` is what it takes to administer the server. Keeping them apart means a client segment can be granted membership without a remote console on the controller. The Management VLAN, home of the admin laptop and the Ansible controller, gets both. The attack segment gets nothing: RedTeam reaching DC01 is a deliberate exercise, opened on purpose and closed afterwards, never a standing rule.

pfSense attaches a rule to the interface where traffic enters, so who may reach DC01 is written on the source VLAN's tab. The ENTERPRISELAN tab controls the other direction, what DC01 itself may start: DNS forwarding to pfSense for names outside the directory, NTP, web traffic out for Windows Update and certificate revocation checks, and the Wazuh manager on 1514 and 1515.

Each decision maps to a NIST SP 800-53 control, among them SC-7 for the boundary and CM-7 for opening only the required ports.

## How it was proved

When the host was renamed from `SRV1` to `DC01` on 30 August 2026, to fit the lab's role-based naming, `dcdiag /test:dns` was clean before and after, and Netlogon was restarted so the controller re-registered its service records under the new name.

It was the first agent. On 6 September 2026 DC01 enrolled with the Wazuh manager as agent 001. Wazuh agents dial out and the manager listens, so the rule that lets DC01 report lives on the ENTERPRISELAN tab, not on the SIEM's own segment. From that one install the SIEM shows system inventory, MITRE ATT&CK tactic counts, vulnerability detection and a CIS Windows Server 2025 benchmark run.

## What went wrong

The agent installed, the service started, and nothing appeared in the dashboard. There were two causes, one after the other. The rule had been copied from another one and still carried the wrong source and service, so it matched nothing. Once that was corrected, the agent still could not connect until the firewall's filter was reloaded. That became the ninth principle of the rulebase: a saved rule is not an enforced rule until the filter is reloaded.

The diagnostic I kept is `Test-NetConnection` to the manager on port 1514, run from the endpoint. It separates a blocked network path from a broken agent, which look identical from the dashboard.

## What it became

The same hardware was later demoted and promoted again as the first controller of a new forest, `corp.biirabank.com`, with the directory rebuilt from an export. The `corp.` prefix is deliberate. A domain controller becomes the DNS authority for its own name, so a flat `biirabank.com` would have made DC01 authoritative for the public zone and broken the public website from inside the lab.

The full runbook, with every command, is [chapter 11 in the repository](https://github.com/noble-antwi/enterprise-security-homelab/blob/main/docs/11-domain-controller-firewall.md).
