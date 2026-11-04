/* Beats 2 to 5 and 7: the three lamp stories (Certgen with the audit prediction, Blitz, Vigil with the late-reply model), the transition, the person, the verdict. */

/* ---------- Interaction 1: guess the audit result ---------- */
function guessWidget(g, ui) {
  if (!g || !Array.isArray(g.options)) return null;
  const reveal = h('p', { class: 'reveal', id: 'guess-reveal', role: 'status' });
  const btns = g.options.map((n) => h('button', { type: 'button', class: 'opt' + (n === g.answer ? ' actual' : ''), 'aria-pressed': 'false', text: String(n), onclick: () => pick(n) }));
  const wall = h('div', { class: 'wall', 'aria-hidden': 'true' }, Array.from({ length: 324 }, () => h('i')));
  const finds = h('div', { class: 'finds', 'aria-hidden': 'true' }, Array.from({ length: g.answer }, (_, i) => h('i', { class: i < (g.high || 0) ? 'hi' : null, style: '--i:' + i })));
  const root = h('div', { class: 'widget guess', role: 'group', 'aria-labelledby': 'guess-l' },
    h('p', { class: 'label-brass', id: 'guess-l', text: g.label }),
    has(g.status) ? h('p', { class: 'w-state', text: g.status }) : null,
    wall, finds,
    has(ui.guessAsk) ? h('p', { class: 'w-ask', id: 'guess-q', text: ui.guessAsk }) : null,
    h('div', { class: 'opts', role: 'group', 'aria-labelledby': 'guess-q' }, btns),
    reveal,
    has(g.plain) ? h('p', { class: 'plainly' }, h('strong', { text: (ui.plainly || '') + ': ' }), g.plain) : null);
  function pick(n) {
    btns.forEach((b) => b.setAttribute('aria-pressed', String(b.textContent === String(n))));
    root.classList.add('revealed');
    reveal.textContent = 'You said ' + n + '. ' + g.reveal;
  }
  return root;
}

/* ---------- Interaction 2: the late reply (a model of documented behaviour) ---------- */
function lateWidget(m, ui) {
  if (!m) return null;
  const D = m.deadline, MAX = m.max;
  let mode = 'old', t = m.start;
  const X0 = 14, X1 = 326, X = (v) => X0 + (X1 - X0) * (v / MAX);
  const marker = s('circle', { class: 'mk', cx: X(t), cy: 46, r: 9 });
  const svg = s('svg', { class: 'tl-svg', viewBox: '0 0 340 92', 'aria-hidden': 'true', focusable: 'false' },
    s('rect', { class: 'late-zone', x: X(D), y: 24, width: X1 - X(D), height: 44 }),
    s('line', { class: 'ax', x1: X0, y1: 46, x2: X1, y2: 46 }),
    ...Array.from({ length: MAX + 1 }, (_, i) => [s('line', { class: 'ax', x1: X(i), y1: 41, x2: X(i), y2: 51 }), s('text', { class: 'tx', x: X(i), y: 86, 'text-anchor': 'middle' }, String(i))]).flat(),
    s('line', { class: 'dl', x1: X(D), y1: 20, x2: X(D), y2: 72 }),
    s('text', { class: 'tx dtx', x: X(D), y: 12, 'text-anchor': 'middle' }, ui.deadlineLabel || ''),
    marker);
  const badge = h('span', { class: 'vbadge' });
  const vtext = h('span', { class: 'vtext' });
  const verdict = h('p', { class: 'verdict', role: 'status' }, badge, ' ', vtext);
  const arrival = h('p', { class: 'arrival' });
  const range = h('input', { type: 'range', class: 'string', id: 'late-t', min: 0, max: MAX, step: 0.1, value: t, 'aria-describedby': 'late-arrival late-verdict', oninput: () => { t = parseFloat(range.value); update(); } });
  verdict.id = 'late-verdict'; arrival.id = 'late-arrival';
  const bOld = h('button', { type: 'button', class: 'btn', 'aria-pressed': 'true', text: ui.logicOld || '', onclick: () => setMode('old') });
  const bNew = h('button', { type: 'button', class: 'btn', 'aria-pressed': 'false', text: ui.logicNew || '', onclick: () => setMode('new') });
  function setMode(v) { mode = v; bOld.setAttribute('aria-pressed', String(v === 'old')); bNew.setAttribute('aria-pressed', String(v === 'new')); update(); }
  function update() {
    const late = t > D;
    marker.setAttribute('cx', X(t));
    svg.setAttribute('data-late', String(late));
    range.style.setProperty('--f', (t / MAX).toFixed(3));
    range.setAttribute('aria-valuetext', t.toFixed(1) + ' seconds');
    arrival.textContent = 'Reply arrives at ' + t.toFixed(1) + ' s, ' + (late ? 'after' : 'within') + ' the ' + D + '-second deadline.';
    let state, b, txt;
    if (!late) { state = 'ok'; b = 'COUNTED'; txt = 'Counted as proof the connection is alive.'; }
    else if (mode === 'old') { state = 'bad'; b = 'COUNTED'; txt = 'Counted as proof the connection is healthy, even though it arrived late.'; }
    else { state = 'good'; b = 'NOT COUNTED'; txt = 'Not counted as proof of current health, because it arrived after the deadline.'; }
    verdict.setAttribute('data-state', state);
    badge.textContent = b; vtext.textContent = txt;
  }
  const root = h('div', { class: 'widget late', role: 'group', 'aria-labelledby': 'late-l' },
    h('p', { class: 'label-brass', id: 'late-l', text: m.label }),
    h('p', { class: 'model-badge' }, h('strong', { text: ui.modelBadge || '' }), ' · ' + (ui.modelNote || '')),
    h('div', { class: 'late-ctl' },
      h('span', { class: 'lbl', id: 'late-logic', text: ui.logicLabel || '' }),
      h('div', { class: 'seg', role: 'group', 'aria-labelledby': 'late-logic' }, bOld, bNew)),
    h('label', { class: 'lbl', for: 'late-t', text: ui.arrivalLabel || '' }),
    range, svg, arrival, verdict,
    has(m.plain) ? h('p', { class: 'plainly' }, h('strong', { text: (ui.plainly || '') + ': ' }), m.plain) : null);
  update();
  return root;
}

