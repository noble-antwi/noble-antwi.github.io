/* The Biira Bank estate: one source of truth for /architecture/.
   The 3D lab, the scene copy, the host cards and the table are all drawn
   from this file. When a host is built, renamed or retired, change it here
   and the whole architecture redraws. Keep it in step with the homelab
   repository's BACKLOG and docs; never put a secret in it. */

export interface Zone { id: number; name: string; x: number; color: number; css: string; subnet: string }
export interface Host {
  name: string; zone: number; at: [number, number]; h: number; ip: string; role: string;
  agent: string | null; state: 'built' | 'planned'; tier0?: boolean; vm?: number; note: string;
  since: string; // an ERAS id: when the host joined the estate in its current form
}
export interface Era { id: string; tick: string; label: string; title: string; text: string }

/* The timeline in Explore mode. Coarse on purpose: each stage is a month the
   estate visibly changed, dated from the homelab repository's docs and backlog. */
export const ERAS: Era[] = [
  { id: '2025',    tick: '2025',   label: '2025',          title: 'The network',      text: 'pfSense and six VLANs on one trunk, the admin laptop, a practice host and the VLAN 40 desktop that later became APP01.' },
  { id: '2026-05', tick: 'May 26', label: 'May 2026',      title: 'The hypervisor',   text: 'PVE01 arrives: one Proxmox host that places every guest on its network by VLAN tag.' },
  { id: '2026-09', tick: 'Sep 26', label: 'September 2026', title: 'The bank',        text: 'DC01 rebuilt on corp.biirabank.com, SIEM01 on its own hardware, a contained attack host, credentialed scanning and a domain-joined workstation.' },
  { id: '2026-10', tick: 'Oct 26', label: 'October 2026',  title: 'Tier 0',           text: 'The Biira Bank Root CA on CA01, LDAPS everywhere, and Keycloak on IDP01 signing people and the AI agent in.' },
  { id: '2026-11', tick: 'Nov 26', label: 'November 2026', title: 'Secrets',          text: 'VAULT01 holds the secrets behind 3-of-5 key shares, and remote connections keep their real source address.' },
  { id: 'next',    tick: 'Next',   label: 'Next',          title: 'Still being built', text: 'Monitoring returns as MON01, automation as ANS01, and Vault starts handing the AI agent its secrets.' },
];
export interface Link { from: string; to: string; kind: 'identity' | 'cert' | 'agent'; label: string; scene: string; planned?: boolean }
export interface Scene {
  id: string; rail: string; cam: [number, number, number]; look: [number, number, number];
  kicker: string; title: string; text: string; side?: 'bottom';
  chips?: [string, string][]; stats?: boolean; tip?: string; explore?: boolean;
  focus: 'all' | 'none' | 'planned' | string[];
}

