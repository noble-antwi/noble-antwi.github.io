// Renders a digest issue (Markdown) into a designed HTML email in the site's look.
// Usage: node scripts/digest-email.mjs body.md "Title" "https://issue-url" > email.html
// Email clients ignore stylesheets, so everything is inline and table-based.
import { readFileSync } from 'node:fs';
import { marked } from 'marked';

const [, , bodyPath, title = 'Lab digest', url = 'https://nobleantwi.com'] = process.argv;
// GitHub stores issue bodies with CRLF line endings; normalise before splitting.
const md = readFileSync(bodyPath, 'utf8').split('\r').join('');

const C = {
  paper: '#f8f6f1', card: '#ffffff', ink: '#16181d', ink2: '#4a4f58', ink3: '#5f646d',
  line: '#ddd7cb', accent: '#0b6b63', accentSoft: '#e6f2f0', warnSoft: '#fbf3e6', warn: '#9a4a06',
};
const font = "-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const serif = "Georgia,'Iowan Old Style','Palatino Linotype',serif";
const mono = "Menlo,Consolas,'Courier New',monospace";

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* Split the markdown into sections on H2 headings. */
const sections = [];
let current = { heading: null, lines: [] };
for (const line of md.split('\n')) {
  const m = line.match(/^##\s+(.+)$/);
  if (m) { if (current.heading || current.lines.join('').trim()) sections.push(current); current = { heading: m[1].trim(), lines: [] }; }
  else current.lines.push(line);
}
sections.push(current);

/* Inline-style the HTML marked produces. */
function styleHtml(html) {
  return html
    .replace(/<p>/g, `<p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:${C.ink};">`)
    .replace(/<ul>/g, `<ul style="margin:0 0 12px;padding-left:20px;">`)
    .replace(/<ol>/g, `<ol style="margin:0 0 12px;padding-left:22px;">`)
    .replace(/<li>/g, `<li style="margin:0 0 8px;font-size:15px;line-height:1.55;color:${C.ink};">`)
    .replace(/<strong>/g, `<strong style="color:${C.ink};font-weight:600;">`)
    .replace(/<code>/g, `<code style="font-family:${mono};font-size:13px;background:${C.paper};border:1px solid ${C.line};border-radius:4px;padding:1px 5px;">`)
    .replace(/<a /g, `<a style="color:${C.accent};" `)
    .replace(/<h3>/g, `<h3 style="margin:16px 0 6px;font-size:16px;font-weight:600;color:${C.ink};">`);
}

const KICKER = {
  'built this week': { icon: 'Built', tone: 'accent' },
  'not on the site yet': { icon: 'Gap', tone: 'warn' },
  'rebuild': { icon: 'Rebuild', tone: 'accent' },
  'next lab note': { icon: 'Write', tone: 'accent' },
  'reminders': { icon: 'Remind', tone: 'warn' },
  'what to do with this': { icon: 'Act', tone: 'panel' },
};

function sectionHtml(s) {
  const body = styleHtml(marked.parse(s.lines.join('\n').trim(), { gfm: true }));
  if (!s.heading) return body ? `<tr><td style="padding:0 32px 8px;">${body}</td></tr>` : '';
  const key = s.heading.toLowerCase();
  const meta = KICKER[key] || { icon: 'Note', tone: 'accent' };

  if (meta.tone === 'panel') {
    return `
<tr><td style="padding:8px 32px 28px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.accentSoft};border:1px solid #bfe0da;border-radius:10px;">
    <tr><td style="padding:20px 22px 6px;">
      <p style="margin:0 0 10px;font-family:${mono};font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${C.accent};">${esc(s.heading)}</p>
      ${body}
    </td></tr>
    <tr><td style="padding:4px 22px 20px;">
      <a href="${url}" style="display:inline-block;background:${C.ink};color:${C.paper};text-decoration:none;font-weight:600;font-size:14px;padding:11px 18px;border-radius:999px;">Open this digest on GitHub</a>
      <span style="font-size:12px;color:${C.ink3};margin-left:12px;">close the issue there when you are done</span>
    </td></tr>
  </table>
</td></tr>`;
  }

  const tint = meta.tone === 'warn' ? C.warnSoft : C.accentSoft;
  const tintText = meta.tone === 'warn' ? C.warn : C.accent;
  return `
<tr><td style="padding:22px 32px 6px;border-top:1px solid ${C.line};">
  <table role="presentation" cellpadding="0" cellspacing="0"><tr>
    <td style="background:${tint};color:${tintText};font-family:${mono};font-size:10px;letter-spacing:1.5px;text-transform:uppercase;padding:4px 9px;border-radius:999px;">${meta.icon}</td>
    <td style="padding-left:10px;font-family:${serif};font-size:20px;color:${C.ink};">${esc(s.heading)}</td>
  </tr></table>
  <div style="height:12px;line-height:12px;font-size:0;">&nbsp;</div>
  ${body}
</td></tr>`;
}

const date = (title.match(/\d{4}-\d{2}-\d{2}/) || [''])[0];
const niceDate = date ? new Date(date + 'T12:00:00Z').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) : '';

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:${C.paper};">
<span style="display:none;max-height:0;overflow:hidden;color:transparent;">What you built this week, what the site does not show yet, and the next note to write.</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.paper};font-family:${font};">
<tr><td align="center" style="padding:32px 16px;">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

    <tr><td style="padding:0 8px 18px;">
      <table role="presentation" cellpadding="0" cellspacing="0"><tr>
        <td style="vertical-align:middle;"><img src="https://nobleantwi.com/favicon-192.png" width="40" height="40" alt="" style="display:block;border-radius:10px;"></td>
        <td style="vertical-align:middle;padding-left:12px;">
          <div style="font-family:${serif};font-size:20px;color:${C.ink};">Noble Antwi</div>
          <div style="font-family:${mono};font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${C.accent};">weekly lab digest</div>
        </td>
      </tr></table>
    </td></tr>

    <tr><td style="background:${C.card};border:1px solid ${C.line};border-radius:14px;padding:0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding:30px 32px 18px;">
          <p style="margin:0 0 8px;font-family:${mono};font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${C.ink3};">${esc(niceDate)}</p>
          <h1 style="margin:0;font-family:${serif};font-weight:400;font-size:30px;line-height:1.15;color:${C.ink};">What moved this week, <span style="color:${C.accent};font-style:italic;">and what the site still owes it.</span></h1>
        </td></tr>
        ${sections.map(sectionHtml).join('\n')}
      </table>
    </td></tr>

    <tr><td style="padding:22px 8px 0;font-size:12px;line-height:1.6;color:${C.ink3};">
      Written every Monday by a routine that reads your public repositories and compares them with <a href="https://nobleantwi.com" style="color:${C.accent};">nobleantwi.com</a>. It never changes anything on its own.
      <br>Manage the routine at <a href="https://claude.ai/code/routines" style="color:${C.accent};">claude.ai/code/routines</a>.
    </td></tr>

  </table>
</td></tr></table>
</body></html>`;

process.stdout.write(html);
