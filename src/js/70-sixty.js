/* The 60-second file: a modal with the whole story in one read, linking to the same exhibits and drawer. Also opens from #sixty. */
CF.openSixty = function (opener) {
  const x = CF.data && CF.data.sixty;
  if (!x) return;
  let dlg = document.getElementById('sixty');
  if (!dlg) {
    const ui = CF.data.ui || {};
    dlg = h('dialog', { class: 'plain sixty', id: 'sixty', 'aria-labelledby': 'sixty-h' },
      h('div', { class: 'dlg-in' },
        h('p', { class: 'label-brass', text: x.label }),
        h('h2', { class: 'sixty-h', id: 'sixty-h', text: x.headline }),
        CF.prose(x.body),
        has(x.line) ? h('p', { class: 'pull', text: x.line }) : null,
        h('div', { class: 'cta-row' },
          x.ctaReceipt ? h('button', { class: 'btn primary', type: 'button', text: x.ctaReceipt.label, onclick: () => { dlg.close(); CF.openEvidence(x.ctaReceipt.case); } }) : null,
          CF.interview(x.ctaInterview, 'btn'),
          h('button', { class: 'btn', type: 'button', text: ui.close || 'Close', onclick: () => dlg.close() }))));
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('close', () => { const o = dlg._opener; if (o && o.focus) o.focus(); });
    CF.trapFocus(dlg);
    document.body.appendChild(dlg);
  }
  dlg._opener = opener || null;
  if (!dlg.open) dlg.showModal();
};
CF.onReady.push(() => { if (location.hash === '#sixty') CF.openSixty(null); });
