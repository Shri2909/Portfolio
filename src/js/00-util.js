/* Ek Diya Se Doosra: shared helpers. All files in src/js are concatenated in order by scripts/build.py. */
'use strict';
const EK = window.EK = window.EK || {};
const SVGNS = 'http://www.w3.org/2000/svg';

EK.reduced = false;
try { EK.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { EK.reduced = false; }

/* Tiny element builder. attrs: class, text, path (data-path for the review build), on* handlers, anything else is an attribute. */
function h(tag, attrs, ...kids) {
  const el = document.createElement(tag);
  fill(el, attrs, kids);
  return el;
}
function s(tag, attrs, ...kids) {
  const el = document.createElementNS(SVGNS, tag);
  fill(el, attrs, kids);
  return el;
}
function fill(el, attrs, kids) {
  if (attrs) {
    for (const k of Object.keys(attrs)) {
      const v = attrs[k];
      if (v === false || v === null || v === undefined) continue;
      if (k === 'class') el.setAttribute('class', v);
      else if (k === 'text') el.textContent = v;
      else if (k === 'path') el.setAttribute('data-path', v);
      else if (k.slice(0, 2) === 'on' && typeof v === 'function') el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    }
  }
  for (const kid of kids.flat(Infinity)) {
    if (kid === null || kid === undefined || kid === false) continue;
    el.appendChild(typeof kid === 'string' ? document.createTextNode(kid) : kid);
  }
}
/* Append children, skipping null/false (native append() would print the word "null"). */
function put(el, ...kids) { fill(el, null, kids); return el; }
const has = (v) => typeof v === 'string' ? v.trim().length > 0 : Array.isArray(v) ? v.length > 0 : !!v;
const clamp01 = (x) => x < 0 ? 0 : x > 1 ? 1 : x;
const easeOut = (x) => 1 - Math.pow(1 - clamp01(x), 3);
const easeInOut = (x) => { x = clamp01(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };

/* Small inline icons (decorative: aria-hidden). */
EK.icon = function (name) {
  const a = { viewBox: '0 0 24 24', 'aria-hidden': 'true', focusable: 'false', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
  const paths = {
    chevron: [s('path', { d: 'M6 9 L12 15 L18 9' })],
    down: [s('path', { d: 'M12 5 L12 19 M6 13 L12 19 L18 13' })],
    menu: [s('path', { d: 'M4 7 H20 M4 12 H20 M4 17 H20' })],
  };
  return s('svg', a, paths[name] || []);
};

/* Keep Tab inside a modal dialog (native dialogs already make the rest of the page inert; this stops focus escaping to browser chrome). */
EK.trapFocus = function (dlg) {
  dlg.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const f = [...dlg.querySelectorAll('button, a[href], input, [tabindex]:not([tabindex="-1"])')].filter((x) => !x.disabled && x.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === first || !dlg.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (document.activeElement === last || !dlg.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
  });
};

/* Scroll to a sheet and keep aiming: the page height can change under a smooth scroll (a story opens), so check again once it settles and correct if the target drifted. */
EK.goTo = function (el, focus) {
  if (!el) return;
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  const aim = () => el.scrollIntoView({ behavior: EK.reduced ? 'auto' : 'smooth', block: 'start' });
  aim();
  if (!EK.reduced) [900, 1900].forEach((ms) => setTimeout(() => { const top = el.getBoundingClientRect().top; if (Math.abs(top - parseFloat(getComputedStyle(el).scrollMarginTop || 0)) > 80) aim(); }, ms));
  if (focus !== false) el.focus({ preventScroll: true });
};
