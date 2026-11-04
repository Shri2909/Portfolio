# ELEVATION REPORT (Ek Diya Se Doosra)

Branch `elevation`, built from `origin/v3-flow-and-growth`, finished 4 Nov 2026. Detail per step is in `BUILD_LOG_ELEVATION.md`.

**Where the work lives.** Pushing the branch `elevation` and all tags to origin was refused (HTTP 403, a policy denial). The work was pushed to `claude/loving-planck-73twp9` instead, so that branch holds everything. The tags (`v3-baseline`, `elev-e8.1`, `elev-e8.2`, `elev-after-pack-1` ... `elev-after-pack-8a`, `elev-final`) exist only in the local clone. Each pack is one commit, so the pack boundaries are also visible in `git log v3-baseline..`.

## Not verified (honest)

Nothing here has been seen on a real phone. All frame numbers come from headless Chromium with a software rasteriser at 4x CPU, which is pessimistic for GPU work. Taste, real-device frame rate, Indic font rendering, and WhatsApp acceptance of the moving card are unverified.

## What is in (by pack)

- **E8.1 kill switch:** compile-time flags, single entry `src/elev/index.js`, scoped CSS, a 5 s panic window that turns elevation off on an elevation error, `check-elev-scope`.
- **E8.2 perf harness:** `scripts/perf.mjs`, `perf/baseline-v3.json`.
- **E6.8 fix:** ZWJ/ZWNJ kept between letters in `sanitiseName` (test added).
- **Pack 2 motion:** tokens, stage director (hysteresis, cues, jump handling), eased `scrollTo`, snap restraint, lamp card opening as an iris from the wick, ember-read headlines, press/hover/focus feel, `scripts/motion-qa.mjs`.
- **Pack 1 art direction:** per-act colour script, procedural materials and grain, clay diyas, marigold toran, window glass, depth fix (near is darkest), bundled Fraunces (73 KB), brass and paper chrome, text-safe scrim, `scripts/qa-rubric.mjs`.
- **Pack 4 light and fire:** per-flame point light on nearby surfaces, light-map pool, flame glow and wind, two silent choreographies ("Paanch diye", "Aapka diya"), blueprint lit by a moving circle, 2-flashes-per-second guard.
- **E8.3 / E8.4:** effect registry, governor v2 (sheds and recovers, fade dimming, flap guard), render-rule clean-ups, `lint-render`, `perf/EFFECT_COST.md`.
- **Pack 3 opening:** CSS poster, one clock, darkness veil, lantern headline, street wake, hush system, hold feedback, idle attract, skim on any input, deep links skip the film.
- **Pack 5 set-pieces (lazy):** 324-bulb wall (full), proof-chip ember flight (full), and lean versions of the wire flame, phuljhadi, relay, ghost clock, panes and loop ring, word tilt, receipt lighting.
- **Pack 7 interaction:** spring kit, lamp cursor and magnetic lean, touch bloom, haptics switch, burning thread and rail, lit Menu and bottom sheet, focus flame and keys, history handling, Invite polish.
- **Pack 6 culture (lazy):** kolam engine and drawing pad, card studio, silent 6 s moving card, lantern sky, homely-hour moments, five easter eggs, per-script card rhythm, Ink palette.
- **E8.5 first light:** the `#poster` diya is in the first byte of `index.html` and works without JavaScript (`check-shell`). **E8.6:** `check-parity`, `check-flash`, `check-a11y`. **E8.7:** the elevation proofs section in `check-build` (network, storage, audio, truth strings, debug stripping), plus `check-copy-frozen` against `scripts/copy.lock.json`. **E8.8:** `scripts/filmstrip.mjs` with contact sheets, `report.html` and the five-minute rubric.
- **Calm:** with reduced motion at load, only the static modules start (Calm INP went from 232 to about 140 ms). The blueprint and set-piece overlays are not started in Calm, so V3's own still devices show.

## Not built (honest list)

- **Pack 2:** the layer camera (built but off, behind `VITE_CAMERA=1`, because it cost 2 to 3 frames); View Transitions flame flight, pane-to-card and wish lift-off; `Split.jsx` text splitting (the file exists but is unused); sticky pinning; the unlit-lamp "breathing dim" and drop ripples; trace, screencast and heap criteria in motion QA.
- **Pack 1:** the deckle edge filter, window curtains and reflections, full-screen blend layers and grain jitter (all shed for frame time); rack focus is inert while the camera is off.
- **Pack 4:** WebGL2 bloom, particle engine v2, five-layer flame, heat ripple, oil mirror, god-rays, dust motes, pointer torch, window waves.
- **E8.4:** OffscreenCanvas worker and sprite atlas; the `director.js` wave change; pre-warm promotion.
- **Pack 3:** camera dolly, balcony diyas, birds, rangoli draw in the wake, hold-curve variants, GuessAudit canvas re-timing, lamp-six fade-in, flash screencast test. Headline beat 1 arrives about 1.3 s in at 4x CPU (target under 0.6 s), because of V3's mount timers.
- **Pack 5:** tag pendulum, 260 px rangoli canvas, dial restyle, pane vignettes and card flip, loop radiogroup with arrow keys, voice flame thread, visitor lamp walk, receipt 3D fold and drag-to-close.
- **Pack 7:** cursor sparkler, LampCard swipe on springs, flame lean and footfall bob, self-teaching nudges, trail embers, act names, native-dialog Menu rebuild, skip tray, Invite sweep and crown flame.
- **Pack 6:** drag-to-compose and spring tilt on the card, per-theme redraws, cat ear and tail moments, GIF fallback for the moving card, a seventh rangoli theme; the script rhythm table is not calibrated against real Indic fonts.
- **E8.7 / E8.8:** committed pixel baselines (`shots/baseline`) are not set, because the guard says a person approves them first; `pixelmatch` diffing is not used. The filmstrip compares against `--compare` if given.

