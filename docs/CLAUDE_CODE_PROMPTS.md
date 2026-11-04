# Claude Code prompts v2: build Case File No. 001, one delight at a time

How to use: open this repo in Claude Code. Paste ONE stage at a time. After each stage Claude runs the tests, takes screenshots, reports honestly, and stops. Look at the screenshots, then paste the next stage. If something breaks twice, paste the Fix loop at the bottom, not a new stage.

Tiers: **A** must ship. **B** ship if A is solid. **C** only with time left. Skip a B or C stage before rushing an A stage.

The feeling to chase in every stage (from `docs/EXPERIENCE_DIRECTION.md`): a warm study at night, a case file left open for you, a clever guest who keeps wanting to know what comes next. Never fear, never courtroom, never "caught". Creativity is in form and interaction; facts come only from `content/content.json`.

## Paste once at the very start of the session

```
You are building a public portfolio that must make a skeptical founder smile in ten seconds and keep reading to the end. Rules that never bend: (1) never invent copy, numbers, quotes, dates or names; all text comes from content/content.json, empty means render nothing; (2) tone is warm, curious and playful, the detective sits on the candidate's side of the table, no negative UI words; (3) every decorative layer is pointer-events:none and aria-hidden; (4) no audio, no external requests; (5) motion is gentle and reduced-motion shows final states; (6) after every task report what you changed, test results, screenshots, console errors, and anything you could not verify. If you did not test it in a real browser, say "not tested". Never call something working unless a test or screenshot shows it.
```

---

## Stage 0 (A): Read and confirm, no code

```
Read CLAUDE.md, docs/EXPERIENCE_DIRECTION.md, docs/HANDOFF_CONTEXT.md, docs/TRUTH_LEDGER.md, docs/DESIGN_SPEC.md, docs/SECTIONS_SPEC.md, and skim content/content.json and content/draft.json.

Reply with only: (1) the experience in six lines, as the reader would feel it from first screen to last, (2) the three riskiest parts, (3) anything in the specs that contradicts itself or content.json, (4) your proposed file layout. No code yet.
```

## Stage 1 (A): Foundation, build pipeline, the cozy shell

```
Create the skeleton from CLAUDE.md's layout: src/template.html, src/styles.css, src/app.js (plain ES modules, no framework), scripts/build.py, scripts/test.mjs.

build.py: reads content/content.json (and content/draft.json for review), embeds fonts as base64 woff2 (npm install @fontsource-variable/fraunces @fontsource-variable/source-serif-4 @fontsource/courier-prime in a scratch folder; copy only latin woff2 into src/fonts/), inlines CSS, JS and JSON, writes dist/index.html (production) and dist/review.html (empty fields filled from draft.json with an amber dotted outline and the diagonal watermark "REVIEW DRAFT - NOT YET SPOKEN BY SHRINIWAS"). Production must contain no reference to draft.json, the watermark, or sample data. Build guard fails on: lorem, TODO, [__], SAMPLE, DRAFT, draft.

test.mjs: Playwright (Chromium is installed, do not reinstall). Helper opens dist/index.html at 390x844 and 1366x650, saves screenshots to /tmp/shots, fails on any console error or network request.

Shell per DESIGN_SPEC.md: green baize desk with soft felt noise, warm top bar, cream sheets with brass index tabs and a "Chapter n of N" label slot, footer in normal flow, slim red string rail, closed jump menu, skip link, landmarks, reduced-motion handling. Every section component renders nothing when its content is empty.

Make the empty page already feel inviting: the desk, the lamp glow, the top bar. Build, test, screenshot both viewports, report. Stop.
```

## Stage 2 (A): The opening engine (logic first, prove it)

```
Implement the Exhibit 0 engine from DESIGN_SPEC.md "The engine" using exhibit0.takes (Take 1 default, Take 2 selectable): tokenize and normalize, word-level LCS, one merged token stream (MATCHED, RAW-ONLY, ADDED, BREAK), one progress value p with frontier k, measured-width collapse and expand after fonts load, inline-block tokens with overflow-x: clip, native input[type=range] slider, arrow keys step one token.

Prove it with automated tests: p=0 visible text equals raw (whitespace-normalized); p=1 equals output exactly with single spaces; both takes; scrubbing 1 -> 0 -> 1 restores the output. No animation, tape, seal or props yet. Screenshot p=0, 0.5, 1 on 390x844. Stop.
```

## Stage 3 (A): The opening that makes them say "wait, what?"

