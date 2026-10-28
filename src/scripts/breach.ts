/* Contain the breach. A phishing link was clicked on a workstation, and the
   attacker is moving sideways through the bank. Isolate hosts before the
   infection reaches DC01 or 25 machines at once. Sealing a segment at the
   firewall stops it crossing between VLANs. Three.js, one overlay canvas,
   loaded only when someone presses Play. */
import * as THREE from 'three';

const ZONES = [
  { id: 10, name: 'Management', color: 0x7c3aed },
  { id: 20, name: 'BlueTeam', color: 0x14b8a6 },
  { id: 30, name: 'RedTeam', color: 0xf43f5e },
  { id: 40, name: 'DevOps', color: 0xf59e0b },
  { id: 50, name: 'EnterpriseLAN', color: 0x3b82f6 },
  { id: 60, name: 'Monitoring', color: 0x22c55e },
];
const COLS = 9, ROWS = 6, GAP = 1.7, ZW = COLS, ZD = ROWS;
/* zones sit in a grid, three across on a wide screen and two on a phone;
   neighbours are the zones a firewall rule could connect */
function layout(across: number) {
  const down = Math.ceil(ZONES.length / across);
  const pos = ZONES.map((_, i) => ({ cx: (i % across - (across - 1) / 2) * (ZW + GAP), cz: (Math.floor(i / across) - (down - 1) / 2) * (ZD + GAP) }));
  const adj = ZONES.map((_, i) => ZONES.map((_, j) => j).filter((j) => j !== i && Math.abs((j % across) - (i % across)) + Math.abs(Math.floor(j / across) - Math.floor(i / across)) === 1));
  return { pos, adj };
}
const LAN = 4;
const DC_CELL = { c: 1, r: 1 };
const ZERO_CELL = { c: 8, r: 5 };

const GAME_S = 60, BREACH_AT = 25, REJOIN_S = 14, SEAL_S = 12;
const enum S { Clean, Infected, Isolated }

interface Host { zone: number; c: number; r: number; x: number; z: number; s: S; next: number; until: number; dc: boolean }

const BEST_KEY = 'breach-best';
const readBest = () => { try { return Number(localStorage.getItem(BEST_KEY) || 0); } catch { return 0; } };
const saveBest = (n: number) => { try { localStorage.setItem(BEST_KEY, String(n)); } catch { /* private mode */ } };

function glowTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d')!;
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.25, 'rgba(255,255,255,0.75)'); r.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = r; g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

function labelSprite(text: string, color: string) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 64;
  const g = c.getContext('2d')!;
  g.font = "600 30px 'JetBrains Mono Variable', 'JetBrains Mono', Consolas, monospace";
  g.fillStyle = color; g.fillText(text, 4, 44);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }));
  s.scale.set(4.8, 0.6, 1); s.center.set(0, 0.5);
  return s;
}

