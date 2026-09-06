/* ============================================================
   NOBLE ANTWI — UI EFFECTS
   Scroll progress · Scroll reveal · Card spotlight
   ============================================================ */

(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

  /* ============================================================
     SCROLL PROGRESS BAR
  ============================================================ */
  function initScrollProgress() {
    var bar = document.getElementById('scroll-progress');
    if (!bar) return;

    window.addEventListener('scroll', function () {
      var h = document.documentElement;
      var scrolled = h.scrollTop || document.body.scrollTop;
      var height = h.scrollHeight - h.clientHeight;
      bar.style.width = (height > 0 ? (scrolled / height) * 100 : 0) + '%';
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
      '.proof-strip',
      '.focus-card',
      '.work-card',
      '.post-card-v2',
      '.about-v2',
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
      if (el.classList.contains('skill-category') || el.classList.contains('cert-card') ||
          el.classList.contains('focus-card') || el.classList.contains('work-card') ||
          el.classList.contains('post-card-v2')) {
        el.style.transitionDelay = ((i % 3) * 0.08) + 's';
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
    initScrollProgress();
    initScrollReveal();
    initCardSpotlight();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