```
Build the whole first screen exactly as DESIGN_SPEC.md describes, testing after each step:
1. The dossier fits 390x844, 1366x650 and 1850x692 with NO scrolling: CASE FILE No. 001 largest; SUBJECT with the name under two strips of masking tape and a tiny printed "?" on each; EXHIBIT 0 and the italic question; the text block as the hero; the slider as a red string with a pin handle and the labels ui.raw / ui.flow and ui.hint; the one-line legend; the compact custody chip; controls (Skip the intro, Take 1/Take 2, Play it again, Read it plainly). First paint is p=0 with the name taped.
2. The show: typing (about 90 chars/sec, layout never shifts), hold, auto-trim over 3.5 s with the pin travelling along the string, touch cancels the auto-run, Skip visible from first paint, tapping the dossier skips.
3. Tape peel synced to p (tape 1 at 0.55 to 0.8, tape 2 at 0.75 to 1.0), re-covers if dragged back. Hidden text "Subject: Shriniwas Kholkute".
4. Blue-pencil strikes on trimmed words, highlighter wash on added words, the frontier caret.
5. The case seal (SVG, textPath ring "CASE FILE No. 001 - COME IN, DETECTIVE -", centre OPEN with a magnifier) lands with a soft thud when p first reaches 1, then the tagline and the cue "Open the file" fade in. Double-tap the seal: a slow ink ripple.
6. A warm curiosity beat: after the seal, a single small line under the cue appears: the first chapter teaser (chapters[0].teaser). Nothing else.

Tests: every control tappable under touch emulation, nothing overlays the controls, invariants still pass, reduced motion shows the final state, first paint under 1 s on a throttled mobile profile. Screenshots at five moments on both viewports. Report honestly what looks off. Stop.
```

## Stage 4 (A): The lamp, the margins, the cosy desk

```
Add the atmosphere: a pointer/finger/focus-following warm lamp spotlight that only darkens the desk (paper stays bright), 14 slow dust motes, teacup steam, and at viewport >= 1100px inline SVG desk props (brass banker's lamp, teacup and saucer on the left; magnifying glass, two pencils, notebook with brass clasp on the right), under 15 KB total.

Add LAMP MARGINALIA (SECTIONS_SPEC "Lamp marginalia"): faint pencil notes in sheet margins revealed where the lamp passes. Each note is only a source/custody line already in content. Show ui.marginaliaHint once, dismissible. The teacup is a real button: puff of steam plus the paper slip ui.teaSlip for 4 s. Coffee ring tap shows ui.coffeeRingSlip. Typing "elementary" outside inputs flickers the lamp once and shows ui.elementary.

Rules: transform and opacity only, paused when the tab is hidden, everything pointer-events:none except the teacup and ring, aria-hidden on decor, off under reduced motion. Check frame rate under 4x CPU throttle; if it drops, remove the effect, not the content. Screenshots. Stop.
```

## Stage 5 (A): The briefing, the case board, clues and rank

```
Build (SECTIONS_SPEC "brief", "clues and notebook", "Case Board", "Detective rank"):
- The cream envelope that opens by itself at 40% in view, ui.greeting, brief.summary (only if filled), faint coffee ring.
- Leads: brass luggage tags on phone; at >= 768px the CASE BOARD cork panel with pins and red strings that draw (SVG dash-offset) to related exhibits and pulse them. not_shown leads have a dashed border and ui.notYet. Keyboard-operable list alternative.
- Clue magnifiers on each sheet (gentle wobble every about 8 s; none under reduced motion), the Clues button with the current rank title, and the brass-bound notebook dialog (focus trap, Esc, aria-modal; found clues with sources; unfound clues as soft "???" with ui.clueLocked and the section name). localStorage in try/catch. A soft brass ping on finding a clue or ranking up. Nothing is locked; no timers; no scores.

Tests: tap every lead, pin and clue under touch emulation; each lead's string lands on a visible pin; notebook opens and closes; rank updates; everything works with localStorage disabled. Screenshots. Stop.
```

## Stage 6 (A): Fair warning and the Chapter Seals that keep them reading

```
Build (a) the Fair warning section: three index cards with brass paper clips, slightly tilted, each UNFOLDING in place on tap, keyboard accessible; ui.warningTitle, ui.warningSub, ui.afterWarning in italics. It renders only when against.reasons has text, so test in the review build too. Frame it as generosity, not confession: warm, a little smiley.
(b) The global CHAPTER SEALS from SECTIONS_SPEC: after each visible chapter, a folded note with ui.sealCue and that chapter's teaser; tap or Enter scrolls to the next visible chapter; unfolds once when it enters view. Chapter labels "Chapter n of N" on the tabs count only visible chapters.

Tests: seals skip hidden chapters; the last chapter shows no seal; chapter numbers stay correct in production (sparse) and review (full). Screenshots. Stop.
```

## Stage 7 (A): Exhibit A, 324 tiles and a second pair of eyes

