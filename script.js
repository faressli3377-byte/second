/* ============================================================
   ADAM & FARAH — Wedding Invitation Script
   ============================================================ */
'use strict';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

/* ── Helpers ── */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

/* ============================================================
   SPLASH SCREEN
   ============================================================ */
(function initSplash() {
  createParticles();

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.to('#sl1', { opacity: 1, y: 0, duration: 1.2, delay: 0.6 }, 'start')
    .to('#sl2', { opacity: 1, y: 0, duration: 1.2 }, '-=0.4')
    .to('#sl3', { opacity: 1, y: 0, duration: 1.2 }, '-=0.4')
    .to('.splash-divider', { opacity: 1, width: '80px', duration: 0.8 }, '-=0.2')
    .to('.enter-btn', { opacity: 1, duration: 0.8 });

  // Animate lines from below
  gsap.set($$('.splash-line'), { y: 20 });

  $('#enterBtn').addEventListener('click', handleEnter);

  function handleEnter() {
    startMusic();
    const tl2 = gsap.timeline();
    tl2.to('#splash', { opacity: 0, duration: 1, ease: 'power2.inOut' })
      .call(() => {
        $('#splash').style.display = 'none';
        const main = $('#mainContent');
        main.style.display = 'block';
        main.classList.remove('main-hidden');
        gsap.from(main, { opacity: 0, duration: 0.5 });
        initScrollAnimations();
        initRoots();
        initRSVP();
        initGuestbook();
        spawnPetals();
        updateNavDots();
        $('#musicToggle').classList.remove('hidden');
      });
  }
})();

function createParticles() {
  const container = $('#splashParticles');
  for (let i = 0; i < 60; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    Object.assign(p.style, {
      position: 'absolute',
      width: Math.random() * 3 + 1 + 'px',
      height: Math.random() * 3 + 1 + 'px',
      borderRadius: '50%',
      background: `rgba(184,147,90,${Math.random() * 0.4 + 0.1})`,
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
    });
    container.appendChild(p);
    gsap.to(p, {
      y: '-=40',
      x: `+=${(Math.random() - 0.5) * 60}`,
      opacity: 0,
      duration: Math.random() * 4 + 3,
      repeat: -1,
      delay: Math.random() * 4,
      ease: 'none',
    });
  }
}

/* ============================================================
   MUSIC — plays silently in background, no visible UI
   ============================================================ */
let musicPlaying = false;

function startMusic() {
  const audio = $('#bgMusic');
  if (!audio) return;

  // Explicit src for GitHub Pages compatibility
  audio.src = './music.mp3';
  audio.load();
  audio.volume = 0.35;
  audio.muted = false;

  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // Autoplay blocked — attach deferred retry on next user interaction
      const retry = () => {
        audio.play().catch(() => { });
        window.removeEventListener('touchstart', retry);
        window.removeEventListener('click', retry);
        window.removeEventListener('keydown', retry);
      };
      window.addEventListener('touchstart', retry, { once: true, passive: true });
      window.addEventListener('click', retry, { once: true, passive: true });
      window.addEventListener('keydown', retry, { once: true });
    });
  }
}



/* ============================================================
   SCROLL ANIMATIONS (GSAP ScrollTrigger)
   ============================================================ */
function initScrollAnimations() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  $$('.reveal-item').forEach((el) => {
    const delay = parseFloat(el.dataset.delay || 0);
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: reduceMotion ? 0.2 : 1,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
  });

  // Section-level soft fade for premium reveal flow
  gsap.utils.toArray('.section-padding').forEach((section) => {
    gsap.fromTo(section,
      { opacity: 0.94, y: 18 },
      {
        opacity: 1,
        y: 0,
        duration: reduceMotion ? 0.2 : 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 92%',
          toggleActions: 'play none none none',
        },
      },
    );
  });

  // Soft parallax on decorative backgrounds
  gsap.utils.toArray('.parallax-bg').forEach((bg) => {
    gsap.to(bg, {
      yPercent: reduceMotion ? 0 : 12,
      ease: 'none',
      scrollTrigger: {
        trigger: bg.closest('section') || bg,
        scrub: reduceMotion ? false : 0.7,
      },
    });
  });

  // Timeline line draw
  gsap.from('.timeline-line', {
    scaleY: 0,
    transformOrigin: 'top',
    duration: 2,
    ease: 'power2.out',
    scrollTrigger: { trigger: '#program', start: 'top 70%' },
  });
}

/* ============================================================
   OUR ROOTS — Photo Reveal on Scroll
   ============================================================ */
