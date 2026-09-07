// Renders the PNG favicons and touch icon from public/favicon.svg. Run: node scripts/icons.mjs
import { readFile, writeFile } from 'node:fs/promises';
import { Resvg } from '@resvg/resvg-js';

const svg = await readFile(new URL('../public/favicon.svg', import.meta.url), 'utf8');
const out = { 'favicon-32.png': 32, 'favicon-192.png': 192, 'apple-touch-icon.png': 180, 'favicon-512.png': 512 };
for (const [name, size] of Object.entries(out)) {
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng();
  await writeFile(new URL(`../public/${name}`, import.meta.url), png);
  console.log('wrote', name, png.length, 'bytes');
}
