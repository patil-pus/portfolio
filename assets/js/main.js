/* ===========================
   ALL INIT — wait for DOM + scripts
   =========================== */
document.addEventListener('DOMContentLoaded', function () {

/* ===========================
   2D NEURAL CANVAS
   =========================== */
(function () {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let nodes = [];
  const mouse = { x: null, y: null };

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  function createNodes() {
    nodes = [];
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 90);
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        r:  Math.random() * 2.2 + 0.8,
        opacity: Math.random() * 0.55 + 0.3,   // brighter
        pulse: Math.random() * Math.PI * 2
      });
    }
  }
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy; n.pulse += 0.014;
      if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      if (mouse.x !== null) {
        const dx = n.x - mouse.x, dy = n.y - mouse.y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 140) { n.x += (dx/d)*1.2; n.y += (dy/d)*1.2; }
      }
      const op = Math.min(n.opacity + Math.sin(n.pulse) * 0.1, 1);
      // glow
      ctx.shadowBlur = 6;
      ctx.shadowColor = 'rgba(129,140,248,0.6)';
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(129,140,248,${op})`;
      ctx.fill();
      ctx.shadowBlur = 0;
    });
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 160) {
          const alpha = (1 - d/160) * 0.35;  // brighter connections
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(99,102,241,${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('resize', () => { resize(); createNodes(); });
  resize(); createNodes(); draw();
})();

/* ===========================
   THREE.JS 3D FLOATING POLYHEDRA
   =========================== */
(function () {
  const container = document.getElementById('three-hero');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 32);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  const configs = [
    { geo: new THREE.IcosahedronGeometry(3.4, 0), color: 0x6366f1, pos: [-16, 8, -5],   opac: 0.65 },
    { geo: new THREE.OctahedronGeometry(3.0, 0),  color: 0x06b6d4, pos: [ 15,-7, -8],   opac: 0.60 },
    { geo: new THREE.TetrahedronGeometry(2.6, 0), color: 0x8b5cf6, pos: [-9,-12, -3],   opac: 0.65 },
    { geo: new THREE.IcosahedronGeometry(2.0, 0), color: 0x22d3ee, pos: [ 17, 12, -10], opac: 0.55 },
    { geo: new THREE.OctahedronGeometry(1.6, 0),  color: 0xa78bfa, pos: [  1, 16, -6],  opac: 0.60 },
    { geo: new THREE.IcosahedronGeometry(1.3, 0), color: 0x818cf8, pos: [-19, -3, -7],  opac: 0.50 },
    { geo: new THREE.TetrahedronGeometry(1.1, 0), color: 0x22d3ee, pos: [  9,-15, -5],  opac: 0.45 },
  ];

  const meshes = configs.map(({ geo, color, pos, opac }) => {
    const mat = new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: opac });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(...pos);
    mesh.rotation.set(Math.random()*Math.PI*2, Math.random()*Math.PI*2, Math.random()*Math.PI*2);
    scene.add(mesh);
    return { mesh, rx:(Math.random()-0.5)*0.007, ry:(Math.random()-0.5)*0.011, rz:(Math.random()-0.5)*0.005, phase: Math.random()*Math.PI*2, baseY: pos[1] };
  });

  // Particle cloud — bigger, brighter
  const pCount = 350;
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    pPos[i*3]   = (Math.random()-0.5)*100;
    pPos[i*3+1] = (Math.random()-0.5)*80;
    pPos[i*3+2] = (Math.random()-0.5)*60 - 15;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({ color: 0x818cf8, size: 0.25, transparent: true, opacity: 0.75 });
  scene.add(new THREE.Points(pGeo, pMat));

  let mx = 0, my = 0, tx = 0, ty = 0, t = 0;
  document.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  const particleMesh = scene.children[scene.children.length - 1];

  (function animate() {
    requestAnimationFrame(animate);
    t += 0.009;
    tx += (mx * 2.8 - tx) * 0.05;
    ty += (-my * 2.0 - ty) * 0.05;
    camera.position.x = tx;
    camera.position.y = ty;
    camera.lookAt(0, 0, 0);

    meshes.forEach(m => {
      m.mesh.rotation.x += m.rx;
      m.mesh.rotation.y += m.ry;
      m.mesh.rotation.z += m.rz;
      m.mesh.position.y = m.baseY + Math.sin(t + m.phase) * 1.1;
    });
    particleMesh.rotation.y += 0.0005;
    particleMesh.rotation.x += 0.00025;
    renderer.render(scene, camera);
  })();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();

/* ===========================
   TYPED.JS — fixed: runs after DOMContentLoaded
   =========================== */
if (typeof Typed !== 'undefined') {
  new Typed('.typing-text', {
    strings: [
      'ML Prediction Pipelines',
      'NLP &amp; LLM Systems',
      'RAG Applications',
      'Data Engineering',
      'Intelligent Analytics',
      'Anomaly Detection'
    ],
    loop: true,
    typeSpeed: 60,
    backSpeed: 35,
    backDelay: 1600,
    startDelay: 300
  });
} else {
  // Fallback if CDN fails — show static text
  const el = document.querySelector('.typing-text');
  if (el) el.textContent = 'ML & AI Systems';
}

/* ===========================
   CUSTOM CURSOR
   =========================== */
(function () {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-outline');
  if (!dot || !ring || 'ontouchstart' in window) {
    [dot, ring].forEach(el => el && (el.style.display = 'none'));
    return;
  }
  let ox = 0, oy = 0, dx = 0, dy = 0;
  document.addEventListener('mousemove', e => {
    dx = e.clientX; dy = e.clientY;
    dot.style.left = dx + 'px'; dot.style.top = dy + 'px';
  });
  (function loop() {
    ox += (dx-ox)*0.15; oy += (dy-oy)*0.15;
    ring.style.left = ox+'px'; ring.style.top = oy+'px';
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a,button,.skill-flip-card,.project-card').forEach(el => {
    el.addEventListener('mouseenter', () => { dot.style.width='14px'; dot.style.height='14px'; dot.style.background='var(--cyan)'; ring.style.width='50px'; ring.style.height='50px'; });
    el.addEventListener('mouseleave', () => { dot.style.width='8px';  dot.style.height='8px';  dot.style.background='var(--accent-light)'; ring.style.width='36px'; ring.style.height='36px'; });
  });
})();

/* ===========================
   LOADER
   =========================== */
window.addEventListener('load', () => {
  document.body.style.overflow = '';
  setTimeout(() => document.getElementById('loader')?.classList.add('hidden'), 700);
});
document.body.style.overflow = 'hidden';

/* ===========================
   NAVBAR
   =========================== */
(function () {
  const header  = document.getElementById('header');
  const menuBtn = document.getElementById('menu');
  const navbar  = document.querySelector('.navbar');
  const links   = document.querySelectorAll('.navbar ul li a');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
    document.getElementById('scroll-top')?.classList.toggle('active', window.scrollY > 400);
    let cur = '';
    document.querySelectorAll('section[id]').forEach(s => {
      if (window.scrollY >= s.offsetTop - 140) cur = s.id;
    });
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${cur}`));
  });

  menuBtn?.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    navbar.classList.toggle('open');
  });
  links.forEach(l => l.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(l.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
    navbar.classList.remove('open'); menuBtn?.classList.remove('active');
  }));
  document.getElementById('scroll-top')?.addEventListener('click', e => {
    e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ===========================
   SCROLL REVEAL
   =========================== */
(function () {
  const els = document.querySelectorAll('.reveal,.reveal-left,.reveal-right');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      setTimeout(() => e.target.classList.add('visible'), parseInt(e.target.dataset.delay)||0);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  // stagger siblings
  const seen = new Set();
  els.forEach(el => {
    const p = el.parentElement;
    if (p && !seen.has(p)) {
      seen.add(p);
      [...p.querySelectorAll('.reveal,.reveal-left,.reveal-right')].forEach((c,i) => {
        if (!c.dataset.delay) c.dataset.delay = i * 80;
      });
    }
    obs.observe(el);
  });
})();

/* ===========================
   COUNTER ANIMATION
   =========================== */
(function () {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, target = parseInt(el.dataset.target);
      let cur = 0; const step = target / 55;
      const t = setInterval(() => {
        cur += step;
        if (cur >= target) { el.textContent = target; clearInterval(t); }
        else el.textContent = Math.floor(cur);
      }, 22);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.counter').forEach(c => obs.observe(c));
})();

/* ===========================
   VANILLA TILT
   =========================== */
if (typeof VanillaTilt !== 'undefined') {
  VanillaTilt.init(document.querySelectorAll('.tilt'), {
    max: 7, speed: 400, glare: true, 'max-glare': 0.07, perspective: 1000
  });
}

/* ===========================
   PAGE VISIBILITY
   =========================== */
document.addEventListener('visibilitychange', () => {
  document.title = document.visibilityState === 'visible'
    ? 'Pushkar Patil | AI/ML Engineer'
    : '👋 Come Back — Pushkar';
});

}); // end DOMContentLoaded
