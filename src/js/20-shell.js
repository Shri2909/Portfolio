/* The cosy shell: section registry, chapters, top bar, jump menu, red string rail, footer.
   A section renders nothing when its content is empty. */
CF.order = ['exhibit0', 'brief', 'against', 'exhibitA', 'exhibitB', 'ledger', 'decisions', 'effects', 'lab', 'wispr', 'locker', 'closing', 'exhibitZ'];
CF.defs = {};
CF.defineSection = (id, mount) => { CF.defs[id] = mount; };
CF.reached = new Set();

const SECTION_TITLE_KEY = { against: 'warningTitle', ledger: 'ledgerTitle', decisions: 'decisionsTitle', lab: 'labTitle', wispr: 'wisprTitle', effects: 'effectsTitle', locker: 'lockerTitle', closing: 'closingTitle' };

/* The name of a section for pins, menus and the notebook: chapter title when it anchors a chapter, otherwise ui.*Title or the exhibit title. */
CF.sectionLabel = function (id) {
  const d = CF.data || {};
  const c = (d.chapters || []).find((x) => x.section === id);
  if (c && has(c.title)) return c.title;
  const k = SECTION_TITLE_KEY[id];
  if (k && d.ui && has(d.ui[k])) return d.ui[k];
  if ((id === 'exhibitA' || id === 'exhibitB') && d[id] && has(d[id].title)) return d[id].title;
  if (id === 'exhibit0' && d.exhibit0) return d.exhibit0.label || '';
  return '';
};

/* A sheet: cream paper with a brass index tab. Pass the section id, the tab letter and the heading text; the rest are children. */
CF.sheet = function (id, opts, ...kids) {
  opts = opts || {};
  return h('section', { class: 'sheet' + (opts.cls ? ' ' + opts.cls : ''), id, 'data-section': id, 'aria-labelledby': opts.title ? id + '-h' : opts.labelledby },
    h('div', { class: 'tab', 'aria-hidden': 'true' }, has(opts.tab) ? h('span', { class: 'tl', text: opts.tab }) : null, h('span', { class: 'chap' })),
    opts.title ? h('h2', { class: 'sheet-title', id: id + '-h', text: opts.title }) : null, ...kids);
};

