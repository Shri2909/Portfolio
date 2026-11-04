/* The opening: a dark page, one flame already lit, and a row of lamps waiting to be lit one from the next. */

/* A small clay diya as inline SVG. Decorative: the button around it carries the name. kind sets lip length and tilt so the lamps are a family, not clones. */
EK.diya = function (kind, opts) {
  const o = opts || {};
  const k = { 1: { lip: 14, tilt: -2 }, 2: { lip: 18, tilt: 1.5 }, 3: { lip: 12, tilt: 0 }, 4: { lip: 14, tilt: 2 }, v: { lip: 16, tilt: -1 }, home: { lip: 14, tilt: 0 } }[kind] || { lip: 14, tilt: 0 };
  const dashed = !!o.dashed;
  const flame = s('g', { transform: 'translate(' + (62 + k.lip) + ' 4)' }, s('g', { class: 'flame' },
    s('path', { class: 'fl-out', d: 'M0 0 C6 10 8 18 0 26 C-8 18 -6 10 0 0 Z' }),
    s('path', { class: 'fl-in', d: 'M0 9 C3 14 4 19 0 24 C-4 19 -3 14 0 9 Z' })));
  return s('svg', { class: 'diya' + (dashed ? ' dashed' : ''), viewBox: '0 0 130 76', 'aria-hidden': 'true', focusable: 'false', style: 'transform:rotate(' + k.tilt + 'deg)' },
    s('ellipse', { class: 'glow', cx: 62 + k.lip, cy: 34, rx: 30, ry: 30 }),
    s('path', { class: 'clay', d: 'M12 40 C12 62 34 72 62 72 C86 72 104 62 108 50 L' + (62 + k.lip + 18) + ' 44 C' + (62 + k.lip + 10) + ' 46 ' + (62 + k.lip + 4) + ' 46 ' + (62 + k.lip) + ' 44 L108 40 Z' }),
    s('path', { class: 'rim', d: 'M12 40 C30 34 90 34 108 40 C90 46 30 46 12 40 Z' }),
    s('ellipse', { class: 'oil', cx: 60, cy: 40, rx: 36, ry: 4 }),
    s('rect', { class: 'wick', x: 62 + k.lip - 2, y: 30, width: 4, height: 12, rx: 2 }),
    flame);
};

