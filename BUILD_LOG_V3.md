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
