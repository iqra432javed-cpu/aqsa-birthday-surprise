/* ===========================================================
   Aqsa's 19th Birthday — interactions (Gen Z girly edition)
   =========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientSparkles();
  initOpenScreen();
  initScrollReveal();
  initLineReveal();
  initScrollCue();
  initFinalReveal();
});

/* -----------------------------------------------------------
   1. Ambient floating hearts + sparkles (canvas)
----------------------------------------------------------- */
function initAmbientSparkles() {
  const canvas = document.getElementById('ambient');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let w, h, bits;
  const colors = ['#ff5ca8', '#cdb4ff', '#ffb6d9', '#ffe08a'];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function makeBits() {
    const count = Math.min(46, Math.floor((w * h) / 30000));
    bits = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 8 + 6,
      speed: Math.random() * 0.3 + 0.08,
      drift: Math.random() * 0.4 - 0.2,
      alpha: Math.random() * 0.4 + 0.25,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: Math.random() > 0.5 ? 'heart' : 'sparkle',
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.01
    }));
  }

  function drawHeart(ctx, size) {
    ctx.beginPath();
    const s = size / 2;
    ctx.moveTo(0, s * 0.3);
    ctx.bezierCurveTo(0, -s * 0.3, -s, -s * 0.3, -s, s * 0.15);
    ctx.bezierCurveTo(-s, s * 0.6, -s * 0.4, s * 0.85, 0, s * 1.15);
    ctx.bezierCurveTo(s * 0.4, s * 0.85, s, s * 0.6, s, s * 0.15);
    ctx.bezierCurveTo(s, -s * 0.3, 0, -s * 0.3, 0, s * 0.3);
    ctx.fill();
  }

  function drawSparkle(ctx, size) {
    const s = size / 2;
    ctx.beginPath();
    ctx.moveTo(0, -s); ctx.lineTo(s * 0.28, -s * 0.28);
    ctx.lineTo(s, 0); ctx.lineTo(s * 0.28, s * 0.28);
    ctx.lineTo(0, s); ctx.lineTo(-s * 0.28, s * 0.28);
    ctx.lineTo(-s, 0); ctx.lineTo(-s * 0.28, -s * 0.28);
    ctx.closePath();
    ctx.fill();
  }

  function tick() {
    ctx.clearRect(0, 0, w, h);
    bits.forEach(b => {
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.rot);
      ctx.globalAlpha = b.alpha;
      ctx.fillStyle = b.color;
      if (b.shape === 'heart') drawHeart(ctx, b.size);
      else drawSparkle(ctx, b.size);
      ctx.restore();

      b.y -= b.speed;
      b.x += b.drift * 0.2;
      b.rot += b.rotSpeed;
      if (b.y < -20) { b.y = h + 20; b.x = Math.random() * w; }
    });
    ctx.globalAlpha = 1;
    if (!reduceMotion) requestAnimationFrame(tick);
  }

  resize();
  makeBits();
  tick();

  window.addEventListener('resize', () => {
    resize();
    makeBits();
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
    }, 650);
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
    setTimeout(() => el.classList.add('in'), i * 150);
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
        setTimeout(() => entry.target.classList.add('in'), index * 420);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  lines.forEach(el => observer.observe(el));
}

/* -----------------------------------------------------------
   5. "keep scrolling bestie" cue
----------------------------------------------------------- */
function initScrollCue() {
  const btn = document.getElementById('scrollCue');
  const target = document.getElementById('emotionSection');
  if (!btn || !target) return;
  btn.addEventListener('click', () => target.scrollIntoView({ behavior: 'smooth' }));
}

/* -----------------------------------------------------------
   6. Final glowing "19" — tap to reveal message + confetti
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
   7. Emoji + shape confetti burst (no external libraries)
----------------------------------------------------------- */
function burstConfetti() {
  const colors = ['#ff5ca8', '#cdb4ff', '#ffb6d9', '#ffe08a'];
  const emojis = ['🎀', '💗', '✨', '🩷'];
  const count = 70;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';

    const useEmoji = Math.random() > 0.55;
    const size = Math.random() * 10 + 10;
    const left = Math.random() * 100;
    const duration = Math.random() * 1.8 + 2.2;
    const rotateEnd = Math.random() * 720 - 360;
    const drift = Math.random() * 160 - 80;

    piece.style.left = left + 'vw';

    if (useEmoji) {
      piece.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      piece.style.fontSize = size + 'px';
    } else {
      const color = colors[Math.floor(Math.random() * colors.length)];
      piece.style.width = size * 0.6 + 'px';
      piece.style.height = size * 0.6 + 'px';
      piece.style.background = color;
      piece.style.borderRadius = '50%';
    }

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
