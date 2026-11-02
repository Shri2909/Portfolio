# CLAUDE.md: Case File No. 001 (Shriniwas Kholkute's portfolio)

Read this file first, then `docs/EXPERIENCE_DIRECTION.md` (the feeling and the curiosity design), `docs/HANDOFF_CONTEXT.md`, `docs/TRUTH_LEDGER.md`, `docs/DESIGN_SPEC.md` and `docs/SECTIONS_SPEC.md`. Then follow `docs/CLAUDE_CODE_PROMPTS.md` one stage at a time.

## What this is

A public portfolio for Shriniwas Kholkute (B.Tech Instrumentation and Control, VIT Pune, graduating May 2027), built for the Wispr Flow India growth internship challenge. The page is styled as a friendly detective's case file: the reader is the detective and the page is the file on him. The reader is a skeptical startup founder, mostly on a phone. The first screen must make them stop scrolling and smile.

Deadline: Tue 3 Nov 2026, 21:00 IST target, 23:30 hard stop. Freeze the site Tue 16:00 IST.

## Non-negotiable rules

1. **Never invent copy, numbers, claims, quotes, dates or names.** All text comes from `content/content.json`. If a field or section is empty, render nothing for it. No lorem ipsum, no sample numbers, no placeholder names, ever, in production.
2. **Two builds, one source.**
   - `dist/index.html` (production): only `content/content.json`. No draft or sample code path or data may exist in this file.
   - `dist/review.html` (review): fills EMPTY fields from `content/draft.json` (my drafted scripts), each filled field outlined in amber, with a diagonal watermark "REVIEW DRAFT - NOT YET SPOKEN BY SHRINIWAS". Never published.
3. **Honesty about authorship.** AI agents wrote a substantial share of certgen and TipIndex. Pages never claim otherwise. "Spoken with Wispr Flow" appears only on text really dictated with Flow. Exhibit 0 takes 1 and 2 qualify; nothing else does until he supplies recordings.
4. **Never-claim ledger.** No growth wins, no channel ownership, no measured activation lift, no Flow use before 1 Nov 2026, no production deployment of any project, no customers, no hiring-outcome claims.
5. **Truth ledger first.** Before writing any visible fact, check `docs/TRUTH_LEDGER.md`. Items marked UNVERIFIED stay out of production until Shriniwas confirms.
6. **Static site.** No backend, database, login, analytics or third-party requests. Fonts are embedded (base64 woff2) so the page makes no external requests.
7. **No audio anywhere.** Haptics only on user-driven drags on Android, optional.
8. **Accessibility is a requirement.** Semantic HTML, keyboard operable, visible focus, 44px targets, AA contrast, prefers-reduced-motion honored (no animation, final states shown), every chart has a text/table alternative, the opening slider is a real `input[type=range]`.
9. **Tone.** Warm, curious, playful, second-person, positive. Cozy detective study (Columbo or Poirot, never noir or crime scene). The detective sits on the candidate's side of the table: no courtroom, no "caught", no fear. No alarming or negative-leaning UI words (cut, wrong, error, fail, reject, danger, miss, against, guilty, suspect, caught, trap). Failures are "plot twists", fixes are "what I did next", limits are "fair warning". Shriniwas's honest facts in content fields stay exactly as written.
10. **Curiosity first.** Every chapter ends with a Chapter Seal: a question about what comes next, never a claim. The reader should always have one open question. Creativity lives in form and interaction; facts never change. Maximum delight, minimum risk: one-thumb phone use, no audio, no heavy effects, reduced motion honoured.

## Working method

- Work in stages from `docs/CLAUDE_CODE_PROMPTS.md`. After each stage: run the tests, take screenshots at 390x844 and 1366x650 (Playwright, Chromium), report console errors and what is not working, and stop for review.
- Test with a real browser: tap every control, check invariants, check reduced motion, check the production build for forbidden strings (`lorem`, `TODO`, `[__]`, `SAMPLE`, `DRAFT`).
- If an effect drops below 60fps on a mid-range phone, remove the effect, not the content.
- Do not add features not in the specs. Do not "improve" copy.
- Keep the code small and dependency-free: vanilla HTML, CSS and JS, one build script (`scripts/build.py` or `scripts/build.mjs`) that inlines CSS, JS, fonts and JSON into a single HTML file.

## Repo layout (target)

```
CLAUDE.md
content/content.json      real, sourced content (production)
content/draft.json        drafted scripts (review build only)
docs/                     specs, truth ledger, prompts, context
src/                      template.html, styles.css, app.js (+ modules)
scripts/build.py          builds dist/index.html and dist/review.html
scripts/test.mjs          Playwright tests
dist/                     build output
```

## Who to ask

Shriniwas supplies: his recorded Flow scripts (S02 to S14), repo links, essays, papers, certificates, Lab results, and confirmations listed in the truth check. Ask only when a rule here cannot answer.
