// Pack 5 loader (E5): the eight set-pieces and the proof flight are lazy chunks, one per act, mounted when their device
// is within 800 px of the viewport. Each piece is an overlay on the V3 device (React keeps owning the real controls and
// the plain-text twin); it hides the V3 picture only while mounted. stop() unmounts every piece.
import { on } from '../lib/events.js';

const PIECES = {
  wall: ['.device.audit', () => import('./sp/wall.js')],
  late: ['.device.late', () => import('./sp/late.js')],
  price: ['.device.pricetag', () => import('./sp/price.js')],
  relay: ['.device.handoff', () => import('./sp/relay.js')],
  clock: ['.device.clock', () => import('./sp/clock.js')],
  baithak: ['#baithak', () => import('./sp/baithak.js')],
  voice: ['#voice', () => import('./sp/voice.js')],
  card: ['#lamp-card', () => import('./sp/card.js')],
};
let offs = [], io = null, clean = new Map(), timers = [];
function scan() {
  for (const [name, [sel, load]] of Object.entries(PIECES)) {
    const el = document.querySelector(sel);
    if (!el || el.hasAttribute('data-sp-' + name) || !io) continue;
    el.setAttribute('data-sp-' + name, '0'); el.__spLoad = load; el.__spName = name; io.observe(el);
  }
}
export function start() {
  io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return; const el = e.target; io.unobserve(el);
    el.__spLoad().then((m) => new Promise((go) => (window.requestIdleCallback ? requestIdleCallback(go, { timeout: 900 }) : setTimeout(go, 120))).then(() => { if (!io || !el.isConnected) return; const c = m.mount(el); clean.set(el, c); el.setAttribute('data-sp-' + el.__spName, '1'); })).catch(() => el.removeAttribute('data-sp-' + el.__spName));
  }), { rootMargin: '800px 0px' });
  scan(); timers.push(setTimeout(scan, 1200), setTimeout(scan, 3500));
  offs.push(on('stage:act', scan));
  import('./sp/proof.js').then((m) => { if (io) offs.push(m.mount()); }).catch(() => {});
}
export function stop() {
  offs.splice(0).forEach((f) => { try { f && f(); } catch { /* keep going */ } });
  timers.splice(0).forEach(clearTimeout);
  io && io.disconnect(); io = null;
  clean.forEach((c, el) => { try { c && c(); } catch { /* keep going */ } el.removeAttribute('data-sp-' + el.__spName); }); clean.clear();
}
export const name = 'setpieces';
