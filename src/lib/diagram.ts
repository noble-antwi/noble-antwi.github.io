/* The flat architecture diagram: the Biira Bank lab as one drawing.
   Hosts, zones and trust links come from src/data/estate.ts, the same list
   the 3D walkthrough is built from, so a host added there appears here too.
   What that file does not know (the firewall, the switch ports, where each
   card sits and how each arrow bends) lives in this file.

   One function, two uses: /architecture/diagram/ inlines the SVG and makes
   it interactive; /architecture/diagram.svg serves it as a standalone file,
   which is also what the homelab repository's README image is exported from.
   Colours are CSS variables on .dg so the page can restyle it for night.
   Never put a secret in it. */
import { ESTATE, type Host, type Zone } from '../data/estate';

export const DIAGRAM = { w: 1200, h: 1446 };

export interface NodeInfo { title: string; kind: string; facts: [string, string][]; note: string }

/* The network furniture: everything on the drawing that is not a host. */
export const NODES: Record<string, NodeInfo> = {
  internet: {
    title: 'Internet', kind: 'ISP uplink',
    facts: [['WAN address', '10.0.0.105']],
    note: 'The one way in or out of the lab. pfSense holds the WAN address and translates the lab\'s traffic on the way out.',
  },
  tailscale: {
    title: 'Tailscale', kind: 'Remote access overlay',
    facts: [['Transport', 'WireGuard mesh'], ['Subnet router', 'pfSense'], ['Devices', '4, all the owner\'s']],
    note: 'The admin laptop and phone reach the lab over a WireGuard mesh, with pfSense as the subnet router. Connections are routed, not remade, so every log names the real device that connected.',
  },
  fw: {
    title: 'FW01', kind: 'pfSense 2.9.0 firewall',
    facts: [['Design', 'Router-on-a-stick'], ['Gateways', '192.168.10.1 to 192.168.60.1'], ['Policy', 'Default deny on every interface'], ['Services', 'Hybrid NAT, Unbound DNS']],
    note: 'One 802.1Q trunk carries six VLANs to the managed switch. Nothing crosses between networks unless a written rule says it may. Lookups for the domain are forwarded to DC01.',
  },
  sw1: {
    title: 'Switch 1', kind: 'TP-Link TL-SG108E, 8-port managed',
    facts: [['Port 1', 'Trunk to pfSense'], ['Port 2', 'Trunk to Switch 2'], ['Ports 3 to 8', 'Access, one VLAN each']],
    note: 'The switch that turns one trunk into six networks. Each access port belongs to exactly one VLAN, so a device lands on a network by where it is plugged in.',
  },
  sw2: {
    title: 'Switch 2', kind: 'Trunk extension',
    facts: [['Uplink', 'Switch 1, port 2'], ['Carries', 'Every tagged VLAN to Proxmox']],
    note: 'Carries the tagged VLANs on to the hypervisor, where one VLAN-aware bridge places each guest on its network.',
  },
};

/* What each zone is for, the switch port that feeds it, and whether its ruleset has been tested. */
export const ZONE_EXTRA: Record<number, { purpose: string; port: number; ok?: string }> = {
  10: { purpose: 'Admin and control', port: 3, ok: 'Firewalled · MGMT-01 to 10' },
  20: { purpose: 'Security monitoring', port: 4 },
  30: { purpose: 'Attack simulation', port: 5, ok: 'Contained · RED-01 to 03' },
  40: { purpose: 'Application hosting', port: 6 },
  50: { purpose: 'Business services', port: 7, ok: 'Firewalled and isolated' },
  60: { purpose: 'Observability', port: 8 },
};

const W = DIAGRAM.w, H = DIAGRAM.h;
const CARD = { w: 184, h: 84 };
const LANE = { x: 200, r: 1170 };
/* Lane top and height, by VLAN. Lane 50 is tall: it holds the Tier 0 group. */
const LANE_Y: Record<number, [number, number]> = {
  10: [412, 126], 20: [548, 126], 30: [684, 126], 40: [820, 126], 50: [956, 308], 60: [1274, 126],
};
/* Where each card sits: x on the canvas, y offset inside its lane. */
const SLOT: Record<string, [number, number]> = {
  ADM01: [216, 34], PVE01: [416, 34], LAB01: [616, 34], ANS01: [816, 34],
  SCAN01: [216, 34], SIEM01: [824, 34],
  KALI01: [216, 34],
  APP01: [824, 34],
  WKS01: [216, 66], DC01: [516, 66], IDP01: [824, 66], CA01: [516, 202], VAULT01: [824, 202],
  MON01: [216, 34],
};
const HOST_ICON: Record<string, string> = {
  ADM01: 'laptop', PVE01: 'layers', LAB01: 'flask', ANS01: 'terminal', SIEM01: 'shield', SCAN01: 'radar',
  KALI01: 'crosshair', APP01: 'bot', DC01: 'tree', CA01: 'cert', IDP01: 'key', VAULT01: 'vault',
  WKS01: 'monitor', MON01: 'chart',
};

