# Build log

Newest first. Honest reporting: "not tested" means nobody ran it.

# FINAL SUMMARY (after M5), 3 Nov 2026

## What is done
- The whole page, in two builds from one source: `dist/index.html` (production, `content.json` only, the build guard passes, no draft or sample code or data) and `dist/review.html` (empty fields filled from `draft.json`, amber outlines, watermark). Static, no backend, no external requests, fonts embedded, 433 KB.
- All nine chapters and every A-tier device: the taped-name opening with the computed word-diff string, the cosy desk (lamp, motes, props, teacup, pencil marginalia), the envelope briefing, leads and case board with red strings, clues, notebook and rank, Fair warning cards, Chapter Seals, Exhibit A (324 plus 19 tiles), Exhibit B (honest boundary chart, contamination strip, chips), the plot-twist ledger, forks, Roots, the Voice Lab, Field notes on Wispr, the evidence drawer, closing notes, Exhibit Z.
- B-tier: thumbprint of the case, journey map (review build only for now). C-tier: the 90-second read. Easter eggs: teacup, coffee ring, "elementary", double-tap seal.
- Share assets: Open Graph and Twitter tags, a 1200x630 image drawn in code, favicons, `robots.txt`, `sitemap.xml`, styled 404.
- Final check (`node scripts/final.mjs`): build guard passed; zero console errors; zero network requests; every visible button (40 in production, 59 in review) tapped under touch emulation without a failure; axe-core zero violations. Full test suite (`node scripts/test.mjs`): 395 checks pass, covering the above plus the invariants, fit at 390x844, 1366x650 and 1850x692, reduced motion, localStorage off, keyboard walk (90 stops), headings, landmarks and 44px targets.
- Numbers, 4x CPU throttle on a phone profile, production: first contentful paint about 200 ms, largest paint about 450 to 570 ms, 60 fps through the opening, no layout shift outside the text block, zero resources fetched, JS 29 KB gzipped.

## What is partly done
- **Production shows only what exists in `content.json`.** These sections are hidden in production until his text arrives: Fair warning, Roots (and the journey map), the Voice Lab, the evidence drawer; the briefing has no summary; Exhibits A and B have no beats, cross-exam or verify box; Field notes have only the observations (no "what it suggests" or "first test", no point-of-view slip); the closing shows only the dated case log (no findings, line, open questions or contact). The review build shows all of them from the drafts.
- **Exhibit B confirmation gate.** The 0.585 point, the call, ledger case c6, the crossover sentence, the 1,000-symbol lead evidence and the "until it was worse" title are removed from the production file at build time until `exhibitB.boundary.confirmed` is true.
- **Lab results chart** is built and tested with test-supplied data; the site has no results yet.
- **Canonical URL, absolute `og:image` and sitemap `<loc>`** need the public address: build with `SITE_URL=https://... python3 scripts/build.py`.
- **Video demos are `.webm`** (no mp4: no H.264 encoder on this machine).

## What is not done
- **Stage 15 (loading his recordings) and Stage 16 (publishing)**: skipped on purpose, they need his go-ahead. Nothing has been pushed, no Pages, nothing published.
- **Lighthouse** was not run (not installed; the brief said to install nothing extra). The underlying metrics above were measured directly.
- **Not tested at all:** real phones, Safari, Firefox, a screen reader, Android haptics.

## What Shriniwas must supply next
1. The Flow recordings S02 to S14, as text files in `content/recordings/` (`docs/FLOW_SCRIPTS.md`); each one fills the sections listed above and flips its Exhibit Z tag to "Spoken with Flow" only when it really was.
2. Repo links for Blitz, Vigil, PitDB, certgen and TipIndex (they unlock the evidence drawer), plus his email, LinkedIn and GitHub for YOUR MOVE.
3. Essays, papers, certificates (or "self-reported" labels) for Roots, and the Lab results, with the pre-registration date.
4. The ticks in `docs/TRUTH_CHECK.md`, including confirming ledger case c2 (Blitz) and the "full working knowledge" line.
5. **The TipIndex README direction of 0.585** (does 0.585 mean the index lost at 1,000 symbols?). Until he confirms it and `boundary.confirmed` is set, production hides that half of Exhibit B.
6. Which tool built the page (`exhibitZ.builtOn`), the public URL (for `SITE_URL`), a short read of the 404 line and of the chrome strings listed in each milestone entry below.

