// Compile-time switches. Rollup deletes the dead branch, so VITE_ELEVATION=0 yields the plain V3 bundle.
export const ELEVATION = import.meta.env.VITE_ELEVATION !== '0';
export const PERF = import.meta.env.VITE_PERF === '1';
