export type CertDomain = 'identity' | 'cloudsec' | 'platform' | 'security' | 'native';

export interface Cert {
  id: string;
  title: string;
  issuer: string;
  domain: CertDomain;
  blurb: string;
  featured?: boolean;
  image?: string; // Credly CDN; sized 220x220
  mark?: string; // fallback monogram when there is no badge image
  issued?: string;
  expires?: string;
  credential?: string;
  verify: string;
  verifyLabel: string;
  studyLog?: string;
  short: string; // label for the home strip
}

const credly = (uuid: string, file = 'image.png') => `https://images.credly.com/size/220x220/images/${uuid}/${file}`;

export const DOMAIN_LABELS: Record<CertDomain, string> = {
  identity: 'Identity',
  cloudsec: 'Cloud security',
  platform: 'Cloud platforms',
  security: 'Security foundations',
  native: 'Cloud-native & networking',
};

export const CERTS: Cert[] = [
  {
    id: 'sc-300', title: 'Identity and Access Administrator Associate (SC-300)', issuer: 'Microsoft', domain: 'identity', featured: true, mark: 'MS',
    blurb: 'Entra ID tenants, conditional access, identity governance and entitlement management. Renewed April 2026 with a 92% score.',
    issued: 'Renewed Apr 19, 2026', credential: 'FEC4CC-112274',
    verify: 'https://learn.microsoft.com/api/credentials/share/en-us/nobleantwi/324D5F14A4B47A0F?sharingId=3DD1334494500325', verifyLabel: 'Verify on Microsoft Learn',
    studyLog: '/learning/2026/04/19/sc300-renewal-microsoft-identity-administrator.html', short: 'SC-300',
  },
  {
    id: 'okta-pro', title: 'Okta Certified Professional', issuer: 'Okta', domain: 'identity', featured: true, image: credly('bf6d6f83-f463-4cda-97df-d7973b09ee14', 'blob'),
    blurb: 'Workforce identity fundamentals on Okta: users, groups, applications, SSO and multifactor policy.',
    issued: 'Dec 2025', expires: 'Dec 2027', verify: 'https://www.credly.com/badges/89175d7b-e1de-43e6-8834-77f9c9de80b4/public_url', verifyLabel: 'Verify on Credly',
    studyLog: '/learning/2026/02/22/okta-certification-journey.html', short: 'Okta Professional',
  },
  {
    id: 'okta-admin', title: 'Okta Certified Administrator', issuer: 'Okta', domain: 'identity', featured: true, image: credly('b3484303-d8b9-40a8-88b3-81fbe3aafd19', 'blob'),
    blurb: 'Administering Okta Workforce Identity: lifecycle management, directory integrations, policies and troubleshooting.',
    issued: 'Jan 2026', expires: 'Jan 2028', verify: 'https://www.credly.com/badges/a1cd5c3f-7f0e-4493-8ee6-290e79ba1775/public_url', verifyLabel: 'Verify on Credly', short: 'Okta Administrator',
  },
  {
    id: 'aws-security', title: 'AWS Certified Security – Specialty', issuer: 'Amazon Web Services', domain: 'cloudsec', featured: true, image: credly('53acdae5-d69f-4dda-b650-d02ed7a50dd7'),
    blurb: 'Threat detection, logging, infrastructure protection, IAM and data protection on AWS at specialty depth.',
    verify: 'https://www.credly.com/badges/029b1602-598e-4a3b-b93e-b951f5421f17/public_url', verifyLabel: 'Verify on Credly', short: 'AWS Security Specialty',
  },
  {
    id: 'ccsp', title: 'Certified Cloud Security Professional (CCSP)', issuer: 'ISC2', domain: 'cloudsec', featured: true, image: credly('38b12225-5b48-44e1-8750-20928cc595ea'),
    blurb: 'Cloud architecture, data security, platform and application security, operations, and legal and compliance across the six CCSP domains.',
    issued: 'Sep 2025', expires: 'Sep 2028', verify: 'https://www.credly.com/badges/608cf2cd-a9e5-4d34-a83a-18c712ede34c/public_url', verifyLabel: 'Verify on Credly', short: 'CCSP',
  },
  {
    id: 'gcp-cyber', title: 'Google Cloud Cybersecurity Certificate', issuer: 'Google Cloud', domain: 'cloudsec', image: credly('505080ad-3731-4b1d-98df-347655a45750'),
    blurb: 'Cloud security fundamentals with a Google Cloud focus: IAM, network defence, logging and incident handling.',
    verify: 'https://www.credly.com/badges/cf7c2877-deb1-49de-a3f2-64fbb5f34004/public_url', verifyLabel: 'Verify on Credly', short: 'Google Cloud Cybersecurity',
  },
  {
    id: 'aws-saa', title: 'AWS Certified Solutions Architect – Associate', issuer: 'Amazon Web Services', domain: 'platform', image: credly('0e284c3f-5164-4b21-8660-0d84737941bc'),
    blurb: 'Designing resilient, secure and cost-aware architectures on AWS.',
    verify: 'https://www.credly.com/badges/2f0224e8-66e2-4388-9d9d-98552c7ff73b/public_url', verifyLabel: 'Verify on Credly', short: 'AWS Solutions Architect',
  },
  {
    id: 'aws-sysops', title: 'AWS Certified SysOps Administrator – Associate', issuer: 'Amazon Web Services', domain: 'platform', image: credly('f0d3fbb9-bfa7-4017-9989-7bde8eaf42b1'),
    blurb: 'Deploying, operating and troubleshooting workloads on AWS: monitoring, automation, networking and security controls.',
    verify: 'https://www.credly.com/badges/9c5a0f84-ba05-46d0-b362-b2dde2f785cf/public_url', verifyLabel: 'Verify on Credly', short: 'AWS SysOps',
  },
  {
    id: 'aws-ccp', title: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', domain: 'platform', image: credly('00634f82-b07f-4bbd-a6bb-53de397fc3a6'),
    blurb: 'Foundational AWS services, pricing, and the shared responsibility model.',
    verify: 'https://www.credly.com/badges/57cb2dbd-e02a-443c-9823-e588509d6be0/public_url', verifyLabel: 'Verify on Credly', short: 'AWS Cloud Practitioner',
  },
  {
    id: 'az-900', title: 'Azure Fundamentals (AZ-900)', issuer: 'Microsoft', domain: 'platform', mark: 'MS',
    blurb: 'Cloud concepts, core Azure services, and Azure management and governance. Scored 873 / 1000.',
    issued: 'Apr 19, 2026', credential: '950F3F-VB3714',
    verify: 'https://learn.microsoft.com/api/credentials/share/en-us/nobleantwi/59914E901AC5CF08?sharingId=3DD1334494500325', verifyLabel: 'Verify on Microsoft Learn',
    studyLog: '/learning/2026/04/19/az900-certified-full-journey.html', short: 'AZ-900',
  },
  {
    id: 'dp-900', title: 'Azure Data Fundamentals (DP-900)', issuer: 'Microsoft', domain: 'platform', image: credly('70eb1e3f-d4de-4377-a062-b20fb29594ea', 'azure-data-fundamentals-600x600.png'),
    blurb: 'Core data concepts and how relational, non-relational and analytics workloads are implemented on Azure.',
    verify: 'https://www.credly.com/badges/f1082e80-2124-4f61-9e02-3d049ec7f281/public_url', verifyLabel: 'Verify on Credly', short: 'DP-900',
  },
  {
    id: 'security-plus', title: 'CompTIA Security+ CE', issuer: 'CompTIA', domain: 'security', image: credly('80d8a06a-c384-42bf-ad36-db81bce5adce', 'blob'),
    blurb: 'The baseline: threats, architecture, operations, and governance for a security practitioner.',
    verify: 'https://www.credly.com/badges/5303ff20-2f13-475a-9b19-fb6ec211abb2/public_url', verifyLabel: 'Verify on Credly', short: 'Security+',
  },
  {
    id: 'opswat-icip', title: 'Introduction to Critical Infrastructure Protection (ICIP)', issuer: 'OPSWAT', domain: 'security', image: credly('f9f3c533-9b5a-47eb-8a3e-5734663116c0'),
    blurb: 'Critical infrastructure protection, OT and IT convergence, and the frameworks that govern them.',
    verify: 'https://www.credly.com/badges/6a027495-f4df-4aac-829e-78e6aae4de12/public_url', verifyLabel: 'Verify on Credly', short: 'OPSWAT ICIP',
  },
  {
    id: 'kcna', title: 'KCNA: Kubernetes and Cloud Native Associate', issuer: 'Linux Foundation / CNCF', domain: 'native', image: credly('f28f1d88-428a-47f6-95b5-7da1dd6c1000', 'KCNA_badge.png'),
    blurb: 'Kubernetes fundamentals, container orchestration, cloud-native architecture, observability and application delivery.',
    issued: 'Sep 2025', expires: 'Sep 2027', verify: 'https://www.credly.com/badges/191e0c5f-25fb-4c53-8aaf-c6cf35014f3b/public_url', verifyLabel: 'Verify on Credly', short: 'KCNA',
  },
  {
    id: 'lfs250', title: 'LFS250: Kubernetes and Cloud Native Essentials', issuer: 'Linux Foundation', domain: 'native', image: credly('7404ca0d-98e1-48b6-a2a3-de8d7dcd85b5', 'blob'),
    blurb: "The Linux Foundation's foundation course for the cloud-native ecosystem and Kubernetes.",
    verify: 'https://www.credly.com/badges/dcf6bf4f-0bf6-464c-b407-716df7f25357/public_url', verifyLabel: 'Verify on Credly', short: 'LFS250',
  },
  {
    id: 'mcna', title: 'Multicloud Network Associate', issuer: 'Aviatrix', domain: 'native', image: credly('e3c001fd-161d-433a-a7a4-049556d6112d', 'blob'),
    blurb: 'Networking across AWS, Azure and GCP: VPC and VNet design, transit, and connectivity patterns.',
    verify: 'https://www.credly.com/badges/74f1f416-477f-4e99-8e2a-d07dee0177b4/public_url', verifyLabel: 'Verify on Credly', short: 'Multicloud Network Associate',
  },
  {
    id: 'mcnos', title: 'Multicloud Network Operations Specialty', issuer: 'Aviatrix', domain: 'native', image: credly('b1a3f80b-fa14-44e8-b05a-c02a6ed6d6b6', 'blob'),
    blurb: 'Operating and troubleshooting multicloud networks: visibility, segmentation and day-two operations.',
    verify: 'https://www.credly.com/badges/7af2a2a5-a8a0-4070-9299-c957c398058a/public_url', verifyLabel: 'Verify on Credly', short: 'Multicloud Network Ops',
  },
];

