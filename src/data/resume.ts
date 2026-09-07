/* The master record. Tailored PDFs are cut from this; the site shows the whole thing.
   Every figure here must be one Noble would repeat in an interview. */

export interface Role {
  title: string;
  org: string;
  location: string;
  start: string;
  end: string;
  current?: boolean;
  bullets: string[];
}

export const SUMMARY =
  'Cloud Security and Identity Engineer with five years across identity governance, Active Directory and Microsoft Entra ID, Okta administration, AWS security and IT risk, in healthcare, retail, fintech, banking and higher education. CCSP, AWS Security Specialty, SC-300, and Okta Certified Professional and Administrator. Builds and documents environments the way a regulated organisation has to.';

export const ROLES: Role[] = [
  {
    title: 'IT Security Specialist',
    org: 'City of Chicago, Department of Aviation',
    location: 'Chicago, IL',
    start: 'Aug 2026',
    end: 'Present',
    current: true,
    bullets: [],
  },
  {
    title: 'Technical Support Specialist',
    org: 'Illinois Institute of Technology',
    location: 'Chicago, IL',
    start: 'Nov 2024',
    end: 'May 2026',
    bullets: [
      'Administered Okta for 8,500+ users: provisioning, deprovisioning, group assignment, SSO and MFA across 12+ integrated campus applications.',
      'Monitored authentication logs and MFA alerts, detecting and escalating 20+ anomalous access events a month to the security team.',
      'Streamlined onboarding and offboarding workflows, reducing account provisioning cycle time by 25%.',
    ],
  },
  {
    title: 'IT Risk Analyst',
    org: 'Wintrust Financial Corporation',
    location: 'Rosemont, IL',
    start: 'May 2025',
    end: 'Aug 2025',
    bullets: [
      'Mapped COBIT 2019 controls to the RCSA framework, improving IT-to-business control alignment by 30% in support of SOX and FFIEC audits.',
      'Automated Technology Risk Profile validation in Python, cutting manual effort by 60% and improving audit traceability.',
      'Built Power BI dashboards for user access reviews and patch compliance, reducing risk reporting time by 40%.',
    ],
  },
  {
    title: 'Cloud Security Engineer',
    org: 'Hubtel',
    location: 'Accra, Ghana',
    start: 'Jan 2024',
    end: 'Dec 2024',
    bullets: [
      'Monitored IAM roles and permissions across AWS accounts, enforcing least privilege and flagging excessive entitlements across 200+ cloud assets.',
      'Analysed CloudWatch, GuardDuty and Graylog alerts during incident response, implementing corrective actions that reduced mean time to resolution by 30%.',
      'Hardened S3 bucket policies, security groups, KMS key management and encryption controls against AWS security baselines.',
    ],
  },
  {
    title: 'Cloud Engineer',
    org: 'Hubtel',
    location: 'Accra, Ghana',
    start: 'Nov 2022',
    end: 'Dec 2023',
    bullets: [
      'Provisioned and patched 20+ EC2 instances across regions, applying security groups and NACLs; troubleshot VPC, subnet and VPN connectivity.',
      'Built CloudWatch, New Relic and Nagios dashboards for EC2 and network metrics, supporting 99.5% production uptime.',
      'Configured AWS Backup and S3 lifecycle policies, reducing recovery time by 35% for production workloads.',
    ],
  },
  {
    title: 'Identity and Access Management Analyst',
    org: 'Adidas AG, via HWS-Gruppe',
    location: 'Neustadt, Germany',
    start: 'Nov 2021',
    end: 'Oct 2022',
    bullets: [
      'Administered Active Directory and Microsoft Entra ID in a global estate serving 50,000+ adidas employees: provisioning, group policy and access audits.',
      'Enforced RBAC, least privilege and Conditional Access, reducing over-privileged accounts by 20% through quarterly access reviews.',
      'Managed the service-account lifecycle for non-human identities across Windows and cloud environments.',
      'Automated provisioning workflows in PowerShell, cutting manual onboarding effort by 30%.',
    ],
  },
  {
    title: 'Cybersecurity Analyst',
    org: 'Ghana Health Service',
    location: 'Kpando, Ghana',
    start: 'Oct 2020',
    end: 'Oct 2021',
    bullets: [
      'Administered Active Directory and Windows Server for a healthcare environment of 500+ clinical staff and 200+ endpoints.',
      'Monitored security and system logs, remediated incidents and documented root cause for the IT security team.',
      'Ran vulnerability scans on critical servers and applications, remediating gaps within compliance timelines and maintaining 95% patch compliance.',
    ],
  },
];

export const EDUCATION = [
  { degree: 'M.S. Cyber Security and Forensics', school: 'Illinois Institute of Technology', location: 'Chicago, IL', note: 'In progress' },
  { degree: 'B.Sc. Computer Science and Engineering', school: 'University of Mines and Technology', location: 'Tarkwa, Ghana' },
];

export const SKILLS: { group: string; items: string }[] = [
  { group: 'Identity & access', items: 'Active Directory, Microsoft Entra ID, Okta, Conditional Access, MFA, SSO (SAML, OIDC), RBAC, PIM, identity governance, service-account lifecycle' },
  { group: 'Cloud security', items: 'AWS (IAM, CloudTrail, GuardDuty, KMS, Config, Secrets Manager), Azure, Google Cloud, Terraform, CloudFormation' },
  { group: 'Detection & monitoring', items: 'Microsoft Sentinel, Splunk, Wazuh, Graylog, CloudWatch, New Relic, Suricata, Snort' },
  { group: 'Risk & compliance', items: 'NIST CSF and SP 800-53, COBIT 2019, Zero Trust, SOX, FFIEC, PCI DSS, SOC 2, ISO 27001' },
  { group: 'Automation', items: 'Python, PowerShell, Bash, GitHub Actions, Docker, Kubernetes (KCNA)' },
];

export const PROJECTS = [
  { title: 'Enterprise IAM Lab: Hybrid Identity', href: '/work/enterprise-iam-lab/', blurb: 'Active Directory federated to Okta and Entra ID for a fictional regulated bank: tiered admin model, SAML/OIDC/SWA, network-aware conditional access.' },
  { title: 'Enterprise Security Homelab', href: '/work/enterprise-security-homelab/', blurb: 'Six-VLAN default-deny network on pfSense and Proxmox with a Windows Server 2025 domain and Wazuh; every rule justified and mapped to NIST.' },
  { title: 'Cloud Security Posture Dashboard', href: '/work/cloud-security-posture-dashboard/', blurb: 'Terraform-deployed misconfigurations scanned by Prowler and ScoutSuite, 500+ checks normalised into one schema with remediation.' },
];
