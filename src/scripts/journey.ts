/* The sign-in journey: one request travelling through everything on this
   site, driven by scroll. Identity (AD, Entra ID, Okta), the network
   (pfSense and six VLANs), the cloud (AWS and Azure posture) and detection
   (Wazuh). Everything is built in code from the lab's real layout. No model
   files. Three.js only. */
import * as THREE from 'three';

type Vec = [number, number, number];
interface Key { t: number; pos: Vec; look: Vec }

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
const SIEM: Vec = [-9.8, 0.75, -0.9];
const DC: Vec = [7.6, 0.8, -1.1];
const GATE_DC: Vec = [6.5, 1.3, FW_Z + 0.14];
const GATE_LOG: Vec = [-1.5, 1.3, FW_Z + 0.14];

const WHITE = new THREE.Color(0xffffff);
const SLATE = new THREE.Color(0x0b1220);
const NIGHT = new THREE.Color(0x0f172a); // the site's dark-theme paper

const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ease = (x: number) => { x = clamp(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const span = (t: number, a: number, b: number) => ease((t - a) / (b - a));
const v = (a: Vec) => new THREE.Vector3(...a);

function textTexture(lines: { text: string; size: number; weight?: number; color?: string; mono?: boolean; y: number }[], w: number, h: number, bg = 'rgba(0,0,0,0)') {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d')!;
  g.fillStyle = bg; g.fillRect(0, 0, w, h);
  for (const l of lines) {
    const fam = l.mono ? "'JetBrains Mono Variable', 'JetBrains Mono', monospace" : "'Inter Variable', Inter, sans-serif";
    let size = l.size;
    g.font = `${l.weight ?? 600} ${size}px ${fam}`;
    while (g.measureText(l.text).width > w - 56 && size > 12) { size -= 2; g.font = `${l.weight ?? 600} ${size}px ${fam}`; }
    g.fillStyle = l.color ?? '#0f172a';
    g.textBaseline = 'middle';
    g.fillText(l.text, 28, l.y);
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

export function startJourney(root: HTMLElement) {
  const canvas = root.querySelector('canvas') as HTMLCanvasElement;
  const panels = Array.from(root.querySelectorAll<HTMLElement>('.j-panel'));
  const counters = Array.from(root.querySelectorAll<HTMLElement>('[data-count]'));
  const html = document.documentElement;
  const startTheme = html.dataset.theme;
  // The visitor's own theme choice (the header toggle stores it). The journey's
  // open and close follow it; only the middle forces dark.
  const userTheme = () => { try { return localStorage.getItem('theme') ?? startTheme ?? 'light'; } catch { return startTheme ?? 'light'; } };
  let theme = userTheme();
  new MutationObserver(() => { if (!dark) theme = html.dataset.theme === 'dark' ? 'dark' : 'light'; })
    .observe(html, { attributes: true, attributeFilter: ['data-theme'] });

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

  /* ---------- the estate: six slabs, each with a glowing rim ---------- */
  const slabGeo = new THREE.BoxGeometry(5, 0.22, 5);
  const rimGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(5.02, 0.24, 5.02));
  const zoneLabels: THREE.Sprite[] = [];
  for (const z of ZONES) {
    const slab = new THREE.Mesh(slabGeo, new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.55, metalness: 0.15, emissive: new THREE.Color(z.color), emissiveIntensity: 0.06, transparent: true }));
    slab.position.set(z.x, 0, 0);
    scene.add(slab); estate.push(slab.material);
    const rim = new THREE.LineSegments(rimGeo, new THREE.LineBasicMaterial({ color: z.color, transparent: true, opacity: 0.9 }));
    rim.position.copy(slab.position);
    scene.add(rim); estate.push(rim.material);
    const l = label(`VLAN ${z.id}`, z.name);
    l.position.set(z.x, -0.6, 3.1);
    l.scale.multiplyScalar(0.9);
    scene.add(l); zoneLabels.push(l);
  }

  /* ---------- hosts: blocks with a lit edge ---------- */
  const hostLabels: THREE.Sprite[] = [];
  const hostMats: THREE.MeshStandardMaterial[] = [];
  function block(x: number, y: number, z: number, w: number, h: number, d: number, color: number, glow = 0.15, rimOpacity = 0.7) {
    const m = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4, metalness: 0.35, emissive: new THREE.Color(color), emissiveIntensity: glow, transparent: true });
    const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
    b.position.set(x, y, z);
    scene.add(b); estate.push(m);
    const em = new THREE.LineBasicMaterial({ color, transparent: true, opacity: rimOpacity });
    const e = new THREE.LineSegments(new THREE.EdgesGeometry(b.geometry), em);
    e.position.copy(b.position);
    scene.add(e); estate.push(em);
    hostMats.push(m);
    return { mesh: b, mat: m, rim: em };
  }
  for (const h of HOSTS) {
    const zone = ZONES.find((z) => z.id === h.zone)!;
    block(h.x, 0.11 + h.h / 2, h.z, 0.9, h.h, 0.9, zone.color);
    const l = label(h.name, h.role);
    l.position.set(h.x, 0.11 + h.h + 0.55, h.z);
    l.scale.multiplyScalar(0.75);
    scene.add(l); hostLabels.push(l);
  }
  const dcMat = hostMats[6], siemMat = hostMats[2];

  /* ---------- WKS01: a laptop with a sign-in screen ---------- */
  const laptop = new THREE.Group();
  laptop.position.set(WKS.x, 0.11, WKS.z);
  laptop.rotation.y = -0.55;
  const alu = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.35, metalness: 0.6 });
  const base = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.05, 0.9), alu);
  base.position.y = 0.025;
  laptop.add(base);
  const lid = new THREE.Group();
  lid.position.set(0, 0.05, -0.44);
  lid.rotation.x = -0.32;
  const lidBack = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.86, 0.035), alu);
  lidBack.position.y = 0.43;
  lid.add(lidBack);
  const screenTex = textTexture([
    { text: 'corp.biirabank.com', size: 22, weight: 500, color: '#94a3b8', y: 46, mono: true },
    { text: 'Sign in', size: 46, weight: 800, color: '#f8fafc', y: 110 },
    { text: 'n.antwi@corp.biirabank.com', size: 24, weight: 500, color: '#e2e8f0', y: 190, mono: true },
    { text: '●●●●●●●●●●●●', size: 24, weight: 500, color: '#e2e8f0', y: 246, mono: true },
  ], 640, 420, '#0f172a');
  const sc = screenTex.image as HTMLCanvasElement; const g2 = sc.getContext('2d')!;
  g2.fillStyle = '#2dd4bf'; g2.fillRect(28, 298, 190, 56);
  g2.fillStyle = '#0f172a'; g2.font = "700 26px 'Inter Variable', Inter, sans-serif"; g2.textBaseline = 'middle'; g2.fillText('Sign in  →', 48, 326);
  g2.strokeStyle = '#334155'; g2.lineWidth = 2; g2.strokeRect(28, 166, 584, 50); g2.strokeRect(28, 222, 584, 50);
  screenTex.needsUpdate = true;
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.22, 0.78), new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false }));
  screen.position.set(0, 0.43, 0.019);
  lid.add(screen);
  laptop.add(lid);
  scene.add(laptop);
  const wksLabel = label('WKS01', 'Windows 11 · VLAN 50');
  wksLabel.position.set(WKS.x, 1.45, WKS.z); wksLabel.scale.multiplyScalar(0.75);
  scene.add(wksLabel); hostLabels.push(wksLabel);

  /* ---------- pfSense: a long glass wall with gates ---------- */
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
    const frame = new THREE.Mesh(new THREE.RingGeometry(0.42, 0.52, 48), new THREE.MeshBasicMaterial({ color: 0x22c55e, transparent: true, opacity: 0.0, side: THREE.DoubleSide, toneMapped: false, depthWrite: false }));
    frame.position.set(...p);
    scene.add(frame);
    const tag = label(name, 'permit');
    tag.position.set(p[0], p[1] + 0.95, p[2]); tag.scale.multiplyScalar(0.55);
    scene.add(tag);
    return { frame, tag };
  }
  const gateDC = gate(GATE_DC, 'ENT-03 · outbound');
  const gateLog = gate(GATE_LOG, 'ENT-05 · agent → SIEM01');
  const denyMat = new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0, toneMapped: false, side: THREE.DoubleSide, depthWrite: false });
  const denies = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.16, 0.16), denyMat, 60);
  const dm = new THREE.Matrix4();
  for (let i = 0; i < 60; i++) {
    dm.makeTranslation(-17 + Math.random() * 34, 0.5 + Math.random() * 2.3, FW_Z + 0.1);
    denies.setMatrixAt(i, dm);
  }
  scene.add(denies);

  /* ---------- identity providers: a halo of points high above ---------- */
  const haloN = 2600;
  const haloPos = new Float32Array(haloN * 3);
  for (let i = 0; i < haloN; i++) {
    const a = Math.random() * Math.PI * 2, r = 3.2 + (Math.random() - 0.5) * 0.9;
    haloPos[i * 3] = Math.cos(a) * r;
    haloPos[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
    haloPos[i * 3 + 2] = Math.sin(a) * r;
  }
  const haloGeo = new THREE.BufferGeometry();
  haloGeo.setAttribute('position', new THREE.BufferAttribute(haloPos, 3));
  const halo = new THREE.Points(haloGeo, new THREE.PointsMaterial({ color: 0x5eead4, size: 0.07, transparent: true, opacity: 0, depthWrite: false, toneMapped: false }));
  halo.position.set(...CLOUD);
  scene.add(halo);
  const cloudLabel = label('Entra ID · Okta', 'device trust · second factor · outbound only');
  cloudLabel.position.set(CLOUD[0], CLOUD[1] + 1.6, CLOUD[2]); cloudLabel.scale.multiplyScalar(1.6);
  scene.add(cloudLabel);

  /* ---------- the cloud: a floating platform of AWS and Azure resources ---------- */
  const platform = new THREE.Group();
  platform.position.set(...PLATFORM);
  const platMats: THREE.Material[] = [];
  const plat = new THREE.Mesh(new THREE.BoxGeometry(7.5, 0.18, 4.6), new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.2, emissive: 0x2563eb, emissiveIntensity: 0.08, transparent: true, opacity: 0 }));
  platform.add(plat); platMats.push(plat.material);
  const platRim = new THREE.LineSegments(new THREE.EdgesGeometry(plat.geometry), new THREE.LineBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0 }));
  platform.add(platRim); platMats.push(platRim.material);
  const resources: { rim: THREE.LineBasicMaterial; flagged: boolean }[] = [];
  const resGeo = new THREE.BoxGeometry(0.55, 0.55, 0.55);
  for (let i = 0; i < 16; i++) {
    const azure = i % 2 === 1;
    const x = -3 + (i % 8) * 0.86, z = azure ? 0.9 : -0.9;
    const h = 0.4 + ((i * 37) % 5) * 0.14;
    const m = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4, metalness: 0.3, emissive: new THREE.Color(azure ? 0x7c3aed : 0x2563eb), emissiveIntensity: 0.25, transparent: true, opacity: 0 });
    const b = new THREE.Mesh(resGeo, m);
    b.scale.y = h / 0.55;
    b.position.set(x, 0.09 + h / 2, z);
    platform.add(b); platMats.push(m);
    const flagged = i === 2 || i === 7 || i === 9 || i === 13;
    const rm = new THREE.LineBasicMaterial({ color: flagged ? 0xef4444 : (azure ? 0xa78bfa : 0x60a5fa), transparent: true, opacity: 0 });
    const e = new THREE.LineSegments(new THREE.EdgesGeometry(resGeo), rm);
    e.scale.copy(b.scale); e.position.copy(b.position);
    platform.add(e); platMats.push(rm);
    resources.push({ rim: rm, flagged });
  }
  scene.add(platform);
  const platLabel = label('AWS · Azure', 'federated sign-in · no standing keys · posture scanned');
  platLabel.position.set(PLATFORM[0], PLATFORM[1] + 1.25, PLATFORM[2]); platLabel.scale.multiplyScalar(1.5);
  scene.add(platLabel);
  const fixedColor = new THREE.Color(0x22c55e), flagColor = new THREE.Color(0xef4444);

  /* ---------- SIEM01's field: 2,500 event tiles on the BlueTeam slab ---------- */
  const N = 50, tiles = new THREE.InstancedMesh(new THREE.BoxGeometry(0.082, 0.05, 0.082), new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6, emissive: 0x000000, transparent: true }), N * N);
  const tm = new THREE.Matrix4();
  const tileXZ: [number, number][] = [];
  for (let i = 0; i < N * N; i++) {
    const x = -9 - 2.45 + (i % N) * 0.1, z = -2.45 + Math.floor(i / N) * 0.1;
    tm.makeTranslation(x, 0.14, z);
    tiles.setMatrixAt(i, tm);
    tiles.setColorAt(i, new THREE.Color(0x0f172a));
    tileXZ.push([x, z]);
  }
  tiles.instanceMatrix.needsUpdate = true;
  scene.add(tiles); estate.push(tiles.material as THREE.Material);
  const tileColor = new THREE.Color();
  const cA = new THREE.Color(0x14b8a6), cB = new THREE.Color(0x7c3aed), cDim = new THREE.Color(0x0f172a), cAlert = new THREE.Color(0xf59e0b);

  /* ---------- assessment: a scan plane sweeps the estate, findings appear, one closes ---------- */
  const sweepMat = new THREE.MeshBasicMaterial({ color: 0x14b8a6, transparent: true, opacity: 0, side: THREE.DoubleSide, toneMapped: false, depthWrite: false });
  const sweep = new THREE.Mesh(new THREE.PlaneGeometry(8, 3.4), sweepMat);
  sweep.rotation.y = Math.PI / 2;
  sweep.position.set(-20, 1.8, 0);
  const sweepGlowMat = new THREE.MeshBasicMaterial({ color: 0x14b8a6, transparent: true, opacity: 0, side: THREE.DoubleSide, toneMapped: false, depthWrite: false });
  const sweepGlow = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 8), sweepGlowMat);
  sweepGlow.rotation.x = -Math.PI / 2;
  sweepGlow.position.set(-20, 0.13, 0);
  scene.add(sweep); scene.add(sweepGlow);
  const sweepLabel = label('SCAN01 · credentialed scan', 'Greenbone, signed in as svc-greenbone');
  sweepLabel.position.set(-20, 4.0, 0); sweepLabel.scale.multiplyScalar(1.1);
  scene.add(sweepLabel);
  // findings: where the scans and baselines actually pointed
  const FINDINGS: { x: number; z: number; y: number; name: string; closes: boolean }[] = [
    { x: -16.2, z: 1.2, y: 1.3, name: 'ADM01 · CIS 26%', closes: false },
    { x: 7.6, z: -1.1, y: 2.2, name: 'DC01 · CIS 26%', closes: false },
    { x: WKS.x, z: WKS.z, y: 1.9, name: 'WKS01 · TLS 1.0 and 1.1 on RDP', closes: true },
  ];
  const findings = FINDINGS.map((f) => {
    const m = new THREE.MeshBasicMaterial({ color: 0xef4444, transparent: true, opacity: 0, toneMapped: false, depthWrite: false });
    const d = new THREE.Mesh(new THREE.OctahedronGeometry(0.22), m);
    d.position.set(f.x, f.y, f.z);
    scene.add(d);
    const tag = label(f.name, f.closes ? 'found · fixed by policy · proved gone' : 'baseline recorded before hardening');
    tag.position.set(f.x, f.y + 0.75, f.z); tag.scale.multiplyScalar(0.7);
    scene.add(tag);
    return { ...f, mesh: d, mat: m, tag };
  });
  const foundColor = new THREE.Color(0xef4444), closedColor = new THREE.Color(0x22c55e);

  /* ---------- the request: a glowing orb with a trail ---------- */
  const orb = new THREE.Mesh(new THREE.SphereGeometry(0.11, 24, 24), new THREE.MeshBasicMaterial({ color: 0x2dd4bf, toneMapped: false, transparent: true }));
  const orbGlow = new THREE.Mesh(new THREE.SphereGeometry(0.26, 24, 24), new THREE.MeshBasicMaterial({ color: 0x2dd4bf, transparent: true, opacity: 0.25, toneMapped: false, depthWrite: false }));
  const orbLight = new THREE.PointLight(0x2dd4bf, 6, 6);
  orb.add(orbGlow); orb.add(orbLight);
  scene.add(orb);
  const trailN = 40;
  const trailPos = new Float32Array(trailN * 3);
  const trailGeo = new THREE.BufferGeometry();
  trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPos, 3));
  const trail = new THREE.Line(trailGeo, new THREE.LineBasicMaterial({ color: 0x2dd4bf, transparent: true, opacity: 0.55 }));
  scene.add(trail);
  const trailPts: THREE.Vector3[] = [];

  const screenPoint = new THREE.Vector3();
  const lidWorld = () => { screen.getWorldPosition(screenPoint); return screenPoint.clone(); };
  // A: screen -> DC01. B: DC01 -> gate -> the identity halo. D: halo -> the cloud platform. C: WKS01 -> gate -> SIEM01.
  const legA = new THREE.CatmullRomCurve3([lidWorld(), new THREE.Vector3(9.6, 1.3, 0.4), v(DC)]);
  const legB = new THREE.CatmullRomCurve3([v(DC), new THREE.Vector3(7.2, 1.6, -3.5), v(GATE_DC), new THREE.Vector3(4.5, 4.5, -11), v(CLOUD)]);
  const legD = new THREE.CatmullRomCurve3([v(CLOUD), new THREE.Vector3(-4, 9.5, -17), new THREE.Vector3(PLATFORM[0], PLATFORM[1] + 0.6, PLATFORM[2])]);
  const legC = new THREE.CatmullRomCurve3([lidWorld(), new THREE.Vector3(6, 1.6, -3), v(GATE_LOG), new THREE.Vector3(-6, 1.4, -3.5), v(SIEM)]);

  /* ---------- camera keyframes ---------- */
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
  const camPos = new THREE.Vector3(), camLook = new THREE.Vector3();
  function camAt(t: number) {
    let i = 0; while (i < KEYS.length - 2 && t > KEYS[i + 1].t) i++;
    const a = KEYS[i], b = KEYS[i + 1];
    const k = ease((t - a.t) / (b.t - a.t));
    camPos.set(...a.pos).lerp(v(b.pos), k);
    camLook.set(...a.look).lerp(v(b.look), k);
    // A portrait screen sees less: pull the camera back and widen the lens.
    if (camera.aspect < 1) camPos.sub(camLook).multiplyScalar(1.5).add(camLook);
  }

  /* ---------- per-frame state ---------- */
  const bg = new THREE.Color();
  let target = 0, t = 0, dark = false;
  let w = 0, h = 0;
  function resize() {
    w = root.clientWidth; h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.fov = w < h ? 56 : 42; camera.updateProjectionMatrix();
  }
  function readScroll() {
    const rect = root.getBoundingClientRect();
    const total = root.offsetHeight - window.innerHeight;
    target = clamp(-rect.top / total);
  }

  let frame = 0;
  function tick() {
    frame++;
    const forced = (window as unknown as { __jt?: number }).__jt;
    if (forced !== undefined) t = target = forced; else t += (target - t) * 0.085;
    const tt = t;

    // background: white open, dark middle, white close
    const d = span(tt, 0.09, 0.18) * (1 - span(tt, 0.905, 0.97));
    bg.copy(theme === 'dark' ? NIGHT : WHITE).lerp(SLATE, d);
    (scene.background as THREE.Color).copy(bg);
    scene.fog!.color.copy(bg);
    const wantDark = d > 0.5;
    if (wantDark !== dark) { dark = wantDark; html.dataset.theme = dark ? 'dark' : theme; }
    renderer.toneMappingExposure = 1.05 - 0.25 * d;

    const est = span(tt, 0.08, 0.17);
    for (const m of estate) m.opacity = est * ((m as THREE.LineBasicMaterial).isLineBasicMaterial ? 0.8 : 1);

    camAt(tt);
    camera.position.copy(camPos);
    camera.lookAt(camLook);

    lid.rotation.x = -0.32 + Math.sin(frame * 0.01) * 0.01;

    // the request's position
    let p: THREE.Vector3;
    let orbOn = 1;
    if (tt < 0.11) { p = lidWorld(); orbOn = span(tt, 0.03, 0.09); }
    else if (tt < 0.26) p = legA.getPoint(span(tt, 0.11, 0.24));
    else if (tt < 0.46) p = legB.getPoint(span(tt, 0.27, 0.45));
    else if (tt < 0.58) { p = legD.getPoint(span(tt, 0.47, 0.56)); orbOn = 1 - span(tt, 0.565, 0.59); }
    else if (tt < 0.73) { p = legC.getPoint(span(tt, 0.60, 0.70)); orbOn = span(tt, 0.595, 0.615) * (1 - span(tt, 0.705, 0.725)); }
    else { p = v(SIEM); orbOn = 0; }
    orb.position.copy(p);
    orb.visible = orbOn > 0.01;
    orbGlow.scale.setScalar(1 + Math.sin(frame * 0.15) * 0.12);
    orbLight.intensity = 6 * orbOn;
    (orb.material as THREE.MeshBasicMaterial).opacity = orbOn;
    trailPts.unshift(p.clone()); if (trailPts.length > trailN) trailPts.pop();
    for (let i = 0; i < trailN; i++) { const q = trailPts[Math.min(i, trailPts.length - 1)]; trailPos[i * 3] = q.x; trailPos[i * 3 + 1] = q.y; trailPos[i * 3 + 2] = q.z; }
    trailGeo.attributes.position.needsUpdate = true;
    (trail.material as THREE.LineBasicMaterial).opacity = 0.55 * orbOn * span(tt, 0.11, 0.13);

    // DC01 lights when the request arrives
    dcMat.emissiveIntensity = 0.15 + 0.9 * span(tt, 0.22, 0.25) * (1 - span(tt, 0.48, 0.52));

    // the firewall: gates open as the request passes, denied knocks flicker on the wall
    const gDC = span(tt, 0.30, 0.34) * (1 - span(tt, 0.46, 0.50));
    gateDC.frame.material.opacity = gDC; gateDC.frame.visible = gDC > 0.01; setOpacity(gateDC.tag, gDC);
    const gLog = span(tt, 0.62, 0.65) * (1 - span(tt, 0.72, 0.75));
    gateLog.frame.material.opacity = gLog; gateLog.frame.visible = gLog > 0.01; setOpacity(gateLog.tag, gLog);
    const fwOn = span(tt, 0.27, 0.32) * (1 - span(tt, 0.87, 0.92));
    denyMat.opacity = fwOn * (0.35 + 0.35 * Math.abs(Math.sin(frame * 0.07)));
    setOpacity(fwLabel, span(tt, 0.855, 0.90) * (1 - span(tt, 0.95, 1.0)));

    // the halo turns and brightens for the identity scene
    const pull = span(tt, 0.855, 0.90) * (1 - span(tt, 0.95, 1.0));
    const hOn = span(tt, 0.37, 0.43) * (1 - span(tt, 0.56, 0.61)) + pull * 0.5;
    halo.rotation.y = frame * 0.0025;
    (halo.material as THREE.PointsMaterial).opacity = hOn;
    (halo.material as THREE.PointsMaterial).size = 0.07 + 0.05 * span(tt, 0.42, 0.46);
    setOpacity(cloudLabel, span(tt, 0.40, 0.45) * (1 - span(tt, 0.55, 0.59)) + pull * 0.9);

    // the cloud platform appears for the federation scene; flagged resources turn green as posture is fixed
    const pOn = span(tt, 0.46, 0.51) * (1 - span(tt, 0.62, 0.66)) + pull;
    for (const m of platMats) m.opacity = pOn * ((m as THREE.LineBasicMaterial).isLineBasicMaterial ? 0.85 : 1);
    const fixed = span(tt, 0.53, 0.575);
    for (const r of resources) if (r.flagged) r.rim.color.copy(flagColor).lerp(fixedColor, fixed);
    platform.position.y = PLATFORM[1] + Math.sin(frame * 0.012) * 0.08;
    setOpacity(platLabel, span(tt, 0.49, 0.53) * (1 - span(tt, 0.6, 0.64)) + pull * 0.9);

    // SIEM field: a wave of events spreads from SIEM01; alerts are the amber few
    const fieldOn = span(tt, 0.63, 0.69) * (1 - span(tt, 0.90, 0.96));
    if (fieldOn > 0 || frame % 30 === 0) {
      const r = 0.2 + 6 * span(tt, 0.64, 0.74);
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

    // labels: subject hosts while they are the subject, everything in the pull-back
    for (const s of hostLabels) setOpacity(s, pull);
    for (const s of zoneLabels) setOpacity(s, pull);
    setOpacity(hostLabels[6], Math.max(pull, span(tt, 0.15, 0.19) * (1 - span(tt, 0.24, 0.28))));
    setOpacity(hostLabels[2], Math.max(pull, span(tt, 0.62, 0.65) * (1 - span(tt, 0.71, 0.74))));

    // assessment: the scan plane sweeps left to right; findings appear as it passes; WKS01's closes
    const sOn = span(tt, 0.735, 0.755) * (1 - span(tt, 0.80, 0.82));
    const sx = -20 + 40 * span(tt, 0.745, 0.805);
    sweep.position.x = sx; sweepGlow.position.x = sx; sweepLabel.position.x = sx;
    sweepMat.opacity = 0.16 * sOn;
    sweepGlowMat.opacity = 0.35 * sOn;
    setOpacity(sweepLabel, sOn);
    for (const f of findings) {
      const seen = sx > f.x ? span(tt, 0.745, 0.76) : 0;
      const on = tt < 0.95 ? Math.min(1, seen + pull) : 0;
      f.mat.opacity = on * (0.75 + 0.25 * Math.sin(frame * 0.12));
      f.mesh.visible = on > 0.01;
      f.mesh.rotation.y = frame * 0.03;
      const closed = f.closes ? span(tt, 0.815, 0.835) : 0;
      f.mat.color.copy(foundColor).lerp(closedColor, closed);
      setOpacity(f.tag, on * (tt > 0.855 ? 0.9 : 1));
    }

    // HTML copy panels and counters
    for (const el of panels) {
      const a = +el.dataset.from!, b = +el.dataset.to!;
      const o = span(tt, a, a + 0.03) * (1 - span(tt, b - 0.03, b));
      el.style.opacity = String(o);
      el.style.transform = `translateY(${(1 - o) * 18}px)`;
      el.style.visibility = o > 0.01 ? 'visible' : 'hidden';
    }
    for (const el of counters) {
      const a = +el.dataset.from!, n = +el.dataset.count!;
      const k = span(tt, a, a + 0.08);
      el.textContent = Math.round(n * k).toLocaleString('en-US') + (el.dataset.suffix ?? '');
    }

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }

  resize();
  readScroll(); t = target;
  window.addEventListener('resize', resize);
  window.addEventListener('scroll', readScroll, { passive: true });
  tick();

  return () => { html.dataset.theme = theme; renderer.dispose(); };
}
