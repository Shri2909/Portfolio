# EK DIYA SE DOOSRA V3: ONE CONSOLIDATED IMPLEMENTATION BRIEF

For: Claude Code, working in the repo `Shri2909/Portfolio`, on a new branch cut from `ek-diya-se-doosra`.
From: Shriniwas Kholkute (via six research and design agents, merged).
Date written: 3 November 2026. Submission closes 4 November 2026 (no hour published): treat tonight as the deadline.

This single file contains everything: what to fix, the new page flow, the new copy, the new growth idea, the new "Meet Shriniwas" section, the Invite-me fix, the acceptance tests and the open questions. You do not need any other file except the repo itself and `reference/content.json`.

---

## HOW TO USE THIS FILE

1. Read all of it before changing anything. Then work in the phases in PART H. Commit after every phase and push the branch. Keep a `BUILD_LOG_V3.md` (done, partly done, skipped, not verified).
2. Work on a new branch named `v3-flow-and-growth`, cut from `ek-diya-se-doosra`. Never force-push. Do not touch `main`.
3. The existing page (React 18 + Vite, no backend, no analytics, no storage, no third-party requests) stays. This brief changes its flow, copy, a few components and its bugs. It does not change the concept (a Deepavali night, six lamps, a wish card, a row of lamps in the link).
4. Source of truth order: (a) the truth rules in PART A; (b) the copy in PART E (the new `website_copy`); (c) the facts in `reference/content.json` and `docs/TRUTH_LEDGER.md`; (d) the rest of this file. If two parts of this file disagree, PART G (Reconciliations) decides.
5. `CLAUDE.md` in the repo describes the earlier build. Where it conflicts with this brief on structure or features, this brief wins. Keep every truth, privacy and accessibility rule in it.
6. Anything unconfirmed is a SLOT behind a flag that defaults OFF. Do not invent text to fill a slot. Never put a `[CONFIRM]`, `[FILL IN]` or `{SLOT}` marker on the published page.
7. The previous prompts file `build_prompts.md` is now out of date for structure. Do not run it.

## WHAT SHRINIWAS ASKED FOR, AND WHERE IT IS DELIVERED

| # | Request after seeing the site | Delivered in |
|---|---|---|
| 1 | The flow of events must feel natural, easy, interesting, with awe moments, smooth transitions, impressive at a glance, never overwhelming | PART C (new running order, awe moments, overwhelm limits) |
| 2 | A more natural 70/30 English/Hinglish blend, and the whole draft rewritten in a more unique, interesting way | PART E (full v3 copy; device "a guest on the terrace") |
| 3 | His interests (essay, debating, research coordination, experimentation and validation) and "who I am, how I work, what I bring" in the first half, not locked in the drawer | PART D (Meet Shriniwas) and PART C Act 2 |
| 4 | The Hinglish growth test replaced by a researched, original, out-of-the-box idea, grounded in Wispr's own official statements, with links | PART F (The Handover Test) |
| 5 | "Invite me" is not working properly | PART B (root causes, Invite sheet, exact fix) |
| 6 | Layout problems seen on laptop and phone (lamp row cut off, dock covering lamps and the voice slider) | PART B |
| 7 | One file Claude Code can implement from | this file |

## CURRENT STATE OF THE SITE (what exists)

Branch `ek-diya-se-doosra`: React 18 + Vite, system fonts, one canvas for effects, store in memory only, `src/data/copy.json`, components in `src/components/`, styles in `src/styles/`, build `npm run build`, unit tests `npm test`, `npm run check`. A production preview served at http://127.0.0.1:4173 and a dev server at http://127.0.0.1:5199 (dev exposes `window.__ek`). Screenshots of the current experience may exist in `~/Desktop/ek-diya-screenshots`.

## PART A: NON-NEGOTIABLE RULES (carry over, plus new)

1. Truth. Facts and numbers only from `reference/content.json`, `docs/TRUTH_LEDGER.md` and PART E. Never claim growth wins, channel ownership, measured lift, customers, production deployment or hiring outcomes. The growth test is PROPOSED, NOT RUN: no result, no sample, no lift, no Wispr data. "Spoken with Wispr Flow" appears only on Take 1 and Take 2. Do not claim the page was built by voice. Held-out numbers (TipIndex 40.62x and 0.585; PitDB 629.70x, 2.7x, 26.5x, 1.08x) never appear. The PitDB card keeps the label "Phir kya hua". Print no festival date; spell "Deepavali"; the sign-off swaps to "Shukriya. — Shriniwas" after 9 November by a date in the code.
2. Tone and register. Reader is addressed with "aap" forms, never "tum" (a quoted title such as a film name is the only exception). No deity imagery, puja instructions or blessings, no lecturing about crackers, no gift or hamper imagery. Interface words written by us avoid: cut, wrong, error, fail, reject, danger, miss, against, guilty, suspect, caught, trap. (Facts in the evidence bodies keep their original words.)
3. Language blend: about 70% English and 30% Hinglish by word count, natural and mixed inside sentences, romanised. English carries numbers, definitions and every Fair warning. Hinglish carries hooks, transitions, hints, the wish step and the closure. Wrap visible Hinglish in `lang="hi-Latn"`; keep Hinglish out of aria labels and error strings; page `lang="en-IN"`.
4. Privacy and static: no backend, no database, no cookies, no analytics, no storage of any kind, no third-party request on load. The wish text lives in memory only. The only outbound navigation is a visitor's own tap (Gmail, Outlook, mail app, WhatsApp, Drive, GitHub, official Wispr pages).
5. Accessibility: semantic HTML, keyboard operable, visible focus, 44px targets (inline text links excepted), AA contrast, `prefers-reduced-motion` and the Calm control honoured, every interaction has an always-visible plain-text twin, a full-text view exists, no audio ever, haptics Android-only and optional.
6. Performance: 60fps on a mid-range Android; auto quality tiers stay; at most 3 simultaneous effects on any screen (PART C).
7. Never invent copy. If a field is empty, render nothing for it.

## OPEN QUESTIONS ONLY SHRINIWAS CAN ANSWER (leave the flags OFF until he does)

Do not block on these. Ship with every slot hidden. Each answer unlocks a flag in PART D.

1. Debate: motion or topic | your side | level (intra-college or inter-college) | number of teams if known | one lesson in 20 words or fewer. Flag `meet.debate.filled`.
2. Research coordination: the project in one line | what each of the four people did | what you coordinated (task split, deadlines, merging) | one outcome. Flag `meet.research.filled`.
3. Essay: is "Who Audits the Auditor?" the Berggruen essay? Submitted or something else? Is the Drive link open to anyone? The central idea in one sentence of yours. Flags `meet.essay.berggruen`, `meet.essay.idea`.
4. Roots: keep the father's-accident sentence, yes or no? Is the exam order (JEE twice, then Physics Wallah) confirmed? Flags `meet.roots.father`, `meet.roots.examOrder`.
5. TipIndex rule timing: was the 3.0 s limit set before attempt one, or only after? (The evidence folder says after; the ledger says "predeclared"; this brief uses the folder wording.)
6. Your own working loop in 30 words, as you would say it to a friend. Flag `meet.loop.ownWords`.
7. Optional: one business case you studied and what it taught you; anything you tested outside the five projects (class, club, side project). Flags `meet.roots.case`, `meet.outside`.
8. The tool you actually used to build this page, for footer line 5 (never guessed by Claude Code). Whether a real Flow-into-builder recording exists.
9. Confirm the PitDB approvals that were yours (then the label may change to "Maine phir kya kiya").
10. Is he, in fact, the person who sets up phones for relatives at home? (Only to decide whether the growth section may say so. Default: it does not.)


---

# PART B: BUGS TO FIX FIRST (Invite me, layout, dock), with fixes proven by CSS injection

**Note on current branch state:** after PART B was written, the branch received the commits `Pack 8: audit report, build log` (adds `docs/PACK8_AUDIT.md`) and `Fix desktop opening layout, dock overlap, voice slider clearance, skyline visibility` (touches `src/styles/scene.css` and `src/styles/story.css`). That commit already applies part of the layout and slider fixes below. Before changing any CSS, read the current `scene.css`, `story.css`, `base.css` and `lamps.css`, compare with the rules below, and apply only what is still missing, so nothing is duplicated or fought. The Invite sheet, the closure invisible-link fix, the wrong lamp number, the string-lights control, the top bar and the 44px targets are NOT yet fixed. Re-measure with the viewport table after your changes.


## 1. INVITE ME: root causes (with evidence)

All four buttons are plain `<a href="mailto:...">` from `contactHref()` (src/lib/mail.js:6-13): top bar (TopBar.jsx:22), closure (Closure.jsx:128), 60-second dialog (SixtyDialog.jsx:24), full-text view (FullTextView.jsx:156). Nothing else exists: no copy-address, no web-mail link, no confirmation.

R1 (main cause): a mailto link needs an OS/browser mail handler. Playwright on prod: click navigates nowhere (`url same: true`, scroll 0, no popup, no dialog, announcer empty); Chromium only logs `Launched external handler for 'mailto:...'`. On a laptop with no configured mail app, or Gmail used in a tab (the normal Wispr-reviewer case), the click looks dead: no feedback, no fallback. This is "not working properly".

R2: the closure button is invisible but live. `.cl-fade{opacity:0}` (src/styles/story.css:60) applies until `ended`, which needs all 5 lamps lit and the section scrolled in. With lamps unlit, I scrolled to `#closure` at 1366x768: screenshot `closure_unlit_1366.png` shows an empty dark screen; `.cl-invite a` has opacity 0 but `elementFromPoint` at its position returns the button, a force click launched the mail handler, and Tab lands on it as "INVITE ME TO AN INTERVIEW [INVISIBLE]" plus invisible résumé and Evidence links. So a click on blank space can fire mailto, and a keyboard user focuses something they cannot see. Also, the visible closure Invite only exists at the very end of a ~8000px page; the only early one is the top bar.

R3: wrong or stale lamp number in the body. TopBar.jsx:22 builds the href at render time with `row.count + 1` and does not subscribe to the store. Closure uses `base + 1` (Closure.jsx:128), SixtyDialog `vl ? row.count : null`. Test with `#v1.5.Asha`: top bar says "My lamp number on your page: 6" before the visitor lit anything (they have no lamp yet); after lighting, closure says 6 but the top bar says 7. Claim "my lamp number" must exist only after `visitorLit`.

R4: top-bar button gives no help: no scroll, no sheet, no copy. The address is shown only in the closure (Closure.jsx:130, `.addr`), not in the top bar or the 60-second dialog.

R5: `contactHref()` returns `'#'` if only linkedin is missing and email absent (mail.js:8). Today email is set and LinkedIn is `null`, so that path is not hit, but if the email were ever blanked, `inviteVisible()` hides the button (good) and `#` is never rendered. OK, but with LinkedIn alone the link would be a plain same-tab navigation away from the page (no target/rel).

Checked and fine: href is correct and well encoded (`mailto:shrniwaskholkute2282@gmail.com?subject=Interview%3A%20Ek%20Diya%20Se%20Doosra&body=...%0D%0A...`, CRLF, `%20` not `+`); Enter on the link launches the handler; Space does nothing (normal for links); the link inside the native `<dialog>` is not blocked (click launched). Not covered by the dock at 1366x768 or 390x844 (top bar is on top, z-index 5 over dock 4). Total mailto length 238 chars.

## 2. Fix design: one InviteSheet that always works

Make every INVITE ME a `<button>` that opens `InviteSheet` (native `<dialog>` via the existing `Overlay`, bottom sheet on phones). Keep the direct links as paths inside it. No backend, no third-party request until the user taps a link.

Files: new `src/components/InviteSheet.jsx`, `src/lib/mail.js` (add builders), `src/lib/nav.js` (`openInvite`/overlay `'invite'`), edit TopBar, Closure, SixtyDialog, FullTextView, App.jsx (mount sheet), `src/data/copy.json` (`ui.extra.*`).

Structure:
```
<Overlay id="invite" titleId="invite-h" open={overlay==='invite'} onClose=closeOverlay>
  <div class="overlay-in invite">
    <div class="overlay-head"><h2 id="invite-h" data-title>{X('inviteTitle')}</h2><button class="btn" onClick=close>{ui.close}</button></div>
    <p>{X('inviteLead')}</p>
    <p class="mono addr" id="invite-addr" tabIndex=0>{email}</p>          // always visible, user-select:all
    <ul class="invite-paths">
      <li><a class="btn btn-primary" href={gmailUrl} target="_blank" rel="noopener noreferrer">{X('inviteGmail')}</a></li>
      <li><a class="btn" href={outlookUrl} target="_blank" rel="noopener noreferrer">{X('inviteOutlook')}</a></li>
      <li><a class="btn" href={mailtoUrl}>{X('inviteMailApp')}</a></li>
      <li><button class="btn" onClick=copyAddr>{X('inviteCopyAddr')}</button></li>
      <li><button class="btn" onClick=copyMsg>{X('inviteCopyMsg')}</button></li>
    </ul>
    <p class="mono sub" role="status" aria-live="polite">{copied}</p>      // "Copied" confirmation, 2.5 s
    <details><summary>{X('invitePreview')}</summary><pre>{subject + body}</pre></details>
    {linkedin && <a class="btn btn-ghost" href={linkedin} target="_blank" rel="noopener noreferrer">{X('inviteLinkedin')}</a>}
  </div>
</Overlay>
```
- Order: on `(pointer: coarse)` put "Open my mail app" first (phones have a handler); on desktop Gmail first. Do not use `window.open` (popup blockers); use anchors with `target=_blank rel="noopener noreferrer"`.
- Build the URLs at open time with `getState()` (fixes R3). Lamp line: include "My lamp number on your page: N" only if `visitorLit` (N = `row.count`); otherwise omit that line and the blank before it.
- Copy helper: try `navigator.clipboard.writeText` (needs https or localhost), on failure fall back to a hidden readonly `<textarea>`, `select()`, `setSelectionRange(0,len)`, `document.execCommand('copy')` (needed for iOS and http). If both fail, select the visible address (`getSelection().selectAllChildren`) and set the status text to the "press Ctrl+C" line. Status text goes in the `role=status` element (also screen-reader visible). Do not call `announce()` twice.
- LinkedIn empty: render nothing for it (CLAUDE.md rule 1); the visible address is the fallback. `inviteVisible()` stays email-or-linkedin; if only LinkedIn exists, the sheet shows just the LinkedIn button plus Copy link.
- Focus/Escape: Overlay already focuses `[data-title]`, handles Escape and focus return. When the opener is the top-bar button, `opener` is retained. From inside the 60-second dialog (single `overlay` value in the store), opening Invite replaces it; acceptable, but set focus return to `#night-h` (already the fallback in Overlay.jsx:19).
- Accessible names: buttons carry visible text; keep `aria-label` identical to visible text plus a suffix (`", opens a form with ways to write"`); the Gmail/Outlook links add `", opens a new tab"`. Min 44px (`.btn` already `--tap`).
- Closure: remove `cl-fade` from `.cl-invite` (or give `.cl-invite` `visibility:hidden` until ended) and keep it out of the tab order while hidden. Add a visible INVITE ME near the middle of the page (after Verdict) so it is never only at the end.
- FullTextView: show plain text address, Gmail link, mailto link and the message (no JS needed).

Copy keys to add under `ui.extra` (CLAUDE.md: no banned words, content is new UI text for Shriniwas to approve): `inviteTitle` "Write to Shriniwas", `inviteLead` "Pick whatever is easiest. Nothing is sent from this page.", `inviteGmail` "Open Gmail", `inviteOutlook` "Open Outlook", `inviteMailApp` "Open my mail app", `inviteCopyAddr` "Copy the address", `inviteCopyMsg` "Copy the whole message", `inviteCopied` "Copied", `inviteCopyFail` "Select the address above and press Ctrl+C (Cmd+C on Mac)", `invitePreview` "See the message", `inviteLinkedin` "Message on LinkedIn" (only if the link is filled), `inviteTabAria` ", opens a new tab". Reuse `emailSubject`/`emailBody`.

