import { getState } from './store.js';
// Android only, feature-detected, user-driven only, never in Calm.
export const haptic = (ms = 10) => {
  try {
    if (getState().calm) return;
    if (typeof navigator !== 'undefined' && navigator.vibrate && /Android/i.test(navigator.userAgent)) navigator.vibrate(ms);
  } catch (e) { /* ignore */ }
};
