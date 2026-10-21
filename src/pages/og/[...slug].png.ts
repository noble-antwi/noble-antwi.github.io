/* Social preview images, one per page, rendered at build time.
   The site's clear palette: white ground, slate ink, a bold Inter title,
   and a kicker in the subject's colour (identity violet, cloud blue,
   detection teal, assessments amber). Name and tagline in the footer.
   Base.astro points og:image at /og/<page key>.png. */
import type { APIRoute, GetStaticPaths } from 'astro';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { getCollection } from 'astro:content';
import { SITE, postPath, categoryLabel, seriesFor } from '../../lib/site';

interface Card { slug: string; kicker: string; title: string; blurb?: string; accent?: string }

// Subject colours, the same tokens as global.css (light theme).
const SUBJECT: Record<string, string> = {
  identity: '#7c3aed',
  cloud: '#2563eb',
  detection: '#0f766e',
  assessment: '#b45309',
};

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('posts');
  const work = await getCollection('work');
  const pages: Card[] = [
    { slug: 'home', kicker: `${SITE.tagline} · ${SITE.location}`, title: 'I secure identities, and the cloud they live in.' },
    { slug: 'work', kicker: 'Work', title: 'Projects, each with a repository and a write-up.' },
    { slug: 'writing', kicker: 'Writing', title: 'Lab notes, study logs, and the occasional long read.' },
    { slug: 'credentials', kicker: 'Credentials', title: 'Eighteen credentials, weighted toward identity and cloud security.' },
    { slug: 'credentials/training', kicker: 'Training', title: 'The study behind the credentials.' },
    { slug: 'about', kicker: 'About', title: 'I came to security through the plumbing, and stayed for the identity.' },
    { slug: 'uses', kicker: 'Uses', title: 'What the labs, the projects and this site are made of.' },
    { slug: 'now', kicker: 'Now', title: 'What I am doing this month.' },
    { slug: 'contact', kicker: 'Contact', title: "Let's talk." },
    { slug: 'niw-consulting', kicker: 'NIW Consulting · EB-2', title: 'Petition writing and record-building, from someone whose own petition was approved.', blurb: 'For professionals in any field preparing a self-petitioned EB-2 National Interest Waiver. Every engagement starts with an individual review of your record.' },
    { slug: 'niw-consulting/thanks', kicker: 'NIW Consulting', title: 'Received, thank you.' },
    { slug: '404', kicker: '404', title: 'Nothing at this address.' },
  ];
  const cards: Card[] = [
    ...pages,
    ...work.map((w) => ({ slug: `work/${w.id}`, kicker: w.data.kicker, title: w.data.title, blurb: w.data.summary, accent: SUBJECT[w.data.category] })),
    ...posts.map((p) => {
      const s = seriesFor(p);
      return { slug: postPath(p), kicker: s ? `${categoryLabel(p.data.category)} · ${s.title}` : categoryLabel(p.data.category), title: p.data.title, blurb: p.data.description };
    }),
  ];
  return cards.map((c) => ({ params: { slug: c.slug }, props: c }));
};

const font = (pkg: string, file: string) => readFile(path.join(process.cwd(), 'node_modules', pkg, 'files', file));
const fonts = Promise.all([
  font('@fontsource/inter', 'inter-latin-800-normal.woff'),
  font('@fontsource/inter', 'inter-latin-500-normal.woff'),
  font('@fontsource/jetbrains-mono', 'jetbrains-mono-latin-500-normal.woff'),
]);

const PAPER = '#ffffff', INK = '#0f172a', INK2 = '#334155', TEAL = SUBJECT.detection;
// The four subject colours as one bar, the same order as the Work filters.
const BAR = [SUBJECT.identity, SUBJECT.cloud, SUBJECT.detection, SUBJECT.assessment];

export const GET: APIRoute = async ({ props }) => {
  const { kicker, title, blurb, accent } = props as Card;
  const ACCENT = accent ?? TEAL;
  const [interBold, inter, mono] = await fonts;
  const size = title.length > 90 ? 48 : title.length > 60 ? 56 : title.length > 36 ? 66 : 78;
  // One or two sentences, capped so the card never crowds.
  const lede = (blurb ?? '').trim().replace(/\s+/g, ' ');
  const sentences = lede.split(/(?<=\.)\s+/);
  // A very short opener ("A vulnerability report is a list.") reads as a teaser on its own,
  // so take the next sentence with it.
  const first = (sentences[0] ?? '').length < 60 && sentences[1] ? `${sentences[0]} ${sentences[1]}` : sentences[0] ?? '';
  const sub = first.length > 170 ? first.slice(0, first.lastIndexOf(' ', 167)) + '…' : first;

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
                { type: 'rect', props: { width: 64, height: 64, rx: 14, fill: '#123150' } },
                { type: 'circle', props: { cx: 32, cy: 26, r: 14, stroke: '#4fd1c0', strokeWidth: 6, fill: 'none' } },
                { type: 'rect', props: { x: 28.5, y: 38, width: 7, height: 18, rx: 3.5, fill: '#4fd1c0' } },
                { type: 'rect', props: { x: 35, y: 47, width: 8, height: 5, rx: 2.5, fill: '#e0a24a' } },
              ] } },
            ] } },
            { type: 'div', props: { style: { fontFamily: 'Inter', fontWeight: 800, fontSize: size, lineHeight: 1.08, letterSpacing: -2, color: INK, maxWidth: 1040 }, children: title } },
            ...(sub ? [{ type: 'div', props: { style: { display: 'flex', marginTop: 26, paddingLeft: 20, borderLeft: `5px solid ${ACCENT}`, fontSize: 26, lineHeight: 1.45, color: INK2, maxWidth: 980 }, children: sub } }] : []),
          ] } },
          { type: 'div', props: { style: { display: 'flex', flexDirection: 'column' }, children: [
            { type: 'div', props: { style: { display: 'flex', width: 1056, marginBottom: 26 }, children: BAR.map((c) => ({ type: 'div', props: { style: { height: 6, width: 264, background: c } } })) } },
            { type: 'div', props: { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', width: 1056 }, children: [
              { type: 'div', props: { style: { display: 'flex', alignItems: 'baseline' }, children: [
                { type: 'div', props: { style: { fontFamily: 'Inter', fontWeight: 800, fontSize: 34, letterSpacing: -1, color: INK, marginRight: 22 }, children: SITE.title } },
                { type: 'div', props: { style: { fontSize: 22, color: INK2 }, children: SITE.tagline } },
              ] } },
              { type: 'div', props: { style: { fontFamily: 'JetBrains Mono', fontSize: 20, color: TEAL }, children: 'nobleantwi.com' } },
            ] } },
          ] } },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Inter', data: interBold, weight: 800, style: 'normal' },
        { name: 'Inter', data: inter, weight: 500, style: 'normal' },
        { name: 'JetBrains Mono', data: mono, weight: 500, style: 'normal' },
      ],
    },
  );

  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  return new Response(png, { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' } });
};