## Every screenshot
- `previews/M1/` (23 screenshots, `demo.webm`, `gallery.html`, `index.html`, `review.html`): `screenshots/laptop-1-first-paint.png`, `screenshots/laptop-2-typing.png`, `screenshots/laptop-3-mid-trim.png`, `screenshots/laptop-4-tape-half-peeled.png`, `screenshots/laptop-5-seal-landed.png`, `screenshots/laptop-6-take2-landed.png`, `screenshots/laptop-7-custody-open.png`, `screenshots/laptop-8-read-plainly.png`, `screenshots/phone-1-first-paint.png`, `screenshots/phone-10-review-build.png`, `screenshots/phone-2-typing.png`, `screenshots/phone-3-mid-trim.png`, `screenshots/phone-4-tape-half-peeled.png`, `screenshots/phone-5-seal-landed.png`, `screenshots/phone-6-take2-landed.png`, `screenshots/phone-7-custody-open.png`, `screenshots/phone-8-read-plainly.png`, `screenshots/phone-9-reduced-motion.png`, `screenshots/wide-1-first-paint.png`, `screenshots/wide-2-typing.png`, `screenshots/wide-3-mid-trim.png`, `screenshots/wide-4-tape-half-peeled.png`, `screenshots/wide-5-seal-landed.png`
- `previews/M2/` (12 screenshots, `demo.webm`, `gallery.html`, `index.html`, `review.html`): `screenshots/laptop-1-opening-lamp.png`, `screenshots/laptop-2-case-board.png`, `screenshots/laptop-3-fair-warning.png`, `screenshots/phone-1-opening-with-clues-button.png`, `screenshots/phone-2-envelope-closed.png`, `screenshots/phone-3-envelope-open.png`, `screenshots/phone-4-lead-tapped.png`, `screenshots/phone-5-chapter-seal.png`, `screenshots/phone-6-fair-warning.png`, `screenshots/phone-7-clue-slip.png`, `screenshots/phone-8-notebook.png`, `screenshots/wide-1-props-and-tea.png`
- `previews/M3/` (23 screenshots, `demo.webm`, `gallery.html`, `index.html`, `review.html`): `screenshots/laptop-1-exhibit-a-call.png`, `screenshots/laptop-10-ledger-filtered.png`, `screenshots/laptop-11-forks.png`, `screenshots/laptop-2-exhibit-a-reveal.png`, `screenshots/laptop-3-tiles-scan.png`, `screenshots/laptop-4-tiles-findings.png`, `screenshots/laptop-5-timeline.png`, `screenshots/laptop-6-exhibit-b-top.png`, `screenshots/laptop-7-boundary-chart.png`, `screenshots/laptop-8-contamination-chips.png`, `screenshots/laptop-9-ledger.png`, `screenshots/phone-1-exhibit-a-call.png`, `screenshots/phone-10-ledger-filtered.png`, `screenshots/phone-11-forks.png`, `screenshots/phone-12-review-two-points.png`, `screenshots/phone-2-exhibit-a-reveal.png`, `screenshots/phone-3-tiles-scan.png`, `screenshots/phone-4-tiles-findings.png`, `screenshots/phone-5-timeline.png`, `screenshots/phone-6-exhibit-b-top.png`, `screenshots/phone-7-boundary-chart.png`, `screenshots/phone-8-contamination-chips.png`, `screenshots/phone-9-ledger.png`
- `previews/M4/` (17 screenshots, `demo.webm`, `gallery.html`, `index.html`, `review.html`): `screenshots/laptop-1-opening.png`, `screenshots/laptop-2-briefing.png`, `screenshots/laptop-3-wispr-india.png`, `screenshots/laptop-4-closing.png`, `screenshots/laptop-5-exhibit-z.png`, `screenshots/phone-1-opening.png`, `screenshots/phone-10-review-closing-string.png`, `screenshots/phone-11-404.png`, `screenshots/phone-2-briefing.png`, `screenshots/phone-3-wispr-india.png`, `screenshots/phone-4-closing.png`, `screenshots/phone-5-exhibit-z.png`, `screenshots/phone-6-review-roots.png`, `screenshots/phone-7-review-lab.png`, `screenshots/phone-8-review-wispr-stepper.png`, `screenshots/phone-9-review-closing.png`, `screenshots/share-image-og.png`
- `previews/M5/` (11 screenshots, `demo.webm`, `gallery.html`, `index.html`, `review.html`): `screenshots/laptop-1-thumbprint.png`, `screenshots/laptop-2-menu-with-tour.png`, `screenshots/laptop-3-tour.png`, `screenshots/phone-1-thumbprint.png`, `screenshots/phone-2-menu-with-tour.png`, `screenshots/phone-3-tour.png`, `screenshots/phone-4-journey-drawing.png`, `screenshots/phone-5-journey-complete.png`, `screenshots/wide-1-elementary.png`, `screenshots/wide-2-teacup.png`, `screenshots/wide-3-paper-lift.png`
- `previews/final/` (51 screenshots, `demo.webm`, `gallery.html`, `index.html`, `review.html`): `screenshots/m3-laptop-1-exhibit-a-call.png`, `screenshots/m3-laptop-10-ledger-filtered.png`, `screenshots/m3-laptop-11-forks.png`, `screenshots/m3-laptop-2-exhibit-a-reveal.png`, `screenshots/m3-laptop-3-tiles-scan.png`, `screenshots/m3-laptop-4-tiles-findings.png`, `screenshots/m3-laptop-5-timeline.png`, `screenshots/m3-laptop-6-exhibit-b-top.png`, `screenshots/m3-laptop-7-boundary-chart.png`, `screenshots/m3-laptop-8-contamination-chips.png`, `screenshots/m3-laptop-9-ledger.png`, `screenshots/m3-phone-1-exhibit-a-call.png`, `screenshots/m3-phone-10-ledger-filtered.png`, `screenshots/m3-phone-11-forks.png`, `screenshots/m3-phone-12-review-two-points.png`, `screenshots/m3-phone-2-exhibit-a-reveal.png`, `screenshots/m3-phone-3-tiles-scan.png`, `screenshots/m3-phone-4-tiles-findings.png`, `screenshots/m3-phone-5-timeline.png`, `screenshots/m3-phone-6-exhibit-b-top.png`, `screenshots/m3-phone-7-boundary-chart.png`, `screenshots/m3-phone-8-contamination-chips.png`, `screenshots/m3-phone-9-ledger.png`, `screenshots/m4-laptop-1-opening.png`, `screenshots/m4-laptop-2-briefing.png`, `screenshots/m4-laptop-3-wispr-india.png`, `screenshots/m4-laptop-4-closing.png`, `screenshots/m4-laptop-5-exhibit-z.png`, `screenshots/m4-phone-1-opening.png`, `screenshots/m4-phone-10-review-closing-string.png`, `screenshots/m4-phone-11-404.png`, `screenshots/m4-phone-2-briefing.png`, `screenshots/m4-phone-3-wispr-india.png`, `screenshots/m4-phone-4-closing.png`, `screenshots/m4-phone-5-exhibit-z.png`, `screenshots/m4-phone-6-review-roots.png`, `screenshots/m4-phone-7-review-lab.png`, `screenshots/m4-phone-8-review-wispr-stepper.png`, `screenshots/m4-phone-9-review-closing.png`, `screenshots/m5-laptop-1-thumbprint.png`, `screenshots/m5-laptop-2-menu-with-tour.png`, `screenshots/m5-laptop-3-tour.png`, `screenshots/m5-phone-1-thumbprint.png`, `screenshots/m5-phone-2-menu-with-tour.png`, `screenshots/m5-phone-3-tour.png`, `screenshots/m5-phone-4-journey-drawing.png`, `screenshots/m5-phone-5-journey-complete.png`, `screenshots/m5-wide-1-elementary.png`, `screenshots/m5-wide-2-teacup.png`, `screenshots/m5-wide-3-paper-lift.png`, `screenshots/share-image-og.png`

