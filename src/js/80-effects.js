/* Beyond the code (Roots): intro, a red-string timeline, evidence bags, one quiet philosophy card. Renders only with items or at least two timeline events. */
CF.defineSection('effects', function (d) {
  const ui = d.ui || {};
  const e = d.effects || {};
  const items = (e.items || []).filter((i) => has(i.title));
  const tl = (e.timeline || []).filter((t) => has(t.label) || has(t.text));
  if (!items.length && tl.length < 2) return null;

  const TAGS = { document: 'DOCUMENT', link: 'LINK', 'self-reported': 'SELF-REPORTED' };
  const detail = h('div', { class: 'bag-detail', 'aria-live': 'polite' });
  const bags = items.map((it, i) => {
    const self = it.tag === 'self-reported';
    const b = h('button', { class: 'bag' + (self ? ' self' : ''), type: 'button', 'aria-expanded': 'false', 'data-i': String(i) },
      h('span', { class: 'bag-l', text: it.title }), h('span', { class: 'stamp bag-s' + (self ? ' dashed' : ''), 'aria-hidden': 'true', text: TAGS[it.tag] || String(it.tag || '').toUpperCase() }),
      h('span', { class: 'sr-only', text: TAGS[it.tag] || it.tag || '' }));
    b.addEventListener('click', () => {
      const same = b.getAttribute('aria-expanded') === 'true';
      bags.forEach((x) => x.setAttribute('aria-expanded', 'false'));
      detail.textContent = '';
      if (same) return;
      b.setAttribute('aria-expanded', 'true');
      put(detail, h('div', { class: 'slipcard' }, h('h3', { text: it.title }),
        has(it.note) ? h('p', { path: 'effects.items.' + i + '.note', text: it.note }) : null,
        // a PDF or link opens in a new tab; a missing file never blocks anything
        has(it.file) ? h('p', null, h('a', { class: 'repo-link', href: it.file, target: '_blank', rel: 'noopener', text: 'Open the document' })) : null,
        has(it.url) ? h('p', null, h('a', { class: 'repo-link', href: it.url, target: '_blank', rel: 'noopener', text: it.url })) : null));
    });
    return b;
  });
  const intro = has(e.intro) ? e.intro.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean).map((p) => h('p', { class: 'intro-p', path: 'effects.intro', text: p })) : null;
  const phil = e.philosophy && has(e.philosophy.text)
    ? h('aside', { class: 'philo' }, e.philosophy.text.split(/\n\s*\n/).map((p) => h('p', { path: 'effects.philosophy.text', text: p.trim() }))) : null;
  return CF.sheet('effects', { title: ui.effectsTitle, cls: 'effects' },
    intro, tl.length >= 2 ? CF.ex.timeline(tl, 'effects') : null,
    bags.length ? h('div', { class: 'bags' }, bags) : null, bags.length ? detail : null, phil);
});