/* 24px line icons, drawn for this diagram. */
const ICON: Record<string, string> = {
  cloud: '<path d="M7 18.5a4.2 4.2 0 0 1-.7-8.35A5.6 5.6 0 0 1 17.1 9.6a4.5 4.5 0 0 1 .4 8.9z"/>',
  wall: '<rect x="3" y="5" width="18" height="14" rx="1.6"/><path d="M3 9.7h18M3 14.3h18M9 5v4.7M15 5v4.7M6 9.7v4.6M12 9.7v4.6M18 9.7v4.6M9 14.3V19M15 14.3V19"/>',
  switch: '<rect x="2.5" y="7.5" width="19" height="9" rx="2"/><path d="M6.2 12h.01M9.6 12h.01M13 12h.01M16.4 12h.01" stroke-width="2.4"/><path d="M19 10.6v2.8"/>',
  layers: '<path d="M12 3.2 3.2 7.6l8.8 4.4 8.8-4.4z"/><path d="m3.2 12 8.8 4.4 8.8-4.4"/><path d="m3.2 16.4 8.8 4.4 8.8-4.4"/>',
  laptop: '<rect x="5" y="5" width="14" height="10" rx="1.6"/><path d="M2.8 18.8h18.4"/>',
  monitor: '<rect x="3" y="4" width="18" height="12" rx="1.6"/><path d="M9 20h6M12 16v4"/>',
  flask: '<path d="M9.4 3h5.2M10.4 3v6.2l-5 8.9A1.9 1.9 0 0 0 7 21h10a1.9 1.9 0 0 0 1.6-2.9l-5-8.9V3M8 15h8"/>',
  terminal: '<rect x="3" y="4.5" width="18" height="15" rx="2"/><path d="m7 9.5 3 2.5-3 2.5M12.5 15H17"/>',
  shield: '<path d="M12 3l7 2.8v5.6c0 4.3-2.9 7.6-7 9.4-4.1-1.8-7-5.1-7-9.4V5.8z"/><path d="M8.3 12h1.9l1.1-2.4 1.5 4.8 1.1-2.4h1.8"/>',
  radar: '<circle cx="12" cy="12" r="8.6"/><circle cx="12" cy="12" r="4.2"/><path d="m12 12 6-6"/><path d="M12 12h.01" stroke-width="2.6"/>',
  crosshair: '<circle cx="12" cy="12" r="7.4"/><path d="M12 2.6v4.2M12 17.2v4.2M2.6 12h4.2M17.2 12h4.2"/><path d="M12 12h.01" stroke-width="2.6"/>',
  bot: '<rect x="5" y="9" width="14" height="10.5" rx="2.2"/><path d="M12 9V5.6"/><circle cx="12" cy="4.4" r="1.2"/><path d="M9.4 13.4h.01M14.6 13.4h.01" stroke-width="2.4"/><path d="M9.6 16.6h4.8"/>',
  tree: '<rect x="9" y="3" width="6" height="5" rx="1.2"/><rect x="3" y="16" width="6" height="5" rx="1.2"/><rect x="15" y="16" width="6" height="5" rx="1.2"/><path d="M12 8v4M6 16v-4h12v4"/>',
  cert: '<circle cx="12" cy="9" r="5.6"/><path d="m9 13.8-1.4 7 4.4-2.4 4.4 2.4-1.4-7"/><path d="m9.7 9.1 1.6 1.6 3-3.2"/>',
  key: '<circle cx="7.6" cy="15.6" r="4.1"/><path d="M10.6 12.6 20 3.2M16.6 6.6l3 3M13.8 9.4l2.4 2.4"/>',
  vault: '<rect x="3.5" y="4" width="17" height="15" rx="2"/><circle cx="12" cy="11.5" r="3.6"/><path d="M12 7.9v1.3M12 13.8v1.3M8.4 11.5h1.3M14.3 11.5h1.3M7 19v2M17 19v2"/>',
  chart: '<path d="M4 4v16h16"/><path d="m8 15 3.4-4 3 2.4L19 8"/>',
  mesh: '<circle cx="6" cy="6.5" r="2.2"/><circle cx="18" cy="6.5" r="2.2"/><circle cx="12" cy="17.5" r="2.2"/><path d="M8.2 6.5h7.6M7 8.4l3.9 7.2M17 8.4l-3.9 7.2"/>',
};

const esc = (s: string | number) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const r1 = (v: number) => Math.round(v * 10) / 10;
const MONO = 0.6; // JetBrains Mono advance, in em

const zoneOf = (id: number): Zone => ESTATE.zones.find((z) => z.id === id)!;

function icon(name: string, x: number, y: number, size: number, cls = ''): string {
  return `<g class="dg-ic ${cls}" transform="translate(${x} ${y}) scale(${r1(size / 24 * 100) / 100})">${ICON[name] ?? ICON.layers}</g>`;
}

/** A small mono pill, right-aligned at xr. Returns [svg, width]. */
function pill(xr: number, y: number, label: string, cls: string): [string, number] {
  const w = Math.round(label.length * 10.5 * MONO + 13);
  return [`<g class="dg-pill ${cls}"><rect x="${xr - w}" y="${y}" width="${w}" height="16" rx="8"/><text class="dg-m" x="${xr - w / 2}" y="${y + 11.6}" text-anchor="middle">${esc(label)}</text></g>`, w];
}

function boxes(): Record<string, { x: number; y: number; w: number; h: number }> {
  const out: Record<string, { x: number; y: number; w: number; h: number }> = {};
  const used: Record<number, number> = {};
  for (const h of ESTATE.hosts) {
    const [ly] = LANE_Y[h.zone] ?? [412];
    let slot = SLOT[h.name];
    if (!slot) {
      // A host this file has not placed yet: next free column in its lane.
      const n = (used[h.zone] = (used[h.zone] ?? 0) + 1);
      slot = [LANE.x + 16 + ((ESTATE.hosts.filter((o) => o.zone === h.zone && SLOT[o.name]).length + n - 1) % 4) * 200, 34];
    }
    out[h.name] = { x: slot[0], y: ly + slot[1], w: CARD.w, h: CARD.h };
  }
  return out;
}

