// E1.2 procedural material kit: four seamless tiles painted once at idle (no image files, data URLs only, nothing stored),
// plus the inline SVG defs (marigold and petal symbols) and the grain and dust layers inside #stage.
import { mulberry32 } from '../lib/rand.js';
import { getState } from '../lib/store.js';

const NS = 'http://www.w3.org/2000/svg';
let made = [], idleId = 0, done = false;

// run fn at (x, y) and again at the wrapped offsets whenever the shape is within `m` px of an edge: the tile is seamless
function wrap(size, x, y, m, fn) {
  const xs = [0], ys = [0];
  if (x < m) xs.push(size); if (x > size - m) xs.push(-size);
  if (y < m) ys.push(size); if (y > size - m) ys.push(-size);
  for (const dx of xs) for (const dy of ys) fn(x + dx, y + dy);
}
const tile = (size) => { const c = document.createElement('canvas'); c.width = c.height = size; return [c, c.getContext('2d')]; };
const gauss = (r) => Math.sqrt(-2 * Math.log(r() || 1e-9)) * Math.cos(2 * Math.PI * r());
const url = (c) => `url(${c.toDataURL('image/png')})`;

function grain(r) {
  const [c, g] = tile(128), im = g.createImageData(128, 128);
  for (let i = 0; i < im.data.length; i += 4) { const v = Math.max(0, Math.min(255, 128 + gauss(r) * 38)); im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
  g.putImageData(im, 0, 0); return url(c);
}
function fibre(r, S = 256, scale = 1) {
  const [c, g] = tile(S); g.lineCap = 'round';
  for (let i = 0; i < 260 * scale * scale; i++) {
    const x = r() * S, y = r() * S, a = r() * Math.PI * 2, len = 5 + r() * 19, bend = (r() - 0.5) * len * 0.8;
    g.strokeStyle = r() < 0.65 ? `rgba(110,80,40,${(0.05 + r() * 0.09).toFixed(3)})` : 'rgba(255,248,230,.18)'; g.lineWidth = 0.5 + r() * 0.4;
    wrap(S, x, y, 24, (px, py) => { g.beginPath(); g.moveTo(px, py); g.quadraticCurveTo(px + Math.cos(a) * len / 2 - Math.sin(a) * bend, py + Math.sin(a) * len / 2 + Math.cos(a) * bend, px + Math.cos(a) * len, py + Math.sin(a) * len); g.stroke(); });
  }
  g.fillStyle = 'rgba(70,45,20,.35)';
  for (let i = 0; i < 14; i++) { const x = r() * S, y = r() * S, s = 1 + r() * 0.6; wrap(S, x, y, 24, (px, py) => g.fillRect(px, py, s, s)); }
  return url(c);
}
function grit(r, S = 192) {
  const [c, g] = tile(S);
  for (let i = 0; i < 40; i++) { const x = r() * S, y = r() * S, rad = 20 + r() * 28; wrap(S, x, y, 50, (px, py) => { const gr = g.createRadialGradient(px, py, 0, px, py, rad); gr.addColorStop(0, `rgba(255,230,190,${(0.03 + r() * 0.0).toFixed(3)})`); gr.addColorStop(1, 'rgba(255,230,190,0)'); g.fillStyle = gr; g.beginPath(); g.arc(px, py, rad, 0, 7); g.fill(); }); }
  for (let i = 0; i < 1400; i++) { const x = r() * S, y = r() * S, rad = 0.4 + r() * 0.9; g.fillStyle = i % 2 ? 'rgba(255,230,190,.10)' : 'rgba(0,0,0,.22)'; wrap(S, x, y, 4, (px, py) => { g.beginPath(); g.arc(px, py, rad, 0, 7); g.fill(); }); }
  for (let i = 0; i < 6; i++) { const x = r() * S, y = r() * S, rad = 1.8 + r() * 1.2; wrap(S, x, y, 5, (px, py) => { g.fillStyle = 'rgba(0,0,0,.3)'; g.beginPath(); g.arc(px, py, rad, 0, 7); g.fill(); g.fillStyle = 'rgba(255,235,200,.35)'; g.fillRect(px - rad * 0.5, py - rad * 0.7, 1, 1); }); }
  return url(c);
}
function dust(r) {
  const S = 320, [c, g] = tile(S);
  g.fillStyle = 'rgba(255,243,220,.25)';
  for (let i = 0; i < 22; i++) { const x = r() * S, y = r() * S, rad = 0.6 + r() * 1; wrap(S, x, y, 4, (px, py) => { g.beginPath(); g.arc(px, py, rad, 0, 7); g.fill(); }); }
  g.strokeStyle = 'rgba(255,243,220,.18)'; g.lineWidth = 0.6;
  for (let i = 0; i < 4; i++) { const x = r() * S, y = r() * S, a = r() * 6.28, len = 14 + r() * 16; wrap(S, x, y, 32, (px, py) => { g.beginPath(); g.moveTo(px, py); g.quadraticCurveTo(px + Math.cos(a) * len * 0.5 + 4, py + Math.sin(a) * len * 0.5 - 4, px + Math.cos(a) * len, py + Math.sin(a) * len); g.stroke(); }); }
  return url(c);
}

// --- inline SVG defs: petal stickers and marigolds (three rings of teardrop petals, a dark centre, a translucent backlit rim)
const teardrop = (len, w) => `M0 0C${w} ${-len * 0.25} ${w * 0.9} ${-len * 0.85} 0 ${-len}C${-w * 0.9} ${-len * 0.85} ${-w} ${-len * 0.25} 0 0Z`;
const MARI = [['#F5A623', '#FFD27A'], ['#FF8A00', '#FFB347'], ['#FFC93C', '#FFE9A0'], ['#D6531A', '#F08A4A']];
const pick = (q) => (q < 0.55 ? 0 : q < 0.8 ? 1 : q < 0.92 ? 2 : 3);
function marigold(id, r) {
  const rings = [[14, 15, 5.2, 4.4, 0], [10, 10.5, 4, 3.4, 9], [6, 6.2, 3, 2.6, 18]];
  let s = `<symbol id="${id}" viewBox="-18 -18 36 36">`;
  rings.forEach(([n, len, w, , off]) => {
    for (let i = 0; i < n; i++) {
      const a = (360 / n) * i + off + r() * 6, c = pick(r());
      s += `<g transform="rotate(${a.toFixed(1)})"><path d="${teardrop(len, w)}" fill="url(#mg${c})" stroke="rgba(255,230,150,.5)" stroke-width=".5"/><path d="M0 -1.5V${(-len * 0.75).toFixed(1)}" stroke="rgba(255,240,190,.45)" stroke-width=".5" fill="none"/></g>`;
    }
  });
  return s + '<circle r="3" fill="#7A3A06"/></symbol>';
}
// a standalone marigold (own gradients) for rasterising once: the toran swings every frame, and re-rasterising 14 vector flowers of ~30 petals each costs far too much
export function marigoldMarkup(k) {
  const r = mulberry32(31); for (let i = 0; i < k * 90; i++) r();
  const grads = MARI.map(([a, b], i) => `<radialGradient id="mg${i}" cx="50%" cy="100%" r="100%"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></radialGradient>`).join('');
  return `<svg xmlns="${NS}" viewBox="-18 -18 36 36" width="64" height="64"><defs>${grads}</defs>${marigold('m', r).replace(/<\/?symbol[^>]*>/g, '')}</svg>`;
}
function defs() {
  const r = mulberry32(31);
  let s = `<svg xmlns="${NS}" width="0" height="0" aria-hidden="true" focusable="false" style="position:absolute" id="elev-defs"><defs>`;
  MARI.forEach(([a, b], i) => { s += `<radialGradient id="mg${i}" cx="50%" cy="100%" r="100%"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></radialGradient>`; });
  s += '</defs>';
  s += ['petal-a', 'petal-b', 'petal-c'].map((id, i) => `<symbol id="${id}" viewBox="-12 -16 24 24"><path d="${teardrop(20 - i * 2, 7 + i)}" fill="url(#mg${i})" stroke="rgba(255,230,150,.5)" stroke-width=".5" transform="translate(0 6)"/></symbol>`).join('');
  s += ['marigold-1', 'marigold-2', 'marigold-3'].map((id) => marigold(id, r)).join('');
  return s + '</svg>';
}

export function start() {
  if (done) return; done = true;
  const root = document.documentElement, stage = document.getElementById('stage');
  document.body.insertAdjacentHTML('afterbegin', defs()); made.push(document.getElementById('elev-defs'));
  if (stage) {
    const v = document.getElementById('vignette');
    ['grain-layer', 'dust-layer'].forEach((id) => { const d = document.createElement('div'); d.id = id; d.setAttribute('aria-hidden', 'true'); stage.insertBefore(d, v); made.push(d); });
  }
  const paint = () => {
    if (!done) return;
    const r = mulberry32(2026), low = getState().quality === 'low', set = (k, v) => root.style.setProperty(k, v);
    try {
      set('--tx-fibre', fibre(r, low ? 128 : 256, low ? 0.5 : 1));
      set('--tx-grit', grit(r, low ? 96 : 192));
      if (!low) { set('--tx-grain', grain(r)); set('--tx-dust', dust(r)); }
      root.classList.add('mat-ready');
    } catch { /* a missing tile leaves the plain colour surface intact */ }
  };
  idleId = window.requestIdleCallback ? requestIdleCallback(paint, { timeout: 400 }) : setTimeout(paint, 200);
}
export function stop() {
  done = false;
  if (window.cancelIdleCallback) cancelIdleCallback(idleId); else clearTimeout(idleId);
  made.forEach((n) => n && n.remove()); made = [];
  const root = document.documentElement; root.classList.remove('mat-ready');
  ['--tx-fibre', '--tx-grit', '--tx-grain', '--tx-dust'].forEach((k) => root.style.removeProperty(k));
}
