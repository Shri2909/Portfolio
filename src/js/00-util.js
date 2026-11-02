/* Case File No. 001: shared helpers. All files in src/js are concatenated in order by scripts/build.py. */
'use strict';
const CF = window.CF = window.CF || {};
const SVGNS = 'http://www.w3.org/2000/svg';

CF.reduced = false;
try { CF.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { CF.reduced = false; }

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
const has = (v) => typeof v === 'string' ? v.trim().length > 0 : Array.isArray(v) ? v.length > 0 : !!v;
const clamp01 = (x) => x < 0 ? 0 : x > 1 ? 1 : x;
const easeOut = (x) => 1 - Math.pow(1 - clamp01(x), 3);
const easeInOut = (x) => { x = clamp01(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };

/* localStorage that never throws. Everything must work without it. */
const store = {
  get(key, fallback) { try { const v = window.localStorage.getItem('cf1:' + key); return v === null ? fallback : JSON.parse(v); } catch (e) { return fallback; } },
  set(key, value) { try { window.localStorage.setItem('cf1:' + key, JSON.stringify(value)); return true; } catch (e) { return false; } },
};
CF.store = store;

/* Small inline icons (decorative: aria-hidden). */
CF.icon = function (name) {
  const a = { viewBox: '0 0 24 24', 'aria-hidden': 'true', focusable: 'false', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
  const paths = {
    magnifier: [s('circle', { cx: 10, cy: 10, r: 6 }), s('path', { d: 'M15 15 L21 21' })],
    chevron: [s('path', { d: 'M6 9 L12 15 L18 9' })],
    down: [s('path', { d: 'M12 5 L12 19 M6 13 L12 19 L18 13' })],
    menu: [s('path', { d: 'M4 7 H20 M4 12 H20 M4 17 H20' })],
  };
  return s('svg', a, paths[name] || []);
};