function hostCard(h: Host, b: { x: number; y: number }): string {
  const z = zoneOf(h.zone);
  const planned = h.state === 'planned';
  const { x, y } = b;
  const parts: string[] = [];
  parts.push(`<rect class="dg-card" x="${x}" y="${y}" width="${CARD.w}" height="${CARD.h}" rx="10"/>`);
  parts.push(`<rect class="dg-acc" x="${x + 1.5}" y="${y + 12}" width="3.5" height="${CARD.h - 24}" rx="1.75"/>`);
  parts.push(`<rect class="dg-tile" x="${x + 12}" y="${y + 10}" width="30" height="30" rx="8"/>`);
  parts.push(icon(HOST_ICON[h.name] ?? 'layers', x + 17, y + 15, 20));
  parts.push(`<text class="dg-m dg-name" x="${x + 50}" y="${y + 31}">${esc(h.name)}</text>`);
  if (h.vm !== undefined) parts.push(pill(x + CARD.w - 8, y + 17, `VM ${h.vm}`, 'dg-vm')[0]);
  parts.push(`<text class="dg-role" x="${x + 13}" y="${y + 56}">${esc(h.role)}</text>`);
  parts.push(`<text class="dg-m dg-ip" x="${x + 13}" y="${y + 74}">${esc(h.ip)}</text>`);
  if (planned) parts.push(pill(x + CARD.w - 8, y + 62, 'planned', 'dg-plan')[0]);
  else if (h.agent) parts.push(pill(x + CARD.w - 8, y + 62, h.agent === 'manager' ? 'manager' : `agent ${h.agent}`, 'dg-agent')[0]);
  const label = `${h.name}, ${h.role}, VLAN ${h.zone} ${z.name}${planned ? ', planned' : ''}`;
  return `<g class="dg-host dg-z${planned ? ' is-planned' : ''}${h.tier0 ? ' is-t0' : ''}" data-host="${h.name}" data-zone="${h.zone}"${planned ? ' data-layer="planned"' : ''}${h.agent ? ' data-mon="1"' : ''} style="--z:${z.css}" tabindex="0" role="button" aria-label="${esc(label)}">${parts.join('')}</g>`;
}

type Pt = [number, number];

/** An orthogonal route with rounded corners and an arrowhead at the last point. */
function arrow(pts: Pt[], cls: string, attrs = ''): string {
  const R = 8, HEAD = 9;
  const u = (a: Pt, b: Pt): Pt => { const dx = b[0] - a[0], dy = b[1] - a[1]; const l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; };
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const cur = pts[i], prev = pts[i - 1], next = pts[i + 1];
    const a = u(prev, cur);
    if (!next) { d += `L${r1(cur[0] - a[0] * (HEAD - 1))} ${r1(cur[1] - a[1] * (HEAD - 1))}`; break; }
    const b = u(cur, next);
    d += `L${r1(cur[0] - a[0] * R)} ${r1(cur[1] - a[1] * R)}Q${cur[0]} ${cur[1]} ${r1(cur[0] + b[0] * R)} ${r1(cur[1] + b[1] * R)}`;
  }
  const end = pts[pts.length - 1], dir = u(pts[pts.length - 2], end);
  const bx = end[0] - dir[0] * HEAD, by = end[1] - dir[1] * HEAD;
  const nx = -dir[1] * 4.4, ny = dir[0] * 4.4;
  const head = `<path class="dg-head" d="M${end[0]} ${end[1]}L${r1(bx + nx)} ${r1(by + ny)}L${r1(bx - nx)} ${r1(by - ny)}z"/>`;
  return `<g class="dg-flow ${cls}" ${attrs}><path class="dg-line" d="${d}"/>${head}`;
}

function flowLabel(x: number, y: number, lines: string[], anchor: 'start' | 'middle' | 'end'): string {
  return lines.map((t, i) => `<text class="dg-lab" x="${x}" y="${y + i * 14}" text-anchor="${anchor}">${esc(t)}</text>`).join('');
}