EK.defineSection('opening', (d) => {
  const x = d.opening, ui = d.ui || {};
  if (!x || !has(x.headline)) return null;
  const head = x.headline.split(/(324|19)/).map((p) => p === '324' ? h('span', { class: 'n324', text: p }) : p === '19' ? h('span', { class: 'n19', text: p }) : p);
  const status = h('p', { class: 'row-status', role: 'status', 'aria-live': 'polite' });
  const lamps = [1, 2, 3].map((n) => d['lamp' + n]).filter(Boolean);

  /* hold, tap or Enter: all light the lamp. Releasing early still lights it. */
  function holdable(btn, n) {
    let timer = 0;
    const go = () => { clearTimeout(timer); btn.classList.remove('warming'); lightFrom(n); };
    btn.addEventListener('pointerdown', (e) => {
      if (e.button) return;
      btn._litAtDown = EK.lamps.isLit(n);
      if (btn._litAtDown) return;
      if (n > 1 && !EK.lamps.isLit(n - 1)) return;
      btn.classList.add('warming');
      status.textContent = ui.holdWarm || '';
      timer = setTimeout(go, EK.reduced ? 0 : 900);
    });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => btn.addEventListener(ev, () => { if (btn.classList.contains('warming')) go(); }));
    btn.addEventListener('click', (e) => {
      const wasLit = e.detail === 0 ? EK.lamps.isLit(n) : btn._litAtDown;
      if (wasLit) EK.openStory('lamp' + n); else if (e.detail === 0) lightFrom(n);
    });
  }
  function lightFrom(n) {
    if (EK.lamps.isLit(n)) return;
    if (n > 1 && !EK.lamps.isLit(n - 1)) { status.textContent = 'Lamp ' + (n - 1) + ' pehle.'; return; }
    EK.lamps.light(n);
  }

  const items = lamps.map((l) => {
    const n = l.n;
    const name = (ui.unlit || '').replace('{n}', n).replace('{name}', l.name);
    const desc = (ui.unlitDesc || '').replace('{n}', n).replace('{from}', n === 1 ? ui.fromHome : (ui.fromLamp || '').replace('{n}', n - 1));
    const btn = h('button', { type: 'button', class: 'lamp-btn', id: 'lampbtn-' + n, 'aria-label': name, 'aria-describedby': 'lampdesc-' + n }, EK.diya(n),
      h('span', { class: 'chip-name', text: l.name.toUpperCase() }), EK.icon('chevron'));
    const dsc = h('span', { class: 'sr-only', id: 'lampdesc-' + n, text: desc });
    holdable(btn, n);
    EK.lamps.onChange(() => {
      const on = EK.lamps.isLit(n);
      if (on && !btn.classList.contains('lit')) { btn.classList.add('lit'); }
      btn.classList.toggle('lit', on);
      btn.setAttribute('aria-label', on ? (ui.lit || '').replace('{n}', n).replace('{name}', l.name) : name);
      dsc.textContent = on ? (ui.litDesc || '').replace('{n}', n) : desc;
      const next = EK.lamps.count() + 1;
      btn.classList.toggle('next', !on && n === next);
    });
    if (n === 1) btn.classList.add('next');
    return h('li', { class: 'row-item' }, btn, dsc);
  });
  const home = h('li', { class: 'row-item home' }, h('div', { class: 'home-lamp lit', 'aria-hidden': 'true' }, EK.diya('home'), h('span', { class: 'chip-name', text: 'EK DIYA' })));
  const four = d.growth ? h('li', { class: 'row-item four' }, h('button', { type: 'button', class: 'lamp-btn dashed', 'aria-label': ui.lamp4, 'aria-describedby': 'lampdesc-4',
    onclick: () => { status.textContent = ui.lamp4Try || ''; EK.goTo(document.getElementById('growth'), false); } }, EK.diya(4, { dashed: true }), h('span', { class: 'chip-name', text: ui.lamp4Chip }))
    , h('span', { class: 'sr-only', id: 'lampdesc-4', text: ui.lamp4Desc })) : null;

  const holdBtn = h('button', { type: 'button', class: 'btn primary hold', id: 'hold-first', 'aria-describedby': 'hold-hint' }, h('span', { class: 'hold-ring', 'aria-hidden': 'true' }), h('span', { text: x.hold }));
  holdable(holdBtn, 1);
  const allBtn = h('button', { type: 'button', class: 'linkbtn', text: ui.lightAll, onclick: () => EK.lamps.lightAll() });
  const rowMsg = d.row ? h('div', { class: 'row-msg', hidden: true }, h('p', { class: 'row-lit', text: d.row.lit }), h('p', { text: d.row.body }), h('p', { class: 'row-dusk', text: d.row.dusk })) : null;

  EK.lamps.onChange((n) => {
    const c = EK.lamps.count(), l = n > 0 ? d['lamp' + n] : null;
    holdBtn.hidden = EK.lamps.isLit(1);
    document.getElementById('hold-hint').hidden = EK.lamps.isLit(1);
    if (l && l.litMsg) status.textContent = l.litMsg;
    else if (c === 3) status.textContent = ui.progressDone || '';
    else status.textContent = (ui.progress || '').replace('{n}', c).replace('{r}', 3 - c);
    if (rowMsg) rowMsg.hidden = c < 3;
    allBtn.hidden = c === 3;
  });

  return h('section', { class: 'panel opening', id: 'top', 'aria-labelledby': 'top-h' },
    h('p', { class: 'kicker', text: x.label }),
    h('h1', { class: 'headline', id: 'top-h' }, head),
    has(x.ship) ? h('p', { class: 'ship', text: x.ship }) : null,
    h('p', { class: 'ek-lines' }, x.lines.filter(has).map((t) => [t, h('br')])),
    h('div', { class: 'hold-wrap' }, holdBtn, h('p', { class: 'hold-hint', id: 'hold-hint', text: x.holdHint })),
    h('div', { class: 'scene', role: 'group', 'aria-label': x.alt },
      h('ol', { class: 'row' }, home, items, four)),
    status, rowMsg,
    h('div', { class: 'cta-row center' }, allBtn),
    d.sixty ? h('p', { class: 'sixty-line' }, x.sixtyLine + ' ', h('button', { type: 'button', class: 'btn', text: x.sixtyBtn, onclick: (e) => EK.openSixty(e.currentTarget) })) : null,
    has(x.below) ? h('p', { class: 'below', text: x.below }) : null,
    has(x.intro) ? h('p', { class: 'intro-p', text: x.intro }) : null);
});
