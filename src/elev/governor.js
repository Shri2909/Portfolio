// E8.3: adaptive quality v2. Sheds one effect at a time (graceful dimming), can also restore, never changes a lamp,
// text, number or label. Decision logic lives in governorCore.js (unit-tested); this file wires it to the page.
import { actions, getState, subscribe } from '../lib/store.js';
import { on, emit, hooks } from '../lib/events.js';
import { PERF } from '../elevation.js';
import { createGovernor } from './governorCore.js';
import * as budget from './budget.js';

export const name = 'governor';
const order = ['high', 'mid', 'low'];
let offs = [], unreg = [], gov = null, lastQ = '', po = null;

function hints() { // device hints at boot, no network; automation (navigator.webdriver) keeps the measured tier
  if (navigator.webdriver) return;
  const mem = navigator.deviceMemory, cores = navigator.hardwareConcurrency;
  let want = 'high';
  if ((mem && mem <= 2) || (cores && cores <= 2) || matchMedia('(update: slow)').matches) want = 'low';
  else if ((mem && mem <= 4) || (cores && cores <= 4)) want = 'mid';
  if (order.indexOf(want) > order.indexOf(getState().quality)) actions.setQuality(want);
}
export function start() {
  hooks.fx = { // read by fx.js and parallax.js; 1 = untouched
    ambient: () => budget.scale('ambient-particles'), parallax: () => budget.scale('pointer-parallax'),
    dpr: () => (budget.isOn('canvas-dpr') ? 1 : 0.72), cap: () => (budget.isOn('particle-cap') ? 1 : 0.5),
  };
  const nudge = () => emit('fx:setQuality', { tier: getState().quality }); // fx.js re-sizes its canvas and trims
  unreg.push(budget.registerEffect({ id: 'ambient-particles', kind: 'canvas', priority: 2, ms: 1.2 }));
  unreg.push(budget.registerEffect({ id: 'pointer-parallax', kind: 'dom', priority: 3, ms: 0.2 }));
  unreg.push(budget.registerEffect({ id: 'canvas-dpr', kind: 'canvas', priority: 8, ms: 1.0, onShed: nudge, onRestore: nudge }));
  unreg.push(budget.registerEffect({ id: 'particle-cap', kind: 'canvas', priority: 9, ms: 0.8, onShed: nudge, onRestore: nudge }));
  if (PERF) { const q = new URLSearchParams(location.search).get('q'); if (order.includes(q)) { budget.applyTier(q); return perf(); } } // forced tier: governor idle
  hints(); lastQ = getState().quality; budget.applyTier(lastQ);
  offs.push(subscribe(() => { const q = getState().quality; if (q !== lastQ) { lastQ = q; budget.applyTier(q); } }));
  if (PERF) perf();
  hooks.govV2 = true;
  gov = createGovernor();
  const quiet = (ms) => gov.quiet(performance.now() + ms);
  quiet(3000);
  const add = (t, ev, fn, o) => { t.addEventListener(ev, fn, o); offs.push(() => t.removeEventListener(ev, fn, o)); };
  add(document, 'visibilitychange', () => quiet(1500)); add(window, 'resize', () => quiet(800)); add(window, 'orientationchange', () => quiet(1500));
  offs.push(on('stage:act', () => quiet(3000)));
  if (document.fonts && document.fonts.status === 'loading') document.fonts.ready.then(() => quiet(500));
  let down = false, longT = 0;
  add(document, 'pointerdown', () => { down = true; }, { capture: true, passive: true }); add(window, 'pointerup', () => { down = false; }, { capture: true, passive: true }); add(window, 'pointercancel', () => { down = false; }, { capture: true, passive: true });
  try { po = new PerformanceObserver((l) => l.getEntries().forEach((e) => { if (e.duration > 80) longT = performance.now(); })); po.observe({ type: 'longtask', buffered: false }); } catch { /* unsupported */ }
  const host = { shedList: budget.shedList, restoreList: budget.restoreList, canTierDown: () => getState().quality !== 'low' };
  offs.push(budget.tickAwake((dt, t) => {
    const s = getState();
    const sd = (navigator.connection && navigator.connection.saveData) || matchMedia('(prefers-reduced-data: reduce)').matches;
    const now = performance.now();
    const busy = down || !!document.querySelector('dialog[open]');
    const acts = gov.step(dt, now, host, { busy, longTask: now - longT < 12000, noRestore: !!sd });
    for (const a of acts) {
      if (a.type === 'shed') budget.shed(a.id, { t: now });
      else if (a.type === 'restore') budget.restore(a.id, { t: now });
      else if (a.type === 'tier-down') actions.setQuality(order[Math.min(2, order.indexOf(s.quality) + 1)]);
    }
  }));
}
function perf() { import('./perfhud.js').then((m) => m.mount(budget)).catch(() => {}); }
export function stop() {
  offs.splice(0).forEach((f) => f()); unreg.splice(0).forEach((f) => f()); po && po.disconnect(); po = null; hooks.fx = null; hooks.govV2 = false; gov = null;
}