export const ESTATE: { updated: string; zones: Zone[]; hosts: Host[]; links: Link[] } = {
  updated: '4 November 2026',
  zones: [
    { id: 10, name: 'Management',    x: -15, color: 0x7c3aed, css: '#7c3aed', subnet: '192.168.10.0/24' },
    { id: 20, name: 'BlueTeam',      x: -9,  color: 0x14b8a6, css: '#14b8a6', subnet: '192.168.20.0/24' },
    { id: 30, name: 'RedTeam',       x: -3,  color: 0xef4444, css: '#ef4444', subnet: '192.168.30.0/24' },
    { id: 40, name: 'DevOps',        x: 3,   color: 0xf59e0b, css: '#f59e0b', subnet: '192.168.40.0/24' },
    { id: 50, name: 'EnterpriseLAN', x: 9,   color: 0x3b82f6, css: '#3b82f6', subnet: '192.168.50.0/24' },
    { id: 60, name: 'Monitoring',    x: 15,  color: 0x22c55e, css: '#22c55e', subnet: '192.168.60.0/24' },
  ],
  hosts: [
    { name: 'ADM01',   zone: 10, at: [-16.3,  1.4], h: 0.45, ip: '192.168.10.3', role: 'Admin laptop',               agent: '002', state: 'built', since: '2025',
      note: 'The administrator\'s laptop. Reaches the lab over Tailscale and signs in to servers with its own SSH key.' },
    { name: 'PVE01',   zone: 10, at: [-14.0, -1.3], h: 1.25, ip: '192.168.10.6', role: 'Proxmox VE hypervisor',      agent: '003', state: 'built', since: '2026-05',
      note: 'Runs every virtual machine on one VLAN-aware bridge, placing each guest on its network by tag. Backs them up nightly.' },
    { name: 'LAB01',   zone: 10, at: [-16.3, -1.5], h: 0.6,  ip: '192.168.10.4', role: 'Practice host',              agent: null,  state: 'built', since: '2025',
      note: 'A machine for training exercises, kept apart from anything that matters.' },
    { name: 'ANS01',   zone: 10, at: [-13.7,  1.4], h: 0.7,  ip: '192.168.10.2', role: 'Ansible controller',         agent: null,  state: 'planned', since: 'next',
      note: 'Will configure hosts from code, so a server can be rebuilt the same way twice.' },
    { name: 'SIEM01',  zone: 20, at: [ -9.8, -1.1], h: 1.45, ip: '192.168.20.2', role: 'Wazuh 4.14.7 manager',       agent: 'manager', state: 'built', since: '2026-09',
      note: 'Wazuh manager, indexer and dashboard on its own hardware. Every agent in the lab reports here.' },
    { name: 'SCAN01',  zone: 20, at: [ -7.9,  1.2], h: 0.85, ip: '192.168.20.3', role: 'Greenbone scanner',          agent: null,  state: 'built', since: '2026-09', vm: 104,
      note: 'Runs credentialed vulnerability scans, signed in as an account that holds nothing on the domain.' },
    { name: 'KALI01',  zone: 30, at: [ -3.0,  0.2], h: 0.85, ip: '192.168.30.2', role: 'Attack host, contained',     agent: null,  state: 'built', since: '2026-09', vm: 103,
      note: 'Attack practice box, walled into its own network. A tested ruleset keeps it away from DC01 and the firewall.' },
    { name: 'APP01',   zone: 40, at: [  3.0, -0.6], h: 0.95, ip: '192.168.40.2', role: 'Apps and the AI agent',      agent: '005', state: 'built', since: '2025',
      note: 'Hosts the internal web apps and the Ask-my-SIEM AI agent, published to the owner\'s devices over Tailscale.' },
    { name: 'DC01',    zone: 50, at: [  7.5, -1.6], h: 1.45, ip: '192.168.50.2', role: 'Active Directory, DNS',      agent: '001', state: 'built', since: '2026-09', tier0: true,
      note: 'The domain controller for corp.biirabank.com. Holds every person and group, and is the only place passwords live.' },
    { name: 'CA01',    zone: 50, at: [  9.0, -1.6], h: 1.0,  ip: '192.168.50.3', role: 'Biira Bank Root CA',         agent: null,  state: 'built', since: '2026-10', tier0: true, vm: 105,
      note: 'The bank\'s own certificate authority. Every Tier 0 service proves who it is with a certificate stamped here.' },
    { name: 'IDP01',   zone: 50, at: [ 10.5, -1.6], h: 1.05, ip: '192.168.50.4', role: 'Keycloak identity provider', agent: '006', state: 'built', since: '2026-10', tier0: true, vm: 106,
      note: 'Keycloak. Signs people in against Active Directory over LDAPS, and gives the AI agent tokens that last five minutes.' },
    { name: 'VAULT01', zone: 50, at: [  8.2,  0.3], h: 1.05, ip: '192.168.50.5', role: 'HashiCorp Vault 2.2.1',      agent: '007', state: 'built', since: '2026-11', tier0: true, vm: 107,
      note: 'Holds the secrets. Sealed behind 3-of-5 key shares, every request audited, the root token retired.' },
    { name: 'WKS01',   zone: 50, at: [ 10.3,  1.6], h: 0.55, ip: 'DHCP',         role: 'Windows 11 workstation',     agent: '004', state: 'built', since: '2026-09', vm: 100,
      note: 'A domain-joined Windows 11 workstation with Sysmon, used to prove sign-in, scanning and detection end to end.' },
    { name: 'MON01',   zone: 60, at: [ 15.0,  0.2], h: 0.8,  ip: '192.168.60.2', role: 'Grafana and Prometheus',     agent: null,  state: 'planned', since: 'next', vm: 102,
      note: 'Will return as the metrics and dashboards host, next to the logs SIEM01 already keeps.' },
  ],
  links: [
    { from: 'IDP01', to: 'DC01',    kind: 'identity', label: 'LDAPS, read-only',     scene: 'tier0' },
    { from: 'CA01',  to: 'DC01',    kind: 'cert',     label: 'certificate',          scene: 'tier0' },
    { from: 'CA01',  to: 'IDP01',   kind: 'cert',     label: 'certificate',          scene: 'tier0' },
    { from: 'CA01',  to: 'VAULT01', kind: 'cert',     label: 'certificate',          scene: 'tier0' },
    { from: 'WKS01', to: 'DC01',    kind: 'identity', label: 'domain sign-in',       scene: 'tier0' },
    { from: 'APP01', to: 'IDP01',   kind: 'agent',    label: '5-minute token',       scene: 'agent' },
    { from: 'APP01', to: 'VAULT01', kind: 'agent',    label: 'token in, secret out', scene: 'agent', planned: true },
    { from: 'APP01', to: 'SIEM01',  kind: 'agent',    label: 'reads alerts',         scene: 'agent' },
  ],
};