export function openBreach(overlay: HTMLElement) {
  const canvas = overlay.querySelector<HTMLCanvasElement>('canvas')!;
  const q = <T extends HTMLElement>(sel: string) => overlay.querySelector<T>(sel)!;
  const hud = { time: q('[data-b-time]'), inf: q('[data-b-inf]'), bar: q('[data-b-bar]'), score: q('[data-b-score]'), level: q('[data-b-level]'), dc: q('[data-b-dc]'), seal: q('[data-b-seal]'), count: q('[data-b-count]'), toast: q('[data-b-toast]') };
  const cards = { intro: q('[data-b-intro]'), end: q('[data-b-end]') };

  const portrait = window.innerWidth / window.innerHeight < 0.8;
  const { pos: ZPOS, adj: ADJ } = layout(portrait ? 2 : 3);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x060b16);
  scene.fog = new THREE.Fog(0x060b16, 26, 52);
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 200);
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 1.4); key.position.set(-6, 14, 10); scene.add(key);

  /* the estate */
  const hosts: Host[] = [];
  ZONES.forEach((_, zi) => {
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      hosts.push({ zone: zi, c, r, x: ZPOS[zi].cx + c - (COLS - 1) / 2, z: ZPOS[zi].cz + r - (ROWS - 1) / 2, s: S.Clean, next: 0, until: 0, dc: zi === LAN && c === DC_CELL.c && r === DC_CELL.r });
    }
  });
  const at = (zi: number, c: number, r: number) => hosts[zi * COLS * ROWS + r * COLS + c];
  const N = hosts.length;

  const baseGeo = new THREE.BoxGeometry(0.62, 0.05, 0.42);
  const lidGeo = new THREE.BoxGeometry(0.62, 0.4, 0.03); lidGeo.translate(0, 0.2, 0);
  const bases = new THREE.InstancedMesh(baseGeo, new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6, metalness: 0.3 }), N);
  const lids = new THREE.InstancedMesh(lidGeo, new THREE.MeshBasicMaterial({ toneMapped: false }), N);
  const glows = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: glowTexture(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }), N);
  glows.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(N * 3), 3);
  const m = new THREE.Matrix4(), qn = new THREE.Quaternion(), tilt = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.32, 0, 0)), one = new THREE.Vector3(1, 1, 1);
  hosts.forEach((h, i) => {
    m.compose(new THREE.Vector3(h.x, 0.025, h.z), qn, h.dc ? new THREE.Vector3(1.25, 1, 1.25) : one); bases.setMatrixAt(i, m);
    m.compose(new THREE.Vector3(h.x, 0.05, h.z - 0.2), tilt, h.dc ? new THREE.Vector3(1.25, 1.6, 1) : one); lids.setMatrixAt(i, m);
  });
  scene.add(bases, lids, glows);

  const base = ZONES.map((z) => new THREE.Color(0x1e3a5f).lerp(new THREE.Color(z.color), 0.35));
  const RED = new THREE.Color(0xff2d3f), GOLD = new THREE.Color(0xfbbf24), DARK = new THREE.Color(0x1f2937), TEAL = new THREE.Color(0x2dd4bf);

  /* floors, outlines, labels, and the firewall wall each zone can raise */
  const walls: THREE.Mesh[] = [];
  ZONES.forEach((z, zi) => {
    const { cx, cz } = ZPOS[zi];
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(ZW + 0.6, ZD + 0.6), new THREE.MeshBasicMaterial({ color: z.color, transparent: true, opacity: 0.06 }));
    floor.rotation.x = -Math.PI / 2; floor.position.set(cx, 0, cz); scene.add(floor);
    const edge = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(ZW + 0.6, 0.001, ZD + 0.6)), new THREE.LineBasicMaterial({ color: z.color, transparent: true, opacity: 0.6 }));
    edge.position.set(cx, 0, cz); scene.add(edge);
    const lab = labelSprite(`VLAN ${z.id} · ${z.name}`, '#' + new THREE.Color(z.color).getHexString());
    lab.position.set(cx - ZW / 2 - 0.2, 0.05, cz - ZD / 2 - 0.75); scene.add(lab);
    const wall = new THREE.Mesh(new THREE.BoxGeometry(ZW + 0.9, 1.4, ZD + 0.9), new THREE.MeshBasicMaterial({ color: 0x2dd4bf, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide, toneMapped: false }));
    wall.position.set(cx, 0.7, cz); scene.add(wall); walls.push(wall);
  });
  const dcLab = labelSprite('DC01 · Tier 0', '#fbbf24');
  const dcHost = at(LAN, DC_CELL.c, DC_CELL.r);
  dcLab.position.set(dcHost.x - 0.6, 1.25, dcHost.z); dcLab.scale.multiplyScalar(0.7); scene.add(dcLab);

  /* ---------- game state ---------- */
  let running = false, over = false, now = 0, left = GAME_S, score = 0, level = 1, combo = 0, lastHit = -9, isolatedCount = 0;
  let lastZone = LAN, sealReady = 0, phishAt = 0, cleanSince = -1;
  const sealed = ZONES.map(() => 0);
  const infected = () => hosts.reduce((n, h) => n + (h.s === S.Infected ? 1 : 0), 0);
  /* slow at first so a visitor can learn the controls, then faster with every level */
  const spreadEvery = () => Math.max(1, (4.4 / (1 + 0.3 * (level - 1))) * (now < 12 ? 1.35 : 1));
  const sealRecharge = () => 9 + (level - 1) * 1.5;

  function infect(h: Host) {
    if (h.s !== S.Clean) return;
    h.s = S.Infected; h.next = now + spreadEvery() * (0.6 + Math.random() * 0.8);
    if (h.dc) end(false, 'They reached the domain controller.');
  }
  function spread(h: Host) {
    const cross = Math.random() < 0.08 && !(sealed[h.zone] > now);
    if (cross) {
      const open = ADJ[h.zone].filter((j) => !(sealed[j] > now));
      if (open.length) {
        const zj = open[Math.floor(Math.random() * open.length)];
        const cands = hosts.filter((o) => o.zone === zj && o.s === S.Clean && !o.dc);
        if (cands.length) { infect(cands[Math.floor(Math.random() * cands.length)]); return; }
      }
    }
    const nb: Host[] = [];
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
      if (!dr && !dc) continue;
      const c = h.c + dc, r = h.r + dr;
      if (c < 0 || r < 0 || c >= COLS || r >= ROWS) continue;
      const o = at(h.zone, c, r); if (o.s === S.Clean) nb.push(o);
    }
    if (nb.length) infect(nb[Math.floor(Math.random() * nb.length)]);
  }

  function toast(text: string, kind = '') {
    hud.toast.textContent = text; hud.toast.className = 'b-toast is-on ' + kind;
    clearTimeout((toast as unknown as { t?: number }).t);
    (toast as unknown as { t?: number }).t = window.setTimeout(() => { hud.toast.className = 'b-toast'; }, 1400);
  }

  function isolate(h: Host) {
    if (!running || h.s === S.Isolated) return;
    lastZone = h.zone;
    if (h.s === S.Infected) {
      combo = now - lastHit < 1.6 ? Math.min(5, combo + 1) : 1; lastHit = now;
      score += 100 * combo; isolatedCount++;
      if (combo > 1) toast(`Combo ×${combo}`);
    } else {
      score = Math.max(0, score - 50); combo = 0; toast('Clean host isolated · −50', 'is-bad');
    }
    h.s = S.Isolated; h.until = now + REJOIN_S;
    const lv = 1 + Math.floor(score / 1500);
    if (lv > level) { level = lv; toast(`Level ${level} · it moves faster`, 'is-up'); }
  }

  function seal() {
    if (!running || now < sealReady) return;
    sealed[lastZone] = now + SEAL_S; sealReady = now + sealRecharge();
    toast(`VLAN ${ZONES[lastZone].id} sealed at pfSense · ${SEAL_S}s`, 'is-up');
  }

  function reset() {
    hosts.forEach((h) => { h.s = S.Clean; h.next = 0; h.until = 0; });
    sealed.fill(0); now = 0; left = GAME_S; score = 0; level = 1; combo = 0; lastHit = -9; isolatedCount = 0; lastZone = LAN; sealReady = 0; phishAt = 0; cleanSince = -1; over = false;
  }

  function start() {
    reset(); cards.intro.hidden = true; cards.end.hidden = true;
    let n = 3; hud.count.textContent = String(n); hud.count.classList.add('is-on');
    const iv = window.setInterval(() => {
      n--;
      if (n > 0) hud.count.textContent = String(n);
      else if (n === 0) hud.count.textContent = 'Go';
      else {
        window.clearInterval(iv); hud.count.classList.remove('is-on');
        running = true; infect(at(LAN, ZERO_CELL.c, ZERO_CELL.r)); phishAt = 7;
        toast('A phishing link was clicked in VLAN 50', 'is-bad');
      }
    }, 650);
  }

  function end(win: boolean, why: string) {
    if (over) return;
    over = true; running = false;
    const clean = Math.round((hosts.filter((h) => h.s !== S.Infected).length / N) * 1000) / 10;
    const best = Math.max(readBest(), score); saveBest(best);
    q('[data-b-kicker]').textContent = win ? 'Contained' : 'Breach';
    q('[data-b-title]').innerHTML = win ? 'Contained.' : "That's a <b>breach.</b>";
    q('[data-b-why]').textContent = win
      ? 'Sixty seconds and the domain controller never saw them. In a real estate, EDR isolation and firewall segmentation do this in milliseconds, before anyone has to click.'
      : `${why} It took ${Math.round(GAME_S - left)} seconds. In a real estate, automatic isolation and segmentation rules stop this before anyone has to click.`;
    q('[data-b-s-score]').textContent = score.toLocaleString('en-US');
    q('[data-b-s-iso]').textContent = String(isolatedCount);
    q('[data-b-s-clean]').textContent = clean + '%';
    q('[data-b-best]').textContent = best.toLocaleString('en-US');
    cards.end.hidden = false; cards.end.classList.toggle('is-win', win);
    (cards.end.querySelector('button') as HTMLButtonElement)?.focus();
  }

  function step(dt: number) {
    now += dt; left = Math.max(0, left - dt);
    for (const h of hosts) {
      if (h.s === S.Infected && now >= h.next) { spread(h); h.next = now + spreadEvery() * (0.6 + Math.random() * 0.8); }
      else if (h.s === S.Isolated && now >= h.until) h.s = S.Clean;
    }
    /* the attacker never stops trying: a phishing click on a schedule that tightens with
       each level, two at a time from level 3, and a fresh foothold soon after the board goes clean */
    const clean = infected() === 0;
    if (!clean) cleanSince = -1; else if (cleanSince < 0) cleanSince = now;
    if (now >= phishAt || (clean && now - cleanSince > 1.5)) {
      cleanSince = -1;
      const k = level >= 3 ? 2 : 1;
      phishAt = now + Math.max(3.5, 8 - level);
      const pool = hosts.filter((h) => h.s === S.Clean && !h.dc && h.zone !== 1);
      for (let n = 0; n < k && pool.length; n++) infect(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
      toast(k > 1 ? 'Phishing wave · two more clicks' : clean ? 'They are back in · a new foothold' : 'Another phishing click', 'is-bad');
    }
    const n = infected();
    if (n >= BREACH_AT) end(false, `${BREACH_AT} machines at once.`);
    else if (left <= 0) end(true, '');
  }

  /* ---------- drawing ---------- */
  const col = new THREE.Color();
  function draw(time: number) {
    const pulse = 0.5 + 0.5 * Math.sin(time * 6);
    hosts.forEach((h, i) => {
      if (h.s === S.Infected) col.copy(RED).multiplyScalar(1.2 + pulse * 0.6);
      else if (h.s === S.Isolated) col.copy(DARK);
      else if (h.dc) col.copy(GOLD);
      else col.copy(base[h.zone]);
      lids.setColorAt(i, col);
      const on = h.s === S.Infected ? 1 : h.s === S.Isolated ? 0.35 : 0;
      const s = on ? (h.s === S.Infected ? 1.5 + pulse * 0.5 : 0.9) : 0.0001;
      m.compose(new THREE.Vector3(h.x, 0.35, h.z), camera.quaternion, new THREE.Vector3(s, s, s)); glows.setMatrixAt(i, m);
      glows.setColorAt(i, h.s === S.Isolated ? col.copy(TEAL).multiplyScalar(on) : col.copy(RED));
    });
    lids.instanceColor!.needsUpdate = true; glows.instanceMatrix.needsUpdate = true; glows.instanceColor!.needsUpdate = true;
    walls.forEach((w, zi) => { const on = sealed[zi] > now ? 1 : 0; (w.material as THREE.MeshBasicMaterial).opacity = on * (0.1 + 0.06 * pulse); });

    hud.time.textContent = String(Math.ceil(left));
    const n = infected();
    hud.inf.textContent = `${n} of ${BREACH_AT} before a breach`;
    hud.bar.style.width = `${Math.min(100, (n / BREACH_AT) * 100)}%`;
    hud.score.textContent = score.toLocaleString('en-US'); hud.level.textContent = String(level);
    const near = hosts.some((h) => h.s === S.Infected && h.zone === LAN && Math.abs(h.c - DC_CELL.c) <= 2 && Math.abs(h.r - DC_CELL.r) <= 2);
    hud.dc.textContent = near ? 'DC01 · threatened' : 'DC01 · clean'; hud.dc.classList.toggle('is-bad', near);
    const k = running ? Math.min(1, 1 - (sealReady - now) / sealRecharge()) : 1;
    hud.seal.style.setProperty('--k', String(sealReady <= now ? 1 : k));
    hud.seal.classList.toggle('is-ready', sealReady <= now);
  }

  /* ---------- camera and input ---------- */
  function resize() {
    const w = overlay.clientWidth, h = overlay.clientHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h;
    const tall = portrait && w < h;
    /* step back as the screen narrows, so the whole estate always fits */
    const far = tall ? Math.max(1.1, 0.92 / (w / h)) : Math.max(1.2, 1.8 / (w / h));
    camera.position.set(0, (tall ? 24 : 19) * far, (tall ? 9 : 15) * far); camera.lookAt(0, 0, tall ? 0.6 : -0.6);
    camera.fov = tall ? 52 : 42; camera.updateProjectionMatrix();
    const fog = scene.fog as THREE.Fog; fog.near = 26 * far; fog.far = 60 * far;
  }
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), hit = new THREE.Vector3(), ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.2);
  function onPointer(e: PointerEvent) {
    if (!running) return;
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    if (!ray.ray.intersectPlane(ground, hit)) return;
    let best: Host | null = null, bd = 0.62;
    for (const h of hosts) { const d = Math.hypot(h.x - hit.x, h.z - hit.z); if (d < bd) { bd = d; best = h; } }
    if (best) isolate(best);
  }
  function onKey(e: KeyboardEvent) {
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.code === 'Space' && running) { e.preventDefault(); seal(); }
  }

  let raf = 0, last = performance.now();
  function loop(t: number) {
    const dt = Math.min(0.1, (t - last) / 1000); last = t;
    if (running) step(dt);
    draw(t / 1000);
    renderer.render(scene, camera);
    raf = requestAnimationFrame(loop);
  }

  function close() {
    running = false; cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize); window.removeEventListener('keydown', onKey);
    canvas.removeEventListener('pointerdown', onPointer);
    renderer.dispose(); scene.traverse((o) => { const mm = o as THREE.Mesh; mm.geometry?.dispose?.(); });
    overlay.hidden = true; document.documentElement.classList.remove('breach-open');
    overlay.dispatchEvent(new CustomEvent('breach-closed'));
  }

  overlay.hidden = false; document.documentElement.classList.add('breach-open');
  cards.intro.hidden = false; cards.end.hidden = true;
  q('[data-b-start]').onclick = start;
  overlay.querySelectorAll<HTMLButtonElement>('[data-b-again]').forEach((b) => (b.onclick = start));
  overlay.querySelectorAll<HTMLButtonElement>('[data-b-close]').forEach((b) => (b.onclick = close));
  hud.seal.onclick = seal;
  resize(); draw(0);
  window.addEventListener('resize', resize); window.addEventListener('keydown', onKey);
  canvas.addEventListener('pointerdown', onPointer);
  raf = requestAnimationFrame(loop);
  (q('[data-b-start]') as HTMLButtonElement).focus();
  return close;
}
