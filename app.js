// ============================================================
//  San Valentín — Cata ♥
//  Minimal + cinematic
// ============================================================

const $ = (s) => document.querySelector(s);

const scenes = {
  envelope: $('#s-envelope'),
  question: $('#s-question'),
  celeb:    $('#s-celeb')
};
const envelope = $('#envelope');
const yesBtn   = $('#yes');
const noBtn    = $('#no');

// ============================================================
//  Scene 1 — Envelope entrance
// ============================================================
const entryTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
entryTl
  .from('.env-to', { opacity: 0, y: 24, duration: 1.2 })
  .from('#envelope', { opacity: 0, y: 36, scale: 0.94, duration: 1 }, '-=0.5')
  .to('.env-hint', { opacity: 0.35, duration: 0.8 }, '-=0.3');

const envFlap   = $('.env-flap');
const envLetter = $('#letter');
const envGlow   = $('#env-glow');
const flash     = $('#scene-flash');

envelope.addEventListener('click', openEnvelope);

function openEnvelope() {
  envelope.removeEventListener('click', openEnvelope);

  const tl = gsap.timeline({
    onComplete() {
      scenes.envelope.classList.remove('active');
      showQuestion();
    }
  });

  tl
    // 1. Hide hint + subtle anticipation bump
    .to('.env-hint', { opacity: 0, duration: 0.15 })
    .to(envelope, {
      scale: 1.04,
      duration: 0.25,
      ease: 'power2.out'
    }, '<')
    .to(envelope, {
      scale: 1,
      duration: 0.2,
      ease: 'power2.in'
    })

    // 2. Flap opens
    .to(envFlap, {
      rotateX: 180,
      duration: 0.7,
      ease: 'power2.inOut',
      onComplete() { envFlap.style.zIndex = 0; }
    })

    // 4. Letter floats out — rises, slight rotation, gentle scale
    .to(envLetter, {
      y: -180,
      rotation: -2,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.5')
    .to(envLetter, {
      y: -260,
      rotation: 0,
      scale: 1.15,
      duration: 0.6,
      ease: 'power3.inOut'
    })

    // 5. Letter zooms toward camera + everything fades
    .to(envLetter, {
      scale: 8,
      opacity: 0,
      y: -300,
      duration: 0.7,
      ease: 'power3.in'
    }, '-=0.15')
    .to('.env-to', { opacity: 0, y: -20, duration: 0.4 }, '<')
    .to(envelope, { opacity: 0, duration: 0.4 }, '<')
    // 7. Fade out scene
    .to(scenes.envelope, { opacity: 0, duration: 0.01 }, '<');
}

// ============================================================
//  Scene 2 — Question (cinematic text reveal)
// ============================================================
function showQuestion() {
  scenes.question.classList.add('active');
  scenes.question.style.opacity = '0';

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl
    .to(scenes.question, { opacity: 1, duration: 0.5 })
    .from('#line1', { opacity: 0, y: 22, duration: 0.9 }, '+=0.3')
    .from('#line2', { opacity: 0, y: 22, duration: 0.9 }, '-=0.35')
    .from('#question', { opacity: 0, y: 28, duration: 1.1 }, '+=0.4')
    .from('#actions', { opacity: 0, y: 16, duration: 0.8 }, '-=0.3');
}

// ============================================================
//  Dodge button
// ============================================================
let dodges = 0;
const texts = ['¿Segura?', 'Piénsalo...', '¿De verdad?', 'Imposible', 'Nah...', 'Sí ♥'];

function dodge() {
  dodges++;
  const pad = 16;

  noBtn.style.position = 'fixed';
  noBtn.style.zIndex = '200';

  gsap.to(noBtn, {
    left: pad + Math.random() * (innerWidth - noBtn.offsetWidth - pad * 2),
    top:  pad + Math.random() * (innerHeight - noBtn.offsetHeight - pad * 2),
    duration: 0.2,
    ease: 'power3.out'
  });

  noBtn.textContent = texts[Math.min(dodges - 1, texts.length - 1)];

  if (dodges >= texts.length) {
    noBtn.removeEventListener('mouseenter', dodge);
    noBtn.removeEventListener('touchstart', dodge);
    noBtn.style.background = '#ff3b7a';
    noBtn.style.color = '#fff';
    noBtn.style.borderColor = 'transparent';
    noBtn.addEventListener('click', celebrate);
  }

  gsap.to(yesBtn, {
    scale: Math.min(1 + dodges * 0.05, 1.4),
    duration: 0.3,
    ease: 'back.out(2)'
  });
}

noBtn.addEventListener('mouseenter', dodge);
noBtn.addEventListener('touchstart', dodge, { passive: true });
yesBtn.addEventListener('click', celebrate);

// ============================================================
//  Celebrate
// ============================================================
function celebrate() {
  yesBtn.removeEventListener('click', celebrate);
  noBtn.removeEventListener('click', celebrate);
  celebMode = true;

  gsap.to(scenes.question, {
    opacity: 0,
    duration: 0.7,
    ease: 'power2.inOut',
    onComplete() {
      scenes.question.classList.remove('active');
      noBtn.style.display = 'none';
      showCeleb();
    }
  });
}

// ============================================================
//  Scene 3 — Celebration (SVG heart draw + voucher)
// ============================================================
function showCeleb() {
  scenes.celeb.classList.add('active');
  scenes.celeb.style.opacity = '0';

  const path = $('#heart-path');
  const len = path.getTotalLength();
  path.style.strokeDasharray = len;
  path.style.strokeDashoffset = len;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl
    .to(scenes.celeb, { opacity: 1, duration: 0.5 })
    .to(path, {
      strokeDashoffset: 0,
      duration: 1.8,
      ease: 'power2.inOut'
    }, '+=0.2')
    .to(path, { fill: 'rgba(255, 59, 122, 0.12)', duration: 0.7 }, '-=0.4')
    .from('#celeb-title', { opacity: 0, y: 24, duration: 1 }, '-=0.3')
    .from('#celeb-voucher', {
      opacity: 0,
      y: 30,
      scale: 0.96,
      duration: 1,
      ease: 'back.out(1.4)'
    }, '-=0.3')
    .from('#celeb-sign', { opacity: 0, duration: 1 }, '-=0.3');

  startHeartRain();
}

// ============================================================
//  Heart rain (subtle)
// ============================================================
function startHeartRain() {
  const symbols = ['♥', '♥', '❤'];
  let count = 0;

  function spawn() {
    if (count > 70) return;
    count++;

    const el = document.createElement('div');
    el.className = 'falling-heart';
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.left = Math.random() * 100 + 'vw';
    el.style.fontSize = (10 + Math.random() * 16) + 'px';
    el.style.animationDuration = (3.5 + Math.random() * 4) + 's';
    el.style.color = `hsla(${340 + Math.random() * 25}, 65%, ${55 + Math.random() * 20}%, 0.5)`;
    document.body.appendChild(el);

    el.addEventListener('animationend', () => el.remove());

    setTimeout(spawn, count < 25 ? 100 : 350 + Math.random() * 500);
  }
  spawn();
}

// ============================================================
//  Canvas — Minimal floating orbs
// ============================================================
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width  = innerWidth  * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
addEventListener('resize', resize);
resize();

let celebMode = false;

const orbs = Array.from({ length: 10 }, () => ({
  x: Math.random() * innerWidth,
  y: Math.random() * innerHeight,
  vx: (Math.random() - 0.5) * 0.12,
  vy: (Math.random() - 0.5) * 0.12,
  r: 40 + Math.random() * 100,
  hue: 325 + Math.random() * 35,
  alpha: 0.01 + Math.random() * 0.018,
  phase: Math.random() * Math.PI * 2
}));

let t = 0;

function draw() {
  t += 0.003;
  const w = innerWidth, h = innerHeight;

  // Solid dark background — no trails, no ghosting
  ctx.fillStyle = '#282a36';
  ctx.fillRect(0, 0, w, h);

  for (const o of orbs) {
    const speed = celebMode ? 2.5 : 1;
    o.x += o.vx * speed;
    o.y += o.vy * speed;

    // Wrap
    if (o.x < -o.r) o.x = w + o.r;
    if (o.x > w + o.r) o.x = -o.r;
    if (o.y < -o.r) o.y = h + o.r;
    if (o.y > h + o.r) o.y = -o.r;

    const pulse = 1 + 0.25 * Math.sin(t * 1.5 + o.phase);
    const r = o.r * pulse;
    const a = celebMode ? o.alpha * 3 : o.alpha;

    const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, r);
    g.addColorStop(0, `hsla(${o.hue}, 55%, 52%, ${a})`);
    g.addColorStop(1, `hsla(${o.hue}, 45%, 40%, 0)`);

    ctx.beginPath();
    ctx.fillStyle = g;
    ctx.arc(o.x, o.y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(draw);
}
draw();
