/* Brings the Azure labs onto the site in full.

   Each finished lab in the az-104-labs repository has a README that is the
   whole write-up: questions, predictions, every portal step with its
   screenshot, what broke, the Bicep rebuild, findings and cost. This script
   turns each README into a page of the site, so a visitor can read the lab
   here and only needs GitHub for the code.

   For every lab folder listed in LABS it:
     - writes src/content/azurelabs/<folder>.md (the README, with its links
       and image paths rewritten);
     - copies the screenshots and the architecture diagram the README uses
       into src/assets/work/azure-labs/<folder>/;
     - copies the animated diagram and its two videos into
       public/assets/work/azure-labs/<folder>/.

   Run it after a lab's README changes, from the site's root:
     node scripts/sync-azure-labs.mjs ../azure-labs
   (the argument is the path to a checkout of the labs repository).        */
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync, rmSync } from 'node:fs';
import path from 'node:path';

const REPO = process.argv[2] ?? '../azure-labs';
const GH = 'https://github.com/noble-antwi/az-104-labs';
/* add a folder here when its lab is finished and its README is complete */
const LABS = ['01-governance-tagging', '02-storage-tiers', '03-vm-deep-dive', '04-custom-rbac-role', '05-entra-users-groups'];

const CONTENT = 'src/content/azurelabs';
const ASSETS = 'src/assets/work/azure-labs';
const PUBLIC = 'public/assets/work/azure-labs';
const one = (s) => s.replace(/\s+/g, ' ').trim();

mkdirSync(CONTENT, { recursive: true });
for (const folder of LABS) {
  const dir = path.join(REPO, folder);
  let md = readFileSync(path.join(dir, 'README.md'), 'utf8').replace(/\r\n/g, '\n');

  /* the title becomes the page's heading */
  const title = md.match(/^# (.+)$/m)?.[1]?.trim();
  if (!title) throw new Error(`${folder}: no title`);
  md = md.replace(/^# .+\n+/, '');

  /* the animated diagram opens the page, so it leaves the body */
  const lead = md.match(/^!\[([^\]]*)\]\(diagrams\/([\w-]+)\.svg\)\n\n\*Figure (\d+\.\d+): ([\s\S]*?)\*\n+/);
  if (!lead) throw new Error(`${folder}: the README does not open with its animated diagram`);
  const [, motionAlt, motion, figure, rawCaption] = lead;
  md = md.replace(lead[0], '');
  const motionCaption = one(rawCaption).replace(/\s*Built by .*$/, '').replace(/[`*]/g, '');

  /* GitHub draws Mermaid blocks; the site shows the drawn architecture diagram instead */
  md = md.replace(/```mermaid\n[\s\S]*?```\n+/g, '');

  /* screenshots and the architecture diagram come with the page */
  const images = new Set();
  md = md.replace(/!\[([^\]]*)\]\((screenshots|diagrams)\/([^)\s]+\.(?:png|jpe?g))\)/g, (_, alt, sub, file) => {
    images.add(`${sub}/${file}`);
    return `![${alt}](../../assets/work/azure-labs/${folder}/${file})`;
  });
  /* every other relative link points at a file in the repository */
  md = md.replace(/(?<!!)\[([^\]]+)\]\((?!https?:|mailto:|#|\/|\.\.\/\.\.\/assets)([^)\s]+)\)/g, (_, text, target) => {
    const resolved = path.posix.normalize(`${folder}/${target}`);
    const kind = target.endsWith('/') ? 'tree' : 'blob';
    return `[${text}](${GH}/${kind}/master/${resolved.replace(/\/$/, '')})`;
  });

  const outAssets = path.join(ASSETS, folder);
  rmSync(outAssets, { recursive: true, force: true });
  mkdirSync(outAssets, { recursive: true });
  for (const rel of images) {
    const from = path.join(dir, rel);
    if (!existsSync(from)) throw new Error(`${folder}: ${rel} is referenced but missing`);
    copyFileSync(from, path.join(outAssets, path.basename(rel)));
  }
  const outPublic = path.join(PUBLIC, folder);
  mkdirSync(outPublic, { recursive: true });
  for (const f of [`${motion}.svg`, `${motion}.mp4`, `${motion}-vertical.mp4`]) {
    const from = path.join(dir, 'diagrams', f);
    if (existsSync(from)) copyFileSync(from, path.join(outPublic, f));
  }

  const front = [
    '---',
    `title: ${JSON.stringify(title)}`,
    `n: ${Number(folder.slice(0, 2))}`,
    `folder: ${JSON.stringify(folder)}`,
    `motion: ${JSON.stringify(motion)}`,
    `motionAlt: ${JSON.stringify(one(motionAlt))}`,
    `motionCaption: ${JSON.stringify(motionCaption)}`,
    `figure: ${JSON.stringify(figure)}`,
    `hasVertical: ${existsSync(path.join(dir, 'diagrams', `${motion}-vertical.mp4`))}`,
    '---',
    '',
  ].join('\n');
  writeFileSync(path.join(CONTENT, `${folder}.md`), front + md.trimStart());
  console.log(`${folder}: ${images.size} images, ${md.split(/\s+/).length} words, motion ${motion}`);
}
