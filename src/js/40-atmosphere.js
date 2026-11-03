/* The cosy desk: lamp that follows a pointer or finger or focus, dust motes, desk props, tea, small slips, pencil marginalia.
   Everything decorative is aria-hidden and pointer-events:none (the teacup and the coffee ring are real buttons). Transform and opacity only. */
CF.slip = (function () {
  let el = null, timer = 0;
  return function (text, ms) {
    if (!has(text)) return;
    if (!el) { el = h('div', { class: 'slip', role: 'status', 'aria-live': 'polite' }); document.body.appendChild(el); }
    el.textContent = text;
    el.classList.remove('show'); void el.offsetWidth; el.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(() => el.classList.remove('show'), ms || 4000);
  };
})();

/* A pencil note in a sheet margin: only ever a source line that already exists in content. */
CF.pencil = function (text, extraClass) {
  return has(text) ? h('p', { class: 'pencil ' + (extraClass || ''), 'aria-hidden': 'true', text }) : null;
};

CF.atmosphere = (function () {
  const ui = () => (CF.data && CF.data.ui) || {};
  const glow = document.querySelector('.lamp-glow');
  const lamp = document.querySelector('.lamp');
  let tx = window.innerWidth / 2, ty = window.innerHeight * 0.14, cx = tx, cy = ty, raf = 0;
  let ptr = null; // last real pointer/finger position (viewport px), drives the pencil notes
  let lit = new Set();

  function draw() {
    cx += (tx - cx) * 0.14; cy += (ty - cy) * 0.14;
    const done = Math.abs(tx - cx) < 0.5 && Math.abs(ty - cy) < 0.5;
    if (done) { cx = tx; cy = ty; }
    glow.style.transform = 'translate3d(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px,0)';
    updateNotes(cx, cy);
    raf = done ? 0 : requestAnimationFrame(draw);
  }
  function moveLamp(x, y) {
    if (CF.reduced) { updateNotes(x, y); return; } // static, centred lamp; notes still answer to the pointer
    tx = x; ty = y;
    if (!raf) raf = requestAnimationFrame(draw);
  }

  /* pencil notes light up inside the lamp circle (or when focus is inside their sheet) */
  function updateNotes(x, y) {
    const r = 150;
    document.querySelectorAll('.pencil').forEach((n) => {
      const b = n.getBoundingClientRect();
      const dx = Math.max(b.left - x, 0, x - b.right), dy = Math.max(b.top - y, 0, y - b.bottom);
      const on = Math.hypot(dx, dy) < r || n.closest('.sheet, .dossier').classList.contains('lit-sheet');
      n.classList.toggle('lit', on);
    });
  }

  function buildMotes() {
    const box = document.querySelector('.motes');
    if (CF.reduced || !box) return;
    let seed = 7;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    for (let i = 0; i < 14; i++) {
      const m = h('i', { class: 'mote' });
      const s = 2 + Math.round(rnd() * 2);
      m.style.cssText = 'left:' + (8 + rnd() * 84).toFixed(1) + '%;top:' + (6 + rnd() * 70).toFixed(1) + '%;width:' + s + 'px;height:' + s + 'px;' +
        '--dx:' + (-30 + rnd() * 60).toFixed(0) + 'px;--dy:' + (-40 - rnd() * 60).toFixed(0) + 'px;animation-duration:' + (20 + rnd() * 18).toFixed(1) + 's;animation-delay:-' + (rnd() * 20).toFixed(1) + 's';
      box.appendChild(m);
    }
    document.addEventListener('visibilitychange', () => box.classList.toggle('paused', document.hidden));
  }

  /* desk props (inline SVG, decorative, only at wide viewports via CSS) */
  const PROPS_L =
    '<svg class="p-lamp" viewBox="0 0 150 190" focusable="false"><defs><linearGradient id="pbr" x1="0" x2="1"><stop offset="0" stop-color="#8a5e12"/><stop offset=".5" stop-color="#e2be6a"/><stop offset="1" stop-color="#7a5714"/></linearGradient>' +
    '<linearGradient id="pgl" x1="0" x2="1"><stop offset="0" stop-color="#14402a"/><stop offset=".45" stop-color="#2f7a52"/><stop offset="1" stop-color="#15402b"/></linearGradient></defs>' +
    '<ellipse cx="75" cy="180" rx="46" ry="8" fill="rgba(0,0,0,.35)"/><path d="M38 178 Q40 160 75 158 Q110 160 112 178 Z" fill="url(#pbr)"/>' +
    '<rect x="70" y="84" width="10" height="76" rx="3" fill="url(#pbr)"/><path d="M14 74 Q75 4 136 74 L124 90 Q75 52 26 90 Z" fill="url(#pgl)"/>' +
    '<path d="M32 62 Q75 22 118 62" fill="none" stroke="rgba(255,255,255,.28)" stroke-width="3" stroke-linecap="round"/><rect x="66" y="80" width="18" height="8" rx="3" fill="url(#pbr)"/>' +
    '<path d="M118 84 q8 8 6 22" fill="none" stroke="#c9a24a" stroke-width="2"/><circle cx="124" cy="108" r="3" fill="#e2be6a"/></svg>';
  const TEACUP =
    '<svg viewBox="0 0 130 110" focusable="false"><ellipse cx="65" cy="100" rx="56" ry="8" fill="rgba(0,0,0,.3)"/><ellipse cx="65" cy="94" rx="54" ry="9" fill="#efe6cf" stroke="#c9b98f"/>' +
    '<path d="M28 52 H102 Q102 90 65 90 Q28 90 28 52 Z" fill="#f6f0e3" stroke="#c9b98f" stroke-width="1.5"/><ellipse cx="65" cy="52" rx="37" ry="7" fill="#7a4a22"/>' +
    '<path d="M102 58 Q126 56 120 74 Q115 82 100 78" fill="none" stroke="#c9b98f" stroke-width="5" stroke-linecap="round"/>' +
    '<g class="steam" fill="none" stroke="rgba(246,240,227,.55)" stroke-width="3" stroke-linecap="round"><path d="M52 40 q-8 -10 0 -18 q8 -8 0 -16"/><path d="M68 40 q-8 -10 0 -18 q8 -8 0 -16"/><path d="M84 40 q-8 -10 0 -18 q8 -8 0 -16"/></g></svg>';
  const PROPS_R =
    '<svg class="p-mag" viewBox="0 0 130 150" focusable="false"><defs><linearGradient id="pbr2" x1="0" x2="1"><stop offset="0" stop-color="#8a5e12"/><stop offset=".5" stop-color="#e2be6a"/><stop offset="1" stop-color="#7a5714"/></linearGradient></defs>' +
    '<rect x="68" y="78" width="14" height="62" rx="6" transform="rotate(-35 75 100)" fill="#4a2c14"/><circle cx="52" cy="52" r="34" fill="rgba(255,255,255,.1)" stroke="url(#pbr2)" stroke-width="9"/>' +
    '<path d="M32 40 Q42 26 58 28" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="4" stroke-linecap="round"/></svg>' +
    '<svg class="p-pens" viewBox="0 0 150 60" focusable="false"><g transform="rotate(-8 75 30)"><rect x="6" y="12" width="124" height="11" rx="2" fill="#e0a82e"/><path d="M130 12 L148 17.5 L130 23 Z" fill="#e8d3a0"/><path d="M142 15.5 L148 17.5 L142 19.5 Z" fill="#3a3a3a"/><rect x="6" y="12" width="10" height="11" rx="2" fill="#b4472e"/></g>' +
    '<g transform="rotate(5 75 44)"><rect x="12" y="38" width="118" height="10" rx="2" fill="#2f5d8a"/><path d="M130 38 L146 43 L130 48 Z" fill="#e8d3a0"/><path d="M141 41.5 L146 43 L141 44.5 Z" fill="#3a3a3a"/><rect x="12" y="38" width="9" height="10" rx="2" fill="#c9c9c9"/></g></svg>' +
    '<svg class="p-book" viewBox="0 0 130 110" focusable="false"><rect x="14" y="10" width="98" height="92" rx="5" fill="#5b2a1e"/><rect x="14" y="10" width="14" height="92" rx="4" fill="#44201a"/>' +
    '<rect x="32" y="22" width="68" height="60" rx="3" fill="none" stroke="rgba(226,190,106,.5)" stroke-width="2"/><rect x="104" y="46" width="14" height="22" rx="3" fill="#e2be6a" stroke="#8a5e12"/><circle cx="111" cy="57" r="3" fill="#8a5e12"/></svg>';

  function buildProps(page) {
    const l = h('div', { class: 'props-l', 'aria-hidden': 'true' });
    l.innerHTML = PROPS_L;
    const cup = h('button', { class: 'teacup', type: 'button', 'aria-label': 'Teacup' });
    cup.innerHTML = TEACUP;
    cup.addEventListener('click', () => {
      cup.classList.remove('puff'); void cup.offsetWidth; if (!CF.reduced) cup.classList.add('puff');
      CF.slip(ui().teaSlip, 4000);
    });
    const r = h('div', { class: 'props-r', 'aria-hidden': 'true' });
    r.innerHTML = PROPS_R;
    // the teacup is a real button, so it lives outside the aria-hidden groups
    page.insertBefore(h('div', { class: 'props' }, l, h('div', { class: 'props-l-btn' }, cup), r), document.getElementById('topbar').nextSibling);
  }

  function eggs() {
    let buf = '';
    document.addEventListener('keydown', (e) => {
      const t = e.target;
      if (t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable)) return;
      if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) return;
      buf = (buf + e.key.toLowerCase()).slice(-10);
      if (buf.endsWith('elementary')) {
        buf = '';
        if (!CF.reduced) { lamp.classList.remove('flicker'); void lamp.offsetWidth; lamp.classList.add('flicker'); }
        CF.slip(ui().elementary, 4000);
      }
    });
  }

  function init() {
    window.addEventListener('pointermove', (e) => { ptr = [e.clientX, e.clientY]; moveLamp(e.clientX, e.clientY); }, { passive: true });
    window.addEventListener('touchmove', (e) => { const t = e.touches[0]; if (t) { ptr = [t.clientX, t.clientY]; moveLamp(t.clientX, t.clientY); } }, { passive: true });
    window.addEventListener('scroll', () => { if (ptr) updateNotes(ptr[0], ptr[1]); else updateNotes(cx, cy); }, { passive: true });
    document.addEventListener('focusin', (e) => {
      const el = e.target; if (!el.getBoundingClientRect) return;
      const b = el.getBoundingClientRect();
      moveLamp(b.left + b.width / 2, b.top + b.height / 2);
      const sheet = el.closest('.sheet, .dossier'); document.querySelectorAll('.lit-sheet').forEach((s) => s.classList.remove('lit-sheet'));
      if (sheet) sheet.classList.add('lit-sheet');
      updateNotes(cx, cy);
    });
    document.addEventListener('focusout', () => { document.querySelectorAll('.lit-sheet').forEach((s) => s.classList.remove('lit-sheet')); });
    buildMotes();
    buildProps(document.getElementById('page'));
    eggs();
    updateNotes(cx, cy);
  }
  return { init, refresh: () => updateNotes(cx, cy) };
})();
