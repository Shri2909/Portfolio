// Tiny window-event helpers. The store is the only emitter of diya:* events.
export const emit = (name, detail = {}) => window.dispatchEvent(new CustomEvent(name, { detail }));
export const on = (name, fn) => {
  const h = (e) => fn(e.detail || {}, e);
  window.addEventListener(name, h);
  return () => window.removeEventListener(name, h);
};
// Hook slots for elevation: null in V3, filled by src/elev modules (and emptied again on stop()).
export const hooks = { scrollTo: null, cardOpen: null, cardClose: null, choreo: null };
