// The flagship, told in 3D: documentation is collected, indexed into a vector space, then queried.
// Progressive enhancement: without WebGL or with reduced motion, the static diagram stays.
import * as THREE from '../assets/vendor/three.module.min.js';

const stage = document.querySelector('[data-stage]');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

if (stage && !reduced && webglAvailable()) init();

function mulberry32(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

function glowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.25, 'rgba(160,200,255,.45)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

function init() {
  const root = document.documentElement;
  const canvas = stage.querySelector('canvas');
  const sticky = stage.querySelector('.stage-sticky');
  const steps = [...stage.querySelectorAll('.stage-step')];
  const dots = [...stage.querySelectorAll('.stage-dots li')];
  const nav = document.querySelector('.nav');

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  } catch {
    return;
  }
  root.classList.add('has-3d');
  renderer.setClearColor(0x000000, 1);

  const small = innerWidth < 734;
  const N = small ? 1500 : 3400;
  const rand = mulberry32(2025);
  const gauss = () => { let u = 0; for (let i = 0; i < 4; i += 1) u += rand(); return (u - 2) / 1.2; };

  const scene = new THREE.Scene();
  const world = new THREE.Group();
  scene.add(world);
  const camera = new THREE.PerspectiveCamera(small ? 50 : 38, 1, 0.1, 120);

  /* ---------- Vector space: clusters of meaning ---------- */
  const TINTS = ['#f5f5f7', '#9ecbff', '#c9b8ff', '#9fe3d6', '#ffd2a1', '#ffb8cc'].map((h) => new THREE.Color(h));
  const centers = Array.from({ length: 6 }, () => {
    const v = new THREE.Vector3(gauss(), gauss() * 0.7, gauss()).normalize().multiplyScalar(3.1 + rand() * 0.9);
    return v;
  });
  const HIT_CLUSTER = 1;
  const RING_R = 5.4;
  const ringTilts = [0.35, -0.5, 0.9];

  const start = new Float32Array(N * 3);
  const ctrl = new Float32Array(N * 3);
  const end = new Float32Array(N * 3);
  const tint = new Float32Array(N * 3);
  const seed = new Float32Array(N);
  const hit = new Float32Array(N);
  const hits = [];

  for (let i = 0; i < N; i += 1) {
    const c = i % 6;
    const g = i % 3;
    // scattered documentation: a wide, flattened nebula
    const dir = new THREE.Vector3(gauss(), gauss() * 0.45, gauss()).normalize();
    const r = 11 + rand() * 8;
    start.set([dir.x * r, dir.y * r, dir.z * r], i * 3);
    // collected through one of the three agents' orbits
    const a = (g / 3) * Math.PI * 2 + (rand() - 0.5) * 0.9;
    const tilt = ringTilts[g];
    ctrl.set([Math.cos(a) * RING_R, Math.sin(a) * Math.sin(tilt) * RING_R * 0.6, Math.sin(a) * RING_R], i * 3);
    // indexed into a cluster of meaning
    const ce = centers[c];
    end.set([ce.x + gauss() * 0.55, ce.y + gauss() * 0.42, ce.z + gauss() * 0.55], i * 3);
    const col = TINTS[c];
    tint.set([col.r, col.g, col.b], i * 3);
    seed[i] = rand();
    if (c === HIT_CLUSTER && hits.length < (small ? 18 : 30) && rand() < 0.12) { hit[i] = 1; hits.push(i); }
  }

  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(end, 3));
  pGeo.setAttribute('aStart', new THREE.BufferAttribute(start, 3));
  pGeo.setAttribute('aCtrl', new THREE.BufferAttribute(ctrl, 3));
  pGeo.setAttribute('aTint', new THREE.BufferAttribute(tint, 3));
  pGeo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  pGeo.setAttribute('aHit', new THREE.BufferAttribute(hit, 1));

  const uniforms = {
    uTime: { value: 0 }, uCollect: { value: 0 }, uIndex: { value: 0 }, uSearch: { value: 0 },
    uSize: { value: small ? 3.4 : 3.6 }, uPR: { value: 1 },
  };
  const pMat = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */ `
      uniform float uTime, uCollect, uIndex, uSearch, uSize, uPR;
      attribute vec3 aStart, aCtrl, aTint;
      attribute float aSeed, aHit;
      varying vec3 vColor;
      varying float vAlpha;
      float ease(float t) { return t < .5 ? 4. * t * t * t : 1. - pow(-2. * t + 2., 3.) / 2.; }
      void main() {
        float t = clamp(uCollect * 1.75 - aSeed * .75, 0., 1.);
        float e = ease(t);
        vec3 drift = vec3(sin(uTime * .3 + aSeed * 40.), cos(uTime * .23 + aSeed * 31.), sin(uTime * .19 + aSeed * 23.)) * .4;
        vec3 a = aStart + drift * (1. - e);
        vec3 p = mix(mix(a, aCtrl, e), mix(aCtrl, position, e), e);
        p += normalize(position + .001) * sin(uTime * .9 + aSeed * 12.) * .05 * uIndex;
        vec4 mv = modelViewMatrix * vec4(p, 1.);
        gl_Position = projectionMatrix * mv;
        float h = aHit * uSearch;
        gl_PointSize = uSize * (.55 + aSeed * .9) * (1. + h * 2.4) * uPR * (12. / -mv.z);
        vec3 base = mix(vec3(.93, .94, .97), aTint, uIndex * .85);
        vColor = mix(base, vec3(.16, .59, 1.), h);
        float travel = sin(t * 3.14159);
        vAlpha = (.55 + .6 * travel + .25 * uIndex) * (1. - uSearch * .6 * (1. - aHit));
      }`,
    fragmentShader: /* glsl */ `
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        float d = length(gl_PointCoord - .5);
        float a = smoothstep(.5, 0., d);
        gl_FragColor = vec4(vColor, a * a * vAlpha);
      }`,
  });
  const points = new THREE.Points(pGeo, pMat);
  points.frustumCulled = false;
  world.add(points);

  /* ---------- Graph edges inside each cluster (appear with indexing) ---------- */
  const edgePos = [];
  const sample = small ? 500 : 900;
  for (let i = 0; i < sample; i += 1) {
    const ia = Math.floor(rand() * N);
    let best = -1;
    let bestD = 0.5;
    for (let k = 0; k < 40; k += 1) {
      const ib = Math.floor(rand() * N);
      if (ib === ia || ib % 6 !== ia % 6) continue;
      const d = Math.hypot(end[ia * 3] - end[ib * 3], end[ia * 3 + 1] - end[ib * 3 + 1], end[ia * 3 + 2] - end[ib * 3 + 2]);
      if (d < bestD) { bestD = d; best = ib; }
    }
    if (best >= 0) edgePos.push(end[ia * 3], end[ia * 3 + 1], end[ia * 3 + 2], end[best * 3], end[best * 3 + 1], end[best * 3 + 2]);
  }
  const eGeo = new THREE.BufferGeometry();
  eGeo.setAttribute('position', new THREE.Float32BufferAttribute(edgePos, 3));
  const eMat = new THREE.LineBasicMaterial({ color: 0xc8d6ff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
  world.add(new THREE.LineSegments(eGeo, eMat));

  /* ---------- Orchestrator and agents: fresnel glass ---------- */
  const glass = (strength) => new THREE.ShaderMaterial({
    uniforms: { uPulse: { value: 0 }, uStrength: { value: strength } },
    transparent: true,
    vertexShader: /* glsl */ `
      varying vec3 vN; varying vec3 vV;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.);
        vN = normalize(normalMatrix * normal);
        vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uPulse, uStrength;
      varying vec3 vN; varying vec3 vV;
      void main() {
        float f = pow(1. - max(dot(vN, vV), 0.), 2.4);
        vec3 body = vec3(.015, .02, .035);
        vec3 rim = mix(vec3(.82, .88, 1.), vec3(.16, .59, 1.), uPulse);
        vec3 col = body + rim * f * uStrength + vec3(.05, .12, .3) * uPulse * (1. - f);
        gl_FragColor = vec4(col, .96);
      }`,
  });
  const glowMap = glowTexture();
  const orchestrator = new THREE.Mesh(new THREE.SphereGeometry(1.05, 64, 64), glass(1.25));
  world.add(orchestrator);
  const coreGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowMap, color: 0xbfd8ff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.55 }));
  coreGlow.scale.setScalar(5.2);
  world.add(coreGlow);

  const agents = ringTilts.map((tilt, g) => {
    const ring = new THREE.Group();
    ring.rotation.set(tilt, g * 0.9, 0);
    const pts = [];
    for (let k = 0; k <= 160; k += 1) { const a = (k / 160) * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * RING_R, 0, Math.sin(a) * RING_R)); }
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.09 }));
    ring.add(line);
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), glass(1.4));
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowMap, color: 0xd8e6ff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.35 }));
    glow.scale.setScalar(1.8);
    const holder = new THREE.Group();
    holder.add(body, glow);
    ring.add(holder);
    world.add(ring);
    return { holder, glow, line, phase: (g / 3) * Math.PI * 2 };
  });

  /* ---------- Retrieval beams: pulses from the orchestrator to the matching vectors ---------- */
  const bPos = [];
  const bT = [];
  hits.forEach((i) => { bPos.push(0, 0, 0, end[i * 3], end[i * 3 + 1], end[i * 3 + 2]); bT.push(0, 1); });
  const bGeo = new THREE.BufferGeometry();
  bGeo.setAttribute('position', new THREE.Float32BufferAttribute(bPos, 3));
  bGeo.setAttribute('aT', new THREE.Float32BufferAttribute(bT, 1));
  const bMat = new THREE.ShaderMaterial({
    uniforms: { uTime: uniforms.uTime, uSearch: uniforms.uSearch },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */ `
      attribute float aT; varying float vT;
      void main() { vT = aT; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,
    fragmentShader: /* glsl */ `
      uniform float uTime, uSearch; varying float vT;
      void main() {
        float f = fract(vT - uTime * .55);
        float pulse = smoothstep(0., .08, f) * (1. - smoothstep(.08, .26, f));
        gl_FragColor = vec4(.16, .59, 1., uSearch * (.16 + pulse * .95));
      }`,
  });
  world.add(new THREE.LineSegments(bGeo, bMat));

  /* ---------- Sizing, visibility, input ---------- */
  function resize() {
    const w = sticky.clientWidth;
    const h = sticky.clientHeight;
    const pr = Math.min(devicePixelRatio || 1, small ? 1.5 : 1.75);
    renderer.setPixelRatio(pr);
    renderer.setSize(w, h, false);
    uniforms.uPR.value = pr;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(sticky);
  resize();

  let visible = false;
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) loop();
  }, { rootMargin: '100px 0px' }).observe(stage);

  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  addEventListener('pointermove', (e) => {
    mouse.tx = (e.clientX / innerWidth) * 2 - 1;
    mouse.ty = (e.clientY / innerHeight) * 2 - 1;
  }, { passive: true });

  /* ---------- One scroll timeline drives the story ---------- */
  let progress = 0;
  let current = -1;
  let raf = 0;
  const clock = new THREE.Clock();

  function readProgress() {
    const r = stage.getBoundingClientRect();
    return Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight)));
  }

  function setStep(i) {
    if (i === current) return;
    current = i;
    steps.forEach((s, k) => s.classList.toggle('is-active', k === i));
    dots.forEach((d, k) => d.classList.toggle('is-active', k === i));
  }

  function loop() {
    cancelAnimationFrame(raf);
    if (!visible) return;
    raf = requestAnimationFrame(loop);
    const time = clock.getElapsedTime();
    progress += (readProgress() - progress) * 0.085;
    const p = progress;

    uniforms.uTime.value = time;
    uniforms.uCollect.value = smooth(0.16, 0.56, p);
    uniforms.uIndex.value = smooth(0.48, 0.7, p);
    uniforms.uSearch.value = smooth(0.72, 0.88, p);
    eMat.opacity = uniforms.uIndex.value * 0.13 * (1 - uniforms.uSearch.value * 0.5);
    setStep(p < 0.2 ? 0 : p < 0.47 ? 1 : p < 0.72 ? 2 : 3);

    const pulse = uniforms.uSearch.value * (0.6 + 0.4 * Math.sin(time * 3.2));
    orchestrator.material.uniforms.uPulse.value = pulse;
    coreGlow.material.opacity = 0.45 + uniforms.uCollect.value * 0.25 + pulse * 0.35;
    coreGlow.material.color.setRGB(0.75 - pulse * 0.4, 0.85 - pulse * 0.15, 1);
    orchestrator.rotation.y = time * 0.15;

    const collecting = uniforms.uCollect.value * (1 - uniforms.uIndex.value);
    agents.forEach((a, g) => {
      const ang = a.phase + time * (0.22 + g * 0.05);
      a.holder.position.set(Math.cos(ang) * RING_R, 0, Math.sin(ang) * RING_R);
      a.glow.material.opacity = 0.3 + collecting * 0.6;
      a.line.material.opacity = 0.07 + collecting * 0.12;
    });

    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;
    const e = easeInOut(p);
    const radius = (small ? 1.35 : 1) * (19.5 - e * 7);
    const az = -0.7 + p * 2.3 + time * 0.025 + mouse.x * 0.28;
    const el = 0.34 - p * 0.14 - mouse.y * 0.12;
    camera.position.set(radius * Math.cos(el) * Math.sin(az), radius * Math.sin(el), radius * Math.cos(el) * Math.cos(az));
    camera.lookAt(0, small ? -1.1 : -1.5, 0);

    if (nav) {
      const r = stage.getBoundingClientRect();
      nav.classList.toggle('is-dark', r.top <= 52 && r.bottom > 52 && !nav.classList.contains('is-open'));
    }
    renderer.render(scene, camera);
  }

  addEventListener('scroll', () => {
    if (!nav) return;
    const r = stage.getBoundingClientRect();
    if (r.bottom <= 52 || r.top > 52) nav.classList.remove('is-dark');
  }, { passive: true });

  loop();
}
