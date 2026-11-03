import { ticker } from './ticker.js';
import { actions, getState } from './store.js';
// Quality governor: sample ~90 frames after first paint, then watch while anything animates.
// Never moves up on its own. Particle caps and DPR caps are exposed for later packs.
export const CAPS = { high: 400, mid: 180, low: 60 };
export const DPR = { high: 2, mid: 1.5, low: 1 };
const order = ['high', 'mid', 'low'];
const down = (to) => { const i = order.indexOf(getState().quality); const j = to ? order.indexOf(to) : i + 1; if (j > i) actions.setQuality(order[Math.min(j, 2)]); };

export function startGovernor() {
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
    if (getState().calm) return;
    if (cool > 0) { cool -= dt; return; }
    n++; sum += Math.min(dt, 100);
    if (n >= 120) {
      slow = sum / n > 22 ? slow + 1 : 0; n = 0; sum = 0;
      if (slow >= 2) { slow = 0; cool = 3000; down(); }
    }
  });
}
