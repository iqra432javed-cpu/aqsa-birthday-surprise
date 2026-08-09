/* ===========================================================
   "A Little World Made For You" — interactions
   =========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientSparkles();
  initOpenScreen();
  initScrollReveal();
  initLineReveal();
  initScrollCue();
  initFlipCards();
  initPolaroids();
  initLetter();
  initCandles();
  initGiftBoxes();
  initTimeCapsule();
  initFinalFireworks();
});

/* -----------------------------------------------------------
   1. Ambient gold sparkles + soft hearts (canvas)
----------------------------------------------------------- */
function initAmbientSparkles() {
  const canvas = document.getElementById('ambient');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let w, h, bits;
  const colors = ['#c9a24b', '#e8ce96', '#e9afc0'];

  function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }

  function makeBits() {
    const count = Math.min(50, Math.floor((w * h) / 28000));
    bits = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 6 + 4,
      speed: Math.random() * 0.28 + 0.06,
      drift: Math.random() * 0.35 - 0.17,
      alpha: Math.random() * 0.4 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.008
    }));
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
      drawSparkle(ctx, b.size);
      ctx.restore();
      b.y -= b.speed;
      b.x += b.drift * 0.2;
      b.rot += b.rotSpeed;
      if (b.y < -20) { b.y = h + 20; b.x = Math.random() * w; }
    });
    ctx.globalAlpha = 1;
    if (!reduceMotion) requestAnimationFrame(tick);
  }

  resize(); makeBits(); tick();
  window.addEventListener('resize', () => { resize(); makeBits(); if (reduceMotion) tick(); });
}

/* -----------------------------------------------------------
   2. Opening screen
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
   3. Scroll-triggered reveal
----------------------------------------------------------- */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) { items.forEach(el => el.classList.add('in')); return; }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  items.forEach(el => observer.observe(el));
}

function revealNow(nodeList) {
  nodeList.forEach((el, i) => setTimeout(() => el.classList.add('in'), i * 150));
}

/* -----------------------------------------------------------
   4. Staggered line reveal (duas)
----------------------------------------------------------- */
function initLineReveal() {
  const lines = document.querySelectorAll('[data-line]');
  if (!lines.length) return;
  if (!('IntersectionObserver' in window)) { lines.forEach(el => el.classList.add('in')); return; }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const index = Array.from(lines).indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('in'), index * 350);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  lines.forEach(el => observer.observe(el));
}

/* -----------------------------------------------------------
   5. Scroll cue
----------------------------------------------------------- */
function initScrollCue() {
  const btn = document.getElementById('scrollCue');
  const target = document.getElementById('aboutSection');
  if (!btn || !target) return;
  btn.addEventListener('click', () => target.scrollIntoView({ behavior: 'smooth' }));
}

/* -----------------------------------------------------------
   6. Flip cards
----------------------------------------------------------- */
function initFlipCards() {
  document.querySelectorAll('[data-flip]').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('flipped'));
  });
}

/* -----------------------------------------------------------
   7. Polaroid lightbox
----------------------------------------------------------- */
function initPolaroids() {
  const lightbox = document.getElementById('lightbox');
  const caption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');
  if (!lightbox || !caption || !closeBtn) return;

  document.querySelectorAll('.polaroid').forEach(p => {
    p.addEventListener('click', () => {
      caption.textContent = p.dataset.caption || '';
      lightbox.classList.add('show');
    });
  });

  const close = () => lightbox.classList.remove('show');
  closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
}

/* -----------------------------------------------------------
   8. Letter
----------------------------------------------------------- */
function initLetter() {
  const gate = document.getElementById('letterGate');
  const btn = document.getElementById('letterOpenBtn');
  const card = document.getElementById('letterCard');
  if (!gate || !btn || !card) return;

  btn.addEventListener('click', () => {
    gate.hidden = true;
    card.hidden = false;
  });
}

/* -----------------------------------------------------------
   9. Candles — blow to reveal wish + dua
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
   10. Gift boxes accordion
----------------------------------------------------------- */
function initGiftBoxes() {
  document.querySelectorAll('[data-box]').forEach(btn => {
    btn.addEventListener('click', () => {
      const box = btn.closest('.gift-box');
      if (box) box.classList.toggle('open');
    });
  });
}

/* -----------------------------------------------------------
   11. Time capsule — genuinely date-locked
----------------------------------------------------------- */
function initTimeCapsule() {
  const box = document.getElementById('capsuleBox');
  const lockIcon = document.getElementById('capsuleLock');
  const msg = document.getElementById('capsuleMsg');
  if (!box || !lockIcon || !msg) return;

  const unlockDate = new Date('2027-08-15T00:00:00');
  const now = new Date();
  const isUnlocked = now >= unlockDate;

  if (isUnlocked) {
    box.classList.add('unlocked');
    lockIcon.textContent = '🔓';
  }

  box.addEventListener('click', () => {
    if (!isUnlocked) {
      msg.hidden = false;
      msg.textContent = '🔒 this one is locked until 15 August 2027, meri jaan — come back next year.';
      return;
    }
    msg.hidden = false;
    msg.textContent = "If you're reading this, another year has passed, Aqsa. I hope it treated you gently, and I hope whoever you've become is proud of the year behind her. Whatever happened between then and now — happy birthday, meri jaan. I still mean every word from the year before. 🤍";
    burstConfetti();
  });
}

/* -----------------------------------------------------------
   12. Final section — auto fireworks on scroll-into-view
----------------------------------------------------------- */
function initFinalFireworks() {
  const section = document.getElementById('finalSection');
  if (!section) return;
  if (!('IntersectionObserver' in window)) { burstConfetti(); return; }

  let fired = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !fired) {
        fired = true;
        setTimeout(burstConfetti, 600);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  observer.observe(section);
}

/* -----------------------------------------------------------
   13. Confetti burst (no external libraries)
----------------------------------------------------------- */
function burstConfetti() {
  const colors = ['#c9a24b', '#e8ce96', '#e9afc0', '#b5495b'];
  const emojis = ['✨', '💗', '🎀', '🌸'];
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
    ], { duration: duration * 1000, easing: 'cubic-bezier(.22,.68,0,1)', fill: 'forwards' });

    anim.onfinish = () => piece.remove();
  }
}
