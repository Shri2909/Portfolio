/* Field notes on Wispr: numbered evidence tags, each opening a three-step stepper (observation, what it suggests, first test). Empty steps are hidden. */
CF.defineSection('wispr', function (d) {
  const ui = d.ui || {};
  const w = d.wispr || {};
  const moments = (w.moments || []).filter((m) => has(m.fact));
  if (!moments.length) return null;
  const panelBox = h('div', { class: 'wpanel', 'aria-live': 'polite' });
  const tags = [];

  function bars(m) {
    const list = (m.bars || []).filter((b) => has(b.label) && isFinite(b.value));
    if (!list.length) return null;
    const max = 20; // one scale for both bars, 0 to 20 percent
    const wrap = h('div', { class: 'wbars', role: 'img', 'aria-label': list.map((b) => b.label + ': about ' + b.value + '%').join('. ') },
      list.map((b, i) => h('div', { class: 'wbar' }, h('p', { class: 'wl', text: b.label + ': about ' + b.value + '%' }),
        h('div', { class: 'wtrack' }, h('i', { class: 'wfill', style: '--w:' + Math.min(100, (b.value / max) * 100) + '%;--i:' + i })))),
      h('p', { class: 'wcap', text: 'Sensor Tower via TechCrunch. Web billing may explain part of the gap.' }));
    CF.ex.whenVisible(wrap, () => wrap.classList.add('go'), 0.5);
    return wrap;
  }

  function show(m, i, tag) {
    const same = tag.getAttribute('aria-expanded') === 'true';
    tags.forEach((t) => t.setAttribute('aria-expanded', 'false'));
    panelBox.textContent = '';
    if (same) return;
    tag.setAttribute('aria-expanded', 'true');
    const steps = [
      { k: 'obs', label: 'Observation', node: h('div', null,
        h('p', { class: 'wfact', path: 'wispr.moments.' + i + '.fact', text: m.fact }),
        h('p', { class: 'wsrc' }, [m.source, m.date].filter(has).join(', ')),
        has(m.url) ? h('p', null, h('a', { class: 'repo-link', href: m.url, target: '_blank', rel: 'noopener', text: m.url })) : null,
        bars(m)) },
      has(m.suggests) ? { k: 'sug', label: 'What it suggests', node: h('p', { class: 'wtxt', path: 'wispr.moments.' + i + '.suggests', text: m.suggests }) } : null,
      has(m.firstTest) ? { k: 'test', label: 'First test', node: h('p', { class: 'wtxt', path: 'wispr.moments.' + i + '.firstTest', text: m.firstTest }) } : null,
    ].filter(Boolean);
    const body = h('div', { class: 'wstep' });
    const nav = steps.length > 1 ? h('div', { class: 'wnav', role: 'group', 'aria-label': 'Steps' }) : null;
    const go = (j) => {
      body.textContent = ''; body.appendChild(steps[j].node);
      if (nav) [...nav.children].forEach((b, k) => b.setAttribute('aria-pressed', String(k === j)));
    };
    if (nav) steps.forEach((st, j) => nav.appendChild(h('button', { class: 'wstepbtn', type: 'button', 'aria-pressed': 'false', onclick: () => go(j) }, h('b', { text: String(j + 1) }), h('span', { text: st.label }))));
    else if (steps.length === 1) body.dataset.single = 'true';
    put(panelBox, h('div', { class: 'wcard' }, nav ? nav : h('p', { class: 'label-brass', text: steps[0].label }), body));
    go(0);
  }

  const list = h('ol', { class: 'wtags' }, moments.map((m, i) => {
    const t = h('button', { class: 'wtag', type: 'button', 'aria-expanded': 'false' }, h('b', { class: 'wn', text: String(i + 1) }), h('span', { text: m.title || m.source || '' }));
    t.addEventListener('click', () => show(m, i, t));
    tags.push(t);
    return h('li', null, t);
  }));
  const pov = w.pov && has(w.pov.text) ? h('aside', { class: 'pov' }, h('span', { class: 'stamp pov-s', text: 'HYPOTHESIS: NOT A RESULT' }), h('p', { path: 'wispr.pov.text', text: w.pov.text })) : null;
  return CF.sheet('wispr', { title: ui.wisprTitle, cls: 'wispr' }, list, panelBox, pov);
});
