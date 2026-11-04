# CLAUDE.md: Ek Diya Se Doosra (Shriniwas Kholkute's portfolio)

Read this file first, then `docs/TRUTH_LEDGER.md` and `website_copy.md`. `build_prompts.md` holds the longer design prompts for this theme (some of its effects are not built; the page is a lean version of it).

## What this is

A public portfolio for Shriniwas Kholkute (B.Tech Instrumentation and Control, VIT Pune, graduating May 2027), built for the Wispr Flow India growth internship challenge. The page is a dark Deepavali night, "Ek Diya Se Doosra" (one lamp lights another). The reader is a skeptical startup founder, mostly on a phone. The first screen shows one lit flame, the contradiction (324 tests passed, then 19 problems) and a hold-to-light lamp.

## Current structure (render order in `EK.order`)

Opening (home flame, lamp row, hold to light the first lamp), then the recruiter journey:
01 `person` (Meet the person), 02 `lamps` + `lamp1` (LAMP 01 CERTGEN, with the guess-the-audit-result widget), `lamp2` (LAMP 02 BLITZ), `lamp3` (LAMP 03 VIGIL, with the late-reply widget) + `transition` ("Three Lamps. One Pattern."), 03 `voice` (Why Wispr Flow: Take 1 and Take 2 compare), 04 `growth` (The Handover Test, Lamp 04, proposed, not run, never lights), 05 `verdict` (Continue the conversation; GitHub and LinkedIn buttons render only when `site.contact` has them), 06 `deeper` + `evidence` + `wish` (Go deeper: longer stories, personal details, essay link, six evidence folders, the visitor lamp and wish card). `sixty` (the 60-second file) is a dialog, also `#sixty`.

Each lamp story has three levels: Level 1 always visible (his title and tagline, a short summary, one capability), Level 2 "Poora kissa" (his complete script, a `details`), Level 3 "Inspect the evidence" (repository link, files, receipt; a `details`). The three lamp stories are used word for word from the user's text (`website_copy.md` sections 2 to 5); do not rewrite them.

Interactions: hold/tap/Enter to light lamps in order (nothing is stored), guess the audit result, the late reply (native range input, labelled MODEL OF DOCUMENTED BEHAVIOR), Take 1 vs Take 2 compare (word-level diff engine in `src/js/10-engine.js`), the wish card (made in the tab; nothing uploaded or saved). Each has an always-visible plain-text version. The site carries exactly three project stories; do not add other projects.

`INVITE ME TO AN INTERVIEW` renders only when `site.contact.email` or `site.contact.linkedin` is filled in. No voice-to-builder receipt exists (no recording); never imply one.

## Non-negotiable rules

1. **Never invent copy, numbers, claims, quotes, dates or names.** All text comes from `content/content.json`. If a field or section is empty, render nothing for it. No lorem ipsum, no sample numbers, no placeholder names.
2. **Two builds, one source.** `dist/index.html` (production) uses only `content/content.json`. `dist/review.html` fills EMPTY fields from `content/draft.json` (currently 0), outlines them in amber and shows the watermark "REVIEW DRAFT - NOT YET SPOKEN BY SHRINIWAS". Never published.
3. **Honesty about authorship.** AI agents wrote a substantial share of the code in Certgen, Blitz and Vigil. Pages never claim otherwise. "Spoken with Wispr Flow" appears only on text really dictated with Flow: voice takes 1 and 2. Take 3 stays excluded.
4. **Never-claim ledger.** No growth wins, no channel ownership, no measured activation lift, no Flow use before 1 Nov 2026, no production deployment of any project, no customers, no hiring-outcome claims.
5. **Truth ledger first.** Check `docs/TRUTH_LEDGER.md` before writing any visible fact. UNVERIFIED items stay out of production.
6. **Static site.** No backend, database, login, analytics, third-party requests, cookies or storage. System fonts only (no downloads).
7. **No audio anywhere.**
8. **Accessibility is a requirement.** Semantic HTML, keyboard operable, visible focus, 44px targets, AA contrast, `prefers-reduced-motion` honoured (no animation, final states shown), every interaction has a text alternative, the sliders are real `input[type=range]`.
9. **Tone.** Warm, curious, playful, positive. Failures are plot twists, fixes are "what I did next", limits are "fair warning". Facts in content fields stay exactly as written.
10. **Curiosity first.** Creativity lives in form and interaction; facts never change. One-thumb phone use, no heavy effects.

## Working method

- After each change: `python3 scripts/build.py`, then `node scripts/test.mjs` (set `AXE_PATH=node_modules/axe-core/axe.min.js` for the axe run; last result 124 passed, 0 failed). `scripts/lib.mjs` finds Chromium in `~/.cache/ms-playwright`; in a fresh environment run `npx playwright install chromium` first.
- `dist/` is committed: rebuild before committing.
- Do not add features not in the copy. Do not "improve" copy.
- Keep the code small and dependency-free: vanilla HTML, CSS and JS; one build script that inlines CSS, JS and JSON into a single HTML file.

## Who to ask

Shriniwas supplies repo links, GitHub and LinkedIn URLs, recordings and the confirmations listed in `docs/TRUTH_CHECK.md`. Ask only when a rule here cannot answer.
