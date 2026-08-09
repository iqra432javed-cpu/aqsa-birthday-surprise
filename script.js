/* ===========================================================
   For Aqsa — mystery unlock game
   =========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientSparkles();
  initOpenScreen();
  initGameFlow();
  initFlipCards();
  initPolaroids();
  initCandles();
  initGiftBoxes();
  initTimeCapsule();
  initLineReveal();
  initBonusReveal();
});

/* -----------------------------------------------------------
   1. Ambient sparkles (canvas)
----------------------------------------------------------- */
function initAmbientSparkles() {
  const canvas = document.getElementById('ambient');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let w, h, bits;
  const colors = ['#3f6fe0', '#7fa0f0', '#eef2fa'];

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
   2. Mystery gate
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
    }, 700);
  });
}

/* -----------------------------------------------------------
   3. Core game flow — question -> correct answer -> unlock
----------------------------------------------------------- */
function initGameFlow() {
  const questionBlocks = document.querySelectorAll('.question-block');
  const dots = document.querySelectorAll('[data-dot]');
  let unlockedCount = 0;

  questionBlocks.forEach(block => {
    const options = block.querySelectorAll('.q-option');
    const hint = block.querySelector('.q-hint');

    options.forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.dataset.correct === 'true') {
          options.forEach(o => o.disabled = true);
          btn.classList.add('correct');
          if (hint) hint.classList.remove('show');

          unlockedCount++;
          if (dots[unlockedCount - 1]) dots[unlockedCount - 1].classList.add('filled');

          const surpriseId = 'surprise' + block.id.replace('q', '');
          const surprise = document.getElementById(surpriseId);
          if (surprise) {
            surprise.hidden = false;
            setTimeout(() => surprise.scrollIntoView({ behavior: 'smooth', block: 'start' }), 250);
          }
        } else {
          btn.classList.add('wrong');
          if (hint) hint.classList.add('show');
          setTimeout(() => btn.classList.remove('wrong'), 420);
        }
      });
    });
  });

  document.querySelectorAll('[data-next]').forEach(btn => {
    btn.addEventListener('click', () => {
      const nextId = btn.dataset.next;
      const next = document.getElementById(nextId);
      if (!next) return;
      next.hidden = false;

      if (nextId === 'finale') {
        setTimeout(burstConfetti, 500);
      }

      setTimeout(() => next.scrollIntoView({ behavior: 'smooth', block: 'start' }), 250);
    });
  });
}

/* -----------------------------------------------------------
   4. "there's a bit more" — reveal bonus section
----------------------------------------------------------- */
function initBonusReveal() {
  const btn = document.getElementById('revealBonusBtn');
  const bonus = document.getElementById('bonusSection');
  if (!btn || !bonus) return;

  btn.addEventListener('click', () => {
    bonus.hidden = false;
    btn.hidden = true;
    setTimeout(() => bonus.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
  });
}

/* -----------------------------------------------------------
   5. Flip cards
----------------------------------------------------------- */
function initFlipCards() {
  document.querySelectorAll('[data-flip]').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('flipped'));
  });
}

/* -----------------------------------------------------------
   6. Polaroid lightbox
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
   7. Candles
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
   8. Gift boxes accordion
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
   9. Time capsule — genuinely date-locked
----------------------------------------------------------- */
function initTimeCapsule() {
  const box = document.getElementById('capsuleBox');
  const lockIcon = document.getElementById('capsuleLock');
  const msg = document.getElementById('capsuleMsg');
  if (!box || !lockIcon || !msg) return;

  const unlockDate = new Date('2027-08-15T00:00:00');
  const now = new Date();
  const isUnlocked = now >= unlockDate;

  lockIcon.textContent = isUnlocked ? 'open' : 'locked';
  if (isUnlocked) box.classList.add('unlocked');

  box.addEventListener('click', () => {
    if (!isUnlocked) {
      msg.hidden = false;
      msg.textContent = 'this one is locked until 15 August 2027, meri jaan — come back next year.';
      return;
    }
    msg.hidden = false;
    msg.textContent = "If you're reading this, another year has passed, Aqsa. I hope it treated you gently, and I hope whoever you've become is proud of the year behind her. Happy birthday, meri jaan. I still mean every word from the year before.";
    burstConfetti();
  });
}

/* -----------------------------------------------------------
   10. Staggered line reveal (duas) — triggers once visible
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
   11. Confetti burst
----------------------------------------------------------- */
function burstConfetti() {
  const colors = ['#3f6fe0', '#7fa0f0', '#eef2fa'];
  const count = 44;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';

    const size = Math.random() * 6 + 4;
    const left = Math.random() * 100;
    const duration = Math.random() * 1.8 + 2.4;
    const rotateEnd = Math.random() * 500 - 250;
    const drift = Math.random() * 120 - 60;

    piece.style.left = left + 'vw';
    const color = colors[Math.floor(Math.random() * colors.length)];
    piece.style.width = size + 'px';
    piece.style.height = size + 'px';
    piece.style.background = color;
    piece.style.borderRadius = '50%';
    piece.style.opacity = '.85';

    document.body.appendChild(piece);

    const anim = piece.animate([
      { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
      { transform: `translate(${drift}px, 100vh) rotate(${rotateEnd}deg)`, opacity: 0.9 }
    ], { duration: duration * 1000, easing: 'cubic-bezier(.22,.68,0,1)', fill: 'forwards' });

    anim.onfinish = () => piece.remove();
  }
}
