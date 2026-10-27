/* One world, one scroll. The sign-in journey, then the case files inside
   the same lab, then the alert swarm over SIEM01, then the credentials as
   a token, then a push approval to make contact. One camera, one dark
   ground, everything built in code from the lab's real layout. Three.js. */
import * as THREE from 'three';
import { CERTS, RUNWAY } from '../data/certifications';

type Vec = [number, number, number];
interface Key { t: number; pos: Vec; look: Vec }

/* ---------- the lab ---------- */
const ZONES = [
  { id: 10, name: 'Management', x: -15, color: 0x7c3aed },
  { id: 20, name: 'BlueTeam', x: -9, color: 0x14b8a6 },
  { id: 30, name: 'RedTeam', x: -3, color: 0xef4444 },
  { id: 40, name: 'DevOps', x: 3, color: 0xf59e0b },
  { id: 50, name: 'EnterpriseLAN', x: 9, color: 0x3b82f6 },
  { id: 60, name: 'Monitoring', x: 15, color: 0x22c55e },
];
const HOSTS: { name: string; zone: number; x: number; z: number; h: number; role: string }[] = [
  { name: 'ADM01', zone: 10, x: -16.2, z: 1.2, h: 0.5, role: 'admin workstation' },
  { name: 'PVE01', zone: 10, x: -14, z: -1.2, h: 1.1, role: 'Proxmox host' },
  { name: 'SIEM01', zone: 20, x: -9.8, z: -0.9, h: 1.3, role: 'Wazuh' },
  { name: 'SCAN01', zone: 20, x: -7.8, z: 1.3, h: 0.8, role: 'Greenbone' },
  { name: 'KALI01', zone: 30, x: -3, z: 0.6, h: 0.8, role: 'attack host' },
  { name: 'APP01', zone: 40, x: 3, z: 0.4, h: 0.9, role: 'apps' },
  { name: 'DC01', zone: 50, x: 7.6, z: -1.1, h: 1.4, role: 'domain controller' },
  { name: 'MON01', zone: 60, x: 15, z: 0.4, h: 0.8, role: 'Grafana' },
];
const WKS = { x: 10.6, z: 1.3 };
const FW_Z = -7;
const CLOUD: Vec = [0, 9, -15];
const PLATFORM: Vec = [-10, 7.5, -17];
const WEB: Vec = [12, 1.5, -13];
const SIEM: Vec = [-9.8, 0.75, -0.9];
const DC: Vec = [7.6, 0.8, -1.1];
const GATE_DC: Vec = [6.5, 1.3, FW_Z + 0.14];
const GATE_LOG: Vec = [-1.5, 1.3, FW_Z + 0.14];
const TOKEN: Vec = [1.9, 6.2, 1];

/* the journey occupies the first J of the scroll; its own clock runs 0..0.92 inside that */
const J = 0.42;
const JMAX = 0.92;
/* case file stops, in scroll units */
const STOPS = [0.447, 0.475, 0.503, 0.531, 0.559, 0.587];

const WHITE = new THREE.Color(0xffffff);
const SLATE = new THREE.Color(0x0b1220);
const NIGHT = new THREE.Color(0x0f172a);

