import { ARTICLES, type Article } from '../data/articles';

const FEED = 'https://medium.com/feed/@noble-antwi';

/** Medium's RSS only carries the latest ten posts, so the static list in
 *  src/data/articles.ts stays as the floor; anything newer on Medium is
 *  merged in at build time. A fetch failure never breaks the build. */
export async function getArticles(): Promise<Article[]> {
  let xml = '';
  try {
    const res = await fetch(FEED, { signal: AbortSignal.timeout(8000), headers: { 'user-agent': 'Mozilla/5.0 (noble-antwi.github.io build)' } });
    if (res.ok) xml = await res.text();
  } catch {
    /* offline or blocked: fall through to the static list */
  }

  const canon = (u: string) => u.split('?')[0].replace(/\/$/, '');
  const merged = new Map<string, Article>(ARTICLES.map((a) => [canon(a.href), a]));

  for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const it = m[1];
    const title = it.match(/<title><!\[CDATA\[([\s\S]*?)\]\]>/)?.[1]?.replace(/ /g, ' ').trim();
    const link = it.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim();
    const pub = it.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1];
    const cats = [...it.matchAll(/<category><!\[CDATA\[([\s\S]*?)\]\]>/g)].map((c) => c[1]);
    if (!title || !link) continue;
    const key = canon(link);
    if (merged.has(key)) continue;

    const host = new URL(link).hostname;
    const outlet = host === 'aws.plainenglish.io' ? 'AWS in Plain English' : host.endsWith('plainenglish.io') ? 'In Plain English' : 'Medium';
    const date = pub ? new Date(pub).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }) : '';
    const blob = (title + ' ' + cats.join(' ')).toLowerCase();
    const cat: Article['cat'] = /phish|malware|zero-day|vulnerab|threat|incident|forensic/.test(blob) ? 'threat' : /aws|cloud|azure|kms|ec2|iam/.test(blob) ? 'aws' : 'other';
    merged.set(key, { title, outlet, date, topics: cats.slice(0, 3).join(', ') || 'Medium', href: link.split('?')[0], cat });
  }

  return [...merged.values()];
}
