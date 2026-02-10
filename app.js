// ===== UI (GSAP) =====
gsap.from("#title", { y: 18, opacity: 0, duration: 0.9, ease: "power3.out" });
gsap.from("#line",  { y: 12, opacity: 0, duration: 0.9, delay: 0.15, ease: "power3.out" });
gsap.from(".actions button", { y: 10, opacity: 0, duration: 0.7, delay: 0.25, stagger: 0.08, ease: "power3.out" });

const yes = document.getElementById("yes");
const no  = document.getElementById("no");
const out = document.getElementById("out");

let dodges = 0;
no.addEventListener("mouseenter", () => {
  dodges++;
  const pad = 16;
  const maxX = innerWidth  - no.offsetWidth  - pad;
  const maxY = innerHeight - no.offsetHeight - pad;
  no.style.position = "fixed";
  no.style.left = (pad + Math.random()*maxX) + "px";
  no.style.top  = (pad + Math.random()*maxY) + "px";
  if (dodges > 6) no.textContent = "Ok… Sí 😳";
});

yes.addEventListener("click", () => {
  out.textContent = "¡¡SÍ!! 💖 Prometo una cita hermosa. Te amo ✨";
  burst();
});

// ===== Fondo (Canvas) partículas → corazón =====
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

function resize(){
  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
}
addEventListener("resize", resize);
resize();

// Heart paramétrico (clásico) escalado
function heartPoint(t){
  // t: 0..2PI
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
  return {x, y};
}

const W = () => innerWidth, H = () => innerHeight;

const particles = [];
const N = 1200;

function init(){
  particles.length = 0;
  for(let i=0;i<N;i++){
    const a = Math.random()*Math.PI*2;
    const r = Math.random();
    const px = W()/2 + (Math.random()-0.5)*W();
    const py = H()/2 + (Math.random()-0.5)*H();
    particles.push({
      x:px, y:py,
      vx:(Math.random()-0.5)*0.6,
      vy:(Math.random()-0.5)*0.6,
      a, r,
      hue: 330 + Math.random()*40,
      size: 1 + Math.random()*2
    });
  }
}
init();

let time = 0;

function animate(){
  time += 0.006;

  // Fondo con alpha para “trails”
  ctx.fillStyle = "rgba(11,11,18,0.18)";
  ctx.fillRect(0,0,W(),H());

  // Centro y escala del corazón
  const scale = Math.min(W(),H()) / 45;
  const cx = W()/2, cy = H()/2 + 10;

  for(const p of particles){
    // Target sobre el contorno del corazón con jitter
    const t = (p.a + time) % (Math.PI*2);
    const hp = heartPoint(t);

    const tx = cx + hp.x * scale * (0.9 + 0.25*Math.sin(time*2 + p.r*6));
    const ty = cy - hp.y * scale * (0.9 + 0.25*Math.cos(time*2 + p.r*6));

    // Fuerza de atracción suave
    const dx = tx - p.x;
    const dy = ty - p.y;

    p.vx += dx * 0.0006;
    p.vy += dy * 0.0006;

    // Un poco de “swirl”
    p.vx += Math.sin(time + p.r*10) * 0.005;
    p.vy += Math.cos(time + p.r*10) * 0.005;

    // Damping
    p.vx *= 0.94;
    p.vy *= 0.94;

    p.x += p.vx;
    p.y += p.vy;

    // Dibujo
    ctx.beginPath();
    ctx.fillStyle = `hsla(${p.hue}, 90%, 70%, 0.9)`;
    ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
    ctx.fill();
  }

  requestAnimationFrame(animate);
}
animate();

// “Explosión” de partículas al decir Sí
function burst(){
  for(const p of particles){
    const ang = Math.random()*Math.PI*2;
    const sp = 2 + Math.random()*5;
    p.vx += Math.cos(ang)*sp;
    p.vy += Math.sin(ang)*sp;
  }
  gsap.to(".ui", { scale: 1.03, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.out" });
}
