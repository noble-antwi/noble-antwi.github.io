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
};
