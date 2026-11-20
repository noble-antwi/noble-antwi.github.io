/* The twenty Azure labs, in order. One row per lab drives the lab index on
   the case study: the progress strip, the cards and the roadmap. When a lab
   changes state, change its row here and add its section to
   src/content/work/azure-labs.md. Never put an identifier or a secret here. */

export type LabState = 'built' | 'running' | 'planned';
export type LabGroup = 'Foundations' | 'Composition' | 'Applied';

export interface AzureLab {
  n: number;
  /** Folder in the azure-labs repository. */
  folder: string;
  title: string;
  group: LabGroup;
  state: LabState;
  /** The question the lab set out to answer. Built and running labs only. */
  asks?: string;
  /** What it found, in one sentence. Built labs only. */
  found?: string;
  /** One number worth remembering. */
  stat?: { value: string; label: string };
}

export const AZURE_LABS_REPO = 'https://github.com/noble-antwi/az-104-labs/tree/master/';

export const AZURE_LABS: AzureLab[] = [
  {
    n: 1, folder: '01-governance-tagging', title: 'Governance and tagging', group: 'Foundations', state: 'built',
    asks: 'If one policy adds a tag and another denies resources missing it, which wins?',
    found: 'Modify runs before Deny, and a remediation is an ordinary update, so every Deny rule still checks it.',
    stat: { value: '4', label: 'policy rules tested to failure' },
  },
  {
    n: 2, folder: '02-storage-tiers', title: 'Storage tiers', group: 'Foundations', state: 'built',
    asks: 'What do the four Blob Storage tiers really cost, and what does it take to get a file back from Archive?',
    found: 'Keeping cost nothing measurable. One urgent read and the alerting made up almost the whole bill.',
    stat: { value: '$0.012', label: 'the whole bill, read by meter' },
  },
  {
    n: 3, folder: '03-vm-deep-dive', title: 'A virtual machine, taken apart', group: 'Foundations', state: 'built',
    asks: 'Is shutting down inside the OS the same as stopping the VM in Azure?',
    found: 'No. A stopped VM is not a free VM until Azure says deallocated, and the disk and public IP bill either way.',
    stat: { value: '7', label: 'resources behind one VM' },
  },
  {
    n: 4, folder: '04-custom-rbac-role', title: 'A custom role, on both planes', group: 'Foundations', state: 'built',
    asks: 'Does a role that can manage a VM let someone log in to it?',
    found: 'No. Managing and logging in are separate locks, and five actions did the job of a role that holds 412.',
    stat: { value: '412 to 5', label: 'actions, built-in to custom' },
  },
  {
    n: 5, folder: '05-entra-users-groups', title: 'Entra ID users and groups at scale', group: 'Foundations', state: 'built',
    asks: 'If one group holds a role, does it reach people who are two groups down?',
    found: 'Yes. One assignment covered six people through nesting, and the guests, in no group, got nothing.',
    stat: { value: '1', label: 'role assignment, six people' },
  },
  {
    n: 6, folder: '06-azure-files-share', title: 'An Azure Files share', group: 'Foundations', state: 'running',
    asks: 'Can a file share be mounted, snapshotted and controlled by identity, with no storage keys?',
  },
  { n: 7, folder: '07-three-tier-vnet', title: 'Three-tier network', group: 'Composition', state: 'planned' },
  { n: 8, folder: '08-hub-spoke-bastion', title: 'Hub and spoke with Bastion', group: 'Composition', state: 'planned' },
  { n: 9, folder: '09-load-balancer-failover', title: 'Load balancer failover', group: 'Composition', state: 'planned' },
  { n: 10, folder: '10-monitoring-alerts', title: 'Monitoring and alerts', group: 'Composition', state: 'planned' },
  { n: 11, folder: '11-backup-restore', title: 'Backup and restore', group: 'Composition', state: 'planned' },
  { n: 12, folder: '12-keyvault-managed-identity', title: 'Key Vault with managed identity', group: 'Composition', state: 'planned' },
  { n: 13, folder: '13-vnet-to-vnet-vpn', title: 'VNet-to-VNet VPN', group: 'Composition', state: 'planned' },
  { n: 14, folder: '14-app-service-slots', title: 'App Service slots', group: 'Composition', state: 'planned' },
  { n: 15, folder: '15-private-endpoint-storage', title: 'Private endpoint for storage', group: 'Composition', state: 'planned' },
  { n: 16, folder: '16-bicep-cicd', title: 'Bicep CI/CD pipeline', group: 'Applied', state: 'planned' },
  { n: 17, folder: '17-security-baseline', title: 'Defender for Cloud baseline', group: 'Applied', state: 'planned' },
  { n: 18, folder: '18-cost-guardrail', title: 'Cost guardrail', group: 'Applied', state: 'planned' },
  { n: 19, folder: '19-conditional-access-pim', title: 'Conditional Access with PIM', group: 'Applied', state: 'planned' },
  { n: 20, folder: '20-full-environment', title: 'A full environment from one template', group: 'Applied', state: 'planned' },
];

export const labNo = (n: number) => String(n).padStart(2, '0');
