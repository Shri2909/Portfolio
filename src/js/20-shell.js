/* The shell: section registry, the top bar, the lamp state (which lamps are lit) and the tone of the night.
   A section renders nothing when its content is empty. */
EK.order = ['opening', 'person', 'lamps', 'lamp1', 'lamp2', 'lamp3', 'transition', 'voice', 'growth', 'verdict', 'deeper', 'evidence', 'wish'];
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
    light(n) {
      if (n < 1 || n > lit.length || lit[n - 1]) return false;
      lit[n - 1] = true;
      api.notify(n);
      return true;
    },
    lightAll() { lit.forEach((_, i) => { if (!lit[i]) { lit[i] = true; } }); api.notify(0); },
    lightVisitor() { if (visitor) return; visitor = true; api.notify(-1); },
    notify(n) {
      const c = count();
      document.documentElement.setAttribute('data-tone', String(c));
      document.documentElement.classList.toggle('dusk', c === lit.length);
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
    document.documentElement.setAttribute('data-tone', '0');
    EK.onReady.forEach((fn) => { try { fn(); } catch (e) { /* a decorative step must never stop the page */ } });
    document.documentElement.classList.add('ready');
  }

  function boot() {
    data = EK.data = JSON.parse(document.getElementById('ek-data').textContent);
    mountAll();
  }
  return { boot };
})();