Exact URL formats (build with `encodeURIComponent` on each value, newlines as `%0A`, never `+`):
- Gmail: `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=<email>&su=<subject>&body=<body>` (264 chars today). Note: `cm`=compose, `fs=1` full screen, `tf=1` open in a tab. For users with several Google accounts Gmail asks which one. Parameter is `su`, not `subject`.
- Outlook web (personal): `https://outlook.live.com/mail/0/deeplink/compose?to=<email>&subject=<subject>&body=<body>` (270 chars). Work/school accounts use `https://outlook.office.com/mail/deeplink/compose?...` (same params); offer only the live one or both with labels "Outlook" and "Outlook (work)".
- mailto: `mailto:<email>?subject=<subject>&body=<body>`; body newlines `%0D%0A` (current behaviour), spaces `%20`. Do not encode the `@` in the address part.
- Limits: browsers and servers truncate or reject long URLs around 2,000 characters (IE/old Outlook ~2,083; Gmail web is reliable below ~2,000; many mobile mail apps cut `body` earlier). Our URLs are 238 to 270 chars, far under. Keep subject under 100 chars and body under 800 encoded chars; do not add unbounded user text (the wish name or lamp text) to the body.

## 3. Layout bugs: measurements (before) and proven fixes

Measured on production preview (y values in px, `lamp` = bottom of `.lamp-btn`).

| viewport | h1 (top-bottom) | lamp buttons y | dock top | result before |
|---|---|---|---|---|
| 1366x768 | 195-488 (4 lines) | 723-798 | 706 | lamps cut at 768; dock over lamps 3 and 4 |
| 1366x650 | 177-471 | 705-780 | 588 | lamps entirely below the fold |
| 1280x720 | 187-481 | 716-790 | 658 | lamps cut |
| 1440x900 | 214-508 | 743-817 | 838 | ok, tight |
| 1920x1080 | 241-535 | 770-844 | 1018 | ok |
| 390x844 | 206-310 | 531-595 | 730 | ok |
| 360x640 | 175-274 | 495-554 | 526 (2-row dock) | dock covers lamps 1 to 6 |
| 412x915 | 217-326 | 548-612 | 853 | ok |
| 768x1024 | 233-505 | 738-801 | 962 | ok |

Causes: `#night h1` is `clamp(1.9rem, 8.2vw, 4.25rem)` (base.css:16) inside `.night-copy{max-width:36rem}` (scene.css:128), so at laptop widths it is 68px in 4 lines (~293px); `#night{padding-top:max(96px,15svh)}` (base.css:46); fixed `#dock` (base.css:53) wraps to two rows on small phones. Hold hint and progress pill (`.status-line` margin 2px, `.hold-label`, lamps.css:7-8) sit 2px apart on separate dark plates.

### Proposed CSS (src/styles/base.css, scene.css, lamps.css, story.css) and result

Injected as `fix1.css` and re-measured:
```css
#night h1 { font-size: clamp(1.75rem, min(8.2vw, 6.4svh + 1.1rem), 4.25rem); }
@media (min-width: 900px) { .night-copy { max-width: 46rem; } }
#night { padding-top: max(72px, min(15svh, 120px)); padding-bottom: 16px; }
#night .kicker { margin-bottom: .25rem; } #night .lines { margin-bottom: .2em; } #night .ask { margin-bottom: .35em; }
.lamp-stage { margin-top: 4px; } .home-wrap { margin-top: 12px; }
.status-line { margin: 6px 0 8px; } .hold-label { margin: 0 0 12px; }          /* hold hint spacing */
@media (min-width: 1024px) and (max-height: 860px) { .lamp-stage { --ls: 52px; } }
@media (max-height: 700px) { .lamp-stage { --ls: 44px; } .chip { font-size: 9px; } }
@media (min-width: 900px) and (max-height: 720px) {
  #night { padding-top: 64px; }
  #night h1 { font-size: clamp(2rem, 8.4svh, 3.5rem); margin-bottom: .2em; }
  #night .lines { font-size: 14px; margin-bottom: .1em; }
  .home-wrap { margin-top: 4px; } .status-line { margin: 4px 0 6px; } .hold-label { margin-bottom: 8px; }
}
#dock { display: none; }   /* dock moves into the Menu, see below */
.slider-row { bottom: calc(12px + env(safe-area-inset-bottom)); }   /* story.css:35, was 12px, sat under the dock */
/* skyline readable at tone 0 and 1 */
html[data-tone="0"] .lay.far rect:not(.pane):not(.halo), html[data-tone="1"] .lay.far rect:not(.pane):not(.halo) { fill: #1C2040; }
html[data-tone="0"] .lay.mid > rect, html[data-tone="1"] .lay.mid > rect { fill: #262747; }
html[data-tone="0"] .lay.near > g > rect:first-child, html[data-tone="1"] .lay.near > g > rect:first-child { fill: #30304F; }
html[data-tone="0"] .win .halo, html[data-tone="1"] .win .halo { opacity: .5; }
#skyline::after { content:""; position:absolute; inset:auto 0 0 0; height:55%; background:linear-gradient(to top, rgba(255,150,60,.14), transparent); pointer-events:none; }
html[data-tone="0"] .night-copy h1, html[data-tone="0"] .night-copy .lines { text-shadow: 0 1px 14px rgba(5,6,13,.9); }
```
Verified (all lamps fully inside the viewport, no dock overlap, no horizontal scroll):

| viewport | h1 | lamp buttons y | "Light all / growth test" row |
|---|---|---|---|
| 1366x768 | 192-408 | 644-709 | 732-776 (just below fold) |
| 1366x650 | 141-259 | 464-521 | 557-601 (in view) |
| 1536x730 | 187-395 | 629-695 | 717-761 |
| 1280x720 | 141-322 | 528-594 | 616-660 |
| 1280x600 | 141-250 | 454-511 | 547-591 |
| 1440x900 / 1920x1080 | 197-417 | 653-728 | 750-794 |
| 390x844 / 360x640 / 412x915 | 197-301 / 173-269 / 197-306 | 523-587 / 491-547 / 530-593 | all in view |
| 768x1024 / 1024x768 | ok | 703-767 / 644-709 | ok |


### Dock: recommended move into the Menu (JSX change, then CSS above)
Why: slider test  at 390x844, 360x640, 412x915 with the compare slider scrolled into view: the sticky slider row (`.slider-row`, story.css:35, `bottom:12px`) overlaps the fixed dock in all three (rows 780-832 vs dock top 730; 576-628 vs 526; 813-865 vs 853) and `elementFromPoint` at the flame thumb returns the dock `.btn`: the tap hits Calm/Look instead of the slider. With the dock removed and the sticky offset kept at 12px+safe-area, the topmost element at the thumb is the slider input at all three sizes.
Change: in `Dock.jsx`, export the controls as a `<DockControls/>` fragment and render it at the end of the `<nav id="menu">` in TopBar.jsx:26-31 inside `<div className="look" role="group" aria-label={X('look')}>`; delete the fixed `#dock` wrapper (App.jsx:72) but keep `TiltChip` in the menu. Calm is then 2 taps away; reduced-motion users are already auto-calmed (`reducedMotion` in store). Menu CSS (fix2.css, verified by DOM mock `menu_390x844.png`, `menu_1366x768.png`; menu bottom 377px, fits all sizes):
```css
#menu .look { display:grid; gap:8px; padding:10px 8px 4px; border-top:1px solid var(--ground-5); margin-top:6px; }
#menu .look > .btn { width:100%; justify-content:flex-start; }
#menu .look .btn[aria-pressed="true"] { background:var(--cream); color:var(--ink); }
#menu .look .seg { display:flex; width:100%; } #menu .look .seg .btn { justify-content:center; flex:1; }
```
Then reduce `footer#footer{padding-bottom:150px}` (base.css:47) and `#closure{padding-bottom:180px}` (story.css:59) to about 48px. Alternative if the owner wants Calm always visible: keep a single 44px round chip at bottom-right with safe-area inset and the rest in the Menu; the chip can still hide a thumb at the far right, so keep the dock out of the sticky slider zone (`bottom` offset 64px).
If the dock stays, at minimum: `html{scroll-padding-bottom:80px}` so keyboard focus is not hidden behind it (the Tab walk showed "THE 60-SECOND FILE [COVERED by btn]" at 390x844) and `.slider-row{bottom:calc(72px + env(safe-area-inset-bottom))}`.

## 4. Other defects found

1. Invisible live closure links (R2), Tab order includes three invisible links (Invite, résumé, Evidence) before the bottom controls. Fix: `visibility:hidden` (or `inert`) on `.cl-fade` content until `ended`.
2. String-lights control `.lights-ctl` (scene.css:92) is unreachable by pointer: `elementFromPoint` at its centre returns `div#root` at 1366x768 and the hero `.hold-label .mono` at 390x844 (it lives in the `z-index:-1` stage). Keyboard works; mouse/touch do not. Fix: move it into the page layer or make the stage children pointer-active, or remove it.
3. Top bar is translucent (base.css:34, .92 to .6 gradient): page text shows through under it (`19-closure.png`, `closure_unlit_1366.png`: "This number is written inside the link..." overlaps the bar). Use a solid `rgba(10,7,5,.94)` and `backdrop-filter: blur(6px)`.
4. Tap targets under 44px: visitor lamp `.cl-lamp.slot` 20x13 (Closure.jsx:118; tappable once lit), footer "Evidence drawer" link 116x20 (Footer). Add `min-height:44px; display:inline-flex; align-items:center` and a transparent hit-area pseudo-element for the slot.
5. Closure when lamps unlit shows a blank screen with only the "Sab diye ek saath jalaiye" button (screenshot above); ok as a gate but the tab sequence reaches invisible items. Consider showing the heading or a one-line hint.
6. `#night` and `#closure` use `scroll-snap-align:start` with `proximity` plus `100svh` heights; on 1366x650 the new first screen fits, but verify snapping does not pull the lamp row back after tapping (acceptance test 9).
7. Console: no warnings or errors on prod at 390 and 1366 (clean).
8. Inconsistent "INVITE ME" copy density: top bar short, closure and sixty "TO AN INTERVIEW" repeated three times with different aria suffix; harmless once all open the same sheet.

## 5. Acceptance tests for Claude Code after the fixes

1. Invite, any entry point (top bar, 60-second dialog, closure, full-text): opens the sheet; focus lands on the title; Escape closes and focus returns to the opener; Tab cycles only inside the dialog.
2. In the sheet: the address is visible and selectable; Gmail link href equals `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=shrniwaskholkute2282%40gmail.com&su=...&body=...` with `target=_blank rel="noopener noreferrer"`; Outlook link likewise; mailto href starts `mailto:shrniwaskholkute2282@gmail.com?subject=`.
3. Copy address and Copy message: click shows "Copied" in a `role=status` node; with clipboard API stubbed to reject, the textarea fallback works; with both failing, the fail text appears. Verify clipboard content with `page.evaluate(() => navigator.clipboard.readText())` after granting permission.
4. Lamp line: before the visitor lights a lamp the body has no "lamp number" line; after (with `#v1.5`) it says 6 in every entry point (top bar, closure, 60-second dialog); never 7.
5. No request leaves the origin on load or while the sheet is open (`page.on('request')` host set equals localhost only); only a user tap on Gmail/Outlook navigates away.
6. Unlit closure: Tab never lands on an invisible element (`opacity:0` or `visibility:hidden` with focus fails the test); clicking blank closure space launches nothing.
7. Layout: at 1366x768, 1366x650, 1280x720, 1536x730, 1440x900, 1920x1080, 390x844, 360x640, 412x915, 768x1024: all six `.lamp-btn` rects fully inside the viewport on first paint; `scrollWidth == innerWidth`; no fixed element overlaps a lamp (`elementFromPoint` at each lamp centre returns the lamp button).
8. Voice compare: scroll the first take's slider into view at 390x844, 360x640, 412x915; `elementFromPoint` at the thumb centre is the `input[type=range]`; keyboard arrows and a drag from the thumb change `value`.
9. Hold hint and progress pill: vertical gap between `.status-line` and `.hold-label` is at least 6px; pressing and holding lamp 1 still lights it (no snap interference).
10. Menu contains Calm, Deepavali, Ink (and Tilt on touch); they toggle `aria-pressed` and `data-calm`/`data-ink` on `html`; Escape closes and returns focus to Menu.
11. Skyline at tone 0 and 1 (screenshot diff or pixel-luminance check of the skyline band is above the sky band) and in Ink mode still legible.
12. Tap targets: every visible interactive element is at least 44x44 except inline text links; run a script that lists interactive elements smaller than 44x44 and expect an empty list.
13. Console clean (no warnings or errors) on dev and prod; `npm test` and the browser suites in `scripts/e2e/` still pass; calm mode and reduced motion show final states.
14. Full-text view shows address, Gmail link, mailto link, message text without JS.


---

# PART C: THE NEW PAGE FLOW (running order, awe moments, limits)

## A. DIAGNOSIS (from screenshots 01, 03, 08, 10, 11, 15, 19, 22, 30 and src/App.jsx)

1. First screen (01) carries about 14 competing things: wordmark, amber INVITE ME pill, Menu, kicker, 3-line headline, "Ship karte?", two italic lines, a lit lamp, a progress counter, "HOLD TO LIGHT" plus Hinglish hint, six labelled lamp chips, "Sab diye ek saath jalaiye", "SEE THE GROWTH TEST", the "Jaldi mein hain?" card, and the dock (Roshni kam karo + Deepavali/Ink). The headline is the hook; everything else is noise around it. The amber INVITE ME is the loudest object on a page whose reader has not yet been given a reason to invite anyone.
2. Three different asks before any delight: hold the lamp, light-all, see the test. A skimmer does not know which is "the" action.
3. Order puts the person at position 5 of 9 (App.jsx: Night, Lamps, RowBreathes, Lamp6, Person, Voice, Verdict, Wish, Closure). The recruiter meets five incident reports and a proposal before learning who is speaking. Interests are also only a clause in one paragraph (Person.jsx) and a source folder in the drawer.
4. Each project story is a full-height bottom sheet (03) with a long vertical timeline, so the lamp "payoff" is a wall of text on top of a dimmed stage. The stage, the star of the page, is covered exactly when the story is told. Reading before delight is high: the lamp card has What happened, interaction, What I did next, Fair warning, receipt, about 180 words per lamp.
5. `#lamps` (Lamps.jsx) repeats the lamp row as a text list of "Kissa kholiye" buttons: the same five items twice.
6. Sections 8 to 15 (08, 10, 11, 15) are text on a dark panel over a still-busy stage; the Person panel's body text is nearly invisible in 11 (a fade-in state caught mid-way, but the veil plus rangoli behind it also fights the text). Rangoli, cat, moon, kandil, firework glints and floating sparks run behind readable copy.
7. The dock (Calm, Look) floats over the content on every screen, and 15 shows it covering the wish copy. The topbar plus dock plus INVITE ME means three persistent chrome layers on a 390px phone.
8. Wish step (15) is nine short Hinglish paragraphs and four chip options before the field: long for a recruiter who has not yet been asked anything, and it comes before the invitation, so the "ask" is buried at the bottom.
9. Lamp 6 (10) is stunning but appears before the reader knows the person or why Hinglish matters; "PROPOSED, NOT RUN" plus the bowl drawing plus dense bold text competes with itself.

## B. THE UNIFYING DEVICE: "CHHAT PAR MEHMAAN" (the guest on the terrace), carried by one flame

You are a mehmaan (guest) arriving at a family home on Deepavali night. One flame is handed to you at the door and you carry it through four places: dehleez (doorstep), baithak (sitting room where the host speaks), chhat (the terrace, where the five lamps stand), and the doorstep again to leave (vidaai, with something in your hands).
Why this beats a plain home visit:
1. The stage already IS a terrace (parapet, string lights, skyline, cat). Only the baithak is new, and Person.jsx already has the lit-window scene to reuse. Minimum rebuild, maximum coherence.
2. The flame is the progress bar, the cursor and the thesis in one object: a small ember travels with the reader and hops lamp to lamp. "Ek diya se doosra" stops being a title and becomes the navigation.
3. Visit grammar is universally understood in India: you are welcomed, you are told who the host is, you are shown something proudly, you are fed, you leave with a gift. That is exactly hook, person, proof, proposal, wish. No instructions needed.
4. It keeps the recruiter on the host's side of the table (warm, not courtroom).
5. It gives each scroll a physical location ("now we are on the terrace"), which is the cure for "where am I?".

## C. NEW RUNNING ORDER (6 ACTS, about 4 minutes total)

Global mechanic: stage changes are one-shot light events triggered at 60% section visibility (IntersectionObserver + class toggle), never scrubbed per scroll frame. Any tap completes an animation immediately. Reduced motion and Calm show final states.