function initRoots() {
  $$('.root-circle').forEach((circle) => {
    ScrollTrigger.create({
      trigger: circle,
      start: 'top 50%',
      onEnter: () => circle.classList.add('revealed-adult'),
      onLeaveBack: () => circle.classList.remove('revealed-adult'),
    });
  });
}

/* ============================================================
   PETAL ANIMATION
   ============================================================ */
function spawnPetals() {
  const container = $('#petals');
  const shapes = ['◆', '✦', '⬡', '•'];
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('span');
    p.className = 'petal';
    p.textContent = shapes[i % shapes.length];
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      font-size: ${Math.random() * 10 + 6}px;
      color: rgba(184,147,90,${Math.random() * 0.5 + 0.1});
      animation-duration: ${Math.random() * 10 + 8}s;
      animation-delay: ${Math.random() * 8}s;
    `;
    container.appendChild(p);
  }
}

/* ============================================================
   COUNTDOWN
   ============================================================ */
function initCountdown() {
  const target = new Date('2026-07-10T18:00:00');

  function tick() {
    const diff = Math.abs(target - Date.now());

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const pad = (n) => String(n).padStart(2, '0');

    $('#cd-days').textContent = pad(d);
    $('#cd-hours').textContent = pad(h);
    $('#cd-mins').textContent = pad(m);
    $('#cd-secs').textContent = pad(s);
  }

  tick();
  setInterval(tick, 1000);
}

document.addEventListener('DOMContentLoaded', initCountdown);

/* ============================================================
   GUESTBOOK
   ============================================================ */
function initGuestbook() {
  const textarea = $('#wishInput');
  const charCount = $('#charCount');
  const MAX = 500;

  textarea.addEventListener('input', () => {
    const len = textarea.value.length;
    if (len > MAX) textarea.value = textarea.value.slice(0, MAX);
    charCount.textContent = `${Math.min(len, MAX)} / ${MAX}`;
  });

  $('#sendWishBtn').addEventListener('click', () => {
    const val = textarea.value.trim();
    if (!val) { textarea.focus(); return; }
    // Store locally (or send to backend if available)
    const wishes = JSON.parse(localStorage.getItem('wedding_wishes') || '[]');
    wishes.push({ text: val, ts: Date.now() });
    localStorage.setItem('wedding_wishes', JSON.stringify(wishes));

    gsap.to('.guestbook-glass', { y: -4, duration: 0.15, yoyo: true, repeat: 1 });
    textarea.value = '';
    charCount.textContent = `0 / ${MAX}`;
    const success = $('#wishSuccess');
    success.classList.add('visible');
    gsap.from(success, { opacity: 0, y: 10, duration: 0.6, ease: 'power2.out' });
  });
}

/* ============================================================
   RSVP
   ============================================================ */
function initRSVP() {
  const form = $('#rsvpForm');
  if (!form) return;

  const success = $('#rsvpSuccess');
  const nameInput = $('#rsvpName');
  const guestsInput = $('#rsvpGuests');
  const noteInput = $('#rsvpNote');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = nameInput.value.trim();
    const guests = Math.max(1, Math.min(6, parseInt(guestsInput.value || '1', 10)));
    const status = form.querySelector('input[name="attendance"]:checked')?.value || 'joyfully_attending';
    const note = noteInput.value.trim();

    if (!name) {
      nameInput.focus();
      success.textContent = 'Please add your name before sending.';
      success.style.color = '#8B2D2D';
      return;
    }

    const payload = {
      name,
      guests,
      status,
      note,
      ts: Date.now(),
    };

    const data = JSON.parse(localStorage.getItem('wedding_rsvp') || '[]');
    data.push(payload);
    localStorage.setItem('wedding_rsvp', JSON.stringify(data));

    form.reset();
    guestsInput.value = '1';
    success.textContent = status === 'joyfully_attending'
      ? 'RSVP received. We cannot wait to celebrate with you.'
      : 'Your RSVP is received with love. You will be missed dearly.';
    success.style.color = '';
    gsap.fromTo('.rsvp-card', { y: 0 }, { y: -3, duration: 0.14, yoyo: true, repeat: 1 });
  });
}

/* ============================================================
   NAV DOTS
   ============================================================ */
function updateNavDots() {
  const sections = ['hero', 'roots', 'program', 'dresscode', 'venue', 'rsvp', 'guestbook'];
  const dots = $$('.nav-dot');

  function setActive() {
    const mid = window.innerHeight / 2;
    sections.forEach((id, i) => {
      const el = document.getElementById(id);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top <= mid && rect.bottom >= mid) {
        dots.forEach(d => d.classList.remove('active'));
        dots[i] && dots[i].classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();

  dots.forEach((dot, i) => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById(sections[i])?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}


