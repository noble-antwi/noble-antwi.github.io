import type { CollectionEntry } from 'astro:content';

export const SITE = {
  title: 'Noble Antwi',
  tagline: 'Cloud Security & Identity Engineer',
  description:
    'Cloud Security and Identity Engineer in Chicago. AWS and Azure IAM, Entra ID, Okta, Active Directory, HashiCorp Vault, Zero Trust, and detection engineering with Wazuh and Microsoft Sentinel.',
  url: 'https://nobleantwi.com',
  author: 'Noble Antwi',
  email: 'nobleantwi3@gmail.com',
  github: 'noble-antwi',
  linkedin: 'noble-antwi-worlanyo',
  medium: 'https://medium.com/@noble-antwi',
  location: 'Chicago, IL',
};

export type Post = CollectionEntry<'posts'>;
export type Work = CollectionEntry<'work'>;

/** Strip the Jekyll-style date prefix from a post id. */
export function postSlug(post: Post): string {
  return post.id.replace(/^\d{4}-\d{2}-\d{2}-/, '');
}

/** Keep the Jekyll URL shape so nothing indexed breaks: /category/yyyy/mm/dd/slug.html */
export function postPath(post: Post): string {
  const d = post.data.date;
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `${post.data.category}/${yyyy}/${mm}/${dd}/${postSlug(post)}`;
}

export function postUrl(post: Post): string {
  return `/${postPath(post)}.html`;
}

export const CATEGORY_LABELS: Record<string, string> = {
  'lab-notes': 'Lab notes',
  learning: 'Learning',
  'project-update': 'Project update',
  'cloud-security': 'Cloud security',
  til: 'Today I learned',
};

export function categoryLabel(cat: string): string {
  return CATEGORY_LABELS[cat] ?? cat.replace(/-/g, ' ');
}

export interface Series {
  id: string;
  title: string;
  blurb: string;
  match: (post: Post) => boolean;
}

/** Posts that read as a sequence get grouped, ordered oldest to newest inside the series. */
export const SERIES: Series[] = [
  {
    id: 'az-900',
    title: 'AZ-900, from zero to 873',
    blurb: 'Self-built study notes and four practice-test post-mortems on the way to Azure Fundamentals.',
    match: (p) => p.data.tags.includes('az-900'),
  },
  {
    id: 'vault',
    title: 'HashiCorp Vault, hands on',
    blurb: 'Seals, tokens, auth methods and audit devices, worked through in a lab rather than read about.',
    match: (p) => p.data.tags.includes('hashicorp-vault'),
  },
  {
    id: 'homelab',
    title: 'Enterprise homelab notes',
    blurb: 'Field notes from building the Biira Bank lab: Proxmox, VLANs, pfSense and the mistakes along the way.',
    match: (p) => p.data.tags.includes('homelab') || p.data.tags.includes('proxmox'),
  },
  {
    id: 'soc',
    title: 'SOC analyst training',
    blurb: 'Working through the Practical SOC Analyst path: kill chains, ATT&CK mapping and investigation notes.',
    match: (p) => p.data.tags.includes('psaa') || p.data.tags.includes('soc'),
  },
  {
    id: 'identity-certs',
    title: 'Identity certifications',
    blurb: 'Okta and Microsoft identity exams: what the prep looked like and what the exams actually tested.',
    match: (p) => p.data.tags.includes('okta') || p.data.tags.includes('sc-300'),
  },
];

export function seriesFor(post: Post): Series | undefined {
  return SERIES.find((s) => s.match(post));
}

export function byDateDesc(a: Post, b: Post): number {
  return b.data.date.getTime() - a.data.date.getTime();
}

export function formatDate(d: Date, style: 'long' | 'short' = 'long'): string {
  return d.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: style === 'long' ? 'long' : 'short',
    day: 'numeric',
  });
}

export function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export const WORK_CATEGORIES: Record<string, string> = {
  identity: 'Identity',
  cloud: 'Cloud',
  detection: 'Detection & infrastructure',
  assessment: 'Assessments',
};