export function renderDiagram(opts: { standalone?: boolean } = {}): string {
  const B = boxes();
  const hosts = ESTATE.hosts;
  const built = hosts.filter((h) => h.state === 'built').length;
  const agents = hosts.filter((h) => h.agent && h.agent !== 'manager').length;
  const s: string[] = [];

  // ---- masthead ----
  s.push(`<g class="dg-mast">
<g transform="translate(30 16) scale(0.44)" aria-hidden="true">
<path fill="#08152F" d="M12 20C12 14 16 10 22 10h76c6 0 10 4 10 10v54c0 29-20 48-48 58C32 122 12 103 12 74Z"/>
<path fill="none" stroke="#2DD4E8" stroke-width="3.4" d="M20.5 24c0-4 2.6-6.6 6.6-6.6h65.8c4 0 6.6 2.6 6.6 6.6v49c0 24.5-17 40.5-39.5 49.5C37.5 113.5 20.5 97.5 20.5 73Z"/>
<circle cx="60" cy="66" r="23" fill="none" stroke="#2DD4E8" stroke-width="3.4"/>
<g stroke="#2DD4E8" stroke-width="3.2" stroke-linecap="round"><line x1="70.62" y1="70.40" x2="78.02" y2="73.46"/><line x1="64.40" y1="76.62" x2="67.46" y2="84.02"/><line x1="55.60" y1="76.62" x2="52.54" y2="84.02"/><line x1="49.38" y1="70.40" x2="41.98" y2="73.46"/><line x1="49.38" y1="61.60" x2="41.98" y2="58.54"/><line x1="55.60" y1="55.38" x2="52.54" y2="47.98"/><line x1="64.40" y1="55.38" x2="67.46" y2="47.98"/><line x1="70.62" y1="61.60" x2="78.02" y2="58.54"/></g>
<circle cx="60" cy="66" r="7" fill="#7FE9F5"/>
</g>
<text class="dg-m dg-brand" x="96" y="31"><tspan class="dg-brand-b">BIIRA BANK</tspan><tspan dx="10">ENTERPRISE SECURITY ENGINEERING</tspan></text>
<text class="dg-title" x="95" y="60">Network Architecture</text>
<text class="dg-sub" x="96" y="81">pfSense router-on-a-stick · six VLANs · Proxmox VE · Tailscale remote admin · corp.biirabank.com</text>
<text class="dg-asof" x="${W - 30}" y="36" text-anchor="end">As of ${esc(ESTATE.updated)}</text>
<text class="dg-m dg-count" x="${W - 30}" y="58" text-anchor="end">${built} hosts built · ${hosts.length - built} planned · ${agents} agents reporting</text>
<text class="dg-m dg-url" x="${W - 30}" y="80" text-anchor="end">Interactive: nobleantwi.com/architecture/diagram</text>
<path class="dg-rule" d="M30 96H${W - 30}"/>
</g>`);

  // ---- wires (under the nodes) ----
  const laneMid = (id: number) => (id === 50 ? LANE_Y[50][0] + 108 : LANE_Y[id][0] + 76);
  const wires: string[] = [];
  wires.push(`<path class="dg-wire" data-wire="internet fw" d="M115 160V192"/>`);
  wires.push(`<path class="dg-wire dg-ts" data-wire="tailscale fw" d="M315 160V192"/>`);
  wires.push(`<path class="dg-wire dg-trunk" data-wire="fw sw1" d="M105 292V326"/>`);
  wires.push(`<path class="dg-wire dg-trunk" data-wire="sw1 sw2" d="M154 372H236"/>`);
  wires.push(`<path class="dg-wire dg-trunk" data-wire="sw2 PVE01" d="M396 372H462Q470 372 470 364V284"/>`);
  for (const z of ESTATE.zones) {
    const y = laneMid(z.id);
    wires.push(`<g class="dg-z" data-wire="sw1" data-zone="${z.id}" style="--z:${z.css}"><path class="dg-wire dg-access" d="M154 ${y}H${LANE.x}"/><circle class="dg-dot" cx="${LANE.x}" cy="${y}" r="4"/></g>`);
  }
  s.push(`<g data-layer="net">${wires.join('')}
<text class="dg-m dg-wl" x="123" y="181">WAN 10.0.0.105</text>
<text class="dg-m dg-wl dg-ts-t" x="323" y="181">subnet router</text>
<text class="dg-m dg-wl" x="116" y="312">802.1Q trunk · VLANs 10 to 60</text>
<text class="dg-m dg-wl" x="195" y="364" text-anchor="middle">trunk</text>
<text class="dg-m dg-wl" x="431" y="364" text-anchor="middle">trunk</text>
</g>`);

  // ---- lanes ----
  for (const z of ESTATE.zones) {
    const [y, h] = LANE_Y[z.id];
    const ex = ZONE_EXTRA[z.id];
    s.push(`<g class="dg-lane dg-z" data-zone="${z.id}" style="--z:${z.css}">
<rect class="dg-lane-bg" x="${LANE.x}" y="${y}" width="${LANE.r - LANE.x}" height="${h}" rx="14"/>
<g class="dg-lane-head" data-zonehead="${z.id}" tabindex="0" role="button" aria-label="VLAN ${z.id}, ${esc(z.name)}, ${esc(z.subnet)}">
<rect class="dg-vp" x="216" y="${y + 9}" width="66" height="20" rx="10"/><text class="dg-m dg-vp-t" x="249" y="${y + 23.2}" text-anchor="middle">VLAN ${z.id}</text>
<text class="dg-lane-t" x="292" y="${y + 24}"><tspan class="dg-lane-n">${esc(z.name)}</tspan><tspan class="dg-m dg-lane-s" dx="12">${esc(z.subnet)}</tspan><tspan class="dg-lane-p" dx="12">${esc(ex?.purpose ?? '')}</tspan>${ex?.ok ? `<tspan class="dg-lane-ok" dx="14">✓ ${esc(ex.ok)}</tspan>` : ''}</text>
</g></g>`);
  }

  // ---- Tier 0 boundary ----
  const y50 = LANE_Y[50][0];
  s.push(`<g class="dg-t0" data-t0="1"><rect class="dg-t0-box" x="500" y="${y50 + 46}" width="526" height="252" rx="14"/>
<rect class="dg-t0-tab" x="516" y="${y50 + 36}" width="222" height="20" rx="6"/><text class="dg-m dg-t0-t" x="627" y="${y50 + 50}" text-anchor="middle">TIER 0 · IDENTITY AND SECRETS</text></g>`);

  // ---- edge and platform nodes ----
  s.push(`<g class="dg-node" data-node="internet" tabindex="0" role="button" aria-label="Internet, ISP uplink">
<rect class="dg-card" x="30" y="108" width="170" height="52" rx="10"/><rect class="dg-tile dg-tile-n" x="40" y="119" width="30" height="30" rx="8"/>${icon('cloud', 45, 124, 20)}
<text class="dg-nname" x="80" y="131">Internet</text><text class="dg-nsub" x="80" y="148">ISP uplink</text></g>`);
  s.push(`<g class="dg-node" data-node="tailscale" data-layer="net" tabindex="0" role="button" aria-label="Tailscale, remote access overlay">
<rect class="dg-card dg-card-ts" x="230" y="108" width="170" height="52" rx="10"/><rect class="dg-tile dg-tile-ts" x="240" y="119" width="30" height="30" rx="8"/>${icon('mesh', 245, 124, 20, 'dg-ic-ts')}
<text class="dg-nname" x="280" y="131">Tailscale</text><text class="dg-nsub" x="280" y="148">WireGuard mesh</text></g>`);
  s.push(`<g class="dg-node" data-node="fw" tabindex="0" role="button" aria-label="FW01, pfSense firewall">
<rect class="dg-card dg-card-fw" x="30" y="192" width="370" height="100" rx="12"/><rect class="dg-tile dg-tile-fw" x="42" y="204" width="36" height="36" rx="9"/>${icon('wall', 48, 210, 24, 'dg-ic-fw')}
<text class="dg-nname" x="90" y="220"><tspan class="dg-m dg-name">FW01</tspan><tspan dx="9">pfSense 2.9.0 firewall</tspan></text>
<text class="dg-nsub" x="90" y="237">Router-on-a-stick · default deny on every interface</text>
<text class="dg-m dg-ip" x="43" y="262">Gateways 192.168.10.1 to 192.168.60.1</text>
<text class="dg-nsub" x="43" y="280">Hybrid NAT · Unbound DNS · domain lookups forwarded to DC01</text></g>`);

  // The hypervisor and its guests.
  const pve = hosts.find((h) => h.name === 'PVE01');
  const guests = hosts.filter((h) => h.vm !== undefined).sort((a, b) => a.zone - b.zone || (a.vm ?? 0) - (b.vm ?? 0));
  const chips = guests.map((g, i) => {
    const cx = 456 + (i % 4) * 178, cy = 170 + Math.floor(i / 4) * 46;
    const z = zoneOf(g.zone), planned = g.state === 'planned';
    return `<g class="dg-vmchip dg-z${planned ? ' is-planned' : ''}" data-host="${g.name}" data-chip="1"${planned ? ' data-layer="planned"' : ''} style="--z:${z.css}">
<rect class="dg-card" x="${cx}" y="${cy}" width="166" height="40" rx="8"/><rect class="dg-acc" x="${cx + 1.5}" y="${cy + 8}" width="3.5" height="24" rx="1.75"/>
<text class="dg-m dg-chip-n" x="${cx + 14}" y="${cy + 17}">${esc(g.name)}</text><text class="dg-m dg-chip-s" x="${cx + 14}" y="${cy + 32}">VM ${g.vm} · VLAN ${g.zone}</text></g>`;
  }).join('');
  const zp = zoneOf(10);
  s.push(`<g class="dg-hyp dg-z" style="--z:${zp.css}">
<g class="dg-node" data-host="PVE01" data-chip="1" tabindex="-1">
<rect class="dg-card dg-card-hyp" x="440" y="108" width="730" height="184" rx="12"/><rect class="dg-tile" x="452" y="118" width="36" height="36" rx="9"/>${icon('layers', 458, 124, 24)}
<text class="dg-nname" x="500" y="134"><tspan class="dg-m dg-name">PVE01</tspan><tspan dx="9">Proxmox VE hypervisor</tspan></text>
<text class="dg-nsub" x="500" y="151">8 cores · 32 GB · 2.67 TB · every guest backed up nightly</text>
<text class="dg-m dg-ip" x="1158" y="134" text-anchor="end">${esc(pve?.ip ?? '')} · VLAN 10</text>
${pve?.agent ? pill(1158, 141, `agent ${pve.agent}`, 'dg-agent')[0] : ''}
<rect class="dg-bridge" x="456" y="264" width="700" height="20" rx="6"/><text class="dg-m dg-bridge-t" x="806" y="278" text-anchor="middle">vmbr0 · VLAN-aware bridge · each guest lands on its network by tag</text>
</g>${chips}</g>`);

  // Switch 1, the spine: one port per lane.
  const swTop = 326, swBot = LANE_Y[60][0] + LANE_Y[60][1];
  const ports: string[] = [];
  ports.push(`<rect class="dg-port" x="93" y="${swTop + 6}" width="24" height="20" rx="4"/><text class="dg-m dg-port-n" x="84" y="${swTop + 20.5}" text-anchor="end">P1</text>`);
  ports.push(`<rect class="dg-port" x="130" y="361" width="24" height="22" rx="4"/><text class="dg-m dg-port-n" x="122" y="371" text-anchor="end">P2</text><text class="dg-m dg-port-s" x="122" y="384" text-anchor="end">trunk</text>`);
  for (const z of ESTATE.zones) {
    const y = laneMid(z.id);
    ports.push(`<g class="dg-z" data-zone="${z.id}" style="--z:${z.css}"><rect class="dg-port dg-port-z" x="130" y="${y - 11}" width="24" height="22" rx="4"/><circle class="dg-led" cx="142" cy="${y}" r="3.2"/><text class="dg-m dg-port-n" x="122" y="${y - 1}" text-anchor="end">P${ZONE_EXTRA[z.id]?.port ?? ''}</text><text class="dg-m dg-port-s" x="122" y="${y + 12}" text-anchor="end">VLAN ${z.id}</text></g>`);
  }
  const swMid = Math.round((swTop + swBot) / 2) + 60;
  s.push(`<g class="dg-node dg-sw" data-node="sw1" tabindex="0" role="button" aria-label="Switch 1, TP-Link TL-SG108E">
<rect class="dg-card dg-card-sw" x="46" y="${swTop}" width="118" height="${swBot - swTop}" rx="14"/>
<text class="dg-m dg-sw-t" transform="translate(66 ${swMid}) rotate(-90)" text-anchor="middle">SWITCH 1 · TP-LINK TL-SG108E · 8-PORT MANAGED · 802.1Q</text>
${ports.join('')}</g>`);
  s.push(`<g class="dg-node" data-node="sw2" tabindex="0" role="button" aria-label="Switch 2, trunk to Proxmox">
<rect class="dg-card" x="236" y="346" width="160" height="52" rx="10"/><rect class="dg-tile dg-tile-n" x="246" y="357" width="30" height="30" rx="8"/>${icon('switch', 251, 362, 20)}
<text class="dg-nname" x="286" y="369">Switch 2</text><text class="dg-nsub" x="286" y="386">trunk to Proxmox</text></g>`);

  // ---- hosts ----
  for (const h of hosts) s.push(hostCard(h, B[h.name]));

  // ---- trust flows ----
  const c = (n: string) => ({ ...B[n], cx: B[n].x + CARD.w / 2, cy: B[n].y + CARD.h / 2, r: B[n].x + CARD.w, b: B[n].y + CARD.h });
  const G = 3; // gap between an arrowhead and the card it points at
  const ROUTE: Record<string, { pts: Pt[]; lab: [number, number, 'start' | 'middle' | 'end']; lines?: string[] }> = {
    'IDP01>DC01': { pts: [[c('IDP01').x, c('IDP01').cy], [c('DC01').r + G, c('DC01').cy]], lab: [(c('IDP01').x + c('DC01').r) / 2, c('DC01').cy - 8, 'middle'] },
    'WKS01>DC01': { pts: [[c('WKS01').r, c('WKS01').cy], [c('DC01').x - G, c('DC01').cy]], lab: [(c('WKS01').r + 500) / 2, c('DC01').cy - 8, 'middle'] },
    'CA01>DC01': { pts: [[c('CA01').x + 62, c('CA01').y], [c('DC01').x + 62, c('DC01').b + G]], lab: [c('CA01').x + 70, c('CA01').y - 36, 'start'] },
    'CA01>IDP01': { pts: [[c('CA01').x + 146, c('CA01').y], [c('CA01').x + 146, c('CA01').y - 24], [c('IDP01').x + 56, c('CA01').y - 24], [c('IDP01').x + 56, c('IDP01').b + G]], lab: [(c('CA01').r + c('IDP01').x) / 2 + 12, c('CA01').y - 31, 'middle'] },
    'CA01>VAULT01': { pts: [[c('CA01').r, c('CA01').cy], [c('VAULT01').x - G, c('VAULT01').cy]], lab: [(c('CA01').r + c('VAULT01').x) / 2, c('CA01').cy - 8, 'middle'] },
    'APP01>IDP01': { pts: [[c('APP01').cx, c('APP01').b], [c('IDP01').cx, c('IDP01').y - G]], lab: [c('APP01').cx - 9, y50 + 26, 'end'] },
    'APP01>VAULT01': { pts: [[c('APP01').r, c('APP01').cy], [1054, c('APP01').cy], [1054, c('VAULT01').cy], [c('VAULT01').r + G, c('VAULT01').cy]], lab: [1064, y50 + 160, 'start'], lines: ['token in,', 'secret out', '(planned)'] },
    'APP01>SIEM01': { pts: [[c('APP01').cx, c('APP01').y], [c('SIEM01').cx, c('SIEM01').b + G]], lab: [c('APP01').cx + 10, LANE_Y[30][0] + 72, 'start'] },
  };
  const flows: string[] = [];
  for (const l of ESTATE.links) {
    if (!B[l.from] || !B[l.to]) continue;
    const key = `${l.from}>${l.to}`;
    const rt = ROUTE[key] ?? { pts: [[c(l.from).cx, c(l.from).cy], [c(l.to).cx, c(l.to).cy]] as Pt[], lab: [(c(l.from).cx + c(l.to).cx) / 2, (c(l.from).cy + c(l.to).cy) / 2 - 8, 'middle'] as [number, number, 'middle'] };
    const layer = l.planned ? 'flow planned' : 'flow';
    flows.push(`${arrow(rt.pts, `dg-k-${l.kind}${l.planned ? ' is-planned' : ''}`, `data-link="${key}" data-from="${l.from}" data-to="${l.to}" data-layer="${layer}"`)}${flowLabel(rt.lab[0], rt.lab[1], rt.lines ?? [l.label], rt.lab[2])}</g>`);
  }
  s.push(`<g class="dg-flows">${flows.join('')}</g>`);

  // ---- legend ----
  const lx = 520, ly = 312;
  const sample = (x: number, y: number, cls: string, head = false) => head
    ? `<g class="dg-flow ${cls}"><path class="dg-line" d="M${x} ${y}H${x + 20}"/><path class="dg-head" d="M${x + 28} ${y}L${x + 19} ${y + 4.4}L${x + 19} ${y - 4.4}z"/></g>`
    : `<path class="dg-wire ${cls}" d="M${x} ${y}H${x + 28}"/>`;
  const lt = (x: number, y: number, t: string) => `<text class="dg-leg-t" x="${x}" y="${y + 4}">${esc(t)}</text>`;
  s.push(`<g class="dg-legend" aria-label="Legend">
<rect class="dg-card dg-leg-box" x="${lx}" y="${ly}" width="${LANE.r - lx}" height="88" rx="10"/>
${sample(lx + 16, ly + 22, 'dg-trunk')}${lt(lx + 52, ly + 22, '802.1Q trunk')}
<g class="dg-z" style="--z:${zoneOf(50).css}">${sample(lx + 150, ly + 22, 'dg-access')}</g>${lt(lx + 186, ly + 22, 'Access port, one VLAN')}
${sample(lx + 334, ly + 22, 'dg-ts')}${lt(lx + 370, ly + 22, 'WireGuard overlay')}
<rect class="dg-leg-plan" x="${lx + 494}" y="${ly + 15}" width="28" height="14" rx="4"/>${lt(lx + 530, ly + 22, 'Planned, not built')}
${sample(lx + 16, ly + 44, 'dg-k-identity', true)}${lt(lx + 52, ly + 44, 'Sign-in, directory')}
${sample(lx + 174, ly + 44, 'dg-k-cert', true)}${lt(lx + 210, ly + 44, 'Certificate issued')}
${sample(lx + 334, ly + 44, 'dg-k-agent', true)}${lt(lx + 370, ly + 44, 'AI agent call')}
<rect class="dg-t0-box" x="${lx + 494}" y="${ly + 37}" width="28" height="14" rx="4"/>${lt(lx + 530, ly + 44, 'Tier 0 boundary')}
${pill(lx + 16 + 70, ly + 59, 'agent 001', 'dg-agent')[0]}${lt(lx + 94, ly + 67, 'Reports to the SIEM')}
${pill(lx + 232 + 51, ly + 59, 'VM 105', 'dg-vm')[0]}${lt(lx + 291, ly + 67, 'Proxmox guest')}
<text class="dg-leg-t dg-lane-ok" x="${lx + 398}" y="${ly + 71}">✓</text>${lt(lx + 414, ly + 67, 'Ruleset written and tested')}
</g>`);

  // ---- footer ----
  s.push(`<text class="dg-foot" x="30" y="${H - 16}">Biira Bank is a fictional bank. Addresses are private lab addresses. Drawn from the same host list as the 3D walkthrough.</text>
<text class="dg-m dg-foot" x="${W - 30}" y="${H - 16}" text-anchor="end">nobleantwi.com/architecture</text>`);

  const desc = `The Biira Bank security lab. Internet and a Tailscale overlay reach a pfSense firewall, which trunks six VLANs to a managed switch. Each access port feeds one zone: ${ESTATE.zones.map((z) => `VLAN ${z.id} ${z.name} with ${hosts.filter((h) => h.zone === z.id).map((h) => h.name).join(', ')}`).join('; ')}. DC01, CA01, IDP01 and VAULT01 form the Tier 0 group.`;
  const attrs = opts.standalone
    ? `xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"`
    : 'id="dg-svg" preserveAspectRatio="xMidYMid meet"';
  return `<svg ${attrs} viewBox="0 0 ${W} ${H}" class="dg" role="img" aria-labelledby="dg-title dg-desc">
<title id="dg-title">Biira Bank network architecture, as of ${esc(ESTATE.updated)}</title>
<desc id="dg-desc">${esc(desc)}</desc>
<style>${STYLE}</style>
<defs><pattern id="dg-grid" width="20" height="20" patternUnits="userSpaceOnUse"><circle class="dg-griddot" cx="1" cy="1" r="1"/></pattern></defs>
<rect class="dg-bg" width="${W}" height="${H}"/><rect width="${W}" height="${H}" fill="url(#dg-grid)"/>
${s.join('\n')}
</svg>`;
}

