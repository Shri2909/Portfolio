import { ticker } from './ticker.js';
import { actions, getState } from './store.js';
import { PERF } from '../elevation.js';
import { hooks } from './events.js';
// Quality governor: sample ~90 frames after first paint, then watch while anything animates.
// Never moves up on its own. Particle caps and DPR caps are exposed for later packs.
export const CAPS = { high: 220, mid: 120, low: 40 }; // particle caps (single source; fx.js imports these)
export const DPR = { high: 1.75, mid: 1.5, low: 1 };
const order = ['high', 'mid', 'low'];
const down = (to) => { const i = order.indexOf(getState().quality); const j = to ? order.indexOf(to) : i + 1; if (j > i) actions.setQuality(order[Math.min(j, 2)]); };

export function startGovernor() {
  if (PERF) { const q = new URLSearchParams(location.search).get('q'); if (order.includes(q)) { actions.setQuality(q); return; } } // perf build only: force a tier
  // initial sampler
  let skip = 10, buf = [];
  const stop = ticker.add((dt) => {
    if (skip-- > 0) return;
    buf.push(Math.min(dt, 100));
    if (buf.length >= 90) {
      stop();
      const s = [...buf].sort((a, b) => a - b), p90 = s[Math.floor(s.length * 0.9)];
      if (p90 > 40) down('low'); else if (p90 > 24) down();
      watchdog();
    }
  });
}
function watchdog() {
  let n = 0, sum = 0, slow = 0, cool = 0;
  ticker.add((dt) => {
    if (getState().calm || hooks.govV2) return; // elevation's governor v2 owns steady-state shedding
    if (cool > 0) { cool -= dt; return; }
    n++; sum += Math.min(dt, 100);
    if (n >= 20) { // smoothed frame time above 24 ms for about 20 frames: one tier down, then wait 3 s
      const avg = sum / n; n = 0; sum = 0;
      if (avg > 24 && avg < 100) { cool = 3000; down(); }
    }
  });
}
