/* The cosy shell: top bar, jump menu, red string rail, footer, section registry.
   A section renders nothing when its content is empty. */
CF.sections = [
  /* id, label used in the jump menu when no chapter title exists, mount(data, parent) -> element | null */
  { id: 'exhibit0', fallback: '', mount: (d, parent) => CF.mountOpening(d, parent) },
];

CF.shell = (function () {
  let data, visible = [];

  function chapterTitle(id) {
    const c = (data.chapters || []).find((x) => x.section === id);
    return c && has(c.title) ? c.title : '';
  }

  /* Chapter n of N counts only visible chapters. */
  function chapterNumber(id) {
    const ids = visible.filter((v) => (data.chapters || []).some((c) => c.section === v));
    const i = ids.indexOf(id);
    return i < 0 ? null : { n: i + 1, total: ids.length };
  }

  function buildJump() {
    const nav = document.getElementById('jump');
    const right = document.getElementById('topbar-right');
    const entries = visible.map((id) => ({ id, title: chapterTitle(id) })).filter((e) => e.title);
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

  /* The red string rail is decoration: it draws with scroll, pins fill when reached. No taps. */
  function buildRail() {
    const rail = document.getElementById('rail');
    const page = document.getElementById('page');
    const pins = visible.map((id) => { const el = h('i', { class: 'pin' }); rail.appendChild(el); return { id, el }; });
    let ticking = false;
    const place = () => {
      const base = page.getBoundingClientRect().top + window.scrollY + 44;
      pins.forEach((p) => {
        const sec = document.getElementById(p.id);
        if (sec) p.el.style.top = Math.max(0, sec.getBoundingClientRect().top + window.scrollY - base) + 'px';
      });
      update();
    };
    const update = () => {
      ticking = false;
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      const prog = clamp01(window.scrollY / max);
      rail.style.setProperty('--prog', prog.toFixed(4));
      const mid = window.scrollY + window.innerHeight * 0.6;
      pins.forEach((p) => {
        const sec = document.getElementById(p.id);
        p.el.classList.toggle('reached', !!sec && sec.getBoundingClientRect().top + window.scrollY < mid);
      });
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', place);
    window.addEventListener('load', place);
    place();
  }

  function mountAll() {
    const main = document.getElementById('main');
    CF.sections.forEach((def) => {
      const el = def.mount(data, main);
      if (el) visible.push(def.id);
    });
    CF.visibleSections = visible;
    CF.chapterNumber = chapterNumber;
    const foot = document.getElementById('foot');
    if (data.ui && has(data.ui.footer)) foot.textContent = data.ui.footer; else foot.hidden = true;
    buildJump();
    buildRail();
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