CF.shell = (function () {
  let data;
  const visible = [];

  /* ---- chapters: each chapter owns the sheets after the previous chapter's anchor up to its own anchor ---- */
  function computeChapters() {
    const idx = (id) => CF.order.indexOf(id);
    const list = (data.chapters || []).filter((c) => idx(c.section) >= 0).sort((a, b) => idx(a.section) - idx(b.section));
    let prev = -1;
    const out = [];
    list.forEach((c) => {
      const a = idx(c.section);
      const members = CF.order.filter((id, i) => i > prev && i <= a && visible.includes(id));
      prev = a;
      if (members.length) out.push({ chapter: c, members });
    });
    return out;
  }
  function finalizeChapters() {
    const chs = computeChapters();
    CF.chapters = chs;
    const N = chs.length;
    chs.forEach((c, i) => {
      c.members.forEach((id) => {
        const el = document.getElementById(id);
        const lab = el && el.querySelector('.tab .chap');
        if (lab && N >= 2) lab.textContent = 'Chapter ' + (i + 1) + ' of ' + N;
      });
      const next = chs[i + 1];
      if (i > 0 && next && has(c.chapter.teaser) && CF.makeSeal) {
        const last = document.getElementById(c.members[c.members.length - 1]);
        last.after(CF.makeSeal(c.chapter, document.getElementById(next.members[0])));
      }
    });
    CF.chapterNumber = (id) => { const i = chs.findIndex((c) => c.members.includes(id)); return i < 0 ? null : { n: i + 1, total: N }; };
  }

  /* ---- jump menu ---- */
  function buildJump() {
    const nav = document.getElementById('jump');
    const right = document.getElementById('topbar-right');
    const entries = CF.chapters.map((c) => ({ id: c.members[0], title: c.chapter.title }));
    if (entries.length < 2) return;
    const btn = h('button', { class: 'tb-btn', type: 'button', 'aria-expanded': 'false', 'aria-controls': 'jump', 'aria-label': 'Chapters' }, CF.icon('menu'));
    nav.appendChild(h('ol', null, entries.map((e, i) => h('li', null, h('a', { href: '#' + e.id }, h('span', { class: 'n', text: String(i + 1) }), h('span', { text: e.title }))))));
    const close = () => { nav.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', () => { const open = nav.hidden; nav.hidden = !open; btn.setAttribute('aria-expanded', String(open)); });
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !nav.hidden) { close(); btn.focus(); } });
    document.addEventListener('pointerdown', (e) => { if (!nav.hidden && !e.target.closest('#jump, .tb-btn')) close(); });
    right.appendChild(btn);
  }

  /* ---- the red string rail (decoration: draws with scroll, pins fill when reached, no taps) ---- */
  const pins = {};
  function buildRail() {
    const rail = document.getElementById('rail');
    const page = document.getElementById('page');
    visible.forEach((id) => { const el = h('i', { class: 'pin', 'data-id': id }); rail.appendChild(el); pins[id] = el; });
    let ticking = false;
    const place = (silent) => {
      const base = rail.getBoundingClientRect().top + window.scrollY;
      visible.forEach((id) => {
        const sec = document.getElementById(id);
        if (sec) pins[id].style.top = Math.max(0, Math.round(sec.getBoundingClientRect().top + window.scrollY - base)) + 'px';
      });
      update();
      if (silent !== true) document.dispatchEvent(new CustomEvent('cf:layout'));
    };
    const update = () => {
      ticking = false;
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      rail.style.setProperty('--prog', clamp01(window.scrollY / max).toFixed(4));
      const mid = window.scrollY + window.innerHeight * 0.65;
      let changed = false;
      visible.forEach((id) => {
        const sec = document.getElementById(id);
        if (sec && !CF.reached.has(id) && sec.getBoundingClientRect().top + window.scrollY < mid) { CF.reached.add(id); pins[id].classList.add('reached'); changed = true; }
      });
      if (changed) document.dispatchEvent(new CustomEvent('cf:reached'));
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', () => place());
    if (window.ResizeObserver) new ResizeObserver(() => place()).observe(document.getElementById('main'));
    CF.rail = { pins, place, rail, page };
    place();
  }

  function mountAll() {
    const main = document.getElementById('main');
    CF.order.forEach((id) => {
      const fn = CF.defs[id];
      if (!fn) return;
      const el = fn(data, main);
      if (!el) return;
      if (!el.parentNode) main.appendChild(el);
      visible.push(id);
    });
    CF.visibleSections = visible;
    const foot = document.getElementById('foot');
    if (data.ui && has(data.ui.footer)) foot.textContent = data.ui.footer; else foot.hidden = true;
    finalizeChapters();
    if (CF.clues) CF.clues.init();
    buildJump();
    buildRail();
    if (CF.board) CF.board.afterRail();
    CF.atmosphere.init();
    // the lamp hint appears once, only when there are pencil notes to find, and can be dismissed
    const opening = document.getElementById('exhibit0');
    if (opening && document.querySelector('.pencil') && data.ui && has(data.ui.marginaliaHint) && !store.get('hintDismissed', false)) {
      const slip = h('div', { class: 'hint-slip', role: 'note' }, h('p', { text: data.ui.marginaliaHint }),
        h('button', { class: 'btn', type: 'button', 'aria-label': 'Close', onclick: () => { store.set('hintDismissed', true); slip.remove(); } }, h('span', { 'aria-hidden': 'true', text: '×' })));
      opening.after(slip);
    }
    document.documentElement.classList.add('ready');
  }

  /* The fonts are embedded, so they are ready in a few milliseconds. Measuring after they load means the first measurement is right. */
  function boot() {
    data = CF.data = JSON.parse(document.getElementById('cf-data').textContent);
    let ready = Promise.resolve();
    if (document.fonts && document.fonts.load) {
      const loads = Promise.all([
        document.fonts.load('15px "Courier Prime"'), document.fonts.load('700 15px "Courier Prime"'), document.fonts.load('800 20px Fraunces'),
        document.fonts.load('16px "Source Serif 4"'), document.fonts.load('italic 16px "Source Serif 4"'),
      ]).catch(() => { /* system fonts are fine */ });
      ready = Promise.race([loads, new Promise((r) => setTimeout(r, 400))]);
    }
    ready.then(mountAll);
  }
  return { boot };
})();