## Milestone entries

---

## M5 "The delight layer" (B-tier: thumbprint, journey map, delight pass; C-tier: the 90-second read)

### What changed
- **Thumbprint of the case (`90-thumbprint.js`).** A new sheet after the ledger. A seeded function draws concentric, wobbling, gapped ridges; the groups come from the counts in the file (forks, clues, ledger cases, audit findings, and the 324 tests drawn as 18 ridges). The caption is exactly `ui.thumbprintCaption`. Tap a ridge group in the print or one of the chips to see its source ("9 plot twists"). The print is decorative (`aria-hidden`), with a hidden text list. Deterministic: identical after a reload and different when the counts change (both tested).
- **Journey map (inside Roots).** A hand-drawn SVG route, vertical, that draws itself with scroll; one 44px pin per timeline stop that opens its text; a dashed final stop "Bengaluru, willing to relocate" only when the brief itself says so; hidden with fewer than two stops; fully drawn under reduced motion. It exists in the review build only, because production has no Roots content yet.
- **Delight pass.** A gentle paper lift on hover (desktop), the red rail string tightens when a board pin is tapped, the earlier pressed states and notebook ping stay. Every easter egg works and its text comes from `ui` (tested: no numbers, no claims): teacup, coffee ring, "elementary", double-tap seal.
- **The 90-second read (C-tier, built because time remained).** Starts from the top of the chapter menu; walks through the opening, Fair warning, Exhibit A, Exhibit B and the closing (hidden ones skipped: four stops in production, five in review); about 15 s a stop with a progress bar; "n / total", Back, Next, Stop; Esc leaves and returns focus; no auto-advance under reduced motion.
- **A real bug found on the way:** the envelope opens while you scroll past it, which changes the page height under a smooth scroll, so seals, the tour and pins landed hundreds of pixels short. `CF.goTo` now re-aims once the scroll settles.

