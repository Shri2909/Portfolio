/* The evidence drawer: one folder per case, every status in plain text. */
CF.openEvidence = function (id) {
  const sec = document.getElementById('evidence');
  if (!sec) return;
  const det = id ? document.getElementById('ev-' + id) : null;
  if (det) det.open = true;
  CF.goTo(det || sec, false);
  const f = det ? det.querySelector('summary') : sec.querySelector('h2');
  if (f) { if (!f.hasAttribute('tabindex') && f.tagName !== 'SUMMARY') f.setAttribute('tabindex', '-1'); f.focus({ preventScroll: true }); }
};

function evField(label, text) {
  if (!has(text)) return null;
  return h('div', { class: 'field' }, h('h3', { text: label }), CF.prose([text]));
}

function evCase(c, d) {
  const ui = d.ui || {}, site = d.site || {}, L = c.labels || {};
  const insp = c.inspect;
  const files = insp && (insp.files || []).length ? h('ul', { class: 'files' }, insp.files.map((f) => h('li', null, h('code', { text: f })))) : null;
  return h('details', { class: 'case', id: 'ev-' + c.id },
    h('summary', null, h('span', { text: c.name }), CF.icon('chevron')),
    h('div', { class: 'case-body' },
      evField(L.purpose || ui.purpose, c.purpose),
      evField(L.finding || ui.finding, c.finding),
      evField(L.mine || ui.mine, c.mine),
      evField(L.results || ui.results, c.results),
      insp ? h('div', { class: 'field' }, h('h3', { text: ui.inspect }), CF.ext(insp.label, insp.url, 'repo-link'), files, has(insp.note) ? h('p', { class: 'note', text: insp.note }) : null) : null,
      (c.links || []).length ? h('div', { class: 'field' }, c.links.map((l) => CF.ext(l.label, site[l.key], 'repo-link'))) : null,
      (c.status || []).length ? h('div', { class: 'field' }, h('h3', { text: ui.status }),
        h('ul', { class: 'status' }, c.status.map(([code, what]) => h('li', null, h('span', { class: 'st', text: code }), ' ', what)))) : null,
      (c.more || []).length ? h('div', { class: 'field' }, h('h3', { text: L.more || ui.more }), h('ul', { class: 'morelist' }, c.more.map((t) => h('li', null, CF.rich(t))))) : null));
}

CF.defineSection('evidence', (d) => {
  const x = d.evidence;
  if (!x || !(x.cases || []).length) return null;
  const ui = d.ui || {};
  return CF.sheet('evidence', ui.navEvidence, 'evidence-h',
    CF.heading('evidence', ui.evidenceTitle || ''),
    has(ui.evidenceIntro) ? h('p', { class: 'sub', text: ui.evidenceIntro }) : null,
    h('div', { class: 'cases' }, x.cases.map((c) => evCase(c, d))));
});
