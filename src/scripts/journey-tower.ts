/* The opening of the homepage: one sign-in rising through six controls.
   A tower of six layers, each a control the sign-in has to pass: a directory,
   a firewall, an identity provider, the cloud, detection and assessment.
   It stands well away from the lab map, which the rest of the page uses, so
   the first screens are about the work and not about one lab.

   journey.ts owns the scene, the orb and the camera; this file builds the
   tower, says where the orb is at each moment, and gives the camera its path. */
import * as THREE from 'three';

type Vec = [number, number, number];
interface Key { t: number; pos: Vec; look: Vec }

const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ease = (x: number) => { x = clamp(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const span = (t: number, a: number, b: number) => ease((t - a) / (b - a));

/* where the tower stands, and the height of each layer */
export const AX = 70, AZ = 50;
const Y = [8, 14, 20, 26, 32, 38];
/* in the closing view the layers close up into one stack, this far apart */
const PACK = 2.5;
/* the camera looks from this side; `RIGHT` is to its right */
const SIDE = [-0.64, -0.77], RIGHT = [-0.77, 0.64];
/* turns a layer so its local x runs across the picture and its local z points away from the camera */
const FACE = 0.694;

const TEAL = 0x2dd4bf, SLATE = 0x1e293b;
const cam = (y: number, r: number, up: number, lookUp = 0.2): { pos: Vec; look: Vec } =>
  ({ pos: [AX + SIDE[0] * r, y + up, AZ + SIDE[1] * r], look: [AX, y + lookUp, AZ] });

/* The camera's path through the opening, on the journey's own clock (0 to 0.92). */
export const TOWER_KEYS: Key[] = [
  { t: 0.00, pos: [11.5, 1.0, 4.1], look: [10.25, 0.5, 1.8] },
  { t: 0.09, pos: [11.4, 1.15, 3.7], look: [10.3, 0.5, 1.75] },
  { t: 0.125, pos: [8.6, 2.4, -1.2], look: [30, 4.2, 18] },
  { t: 0.175, ...cam(Y[0], 6.4, 2.3) },
  { t: 0.255, ...cam(Y[0], 6.0, 2.0) },
  { t: 0.295, ...cam(Y[1], 6.6, -0.4, -0.5) },
  { t: 0.365, ...cam(Y[1], 6.2, 2.8, 0.1) },
  { t: 0.405, ...cam(Y[2], 5.9, 1.4, -0.1) },
  { t: 0.465, ...cam(Y[2], 5.7, 1.8, 0.2) },
  { t: 0.505, ...cam(Y[3], 6.9, 3.4, 0.1) },
  { t: 0.59, ...cam(Y[3], 6.5, 3.1, 0.1) },
  { t: 0.635, ...cam(Y[4], 6.2, 2.1) },
  { t: 0.715, ...cam(Y[4], 5.9, 1.9) },
  { t: 0.76, ...cam(Y[5], 6.4, 2.3) },
  { t: 0.845, ...cam(Y[5], 6.1, 2.0) },
  { t: 0.874, ...cam(Y[0] + 2.5 * PACK, 19.5, 3.4, 0.7) },
  { t: 0.897, ...cam(Y[0] + 2.5 * PACK, 18.5, 3.2, 0.7) },
  { t: 0.92, ...cam(Y[0] + 2.5 * PACK, 18.0, 3.1, 0.7) },
];

/* After the opening the layers stay closed up in one stack, and the case files visit them. */
export const packedY = (i: number) => Y[0] + i * PACK;
/** A camera on one layer of the closed-up stack. */
export const layerCam = (i: number, r = 6.8, up = 2.0, lookUp = 0.1) => cam(packedY(i), r, up, lookUp);
/** A camera on the whole closed-up stack. */
export const stackCam = (r = 18.0) => cam(Y[0] + 2.5 * PACK, r, 3.1, 0.7);
/** A point beside a layer of the stack: `side` units to the camera's right, `near` units toward the camera, `up` above the layer. */
export const beside = (i: number, side: number, near: number, up: number): Vec =>
  [AX + RIGHT[0] * side + SIDE[0] * near, packedY(i) + up, AZ + RIGHT[1] * side + SIDE[1] * near];
/** The turn that makes a flat card face the camera. */
export const FACE_CAMERA = Math.atan2(SIDE[0], SIDE[1]);

/* the orb's height on the tower's axis, by the journey's clock */
const RISE: [number, number][] = [
  [0.165, 6.2], [0.19, Y[0]], [0.255, Y[0]], [0.29, Y[1] - 0.9], [0.325, Y[1] - 0.9], [0.355, Y[1] + 1.0], [0.385, Y[2] - 1.9],
  [0.415, Y[2] - 0.8], [0.445, Y[2] + 0.8], [0.47, Y[2] + 2], [0.50, Y[3] + 0.6], [0.59, Y[3] + 0.6], [0.63, Y[4] + 0.3],
  [0.715, Y[4] + 0.3], [0.755, Y[5] + 0.5], [0.85, Y[5] + 0.5], [0.90, Y[5] + 3.5],
];

export function buildTower(scene: THREE.Scene, label: (text: string, sub?: string) => THREE.Sprite) {
  const tower = new THREE.Group();
  tower.visible = false;
  scene.add(tower);

  const layers: THREE.Group[] = [];
  const layer = (i: number) => { const g = new THREE.Group(); g.position.set(AX, Y[i], AZ); g.rotation.y = FACE; tower.add(g); layers[i] = g; return g; };
  const solid = (color: number, glow = 0.35) => new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4, metalness: 0.35, emissive: new THREE.Color(color), emissiveIntensity: glow });
  const box = (parent: THREE.Object3D, w: number, h: number, d: number, color: number, glow = 0.35) => {
    const m = solid(color, glow);
    const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
    b.add(new THREE.LineSegments(new THREE.EdgesGeometry(b.geometry), new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.8 })));
    parent.add(b);
    return b;
  };
  const dummy = new THREE.Object3D();
  const col = new THREE.Color(), dim = new THREE.Color(SLATE), teal = new THREE.Color(TEAL), red = new THREE.Color(0xef4444), green = new THREE.Color(0x22c55e);

  /* a caption for each layer; journey.ts cannot see these, so their opacity is set in update() */
  const NAMES: [string, string][] = [
    ['Directory', 'password checked · ticket issued'],
    ['Firewall', 'deny by default · one written rule'],
    ['Identity provider', 'device · second factor'],
    ['Cloud', 'federated · no standing keys'],
    ['Detection', 'every event kept · few alert'],
    ['Assessment', 'found · fixed · proved gone'],
  ];
  const captions = NAMES.map(([a, b], i) => { const s = label(a, b); s.position.set(AX, Y[i] + 2.0, AZ); tower.add(s); return s; });
  const capScale = captions[0].scale.clone();

  /* ---------- 1. directory: a ring of identities, and the one that matches ---------- */
  const dir = layer(0);
  dir.rotation.y = 0;
  const CARDS = 22, RING = 2.1;
  const KIND = [0x3b82f6, 0x7c3aed, 0xf59e0b];
  const cards = new THREE.InstancedMesh(new THREE.BoxGeometry(0.5, 0.34, 0.03), new THREE.MeshBasicMaterial({ toneMapped: false }), CARDS);
  for (let i = 0; i < CARDS; i++) {
    const a = (i / CARDS) * Math.PI * 2;
    dummy.position.set(Math.cos(a) * RING, (i % 3 - 1) * 0.07, Math.sin(a) * RING); dummy.rotation.set(0, Math.PI / 2 - a, 0); dummy.scale.setScalar(i === 0 ? 0 : 1); dummy.updateMatrix();
    cards.setMatrixAt(i, dummy.matrix);
    cards.setColorAt(i, col.set(KIND[i % 3]).multiplyScalar(0.3));
  }
  dir.add(cards);
  const match = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.34, 0.03), new THREE.MeshBasicMaterial({ color: 0x334155, toneMapped: false }));
  match.rotation.y = Math.PI / 2;
  dir.add(match);
  for (const y of [-0.42, 0.42]) {
    const rail = new THREE.Mesh(new THREE.TorusGeometry(RING, 0.012, 8, 96), new THREE.MeshBasicMaterial({ color: TEAL, transparent: true, opacity: 0.35, toneMapped: false }));
    rail.rotation.x = Math.PI / 2; rail.position.y = y; dir.add(rail);
  }
  /* the ring comes to rest with the matching card facing the camera */
  const DIR_REST = -Math.atan2(SIDE[1], SIDE[0]);

  /* ---------- 2. firewall: a closed grid with one opening ---------- */
  const fw = layer(1);
  const GRID = 9, PITCH = 0.48;
  const cells: [number, number][] = [];
  for (let i = 0; i < GRID; i++) for (let j = 0; j < GRID; j++) if (!(i === 4 && j === 4)) cells.push([(i - 4) * PITCH, (j - 4) * PITCH]);
  const grid = new THREE.InstancedMesh(new THREE.BoxGeometry(0.42, 0.07, 0.42), new THREE.MeshStandardMaterial({ roughness: 0.5, metalness: 0.3 }), cells.length);
  cells.forEach(([x, z], i) => { dummy.position.set(x, 0, z); dummy.rotation.set(0, 0, 0); dummy.scale.setScalar(1); dummy.updateMatrix(); grid.setMatrixAt(i, dummy.matrix); grid.setColorAt(i, col.set(0x475569)); });
  fw.add(grid);
  const gate = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.035, 10, 48), new THREE.MeshBasicMaterial({ color: 0x22c55e, transparent: true, opacity: 0, toneMapped: false }));
  gate.rotation.x = Math.PI / 2; fw.add(gate);
  const DENIED = [3, 11, 19, 30, 44, 52, 61, 70, 76];
  const sparkPos = new Float32Array(DENIED.length * 3);
  const sparkGeo = new THREE.BufferGeometry(); sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
  const sparks = new THREE.Points(sparkGeo, new THREE.PointsMaterial({ color: 0xef4444, size: 0.13, transparent: true, opacity: 0.9, toneMapped: false, depthWrite: false }));
  fw.add(sparks);

  /* ---------- 3. identity provider: two checks, passed one after the other ---------- */
  const idp = layer(2);
  const checks = [-0.8, 0.8].map((y, k) => {
    const g = new THREE.Group(); g.position.y = y; idp.add(g);
    const m = new THREE.MeshBasicMaterial({ color: 0x475569, toneMapped: false });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.045, 10, 96), m); ring.rotation.x = Math.PI / 2; g.add(ring);
    const ticks = new THREE.InstancedMesh(new THREE.BoxGeometry(0.05, 0.16, 0.2), m, 16);
    for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; dummy.position.set(Math.cos(a) * 1.5, 0, Math.sin(a) * 1.5); dummy.rotation.set(0, -a, 0); dummy.scale.setScalar(1); dummy.updateMatrix(); ticks.setMatrixAt(i, dummy.matrix); }
    g.add(ticks);
    const tag = label(k === 0 ? 'device' : 'second factor');
    tag.scale.multiplyScalar(0.5); tag.position.set(AX + RIGHT[0] * 2.3, Y[2] + y + 0.1, AZ + RIGHT[1] * 2.3); tower.add(tag);
    return { g, m, tag };
  });

  /* ---------- 4. cloud: two platforms, and the few things this identity may touch ---------- */
  const cloud = layer(3);
  const PLAT = [{ x: -1.4, c: 0x7c3aed }, { x: 1.4, c: 0x3b82f6 }];
  const RES = 16;
  const resources = new THREE.InstancedMesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), new THREE.MeshBasicMaterial({ toneMapped: false }), RES * 2);
  const resAt: THREE.Vector3[] = [];
  PLAT.forEach((p, k) => {
    box(cloud, 2.2, 0.1, 2.2, p.c, 0.3).position.set(p.x, -0.2, 0);
    for (let i = 0; i < RES; i++) {
      const at = new THREE.Vector3(p.x + (i % 4 - 1.5) * 0.48, 0.05 + ((i * 7) % 3) * 0.08, (Math.floor(i / 4) - 1.5) * 0.48);
      resAt.push(at);
      dummy.position.copy(at); dummy.rotation.set(0, 0, 0); dummy.scale.set(1, 1 + ((i * 5) % 4) * 0.35, 1); dummy.updateMatrix();
      resources.setMatrixAt(k * RES + i, dummy.matrix);
    }
  });
  cloud.add(resources);
  const ALLOWED = [6, 9, RES + 5, RES + 10];
  const reachPos = new Float32Array(ALLOWED.length * 6);
  ALLOWED.forEach((n, i) => { reachPos.set([0, 0.6, 0, resAt[n].x, resAt[n].y + 0.2, resAt[n].z], i * 6); });
  const reachGeo = new THREE.BufferGeometry(); reachGeo.setAttribute('position', new THREE.BufferAttribute(reachPos, 3));
  const reach = new THREE.LineSegments(reachGeo, new THREE.LineBasicMaterial({ color: TEAL, transparent: true, opacity: 0, toneMapped: false }));
  cloud.add(reach);

  /* ---------- 5. detection: every event lands in the record, a few stand out ---------- */
  const det = layer(4);
  const LEDGER = new THREE.Vector3(1.5, -0.7, 0.2);
  const PAGES = 18;
  const pages = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.5, 0.5, 0.05, 32), solid(TEAL, 0.5), PAGES);
  for (let i = 0; i < PAGES; i++) { dummy.position.set(LEDGER.x, LEDGER.y + i * 0.085, LEDGER.z); dummy.rotation.set(0, 0, 0); dummy.scale.setScalar(1); dummy.updateMatrix(); pages.setMatrixAt(i, dummy.matrix); }
  pages.count = 0; det.add(pages);
  const EVENTS = 110;
  const evPos = new Float32Array(EVENTS * 3), evCol = new Float32Array(EVENTS * 3);
  for (let i = 0; i < EVENTS; i++) { col.set(i % 19 === 0 ? 0xf59e0b : i % 3 === 0 ? 0x60a5fa : TEAL).toArray(evCol, i * 3); }
  const evGeo = new THREE.BufferGeometry();
  evGeo.setAttribute('position', new THREE.BufferAttribute(evPos, 3)); evGeo.setAttribute('color', new THREE.BufferAttribute(evCol, 3));
  const events = new THREE.Points(evGeo, new THREE.PointsMaterial({ size: 0.085, vertexColors: true, transparent: true, opacity: 0.95, toneMapped: false, depthWrite: false }));
  det.add(events);

  /* ---------- 6. assessment: scanned, one finding, fixed, proved ---------- */
  const assess = layer(5);
  const pillars = [-1.8, -0.9, 0, 0.9, 1.8].map((x, i) => { const h = 0.9 + ((i * 3) % 4) * 0.25; const b = box(assess, 0.52, h, 0.52, 0x3b82f6, 0.3); b.position.set(x, h / 2 - 0.6, 0.9); return b; });
  const FOUND = 3;
  const foundMat = pillars[FOUND].material as THREE.MeshStandardMaterial;
  const foundEdge = (pillars[FOUND].children[0] as THREE.LineSegments).material as THREE.LineBasicMaterial;
  const blue = new THREE.Color(0x3b82f6);
  const scanMat = new THREE.MeshBasicMaterial({ color: TEAL, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, toneMapped: false });
  const scan = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2.4), scanMat);
  scan.rotation.y = Math.PI / 2; scan.position.set(-2.6, 0.2, 0.9); assess.add(scan);

  /* a sparse field of motes around the tower and along the way to it: something for the eye to measure distance by */
  const MOTES = 520, motePos = new Float32Array(MOTES * 3);
  for (let i = 0; i < MOTES; i++) {
    const r1 = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1, r2 = Math.abs(Math.sin(i * 78.233) * 12543.123) % 1, r3 = Math.abs(Math.sin(i * 39.425) * 9631.77) % 1;
    if (i < 380) { const a = r1 * Math.PI * 2, r = 9.5 + 9 * r2; motePos.set([AX + Math.cos(a) * r, 2 + 42 * r3, AZ + Math.sin(a) * r], i * 3); }
    else { const k = r1; motePos.set([10 + (AX - 10) * k + (r2 - 0.5) * 9, 1 + 7 * k + (r3 - 0.5) * 7, 2 + (AZ - 2) * k + (r2 * r3 - 0.25) * 12], i * 3); }
  }
  const moteGeo = new THREE.BufferGeometry(); moteGeo.setAttribute('position', new THREE.BufferAttribute(motePos, 3));
  tower.add(new THREE.Points(moteGeo, new THREE.PointsMaterial({ color: 0x64748b, size: 0.05, transparent: true, opacity: 0.7, depthWrite: false })));

  /* the line the sign-in took, shown when the whole tower is in view */
  const pathMat = new THREE.LineBasicMaterial({ color: TEAL, transparent: true, opacity: 0, toneMapped: false });
  tower.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(AX, Y[0] - 1.6, AZ), new THREE.Vector3(AX, Y[0] + 5 * PACK + 1.8, AZ)]), pathMat));

  /* where the orb is: from the laptop to the foot of the tower, then up its axis */
  const at = new THREE.Vector3();
  function orbAt(tt: number, from: THREE.Vector3) {
    if (tt < 0.165) return at.copy(from).lerp(new THREE.Vector3(AX, RISE[0][1], AZ), span(tt, 0.11, 0.165));
    let i = 0; while (i < RISE.length - 2 && tt > RISE[i + 1][0]) i++;
    const [t0, y0] = RISE[i], [t1, y1] = RISE[i + 1];
    const y = y0 + (y1 - y0) * span(tt, t0, t1), k = span(tt, 0.85, 0.874);
    return at.set(AX, y + (Y[0] + 5 * PACK + 1.6 - y) * k, AZ);
  }

  /* how much the whole tower is in view (the last panel of the opening) */
  const whole = (tt: number) => span(tt, 0.85, 0.874);

  let lastMatch = -1, lastScope = -1;
  /* `capView` is given once the opening is over: how much the stack shows its six captions (1 in the whole view, 0 on a single layer). */
  /* `solo` and `soloAmt` let one layer stand alone: on a phone the copy sits under the picture, and the layers below the one in view would run behind it. */
  function update(tt: number, frame: number, shown: boolean, capView?: number, solo = -1, soloAmt = 0) {
    tower.visible = shown && tt > 0.1;
    if (!tower.visible) return;
    const all = capView ?? whole(tt);
    /* a layer's caption shows while the camera is on that layer, and again, larger and to the side, in the whole view */
    const on = [span(tt, 0.17, 0.2) * (1 - span(tt, 0.25, 0.27)), span(tt, 0.285, 0.31) * (1 - span(tt, 0.36, 0.38)), span(tt, 0.395, 0.42) * (1 - span(tt, 0.465, 0.48)),
      span(tt, 0.5, 0.52) * (1 - span(tt, 0.59, 0.605)), span(tt, 0.63, 0.65) * (1 - span(tt, 0.715, 0.73)), span(tt, 0.755, 0.775) * (1 - span(tt, 0.84, 0.855))];
    /* in the closing view the layers close up into one stack, with each caption beside its layer */
    const packed = span(tt, 0.85, 0.874);
    const yOf = (i: number) => Y[i] + (Y[0] + i * PACK - Y[i]) * packed;
    layers.forEach((g, i) => { if (i !== 3) g.position.y = yOf(i); g.scale.setScalar(solo >= 0 && i !== solo ? Math.max(0.0001, 1 - soloAmt) : 1); });
    captions.forEach((s, i) => {
      (s.material as THREE.SpriteMaterial).opacity = Math.max(on[i], all);
      s.scale.copy(capScale).multiplyScalar(1 + 0.7 * all);
      s.position.set(AX + RIGHT[0] * 5.2 * all, yOf(i) + 2.0 - 1.9 * all, AZ + RIGHT[1] * 5.2 * all);
    });
    pathMat.opacity = 0.55 * all;

    /* 1. the ring turns as the sign-in arrives and settles on the match */
    const found = span(tt, 0.195, 0.225);
    dir.rotation.y = DIR_REST + 2.6 * (1 - span(tt, 0.13, 0.205));
    match.position.set(RING + 0.45 * found, 0, 0); match.scale.setScalar(1 + 0.35 * found);
    if (Math.abs(found - lastMatch) > 0.002) { lastMatch = found; (match.material as THREE.MeshBasicMaterial).color.set(0x475569).lerp(teal, found); }

    /* 2. refused everywhere but the one opening */
    const open = span(tt, 0.3, 0.33);
    gate.scale.setScalar(0.5 + 0.9 * open); (gate.material as THREE.MeshBasicMaterial).opacity = open;
    DENIED.forEach((n, i) => {
      const ph = (frame * 0.011 + i * 0.173) % 1;
      const [x, z] = cells[n];
      sparkPos[i * 3] = x; sparkPos[i * 3 + 1] = -1.9 * (1 - ph) - 0.06; sparkPos[i * 3 + 2] = z;
      grid.setColorAt(n, col.set(0x475569).lerp(red, clamp((ph - 0.82) / 0.18)));
    });
    sparkGeo.attributes.position.needsUpdate = true; grid.instanceColor!.needsUpdate = true;

    /* 3. each ring lights as it is passed */
    const pass = [span(tt, 0.405, 0.42), span(tt, 0.435, 0.45)];
    checks.forEach((c, k) => {
      c.g.rotation.y = (k ? -1 : 1) * frame * 0.006;
      c.m.color.set(0x475569).lerp(teal, pass[k]); c.g.scale.setScalar(1 + 0.06 * Math.sin(Math.PI * pass[k]));
      (c.tag.material as THREE.SpriteMaterial).opacity = pass[k] * on[2];
    });

    /* 4. only the allowed resources light up */
    const scope = span(tt, 0.52, 0.56);
    if (Math.abs(scope - lastScope) > 0.002 || lastScope < 0) {
      lastScope = scope;
      for (let i = 0; i < RES * 2; i++) resources.setColorAt(i, ALLOWED.includes(i) ? col.copy(dim).lerp(teal, scope) : col.set(PLAT[i < RES ? 0 : 1].c).multiplyScalar(0.28));
      resources.instanceColor!.needsUpdate = true;
    }
    reach.material.opacity = 0.75 * scope;
    cloud.position.y = yOf(3) + Math.sin(frame * 0.012) * 0.06;

    /* 5. events stream into the record */
    pages.count = Math.round(PAGES * span(tt, 0.63, 0.71));
    for (let i = 0; i < EVENTS; i++) {
      const ph = (frame * 0.005 + i / EVENTS) % 1, r = 2.6 * (1 - ph), a = i * 2.4 + ph * 5;
      evPos[i * 3] = LEDGER.x + Math.cos(a) * r; evPos[i * 3 + 1] = LEDGER.y + 0.3 + (i % 7) * 0.2 * (1 - ph) + ph * 0.9; evPos[i * 3 + 2] = LEDGER.z + Math.sin(a) * r;
    }
    evGeo.attributes.position.needsUpdate = true;

    /* 6. the scan crosses, one pillar is flagged, then proved clean */
    const sx = -2.6 + 5.2 * span(tt, 0.765, 0.805);
    scan.position.x = sx; scanMat.opacity = 0.2 * span(tt, 0.76, 0.77) * (1 - span(tt, 0.805, 0.82));
    const flagged = sx > 0.9 ? 1 : 0, fixed = span(tt, 0.82, 0.84);
    col.copy(blue).lerp(red, flagged).lerp(green, fixed);
    foundMat.emissive.copy(col); foundMat.emissiveIntensity = 0.3 + 0.7 * flagged; foundEdge.color.copy(col);
  }

  return { update, orbAt, whole };
}