```
Build Exhibit A per SECTIONS_SPEC: ExhibitCard with custody strip; MAKE YOUR CALL from exhibitA.call (large tap targets, "Just show me" skip, reveal text, choice saved in try/catch localStorage); then the grid: 324 sage tiles popping in with a quick wave, a thin brass scan line sweeping across, then 19 brass tiles falling in BELOW the grid with the caption "19 findings the 324 tests never asked about" and a small "19 FINDINGS" seal. Tapping a tile shows "Test n of 324" or "Finding n of 19"; never invent finding names. The vertical red-string timeline from exhibitA.timeline. Beats, cross-exam (ui.crossExam "Just one more thing...") and verify blocks render only when filled. Hidden data table. Reduced motion shows the final state.

Verify programmatically: exactly 324 sage tiles and 19 brass tiles. Screenshots. Stop.
```

## Stage 8 (A): Exhibit B, the honest boundary

```
Build Exhibit B: hand-built SVG boundary chart (log-log; x symbols subscribed 1 to 1,000; y index speedup over full scan; a 1x break-even line labelled "break-even: above it the index wins"; plot only boundary.points; a dashed gap labelled "crossover not measured here"; dots draw in from the left on scroll; tap a dot for its label; hidden data table), the contamination strip (10 dots, 9 turn brass one by one), the chips (MODELED chip dashed), MAKE YOUR CALL.

CONFIRMATION GATE: while exhibitB.boundary.confirmed is false, production renders ONLY the 40.6x point, hides the 0.585 point, the call and any claim about 1,000 symbols; the review build shows everything. Test both builds. Follow the dataviz rules (one scale per axis, direct labels, thin marks, recessive grid, text from theme tokens). Screenshots. Stop.
```

## Stage 9 (A + B): Plot twists, forks and the thumbprint

```
Build the ledger "Plot twists, and what I did next": case-file rows, rubber-stamp status (CLOSED, NARROWED, DROPPED in muted ink; the single OPEN stamp visually loudest and friendliest, with a small "still investigating" feel, not alarm), filter chips, counts computed from data, tap to expand, cards on phone. Hide cases with requiresConfirmation while exhibitB.boundary.confirmed is false.

Build Forks in the road: options as branches, chosen branch drawn in red string, others grey with "not taken", evidence under the chosen branch, the "What would change my mind" pull-out slip (hidden when empty).

TIER B: the Thumbprint of the case (SECTIONS_SPEC): a deterministic SVG fingerprint generated from content counts, caption exactly ui.thumbprintCaption, tap a ridge group to highlight its source, hidden data list.

Tests: counts match data; filters work by touch; the OPEN stamp exists exactly once in production. Screenshots. Stop.
```

## Stage 10 (A + B): Roots, the human chapter

```
Build "Beyond the code" (effects): render only with items or at least two timeline events. Evidence bags with a hand-lettered label and a tag stamp (DOCUMENT, LINK solid; SELF-REPORTED dashed and muted), tap opens a detail slip, PDFs open in a new tab, never block on a missing file. Philosophy as one quiet card.

TIER B: the ROUTE SO FAR journey map: a hand-drawn SVG route that draws itself with scroll; one tappable pin per effects.timeline stop; a final dashed stop for Bengaluru only if the brief says willing to relocate, labelled "willing to relocate"; vertical on phone. ui.journeyTitle, ui.journeyNote. Warm and gentle: this chapter is where the reader says "oh, I like this person".

Test with the review build (draft timeline) and confirm production hides the whole section while empty. Screenshots. Stop.
```

## Stage 11 (A): The Voice Lab and Field notes on Wispr

```
Build the Voice Lab: the banner ui.labBanner always; the PRE-REGISTERED stamp with lab.preregisteredAt when a hypothesis exists, plus hypothesis and usable definition and "Results pending"; when tasks have data, the paired dumbbell chart (typing dot, voice dot, line between, faster side emphasized, order marker, usable icons), every summary line computed from data, and one programmatic honest-read sentence like "Voice was faster on X of N tasks and usable on Y of N." Never write other interpretation. Hidden data table. Production never contains review-only sample data.

Build Field notes on Wispr: five numbered evidence tags, each opening a 3-step stepper (1 OBSERVATION with source, date and a link only if url exists; 2 WHAT IT SUGGESTS; 3 FIRST TEST; hide empty steps); the India bars (14% of installs vs 2% of in-app-purchase revenue) animate in with the caption "Sensor Tower via TechCrunch. Web billing may explain part of the gap."; the point-of-view slip stamped "HYPOTHESIS: NOT A RESULT" only if text exists. Make it feel like a curious friend sharing homework.

Tests in both builds. Screenshots. Stop.
```

## Stage 12 (A): Evidence drawer, closing notes, provenance

