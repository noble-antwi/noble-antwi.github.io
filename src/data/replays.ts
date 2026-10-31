/* Replays on the case-study pages: one request, or one piece of work,
   followed hop by hop through the system it belongs to. Every hop names
   something that is actually built and described on that page. */

export type Tone = 'pass' | 'block' | 'alert' | 'quiet' | 'info';

export interface Hop {
  node: string;
  zone?: string;
  log: string;
  tone?: Tone;
}

export interface Scenario {
  label: string;
  hops: Hop[];
  outcome: { tone: Tone; text: string };
}

export interface Replay {
  title: string;
  scenarios: Scenario[];
}

export const REPLAYS: Record<string, Replay> = {
  'enterprise-security-homelab': {
    title: 'Follow a request through the bank.',
    scenarios: [
      {
        label: 'The scanner, as designed',
        hops: [
          { node: 'SCAN01', zone: 'VLAN 20', log: 'Greenbone starts a credentialed scan of WKS01 as svc-greenbone.' },
          { node: 'pfSense', zone: 'gateway', log: 'The packet leaves VLAN 20 for VLAN 50. Crossing a segment is always a firewall decision.' },
          { node: 'WKS01', zone: 'VLAN 50', log: 'Network logon accepted. The account is a local administrator here through one group and one Group Policy, linked to the member OUs only.' },
          { node: 'Wazuh agent', zone: 'on WKS01', log: 'The sign-in event ships to SIEM01.' },
          { node: 'SIEM01', zone: 'VLAN 20', log: 'Rule 100020 matches: the scan account, from SCAN01. Level 0, no alert.', tone: 'quiet' },
        ],
        outcome: { tone: 'quiet', text: 'Silent by design, and still on the record: archives keep every event a tuned rule hides.' },
      },
      {
        label: 'The scan account, anywhere else',
        hops: [
          { node: 'Unknown host', log: 'Someone signs in as svc-greenbone, but not from SCAN01.' },
          { node: 'WKS01', zone: 'VLAN 50', log: 'The sign-in is recorded. Interactive and Remote Desktop logons are denied to this account outright.' },
          { node: 'Wazuh agent', zone: 'on WKS01', log: 'The event ships to SIEM01.' },
          { node: 'SIEM01', zone: 'VLAN 20', log: 'Rule 100021: the scan account from anywhere but the scanner. Level 12.', tone: 'alert' },
        ],
        outcome: { tone: 'alert', text: 'The same account that is silent from SCAN01 is a level 12 alert from anywhere else.' },
      },
      {
        label: 'The attack host tries to leave',
        hops: [
          { node: 'KALI01', zone: 'VLAN 30', log: 'The attack host tries to reach the domain controller.' },
          { node: 'pfSense', zone: 'REDTEAM', log: 'Default deny on the REDTEAM interface. No standing path to any other segment.', tone: 'block' },
        ],
        outcome: { tone: 'block', text: 'Dropped at the gateway. Containment is proven by a test run from KALI01 itself.' },
      },
      {
        label: 'A forged token at the front door',
        hops: [
          { node: 'Attacker', log: 'A token arrives at Stock Copilot signed with alg: none.' },
          { node: 'APP01', zone: 'VLAN 40', log: 'The app refuses it and writes an audit event to its identity log.' },
          { node: 'Wazuh agent', zone: '005', log: 'The identity log, not the operating system, ships to SIEM01.' },
          { node: 'SIEM01', zone: 'VLAN 20', log: 'Rule 100411: unsigned token. Level 12, mapped to MITRE ATT&CK.', tone: 'alert' },
        ],
        outcome: { tone: 'alert', text: 'Refused by the app, and seen by the SIEM. One of thirty rules written for this log.' },
      },
      {
        label: 'A directory sign-in, verified',
        hops: [
          { node: 'Client', zone: 'outside the domain', log: 'An application asks DC01 for directory data, with a password to send.' },
          { node: 'DC01', zone: 'LDAPS 636', log: 'Presents its certificate: DC01.corp.biirabank.com, issued by Biira Bank Root CA.' },
          { node: 'Root CA', zone: 'CA01', log: 'The client follows the signature up to a root it holds, whose SHA-256 fingerprint was checked before it was trusted.', tone: 'pass' },
          { node: 'Name check', log: 'The name dialled matches the name on the certificate. Verification: OK.', tone: 'pass' },
          { node: 'TLS 1.3', zone: 'X25519', log: 'Only now does the password cross the network, encrypted to the right server.', tone: 'pass' },
        ],
        outcome: { tone: 'pass', text: 'Encrypted, and to the right server. The private key behind it was made on DC01 and has never left it.' },
      },
      {
        label: 'The same sign-in, without the root',
        hops: [
          { node: 'Client', zone: 'no root CA', log: 'The same connection, from a machine that was never given the root.' },
          { node: 'DC01', zone: 'LDAPS 636', log: 'The certificate arrives, signed by a CA this client has never heard of.' },
          { node: 'Client', zone: 'error 20', log: 'Unable to get local issuer certificate. A real client stops here.', tone: 'block' },
        ],
        outcome: { tone: 'block', text: 'Encryption without verification protects against eavesdroppers, not impostors. So it stops.' },
      },
    ],
  },

  'enterprise-iam-lab': {
    title: 'Follow one sign-in through the policy.',
    scenarios: [
      {
        label: 'From the office',
        hops: [
          { node: 'Employee', zone: 'corporate network', log: 'A teller opens Dropbox from a branch workstation.' },
          { node: 'Okta', zone: 'network zones', log: 'The source address falls in the corporate IP zone.' },
          { node: 'Policy', zone: 'rule 3', log: 'Rules 1 and 2 do not match. Rule 3, corporate network: standard MFA.', tone: 'pass' },
          { node: 'Dropbox', zone: 'SAML 2.0', log: 'A signed assertion lands. Access follows the group, not the person.', tone: 'pass' },
        ],
        outcome: { tone: 'pass', text: 'In, with ordinary MFA. Nobody is punished for being at work.' },
      },
      {
        label: 'From a café',
        hops: [
          { node: 'Employee', zone: 'public Wi-Fi', log: 'The same teller, same app, from a coffee shop.' },
          { node: 'Okta', zone: 'network zones', log: 'Not the corporate zone, not a restricted country.' },
          { node: 'Policy', zone: 'rule 2', log: 'Rule 2, public network: hardware-protected MFA.', tone: 'pass' },
          { node: 'Dropbox', zone: 'SAML 2.0', log: 'In, after a stronger proof.', tone: 'pass' },
        ],
        outcome: { tone: 'pass', text: 'Where you are changes what you must prove.' },
      },
      {
        label: 'From a restricted country',
        hops: [
          { node: 'Sign-in', zone: 'abroad', log: 'A sign-in arrives from a country the bank does not operate in.' },
          { node: 'Okta', zone: 'dynamic zone', log: 'The geographic zone matches.' },
          { node: 'Policy', zone: 'rule 1', log: 'Rule 1, restricted countries: deny. Evaluated first, so nothing else gets a say.', tone: 'block' },
        ],
        outcome: { tone: 'block', text: 'Denied before a password is ever checked. A BSA/AML geographic control, as a first-class rule.' },
      },
    ],
  },

  'biirabank-web': {
    title: 'Follow a visitor to the bank’s front page.',
    scenarios: [
      {
        label: 'A normal visit',
        hops: [
          { node: 'Browser', log: 'A visitor types biirabank.com.' },
          { node: 'Cloudflare', zone: 'edge', log: 'Plain HTTP is redirected. The handshake must be TLS 1.2 or better.', tone: 'pass' },
          { node: 'Worker', zone: 'static assets', log: 'Plain HTML and CSS. No framework, no JavaScript.' },
          { node: 'Headers', zone: 'one rule', log: 'HSTS for a year, and a Content Security Policy with no script source at all.', tone: 'pass' },
          { node: 'Browser', log: 'The page renders. Even an injected script would have nowhere to run.', tone: 'pass' },
        ],
        outcome: { tone: 'pass', text: 'Graded A+ by an independent header checker, up from F.' },
      },
      {
        label: 'An old handshake',
        hops: [
          { node: 'Old client', log: 'A client offers TLS 1.0.' },
          { node: 'Cloudflare', zone: 'edge', log: 'Minimum TLS is 1.2. Refused, and confirmed by trying each version.', tone: 'block' },
        ],
        outcome: { tone: 'block', text: 'No downgrade. The floor is tested, not just set.' },
      },
      {
        label: 'The side door',
        hops: [
          { node: 'Visitor', log: 'Someone asks for the site on its default workers.dev hostname.' },
          { node: 'Cloudflare', zone: 'workers.dev', log: 'Testing found this name still answering, with none of the zone’s controls. It has been disabled.', tone: 'block' },
        ],
        outcome: { tone: 'block', text: 'Found by testing rather than by reading the dashboard, and closed.' },
      },
    ],
  },

  'cloud-security-posture-dashboard': {
    title: 'Follow a misconfiguration from creation to fix.',
    scenarios: [
      {
        label: 'One bad bucket',
        hops: [
          { node: 'Terraform', log: 'Deploys an S3 bucket with encryption off and public access allowed, on purpose.' },
          { node: 'AWS', zone: 'S3', log: 'The bucket exists, and is wrong.' },
          { node: 'Prowler', zone: '500+ checks', log: 'Flags it: no default encryption, public access not blocked.', tone: 'alert' },
          { node: 'Normaliser', zone: 'Python', log: 'Rewrites the finding into one schema shared with ScoutSuite’s Azure results.' },
          { node: 'Dashboard', zone: 'Flask', log: 'Shows severity, the CIS and PCI mapping, and the AWS CLI command that fixes it.' },
          { node: 'Remediation', zone: 'dry run first', log: 'The fix is rehearsed before it is applied.', tone: 'pass' },
        ],
        outcome: { tone: 'pass', text: 'From a deliberate mistake to a mapped, fixable finding, without a spreadsheet in between.' },
      },
    ],
  },

  'aws-cost-optimizer': {
    title: 'Follow one scan through an account.',
    scenarios: [
      {
        label: 'A forgotten database',
        hops: [
          { node: 'CLI', log: 'Pointed at an AWS profile whose policy is Describe, List and Get only.' },
          { node: 'Regions', zone: 'in parallel', log: 'Every region is scanned at once.' },
          { node: 'CloudWatch', zone: '7 days', log: 'An RDS instance: CPU under 5% and under one connection, across seven days.', tone: 'alert' },
          { node: 'Thresholds', zone: 'config.yaml', log: '"Idle" means what the organisation says it means. This one qualifies.' },
          { node: 'Report', zone: 'JSON · CSV · HTML', log: 'The waste is written up with a monthly and an annual figure attached.', tone: 'pass' },
        ],
        outcome: { tone: 'quiet', text: 'Nothing was stopped or deleted. The tool cannot; a person decides, with the evidence.' },
      },
    ],
  },

  'iam-job-scout': {
    title: 'Follow one job posting into the board.',
    scenarios: [
      {
        label: 'A posting, three times over',
        hops: [
          { node: 'Scheduler', zone: 'Mon · Wed · Sat', log: 'APScheduler starts a scan.' },
          { node: 'Three APIs', zone: 'JSearch · Adzuna · RemoteOK', log: 'The same IAM analyst role comes back from all three.' },
          { node: 'Dedupe', zone: 'fuzzy match', log: 'Three listings, one job. Two are dropped.', tone: 'quiet' },
          { node: 'Filter', zone: 'title rules', log: 'Not senior, principal or lead; mentions Okta and SAML. It stays.', tone: 'pass' },
          { node: 'FastAPI', zone: 'board', log: 'Listed, searchable, and gone after thirty days.' },
          { node: 'Prometheus', zone: '→ Grafana', log: 'Each scan is exported as metrics for the Grafana dashboard.' },
        ],
        outcome: { tone: 'pass', text: 'One clean listing for someone at the start of an identity career.' },
      },
    ],
  },

  'ai-agent-identity-lab': {
    title: 'Follow one question through the agent.',
    scenarios: [
      {
        label: 'A plain question',
        hops: [
          { node: 'You', log: 'Is anything unusual happening on WKS01 in the last 24 hours?' },
          { node: 'Claude', zone: 'model provider', log: 'Asks for search_wazuh_alerts with two blanks filled: WKS01, 24 hours. It cannot run anything itself.' },
          { node: 'agent.py', zone: 'the laptop', log: 'Checks the blanks, clamps the window, and runs the fixed query. Round 1 of at most 8.' },
          { node: 'SIEM01', zone: 'via SSH tunnel', log: 'Searched as svc-ask-siem, read on alerts only, over a certificate-checked connection.', tone: 'pass' },
          { node: 'redact.py', zone: 'what leaves', log: 'Named fields only; command lines stripped of secrets and cut to 300 characters.', tone: 'quiet' },
          { node: 'Claude', zone: 'round 2', log: 'Writes the answer, citing rule and time for every claim, and changes nothing.', tone: 'pass' },
        ],
        outcome: { tone: 'pass', text: 'An answer grounded in real alerts, ending with what a human should check.' },
      },
      {
        label: 'Reaching for the archive',
        hops: [
          { node: 'svc-ask-siem', log: 'The same account asks for wazuh-archives-*, the store of every raw event.' },
          { node: 'SIEM01', zone: 'role check', log: 'Role agent-read-alerts: read on wazuh-alerts-* only. 403.', tone: 'block' },
        ],
        outcome: { tone: 'block', text: 'Refused by the role, not by the agent being polite. It holds whoever, or whatever, has the password.' },
      },
      {
        label: 'Who is 192.168.20.3?',
        hops: [
          { node: 'Claude', log: 'Asks lookup_host for the address in the alerts.' },
          { node: 'Inventory', zone: 'assets.json', log: 'SCAN01, the Greenbone scanner on the BlueTeam VLAN. Not domain-joined.' },
          { node: 'DC01', zone: 'LDAPS 636', log: 'lookup_account for svc-greenbone, as svc-ask-siem: allow-listed attributes only.', tone: 'pass' },
          { node: 'Claude', log: 'Names the scanner, its account and its job, and keeps what the inventory says apart from what AD says.', tone: 'pass' },
        ],
        outcome: { tone: 'pass', text: 'Context from two sources, each named. AD stores no IP addresses, so identity and asset data come from different places.' },
      },
      {
        label: 'One wildcard',
        hops: [
          { node: 'Claude', log: 'Asks lookup_account for the account name *.' },
          { node: 'directory.py', zone: 'input check', log: 'Not a valid account name. An unescaped * would match every account in the domain.', tone: 'block' },
        ],
        outcome: { tone: 'block', text: 'Refused before any search runs. LDAP injection stops at the pattern check.' },
      },
    ],
  },

  'azure-labs': {
    title: 'Follow four requests through the rules.',
    scenarios: [
      {
        label: 'Untagged, but rescued',
        hops: [
          { node: 'Request', log: 'Create a virtual network with no tags.' },
          { node: 'P1', zone: 'Modify', log: 'Adds costCenter, inherited from the resource group.', tone: 'pass' },
          { node: 'P2', zone: 'Deny', log: 'Checks for costCenter, and finds the one P1 just added.', tone: 'pass' },
          { node: 'ARM', zone: 'Activity log', log: 'Records the order on the request: Modify, then the deny check.' },
        ],
        outcome: { tone: 'pass', text: 'Created. Modify runs before Deny, so the rule that adds wins.' },
      },
      {
        label: 'The control test',
        hops: [
          { node: 'P1', zone: 'Do not enforce', log: 'Switched off, nothing else changed.' },
          { node: 'Request', log: 'The same untagged network.' },
          { node: 'P2', zone: 'Deny', log: 'No costCenter. RequestDisallowedByPolicy.', tone: 'block' },
        ],
        outcome: { tone: 'block', text: 'Refused. Proven both ways, so the first result was the order of evaluation, not luck.' },
      },
      {
        label: 'A fix that gets refused',
        hops: [
          { node: 'Remediation', zone: 'P1', log: 'A task sets out to add costCenter to a network that predates the rules.' },
          { node: 'Update', log: 'It does that by sending an ordinary update.' },
          { node: 'P3', zone: 'Deny', log: 'The network has no owner tag, so the update is refused. PolicyRemediationFailure.', tone: 'block' },
        ],
        outcome: { tone: 'block', text: 'A remediation is just another update, and every Deny rule still checks it.' },
      },
      {
        label: 'Delete under a lock',
        hops: [
          { node: 'Owner', zone: 'full rights', log: 'Deletes a network in the locked resource group.' },
          { node: 'Lock', zone: 'CanNotDelete', log: 'Refused, whatever the role.', tone: 'block' },
        ],
        outcome: { tone: 'block', text: 'A lock beats permissions. It stops deletion and nothing else.' },
      },
    ],
  },
};
