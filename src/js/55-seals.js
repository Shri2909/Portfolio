/* Chapter Seals: a folded note after each chapter with one question about what comes next. Never a claim. Tap or Enter goes to the next chapter. */
CF.makeSeal = function (chapter, target) {
  const ui = CF.data.ui || {};
  const go = () => {
    if (!target) return;
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.scrollIntoView({ behavior: CF.reduced ? 'auto' : 'smooth', block: 'start' });
    target.focus({ preventScroll: true });
  };
  const btn = h('button', { class: 'seal-btn', type: 'button', onclick: go },
    h('span', { class: 'sc-cue', text: ui.sealCue || '' }), h('span', { class: 'sc-q', text: chapter.teaser }), CF.icon('down'));
  const note = h('div', { class: 'seal-note', 'data-chapter': chapter.id }, h('i', { class: 'clip', 'aria-hidden': 'true' }), btn);
  if (CF.reduced || !window.IntersectionObserver) note.classList.add('unfolded');
  else {
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { note.classList.add('unfolded'); io.disconnect(); } }, { threshold: 0.5 });
    io.observe(note);
  }
  return note;
};
