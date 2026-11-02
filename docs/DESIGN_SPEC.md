# Design spec

## Goal

From first paint the page feels like a friendly, cozy detective's study: lamplight, brass, green baize, tea, a mystery the reader is delighted to be invited into. Pure positive energy: curious, warm, a little playful. Never ominous, clinical, bureaucratic or error-like. The reader should smile and lean in within ten seconds.

## Tokens

```
--desk:        #15211B   green baize, felt noise about 5%
--desk-vig:    #0F1713
--lamp:        rgba(255,214,150,0.22)
--paper:       #F6F0E3   (>= 90% brightness at every corner of a sheet)
--paper-edge:  #E9DFC9
--ink:         #231F1A
--muted:       #5E564B   (>= 4.5:1 on paper)
--brass-text:  #8A5E12
--brass-art:   #B8872B
--pencil:      #2F5D8A   blue pencil (editor's strike)
--highlighter: #F7E7A1
--string:      #D2452E   red string rail and case seal art only
--red-text:    #B23A26   rare
--tape:        #E3CFA3   masking tape
--sage:        #7A9B76   Exhibit A "tests" tiles
```
Red is used ONLY for the red-string rail and the case seal (and the envelope wax seal). Interactive and positive things use brass. Fixed single look (no light/dark toggle): set `color-scheme: dark` on :root and explicit backgrounds.

Fonts (embed as base64 woff2, latin subset; no external requests): Fraunces variable (headings, output text, name), Source Serif 4 variable normal and italic (body, question), Courier Prime 400/700 (typewriter raw text, labels, custody strips). Packages: `@fontsource-variable/fraunces`, `@fontsource-variable/source-serif-4`, `@fontsource/courier-prime`. Provide system fallbacks.

Type scale: dossier width min(92vw, 720px). Raw text 15px phone / 17px desktop. Output text (Fraunces) 20px phone / 24px desktop. Subject name 28px or larger. "CASE FILE No. 001" is the largest element. Legend and hint at least 13px, contrast >= 4.5:1.

Motion: ease-out, 250 to 450ms, gentle; no shakes, glitches, flashes. Hover/focus brightens slightly; sheets lift 2px on hover (desktop). All off or static under prefers-reduced-motion.

## Shell

- Top bar: dark green, cream text. "CASE FILE No. 001" left; right: Clues button ("Clues found/N") and jump menu (closed by default).
- Footer in normal flow (not fixed), max 56px: "Case File No. 001 · opened 2 Nov 2026".
- Sheets: cream paper, soft layered shadows, +-0.3 degree alternating tilt, brass index tabs (folded edge) with a hand-lettered label (0, A, B, F, Z); section labels in brass small caps. Max width 760px, centered; on phone nearly edge to edge with about 10px of desk visible.
- Red string rail: thin red line down the left edge (slim strip on phone), drawn by scroll progress, round pins at the top of each visible section, pins fill when reached, tapping a pin jumps there. Decorative (aria-hidden); the jump menu is the accessible path. Starts at the case seal when the opening finishes (skip if hard).
- No fixed or absolute element may cover content or intercept taps. Every decorative layer has `pointer-events: none` and `aria-hidden`. Reserve bottom padding. A small 44px scroll-up chevron at bottom-right only.

## The opening (first screen: one dossier on the desk)

Layout inside the dossier, top to bottom (fits 390x844, 1366x650 and 1850x692 with NO scrolling, including controls and the seal): "CASE FILE No. 001" (Fraunces, large, wide tracking); "SUBJECT:" followed by the subject name covered by two strips of MASKING TAPE; "EXHIBIT 0" label and the question in italics; the text block (hero); the slider with labels `ui.raw` (left) and `ui.flow` (right) and hint `ui.hint`; one-line legend; compact custody chip (tap to expand "Where this came from"); controls (Skip the intro, Take 1 / Take 2, Play it again, Read it plainly); tagline and "Open the file" cue (after the sequence). Everything except the cue renders instantly at load. The dossier drops onto the desk (translateY -20px to 0 over 400ms, shadow tightening). First paint is state p=0: name taped, slider at left, caret hidden, raw text not yet typed.

Dossier details: thin brass corner protector top-left; soft inner paper shadow; manila index tab with folded edge and hand-lettered numeral "0".

### The engine (computed, never hand-marked)