export interface Runway {
  title: string;
  issuer: string;
  mark: string;
  blurb: string;
  progressLabel: string;
  progress: number;
  link?: { href: string; label: string };
}

export const RUNWAY: Runway[] = [
  { title: 'Azure Administrator Associate (AZ-104)', issuer: 'Microsoft', mark: 'MS', progressLabel: 'Prep course', progress: 93,
    blurb: 'Hands-on Azure administration: virtual networks, storage, identity, monitoring and resource management. The natural next step after AZ-900.' },
  { title: 'Security Operations Analyst Associate (SC-200)', issuer: 'Microsoft', mark: 'MS', progressLabel: 'Prep course', progress: 89,
    blurb: 'Microsoft Sentinel and Defender: threat hunting, KQL, incident response and the SOC workflow on the Microsoft stack.' },
  { title: 'Practical SOC Analyst Associate (PSAA)', issuer: 'TCM Security', mark: 'TCM', progressLabel: 'SOC 101 course', progress: 40,
    blurb: 'A hands-on SOC exam: phishing analysis, endpoint and network telemetry, SIEM investigation and reporting.',
    link: { href: '/learning/2026/05/15/psaa-mitre-attack-kill-chain.html', label: 'Training notes' } },
];

export const GOALS = [
  { title: 'CISSP', blurb: 'Security and risk management at the program level.' },
  { title: 'AWS Solutions Architect – Professional', blurb: 'Enterprise-scale AWS design.' },
  { title: 'AWS DevOps Engineer – Professional', blurb: 'CI/CD, IaC and monitoring on AWS.' },
  { title: 'Azure Solutions Architect Expert', blurb: 'Compute, network, storage and security design on Azure.' },
  { title: 'Certified Kubernetes Administrator (CKA)', blurb: 'Cluster operations, networking and troubleshooting.' },
  { title: 'HashiCorp Terraform Associate', blurb: 'Infrastructure as code across providers.' },
];
