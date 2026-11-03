// E1.1 grade layers, E1.3 hero objects, E1.4 depth additions. Everything is added at runtime as plain DOM tagged data-e="1",
// so V3 components stay untouched and stop() can remove it all. A MutationObserver (child lists only, rAF-debounced) covers
// parts React mounts later (lamp cards, resized toran).
import { mulberry32 } from '../lib/rand.js';
import { getState, subscribe } from '../lib/store.js';
import { shape } from '../components/Lamp.jsx';
import { marigoldMarkup } from './materials.js';

const NS = 'http://www.w3.org/2000/svg';
const q = (s, r = document) => r.querySelector(s), qa = (s, r = document) => Array.from(r.querySelectorAll(s));
const el = (tag, attrs = {}, svg = false) => { const n = svg ? document.createElementNS(NS, tag) : document.createElement(tag); for (const k in attrs) n.setAttribute(k, attrs[k]); n.setAttribute('data-e', '1'); return n; };
const html = (s) => { const t = document.createElement('template'); t.innerHTML = s.trim(); const n = t.content.firstChild; n.setAttribute && n.setAttribute('data-e', '1'); return n; };
const f = (n) => +n.toFixed(2);
let marigolds = null, mo = null, raf = 0, offStore = null, resizeT = 0, started = false;

function grade() {
  const stage = q('#stage'), v = q('#vignette'); if (!stage || q('#g-bloom')) return;
  ['g-bloom'].forEach((id) => stage.insertBefore(el('div', { id, class: 'grade', 'aria-hidden': 'true' }), v));
}

function lamp(div) {
  const n = +(/\bl(\d)\b/.exec(div.className) || [])[1];
  const svg = q('svg', div), g = svg && q('g', svg);
  if (!g || !(n in { 0: 1, 1: 1, 2: 1, 3: 1, 4: 1, 5: 1 })) { div.dataset.eArt = 'skip'; return; }
  div.dataset.eArt = '1';
  const S = shape(n), v = S.v, r = mulberry32(v.seed + 100), body = q('path[fill^="url"]', g), wick = q('.wick', g), defs = q('defs', svg);
  if (!body || !wick) return;
  // clay: a fourth, deeper stop for the underside
  const dark = q('.clay-dark-stop', svg); if (dark) { dark.setAttribute('offset', '.82'); const s = el('stop', { offset: '1', 'stop-color': '#3A1204' }, true); dark.after(s); }
  defs.append(
    html(`<radialGradient xmlns="${NS}" id="glow${n}" gradientUnits="userSpaceOnUse" cx="${S.wickTip[0]}" cy="${S.wickTip[1] + 6}" r="${f(S.rw * 0.8)}"><stop offset="0" stop-color="#FF7A1A" stop-opacity=".55"/><stop offset=".7" stop-color="#FF7A1A" stop-opacity="0"/></radialGradient>`),
    html(`<linearGradient xmlns="${NS}" id="wet${n}" gradientUnits="userSpaceOnUse" x1="${S.wickBase[0]}" y1="${S.wickBase[1]}" x2="${S.wickTip[0]}" y2="${S.wickTip[1]}"><stop offset="0" stop-color="#6A4A22"/><stop offset=".4" stop-color="#6A4A22" stop-opacity="0"/></linearGradient>`));
  // hand-turned throwing lines, glaze flecks and the fingerprint press
  let tl = ''; for (let k = 1; k <= 3; k++) { const y = S.y0 + S.bd * (0.3 + 0.2 * k), d = S.rw * (0.1 + 0.05 * k); tl += `M${f(S.xl + d)} ${f(y)}Q${S.cx} ${f(y + S.bd * 0.16)} ${f(S.xr - d)} ${f(y)}`; }
  const pt = () => `M${f(S.xl + 6 + r() * (S.rw - 12))} ${f(S.y0 + 7 + r() * (S.bd - 12))}h.01`;
  const cream = Array.from({ length: 4 }, pt).join(''), darkf = Array.from({ length: 3 }, pt).join('');
  const add = [el('path', { class: 'e-throw', d: tl, 'clip-path': `url(#bowl${n})` }, true)];
  if (n === 1) add.push(el('ellipse', { class: 'e-dent', cx: f(S.xl + 4), cy: f(S.y0 + 1), rx: 3.2, ry: 2 }, true));
  add.push(el('path', { class: 'e-fleck-c', d: cream }, true), el('path', { class: 'e-fleck-d', d: darkf }, true),
    el('path', { class: 'e-glow', d: S.body, fill: `url(#glow${n})`, 'clip-path': `url(#bowl${n})` }, true),
    el('path', { class: 'e-rim', d: `M${f(S.xr - 12)} ${f(S.y0 + 6.8)}Q${f(S.xr - 3)} ${f(S.y0 + 5)} ${f(S.xr)} ${S.y0}` }, true));
  body.after(...add);
  // cotton wick: base, twist, wet lower part, loose fibres, ember
  const wd = wick.getAttribute('d'), tx = S.wickTip[0], ty = S.wickTip[1];
  wick.after(el('path', { class: 'e-twist', d: wd }, true), el('path', { class: 'e-wet', d: wd, stroke: `url(#wet${n})` }, true),
    el('path', { class: 'e-fibre', d: `M${tx} ${ty}l-2 -2.4M${tx} ${ty}l1.6 -2.6` }, true));
  const ch = q('.wick-char', g); (ch || wick).after(el('circle', { class: 'e-ember', cx: tx, cy: ty, r: 1.1 }, true));
}

