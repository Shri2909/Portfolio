import { getState } from './store.js';
import { hooks } from './events.js';
// Android only, feature-detected, user-driven only, never in Calm. Numbers still work; names are the E7.3 vocabulary.
const VOCAB = { tick: 8, ignite: [12, 40, 24], settle: 14, nudge: [6, 30, 6], hop: 10 };
export const haptic = (ms = 10) => {
  try {
    const name = typeof ms === 'string' ? ms : '';
    if (name && hooks.buzz) hooks.buzz(name); // visual twin (iPhone parity), set by src/elev
    if (getState().calm) return;
    if (hooks.hapticsOff) return;
    const v = name ? VOCAB[name] : ms;
    if (v != null && typeof navigator !== 'undefined' && navigator.vibrate && /Android/i.test(navigator.userAgent)) navigator.vibrate(v);
  } catch (e) { /* ignore */ }
};
