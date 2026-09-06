export type CourseState = 'done' | 'active' | 'planned';

export interface Course {
  title: string;
  platform: string;
  instructor?: string;
  note?: string;
  state: CourseState;
  progress?: number;
  link?: string;
  linkLabel?: string;
}

export const COURSES: Course[] = [
  { title: 'Certificate of Cloud Security Knowledge (CCSK) v4', platform: 'Udemy', instructor: 'Anthony Sequeira', note: 'Completed Aug 26, 2024 · cloud governance, IAM, CCM, data security', state: 'done', progress: 100, link: 'https://www.udemy.com/certificate/UC-504e5f95-94b6-428c-9a4d-556e23b7af98/', linkLabel: 'Certificate' },
  { title: 'New Relic One: Observability from Beginner to Advanced', platform: 'Udemy', instructor: 'Aref K.', note: 'Completed Jan 15, 2024 · APM, alerting, incident management', state: 'done', progress: 100, link: 'https://www.udemy.com/certificate/UC-171f7b71-5b26-4d1a-8335-d0d2b12dbe25/', linkLabel: 'Certificate' },
  { title: 'Google Data Analytics Professional Certificate', platform: 'Coursera', note: 'Completed Jul 31, 2021 · SQL, R, visualisation, data ethics', state: 'done', progress: 100, link: 'https://www.credly.com/badges/b458cd5b-b837-4b9d-8789-851fe2d0b040/public_url', linkLabel: 'Credential' },
  { title: 'Google IT Support Professional Certificate', platform: 'Coursera', note: 'Completed Mar 9, 2021 · networking, sysadmin, troubleshooting, security', state: 'done', progress: 100, link: 'https://www.credly.com/badges/ef9df520-5176-4324-be84-5a7ef222d19c/public_url', linkLabel: 'Credential' },

  { title: 'AZ-104 Microsoft Azure Administrator (with simulations)', platform: 'Udemy', instructor: 'John Christopher', note: 'Target: Azure Administrator Associate', state: 'active', progress: 93 },
  { title: 'SC-200 Microsoft Security Operations Analyst (with SIMS)', platform: 'Udemy', instructor: 'John Christopher', note: 'Target: Security Operations Analyst Associate', state: 'active', progress: 89 },
  { title: 'Getting Started with Wireshark: The Ultimate Hands-On Course', platform: 'Udemy', instructor: 'Chris Greer', note: 'Packet analysis and troubleshooting', state: 'active', progress: 75 },
  { title: 'Detection Engineering Masterclass, Part 1', platform: 'Udemy', instructor: 'Anthony Isherwood', note: 'Detection engineering and security monitoring', state: 'active', progress: 58 },
  { title: 'Grafana Monitoring', platform: 'Udemy', instructor: 'Sean Bradley', note: 'Monitoring and observability', state: 'active', progress: 45 },
  { title: 'Security Operations (SOC) 101', platform: 'TCM Security', instructor: 'Andrew Prince', note: 'Target: Practical SOC Analyst Associate (PSAA)', state: 'active', progress: 40 },
  { title: 'CRISC: Certified in Risk and Information Systems Control', platform: 'Udemy', instructor: 'Stone River eLearning', state: 'active', progress: 40 },
  { title: 'Kubernetes for Absolute Beginners', platform: 'Udemy', instructor: 'KodeKloud', state: 'active', progress: 35 },
  { title: 'DevOps Beginners to Advanced with Projects', platform: 'Udemy', instructor: 'Imran Teli', state: 'active', progress: 25 },
  { title: 'Prepare for the (ISC)² CCSP Exam: All Six Domains', platform: 'Udemy', instructor: 'Gwen Bettwy', state: 'active', progress: 5 },
  { title: 'Microsoft Sentinel Course with Hands-On SIMS', platform: 'Udemy', instructor: 'John Christopher', state: 'active', progress: 5 },
  { title: 'pfSense 2.4.4 Open Source Firewall', platform: 'Udemy', instructor: 'Stone River eLearning', state: 'active', progress: 3 },
  { title: 'HashiCorp Certified: Terraform Associate', platform: 'Udemy', instructor: 'Bryan Krausen', state: 'active', progress: 2 },
  { title: 'The Complete Cybersecurity Course: End Point Protection', platform: 'Udemy', instructor: 'Nathan House', state: 'active', progress: 2 },

  { title: 'Certified Kubernetes Administrator (CKA) with Practice Tests', platform: 'Udemy', instructor: 'KodeKloud', state: 'planned' },
  { title: 'Microsoft Sentinel & Microsoft Defender for Cloud', platform: 'Udemy', instructor: 'Christopher Net', state: 'planned' },
  { title: 'Master Cisco CCNA 200-301: Comprehensive All-in-One Course', platform: 'Udemy', instructor: 'Jeremy McDowell', state: 'planned' },
  { title: 'Nmap for Ethical Hackers: Ultimate Hands-On Course', platform: 'Udemy', instructor: 'David Greer', state: 'planned' },
  { title: 'AKYLADE AI Security Foundation: Full Course & Practice Exam', platform: 'Udemy', instructor: 'Jason Dion', state: 'planned' },
  { title: 'Complete Linux Training Course', platform: 'Udemy', instructor: 'Imran Afzal', state: 'planned' },
];
