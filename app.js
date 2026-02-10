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

  // Animación escalonada de los elementos de la tarjeta
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

  // Después de muchos intentos el botón se rinde
  if (dodges >= funnyTexts.length) {
    noBtn.textContent = '¡Sí! ♥';
    noBtn.removeEventListener('mouseenter', dodgeButton);
    noBtn.removeEventListener('touchstart', dodgeButton);
    noBtn.style.background = 'linear-gradient(135deg, #ff3b7a, #ff6b9d)';
    noBtn.style.color = '#fff';
    noBtn.addEventListener('click', celebrate);
  }

  // Hacer el botón "Sí" más grande con cada intento
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
  // Solo celebrar una vez
  yesBtn.removeEventListener('click', celebrate);
  noBtn.removeEventListener('click', celebrate);

  // Burst en partículas del canvas
  burstParticles();

  // Transición de escena
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
  gsap.from('.celeb-sub', {
    y: 20,
    opacity: 0,
    duration: 0.7,
    delay: 0.5,
    ease: 'power3.out'
  });
  gsap.from('.celeb-emoji', {
    scale: 0,
    duration: 0.6,
    delay: 0.7,
    ease: 'back.out(3)'
  });

  // Lluvia continua de corazones
  startHeartRain();

  // Cambiar modo de partículas a "fiesta"
  celebrationMode = true;
}

// ─── Lluvia de corazones (DOM) ───
function startHeartRain() {
  const hearts = ['♥', '❤', '💕', '💖', '💗', '💘', '✨'];
  let count = 0;

  function spawnHeart() {
    if (count > 150) return;
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
//  CANVAS — Partículas flotantes formando corazón
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

// Corazón paramétrico
function heartPoint(t) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
  return { x, y };
}

const W = () => innerWidth;
const H = () => innerHeight;

const particles = [];
const N = Math.min(1000, Math.floor(innerWidth * innerHeight / 1200));
let celebrationMode = false;

function initParticles() {
  particles.length = 0;
  for (let i = 0; i < N; i++) {
    particles.push({
      x:  W()/2 + (Math.random() - 0.5) * W(),
      y:  H()/2 + (Math.random() - 0.5) * H(),
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      a:  Math.random() * Math.PI * 2,
      r:  Math.random(),
      hue:  330 + Math.random() * 40,
      size: 1 + Math.random() * 2.2,
      alpha: 0.5 + Math.random() * 0.5
    });
  }
}
initParticles();

let time = 0;

function animate() {
  time += 0.005;

  // Fade-trail del fondo
  ctx.fillStyle = 'rgba(10, 10, 20, 0.16)';
  ctx.fillRect(0, 0, W(), H());

  const scale = Math.min(W(), H()) / 48;
  const cx = W() / 2;
  const cy = H() / 2 + 10;

  for (const p of particles) {
    // Punto objetivo en el contorno del corazón
    const t  = (p.a + time * 0.6) % (Math.PI * 2);
    const hp = heartPoint(t);

    const breathe = celebrationMode
      ? 1 + 0.15 * Math.sin(time * 4 + p.r * 6)
      : 0.9 + 0.2 * Math.sin(time * 2 + p.r * 6);

    const tx = cx + hp.x * scale * breathe;
    const ty = cy - hp.y * scale * breathe;

    const dx = tx - p.x;
    const dy = ty - p.y;

    // Atracción + swirl
    const attraction = celebrationMode ? 0.0012 : 0.0005;
    p.vx += dx * attraction + Math.sin(time + p.r * 10) * 0.004;
    p.vy += dy * attraction + Math.cos(time + p.r * 10) * 0.004;

    // Damping
    p.vx *= 0.945;
    p.vy *= 0.945;

    p.x += p.vx;
    p.y += p.vy;

    // Dibujo
    const glow = celebrationMode ? 1 : 0.85;
    ctx.beginPath();
    ctx.fillStyle = `hsla(${p.hue}, 90%, ${65 + Math.sin(time * 3 + p.r) * 10}%, ${p.alpha * glow})`;
    ctx.arc(p.x, p.y, p.size * (celebrationMode ? 1.3 : 1), 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(animate);
}
animate();

// Explosión de partículas
function burstParticles() {
  for (const p of particles) {
    const ang = Math.random() * Math.PI * 2;
    const sp  = 3 + Math.random() * 7;
    p.vx += Math.cos(ang) * sp;
    p.vy += Math.sin(ang) * sp;
    p.hue = 330 + Math.random() * 50;
  }
}
