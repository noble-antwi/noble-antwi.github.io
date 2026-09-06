/* Small, dependency-free behaviour: theme toggle, mobile nav,
   URL-persisted filter tabs, and a gentle reveal on scroll. */

function initTheme() {
  const btn = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const root = document.documentElement;
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch { /* private mode */ }
  });
}

function initMenu() {
  const btn = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

/* Markup contract:
   <div class="filter-tabs" data-filter-group="posts"><button class="filter-tab" data-filter="all">…</button>…</div>
   <element data-filter-item data-filter-group="posts" data-cat="learning az-900">…</element>
   <p class="filter-empty" data-filter-group="posts">…</p>
   The active value is written to ?<group>=<value>, so refresh and shared links keep the view. */
function initFilters() {
  const params = new URLSearchParams(window.location.search);
  document.querySelectorAll<HTMLElement>('.filter-tabs[data-filter-group]').forEach((bar) => {
    const group = bar.dataset.filterGroup!;
    const tabs = Array.from(bar.querySelectorAll<HTMLButtonElement>('.filter-tab[data-filter]'));
    const items = Array.from(document.querySelectorAll<HTMLElement>(`[data-filter-item][data-filter-group="${group}"]`));
    const empty = document.querySelector<HTMLElement>(`.filter-empty[data-filter-group="${group}"]`);
    if (!tabs.length) return;

    const apply = (value: string, push: boolean) => {
      let shown = 0;
      items.forEach((item) => {
        const cats = (item.dataset.cat || '').split(/\s+/);
        const match = value === 'all' || cats.includes(value);
        item.classList.toggle('is-hidden', !match);
        if (match) shown++;
      });
      tabs.forEach((tab) => {
        const active = tab.dataset.filter === value;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-pressed', String(active));
      });
      empty?.classList.toggle('is-visible', shown === 0);
      if (push) {
        const p = new URLSearchParams(window.location.search);
        if (value === 'all') p.delete(group); else p.set(group, value);
        const qs = p.toString();
        history.replaceState(null, '', window.location.pathname + (qs ? `?${qs}` : '') + window.location.hash);
      }
    };

    tabs.forEach((tab) => tab.addEventListener('click', () => apply(tab.dataset.filter!, true)));
    const initial = params.get(group) || 'all';
    apply(tabs.some((t) => t.dataset.filter === initial) ? initial : 'all', false);
  });
}

function initReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  const els = document.querySelectorAll<HTMLElement>('.feature, .work-card, .cert-card, .series-card, .article-row, .course-row, .stat-strip, .cta-band, .contact-card');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { threshold: 0.06, rootMargin: '0px 0px -24px 0px' });
  els.forEach((el) => { el.classList.add('reveal'); io.observe(el); });
}

initTheme();
initMenu();
initFilters();
initReveal();
