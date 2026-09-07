/* Social preview images, one per page, rendered at build time.
   Paper background, serif title, name and tagline in the footer.
   Base.astro points og:image at /og/<page key>.png. */
import type { APIRoute, GetStaticPaths } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { getCollection } from 'astro:content';
import { SITE, postPath, categoryLabel, seriesFor } from '../../lib/site';

interface Card { slug: string; kicker: string; title: string }

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('posts');
  const work = await getCollection('work');
  const pages: Card[] = [
    { slug: 'home', kicker: `${SITE.tagline} · ${SITE.location}`, title: 'I secure identities, and the cloud they live in.' },
    { slug: 'work', kicker: 'Work', title: 'Seven projects, each with a repository and a write-up.' },
    { slug: 'writing', kicker: 'Writing', title: 'Lab notes, study logs, and the occasional long read.' },
    { slug: 'credentials', kicker: 'Credentials', title: 'Eighteen credentials, weighted toward identity and cloud security.' },
    { slug: 'credentials/training', kicker: 'Training', title: 'The study behind the credentials.' },
    { slug: 'about', kicker: 'About', title: 'I came to security through the plumbing, and stayed for the identity.' },
    { slug: 'uses', kicker: 'Uses', title: 'What the labs, the projects and this site are made of.' },
    { slug: 'now', kicker: 'Now', title: 'What I am doing this month.' },
    { slug: 'contact', kicker: 'Contact', title: "Let's talk." },
    { slug: '404', kicker: '404', title: 'Nothing at this address.' },
  ];
  const cards: Card[] = [
    ...pages,
    ...work.map((w) => ({ slug: `work/${w.id}`, kicker: w.data.kicker, title: w.data.title })),
    ...posts.map((p) => {
      const s = seriesFor(p);
      return { slug: postPath(p), kicker: s ? `${categoryLabel(p.data.category)} · ${s.title}` : categoryLabel(p.data.category), title: p.data.title };
    }),
  ];
  return cards.map((c) => ({ params: { slug: c.slug }, props: c }));
};

const font = (pkg: string, file: string) => readFile(path.join(process.cwd(), 'node_modules', pkg, 'files', file));
const fonts = Promise.all([
  font('@fontsource/instrument-serif', 'instrument-serif-latin-400-normal.woff'),
  font('@fontsource/inter', 'inter-latin-500-normal.woff'),
  font('@fontsource/jetbrains-mono', 'jetbrains-mono-latin-500-normal.woff'),
]);

const PAPER = '#f8f6f1', INK = '#16181d', INK2 = '#4a4f58', ACCENT = '#0b6b63', LINE = '#ddd7cb';

export const GET: APIRoute = async ({ props }) => {
  const { kicker, title } = props as Card;
  const [serif, inter, mono] = await fonts;
  const size = title.length > 90 ? 52 : title.length > 60 ? 60 : title.length > 36 ? 70 : 82;

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: { width: 1200, height: 630, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: PAPER, padding: '64px 72px', fontFamily: 'Inter' },
        children: [
          { type: 'div', props: { style: { display: 'flex', flexDirection: 'column' }, children: [
            { type: 'div', props: { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }, children: [
              { type: 'div', props: { style: { fontFamily: 'JetBrains Mono', fontSize: 22, letterSpacing: 4, textTransform: 'uppercase', color: ACCENT, paddingTop: 6 }, children: kicker } },
              { type: 'svg', props: { width: 56, height: 56, viewBox: '0 0 64 64', children: [
                { type: 'rect', props: { width: 64, height: 64, rx: 14, fill: INK } },
                { type: 'circle', props: { cx: 32, cy: 26, r: 14, stroke: '#5fd3c6', strokeWidth: 6, fill: 'none' } },
                { type: 'rect', props: { x: 28.5, y: 38, width: 7, height: 18, rx: 3.5, fill: '#5fd3c6' } },
                { type: 'rect', props: { x: 35, y: 47, width: 8, height: 5, rx: 2.5, fill: '#5fd3c6' } },
              ] } },
            ] } },
            { type: 'div', props: { style: { fontFamily: 'Instrument Serif', fontSize: size, lineHeight: 1.06, letterSpacing: -1, color: INK, maxWidth: 1040 }, children: title } },
          ] } },
          { type: 'div', props: { style: { display: 'flex', flexDirection: 'column' }, children: [
            { type: 'div', props: { style: { height: 2, width: 1056, background: LINE, marginBottom: 26 } } },
            { type: 'div', props: { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', width: 1056 }, children: [
              { type: 'div', props: { style: { display: 'flex', alignItems: 'baseline' }, children: [
                { type: 'div', props: { style: { fontFamily: 'Instrument Serif', fontSize: 40, color: INK, marginRight: 22 }, children: SITE.title } },
                { type: 'div', props: { style: { fontSize: 22, color: INK2 }, children: SITE.tagline } },
              ] } },
              { type: 'div', props: { style: { fontFamily: 'JetBrains Mono', fontSize: 20, color: ACCENT }, children: 'nobleantwi.com' } },
            ] } },
          ] } },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Instrument Serif', data: serif, weight: 400, style: 'normal' },
        { name: 'Inter', data: inter, weight: 500, style: 'normal' },
        { name: 'JetBrains Mono', data: mono, weight: 500, style: 'normal' },
      ],
    },
  );

  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  return new Response(png, { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' } });
};
