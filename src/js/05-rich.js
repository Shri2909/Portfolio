/* Small text helpers: **bold**, *italic* and `code` inline markup, paragraphs, buttons and links that the sections share. */
EK.rich = function (text) {
  const out = [];
  String(text == null ? '' : text).split(/(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|`[^`]+`)/).forEach((p) => {
    if (!p) return;
    if (p.startsWith('**') && p.endsWith('**') && p.length > 4) out.push(h('strong', { text: p.slice(2, -2) }));
    else if (p.startsWith('*') && p.endsWith('*') && p.length > 2) out.push(h('em', { text: p.slice(1, -1) }));
    else if (p.startsWith('*') && p.endsWith('*') && p.length > 2) out.push(h('em', { text: p.slice(1, -1) }));
    else if (p.startsWith('`') && p.endsWith('`') && p.length > 2) out.push(h('code', { text: p.slice(1, -1) }));
    else out.push(p);
  });
  return out;
};

/* Paragraphs from an array of strings. A paragraph that is one bold sentence becomes a pull line. */
EK.prose = function (arr, cls) {
  return h('div', { class: 'prose' + (cls ? ' ' + cls : '') }, (arr || []).filter(has).flatMap((t) => String(t).split(/\n\s*\n/)).map((t) =>
    h('p', { class: /^\*\*[^*]+\*\*$/.test(t.trim()) ? 'pull' : null }, t.split('\n').flatMap((ln, i) => (i ? [h('br'), ...EK.rich(ln)] : EK.rich(ln))))));
};

/* A section of the night page. */
EK.sheet = function (id, labelledby, ...kids) {
  return h('section', { class: 'panel', id, 'data-section': id, 'aria-labelledby': labelledby }, ...kids);
};

EK.heading = (id, text, cls) => h('h2', { class: 'panel-title' + (cls ? ' ' + cls : ''), id: id + '-h', text });
EK.kicker = (text) => has(text) ? h('p', { class: 'kicker', text }) : null;

/* External link that looks like a button. */
EK.ext = (label, url, cls) => has(label) && has(url) ? h('a', { class: cls || 'btn', href: url, target: '_blank', rel: 'noopener noreferrer', text: label }) : null;

/* The interview call to action goes to a real contact only. With no contact in the content, it renders nothing. */
EK.interview = function (label, cls) {
  const c = (EK.data && EK.data.site && EK.data.site.contact) || {};
  if (!has(label)) return null;
  if (has(c.email)) return h('a', { class: cls || 'btn primary', href: 'mailto:' + c.email, text: label });
  if (has(c.linkedin)) return EK.ext(label, c.linkedin, cls || 'btn primary');
  return null;
};

/* A button that opens a folder in the evidence drawer. */
EK.receiptBtn = (r, cls) => r && has(r.label) ? h('button', { class: cls || 'btn', type: 'button', text: r.label, onclick: () => EK.openEvidence(r.folder) }) : null;

EK.step = (x) => x && has(x.step) ? h('div', { class: 'step' }, h('p', { class: 'step-n', text: x.step }), has(x.sub) ? h('p', { class: 'step-sub', text: x.sub }) : null) : null;

/* Open a lamp's Level 2 (the complete story) and bring it into view. */
EK.openStory = function (id) {
  const det = document.getElementById(id + '-l2');
  if (!det) return;
  det.open = true;
  EK.goTo(det, false);
  const f = det.querySelector('summary');
  if (f) f.focus({ preventScroll: true });
};

/* Open a lamp's Level 2 (the complete story) and bring it into view. */
EK.openStory = function (id) {
  const det = document.getElementById(id + '-l2');
  if (!det) return;
  det.open = true;
  EK.goTo(det.closest('section') || det, false);
  const f = det.querySelector('summary');
  if (f) f.focus({ preventScroll: true });
};

/* The recruiter journey: a numbered step with a one-line description above a section heading. */
EK.step = (x) => x && has(x.step) ? h('div', { class: 'step' }, h('p', { class: 'step-n', text: x.step }), has(x.sub) ? h('p', { class: 'step-sub', text: x.sub }) : null) : null;
