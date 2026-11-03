// E3.3 (lean): hold to light. The runtime layer on top of V3's hold: a thumb-sized hit area, instant press feedback (direct
// style writes, no React), the two flames reaching toward each other as progress grows, heat shimmer lines (high 3, mid 2),
// and a shock ring plus a bloom pulse when lamp 1 catches. V3 keeps the hold logic, the ember path, the early-release
// unwind and the Calm/tap/Enter alternatives untouched. Not built: the new 3-stage feel curve (holdFeel.js), comet tail
// retiming, the ember hover-wait variants (V3's unwind and `warm` carry-over already forgive an early release).
import { getState } from '../lib/store.js';
import { on, emit } from '../lib/events.js';
import { engine } from '../lib/flame.js';
import { lampRegistry } from '../lib/lampRegistry.js';
import { registerEffect, isOn } from './budget.js';
import { haptic } from '../lib/haptic.js';

const NS = 'http://www.w3.org/2000/svg';
let offs = [], heat = null, unreg = null, pressEl = null;
const tierN = () => ({ high: 3, mid: 2, low: 0 }[getState().quality] || 0);

function mkHeat() {
  if (heat) return heat;
  heat = document.createElementNS(NS, 'svg'); heat.setAttribute('class', 'heat'); heat.setAttribute('aria-hidden', 'true'); heat.setAttribute('data-e', '1'); heat.setAttribute('width', '60'); heat.setAttribute('height', '60'); heat.setAttribute('viewBox', '0 0 60 60');
  for (let i = 0; i < 3; i++) { const p = document.createElementNS(NS, 'path'); p.setAttribute('d', `M${14 + i * 16} 56q-5-9 0-18t0-18`); p.setAttribute('fill', 'none'); p.setAttribute('stroke', '#FFD27A'); p.setAttribute('stroke-width', '1'); p.setAttribute('stroke-linecap', 'round'); p.style.animationDelay = i * 0.3 + 's'; heat.appendChild(p); }
  document.body.appendChild(heat); return heat;
}
function lighting({ n, progress: p }) {
  if (n !== 1) return;
  const s = getState(); if (s.calm || s.ink) return;
  if (p > 0) {
    engine.set(0, { leanExtra: Math.min(14, 12 * p), glowBoost: 1 + 0.12 * p, scale: 1 + 0.08 * p }); engine.set(1, { leanExtra: -10 * p });
    if (isOn('hold-heat') && tierN() > 0) { const w = lampRegistry.wick(1); if (w) { const h = mkHeat(); h.style.cssText = `position:fixed;z-index:6;pointer-events:none;left:${w.x - 30}px;top:${w.y - 66}px;opacity:${(0.35 * p).toFixed(2)}`; [...h.children].forEach((c, i) => { c.style.display = i < tierN() ? '' : 'none'; }); } }
  } else { engine.set(0, { leanExtra: 0, glowBoost: 1, scale: 1 }); heat && heat.remove(); heat = null; }
}
function ring(x, y) {
  const d = document.createElement('div'); d.className = 'ignite-ring'; d.setAttribute('aria-hidden', 'true'); d.setAttribute('data-e', '1'); d.style.cssText = `left:${x - 60}px;top:${y - 60}px`; document.body.appendChild(d);
  const a = d.animate([{ transform: 'scale(0)', opacity: 0.35 }, { transform: 'scale(2.4)', opacity: 0 }], { duration: 700, easing: 'cubic-bezier(.16,1,.3,1)' }); a.onfinish = () => d.remove();
}
export function start() {
  unreg = registerEffect({ id: 'hold-heat', kind: 'dom', priority: 2, ms: 0.1, onShed: () => { heat && heat.remove(); heat = null; } });
  offs.push(on('diya:lighting', lighting));
  offs.push(on('diya:lit', ({ n, x, y }) => {
    heat && heat.remove(); heat = null; if (n !== 1) return;
    engine.set(0, { leanExtra: 0, glowBoost: 1, scale: 1 }); engine.set(1, { leanExtra: 0 });
    const s = getState(); if (s.calm || s.ink) return;
    ring(x, y); emit('bloom:set', { x, y, r: 190, i: 1, dur: 300 });
  }));
  // zero latency: the press lands in the same frame by direct style write, before React hears about it
  const down = (e) => { const b = e.target.closest && e.target.closest('.lamp-btn:not(.six)'); if (!b || getState().calm) return; pressEl = b; b.style.setProperty('--press', '1'); b.classList.add('e-press'); };
  const up = () => { if (pressEl) { pressEl.style.setProperty('--press', '0'); pressEl.classList.remove('e-press'); pressEl = null; } };
  document.addEventListener('pointerdown', down, true); addEventListener('pointerup', up, true); addEventListener('pointercancel', up, true);
  offs.push(() => { document.removeEventListener('pointerdown', down, true); removeEventListener('pointerup', up, true); removeEventListener('pointercancel', up, true); });
}
export function stop() { offs.splice(0).forEach((f) => f()); unreg && unreg(); unreg = null; heat && heat.remove(); heat = null; document.querySelectorAll('.e-press').forEach((n) => n.classList.remove('e-press')); document.querySelectorAll('.ignite-ring').forEach((n) => n.remove()); engine.set(0, { leanExtra: 0, glowBoost: 1, scale: 1 }); }
export const name = 'hold';
