// E2.1 / E2.4: the one vocabulary of time. EASE and DUR mirror the CSS tokens in styles/elev/motion.css.
import { getState } from '../lib/store.js';
import { hooks } from '../lib/events.js';

const spring = (typeof CSS !== 'undefined' && CSS.supports && CSS.supports('transition-timing-function', 'linear(0, 1)'))
  ? 'linear(0, 0.037, 0.129, 0.254, 0.393, 0.533, 0.662, 0.777, 0.872, 0.948, 1.004, 1.044, 1.068, 1.077, 1.084, 1.077, 1.072, 1.061, 1.05, 1.038, 1.027, 1.018, 1.01, 1.004, 1)'
  : 'cubic-bezier(0.34, 1.45, 0.64, 1)';
export const EASE = { outExpo: 'cubic-bezier(0.16, 1, 0.3, 1)', inOutQuint: 'cubic-bezier(0.83, 0, 0.17, 1)', outQuart: 'cubic-bezier(0.25, 1, 0.5, 1)', inQuad: 'cubic-bezier(0.5, 0, 0.75, 0)', spring };
export const DUR = { xs: 120, s: 240, m: 480, l: 900, xl: 1600 };
export const dur = (k) => (getState().calm ? 0 : typeof k === 'number' ? k : DUR[k] ?? DUR.m);

/** Delays for n items whose maximum never exceeds `total`. */
export function stagger(n, { step = 60, from = 'start', total = 900 } = {}) {
  if (n <= 0) return [];
  const st = n > 1 ? Math.min(step, total / (n - 1)) : 0;
  return Array.from({ length: n }, (_, i) => {
    const k = from === 'end' ? n - 1 - i : from === 'center' ? Math.abs(i - (n - 1) / 2) * 2 : i;
    return Math.min(total, Math.round(k * st));
  });
}

// ---- read/write batcher: reads first, then writes, in one rAF ----
const rq = [], wq = [];
let flushing = 0;
const flush = () => { flushing = 0; const r = rq.splice(0), w = wq.splice(0); r.forEach((f) => f()); w.forEach((f) => f()); };
export const read = (fn) => { rq.push(fn); if (!flushing) flushing = requestAnimationFrame(flush); };
export const write = (fn) => { wq.push(fn); if (!flushing) flushing = requestAnimationFrame(flush); };

// ---- play(): interruption without a jump ----
const running = new WeakMap(); // el -> Map(key -> Animation)
const live = new Set();        // skippable animations
export function play(el, keyframes, { dur: d = 'm', ease = 'outExpo', delay = 0, key, skippable = true } = {}) {
  const final = Array.isArray(keyframes) ? keyframes[keyframes.length - 1] : null;
  if (!el || !el.animate) return Promise.resolve();
  if (key) {
    const m = running.get(el) || running.set(el, new Map()).get(el), old = m.get(key);
    if (old) { try { old.commitStyles(); } catch { /* detached */ } old.cancel(); }
  }
  const ms = dur(d);
  if (getState().calm || ms === 0) { if (final) Object.assign(el.style, toStyle(final)); return Promise.resolve(); }
  const a = el.animate(keyframes, { duration: ms, easing: EASE[ease] || ease, delay, fill: 'both' });
  if (key) running.get(el).set(key, a);
  if (skippable) live.add(a);
  return a.finished.then(() => {
    live.delete(a);
    if (running.get(el) && running.get(el).get(key) === a) running.get(el).delete(key);
    try { a.commitStyles(); a.cancel(); } catch { /* detached */ }
  }, () => { live.delete(a); });
}
const toStyle = (kf) => { const o = {}; for (const [k, v] of Object.entries(kf)) if (k !== 'offset' && k !== 'easing' && k !== 'composite') o[k] = v; return o; };

/** steps: [{ at: number | '<' | '+=120', el, kf, ...opts }]. Built paused, started together in one rAF. */
export function timeline(steps) {
  let t = 0, prevStart = 0, prevEnd = 0, anims = [];
  const plan = steps.map((s) => {
    const start = typeof s.at === 'number' ? s.at : s.at === '<' ? prevStart : typeof s.at === 'string' && s.at.startsWith('+=') ? prevEnd + +s.at.slice(2) : prevEnd;
    const d = dur(s.dur ?? 'm'); prevStart = start; prevEnd = start + d; t = Math.max(t, prevEnd);
    return { ...s, start, d };
  });
  let resolve; const finished = new Promise((r) => { resolve = r; });
  const api = {
    finished,
    play() {
      requestAnimationFrame(() => {
        if (getState().calm) { plan.forEach((s) => { const f = Array.isArray(s.kf) ? s.kf[s.kf.length - 1] : null; f && s.el && Object.assign(s.el.style, toStyle(f)); }); resolve(); return; }
        anims = plan.filter((s) => s.el && s.el.animate).map((s) => { const a = s.el.animate(s.kf, { duration: s.d, delay: s.start, easing: EASE[s.ease || 'outExpo'] || s.ease, fill: 'both' }); if (s.skippable !== false) live.add(a); return a; });
        Promise.allSettled(anims.map((a) => a.finished)).then(() => { anims.forEach((a) => live.delete(a)); resolve(); });
      });
      return api;
    },
    finish() { anims.forEach((a) => { try { a.finish(); } catch { /* ignore */ } }); },
    cancel() { anims.forEach((a) => a.cancel()); },
    reverse() { anims.forEach((a) => a.reverse()); },
  };
  return api;
}