1. Tokenize RAW (split paragraphs on blank lines, words on whitespace) and OUTPUT (whitespace). Normalize for matching: lowercase, strip all non-alphanumeric characters except apostrophes. Word-level LCS. Tokens whose normalized form is empty (for example "...") are raw-only.
2. Build ONE merged token stream of: MATCHED (raw form and output form; punctuation or case may differ), RAW-ONLY (visible only while unresolved), ADDED (output-only; visible only when resolved), BREAK (block-level in raw state, a single space in resolved state).
3. State is driven by one value p in [0,1]: frontier index k = round(p * N). Tokens with index < k are RESOLVED: MATCHED shows its output form in Fraunces; RAW-ONLY collapses to nothing; ADDED expands in with the highlighter wash. Tokens at or after k are UNRESOLVED: MATCHED shows its raw form in Courier Prime (muted ink); RAW-ONLY visible; ADDED collapsed.
4. Collapse/expand: measure each RAW-ONLY and ADDED token's natural width after fonts load and animate max-width (px), opacity and margin over 350ms with `overflow-x: clip; overflow-y: visible` on inline-block tokens (not `overflow: hidden`, which breaks baseline alignment). Collapsed tokens also collapse their margins so no gaps remain. Matched tokens swap text with a 120ms opacity dip.
5. Words being trimmed get a BLUE-PENCIL strike (`--pencil`) for 150ms as the frontier passes forward, then collapse. Dragging backwards simply restores them, no strike. Until the frontier passes, ALL raw text is uniform muted ink (no pre-marked red/blue). Added words get the highlighter wash. Legend: `ui.legend` with inline samples of a struck word and a highlighted word.
6. A thin frontier caret sits between resolved and unresolved text; hidden at p=0 and at p=1.
7. INVARIANTS (automate in tests): at p=0 the visible text equals RAW (whitespace-normalized); at p=1 it equals OUTPUT exactly, with single spaces. Test both takes.

### Timeline (about 11 s, skippable)

1. 0.4 s: TYPING. Reveal the already-laid-out RAW text character by character at about 90 chars/sec (layout never shifts); paragraph breaks pause 0.25 s.
2. Hold 0.5 s. AUTO-TRIM: animate p from 0 to 1 over 3.5 s (ease-in-out); the slider pin travels with it.
3. If the user touches the slider at any time, cancel the auto-run; they have control. Keyboard arrows step one token; Home/End.
4. When p first reaches 1: wait 300 ms, play the CASE SEAL thud, fade in the tagline and the cue "Open the file".
5. Skip button (top-right of the dossier, labelled, 44px, visible from first paint) jumps to p=1 with no typing. Tapping the dossier body also skips. Replay restarts; Take selector (default Take 1) resets and replays.

Slider: native `input[type=range]` min 0, max N, step 1, styled as a red string with a pin handle; `aria-valuetext` "Trimmed k of N words". Haptics (optional, Android, user-driven drags only): `navigator.vibrate(8)` when a drag passes a raw-only token.

### Masking tape name reveal

Two strips of kraft tape (`--tape` at 92% opacity) over the two words of the subject name, slightly torn zigzag ends (clip-path polygon on an inner element), rotated about +-1.5 degrees, faint paper-fiber texture, a small printed "?" on each. They peel away in sync with the trim: tape 1 retracts as p goes 0.55 to 0.8, tape 2 as p goes 0.75 to 1.0 (animate an outer wrapper's clip-path inset; add a small curl at the leading edge if easy). Dragging back re-covers them. The seal and tagline do NOT replay. Visually hidden text always says "Subject: <subject>". Never black bars.

### Case seal

Round rubber stamp in `--string`, double ring, ring text (SVG textPath) "CASE FILE No. 001 - COME IN, DETECTIVE -", centre "OPEN" with a small magnifier glyph, rotated about -8 degrees, multiply blend, imperfect edges. Placed overlapping the dossier's top-right corner so it lands inside the first viewport. Thud animation: scale 1.6 to 1 over 250 ms, small rotation settle, ink spread; plus a brief brass glint on the index tab. API: `seal.play()`. Static under reduced motion.

### Desk lamp, props, atmosphere

- Lamp: warm amber, soft; a radial spotlight that follows the pointer or dragging finger (CSS variables); it darkens only the desk, never the paper (paper stays bright cream at every corner). Static and centred under reduced motion.
- Props (decorative inline SVG, aria-hidden, under 15 KB total; only at viewport width >= 1100px; hidden on phones): left of the dossier a brass banker's lamp (the glow originates here) and a teacup on a saucer; right a magnifying glass, two pencils and a closed notebook with a brass clasp. Flat warm illustration, soft shadows, no text.
- Atmosphere (transform/opacity only; paused when the tab is hidden): about 14 slow dust motes in the lamp beam; a thin wisp of steam from the teacup. Off under reduced motion.
- Easter egg: the teacup is a button (aria-label "Teacup"). Tapping puffs the steam and shows a paper slip with `ui.teaSlip` that fades after 4 s.

## Microcopy (`ui` in content.json)

All visible UI labels come from `ui`. Use `ui.*Title` as section headings. Audit every generated string for negative-leaning words; replace with warm accurate ones. Never edit fact fields.

## Charts (dataviz rules)

One scale per axis, no dual axes; every label names a value the chart reaches; chart text uses theme text tokens; marks thin; direct labels; hover/tap tooltips; a hidden data table for screen readers; recessive grid. Categorical colors fixed in order, never cycled; status colors not reused as series colors.