export const SCENES: Scene[] = [
  { id: 'hero', rail: 'Estate', cam: [-5, 19, 21], look: [-5.5, -0.5, -1],
    kicker: 'Biira Bank · enterprise security lab',
    title: 'One bank. Six networks. Every trust, drawn in light.',
    text: 'This is the lab as it stands today, rendered in code from the same data as its documentation. Scroll to walk through it, layer by layer.',
    tip: 'Click any building for its details', stats: true, focus: 'all' },
  { id: 'remote', rail: 'Remote', cam: [-9, 8.5, -29], look: [-1, 1.2, -10],
    kicker: '01 · Outside the walls',
    title: 'In from anywhere, without opening a door.',
    text: 'The admin laptop and phone reach the lab over a Tailscale WireGuard mesh, with pfSense as the subnet router. Since November 2026 connections are routed, not remade, so every log names the real device that connected.',
    chips: [['WireGuard', '#2dd4bf'], ['real source IP in every log', '#2dd4bf']], focus: ['ADM01'] },
  { id: 'fw', rail: 'Firewall', cam: [-11, 7, -15], look: [0, 1, -4],
    kicker: '02 · One wall',
    title: 'Default deny, on every interface.',
    text: 'pfSense 2.9.0 runs router-on-a-stick: one 802.1Q trunk carries six VLANs to a managed switch. Nothing crosses between networks unless a written rule says it may.',
    chips: [['6 VLANs', '#94a3b8'], ['1 trunk', '#94a3b8'], ['pfSense 2.9.0', '#94a3b8']], focus: 'none' },
  { id: 'hyper', rail: 'Platform', cam: [-22, 9, 9], look: [-12, 0.5, 0],
    kicker: '03 · One hypervisor, many guests',
    title: 'Each guest lands on its own network by tag.',
    text: 'PVE01 runs Proxmox VE on a trunk port. One VLAN-aware bridge places every virtual machine on the right network, and every guest is backed up nightly.',
    chips: [['8 cores', '#7c3aed'], ['32 GB', '#7c3aed'], ['nightly backups', '#7c3aed']], focus: ['PVE01', 'SCAN01', 'KALI01', 'CA01', 'IDP01', 'VAULT01', 'WKS01'] },
  { id: 'tier0', rail: 'Tier 0', cam: [15.5, 7.5, 9], look: [8.8, 0.6, -0.5],
    kicker: '04 · Tier 0: identity and secrets',
    title: 'The keys to the bank, kept together.',
    text: 'DC01 holds the people. CA01 issues the passports. IDP01 signs people and programs in. VAULT01 holds the secrets. Each one proves itself with a certificate from the Biira Bank Root CA.',
    chips: [['LDAPS only', '#3b82f6'], ['own root CA', '#3b82f6'], ['MFA for admins', '#3b82f6']], focus: ['DC01', 'CA01', 'IDP01', 'VAULT01', 'WKS01'] },
  { id: 'detect', rail: 'Detection', cam: [-1, 12, 13], look: [-12.5, 0.5, -1.5],
    kicker: '05 · On the record',
    title: 'Every host reports to one place.',
    text: 'Seven agents ship their events to SIEM01, where Wazuh decodes each one and alerts on the few that matter. SCAN01 runs credentialed scans as an account that holds nothing on the domain.',
    chips: [['7 agents', '#14b8a6'], ['Wazuh 4.14.7', '#14b8a6'], ['credentialed scans', '#14b8a6']], focus: ['SIEM01', 'SCAN01', 'DC01', 'ADM01', 'PVE01', 'WKS01', 'APP01', 'IDP01', 'VAULT01'] },
  { id: 'agent', rail: 'AI agent', cam: [6, 8.5, 12], look: [4.5, 0.6, -0.8],
    kicker: '06 · A machine with its own identity',
    title: 'The AI agent signs in like a person does.',
    text: 'The Ask-my-SIEM agent on APP01 proves who it is to Keycloak and gets a token that lives five minutes. Next, Vault will swap that token for a short-lived Wazuh credential, and the agent stops carrying a password at all.',
    chips: [['5-minute tokens', '#f59e0b'], ['one off switch', '#f59e0b'], ['Vault: next', '#fbbf24']], focus: ['APP01', 'IDP01', 'VAULT01', 'SIEM01'] },
  { id: 'red', rail: 'Contained', cam: [0.5, 8, 11], look: [-4.5, 0.6, -0.5],
    kicker: '07 · The attacker gets a room',
    title: 'Not the house.',
    text: 'KALI01 lives on its own network for attack practice. A written ruleset keeps it away from the domain controller and the firewall admin page, and a test proved it.',
    chips: [['VLAN 30', '#ef4444'], ['containment tested', '#ef4444']], focus: ['KALI01'] },
  { id: 'next', rail: 'Next', side: 'bottom', cam: [0, 27, 25], look: [0, -4, -3],
    kicker: '08 · Still being built',
    title: 'A lab that keeps changing.',
    text: 'Gold dashed shapes are planned, not built: monitoring returns as MON01, automation as ANS01, and Vault starts handing the agent its secrets. When they land, this page redraws from the same data.',
    chips: [['MON01', '#fbbf24'], ['ANS01', '#fbbf24'], ['Vault for the agent', '#fbbf24']], focus: 'planned', explore: true },
];
