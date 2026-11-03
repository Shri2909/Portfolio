# EK DIYA SE DOOSRA: ELEVATION PROMPTS (the elite-grade upgrade)

For: Claude Code, working in `Shri2909/Portfolio`. Written 3 November 2026 for Shriniwas Kholkute.
This single file holds 66 implementation prompts in eight packs, written by eight design agents (art direction, motion, opening, light and fire, set-pieces, culture and wish, interaction, performance and QA), plus the reconciliations I made where they overlapped. It lifts the visuals, motion, light and interaction of the site to an Awwwards-level, silent, fully Deepavali-themed experience. It does not change facts, claims or copy (those are owned by `V3_IMPLEMENTATION_BRIEF.md`).

## BEFORE YOU START (prerequisites)

1. **V3 must already be implemented.** These packs assume V3's six acts exist (`#night`, `#baithak`, `#lamp-1`..`#lamp-5`, `#voice`, `#lamp-6`, `#verdict`, `#wish`, `#closure`, the Invite sheet, the Menu plus a single Calm corner button). Check: `grep -r baithak src` returns code. If V3 phases 3 to 5 are not merged, stop and finish V3 first. Start from the V3 branch, on a new branch `elevation`.
2. Read `build_prompts.md` (the original packs and contract) and `V3_IMPLEMENTATION_BRIEF.md` PART A (rules), PART C (acts) and PART E (copy) first. The truth, privacy, tone, accessibility and language rules there still apply to every prompt below.
3. Read the code before each prompt. Each prompt names real files; if a file differs, adapt and say so in `BUILD_LOG_ELEVATION.md`.

## WHAT THE RECRUITER SHOULD FEEL (the director's treatment)

- **0 to 2 seconds:** black, then one spark, a wick catching, a flame blooming. Dark terrace revealed by the flame's own growing light. The headline's letters light up as the flame reaches them.
- **2 to 10 seconds:** hold the diya and a second flame reaches toward yours. One ember arcs to lamp 1, and the whole street wakes in a single four-second wave of light: string lights, windows, balconies, rangoli.
- **The proof:** every project is a full-width, lit scene, not a widget: a curtain of 324 bulbs you can touch, a flame on a wire, a phuljhadi that burns a number down to a steady diya, flame passing hand to hand, a ghost flame on a clock. Each is understood in ten seconds without reading.
- **Between acts:** the camera never cuts. You move through one house: doorstep, sitting room, terrace, night sky.
- **The gift:** draw your own rangoli with a finger and watch it fold into warm light, write a wish, and watch a six-second silent card write itself in light. Your lamp joins a sky of lanterns.
- **Everywhere:** light behaves like light. Text, cards and paper are lit by the nearest flame. Nothing is a flat box.

## APPLY ORDER (authoritative; the pack numbers are not the order)

| Step | What | Where in this file |
|---|---|---|
| 0 | Safety net: kill switch, baseline build, perf harness | PACK 8: E8.1, E8.2 (do these FIRST) |
| 0b | Correctness fix: the ZWJ/ZWNJ bug in `rowhash.js` `sanitiseName` | PACK 6: E6.8 (the fix part only) |
| 1 | Motion foundation | PACK 2: E2.1 to E2.8 |
| 2 | Art direction | PACK 1: E1.1 to E1.8 |
| 3 | Light and fire | PACK 4: E4.1 to E4.8 |
| 4 | Governor and rendering rules | PACK 8: E8.3, E8.4 |
| 5 | Opening sequence | PACK 3: E3.1 to E3.8 (includes the hush system) |
| 6 | Set-pieces | PACK 5: E5.1 to E5.10 |
| 7 | Interaction and navigation | PACK 7: E7.1 to E7.8 |
| 8 | Culture, wish and delight | PACK 6: E6.1 to E6.8 |
| 9 | First light, guards, regression, launch | PACK 8: E8.5 to E8.8, the launch checklist |

After every pack: `npm run build`, `npm test`, `npm run check`, the performance harness, filmstrip screenshots, then commit and tag (`elev-after-pack-2` and so on). If a pack regresses frame time or breaks a rule, revert to the tag, set the kill switch off for that feature, and continue.

## FAST PATH (if time is short; each is still a complete upgrade)

E8.1, E8.2 (safety) → E2.1, E2.2, E2.3 (motion and camera) → E1.1, E1.7 (colour script and chrome) → E4.1, E4.4 (light engine and flames) → E3.1, E3.2, E3.3, E3.4 (the opening) → E5.1, E5.9, E5.10 (the green wall, the receipt sheet, proof chips) → E7.5, E7.8 (Menu and Invite) → E8.7 (truth guard) → E8.8 (filmstrips). That is about 20 prompts. Cut order across all packs when time runs out is in PACK 8's master plan; never cut the kill switch, the Calm parity, or the truth guard.

---

## RECONCILIATIONS (where the eight agents overlapped; these decisions win)

R1. **One camera, not three.** E2.3, E1.5 and E3.1 each defined a camera. The camera is E2.3's: a `.rig` wrapper over the fixed stage, `src/styles/camera.css`, the `--cam` drift variable, and the per-act poses, using the individual CSS properties `translate`, `scale` and `rotate` so it composes with `parallax.js`'s `transform`. E1.5 contributes ONLY the rack-focus rules (the `--focus` opacity crossfade of far windows, the halo boost, the `--tone-w` weight) written into `scene.css` and merged into E2's `camera.css`; do NOT create a second `camera.css` or `src/lib/camera.js`, and map E1's `--cam-x --cam-y --cam-z --cam-kick` onto E2's pose values. E3.1 must NOT introduce a `#world` wrapper: the opening pull-back is an extra "pre-open" pose of E2's rig (scale about 1.18 easing to 1.0 over the opening). Every layer that moves with the camera must also set the parallax variables the same way (R5).
R2. **One "hush" mechanism.** E3.5 defines `hush(level, key)` (reference counted, sets `html[data-hush]`), and E5 defines a `fx:foreground` event. Use E3.5's hush as the only mechanism. `fx:foreground {on, id}` is a thin wrapper: on calls `hush(1, 'fg:'+id)`, off calls the release function. E4 (ambient particles, fireflies, ember rate) and E8's governor read `data-hush` and pause ambient effects while it is not "0". Build the hush module when you reach E3.5, but E4 should already test `document.documentElement.dataset.hush` if present.
R3. **Meaning of `--lx --ly --li`.** E4.1 renames the existing root variables in `Stage.jsx` (`--lx/--ly`, used by `#cast`) to `--cast-x/--cast-y`, and gives `--lx --ly --li` (and E1's `--ldx --ldy`) the NEW meaning: per-element light position and intensity written by `lightEngine.js`. Apply E4.1 before any pack that reads them (E1.7, E5, E6, E7).
R4. **Flash limit.** WCAG allows 3 flashes per second; E4.8's guard enforces at most 2 per second. Use 2 per second as the implementation target and 3 as the test ceiling (E8.6).
R5. **`parallax.js` has one owner.** E1.4, E2.3, E2.5, E7.1 and E8.4 all edit it. Do it ONCE: in E2.5 rewrite it as a single rAF that caches its layer list (no per-frame DOM queries), writes CSS variables `--px --py` per layer, and never writes `style.transform` directly; later packs only add: E7.1 swaps the lerp for the spring solver, E8.4 checks it. Do not re-apply the same fix twice.
R6. **Bundle budget (this is a real conflict).** The packs' own estimates add about 120 KB gzipped of JavaScript on top of today's roughly 117 KB, which would break the 200 KB cap if everything loaded eagerly. Policy: **entry bundle at most 200 KB gz; total JavaScript transferred at most 260 KB gz; CSS at most 45 KB gz; fonts at most 90 KB.** Load lazily (dynamic `import()`, prefetched on idle or when the next act is near): E5's set-pieces (per act), E6's rangoli engine, card studio v2, animated card and easter eggs, E4.3's WebGL bloom (only on tier high with WebGL2), and E7's rare delights. Keep eager: the motion kit, stage director, camera, light engine core, flames, particle engine, opening, physics kit, Menu and wayfinding. These sizes are the agents' estimates, not measurements: measure at every checkpoint (E8.2's gate) and apply the cut order if over.
R7. **Everything elevation-related is switchable.** Per E8.1: all elevation CSS is scoped under `html[data-elev="1"]`, all new JS is reached through one `src/elevation/index.js` entry, `VITE_ELEVATION=0` builds the plain V3 bundle, and a runtime error in the first 5 seconds auto-disables elevation. Every pack's CSS and JS must follow that scoping.
R8. **New micro-labels need approval.** The agents proposed new visible labels (examples: `15 min`, `Baithak par waapas`, act names on the trail, skip-tray links, `Press ? for keys`, a Haptics switch, an optional build-stamped Menu line, and every `[NEW LABEL]` in PACK 6). Put them in `ui.extra` marked `_needsApproval`, keep them in plain English or the existing Hinglish style, avoid the banned words, and list them in the final report. Do not invent copy beyond them.
R9. **Content-security policy.** E8 adds `worker-src 'self'` for the optional OffscreenCanvas worker. E6.4 (animated card) and E6.5 may need `blob:` in `img-src` and `media-src` for download and share. If so add exactly those, nothing else, and re-run the network audit (zero third-party requests, no storage, no cookies).
R10. **Fonts.** E1.6 bundles an open-licensed display serif (Fraunces, SIL OFL), subset, at most 90 KB, with system fallback and `font-display: swap`. Measure the real sizes (the agent's numbers are estimates). Add the OFL licence notice to the repo. If the font cannot be subset to budget, use the fallback plan in E1.6, never an external request.
R11. **Windows at tone 0.** V3 G10 asked for about 14 lit windows at first load; E3.4 edits the first two numbers of `LIT` in `SkylineLayer.jsx` (6 and 26). Keep E3.4's numbers (they are choreographed to the street-wakes wave) and make sure the first screen still shows homes.
R12. **Stage cues.** V3 fires one-shot light events at 60% section visibility; E2.2's stage director uses a 50%/62% hysteresis probe and also emits `stage:cue` at 60%. They are compatible: V3's one-shot rule stays for light events; only transform camera drift scrubs. During a glide or jump (E7.7) intersections are ignored.
R13. **Hash scrolling.** E7 needs `hash.js` SCROLL to include `lamp-1`..`lamp-6` and `baithak`, and `row.js` to pass `history.state` through `replaceState` so overlay history is not erased. Apply both when you reach E7.
R14. **First light.** E8.5 puts an inline SVG lit diya in `index.html` (the page is a flame from the first byte, even without JavaScript). E3.1's inline CSS poster must reuse that same element, not add a second one.

## HONEST CAVEATS

- Nothing in this file has been built or run. The agents read the code and the live page, and several measured the V3 snapshot (JS about 120 KB gz, CSS about 16 KB gz). E8 found V3 already has no frame-time headroom at 4x CPU slowdown in headless software rendering (p95 33 to 50 ms through the lamp stretch; these numbers run pessimistic). So every effect must register with the governor and be sheddable.
- Visual quality, taste and real-phone frame rate cannot be proven by headless tests. Check on a real mid-range Android phone before submitting, and keep the kill switch ready.
- WebGL2 bloom, `MediaRecorder` video and View Transitions are support-dependent. Every one has a fallback; test the fallbacks.
- WhatsApp's acceptance of the animated card on every phone is unverified (E6.4 keeps a still PNG as the first fallback).
- Deepavali dates and any festival date must never be printed.



---

# PACK 2: MOTION SYSTEM AND TRANSITIONS (E2)

Position in this file: 1 of 8. Apply order: see the table at the top.

## Pack overview

1. What it elevates: the page today is a fixed night stage with sections that scroll over it and swap (a `veil` fade, a tone step, ad-hoc `transition: .6s ease` and per-component `el.animate` calls with hard-coded numbers). There is no shared timing language, no notion of "where we are" except `html[data-tone]` and a veil toggle, and the lamp card is the only shared-element move. This pack makes the whole page one continuous camera move with one vocabulary of time.
2. What it owns (contract names): CSS `--ease-out-expo`, `--ease-in-out-quint`, `--ease-spring`, `--dur-xs/s/m/l/xl`; `src/lib/motion.js`; `html[data-act]` (doorstep | baithak | chhat | awaaz | aakhri | vidaai), `--act-progress`, event `stage:act {id, progress}`; new `src/lib/stageDirector.js`, `src/lib/scrollFeel.js`, `src/styles/motion.css`, `src/styles/camera.css`, `src/components/Split.jsx`.
3. What it depends on: V3 section ids and a `data-act` attribute on each act section (E2.2 adds it; V3 owns the ids). It reads store `calm`, `quality`, `litCount`; it reuses `lib/ticker.js` (the single rAF) and `lib/events.js`. Light (E4) and Opening (E3) and Set-pieces (E5) subscribe to `stage:act` and `stage:cue`; they never run their own scroll listeners.
4. Honest diagnosis of what is flat today (read from the V3 tree and live screenshots): every section change is an opacity fade; `base.css` has `scroll-snap-type: y proximity` plus `scroll-behavior: smooth` (native smooth scroll has no duration control and fights snap); `parallax.js` writes `style.transform` on `[data-par]` layers (so any camera move on the same elements would collide); `LampCard.jsx` flies the whole card from scale .12 (the text is scaled, not revealed); the brief's rule "one-shot at 60%, never scrubbed" means nothing yet moves while you scroll, so the page feels like slides over wallpaper.
5. The three signature moments (never seen on a portfolio): (A) "The camera never cuts" (E2.3): five dolly, tilt and light-led boundaries over an overscanned fixed stage, so the terrace, the sitting room and the sky are one space; (B) "Ember-read headlines" (E2.6): text is dim until a travelling flame sweeps it and the letters take its colour; (C) "Clip-path FLIP, flame as the shared element" (E2.4): the lamp's own flame flies into the card's corner while the card opens as an iris from the wick, with no stretched text anywhere.

Order inside the pack: E2.1 first (everything uses it), then E2.2, E2.3, E2.4, E2.5, E2.6, E2.7, E2.8 last.

---

### E2.1: Motion tokens and `src/lib/motion.js`

**The astonishment:** Nothing the recruiter touches ever feels "default": every move on every screen shares one easing family and one set of durations, so the whole page feels engineered like a keynote, and a tap during any animation is obeyed in the same frame.

**Build:**
Create `src/styles/motion.css` (import it first in the CSS entry, before `base.css`) and `src/lib/motion.js`.

Tokens in `:root` of motion.css:
- `--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)` (entrances, camera settle), `--ease-in-out-quint: cubic-bezier(0.83, 0, 0.17, 1)` (camera moves, tone changes), `--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1)` (UI settle), `--ease-in-quad: cubic-bezier(0.5, 0, 0.75, 0)` (exits).
- `--ease-spring: cubic-bezier(0.34, 1.45, 0.64, 1);` as the fallback, then `@supports (transition-timing-function: linear(0, 1)) { :root { --ease-spring: linear(0, 0.037, 0.129, 0.254, 0.393, 0.533, 0.662, 0.777, 0.872, 0.948, 1.004, 1.044, 1.068, 1.08, 1.084, 1.08, 1.072, 1.061, 1.05, 1.038, 1.027, 1.018, 1.01, 1.004, 1); } }` (damping 0.62, 8 percent overshoot; use it only for things that land: drops, lamp lit, button release).
- `--dur-xs: 120ms; --dur-s: 240ms; --dur-m: 480ms; --dur-l: 900ms; --dur-xl: 1600ms;`
- Calm collapses time by token: `html[data-calm="1"] { --dur-xs: 0ms; --dur-s: 0ms; --dur-m: 0ms; --dur-l: 0ms; --dur-xl: 0ms; }`. Replace every literal `transition: ... .6s`, `.4s`, `var(--tone-ms)` in `scene.css`, `card.css`, `lamps.css`, `story.css`, `base.css` with the tokens (map .15 to .3s to `--dur-s`, .4 to .7s to `--dur-m`, longer to `--dur-l`; keep `--tone-ms` but define it as `var(--dur-l)`). Add `@property --sweep`, `--hole`, `--act-progress` registrations (syntax `<percentage>`, `<length>`, `<number>`, `inherits` true only for `--act-progress`).
- Rule block comment at the top: animate only `transform`, `opacity`, `clip-path`, `mask-position` and registered custom properties on elements under 300x300 px; never `width/height/top/left/margin/box-shadow/filter` on layers larger than that; `will-change` only while moving (class `.moving`, removed 120 ms after `finished`).

`motion.js` exports (about 150 lines, no dependencies):
- `EASE` (strings equal to the CSS tokens; `EASE.spring` uses `linear()` when `CSS.supports` says so), `DUR` (numbers), `dur(k)` returning 0 when `getState().calm`, else `DUR[k]`.
- `stagger(n, {step=60, from='start'|'end'|'center', total=900})` returning an array of delays whose maximum never exceeds `total` (step shrinks for large n), so 60 windows still finish in under a second.
- `play(el, keyframes, {dur='m', ease='outExpo', delay=0, key, skippable=true})`: WAAPI with `fill: 'both'`; if an animation with the same `key` is running on `el`, call `commitStyles()` on it, cancel it, then start the new one from the committed values (this is interruption without a jump); on finish call `commitStyles()` then `cancel()` so the end state lives in inline style and the Animation is freed.
- `timeline(steps)` where each step is `{at, el, kf, ...opts}` and `at` is a number or `'<'` / `'+=120'`; returns `{play(), finish(), cancel(), reverse(), finished}` (a Promise that swallows AbortError); steps are built paused and started in one rAF so they share a start time.
- `read(fn)` / `write(fn)` two-queue batcher flushed in the single rAF (reads first, then writes) so no code ever reads layout after writing it in the same frame.
- `skipAll()` plus one capture-phase passive listener (`pointerdown`, `keydown`, `wheel`, `touchstart`) that finishes every `skippable` timeline within the same event. This is the "any tap completes it" rule from V3 PART C.
- `scrollTo(y, {dur})`: own rAF scroller (see E2.5). `flip(el, firstRect, opts)` and `transition(fn, opts)` (see E2.4).

**Files likely touched:** `src/styles/motion.css` (new), `src/lib/motion.js` (new), `scene.css`, `card.css`, `lamps.css`, `story.css`, `base.css`, `LampCard.jsx` (swap its inline durations), `nav.js` (import).

**Tiers and Calm:** high and mid use tokens as written. Low multiplies nothing but staggers cap at `total: 450`. Calm: every token is 0 ms and `play()` jumps straight to the final keyframe, so the still frame is the finished frame.

**Budget:** about 2.2 KB JS gzipped, 1.2 KB CSS gzipped; no per-frame cost (only a batcher that is idle when empty).

**Verify:** unit-test `stagger(60, {step: 60, total: 900})` max delay is at most 900; `getComputedStyle(documentElement).getPropertyValue('--dur-l')` equals 900ms normally and 0ms after `setCalm(true)`; grep shows no `transition:` with a literal time in `src/styles`; start two `play()` calls with the same key 50 ms apart and assert the element's transform never jumps by more than 1 px between frames (sample with rAF).

**Guardrails:** tokens only, no new magic numbers in components; nothing in motion.js touches facts, copy or storage.

---

### E2.2: Stage director: acts, hysteresis, `--act-progress`, one-shot cues

**The astonishment:** The page always knows which room you are standing in, and never stutters between rooms: every other effect (sky, light, windows, cat, sparks) listens to one calm conductor instead of six competing observers.

**Build:**
Create `src/lib/stageDirector.js`, started from `Stage.jsx` (replace its veil `IntersectionObserver`; keep the `data-veil` attribute alive for one release by deriving it: veil on whenever the act is not doorstep).

1. Source of truth: add `data-act="doorstep|baithak|chhat|awaaz|aakhri|vidaai"` to each act section in `App.jsx`/the section components: `#night` and `#lamp-1` doorstep; `#baithak` baithak; `#lamp-2..5` and `#row-breathes` chhat; `#voice` awaaz; `#lamp-6` aakhri; `#verdict`, `#wish`, `#closure` and the footer vidaai. If an attribute is missing, fall back to an id table inside the director.
2. Geometry cache: on load, on `ResizeObserver` of `main` and each act section, and after `document.fonts.ready`, measure `offsetTop` and `offsetHeight` into an array inside `read()`. The scroll handler never touches layout.
3. One passive scroll listener sets `dirty = true`, stores `y`, direction (ignore deltas under 4 px) and velocity (EMA of px per ms), and the shared `ticker` callback does the rest. No second scroll listener may exist anywhere in the codebase.
4. Probe line with a dead band: when scrolling down the probe is at 50 percent of the viewport height, when scrolling up it is at 62 percent. A new act is a candidate only when the probe has crossed its start; it commits only if it stayed the candidate for 120 ms AND at least 700 ms passed since the last commit. If the candidate is two or more acts away (a Menu jump or hash link), commit immediately with `jump: true`.
5. On commit: set `html.dataset.act`, `html.dataset.dir`, fire `emit('stage:act', {id, progress: 0, prev, dir, jump})`.
6. `--act-progress`: progress through the current act (0 to 1), quantised to 1/64 and written to `documentElement.style` only when the quantised value changes (at most 64 writes per act, so inherited style recalcs stay cheap). Camera drift uses its own `--cam` variable written on `#stage` only (see E2.3).
7. Cues: any element with `data-cue="name"` is observed by one `IntersectionObserver` (threshold 0.6, no rootMargin). After 150 ms of staying at 60 percent it fires once: adds class `cued`, `emit('stage:cue', {name, el})`, unobserves. Provide `onCue(name, fn)` in motion.js for components. Reduced motion or Calm: cue fires on first intersect and the element also gets `data-final="1"`.
8. Velocity gate: while `|velocity| > 2.5 px/ms` do not commit acts or fire cues; resume when velocity stays under 0.6 px/ms for 80 ms. A reader who flings through the page therefore lands in one act and plays one short transition instead of a queue of five.
9. Optional high-tier enhancement: where `CSS.supports('animation-timeline: view()')`, give the `#stage` layers a named `timeline-scope` so camera drift can be compositor-driven; otherwise JS writes `--cam` (see E2.3). Do not build both paths in this prompt: ship the JS path, leave the CSS path behind a `data-scrolltl` flag for E8.

**Files likely touched:** `src/lib/stageDirector.js` (new), `Stage.jsx`, `App.jsx`, the act section components, `nav.js`, `src/lib/events.js` (no change).

**Tiers and Calm:** director runs identically in all tiers (it is cheap); low tier skips `--act-progress` writes. Calm still sets `data-act` so each act has its own still pose.

**Budget:** about 1.8 KB JS gzipped; one ticker subscriber that runs only when `dirty`; under 0.1 ms per frame.

**Verify:** Playwright: scroll through the page in 100 px steps and record `stage:act` events: exactly 6 acts in order, no repeats. Jitter test: park 20 px before each boundary and scroll plus/minus 30 px 200 times: at most 1 act change. Menu jump from doorstep to aakhri fires one event with `jump: true`. Fling at 3000 px/s over the whole page fires at most 2 events. Screenshot not needed; log `html[data-act]` per scroll offset.

**Guardrails:** one scroll listener, one observer for cues, no layout reads in scroll handlers, no events during overlays (`dialog[open]` pauses the director).

---

### E2.3: The camera rig and the five act-to-act transitions

**The astonishment (signature moment A, "The camera never cuts"):** Scrolling from the doorstep to the sitting room to the terrace and on to the night sky feels like one steady-cam shot through a real house: the world dollies, tilts, warms and dims; the reader never sees a section "swap".

**Build:**
Create `src/styles/camera.css`. The fixed `#stage` becomes a camera rig:
- Overscan: wrap the stage layers in `.rig` and give each depth layer `scale: 1.08` as its resting scale so the camera can pull back without showing edges. Layers and parallax depth `d`: `#sky` 0.15, `#skyline` far 0.4, mid 0.7, near 1.0, `#terrace` 1.0.
- Collision rule: `parallax.js` keeps writing `style.transform` (pointer parallax). The camera uses the individual properties `translate` and `scale` (and `rotate` for the 1.2 degree finale roll), which compose with `transform`. Never write `transform` for camera moves.
- Poses as variables per act: `html[data-act="baithak"] { --cx: -6; --cy: 0; --cz: 1.06; --veil: .35; }` etc. (units: `cx` in vw, `cy` in svh, `cz` multiplier on overscan). Each layer: `translate: calc(var(--cx) * var(--d) * 1vw) calc(var(--cy) * var(--d) * 1svh); scale: calc(1.08 * var(--cz));` with `transition: translate var(--dur-xl) var(--ease-in-out-quint), scale var(--dur-xl) var(--ease-in-out-quint)`. Nearer layers get `--dur-l` and farther `calc(var(--dur-xl) + 300ms)` so near layers lead and the sky lags: that lag is the depth. CSS transitions retarget from the current value, so scrolling back reverses mid-move with no jump.
- In-act drift: `--cam` (0 to 1, written on `#stage` by the director's ticker callback from the act progress) adds `calc(var(--cam) * 1.5vw * var(--d))` of slow lateral drift so the stage is alive while you read; transform-only.
- While a transition runs add `.moving` to `#stage` (will-change on four layers only), remove 120 ms after the longest transition ends.

Poses (cx, cy, cz, veil): doorstep (0, 0, 1, 0); baithak (-6, -1, 1.06, .35); chhat (4, 0, 1, .15); awaaz (0, -2, 1.03, .40); aakhri (0, 0, 1.12 with `transform-origin` at lamp 6 via `--l6x --l6y`, veil .82 with a radial hole); vidaai (0, 8, 1, .30, plus 1.2 degree roll).

The five boundaries (t is from the director's commit, token names are the durations; E4/E5 hang their light and fx on `stage:act`):
1. Doorstep to baithak: t0 string lights ease to 60 percent (`--dur-m`); t120 camera dolly in and pan left (`--dur-xl`, in-out-quint); t240 the nearest building's five windows warm in a ripple towards the baithak window (stagger 70 ms); t300 sky crossfades to the warm window-scene (`--dur-l`); t700 veil to .35; Lamp 1's text exits upward 12 px at 0.5x speed (exits are half as long as entrances); cat, kandil and sparks pause.
2. Baithak to chhat: t0 the lit pane brightens 1 to 1.6 (`--dur-s`) and its glow "spills" as the veil lowers to .15; t200 camera dollies out and pans right; the parapet and silhouettes of lamps 2 to 5 rise 8 svh into place (`--dur-l`, out-expo); t500 string lights ripple back on left to right (45 ms stagger).
3. Chhat to awaaz: after the row's breath, ambient layers fade (`--dur-l`): sparks stop, `--sway` falls from 1 to 0, windows dim to 50 percent except two; camera leans in (cz 1.03, cy -2) as if listening; a thin flame line draws left to right under the compare track (900 ms).
4. Awaaz to aakhri ("lights out"): veil to .82 with a registered `--hole` radius animating from 100vmax to 18vmin around the dashed lamp (`--dur-xl`); windows go out right to left (40 ms stagger); string lights to 15 percent; camera dollies to the lamp; then a deliberate 400 ms in which nothing moves (the contrast), then the "Proposed, not run" chip rises.
5. Aakhri to vidaai ("the lights return"): veil releases to .30 (`--dur-xl`); camera pulls back, tilts up 8 svh and rolls 1.2 degrees; sky gold rises; all windows warm in a wave from the horizon outward (80 ms stagger, 12 windows); string lights bloom to full.

Jump mode (`jump: true`): skip staggers and run poses at `--dur-m` with a 240 ms brightness dip on the veil (a "cut by light").

**Files likely touched:** `src/styles/camera.css` (new), `scene.css` (layer wrappers), `Stage.jsx`, `SkyLayer.jsx`, `SkylineLayer.jsx`, `Terrace.jsx`, `Dusk.jsx`, `stageDirector.js`.

**Tiers and Calm:** high: all beats, staggers, drift. Mid: halve stagger counts (every second window), no drift, no roll. Low: no camera translate or scale at all, only veil, sky and string-light crossfades at `--dur-m`. Calm: the pose of the act applies instantly (veil and lights, and the pan and scale pose too, with transitions at 0 ms); the five still poses are each distinct and beautiful.

**Budget:** about 0.5 KB JS, 3 KB CSS gzipped; at most 5 composited layers moving, transform and opacity only; target under 4 ms main thread per frame during a transition.

**Verify:** use the deterministic filmstrip (E2.8) to capture each boundary at t = 0, 240, 600, 1100, 1600 ms at 390x844 and 1366x768: layers must be translated, never cross-faded as a whole, no edge of any layer visible (check the four screenshot corners are not the page background colour), text legible (AA) at the end of each boundary. Trace shows no layout and no paint of the skyline during a transition.

**Guardrails:** these are visuals only, no new copy; the camera never moves while a foreground interaction (hold, guess, slider, compare, wish form) is active (`html[data-busy="1"]` freezes the pose; the director defers the commit).

---

### E2.4: Shared-element transitions with FLIP (lamp to card, card to lamp, pane to card, wish lift-off)

**The astonishment (signature moment C):** You tap a lamp and its flame detaches, flies into the corner of a letter while the letter opens outward from the wick like light filling a room; close it and the letter folds back into the flame. No text is ever stretched.

**Build:**
Add `flip()` and `transition()` to `motion.js`.

`flip(el, firstRect, {dur='l', ease='outExpo', key})`: after a state change has been committed with `flushSync`, read `Last = el.getBoundingClientRect()` in the same frame as First (viewport coordinates, so scroll between the reads cannot corrupt it); invert `translate(dx, dy) scale(sx, sy)` with `transform-origin: 0 0`; animate to `none` through `play()`. Use uniform FLIP (one scale) only for things with no text (flame, plate, canvas card). For anything with text use clip-path FLIP: animate `clip-path: inset(t r b l round R)` from the First rect expressed as insets of the final box to `inset(0 round R)`.

`transition(fn, {names, ready})`: if `document.startViewTransition` exists and not Calm and tier is not low, call it; the callback must return a Promise that resolves when the DOM is final (fire `emit('card:ready')` from `LampCard`'s open effect after `showModal()`, resolve on it with a 300 ms timeout); `await vt.ready` then run any WAAPI the caller passes in `ready`; catch every rejection and fall back to calling `fn()` plus the WAAPI path. Assign `view-transition-name` to an element only for the duration of the transition (set before, remove on `vt.finished`) so names stay unique.

1. Lamp to card (`LampCard.jsx`, replace the existing scale-from-.12): the shared element is the flame. Name the lamp's flame `lamp-flame` and the card's `.card-flame` `lamp-flame` in the new state; the browser flies it (`::view-transition-group(lamp-flame)` with `animation-duration: var(--dur-l); animation-timing-function: var(--ease-out-expo)`). In `ready`, animate the card body `clip-path: circle(0 at var(--wx) var(--wy))` to `circle(160% at var(--wx) var(--wy))` over `--dur-l` with `--ease-out-expo`, where `--wx --wy` are the wick position in card coordinates; the paper text fades in at 35 percent (`--dur-m`). Fallback (no VT): clone the flame SVG, FLIP it from lamp rect to card-flame rect with the same timing, same iris.
2. Card to lamp: close button, Escape or swipe-down release past 120 px or 0.5 px/ms: iris closes (`circle(160%)` to `circle(0)` at `--dur-m`, `--ease-in-out-quint`, which is about 0.55x the opening), the flame flies back, lamp gets the existing `.flash` plus one `ember` burst. A swipe in progress follows the finger 1:1 and on release continues with the release velocity, not from a fixed start.
3. Baithak pane to card (E2's contract for V3 Act 2): First is the lit pane's SVG rect; the card beneath is a full-size element with a warm gold plate; clip-path FLIP from the pane's inset to `inset(0 round 18px)` over `--dur-l`, text fades up 200 ms later (`--dur-s`); the previous card does the reverse in `--dur-s` first, so only one card exists at a time.
4. Wish card lifting off the desk (`DeskScene.jsx` to `CardStage.jsx`): the card is a fixed-aspect canvas, so uniform FLIP from the desk thumbnail rect, composed with `perspective(900px) rotateX(62deg)` easing to `rotateX(0)`; phase one (0 to 35 percent of `--dur-xl`) lifts 24 px and tilts to 38 degrees, phase two settles with `--ease-spring`; a contact-shadow ellipse (scale .9 to .6, opacity .5 to .2, two stacked layers crossfaded, never an animated blur) stays on the desk. Hand off to CardStage's tilt by initialising its tilt state from the card's current rotation and easing it with its existing lerp.

**Files likely touched:** `motion.js`, `LampCard.jsx`, `Flame.jsx` (accept a `vtName` prop), `card.css`, `Person.jsx`/`Baithak` panes (V3), `DeskScene.jsx`, `CardStage.jsx`, `Wish.jsx`.

**Tiers and Calm:** high: VT flame flight plus iris. Mid: WAAPI FLIP path, iris kept. Low: iris only, 240 ms, no flame flight. Calm: card appears in place at once with its final state (existing fade 160 ms becomes 0).

**Budget:** about 2 KB JS, 0.6 KB CSS; the iris animates clip-path on one element for 900 ms (one paint layer).

**Verify:** open and close lamp 1 ten times via keyboard and pointer: focus returns to the lamp, no leftover `view-transition-name`, `document.getAnimations().length` returns to its baseline, heap growth under 2 MB. Mid-transition `Escape` finishes within 1 frame. Filmstrip at t = 0, 150, 400, 900 ms shows the flame between the lamp and the card corner and the card as a growing circle, never a scaled-down card.

**Guardrails:** the dialog's focus trap and `Escape` behaviour stay native; VT is wrapped so an unsupported or rejected call can never block opening.

---

### E2.5: Scroll feel: eased jumps, snap restraint, sticky dwell, single-rAF parallax

**The astonishment:** The page glides: flicks keep their momentum, Menu jumps travel like a camera move instead of a teleport, and slow readers are never snapped away from a sentence.

**Build:**
Create `src/lib/scrollFeel.js` (the director from E2.2 shares its scroll state; this file owns programmatic scroll and sticky helpers).

1. Programmatic scroll: `motion.scrollTo(y, {dur})` runs in the shared ticker with `--ease-in-out-quint`; duration is `clamp(500, 380 + 0.42 * |dy|^0.82, 1500)` ms; it sets `html.style.scrollSnapType = 'none'` and `scrollBehavior = 'auto'` while running and restores both after; it aborts instantly on `wheel`, `touchstart`, `keydown`, `pointerdown` (passive listeners), leaving the page exactly where the user took over. Replace `scrollIntoView({behavior:'smooth'})` in `nav.js` and the "Agla diya" chevron with it; remove `html[data-calm="0"] { scroll-behavior: smooth }` (native smooth has no duration control and fights snap). Calm: `scrollTo` jumps. Move focus after arrival (existing heading focus), not at the start.
2. Snap restraint: keep `scroll-snap-type: y proximity` only; `scroll-snap-align: start` only on the act "stops" that are about one screen tall (`#night`, `#lamp-1..6`, `#closure`); never on `#baithak`, `#voice`, `#wish` (tall reading blocks); add `scroll-snap-stop: normal`; disable snapping entirely while any `dialog[open]` or while `html[data-busy="1"]`. Never `mandatory`.
3. Sticky dwell choreography: give each lamp stop a runway: the section is `min-height: 100svh` plus an inner wrapper `position: sticky; top: var(--topbar-h)`, and a `padding-bottom: 20svh` runway so the lamp's hook, interaction and "Poora kissa" button stay pinned while about 20 svh of scroll passes: momentum scrolls carry past it naturally, and the director's cue (`data-cue="lamp-arrive"`) fires at 60 percent. Never pin for more than 1.2 screens, never pin two things at once.
4. Parallax and drift: one reader, one writer. `scrollFeel` exposes `scrollY` and `v` to the ticker callbacks of `parallax.js` (pointer) and the director (`--cam`); they all run in the one `ticker` subscription frame. Foreground layers that move with scroll (the lamp row, kicker glyphs) use `translate3d` written via `write()`, with a maximum of 8 moving elements. Optional high tier: `@supports (animation-timeline: scroll(root))` for the topbar condense and one near-layer parallax as pure CSS, no JS.
5. Thrash rules: all geometry is read in `read()` and cached by `ResizeObserver`; scroll handlers are passive and do no DOM writes; no `getBoundingClientRect` inside `scroll`, `pointermove` or a ticker frame without `read()`; `touch-action: pan-y` on card and compare areas as already present; `overscroll-behavior-y: contain` on dialogs only (never on the root, so pull-to-refresh and bounce stay native).

**Files likely touched:** `src/lib/scrollFeel.js` (new), `nav.js`, `base.css`, `lamps.css` (runways), `parallax.js`, `stageDirector.js`, `TopBar.jsx`.

**Tiers and Calm:** high: drift and one near-layer scroll parallax. Mid: drift only. Low: none, snapping only. Calm: no drift, `scrollTo` instant, snap proximity stays (it is not motion).

**Budget:** about 1 KB JS, 0.4 KB CSS; zero extra rAFs (uses the ticker).

**Verify:** CDP `Input.synthesizeScrollGesture` flick at 3000 px/s: scroll distance must be at least 90 percent of a no-snap baseline (snap not hijacking). Menu jump to `#lamp-6`: eased, duration between 500 and 1500 ms, aborted by a wheel event within 1 frame, page keeps the user's position. Trace: zero forced reflows (`Layout` events with `stackTrace` inside scroll handlers).

**Guardrails:** never prevent default on touch or wheel, never lock scroll, never re-scroll the page after the user has taken over.

---

### E2.6: Text motion: ember-read headlines, mask lines, word rise, one per screen

**The astonishment (signature moment B):** The headline is dim, then a small flame sweeps across it and each letter takes the light as it passes, so the recruiter literally watches the flame read the sentence. It is the one text effect on the screen; everything else is perfectly still.

**Build:**
Create `src/components/Split.jsx` and `src/styles/motion.css` text section.

Rule: one text animation per screen. The director adds `data-text-live` to at most one element at a time (first cue wins; the others get `data-final`). Text never re-animates on scroll-back; it stays lit.

1. `reveal-lines` (default for headlines, V3's authored lines "324 tests passed." / "Then an audit found 19 problems." / "Ship karte? Imaandari se bataiye."): each authored line is wrapped `<span class="ln"><span>text</span></span>`; `.ln { overflow: hidden; display: block }`, inner starts `translateY(105%)`, ends 0 over 700 ms `--ease-out-expo`, stagger 90 ms. Split by authored line breaks, never by DOM measurement. (V3's timing 0.4 s, 1.4 s, 2.4 s is honoured by `delay` props.)
2. `ember-read` (signature, one per page: the first headline, plus the Verdict first line): `h1.ember` uses `background: linear-gradient(100deg, var(--cream) calc(var(--sweep) - 14%), var(--flame-core) calc(var(--sweep) - 4%), rgba(255, 243, 220, .16) calc(var(--sweep) + 6%)); -webkit-background-clip: text; background-clip: text; color: transparent;`; animate registered `--sweep` from -20% to 120% over `--dur-xl` (`--ease-in-out-quint`); add `filter: drop-shadow(0 0 .3em rgba(255, 179, 71, .5))` via class only during the sweep and remove it after `finished`; the final state is plain `color: var(--cream)` (remove the clip), so contrast is AA at rest and the selectable text is never transparent for more than 1.6 s. Without `@property` support: skip, show final.
3. `word-rise` (kickers, short pull-lines of 14 words or fewer): `<Split mode="words">` renders each word as `inline-block` with `--i`; `translateY(.5em)` plus opacity 0 to rest, 520 ms `--ease-out-expo`, per-word delay `min(60, 900 / n)` ms. Keep real text nodes and a trailing space between spans so screen readers read normally.
4. `letter-rise` only for labels of 24 characters or fewer (chip labels, the "Paanch diye jal uthe." caption): 30 ms stagger, 400 ms.
5. Paragraphs: never split; fade 12 px up as one block over `--dur-m`.
6. Trigger: `data-cue` at 60 percent (E2.2), with the velocity gate; any tap or key calls `skipAll()` which finishes text instantly. Calm: final state, no animation.
7. Contrast: before settle, text is allowed to be dimmer than AA only during the animation; Playwright axe runs after 2 seconds.

**Files likely touched:** `src/components/Split.jsx` (new), `Night.jsx`, `Verdict.jsx`, `Closure.jsx`, `Lamp.jsx` hook text, `motion.css`, `base.css` (h1 rules).

**Tiers and Calm:** high: all. Mid: ember-read becomes a simple 900 ms opacity-and-translate line reveal (no clip text, no drop-shadow). Low: fade only at `--dur-m`. Calm: final state, text fully lit.

**Budget:** about 0.9 KB JS, 1 KB CSS; the sweep repaints one h1 (under 100k px) for 1.6 s.

**Verify:** at t = 0, 400, 900, 1600 ms (seek animations, E2.8) the h1 shows dim to lit left to right with a gold band between; at 2.5 s computed `color` is cream, no `background-clip` remains, axe contrast passes; never more than one element has `data-text-live`; with Calm, the screenshot at 0 ms equals the screenshot at 3 s.

**Guardrails:** text is lifted verbatim from the copy, never edited; word and letter splitting never changes what a screen reader hears or what copy-paste returns.

---

### E2.7: Micro-interaction standards (press, hover, focus, drag, drop, no error shake)

**The astonishment:** Every control feels like a small physical object: a thumb press is acknowledged inside one frame, releases settle with a hint of spring, and nothing ever scolds you.

**Build:**
Add a "Controls" section to `motion.css` and one delegated listener in `motion.js`.

- Latency: `touch-action: manipulation` on all controls; one delegated `pointerdown` (capture, passive) adds `.is-down` to the nearest `[data-press], .btn, button, a` and removes it on `pointerup|cancel|leave`, so feedback does not rely on `:active` (iOS) and lands in the same frame.
- Press: scale .96 in `--dur-xs` (120 ms) `--ease-out-quart`; a `::before` glow ring (radial `rgba(255,179,71,.45)`, `inset: -6px`, same border radius) opacity 0 to .6 in 120 ms so the feedback is visible around the finger, not under it. Primary buttons also darken `::after` overlay to .12 opacity.
- Release: back to 1 via `--ease-spring` over 360 ms (overshoot to 1.02 is intended); the glow fades over `--dur-s`.
- Hover (only inside `@media (hover: hover) and (pointer: fine)`): `translateY(-1px)` and ring opacity to 1 over `--dur-s`; never scale above 1.03; links draw their underline by `background-size` 0 to 100 percent over `--dur-s`.
- Focus-visible: keep the 3 px ring; add "ignite": `outline-offset: 7px` to 3px in `--dur-xs`; never animate the ring away on blur (instant off).
- Drag (hold ring, late-reply slider, compare handle, card swipe): the dragged object follows the pointer 1:1 with no smoothing; secondary followers (flame lean, glow, sparks) use lerp .18 per frame; on release, project velocity over 420 ms with `--ease-out-expo` to the nearest snap point; Android haptic of 8 ms at snap points (existing `haptic()`), none elsewhere.
- Drop and lit: landing is scale 1.08 to 1 over 360 ms `--ease-spring` plus one ring ripple (a pseudo-element circle scale .6 to 1.6, opacity .5 to 0, 600 ms `--ease-out-expo`); one ripple per drop, never stacked (a second drop within 300 ms skips the ripple).
- Error-free: no shake, no red, no "wrong" language (the project's tone rule). An unavailable action (for example tapping an unlit lamp, or an empty wish) answers with the control "breathing dim": opacity .55 to .85 once over `--dur-m`, plus the helper line fading in over `--dur-s`; the unlit lamp wick glows faintly (`fizzle` fx, 360 ms). Disabled controls have no motion at all.
- Surfaces: menu open `--dur-s` out-expo (close 160 ms in-quad); bottom sheets open `--dur-m` out-expo (close 320 ms in-quad); toasts 240 ms in, 4 s hold, 240 ms out.
- Target and contrast rules unchanged: 44 px hit areas, glow rings do not count towards the 44 px.

**Files likely touched:** `motion.css`, `base.css` (`.btn`), `lamps.css`, `story.css`, `Lamp.jsx`, `WishForm.jsx`, `motion.js`.

**Tiers and Calm:** high and mid: as above. Low: press scale only, no ripple, no glow ring. Calm: press scale .98 with 0 ms duration (a static pressed state is still visible), no hover lift, ring ripple off.

**Budget:** about 0.4 KB JS, 1.2 KB CSS; one delegated listener.

**Verify:** Playwright pointerdown on each of 8 control types: `.is-down` present within one rAF, computed scale between .95 and .97 after 130 ms; release shows a transform above 1.0 at some frame within 360 ms (spring) except in Calm; keyboard focus ring present on tab for every control; tap an unlit lamp: no `shake` keyframes exist anywhere (grep), helper text appears; screenshot of a pressed primary button shows the glow ring outside the button edge.

**Guardrails:** feedback never blocks the action; no motion encodes an error as a threat, and nothing here flashes more than 3 times a second.

---

### E2.8: Motion QA protocol (prove no jank, with deterministic filmstrips)

**The astonishment:** Nobody sees this, but it is why the page never drops a frame in front of the one reader who matters.

**Build:**
Create `scripts/motion-qa.mjs` (Playwright, not shipped to production) and `scripts/lib/motionProbe.js` injected through `page.addInitScript` only. Nothing is added to the site bundle.

Probe (injected): an rAF loop recording frame deltas; `PerformanceObserver` for `long-animation-frame` (with script attribution), `longtask`, `layout-shift`, `event` (durationThreshold 40, for INP); a `getAnimations()` counter sampled every 250 ms; a `window.__acts` log from `stage:act`.

Rig: Chromium with `deviceScaleFactor 2`, `isMobile`, `hasTouch`, viewport 390x844 (and 1366x768 desktop); CDP `Emulation.setCPUThrottlingRate` at 4 (mid-range Android) and 6 (low); `Tracing` via `browser.startTracing(page, { categories: ['devtools.timeline', 'disabled-by-default-devtools.timeline.frame', 'cc', 'gpu', 'benchmark'] })`; scroll driven by `Input.synthesizeScrollGesture` (real compositor momentum), never `scrollTo`.

Scenarios (each runs 3 times, median taken):
1. Slow read at 400 px/s over the full page. 2. Fling at 3000 px/s. 3. Menu jump to every act. 4. Boundary trap: stop 100 px before each of the five boundaries and scroll slowly across. 5. Interaction during a transition: tap a lamp 200 ms after a boundary commits, close it, open again 10 times. 6. Reduced motion (`reducedMotion: 'reduce'`) and Calm toggled manually. 7. Ink look.

Pass criteria at 4x throttle on the high tier: p50 frame at most 16.8 ms, p95 at most 20 ms, p99 at most 34 ms, no single frame above 50 ms during a transition, dropped-frame ratio from trace `PipelineReporter` states (`STATE_DROPPED_FRAME`) at most 4 percent, zero `long-animation-frame` above 50 ms attributable to our scripts, CLS 0, INP at most 100 ms, live animations at most 40, elements with `will-change` at most 8, compositor layers at most 40 (`LayerTree.enable`), JS heap growth under 5 MB after 10 card cycles. At 6x the governor must demote to low within 3 s, and the low tier must then pass at 4x criteria.

Deterministic filmstrips: to review transitions without timing noise, call `document.getAnimations().forEach(a => { a.pause(); a.currentTime = t; })` at t = 0, 120, 240, 480, 900, 1600 ms (CSS transitions included), screenshot each into `.../shots/elev_2/<boundary>/<t>.png`, and stitch with a contact sheet. Reviewers look for: whole-layer cross-fades (bad), visible layer edges (bad), clipped text (bad), light before layout (good).

Interrupt and Calm tests: `pointerdown` mid-timeline finishes all `skippable` animations within one rAF; in Calm, 300 ms after load `getAnimations().filter(a => a.playState === 'running' && !a.effect.target.closest('[data-essential]'))` is empty and the screenshot's mean luminance and edge density exceed a non-blank threshold (the page is never blank). Flash safety: CDP `Page.startScreencast`, mean luminance per frame, count swings above 25 percent: at most 3 per rolling second.

Output: one JSON plus a console table, non-zero exit if any criterion fails; run it after E2.3, E2.4 and again as the final E8 gate.

**Files likely touched:** `scripts/motion-qa.mjs` (new), `scripts/lib/motionProbe.js` (new), `package.json` scripts.

**Tiers and Calm:** the protocol runs once per tier (force with `fx:setQuality`) and once in Calm.

**Budget:** zero shipped JS or CSS.

**Verify:** the script itself fails when a deliberately heavy `filter: blur(30px)` is added to `#skyline` (sanity check that it can detect jank), then passes after reverting.

**Guardrails:** the probe never ships, never stores, never sends data; it runs only in headless tests.

---

## Risks and cut order

Risks: (1) `parallax.js` and the new camera both move the same layers: solved by individual `translate` and `scale` properties, but verify Safari 15 and below (no individual transform properties: fall back to wrapping each layer in a camera div). (2) V3 PART C says stage changes are "one-shot, never scrubbed"; this pack scrubs only transform drift (`--cam`, at most 1.5vw) and keeps every light event one-shot, so it respects the spirit; drop `--cam` first if it conflicts. (3) View Transitions plus `showModal()` is a Chromium-first path and may glitch with the top layer: the WAAPI path is the guaranteed one, VT is an enhancement behind a try/catch. (4) `@property`-animated `--sweep` and `--hole` repaint per frame: keep them on tiny elements and on the high tier only. (5) Dead-band hysteresis can feel late on desktop wheel scrolls: tune the 50/62 percent probes after the first real device test.

Cut order (cut from the bottom, never leave a half-done one): 1) the CSS scroll-timeline option and `--cam` drift; 2) the pane-to-card and wish lift-off FLIPs (keep the lamp card); 3) `ember-read` (keep `reveal-lines`); 4) boundary 3's flame line and boundary 5's roll; 5) VT flame flight (keep WAAPI iris). Never cut: tokens and `motion.js` (E2.1), the director with hysteresis (E2.2), the camera poses with Calm still-states (E2.3 minimal: veil, sky and string-light changes), the scroll abort rules (E2.5), and the QA script (E2.8).


---

# PACK 1: ART DIRECTION (E1)

Position in this file: 2 of 8. Apply order: see the table at the top.

Author: Elevation Agent E1 of 8. Applied second (after E2 Motion system, before E4 Light and fire). Prompt numbers E1.1 to E1.8.

## Pack overview

1. Elevates the whole look: one colour script per act, a grading pipeline over the stage, a code-drawn material kit (clay, brass, marigold, cotton, paper, concrete, glass, silk, grain), a real depth model with a camera, a bundled serif voice, brass/paper/clay UI chrome, a first-screen composition law and a 10-question visual QA rubric.
2. Depends on E2 (`--ease-*`, `--dur-*`, `html[data-act]`, `--act-progress`, `stage:act`). If E2 has not landed, every rule below falls back to the existing `html[data-tone]`, and `data-act` blocks are simply inert.
3. Hands off to E4 (light engine writes `--lx --ly --li`, `--ldx --ldy` per element, `bloom:set`; this pack only provides the colour slots `--c-key --c-fill` and the material CSS that consumes those variables), to E3 (opening uses the type markup and `.ignite` tokens), to E5 (set pieces use the plane and camera rules), to E7 (dialog choreography; this pack only supplies the "letter" surface), to E8 (budgets, tier checks).
4. Honest diagnosis of what is flat today (checked on the live page at 390x844 and 1366x768): (a) skyline fills at tone 0/1 are `#1C2040 / #262747 / #30304F`, so the NEAR blocks are the LIGHTEST: depth is inverted and the city reads as lavender cardboard; (b) the terrace is a two-stop brown gradient with a flat bar for a parapet, no grit, no contact shadow; (c) tone layers `.sky-ember` and `.sky-gold` reach full opacity at tone 4 to 5, which will blanket any act palette for acts 4 to 6 (the five lamps are lit before Awaaz); (d) text sits in `rgba(25,16,10,.92)` brown rectangles with a 1px border: generic; (e) the headline renders in Noto Serif or Georgia, and Hinglish italics fall to a sans oblique; (f) buttons are flat outlines, chips are 9px outlines, nothing feels like an object; (g) no grain: the 8-bit sky gradient bands on phones.
5. Palette values in this pack were contrast-checked by computation (numbers quoted inline). Gold is light; kumkum and leaf stay fills and never text on dark.

Shared names used here (new, owned by this pack): CSS variables `--c-sky0 --c-sky1 --c-sky2 --c-hz --c-haze --c-key --c-fill --c-lift --c-scrim --scrim-a --veil-a --vig --tone-w --focus --cam-x --cam-y --cam-z --cam-kick`, classes `.paper .brass .tag .cloth .grit .reading`, module `src/lib/materials.js`, component `src/components/MaterialDefs.jsx`, component `src/components/Split.jsx`, stylesheet files `src/styles/acts.css materials.css type.css chrome.css`. Event: none new.

---

### E1.1: Colour script per act and the grading pipeline

**The astonishment:** The page changes colour like a film: the cold indigo hush of the doorstep, tungsten amber in the sitting room, indigo melting to plum as lamps are lit, a teal-ink quiet for the voice, near-black with one ember for the proposal, and a full marigold afterglow at the exit. Shadows never go dead, and the whole picture sits under one warm grade.

**Build:**
Create `src/styles/acts.css` (import after tokens.css and scene.css). Register animatable slots with `@property` (syntax `<color>`, inherits true) for `--c-sky0 --c-sky1 --c-sky2 --c-hz --c-haze --c-key --c-fill --c-lift` and (syntax `<number>`) for `--vig --veil-a --tone-w --scrim-a`. On `html` add `transition` for all of them over `var(--dur-xl)` with `var(--ease-in-out-quint)` (calm: `0ms`). Set the values per `html[data-act="…"]`; default (no data-act) equals doorstep.

| act | sky0 / sky1 / sky2 | hz (horizon glow) | haze | key | fill | lift | vig | veil-a | tone-w |
|---|---|---|---|---|---|---|---|---|---|
| doorstep | #04050C / #0A0C1E / #1A1636 | #3A2347 | #2A2650 | #FFB347 | #6E86C8 | #14102A | .55 | 0 | 1 |
| baithak | #120C12 / #2A1810 / #4A2A14 | #7A4A1E | #5A3A22 | #FFC067 | #B86B3A | #241410 | .42 | .35 | 0 |
| chhat | #0A0A1E / #1B1430 / #3D1D2F | #5A2A2C | #3A2A5A | #FFB347 | #7F8FD6 | #1A1226 | .44 | 0 | 1 |
| awaaz | #070A14 / #0C1424 / #14202E | #1E2E3A | #1E2A40 | #FFD27A | #4F7C8A | #0E1626 | .50 | .40 | .35 |
| aakhri | #030308 / #06060C / #0B0810 | #1A0C0C | #120C18 | #FF7A1A | #3A2A3A | #0A0810 | .70 | 0 | 0 |
| vidaai | #22152B / #6B3440 / #C9703A | #F2A94E | #E9A56A | #FFE2A0 | #FFB347 | #3A1E24 | .22 | .25 | 1 |

Rewire the stage in `scene.css`: `.sky-night` becomes `linear-gradient(var(--c-sky0), var(--c-sky1) 45%, var(--c-sky2) 100%)`; `.sky-ember` and `.sky-gold` opacity formulas are multiplied by `var(--tone-w)` (this is the fix for the blanket problem); the `#veil` opacity becomes `var(--veil-a)` (keep `data-veil` as the fallback when `data-act` is absent). Within chhat the tone still warms the sky exactly as today.

Grading pipeline, in `Stage.jsx` after `#vignette`, as four fixed `aria-hidden` layers inside `#stage` (never over text): (1) `#g-lift`: solid `var(--c-lift)`, `mix-blend-mode: lighten`, opacity .85: raises blacks to a coloured shadow instead of dead black; (2) `#g-bloom`: radial-gradient at `var(--lx) var(--ly)` from `color-mix(in srgb, var(--c-key) 28%, transparent)` to transparent at 55%, `mix-blend-mode: screen`, opacity `calc(.25 + var(--tone)*.07)` (E4 will drive position and intensity); (3) `#g-warm`: `rgba(255,170,90,.05)` with `mix-blend-mode: soft-light`; (4) `#vignette` uses `var(--vig)` plus a "breathing" `@property --vb` (number) animating between -.03 and +.03 over 7s ease-in-out alternate, added to `--vig`.

Reading safety: define `.reading` (and apply it to `.panel`, `.take-card`, `.person-panel`, `.sec` copy blocks) as `background: color-mix(in srgb, var(--c-scrim) calc(var(--scrim-a)*100%), transparent)` with `--c-scrim:#120A06`, `--scrim-a:.82` (never below .72). Computed worst case over the brightest horizon `#FFE2A0`: cream 8.3:1, text-dim 6.0:1, flame-core 6.4:1 at .72; at .82 they are 11.5, 8.3, 8.9.

**Files likely touched:** `src/styles/acts.css` (new), `src/styles/scene.css`, `src/styles/tokens.css`, `src/styles/story.css` (panel classes), `src/components/stage/Stage.jsx`, `src/main.jsx` (import).

**Tiers and Calm:** High: all four grade layers, vignette breathing. Mid: drop `#g-lift` and `#g-bloom` blend layers (bake lift into the sky2 stops by using `--c-lift` as the last gradient stop), keep warm grade as plain `rgba` normal blend at .03. Low: one combined overlay (vignette plus warm tint as a single gradient), no blend modes, no breathing. Calm and reduced motion: act changes switch instantly (no transition), vignette fixed at the act value, same palette: still beautiful, never blank.

**Budget:** +1.8 KB CSS gz, +0.3 KB JS. Cost: 2 blend layers on high only, estimated 0.6 ms per frame when static; the palette transition runs once per act change (about 1.6 s) on the compositor-friendly gradient layers only.

**Verify:** Headless: for each act set `document.documentElement.dataset.act` and screenshot at 390x844 and 1366x768; assert computed `--c-sky0` per act; assert no layer has opacity>0 for `.sky-gold` in aakhri. Ghost-text contrast sampler: for every visible element with text, set `* {color: transparent !important; text-shadow: none !important}`, screenshot its box, take the 95th-percentile luminance of the pixels behind it, compute contrast against its real colour: require at least 4.5 (3.0 for 24px and above) in every act at tone 0, 3 and 6, calm on and off. Screenshots must show six clearly different palettes, aakhri nearly black with one warm point, vidaai visibly gold at the horizon, and no banding in the sky at 390 wide.

**Guardrails:** Colour only changes by act and tone, never as a reaction to pointer movement; no blend layer ever sits above text; kumkum and leaf stay fills.

---

### E1.2: Procedural material kit and film grain (no image files)

**The astonishment:** Paper has fibres you could pick up, the terrace has grit you can almost feel, the sky has a whisper of film grain: everything on screen looks handled, and nothing is a flat vector.

**Build:**
Create `src/lib/materials.js` exporting `initMaterials()`, called from `main.jsx` inside `requestIdleCallback` (timeout 400ms) after first paint. Using the seeded `mulberry32` from `lib/rand.js`, it paints four tiles on one `<canvas>`, converts each with `toDataURL('image/png')` (the CSP allows `img-src data:`; do NOT use blob URLs), sets `--tx-grain --tx-fibre --tx-grit --tx-dust` on `:root` as `url(data:…)`, then sets `html.mat-ready` (CSS fades materials in over 600ms; before that, CSS gradients stand alone).

Tiles (all seamless: draw anything within 24px of an edge again at the wrapped offset):
1. grain 128x128: greyscale, per pixel `128 + gaussian * 38`, opaque.
2. fibre 256x256, transparent: 260 curved strokes (quadratic, length 5 to 24px, width .5 to .9px), 65% `rgba(110,80,40,α)` with α .05 to .14, 35% `rgba(255,248,230,.18)`, plus 14 dark flecks 1 to 1.6px `rgba(70,45,20,.35)`.
3. grit 192x192, transparent: 1,400 speckles radius .4 to 1.3px alternating `rgba(255,230,190,.10)` and `rgba(0,0,0,.22)`, 6 pebbles radius 1.8 to 3 with a one-pixel highlight, and 40 large soft blobs radius 20 to 48 at alpha .03 to hide tiling.
4. dust 320x320, transparent: 22 cream specks radius .6 to 1.6 alpha .25, four hair fibres (curved, 14 to 30px, alpha .18).

Create `src/components/MaterialDefs.jsx`: a 0x0 `aria-hidden` inline SVG mounted once in `App.jsx`, holding: `#deckle` (feTurbulence fractalNoise baseFrequency .035, numOctaves 3, seed 4, into feDisplacementMap scale 6), and the symbols defined in E1.3 (`#petal-a/b/c`, `#marigold-1/2/3`).

`src/styles/materials.css` (new), all class-based so other packs can reuse:
- `.paper`: `background-color:#F6E8C8; background-image: var(--tx-fibre)`, ink text `#16110C` (15.4:1), `::before` layer with the same colour, `filter:url(#deckle)` (deckle edge on the backing only, so text is never distorted), soft shadow `0 14px 30px rgba(0,0,0,.5)`. Raking-light bump: two extra fibre layers `background-position: calc(var(--ldx,0)*1px) calc(var(--ldy,-.6)*1px)` (white, mix `lighten`) and the opposite sign (dark, `multiply`), so the grain re-lights when the flame moves (E4 supplies `--ldx --ldy`, default light from above).
- `.grit`: concrete, `background-image: var(--tx-grit)`, `background-blend-mode: overlay`.
- `.cloth`: weave via `repeating-linear-gradient(0deg, rgba(0,0,0,.10) 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, rgba(255,255,255,.05) 0 1px, transparent 1px 3px)`; silk sheen `linear-gradient(105deg, transparent 35%, rgba(255,230,170,.28) 48%, transparent 60%)` with `background-position-x: calc(var(--act-progress,0) * 220% - 60%)` so the sheen travels as the camera moves.
- `#grain-layer` (fixed, inside `#stage`, above the grade): `background: var(--tx-grain)`, opacity .05, `mix-blend-mode: overlay`; on high only, `animation: grainstep 1s steps(3) infinite` shifting `background-position` between three offsets (3 changes per second, 5% opacity: far inside the flash limit). `#dust-layer`: `var(--tx-dust)`, opacity .35, `mix-blend-mode: screen`, static.

**Files likely touched:** `src/lib/materials.js` (new), `src/components/MaterialDefs.jsx` (new), `src/styles/materials.css` (new), `src/App.jsx`, `src/main.jsx`, `src/components/stage/Stage.jsx`.

**Tiers and Calm:** High: all four tiles, grain jitter, dust, raking-light bump layers. Mid: grain static and plain alpha (no blend), no dust, bump layers on (cheap). Low: generate only fibre and grit at half size, no grain, no dust, no bump layers. Calm: grain static (it is texture, not motion), materials identical, no jitter.

**Budget:** +1.6 KB JS gz, +1.4 KB CSS gz; tile generation at most 40 ms in idle; the four tiles total under 60 KB in memory; the jitter animates `background-position` on one layer only (no layout, no paint of other layers).

**Verify:** Headless: assert `getComputedStyle(root).getPropertyValue('--tx-fibre')` starts with `url(data:image/png`; assert `html.mat-ready`; zero network requests with a request listener; measure `initMaterials()` with `performance.now()` under 60 ms (headless, 4x CPU throttle under 240 ms). Screenshot crop of the verdict note at 2x: visible fibres and a slightly irregular edge; crop of the terrace floor: visible speckle, no visible tile seam at 1366x768.

**Guardrails:** No external image, no blob URL, nothing stored; a missing tile must leave the plain colour surface intact.

---

### E1.3: Hero objects drawn properly: clay diya, cotton wick, marigold, window glass

**The astonishment:** The diya is a thing: warm clay that glows from the inside when lit, with hand-turned ridges and a glaze fleck; the wick is twisted cotton; the toran marigolds have ruffled backlit petals; every window is a home with curtains and a hint of reflection.

**Build:**
`src/components/Lamp.jsx` (keep `shape(n)` and the per-lamp `VARS`; layer on top, in this draw order inside the `rotate` group): (1) body path with `clay${n}` gradient (change stops in `lamps.css` to `--clay-hi:#E36A2E`, mid `#C2410C`, dark `#6E2306` plus a fourth stop `#3A1204` at 1.0 for the underside); (2) three hand-turned throwing lines, each a slightly curved stroke across the bowl following the bottom curve, `rgba(0,0,0,.18)`, width .8; (3) a "fingerprint press" dent on the lip for lamps 1 and 3 (ellipse `--clay-dark`, .7); (4) glaze fleck: 7 seeded specks per lamp (4 cream `#FFE9C2` at .5, 3 dark `#3A1204` at .6, radius .5 to 1.2); (5) subsurface glow: a copy of the body path clipped by `bowl${n}`, filled with `radial-gradient` centred at the wick (`#FF7A1A` at .55 to transparent at 70%), `mix-blend-mode: screen`, opacity `calc(var(--li,0) * .9)` (E4's `--li` per lamp; default 0 unlit, .7 when `.is-lit`), so the inside of the clay lights up; (6) oil ellipse with a crescent highlight; (7) soot ring brightens near the wick; (8) rim lit edge: a 1px `rgba(255,214,150,.6)` stroke along the rim facing the wick when lit.
Cotton wick: replace the single stroke with three: base stroke `#E9DCC0` width 3; twist overlay `#B9A883` width 3 with `stroke-dasharray: 1.2 2.2`; wet lower 40% via `linearGradient` (`userSpaceOnUse`) from `#6A4A22` to transparent; two 3px loose fibres at the tip (`stroke #E9DCC0`, .8 wide). Lit: tip char `#1A1008` plus an ember dot `#FF5A10` radius 1.1 pulsing opacity .7 to 1 over 1.4s (calm: static .9).

Marigold: in `MaterialDefs.jsx` define `<symbol id="marigold-1|2|3">` 36x36: three concentric rings (14 outer petals, 10 mid, 6 inner), each petal a rounded teardrop with two gradient stops and a 0.5px lighter vein line; colours drawn from the distribution 55% `#F5A623`, 25% `#FF8A00`, 12% `#FFC93C`, 8% `#D6531A`; a dark centre `#7A3A06` radius 3; a translucent rim stroke `rgba(255,230,150,.5)` .5px so petals look backlit. Replace the flat toran flower shapes in `Terrace.jsx` (`Toran`) with 14 `<use href="#marigold-n">` plus leaves (`#2F6B4F` fill with a lighter vein) on a `.cloth` string-band. 90 paths in defs, 14 uses.

Window glass, in `SkylineLayer.jsx` `WinRects`: near layer windows get: interior vertical gradient `#FFD27A` to `#E8892B`; a 1px dark mullion cross (`rgba(20,10,5,.55)`); a curtain sliver (28% width, `rgba(80,30,10,.35)`) on a seeded side; a diagonal reflection streak (white .10, skewed -20deg) on one in three. Mid layer: mullion only. Far layer: plain pane. Temperatures: 62% candle `#FFC067`, 22% bulb `#FFD98A`, 8% tubelight `#E8F0D8`, 8% TV `#8FB4E8` (keep the flicker).

**Files likely touched:** `src/components/Lamp.jsx`, `src/styles/lamps.css`, `src/components/MaterialDefs.jsx`, `src/components/stage/Terrace.jsx`, `src/components/stage/SkylineLayer.jsx`, `src/styles/scene.css`.

**Tiers and Calm:** High: subsurface glow blend, reflection streaks, ember pulse. Mid: glow as plain alpha radial (no blend mode), no streaks. Low: no glow overlay, no streaks, wick twist kept (static). Calm: ember static, everything at final lit state.

**Budget:** +1.5 KB JS gz, +0.8 KB CSS gz; at most 6 extra nodes per diya, +260 nodes in the skyline near layer only (24 windows times ~6).

**Verify:** Headless: count `.lamp svg` children under 40 each; assert `use[href^="#marigold"]` count is 14. Screenshot a 4x crop of lamp 1 lit versus unlit: the lit bowl interior must read warmer (sample the bowl pixel hue shifts toward orange by at least 15 degrees) and the wick shows a visible twist; crop of a near window shows a mullion.

**Guardrails:** Everyday objects only (clay diya, cotton wick, marigold string): no deity imagery, no puja props.

---

### E1.4: Depth model: atmospheric perspective, plane rules, bokeh foreground

**The astonishment:** The skyline finally has distance: far towers dissolve into a gold-violet mist, near blocks are crisp dark silhouettes edge-lit by the lamps, and out-of-focus warm discs drift in the foreground like a lens in front of the terrace.

**Build:**
Define seven planes with one rule table (put it as a comment block at the top of `scene.css` and implement as CSS custom properties):

| plane | element | `--par` | `--dolly` | haze % | notes |
|---|---|---|---|---|---|
| P0 | `#sky` | .05 | .01 | 0 | gradient only |
| P1 | `.lay.far` | .2 | .03 | 62 | pane at 70% opacity, halo bigger |
| P2 | `.lay.mid` | .5 | .06 | 34 | |
| P3 | `.lay.near` | .8 | .10 | 12 | edge-lit |
| P4 | `.parapet`, `.lights-wrap` | 1.0 | .16 | 0 | crisp |
| P5 | `.floor`, rangoli | 1.0 | .16 | 0 | contact shadows |
| P6 | foreground bokeh | 1.4 | .30 | 0 | out of focus |

Fix the inversion: silhouette fill = `color-mix(in oklab, #07050A calc(100% - var(--haze)), var(--c-haze) var(--haze))` with haze 62/34/12 for far/mid/near; delete the `html[data-tone="0"|"1"] .lay.*` lavender overrides in `story.css`. Near is the darkest, far is closest to the mist colour. Add `.skyline-mist`: `linear-gradient(to top, var(--c-hz), transparent)` over the bottom 55% of `#skyline`, opacity by act (doorstep .18, baithak .30, chhat `.18 + tone*.06`, awaaz .10, aakhri .05, vidaai .60), replacing the current `#skyline::after` constant.
Edge light: in `SkylineLayer.jsx` each near block gets a 2px-wide `rim` rect on the side facing the lamp row, `fill: var(--c-key)` at .22 (.35 in vidaai). Terrace (`scene.css`): the floor becomes `.grit` over `linear-gradient(var(--ground-3), var(--ground-2))`; draw perspective expansion joints with one inline SVG: 9 lines from the vanishing point (50% of the stage width, at the parapet baseline) to the bottom edge at x of 0, 12, 25, 37, 50, 62, 75, 88, 100 percent plus 5 horizontal joints at y offsets following `1.6^i` spacing, `rgba(0,0,0,.28)` 1px with a 1px cream .05 highlight below each. Add a contact shadow under the parapet (`linear-gradient(rgba(0,0,0,.45), transparent)` 14px tall) and a plaster texture on the parapet face (`.grit` at half strength) with a lit top edge (existing 2px cream line, raised to .38 when `--tone` above 2).
Foreground bokeh `#bokeh` (new, in `Terrace.jsx`, P6): 7 discs, diameter 38 to 110px, radius gradients `radial-gradient(circle, rgba(255,190,100,.30), rgba(255,190,100,.12) 55%, transparent 70%)` with a brighter 1.5px ring at the edge (lens-like), placed along the bottom corners and the upper left, seeded positions, colours from `--c-key` and `--c-fill`, opacity `calc(.35 + var(--tone)*.05)`, no filter, no blur. Parallax: change `parallax.js` `apply()` to set CSS variables `--px` and `--py` on `[data-par]` (instead of writing `transform`) so the camera (E1.5) can compose; each plane uses `transform: translate3d(calc(var(--px,0)*1px), calc(var(--py,0)*1px), 0)`.

**Files likely touched:** `src/styles/scene.css`, `src/styles/story.css`, `src/components/stage/SkylineLayer.jsx`, `src/components/stage/Terrace.jsx`, `src/lib/parallax.js`.

**Tiers and Calm:** High: rim edges, mist, 7 bokeh, contact shadows. Mid: 4 bokeh, no rim rects. Low: no bokeh, mist as a static gradient, joints omitted. Calm: parallax off (already), bokeh static, everything else identical.

**Budget:** +1.0 KB JS gz, +1.2 KB CSS gz; no new blur, no new blend layer; bokeh are 7 composited divs.

**Verify:** Headless: in a screenshot of the skyline strip, assert average luminance of the near-layer region is lower than mid, and mid lower than far (near is darkest). Assert `#bokeh` has 7 children and no `filter`. Screenshot at 1366x768 must show the mist glow at the horizon, a visible join between parapet and floor with a shadow, and soft discs in the lower corners that do not touch text.

**Guardrails:** No `filter: blur` and no `backdrop-filter` anywhere in the stage; bokeh never sit above text or under the hold button's hit area.

---

### E1.5: Camera rig and rack focus (signature: the page changes focus like a lens)

**The astonishment:** As you move from the doorstep to the terrace the camera slowly dollies in, and focus pulls like a cinema lens: first the far street windows are crisp and the foreground is dreamy; by the terrace the lamps are tack sharp and the whole city melts into glowing bokeh dots. Nobody expects a portfolio to rack focus.

**Build:**
Add `src/styles/camera.css`. Register `@property --cam-x --cam-y --cam-z --cam-kick --focus` (syntax `<number>`, inherits true, initial 0) and transition them on `html` over `var(--dur-xl)` with `var(--ease-in-out-quint)` (calm 0ms). Per-act targets:

| act | cam-x | cam-y | cam-z (dolly 0..1) | focus (0 far, 1 near) | drift over `--act-progress` |
|---|---|---|---|---|---|
| doorstep | 0 | 0 | 0 | 0.15 | z +.01 |
| baithak | .06 | 0 | 0 | .45 | x +.02 |
| chhat | 0 | -.02 | .30 | 1 | z +.35, y -.02 |
| awaaz | 0 | -.02 | .62 | .8 | z +.04 |
| aakhri | 0 | -.01 | 1.0 | 1 | z +.08 |
| vidaai | 0 | .04 | 0 | .3 | y +.02 |

Effective values: `--cam-z-eff = calc(var(--cam-z) + var(--act-progress,0) * var(--drift-z,0) + var(--cam-kick))`. Every plane (E1.4 table) gets `transform: translate3d(calc(var(--px,0)*1px + var(--cam-x)*var(--par)*var(--vw)*1px), calc(var(--py,0)*1px + var(--cam-y)*var(--par)*var(--vh)*1px), 0) scale(calc(1 + var(--cam-z-eff) * var(--dolly) * .22))`, `transform-origin: 50% 62%` (the horizon), `will-change: transform` on the seven plane roots only. Dolly total at cam-z 1: sky +0.2%, far +0.7%, mid +1.3%, near +2.2%, terrace +3.5%, bokeh +6.6%: tiny, but the differential is what the eye reads as parallax depth. `--vw` and `--vh` are set once by `useWindowSize` as unitless viewport sizes. E5 and E3 may add a temporary push by setting `--cam-kick` (0 to .15) and clearing it.

Rack focus by crossfade, no blur: in `scene.css` far and mid windows get `.pane` opacity `calc(1 - var(--focus) * .55)` and `.halo` opacity `calc(.18 + var(--focus) * .5)` (halo radius bumped 1.6x on far) so near-in-focus makes distant windows read as soft glowing discs; the foreground bokeh discs get opacity `calc(.25 + (1 - var(--focus)) * .5)` (they are the out-of-focus plane, so they show most when focus is far and fade when focus is near). Rangoli and lamp flames get `opacity: calc(.8 + var(--focus)*.2)`. High tier only: add `filter: blur(1px)` to `.lay.far` when `--focus` above .8, applied as a class toggle (`html[data-focus="near"]`) set by one `stage:act` listener, never animated.

Place the logic of `--focus` and camera in CSS only; JS only sets `data-act` (E2). Add `src/lib/camera.js` (about 25 lines) that, on `stage:act`, writes `--vw/--vh` and the `data-focus` class; nothing per frame.

**Files likely touched:** `src/styles/camera.css` (new), `src/styles/scene.css`, `src/lib/camera.js` (new), `src/lib/parallax.js`, `src/components/stage/Stage.jsx`, `src/main.jsx`.

**Tiers and Calm:** High: dolly, focus crossfade, one static `blur(1px)` on the far layer. Mid: dolly at half amplitude, focus crossfade, no blur. Low: no dolly (scale fixed 1), focus crossfade only (opacity). Calm: transitions 0ms, the act's final camera and focus values apply immediately, still composed.

**Budget:** +0.5 KB JS gz, +0.9 KB CSS gz; per-frame cost: transforms on 7 promoted layers (about 0.4 ms), only during an act change (1.6 s) or pointer parallax.

**Verify:** Headless: set `data-act` to each value, wait 1.8 s, read `getComputedStyle(documentElement).getPropertyValue('--focus')` against the table; compare screenshots doorstep and chhat: far window pane brightness drops and halo grows. Assert no `filter` property on any element when `data-quality="mid"`. Measure frame times during a doorstep to chhat transition with the tracing API: p95 below 20 ms on the default headless profile. Screenshot at chhat must show soft glowing window dots in the far layer and sharp lamps and parapet.

**Guardrails:** The camera never moves text, hit targets or the lamp row relative to each other (all of them live in the DOM above the stage); total scale change on any plane stays below 7%.

---

### E1.6: Type system: a real display serif, a Hinglish voice, numerals that burn

**The astonishment:** The headline no longer looks like a default; it looks set. "324" and "19" are lit numerals with a hot core and amber base, and every Hinglish phrase switches to an italic serif voice, so the page has two voices: sans for facts, serif italic for how it sounds.

**Build:**
Font: Fraunces (SIL OFL 1.1, Undercase Type; variable axes opsz 9 to 144, wght 100 to 900, SOFT, WONK). Source: `npm i -D @fontsource-variable/fraunces` (build-time only, keep the OFL text in `src/fonts/OFL.txt`) or the upstream release; if there is no network at implementation time, skip the whole prompt and keep the system stack (the CSS below degrades to it). Make two files with fonttools (`pip install fonttools brotli`): `fonttools varLib.instancer Fraunces[...].ttf opsz=9:72 wght=420:700 SOFT=40 WONK=0 -o roman.ttf`, then `pyftsubset roman.ttf --unicodes=U+0020-007E,U+00A0,U+20B9,U+2013,U+2014,U+2018,U+2019,U+201C,U+201D,U+2026,U+00B7,U+2022,U+00D7,U+2192 --layout-features=kern,liga,lnum,tnum,onum --flavor=woff2`. Italic: instance `opsz=14:48 wght=440:620 SOFT=40 WONK=1` (the wonky italic leans friendlier). Size plan (estimates, measure and report): roman 36 to 46 KB, italic 28 to 38 KB, total at most 80 KB. If the total exceeds 90 KB, pin italic opsz to 24 and weight to 500 (italic becomes about 16 KB). Plan B if Fraunces cannot be subset: Young Serif (OFL, single weight, about 25 KB), roman only.
Files go in `src/fonts/`, referenced from `src/styles/type.css` via `@font-face` with `font-display: swap`, `unicode-range` as above, and a metric-matched fallback face: `@font-face{font-family:"Fraunces Fallback"; src: local("Georgia"), local("Noto Serif"); size-adjust: 104%; ascent-override: 92%; descent-override: 24%; line-gap-override: 0%}` (tune so the h1 breaks onto the same three lines before and after the font loads; verify in a screenshot at 360 and 390 wide). Add the roman file to `<link rel="preload" as="font" crossorigin>` through the existing `transformIndexHtml` hook in `vite.config.js`. `--font-display: "Fraunces","Fraunces Fallback","Iowan Old Style","Noto Serif",Georgia,"Noto Serif Devanagari",serif`. Fraunces' soft, ball-terminal old-style forms sit comfortably beside Noto Serif Devanagari should any Devanagari ever appear.

Scale (set `font-optical-sizing:auto`): h1 weight 560, `clamp(1.9rem, min(8.2vw, 6.4svh + 1.1rem), 4.5rem)`, line-height 1.04, letter-spacing -.012em at 48px and above; h2 weight 540 `clamp(1.6rem, 6.4vw, 2.75rem)`; h3 600 1.25rem; body stays the system sans 17px/1.55 (18px at 768+).
Numerals: `.num` gets `font-feature-settings:"lnum","tnum"` and a flame fill `background: linear-gradient(#FFF0C2, #FFD27A 50%, #FFB347)` with `-webkit-background-clip:text; color:transparent` and `color:#FFD27A` fallback inside `@supports not (background-clip:text)`, plus `text-shadow` only via `filter: drop-shadow(0 0 .35em rgba(255,179,71,.45))` on `.num` (cheap, small). Contrast of the dimmest stop `#FFB347` on `#05060D` is above 9:1.
Hinglish rule (single global rule, replaces the italic rules in `base.css`): `[lang="hi-Latn"]{font-family:var(--font-display); font-style:italic; font-weight:480; font-size:1.04em; letter-spacing:.005em}`; exceptions: inside `.btn`, `.chip`, `.tag`, `.kicker` keep the UI font (sans, not italic). English is never italic except real emphasis.
Kinetic-ready markup: create `src/components/Split.jsx` with `<Split mode="words|chars">`: walks children, wraps only plain text nodes (leaving `.num`, `<hi>` and links intact), outer element gets the original text as `aria-label`, inner spans `aria-hidden`, each unit gets `style={{'--i': n}}`. Rule: `chars` mode ONLY for monospaced or tabular runs (the kicker, numerals, the sign-off date) because inline-block letters break serif kerning; serif headlines split by `words` only. Add tokens `--stagger-w: 70ms; --stagger-c: 28ms` and a utility `.ignite .c{ color: var(--flame-b); animation: ignite 700ms var(--ease-out-expo) calc(var(--i)*var(--stagger-c)) both }` going `#FF7A1A` to inherit (E3 chooses where to use it; calm: no animation).

**Files likely touched:** `src/fonts/*` (new), `src/styles/type.css` (new), `src/styles/base.css`, `src/components/Split.jsx` (new), `vite.config.js`, `index.html`, `src/lib/rich.jsx` (ensure `<hi>` output carries `lang="hi-Latn"`).

**Tiers and Calm:** All tiers: same fonts. Low tier on a slow network: system fallback with the metric-matched face (no layout shift). Calm: `.ignite` and kinetic animations disabled; text at final state; gradient numerals unchanged.

**Budget:** Fonts at most 90 KB (outside the JS and CSS budgets), +0.4 KB JS gz, +0.9 KB CSS gz.

**Verify:** Headless: `document.fonts.check('600 40px Fraunces')` true after load; `performance.getEntriesByType('resource')` shows only same-origin font files, total under 90 KB; CLS under 0.02 across font swap (PerformanceObserver); every `[lang="hi-Latn"]` computed `font-style` italic and `font-family` starts with Fraunces except inside `.btn`. Screenshots at 390 and 1366: h1 in a high-contrast display cut, "324" and "19" visibly warmer at the base, the Hinglish lines clearly a different voice from the English.

**Guardrails:** Open-licensed font only, subset, own origin; never split serif text per letter; copy text is untouched.

---

### E1.7: UI chrome in the same world: brass, paper tags, flame focus, letter dialogs, reading surfaces

**The astonishment:** Buttons are lamp-lit brass you want to press, chips are luggage tags tied to the lamps, dialogs are letters on handmade paper, focus is a breathing flame ring. Even the menu looks like it belongs to the same room. One rule governs it all: things you read at length are paper, things you press are brass or clay, things that are the world are light and dark.

**Build:**
New `src/styles/chrome.css`. Replace `.btn-primary` with `.brass`: ring via `border: 3px solid transparent; background: linear-gradient(#E7BE6A, #D2A04A) padding-box, conic-gradient(from 210deg at 30% 20%, #6B4A14, #E8C06A 12%, #8A6120 25%, #F4D98C 38%, #7A5418 55%, #D8AB55 70%, #6B4A14) border-box`; ink text `#1B1208` on the face (10.5:1 at the light end, 7.8:1 at the dark end: never put a face darker than `#C98F3A`, 6.6:1); bevel `box-shadow: inset 0 1px 0 rgba(255,240,200,.7), inset 0 -2px 3px rgba(60,30,0,.45), 0 6px 14px rgba(0,0,0,.45)`; `:active` translates 1px and removes the top bevel; lit mode: when `litCount` above 0 add a flame reflection `radial-gradient(circle at 25% 20%, rgba(255,224,150,calc(var(--tone)*.05)), transparent 55%)` as the top background layer. INVITE ME uses `.brass` and, per V3, is demoted in size (min-height 44px, padding 8px 14px) so it stops being the loudest object.
Secondary `.btn`: transparent, border `1.5px` of `#E3CFAE` at .7 (3:1 non-text contrast met), hover and focus add `0 0 0 4px rgba(255,179,71,.18), 0 0 24px rgba(255,179,71,.25)`.
`.tag` (replaces `.chip`): paper tag, 11px minimum text (never 9px), padding 4px 10px, `clip-path: polygon(8px 0, 100% 0, 100% 100%, 0 100%, 0 8px)` for the notched corner, a punched hole `radial-gradient(circle at 7px 7px, transparent 2.2px, rgba(0,0,0,.35) 2.8px, transparent 3px)` and a 1px thread (a 14px-tall `::before` curve in `#8A6B3A`). Unlit: kraft `#A28B64` with ink text (5.7:1); lit: cream paper `#F6E7C6` (15.3:1) with a warm glow. Per V3 the labels appear only when each lamp is lit: the tag mounts with a 280ms swing-in (rotate -14deg to 0, `--ease-spring`, transform-origin at the hole).
Focus: keep the 3px solid `--flame-core` outline and 3px offset (accessibility), and make the halo breathe: `box-shadow: 0 0 0 7px rgba(255,179,71,.28), 0 0 22px 6px rgba(255,140,40,.35)` animating spread 7px to 9px over 2.4s alternate; for `.btn` and `.lamp-btn` add a 7x10px flame `::after` (teardrop `border-radius:50% 50% 50% 50%/62% 62% 38% 38%`, `radial-gradient` core to `--flame-b`) pinned at the top-right corner, flickering scale .92 to 1.06.
Dialogs as letters: `dialog.overlay` (sixty, evidence, invite, lamp sheet) gets `.paper` with ink text, a horizontal fold crease at 34% (`linear-gradient(transparent, rgba(80,50,20,.10) 50%, transparent)` 3px tall), a pressed marigold petal sticker (`<use href="#petal-a">`, 22px, rotated 18deg) in the top-right corner, headings in `--font-display`; backdrop `rgba(5,3,2,.72)` stays. Remove brown panels: `.panel` and `.take-card` use `.reading` (E1.1).
Ink theme equivalent: `html[data-ink="1"]`: `.brass` becomes an ivory `#F2EFE8` flat button with 2px ink border and no gradient (16.3:1); `.tag` flat bone `#F2EFE8`; paper has no fibres and no deckle; focus ring becomes a 3px white outline plus a 2px black outer ring; grain, dust, bokeh and haze off; type unchanged.
Signature moment "lamp-lit paper": with E4's `--ldx --ldy`, every `.paper` (verdict note, letters, folders, wish card) shows raking-light fibre relief that changes as a flame is lit or moved: the grain visibly re-lights.

**Files likely touched:** `src/styles/chrome.css` (new), `src/styles/base.css` (remove old `.btn-primary`, `.panel`, dialog colours), `src/styles/lamps.css` (`.chip` to `.tag`), `src/components/LampRow.jsx`, `src/components/InviteButton.jsx`, `src/components/Overlay.jsx`, `src/styles/story.css` (`.note-paper`, `.folder` use `.paper`), `src/styles/card.css`.

**Tiers and Calm:** High: brass gradient, tag swing, breathing focus, flame `::after` flicker, raking bump. Mid: brass plain gradients, tag swing, breathing off. Low: flat brass face with a single border colour, tags static. Calm: no swing, no breathing, no flicker; focus ring and halo remain visible (static).

**Budget:** +1.4 KB CSS gz, +0.1 KB JS gz.

**Verify:** Headless: assert every interactive element still has `min-height 44px`; tab through the page and screenshot the focus on five controls: ring visible with at least 3:1 against its neighbour; computed contrast of `.brass` text over the darkest face stop at least 6.5:1; no text smaller than 11px (`document.querySelectorAll('*')` computed font-size scan on visible text). Screenshot of the lit lamp row at 390: tags are legible paper tags, not outlined 9px chips; screenshot of the sixty dialog: reads as a letter with fibre texture.

**Guardrails:** Chrome never uses kumkum or leaf as text; the Calm button and Menu stay at 44px minimum.

---

### E1.8: First-screen composition law and the visual QA rubric

**The astonishment:** In the first second the recruiter sees one image: a dark terrace, a lit numeral headline and a single flame to hold, with room to breathe. Nothing competes, and it already feels like cinema.

**Build:**
Law: the first screen shows at most six elements (V3 PART F): wordmark, Menu, kicker plus headline block (one element), the Hinglish ask and lines (one element), the lit diya with hold hint, the quiet "Jaldi mein?" link. The dashed sixth lamp is scenery (30% opacity, no label), not an element. Only two points may be hot: the numerals "324" and "19" (flame-core gradient) and the flame; no other pixel group on screen may exceed 40% of their luminance at tone 0 (string lights unlit at .35 opacity, at most 5 lit windows).
390x844 hierarchy, top to bottom: (1) y 0 to 56 topbar: wordmark at 60% cream (6.7:1) on the left, Menu 44px on the right, level 4; (2) y 128 to 190 kicker (11px mono, flame-core) with a 16px gold hairline lead, level 4; (3) y 190 to 400 headline, 3 lines of Fraunces 36 to 40px, line one cream, "324" and "19" in lit gradient, level 1 (the loudest object); (4) y 410 to 456 the ask in Hinglish italic serif 19px, level 2; (5) y 462 to 516 the two Hinglish lines 15px at 80% cream, level 3; (6) y 560 to 700 the diya at 56px, left-aligned on the headline's left edge at x 20, hold ring 72px, hold hint beneath, level 1b: the single action, sitting in the thumb zone; (7) y 760 to 810 the quiet link, level 5. Behind the copy band (y 130 to 520) the stage applies a text-safe scrim: vertical gradient `rgba(18,10,6,0)` to `.55` to `0` (never a boxed card). Eye path: 324, 19, flame, the faint dashed lamp at far right of the parapet.
1366x768 hierarchy: copy block left-aligned at x 8% (about 110px), max-width 38rem, headline at 56 to 64px starting y 190; the diya at x 31%, y 66% (rule of thirds, lower-left), hold hint right of it; the moon and toran counterweight at the upper right; the right 40% is skyline with low-key windows, the cat silhouette at the far right parapet; the parapet line at 62% of the viewport height; Menu and wordmark in the top corners only. No INVITE ME, no counter, no six labelled chips, no dock buttons on this screen (V3).
Implement with CSS only in `scene.css` and `type.css` (`#night` grid rules, `.night-copy::before` scrim, `.home-wrap` alignment), no new copy.

Visual QA rubric (a coding agent answers each by screenshot at 390x844 and 1366x768, both Calm on and off, tones 0, 3 and 6, Ink theme once). All ten must be yes:
1. Is there exactly one object that is clearly the loudest on every screen (headline numerals on screen one, the lamp or the current subject afterwards)?
2. Are there no more than six distinct elements visible on the first screen, and is nothing text-bearing sitting on a bright window or a bokeh disc?
3. Are the near skyline blocks darker than the mid blocks and the far blocks (depth order correct)?
4. Does every text block pass the ghost-text contrast sampler (4.5:1, or 3:1 at 24px and above) in all six acts?
5. Is any region of the sky visibly banded at 390 wide, or any region pure flat black with no grain (aakhri may be near-black, never flat)?
6. Are paper surfaces visibly fibrous and every brass control readable with ink text, with no text under 11px anywhere?
7. Is each Hinglish run visibly in the italic serif voice and each English run not italic, with numerals in the lit gradient?
8. Does Calm show a complete, beautiful still frame (no blank layers, no half-faded elements, no animation running)?
9. Is the Ink theme monochrome with no hue, no glow, and a visible high-contrast focus ring?
10. Can each interactive control be seen to have a focus ring in a Tab-through screenshot, and are all hit targets at least 44px?

**Files likely touched:** `src/styles/scene.css`, `src/styles/type.css`, `src/components/Night.jsx` (class hooks only), `scripts/qa-rubric.mjs` (new, runs the sampler plus the ten checks that can be automated: items 3, 4, 6, 10 fully; 1, 2, 5, 7, 8, 9 as screenshot sets for human or agent review).

**Tiers and Calm:** The composition is identical on every tier; low tier removes only the bokeh and grain. Calm: the first screen shows the headline fully formed, the flame lit, and the stage at the act's final state.

**Budget:** +0.4 KB CSS gz, no JS in the page (the QA script is dev-only).

**Verify:** `node scripts/qa-rubric.mjs` prints PASS or FAIL per rubric item and writes screenshots to `qa/shots/rubric/`; the first-screen screenshot at 390x844 must show the headline block in the upper half, the diya in the thumb zone, and a visible dark breathing space between them with no other controls.

**Guardrails:** No new words on screen; hierarchy comes from scale, colour and spacing only.

---

## Risks and cut order

Risks: (1) The two `@property` colour transitions and the camera transforms can fight with `parallax.js` writing `transform`; E1.4's refactor to variables must land first. (2) Blend-mode layers (lift, bloom, warm, grain) can cost on low-end Android; keep them high-tier only and let E8 measure. (3) Fraunces size: if the subset exceeds 90 KB, pin the italic axes or fall back to Young Serif; if fonttools or the network is unavailable, skip E1.6's files and still apply the Hinglish and numeral rules with the system serif. (4) Gradient-clipped text can fail in some in-app browsers; the `color` fallback and `@supports` guard cover it. (5) Window detail adds nodes to the skyline; cap at 260 and drop on mid and low. (6) `--tone-w` must be set correctly or acts 4 and 5 will wash out to dusk-gold.

Cut order (cut last item first): 1) rack-focus static blur on the far layer (E1.5 high-tier extra), 2) dust layer and grain jitter (E1.2), 3) tag swing-in and flame `::after` on focus (E1.7), 4) window reflection streaks and curtains (E1.3), 5) bokeh discs (E1.4), 6) dolly scale (keep the focus crossfade), 7) italic font file (keep roman and use Georgia italic), 8) Fraunces entirely (keep the Hinglish rule and lit numerals). Never cut: E1.1 act palettes with `--tone-w`, the reading scrim and contrast sampler, the depth-order fix, the focus ring, Calm still states.


---

# PACK 4: LIGHT AND FIRE (E4)

Position in this file: 3 of 8. Apply order: see the table at the top.

## Pack overview
1. WHAT TODAY LOOKS LIKE (from the live page at 390x844 and 1366x768, and src/lib/fx.js, flame.js, director.js, Flame.jsx, Lamp.jsx, scene.css): every flame is a lone DOM radial gradient (`.flame-glow`, plus `.pools i`) and one root-level `#cast` gradient that follows the last lit lamp. Nothing a flame does reaches the surfaces around it: the text panels, the lamp-card paper, the rangoli, the skyline slabs and the parapet are lit identically whether zero or five lamps burn. The flame is three SVG teardrops about 40 px tall. Fireworks are plain glow sprites with no trails and no bloom, so highlights never feel hot. The sixth lamp is a static sketch.
2. WHAT THIS PACK DOES: it makes light a real system. One `src/lib/lightEngine.js` owns every light (flames, lit window clusters, string lights, the travelling ember, fountains, lanterns, the pointer as a torch). It publishes `--lx --ly --li` to surfaces, feeds an additive light-map canvas, god-ray cones and dust motes, and optionally a hand-written WebGL2 bloom (`html[data-gl="1"]`). Flames, particles, the all-lit and visitor's-lamp choreographies, light-reactive UI and the energy rules all sit on that one engine.
3. TWO SIGNATURE MOMENTS NEVER SEEN ON A PORTFOLIO: (1) "The Travelling Light" (E4.1 and E4.7): the ember that hops from lamp to lamp is a real light, so the headings, cards, rangoli and skyline windows it passes are lit by it in real time, with correct falloff. (2) "Hold a flame to the blueprint" (E4.7): the dashed sixth lamp reveals its engineering drawing only inside the circle of light of your finger, pointer or keyboard focus. A third, quieter one: dust motes that exist only inside light cones (E4.2).
4. DEPENDS ON: E2 motion tokens (`--ease-out-expo`, `--ease-in-out-quint`, `--dur-*`, `html[data-act]`, `stage:act`); E1 palette tokens (lights read `--flame-core --flame-a --kumkum --marigold`; indigo and rose accents are defined here as `--fw-indigo`, `--fw-rose`); V3's six acts, ids and `diya:*` events. E3 (opening) and E5 (set-pieces) call this pack's API: `light.add/set/remove/follow/pulse/traveller`, `fx:burst` kinds, `choreo.play(name)`. E8 audits budgets.
5. APPLY ORDER: E4.1 engine, E4.2 light-map and atmosphere, E4.3 WebGL2 bloom, E4.4 flames, E4.5 particles v2, E4.6 choreography, E4.7 light-driven UI, E4.8 energy rules and verification. Every prompt keeps existing exports (`spawn`, `burst`, `glow`, `engine.register/set/breathe/wind`, `lampRegistry.wick`, events `diya:lighting diya:lit diya:allLit diya:visitorLit fx:burst fx:setQuality wish:ready`) so nothing else breaks.

Shared constants used by every prompt below (define once in `src/lib/lightEngine.js`, export as `LIGHT`):
- Hues (index: RGB): 0 gold 255,196,110; 1 amber 255,150,60; 2 rose 238,118,138; 3 indigo 96,104,230; 4 cream 255,243,220; 5 cool-white 170,190,235.
- Slow breath clock: period 4.8 s, `breath(t) = 0.5 - 0.5*cos(2*pi*t/4.8)`, peaks at 2.4 + 4.8k seconds.
- Falloff (windowed inverse square), with s = d / r: `att(s) = s >= 1 ? 0 : (1 - s*s)^2 / (1 + 4*s*s)`. Zero at the edge, 1 at the centre, soft shoulder.
- Text-surface light ceiling `LIT_CAP = 0.30` (overlay alpha). Cream text #FFF3DC on `--ground-2` plus amber overlay at 0.30 measures about 7.5:1; at 0.45 it is 4.9:1, the hard floor.

---

### E4.1: The light engine: every flame is a point light, every surface is lit by the nearest two
**The astonishment:** Light a lamp and the headline above it, the paper card beside it and the rangoli beneath it warm from that exact spot, falling off with distance; light a second and the shared panel between them blends both. The recruiter feels that the page is a room with real fire in it, not a picture with glow stickers. The moving ember (lamp hop) drags a pool of light across the text as it travels.

**Build:**
1. Create `src/lib/lightEngine.js`. State in typed arrays (max 32 lights): `X, Y` (viewport px), `R` (radius px), `I` (0 to 1.5), `HUE` (0..5), `FL` (flicker amount 0..0.3), `SEED`, `KIND` (flame, window, string, transient, follow), `TTL` for transients. API: `light.add(id,{x,y,r,i,hue,flick,kind})`, `set(id,patch)`, `remove(id)`, `bind(id, getter)` (getter returns `{x,y}`, polled only when dirty), `follow(el,{r,i,hue})` (tracks an element centre), `pulse({x,y,r,i,hue,attack,decay})` (transient, passes the flash guard in E4.8), `traveller({from,to,dur,r,i})` (a moving transient light along a quadratic path, default 900 ms, `--ease-in-out-quint`), `sample(x,y)` (sum of att*I, 0..1.5, no allocation), `breath()`, `exposure` (0.55 to 1, written by E4.8).
2. Sources: in `src/lib/flame.js` `engine.register` also calls `light.add('f'+id, {kind:'flame', r:260*personality.glow, i:0.9, hue:0, flick:0.14})` and `bind` to the wick tip (`lampRegistry.wick(n)`); `frame()` calls `light.feed('f'+id, sc*gc)` so intensity follows the real flame scale and breath. Home flame id 0 radius 320, lamps 1 to 5 radius 240, lamp 6 none (it is unlit), visitor flame 30 radius 280. Skyline: on mount and on resize read the 64 `.win` rects once, bucket the lit ones into 8 vertical clusters, one light each (kind window, r 90 to 130, i = 0.10 + 0.012*count, hue 4). String lights: one light per 4 lit bulbs, r 70, i 0.12, hue 0.
3. Surfaces: any element with `data-lit="panel|card|text|rangoli"` is registered by one IntersectionObserver (rootMargin 20%). Per tick (30 Hz high, 20 Hz mid, 8 Hz low plus scroll-end) take its cached rect (ResizeObserver + scroll-dirty flag; never read layout in the loop for unregistered nodes), pick the two strongest lights by `I*att`, and write element-local `--lx --ly` (px, rounded to 2) and `--li` (0..1, rounded to 0.02, clamped to `LIT_CAP/0.30`); skip the write if nothing changed. Tag `.sec .panel`, the lamp-card sheet paper, `.rangoli-wrap`, `.person-panel`, `h1` and `h2` blocks, the Voice compare panel.
4. CSS in `src/styles/light.css` (new): `[data-lit]{--li:0;position:relative;isolation:isolate}`; `[data-lit]::before{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:-1;background:radial-gradient(circle at var(--lx) var(--ly),rgba(255,196,110,calc(var(--li)*.30)) 0,rgba(255,150,60,calc(var(--li)*.12)) 38%,transparent 72%)}`; paper cards instead darken the far edge: `box-shadow:inset 0 0 60px rgba(40,18,0,calc((1 - var(--li))*.16))`; headings `text-shadow:0 0 calc(var(--li)*14px) rgba(255,179,71,calc(var(--li)*.35))`; rangoli strokes `stroke-opacity:calc(.55 + var(--li)*.45)`.
5. Migration: Stage.jsx currently writes root `--lx/--ly` for `#cast`; rename those to `--cast-x/--cast-y` so `--lx --ly --li` mean element-local light only. `#cast` stays as the low-tier fallback.
6. Calm and hidden tab: no loop; compute once after lamp state changes and on scroll-end; remove flicker. Pause when `document.hidden`.

**Files likely touched:** `src/lib/lightEngine.js` (new), `src/lib/flame.js`, `src/components/stage/Stage.jsx`, `src/components/stage/SkylineLayer.jsx` (expose cluster rects), `src/styles/light.css` (new, imported by main.jsx), `src/styles/scene.css` (`#cast`), components that receive `data-lit`.

**Tiers and Calm:** high 30 Hz, up to 12 live surfaces, windows and string lights as lights. Mid 20 Hz, 8 surfaces, window clusters only. Low 8 Hz, 4 surfaces, no clusters, panels get the static `#cast` look. Calm: one-time static values at the lit-lamp state, no flicker, ember hop becomes an instant light swap.

**Budget:** about 5.5 KB JS gz, 0.9 KB CSS gz. Loop under 0.4 ms per tick at 12 surfaces (setProperty on 12 nodes plus gradient repaint of small boxes).

**Verify:** unit test `att()` returns 1 at 0, 0 at 1, monotonic. Headless: light lamp 1, read computed `--li` on `#lamp-1 .panel` (greater than 0.15) and on a panel 2000 px away (0). Count `setProperty` calls over 5 s idle (must be under 20: change-only writes). Screenshot lit versus unlit at lamp 1: a luminance gradient on the panel measurably higher on the side nearest the lamp.

**Guardrails:** light never changes copy, never lowers text contrast below AA (ceiling `LIT_CAP`), nothing stored, no per-frame layout reads.

---

### E4.2: Light-map, god-ray cones, haze and dust that only lives in light
**The astonishment:** Warm light visibly spills across the terrace floor, parapet and lower skyline, window cones breathe slightly, and fine gold dust drifts through those cones and vanishes in the dark between them. It looks like a real evening courtyard photographed with a long exposure.

**Build:**
1. New canvas `#lightmap` in Stage.jsx between `Terrace` and `#cast` (aria-hidden, `mix-blend-mode:screen`, `pointer-events:none`). Size = viewport / 4 in CSS px (about 98x211 at 390x844, 342x192 at 1366x768), CSS-scaled with `image-rendering:auto` so bilinear upscaling gives free softness.
2. Each tick (30 Hz high, 15 Hz mid) clear, set `globalCompositeOperation='lighter'`, and for each light `drawImage` a pre-rendered 64x64 radial sprite for its hue (6 sprites, gradient stops 0 alpha 1, 0.35 alpha .55, 1 alpha 0), scaled to `2*r/4`, `globalAlpha = I*flicker*exposure*0.55`. Lamps on the terrace plane are vertically squashed 0.55 so they pool on the floor and parapet instead of lighting the sky. Lit windows draw as 3x3 px dots (additive) plus a 10x10 halo for the 8 strongest clusters.
3. God-ray cones: 4 pre-rendered cone sprites (soft trapezoid, apex bright, 0.0 alpha at the far end, 48x128) drawn from each lit near-layer window cluster (max 3 on high, 2 on mid), angle -90 degrees plus a slow +-3 degrees sway from `noise(t*0.1)`, alpha 0.10, plus one wide haze band: a 2-stop horizontal gradient strip at the horizon (y = 0.62 H) alpha `0.04 + 0.01*litCount`, drifting 6 px/min. Haze layer count: high 2, mid 1, low 0.
4. Dust: add particle kind `mote` (E4.5) with `alpha = 0.7 * light.sample(x,y)` per frame, so motes fade in only inside light. Count 40 high, 20 mid, 0 low; size 1 to 2.2 px; velocity from `noise` drift 4 to 10 px/s plus the global wind.
5. Listen to `bloom:set {x,y,r,i}` (emitted by E4.6 and E5) and draw one extra additive sprite at that point for its duration (the lightmap is also the 2D bloom fallback in E4.3).
6. Low tier: do not create the canvas; reuse existing `.pools i` DOM gradients, driven from `light` positions (transform only, max 6).
7. Ink: draw with hue 4 only at 55% alpha, no cones, no dust.

**Files likely touched:** `src/lib/lightmap.js` (new, started by `startDirector()`), `Stage.jsx`, `src/styles/scene.css`, `src/lib/fx.js` (mote kind).

**Tiers and Calm:** high as above. Mid: 15 Hz, 2 cones, 1 haze, 20 motes. Low: DOM pools only. Calm: draw once per lit-state change (no sway, no dust), cones at fixed angle, haze static: a still, glowing evening.

**Budget:** about 2.6 KB JS gz, 0.2 KB CSS. Draw cost: 30 to 50 `drawImage` calls at 98x211 px, under 0.5 ms.

**Verify:** screenshot with 0 lit then 5 lit at both viewports: floor luminance sampled under lamp 3 rises at least 25%, the sky region is within 5% (light does not leak upward). Count dust motes with `sample()` under 0.05: they must not be drawn (check alpha). Frame time with all enabled at 4x CPU slowdown: p95 under 20 ms.

**Guardrails:** background light only: no light layer may sit above text, and mean lightmap luminance obeys the act cap in E4.8.

---

### E4.3: Optional WebGL2 bloom: a hand-written dual-filter pyramid with a 2D fallback
**The astonishment:** Flame cores, sparks and lit windows get a soft, film-like bloom, a faint star-streak on the brightest fire and the faintest chromatic ghosting on the final moment. Highlights feel hot and photographic instead of flat.

**Build:**
1. New `src/lib/glBloom.js`. Enable only if all hold: `quality==='high'`, not Calm, not Ink, WebGL2 context obtained (`antialias:false, depth:false, stencil:false, alpha:true, premultipliedAlpha:true, powerPreference:'low-power'`), no `webglcontextlost`. On success set `html[data-gl="1"]`; on any failure, loss or benchmark miss, remove it and let E4.2's 2D path run (it always runs; GL only adds).
2. Canvas `#gl`, same CSS box as `#lightmap`, resolution = viewport / 2 CSS px (683x384 at 1366x768). Because it is displayed scaled up, the whole pipeline is under 0.3 megapixels. `mix-blend-mode:screen`; it outputs light only, never opaque pixels.
3. Emissive source: an offscreen 2D canvas `Em` at the same /2 resolution, redrawn each frame (30 Hz) with only hot things: additive particles (copied via the fx draw list, not a canvas copy), flame cores (6 px sprites at wick positions, brightness `I`), lit window dots, bulbs, and transient bloom points. Upload with `texImage2D` (UNPACK_PREMULTIPLY_ALPHA false) each frame.
4. Shader structure (all `#version 300 es`, RGBA8 targets, one full-screen triangle): (a) PREFILTER: sample Em, `c = max(rgb - 0.55, 0) * 1/(0.45)`, soft knee 0.2, down to /4. (b) DOWN x3 (/8, /16, /32): 13-tap Jimenez dual-filter. (c) UP x3: 9-tap tent, each level added to the one above with weights 0.9, 0.7, 0.5. (d) COMPOSITE (canvas resolution): `bloom*uStrength` plus streaks (E: horizontal 2-tap-per-8 star streak sampled from the /8 level, strength 0.25, only for the 2 brightest lights) plus ghosts when `uFlare>0`: samples of the /8 level at `centre + (centre - lightPos)*{0.55,1.0,1.7}` with per-ghost tint (indigo, rose, gold), ring mask `smoothstep(.18,.2,r)-smoothstep(.2,.24,r)`. Tone map `1 - exp(-x*uExposure)`, then add `(hash(gl_FragCoord.xy)-0.5)/255` dither to kill banding in dark gradients.
5. Uniforms driven by `light.exposure`, E4.6 cue `uFlare` (default 0) and `uStrength` 0.55 (0.9 at the all-lit peak, eased with `--ease-in-out-quint`). Render only while something emissive is alive or lights are present; otherwise stop and clear once.
6. Benchmark gate: measure 30 frames after enable; if p90 GPU-plus-JS frame time exceeds 14 ms, disable and remove `data-gl`.
7. Fallback bloom (everyone else): draw Em into two downscaled canvases (/4, /8) with `drawImage` and `imageSmoothingQuality='high'`, then composite both back additively at `globalAlpha` 0.5 and 0.35 onto `#lightmap`. About 0.3 ms.

**Files likely touched:** `src/lib/glBloom.js` (new), `src/lib/lightmap.js`, `Stage.jsx`, `src/styles/scene.css`.

**Tiers and Calm:** high with GL; high without GL, and mid, use 2D fallback bloom; low none. Calm: no GL; the 2D light-map draws once; a static soft halo remains.

**Budget:** about 4 KB JS gz (shader strings about 2.3 KB). GPU: 8 small passes, about 1 to 2 ms desktop. CSS 0.1 KB.

**Verify:** headless with `--use-gl=swiftshader`: `document.documentElement.dataset.gl==='1'`, no GL errors (`gl.getError()===0` after 60 frames); force `webglcontextlost` and confirm the page keeps drawing and `data-gl` clears. Screenshot with `#gl` toggled off versus on at the home flame: bloom radius visible, no hard-edged rectangles, no banding in the dark sky (histogram has at least 40 distinct luma levels in the top 100 px).

**Guardrails:** the GL layer is purely additive polish: removing it must never change legibility, layout or story.

---

### E4.4: Flames that look alive: five layers, noise-driven motion, wick glow, oil sheen
**The astonishment:** The flame leans, licks and settles like a real diya flame: a blue base, a hot pale core, an amber body, ragged orange edges, a wisp of tip that breaks off and rises. The clay lip glows from inside and the oil mirrors a tiny upside-down flame.

**Build:**
1. Keep the `Flame.jsx` viewBox (`-20 -80 40 84`) and the `engine.register` contract; replace internals. Layers back to front: `f-halo` (ellipse, radial gradient rgba(255,150,40,.35) to 0, rx 15, ry 40), `f-b` outer orange (`--flame-b`, vertical gradient to alpha 0 at the tip), `f-a` amber, `f-c` hot core (#FFE9B0), `f-blue` (#4B6BFF, alpha .55, height 18% of the flame, sits on the wick), `f-wisp` (two 1.6 px teardrops).
2. Shape (high): each layer a closed Catmull-Rom path through 7 control points along height `v` (0 to 1). Half-width `w(v) = w0 * sin(pi * v^0.7)`, lateral offset `o(v) = sway * v^1.6 + wind*20 * v^2`. `sway = n(t*rate+ph)*A1 + n(t*rate*2.3+ph+9)*A2` with `A2 = 0.4*A1`. Core uses time lag 0.08 s and 40% of the sway (inertia). Height `h = h0*(1 + 0.08*n(t*0.7+ph+4) + lick)`. "Lick": a random event every 0.6 to 1.8 s with envelope `sin(pi*k)^2` over 220 ms, adding +10% height and 3 degrees lean. Tip pinches as `v^3`.
3. Wisps: every 2.5 to 6 s the tip sheds a particle (E4.5 kind `wisp`: size 5, amber, life 0.9 s, rises 28 px/s, fades) on high and mid; none on low.
4. Heat ripple: only on high and only the home flame plus the nearest lit lamp (max 2): the flame SVG gets `filter:url(#heat)` (`feTurbulence baseFrequency="0.015 0.06" numOctaves="1"` plus `feDisplacementMap scale="4"`), the y baseFrequency nudged at 15 Hz. Region 40x84 px so cost is small. Honest scope: this ripples the flame and its tips; true backdrop distortion is not used (unsupported in Safari and Firefox). Add 2 faint additive heat ribbons (2 px wide, alpha .05, sine drift) to the light-map above each flame.
5. Wick glow: a 2.2 px radial-gradient circle at the wick tip, colour from orange to #FFD27A by `I`, pulsing +-12% with the flame scale; `wick-char` stays. Clay lip: in `Lamp.jsx` add one radial gradient overlay clipped by the existing `clipPath bowl{n}`, centre at wick tip, alpha `0.5*I`, so the bowl warms where the flame is. Oil: the `.oil` ellipse gets a moving specular (x offset = lean*0.6, opacity `I*0.5`) and a 12x3 mirrored flame ellipse flickering in sync.
6. Wind: export one global `wind(t)` from `lightEngine` = `0.6*n(t*0.15) + gust`, with a `wind:gust {v}` event every 9 to 14 s (random) that flames, petals, toran and string lights all read; keep `engine.wind(v)` as an additive impulse.
7. Personalities in `flame.js` unchanged in behaviour (calm home flame, pulse, twitch, hiccup, honest small lamp 6), now scaling A1, rate, lick frequency.

**Files likely touched:** `src/components/Flame.jsx`, `src/lib/flame.js`, `src/components/Lamp.jsx`, `src/styles/lamps.css`, `index.html` or Stage (the `#heat` filter defs), `src/lib/lightEngine.js`.

**Tiers and Calm:** high: 5 layers, 7 points, 60 Hz for the 4 most luminous visible flames and 20 Hz for others, wisps, heat ripple on 2, oil mirror. Mid: 3 layers (b, a, c), 5 points, 30 Hz transforms plus path, no wisps or heat. Low: CSS keyframes on scale and skew only, no JS. Calm: canonical steady flame (current `D0` shapes), constant light, no wisps.

**Budget:** about +2.5 KB JS gz, +0.6 KB CSS. Cost: 6 visible flames x 5 path updates at 60 Hz under 0.6 ms; ripple filter about 0.3 ms.

**Verify:** headless: with 6 flames visible at 4x CPU slowdown, p95 frame time under 20 ms or tier steps down once; `getAnimations`-free (no layout reads in the flame loop, check with `performance.measure`). Screenshot close crops of lamp 1 and the home flame at 4x zoom show five distinct tones, the clay lip warm side, and an asymmetrical shape in two frames 400 ms apart.

**Guardrails:** flame shapes stay inside the 40x84 box (no clipping), personalities stay decorative, lamp 6 never gets a real flame.

---

### E4.5: Particle engine v2: one pool, an atlas, accumulating trails, and a governor that never pops
**The astonishment:** Fountains arc and fall with real gravity and cooling colour, a chakri spins itself into a spiral on the floor, willows droop in long golden trails, and when the phone is struggling the sparks quietly thin out rather than stuttering.

**Build:**
1. Refactor `src/lib/fx.js` into `fx.js` (pool, loop, governor) and `src/lib/fxKinds.js` (recipes). Keep exports `spawn, burst, glow, fxLights (alias to light.sample sources), countType, liveCount, TYPES, initFx, fxPointer` and the event `fx:burst {kind,x,y,...}`. Existing kinds keep working; unknown kinds are ignored.
2. Pool: `N = 640` struct-of-arrays Float32 (`X Y VX VY AGE LIFE SZ GRAV DRAG A0 PH AUX ROT VR`) and Uint8 (`COL TYPE ALIVE PRIO FLG KIND`). Caps (live particles): high 520 (ambient at most 120), mid 240 (ambient 50), low 80 (ambient 12). Priorities: 0 ambient, 1 sparks, 2 hero (rocket cores, fountain, chakri, lit-lamp burst), 3 never shed.
3. Atlas: one 256x128 canvas holding 8 glow colours x 3 sizes (16, 32, 64 px) plus 6 petal frames (marigold and rose) and the lantern; every draw is `drawImage(atlas, sx, sy, s, s, ...)` from the same source (best batching). Build two index lists (Uint16Array) while integrating (normal and additive) so there is one pass per blend mode, not a scan of N twice.
4. Trails (high only): second canvas `#fx-trail` at 0.5 DPR; each frame `destination-out` fill `rgba(0,0,0,0.09)`, then draw additive dots for particles with the `TRAIL` flag. A 0.09 fade gives streaks about 190 ms long, the willow flag draws at half alpha. Clear it once when no flagged particle lives. Mid: 3 trail sprites per rocket (as today). Low: none.
5. New kinds, with physics (px, s; tier counts high / mid / low): `spark` drag .94 per 60 Hz frame, gravity 120. `ember` buoyancy -22, wobble `noise`, cools gold to red to dark. `anar` fountain: cone +-14 degrees gaussian, speed 300 to 460 times power, gravity 720, drag .992, life .7 to 1.3, emitter 2.6 s with attack .3, sustain 1.6, decay .7, apex shimmer (size times `0.8+0.2*sin(age*40+ph)`), single ground bounce (`vy*=-.25`), and it registers a transient light (r 160, i `0.9*envelope`). `peony` shell 54/32/14, speed 120 to 150, drag .965, gravity 55, indigo pistil of 8 at 40% speed. `chrysanthemum` = peony plus each star sheds a child spark every .07 s for .9 s. `willow` 28/16/8, speed 70 to 100, drag .975, gravity 70, life 3.6 to 4.6, shed a 4 px drip every .12 s. `crossette` 8/6/4 stars that split into 4 at 90 degrees at 55% of life. `chakri` on the floor plane (y squash .4): angular velocity 22 down to 6 rad/s over 2.8 s, tangential tail sparks 3 per frame times E, slow drift `sin(t*1.3)*18`, rotating transient light r 90. `phuljhadi` sparks cool white to gold to orange within .35 to .9 s, 8% crackle into 3 micro sparks at 40% life. `lantern` kandil with inner flicker alpha .85+-.1, perspective scale 1 to .55, a light for the first 4 only. `petal` flutter `scaleX=cos(age*3+ph)`. `mote` (E4.2). `wisp` (E4.4).
6. Governor: continuous emission scale `E` (0.25 to 1). Measure fx-frame cost with `performance.now()` (EMA 0.1) and ticker dt EMA; if fx cost over 4 ms or dt over 20 ms then `E -= 0.02*overshoot` per frame, if under for 90 frames `E += 0.005`. Spawn counts and sizes multiply by E; ambient spawns drop first. Shed alive particles by easing a per-particle fade multiplier to 0 over 0.5 s (lowest priority and oldest first), never killing mid-frame. Only if E sits at its floor for 2 s does it ask `quality.js` for a tier step (so tier changes become rare and smooth). Keep the 30 fps ambient-only path.
7. Ink: crackers stay dropped; only ember, petals, motes, lanterns as pale cream. Calm: hidden canvases, static halos exactly as `glow()` does today.

**Files likely touched:** `src/lib/fx.js`, `src/lib/fxKinds.js` (new), `src/lib/director.js` (uses new kinds), `src/lib/quality.js`, `src/components/stage/Stage.jsx` (`#fx-trail`), `src/styles/scene.css`.

**Tiers and Calm:** caps and kind counts above. Calm: nothing animated.

**Budget:** about +5 KB JS gz net; frame cost under 3 ms at 400 live particles on a mid phone (one pass per blend mode).

**Verify:** `window.__fx` (behind `?qa=1`) reports live count, E and tier. Fire every kind 10 times in a loop: live never exceeds the cap, no particle count discontinuity larger than 3 between frames while shedding. Under 4x CPU slowdown E falls smoothly (record E every 100 ms: no drop larger than 0.15 in one step). Screenshot a willow at +1.5 s: visible drooping trails; a chakri at +1.2 s: spiral on the floor plane.

**Guardrails:** crackers only after a reader action or the beats the reader triggered (existing rule), never a note about crackers anywhere, peak alpha 0.8.

---

### E4.6: The two silent firework choreographies: "Paanch diye" and "Aapka diya", cued to a slow breath
**The astonishment:** When the fifth lamp lights, the page inhales with you: flames lean together, one gold star climbs and opens, twin willows answer, three sky lanterns rise, and a single great chrysanthemum blooms with soft ghosts of light, then everything exhales into a warm dusk. Fifteen quiet seconds, no sound, nothing frantic.

**Build:**
1. New `src/lib/choreo.js`: a cue-sheet runner on the shared ticker (no `setTimeout` chains). `choreo.play(name)` takes `[{t, cue, ...args}]`, is abortable (any tap or scroll away more than one viewport completes it instantly into the resting state), pauses while `getState().lampCard` is open (existing behaviour), and refuses to run when Calm. Palette for all bursts: gold (hue 0), amber (1), rose (2) and one deep indigo accent (3, with lilac tips #8F95F0), never white-hot full screen.
2. `ALL_LIT "Paanch diye"` starts 3.2 s after `diya:allLit` (V3's 3 s row-breathes beat and its caption finish first). Times in seconds, breath peaks at 2.4, 7.2, 12.0: 0.0 HUSH (exposure x0.85 over 0.8 s, `engine.breathe()`); 0.8 INHALE (five flame lights 1 to 1.45 by `breath`); 1.1 launch R1 from lamp 3 wick; 2.4 FIRST STAR (peony gold, indigo pistil, pulse a); 3.6 TILT (`wind:gust` 0.5, 6 petals); 4.8 TWO SOFT FOUNTAINS (anar at lamps 2 and 4, rose-gold, 2.0 s); 5.9 launch R2 and R3 (0.25 s apart); 7.2 TWIN WILLOWS (left gold, right rose-gold, pulse b); 8.4 LANTERN RISE (3 kandils from lamps 1, 3, 5); 9.6 ROSE CROSSETTE (n=6, no pulse); 10.7 launch R4; 12.0 THE CHRYSANTHEMUM (gold outer, rose ring, indigo pistil, pulse c, `uFlare` 0 to 0.7 to 0 over 1.6 s: lens ghosts appear only here); 13.0 GOLD RAIN (petals 12/8/4); 13.8 EXHALE (exposure back to 1 over 1.2 s); 15.0 REST (lights keep +10%, dusk-gold persists).
3. `VISITOR "Aapka diya"` starts at `diya:visitorLit` (the flame's journey itself belongs to E5): 0.0 IGNITION (ring of 10 sparks, pulse a 0.3); 0.6 INHALE (visitor light 0.4 to 1.6, the row's lamps answer outward with 90 ms stagger to 1.2); 2.4 TALL FOUNTAIN (visitor anar, gold); 4.8 LANTERN FLIGHT (existing count, 300 ms apart, tier max 13/8/3, the visitor's last and brightest); 7.2 SLOW PEONY (rose-gold, pulse b); 9.6 UNISON (all six flames +25% for 700 ms with the shared breath: "ek diya se doosra"); 10.8 SETTLE (existing embers); 12.0 REST.
4. Rocket and burst positions use fractions of the viewport as `director.js` does today (`x = W*fx`, `y = H*0.28`), launched from `lampRegistry.wick(n)`. Replace the all-lit block in `director.js` (rockets at 1.4, 3.2, 5.0 s and petals at 7.5 s) and the visitor block with `choreo.play`. Keep `rate()` (max 4 non-ambient bursts per 500 ms) as a backstop.
5. Pulses go through the flash guard (E4.8): each pulse peaks at +0.35, +0.30, +0.40 luminance share with 60 ms attack and 440 ms decay; no two within 4.8 s, so well under 3 flashes per second.
6. Calm and Ink: no motion. Calm plays `still glows` only: fade in (600 ms, no loop) three faint peony rings (SVG dotted circles, alpha .35) over the skyline plus a soft halo at each lamp, then hold. Ink: same with cream glows.
7. Emit `choreo:cue {name}` for E7 (captions) and E3.

**Files likely touched:** `src/lib/choreo.js` (new), `src/lib/director.js`, `src/lib/fxKinds.js`, `src/lib/lightEngine.js`, `src/lib/glBloom.js` (`uFlare`).

**Tiers and Calm:** high: all cues, GL flare, 3 lanterns, 12 petals. Mid: skip R3, crossette and flare (replace flare by a 2D 3-sprite ghost at 0.4 alpha), 2 lanterns, 8 petals. Low: R1, willow left, chrysanthemum small (n=14), 1 lantern, 4 petals, no pulses beyond one. Calm and Ink as above.

**Budget:** about 3.5 KB JS gz; peak 520 particles for under 2 seconds.

**Verify:** headless: light all five with `?qa=1`, record `choreo:cue` events: exact order and times within +-80 ms, total length 14.5 to 15.2 s. Record luminance per 100 ms via screencast frames: at most 3 upward luminance jumps over 10 percent in any rolling second (target: at most 1 per 4.8 s). Scroll away 1.5 viewports mid-sequence and confirm it completes to rest within 400 ms. Screenshots at 2.4, 7.2 and 12.0 s must show the three bloom shapes and no UI covered by particles.

**Guardrails:** silent, tasteful palette only, any reader action stops it, never fires on load and never twice.

---

### E4.7: Light-driven UI: the torch, the travelling light on the page, and "hold a flame to the blueprint"
**The astonishment:** Move your pointer or hold your finger and a small warm light follows it, waking dust and picking out fine details; as the ember hops between lamps it sweeps across the headlines and cards; and when you reach the sixth lamp, you hold a flame to a dark sheet and the engineer's drawing appears only where your light touches.

**Build:**
1. THE TORCH: `light.follow` on the pointer when `(pointer:fine)` (desktop): radius 150, intensity 0.28, hue 4, eased with 0.12 lerp; on touch no idle torch, but during a held diya press and a Voice flame drag (E5) the finger is a light (r 130, i 0.5). Focus-visible elements also carry a light (r 90, i 0.4) so keyboard users get the same warmth. Off in Calm and Ink.
2. THE TRAVELLING LIGHT: V3's ember hop (lamp to lamp, 0.9 s) and the opening arc (E3) call `light.traveller({from,to,dur:900,r:200,i:0.9})`. The engine therefore lights every `data-lit` surface and window cluster in its path. Add `data-lit="text"` to the Act headings and hook sentences so the sweep visibly crosses them. Add a one-shot "light wipe" on each act heading when `stage:act` fires: a traveller moves left to right across the heading in 700 ms (i 0.6).
3. LUMEN ELEMENTS: attribute `data-lumen` on decorative or duplicate details whose opacity is `clamp(.35, calc(.35 + (var(--li) - .12) * 2.2), 1)`: the unlabelled lamp chips' micro-captions, skyline "window waves" (windows within 110 px of any light brighten for 1.2 s, drawn in the light-map only), rangoli dots, rule lines. Nothing necessary is ever gated by light: baseline 0.35, the plain-text twin and Calm show the full content, and no information exists only in lit state.
4. HOLD A FLAME TO THE BLUEPRINT (Lamp6.jsx): wrap grid, dimension lines (`.dim-line`), centre line, `.flame-dots` and any label in `<g class="bp-detail" mask="url(#bpMask)">`, with `<mask id="bpMask"><circle id="bpC" r="0" fill="url(#bpGrad)"/></mask>` (`bpGrad` radial white to black). The base outline stays visible at stroke-opacity .55 always. `bpC` follows, in SVG coordinates, the strongest of: pointer or finger over the sketch (r 70, grows to 90 over 300 ms), keyboard focus on `.sketch-btn` (centre of the sketch, r 80), and a one-shot auto-demo when the section is first seen: a `traveller` light sweeps left to right across the sketch in 2.4 s so a skimming reader still sees it. On press (V3: "the wick glows and recedes"): `light.add('l6',{x:wick,r:120,i:0.9,hue:5,kind:'transient'})`, eased up 300 ms and down over 1.4 s, a cool white-blue because the lamp is unlit; also a 6-spark `fizzle`.
5. Mark as NEW micro-labels: none. All text comes from V3's copy.
6. Measure cost: `data-lumen` opacity is pure CSS from `--li` (already published); at most 10 lumen elements; no extra loops. Mask updates only change an attribute at 30 Hz when pointer moves over the sketch.

**Files likely touched:** `src/lib/lightEngine.js` (follow, traveller), `src/components/Lamp6.jsx`, `src/components/LampRow.jsx` (ember hop calls `traveller`), `src/styles/light.css`, `src/styles/lamps.css`.

**Tiers and Calm:** high: torch, wipe, window waves, mask with feathered edge. Mid: torch r 110, wipe, no window waves. Low: no torch, mask becomes a hard-edge circle reveal, no wipe. Calm and Ink: no torch or traveller; the blueprint shows all detail at 0.55 alpha as a calm static drawing.

**Budget:** about 2 KB JS gz, 0.5 KB CSS. Negligible frame cost.

**Verify:** headless: dispatch `pointermove` over the sketch and assert `#bpC` r above 60 and its centre within 4 px of the pointer; tab to `.sketch-btn` and assert the mask opens; Calm assert detail opacity 0.55 with no animation. Run the ember hop and assert `--li` on `#lamp-2 .panel` rises above 0.1 mid-hop then returns. Screenshot at 390 px: the blueprint inside the circle of light fully drawn, the rest dark with only the outline.

**Guardrails:** no required information is revealed only by light, every light effect has a text and keyboard path, tap targets stay 44 px.

---

### E4.8: Energy rules, auto-exposure, the flash guard and the verification harness
**The astonishment:** The recruiter never notices this prompt: the page is simply always legible, never glaring, never strobing, and never stutters, even with five lamps, fireworks and bloom running on a mid-range phone.

**Build:**
1. Act energy budgets in `src/lib/energy.js`, driven by `stage:act` (E2), as caps on mean lightmap luminance (0 to 1, sampled from the lightmap canvas on an 8x8 downscale every 500 ms), simultaneous emitters, bloom strength and particle cap: doorstep .10 / 3 / 0.45 / 120; baithak .14 / 3 / 0.40 / 60 (sparks and kandil paused); chhat .16 with none lit rising to .22 with five lit / 5 / 0.55 / 300; awaaz .08 / 2 / 0.30 / 40 (quiet, no sparks); aakhri .06 / 1 (only lamp 6 area) / 0.25 / 40; vidaai .22, with up to .30 for at most 3 s during choreography / 6 / 0.90 / 520. During any foreground interaction (guess, slider, compare), ambient sparks, cat, kandil sway and firework glints pause (V3 PART F) and the cap drops one level.
2. Auto-exposure: `light.exposure` (0.55 to 1) eases (time constant 250 ms, `--ease-out-expo`) down by 8% per step while the measured mean exceeds the act cap or while any registered text surface has `--li` above `LIT_CAP/0.30`, and eases back up when clear. All surface overlays and the lightmap alpha multiply by `exposure`, so contrast is preserved automatically as more lamps are lit. Worst-case ceilings already guarantee: cream text on a surface with overlay 0.30 is about 7.5:1, on the `--text-dim` #E3CFAE about 7.6:1; floor 4.5:1 at overlay 0.45 is never allowed.
3. Flash guard (hard rule): every pulse, bloom point, flare, rocket burst flash and lantern ignite requests `flash.request(amp)`. Token bucket: at most 2 flashes per rolling second, minimum 400 ms apart, no single flash raising frame luminance by more than 25% of exposure within 100 ms, no full-screen white ever (peak alpha 0.8, bloom pulse amplitude 0.40 max), at most 3 flashes in any 3 s window including particle bursts; refused flashes degrade to a slow swell (600 ms ramp). WCAG 2.3.1 (3 per second) is therefore met with margin.
4. Calm and Ink: energy runs in static mode: exposure 1, no sampling loop, caps apply to the static draw.
5. Verification harness `scripts/light-verify.mjs` (Playwright, `playwright-core`, headless Chromium, flags `--use-gl=swiftshader --no-sandbox`), run at 390x844 (mobile UA, touch) and 1366x768, with `?qa=1` exposing `window.__light` (`lights`, `exposure`, `flashCount`, `meanLum`, `E`, `tier`) and `window.__fx`. Protocol: (a) CDP `Emulation.setCPUThrottlingRate {rate:4}`, light all five, record rAF deltas for 20 s across the choreography: p50 at most 16.7 ms and p95 at most 25 ms after the tier settles, no frame above 100 ms, at most one tier step-down, live particles never above the tier cap; (b) screencast frames (CDP `Page.startScreencast`) decoded in-page to luminance: flashes per rolling second at most 3 (target 1), mean luminance never above the act cap by more than 0.03; (c) lit versus unlit screenshot pairs at lamp 1, 3 and 5 for floor, panel and card: lit region at least 20% brighter, unlit region within 5%; (d) WCAG contrast: sample background pixels behind every text block's bounding box in screenshots with 5 lamps lit and the choreography at peak, compute contrast against its text colour, at least 4.5:1 for body and 3:1 for large text, using axe-core where available; (e) Calm, Ink and reduced-motion runs: no `requestAnimationFrame` callbacks from fx, flames or light engines in 5 s (count via a patched rAF), final lit states shown, screenshots non-blank; (f) `data-gl` on swiftshader and forced fallback both pass visual checks; (g) bundle: `gzip -c dist/assets/*.js | wc -c` at most 200 KB, CSS at most 45 KB.

**Files likely touched:** `src/lib/energy.js` (new), `src/lib/lightEngine.js`, `src/lib/quality.js`, `scripts/light-verify.mjs` (new), `package.json` (script).

**Tiers and Calm:** caps above apply to high; mid multiplies particle caps by 0.45 and bloom by 0.7; low removes the sampler (uses the static per-act exposure table) and caps particles at 60. Calm and Ink static.

**Budget:** about 2 KB JS gz; sampler 0.1 ms at 2 Hz.

**Verify:** the harness above is the verification; the build fails (`npm run verify:light`) if flash rate, p95 frame time or contrast thresholds are missed.

**Guardrails:** accessibility beats spectacle: when in doubt, lower exposure, never raise it above the AA ceiling.

---

## Risks and cut order
1. RISKS: the per-surface light (E4.1) adds style recalcs on scroll; the filter-based heat ripple (E4.4) can be costly on weak GPUs; WebGL2 is unavailable or slow on many mid-range phones; the light engine and V3's on-page lamp stops (more DOM at once) can collide with the effect budget; `--lx` rename must not clash with V3 edits to Stage.jsx; Safari lacks `ctx.filter` (we avoid it) and may treat `mix-blend-mode:screen` canvases as expensive.
2. CUT ORDER (cut first to last): lens ghosts (E4.3, E4.6), WebGL bloom (E4.3, keep 2D bloom), heat ripple and oil mirror (E4.4), window waves and torch (E4.7), crossette and rose fountains (E4.6), god-ray cones (E4.2), trail canvas (E4.5), dust motes (E4.2). Never cut: the light engine surface lighting (E4.1), five-layer flame core on high and the Calm still state, the flash guard and auto-exposure (E4.8), the blueprint reveal with its keyboard path (E4.7).
3. If frame time suffers: first lower `E` floor, then drop surfaces to 8, then lightmap to 15 Hz, then switch the page to mid tier; never remove content to save frames.


---

# PACK 3: THE OPENING SEQUENCE (E3)

Position in this file: 4 of 8. Apply order: see the table at the top.

## Pack overview
1. WHAT TODAY LOOKS LIKE (live page, 390x844 and 1366x768, screenshots in review screenshots (elev_3): everything is already lit at the first paint (toran, marigolds, string lights, skyline, moon, 6 labelled chips, INVITE ME). First contentful paint is about 308 ms, and the headline is already complete, so there is nothing to discover. The host diya is a 40 px object in a corner. The skyline slabs read as flat grey-blue boxes. V3 trims the clutter; this pack adds the film.
2. IDEA: the page opens in the dark. One spark, one wick, one flame; that flame is the only light source, and its radius is what reveals the headline, the terrace and (later) the street. Light is the progress bar, the cursor and the typography engine.
3. SIGNATURE MOMENTS: (a) LANTERN TYPE, headline letters illuminated by distance from the real flame, with a green glow on "324 tests passed." and an amber glow on "19 problems." (E3.2); (b) GALI JAG UTHI, a single travelling front of light that wakes bulbs, windows, balconies, toran and birds by distance from lamp 1 (E3.4); (c) the TWO FLAMES REACHING for each other during the hold, with an ember that waits if you let go (E3.3).
4. DEPENDS ON: E2 (tokens --ease-out-expo, --ease-in-out-quint, --ease-spring, --dur-xs 120, --dur-s 240, --dur-m 480, --dur-l 900, --dur-xl 1600; src/lib/motion.js; html[data-act]), E4 (src/lib/lightEngine.js, event bloom:set {x,y,r,i}, --lx --ly --li), E1 (art direction of the terrace). V3 owns all copy; this pack adds NO visible words.
5. CONTRACT OWNED HERE: window event `cue:play {name, ...}`. Names: open:strike, open:catch, open:beat {n:1..4}, open:flare, open:skim, open:done, wake:go {x,y}, hush {level:0|1|2, key}, attract:start, attract:stop. Attributes: html[data-open="cold|rest|done"], html[data-hush="0|1|2"], html[data-wake="pre|go|done"]. performance.mark names: ek:spark, ek:flame, ek:beat1, ek:beat2, ek:beat3, ek:beat4, ek:rest, ek:wake-end.

MASTER TIMELINE (ms from navigation start; tokens in brackets). Every item below is derived from ONE clock (E3.1), so skim, seek and Calm all work.
- 0: ground #0A0705, inline poster (no JS needed). 60: strike streak. 150: pop. 240 [--dur-s]: wick catches, flame 0.06 to 0.30. 400: beat 1 "324 tests passed." and light radius 107 px. 1000: radius about 0.5 of the final. 1400: beat 2 "Then an audit found 19 problems." 2400: beat 3 "Ship karte? Imaandari se bataiye." 3200: beat 4, the two Hinglish lines, hold hint, 60-second link. 3600: dashed sixth lamp fades up to 0.35. 4240: light radius and dolly at rest. 6000 idle: attract starts (E3.6). Hold: 1200 ms, then the 4.2 s street wakes (E3.4).

---

### E3.1: The cold open: poster, one clock, strike, catch, bloom, pull-back
**The astonishment:** Within 150 ms of loading, in a black screen, a single white-hot spark strikes at the wick of the host's diya and a flame blooms; the dark terrace is revealed by that flame's growing circle while the camera slowly pulls back from the diya. Nothing is blank, nothing is spinning, and it is cinema, not a loader.

**Build:**
1. POSTER (index.html, no JS): add `<meta name="color-scheme" content="dark">` and `<meta name="theme-color" content="#0A0705">`. Inline about 1 KB of CSS and one `<div id="poster" aria-hidden="true">` (sibling of #root, fixed, inset 0, z-index 9, pointer-events none) holding `.p-streak`, `.p-spark`, `.p-glow`. Position them at x = var(--gutter,16px)+30px, y = 54svh (the host wick; the real one is measured later). Pure CSS keyframes: 60 to 150 ms a 2x16 px #FFF3DC streak travels 28 px diagonally (ease-out); at 150 ms the `.p-spark` pops (3 px core, 24 px glow, one dip to 0.5 and back: that is the only flicker); from 240 ms `.p-glow` is a radial-gradient 140 px circle of rgba(255,179,71,.30) that grows scale 0.2 to 1 over 360 ms (cubic-bezier(.16,1,.3,1)). An inline `<script>` sets `document.documentElement.dataset.open = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'rest' : 'cold'` and `performance.mark('ek:spark')` on the spark's animationstart. First meaningful pixels must land under 400 ms with the JS bundle still loading.
2. CLOCK: new `src/lib/opening.js` (about 3 KB gz). One object `clock {t, scale}` advanced by the shared `ticker` (`clock.t += dt*clock.scale`). All JS-driven values are pure functions of `clock.t`: lightRadius(t), flameScale(t), dolly(t). Expose `window.__open = {seek(ms), setTier(q), clock}` only when `location.search` contains `cue=seek` (for verification, nothing stored). CSS/WAAPI animations that belong to the opening are created with `el.animate()` and tagged in a Set so that skim (E3.6) and seek can set `playbackRate`/`currentTime` on all of them.
3. LIGHT RADIUS: Rend = 1.1*max(innerWidth, innerHeight); s = clamp((t-240)/4000, 0, 1); R = Rend*(1-(1-s)^3) (107 px at 400 ms on a phone, 338 at 800, 595 at 1400, 837 at 2400). Each frame emit `bloom:set {x:wickX, y:wickY, r:R*flick, i:0.9}` with flick = 1 + 0.025*noise(t/180) (import `noise` from flame.js). At each beat boundary add a flare: R *= 1 + 0.14*exp(-(t-tb)/180). Flares change frame luminance by under 20 percent: keep it that way (flash safety). If E4's lightEngine does not draw the darkness pass, add `src/lib/openVeil.js`: a half-resolution aria-hidden canvas (CSS scaled 2x, DPR 1) in #stage above #sky, below #skyline? NO: above everything in the stage, below #night. Per frame: fill rgba(5,4,8,.97); `destination-out` radial gradient at the wick with stops 0:1, 0.30R:.92, 0.62R:.55, R:0; high tier adds a second `lighter` pass rgba(255,150,60,.10) at 0.8R. From t=3000 to 5200 ease the base alpha to a resting 0.30 (the ambient vignette), then stop drawing and `data-open="done"`.
4. PULL-BACK: wrap SkyLayer, SkylineLayer and Terrace in `<div id="world">` inside Stage.jsx (NOT #fx, so particle coordinates stay in viewport space). Use the individual CSS properties `scale` and `translate` (never `transform`, parallax.js owns that) with origin at the wick: sky 1.04, skyline far 1.06, mid 1.08, terrace 1.14, all easing to 1 over 4200 ms with cubic-bezier(.16,1,.3,1); the home diya wrapper `.home-wrap` goes 2.4 to 1 (origin at its wick) over the same curve, so a 40 px diya starts as a 96 px hero. After rest, a drift: translate -0.8 percent over 24 s alternate ease-in-out for far layers only.
5. Home flame (id 0): flameScale 0.06 to 0.30 in 240 to 600 ms, to 1.0 by 1400 ms (ease-out-expo). Handoff from poster: when Night mounts, measure the real wick (`lampRegistry.wick(0)`), set `--fx/--fy` on html, fade the poster out over --dur-s after two rAFs.

**Files likely touched:** index.html, src/main.jsx, src/lib/opening.js (new), src/lib/openVeil.js (new, only if E4 lacks a darkness pass), src/components/stage/Stage.jsx, src/components/Night.jsx, src/components/LampRow.jsx, src/styles/scene.css, src/styles/base.css.

**Tiers and Calm:** High: all of the above plus warm `lighter` pass and drift. Mid: veil at 30 fps, no warm pass, no drift. Low: no veil animation: poster glow, then three CSS steps (dark, 0.5 reveal at 800 ms, rest at 1800 ms) and a 600 ms cross-fade; dolly only on `.home-wrap`. Calm (`data-open="rest"` from the inline script): no strike, no bloom; the first paint is the rest frame: flame lit, headline lit, veil at resting alpha, dolly at 1. The poster in Calm is a still warm glow on dark ground that cross-fades to the page in 240 ms.

**Budget:** +3.5 KB JS gz, +1.5 KB CSS gz (plus 1 KB inline in index.html). Veil canvas about 80k px per frame (under 1.2 ms); run only for 5.2 s.

**Verify:** `ek:spark` mark under 400 ms with 4x CPU throttle; zero layout shift at the poster handoff; a screenshot at 0.4 s shows a dark screen with a visible flame and a soft circle of lit terrace, no text beyond beat 1; at 4 s the whole terrace is visible with darker corners; the particle canvas sparks still land on the wicks while the dolly is running (check lamp 1 ember position against `lampRegistry`).

**Guardrails:** Never delay any text or control behind the animation (everything is in the DOM from t=0), never animate `transform` on `#stage` or ancestors of #fx, and never add visible copy.

---

### E3.2: Lantern type: the headline lit by the flame
**The astonishment:** The letters of "324 tests passed." do not fade in; they are caught by the light as it sweeps across them, brighter near the flame, with a green afterglow on the tests line and an amber one on "19 problems." The reader feels the sentence being discovered, not displayed.

**Build:**
1. Replace the plain `<h1>` content in Night.jsx with `<OpenType>` (new component, about 1.2 KB). Keep ONE accessible string: `<h1 id="night-h" tabIndex={-1}><span class="sr-only">{fullText}</span><span aria-hidden="true" class="ot">...</span></h1>` so screen readers read the headline once. Structure: three beat groups `<span class="ot-b" data-beat="1|2|3">`; inside, words `<span class="ot-w">` (`display:inline-block; white-space:nowrap`, no transforms so wrapping is unchanged), inside letters `<span class="ot-l">`. The third beat is the existing bold `.ask` line (Ship karte? Imaandari se bataiye.), word level only.
2. MEASURE once after mount and on resize (debounce 150 ms): for each letter read `getBoundingClientRect()` in one batch, compute centre (cx, cy) and the elliptical distance to the home wick `d = hypot(cx-fx, 0.35*(cy-fy))`; write the number to the span as `--d` (unitless px). The 0.35 flattening treats the flame as light skimming along a wall: a line 250 px above the flame behaves as 88 px away, so the sweep runs left to right along each line instead of arriving as a block.
3. CSS per letter (pure numbers, no length division, no @property): `--k: clamp(0, calc((var(--r) - var(--d)) / 110), 1);` `color: color-mix(in srgb, var(--cream) calc(var(--k) * 100%), #8F8070);` `text-shadow: 0 0 calc(var(--k) * 16px) rgb(var(--glow) / calc(var(--k) * .40));` with `@supports not (color: color-mix(in srgb, red, blue)) { .ot-l { color: var(--cream) } }`. The unlit floor #8F8070 is 4.9:1 on #150F25 and 6:1 on #0A0705, so the text is AA at every moment. `--r` is set on `.ot` only (not on #night) by opening.js from lightRadius(t) including flares, and written each frame ONLY while `max(d) + 110 > R` (the sweep), then once more when settled.
4. Beat reveal: each group animates opacity 0 to 1 and `translate: 0 8px` to 0 over --dur-s with ease-out-expo at 400, 1400, 2400 ms (beat 4, the two Hinglish lines, hold hint and 60-second link, at 3200 with opacity only). Flare at each beat: letters of that group get `--k` overshoot to 1.25 for 180 ms (warmer #FFD27A), under 20 percent luminance change.
5. Colour meaning (decoration only, text stays cream so AA holds): group 1 `--glow: 143 209 166` (sage green, the colour the 324 wall will turn in E3.5); in group 2 the words "19 problems." use `--glow: 255 179 71`, stronger alpha .6, the rest of the line neutral cream glow. Finish: after rest, glows relax to alpha .18 and stay.
6. Skim and seek: letters are driven by `clock.t`, so `open:skim` just speeds the clock.

**Files likely touched:** src/components/Night.jsx, src/components/OpenType.jsx (new), src/lib/opening.js, src/styles/base.css, src/lib/rich.jsx (only if the ask line needs word wrapping).

**Tiers and Calm:** High: per letter (about 49 spans in beats 1 and 2), writes while sweeping only (about 1.2 s). Mid: per word (about 12 spans), 30 fps. Low: no per-frame writes; each beat group fades in with a CSS transition (opacity and color floor to cream over 480 ms). Calm: all text cream at rest, glows at .18, no motion.

**Budget:** +1.4 KB JS gz, +0.6 KB CSS gz. Frame cost: 49 style updates plus text-shadow repaint, under 1 ms on mid hardware for 1.2 s; gate by the governor.

**Verify:** at seek 400, 700, 1000 ms the letters nearest the flame are brighter than the farthest, all letters pass 4.5:1 (sample computed colour against a screenshot of the same region with text transparent); the DOM text via `h1.innerText` equals "324 tests passed. Then an audit found 19 problems."; screen reader name unchanged; no layout shift versus the plain headline at 320, 390 and 1366 widths.

**Guardrails:** Never change a word, a line break or a font size of V3's headline; never hide a word with opacity below the AA floor once its beat has started.

---

### E3.3: Hold to light: two flames reaching, an ember that waits
**The astonishment:** The reader's thumb on the first lamp makes the wick glow with heat, and the host's flame and the lamp's tiny flame lean toward each other like two people reaching; at the end an ember arcs across with a comet tail and the wick catches with a soft shock ring. Let go early and nothing is punished: the ember waits in the air for you.

**Build:**
1. Feel curve (new `src/lib/holdFeel.js`, 1 KB): hold total 1200 ms (V3). p(t) piecewise: 0 to 250 ms easeOutCubic to 0.20 ("the wick takes notice"); 250 to 900 ms slow 0.20 to 0.62 with a faint breathing (p += 0.012*sin(t/110)) ("the wick heats"); 900 to 1200 ms easeInCubic 0.62 to 1 ("it catches"). Tap or Enter keeps the existing SHORT 450 ms path but runs the same ignition sequence.
2. ZERO LATENCY: on pointerdown the DOM responds within one frame by direct style writes (not React state): `--press` 0 to 1 on `.lamp` over --dur-xs, `.lamp-btn` scale .97. Wick stroke lerps #8B7D6A to #FFB347 with `drop-shadow(0 0 calc(var(--press)*10px) #FFB347)`; a 1 to 3 px ember dot grows at the wick tip. Add an invisible 88x88 px hit area (`.lamp-btn::before{inset:-22px}`) so a thumb always lands.
3. TWO FLAMES REACHING: while holding, `engine.set(0, {leanExtra: +12*p, glowBoost: 1 + .12*p, scale: 1.08})` leaning toward lamp 1 (sign from the vector between wicks, max 14 degrees), and `engine.set(1, {leanExtra: -10*p})` toward the host. Keep the rule that the host flame never dims.
4. HEAT SHIMMER (high: 3 lines, mid: 2, low: none): three 1 px wavy SVG paths above lamp 1, `translateY(0 to -28px) scaleX(1 to 1.4)`, opacity `.35*p` to 0, 900 ms loops offset by 300 ms. No filters.
5. EMBER: born at the host wick when p >= 0.55; travels the existing quadratic path with u = ((p-0.55)/0.45)^0.9, so the flight is the last 45 percent of the hold. Comet tail: emit `fx:burst {kind:'spark'}` every 33 ms (the existing `sparkAt`) plus `trail` particles. Haptics (Android, optional): 6 ms at p .25 and .5, 10 ms at .75, 20 ms at ignition (existing `haptic`).
6. IGNITION (landing): 0 ms ember rests on the wick for 90 ms (a blink); 90 ms blue base appears; 90 to 610 ms flame scale 0.12 to 1 with --ease-spring overshoot to 1.08; 120 ms shock ring (1 px cream ring scale 0 to 2.4 around 120 px, opacity .35 to 0, 700 ms); `bloom:set` pulse r x1.6, i 1 for 300 ms; then `emit('cue:play', {name:'wake:go', x, y})` for E3.4. A caption "Ek diya jala. Poori gali jag uthi." (V3 copy) fades in 300 ms after landing.
7. EARLY RELEASE, kind by design: before the ember is born, the ring unwinds with easeOutQuint over 700 ms (no snap), heat lines fade in 500 ms, the wick keeps 25 percent glow for 4 s (the existing `warm` carry-over, so the next hold starts from about half), and the host flame exhales (scale 1.08 to 0.96 to 1, 600 ms, spring). After the ember is born, release leaves the ember hovering at its place, bobbing +-3 px at 0.8 Hz for 1.4 s; pressing again continues from that point; if nothing happens it drifts home along the arc in 700 ms. No shake, no red, no text.

**Files likely touched:** src/components/LampRow.jsx (press, animate, ignite), src/lib/holdFeel.js (new), src/components/Lamp.jsx, src/lib/flame.js (only to allow leanExtra on id 1), src/styles/lamps.css, src/lib/haptic.js.

**Tiers and Calm:** High: all. Mid: two heat lines, tail every 66 ms. Low: no heat lines, no tail, ring plus ember only. Calm: press lights the lamp at once (existing `instant`), the ring is drawn full, the cascade is the final state, the caption appears.

**Budget:** +1.5 KB JS gz, +0.8 KB CSS gz. All moving parts are transform/opacity; one rAF (existing animate).

**Verify:** headless pointer test: press 600 ms and release, `litCount` stays 0, ring offset recovering, ember hovering (`.traveller` visible), re-press within 1.2 s reaches lit in under 700 ms; full hold lights at 1200 +- 80 ms; keyboard Enter and tap light; the screenshot at 1000 ms shows both flames leaning toward each other and a glowing wick.

**Guardrails:** The thumb is always forgiven (no cancel zones, no failure state), keep tap, Enter and Calm alternatives exactly working, and no audio.

---

### E3.4: Gali jag uthi: the street wakes in one four-second wave
**The astonishment:** The instant lamp 1 catches, a soft front of light leaves it and the whole street answers in order: string-light bulbs warm one by one, apartment windows warm in clusters of three, balcony diyas twinkle on, the marigold toran unfurls, the rangoli draws itself, and five birds lift from a rooftop. It reads as one wave and one idea: one lamp lights a street.

**Build:**
1. New `src/lib/streetWakes.js` (1.6 KB). On idle after `open:done` it `collect()`s the elements (mark with `data-wake="bulb|win|bal|toran|bird"`): StringLights `.bulb/.bglow` (14, 12, 8 by tier), SkylineLayer `.win` (use `w.rank`; windows 0-5 are on at rest, ranks 6 to 25 are the wave), near-layer balcony diyas (new: 2x2 px warm dots in rows of three under 10 near windows, flicker 2.2 s; reuse E1/E5's if they exist), Toran strands, the Dusk birds. Re-collect on resize and when the quality tier changes.
2. FORMULA. Origin O = lamp 1 wick on `wake:go`. Metric `d(x,y) = hypot(x-Ox, 1.6*(y-Oy))` (the wave runs along the street). Rmax = largest d to the four viewport corners. u = clamp(d/Rmax, 0, 1). Front time `f(u) = 1 - sqrt(1 - u)` (the exact inverse of an ease-out-quad ring, so a light switches on as the visible front touches it). `delay = 180 + 3000*f(u) + classOffset` ms; classOffset bulb 0, toran +100, window +260, balcony +420; windows are grouped into clusters of three by (layer, block) and sorted by x, cluster delay from its centroid, inner stagger 70 ms. Birds are not distance-based: lift at 1800 ms, 120 ms apart. Total about 4.2 s. Write `--wd` (ms) once per element; CSS does the rest with `transition-delay: calc(var(--wd) * 1ms)`, so there is ZERO JS per frame during the wave.
3. FRONT: one `.wake-front` div (fixed, 240 px circle, radial-gradient ring rgba(255,210,122,.35) at 62 to 100 percent, `mix-blend-mode: screen` on high) animated with WAAPI scale 0 to Rmax/120 px over 3180 ms with `easing: cubic-bezier(.5,1,.89,1)` (ease-out-quad), opacity .5 to 0 after 60 percent.
4. Per-class motion (opacity and transform only): bulb: core opacity .06 to 1 over --dur-m with --ease-spring and glow +60 ms later, a 160 ms overshoot to 1.4x of the glow (filament warm-up from #FFF3DC to its own hue); window: opacity 0 to 1 over --dur-m; balcony: 0 to .9 over 320 ms then flicker; toran: `scaleY(.04)` to 1 about the top edge, 700 ms ease-out-expo with 4 percent overshoot, outer strands first, marigolds follow; rangoli: layer 0 of the existing rangoli draws over 1200 ms starting at 180 ms (stroke-dash, the existing `--p`); birds: five 12 px paths from a rooftop at skyline x 78 percent, arc up-left 3.2 s ease-out, flap 0.5 s steps, opacity out at 80 percent.
5. THE ONE-IDEA RULE: (a) exactly one front; (b) nothing starts until the front reaches it; (c) at most three kinds of motion visible at once (front, bulbs and windows, toran); balconies and birds enter only after 40 percent of the wave; (d) the headline and the hold area stay perfectly still (no letter animation after rest); (e) `cue:play {name:'hush', level:1, key:'wake'}` pauses cat tail, kandil sway, twinkle and TV flicker for the 4.2 s; (f) the cascade plays once per page load. If `litCount > 0` at load (deep link, shared state) apply the final lit state with no wave.
6. Tone steps: open at LIT tone 0 = 6 windows lit, tone 1 = 26 windows (edit only the first two numbers of `LIT` in SkylineLayer.jsx) so the wave has 20 windows to wake.

**Files likely touched:** src/lib/streetWakes.js (new), src/components/stage/Terrace.jsx (data-wake marks, toran strand initial state, balcony row), src/components/stage/SkylineLayer.jsx, src/components/stage/Dusk.jsx (birds), src/lib/director.js (replace the 900 ms `.wave` hack), src/styles/scene.css.

**Tiers and Calm:** High: 14 bulbs, 20 windows (about 7 clusters), 10 balconies, 11 toran strands, 5 birds, blended front. Mid: 12, 12 (4 clusters), 5, 7, 3, front without blend. Low: 8, 8, 0, toran fades as a block, no birds, no front (bulbs and windows only). Calm: final lit state instantly; the caption appears; no front, no birds.

**Budget:** +2 KB JS gz, +1.2 KB CSS gz. Peak animated elements about 40 compositor-only transitions, no JS in frame.

**Verify:** record `ek:wake-end` between 4.0 and 4.6 s after `wake:go`; assert bulb 1 starts before bulb 14 starts, near windows before far windows, and `--wd` increasing with distance (sample 20 elements); a screenshot at 1.5 s shows a lit region around lamp 1 with a visible front and a dark far side, and at 4.5 s everything warm; the headline's DOM is untouched during the wave.

**Guardrails:** One wave, once, never replayed; no sparks, rockets or fireworks (those belong to later lamps); no commentary beyond V3's single caption line.

---

### E3.5: The 324 / 19 beat, staged, and the hush
**The astonishment:** The reader taps a guess and the page goes quiet around the answer: the wall of 324 sage-green tiles fills in a ripple from their thumb, holds one breath, and then 19 tiles turn amber one by one, two of them glowing harder. They understand "green is not the same as safe" without reading a paragraph.

**Build:**
1. HUSH SYSTEM (new, in `src/lib/streetWakes.js` or `src/lib/hush.js`, 0.6 KB): `hush(level, key)` returns a release function; reference counted; sets `html[data-hush]` to the highest active level and emits `cue:play {name:'hush', level}`. CSS (ramp in --dur-m, out --dur-l): level 1 pauses ambient motion (`.cloud, .tw, .lantern .pend, .cat, .fan, .win.c-tv .pane, .strand, .gust`) via `animation-play-state: paused` and drops `#world` opacity to .78; level 2 additionally drops it to .6. In director.js `startAmbient()` skips petals, fireflies and lanterns when `data-hush` is not "0"; sparkler and delights are blocked. Any foreground interaction (guess, late-reply slider, take compare) uses `hush(1, key)` while it is active; release 600 ms after the interaction ends or when its section leaves the viewport. E5 and E7 reuse it.
2. STAGING of GuessAudit.jsx (E5 owns the tile art; do not redraw it). Re-time the existing canvas phases and change the palette: wall sprite `#8FD1A6` (sage green), problem tiles `#FFB347` amber with `#FF7A1A` core for the two high ones. Timeline from the tap, all in the canvas draw loop from one `t`:
   - 0 to 120 ms: chosen option presses (scale .96 then spring), hush(1), wall dims to 0.18 (ease-in-out-quint).
   - 120 to 1320 ms: green fills in a ripple from the tapped option: tile delay `1100*(d/dmax)^0.9`, each tile eases 0 to 1 over 240 ms with 6 percent overshoot. The chip number counts 0 to 324 in sync (rAF number tween, textContent only).
   - 1320 to 1820 ms: the held breath: everything steady, only a 0.5 Hz alpha breathing (.94 to 1).
   - 1820 to 3100 ms: the 17 regular problem tiles turn amber in the shuffled seed-324 order, 60 ms apart; each goes green to warm-white (60 ms) to amber (180 ms) and then pulses slowly (period 1.6 to 2.4 s, amplitude .75 to 1), never more than two transitions per tile in the first second. At 2950 and 3100 ms the two high tiles ignite last: scale 1 to 1.9 with a halo ring, `haptic(12)`.
   - 3100 to 3700 ms: the reveal text and the Hinglish line (V3 copy) fade in with --dur-m; hush stays until the reader leaves.
3. FLASH SAFETY: at most 19 of 324 tiles (about 6 percent of the wall's area) ever change, and none changes more than twice in any second; mean frame luminance never swings more than 5 percent.
4. Dolly: the wall block eases scale 1 to 1.02 over --dur-xl during the fill, back to 1 over --dur-l after the amber (a held-breath lean-in).

**Files likely touched:** src/components/story/GuessAudit.jsx, src/lib/hush.js (new) or streetWakes.js, src/lib/director.js (ambient gate), src/styles/story.css, src/styles/scene.css.

**Tiers and Calm:** High: ripple and pulses at 30 fps (the existing gap). Mid: 20 fps, no overshoot, no halo. Low: no ripple: green appears in four row-bands 150 ms apart, amber tiles appear with an opacity step, no pulse. Calm: the final picture (324 green, 19 amber, two with rings) immediately with the reveal text; no counting animation.

**Budget:** +0.8 KB JS gz, +0.4 KB CSS gz; canvas cost unchanged (the existing draw).

**Verify:** after a guess, `data-hush` is "1" within 150 ms and returns to "0" after leaving; at seek 1.0 s a partial green ripple is visible; at 1.6 s exactly 324 green; at 3.4 s exactly 19 amber (count pixels by sprite colour in a cropped screenshot), two larger; the 5 percent luminance rule with a 20 fps capture.

**Guardrails:** Never imply the 19 tiles are 19 of the 324 tests (keep V3's "picture only" note); no new copy beyond V3's.

---

### E3.6: Idle attract and the "skim" (skip that never feels like one)
**The astonishment:** A reader who touches nothing sees the host's flame gently lean toward the first lamp, the wick answer with a faint glow, and a tiny ember drift part-way and fade: an invitation, three times, never a nag. A reader in a hurry who taps or scrolls sees the opening fast-forward in a few hundred milliseconds with every line still lit, instead of being cut off.

**Build:**
1. ATTRACT (`src/lib/attract.js`, 0.8 KB). Starts when `now >= 6000 ms` since load AND `now - lastInput >= 2800 ms`, only if not Calm, `litCount === 0`, not `document.hidden`, no dialog or sheet open, `scrollY < 0.4*innerHeight`. Cycle 2600 ms: 0 to 700 ms host flame `leanExtra` to +9 and scale 1.08 (ease-in-out-quint); 400 to 1400 ms lamp 1's wick glow dot goes 0 to .35 to 0 (opacity, one breath) and one `ember` particle leaves the host wick along the first 35 percent of the lamp-1 arc and fades; 1400 to 2600 ms everything returns; the hold hint line goes opacity .65 to 1 and its underline sweeps once. Repeat at +9 s, at most 3 cycles, then a permanent still cue (a 35 percent warm dot on lamp 1's wick, no motion). Emit `cue:play {name:'attract:start'|'attract:stop'}`.
2. CANCEL: any `pointerdown`, `pointermove` over 8 px, `keydown`, `wheel`, `touchstart`, `scroll` or focus event cancels within one frame: cancel the WAAPI animations, reset `leanExtra` and glow, set `lastInput`. Never restarts while the pointer is over the lamp.
3. SKIM (the escape). Triggers: first `pointerdown` anywhere (a press on lamp 1 counts as both a skim and the start of the hold), first vertical scroll over 24 px or `wheel` over 20, any `keydown`, or `focusin` on a control that is still fading in. Action: `clock.scale` ramps 1 to 6 over 120 ms, `playbackRate = 6` on all tagged WAAPI animations, so the remaining beats complete in at most 600 ms with the same easing, light radius and sweep included; then `data-open="done"`. Do NOT `preventDefault` on scroll or touch (the page scrolls natively at all times), and do not add a "Skip" button or any new text: the 60-second link (V3 copy) and the Menu are already the visible exits, and they are focusable from t=0 (`opacity`, never `display:none` or `visibility:hidden`).
4. After a skim, the dashed sixth lamp and the status line are shown at their rest state at once. Announce nothing extra to assistive tech (V3's alt text is enough).

**Files likely touched:** src/lib/attract.js (new), src/lib/opening.js (skim), src/components/LampRow.jsx (hold-hint underline hook), src/styles/lamps.css, src/components/Night.jsx.

**Tiers and Calm:** High and mid: as above (mid without the ember particle). Low: lean only, no glow dot animation (static 35 percent dot after 6 s). Calm: no attract and no skim needed; the rest frame is already shown; the static cue dot is visible from the start.

**Budget:** +1 KB JS gz, +0.3 KB CSS gz; no always-running loop (one timer plus the shared ticker only during a 2.6 s cycle).

**Verify:** Playwright with no input for 6.5 s: `cue:play attract:start` seen, host flame `leanExtra` nonzero in a screenshot; a `pointerdown` at 7 s cancels (animations cancelled within 50 ms); after 3 cycles no further attract; a tap at 700 ms completes the headline by 1.3 s with `data-open="done"`; a scroll at 500 ms scrolls the page and completes the opening; Calm emits none.

**Guardrails:** Three cycles at most, never when the reader is interacting, never in Calm; skim must never hide, jump or lose a line.

---

### E3.7: First visit, shared link, deep link, and the 60-second path
**The astonishment:** A friend's link opens the same dark terrace, but a handful of tiny far-off diyas are already glowing along the rooftops: "you are not the first one here". A hurried reader gets one clear exit within the first screen, and a deep link goes straight to its place without replaying a film.

**Build:**
1. FIRST VISIT (default): the full master timeline. No storage of any kind (the page cannot know it is a repeat visit, and must not try).
2. SHARED LINK (`#v1.N[.name]`, parsed by hash.js and shown by ShareBanner, copy owned by V3): same clock and beats, nothing shifts. The greeting (tiny, above the headline) fades in at 1000 ms with opacity only. NEW decoration (no words): far diyas. For min(N, cap) with cap high 12, mid 8, low 4, place 2 px warm dots with a 10 px glow on the far-layer rooftops (positions from `mulberry32(2026+i)` across the skyline x range, y at roof height of the nearest far block), lit one by one from 1600 ms, 110 ms apart (so the row completes by about 3 s). When the street wakes (E3.4) these dots flare to 1.4x and settle, since the front passes over them. `#v1.0` or a bad fragment shows no dots. These dots are decoration, not a count claim; V3's banner text stays the only statement ("written in the link").
3. DEEP LINKS: `#lamp-N`, `#baithak`, `#voice`, `#wish`, `#closure`, `#sixty`, `#evidence`, `#text`, `#night` with an offset: if the hash targets anything except `#night` or a share fragment, set `data-open="done"` before first paint (inline script reads `location.hash`), skip the cold open, show the rest frame, and run only the target's own beat. For `#sixty` and `#evidence` the opening is silently done underneath the overlay.
4. SIXTY-SECOND PATH: the "Jaldi mein? 60 second ki file" link (V3 copy) is in the DOM from t=0 and keyboard-focusable at once; it appears with beat 4 (3200 ms) normally, immediately on skim, and carries `aria-keyshortcuts="s"` (no visible text change; the key handler exists only when no input is focused). Pressing it opens the existing SixtyDialog; closing returns focus to the link. Tapping the first screen anywhere completes the opening (E3.6), so a hurried reader never waits.
5. THE CHEKHOV LAMP: the dashed sixth lamp is the slowest element: opacity 0 to 0.35 over --dur-l at 3600 ms, no label, no flame; on tap it still tries and recedes as V3 already specifies (do not change that behaviour).
6. After rest, ONE quiet idle cue is allowed besides attract: V3's "agla diya" chevron after 4 s idle on the lamp-1 stop (not this pack).

**Files likely touched:** index.html (inline hash check), src/lib/hash.js, src/components/RowFragment.jsx (decoration hook only), src/components/stage/SkylineLayer.jsx (far diyas), src/components/Night.jsx, src/lib/opening.js, src/styles/scene.css.

**Tiers and Calm:** High/mid/low: dot counts as above. Calm: all dots lit, no stagger, no flare; deep links and the rest frame as usual.

**Budget:** +1 KB JS gz, +0.4 KB CSS gz.

**Verify:** `/#v1.7.Asha` shows 7 dots by 3 s, `#v1.0` none, `#v1.30` shows the cap; `/#lamp-3` loads with `data-open="done"` and no veil or poster flash; `/#sixty` opens the dialog with no console error; the 60-second link is reachable by Tab as the first control after Menu; no localStorage or sessionStorage writes (check with an evaluate before and after).

**Guardrails:** Never imply the dots are verified visitors, never store or send anything, never change V3's shared-link wording.

---

### E3.8: Verification protocol and budgets for the whole opening
**The astonishment:** (For the builder.) The opening is proven, not eyeballed: the same four-second film is captured at fixed instants on both viewports, its timing, contrast, flash and frame-rate numbers are measured, and any regression is a failing test.

**Build:** Create `scripts/e3-opening.mjs` using the existing Playwright driver (chromium executablePath `os.homedir()+'/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome'`, args `['--no-sandbox']`). Run each check at 390x844 (DPR 2) and 1366x768 (DPR 1). Always use `?cue=seek` so `window.__open.seek(ms)` and `setTier(q)` exist.
1. FILMSTRIP: for each tier (high, mid, low) seek to 0, 400, 1000, 2000, 4000, 6000 ms and screenshot to review screenshots (elev_3/film_<viewport>_<tier>_<ms>.png; a Calm run (`reducedMotion:'reduce'`) takes one screenshot at 300 ms and one at 6000 ms and asserts the pixel difference is under 1 percent. A human must LOOK at the strips: at 0 ms ground and a tiny spark, at 400 ms a flame and a circle of terrace with "324 tests passed." half lit, at 1000 ms the lit headline and a wider circle, at 2000 ms two beats and the terrace readable, at 4000 ms rest with darker corners and three beats plus Hinglish lines, at 6000 ms the attract has not yet fully started (or is mid lean).
2. TIMING (real clock, no seek): navigate with `waitUntil:'commit'`, read `performance.getEntriesByType('mark')` and paint entries. Assert: first-paint under 150 ms; `ek:spark` under 400 ms with `Emulation.setCPUThrottlingRate(4)`; beats within +-120 ms of 400, 1400, 2400, 3200; time-to-headline (beat 1 visible) under 600 ms throttled; CLS equals 0; no long task (over 50 ms) between 400 and 4600 ms.
3. FRAME RATE: a rAF sampler from 0 to 6 s: p95 frame time under 20 ms unthrottled and, at 4x throttle, the governor must be on mid or low by 3 s with p95 under 34 ms after.
4. CONTRAST: at seek 400, 700, 1000, 1400 ms compute, for 12 sampled letters, the WCAG ratio between `getComputedStyle(color)` and the median backdrop pixel (screenshot with the headline set to `color:transparent`); require at least 3:1 (target 4.5:1) always.
5. FLASH: capture a 20 fps CDP screencast over 0 to 5 s (and over the wake and the 324/19 beats), compute mean luminance per frame, assert at most 3 swings of more than 10 percent per second and none larger than 25 percent.
6. BEHAVIOUR: skim (tap at 700 ms completes in at most 700 ms, `data-open="done"`), scroll-skim (page scrolls, opening completes), hold (full, early release, ember wait, re-press), attract (appears at about 6 s, cancels on input, stops after 3 cycles, absent in Calm), wake (`ek:wake-end` 4.0 to 4.6 s after `wake:go`, order monotonic with distance), shared link dots, deep link without replay, no network requests other than the document (listen to `request`), no storage writes.
7. BUDGET: after `vite build`, gzip sizes of the opening modules (target at most 12 KB JS, 4 KB CSS together) and the total (JS at most 200 KB, CSS at most 45 KB).

**Files likely touched:** scripts/e3-opening.mjs (new), src/lib/opening.js (marks, seek hook), tests/ (if the repo has an e2e folder).

**Tiers and Calm:** The script forces each tier with `__open.setTier` and checks Calm separately.

**Budget:** Test code only; the `cue=seek` hook is under 0.3 KB and inert without the query flag.

**Verify:** the script prints a table (metric, value, budget, pass or fail) and exits non-zero on any failure; save the filmstrip PNGs and look at them.

**Guardrails:** Do not weaken a threshold to make a failure pass; fix the effect (cut it by tier) instead.

---

## Risks and cut order
1. RISK: the DOM headline split (49 letter spans) can regress wrapping, selection and screen readers. Mitigation: words are `inline-block nowrap`, one sr-only copy, aria-hidden letters, and a width sweep (320 to 1366) in E3.8.
2. RISK: `#world` wrapper and the `scale`/`translate` properties may fight parallax.js or E2's act pan. Mitigation: individual properties only, E2 owns `transform`, and test a lamp ember against `lampRegistry`.
3. RISK: the veil canvas competes with E4's light engine. Mitigation: one source of truth is `bloom:set`; build openVeil.js only if lightEngine.js has no darkness pass.
4. RISK: the elaborate opening delays a skimmer. Mitigation: skim is a 6x fast-forward on any input, text is always in the DOM, and the 60-second link is focusable from t=0.
5. RISK: flash and photosensitivity. Mitigation: flares under 20 percent luminance, tiny area, E3.8 flash test.
CUT ORDER (first to go): balcony diyas, far diyas for shared links, heat shimmer, birds, warm `lighter` veil pass, drift, per-letter lighting (fall back to per-word), the wake front ring, the dolly on the world layers (keep the diya scale), the veil (keep poster, text beats, wake). NEVER cut: the dark start with the instant poster, the three headline beats with AA floor, the any-tap skim, the Calm rest frame.


---

# PACK 5: CINEMATIC SET-PIECES (E5)

Position in this file: 5 of 8. Apply order: see the table at the top.

## Pack overview
1. Elevates HOW eight moments are staged: the green wall (Lamp 1), the late flame (Lamp 2), the phuljhadi (Lamp 3), the relay and rangoli (Lamp 4), the ghost flame (Lamp 5), the baithak window with its cards, loop ring and five-lamp shelf, the Voice compare plus the visitor's lamp, and the receipt sheet. One cross-cutting prompt (E5.10) makes every claim fly to its evidence. Ten prompts instead of eight because the lane asks for eight set-pieces plus the cross-cutting one; E5.1 also carries the shared kit.
2. Honest diagnosis from the live page (390x844 screenshots in the review screenshots): every device is a small cream-paper box inside a text sheet. The wall is a 320x150 canvas about 280 px wide; the late-reply wire is 80 px tall; the TipIndex rangoli is a black disc with a caption; Person is a pretty window plus three paragraphs; Voice is struck-through text with a slider. They read as widgets, not scenes. V3 moves them onto the dark stage (`#lamp-1`..`#lamp-5`), so each must become a full-width lit scene, not a paper widget.
3. Depends on: E2 (motion tokens `--ease-out-expo --ease-in-out-quint --ease-spring --dur-xs..xl`, `src/lib/motion.js`, `html[data-act]`, `--act-progress`, `stage:act`), E4 (`lightEngine.js`, `--lx --ly --li`, `bloom:set`), E1 (palette, one new local token `--wall-green`), E3 untouched. V3 copy is untouched: every string below is an existing V3 string unless marked NEW.
4. Rules for every prompt: copy, facts, numbers and `MODEL OF DOCUMENTED BEHAVIOR` labels stay exactly as V3 Part E. Every device keeps its plain-text twin, its native control (radio group, `input[type=range]`, button) and its keyboard path. Visuals are `aria-hidden`. Nothing is stored. No audio. Haptics only on user drags, Android, never Calm.
5. Order inside the pack: E5.1 first (shared kit), then 2 to 5 in any order, then 6 and 7, then 10 (needs 6 and 7), then 8, 9.

Signature moments nobody has on a portfolio: (a) a touchable 324-bulb curtain wall that goes dark and then pushes the camera in on a single amber bulb (E5.1); (b) a sparkler that burns a flattering number down into a small steady diya (E5.3); (c) a ghost double-exposed flame at 06:00 that belongs to 06:15 (E5.5); (d) raw speech rendered as rumpled cloth that the flame presses flat (E5.8); (e) proof chips that lift off a claim, fly an ember arc and light the lamp that proves it (E5.10).

---

### E5.1: The green wall (Lamp 1) plus the shared set-piece kit

**The astonishment:** A full-width curtain of 324 green balcony lights hangs on the dark terrace and answers the thumb: it sways, ripples and brightens under the finger. After the guess it goes nearly dark for one held beat, then 19 amber bulbs rise one by one and the camera pushes in on the brightest. Green is not the same as safe, understood in 8 seconds without reading.

**Build:**
0. Create `src/lib/setpiece.js` (shared by E5.1 to E5.9, about 1.2 KB gz): `useInView(ref, {threshold:.6})` (IntersectionObserver, returns boolean, fires once and reports on leave); `spring(state, target, {k, c}, dt)` (semi-implicit Euler, returns {x, v}; defaults k=170, c=18, clamp dt to 32 ms); `foreground(on)` which does `emit('fx:foreground',{on})` and sets `document.documentElement.dataset.fg='1'|''` (E4/E8: fx.js and Terrace sway read it and stop sparks, cat, kandil sway, glints while a device is being touched; call on pointerdown and release 1.2 s after pointerup); `tier()` returning `getState().quality`; `dark` surface helper: every device root gets `data-surface="stage"` and its own CSS, not the cream `.device` box.
1. Rewrite `GuessAudit.jsx` as a full-bleed canvas of `width:100%`, `aspect-ratio: 5/4` on phones (about 390x312), `16/7` on laptops, capped at 960 px, with a soft vignette edge and a top rail (a bamboo-brown 3 px bar with 18 hooks).
2. Layout: 18 vertical strands x 18 bulbs = 324 exactly (replace the 12x27 sagging rows; the curtain "jhalar" is the real balcony object). Strand i hangs at x = pad + i*(W-2pad)/17; bulb spacing 0.042*H. Bulb sprite is pre-rendered once: core `--wall-green` lifted (#7EE0A0 core, #2F6B4F halo, 24 px sprite, drawn 11 px). Ink theme: cream bulbs, same layout.
3. Physics (high tier, 60 fps): each strand is a damped pendulum angle with `spring(k=26, c=2.4)` about its hook; bulb j sits at the strand angle times (j/17) so the tail swings more. Pointer move adds an impulse to strands within 56 px: `v += clamp(pointerVx*0.0035)` scaled by falloff `cos`; pointer also lifts bulb brightness inside a 64 px lens (`a = min(1.25, a + .5*(1-d/64))`). Tap adds a ring ripple (existing code, speed 9 px/ms). Idle: a slow diagonal chase wave (period 4.2 s, amplitude .18) so the wall is alive before touch. Arrival (`useInView` at 60%): bulbs ignite along a diagonal sweep, delay `(x+y)*0.9 ms`, total 1.4 s, `--ease-out-expo`.
4. Guess choreography (keep the radio group `0 3 8 19`, same `pick`): (a) 0 to 500 ms: wall dims to 0.2 (`--ease-in-out-quint`); (b) 500 to 800 ms: total hold, stage `fg` on, nothing moves (the silence is the effect); (c) 800 ms onward: the same seeded 19 (`FLICKER` from `mulberry32(324)`) rise amber (#FFB347) one by one, 70 ms stagger, each flickers at most 2 Hz between .55 and 1 alpha; (d) the first two of that list are 2x size with a halo ring; (e) at 1.9 s the canvas camera pushes in: apply `translate/scale` about bulb #1 from scale 1 to 2.6 over 1.1 s (`--ease-in-out-quint`), the neighbouring green bulbs blur out by alpha; hold 1.2 s; pull back over 700 ms; a tap on the wall in between jumps to the second bright bulb. Caption (V3 tile caption) fades in at pull-back.
5. A guess of N first draws N faint amber ghost bulbs on the dimmed wall for 400 ms (your guess), which then vanish as the true 19 rise: it shows how far the guess was, with no new copy.
6. Keep `picture-only` ("a picture, not a map") visible and the plain twin. Bulbs are never labelled as tests or findings.

**Files likely touched:** `src/lib/setpiece.js` (new), `src/components/story/GuessAudit.jsx`, `src/styles/story.css`, `src/lib/fx.js` (listen to `fx:foreground`).

**Tiers and Calm:** High: strand physics, lens, camera push, DPR 2. Mid: 30 fps, no strand physics (bulb sway by one sine per strand), push-in without blur, DPR 1.5. Low: no loop at all, redraw only on tap (ripple as 3 frames), the dim and rise become 300 ms fades, no push-in. Calm and `prefers-reduced-motion`: final state at once, wall lit green, 19 ambers solid with `#C2410C` rings (rings carry meaning in Ink and Calm; never colour only), two larger.

**Budget:** +5 KB JS gz (kit 1.2 + wall 3.8), +0.7 KB CSS. Frame cost high 2.2 ms (324 drawImage plus 18 trig), mid 1.2 ms at 30 fps.

**Verify:** Playwright: wall canvas width >= 340 at 390 px; before any click the canvas pixel hash changes between two frames (alive); click `19`; at 600 ms the mean luminance is below 30% of the lit value; at 2.5 s the camera scale reads 2.4 to 2.6 (expose `data-cam` on the canvas); with `emulateMedia reducedMotion` the final frame is identical immediately; count of amber rings is exactly 19 via `data-found="19"`; no frame drops below 50 fps in a 4 s CPU-throttled (4x) trace. Screenshot at 2.6 s must show one big amber bulb with a ring, blurred green dots around it.

**ONE-SCREEN TEST:** A big wall of green lights goes dark and a few amber ones light up, so green does not mean fine.

**Guardrails:** No new copy; the 19 bulbs are a picture, never a map of the 19 findings onto the 324 tests; no strobing (flicker at most 2 Hz, each bulb under 4% of the area).

---

### E5.2: The late flame (Lamp 2): a wire, a gate, a flame that trails the thumb

**The astonishment:** A flame rides a dashed wire toward a toran gate. In the old logic it sails through late and keeps burning steadily; in the corrected logic the same late flame gutters, greys and leaves a wisp of smoke at the gate. The model is stamped on the scene itself.

**Build:**
1. Rewrite the visual layer of `LateReplySlider.jsx`; keep every existing prop: the real `input[type=range]` (index 0..15, `t = i*0.4`, so exactly 3.0 s is unreachable), `aria-valuetext`, readout `role=status`, logic toggle buttons, the 400 ms throttled live region, and the haptic on crossing the deadline. The input stays as an invisible 44 px tall overlay across the scene; visuals follow it.
2. Scene: full width, `aspect-ratio: 16/6` on laptops, `2/1` on phones, `data-surface="stage"`. Left: a hook post with a small paper lantern labelled by the existing `deadlineLabel`-style micro-label for the start. Wire: a catenary (SVG path, `stroke-dasharray: 7 6`, marigold at 55%): the dashes ARE the "simulated" signal (add to the legend nothing new; the existing `MODEL OF DOCUMENTED BEHAVIOR` tag hangs from the wire on a thread as a dashed-border paper tag, always visible, never faded). Gate at x(3 s) = 3/6 of the width: two bamboo posts and a marigold toran garland (reuse the five `<em>` bead markup, now drawn as a swagged SVG with 9 beads), label `3-second deadline` under it.
3. Flame follower: the flame glyph is NOT the native thumb. It follows the input value through `spring(k=150, c=15)` along the wire, leans by `-v*0.012 rad` (up to 14 degrees), has a 6-point ember tail (positions from the last 6 spring positions, alpha .5 to 0). Releasing leaves visible inertia (about 260 ms of glide, a 3 px overshoot). The wire plucks: crossing each 0.4 s step pushes a travelling sine ripple down the wire (amplitude = min(4, |v|*0.5) px, decays in 700 ms).
4. Gate behaviour before the deadline: the toran lifts 6 px as the flame passes (the existing `swing` keyframe, now per-bead phase offset 40 ms), a soft tick mark lights on the gate post. After the deadline, Original logic: flame passes, is steady, a small health diya at the far right stays lit and stays cream; the reply mark ring is solid; caption "Lau jalti rahi, jawab toh der se aaya tha." Corrected logic: on crossing, flame scale to .45 over 900 ms (`--ease-in-out-quint`), hue to grey-blue (#8FA4C4 core), a 3-point smoke wisp rises (CSS translate, 1.6 s), the far diya dims to 35%; caption "Lau dheemi hui: der se aaya jawab ab proof nahi." Toggling the logic while past the deadline cross-fades flame states in 480 ms (`--dur-m`); gutter to relight uses a small spark.
5. Light: flame casts `bloom:set` (r 90, i .6) onto the wire and the toran while within 2 s of the last move; E4's `--lx --ly --li` light the toran beads.
6. Alt: the visually hidden readout sentences stay exactly the V3 readouts; the scene is `aria-hidden`.

**Files likely touched:** `src/components/story/LateReplySlider.jsx`, `src/styles/story.css`, `src/lib/setpiece.js`.

**Tiers and Calm:** High: spring, tail, wire pluck, smoke, bloom. Mid: spring and lean only, tail 3 points. Low: flame snaps to the value with a 120 ms transform transition; states change by opacity. Calm: flame jumps with no spring; corrected state shows the small grey flame, original the steady one; no wisp.

**Budget:** +3 KB JS gz, +0.5 KB CSS; 1 ms per frame while dragging, zero while idle (loop sleeps when |v|<0.01 and settled).

**Verify:** drag input to 2.8: flame x within 8 px of `value/max * wireWidth` after 600 ms; to 3.2 with Original: flame `data-state="alive"`; click Corrected: within 1 s `data-state="guttering"`; no text changes versus V3 readouts; the badge text is in the DOM and its bounding box is inside the scene. Screenshot: grey small flame past the gate, smoke wisp, bright steady far lamp absent.

**ONE-SCREEN TEST:** A flame arrives late; one logic still calls it alive, the other lets it die.

**Guardrails:** The label `MODEL OF DOCUMENTED BEHAVIOR` and "simulated" never leave the scene; never imply live monitoring.

---

### E5.3: The phuljhadi that burns a number down to a diya (Lamp 3)

**The astonishment:** A paper tag swings on a nail with a huge, glittering 3.1x. Tap it: a sparkler fizzes, the number is lit white-gold by the spark storm, and as the sparkler burns down for two seconds the numeral counts itself down; the last spark drops into a clay diya that catches with a small steady flame at about 1.02x. "Chamak nahi, sach."

**Build:**
1. Rewrite `StoryPriceTag.jsx` as one scene (`data-surface="stage"`, `aspect-ratio 4/5` on phones, `16/9` on laptops). Left two thirds: the tag (rounded paper, punched hole, string to a nail) as an SVG/DOM element; a pendulum with `spring(k=40, c=2.2)` on angle, idle amplitude 3 degrees (period 3.2 s like today), draggable (pointer capture, release inherits angular velocity), tap adds an impulse; its paper shading uses a 105-degree gradient whose angle follows the swing.
2. Right third: a phuljhadi (thin wire stick, grey dressing, bright tip) planted in the rim of a small clay diya (use `Lamp` n=3 `shape`, unlit). Native control: keep the existing `<button aria-pressed>` "flip" control as the keyboard path and the toggle text; tapping the tag, the sparkler or the button all call the same `ignite()`.
3. `ignite()` timeline (total 3.4 s, tap anywhere to skip to the end): t=0 tip flares (bloom r 140, i 1.0); 0 to 2.0 s sparkler burn: `fx:burst {kind:'phuljhadi', x,y}` from the tip every frame budget (high 70 sparks/s, mid 35, low 12; the existing fx.js kind), the stick shortens (`scaleY` .1 to 1 about its top), the tag swings from recoil (impulse -0.6 rad/s at t=0), numeral glare `text-shadow` and a warm light on the paper from the tip via `--lx --ly --li`; numeral counts 3.10 to 1.02 with `easeOutQuint` over 1.9 s, tabular-nums, glare drains in step; at 2.0 s the tip reddens to an ember, 40 ms crackle (fewer sparks), a smoke curl; at 2.2 s the last spark arcs 0.35 s into the diya wick; 2.6 s wick lights, flame rises to a small steady size; numeral settles cream, glare off; the withdrawn "3.1x" stays as a ghost numeral, 30% alpha, with a thin strike line; the advertised-advantage bar (keep `.bar`, now a light bar) deflates `scaleX(1.02/3.1)` at the same moment; 3.0 s caption "Chamak nahi, sach." fades in (`--dur-l`).
4. The counter row keeps V3 labels: `1,205 ns -> 1,850 ns . 3.1x -> about 1.02x`, chip `Historical run . not remeasured`. The `1,205 ns` figure carries its tooltip-free caption "uncommitted working tree" and `1,850 ns` "controlled run" already in the plain twin; do not move them.
5. Ink: `fx.js` drops crackers in Ink, so draw the burn as 12 SVG ray strokes from the tip (`stroke-dasharray` animating 1.8 s) instead of particles; same timeline. Replay: the button toggles back (pressed false) re-raising the tag and relighting a fresh sparkler (stick scale resets).

**Files likely touched:** `src/components/story/StoryPriceTag.jsx`, `src/styles/story.css`, `src/lib/fx.js` (sparkler anchor option), `src/lib/setpiece.js`.

**Tiers and Calm:** High: particles, glare, tag physics, bloom. Mid: half particles, no glare shadow animation (opacity layer instead). Low: no particles; a bright tip dot and 6 CSS ray lines scale in, numeral counts in 8 steps. Calm: final state only: ghost 3.1x struck, 1.02x steady, diya lit, burnt stub with a tiny cinder, caption visible, zero motion.

**Budget:** +2.5 KB JS gz, +0.6 KB CSS. Particles come from the existing pool (no new canvas).

**Verify:** click the button; at 1 s the numeral text is between 1.2 and 2.7; at 3.6 s it reads exactly `1.02x`, caption present, diya `is-lit`; `fx.liveCount()` returns to ambient level within 2.5 s of the end; reduced motion shows the end state instantly; the text twin sentence is unchanged. Screenshot at 1.2 s: sparks, warm paper, glowing numeral; at 4 s: calm diya, ghost 3.1x.

**ONE-SCREEN TEST:** A sparkler burns out and leaves a small steady lamp where the big flashy number was.

**Guardrails:** Crackers fire only after the tap; no commentary on crackers; sparkle is a metaphor for the number, never a claim about performance.

---

### E5.4: The relay and the 820 rangoli dots (Lamp 4)

**The astonishment:** One flame leaves a flickering "Codex" lantern, pauses at three checkpoint stones that each light as it touches them, and lands in the "Claude Code" lantern. Below, a rangoli of exactly 820 rice-flour dots blooms ring by ring under a held thumb, with a tick every hundred dots.

**Build:**
1. Rewrite `StoryHandoff.jsx` as two clearly separate stages divided by a dashed kolam line (keep the existing rule: the dots belong to the whole record, not to the time after the handoff; do not draw any thread between the Claude Code lantern and the rangoli). `data-surface="stage"`.
2. Upper stage (aspect 2.4/1): two hanging paper lanterns (akash-kandil: 8-point star silhouette, not people, no hands, because agents are not people) labelled by the existing `ex.codex` / `ex.claudeCode`. Codex begins lit but sputtering (flame amplitude .5, a slow double blink at 0.5 Hz) to show a limit; Claude Code begins dark. Between them a dotted catenary with the three existing stones (`ex.stones`) as small marigold diya-dishes.
3. Native control stays: `<button className="baton-btn">` (aria `ex.batonAria`) covers the whole upper stage (44 px+). Press: (a) 0 to 350 ms Codex flame lifts off as a bright ember (`--ease-out-expo`); (b) three legs of 520 ms each along a quadratic arc, each leg ends with a 350 ms hover at a stone where that stone flares (r 40 bloom) and its text label brightens (the pause is the checkpoint); the dotted path fills solid behind the ember; (c) lands in Claude Code: lantern blooms (bloom r 120, i .9), Codex returns to a calm steady glow; total about 2.4 s. Haptic 10 ms per stone, 20 ms at landing.
4. Lower stage: canvas `SIZE 260` (was 200), a faint rice-flour guide: 41 rings of 20 faint dots plus a 12-petal lotus outline in the centre. The 820 dots are drawn incrementally (never clear), from the centre outward, ring by ring, with the existing colour set and angle `ring*2.6`. Pre-render 4 dot sprites with a 3 px glow. Hold gesture: pointerdown anywhere on the canvas (and on the existing `holdRounds` button, which stays as the keyboard path) fills at `820/2500 per ms` (the existing maths); a finger glow follows the touch point; each completed 100 dots: an expanding ring pulse (320 ms) and `haptic(8)`; release early holds the count; tap (under 350 ms) runs to the end, as today.
5. At 820: soft bloom pulse across the rangoli, counter locks to `820 of 820 completed measurement rounds` with the chip `820 rounds . repo-reported`. The count never exceeds 820 (assert in the draw step).

**Files likely touched:** `src/components/story/StoryHandoff.jsx`, `src/styles/story.css`.

**Tiers and Calm:** High: glow sprites, ring pulses, bloom. Mid: no pulses, 20 fps fill. Low: fill in 10 batches of 82, no glow. Calm: lanterns both lit, path solid, all 820 dots drawn, counter at 820.

**Budget:** +2.8 KB JS gz, +0.5 KB CSS; fill loop under 1 ms per frame (dots per frame at most 14).

**Verify:** click baton: at 3 s `Claude Code` lantern has `lit`; hold the canvas 1.4 s: dot count between 380 and 560 (`data-dots`); never above 820 after 10 s; keyboard Enter on the button completes; sr-only live region announces 820 once. Screenshot at 1.2 s hold: half-bloomed rangoli with a finger glow.

**ONE-SCREEN TEST:** One flame passes from one lantern to another, and below it 820 dots fill in.

**Guardrails:** No hand or person imagery in the relay; keep the two halves visibly separate; the 820 are repo-reported rounds for the whole record.

---

### E5.5: The clock and the ghost flame (Lamp 5)

**The astonishment:** Drag the hand to 06:00 and a translucent double-exposed flame appears at 12 o'clock, burning a quarter-hour before its time. A pale arc along the dial's rim shows where it really belongs (06:15) and how far it travelled.

**Build:**
1. Rewrite the visuals of `StoryCutoffClock.jsx`. Keep: the three stops `05:45 06:00 06:15`, route toggle direct/CSV with its note, the `range` input with `aria-valuetext`, the `MODEL OF DOCUMENTED BEHAVIOR` badge line, `UTC`, `band-note`, and the visible readouts. The existing `visible`, `ghost` logic stays exactly.
2. Dial: 300 px on phones, dark enamel face with a brass-ring rim (two strokes, 3 px and 1 px, `--marigold` at 60%), minute ticks every 5 min only on the 05:45 to 06:15 arc (a 180-degree arc, left to right), numerals at the three stops. A small parapet shelf under the dial and a 6-point diya at 3 o'clock "home" slot, unlit.
3. The hand: pointer-drag (existing `angleOf`), now with `spring(k=120, c=14)` follow, magnetic detents at -90, 0, 90 degrees with a 4-degree overshoot settle (spring), and a `haptic(8)` tick on detent. Hand is a thin cream pointer with a flame-coloured bead.
4. Ghost flame (route direct, stop 1): at 12 o'clock render the flame three times, 55%, 30%, 18% alpha, offset -2/+3 px, each flame path cut into 5 horizontal slices with phase-shifted x offsets `sin(t*2.2 + i)*1.4 px` (cheap, no SVG filter) at 0.5 Hz; on arrival a 700 ms fade-in plus a faint 60 px bloom. A dashed tether (stroke 1.5, 4 3) runs along the rim from the real home at 3 o'clock to 12 o'clock with a travelling dot (1.8 s loop), and an arc highlight sits on the rim between them (the quarter-hour). Tiny label on the arc: `15 min` (NEW micro-label, derived from the numbers 06:15 minus 06:00; mark for approval).
5. At 06:15 direct: flame lives at the 3 o'clock home, solid, one steady flame (existing `solid`); ghost copies merge into it over 480 ms (`--dur-m`, `--ease-out-expo`). 05:45: no flame, home slot empty. CSV route keeps its own rule (visible only at 06:15, early stops show the existing early-stop text).
6. Caption "06:15 ki baat, 06:00 par." fades under the dial when the ghost appears. After the first ghost sighting, E6/V3's parapet Lamp 5 flame may ignite (do not wire; leave the V3 lamp state logic alone).

**Files likely touched:** `src/components/story/StoryCutoffClock.jsx`, `src/styles/story.css`.

**Tiers and Calm:** High: slices plus bloom plus tether dot. Mid: three offset copies, no slices, no bloom. Low: two static copies (one faded) and a static tether. Calm: ghost shown as two static offset flames at 06:00 and the arc highlighted; no motion.

**Budget:** +1.8 KB JS gz, +0.5 KB CSS; loop only while ghost is on screen and visible, 0.4 ms per frame.

**Verify:** set range to 1 (06:00) direct: element `.ghost` exists with 3 flame layers; set 2: `.solid`; set 0: no flame; csv at 06:00 shows none; readout texts unchanged (snapshot); the hand reaches the detent within 500 ms. Screenshot at 06:00: the doubled translucent flame, rim arc, tether.

**ONE-SCREEN TEST:** At six o'clock a flame is already burning that should not light until a quarter past.

**Guardrails:** It is a model of one documented time-zone fold case, never a live database; never say every audit finding is fixed.

---

### E5.6: The baithak window and the cards that slide out of it

**The astonishment:** A lit apartment window with four panes, each holding a tiny silhouette still life (no faces). Tap a pane and it blooms warm while the others dim; the card does not appear, it grows out of the pane, then flips to its proof face.

**Build:**
1. Upgrade `Person.jsx` to the V3 `#baithak` four-pane module (V3 PART G1 content and flags untouched). Scene SVG, full width, height 46svh max 380 px: night courtyard wall, window with four panes, sill, string lights draped over the frame (reuse the 20-bulb string). Each pane holds a vignette drawn as 3 to 5 shapes in ochre on a gold ground, no figures: pane 1 a desk with an open laptop, a book stack, a small diya; pane 2 a podium with a mic and a pen; pane 3 a tray of four steaming chai cups (the sentence is "Baithiye, chaay aa rahi hai", and four contributors); pane 4 a shelf of five small cups (kulhad shapes, deliberately not the five terrace lamps). Steam: 3 CSS wisps per cup, 5 s loops, pausing off screen.
2. Interaction: the four tabs in the V3 text row remain real `role=tab` buttons; the panes are also tappable (same handler, `aria-hidden` visuals). Selecting a pane: (a) pane glow rises from the sill, opacity .08 to .85 over 480 ms (`--ease-out-expo`), the others to .3; (b) `bloom:set {x,y,r:120,i:.7}` at the pane centre so E4 lights the sill and the card; (c) the card FLIPs from the pane: measure pane rect and card rect, animate `clip-path: inset()` plus `scale/translate` from the pane to the card over 520 ms (`--ease-out-expo`), content fades in at 160 ms delay; the old card exits upward 8 px in 240 ms. First pane auto-opens when the section is 60% in view.
3. Card faces (30 words, V3 text): front and back are two stacked faces; `Proof` flips with `rotateY(180deg)` in 640 ms (`--ease-spring`, `backface-visibility:hidden`); both faces stay in the DOM, the hidden face gets `inert`; the `Plain text` `<details>` and Chips sit below, always in the DOM. Proof chips use E5.10.
4. Paper feel: card background cream with a 4 px warm band at the bottom lit from the pane (`--li`), AA contrast kept (text ink on cream untouched).
5. Stage cue: on enter `html[data-act="baithak"]`; skyline pan and veil are E2's job; this module only reads `--act-progress` to move the string lights 2 px.
6. Close of the room: the pull-line "I didn't learn that every plan works..." sets in the window light, then the panes dim to 40% together over `--dur-l` and the scene fades to the terrace.

**Files likely touched:** `src/components/Person.jsx` (or its V3 `Baithak.jsx`), new `src/components/baithak/PaneScene.jsx`, `src/styles/story.css`.

**Tiers and Calm:** High: steam, bloom, FLIP clip-path, flip spring. Mid: no steam, FLIP as scale-fade, flip linear 400 ms. Low: crossfade only. Calm: pane 1 lit and its card shown, other panes at 40%, tab switch is an instant swap, flip is an instant toggle with the same content.

**Budget:** +3.5 KB JS gz, +1 KB CSS (SVG vignettes ~1.8 KB inline).

**Verify:** keyboard tab/arrow selects panes; exactly one card visible (`[data-card]:not([inert])` count 1); card width at 390 px within gutters; the plain-text `<details>` content equals the face text plus proof; Calm skips motion; no card exceeds 30 face words. Screenshot: pane 3 lit with its card grown under it, others dim.

**ONE-SCREEN TEST:** A lit window with four small scenes; touch one and its story opens from it.

**Guardrails:** No faces or deity imagery, no new claims: card sentences come only from V3 Part E.

---

### E5.7: The loop ring and the five-lamp shelf (inside the baithak)

**The astonishment:** "How I work" is a ring of six small flames joined by a glowing wire, with an ember endlessly walking the loop; tap a stop and its sentence opens at the centre. "What I bring" is a shelf of five brass lamps; touching one raises its flame and shows proof and limit.

**Build:**
1. New `src/components/baithak/LoopRing.jsx` for Card 6: `role="radiogroup"`; six `<button role="radio">` stops (44 px) placed on a 250 px circle (angle = -90 + i*60 degrees), each a miniature diya with the V3 step title (`Rule pehle`, `Number saaf nikaliye`, ...). The wire between stops is a dashed arc path; stop 6 connects back to stop 1 with a small arrowhead. Idle: one ember travels the full loop in 14 s (`offset-path` or SVG `animateMotion` replaced by JS), pausing when a stop is selected or the section is off-screen. Selecting stop k: its flame rises (scale .6 to 1, 400 ms), previous stop settles to a lit-small state ("visited"), centre text swaps with a 240 ms cross-fade: the step sentence verbatim from V3 (numbers untouched). Arrow keys rotate selection; Home/End; the `ol` twin stays in the DOM and is the Plain text content.
2. Each stop shows its E5.10 proof chips (for example step 1: Lamp 4; step 2: Lamps 3, 2; step 3: Lamps 1, 2, 3; step 4: Lamp 4; step 5: Lamps 3, 5; step 6: Lamp 6), flying as in E5.10.
3. New `src/components/baithak/BringShelf.jsx` for Card 7: a window shelf with five small brass lamps (brass gradient #C9A24A to #7A5A1E, deliberately a different material from the clay terrace lamps, and numbered 1 to 5 as capabilities, not projects). Tap or Enter/Space selects; selected lamp's flame rises (300 ms spring), shelf light warms; below, the capability text slides in: Proof, Fair warning, `My view` line (V3 text). The twin is the five-row table. After any selection the line "I have no growth wins to borrow." is shown (V3 text) in its place.
4. Both widgets are `data-surface="stage"` (dark ground, warm light).

**Files likely touched:** new `LoopRing.jsx`, `BringShelf.jsx`, `src/styles/story.css`, `src/components/Person.jsx`.

**Tiers and Calm:** High: ember walks, flames spring. Mid: ember steps stop to stop only on selection. Low: no ember, state change by opacity. Calm: first stop and first capability selected, no ember, all content reachable by tap.

**Budget:** +2.4 KB JS gz, +0.6 KB CSS.

**Verify:** radiogroup keyboard cycle through six; `aria-checked` correct; text of step 4 contains `820`; five-row table present; no overlap of stops at 360 px width (stop rects pairwise disjoint). Screenshot: ring with stop 3 lit, centre text.

**ONE-SCREEN TEST:** Six lamps in a loop show how he works; five lamps on a shelf show what he brings.

**Guardrails:** The shelf lamps are capabilities backed by proof chips, never skill levels or ratings.

---

### E5.8: Voice as pressed cloth, and the visitor's lamp

**The astonishment:** The spoken take looks slightly rumpled, each word on its own tilted thread. Drag the flame through it and a thread of light presses the text flat behind it; trimmed words dissolve into motes that drift into the flame. At the end the clean paragraph glows once. Then, at the very end of the page, the flame walks the row and lights your lamp.

**Build:**
1. `Voice.jsx` / `Take`: keep `takesDiff`, `viewAt`, the slider with `aria-valuetext`, Plain toggle, Take 2 default with `Doosra take` switch, and the provenance block. Each rendered word span gets `--i` (index). Raw state (words not yet processed): `translateY(sin(i*1.7)*1.4px) rotate(sin(i*2.3)*.6deg)` and opacity .86; processed words are flat and cream. Implement with a `data-pressed` class per word driven by `view`.
2. The flame thread: an absolutely positioned 2 px glowing vertical line plus a tiny flame cap, placed with `getBoundingClientRect` of the k-th changed word (cache word rects per resize), moving with `spring(k=190,c=22)`. The slider thumb is the same flame design (existing 44 px flame thumb) so finger and thread read as one object. Slider row stays sticky at `bottom: var(--calm-clear)`.
3. Dissolve: when a trimmed or smoothed word is processed (existing `.w.gone`), emit 3 motes (a Canvas 2D overlay of at most 36 live motes, 1.2 s life, quadratic curve toward the thread) and shrink the word's `max-width` (existing transition 120 ms). At k = M: one highlight band sweeps across the paragraph (900 ms, `--ease-in-out-quint`, 22% cream) and the counts line appears.
4. Take switch: current paragraph lifts 8 px and fades 240 ms, the new one settles 480 ms. `Read it plainly` bypasses all of it.
5. Stage: `data-act="awaaz"` already quiets sparks (E2); set `foreground(true)` while dragging.
6. Visitor's lamp (`Closure.jsx`, `RowFragment.jsx`): replace the 18x11 px CSS lamps with 36 px lamp silhouettes (same clay palette). On trigger the flame walks the row: it hops lamp to lamp with 140 ms per lamp, each lamp brightening (alpha .6 to 1) as the ember passes, caption "Lau chal rahi hai, diye se diye tak." Then the ember arcs to the empty visitor slot; a ring of 12 rangoli dots draws around it (700 ms), the wick lights, the whole row rises 3 px in unison and settles, and one lantern (existing `lantern` particle, a single element) floats up from the slot. Number caption exactly as V3 ("{N} diye pehle se. Aakhir mein aapka."). `bloom:set` at the slot (r 240, i 1, 2.4 s).

**Files likely touched:** `src/components/Voice.jsx`, `src/components/Closure.jsx`, `src/components/RowFragment.jsx`, `src/styles/story.css`, `src/lib/fx.js`.

**Tiers and Calm:** High: motes, bloom, sweep. Mid: no motes, thread moves by transform only. Low: words just flatten and strike (today's behaviour), no thread glow. Calm: no tilt on words, instant changes via the slider, the closure shows the final lit row.

**Budget:** +3.4 KB JS gz, +0.8 KB CSS; motes canvas only exists while dragging.

**Verify:** at k=0 words have a non-zero tilt, at k=M none; word texts at each k equal `viewAt` text (no copy change); the slider keyboard (arrows, PageUp/Down) still works; `Spoken with Wispr Flow` appears only twice; closure ember reaches the slot; the visitor's lamp is the last child; Calm shows lit state at once. Screenshot at mid-drag: rumpled lower text, flat upper text, light thread at the boundary.

**ONE-SCREEN TEST:** Messy spoken words get smoothed as a flame passes over them.

**Guardrails:** "Spoken with Wispr Flow" only on Take 1 and 2; the row number is never presented as a visitor count.

---

### E5.9: The receipt sheet, a letter that unfolds out of its lamp

**The astonishment:** "Poora kissa" lets the lamp lean in; a folded paper leaves the wick, arcs to the centre, unfolds along three creases and settles with a tiny wobble, lit from below by that very lamp. Closing refolds it into the lamp, which bows once.

**Build:**
1. `LampCard.jsx` keeps the native `<dialog>`, focus handling, the three inking parts, the receipt button and the tilt. Replace the open and close animations (currently one translate+scale `b.animate`).
2. Open (high): source point = `lampRegistry.wick(n)`. Use the individual transform properties so each axis has its own easing: `translate` x over 560 ms `--ease-in-out-quint`, y over 560 ms `--ease-out-expo` (an arc), `scale` .12 to 1 over 600 ms, `rotate` -6deg to 0, plus `rotateX` 68deg to 0 on the card with `perspective(900px)`. A 3-band crease overlay (`.card::before` replaced by a `.creases` div, three horizontal 1 px darker lines with a 10% shadow gradient) unfolds: opacity 1 to 0 over 560 ms. Settle: rotate wobble -1.2 to .6 to 0 deg in 700 ms (`--ease-spring`). The lamp flame leans toward the card for 300 ms and flares (existing `flash` class).
3. Light: while open, set `--lx --ly --li` (E4) from the lamp's viewport position projected into card space: bottom edge warm `rgba(255,179,71,.22)` fading to 0 at 70% height; top edge a 6% multiply darken. Total tonal shift at most 12% so ink on cream stays above 10:1. Paper grain stays.
4. Drag to close: card follows the finger with rubber-band (1 at 0 px, .55 at 200 px) and `rotateZ(dx*.04deg)`; release with velocity > .6 px/ms or > 90 px continues with inertia, refolds (creases back to opacity 1 over 220 ms) and shrinks into the lamp over 340 ms (`--ease-in-out-quint`); otherwise springs back (`spring(k=190,c=20)`).
5. Close: after landing, the lamp bows (translateY 2 px, scale 1.06, 300 ms) and the flame flares (existing). `Chhat par waapas` and `Agla diya` (fold corner) remain; the corner fold curls on hover/focus by 6 deg.
6. The backdrop lightens in a circle around the lamp: `::backdrop` radial gradient from the lamp position `rgba(5,3,2,.72)` outside, `.55` inside r 180 px.

**Files likely touched:** `src/components/LampCard.jsx`, `src/styles/card.css`, `src/lib/setpiece.js`.

**Tiers and Calm:** High: all of it. Mid: arc plus scale plus fade 420 ms, no 3D, creases static at 30% opacity. Low: scale .96 to 1 plus fade 150 ms. Calm: 160 ms fade in place, static warm gradient, no wobble, no drag inertia (swipe still closes).

**Budget:** +1.8 KB JS gz, +0.6 KB CSS; GPU transforms only, no layout; 0.5 ms per frame.

**Verify:** open card 3 at 390x844: within 900 ms the card rect is centred and `getAnimations()` is empty; the title is focused; Escape closes and focus returns to the lamp button; pixel-sample ink/cream contrast stays at least 10:1 over the whole card area with light on; Calm path has no running animation; drag closes at >90 px. Screenshot at 300 ms: tilted partly unfolded paper rising from the lamp with crease shadows.

**ONE-SCREEN TEST:** A letter rises from the lamp it is about and sits in that lamp's light.

**Guardrails:** Receipt text unchanged word for word; the dialog's accessibility (top layer, Escape, focus trap) is never bypassed.

---

### E5.10 (cross-cutting): Proof chips that fly

**The astonishment:** Every claim in the baithak has a small chip. Tap it and the chip lifts off the card, arcs through the dark as an ember, and the page glides to the lamp that proves it, which takes the flame and glows. A quiet chip lets you fly back.

**Build:**
1. New `src/components/ProofChip.jsx` plus `src/lib/proofFlight.js` (about 1.6 KB gz). Props: `to` (`lamp-1`..`lamp-6`, `evidence:<folder>`), `label` (derived from the existing lamp kicker such as "Lamp 3 . Blitz", never new claims), `claim` (the sentence it supports, for the announcement). It is a real `<button>` at least 44 px tall, `aria-label="Show proof: Lamp 3, Blitz"`.
2. Flight (high), two phases because the page scrolls: Phase A (0 to 220 ms): clone the chip as a fixed ghost at its rect, it shrinks to a spark (scale .3) and the real chip dims; at once `scrollToId` target smooth scroll (`--ease-out-expo`, 700 ms) and `foreground(true)`. Phase B (when scroll settles, detected by 120 ms of no scroll event or `scrollend`): an ember spawns at the bottom centre of the viewport and flies a cubic Bezier (control point 140 px above the chord, 650 to 900 ms by distance, `--ease-in-out-quint`) to `lampRegistry.wick(n)`, leaving a 6-point trail. On landing: the lamp section receives `data-proof="1"` for 1600 ms (a soft ring and `bloom:set {r:110,i:.8}`) and E5.9's "bow" on the lamp; heading focus via `scrollToId`; `announce('Proof: Lamp 3, Blitz')`.
3. Return chip: after landing, a ghost chip `Baithak par waapas` (NEW micro-label, mark for approval) appears at the lamp stop for 8 s; activating it flies a reverse ember back and scrolls to the originating card, restoring focus to the chip you used. Escape or timeout removes it (focus never trapped).
4. Evidence targets (`evidence:<folder>`): the ember flies to the evidence tab and calls `openEvidence(folder)` after landing; the drawer's own motion is untouched.
5. Apply to: baithak panes 2 to 4 (`Proof` faces), LoopRing stops, BringShelf, Verdict links, the 60-second file's receipt buttons (all existing links; none added).
6. One flight at a time; a new tap cancels the current flight (clean up ghost, timers).

**Files likely touched:** new `ProofChip.jsx`, `src/lib/proofFlight.js`, `src/components/baithak/*`, `src/components/Verdict.jsx`, `src/styles/story.css`.

**Tiers and Calm:** High: arc, trail, glow. Mid: arc, no trail. Low: chip fades, scroll jumps, lamp gets the ring only. Calm and reduced motion: instant scroll, no ember; the target lamp shows a static 2 px marigold outline for 2 s (and the return chip still works).

**Budget:** +1.6 KB JS gz, +0.4 KB CSS; one ghost element and one canvas draw, 0.3 ms per frame.

**Verify:** click a chip: within 1.6 s `#lamp-3` is in viewport, focused heading, `data-proof` set then cleared; return chip exists and works; Tab order unchanged; every chip has a unique accessible name; in Calm no animation runs; the 12 chips on the page all resolve to an existing id. Screenshot mid-flight: the ember arc with trail over the stage.

**ONE-SCREEN TEST:** Tap a claim's chip and a spark flies to the lamp that proves it.

**Guardrails:** Chips connect only to evidence that already exists; no chip implies skill level.

---

## Risks and cut order
1. Effort: ten prompts, about 30 KB JS gz in total; the 200 KB gz ceiling still holds (117 + 30 + other packs). If time is short, cut in this order: E5.7 ember walk (keep selection), E5.8 mote dissolve (keep the pressed cloth), E5.4 ring pulses, E5.9 3D unfold (keep the arc), E5.2 wire pluck, E5.5 slice shimmer, E5.1 camera push (keep dim and rise), last E5.10 return chip. Never cut: Calm states, plain twins, model labels, honest captions.
2. Moving devices onto the dark stage changes their palette: any device still rendered inside the cream sheet needs the `data-surface="paper"` variant (kept as the old CSS), or it will be unreadable.
3. Frame budget: E5.1 and E5.3 are the heaviest. Both rely on `fx:foreground` pausing ambient layers; if that event is not honoured by E4/E8 the 3-effects limit fails.
4. New micro-labels to approve: `15 min` (E5.5), `Baithak par waapas` (E5.10), proof chip labels derived from kickers (E5.10), one new token `--wall-green`.
5. Dependencies: E2's `motion.js` API is not fixed; if `spring` or `ease` helpers are missing, keep the local ones in `setpiece.js` and report the duplicate.


---

# PACK 7: INTERACTION AND NAVIGATION (E7)

Position in this file: 6 of 8. Apply order: see the table at the top.

Author: E7 (Interaction Designer). Apply after Pack 5 (set-pieces) and before Pack 6. Prompts are numbered E7.1 to E7.8, followed by the QA matrix (Appendix E7.A).

## Pack overview

1. **What it elevates.** Today input is hand-rolled per component: a lerp in `parallax.js`, ad-hoc `transform` and a 200 ms transition in the `LampCard` swipe-down, a rAF loop in `LampRow` (hold, wind), a native range thumb in `Voice` and `LateReplySlider`, a plain absolutely-positioned list for the Menu in `TopBar.jsx` (no scrim, no stagger, no outside-click close, no focus management), a single global `:focus-visible` outline, `haptic(ms)` with one number, overlays that never touch history (so Android back leaves the page instead of closing the sheet), and no wayfinding at all once the Dock is gone. The page looks premium but feels like a web page. This pack makes every touch, click, key and scroll answer with physical, consistent, lamp-lit feedback.
2. **Fixed vocabulary.** One spring solver (`src/lib/physics.js`), one haptic vocabulary (`tick`, `ignite`, `settle`, `nudge`, `hop`), one pointer light, one wayfinder (burning-thread trail + six-diya rail), one focus flame, one history discipline.
3. **Depends on.** E2 (motion tokens, `html[data-act]`, `stage:act`, `--act-progress`), E4 (`lightEngine.js`, `bloom:set`, `--lx --ly --li`), existing `ticker.js`, `quality.js`, `store.js` (`calm`, `quality`, `litCount`, `lamps`, `overlay`), `fx:burst`, `director.js` sparkler, `Overlay.jsx`, `nav.js`, `hash.js`, `row.js`. Where E4 or E2 modules are missing at build time, every prompt names a fallback that uses only existing code.
4. **Never duplicates.** It does not draw lamps, flames, skylines or fireworks (E1, E4, E5), does not write copy (V3), and does not time the opening (E3). It owns how things respond, move, stop, focus and remember (in memory only).
5. **Four signature moments.** (a) The lamplight cursor that really lights the edges of cards and buttons and turns into a sparkler on a long press (E7.2). (b) The travelling focus flame that hops between focusable elements on a spring (E7.6). (c) The burning-thread trail whose flame head leans with your scroll speed, with a six-diya rail that ignites and passes a mote between dots (E7.4). (d) The kindling INVITE pill and the "Copied" ember (E7.8).

### Honest judgement of today (390x844 and 1366x768, live page)
- The first screen is still the old, crowded one (six labelled chips, INVITE ME in amber, a status pill, hold hint), so the Wayfinder must be absent there (V3 PART F: max 6 visible elements).
- The Menu is a dark rectangle over the headline, with a plain list and a segmented control. It opens with no motion and gives no sense of place.
- `Voice` compare: the thumb is a flat orange blob that moves in discrete jumps; it has no weight, no overshoot, no release.
- Focus is a 3 px gold outline: correct, but identical to every other site.
- On desktop the stage is lovely and completely deaf to the mouse apart from a 10 px parallax. There is no sense that a lamp is "in the room with you".
- Nothing on the page knows where the reader is, so a jump from "The lamps" in the Menu lands without ceremony.

### Shared numbers used across the pack (do not change per prompt)
- Spring parametrisation: `omega = sqrt(k / m)`, `zeta = c / (2 * sqrt(k * m))`. Overshoot for zeta below 1 is `exp(-pi * zeta / sqrt(1 - zeta^2))`: zeta 0.8 gives 1.5 percent, 0.7 gives 4.6 percent, 0.55 gives 12.6 percent, 0.45 gives 20 percent.
- Haptic vocabulary (Android only, feature-detected, user-driven only, never in Calm, never `document.hidden`): `tick` = 8 ms; `hop` = 10 ms; `settle` = [10, 30, 6]; `ignite` = [14, 40, 22]; `nudge` (gentle, error-free refusal) = [8, 70, 8]. Minimum 45 ms between calls, at most 12 per second.
- 44 px target rule: every tappable has a 44x44 CSS-pixel hit box (visual may be smaller; extend with `::after { inset: -Npx }`), with at least 8 px between neighbouring hit boxes.
- Edge guard: no custom drag starts within 24 px of the left or right screen edge, and none starts from the bottom 24 px (browser back gesture, gesture bar).

---

### E7.1: A tiny physics kit (critically damped springs, velocity-aware release)

**The astonishment:** Every draggable thing on the page has weight. Let go of the Take-compare flame and it carries a breath of momentum, drops into its notch with a 1.5 percent overshoot and stops dead. Fling a sheet down and it keeps going; nudge it half way and it settles back like a hung door.

**Build:**
Create `src/lib/physics.js` (about 120 lines, no dependency).
1. `spring(opts)` returns an object with fields `x, v, target, k, c, m, decor` and methods `to(t, v0?)`, `set(x)` (snap, zero velocity), `kick(dv)`, `onUpdate(fn)`, `destroy()`. Opts accept either `{k, c, m}` or `{omega, zeta}` (convert with `k = m*omega^2`, `c = 2*zeta*sqrt(k*m)`).
2. Integrate with semi-implicit Euler in fixed substeps of 1/240 s (cap 8 substeps per frame, so a 100 ms stall cannot explode). Subscribe to the existing `ticker` (dt arrives in ms) only while a spring is awake; sleep when `|x - target| < eps` and `|v| < eps_v` (eps = 0.002 of the spring's declared `scale`, eps_v = 0.02 scale per second), then snap exactly to target and unsubscribe. No allocation inside the step: springs are plain objects held in one array.
3. `spring2(opts)` for x and y with shared parameters.
4. `tracker()`: ring buffer of the last 8 pointer samples `{t, x, y}`; `velocity()` returns the least-squares slope over samples younger than 100 ms (px per ms); older samples are dropped so a held finger releases with zero velocity.
5. `project(x, v, rate = 0.998)` returns `x + v * rate / (1 - rate)` (v in px per ms); use rate 0.99 for "snappy". `rubber(x, min, max, dim, c = 0.55)` returns the iOS style band: `(1 - 1 / (|over| * c / dim + 1)) * dim` signed, beyond bounds.
6. Presets in one exported table `FEEL` (omega rad/s, zeta): `press` down (30, 1.0), `release` (25, 0.55), `thumb` (23, 0.8), `sheetClose` (17, 1.0), `sheetSnap` (19, 0.8), `flip` (13, 0.62), `wind` (9.5, 0.45), `trailHead` (16, 0.9), `lean` (14, 0.5), `cursorGlow` (16, 0.85), `cursorWick` (30, 1.0), `magnet` (15.5, 0.7), `parallax` (12, 1.0), `focusFlame` (20, 0.85), `menuItem` (22, 0.8), `invitePill` (20, 0.55). All with m = 1.
7. Calm and tiers: `physics.configure({calm, quality})` listens to the store. Calm: decorative springs (`decor: true`) snap on `to()`; interactive springs (direct manipulation: slider follow, sheet drag) run critically damped at omega 40 (about 120 ms, no overshoot) and the 1:1 finger tracking is unchanged. Low tier: all springs forced to zeta 1.0 (no ringing, sleeps sooner). Mid: decor springs capped to 6 awake at once.
8. Wire it (replace, do not add beside): `parallax.js` lerp 0.08 becomes `spring2(FEEL.parallax)`; `LampRow` wind lean uses `FEEL.wind` through `engine.set(n, {leanExtra})`; `LampCard` swipe-down uses `tracker` and `project`: on release, `final = y + project(...)`; close if `final > 0.35 * cardHeight`, animating with `sheetClose`, otherwise `sheetSnap` back to 0, with `rubber` when dragging upward; `StoryPriceTag` flip uses `FEEL.flip` on `rotateY`; `TakesCompare` and `LateReplySlider` get an overlay `.thumb-flame` (pointer-events none) positioned by `spring(FEEL.thumb)` toward `value / max`, clamped to the track end plus 1.5 px, while the native range input remains the source of truth and the only focusable control (keyboard and screen reader unchanged).
9. Dev only (`import.meta.env.DEV`): `?feel` shows a tiny panel to tweak omega and zeta per preset and log them. Tree-shaken from production.

**Files likely touched:** `src/lib/physics.js` (new), `src/lib/parallax.js`, `src/components/LampRow.jsx` (wind), `src/components/LampCard.jsx` (swipe), `src/components/Voice.jsx`, `src/components/story/LateReplySlider.jsx`, `src/components/story/StoryPriceTag.jsx`, `src/styles/story.css` (`.thumb-flame`), `tests/physics.test.mjs` (new).

**Tiers and Calm:** High: all presets as listed. Mid: decor springs limited, rest identical. Low: zeta 1.0 everywhere, thumb flame follows 1:1. Calm: decor snaps, interactive critically damped fast; slider thumb flame sits exactly on the value, still and beautiful.

**Budget:** JS about +1.4 KB gz (deletes about 0.4 KB of ad-hoc code); CSS +0.2 KB. Frame cost: under 0.1 ms per awake spring, zero cost asleep.

**Verify:** Node unit test: critical spring from 0 to 1 never exceeds 1.001; zeta 0.5 overshoot between 15 and 18 percent; settle within 800 ms; identical `x(t)` within 1 percent when stepped at 30, 60 and 120 fps; sleeping springs leave `ticker.size` at its baseline. Playwright: drag the Take-compare thumb to the right end and release, sample `.thumb-flame` transform for 600 ms, assert at most 1.5 px beyond the end and rest in under 500 ms; swipe the lamp card down 20 percent of its height and assert it springs back, 50 percent flings it closed; with `calm` on assert no overshoot samples. Screenshot: thumb flame mid-release shows slight stretch (scaleX 1.06) and a warm trailing glow.

**Guardrails:** Springs animate transforms and opacity only; no spring ever changes truth (the range input value, store state, copy).

---

### E7.2: The lamplight cursor and pointer layer (SIGNATURE)

**The astonishment:** On a laptop the reader's cursor is a small warm light in the room: cards and buttons catch a thin lit edge as it passes, the primary controls lean a few pixels toward it, and a long press on empty night turns it into a sparkler. Nothing is hidden from anyone: the real cursor is always there.

**Build:**
Gate everything with `matchMedia('(hover: hover) and (pointer: fine)')` and the first real `pointermove` with `pointerType` of `mouse` or `pen`. Create `src/lib/pointerLight.js` and `src/components/LampCursor.jsx`, CSS in new `src/styles/pointer.css`.
1. **The system cursor is never hidden.** Over non-interactive stage and panels set `cursor: url("data:image/svg+xml,...") 3 3, default` (a 20 px cream-outlined flame-tipped wick pin, hand-written SVG, hotspot at its tip); keep native `pointer`, `text`, `grab` and `not-allowed` elsewhere. Do not use `cursor: none` anywhere. Remove the custom image under `forced-colors` and in Ink.
2. **Glow.** One `<div id="lamp-cursor" aria-hidden="true">` fixed at z-index 8, `pointer-events: none`, 120 px circle with `radial-gradient(circle, rgba(255,210,122,.30), rgba(255,179,71,.10) 40%, transparent 70%)`. Position follows by `spring2(FEEL.cursorGlow)` via `transform: translate3d`. A 6x10 px inline-SVG flame (the wick) rides at the hotspot using `FEEL.cursorWick`. No blend modes, no filters.
3. **Reacts.** Over a lit diya or a primary control the halo grows to 180 px and .36 alpha (240 ms). While pressed it tightens to 72 px. After 3 s without movement it dims to 60 percent and breathes (opacity .6 to .72, 3.2 s).
4. **Lights nearby UI.** Per frame write `--px --py` on `:root`; also call `lightEngine.pointer(x, y)` if E4 exports it, else emit one reused `bloom:set {x, y, r: 140, i: .35, id: 'cursor'}` at most once per rAF while moving. Locally, on `pointerover` find `closest('.panel, .btn, .menu a, .take-card, .sheet, .lamp-btn')`, cache its rect (invalidate on scroll and resize) and set only that element's `--mx --my`; CSS `::before` paints a 1 px lit edge `radial-gradient(120px at var(--mx) var(--my), rgba(255,210,122,.55), transparent)` masked to the border. One element is ever updated.
5. **Magnetic.** For `.btn-primary, .lamp-btn, #calm-corner, [data-magnetic]` within the rect plus 48 px, translate the element with the individual `translate` property (not `transform`) toward the pointer by `min(dist * .18, 6px)` using `FEEL.magnet`. Disabled while a button is down, for dots, links and anything below 44 px, and inside `dialog` except `[data-magnetic]` in the invite sheet.
6. **Sparkler.** Mouse, pen or trackpad press held 500 ms on empty stage (not over interactive, not on text) starts the existing `director.js` sparkler (reuse its start function, add mouse support if it is touch only); the halo turns white-gold and shrinks to 48 px; release ends it after 600 ms. Max 8 s as today.
7. **Hands off.** Any `touchstart`, `pointerdown` with `pointerType === 'touch'`, or keyboard navigation key (`Tab`, arrows, `Home`, `End`, `PageUp`, `PageDown`) fades the glow out in 200 ms until the next mouse move. `pointerleave` of the document and `visibilitychange` hide it. Never present for assistive pointer emulation that reports `pointerType: 'touch'` or no hover.

**Files likely touched:** `src/lib/pointerLight.js` (new), `src/components/LampCursor.jsx` (new), `src/styles/pointer.css` (new), `src/main.jsx`, `src/App.jsx`, `src/lib/director.js`, `src/lib/parallax.js`.

**Tiers and Calm:** High: spring glow, edge-light, magnetic, sparkler. Mid: glow with spring, edge-light on the hovered element only, no magnetic. Low: static 80 px glow tracking 1:1, no edge-light. Calm: static 100 px halo tracking 1:1 (no spring, no breathing, no magnetic, no sparkler); the page stays lit and still.

**Budget:** JS about +3.2 KB gz; CSS +1.1 KB. Frame cost: under 0.3 ms while the mouse moves, zero when idle (springs asleep, listener passive).

**Verify:** Playwright (mouse): move to (400,300), assert `#lamp-cursor` transform within 4 px after 400 ms; move over a `.btn-primary` and assert its computed `translate` is non-zero but at most 6 px and that clicking its centre still hits it; `page.touchscreen.tap` and assert `#lamp-cursor` opacity 0; press Tab and assert glow opacity under .05; assert no element anywhere computes `cursor: none`; mobile emulation: element absent. Screenshot at 1366x768: a card edge brighter on the side nearest the cursor, halo visible, native cursor visible.

**Guardrails:** The glow is `aria-hidden`, never intercepts events, never replaces the focus ring, and never exists on touch.

---

### E7.3: Touch feel, haptic vocabulary and self-teaching gestures

**The astonishment:** Every press answers within one frame: a warm bloom spreads from the fingertip, the control sinks and springs back, and on Android a tiny pulse says "lit". The page never explains its gestures in words; it shows them once, quietly, and never again.

**Build:**
1. **Hygiene.** Global `touch-action: manipulation` on `button, a, [role=button], summary, label`, `-webkit-tap-highlight-color: transparent`, `user-select: none` on controls (not text). Keep `touch-action: pan-y` on stops with horizontal gestures; the lamp hold stays `touch-action: none` on `.lamp-btn` only (existing).
2. **Press state without `:active`.** On `pointerdown` set `data-pressed="1"` and drive `--press` by `spring(FEEL.press)` (scale to .96) and on release `FEEL.release` (overshoot to 1.0 with 12 percent bounce). Apply to `.btn`, `.lamp-btn .lamp`, menu rows, the pill, dots. Never use transition delays.
3. **Fingertip bloom.** One fixed 96 px `#touch-glow` moved to the press point on interactive targets (alpha 0 to .35 in 80 ms, fade 320 ms after release, radial `rgba(255,210,122,.5)`).
4. **Visual twin of every haptic.** `haptic(name)` (extend `src/lib/haptic.js`, keep `haptic(10)` numeric calls working) sets `data-buzz="<name>"` for 240 ms on `document.activeElement` or the pressed target; CSS animates a 2 px ring expanding 0 to 6 px and fading. This gives iPhone readers parity.
5. **Vocabulary, bindings.** `tick`: slider integer crossings (rate limited to one per 45 ms), hold-ring quarter marks at 25, 50, 75 percent, sheet-dismiss threshold crossing, menu row press. `ignite`: lamp lit, wish card made. `settle`: card flip landing, copy confirmed, slider reaching either end once, the late-reply slider crossing the 3 s line. `nudge`: "light lamp k first" (`notReady` in `LampRow`) and a failed copy; it must feel like "not yet", never an error. `hop`: the flame ember landing on the next dot or lamp. Options: a Menu switch "Haptics" (NEW micro-label, mark for ledger, in-session only, default on) toggles `session.haptics`. Use `navigator.vibrate` only inside a user-activation window (`navigator.userActivation?.isActive`), call `vibrate(0)` to cancel a running pattern on `pointerup` of a drag.
6. **Gestures that teach themselves.** All teach-once flags live in a memory `Set` in `src/lib/session.js` (nothing stored). (a) Hold ring: if litCount is 0 and 7 s pass untouched, the ring on the host's diya sweeps to 30 percent and returns (900 ms, once). (b) Sliders (`Voice`, `LateReplySlider`): first time one is 60 percent visible for 1.2 s untouched, the thumb flame nudges 12 percent along and springs back (once per slider). (c) Sheet grab pill: on the first opening of any sheet, the pill dips 6 px and returns. Any real interaction cancels and marks the lesson learned.
7. **Edge safety.** `pointerdown` handlers for custom drags ignore `clientX < 24` or `clientX > innerWidth - 24`; no custom swipe starts in the bottom 24 px; sheets dismiss only by downward drag from the grab pill or from the sheet top when scrolled to 0 (existing logic), never horizontally. Pane swipes (Act 2) and compare use `touch-action: pan-y` so vertical scroll always wins.

**Files likely touched:** `src/lib/haptic.js`, `src/lib/session.js` (new), `src/styles/base.css`, `src/components/LampRow.jsx`, `src/components/Voice.jsx`, `src/components/story/LateReplySlider.jsx`, `src/components/LampCard.jsx`, `src/components/TopBar.jsx` (Haptics switch), `src/lib/director.js` (touch hygiene).

**Tiers and Calm:** High and mid: spring press, fingertip bloom, teaching nudges. Low: press scale instant (no spring), bloom static for 200 ms. Calm: no haptics, no bloom, no teaching nudges; pressed state is a background brightening plus the visual-twin ring replaced by a 2 px static outline for 240 ms.

**Budget:** JS about +1.6 KB gz; CSS +0.6 KB; frame cost negligible (one extra element moved per press).

**Verify:** Playwright with an Android UA and `addInitScript` stubbing `navigator.vibrate` to push to `window.__vib`: hold the host diya fully and assert `__vib` contains exactly three ticks then the ignite pattern; drag a slider across 10 steps in 100 ms and assert at most 3 calls; tap an out-of-order lamp and assert one `nudge` and the announcer text unchanged from today; turn Calm on and assert zero calls; iOS UA: assert zero calls and `data-buzz` still set. Touch emulation: pointerdown at x=10 on a drag target does not start the drag. Screenshot: bloom visible under the finger on a pressed button.

**Guardrails:** Haptics only follow a user gesture in progress, never scroll or timers; no gesture is required, every one has a button or key twin.

---

### E7.4: Navigation as a flame (burning-thread trail and the six-diya rail) (SIGNATURE)

**The astonishment:** A hair-thin cotton wick runs along the top of the page and burns as you read, its tiny flame leaning into your scroll like a candle in a walking draught. On the edge, six small diyas ignite as you light the lamps; a lit mote hops between them, and any dot takes you there.

**Build:**
Create `src/components/Wayfinder.jsx`, `src/lib/wayfinder.js`, CSS in new `src/styles/way.css`. Mount once in `App.jsx` after `TopBar`.
1. **Visibility rule.** Not rendered visibly on the first screen (V3 PART F: max 6 elements). Set `html[data-way="1"]` when `scrollY > 0.6 * innerHeight` or `litCount >= 1`; fade and rise 500 ms with `--ease-out-expo`. Hidden when any dialog is open or `html[data-text="1"]`.
2. **Trail.** A 2 px track `rgba(255,243,220,.10)` pinned to the bottom edge of `#topbar`. The fill is one element with `transform: scaleX(p)` (origin left), gradient `#5A1E06 0%, #C2410C 55%, #FFB347 100%` (the thread is darker behind the head: "burnt"), where `p = scrollY / (scrollHeight - innerHeight)` read in one passive scroll listener coalesced to a single rAF. Do not read layout in the listener beyond `scrollY`.
3. **Flame head.** A 12x18 px SVG teardrop with a 1.1 s CSS flicker (`scaleY .92 to 1.06`). Its x follows `p` through `spring(FEEL.trailHead)`; skewX leans by `clamp(-v * .012, -16, 16)` degrees, where `v` is smoothed scroll velocity in px per second, through `spring(FEEL.lean)` (leans left when scrolling down, snaps upright after you stop). High tier only: shed one `fx:burst {kind:'ember'}` at the head's screen position every 180 ms while `|v| > 600` px per second and fewer than 3 effects are active.
4. **The rail.** `<nav aria-label="Where you are"><ol>` of six `<a>` dots, hrefs `#lamp-1` to `#lamp-6`. Visual 8 px (hollow ring `--ground-6` when unlit, filled `--flame-core` with 6 px glow and a 1.4 s flicker when lit, lamp six drawn as a dashed ring), 44x44 hit boxes at a 44 px pitch (264 px tall). Phones: pinned inside the right gutter (dot centre 8 px from the edge), vertically centred at 46 percent, hit width 24 px (so it never exceeds the 16 to 20 px gutter by more than 4 px); desktop (min-width 1024): left at 24 px, labels (project names from `copy.ui.extra.projectNames`) slide out on hover and focus. A 1 px thread behind the dots fills with flame colour up to the last lit dot. Hide the rail when `innerHeight < 520` (landscape phones); the trail and the Menu cover that case.
5. **Active dot.** `IntersectionObserver` with `rootMargin: '-45% 0px -45% 0px'` on `#lamp-1`..`#lamp-6`; the active dot has `aria-current="location"` and a 14 px ring that glides between dots with `spring(FEEL.trailHead)`.
6. **Ignition.** On `diya:lit {n}` the dot pops (scale 0 to 1, `FEEL.release`) and a 6 px mote travels from dot n-1 to dot n along the thread (WAAPI `translateY`, 600 ms, `--ease-in-out-quint`), firing `haptic('hop')` on landing. On `diya:visitorLit` the thread blazes once from first to last dot (700 ms).
7. **Tap to jump.** Click calls `glideTo('lamp-n')` from E7.7. Dots are never gated: an unlit lamp's stop shows its own V3 "light the previous lamp first" state. Labels reuse the existing `litLamp` and `lightLamp` strings (`X('litLamp')`, `X('lightLamp')` with `project`); no new copy.
8. **Act names (NEW micro-labels, mark for ledger):** on `stage:act`, the head carries a 10 px mono label (Dehleez, Baithak, Chhat, Awaaz, Aakhri diya, Vidaai) for 1.4 s, then fades.

**Files likely touched:** `src/components/Wayfinder.jsx` (new), `src/lib/wayfinder.js` (new), `src/styles/way.css` (new), `src/App.jsx`, `src/main.jsx`, `src/lib/lampRegistry.js`, `src/lib/hash.js` (SCROLL list must include `lamp-1`..`lamp-6`, `baithak`).

**Tiers and Calm:** High: leaning head, embers, mote hop, label. Mid: leaning head (no embers), mote hop. Low: head tracks without lean or flicker, dots switch state instantly. Calm: trail fill and dots show state statically, no flicker, no hop, no label; tap-to-jump instant.

**Budget:** JS about +3 KB gz; CSS +1.8 KB; frame cost: one transform write per frame while scrolling (about 0.05 ms).

**Verify:** Playwright 390x844: at load assert `#wayfinder` has no visible pixels and `data-way` unset; scroll to 70 percent of viewport and assert it appears; assert rail hit boxes are at least 44 px high and do not overlap (`getBoundingClientRect` pairwise); light lamp 1 via `__ek.actions` and assert dot 1 filled and `aria-current` moves while scrolling; tap dot 4 and assert `#lamp-4` heading is within 80 px of the top of the viewport after 1.2 s; assert no element with `pointer-events` over the text column except the 24 px strip. Screenshot: thread burnt behind the head, head leaning when captured mid-scroll, rail clear of copy.

**Guardrails:** Wayfinder never covers copy or the first screen, never moves with the page layout, and every state is also in the DOM (`aria-current`, dot labels).

---

### E7.5: The lit Menu sheet and the single Calm corner

**The astonishment:** Opening the Menu feels like entering a lit room: the sheet rises from where your thumb is, its rows light one after another as if one flame were passing down them, and closing it returns you exactly where you were.

**Build:**
Rebuild the Menu in `src/components/TopBar.jsx` on the existing `Overlay` (native `dialog`: focus trap, Escape, inert background), as a new `MenuSheet.jsx`.
1. **Placement.** Phones (under 768 px): bottom sheet, full width, max height 78svh, radius 22px 22px 0 0, a 36x4 grab pill, drag down to close with E7.1 (`project` threshold 0.35, haptic `tick` when crossing). Desktop: a 360 px panel anchored under the Menu button, `transform-origin: top right`, scale .96 to 1 and opacity 0 to 1 in 240 ms (`--ease-out-expo`).
2. **Rows.** Existing items keep their text and order; V3 adds Light all, the full text, the 60-second file, Evidence, Look (Deepavali or Ink), Tilt (phones), the new Haptics switch (from E7.3) and, on desktop, "Keys" (E7.6). Row height 56 px, 16 px type, left gutter holding a 10 px unlit diya bullet. Add a "Where you are" row at the top with the six-dot minimap inline (same component as the rail, 44 px dots) so the minimap is also reachable in landscape.
3. **Stagger.** Rows enter with `translateY(14px)` and opacity 0, 380 ms each, delay `80ms + index * 45ms` (cap total 480 ms), easing `--ease-spring`. A single 8 px ember travels down the bullets, igniting each at its row's arrival (WAAPI, 45 ms per row). Exit: all rows and sheet fade and drop 12 px together in 160 ms, no stagger.
4. **Light.** The sheet's top edge carries a warm gradient light (`--flame-a` at 14 percent) and the pointer light from E7.2 works inside it. Background scrim `rgba(5,3,2,.55)`, with `backdrop-filter: blur(6px)` only at high tier.
5. **Focus.** On open focus the "Menu" heading (`data-title`, a 12 px mono kicker), then ArrowDown or Tab goes to the first row; arrow keys, Home and End move between rows (roving). On close focus returns to the Menu button (existing `Overlay` behaviour) and a one-time `settle` ring plays.
6. **History.** Opening pushes a history entry (E7.7) so Android back and swipe-back close the sheet.
7. **Calm corner.** Replace the text button in `CalmCorner` with a 44 px circle holding a small diya glyph: flame drawn when Calm is off, a still ember when on; accessible name unchanged (`X('calmCornerAria')`), `aria-pressed`, a tooltip on hover (desktop) from the existing `X('calmCorner')` text. Position `right: max(14px, env(safe-area-inset-right))`, `bottom: calc(14px + env(safe-area-inset-bottom))`. It rises in (spring, 400 ms) after the first scroll or 4 s, and fades to 35 percent while scrolling down, back to 100 percent on stop. Hide it while a dialog is open or the on-screen keyboard is up (`visualViewport.height < 0.75 * innerHeight`). In Calm the corner stays visible (it is how to leave Calm).

**Files likely touched:** `src/components/TopBar.jsx`, `src/components/MenuSheet.jsx` (new), `src/components/Dock.jsx` (`CalmCorner`, `DockControls`), `src/components/Overlay.jsx` (optional `initialFocus`), `src/styles/base.css` (`.menu`), `src/styles/menu.css` (new).

**Tiers and Calm:** High: stagger, ember bullets, blur scrim. Mid: stagger, no blur. Low: rows fade in together, bullets pre-lit. Calm: sheet appears instantly with final state, bullets lit, calm glyph still.

**Budget:** JS about +2.4 KB gz; CSS +1.5 KB; frame cost: 8 CSS animations for 480 ms, then none.

**Verify:** Playwright: open Menu with click and with Enter, assert `dialog[open]`, focus on heading, 8 rows in DOM order, total entry under 600 ms (sample opacity), Escape closes and focus returns to the Menu button; with `calm` on, assert rows have final opacity within one frame; drag-to-close at 390x844; assert Calm corner box is 44x44 and does not overlap the rail. Screenshots: phone sheet mid-stagger (some bullets lit), desktop panel.

**Guardrails:** The Menu is a real dialog with real links and buttons; nothing is only reachable by gesture.

---

### E7.6: Keyboard and assistive-tech delight (SIGNATURE: the travelling focus flame)

**The astonishment:** Tab through the page and a single flame-coloured ring glides from control to control, stretching across the gap on a spring, then settles around the new one. Keyboard readers feel the page was designed for them, and screen-reader readers hear a clean, short script.

**Build:**
1. **Focus flame.** `src/components/FocusFlame.jsx`: one `<i id="focus-flame" aria-hidden>` fixed, `pointer-events: none`, 2.5 px border `--flame-core`, `box-shadow: 0 0 0 6px rgba(255,179,71,.26), 0 0 18px rgba(255,179,71,.35)`, radius copied from the target's computed `border-radius`. On `focusin`, only if `e.target.matches(':focus-visible')` and no dialog is open, read the target rect once and animate x, y, width, height through four `spring(FEEL.focusFlame)`; follow scroll with an rAF while the target stays focused and in view. Set `html[data-focusfx="1"]` only after mount; with it the native `:focus-visible` outline becomes `transparent`. Fallbacks: JS off, dialogs open (top layer would hide the ring), `forced-colors`, Calm: native flame outline (3 px solid `--flame-core`, offset 3 px, plus a breathing halo animating `box-shadow` between .18 and .34 alpha in 1.6 s; static .28 in Calm).
2. **Skip tray.** The existing skip link becomes a tray of three links shown on the first Tab (staggered 60 ms): "Skip to main" (exists), "Skip to the lamps" (`#lamp-1`), "Plain text version" (opens `openText`). Last two are NEW micro-labels (mark for ledger). Each is a real link with 44 px height; focus choreography per item 4.
3. **Shortcuts, discoverable never required.** Single-key shortcuts exist only when no modifier is held and focus is not in `input, textarea, select, [contenteditable]` and no dialog is open: `m` Menu, `c` Calm, `l` jump to the next unlit lamp's stop, `[` and `]` previous and next act (via `glideTo`), `i` Invite (only if `inviteVisible()`), `t` plain text, `?` opens the Keys list (a section in the Menu sheet). Satisfy WCAG 2.1.4: a switch "Keys on or off" in that list (in-session). Discovery: after the first keyboard navigation event on a fine-pointer device, show a 12 px mono hint "Press ? for keys" (NEW micro-label) at bottom left for 4 s, once per session.
4. **Focus choreography.** Opening an overlay: start the entry animation, move focus to the heading on the next frame (not after the animation, so assistive tech announces at once). Closing: focus returns to the opener, which gets one `data-buzz="settle"` ring. Jump targets (rail, shortcuts, Menu): focus the target heading with `preventScroll: true` after `scrollend` (fallback 700 ms), never before the scroll finishes. `Overlay.jsx` keeps its fallback to `#night-h`.
5. **Announcements (existing `announce()` only).** On `stage:act` caused by keyboard or rail navigation announce "{act name}, lamp {n} of 6" once per act; never on passive scrolling. Dots carry `aria-label` and `aria-current`; the focus-flame is hidden from the tree. Reduced-motion parity: every animated element here has a static equivalent defined in Tiers and Calm.
6. **Tab order check.** Skip tray, wordmark, Menu, Invite pill (when visible), content in DOM order, rail, Calm corner last.

**Files likely touched:** `src/components/FocusFlame.jsx` (new), `src/lib/keys.js` (new), `src/App.jsx` (skip tray), `src/styles/base.css` (focus rules, `.skip-link`), `src/components/MenuSheet.jsx`, `src/components/Overlay.jsx`, `src/lib/nav.js`.

**Tiers and Calm:** High: flame glides, halo breathes. Mid: glide with spring, halo static. Low: ring jumps instantly (no spring), static halo. Calm: native outline, static halo; all shortcuts still work.

**Budget:** JS about +2.6 KB gz; CSS +1.2 KB; frame cost: 4 springs only for about 300 ms after each focus change.

**Verify:** Playwright keyboard-only run: Tab 12 times and assert after each press that the `#focus-flame` rect is within 2 px of `document.activeElement` after 500 ms, never off-screen, and hidden after a mouse click; open Menu, assert native outline is used (focus flame hidden); press `?`, `c`, `m`, `]` and assert results; focus in the wish textarea and assert shortcuts do nothing; axe run has no new violations; with `forced-colors: active` emulated assert native outline visible. Screenshot: ring mid-glide (stretched) and at rest.

**Guardrails:** The native focus outline is always the fallback, shortcuts never fire in fields, and nothing requires a key.

---

### E7.7: Scroll as walking, history, idle and return (session choreography)

**The astonishment:** You are walking through a house: the stage rocks a hair with each footfall, flames lean into the draught of fast scrolling, a jump across the page is a soft dip of the light and not a blur, and Back closes the sheet you opened. Leave and return and the room welcomes you without a word.

**Build:**
1. **Scroll signals.** `src/lib/scrollcam.js`: one passive scroll listener (rAF-coalesced) computes smoothed velocity `sv` in -1 to 1 (px per second divided by 2400, spring `lean`) and `dir`; writes `--sv`, `--dir`, `--bob` to `:root`. `--bob = sin(scrollY / 38) * 1.2px * min(1, |sv| * 4)` (a footfall every 240 px, only while moving) applied by the stage container (`translate3d(0, var(--bob), 0)`, high tier only). Flames lean against travel: `engine.set(n, {leanExtra: -sv * 4})` for visible lamps. Topbar condenses (wordmark fades) when scrolling down faster than 80 px per second and restores on scrolling up.
2. **`glideTo(id)` (in `nav.js`, replaces `scrollToId`).** Distance under 2.2 viewports: spring scroll (`k = 140 * min(3, sqrt(dist / innerHeight))`, zeta 1, 1.1 s max) with `scroll-behavior: auto` and `html[data-glide]` disabling `scroll-snap-type`; cancels on `wheel`, `touchstart`, `keydown`. Longer: a "lamp-hop cut": `html[data-hop]` dips the stage to 70 percent black in 140 ms, instant `scrollTo`, rise in 360 ms (Calm: instant). While `data-glide` or `data-hop` is set, the V3 one-shot act-cue observers must ignore intersections (so a jump does not fire every act on the way).
3. **History.** Opening any overlay (menu, invite, lamp card, evidence, sixty, text) calls `history.pushState({ek: id}, '', location.href)` (no URL change). `popstate` is the single closer: UI close buttons call `history.back()` when the top state is theirs, and the handler closes the overlay. Nested opens (card to evidence) push twice. On load, if `history.state?.ek` exists, `replaceState(null, '', location.href)`. Fix `row.js` (three `replaceState(null, ...)` calls) to pass `history.state` through so share fragments never erase the overlay state.
4. **Restoration.** `history.scrollRestoration = 'manual'` and start every fresh load at the top (the flame count resets by design, so restoring mid-page would show an incoherent room). `pageshow` with `persisted` (bfcache) keeps everything and runs the welcome-back ripple.
5. **Idle ladder** (memory only; any pointer, key, scroll or touch resets): 6 s, the focal stop's affordance nudges once (E7.3 lessons already taught are skipped); 25 s, `html[data-idle="1"]` (flames at 85 percent, sparks and cat paused: E8 consumes this flag); 90 s, flames at 70 percent and particle spawning stops entirely. First input wakes with a 600 ms swell (one glow pulse). No text, no modal, no nagging.
6. **Return.** `visibilitychange` visible after more than 30 s hidden: flames do one sway (reuse `engine.breathe` at 40 percent) and the trail head pulses once. `document.title` swap while hidden is OFF by default behind a flag (NEW copy, ledger).
7. **Second visit in session.** `session.visits` (memory) increments when `#night` re-enters 60 percent after Act 3 was reached. On visit 2 or more: skip the headline sequence (final state at once), skip teaching nudges, lit lamps pulse once. The wordmark click uses `glideTo('night')`.

**Files likely touched:** `src/lib/scrollcam.js` (new), `src/lib/nav.js`, `src/lib/session.js`, `src/lib/row.js`, `src/lib/hash.js`, `src/App.jsx`, `src/components/Overlay.jsx`, `src/components/stage/Stage.jsx`, `src/styles/base.css` (snap rules), `tests/hash.test.mjs`.

**Tiers and Calm:** High: bob, lean, spring glide, dip, idle ladder. Mid: lean and glide, no bob. Low: glide replaced by native smooth scroll, no lean, idle flag only. Calm: instant scroll, no bob, no lean, no swell; history behaviour and restoration still apply.

**Budget:** JS about +2.6 KB gz; CSS +0.4 KB; frame cost 0.05 ms per scroll frame.

**Verify:** Playwright: open invite sheet, `page.goBack()`, assert the sheet closed and URL, scroll position and lit count unchanged; reload mid-page and assert `scrollY === 0`; click rail dot 6 from the top and assert `data-hop` set, no act events beyond the destination act, and the final heading in view; idle 7 s and assert `data-idle` is unset, 26 s assert set, then move the mouse and assert unset; emulate bfcache with `pageshow` `persisted` and assert state intact; Calm: assert `scrollTo` is instant.

**Guardrails:** Nothing is stored (memory and `history.state` only); history entries never alter the visible URL or the share fragment.

---

### E7.8: Making INVITE ME feel inviting and effortless

**The astonishment:** The pill arrives like a spark catching: it kindles once, then waits calmly. One tap and the sheet rises with a small flame lighting at its crown; "Copied" is a ring of warm light and a tiny ember, not a toast.

**Build:**
1. **Arrival.** The topbar pill (V3: after Act 2) enters with `spring(FEEL.invitePill)` (scale .6 to 1, 12 percent overshoot) and one 700 ms perimeter sweep: a conic gradient mask rotating 360 degrees over the border, with a 3 px spark at its head. Once per session for the pill, and once per inline invite point (Acts 5 and 6) the first time it is 60 percent visible. Never repeating pulses. Prefetch `inviteUrls()` when the pill first appears so opening does no work.
2. **Open.** Phone: bottom sheet rising with `sheetSnap` physics (about 380 ms, 1.5 percent settle), scrim fade 240 ms; desktop: centred card, scale .94 to 1 plus 12 px rise. A 16 px diya at the sheet's crown lights its flame at 200 ms (scale 0 to 1 in 400 ms). Options enter staggered, 50 ms apart, `translateY(16px)` with `FEEL.menuItem`.
3. **Focus.** Focus the primary option (via `Overlay` `initialFocus` from E7.5) so Enter completes the whole action; the dialog name is announced from `aria-labelledby`. Existing option order by pointer type (mail app first on touch, Gmail first on desktop) stays.
4. **Rows.** Each option is a 56 px row with a press spring and the fingertip bloom (E7.3). Primary row uses marigold; others outlined. External links get a small `↗` glyph and keep `rel="noopener noreferrer"`. Tapping an external link sends a flame mote from the row toward the edge (400 ms) and `haptic('hop')`, so the tap is felt even if the new tab opens behind.
5. **"Copied".** On copy success: label crossfades to the existing copied string (`X('inviteAddrCopied')` and `X('inviteMsgCopied')`, no new copy) with a check drawn by `stroke-dashoffset` over 220 ms, a 360 ms warm ring around the button, an `fx:burst {kind:'ember'}` at its centre, `haptic('settle')`, and the existing `role="status"` text. After 1.8 s the label returns by crossfade. Lock width with two stacked grid spans so nothing shifts. On failure: select the address as today, run the row's `nudge` (8 px horizontal settle, 280 ms) and `haptic('nudge')`; text stays the existing neutral `X('inviteCopyFail')`.
6. **Tapping the address text** copies it (44 px tall hit area, `mono` text, visible affordance on hover and focus).
7. **Close.** Escape, backdrop tap, Back (history entry from E7.7) and a downward drag on the grab pill (E7.1); focus returns to the opener and the pill shows a quiet `settle` ring. `i` opens the sheet when contact exists.
8. **Nothing leaves the page** until the reader taps an external link, exactly as in `InviteSheet.jsx` today.

**Files likely touched:** `src/components/InviteSheet.jsx`, `src/components/InviteButton.jsx`, `src/components/Overlay.jsx` (`initialFocus`), `src/lib/mail.js`, `src/lib/cardActions.js` (copy feedback hook), `src/styles/invite.css` (new), `src/lib/haptic.js`.

**Tiers and Calm:** High: kindle sweep, crown flame, stagger, ember. Mid: kindle sweep, stagger, no ember. Low: pill pops without spring, options appear together. Calm: pill and options appear in final state; "Copied" is the text change plus a 2 px static ring for 1.8 s, no ember, no haptic.

**Budget:** JS about +1.2 KB gz; CSS +0.9 KB; frame cost: under 0.2 ms during the 700 ms sweep.

**Verify:** Playwright: scroll past Act 2, assert pill visible and arrival animation plays once (second scroll through does not replay); click pill, assert focus on the primary row and DOM order; click Copy address (grant clipboard permission) and assert status text, label restored after 1.9 s, button width unchanged (`getBoundingClientRect().width` stable); deny clipboard and assert the selection path and a nudge; Back closes the sheet; Calm run has no animation names on the options. Screenshot: sheet mid-stagger and the "Copied" ring.

**Guardrails:** The invite pill and sheet render only when `inviteVisible()` is true, and no animation ever blocks the primary action.

---

## Appendix E7.A: Touch-and-pointer QA matrix (run after each prompt and once at the end)

Setup: Playwright, chromium, `--no-sandbox`. Contexts: phone 390x844 `hasTouch` and `isMobile` (Android UA for haptics), tablet 820x1180, desktop 1366x768 and 1920x1080. Stub `navigator.vibrate` through `addInitScript` and collect calls in `window.__vib`.

| Input | Checks (exact) |
|---|---|
| Mouse | Hover lights the card edge nearest the cursor; magnetic offset at most 6 px and clicks still land; long press 500 ms on empty stage starts the sparkler and release ends it; no element computes `cursor: none`; text selection works in `.panel`; right click is not blocked. |
| Trackpad | Two-finger scroll fires `--sv` smoothing (assert no more than 60 listener calls per second with rAF coalescing); pinch-zoom is not prevented (`touch-action` never `none` on the page); momentum scroll does not trigger the lamp-hop cut. |
| Touch | Every tappable has a 44x44 hit box (script: all `a, button, [role=button], input, summary` measured with `getBoundingClientRect`, expanded by `::after` insets where known, assert at least 44 in both axes or flag); neighbouring hit boxes at least 8 px apart (the rail is the tightest case: 44 px pitch); no custom drag starts when `clientX < 24` or `> innerWidth - 24`; vertical scroll wins over compare and pane swipes (`touch-action: pan-y`); hold, tap and early release on the host diya all behave as today. |
| Pen | Behaves as mouse for hover and cursor glow (pointerType `pen`), as touch for target size; pressure is never required. |
| Keyboard | Tab order matches E7.6 item 6; focus flame within 2 px of the active element; every shortcut works and is inert inside inputs; Escape closes the topmost overlay and returns focus to its opener; Enter and Space activate dots, rows and options; Calm toggles by `c`. |
| Screen reader (simulated through the accessibility tree) | Rail is a `nav` named "Where you are" with six links, one `aria-current="location"`; dialogs expose `aria-labelledby`; `#announcer` text emitted once per act only after keyboard or rail navigation; all decorative layers (`#lamp-cursor`, `#focus-flame`, `#touch-glow`, `.thumb-flame`) are `aria-hidden` and never focusable; the range inputs keep their `aria-valuetext`. |
| Calm and reduced motion | `html[data-calm="1"]`: zero running CSS animations on interactive elements (`document.getAnimations()` filtered), no haptic calls, no spring overshoot samples, sheets appear instantly, focus ring static; the page remains visually complete in screenshots at 390 and 1366. |
| Quality tiers | Force `fx:setQuality` to high, mid, low and assert E7 features degrade as listed per prompt, with frame time sampled over 3 s of scroll plus drag under 16.7 ms p90 on high. |
| History | Open invite, Menu, card, evidence, then Back four times: each closes one layer, URL and `scrollY` never change, share fragment intact; reload with an overlay entry on top clears it. |
| Privacy | `localStorage`, `sessionStorage`, `indexedDB` and cookies all empty after a full run; zero network requests after load other than the first document and assets. |

## Risks and cut order

Risks: (1) the travelling focus flame is the riskiest for assistive tech: keep native outline as the instant fallback and ship it last; (2) the right-edge rail on small phones can fight the browser back gesture: it only taps, never drags, and hides in landscape; (3) history entries can trap readers if popstate is buggy: test with the unit tests and cap the stack depth at 2 (card to evidence replaces beyond that); (4) magnetic pull can cause a missed click on small targets: capped at 6 px and disabled for anything under 44 px; (5) V3's observers firing during glides: the `data-glide` and `data-hop` guard must be added in the same change.

Cut order if time runs out (first to go first): the cursor sparkler (E7.2 item 6); the ember shedding on the trail head; the Menu ember-down-the-bullets; magnetic pull; the focus flame glide (keep native flame outline); the footfall bob; the idle ladder levels 25 s and 90 s; the Act-name labels on the trail; the dev `?feel` panel. Never cut: the physics kit with Calm behaviour, the haptic vocabulary and visual twins, the history discipline (Back closes sheets), the rail dots with 44 px targets, the shortcuts off switch, and the Invite "Copied" confirmation.


---

# PACK 6: CULTURE, WISH AND DELIGHT (E6)

Position in this file: 7 of 8. Apply order: see the table at the top.

Written by Elevation Agent E6 on 3 Nov 2026. Read against the V3 branch snapshot (src/components/Wish.jsx, WishForm.jsx, DeskScene.jsx, CardStage.jsx, Closure.jsx; src/lib/cardRender.js, cardActions.js, rowhash.js, row.js, wishState.js, flame.js, fx.js, quality.js, rand.js) and the live page at 390x844 (screenshots in review screenshots (elev_6/).

## Pack overview

1. **What it elevates.** The wish step, the page's one viral moment. Today the card (shots c_card.png, d_theme*.png) is a flat vertical gradient, a thin double outline, one small flat diya and system serif text. The desk above it is charming but static, the closure row is six tiny lamps on bare ground, and the Indian-home feeling lives only in the sky and skyline.
2. **Honest diagnosis.** The six themes differ by colour and one motif, not by depth. The card has no light of its own (the "lighting moment" is a CSS sweep), no way to make it yours except words, and the only thing that leaves the page is a still PNG. The closure shows the link count as seven identical lamps.
3. **What E6 adds.** A seeded rangoli/kolam engine (E6.1) that the visitor can draw into (E6.2); a card with layered paper, embossed marigolds, a diya that really lights it, drag-to-compose and spring physics (E6.3); a silent 6-second looping card in which the wish writes itself in light (E6.4); a lantern sky equal to the link's row count (E6.5); a director for tiny homely moments (E6.6); five secrets (E6.7); script-correct text and an Ink twin for everything (E6.8).
4. **Signature moments no portfolio has.** (S1) You draw in rangoli with a finger, it mirrors 8 or 12 times in warm light, and that same drawing becomes the card background and the glow pattern of your lantern. (S2) The card is a 6-second silent film in which your own words write themselves in light beside a lit diya, shareable to WhatsApp. (S3) Your wish becomes a lantern that joins a sky with one lantern per diya in the link.
5. **Depends on.** E2 (motion tokens `--ease-*`, `--dur-*`, `src/lib/motion.js`, `html[data-act]`), E1 (palette tokens, Ink look), E4 (`lightEngine.js`, `bloom:set`, `--lx --ly --li`), E8 (quality tiers, frame budgets). If `motion.js` lacks a spring, add the 14-line spring in E6.3 locally and do not wait. Fits after pack 5 and 7 in the stated order. E6 adds at most about 27 KB gzipped JS and 3.5 KB gzipped CSS; the cut order at the end says what goes first if the shared budget tightens.

**Truth and privacy guardrails for the whole pack.** No fact or claim changes. Every drawing, wish, name and recording exists only in memory and is never written to the address bar, storage or the network. The row count stays "written inside the link, not a visitor count, not verified" (V3 string `copy.ui.rowFine`) everywhere the lanterns appear. New micro-labels are marked **[NEW LABEL]** and need Shriniwas's approval; until approved, render the visually hidden English alternative only.

## Cultural facts relied on (and what I did not verify)

- Kolam (Tamil Nadu) is drawn in rice flour around a grid of dots (pulli); sikku ("knot") kolams loop a line around dots without touching them, and the rice flour is meant to be temporary and to feed birds and small creatures. Sources: Sahapedia, "Significance of Kolam in Tamil Culture" (sahapedia.org/significance-of-kolam-tamil-culture); Gopalan et al., "Symmetry Classification and Enumeration of Square-Tile Sikku Kolams" (arXiv 2304.14134); "Pulli Kolam" (arXiv 2603.02343). Consequence: our generator is described as "rangoli/kolam-inspired"; it does NOT promise a single closed loop, so it must never be labelled a traditional or correct kolam. Other regional names (muggu, alpana, rangoli by region) are general knowledge, not cited here; the UI says "rangoli" only, as V3 already does.
- The akash kandil (akash deep, "lantern of the sky") is a paper-covered, framed lantern hung outside homes at Diwali, common along western India (Goa, Mumbai). Sources: Wikipedia "Kandeel"; Outlook Traveller, "Akash Kandils and the light they spread during Diwali"; MSU Extension "Crafts Around the World: India, Akash Deep or Kandil". I could not find a source specific to Maharashtra hanging; do not print a regional claim. Sources also say it is believed to welcome a goddess: E6 shows the object only, never that meaning. The lantern in E6.5 is therefore drawn as a hung kandil with tassels, NOT a floating fire balloon; I did not verify sky-lantern release as a Deepavali custom and the page never tells anyone to release real lanterns.
- MediaRecorder: Safari has recorded MP4 (H.264 + AAC) since 14.1 (WebKit blog "MediaRecorder API") and added WebM (VP8/VP9 + Opus) in 18.4; Chrome writes MP4 in addition to WebM from about version 126, only when an OS encoder exists (third-party demo and MDN notes, so unverified against Chrome release notes). Therefore the code must feature-detect with `MediaRecorder.isTypeSupported` and never branch on a version number. Sources: webkit.org/blog/11353/mediarecorder-api; MDN `MediaRecorder.isTypeSupported`; addpipe.com media-recorder demo.
- WhatsApp: its Business API documents video as MP4 or 3GP, H.264 video plus AAC audio (or no audio), at most 16 MB; one source warns H.264 High profile with B-frames fails on some Android clients (use Baseline or Main, moov atom first). I found no source listing WebM as supported. The consumer app's limits can differ; 16 MB and Baseline/Main are used here as a conservative target only. Sources: 360dialog and Meta WhatsApp Business video docs as extracted by search.
- Not verified, designed around: that WhatsApp converts a shared .gif into a looping clip (E6.4 marks the GIF fallback "test on a real phone, cut if it fails"); that some readers hold a superstition about a black cat crossing their path (so the cat in E6.6 only sits, never crosses); that taking footwear off at the door is a common household practice (a tiny static prop, no claim made).

**Never shown, anywhere (respect rule).** No deity or deity-vehicle imagery (so no owls, no elephant-headed figures, no lotus-with-figure), no footprints motif, no swastika, Om, kalash or coconut, no aarti plate, tilak, puja objects, instructions or blessings; no people's faces or detailed figures (shadow silhouettes only, 3 on screen at most, never a face); no crackers lecture or pollution commentary; no gift or hamper imagery; no text that tells a reader what to celebrate or how; no regional claim ("this is how X does it"). Rangoli patterns are geometry only (dots, petals, lattice, stars); marigold, mango leaf, diya, kandil, string lights, sparkler, anar, rocket, chakri are the whole vocabulary.

---

### E6.1: The rangoli engine (pulli grid, folds, seeded, reproducible)

**The astonishment:** A pattern that is never the same and always yours: dots appear first, then woven lines grow outward ring by ring, glowing like rice flour under a lamp, and a given seed always draws the same design.

**Build:** Create `src/lib/kolam.js` (pure functions, no DOM) and `src/lib/kolamDraw.js` (canvas painter). Use `mulberry32` from `src/lib/rand.js`.

1. `makeKolam({ seed, folds, rings })` returns `{ folds, rings, dots, strokes, lengths }` in unit coordinates (-1 to 1). `folds` defaults to a seeded pick of 6, 8, 10 or 12 (weights 1, 4, 2, 3); `rings` is 3 to 5.
2. Dots (pulli): one centre dot; ring k (1..rings) at radius `0.94*k/rings`, with `folds*m` dots where `m` is 1 for odd k and 2 for even k (seeded flip allowed), angular offset half a step on odd rings so the dots form a staggered lattice. Dot radius 0.012 (centre 0.02).
3. Lines: build one sector of strokes, then mirror it by rotating `2*PI/folds` and, if `mirror: true`, reflecting. For every dot draw a four-lobe knot: two crossing lenses (quadratic Béziers), one along the radial axis (length 0.11, half-width 0.035) and one along the tangent, so adjacent knots overlap at their tips and form a chain. Between ring k and k+1 add one scalloped arc (control radius `r_k + 0.5*gap`) per pair of dots. Seed picks per ring whether the scallops bulge outward or inward. Every lens is built so its minimum distance to any dot centre is at least 0.02: lines go round dots, never through them (the sikku rule, cited above).
4. Return each stroke as `{ d, kind }` where `d` is an SVG path string plus a precomputed approximate length (sum of 12 samples), so the painter can animate drawing with `setLineDash`.
5. `drawKolam(ctx, k, { cx, cy, R, progress, palette, glow })`: dots pop in by ring (ring k at `progress` k/rings*0.45, scale 0 to 1 with `--ease-out-expo`); strokes draw outward in the remaining time. Two passes: a wide pass (width `R*0.026`, alpha 0.12, composite `lighter`) then a core (width `R*0.0075`, `palette.core`, cream `#FFF3DC`), dots in cream with a 3-ring radial sprite glow. `palette` comes from `lib/palette.js` (E6.8), warm by default.
6. `kolamToSVG(k)` returns a static, accessible `<svg role="img">` string for Calm, for the card twin and for server-free tests.
7. Export `presetSeeds` (six fixed seeds chosen by the agent for visual variety: folds 6, 8, 8, 10, 12, 12), used by E6.2 and by the card default (seed from `makeSeed(content)`).

**Files likely touched:** `src/lib/kolam.js` (new), `src/lib/kolamDraw.js` (new), `src/lib/rand.js` (no change), `tests/kolam.test.mjs` (new).

**Tiers and Calm:** High: glow pass plus staged draw-in (1.6 s, `--dur-xl`). Mid: no glow pass; draw-in 1.2 s. Low: dots and lines at once, no animation. Calm: final state at `progress = 1`, no motion, same beauty (static SVG).

**Budget:** about 3 KB gzipped JS, 0 CSS. Drawing a full kolam: under 2 ms per frame at 600x600 canvas (at most 420 Path2D strokes).

**Verify:** Node test: (a) same seed gives identical output twice; (b) rotating every sampled stroke point by `2*PI/folds` lands within 1e-6 of another stroke's point set (fold symmetry); (c) no stroke sample is closer than 0.018 to any dot; (d) 200 seeds produce at least 40 distinct stroke-count/fold combinations. Screenshot of a 600x600 canvas for seeds 1, 2, 3 at progress 0.3 and 1.0: dots first, lines woven round them, visibly 8-fold or 12-fold symmetric.

**Guardrails:** Geometry only, no religious motifs, never labelled "traditional"; nothing stored.

---

### E6.2: The rangoli pad (draw with a finger, see it in 8 or 12 folds of warm light)

**The astonishment:** The visitor draws one scribble and sees it bloom into a twelve-fold glowing mandala under their finger, with a faint pulli lattice the line politely bends around; it becomes their card's backdrop.

**Build:** New `src/components/KolamPad.jsx`, rendered inside `Wish.jsx` as an optional disclosure under the form (collapsed by default so V3's short wish step stays short): `Rangoli banaiye ▾` **[NEW LABEL]** with English `Draw a rangoli for the card (optional)`. Do not add it to the first screen of the wish.

1. One square canvas, `width: min(86vw, 340px)`, DPR capped by tier (high 2, mid 1.5, low 1), `touch-action: none`, pointer events with `getCoalescedEvents()` when present. Draw a faint (alpha 0.18) pulli lattice from `makeKolam({seed: presetSeeds[0], folds})` dots.
2. Controls (all 44 px): folds radiogroup 6 / 8 / 12 (default 8); Mirror toggle (reflect each stroke, so 2F copies; default on); Undo; Clear; and the preset row (six buttons, each a 48 px thumbnail from `kolamToSVG`), which is the accessible alternative: choosing a preset fills the pad with that engine pattern animating in.
3. Stroke handling: sample points at least 3 px apart, smooth with midpoint quadratic Béziers, at most 40 strokes and 4,000 points. Store strokes normalised to the unit circle in a module-level array `kolamDraft` (memory only, exported by `lib/kolamDraft.js` with `get/set/subscribe`). Repulsion: any point closer than 16 px to a lattice dot is pushed out to 16 px, so the line bends around each dot.
4. Render each stroke F times (and mirrored): wide glow pass (width 10, alpha 0.10, `lighter`) plus core (2.5 px, `#FFE9B8`). The finger carries a warm ember head (96 px radial sprite) with a 600 ms fading trail kept on a separate cleared layer.
5. Keyboard drawing (accessible): the canvas is `role="application"` with a visible focus ring; arrow keys move a brush 8 px (24 with Shift), Space toggles the pen, Backspace undoes. Live-region announcements through `announce()`: `Stroke {n} added` **[NEW LABEL]**.
6. Add theme `kolam` as a 7th entry in `THEMES` (E6.3 paints it) with `copy.ui.extra.themeNames` entry `Aapki rangoli` **[NEW LABEL]**; it is offered only when `kolamDraft` has at least one stroke or a preset is chosen. Emit `kolam:changed {n}` (debounced 120 ms).
7. Pointer-up on a stroke that crosses the centre within 14 px snaps its start to the centre (so fans of lines meet cleanly).

**Files likely touched:** `src/components/KolamPad.jsx` (new), `src/lib/kolamDraft.js` (new), `src/components/Wish.jsx`, `src/lib/cardRender.js` (E6.3), `src/styles/wish.css`, `src/data/copy.json` (labels, after approval).

**Tiers and Calm:** High: glow plus ember trail plus 12 folds. Mid: glow, 8 folds max when Mirror is on, trail 300 ms. Low: no glow pass, 8 folds max, no trail, still shows strokes. Calm: the pad works (it is user-driven) but strokes appear instantly with no trail and no draw-in; presets show their final state.

**Budget:** about 4.5 KB gzipped JS, 0.6 KB CSS. At F=12 with Mirror (24 copies) a stroke segment redraw must stay under 4 ms on mid-range Android; if a frame exceeds 8 ms, drop to F=8 for the rest of the stroke.

**Verify:** Playwright: drag 30 pointer moves on the pad, assert canvas has non-empty pixels in 12 rotationally equal sectors (compare sector pixel counts within 8%), assert `kolamDraft` strokes length is 1, Undo removes it. Keyboard: Tab to canvas, Space, ArrowRight x5, Space, strokes length 1. Reload test: nothing persisted (`localStorage`, `sessionStorage`, `indexedDB`, `location.hash` unchanged). Screenshot: pad after one scribble must show a glowing mandala, pulli visible, bent lines not touching dots.

**Guardrails:** Strokes never leave memory, never enter the share link; presets always available so drawing is never required.

---

### E6.3: The card studio v2 (layered paper, embossed marigolds, a diya that lights the card, drag-to-compose, spring physics)

**The astonishment:** The card looks like paper you could pick up: cut layers with soft shadows, raised marigolds catching light, and a real flame whose glow shifts across the paper as you drag the diya or tilt the phone.

**Build:** Rework `src/lib/cardRender.js` and `src/components/CardStage.jsx`; keep every export name (`THEMES`, `renderCard`, `W`, `H`, `isRtl`, `countGraphemes`, `cutGraphemes`, `makeSeed`) and the 1080x1350 space so PNG, preview and V3 tests keep working.

1. New layer model for `renderCard({layers})`: `'art'` (cached: paper sheets + emboss base + decoration), `'light'` (new: flame glow, lightmap, emboss highlights, flame at `phase`), `'text'`. Draw order everywhere (preview, PNG, video): art, light, text. Text is last so light never lowers its contrast.
2. Paper depth (art): three sheets per theme: back sheet (theme colour, deckle edge from 64-point seeded noise), middle sheet (kolam/marigold cut-out window, offset shadow 6 px down, alpha 0.35, `shadowBlur` only on high tier, flat offset shadow on others), front plate (soft paper behind the text, alpha 0.82, radius 36). Paper fibre: one procedural 128x128 tile (seeded noise, quantised to 4 levels so PNG stays compact) tiled at alpha 0.04, `multiply`.
3. Emboss: items are recorded in a display list `emb[]` (marigold = 3 rings of petals, 12 + 8 + 5, with leaf lens shapes; frame hairlines; kolam strokes). The light pass draws each item twice offset 2 px: a cream highlight (alpha 0.5*`li`) on the side facing the flame and an umber shadow (alpha 0.35) on the far side. Cap 40 items; the offsets change when the diya moves.
4. Lit diya: `drawFlame(ctx, x, y, s, t, lean)` draws three teardrops with the same proportions as `Flame.jsx` (w 11, h 72; colours `--flame-b`, `--flame-a`, `--flame-core`), flicker from `noise()` in `flame.js`, plus a 240 px radial glow (alpha 0.55, `lighter`). Preview adds a third canvas `.live` between `.art` and `.txt`, drawn at half resolution at 30 fps through `ticker`, only while the card is on screen and not Calm. PNG export draws the same function at fixed `phase = 0.35` so what you see is what you send.
5. Drag-to-compose: a 44x64 px `.diya-handle` button over the diya (`touch-action: none`, `aria-label` `Move the diya on the card` **[NEW LABEL]**) drags the diya between three zones, top (540,300), bottom-left (190,1030), bottom-right (890,1030); text box and `textTop` adapt per zone; release springs into the nearest zone in 420 ms (`--ease-spring`). Arrow keys on the handle cycle zones (the keyboard alternative). Compose zone is memory only, in `wishState`.
6. Physics: replace the 12 percent smoothing with a spring (stiffness 170, damping 18) driving `rotateX/rotateY` and `--lx --ly`; on pointer-up apply an angular impulse from release velocity; the flame leans `clamp(-ax*0.02, -8, 8)` degrees with the card's lateral acceleration and the lightmap centre follows the flame. Phone tilt feeds the same spring (Android only, as now).
7. Theme elevation (all keep their ids and V3 names): diya (gold paper, embossed marigold garland arc, mid sheet in kumkum), rangoli (cream, generated kolam from the seed cut-out), toran (green velvet, embossed marigold rosettes and mango leaves), phuljhadi (night paper, sparkler light-trails that are part of `light`), kandil (indigo, glowing kandil with tassels), kolam (E6.2 drawing, mirrored, as the cut-out), ink (see E6.8).

**Files likely touched:** `src/lib/cardRender.js`, `src/components/CardStage.jsx`, `src/lib/wishState.js`, `src/styles/card.css`, `src/lib/cardActions.js` (export ladder).

**Tiers and Calm:** High: live flame, emboss relighting, shadowBlur sheets, 30 fps. Mid: live flame at 20 fps, flat offset shadows, emboss highlight only. Low: static card at phase 0.35 (flame still drawn, no loop), no emboss motion. Calm: static card at phase 0.35, drag-to-compose still works (springs replaced by a 120 ms linear move), no tilt.

**Budget:** about 7 KB gzipped JS, 0.4 KB CSS. Live pass at most 2 ms per frame at 540x675; art redraw only on theme, seed, size or compose change. PNG must stay under the 300 KB limit: if the tile pushes it over, the existing lean ladder drops the tile first, then shadows. Check real sizes for all themes before deciding to raise the limit.

**Verify:** Playwright at 390x844: make a card in each of 7 themes, screenshot `.stage-wrap` and assert each differs by more than 12 percent of pixels from the old flat render; assert the export PNG (phase 0.35) differs from the preview frame at that phase by under 3 percent; drag the handle 300 px and assert the zone changes and text box moves; with quality `low`, assert no rAF loop for `.live`. A screenshot must show visible layered shadows, raised marigolds and a warm glow centred on the diya.

**Guardrails:** Same words, same share text; the flame lights paper only, never claims; text contrast at the brightest lit pixel stays at least 4.5:1.

---

### E6.4: Chalta card (a 6-second silent film where the wish writes itself in light)

**The astonishment:** Beside a lit diya, the sender's own words appear as if drawn by a point of warm light, hold, then glow and loop: a living card they can send to one person.

**Build:** New `src/lib/cardMovie.js` and a button in the card actions grid: `Chalta card` **[NEW LABEL]**, English `Moving card (6 s, silent)`.

1. Scene: 720x900 canvas (4:5), 30 fps, 6.0 s, designed to loop. Reuse the E6.3 art layer, `drawFlame` and text lines (`fit()` output from `cardRender.js`). Timeline: 0.0 to 0.8 s dark paper, flame catches (scale 0 to 1, glow rises with `--ease-out-expo`); 0.8 to 4.2 s each text line reveals through a clip rectangle with a 60 px soft gradient edge, led by a bright 18 px "pen of light" dot with a 400 ms trail (clip-reveal preserves Indic shaping; sweep right to left for RTL from `isRtl`); 4.2 to 5.4 s hold with six sparkles; 5.4 to 6.0 s glow eases back to the first frame state. Flame flicker is sampled on a circle (`noise(cos, sin)`) so it is periodic over 6 s and the loop is seamless.
2. Recording: `canvas.captureStream(0)` plus `track.requestFrame()` after each drawn frame when available, else `captureStream(30)`. Never add an audio track (silent, and WhatsApp allows no audio stream). Pick the type with `isTypeSupported` in this order: `video/mp4;codecs=avc1.42E01E` (Baseline), `video/mp4;codecs=avc1.4D401E` (Main), `video/mp4`, `video/webm;codecs=vp9`, `video/webm;codecs=vp8`, `video/webm`. `videoBitsPerSecond: 1_600_000`, so about 1.2 MB, far below 16 MB.
3. UX: tap `Chalta card`; the visible canvas plays the film live while it records (the recording is the preview; honest 6 s wait, with a thin progress ring). Then the button becomes `Share moving card` (a fresh tap supplies the user activation Safari needs for `navigator.share`). Abort and offer retry if `document.hidden` fires during recording (throttled rAF breaks the file).
4. Delivery matrix, stated in the UI line under the button (**[NEW LABEL]**, English only unless approved): MP4 produced (Safari on iOS and macOS, Chrome where isTypeSupported accepts mp4): share the file with `navigator.share({files:[file], text})` when `canShare` agrees, else download. WebM only (older Chrome, Firefox, unsupported cases): WhatsApp is not documented to accept WebM, so do not offer WebM as the WhatsApp path; offer `Download WebM` and put the PNG share first. iOS: MP4 via the share sheet (Save Video appears there); in-app browsers where `canShare` fails: PNG long-press hint, download link.
5. Optional fallback, flagged "test on a real phone, cut if it fails": a hand-written GIF89a encoder (`src/lib/gif.js`, about 110 lines: fixed 64-colour ramp per theme, Bayer 4x4 dither, LZW, 288x360, 10 fps, 60 frames, chunked with `setTimeout(0)` yields and a progress ring) for browsers with no MediaRecorder. I could not verify that WhatsApp converts a shared .gif; do not promise it in copy.
6. Poster: the final-hold frame becomes the `poster` and the existing PNG remains the primary share.

**Files likely touched:** `src/lib/cardMovie.js` (new), `src/lib/gif.js` (optional, new), `src/lib/cardActions.js` (`sendCard` chain: movie first only when the visitor tapped the moving button), `src/components/CardStage.jsx`, `src/data/copy.json`.

**Tiers and Calm:** High: 30 fps, glow and sparkles. Mid: 24 fps, half sparkles. Low: button hidden when quality is `low` unless the visitor taps `Chalta card` once more under a "may be slow" line; Calm: the on-screen preview is a still poster, and the recording button still works (user-initiated) but plays no preview animation beyond the progress ring.

**Budget:** about 4 KB gzipped JS (plus 2 KB if GIF is kept). Recording cost at most 6 ms per frame at 720x900 on a mid-range phone; if two consecutive frames exceed 33 ms, stop, fall back to the PNG share and say so.

**Verify:** Headless Chromium (record with WebM if mp4 is unsupported): click `Chalta card`, wait 6.5 s, assert a Blob of 15 KB to 2.5 MB exists with a non-empty type, no audio track (`getAudioTracks().length === 0` on the stream), and frames at 0.5 s, 3 s and 5 s sampled from the canvas are different, with frame 6.0 pixel-close to frame 0 state (loop). QA outside headless: `ffprobe -show_streams` on a produced MP4 must show H.264 Baseline or Main and no audio; play on one Android and one iPhone. Screenshot: three frames side by side (flame lit, text half-written with a bright pen dot, text complete with sparkles).

**Guardrails:** Silent, 6 seconds, stays on the device, share only on tap; never claim WhatsApp support that was not tested.

---

### E6.5: Kandil rises (the lantern sky equal to the row count)

**The astonishment:** After sending, the card folds into a glowing paper kandil whose pattern is the visitor's own rangoli, rises and takes its place in a quiet sky with one lantern for every diya written in the link.

**Build:** New `src/lib/lanternSky.js` plus a short mount in `Closure.jsx` (a canvas behind `.cl-row`), triggered by the existing `wish:sent` event once per page load and by arrival at `#closure` after `diya:visitorLit`. Lantern count equals `row.count` from `store.row` (what the link carries) capped at 24 drawn lanterns, with a soft haze and `+` for the rest. Caption stays V3's `captionFor(base)` and the `copy.ui.rowFine` line ("written inside the link, not a visitor count, not verified") must remain visible while the sky is shown.

Lantern shape: a hung kandil, not a balloon: six-sided paper body (width 38 px, height 52 px at scale 1), cap and base rings, a 5-strand tassel, inner glow `lighter`. The visitor's lantern uses the card's art bitmap (or kolam) as the translucent panel texture, so the pattern glows through paper; other lanterns use six seeded panel patterns from `makeKolam` at low detail. Colours: three warm paper tones (marigold, kumkum, cream) at depth scales 0.55 / 0.75 / 1.0 with parallax drift.

Choreography (all easings from E2 tokens, total about 6.6 s):
- 0.00 s: card body is cloned to a fixed element at its rect; page UI dims to 70 percent for 700 ms.
- 0.00 to 0.70 s: the clone morphs, rectangle to lantern silhouette (both paths have 12 control points, interpolated), shrinking to 64x80 px, `--ease-in-out-quint`.
- 0.70 to 1.00 s: a flame ignites inside (`fx:burst` kind `ignite`, `bloom:set` r 120, i 0.7).
- 1.00 to 5.20 s: the lantern rises along a quadratic curve to its sky slot (sky occupies the top 55 percent of the viewport), speed `--ease-out-expo`, sway `sin(t*0.8*2pi)*6 px`, at most 2 embers per frame in its wake.
- 1.00 to 3.00 s (overlapping): the N existing lanterns fade in, 90 ms stagger, left to right, each starting at depth-scaled alpha 0.8, then hovering with sway amplitude 3 to 7 px and a 6 to 14 px per second slow drift that wraps.
- 5.20 s: the visitor's lantern settles; one `settle` ring (`fx:burst`), the sky brightens by one step (`--act-progress`), caption fades in over 480 ms.
- Any tap or scroll over 40 px jumps to the end state (same as Closure's skip).
Idle after: sway only at 30 fps while `#closure` is on screen, nothing otherwise.

**Files likely touched:** `src/lib/lanternSky.js` (new), `src/components/Closure.jsx`, `src/components/CardStage.jsx` (emit `lantern:rise {rect, bitmap}`), `src/styles/story.css`.

**Tiers and Calm:** High: 24 lanterns, parallax layers, embers, bloom. Mid: 16 lanterns, no embers. Low: 8 lanterns, static, only the rise (CSS transform, 1.2 s). Calm: the sky renders in its final state with the visitor's lantern in its slot, no rise, no sway; the caption and plain text twin say the same.

**Budget:** about 3.5 KB gzipped JS, 0.3 KB CSS. At most 24 sprites pre-rendered into 6 offscreen canvases; under 2 ms per frame.

**Verify:** Playwright: open with `#v1.7.Asha`, light five lamps, make a card, tap WhatsApp share (stub `navigator.share`), assert a canvas exists with 8 lanterns (7 plus yours) by counting sprite draw calls through a test hook `window.__lanterns`; with `#v1.zzz` assert 24 plus haze; assert `row.count` in the address bar unchanged by this feature; Calm: assert no rAF. Screenshot at 390x844: a quiet sky of lit lanterns, the visitor's brightest, with the rowFine line visible beneath.

**Guardrails:** The sky is a picture of the number in the link, never of visitors; no real-lantern instruction; no goddess or blessing words.

---

### E6.6: The homely hour (tiny moments that make it a home, not a template)

**The astonishment:** If you linger, the apartment answers: a curtain stirs in a lit window, a shadow crosses behind another, a loose bulb in the string lights flickers, birds go home. Nobody tells you; you simply feel someone lives here.

**Build:** New `src/lib/homely.js` (scheduler) plus small SVG parts in `src/components/stage/SkylineLayer.jsx` and `Terrace.jsx` (reuse window rects and string lights).

1. Catalogue (each aria-hidden, `pointer-events: none`, never over a hit target):
 - `curtain`: in one lit skyline window an SVG curtain path sways (3.2 s, translateX 0 to 3 px with skew 1.5 deg, three cycles).
 - `passer`: a soft-edged dark vertical shape (8x16 px with 2 px blur, no face, no detail) crosses a lit window left to right in 3.4 s, passing behind the glass.
 - `chai`: steam rises from a small tumbler on the parapet end (reuse the `.steam` path style from `wish.css`), 3 wisps, 5 s.
 - `phone`: one dark window gets a cool white-blue glow (`#C9DDFF`, alpha 0.16) that flickers on for 2.2 s and off, the only cool light on the page.
 - `bulb`: one string-light bulb flickers irregularly for 1.6 s (3 flickers at most within 1 s: well under 3 per second).
 - `birds`: 5 tiny V-shaped silhouettes cross at 18 percent height, 7.5 s, only when `html[data-act="chhat"]` and tone at least 3.
 - `cat`: the existing cat gets an ear flick (400 ms) toward the pointer when it is within 120 px, plus one slow tail curl every 20 to 30 s. It never moves from its spot and never crosses the screen.
 - Static, always present (not counted as alive): a pair of chappal silhouettes at the doorstep edge of Act 1 and Act 6, and the kandil already in the scene.
2. Director rules, hard ("discoverable, not noisy"): none before 18 s on the page; at most 3 moments alive at once; mean gap 28 s with 12 s jitter; per-moment cooldown 150 s and at most 2 plays per page load each; pick by `html[data-act]` (doorstep: bulb; baithak: curtain, passer, chai; chhat: birds, phone, bulb; awaaz, aakhri: none; vidaai: curtain, passer); stop everything while a foreground interaction runs (guess, slider, compare, the pad, an overlay or sheet), while `document.hidden`, in Calm, and at quality `low`. Emit `moment:start {id}` and `moment:end {id}` for tests only; no UI counts them.
3. Each moment fades in and out over `--dur-m` (480 ms) so it is never a pop.
4. Lighting: moments that glow (curtain, phone, passer) report their window position through `bloom:set` at radius 40 and intensity 0.15 so E4's light respects them.

**Files likely touched:** `src/lib/homely.js` (new), `src/components/stage/SkylineLayer.jsx`, `src/components/stage/Terrace.jsx`, `src/styles/scene.css`, `src/lib/director.js` (register the pause conditions).

**Tiers and Calm:** High: all seven, 3 alive. Mid: curtain, passer, bulb, chai, 2 alive. Low: none animate; a static curtain and the chappals remain. Calm: all moments replaced by one static detail each (a drawn curtain, the lit window), no scheduler.

**Budget:** about 3.5 KB gzipped JS, 0.6 KB CSS. Each moment is one or two transforms on existing nodes: under 0.3 ms per frame; the scheduler is a single `setTimeout`.

**Verify:** Playwright with fake timers: advance 18 s and assert none played earlier; advance 10 minutes and assert never more than 3 `moment:start` without matching ends, no moment twice more than 2 times, none during an open overlay or the slider drag; assert every moment node has `aria-hidden="true"` and `pointer-events:none`; flicker count in any 1 s window at most 3. Screenshot during `curtain` and `passer`: a lit window with a swaying curtain and a faceless soft shadow, no clutter near text.

**Guardrails:** No people in detail, no deity or religious objects, no owls, the cat never crosses; nothing blocks or distracts a task.

---

### E6.7: Five little secrets (harmless, delightful, never required)

**The astonishment:** The reader who pokes at the sky is rewarded: a wink from the moon, a rocket in the shape of a rangoli, a purring cat, a toran that swings, a rangoli that redraws itself.

**Build:** New `src/lib/secrets.js` (one pointer router, 1.5 KB) wired from `Stage.jsx`. Nothing is labelled, listed or counted; each plays at most once per 20 s; none run during a foreground interaction. Each has a Calm version (opacity-only, 400 ms).

1. **Moon winks.** Trigger: three taps on the moon (`SkyLayer.jsx`, hit radius 28 px) within 2 s. Result: a thin cloud wisp drifts across it over 2.4 s and a tiny shooting star (one 60 px streak, 700 ms) crosses the sky above; no text. (Do not tie the moon to any observance.)
2. **Three-finger sky tap.** Trigger: three simultaneous touches on the sky area (`event.touches.length === 3` on the stage), desktop: Shift plus click on the sky. Result: one rocket rises from the skyline and bursts into a kolam-shaped radial burst (`makeKolam` dots as spark origins, 12 spokes), 2.4 s, using `fx:burst` kinds `rocket` then `spark` x48 (high) or x20 (mid).
3. **Hold the cat.** Trigger: press and hold the cat 1.2 s. Result: eyes slow-blink twice (two 280 ms lid closes), the tail curls, two faint concentric rings pulse at the cat once per 1.4 s while held, up to 4 pulses. No haptic (rule 7 allows haptics only on drags) and no sound.
4. **Pull the toran.** Trigger: drag any hanging marigold strand down at least 24 px and release (pointer events on `Toran` strands). Result: a damped pendulum swing (period 1.2 s, damping 0.55) that passes to neighbours at 0.5 amplitude per strand, plus 4 petals (`fx:burst` kind `petals`, count 4) falling and drifting.
5. **Double-tap a rangoli.** Trigger: double-tap or double-click the terrace rangoli (`Terrace.jsx`) or the card's rangoli area. Result: the pattern dissolves to dust over 600 ms and redraws as a new fold count (6, 8, 10 or 12) from a new seed in 1.6 s; on the card it re-rolls the art seed in `wishState`. Reuses `drawKolam`.
Emit `egg:found {id}` (tests only; nothing is stored or shown). Add an affordance that is not an instruction: the cat's ear-flick from E6.6 invites pokes. Eggs obey `fx:setQuality` and Calm.

**Files likely touched:** `src/lib/secrets.js` (new), `src/components/stage/Stage.jsx`, `SkyLayer.jsx`, `Terrace.jsx`, `src/lib/fx.js` (only to register a `kolamBurst` helper through existing kinds).

**Tiers and Calm:** High: all five as written. Mid: smaller particle counts, no shooting star. Low: moon wink and toran swing as CSS only; rocket and cat rings disabled. Calm: each result becomes a 400 ms opacity pulse of its target; the rangoli re-seed is instant.

**Budget:** about 2 KB gzipped JS, 0.2 KB CSS; particle caps follow `CAP` in `fx.js` (high 220, mid 120, low 40).

**Verify:** Playwright: dispatch the triggers and assert `egg:found` for each id; dispatch two in 20 s and assert the second is ignored; assert none fire while the slider is being dragged or the evidence drawer is open; assert no text, no storage writes. Screenshot mid-rocket: a radial 12-spoke burst above the skyline.

**Guardrails:** Harmless and silent; never a deity, never a cracker commentary, never required, never counted.

---

### E6.8: Lipi and Ink (script-correct card text, and the same craft in a neutral palette)

**The astonishment:** A Tamil, Kannada, Telugu, Bengali or Devanagari wish sits on the card with generous, correct line rhythm and no clipped marks, and a reader who does not celebrate gets the same craft in cream, grey and ink.

**Build:**
1. New `src/lib/script.js`: `dominantScript(text)` counts `\p{Script=...}` matches for Latin, Devanagari, Bengali, Gurmukhi, Gujarati, Tamil, Telugu, Kannada, Malayalam, Arabic and returns the winner. Table of starting metrics (design defaults to be calibrated, not facts): line-height and size scale Latin 1.32 / 1.00, Devanagari 1.55 / 0.94, Bengali 1.55 / 0.94, Gurmukhi 1.5 / 0.95, Gujarati 1.5 / 0.95, Tamil 1.5 / 0.92, Telugu 1.7 / 0.90, Kannada 1.7 / 0.90, Malayalam 1.65 / 0.88, Arabic 1.6 / 0.92. Calibrate by rendering a test line per script and measuring `actualBoundingBoxAscent/Descent`; the table must never clip a matra or a stacked conjunct.
2. In `cardRender.js` `fit()` and `drawText()`: use the table in place of the single 1.5 test; measure each line's ink box with `measureText` and centre the block by the union of ink boxes, not the em box; keep wrapping by `Intl.Segmenter` word then grapheme (already done). Force `ctx.letterSpacing = '0px'` for any non-Latin text (letter-spacing breaks conjuncts and ligatures); the brand header keeps its 8 px spacing because it is Latin. No uppercase transform on Indic. Set `ctx.lang` only for unambiguous scripts (`ta`, `te`, `kn`, `ml`, `gu`, `pa`) and leave it unset otherwise (Devanagari and Bengali script serve several languages and I will not guess).
3. Fonts: no web fonts (rule); keep the existing system stack in `cardRender.js` and make each script's stack explicit, so the candidates differ per script (Devanagari: Noto Serif Devanagari, Kohinoor Devanagari, Nirmala UI; Tamil: Noto Serif Tamil, Tamil Sangam MN, Nirmala UI; the same pattern for the others). Mixed lines (Roman Hinglish with Devanagari words) take the largest line-height of any script on the line.
4. Tofu probe: for each non-Latin script in the wish, compare `measureText` width of one sample character to that of `￿`; if equal on every character, the device has no font. Show a quiet line under the form (**[NEW LABEL]**, English only unless approved): `This device may not show this script on the card; the text share will still be exact.` The plain-text twin and the text share are always correct. Never translate or transliterate anything for the visitor.
5. Fix in `src/lib/rowhash.js` `sanitiseName`: it strips every non-letter, non-mark character, which removes U+200C ZWNJ and U+200D ZWJ that Malayalam, Bengali, Devanagari and Persian names need inside words. Allow U+200C/U+200D only between two letters or marks, never at either end, and keep the 20-grapheme cap.
6. Ink twin of every E6 moment, via `src/lib/palette.js` (`palette(inkFlag)` returns `{ core, glow, paper, accent }` and CSS vars): kolam lines cream-white `#FFF3DC` on charcoal `#16110C`, emboss in greys, flame in cream (no orange), lanterns as cream outlines with a soft white glow, homely moments in greys with the phone glow staying cool white, secrets unchanged in behaviour. The Ink card theme becomes: white paper, one embossed hairline frame, a grey embossed diya shape with a cream flame, layered sheets in 3 greys. Nothing in Ink is a flat fallback.
7. Respect rule is enforced by a test, not memory: `tests/never-shown.test.mjs` greps `src/` for the banned vocabulary list at the head of this pack (`owl`, `swastika`, `om `, `kalash`, `paduka`, `tilak`, `aarti`, `puja`, `deity`, `hamper`, `gift`) in identifiers, comments and strings, and fails the build on any hit.

**Files likely touched:** `src/lib/script.js` (new), `src/lib/palette.js` (new), `src/lib/cardRender.js`, `src/lib/rowhash.js`, `src/components/WishForm.jsx` (tofu line), `tests/script.test.mjs` (fixtures live in tests only, never on the page), `tests/never-shown.test.mjs`.

**Tiers and Calm:** The text path is the same at every tier (it is correctness, not an effect). Ink and Calm change palette and motion only. Calm shows the final card state; the plain-text twin always exists.

**Budget:** about 1.8 KB gzipped JS, 0.3 KB CSS. Measuring lines adds under 1 ms per redraw.

**Verify:** Node/Playwright fixtures in `tests/` only (test data, never shipped on the page): one short greeting per script in Devanagari, Tamil, Telugu, Kannada, Bengali, Malayalam, Gujarati, Gurmukhi; render each to a card and assert (a) no ink pixel touches the plate edge, (b) ink-box vertical margins are within 6 percent of each other, (c) wrapped line count at 140 graphemes is at most 7. Assert `sanitiseName('ന‍ഹ')` keeps the ZWJ between letters and `sanitiseName('‍ന')` drops it. Ink: screenshots of the card, pad and lantern sky in Ink must show clear depth and zero orange pixels (hue between 15 and 50 degrees below 0.5 percent).

**Guardrails:** No invented translations, no regional claims, nothing in the product tells a reader how or whether to celebrate.

---

## Risks and cut order

**Risks.** (1) The shared JS budget is tight: E6 adds about 27 KB gzipped and E8 must confirm the total stays under 200 KB. (2) The live canvas plus lantern sky plus homely scheduler can combine into too many effects at once: the effect budget in V3 PART F (max 3 simultaneous) wins, and E6.6 and E6.7 pause for any foreground interaction. (3) MP4 behaviour of MediaRecorder varies by browser and device encoder: feature-detect only, test on one real Android and one iPhone, and keep the PNG share as the guaranteed primary. (4) PNG size can exceed 300 KB after paper texture: the lean ladder must be checked per theme. (5) Drawing with a finger competes with page scroll: `touch-action: none` only on the pad and the diya handle, never on the card body. (6) The cultural items marked "not verified" above (GIF on WhatsApp, black-cat belief, footwear custom) must stay design cautions, never printed claims.

**Cut order (first to last).** GIF encoder in E6.4; `phone` and `passer` moments in E6.6; the cat-hold and moon-wink secrets (keep rangoli re-seed, toran pull, three-finger rocket); shadowBlur sheets and fibre tile in E6.3; the parallax layers of the lantern sky (keep one layer); drag-to-compose zones beyond top (keep spring physics and live flame); the drawing pad's Mirror toggle (keep presets). Never cut: E6.1 (engine, because presets power the accessible path), E6.4's PNG-first fallback, E6.8 (script correctness, the ZWJ fix and the Ink twin), the Calm still states, and the respect rule's test.


---

# PACK 8: PERFORMANCE, QA, MASTER PLAN AND LAUNCH (E8)

Position in this file: 8 of 8. Apply order: see the table at the top.

## Pack overview

- Elevates nothing visible by itself; it is the layer that lets packs 1 to 7 ship. It adds: a kill switch, a perf harness, a smarter quality governor with graceful dimming, rendering rules, a first-frame "first light" shell, Calm and flash parity checks, truth and privacy guards, and a visual-regression filmstrip. It also owns the ELEVATION MASTER PLAN, the CUT ORDER, the ROLLBACK procedure and the LAUNCH CHECKLIST (all after the prompts).
- Depends on: pack 2 (`src/lib/motion.js`, `html[data-act]`, `--act-progress`), pack 4 (`src/lib/lightEngine.js`, `bloom:set`, `html[data-gl]`), the existing `store.js` (quality, calm, ink), `ticker.js`, `quality.js`, `fx.js`, `director.js`, `scripts/check-build.mjs`.
- MEASURED TODAY (production build of the V3 branch snapshot, headless Chromium, 390x844, hasTouch, DSF 2, scripted scroll in 0.7-viewport steps, 700 ms per window): entry JS 357 KB raw / 119.8 KB gzip (single chunk, React included); CSS 64.9 KB raw / 15.6 KB gzip; 1,924 DOM nodes; 21 `infinite` CSS animations; only 2 `will-change` declarations; one `backdrop-filter` (`#topbar`, blur 6px over a .94 alpha background, so the blur is invisible and wasted); 2 `mix-blend-mode` users (`.pools i`, `.flame-glow`, high tier only).
- At 1x CPU: median 17 ms, p95 17 ms, zero dropped frames, 2 boot long tasks (71 and 166 ms), CLS 0, 0 console errors. At 4x CPU (a fair stand-in for a mid-range Android): 4 boot long tasks (262, 193, 69, 51 ms), p95 33 to 50 ms in 8 of 19 scroll windows (the lamp, row-breathes and lamp-6 zone, page y 2,950 to 5,300), CLS 0. At 1366x768 with 4x: p95 50 ms and max 67 ms across most of the page, only 26 to 34 of 42 expected frames per window. HONEST VERDICT: the V3 page already has no headroom at 4x on the lamp stretch, so elevation can only ship if (1) every new effect is registered with the governor and can be shed, (2) the "one foreground subject, one ambient layer, one transition" rule is enforced in code, and (3) the governor can also recover, because today it can only go down (`quality.js` `down()`; `fx.js` keeps its own `CAP` that duplicates `quality.js` `CAPS`).
- Pack-8 findings to fix on the way: `parallax.js` runs `querySelectorAll('[data-par]')` and a `dataset` read on every frame; `ticker.js` allocates `[...subs]` every frame; `fx.js` `anar` and `rocket` use `setInterval` (not the ticker, so they keep running when jank is worst); `fx.js` fills the whole canvas with `clearRect` every frame; `#topbar` has a pointless backdrop-filter; `director.js` adds the `wave` class with `setTimeout`. All are cheap to fix and are listed inside E8.4.
- Existing build guard budgets are JS 250 KB and CSS 40 KB gzip. The elevation contract is stricter on JS (200 KB) and looser on CSS (45 KB): E8.2 rewrites those two numbers.

---

### E8.1: Kill switch and self-heal (APPLY BEFORE PACK 2)

**The astonishment:** Invisible to the recruiter, which is the point: if any elevation misbehaves on their phone, the page quietly becomes the proven V3 night and never a broken one.

**Build:**
1. Tag the baseline now: `git tag -a v3-baseline -m "V3 as implemented, before elevation" && git push origin v3-baseline` (run after the cloud session's V3 merge is green on `npm run build && npm test`).
2. Create `src/elevation.js`:
   `export const ELEVATION = import.meta.env.VITE_ELEVATION !== '0';`
   `export const PERF = import.meta.env.VITE_PERF === '1';`
   Both are compile-time constants so Rollup deletes the dead branch and `VITE_ELEVATION=0 npm run build` yields a bundle with no elevation JS.
3. Every elevation module (`motion.js`, `lightEngine.js`, set-pieces, shell hand-off, governor v2) is imported ONLY from one file, `src/elev/index.js`, which exports `startElevation()`. `src/main.jsx` does: `import { ELEVATION } from './elevation.js'; if (ELEVATION) { const { startElevation } = await import('./elev/index.js'); startElevation(); }` placed after the first `render`. Pack authors add their own module to `startElevation()` and nowhere else.
4. Every elevation CSS rule is scoped under `html[data-elev="1"]` (pack 1 to 7 prompts: prefix their selectors). `startElevation()` sets `document.documentElement.dataset.elev = '1'` as its first statement; with the flag off the attribute is never set and the CSS is inert. Add `scripts/check-elev-scope.mjs` that parses `src/styles/elev/*.css` (new folder for all elevation CSS; the original seven files stay untouched) and fails if a top-level selector does not begin with `html[data-elev="1"]`, `:root[data-elev="1"]`, or `@keyframes`/`@property`/`@font-face`.
5. Runtime panic: in `startElevation()` wrap init of each module in try/catch; register `window.addEventListener('error', h)` and `'unhandledrejection'` for the first 5 s after init. If an error's stack contains `/elev/` or an elevation chunk name, call `disableElevation('error')`: set `dataset.elev = '0'`, call each module's `stop()` (every module must export `stop()` that removes listeners, cancels ticker subscriptions and clears canvas), and `document.getElementById('fx')` is re-cleared. The page then behaves exactly like V3 because all V3 code paths stay untouched.
6. Visitor-proof URL override for QA only: `?elev=0` forces off, `?elev=1` forces on; honoured only when `PERF` is true (perf build). Production ignores query strings.
7. Add npm scripts: `"build:v3": "VITE_ELEVATION=0 vite build && node scripts/check-build.mjs"`, `"build:perf": "VITE_PERF=1 vite build --outDir dist-perf"` (add `dist-perf/` to `.gitignore`).
8. Checkpoint contract: a build with the flag off must produce a `dist/` whose gzip JS is within 2 KB of the `v3-baseline` build. `scripts/check-build.mjs` prints "elevation: OFF" or "ON" (grep `data-elev` in the entry chunk) so the person knows which one they are about to ship.

**Files likely touched:** `src/elevation.js` (new), `src/elev/index.js` (new), `src/main.jsx`, `package.json`, `.gitignore`, `scripts/check-elev-scope.mjs` (new), `scripts/check-build.mjs`.

**Tiers and Calm:** not applicable; the flag is global. Calm remains a runtime visitor choice and is independent.

**Budget:** under 1 KB gzip JS, 0 CSS, 0 ms frame cost.

**Verify:** `npm run build:v3` then `node scripts/e2e/modes.mjs` and `smoke.mjs` pass and the page matches the `v3-baseline` screenshots within the E8.8 threshold; `npm run build` with the flag on shows `elevation: ON`; inject `throw new Error()` in an elevation module's init (temporary) and confirm the page keeps working and `dataset.elev === '0'` within 1 s.

**Guardrails:** The V3 files are never edited to "make room"; elevation attaches around them, so the flag can always revert it.

---

### E8.2: Performance harness, bundle gate and the per-effect cost table

**The astonishment:** Nothing the recruiter sees; it is why the 4x-slowed phone still reads as 60 fps cinema.

**Build:**
Add `scripts/perf.mjs` (Node, `playwright-core` as a devDependency; Chromium path from `process.env.CHROME_PATH` or the newest `~/.cache/ms-playwright/chromium-*/chrome-linux64/chrome`, args `['--no-sandbox','--enable-gpu-rasterization']`). It serves `dist-perf/` (built by `npm run build:perf`) with the tiny server pattern in `scripts/e2e/serve.mjs` (reuse it).
1. Matrix: viewports 390x844 (hasTouch, DSF 2) and 1366x768 (DSF 1); CPU rate via CDP `Emulation.setCPUThrottlingRate` at 1 and 4; forced tiers via `?q=high|mid|low` (perf build only; the governor reads it); modes normal, Calm (`emulateMedia reducedMotion:'reduce'`), Ink (click Menu > Look). Default run: 390x844 at 4x, tiers `high` and `mid`, normal and Calm. `--full` runs all.
2. Instrumentation injected with `addInitScript` BEFORE navigation: `PerformanceObserver` for `longtask` (buffered), `layout-shift` (CLS, ignoring `hadRecentInput`), `event` with `durationThreshold: 16` (INP: worst of pointerdown, pointerup, click, keydown), `largest-contentful-paint`, and one rAF loop storing `dt` into a preallocated `Float32Array(20000)`.
3. Act sweep: for each id in `['night','baithak','lamp-1','lamp-2','lamp-3','lamp-4','lamp-5','voice','lamp-6','verdict','wish','closure']` (skip ids that do not exist; log them), `el.scrollIntoView({behavior:'instant'})`, wait 500 ms, then capture 3 s: the first 1.2 s while calling `window.scrollBy(0, 160)` every 100 ms (transition frames), then 1.8 s idle. Interaction sweep: hold the diya 1.4 s; tap the 19 guess; drag the late-reply slider across its range in 24 steps; drag the compare handle; type 60 characters into the wish field and build the card.
4. Per window record frames, median, p95, p99, max `dt`, dropped% (dt over 25 ms), and jank score = sum(max(0, dt-16.7)) / duration. Write `perf/report-<timestamp>.json` and a Markdown table to stdout.
5. THRESHOLDS at 390x844, 4x CPU, tier `high` after the governor has settled (ignore the first 3 s): hard fail on any long task over 200 ms after t=4 s, INP over 250 ms, CLS over 0.05, any console error, any page error, any request whose URL host differs from the server. Frame metrics are RATCHETS because headless Chromium uses a software rasteriser (absolute numbers are pessimistic for GPU work): first run on the `v3-baseline` build writes `perf/baseline-v3.json`; elevated runs fail if median dt rises more than 20% or p95 more than 25% over that baseline in the same window, and WARN when p95 exceeds 34 ms or dropped% exceeds 8. `--strict` makes the warnings fail.
6. Per-effect cost table: in the perf build only, the E8.3 registry exposes `window.__perf.cost()` returning `[{id, kind, ms (EWMA per active frame), active%, shedCount}]`. After the sweep the script prints it sorted by `ms * active%` and flags any effect over 2.0 ms per active frame at 4x or any act whose registered effects sum over 8 ms. Commit the table as `perf/EFFECT_COST.md` after each pack.
7. Bundle gate in `scripts/check-build.mjs`: replace the two existing numbers: `if (js > 200 * 1024) fail`, `if (css > 45 * 1024) fail`; keep fonts at 90 KB; add `entryJs > 140 * 1024` fail (entry chunk only: read `dist/index.html` for the module script name), and warn at 85% of each budget. Print a per-chunk table. Add `build.rollupOptions.output.manualChunks: { react: ['react','react-dom'] }` in `vite.config.js` so React caches separately, and dynamic-import `cardRender.js`, `WishForm`, `EvidenceDrawer`, the WebGL module and the OffscreenCanvas worker so the entry stays small.
8. `"perf": "npm run build:perf && node scripts/perf.mjs"`.

**Files likely touched:** `scripts/perf.mjs` (new), `scripts/check-build.mjs`, `vite.config.js`, `package.json`, `perf/` (new, committed baseline and cost table).

**Tiers and Calm:** the harness measures both; Calm must show median dt at or below 17 ms at 4x (it should be near idle) and zero long tasks.

**Budget:** 0 shipped bytes (dev scripts only).

**Verify:** `npm run perf` completes in under 6 minutes, exits 0 on the baseline, exits 1 when a deliberate 300 ms busy loop is added to a click handler (INP gate) and when a 10 KB junk string is added to push JS over budget.

**Guardrails:** Nothing in the perf build may reach `dist/`; `check-build` greps `dist/` for `__perf` and `VITE_PERF` and fails.

---

### E8.3: Adaptive Quality v2, the effect registry, and the "graceful dimming" signature

**The astonishment:** When a phone struggles, the night does not stutter: the lamps behind the skyline burn a little lower, the sparks thin out, the stars still twinkle, and the reader only sees a slightly quieter, still-beautiful scene. When the phone recovers, the wick "catches" again.

**Build:**
Replace `src/lib/quality.js` (keep the exports `CAPS`, `DPR`, `startGovernor`; delete the duplicate `CAP` and `DPRC` in `fx.js` and import from the registry).
1. `src/lib/budget.js` exports `registerEffect({id, kind:'canvas'|'dom'|'gl', priority, minTier, ms})`, `shed(id)`, `restore(id)`, `isOn(id)`, `scale(id)` (0 to 1, eased) and `measure(id, fn)`. Each effect reads `scale(id)` to set its own count, DPR, or opacity. Kind budgets per frame at 60 fps (ms): canvas 4, DOM animation and style 3, WebGL 5; the sum of all three never above 9 ms so layout, paint and the browser keep the other 7.
2. SHEDDING ORDER (first shed to last; pack authors map their effects into these slots by `priority` 1 to 10): 1 WebGL bloom layer and any shader (fall back to CSS glow, `html[data-gl]` removed); 2 fireflies, petals, lantern drift (ambient particles); 3 pointer and tilt parallax; 4 `mix-blend-mode` glows (swap to plain opacity); 5 sky twinkle count (halve, then 6 stars); 6 string-light and window stagger waves (final states only); 7 cat, kandil sway, hairline shimmer; 8 canvas DPR (high 1.75 to 1.25 to 1); 9 particle cap (220 to 120 to 40); 10 flame flicker complexity (one CSS keyframe flame). NEVER shed: the lit or unlit state of any lamp, the diya flame itself, text, focus rings, interaction feedback, act transitions' END state.
3. Governor: frame `dt` EWMA with alpha 0.08 (`e += 0.08*(dt-e)`), plus a 120-frame ring for p95. Ignore the first 60 frames after boot, after `visibilitychange`, after `resize`/orientation, during the first 3 s after any act change and during `document.fonts` loading. SHED a step when e is above 21 ms for 45 consecutive frames AND ring p95 is above 33 ms. After a shed: cooldown 2.5 s, doubled for each shed in the last 60 s (2.5, 5, 10, 20, then hold 20). THERMAL BACKOFF: three sheds inside 30 s also drop the whole tier and lock restores for 25 s. RESTORE one step only after e is below 14.5 ms for 12 s continuously and no long task over 80 ms was seen in that time. FLAP GUARD: if a restored effect is shed again within 8 s, mark it `pinned` for the session (never restored again); at most 2 restores per effect. Never restore on `connection.saveData`, `prefers-reduced-data: reduce` or Calm.
4. Device hints at boot, no network: `deviceMemory` (at or below 2 start low, at or below 4 mid), `hardwareConcurrency` (at or below 4 mid, at or below 2 low), `matchMedia('(update: slow)')` low, DPR, `screen.width*screen.height*DPR²` above 5 MP start canvas DPR at 1.25, and a 30 ms idle micro-probe (`requestIdleCallback`, draw 300 pre-rendered sprites once, time it: under 1.5 ms high, under 4 ms mid, else low). The WebGL probe (E4) reads `WEBGL_debug_renderer_info` only to refuse software renderers (`/SwiftShader|llvmpipe|Software|Mali-4|Adreno \(?3/i`); the string is never stored or sent.
5. GRACEFUL DIMMING (signature): `shed(id)` never cuts. It writes `scale(id)` from 1 to 0 over 600 ms (`--ease-in-out-quint`), canvas effects thin their spawn rate over that time, DOM effects fade opacity; `restore(id)` ramps up over 900 ms with a 120 ms ease-in so it reads as a wick catching. A step is only performed while no pointer is down and no overlay animates (wait up to 1 s).
6. HUD, `?perf=1`, perf build only (`import.meta.env` gate, tree-shaken): a 120x56 px monospace chip bottom-left at 55% opacity, `pointer-events:none`, showing fps, EWMA, tier, active effects and the sparkline of 120 dt values in a 120x24 canvas; tap with three fingers or press `P` to expand to the full cost table. `window.__perf = { cost, state, force(tier), shed, restore }` is defined there only.
7. Unit test `tests/governor.test.mjs` (node:test): feed synthetic dt sequences (steady 33 ms, spike train, recovery after 12 s of 12 ms, a flapping device) and assert the step sequence: sheds, backoff doubling, restore, and a pinned effect after a flap.

**Files likely touched:** `src/lib/budget.js` (new), `src/lib/quality.js`, `src/lib/fx.js` (cap constants, `setInterval` to ticker), `src/lib/store.js` (`startQuality`), `src/lib/ticker.js`, `src/elev/perfhud.js` (new, perf build only), `tests/governor.test.mjs`.

**Tiers and Calm:** high = all effects at scale 1; mid = effects 1 to 3 pre-shed and DPR at most 1.5; low = effects 1 to 7 off, DPR 1, particle cap 40, one-keyframe flame. Calm: governor idle, canvas hidden, nothing animates, glows are still DOM halos (existing `glow()`).

**Budget:** about 3.5 KB gzip JS; the governor itself costs under 0.05 ms per frame; HUD is stripped from production.

**Verify:** unit test green; in the perf build, `__perf.force('low')` then screenshot at act 3 shows lamps, skyline windows and rangoli all intact; throttle 6x and confirm tier descends in order, never skipping an unshed lower slot, then un-throttle and confirm restores happen no sooner than 12 s later; the page never shows a one-frame pop (record a screencast and check max luminance step per frame stays under 4%).

**Guardrails:** Shedding only reduces decoration; no shed ever changes a lamp state, text, a number or a label.

---

### E8.4: Rendering rules and the cheap-frame cleanup

**The astonishment:** Scrolling between acts feels glued to the finger, with no hitch at the act boundary even on a 4x-slowed phone.

**Build:**
Apply these rules across `src/` and write them as a 20-line header in `src/styles/elev/README-rules.css` comments (not a separate doc).
1. LAYER DISCIPLINE: no permanent `will-change`. Add `src/lib/promote.js`: `promote(el, props='transform, opacity', ms)` sets `will-change` on `animationstart`/before a JS-driven transition and removes it on `animationend`/`transitionend` or after `ms + 100`. Pre-warm: 400 ms before an act boundary (listen to `stage:act` and an IntersectionObserver with `rootMargin: '60% 0px'`), promote ONLY the next act's two heaviest layers, release 800 ms after the transition. Remove permanent `will-change` from `.traveller` (lamps.css) and use `promote`. Maximum 6 promoted layers at once (count in HUD).
2. CONTAINMENT: add `contain: layout paint style` to every self-contained scene block (`#lamp-1` ... `#lamp-5`, `#voice`, `#verdict`, `#wish` inner cards, `.card`), `contain: strict` to `#fx`, `#fx-glows`, `#stage` children that have fixed size. Add `content-visibility: auto; contain-intrinsic-size: auto 100svh` to `#voice`, `#verdict`, `#wish`, `#closure`, and to evidence drawer folders; NEVER on `#night`, `#baithak`, or any element a hash link can jump to before it renders (use `contain-intrinsic-size` equal to the real min-height to avoid CLS).
3. KILL WASTED COST: delete the `#topbar` `backdrop-filter` (the .94 alpha is already opaque enough); keep `mix-blend-mode` to high tier only (already); cap `box-shadow` blur at 24 px; no `filter: blur()` on elements larger than 20% of the viewport; glows are pre-rendered radial gradients, never animated blur.
4. OFFSCREEN ANIMATION: pause every `infinite` CSS animation outside the viewport: one IntersectionObserver (`rootMargin: '10% 0'`) toggles `data-off="1"` on `[data-anim]` sections, and CSS `[data-off="1"] * { animation-play-state: paused !important; }` (21 infinite animations today). Pause everything when `document.hidden` via `html[data-hidden="1"]`.
5. ONE rAF: all JS motion goes through `ticker.js`. Convert `fx.js` `anar`, `chakri` and `rocket` from `setInterval` to ticker subscriptions with an accumulator; remove the `[...subs]` spread (iterate a frozen array swapped on add/remove); cache `parallax.js` `[data-par]` nodes and factors once (refresh on `stage:act`); replace `director.js` `setTimeout` wave toggles with `animationend`.
6. NO LAYOUT THRASH: read-then-write batches only. Forbidden in animated code: `offsetWidth`, `getBoundingClientRect`, `getComputedStyle` inside a ticker callback; cache rects on `resize` and `stage:act`. Animate only `transform`, `opacity`, `clip-path` (and `stroke-dashoffset`). Write per-frame values with `el.style.setProperty` on ONE root (`--act-progress`, `--lx`) rather than per-element style writes. Add `scripts/lint-render.mjs` (regex lint, fails the build): `getBoundingClientRect|offsetWidth|offsetHeight|getComputedStyle` inside files under `src/elev/` outside `onResize`/`measure` function names; `addEventListener('(touchstart|touchmove|wheel|scroll)'` without `{passive:true}`; `will-change` in any CSS other than inside `.promoted`; `setInterval(` in `src/lib` or `src/elev`; `new Audio|AudioContext`.
7. OFFSCREENCANVAS WORKER (high tier only, feature-detected): if `'OffscreenCanvas' in self && HTMLCanvasElement.prototype.transferControlToOffscreen` and `deviceMemory >= 4`, move the `fx.js` particle simulation and draw to `src/workers/fx.worker.js` (built by Vite as `new Worker(new URL(...), {type:'module'})`, a same-origin file, allowed by CSP `script-src 'self'` and `worker-src` falls back to it; add `worker-src 'self'` to the CSP string in `vite.config.js`). Main thread sends spawn commands over `postMessage` with transferable `Float32Array`s; the worker owns `requestAnimationFrame`. Fall back to the current in-thread engine on any failure or when `?worker=0`. Keep ONE code path for the simulation (shared module imported by both).
8. SPRITE ATLAS: `fx.js` builds 7 glow sprites, 6 petals and a lantern as separate canvases; build ONE 256x128 atlas canvas at boot and `drawImage` sub-rects (fewer texture binds in the GPU raster path). Sprites are generated in code; no image files.
9. FONT STRATEGY: system stack only for everything except an optional single OFL display face (max 40 KB woff2, subset to Latin plus the Devanagari digits only if used) loaded with `font-display: swap` and a size-adjusted fallback (`size-adjust`, `ascent-override`) so the swap causes zero CLS; preload only that one file.

**Files likely touched:** `src/lib/promote.js` (new), `src/lib/fx.js`, `src/lib/ticker.js`, `src/lib/parallax.js`, `src/lib/director.js`, `src/workers/fx.worker.js` (new), `src/styles/lamps.css`, `src/styles/story.css`, `src/styles/elev/*.css`, `vite.config.js`, `scripts/lint-render.mjs` (new).

**Tiers and Calm:** worker and atlas on high only; promotion limits 6 / 4 / 2 layers for high / mid / low; Calm removes the canvas entirely and every `will-change`.

**Budget:** about 3 KB gzip JS (worker bundle separate, lazy), under 1 KB CSS; saves an estimated 3 to 6 ms per frame on the lamp stretch at 4x (remeasure with E8.2).

**Verify:** `node scripts/lint-render.mjs` exits 0; `npm run perf` shows p95 in the lamp stretch (y 2,950 to 5,300) at or below the baseline of 33 ms; CDP `Animation.enable` shows no running CSS animation for sections more than 1 viewport away; Chrome layer count in the HUD never above 6; CLS still at or below 0.02.

**Guardrails:** Remove effects before content; if a rule changes how something looks, pack 1 art direction wins and the rule yields.

---

### E8.5: "First light": the shell that is already a lit diya (signature moment)

**The astonishment:** Before React has loaded, before the JavaScript has even parsed, the reader on a slow phone already sees a dark terrace with one small clay diya and a steady flame. The page is a lit lamp from the first byte, and the opening then grows out of that same flame with no flash and no flicker of white.

**Build:**
1. Edit `index.html` (outside React): inside `<body>` before `<div id="root">` add `<div id="shell" aria-hidden="true">` containing an inline SVG, viewBox `0 0 120 120`, centred at 56% of the viewport height: a clay diya (the same two path commands as `public/favicon.svg` so it matches the favicon exactly), a three-layer teardrop flame (`#FF7A1A`, `#FFB347`, `#FFD27A`), a radial-gradient halo 160 px (`rgba(255,179,71,.35)` to transparent), and a hairline dark ground gradient `#0A0705` to `#16110C`. Total inline markup under 1.4 KB. CSS in the existing `<style>` tag in `<head>` (CSP already allows inline styles): flame `animation: flick 2.6s ease-in-out infinite` using `transform: scale(1, var) rotate()` and halo `opacity` between .75 and 1 (only compositor properties); `@media (prefers-reduced-motion: reduce)` removes the animation (steady flame, still beautiful). `#shell` is `position: fixed; inset: 0; z-index: 1; display:grid; place-items:center;` with `background: #0A0705`.
2. The shell must contain no text and no number (no claim leaks before React); the noscript block stays, restyled to sit under the diya.
3. Hand-off: `src/main.jsx` renders as today; after the first `requestAnimationFrame` following mount AND when pack 3's opening reports ready (`window.dispatchEvent(new CustomEvent('cue:play', {detail:{name:'shell:handoff'}}))` is what pack 3 listens to; if pack 3 has not defined it, fall back to 2 rAFs after mount) set `html[data-ready="1"]`. CSS: `html[data-ready="1"] #shell { opacity: 0; transition: opacity var(--dur-m) var(--ease-out-expo); pointer-events: none; }`; remove the node on `transitionend` (and after a 1.5 s timeout). The opening's host diya in `Lamp.jsx` is positioned within 2 px of the shell diya at the common phone viewport (390x844 and 360x640) so the flame appears not to move; measure and tune the shell offset constants with a Playwright script that compares the two flame tips' bounding boxes and fails above 3 px.
4. Boot budget: set `<link rel="modulepreload">` for the entry chunk (Vite emits it), nothing else; `<meta name="theme-color" content="#0A0705">` stays; add `<meta name="color-scheme" content="dark">` (already). Entry JS at most 140 KB gzip (E8.2 gate); target at 4x CPU and no network throttle: shell visible at first contentful paint (FCP) at most 900 ms, hold-to-light interactive at most 2.5 s, no boot long task over 250 ms (today 262 ms: split with dynamic imports and `scheduler.yield()` or `setTimeout(0)` between `initRow()`, `startElevation()`, `startDirector()`).
5. IMAGE-FREE OG PREVIEW: keep `scripts/make-og.mjs` generating `dist/og.png` from SVG at build (nothing committed); restyle its SVG with the elevated palette from pack 1 (same diya geometry as the shell, a warmer halo, four lit lamps and one dashed lamp) and keep the text lines exactly as the V3 `site.og` copy (the script reads `copy.json`). Output at most 120 KB (use `sharp`-free local render as today; if the PNG is above 120 KB reduce to 8-bit palette). Add `<meta property="og:image:alt">` from copy (exists). Verify the share preview by fetching `dist/og.png` dimensions 1200x630.
6. Bonus (OPTIONAL, mark NEW MICRO-LABEL, needs Shriniwas's approval): a build-stamped, quiet line in the Menu sheet: "Drawn in code: 0 images, 0 trackers. {gzip KB} KB." where the number is injected by Vite `define` from the measured build, so it is never hand-typed. This is a fact about the build, not about authorship, and sits under the V3 footer gate; if unapproved leave it out.

**Files likely touched:** `index.html`, `src/main.jsx`, `src/components/Lamp.jsx` (position check only), `src/styles/elev/shell.css` (or inline in `index.html`), `scripts/make-og.mjs`, `scripts/check-shell-align.mjs` (new).

**Tiers and Calm:** the shell's flicker is a single compositor-only animation on all tiers; Calm or reduced motion gets the still flame and halo (no animation), then cross-fades in 240 ms (no cross-fade at all under `prefers-reduced-motion`: instant swap).

**Budget:** about 1.4 KB inline HTML plus 0.5 KB inline CSS (counted in the HTML, not in the JS or CSS gate); frame cost near zero.

**Verify:** with JS disabled (`javaScriptEnabled:false`) the screenshot shows the lit diya plus the noscript sentence (no blank page); with JS on and a 4x throttle, a screenshot at 300 ms shows the shell and at 3 s shows the opening with no white frame in a 60-frame screencast (min frame luminance above 2%); flame-tip offset at most 3 px at 390x844 and 360x640.

**Guardrails:** No text, number or claim in the shell; no extra request; no inline script (CSP forbids it).

---

### E8.6: Calm parity, flash guard and accessibility on lit surfaces

**The astonishment:** The reader who chose Calm, or whose phone says reduced motion, gets a page that is not a lesser page: every moment has a finished, glowing still frame, so they feel the same night at rest.

**Build:**
1. REGISTRY-DRIVEN PARITY: extend `src/lib/budget.js` `registerEffect` with a required `still` field: a short string naming the still equivalent (for example `"rangoli drawn, lamps lit"`, `"static halo"`). `scripts/check-parity.mjs` imports the registry in the perf build (`window.__perf.registry()`), fails if any effect lacks `still`, then runs in a real browser: for each act id, set Calm via `emulateMedia({reducedMotion:'reduce'})` and again via the Calm button, scroll to the act, wait 600 ms, and assert (a) `document.getAnimations().filter(a => a.playState==='running').length === 0` (allow the `diya-shell` flame to be absent: Calm shows still), (b) the canvas `#fx` has `visibility:hidden`, (c) no `requestAnimationFrame` subscription is live (`ticker.size === 0`), (d) the screenshot is NOT blank: mean luminance of the viewport above 4%, at least 3 distinct hue buckets, and at least 1,500 non-background pixels in the lit zone (so each act has its glow), (e) every act's `data-act` is set, (f) every interactive control is still operable. Save Calm screenshots to `shots/calm/`.
2. FLASH GUARD, runtime: in `lightEngine.js` (pack 4) every `bloom:set` passes through `flashLimiter(i)`: at most 3 rising edges above a 0.25 intensity step in any sliding 1000 ms, full-screen luminance step at most 0.06 per 100 ms, and any single bright element changes by at most 0.35 opacity per 100 ms. Over budget requests are slewed, not dropped. Light-all and the AWE-5 flame run are the stress cases.
3. FLASH GUARD, test: `scripts/check-flash.mjs` uses CDP `Page.startScreencast` (jpeg, quality 40, `maxWidth: 192`, every frame), decodes with `jpeg-js` (devDependency), computes relative luminance (sRGB to linear, 0.2126R+0.7152G+0.0722B) per frame, and applies the WCAG 2.3.1 general-flash rule: a flash is a pair of opposite luminance changes of at least 0.10 (the darker state under 0.80) over at least 25% of a 10 degree field, taken here as 2.8% of the frame area; fail if more than 3 flashes occur in any 1 s window, or if any single frame step changes more than 20% of the frame by more than 0.20 luminance. Also fail on a saturated-red flash pair (R/(R+G+B) at or above 0.8 over the same area). Recorded sequences: boot, hold diya, light all, all-lit finale, fireworks beat, wish card build, Ink toggle, Calm toggle.
4. CONTRAST ON LIT SURFACES (`scripts/check-contrast.mjs`, extends the existing `audit.mjs` approach): for each visible text node at tones 0, 3 and 6 and in Ink and Calm and in each act: read computed color and font size/weight, hide the text (`color: transparent; text-shadow: none`), screenshot the element box, take the WORST background pixel (lightest for light text), compute the ratio, require at least 4.5 (at least 3.0 when 24 px or 18.66 px bold). Report any element under threshold with its selector and the act. This is how you catch bloom, rangoli and window glow washing out body copy.
5. KEYBOARD AND SCREEN READER SWEEP (`scripts/check-a11y.mjs`): Tab through the whole page, assert the focus order follows visual order, every focus ring has at least 3:1 against the local background, no keyboard trap (Escape closes every overlay and returns focus to the opener), hold-to-light has a keyboard path (Enter or Space), every `canvas` is `aria-hidden` or has `role="img"` plus a label, each act exposes a heading, `aria-live` announcements exist for lamp lit and for the wish card (read `src/lib/announce.js`), tap targets at least 44x44 CSS px, `html[lang]` correct, `axe-core` (devDependency) at zero serious or critical violations on every act in normal, Calm and Ink. Read the accessibility tree via `page.accessibility.snapshot()` and fail on empty-name buttons.

**Files likely touched:** `src/lib/budget.js`, `src/lib/lightEngine.js` (limiter), `scripts/check-parity.mjs`, `scripts/check-flash.mjs`, `scripts/check-contrast.mjs`, `scripts/check-a11y.mjs` (all new), `package.json` (`jpeg-js`, `axe-core` dev deps).

**Tiers and Calm:** checks run in all three tiers and in Calm; the Calm definition is the acceptance test for the whole elevation: finished, glowing, readable, nothing moving.

**Budget:** limiter about 0.3 KB gzip; no frame cost; all checks are dev-time.

**Verify:** all four scripts exit 0; a deliberate 6 Hz full-screen white pulse in a scratch effect makes `check-flash` fail; a deliberate `opacity:.2` body text on a lit window makes `check-contrast` fail.

**Guardrails:** Calm and `prefers-reduced-motion` never mean "blank": a missing still equivalent is a build failure.

---

### E8.7: Truth and privacy guard (elevation can never regress the rules)

**The astonishment:** Invisible to the reader; it protects them from a page that says anything untrue, stores anything, or phones anywhere.

**Build:**
Extend `scripts/check-build.mjs` (keep its existing checks 1 to 6) with a new section "7. elevation proofs", all failing the build:
1. NETWORK: the production `dist/` contains no `fetch(` call that is reachable (strip comments; today `fetch(` is already in `BAN` for `src`), no `XMLHttpRequest`, `WebSocket`, `EventSource`, `sendBeacon`, `navigator.connection` writes, `importScripts` to an absolute URL, no `<link rel=preload|prefetch|preconnect|dns-prefetch>` with a host, no `@import`, no `url(http`, no `//cdn`. Allowed hosts stay exactly the existing `ALLOWED_LIB` and `ALLOWED_OUT` (outbound only on a visitor's tap). `worker-src 'self'` is the only CSP change allowed; assert the CSP string equals the expected constant otherwise.
2. STORAGE: no `localStorage`, `sessionStorage`, `indexedDB`, `document.cookie`, `caches.open`, `navigator.storage`, `serviceWorker.register`, `cookieStore`, `BroadcastChannel`; for dist the checks are no longer "warn only" for the elevation chunks (`/assets/*elev*`) and for any file under `dist/assets/workers/`.
3. AUDIO: fail on `new Audio`, `<audio`, `AudioContext`, `webkitAudioContext`, `createOscillator`, `speechSynthesis`, `.mp3|.wav|.ogg|.m4a` and `navigator.vibrate` outside `src/lib/haptic.js` (vibration stays allowed only there, user-driven drags on Android).
4. TRUTH STRINGS: "Spoken with Wispr Flow" exactly 2 occurrences in dist JS (exists) and 0 in CSS/HTML; `held-out` numbers regexes from the existing `FORBID` list stay; ADD: no festival date (regex for `(8|9|10|11)\s*(Nov|November)` and `Nov(ember)?\s*(8|9)` and `\b2026-11-0[5-9]\b`, except the sign-off swap constant, which must appear only as a code constant inside a file named `signoff.js` and be a numeric `Date` argument, never a string in copy); no `Diwali` (spell "Deepavali", existing); no deity or religious terms: `/\b(Lakshmi|Laxmi|Ganesh|Ganesha|Krishna|Rama|Hanuman|Durga|Kali|Shiva|Vishnu|puja|pooja|aarti|arti|mantra|shloka|bhajan|prasad|blessing|blessed|goddess|god\b|deity|ashirwad|aashirvaad|havan|yagna)\b/i` in `copy.json`, JS strings and CSS content (the existing GIFT check becomes a hard fail for `gift|hamper|bonus`; allow the Advaita Vedanta phrase from V3 `person` copy through an explicit allowlist entry keyed by exact string so any new occurrence still fails); no `crackers`, `pollution`, `smog`, `ban` commentary words; no growth claims: fail on `/\b(grew|growth of|increased|boosted|doubled|tripled)\b/i` and `\d+\s?%` unless the string is in a copy allowlist file `scripts/claims-allowlist.json` that lists the exact existing V3 sentences (generated once from the `v3-baseline` tag; any new match fails and must be reviewed by a human).
5. COPY DIFF: `scripts/check-copy-frozen.mjs` hashes every string in `src/data/copy.json` (sha1 per JSON path) and compares to `scripts/copy.lock.json` generated from `v3-baseline`; ANY changed or added visible string fails unless the path is listed in `scripts/copy-approved.json` (the new micro-labels from packs 1 to 7, each marked NEW MICRO-LABEL, are added there by a human after review). Elevation changes visuals only; this is the proof.
6. DEBUG STRIPPING: dist has no `__perf`, `perfhud`, `?perf`, `VITE_PERF`, `devpanel`, `__ek`, `__fx`, `console.log` (warn on `console.warn`, fail on `console.log`), `debugger`, `sourceMappingURL`.
7. FONTS AND ASSETS: no files in `dist/` of type png/jpg/webp/avif/gif/mp4/webm/mp3 except `og.png` (at most 120 KB); fonts at most 90 KB total and each with an SIL OFL line recorded in `docs/FONTS.md` (checked by file existence plus string "OFL"); nothing referencing `fonts.googleapis`.
8. FLAG ECHO: the check prints `elevation: ON|OFF`, JS and CSS gzip totals, the number of effects registered, and the three truth counts, so the person sees them at every build.

**Files likely touched:** `scripts/check-build.mjs`, `scripts/check-copy-frozen.mjs` (new), `scripts/copy.lock.json` (generated), `scripts/copy-approved.json` (new), `scripts/claims-allowlist.json` (new), `package.json` (`"build"` already chains `check-build`; add the copy-frozen script to `"check"`).

**Tiers and Calm:** not applicable.

**Budget:** none shipped.

**Verify:** inject each banned item into a scratch module one at a time (an `Audio` constructor, a `localStorage` call, "Lakshmi", "40.62x", "8 November", a third "Spoken with Wispr Flow", a `fetch('https://x')`, a PNG in `public/`) and confirm `npm run build` fails each with a readable message; revert and confirm clean.

**Guardrails:** The guard may only get stricter; weakening a regex needs the person's explicit say-so recorded in the commit message.

---

### E8.8: Visual regression, filmstrips and the five-minute rubric

**The astonishment:** The person can scan twelve screens by eye in five minutes and know the elevated night is whole, and a bad change can never slip past unseen.

**Build:**
`scripts/filmstrip.mjs` (Playwright via `playwright-core`; `pngjs` and `pixelmatch` devDependencies, both pure JS) against `dist/`:
1. VIEWPORTS: 390x844, 360x640, 412x915, 768x1024, 1366x768, 1920x1080 (DSF 2 for the first three, 1 for the rest, `hasTouch` for the first four). Modes: normal, Calm, Ink.
2. FILMSTRIP PER ACT: for `doorstep`, `baithak`, `chhat` (lamps 2 to 5), `awaaz`, `aakhri`, `vidaai` capture at t = 0, 300, 700, 1,200 and 2,500 ms after the act's `stage:act` event (the harness listens for the event, then uses `page.screenshot` at the timestamps; set the CSS clock steady by `Emulation.setVirtualTimePolicy` NOT used: use real time at 1x CPU for fidelity). KEY INTERACTIONS: hold diya (progress 0, 50%, lit, +600 ms), guess-19 reveal, late-reply slider at 2 s and 5 s original and corrected, phuljhadi lamp 3 (burn, steady diya), compare handle at 0, 50, 100%, lamp 6 press, light-all (0, 400, 1,200, 3,000 ms), wish card result, closure. Output a contact sheet per viewport: one PNG tiling the frames in order at 25% scale with the act name in the margin (draw the label with a tiny SVG-to-PNG step or `page.setContent` plus screenshot; no fonts needed beyond system).
3. BASELINES: `shots/baseline/<viewport>/<mode>/<name>.png` committed only for the final elevated build (`--update-baseline` after the person approves) plus `shots/v3/` captured from the `v3-baseline` tag build for comparison. Diff with `pixelmatch` threshold 0.12 per pixel; a frame FAILS when more than 1.5% of pixels differ for still states (act end states, Calm) and is only reported (never failed) for mid-transition frames; mask regions known to be nondeterministic with CSS `[data-test-mask]` (particles, twinkle) by hiding them via `addStyleTag` (`visibility:hidden`) when `--mask`. Fix randomness: `addInitScript` replaces `Math.random` with a seeded LCG (seed 0xE1D1A) so particle layouts, stars and windows repeat; replace `performance.now` pacing only for stills.
4. AUTOMATIC SANITY (each screenshot): not blank (mean luminance above 3%), no horizontal scroll (`documentElement.scrollWidth <= innerWidth`), no element wider than the viewport, no text clipped (`scrollWidth > clientWidth` on text blocks), no overlap of the topbar with the first headline, the thumb zone (bottom 28% on phones) holds at most one primary control.
5. REPORT: `shots/report.html` is a single static page (inline CSS, relative image paths, no JS needed) listing the contact sheets and diff counts; open it locally.
6. THE FIVE-MINUTE RUBRIC (print it at the top of `report.html`, 12 items, 25 seconds each): (1) first frame is dark, one lit diya, six objects or fewer; (2) 324 then 19 reads in under 3 s; (3) every act has exactly one hero subject; (4) the transition frames show light moving, not elements popping; (5) body text is readable on every lit surface; (6) no two controls of equal weight; (7) lamps, flame and halos agree on warm colour (no pure white, no cold blue lights); (8) Ink looks deliberate, not broken; (9) Calm is finished and glowing, never blank; (10) 360x640 has no cut-off control; (11) 1920x1080 does not look stretched or empty; (12) the final frame leaves the reader with the lit row and one question. A frame fails the rubric on any "no".

**Files likely touched:** `scripts/filmstrip.mjs` (new), `package.json`, `.gitignore` (`shots/report.html`, keep `shots/baseline` committed).

**Tiers and Calm:** captured in tier `high` and `low` (forced `?q=` in a perf build run) at 390x844, plus Calm and Ink at all viewports.

**Budget:** none shipped; full run under 12 minutes.

**Verify:** two consecutive runs on the same build produce zero failing stills (determinism); a deliberate 12 px layout shift in `Verdict.jsx` fails exactly the verdict frames; `report.html` opens with no console errors.

**Guardrails:** Baselines are updated only after the person has looked at the contact sheets.

---

## ELEVATION MASTER PLAN (owned by E8)

Assumption: submission closes 4 November 2026 (no hour published; V3 brief says treat tonight as the deadline). Everything below is in hours before the SUBMIT moment (T = the minute you press send). If you have less than 14 hours in total, do only steps 0, 1, 2 and the cut-order "keep" list.

### Order and checkpoints

Step 0 (T-minus start, 20 min): confirm V3 is merged and green; run `npm ci && npm run build && npm test && npm run check`; tag `v3-baseline`; apply **E8.1** (kill switch); `npm run build:v3` equals baseline; apply E8.2 (harness) and RECORD `perf/baseline-v3.json` and `shots/v3/` from the baseline BEFORE any elevation code exists.

Then apply packs in this order. After EACH pack run the checkpoint block and tag on success.

1. Pack 2 Motion system (tokens, `motion.js`, `html[data-act]`, `--act-progress`, `stage:act`). Tag `elev-p2`.
2. Pack 1 Art direction. Tag `elev-p1`.
3. Pack 4 Light and fire (`lightEngine.js`, `bloom:set`; the WebGL layer LAST inside this pack). Tag `elev-p4`.
4. E8.3 governor v2 and E8.4 rendering rules NOW (between packs 4 and 3), because packs 3, 5, 7 add effects and every one must register with the governor from day one. Tag `elev-g`.
5. Pack 3 Opening, together with E8.5 first-light shell. Tag `elev-p3`.
6. Pack 5 Set-pieces. Tag `elev-p5`.
7. Pack 7 Interaction and navigation. Tag `elev-p7`.
8. Pack 6 Culture and wish. Tag `elev-p6`.
9. Pack 8 remainder: E8.6, E8.7, E8.8 (the guards can be written early, but they are run as the final gate). Tag `elev-p8`.

CHECKPOINT BLOCK (every pack, about 8 minutes; stop and fix before the next pack if anything fails):
```
npm run build            # runs vite build, make-og, check-build (budgets and truth guard)
npm test && node scripts/check-copy.mjs
node scripts/lint-render.mjs && node scripts/check-elev-scope.mjs
npm run perf             # 390x844 at 4x, tiers high and mid, normal and Calm
node scripts/filmstrip.mjs --viewports 390x844 --modes normal,calm
git tag -f elev-pN && git push origin elev-pN
```
Accept a pack only if: build clean; perf hard gates pass and p95 per act is within +25% of baseline (or at most 34 ms); the cost table shows the pack's effects under 2.0 ms per active frame; Calm filmstrip is not blank; you looked at the 390x844 contact sheet for five minutes with the rubric.

### Clock (relative to submission)

- T-14h to T-6h: pack work (packs 2, 1, 4, g, 3, 5, 7, 6). Budget about 60 to 75 minutes per pack including the checkpoint.
- T-6h: FEATURE FREEZE. From here only bug fixes, performance shedding and copy-approved changes. Nothing new enters.
- T-5h to T-3h: E8.6, E8.7, E8.8 final gates, full matrix `node scripts/perf.mjs --full`, `node scripts/filmstrip.mjs` at all six viewports, fix list.
- T-3h: real-device pass (see Launch checklist). Decide ELEVATION ON or OFF using the rule below.
- T-90min: HARD CODE FREEZE. Tag `release-candidate`, build, deploy to a preview URL, run the launch checklist.
- T-45min: submit window opens; no code changes after this; only the URL, the video and the form.

### Kill switch decision rule (the person decides in 60 seconds)

Ship ELEVATION ON only if all are true: `npm run build` clean; `perf` hard gates pass; the real mid-range Android (or Chrome DevTools at 4x with Moto G Power profile) shows the opening and lamp 3 smoothly with no visible stutter during a 30 s hand-test; Calm screenshots are finished; Ink is intact; the rubric has no "no". Otherwise ship `npm run build:v3` (flag `VITE_ELEVATION=0`), which is the proven V3 with no elevation code in the bundle. A partial pack can also be turned off by removing its line from `startElevation()` (every module exports `stop()` and every CSS rule is scoped under `html[data-elev="1"]`, so deleting the call leaves V3 behaviour).

### CUT ORDER across ALL packs (cut from the top until it fits the time or the budget)

1. First cut: the optional WebGL layer and every shader (pack 4); the OffscreenCanvas worker (E8.4 item 7); the three-finger HUD expansion; the build-stamped "Drawn in code" line (E8.5 item 6).
2. Ambient richness: fireflies, petals, lantern drift, kandil sway, cat animation, sky twinkle (packs 1, 5, 6), pointer and tilt parallax (pack 7), the skyline "windows warm in clusters" stagger (pack 4).
3. Set-piece polish: extra firework shapes, the AWE-5 lantern rise, the phuljhadi sparks beyond the steady diya (pack 5); fancy overlay transitions (pack 7); custom cursor or any shared-element transitions.
4. Opening choreography beyond the 4-beat headline and one ember arc (pack 3), keeping the E8.5 shell.
5. Art direction extras (grain, vignette animation, secondary textures) while keeping the palette, type and layout.
6. LAST to cut, and only in a real emergency: motion tokens and act cues (pack 2), the governor (E8.3).
NEVER CUT (the floor): the kill switch (E8.1); the truth and privacy guard (E8.7); Calm and reduced-motion parity (E8.6); the first-light shell (E8.5); the "324 tests, then 19" moment and the hold-to-light opening with a still fallback; AA contrast; keyboard operability; the 4-lamp-minimum final state where lit lamps look warm; the verdict, wish and closure copy exactly as V3 words them; the budget gates (200 KB JS, 45 KB CSS); the no-audio, no-storage, no-third-party rules.

### Rollback procedure

- Tags: `v3-baseline` (known good V3), `elev-g`, `elev-p1` to `elev-p8` (each pack accepted), `release-candidate`, `submitted`.
- A single pack misbehaves: `git revert --no-edit <commit range of the pack>` or remove its line from `startElevation()` and its file under `src/styles/elev/` from the imports; rebuild, rerun the checkpoint block.
- Several packs misbehave or time is short: `VITE_ELEVATION=0 npm run build` (identical to `v3-baseline` within 2 KB gzip, E8.1 item 8), redeploy.
- Everything is wrong: `git checkout v3-baseline -- . && npm ci && npm run build` and deploy; then continue on a branch.
- Deploy hygiene: deploy previews on a separate URL first; keep the previous production folder zipped (`dist-prev.zip`) so the host can be reverted in under 2 minutes; the submitted URL never changes, only the deployed folder.

---

## LAUNCH CHECKLIST (elevated site; order matters)

1. Build and gates: `npm ci && npm run build && npm test && node scripts/check-copy.mjs && node scripts/check-copy-frozen.mjs && node scripts/lint-render.mjs && node scripts/check-parity.mjs && node scripts/check-flash.mjs && node scripts/check-contrast.mjs && node scripts/check-a11y.mjs && npm run perf && node scripts/filmstrip.mjs`. All exit 0. Note the printed JS and CSS gzip sizes.
2. Incognito mobile test on a REAL phone (Android Chrome, plus iPhone Safari if possible): open the live URL in a private tab on mobile data (not Wi-Fi); first lit diya within 1 s; hold-to-light works one-handed; scroll the whole page once at normal speed, then once fast; rotate to landscape and back; toggle Calm; toggle Ink; the browser's "Add to Home Screen" is not required. Chrome DevTools Remote Debugging: Performance panel, 6x CPU slowdown once, and check "Layers" shows at most 6 promoted layers.
3. Network proof: DevTools Network tab with "Disable cache": only `index.html`, one or two JS chunks, one CSS file, favicon, and optionally `og.png` (the latter is requested only by crawlers). Zero third-party hosts. Application tab: storage, cookies, service workers, IndexedDB all empty after a full session.
4. Link checks: every outbound link opens (résumé, evidence, GitHub repos, the Wispr pages in V3 PART F that were flagged to verify), `mailto`/Gmail/Outlook invite fallbacks, `#sixty`, `#evidence/c3`, `#wish`, `#v1.7.Asha` (a share fragment), the 404 page (`/nonsense` shows the night 404 with the "start again" link), and that `#hello` is ignored.
5. Share preview: paste the live URL into WhatsApp, LinkedIn Post Inspector, X card validator (or a Slack DM to yourself); confirm title, description and the `og.png` diya image with the exact V3 `site.og` text; `<title>` is the V3 tab title; `og:url`/`og:image` are absolute (build with `SITE_URL=https://...`).
6. Footer lines: the V3 footer text exactly as copy has it; the sign-off reads "Shukriya." logic by date (after 9 November it swaps; today it must still read the pre-swap line); no festival date printed anywhere (search the live page text for "Nov"); spelling is "Deepavali".
7. Truth read-aloud: read the 60-second file, the hero, Lamp 1, Lamp 3, Lamp 6 ("Proposed, not run" visible), the verdict and the closure aloud; "Spoken with Wispr Flow" appears exactly twice (Take 1 and Take 2); no held-out numbers; no hiring or growth-win claim.
8. Accessibility smoke: tab through once with the keyboard only; run VoiceOver or TalkBack on the opening, the lamp-1 guess and the wish form (30 s each); confirm Calm via the OS "Reduce motion" switch gives a finished page.
9. Speed proof for the person's notes: Lighthouse mobile (Moto G Power, slow 4G) in an incognito window: Performance 90 or above, Accessibility 100 target, Best Practices 100, SEO 90 or above; if Performance is under 85, check E8.4 rules and the entry-chunk size before shipping.
10. Deploy hygiene: tag `submitted`, zip the previous folder, note the final URL, check the URL again from another network after 10 minutes (CDN propagation), and confirm `Cache-Control` is whatever the host defaults to (no custom headers are required).

### Video-friendly moments for the 3-minute challenge video (screen-record on a phone at 60 fps, with the Calm toggle OFF; no audio is needed from the site; use the person's own voice-over)

1. 0:00 to 0:08, first light: the shell diya on a slow connection (record with DevTools "Slow 3G") cross-fading into the opening, then "324 tests passed." and "Then an audit found 19 problems." arriving in two beats.
2. 0:08 to 0:20, the hold: press and hold the diya, the ember arcs to lamp 1, the street wakes (string lights running, windows warming, rangoli drawing). This is the single best shot; record it twice and use the cleanest take.
3. 0:20 to 0:35, "324, then 19": tap the guess, the green wall fills, 19 amber tiles flicker.
4. 0:50 to 1:05, the baithak pane window lighting one pane at a time (who I am, how I work).
5. 1:15 to 1:30, the phuljhadi on lamp 3 burning down to a steady small diya at 1.02x ("Chamak nahi, sach.").
6. 1:30 to 1:45, drag the late-reply slider so the flame gutters and greys (keep the MODEL OF DOCUMENTED BEHAVIOR label in frame).
7. 2:10 to 2:25, lamp 6 and "Proposed, not run": the dashed lamp wicks and recedes.
8. 2:30 to 2:50, the wish card and "Aapka diya": the flame travels the row and lights the visitor's lamp; end on the lit row and the closure question.
Film in portrait on a real device at 1080x2340, finish with Calm ON for 3 seconds to show the still version, then the final URL on a black card made in the editor. Cut any moment where the HUD or a dev overlay shows; the debug overlay does not exist in production builds.

---

## Risks and cut order

- RISK: headless frame numbers mislead (software raster). MITIGATION: ratchet against the same-environment `v3-baseline`, judge absolute numbers only on a real phone at T-3h.
- RISK: the governor flaps or sheds too early and the page looks dull on good phones. MITIGATION: 60-frame warm-up, 45-frame persistence, p95 double condition, 12 s recovery hysteresis, pinning, unit test; start tier derives from device hints so good phones start at `high`.
- RISK: `content-visibility: auto` causing anchor-jump CLS or blank sections. MITIGATION: not on `#night`, `#baithak` or any hash target; intrinsic sizes equal real min-heights; CLS gate at 0.05.
- RISK: OffscreenCanvas worker CSP or Safari gaps. MITIGATION: feature-detect, same-origin, `worker-src 'self'`, fallback to the in-thread engine; first thing cut.
- RISK: the copy-frozen guard blocks legitimate micro-labels late at night. MITIGATION: `copy-approved.json` is one line per path; the person approves in a minute; never weaken the check.
- RISK: packs 1 to 7 forget `html[data-elev="1"]` scoping or registration. MITIGATION: `check-elev-scope`, `check-parity` fail fast.
- CUT ORDER inside pack 8 if time runs out: (1) filmstrip baselines and contact sheets (keep only the sanity checks), (2) OffscreenCanvas worker and atlas, (3) HUD (keep the registry), (4) contrast sampling (keep axe), (5) the "Drawn in code" line; NEVER cut E8.1, E8.5 shell, E8.7, the bundle gate, the Calm parity check, or the flash check.
