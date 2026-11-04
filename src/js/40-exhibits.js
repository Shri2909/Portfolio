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
/* A lamp story in three levels. Level 1 is always visible (headline, short summary, the one capability). Level 2 is the complete story (opens on tap).
   Level 3 is for curious reviewers: repository link, files and the full receipt. */
function levelSummary(label, hint) {
  return h('summary', null, h('span', { class: 'lv-t' }, h('span', { class: 'lv-l', text: label }), has(hint) ? h('span', { class: 'lv-h', text: hint }) : null), CF.icon('chevron'));
}
function storySheet(id, tab, x, widget, d) {
  if (!x) return null;
  const ui = d.ui || {}, l1 = x.level1 || {};
  const ev = ((d.evidence && d.evidence.cases) || []).find((c) => c.id === (x.level3 && x.level3.case));
  const insp = ev && ev.inspect;
  const files = insp && (insp.files || []).length ? h('ul', { class: 'files' }, insp.files.map((f) => h('li', null, h('code', { text: f })))) : null;
  return CF.sheet(id, tab, id + '-h',
    CF.heading(id, x.heading),
    h('div', { class: 'level l1' },
      has(ui.level1) ? h('p', { class: 'label-brass', text: ui.level1 }) : null,
      has(x.title) ? h('p', { class: 'story-title', text: x.title }) : null,
      has(x.tagline) ? h('p', { class: 'story-tag', text: x.tagline }) : null,
      has(l1.summary) ? h('p', { class: 'l1-sum', text: l1.summary }) : null,
      has(l1.capability) ? h('div', { class: 'l1-cap' }, has(ui.capLabel) ? h('p', { class: 'label-brass', text: ui.capLabel }) : null, h('p', { class: 'l1-capt' }, CF.rich(l1.capability.replace(/^([^:]+:)/, '**$1**')))) : null),
    h('details', { class: 'level l2', id: id + '-l2' },
      levelSummary(ui.level2, ui.level2Hint),
      h('div', { class: 'lv-body' },
        CF.prose(x.body), widget,
        (x.reveals || []).length ? h('div', { class: 'reveals' }, has(x.revealsLabel) ? h('h3', { text: x.revealsLabel }) : null, h('ul', null, x.reveals.map((t) => h('li', null, CF.rich(t))))) : null,
        CF.prose([x.growth, x.note].filter(has), 'story-end'))),
    ev ? h('details', { class: 'level l3', id: id + '-l3' },
      levelSummary(ui.level3, ui.level3Sub),
      h('div', { class: 'lv-body' },
        insp ? h('div', { class: 'field' }, h('h3', { text: ui.repoLabel }), CF.ext(insp.label, insp.url, 'repo-link'), files, has(insp.note) ? h('p', { class: 'note', text: insp.note }) : null) : null,
        h('div', { class: 'cta-row' }, h('button', { class: 'btn', type: 'button', text: (x.level3 && x.level3.label) || ui.level3, onclick: () => CF.openEvidence(ev.id) })))) : null);
}
CF.defineSection('lamps', (d) => {
  const x = d.lamps;
  if (!x) return null;
  return h('section', { class: 'sheet intro-sheet', id: 'lamps', 'aria-labelledby': 'lamps-h' },
    h('h2', { class: 'sheet-title', id: 'lamps-h', text: x.step }), has(x.sub) ? h('p', { class: 'step-sub', text: x.sub }) : null);
});
CF.defineSection('exhibitA', (d) => d.exhibitA && storySheet('exhibitA', '2.1', d.exhibitA, guessWidget(d.exhibitA.guess, d.ui || {}), d));
CF.defineSection('exhibitB', (d) => d.exhibitB && storySheet('exhibitB', '2.2', d.exhibitB, null, d));
CF.defineSection('exhibitC', (d) => d.exhibitC && storySheet('exhibitC', '2.3', d.exhibitC, lateWidget(d.exhibitC.late, d.ui || {}), d));

CF.defineSection('transition', (d) => {
  const x = d.transition;
  if (!x) return null;
  return CF.sheet('transition', '', 'transition-h', CF.heading('transition', x.heading), CF.prose(x.body));
});

CF.defineSection('person', (d) => {
  const x = d.person;
  if (!x) return null;
  return CF.sheet('person', '01', 'person-h', CF.step(x), CF.heading('person', x.heading), CF.prose(x.body));
});

CF.defineSection('growth', (d) => {
  const x = d.growth;
  if (!x) return null;
  return CF.sheet('growth', '04', 'growth-h', CF.step(x), CF.heading('growth', x.heading), CF.prose(x.body),
    x.cta ? h('div', { class: 'cta-row' }, CF.receiptBtn(x.cta)) : null);
});

CF.defineSection('verdict', (d) => {
  const x = d.verdict;
  if (!x) return null;
  const site = d.site || {};
  const c = site.contact || {};
  return CF.sheet('verdict', '05', 'verdict-h', CF.step(x), CF.heading('verdict', x.heading), CF.prose(x.body),
    h('div', { class: 'cta-row' },
      CF.interview(x.ctaInterview),
      CF.ext(x.ctaResume, site.resume),
      CF.ext(x.ctaGithub, c.github),
      CF.ext(x.ctaLinkedin, c.linkedin),
      has(x.ctaEvidence) && d.evidence ? h('button', { class: 'btn', type: 'button', text: x.ctaEvidence, onclick: () => CF.openEvidence() }) : null),
    has(x.closing) ? h('p', { class: 'closing', text: x.closing }) : null);
});