function windows() {
  qa('#skyline .lay.near .win:not([data-e-art])').forEach((w) => {
    w.dataset.eArt = '1';
    const p = q('.pane', w); if (!p) return;
    const x = +p.getAttribute('x'), y = +p.getAttribute('y'), ww = +p.getAttribute('width'), h = +p.getAttribute('height'), near = !!w.closest('.near');
    const cx = x + ww / 2, cy = y + h / 2, i = Math.round(x + y);
    const add = [el('path', { class: 'mull', d: `M${f(cx)} ${y}v${h}M${x} ${f(cy)}h${ww}` }, true)];
    p.after(...add);
  });
}

function depth() {
  const sky = q('#skyline'), ter = q('#terrace'); if (!sky || !ter) return;
  if (!q('.skyline-mist', sky)) sky.append(el('div', { class: 'skyline-mist', 'aria-hidden': 'true' }));
  qa('#skyline .lay.near > g').forEach((g) => {
    if (g.dataset.eRim) return; g.dataset.eRim = '1';
    const r0 = q(':scope > rect', g); if (!r0) return;
    const x = +r0.getAttribute('x'), w = +r0.getAttribute('width');
    g.append(el('rect', { class: 'rim', x: x + w / 2 < 600 ? f(x + w - 2) : f(x), y: r0.getAttribute('y'), width: 2, height: r0.getAttribute('height') }, true));
  });
  if (!q('#bokeh', ter)) {
    const r = mulberry32(5), b = el('div', { id: 'bokeh', 'aria-hidden': 'true' });
    const spots = [[2, 4], [14, 2], [86, 3], [96, 14], [4, 62], [78, 1], [30, 0]];
    spots.forEach(([lx, by], k) => { const d = Math.round(38 + r() * 72), i = document.createElement('i'); i.style.cssText = `width:${d}px;height:${d}px;left:calc(${lx}% - ${d / 2}px);bottom:${by}%;--bk:${k % 2 ? 'var(--a-fill, #6E86C8)' : 'var(--a-key, #FFB347)'}`; i.setAttribute('data-e', '1'); b.append(i); });
    ter.append(b);
  }
  const fl = q('.floor', ter);
  if (fl && !q('.joints', fl)) {
    const xs = [0, 12, 25, 37, 50, 62, 75, 88, 100], ys = [6, 16, 32, 58, 82];
    const lines = xs.map((x) => `M50 0L${x} 100`).join('') + ys.map((y) => `M0 ${y}H100`).join('');
    fl.append(html(`<svg xmlns="${NS}" class="joints" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="${lines}" fill="none" stroke="rgba(0,0,0,.28)" stroke-width="1" vector-effect="non-scaling-stroke"/><path d="${lines}" transform="translate(0 .6)" fill="none" stroke="rgba(255,243,220,.05)" stroke-width="1" vector-effect="non-scaling-stroke"/></svg>`));
  }
}

