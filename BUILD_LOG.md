# BUILD_LOG: Ek Diya Se Doosra

Branch `ek-diya-se-doosra`. Old detective site: tag `detective-site-final`. Order followed: packs 1, 2, 3, 4, 6, 7, 5 (glue G1 after P4.1, G4 after P7.6, G2 after P7.7, G3 before P5.1). Pack 8 is deliberately not built.
`dist/` is git-ignored until the final commit (it is rebuilt by `npm run build`).

Legend: done / partly / skipped. "Not verified" means I could not see it (phone-only or visual).

## Pack 1: Foundation and data
| Prompt | Status | Notes |
|---|---|---|
| P1.1 setup and guardrails | done | React 18 + Vite 5. Runtime deps: react, react-dom only. Fresh repo, so no backend template to strip. System fonts only (no font files). CSP meta is injected in production builds only (dev needs inline scripts). `scripts/check-build.mjs` runs inside `npm run build`. Folder layout is close to the brief but not identical (no empty placeholder files). |
| P1.2 data layer and schema | partly | `src/data/copy.json`, `tpl`, `rich` (no innerHTML), copy hook `c()`, `scripts/check-copy.mjs`. `_` keys are stripped from the bundle by the Vite plugin. `SCHEMA.jsonc` was not saved as a file; the check validates against the sources instead of a schema. |
| P1.3 load the full copy | done | Every string matches `website_copy.md` word for word (check-copy: 0 unmatched). Evidence bodies come from `reference/content.json`. 93 interface labels under `ui.extra` / `aria` are not in the copy and are listed for approval. I read the sources from the repo root instead of copying them into `reference/`. |
| P1.4 store, events, tiers, Calm | partly | Store, events, ticker, governor, Calm, haptics done. Developer panel (`#devpanel`) not built (brief lists it as cuttable); nothing named devpanel ships. |
| P1.5 night stage and skeleton | partly | Section ids, dialogs, tone tokens, Ink tokens, snap rules, focus ring done. Stage layers are empty until Pack 2. |
| P1.6 top bar, skip links, full text | done | Skip link, top bar, menu, full-text view (`#text`), print stylesheet. Print preview not verified visually. Calm control lives in the bottom dock (reconciliation R6), not the top bar. |
| P1.7 hash, share meta, favicon | done | Hash grammar with unit tests, head tags generated at build, OG image rendered locally to `dist/og.png`, favicon with lit dots, theme-colour follows tone, `(n/5)` title prefix. `og:image` and `og:url` are omitted unless `SITE_URL` is set at build. WhatsApp preview not verified. |

Checks run: `npm test` (3 unit tests pass), `npm run build` (check-build clean), `scripts/smoke.mjs` at 360, 390 and 1366 (19 checks pass: no console errors, same-origin requests only, no sideways scroll, skip link first, hash routes).

## Pack 2: The night world
| Prompt | Status | Notes |
|---|---|---|
| P2.1 art direction, type, light model, tone | partly | Tokens (Pack 1 values kept, per the brief), system font stacks, tone table drives sky, ground, vignette, text glow, cast light. The tone scrubber is **not** built as a visible control: `window.__ek` exists in development builds only (used for my screenshots). Panel warm cast uses `--lx/--ly`. |
| P2.2 sky | done | Three cross-fading gradients, seeded stars (120/70/40 by tier, 14 twinklers), hairline moon, 3 wisps (tier-trimmed), one shooting star on lamp 3. Star ovals bug found in screenshots and fixed. |
| P2.3 skyline | done | 13/8/4 blocks, 64 windows + the visitor's 65th, lit counts 5/14/23/32/41/56/64 (checked: 32 at tone 3, 65 at tone 6), nearest-to-lamp ordering, TV-blue flicker, turning fan, rooftop kit, balcony rails, solar heater, pointer parallax, Tilt chip (opt-in). Tilt not verified on a real phone. Decorative side blocks added so wide screens fill. |
| P2.4 terrace foreground | partly | Parapet, rangoli (5 self-drawing layers tied to hold progress, dotted arc stays dotted), toran (11 strands, 7 on small screens), 18-bulb string lights with 4 modes via a real button, 3 star lanterns with tap swing, cat. Per-path stagger and some lamp-pool details simplified. String lights sit along the parapet, not the top edge. |
| P2.5 dusk-gold and visitor window | partly | Gold sky fade with 700 ms delay, 15-window cascade, one ring (high tier only), one flock of birds (high tier only), visitor window flare. "Jump straight to tone on reload" is not applicable: nothing is stored. |
| P2.6 Ink and Calm | partly | Ink hides festival decor, Calm stops every loop. Ink dusk horizon band is approximated. |
| P2.7 layout rules | partly | Stage, zones, short-phone and landscape rules done. The lamp row and hold hint (needed for the "first screen shows together" check) arrive in Pack 3. |

Checks run: build + check-build clean; smoke 19 pass; headless screenshots at 360x640 and 1366x768 at tones 0, 2, 5, 6 (viewed); reduced-motion emulation turns Calm on; Ink hides decoration; all dock/top-bar controls measured at 44px tall. Not verified: real phone frame rate, Tilt, Android haptics.
