/* Closing notes: three findings tied to their exhibits by red string, the closing line, dated open questions, YOUR MOVE, the case log. Then Exhibit Z. */
CF.defineSection('closing', function (d) {
  const ui = d.ui || {};
  const c = d.closing || {};
  const findings = (c.findings || []).filter((f) => has(f.title) || has(f.text)).slice(0, 3);
  const qs = (c.openQuestions || []).filter((q) => has(q.q) && has(q.a));
  const ct = c.contact || {};
  const contact = [['Email', ct.email, (v) => 'mailto:' + v], ['LinkedIn', ct.linkedin, (v) => v], ['GitHub', ct.github, (v) => v]].filter((x) => has(x[1]));
  const log = (d.caseLog || []).filter((e) => has(e.entry));
  if (!findings.length && !has(c.line) && !qs.length && !contact.length && !log.length) return null;

  const fcards = findings.map((f, i) => {
    const ids = (f.exhibits || []).filter((id) => CF.visibleSections.includes(id));
    const card = h('li', { class: 'find' });
    const body = [h('h3', { path: 'closing.findings.' + i + '.title', text: f.title || '' }), has(f.text) ? h('p', { path: 'closing.findings.' + i + '.text', text: f.text }) : null];
    if (ids.length) {
      const btn = h('button', { class: 'btn follow', type: 'button', 'aria-pressed': 'false' }, CF.icon('magnifier'), h('span', { text: ids.map((id) => CF.sectionLabel(id)).filter(has).join(' · ') }));
      btn.addEventListener('click', () => {
        const on = btn.getAttribute('aria-pressed') === 'true';
        document.querySelectorAll('.follow[aria-pressed="true"]').forEach((b) => b.setAttribute('aria-pressed', 'false'));
        CF.pageStrings.clear();
        document.querySelectorAll('.sheet.hl').forEach((e) => e.classList.remove('hl'));
        if (on) return;
        btn.setAttribute('aria-pressed', 'true');
        CF.pageStrings.draw(btn, ids, true);
        ids.forEach((id) => { const s2 = document.getElementById(id); if (s2) s2.classList.add('hl'); });
        setTimeout(() => document.querySelectorAll('.sheet.hl').forEach((e) => e.classList.remove('hl')), 3000);
      });
      body.push(btn);
    }
    put(card, ...body);
    return card;
  });

  const stamp = h('div', { class: 'cl-seal', 'aria-hidden': 'true' });
  stamp.innerHTML = CF.sealMarkup;
  CF.ex.whenVisible(stamp, (instant) => { stamp.classList.add('on'); if (!instant) stamp.classList.add('thud'); }, 0.6);

  const move = contact.length ? h('div', { class: 'yourmove' }, h('p', { class: 'ym-h', text: 'YOUR MOVE' }),
    h('ul', null, contact.map(([label, v, href]) => h('li', null, h('span', { class: 'label-brass', text: label }), ' ',
      h('span', { class: 'ym-v', text: v }), ' ', h('a', { class: 'repo-link', href: href(v), target: label === 'Email' ? undefined : '_blank', rel: 'noopener', text: 'Open' }))))) : null;

  return CF.sheet('closing', { title: ui.closingTitle, cls: 'closing' },
    fcards.length ? h('ul', { class: 'finds' }, fcards) : null,
    has(c.line) ? h('p', { class: 'cline', path: 'closing.line', text: c.line }) : null,
    qs.length ? h('ul', { class: 'oqs' }, qs.map((q, i) => h('li', { class: 'oq' }, h('p', { class: 'oq-q', path: 'closing.openQuestions.' + i + '.q', text: q.q }),
      h('p', { class: 'oq-a', path: 'closing.openQuestions.' + i + '.a', text: q.a }), has(q.date) ? h('p', { class: 'oq-d', text: 'Answer of ' + q.date }) : null))) : null,
    move,
    log.length ? h('ol', { class: 'caselog', 'aria-label': 'Case log' }, log.map((e) => h('li', null, h('span', { class: 'cl-d', text: e.date || '' }), ' ', h('span', { text: e.entry })))) : null,
    stamp);
});

/* Exhibit Z: which parts were spoken with Flow and which were written from sources. Flags are literal. */
CF.defineSection('exhibitZ', function (d) {
  const z = d.exhibitZ || {};
  const SEG = { S01: 'exhibit0', S02: 'brief', S03: 'against', S04: 'exhibitA', S06: 'exhibitB', S07: 'ledger', S08: 'effects', S09: 'decisions', S10: 'effects', S11: 'effects', S12: 'lab', S13: 'wispr', S14: 'closing' };
  const segs = (z.segments || []).filter((s2) => has(s2.label) && (!SEG[s2.id] || CF.visibleSections.includes(SEG[s2.id])));
  if (!has(z.statement) && !segs.length) return null;
  return CF.sheet('exhibitZ', { title: 'Exhibit Z', tab: 'Z', cls: 'exz' },
    has(z.statement) ? h('p', { class: 'z-st', text: z.statement }) : null,
    has(z.builtOn) ? h('p', { class: 'z-bo' }, h('span', { class: 'label-brass', text: 'Built on' }), ' ', z.builtOn) : null,
    h('ul', { class: 'zsegs' }, segs.map((s2) => h('li', { class: 'zseg' + (s2.spokenWithFlow === true ? ' flow' : '') },
      h('span', { class: 'zl', text: s2.label }), h('span', { class: 'ztag', text: s2.spokenWithFlow === true ? 'Spoken with Flow' : 'Written from sources' })))));
});
