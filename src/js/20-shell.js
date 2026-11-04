/* The shell: section registry, top bar with its two persistent links and the 60-second file, the red string progress rail.
   A section renders nothing when its content is empty. */
CF.order = ['hero', 'person', 'lamps', 'exhibitA', 'exhibitB', 'exhibitC', 'transition', 'voice', 'growth', 'verdict', 'evidence'];
CF.defs = {};
CF.defineSection = (id, mount) => { CF.defs[id] = mount; };
CF.onReady = [];

CF.shell = (function () {
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
    if (has(ui.navCase)) right.appendChild(h('a', { class: 'nav-link', href: '#case', text: ui.navCase }));
    if (has(ui.navEvidence) && CF.visibleSections.includes('evidence')) right.appendChild(h('a', { class: 'nav-link', href: '#evidence', text: ui.navEvidence }));
    if (has(ui.navSixty) && data.sixty) right.appendChild(h('button', { class: 'nav-link sixty', type: 'button', text: ui.navSixty, onclick: (e) => CF.openSixty(e.currentTarget) }));
    const skip = document.querySelector('.skip-link');
    if (skip && has(ui.skip)) skip.textContent = ui.skip;
  }

  /* The red string: a decorative progress line that grows as you read. No pins, no taps. */
  function buildRail() {
    const rail = document.getElementById('rail');
    let ticking = false;
    const update = () => {
      ticking = false;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      rail.style.setProperty('--prog', clamp01(window.scrollY / max).toFixed(4));
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  function mountAll() {
    const main = document.getElementById('main');
    CF.visibleSections = [];
    CF.order.forEach((id) => {
      const fn = CF.defs[id];
      if (!fn) return;
      const el = fn(data);
      if (!el) return;
      main.appendChild(el);
      CF.visibleSections.push(id);
    });
    buildBar();
    buildRail();
    const foot = document.getElementById('foot');
    if (data.ui && has(data.ui.footer)) foot.textContent = data.ui.footer; else foot.hidden = true;
    CF.onReady.forEach((fn) => { try { fn(); } catch (e) { /* a decorative step must never stop the page */ } });
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
