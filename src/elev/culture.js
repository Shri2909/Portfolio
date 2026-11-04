// Pack 6 loader (E6): the culture, wish and delight modules are lazy chunks (R6). The card studio and the rangoli pad
// load when the wish step is near, the moving card when a card exists, the lantern sky when the closure is near, and the
// homely hour and the five secrets on idle. Each registers with the governor and unmounts cleanly in stop().
import { getState } from '../lib/store.js';
import copy from '../lib/copy.js';
import { registerEffect } from './budget.js';
import { STACK_WISH } from '../lib/cardRender.js';
import { missingScripts } from './script.js';

let offs = [], io = null, mo = null, timers = [], done = {}, tofuEl = null;
const once = (k, f) => { if (done[k]) return; done[k] = 1; f(); };
let lastIn = 0; const stamp = () => { lastIn = performance.now(); };
// run f only when the visitor has been quiet for 700 ms and the browser is idle, so chunk work never lands inside an interaction
const idle = (f) => { const go = () => { if (performance.now() - lastIn < 700) return void setTimeout(go, 350); window.requestIdleCallback ? requestIdleCallback(f, { timeout: 2500 }) : setTimeout(f, 50); }; go(); };
function tofu() { // quiet line under the form when this device may lack a font for the wish's script
  const onInput = (e) => {
    if (!e.target || e.target.id !== 'wish-text') return;
    const ctx = (tofu.c ||= document.createElement('canvas').getContext('2d')); ctx.font = `32px ${STACK_WISH}`;
    const miss = missingScripts(e.target.value, ctx), host = e.target.closest('.wish-form'); if (!host) return;
    if (!miss.length) { tofuEl && tofuEl.remove(); tofuEl = null; return; }
    if (!tofuEl || !tofuEl.isConnected) { tofuEl = document.createElement('p'); tofuEl.className = 'tofu-note'; tofuEl.setAttribute('role', 'status'); tofuEl.setAttribute('data-e', '1'); tofuEl.textContent = copy.ui.extra.scriptMaybe; host.querySelector('.msg')?.after(tofuEl); }
  };
  document.addEventListener('input', onInput); offs.push(() => document.removeEventListener('input', onInput));
}
export function start() {
  ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach((t) => { addEventListener(t, stamp, { passive: true, capture: true }); offs.push(() => removeEventListener(t, stamp, { capture: true })); });
  registerEffect({ id: 'secrets', kind: 'dom', priority: 4, ms: 0.2 });
  tofu();
  const near = (sel, key, load) => { const el = document.querySelector(sel); if (!el) return; io.observe(el); el.__cu = [key, load]; };
  io = new IntersectionObserver((es) => es.forEach((e) => { if (!e.isIntersecting) return; io.unobserve(e.target); const [k, load] = e.target.__cu; once(k, () => idle(load)); }), { rootMargin: '1200px 0px' });
  const wire = () => {
    near('#wish', 'wish', () => import('./studio.js').then((m) => { m.start(); offs.push(() => m.stop()); idle(() => import('./pad.js').then((p) => { const un = p.mount(); offs.push(un); })); }));
    near('#closure', 'lanterns', () => import('./lanterns.js').then((m) => { const un = m.mount(); offs.push(un); }));
  };
  wire(); timers.push(setTimeout(wire, 1500), setTimeout(wire, 4000));
  // the moving card button needs a made card (.card-stage .actions)
  const watchCard = () => { if (document.querySelector('.card-stage .actions') && !done.movie) { done.movie = 1; idle(() => import('./movie.js').then((m) => { offs.push(m.mount()); }).catch(() => { done.movie = 0; })); } };
  mo = new MutationObserver(watchCard); const w = document.getElementById('wish'); w ? mo.observe(w, { childList: true, subtree: true }) : timers.push(setTimeout(() => { const ww = document.getElementById('wish'); ww && mo.observe(ww, { childList: true, subtree: true }); }, 1500)); watchCard();
  // the homely hour and the five secrets wait for idle
  timers.push(setTimeout(() => idle(() => { import('./homely.js').then((m) => offs.push(m.mount())); import('./secrets.js').then((m) => offs.push(m.mount())); }), 2500));
}
export function stop() {
  io && io.disconnect(); io = null; mo && mo.disconnect(); mo = null; timers.splice(0).forEach(clearTimeout);
  offs.splice(0).forEach((f) => { try { f && f(); } catch { /* keep going */ } }); done = {}; tofuEl && tofuEl.remove(); tofuEl = null;
}
export const name = 'culture';
