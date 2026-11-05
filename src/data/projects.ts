/* Every public repository worth showing, grouped into the project it
   belongs to. The page fills in language, last push and stars from GitHub
   at build time; the blurbs here are the fallback and the voice. Left out
   on purpose: this site's own repository, the profile README, forks,
   empty placeholders and personal or community repositories. */

export interface Repo { name: string; blurb: string; earlier?: boolean }
export interface ProjectGroup { id: string; title: string; colour: string; blurb: string; repos: Repo[] }

export const PROJECTS: ProjectGroup[] = [
  {
    id: 'biira-bank',
    title: 'Biira Bank, the enterprise lab',
    colour: 'var(--c-identity)',
    blurb: 'One fictional bank, built for real: a segmented network with a SIEM and a scanner, hybrid identity across AD, Okta and Entra, AI agents with their own identities, and the bank\'s public website.',
    repos: [
      { name: 'enterprise-security-homelab', blurb: 'The bank\'s network: Proxmox, pfSense with six VLANs, Active Directory, Wazuh, Greenbone, an enterprise CA and Keycloak, with a runbook for every step.' },
      { name: 'enterprise-iam-lab', blurb: 'Hybrid identity for the bank: a tiered Active Directory federated to Okta and Entra ID over SAML and OIDC, with network-aware conditional access.' },
      { name: 'ai-agent-identity-lab', blurb: 'AI agents as non-human identities: their own accounts, least privilege proven by 403s, secrets filtered before anything leaves the network.' },
      { name: 'biirabank-web', blurb: 'The bank\'s public site on Cloudflare, hardened header by header from an F to an A+.' },
    ],
  },
  {
    id: 'cloud-security',
    title: 'Cloud security on AWS',
    colour: 'var(--c-cloud)',
    blurb: 'Posture, exposure, cost and incident response in AWS: scanners turned into dashboards, findings turned into fixes, and credentials that can be revoked in a hurry.',
    repos: [
      { name: 'cloud-security-posture-dashboard', blurb: 'Prowler and ScoutSuite findings across clouds, gathered into one dashboard and mapped to CIS, NIST and PCI, with remediation as code.' },
      { name: 'aws-security-posture-exposure-mgmt', blurb: 'Security Hub, Inspector and GuardDuty with automated response: exposure analysis, compliance monitoring and remediation playbooks.' },
      { name: 'aws-security-role-invalidation', blurb: 'Revoking IAM role sessions after a credential leak, demonstrated end to end with CloudFormation.' },
      { name: 'cloudguard-ai', blurb: 'AI-assisted threat detection over AWS logs.' },
      { name: 'aws-cost-optimizer', blurb: 'A Python CLI that finds idle EC2, unattached EBS, stale snapshots, unused Elastic IPs and idle RDS before they cost money.' },
      { name: 'cloud-resume-challenge', blurb: 'The Cloud Resume Challenge, stage by stage: a React front end first, then S3 and CloudFront, a serverless counter, infrastructure as code and CI/CD.' },
      { name: 'aws-wordpress-arch-evolution', blurb: 'WordPress grown from one EC2 instance into an elastic, self-healing design with RDS, EFS, Auto Scaling and an ALB.' },
      { name: 'aws_projects', blurb: 'Smaller AWS builds, one service at a time.', earlier: true },
    ],
  },
  {
    id: 'azure',
    title: 'Azure, built twice',
    colour: 'var(--c-cloud)',
    blurb: 'AZ-104 labs, each built by hand in the portal and then again as Bicep, with predictions written down first and something broken on purpose.',
    repos: [
      { name: 'azure-labs', blurb: 'Twenty labs: governance and policy, storage tiers, networking, identity, backup, monitoring and a full environment from one template.' },
      { name: 'azure', blurb: 'The first Azure notes, kept for the record.', earlier: true },
    ],
  },
  {
    id: 'identity',
    title: 'Identity and access',
    colour: 'var(--c-identity)',
    blurb: 'Single sign-on, provisioning and the logs that show who signed in where, plus a tool that watches the IAM job market.',
    repos: [
      { name: 'okta-security-monitoring-dashboard', blurb: 'Okta authentication logs analysed for failed sign-ins, MFA patterns and signs of attack.' },
      { name: 'onelogin-enterprise-sso-configuration', blurb: 'OneLogin SSO for enterprise applications, with automated provisioning.' },
      { name: 'onelogin-sso-integration', blurb: 'The provisioning backend: OneLogin API integration, bulk user operations and admin workflows.' },
      { name: 'iam-job-scout', blurb: 'An automated job board for junior to mid-level IAM roles across the USA.' },
    ],
  },
  {
    id: 'assessments',
    title: 'Assessments and audit',
    colour: 'var(--c-assessment)',
    blurb: 'Security programmes judged from the outside: findings, frameworks and remediation plans written for the people who have to act on them.',
    repos: [
      { name: 'collins-aerospace-audit', blurb: 'A post-incident IT audit: five critical findings, a CMMC Level 3 gap analysis and a remediation plan.' },
      { name: 'cyberdyne-security-assessment', blurb: 'A defence-in-depth assessment and strategy for a 400-person manufacturer.' },
    ],
  },
  {
    id: 'forensics',
    title: 'Forensics and graduate study',
    colour: 'var(--c-offence)',
    blurb: 'Digital evidence, packet analysis and the law around both, from the M.S. in Cybersecurity and Digital Forensics at Illinois Tech and the study around it.',
    repos: [
      { name: 'digital-evidence-itms583', blurb: 'Digital Evidence (ITMS 583): acquisition, analysis and reporting, spring 2026.' },
      { name: 'cyber_forensics', blurb: 'Hands-on forensics projects across platforms and devices.' },
      { name: 'Legal-and-Ethical-Issues-in-IT-ITMM-585-', blurb: 'Legal and ethical issues in IT (ITMM 585).' },
      { name: 'road-to-wireshark', blurb: 'Packet analysis with Wireshark, worked through capture by capture.', earlier: true },
    ],
  },
  {
    id: 'learning',
    title: 'Automation and AI engineering',
    colour: 'var(--c-detection)',
    blurb: 'The tooling underneath the labs: configuration management, and how large language model applications are built and broken.',
    repos: [
      { name: 'llm-engineering', blurb: 'The AI Engineer core track: prompts, retrieval, tools and agents, notebook by notebook.' },
      { name: 'ansible-tutorial', blurb: 'Ansible from first playbook up, on a Vagrant and VirtualBox lab.' },
    ],
  },
];
