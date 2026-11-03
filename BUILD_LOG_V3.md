# BUILD_LOG_V3: flow, copy and growth idea (branch `v3-flow-and-growth`)

Source: `V3_IMPLEMENTATION_BRIEF.md`. Branch cut from `ek-diya-se-doosra` (which already had the layout pass and Pack 8). Baseline before changes: `npm test` 9 pass, `npm run build` clean, `check-copy` 0 mismatches.

## Phase 0: setup
Done. `dist/og.png` is still produced (Playwright is available here).

## Phase 1: bugs (PART B)
| Item | Status | Notes |
|---|---|---|
| InviteSheet behind every INVITE ME | done | New `InviteSheet.jsx`, `InviteButton.jsx`, `mail.js` builders. Order: Gmail first on desktop, mail app first on touch devices; Outlook extra; Copy address and Copy message with clipboard, hidden-textarea and select-and-press fallbacks; visible address; message preview; LinkedIn only if filled. URLs are built at open time from the store. Gmail, Outlook and mailto formats checked exactly. |
| Lamp number (R3) | done | The line appears only after the visitor's lamp is lit, and N is the closure's count everywhere (tested: 6 from `#v1.5`, in the top bar and the closure). |
| Closure invisible-link bug (R2) | done | Hidden content now uses `visibility: hidden`, so it cannot be focused or clicked; caption and fine print are always visible. Tested: no invisible focusable element in the unlit closure. |
| Dock into the Menu | done | Look (Deepavali / Ink) and Tilt are in the Menu; one 44 px round Calm button stays bottom-right. Sticky voice slider clears it (tested at 390x844, 360x640, 412x915: the slider is the topmost element at its thumb). |
| Layout (PART B rules) | done | Applied the brief's CSS; re-measured at 10 viewports: all six lamps fully inside the viewport, nothing on top of them, no sideways scroll, hold hint at least 6 px from the progress pill. |
| String-lights control | removed | It was unreachable by pointer (it lived under the page layer). The brief allows removal; lights run steady. |
| Solid top bar, 44 px targets | done | Visitor lamp now has a 44x44 button; the only sub-44 items left are inline text links inside sentences, which the brief excepts. |
| Skyline | done | Readable at tone 0 and 1; about 14 lit windows at first load (G10); lit-window table is now 14, 20, 28, 36, 44, 56, 64. |
Tests: `scripts/e2e/v3-phase1.mjs` (production build, 40+ checks): all pass. `check-build` allows the Gmail and Outlook hosts as visitor-tap outbound links.
Not verified: the Gmail and Outlook compose pages actually accepting the pre-filled text (needs a logged-in browser), and a real phone mail app.

## Phase 2: copy data
| Item | Status | Notes |
|---|---|---|
| `website_copy_v3.md` | done | PART E extracted verbatim, plus an appendix with the evidence folder 8 text (PART F section 3 with the internal source ids such as "H1" removed, because they would mean nothing to a visitor) and a few small strings. `website_copy.md` (v2) is kept as history because PART E refers to it for every [SAME] string. |
| `src/data/copy.json` | done | Added: per-lamp `stop` copy, `terrace`, `transitions`, `baithak` (four panes, cards 1 to 7, the six-step loop, five "what I bring" items), `growth` (the Handover Test act, three taps, experiment card, six source links), new invite-sheet labels, new opening, 60-second file, verdict, wish, drawer intro, share and meta text. Evidence folder 8 now holds the experiment card (`body.fields`). Old keys stay until the components that use them are replaced in phases 3 to 5. |
| Slots and flags | done | All `meet.*` and `bring.indiaShare` flags are false and every slot (`slots.*`) is an empty string; `meet.mergeThin` is true. Nothing renders a placeholder. `check-copy` now fails if any of these flags is on. |
| `scripts/check-copy.mjs` | done | Checks `copy.json` against `website_copy_v3.md`, `website_copy.md` and `reference/content.json`: 0 strings not found. 146 new interface labels are listed under `ui.extra` for approval (see the final report). |

