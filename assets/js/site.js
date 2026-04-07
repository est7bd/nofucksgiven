function loadComponent(url, targetId, callback) {
  fetch(url)
    .then((response) => response.text())
    .then((html) => {
      const target = document.getElementById(targetId);
      if (target) {
        target.innerHTML = html;
        if (typeof callback === 'function') callback();
      }
    })
    .catch((error) => {
      console.error('Component load failed:', error);
    });
}

function setCurrentNavState() {
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.site-nav a').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    const normalized = href.replace(/\/$/, '') || '/';
    if (normalized === currentPath) {
      link.setAttribute('aria-current', 'page');
    }
  });
}

function initModeToggle() {
  const toggle = document.getElementById('mode-toggle');
  if (!toggle) return;

  const storageKey = 'nfg-raw-mode';
  const applyState = (enabled) => {
    document.body.classList.toggle('raw-mode', enabled);
    toggle.setAttribute('aria-pressed', enabled ? 'true' : 'false');
    toggle.textContent = enabled ? 'Disable No Fucks Given Mode' : 'Enable No Fucks Given Mode';
  };

  const initial = localStorage.getItem(storageKey) === 'true';
  applyState(initial);

  toggle.addEventListener('click', () => {
    const next = !document.body.classList.contains('raw-mode');
    localStorage.setItem(storageKey, String(next));
    applyState(next);
  });
}

function initEasterEgg() {
  const targetWord = 'care';
  let buffer = '';

  function showOverlay() {
    if (document.querySelector('.easter-egg')) return;
    const overlay = document.createElement('div');
    overlay.className = 'easter-egg';
    overlay.setAttribute('style', [
      'position:fixed',
      'inset:0',
      'z-index:9999',
      'display:grid',
      'place-items:center',
      'padding:2rem',
      'background:rgba(0,0,0,0.94)',
      'color:#b6ff2b',
      'text-align:center'
    ].join(';'));
    overlay.innerHTML = '<div><div style="font-family:Impact,Haettenschweiler,Arial Narrow Bold,sans-serif;font-size:clamp(3rem,10vw,7rem);line-height:0.9;text-transform:uppercase;">That was your first mistake.</div><p style="margin:1rem 0 0;color:rgba(243,243,239,0.72);letter-spacing:0.1em;text-transform:uppercase;">Press any key to dismiss.</p></div>';
    document.body.appendChild(overlay);
    const remove = () => {
      overlay.remove();
      document.removeEventListener('keydown', remove);
      document.removeEventListener('click', remove);
    };
    setTimeout(() => {
      document.addEventListener('keydown', remove, { once: true });
      document.addEventListener('click', remove, { once: true });
    }, 0);
  }

  document.addEventListener('keydown', (event) => {
    const tag = document.activeElement && document.activeElement.tagName;
    if (tag && ['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;
    if (event.key.length !== 1) return;
    buffer = (buffer + event.key.toLowerCase()).slice(-targetWord.length);
    if (buffer === targetWord) showOverlay();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadComponent('assets/partials/header.html', 'header-placeholder', setCurrentNavState);
  loadComponent('assets/partials/footer.html', 'footer-placeholder');
  initModeToggle();
  initEasterEgg();
});
