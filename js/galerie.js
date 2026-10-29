(() => {
  const grid = document.querySelector('[data-grid]');
  const status = document.querySelector('[data-status]');
  const loupe = document.querySelector('[data-loupe]');
  const loupeImg = document.createElement('img');
  loupeImg.alt = '';
  document.querySelector('[data-loupe-fig]').prepend(loupeImg);
  const loupeCap = document.querySelector('[data-loupe-cap]');
  const seriesButtons = [...document.querySelectorAll('[data-series] button')];
  const NAMES = { fr: { voyage: 'Voyages', evt: 'Événements', fail: 'La galerie n’a pas pu être chargée. Rechargez la page.' }, en: { voyage: 'Travel', evt: 'Events', fail: 'The gallery could not be loaded. Reload the page.' } };
  const lang = () => (window.__lang ? window.__lang() : 'fr');

  let data = null;
  let series = 'voyage';
  let index = 0;

  function render() {
    const items = data[series];
    grid.replaceChildren(...items.map((p, i) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('aria-label', `${NAMES[lang()][series]} ${i + 1} / ${items.length}`);
      const img = document.createElement('img');
      img.src = p.thumb;
      img.width = p.w;
      img.height = p.h;
      img.alt = '';
      img.loading = i < 16 ? 'eager' : 'lazy';
      img.decoding = 'async';
      btn.append(img);
      btn.addEventListener('click', () => open(i));
      li.append(btn);
      if (p.w > p.h) li.dataset.landscape = '';
      return li;
    }));
    fillLastRow();
  }

  // Widen a few landscape frames, spread through the grid, so the last row is never short.
  function fillLastRow() {
    const cells = [...grid.children];
    cells.forEach((li) => li.classList.remove('wide'));
    const cols = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
    const missing = (cols - (cells.length % cols)) % cols;
    if (!missing) return;
    const landscapes = cells.filter((li) => 'landscape' in li.dataset);
    for (let k = 0; k < missing && k < landscapes.length; k += 1) {
      landscapes[Math.floor(((k + 0.5) * landscapes.length) / missing)].classList.add('wide');
    }
  }
  addEventListener('resize', () => { if (data) fillLastRow(); });

  function show(i) {
    const items = data[series];
    index = (i + items.length) % items.length;
    const p = items[index];
    loupeImg.src = p.full;
    loupeImg.width = p.w;
    loupeImg.height = p.h;
    loupeCap.textContent = `${NAMES[lang()][series]} · ${index + 1} / ${items.length}`;
    [index - 1, index + 1].forEach((n) => { const q = items[(n + items.length) % items.length]; if (q) new Image().src = q.full; });
  }
  function open(i) {
    show(i);
    loupe.showModal();
  }

  loupe.querySelector('[data-prev]').addEventListener('click', () => show(index - 1));
  loupe.querySelector('[data-next]').addEventListener('click', () => show(index + 1));
  loupe.querySelector('[data-close]').addEventListener('click', () => loupe.close());
  loupe.addEventListener('click', (e) => { if (e.target === loupe) loupe.close(); });
  loupe.addEventListener('close', () => {
    grid.children[index]?.querySelector('button')?.focus({ preventScroll: false });
  });
  loupe.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
  let startX = null;
  loupe.addEventListener('pointerdown', (e) => { startX = e.clientX; });
  loupe.addEventListener('pointerup', (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
  });

  seriesButtons.forEach((b) => b.addEventListener('click', () => {
    series = b.dataset.cat;
    seriesButtons.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    render();
  }));

  fetch('assets/img/gallery/manifest.json')
    .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
    .then((json) => {
      data = json;
      document.querySelectorAll('[data-count]').forEach((el) => { el.textContent = data[el.dataset.count]?.length ?? ''; });
      render();
    })
    .catch((err) => {
      status.hidden = false;
      status.textContent = NAMES[lang()].fail;
      console.error(err);
    });
})();
