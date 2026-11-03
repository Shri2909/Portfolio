# BUILD LOG: ELEVATION

Branch `elevation`, from `origin/v3-flow-and-growth`. Tag `v3-baseline` marks V3 before any elevation (local; not pushed).

## Step 0a: E8.1 kill switch (tag `elev-e8.1`)
- `src/elevation.js` (compile-time flags), `src/elev/index.js` (single entry, `startElevation`, `disableElevation`, 5 s panic window), `src/styles/elev/` (scoped CSS home), `scripts/check-elev-scope.mjs`.
- `src/main.jsx` loads elevation by dynamic import after first render; `VITE_ELEVATION=0` (`npm run build:v3`) removes it.
- `check-build.mjs`: budgets now JS 200 KB, CSS 45 KB, entry 140 KB; prints chunk table and `elevation: ON/OFF`; fails if `__perf`/`VITE_PERF` reach dist.
- Verified: throwing module -> `data-elev="0"`, reason `init:boom`, no page errors, page intact. Flag off: JS 120.6 KB gz (baseline 120.6).
- Deviation: the `?elev=` QA override is omitted until the perf harness (E8.2) needs it.

## Step 0b: E8.2 performance harness (tag `elev-e8.2`)
- `scripts/perf.mjs`, `npm run perf` (builds `dist-perf` with `VITE_PERF=1`), `perf/baseline-v3.json` written from the V3 build (390x844, 4x CPU, tiers high and mid, normal and Calm).
- `quality.js`: perf build only, `?q=high|mid|low` forces a tier (dead code in production; `check-build` fails if `__perf`/`VITE_PERF` reach dist).
- Baseline reading (software rasteriser, pessimistic): V3 high tier at 4x has p95 33 to 50 ms and 30 to 90% dropped frames in every act; mid tier p95 33 ms, 11 to 34% dropped; Calm is clean (p95 about 16.8 ms). Matches the pack's own diagnosis: no headroom, so every elevation effect must be sheddable.
- Not done yet: per-effect cost table (`window.__perf.cost()`), which needs the E8.3 registry; bundle `manualChunks` split (do with the first lazy modules).
