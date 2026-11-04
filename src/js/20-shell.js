/* The shell: section registry, the top bar, the lamp state (which lamps are lit) and the tone of the night.
   A section renders nothing when its content is empty. */
EK.order = ['opening', 'intro', 'person', 'lamps', 'lamp1', 'lamp2', 'lamp3', 'transition', 'voice', 'growth', 'verdict', 'deeper', 'evidence', 'wish'];
EK.defs = {};
EK.defineSection = (id, mount) => { EK.defs[id] = mount; };
EK.onReady = [];

/* Lamp state. Lamps light in order from the home flame. Nothing is stored anywhere: reload and the row starts again. */
EK.lamps = (function () {
  const lit = [false, false, false];
  let visitor = false;
  const subs = [];
  const count = () => lit.filter(Boolean).length;
  const api = {
    lit, count,
    isLit: (n) => !!lit[n - 1],
    visitor: () => visitor,
    onChange: (fn) => { subs.push(fn); },
    light(n, pos) {
      if (n < 1 || n > lit.length || lit[n - 1]) return false;
      lit[n - 1] = true;
      api.notify(n);
      EK.bus.emit('diya:lit', { n, x: pos && pos.x, y: pos && pos.y });
      return true;
    },
    lightAll() { if (api.sequence) api.sequence(); else { lit.forEach((_, i) => { lit[i] = true; }); api.notify(0); } },
    lightVisitor() { if (visitor) return; visitor = true; api.notify(-1); EK.bus.emit('diya:visitorLit', {}); },
    notify(n) {
      document.documentElement.setAttribute('data-lit', String(count()));
      document.documentElement.classList.toggle('visitor-lit', visitor);
      subs.forEach((fn) => { try { fn(n); } catch (e) { /* decorative */ } });
    },
  };
  return api;
})();

EK.shell = (function () {
  let data;

  function buildBar() {
    const ui = data.ui || {};
    const brand = document.querySelector('.brand');
    if (brand) {
      brand.textContent = '';
      brand.appendChild(h('span', { class: 'brand-long', text: ui.brand || '' }));
      brand.appendChild(h('span', { class: 'brand-short', 'aria-hidden': 'true', text: ui.brandShort || '' }));
    }
    const right = document.getElementById('topbar-right');
    right.setAttribute('role', 'navigation');
    right.setAttribute('aria-label', 'Page');
    if (has(ui.navLamps)) right.appendChild(h('a', { class: 'nav-link', href: '#lamps', text: ui.navLamps }));
    if (has(ui.navEvidence) && EK.visibleSections.includes('evidence')) right.appendChild(h('a', { class: 'nav-link', href: '#evidence', text: ui.navEvidence }));
    if (has(ui.navSixty) && data.sixty) right.appendChild(h('button', { class: 'nav-link sixty', type: 'button', text: ui.navSixty, onclick: (e) => EK.openSixty(e.currentTarget) }));
    const invite = EK.interview(ui.navInvite, 'nav-link invite');
    if (invite) right.appendChild(invite);
    const skip = document.querySelector('.skip-link');
    if (skip && has(ui.skip)) skip.textContent = ui.skip;
  }

  function buildFooter() {
    const foot = document.getElementById('foot');
    const lines = (data.footer || []).filter(has);
    if (!lines.length) { foot.hidden = true; return; }
    lines.forEach((t) => foot.appendChild(h('p', null, t)));
  }

  /* The dock: Calm (no movement, same light) and the look (Deepavali or Ink). Both live in memory only. */
  function buildDock() {
    const ui = data.ui || {};
    const root = document.documentElement;
    const calm = h('button', { type: 'button', class: 'dock-btn', id: 'dock-calm', onclick: () => setCalm(!EK.mode.calm) });
    const dv = h('button', { type: 'button', class: 'dock-btn', id: 'dock-dv', onclick: () => setInk(false) });
    const ik = h('button', { type: 'button', class: 'dock-btn', id: 'dock-ink', onclick: () => setInk(true) });
    const note = h('p', { class: 'dock-note', id: 'dock-note', text: ui.reduced || '' });
    function setCalm(v) {
      EK.mode.calm = v; root.classList.toggle('calm', v);
      calm.textContent = v ? ui.calmOn : ui.calmOff; calm.setAttribute('aria-pressed', String(v)); note.hidden = !v;
      EK.scene.applyTone(Math.round(EK.scene.currentTone()));
    }
    function setInk(v) {
      EK.mode.ink = v; root.classList.toggle('ink', v);
      dv.textContent = ui.lookDeepavali; ik.textContent = ui.lookInk; dv.setAttribute('aria-pressed', String(!v)); ik.setAttribute('aria-pressed', String(v));
    }
    const dock = h('aside', { class: 'dock', 'aria-label': ui.dockLabel || 'Display options' }, note, calm, h('div', { class: 'dock-seg', role: 'group', 'aria-label': ui.lookLabel || 'Look' }, dv, ik));
    document.body.appendChild(dock);
    setCalm(EK.mode.calm); setInk(false);
  }

  function mountAll() {
    const main = document.getElementById('main');
    EK.visibleSections = [];
    EK.order.forEach((id) => {
      const fn = EK.defs[id];
      if (!fn) return;
      const el = fn(data);
      if (!el) return;
      main.appendChild(el);
      EK.visibleSections.push(id);
    });
    buildBar();
    buildFooter();
    document.documentElement.setAttribute('data-lit', '0');
    buildDock();
    EK.onReady.forEach((fn) => { try { fn(); } catch (e) { /* a decorative step must never stop the page */ } });
    document.documentElement.classList.add('ready');
  }

  function boot() {
    data = EK.data = JSON.parse(document.getElementById('ek-data').textContent);
    EK.scene.build();
    EK.fx.init();
    mountAll();
  }
  return { boot };
})();