// marigolds are rasterised once into three tiny PNG data URLs (svg -> canvas), then drawn as <image>: cheap on every swing frame
function marigoldImages() {
  if (marigolds) return marigolds;
  marigolds = Promise.all([0, 1, 2].map((k) => new Promise((res) => {
    const im = new Image(); im.onload = () => { try { const c = document.createElement('canvas'); c.width = c.height = 64; c.getContext('2d').drawImage(im, 0, 0, 64, 64); res(c.toDataURL('image/png')); } catch { res(null); } };
    im.onerror = () => res(null); im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(marigoldMarkup(k));
  })));
  marigolds.then(queue);
  return marigolds;
}
let marigoldUrls = null;
function toran() {
  const t = q('.toran'); if (!t) return;
  if (!marigoldUrls) { marigoldImages().then((u) => { if (u.every(Boolean)) { marigoldUrls = u; queue(); } }); return; }
  const flowers = qa('.strand > g', t).filter((g) => g.children.length === 2 && g.firstElementChild.tagName === 'circle');
  if (!flowers.length || t.dataset.eN === String(flowers.length)) return;
  qa('[data-e]', t).forEach((n) => n.remove()); qa('.e-flat', t).forEach((n) => n.classList.remove('e-flat'));
  t.dataset.eN = String(flowers.length);
  const pickN = Math.min(14, flowers.length), step = flowers.length / pickN;
  for (let k = 0; k < pickN; k++) {
    const fg = flowers[Math.floor(k * step)], c = fg.firstElementChild;
    fg.classList.add('e-flat');
    const use = el('image', { href: marigoldUrls[k % 3], x: f(+c.getAttribute('cx') - 9), y: f(+c.getAttribute('cy') - 9), width: 18, height: 18, class: 'e-mari' }, true);
    fg.after(use);
  }
  qa('.strand', t).forEach((s) => { const m = /M([\d.]+) ([\d.]+)v([\d.]+)/.exec((q('path', s) || {}).getAttribute?.('d') || ''); if (m) s.append(el('path', { class: 'e-leafvein', d: `M${m[1]} ${+m[2] + +m[3] + 1}V${+m[2] + +m[3] + 15}` }, true)); });
}

function numerals() {
  const h = q('#night-h'); if (!h || h.dataset.eNum) return; h.dataset.eNum = '1';
  const w = document.createTreeWalker(h, NodeFilter.SHOW_TEXT), hits = [];
  for (let n = w.nextNode(); n; n = w.nextNode()) if (/\b(324|19)\b/.test(n.nodeValue)) hits.push(n);
  hits.forEach((n) => { const frag = document.createDocumentFragment(); n.nodeValue.split(/\b(324|19)\b/).forEach((p) => { if (p === '324' || p === '19') { const s = el('span', { class: 'num' }); s.textContent = p; frag.append(s); } else if (p) frag.append(document.createTextNode(p)); }); n.replaceWith(frag); });
}

function scan() {
  raf = 0;
  grade(); depth(); toran(); windows(); numerals();
  qa('.lamp:not([data-e-art])').forEach(lamp);
}
const queue = () => { if (!raf) raf = requestAnimationFrame(scan); };

export function start() {
  if (started) return; started = true;
  const root = document.documentElement;
  const lit = () => { if (getState().litCount > 0) root.setAttribute('data-lit', '1'); else root.removeAttribute('data-lit'); };
  lit(); offStore = subscribe(lit);
  scan();
  mo = new MutationObserver(queue); mo.observe(document.body, { childList: true, subtree: true });
  addEventListener('resize', onResize);
}
function onResize() { clearTimeout(resizeT); resizeT = setTimeout(() => { const t = q('.toran'); t && delete t.dataset.eN; queue(); }, 300); }
export function stop() {
  started = false;
  mo && mo.disconnect(); mo = null; cancelAnimationFrame(raf); raf = 0; offStore && offStore(); offStore = null; clearTimeout(resizeT);
  removeEventListener('resize', onResize);
  document.documentElement.removeAttribute('data-lit');
  qa('[data-e]').forEach((n) => { if (n.classList && n.classList.contains('num')) n.replaceWith(document.createTextNode(n.textContent)); else n.remove(); });
  qa('.e-flat').forEach((n) => n.classList.remove('e-flat'));
  qa('[data-e-art], [data-e-rim], [data-e-n], [data-e-num]').forEach((n) => { delete n.dataset.eArt; delete n.dataset.eRim; delete n.dataset.eN; delete n.dataset.eNum; });
  const d = q('.clay-dark-stop'); qa('.clay-dark-stop').forEach((s) => s.setAttribute('offset', '1'));
}
