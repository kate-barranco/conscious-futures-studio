/* Conscious Futures — Through the Lens homepage */
(function () {
  'use strict';

  var reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  function prefersReduced() { return reduceMotionQuery.matches; }
  var isTouch = matchMedia('(hover: none), (pointer: coarse)').matches;

  /* ── Nav (handled by shared/nav.js; this page has no local nav toggle) ── */

  /* ── Starfield canvas ── */
  var canvas = document.getElementById('starCanvas');
  var ctx = canvas.getContext('2d');
  var stars = [];

  function sizeCanvas() {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }

  function makeStars() {
    var count = isTouch ? 70 : 140;
    stars = [];
    for (var i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.4 + 0.3,
        tw: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.015 + 0.005
      });
    }
  }

  function drawStars(t) {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var flicker = prefersReduced() ? 0.7 : 0.5 + 0.5 * Math.sin(s.tw + t * s.speed);
      ctx.beginPath();
      ctx.fillStyle = 'rgba(245,241,232,' + (0.25 + flicker * 0.55) + ')';
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  var rafStars;
  function starLoop(t) {
    drawStars(t || 0);
    if (!prefersReduced()) rafStars = requestAnimationFrame(starLoop);
  }

  sizeCanvas();
  makeStars();
  if (prefersReduced()) {
    drawStars(0);
  } else {
    starLoop();
  }

  window.addEventListener('resize', function () {
    sizeCanvas();
    makeStars();
  });

  /* ── Reduced motion: normal-flow reveal, no scroll-jacking ── */
  var portal = document.getElementById('portal');
  var scrollCue = document.getElementById('scrollCue');

  function initReducedMotion() {
    portal.classList.add('reduced-motion');
    var sections = portal.querySelectorAll('.rm-section');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add('revealed');
      });
    }, { threshold: 0.25 });
    sections.forEach(function (el) { io.observe(el); });

    if (scrollCue) {
      scrollCue.addEventListener('click', function () {
        var quoteSection = document.getElementById('quoteLayer');
        if (quoteSection) quoteSection.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth' });
      });
    }
  }

  /* ── Scroll-driven portal (full motion) ── */
  var horizonLayer = document.getElementById('horizonLayer');
  var glassesWrap = document.getElementById('glassesWrap');
  var heroText = document.getElementById('heroText');
  var quoteLayer = document.getElementById('quoteLayer');
  var bridgeLayer = document.getElementById('bridgeLayer');
  var landmarksEl = document.getElementById('landmarks');
  var landmarkTiles;

  var VIEW_W = 700, VIEW_H = 280;
  var LENS_L = { cx: 198, cy: 140, r: 108 };
  var LENS_R = { cx: 502, cy: 140, r: 108 };

  function getLensScreenPositions() {
    var rect = glassesWrap.getBoundingClientRect();
    var scaleX = rect.width / VIEW_W;
    var scaleY = rect.height / VIEW_H;
    return {
      left: {
        x: rect.left + LENS_L.cx * scaleX,
        y: rect.top + LENS_L.cy * scaleY,
        r: LENS_L.r * Math.min(scaleX, scaleY)
      },
      right: {
        x: rect.left + LENS_R.cx * scaleX,
        y: rect.top + LENS_R.cy * scaleY,
        r: LENS_R.r * Math.min(scaleX, scaleY)
      }
    };
  }

  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp01(v) { return Math.max(0, Math.min(1, v)); }
  function phase(p, start, end) { return clamp01((p - start) / (end - start)); }
  function easeInOut(t) { return t * t * (3 - 2 * t); }

  var maxRadius;
  function computeMaxRadius() {
    maxRadius = Math.hypot(window.innerWidth, window.innerHeight);
  }
  computeMaxRadius();
  window.addEventListener('resize', computeMaxRadius);

  function applyMask(radiusPx) {
    var lenses = getLensScreenPositions();
    var mask =
      'radial-gradient(circle ' + radiusPx + 'px at ' + lenses.left.x + 'px ' + lenses.left.y + 'px, black 55%, transparent 100%),' +
      'radial-gradient(circle ' + radiusPx + 'px at ' + lenses.right.x + 'px ' + lenses.right.y + 'px, black 55%, transparent 100%)';
    horizonLayer.style.webkitMaskImage = mask;
    horizonLayer.style.maskImage = mask;
    horizonLayer.style.webkitMaskComposite = 'source-over';
    horizonLayer.style.maskComposite = 'add';
  }

  function updatePortal() {
    var rect = portal.getBoundingClientRect();
    var scrollable = portal.offsetHeight - window.innerHeight;
    var raw = -rect.top / scrollable;
    var p = clamp01(raw);

    /* Phase A: idle hero (0 – 0.14) */
    var pIdleOut = phase(p, 0.10, 0.16);
    heroText.style.opacity = String(1 - pIdleOut);
    heroText.style.transform = 'translateY(' + (-20 * pIdleOut) + 'px)';

    /* Phase B: lens portal opens (0.12 – 0.42) */
    var pOpen = easeInOut(phase(p, 0.12, 0.42));
    var lensRadiusBase = Math.min(window.innerWidth, window.innerHeight) * 0.14;
    var radius = lerp(lensRadiusBase, maxRadius, pOpen);
    applyMask(radius);
    horizonLayer.style.opacity = '1';

    var glassesFade = phase(p, 0.30, 0.44);
    glassesWrap.style.opacity = String(1 - glassesFade);
    var starfieldFade = phase(p, 0.36, 0.46);
    canvas.style.opacity = String(1 - starfieldFade);

    /* Phase C: horizon fills viewport (0.42 – 0.5) — nothing else needed, mask already near-full */

    /* Phase D: quote (0.48 – 0.68) */
    var quoteIn = phase(p, 0.48, 0.56);
    var quoteOut = phase(p, 0.62, 0.70);
    quoteLayer.style.opacity = String(Math.min(quoteIn, 1 - quoteOut));
    quoteLayer.style.pointerEvents = quoteIn > 0.1 && quoteOut < 0.9 ? 'auto' : 'none';

    /* Phase E: bridge (0.66 – 0.82) */
    var bridgeIn = phase(p, 0.66, 0.74);
    var bridgeOut = phase(p, 0.80, 0.86);
    bridgeLayer.style.opacity = String(Math.min(bridgeIn, 1 - bridgeOut));
    bridgeLayer.style.pointerEvents = bridgeIn > 0.1 && bridgeOut < 0.9 ? 'auto' : 'none';

    /* Phase F: landmarks (0.82 – 1.0) */
    var landmarksIn = phase(p, 0.82, 0.92);
    landmarksEl.style.opacity = String(landmarksIn);
    landmarksEl.classList.toggle('interactive', landmarksIn > 0.5);
    if (landmarkTiles) {
      landmarkTiles.forEach(function (tile, i) {
        var delayStart = 0.82 + i * 0.02;
        var tileIn = phase(p, delayStart, delayStart + 0.08);
        tile.classList.toggle('in', tileIn > 0.4);
      });
    }
  }

  var ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(function () {
        updatePortal();
        ticking = false;
      });
      ticking = true;
    }
  }

  /* Idle drift / cursor-tracking before scroll interaction (desktop only) */
  var driftX = 0, driftY = 0;
  function onPointerMove(e) {
    if (window.scrollY > 20) return;
    var nx = (e.clientX / window.innerWidth - 0.5) * 2;
    var ny = (e.clientY / window.innerHeight - 0.5) * 2;
    driftX = nx * 10;
    driftY = ny * 8;
    glassesWrap.style.transform = 'translate(calc(-50% + ' + driftX + 'px), calc(-50% + ' + driftY + 'px))';
  }

  function scrollToPortalProgress(target) {
    var scrollable = portal.offsetHeight - window.innerHeight;
    window.scrollTo({ top: portal.offsetTop + scrollable * target, behavior: 'smooth' });
  }

  function initFullMotion() {
    landmarkTiles = Array.prototype.slice.call(document.querySelectorAll('.landmark-tile'));
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updatePortal);
    if (!isTouch) window.addEventListener('mousemove', onPointerMove, { passive: true });
    if (scrollCue) scrollCue.addEventListener('click', function () { scrollToPortalProgress(0.52); });
    updatePortal();
  }

  function boot() {
    if (prefersReduced()) {
      initReducedMotion();
    } else {
      initFullMotion();
    }
  }

  reduceMotionQuery.addEventListener('change', function () {
    window.location.reload();
  });

  boot();
})();
