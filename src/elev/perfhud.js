// Perf build only (imported behind the PERF flag). A 120x56 chip: fps, EWMA, tier, active effects, 120-frame sparkline.
// Press P to expand the per-effect cost table. window.__perf = { cost, state, force, shed, restore }.
import { tickAwake } from './budget.js';
import { getState, actions } from '../lib/store.js';
import { promotedCount } from './promote.js';
let el = null, stopT = null;
export function mount(b) {
  if (el) return;
  const ring = new Float32Array(120); let n = 0, e = 16.7, open = false;
  el = document.createElement('div'); el.setAttribute('aria-hidden', 'true');
  el.style.cssText = 'position:fixed;left:6px;bottom:6px;z-index:9999;width:120px;font:9px/1.3 monospace;color:#9f9;background:rgba(0,0,0,.6);padding:3px;pointer-events:none;opacity:.55;white-space:pre';
  const cv = document.createElement('canvas'); cv.width = 120; cv.height = 24; const tx = document.createElement('div'); el.append(tx, cv); document.body.appendChild(el);
  const g = cv.getContext('2d');
  const key = (ev) => { if (ev.key === 'p' || ev.key === 'P') { open = !open; el.style.width = open ? '300px' : '120px'; } };
  window.addEventListener('keydown', key);
  let i = 0;
  stopT = tickAwake((dt) => {
    ring[n++ % 120] = dt; e += 0.08 * (dt - e);
    if (++i % 6) return;
    g.clearRect(0, 0, 120, 24); g.fillStyle = '#9f9'; for (let k = 0; k < 120; k++) { const h = Math.min(24, (ring[(n + k) % 120] / 50) * 24); g.fillRect(k, 24 - h, 1, h); }
    const L = b.list(); tx.textContent = `${(1000 / e).toFixed(0)}fps ${e.toFixed(1)}ms ${getState().quality}\nfx ${L.filter((x) => x.on).length}/${L.length} layers ${promotedCount()}` + (open ? '\n' + b.cost().map((c) => `${c.id} ${c.ms}ms x${c.scale}${c.pinned ? ' pin' : ''}`).join('\n') : '');
  });
  window.__perf = { cost: b.cost, state: () => ({ ewma: e, tier: getState().quality, fx: b.list().map((x) => [x.id, x.on]) }), force: (t) => { actions.setQuality(t); b.applyTier(t); }, shed: (id) => b.shed(id), restore: (id) => b.restore(id) };
}
