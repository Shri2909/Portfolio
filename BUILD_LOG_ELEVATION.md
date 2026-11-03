# BUILD LOG: ELEVATION

Branch `elevation`, from `origin/v3-flow-and-growth`. Tag `v3-baseline` marks V3 before any elevation (local; not pushed).

## Step 0a: E8.1 kill switch (tag `elev-e8.1`)
- `src/elevation.js` (compile-time flags), `src/elev/index.js` (single entry, `startElevation`, `disableElevation`, 5 s panic window), `src/styles/elev/` (scoped CSS home), `scripts/check-elev-scope.mjs`.
- `src/main.jsx` loads elevation by dynamic import after first render; `VITE_ELEVATION=0` (`npm run build:v3`) removes it.
- `check-build.mjs`: budgets now JS 200 KB, CSS 45 KB, entry 140 KB; prints chunk table and `elevation: ON/OFF`; fails if `__perf`/`VITE_PERF` reach dist.
- Verified: throwing module -> `data-elev="0"`, reason `init:boom`, no page errors, page intact. Flag off: JS 120.6 KB gz (baseline 120.6).
- Deviation: the `?elev=` QA override is omitted until the perf harness (E8.2) needs it.
