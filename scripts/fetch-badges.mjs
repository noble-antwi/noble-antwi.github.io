/* Copies each certification badge from Credly into the site, so the
   Credentials page never depends on Credly's image servers. Browsers block
   or throttle those images often enough that badges went missing.

   Reads every `credly('<uuid>', '<file>')` call in src/data/certifications.ts
   and writes public/assets/credentials/<cert id>.webp at 220x220.

   Run it after adding or changing a badge:
     node scripts/fetch-badges.mjs            (fetches only missing badges)
     node scripts/fetch-badges.mjs --all      (fetches every badge again)
     node scripts/fetch-badges.mjs --from <dir>   (converts <dir>/<id>.png instead)  */
import { readFileSync, mkdirSync, existsSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const SRC = 'src/data/certifications.ts';
const OUT = 'public/assets/credentials';
const all = process.argv.includes('--all');
/* --from <dir>: use <dir>/<cert id>.png instead of downloading, for when
   Node cannot reach Credly (some networks reset its connections). */
const fromAt = process.argv.indexOf('--from');
const from = fromAt > -1 ? process.argv[fromAt + 1] : null;

const text = readFileSync(SRC, 'utf8');
const re = /id: '([^']+)'[^\n]*?credly\('([0-9a-f-]+)'(?:, '([^']+)')?\)/g;
const badges = [...text.matchAll(re)].map(([, id, uuid, file = 'image.png']) => ({ id, url: `https://images.credly.com/size/220x220/images/${uuid}/${file}` }));
if (!badges.length) throw new Error(`no credly() badges found in ${SRC}`);

mkdirSync(OUT, { recursive: true });
let fetched = 0;
for (const b of badges) {
  const dest = `${OUT}/${b.id}.webp`;
  if (!all && existsSync(dest)) continue;
  let raw;
  if (from && existsSync(`${from}/${b.id}.png`)) {
    raw = readFileSync(`${from}/${b.id}.png`);
  } else {
    const res = await fetch(b.url);
    if (!res.ok) throw new Error(`${b.id}: ${res.status} from ${b.url}`);
    raw = Buffer.from(await res.arrayBuffer());
  }
  const img = await sharp(raw)
    .resize(220, 220, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 90 })
    .toBuffer();
  writeFileSync(dest, img);
  fetched++;
  console.log(`${b.id}  ${(img.length / 1024).toFixed(1)} KB`);
}
console.log(`${fetched} fetched, ${badges.length - fetched} already present, ${badges.length} badges in ${SRC}`);
