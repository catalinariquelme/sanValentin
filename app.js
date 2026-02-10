// ============================================================
//  San Valentín — Cata  ♥
//  Flujo: Sobre → Carta/Pregunta → Celebración
// ============================================================

const $ = (s) => document.querySelector(s);

// ─── Elementos ───
const envelopeScene    = $('#envelope-scene');
const questionScene    = $('#question-scene');
const celebrationScene = $('#celebration-scene');
const envelope         = $('#envelope');
const yesBtn           = $('#yes');
const noBtn            = $('#no');

// ─── ETAPA 1: Sobre se abre al hacer click ───
envelope.addEventListener('click', openEnvelope);

function openEnvelope() {
  envelope.removeEventListener('click', openEnvelope);

  // Ocultar hint
  gsap.to('.hint', { opacity: 0, y: -10, duration: 0.3 });

  // Abrir solapa
  envelope.classList.add('open');

  // Después de que la carta suba, transicionar a la siguiente escena
  setTimeout(() => {
    gsap.to(envelopeScene, {
      opacity: 0,
      scale: 0.9,
      duration: 0.6,
      ease: 'power2.in',
      onComplete: () => {
        envelopeScene.classList.remove('active');
        showQuestion();
      }
    });
  }, 1200);
}

// ─── ETAPA 2: Mostrar la pregunta ───
function showQuestion() {
  questionScene.classList.add('active');
  questionScene.style.opacity = 0;

  gsap.to(questionScene, { opacity: 1, duration: 0.5 });

  gsap.from('.card', {
    y: 60,
    opacity: 0,
    scale: 0.92,
    duration: 0.8,
    ease: 'back.out(1.7)'
  });
  gsap.from('.card-intro', {
    y: 20,
    opacity: 0,
    duration: 0.7,
    delay: 0.3,
    ease: 'power3.out'
  });
  gsap.from('.card-question', {
    y: 20,
    opacity: 0,
    duration: 0.7,
    delay: 0.5,
    ease: 'power3.out'
  });
  gsap.from('.actions button', {
    y: 15,
    opacity: 0,
    duration: 0.6,
    delay: 0.7,
    stagger: 0.12,
    ease: 'power3.out'
  });
}

// ─── Botón "No" que se escapa ───
let dodges = 0;
const funnyTexts = [
  '¿Segura?', 'Piénsalo...', '¿De verdad?',
  'Imposible', 'No acepto', 'Nah...', 'Jaja no', 'Sí ♥'
];

noBtn.addEventListener('mouseenter', dodgeButton);
noBtn.addEventListener('touchstart', dodgeButton, { passive: true });

function dodgeButton() {
  dodges++;
  const pad = 20;
  const maxX = innerWidth  - noBtn.offsetWidth  - pad;
  const maxY = innerHeight - noBtn.offsetHeight - pad;

  const newX = pad + Math.random() * maxX;
  const newY = pad + Math.random() * maxY;

  noBtn.style.position = 'fixed';
  noBtn.style.zIndex = '200';
  gsap.to(noBtn, {
    left: newX,
    top: newY,
    duration: 0.25,
    ease: 'power3.out'
  });

  noBtn.textContent = funnyTexts[Math.min(dodges - 1, funnyTexts.length - 1)];

  if (dodges >= funnyTexts.length) {
    noBtn.textContent = '¡Sí! ♥';
    noBtn.removeEventListener('mouseenter', dodgeButton);
    noBtn.removeEventListener('touchstart', dodgeButton);
    noBtn.style.background = 'linear-gradient(135deg, #ff3b7a, #ff6b9d)';
    noBtn.style.color = '#fff';
    noBtn.addEventListener('click', celebrate);
  }

  const scale = 1 + dodges * 0.06;
  gsap.to(yesBtn, {
    scale: Math.min(scale, 1.5),
    duration: 0.3,
    ease: 'back.out(2)'
  });
}

// ─── Botón "Sí" ───
yesBtn.addEventListener('click', celebrate);

function celebrate() {
  yesBtn.removeEventListener('click', celebrate);
  noBtn.removeEventListener('click', celebrate);

  // Acelerar estrellas
  celebrationMode = true;

  gsap.to(questionScene, {
    opacity: 0,
    scale: 1.05,
    duration: 0.5,
    ease: 'power2.in',
    onComplete: () => {
      questionScene.classList.remove('active');
      noBtn.style.position = '';
      noBtn.style.display = 'none';
      showCelebration();
    }
  });
}

