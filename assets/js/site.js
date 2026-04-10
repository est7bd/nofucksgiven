/* ── PARTIALS ── */
function loadComponent(url, targetId, callback) {
  fetch(url)
    .then((r) => r.text())
    .then((html) => {
      const t = document.getElementById(targetId);
      if (t) { t.innerHTML = html; if (typeof callback === 'function') callback(); }
    })
    .catch((e) => console.error('Component load failed:', e));
}

function setCurrentNavState() {
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.site-nav a').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    const normalized = href.replace(/\/$/, '') || '/';
    if (normalized === currentPath) link.setAttribute('aria-current', 'page');
  });
}

/* ── NFG MODE ── */
function initNFGMode() {
  const STORAGE_KEY = 'nfg-mode';
  const isActive = localStorage.getItem(STORAGE_KEY) === 'on';
  if (isActive) document.body.classList.add('nfg-mode');

  const wireToggle = () => {
    const btn = document.getElementById('nfg-toggle');
    if (!btn) return;
    if (isActive) btn.classList.add('is-active');
    btn.addEventListener('click', () => {
      const active = document.body.classList.toggle('nfg-mode');
      btn.classList.toggle('is-active', active);
      localStorage.setItem(STORAGE_KEY, active ? 'on' : 'off');
    });
  };

  const poll = setInterval(() => {
    if (document.getElementById('nfg-toggle')) { clearInterval(poll); wireToggle(); }
  }, 50);
  setTimeout(() => clearInterval(poll), 3000);
}

/* ── TAG FILTER ── */
function initTagFilter() {
  const btns  = document.querySelectorAll('.tag-filter__btn');
  const items = document.querySelectorAll('.rant-item[data-tag]');
  const count = document.querySelector('.rants-archive__count');
  const total = items.length;
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const filter = btn.dataset.filter;

      let visible = 0;
      items.forEach(item => {
        const show = filter === 'all' || item.dataset.tag === filter;
        item.hidden = !show;
        if (show) visible++;
      });

      if (count) {
        if (filter === 'all') {
          count.textContent = `${total} posts · updated when something pisses me off`;
        } else {
          const label = btn.textContent.trim();
          count.textContent = `${visible} post${visible !== 1 ? 's' : ''} tagged "${label}"`;
        }
      }
    });
  });
}

/* ── SEARCH ── */
function initSearch() {
  const input   = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  const status  = document.getElementById('search-status');
  if (!input || !results || !window.NFG_POSTS) return;

  const posts = window.NFG_POSTS;

  function highlight(text, query) {
    if (!query) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp(`(${escaped})`, 'gi'),
      '<mark class="search-highlight">$1</mark>');
  }

  function render(query) {
    const q = query.trim().toLowerCase();

    if (!q) {
      results.innerHTML = '';
      status.innerHTML  = '';
      return;
    }

    const matches = posts.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.tag.toLowerCase().includes(q)   ||
      p.excerpt.toLowerCase().includes(q)
    );

    if (!matches.length) {
      results.innerHTML = `<p class="search-no-results">Nothing found for "<span style="color:var(--accent)">${query}</span>". Try different words.</p>`;
      status.innerHTML  = '';
      return;
    }

    status.innerHTML = `<span>${matches.length}</span> result${matches.length !== 1 ? 's' : ''} for "<span>${query}</span>"`;

    results.innerHTML = matches.map(p => `
      <article class="rant-item">
        <p class="rant-meta"><span class="tag">${highlight(p.tag, query)}</span> ${p.date}</p>
        <h2 class="rant-title"><a href="/rants/${p.slug}">${highlight(p.title, query)}</a></h2>
        <p class="rant-excerpt"><span class="rant-excerpt__default">${highlight(p.excerpt, query)}</span></p>
        <a class="read-more" href="/rants/${p.slug}">Keep reading →</a>
      </article>`).join('');
  }

  input.addEventListener('input', () => render(input.value));

  // Focus search if ?q= param present
  const q = new URLSearchParams(window.location.search).get('q');
  if (q) { input.value = q; render(q); }
  input.focus();
}

/* ── EASTER EGG ── */
function initEasterEgg() {
  const TARGET = 'care';
  let buffer = '';
  document.addEventListener('keydown', (e) => {
    const tag = document.activeElement && document.activeElement.tagName;
    if (tag && ['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;
    if (e.key.length !== 1) return;
    buffer = (buffer + e.key.toLowerCase()).slice(-TARGET.length);
    if (buffer !== TARGET) return;

    if (document.querySelector('.easter-egg')) return;
    const overlay = document.createElement('div');
    overlay.className = 'easter-egg';
    overlay.innerHTML = `
      <div>
        <div class="easter-egg__word">That was your<br>first mistake.</div>
        <p class="easter-egg__sub">Press any key or click to dismiss.</p>
      </div>`;
    document.body.appendChild(overlay);
    const remove = () => { overlay.remove(); document.removeEventListener('keydown', remove); };
    setTimeout(() => {
      document.addEventListener('keydown', remove, { once: true });
      overlay.addEventListener('click', () => { overlay.remove(); });
    }, 0);
  });
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  loadComponent('/assets/partials/header.html', 'header-placeholder', () => {
    setCurrentNavState();
    initNFGMode();
  });
  loadComponent('/assets/partials/footer.html', 'footer-placeholder');
  initEasterEgg();
  initTagFilter();
  initSearch();
});