## Phase 3: the new flow (PART C)
Browser test: `scripts/e2e/v3-phase3.mjs` (production build), all checks pass; `v3-phase1.mjs` still passes.
| Item | Status | Notes |
|---|---|---|
| Running order | done | night (first screen), `#lamp-1`, `#baithak`, `#lamp-2` to `#lamp-5`, voice, `#lamp-6`, verdict, wish, closure. `#lamps` list, `#row-breathes` and `#person` are gone (tested). Act names are not printed. |
| First screen | done | Headline arrives in beats (324 tests passed. / Then an audit found 19 problems. / Ship karte?, then the two lines); any tap, key press, Calm or reduced motion completes it at once. No INVITE ME, no progress counter, no lamp chips (a label appears when its lamp is lit), no growth button, no light-all, no Look; one quiet "Jaldi mein? 60 second ki file →" link. All six lamps inside the viewport. |
| Lamp stops | done | Each lamp is one on-page screen with its device, one "what I did next" sentence, one Fair warning, a chip, and "Poora kissa" (receipt sheet with the v2 text, devices removed from the sheet). Lamps 2 to 5 have a "Lamp n ko chhuiye" button that passes the flame (tested for all four). Tapping a lit lamp in the row scrolls to its stop; the card no longer opens by itself. The brief's 45 visible words: lamp 2 shows about 55 because it carries the terrace entry line (60 allowed in the test). Exactly one primary control per screen is only approximate (the devices have a few small controls each). The sheet's accessible name is "Full story: {project} receipt" (English), because the brief's "Poora kissa:" would put Hinglish in an aria label. |
| Awe moments | partly | 1 (the street wakes: caption, string lights, windows, rangoli), 2 (324 then 19), 4 (flame captions) work with the existing effects. 3 is "Tap 3.1×" with a spark burst and the bar settling, not a separate phuljhadi scene. 5 (flame walks the whole row from the wish) is not built; the visitor's lamp still lights at the closure. |
| Auto beat after lamp 5 | done | Two lines fade in and out inside stop 5 (screen-reader safe copy is in the page). |
| Chrome | done | Top bar has wordmark + Menu; INVITE ME fades in after Act 2 (tested). Menu: Poora text, 60-second file, Evidence drawer, Sab diye ek saath jalaiye, Aakhri diya, Look, Tilt. One Calm corner button. |
| Stage cues | partly | Veil for the sitting room, voice and later sections; sideways pan of 4 percent in the sitting room; dusk steps follow the lamps. Effects budget: while a device is in use, optional sparks, embers, petals and lanterns are skipped and cat, lantern sway and string sway pause. Frame rate not measured on a phone. |
| Voice | done | Opens on Take 2; "Doosra take" switches to Take 1; both stay in the full text. |
| Verdict, wish, closure, 60-second file | done | Verdict is two paragraphs plus the signature line and a ROLES link; wish is two short lines with the idea chips and the long privacy text collapsed (short privacy line always visible); closure adds the 60-second file link; the 60-second file has the new copy and "Take the whole walk". |
Removed: the old lamps, cards, story and modes browser suites (they tested structure that no longer exists). `audit.mjs` still walks the old structure and is not updated yet (see phase 6).

## Phase 4: Meet Shriniwas (PART D)
Browser test: `scripts/e2e/v3-phase4.mjs` (production build plus a dev-server check of the flags), all checks pass; phases 1 and 3 still pass.
| Item | Status | Notes |
|---|---|---|
| Four-pane window | done | The lit-window scene (now in `Baithak.jsx`, replacing `Person.jsx`) with four tabs (Who I am, How I think, How I work, What I bring), arrow keys and Home/End, the first pane open. A card shows one hook line; the body opens with "Aur dekhiye"; every card has a Plain text disclosure in the page. |
| Cards | done | Pehle, main kaun? (with Builds / Debates / Writes / Studies chips that jump to the matching pane, résumé link that says it opens Google Drive), Meri raah, Debate (with the "Doosri taraf dekhiye" illustration, labelled as not a transcript), Likhna (the three-lamp essay ring and the essay's last line, essay link), Chaar log ek plan, the six-step loop ring with the honest warning about deleted timings, and the five things the projects show with proof chips that jump to and highlight the matching lamp. |
| Flags | done | With every flag OFF: no braces, no placeholder, no father's-accident sentence, no exam names (JEE, Physics Wallah), no Berggruen, no India-share number; debate and research show only the merged two-sentence card (`meet.mergeThin` ON). A line that needs a slot renders only if its flag is on AND every slot in it is filled (checked in the dev server with the flags forced on: a half-filled line renders nothing). |
| Wording rules | done | G9: the TipIndex rule is "written after attempt one but before the reruns"; "predeclared" appears nowhere. "Hydra" never appears. The essay is not linked to Berggruen. |
| Full text | done | The full-text view lists the sitting-room cards in order (with the loop and the five items as lists). |
Not done: the sitting room does not yet pan the skyline sideways by scroll position beyond the 4 percent shift in phase 3; the pane windows are not themselves the buttons (the four tabs sit under the window picture and light the matching pane).

## Phase 5: Growth act (done)
- `Growth.jsx` (id `lamp-6`): PROPOSED, NOT RUN badge, sketch lamp that never lights, three taps (language chips, two 0..6 sliders with the fixed rule, simulated 2,000-word counter), experiment card, limits, six source links (new tab, noopener noreferrer, unique names), invite line, "Poora protocol" opens evidence folder 8.
- Old Lamp6, RowBreathes, Lamps removed; stale keys and the lamp-six language flag removed.
- Verified by `scripts/e2e/v3-phase5.mjs` on the production build (34 checks pass, including the dist grep and "Spoken with Wispr Flow" exactly twice). check-copy: 0 unmatched strings, 155 interface labels awaiting approval.
- Not verified: real phones, the official Wispr pages (not re-checked, per G14).
