import { getCollection } from 'astro:content';
import { postUrl, byDateDesc } from './site';

import type { IndexRow } from './rank';
export { rank, type IndexRow } from './rank';

export const SECTIONS: IndexRow[] = [
  { k: 'section', t: 'Home', u: '/' },
  { k: 'section', t: 'Work', u: '/work/' },
  { k: 'section', t: 'Writing', u: '/writing/' },
  { k: 'section', t: 'Credentials', u: '/credentials/' },
  { k: 'section', t: 'Training', u: '/credentials/training/' },
  { k: 'section', t: 'About', u: '/about/' },
  { k: 'section', t: 'Now', u: '/now/' },
  { k: 'section', t: 'Uses', u: '/uses/' },
  { k: 'section', t: 'Contact', u: '/contact/' },
];

export async function siteIndex(): Promise<IndexRow[]> {
  const work = (await getCollection('work')).sort((a, b) => a.data.order - b.data.order);
  const posts = (await getCollection('posts')).sort(byDateDesc);
  return [
    ...SECTIONS,
    ...work.map((w) => ({ k: 'work' as const, t: w.data.title, u: `/work/${w.id}/` })),
    ...posts.map((p) => ({ k: 'note' as const, t: p.data.title, u: postUrl(p) })),
  ];
}
