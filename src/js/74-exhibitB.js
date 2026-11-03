/* Exhibit B: TipIndex. The honest boundary chart (log-log, only boundary.points are plotted), the contamination strip, the chips, the call. */
CF.defineSection('exhibitB', function (d) {
  const b = d.exhibitB;
  if (!b || !(has(b.title) || has(b.summary))) return null;
  const bd = b.boundary || {};
  const pts = (bd.points || []).filter((p) => p.x > 0 && p.y > 0);

  /* ---- chart ---- */
  let chart = null;
  if (pts.length) {
    const W = 360, H = 230, L = 46, R = 18, T = 18, B = 46;
    const ymin = 0.4, ymax = 60, xmax = 1000;
    const X = (v) => L + (Math.log10(v) / Math.log10(xmax)) * (W - L - R);
    const Y = (v) => T + (1 - (Math.log10(v) - Math.log10(ymin)) / (Math.log10(ymax) - Math.log10(ymin))) * (H - T - B);
    const fmt = (v) => (v >= 10 ? String(v) : String(v));
    const g = [];
    [1, 10, 100, 1000].forEach((v) => {
      g.push(s('line', { x1: X(v), x2: X(v), y1: T, y2: H - B, class: 'gl' }));
      g.push(s('text', { x: X(v), y: H - B + 16, class: 'axl', 'text-anchor': 'middle' }, v.toLocaleString('en-US')));
    });
    [1, 10].forEach((v) => {
      g.push(s('line', { x1: L, x2: W - R, y1: Y(v), y2: Y(v), class: v === 1 ? 'be' : 'gl' }));
      g.push(s('text', { x: L - 8, y: Y(v) + 4, class: 'axl', 'text-anchor': 'end' }, v + 'x'));
    });
    g.push(s('text', { x: W - R, y: Y(1) + 15, class: 'be-l', 'text-anchor': 'end' }, 'break-even: above it the index wins'));
    g.push(s('text', { x: (L + W - R) / 2, y: H - 6, class: 'axt', 'text-anchor': 'middle' }, bd.xLabel || ''));
    const yt = s('text', { x: 12, y: (T + H - B) / 2, class: 'axt', 'text-anchor': 'middle', transform: 'rotate(-90 12 ' + (T + H - B) / 2 + ')' }, bd.yLabel || '');
    g.push(yt);
    const sorted = pts.slice().sort((p, q) => p.x - q.x);
    let gap = null;
    if (sorted.length === 2) {
      gap = s('line', { x1: X(sorted[0].x), y1: Y(sorted[0].y), x2: X(sorted[1].x), y2: Y(sorted[1].y), class: 'gap' });
      g.push(gap);
      g.push(s('text', { x: (X(sorted[0].x) + X(sorted[1].x)) / 2 + 6, y: (Y(sorted[0].y) + Y(sorted[1].y)) / 2 - 8, class: 'gap-l', 'text-anchor': 'middle', transform: 'rotate(' + (Math.atan2(Y(sorted[1].y) - Y(sorted[0].y), X(sorted[1].x) - X(sorted[0].x)) * 180 / Math.PI).toFixed(1) + ' ' + ((X(sorted[0].x) + X(sorted[1].x)) / 2 + 6) + ' ' + ((Y(sorted[0].y) + Y(sorted[1].y)) / 2 - 8) + ')' }, 'crossover not measured here'));
    }
    const svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'bchart', role: 'img', 'aria-label': 'Boundary chart: index speedup over a full scan against symbols subscribed, both on log scales. The data table below lists the plotted points.' }, g);
    const detail = h('p', { class: 'dot-detail', 'aria-live': 'polite' });
    const dots = sorted.map((p, i) => {
      const lab = String(p.y) + 'x';
      const btn = h('button', { class: 'bdot', type: 'button', 'aria-label': p.label || lab, style: 'left:' + (X(p.x) / W * 100) + '%;top:' + (Y(p.y) / H * 100) + '%;--i:' + i }, h('i', { 'aria-hidden': 'true' }));
      const tag = h('span', { class: 'bval' + (p.x > 100 ? ' left' : ''), 'aria-hidden': 'true', style: 'left:' + (X(p.x) / W * 100) + '%;top:' + (Y(p.y) / H * 100) + '%;--i:' + i, text: lab });
      btn.addEventListener('click', () => { detail.textContent = p.label || lab; dots.forEach((o) => o.btn.classList.toggle('on', o.btn === btn)); });
      return { btn, tag };
    });
    const table = h('div', { class: 'sr-only' }, h('table', null, h('caption', { text: 'Boundary chart data' }),
      h('thead', null, h('tr', null, h('th', { text: bd.xLabel || 'Symbols subscribed' }), h('th', { text: bd.yLabel || 'Index speedup' }), h('th', { text: 'Reading' }))),
      h('tbody', null, sorted.map((p) => h('tr', null, h('td', { text: String(p.x) }), h('td', { text: String(p.y) }), h('td', { text: p.label || '' }))))));
    chart = h('figure', { class: 'chart' }, h('div', { class: 'cplot' }, svg, dots.map((o) => [o.btn, o.tag])), detail, table,
      has(bd.note) ? CF.ex.custodyStrip({ note: bd.note }) : null);
    CF.ex.whenVisible(chart, (instant) => { chart.classList.add('go'); }, 0.2);
  }

  /* ---- contamination strip ---- */
  const cn = b.contamination;
  let strip = null;
  if (cn && cn.rounds > 0) {
    const dots = Array.from({ length: cn.rounds }, (_, i) => h('i', { class: 'rd', style: '--i:' + i }));
    strip = h('div', { class: 'cstrip' }, h('div', { class: 'rounds', role: 'img', 'aria-label': (cn.contaminated || 0) + ' of ' + cn.rounds + ' rounds were contaminated' }, dots),
      has(cn.note) ? h('p', { class: 'cn-note', path: 'exhibitB.contamination.note', text: cn.note }) : null);
    CF.ex.whenVisible(strip, (instant) => { strip.classList.add('go'); dots.forEach((dot, i) => { if (i < (cn.contaminated || 0)) { if (instant) dot.classList.add('hot'); else setTimeout(() => dot.classList.add('hot'), 250 + i * 160); } }); }, 0.3);
  }

  const chips = (b.chips || []).filter((c) => has(c.text)).length
    ? h('ul', { class: 'chips' }, b.chips.filter((c) => has(c.text)).map((c) => h('li', { class: 'chip-t' + (String(c.tag).toUpperCase() === 'MODELED' ? ' modeled' : '') }, h('b', { text: c.tag }), ' ', c.text)))
    : null;

  const title = has(b.title) ? b.title : ((b.summary || '').split(':')[0] || '');
  const body = [chart, strip, chips, CF.ex.beats(b.beats, 'exhibitB'), CF.ex.crossExam(b.crossExam, 'exhibitB'), CF.ex.verifyBox(b.verify, 'TipIndex')];
  return CF.ex.card('exhibitB', d, { title, tab: 'B', summary: b.summary, custody: b.custody, call: b.call, callPath: 'exhibitB.call', body });
});