/* ---------- sections ---------- */
/* A lamp story: kicker, title, tagline, the story, an optional interaction, three things it reveals, the growth connection and the evidence note. */
function storySheet(id, tab, x, widget, d) {
  if (!x) return null;
  return CF.sheet(id, tab, id + '-h',
    CF.heading(id, x.heading),
    has(x.title) ? h('p', { class: 'story-title', text: x.title }) : null,
    has(x.tagline) ? h('p', { class: 'story-tag', text: x.tagline }) : null,
    CF.prose(x.body), widget,
    (x.reveals || []).length ? h('div', { class: 'reveals' }, has(x.revealsLabel) ? h('h3', { text: x.revealsLabel }) : null, h('ul', null, x.reveals.map((t) => h('li', null, CF.rich(t))))) : null,
    CF.prose([x.growth, x.note].filter(has), 'story-end'),
    x.receipt ? h('div', { class: 'cta-row' }, CF.receiptBtn(x.receipt)) : null);
}
CF.defineSection('exhibitA', (d) => d.exhibitA && storySheet('exhibitA', '2', d.exhibitA, guessWidget(d.exhibitA.guess, d.ui || {}), d));
CF.defineSection('exhibitB', (d) => d.exhibitB && storySheet('exhibitB', '3', d.exhibitB, null, d));
CF.defineSection('exhibitC', (d) => d.exhibitC && storySheet('exhibitC', '4', d.exhibitC, lateWidget(d.exhibitC.late, d.ui || {}), d));

CF.defineSection('transition', (d) => {
  const x = d.transition;
  if (!x) return null;
  return CF.sheet('transition', '', 'transition-h', CF.heading('transition', x.heading), CF.prose(x.body));
});

CF.defineSection('person', (d) => {
  const x = d.person;
  if (!x) return null;
  return CF.sheet('person', '5', 'person-h', CF.heading('person', x.heading), CF.prose(x.body));
});

CF.defineSection('verdict', (d) => {
  const x = d.verdict;
  if (!x) return null;
  const site = d.site || {};
  return CF.sheet('verdict', '7', 'verdict-h', CF.heading('verdict', x.heading), CF.prose(x.body),
    h('div', { class: 'cta-row' },
      CF.interview(x.ctaInterview),
      CF.ext(x.ctaResume, site.resume),
      has(x.ctaEvidence) && d.evidence ? h('button', { class: 'btn', type: 'button', text: x.ctaEvidence, onclick: () => CF.openEvidence() }) : null),
    has(x.closing) ? h('p', { class: 'closing', text: x.closing }) : null);
});
