// The chapter index shown on each lab case study.
// Every entry points at a real file on the main branch of a PUBLIC repository.
// When a lab repo gains a chapter, add it here; the link checker in
// scripts/check-chapter-links.mjs confirms every URL resolves.

export const GH = 'https://github.com/noble-antwi';

export type ChapterStatus = 'current' | 'progress' | 'planning' | 'earlier' | 'v1';

export const STATUS_LABEL: Record<ChapterStatus, string> = {
  current: 'Current',
  progress: 'In progress',
  planning: 'Planning',
  earlier: 'Earlier build',
  v1: 'Version one',
};

export interface Chapter {
  num: string;
  title: string;
  summary: string;
  repo: string;
  path: string;
  pdf?: boolean;
  /** A folder rather than a file. */
  tree?: boolean;
  status: ChapterStatus;
  note?: string;
}

export interface ChapterGroup {
  title: string;
  note?: string;
  /** Render folded behind a toggle. */
  collapsed?: boolean;
  items: Chapter[];
}

export interface RepoLink {
  name: string;
  role: string;
  summary: string;
  site?: string;
}

export interface ChapterIndex {
  intro: string;
  repos: RepoLink[];
  groups: ChapterGroup[];
}

export const fileUrl = (c: Pick<Chapter, 'repo' | 'path' | 'tree'>) => `${GH}/${c.repo}/${c.tree ? 'tree' : 'blob'}/main/${c.path}`;
export const pdfUrl = (c: Pick<Chapter, 'repo' | 'path'>) => `${GH}/${c.repo}/blob/main/${c.path.replace(/\.md$/, '.pdf')}`;
export const repoUrl = (name: string) => `${GH}/${name}`;

const H = 'enterprise-security-homelab';
const I = 'enterprise-iam-lab';

const REPO_HOMELAB: RepoLink = {
  name: H,
  role: 'The network',
  summary: 'Every chapter of the build in Markdown and PDF, the evidence screenshots, the rule register and the decision records.',
};
const REPO_IAM: RepoLink = {
  name: I,
  role: 'The identity estate',
  summary: 'The organisation profile, the phase guides for Active Directory, Okta and conditional access, and the scripts that built the directory.',
};
const REPO_WEB: RepoLink = {
  name: 'biirabank-web',
  role: 'The public tier',
  summary: 'The bank’s public website: plain HTML and CSS on Cloudflare’s edge, no JavaScript, graded A+ for security headers.',
  site: 'https://biirabank.com',
};

// Chapters from the homelab repo that belong to the identity story too.
const ADR_001: Chapter = {
  num: 'ADR-001',
  title: 'Public domains and forest naming for the rebuild',
  summary: 'Why the forest is corp.biirabank.com rather than the public name, how sign-in suffixes hide it from users, and what the old domain’s retirement costs.',
  repo: H,
  path: 'docs/decisions/ADR-001-domains-and-forest-naming.md',
  status: 'current',
};
const CH_17: Chapter = {
  num: '17',
  title: 'Domain migration to corp.biirabank.com',
  summary: 'Demote and repromote instead of a forest rename, a lockout after the promotion reboot and its recovery, and a directory rebuilt from an export and verified against it.',
  repo: H,
  path: 'docs/17-domain-migration-corp-biirabank.md',
  pdf: true,
  status: 'current',
};
const CH_18: Chapter = {
  num: '18',
  title: 'Public web presence and edge hardening',
  summary: 'Hosting biirabank.com on Cloudflare Workers, a default-hostname bypass found by testing and closed, strict TLS and security headers, and the F to A+ evidence.',
  repo: H,
  path: 'docs/18-public-web-presence-and-edge-hardening.md',
  pdf: true,
  status: 'current',
};

