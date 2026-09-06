export interface Article {
  title: string;
  outlet: string;
  date: string;
  topics: string;
  href: string;
  cat: 'aws' | 'threat';
}

export const ARTICLES: Article[] = [
  { title: 'Why Cloud Security Is No Longer Optional for Growing Businesses', outlet: 'AWS in Plain English', date: 'Jul 8, 2025', topics: 'Cloud security, AWS, best practices', cat: 'aws', href: 'https://aws.plainenglish.io/why-cloud-security-is-no-longer-optional-for-growing-businesses-812f04a708cb' },
  { title: 'Using Service Control Policies (SCPs) to Restrict AWS Account Access: A Hands-On Guide', outlet: 'AWS in Plain English', date: 'Apr 16, 2025', topics: 'AWS Organizations, SCPs, IAM', cat: 'aws', href: 'https://aws.plainenglish.io/using-service-control-policies-scps-to-restrict-aws-account-access-a-hands-on-guide-f818be31c88f' },
  { title: 'Building an AWS Multi-Account Structure with AWS Organizations', outlet: 'Medium', date: 'Apr 15, 2025', topics: 'AWS Organizations, multi-account, governance', cat: 'aws', href: 'https://medium.com/@noble-antwi/building-an-aws-multi-account-structure-with-aws-organizations-hands-on-guide-e09a0f0d2bf6' },
  { title: 'GuardDuty Runtime Monitoring for EC2: A Hands-On Guide with Troubleshooting', outlet: 'Medium', date: 'Feb 27, 2025', topics: 'GuardDuty, EC2, threat detection', cat: 'aws', href: 'https://medium.com/@noble-antwi/guardduty-runtime-monitoring-for-ec2-a-hands-on-guide-with-troubleshooting-3d4976cb4158' },
  { title: 'Implementing Envelope Encryption with AWS KMS: A Step-by-Step Guide', outlet: 'Medium', date: 'Feb 16, 2025', topics: 'KMS, encryption, data security', cat: 'aws', href: 'https://medium.com/@noble-antwi/implementing-envelope-encryption-with-aws-kms-a-step-by-step-guide-91fda46879c4' },
  { title: 'Data Loss Prevention in the Cloud: A Comprehensive Guide with a Focus on AWS', outlet: 'AWS in Plain English', date: '2025', topics: 'Data protection, DLP, compliance', cat: 'aws', href: 'https://aws.plainenglish.io/data-loss-prevention-in-the-cloud-a-comprehensive-guide-with-a-focus-on-aws-d49e37f31b39' },
  { title: 'Digital Deception: Dissecting a Phishing Email and Its Malicious Payload', outlet: 'Medium', date: 'Jan 13, 2025', topics: 'Phishing, malware analysis, threat intel', cat: 'threat', href: 'https://medium.com/@noble-antwi/digital-deception-dissecting-a-phishing-email-and-its-malicious-payload-e1eb61985a0a' },
  { title: 'Advanced Techniques in Email Header Analysis for Phishing Detection', outlet: 'Medium', date: 'Jan 13, 2025', topics: 'Email forensics, header analysis, detection', cat: 'threat', href: 'https://medium.com/@noble-antwi/advanced-techniques-in-email-header-analysis-for-phishing-detection-c5567f1caa00' },
  { title: 'Phishing Detection and Mitigation in Practice: The Mighty Solutions, Inc. Case', outlet: 'Medium', date: 'Jan 10, 2025', topics: 'Incident response, mitigation, case study', cat: 'threat', href: 'https://medium.com/@noble-antwi/phishing-attack-detection-and-response-a-case-study-of-mighty-solutions-inc-c8c302fea859' },
  { title: 'Microsoft Security Updates: Critical Fixes and Zero-Day Vulnerabilities', outlet: 'Medium', date: 'Jan 2025', topics: 'Security updates, vulnerabilities, patch management', cat: 'threat', href: 'https://medium.com/@noble-antwi/microsoft-security-updates-critical-fixes-and-zero-day-vulnerabilities-5398b24aa041' },
  { title: 'Launching an EC2 Linux Hands-On Lab', outlet: 'Medium', date: '2025', topics: 'EC2, Linux, hands-on lab', cat: 'aws', href: 'https://medium.com/@noble-antwi/launching-an-ec2-linux-hands-on-lab-94a1a6d6d49b' },
];
