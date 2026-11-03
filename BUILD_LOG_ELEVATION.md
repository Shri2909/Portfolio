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

## Step 0c + Step 1: E6.8 fix and PACK 2 (tag `elev-after-pack-2`)
- E6.8 fix only: `rowhash.js` `sanitiseName` keeps ZWNJ/ZWJ between letters/marks, drops them at either end, collapses doubles, 20-grapheme cap. Test in `tests/hash.test.mjs`.
- New: `src/elev/{motion,stageDirector,camera,scrollFeel,textMotion,controls}.js`, `src/styles/elev/{motion,camera,text,controls}.css`, `scripts/motion-qa.mjs`, `scripts/lib/motionProbe.js`. Elevation JS now builds to its own chunk `elev-*.js` (so the panic handler can recognise its stack); entry JS unchanged at about 121 KB, elev chunk about 6 KB gz, CSS +1.4 KB gz.
- Small V3 edits (all inert with the flag off): `events.js` `hooks` slots (`scrollTo`, `cardOpen`, `cardClose`), `nav.js` and `LampCard.jsx` call them if set; `Stage.jsx` stops writing `data-act` when elevation is on; `parallax.js` caches its layer list; `ticker.js` stops allocating per frame.
- E2.1 done: tokens, Calm collapse, `motion.js` (EASE, DUR, stagger, play with commitStyles interruption, timeline, read/write, skipAll, flip, clipFlip, transition). Deviation: literal `transition:` times in V3 CSS were NOT rewritten (V3 files stay untouched per E8.1); only `--tone-ms` is remapped under elevation.
- E2.2 done: one passive scroll listener, 50/62% probe, 120 ms + 700 ms commit rules, velocity gate, far jumps commit once with `jump:true`, cues at 60% (`stage:cue`, `onCue`), dialog and `data-busy`/`data-fg` freeze. The ticker subscription is released when scrolling is quiet.
- E2.3 PARTIAL: per-act poses, veil values and the aakhri iris hole, window ripples (baithak, chhat, vidaai) and the "cut by light" jump dip are live. The layer `translate/scale` camera (and drift/roll) is written but OFF (`data-camera`, build flag `VITE_CAMERA=1`): even a static 1.08 overscan raised p95 by 2 to 3 frames under the software rasteriser, and promoting layers made it worse. Re-test on a real phone before enabling. `--act-progress`/`--cam` writes are likewise only made when the camera is on (inherited custom-property writes cost a full style recalc). No `.rig` wrapper was added (R1 allows layer-level properties).
- E2.4 PARTIAL: lamp card now opens as an iris from the lamp's wick with a flame flying to the card corner, and closes the reverse (WAAPI path; low tier iris only; Calm fade). Not built: the View Transitions flight (`transition()` exists but is unused), pane-to-card and wish lift-off FLIPs (those components belong to later packs).
- E2.5 PARTIAL: eased `scrollTo` (own ticker scroller, 500 to 1500 ms, aborted by wheel/touch/key/pointer), native smooth scroll removed under elevation, snap restraint (never on baithak/voice/wish, never mandatory, off while busy), `overscroll-behavior` on dialogs. Deviations: no sticky dwell pinning (a 12svh runway padding on lamp stops instead), focus still moves at the start of a glide (nav.js behaviour), parallax keeps writing `transform` (cached list) rather than CSS variables.
- E2.6 PARTIAL: ember-read sweep on the first headline and the Verdict heading (high tier only; mid: simple rise; low/Calm: final), one text animation at a time, kickers rise as one block. Deviation: no `Split.jsx` and no per-word/letter splitting, because React owns those text nodes; no reveal-lines (needs authored line markup).
- E2.7 done (CSS and delegated listener): press scale .96 with an outer glow ring (box-shadow, no pseudo-elements), spring release, hover lift (fine pointers), focus "ignite", Calm/low variants. Not built: unlit-lamp "breathing dim" and drop ripples (V3 owns those controls).
- E2.8 done: `node scripts/motion-qa.mjs` (director order, jitter, jump, snap, card baseline, Calm, filmstrips in `perf/motion-qa/`). The full trace-based criteria (frame percentiles from tracing, flash screencast, heap) are not implemented; use `npm run perf` for frames.
- Perf-build only: `?off=director,camera,...` bisects modules; `perf.mjs --quick`, and `OFF=` env. No new visible labels were added (nothing in `ui.extra`).
- Perf vs `v3-baseline` (390x844, 4x, software rasteriser): Calm clean (p95 16.7 to 33), high p95 equal to baseline in 8 of 12 acts and one frame-quantum (16.7 ms) higher in 4; mid equal except `voice`. The first attempt (camera layers on) was far worse (p95 100 to 166 ms) and was shed as above. Run-to-run noise on this rig is about one frame quantum, so the remaining differences are not conclusive; confirm on a phone.