/* Flat fills only. Zone colour is reinforcement: every zone is also named. */
const STYLE = `
.dg{--bg:#f6f8fb;--dot:#d3dae5;--card:#ffffff;--ink:#0f172a;--ink2:#334155;--ink3:#64748b;--line:#cbd5e1;--wire:#475569;--id:#4338ca;--cert:#0f766e;--agent:#b45309;--ts:#be185d;--plan:#b45309;--ok:#15803d;--mon:#0f766e;font-family:'Inter Variable',Inter,'Segoe UI',system-ui,-apple-system,sans-serif}
.dg text{fill:var(--ink);font-size:12px}
.dg .dg-m{font-family:'JetBrains Mono Variable','JetBrains Mono','Cascadia Code',Consolas,monospace}
.dg-z{--zi:color-mix(in srgb,var(--z) 72%,var(--ink));--zf:color-mix(in srgb,var(--z) 13%,var(--card))}
.dg-bg{fill:var(--bg)}.dg-griddot{fill:var(--dot)}
.dg-rule{stroke:var(--line);stroke-width:1}
.dg .dg-brand{font-size:10.5px;letter-spacing:.14em;fill:var(--ink3);font-weight:500}.dg .dg-brand-b{fill:var(--ink);font-weight:700}
.dg .dg-title{font-size:27px;font-weight:800;letter-spacing:-.02em}
.dg .dg-sub{font-size:12.5px;fill:var(--ink2)}
.dg .dg-asof{font-size:13px;font-weight:700}
.dg .dg-count,.dg .dg-url{font-size:11px;fill:var(--ink3)}
.dg-card{fill:var(--card);stroke:var(--line);stroke-width:1.25}
.dg-card-fw{stroke:var(--ink2);stroke-width:1.6}
.dg-card-hyp{fill:var(--zf);stroke:var(--z);stroke-opacity:.7}
.dg-card-ts{stroke:var(--ts);stroke-opacity:.6;stroke-dasharray:5 4}
.dg-card-sw{stroke:var(--ink2);stroke-width:1.6}
.dg-acc{fill:var(--z)}
.dg-tile{fill:var(--zf)}.dg-tile-n{fill:color-mix(in srgb,var(--ink) 7%,var(--card))}.dg-tile-fw{fill:color-mix(in srgb,#dc2626 12%,var(--card))}.dg-tile-ts{fill:color-mix(in srgb,var(--ts) 12%,var(--card))}
.dg-ic{fill:none;stroke:var(--zi,var(--ink2));stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.dg-ic-fw{stroke:color-mix(in srgb,#dc2626 75%,var(--ink))}.dg-ic-ts{stroke:var(--ts)}
.dg .dg-name{font-size:15px;font-weight:700;letter-spacing:-.01em}
.dg .dg-role{font-size:11.5px;font-weight:500;fill:var(--ink2)}
.dg .dg-ip{font-size:11.5px;fill:var(--ink3)}
.dg .dg-nname{font-size:14px;font-weight:700}.dg .dg-nname tspan:not(.dg-m){font-weight:600}
.dg .dg-nsub{font-size:11.5px;fill:var(--ink3)}
.dg-pill rect{fill:color-mix(in srgb,var(--ink) 6%,var(--card));stroke:var(--line);stroke-width:1}
.dg .dg-pill text{font-size:10.5px;fill:var(--ink2);font-weight:500}
.dg-agent rect{fill:color-mix(in srgb,var(--mon) 11%,var(--card));stroke:color-mix(in srgb,var(--mon) 45%,var(--card))}.dg .dg-agent text{fill:var(--mon)}
.dg-plan rect{fill:color-mix(in srgb,var(--plan) 10%,var(--card));stroke:color-mix(in srgb,var(--plan) 50%,var(--card))}.dg .dg-plan text{fill:var(--plan)}
.is-planned>.dg-card{stroke:var(--plan);stroke-dasharray:6 4;fill:color-mix(in srgb,var(--card) 55%,var(--bg))}
.is-planned>.dg-acc{opacity:.45}.dg .is-planned>.dg-name,.dg .is-planned>.dg-role,.dg .is-planned>.dg-chip-n{fill:var(--ink3)}
.dg-lane-bg{fill:color-mix(in srgb,var(--z) 5%,var(--bg));stroke:color-mix(in srgb,var(--z) 55%,var(--bg));stroke-width:1.25}
.dg-vp{fill:var(--zf);stroke:color-mix(in srgb,var(--z) 60%,var(--card));stroke-width:1}
.dg .dg-vp-t{font-size:11px;font-weight:700;fill:var(--zi)}
.dg .dg-lane-n{font-size:14px;font-weight:700;fill:var(--zi)}
.dg .dg-lane-s{font-size:11.5px;fill:var(--ink3)}.dg .dg-lane-p{font-size:12px;fill:var(--ink2)}
.dg .dg-lane-ok{font-size:11.5px;font-weight:600;fill:var(--ok)}
.dg-t0-box{fill:color-mix(in srgb,var(--ink) 3%,transparent);stroke:var(--ink2);stroke-width:1.5;stroke-dasharray:7 5}
.dg-t0-tab{fill:var(--ink)}.dg .dg-t0-t{font-size:10.5px;font-weight:700;letter-spacing:.06em;fill:var(--bg)}
.dg-wire{fill:none;stroke:var(--wire);stroke-width:2.2;stroke-linecap:round}
.dg-trunk{stroke-width:5}
.dg-access{stroke:var(--z);stroke-width:3.2}
.dg-ts{stroke:var(--ts);stroke-dasharray:5 5;stroke-width:2.2}
.dg-dot{fill:var(--z);stroke:var(--bg);stroke-width:1.5}
.dg .dg-wl{font-size:10.5px;fill:var(--ink3)}.dg .dg-ts-t{fill:var(--ts)}
.dg-port{fill:var(--bg);stroke:var(--ink3);stroke-width:1.25}.dg-port-z{stroke:var(--zi)}
.dg-led{fill:var(--z)}
.dg .dg-port-n{font-size:12px;font-weight:700}.dg .dg-port-s{font-size:9.5px;fill:var(--ink3)}
.dg .dg-sw-t{font-size:10px;letter-spacing:.14em;fill:var(--ink3)}
.dg-bridge{fill:color-mix(in srgb,var(--z) 16%,var(--card));stroke:color-mix(in srgb,var(--z) 55%,var(--card));stroke-width:1}
.dg .dg-bridge-t{font-size:10.5px;fill:var(--zi);font-weight:500}
.dg .dg-chip-n{font-size:12.5px;font-weight:700}.dg .dg-chip-s{font-size:10px;fill:var(--ink3)}
.dg-flow .dg-line{fill:none;stroke:var(--k);stroke-width:2;stroke-linecap:round}
.dg-flow .dg-head{fill:var(--k)}
.dg .dg-flow .dg-lab{font-size:11.5px;font-weight:600;fill:var(--k);paint-order:stroke;stroke:var(--bg);stroke-width:4px;stroke-linejoin:round}
.dg-k-identity{--k:var(--id)}.dg-k-cert{--k:var(--cert)}.dg-k-agent{--k:var(--agent)}
.dg-flow.is-planned .dg-line{stroke-dasharray:6 5}
.dg-leg-box{fill:var(--card)}
.dg .dg-leg-t{font-size:11.5px;fill:var(--ink2)}
.dg-leg-plan{fill:none;stroke:var(--plan);stroke-width:1.5;stroke-dasharray:5 3}
.dg .dg-foot{font-size:11px;fill:var(--ink3)}
`.replace(/\n/g, '');