// ─── ETAPA 3: Celebración ───
function showCelebration() {
  celebrationScene.classList.add('active');
  celebrationScene.style.opacity = 0;

  gsap.to(celebrationScene, { opacity: 1, duration: 0.5 });

  gsap.from('#big-heart', {
    scale: 0,
    rotation: -20,
    duration: 0.8,
    ease: 'elastic.out(1, 0.5)'
  });
  gsap.from('.celeb-title', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    delay: 0.3,
    ease: 'power3.out'
  });
  gsap.from('.voucher', {
    y: 40,
    opacity: 0,
    scale: 0.85,
    duration: 0.9,
    delay: 0.6,
    ease: 'back.out(1.7)'
  });
  gsap.from('.celeb-sub', {
    y: 20,
    opacity: 0,
    duration: 0.7,
    delay: 1.0,
    ease: 'power3.out'
  });

  startHeartRain();
}

// ─── Lluvia de corazones (DOM) ───
function startHeartRain() {
  const hearts = ['♥', '❤', '💕', '💖', '💗', '💘', '✨'];
  let count = 0;

  function spawnHeart() {
    if (count > 120) return;
    count++;

    const el = document.createElement('div');
    el.className = 'falling-heart';
    el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    el.style.left = Math.random() * 100 + 'vw';
    el.style.fontSize = (14 + Math.random() * 28) + 'px';
    el.style.animationDuration = (2.5 + Math.random() * 3) + 's';
    el.style.color = `hsl(${340 + Math.random() * 30}, 85%, ${60 + Math.random() * 25}%)`;
    document.body.appendChild(el);

    el.addEventListener('animationend', () => el.remove());

    const delay = count < 40 ? 60 : 200 + Math.random() * 300;
    setTimeout(spawnHeart, delay);
  }
  spawnHeart();
}


// ============================================================
//  CANVAS — Fondo: estrellas suaves + bokeh flotante
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

const W = () => innerWidth;
const H = () => innerHeight;

let celebrationMode = false;

// ─── Estrellas pequeñas ───
const stars = [];
const NUM_STARS = 180;

for (let i = 0; i < NUM_STARS; i++) {
  stars.push({
    x: Math.random() * W(),
    y: Math.random() * H(),
    size: 0.5 + Math.random() * 1.8,
    twinkleSpeed: 1 + Math.random() * 3,
    twinkleOffset: Math.random() * Math.PI * 2,
    baseAlpha: 0.3 + Math.random() * 0.5
  });
}

// ─── Bokeh / orbs flotantes ───
const orbs = [];
const NUM_ORBS = 20;

for (let i = 0; i < NUM_ORBS; i++) {
  orbs.push({
    x: Math.random() * W(),
    y: Math.random() * H(),
    vx: (Math.random() - 0.5) * 0.3,
    vy: -0.1 - Math.random() * 0.3,
    radius: 15 + Math.random() * 50,
    hue: 330 + Math.random() * 40,
    alpha: 0.02 + Math.random() * 0.04,
    pulseSpeed: 0.5 + Math.random() * 1.5,
    pulseOffset: Math.random() * Math.PI * 2
  });
}

let time = 0;

function animate() {
  time += 0.008;

  const w = W();
  const h = H();

  // Fondo oscuro con gradiente sutil
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#0a0a14');
  grad.addColorStop(0.5, '#0e0b18');
  grad.addColorStop(1, '#12091a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // ─── Dibujar orbs (bokeh) ───
  for (const o of orbs) {
    const pulse = 1 + 0.3 * Math.sin(time * o.pulseSpeed + o.pulseOffset);
    const r = o.radius * pulse;
    const speedMult = celebrationMode ? 2.5 : 1;

    o.x += o.vx * speedMult;
    o.y += o.vy * speedMult;

    // Wrap around
    if (o.y + r < 0) { o.y = h + r; o.x = Math.random() * w; }
    if (o.x < -r) o.x = w + r;
    if (o.x > w + r) o.x = -r;

    const orbAlpha = celebrationMode ? o.alpha * 2.5 : o.alpha;

    const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, r);
    g.addColorStop(0, `hsla(${o.hue}, 80%, 65%, ${orbAlpha * 1.5})`);
    g.addColorStop(0.5, `hsla(${o.hue}, 70%, 55%, ${orbAlpha * 0.6})`);
    g.addColorStop(1, `hsla(${o.hue}, 60%, 45%, 0)`);

    ctx.beginPath();
    ctx.fillStyle = g;
    ctx.arc(o.x, o.y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // ─── Dibujar estrellas ───
  for (const s of stars) {
    const twinkle = 0.5 + 0.5 * Math.sin(time * s.twinkleSpeed + s.twinkleOffset);
    const alpha = s.baseAlpha * twinkle;
    const size = celebrationMode ? s.size * 1.4 : s.size;

    ctx.beginPath();
    ctx.fillStyle = `rgba(255, 235, 245, ${alpha})`;
    ctx.arc(s.x, s.y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(animate);
}
animate();
