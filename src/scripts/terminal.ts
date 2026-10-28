/* A simulated shell for the site. Every command runs in the browser and
   nothing typed is sent anywhere. Two commands do more than print: one
   starts the containment game, one opens the break-glass vault, whose
   code is split across numbers that appear on the site. */
import { CERTS, RUNWAY } from '../data/certifications';
import { SITE } from '../lib/site';
import { rank, type IndexRow } from '../lib/rank';

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

/* the four parts of the break-glass code; each one is a number on this site */
const PARTS = [
  { k: 'A', q: 'Wazuh agents reporting to SIEM01', a: '5', hint: 'Count the agents in the alert scene on the home page, or in the homelab case study.' },
  { k: 'B', q: 'The rule that keeps the scanner quiet', a: '100020', hint: '<a href="/lab-notes/2026/09/26/the-alert-that-cried-wolf.html">The Alert That Cried Wolf</a> names it.' },
  { k: 'C', q: 'The number to match on the push approval', a: '42', hint: 'Scroll to the end of the home page. Someone is trying to reach Noble.' },
  { k: 'D', q: 'The VLAN the domain controller lives on', a: '50', hint: 'Chapter 01 of the journey: "Checked at home first."' },
];
const VAULT_KEY = 'vault-parts';

export interface TermHooks { startBreach: () => void }

