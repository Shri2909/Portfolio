// Tiny window-event helpers. The store is the only emitter of diya:* events.
export const emit = (name, detail = {}) => window.dispatchEvent(new CustomEvent(name, { detail }));
export const on = (name, fn) => {
  const h = (e) => fn(e.detail || {}, e);
  window.addEventListener(name, h);
  return () => window.removeEventListener(name, h);
};