## Labels needing your approval

All 27 are in `src/data/copy.json` under `ui.extra` (already marked `_needsApproval`) and listed in `scripts/copy-approved.json`. They are not part of `website_copy.md`. Nothing else in the copy changed (`check-copy-frozen` passes).

| Key | Text |
|---|---|
| wayNav | Where you are |
| keyAct | Previous or next act |
| keysTitle / menuKeys | Keys |
| keysOn | Keys on |
| keysHint | Press ? for keys |
| hapticsLabel | Haptics |
| proofBack | Baithak par waapas |
| movieLabel | Chalta card |
| movieAria | Moving card (6 s, silent) |
| movieShare | Share moving card |
| movieDownloadWebm | Download WebM |
| movieNoteMp4 | A 6 second silent clip. The picture card above is still the main way to share. |
| movieNoteWebm | This browser makes WebM only; WhatsApp may not open it, so share the picture card. |
| movieSlow | This may be slow on this phone. Tap again to go on. |
| movieFailed | The moving card could not be made here. The picture card still works. |
| padOpen | Rangoli banaiye |
| padOpenEn | Draw a rangoli for the card (optional) |
| padPresets / padPreset | Rangoli patterns / Rangoli {n} |
| padFolds, padMirror, padUndo, padClear | Folds, Mirror, Undo, Clear |
| padStroke | Stroke {n} added |
| scriptMaybe | This device may not show this script on the card; the text share will still be exact. |
| kolamName | Aapki rangoli |

## Numbers

- **Sizes (gzip):** entry JS 122.3 KB (V3 baseline 120.6), total JS 187.2 KB (cap 200), CSS 27.9 KB (cap 45), fonts 73.3 KB (cap 90), og.png 49 KB.
- **Checks passing:** `npm run build` (check-build clean: no outside hosts, no storage, no audio, "Spoken with Wispr Flow" exactly 2, held-out numbers and festival dates absent), `npm test` 29, `npm run check`, `check:gates` (parity, flash, a11y, shell), `motion-qa`, `qa-rubric` (5 automated items; items 1, 2, 5, 7, 9 are for your eyes), `lint-render`, `verify:light`, `e3-opening`, `e5-setpieces`, `e7-interact`, `e6-culture` (run at Pack 6, about 9.6 min), `perf --auto` exit 0.
- **Perf, 390x844, 4x CPU, software rasteriser:** the governor settles on its own. With it active, medians are 16.7 ms in the sampled acts and p95 is 16.7 to 33 ms; Calm is clean (p95 16.8 ms in lamp-3, CLS 0.0034). CLS is 0.004 and INP is 120 to 184 ms on the normal runs. Forced high tier with the governor idle costs about 8 ms median over V3. Forced-tier runs of the strict `npm run perf` ratchet still fail by about one frame step in some acts. V3 itself lights the lamps with 300 to 400 ms frames at 4x.
- **Filmstrip:** 390x844 and 1366x768, normal, Calm and Ink, no sanity failures after relaxing the luminance floor for lamp-6 (the "lights out" act is near-black by design). Contact sheets are generated into `shots/run/` (gitignored, 97 MB); `shots/calm/` holds committed Calm stills.

## Do on a real phone before shipping

1. Android Chrome on mobile data, incognito: first lit diya within about 1 s; hold-to-light one-handed; scroll the whole page slowly then fast; landscape and back; Calm; Ink. Decide ELEVATION ON or OFF by the 30-second stutter test in the master plan.
2. Frame rate in the lamp stretch (`#lamp-2` to `#lamp-5`) and the opening; watch for the governor dropping to `low` on a good phone.
3. Fraunces fallback on a phone without it; Devanagari, Tamil and Bengali cards (script rhythm and missing-font note).
4. Moving card: save/share in WhatsApp (MP4 on Android Chrome; Safari makes MP4/WebM differently).
5. Share previews (WhatsApp, LinkedIn, X) with `SITE_URL` set at build; the 404 page; `#v1.7.Asha`; TalkBack or VoiceOver on the opening, lamp 1 and the wish form.
6. The five-minute rubric in `shots/run/report.html`; approve the labels above.
7. Camera: try `VITE_CAMERA=1` on the phone only if you want it; it is off in this build.

## Rollback

- Plain V3, same build: `npm run build:v3` (`VITE_ELEVATION=0`). Within about 2 KB of the `v3-baseline` JS.
- One module misbehaves: remove it from `MODULES` in `src/elev/index.js`, or add it to `CALM_SKIP` for Calm only, then rebuild.
- Known-good V3: `git checkout v3-baseline -- . && npm ci && npm run build` (the tag is local; on the remote, V3 is `origin/v3-flow-and-growth`).
- Runtime: any error from an elevation file in the first 5 s sets `data-elev="0"` and stops every module.
- Keep the previous `dist/` zipped before deploying so the host can be reverted quickly.