export function initTerminal(panel: HTMLElement, hooks: TermHooks) {
  const out = panel.querySelector<HTMLElement>('[data-t-out]')!;
  const input = panel.querySelector<HTMLInputElement>('[data-t-in]')!;
  const prompt = panel.querySelector<HTMLElement>('[data-t-prompt]')!;
  let vault = false;
  let got = new Set<string>();
  try { got = new Set(JSON.parse(sessionStorage.getItem(VAULT_KEY) || '[]')); } catch { /* private mode */ }
  const history: string[] = []; let hi = 0;
  /* every page on the site, written into the page at build time */
  let rows: IndexRow[] = [];
  try { rows = JSON.parse(document.querySelector('[data-site-index]')?.textContent || '[]'); } catch { /* keep empty */ }
  let picks: IndexRow[] = [];

  const print = (html: string, cls = '') => { const d = document.createElement('div'); d.className = 't-line ' + cls; d.innerHTML = html; out.appendChild(d); out.scrollTop = out.scrollHeight; return d; };
  const row = (a: string, b: string) => `<span class="t-k">${a}</span>${b}`;

  function browser() {
    const n = navigator as Navigator & { deviceMemory?: number; connection?: { effectiveType?: string }; userAgentData?: { platform?: string; brands?: { brand: string; version: string }[] } };
    const ua = n.userAgent;
    const os = n.userAgentData?.platform || (/Windows/.test(ua) ? 'Windows' : /Mac/.test(ua) ? 'macOS' : /Android/.test(ua) ? 'Android' : /iPhone|iPad/.test(ua) ? 'iOS' : /Linux/.test(ua) ? 'Linux' : 'unknown');
    const br = /Edg\//.test(ua) ? 'Edge' : /Chrome\//.test(ua) ? 'Chrome' : /Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : 'a browser';
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    print([
      row('Device     ', `${esc(os)} · ${br}`),
      row('Hardware   ', `${n.hardwareConcurrency || '?'} cores${n.deviceMemory ? ` · ${n.deviceMemory} GB+ memory` : ''} · ${screen.width} × ${screen.height} at ${devicePixelRatio}×`),
      row('Clock      ', `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, ${esc(tz)}`),
      row('Locale     ', `${esc(n.language)} · prefers ${matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'}`),
      row('Network    ', `${n.connection?.effectiveType || 'unknown'} · ${n.onLine ? 'online' : 'offline'}`),
      row('Automation ', n.webdriver ? 'navigator.webdriver is set' : 'none seen'),
    ].join('<br>'));
    print('Any site can read all of this without asking. A conditional access policy reads much the same, and decides whether you get in.', 't-dim');
  }

  function vaultCard() {
    const slots = PARTS.map((p) => `<span class="t-slot${got.has(p.k) ? ' is-ok' : ''}">${got.has(p.k) ? p.a : '·'.repeat(p.a.length)}</span>`).join('<i>-</i>');
    const list = PARTS.map((p) => `<li class="${got.has(p.k) ? 'is-ok' : ''}"><b>${p.k}</b>${p.q}</li>`).join('');
    print(`<div class="t-vault"><strong>Break-glass vault · BG-01</strong><p>The emergency owner account is sealed. Its code has four parts, and every part is a number somewhere on this site.</p><div class="t-slots">${slots}</div><ol>${list}</ol><small>Parts accepted: ${got.size}/4</small></div>`);
  }

  function tryPart(raw: string) {
    const parts = raw.split(/[\s-]+/).filter(Boolean);
    let fresh = 0;
    for (const v of parts) {
      const p = PARTS.find((x) => x.a === v && !got.has(x.k));
      if (p) { got.add(p.k); fresh++; }
    }
    try { sessionStorage.setItem(VAULT_KEY, JSON.stringify([...got])); } catch { /* private mode */ }
    if (got.size === 4) {
      vault = false; prompt.textContent = 'PS C:\\visitor>';
      vaultCard();
      print('Unsealed. You are now the break-glass owner.', 't-ok');
      print(`<div class="t-alert"><span>SIEM01 · wazuh-alerts</span>rule.id <b>100404</b> · level <b>10</b> · T1078.003<br>the break-glass owner login was used<br><em>The account exists for emergencies, so using it pages someone. That rule is real: <a href="/lab-notes/2026/10/27/watching-the-front-door.html">Watching the Front Door</a>.</em></div>`);
      return;
    }
    if (fresh) print(`Accepted. ${got.size} of 4.`, 't-ok');
    else print('That is not one of the parts. Type <b>hint</b> for a clue, or <b>q</b> to leave.', 't-bad');
  }

  const COMMANDS: Record<string, { help?: string; run: (args: string) => void }> = {
    help: { run: () => {
      print(Object.entries(COMMANDS).filter(([, c]) => c.help).map(([k, c]) => row(k.padEnd(26, ' ').replace(/ /g, '&nbsp;'), c.help!)).join('<br>'));
    } },
    whoami: { help: 'who the site thinks you are', run: () => print('visitor · read-only · session granted by the gate<br><span class="t-dim">No account, no cookie, no tracking. Scope: read everything.</span>') },
    'Get-WhatYourBrowserKnows': { help: 'what any page can read about you', run: browser },
    'Get-Lab': { help: 'the hosts in the homelab', run: () => {
      const H = [['pfSense', 'all', 'firewall, the gateway on every VLAN'], ['PVE01', '10', 'Proxmox hypervisor'], ['ADM01', '10', 'admin workstation'], ['SIEM01', '20', 'Wazuh manager, indexer, dashboard'], ['SCAN01', '20', 'Greenbone scanner'], ['KALI01', '30', 'attack host, contained'], ['APP01', '40', 'internal apps, Wazuh agent 005'], ['DC01', '50', 'domain controller, corp.biirabank.com'], ['WKS01', '50', 'first member workstation'], ['CA01', '50', 'enterprise root CA']];
      print(`<span class="t-dim">NAME      VLAN  ROLE</span><br>` + H.map(([a, b, c]) => `${a.padEnd(10, ' ')}${b.padEnd(6, ' ')}${c}`.replace(/ /g, '&nbsp;')).join('<br>'));
      print('Full write-up: <a href="/work/enterprise-security-homelab/">the homelab case study</a>.', 't-dim');
    } },
    'Get-Alerts': { help: 'the last few alerts on SIEM01', run: () => {
      const A = [['12', '100411', 'forged token: alg none', 'APP01'], ['10', '100403', 'repeated refused credentials from one device', 'APP01'], ['0', '100020', 'svc-greenbone from SCAN01 (silenced)', 'WKS01'], ['12', '100021', 'svc-greenbone from anywhere else', 'WKS01'], ['8', '100420', 'API token used beyond its scope', 'APP01']];
      print(A.map(([l, id, d, h]) => `<span class="t-lvl t-lvl-${Number(l) >= 12 ? 'hi' : Number(l) >= 8 ? 'md' : 'lo'}">L${l.padStart(2, '0')}</span> ${id} · ${esc(d)} <span class="t-dim">· ${h}</span>`).join('<br>'));
      print('Simulated, but every rule id is real and lives in the homelab repository.', 't-dim');
    } },
    'Decode-Token': { help: 'the credentials as a JWT', run: () => {
      print(`<span class="t-red">{"alg":"ES256","typ":"JWT","kid":"nobleantwi-2026"}</span>`);
      print(`<span class="t-vio">{"sub":"noble antwi","role":"cloud security &amp; identity engineer",<br>&nbsp;"certs":${CERTS.length},"pending":${RUNWAY.length},<br>&nbsp;"claims":[${CERTS.slice(0, 6).map((c) => `"${esc(c.short)}"`).join(',')},…]}</span>`);
      print('<span class="t-ok">✓ signature verified</span> <span class="t-dim">· <a href="/credentials/">all credentials</a></span>');
    } },
    'Start-Containment': { help: 'play: stop an attacker before DC01', run: () => { print('Starting containment…', 't-ok'); window.setTimeout(hooks.startBreach, 350); } },
    'Unlock-BreakGlass': { help: 'puzzle: open the emergency account', run: () => {
      vault = true; prompt.textContent = 'Recovery code:';
      vaultCard(); print('Type the code, or just the parts you know. <b>hint</b> helps, <b>q</b> leaves.', 't-dim');
    } },
    contact: { help: 'the fastest way to reach Noble', run: () => print(`<a href="mailto:${SITE.email}">${SITE.email}</a> · <a href="https://linkedin.com/in/${SITE.linkedin}" target="_blank" rel="noopener">LinkedIn</a> · <a href="https://github.com/${SITE.github}" target="_blank" rel="noopener">GitHub</a>`) },
    clear: { help: 'clear the screen', run: () => { out.innerHTML = ''; } },
    exit: { help: 'close the terminal', run: () => close() },
    sudo: { run: () => print('visitor is not in the sudoers file. This incident will be reported to SIEM01.', 't-bad') },
    ls: { help: 'list the site; ls work, ls writing', run: (a) => {
      const what = a.trim().replace(/^\/|\/$/g, '').toLowerCase();
      if (!what) { print(rows.filter((r) => r.k === 'section' && r.u !== '/').map((r) => `<a href="${r.u}">${r.u.slice(1)}</a>`).join('&nbsp;&nbsp;') + '<br><span class="t-dim">ls work · ls writing · open &lt;anything&gt;</span>'); return; }
      const kind = /^work/.test(what) ? 'work' : /^(writing|notes?|lab-notes|posts?)/.test(what) ? 'note' : '';
      if (!kind) { print(`ls: ${esc(a)}: no such section`, 't-bad'); return; }
      list(rows.filter((r) => r.k === kind).slice(0, kind === 'note' ? 10 : 20));
      if (kind === 'note') print('Ten newest. <b>open</b> a word from any title to find older ones.', 't-dim');
    } },
    cd: { help: 'go to a section: cd work, cd ~', run: (a) => {
      const p = a.trim().replace(/^\/|\/$/g, '').toLowerCase();
      if (!p || p === '~' || p === '..' || p === '/') { go('/'); return; }
      const r = rows.find((x) => x.k === 'section' && x.u === `/${p}/`) || rows.find((x) => x.u.replace(/\/$/, '').endsWith(`/${p}`));
      if (r) go(r.u); else print(`cd: ${esc(a)}: no such section. Try <b>open ${esc(a)}</b>.`, 't-bad');
    } },
    open: { help: 'find any page: open wazuh, open 2', run: (a) => {
      const q = a.trim();
      if (!q) { print('open what? Try <b>open vault</b> or <b>open homelab</b>.', 't-dim'); return; }
      if (/^\d+$/.test(q) && picks[Number(q) - 1]) { go(picks[Number(q) - 1].u); return; }
      const found = rank(rows, q, 6);
      if (!found.length) { print(`Nothing on the site matches "${esc(q)}".`, 't-bad'); return; }
      if (found.length === 1) { go(found[0].u); return; }
      list(found);
      print('<b>open 1</b> to go to the first, or click one.', 't-dim');
    } },
    pwd: { run: () => print(esc(location.pathname)) },
  };
  const KIND = { section: 'dir ', work: 'case', note: 'note' };
  function list(r: IndexRow[]) {
    picks = r;
    print(r.map((x, i) => `<span class="t-dim">${String(i + 1).padStart(2, ' ').replace(/ /g, '&nbsp;')} ${KIND[x.k].replace(/ /g, '&nbsp;')}</span> <a href="${x.u}">${esc(x.t)}</a>`).join('<br>'));
  }
  function go(u: string) {
    print(`→ ${esc(u)}`, 't-ok');
    window.location.href = u;
  }
  const lookup = (name: string) => Object.keys(COMMANDS).find((k) => k.toLowerCase() === name.toLowerCase());

  function run(line: string) {
    const raw = line.trim(); if (!raw) return;
    print(`<span class="t-p">${esc(prompt.textContent || '')}</span> ${esc(raw)}`, 't-echo');
    history.push(raw); hi = history.length;
    if (vault) {
      if (/^(q|quit|exit)$/i.test(raw)) { vault = false; prompt.textContent = 'PS C:\\visitor>'; print('Vault left sealed.', 't-dim'); return; }
      if (/^hint$/i.test(raw)) { const p = PARTS.find((x) => !got.has(x.k)); if (p) print(`<b>${p.k}</b> · ${p.hint}`, 't-dim'); return; }
      tryPart(raw); return;
    }
    const [name, ...rest] = raw.split(/\s+/);
    const k = lookup(name);
    if (k) COMMANDS[k].run(rest.join(' '));
    else print(`${esc(name)}: the term is not recognized. Type <b>help</b>.`, 't-bad');
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { run(input.value); input.value = ''; }
    else if (e.key === 'ArrowUp') { if (hi > 0) { hi--; input.value = history[hi]; } e.preventDefault(); }
    else if (e.key === 'ArrowDown') { if (hi < history.length) { hi++; input.value = history[hi] || ''; } e.preventDefault(); }
    else if (e.key === 'Tab') { e.preventDefault(); const m = Object.keys(COMMANDS).find((c) => c.toLowerCase().startsWith(input.value.toLowerCase()) && input.value); if (m) input.value = m; }
  });
  panel.querySelectorAll<HTMLButtonElement>('[data-t-cmd]').forEach((b) => b.addEventListener('click', () => { run(b.dataset.tCmd!); input.focus(); }));
  panel.querySelector('[data-t-close]')?.addEventListener('click', () => close());
  panel.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.preventDefault(); close(); } });

  let opened = false;
  function open(cmd?: string) {
    panel.hidden = false; document.documentElement.classList.add('term-open');
    if (!opened) {
      opened = true;
      print('PowerShell 7 · every command here is simulated and runs in your browser.', 't-dim');
      print('Type <b>help</b>, or try <b>Start-Containment</b>. <b>open</b> finds any page; <b>Get-WhatYourBrowserKnows</b> might surprise you.');
    }
    input.focus();
    if (cmd) run(cmd);
  }
  function close() { panel.hidden = true; document.documentElement.classList.remove('term-open'); }
  return { open, close, isOpen: () => !panel.hidden };
}
