import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { SITE, byDateDesc, postUrl } from '../lib/site';

export async function GET(context: APIContext) {
  const posts = (await getCollection('posts')).sort(byDateDesc);
  return rss({
    title: `${SITE.title} · Writing`,
    description: 'Lab notes and study logs on cloud security, identity, and detection.',
    site: context.site!,
    items: posts.map((p) => ({
      title: p.data.title,
      pubDate: p.data.date,
      description: p.data.description ?? (p.body ?? '').replace(/[#*_`>\[\]]/g, '').slice(0, 200),
      link: postUrl(p),
      categories: [p.data.category, ...p.data.tags],
    })),
    customData: '<language>en-us</language>',
    stylesheet: '/rss/styles.xsl',
  });
}
