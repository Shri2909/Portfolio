# CLAUDE.md: Case File No. 001 (Shriniwas Kholkute's portfolio)

Read this file first, then the last section of `docs/BUILD_LOG.md` ("3 Nov 2026: rebuilt around the Final Website Copy") and `docs/TRUTH_LEDGER.md` (including its 3 Nov addendum). The files `docs/EXPERIENCE_DIRECTION.md`, `docs/HANDOFF_CONTEXT.md`, `docs/DESIGN_SPEC.md`, `docs/SECTIONS_SPEC.md` and `docs/CLAUDE_CODE_PROMPTS.md` describe the earlier Stage 1 to 3 build; use them for the look and the feeling only. Where they conflict with the Final Website Copy, the copy wins.

## Current state (3 Nov 2026)

The site was rebuilt around the Final Website Copy. Source order of authority: `Case_File_001_Focused_Website_Copy.md` (all primary public text, word for word) > `Operation_Case_File_001_Final_Master.md` (seven-beat story, look, three interactions) > `Case_File_001_Evidence_And_Submission_Package.md` (evidence drawer, 60-second file). Do not expand the primary narrative or add unsupported claims.

Sections in `content/content.json`: `hero` (the contradiction), `exhibitA` (guess the audit result), `exhibitB` (the late reply), `more` (three more files), `person`, `voice` (Take 1 and Take 2 compare), `verdict`, `sixty` (the 60-second file, a dialog, also `#sixty`), `evidence` (eight case folders). The old opening, briefing, case board, chapter seals, Lab, Wispr field notes and locker are gone (the earlier version is in git history).

Three interactions only: (1) guess the audit result (324 green tiles, 19 findings, two high), (2) the late reply (native range input, original vs corrected logic, labelled MODEL OF DOCUMENTED BEHAVIOR), (3) Take 1 vs Take 2 compare, powered by the word-level diff engine in `src/js/10-engine.js`. Each has an always-visible plain-text version.

Deliberate departures from the rules below (the Final Website Copy is authoritative): the title contains "SUSPECT" and the Exhibit B copy contains "failed", words rule 9 bans; there are no Chapter Seals (rule 10), because they would be new copy. Interface labels you write must still avoid the banned words.

`INVITE ME TO AN INTERVIEW` renders only when `site.contact.email` or `site.contact.linkedin` is filled in. Held out of production until Shriniwas confirms: TipIndex 40.62x and 0.585, PitDB 629.70x, 2.7x, 26.5x and 1.08x. No voice-to-builder exhibit exists (no recording); never imply one.

## What this is

A public portfolio for Shriniwas Kholkute (B.Tech Instrumentation and Control, VIT Pune, graduating May 2027), built for the Wispr Flow India growth internship challenge. The page is styled as a friendly detective's case file: the reader is the detective and the page is the file on him. The reader is a skeptical startup founder, mostly on a phone. The first screen must make them stop scrolling and smile.

Deadline: Tue 3 Nov 2026, 21:00 IST target, 23:30 hard stop. Freeze the site Tue 16:00 IST.

## Non-negotiable rules

1. **Never invent copy, numbers, claims, quotes, dates or names.** All text comes from `content/content.json`. If a field or section is empty, render nothing for it. No lorem ipsum, no sample numbers, no placeholder names, ever, in production.
2. **Two builds, one source.**
   - `dist/index.html` (production): only `content/content.json`. No draft or sample code path or data may exist in this file.
   - `dist/review.html` (review): fills EMPTY fields from `content/draft.json` (currently fills 0 fields), each filled field outlined in amber, with a diagonal watermark "REVIEW DRAFT - NOT YET SPOKEN BY SHRINIWAS". Never published.
3. **Honesty about authorship.** AI agents wrote a substantial share of certgen and TipIndex. Pages never claim otherwise. "Spoken with Wispr Flow" appears only on text really dictated with Flow. Voice takes 1 and 2 qualify; nothing else does until he supplies recordings. Take 3 stays excluded.
4. **Never-claim ledger.** No growth wins, no channel ownership, no measured activation lift, no Flow use before 1 Nov 2026, no production deployment of any project, no customers, no hiring-outcome claims.
5. **Truth ledger first.** Before writing any visible fact, check `docs/TRUTH_LEDGER.md`. Items marked UNVERIFIED stay out of production until Shriniwas confirms.
6. **Static site.** No backend, database, login, analytics or third-party requests. Fonts are embedded (base64 woff2) so the page makes no external requests.
7. **No audio anywhere.** Haptics only on user-driven drags on Android, optional.
8. **Accessibility is a requirement.** Semantic HTML, keyboard operable, visible focus, 44px targets, AA contrast, prefers-reduced-motion honored (no animation, final states shown), every chart has a text/table alternative, the opening slider is a real `input[type=range]`.
9. **Tone.** Warm, curious, playful, second-person, positive. Cozy detective study (Columbo or Poirot, never noir or crime scene). The detective sits on the candidate's side of the table: no courtroom, no "caught", no fear. No alarming or negative-leaning UI words (cut, wrong, error, fail, reject, danger, miss, against, guilty, suspect, caught, trap). Failures are "plot twists", fixes are "what I did next", limits are "fair warning". Shriniwas's honest facts in content fields stay exactly as written.
10. **Curiosity first.** Every chapter ends with a Chapter Seal: a question about what comes next, never a claim. The reader should always have one open question. Creativity lives in form and interaction; facts never change. Maximum delight, minimum risk: one-thumb phone use, no audio, no heavy effects, reduced motion honoured.

## Working method

- Work in small steps. After each change: `python3 scripts/build.py`, then `node scripts/test.mjs` (set `COPY_FILE=Case_File_001_Focused_Website_Copy.md` and `AXE_PATH` to axe.min.js for the full run; last result 94 passed, 0 failed). Report console errors and what is not working, and stop for review. `scripts/lib.mjs` finds Chromium in `~/.cache/ms-playwright`; in a fresh environment run `npx playwright install chromium` first.
- `dist/` is committed: rebuild before committing so it matches the source.
- Test with a real browser: tap every control, check invariants, check reduced motion, check the production build for forbidden strings (`lorem`, `TODO`, `[__]`, `SAMPLE`, `DRAFT`, `draft`).
- If an effect drops below 60fps on a mid-range phone, remove the effect, not the content.
- Do not add features not in the specs. Do not "improve" copy.
- Keep the code small and dependency-free: vanilla HTML, CSS and JS, one build script (`scripts/build.py` or `scripts/build.mjs`) that inlines CSS, JS, fonts and JSON into a single HTML file.

## Repo layout (target)

```
CLAUDE.md
content/content.json      real, sourced content (production)
content/draft.json        drafted scripts (review build only)
docs/                     specs, truth ledger, prompts, context
src/                      template.html, styles.css, css/, fonts/, js/ (numbered modules), review/
scripts/build.py          builds dist/index.html and dist/review.html
scripts/test.mjs          Playwright tests (+ lib.mjs, assets.mjs)
Case_File_001_*.md, Operation_Case_File_001_Final_Master.md   the copy and build briefs
dist/                     build output
```

## Who to ask

Shriniwas supplies: his recorded Flow scripts (S02 to S14), repo links, essays, papers, certificates, Lab results, and confirmations listed in the truth check. Ask only when a rule here cannot answer.
