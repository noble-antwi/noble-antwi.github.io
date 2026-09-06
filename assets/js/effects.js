/* ============================================================
   NOBLE ANTWI — SITE SCRIPTS
   Scroll progress · Scroll reveal · Filter tabs (URL-persisted)
   ============================================================ */

(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
      'details.proj',
      '.mini-card',
      '.cert-card',
      '.article-row',
      '.course-row',
      '.stat-strip',
      '.cta-band',
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
    var staggered = ['focus-card', 'work-card', 'post-card-v2', 'proj', 'cert-card', 'mini-card'];

    elements.forEach(function (el, i) {
      el.classList.add('reveal-item');
      for (var k = 0; k < staggered.length; k++) {
        if (el.classList.contains(staggered[k])) {
          el.style.transitionDelay = ((i % 3) * 0.08) + 's';
          break;
        }
      }
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

    elements.forEach(function (el) { observer.observe(el); });
  }

  /* ============================================================
     FILTER TABS
     Markup contract:
       <div data-filter-group="posts">
         <button class="filter-tab" data-filter="all">…</button>
         <button class="filter-tab" data-filter="learning">…</button>
       </div>
       …
       <div data-filter-item data-filter-group="posts" data-cat="learning">…</div>
       <div class="filter-empty" data-filter-group="posts">…</div>
     The active tab is written to ?<group>=<value> so a refresh
     (or a shared link) lands on the same view.
  ============================================================ */
  function initFilters() {
    var groups = document.querySelectorAll('[data-filter-group]:not([data-filter-item])');
    if (!groups.length) return;

    var params = new URLSearchParams(window.location.search);

    groups.forEach(function (bar) {
      var group = bar.getAttribute('data-filter-group');
      var tabs = bar.querySelectorAll('.filter-tab[data-filter]');
      if (!tabs.length) return;

      var items = document.querySelectorAll('[data-filter-item][data-filter-group="' + group + '"]');
      var empty = document.querySelector('.filter-empty[data-filter-group="' + group + '"]');

      function apply(value, pushUrl) {
        var shown = 0;
        items.forEach(function (item) {
          var cats = (item.getAttribute('data-cat') || '').split(/\s+/);
          var match = value === 'all' || cats.indexOf(value) !== -1;
          item.classList.toggle('is-hidden', !match);
          if (match) shown++;
        });

        tabs.forEach(function (tab) {
          var active = tab.getAttribute('data-filter') === value;
          tab.classList.toggle('is-active', active);
          tab.setAttribute('aria-pressed', active ? 'true' : 'false');
        });

        if (empty) empty.classList.toggle('is-visible', shown === 0);

        if (pushUrl && window.history && window.history.replaceState) {
          var p = new URLSearchParams(window.location.search);
          if (value === 'all') p.delete(group); else p.set(group, value);
          var qs = p.toString();
          window.history.replaceState(null, '', window.location.pathname + (qs ? '?' + qs : '') + window.location.hash);
        }
      }

      tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          apply(tab.getAttribute('data-filter'), true);
        });
      });

      var initial = params.get(group) || 'all';
      var valid = false;
      tabs.forEach(function (tab) { if (tab.getAttribute('data-filter') === initial) valid = true; });
      apply(valid ? initial : 'all', false);
    });
  }

  /* ============================================================
     PROJECT CARDS
     Only one case study open at a time; opening scrolls it into
     view; a ?project=<id> link opens that card on load.
  ============================================================ */
  function initProjects() {
    var cards = document.querySelectorAll('details.proj');
    if (!cards.length) return;

    cards.forEach(function (card) {
      card.addEventListener('toggle', function () {
        if (!card.open) return;
        cards.forEach(function (other) { if (other !== card && other.open) other.open = false; });
        setTimeout(function () {
          var top = card.getBoundingClientRect().top + window.pageYOffset - 84;
          window.scrollTo({ top: top, behavior: reducedMotion ? 'auto' : 'smooth' });
        }, 60);
      });
    });

    var wanted = new URLSearchParams(window.location.search).get('project') || (window.location.hash || '').replace('#', '');
    if (wanted) {
      var target = document.getElementById(wanted);
      if (target && target.tagName === 'DETAILS') target.open = true;
    }
  }

  /* ============================================================
     BOOT
  ============================================================ */
  function boot() {
    initScrollProgress();
    initScrollReveal();
    initFilters();
    initProjects();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