ACT 1: DEHLEEZ (doorstep). `#night` (kept). 0:00 to 1:00.
- Beat 1.1 (0 to 10 s, complete experience on its own): dark terrace, one flame lit, string lights unlit. Headline appears in two beats: "324 tests passed." (0.4 s), then "Then an audit found 19 problems." (1.4 s), then "Ship karte? Imaandari se bataiye." (2.4 s). Then the two Hinglish lines (3.2 s). Reader does one thing: hold the diya (or tap or Enter). First screen shows ONLY: wordmark, small Menu, headline block, the lit diya with its hold hint, and the dashed sixth lamp faintly at the far end of the parapet (a Chekhov's lamp, unlabelled).
- Beat 1.2 (hold, about 1.2 s): the ember arcs from the host's diya to Lamp 1. As it lands the AWE 1 ripple runs: string lights come on bulb by bulb left to right (60 ms stagger), skyline windows warm in clusters of three, rangoli draws itself under the lamp (stroke-dash, 1.2 s). Then everything settles to a calm state.
- Beat 1.3 (10 to 50 s): `#lamp-1` story stop, on-page, no sheet: kicker, "Sab green tha", ONE sentence ("The prototype passed 324 tests. A separate audit found 19 problems."), the guess tiles (0, 3, 8, 19), reveal, one Hinglish reaction line. "Poora kissa" one tap opens the existing card for the rest. This is the 324 to 19 AWE 2.
- Transition out: the reveal ends with the flame ember pulsing at the bottom edge ("agla diya" hint with a small chevron, appears after 4 s idle).

ACT 2: BAITHAK (sitting room, meet the host). New id `#baithak` (replaces `#person` position, wraps it). 1:00 to 1:50.
- Stage: scroll pans the skyline 6% sideways and the sky fades to the warm window-scene (reuse Person's SVG, four panes). Veil goes to 35% so text is legible. Cat, kandil and sparks pause (effect budget).
- Beat 2.1: one line, in his voice: the existing opening sentence "I'm Shriniwas, a final-year VIT Pune engineering student..." (already in copy, below the first screen today).
- Beat 2.2: four window panes, each tappable; tapping lights that pane warm gold and swaps ONE short card beneath (details in D). Reader action: tap 1 to 4 panes (optional, first pane auto-opens).
- Beat 2.3: his pull-line "I didn't learn that every plan works. I learned to decide what to do when it doesn't." as the baithak's closing line, then a soft pane-light fades to the terrace.

ACT 3: CHHAT (terrace, the proof). Ids `#lamp-2` to `#lamp-5` (new, replacing the sheet-first model; sheets stay for deep stories). 1:50 to 3:00 (about 15 to 20 s per lamp).
- Each lamp is one screen: kicker, Hinglish title, ONE hook sentence, ONE "Maine phir kya kiya" sentence, a status chip, the lamp on the parapet. Reader taps the lamp to pass the flame (the ember hops from the previous lamp, 0.9 s). This keeps the copy line "Baaki paanch aapke haath se jalenge" true.
- Lamp 2 (Vigil): the late-reply slider sits here (AWE 4). Lamp 3 (Blitz): the 3.1x to 1.02x phuljhadi (AWE 3). Lamp 4 (TipIndex): the existing StoryHandoff (one flame passes from one agent lamp to the next). Lamp 5 (PitDB): a 06:15 event on a clock face showing at 06:00 (existing visual idea), then the lamp lights.
- Each screen ends with a single "Poora kissa" button and a "Fair warning" line (always visible, one sentence), the receipt link lives inside the sheet.
- Stage: each lit lamp raises dusk by one step; the sky drifts from blue-black to plum. Lamp 5 triggers the row-breathes beat as a 3 s automatic event, not its own section: all five flames lean together then rise, the room turns dusk-gold, caption "Paanch diye jal uthe." fades up and out.

ACT 4: AWAAZ (his voice, Flow's text). `#voice` (kept, moved). 3:00 to 3:40.
- Stage quiet (veil 40%, no sparks). Reader drags the flame between "As I said it" and "As Flow wrote it" (existing compare), starting on Take 2 (shorter and quotable). Take 1 behind "Doosra take". Read-plainly toggle stays.

ACT 5: AAKHRI DIYA (the proposal, lamp 6). `#lamp-6` (kept id, new position, new look, see PART E). 3:40 to 4:10.
- Stage dims to near-black except the dashed sixth lamp. Reader presses it: the wick glows and recedes ("Yeh diya abhi nahi jalega. Test chala nahi."). Then the proposal, one screen, "Proposed, not run" always visible. Full protocol one tap away (the drawer's India growth test folder). INVITE POINT 2 sits here (see H).

ACT 6: VIDAAI (leaving with something). `#verdict`, `#wish`, `#closure`. 4:10 to 4:50.
- `#verdict` (Seedhi baat): one screen, three sentences max (limits and "I can't promise I'll always be right"), links to résumé and evidence.
- `#wish` shortened to a gift: the first screen shows two lines plus the field; the four idea chips and the privacy detail collapse under "Kuch idea chahiye?" and "Privacy" (still reachable and always one tap away).
- After "Card banaiye", AWE 5: the flame travels along the lit row to the end and lights the visitor's lamp. Closure `#closure`: "Aapka diya jal utha. Ab mujhse ek sawaal poochhiye." INVITE POINT 3. Sign-off.

Time: 10 s = Act 1.1 (stop, smile, one hold). 60 s = Acts 1 + a glance at the first pane (headline, the 324 to 19 guess, who he is). 3 to 4 min = all six acts; lamp stories deeper via sheets add time only for those who choose it.

## D. FIRST-HALF "WHO I AM / HOW I WORK / WHAT I BRING"

Placement: Act 2, immediately after Lamp 1 and before Lamps 2 to 5 (so by about 40% of the page the recruiter has the person and one proof). Form: the four-pane window (reuse Person.jsx scene). One pane card visible at a time, 30 words max, each with a "Proof" chip that scrolls to the matching lamp and lights a faint highlight on it.
1. WHO (pane 1, auto-open): Class 12 under financial pressure, a gap year, YouTube study, a Rs 3,999 course, VIT Pune, graduating May 2027. Existing sentences from `person.paras[0]` (first sentence stays behind its ledger gate). Proof chip: none (he is the proof).
2. HOW I THINK (pane 2): debate (placed second in a college debate), essays, business case studies, Advaita Vedanta. Link: "Read my long-form essay" (exists in the drawer) as a quiet text link. Proof chip: Lamp 2 ("does it deliver what someone depends on?" is a debater's question).
3. HOW I WORK (pane 3): coordinated four research contributors; mapped workflows, approved decisions, directed AI agents, questioned results. Proof chip: Lamp 4 (handoff and checkpoints: "A process shouldn't depend on one operator remembering everything.").
4. WHAT I BRING (pane 4): the habit of testing and re-testing: withdrew a number (Lamp 3), narrowed a claim (Lamp 5), and proposes one experiment for India (Lamp 6, Proposed, not run). End with the honest line: "I have no growth wins to borrow." (existing 60-second file sentence). Proof chips: Lamps 3, 5, 6.
Rules: every sentence on these cards must be lifted from person, sixty, verdict or evidence copy (the pane headings, the proof chips and any "experimentation and validation" phrase are NEW copy and must go through the truth ledger; they must read as "what the projects show", never as a claimed skill level). The four-pane layout is a plain list of four headed paragraphs in the text twin and in the full-text view.

## E. AWE MOMENTS (light, motion, interaction only)

1. "Gali jag uthi" (the street wakes; STOP). Reader holds the diya. They see the ember arc to Lamp 1, then string lights run across the screen, skyline windows warm outward to the horizon, rangoli draws under the lamp, a soft hush (visual only). Proves: one action starts a chain, which is the whole thesis. Cost: staggered opacity on about 20 bulbs, 12 windows, one SVG stroke. Reduced motion: final lit state.
2. "324, then 19" (STOP, then understand). Reader taps a guess (0, 3, 8, 19). They see 324 green tiles fill the width of the screen (already built), then 19 tiles flicker amber, two brighter than the rest. Proves: green is not the same as safe. One Hinglish line lands the reaction ("Kam socha? Aap akele nahi hain.").
3. "Phuljhadi aur diya" (SMILE). On Lamp 3 the reader taps "3.1x" and a phuljhadi throws sparks, burns down in 2 s and leaves a steady small diya at "1.02x". Caption: "Chamak nahi, sach." Proves: the defensible number beats the flattering one. Smile because it is a tiny joke about sparkle versus light, with no cracker lecture.
4. "Der se aaya jawab" (understand). Reader drags the slider past the 3 s deadline. In Original logic the flame stays steady (wrongly "alive"); switch to Corrected logic and the flame gutters and greys. Proves the Vigil defect without a paragraph. Keep the MODEL OF DOCUMENTED BEHAVIOR label.
5. "Aapka diya" (AWE, the emotional payoff). After the wish card is made, the flame travels the whole row, lamp to lamp, and lights the visitor's lamp at the end; the row caption reads "{N} diye pehle se. Aakhir mein aapka." Proves: the reader is now part of the chain. A short lantern rise is allowed (one element).

## F. OVERWHELM RULES (hard limits)

- First screen: max 6 visible elements (wordmark, Menu, kicker, headline block, diya plus hold hint, one quiet "Jaldi mein? 60 second" text link). No INVITE ME, no progress counter, no six labelled chips (use six unlabelled lamp silhouettes, labels appear when each is lit), no dock buttons.
- Words per screen (visible without scrolling, excluding labels): max 45 in Acts 1 to 3, 60 in Acts 4 to 6 (verdict and wish). Anything longer moves to "Poora kissa" or a collapsed section.
- Interactions per screen: exactly 1 primary + 1 optional text link. Never two controls of equal weight.
- Simultaneous effects: max 3 (one foreground subject, one ambient layer, one transition). While a foreground interaction runs (guess, slider, compare), turn off sparks, cat, kandil sway, and firework glints.
- Chrome: topbar (wordmark + Menu + invite pill only after Act 2) and ONE small bottom-corner Calm button (44px). Look (Deepavali/Ink), light-all, full text view, 60-second file and the drawer move into the Menu sheet.
- Defer: the wish idea chips, privacy paragraph, receipts, "Read it plainly" options, the second take, the full growth protocol.
- Cut or merge: `#lamps` text list (cut), `#row-breathes` (merge into Lamp 5 as an auto beat), Verdict's two paragraphs (merge to three sentences), the wish intro (nine paragraphs to two lines).
- One idea per scroll: never put two different stage events in the same 100 vh.

## G. MAPPING TABLE

| Current | New | Action |
|---|---|---|
| Topbar (wordmark, INVITE ME, Menu) | Wordmark + Menu; invite pill fades in after Act 2 | Keep, trim |
| Stage (sky, skyline, terrace, dusk) | Same, with act cues (veil, pan, dusk step) | Keep, tune |
| Dock (Calm, Look) | One Calm corner button; Look in Menu | Merge |
| `#night` (opening) | Act 1, sequenced reveal, one hold | Keep, simplify |
| LampRow (six chips + light-all + growth button) | Unlabelled silhouettes on the parapet; light-all in Menu | Cut chrome |
| `#lamps` story list | none | Cut |
| LampCard sheet (lamp 1 to 5) | On-page stops (new `#lamp-1` to `#lamp-5`), sheet is "Poora kissa" | Move, new |
| GuessAudit, LateReplySlider, StoryPriceTag, StoryHandoff, StoryCutoffClock | Live inside the stops (not inside the sheet) | Move |
| `#row-breathes` | Auto beat at Lamp 5 | Merge |
| `#lamp-6` | Act 5, after Voice | Move, redesign (see PART E) |
| `#person` | Act 2 `#baithak`, four panes | Move up, new form |
| `#voice` | Act 4, before the proposal | Keep, move |
| `#verdict` | Act 6, three sentences | Keep, shorten |
| `#wish`, WishForm | Act 6, two lines + field, rest collapsed | Keep, shorten |
| `#closure` | Act 6 end, invite point 3 | Keep |
| SixtyDialog | Menu + quiet link under hold hint | Keep |
| EvidenceDrawer | Menu and "Poora kissa" links; interests are no longer locked | Keep |
| FullTextView | Menu; also printable | Keep |
| Footer | Same | Keep |

## H. GROWTH TEST, WISH, CLOSURE AND INVITATIONS

- Growth test: Act 5, after the five lamps (judgment) and Voice (his voice versus Flow's text, which sets up why the language setting matters). It is the climax of the proof section and is flagged "Proposed, not run" in the stop. A faint dashed lamp is visible from the very first screen as a hook, with the full protocol reachable one tap away. PART F gives the idea; this slot gives it a full screen, a dimmed stage and a single control.
- Wish: after the verdict, as the reader's reciprocal gift; short by default.
- Closure: row plus visitor's lamp, then the interview ask, then Shubh Deepavali.
- Invitation points (max 3): (1) topbar pill, appearing after Act 2 (the reader now knows the person) and staying; (2) end of Act 5, tied to the proposal ("Is test par baat karein?" as the invite's sub-line); (3) closure. The 60-second dialog reuses the same button; the Menu holds the same link. All render only if contact is set.

## I. 60-SECOND PATH AND FULL TEXT

- Hurried reader: quiet "Jaldi mein? 60 second" link on screen 1 opens the 60-second file (dialog, `#sixty`). Better: add a scroll-free "fast lane" mode inside that dialog with the same sentences, three buttons (Open one receipt, Invite me, Take the whole walk). Alternate hurried path in the page itself: hold (10 s), guess (15 s), baithak first pane (10 s), skip to growth lamp via Menu "Aakhri diya" (15 s), invite (10 s).
- Full text: Menu entry "Poora text padhiye" (`#text`), preserving every section in the new order with all interactions as plain paragraphs (also the print view).

## J. RISKS

1. New pane copy: the panes (esp. "experimentation and validation") can read as claims. Limit to existing sentences; any bridging text needs the truth ledger. Person first sentence stays gated.
2. Moving Lamps 2 to 5 on-page from sheets means more Stage DOM and animation on screen at once; verify 60fps on a mid-range Android with the effect budget; kill sparks while interacting.
3. Tap-per-lamp (4 taps) could feel like a chore; mitigate with "Sab diye ek saath" in the Menu and an auto-hop after a long idle (not before), with the text twin announcing each lamp.
4. Sequenced headline reveal delays skimmers by about 3 s; any tap completes it, reduced motion shows it all at once.
5. The baithak adds a scene change; if time is short, ship it as a card over the existing stage (no pan, no new SVG).
6. Putting the proposal after Voice makes the page long to reach the interview ask; invite points 1 and 2 protect against that.
7. Wording: keep "Chhat par mehmaan" as internal vocabulary only; do not print act names that would be new Hinglish copy unless approved (use existing kickers).


---

# PART D: MEET SHRINIWAS (who I am, how I work, what I bring)

Tags: [V] verified in page copy / content.json / ledger. [S] supplied by him, still unconfirmed in the ledger. [D] AI draft, not usable as fact. [SLOT] empty, hidden by flag. [UI] interface label. I merged deliverables (2) and (6): each card carries its own copy.

Essay: the Drive link IS readable (I read it). Title "Who Audits the Auditor?", about 10,000 words (my whitespace count: 9,996). It never mentions Berggruen, so "this is the Berggruen essay" stays [S]. Open it in a private window before launch to confirm it is public.

## 1. FACT TABLE

| Fact | Tag | Source |
|---|---|---|
| Final-year, VIT Pune, B.Tech Instrumentation and Control, Sep 2023 to May 2027, CGPA 8.43 | V | docs/TRUTH_LEDGER.md (resume) |
| "I build software, debate, write and study business strategy." "I care about people as much as code." | V | Case_File_001_Focused_Website_Copy.md |
| Father's accident, financial pressure in Class 12; gap year, unsuccessful entrance attempts, YouTube study, Rs 3,999 course, VIT Pune | V (wording) / S (sequence) | Focused copy; ledger open item 5 |
| JEE twice without coaching, then Physics Wallah, L1 fracture, Nashik | S | HANDOFF_CONTEXT.md. Use only if confirmed |
| Coordinated four research contributors | V (sentence) / S (detail) | Focused copy; ledger open item 6 |
| Placed second in a college debate | V (sentence) / S (detail) | same |
| Enjoys business case studies, essays, Advaita Vedanta | V | Focused copy |
| Father introduced Advaita Vedanta | S | HANDOFF, TRUTH_CHECK S10 |
| Essay "Who Audits the Auditor?" exists, Drive link, subtitle: "On delegation, judgment, and why no layer of checking... can finally certify itself" | V | reference/content.json site.essay (I read the file) |
| Essay opens with a habit: "Before trusting an important answer, I ask it to check itself." Hydra benchmark gave two honest numbers. Calling the second response an "audit" did not make it independent. Last line: "We were never outside the thing we were trying to change." Cites Advaita, Nagarjuna, Scharmer, Kauffman; figure "built, tended, coevolved" | V | essay text |
| "Hydra" is a trading system named only in the essay. It is not one of the five projects. Do not equate it with Blitz | caution | essay |
| "Wrote an essay for Berggruen" | S | FLOW_SCRIPTS S11 and ledger item 6 |
| "Debate taught me to argue the other side first"; "habit of asking what is actually real" | D | docs/FLOW_SCRIPTS.md S10, S11. Not his words |
| TipIndex P7: CPU contamination invalidated 9 of 10 rounds (attempt 1); a quiescence rule was written after attempt 1 but before reruns; attempt 2 rejected at 3.52 s vs 3.0 s limit; attempt 3 passed. 820 measured rounds. 5,364 P6 files byte-identical. Failed timing values deleted at his instruction | V | content.json c4 |
| Conflict: ledger says "predeclared" quiet-machine threshold; c4 says rule written after attempt one. Use c4 wording | caution | ledger vs c4 |
| certgen: QR branch failed a pre-agreed required test, not merged; boot failed 39 of 60 rounds, 0 of 360 after WAL fix | V (c1) / S (39, 360) | c1; ledger |
| Vigil: if(false) makes exactly 2 targeted tests fail; 105/105 local, simulated; CPU-0 pinning confound found | V | c2, ledger |
| Blitz: 1,205 ns (uncommitted tree) vs 1,850 ns; 3.1x to about 1.02x; 3,059 of 110,000 (2.78%) crossed states, zero after fix; latency not remeasured | V | c3 |
| PitDB: trimmed mean hid outliers (13 x 1 ms + 2 x 100 ms: trimmed 1 ms, raw 14.2 ms); 06:15 shown at 06:00; 346 local tests | V | c5 |
| Proposed India test (now the Handover Test, PART F) and a self-only five-paired-task typing vs Flow experiment; neither run; success defined in advance, failure condition stated | V (old c8) / PART F | c8 |
| About 14% of installs vs about 2% of in-app revenue in India | P (ledger) | TechCrunch via Sensor Tower, 9 May 2026 |
| Used Flow from 1 Nov 2026 only | V | ledger |

WANT BUT DO NOT HAVE: debate motion, side, level, field size, lesson; what the four contributors researched and what he coordinated; essay central idea in his words and Berggruen status; any experiment outside the five projects; any business case he studied; his own words for his loop.

## 2 + 6. THE MODULE: "Meet Shriniwas" (6 cards + optional Roots)

Layout: one horizontal swipe row (phone) of compact cards, 1 hook + 2 to 4 lines each, tap to flip for the proof. Every card has a "Plain text" disclosure that is always in the DOM. A card with an empty slot shows only its one verified line.

**C1. Pehle, main kaun? (who I am)**
- Hook: Code, debate, essays, strategy. Sab ek hi insaan ke.
- Body: I'm Shriniwas [V], a final-year VIT Pune student in Instrumentation and Control, graduating May 2027 [V]. Main software banata hoon, debate karta hoon, likhta hoon aur business strategy padhta hoon [V]. Code jitna hi zaroori mere liye log hain [V].
- Proof: resume link [V]. Interaction: four chips (Builds, Debates, Writes, Studies) that jump to the matching card; a paper name-tag motif. Twin: the same three sentences. Flag: none.

**C2. Debate: college mein doosra number**
- Hook: I placed second in a college debate [V/S].
- Body: Motion aur side: [SLOT]. Sabse bada sabak: [SLOT]. 
- Proof: none yet (no document). Label "self-reported".
- Interaction: "Doosri taraf dekhiye" flips a two-sided card made only from this page's facts. Side one: "Ship karte: 324 of 324 tests passed" [V]. Side two: "Ruk jaate: a separate audit found 19 problems, two high" [V]. Caption [UI]: "An illustration from this page's facts, not a debate transcript." Avoid the word "against".
- Twin: both sentences. Flag: `meet.debate.filled` (body only). The illustration may ship without it.

**C3. Likhna: "Who Audits the Auditor?"**
- Hook: Ek lamba essay, ek chhoti si aadat: AI se kehna, "apna jawab khud check karo." [V]
- Body: Essay ki shuruaat ek habit se hoti hai: before trusting an important answer, I ask the AI to check itself [V]. Phir catch: jab wahi system apna audit karta hai, woh audit independent nahi hota [V, paraphrase of essay]. Essay ka central idea, meri apni bhasha mein: [SLOT]. 
- Interaction: a closed ring of three small lamps (the system checking itself). Tap once and an outer lamp lights, "a separate check", breaking the ring. Caption [UI]: "A sketch of the essay's idea, not the essay." Back of card: the last line, "We were never outside the thing we were trying to change." [V quote]
- Proof: essay link (site.essay) [V]. Optional chip "Written for Berggruen" [S], flag `meet.essay.berggruen`. Twin: three sentences. Flag: `meet.essay.idea` for the SLOT sentence.

**C4. Research coordination: chaar log, ek plan**
- Hook: Maine chaar research contributors ko coordinate kiya [V/S].
- Body: Project: [SLOT]. Kaun kya kar raha tha: [SLOT]. Mera hissa: [SLOT].
- Verified companion (agents, not people, so say so): with TipIndex, I directed a handoff from Codex to Claude Code and approved phase gates [V].
- Interaction: four dots around one centre; each dot opens a SLOT line, unfilled dots do not render. Twin: list. Flag: `meet.research.filled`.

**C5. Experiment aur validation: mera loop** (see section 3)
- Hook: Pehle rule likhiye, phir number maniye.
- Interaction: a six-stop loop ring, tap a stop for its real moment. Twin: numbered list. No slot needed; the optional one is `meet.loop.ownWords`.

**C6. Wispr ki India growth team ke liye (see section 4)**
- Hook: Five capabilities, each with proof and a limit. Koi growth win nahi, aur main woh bolunga bhi nahi.
- Interaction: five lamps, tap one for claim, evidence, "fair warning". Twin: table.

**C7 (optional). Meri raah (roots)**
- Hook: Ek gap year, YouTube, Rs 3,999, VIT Pune [V].
- Body: My father's accident brought serious financial pressure during my Class 12 exams [V]. Phir gap year, entrance attempts, YouTube study aur Rs 3,999 ka course, aur raasta VIT Pune tak [V]. I enjoy business case studies and Advaita Vedanta [V]. Specific case study: [SLOT].
- Interaction: a four-stop route line (gap year, YouTube, the course, VIT Pune), tap a stop for the verbatim word. Twin: sentence. Flags: `meet.roots.father` (first sentence only), `meet.roots.examOrder` (no exam names until ledger item 5 is confirmed).

## 3. HOW I WORK: a six-step loop (all numbers verbatim)

1. **Rule pehle (set the rule early).** TipIndex P7: after attempt one, a quiescence rule was written before the reruns; limit 3.0 seconds [V c4]. certgen: the QR branch was held to a pre-agreed requirement and not merged [V c1].
2. **Number saaf nikaliye (measure cleanly).** Blitz: 1,205 ns came from an uncommitted tree; the controlled run gave 1,850 [V c3]. Vigil: a benchmark inherited a one-CPU affinity mask, so its comparison was invalid [V c2].
3. **Todne ki koshish (try to break it).** certgen: 324 tests, then 19 audit findings [V]. Vigil: remove the guard with `if (false)` and exactly two targeted tests fail [V c2]. Blitz: 3,059 crossed-at-rest states in 110,000 replay events [V c3].
4. **Rejected rounds ko rokiye (let a run fail).** TipIndex: 9 of 10 rounds contaminated; attempt two rejected at 3.52 s against 3.0 s; attempt three passed; 820 measured rounds [V c4].
5. **Claim chhota kijiye (narrow the claim).** Blitz 3.1x to about 1.02x [V]. PitDB: a trimmed mean of 1 ms hid a raw mean of 14.2 ms; the claim was narrowed [V c5].
6. **Agla test likhiye (propose the next).** India test (the Handover Test, PART F): a setup script for the family member who installs Flow on a relative's phone, measured by whether the relative dictates again alone within 24 hours; success defined in advance; proposed, not run.

Fair warning to print under the loop: "Failed timing values were deleted at my instruction, despite a general preserve-failures policy" [V c4]. Honest, and a recruiter will like it.

## 4. WHAT I BRING (5 capabilities, each with an honest limit)

1. **Experiment design.** Evidence: steps 1, 4 and 6 of the loop (TipIndex rule, 3.52 s vs 3.0 s, the written India protocol with a stated failure condition). Why growth cares: activation tests need "success" decided before the dashboard. Limit: I have not run a growth experiment; the India test is proposed, not run.
2. **Honest measurement.** Evidence: Blitz 1,205 to 1,850 ns; 3.1x to about 1.02x; PitDB 1 ms vs 14.2 ms. Why: flattering metrics are the usual growth failure. Limit: 1,850 ns is historical, not current.
3. **Writing that holds an argument.** Evidence: the essay "Who Audits the Auditor?" (about 10,000 words) and this page's own copy. Why: positioning, onboarding copy, creator briefs. Limit: no published or product-marketing writing is evidenced; Berggruen status is unconfirmed [S].
4. **Coordination.** Evidence: four research contributors [S]; Codex to Claude Code handoff [V]. Why: growth is cross-team. Limit: scale and my authority over the contributors are unknown to the reader until the slot is filled.
5. **A student's view from India.** Evidence: final-year at VIT Pune; YouTube study and a Rs 3,999 course [V]; my India test starts from what Wispr's own help page says: Hinglish is chosen by hand, not assumed [PART F]. Why: Wispr's India share is about 14% of installs vs about 2% of in-app revenue [P]. Limit: one student's view, not a market study; Flow use began 1 Nov 2026.

## 5. SLOT QUESTIONNAIRE (about 10 minutes, in priority order)

1. Debate: "Motion or topic | your side | level (intra-college, inter-college) | number of teams, if you know | one lesson in 20 words or fewer". Example: "This House would ban homework | Proposition | inter-college | 12 teams | I learned to rebuild my case after hearing theirs." (format example only.) Flag `meet.debate.filled`.
2. Research: "Project in one line | what each of the four did | what you coordinated (task split, deadlines, merging) | one outcome." Flag `meet.research.filled`.
3. Essay: "Is 'Who Audits the Auditor?' the Berggruen essay? Submitted, or something else? Is the Drive link open to anyone? Central idea in one sentence of yours." Flags `meet.essay.berggruen`, `meet.essay.idea`.
4. Roots: "Keep the father's-accident sentence, yes or no? Exam order (JEE twice, then Physics Wallah?) confirmed?" Flags `meet.roots.father`, `meet.roots.examOrder`.
5. Rule timing: "In TipIndex P7, was the 3.0 s limit set before attempt one, or only after? (c4 says after; the ledger says predeclared.)"
6. Your loop: "Say your working method in 30 words, as you would to a friend." Flag `meet.loop.ownWords`.
7. Business case: "One case you studied and the one thing it taught you (one sentence)." Optional.
8. Anything outside the five projects where you tested something (class, club, side project)? One line. Optional.

## 7. RISKS and what to cut

- Biggest risk: overwhelming the reader. Cap each card at 4 lines; flip for detail.
- C2 and C4 are close to empty without slots. If unanswered: merge into one card, "Debate aur coordination", showing only the two verified sentences, no flip.
- C3 is the strongest new card and needs no slot (only the Berggruen chip is gated).
- Never use FLOW_SCRIPTS lines (D) as his voice. Do not link "Hydra" to Blitz. Do not say the essay won or was shortlisted.
- Gap/exam names, father sentence: they are still on the page today with a CONFIRM note; gate them.
- Conflict c4 vs ledger on "predeclared": step 1 uses the c4 wording; do not say "predeclared" for P7.
- Interface labels: avoid cut, wrong, error, fail, reject, against, miss, trap. Step 4's heading uses "let a run fail" only in a fact context. Rename it "Rukne dijiye" if a stricter reading applies.
- Cut order if time is short: C7, then C4, then C2 body, keeping C1, C3, C5, C6.


---

# PART E: THE FULL V3 COPY (this part becomes `website_copy_v3.md`)

How to read PART E: tags at line end: [SAME] identical to v2, [CHANGED] reworded, [NEW] did not exist. "v2 §n" means the string already in `website_copy.md` at the repo root (and in `src/data/copy.json`): take those from the repo, do not retype them. `{braces}` are run-time fills or SLOTs (see PART A open questions and the flags list in the appendix at the end of this part). Square-bracket prompts inside the Invite email body are intentional.

Reading guide. UI labels are in `backticks`. {braces} are run-time fills; CAPS names are SLOTs (Appendix B). Tags at line end: [SAME] identical to v2, [CHANGED] reworded, [NEW] did not exist. "v2 §n" means the string is unchanged from /home/abc/Desktop/case-file-portfolio/website_copy.md. Page lang en-IN; wrap visible Hinglish in lang="hi-Latn"; no Hinglish in aria-labels. Act names (guest, dehleez, baithak, chhat, vidaai) stay internal.

---

## 0. META AND SHARE PREVIEW

- Tab title: Ek Diya Se Doosra (one lamp lights another) · Shriniwas Kholkute [SAME]
- Meta description: 324 tests passed. Then a separate audit found 19 problems. Shriniwas Kholkute's Deepavali-night page for Wispr Flow's India growth internship: five projects, one proposed test. Aaiye, chhat par. [CHANGED]
- og:title and twitter:title: 324 tests passed. 19 problems found. Ship karte? [SAME]
- og:description: Ek diya pehle se jal raha hai. Chaliye chhat par: paanch projects, ek proposed test, aur ek lau jo aapke haath se aage jaayegi. [CHANGED]
- og:image alt: A dark terrace with one lit lamp, four unlit lamps and a faint dashed sixth lamp, under the words "324 tests passed. 19 problems found." [CHANGED]
- WhatsApp share line: 324 tests passed. Phir ek audit ne 19 problems dhoondhe. Ship karte? Aaiye, dekhiye: {site link} [CHANGED]

## 1. CHROME

- Skip link: Skip to main content [SAME]
- Top bar: wordmark EK DIYA SE DOOSRA · `Menu` · `INVITE ME` (appears after the sitting room, stays) [SAME / SAME / SAME]
- Corner button: `Calm` (aria: "Calm mode: fewer moving things") [NEW]
- Menu: `Poora text padhiye` · `The 60-second file` · `Evidence drawer` · `Sab diye ek saath jalaiye` · `Aakhri diya` (jumps to the sixth lamp) · `Look: Deepavali / Ink` · `Close` [NEW, except the existing 60-second file, drawer, Look and Close]
- Reduced-motion note: v2 §16. [SAME]

---

## ACT 1: AT THE DOORSTEP (first screen, then Lamp 1)

### 1.1 First screen (wordmark, Menu, headline, two lines, diya, hold button, quiet link)

Shared-link greeting and its fine print (shared links only, tiny, above the headline): v2 §1 word for word. [SAME]

Headline, revealed in three beats (any tap completes it):
# 324 tests passed.
# Then an audit found 19 problems.
**Ship karte? Imaandari se bataiye.** [SAME]

Ek diya pehle se jal raha hai. Woh mera hai.
Baaki aapke haath se jalenge. [CHANGED: "paanch" dropped, lamp 1 is lit in this act]

`HOLD TO LIGHT THE FIRST LAMP` [SAME]
Dabaye rakhiye. Tap ya Enter bhi chalega. [SAME]
While holding: Baati abhi garam ho rahi hai. [SAME]
Quiet link: `Jaldi mein? 60 second ki file →` [CHANGED]
Alt text: A dark terrace; one small flame lit on the left, a row of unlit lamps leading right. [CHANGED]

### 1.2 Awe 1: the street wakes

Caption, fades in as the ember lands: Ek diya jala. Poori gali jag uthi. [NEW]
Reduced motion and Calm show the lit state at once.

### 1.3 Lamp 1 stop (certgen)

[KICKER] LAMP 1 · CERTGEN · THE GREEN WALL [SAME]
### Sab green tha [SAME]

The prototype passed 324 tests. A separate audit found 19 problems. [CHANGED, from v2 "What happened"]

`GUESS THE AUDIT RESULT`: How many problems did the audit find? `0` `3` `8` `19`
Aapka andaza? [SAME]

After a tap: 324 green tiles fill the screen, then 19 flicker amber, two brighter.
Tile caption: 324 tiles, sab green. Phir 19 ne haath uthaya, do ne zor se. [NEW, the act's one dry line]
Reveal: The audit found 19 problems, two of them high. One crafted value caused disproportionate CPU work. A request of roughly 26 MB expanded into roughly 192 MB of response material. The tests hadn't asked those questions, and I directed more remediation. [SAME, v2 §2]
Guess below 19: Kam socha? Aap akele nahi hain. 324 tests ne bhi wahi socha. [SAME]
Guess of 19: Bilkul sahi. Tests ko yeh nahi dikha tha. [SAME]
Chip: 324 / 324 tests pass → after reveal: 19 findings · 2 high [SAME / NEW]

**Maine phir kya kiya**
Green screen par ruk jaana aasaan tha. I didn't defend it: records show me approving safeguards and directing more remediation. [CHANGED, shortened from v2 §2]

**Fair warning**
Still a prototype, not a security guarantee. [CHANGED, shortened]

`Poora kissa` (opens the certgen receipt; accessible name "Poora kissa: certgen receipt") [CHANGED]
Plain-text twin: 324 of 324 tests passed. A separate audit then found 19 problems, two of them high. [SAME]

Receipt sheet CERTGEN: v2 §2 word for word (it keeps 479 main and 232 audit tests, zero open findings in scope, and "Isse zyaada ka daava main nahi karta"), minus the guess widget. [SAME]

### 1.4 Transition into the baithak (appears after 4 s idle, with the ember pulsing at the bottom edge)
Diya jal gaya. Ab andar aaiye: baithak mein baat karte hain. [NEW]

---

## ACT 2: THE SITTING ROOM (who I am, how I think, how I work, what I bring)

[KICKER] MEET SHRINIWAS [NEW, replaces "THE PERSON BEHIND THE FILE"]
## Baithiye, chaay aa rahi hai. [NEW]

I'm Shriniwas, a final-year VIT Pune engineering student applying for Wispr Flow's India growth internship. Strengths ki list résumé mein hai; yahan sirf chaay aur chaar khidkiyan. [CHANGED]
Pane tabs (first pane auto-opens): `Who I am` · `How I think` · `How I work` · `What I bring` [NEW]
Hint: Kisi khidki ko chhuiye. [NEW]
Each card: a face of about 30 words, a `Proof` flip and a `Plain text` disclosure always in the DOM. [NEW]

### Pane 1: WHO I AM

**Card 1. Pehle, main kaun?** [NEW]
Face: I'm a final-year VIT Pune student in Instrumentation and Control, graduating May 2027. Main software banata hoon, debate karta hoon, likhta hoon aur business strategy padhta hoon. Code jitna hi zaroori mere liye log hain. [NEW wording of verified facts]
Chips that jump to a card: `Builds` · `Debates` · `Writes` · `Studies`
Proof: `View my résumé (opens Google Drive)`

**Card 2. Meri raah** (roots) [NEW]
Hook: Ek gap year, YouTube, ₹3,999 ka course, aur raasta VIT Pune tak.
HIDDEN (default): A gap year, unsuccessful entrance attempts, YouTube study and a ₹3,999 course formed my route to VIT Pune. I enjoy business case studies, essays and Advaita Vedanta. [SAME sentences from v2 §9]
FILLED adds: `meet.roots.father`: My father's accident brought serious financial pressure during my Class 12 exams. [SAME]. `meet.roots.examOrder`: {EXAM_ORDER_LINE}. `meet.roots.case`: A business case I studied: {BUSINESS_CASE}.

### Pane 2: HOW I THINK

**Card 3. Debate** [NEW]
Hook: College debate mein doosra number.
HIDDEN: I placed second in a college debate. (Self-reported.)
FILLED (`meet.debate.filled`): Motion: {DEBATE_MOTION}. My side: {DEBATE_SIDE}. Level: {DEBATE_LEVEL}. What it taught me: {DEBATE_LESSON}.
Flip `Doosri taraf dekhiye`: Side one: *Ship karte.* 324 of 324 tests passed. Side two: *Ruk jaate.* A separate audit found 19 problems, two of them high. Caption: An illustration from this page's facts, not a debate transcript.
If both Card 3 and Card 5 stay unfilled (`meet.mergeThin`, ON): one card, "Debate aur coordination": I placed second in a college debate. I coordinated four research contributors. No flip.

**Card 4. Likhna: "Who Audits the Auditor?"** [NEW]
Hook: Ek lamba essay, ek chhoti si aadat: AI se kehna, "apna jawab khud check karo."
Face: Essay ki shuruaat ek habit se hoti hai: before trusting an important answer, I ask the AI to check itself. Phir catch: jab wahi system apna audit karta hai, woh audit independent nahi hota. About 10,000 words.
Interaction `Ek baar tap kijiye`: a closed ring of three lamps; an outer lamp lights, labelled "a separate check". Caption: A sketch of the essay's idea, not the essay.
Back: "We were never outside the thing we were trying to change." (the essay's last line)
Filled: `meet.essay.idea`: In my own words: {ESSAY_IDEA}. `meet.essay.berggruen`: {ESSAY_BERGGRUEN_LINE}.
Link: `Read my long-form essay` [SAME label, v2 drawer]

### Pane 3: HOW I WORK

**Card 5. Chaar log, ek plan** (research coordination) [NEW]
HIDDEN: I coordinated four research contributors. With TipIndex, I directed a handoff from Codex to Claude Code and approved a verified disk cleanup (agents, not people). [facts SAME as v2 §5/§9]
FILLED (`meet.research.filled`): The project: {RESEARCH_PROJECT}. What each of the four did: {RESEARCH_SPLIT}. What I coordinated: {RESEARCH_MY_PART}.

**Card 6. Mera loop: pehle rule likhiye, phir number maniye** [NEW]
Six tappable stops on a ring; plain-text twin is a numbered list:
1. **Rule pehle** (set the rule early). TipIndex: a quiet-machine rule, limit 3.0 s, written after attempt one but before the reruns. certgen: the QR branch was held to a pre-agreed requirement and not merged.
2. **Number saaf nikaliye** (measure cleanly). Blitz: 1,205 ns came from an uncommitted tree; the controlled run gave 1,850. Vigil: a benchmark inherited a one-CPU affinity mask, so its comparison was invalid.
3. **Todne ki koshish** (try to break it). certgen: 324 tests, then 19 audit findings. Vigil: swap the guard for `if (false)` and exactly two targeted tests fail. Blitz: 3,059 crossed-at-rest states in 110,000 replay events.
4. **Round ko rukne dijiye** (let a run stop when it should). TipIndex: 9 of 10 rounds contaminated; attempt two stopped at 3.52 s against a 3.0 s limit; attempt three passed; 820 measured rounds.
5. **Claim chhota kijiye** (narrow the claim). Blitz: 3.1× to about 1.02×. PitDB: a 1 ms trimmed mean hid a 14.2 ms raw mean.
6. **Agla test likhiye** (propose the next one). India test: a setup script for the family member who installs Flow on a relative's phone, measured by whether the relative dictates again alone within 24 hours; success defined in advance. Proposed, not run.
Fair warning: Failed timing values were deleted at my instruction, despite a general "preserve failures" policy.
Filled: `meet.loop.ownWords`: My loop, in my own words: {LOOP_OWN_WORDS}. `meet.outside`: Outside the five projects: {OUTSIDE_TEST_LINE}.

### Pane 4: WHAT I BRING

**Card 7. Five things the projects show** [NEW]
Hook: Har cheez ke saath saboot aur uski seema. I have no growth wins to borrow. [second sentence SAME]
Tap a lamp; twin is a five-row table.
1. **Experiment design.** Proof: TipIndex's rule written before the reruns; an India protocol that says in advance what counts as no improvement. Fair warning: I have not run a growth experiment; the India test is proposed, not run. *My view: decide success before the dashboard.*
2. **Honest measurement.** Proof: Blitz 1,205 ns to 1,850 ns, 3.1× to about 1.02×; PitDB's 1 ms against 14.2 ms. Fair warning: 1,850 ns is historical, not today's number. *My view: a flattering number is the easiest thing to ship.*
3. **Writing that holds an argument.** Proof: the essay "Who Audits the Auditor?". Fair warning: I haven't claimed published or product-marketing writing here.
4. **Coordination.** Proof: four research contributors; the Codex-to-Claude Code handoff. Fair warning: the handoff coordinated AI agents, not people. (If `meet.research.filled`: add {RESEARCH_MY_PART}.)
5. **A student's view from India.** Proof: final-year at VIT Pune; YouTube study and a ₹3,999 course; my India test starts from what Wispr's own help page says: Hinglish is chosen by hand, not assumed. Fair warning: one student's view, not a market study; I began using Flow on 1 November 2026. Optional `bring.indiaShare` (OFF): TechCrunch, citing Sensor Tower (9 May 2026), put India at about 14% of installs and about 2% of in-app revenue.

### Close of the sitting room
**I didn't learn that every plan works. I learned to decide what to do when it doesn't.** [SAME, v2 §9]
Transition: Chaay khatam. Chhat par chaliye: baaki diye wahin intezaar kar rahe hain. [NEW]

---

## ACT 3: THE TERRACE (lamps 2 to 5)

[KICKER] THE FIVE LAMPS [NEW]
Entry line: Chhat par hawa thandi hai. Lamp 1 jal chuka; chaar diye aur, haath badhaiye. [NEW]
Pass prompt on each unlit lamp: Lamp {n} ko chhuiye, lau aage badhegi. [NEW] Lit: Lamp {n} jal utha. [SAME]
Each screen: kicker, title, hook, **Phir kya hua / Maine phir kya kiya**, **Fair warning**, chip, `Poora kissa`. Receipt sheets: v2 §3 to §6 word for word. [SAME]

### Lamp 2
[KICKER] LAMP 2 · VIGIL · THE WATCHDOG THAT TRUSTED A LATE REPLY [SAME]
### Der se aaya jawab [SAME]
Vigil poochhta hai: "Hello? Aap wahin hain?" Despite green tests, a reply arriving after the deadline could count as proof of health. [CHANGED]
`TEST THE LATE REPLY` · Khiskaiye aur dekhiye. [SAME]
`MODEL OF DOCUMENTED BEHAVIOR` A simulated connection, not real monitoring. [SAME]
Logic toggle, slider (0 to 6 s, starts at 2) and 3-second deadline: v2 §3. [SAME]
Readouts, before and after the deadline, original and corrected: v2 §3 word for word. [SAME]
Flame caption, original, past the deadline: Lau jalti rahi, jawab toh der se aaya tha. [NEW]
Flame caption, corrected, past the deadline: Lau dheemi hui: der se aaya jawab ab proof nahi. [NEW]
Slider label and plain-text twin: v2 §3 and §16. [SAME]
**Maine phir kya kiya**
Maine poochha: kya tests asli vaada check karte hain? With the correction removed, exactly two targeted tests failed; restored, 105 passed. [CHANGED]
**Fair warning** Simulated connections only. The 105 tests were verified locally in an agent session, not in CI, and there was no production deployment. [CHANGED]
Chip: 105 / 105 tests · simulated [NEW]
Sheet keeps: The question became: does it deliver what someone depends on?

### Lamp 3
[KICKER] LAMP 3 · BLITZ · THE NUMBER I WITHDREW [SAME]
### Jo number maine waapas liya [SAME]
A speed claim looked remarkable: 1,205 nanoseconds. It had come from an uncommitted working tree. [CHANGED]
`Tap 3.1×` · 3.1× par tap kijiye. [NEW] The sparkler throws sparks for 2 s, then settles into a steady small lamp at about 1.02×.
Counter: 1,205 ns → 1,850 ns · 3.1× → about 1.02× [NEW labels, SAME facts]
Caption: Chamak nahi, sach. [SAME, v2 §4; the act's one dry line]
**Maine phir kya kiya** I chose the defensible story over the flattering one: the headline was replaced, and later changes made even the replacement historical. [CHANGED]
**Fair warning** 1,850 ns is a historical run, not today's number. Current latency has not been remeasured. [SAME]
Chip: Historical run · not remeasured [NEW]
Plain-text twin: the advertised 3.1× advantage shrank to about 1.02×; 1,205 ns came from an uncommitted working tree, 1,850 ns from the controlled run. [NEW]

### Lamp 4
[KICKER] LAMP 4 · TIPINDEX · THE AGENT STOPPED, THE WORK CONTINUED [SAME]
### Agent ruka. Kaam nahi. [SAME]
Codex hit its limit mid-experiment. Beech raaste mein agent ruk gaya; file adhoori. [CHANGED]
`Lau doosre agent ko dijiye` (the flame passes from the lamp labelled Codex to the lamp labelled Claude Code) [NEW]
**Maine phir kya kiya** I directed a handoff to Claude Code and resumed from checkpoints: 820 completed measurement rounds. [CHANGED]
**Fair warning** Agents wrote most of the code and ran most benchmarks. One laptop, limited workload; not product speedups. [CHANGED]
Chip: 820 rounds · repo-reported [NEW]
Sheet keeps the disk cleanup and **A process shouldn't depend on one operator remembering everything.**

### Lamp 5
[KICKER] LAMP 5 · PITDB · THE FUTURE APPEARED EARLY [SAME]
### Future, waqt se pehle [SAME]
In one time-zone edge case, a database meant to answer "What was known then?" showed a 06:15 event at 06:00. [CHANGED]
`Ghadi ko chhuiye` (the 06:15 event slides to 06:00 on a clock face) · Caption: 06:15 ki baat, 06:00 par. [NEW]
**Phir kya hua** Agents found and addressed it in a local remediation version; the claim was narrowed. [CHANGED, label SAME; do not switch to "Maine phir kya kiya" until his approvals are confirmed]
**Fair warning** That correction is not yet in the public default branch, and I am not saying every audit finding is fixed. [CHANGED, keeps both v2 facts]
Chip: LOCAL-BRANCH fix · public branch is older [NEW]

### Auto beat after Lamp 5 (3 s, then fades)
Paanch diye jal uthe. Kisi ki roshni kam nahi hui. [CHANGED from v2 §7]
Kamra ab thoda sunehra ho gaya. [SAME]

### Transition into the voice
Paanch diye jal chuke. Ab ek awaaz suniye: meri, aur Flow ke likhe text ki. [NEW]

---

## ACT 4: MY VOICE, FLOW'S TEXT

[KICKER] MY VOICE, FLOW'S TEXT [CHANGED from "THE FIRST CLUE WAS MY VOICE"]
## Soch poori hone do [SAME]
*Let people finish thinking.* [SAME]

Here's a real thought I spoke on **2 November 2026**: "Shouldn't the technology adapt to how we naturally think and communicate?" [SAME]
Dono ko saath rakh ke padhiye: meri hand-transcribed voice memo, aur Flow ka actual text. Thought wahi raha; bas expression saaf ho gaya. [SAME]
That matters more to me than "type faster": **let people finish thinking.** [SAME]

(The v2 gated line about speaking directions into a builder is deleted. No recording exists; nothing may claim the page was built by voice.)

`COMPARE THE TWO REAL TAKES` Flame ko meri awaaz se Flow ke text tak khiskaiye. (Arrow keys work too, or use "Read it plainly".) [SAME]
*Blue pencil: words Flow trimmed. Highlighted: words Flow smoothed or added.* [SAME]
`Read it plainly` (toggle; marked in text, not only colour) [SAME]
Opens on Take 2. `Doosra take` switches to Take 1. [NEW label]

**Take 1** · 2 Nov 2026, 7:27 pm · **Spoken with Wispr Flow**

*As I said it:*
Okay, so... the best interface... I think it's basically when you don't have to think about using it, like learning it sorry sorry how to use it.

Like, when you're using something and you're not constantly wondering where to click or what to do next.

You're just... doing what you came there to do.

And, yeah, I think that's actually quite difficult to build. Because all the complicated stuff, the logic, the decisions... someone has to handle all of that. Just not the user.

*As Flow wrote it:*
Okay the best interface, I think, is basically when you don't have to think about how to use it, like when you are using something and you are not constantly wondering where to click or what to do next. You are just doing what you came there to do. I think that's actually quite difficult to build because all the complicated stuff, the logic, the decisions, someone has to handle all of that, just not the user.

**Take 2** · 2 Nov 2026, 7:30 pm · **Spoken with Wispr Flow**

*As I said it:*
Wait, I think there's another way to look at this.

We spend so much time learning how to use technology... remembering commands, figuring out buttons, changing ourselves to fit the tool adjusting to how a tool works.

But why? I mean, shouldn't it be the other way around?

Shouldn't the technology adapt to how we naturally think and communicate?

Because we already know what we want to say. We shouldn't have to learn the tool first struggle just to get it out.

*As Flow wrote it:*
I think there's another way to look at this. We spend so much time learning how to use technology: remembering commands, figuring out buttons, adjusting to how a tool works. But why? Shouldn't it be the other way around? Shouldn't the technology adapt to how we naturally think and communicate? Because we already know what we want to say, we shouldn't have to struggle just to get it out.

**Where this came from:** My Wispr Flow history · Wispr Flow · 2 Nov 2026 · Output matches Flow history word for word. "As I said it" is my own hand transcription of what I said, typed from my voice memo. [SAME]
**Chip:** A real take, straight from my Flow history [SAME]
**Alt text:** Two columns of text for each take, my spoken words on the left and Flow's text on the right, joined by a glowing line. [SAME]

---

## ACT 5: THE LAST LAMP

Entry transition (stage dims to near-black): Paanch diye jal chuke, ek awaaz bhi suni. Ab chhat ke sabse door wale kone mein dekhiye: ek diya abhi bujha hai. [NEW]

### ACT 5 COPY (final): THE HANDOVER TEST (replaces the old Hinglish-demo proposal everywhere)

Status badge, always visible on this screen: `PROPOSED, NOT RUN`
[KICKER] LAMP 6 · THE LAST LAMP · A TEST I HAVE NOT RUN
## Install ek favour hai.
**The real test is the second dictation: the one that happens after the helper leaves the room.** [hook, the one line to remember]

Wispr has said that older users are often onboarded by younger family members. Then the install measures the helper. What measures the user is the next dictation, done alone. Aapke ghar mein IT department kaun hai? Wahi is test ka asli user hai.

Press-and-hold answer on the lamp itself stays: Yeh diya abhi nahi jalega. Test chala nahi. Bujha hua, par imaandaar.

**Three taps, under a minute. Nothing here is a result.**

1. `Chuniye: Hindi · Hinglish` Two chips over one illustration sentence. Hindi shows "कल मिलते हैं". Hinglish shows "kal milte hain". Caption: Wispr's help centre says Hinglish is not picked for you: you choose it in Settings, and it writes Hindi in Latin letters. *An illustration of documented behaviour, not a recording.* Plain-text twin: one paragraph with both forms and the sentence above.
2. `Apna andaza lagaiye` Two sliders from 0 to 6. "Speed demo: how many of 6 relatives dictate alone the next day?" and "Handover script: how many?" A line under them says which pre-registered rule those numbers would trigger: scale, change or kill. *The rule is fixed before any data. No result exists.* Plain-text twin: the rule as a three-line list (PART F §3).
3. `Bolkar dekhiye` A button ticks a counter toward 2,000 words. At 2,000 a line appears: Wispr's published referral rule: the referrer earns a month only once the friend has dictated 2,000 cumulative words. Signing up alone earns nothing. *A simulated counter of a rule published in Wispr's help centre (read 3 November 2026).* Plain-text twin: the rule in one sentence.

**The experiment, in short** (about 120 words, shown in a card under the taps)
Mera experiment: *The Handover Test (Haath Chhodke Dekho).* Variant A is a speed demo. Variant B: the helper picks Hinglish by hand on the relative's own phone, adds five names that matter to the relative to the personal dictionary, and the first dictation is a real message to someone they love. Then the helper leaves the room. The question: does the relative dictate again, alone, within a day? Twelve family pairs, six per arm, one week, exploratory only. The rule is fixed in advance: scale only if B gets at least 4 of 6 and beats A by at least 2; otherwise change or kill. Cost about ₹2,000. Proposed, not run.

**Why this is my idea, not a template:** A template would say "test two pitches". This tests what happens after the helper walks away.

**Honest limits:** Proposed, not run. I have never owned a growth channel. Twelve pairs cannot show cause, and I have no Wispr data. The "India onboarding" angle is my hypothesis, not something Wispr has said.

**Where this comes from** (links open Wispr's own pages in a new tab; each is read-only evidence):
- https://docs.wisprflow.ai/articles/3191899797-use-flow-with-multiple-languages (Hinglish is chosen by hand; writes Hindi in Latin letters; one language per dictation) [official]
- https://docs.wisprflow.ai/articles/5899191431-flow-is-transcribing-in-the-wrong-language (the language setting is a known friction in Wispr's own help centre; a language set on another device does not carry to an iPhone) [official]. On the page, label this link "Help page: transcribing in another language".
- https://docs.wisprflow.ai/articles/6496688316-how-to-find-your-referral-link (30-day trial for the friend; the referrer earns a month after 2,000 cumulative words; "Signing up alone earns you nothing") [official]
- https://techcrunch.com/2026/05/09/voice-ai-in-india-is-hard-wispr-flow-is-betting-on-it-anyway/ (older users onboarded by younger family members; personal apps such as WhatsApp; India about 14% of installs and about 2% of in-app revenue per Sensor Tower) [press, third-party data]
- https://wisprflow.ai/india (India page) [official]
- https://challenge.wisprflow.ai/ (the challenge brief) [official]

Button under the card: `Poora protocol` (opens the evidence drawer folder INDIA GROWTH TEST, whose body becomes the experiment card in PART F §3).
Invite line under it (invite point 2): `INVITE ME TO AN INTERVIEW` · Is test par baat karein? (opens the Invite sheet)

Rules for this screen: keep "Proposed, not run" visible at all times; do not print any free-plan cap number (Wispr's own pages disagree); do not call the 14% versus 2% figure a Wispr problem; do not say Wispr has an onboarding problem; do not claim the author has set up Flow for a relative unless he has confirmed it (open question 10). Before publishing, open each URL above and confirm the quoted behaviour still holds; if a page has changed, drop that claim.


Exit transition: Yeh diya bujha hai, par imaandaar. Ab jaane se pehle teen cheezein: meri seedhi baat, aapki wish, aur ek sawaal. [NEW]


---

## ACT 6: THE DOORSTEP AGAIN

### Seedhi baat (verdict)
[KICKER] SEEDHI BAAT [CHANGED, replaces "YOUR VERDICT"]
## Seedhi baat [SAME]
AI helped implement and investigate. I directed, approved and questioned; I didn't personally write every line or discover every bug. [CHANGED, shortened; the full v2 §11 paragraph stays in the full-text view and the ROLES folder]
I haven't owned a growth channel or shipped these prototypes to customers. Yeh zimmedari main kamaana chahta hoon. [SAME]
**I can't promise I'll always be right. I can show you what I do when I'm wrong.** [SAME]
`View my résumé (opens Google Drive)` · `Evidence drawer` · Kisne kya kiya: ROLES folder. [SAME / SAME / NEW]

### Ab aapki baari (wish)
[KICKER] YOUR TURN [SAME]
## Ab aapki baari [SAME]
Mere paanch diye jal gaye. Ab ek aapka. [NEW]
Ek real insaan ko do-teen line likhiye, jaise unse baat kar rahe hon. Generic forward nahi: woh toh sabke paas pehle se hain. [NEW]
*Write one short wish for one real person, in any language you like.* [SAME]
Bolkar likhna ho toh Flow ya koi voice typing chalegi; type bhi theek hai. [CHANGED]
Form labels, `Card banaiye`, the four share buttons, empty-field line, card-ready line, under-the-card line, copy messages and card alt text: v2 §12 and §16 word for word. [SAME]
During the flame's walk down the row: Lau chal rahi hai, diye se diye tak. [NEW]
Always-visible line: Wish upload ya save nahi hoti. `Poori privacy baat` ▾ [CHANGED]; the collapsed `Kuch idea chahiye?` prompts and the full privacy paragraph with its English summary are v2 §12 word for word. [SAME]

### Closure
Row caption: {N} diye pehle se. Aakhir mein aapka. (N=1: Ek diya pehle se. Aakhir mein aapka. · N=0: Yeh row aapse shuru hoti hai.) *This number is written inside the link. It is not a visitor count and is not verified.* [SAME]
[KICKER] YOUR LAMP IS LIT [SAME]
## Aapka diya jal utha.
## Ab mujhse ek sawaal poochhiye. [SAME]
Paanch projects mein se koi ek chuniye. Kya hua, maine kya kiya, aur kya abhi adhura hai: teeno batata hoon. [SAME]
`INVITE ME TO AN INTERVIEW` · Ek email. Ek lamp. Baaki baat wahin. [SAME]
`View my résumé` · `Evidence drawer` · `The 60-second file`
Then, small: Mere paanch diye bhi ek-ek karke jale. Jahan jawab adhura tha, wahan maine adhura hi likha. Sawaal poochhne ke liye yeh page khula hai. The best interface gets out of the way. The best evidence doesn't. [SAME]
**Shubh Deepavali.** **— Shriniwas** (after 9 November: **Shukriya. — Shriniwas**; no date printed) [SAME]

---

## THE INVITE SHEET (opens from every `INVITE ME` button; renders only if site.contact.email is set)

Title: Invite me to an interview [CHANGED, plain English for clarity]
Sub-line: Bas ek message. Aapka time, aapke sawaal. [NEW]
Options (equal-width, 44px, in this order):
1. `Open Gmail` · Opens a new Gmail message with everything filled in. [NEW]
2. `Open my mail app` · Uses the mail app on this device. [NEW]
3. `Copy address` · after the tap, the label becomes `Copied` for 2 s (aria-live: "Address copied") [NEW]
4. `Copy message` · after the tap: `Copied` (aria-live: "Message copied") [NEW]
Address shown as plain text under the buttons: {EMAIL}
Fallback line: Kuch na khule toh address copy kijiye aur apne mail mein paste kar dijiye: {EMAIL}. [NEW]
Close: `Close` [SAME]

Message subject: Interview invitation: Shriniwas Kholkute, Wispr Flow India growth internship [NEW]
Message body: [NEW]
> Hi Shriniwas,
>
> I visited Ek Diya Se Doosra and would like to invite you to an interview.
>
> Proposed time: [your suggestion]
> Format: [call / video / in person]
> A project or question you'd like me to start with: [optional]
>
> Regards,
> [your name and role]

---

## THE 60-SECOND FILE (dialog, also #sixty)

[LABEL] THE 60-SECOND FILE · *Jaldi mein hain? Yeh padhiye.* [SAME]
**324 tests passed. A separate audit found 19 problems. Would you have shipped it?** [SAME]

Namaste. I'm Shriniwas, an engineering student applying to Wispr Flow's India growth internship. I mapped workflows and architectures, made or approved key design decisions, and used AI agents for implementation and investigation. [CHANGED]

In one project, I approved further corrections after the first audit fixes weren't enough. In another, a watchdog called a late reply proof of a healthy connection; I questioned whether the tests actually proved the product's promise, and the corrected test failed when its fix was removed. [CHANGED, same facts, two paragraphs merged]

I also withdrew a flattering speed claim, redirected an interrupted experiment between AI agents, and narrowed a database claim after a specific time-handling defect. [SAME]

I have no growth wins to borrow. But I've used Flow, and I want to test what happens after the helper leaves the room: when a younger relative sets Flow up for an older one, does the older person dictate again, alone, the next day? Proposed, not run. [CHANGED]

*I can't promise I'll always be right. I can show you what I do when I'm wrong.* [SAME]

Baaki kahani chhat par hai. [NEW]
`OPEN ONE RECEIPT` · `INVITE ME TO AN INTERVIEW` · `Take the whole walk` [SAME / SAME / NEW]

---

## EVIDENCE DRAWER (headings and intros; bodies stay as in content.json)

**Evidence drawer** [SAME]
Every figure on this page has a source and a status. Statuses are plain text: PUBLIC, LOCAL-BRANCH, REPO-REPORTED, PERSONALLY CONFIRMED, UNRESOLVED, PROPOSED. Koi ek claim chuniye, evidence kholiye. Jahan jawab abhi adhura hai, wahan UNRESOLVED likha hai. [CHANGED]

Folder headings, in order: 1 CERTGEN: The green wall · 2 VIGIL: The late witness · 3 BLITZ: The number I withdrew · 4 TIPINDEX: The operator changed, the evidence stayed · 5 PITDB: The future appeared early · 6 ROLES: Who designed, who executed, who verified? · 7 THE PERSON AND THE VOICE: Sources · 8 INDIA GROWTH TEST: The proposed protocol [SAME]
One-line intros for 1 to 6 and 8: v2 §14 word for word [SAME]. Intro 7 [CHANGED]: Essay, résumé aur voice takes kahan se aaye, aur kya abhi baaki hai.

Field labels (unchanged): Plain-English purpose · The central finding · My part · Recorded results · Where to inspect · Status · Other findings

---

## FULL TEXT VIEW (menu: `Poora text padhiye`, also prints)

Title: Poora text. Line: Yahan sab kuch seedhe text mein hai: koi animation nahi, koi interaction nahi. Har interaction ka plain-text version bhi. [NEW] Order follows the page; the sitting room is four headed paragraphs; the verdict shows the full v2 §11 first paragraph. [CHANGED]

## MICROCOPY

- Progress, from the terrace on: {n} diye jal chuke, {5-n} baaki (n=5: Paanchon jal uthe). Screen-reader lamp states, bad-link line, start-again, slider spoken value: v2 §16 [SAME]
- Idle hint at the bottom edge: Agla diya → [NEW]
- Open story: `Poora kissa`. Close story: `Chhat par waapas`. [CHANGED, were "Kissa kholiye" and "Row par waapas"]

## FOOTER

Lines 1, 2, 3, 6 and 7 are v2 §17 word for word [SAME]. Line 4 (no analytics, cookies or third-party script) publishes only if the build proves it. Line 5 [SAME]: {BUILT_ON_LINE}: the tool actually used to build the page. The Hinglish lines were drafted with AI help and approved by me. Only the two takes above were spoken with Wispr Flow.

---

# APPENDIX

## A. Count and blend

About 4,900 words by `wc` (markup included), with about 470 verbatim take words, tags and this appendix. A rough word-list count of the visible copy gives about 75% English and 25% Hinglish; only the strings new in v3 (hooks, transitions, hints, wish, closure) run near 65/35. Reusing the unchanged v2 receipts and takes keeps the whole page near 72/28, a little under the 30% target, not script-exact. Hinglish carries hooks, titles, hints, transitions, wish and closure; English carries numbers, definitions and every fair warning.

## B. Slots and flags (default)

- meet.roots.father OFF; meet.roots.examOrder OFF {EXAM_ORDER_LINE}; meet.roots.case OFF {BUSINESS_CASE}
- meet.debate.filled OFF {DEBATE_MOTION} {DEBATE_SIDE} {DEBATE_LEVEL} {DEBATE_LESSON}
- meet.research.filled OFF {RESEARCH_PROJECT} {RESEARCH_SPLIT} {RESEARCH_MY_PART}
- meet.mergeThin ON (merges the debate and research cards while unfilled)
- meet.essay.idea OFF {ESSAY_IDEA}; meet.essay.berggruen OFF {ESSAY_BERGGRUEN_LINE}
- meet.loop.ownWords OFF {LOOP_OWN_WORDS}; meet.outside OFF {OUTSIDE_TEST_LINE}
- bring.indiaShare OFF
- invite renders only if site.contact.email is set ({EMAIL}); linkedin optional
- GROWTH_ACT: the Act 5 copy above (PART E) and the experiment card in PART F
- footer line 4 OFF until verified; {BUILT_ON_LINE} required; sign-off swaps to Shukriya after 9 November

## C. New interface labels for approval

Calm; Poora text padhiye; Sab diye ek saath jalaiye; Aakhri diya; MEET SHRINIWAS; Baithiye, chaay aa rahi hai; four pane tabs; Proof; Plain text; Doosri taraf dekhiye; Ek baar tap kijiye; Round ko rukne dijiye; Lau doosre agent ko dijiye; Ghadi ko chhuiye; Tap 3.1×; THE FIVE LAMPS; Poora kissa; Chhat par waapas; Agla diya →; Doosra take; Take the whole walk; the five invite-sheet labels; Jaldi mein? 60 second ki file →; Poori privacy baat; the SEEDHI BAAT and MY VOICE, FLOW'S TEXT kickers.

## D. Facts I was unsure about

1. TipIndex rule timing: the folder says written after attempt one, before reruns; the ledger says "predeclared". I used the folder wording.
2. Debate, four contributors, father's accident, exam order and the Berggruen link remain on the ledger's open list; only the v2 sentences appear as fact.
3. "About 10,000 words" for the essay is PART D's count (9,996), not in content.json.
4. Loop numbers (3,059 of 110,000; 9 of 10; 3.52 s against 3.0 s; 1 ms against 14.2 ms) are from the folders in reference/content.json, outside your short list.
5. The Hinglish lines are drafts for him to say aloud and approve.


---

# PART F: THE GROWTH EXPERIMENT (The Handover Test), with the research behind it

Note: section 4 here ("Page version") is a working draft. The final on-page words for this screen are in PART E, Act 5 (corrected hook and limits). The experiment card in section 3 is what the evidence drawer folder INDIA GROWTH TEST must show. Wispr page quotes below were extracted by a tool that returns model-written summaries: re-open each page and confirm before publishing (PART G14).

Status of everything below: PROPOSED, NOT RUN. No result, lift or Wispr data is claimed. Tags: [official] = Wispr's own page; [press] = journalist report, incl. quotes from Wispr people; [third-party] = outside data.

## 1. Sources checked (re-opened 3 Nov 2026; WebFetch returns model-written extracts, so wording is "as extracted")

| ID | URL | Confirmed this session |
|---|---|---|
| H1 | https://docs.wisprflow.ai/articles/3191899797-use-flow-with-multiple-languages | CONFIRMED [official]: Hinglish "Flow does not detect it automatically"; "Writes Hindi in Latin letters and formats English normally"; "Flow detects one language per dictation, not per word"; Flow identifies 23 languages from speech and Hinglish is not among them. Search finds "hinglish"/"romanized" in the language list. |
| H2 | https://docs.wisprflow.ai/articles/5899191431-flow-is-transcribing-in-the-wrong-language | NEW [official]: "Select Hinglish explicitly for Hindi in English letters, not Hindi or English"; Auto-detect won't produce Hinglish; on iPhone "Choices from another device apply only when no language is set locally". So a desktop-side setting does not rescue a phone. |
| H3 | https://wisprflow.ai/india | CONFIRMED [official]: Rs 400/month, Rs 320/month annual; students and educators 50% off Pro; UPI and cards; 100+ languages incl. Hindi, Hinglish; "recommends one language per dictation"; free plan "unlimited dictation" yet "Flow Pro removes the weekly limit" (internal tension); "4x faster" than typing; counter 12,308 India sign-ups and 1,10,871 hours saved "this week" (live snapshot). |
| H4 | https://docs.wisprflow.ai/articles/6496688316-how-to-find-your-referral-link | CONFIRMED [official]: referred friend gets a 30-day Pro trial (standard is 14); referrer earns one month of credit after friend dictates "2,000 cumulative words"; "Signing up alone earns you nothing"; cap 1,000 referrals; no credit if friend subscribes through App Store/Play Store. |
| H5 | https://techcrunch.com/2026/05/09/voice-ai-in-india-is-hard-wispr-flow-is-betting-on-it-anyway/ | CONFIRMED [press, Wispr quotes; Sensor Tower is third-party]: India 14% of installs vs about 2% of in-app-purchase revenue, Oct 2025 to Apr 2026; usage "split 50:50 between desktop and mobile"; "older users being onboarded by younger family members"; "The biggest thing is people are starting to use it more in personal apps" (Kothari; WhatsApp, social media); Rs 320 (~$3.4) vs $12; may fall "as low as Rs 10 to 20"; "around 30 employees in India" within a year; English-to-other-Indian-language switching planned. |
| H6 | https://docs.wisprflow.ai/articles/4760791189 | CONFIRMED [official]: free weekly caps are defaults that "can change without an app update"; Mac/Windows warning at 2,000, blocked above 5,000; Android slows 2,500, blocked 3,000; iOS slows 550, blocked 750. |
| H7 | https://docs.wisprflow.ai/articles/7140488640-trial-end-value-summary-in-wispr-flow | CONFIRMED [official], and it disagrees with H6 on bonuses (8,000-word Mac/Win bonus; Android +1,500 bonus). NEW: "Android doesn't offer a free trial", which sits oddly beside H4's 30-day referred trial. Treat caps and trials as unstable; say "weekly limit", never a number. |
| H8 | https://challenge.wisprflow.ai/ | CONFIRMED [official]: "primarily looking for a couple of exceptional interns to join our India growth team"; criteria Creativity, Use of voice, Extreme ownership, Work over credentials; dates 28 Oct to 4 Nov, shortlist 5 Nov, hire 20 Nov. |
| H9 | https://wisprflow.ai/post/flow-on-android and https://wisprflow.ai/post/supporting-languages | CONFIRMED [official]: "the first voice model to actually support transcription in Hinglish instead of traditional Hindi script"; romanized example "tum kya kar rahe ho"; "Roughly 50% of people speak more than one language in their day-to-day life". The Android post itself gives no setup steps. |
| H10 | https://wisprflow.ai/post/the-master-plan | CONFIRMED [official]: "Our focus is on optimizing the activation and engagement that turns a feature into a habit"; "building a habit engine to help new users learn to use voice". |
| H11 | https://wisprflow.ai/students | CONFIRMED [official, US page, no India terms]: 3 months Pro for new-to-Pro students; "both get a free month of Flow Pro when they hit 2,000 words". |
| H12 | https://wisprflow.ai/post/wispr-in-uk | CONFIRMED [official]: "You came to us"; UK MAU up 7x in six months; UK mobile use 2x global average. Community-led precedent. |
| H13 | media4growth OOH page; Bologe Toh Tum Dikhoge coverage (t2online, medianews4u) | Auto campaign: 100 autos, rear branding, no taglines or results stated [press]. Film exists, Sep 2026 [press]. Not used as evidence of effect. |

Findings that change the framing: (a) Wispr itself uses 2,000 cumulative words as the line between a signup and a real user (H4, H11). That is the only public activation-like bar. (b) Wispr's help centre has a whole article on "transcribing in the wrong language" (H2): the language setting is a known friction in Wispr's own docs, though Wispr has never said it hurts India onboarding. That is my hypothesis, labelled as mine. (c) Not public (from the earlier fact base, unchanged): activation definition, first-run flow, cohorts, India conversion, share of India users on Hinglish.

## 2. Idea funnel

Scores 1 to 5: O originality, E evidence-grounding, C cost and speed, U upside, F fit with Wispr's stated strategy, W "would a Wispr lead wish they'd thought of it". Total /30.

| # | Idea | Mechanism | Cheapest first test | Failure mode | O E C U F W | Tot |
|---|---|---|---|---|---|---|
| 1 | Hinglish demo vs speed pitch (current lamp) | Two pitches, compare first and second dictation | 10 friends, two scripts | Hinglish is already Wispr's headline and "4x faster" is already on their page (H3): learns little | 1 3 5 2 4 1 | 16 |
| 2 | Hinglish Mirror | First run: say one sentence, see it under two language settings | Screen-record both on my phone | Fixes only the setting, not the habit; needs a product change | 2 4 4 3 4 2 | 19 |
| 3 | **The Handover Test** | Setup script for family helpers (Hinglish on, family names added, first dictation is a real message), measured by whether the relative dictates again after the helper leaves | 12 dyads, one week | Small N; helper skill varies; older users may lack a suitable phone | 5 4 4 4 5 5 | **27** |
| 4 | Reply-first activation | First 3 dictations are replies to real WhatsApp messages | 10 users, one week | Overlaps with #3; WhatsApp is not one app-level surface Flow controls | 3 3 5 3 5 3 | 22 |
| 5 | Voice-triggered referral snippet | A Snippet ("flow link") expands to your referral link plus a Hinglish line, so sharing is itself a dictation | Build snippet, share with 10 friends | Spam feel; affiliate/referral disclosure; no proof snippets expand reliably in WhatsApp | 4 3 4 3 3 4 | 21 |
| 6 | Hostel-floor cluster | Seed 5 people on one floor so trials and social proof stack | One floor, one week | Contamination between groups; novelty effect | 3 2 4 3 3 3 | 18 |
| 7 | "Naam pehle" (names first) | Add the user's own and family names to the personal dictionary before dictating | 5 friends with hard-to-spell names | Narrow; folded into #3 | 3 3 5 2 4 3 | 20 |
| 8 | Festival greeting sprint | Diwali/Eid/Christmas bulk personal messages as a one-day habit moment | One festival | One-off spike, no retention story | 3 2 3 2 3 2 | 15 |
| 9 | Pre-install "bol ke dekho" web demo | Try a Hinglish sentence in a browser before installing, reached by QR on autos | Prototype page | Cannot verify Wispr lacks one; needs mic permission and a build | 3 2 2 4 3 3 | 17 |
| 10 | Weekly Rs 29 UPI pass | Micro-price to close the 14% installs vs 2% revenue gap | Cannot be tested outside Wispr | Needs Wispr billing; app-store vs web checkout confounds | 2 3 1 5 4 2 | 17 |
| 11 | Gift-a-parent plan | Child pays on UPI for a parent's Pro | Survey 20 helpers' willingness | Stated willingness is not payment; Play Store credit rules (H4) | 4 3 1 4 3 4 | 19 |
| 12 | Hinglish creators teach "setup for parents" | Affiliate creators (Wispr already runs an affiliate programme) | Pay 3 micro-creators | Standard influencer play; costly to test | 2 2 2 4 3 2 | 15 |
| 13 | Phone-shop setup partnership | Retailers set up Flow when selling phones to older buyers | Visit 5 shops | No evidence shops would; needs a Wispr partner team | 4 1 2 4 2 3 | 16 |
| 14 | Campus club ambassadors | Student offer plus referral through clubs | 1 club | Every growth template has this | 1 2 3 3 3 1 | 13 |
| 15 | Auto-rickshaw ad that makes you speak | Spoken call to action on the back panel | Needs OOH budget | Cost; no results public | 3 1 1 3 3 3 | 14 |
| 16 | Placement-season "dictate your story" | SOPs, résumés, LinkedIn posts for final-year students | My own batch | Student wedge is plausible but generic | 2 2 4 3 3 2 | 16 |
| 17 | Hinglish-typing search capture | Store/search listings for people searching "Hinglish typing" | Write listings | No keyword data; weak without Wispr analytics | 3 1 4 3 2 2 | 15 |

Kills, in writing:
- #1 dies on information value: both arms are things Wispr already says. #14 and #12 are templates any applicant would send. #10, #13, #15 cannot be tested by one student without Wispr's systems or a street budget. #8 and #17 produce spikes or guesses, not a habit finding. #9 rests on a guess about Wispr's site.
- #7 and #4 are kept as ingredients, not experiments. #5 and #11 survive as second-order ideas.
- #3 wins because it is the only one where (i) Wispr has said the segment exists (H5), (ii) the metric is stricter than the one in the old lamp, (iii) one person with a phone and a family can run it this week, and (iv) Wispr's own referral rule already pays for the behaviour it measures.

## 3. The winner: experiment card

**Name.** The Handover Test (Haath Chhodke Dekho).

**One sentence.** Test whether a setup script for the family member who installs Flow on an older relative's phone (Hinglish on, their people's names added, first dictation a real message to someone they love) makes that relative dictate again on their own, after the helper has left the room.

**Insight (labelled: mine, not Wispr's finding).** An install done by a helper measures the helper. Wispr says older users are being onboarded by younger family members (H5 [press]) and that the growth push is into personal apps (H5). It also publishes three facts that make this fragile: Hinglish must be chosen by hand and is not auto-detected (H1 [official]); a language set on another device does not carry to an iPhone (H2 [official]); and a dictation is one language, not per word (H1). The helper, often a younger relative, knows the relative's real sentences and real names. So the setup is the product for this user, and "second dictation within a day" is only honest if nobody is sitting next to them. Wispr itself puts the line between a signup and a real user at 2,000 cumulative words (H4 [official]); "Signing up alone earns you nothing." The existing rule pays the referrer only after the friend actually dictates, which is exactly the incentive of a good helper.

**Hypothesis.** If the helper follows the Handover script (B) rather than a speed demo with default settings (A), then a higher share of relatives will send an unassisted dictation within 24 hours of their first usable one, because the first output arrives in the way they write (Latin-letter Hinglish), carries the right names, and was a message they cared about.

**Population.** Pairs (dyads) of a young helper (18 to 25) and a relative (parent, grandparent, aunt or uncle) who writes Hindi or Hinglish on WhatsApp, on an Android 13+ phone or an iPhone, free plan. Why: this is the segment Wispr named but gave no numbers for (H5). (Whether Shriniwas has set up a phone for a relative is unconfirmed, see open question 10; the page says nothing about it until he answers.) Not covered: relatives who write only Marathi or another language I cannot confirm Flow handles the same way.

**Variants (what happens, in Hinglish and English).**
- A, Speed demo (control; the old lamp's pitch). Helper installs with default settings, says: "Mummy, ye typing se kaafi tez hai. Bolke dekhiye." Relative dictates a test sentence, sees it, the helper leaves.
- B, Handover script. 1) Helper opens the language setting on the relative's own phone and picks Hinglish (search "hinglish"). 2) Helper adds five names that matter to the relative to the personal dictionary (personal dictionary is a free feature, H3). 3) Helper says: "Mummy, ek message boliye jo aap Aarav ko bhejna chahti hain." Relative says (example): "Aarav beta, kal ghar aa jao, aaj aloo paratha banaya hai." The text appears in Latin letters, the helper checks the names, and the relative sends it in WhatsApp. 4) Helper says: "Ab main bahar ja raha hoon. Kal subah aap khud ek message bol dena, kisi ko bhi." Helper leaves the room and the house for that session.
- Both arms: same phone type mix, same follow-up card, same consent, same "leave" step. Only the script differs. B bundles three changes (Hinglish, names, real message); I cannot separate them in a pilot. That is a stated limit.

**Primary metric (plain English).**
- First usable dictation: a dictation the relative sends in a real chat with at most one small fix.
- Unassisted second dictation within a day: a second dictation, sent within 24 hours of the first, when the helper was not in the room.

**Secondary metrics.** (1) Any unassisted dictation on day 7. (2) Names right on first try, out of the five. (3) Helper minutes spent on setup. (4) Total words in 7 days, shown against Wispr's own 2,000-word bar, descriptive only.

**Guardrails.** Any language setting changed away from Hinglish (and why); any "weekly limit" message seen (caps are defaults that change, H6, so just note it); discomfort or "bahut mushkil hai" feedback; helper stress; any privacy concern. Any guardrail breach in B is reported first.

**Measurement without Wispr data.** What I can observe with consent: the sent message arriving in the family chat (timestamp), the relative's one-tap answer ("bola ya type kiya?"), a photo of the Flow history or statistics screen where the app shows one, and a 3-question check by call on day 1 and day 7. I will not read chats or hold audio. What Wispr would instrument in the real product: first-dictation success, keyboard or bubble use, dictation timestamps, language-setting changes and word counts per cohort, by who completed setup.

**Sample and duration.** 12 dyads (6 and 6, assigned by coin flip), one week plus a day-7 call. Exploratory only. No significance claims. 12 dyads cannot show cause; they can show whether the idea is worth Wispr's real instrumentation.

**Pre-registered decision rule (written before dyad 1).**
- Scale (to about 40 dyads, or hand the script to Wispr as a spec): B has at least 4 of 6 unassisted second dictations AND at least 2 more dyads than A.
- Change: B leads by exactly 1, or ties on the primary but is clearly better on names or day-7. Re-cut the script and rerun.
- Kill this version: A equals or beats B on the primary, or B has any guardrail breach.

**Cost (my estimate, first run).** About Rs 2,000 to 2,500: thank-you snacks for 12 dyads about Rs 1,800, a printed one-page setup card and follow-up about Rs 200, data and travel about Rs 300. Free plan only; nobody is asked to pay.

**Risks and what could invalidate it.** Helper skill differs across dyads. Hawthorne effect (people try harder when watched). Novelty in week one. Older users may stop for reasons unrelated to the script. Free-plan limits could hit mid-week (H6 says they change). Referral credit is not used in the pilot, so no financial incentive contaminates the helper.

**Second-order idea (if it works at scale).** (1) A "Setup for Mummy" card inside the referral flow: the helper is already the referrer, and the existing 2,000-word rule pays them only if the relative keeps going (H4). (2) A gift plan on UPI at Wispr's published India price (H3), with the Play Store credit rules in mind (H4). (3) Creator and affiliate content that shows the handover, not the speed (Wispr runs an affiliate programme, partners.dub.co/flow). (4) The Bologe Toh Tum Dikhoge film's family moments become a call to action: "ek message bolo". That film link is my inference from press coverage, not a Wispr statement.

**Ethical consent note.** Informed, spoken-and-written consent in the participant's language; adults only; free to stop any time; no audio recording; the relative chooses what to share; Wispr's own privacy setting about improving the model stays as the participant decides after it is shown to them; no payment-linked incentives; data deleted after the write-up.

PROPOSED, NOT RUN. No result is claimed.

## 4. Page version

**(a) Hook.** "Install ek favour hai. The real test is the second dictation, after I leave the room."

**(b) 3-beat explainer (under 60 seconds, plays no results).**
1. *Tap the setting.* Two chips, "Hindi" and "Hinglish", over one illustration sentence. Tap swaps between Devanagari "कल मिलते हैं" and Latin-letter "kal milte hain" (my own illustration; Wispr documents Latin-letter Hinglish, H9). Caption: "Documented behaviour, not a recording. Flow does not pick this for you (H1)." Proves the setup matters. Twin: one paragraph of plain text with both forms.
2. *Place your bets.* Two sliders (0 to 6): "Speed demo: how many of 6 relatives dictate alone next day?" and "Handover script: how many?" A line below says which pre-registered rule your numbers would trigger (scale, change, kill). Proves the rule exists before the data. Twin: the rule as a three-line list.
3. *Watch the 2,000.* A "bolo" button ticks a counter toward 2,000 cumulative words; at 2,000 a line appears: "Wispr's published rule: the referrer earns a month only now (H4)". Label: simulated counter of a published rule. Proves signups alone are not the goal. Twin: the rule quoted in text.
Every beat is labelled MODEL or DOCUMENTED, never a result.

**(c) Condensed card (about 120 words).**
Mera experiment: *The Handover Test*. Wispr says older users often get onboarded by family, so the helper's setup is the product. Variant A is a speed demo. Variant B: Hinglish selected by hand (Flow won't pick it), five family names added, first dictation is a real message to someone they love. Then helper bahar chala jaata hai. Metric: does the relative dictate again, alone, within a day? Twelve family pairs, one week, exploratory only. Rule fixed in advance: scale only if B gets at least 4 of 6 and beats A by at least 2; otherwise change or kill. Aap dekhiye, no results here. Cost about Rs 2,000. Proposed, not run.

**(d) Why this is my idea.** "Aapke ghar mein IT department kaun hai? Wahi is test ka asli user hai. A template would say 'test two pitches'; this tests what happens after the helper walks away."

**(e) Source links (plain text).**
- https://docs.wisprflow.ai/articles/3191899797-use-flow-with-multiple-languages  proves Hinglish is chosen by hand, Latin-letter output, one language per dictation [official]
- https://docs.wisprflow.ai/articles/5899191431-flow-is-transcribing-in-the-wrong-language  proves the language setting is a known friction in Wispr's own docs [official]
- https://docs.wisprflow.ai/articles/6496688316-how-to-find-your-referral-link  proves the 2,000-word rule and 30-day referred trial [official]
- https://techcrunch.com/2026/05/09/voice-ai-in-india-is-hard-wispr-flow-is-betting-on-it-anyway/  older users onboarded by family; WhatsApp; 14% vs 2% (Sensor Tower, in-app only) [press, third-party data]
- https://wisprflow.ai/india  Rs 320 and Rs 400 pricing, UPI, student 50% off [official]
- https://challenge.wisprflow.ai/  the brief: India growth interns, ownership, work over credentials [official]

**(f) Honest-limits line.** "Proposed, not run. I have never owned a growth channel. Twelve pairs can't show cause, and I have no Wispr data."

## 5. What would make a Wispr lead say "wow"
- The metric: "unassisted second dictation" is a sharper test than install or day-1 use, and it needs no Wispr data to try.
- He used Wispr's own rule (2,000 words, "Signing up alone earns you nothing") as the definition of a real user, instead of inventing one.
- He found the product's own seam: language is manual, one language per dictation, and does not carry across devices (H1, H2).
- He named the helper as the unit of growth, and noticed the referral mechanic already pays the helper for the habit.
- He pre-registered scale, change and kill, and said exactly what the pilot cannot prove.
- Every claim carries a link and a tag, so the lead can check in one click.

## 6. Risks
- Novelty risk: family onboarding is already something Wispr has noticed; the originality is the handover metric and incentive reading, not the segment.
- Evidence risk: the two Wispr help pages disagree on caps; the India page says "unlimited dictation" yet "Pro removes the weekly limit"; Android no-trial vs 30-day referred trial is unclear. Do not print any cap number; say "weekly limit".
- Do not call the 14% vs 2% a problem Wispr has; it is Sensor Tower in-app only. Do not imply an India onboarding problem exists; it is a hypothesis.
- Consent and optics: involving parents needs real consent; the page must not show participant data or a fabricated one. Never imply a recording of a relative exists.
- Pilot validity: bundled change, no blinding, small N, helper variance. Page must keep "exploratory" visible.
- Language rule for page copy: "aap" forms only. The film title contains "Tum"; use it only as a title.
- The rule banned words on the site (cut, wrong, error, fail, reject, danger, miss, against, guilty, suspect, caught, trap): H2's article title uses "wrong"; paraphrase it as "transcribing in another language" if linked by label.


---

## PART G: RECONCILIATIONS (where the six agents' parts disagreed; these decisions win)

G1. **How the Meet Shriniwas cards (PART D) sit inside Act 2 (PART C).** Act 2 is a four-pane window: WHO I AM, HOW I THINK, HOW I WORK, WHAT I BRING. The cards live inside the panes: Pane 1 = Card 1 (who) + Card 2 (roots); Pane 2 = Debate + Essay; Pane 3 = Research + the six-step loop; Pane 4 = What I bring (five lamps). On first view a pane shows only its title and ONE hook line (30 words at most); the card body opens with one tap on `Aur dekhiye` (Proof / Plain text disclosure is always in the DOM). Only one card is visible at a time. `meet.mergeThin` defaults ON (the debate and research cards merge into one two-sentence card while their slots are empty). This is how the page stays unoverwhelming while the first half introduces him fully.

G2. **The growth test is now the Handover Test everywhere.** PART E already uses it. In the text of PART D, apply these replacements wherever they occur (they refer to the retired Hinglish-demo test):
- Loop step 6, "Agla test likhiye": replace the India-test sentence with: `Propose the next one. India test: a setup script for the family member who installs Flow on a relative's phone, measured by whether the relative dictates again alone within 24 hours. Proposed, not run.`
- "What I bring" item 5, proof: replace "my India test says I would not assume every Indian student uses Hinglish" with `my India test starts from what Wispr's own help page says: Hinglish is chosen by hand, not assumed`.
- "What I bring" item 1: keep "an India protocol that says in advance what counts as no improvement" (still true).
- 60-second file, last sentence of paragraph 4 is already replaced in PART E; make sure `FullTextView` and the share text do not still say "Hinglish-first demo".
- The evidence folder 8 (INDIA GROWTH TEST) body is REPLACED by the experiment card in PART F §3 (English, fields: Plain-English purpose, Audience and variants, Design, Metrics, Measurement, Decision rule, Cost, Risks, Status PROPOSED). Delete the old Variant A/B "Say the message. Skip typing it." text; it is not used anywhere now. Keep status "PROPOSED" and add "No result is claimed."
- Lamp 6 (the dashed sketch lamp) keeps its component and its press behaviour; only its on-screen copy changes (PART E, Act 5).

G3. **Invite sheet: structure from PART B, wording from PART E.** Use PART B's component structure, URL builders, copy helper and focus handling. Use PART E's words for the sheet (title "Invite me to an interview", the four options, the fallback line, the message subject and body). Keep the Outlook link as an optional extra button (`Open Outlook`) after the mail-app option. The lamp-number line ("My lamp number on your page: N") appears in the message ONLY if the visitor has lit their lamp, and N is the closure's number everywhere. The square-bracket prompts inside the message body (for example [your suggestion]) are intentional: they are for the sender to fill in.

G4. **Invite points (maximum three prominent, one in the Menu).** (1) Top bar pill, fading in after Act 2 and staying; (2) end of the growth act (Is test par baat karein?); (3) closure. The 60-second dialog, the full-text view and the Menu hold the same button. Every INVITE ME is a `<button>` that opens the sheet. No INVITE ME on the very first screen.

G5. **Dock.** Remove the fixed bottom dock. Move Look (Deepavali/Ink), Tilt, Light all, Full text, 60-second file, Evidence drawer and "Aakhri diya" into the Menu. Keep ONE 44px round `Calm` button in the bottom-right corner (with safe-area inset). Raise the sticky voice-compare slider's bottom offset so it is never under it (use `bottom: calc(64px + env(safe-area-inset-bottom))`). Calm and reduced motion keep every behaviour they have today. Calm is never stored.

G6. **First screen limit.** At most six visible elements: wordmark, Menu, the headline block, the lit home flame with its hold hint, the unlabelled lamp silhouettes, and one quiet "Jaldi mein? 60 second ki file →" link. No progress counter, no lamp name chips (labels appear as each lamp lights), no "SEE THE GROWTH TEST", no Look toggle, no INVITE ME. The faint dashed sixth lamp is visible at the far end as a quiet hook.

G7. **Act names are internal vocabulary.** Print only the kickers and headings that appear in PART E. Do not print "Act 1" or "dehleez" style labels.

G8. **Copy source file.** Extract PART E verbatim into a new file `website_copy_v3.md` at the repo root. Update `scripts/check-copy.mjs` to check every string in `copy.json` against `website_copy_v3.md` and `reference/content.json`; keep `website_copy.md` (v2) as history. Strings tagged [SAME] in PART E are unchanged from v2 and from `content.json`; do not retype them from memory, take them from the existing `copy.json`.

G9. **Rule timing wording.** Everywhere the TipIndex quiet-machine rule is mentioned, say it "was written after attempt one but before the reruns" (the evidence folder's wording). Never say "predeclared" for it. The word "predeclared" may be used only for the growth experiment's decision rule, which is genuinely written before any data.

G10. **Skyline at first load.** Show about 14 lit windows at tone 0 instead of 5 (a design call; the homes are part of the hook) and apply the skyline CSS in PART B. Keep the count table in `SkylineLayer` consistent for later tones.

G11. **Words per screen.** Visible words without scrolling (labels excluded): at most 45 in Acts 1 to 3, 60 in Acts 4 to 6. Anything longer moves behind `Poora kissa` or `Aur dekhiye`. Receipt sheets keep the v2 text word for word.

G12. **60-second file.** Its third button `Take the whole walk` closes the dialog and scrolls to the first screen. Its headline and facts are unchanged except paragraph 4 (PART E).

G13. **Essay card.** The essay "Who Audits the Auditor?" is described only as PART D says (a habit and a last line quoted from the essay). Do not link it to Berggruen unless `meet.essay.berggruen` is switched on, and do not equate the essay's "Hydra" benchmark with the Blitz project.

G14. **Official quotes.** The six Wispr pages in PART F were read by an agent whose fetch tool returns model-written extracts. Before publishing, open each page and confirm the claim; if you cannot, remove that claim and its link. Do not print any free-plan cap number.

---

## PART H: IMPLEMENTATION PLAN FOR CLAUDE CODE

Work in order. Commit and push after each phase. Run `npm run build` and `npm test` after each phase and keep them green. Update `BUILD_LOG_V3.md` as you go.

**Phase 0. Setup.** Create branch `v3-flow-and-growth` from `ek-diya-se-doosra`. Run `npm install`, `npm run build`, `npm test`, `npm run check` and record the baseline. Note: `npm run build` currently deletes `dist/og.png` if `playwright` is not installed; keep `dist/og.png` (restore it from git) or install Playwright as a dev dependency so `scripts/make-og.mjs` works. Do not set `SITE_URL` unless Shriniwas gives the public address.

**Phase 1. Bugs (PART B).** Implement the Invite sheet and every fix in PART B exactly (InviteSheet, mail builders with the lamp-number rule, closure invisible-link fix, layout CSS, dock into Menu plus the single Calm corner button, string-lights control, solid top bar, 44px targets, skyline). Run PART B's acceptance tests 1 to 14.

**Phase 2. Copy data.** Create `website_copy_v3.md` from PART E. Rewrite `src/data/copy.json` and the schema to match: new acts, panes, cards, flags (`meet.*`, `bring.*`), growth act, Invite sheet, microcopy, footer. Update `scripts/check-copy.mjs`. Keep `reference/content.json` as the source of the evidence bodies and the two takes. Gated lines default OFF.

**Phase 3. New flow (PART C).** Implement the six-act order, the sequenced first-screen headline (any tap completes it), the unlabelled lamp silhouettes, on-page lamp stops (`#lamp-1` to `#lamp-5`) with `Poora kissa` opening the existing receipt sheet, the auto beat after lamp 5 (replaces `#row-breathes`), the removal of the `#lamps` text list, the effects budget rule (at most 3 at once; sparks, cat, lantern sway and glints pause while a foreground interaction runs), the act cues on the stage (veil, pan, dusk step), the Menu contents, and the invite pill appearing after Act 2. Keep section ids where they exist; add `#baithak`, `#lamp-1`..`#lamp-5`.

**Phase 4. Meet Shriniwas (PART D).** Build the four-pane window using the existing Person window scene. Cards, loop ring, five-lamp "What I bring", proof chips (jump to and softly highlight the matching lamp), the essay sketch interaction, plain-text twins, and every `meet.*` flag. With every flag OFF, only verified sentences render.

**Phase 5. Growth act (PART F).** Build the three-tap explainer (language chips, the prediction sliders with the pre-registered rule, the 2,000-word counter), the experiment card, the source links, the `Poora protocol` drawer folder, and apply PART G2 everywhere.

**Phase 6. Verify and report.** Run: `npm test`, `npm run check`, `npm run build`; the existing browser suites in `scripts/e2e/` and `scripts/smoke.mjs` if Playwright is available (fix tests that depend on the old structure); PART B's 14 tests; and the new tests below. Take screenshots at 390x844, 360x640, 412x915, 768x1024, 1366x768, 1366x650, 1920x1080. End with a plain report: done, partly done, not verified (anything needing a real phone: touch, haptics, share sheet, frame rate), every new interface label for approval, and every open flag.

### New acceptance tests (in addition to PART B's 14)

1. First screen at 390x844 and 1366x768 has at most six visible elements and no INVITE ME; all six lamps are inside the viewport; the headline reveals in three beats and a tap completes it.
2. Running order: first screen, Lamp 1 stop, Meet Shriniwas (four panes), Lamps 2 to 5, Voice, Growth act, Seedhi baat, wish, closure. The person/interests content appears before Lamp 2.
3. Each on-page lamp stop shows at most 45 visible words and exactly one primary control; `Poora kissa` opens the receipt sheet with the v2 text word for word.
4. With every `meet.*` flag OFF: no slot placeholder, no `{`, no `[CONFIRM`, no `[FILL IN`, and no father's-accident sentence appears; the debate and research cards show only the merged two-sentence card.
5. Growth act: the three taps work with keyboard and touch; "Proposed, not run" is visible; each link has a unique accessible name and opens in a new tab with `rel="noopener noreferrer"`; no cap number appears; no sentence says the author set up Flow for a relative.
6. Invite: every INVITE ME opens the sheet; the address is visible text; Copy address and Copy message show "Copied"; no INVITE ME exists on the first screen; the top-bar pill appears only after Act 2.
7. Evidence drawer folder 8 shows the Handover Test experiment card; no text "Say the message. Skip typing it." remains anywhere.
8. `grep` the built `dist/` for: `Hinglish-first demo`, `Say the message`, `predeclared` (only allowed in the growth card's decision rule), `Diwali`, `40.62`, `0.585`, `629.70`, `tum ` (word), `lorem`, `TODO`, `[CONFIRM`, `{`, and any festival date. Expect none, except as stated.
9. "Spoken with Wispr Flow" appears exactly twice.
10. No request leaves the origin on load; storage and cookies empty.
11. Calm on and `prefers-reduced-motion`: every screen reaches its final state with no animation; all interactions still work.
12. Full-text view contains every section in the new order, including the growth act and its links, with all interactions as plain text.

### Do not

- Do not add libraries, audio, analytics, fonts from outside, or any backend.
- Do not rewrite facts, numbers, the two Flow takes, the custody note or the evidence bodies.
- Do not fill a slot with invented text. Do not print any marker for an empty slot.
- Do not claim the page was built by voice or that Flow was used before 1 November 2026.
- Do not merge to `main` or force-push.
- Do not run or rewrite `build_prompts.md`.

