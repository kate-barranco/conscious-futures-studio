/* Conscious Futures Studio — main.js */

/* ---- Scroll-based nav state ---- */
(function () {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ---- Active nav link ---- */
(function () {
  const links = document.querySelectorAll('.nav-links a[href]');
  const path = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === path) a.classList.add('active');
  });
})();

/* ---- Mobile hamburger ---- */
(function () {
  const btn = document.querySelector('.nav-hamburger');
  const mob = document.querySelector('.nav-mobile');
  if (!btn || !mob) return;
  btn.addEventListener('click', () => {
    const open = btn.classList.toggle('open');
    mob.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  mob.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('open');
      mob.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* ---- Intersection-observer reveal ---- */
(function () {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  els.forEach(el => io.observe(el));
})();

/* ---- Email form submission (Mailchimp-ready stub) ---- */
(function () {
  document.querySelectorAll('.email-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const btn   = form.querySelector('button');
      const email = input.value.trim();
      if (!email) return;

      const original = btn.textContent;
      btn.textContent = '...';
      btn.disabled = true;

      /*
        To connect to Mailchimp or ConvertKit:
        Replace this block with your actual form action URL.
        Example for Mailchimp embed: POST to their action URL with 'EMAIL' field.
      */
      await new Promise(r => setTimeout(r, 800));
      btn.textContent = 'Subscribed ✓';
      input.value = '';
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
      }, 3000);
    });
  });
})();

/* ---- Smooth anchor scroll with nav offset ---- */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();