const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ease = (x: number) => { x = clamp(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const span = (t: number, a: number, b: number) => ease((t - a) / (b - a));
const v = (a: Vec) => new THREE.Vector3(...a);
const MONO = "'JetBrains Mono Variable', 'JetBrains Mono', Consolas, monospace";
const SANS = "'Inter Variable', Inter, 'Segoe UI', sans-serif";

interface Line { text: string; size: number; weight?: number; color?: string; mono?: boolean; y: number; x?: number }
function textTexture(lines: Line[], w: number, h: number, bg = 'rgba(0,0,0,0)') {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d')!;
  g.fillStyle = bg; g.fillRect(0, 0, w, h);
  for (const l of lines) {
    const fam = l.mono ? MONO : SANS;
    let size = l.size;
    g.font = `${l.weight ?? 600} ${size}px ${fam}`;
    while (g.measureText(l.text).width > w - 56 && size > 11) { size -= 1; g.font = `${l.weight ?? 600} ${size}px ${fam}`; }
    g.fillStyle = l.color ?? '#0f172a';
    g.textBaseline = 'middle';
    g.fillText(l.text, l.x ?? 28, l.y);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}
function label(text: string, sub?: string) {
  const w = 512, h = sub ? 160 : 96;
  const tex = textTexture(
    sub ? [{ text, size: 54, weight: 800, color: '#ffffff', y: 50 }, { text: sub, size: 30, weight: 500, color: '#94a3b8', y: 114, mono: true }]
        : [{ text, size: 54, weight: 800, color: '#ffffff', y: 48 }],
    w, h);
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false, opacity: 0 }));
  s.scale.set(2.4, 2.4 * h / w, 1);
  return s;
}
function card(tex: THREE.Texture, w: number, h: number) {
  const m = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0, toneMapped: false, depthWrite: false, side: THREE.DoubleSide });
  return new THREE.Mesh(new THREE.PlaneGeometry(w, h), m);
}
const wrap = (s: string, n: number) => { const out: string[] = []; for (let i = 0; i < s.length; i += n) out.push(s.slice(i, i + n)); return out; };
const b64url = (s: string) => btoa(unescape(encodeURIComponent(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

export function startJourney(root: HTMLElement) {
  const canvas = root.querySelector('canvas') as HTMLCanvasElement;
  const panels = Array.from(root.querySelectorAll<HTMLElement>('.j-panel'));
  const counters = Array.from(root.querySelectorAll<HTMLElement>('[data-count]'));
  const rail = Array.from(root.querySelectorAll<HTMLElement>('[data-rail]'));
  const html = document.documentElement;
  const startTheme = html.dataset.theme;
  const userTheme = () => { try { return localStorage.getItem('theme') ?? startTheme ?? 'light'; } catch { return startTheme ?? 'light'; } };
  let theme = userTheme();
  let dark = false;
  new MutationObserver(() => { if (!dark) theme = html.dataset.theme === 'dark' ? 'dark' : 'light'; }).observe(html, { attributes: true, attributeFilter: ['data-theme'] });

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  scene.background = WHITE.clone();
  scene.fog = new THREE.Fog(WHITE.clone(), 18, 70);
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 200);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x334155, 1.1));
  const sun = new THREE.DirectionalLight(0xffffff, 1.6);
  sun.position.set(6, 14, 8);
  scene.add(sun);

  const estate: THREE.Material[] = [];
  const setOpacity = (s: THREE.Sprite, o: number) => { (s.material as THREE.SpriteMaterial).opacity = o; };
  const setMat = (m: THREE.Mesh, o: number) => { (m.material as THREE.MeshBasicMaterial).opacity = o; m.visible = o > 0.005; };

  /* ---------- six slabs ---------- */
  const slabGeo = new THREE.BoxGeometry(5, 0.22, 5);
  const rimGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(5.02, 0.24, 5.02));
  const zoneLabels: THREE.Sprite[] = [];
  const slabMats: THREE.MeshStandardMaterial[] = [];
  for (const z of ZONES) {
    const m = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.55, metalness: 0.15, emissive: new THREE.Color(z.color), emissiveIntensity: 0.06, transparent: true });
    const slab = new THREE.Mesh(slabGeo, m);
    slab.position.set(z.x, 0, 0);
    scene.add(slab); estate.push(m); slabMats.push(m);
    const rim = new THREE.LineSegments(rimGeo, new THREE.LineBasicMaterial({ color: z.color, transparent: true, opacity: 0.9 }));
    rim.position.copy(slab.position);
    scene.add(rim); estate.push(rim.material);
    const l = label(`VLAN ${z.id}`, z.name);
    l.position.set(z.x, -0.6, 3.1); l.scale.multiplyScalar(0.9);
    scene.add(l); zoneLabels.push(l);
  }

  /* ---------- hosts ---------- */
  const hostLabels: THREE.Sprite[] = [];
  const hostMats: THREE.MeshStandardMaterial[] = [];
  function block(x: number, y: number, z: number, w: number, h: number, d: number, color: number, glow = 0.15) {
    const m = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4, metalness: 0.35, emissive: new THREE.Color(color), emissiveIntensity: glow, transparent: true });
    const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
    b.position.set(x, y, z);
    scene.add(b); estate.push(m);
    const em = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.7 });
    const e = new THREE.LineSegments(new THREE.EdgesGeometry(b.geometry), em);
    e.position.copy(b.position);
    scene.add(e); estate.push(em);
    hostMats.push(m);
    return b;
  }
  for (const h of HOSTS) {
    const zone = ZONES.find((z) => z.id === h.zone)!;
    block(h.x, 0.11 + h.h / 2, h.z, 0.9, h.h, 0.9, zone.color);
    const l = label(h.name, h.role);
    l.position.set(h.x, 0.11 + h.h + 0.55, h.z); l.scale.multiplyScalar(0.75);
    scene.add(l); hostLabels.push(l);
  }
  const dcMat = hostMats[6], siemMat = hostMats[2], monMat = hostMats[7];

  /* ---------- WKS01 laptop ---------- */
  const laptop = new THREE.Group();
  laptop.position.set(WKS.x, 0.11, WKS.z);
  laptop.rotation.y = -0.55;
  const alu = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.35, metalness: 0.6 });
  const base = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.05, 0.9), alu);
  base.position.y = 0.025; laptop.add(base);
  const lid = new THREE.Group();
  lid.position.set(0, 0.05, -0.44); lid.rotation.x = -0.32;
  const lidBack = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.86, 0.035), alu);
  lidBack.position.y = 0.43; lid.add(lidBack);
  const screenTex = textTexture([
    { text: 'corp.biirabank.com', size: 22, weight: 500, color: '#94a3b8', y: 46, mono: true },
    { text: 'Sign in', size: 46, weight: 800, color: '#f8fafc', y: 110 },
    { text: 'n.antwi@corp.biirabank.com', size: 24, weight: 500, color: '#e2e8f0', y: 190, mono: true },
    { text: '●●●●●●●●●●●●', size: 24, weight: 500, color: '#e2e8f0', y: 246, mono: true },
  ], 640, 420, '#0f172a');
  { const g2 = (screenTex.image as HTMLCanvasElement).getContext('2d')!;
    g2.fillStyle = '#2dd4bf'; g2.fillRect(28, 298, 190, 56);
    g2.fillStyle = '#0f172a'; g2.font = `700 26px ${SANS}`; g2.textBaseline = 'middle'; g2.fillText('Sign in  →', 48, 326);
    g2.strokeStyle = '#334155'; g2.lineWidth = 2; g2.strokeRect(28, 166, 584, 50); g2.strokeRect(28, 222, 584, 50);
    screenTex.needsUpdate = true; }
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.22, 0.78), new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false }));
  screen.position.set(0, 0.43, 0.019);
  lid.add(screen); laptop.add(lid); scene.add(laptop);
  const wksLabel = label('WKS01', 'Windows 11 · VLAN 50');
  wksLabel.position.set(WKS.x, 1.45, WKS.z); wksLabel.scale.multiplyScalar(0.75);
  scene.add(wksLabel); hostLabels.push(wksLabel);

  /* ---------- pfSense wall and gates ---------- */
  const wall = new THREE.Mesh(new THREE.BoxGeometry(38, 3.2, 0.18), new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.15, metalness: 0.1, transparent: true, opacity: 0.3 }));
  wall.position.set(0, 1.7, FW_Z);
  scene.add(wall); estate.push(wall.material);
  const wallRim = new THREE.LineSegments(new THREE.EdgesGeometry(wall.geometry), new THREE.LineBasicMaterial({ color: 0x64748b, transparent: true, opacity: 0.6 }));
  wallRim.position.copy(wall.position);
  scene.add(wallRim); estate.push(wallRim.material);
  const fwLabel = label('FW01 · pfSense', 'default deny on every interface');
  fwLabel.position.set(0, 4.0, FW_Z); fwLabel.scale.multiplyScalar(1.1);
  scene.add(fwLabel);
  function gate(p: Vec, name: string) {
    const frame = new THREE.Mesh(new THREE.RingGeometry(0.42, 0.52, 48), new THREE.MeshBasicMaterial({ color: 0x22c55e, transparent: true, opacity: 0, side: THREE.DoubleSide, toneMapped: false, depthWrite: false }));
    frame.position.set(...p); scene.add(frame);
    const tag = label(name, 'permit');
    tag.position.set(p[0], p[1] + 0.95, p[2]); tag.scale.multiplyScalar(0.55); scene.add(tag);
    return { frame, tag };
  }
  const gateDC = gate(GATE_DC, 'ENT-03 · outbound');
  const gateLog = gate(GATE_LOG, 'ENT-05 · agent → SIEM01');
  const denyMat = new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0, toneMapped: false, side: THREE.DoubleSide, depthWrite: false });
  const denies = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.16, 0.16), denyMat, 60);
  { const dm = new THREE.Matrix4(); for (let i = 0; i < 60; i++) { dm.makeTranslation(-17 + Math.random() * 34, 0.5 + Math.random() * 2.3, FW_Z + 0.1); denies.setMatrixAt(i, dm); } }
  scene.add(denies);

  /* ---------- identity halo ---------- */
  const haloN = 2600;
  const haloPos = new Float32Array(haloN * 3);
  for (let i = 0; i < haloN; i++) { const a = Math.random() * Math.PI * 2, r = 3.2 + (Math.random() - 0.5) * 0.9; haloPos[i * 3] = Math.cos(a) * r; haloPos[i * 3 + 1] = (Math.random() - 0.5) * 0.5; haloPos[i * 3 + 2] = Math.sin(a) * r; }
  const haloGeo = new THREE.BufferGeometry(); haloGeo.setAttribute('position', new THREE.BufferAttribute(haloPos, 3));
  const halo = new THREE.Points(haloGeo, new THREE.PointsMaterial({ color: 0x5eead4, size: 0.07, transparent: true, opacity: 0, depthWrite: false, toneMapped: false }));
  halo.position.set(...CLOUD); scene.add(halo);
  const cloudLabel = label('Entra ID · Okta', 'device trust · second factor · outbound only');
  cloudLabel.position.set(CLOUD[0], CLOUD[1] + 1.6, CLOUD[2]); cloudLabel.scale.multiplyScalar(1.6); scene.add(cloudLabel);

  /* ---------- the cloud platform ---------- */
  const platform = new THREE.Group(); platform.position.set(...PLATFORM);
  const platMats: THREE.Material[] = [];
  const plat = new THREE.Mesh(new THREE.BoxGeometry(7.5, 0.18, 4.6), new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.2, emissive: 0x2563eb, emissiveIntensity: 0.08, transparent: true, opacity: 0 }));
  platform.add(plat); platMats.push(plat.material);
  const platRim = new THREE.LineSegments(new THREE.EdgesGeometry(plat.geometry), new THREE.LineBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0 }));
  platform.add(platRim); platMats.push(platRim.material);
  const resources: { rim: THREE.LineBasicMaterial; mat: THREE.MeshStandardMaterial; flagged: boolean; k: number }[] = [];
  const resGeo = new THREE.BoxGeometry(0.55, 0.55, 0.55);
  for (let i = 0; i < 16; i++) {
    const azure = i % 2 === 1;
    const x = -3 + (i % 8) * 0.86, z = azure ? 0.9 : -0.9, h = 0.4 + ((i * 37) % 5) * 0.14;
    const m = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4, metalness: 0.3, emissive: new THREE.Color(azure ? 0x7c3aed : 0x2563eb), emissiveIntensity: 0.25, transparent: true, opacity: 0 });
    const b = new THREE.Mesh(resGeo, m); b.scale.y = h / 0.55; b.position.set(x, 0.09 + h / 2, z);
    platform.add(b); platMats.push(m);
    const flagged = i === 2 || i === 7 || i === 9 || i === 13;
    const rm = new THREE.LineBasicMaterial({ color: flagged ? 0xef4444 : (azure ? 0xa78bfa : 0x60a5fa), transparent: true, opacity: 0 });
    const e = new THREE.LineSegments(new THREE.EdgesGeometry(resGeo), rm); e.scale.copy(b.scale); e.position.copy(b.position);
    platform.add(e); platMats.push(rm);
    resources.push({ rim: rm, mat: m, flagged, k: i });
  }
  scene.add(platform);
  const platLabel = label('AWS · Azure', 'federated sign-in · no standing keys · posture scanned');
  platLabel.position.set(PLATFORM[0], PLATFORM[1] + 1.25, PLATFORM[2]); platLabel.scale.multiplyScalar(1.5); scene.add(platLabel);
  const fixedColor = new THREE.Color(0x22c55e), flagColor = new THREE.Color(0xef4444);

  /* ---------- SIEM field tiles ---------- */
  const N = 50, tiles = new THREE.InstancedMesh(new THREE.BoxGeometry(0.082, 0.05, 0.082), new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6, emissive: 0x000000, transparent: true }), N * N);
  const tileXZ: [number, number][] = [];
  { const tm = new THREE.Matrix4(); for (let i = 0; i < N * N; i++) { const x = -9 - 2.45 + (i % N) * 0.1, z = -2.45 + Math.floor(i / N) * 0.1; tm.makeTranslation(x, 0.14, z); tiles.setMatrixAt(i, tm); tiles.setColorAt(i, new THREE.Color(0x0f172a)); tileXZ.push([x, z]); } }
  tiles.instanceMatrix.needsUpdate = true;
  scene.add(tiles); estate.push(tiles.material as THREE.Material);
  const tileColor = new THREE.Color();
  const cA = new THREE.Color(0x14b8a6), cB = new THREE.Color(0x7c3aed), cDim = new THREE.Color(0x0f172a), cAlert = new THREE.Color(0xf59e0b);

  /* ---------- assessment sweep and findings ---------- */
  const sweepMat = new THREE.MeshBasicMaterial({ color: 0x14b8a6, transparent: true, opacity: 0, side: THREE.DoubleSide, toneMapped: false, depthWrite: false });
  const sweep = new THREE.Mesh(new THREE.PlaneGeometry(8, 3.4), sweepMat); sweep.rotation.y = Math.PI / 2; sweep.position.set(-20, 1.8, 0);
  const sweepGlowMat = new THREE.MeshBasicMaterial({ color: 0x14b8a6, transparent: true, opacity: 0, side: THREE.DoubleSide, toneMapped: false, depthWrite: false });
  const sweepGlow = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 8), sweepGlowMat); sweepGlow.rotation.x = -Math.PI / 2; sweepGlow.position.set(-20, 0.13, 0);
  scene.add(sweep); scene.add(sweepGlow);
  const sweepLabel = label('SCAN01 · credentialed scan', 'Greenbone, signed in as svc-greenbone');
  sweepLabel.position.set(-20, 4.0, 0); sweepLabel.scale.multiplyScalar(1.1); scene.add(sweepLabel);
  const FINDINGS = [
    { x: -16.2, z: 1.2, y: 1.3, name: 'ADM01 · CIS 26%', closes: false },
    { x: 7.6, z: -1.1, y: 2.2, name: 'DC01 · CIS 26%', closes: false },
    { x: WKS.x, z: WKS.z, y: 1.9, name: 'WKS01 · TLS 1.0 and 1.1 on RDP', closes: true },
  ].map((f) => {
    const m = new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0, toneMapped: false, depthWrite: false });
    const d = new THREE.Mesh(new THREE.OctahedronGeometry(0.22), m); d.position.set(f.x, f.y, f.z); scene.add(d);
    const tag = label(f.name, f.closes ? 'found · fixed by policy · proved gone' : 'baseline recorded before hardening');
    tag.position.set(f.x, f.y + 0.75, f.z); tag.scale.multiplyScalar(0.7); scene.add(tag);
    return { ...f, mesh: d, mat: m, tag };
  });
  const foundColor = new THREE.Color(0xef4444), closedColor = new THREE.Color(0x22c55e);

  /* ---------- the request orb ---------- */
  const orb = new THREE.Mesh(new THREE.SphereGeometry(0.11, 24, 24), new THREE.MeshBasicMaterial({ color: 0x2dd4bf, toneMapped: false, transparent: true }));
  const orbGlow = new THREE.Mesh(new THREE.SphereGeometry(0.26, 24, 24), new THREE.MeshBasicMaterial({ color: 0x2dd4bf, transparent: true, opacity: 0.25, toneMapped: false, depthWrite: false }));
  const orbLight = new THREE.PointLight(0x2dd4bf, 6, 6);
  orb.add(orbGlow); orb.add(orbLight); scene.add(orb);
  const trailN = 40, trailPos = new Float32Array(trailN * 3);
  const trailGeo = new THREE.BufferGeometry(); trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPos, 3));
  const trail = new THREE.Line(trailGeo, new THREE.LineBasicMaterial({ color: 0x2dd4bf, transparent: true, opacity: 0.55 })); scene.add(trail);
  const trailPts: THREE.Vector3[] = [];
  const screenPoint = new THREE.Vector3();
  const lidWorld = () => { screen.getWorldPosition(screenPoint); return screenPoint.clone(); };
  const legA = new THREE.CatmullRomCurve3([lidWorld(), new THREE.Vector3(9.6, 1.3, 0.4), v(DC)]);
  const legB = new THREE.CatmullRomCurve3([v(DC), new THREE.Vector3(7.2, 1.6, -3.5), v(GATE_DC), new THREE.Vector3(4.5, 4.5, -11), v(CLOUD)]);
  const legD = new THREE.CatmullRomCurve3([v(CLOUD), new THREE.Vector3(-4, 9.5, -17), new THREE.Vector3(PLATFORM[0], PLATFORM[1] + 0.6, PLATFORM[2])]);
  const legC = new THREE.CatmullRomCurve3([lidWorld(), new THREE.Vector3(6, 1.6, -3), v(GATE_LOG), new THREE.Vector3(-6, 1.4, -3.5), v(SIEM)]);

  /* ============ case-file objects ============ */
  /* the public tier: a screen beyond the firewall */
  const web = new THREE.Group(); web.position.set(...WEB); web.rotation.y = -0.35;
  const webTex = textTexture([
    { text: 'biirabank.com', size: 60, weight: 800, color: '#f8fafc', y: 70 },
    { text: 'Cloudflare edge · static assets · zero JavaScript', size: 26, weight: 500, color: '#94a3b8', y: 134, mono: true },
    { text: 'securityheaders.com', size: 24, weight: 500, color: '#64748b', y: 230, mono: true },
    { text: 'F  →  A+', size: 88, weight: 800, color: '#4ade80', y: 320 },
    { text: 'HSTS · CSP with no script-src · TLS 1.2 floor', size: 26, weight: 500, color: '#94a3b8', y: 420, mono: true },
  ], 900, 480, '#0b1220');
  const webScreen = card(webTex, 3.6, 1.92); webScreen.position.y = 1.2; web.add(webScreen);
  const webFrame = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(3.7, 2.02)), new THREE.LineBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0 }));
  webFrame.position.y = 1.2; web.add(webFrame);
  const webSlab = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.18, 2.6), new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.2, emissive: 0x2563eb, emissiveIntensity: 0.1, transparent: true, opacity: 0 }));
  web.add(webSlab);
  scene.add(web);
  const webLabel = label('Public tier', 'what the internet can reach · nothing else');
  webLabel.position.set(WEB[0], WEB[1] + 2.6, WEB[2]); webLabel.scale.multiplyScalar(1.1); scene.add(webLabel);

  /* the audit dossier over the RedTeam slab */
  const dossier = new THREE.Group(); dossier.position.set(-3, 2.1, 0.2); dossier.rotation.y = 0.12;
  const dossTex = textTexture([
    { text: 'POST-INCIDENT AUDIT', size: 24, weight: 700, color: '#d97706', y: 44, mono: true },
    { text: 'Collins Aerospace', size: 60, weight: 800, color: '#0f172a', y: 104 },
    { text: 'COBIT 2019 · NIST SP 800-30 · CMMC Level 3 gap analysis', size: 24, weight: 500, color: '#475569', y: 160, mono: true },
    { text: '5 findings · 18 risks · $4.5M to remediate · $2.3B at risk', size: 28, weight: 600, color: '#0f172a', y: 214 },
    { text: 'ENTERPRISE SECURITY ASSESSMENT', size: 24, weight: 700, color: '#d97706', y: 300, mono: true },
    { text: 'Cyberdyne Systems', size: 48, weight: 800, color: '#0f172a', y: 352 },
    { text: '16 vulnerabilities · 13 controls · 11 policies · 800+ devices', size: 26, weight: 600, color: '#0f172a', y: 408 },
  ], 900, 460, '#fffaf0');
  const dossCard = card(dossTex, 3.4, 1.74); dossier.add(dossCard);
  const dossFrame = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(3.5, 1.84)), new THREE.LineBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0 }));
  dossier.add(dossFrame); scene.add(dossier);

  /* the job scout board, a satellite near Monitoring */
  const board = new THREE.Group(); board.position.set(15, 3.6, -5.5); board.rotation.y = -0.5;
  const boardTex = textTexture([
    { text: 'IAM JOB SCOUT', size: 24, weight: 700, color: '#a78bfa', y: 44, mono: true },
    { text: 'Three job APIs in.', size: 54, weight: 800, color: '#f8fafc', y: 110 },
    { text: 'One de-duplicated board out.', size: 54, weight: 800, color: '#f8fafc', y: 170 },
    { text: 'FastAPI · PostgreSQL · fuzzy matching · Prometheus · Grafana', size: 24, weight: 500, color: '#94a3b8', y: 240, mono: true },
    { text: '12+ endpoints · 30+ metrics · 3 sources · 3 deploy targets', size: 26, weight: 600, color: '#e2e8f0', y: 300 },
  ], 900, 340, '#0b1220');
  const boardCard = card(boardTex, 3.2, 1.21); board.add(boardCard);
  const boardFrame = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(3.3, 1.31)), new THREE.LineBasicMaterial({ color: 0xa78bfa, transparent: true, opacity: 0 }));
  board.add(boardFrame); scene.add(board);

  /* ============ the alert swarm ============ */
  const SW = 2000;
  const swarm = new THREE.InstancedMesh(new THREE.BoxGeometry(0.13, 0.085, 0.02), new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5, emissive: 0xffffff, emissiveIntensity: 0.55, transparent: true, opacity: 0 }), SW);
  const swOrigin: THREE.Vector3[] = [], swTarget: THREE.Vector3[] = [], swSev: number[] = [], swDelay: number[] = [], swSpin: number[] = [], swLayer: number[] = [];
  const colCount = [0, 0, 0, 0];
  const COLX = [-12.0, -11.0, -10.0, -9.0], COLZ = 1.3;
  const sevColor = [new THREE.Color(0xef4444), new THREE.Color(0xf59e0b), new THREE.Color(0x3b82f6), new THREE.Color(0x64748b)];
  const greenC = new THREE.Color(0x22c55e), brightC = new THREE.Color(0x5eead4);
  for (let i = 0; i < SW; i++) {
    const r = (i * 7919) % 100;
    const sev = r < 5 ? 0 : r < 20 ? 1 : r < 50 ? 2 : 3;
    swSev.push(sev);
    const h = HOSTS[i % HOSTS.length];
    swOrigin.push(new THREE.Vector3(h.x + (Math.random() - 0.5) * 0.8, 0.4 + Math.random() * 0.5 + h.h, h.z + (Math.random() - 0.5) * 0.8));
    const k = colCount[sev]++; const layer = Math.floor(k / 36), idx = k % 36, ix = idx % 6, iz = Math.floor(idx / 6);
    swLayer.push(layer);
    swTarget.push(new THREE.Vector3(COLX[sev] + (ix - 2.5) * 0.115, 0.3 + layer * 0.072, COLZ + (iz - 2.5) * 0.115));
    swDelay.push(((i * 0.618034) % 1) * 0.6);
    swSpin.push(Math.random() * Math.PI * 2);
  }
  const maxLayer = Math.max(...colCount.map((c) => Math.ceil(c / 36)));
  for (let i = 0; i < SW; i++) swarm.setColorAt(i, sevColor[swSev[i]]);
  swarm.instanceColor!.needsUpdate = true;
  scene.add(swarm);
  const riseSet = new Set<number>(); for (let i = 0; i < SW; i += 91) riseSet.add(i);
  const swM = new THREE.Matrix4(), swP = new THREE.Vector3(), swQ = new THREE.Quaternion(), swS = new THREE.Vector3(), swE = new THREE.Euler();
  const swarmLabel = label('wazuh-archives-*', 'every event, kept · 5% become alerts');
  swarmLabel.position.set(-10.5, 3.4, 1.3); swarmLabel.scale.multiplyScalar(1.1); scene.add(swarmLabel);

  /* ============ the token ============ */
  const header = { alg: 'ES256', typ: 'JWT', kid: 'nobleantwi-2026' };
  const payload = { iss: 'https://nobleantwi.com', sub: 'noble.antwi', role: 'cloud security & identity engineer', loc: 'Chicago, IL', creds: CERTS.length, pending: RUNWAY.length, iat: 1767225600 };
  const segH = b64url(JSON.stringify(header)), segP = b64url(JSON.stringify(payload));
  let seed = 20261027; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
  const ALPH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let segS = ''; for (let i = 0; i < 43; i++) segS += ALPH[Math.floor(rnd() * ALPH.length)];
  const tokenStr = `${segH}.${segP}.${segS}`;
  const segColor = (i: number) => (i < segH.length ? '#f87171' : i < segH.length + 1 + segP.length ? '#c4b5fd' : '#5eead4');
  const tokCanvas = document.createElement('canvas'); tokCanvas.width = 1024; tokCanvas.height = 200;
  const tokTex = new THREE.CanvasTexture(tokCanvas); tokTex.colorSpace = THREE.SRGBColorSpace;
  let tokShown = -1;
  function drawToken(n: number) {
    if (n === tokShown) return; tokShown = n;
    const g = tokCanvas.getContext('2d')!; g.fillStyle = '#0b1220'; g.fillRect(0, 0, 1024, 200);
    g.font = `500 19px ${MONO}`; g.textBaseline = 'middle';
    const perLine = 86; const cw = 11.4;
    for (let i = 0; i < n; i++) { const line = Math.floor(i / perLine), col = i % perLine; g.fillStyle = segColor(i); g.fillText(tokenStr[i], 22 + col * cw, 40 + line * 36); }
    if (n < tokenStr.length) { const line = Math.floor(n / perLine), col = n % perLine; g.fillStyle = '#2dd4bf'; g.fillRect(22 + col * cw, 28 + line * 36, 10, 24); }
    tokTex.needsUpdate = true;
  }
  drawToken(0);
  const tokenLine = card(tokTex, 5.4, 1.06); tokenLine.position.set(...TOKEN); scene.add(tokenLine);
  const tokenTitle = label('One token.', 'what the directory would say about me');
  tokenTitle.position.set(TOKEN[0], TOKEN[1] + 1.4, TOKEN[2]); tokenTitle.scale.multiplyScalar(1.3); scene.add(tokenTitle);
  const segCard = (text: string, colour: string, kicker: string) => {
    const rows = wrap(text, 72); const hh = 100 + Math.max(1, rows.length) * 34;
    return card(textTexture([{ text: kicker, size: 22, weight: 700, color: colour, y: 34, mono: true }, ...rows.map((l, i) => ({ text: l, size: 24, weight: 500, color: colour, y: 84 + i * 34, mono: true }))], 1024, hh, '#0b1220'), 3.7, hh / 1024 * 3.7);
  };
  const cardH = segCard(segH, '#f87171', 'HEADER'), cardP = segCard(segP, '#c4b5fd', 'PAYLOAD'), cardS = segCard(segS, '#5eead4', 'SIGNATURE');
  for (const c of [cardH, cardP, cardS]) { c.position.set(...TOKEN); scene.add(c); }
  const decH = card(textTexture([{ text: '{', size: 30, color: '#f8fafc', y: 40, mono: true }, { text: `  "alg": "ES256",  "typ": "JWT",`, size: 30, color: '#fca5a5', y: 82, mono: true }, { text: `  "kid": "nobleantwi-2026"`, size: 30, color: '#fca5a5', y: 124, mono: true }, { text: '}', size: 30, color: '#f8fafc', y: 166, mono: true }], 900, 200, '#111827'), 3.4, 0.76);
  const shortId = (c: (typeof CERTS)[number]) => c.short.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const claimLines: Line[] = [{ text: '{', size: 27, color: '#f8fafc', y: 30, mono: true }];
  let cy = 66;
  for (const c of CERTS) { claimLines.push({ text: `  "${shortId(c)}": ${c.issued ? `"${c.issued.replace(/^Renewed /, '').replace(/,.*$/, '')}"` : 'true'},`, size: 27, color: '#ddd6fe', y: cy, mono: true }); cy += 36; }
  for (const r of RUNWAY) { const id = (r.title.match(/\(([A-Z0-9-]+)\)/)?.[1] ?? r.title).toLowerCase(); claimLines.push({ text: `  "${id}": "pending · ${r.progress}%",`, size: 27, color: '#fbbf24', y: cy, mono: true }); cy += 36; }
  claimLines.push({ text: `  "role": "cloud security & identity engineer"`, size: 27, color: '#ddd6fe', y: cy, mono: true }); cy += 36;
  claimLines.push({ text: '}', size: 27, color: '#f8fafc', y: cy, mono: true }); cy += 30;
  const decP = card(textTexture(claimLines, 900, cy + 10, '#111827'), 3.4, (cy + 10) / 900 * 3.4);
  const decS = card(textTexture([{ text: '✓  signature verified', size: 44, weight: 800, color: '#4ade80', y: 60 }, { text: 'ES256 · issuer nobleantwi.com · not expired', size: 26, weight: 500, color: '#94a3b8', y: 120, mono: true }], 900, 170, '#111827'), 3.4, 0.64);
  const decFrames: THREE.LineSegments[] = [];
  for (const [c, col] of [[decH, 0xf87171], [decP, 0xc4b5fd], [decS, 0x5eead4]] as [THREE.Mesh, number][]) {
    scene.add(c);
    const pg = c.geometry as THREE.PlaneGeometry;
    const f = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(pg.parameters.width + 0.08, pg.parameters.height + 0.08)), new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0 }));
    scene.add(f); decFrames.push(f);
  }
  const seal = new THREE.Mesh(new THREE.RingGeometry(0.34, 0.42, 48), new THREE.MeshBasicMaterial({ color: 0x4ade80, transparent: true, opacity: 0, toneMapped: false, depthWrite: false, side: THREE.DoubleSide }));
  scene.add(seal);

  /* ============ the push approval phone ============ */
  const phone = new THREE.Group(); phone.position.set(WKS.x + 1.05, -0.8, WKS.z + 0.35); phone.rotation.y = -0.45;
  const phoneBody = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.98, 0.05), new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.5 }));
  phone.add(phoneBody);
  const phoneCanvas = document.createElement('canvas'); phoneCanvas.width = 420; phoneCanvas.height = 860;
  const phoneTex = new THREE.CanvasTexture(phoneCanvas); phoneTex.colorSpace = THREE.SRGBColorSpace;
  function drawPhone(state: 'ask' | 'ok' | 'no') {
    const g = phoneCanvas.getContext('2d')!;
    g.fillStyle = '#0b1220'; g.fillRect(0, 0, 420, 860);
    g.fillStyle = '#111827'; g.fillRect(0, 0, 420, 90);
    g.textBaseline = 'middle'; g.fillStyle = '#2dd4bf'; g.font = `700 26px ${SANS}`; g.fillText('Push approval', 28, 45);
    g.fillStyle = '#94a3b8'; g.font = `500 20px ${MONO}`; g.fillText('nobleantwi.com', 28, 140);
    if (state === 'ask') {
      g.fillStyle = '#f8fafc'; g.font = `800 34px ${SANS}`; g.fillText('Someone is trying', 28, 200); g.fillText('to reach Noble.', 28, 244);
      g.fillStyle = '#94a3b8'; g.font = `500 20px ${MONO}`; g.fillText('NUMBER MATCH', 28, 330);
      g.fillStyle = '#f8fafc'; g.font = `800 150px ${SANS}`; g.fillText('42', 28, 430);
      g.fillStyle = '#2dd4bf'; g.fillRect(28, 560, 364, 76); g.fillStyle = '#06201c'; g.font = `700 30px ${SANS}`; g.fillText('Approve', 150, 598);
      g.strokeStyle = '#334155'; g.lineWidth = 3; g.strokeRect(28, 660, 364, 76); g.fillStyle = '#cbd5e1'; g.fillText("It's not me", 140, 698);
    } else if (state === 'ok') {
      g.fillStyle = '#4ade80'; g.font = `800 120px ${SANS}`; g.fillText('✓', 150, 330);
      g.fillStyle = '#f8fafc'; g.font = `800 36px ${SANS}`; g.fillText('Approved.', 28, 470);
      g.fillStyle = '#94a3b8'; g.font = `500 22px ${MONO}`; g.fillText('session granted · 42 matched', 28, 520);
    } else {
      g.fillStyle = '#f87171'; g.font = `800 120px ${SANS}`; g.fillText('✕', 150, 330);
      g.fillStyle = '#f8fafc'; g.font = `800 36px ${SANS}`; g.fillText('Denied.', 28, 470);
      g.fillStyle = '#94a3b8'; g.font = `500 22px ${MONO}`; g.fillText('fair. nothing happened.', 28, 520);
    }
    phoneTex.needsUpdate = true;
  }
  drawPhone('ask');
  const phoneScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.43, 0.88), new THREE.MeshBasicMaterial({ map: phoneTex, toneMapped: false }));
  phoneScreen.position.z = 0.026; phone.add(phoneScreen);
  scene.add(phone);
  root.querySelectorAll<HTMLElement>('[data-approve]').forEach((b) => b.addEventListener('click', () => { drawPhone('ok'); root.classList.add('is-approved'); }));
  root.querySelectorAll<HTMLElement>('[data-deny]').forEach((b) => b.addEventListener('click', () => { drawPhone('no'); root.classList.add('is-denied'); }));

  /* ---------- camera ---------- */
  const KEYS: Key[] = [
    { t: 0.00, pos: [11.5, 1.0, 4.1], look: [10.25, 0.5, 1.8] },
    { t: 0.09, pos: [11.4, 1.15, 3.7], look: [10.3, 0.5, 1.75] },
    { t: 0.17, pos: [10.6, 2.4, 4.6], look: [8.9, 1.1, 0.0] },
    { t: 0.25, pos: [9.6, 2.6, 2.4], look: [7.4, 1.2, -4.0] },
    { t: 0.31, pos: [9.4, 2.4, -3.4], look: [6.3, 1.3, -7.2] },
    { t: 0.37, pos: [8.0, 4.5, -6.5], look: [3.0, 6.0, -12.0] },
    { t: 0.42, pos: [4.0, 13.5, -5.5], look: [0, 9, -15] },
    { t: 0.49, pos: [-3.5, 11.5, -9.5], look: [-9, 7.6, -17] },
    { t: 0.56, pos: [-7.0, 9.6, -12.0], look: [-10, 7.4, -17] },
    { t: 0.60, pos: [-2, 5.0, 5.5], look: [-6, 1.2, -4] },
    { t: 0.66, pos: [-13.6, 2.6, 5.0], look: [-9.3, 0.9, -0.7] },
    { t: 0.71, pos: [-12.8, 1.2, 3.2], look: [-9.6, 0.6, -0.8] },
    { t: 0.745, pos: [-17, 9, 17], look: [-7, 0.5, -1] },
    { t: 0.80, pos: [3, 9, 17], look: [5, 0.5, -1] },
    { t: 0.825, pos: [12.8, 3.4, 6.8], look: [10.2, 1.3, 0.5] },
    { t: 0.85, pos: [12.5, 3.2, 6.5], look: [10.2, 1.2, 0.5] },
    { t: 0.885, pos: [-1, 15, 23], look: [-5, 0, -6] },
    { t: 0.94, pos: [0, 23, 31], look: [0, -6, -4] },
    { t: 1.00, pos: [0, 27, 35], look: [0, -9, -3] },
  ];
  const hold = (c: number, pos: Vec, look: Vec, w = 0.009): Key[] => [{ t: c - w, pos, look }, { t: c + w, pos, look }];
  const WKEYS: Key[] = [
    { t: J, pos: [-0.2, 21.5, 29.5], look: [-1, -4.8, -4.4] },
    ...hold(STOPS[0], [11.6, 2.5, 3.4], [7.8, 0.9, -1.0]),
    ...hold(STOPS[1], [0, 9.5, 15.5], [0, 0, -3]),
    ...hold(STOPS[2], [-4.5, 10.5, -9.5], [-10, 7.4, -17]),
    ...hold(STOPS[3], [15.6, 3.6, -7.4], [12, 1.9, -13]),
    ...hold(STOPS[4], [-5.0, 3.4, 5.4], [-5.1, 2.1, 0.2]),
    ...hold(STOPS[5], [18.2, 5.0, -0.8], [15, 3.7, -5.5]),
    { t: 0.615, pos: [-12.2, 5.0, 7.5], look: [-12.8, 2.0, 0.5] },
    { t: 0.70, pos: [-12.6, 9.5, 10.5], look: [-13.2, 2.8, 0.8] },
    { t: 0.76, pos: [-8.6, 8, 7.5], look: [-13.4, 5.5, 0.8] },
    { t: 0.79, pos: [0.6, 6.4, 8.8], look: [0, 6.0, 1] },
    { t: 0.83, pos: [0.2, 6.1, 10.2], look: [0, 5.9, 1] },
    { t: 0.87, pos: [-0.4, 6.0, 10.8], look: [0, 5.9, 1] },
    { t: 0.90, pos: [12.4, 1.9, 3.9], look: [11.2, 0.95, 1.4] },
    { t: 1.00, pos: [12.2, 1.75, 3.6], look: [11.2, 0.9, 1.4] },
  ];
  const camPos = new THREE.Vector3(), camLook = new THREE.Vector3();
  function camFrom(keys: Key[], t: number) {
    let i = 0; while (i < keys.length - 2 && t > keys[i + 1].t) i++;
    const a = keys[i], b = keys[i + 1];
    const k = ease((t - a.t) / (b.t - a.t));
    camPos.set(...a.pos).lerp(v(b.pos), k);
    camLook.set(...a.look).lerp(v(b.look), k);
    if (camera.aspect < 1) {
      // Desktop pushes some subjects right of the text; a phone has its text at the bottom, so centre them.
      const dx = 2.5 * span(t, 0.60, 0.615) * (1 - span(t, 0.775, 0.785))
               + 2.1 * span(t, STOPS[4] - 0.013, STOPS[4] - 0.006) * (1 - span(t, STOPS[4] + 0.006, STOPS[4] + 0.013));
      camPos.x += dx; camLook.x += dx;
      camPos.sub(camLook).multiplyScalar(1.5).add(camLook);
      // Lift the subject into the top half: aim below it, by a share of the distance.
      const dist = camPos.distanceTo(camLook);
      camLook.y -= dist * 0.2;
    }
  }

  /* ---------- frame state ---------- */
  const bg = new THREE.Color();
  let target = 0, t = 0;
  function resize() { const w = root.clientWidth, h = window.innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.fov = w < h ? 56 : 42; camera.updateProjectionMatrix(); }
  function readScroll() { const rect = root.getBoundingClientRect(); const total = root.offsetHeight - window.innerHeight; target = clamp(-rect.top / total); }
  const stopFocus = (i: number, g: number) => span(g, STOPS[i] - 0.013, STOPS[i] - 0.005) * (1 - span(g, STOPS[i] + 0.005, STOPS[i] + 0.013));

  let frame = 0;
  function tick() {
    if (html.classList.contains('gate-open')) { requestAnimationFrame(tick); return; }
    frame++;
    const forced = (window as unknown as { __jt?: number }).__jt;
    if (forced !== undefined) t = target = forced; else t += (target - t) * 0.085;
    const g = t;
    const tt = Math.min(JMAX, (g / J) * JMAX);
    const jEnd = 1 - span(g, 0.418, 0.428);

    /* background: the visitor's paper at the very start and the very end, dark everywhere else */
    const d = span(g, 0.09 * J / JMAX, 0.18 * J / JMAX);
    bg.copy(theme === 'dark' ? NIGHT : WHITE).lerp(SLATE, d);
    (scene.background as THREE.Color).copy(bg); scene.fog!.color.copy(bg);
    const wantDark = d > 0.5;
    if (wantDark !== dark) { dark = wantDark; html.dataset.theme = dark ? 'dark' : theme; }
    renderer.toneMappingExposure = 1.05 - 0.25 * d;

    const est = span(tt, 0.08, 0.17);
    for (const m of estate) m.opacity = est * ((m as THREE.LineBasicMaterial).isLineBasicMaterial ? 0.8 : 1);

    if (g <= J) camFrom(KEYS, tt); else camFrom(WKEYS, g);
    camera.position.copy(camPos); camera.lookAt(camLook);
    lid.rotation.x = -0.32 + Math.sin(frame * 0.01) * 0.01;

    /* ===== the journey (tt) ===== */
    let p: THREE.Vector3; let orbOn = 1;
    if (tt < 0.11) { p = lidWorld(); orbOn = span(tt, 0.03, 0.09); }
    else if (tt < 0.26) p = legA.getPoint(span(tt, 0.11, 0.24));
    else if (tt < 0.46) p = legB.getPoint(span(tt, 0.27, 0.45));
    else if (tt < 0.58) { p = legD.getPoint(span(tt, 0.47, 0.56)); orbOn = 1 - span(tt, 0.565, 0.59); }
    else if (tt < 0.73) { p = legC.getPoint(span(tt, 0.60, 0.70)); orbOn = span(tt, 0.595, 0.615) * (1 - span(tt, 0.705, 0.725)); }
    else { p = v(SIEM); orbOn = 0; }
    orb.position.copy(p); orb.visible = orbOn > 0.01;
    orbGlow.scale.setScalar(1 + Math.sin(frame * 0.15) * 0.12); orbLight.intensity = 6 * orbOn;
    (orb.material as THREE.MeshBasicMaterial).opacity = orbOn;
    trailPts.unshift(p.clone()); if (trailPts.length > trailN) trailPts.pop();
    for (let i = 0; i < trailN; i++) { const q = trailPts[Math.min(i, trailPts.length - 1)]; trailPos[i * 3] = q.x; trailPos[i * 3 + 1] = q.y; trailPos[i * 3 + 2] = q.z; }
    trailGeo.attributes.position.needsUpdate = true;
    (trail.material as THREE.LineBasicMaterial).opacity = 0.55 * orbOn * span(tt, 0.11, 0.13);

    const fIam = stopFocus(0, g), fLab = stopFocus(1, g), fPost = stopFocus(2, g), fWeb = stopFocus(3, g), fAud = stopFocus(4, g), fScout = stopFocus(5, g);
    dcMat.emissiveIntensity = 0.15 + 0.9 * span(tt, 0.22, 0.25) * (1 - span(tt, 0.48, 0.52)) + 1.1 * fIam;
    const gDC = span(tt, 0.30, 0.34) * (1 - span(tt, 0.46, 0.50));
    gateDC.frame.material.opacity = gDC; gateDC.frame.visible = gDC > 0.01; setOpacity(gateDC.tag, gDC);
    const gLog = span(tt, 0.62, 0.65) * (1 - span(tt, 0.72, 0.75));
    gateLog.frame.material.opacity = gLog; gateLog.frame.visible = gLog > 0.01; setOpacity(gateLog.tag, gLog);
    const fwOn = span(tt, 0.27, 0.32) * (1 - span(tt, 0.87, 0.92));
    denyMat.opacity = fwOn * (0.35 + 0.35 * Math.abs(Math.sin(frame * 0.07)));
    const pull = span(tt, 0.855, 0.90) * jEnd;
    setOpacity(fwLabel, Math.max(pull, fLab));
    const hOn = span(tt, 0.37, 0.43) * (1 - span(tt, 0.56, 0.61)) + pull * 0.5;
    halo.rotation.y = frame * 0.0025;
    (halo.material as THREE.PointsMaterial).opacity = hOn;
    (halo.material as THREE.PointsMaterial).size = 0.07 + 0.05 * span(tt, 0.42, 0.46);
    setOpacity(cloudLabel, span(tt, 0.40, 0.45) * (1 - span(tt, 0.55, 0.59)) + pull * 0.9);
    const pOn = Math.max(span(tt, 0.46, 0.51) * (1 - span(tt, 0.62, 0.66)) + pull, fPost);
    for (const m of platMats) m.opacity = Math.min(1, pOn) * ((m as THREE.LineBasicMaterial).isLineBasicMaterial ? 0.85 : 1);
    const fixed = span(tt, 0.53, 0.575);
    for (const r of resources) { if (r.flagged) r.rim.color.copy(flagColor).lerp(fixedColor, fixed); r.mat.emissiveIntensity = 0.25 + 0.6 * fPost * (0.5 + 0.5 * Math.sin(frame * 0.08 + r.k)); }
    platform.position.y = PLATFORM[1] + Math.sin(frame * 0.012) * 0.08;
    setOpacity(platLabel, Math.max(span(tt, 0.49, 0.53) * (1 - span(tt, 0.6, 0.64)) + pull * 0.9, fPost));

    const swarmField = span(g, 0.605, 0.635) * (1 - span(g, 0.775, 0.80));
    const fieldOn = Math.max(span(tt, 0.63, 0.69) * (1 - span(tt, 0.90, 0.96)) * jEnd, swarmField);
    if (fieldOn > 0 || frame % 30 === 0) {
      const r = Math.max(0.2 + 6 * span(tt, 0.64, 0.74), 6 * swarmField);
      for (let i = 0; i < N * N; i++) {
        const [x, z] = tileXZ[i];
        const dist = Math.hypot(x - SIEM[0], z - SIEM[2]);
        const inside = clamp((r - dist) / 0.6);
        const twinkle = 0.5 + 0.5 * Math.sin(frame * 0.05 + i * 0.37);
        const isAlert = (i * 7919) % 100 < 5;
        tileColor.copy(cDim).lerp(isAlert ? cAlert : (i % 3 === 0 ? cB : cA), inside * fieldOn * (0.35 + 0.65 * twinkle));
        tiles.setColorAt(i, tileColor);
      }
      tiles.instanceColor!.needsUpdate = true;
    }
    siemMat.emissiveIntensity = 0.15 + 1.0 * fieldOn;
    monMat.emissiveIntensity = 0.15 + 0.8 * fScout;
    for (const m of slabMats) m.emissiveIntensity = 0.06 + 0.22 * fLab;

    for (const s of hostLabels) setOpacity(s, Math.max(pull, fLab));
    for (const s of zoneLabels) setOpacity(s, Math.max(pull, fLab));
    setOpacity(hostLabels[6], Math.max(pull, fLab, fIam, span(tt, 0.15, 0.19) * (1 - span(tt, 0.24, 0.28))));
    setOpacity(hostLabels[2], Math.max(pull, fLab, span(tt, 0.62, 0.65) * (1 - span(tt, 0.71, 0.74)), swarmField));

    const sOn = span(tt, 0.735, 0.755) * (1 - span(tt, 0.80, 0.82));
    const sx = -20 + 40 * span(tt, 0.745, 0.805);
    sweep.position.x = sx; sweepGlow.position.x = sx; sweepLabel.position.x = sx;
    sweepMat.opacity = 0.16 * sOn; sweepGlowMat.opacity = 0.35 * sOn; setOpacity(sweepLabel, sOn);
    for (const f of FINDINGS) {
      const seen = sx > f.x ? span(tt, 0.745, 0.76) : 0;
      const on = Math.min(1, seen + pull) * jEnd;
      f.mat.opacity = on * (0.75 + 0.25 * Math.sin(frame * 0.12)); f.mesh.visible = on > 0.01; f.mesh.rotation.y = frame * 0.03;
      const closed = f.closes ? span(tt, 0.815, 0.835) : 0;
      f.mat.color.copy(foundColor).lerp(closedColor, closed);
      setOpacity(f.tag, on * (tt > 0.855 ? 0.9 : 1));
    }

    /* ===== case files (g) ===== */
    const webOn = Math.max(fWeb, fLab * 0.5);
    setMat(webScreen, webOn); (webFrame.material as THREE.LineBasicMaterial).opacity = webOn; (webSlab.material as THREE.MeshStandardMaterial).opacity = webOn;
    setOpacity(webLabel, fWeb);
    web.position.y = WEB[1] + Math.sin(frame * 0.015) * 0.05;
    setMat(dossCard, fAud); (dossFrame.material as THREE.LineBasicMaterial).opacity = fAud;
    dossier.position.y = 2.1 + 0.5 * (1 - fAud) + Math.sin(frame * 0.02) * 0.04; dossier.rotation.y = 0.12 + (1 - fAud) * 0.6;
    setMat(boardCard, fScout); (boardFrame.material as THREE.LineBasicMaterial).opacity = fScout;
    board.position.y = 3.6 + Math.sin(frame * 0.018) * 0.06;

    /* ===== the alert swarm (g) ===== */
    const swIn = span(g, 0.612, 0.70);
    const swSup = span(g, 0.705, 0.74);
    const swRise = span(g, 0.74, 0.77);
    const swOut = 1 - span(g, 0.78, 0.80);
    const swVis = span(g, 0.605, 0.615) * swOut;
    (swarm.material as THREE.MeshStandardMaterial).opacity = swVis;
    swarm.visible = swVis > 0.005;
    if (swarm.visible) {
      let colourDirty = false;
      for (let i = 0; i < SW; i++) {
        const q = ease(clamp((swIn - swDelay[i]) / 0.4));
        swP.copy(swOrigin[i]).lerp(swTarget[i], q);
        swP.y += Math.sin(q * Math.PI) * (1.6 + (i % 5) * 0.3);
        let s = 1;
        if (riseSet.has(i)) { swP.y += swRise * 3.2; s = 1 + swRise * 1.4; swP.z += swRise * 1.2; }
        swE.set((1 - q) * swSpin[i], (1 - q) * swSpin[i] * 1.3 + frame * 0.002, 0);
        swQ.setFromEuler(swE); swS.setScalar(s);
        swM.compose(swP, swQ, swS); swarm.setMatrixAt(i, swM);
        if (swSup > 0 || swRise > 0) {
          const sup = swSev[i] <= 1 && (i % 10) < 7 ? clamp((swSup * (maxLayer + 2) - swLayer[i]) / 1.5) : 0;
          tileColor.copy(sevColor[swSev[i]]).lerp(greenC, sup);
          if (riseSet.has(i)) tileColor.lerp(brightC, swRise);
          swarm.setColorAt(i, tileColor); colourDirty = true;
        }
      }
      swarm.instanceMatrix.needsUpdate = true;
      if (colourDirty) swarm.instanceColor!.needsUpdate = true;
    }
    setOpacity(swarmLabel, span(g, 0.69, 0.71) * (1 - span(g, 0.735, 0.745)) * swOut);

    /* ===== the token (g) ===== */
    const TX = camera.aspect < 1 ? 0 : TOKEN[0];
    tokenLine.position.x = TX;
    tokenTitle.position.x = TX;
    const tokIn = span(g, 0.775, 0.80);
    const tokChars = Math.floor(tokenStr.length * span(g, 0.778, 0.81));
    const split = span(g, 0.815, 0.835);
    const decode = span(g, 0.838, 0.87);
    const tokOut = 1 - span(g, 0.882, 0.895);
    drawToken(tokChars);
    setMat(tokenLine, tokIn * (1 - split) * tokOut);
    setOpacity(tokenTitle, tokIn * tokOut);
    tokenTitle.position.y = TOKEN[1] + 1.2 + split * 1.9;
    const segs: [THREE.Mesh, number][] = [[cardH, 1.5], [cardP, 0], [cardS, -1.5]];
    segs.forEach(([c, dy], i) => { const gone = span(decode, i * 0.3, i * 0.3 + 0.3); c.position.set(TX, TOKEN[1] + dy * 0.8 * split, TOKEN[2]); setMat(c, split * (1 - gone) * tokOut); });
    const decs: [THREE.Mesh, THREE.LineSegments, number, number][] = [[decH, decFrames[0], 0, 2.25], [decP, decFrames[1], 0, -0.1], [decS, decFrames[2], 0, -2.45]];
    decs.forEach(([c, f, dx, dy], i) => {
      const on = span(decode, i * 0.3, i * 0.3 + 0.4) * tokOut;
      c.position.set(TX + dx, TOKEN[1] + dy, TOKEN[2] + 0.02); f.position.copy(c.position);
      setMat(c, on); (f.material as THREE.LineBasicMaterial).opacity = on;
    });
    seal.position.set(TX + 1.25, TOKEN[1] - 2.45, TOKEN[2] + 0.05);
    const sealOn = span(decode, 0.85, 1) * tokOut;
    (seal.material as THREE.MeshBasicMaterial).opacity = sealOn; seal.scale.setScalar(1 + (1 - sealOn) * 1.5); seal.visible = sealOn > 0.01;

    /* ===== push approval (g) ===== */
    const phoneUp = span(g, 0.89, 0.915);
    phone.position.y = -0.8 + phoneUp * 1.72; phone.rotation.y = -0.45 - (1 - phoneUp) * 0.5;
    phone.visible = phoneUp > 0.01;

    /* ===== HTML ===== */
    for (const el of panels) {
      const a = +el.dataset.from!, b = +el.dataset.to!, f = +(el.dataset.fade ?? 0.0137);
      const o = span(g, a, a + f) * (1 - span(g, b - f, b));
      el.style.opacity = String(o);
      el.style.transform = `translateY(${(1 - o) * 18}px)`;
      el.style.visibility = o > 0.01 ? 'visible' : 'hidden';
    }
    for (const el of counters) {
      const a = +el.dataset.from!, dur = +(el.dataset.dur ?? 0.035);
      const k = span(g, a, a + dur);
      const raw = el.dataset.count!;
      const m = raw.match(/^([^\d]*)(\d[\d,]*)(.*)$/);
      if (!m) { el.textContent = raw; continue; }
      const n = Number(m[2].replace(/,/g, ''));
      el.textContent = m[1] + Math.round(n * k).toLocaleString('en-US') + (k >= 1 ? m[3] : m[3].replace(/[+%]/g, ''));
    }
    rail.forEach((r) => { const a = +r.dataset.from!, b = +r.dataset.to!; r.classList.toggle('is-active', g >= a && g < b); });
    root.style.setProperty('--progress', String(g));
    root.classList.toggle('is-end', g > 0.895);

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }

  resize(); readScroll(); t = target;
  window.addEventListener('resize', resize);
  window.addEventListener('scroll', readScroll, { passive: true });
  tick();
  return () => { html.dataset.theme = theme; renderer.dispose(); };
}