export const CHAPTERS: Record<string, ChapterIndex> = {
  'enterprise-security-homelab': {
    intro: 'Every chapter written so far, in the order a reader would want them. Each one opens on GitHub, where the full runbook, its evidence and a PDF copy live.',
    repos: [REPO_HOMELAB, REPO_WEB, REPO_IAM],
    groups: [
      {
        title: 'Network and platform',
        items: [
          { num: '01', title: 'Network infrastructure and pfSense', summary: 'The six-VLAN design, the managed switch port map, DHCP per segment, outbound NAT and the first firewall aliases.', repo: H, path: 'docs/01-network-infrastructure.md', pdf: true, status: 'current' },
          { num: '10', title: 'Proxmox hypervisor on a trunk port', summary: 'Moving the hypervisor from an access port to a trunk without losing access, and one VLAN-aware bridge that places every guest by tag.', repo: H, path: 'docs/10-proxmox-hypervisor.md', pdf: true, status: 'current' },
          { num: '14', title: 'Storage, backup, capacity and naming', summary: 'The storage layout, nightly backups with a tested restore, a container-versus-VM capacity plan, and the role-based naming scheme.', repo: H, path: 'docs/14-proxmox-storage-backup-capacity.md', pdf: true, status: 'current' },
          { num: '05', title: 'Remote access with Tailscale', summary: 'Reaching every segment without port forwarding behind an ISP-controlled router, and why this replaced the original OpenVPN plan.', repo: H, path: 'docs/05-remote-access.md', pdf: true, status: 'current' },
          { num: 'SSH', title: 'SSH configuration and keys', summary: 'Key management and a client configuration that gives every host a friendly name.', repo: H, path: 'docs/ssh-configuration.md', pdf: true, status: 'current' },
        ],
      },
      {
        title: 'Firewall and segmentation',
        items: [
          { num: '13', title: 'Firewall rulebase governance', summary: 'The principles an auditor checks, a rule register with a justification and control mapping per rule, the change log and the review cadence.', repo: H, path: 'docs/13-firewall-rulebase-governance.md', pdf: true, status: 'progress' },
          { num: '11', title: 'Domain controller firewall access', summary: 'What each Active Directory port does, how pfSense evaluates rules, the aliases that keep them readable, and the target rule layout.', repo: H, path: 'docs/11-domain-controller-firewall.md', pdf: true, status: 'progress' },
        ],
      },
      {
        title: 'Detection, scanning and offence',
        items: [
          { num: '16', title: 'SIEM01: rebuilding the SIEM', summary: 'Recovering from a dead SIEM host, the hardware role swap that improved the design, three agents, and four CIS baselines captured before any hardening.', repo: H, path: 'docs/16-siem01-build.md', pdf: true, status: 'current' },
          { num: '19', title: 'SCAN01: Greenbone and a least-privilege scan identity', summary: 'Rejecting Nessus on its current terms, three build failures recovered without data loss, and a scan identity that is administrator on members and nothing on the domain.', repo: H, path: 'docs/19-vulnerability-scanning-scan01.md', pdf: true, status: 'progress' },
          { num: '15', title: 'KALI01: building and containing the attack host', summary: 'Placing a deliberately hostile machine on the RedTeam segment, the containment test, and an honest account of what that test does not prove.', repo: H, path: 'docs/15-kali-attack-host-build.md', pdf: true, status: 'current' },
          { num: '02', title: 'The first Wazuh deployment', summary: 'The original all-in-one Wazuh build on Rocky Linux and the BlueTeam segment it lived on.', repo: H, path: 'docs/02-security-monitoring.md', pdf: true, status: 'earlier', note: 'That host failed. Chapter 16 is the current SIEM.' },
          { num: '03', title: 'Observability with Grafana and Prometheus', summary: 'The monitoring stack on its own segment, and the inter-VLAN access it needed to see the rest of the lab.', repo: H, path: 'docs/03-observability-stack.md', pdf: true, status: 'earlier', note: 'Its hardware became SIEM01. Being rebuilt as a Proxmox guest.' },
        ],
      },
      {
        title: 'Identity and the public edge',
        items: [ADR_001, CH_17, CH_18],
      },
      {
        title: 'Automation',
        note: 'Written for the first Ansible controller, which is being rebuilt as a Proxmox guest. The account design and role structure carry across.',
        items: [
          { num: '04', title: 'Automation platform', summary: 'The Ansible controller, its inventory, and managing Linux and Windows hosts from one place.', repo: H, path: 'docs/04-automation-platform.md', pdf: true, status: 'earlier' },
          { num: '06', title: 'Ansible service account', summary: 'A dedicated automation identity with key-based access, kept separate from personal administrative accounts.', repo: H, path: 'docs/06-ansible-service-account.md', pdf: true, status: 'current' },
          { num: '07', title: 'Role-based Ansible architecture', summary: 'Breaking monolithic playbooks into reusable roles, with the standards each role follows.', repo: H, path: 'docs/07-ansible-roles-architecture.md', pdf: true, status: 'current' },
          { num: '08', title: 'Windows automation over WinRM', summary: 'Bootstrapping Windows hosts so Ansible can manage them, and the password policy traps along the way.', repo: H, path: 'docs/08-windows-integration.md', pdf: true, status: 'current' },
          { num: '09', title: 'Ansible controller setup', summary: 'Turning a plain Ubuntu VM into the controller: service accounts, static addressing, SSH keys and Windows reachability.', repo: H, path: 'docs/09-ansible-controller-setup.md', pdf: true, status: 'earlier' },
        ],
      },
      {
        title: 'Planning',
        items: [
          { num: '12', title: 'Lab expansion roadmap', summary: 'How the Windows estate grows from one domain controller into something worth attacking and defending, what each machine teaches, and the resource budget.', repo: H, path: 'docs/12-lab-expansion-roadmap.md', pdf: true, status: 'planning' },
        ],
      },
      {
        title: 'Troubleshooting notes',
        collapsed: true,
        note: 'Problems met during the build, what caused them and what fixed them.',
        items: [
          { num: 'T1', title: 'Network infrastructure', summary: 'pfSense and switching problems, and an emergency recovery procedure for losing the network.', repo: H, path: 'troubleshooting/network_infrastructure.md', status: 'current' },
          { num: 'T2', title: 'Remote access', summary: 'Tailscale diagnostics and how to get back in when remote access fails.', repo: H, path: 'troubleshooting/remote_access.md', status: 'current' },
          { num: 'T3', title: 'Ansible automation', summary: 'Configuration, SSH key and playbook failures, with the checks that isolate each one.', repo: H, path: 'troubleshooting/ansible-automation.md', status: 'current' },
          { num: 'T4', title: 'Windows integration', summary: 'WinRM and Windows-side configuration failures when managing Windows from Ansible.', repo: H, path: 'troubleshooting/windows-integration.md', status: 'current' },
          { num: 'T5', title: 'System administration', summary: 'Linux networking, authentication and package problems, and the diagnostic commands that found them.', repo: H, path: 'troubleshooting/system_admin.md', status: 'current' },
        ],
      },
    ],
  },

  'enterprise-iam-lab': {
    intro: 'Every guide written so far, phase by phase. Each one opens on GitHub. The rebuild chapters live in the network repository, because the forest runs on that network.',
    repos: [REPO_IAM, REPO_HOMELAB, REPO_WEB],
    groups: [
      {
        title: 'Start here',
        items: [
          { num: '0', title: 'Biira Bank organisation profile', summary: 'The fictional bank every decision is justified against: its size, its regulators, and the obligations that follow from them.', repo: I, path: 'docs/company-profile/00-company-profile.md', status: 'current' },
          { num: 'PS', title: 'Directory build scripts', summary: 'The nine PowerShell scripts that create the organisational units, groups, tiered administrators and employee accounts, in the order they run. Passwords are prompted for, never stored.', repo: I, path: 'scripts/active-directory', tree: true, status: 'current' },
        ],
      },
      {
        title: 'Version two: the rebuild',
        note: 'The forest moved to corp.biirabank.com in September 2026. These chapters record why and how.',
        items: [ADR_001, CH_17, CH_18],
      },
      {
        title: 'Phase 1 · Foundation',
        note: 'Phases 1 to 5 were written against the retired domain. The structure and configuration carried across to the new forest; the Okta tenant is being rebuilt with Terraform.',
        items: [
          { num: '1.0', title: 'Active Directory and the Okta tenant', summary: 'Domain services on Windows Server 2025, split-brain DNS, and the integrator tenant the cloud half was built on.', repo: I, path: 'docs/guides/phase-1-foundation/00-foundation-summary.md', status: 'v1' },
        ],
      },
      {
        title: 'Phase 2 · Directory structure',
        items: [
          { num: '2.0', title: 'Organisational structure for a bank', summary: 'Twenty organisational units, the security groups Okta syncs, and employee accounts across six departments, mapped to separation-of-duties requirements.', repo: I, path: 'docs/guides/phase-2-ad-structure/00-implementation-summary.md', status: 'current' },
          { num: '2.1', title: 'Tiered administrative accounts', summary: 'Seven administrative accounts across three tiers, hardened so they cannot be delegated, and the built-in Administrator disabled.', repo: I, path: 'docs/guides/phase-2-ad-structure/01-admin-account-implementation.md', status: 'current' },
        ],
      },
      {
        title: 'Phase 3 · Okta integration',
        items: [
          { num: '3.0', title: 'The Okta AD Agent and directory sync', summary: 'Synchronising exactly the employee accounts and groups in scope, and keeping administrative accounts out of the cloud directory.', repo: I, path: 'docs/guides/phase-3-okta-integration/00-implementation-summary.md', status: 'v1' },
          { num: '3.1', title: 'A dedicated sign-in subdomain', summary: 'Moving the Okta custom domain off the primary name so the main domain stays free for the business.', repo: I, path: 'docs/guides/phase-3-okta-integration/01-domain-architecture-optimization.md', status: 'v1' },
          { num: '3.2', title: 'Provisioning with AD as the source of truth', summary: 'Which side owns which data, and the controls on what flows back to the directory.', repo: I, path: 'docs/guides/phase-3-okta-integration/02-advanced-provisioning-configuration.md', status: 'v1' },
          { num: '3.3', title: 'Attribute mapping', summary: 'The business attributes worth syncing, and the conditional logic for handling email addresses.', repo: I, path: 'docs/guides/phase-3-okta-integration/03-attribute-mapping-strategy.md', status: 'v1' },
          { num: '3.4', title: 'User lifecycle and staged import', summary: 'Using Okta’s staged import so nobody gains access until someone decides they should.', repo: I, path: 'docs/guides/phase-3-okta-integration/04-user-lifecycle-management.md', status: 'v1' },
        ],
      },
      {
        title: 'Phase 4 · Applications and groups',
        items: [
          { num: '4.0', title: 'Phase summary', summary: 'From directory sync to identity orchestration: dynamic groups, two application protocols and automated provisioning.', repo: I, path: 'docs/guides/phase-4-advanced-okta/00-implementation-summary.md', status: 'v1' },
          { num: '4.1', title: 'Dynamic groups with Expression Language', summary: 'Group membership driven by a directory attribute, so a change in AD changes application access without a ticket.', repo: I, path: 'docs/guides/phase-4-advanced-okta/01-okta-groups-strategy.md', status: 'v1' },
          { num: '4.2', title: 'SAML 2.0 with Dropbox Business', summary: 'Single sign-on with certificate handling and automated provisioning, assigned by group.', repo: I, path: 'docs/guides/phase-4-advanced-okta/02-application-integration-saml.md', status: 'v1' },
          { num: '4.3', title: 'SWA password vaulting with Box', summary: 'Covering applications without federation support, and the browser plugin problems met on the way.', repo: I, path: 'docs/guides/phase-4-advanced-okta/03-application-integration-swa.md', status: 'v1' },
          { num: '4.4', title: 'Automated provisioning', summary: 'Account creation, updates and deactivation driven by the directory rather than by hand.', repo: I, path: 'docs/guides/phase-4-advanced-okta/04-provisioning-configuration.md', status: 'v1' },
          { num: '4.5', title: 'Testing and validation', summary: 'End-to-end tests with real user scenarios across both protocols and provisioning.', repo: I, path: 'docs/guides/phase-4-advanced-okta/05-testing-validation.md', status: 'v1' },
          { num: '4.6', title: 'Troubleshooting and operations', summary: 'Monitoring, incident procedures and the fixes that keep the integration running.', repo: I, path: 'docs/guides/phase-4-advanced-okta/06-troubleshooting-operations.md', status: 'v1' },
        ],
      },
      {
        title: 'Phase 5 · Conditional access',
        items: [
          { num: '5.0', title: 'Advanced authentication overview', summary: 'The risk-based authentication the regulators ask for, and the five steps planned to deliver it.', repo: I, path: 'docs/guides/phase-5-advanced-security/00-phase-5-overview.md', status: 'progress' },
          { num: '5.1', title: 'Network-based conditional access', summary: 'Three network zones and three policy rules: deny restricted countries, demand stronger MFA on public networks, standard MFA at the office.', repo: I, path: 'docs/guides/phase-5-advanced-security/01-network-zones-implementation.md', status: 'v1' },
        ],
      },
    ],
  },
};
