/* ===========================================================
   Aqsa's Birthday — interactions
   =========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientStars();
  initOpenScreen();
  initScrollReveal();
  initLineReveal();
  initScrollCue();
  initFinalReveal();
});

/* -----------------------------------------------------------
   1. Ambient glowing stars / particles (canvas)
----------------------------------------------------------- */
function initAmbientStars() {
  const canvas = document.getElementById('ambient');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let w, h, stars;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function makeStars() {
    const count = Math.min(90, Math.floor((w * h) / 18000));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.4 + 0.3,
      baseAlpha: Math.random() * 0.5 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.006,
      phase: Math.random() * Math.PI * 2,
      drift: Math.random() * 0.06 - 0.03
    }));
  }

  let t = 0;
  function tick() {
    ctx.clearRect(0, 0, w, h);
    stars.forEach(s => {
      const alpha = s.baseAlpha + Math.sin(t * s.twinkleSpeed + s.phase) * 0.25;
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.fillStyle = '#f3dfa4';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      s.y -= s.drift;
      if (s.y < -5) s.y = h + 5;
    });
    ctx.globalAlpha = 1;
    t++;
    if (!reduceMotion) requestAnimationFrame(tick);
  }

  resize();
  makeStars();
  tick();

  window.addEventListener('resize', () => {
    resize();
    makeStars();
    if (reduceMotion) tick();
  });
}

/* -----------------------------------------------------------
   2. Opening screen — "Open Your Surprise" button
----------------------------------------------------------- */
function initOpenScreen() {
  const openBtn = document.getElementById('openBtn');
  const openScreen = document.getElementById('openScreen');
  const main = document.getElementById('main-content');
  if (!openBtn || !openScreen || !main) return;

  document.body.style.overflow = 'hidden';

  openBtn.addEventListener('click', () => {
    openScreen.classList.add('hide');
    setTimeout(() => {
      main.hidden = false;
      document.body.style.overflow = '';
      requestAnimationFrame(() => revealNow(document.querySelectorAll('.hero .reveal')));
    }, 700);
  });
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
    setTimeout(() => el.classList.add('in'), i * 160);
  });
}

/* -----------------------------------------------------------
   4. Emotional message — lines appear one after another
----------------------------------------------------------- */
function initLineReveal() {
  const lines = document.querySelectorAll('[data-line]');
  if (!lines.length) return;

  if (!('IntersectionObserver' in window)) {
    lines.forEach(el => el.classList.add('in'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const index = Array.from(lines).indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('in'), index * 450);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  lines.forEach(el => observer.observe(el));
}

/* -----------------------------------------------------------
   5. "keep going" scroll cue
----------------------------------------------------------- */
function initScrollCue() {
  const btn = document.getElementById('scrollCue');
  const target = document.getElementById('emotionSection');
  if (!btn || !target) return;
  btn.addEventListener('click', () => target.scrollIntoView({ behavior: 'smooth' }));
}

/* -----------------------------------------------------------
   6. Final glowing number — tap to reveal message + confetti
----------------------------------------------------------- */
function initFinalReveal() {
  const btn = document.getElementById('glowNumber');
  const msg = document.getElementById('finalMessage');
  if (!btn || !msg) return;

  let revealed = false;

  btn.addEventListener('click', () => {
    if (revealed) return;
    revealed = true;
    btn.classList.add('tapped');
    msg.hidden = false;
    burstConfetti();
  });
}

/* -----------------------------------------------------------
   7. Lightweight DOM confetti burst (no external libraries)
----------------------------------------------------------- */
function burstConfetti() {
  const colors = ['#d4af37', '#f3dfa4', '#e8b4c8', '#f6f1e6', '#8f7127'];
  const count = 70;
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
