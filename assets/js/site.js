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

  // Wait for header to load, then wire toggle
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

  // Header is injected via fetch — poll briefly
  const poll = setInterval(() => {
    if (document.getElementById('nfg-toggle')) { clearInterval(poll); wireToggle(); }
  }, 50);
  setTimeout(() => clearInterval(poll), 3000);
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

document.addEventListener('DOMContentLoaded', () => {
  loadComponent('/assets/partials/header.html', 'header-placeholder', () => {
    setCurrentNavState();
    initNFGMode();
  });
  loadComponent('/assets/partials/footer.html', 'footer-placeholder');
  initEasterEgg();
});
