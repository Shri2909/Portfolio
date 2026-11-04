// E6.2: the rangoli pad. An optional disclosure under the wish form: draw with a finger (or the keyboard), see it in
// 6, 8 or 12 folds of warm light, or pick one of six generated patterns (the accessible path). Strokes live in memory
// only (draft.js), never in the link, storage or network. The rangoli card uses the drawing as its medallion.
import copy from '../lib/copy.js';
import { getState } from '../lib/store.js';
import { announce } from '../lib/announce.js';
import { emit } from '../lib/events.js';
import { wishState } from '../lib/wishState.js';
import { tpl } from '../lib/tpl.js';
import { makeKolam, drawKolam, presetSeeds } from './kolam.js';
import { palette } from './palette.js';
import { draft } from './draft.js';
import { hush } from './hush.js';

const X = copy.ui.extra;
const MAX_STROKES = 40, MAX_POINTS = 4000;
let root = null, cleanup = [];

function build(host) {
  const d = document.createElement('details'); d.className = 'kpad'; d.setAttribute('data-e', '1');
  d.innerHTML = `<summary>${X.padOpen}<span class="sr-only"> (${X.padOpenEn})</span></summary>
  <div class="kpad-in">
    <canvas class="kpad-cv" role="application" tabindex="0" aria-label="${X.padOpenEn}"></canvas>
    <div class="kpad-bar" role="group" aria-label="${X.padOpen}">
      <div class="kpad-folds" role="radiogroup" aria-label="${X.padFolds}">${[6, 8, 12].map((n) => `<button type="button" role="radio" aria-checked="${n === 8}" data-folds="${n}" class="btn">${n}</button>`).join('')}</div>
      <button type="button" class="btn" data-act="mirror" aria-pressed="true">${X.padMirror}</button>
      <button type="button" class="btn" data-act="undo">${X.padUndo}</button>
      <button type="button" class="btn" data-act="clear">${X.padClear}</button>
    </div>
    <div class="kpad-presets" role="group" aria-label="${X.padPresets}">${presetSeeds.map((p, i) => `<button type="button" class="btn kpad-pre" data-pre="${i}" aria-label="${tpl(X.padPreset, { n: i + 1 })}"><canvas width="40" height="40" aria-hidden="true"></canvas></button>`).join('')}</div>
  </div>`;
  host.appendChild(d); return d;
}

