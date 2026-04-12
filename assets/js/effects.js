/* ============================================================
   NOBLE ANTWI — IMMERSIVE UI EFFECTS
   Particle network · Custom cursor · Scroll reveal
   Typewriter · Glitch · Magnetic buttons · Card spotlight
   ============================================================ */

(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

  /* ============================================================
     LOADING SCREEN
     Only shows once per browser session
  ============================================================ */
  function initLoadingScreen() {
    var screen = document.getElementById('loading-screen');
    if (!screen) return;

    if (sessionStorage.getItem('na-visited')) {
      screen.style.display = 'none';
      document.body.classList.add('site-loaded');
      return;
    }
    sessionStorage.setItem('na-visited', '1');

    var letters = screen.querySelectorAll('.loader-letter');
    var bar     = screen.querySelector('.loader-bar');

    letters.forEach(function (letter, i) {
      setTimeout(function () { letter.classList.add('visible'); }, 200 + i * 90);
    });

    setTimeout(function () { if (bar) bar.style.width = '100%'; }, 350);

    setTimeout(function () {
      screen.classList.add('fade-out');
      setTimeout(function () {
        screen.style.display = 'none';
        document.body.classList.add('site-loaded');
      }, 700);
    }, 2100);
  }

  /* ============================================================
     CUSTOM CURSOR  (desktop only)
  ============================================================ */
  function initCursor() {
    if (isTouch) return;

    var dot  = document.getElementById('cursor-dot');
    var ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    var mx = -300, my = -300;
    var rx = -300, ry = -300;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
    });

    (function animateRing() {
      rx += (mx - rx) * 0.13;
      ry += (my - ry) * 0.13;
      ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)';
      requestAnimationFrame(animateRing);
    })();

    document.querySelectorAll('a, button, .btn, .card, .social-link, .nav-links a, .post-tag, label, input, textarea, summary').forEach(function (el) {
      el.addEventListener('mouseenter', function () { ring.classList.add('hover'); });
      el.addEventListener('mouseleave', function () { ring.classList.remove('hover'); });
    });

    document.addEventListener('mousedown',  function () { dot.classList.add('clicking'); });
    document.addEventListener('mouseup',    function () { dot.classList.remove('clicking'); });
    document.addEventListener('mouseleave', function () { dot.style.opacity = '0'; ring.style.opacity = '0'; });
    document.addEventListener('mouseenter', function () { dot.style.opacity = '1'; ring.style.opacity = '1'; });
  }

  /* ============================================================
     PARTICLE NETWORK CANVAS
  ============================================================ */
  function initParticleCanvas() {
    if (reducedMotion) return;

    var canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    var ctx          = canvas.getContext('2d');
    var mobile       = window.innerWidth < 768;
    var COUNT        = mobile ? 32 : 72;
    var CONNECT_DIST = mobile ? 90 : 125;
    var REPEL_DIST   = 115;
    var MAX_SPEED    = 1.3;

    var W, H, particles;
    var mx = -9999, my = -9999;

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function createParticles() {
      particles = [];
      for (var i = 0; i < COUNT; i++) {
        particles.push({
          x:  Math.random() * W,
          y:  Math.random() * H,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r:  Math.random() * 1.8 + 0.7,
          a:  Math.random() * 0.45 + 0.15
        });
      }
    }

    function tick() {
      ctx.clearRect(0, 0, W, H);

      /* Draw connections */
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var d  = Math.sqrt(dx * dx + dy * dy);
          if (d < CONNECT_DIST) {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(6,182,212,' + ((1 - d / CONNECT_DIST) * 0.22) + ')';
            ctx.lineWidth   = 0.6;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      /* Update and draw particles */
      particles.forEach(function (p) {
        var dx = p.x - mx;
        var dy = p.y - my;
        var d  = Math.sqrt(dx * dx + dy * dy);
        if (d < REPEL_DIST && d > 0) {
          var f = ((REPEL_DIST - d) / REPEL_DIST) * 0.55;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f;
        }

        var spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (spd > MAX_SPEED) {
          p.vx = (p.vx / spd) * MAX_SPEED;
          p.vy = (p.vy / spd) * MAX_SPEED;
        }

        p.x  += p.vx;
        p.y  += p.vy;
        p.vx *= 0.993;
        p.vy *= 0.993;

        if (p.x < -10)      p.x = W + 10;
        else if (p.x > W + 10) p.x = -10;
        if (p.y < -10)      p.y = H + 10;
        else if (p.y > H + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(6,182,212,' + p.a + ')';
        ctx.fill();
      });

      requestAnimationFrame(tick);
    }

    window.addEventListener('mousemove',  function (e) { mx = e.clientX; my = e.clientY; });
    window.addEventListener('mouseleave', function ()  { mx = -9999;     my = -9999; });
    window.addEventListener('resize',     function ()  { resize(); createParticles(); });

    resize();
    createParticles();
    tick();
  }

  /* ============================================================
     SCROLL PROGRESS BAR
  ============================================================ */
  function initScrollProgress() {
    var bar = document.getElementById('scroll-progress');
    if (!bar) return;

    window.addEventListener('scroll', function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
    }, { passive: true });
  }

  /* ============================================================
     SCROLL REVEAL  (IntersectionObserver)
  ============================================================ */
  function initScrollReveal() {
    if (reducedMotion) return;
    if (!window.IntersectionObserver) return;

    var selectors = [
      '.card',
      '.profile-section',
      '.skill-category',
      '.cert-card',
      '.project-case-study',
      '.post-header',
      '.post-footer',
      '.post-body > h2',
      '.post-body > h3',
      '.post-body > p',
      '.post-body > table',
      '.post-body > ul',
      '.post-body > ol',
      '.post-body > blockquote',
      '.post-body > pre',
      '.post-body > div'
    ];

    var elements = document.querySelectorAll(selectors.join(','));

    elements.forEach(function (el, i) {
      el.classList.add('reveal-item');
      if (el.classList.contains('skill-category') || el.classList.contains('cert-card')) {
        el.style.transitionDelay = ((i % 6) * 0.07) + 's';
      }
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.07, rootMargin: '0px 0px -30px 0px' });

    elements.forEach(function (el) { observer.observe(el); });
  }

  /* ============================================================
     TYPEWRITER on hero subtitle
  ============================================================ */
  function initTypewriter() {
    if (reducedMotion) return;

    var el = document.querySelector('.profile-section h3');
    if (!el) return;

    var text = el.textContent.trim();
    el.textContent = '';
    el.classList.add('typewriter-target');

    var i = 0;
    function type() {
      if (i < text.length) {
        el.textContent += text.charAt(i++);
        setTimeout(type, 22);
      } else {
        el.classList.add('typing-done');
      }
    }

    /* Start after loading screen completes */
    var delay = sessionStorage.getItem('na-visited') ? 400 : 2500;
    setTimeout(type, delay);
  }

  /* ============================================================
     GLITCH on header name
  ============================================================ */
  function initGlitch() {
    if (reducedMotion) return;

    var el = document.querySelector('header h1');
    if (!el) return;

    el.dataset.text = el.textContent;
    el.classList.add('glitch-text');

    function glitch() {
      el.classList.add('glitching');
      setTimeout(function () { el.classList.remove('glitching'); }, 380);
      setTimeout(glitch, 4500 + Math.random() * 4000);
    }

    setTimeout(glitch, 3800);
  }

  /* ============================================================
     MAGNETIC BUTTONS
  ============================================================ */
  function initMagneticButtons() {
    if (reducedMotion || isTouch) return;

    document.querySelectorAll('.btn, .social-link').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r  = btn.getBoundingClientRect();
        var cx = r.left + r.width  / 2;
        var cy = r.top  + r.height / 2;
        btn.style.transform = 'translate(' + ((e.clientX - cx) * 0.22) + 'px,' + ((e.clientY - cy) * 0.22) + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }

  /* ============================================================
     CARD SPOTLIGHT  (cursor-following glow inside each card)
  ============================================================ */
  function initCardSpotlight() {
    if (isTouch) return;

    document.querySelectorAll('.card, .skill-category, .cert-card, .project-case-study').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--sx', ((e.clientX - r.left) / r.width  * 100) + '%');
        card.style.setProperty('--sy', ((e.clientY - r.top)  / r.height * 100) + '%');
        card.classList.add('spotlight-active');
      });
      card.addEventListener('mouseleave', function () {
        card.classList.remove('spotlight-active');
      });
    });
  }

  /* ============================================================
     BOOT
  ============================================================ */
  function boot() {
    initLoadingScreen();
    initCursor();
    initParticleCanvas();
    initScrollProgress();
    initScrollReveal();
    initTypewriter();
    initGlitch();
    initMagneticButtons();
    initCardSpotlight();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
