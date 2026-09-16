// Confirms every link in the chapter index resolves on GitHub.
// Usage: node scripts/check-chapter-links.mjs   (reads src/data/chapters.ts)
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../src/data/chapters.ts', import.meta.url), 'utf8');
const GH = 'https://github.com/noble-antwi';
const repoVars = Object.fromEntries([...src.matchAll(/const (\w+) = '([\w-]+)';/g)].map((m) => [m[1], m[2]]));
const urls = new Set();

for (const m of src.matchAll(/name: (?:'([\w-]+)'|(\w+)),/g)) urls.add(`${GH}/${m[1] ?? repoVars[m[2]]}`);
for (const m of src.matchAll(/repo: (\w+),\s*path: '([^']+)'(,\s*(?:pdf: true|tree: true))?/g)) {
  const repo = repoVars[m[1]];
  const tree = /tree/.test(m[3] ?? '');
  urls.add(`${GH}/${repo}/${tree ? 'tree' : 'blob'}/main/${m[2]}`);
  if (/pdf/.test(m[3] ?? '')) urls.add(`${GH}/${repo}/blob/main/${m[2].replace(/\.md$/, '.pdf')}`);
}

let bad = 0;
for (const u of urls) {
  const r = await fetch(u, { method: 'HEAD', redirect: 'follow' });
  if (!r.ok) { bad++; console.log(`${r.status}  ${u}`); }
}
console.log(`${urls.size} links checked, ${bad} broken`);
process.exit(bad ? 1 : 0);