export function mount() {
  const host = document.querySelector('#wish .paper'); if (!host || host.querySelector('.kpad')) return () => {};
  root = build(host);
  const cv = root.querySelector('.kpad-cv'), ctx = cv.getContext('2d'), st = draft.get();
  let size = 0, dpr = 1, drawing = null, brush = { x: 0, y: 0, pen: false }, raf = 0, presetT = 1, presetRaf = 0, lastEmit = 0;
  const R = () => size * 0.47;
  const resize = () => {
    const q = getState().quality; size = Math.min(Math.round(Math.min(innerWidth * 0.86, 340)), 340); dpr = Math.min(devicePixelRatio || 1, q === 'high' ? 2 : q === 'mid' ? 1.5 : 1);
    cv.width = size * dpr; cv.height = size * dpr; cv.style.width = cv.style.height = size + 'px'; paint();
  };
  const lattice = () => makeKolam({ seed: presetSeeds[0].seed, folds: draft.get().folds });
  function paint() {
    const s = draft.get(), p = palette(getState().ink), q = getState().quality;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = 'rgba(10,7,5,.55)'; ctx.fillRect(0, 0, size, size);
    ctx.globalAlpha = 0.18; for (const d of lattice().dots) { ctx.fillStyle = '#FFF3DC'; ctx.beginPath(); ctx.arc(size / 2 + d.x * R(), size / 2 + d.y * R(), 2, 0, 7); ctx.fill(); } ctx.globalAlpha = 1;
    if (s.preset) { drawKolam(ctx, makeKolam(s.preset), { cx: size / 2, cy: size / 2, R: R(), progress: presetT, palette: p, glow: q !== 'low' }); return; }
    const strokes = drawing ? [...s.strokes, drawing] : s.strokes, F = Math.min(s.folds, q === 'high' ? 12 : 8);
    for (const [w, a, col, op] of q === 'low' ? [[2.5, 1, '#FFE9B8', 'source-over']] : [[10, 0.1, p.glow, 'lighter'], [2.5, 1, '#FFE9B8', 'source-over']]) {
      ctx.globalCompositeOperation = op; ctx.globalAlpha = a; ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = ctx.lineJoin = 'round';
      for (const sk of strokes) for (let i = 0; i < F; i++) for (const m of s.mirror ? [1, -1] : [1]) {
        ctx.save(); ctx.translate(size / 2, size / 2); ctx.rotate(i * 2 * Math.PI / F); ctx.scale(m, 1); ctx.beginPath();
        sk.forEach(([x, y], j) => (j ? ctx.lineTo(x * R(), y * R()) : ctx.moveTo(x * R(), y * R()))); ctx.stroke(); ctx.restore();
      }
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    if (drawing && drawing.length && q !== 'low') { const h = drawing[drawing.length - 1], g = ctx.createRadialGradient(size / 2 + h[0] * R(), size / 2 + h[1] * R(), 0, size / 2 + h[0] * R(), size / 2 + h[1] * R(), 48); g.addColorStop(0, 'rgba(255,200,110,.7)'); g.addColorStop(1, 'rgba(255,200,110,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, size, size); }
  }
  const sched = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; paint(); }); };
  const norm = (e) => { const r = cv.getBoundingClientRect(); let x = (e.clientX - r.left - r.width / 2) / R(), y = (e.clientY - r.top - r.height / 2) / R(); // lint:ok (event-time or once-per-33ms read, before any write)
    for (const d of lattice().dots) { const dx = x - d.x, dy = y - d.y, dist = Math.hypot(dx, dy), min = 16 / R(); if (dist < min && dist > 0) { x = d.x + dx / dist * min; y = d.y + dy / dist * min; } } // bend round the dots
    return [x, y]; };
  const changed = () => { const n = draft.count(); clearTimeout(lastEmit); lastEmit = setTimeout(() => { emit('kolam:changed', { n }); const s = wishState.get(); if (s.made && s.theme === 'rangoli') wishState.set({ seed: (s.seed ^ (n * 2654435761)) >>> 0 }); }, 120); };
  const commit = () => { if (!drawing || drawing.length < 2) { drawing = null; return; } const s = draft.get(); if (s.strokes.length >= MAX_STROKES) { drawing = null; return; }
    if (Math.hypot(drawing[0][0], drawing[0][1]) < 14 / R()) drawing[0] = [0, 0]; // fans of lines meet cleanly at the centre
    draft.set({ strokes: [...s.strokes, drawing], preset: null }); announce(tpl(X.padStroke, { n: draft.get().strokes.length })); drawing = null; changed(); sched(); };
  let release = null;
  const down = (e) => { if (e.button > 0) return; cv.setPointerCapture(e.pointerId); drawing = [norm(e)]; release = hush(1, 'kpad'); draft.set({ preset: null }); sched(); e.preventDefault(); };
  const move = (e) => { if (!drawing) return; const pts = e.getCoalescedEvents ? e.getCoalescedEvents() : [e]; let n = drawing.reduce((a, s) => a + 1, 0);
    for (const ev of pts) { const p = norm(ev), l = drawing[drawing.length - 1]; if (Math.hypot(p[0] - l[0], p[1] - l[1]) * R() >= 3 && n < MAX_POINTS) { drawing.push(p); n++; } } sched(); };
  const up = () => { commit(); release && release(); release = null; };
  cv.addEventListener('pointerdown', down); cv.addEventListener('pointermove', move); cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
  cv.style.touchAction = 'none';
  // keyboard drawing: arrows move the brush, Space toggles the pen, Backspace undoes
  cv.addEventListener('keydown', (e) => {
    const k = e.key, step = (e.shiftKey ? 24 : 8) / R();
    if (k === ' ') { e.preventDefault(); brush.pen = !brush.pen; if (brush.pen) drawing = [[brush.x, brush.y]]; else commit(); sched(); return; }
    if (k === 'Backspace') { e.preventDefault(); undo(); return; }
    const dv = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[k]; if (!dv) return; e.preventDefault();
    brush.x = Math.max(-1, Math.min(1, brush.x + dv[0])); brush.y = Math.max(-1, Math.min(1, brush.y + dv[1])); if (brush.pen && drawing) drawing.push([brush.x, brush.y]); sched();
  });
  const undo = () => { const s = draft.get(); if (s.preset) { draft.set({ preset: null }); } else draft.set({ strokes: s.strokes.slice(0, -1) }); changed(); sched(); };
  root.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.folds) { draft.set({ folds: +b.dataset.folds }); root.querySelectorAll('[data-folds]').forEach((x) => x.setAttribute('aria-checked', String(x === b))); sched(); return; }
    if (b.dataset.act === 'mirror') { const m = !draft.get().mirror; draft.set({ mirror: m }); b.setAttribute('aria-pressed', String(m)); sched(); return; }
    if (b.dataset.act === 'undo') return undo();
    if (b.dataset.act === 'clear') { draft.clear(); changed(); sched(); return; }
    if (b.dataset.pre != null) {
      draft.set({ preset: presetSeeds[+b.dataset.pre], strokes: [] }); changed(); cancelAnimationFrame(presetRaf); presetT = getState().calm || getState().quality === 'low' ? 1 : 0;
      const t0 = performance.now(), dur = getState().quality === 'high' ? 1600 : 1200;
      const go = (t) => { presetT = Math.min(1, (t - t0) / dur); paint(); if (presetT < 1) presetRaf = requestAnimationFrame(go); }; if (presetT < 1) presetRaf = requestAnimationFrame(go); else paint();
    }
  });
  const thumbs = () => { root.querySelectorAll('.kpad-pre canvas').forEach((c, i) => { if (c.__d) return; c.__d = 1; const x = c.getContext('2d'); drawKolam(x, makeKolam(presetSeeds[i]), { cx: 20, cy: 20, R: 18, progress: 1, palette: { core: '#FFF3DC', dot: '#FFF3DC' }, glow: false }); }); }; // drawn on first open, not at mount
  const ro = new ResizeObserver(resize); ro.observe(root); root.addEventListener('toggle', () => { resize(); if (root.open) thumbs(); }); resize();
  cleanup.push(() => { ro.disconnect(); cancelAnimationFrame(raf); cancelAnimationFrame(presetRaf); release && release(); root && root.remove(); root = null; draft.clear(); });
  return () => { cleanup.splice(0).forEach((f) => f()); };
}
