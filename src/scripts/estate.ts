// @ts-nocheck
/* The living architecture at /architecture/. One world, built from
   src/data/estate.ts: six VLAN slabs, the hosts, the pfSense wall, the
   Tailscale tunnels, the trust links, the log streams. The camera flies
   scene to scene on scroll; any host can be clicked for its card; the last
   scene hands the camera to the visitor. Same look as the homepage world. */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ESTATE, SCENES } from '../data/estate';

export function startEstate(root: HTMLElement) {
  const T = THREE;
  const canvas = root.querySelector('.es-canvas') as HTMLCanvasElement;
  const scroller = root;
  const panels = Array.from(root.querySelectorAll<HTMLElement>('.es-panel'));
  const railBtns = Array.from(root.querySelectorAll<HTMLButtonElement>('.es-rail button'));
  const bar = root.querySelector<HTMLElement>('.es-progress i')!;
  const hint = root.querySelector<HTMLElement>('.es-hint')!;
  const cardEl = root.querySelector<HTMLElement>('.es-card')!;
  const exploreBar = root.querySelector<HTMLElement>('.es-explore')!;
  const zoneOf = (id) => ESTATE.zones.find((z) => z.id === id);

  const renderer = new T.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;

  const scene = new T.Scene();
  const NIGHT = 0x060b16;
  scene.background = new T.Color(NIGHT);
  scene.fog = new T.Fog(NIGHT, 30, 78);
  const camera = new T.PerspectiveCamera(42, 1, 0.1, 220);
  const PI = Math.PI;
  scene.add(new T.HemisphereLight(0xbfdbfe, 0x020617, 0.42 * PI));
  const sun = new T.DirectionalLight(0xffffff, 0.75 * PI); sun.position.set(-8, 18, 12); scene.add(sun);
  const rimLight = new T.DirectionalLight(0x2dd4bf, 0.35 * PI); rimLight.position.set(10, 6, -14); scene.add(rimLight);

  const MONO = "'JetBrains Mono Variable', 'JetBrains Mono', Consolas, monospace", SANS = "'Inter Variable', Inter, 'Segoe UI', sans-serif";
  function roundRect(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
  /* a floating label on a soft dark plate, so it reads at any distance */
  function sprite(text, sub, color, scale) {
    const w = 640, h = sub ? 176 : 104;
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d');
    const f1 = (s) => '800 ' + s + 'px ' + SANS, f2 = (s) => '600 ' + s + 'px ' + MONO;
    let s1 = 60, s2 = 30;
    g.font = f1(s1); while (g.measureText(text).width > w - 64 && s1 > 20) { s1--; g.font = f1(s1); }
    const tw1 = g.measureText(text).width;
    let tw2 = 0;
    if (sub) { g.font = f2(s2); while (g.measureText(sub).width > w - 64 && s2 > 14) { s2--; g.font = f2(s2); } tw2 = g.measureText(sub).width; }
    if (text.trim()) {
      const bw = Math.min(w - 6, Math.max(tw1, tw2) + 48), bx = (w - bw) / 2;
      g.fillStyle = 'rgba(6, 11, 22, 0.74)'; roundRect(g, bx, 5, bw, h - 10, 24); g.fill();
      g.strokeStyle = 'rgba(148, 163, 184, 0.30)'; g.lineWidth = 2; g.stroke();
    }
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = '#f8fafc'; g.font = f1(s1); g.fillText(text, w / 2, sub ? 60 : h / 2);
    if (sub) { g.fillStyle = color || '#94a3b8'; g.font = f2(s2); g.fillText(sub, w / 2, 130); }
    const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 4;
    const s = new T.Sprite(new T.SpriteMaterial({ map: t, transparent: true, depthTest: false, opacity: 0 }));
    const k = scale || 1; s.scale.set(2.7 * k, 2.7 * k * h / w, 1); s.renderOrder = 10;
    return s;
  }
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const ease = (x) => { x = clamp(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  const lerp = (a, b, t) => a + (b - a) * t;
  const V = (a) => new T.Vector3(a[0], a[1], a[2]);
  const hex = (n) => '#' + n.toString(16).padStart(6, '0');

  /* zones */
  const FW_Z = -7;
  const zoneObjs = ESTATE.zones.map((z, i) => {
    const g = new T.Group(); g.position.set(z.x, 0, 0);
    const mat = new T.MeshStandardMaterial({ color: 0x0b1324, roughness: 0.7, metalness: 0.25, emissive: new T.Color(z.color), emissiveIntensity: 0.05, transparent: true, opacity: 1 });
    g.add(new T.Mesh(new T.BoxGeometry(5, 0.22, 5), mat));
    const rim = new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(5.02, 0.24, 5.02)), new T.LineBasicMaterial({ color: z.color, transparent: true, opacity: 0.85 }));
    g.add(rim);
    const glow = new T.Mesh(new T.PlaneGeometry(6.4, 6.4), new T.MeshBasicMaterial({ color: z.color, transparent: true, opacity: 0.05, depthWrite: false, toneMapped: false }));
    glow.rotation.x = -PI / 2; glow.position.y = -0.14; g.add(glow);
    const lab = sprite('VLAN ' + z.id, z.name, hex(z.color), 0.85);
    lab.position.set(0, -0.15, 3.3); g.add(lab);
    scene.add(g);
    return { z, g, mat, rim, glow, lab, delay: i * 0.12 };
  });

  /* hosts */
  const hostObjs = {};
  const pickables = [];
  ESTATE.hosts.forEach((h, i) => {
    const z = zoneOf(h.zone);
    const planned = h.state === 'planned';
    const g = new T.Group(); g.position.set(h.at[0], 0.11, h.at[1]);
    const mat = new T.MeshStandardMaterial({ color: planned ? 0x0b1324 : 0x111a2e, roughness: 0.4, metalness: 0.5, emissive: new T.Color(z.color), emissiveIntensity: planned ? 0.04 : 0.18, transparent: true, opacity: planned ? 0.35 : 1 });
    const body = new T.Mesh(new T.BoxGeometry(0.9, h.h, 0.9), mat); body.position.y = h.h / 2; g.add(body);
    body.userData.host = h.name; pickables.push(body);
    let edges;
    const eg = new T.EdgesGeometry(new T.BoxGeometry(0.92, h.h + 0.02, 0.92));
    if (planned) { edges = new T.LineSegments(eg, new T.LineDashedMaterial({ color: 0xfbbf24, dashSize: 0.12, gapSize: 0.09, transparent: true, opacity: 0.9 })); edges.computeLineDistances(); }
    else edges = new T.LineSegments(eg, new T.LineBasicMaterial({ color: z.color, transparent: true, opacity: 0.8 }));
    edges.position.y = h.h / 2; g.add(edges);
    const cap = new T.Mesh(new T.BoxGeometry(0.9, 0.035, 0.9), new T.MeshBasicMaterial({ color: planned ? 0xfbbf24 : z.color, transparent: true, opacity: planned ? 0.25 : 0.55, toneMapped: false }));
    cap.position.y = h.h + 0.02; g.add(cap);
    const ring = new T.Mesh(new T.RingGeometry(0.78, 0.9, 48), new T.MeshBasicMaterial({ color: z.color, transparent: true, opacity: 0, side: T.DoubleSide, toneMapped: false, depthWrite: false }));
    ring.rotation.x = -PI / 2; ring.position.y = 0.02; g.add(ring);
    const lab = sprite(h.name, planned ? 'planned · ' + h.role : h.role, planned ? '#fbbf24' : null, 0.8);
    lab.position.set(0, h.h + 0.72, 0); g.add(lab);
    scene.add(g);
    hostObjs[h.name] = { h, z, g, mat, edges, cap, ring, lab, top: () => new T.Vector3(h.at[0], 0.11 + h.h + 0.05, h.at[1]), delay: 0.5 + i * 0.05 };
  });

  /* Tier 0 boundary on VLAN 50 */
  const t0pts = [[6.75, -2.35], [11.3, -2.35], [11.3, 1.0], [6.75, 1.0], [6.75, -2.35]].map((p) => new T.Vector3(p[0], 0.16, p[1]));
  const t0line = new T.Line(new T.BufferGeometry().setFromPoints(t0pts), new T.LineDashedMaterial({ color: 0x2dd4bf, dashSize: 0.25, gapSize: 0.15, transparent: true, opacity: 0 }));
  t0line.computeLineDistances(); scene.add(t0line);
  const t0lab = sprite('TIER 0', 'identity and secrets', '#2dd4bf', 0.75); t0lab.position.set(6.6, 0.5, -2.95); scene.add(t0lab);

  /* pfSense wall and trunk */
  const wallMat = new T.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.1, metalness: 0.1, transparent: true, opacity: 0.16, emissive: 0x334155, emissiveIntensity: 0.2 });
  const wall = new T.Mesh(new T.BoxGeometry(37, 3.2, 0.16), wallMat); wall.position.set(0, 1.6, FW_Z); scene.add(wall);
  const wallRim = new T.LineSegments(new T.EdgesGeometry(wall.geometry), new T.LineBasicMaterial({ color: 0x64748b, transparent: true, opacity: 0.55 }));
  wallRim.position.copy(wall.position); scene.add(wallRim);
  const fwLab = sprite('FW01 · pfSense 2.9.0', 'default deny on every interface', '#94a3b8', 1.35); fwLab.position.set(0, 4.1, FW_Z); scene.add(fwLab);
  const trunkMat = new T.LineBasicMaterial({ color: 0x2dd4bf, transparent: true, opacity: 0 });
  const seg = (a, b) => scene.add(new T.Line(new T.BufferGeometry().setFromPoints([V(a), V(b)]), trunkMat));
  seg([0, 0.4, FW_Z], [0, -0.5, -4.2]); seg([-15, -0.5, -4.2], [15, -0.5, -4.2]);
  ESTATE.zones.forEach((z) => seg([z.x, -0.5, -4.2], [z.x, -0.12, -2.5]));
  const trunkLab = sprite('802.1Q trunk', 'tagged 10 to 60', '#2dd4bf', 0.8); trunkLab.position.set(0, -0.15, -4.7); scene.add(trunkLab);
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const sparks = [];
  for (let i = 0; i < 46; i++) {
    const m = new T.Mesh(new T.PlaneGeometry(0.14, 0.14), new T.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0, side: T.DoubleSide, toneMapped: false, depthWrite: false }));
    m.position.set(-17 + rnd() * 34, 0.5 + rnd() * 2.4, FW_Z - 0.1); scene.add(m);
    sparks.push({ m, phase: rnd() * 6.28, speed: 0.6 + rnd() * 1.6 });
  }

  /* outside: the admin's devices and the tunnels */
  const OUT = [[-4.5, 1.2, -17], [3.5, 1.2, -18]];
  const devices = OUT.map((p, i) => {
    const g = new T.Group(); g.position.set(p[0], p[1], p[2]);
    const m = new T.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.3, metalness: 0.6, emissive: 0x2dd4bf, emissiveIntensity: 0.15, transparent: true, opacity: 0 });
    g.add(new T.Mesh(i === 0 ? new T.BoxGeometry(1.2, 0.06, 0.8) : new T.BoxGeometry(0.36, 0.7, 0.05), m));
    if (i === 0) { const lid = new T.Mesh(new T.BoxGeometry(1.2, 0.78, 0.04), m); lid.position.set(0, 0.4, -0.4); lid.rotation.x = -0.25; g.add(lid); }
    scene.add(g);
    const lab = sprite(i === 0 ? 'Admin laptop' : 'Phone', i === 0 ? 'Tailscale, own address' : 'Tailscale, own address', '#2dd4bf', 0.8);
    lab.position.set(p[0], p[1] + 1.3, p[2]); scene.add(lab);
    return { g, m, lab };
  });
  const tunnels = OUT.map((p, i) => {
    const tgt = hostObjs[['IDP01', 'DC01'][i]].top();
    const curve = new T.CatmullRomCurve3([V(p), new T.Vector3(p[0] * 0.5 + 1, 2.4, FW_Z - 0.2), new T.Vector3(1.5 + i * 2, 2.2, FW_Z + 0.3), new T.Vector3(tgt.x - 1.5, 2.5, tgt.z - 1.5), tgt]);
    const pts = curve.getPoints(120);
    const geo = new T.BufferGeometry().setFromPoints(pts); geo.setDrawRange(0, 0);
    const line = new T.Line(geo, new T.LineBasicMaterial({ color: 0x2dd4bf, transparent: true, opacity: 0.85 })); scene.add(line);
    return { geo, line, n: pts.length };
  });
  const gateRing = new T.Mesh(new T.RingGeometry(0.42, 0.54, 48), new T.MeshBasicMaterial({ color: 0x22c55e, transparent: true, opacity: 0, side: T.DoubleSide, toneMapped: false, depthWrite: false }));
  gateRing.position.set(2.5, 2.2, FW_Z + 0.1); scene.add(gateRing);
  const gateLab = sprite('Tailscale', 'routed, real source IP', '#22c55e', 0.75); gateLab.position.set(2.5, 3.15, FW_Z + 0.1); scene.add(gateLab);

  /* hypervisor arcs */
  const pve = hostObjs.PVE01.top();
  const vmArcs = ESTATE.hosts.filter((h) => h.vm).map((h) => {
    const t = hostObjs[h.name].top();
    const curve = new T.QuadraticBezierCurve3(pve, new T.Vector3((pve.x + t.x) / 2, 4.2 + Math.abs(t.x - pve.x) * 0.12, (pve.z + t.z) / 2 - 1.2), t);
    const pts = curve.getPoints(90);
    const geo = new T.BufferGeometry().setFromPoints(pts); geo.setDrawRange(0, 0);
    const planned = h.state === 'planned';
    const mat = planned ? new T.LineDashedMaterial({ color: 0xa78bfa, dashSize: 0.2, gapSize: 0.14, transparent: true, opacity: 0.7 }) : new T.LineBasicMaterial({ color: 0xa78bfa, transparent: true, opacity: 0.7 });
    const line = new T.Line(geo, mat); if (planned) line.computeLineDistances();
    scene.add(line);
    return { geo, n: pts.length, mat };
  });

  /* trust links */
  const KIND = { identity: 0x60a5fa, cert: 0x2dd4bf, agent: 0xfbbf24 };
  const links = ESTATE.links.map((l, i) => {
    const a = hostObjs[l.from].top(), b = hostObjs[l.to].top();
    const d = a.distanceTo(b);
    const curve = new T.QuadraticBezierCurve3(a, new T.Vector3((a.x + b.x) / 2, Math.max(a.y, b.y) + 0.6 + d * 0.22, (a.z + b.z) / 2), b);
    const pts = curve.getPoints(80);
    const geo = new T.BufferGeometry().setFromPoints(pts); geo.setDrawRange(0, 0);
    const mat = l.planned ? new T.LineDashedMaterial({ color: KIND[l.kind], dashSize: 0.18, gapSize: 0.13, transparent: true, opacity: 0.95 }) : new T.LineBasicMaterial({ color: KIND[l.kind], transparent: true, opacity: 0.95 });
    const line = new T.Line(geo, mat); if (l.planned) line.computeLineDistances();
    scene.add(line);
    const firstCert = l.kind === 'cert' && ESTATE.links.findIndex((x) => x.kind === 'cert') === i;
    const text = l.kind === 'cert' ? (firstCert ? 'certificates from CA01' : '') : l.label;
    const lab = sprite(text || ' ', l.planned ? 'next' : null, '#fbbf24', 0.58);
    const lp = curve.getPoint(0.5); lab.position.set(lp.x, lp.y + 0.38, lp.z); scene.add(lab);
    const pulse = new T.Mesh(new T.SphereGeometry(0.075, 14, 14), new T.MeshBasicMaterial({ color: KIND[l.kind], transparent: true, opacity: 0, toneMapped: false }));
    scene.add(pulse);
    return { l, curve, geo, n: pts.length, mat, lab, pulse, phase: i * 0.37 };
  });

  /* log particles: every agent host to SIEM01 */
  const siem = hostObjs.SIEM01.top();
  const logCurves = ESTATE.hosts.filter((h) => h.agent && h.agent !== 'manager').map((h) => {
    const a = hostObjs[h.name].top(); const d = a.distanceTo(siem);
    return new T.QuadraticBezierCurve3(a, new T.Vector3((a.x + siem.x) / 2, 2 + d * 0.18, (a.z + siem.z) / 2 + 1.5), siem);
  });
  const logs = [];
  for (let i = 0; i < 84; i++) {
    const m = new T.Mesh(new T.SphereGeometry(0.085, 10, 10), new T.MeshBasicMaterial({ color: i % 9 === 0 ? 0xf59e0b : 0x5eead4, transparent: true, opacity: 0, toneMapped: false, depthWrite: false }));
    scene.add(m); logs.push({ m, c: i % logCurves.length, t0: rnd(), speed: 0.12 + rnd() * 0.12 });
  }
  const beacon = new T.Mesh(new T.CylinderGeometry(0.05, 0.05, 6, 8, 1, true), new T.MeshBasicMaterial({ color: 0x14b8a6, transparent: true, opacity: 0, toneMapped: false, depthWrite: false }));
  beacon.position.set(siem.x, siem.y + 3, siem.z); scene.add(beacon);
  const sweep = new T.Mesh(new T.PlaneGeometry(0.08, 5), new T.MeshBasicMaterial({ color: 0x14b8a6, transparent: true, opacity: 0, side: T.DoubleSide, toneMapped: false, depthWrite: false }));
  sweep.rotation.x = -PI / 2; scene.add(sweep);

  /* KALI01 containment dome */
  const kali = hostObjs.KALI01.top();
  const dome = new T.Mesh(new T.SphereGeometry(1.7, 32, 16, 0, PI * 2, 0, PI / 2), new T.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0, wireframe: true, toneMapped: false, depthWrite: false }));
  dome.position.set(kali.x, 0.11, kali.z); scene.add(dome);

  /* ambient dust */
  const dustN = 900, dp = new Float32Array(dustN * 3);
  for (let i = 0; i < dustN; i++) { dp[i * 3] = (rnd() - 0.5) * 70; dp[i * 3 + 1] = rnd() * 18 - 1; dp[i * 3 + 2] = (rnd() - 0.5) * 60 - 4; }
  const dg = new T.BufferGeometry(); dg.setAttribute('position', new T.BufferAttribute(dp, 3));
  const dust = new T.Points(dg, new T.PointsMaterial({ color: 0x64748b, size: 0.05, transparent: true, opacity: 0.45, depthWrite: false }));
  scene.add(dust);

  /* ---------- the host card ---------- */
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  let selected = null;
  function openCard(name) {
    const o = hostObjs[name]; if (!o) return;
    selected = name;
    const h = o.h, z = o.z;
    const mon = h.agent === 'manager' ? 'Wazuh manager' : h.agent ? 'Wazuh agent ' + h.agent : 'none yet';
    const rel = ESTATE.links.filter((l) => l.from === name || l.to === name).map((l) => {
      const other = l.from === name ? l.to : l.from;
      const dir = l.from === name ? '→' : '←';
      return '<div class="es-link"><i style="background:' + hex(KIND[l.kind]) + '"></i>' + dir + ' ' + esc(other) + ' · ' + esc(l.label) + (l.planned ? '<em>next</em>' : '') + '</div>';
    });
    if (h.agent && h.agent !== 'manager') rel.push('<div class="es-link"><i style="background:#5eead4"></i>→ SIEM01 · security events</div>');
    if (h.vm) rel.push('<div class="es-link"><i style="background:#a78bfa"></i>← PVE01 · runs as VM ' + h.vm + '</div>');
    cardEl.style.setProperty('--zc', z.css);
    cardEl.innerHTML = '<button class="es-x" type="button" aria-label="Close details">×</button>' +
      '<p class="es-ck">VLAN ' + z.id + ' · ' + esc(z.name) + '</p>' +
      '<h3>' + esc(h.name) + '<span class="es-pill es-' + h.state + '">' + h.state + '</span>' + (h.tier0 ? '<span class="es-pill es-t0">Tier 0</span>' : '') + '</h3>' +
      '<p class="es-note">' + esc(h.note) + '</p>' +
      '<dl><dt>Role</dt><dd>' + esc(h.role) + '</dd><dt>Address</dt><dd>' + esc(h.ip) + (h.vm ? ' · VM ' + h.vm : ' · physical') + '</dd><dt>Monitoring</dt><dd>' + mon + '</dd></dl>' +
      (rel.length ? '<div class="es-links"><b>Connections</b>' + rel.join('') + '</div>' : '');
    cardEl.hidden = false;
    cardEl.querySelector('.es-x').addEventListener('click', closeCard);
  }
  function closeCard() { selected = null; cardEl.hidden = true; }
  addEventListener('keydown', (e) => { if (e.key === 'Escape') closeCard(); });

  const ray = new T.Raycaster(), ndc = new T.Vector2();
  function hostAt(ev) {
    const r = canvas.getBoundingClientRect();
    ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(pickables, false)[0];
    return hit ? hit.object.userData.host : null;
  }
  let down = null, hovered = null, exploring = false;
  canvas.addEventListener('pointerdown', (e) => { down = { x: e.clientX, y: e.clientY }; });
  canvas.addEventListener('pointerup', (e) => {
    if (!down) return;
    const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y); down = null;
    if (moved > 6) return;
    const name = hostAt(e);
    if (name) openCard(name); else closeCard();
  });
  canvas.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    hovered = hostAt(e); canvas.style.cursor = hovered ? 'pointer' : (exploring ? 'grab' : 'default');
  });

  /* ---------- explore mode ---------- */
  const controls = new OrbitControls(camera, canvas);
  controls.enabled = false; controls.enableDamping = true; controls.dampingFactor = 0.08;
  controls.minDistance = 6; controls.maxDistance = 60; controls.maxPolarAngle = PI * 0.47;
  controls.autoRotateSpeed = 0.5;
  // Map-style: left drag (one finger) slides the estate along the ground,
  // right drag, Shift + drag or two fingers turn it. Arrow keys slide too.
  controls.mouseButtons = { LEFT: T.MOUSE.PAN, MIDDLE: T.MOUSE.DOLLY, RIGHT: T.MOUSE.ROTATE };
  controls.touches = { ONE: T.TOUCH.PAN, TWO: T.TOUCH.DOLLY_ROTATE };
  controls.screenSpacePanning = false;
  controls.keyPanSpeed = 12;
  controls.listenToKeyEvents(window);
  canvas.addEventListener('contextmenu', (e) => { if (exploring) e.preventDefault(); });
  // Keep the slide on the estate: the look-at point may not leave the hosts' footprint.
  const bounds = new T.Box3(), shift = new T.Vector3(), clampT = new T.Vector3();
  pickables.forEach((m) => bounds.expandByObject(m));
  bounds.expandByScalar(4);
  controls.addEventListener('change', () => {
    clampT.copy(controls.target); clampT.x = clamp(clampT.x, bounds.min.x, bounds.max.x); clampT.z = clamp(clampT.z, bounds.min.z, bounds.max.z);
    if (!clampT.equals(controls.target)) { shift.subVectors(clampT, controls.target); controls.target.add(shift); camera.position.add(shift); }
  });
  controls.addEventListener('start', () => { controls.autoRotate = false; });
  function enterExplore() {
    exploring = true; root.classList.add('es-exploring'); exploreBar.hidden = false;
    controls.target.copy(camLook); controls.enabled = true; controls.autoRotate = true; controls.update();
    canvas.style.touchAction = 'none';
  }
  function exitExplore() {
    exploring = false; root.classList.remove('es-exploring'); exploreBar.hidden = true;
    controls.enabled = false; controls.autoRotate = false; canvas.style.touchAction = '';
    camPos.copy(camera.position); camLook.copy(controls.target);
  }
  root.querySelectorAll('[data-explore]').forEach((b) => b.addEventListener('click', enterExplore));
  root.querySelector('[data-tour]').addEventListener('click', exitExplore);

  /* ---------- scroll and camera ---------- */
  const N = SCENES.length;
  let target = 0, prog = 0, active = 0;
  const portrait = () => innerWidth / innerHeight < 0.85;
  function camFor(i) {
    const s = SCENES[i]; const k = portrait() ? 1.38 : 1;
    const look = V(s.look);
    return { pos: look.clone().add(V(s.cam).sub(look).multiplyScalar(k)), look };
  }
  function readScroll() {
    const r = scroller.getBoundingClientRect();
    target = clamp(-r.top / Math.max(1, scroller.offsetHeight - innerHeight));
  }
  addEventListener('scroll', readScroll, { passive: true });
  railBtns.forEach((b) => b.addEventListener('click', () => {
    const i = +b.dataset.i;
    const top = scroller.getBoundingClientRect().top + scrollY;
    scrollTo({ top: top + (scroller.offsetHeight - innerHeight) * (i / (N - 1)), behavior: 'smooth' });
  }));
  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  addEventListener('resize', resize); resize(); readScroll();
  prog = target;
  const first = camFor(0);
  const camPos = first.pos.clone(), camLook = first.look.clone();

  /* ---------- keep the subject clear of the text ---------- */
  // The story card covers part of the stage, so shift the projection until the
  // scene's subject sits in the open space beside it (desktop) or above it (phone).
  let offX = 0, offY = 0;
  function freeShift() {
    if (exploring) return [0, 0];
    const p = panels[active]; if (!p) return [0, 0];
    const c = canvas.getBoundingClientRect(), r = p.getBoundingClientRect();
    const W = c.width, H = c.height;
    if (W < 900 || p.classList.contains('es-bottom')) {
      const top = 96; // site header and topbar
      return [0, Math.min(0, (top + (r.top - c.top)) / 2 - H / 2)];
    }
    const railW = 150;
    return [Math.max(0, ((r.right - c.left) + (W - railW)) / 2 - W / 2), 0];
  }
  const quietBtn = root.querySelector('[data-quiet]');
  quietBtn?.addEventListener('click', () => {
    const on = root.classList.toggle('es-quiet');
    quietBtn.setAttribute('aria-pressed', String(on));
    quietBtn.textContent = on ? 'Show text' : 'Hide text';
  });

  const focusSet = (s) => s.focus === 'all' ? null : s.focus === 'none' ? [] : s.focus === 'planned' ? ESTATE.hosts.filter((h) => h.state === 'planned').map((h) => h.name) : s.focus;
  const tgtPos = new T.Vector3(), tgtLook = new T.Vector3();
  let born = 0, t = 0, last = performance.now();

  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.05); last = now; t += dt;
    born = Math.min(1, born + dt / 2.2);
    prog += (target - prog) * Math.min(1, dt * 4.5);
    const f = prog * (N - 1);
    const i0 = Math.floor(clamp(f, 0, N - 1)), i1 = Math.min(N - 1, i0 + 1);
    const k = ease(f - i0);

    if (exploring) controls.update();
    else {
      const c0 = camFor(i0), c1 = camFor(i1);
      tgtPos.lerpVectors(c0.pos, c1.pos, k); tgtLook.lerpVectors(c0.look, c1.look, k);
      tgtPos.x += Math.sin(t * 0.18) * 0.35; tgtPos.y += Math.sin(t * 0.23) * 0.2;
      const a = 1 - Math.exp(-dt * 6); camPos.lerp(tgtPos, a); camLook.lerp(tgtLook, a);
      camera.position.copy(camPos); camera.lookAt(camLook);
    }
    {
      const [sx, sy] = freeShift(), a = 1 - Math.exp(-dt * 4);
      offX += (sx - offX) * a; offY += (sy - offY) * a;
      const W = canvas.clientWidth, H = canvas.clientHeight;
      if (Math.abs(offX) > 0.5 || Math.abs(offY) > 0.5) camera.setViewOffset(W, H, -offX, -offY, W, H);
      else if (camera.view && camera.view.enabled) camera.clearViewOffset();
    }

    const cur = Math.round(f);
    if (cur !== active) {
      active = cur;
      panels.forEach((p, i) => p.classList.toggle('is-on', i === cur));
      railBtns.forEach((b, i) => b.classList.toggle('is-on', i === cur));
    }
    bar.style.width = (prog * 100).toFixed(2) + '%';
    hint.style.opacity = prog < 0.02 ? '1' : '0';

    const w = (id) => exploring ? 0 : clamp(1 - Math.abs(f - SCENES.findIndex((s) => s.id === id)));
    const wRemote = w('remote'), wFw = w('fw'), wHyper = w('hyper'), wT0 = w('tier0'), wDet = w('detect'), wAgent = w('agent'), wRed = w('red'), wNext = w('next');
    const wAll = exploring ? 1 : 0;

    zoneObjs.forEach((o) => {
      const b = ease((born - o.delay * 0.5) / 0.5);
      o.g.position.y = lerp(-2.5, 0, b);
      o.mat.opacity = b; o.rim.material.opacity = 0.85 * b; o.lab.material.opacity = 0.95 * b;
      o.glow.material.opacity = (0.05 + 0.05 * Math.sin(t * 0.8 + o.z.x)) * b;
    });

    const sA = focusSet(SCENES[i0]), sB = focusSet(SCENES[i1]);
    const heroW = clamp(1 - f);
    Object.values(hostObjs).forEach((o) => {
      const name = o.h.name;
      const inA = sA === null || sA.includes(name), inB = sB === null || sB.includes(name);
      let focus = exploring ? 1 : lerp(inA ? 1 : 0, inB ? 1 : 0, k);
      const isSel = selected === name, isHov = hovered === name;
      if (isSel || isHov) focus = 1;
      const b = ease((born - o.delay * 0.6) / 0.4);
      o.g.scale.set(1, Math.max(0.001, b), 1);
      const planned = o.h.state === 'planned';
      o.mat.emissiveIntensity = (planned ? 0.03 : 0.07) + focus * (planned ? 0.22 : 0.26) + (isSel ? 0.25 : 0) + (planned ? 0.12 * Math.max(wNext, wAll) * (0.5 + 0.5 * Math.sin(t * 3)) : 0);
      o.edges.material.opacity = 0.35 + 0.6 * focus;
      o.cap.material.opacity = (planned ? 0.2 : 0.3) + focus * 0.6;
      o.ring.material.opacity = isSel ? 0.55 + 0.35 * Math.sin(t * 4) : 0;
      o.ring.scale.setScalar(isSel ? 1 + 0.06 * Math.sin(t * 4) : 1);
      o.lab.material.opacity = Math.max(0.85 * heroW, focus) * b;
    });

    devices.forEach((d, i) => { d.m.opacity = wRemote; d.lab.material.opacity = wRemote; d.g.rotation.y = Math.sin(t * 0.5 + i) * 0.15; });
    tunnels.forEach((tn, i) => { tn.geo.setDrawRange(0, Math.floor(tn.n * clamp(wRemote * 1.6 - i * 0.15))); tn.line.material.opacity = 0.85 * clamp(wRemote * 2); });
    gateRing.material.opacity = wRemote * (0.6 + 0.4 * Math.sin(t * 4)); gateLab.material.opacity = wRemote;
    gateRing.scale.setScalar(1 + 0.08 * Math.sin(t * 4));

    wallMat.opacity = 0.05 + 0.2 * Math.max(wFw, wRemote);
    wallRim.material.opacity = 0.18 + 0.6 * Math.max(wFw, wRemote * 0.6);
    fwLab.material.opacity = 0.35 + 0.65 * Math.max(wFw, wRemote, wAll);
    trunkMat.opacity = 0.9 * wFw; trunkLab.material.opacity = wFw;
    sparks.forEach((s) => { s.m.material.opacity = wFw * Math.max(0, Math.sin(t * s.speed * 3 + s.phase)) * 0.9; });

    vmArcs.forEach((a, i) => { a.geo.setDrawRange(0, Math.floor(a.n * clamp(wHyper * 1.8 - i * 0.08))); a.mat.opacity = 0.75 * clamp(wHyper * 2); });

    t0line.material.opacity = 0.25 + 0.75 * Math.max(wT0, wAll * 0.6); t0lab.material.opacity = Math.max(wT0, wAll * 0.8);
    links.forEach((L) => {
      const sel = selected && (L.l.from === selected || L.l.to === selected) ? 1 : 0;
      const wl = Math.max(L.l.scene === 'tier0' ? wT0 : wAgent, wAll * 0.85, sel);
      L.geo.setDrawRange(0, Math.floor(L.n * clamp(wl * 1.7)));
      L.lab.material.opacity = clamp(wl * 1.6 - 0.4);
      L.pulse.position.copy(L.curve.getPoint((t * 0.45 + L.phase) % 1));
      L.pulse.material.opacity = clamp(wl * 1.5 - 0.3) * (L.l.planned ? 0.45 : 1);
    });

    const wLogs = Math.max(wDet, wAll * 0.6);
    beacon.material.opacity = wLogs * (0.35 + 0.25 * Math.sin(t * 2.4));
    logs.forEach((p) => {
      const u = (p.t0 + t * p.speed * 0.9) % 1;
      const c = (p.c + Math.floor(p.t0 + t * p.speed * 0.9)) % logCurves.length;
      p.m.position.copy(logCurves[c].getPoint(u));
      p.m.material.opacity = wLogs * Math.sin(u * PI);
    });
    sweep.position.set(-9 + 4.6 * Math.sin(t * 0.9), 0.2, 0); sweep.material.opacity = wDet * 0.55;

    dome.material.opacity = Math.max(wRed, wAll * 0.6) * (0.28 + 0.1 * Math.sin(t * 3));
    dome.rotation.y = t * 0.2;
    dust.rotation.y = t * 0.01;

    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
