/* The 90-second read: a guided walk through the opening, Fair warning, Exhibit A, Exhibit B and the closing (hidden ones are skipped). About 15 s a stop, Esc leaves. */
CF.tour = (function () {
  let bar = null, idx = 0, timer = 0, ids = [], opener = null;
  const ui = () => (CF.data && CF.data.ui) || {};

  function stop() {
    clearTimeout(timer);
    if (bar) { bar.remove(); bar = null; }
    document.body.classList.remove('touring');
    CF.pageStrings && CF.pageStrings.clear();
    if (opener) opener.focus({ preventScroll: true });
  }
  function go(i, fromAuto) {
    idx = Math.max(0, Math.min(ids.length - 1, i));
    clearTimeout(timer);
    const el = document.getElementById(ids[idx]);
    CF.goTo(el, false);
    bar.querySelector('.tour-n').textContent = (idx + 1) + ' / ' + ids.length;
    bar.querySelector('.tour-t').textContent = CF.sectionLabel(ids[idx]);
    bar.querySelector('.tour-prev').disabled = idx === 0;
    const nextBtn = bar.querySelector('.tour-next');
    nextBtn.disabled = idx === ids.length - 1;
    const pb = bar.querySelector('.tour-bar');
    pb.classList.remove('run'); void pb.offsetWidth;
    if (!CF.reduced) {
      pb.classList.add('run');
      if (idx < ids.length - 1) timer = setTimeout(() => go(idx + 1, true), 15000);
    }
    const rail = document.getElementById('rail'); rail.classList.remove('tight'); void rail.offsetWidth; if (!CF.reduced) rail.classList.add('tight');
    const live = bar.querySelector('.sr-only'); live.textContent = 'Stop ' + (idx + 1) + ' of ' + ids.length + ': ' + CF.sectionLabel(ids[idx]);
  }
  function start(from) {
    ids = ['exhibit0', 'against', 'exhibitA', 'exhibitB', 'closing'].filter((id) => CF.visibleSections.includes(id));
    if (ids.length < 2 || bar) return;
    opener = from || null;
    bar = h('div', { class: 'tour', role: 'region', 'aria-label': ui().tour || '' },
      h('div', { class: 'tour-top' }, h('span', { class: 'tour-n' }), h('span', { class: 'tour-t' })),
      h('div', { class: 'tour-bar', 'aria-hidden': 'true' }, h('i')),
      h('div', { class: 'tour-btns' },
        h('button', { class: 'btn tour-prev', type: 'button', text: 'Back', onclick: () => go(idx - 1) }),
        h('button', { class: 'btn tour-next', type: 'button', text: 'Next', onclick: () => go(idx + 1) }),
        h('button', { class: 'btn tour-stop', type: 'button', text: 'Stop', onclick: stop })),
      h('span', { class: 'sr-only', 'aria-live': 'polite' }));
    bar.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.stopPropagation(); stop(); } });
    document.body.appendChild(bar);
    document.body.classList.add('touring');
    go(0);
    bar.querySelector('.tour-next').focus({ preventScroll: true });
  }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && bar) stop(); });
  return { start, stop, active: () => !!bar };
})();
