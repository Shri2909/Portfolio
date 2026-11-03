/* The thumbprint of the case: a decorative fingerprint whose ridges are drawn from the counts in this file with a seeded function.
   It measures nothing about a person (the caption says so). Tap a ridge group to see where its count comes from. */
CF.defineSection('thumbprint', function (d) {
  const ui = d.ui || {};
  const cases = ((d.ledger && d.ledger.cases) || []).filter((c) => has(c.title));
  if (!cases.length) return null;
  const forks = ((d.decisions && d.decisions.forks) || []).length;
  const tests = d.exhibitA && d.exhibitA.stats && d.exhibitA.stats.tests;
  const finds = d.exhibitA && d.exhibitA.stats && d.exhibitA.stats.findings;
  const clues = (d.clues || []).length;
  // groups from the centre outwards; ridges per group come from the counts
  const groups = [
    forks && { id: 'forks', n: forks, label: forks + ' forks in the road' },
    clues && { id: 'clues', n: clues, label: clues + ' clues' },
    { id: 'twists', n: cases.length, label: cases.length + ' plot twists' },
    finds && { id: 'finds', n: finds, label: finds + ' audit findings' },
    tests && { id: 'tests', n: Math.max(1, Math.round(Math.sqrt(tests))), label: tests + ' passing tests (drawn as ' + Math.round(Math.sqrt(tests)) + ' ridges)' },
  ].filter(Boolean);
  const seedBase = groups.reduce((a, g) => a * 31 + g.n, 7) >>> 0;
  let seed = seedBase;
  const rnd = () => { seed = (seed + 0x6D2B79F5) >>> 0; let t = seed; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

  const CX = 100, CY = 118, STEP = 3.1, R0 = 12;
  const svg = s('svg', { viewBox: '0 0 200 240', class: 'tprint', 'aria-hidden': 'true', focusable: 'false' });
  let k = 0;
  const bands = [];
  groups.forEach((g) => {
    const gEl = s('g', { class: 'rg', 'data-g': g.id });
    const r0 = R0 + k * STEP;
    for (let i = 0; i < g.n; i++, k++) {
      const r = R0 + k * STEP;
      const ph = [rnd() * 6.28, rnd() * 6.28, rnd() * 6.28], amp = [0.6 + rnd() * 1.4, 0.4 + rnd() * 1.1, 0.3 + rnd() * 0.8];
      const gapStart = rnd() * 6.28, gapLen = rnd() < 0.55 ? 0.25 + rnd() * 0.6 : 0, pts = [];
      const N = 120;
      for (let j = 0; j <= N; j++) {
        const a = (j / N) * 6.2832;
        const rel = (a - gapStart + 12.566) % 6.2832;
        if (rel < gapLen) { if (pts.length) { pts.push(null); } continue; }
        const rr = r + amp[0] * Math.sin(3 * a + ph[0]) + amp[1] * Math.sin(5 * a + ph[1]) + amp[2] * Math.sin(8 * a + ph[2]);
        pts.push([CX + rr * Math.cos(a), CY + rr * 1.22 * Math.sin(a) - (a > 0 && a < 3.14 ? 0 : 0)]);
      }
      let dStr = '', pen = false;
      pts.forEach((p) => { if (!p) { pen = false; return; } dStr += (pen ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); pen = true; });
      gEl.appendChild(s('path', { d: dStr, class: 'ridge', fill: 'none' }));
    }
    bands.push({ id: g.id, from: r0 - STEP / 2, to: R0 + k * STEP - STEP / 2 });
    svg.appendChild(gEl);
  });

  const info = h('p', { class: 'tp-info', 'aria-live': 'polite' });
  function pick(id) {
    svg.querySelectorAll('.rg').forEach((e) => e.classList.toggle('hot', e.dataset.g === id));
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.g === id)));
    const g = groups.find((x) => x.id === id);
    info.textContent = g ? g.label : '';
  }
  const chips = groups.map((g) => { const b = h('button', { class: 'tp-chip', type: 'button', 'aria-pressed': 'false', 'data-g': g.id, text: g.label }); b.addEventListener('click', () => pick(b.getAttribute('aria-pressed') === 'true' ? null : g.id)); return b; });
  svg.addEventListener('click', (e) => {
    const m = svg.getScreenCTM(); if (!m) return;
    const x = (e.clientX - m.e) / m.a, y = (e.clientY - m.f) / m.d;
    const rr = Math.hypot(x - CX, (y - CY) / 1.22);
    const b = bands.find((q) => rr >= q.from && rr < q.to);
    pick(b ? b.id : null);
  });
  const list = h('ul', { class: 'sr-only' }, groups.map((g) => h('li', { text: g.label })));
  return CF.sheet('thumbprint', { title: ui.thumbprintTitle, cls: 'thumbprint' },
    h('div', { class: 'tp-wrap' }, svg), h('p', { class: 'tp-cap', text: ui.thumbprintCaption || '' }),
    h('div', { class: 'tp-chips' }, chips), info, list);
});
