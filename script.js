/* ===========================================================
   Aqsa's Birthday — interactions
   =========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientDust();
  initEnvelope();
  initScrollReveal();
  initCandles();
  initScrollCue();
});

/* -----------------------------------------------------------
   1. Ambient floating gold dust (canvas, lightweight)
----------------------------------------------------------- */
function initAmbientDust() {
  const canvas = document.getElementById('ambient');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let w, h, particles;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function makeParticles() {
    const count = Math.min(60, Math.floor((w * h) / 26000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.4,
      speed: Math.random() * 0.35 + 0.08,
      drift: Math.random() * 0.6 - 0.3,
      alpha: Math.random() * 0.5 + 0.15
    }));
  }

  function tick() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#d4af37';
    particles.forEach(p => {
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      p.y -= p.speed;
      p.x += p.drift * 0.15;
      if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
    });
    ctx.globalAlpha = 1;
    if (!reduceMotion) requestAnimationFrame(tick);
  }

  resize();
  makeParticles();
  tick();

  window.addEventListener('resize', () => {
    resize();
    makeParticles();
    if (reduceMotion) tick();
  });
}

/* -----------------------------------------------------------
   2. Envelope gate — tap the wax seal to open the letter
----------------------------------------------------------- */
function initEnvelope() {
  const sealBtn = document.getElementById('sealBtn');
  const envelope = document.getElementById('envelope');
  const screen = document.getElementById('envelope-screen');
  const main = document.getElementById('main-content');
  if (!sealBtn || !envelope || !screen || !main) return;

  let opened = false;

  sealBtn.addEventListener('click', () => {
    if (opened) return;
    opened = true;

    envelope.classList.add('open');

    setTimeout(() => {
      screen.classList.add('hide');
      main.hidden = false;
      document.body.style.overflow = '';
      // trigger the hero's own reveal immediately
      requestAnimationFrame(() => revealNow(document.querySelectorAll('.hero .reveal')));
    }, 950);
  });

  // lock scroll behind the gate until opened
  document.body.style.overflow = 'hidden';
  const unlock = new MutationObserver(() => {
    if (main.hidden === false) {
      document.body.style.overflow = '';
      unlock.disconnect();
    }
  });
  unlock.observe(main, { attributes: true });
}

/* -----------------------------------------------------------
   3. Scroll-triggered reveal for sections
----------------------------------------------------------- */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => observer.observe(el));
}

function revealNow(nodeList) {
  nodeList.forEach((el, i) => {
    setTimeout(() => el.classList.add('in'), i * 140);
  });
}

/* -----------------------------------------------------------
   4. "Read your letter" scroll cue
----------------------------------------------------------- */
function initScrollCue() {
  const btn = document.getElementById('scrollCue');
  const target = document.getElementById('letterSection');
  if (!btn || !target) return;
  btn.addEventListener('click', () => target.scrollIntoView({ behavior: 'smooth' }));
}

/* -----------------------------------------------------------
   5. Candles — tap each flame to blow it out; confetti + wish
----------------------------------------------------------- */
function initCandles() {
  const flames = document.querySelectorAll('.flame-group');
  const wishMsg = document.getElementById('wishMsg');
  if (!flames.length) return;

  let outCount = 0;
  let celebrated = false;

  flames.forEach(flame => {
    flame.addEventListener('click', () => {
      if (flame.classList.contains('out')) return;
      flame.classList.add('out');
      outCount++;
      if (outCount === flames.length && !celebrated) {
        celebrated = true;
        burstConfetti();
        if (wishMsg) wishMsg.hidden = false;
      }
    });
  });
}

/* -----------------------------------------------------------
   6. Lightweight DOM confetti burst (no external libraries)
----------------------------------------------------------- */
function burstConfetti() {
  const colors = ['#d4af37', '#f0d89b', '#e8b4b8', '#f7efe1', '#5c1a2b'];
  const count = 60;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';

    const size = Math.random() * 8 + 5;
    const left = Math.random() * 100;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const duration = Math.random() * 1.8 + 2.2;
    const rotateEnd = Math.random() * 720 - 360;
    const drift = Math.random() * 160 - 80;

    piece.style.left = left + 'vw';
    piece.style.width = size + 'px';
    piece.style.height = size * 0.4 + 'px';
    piece.style.background = color;

    document.body.appendChild(piece);

    const anim = piece.animate([
      { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
      { transform: `translate(${drift}px, 100vh) rotate(${rotateEnd}deg)`, opacity: 0.9 }
    ], {
      duration: duration * 1000,
      easing: 'cubic-bezier(.22,.68,0,1)',
      fill: 'forwards'
    });

    anim.onfinish = () => piece.remove();
  }
}
