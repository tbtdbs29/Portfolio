(() => {
  const root = document.documentElement;
  root.classList.add('js');

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage unavailable */ } },
  };

  /* ---------- Language (FR in the markup, EN in data-en*) ---------- */
  const ATTRS = [['data-en', 'text'], ['data-en-aria', 'aria-label'], ['data-en-alt', 'alt'], ['data-en-placeholder', 'placeholder']];
  const TITLES = { fr: document.title, en: document.title.replace('Développeur logiciel', 'Software developer').replace('Galerie', 'Gallery') };
  const STRINGS = {
    fr: { error: "L'assistant ne répond pas pour le moment. Écrivez‑moi directement : td29460@gmail.com", empty: 'Je n’ai pas de réponse à ça.', toggle: 'Switch to English' },
    en: { error: 'The assistant is not responding right now. Write to me directly: td29460@gmail.com', empty: 'I have no answer to that.', toggle: 'Passer en français' },
  };
  let lang = 'fr';
  const key = (prop) => `fr${prop.replace(/-(\w)/g, (_, ch) => ch.toUpperCase())}`;

  ATTRS.forEach(([attr, prop]) => {
    document.querySelectorAll(`[${attr}]`).forEach((el) => {
      el.dataset[key(prop)] = prop === 'text' ? el.textContent : el.getAttribute(prop) ?? '';
    });
  });

  function setLang(next) {
    lang = next;
    ATTRS.forEach(([attr, prop]) => {
      document.querySelectorAll(`[${attr}]`).forEach((el) => {
        const value = lang === 'en' ? el.getAttribute(attr) : el.dataset[key(prop)];
        if (prop === 'text') el.textContent = value;
        else el.setAttribute(prop, value);
      });
    });
    root.lang = lang;
    document.title = TITLES[lang];
    document.querySelectorAll('[data-lang-toggle]').forEach((b) => {
      b.textContent = lang === 'fr' ? 'EN' : 'FR';
      b.setAttribute('aria-label', STRINGS[lang].toggle);
    });
    store.set('lang', lang);
  }
  document.querySelectorAll('[data-lang-toggle]').forEach((b) => b.addEventListener('click', () => setLang(lang === 'fr' ? 'en' : 'fr')));
  if (store.get('lang') === 'en') setLang('en');
  window.__lang = () => lang;

  /* ---------- Scroll: nav state, current section, the growing portrait ---------- */
  const nav = document.querySelector('.nav');
  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('.nav nav a[href^="#"]')];
  const grow = document.querySelector('[data-grow]');
  let ticking = false;

  function frame() {
    ticking = false;
    nav?.classList.toggle('is-scrolled', scrollY > 4);
    if (grow) {
      if (reduced.matches) grow.style.transform = '';
      else {
        const r = grow.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, 1 - r.top / innerHeight));
        const full = innerWidth / grow.offsetWidth;
        const s = 1 + (Math.min(full, 1.12) - 1) * p;
        grow.style.transform = `scale(${s.toFixed(4)})`;
      }
    }
    let current = null;
    for (const s of sections) if (s.getBoundingClientRect().top < innerHeight * 0.35) current = s.id;
    navLinks.forEach((a) => {
      if (a.getAttribute('href') === `#${current}`) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }
  const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', request);
  frame();

  /* ---------- Mobile menu ---------- */
  const menuBtn = document.querySelector('[data-menu]');
  if (menuBtn && nav) {
    const setMenu = (open) => {
      nav.classList.toggle('is-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
    };
    menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
    nav.querySelectorAll('nav a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); } });
  }

  /* ---------- Project filter ---------- */
  const items = [...document.querySelectorAll('.tiles .tile, .others .row')];
  const othersTitle = document.querySelector('.others-title');
  const filterButtons = [...document.querySelectorAll('[data-filter] button')];
  function applyFilter(cat) {
    filterButtons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.cat === cat)));
    items.forEach((t) => { t.hidden = !(cat === 'all' ? !('filterOnly' in t.dataset) : t.dataset.cat === cat); });
    const grid = document.querySelector('.tiles');
    grid?.classList.toggle('is-solo', [...grid.children].filter((t) => !t.hidden).length === 1);
    if (othersTitle) othersTitle.hidden = !items.some((t) => t.classList.contains('row') && !t.hidden);
  }
  filterButtons.forEach((b) => b.addEventListener('click', () => applyFilter(b.dataset.cat)));
  applyFilter('all');

  /* ---------- Photo carousel ---------- */
  const track = document.querySelector('[data-track]');
  const prev = document.querySelector('[data-carousel] [data-prev]');
  const next = document.querySelector('[data-carousel] [data-next]');
  if (track && prev && next) {
    const step = () => (track.querySelector('li')?.offsetWidth ?? 600) + 20;
    const sync = () => {
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    };
    prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: reduced.matches ? 'auto' : 'smooth' }));
    next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: reduced.matches ? 'auto' : 'smooth' }));
    track.addEventListener('scroll', sync, { passive: true });
    addEventListener('resize', sync);
    sync();
  }

  /* ---------- Assistant ---------- */
  const form = document.querySelector('[data-chat-form]');
  const log = document.querySelector('[data-chat-log]');
  const chips = document.querySelector('[data-chips]');
  const history_ = [];
  let pending = false;

  function addMessage(role, text, extra = '') {
    const li = document.createElement('li');
    li.className = `msg msg-${role} ${extra}`.trim();
    li.textContent = text;
    log.append(li);
    return li;
  }
  function clean(text) {
    return String(text ?? '').replace(/\*\*(.+?)\*\*/g, '$1').replace(/^#+\s*/gm, '').replace(/^\s*[-*]\s+/gm, '· ').trim();
  }
  async function ask(question) {
    const q = question.trim().slice(0, 500);
    if (!q || pending) return;
    pending = true;
    form.querySelector('.send').disabled = true;
    if (chips) chips.hidden = true;
    addMessage('user', q);
    const wait = document.createElement('li');
    wait.className = 'msg msg-bot';
    wait.innerHTML = '<span class="msg-wait" aria-label="…"><i></i><i></i><i></i></span>';
    log.append(wait);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q, history: history_.slice(-6), lang }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const reply = clean(data.reply) || STRINGS[lang].empty;
      wait.remove();
      addMessage('bot', reply);
      history_.push({ role: 'user', content: q }, { role: 'assistant', content: reply });
    } catch (err) {
      wait.remove();
      addMessage('bot', STRINGS[lang].error, 'is-error');
      console.error(err);
    } finally {
      pending = false;
      form.querySelector('.send').disabled = false;
      form.querySelector('input').focus({ preventScroll: true });
    }
  }
  if (form && log) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input');
      const q = input.value;
      input.value = '';
      ask(q);
    });
    chips?.querySelectorAll('.chip').forEach((c) => c.addEventListener('click', () => ask(c.textContent)));
  }
})();
