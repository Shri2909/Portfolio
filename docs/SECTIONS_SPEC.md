# Sections spec

All text comes from `content/content.json`. Empty field or section: render nothing. Use the friendly design system in `DESIGN_SPEC.md`. Section order and ids: `exhibit0, brief, against, exhibitA, exhibitB, ledger, decisions, lab, wispr, effects, locker, closing, exhibitZ`. Section headings come from `ui.*Title` where defined.

## Build modes

- **Production** (`dist/index.html`): content.json only. Contains no draft/sample code or data.
- **Review** (`dist/review.html`): empty fields filled from `content/draft.json`; filled fields get an amber dotted outline; a diagonal watermark "REVIEW DRAFT - NOT YET SPOKEN BY SHRINIWAS" covers the page. Where a chart needs data that does not exist yet (Lab results), the review build may show clearly watermarked "SAMPLE" numbers that exist only in the review build.

## Common components

1. **CustodyStrip**: small Courier Prime lines under a block with fields Source, Tool, Date, Status, Note; header reads `ui.custody` ("Where this came from"); hide empty fields. If `custody.verified` is true show a small "VERIFIED" stamp; never otherwise.
2. **ExhibitCard**: title, one-line summary, CustodyStrip, optional MAKE YOUR CALL step shown before the card opens (`ui.makeCall`), four beats (What I did / What didn't work / What I learned / What I did next; hide empty), optional CROSS-EXAM accordion (`ui.crossExam` = "Just one more thing..."; hide items with an empty answer), optional VERIFY box (`ui.verify`; steps, a command with a Copy button, expected output, repo link).
3. **MAKE YOUR CALL**: `call = {question, options[], answerIndex, reveal}`. Large tap targets; on answer highlight the right option and show `reveal`; save the choice in localStorage inside try/catch (works without it); then open the card and play the exhibit's visual. A "Just show me" link skips the guess. If no `call`, the card opens directly.

## brief (envelope, leads)

The sheet arrives as a cream envelope with a small vermilion wax seal. At 40% in view it opens by itself (flap lifts 400 ms, letter slides up 450 ms; no tap needed); reduced motion shows it open. Caption `ui.openBriefing` until open. Inside: `ui.greeting`, `brief.summary`, one faint coffee-ring SVG (6%) in a corner. Then `ui.leadsTitle` ("Where shall we start?") with `ui.leadsHint` and `specialties[]` as brass luggage-style tags with a tiny magnifier. Tapping a lead sends the red string from the tag to each exhibit pin in its `exhibits[]` (SVG path, dash-offset draw over 600 ms) and softly highlights those tabs for 3 s; tap again clears. `status: "not_shown"` leads have a dashed border and the label `ui.notYet` and are never hidden. Each lead shows an "Evidence" line and a `ui.worth` line. If a target section is hidden, skip it.

## clues and notebook

`clues[] = {id, section, text, source}`. For each clue whose section is visible, a small brass magnifier tag peeks from that sheet's top edge (gentle wobble every about 8 s; none under reduced motion). Tap: slip "Clue n of N", the text, "Verified in: <source>". Found ids saved in localStorage (try/catch). Top bar button `ui.clues found/N` opens the CLUE NOTEBOOK: a brass-bound panel sliding in from the right (full-screen on phone), pencil-dot progress, found clues with sources, unfound clues as soft "???" lines with `ui.clueLocked` and the section name. Accessible dialog (focus trap, Esc, aria-modal). `ui.notebookEmpty` before any found; `ui.cluesDone` when all found. No timers, no scores, no pressure. N counts only visible clues. Soft brass ping (scale 1 to 1.08, 300 ms) on finding.

## against (Fair warning)

Heading `ui.warningTitle`, subline `ui.warningSub`. `against.reasons[]` (max 3) = {title, text} as three index cards with brass paper clips, slightly tilted. Each card UNFOLDS in place on tap (no flip; keyboard accessible). After the cards, `ui.afterWarning` in italics.

## exhibitA (certgen, "324 passing tests, then a 19-finding audit")

ExhibitCard plus: MAKE YOUR CALL (question, options, reveal from content). THE GRID after the answer: 324 small sage tiles in an 18x18 grid popping in with a quick wave; a thin brass scan line sweeps across; then 19 brass tiles fall in BELOW the grid, outside it, with the caption "19 findings the 324 tests never asked about" and a small seal "19 FINDINGS". Data `exhibitA.stats {tests:324, findings:19}`. Reduced motion: final state. TIMELINE: vertical red-string timeline from `timeline[]` (sequence only, no dates). Cross-exam and verify from content.

## ledger ("Plot twists, and what I did next")

`ledger.cases[] = {id, project, title, what, status: closed|narrowed|dropped|open, resolution}`. Case-file rows with a rubber-stamp status (CLOSED, NARROWED, DROPPED in muted ink; OPEN visually loudest), filter chips by status, counts computed from data, tap to expand what/resolution; rows stack as cards on phone.

## decisions ("Forks in the road")

`decisions.forks[] = {id, title, options[], chosen, evidence, changeMyMind}`. Fork-in-the-road diagram: options as branches, chosen branch drawn in red string, others grey with a "not taken" tag, evidence under the chosen branch, "What would change my mind" as a pull-out slip (hide if empty).

## lab ("The Voice Lab")

`lab = {hypothesis, usableDefinition, preregisteredAt, tasks[] = {name, order: "typing-first"|"voice-first", typing:{seconds, usable, edits}, voice:{seconds, usable, edits}}, notes}`. Always show the banner "n = 1. One person, five tasks. Not a study." If `tasks` is empty but `hypothesis` exists: PRE-REGISTERED stamp with `preregisteredAt`, the hypothesis and `usableDefinition`, and the line "Results pending". If `tasks` has data: paired dumbbell chart (typing dot, voice dot, line between; faster side emphasized; order marker T first / V first; usable icons), computed summary lines only from the data (median seconds each, usable counts, tasks where voice lost) and a programmatic "honest read" sentence, e.g. "Voice was faster on X of N tasks and usable on Y of N." Never write other interpretation. Hidden data table. No example data in production.

## wispr ("Field notes on Wispr")

`wispr.moments[] = {fact, source, date, url, suggests, firstTest, bars?}`; `wispr.pov = {text}`. Five numbered evidence tags; tapping opens a 3-step stepper: 1 OBSERVATION (fact, source, date, link only if url exists), 2 WHAT IT SUGGESTS, 3 FIRST TEST (hide empty steps). Moment 1 also shows two animated bars from `bars` ("Share of installs: about 14%", "Share of in-app-purchase revenue: about 2%") with the caption "Sensor Tower via TechCrunch. Web billing may explain part of the gap." `pov` renders as a separate slip stamped "HYPOTHESIS: NOT A RESULT".

## effects ("Beyond the code")

`effects = {intro, timeline[] = {label, text, date}, items[] = {id, kind, title, tag: document|link|self-reported, url, file, note}, philosophy:{text}}`. Items as evidence bags with a hand-lettered label and a tag stamp: DOCUMENT or LINK (solid), SELF-REPORTED (dashed, muted); tapping opens a detail slip; a PDF opens in a new tab; never block on a missing file. Timeline as a red-string timeline (vertical on phone), no dates unless given. Philosophy as a quiet single card. Render the section only if it has items or at least two timeline events.

## locker ("The evidence drawer")

`locker.repos[] = {name, url, summary, verify:{steps[], command, expected}}`. Render only repos with a url. Drawer cards; tap to open the verify box with steps, command and a Copy button (catch clipboard rejection), expected output. Repo link opens in a new tab.

## closing ("Closing notes, detective")

`closing = {findings[] = {title, text, exhibits[]}, line, openQuestions[] = {q, a, date}, contact:{email, linkedin, github}}`. Three finding cards with red-string links to their exhibits; the closing line in large Fraunces; open questions as dated slips ("Answer of <date>"); a final "YOUR MOVE" block with the contact links from `closing.contact` only (show addresses as selectable text; links are conveniences); the case seal thuds again when scrolled into view. `caseLog[] = {date, entry}` renders as a short dated log; hide if empty.

## exhibitZ (provenance)

`exhibitZ = {statement, builtOn, segments[] = {id, label, spokenWithFlow}}`. Render the statement, `builtOn`, and the segments, each tagged "Spoken with Flow" or "Written from sources" from `spokenWithFlow`. Never assert a segment as spoken unless `spokenWithFlow` is true.

## tour (optional, stage 10)

A "90-second read" button in the top bar guides through exhibit0, against, exhibitA, exhibitB, closing (skip hidden ones) with smooth scrolling, the string animating between pins, a bottom caption "n / total" with Next, Back, Stop; about 15 s per stop; Esc exits; fully keyboard accessible.

## quality bar (stage 11)

Mobile Lighthouse: Performance >= 95, Accessibility 100, Best Practices 100, SEO 100. Total JS under 100 KB gzipped (fonts excluded), zero layout shift, no console errors, no third-party requests. Landmarks, heading order, skip link, text alternatives for every chart. Meta: title "Case File No. 001: Shriniwas Kholkute", description "A portfolio built as a case file. Cross-examine the candidate.", canonical, Open Graph and Twitter tags, a 1200x630 share image (dark green desk, paper sheet reading "CASE FILE No. 001" and "SUBJECT: SHRINIWAS KHOLKUTE", the round seal), favicon set, robots.txt, sitemap.xml, a styled 404 "FILE NOT FOUND". Build guard: fail the production build if any visible text contains `lorem`, `TODO`, `[__]`, `SAMPLE`, `DRAFT`, or if draft/sample data is present.

## Additions v2 (curiosity layer; see EXPERIENCE_DIRECTION.md)

### Chapter Seals
`chapters[] = {id, section, title, teaser}`. After the sheet of `section`, a folded note (cream, soft shadow, brass clip) shows `ui.sealCue` and `teaser` (hide if empty). Tap or Enter scrolls to the next visible chapter; scrolling past it also works. The note gently unfolds when it enters view (once). A small chapter label "Chapter n of N" (visible chapters only) sits on each sheet's tab. No timers, no gating: content is never locked.

### Case Board (replaces the leads tags at viewport >= 768px; tags remain on phone)
A cork-board SVG panel with a pin per visible chapter/exhibit, each labelled with its `chapters[].title`. Tapping a lead (specialty) draws red strings from that lead's note to the pins in its `exhibits[]` and gently pulses them. Pins fill brass when that section has been scrolled to. Tapping a pin scrolls there. The board is also a keyboard-operable list (hidden list alternative). `ui.boardTitle`, `ui.boardHint`.

### Lamp marginalia
The lamp spotlight (pointer, finger drag, or keyboard focus) reveals faint pencil notes in sheet margins. Each note is ONLY a source/custody line already present in content (for example the clue `source`, or an exhibit `custody.source`). Never new claims. Phone: notes show when the lamp circle (tap and drag) passes over them, and are also visible in plain text in each CustodyStrip. `ui.marginaliaHint` shown once, dismissible.

### Detective rank
`ranks[] = {minClues, title}`. The Clues button in the top bar shows `ui.rankLabel` and the current title (highest rank whose minClues <= found). Rank changes with a soft brass ping. Purely playful: no timers, no scores, no leaderboard, nothing locked.

### Thumbprint of the case (Tier B)
After the ledger, an SVG fingerprint whose ridge count, loops and gaps are generated deterministically from data in content.json (counts of ledger statuses, tests 324, findings 19, forks 3, clues 5) using a seeded function. Caption exactly `ui.thumbprintCaption`. Tapping a ridge group highlights its source (for example "9 plot twists"). Decorative; hidden data list for screen readers.

### Roots journey map (Tier B; inside `effects`)
A hand-drawn SVG route that draws itself with scroll: stops come from `effects.timeline[]` in order (plus a final dashed stop "Bengaluru" only if the brief says he is willing to relocate; label it "willing to relocate"). Each stop is a tappable pin opening its text. Phone: vertical route. `ui.journeyTitle`, `ui.journeyNote`. Renders only with at least two timeline stops. Dates only if provided.

### Easter eggs (Tier B; no claims inside any egg)
- Teacup: `ui.teaSlip` (already specified).
- Coffee ring (the faint ring in the brief): tap shows `ui.coffeeRingSlip`.
- Typing the word "elementary" anywhere (not in an input) flickers the lamp once and shows `ui.elementary` for 4 s. Reduced motion: slip only.
- Double-tap the case seal: a slow ink ripple. No sound.
All eggs are optional and have no effect on content.