```
Build the evidence drawer (only repos with a url; verify box with steps, command, a Copy button that catches clipboard rejection, expected output), the closing notes (three finding cards connected to their exhibits by red string, the closing line in large Fraunces, dated open-question slips, YOUR MOVE with closing.contact links shown as selectable text, the seal thuds again when scrolled into view, caseLog), and Exhibit Z (statement, builtOn, and one row per segment tagged "Spoken with Flow" ONLY when spokenWithFlow is true, otherwise "Written from sources"; show a segment only if its section has content).

End the page on delight: after the closing line, one final seal note: "Case open. Come ask me anything." only if it exists in content; otherwise nothing. Tests in both builds. Screenshots. Stop.
```

## Stage 13 (B/C): The delight pass

```
Polish, do not add scope. (1) Micro-interactions: pressed states, a gentle paper lift on hover, the string tightening when a pin is tapped, the notebook ping. (2) Confirm every easter egg works and none contains a claim. (3) TIER C only if time: the 90-second guided read from SECTIONS_SPEC "tour". (4) Walk the whole page on a 390x844 touch emulation as a curious stranger and list five moments that could be more delightful; implement only the two cheapest.

Report before/after screenshots. Stop.
```

## Stage 14 (A): Quality, warm-words audit, share assets

```
In this order:
1. Founder review: look at the first screen on 390x844 and 1366x650 and list the three weakest things; fix them without adding features (spacing, contrast, tap targets, timing).
2. Warm-words audit: grep every visible UI string (not his fact fields) for cut, wrong, error, fail, reject, danger, miss, against, guilty, suspect, caught, trap, interrogate; replace with warm accurate wording.
3. Accessibility: keyboard-only walkthrough, visible focus, heading order, landmarks, text alternatives for every chart and the 324-tile grid, reduced motion, contrast >= 4.5:1, 44px targets; axe-core via Playwright with zero violations.
4. Performance: Lighthouse mobile >= 95 performance, 100 for accessibility, best practices and SEO; JS under 100 KB gzipped (fonts excluded); zero layout shift; no third-party requests.
5. Share assets: title "Case File No. 001: Shriniwas Kholkute", meta description, canonical, Open Graph and Twitter tags, a 1200x630 share image drawn in code (green desk, paper sheet reading CASE FILE No. 001 and SUBJECT: SHRINIWAS KHOLKUTE, the round seal), favicon set, robots.txt, sitemap.xml, a styled 404 "FILE NOT FOUND" with a friendly line.
Report numbers, not adjectives. Stop.
```

## Stage 15 (A): Load the recorded voice (after Shriniwas records with Flow)

```
The raw Flow text files are in content/recordings/ (S02_brief.txt ... S14_close.txt). For each, place the text into the matching fields of content/content.json without changing a word (split paragraphs only where the script has bold headings). Mapping: S02 brief.summary; S03 against.reasons[i].text (titles from draft.json); S04 exhibitA.beats and crossExam; S06 exhibitB.beats and crossExam; S08 effects.intro and the timeline in spoken order; S09 decisions.forks[i].changeMyMind; S10 effects.philosophy.text; S11 appended to effects.intro; S12 lab.hypothesis, usableDefinition and preregisteredAt (the date he states); S13 wispr.moments[i].suggests and firstTest and wispr.pov.text; S14 closing.findings, line and openQuestions. Where a recording is missing leave the field empty. For each filled script set the matching exhibitZ.segments[].spokenWithFlow to true. Rebuild, run every test, and show a diff of content.json. Touch nothing I did not record. Stop.
```

## Stage 16 (A): Publish and verify live

```
Publish dist/index.html to GitHub Pages from a public repo: confirm the build guard passes and no review code exists; put index.html, robots.txt, 404.html at the publishing root; commit; enable Pages with gh; wait for the live URL to return 200; then run the Stage 14 Lighthouse and axe checks and the 390x844 tap tests against the LIVE URL. Report the URL and results. Do not announce success until the live URL passes.
```

---

## Fix loop (when something is broken)

```
Something is wrong: <one line, with viewport and the exact tap or action>. In order, no new features: (1) reproduce with Playwright, capture a screenshot and the console; (2) state the root cause in two sentences; (3) fix the smallest thing that removes it; (4) add a regression test; (5) re-run every earlier stage's tests and list which pass. If a decorative layer steals taps, the fix is pointer-events:none on that layer, not a z-index change.
```

## Founder review (use any time)

```
Open the production build at 390x844 as a busy startup founder with a thumb and 60 seconds. Walk the page. Tell me: where did you smile, where did you get bored, where did you want to tap and could not, what question were you left with at each chapter's end, and what is the one thing that would make you forward this page to a colleague. Fix only taps, spacing and timing. Show screenshots.
```