/** Any input finishes every skippable animation in the same event ("any tap completes it"). */
export function skipAll() { live.forEach((a) => { try { a.finish(); } catch { /* ignore */ } }); live.clear(); }
const SKIP_EVENTS = ['pointerdown', 'keydown', 'wheel', 'touchstart'];
export const startSkip = () => SKIP_EVENTS.forEach((e) => window.addEventListener(e, skipAll, { capture: true, passive: true }));
export const stopSkip = () => SKIP_EVENTS.forEach((e) => window.removeEventListener(e, skipAll, { capture: true }));

// ---- FLIP (E2.4) ----
/** Uniform FLIP for things with no text. `first` is the element's rect before the change. */
export function flip(el, first, opts = {}) {
  const last = el.getBoundingClientRect();
  if (!last.width || !last.height) return Promise.resolve();
  const dx = first.left - last.left, dy = first.top - last.top, sx = first.width / last.width, sy = first.height / last.height;
  el.style.transformOrigin = '0 0';
  return play(el, [{ transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})` }, { transform: 'none' }], { dur: 'l', ease: 'outExpo', key: 'flip', ...opts });
}
/** Clip-path FLIP for things with text: the box stays final-size, the visible window grows from `first`. */
export function clipFlip(el, first, { radius = 18, ...opts } = {}) {
  const last = el.getBoundingClientRect();
  const t = Math.max(0, first.top - last.top), l = Math.max(0, first.left - last.left), r = Math.max(0, last.right - first.right), b = Math.max(0, last.bottom - first.bottom);
  return play(el, [{ clipPath: `inset(${t}px ${r}px ${b}px ${l}px round ${radius}px)` }, { clipPath: `inset(0px 0px 0px 0px round ${radius}px)` }], { dur: 'l', ease: 'outExpo', key: 'clip', ...opts });
}
/** View Transition when supported (not Calm, not low); otherwise just run fn. Never blocks. */
export async function transition(fn, { ready } = {}) {
  const st = getState();
  if (!document.startViewTransition || st.calm || st.quality === 'low') { fn(); ready && ready(); return; }
  try {
    const vt = document.startViewTransition(() => { fn(); return new Promise((r) => setTimeout(r, 0)); });
    await vt.ready; ready && ready(); await vt.finished;
  } catch { try { fn(); } catch { /* ignore */ } ready && ready(); }
}

// ---- lamp card: the flame flies into the card corner while the card opens as an iris from the wick (E2.4) ----
const flameOf = (lamp) => lamp && (lamp.querySelector('svg') || lamp);
function flyFlame(from, to, { reverse = false } = {}) {
  const f = flameOf(from), t = to && to.getBoundingClientRect();
  if (!f || !t) return;
  const r = f.getBoundingClientRect(); if (!r.width) return;
  const c = f.cloneNode(true);
  Object.assign(c.style, { position: 'fixed', left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px', margin: 0, zIndex: 9999, pointerEvents: 'none', transformOrigin: '0 0' });
  c.setAttribute('aria-hidden', 'true'); document.body.appendChild(c);
  const dx = t.left + t.width / 2 - (r.left + r.width / 2), dy = t.top + t.height / 2 - (r.top + r.height / 2);
  const kf = [{ transform: 'none', opacity: 1 }, { transform: `translate(${dx}px, ${dy}px) scale(.8)`, opacity: 0.0 }];
  const a = c.animate(reverse ? kf.slice().reverse() : kf, { duration: dur(reverse ? 'm' : 'l') || 1, easing: reverse ? EASE.inOutQuint : EASE.outExpo, fill: 'both' });
  a.finished.then(() => c.remove(), () => c.remove());
}
const wick = (b, lamp) => { const br = b.getBoundingClientRect(), lr = lamp && lamp.getBoundingClientRect(); return lr ? [lr.left + lr.width / 2 - br.left, lr.top + lr.height / 2 - br.top] : [br.width / 2, br.height * 0.15]; };
export function installCard() {
  hooks.cardOpen = (b, lamp) => {
    const st = getState();
    if (st.calm) { b.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1 }); return true; }
    const [wx, wy] = wick(b, lamp);
    const iris = (r) => `circle(${r} at ${wx}px ${wy}px)`;
    const ms = st.quality === 'low' ? DUR.s : DUR.l;
    b.animate([{ clipPath: iris('0px') }, { clipPath: iris('160%') }], { duration: ms, easing: EASE.outExpo, fill: 'backwards' });
    b.animate([{ opacity: 0 }, { opacity: 1 }], { duration: ms * 0.45, easing: EASE.outQuart, fill: 'backwards' });
    if (st.quality !== 'low') flyFlame(lamp, b.querySelector('.card-flame'));
    return true;
  };
  hooks.cardClose = (b, lamp, finish) => {
    const st = getState();
    if (st.calm) return false;
    const [wx, wy] = wick(b, lamp);
    const iris = (r) => `circle(${r} at ${wx}px ${wy}px)`;
    const a = b.animate([{ clipPath: iris('160%') }, { clipPath: iris('0px') }], { duration: st.quality === 'low' ? DUR.s : DUR.m, easing: EASE.inOutQuint, fill: 'forwards' });
    if (st.quality !== 'low') flyFlame(lamp, b.querySelector('.card-flame'), { reverse: true });
    a.onfinish = finish;
    return true;
  };
}
export function uninstallCard() { hooks.cardOpen = null; hooks.cardClose = null; }