### Tests
All stages together: 395 checks pass. M5 adds 31: thumbprint order, caption, ridge counts, chip and in-print taps, determinism; journey map in review, with and without the relocation sentence, with fewer than two stops, scroll-drawn, reduced motion; eggs and hover lift; the tour (menu entry, captions, skipping, Back/Next, scroll position, Esc and focus return, auto-advance after 15 s, review's five stops, reduced motion).

### Five moments that could be more delightful (curious-stranger walk); the two cheapest are done
1. A sheet should lift under the pointer. **Done.** 2. Tapping a pin should make the string feel pulled tight. **Done.** 3. A tiny stamp on tapping a tile in Exhibit A. 4. The Lab dots could swing in. 5. The "Open the file" arrow could bob. (3 to 5 are not built.)

### Not verified
Real phones, Safari and Firefox, a screen reader, Lighthouse, Android haptics.

---

## M4 "Every A-tier chapter" (Stages 10 without the journey map, 11, 12, 14)

### What changed
- **Stage 10, Roots (`80-effects.js`).** Renders only with items or at least two timeline events (so it exists in the review build, not in production). Intro paragraphs, red-string timeline (dates only if given), evidence bags (DOCUMENT and LINK solid, SELF-REPORTED dashed and muted; tap opens a detail slip; a PDF or link opens in a new tab with noopener; a missing file never blocks), one quiet philosophy card.
- **Stage 11.** The Voice Lab (`82-lab.js`): the banner `ui.labBanner`, PRE-REGISTERED stamp with `preregisteredAt`, hypothesis, usable definition, "Results pending". With results: paired dumbbell rows (typing dot, voice dot, line, larger dot on the faster side, T first / V first, usable marks), hidden data table, summary lines computed from the data (medians, usable counts, tasks where voice lost) and one computed honest-read sentence. Field notes on Wispr (`84-wispr.js`): five numbered tags, three-step stepper with empty steps hidden (no stepper when only the observation exists), link only when `url` exists, the India bars on one 0 to 20% scale with the exact caption, the "HYPOTHESIS: NOT A RESULT" slip only when text exists.
- **Stage 12.** Evidence drawer (`86-locker.js`, only repos with a url; verify box with steps, command and Copy that survives a refused clipboard, expected output, repo link). Closing notes (`88-closing.js`): finding cards with red-string buttons to their exhibits (reuses `CF.pageStrings`), the closing line in large Fraunces, dated "Answer of" slips, YOUR MOVE from `closing.contact` only (selectable text plus link), the case log, and the seal that thuds again when scrolled into view. Exhibit Z: statement, `builtOn`, and a row per segment whose section has content, tagged "Spoken with Flow" only when `spokenWithFlow` is true.
- **Stage 14.** Share assets (`scripts/assets.mjs` draws `dist/og.png` 1200x630, `favicon-32.png`, `apple-touch-icon.png`; `build.py` writes `favicon.svg`, `robots.txt`, `sitemap.xml`, the styled `404.html`, and Open Graph, Twitter and apple-touch tags). Accessibility fixes found by axe (see below). Warm-words audit.

### Tests
All stages together: 364+ checks pass (`node scripts/test.mjs`). New ones: Roots hidden when empty and shown from the draft; bags with test-supplied items; Lab pre-registration state and, with test-supplied results, the computed medians, usable counts, tasks where voice lost, the honest-read sentence, larger-dot emphasis and order markers (the site never contains sample results); Wispr tags, steps, link rule, bar widths (70% and 10% of the track), caption, POV slip; drawer with test-supplied repo links, Copy accepted and refused; closing in production (case log only) and review; strings from findings land on their pins; YOUR MOVE with test-supplied contact data; Exhibit Z flags literal (only the opening takes are "Spoken with Flow"); meta tags and share files; JS size; warm-words scan of every `ui` string and every string literal in the source; axe-core with zero violations in six states (production phone and laptop, review phone with every section opened, review laptop, notebook dialog, plain-reading dialog); heading order; landmarks; every visible control at least 44x44; a 90-stop keyboard walk where every stop shows a focus indicator.

### Numbers (4x CPU throttle, phone, production)
FCP about 180 to 200 ms, LCP about 450 ms, long-task blocking about 150 ms, zero resources fetched, layout shift outside the text block under 0.001. Inline JS 101 KB raw, 29 KB gzipped (fonts excluded). Whole page 417 KB with fonts and data.
**Lighthouse was not run**: it is not installed and the brief says to install nothing beyond the Stage 1 packages. The numbers above come from the same browser metrics; treat the Lighthouse score as unmeasured. `axe-core` itself was installed (dev dependency) because the brief requires an axe run.

### Accessibility fixes the axe run forced
`.clues` accessible name now contains its visible text; chapter seals are `div`s (duplicate landmarks); the envelope button has a name once the caption disappears; the "19 FINDINGS" seal text uses the red-text token (contrast); the custody panel title is not a stray `h3` after the `h1`; disclosure panels are not unlabeled regions; the range input has a real outline when focused.

### Decisions
- **Production data for the Lab, Roots, drawer and contact is empty**, so those sections do not exist in `index.html` yet; the closing shows only the dated case log.
- **Canonical, `og:image` absolute URL, sitemap `<loc>`** need the final public address. `build.py` reads `SITE_URL` from the environment; without it the sitemap is an empty `<urlset>`, there is no canonical, and `og:image` is the relative `og.png`. Set `SITE_URL=https://...` at publish time (Stage 16).
- **404 line** ("This page wandered off, detective. The rest of the file is right where you left it.") is new chrome copy the spec asked for ("a friendly line"); please read it.
- Chrome strings added in this milestone: "The plot twist", "What I did next" (ledger labels), "Observation", "What it suggests", "First test", "Built on", "Exhibit Z", "Usable means", "Back to the file", "Open the document", "Median typing...", "Usable: typing a of N...", "Tasks where voice lost" (spec's wording), the honest-read sentence (spec's wording).
- Exhibit Z lists "PitDB" in production because the ledger section is visible; the PitDB note itself exists only in the review build.
- **Founder review of the first screen** (three weakest things): (1) for the first 0.4 s the hero is an empty block before typing starts; (2) on a phone the top bar is crowded (title, Clues with rank, menu); (3) the seal slightly overlaps the end of the name. I changed none of them: the first is the intended beat, the second fits and passes tap-target tests, and the third is the stamp doing its job.

### Not verified
Real phones, Safari and Firefox, a screen reader, Lighthouse.

---

## M3 "The exhibits" (Stages 7, 8, 9: ledger and forks)

### What changed
- **Shared parts (`70-exhibit.js`).** Exhibit card (title, one-line summary, custody strip, optional Make Your Call, body that opens after the call), custody strip (Source, Tool, Date, Status, Note, hidden when empty, VERIFIED only if `verified` is true), four beats (labels from the spec, empty ones hidden), cross-exam accordion (`ui.crossExam`, items with an empty answer hidden), verify box (steps, command with a Copy button that catches clipboard refusal and selects the text instead, expected output, repo link; hidden when empty), red-string timeline that draws when seen. Make Your Call saves the pick in localStorage (try/catch); a saved pick reopens the card with the reveal; "Just show me" skips.
- **Exhibit A.** 324 sage tiles (18x18) pop in as a wave, a brass scan line sweeps, 19 brass tiles fall in below the grid with the caption "19 findings the 324 tests never asked about" and a "19 FINDINGS" seal. Both numbers come from `exhibitA.stats`. Tap or arrow-key a tile for "Test n of 324" / "Finding n of 19" (no invented finding names). Text-alternative table. Reduced motion: final state.
- **Exhibit B.** Hand-built SVG chart, log scales, 1x break-even line labelled, only `boundary.points` plotted, a dashed gap labelled "crossover not measured here" when there are two points, dots (real 44px buttons) that animate in from the left, tap a dot for its label, data table. Contamination strip (10 dots, 9 turn brass one by one), chips (MODELED dashed), call.
- **Confirmation gate, done at build time.** While `boundary.confirmed` is false, `scripts/build.py` removes the unverified TipIndex claims from the production file itself: the 0.585 point, the call, ledger case c6, the crossover sentence of `boundary.note`, the 1,000-symbol sentence in lead s3's evidence, and the title "...until it was worse". The string "0.585" is not anywhere in `dist/index.html` (tested). The Exhibit B heading in production falls back to the part of the summary before the colon ("TipIndex"). The review build keeps everything.
- **Ledger.** Case rows with rubber stamps (CLOSED, NARROWED, DROPPED muted; the single OPEN stamp bigger, filled brass, gently breathing), filter chips with counts computed from the data, tap to expand ("The plot twist" / "What I did next"; the PitDB note from the draft in the review build).
- **Forks.** Chosen branch in red string, others grey with "not taken", evidence under the chosen branch, "What would change my mind" slip (hidden while empty).

### Tests
Stages 7, 8, 9 added (about 85 checks); all stages together: 290 pass. They check exactly 324 sage and 19 brass tiles, the caption and seal text, tile status text, keyboard navigation, timeline order, hidden-when-empty beats/cross-exam/verify in production versus filled and amber-outlined in review, the full call flow (answer, reveal, saved pick, "Just show me", localStorage off, reduced motion), chart axes, labels, dots, the production gate (no 0.585, no call, one dot, no crossover) versus the review build (two dots, gap line, call), contamination dots, dashed MODELED chip, ledger counts and filters by touch, exactly one OPEN stamp, stamp weight, forks structure and colours.

### Bugs found while building
- A CSS class name clash (`.t` for tiles also matched the opening's name text) broke the opening layout; tiles are now `.tile`. The chart tick class `.tk` also clashed with the opening's token class; renamed `.axl`.
- Visually hidden data tables (`position:absolute` tables) widened the layout viewport on phones; the table now sits in a `div.sr-only`.

### Decisions / caveats
- Ledger case c2 (Blitz) is live in production; TRUTH_CHECK says to confirm it with Shriniwas first. I left it in because it is in `content.json` without `requiresConfirmation`.
- The "What I did / What didn't work / What I learned / What I did next" labels and "The plot twist" are chrome strings I added.
- The tiles only play when scrolled into view, so a static screenshot taken without scrolling shows the grid space empty.

---

## M2 "The cosy desk and the board" (Stages 4, 5, 6)

Run straight on after M1 at the user's request (no stop between M1 and M5; the user approved moving on).

### What changed
- **Stage 4 (`src/js/40-atmosphere.js`, `src/css/10-atmosphere.css`).** Lamp glow is one fixed layer moved with `transform` only; it follows a pointer, a dragging finger (touchmove) or keyboard focus, and sits under every sheet so paper stays cream. 14 dust motes (transform and opacity, paused when the tab is hidden). Desk props (banker's lamp, teacup, magnifier, pencils, notebook) as inline SVG, 3.8 KB, only at 1100px and up and only where there is room beside the dossier; decorative and aria-hidden. The teacup is a real button (`ui.teaSlip` for 4 s, steam puffs). Typing "elementary" outside inputs flickers the lamp and shows `ui.elementary`. Pencil marginalia: each note is exactly an existing source line (dossier: `exhibit0.custody.source`; later sheets: custody source or clue source), faint until the lamp passes or focus is inside its sheet; `ui.marginaliaHint` shows once and can be dismissed. Reduced motion: lamp static and centred, no motes, no steam, notes still reveal.
- **Stage 5 (`50-clues.js`, `60-brief.js`).** Cream envelope with a wax seal that opens by itself at 40% in view (button too; open at load under reduced motion); greeting, `brief.summary` paragraphs (only if filled), a faint coffee ring (`ui.coffeeRingSlip`). Leads as brass tags (dashed and "Not shown yet" for `not_shown`, never hidden). Tapping a lead draws a red string (SVG, dash-offset over 600 ms) from the tag to each visible exhibit pin, highlights those tabs for 3 s, tap again clears; hidden targets are skipped. From 768px the leads sit on a cork case board with a pin per visible chapter that fill brass when scrolled to. Clue magnifiers peek from sheet edges (wobble about every 8 s), a modal clue slip ("Clue n of N", text, "Verified in: source"), top-bar Clues button with the friendly rank, brass-bound notebook dialog (full-screen on phone, focus trap, Esc, found clues with sources, "???" plus `ui.clueLocked` plus the section name for the rest, `ui.notebookEmpty`, `ui.cluesDone`). Found clues saved in localStorage inside try/catch.
- **Stage 6 (`55-seals.js`, `65-against.js`).** Fair warning: up to three index cards with brass paper clips that unfold in place (button, aria-expanded, Enter and Space); renders only when reasons have text (so it exists in the review build, not in production). Chapter Seals: folded notes with `ui.sealCue` and the chapter teaser, tap or Enter goes to the next chapter, unfolds once on entering view; chapter labels "Chapter n of N" count only visible chapters.

### Tests (`node scripts/test.mjs 1 2 3 4 5 6`)
209+ checks pass. New ones cover: lamp follow (mouse, touch, keyboard focus), paper under the lamp, 14 motes, props under 15 KB and outside the dossier, teacup and elementary slips, pencil note equals `custody.source` and is lit only near the lamp, hint shown once, frame rate with everything on at 4x CPU throttle (53 fps), envelope auto-open, leads (44px, dashed not-shown), strings landing on pins within 14px (phone: rail pins; 1100px: board pins; with test-only stand-in exhibit sheets because the real exhibits arrive in M3), clue dialog, rank, localStorage save, reload, notebook modal and focus trap, `localStorage` disabled, coffee ring, Fair warning unfold by touch and keyboard, seals unfold once and go to the next chapter, reduced motion.

### Bugs the tests caught and I fixed
- Native `append(null)` printed the word "null" (custody panel from M1 and the notebook). All appends that can receive null now go through `put()`; a regression check looks for stray "null".
- The invisible seal hung 8px past the dossier and widened the layout viewport on phones (393px instead of 390px). Seal pulled in, `overflow-x: clip` on `html`, and the horizontal-scroll test now compares against the nominal width (the M1 test could not see this).
- String ends used pin positions from before the lead-info panel pushed the layout down; `draw()` now re-places the pins first and strings redraw on layout changes.

### Decisions
- **Page order.** The spec's section list puts lab and wispr before effects; the chapters list (and EXPERIENCE_DIRECTION) put Roots before the Lab. I followed the chapters: exhibit0, brief, against, exhibitA, exhibitB, ledger, decisions, effects, lab, wispr, locker, closing, exhibitZ.
- **Chapter ownership.** A chapter owns the sheets after the previous chapter's anchor up to its own anchor (so Exhibit A and B form "The Builder's Bench", ledger and forks form "Plot Twists and Forks"). No seal after chapter 1: the opening's own cue and teaser already play that role.
- **Brief in production.** `brief.summary` is empty in `content.json`, so production shows the envelope, greeting and leads only.
- **Clue tag on the opening** peeks from the bottom edge (its top edge sits under the top bar).
- **Rail pins** stay non-tappable (see M1).
- Top-bar Clues button is two lines on phones ("Clues 0/N" over the rank) so it fits next to the title.

### Not verified
Real phone and Safari/Firefox; screen readers; the strings against the real exhibits (M3); Android haptics.

---

## M1 "The opening" (Stages 1, 2, 3), Mon 2 Nov 2026

### What changed

- **Pipeline.** `scripts/build.py` writes `dist/index.html` (production: `content.json` only) and `dist/review.html` (empty fields filled from `draft.json`, amber dotted outline on filled fields, diagonal watermark "REVIEW DRAFT - NOT YET SPOKEN BY SHRINIWAS"). Everything is inlined: CSS, JS (`src/js/*.js` concatenated in filename order into one IIFE), JSON, and five base64 latin woff2 fonts (Fraunces variable, Source Serif 4 variable normal and italic, Courier Prime 400 and 700). Production is built from `content.json` with dev notes stripped (`_meta`, `exhibit0.excludedTakes`, `brief.note`, `wispr.moments[].note`). Review-only code (`src/review/`) is appended to `review.html` only. Build guard fails the production build on `lorem`, `TODO`, `[__]`, `SAMPLE`, `DRAFT`, `draft` (base64 font payloads excluded from the scan). Both builds are about 300 KB.
- **Shell.** Green baize desk with felt noise and vignette, warm lamp glow (CSS variables ready for the Stage 4 spotlight), sticky dark top bar, skip link, landmarks, footer in normal flow (max 56px, `ui.footer`), slim red string rail (decorative, draws with scroll, pins fill when reached), jump menu component (renders only with two or more visible chapters, so it is absent in M1), cream `.sheet` with brass tab for later chapters, reduced-motion handling. Sections render nothing when empty.
- **Engine (Stage 2).** `src/js/10-engine.js`: normalize, word-level LCS, one merged stream of MATCHED / RAW-ONLY / ADDED / BREAK tokens, `textAt(stream, k)`. Verified by tests, for both takes, at the state level and at the DOM level (geometry and opacity after transitions settle).
- **The opening (Stage 3).** `src/js/30-opening.js`: dossier with brass corner protector and manila tab "0"; "CASE FILE No. 001" largest; SUBJECT with the name under two torn strips of masking tape (peel synced to p: tape 1 at 0.55 to 0.8, tape 2 at 0.75 to 1.0, curl at the leading edge, re-covers when dragged back); italic question; the text hero with inline-block tokens, measured-width collapse and expand, blue-pencil strikes going forward only, highlighter wash on added words, brass frontier caret; native `input[type=range]` styled as a red string with a pin (`aria-valuetext` "Trimmed k of N words"); typing at about 90 chars/s with layout reserved, 0.5 s hold, 3.5 s auto-trim; touch or keys on the string cancel the auto-run; Skip and tapping the dossier body skip; Take 1/Take 2, Play it again, Read it plainly (modal dialog with both texts); compact custody chip that expands "Where this came from" (no VERIFIED stamp while `verified` is false); the case seal (SVG textPath ring, OPEN with a magnifier, rough-edge filter, multiply blend) lands 300 ms after p first reaches 1, with a brass glint on the tab; the hint turns into the tagline; "Open the file" and the first chapter's teaser fade in; double-tap the seal for a slow ink ripple. Optional vibrate(8) on Android drags that pass a trimmed word.
- **Tests.** `scripts/test.mjs` (Playwright, Chromium), `scripts/lib.mjs`, `scripts/shot.mjs`, `scripts/preview.mjs` (builds the milestone folder).

### Test results (`node scripts/test.mjs 1 2 3`)

121 passed, 0 failed. Highlights:

- Both builds, phone and laptop: zero console errors, zero network requests, one h1, landmarks, decorative layers `pointer-events:none` and `aria-hidden`, embedded fonts loaded, no http resource tags.
- Production file contains none of lorem, TODO, [__], SAMPLE, DRAFT, draft, nor any review code.
- Invariants for Take 1 and Take 2: p=0 shows RAW, p=1 shows OUTPUT exactly with single spaces, scrub 1 to 0 to 1 restores the output (state level and DOM level).
- Fit with no scrolling at 390x844, 1366x650 and 1850x692, at first paint and landed, Take 1 and Take 2.
- Nothing overlays any control (`elementFromPoint`) at all three viewports before and after landing. This caught two real bugs, now fixed: the invisible seal intercepted taps on Skip, and the intro box covered the left-column buttons on the laptop layout.
- The slider, controls and dossier bottom do not move at 21 frontier positions for both takes (the text block reserves the height of its tallest sampled state).
- Real touch drag (CDP touch events) takes control and moves the pin; the auto-run stays cancelled.
- Tap tests: Skip, dossier body, Take 2, Take 1, Play it again, Read it plainly (dialog, Esc), custody chip, Open the file; double-tap on the seal.
- Reduced motion: final state at load, no drop animation, string still works. localStorage disabled: no errors.
- First contentful paint under 1000 ms at 4x CPU throttle (3 runs). Frame rate over the whole run at 4x CPU throttle: 60 fps average, 0 to 1 slow frames of 635.

### Screenshots and recording

`previews/M1/screenshots/` (23 PNGs): phone, laptop and wide at first paint, typing, mid-trim, tape half peeled, seal landed; phone and laptop Take 2 landed, custody open, Read it plainly; phone reduced motion and the review build. `previews/M1/demo.webm` (390x844, 36 s: the full opening, scrubbing the string, Take 2, custody chip, Read it plainly). `previews/M1/gallery.html` ties it together.

### Console errors

None in any test run.

### Not verified or not done

- **No mp4.** This machine has no system ffmpeg, and the Playwright-bundled one only has a VP8 encoder, so the recording is `demo.webm`. Chrome, Edge, Firefox and Android play it; older iOS Safari may not.
- Real phones: not tested. Only Chromium touch emulation and CDP touch events.
- Firefox and Safari: not tested (range-input styling has `-moz` rules but no run).
- Screen reader: not tested (no AT here). Structure is built for it: both texts in a visually hidden block, the animated block is `aria-hidden`, a dialog for plain reading.
- Android haptics: not tested.
- Lighthouse and axe-core: not run yet (Stage 14).
- Review build: the draft fills 85 fields, but none is drawn in M1 (those sections arrive later), so nothing is outlined yet; the watermark is shown.

### Decisions where specs conflicted or could not be met literally

1. **Playwright and Chromium.** npm's Playwright (1.64) wants Chromium 1248; installed is 1234. Not reinstalled; tests launch the installed binary via `executablePath`.
2. **Video.** Playwright's `recordVideo` needs a newer bundled ffmpeg than installed. I record Chromium's screencast over CDP and encode with the installed ffmpeg (VP8 only), so `.webm`.
3. **Fit on a phone (390x844).** The spec's sizes do not all fit at once. Kept the layout and trimmed: raw text 14px and output text 19px on phones shorter than 900px (15px and 20px at 900px and taller, and on tablets and up); heading 29px; name 28px (scaled 25 to 28 on narrow phones); the Exhibit 0 label sits inline with the question; hint is 13px.
4. **Skip button.** Spec says top-right. On phones it collided with the title, so it sits bottom-left, exactly where "Open the file" appears afterwards (and in the thumb zone). From 600px up it is top-right as specced.
5. **Wide and short screens (laptops).** Spec says dossier `min(92vw, 720px)`. At 1366x650 a single 720px column cannot fit everything, so from 900px wide and up to 800px tall the dossier is two columns (title, subject, question and controls left; text, string, tagline, cue right), width `min(94vw, 1000px)`. Taller desktops get the 720px column.
6. **Red string rail pins** are not tappable. The spec says "tapping a pin jumps there" but also "no absolute element may intercept taps"; CLAUDE.md wins. The jump menu is the path.
7. **Title vs name size.** The title must be the largest element and the name 28px or larger; on phones they are 29px and 28px.
8. **Layout-shift API.** While the trim runs, words reflow inside the fixed-size text block. Chrome scores that as 1.35 (nothing outside the block moves; test checks this). Watch it in Stage 14 if the quality bar counts it.
9. **Fonts before mount.** `boot()` waits for the embedded fonts (max 400 ms) before mounting, so measured widths and the reserved text-block height are right the first time.
10. **Dev notes stripped from production data** so the `draft` guard passes: `_meta`, `exhibit0.excludedTakes`, `brief.note`, `wispr.moments[].note`.
11. **Chapter label** "Chapter n of N" is built but hidden when fewer than two chapters are visible (nothing to count yet).

### UI strings I added that are not in `content.json` (please read once)

"CASE FILE No. 001" (top bar and heading, per spec), "SUBJECT:" (per spec), "Skip to the file" (skip link), aria labels "Chapters" and "Takes", "Close" (dialog button, uses `ui.close` if you add it), "Trimmed k of N words" (per spec), "VERIFIED" (per spec, never shown now), the custody row names Source, Tool, Date, Recorded, Status, Note, and the "Recorded" row, which combines the take label with `recordedAt` from your content.

### Rules check (CLAUDE.md)

No invented copy or numbers. No audio. No external requests (test-enforced). Take 3 stays excluded. "Spoken with Flow" is not claimed anywhere yet. Warm-words grep over the visible UI strings: not yet run as a full audit (Stage 14); none of the banned words is in the opening's chrome.
