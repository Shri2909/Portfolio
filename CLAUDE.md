# CLAUDE.md: Ek Diya Se Doosra (Shriniwas Kholkute's portfolio)

This file replaces the old detective-site instructions. The detective site ("Case File No. 001") is recoverable at git tag `detective-site-final`. Its rules (three interactions only, chapter seals, detective tone, the old section list, "do not add features not in the specs") no longer apply.

## What this is

A one-page night site, "Ek Diya Se Doosra" (one lamp lights another), for Shriniwas Kholkute's application to Wispr Flow's India growth internship. A visitor lights three lamps (Certgen, Blitz, Vigil), reads each story in three levels (instantly visible, poora kissa, inspect the evidence), meets the person, hears the voice, reads the proposed Group Admin Tax idea (a fourth lamp that never lights), can write one wish for one real person, and ends with a lamp of their own. The journey is numbered 01 to 06 (see `copy.journey`).

## Sources of truth

0. `website_copy_lamps.md`: the three lamp stories and the transition, word for word as Shriniwas wrote them (4 Nov 2026), plus the Level 1 summaries and the changed lines. They replace the five lamp stories of `website_copy.md`; TipIndex and PitDB are removed from the page.
1. `website_copy.md`: every other visible word. Copied into `src/data/copy.json`. Never rewrite, shorten, translate or "improve" it.
2. `build_prompts.md`: the build briefs (packs 1 to 7; pack 8 is deliberately not built). Reconciliations R1 to R10 at its top beat the individual prompts.
3. `reference/content.json`: read-only. The voice takes and the evidence-drawer bodies come from it.
4. `docs/TRUTH_LEDGER.md` and `docs/TRUTH_CHECK.md`: what is verified. UNVERIFIED items stay off the page.
5. `BUILD_LOG.md`: progress. If a session is resumed, continue from it.

If anything conflicts with the truth rules below, the truth rules win.

## Truth rules (non-negotiable)

1. Never invent copy, numbers, claims, quotes, dates or names. Empty field means render nothing.
2. Never-claim list: no growth wins, no channel ownership, no measured activation lift, no customers, no production deployment of any project, no hiring-outcome claims.
3. "Spoken with Wispr Flow" appears only on the two 2 Nov 2026 takes (Take 1 and Take 2). Nowhere else, including footer and meta.
4. AI agents wrote a substantial share of the code in these projects. Never claim otherwise.
5. Gated lines stay OFF (flags `false`) until Shriniwas decides: the recorded Flow-into-Emergent line, the no-analytics footer line, the first sentence of the person block, the lamp-six language line, and footer line 5 (how this page was made, left empty).
6. TipIndex and PitDB are not on the page at all (removed 4 Nov 2026); do not add them back.
7. Print no festival date. Spell it "Deepavali".
8. No `[CONFIRM]`, `[FILL IN]`, `TODO`, lorem or placeholder text on the published page.

## Technical rules

- Static build only: no backend, database, login, analytics, cookies, localStorage, sessionStorage, IndexedDB, or runtime request to any third-party host. Outbound links are clicked by the visitor only (Google Drive, GitHub, wa.me).
- Stack: React + Vite; runtime dependencies are React and React DOM only. Dev dependencies are fine. Fonts are system fonts.
- The wish, recipient and sender live in memory only. Never in the URL, storage, logs or event details. The URL fragment carries only the lamp count and an optional first name (`#v1.<base36 count>.<name>`).
- No audio anywhere. Haptics: Android only, feature-detected, never in Calm.
- Accessibility is a requirement: semantic HTML, keyboard operable, visible focus, 44px targets, AA contrast, Calm and `prefers-reduced-motion` honoured, a plain-text twin for every interaction, `lang="en-IN"` with Hinglish wrapped in `lang="hi-Latn"`.
- All visible text comes from `src/data/copy.json` through the copy hook. Keys starting with `_` are private notes and are stripped from the production build.
- Interface labels that are not in `website_copy.md` live under `ui.extra` / `cards` etc. and are listed in `BUILD_LOG.md` for approval.

## Working method

- `npm run build` runs the build and then `scripts/check-build.mjs` (outside hosts, storage use, forbidden strings, budgets). `npm run check` re-runs the checks on `dist/`.
- `scripts/check-copy.mjs` verifies every string in `copy.json` against the reference files.
- Commit after every pack and push the branch. Keep `BUILD_LOG.md` current.
- Never say something was verified if it was not seen. Mark visual and phone-only items "not verified".
- Do not touch `main`. Never force-push.


## Lamps are three; internal slot 6 is the honest lamp

`src/lib/lamps.js` holds `LAMPS = 3`, the tone steps (0, 2, 4, 5; 6 = the visitor's lamp) and which rangoli layers each lamp draws. The proposed, never-lit lamp keeps the internal slot 6 (DOM id `#lamp-6`, flame personality 6) so the stage, light and flame modules are unchanged; the page calls it Lamp 4. `scripts/copy.lock.json` was re-baselined on 4 Nov 2026 for the new stories.
