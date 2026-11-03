# EK DIYA SE DOOSRA: build prompts for Emergent (master file)

Shriniwas Kholkute · Wispr Flow India growth internship · 3 November 2026
Page copy lives in `website_copy.md`. This file is how you build the page from it.

Eight agents drafted these prompts as eight "packs" (77 prompts in all). I merged them, fixed the places where packs disagreed, and added a few short "glue" prompts. None of it has been run in Emergent. Treat every prompt as a first draft that real output will correct.

---

## HOW TO USE THIS FILE (read first)

1. **Speak, don't paste.** The challenge checks that you built by voice. Each prompt has a "Say this" block. Say it aloud into Emergent with Wispr Flow, in your own words, keeping the facts. The agents wrote these as speakable briefs, but they are not your words until you say them.
2. **"Paste block" is data, not voice.** Copy, JSON and exact strings are pasted, because speaking them would make mistakes. Be honest about that: your footer line and your video must say the directions were spoken and the data was pasted.
3. **Keep Flow visibly active** on screen while you speak, so the recording shows it.
4. **After each build, look at the real result** (on your phone, with Calm on and off) and run the "Check after it builds" list. If something is off, **dictate your own correction describing what you actually see.** The "If it is off" lines are patterns, not scripts. Pack 8 (P8.17) needs one real correction from you, so do not invent one.
5. **Work in pack order**, not numeric order: **1, 2, 3, 4, 6, 7, 5, 8.** Fireworks (pack 5) layer onto a working page, so they come late. Every audit in pack 8 must run after pack 5.
6. **Run the glue prompts** (below) at the points marked.
7. **Nothing here changes your truth rules.** No growth wins, no lift, no customers, no production claims. "Spoken with Wispr Flow" only on the two 2 Nov takes. No festival date printed. Held-out numbers absent.

## BUILD ORDER

| Order | Pack | What it builds | Prompts | Est. time (from the packs) |
|---|---|---|---|---|
| 1 | Pack 1: Foundation and data | Zero-external-request project, one copy file, store, events, quality tiers, Calm, page skeleton, full-text view, meta | 7 | about 90 min |
| 2 | Pack 2: Night world | Sky, apartment skyline with windows that light up, terrace with self-drawing rangoli, marigold toran, string lights, star lanterns, dusk-gold | 7 | about 70 min |
| 3 | Pack 3: Lamps and flame | Clay diyas, living flames, press-and-hold, flame travelling lamp to lamp, "the lamps answer", lamp six | 7 | about 70 to 90 min (my estimate) |
| 4 | Pack 4: Cards and story interactions | The letter-card that rises from each lamp; 324 balcony lights; late-reply wire; swinging price tag; 820-dot rangoli; 06:15 clock | 8 | about 90 to 110 min (my estimate) |
| 5 | Pack 6: Wish studio | Desk, six card themes, PNG card, WhatsApp share, row of lamps in the link | 7 | about 80 to 100 min (my estimate) |
| 6 | Pack 7: Narrative and closure | Lamp six sketch, person block, word-level diff of your two takes, verdict note, closure, 60-second sheet, evidence drawer, footer | 8 | about 90 to 110 min (my estimate) |
| 7 | Pack 5: Fireworks and atmosphere | One shared particle canvas, sparkler under the finger, anar, rockets, petals, floating things | 8 | about 70 to 90 min (my estimate) |
| 8 | Pack 8: QA, evidence and submission | Audits, fixes, polish, video plan, submission | 25 | about 90 min of audits, plus recording |

Honest total: roughly **10 to 13 hours of build time** if everything goes smoothly. The estimates marked "my estimate" are extrapolated, not stated by the pack. That is more than you may have left, so use the fast path.

## FAST PATH (if time is short)

This is my suggestion from the prompt titles, not something tested. Do these in pack order, and cut the rest. Each pack ends with its own cut order, which wins if it disagrees.

- **Pack 1:** P1.1 to P1.6 (P1.7 hash and meta can be trimmed to the page title and favicon).
- **Pack 2:** P2.1, P2.2, P2.3, P2.5 (then P2.4 if time).
- **Pack 3:** P3.1 to P3.7 (the heart of the page; lamp six is part of your honesty).
- **Pack 4:** P4.1 to P4.3 (the card), P4.4 (324 lights). Then as many of P4.5 to P4.8 as you can.
- **Pack 6:** P6.1, P6.2, P6.5, P6.6 (desk, card, row, send). Themes, floating-card polish and edge cases come after.
- **Pack 7:** P7.3 and P7.4 (your two real takes), P7.5, P7.6, P7.7, P7.8. P7.1 and P7.2 are lighter.
- **Pack 5:** P5.1, P5.2, P5.5, P5.6 (engine, governor, cue sheet, rockets). The rest are delights.
- **Pack 8:** P8.1 to P8.3, P8.5, P8.6, P8.7, P8.14, P8.17 (your own spoken correction), P8.25.

Never cut: the plain-text twin of every interaction, Calm mode, the full-text view, the lamp-six honesty, and the audits.

---

## SHARED CONTRACT AND MY RECONCILIATIONS

The packs share these names: section ids `#night #lamps #row-breathes #lamp-6 #person #voice #verdict #wish #closure`; overlays `#sixty #evidence` and the lamp card; store fields `litCount, lamps[1..5], tone (0 to 6), calm, quality, row, wish`; events `diya:lighting, diya:lit, diya:allLit, diya:visitorLit, fx:burst, fx:setQuality, wish:ready, row:changed`; CSS tokens `--ground-0..6, --flame-core, --flame-a, --flame-b, --cream, --kumkum, --marigold, --leaf, --ink`.

The eight agents wrote in parallel and a few things clashed. These are my decisions, already patched into the packs below, or handled by a glue prompt:

- **R1. Share link format.** The final format is `#v1.<count in base 36>.<first name>` (pack 6 owns it, with reference code and tests). Pack 1 had invented `#d=…&n=…`. I patched pack 1 so it only recognises a fragment that starts with `v` and leaves it alone.
- **R2. Opening a lamp's card.** Pack 3 announces `lamp:open {n, source}`; pack 4 exposes `openLampCard(n)`. Glue prompt G1 joins them.
- **R3. Opening the evidence drawer.** Pack 4's receipt buttons call `openEvidence(caseId)` or fire `evidence:open`; pack 7 builds the drawer. Glue prompt G2 makes sure both work.
- **R4. Effect kinds.** Pack 5 defines `spark, ember, anar, rocket, chakri, petals, lantern, twinkle, phuljhadi, glow`. Packs 3 and 7 also fire `ignite, fizzle, settle`. Glue prompt G3 adds them; unknown kinds must be ignored harmlessly.
- **R5. Who sets tone.** `tone` follows `litCount` from 0 to 5; only the visitor's lamp (event `diya:visitorLit`, fired once by the closure in pack 7) sets 6. Glue prompt G4.
- **R6. The Calm control.** One control, in the bottom dock (pack 2), labelled **Roshni kam karo** with the English gloss "Calm". It is never stored. Nothing is stored anywhere, so the privacy line stays true.
- **R7. Gated lines default to OFF.** In pack 7 I changed `ledgerGate_personFirstSentence` and `lamp6LanguageLine` to `false`. Switch them on only when you decide. The recording line and the no-analytics footer line were already off.
- **R8. The visitor's lamp** has the id `visitor-lamp`, not `#lamp-6` (which is the growth-test lamp).
- **R9. Late-reply slider.** Pack 1 sets the step to 0.4 so exactly 3.0 seconds can't be chosen. Ignore pack 4's "exactly 3 seconds" line if you never need it.
- **R10. Audits run last.** Run all pack 8 audits after pack 5, and again after any fix.

### Interface labels the agents wrote that are not in your approved copy (approve or change each)

Calm / "Roshni kam karo" / "Roshni waapas laao"; Ink; Deepavali (a look name); Tilt; "Poora text padhein"; "Aasmaan ko dabaye rakhiye"; "Light lamp {k} first." and the live-region announcements; "Flip the tag"; "Hold to count the rounds"; the Lamp 5 model sentence and readouts; the caption under the 324 lights; the six card theme names; "Download card (PNG)"; and the aria labels. Each pack marks its own; add them to `copy.json` only after you approve.

---

## GLUE PROMPTS (speak these at the marked points)

### G1: after P4.1. Join the lamp to its card
**Say this:** Small wiring fix. When a lamp finishes lighting, the lamp stage announces a lamp open event with the lamp number and a source. Make the lamp card listen for that event and open the right card with the open lamp card function, so I never have to press anything twice. Also keep the open lamp card function working when called directly. Closing the card should return focus to the lamp it came from. Do not change how the lamps look.
**Check after it builds:** Light lamp one by holding, by tapping and by keyboard; its card opens each time and focus returns to the lamp on close.

### G2: after P7.7. Make every receipt open the right drawer folder
**Say this:** Another small fix. Every receipt button on the lamp cards should open the evidence drawer at the matching folder, one to five, through the open evidence function, and if that function is missing it should fire the evidence open event instead. Make sure the drawer listens for that event and the function exists. Closing the drawer returns focus to the receipt button that opened it. The drawer and sheets must not write anything to the address bar.
**Check after it builds:** From each of the five cards, the receipt opens the right folder; the address bar still shows only the share fragment, if there was one.

### G3: before P5.1. Teach the effects engine the extra kinds
**Say this:** Before the fireworks, one rule for the effects system. Besides the kinds we already planned, also accept three more cues named ignite, fizzle and settle. Ignite is a tiny bright catch of a wick, fizzle is a brief spark that dies without lighting, and settle is one soft ring of warm light, nothing more. Any unknown kind should be ignored quietly with no error. Keep one shared canvas and the same particle caps.
**Check after it builds:** Light a lamp; the ignite catch shows. Press the sixth lamp; a fizzle shows and nothing lights. The closure shows one soft ring.

### G4: after P7.6. One owner for the visitor's lamp and the tone
**Say this:** Let me fix who owns what. The tone follows the number of lit lamps, from zero to five, set by the store. Only the closure fires the visitor lit event, once, and ignores any repeat. When it fires, tone becomes six, the row count goes up by one in memory, and the address bar fragment is rewritten without reloading or adding a history entry. The wish studio only listens. Nothing is saved in storage.
**Check after it builds:** Reload with a share link ending in v1 dot 7 dot Asha, finish the page; the row grows to eight, the address updates, and a second press does nothing.

---

## HOW EACH PACK READS

Every prompt has: **Say this** (speak it), optional **Paste block** (paste it), **Check after it builds**, and **If it is off** (a pattern for your own real correction). Each pack opens with an overview and ends with its risks and cut order.

---



---

# PACK 1: FOUNDATION AND DATA

Build position: 1 of 8.

## Pack overview

- **Builds:** the frozen skeleton every other pack plugs into: a frontend-only, zero-external-request project, one copy file for every visible string, a global store with events, quality tiers and Calm mode, the night-stage page skeleton with all section ids, a linear full-text view with skip links, hash parsing, share meta and an SVG favicon.
- **Depends on:** nothing (this is first). Packs 2 to 8 depend on the names fixed here: section ids, store fields, window events, CSS tokens, copy.json paths.
- **Prompts:** seven (P1.1 to P1.7). Speak P1.1, P1.2, P1.4, P1.5, P1.6 and P1.7. P1.3 is a pasted-content step, and the page says honestly that pasted copy is not voice.
- **Estimated time:** about 90 minutes in total (setup 12, schema 12, copy load 15, store 12, skeleton 15, full text 12, hash and meta 10), plus review time.
- **Rule for every prompt:** speak the "Say this" text, add the Paste block if there is one, then run the checks before moving on. Names in the paste blocks are exact; do not let the builder rename them.

---

### P1.1: Project setup and guardrails

**Say this:**

I'm starting a personal portfolio site called Ek Diya Se Doosra. It's a night page where lamps get lit one by one. First the setup, and the guardrails matter more than any feature. This must be a frontend-only static site. No backend folder, no database, no login, no server routes, no analytics, no cookies, and no request to any other website, ever. If your template came with a backend, a database, a router, a component kit, a request library, a toast library, a made-with badge, or any tracking script in the index file, delete all of it and tell me what you removed. Use React with Vite if you can, and keep the dependencies to React and React DOM only. No animation libraries, no icon packs, no three J S. Every picture will be drawn in code with S V G, C S S and Canvas two D. Bundle the fonts into the build, Latin subset only and small, or just use system fonts. Add a strict content security policy so the page can only load its own files. Create the folder structure and the policy exactly as in the paste block. Budget: initial JavaScript under about two hundred fifty kilobytes gzipped, C S S under forty. Add a check script that builds the site and fails on any outside web address, any storage or cookie use, any forbidden word, or any over-budget bundle. The paste block lists what it must catch.

**Paste block:** (this is pasted, not voice)

```
FOLDERS (create now; later packs fill them)
index.html                 head tags are generated at build from copy.json (P1.7)
vite.config.js
package.json               scripts: dev, build, check
public/favicon.svg
reference/                 pasted source copy, used only by check-copy, never shipped
scripts/check-build.mjs
scripts/check-copy.mjs
scripts/make-og.mjs        (P1.7)
src/main.jsx  src/App.jsx
src/data/copy.json
src/lib/                   ticker.js store.js events.js quality.js calm.js hash.js tpl.js rich.jsx haptic.js announce.js favicon.js
src/styles/                tokens.css base.css themes.css print.css
src/components/            NightStage SkyLayer SkylineLayer Lamp FlameEngine ParticleCanvas LampCard GuessAudit
                           LateReplySlider TakesCompare WishStudio CardRenderer RowFragment Closure
                           EvidenceDrawer SixtyDialog CalmToggle FullTextView   (empty files for now)
src/fonts/                 optional, woff2, Latin subset, total 90 KB or less

CONTENT SECURITY POLICY (meta tag in index.html)
default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;
font-src 'self' data:; connect-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'

CHECK-BUILD MUST FAIL ON
1. Any http:// or https:// host in dist except: www.w3.org, reactjs.org, react.dev (library strings),
   and outbound links only: drive.google.com, github.com, wa.me.
2. In src: localStorage, sessionStorage, indexedDB, document.cookie, sendBeacon, XMLHttpRequest,
   fetch(, WebSocket, EventSource.  (In dist: warn only.)
3. In copy.json or dist: lorem, TODO, [CONFIRM, [FILL IN, [__], SAMPLE, Diwali (must be Deepavali),
   40.62, 0.585, 629.70, 26.5, 1.08, the words tum/tumhara/tumhe/tumne/tumse/tumhari/tumko,
   and a festival date such as 8 November or 9 November.
4. The exact phrase "Spoken with Wispr Flow" appearing anywhere except the two takes.
5. The string "devpanel" in dist (development-only panel must be stripped).
6. Budgets (gzip): entry JS plus its static imports <= 250 KB; CSS <= 40 KB; fonts <= 90 KB;
   any lazy chunk > 120 KB is a warning.
WARN ON: gift, hamper, bonus, puja, Lakshmi, Ganesh.
Print a one-screen table of sizes and every finding.
```

**Check after it builds:**
1. Open the built page on your phone. In the browser's network view, only files from the page's own address load: no other domain at all.
2. The console shows no errors and no policy-violation messages.
3. The project has no server folder, no database file and no environment file; the removal list the builder gave you is in the chat.
4. Run the check script. It prints a size table with initial JavaScript under the budget, and it exits clean.
5. View the page source: no script or badge element that you did not ask for.

**If it is off:** "When I opened [the exact file, tab or command], I saw [exactly what you saw]. The brief says [the rule from this prompt that it breaks]. Please fix that, rerun the check script, and tell me the result."

---

### P1.2: The data layer and the schema

**Say this:**

Now the data layer. Every visible word on this site must live in one file, source, data, copy dot J S O N, and no component may ever hard-code text. In the paste block is the exact structure as annotated J S O N, plus one filled worked example, the Vigil lamp. Create copy dot J S O N with exactly that structure, empty strings for everything except the worked example and the few labels already filled in. Do not invent placeholder text. Empty means the page renders nothing for it. Also build three tiny helpers. One, a template filler that replaces curly-brace tokens with values, applied to plain text only and never to markup, so a visitor's name can never inject anything. Two, a rich text reader that understands only double-asterisk bold and one Hinglish tag, and builds real elements without ever using inner H T M L. The Hinglish tag makes a span marked as language Hindi in Latin script. Three, a copy hook that components call with a path, returning nothing when the field is empty or missing. Then write a check-copy script that walks the structure, lists empty required fields, and fails on any key that is not in the schema. Keys that start with an underscore are my private notes: never render them, and strip them from the production build.

**Paste block:** (pasted, not voice. Save it in the repo as `src/data/SCHEMA.jsonc`, then build `copy.json` from it.)

```jsonc
// TOKENS (curly braces, always lowercase in data):
// {n} lamp number  {prev} n-1  {rest} 5-n  {count} link count (shown as "99+" if > 99)
// {name} sharer's first name  {t} slider seconds  {to} recipient  {from} sender  {wish} text  {link} site link
// MARKUP: **bold** and <hi>Hinglish sentence or phrase</hi> only. English stays untagged. aria strings have NO tags.
// RULE: copy characters exactly. Never fix, shorten, translate or rephrase.
{
  "version": 1,
  "_review": [],                       // private notes (CONFIRM / FILL IN items). Never rendered.

  "site": {
    "lang": "en-IN",
    "title": "", "description": "",
    "og": { "title": "", "description": "", "imageAlt": "" },
    "shareLine": "",                   // contains {link}
    "contact": { "email": null, "linkedin": null },   // from content.json site.contact; null renders nothing
    "links": { "resume": null, "essay": null },       // from content.json site.resume / site.essay
    "signoffSwitchAfter": "2026-11-09" // data only, NEVER printed
  },

  "ui": {
    "skip": "",
    "nav": [ { "id": "lamps", "label": "", "href": "#lamps" },
             { "id": "evidence", "label": "", "href": "#evidence" },
             { "id": "sixty", "label": "", "href": "#sixty" } ],
    "close": "", "holdHint": "", "holding": "",
    "progress": { "some": "", "all": "" },            // some uses {n} {rest}
    "lampOpen": "", "lampClose": "", "lightAll": "",
    "sr": { "unlit": "", "lit": "" },                 // {n} {prev}
    "calmNote": "",                                   // the "Motion off hai?" line
    "invite": { "short": "", "long": "", "sub": "" }, // INVITE ME / INVITE ME TO AN INTERVIEW / Ek email. Ek lamp...
    "startAgain": "", "badLink": "", "rowFine": "",   // rowFine = "This number is written inside the link..."
    "extra": {                                        // NOT in website_copy.md: needs Shriniwas's approval
      "_needsApproval": true,
      "calm": "Calm", "ink": "Ink", "fullText": "Poora text padhein",
      "fullTextAria": "Read the full text of this page in one linear view", "menuAria": "Menu"
    }
  },

  "opening": {
    "label": "", "sharedWithName": "", "sharedNoName": "",   // {name} {count}
    "headline": "", "ask": "", "lines": ["", ""],
    "holdLabel": "", "sixtyPrompt": "", "sixtyCta": "",
    "below": ["", ""], "altText": ""
  },

  "lamps": [                           // exactly 5, n = 1..5
    { "n": 1, "id": "certgen",
      "kicker": "", "title": "",
      "holding": null,                 // lamp-specific line, else ui.holding is used
      "lit": "",                       // line shown when lit
      "what":    { "heading": "", "gloss": null, "paras": [] },
      "next":    { "heading": "", "gloss": null, "paras": [] },   // lamp 5 heading is "Phir kya hua"
      "warning": { "heading": "", "gloss": null, "paras": [] },
      "receipt": { "label": "", "folder": "c1" },
      "interaction": "guess" }         // "guess" | "lateReply" | null
    // lamps 2..5 same shape: vigil/c2/lateReply, blitz/c3/null, tipindex/c4/null, pitdb/c5/null
  ],

  "guess": { "label": "", "question": "", "options": [0, 3, 8, 19], "answer": 19,
             "ask": "", "reveal": "", "below": "", "exact": "", "plain": "", "chip": "" },

  "lateReply": {
    "label": "", "instruction": "", "badge": "", "badgeNote": "",
    "logicLabel": "", "logics": [ { "id": "original", "label": "" }, { "id": "corrected", "label": "" } ],
    "slider": { "label": "", "min": 0, "max": 6, "step": 0.4, "start": 2, "deadline": 3,
                "deadlineLabel": "", "spokenBefore": "", "spokenAfter": "" },
    // step 0.4 is deliberate: 3.0 is never selectable, so we never invent behaviour at the exact deadline.
    // Implement with an integer index (0..15), t = index * 0.4, shown with one decimal.
    "readout": { "before": "", "afterOriginal": "", "afterCorrected": "" },   // {t}
    "plain": ""
  },

  "rowBreathes": { "lines": ["", ""], "after": "" },

  "lamp6": {
    "kicker": "", "title": "",
    "idea": { "heading": "", "paras": [], "variants": [ { "id": "A", "label": "", "text": "" },
                                                        { "id": "B", "label": "", "text": "" } ] },
    "optionalNote": { "text": "", "enabled": false },   // the "[OPTIONAL, your call]" line, off until approved
    "warning": { "heading": "", "paras": [] },
    "cta": { "label": "", "folder": "c8" },
    "tryLight": ""
  },

  "person": { "enabled": true, "kicker": "", "heading": "", "paras": [], "pull": "" },

  "voice": {
    "kicker": "", "heading": "", "sub": "", "paras": [],
    "buildLine": null,                // the gated Flow-into-Emergent line. null = render nothing.
    "compare": { "label": "", "instruction": "", "legend": "", "plainToggle": "", "altText": "" },
    "takes": [ { "id": "take1", "label": "", "when": "", "badge": "",
                 "rawLabel": "", "raw": [], "outLabel": "", "out": "" } ],   // raw = array of paragraphs
    "provenance": { "heading": "", "text": "" }, "chip": ""
  },

  "verdict": { "kicker": "", "heading": "", "paras": [], "pull": "", "ask": "",
               "resume": { "label": "", "hint": "" }, "evidenceLabel": "" },

  "wish": {
    "kicker": "", "heading": "", "lines": [], "english": "",
    "ideas": { "heading": "", "chips": [] },
    "form": { "toLabel": "", "wishLabel": "", "wishPlaceholder": "", "fromLabel": "" },
    "submit": "",
    "privacy": { "hi": "", "en": "" },
    "card": { "brand": "", "toLine": "", "wishLine": "", "fromLine": "", "footer": "", "tag": "", "altText": "" },
    "actions": { "whatsapp": { "label": "", "aria": "Send the card on WhatsApp" },
                 "copyText": { "label": "", "aria": "Copy the card text" },
                 "copyLink": { "label": "", "aria": "Copy the link" },
                 "edit": { "label": "", "aria": "Change the card" } },
    "micro": { "empty": "", "ready": "", "copied": "", "copyFailed": "", "underCard": "" }
  },

  "closure": {
    "rowCaption": { "many": "", "one": "", "zero": "" },    // {count}
    "kicker": "", "headings": ["", ""], "para": "",
    "invite": { "label": "", "sub": "" },
    "links": { "resume": "", "evidence": "" },
    "recap": "", "closing": "",
    "signoff": { "before": ["", ""], "after": ["", ""] },
    "altText": ""
  },

  "evidence": {
    "title": "", "intro": "",
    "fieldLabels": { "purpose": "", "finding": "", "mine": "", "results": "", "inspect": "", "status": "", "more": "" },
    "folders": [                       // exactly 8, id c1..c8
      { "id": "c1", "name": "", "blurb": "",
        "body": { "purpose": "", "finding": "", "mine": "", "results": "",
                  "inspect": { "label": "", "url": "", "files": [], "note": "" },
                  "status": [ ["TAG", "text"] ], "more": [],
                  "links": [ { "label": "", "key": "essay" } ],       // c7 only
                  "labels": {} } }       // per-folder label overrides, copied from content.json
    ]
  },

  "sixty": { "label": "", "hi": "", "headline": "", "paras": [], "pull": "",
             "receiptCta": "", "inviteCta": "" },

  "footer": { "lines": [ { "id": "l1", "text": "", "enabled": true } ],
              // line 4 (no analytics) enabled:true only once check-build passes.
              // line 5 (how made): { "id": "how", "buildSentence": null, "text": "" }; buildSentence = my own words, later.
  },

  "alternates": { "headlineShare": "", "closureFull": "" }   // stored, NOT wired until I decide
}
```

**Worked example** (lamps[1] and lateReply, filled from the approved copy; keep this exact style everywhere):

```jsonc
{ "n": 2, "id": "vigil",
  "kicker": "LAMP 2 · VIGIL · THE WATCHDOG THAT TRUSTED A LATE REPLY",
  "title": "Der se aaya jawab",
  "holding": "<hi>Lau aage badh rahi hai…</hi>",
  "lit": "<hi>Lamp 2 jal utha. Ek diya jala. Ab agla.</hi>",
  "what": { "heading": "What happened", "gloss": null, "paras": [
    "Vigil checked whether a data connection was alive, <hi>jaise phone par poochhna: \"Hello? Aap wahin hain?\"</hi>",
    "Despite green tests, a reply arriving **after the deadline** could count as proof of health. <hi>Der se aaya jawab bhi \"haan, zinda hoon\" maan liya ja sakta tha.</hi>" ] },
  "next": { "heading": "<hi>Maine phir kya kiya</hi>", "gloss": "what I did next", "paras": [
    "<hi>Maine ek sawaal uthaya: kya yeh tests system ka asli vaada sach mein check karte hain?</hi>",
    "I questioned whether the tests proved the system's real promise. An AI-assisted review found the defect and implemented an approval-gated correction.",
    "When a verifier removed the correction, **two targeted tests failed**. Restored, the suite passed **105 tests**.",
    "The question became: **does it deliver what someone depends on?**" ] },
  "warning": { "heading": "Fair warning", "gloss": null, "paras": [
    "<hi>Yeh sab simulated connections par hua tha.</hi> The 105 tests were verified locally in an agent session, not in CI, and there was no production deployment." ] },
  "receipt": { "label": "OPEN THE VIGIL RECEIPT", "folder": "c2" },
  "interaction": "lateReply" }
```

**How to read the example:** a bracket in capitals in the source copy is a button label; an arrow inside a bracket is a note for the builder, not text; italic parentheses after a heading are the `gloss`.

**Check after it builds:**
1. `copy.json` exists with the full structure; open it and see real text only in the Vigil lamp and the few filled labels, empty strings elsewhere.
2. Temporarily render the Vigil lamp on the page: bold words are bold, Hinglish sentences are spans (inspect one: language is Hindi in Latin script), and nothing is injected as raw H T M L.
3. Put the name `<b>Asha</b>` into a test token: it shows as visible text, not bold.
4. Run the check-copy script: it lists the empty required fields and fails if you add a made-up key.
5. A key starting with an underscore does not appear on the page or in the built bundle.

**If it is off:** "In [the path], I expected [what the schema says], but I got [exactly what you saw]. Please match the schema exactly, do not add or rename keys, and rerun check-copy."

---

### P1.3: Load the full copy (pasted content, not voice)

**Say this:**

I'm going to paste the full approved website copy into copy dot J S O N, in three parts. Please wait for part three before you build. This is pasted text, not something I spoke, and that's fine, because it's data. The rules are strict. Copy every character exactly. Do not rewrite, shorten, translate, correct spelling, change quotes, or smooth out my Hinglish. Fill the structure from the schema, wrapping each full Hinglish sentence or phrase in the Hinglish tag and leaving English untagged. A capital-letter bracket is a button label. An arrow inside a bracket is a note for you, not text. Any note in brackets that says confirm or fill in must not go on the page; put it in the private review list and read that list back to me. The Evidence bodies come from the second paste, copied verbatim. Leave the contact email as pasted. Footer line five stays empty for now. Save both pasted sources in the reference folder, and extend check-copy so every string in copy dot J S O N must appear word for word in a reference file after markup and tokens are removed. It should report every string that does not match instead of silently passing. Only the two takes may carry the words Spoken with Wispr Flow.

**Paste block:** (pasted, not voice. If the message box refuses the size, attach the files instead or send three messages labelled part one, two, three.)

```
PART 1 of 3: website_copy.md from "## 0. PAGE META AND SHARE PREVIEW" through the end of "## 8. LAMP 6"
PART 2 of 3: website_copy.md from "## 9. IS FILE KE PEECHE KA INSAAN" through the end of "## 13. CLOSURE"
PART 3 of 3: website_copy.md from "## 14. EVIDENCE DRAWER" through "## ALTERNATES"  (STOP before "## BUILD NOTES"; do not paste the build notes)
            plus, from content.json: site.contact, site.resume, site.essay, and the whole evidence.cases array (all 8 folders)

Save as: reference/website_copy.md  and  reference/content_excerpt.json
Mapping notes for the builder:
- "Phir kya hua" (Lamp 5) stays as written. Do not switch it to "Maine phir kya kiya".
- Section 9 (person) is enabled: true; add a _review note that its CONFIRM items are open.
- Footer line 4 is enabled: true; add a _review note: verify with check-build before publishing.
- The line gated by "[ONLY IF A REAL RECORDING EXISTS...]" goes to _review, voice.buildLine stays null.
- "[OPTIONAL, your call]" in Lamp 6: text goes to lamp6.optionalNote.text with enabled false.
- ALTERNATES go to alternates.*, not wired.
- Evidence folder names use the colon form from the copy ("CERTGEN: The green wall"); each folder body is the content.json object minus id and name.
- Two-paragraph takes: raw is an array of paragraphs (blank-line separated); out is one string.
```

**Check after it builds:**
1. Run check-copy: zero unknown keys, zero empty required fields, five lamps, two takes, eight folders, and a short list of non-matching strings (read each one yourself; the builder must not have rewritten any).
2. Spot-check three lines against the source on your phone: the main headline "324 tests passed. Then an audit found 19 problems.", the PitDB warning, and the sign-off.
3. The page contains no square-bracket note, no CONFIRM, no FILL IN, and none of the held-out numbers.
4. Search the bundle: the phrase "Spoken with Wispr Flow" appears exactly twice, once per take.
5. The private review list was read back to you in chat, and it is not in the production build.

**If it is off:** "The line in [section and position] reads [what it says now] but my source reads [what the source says]. Restore the source wording exactly and tell me how many strings you changed."

---

### P1.4: Store, events, quality tiers and Calm

**Say this:**

Next, the brain of the page. One small global store, no state library, plus events, quality tiers and Calm mode. Use the exact names in the paste block. Only the store changes state, through named actions. Lamps go unlit, lighting, lit. A lamp may only start lighting if the one before it is lit, except through a light-all action. Tone is the number of lit lamps from zero to five, and six once the visitor's own lamp is lit. The wish lives in memory only: never in the address, never in storage, never in any log, and it clears on start again. Every change fires a window event with the payloads in the paste block. Add one shared animation ticker that stops completely when the tab is hidden. Add quality tiering: choose a starting tier from cores, device memory and the data-saver flag, sample about ninety frames, step down if frames are slow, and keep watching while anything animates. Calm is on if the phone asks for reduced motion or if the visitor taps the Calm switch; the switch lives in memory only. When Calm is on there are no particles, no flicker, lamps light instantly, and tone changes instantly. Add a tiny haptic helper that only buzzes on Android, only for user-driven drags, and never in Calm. Finally, a developer panel that exists only in development builds, to set tone, lamps, quality and Calm.

**Paste block:** (pasted, not voice)

```
STORE (single object, get/subscribe, actions only)
litCount   0..5 (derived from lamps)
lamps      { 1..5: "unlit" | "lighting" | "lit" }
tone       0..6  = visitorLit ? 6 : litCount        (0 darkest, 5 dusk-gold, 6 visitor's lamp lit)
calm       boolean = reducedMotion OR calmManual
quality    "high" | "mid" | "low"
row        { count, name }      + status: "none" | "shared" | "bad"    (parsed in P1.7)
wish       { to, text, from }   private slot, memory only, excluded from every snapshot, log and URL
Extras (additive, not in the original contract): visitorLit boolean, ink boolean, reducedMotion, calmManual.

ACTIONS
startLighting(n)   -> false if lamps[n-1] is not "lit" (n=1 is always allowed); else lamps[n]="lighting"
setProgress(n, p)  -> p 0..1 while lighting
finishLighting(n, x, y)  -> lamps[n]="lit"; litCount++; tone updates
lightAll()         -> all five lit in order, one diya:lit each, then diya:allLit
lightVisitor(x, y) -> only when litCount is 5; visitorLit=true; tone 6
setCalm(bool) setInk(bool) setQuality(tier) setRow(row) setWish(w) clearWish() reset()
announce(text)     -> writes to the single polite live region

EVENTS (window CustomEvent; the store is the only emitter of diya:*; detail payload)
diya:lighting  { n, progress }       diya:lit  { n, x, y }       diya:allLit  {}
diya:visitorLit {}                    fx:burst  { kind, x, y }    fx:setQuality { tier }
wish:ready {}                         row:changed { count, name }
helpers: on(name, fn) returns an unsubscribe function; emit(name, detail)

ROOT ATTRIBUTES kept in sync by the store: data-tone, data-calm ("1"/"0"), data-quality, data-ink

QUALITY TIERS
Start hint: saveData -> low; deviceMemory <= 2 or cores <= 2 -> low; deviceMemory <= 4 or cores <= 4 -> mid; else high.
(deviceMemory is missing on Safari and Firefox: ignore it, never assume.)
Sampler: after first paint, drop the first 10 frames, measure the next 90 (cap each frame at 100 ms).
  p90 > 24 ms -> one tier down;   p90 > 40 ms -> low.
Watchdog: while the ticker runs, every 120 frames, if the average > 22 ms twice in a row -> one tier down, 3 s cooldown.
Never move up automatically. Emit fx:setQuality on every change.
Particle caps for later packs: high 400, mid 180, low 60, Calm 0. Device pixel ratio cap: high 2, mid 1.5, low 1.

CALM: matchMedia reduced-motion listener updates live. Show ui.calmNote whenever calm is on.

DEV PANEL: hash #devpanel in development builds only: tone 0..6, light lamp n, quality, Calm. Stripped from production.
```

**Check after it builds:**
1. Open the developer panel on your phone: set tone from zero to six and watch the page background and the data attributes change; with Calm on they change instantly.
2. Try to light lamp 3 first: it refuses. Tap light-all: five lit events arrive in order, then the all-lit event.
3. Switch the browser to another tab for ten seconds and come back: the frame counter shows no frames were drawn while hidden.
4. Force the quality to low from the panel: the tier label changes and a quality event is logged once.
5. Type a wish in the store from the panel, reload: it is gone. Nothing named wish appears in the address bar.

**If it is off:** "I did [exact steps]. I expected [what the contract in the paste block says]. I got [exactly what you saw]. Fix only that, keep every name unchanged, and rerun the check script."

---

### P1.5: The night stage and page skeleton

**Say this:**

Now the page skeleton. This is not a long document. It's one fixed night stage with the story passing over it. Build the stage as fixed layers behind everything: a sky layer, a skyline layer, and one empty canvas for effects, all hidden from assistive technology. Their look is driven only by data attributes on the root element, which follow tone, quality, Calm and theme, so nothing re-renders. Define the colour tokens in the paste block. The background should ease between the seven ground colours over about a second, and change instantly in Calm. Then build the main area with the sections in the paste block order, with those exact ids. For now each section renders its heading and copy from the data, plus an empty named slot where later packs plug in. Add a plain Ink theme that swaps in neutral tokens and switches off every decorative layer. Scrolling: gentle proximity snapping on only the single-screen sections, never mandatory, off while any dialog is open, and the page never moves the reader's scroll on its own. Focus: headings are focus targets, a lit lamp never steals focus, and closing any dialog returns focus to what opened it. Make the focus ring a soft flame glow. Add three native dialog shells: sixty, evidence, and a lamp card sheet. The page must work at three hundred sixty pixels wide with no sideways scrolling.

**Paste block:** (pasted, not voice)

```
TOKENS (src/styles/tokens.css)
--ground-0 #0A0705  --ground-1 #110B07  --ground-2 #19100A  --ground-3 #251609
--ground-4 #35200C  --ground-5 #4A2F10  --ground-6 #5C3A14
--flame-core #FFD27A  --flame-a #FFB347  --flame-b #FF7A1A
--cream #FFF3DC  --text-dim #E3CFAE  --kumkum #C2410C  --marigold #F5A623  --leaf #2F6B4F  --ink #16110C
--font-display: bundled display face with Georgia fallback; --font-body: system-ui stack; --font-mono: ui-monospace stack
--tone-ms 900ms (0ms when data-calm="1")   --tap 44px   --gutter 16px
Ink theme (data-ink="1"): ground-0..6 neutral #0B0B0C #111112 #171718 #1E1E1F #262627 #2F2F30 #38383A;
  marigold, kumkum, leaf remapped to cream; decorative layers (rangoli, torans, petals, fireworks) hidden.
Contrast: cream on every ground token must be at least 7:1; text-dim at least 4.5:1.

DOM ORDER
a.skip-link ("Skip to main content")
header#topbar                         (P1.6)
div#stage[aria-hidden]  > #sky, #skyline, canvas#fx
main#main[tabindex=-1]
  section#night        h1 from opening.headline; slots: hold-button, sixty-link
  section#lamps        aria-label from ui.nav lamps; slots: lamp-row, lamp-panels
  section#row-breathes
  section#lamp-6
  section#person       (rendered only if person.enabled)
  section#voice        slot: compare
  section#verdict
  section#wish         slot: wish-studio
  section#closure      slot: row, visitor-lamp
footer#footer
div#dock                              slot for the docked lamp row (pack 3)
dialog#sixty    dialog#evidence    dialog#lamp-sheet
div#fulltext[hidden]                  (P1.6)
div#announcer[role=status][aria-live=polite]

Z-ORDER: sky -3, skyline -2, canvas -1 (pointer-events none), content 1, dock 4, topbar 5, dialogs in the top layer.
SNAP: html scroll-snap-type y proximity; snap-align start only on #night, #row-breathes, #lamp-6, #closure;
      scroll-padding-top = topbar height; smooth scrolling only when data-calm="0".
FOCUS: every section heading gets id "<section>-h" and tabindex -1; routes move focus to the heading;
       lamp lit never moves focus; dialogs focus their title and restore focus to the opener; Escape closes.
h1 exists exactly once. No heading levels skipped.
```

**Check after it builds:**
1. At three hundred sixty pixels wide there is no sideways scroll, and every section id exists in order; tap the three nav items once they exist, or jump by address ending in each id.
2. Use the developer panel to move tone from zero to six: the whole background deepens to dusk-gold and the browser status bar colour follows; in Calm it jumps instantly.
3. Tab through the page: every stop shows the flame-glow ring and nothing is hidden behind the top bar.
4. Open each of the three dialogs by address or by the panel: focus lands on the title, Escape closes, and focus returns to where you were.
5. Switch to Ink: colours turn neutral and the decorative layers vanish, but all text stays readable.

**If it is off:** "On my phone at [width] I see [exactly what you see] in [section id]. The brief says [the rule]. Fix only that section and keep the ids unchanged."

---

### P1.6: Top bar, skip links and the full-text view

**Say this:**

Now the access layer. Build the top bar, small and thumb-friendly at three hundred sixty pixels: the wordmark on the left, then a Calm switch that is always visible and a menu button. The menu holds the three nav links, the Ink switch, the full-text link labelled Poora text padhein, and the interview invite only if contact is filled in. The first thing a keyboard user reaches is the skip link. Then build the full-text view. It is one linear page, built from the same copy data, with no canvas, no animation and no sticky parts: one top heading, a heading for each part of the story, every lamp's full story, each interaction's always-visible plain text, then the person, both voice takes with what I said and what Flow wrote, the verdict, the wish step with its real form in plain mode, the closure, the evidence folders and the sixty-second file. Nothing in it may require lighting a lamp. It opens from the menu or the address ending in text, hides the stage, and closes back to where the reader was. Also add a print style that prints this text in ink on white paper, hiding the stage. Use real paragraphs, lists and links, no layout tricks, and mark Hinglish spans so screen readers switch voice.

**Paste block:** (pasted, not voice)

```
FULL-TEXT ORDER (all strings from copy.json; no hard-coded text)
h1  site.title  (+ opening.label as eyebrow)
opening: headline, ask, lines, below paragraphs, sixtyPrompt + link to #sixty
for each lamp 1..5: h2 kicker+title; what; (lamp 1: guess.question, options as a list, guess.plain, guess.chip, guess.reveal;
  lamp 2: lateReply.badge, badgeNote, logics as list, slider.deadlineLabel, lateReply.plain, all three readouts);
  next; warning; receipt link -> #evidence/<folder>
rowBreathes lines + after
lamp6: kicker, title, idea paras, variants A and B, warning, tryLight, link to #evidence/c8
person (if enabled), voice (both takes: raw paragraphs then out, labelled), provenance, chip
verdict, resume link (hint says it opens Google Drive)
wish: lines, english, ideas chips as a list, the real labelled form in plain mode (mount point #fulltext-wish for pack 6), privacy hi + en
closure: rowCaption for row.count, headings, para, invite (only if contact set), recap, closing, signoff (before/after the switch date)
evidence: title, intro, all 8 folders with field labels
sixty: whole file
footer lines (enabled only)
SKIP LINKS: first tab stop "Skip to main content" (-> #main). Inside full-text: a skip link back to "Close".
PRINT: @media print shows only #fulltext, black on white, links followed by their address, no stage, no dock.
```

**Check after it builds:**
1. Press Tab once on a fresh load: the first thing focused is the skip link and it is visible; Enter jumps into the main content.
2. Open Poora text padhein: the stage disappears and the text reads straight down. With a screen reader, headings list all parts; no section requires lighting a lamp.
3. Every interaction has its plain text visible: the guess line says 324 of 324 tests passed and 19 findings, two high; the late reply paragraph is complete.
4. In Calm and in Ink the top bar still fits at three hundred sixty pixels, every control at least forty-four pixels tall.
5. Print preview shows black text on white and no night art.

**If it is off:** "In the full-text view, [the exact part] is missing or out of order. The copy file has it at [path]. Please render it from the data, in the order listed, and nothing else."

---

### P1.7: Hash handling, share preview and the SVG favicon

**Say this:**

Last piece of the foundation: the address bar, the share preview and the favicon. First, a hash module that only parses and sanitises. Mechanics belong to a later pack. It reads the fragment once at load and again if it changes. A bare route like sixty opens that dialog, evidence opens the drawer, evidence slash c3 opens folder three, text opens the full-text view. A fragment that starts with the letter v is a share fragment. Do not parse it here: just recognise it, leave it exactly as it is, and hand the raw text to the wish studio pack, which owns the exact format and the strict checks. Never rewrite or clear a share fragment when overlays open, and never use storage. Now the head tags, generated at build time from copy dot J S O N, because link previews don't run scripts. Include title, description, Open Graph, Twitter large card, theme colour and dark colour scheme. Make the share image a P N G at build time, from an S V G drawn in code, with a script. Draw the favicon as an S V G: a clay diya with a flame. Then add two small delights: the favicon gains a lit dot for each lamp lit, and the browser's theme colour follows tone.

**Paste block:** (pasted, not voice)

```
HASH GRAMMAR (src/lib/hash.js; pure functions, unit-testable, no DOM writes)
#sixty            -> {route:"sixty"}
#evidence         -> {route:"evidence"}      #evidence/c1 .. #evidence/c8 -> {route:"evidence", folder}
#text             -> {route:"text"}
#night #lamps #row-breathes #lamp-6 #person #voice #verdict #wish #closure -> {route:"scroll", id}
#v1.<count in base 36>[.<name>]   share fragment: only RECOGNISED here (starts with v); pack 6 parses and sanitises it. Do not touch it.
Anything else -> ignored silently (no error).
Fragment longer than 240 characters -> ignored here (pack 6 shows the bad-link line). No other fragment rules live in this module.

SHARE FRAGMENTS
This module exposes isShareFragment(hash) = /^#v/i and never edits such a fragment. Pack 6 owns parsing, sanitising and the bad-link line.
store.row starts as {count:0, name:"", status:"none"}; pack 6 fills it. Names are never put into the title, an attribute or HTML: textContent only.
Opening or closing overlays never writes to the address bar, so the share fragment stays intact. Overlays use in-memory state plus the plain routes (#sixty, #evidence) only when opened directly.


Close on a directly-opened overlay -> focus the h1. Back button closes an open overlay.

TEST CASES (add as a small test file)
#v1.7.Asha            -> share fragment, left untouched
#v1                   -> share fragment, left untouched (pack 6 decides if it is bad)
#sixty                -> {route:"sixty"}
#text                 -> {route:"text"}
#evidence/c3          -> {route:"evidence", folder:"c3"}
#evidence/c9          -> {route:"evidence"} (folder ignored)
#hello                -> ignored
#wish                 -> {route:"scroll", id:"wish"}; any share fragment already in the address bar is preserved


HEAD (generated at build from copy.json, in a Vite HTML transform)
<html lang="en-IN">, charset, viewport (width=device-width, initial-scale=1, viewport-fit=cover)
title = site.title;  meta description = site.description
og:type website; og:title / og:description from site.og; og:image + og:image:alt (site.og.imageAlt), 1200x630
twitter:card summary_large_image; twitter:title / description / image / image:alt
og:image and og:url need ABSOLUTE urls: read SITE_URL from the build environment; if unset, omit og:image and og:url and warn.
meta theme-color = --ground-0; meta color-scheme = dark
Favicon: public/favicon.svg, link rel=icon type image/svg+xml.

SHARE IMAGE (scripts/make-og.mjs, build time only, dev dependency allowed, nothing shipped to the page)
Draw an SVG in code: ground-0 background, one small LIT clay diya on the left (flame-core to flame-b),
five unlit diyas in a row to its right, the line "324 tests passed. 19 problems found." in cream,
small "EK DIYA SE DOOSRA · Shriniwas Kholkute" in marigold. Render to dist/og.png using the bundled font file.
Keep the PNG under 300 KB. If rendering fails, fall back to a hand-made PNG I will supply. Never use a remote renderer.

FAVICON (src/lib/favicon.js, returns a data: URL, so no network request)
64x64 SVG: rounded square in --ink, clay diya bowl in marigold with a cream wick, flame in flame-core/flame-a.
Below it a row of five tiny dots; dots 1..litCount are filled flame-a, the rest outlined. Swap the link href on diya:lit.
THEME COLOR: on every tone change set meta theme-color to that tone's ground token.
TITLE: when litCount >= 1 prefix the tab title with "(n/5) ". No other new words.
```

**Check after it builds:**
1. Open the address with `#v1.7.Asha` on your phone, then open the sixty-second file and close it: the address bar still shows the same share fragment.
2. Open `#sixty` directly: the dialog opens; closing it puts focus on the main heading. Open `#hello`: nothing happens and no error appears.
3. In the page source, the title, description and share tags are already present (no script needed), and the preview image address is absolute.
4. The tab icon is a small lamp with a flame; light a lamp from the developer panel and one dot fills; the Android address bar colour warms with tone.
5. Paste the address into WhatsApp (to yourself): the preview shows the dark image with the lit lamp and the headline.

**If it is off:** "With the address [exact address] I expected [the row in the test cases] but I got [exactly what you saw]. Fix the parser only, keep the other cases passing, and show me the test results."

---

## Risks and cut order

**Main risks**
1. Emergent's default template is a full-stack app (backend, database, kit components, possible badge or tracking script). If P1.1 is only half obeyed, the footer claim "no analytics, cookies or third-party script" becomes false. Always open the network view yourself; the check script plus the content security policy is the safety net.
2. The builder may quietly "improve" pasted copy. The reference-file match in check-copy is the only real defence: read the list of non-matching strings every time.
3. The strict content security policy can break the Emergent preview or any platform-injected script. That is the policy doing its job; if only the preview is affected, relax it in development and keep it in production.
4. Footer line five (how the page was made) and the "voice-built" line stay empty until you dictate them honestly in Pack 8; forgetting leaves the footer incomplete (check-build warns).
5. `ui.extra` (Calm, Ink, Poora text padhein, aria text) and the 0.4 slider step are not in website_copy.md; they need your approval. The "hold" interaction needs a decision from you on what happens at exactly three seconds; the 0.4 step simply avoids it.

**Contract additions (non-breaking):** `row.status`; store extras `visitorLit`, `ink`, `reducedMotion`, `calmManual`; routes `#text`, `#evidence/c1..c8`; root attribute `data-ink`; `#devpanel` in development only.

**Cut order if time runs short (cut from the top):**
1. Pre-rendered full text inside the HTML for no-script readers (a stretch, not specified above).
2. Print style.
3. Favicon dots and theme-colour following tone (keep the static favicon).
4. Generated share image (fall back to a hand-made PNG from you).
5. Developer panel (only if the other packs can set tone another way).
6. Tab-title prefix.

**Never cut:** zero external requests and the content security policy, the single copy file, the Calm switch, the full-text view, the hash sanitiser, and the persistent skip link.


---

# PACK 2: THE NIGHT WORLD

Build position: 2 of 8.

## Pack overview

1. Builds the whole visual world in code only: design system and light model, sky, apartment skyline with windows that light up, and a terrace foreground with a self-drawing rangoli, a marigold toran, a swaying string of lights and star lanterns.
2. Also builds the dusk-gold transition, the Ink theme, the Calm version and the layout rules for 360px, 390px and desktop.
3. Depends on Pack 1 (store, events, tokens file, quality tier detector, Calm state). Pack 3 supplies the lamps; this pack only listens to `diya:lighting`, `diya:lit`, `diya:allLit`, `diya:visitorLit` and the store's `tone`.
4. Estimated time: P2.1 8 min, P2.2 8 min, P2.3 12 min, P2.4 14 min, P2.5 8 min, P2.6 8 min, P2.7 8 min. About 65 to 70 minutes including fixes.
5. Honesty note: the Paste blocks (numbers, geometry, colour tables) are pasted text, not voice. Say the Say-this part aloud, then paste the block right after it, in the same message.

Only new UI strings in this pack: "Calm", "Ink", "Deepavali" (the look switch) and "Tilt". Put them in the copy file. They are not Hinglish and make no claims.

---

### P2.1: Art direction, type, light model and tone system

**Say this:**
This is the look and feel foundation for Ek Diya Se Doosra, a night Deepavali page. Build it as a small design system before any scenery. First colours. Use the CSS tokens ground zero to ground six, flame core, flame a, flame b, cream, kumkum, marigold, leaf and ink, with the values in the paste block. Gold is for light. Kumkum and leaf are fills only, never text on dark, because they fail contrast. Second, type. Display is a warm serif from the system fonts, with italics for the Hinglish hooks. Body is the clean system sans. Mono is only for tiny kickers. No downloaded fonts, no web fonts at all. Body text is seventeen pixels on phones. Third, spacing on a four pixel scale, with a sixteen pixel gutter at three sixty. Fourth, the light model. Light is additive and warm, made of soft radial gradients, never hard shadows. Build three shared pieces. A warm light overlay that sits near the most recently lit lamp, a vignette that eases as the tone rises, and a text glow that grows with tone. Cards get a faint warm radial from the side of the last lit lamp. Fifth, the tone system. Tone goes zero to six, and each step lifts the ground, the sky and the number of lit windows, exactly as in the table I am pasting. Every layer reads one tone variable. Panels over the scene stay almost opaque so text keeps AA contrast. Add a tiny developer tone scrubber that only appears when the address query says tonelab.

**Paste block:**
```
TOKENS (keep Pack 1 values if already set)
--ground-0 #0A0B14  --ground-1 #0F1020  --ground-2 #1A1426  --ground-3 #2A1B2A
--ground-4 #3A2226  --ground-5 #46291A  --ground-6 #583520
--flame-core #FFD27A --flame-a #FFB347 --flame-b #FF7A1A
--cream #FFF3DC  --cream-dim #D9C8AA  --kumkum #C2410C  --marigold #F5A623
--leaf #2F6B4F   --ink #16110C
Text rules: body = cream or cream-dim. Kumkum and leaf: fills, borders, never text on ground.
FONTS
--font-display: "Iowan Old Style","Palatino Linotype",Palatino,"Noto Serif",Georgia,serif
--font-body: system-ui,"Segoe UI",Roboto,"Noto Sans","Helvetica Neue",Arial,sans-serif
--font-mono: ui-monospace,"SF Mono","Roboto Mono",Menlo,Consolas,monospace
Scale: h1 clamp(1.9rem, 8.2vw, 4.25rem) line 1.08; h2 clamp(1.5rem,6vw,2.5rem);
body 17px/1.55 phone, 18px desktop; kicker mono 12px, caps, 0.12em tracking.
Numbers (324, 19) in flame-core, tabular figures. Max text width 62ch.
SPACING 4,8,12,16,24,32,48,72,112. Gutter 16 at 360, 20 at 390, 32 at 768+.
TONE TABLE (tone: sky top / sky mid / horizon / stars / lit windows of 64 / vignette)
0: #05060D #0B0D1F #17122A / 100% / 5  / 0.55
1: #060814 #0E1024 #22142B / 100% / 14 / 0.52
2: #080A18 #141229 #2E1830 / 95%  / 23 / 0.48
3: #0B0B1C #1B1430 #3D1D2F / 90%  / 32 / 0.44
4: #120D1F #2B1A33 #5A2A2C / 80%  / 41 / 0.40
5 dusk-gold: #1C1226 #5A2D3A #D98A3D / 40% / 56 / 0.26
6 visitor lit: #22152B #6B3440 #F2A94E / 30% / 64 / 0.22
Sky is three stacked gradient layers (night, ember, gold) cross-faded by opacity only.
Reading veil: when a section after #lamps is on screen, dim the scene by 25 percent.
No localStorage or sessionStorage anywhere in this pack.
```

**Check after it builds:**
1. On a phone the page is dark, warm and readable; headline is a serif, body is a clean sans.
2. Drag the tone scrubber from zero to six: sky, ground and vignette change smoothly, no flashes.
3. Kumkum and leaf appear only as fills or borders, never as text.
4. With Calm on, the tone still changes but with no animation, just the final state.
5. Kill the network in developer tools: nothing breaks, no font request fails.

**If it is off:**
"The [layer, for example vignette] looks [what you actually see]. Keep everything else, and change only that layer so that [what you want, in plain words]."

---

### P2.2: SkyLayer, stars, a hairline moon, drifting wisps

**Say this:**
Now the sky, as one component called SkyLayer, drawn in code only. It is a fixed full-screen layer behind everything. Three stacked gradients, night, ember and gold, cross-fade by opacity as tone goes from zero to six, using the table from before. Add a scatter of stars. Most stars are static and drawn as one single path, only about fourteen of them twinkle, and they twinkle with opacity only. Stars thin out near the horizon and fade as tone approaches five. Add a moon, but very thin: Deepavali falls on a dark night, so draw only a hairline sliver of crescent in the upper right, with a soft halo. Never a fat crescent. Add three slow cloud wisps made of wide soft ellipses, drifting across over about two minutes, cool grey-blue at low tone and with a warm gold rim as tone rises. No blur filters, use radial gradients. Once, the first time lamp three is lit, let one faint shooting star cross the upper sky in under a second. Silent, and only once. Stars, moon and clouds respond to the quality tier from the store. High has everything. Mid halves the stars and drops one cloud. Low has forty static stars and no clouds. Calm freezes everything at its current state.

**Paste block:**
```
Seeded random, seed 2026, so the sky looks the same every visit.
Stars: high 120, mid 70, low 40. Sizes 0.6 to 1.6 px, three tints: cream, flame-core at 60%, a cool white.
Distribution: top 55% of height dense, linear falloff to zero at the horizon line.
Twinkle: 14 circles, opacity 0.35 to 1, 2.5 to 6 s, random delays. Others static in one path.
Moon: top 12%, right 18%. Disc r 20 in cream at 0.9, masked by an offset circle (dx +17, dy -2, r 19)
so only a hairline sliver remains. Halo: radial gradient r 90, cream at 0.07 to 0.
Clouds: 3 wisps, each an ellipse about 70vw by 14vh with 3 stacked radial gradients,
opacity 0.08 to 0.14, drift left to right 90, 120 and 140 s, linear, loop with offscreen reset.
Warm rim = a second copy of each ellipse in marigold at 0.12, opacity = (tone - 3) / 3 clamped.
Shooting star: a 2px by 60px gradient line, 45 degrees, travels 220px in 800 ms, once, on diya:lit with n=3.
Parallax factor for sky 0.05.
```

**Check after it builds:**
1. At tone zero the sky is deep blue-black with a visible star field and a barely-there moon sliver.
2. Wisps drift slowly and never cross the headline in a way that hurts reading.
3. Use the tone scrubber: stars fade, horizon turns gold at five and six.
4. Switch quality to low: clouds vanish, stars become still, nothing else breaks.
5. Calm on: stars still visible, nothing moves or twinkles.

**If it is off:**
"The [moon or stars or clouds] look [what you see]. Keep the sky gradients as they are and change only that part so that [target]."

---

### P2.3: SkylineLayer, apartment blocks, rooftops and windows that are homes

**Say this:**
Next, SkylineLayer: an Indian apartment-block and terrace skyline in three layered SVGs, far, mid and near, drawn in code with no images. Flat-roofed concrete blocks of different heights. On the rooftops give it authenticity: black round water tanks, TV antennas, a satellite dish, a stair-head room, a clothesline with something drying, and solar heater panels. Near buildings have balconies with railings and small outdoor units. Now the heart of it: every window is a home. There are sixty-four windows in total and the number that are lit depends on the tone, as in the paste block. Each time a lamp is lit, the next nine windows glow warm, starting with the windows nearest to that lamp's horizontal position, and they come on one by one, a few moments apart, with a tiny soft halo. Mostly warm gold, a few cool tube-light white, and two or three with a cold television blue that flickers. In one near window a ceiling fan turns slowly. Add parallax: on desktop the layers shift a few pixels with the pointer. On phones, offer a small Tilt switch that uses device orientation only if the person turns it on. Never ask for permission on load. Off in Calm and on low quality.

**Paste block:**
```
viewBox 1200 x 500, preserveAspectRatio xMidYMax slice, anchored to the bottom of the stage.
FAR layer: 13 blocks, heights 150 to 270, fill = ground-1 lightened 6 percent. 16 tiny windows (3 x 4 px).
MID layer: 8 blocks, heights 190 to 330, fill = ground-2. 24 windows (6 x 8 px).
  Rooftop kit: 3 water tanks (cylinder 26 x 32, lid dome, 3 legs), 4 antennas (mast plus 3 crossbars),
  1 dish (ellipse 14 x 10 on a bracket), 2 stair-head boxes, 1 clothesline 70 px with 3 hanging shapes.
NEAR layer: 4 blocks, heights 260 to 420, fill = ground-3. 24 windows (10 x 13 px).
  Balcony rails: horizontal line plus short verticals every 6 px, stroke 1.2 in ground-4.
  1 outdoor unit box (14 x 10) per balcony on two blocks. One solar heater: tilted panel plus small tank.
Windows: lit = filled rect plus a halo rect 3 px larger at 0.18 opacity. No filters, no blur.
Lit counts by tone: 5, 14, 23, 32, 41, 56, 64. The first 5 are fixed ("already home"), spread across all layers.
Colour mix of lit windows: 70% flame-core, 20% flame-a, 6% cream, 4% TV blue #8FB4E8 flickering opacity 0.5 to 0.9, irregular.
Ordering: pre-shuffle with seed 2026, then for lamp n sort the next group by distance to that lamp's x.
Switch-on: opacity 0 to 1 in 600 ms, stagger 90 ms. Calm: instant, no stagger.
Fan window: near layer, three thin ellipse blades rotating one turn per 4 s. Visible from tone 2.
Parallax: factors far 0.2, mid 0.5, near 1.0. Max shift 10 px. Smooth with lerp 0.08, stop the loop when settled.
Tilt chip: shows only on coarse pointers with device orientation support. On iOS ask permission on tap only.
Tilt maps plus or minus 12 degrees to plus or minus 6 px. If permission is refused, hide the chip, no nagging.
```

**Check after it builds:**
1. At 360px you see a layered skyline with tanks and antennas, and about five windows already glowing.
2. Use the tone scrubber: windows light a few at a time, nearest the lit lamp's side first.
3. A flickering blue window and a slowly turning fan are found within ten seconds of looking.
4. Tilt chip is off by default and nothing moves until it is tapped; on desktop the pointer shifts the layers slightly.
5. Calm on: all windows reach the correct count instantly, no flicker, no fan spin, no parallax.

**If it is off:**
"Windows are [too many or too few, or the wrong size] at tone [number]. Keep the buildings. Change only the lit-window count or order so that [target]."

---

### P2.4: The terrace foreground, self-drawing rangoli, toran, string lights and star lanterns

**Say this:**
Now the near foreground, which makes it feel like standing on a terrace. At the bottom, a low parapet wall with a pale coping edge and three square pillar caps. In front of it, the terrace floor with a rangoli, drawn as clean line art, squashed vertically to read as a floor. The rangoli has five symmetrical layers and each layer draws itself stroke by stroke, one layer per lamp. While a lamp is being held, its layer draws in step with the hold progress. When the lamp lights it finishes. When the visitor's own lamp lights, colour floods into the petals. One small arc in the outer border stays dotted forever, a quiet nod to the sixth lamp. Across the top, a marigold toran: a sagging rope with eleven hanging strands of marigold flowers, each ending in a green mango leaf, swaying with a slow wave of wind passing left to right every now and then. Add a balcony string of lights with a small controller box that the visitor can tap to cycle through steady, chase, twinkle and fade, like the real ones. Add three star lanterns, akash kandil, hanging and swaying. Tap one and it swings and settles. Lit lanterns glow as lamps two, three and four light. A cat silhouette sits at the end of the parapet and flicks its tail when tapped.

**Paste block:**
```
Foreground zone: bottom 38 percent of the stage. Parapet: rect, height 7 percent, fill ground-3, coping line 2 px in cream at 0.25.
Rangoli SVG, viewBox -150 -150 300 300, squashed to 42 percent height. Diameter min(92vw, 520px). All paths use pathLength 1.
 L1 (lamp 1): centre dot r5 filled, ring r20, 8 dots r2.2 at radius 34.
 L2 (lamp 2): 8 petals "M0,-22 C14,-36 14,-60 0,-72 C-14,-60 -14,-36 0,-22 Z" rotated every 45 deg, plus 8 small petals tip r52 offset 22.5 deg.
 L3 (lamp 3): 16 scalloped arcs on radius 80, each spanning 22.5 deg, arc radius 16.
 L4 (lamp 4): eight-point star from two squares of side 140, one rotated 45 deg, plus ring r106.
 L5 (lamp 5): double ring r126 and r132, 24 small diamonds between them. A 30 degree gap at lower right stays dotted, never drawn solid.
 Strokes: cream at 0.8, width 1.4, with an underlay of the same path at width 6 and opacity 0.12 as the glow.
 Draw: stroke-dasharray 1, offset 1 to 0, tied to diya:lighting progress; ease 1.4 s on diya:lit. Stagger 5 percent per path on high tier.
 L6 colour (tone 6): petals marigold 0.55, small petals kumkum 0.5, star triangles leaf 0.35, scallops cream 0.2. Fade 1.2 s.
 Floor light pool per lit lamp at its x: ellipse 140 x 40, flame-a at 0.35 to 0, screen blend on high only.
Toran: top zone height 8 svh max. Rope sag 18 px. 11 strands (7 at 360px). Each strand 3 marigold flowers (r7, inner r3 in darker orange)
 plus a leaf at the end, strand lengths alternate 38 and 58 px. Sway plus or minus 2.5 deg, 5 to 7 s, phases staggered; a gust sweeps left to right every 12 s.
String lights: one sagging wire, 18 bulbs, colours flame-core, flame-a, marigold, cream, one leaf-tinted. Modes: steady, chase (three phases, 1.2 s), twinkle, fade.
 Controller box 44 x 44 hit area, small black box with one dot. Mode changes only by tap, announced in a hidden live region.
Akash kandil x3: 16-point star, outer r24 inner r11, faceted with alternating triangles at two opacities, inner radial glow flame-core to flame-b.
 Sizes 48, 36, 30 px. Colours cream-amber, kumkum, leaf-green paper. String lengths 28, 20, 36 px, 3 tassel strands 14 px.
 Pendulum plus or minus 4 deg, 4 to 6 s. Tap: damped swing, 3 swings. They light at lamps 2, 3 and 4.
Cat: simple silhouette sitting on the parapet's right end, eyes catch light from lamp 3 onwards, tail flick on tap and every 9 s.
Low tier: no strand sway except two, chase on 3 groups not per bulb, no pools, no cat tail. Cap running animations: high 24, mid 12, low 4.
```

**Check after it builds:**
1. At 360px the rangoli is empty at the start and a first layer starts to draw as soon as lamp one is held.
2. Each lamp adds one rangoli layer; the last arc remains dotted even at tone six.
3. Toran, string lights and three lanterns are visible and swaying; tapping the controller box changes the light pattern.
4. Tapping a lantern gives a small damped swing; tapping the cat flicks its tail.
5. Calm on: rangoli appears at its final layer instantly, nothing sways, string lights are steady.

**If it is off:**
"The [rangoli or toran or lanterns] currently [what you see]. Do not touch the other foreground pieces. Change only that one so that [target]."

---

### P2.5: Dusk-gold, the room warming at five and the visitor's window at six

**Say this:**
Now choreograph the two big tone moments, using the shared events. When the fifth lamp is lit and the all-lit event fires, the room turns dusk-gold over about two and a half seconds. The gold sky layer cross-fades in, the ground eases to ground five, the vignette softens, the stars fade down, and the remaining windows come on in a gentle cascade. At the same moment a single ring of warm light spreads from the fifth lamp outward, once, and fades. Then a small flock of birds crosses the sky from left to right once, heading home, and never again. Do not play this earlier or twice. The toran takes a warmer tint, the lanterns glow fully, and the string lights are on. Tone six happens only when the visitor's lamp is lit, on the visitor-lit event. At that moment one extra window on the nearest block flares a little brighter and stays brighter than the rest, as the visitor's own home. The rangoli takes its colour, the horizon goes its warmest. If someone reloads and the row already shows tone five or six, jump directly to that state with no replay. In Calm, jump straight to the final state, no ring and no birds.

**Paste block:**
```
Timeline on diya:allLit (total 3.2 s): 0.0 s ring starts at lamp 5 x,y, scale 0 to 3.2 over 1.6 s, opacity 0.35 to 0, radial gradient flame-core to transparent.
 0.0 to 2.4 s tone tween 4 to 5, easing in-out cubic, cross-fade by opacity only.
 0.8 s window cascade for the remaining 15 windows, 90 ms apart.
 2.0 s birds: 9 small V-shaped silhouettes in ground-1, wings flap 2 frames, travel across in 7 s at y 18 to 30 percent, flock offsets random.
Flag: playedDusk, playedBirds in memory only. Never replay.
Toran warm tint: marigold highlight overlay opacity 0.0 to 0.25 with tone. Lanterns glow full at tone 5.
On diya:visitorLit: tone 5 to 6 over 1.6 s. Window 65 (the visitor's) is the nearest near-layer window to the lamp's x. Brighter, flame-core, halo 5 px, soft pulse 3 s.
Direct links: if the fragment sets tone at load, set final state without playing the timeline.
Quality: high all; mid no ring and no birds, tween only; low tween only, with no cascade.
```

**Check after it builds:**
1. Light the fifth lamp: the room warms to gold over a couple of seconds, a ring of light spreads once.
2. Birds cross once. Reload to confirm they only play on a fresh sequence.
3. After the visitor lamp: one window glows brighter than the rest and the rangoli fills with colour.
4. The headline and card text still read comfortably against the gold at five and six.
5. With Calm on, the gold state appears at once, no ring, no birds.

**If it is off:**
"The moment at [lamp five or the visitor lamp] does [what you see]. Keep the sequence order, and change only [timing or colour] so that [target]."

---

### P2.6: The Ink look and the Calm version of the whole scene

**Say this:**
Two options that make the page work for everyone. First, a look switch in the dock called Deepavali and Ink. Ink is a plain, quiet version for readers who do not celebrate or just prefer less. In Ink there is no toran, no lanterns, no string lights, no rangoli and no marigold. The ground uses ink and neutral near-black, the skyline stays as simple building shapes with windows in a soft warm white, still counted by the same tone rules. The rangoli is replaced by a single thin line on the floor that draws from lamp to lamp as each is lit. Flames stay amber, the only colour. Dusk-gold becomes a soft paper-warm lift. Second, Calm. The Calm toggle is always visible, in the same dock, and also starts on if the phone asks for reduced motion. Calm keeps the light but drops the movement. No sway, no twinkle, no flicker, no clouds drifting, no parallax, no bursts. Every stroke, window and tone reaches its final state at once. Both choices live in memory only, never in storage, and both are real buttons with pressed state, forty-four pixels, and visible focus rings. Nothing in either mode breaks contrast.

**Paste block:**
```
Dock: bottom of the stage, three chips: Calm (toggle), Look (segmented: Deepavali | Ink), Tilt (only if available). Each min 44 x 44, gap 8, safe-area inset aware.
Ink tokens: ground-0 #0C0B0A, ground-1 #121110, ground-2 #1A1816, ground-3 #232019, ground-4 #2B2822, ground-5 #34302A, ground-6 #3D382F.
 Text cream #F1EBDD. Flame stays flame-core and flame-a. Sky: single flat gradient, no stars except 40 static, no moon halo, no clouds.
 Skyline: far and mid layers only decorative; no tanks colour change; lit windows colour #F4EBD3. Same tone counts.
 Floor: one 1 px line, cream at 0.6, from lamp 1 to lamp 5 in the row, drawn with the same dashoffset method; no rangoli, no pools in colour.
 Dusk at tone 5: ground-5 and a 12 percent warm horizon band; no ring, no birds.
Calm: removes every keyframe animation and rAF loop in this pack, sets transition-duration 0, parallax off, Tilt chip hidden.
 Still shows: gradients, glows, lit windows, drawn rangoli.
 Also on by default when prefers-reduced-motion is reduce. A visible note near the dock: "Motion off hai? Diye seedhe jal jaate hain, koi animation nahi." (from copy file microcopy)
Chips use aria-pressed. State only in memory; no localStorage, no cookies.
```

**Check after it builds:**
1. Dock shows Calm, Deepavali and Ink; each is at least 44px and shows a focus ring on keyboard.
2. Ink: no festival decor, only quiet buildings, windows and one line on the floor; text contrast stays high.
3. Calm: nothing moves anywhere in the scene; the whole page still looks lit and warm.
4. Reload: both settings return to defaults (nothing stored); reduced-motion phones start in Calm.
5. Mixed: Ink plus Calm together looks quiet, clear and finished.

**If it is off:**
"In [Ink or Calm] I still see [element]. Keep the rest of that mode and remove only that, so that [target]."

---

### P2.7: Layout rules, the thumb zone and the stage

**Say this:**
Last, lock down the layout so the page is comfortable with one thumb on a three sixty phone. The stage is a fixed full-screen layer at small viewport height, with all scenery behind and the content scrolling over. Divide the first screen into zones by height. The top fifteen percent is the toran and lanterns. The next band is the label, the headline and the opening lines. The lamp row and the rangoli live between sixty-six and eighty-four percent, so every lamp is inside the thumb zone. The dock sits at the very bottom above the safe area. All controls are at least forty-four pixels, and with six lamps at three sixty each lamp is forty-eight with six pixel gaps. On a short phone of six forty height, drop the third lantern and use seven toran strands, and make sure the headline, the lamp row and the hold hint are all visible together. At three ninety add breathing room. On desktop, keep the content in a centred column, let the skyline spread wide, scale the rangoli up to six hundred and forty, and keep the lamp row inside a seven-twenty wide strip. In landscape on a phone, hide the foreground and keep only the lamp row. Content panels sit on near-opaque ground so text passes AA.

**Paste block:**
```
Stage: position fixed, inset 0, height 100svh, transform-only animation, pointer-events none except the dock, string-light controller, lanterns and cat.
Zones at 360x640 and 390x844 (percent of svh): 0-15 toran and lanterns; 15-50 label, headline, lines; 66-84 lamp row and rangoli; 88-100 dock.
Lamps: 6 hit targets, 48 px at 360 (gap 6, total 318), 52 px at 390 (gap 8), 64 px at 1024+ (gap 16). Row max width 720.
Gutters 16 / 20 / 32. Text column max 62ch. Desktop: column centred, left offset 0; scene fills the viewport.
Short phones (height under 680): 7 toran strands, lantern 3 hidden, cat hidden, headline top padding max(132px, 16svh).
Landscape (height under 500): hide parapet, rangoli, toran and lanterns; keep sky, skyline and lamp row.
Panels over scene: background ground-2 at 0.9 opacity, no backdrop-filter, radial warm cast from var(--lx) var(--ly) updated on diya:lit only.
First screen must show together at 360x640: headline, lamp row, hold hint.
Night scene alt text (hidden paragraph in #night): use the alt text from the copy file. All decorative SVG: aria-hidden, empty alt.
Quality: detect on first load by 2 s of frame timing; scene never takes more than 4 ms per frame.
Pause: stop all rAF and animations when document is hidden.
```

**Check after it builds:**
1. At 360 by 640 the headline, all six lamps and the hold hint are on one screen; no horizontal scroll.
2. The six lamps are reachable with the right thumb without stretching; none are under the dock.
3. At 390 by 844 and at desktop the layout feels composed: centred column, wide skyline, big rangoli.
4. Rotate the phone to landscape: foreground hides, lamps still usable.
5. Calm on and Ink on: layout does not shift at all.

**If it is off:**
"At [viewport] the [element] is [where it sits]. Keep everything else; move only that element into [zone] so that [target]."

---

## Risks and cut order

Risks: (1) Emergent may reach for images, a CDN or a font download; each prompt says code only, and Check 5 in P2.1 catches fonts. (2) Many animated SVG nodes plus blend modes can drop frames on a mid-range Android; blend modes are high tier only and the animation count is capped per tier. (3) Fixed backgrounds and the address bar can cause jank; use svh and transform-only motion. (4) The hairline moon is deliberate; if Emergent draws a fat crescent, correct it. (5) iOS needs a tap to grant device orientation; the Tilt chip handles that and is never forced. (6) The dock puts Calm at the bottom for one-thumb reach; the top bar from Pack 1 should not duplicate it.

Cut order if time or speed runs short, first to last: Tilt, cat, shooting star, birds, string-light modes (keep steady), clouds, lantern spin and tap-swing, toran gust, mid-layer rooftop details, floor light pools, Ink floor line. Never cut: windows lighting, rangoli drawing, the tone-driven sky, Calm, Ink, the 44px dock.


---

# PACK 3: LAMPS AND FLAME

Build position: 3 of 8.

Prompts P3.1 to P3.7. Speak each "Say this" into Emergent through Wispr Flow in one go. Anything under "Paste block" is pasted as text, not spoken. Event names, thresholds and exact strings live only in paste blocks, so the voice never has to carry code.

## Pack overview

- Heart of the page. Seven prompts: the clay Lamp (P3.1), the FlameEngine (P3.2), the press-and-hold gesture (P3.3), the travelling flame plus embers plus Light all (P3.4), the "lamps answer" moment (P3.5), lamp six that tries and gently dies back (P3.6), and the hardening pass for haptics, announcements, Calm and quality tiers (P3.7).
- One idea runs through everything: the hold progress IS the flame's position. As you hold, a small flame walks from the previous lamp along an arc of sparks and lands exactly when the ring completes. Letting go early walks it home. The previous lamp never dims; it brightens a little, because light is shared, not spent.
- Honest by construction: lamp six never reaches the store, never fires a lit event, never fires the ignition haptic. It tries, flickers, and dies back with the approved line.
- Micro-delights (all cheap): (1) the wick stays warm after an early release, so the next hold starts ahead; (2) a soot smudge appears on a lamp's rim when it lights and stays for the visit; (3) the lamp ahead of a travelling flame leans toward it, curious; (4) the nameplate chip grows an ink underline and a small chevron once its lamp is lit; (5) all lips point right, toward the next lamp, so the page reads as a line of hands passing a flame; (6) lamp four's flame has one lean-and-return hiccup every few seconds, lamp two a steady little pulse.
- Depends on Pack 1 (store, events, tokens, Calm, quality governor) and Pack 2 (night stage, home flame, ground tones, shared ParticleCanvas). If a name differs from the paste blocks, keep the foundation's names and tell me.

---

### P3.1: The clay diya, five lamps that are not clones

**Say this:**

> Now we build the lamps themselves, the heart of the page. Make one Lamp component as inline SVG, no images. It should look like a small hand-thrown clay diya seen from slightly above and the side: a wide round belly, a soft rim, and one pinched lip on the right where the wick rests, with a gentle kink in that lip, like a thumb pressed it. Use the kumkum colour for the clay, a darker shade of it underneath, and a lighter highlight along the rim, all derived from the tokens. Inside the rim, a dark pool of oil with one soft curved sheen stroke that can slide a little later. A twisted cotton wick sits in the lip, cream coloured, with a tiny curl at the tip. Make five lamps that are not clones. Each gets its own fixed seed that nudges belly depth, rim width, lip length, kink direction and a tilt of up to two degrees. I pasted a variety sheet below. Generate the shapes from the seed once so every visit looks identical, no random on each load. Each lamp has three states, unlit, lighting and lit, read from the store. Unlit is a cold, unburnt wick and no flame. Under each lamp put a nameplate chip with the project name in the mono font. The whole lamp plus chip is one button, at least forty-four pixels, with a clear focus ring. Draw lamp six as a dashed outline only, no clay, with its chip. Size everything from the container so five lamps fit at three hundred sixty pixels wide. Micro-delight: when a lamp lights, a tiny soot smudge appears on its rim beside the wick and stays for the visit, and the wick tip turns slightly charred. Tell the Lamp to publish where its wick tip is on screen so other parts can find it.

**Paste block:**

```
VARIETY SHEET (all lips point right, toward the next lamp)
Lamp 1  CERTGEN   broad round belly, short pinched lip, kink up, tilt -2 deg, clay a touch lighter
Lamp 2  VIGIL     taller belly, long lip, clear kink to the right, tilt +1.5 deg
Lamp 3  BLITZ     wide and shallow, flat lip, small thumb dent on the left rim, tilt 0 deg
Lamp 4  TIPINDEX  deeper belly, narrower rim, lip curls slightly upward, tilt -1 deg
Lamp 5  PITDB     widest rim, kink to the left of the lip, one tiny glaze fleck, tilt +2 deg
Lamp 6  (no name) dashed outline only, same silhouette family as lamp 5, chip: PROPOSED, NOT RUN (dashed border)

ACCESSIBLE NAMES (English only, no Hinglish in aria)
Unlit:  "Light lamp {n}, {Project}."  description: "Lamp {n}, unlit. Press and hold, tap or press Enter to light it from lamp {n-1}."  (lamp 1: "from the home flame")
Lit:    "Lamp {n}, {Project}, lit. Open its story."  description: "Lamp {n}, lit."
Lamp 6: "Lamp 6, proposed, not run." description: "Lamp 6 is proposed, not run. It stays unlit."
Project names for aria: Certgen, Vigil, Blitz, TipIndex, PitDB

STRUCTURE
The five lamps live in an ordered list, one button per list item. Chip text is the only visible project text; keep it 13px or larger, cream on dark.
Lit chip: border turns marigold, a 2px underline in flame-a, a small chevron after the name. Unlit chip: dim border only, text stays full cream (state must not rely on colour alone).
Lamp exposes: wick tip position in viewport pixels, flame base position, lamp centre, via a method that reads getBoundingClientRect when asked.
Decorative SVG parts get aria-hidden; the button carries the name.
```

**Check after it builds:**
- At 360px wide, all five lamps plus six fit with no horizontal page scroll, and each button measures at least 44 by 44.
- The five silhouettes are visibly different (lip length, kink, tilt) yet clearly one family; reload and confirm they look identical.
- Chips read clearly (CERTGEN, VIGIL, BLITZ, TIPINDEX, PITDB) and lamp six shows PROPOSED, NOT RUN on a dashed chip with no clay.
- Tab key moves through the lamps in order with a visible ring; a screen reader announces "Light lamp 1, Certgen".
- With Calm on, the lamps look identical (they are static art), no motion anywhere.

**If it is off:** "Keep everything else as it is. Change only the lamp shapes so that [what I see], and leave the nameplate chips, the button size and the seeds untouched."

---

### P3.2: The FlameEngine, flames that feel alive

**Say this:**

> Build the FlameEngine, one module that draws and animates every flame on the page, including the home flame already burning near the top. Reuse the home flame that exists, and swap its drawing for this one, so they are the same family. Each flame is three stacked teardrops in SVG: an outer one in the flame-b orange, a middle one in flame-a amber, and a small hot core in flame-core. At the very base, where it meets the wick, a tiny soft blue ellipse. Behind each flame, a soft glow, a radial gradient that blends additively. The wobble must feel organic, so drive the teardrop control points with a tiny smooth noise function, no library, nothing that visibly repeats. Use one shared animation loop for every flame. It stops when the tab is hidden, when a flame is off screen, and when Calm is on. Give each lamp its own flicker rhythm; the personalities are in the paste block. When a lamp is lit, its light spills: neighbouring lamps get a warm tint on the side facing it, and the card that opens above gets a soft glow along its bottom edge that flickers at a third of the strength, so text stays steady. Last, wind. When the reader swipes sideways across the stage, every flame leans the way the finger moves, and springs back over about a second. They lean up to about twenty degrees but never shrink below eighty percent, and they never go out. Listen to the quality tier event: high uses the noise paths, mid uses transforms only, low uses plain CSS flicker.

**Paste block:**

```
FLAME PERSONALITIES (atmosphere only, no claims)
Home flame  calmest, slow breath, largest glow
Lamp 1      steady, slow breath
Lamp 2      small regular pulse about every 1.2 seconds
Lamp 3      quick twitch, then settles
Lamp 4      gentle; one lean-and-return hiccup every 7 to 9 seconds (leans, never dims)
Lamp 5      slow, slightly taller

LAYERS
outer flame-b, middle flame-a, core flame-core, base ellipse a soft blue (about #5B8CFF at 55% opacity), glow = radial gradient flame-a to transparent, about 3x lamp width, pointer-events none.
mix-blend-mode: screen only on the high tier.

TIERS (listen to fx:setQuality {tier}; do not decide tiers here)
high: noise-driven control points on 3 layers, additive glow, neighbour tint coupled to flicker at 12 Hz max
mid:  2 layers + core, transform-only wobble (skew, scale, translate), neighbour tint static
low:  CSS keyframe flicker on one glow + one flame, no wobble, no wind lean beyond a static tilt

WIND
Input: horizontal pointer velocity on #night and #lamps. Touch uses touch-action: pan-y so vertical scroll is never blocked. Ignore wind while a lamp is being held. Wind decays with a half-life of about 700 ms.
Lean max 20 deg. Scale floor 0.80. Glow floor 0.80. Never remove a flame. Calm: wind off.

CARD LIGHT
Engine writes two CSS custom properties on the lamp card sheet: the lamp's x position and a 0 to 1 intensity. Glow lives only in the card's bottom 24px edge, behind an opaque text area (contrast must not change).
```

**Check after it builds:**
- The home flame and any lit lamp show three distinct layers, a blue base and a soft glow, and the wobble never looks like a loop.
- Swipe sideways across the stage on the phone: all flames lean with the finger and spring back; none disappear.
- Lamp two visibly pulses more regularly than lamp three; lamp four hiccups once in a while.
- Switch the tab away and back, and the animation resumes without a jump; on a low-tier device the flames still flicker.
- With Calm on, flames are steady shapes with a steady glow, no wobble, no wind lean.

**If it is off:** "The flame should [what I want, in my words]. Change only the wobble or lean amount, keep the layers and colours, and keep the loop shared."

---

### P3.3: Press and hold, with a gentle way out

**Say this:**

> Next, the lighting gesture. Only the next lamp in order is ready: lamp one first, then two, and so on. If someone presses a lamp that is not ready, the ready lamp's wick gives one soft glow pulse and a hidden announcement says which lamp to light first. When the reader presses and holds a ready lamp, three things happen together. A thin pressure ring in the flame-core gold fills around the wick over about nine hundred milliseconds, drawn wider than a thumb so it stays visible around the finger. The lamp's own flame grows from a pinprick ember to full size as the hold goes on. And the line "Baati abhi garam ho rahi hai" appears above the lamp, never below, where the thumb would hide it. At the end of the hold the lamp ignites with a bright core flash. If the finger lifts early, the ring drains back, the ember shrinks, and the hold hint comes back. Micro-delight: the wick stays warm. The next hold on that lamp starts at half of the progress the last one reached, fading to zero over four seconds. The no-hold alternative is exact and in the paste block: a quick tap, or Enter, or Space, or a screen reader click, lights the lamp with a shorter ignition. Holding is never required. Block the long-press menu and text selection on lamps, and cancel the hold cleanly if the browser takes the touch to scroll. Leave small hooks for haptics, I will wire those later.

**Paste block:**

```
HOLD
Hold duration: 900 ms to progress 1.
Ring: SVG circle, stroke flame-core, centred on the wick, radius about 0.6 x lamp width, 3px, linecap round, fills via dashoffset. Under 44px the ring still draws at 44px.
Text above the lamp while holding: "Baati abhi garam ho rahi hai."  (visible only during the hold)
Early release: ring and ember drain back over 300 ms; show the hold hint: "Dabaye rakhiye. Tap ya Enter bhi chalega." for 4 seconds, then hide.

NO-HOLD ALTERNATIVE (state it this way in code comments too)
TAP:   pointerdown then pointerup in under 350 ms with under 10 px movement lights the lamp.
KEYS:  Enter (keydown, not repeated) or Space (keyup) on a focused lamp lights it. Use the button's own click event.
AT / VOICE CONTROL: a click event with detail 0 and no preceding pointer sequence lights it.
All three run a SHORT IGNITION of about 600 ms (the travelling flame covers its path in 450 ms, then ignites). Holding is never required. Under Calm, any press lights instantly.
Do not light twice: if a pointer sequence happened, ignore the trailing click.

STATES AND EVENTS
On pointerdown: lamps[n] = "lighting". Emit diya:lighting {n, progress} each frame while it changes; on early release emit progress 0 once and set lamps[n] back to "unlit".
Only one lamp may be "lighting" at a time; ignore a second touch.
On ignition: lamps[n] = "lit"; emit diya:lit {n, x, y} where x and y are the flame base in viewport pixels.
Warm wick: remember progress at release; next hold starts at 0.5 x that, linearly fading to 0 over 4000 ms.
Touch hygiene: contextmenu preventDefault on lamps, user-select none, -webkit-touch-callout none, pointer capture on pointerdown, pointercancel = early release.
Not ready: press on lamp k when lamp k-1 is not lit -> pulse lamp (litCount+1) wick once and announce (polite, English): "Light lamp {litCount+1} first."
```

**Check after it builds:**
- On the phone, hold lamp one: the ring fills around (not under) your thumb, the ember grows, and the text sits above the lamp. At the end, it flashes and stays lit.
- Release at about half way: everything drains back, the hold hint appears, nothing is lit; hold again and notice you start ahead.
- A quick tap lights the lamp within about a second; Tab to a lamp and press Enter, and Space, both light it.
- Press lamp three before two: lamp two's wick pulses once, nothing else changes.
- With Calm on, a single tap lights the lamp instantly, no ring and no growth animation.

**If it is off:** "The hold should [what I want]. Change only the timing or the sizes in the gesture, keep the tap and Enter path exactly as it is, and do not make holding required."

---

### P3.4: The flame travels, embers rise, Light all

**Say this:**

> Now make the flame travel. Lamp one lights from the home flame, lamp two from lamp one, and so on. While the reader holds, a small bright flame detaches from the previous lamp and walks along a curved path of sparks to the lamp being lit. The flame's position is the hold progress: halfway through the hold it is halfway along, and when the ring completes it lands on the wick and ignites. Releasing early walks it back home. A tap or Enter walks the whole path in about four hundred fifty milliseconds. Work out the path at the moment of pressing, from where the two wicks really are on screen, as an arc that bows upward, so it still works wherever the layout wraps at three hundred sixty pixels. The previous lamp must not dim at all. It brightens a little and leans toward the traveller, because the light is shared, not spent. Micro-delight: the lamp ahead of the flame leans toward it too, curious. Sparks along the path go through the shared particle canvas by firing burst events. Do not create a second canvas. Lit lamps send up a tiny ember every second or two, fewer on mid, none on low or Calm. On ignition, update the store and let the tone follow the lit count. Add a quiet text button under the row, "Sab diye ek saath jalaiye", that lights the remaining lamps in order, a fifth of a second apart, each with a short travel. Also show the progress line from the paste block.

**Paste block:**

```
PATH
At pointerdown (or tap), read wick tip of previous source (home flame = source 0) and target wick tip. Quadratic curve, control point at midpoint raised by 0.35 x distance (minimum 40 px). The traveller is one small SVG flame (flame-core centre, flame-a edge) drawn in an overlay above the row; it is not a particle.
Traveller position = ease(progress) along the curve. Size grows 0.5 to 1.0 with progress.
Sparks: while travelling, fire fx:burst {kind: "spark", x, y} about every 40 ms from the traveller position (cap 25 per second).
HANDOFF DIMS NOTHING: previous lamp glow x1.10 and a lean of 6 deg toward the target while the traveller is away, never below its resting value. Next-ahead lamp leans 4 deg toward the traveller. Both return over 500 ms.

BURST KINDS (add to the shared ParticleCanvas kind table if missing; do not make another canvas)
spark   1 particle, warm gold, 350 ms life, tiny, slight drift
ignite  10 particles, radial, flame-core to flame-a, 450 ms
ember   1 to 2 particles, rising slowly with a gentle sideways drift, 2 seconds, fades out
fizzle  3 particles, short low drifts, dull orange, 700 ms  (used by lamp 6)
Optional extra field on the burst: dir, a number from -1 to 1 (current wind); the canvas may use it to lean embers or ignore it.

EMBERS: each lit lamp fires fx:burst {kind: "ember", x, y} every 1000 to 2200 ms (random per lamp). High: all lit lamps. Mid: half the rate. Low and Calm: none. Skip when the lamp is off screen or the tab is hidden.

LIGHTING ORDER AND TONE
Order is 1 to 5 only. On ignition set lamps[n] = "lit", litCount = n, tone = litCount (use the store's own setter; do not create a second store). Emit diya:lit {n, x, y} and fx:burst {kind: "ignite", x, y}.
Ground tones change with a 1200 ms ease between tone levels.

LIGHT ALL
Button label: "Sab diye ek saath jalaiye" (44px high, plain text button under the row, visible always).
Lights every remaining lamp in order, 200 ms apart, each with a short travel (about 250 ms). Fires the same events in the same order as manual lighting. Under Calm: all lit instantly, still in order. Hidden when five are lit.

PROGRESS LINE (visible, above the row)
"{n} diye jal chuke, {5-n} baaki."   at n = 5: "Paanchon jal uthe."
LIT LINES (visible, shown for 4 seconds in the same slot, per lamp)
1 "Lamp 1 jal utha. Ab iska kissa."   2 "Lamp 2 jal utha. Ek diya jala. Ab agla."   3 "Lamp 3 jal utha. Lau aage badh rahi hai."   4 "Lamp 4 jal utha. Ek diya jala. Ab agla."   5 "Lamp 5 jal utha."
While the flame is travelling (hold or tap): "Lau aage badh rahi hai..."
Lamp 1 only: 1100 ms after it lights, emit lamp:open {n: 1, source: "auto"} so its card opens. Tap on any lit lamp emits lamp:open {n, source: "tap"}. (Not in the shared contract: tell me what the card sheet listens to.)
```

**Check after it builds:**
- Hold lamp two: a small flame leaves lamp one, the sparks trail along an arc, and it lands on lamp two just as the ring completes; lamp one is never dimmer than before.
- Release at half: the traveller walks back to lamp one; hold again and it picks up from the warm start.
- Embers rise now and then from lit lamps and drift gently, and stop when the tab is hidden.
- Tap "Sab diye ek saath jalaiye" with two lit: lamps three to five light in order about a fifth of a second apart; the progress line ends on "Paanchon jal uthe."
- With Calm on, lamps swap to lit instantly in order, no sparks, no travelling flame, no embers; the progress line still updates.

**If it is off:** "The travelling flame should [what I want]. Change only the path or the timing of the traveller, keep the previous lamp's brightness never lower than before, and keep the shared canvas as it is."

---

### P3.5: The lamps answer

**Say this:**

> Now the moment I care about most. When the fifth lamp lights, the row answers. Order matters. First the fifth lamp's ignition finishes on its own for about half a second. Then every flame in the row, the home flame included, breathes once together. Over six hundred milliseconds they all swell by about fourteen percent and the glows widen, in perfect sync, then settle back. For that moment all the personal flicker rhythms line up on one shared beat, and afterwards they drift apart again over about a second, so it feels like the lamps noticed each other. While the row breathes, the ground begins to turn toward dusk-gold. Wherever the ground tone change is defined, give the change to the fifth tone a delay of seven hundred milliseconds so the breath finishes first, then take about one and a half seconds. At the same time, lamp six's dashed outline slowly fills with warm light from the inside, up to about fifty-five percent, and stops there. It never becomes a flame. Then reveal the row-breathes section with its copy, and announce it in the hidden live region. Fire the all-lit event at the start of the breath so other parts can react. Under Calm, skip the breath: show the dusk-gold tone straight away, with lamp six softly filled.

**Paste block:**

```
TIMELINE (t0 = ignition of lamp 5)
t0          lamp 5 ignition (same as lamps 1 to 4); litCount = 5
t0 + 500    emit diya:allLit; start the BREATH
BREATH      600 ms total, sin-shaped: flame scale 1 -> 1.14 -> 1, glow radius 1 -> 1.5 -> 1, all lit flames plus the home flame on one shared phase. Per-lamp rhythms blend back to independent over 1000 ms after.
t0 + 500    lamp 6 dashed outline: inner warm fill ramps 0 -> 0.55 over 1400 ms and stays at 0.55. No flame. No ignite burst. Never emits diya:lit for 6.
GROUND      tone 5 (dusk-gold): add a 700 ms transition-delay to the change to tone 5 only, then a 1500 ms ease. Tone 6 belongs to the visitor's lamp and is not touched here.
REVEAL      #row-breathes becomes visible at t0 + 700 with its copy from copy.json:
            "Paanch diye jal uthe."
            "Dekhiye: ek diya doosre se jala, aur pehle wale ki roshni kam nahi hui."
            "Kamra ab thoda sunehra ho gaya."  (italic)
LIVE (hidden, polite, English): "All five lamps are lit. The room has turned warm gold."
CALM: no breath, no delay, no fade. Tone 5 applies at once; lamp 6 fill is set to 0.55.
If the visitor used Light all, the same sequence plays after the last lamp lights.
```

**Check after it builds:**
- Light the fifth lamp: a short pause, then the whole row swells together once and settles; the room turns dusk-gold after the breath, not before.
- Lamp six's dashed outline fills with a warm glow but has no flame, and it never gets brighter than about half.
- The #row-breathes lines appear below the row with the three lines, and reading them on the gold ground is comfortable (contrast stays AA).
- After the breath the flames flicker independently again within about a second.
- With Calm on, the room is dusk-gold instantly after the fifth lamp, with no swelling.

**If it is off:** "The breath should [what I want]. Change only the timing or the size of the swell, keep the order of ignition, breath, then gold, and keep lamp six without a flame."

---

### P3.6: Lamp six tries, and is honest

**Say this:**

> Lamp six is the honest lamp, the one that is proposed and not run. It must never light, however hard anyone tries. Anyone can press it at any time, before or after the five. When it is pressed or tapped or Enter is hit, a small spark leaves the last lit lamp, or the home flame if none is lit, and arrives at lamp six's wick. A tiny flame tries to catch, at about a third of normal size. It flickers three times, rising and falling, and then the flame gently dies back to a thin orange ember that fades over a couple of seconds, with one small curl of smoke. If they hold it, the pressure ring stops filling at about sixty percent and never goes further. Once the flame has gone out, show the exact line from the paste block, in the status slot, where it stays until the next press. Keep it plain and kind, no red, no warning icon. This lamp must never write to the store, never fire the lit event, never trigger the ignition flash, and never trigger the twenty-millisecond ignition buzz. Only the small start buzz. Keep a separate "see the growth test" button beside it that opens its card; pressing the lamp itself never opens a card. The lamp has no numbers, no thresholds, no results, anywhere. Under Calm, show a small steady ember for about a second with no motion, then the line.

**Paste block:**

```
LAMP 6 STATE (local only; the store keeps lamps[1..5] and litCount 0 to 5; lamp 6 is NOT in the store)
proposed -> trying -> proposed

SEQUENCE (tap, Enter, or hold; same ending for all)
0 ms     press. Haptic 10 ms (if available). Spark path from the last lit lamp (or home flame) arrives within 450 ms (hold: follows progress, capped at 0.60).
450 ms   tiny flame appears at 0.33 scale
450-1250 flickers 3 times: scale 0.33 -> 0.22 -> 0.30 -> 0.18 -> 0.26 -> 0.12
1250-1800 flame shrinks to a thin ember glow, one fx:burst {kind: "fizzle", x, y} and a single thin smoke curl (SVG path, opacity 0.35 -> 0, rising 24 px)
1800-3800 ember fades to nothing. Dashed outline returns to its resting state (resting fill 0.55 if five are lit, else 0).
Line appears at 1250 ms and stays until the next press, in the same status slot as the lit lines, styled calmly (cream, no red, no icon):
"Yeh diya abhi nahi jalega. Test chala nahi. Bujha hua, par imaandaar."
Hidden live region (English, polite): "Lamp 6 is proposed, not run. It stays unlit."
If the hold continues, the ring stays at 0.60 and the flame flickers until release, then dies back as above.
Never: diya:lit for 6, ignite burst, 20 ms haptic, litCount > 5, any tone change, any card opening on lamp press.

Separate button next to lamp 6, 44px: "See the growth test"  (opens its card with lamp:open {n: 6, source: "button"})
CALM: steady ember at 0.30 scale for 1000 ms, then off; line appears with the ember; no smoke, no flicker.
```

**Check after it builds:**
- Press lamp six on the phone: a spark arrives, a small flame tries to catch, flickers, and gently dies, and the exact Hinglish line appears and stays.
- It never turns into a full flame, and the progress line still says the right count of five at most.
- Hold on lamp six: the ring stops short of full and the flame flickers until you let go.
- "See the growth test" opens the card; pressing the lamp itself never does.
- With Calm on: a steady ember for about a second, then the line, no flicker or smoke.

**If it is off:** "Lamp six should [what I want]. Change only how the attempt looks or how long it lasts, and make sure it still never lights fully and never writes to the store."

---

### P3.7: Haptics, announcements, Calm, and the quality tiers

**Say this:**

> Final pass on the lamps. Haptics first. On Android, check that the vibrate feature exists before using it, and never call it otherwise. Give a ten millisecond buzz when a hold or tap starts, and a twenty millisecond buzz at ignition. No buzz in Calm, no buzz from the keyboard, no buzz for lamp six at ignition. Next, announcements. There is one hidden polite live region in English, separate from the visible status line, which should be hidden from screen readers so nothing is read twice. Announce only the lit count and what changes, never every frame. Then Calm. There is a visible Calm toggle on the page already; read from it, and also from the reduced-motion setting. When it is on: no flame wobble, no wind, no embers, no sparks, no breath. Lamps swap to lit instantly, and the glow is steady. Show the note about motion being off once, near the row. And make sure the plain way still works: Light all is visible, the lamp row is an ordered list, and every state change is also in text. Finally, quality. Listen to the quality events from the foundation and apply the tiers I described: on low there are no embers and one simple flicker. Pause everything on a hidden tab and for flames off screen. Cap the sparks and embers, reuse the same objects, and tell me the maximum number of particles this pack can ask for at once.

**Paste block:**

```
HAPTICS (Android only, feature-detected)
if navigator.vibrate exists: 10 ms on press start (hold or tap), 20 ms on ignition of lamps 1 to 5.
None when: Calm on, keyboard or assistive click, lamp 6 ignition (lamp 6 gets the 10 ms start only).

LIVE REGION (visually hidden, aria-live polite, English)
Lamp lit:        "Lamp {n} is lit. {n} of 5 lamps lit."
Not ready:       "Light lamp {k} first."
After five:      "All five lamps are lit. The room has turned warm gold."
Lamp 6:          "Lamp 6 is proposed, not run. It stays unlit."
Light all:       one announcement when done: "All five lamps are lit."
The visible status line is aria-hidden so nothing is read twice.

CALM = Pack 1's calm flag OR prefers-reduced-motion
Visible note when reduced motion is detected (once): "Motion off hai? Diye seedhe jal jaate hain, koi animation nahi."
Calm behaviour list: no rAF loop for flames, no wind, no embers, no spark trail, no traveller, no ring fill (a press lights at once), no breath, no tone transitions; glows steady at the lit level.
Toggling Calm live: flames keep their lit state; motion simply stops or starts.

TIERS (from fx:setQuality {tier})
high  noise paths, additive glow, light cast coupled to flicker, embers 100%, wind
mid   transforms only, static light cast, embers 50%, wind
low   CSS flicker only, no embers, no wind lean

PERFORMANCE LIMITS
One animation loop for all flames. Pause on document hidden and for off-screen lamps (IntersectionObserver). Embers: pool of 24 max across the page from this pack. Sparks: pool of 40 max. Fizzle: 6. Ignite: 12 per event. No filters (blur) on animated elements; glow is a gradient, not a blur.
Targets: 60fps on a mid-range Android, one-thumb at 360px.
```

**Check after it builds:**
- On an Android phone, a hold buzzes lightly at the start and slightly more at ignition; on an iPhone or with Calm on, nothing buzzes and nothing breaks.
- A screen reader hears "Lamp 2 is lit. 2 of 5 lamps lit." once per lamp, with nothing read twice.
- Toggle Calm on mid-way: flames freeze to steady glows, embers stop, the next lamp lights instantly, and the count and text still update.
- Turn on the system's reduced-motion setting and reload: Calm starts on, with the note about motion visible once.
- Tab away for ten seconds and back: no catch-up burst of sparks, and the page still scrolls smoothly with all five lit.

**If it is off:** "The announcements should [what I want]. Change only the wording or timing of what is announced, keep one hidden live region, and do not add any sound."

---

## Risks and cut order

**Main risks**
- Frame rate on mid-range Android with six noise-driven flames, glows and a particle canvas. Mitigation is built in: one loop, transform-only mid tier, pools with hard caps, no blur, no blend mode below high.
- The nine-hundred-millisecond hold can feel hard under a thumb that covers the lamp. Mitigation: ring wider than the thumb, text above, warm-wick carry-over, and the tap/Enter path always available and stated up front.
- Wind (horizontal swipe) fighting page scroll. Touch uses vertical pan only; wind is ignored during holds and on pointer cancel.
- Emergent invents a different event name or builds a second canvas. Keep names from the paste blocks and say "do not make another canvas" in any correction.
- Contract gaps this pack needs: a card-open event (proposed: lamp:open {n, source}), the ParticleCanvas kinds spark, ignite, ember, fizzle (and optional dir), and who owns tone updates (assumed: this pack sets litCount, and tone follows it, using Pack 1's setters).

**Cut order if time or frames run out (first to go first)**
1. Wind lean.
2. Light cast coupled to flicker (keep a static warm tint).
3. Per-lamp personalities (lamp four's hiccup, lamp two's pulse).
4. Noise-driven paths (fall back to the mid-tier transform wobble everywhere).
5. Ember particles.
6. Soot smudge and oil sheen slide.
7. The row-breathes swell (keep the dusk-gold shift).

**Never cut:** the tap and Enter path, Calm, the announcements, and lamp six's honest behaviour.


---

# PACK 4: LAMP CARDS AND STORY INTERACTIONS

Build position: 4 of 8.

Project: EK DIYA SE DOOSRA (v2), Shriniwas Kholkute. Build tool: Emergent, driven by voice (Wispr Flow). Prompts are numbered P4.1 to P4.8. Speak the "Say this" text; paste the "Paste block" (pasted text is not voice). Run them in order. P4.1 to P4.3 build the card; P4.4 to P4.8 build one story device per lamp. Every device mounts only when its card opens and pauses when the card closes or the tab is hidden.

## Pack overview

1. One LampCard (a native dialog styled as a floating letter) is used by all five lamps. It rises out of the lamp, is lit by that lamp's flame, tilts gently, reads in three parts, and ends with a receipt button, a quiet "Agla diya" corner and a swipe-down close.
2. Each lamp gets one device that makes the reader feel the story, not read it: 324 balcony lights (Certgen), a flame message on a wire with a 3-second gate (Vigil), a swinging price tag that settles (Blitz), a baton between two lanterns plus an 820-dot rangoli (TipIndex), a dial where a 06:15 flame arrives early (PitDB).
3. Every device has an always-visible plain-text twin already in the copy, a MODEL OF DOCUMENTED BEHAVIOR or "picture only" label where it models something, and one caption taken word for word from website_copy.md. No device invents a number, a result or a time. Facts sit in the DOM whether or not the reader touches anything.
4. The five devices cover how he works (a decision line in his words), what failed (the first beat of each device), and what he did next (the second beat), using only copy lines. Lamp 6 is NOT a card in this pack: it is the visible #lamp-6 section; "Agla diya" on lamp 5 scrolls to it.
5. Quality tiers, Calm, reduced motion, pause-when-hidden, 44px targets and Android-only haptics are specified in every prompt. Micro-delights: the folded-corner "Agla diya"; serial lights that chase before you guess; a price tag that stops swinging once it tells the truth; a card that folds back into its lamp with one small flare; a ghost flame that arrives before its time.

---

### P4.1: LampCard, the letter that rises out of its lamp

**Say this:**
Please build the lamp card, a component called LampCard. It is not a modal in the usual sense. It is a letter that rises out of the lamp it belongs to. Use the native dialog element, opened as modal, so we get the top layer, the Escape key and a real focus trap for free, but style it as a floating card with twelve pixels of margin from the screen edges, a maximum width of four hundred eighty pixels and a maximum height of eighty eight percent of the screen, scrolling inside if the text is longer. When it opens, find the centre of that lamp on screen and animate the card from there. It starts small and low, right at the lamp, and grows to its place in about four hundred and fifty milliseconds, using only transform and opacity. Closing plays the same motion backwards into the lamp, and the lamp's flame gives one small flare. On the top edge of the card sits a miniature of that lamp's own flame, reuse the flame component from the lamps pack, and its glow washes the card's rim, kicker and title with warm light. Keep that glow a separate soft layer whose opacity breathes slowly, never an animated gradient. Each card shows a small kicker, a title, then three labelled parts, then a receipt button, a quiet Agla diya link and a close button that says Row par waapas. Store all five card texts from the paste block in the copy file under cards, and use only those words. Each lit lamp has a button that says Kissa kholiye; make it call the card's open function with the lamp number. Unlit lamps never open a card. In Calm or with reduced motion, the card just fades in place and the flame is steady.

**Paste block:**
```
WIRING NAMES (use exactly)
Open function: openLampCard(n), n = 1 to 5. Card element id: lamp-card.
Store reads: lamps[n] must be "lit"; calm; quality; tone (0 to 6).
Events listened to: fx:setQuality {tier}. Events sent: fx:burst {kind:"spark", x, y} on open and close.
CSS tokens: --ground-0 to --ground-6, --flame-core, --flame-a, --flame-b, --cream, --kumkum, --marigold, --leaf, --ink, --font-display, --font-body, --font-mono.
Evidence drawer folders: Certgen c1, Vigil c2, Blitz c3, TipIndex c4, PitDB c5.

CARD COPY (src/data/copy.json, cards.1 to cards.5). **bold** means strong emphasis.

cards.1  caseId c1
kicker: LAMP 1 · CERTGEN · THE GREEN WALL
title: Sab green tha
happened:
 Imagine a college generating thousands of certificates. One wrong entry shouldn't ruin the batch or crash the service. Bas itna hi kaam tha.
 I mapped the workflow and architecture, made or approved product decisions, and used AI coding tools to implement the prototype. The prototype passed **324 tests**.
 A separate audit found **19 problems**: one input consumed excessive processing time; another ballooned into an enormous response. Tests ne woh sawaal poochhe hi nahi the.
didNextLabel: Maine phir kya kiya   gloss: what I did next
didNext: Green screen pe ruk jaana aasaan tha. **I didn't defend the green screen.** Records show me approving safeguards, changing scope and directing more remediation when problems remained. Agents audited and fixed the code. The final report recorded zero open findings in its scope; later checks passed **479 main and 232 audit tests**.
warning: It's still a prototype, not a security guarantee. Isse zyaada ka daava main nahi karta.
receiptLabel: OPEN THE CERTGEN RECEIPT

cards.2  caseId c2
kicker: LAMP 2 · VIGIL · THE WATCHDOG THAT TRUSTED A LATE REPLY
title: Der se aaya jawab
happened:
 Vigil checked whether a data connection was alive, jaise phone par poochhna: "Hello? Aap wahin hain?"
 Despite green tests, a reply arriving **after the deadline** could count as proof of health. Der se aaya jawab bhi "haan, zinda hoon" maan liya ja sakta tha.
didNextLabel: Maine phir kya kiya   gloss: what I did next
didNext:
 Maine ek sawaal uthaya: kya yeh tests system ka asli vaada sach mein check karte hain?
 I questioned whether the tests proved the system's real promise. An AI-assisted review found the defect and implemented an approval-gated correction.
 When a verifier removed the correction, **two targeted tests failed**. Restored, the suite passed **105 tests**.
 The question became: **does it deliver what someone depends on?**
warning: Yeh sab simulated connections par hua tha. The 105 tests were verified locally in an agent session, not in CI, and there was no production deployment.
receiptLabel: OPEN THE VIGIL RECEIPT

cards.3  caseId c3
kicker: LAMP 3 · BLITZ · THE NUMBER I WITHDREW
title: Jo number maine waapas liya
happened:
 A speed claim looked remarkable: **1,205 nanoseconds**. Woh number bahut achha lag raha tha. It had come from an uncommitted working tree.
 Better-controlled measurement showed **1,850**. The advertised **3.1× advantage** shrank to **1.02×**.
didNextLabel: Maine phir kya kiya   gloss: what I did next
didNext: The headline was replaced. Later changes made even the replacement historical. **I chose the defensible story over the flattering one.** Chamak nahi, sach.
warning: 1,850 ns is a historical run, not today's number. Current latency has not been remeasured.
receiptLabel: OPEN THE BLITZ RECEIPT

cards.4  caseId c4
kicker: LAMP 4 · TIPINDEX · THE AGENT STOPPED, THE WORK CONTINUED
title: Agent ruka. Kaam nahi.
happened:
 Codex hit its limit during a long experiment and left an incomplete output. Beech raaste mein agent ruk gaya. File adhoori.
didNextLabel: Maine phir kya kiya   gloss: what I did next
didNext:
 I directed a handoff to Claude Code, approved a verified disk cleanup, and resumed from recorded checkpoints. The campaign record reports **820 completed measurement rounds**.
 **A process shouldn't depend on one operator remembering everything.**
warning: Agents wrote most of the code and ran most of the benchmarks in this project. These are one-laptop, limited-workload results, not product speedups. Product ka daava nahi.
receiptLabel: OPEN THE TIPINDEX RECEIPT

cards.5  caseId c5
kicker: LAMP 5 · PITDB · THE FUTURE APPEARED EARLY
title: Future, waqt se pehle
happened:
 A database meant to answer "What was known then?" could, in one specific time-zone edge case, show a **06:15** event at **06:00**. Yaani 06:15 ki baat 06:00 par hi dikh jaati.
didNextLabel: Phir kya hua   gloss: what happened next      (KEEP this label. Do not change it to "Maine phir kya kiya"; that waits for Shriniwas to confirm which approvals were his.)
didNext: Agents found and addressed the defect in a local remediation version; the claim was narrowed.
warning: **That correction is not yet reflected in the public default branch.** Aur main yeh nahi keh raha ki har audit finding fix ho chuki hai.
receiptLabel: OPEN THE PITDB RECEIPT
```

**Check after it builds:**
1. Tap Kissa kholiye on a lit lamp: the card visibly grows out of that lamp (not from screen centre) and the lamp's mini flame sits on the card's top edge. Unlit lamps offer no such button.
2. Close it with Row par waapas and with Escape: the card shrinks back into the lamp and the lamp flares once; focus returns to the Kissa kholiye button.
3. At 360px wide the card has a 12px margin, never wider than the screen, and long text scrolls inside the card, not the page behind.
4. With Calm on: the card only fades in place, the flame is steady, nothing breathes.
5. Check no extra words appear anywhere; kicker, title and parts match the paste block exactly.

**If it is off:**
"The lamp card [describe exactly what you see, for example: opens from the middle of the screen / is wider than the phone], please [describe what you want instead], and change nothing else."

---

### P4.2: Paper, ink, flame light and gentle tilt

**Say this:**
Now give the lamp card its material. It should feel like a letter written on warm paper by lamplight. Draw the paper in CSS only: a cream base using our cream token, with faint paper fibres made from two very light repeating gradients, plus one tiny tiled noise pattern from an inline SVG turbulence filter used as a background image at about six percent strength. Text is in the ink token, titles in the display font. Give the edges a soft deckle with a small irregular border radius, and a slightly darker, warmer tone near the flame at the top. The flame's light must wash only the top edge, the rim and the title, never the body text, so contrast stays above four point five to one. Keep the wash on its own layer and only change its opacity. Now the tilt. On a mouse, the card tilts up to four degrees toward the pointer; on Android, it follows the phone's tilt through the device orientation sensor with a gentle smoothing, and no permission prompt is shown. Touch dragging never tilts it. Add a soft sheen highlight that slides opposite to the tilt. Update tilt at most thirty times a second, and let it settle back to flat after one second of stillness so the text stays crisp; only set will-change during movement. On medium quality halve the tilt, on low quality switch tilt and sheen off. In Calm there is no tilt, no sheen and no breathing.

**Check after it builds:**
1. On a phone, the card reads as paper with ink (fibres visible at close look, no flat grey box), and body text is easy to read in the flame's light.
2. On a Chrome desktop, moving the mouse tilts the card a few degrees and the sheen slides the other way; it settles flat when still.
3. On Android, tilting the phone gently moves the card; no permission dialog appears.
4. Switch the quality tier to low: tilt and sheen stop; paper and glow remain.
5. Switch Calm on: nothing tilts or breathes and text is still fully readable.

**If it is off:**
"The paper, glow or tilt on the lamp card [describe exactly what you see], please [change it this way], and keep the tilt limit, the contrast and Calm behaviour as they are."

---

### P4.3: Three parts that reveal as you read, receipt, swipe down, Agla diya

**Say this:**
Next, the reading rhythm of the lamp card. The card has three labelled parts in this order: the part called what happened, the part called Maine phir kya kiya with its small English gloss beside it, and the part called Fair warning. Each part reveals only when the reader reaches it. Use an intersection observer rooted in the card's own scroll area. The first part inks in right after the card has risen; each later part reveals when thirty five percent of it is in view, and never before the part above it. A reveal means the heading draws a short hand-inked underline and the lines fade in with a sixty millisecond stagger, capped at six lines. On the left margin, three small dots join into a thread as each part appears. The text must always be in the page, readable by screen readers, and with reduced motion or Calm everything is simply shown at once. At the bottom is the receipt button. Its words come from the copy, one unique name per project, and it opens the matching folder in the evidence drawer. While the drawer is open the card is hidden, not destroyed, and comes back at the same scroll position when the drawer closes. Add a quiet Agla diya link as a folded paper corner at the bottom right that peels slightly on hover and focus. It switches the card to the next lamp if that is lit; otherwise it closes the card and moves focus to the next lamp's light control; on lamp five it closes the card and scrolls to the lamp six section. Finally, swipe down to close: from the grab pill at the top, or from anywhere when the card is scrolled to the top, but never from inside a slider or a canvas. Closing happens past ninety pixels or a fast flick.

**Paste block:**
```
EXTRA NAMES
Receipt buttons open the evidence drawer folder by caseId (c1 to c5). Preferred: a function openEvidence(caseId). If it does not exist yet, send a small event named evidence:open with the caseId, and listen for evidence:closed to bring the card back. Tell me in your reply which of the two you used.
Interactive devices inside the card carry a data attribute named data-no-swipe so the swipe-down ignores them.
Close button label: Row par waapas. Folded corner link label: Agla diya. Accessible name of the corner link on lamps 1 to 4: Agla diya (next lamp); on lamp 5: Agla diya (lamp 6).
Progress line (shown only inside the page, not in the card): {n} diye jal chuke, {5-n} baaki.   at n=5: Paanchon jal uthe.
```

**Check after it builds:**
1. Open a card on a phone: part one inks in; scrolling brings part two and part three in one after the other, never out of order.
2. Turn on a screen reader or read the page source: all three parts are present before they are revealed; the five receipt buttons have five different names, such as OPEN THE VIGIL RECEIPT.
3. Tap a receipt button: the matching folder opens (Vigil gives the Vigil folder); closing the drawer brings the card back at the same scroll position.
4. Swipe down from the pill, and when scrolled to the top from the body: the card follows the finger and closes; dragging a slider inside a card never closes it.
5. Tab through: focus stays inside the card, the focus ring is visible, and Agla diya is reachable; with Calm on, everything appears instantly.

**If it is off:**
"The reveal [or: receipt, swipe, Agla diya] on the lamp card [describe exactly what happens], please make it [describe what you want], and leave the other behaviours alone."

---

### P4.4: Lamp 1, the string of 324 balcony lights (GuessAudit)

**Say this:**
Now Lamp 1's device, the component called GuessAudit, placed inside the what happened part of the Certgen card. Draw a wall of exactly three hundred and twenty four tiny warm bulbs on a Canvas 2D, laid out like balcony serial lights: twelve sagging strings of twenty seven bulbs each. Before the visitor does anything the strings glow and a slow warm chase runs along them, and a tap near the wall sends a soft ripple through the nearest bulbs. Under the wall is the question from the paste block with four large buttons, zero, three, eight and nineteen, each at least forty four pixels, built as real radio inputs. When the visitor picks one, the wall dims for half a second like a power flicker, and then exactly nineteen bulbs, chosen from a fixed seeded shuffle so they spread across the wall and are the same every time, start flickering in uneven rhythms and get a thin ring. Two of them are brighter and have a bigger ring, for the two high findings. Then the reveal text fades in, then the branch line: the first one for any guess under nineteen, the second for nineteen. Always show the plain text and the status chip. Add the small label saying this is a picture only. Draw bulbs from a pre-rendered sprite and animate only the flickering ones; thirty frames on high, twenty on medium, static on low. Pause when the card closes or the tab is hidden. In Calm, no chase and no flicker: the nineteen simply show their rings in the kumkum colour.

**Paste block:**
```
Question: How many problems did the separate audit find?
Options: 0   3   8   19
Prompt under options: Aapka andaza?
Reveal text: The audit found 19 problems, two of them high. One crafted value caused disproportionate CPU work. A request of roughly 26 MB expanded into roughly 192 MB of response material. The tests hadn't asked those questions, and I directed more remediation.
Branch, guess below 19: Kam socha? Aap akele nahi hain. 324 tests ne bhi wahi socha.
Branch, guess 19: Bilkul sahi. Tests ko yeh nahi dikha tha.
Always-visible plain text: 324 of 324 tests passed. A separate audit then found 19 problems, two of them high.
Status chip: 324 / 324 tests pass
Caption under the wall: Tests ne woh sawaal poochhe hi nahi the.
Picture-only label (new interface label, please keep exactly): A picture, not a map. The 19 problems are not 19 of the 324 tests.
Start again button: Phir se shuru kijiye
Component names: GuessAudit inside StoryFrame (StoryFrame holds the label slot, caption slot and plain-text twin for all five devices).
```

**Check after it builds:**
1. On a 360px phone the wall shows 12 strings of 27 bulbs, count is 324, nothing is clipped, and a tap sends a ripple.
2. Tap 3: after a half-second flicker, exactly 19 bulbs (two brighter) flicker with rings, then the reveal text, then "Kam socha?..." appears. Tap Phir se shuru kijiye and pick 19: you get "Bilkul sahi."
3. The plain text and the "324 / 324 tests pass" chip are visible without touching anything, and the picture-only label sits right under the wall.
4. Keyboard: arrow keys move among the four options, Enter confirms; the reveal text is read out once by a screen reader.
5. Calm on: no chase, no flicker; the 19 show steady rings; choosing a guess shows the text at once.

**If it is off:**
"In the audit wall [describe what you see, for example: I count N bulbs / the nineteen change each time], please make it exactly 324 and the same nineteen every time, and keep everything else the same."

---

### P4.5: Lamp 2, the flame message and the 3-second gate (LateReplySlider)

**Say this:**
Lamp 2's device is the component called LateReplySlider, in the what happened part of the Vigil card. The idea: a flame message travelling along a wire towards a deadline gate. The wire is the slider track itself. Use one real range input from zero to six seconds, step half a second, starting at two, styled with a forty four pixel thumb drawn as a small flame, so the flame message moves with the thumb. Draw the wire and a gate at exactly the middle, with two little posts and a hanging string of marigold dots, labelled three second deadline. Above the device show the label MODEL OF DOCUMENTED BEHAVIOR with the sentence about a simulated connection. Under the label, a two-button segmented control, Original logic and Corrected logic, with a pressed state, starting on Original. Before the gate, the flame is bright and the readout says it counted as proof the connection is alive. After the gate, in original logic the flame passes through with a small open-circle mark meaning counted; in corrected logic the flame turns to a dim ember and passes with a dashed circle meaning not counted. Never use red, crosses or ticks. When the toggle flips, the gate's garland swings once. Readouts and the plain text come exactly from the paste block, updated at most every four hundred milliseconds into a polite live region, and the slider's spoken value comes from the paste block too. On Android, a tiny vibration when the flame crosses the gate, not in Calm. In Calm there is no swing and no glide; the flame jumps to its spot.

**Paste block:**
```
Prompt line: Khiskaiye aur dekhiye.
Label chip: MODEL OF DOCUMENTED BEHAVIOR     Sentence: A simulated connection, not real monitoring.
Group label: Which logic?    Buttons: Original logic | Corrected logic
Slider label: When the reply arrives   (0 to 6 seconds, starts at 2)   Gate label: 3-second deadline
Spoken value: "{t} seconds, before the 3-second deadline"  or  "{t} seconds, after the 3-second deadline"
Readout, before the deadline: Reply at {t} s, before the 3-second deadline. Counted as proof the connection is alive. Dono logic mein yahi hota hai.
Readout, after the deadline, original logic: Reply at {t} s, after the 3-second deadline. Original logic: still counted as proof of health. Yahi dikkat thi.
Readout, after the deadline, corrected logic: Reply at {t} s, after the 3-second deadline. Corrected logic: not counted as proof of current health.
Always-visible plain text: A reply that arrives before the 3-second deadline counts as proof the connection is alive. In the original logic, a reply that arrived after the deadline could still count as proof of health. In the corrected logic it is not counted as proof of current health.
Caption under the wire: Der se aaya jawab bhi "haan, zinda hoon" maan liya ja sakta tha.
Exactly 3 s (new interface label, the copy defines only before and after): Reply at 3 s, right on the deadline line. Move the flame a little either way to see each case.
```

**Check after it builds:**
1. At the start, the slider is at 2 s on Original logic and the readout says "Reply at 2 s, before the 3-second deadline. Counted as proof...".
2. Drag to 4.5 s on Original: the flame passes the gate and the readout says "still counted as proof of health. Yahi dikkat thi."; switch to Corrected: "not counted as proof of current health", the flame dims, and the garland swings.
3. The label MODEL OF DOCUMENTED BEHAVIOR and the plain-text paragraph are visible with no interaction; the slider is a real range input and works with arrow keys, each announcing the spoken value.
4. At 360px the thumb is at least 44px and dragging the slider does not close or scroll the card.
5. Calm on: no swing, no glide; readouts still change.

**If it is off:**
"On the late reply slider, [describe exactly what you see], please [change it this way], and keep the readout wording exactly as in the paste block."

---

### P4.6: Lamp 3, the swinging price tag that settles (StoryPriceTag)

**Say this:**
Lamp 3's device is a new component called StoryPriceTag, in the what happened part of the Blitz card. On the left, a paper price tag hangs from a string and sways restlessly like a pendulum, up to three degrees, with a slow shimmer sweeping across its face. The front reads one thousand two hundred and five nanoseconds, with the line it came from an uncommitted working tree. A button, Flip the tag, or a tap on the tag itself, turns the tag over in 3D to show one thousand eight hundred and fifty and a small chip, historical run, not today's number. The moment it flips, the tag stops swinging in two or three damped swings and the shimmer is gone. This is the cheap delight: the number that sparkled was the one that was withdrawn, and the true one is still. On the right, a bar labelled advertised advantage starts at three point one times. When the tag flips, the bar visibly deflates: its length eases down to one point zero two times with a small elastic overshoot, its gold gradient turns to flat cream, and the number counts down from three point one to one point zero two over seven hundred milliseconds. The bar must keep its text alternative, and the real numbers are always in the paragraph above. Use CSS transforms only. In Calm and reduced motion, no sway or shimmer, and the flip is an instant swap. Under low quality, drop the shimmer.

**Paste block:**
```
Tag front: 1,205 nanoseconds     Line on tag: It had come from an uncommitted working tree.
Tag back: 1,850     Chip: A historical run, not today's number.
Button label (new interface label): Flip the tag
Bar label: Advertised advantage      Values: 3.1×  then  1.02×
Caption: Chamak nahi, sach.
Bar text alternative: The advertised 3.1× advantage shrank to 1.02×.
Fair warning stays in the card, unchanged: 1,850 ns is a historical run, not today's number. Current latency has not been remeasured.
Do NOT show any other latency number, any later number, or any speedup.
```

**Check after it builds:**
1. Before flipping, the tag sways and shimmers; the front says 1,205 nanoseconds with its line about the uncommitted working tree, and the bar shows 3.1×.
2. Tap Flip the tag: it turns over to 1,850 with the historical-run chip, the sway damps to rest, the shimmer stops, and the bar deflates from 3.1× to 1.02×.
3. No latency or speedup number other than 1,205, 1,850, 3.1× and 1.02× appears anywhere on the card.
4. The Flip button is 44px high, keyboard operable, and the bar has its text alternative.
5. Calm on: the tag does not sway, flipping is an instant swap, and the bar jumps.

**If it is off:**
"The price tag [describe exactly what you see], please [change it this way], and do not add any number that is not in the paste block."

---

### P4.7: Lamp 4, the baton between two lanterns and the 820-dot rangoli (StoryHandoff)

**Say this:**
Lamp 4's device is a new component called StoryHandoff, at the top of the Maine phir kya kiya part of the TipIndex card. It has two halves, kept visibly separate. In the upper half are two lanterns, one labelled Codex on the left and one labelled Claude Code on the right, joined by a dashed path with three small stepping stones labelled handoff, verified disk cleanup, and recorded checkpoints. The Codex lantern starts dim, with a dashed half-drawn line trailing from it into nothing, the unfinished file. A tap, or Enter, sends a small baton of light along the path, lighting each stone in turn; it lands in the Claude Code lantern, which lights, and the dashed line becomes solid. In the lower half is a rangoli drawn in Canvas 2D from exactly eight hundred and twenty dots: twenty arms of forty one dots, filling ring by ring outward in marigold, kumkum, leaf green and cream. A button, Hold to count the rounds, fills it while held; a quick tap or Enter fills it over about two and a half seconds. The counter reads the number so far out of eight hundred and twenty completed measurement rounds and stops at eight hundred and twenty. Nothing larger is ever shown. Important: do not suggest that all eight hundred and twenty rounds happened after the handoff; the dots belong to the whole campaign record. Draw dots incrementally, never clear. On Android a single short vibration when it reaches eight hundred and twenty. In Calm, the baton and fill jump to their end states.

**Paste block:**
```
Lantern labels: Codex | Claude Code
Stones: Handoff | Verified disk cleanup | Recorded checkpoints
Counter: {n} of 820 completed measurement rounds
Chip: Campaign record: 820 completed measurement rounds
Button (new interface label): Hold to count the rounds
Captions (both from the copy): Beech raaste mein agent ruk gaya. File adhoori.   |   A process shouldn't depend on one operator remembering everything.
Rule: one dot = one completed measurement round in the campaign record. Counter is capped at 820.
Do NOT show 5,364, any speed-up, or any percentage.
```

**Check after it builds:**
1. At first the Codex lantern is dim with a dashed trailing line; one tap sends the baton through the three stones into Claude Code, and the dashed line turns solid.
2. Holding the button fills the rangoli outward ring by ring and the counter climbs; it stops exactly at "820 of 820 completed measurement rounds" and never goes above.
3. Count: the finished rangoli is 20 arms of 41 dots; the lantern half and the dot half are clearly separate.
4. Keyboard: Enter or Space triggers the 2.5-second fill, and the counter is read out at 820, not at every step.
5. Calm on: baton and rangoli jump to their finished state; the 44px button still works.

**If it is off:**
"In the handoff device, [describe exactly what you see, for example: the counter goes past 820 / the dots look uneven], please [change it this way], and keep the cap at exactly 820."

---

### P4.8: Lamp 5, the clock where a 06:15 flame arrives early (StoryCutoffClock)

**Say this:**
Lamp 5's device is a new component called StoryCutoffClock, in the what happened part of the PitDB card. Draw in inline SVG a round dial that works like a minute dial around six o'clock: the top is 06:00, three o'clock is 06:15, nine o'clock is 05:45, and the small word UTC in the middle. A flame glimmers at the 06:15 mark, but only when it is visible. A long cutoff hand starts at 06:00. The reader drags the hand, which snaps on release to one of three stops, 05:45, 06:00 and 06:15. The true control is a real range input with three stops directly under the dial, which the hand mirrors; keyboard, screen reader and pointer all use it. Above the dial show the label MODEL OF DOCUMENTED BEHAVIOR with its sentence. A two-button choice sets the route: Direct ingestion, the daylight-saving fold case, and Normalized UTC CSV route. In the direct case, at 06:00 the 06:15 flame is visible: a ghost flame drifts in slightly early, with a soft halo. At 05:45 it is not visible, and at 06:15 it is visible as it normally would be. In the CSV route it only appears at 06:15. Show the readouts from the paste block. Under the dial, set a calm but unmissable note: a wide marigold-edged band with a small branch icon saying the correction is not yet in the public default branch. It never animates. In Calm, the ghost flame appears steady with no drift. On Android, a tiny vibration when the hand lands on a stop.

**Paste block:**
```
Label chip: MODEL OF DOCUMENTED BEHAVIOR
Sentence (new interface label, drawn from the evidence file): A simulated cutoff, not a live database. The 06:15 UTC record, the 06:00 UTC cutoff, one direct-ingestion daylight-saving fold.
Route buttons: Direct ingestion (the fold case) | Normalized UTC CSV route
Note under routes (from the evidence file): The normalized UTC CSV route was not affected.
Readouts (new interface labels, built only from the copy sentence):
 Direct, 05:45: Cutoff 05:45. The 06:15 event is not visible yet.
 Direct, 06:00: Cutoff 06:00. The 06:15 event is already visible. It should not be yet.
 Direct, 06:15: Cutoff 06:15. The 06:15 event is visible.
 CSV route, 05:45 and 06:00: Cutoff {time}. The 06:15 event is not visible yet.
 CSV route, 06:15: Cutoff 06:15. The 06:15 event is visible.
Range input label: Cutoff time, in UTC     Spoken value: "{time} UTC"
Caption: Yaani 06:15 ki baat 06:00 par hi dikh jaati.
Unmissable note band (exact, bold): That correction is not yet reflected in the public default branch.
Keep, in the card's Fair warning, the full copy line unchanged. The Fair warning part on this card gets the same marigold-edged band treatment, steady and never animated.
```

**Check after it builds:**
1. The dial shows 06:00 at the top, 06:15 at three o'clock, and the hand at 06:00 on the direct route; the 06:15 flame is already visible as a ghost flame, with the readout "The 06:15 event is already visible."
2. Drag the hand to 05:45: the flame disappears. Release near 06:15: it snaps to 06:15 and the flame is solid. Switch to the CSV route at 06:00: the flame is not visible.
3. The range input below works with arrow keys and speaks "06:00 UTC"; the label MODEL OF DOCUMENTED BEHAVIOR is always visible.
4. The "not yet reflected in the public default branch" band is visible without scrolling past the dial, calm, and not animated, and the label above the did-next part still says Phir kya hua.
5. Calm on: ghost flame is steady, no drift.

**If it is off:**
"On the cutoff clock, [describe exactly what you see], please [change it this way], and keep the readout wording from the paste block and the label Phir kya hua."

---

## Risks and cut order

Risks (the real ones):
- Native dialog plus the evidence drawer: if the drawer is not a top-layer element it will render beneath the card. P4.3 hides the card first and restores it after, but Pack 7 must confirm openEvidence(caseId) or the evidence:open and evidence:closed events.
- 324 bulbs and 820 dots are cheap on Canvas 2D only if sprites are cached and only changing elements redraw; a single full redraw per frame on low-end Android would break 60fps. Low tier must be static.
- Tilt and 3D flip can blur text: use small angles, remove will-change at rest.
- Truth: the 820-dot fill must not imply all 820 rounds followed the handoff; the 19 flickering bulbs must not be read as 19 failed tests; Lamp 5 must not suggest a mechanism beyond the single documented DST-fold case. The interface labels marked "new" (picture-only label, exactly-3-second line, Flip the tag, Hold to count the rounds, the Lamp 5 sentence and readouts) are not in website_copy.md and need Shriniwas's read-aloud approval before publishing.

Cut order (cut from the top first, never cut the plain text, the labels or the receipt):
1. Device-tilt on Android and sheen.
2. The folded-corner peel, the three-dot thread and the garland swing.
3. Ripple on tap and the chase on the 324 bulbs.
4. The bar's elastic overshoot and the tag shimmer.
5. Ghost-flame drift and the rangoli ring-by-ring order (fill all at once).
6. Rise-from-lamp motion (fade in place).
7. Last resort: replace each device with its static end state plus the text twin; the card, three parts and receipt remain.


---

# PACK 6: THE WISH STUDIO, CARD AND SHARE LOOP

Build position: 5 of 8.

Project: EK DIYA SE DOOSRA (v2). Shriniwas speaks each "Say this" block into Emergent with Wispr Flow, then pastes the "Paste block" under it. Run the prompts in order. Every visible string comes from the copy file (website_copy.md, sections 1, 12, 13, 16) or from the short list of new functional labels in P6.1, which Shriniwas must approve before publishing.

## Pack overview

1. The wish step is a quiet writing desk at night: a lit lamp, a shelf with the five lamps and a sixth dark lamp waiting, and one floating paper card that the visitor writes on (P6.1).
2. One CardRenderer draws the card in six themes on a 1080 by 1350 canvas, with text that fits any length and any script. Themes are Diya, Rangoli, Marigold Toran, Phuljhadi Night, Akash Kandil and a plain Ink card (P6.2, P6.3).
3. The finished card floats and tilts in 3D, the sheen follows the finger or the phone, and the card catches light from the visitor's new lamp (P6.4).
4. RowFragment keeps the lamp count and an optional first name in the URL fragment only, so a forwarded link greets the receiver and the sender's lamp joins the row without any server (P6.5).
5. Export is a PNG under 300 KB, shared with Web Share first, wa.me second, plus copy, link and download, and a last pass hardens every edge case (P6.6, P6.7).

Contract notes used by every prompt below. Section ids and store keys are exactly as in the shared contract. The wish, the recipient name and the sender name live in memory only (store.wish). They are never written to the URL, local storage, session storage, cookies, console logs, event details or any network call. Events used: wish:ready (detail carries only the theme id and the card element, never any text), row:changed, fx:burst, and diya:visitorLit (listened to, not fired, by this pack). Two small additions to store.row, which stay compatible: row.base (the count that was in the link when the page opened) and row.from (the sender name that was in the link). row.count and row.name always mirror what the fragment currently says.

---

### P6.1: The desk and the paper

**Say this:**

We are building the wish step, the section with the id wish, as a quiet writing desk at night. Picture a dark wooden desk under one pool of warm lamplight. On the left, a small lit lamp. Behind it, on a shelf, the five lamps from the page, all lit, and at the right end a sixth clay lamp, still dark, waiting for the visitor. This sixth lamp is the visitor lamp. It is not the proposed lamp from the growth test, so give it its own name. In front floats one cream paper card, the composer, with a pen and a steel cup of chai beside it, steam rising slowly, and nothing else. No gifts, no sweets, no deity pictures. On the paper put the heading and every line from the paste block, word for word. Add the four idea chips as toggle buttons that only show their sentence as a gentle reminder above the writing area and never type anything for the visitor. Then the three fields with the exact labels, a large wish box that grows as they write, and a calm counter ring showing a number out of four hundred, never red. No microphone button and no speech recognition. The visitor can dictate with their own tool in any text field. Keep the privacy lines always visible under the form. Build the empty state and the ready state from the paste block. Respect Calm mode and the quality tiers. Every target is at least forty-four pixels, and focus is clearly visible.

**Paste block:**

```text
COPY (put under "wish" in src/data/copy.json, exactly as written; wrap Hinglish in lang="hi-Latn"; keep aria-labels in English)
kicker: YOUR TURN
title: Ab aapki baari
line1: Is baar soan papdi nahi, ek wish.
line2: Mere paanch diye ab roshan hain. Ab ek aur: aapka apna.
line3: Ek real insaan sochiye. Do-teen line, jo sirf aap unse keh sakte hain. Generic forward nahi.
line4: Bolkar likhiye, jaise unse baat kar rahe hon. Flow ya koi voice typing ho toh bol dijiye; nahi ho toh type bhi chalega.
line5: Deepavali ho ya na ho: koi achhi khabar, koi purani yaad, ya bas "yaad aaye". Sab chalega.
english: Write one short wish for one real person, in any language you like.
chipsHeading: Kuch idea chahiye? Chuniye (optional):
chip1: Kisi ko, jinse aap is baar mil nahi paayenge.
chip2: Kisi ko, jinhone aapko kabhi kuch sikhaya.
chip3: Kisi ko, jise aapne kabhi theek se thank you nahi kaha.
chip4: Kisi ko, jinse baat kiye bahut din ho gaye.
labelTo: Kiske liye? (pehla naam, optional)
labelWish: Aapki wish
placeholder: Jaise unse baat kar rahe hon, waise likhiye…
labelFrom: Aapka pehla naam (optional, link mein jaayega)
button: Card banaiye
privacy: Ek baat saaf: yeh page aapki wish upload ya save nahi karta; woh sirf aapke tab mein banti hai. Link mein sirf diyon ki ginti aur, agar aap likhein, aapka pehla naam hota hai. Jab aap card bhejte hain (WhatsApp ya copy), tab wish aur naam wahin tak jaate hain jahan aap bhejte hain. Bolkar likhte hain toh aapka voice tool apne niyam se chalega.
privacyEnglish: In short: this page doesn't upload or save your wish. If you send the card, it goes only where you send it.
emptyMessage: Ek line toh likhiye, phir card ban jaayega.
ready: Card taiyar hai. Jisko bhejna ho, bhej dijiye.
underCard: Yeh wish sirf is tab mein hai. Bhejna ho toh abhi bhej dijiye.
startAgain: Phir se shuru kijiye
buttonsAfterCard: WhatsApp par bhejiye | Card ka text copy kijiye | Link copy kijiye | Badlein
copied: Copy ho gaya.
copyFailed: Copy nahi ho paya. Link select karke copy kar lijiye.
cardAlt: A warm-gold card with a small lamp icon at the top, a short personal wish in the middle and the sender's first name at the bottom.

NEW FUNCTIONAL LABELS (English only, need Shriniwas's approval, nothing else is invented)
themeNames: Diya | Rangoli | Marigold Toran | Phuljhadi Night | Akash Kandil | Ink
download: Download card (PNG)
themeGroupAria: Card style
visitorLampAria: Your lamp, not lit yet

STRUCTURE
- The section element has id wish. Inside: scene (desk), then the paper form, then (later prompts) the card stage.
- Desk scene is SVG plus CSS only. Colours: desk --ground-3 to --ground-4, lamp pool a radial gradient of --flame-a at 30 percent alpha, shelf --ground-2. Five shelf lamps read store.lamps; if the store is absent show five lit lamps. The sixth lamp has id visitor-lamp (never lamp-6), dark clay, wick unlit, aria-label from visitorLampAria. Use the lamp component from the lamps pack at small size if it exists; otherwise draw a small SVG clay lamp.
- Props: one pen lying across the corner, one steel cup of chai with three slow steam wisps (CSS, opacity and translate only). Nothing else. Moth: a 14px SVG that circles the desk lamp slowly and lands on the paper corner for a few seconds; quality tier high only; removed in Calm.
- Paper: background #FFF3DC, text --ink, a 2px --kumkum rule under the heading, soft shadow. Placeholder colour at least 4.5 to 1 on the paper (use #6B5A45).
- Chips: role group, each button aria-pressed, minimum 44px high, wrapping. Pressing a chip shows its sentence in an italic reminder line directly above the wish box and focuses the wish box. Pressing it again clears the reminder. A chip never writes into the wish box.
- Fields: real label elements tied by for and id. No name attributes, no form action. The form must never submit: handle Enter and the button with preventDefault, no GET submission, because a GET would put the wish in the URL. Set autocomplete off and spellcheck false on the wish box. The wish box is a textarea, rows start at 5, grows to 40 percent of the viewport height then scrolls, minimum font size 18px, dir auto. Control or Command plus Enter presses the Card banaiye button.
- Limits: recipient and sender fields max 30 and 20 graphemes. Wish box hard cap 400 graphemes (count with Intl.Segmenter grapheme granularity, fall back to Array.from); text pasted beyond that is cut at 400 and the box shows it. Do not change field text while an IME composition is in progress (compositionstart and compositionend).
- Comfort ring: a small SVG ring beside the box with the number inside. 0 to 240 --leaf, 241 to 400 --marigold. Never red. aria-hidden; the textarea has aria-describedby pointing to a visually hidden line that says the number out of 400, updated at most once per second.
- Empty state: whitespace-only counts as empty. Pressing Card banaiye shows emptyMessage in a polite live region, returns focus to the wish box, and the desk lamp flame dips for 400ms and returns. No red, no shake.
- Ready state: card appears (P6.2 onward), ready line is announced politely, focus moves to the card stage heading-less group which has aria-label from cardAlt.
- Flame listens: when a chunk of more than 8 characters arrives in one input event (dictation or paste), the desk lamp brightens for 1.2 seconds and fx:burst kind ember fires once at the lamp, throttled to once per 6 seconds. Never show any text about this and never mention any dictation tool in the interface.
- Phone: one column, 360px minimum, the paper fills the width minus 16px gutters, the keyboard must not hide the focused box (scroll it into view using the visual viewport size).
- Calm mode: no steam, no moth, no flame reaction, no float; the desk is still, the lamp glow is fixed.
- Store: write store.wish as {to, text, from} on every input, in memory only. Never log it.
```

**Check after it builds:**
- On a 360px phone the five shelf lamps are lit, the sixth sits dark at the right end, and the paper fills the width with no horizontal scroll.
- Tapping a chip shows its sentence above the wish box and types nothing; tapping Card banaiye with an empty box shows the empty message and puts the cursor back in the box.
- Typing past 240 characters turns the ring marigold, never red; the box stops at 400.
- Tab reaches every control in reading order with a visible focus ring; chips and buttons are at least 44px tall.
- With Calm on, nothing moves on the desk: no steam, no moth, no lamp reaction. Pressing Enter in a name field does not change the address bar.

**If it is off:** Say "The [element] on the wish desk does [what you saw]. I asked for [what the prompt said]. Change only that and leave the rest of the section as it is."

---

### P6.2: The card engine, with Diya and Ink

**Say this:**

Now build the CardRenderer. One function draws the whole card on a canvas in a fixed coordinate space of one thousand and eighty wide by one thousand three hundred and fifty tall, and everything else scales that space. Keep two layers: the art layer, which is cached per theme, and the text layer, which is redrawn when the words change. The same function draws the live preview at half size and the final export at full size, so what the visitor sees is exactly what they send. Build only two themes now: Diya, a warm gold card with a small clay lamp at the top, and Ink, a plain cream paper with a thin rule and no festival marks at all. The text must fit any wish: very short wishes become large and centred, long wishes shrink in steps down to a readable minimum, lines wrap by word or by character for scripts without spaces, emoji are never split, and right to left languages read properly. Use system font stacks that cover Devanagari, Kannada, Tamil, Telugu, Bengali, Gujarati, Gurmukhi, Malayalam and Arabic. The canvas gets the card alt text from the copy, and the same words appear below it as selectable plain text. No Wispr logo, no claims, no mention of any dictation tool anywhere on the card. The paste block has the exact layout.

**Paste block:**

```text
CARD TEXT (from the copy file, section 12; lines drop out when their field is empty)
EK DIYA SE DOOSRA
{to} ke liye:
"{wish}"
— {from}
Ek diya doosre diye se. Yahan se jalaiye: {link}
One lamp lights another.
The share text and the plain-text twin use exactly these lines, with blank lines between groups, and {link} is the full link with the fragment (P6.5). The image prints the same footer line but with the site address only (host and path, no fragment), because a fragment is too long to read on a picture.

COMPONENT
- CardRenderer exports: drawArt(ctx, theme, seed), drawText(ctx, theme, content, seed), renderCard({canvas, themeId, content, scale}) and makeSeed(content).
- Logical size 1080 x 1350. Preview canvas pixel size = min(cssWidth * devicePixelRatio, 810) and ctx.scale(pixels / 1080). Cache art in an offscreen canvas per theme and scale. Typing redraws only the text layer, inside requestAnimationFrame, debounced 120ms. Await document.fonts.ready once before the first draw.
- Seed: FNV-1a hash of (to + text + from), then mulberry32. Used only for tiny decorative variation (which petals, which sparkle positions). Never stored, never sent, and the preview and the export use the same seed so they match.
- Canvas: role img, aria-label = cardAlt text. Directly below, a visible block with the plain-text twin: same lines as the card text, selectable, dir auto, with a small bottom margin.

FONT STACKS (system only, no web fonts for the card)
wish: Georgia, "Noto Serif", "Noto Serif Devanagari", "Noto Sans Devanagari", "Noto Sans Kannada", "Noto Sans Tamil", "Noto Sans Telugu", "Noto Sans Bengali", "Noto Sans Gujarati", "Noto Sans Gurmukhi", "Noto Sans Malayalam", "Noto Naskh Arabic", "Noto Sans Arabic", "Nirmala UI", "Kohinoor Devanagari", "Kohinoor Kannada", "Kohinoor Tamil", "Kohinoor Telugu", "Mukta", system-ui, "Apple Color Emoji", "Noto Color Emoji", "Segoe UI Emoji", serif
ui lines (header, footer, names): the same stack but sans-serif first: system-ui, "Noto Sans", then the Indic and Arabic fallbacks above.

LAYOUT (baselines in logical px, margins 120 left and right, wish box x 120 to 960)
- Header "EK DIYA SE DOOSRA": centred x 540, baseline 130, 34px bold, letter spacing 8px (skip spacing if ctx.letterSpacing is unsupported).
- Recipient line "{to} ke liye:" baseline textTop, 42px, centred. Dropped when empty.
- Wish box: top = textTop + 40 (or textTop - 20 if no recipient line); bottom = 1060 (or 1130 if no sender line).
- Sender line "— {from}": baseline 1120, 46px italic, right edge x 960 (left edge x 120 for right to left text). Dropped when empty.
- Footer line 1: baseline 1215, 30px, centred, text "Ek diya doosre diye se. Yahan se jalaiye: {host+path}"; shrink to fit 840px wide, minimum 24px.
- Footer line 2: baseline 1268, 30px italic, centred, "One lamp lights another."
- Art never enters the wish box.

TEXT FIT
- Add curly quotes around the wish for layout.
- Grapheme count g. Starting size: g up to 24 gives 112px; up to 60 gives 88px; up to 140 gives 68px; up to 260 gives 54px; above that 46px. Shrink in steps of 2px until the wrapped block fits the box. Minimum 30px. With a 400 grapheme cap this always fits.
- Line height 1.32; 1.5 if the text contains any character in U+0600 to U+06FF or U+0900 to U+0E7F.
- Wrap: keep the visitor's line breaks (collapse three or more blank lines to one blank line, keep at most 8 paragraphs). Within a paragraph use Intl.Segmenter with word granularity when available, otherwise split on spaces. Greedy line fill using ctx.measureText. A single word wider than the box is broken between graphemes (use Intl.Segmenter grapheme granularity, fall back to Array.from) so emoji and combined letters are never split. Trim spaces at line ends.
- Alignment: centred when g is 140 or less or when the result has three lines or fewer; otherwise start-aligned (left, or right for right to left). The text block is vertically centred in the box.
- Right to left: find the first character with the letter property; if it is in U+0590 to U+08FF, U+FB1D to U+FDFF or U+FE70 to U+FEFF set ctx.direction to rtl for the wish, recipient and sender lines. Wrap in logical order; the canvas shapes each line. Set it back to ltr after drawing.

THEMES BUILT IN THIS PROMPT (colours exact)
Diya: ground vertical gradient #F9E3B4 at 0, #F2C97E at 0.55, #E6A650 at 1. Border: rounded rectangle inset 36px, radius 28px, 4px #C2410C at 85 percent alpha; second rectangle inset 52px, 2px, 45 percent alpha. Lamp icon centred at x 540: clay bowl, lower half of an ellipse centre (540,235), rx 100, ry 62, fill #C2410C; rim ellipse rx 100, ry 14, fill #A33A0A; oil ellipse inside rx 84 ry 9 fill #6B2A06; wick 4px by 14px at the rim centre; flame teardrop from y 222 up to y 112, width 54, gradient #FFB347 at the base to #FFD27A at the tip, inner core ellipse #FFF3DC; glow radial gradient radius 220 from #FFD27A at 55 percent alpha to zero. Text ink #3A1E0C; header and names #3A1E0C; footer #5A3414. textTop 420.
Ink: ground #FFFBF2 flat. Hairline rule 2px #16110C at x 120 to 960, y 170. Second rule at y 1170 the same. No motifs, no glow, no colour. Text #16110C; footer #4A3F33. textTop 250. The Ink theme also switches off every festival effect elsewhere (no bursts).
Theme record shape: {id, label, ground, ink, accent, textTop, drawArt}.
```

**Check after it builds:**
- Type "Yaad" and the word appears huge, centred and sharp on the Diya card; type four hundred characters and the text shrinks but stays inside the box.
- Paste a Hindi, a Tamil and an Arabic sentence: letters look joined and correct, Arabic starts on the right, nothing is clipped.
- Paste three flag and family emoji in a row: none is cut in half at a line break.
- The plain-text twin below the card matches the card word for word and can be selected; the canvas has the alt text.
- With Calm on, the card appears instantly and the preview still redraws as you type.

**If it is off:** Say "On the [theme] card, [what you saw] when the wish is [the case you typed]. I asked the text to fit inside the box and never be cut. Fix only the text fitting."

---

### P6.3: Four more themes and the swipe

**Say this:**

Now add the other four card themes, each drawn on the canvas, no pictures and no libraries. Rangoli is cream paper with a ring of dots and a symmetric flower pattern at the top. Marigold Toran is a deep green night with three hanging garlands of marigolds and mango leaves across the top. Phuljhadi Night is almost black with two or three starburst sparklers in gold. Akash Kandil is an indigo evening sky with one glowing paper star lantern hanging from a string. The exact colours and shapes are in the paste block. Art must never touch the writing area, and the text must stay clearly readable on every theme. The visitor changes theme by swiping the card sideways, and also by tapping six style dots under the card, or pressing the left and right arrow keys when the card has focus. Vertical scrolling must still work on the card. When the theme changes, the old card slides a little and fades while the new one arrives, and a tiny matching puff of effect plays: petals on the toran, a spark on the sparkler, a twinkle on the lantern. Ink and Calm mode get no effects and no slide, only an instant swap.

**Paste block:**

```text
ORDER: Diya, Rangoli, Marigold Toran, Phuljhadi Night, Akash Kandil, Ink. Default Diya. Theme ids: diya, rangoli, toran, phuljhadi, kandil, ink.

RANGOLI (ground #FFF3DC flat; textTop 460; text #16110C; footer #7C2D0A)
- Pulli border: dots radius 5, spacing 54px, along a rectangle inset 60px, colour #C2410C at 55 percent alpha, skipping the header area.
- Medallion centre (540, 240): ring radius 112, 6px #C2410C. Eight petals as lens shapes (two arcs), length 104 from the centre, width 44, fill #F5A623, stroke #C2410C 3px, rotated every 45 degrees. Eight smaller petals, length 70, width 26, fill #2F6B4F, rotated 22.5 degrees plus every 45 degrees, drawn first. Centre disc radius 22 #C2410C with a radius 10 disc #FFF3DC. Sixteen dots radius 5, #2F6B4F, on radius 138. The seed swaps some big petal fills between #F5A623 and #E8890C.
- Bottom band at y 1296: fifteen diamonds, 30px, alternating #C2410C and #F5A623, order nudged by the seed.
- No footprints, no figures.

MARIGOLD TORAN (ground vertical #10231A to #0C1A13; textTop 430; text #FFF3DC; names #FFD27A; footer #E8D5B0)
- Three swags: each runs between x 0 and 360, 360 and 720, 720 and 1080, quadratic curve from (x0, 70) with control (middle x, 250) to (x1, 70), cord 4px #CDB894.
- On each swag seven marigolds placed at equal steps along the curve: ten petals (circles radius 14 at radius 22 round the centre) alternating #F5A623 and #FFB347, centre disc radius 16 #C2410C. Seed picks which are #E8890C.
- Between flowers, a mango leaf hanging straight down, length 70, width 30, two curved edges, fill #2F6B4F, midrib 2px #1F4A36.
- Nothing below y 330.

PHULJHADI NIGHT (ground vertical #0E0B14 to #1A1226; textTop 400; text #FFF3DC; names #FFD27A; footer #E8D5B0)
- Burst A centre (230, 250), radius 170. Burst B (840, 190), radius 140. Burst C (960, 330), radius 70. Each burst: 72 strokes (36 for C) from the centre outwards, angle evenly spaced plus seed jitter, length radius times 0.35 to 1, 3px wide round caps, gradient from #FFF3DC at the centre to #FFB347 at the tip with alpha 0.9 falling to 0.3, a 3px dot #FFD27A at each tip. Core glow radial radius 44 from #FFF3DC to zero. A thin stick (6px, #8A7A66) from each centre down and to the left, 120px.
- 40 tiny four point twinkles (size 6 to 14, #FFD27A, alpha 0.4 to 0.9) placed by seed only where x is under 70, or x over 1010, or y over 1240. No blur filters. Use radial gradients for glow, never shadowBlur.

AKASH KANDIL (ground vertical #0F1530 at 0, #2A1A3F at 0.7, #4A2438 at 1; textTop 520; text #FFF3DC; names #FFD27A; footer #E8D5B0)
- String 3px #CDB894 from (540, 0) to (540, 130).
- Star centre (540, 260): eight points, outer radius 130, inner radius 62. Left half of each point #FFB347, right half #E8890C. Inner octagon radius 48 #FFF3DC at 90 percent alpha. Glow radial radius 200 from #FFD27A at 50 percent alpha to zero.
- Tassel: three lines length 50, from y 392 to 442, #F5A623, at x 520, 540, 560.
- 24 four point twinkles by seed in the top 300px left and right of the star and along the edges, size 6 to 14, alpha 0.5 to 0.9.
- Header sits over the sky with enough contrast; move the header 40px higher if it collides with the string.

SWITCHING
- Wrapper touch-action pan-y. Pointer events: track dx and dy; a swipe is |dx| above 48px with |dx| above 1.5 times |dy|, or speed above 0.4px per millisecond. Left swipe goes to the next theme, right swipe to the previous. No wrap around: at the ends the card nudges 12px and returns.
- Six dots under the card as a radiogroup (aria-label from themeGroupAria), 44px hit area with a 10px visible dot, each with its theme name as a visible tiny label on focus and as aria-label. Arrow keys on the focused card or on a dot move the choice. The current theme name is announced politely.
- Transition: old card translateX 40px and opacity to 0 in 160ms; new card from -40px in 220ms. Calm or quality low: instant swap.
- Micro bursts (tier mid and high, never in Calm or Ink): toran fx:burst petals at the top centre of the card; phuljhadi spark; kandil twinkle; diya ember; rangoli none. Coordinates are viewport pixels of the card top centre.
- Android only, optional: navigator.vibrate(8) on a completed swipe, not in Calm.
- Art is cached per theme and scale, so a swipe draws each theme art once.
```

**Check after it builds:**
- Swiping the card left and right on a phone cycles through six themes; scrolling the page up and down still works when the finger starts on the card.
- Each theme keeps the wish clearly readable, and no art overlaps the writing area, even at four hundred characters.
- The six dots are at least 44px to tap, and the left and right arrow keys change the theme on a focused card.
- Marigold Toran shows petals, Phuljhadi Night shows a spark, Akash Kandil a twinkle, and Ink shows nothing at all.
- With Calm on, theme changes are instant and no effect fires.

**If it is off:** Say "The [theme] card has [what you saw]. The paste block says [the line you remember]. Change only that theme and nothing else."

---

### P6.4: The floating card and the lighting moment

**Say this:**

Now make the finished card feel like a real paper card lit by the visitor's own lamp. Put the preview canvas inside a card holder that floats gently, a slow rise and fall with a tiny sideways turn. The card tilts in three dimensions toward the finger on a phone, toward the pointer on a computer, and on Android toward the way the phone is tilted, up to about nine degrees. A soft light sheen slides across the paper to follow, and when nobody touches it the sheen rests in the direction of the lamps. A blurred shadow on the desk moves the opposite way. Then the lighting moment, when the card is made: the card starts dim, a small ember travels from the desk lamp to the dark visitor lamp on the shelf, that lamp catches a small flame, and warm light sweeps across the card from that side while the dimness lifts. The wish then appears as if written in wet ink, left to right. Finish by firing the wish ready event with the theme id and the card element only, never any words. Calm mode shows the final state instantly and keeps everything still.

**Paste block:**

```text
STRUCTURE
- .card-stage > .card-shadow + .card3d (perspective 900px) > .card-body > [art canvas, text canvas, .sheen, .dim, .edge-light]. The card body has aspect ratio 4 to 5 and width min(86vw, 360px, 70vh * 0.8).
- Text canvas sits above the art canvas. Export (P6.6) draws both layers into one canvas separately; the preview keeps them separate so the ink reveal can animate.

IDLE FLOAT
- translateY from 0 to -6px and rotateZ from -0.4 to 0.4 degrees, 6 seconds, ease-in-out, infinite. Paused when the card is off screen (IntersectionObserver) and when the tab is hidden. Off in Calm.
- If a floating card physics handler from the fireworks pack answers the wish:ready event, remove the CSS float and let it take over. Otherwise keep the CSS float.

TILT
- Transform only (rotateX, rotateY, translateZ), updated in requestAnimationFrame, smoothing: current moves 12 percent of the way to the target each frame.
- Pointer or touch: target rotateY = (x - 0.5) * 18 degrees, target rotateX = (0.5 - y) * 18 degrees, x and y relative to the card from 0 to 1. On pointerleave or touchend ease back to 0 over 400ms.
- Device tilt, Android only: use the deviceorientation event only if DeviceOrientationEvent exists and has no requestPermission function (so iOS never asks, and stays pointer only). rotateY = clamp(gamma * 0.25, -9, 9); rotateX = clamp((beta - 50) * 0.2, -9, 9), with a 1 degree dead zone and 10 percent low-pass smoothing. Listen only while the card is visible; remove listeners when it leaves view, in Calm and at quality low.
- Calm: no tilt, no float, no sheen motion. Quality low: no tilt from tilt sensors, no sheen motion, static highlight.
- A horizontal swipe for theme change (P6.3) and the tilt can happen together; the tilt must not block the swipe.

SHEEN
- Layer .sheen: linear-gradient(110deg, transparent 35%, rgba(255,243,220,0.28) 50%, transparent 65%), background-position driven by CSS variables --sx and --sy (percent), plus a faint radial highlight at the pointer. Pointer events none.
- At rest: --sx 85%, --sy 0% (light from the shelf lamp, upper right).
- Theme Ink: sheen at half strength.

SHADOW
- .card-shadow is a pre-blurred radial gradient ellipse under the card (no CSS blur filters), opacity 0.35, moving opposite to the tilt by up to 14px.

LIGHTING MOMENT (runs once each time a card is made, about 1.4 seconds)
- 0 ms: .dim overlay black at 28 percent alpha on the card. Card art and text are in place; text canvas clipped to zero width for the ink reveal.
- 200 ms: a small ember dot (CSS transform only) travels from the desk lamp to the visitor-lamp in 400ms, and fx:burst kind ember fires at the visitor-lamp on arrival; visitor-lamp flame scales from 0 to 0.6 and stays at that half-lit stage (the full lighting happens later when diya:visitorLit arrives).
- 600 ms: warm radial light (rgba(255,210,122,0.35)) sweeps from the upper right corner across the card in 600ms while .dim fades to 0; .edge-light on the right edge brightens then settles to 20 percent.
- 700 ms: wet ink reveal: the text canvas clip animates from 0 to full width in 900ms, left to right (right to left for right to left text).
- 1400 ms: dispatch wish:ready with detail {themeId, el: the card element}. Never include text or names in the detail.
- Do not change store.tone or litCount here.
- Calm: skip everything; show final state; still dispatch wish:ready.
- Quality tiers: low skips the ember, the sweep and the ink reveal (instant), mid keeps sweep and reveal, high adds everything.
- Pressing Badlein (edit) puts the card back and un-dims it; making a card again replays the moment, but at most once every 3 seconds.
- Haptics, Android only: navigator.vibrate(12) once when the ink reveal ends, not in Calm, and only because the visitor pressed Card banaiye.
```

**Check after it builds:**
- Press Card banaiye: the card appears dim, a small ember travels to the dark lamp on the shelf, that lamp catches a small flame, light sweeps across the card, and the words write themselves left to right.
- Drag a finger over the card on a phone: it tilts toward the finger and the sheen follows; lift the finger and it settles smoothly.
- On an Android phone, tilting the phone slowly tilts the card a little, never past about nine degrees; on an iPhone no permission prompt appears.
- Scroll the page: the page still scrolls smoothly and the card keeps its frame rate.
- With Calm on, the card appears at once in its final lit state with no float, no tilt, no sweep and no ink reveal.

**If it is off:** Say "During the lighting moment, [what you saw] happens at [when]. I wanted [the step from the paste block]. Fix only that step and leave the other steps."

---

### P6.5: The row in the link

**Say this:**

Now build RowFragment, the lamp count that lives only in the part of the web address after the hash sign. The format is the letter v and the number one, then the lamp count written in base thirty-six, then an optional first name, separated by dots. The paste block has the parser, the name cleaner and the writer. Rules: the name keeps letters only, at most twenty, and is always shown as plain text. The count shows as ninety-nine plus when large. When someone opens a forwarded link, the opening shows a small banner using the copy lines, with the name or without it, and the English fine print saying this number is written inside the link and is not a visitor count. Below it a tiny row of lamps lights one after another, up to twelve lamps and then a plus number, with the visitor's own dark socket at the end. If the link is garbled, show the bad link line and start the row at zero. When the visitor's lamp is lit, the diya visitor lit event arrives, and the count goes up by one once, the address bar fragment is rewritten without reloading, and the last lamp lights as a flame travels from the lamp before it.

**Paste block:**

```text
FORMAT:  #v1.<count in base 36>.<first name>      the name part is optional; "#v1.7" and "#v1.7.Asha" are both valid
- Count: 1 to 3 characters from 0-9 a-z, case-insensitive. Value 0 to 46655. Written lowercase.
- Name: percent-encoded UTF-8. After decoding: normalise to NFC, remove everything that is not a letter or a combining mark, keep at most 20 graphemes. Hyphens and apostrophes are removed (Mary-Ann becomes MaryAnn); joiner characters are removed.
- Rendered only with textContent, never as markup. The name is not verified; say nothing more about it than the copy does.

REFERENCE CODE (copy as written)
const NAME_MAX = 20;
function sanitiseName(raw) {
  let s = String(raw || '');
  try { s = s.normalize('NFC'); } catch (e) {}
  s = s.replace(/[^\p{L}\p{M}]/gu, '');
  const parts = (typeof Intl !== 'undefined' && Intl.Segmenter)
    ? Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(s), x => x.segment)
    : Array.from(s);
  return parts.slice(0, NAME_MAX).join('');
}
function parseRowHash(hash) {
  const h = String(hash || '').replace(/^#/, '');
  if (!/^v/i.test(h)) return { kind: 'none' };          // empty or an ordinary anchor like #wish: say nothing
  if (h.length > 240) return { kind: 'bad' };
  const p = h.split('.');
  if (p[0] !== 'v1' || p.length < 2 || p.length > 3) return { kind: 'bad' };
  if (!/^[0-9a-z]{1,3}$/i.test(p[1])) return { kind: 'bad' };
  const count = parseInt(p[1].toLowerCase(), 36);
  let name = '';
  if (p[2]) { try { name = sanitiseName(decodeURIComponent(p[2])); } catch (e) { return { kind: 'bad' }; } }
  return { kind: 'ok', count, name };
}
function formatRowHash(count, name) {
  const c = Math.max(0, Math.min(46655, Math.floor(count) || 0));
  const n = sanitiseName(name);
  return '#v1.' + c.toString(36) + (n ? '.' + encodeURIComponent(n) : '');
}
function shownCount(n) { return n > 99 ? '99+' : String(n); }
function plusBeyondTwelve(n) { return n > 99 ? '87+' : String(n - 12); }   // show only when n > 12

STATE
- At boot parse location.hash once. ok: store.row = { count, name, base: count, from: name }. bad: show the bad link line, store.row = { count: 0, name: '', base: 0, from: '' }. none: the same as bad but silent.
- Outgoing link (card, copy link): origin + pathname + search + formatRowHash(base + 1, sender name). The sender name comes from the sender field, sanitised with the same function. If the visitor lamp is already lit it uses the current count, never adds twice.
- diya:visitorLit (idempotent; ignore after the first one): store.row.count = min(base + 1, 46655); store.row.name = sanitised sender name; set store tone to 6 only if nothing else has; history.replaceState(null, '', pathname + search + formatRowHash(...)) (never assign location.hash, so no scroll jump and no history entry); dispatch row:changed with detail {count, name, lit: true}.
- When the sender field changes after the lamp is lit, rewrite only the name in the fragment and dispatch row:changed.
- hashchange: if the new fragment starts with v, re-parse and update row.base; if it is some other anchor (the page's own links to #wish, #closure and the rest), let the browser scroll, then restore the row fragment with replaceState so the link in the address bar stays correct. Internal links should prefer scrollIntoView so the hash is untouched.
- Copy link and the card always use the store, never location.href.

OPENING BANNER (insert above the main headline inside #night, only when kind is ok and count is 1 or more)
- With a name: {name} ne yeh link bheja. Link mein likhi ginti: {N} diye.
- No name: Kisi ne yeh link bheja. Link mein likhi ginti: {N} diye.
- Small English line always below: This number is written inside the link. It is not a visitor count and is not verified.
- {N} is shownCount(count). Bad link: show "Link thoda alag lag raha hai. Koi baat nahi, row yahin se shuru hoti hai." in the same place. Count 0 or none: no banner.

VISUAL ROW
- Tiny lamps, 16px wide, 4px gap. Up to 12 lit lamps, then a small "+" pill with plusBeyondTwelve(N), then the visitor socket (dark, dashed outline). Whole row fits inside 328px. Row is aria-hidden; the banner or caption text is its twin.
- Cascade: lamps light 70ms apart on first view (instant in Calm and quality low). Flames flicker out of phase, 3s loops, off in Calm and at quality low.
- Mount points: the opening (variant banner), under the card in #wish (variant wish), and any element with the attribute data-row-mount (the closure uses it: variant closure). Expose RowFragment.mount(el, variant).
- Closure caption (variant closure), N is the count that was in the link (row.base), shown with shownCount: 
  N 2 or more: {N} diye pehle se. Aakhir mein aapka.
  N = 1: Ek diya pehle se. Aakhir mein aapka.
  N = 0: Yeh row aapse shuru hoti hai.
  Under it, always: This number is written inside the link. It is not a visitor count and is not verified.
- Visitor lamp lighting: on diya:visitorLit the flame travels from the lamp before it to the socket in 600ms (fx:burst kind spark at the socket); the socket fills and glows a little brighter than the others. Calm: it simply becomes lit. The alt text for the final row: "A long row of lit lamps, with the newest lamp at the right end glowing a little brighter."
```

**Check after it builds:**
- Open the page with the address ending in #v1.7.Asha: a banner says Asha ne yeh link bheja with 7 diye, the English fine print is under it, and seven tiny lamps light one after another with a dark socket at the end.
- Open it with #v1.-5 or #v2.3: the bad link line shows and the row starts at zero; opening it with #wish shows nothing extra.
- Open it with a count of 100 or more: the banner says 99+ and the row shows twelve lamps and a plus pill.
- Fire the lit event from the console or reach the closure: the address bar changes to count plus one without a reload and without scrolling, and the last lamp lights with a travelling flame.
- With Calm on, the lamps and the visitor lamp appear lit instantly, with no cascade.

**If it is off:** Say "For the link [paste the exact link], the page shows [what you saw]. I wanted [what the paste block says for that case]. Fix only the link handling."

---

### P6.6: Send it: PNG, share, copy, download

**Say this:**

Now the export and the sharing. When the card is ready, quietly make a final picture in the background, one thousand eighty by one thousand three hundred fifty pixels, as a PNG that should stay under three hundred kilobytes. If it is bigger, redraw it with simpler glows and, as a last step only, a smaller four by five size. Keep that picture ready, so the share can start in the same tap. Under the card show the action buttons from the copy: WhatsApp par bhejiye as the big warm button, then copy card text, copy link, a download button, and Badlein. WhatsApp par bhejiye first tries the phone's native share with the picture and the text. If the visitor closes the share sheet, do nothing and say nothing. If native share with files is not available, open a WhatsApp message with the text only, in a new tab, and only because they tapped. If that is blocked, fall back to copying. Never send anything without a tap. The paste block has the chain and the messages.

**Paste block:**

```text
EXPORT
- Offscreen canvas exactly 1080 x 1350, device pixel ratio ignored, drawn by CardRenderer art then text in one pass at scale 1.
- toBlob('image/png'). Produce it right after the lighting moment, with requestIdleCallback (fallback setTimeout 400ms), and cache the File keyed by theme, to, text, from. Invalidate on any change.
- Size guard: if blob.size is over 307200 bytes, redraw in lean mode (glows as 8 flat concentric circles instead of gradients, half the strokes on Phuljhadi Night, no stars), try again; if still over, draw at 864 x 1080 (same 4 to 5 ratio). Accept whatever results after that, never block sharing because of size.
- No grain, no noise, no photo, no canvas shadows, no shadowBlur. Flat colours and clean gradients compress best.
- File name: ek-diya-se-doosra-card.png (never the visitor's words). type image/png.
- No metadata, no name in the filename, no text beyond what the card prints.

BUTTONS (labels exactly from the copy; each has an English aria-label; 44px minimum height)
- Primary (full width, --marigold fill, --ink text): WhatsApp par bhejiye
- Two column grid: Card ka text copy kijiye | Link copy kijiye | Download card (PNG) | Badlein
- Under them the underCard line, and a small text button Phir se shuru kijiye.
- One polite status line (aria-live polite) for messages; it clears after 6 seconds.

SHARE TEXT = the card text from P6.2 with {link} = full outgoing link (P6.5), lines separated by blank lines.

WHATSAPP PAR BHEJIYE CHAIN (all in the click handler)
1. Use the cached File. If there is none yet, await the export (Android Chrome keeps the gesture; iOS Safari might not).
2. If navigator.canShare exists and navigator.canShare({ files: [file] }) is true: await navigator.share({ files: [file], text: shareText }).
   - Resolved: success. Fire fx:burst kind lantern from the card centre (tier mid and high only, once per 3 seconds). No message.
   - Rejected with name AbortError (the visitor closed the sheet): do nothing, no message, button ready again.
   - Rejected for any other reason: continue to step 3.
3. Text only: if the encoded text is 1800 characters or shorter, window.open('https://wa.me/?text=' + encodeURIComponent(shareText), '_blank', 'noopener'). Never assign location, so the page and its history stay put. If window.open returns null, continue to step 4.
4. Copy the share text (below). Show copied or copyFailed.
- Never call share, open or copy without a tap. Nothing happens on load or on theme change.

COPY
- Card ka text copy kijiye copies shareText; Link copy kijiye copies only the outgoing link.
- Try navigator.clipboard.writeText; if missing or rejected, try a hidden textarea with document.execCommand('copy'); if that fails, reveal a visible read only textarea holding the text, selected, with copyFailed shown. Success shows copied and fires nothing else.

DOWNLOAD
- Create an object URL from the PNG, click an anchor with download set, revoke the URL after 10 seconds. If the download attribute is unsupported, open the object URL in a new tab so the visitor can press and hold to save.

PLATFORM NOTES (build for these, do not detect with the user agent unless needed)
- Android Chrome: share with files works and WhatsApp shows the picture with the text as its caption.
- iOS Safari: share with files works only if called right after the tap, so keep the file cached; WhatsApp may keep the picture and drop the text, which is why Link copy kijiye stays visible, and the picture footer carries the site address.
- In app browsers and desktop browsers without file share go straight to step 3.

PRIVACY
- The wish enters a wa.me address only on the visitor's tap, and only when file share is unavailable; this matches the privacy line (WhatsApp or copy). It is never written to this page's address, history, storage or any other request.
- The card and the share text carry no Wispr logo and no claim of any kind, and never mention how the wish was written.
```

**Check after it builds:**
- On an Android phone, tapping WhatsApp par bhejiye opens the system share sheet with the card picture attached; closing the sheet leaves the page exactly as it was, with no message.
- On a desktop browser without file share, the same button opens a WhatsApp message in a new tab with the card text; nothing opens until the tap.
- Card ka text copy kijiye and Link copy kijiye show "Copy ho gaya."; with clipboard permission blocked, a selectable box appears and "Copy nahi ho paya. Link select karke copy kijiye." shows.
- Download card gives a PNG named ek-diya-se-doosra-card.png, 1080 by 1350, under 300 KB for each of the six themes (check the file size).
- With Calm on, no lantern effect fires after sending, but every button still works.

**If it is off:** Say "When I tap [button] on [device or browser], [what happened]. The paste block says [the step]. Fix only that step."

---

### P6.7: The receiving side and the edge cases

**Say this:**

Last pass for this pack: close the loop and harden it. When someone opens a forwarded link on a phone, the first thing they must see is the banner and the little row that tells them a real person lit a lamp before them, then the page as normal. When they reach the wish step, the same row appears under the card area with its dark socket at the end, ready for their own lamp. The card image itself arrives in the chat, because the page never knows the wish. Now check every edge case in the paste block. For each one, make the page behave as written, without adding any new words except the ones already in the copy. Do not add any error wording. Test with the sample links in the list, each with Calm on and off, and with the long, short, emoji and right to left wishes. Fix only what does not match, and do not change copy, colours or anything else. At the end, search the whole project for the wish, the recipient name or the sender name being logged, stored, put in a URL or sent in any request, and report what you find.

**Paste block:**

```text
SAMPLE LINKS (append to the page address) → expected
#v1.7.Asha → banner "Asha ne yeh link bheja. Link mein likhi ginti: 7 diye." + row of 7
#v1.0 → no banner, caption "Yeh row aapse shuru hoti hai."
#v1.1 → caption "Ek diya pehle se. Aakhir mein aapka."
#v1.z → 35 diye
#v1.2s.Priya → 100 in base 36 is 2s → banner shows 99+
#v1.7.A1sha → name Asha
#v1.7.%E0%A4%85%E0%A4%A8%E0%A4%BF%E0%A4%A4%E0%A4%BE → name अनिता
#v1.7.Averylongnamethatgoesonandon → name Averylongnamethatgoe (20)
#v1.7.%3Cb%3EX → name bX (letters only; rendered as plain text)
#v1.7.Asha.extra → bad link line, row at zero
#v1.-5 → bad link line
#v1.9999 → bad link line (too many digits)
#v2.3.x → bad link line
#v1. → bad link line
#wish or empty → silent, row at zero
#v1.7.%E0%A4 → bad link line (broken percent code)

EDGE CASES
- Empty or whitespace-only wish: emptyMessage in the live region, cursor back in the box, no card.
- Huge wish: cut at 400 graphemes on paste; card text shrinks to fit; typing stays smooth (redraws debounced).
- Emoji, flags, family emoji, skin tones: never split across lines; counter counts one per emoji.
- Right to left (Arabic, Urdu, Hebrew): reads right to left, wraps properly, sender line at the left edge.
- Mixed scripts in one wish (Devanagari + Latin + Tamil): all draw; the plain-text twin matches.
- A single very long word or web address with no spaces: broken between graphemes inside the box.
- Short wish (one word or one emoji): large and centred.
- Recipient longer than 30 graphemes: field cuts it; the line shrinks to fit 840px.
- Sender name with digits or symbols: the card prints the cleaned name (letters only), the link carries the same.
- Share cancelled: no message, no state change. Clipboard blocked: selectable box + copyFailed.
- Popup blocked on the text-only route: falls to copy.
- Android versus iOS: Android shares picture with caption; iOS needs the cached file and may drop the text, so Link copy kijiye remains visible. iPhone has pointer-only tilt and no permission prompt.
- Visitor goes back and edits: Badlein returns to the paper with every field intact in memory; the card remakes when they press the button again; the lighting moment replays at most every 3 seconds; making a second card never adds a second lamp.
- Browser Back leaves the page (no history entries are pushed). Reload clears the wish; the address keeps its fragment, so a reload plus lighting can raise the count by one again. The count is not verified, which the English line says.
- Phir se shuru kijiye clears wish, names and chips from memory, keeps the lit lamp and the count.
- Landscape phone and 320px wide: the card scales to fit, buttons wrap, nothing is clipped.
- Offline: everything except opening WhatsApp or the share sheet still works.
- Keyboard: Tab order is chips, fields, button, then card, style dots, action buttons; Escape does nothing special.
- Calm on: no animation anywhere in the wish step; all final states are shown.

PRIVACY SWEEP (report, do not fix silently)
- Search for any use of localStorage, sessionStorage, cookies, indexedDB, fetch, XMLHttpRequest, sendBeacon, console.log, history.pushState, form actions, and any event detail that carries the wish or a name.
- The only places the wish may leave memory: the file share (the user's chosen app), the wa.me address on a tap, the clipboard on a tap, and the downloaded image on a tap.
```

**Check after it builds:**
- Open the page with #v1.7.Asha on a 360px phone: the banner, fine print and seven lamps show before anything else, and the rest of the page is unchanged.
- Run through every sample link in the list: each one produces the expected banner, caption or bad link line.
- Make a card, press Badlein, change one word, make it again: the text on the card updates, the count in the link is still only one more than the opening count.
- A wish in Arabic, a wish made only of an emoji, and a 400 character wish each make a clean card that fits.
- The privacy sweep report shows no storage, no network calls and no logging of the wish or names, and with Calm on nothing animates.

**If it is off:** Say "For [the sample link or case], I see [what happened]. The paste block expects [expected]. Fix only that case."

---

## Risks and cut order

Main risks, most serious first.
1. Time and scope: this is a large pack. The riskiest parts are the text fitting across scripts and the 300 KB PNG. If the build is behind, protect the loop first: P6.1, P6.2 with Diya and Ink, P6.5 and P6.6.
2. Contract gap: nothing in the shared contract says who fires diya:visitorLit. This pack only listens. If pack 7's closure does not fire it, the count will not rise and the last lamp will not light. The card link already carries count plus one, so a sent card is still right.
3. Anchor conflict: the contract section ids are plain anchors, and a click on one would overwrite the row fragment in the address bar. P6.5 restores it with replaceState and uses the store as the source of truth for outgoing links.
4. Interpretation: the "lighting moment" half-lights the dark visitor lamp during the wish step; full lighting and tone 6 are left to the closure event. The "any good news mode" is delivered as the Ink theme plus the copy line, not as a separate switch.
5. Share differences: iOS may drop the caption when a picture is attached, and WhatsApp may truncate very long wa.me texts. The link copy button and the site address in the picture are the safety nets.
6. Honest limits: a reload plus a new lighting can add one to the count; the name in a link can be typed by anyone; a hostile link can only carry a count and plain letters. The English line already says the number is not verified.
7. Labels: theme names, "Download card (PNG)" and the aria-labels are new English strings that need Shriniwas's approval.

Cut order, first to cut first.
1. The moth, the chai steam and the ember on text arrival (delight only).
2. Device tilt on Android (keep the pointer and finger tilt).
3. The lantern after sending and the theme micro bursts.
4. Akash Kandil, then Phuljhadi Night (keep Diya, Rangoli, Marigold Toran, Ink).
5. The wet ink reveal and the sweep of the lighting moment (keep the half-lit visitor lamp).
6. The cascade on the visual row (keep the row itself).
Never cut: the plain-text twin, the privacy lines, the Ink theme, the empty and ready states, the fragment parser and sanitiser, the share chain, the Calm mode behaviour.


---

# PACK 7: NARRATIVE SECTIONS AND CLOSURE

Build position: 6 of 8.

## Pack overview

1. Eight prompts, run in order P7.1 to P7.8, after Pack 6 (wish studio) and before Pack 5 (fireworks). Each one builds one section or overlay and reads every visible word from src/data/copy.json.
2. Everything here is slow, warm and handmade: blueprint lines for the lamp that never lights, a window with a diya on a sill, paper and ink for the verdict, a flame you drag through your own words, and one calm lamp lit at the end of the row.
3. Gated lines are real flags in copy.json (first sentence of the person block, the recorded Flow-into-Emergent line, the no-analytics footer line, the lamp six language line) plus two empty fields (recording link, how this page was made). Default: nothing unconfirmed shows.
4. Overlays (sixty sheet, evidence drawer) are native modal dialogs, open from buttons or from two small events, and never write to the URL fragment, which belongs to the lamp count and first name.
5. Paste blocks hold all verbatim copy, ids and event names, so Wispr Flow never has to transcribe Hinglish, numbers or the two Flow takes. Speak the "Say this" part, paste the block. Wrap visible Hinglish in lang hi-Latn throughout, keep it out of aria labels.

---

### P7.1: Lamp six, drawn as a sketch (plus the gate flags)

**Say this:**
First, add the flags block from the paste block to copy dot json. Everything unconfirmed stays hidden until I flip a value.

Now build lamp six, the proposed one, at the section id in the paste block. It must never light, so it has to look like a different kind of object, not a dimmer lamp. My five real lamps are warm clay with glow. Lamp six is a sketch: an unlit diya drawn as thin blueprint lines on the dark ground, no fill, a dashed outline, a faint grid behind it, a dash-dot centre line, little dimension ticks around the bowl, and a dotted outline where a flame would be. Set it apart from the row with extra space and a dashed rule. Above it, a badge in plain text with a dashed border that says PROPOSED, NOT RUN. Then the kicker, the heading, the idea in two short paragraphs, two small index cards for the variants, the optional language line, the Fair warning and one button, all word for word from the paste block. Tapping, holding or pressing Enter on the lamp must never light it. A tiny spark appears at the wick, fades in half a second, and the line Yeh diya abhi nahi jalega appears below as polite status text. It must not touch the lit count, the tone or the lamps in the store. When it scrolls into view it draws itself once, line by line; with Calm or reduced motion it just appears. The button opens the evidence drawer at the growth test folder.

**Paste block:**
```text
FLAGS to add to copy.json (keep key names exactly):
"flags": {
  "_note": "Gates for lines not yet confirmed by Shriniwas. Change a value, nothing else.",
  "ledgerGate_personFirstSentence": false,
  "flowIntoEmergentRecorded": false,
  "noAnalyticsLine": false,
  "lamp6LanguageLine": false
},
"voice": { "recordingLink": "" },
"footer": { "howMade": "" }

SECTION ID: lamp-6   (the contract id is lamp dash six)
Store: read only. Lamp six never changes litCount, lamps or tone.
Evidence drawer hook: button carries data-evidence="c8"

KICKER: LAMP 6 · PROPOSED, NOT RUN
BADGE: PROPOSED, NOT RUN
HEADING: Yeh diya abhi bujha hai

THE IDEA (label): The idea
Paragraph 1: For India growth, I'd test whether a Hinglish-first demo for students and early-career users beats a speed-focused pitch on first usable dictations and a second dictation within a day. Proposed, not run.
   (bold: "Hinglish-first demo for students and early-career users", "first usable dictations", "a second dictation within a day", and the last "Proposed, not run.")
Paragraph 2: Shuruaat ek chhote group se: jo log sach mein Hindi-English mein messages likhte hain. I would not assume every Indian student uses Hinglish.

INDEX CARD A: Variant A, speed: "Say the message. Skip typing it."
INDEX CARD B: Variant B, expression: "Don't stop the thought halfway through. Say it naturally."

OPTIONAL LINE (render only if flags.lamp6LanguageLine is true): Other languages deserve their own test; this one speaks only for Hindi-English.

FAIR WARNING (label): Fair warning
Text: This test has not been run, and no result is claimed. Koi sample, koi lift, koi number nahi.

BUTTON: SEE THE GROWTH TEST

WHEN THE VISITOR TRIES TO LIGHT IT (polite live region): Yeh diya abhi nahi jalega. Test chala nahi. Bujha hua, par imaandaar.

LAMP BUTTON accessible name (English): Lamp 6, proposed and not run. It stays unlit.
No thresholds, sample size or expected result anywhere on this card.
```

**Check after it builds:**
- At 360 px width the sketch lamp reads as a drawing (outline only, dashed, grid) and is clearly not the same kind of object as lamps one to five.
- The PROPOSED, NOT RUN badge is plain text, readable, and has a dashed border.
- Tap, press and hold, and Enter on the lamp each show the spark and then the status line, and the lamp stays unlit every time.
- With Calm on, the lamp is fully drawn at once with no spark movement, and the status line still appears.
- The lit count and the background tone are unchanged after trying to light it. SEE THE GROWTH TEST opens the drawer on the growth test folder.

**If it is off:** "Lamp six currently [what you see]. Keep everything else as it is, and change only [the one thing] so that [the behaviour I want]."

---

### P7.2: The person behind the file, in window light

**Say this:**
Next is the person block at the id in the paste block. Heading Is file ke peeche ka insaan, with the small kicker above it. Behind the text, draw a quiet window-light scene in SVG, with no people in it. A dark wall, a window with a thin frame and four panes glowing warm gold from inside, a sill below it, and one small diya on the sill with a gentle flame. Through the panes, show a few tiny far-away lit windows scattered in the night, like other homes. Keep the scene soft where the words sit. The words go on a warm translucent panel with text that passes AA. Show exactly the three paragraphs from the paste block, word for word, and add no other lines. The first sentence of the first paragraph is controlled by the ledger gate flag in copy dot json. When that flag is off, leave out only that sentence and keep the rest of the paragraph. The reveal is gentle: when the section scrolls in, the window light rises from dim to warm over about a second and a half, the far windows light one by one, then each paragraph fades up in turn, and the bold last line gets a thin marigold underline drawn under it. With Calm or reduced motion, show everything in its final state at once and keep the sill flame still. The sill flame sways very slightly on its own, and tapping the diya makes it lean for a moment, with a tiny haptic tick on Android only.

**Paste block:**
```text
SECTION ID: person
KICKER: THE PERSON BEHIND THE FILE
HEADING: Is file ke peeche ka insaan

PARAGRAPH 1:
[FIRST SENTENCE, gated by flags.ledgerGate_personFirstSentence] My father's accident brought serious financial pressure during my Class 12 exams. [END FIRST SENTENCE] A gap year, unsuccessful entrance attempts, YouTube study and a ₹3,999 course formed my route to VIT Pune.

PARAGRAPH 2:
I coordinated four research contributors, placed second in a college debate, and enjoy business case studies, essays and Advaita Vedanta. I care about people as much as code.

PARAGRAPH 3 (bold, the whole line):
I didn't learn that every plan works. I learned to decide what to do when it doesn't.

Scene notes:
- Decorative SVG, aria-hidden, no text inside it, no people, no deity imagery.
- The sill diya is separate from the five lamps: it never touches the store (litCount, lamps, tone).
- Quality tiers: on the lowest tier, skip the swaying and the far-window sequence; show them lit.
- Do not show the bracket markers on the page. They only mark the gated sentence.
```

**Check after it builds:**
- On a 360 px phone the three paragraphs are word for word, readable on the panel, with no extra caption or line.
- Scrolling in: the window brightens, tiny far windows light one by one, paragraphs appear in turn, the bold line gets its underline.
- Setting the ledger gate flag to false removes only the sentence about the accident. Everything else stays.
- With Calm on there is no movement at all and the final state shows immediately.
- Tapping the sill diya leans the flame briefly. Nothing in the store changes.

**If it is off:** "In the person block, [what you see]. Keep the three paragraphs and the scene, and change only [one thing]."

---

### P7.3: The word-level diff engine and the voice data

**Say this:**
Now the voice section, in two prompts. This first one is the data and the word-level diff engine, with no interface yet. Put the engine in its own small module, plain JavaScript, no libraries, written as a pure function so it can be tested. It takes the raw text and the Flow text for one take and returns an aligned list of changes. The exact steps are in the paste block, so follow them closely. In short: break each text into words, give each word a comparison key, find the longest common subsequence of the two key lists, walk back to list the matches, and treat every stretch between matches as trimmed, smoothed or added. Then add a safety check: joining the display words must give back each original text exactly, apart from spacing. If it does not, switch that take to plain text and write a note in the browser console, nothing visible. Also put the voice section heading, the intro lines and both takes into copy dot json word for word from the paste block, including the custody note and the labels. Do not change a single character in the takes, not even the double sorry or the stray punctuation, because they are real records. The words Spoken with Wispr Flow belong only to Take 1 and Take 2.

**Paste block:**
```text
ENGINE SPEC (module name: takesDiff)

1. TOKENISE. Split on whitespace. Raw text has paragraph breaks (blank lines); remember them as a breakAfter flag on the last word before the break. A token that is only punctuation (for example "...") joins the previous token's display text. Each token has display (exactly as written) and key.
2. KEY. Lowercase, normalise curly apostrophes to straight, strip leading and trailing characters that are not letters or digits. Keep apostrophes inside a word ("don't", "you're" stay whole).
3. LCS. Dynamic-programming table over the two key lists (about 90 by 80, tiny). Backtrack. On a tie, prefer the match that uses the earlier raw word. Matches are KEEP pairs (raw word i, Flow word j).
4. GAPS. Walk the matches in order. For each gap between two matches (or before the first, or after the last):
   - raw words only: TRIMMED (the raw words).
   - Flow words only: ADDED (the Flow words).
   - both sides have words: SMOOTHED. The raw words are marked trimmed, the Flow words are marked smoothed.
   Each trimmed run, each added run and each smoothed run is ONE change.
5. OUTPUT. A single ordered list of cells: keep {raw, flow} | trim {raw[]} | add {flow[]} | smooth {raw[], flow[]}. Also changeCount, and counts of trimmed words, smoothed words and added words. A paragraph break dissolves at the first change after it (breaks after the last change dissolve at the last change).
6. VERBATIM GUARD. Re-join raw display words (with their breaks) and Flow display words. Compare with the source texts after collapsing all whitespace runs to one space. If either differs, mark that take plainOnly and console.warn.
7. Punctuation and capital-letter differences on a matched word are not marked. This is a word-level compare.
8. Sanity targets once built: Take 1, "sorry sorry" and "so" are trimmed, and "it's" to "is" is smoothed. Take 2, "Wait," "I mean," "changing ourselves to fit the tool" and "learn the tool first" are trimmed.

COPY (word for word; put into copy.json under voice):
SECTION ID: voice
KICKER: THE FIRST CLUE WAS MY VOICE
HEADING: Soch poori hone do
SUBHEAD (italic): Let people finish thinking.

INTRO 1: Here's a real thought I spoke on 2 November 2026: "Shouldn't the technology adapt to how we naturally think and communicate?"   (bold: 2 November 2026)
INTRO 2: Dono ko saath rakh ke padhiye: meri hand-transcribed voice memo, aur Flow ka actual text. Thought wahi raha; bas expression saaf ho gaya.
INTRO 3: That matters more to me than "type faster": let people finish thinking.   (bold: let people finish thinking.)

TAKE 1
label: Take 1
recorded: 2 Nov 2026, 7:27 pm
tag: Spoken with Wispr Flow
raw:
Okay, so... the best interface... I think it's basically when you don't have to think about using it, like learning it sorry sorry how to use it.

Like, when you're using something and you're not constantly wondering where to click or what to do next.

You're just... doing what you came there to do.

And, yeah, I think that's actually quite difficult to build. Because all the complicated stuff, the logic, the decisions... someone has to handle all of that. Just not the user.
flow:
Okay the best interface, I think, is basically when you don't have to think about how to use it, like when you are using something and you are not constantly wondering where to click or what to do next. You are just doing what you came there to do. I think that's actually quite difficult to build because all the complicated stuff, the logic, the decisions, someone has to handle all of that, just not the user.

TAKE 2
label: Take 2
recorded: 2 Nov 2026, 7:30 pm
tag: Spoken with Wispr Flow
raw:
Wait, I think there's another way to look at this.

We spend so much time learning how to use technology... remembering commands, figuring out buttons, changing ourselves to fit the tool adjusting to how a tool works.

But why? I mean, shouldn't it be the other way around?

Shouldn't the technology adapt to how we naturally think and communicate?

Because we already know what we want to say. We shouldn't have to learn the tool first struggle just to get it out.
flow:
I think there's another way to look at this. We spend so much time learning how to use technology: remembering commands, figuring out buttons, adjusting to how a tool works. But why? Shouldn't it be the other way around? Shouldn't the technology adapt to how we naturally think and communicate? Because we already know what we want to say, we shouldn't have to struggle just to get it out.

LABELS
as I said it: As I said it
as Flow wrote it: As Flow wrote it
hint: Flame ko meri awaaz se Flow ke text tak khiskaiye. (Arrow keys work too, or use "Read it plainly".)
legend: Blue pencil: words Flow trimmed. Highlighted: words Flow smoothed or added.
toggle: Read it plainly
chip: A real take, straight from my Flow history
compare button label: COMPARE THE TWO REAL TAKES
custody: Where this came from: My Wispr Flow history · Wispr Flow · 2 Nov 2026 · Output matches Flow history word for word. "As I said it" is my own hand transcription of what I said, typed from my voice memo.
compare alt text: Two columns of text for each take, my spoken words on the left and Flow's text on the right, joined by a glowing line.
```

**Check after it builds:**
- No visible change yet except the voice heading and intro lines showing in the right place, word for word.
- In the browser console, no verbatim-guard warning appears for either take.
- Both takes in copy dot json match the paste block exactly, including the double sorry in Take 1 and the missing punctuation in the raw Take 2.
- A quick console print of the engine output shows the sanity targets: sorry sorry and so trimmed, it's to is smoothed in Take 1; Wait, I mean, and the two longer runs trimmed in Take 2.
- Spoken with Wispr Flow appears nowhere on the page yet except possibly the two take labels.

**If it is off:** "The diff engine marks [word or phrase] as [what it does]. I expected [what I expect]. Keep the algorithm steps, and look only at the step that decides that."

---

### P7.4: Drag the flame through the words

**Say this:**
Now the interaction for the two takes. Each take is a card. Above it a small chip that says A real take, straight from my Flow history, then the label line: Take number, the date and time, and the words Spoken with Wispr Flow. Those words appear on these two takes only, nowhere else. Inside each card, one block of text that morphs from As I said it to As Flow wrote it. Under it, a real range input styled so the thumb is a small flame, at least forty-four pixels, with As I said it on the left and As Flow wrote it on the right. It has one step per change from the engine, so the text changes word by word as the flame moves. Arrow keys move one change at a time and Home and End jump to the ends. Set a spoken value that reads As I said it, As Flow wrote it, or how many changes are showing. Keep the slider sticky near the bottom of the screen while its card is in view. Trimmed words get a blue pencil strike and then fold away. Smoothed and added words get a highlighter wash and a dotted underline. A switch labelled Read it plainly shows both versions as plain stacked text with square bracket labels around the changed words. Under both cards, the custody note word for word. Show the recording line only if both settings in the paste block are on.

**Paste block:**
```text
Uses the takesDiff engine from the previous step and the voice copy already in copy.json.

STRUCTURE per take: chip, label line, card (morph text), slider row, legend. Hint line once above the first card. Toggle once, above the cards, applies to both. Custody note once, below the second card.
LABEL LINE: Take 1 · 2 Nov 2026, 7:27 pm · Spoken with Wispr Flow   (same pattern for Take 2 with its own time)

SLIDER
- Real input type range, min 0, max = changeCount of that take, step 1, value starts at 0 (As I said it).
- Dragging maps position to the integer step. Each new step applies one more change, left to right. Android: a very short haptic tick (8 ms) per step, only on user drag, never on keyboard, never when Calm is on.
- aria-valuetext: step 0 "As I said it"; last step "As Flow wrote it"; otherwise "{k} of {M} changes showing".
- Keyboard: Left/Down -1, Right/Up +1, Home 0, End last. Page Up and Page Down move 5.
- Visible focus ring on the flame thumb. Sticky bottom 12 px inside the card.

MORPH STATES (the same text block, no layout jump larger than the changing word)
- At step 0 the raw text shows. Trimmed words carry a blue pencil strike (a thin hand-drawn blue line through the word, 2 px). Words that will be smoothed carry a faint dotted underline.
- When a change is applied: trimmed words fold away (strike draws 120 ms, then the word collapses); smoothed raw words fold away while the Flow words slide in with a highlighter sweep; added words slide in with the highlighter sweep. Highlighted words keep a dotted underline so they are not marked by colour alone.
- Paragraph breaks dissolve into spaces as the engine says.
- At the last step only the Flow text shows, with smoothed and added words highlighted.
- Calm, reduced motion, or the lowest quality tier: no transitions. Each step swaps instantly.
- The morph block is aria-hidden. Its plain twin (below) is always in the page for assistive tech.

LEGEND (under the first card): Blue pencil: words Flow trimmed. Highlighted: words Flow smoothed or added.
Legend swatches need a shape as well as a colour (a short struck line sample and a highlighted sample).

READ IT PLAINLY (switch, 44 px, role switch, off by default, not remembered)
- On: replace each morph block with two stacked paragraphs headed "As I said it" and "As Flow wrote it". In the first, each trimmed run is wrapped like this: [trimmed: words]. In the second, each smoothed run like this: [smoothed: words] and each added run: [added: words]. No colour needed to read it.
- Below, one plain line of counts from the engine, in mono: Trimmed: {n} words. Smoothed or added: {n} words.
- Off: the same plain text still exists in the page, visually hidden but readable by screen readers.

CHIP: A real take, straight from my Flow history (appears above each card, only on these two takes)

CUSTODY NOTE (below the cards, verbatim): Where this came from: My Wispr Flow history · Wispr Flow · 2 Nov 2026 · Output matches Flow history word for word. "As I said it" is my own hand transcription of what I said, typed from my voice memo.

GATED RECORDING LINE (after the third intro line, before the compare)
Render ONLY if flags.flowIntoEmergentRecorded is true AND voice.recordingLink is not empty. Otherwise render nothing and leave no empty space.
Text: I spoke some of the directions for this page through Wispr Flow into Emergent. Flow transcribed me; Emergent built the page; I looked at what it made and dictated a correction. The before and after are linked here.
("linked here" is the recording link, opens in a new tab.)
No other sentence on the page implies this build was spoken.
```

**Check after it builds:**
- At 360 px, dragging the flame with one thumb changes the text word by word, left to right, and the slider stays reachable while reading the card.
- Arrow keys move one change at a time, Home and End jump, and the focus ring on the flame is visible.
- Switching on Read it plainly shows square bracket labels trimmed, smoothed and added in the text itself, and the two counts line.
- With Calm on, every step swaps instantly with no folding or sweeping. Android only: a faint tick per step while dragging.
- Spoken with Wispr Flow appears on exactly two labels. The recording line is absent with the flag off.

**If it is off:** "In the compare, [what you see]. Keep the engine and the copy, and change only the [slider, marks, plain mode or custody note] so that [what I want]."

---

### P7.5: Seedhi baat, a signed note

**Say this:**
Next is the verdict at the id in the paste block. Present it as a signed note on warm paper resting under the lit row, like a note left on the table beside the lamps. A cream paper card, very slightly rotated, with faint ruled lines, a soft fold crease, two small pieces of translucent tape on the top corners, and a warm glow along its top edge that seems to come from the lamps above, stronger when the store tone is higher. Ink-dark text on cream, well above AA contrast, even when tone is low. Show the kicker, the heading Seedhi baat, then the four paragraphs from the paste block, word for word, in order. The third paragraph, the sentence I can't promise I'll always be right, must be the most prominent thing on the paper. Set it large in the display font, in English, as the signature line, with a hand-drawn marigold underline, and my first name Shriniwas written under it in an italic script feel. The fourth paragraph sits below that like a note added after signing. When the paper scrolls in, it settles two pixels as if just placed, the underline draws, and the name writes itself once from left to right. Under the paper put two buttons only: View my résumé, which opens Google Drive in a new tab and says so in its name, and Evidence drawer, which opens the drawer. No interview button here. Calm and reduced motion show the final state at once.

**Paste block:**
```text
SECTION ID: verdict
KICKER: YOUR VERDICT
HEADING: Seedhi baat

PARAGRAPH 1: AI helped implement and investigate. I mapped workflows, shaped architecture, made or approved decisions, identified bottlenecks, directed attempts to break the prototypes, and pursued fixes. I didn't personally write every line or discover every bug.

PARAGRAPH 2: I haven't owned a growth channel or shipped these prototypes to customers. Yeh zimmedari main kamaana chahta hoon.

PARAGRAPH 3 (THE SIGNATURE LINE, large, English): I can't promise I'll always be right. I can show you what I do when I'm wrong.
SIGNED: Shriniwas   (typed name, italic script style; it is not a drawn fake signature)

PARAGRAPH 4 (below the signature): Koi ek claim chuniye. Uska evidence kholiye. Phir faisle ke baare mein mujhse poochhiye.

BUTTON 1: VIEW MY RÉSUMÉ   (visually hidden suffix: opens Google Drive in a new tab)
href: https://drive.google.com/file/d/19DXFxUoCiynAvErP6KQVq-ArzV69Mgf2/view?usp=drive_link   (target blank, rel noopener noreferrer)
(If copy.json already has the résumé link, use that one.)
BUTTON 2: EVIDENCE DRAWER   (opens the drawer; data-evidence with no case id opens the first folder closed list)

Do not add the interview button, the closing line "Case file open for questions", or any caption.
Store: read tone (0 to 6) for the glow only.
```

**Check after it builds:**
- On a phone the paper reads as a note: cream, ruled, slightly tilted, with a warm edge glow, and the signature line is clearly the biggest thing on it.
- The four paragraphs are word for word and in order; the name Shriniwas sits under the signature line; there is no interview button here.
- Scrolling in: the paper settles, the underline draws, the name writes itself once.
- With Calm on, the paper is still, underline and name already shown.
- The résumé button opens Google Drive in a new tab, and its accessible name says so. Text stays high contrast with the store tone at zero.

**If it is off:** "The verdict paper currently [what you see]. Keep the words and the layout, and change only [the paper, the glow, the signature line or the buttons]."

---

### P7.6: Closure, the visitor's lamp

**Say this:**
Now the closure at the id in the paste block, the emotional end of the page. When it scrolls into view and all five of my lamps are lit, play one calm sequence. If they are not all lit, show the row as it is plus one button, Sab diye ek saath jalaiye, which lights all five through the existing light-all action, then play the sequence. First, a row caption using the count from the store row, with the English fine print under it. Then a row of small lit lamps: my five, then one small lamp for each in the count, at most seven shown, then one empty slot at the end. After a quiet beat, a small flame leaves the last lamp, travels in a gentle arc to the empty slot, and lights it. The last lamp does not dim. The visitor's lamp sets tone to six, fires the visitor lit event, and then one soft settle, a slow ring of embers, never a barrage. Then the lines fade in one by one: the two heading lines, the paragraph, the interview button, the small links, the callback lines and the sign-off. The exact timeline, wording and mail details are in the paste block. All the text is in the page from the start and only fades; the button is usable at any moment. Tapping empty space or scrolling skips to the end state. With Calm or reduced motion, show the final state at once and skip the settle.

**Paste block:**
```text
SECTION ID: closure
Store: read row {count, name}, litCount, calm, quality. Write tone = 6 once (use the store's existing setter).
Events: listen row:changed (update the caption). Fire diya:visitorLit once when the visitor's lamp ignites (skip if it has already fired from the wish step; then show the final state). Fire fx:burst with {kind: "settle", x, y} at the visitor's lamp centre, in viewport pixels, once, only when Calm and reduced motion are off. "settle" is a new kind: one slow ring of about 12 embers rising for 2 seconds. If the fireworks pack has not defined it yet, do nothing; do not draw your own fireworks.
Do not use the alternate line "Sab diye jal uthe. Ab mujhse poochhiye."

TIMELINE (seconds after the closure is 50 percent in view with litCount at 5)
0.0  Caption fades in (0.5 s). Fine print under it.
0.3  Small lamps appear left to right, 40 ms apart, already lit and quiet. My five first, with a slightly bigger gap after them. Then up to 7 visitor lamps. If the count is above 7, a faint dotted fade before them. Then one empty slot (dotted ring, same size as a lamp).
1.0  Nothing moves for 0.6 s.
1.6  A 10 px spark in --flame-core leaves the last lit lamp. That lamp's flame dips to 80 percent and is back to full by 2.8 s.
1.6 to 2.8  The spark travels 1.2 s along an arc, 28 px high, ease in-out, inside the row container so scrolling cannot misplace it (use Web Animations API, transform and opacity only).
2.8  The empty slot ignites: flame grows from 0 to full in 0.5 s. This is the newest lamp: 20 percent more glow, a slow 6 s breathing glow. Fire diya:visitorLit. Set tone to 6.
3.0  fx:burst settle.
3.6  H2 line one fades up (0.6 s): Aapka diya jal utha.
4.4  H2 line two: Ab mujhse ek sawaal poochhiye.
5.2  Paragraph.
5.8  Interview button, then the address line under it.
6.2  Small links.
6.6  Callback lines.
7.0  Sign-off appears. The name writes itself left to right over 1.2 s.
Calm or reduced motion: everything final at 0, no spark, no breathing, no settle. The events and the tone still happen once.
Skip: a tap on non-interactive space or a scroll of more than 40 px during the sequence jumps to the end state.

CAPTION (N = row.count)
N = 0: Yeh row aapse shuru hoti hai.
N = 1: Ek diya pehle se. Aakhir mein aapka.
N from 2 to 99: {N} diye pehle se. Aakhir mein aapka.
N above 99: 99+ diye pehle se. Aakhir mein aapka.
Fine print (always, small, English): This number is written inside the link. It is not a visitor count and is not verified.
Row accessible name (role img, lamps inside aria-hidden): A long row of lit lamps, with the newest lamp at the right end glowing a little brighter.

KICKER: YOUR LAMP IS LIT
H2 line one: Aapka diya jal utha.
H2 line two: Ab mujhse ek sawaal poochhiye.
Polite live region (visually hidden) says line one when the lamp ignites.
PARAGRAPH: Paanch projects mein se koi ek chuniye. Kya hua, maine kya kiya, aur kya abhi adhura hai: teeno batata hoon.

INTERVIEW BUTTON (render only if site contact email is set; if not, also hide the line under it)
Label: INVITE ME TO AN INTERVIEW   (accessible name adds: opens an email)
Line under the button: Ek email. Ek lamp. Baaki baat wahin.
Address, plain mono text under that, selectable, as a fallback when no mail app opens: shrniwaskholkute2282@gmail.com   (use the site contact email from copy.json if it is there)
Link: mailto with the address, subject: Interview: Ek Diya Se Doosra
Body, English only, built with proper URL encoding and real line breaks:
  Hello Shriniwas,
  (blank line)
  I would like to talk about an interview.
  (blank line)
  My lamp number on your page: {N plus 1}
  (blank line)
Rules: if N is above 99 write "more than 99" after the colon. Never put a wish, a name or any other visitor text in the email.

SMALL LINKS: View my résumé (opens Google Drive in a new tab, say so in its accessible name) · Evidence drawer (opens the drawer)

CALLBACK LINES (two short paragraphs):
Mere paanch diye bhi ek-ek karke jale. Jahan jawab adhura tha, wahan maine adhura hi likha.
Sawaal poochhne ke liye yeh page khula hai. The best interface gets out of the way. The best evidence doesn't.

SIGN-OFF (display font, italic, large; the name second line)
Before the cut-off: Shubh Deepavali.
From the cut-off: Shukriya.
Second line either way: — Shriniwas
Cut-off rule: in the browser, if the current local date is 10 November 2026 or later, show Shukriya. Keep the date only inside the code. Print no festival date anywhere, including aria labels, titles and meta.

DELIGHTS (cheap)
- Tapping or pressing Enter on the visitor's lamp (hit area 44 px, accessible name in English: Your lamp) makes it flicker softly for 0.6 s; Android haptic tick 10 ms.
- When the lamp ignites, swap the page's favicon to a small lit-flame SVG as an inline data address. No file request.
- The sign-off text warms by a few percent toward cream gold when the lamp is lit.
```

**Check after it builds:**
- At 360 px the whole row fits without sideways scrolling, and the caption wording matches the count in the link (try counts 0, 1, 5 and 120).
- With five lamps lit, you see the quiet pause, then a small flame travel from the last lamp and light the empty slot; the last lamp keeps its light; one soft ring of embers, nothing more.
- The interview button opens a prefilled email with the subject and a body whose lamp number line is the count plus one; the address is shown under the button.
- Tap on empty space or scroll skips to the end state. With Calm on the final state appears at once and there are no embers.
- Setting the device date to 10 November or later changes only the sign-off to Shukriya. No date is printed anywhere.

**If it is off:** "In the closure, [what you see at about what second]. Keep the timeline, and change only the moment that [your description] so that [what I want]."

---

### P7.7: The sixty second sheet and the evidence drawer

**Say this:**
Two overlays now, and they share the same behaviour. Both are native modal dialogs. On a phone they rise from the bottom as a sheet, with a close button of forty-four pixels, Escape to close, a focus trap, a tap on the backdrop to close, page scroll locked behind them, and focus returning to whatever opened them. First, the sixty second sheet, the id in the paste block. The label is THE 60-SECOND FILE with Jaldi mein hain, yeh padhiye beside it, then the headline, four paragraphs, the italic line, and two buttons, all word for word. A thin wick line across the top slowly burns shorter over sixty seconds as a decoration, hidden from screen readers, and it just stays full when Calm is on. Second, the evidence drawer. Title Evidence drawer, the intro, then eight folders as an accordion of paper tabs, one open at a time, each tab slightly offset like a file folder and nudged up when it opens. Each tab is a button with the folder name and its one-line summary. An open folder shows the labelled fields from copy dot json, skipping empty ones, and the status chips as plain grey text, never coloured badges. Repository links are real links in a new tab, named so each is unique. Where a file is local, write evidence available on request. Any button with the data attributes in the paste block, or the two events, opens these overlays.

**Paste block:**
```text
OPENING (no URL fragment changes; the fragment belongs to the lamp count and first name)
- Delegated click on any element with data-sixty opens #sixty. Delegated click on any element with data-evidence opens #evidence at the folder id in that attribute (c1 to c8); an empty value opens the drawer with all folders closed.
- Also listen for the custom events sixty:open and evidence:open (detail: {caseId}).
- Attach these to every receipt button already built: OPEN THE CERTGEN RECEIPT (c1), OPEN THE VIGIL RECEIPT (c2), OPEN THE BLITZ RECEIPT (c3), OPEN THE TIPINDEX RECEIPT (c4), OPEN THE PITDB RECEIPT (c5), SEE THE GROWTH TEST (c8), the résumé-adjacent EVIDENCE DRAWER links, and the opening line "THE 60-SECOND FILE" link and nav item for the sheet.
- Opened from a lamp card sheet: the drawer stacks on top; closing it returns focus to the receipt button that opened it.
- Ids: sixty and evidence. Dialog heading ids used for aria-labelledby.

SIXTY SHEET COPY
LABEL: THE 60-SECOND FILE
Beside it (italic): Jaldi mein hain? Yeh padhiye.
HEADLINE: 324 tests passed. A separate audit found 19 problems. Would you have shipped it?
P1: I'm Shriniwas, an engineering student applying to Wispr Flow's India growth internship. I mapped workflows and architectures, made or approved key design decisions, and used AI agents for implementation and investigation.
P2: In one project, I approved further corrections after the first audit fixes weren't enough. In another, a watchdog called a late reply proof of a healthy connection. I questioned whether the tests actually proved the product's promise; the corrected test failed when its fix was removed.
P3: I also withdrew a flattering speed claim, redirected an interrupted experiment between AI agents, and narrowed a database claim after a specific time-handling defect.
P4: I have no growth wins to borrow. But I've used Flow, and I want to test whether a Hinglish-first demonstration helps Indian students reach their first useful dictation and return for another.
ITALIC LINE: I can't promise I'll always be right. I can show you what I do when I'm wrong.
BUTTON 1: OPEN ONE RECEIPT   (opens the drawer at c1)
BUTTON 2: INVITE ME TO AN INTERVIEW   (the same prefilled mailto as the closure; render only if the contact email is set; the lamp number line is left blank if the visitor has not lit a lamp)
Close button label: Close
Wick line: decorative, 60 seconds, linear, stops full when Calm or reduced motion.

EVIDENCE DRAWER
TITLE: Evidence drawer
INTRO: Every figure above has a source and a status. Statuses are plain text: PUBLIC, LOCAL-BRANCH, REPO-REPORTED, PERSONALLY CONFIRMED, UNRESOLVED, PROPOSED. Jahan jawab abhi adhura hai, wahan UNRESOLVED likha hai.

TAB NAMES AND ONE-LINE SUMMARIES (summary shows on the collapsed tab)
1. CERTGEN: The green wall. 324 tests, phir 19 findings, aur mera hissa kitna tha.
2. VIGIL: The late witness. Ek late reply, ek sawaal, aur do tests jo correction hatane par fail hue.
3. BLITZ: The number I withdrew. 1,205 se 1,850 tak ka poora hisaab, aur jo abhi remeasure nahi hua.
4. TIPINDEX: The operator changed, the evidence stayed. Handoff ka record, aur woh jawab jo abhi UNRESOLVED hain.
5. PITDB: The future appeared early. 06:15, 06:00 par: kya local branch par hai, aur kya public par.
6. ROLES: Who designed, who executed, who verified? Kisne kya kiya, seedhe shabdon mein.
7. THE PERSON AND THE VOICE: Sources. Voice takes kahan se aaye, aur kya abhi baaki hai.
8. INDIA GROWTH TEST: The proposed protocol. Poora protocol. Proposed, not run.

FOLDER BODIES: already in copy.json under evidence cases, copied word for word from content.json by the foundation pack. Do not retype or edit them. Field labels: Plain-English purpose, The central finding, My part, Recorded results, Where to inspect, Status, Other findings. A case may override a label (ROLES, THE PERSON AND THE VOICE and INDIA GROWTH TEST do); use the override. Skip any empty field.

STATUS: each pair is a chip and a note, shown as plain text, for example "PUBLIC · Repository". Chips are small mono capitals in dark grey on the paper (contrast at least 4.5 to 1). Render only the statuses present in the data. Do not add PERSONALLY CONFIRMED or any status that is not in the data.

WHERE TO INSPECT
- The repository name is a real link (new tab, rel noopener noreferrer). Accessible name pattern in English: "Repository for {project}: {label}, opens GitHub in a new tab". Each folder's links have unique names.
- File names are plain mono text, not links.
- If a case note says some files are local, show it, and add: evidence available on request.
- Per-case override in copy.json: evidence.linkOverrides, for example {"c3": "on-request"}. When a case has an override, show the words "evidence available on request" instead of the link.
- Folder 7 links: Read my long-form essay (https://drive.google.com/file/d/1ccYZ-WZOZTLmZ4A23Ed9yNGy9jiCNi2k/view?usp=drive_link) and View my résumé (https://drive.google.com/file/d/19DXFxUoCiynAvErP6KQVq-ArzV69Mgf2/view?usp=drive_link), both open Google Drive in a new tab and say so in the accessible name.
If any repository link is missing from copy.json, the fallback table (only if missing):
c1 https://github.com/Shri2909/Bulk-Certificate-Generator
c2 https://github.com/Shri2909/Vigil-Low-latency-TCP-heartbeat-monitor
c3 https://github.com/Shri2909/Blitz-Limit-Order-Book
c4 https://github.com/Shri2909/TipIndex-Indexed-Market-Data-Message-Bus
c5 https://github.com/Shri2909/PitDB

ACCORDION BEHAVIOUR
- Tab = button with aria-expanded and aria-controls; panel = region labelled by its tab. One open at a time.
- Up and Down arrows move between tabs, Home and End jump, Enter and Space toggle.
- Tabs are 56 px high minimum, staggered left offsets in a repeating pattern of three (0, 10, 20 px), each rotated a hair (plus or minus 0.4 degrees).
- Opening a folder scrolls it to the top of the drawer and nudges its tab up 6 px. Calm or reduced motion: no slide, no nudge, instant.
- Opened from a receipt button: the matching folder opens and focus lands on its tab button.
Store: calm, quality. No store writes.
```

**Check after it builds:**
- The sixty second sheet opens from the nav, from the opening link, and from any element with the data attribute. Tab stays inside it, Escape closes it, and focus returns to the opener.
- The wick line burns down slowly, and sits full with Calm on. OPEN ONE RECEIPT opens the drawer at the first folder.
- The drawer shows eight paper tabs with their one-line summaries; opening one closes the previous, and the status chips are plain grey text only.
- Each OPEN THE ... RECEIPT button on the lamp cards opens the right folder; each repository link has a different accessible name; a case with an override shows evidence available on request.
- The interview button in the sheet is absent if the contact email is empty.

**If it is off:** "The [sixty sheet or drawer] currently [what you see]. Keep the copy and the folders, and change only [focus, scrolling, tab layout or links] so that [what I want]."

---

### P7.8: Footer, flags, and a last tidy of this pack

**Say this:**
Last piece of this pack is the footer, with seven lines, and then a tidy-up check. Build the footer as a calm block at the very bottom, small readable type, high contrast, each line its own paragraph, using the words in the paste block exactly. Lines one, two, three, six and seven always show. Line four, about no analytics, shows only when its flag in copy dot json is on, and the flag stays off until I confirm. Line five is made of two parts. The first part is a field in copy dot json that I will fill in myself with the tool I really used to build the page, as one complete sentence. If that field is empty, show only the second part, and never guess or invent a tool name. At the left of line seven, put a tiny lamp glyph that is unlit, and warms to lit when the visitor's lamp has been lit, a small callback. Then do a tidy-up. Make sure the phrase Spoken with Wispr Flow appears on exactly two places, the labels of Take 1 and Take 2. Make sure no festival date appears anywhere on the page, in the title, in the meta tags or in any label. Make sure no part of this pack writes to local storage, session storage, cookies or the URL fragment. Finally, write a short list in the browser console of every line currently hidden by a flag or an empty field.

**Paste block:**
```text
FOOTER (element: footer; each line a paragraph; wrap Hinglish phrases in lang hi-Latn)
Line 1: Wispr Flow ke India growth internship challenge ke liye banaya hai. Prototypes, not products. Har number ka source aur status Evidence drawer mein hai.
Line 2: AI agents wrote a substantial share of the code in these projects. I directed, approved and questioned. Kisne kya kiya, woh drawer mein hai, jitna main saabit kar sakta hoon.
Line 3: Yeh page aapki wish upload ya save nahi karta. Link mein sirf diyon ki ginti aur, agar aap likhein, aapka pehla naam hota hai.
Line 4 (only if flags.noAnalyticsLine is true): Is page mein koi analytics, cookies ya third-party script nahi hai.
Line 5: [footer.howMade, my own sentence naming the tool I really used, only if not empty] The Hinglish lines were drafted with AI help and approved by me. Only the two takes above were spoken with Wispr Flow.
   If footer.howMade is empty, show only the two sentences after it.
Line 6: This is an independent application page. Wispr Flow and Emergent have not reviewed or endorsed it.
Line 7: © Shriniwas Kholkute   (tiny lamp glyph before it, aria-hidden, unlit; lit when the visitor's lamp is lit: listen for diya:visitorLit and also read store tone equal to 6)

The words "Evidence drawer" in line 1 open the drawer (data-evidence).

TIDY-UP AUDIT
1. Search the built page text for "Spoken with Wispr Flow": exactly two matches, on Take 1 and Take 2.
2. Search the page, titles, meta tags and aria labels for any festival date: none.
3. Search this pack's code for localStorage, sessionStorage, document.cookie, location.hash writes, fetch, XMLHttpRequest, and any external address other than the GitHub and Google Drive links the visitor clicks: none.
4. With every flag at its default: the recording line, the first-person line about analytics, and the footer tool sentence are absent; the person's first sentence and the lamp six language line are present.
5. Console list on load: one line per hidden item, for example "hidden: footer line 4 (noAnalyticsLine false)". Console only, nothing visible.
Line 3 (the privacy line) is only true while nothing is stored. If anything is ever stored, tell me instead of leaving this line in.
```

**Check after it builds:**
- The footer has seven lines with defaults; lines four and the tool sentence are absent, and the footer still reads cleanly.
- Turning the no-analytics flag on adds line four exactly as written; filling the how-made field adds my sentence before the rest of line five.
- The tiny lamp glyph by the copyright line is unlit at first and lit after the visitor's lamp ignites. With Calm on it simply changes state.
- The console shows the hidden-items list; no network request goes to any third-party address.
- Tab order reaches every footer link with a visible focus ring; the page has no sideways scroll at 360 px.

**If it is off:** "The footer or the audit shows [what you see]. Keep the seven lines as written, and change only [the flag handling, the glyph or the console list]."

---

## Risks and cut order

Risks
- Contract additions the other packs must tolerate: data-sixty and data-evidence attributes, the sixty:open and evidence:open events, the fx:burst kind "settle", and the flags block in copy.json. If Pack 4's receipt buttons were built without data-evidence, P7.7's wiring step must attach it; check every OPEN THE ... RECEIPT button after P7.7.
- The URL fragment carries the lamp count and first name, so overlays never write to it. Do not let any later prompt add deep links using the hash.
- Native dialog with showModal is fine on current Android Chrome and iOS Safari but needs the Escape and focus-return checks on a real phone.
- The diff engine's tie-breaks can align a repeated word oddly. The verbatim guard protects the text, not the pretty alignment; check the sanity targets by eye.
- The closure sequence is about 8 seconds. The skip rule matters on a phone in Diwali week: test tap and scroll skipping before shipping.
- Hinglish and numbers must come from paste blocks, not from dictation. Speak the brief, paste the block, never trust the transcript for the takes.
- Truth gates: the person's first sentence and the lamp six language line are now OFF by default (changed in the master file) because both are still open on the truth ledger or optional. Turn them on only when you decide. Where a check below says the first sentence or the language line shows by default, read it as: hidden until you switch the flag to true.

Cut order, last built to first cut
1. Counts line in Read it plainly, the sill diya lean, the favicon swap.
2. Footer lamp glyph, the wick line in the sixty sheet, the folder nudge and tab rotation.
3. Far-window sequence in the person scene, tape and fold crease on the paper, the visitor-lamp flicker.
4. Spark travel in the closure (keep the instant lighting and the caption), then the settle ring.
5. Lamp six line-drawing animation (keep the static sketch).
6. Never cut: the plain twins, the custody note, the gated lines, the lamp six badge, focus trap and Escape, the date swap.


---

# PACK 5: FIREWORKS, ATMOSPHERE AND LIVING EFFECTS

Build position: 7 of 8.

Prompts P5.1 to P5.8. Run after Packs 1, 2, 3, 4, 6 and 7 are working. Pack 8 (QA) comes after this.

## Pack overview

1. One shared Canvas 2D ParticleCanvas (pooled, tiered, self-throttling) plus a few CSS/SVG pieces (string lights, still glows). No WebGL, no libraries, no images, no audio.
2. Everything is a kind: spark, ember, anar, rocket, chakri, petals, lantern, twinkle, phuljhadi, glow. The FxDirector cue sheet decides which kind fires on which story beat.
3. Crackers (anar, rocket, chakri, phuljhadi) only ever fire from a reader action or a beat the reader triggered. Ambient life (fireflies, string lights) is quiet and never explosive.
4. Calm ("Roshni kam karo") and the Ink theme replace every motion with a still glow. Nothing flashes more than three times a second. A frame-time governor drops the tier by itself.
5. Floating card physics and row lanterns are specified here so Pack 6 (wish) and Pack 7 (closure) can call them. Effects never state a result, a number or a win.

How to use: speak each "Say this" into Wispr Flow, then paste the "Paste block" (if there is one) into the same Emergent message. Do the checks on your phone, once normally and once with Calm on, before the next prompt.

---

### P5.1: One shared canvas, a pool of sparks

**Say this:**
This is the first of the fireworks and atmosphere prompts. Please do not change any copy, layout or lamp behaviour that already works. First, look at how the page is layered and tell me in two lines where the sky, the skyline and the cards sit. Then build one shared canvas called Particle Canvas, fixed to the full screen, ignoring touches, hidden from screen readers. It sits above the sky and below the skyline silhouette, the text and the lamp card sheet, so rockets can later burst behind the skyline. One canvas only. No libraries, no WebGL, no images, no sound. Keep a fixed pool of particles in typed arrays with a free list, so nothing is created while animating. Draw everything from a few soft glow sprites that you render once on an offscreen canvas in our flame colours. Use additive blending only for small bright cores, drawn in batches. The animation loop runs only while something is alive. When only gentle ambient things remain, run at thirty frames a second. Stop completely when the tab is hidden, and resume without a time jump. Listen for the fx burst event, and spawn by kind. The paste block has the kinds, the payload, the caps and the standing rules. Keep those rules for every later prompt. Finally add a temporary small button at the bottom left called Test sparks, that fires one spark pop where I tap. I will ask you to remove it later.

**Paste block:**
```
PARTICLECANVAS CONTRACT (Pack 5)

Event it listens to (same event bus as the rest of the page):
  fx:burst  detail = { kind, x, y, power?, shape?, count?, tx?, ty?, bright? }
  x, y = viewport CSS pixels (same convention as diya:lit). If diya:lit gives page coordinates, convert.
  power = 0..6 (default: store.tone). count = integer. bright = boolean (visitor's lantern).

Allowed kinds (anything else is ignored, never throws):
  spark      small radial pop, 6-12 sparks, 0.3-0.6 s
  ember      slow rising warm dots, 1-6, rise 20-40 px/s, life 1.5-3 s
  anar       fountain from a base point, cone +/-18 deg, 2.2 s, scaled by power
  rocket     climbs from (x,y) to (tx,ty), 1.4-1.9 s, then bursts. shape = chrysanthemum | willow
  chakri     ground spinner at (x,y), 3.2 s
  petals     marigold petals drifting from (x,y); count 1-24
  lantern    paper-lantern sky lamp rising from (x,y); count 1-12; bright = true for the visitor's lantern
  twinkle    small shooting star starting at (x,y), 160 px diagonal, 0.7 s
  phuljhadi  sparkler starting at (x,y); then follows the pointer by itself; ends by itself
  glow       a still halo (a DOM div, not canvas): radius px, colour token, hold ms

Caps per quality tier (live particles, all kinds together):
  high 220 | mid 120 | low 40   (pool size 256)
  Priority when full: phuljhadi > spark/anar/rocket/chakri > twinkle > ember/petals/lantern.
  Ambient stops spawning when live count is above 70% of the cap.
  Canvas resolution: high devicePixelRatio max 1.75, mid max 1.5, low 1.
  Additive blending: high on cores, mid only on sparkler and rocket cores, low never.

Standing rules for every Pack 5 prompt:
  - No audio, no text-to-speech, no sound toggles.
  - Effects are aria-hidden, decorative, and never show a number, a result or a claim.
  - No full-screen or large bright flashes. Peak alpha 0.8. Biggest sprite 96 px.
  - Nothing flashes more than 3 times a second. Fades, never blinks.
  - No allocation inside the animation loop (no new objects, arrays, closures).
  - Cracker kinds (anar, rocket, chakri, phuljhadi) only after a reader action or a beat the reader triggered.
  - No commentary about crackers, pollution or tradition. No deity or gift imagery.
  - Pause when the tab is hidden. Stop the loop when nothing is alive.
  - Colours only from the tokens: flame-core, flame-a, flame-b, cream, marigold. Kumkum only for petals.
```

**Check after it builds:**
1. The page looks exactly as before. The new canvas is invisible when nothing is alive.
2. Tap "Test sparks" a few times at different places on your phone: a small warm pop appears each time, then the page is calm again.
3. Tap it very fast for five seconds: the page never stutters and the sparks never pile into a bright blob.
4. Switch to another tab for ten seconds and return: no burst of leftover sparks.
5. Text, the lamp row and the lamp card sheet are all still fully readable and tappable on top of the canvas.

**If it is off:**
Say: "The part where [what you saw, in your own words] is not how I described it. Read the Particle Canvas code, tell me what you find, and then change only that."

---

### P5.2: The governor, Calm, and "Roshni kam karo"

**Say this:**
Now the safety rails for the Particle Canvas. First, a frame-time governor. Measure how long frames take, smoothed, and only while the canvas is doing real work, not in the thirty frames a second ambient mode. If the smoothed frame time stays above twenty-four milliseconds for about twenty frames, drop one quality tier from high to mid to low. Fade out the oldest particles over a third of a second so nothing pops. Write the new tier into the store and send the fx set quality event. After a drop, wait three seconds before judging again. Never go back up on its own. Start on mid if the phone reports four cores or fewer, otherwise high. Second, the visible Calm control. Check the existing Calm toggle, and make its visible label say Roshni kam karo, meaning turn the lights down, with the English accessible name Turn the lights down, calm mode. When it is on, it says Roshni waapas laao. It must be at least forty-four pixels, in the top bar, keyboard operable. Calm starts on if the device asks for reduced motion, and then stays on. When Calm turns on, fade every live particle out over four hundred milliseconds, stop the loop, hide the canvas, and from then on every effect becomes a still glow. The paste block lists the replacements, and the Ink theme rules. Do not store the Calm choice anywhere in the browser.

**Paste block:**
```
GOVERNOR
  Event emitted: fx:setQuality  detail = { tier }   tier = high | mid | low
  Store field written: quality (only the governor writes it)
  Downshift rule: smoothed frame time > 24 ms for 20 frames, not in 30 fps ambient mode, not within 3 s of a drop.
  Ignore frames longer than 100 ms (tab resume, scrolling jank spikes).
  At low and still slow for 3 s: stop ambient spawning completely; keep only reader-triggered effects.

CALM (store.calm) AND REDUCED MOTION: kind -> replacement
  spark, ember, twinkle   -> nothing
  anar                    -> one still glow at the base point, radius 90 px, colour flame-a, fades in 1.2 s, holds 1.6 s, fades out 1.2 s
  rocket                  -> one still glow at the burst point (tx,ty), radius 140 px, colour flame-core at 30% alpha, fades in 2.4 s and stays until the next page load
  chakri, phuljhadi       -> nothing (they are motion toys)
  petals, lantern         -> nothing
  glow                    -> as is (this is the replacement kind)
  String lights           -> static at the current brightness, no twinkle, no wave
  Floating card           -> no bob, no parallax; sending fades the card clone out in place over 600 ms

INK THEME (read the same way the page already switches theme; tell me which attribute you found)
  Cracker kinds are dropped entirely: anar, rocket, chakri, phuljhadi.
  Kept: glow, twinkle, ember, lantern, petals. All drawn in cream only.

Control: label "Roshni kam karo" / pressed label "Roshni waapas laao"
  aria-label (English only): "Turn the lights down, calm mode"
  min 44 x 44 px, visible focus ring. No localStorage, no cookie.
```

**Check after it builds:**
1. The top bar shows "Roshni kam karo" and it is easy to tap with a thumb.
2. Press "Test sparks" a lot, then tap Calm: everything fades out softly, no pop. The label changes to "Roshni waapas laao".
3. With Calm on, "Test sparks" gives a quiet still glow instead of sparks.
4. Turn on your phone's reduce-motion setting and reload: Calm is already on and cannot be turned off.
5. Reload the page: Calm is off again (nothing remembered), unless the phone setting is on.

**If it is off:**
Say: "Calm does [what you saw] when I [what you pressed]. I want everything live to fade out and become a still glow. Read the Calm code and the Particle Canvas code, tell me what you find, then fix that one thing."

---

### P5.3: Ambient life: petals, fireflies, string lights, sky lamps

**Say this:**
Now the quiet atmosphere. Four things, all soft, all hidden from screen readers. One: drifting marigold petals, tiny and tumbling, falling slowly from the top. They start after the first lamp the reader lights, and get a little denser with each lit lamp. Make about one petal in seven a lighter gold. Two: fireflies made of ember dust, drifting slowly in the lower half. They are the only thing allowed at page load. When a lamp is lit, nearby fireflies drift gently toward that flame. Three: balcony string lights along the top edge, as an inline picture with a draped line and bulbs. Each bulb breathes slowly with a different delay, never faster than once every two seconds. They start dim, and get a little brighter with every lit lamp. When a lamp is lit, one slow wave of brightness travels along the string, left to right, once. Four: paper-lantern sky lamps rising very slowly with a little sway. The first one appears when lamp three is lit, and they fade near the top. Use the paste block for counts per tier. Keep everything under the caps. In Calm and Ink, show the string lights still, and nothing else.

**Paste block:**
```
AMBIENT COUNTS (live at once)       high   mid   low
  petals (scaled by litCount/5)       18     10     4     starts after first reader-lit lamp
  fireflies                            8      5     2     allowed at load; off in Calm
  sky lamps (ambient)                  4      3     1     first one when lamp 3 is lit
  string-light bulbs                  14     12     8     SVG/CSS, not canvas

Petal: 6 pre-rendered tilt variants, fall 9-14 s per screen, sway amplitude 20-40 px, never pile up.
Firefly: slow Lissajous wander, alpha 0.15-0.6 breathing, steer toward the nearest lit lamp within 160 px (positions remembered from diya:lit x,y).
String lights: brightness = 0.35 + 0.1 x store.tone (max 1.0). Bulb opacity animation period 4-7 s, staggered; animate opacity only, no blur filter per bulb.
Wave: one pass of +0.3 brightness, 900 ms, triggered by diya:lit.
Sky lamp: 18 x 26 px pre-rendered rounded lantern sprite with a warm core glow, rise 30-40 s per screen, fade out in the top 15%.
Ambient render rate: 30 fps when nothing else is alive.
```

**Check after it builds:**
1. At page load only a few slow fireflies and dim string lights; no petals yet.
2. Light lamp 1: petals begin, string lights brighten with one wave across the top.
3. Light lamp 3: a first sky lamp starts to rise.
4. A firefly near a freshly lit lamp visibly leans toward it.
5. With Calm on: string lights are still, and nothing else moves.
6. Scroll around on your phone: scrolling stays smooth.

**If it is off:**
Say: "The [petals / fireflies / string lights / sky lamps] are too [many / fast / bright] on my phone. Keep the counts in the paste block, tell me which numbers you used, then lower only that one."

---

### P5.4: Phuljhadi, the sparkler under your finger

**Say this:**
Now a sparkler. Press and hold for about half a second on an empty part of the sky, and your finger becomes a phuljhadi. If the finger moves more than ten pixels before the half second, treat it as a normal scroll and do nothing. Empty means not on a button, link, lamp, slider, text field, or open card or dialog. Once it starts, stop scrolling and stop the long-press menu and text selection. The tip follows your finger with a soft lag, so it wanders. Sparks fly out in all directions, fall with gravity, and cool from white-gold to orange to deep red as they fall. Behind the tip there is a short fading trail that also cools. A thin wire shows under the tip and shortens as it burns. The whole sparkler burns down over about eight seconds, getting gentler. If the finger lifts early, the sparkler stays stuck in the dark where it was, burns for one and a half more seconds, then goes out. One at a time. On Android only, if vibration is available, give a tiny six millisecond tick no more than six times per sparkler. Calm and Ink: it does nothing at all. Show one small whisper once, after lamp two is lit: Aasmaan ko dabaye rakhiye.

**Paste block:**
```
PHULJHADI
  Start: pointer held 450 ms, moved < 10 px, target not interactive. Emits fx:burst { kind: "phuljhadi", x, y }.
  Burn: 8.0 s. Intensity I(t) = 1 - (t/8)^1.6. Spark rate x I, spark speed x (0.5 + 0.5 I).
  Spark rate per second: high 90 | mid 60 | low 30
  Spark: speed 60-180 px/s random direction, +15% of pointer velocity, gravity 520 px/s^2, drag 0.98, life 0.35-0.9 s, colour cooling flame-core -> flame-a -> flame-b -> dark, size shrinking.
  Tip: eases toward pointer, lerp 0.18 per frame. Trail: ring buffer of 12 points, cooling over 0.6 s.
  Wire: 2 px cream line below tip, length 36 px shrinking to 8 px.
  Lift early: stay in place, burn 1.5 s, end. pointercancel: same.
  Vibration: navigator.vibrate(6) only if it exists, max 6 pulses, only while dragging, never in Calm.
  Disabled in: Calm, reduced motion, Ink theme, while any dialog or the lamp card sheet is open.
  Whisper (aria-hidden, shows once per visit after lamp 2 is lit, 5 s, fades): "Aasmaan ko dabaye rakhiye."
```

**Check after it builds:**
1. Long-press empty sky: a sparkler appears under your finger and sparks fall with a gentle arc.
2. Drag slowly: the tip trails behind your finger; the trail cools to red.
3. Hold and watch: it softens over about eight seconds and the wire is shorter at the end.
4. Lift the finger early: the sparkler stays put for a moment and goes out.
5. A normal swipe to scroll never starts a sparkler; pressing on a lamp or text button never does either.
6. Calm on: long-press does nothing and no whisper appears.

**If it is off:**
Say: "The sparkler [what you saw] when I [what you did]. I want it to feel like [one phrase from the prompt, for example 'stays stuck in the dark']. Read the sparkler code, tell me what you find, then adjust only that."

---

### P5.5: The FxDirector cue sheet, and the anar at the skyline

**Say this:**
Now build the FxDirector. It is the one place that decides which effect fires when, using a cue sheet that I will paste. It listens to the story events, reads the quality tier and the tone, and sends fx burst events. It never draws anything itself. Also build the anar, a fountain of sparks. When a lamp is lit, an anar erupts from the roofline of the skyline, directly below that lamp, scaled by tone. At tone six it is taller and wider but still soft. The cue sheet has the numbers per tier and the Calm replacements. Two protective rules. If several lamps are lit within six hundred milliseconds, as with Sab diye ek saath jalaiye, only the last one gets the anar and the others get a small spark pop. And no more than four non-ambient bursts per half second overall; drop extras. Please look up how the lamp pack exposes each flame's position and tell me what you found. If it is not exposed, use the x and y from the lamp lit event and say so. Do not touch any lamp behaviour.

**Paste block:**
```
FXDIRECTOR CUE SHEET (events are the contract names; intensity m = 0.4 + 0.6 x tone/6)

Cue                  Trigger                       High                           Mid                         Low                       Calm / Ink / reduced motion
C0 Opening           page load, no user action     8 fireflies, string lights 35% 5 fireflies                 2 fireflies               string lights still, nothing else
C1 Holding           diya:lighting {n,progress}    ember at wick every 90 ms x progress  every 160 ms         every 300 ms              nothing (lamp's own glow handles it)
C2 Lamp lit          diya:lit {n,x,y}              spark 10 at wick; anar 110/s x m for 2.2 s at roofline under x; string-light wave   spark 7; anar 60/s x m   spark 4; anar 24/s x m   one still glow at the wick, radius 90, 1.6 s hold
C3 Lamp 3 lit        diya:lit n=3                  first ambient sky lamp         same                        same (1 lamp)             none
C4 All five lit      diya:allLit                   see P5.6                       see P5.6                    see P5.6                  3 still glows
C5 Lamp 6 tried     click on #lamp-6              see P5.8                       same                        none                      none
C6 Wish ready        wish:ready                    see P5.7                       see P5.7                    see P5.7                  card stays still, one soft glow behind it
C7 Wish sent         reader taps send or copy      see P5.7                       see P5.7                    see P5.7                  card clone fades in place, 600 ms
C8 Visitor lamp lit  diya:visitorLit               spark 12 + anar power 6 at the new lamp + row lanterns   spark 8 + anar 60/s + lanterns   spark 5 + 1 lantern    one still glow at the new lamp, radius 110
C9 Closure           after C8                      row lanterns drift on a slow loop while #closure is visible; nothing else  same  same  none
Persons / voice / verdict: no effects. Reading comes first.

Coalescing: lamps lit within 600 ms of each other -> only the last gets an anar (power 6), the rest get a spark pop.
Global limiter: max 4 non-ambient fx:burst per 500 ms; extras dropped.
Anar: cone +/-18 deg, speed 260-420 px/s x m, gravity 600, life 0.6-1.2 s, colours flame-core -> flame-a -> flame-b. Only one anar alive at a time; a new one replaces.
FxDirector exposes: floatCard(el), releaseCard(el) (used by Pack 6, see P5.7).
```

**Check after it builds:**
1. Light lamp 1: a modest fountain rises from behind the skyline right below the lamp.
2. Light lamps 2, 3, 4 in turn: each fountain is a little taller than the last.
3. Tap "Sab diye ek saath jalaiye": you get one fountain, not five on top of each other.
4. The fountain is never a flash; it grows and fades.
5. With Calm on: each lit lamp gets one quiet still glow, no fountain.
6. The lamp row, cards and text are unchanged.

**If it is off:**
Say: "The anar [what you saw: too high, too wide, in the wrong place, at the wrong time]. The cue sheet says [one row of it]. Read the FxDirector code against that row, tell me what differs, then fix only that."

---

### P5.6: Dusk-gold: the rockets that bloom behind the skyline

**Say this:**
Now the quiet big moment, only when all five lamps are lit. When the all-lit event arrives and the room turns dusk-gold, three aasmani rockets climb the sky and bloom into slow, soft shapes behind the skyline. They are warm gold only, never multicoloured, never bright, never fast. Wait for the lamp card sheet to close before starting; if it is still open after twenty seconds, skip the rockets and just show the still glows. The first rocket is on the left, and blooms into a chrysanthemum, a round ball of slowly slowing sparks. The second is on the right and makes a willow, long golden strands that droop. The third is in the middle and is a small chrysanthemum. Leave at least one and a half seconds between bursts. After the third, a gentle shower of marigold petals, then everything settles. Mid tier gets two rockets, low gets one willow. If the reader scrolls, switches tabs or turns Calm on, the sequence pauses or stops cleanly. In Calm and Ink, show three still glows in the sky instead, fading in over two and a half seconds.

**Paste block:**
```
DUSK-GOLD SEQUENCE (starts at diya:allLit, after the lamp card sheet is closed; times in animation seconds, paused when the tab is hidden)
  +0.0  row breathes (Pack 3, not mine). Lamp 5's own anar already fired as power 6.
  +1.4  rocket 1: from 30% of width at the roofline, shape chrysanthemum, burst target about 28% of screen height. Burst around +3.0
  +3.2  rocket 2: from 70% of width, shape willow, burst around +4.9
  +5.0  rocket 3: from 50% of width, small chrysanthemum, burst around +6.5
  +7.5  petals count 12 (drift from the top)
  +12   done. Canvas returns to ambient only.

Rocket: tail particle rises with slight wobble, trail of 6 fading ghost points, 1.4-1.9 s.
Chrysanthemum: stars radial, speed 110-150 px/s, drag 0.965, gravity 40, life 2.4-3.2 s, slow alpha ease-out. High 54 stars | mid 32 | low 14.
Willow: speed 80-110, gravity 70, life 3.6-4.5 s, drooping, flame-core to flame-a. High 40 | mid 24 | low 10.
Burst fade-in 140 ms, peak alpha 0.65, biggest sprite 64 px. No two burst moments closer than 1.5 s.
Tiers: high 3 rockets | mid 2 (chrysanthemum + willow) | low 1 (willow)
Calm / Ink / reduced motion: kind glow x3 at the three target points, radius 140, flame-core (cream in Ink) at 30% alpha, fade in 2.4 s, stay.
Cancel cleanly on Calm on, tab hidden, or reader scrolling past #row-breathes by more than one screen.
```

**Check after it builds:**
1. Light all five lamps: after the card closes, the room turns gold and rockets climb behind the skyline one by one.
2. The blooms are slow and soft, with no white flash; the willow droops.
3. There are never two blooms within a second and a half of each other.
4. Still on a high-end phone, there are no frame drops. Force low quality if you can, you should get one willow only.
5. With Calm on: three soft still glows appear in the sky and stay. No rocket.
6. Reload and light all again: it plays again; nothing fires on its own at load.

**If it is off:**
Say: "The rockets [what you saw]. The paste block says [one line]. Compare the rocket code with it, tell me where it differs, and fix only that."

---

### P5.7: Floating things: the wish card and the row lanterns

**Say this:**
Now floating things, specified so the wish studio and the closure can call them. First, floating card physics for the reader's wish card. Build two functions on the FxDirector, float card and release card, that take the card element. Float card gives it a slow hover bob, a slight parallax drift as the page scrolls, and on a mouse a tiny drift following the pointer. Use transform only, no layout changes. Tell the wish pack's code to call it when the wish ready event fires; check how the card is marked and tell me. Release card is called when the reader taps send or copy. It makes an aria-hidden clone of the card that rises like a paper lantern, swaying, with embers trailing, then fades out. The real card stays in place with all its buttons. Second, row lanterns. When the visitor's lamp is lit, release one sky lantern for each diya in the count written in the link, up to twelve, staggered, drifting up. The visitor's own lantern is slightly bigger, brighter and last. The numbers are never painted on the lanterns; the caption holds the number. Details are in the paste block.

**Paste block:**
```
FLOATING CARD (FxDirector.floatCard(el), FxDirector.releaseCard(el))
  Mark the card element with data-fx-card if it has no stable handle; FxDirector also attaches on wish:ready.
  Bob: translateY +/-6 px, period 5.5 s, sine. Parallax: translateY = clamp(-0.04 x scrollDelta, -14, 14), lerp 0.12. Fine pointer only: +/-6 px follow. Transform only.
  Calm / reduced motion: all of the above off.
  wish:ready extras: ring of 8 twinkles around the card over 1.2 s (high), 4 (mid), 0 (low). Calm: one soft glow behind the card.
  releaseCard: aria-hidden clone, translateY -(0.9 x viewport height) over 2600 ms ease-in cubic, sway +/-12 px, scale to 0.9, opacity to 0. Embers behind it every 120 ms, 8 total max. Remove the clone at the end. Real card untouched. The wish text never goes into the canvas, the store or the URL.
  Calm: the clone fades out in place over 600 ms.

ROW LANTERNS (on diya:visitorLit; count from store.row.count)
  n = clamp(row.count, 0, 12) lanterns + the visitor's own.
  Spread across the width in order, start staggered 300 ms apart, rise 22-30 s per screen, sway.
  Visitor's lantern: 1.25x size, bright = true, starts last, rises slowest.
  Loop on a slow respawn only while #closure is on screen; stop otherwise.
  Tiers: cap lanterns alive: high 13 | mid 8 | low 3. Calm and Ink: Ink keeps them in cream; Calm shows none.
  aria-hidden. No digits drawn.
```

**Check after it builds:**
1. Make a wish card: it hovers with a slow bob and drifts slightly when you scroll.
2. Tap send or copy: a copy of the card floats up like a lantern with embers and disappears; your real card is still there with its buttons.
3. At the end of the page, light your own lamp: a small flight of lanterns rises, your own the last and brightest.
4. The lanterns have no numbers on them; the caption still shows the count.
5. Calm on: card is still, sending fades the clone in place, no lanterns.

**If it is off:**
Say: "The card or lanterns [what you saw] when I [what you did]. Read the floating card and row lantern code, tell me what you find, and fix only that."

---

### P5.8: Little delights, then a safety sweep

**Say this:**
Last in this pack: three small delights, then a sweep. One: a chakri easter egg. A long press on the rangoli floor starts a ground spinner, a spiral of sparks that spins and wanders in a small circle for three seconds, leaving a soft glow ring that fades. At most two at once, with a one and a half second pause between. Two: a shooting star. A quick tap on empty sky, under a quarter second and with no movement, makes a small star glint and streak diagonally for under a second. One every seven hundred milliseconds at most. Three: when someone tries to light lamp six, the proposed one, a single ember rises towards the wick, then fades out before reaching it. Nothing else. It never lights. Calm, Ink and reduced motion get nothing for these. Then the sweep. Remove the Test sparks button. Make sure no cracker can fire without a touch or a story beat. Check that nothing flashes more than three times a second, the caps hold at every tier, and no effect shows text, a number or a result. Tell me what you checked and what you found.

**Paste block:**
```
CHAKRI: long-press 450 ms on the rangoli floor strip (not on lamps). Spiral arms 2, rotation 6 turns/s easing to 2, wander radius 40 px, 3.2 s, then a glow ring (kind glow, flame-a, radius 70, 1.2 s fade).
  Particles: high 40 | mid 24 | low 10. Max 2 alive, 1.5 s cooldown.
TWINKLE: tap < 250 ms, < 10 px movement, target not interactive. Star glint 120 ms then 160 px diagonal streak, 0.7 s, 6-point trail. Max 1 per 700 ms.
LAMP 6 WISP: click or press on #lamp-6: one ember kind rises from the base of the lamp to 70% of the way to the wick, alpha to 0 over 1.2 s. Plays at most once per press. The lamp never lights and nothing changes.
SAFETY SWEEP:
  - Remove "Test sparks".
  - No cracker kind fires without pointer, key or reader-triggered story beat.
  - Flash audit: max 3 per second anywhere; no sprite over 96 px; no full-screen bright change.
  - Caps hold at high 220, mid 120, low 40 (log the max seen, then remove the log).
  - Pause on hidden tab; stop loop when nothing is alive.
  - Calm, Ink, reduced motion: only still glows and still string lights.
  - All effect elements aria-hidden; no text drawn in canvas.
```

**Check after it builds:**
1. Long-press the rangoli floor: a small spinner swirls for about three seconds and leaves a ring; pressing again too soon does nothing.
2. Tap the sky quickly: a small star streaks across; tap again at once and it holds back.
3. Try to light lamp 6: an ember rises and fades just short, the lamp stays unlit, and no other text or lamp changes.
4. "Test sparks" is gone and the page does not fire any cracker by itself at load.
5. With Calm on, none of the three do anything, and nothing flashes.
6. Scroll the whole page on your phone: smooth throughout.

**If it is off:**
Say: "The [chakri / shooting star / lamp six ember] [what you saw]. I want [the one phrase from the prompt]. Read that code, tell me what you find, and change only that."

---

## Risks and cut order

Risks:
- Layering: the canvas must sit between sky and skyline, and above or below text consistently. If Pack 2 built the skyline inside a container that makes this impossible, rockets will appear in front of the skyline; accept that, do not restructure.
- Sparkler long-press can fight native scrolling and text selection on phones; the 10 px cancel and the touchmove block only after activation are the safeguard. If a reader ever loses scrolling, cut the sparkler.
- Mid-range Android: the governor can hide a slow device, but ambient plus a rocket sequence on top of a card sheet may still be tight. Cut ambient first, not the story effects.
- Lantern count versus the "not a visitor count" caption: lanterns are decorative and capped at 12; keep the caption directly visible. If anyone reads them as a visitor count, cut the row lanterns to one.
- The whisper (Aasmaan ko dabaye rakhiye) and the Calm labels are new interface microcopy; approve or reword them in your own voice.

Cut order (cut first, protect last):
1. Shooting star on tap
2. Chakri easter egg
3. Firefly steering toward lamps
4. String-light wave
5. Third rocket, then the willow, then all rockets (keep the still glows)
6. Ambient sky lamps
7. Petals
8. Sparkler
9. Anar on lamp lit
10. Row lanterns and floating card ascent
Never cut: the governor, Calm ("Roshni kam karo"), the visibility pause, the caps, the Ink rules.


---

# PACK 8: QA, EVIDENCE, POLISH AND SUBMISSION

Build position: 8 of 8.

## Pack overview

1. Pack 8 builds nothing new. It checks, captures proof, polishes a little, and gets you submitted. Packs 1 to 7 build; this pack decides whether the result is safe to publish.
2. Parts A to C and F to G are for you (run sheet, how to speak, evidence protocol, video, submission). Parts D and E are spoken prompts, numbered P8.1 to P8.25.
3. Audit prompts say "run it and report, change nothing". Fix prompts only act on what an audit really reported or on a flaw you really saw. Nothing is pre-written about what "went wrong".
4. The page may only claim what exists. The "built by voice" lines are gated on the receipts in Part C. If the receipts do not exist, those lines are deleted, not softened.
5. Run order: P8.3 to P8.15 after Pack 5 is done (feature freeze), fixes P8.16 to P8.18, polish P8.19 to P8.24, then the deployed-URL audit P8.25, video, submit.

---

# PART A. THE MASTER RUN SHEET

## A.1 How to use the clock

I do not know what time you start, so the plan is in hours from "Hour 0". Write the real clock time next to every checkpoint on a sticky note. Work backwards from one number: S, the time you will press Submit. The submission window closes on 4 November with no published hour, so treat tonight as the deadline and choose S with at least two hours of margin before midnight.

Back-plan from S:
- S minus 4 hours: feature freeze. After this, nothing new is added.
- S minus 3 hours: audits finished and fixed, polish starts.
- S minus 2 hours: start the video. It always takes longer than the script.
- S minus 1 hour: deploy final, run the deployed-URL audit, fill the form.
- S: submit. Then the optional post.

If the plan below needs more hours than you have before the freeze, use the compressed plan in A.3 and the cut order in A.4. Do not squeeze the audits.

## A.2 The full plan (about ten hours, in pack order)

Pack order is 1 Foundation, 2 Night world, 3 Lamps and flame, 4 Cards and story interactions, 6 Wish studio, 7 Narrative sections and closure, 5 Fireworks and atmosphere, then this pack.

**Hour 0 to 0:30. Setup and truth pre-gate (no building yet).**
- Flow installed, logged in, working in Emergent's prompt box. Test one sentence.
- Screen recorder ready, set to record the whole screen, not one window. Notifications off. Fresh browser profile with no personal bookmarks or tabs.
- Create the receipts folder on your computer (Part C.4).
- Open website_copy.md. Resolve the items that change the words before you build them: PitDB label ("Phir kya hua" stays unless you confirm which approvals were yours), the person section (keep exactly as written or cut), contact email and LinkedIn for the interview button, résumé link set to "anyone with the link", the five GitHub links that really open.
- Start the recorder and leave it running for the build sessions. Save in segments of 20 to 30 minutes so a crash does not lose everything.
- Checkpoint C0: everything above ticked. If a link or a fact is unresolved, mark it "cut or evidence on request" now.

**Hour 0:30 to 1:30. Pack 1 Foundation, Pack 2 Night world.**
- Checkpoint C1: a dark page loads with no flash of white; the headline "324 tests passed. Then an audit found 19 problems." is visible; skip link works; the page makes zero requests beyond its own files.
- Rollback point saved (use Emergent's version history or save to a repository if it offers one; otherwise export a copy).

**Hour 1:30 to 3:00. Pack 3 Lamps and flame.**
- Checkpoint C2: five lamps; hold, tap or Enter lights the first; the lamp count updates; "Sab diye ek saath jalaiye" lights all; lamp 6 is dashed and never lights; reduced motion shows lit lamps with no animation.

**Hour 3:00 to 4:30. Pack 4 Cards and story interactions. THE VOICE ITERATION HAPPENS HERE.**
- The certgen guess exhibit and the late-reply slider are the natural first thing to speak (it is the one the evidence package suggests). Record this pack with extra care: this is where you capture the one verifiable iteration (Part C.2). Do not stage a flaw. If the first result really has one, say it out loud and correct it. If it really does not, use a real improvement such as a keyboard alternative.
- Checkpoint C3: guess tiles 0, 3, 8, 19 work with keyboard; reveal text and the always-visible plain text both present; slider moves, readouts change at the 3-second deadline for both logics, and says "MODEL OF DOCUMENTED BEHAVIOR".
- Save the receipts now (Part C.4), before Pack 7 can overwrite the thing you corrected.

**Hour 4:30 to 5:30. Pack 6 Wish studio.**
- Checkpoint C4: empty wish shows "Ek line toh likhiye, phir card ban jaayega."; card renders; WhatsApp, copy text, copy link, Badlein all work; the wish never appears in the address bar or in any network request.

**Hour 5:30 to 6:30. Pack 7 Narrative sections and closure.**
- Checkpoint C5: all sections in order (night, lamps, row breathes, lamp 6, person, voice, verdict, wish, closure), 60-second file opens and closes, evidence drawer opens with all eight folders, footer present. The copy is now frozen.

**Hour 6:30 to 7:15. Pack 5 Fireworks and atmosphere.**
- Checkpoint C6: effects run silent, a Calm toggle exists, quality tier can fall. If anything stutters on your phone, lower the tier or remove the effect (the content stays).
- STOP ADDING at the end of this slot, or earlier if any checkpoint ran over by more than 30 minutes.

**Hour 7:15 to 8:30. Audits and fixes (Part D).**
- Run P8.3 to P8.15, read each report, run P8.16 to P8.18. Re-test on your own phone yourself, not only through reports.

**Hour 8:30 to 9:00. Polish (Part E), only if every audit is green.**
- P8.19 to P8.24. Then the quick smoke re-run P8.18 again.

**Hour 9:00 to 10:00. Video (Part F).** Deploy final first so the video shows the live build.

**Hour 10:00 to 10:30. Deployed audit and submit (Part G).** Then the optional post.

## A.3 The compressed plan (about five hours before freeze)

- Merge the setup half hour and Packs 1 and 2 into one hour.
- Spend 1 hour on Pack 3 and 1 hour on Pack 4 (and capture the voice iteration there).
- Pack 6 and Pack 7: 1 hour together, wish step in its smallest form (form, card, WhatsApp button, copy button).
- Pack 5: only a small burst on "all lit", plus the Calm toggle. Nothing else.
- Audits: all of D except the CPU slowdown run may be shortened. Never skip P8.3, P8.4, P8.5, P8.6, P8.7, P8.13 and P8.14.
- Skip Part E except P8.22 (favicon, which removes a real console error).

## A.4 The cut order if time runs out

**Cut first to last (stop as soon as you are back on schedule):**
1. Tiny delights (P8.23), loading moment (P8.19), tab title changes (P8.21).
2. Heavy fireworks tiers: keep one small burst on all lit, drop the rest.
3. Atmosphere particles and parallax (anything not needed to read).
4. The shared-link opening line ("{Name} ne yeh link bheja...") and the row count in the fragment. The copy's build note allows keeping only the lamp row. The lamps still work from the fragment, or from nothing.
5. Extra wish buttons: keep WhatsApp and the card; cut "Link copy kijiye" before "Card ka text copy kijiye".
6. The "Kuch idea chahiye?" optional prompts in the wish step.
7. The 404 page (P8.20) but keep the bad-link line.
8. Last resort: the whole wish step. If this goes, the closure still needs a way for the visitor's lamp to light, so ask Pack 7 for one plain button for it. Tell yourself honestly: this removes your most creative idea. Do it only if the build is at risk.

**Never cut:**
- Lamps 1 to 5 with their "Fair warning" lines. They are the honesty.
- Lamp 6 labelled PROPOSED, NOT RUN, and the "Yeh diya abhi nahi jalega" message.
- Every always-visible plain-text version of every interaction.
- Reduced motion and the Calm toggle.
- The 60-second file and the evidence drawer.
- The closure ("Aapka diya jal utha") and the sign-off.
- The footer lines 1, 2, 3, 6 and 7, and the truth of lines 4 and 5.
- The held-out-number scan, the claims scan, the network audit, the fragment fuzz test, the storage audit.
- The voice evidence (or the deletion of every voice-built claim).
- The video and the form.

## A.5 When to stop adding and start testing

Three signals, any one is enough:
1. Clock: S minus 4 hours.
2. Pack 5 finished (fireworks done) or its slot ended.
3. A checkpoint failed twice in a row. Stop adding and fix the existing build.

After the freeze, a change is allowed only if it traces to (a) a failed audit line, or (b) a flaw you personally saw on your own phone. Write down each change with its reason. That list is also honest material for the video.

## A.6 Credit and tool risks

- Keep about 15 percent of your Emergent credits or time for Part D. Do not spend them on tiny cosmetic prompts earlier.
- If Emergent cannot run a real browser in its environment, its reports on speed or layout are guesses. The audit prompts tell it to say so plainly. Then you do those checks by hand using the manual list under each prompt.
- Always check the public deployed URL, not only the builder's preview. Preview links often need a login and may add things your code did not (Part G).

---

# PART B. HOW TO SPEAK THE PROMPTS

## B.1 The idea

The "Say this" briefs are not scripts. They are what you should have in your head when you press the Flow key. Read one through, put the page down, and say it the way you would explain it to a friend sitting next to you. The words will differ every time. That is correct. The judges want to see you thinking out loud and Flow keeping up.

Why this matters for honesty: the page, the video and the form will say you spoke to Emergent with Flow. That has to be literally true, and it has to be visible in your Flow history.

## B.2 Rules of thumb

- **Do not paste a "Say this".** Pasting makes your history look like typing, and breaks the claim.
- **Do paste a "Paste block".** Exact lists (forbidden strings, the sign-off logic, a footer line) are data, not thoughts. Pasting them is honest. In the video, say "I pasted the exact copy" if it comes up. Never describe a pasted block as spoken.
- **One idea per breath.** Speak 30 to 60 seconds, stop, read what Flow put in the box, then continue in the same box. Two minutes is the longest sensible stretch.
- **Pause for a full second at the end of each sentence.** Flow places the punctuation better, and you get time to think.
- **Say numbers as numbers.** "Three hundred twenty four" usually comes out as 324; look at it before you send. If a number comes out wrong, fix it by speaking, not by typing, unless it is a one-character slip.
- **Leave small transcription slips alone** unless they change meaning. They are your proof the text was spoken. If the meaning is wrong, say a correction ("Sorry, I meant the second lamp, not the first").
- **Read before you press Send.** Always. A wrong word in an audit prompt wastes credits.

## B.3 Tricky terms, how to say them

- Deepavali: say "Deepavali" clearly; if Flow writes "Diwali", fix it, because the page uses one spelling.
- The part of the link after the hash sign: say "the part of the address after the hash sign". Avoid saying "fragment identifier" fast.
- Reduced motion: say "the reduced motion setting on the phone".
- Screen reader names: "the name a screen reader says out loud for each button".
- Contrast: "text colour against background colour, double A level".
- Frames per second: "sixty frames per second", or "smooth".
- Section names: say them as words: "the night section", "the lamps section", "where the row breathes", "lamp six", "the person section", "the voice section", "the verdict", "the wish step", "the closure", "the sixty second file", "the evidence drawer".
- Events and code names: do not say them. Say what happens: "when a lamp finishes lighting, the count goes up". Packs 1 to 7 carry the exact names.
- Hinglish lines: do not dictate the exact page copy in Hinglish; Flow may write Devanagari or alter spelling. Paste exact Hinglish text (Paste block) or refer to the copy file by section: "use the opening line exactly as in the copy file". Dictate your intentions about it in English.
- Hinglish in your own explanations is fine if Flow handles it. If it comes out strange, switch to English for that sentence.

## B.4 Keeping Flow visibly active on the screen

- Keep Flow's on-screen indicator visible during every dictation. Do not hide it behind the builder window.
- Record the whole screen, not one tab.
- Keep the Flow history open in a small second window on the side if you can. After the iteration clip, show the history entry with its time.
- Do not cover the prompt box with the recorder's overlay.
- Do not edit text mid-take with the keyboard. If you must, say so on camera: "Typing one character".
- Do not dictate secrets: emails, passwords, tokens, anything private. Flow history stores what you said.

## B.5 Why the spoken correction matters

A prompt you spoke before seeing anything proves you can speak a prompt. A correction you speak after looking at real output proves the actual loop: look, notice, say it. That loop is both what the challenge is judging ("use of voice") and the only part of the process you cannot fake without it showing. It is also where your judgment shows. So never skip it and never write it beforehand. The first result will tell you what to say. If the first result is good, pick one real improvement, say why you chose it, and speak that instead. Never claim a flaw that did not happen.

---

# PART C. THE VOICE-BUILD EVIDENCE PROTOCOL

## C.1 The truth about where you stand

The evidence package states it plainly: the recorded Flow-to-Emergent build-and-correction evidence did not exist yet. The copy file says the same. Until you capture it, no sentence anywhere may say you built the page by voice. This protocol creates it. It is not optional: authentic Flow use is a core challenge requirement.

Also keep the ledger limit: no claim of Flow use before 1 November 2026. Say nothing about earlier use, or about how long you have used it.

## C.2 What to record

Record continuously during the build sessions (raw screen recordings, in segments). Then pull out the one verifiable iteration. It has five beats, in this order, with no cuts inside it:

1. **A spoken instruction.** Flow indicator visible. You speak a real instruction into Emergent's prompt box. The text appears in the box. Do not edit it before sending. Suggested first instruction (the package's own suggestion): build one simple exhibit for a nontechnical recruiter, starting with 324 passing tests on a certificate generator, ask them to guess what a later audit found, reveal nineteen findings. Put it in your words.
2. **The first real result.** Emergent builds it. Capture the screen as it loads, then a still of the result at phone width.
3. **A flaw you actually notice.** Look at the result for as long as you need. Say aloud what you see. Examples are only examples: a confusing label, a motion that distracts, a button too small, a keyboard gap. Only a flaw that is really there.
4. **The spoken correction.** Same box, Flow visible. Say what you saw and what you want. Send it unedited.
5. **The revised result.** Capture the change and a still at the same width.

Before and after pairs must be the same screen at the same width so a viewer can compare.

If, after looking, there is no flaw, do not invent one. Choose one real improvement. The package suggests the keyboard alternative. Say your reason out loud.

## C.3 Hiding personal identifiers without hiding the proof

- Use a clean browser profile. Close mail, chat and calendar. Turn on Do Not Disturb.
- Hide your Flow account email and your Emergent account email. Keep the visible proof that Flow is running (its indicator and a history entry with date and time).
- Blur in the edit, never in the original. Keep the originals unblurred in a private folder.
- Do not blur the prompt text or the result. They are the evidence.
- Check the history entries you show for private content before you capture them. Crop to the relevant entries.
- Never show the challenge form fields or your phone number.

## C.4 Saving the receipts, with dates

Make a folder named build-receipts. Inside, files named with the real date and time:

- 2026-11-03_HHMM_step1_spoken-instruction.png (the prompt box showing Flow's text)
- 2026-11-03_HHMM_step1_prompt-text.txt (the same text copied exactly as sent)
- 2026-11-03_HHMM_step2_first-result.png
- 2026-11-03_HHMM_step3_flaw-note.txt (one or two sentences, in your own words, written right then, saying what you noticed)
- 2026-11-03_HHMM_step4_spoken-correction.png and _prompt-text.txt
- 2026-11-03_HHMM_step5_revised-result.png
- 2026-11-03_HHMM_flow-history.png (the history showing both dictations with times)
- 2026-11-03_HHMM_raw-recording.mp4 (the unedited iteration, kept private; a trimmed copy for the video)

Do not rename or re-save images in ways that change their dates. Keep the originals. Add a short README line of your own listing what each file is. Do not write anything in it you cannot back.

Check one more thing before you save the receipts as final: **the corrected detail must still exist on the live page.** If a later pack overwrote it, the line "I looked at what it made and dictated a correction" is not about this page. Either redo the correction on the live build, or do not link that before and after.

## C.5 What the footer line may truthfully say

The footer's line 5 as drafted ends with "Only the two takes above were spoken with Wispr Flow." That sentence is correct about the text on the page (only two takes are Flow transcripts), but it sounds as if you did not use Flow to build the page. Rewrite it so it states both facts. Choose exactly one variant, by what is true.

Variant A. Evidence exists, and most prompts were spoken:
"I built this page by speaking directions to Emergent through Wispr Flow, then checking and correcting what it made. The code was generated by Emergent. The words on the page are not Flow transcripts, except the two 2 November takes. The Hinglish lines were drafted with AI help and approved by me."

Variant B. Evidence exists, but some prompts were typed or pasted (most likely, since exact copy was pasted):
"I spoke many of the directions for this page to Emergent through Wispr Flow and pasted the written copy. Emergent generated the code. The words on the page are not Flow transcripts, except the two 2 November takes. The Hinglish lines were drafted with AI help and approved by me."

Variant C. Evidence does not exist:
"Built with Emergent. The Hinglish lines were drafted with AI help and approved by me. Only the two takes above were spoken with Wispr Flow."
(And you must then accept that the challenge's voice-build requirement is unmet. Do not claim otherwise anywhere.)

Fill in nothing you cannot show. The words "many" and "most" must match the real proportion in your Flow history. Do not state how long you have used Flow.

Footer line 4 (no analytics, cookies or third-party script) is only true if the deployed page, on the public URL, passes P8.3 and P8.14. If the hosting adds anything you cannot remove, change the line to say exactly what your code does ("This page's code makes no third-party requests, sets no cookies and uses no analytics.") or delete it. Do not leave a line the browser can disprove.

## C.6 What to delete if the evidence does not exist

If the iteration was not captured, delete or change all of the following, then re-run P8.6:
- The gated line in the voice section ("I spoke some of the directions...").
- Footer line 5, use Variant C.
- The video lines about speaking into Emergent and the "this is the actual before and after" segment (replace with the Flow history takes only, which are real).
- Any form answer, post or message claiming a voice-built page.
- Any page title, meta description or share text mentioning "built by voice".
- The sentence in the post draft marked gated (G.4).

## C.7 Two prompts for this protocol

### P8.1: Set the footer line by what is true

**Say this:**
I need you to update the footer line about how this page was made. Please read this carefully, because it is a statement about honesty. I am going to paste the exact footer line I have chosen. Please put it in place of the current line five in the footer, word for word, and do not rewrite it, soften it or add anything. Leave the other footer lines exactly as they are. After you do it, tell me the full text of all seven footer lines so I can read them. Also tell me whether the footer line about no analytics, cookies or third party scripts is still there, and whether anything in the code of this page could make that untrue, such as a script, a tracker, a font loaded from outside, or a cookie. If you find any of those, list them and do not remove them yet. Keep the Hinglish phrases in their own language wrapper as before and keep the page language as before. Do not change the festival sign-off, and do not print any date.

**Paste block:** the one variant from C.5 that is true for you, copied exactly.

**Check after it builds:**
- The footer shows seven lines in order, and line five is exactly your pasted variant.
- No other footer line changed.
- Only the two Take labels on the page say "Spoken with Wispr Flow".
- The report lists any scripts, trackers, outside fonts or cookies honestly, or says none.
- The Hinglish phrase wrappers and the page language attribute are unchanged.

**If it is off:** Say "Line five is not word for word the same as what I pasted; put back my exact text and change nothing else in the footer."

### P8.2: Link the real before and after under the voice section

Do this only if all five receipt files exist (C.4) and the corrected detail is on the live page.

**Say this:**
In the voice section there is a gated line about how I built this page. I now have real recordings and screenshots, so I want to enable that line. Please show that line exactly as in the copy file, and below it show two small images side by side: the first result, and the revised result, with the real date and time of each in plain text under each image. I will give you the two image files and the two times. Use only the files I give you and store them as part of the page itself, so the page makes no outside requests. Give each image a plain description of what it shows, written from the file names I give you and nothing else. Make sure they are readable on a phone, and tapping an image can open it larger and close again with the keyboard. Do not add any other claim, do not say how long I spent, and do not describe what I said unless I paste it. If I did not give you the files, do not add the line at all. Add the images to the existing voice section; do not make a new section.

**Paste block:** the two dates and times, and one sentence describing in your own words what changed between the images.

**Check after it builds:**
- The gated line appears only because the images exist.
- Two images, same size, labelled with the real times.
- The page makes no new outside request when it loads (re-run P8.3 quickly).
- Escape closes the enlarged image; focus returns to the thumbnail.
- The line does not claim more than the images show.

**If it is off:** Say "I only gave you two images and two times; remove [name what you saw that I did not give you] and keep the rest."

---

# PART D. VERIFICATION PROMPTS (THE P8 SERIES)

How to run this part: after the freeze, one prompt at a time. Each audit says "report, change nothing". Read each report yourself, and for the ones marked MANUAL, do them with your own eyes on your own phone as well. If Emergent says it cannot run a real browser, that is an acceptable answer. A guessed report is not.

### P8.3: Network-request audit

**Say this:**
I want a network audit of the page, and I want you to change nothing. Please open the page in a real browser, load it fresh with an empty cache, and record every single request the page makes, from the first moment until fifteen seconds after it settles. Then do it again while I use it: hold to light the first lamp, light all the lamps, open a lamp card, open the sixty second file, open the evidence drawer, make a wish card, and press every share button. For each request give me the address, the type, and whether it is the page's own origin or somewhere else. The rule is zero third party requests. No fonts from outside, no scripts from outside, no analytics, no images from outside, no preview badge, no tracking pixel. If the hosting adds anything that my code did not ask for, list it separately and say that it came from the platform. Also confirm there is no audio element, no audio context, nothing that plays sound, and no media that autoplays. If you cannot run a real browser in your environment, say so plainly instead of guessing.

**Check after it builds:**
- A written table of all requests with origins, for load and for the interaction pass.
- The count of non-own-origin requests is zero, or each one is listed with its source (code or platform).
- No audio of any kind reported.
- Share buttons only open outside links on tap, not on load.
- You also did the MANUAL check: open the browser's network tool in a private window, reload, and look for any other domain.

**If it is off:** Say "Your table did not include [name the stage you noticed missing]; run that stage again and add its requests."

### P8.4: Console errors and warnings playthrough

**Say this:**
Please run a full playthrough of the page and capture everything the browser console says, errors, warnings and anything else, and report it back. Don't fix anything yet. Do it twice, once at a phone size and once at a laptop size. In each, do this in order: let the page load, hold to light the first lamp, tap the other lamps one by one, open and close every lamp card, move the late reply slider from zero to six seconds with both logics, play with the guess tiles, open the sixty second file and the evidence drawer and every folder in it, drag the flame in the voice compare, type a wish, make the card, press every share button, press Badlein, and press Phir se shuru kijiye. For each console line tell me the exact action that caused it. Also tell me about any request that failed, including a missing icon, because a missing icon counts. If the console is clean, say that. If you can't run a real browser, tell me that plainly and don't guess.

**Check after it builds:**
- A list of console lines with the action that caused each, or an explicit clean result.
- Both phone and laptop sizes covered.
- Missing icon or missing file errors are reported, not skipped.
- You also did the MANUAL check: open the console on your phone's browser or your laptop and do the same walk.

**If it is off:** Say "The report said clean but I saw [what you really saw in the console] when I did [action]; find where that comes from."

### P8.5: Forbidden strings and leftover tokens

**Say this:**
Please scan everything this page ships for leftover or forbidden text, and report every hit with where it is, but don't change anything. Scan the visible text, the page source, the scripts, the style sheets, the data files, the page title and meta tags, the share preview text, image descriptions, screen reader names, and anything hidden, including comments. I'm going to paste the exact list of things to search for. Search without caring about upper or lower case. For a few of them, such as the word tum and its family, match whole words only so that ordinary English words don't count. For each hit, tell me the file or place, the line, and about thirty characters around it, and say whether it's visible to a visitor or hidden. If something shows up only in a note that never ships, say that too. And then tell me which words I should look at again, because a hit is not always a problem; it is just something I should read.

**Paste block:**
Placeholders and drafts: lorem, ipsum, TODO, FIXME, placeholder, DRAFT, SAMPLE, REVIEW, REVIEW DRAFT, [FILL IN, [CONFIRM, undefined, NaN, null shown as text, any curly brace token such as {N}, {Name}, {wish}, {YourName}, {link}, {t}.
Held-out numbers: 40.62, 0.585, 629.70, 2.7x, 2.7×, 26.5x, 26.5×, 1.08x, 1.08×.
Festival dates: 8 November, 9 November, Nov 8, Nov 9, 8/11, 9/11, 08-11, 09-11, Sunday 8, and the word Diwali (the page spells it Deepavali).
Wrong register: whole words tum, tumhara, tumhari, tumhare, tumhe, tumse, tumne, tumko, tera, teri, tere, tujhe, tu.
Crackers: cracker, crackers, patakha, pataka, bomb, bang, boom, loud.
Analytics and external: google-analytics, gtag, googletagmanager, plausible, hotjar, segment, mixpanel, posthog, fonts.googleapis, fonts.gstatic, cdn, unpkg, jsdelivr.
Not-allowed phrases for review: guilty, caught, danger, "growth win", "I own", "increased", "lift of", "customers", "in production", "deployed".

**Check after it builds:**
- A hit list grouped by category, with location and visible/hidden.
- Zero hits on held-out numbers (anything found is a stop-ship item, even in a comment or data file).
- Zero hits on festival dates and on the tum family. The two 2 November dates in the voice section are legitimate and are not festival dates.
- Hits for "customers", "growth win", "deployed" and "in production" are read in context: the verdict says you have not owned a channel or shipped to customers, the lamp 5 and Vigil fair warnings say there was no production deployment. A denial is fine. A claim is not.
- You also did the MANUAL check: use the browser's find on the page for 40.62, 629.70 and Diwali.

**If it is off:** Say "You listed [the hit] as fine but the paste block says it must be zero; remove it from the shipped files and run the scan again."

### P8.6: Claims, numbers and attribution reconciliation

**Say this:**
Please check the page against the copy file, section by section, and report every difference. Change nothing. First, make a table of every number on the page and the sentence it is in, and compare it with the copy file. The numbers I expect are 324, 19, two high, 26 MB, 192 MB, 479, 232, 105, 1,205, 1,850, 3.1 times, 1.02 times, 820, the two times 06:15 and 06:00, the three second deadline, the zero to six second slider, and the two dates and times of the voice takes. Report any number that is not on that list. Second, count how many places say Spoken with Wispr Flow; it must be exactly two, on Take 1 and Take 2. Third, confirm each project has its Fair warning, and that lamp six says proposed, not run, and has no sample size, no threshold and no expected result. Fourth, confirm the verdict says I have not owned a growth channel or shipped to customers. Finally, list anything that sounds like a win, a measured result, a customer, a production launch, or a hiring result.

**Check after it builds:**
- A number table with no number outside the expected list.
- "Spoken with Wispr Flow" count is exactly two.
- Five Fair warning blocks present, lamp 6 compliant.
- Lamp 5 still says the correction is not yet reflected in the public default branch, and the label is still "Phir kya hua" unless you confirmed your approvals.
- No sentence that reads like a win or a launch.
- The word "Spoken" is not used anywhere else, including the share preview or the footer.

**If it is off:** Say "The copy file says [quote the copy file line] but the page says [quote the page line]; make the page match the copy file."

### P8.7: Reduced motion and the Calm toggle

**Say this:**
Please test how the page behaves with reduced motion and with the Calm toggle, and report. Change nothing. First, turn on the reduced motion setting in the browser and load the page fresh. Tell me whether anything still animates: flames, fireworks, glow pulses, parallax, the flame travelling to the visitor's lamp, smooth scrolling. I expect nothing moves and the final states are shown. Check that the hold to light, the tap, Enter and the Sab diye ek saath jalaiye button still work and still light the lamps. Check that the line Motion off hai is shown. Then, with reduced motion off, press the Calm toggle and tell me exactly what changes; confirm the content stays the same and nothing disappears. Check that the toggle can be reached by keyboard, has a visible focus mark, a clear name, and says whether it is on or off. Tell me whether the effects respond straight away, and whether the choice is remembered anywhere. It should not be saved anywhere on disk. Finally, check the fireworks are silent and visual only.

**Check after it builds:**
- With reduced motion: zero running animations or transitions, lit lamps shown in their final state, all interactions still work.
- Calm: motion and effects stop or soften at once; no text is lost.
- Calm toggle has a name and an on/off state for screen readers.
- Nothing about Calm is saved to storage.
- You also did the MANUAL check on your phone: turn on reduce motion in the system settings and walk the page.

**If it is off:** Say "With reduced motion on, [name the thing you saw moving] still moved; make it show its final state with no movement, and test that again."

### P8.8: Three widths

**Say this:**
Please check the page at three widths and report what you find, without changing anything. The three are three hundred sixty wide, three hundred ninety wide, and thirteen hundred sixty six wide. At each width, load the page and scroll the whole thing top to bottom. Tell me about horizontal scroll, clipped or overlapping text, text that is too small to read, content hidden behind a fixed bar, anything cut off by the phone's rounded corners or the bottom bar, and buttons or links that are smaller than forty four pixels in both directions. Measure the interactive elements and list any that are smaller. Check the hold to light button, the lamps, the slider thumb, the guess tiles, the share buttons, the toggles and the close buttons. Then open the lamp card sheet, the sixty second file and the evidence drawer at each width and check they fit, scroll inside, and close. Finally test turning the phone to landscape at three sixty and three ninety. Include a screenshot of any problem and where on the page it was.

**Check after it builds:**
- No horizontal page scroll at any width.
- Every tap target is at least 44 by 44 pixels, or the list says which are not.
- The overlays fit the screen and have a visible close.
- The slider thumb and guess tiles are comfortably tappable.
- You also did the MANUAL check: open the page on your own phone and scroll with one thumb.

**If it is off:** Say "At [width] I saw [what you saw] in [section]; fix that spot only, then check all three widths again."

### P8.9: Four-times CPU slowdown run

**Say this:**
I want a performance test that simulates a mid range Android phone, and I want a report, not changes. Open the page in a real browser, slow the processor down by four times, and use a phone sized screen. Then load the page, let it settle for ten seconds, scroll the whole page slowly and quickly, hold to light the first lamp, light all lamps, trigger the fireworks, open the card sheet and close it, and drag the slider. Measure the frames per second during each stage, and any long tasks over fifty milliseconds. Tell me the lowest and average frame rate for each stage. I'm looking for sixty frames a second, and anything below about forty five is a concern. Also tell me whether the quality tier lowers itself when the page struggles, which tier it ended on, and whether the page stays readable and usable at the lowest tier. Then repeat with Calm turned on and with reduced motion. Say clearly if you cannot measure frames in your environment; do not estimate.

**Check after it builds:**
- A stage-by-stage frame rate table, or an honest statement that it could not be measured.
- The quality tier drops under load and recovers sensibly.
- Lowest tier is still readable and complete.
- Fireworks never block a tap on a button.
- You also did the MANUAL check: use your own phone, fireworks and scrolling, and tell yourself honestly whether it feels smooth. If not, lower the tier or cut the effect, never the content.

**If it is off:** Say "The stage where it dropped was [what you noticed]; reduce only the effect in that stage, and test again."

### P8.10: Keyboard-only walkthrough

**Say this:**
Please do a keyboard only walkthrough of the whole page, using only Tab, Shift Tab, Enter, Space, the arrow keys and Escape, no mouse. Report what you find and change nothing. Start from a fresh load. Check that the first Tab goes to the Skip to main content link and that it works. Then go through every interaction in order: light each lamp with Enter, use the light all button, open each lamp card and close it, the guess tiles, the late reply slider with the arrow keys and both logic buttons, the voice compare flame with the arrow keys and the Read it plainly toggle, the sixty second file opening and closing, the evidence drawer with all eight folders, the wish form and every button after the card is made, the Calm toggle, and the links in the closure. Tell me the focus order, any place where focus is invisible, lost, or trapped, whether Escape closes every overlay, and whether focus returns to the button that opened it. Report anything the keyboard can reach that the mouse can do but also anything it cannot do.

**Check after it builds:**
- A numbered focus order that matches the visual order.
- A visible focus mark on every stop.
- Every overlay: Escape closes, focus returns, background is not reachable while open.
- Every interaction has a keyboard way and a plain-text twin.
- You also did the MANUAL check: unplug the mouse for five minutes and walk it yourself.

**If it is off:** Say "Keyboard focus got lost when I [name the action you did] in [place]; make focus go to [what you want] and test only that path again."

### P8.11: Screen reader names, landmarks and language

**Say this:**
Please check what a screen reader will say. Report, don't change. First list every interactive element with the name a screen reader would say for it: buttons, links, lamps, tiles, sliders, toggles, form fields, close buttons and share buttons. I want every name to be unique and meaningful, so the five receipt links must be told apart by project, and the lamp buttons should say which lamp and whether it is lit. Then list the headings in order and tell me if there is exactly one main heading and no skipped levels. List the page landmarks. Check that decorative lamp art and the fireworks are hidden from screen readers and the important images, such as the wish card and the share preview image, have a real description. Check that live announcements happen when a lamp lights and when the card is ready, and don't repeat. Check the page language is Indian English, and that Hinglish phrases are marked with their own language. Finally check that the English names for assistive technology do not contain Hinglish.

**Check after it builds:**
- No two links or buttons with the same name pointing to different things.
- Lamps announce their number and lit or unlit state.
- One h1, orderly headings, landmarks present.
- Dialogs have a name and role; the fireworks layer is hidden from assistive tools.
- You also did the MANUAL check: turn on TalkBack on your phone and listen to the first two screens.

**If it is off:** Say "The screen reader name for [element you checked] is [what it said]; it should say [what you want]."

### P8.12: Contrast

**Say this:**
Please check contrast across the whole page and report with real measured numbers. Change nothing. The page is dark with warm gold light, so I'm worried about small dim text. Test text against its real background at double A level, which is four and a half to one for normal text and three to one for large text, and three to one for interface parts such as borders, focus marks, toggles, the dashed outline on lamp six and the slider track. Check these in particular: the small italic lines about the number in the link not being a visitor count, the Fair warning blocks, the kicker labels, the hint under the hold button, the placeholder in the wish field, disabled looking elements, link text inside paragraphs, and text that sits on top of glows or gradients. Test again in the bright moment of a firework and in the dusk gold room after five lamps. For each failure give the colour pair, the measured ratio, and the place.

**Check after it builds:**
- A list of any pair under the required ratio, with location.
- Text over glows measured at the worst case, not just the average.
- Focus mark visible against both dark and gold.
- Lamp 6's dashed outline still visible.
- You also did the MANUAL check: turn the phone brightness down to half and read the small lines outdoors if you can.

**If it is off:** Say "[Name the text you struggled to read] is hard to read; raise its brightness until it passes double A and tell me the new ratio."

### P8.13: Share-fragment fuzzing

**Say this:**
Please try to break the part of the address after the hash sign, where the lamp count and a first name are kept. Report what happens, and change nothing yet. Open the page with all of these in turn and with every unusual input you can think of: nothing at all, a garbled string of random characters, a count that is negative, a count with letters, a decimal, a gigantic count of fifty digits, a count of zero and one, a very long name of ten thousand characters, a name with a script tag, a name with an image tag that tries to run code, a name with angle brackets and quotes, a name with emoji, Hindi script, right to left script and invisible characters, bad percent encoding, a fragment of one megabyte, several hash signs, odd keys such as double underscore proto, and a newline in the name. For each, tell me what the page shows, whether any code ran, whether the page still works, and whether there are console errors. The expected result is that names are limited to letters and about twenty characters, counts are capped at ninety nine plus, everything is plain text, and bad links show the bad link line and still start the row. Also confirm the wish text never goes into the address.

**Check after it builds:**
- No script ever runs; text is always plain text.
- Gigantic counts are capped; negative or odd counts fall back safely.
- Bad input shows the bad link line and the row starts normally.
- A 1 MB fragment does not freeze the page.
- Typing a wish never changes the address bar; also the address is never sent to a server.
- You also did the MANUAL check: paste three odd addresses in your phone and look.

**If it is off:** Say "With this input [paste the exact input you tried], the page showed [what you saw]; make it fall back to the bad link line and test that same input again."

### P8.14: Storage, cookie and cache audit

**Say this:**
Please audit everything the page might store on a visitor's device. Report, don't change. Load the page fresh in a clean private profile, go through the whole experience, including lighting all lamps, using the calm toggle, writing a wish and making a card, and then list what is stored. Check cookies, local storage, session storage, indexed databases, cache storage, service workers, and anything stored in the window name or the history state. The expected answer is nothing at all, because the page says it does not save a wish and the footer says it uses no cookies. Also check that reloading the page after lighting lamps starts fresh, apart from what is in the address after the hash sign. Then tell me whether the hosting platform sets any cookie or stores anything that my code did not. List those separately, with their names, and say that they come from the platform. Please do not remove anything yet.

**Check after it builds:**
- Cookies: none from the page. Storage areas: all empty.
- Reload starts fresh (except what is deliberately in the address).
- Platform-set cookies, if any, are listed separately.
- If any storage exists, the footer privacy line and line four must be changed or the storage removed. Decide which before submission.
- You also did the MANUAL check: in a private window use the browser's application panel to look at cookies and storage.

**If it is off:** Say "I opened the storage panel and saw [what you saw]; explain where it comes from before changing anything."

### P8.15: The sign-off date check without printing a date

**Say this:**
The closing line says Shubh Deepavali, and after the festival it should change to Shukriya. The page must never print any festival date. Please test that behaviour using a pretend clock, and report. Don't change anything yet. Set the pretend date to a day well before the festival, to the eighth and ninth of November, to the tenth, and to a month later, and for each tell me which sign-off is shown. Also tell me exactly how the page decides, and whether it uses the visitor's device clock only, with no outside request. Tell me what happens if the visitor's clock is wrong, or if the date cannot be read, and what shows in the print view and in the share preview. Tell me whether any date or the word festival date appears anywhere in the shipped text. And tell me what the sign-off is on the day I submit.

**Check after it builds:**
- A day-by-day table of the sign-off.
- The decision happens locally, with no network request.
- If the date cannot be read, Shubh Deepavali is the default, not an empty line.
- No festival date appears in text, titles, descriptions or comments.
- Your preference noted: copy says swap after 9 November; confirm the page agrees.

**If it is off:** Say "On [the pretend day you tested] it showed [what it showed]; the copy file says it should show [what it says]."

### P8.16: Fix-it, triage and fix in severity order

Run this only after you have read the audit reports above.

**Say this:**
I have read all the audit reports. Now I want you to fix what they found, and only that. Please make a list of every problem the reports found, in this order: first anything that breaks the rules, which are a third party request, a stored item, a held out number, a festival date, a wrong word like tum, a claim the copy file does not make, or Spoken with Wispr Flow on the wrong text; then anything that stops a person using the page, such as a keyboard trap, a tap target smaller than forty four pixels, text I can't read, or something that breaks on a phone; then speed problems; then anything cosmetic. Tell me the list before you start. Fix one at a time, and after each fix run the exact check that found it and tell me the result. Don't add features, don't rewrite any copy, don't change any fact, and don't change anything that wasn't in a report. If a problem needs a decision from me, stop and ask. If a problem comes from the hosting platform and not from my code, tell me and don't try to work around it.

**Check after it builds:**
- The list in the order given, before changes.
- One fix, one re-check, one result each.
- No copy changes you did not ask for (ask for a before and after of the copy file text if unsure).
- Platform-caused issues are reported, not hacked.
- At the end, a list of what remains.

**If it is off:** Say "You fixed [thing] but it was not in any report; undo that one and keep the rest."

### P8.17: Fix-it, one thing I saw myself (the spoken correction pattern)

This prompt is a pattern. Fill it only with what you really saw. It is also the template for the real correction in the voice iteration.

**Say this:**
I looked at the page myself on my phone and I want to correct one thing. Say what you saw, in plain words, as you would to a friend. Tell Emergent where you were, what you did, what you expected, and what actually happened. For example you might say where on the page it was, which button you pressed, and what you saw instead of what you wanted. Then say what you want instead, in one sentence, and what you do not want changed. Finish by asking it to tell you what it changed, and to show you the result before and after at the same screen size. Do not guess about the cause; ask it to find the cause first and to tell you before it changes anything if the fix would touch more than that one place. Keep this to one issue per spoken message. If you have three issues, you do three messages, because that makes each fix easy to check and each correction a real one.

**Check after it builds:**
- It names the cause before editing, or says it is not sure.
- Only the place you named has changed.
- Before and after at the same size.
- It did not touch the copy or any fact.
- The other lamps and interactions still work (a quick tap through).

**If it is off:** Say "That is not what I meant. What I saw was [say again what you saw]. Please put it back and try again on that only."

### P8.18: Smoke re-run after fixes

**Say this:**
Fixes are done, so I want a quick smoke test to make sure nothing has broken, and I want a short report. Please run these in a real browser: the network audit with a count of outside requests, the console during a full playthrough, the scan for forbidden strings and leftover tokens using the same list as before, the check that Spoken with Wispr Flow appears exactly twice, the storage check, the reduced motion check, and a keyboard run through the lamps, the sixty second file and the wish step. Use the same phone width and a laptop width. Report each as pass or fail with one line of detail. Only report. If any fails, say what changed since the last time you passed it. If you can't run a real browser, say so plainly. At the end give me a single sentence I can believe: either that all checks passed, or exactly which ones did not.

**Check after it builds:**
- Eight pass or fail lines with a detail.
- Zero outside requests, zero console errors, zero held-out numbers, two Spoken labels, empty storage.
- The final sentence is honest about anything not run.
- You compare it with the earlier reports and look for anything newly failing.

**If it is off:** Say "You said pass for [check] but I saw it fail when I [what you did]; run that check again and show me the evidence."

---

# PART E. POLISH PROMPTS

Only when every audit is green. Every polish prompt is cheap, silent, adds no new facts and uses no new copy. Where a polish needs words, it may reuse only strings already in website_copy.md. If a polish tempts you to write a new line, skip it.

### P8.19: First frame and loading moment

**Say this:**
I want the very first moment of the page to feel finished. When someone opens the link, the screen should already be dark, the colour of the night, from the very first frame, with no white flash and no jump when the style sheet and fonts arrive. The first flame, the one that is already lit, should be visible straight away, even before the rest of the page is ready. Do this with what is already in the page, with nothing loaded from outside. I don't want a loading spinner or loading words. If the rest takes a moment, the dark page with the small flame is the loading moment. If scripts fail to run or the visitor has them turned off, the headline, the lamps and all the text must still be readable, and the plain text versions of the interactions must still be there. Respect reduced motion: with it on, the flame is simply lit and still. Keep the page small and don't add libraries. Tell me the time it takes to show the first headline on a four times slower processor.

**Check after it builds:**
- No white flash on reload, in a private window, at phone width.
- Headline and the first flame show before the heavy parts.
- With scripts off, the page still reads (the copy and plain-text twins).
- No loading words or spinner.
- No extra outside request.
- A first-headline timing is reported or an honest statement that it could not be measured.

**If it is off:** Say "On first load I saw [what you saw: a white flash, a jump, an empty screen]; fix only that and check it again."

### P8.20: Bad link and 404

**Say this:**
Please handle a bad link and a missing page gracefully, with warmth and without adding any new copy. For a garbled part after the hash sign, show the line that is already in the copy file for a bad link, which says the link looks a little different and the row starts here. Keep it small and polite, not an error box, and let the row start normally. For a mistyped address on the site, a page that does not exist, show a simple dark page in the same night style with one small unlit lamp, the same bad link line, and one button that says Phir se shuru kijiye, which takes the visitor to the start. Use only words that already exist in the copy file. Do not use the words error, wrong, fail, or not found. The page should be a plain file that makes no outside requests. It must work on a phone and with a keyboard, have a proper title and not be indexed. Tell me what the hosting does for unknown addresses and whether this page is actually used by it.

**Check after it builds:**
- A garbled fragment shows the warm bad link line and the row starts.
- An unknown address shows the night 404 with one button.
- No banned or alarming words.
- The hosting really serves it (test with a made-up address on the deployed URL; if it does not, say so and drop the 404 page).
- No new outside request.

**If it is off:** Say "The unknown address shows [what you saw]; use the hosting's way of serving a missing page file, or tell me honestly if it can't."

### P8.21: Tab title that follows the lamps

**Say this:**
I'd like the browser tab title to quietly follow the lamps, using only words already in the copy file. At the start, the title is the page title from the copy file. As lamps are lit, use the progress line from the copy file that says how many lamps are lit and how many are left, followed by the short page name. When all five are lit, use the line that says all five are lit. If the visitor goes back to a state with no lamps, return to the starting title. Never put a visitor's name or wish in the title, because titles show up in browser history and in screenshots. Don't change the title for anything else. Keep it short enough to read in a phone's tab switcher. It should not flicker. Tell me the exact title for each state from zero lamps to five.

**Check after it builds:**
- Six titles listed, from zero lit to five lit.
- Words match the copy file; none invented.
- The title never contains a name or a wish.
- Changing titles does not cause any console noise.
- The reduced motion setting does not change it (a title is not motion).

**If it is off:** Say "The title for [state] says [what it said]; it should only use the copy file's progress line."

### P8.22: Favicon, browser chrome and share preview

**Say this:**
Please make the small things around the page feel finished. First, a favicon: a tiny flame or lamp, in gold on dark, drawn as a small vector image kept inside the page itself so there is no extra request. Make sure the browser's automatic request for an icon file at the site root does not end in a missing file error; tell me what the console says. Second, set the colour of the browser bar on a phone to the night colour of the page, and tell the browser that the page is dark, so scroll bars and form controls match. Third, check the share preview. The title and description should be exactly as in the copy file for the share preview, and the preview image should show a dark page with one lit lamp and five unlit ones under the words three hundred twenty four tests passed, nineteen problems found, with the description exactly as in the copy file. The image must be a file of the page itself, and its address in the share tags must be the full public address, not a relative one. Tell me what that address is and whether it opens by itself.

**Check after it builds:**
- A favicon shows in the tab and the console shows no missing icon.
- The phone browser bar matches the night colour.
- Share tags use copy-file text and a full public image address that opens by itself.
- The image alt text matches the copy file.
- You also did the MANUAL check: paste the public link into a private chat with yourself on WhatsApp and see the preview (it can take a few tries; previews are cached, so check after you are sure of the final image).

**If it is off:** Say "The preview showed [what you saw]; the image or text should be [what the copy file says]."

### P8.23: Tiny delights, silent and cheap

**Say this:**
Please add a few very small touches that make the page feel cared for. Each must be silent, light on the phone, and switched off by reduced motion and by Calm. First, when a lamp finishes lighting, gently scroll so the next unlit lamp is comfortably in view, but only for visitors who haven't turned motion off, and never while they are in the middle of reading a card. Second, make text selection a soft gold on dark with readable text. Third, make the tap highlight on phones a warm gold instead of the default grey flash. Fourth, give the focus mark a small warm glow while keeping it clearly visible. Fifth, when a visitor presses and holds on the hold button, show the ring filling steadily, and if they let go early the lamp still lights, as in the copy. If the device supports it and the visitor has not turned on Calm or reduced motion, a very light vibration when a lamp finishes lighting is allowed on Android, and it must be easy to turn off with Calm. No new words, no sound, no heavy effects. Tell me which touches you made, and whether any costs frames on a four times slower processor.

**Check after it builds:**
- Each touch works and is switched off by reduced motion and Calm.
- The auto scroll never fights the visitor (they can scroll away).
- No sound; the vibration is optional and absent under Calm.
- No frame drops measured at four times slowdown, or an honest "could not measure".
- No new copy appeared.

**If it is off:** Say "Remove [the touch that bothered you]; I want the rest to stay."

### P8.24: Last micro-pass, reading the page like a stranger

**Say this:**
This is the last pass, and I want you to read the page the way a stranger would on a phone, top to bottom, at three ninety wide, once with all lamps unlit and once with all lamps lit, then report. Don't change anything. Look for things that look unfinished: a headline or word alone on a line, text jammed against the edge, a gap that is too large or too small between sections, words broken in the wrong place, double spaces, stray punctuation, mixed up quotation marks, emoji or symbols that did not render, curly brace tokens, the words undefined, null, NaN, Hinglish and English mixed so that a sentence is hard to follow, anywhere the lamp row or the card is cut off, and any place where the next step is not obvious. Check every link and button opens what its words say, and the new window ones say so. Also tell me every place the copy on the page differs from the copy file by even a single character. List what you find with its place. Do not rewrite the copy.

**Check after it builds:**
- A list of visual issues with places, or a clean result.
- A list of every copy difference, expected to be empty.
- Buttons that open Google Drive or an email say so in their words.
- No lamp row cut off in either state.
- You also did the MANUAL check: scroll the page slowly once, yourself, at the end, as if for the first time.

**If it is off:** Say "You reported [the item] as fine; at [place] I see [what you see]; list it and fix only that."

---

# PART F. THE 3-MINUTE VIDEO

Cap is three minutes. The target is 2:40. The sheet below adds up to 2:45 of speaking and clicking, with the margin for breathing. Do not speed up the video to fit. If your first take is over 2:55, cut the "lamps three to five" beat first, then shorten the wish beat.

## F.1 Before you press record

- Deploy the final build first; the video must show the live public page, not the builder preview.
- Open the live page in a private window at a phone-sized width (about 390 wide) or cast your phone. Close every other window. Do Not Disturb on.
- Calm toggle off for the first take so the fireworks show, since silent light is part of the creativity. Have Calm ready to show in one second if there is time (cut it if there isn't).
- Have these ready in tabs: the Flow history with the two 2 November takes (both visible, times visible), and the trimmed voice iteration clip from the receipts (only if you have it).
- Speak naturally. No music. No narration voice. If you add captions, copy only what you said.
- Do not show your Flow or Emergent email, your phone number, the form, or any real wish text meant for a real person.

## F.2 The timing sheet

| Time (cumulative) | On screen | What to click or do | What to say (beats, in your own words) |
|---|---|---|---|
| 0:00 to 0:15 | Opening: the dark page, headline, first lit flame | Press and hold the first lamp button | Who you are; applying for the India growth internship; the one question the page asks: what do I do when my first confident answer is wrong? Name the page: Ek Diya Se Doosra, one lamp lights another. |
| 0:15 to 0:40 | Lamp 1 certgen: guess tiles | Pick a tile, reveal 19 | 324 tests passed, a separate audit found 19, two high. Say what you did: shaped workflow and architecture, made or approved decisions, AI tools implemented. "I didn't defend the green screen." Fair warning: still a prototype. |
| 0:40 to 1:00 | Lamp 2 Vigil late-reply slider | Drag past the 3 second deadline with original logic, then switch to corrected | A late reply counted as proof the connection was alive. Name the label: model of documented behavior, simulated. The question: do the tests prove what someone depends on? Two targeted tests failed when the fix was removed. |
| 1:00 to 1:20 | Press "Sab diye ek saath jalaiye"; the row breathes; then lamp 6 | Light all; scroll to lamp 6; try to light it | Say in one breath: a number I withdrew (benchmark), an agent that stopped and the work continued, a database that showed the future early. Then lamp 6: a Hinglish-first demo test I want to run; "proposed, not run"; the page itself refuses to light it. |
| 1:20 to 1:35 | Voice section: drag the flame between your voice and Flow's text | Drag the flame; tap Read it plainly | Why voice: my thoughts do not arrive as finished sentences. These are real takes from my Flow history. Do not say anything about a third take. |
| 1:35 to 2:05 | The Flow history entries, then the build iteration clip (GATED, see F.3) | Show the Flow history with times; play the trimmed clip | I spoke directions into Emergent through Flow; here is the first result; here is the flaw I noticed (say the real one); here is the correction I spoke; here is the revised result. |
| 2:05 to 2:25 | The wish step | Say a short real wish into the field with Flow (or type it, and say so); press Card banaiye; show the card and the WhatsApp button, do not send | Voice is not only for me: the page asks visitors to say a wish to one real person, privately; the page does not upload or save it. (Use a harmless wish, with no name, to a real person you will not identify.) |
| 2:25 to 2:45 | Closure, then the face camera or the page | Scroll to the closure; show the final row | Honest limits: no growth channel owned, prototypes not products, AI agents wrote a substantial share. "I can't promise I'll always be right. I can show you what I do when I'm wrong." The link is public; pick any claim. Pointer to the grant: "My $3,000 answer, the Voice Reality Lab, is in the form." |

If the iteration clip does not exist, delete the 1:35 to 2:05 beat except the Flow history, shift the wish earlier, and say nothing about speaking to Emergent. Rework the closing to match. See C.6.

## F.3 The honest-claims gate for the video

Before exporting, listen to the whole thing once with the copy file open. Every sentence should be on one of three lists.

1. **Facts from the copy file** (numbers, project stories, fair warnings). Match them to the lines.
2. **Things you can show on screen** (Flow history entries, the iteration clip).
3. **Opinions and intentions** (why you chose voice; the test you want to run). Say "I want to" and "I would", never "I did".

If a sentence is on none of them, delete it.

Hard stops:
- Do not say "growth wins", "I ran", "I grew", "measured lift", "customers", "in production", "deployed to users", or anything about being hired or shortlisted.
- Do not say "I built this entire page by voice" unless every prompt was spoken. Say what is true (Part C.5, variant A or B).
- Do not say you have used Flow for any period of time, or before 1 November.
- Do not say Take 3 exists.
- Do not read the held-out numbers aloud (TipIndex 40.62 and 0.585; PitDB 629.70, 2.7, 26.5, 1.08), or any festival date.
- Say "AI agents wrote a substantial share of the code". Do not say you wrote it yourself.
- Do not describe the fireworks as crackers; they are silent and visual.
- Total length is under 3:00 by the player's own timer.

## F.4 After recording

- Check the length. Check the first five seconds: it should show the headline and the lit flame, not a loading page.
- Watch with sound off: do the captions or the screen alone carry the point?
- Watch at phone size: is the text legible?
- Keep the raw footage in the private folder with the receipts.

---

# PART G. SUBMISSION CHECKLIST

## G.1 The public URL

- [ ] Open the public link in an incognito or private window on a real phone, on mobile data (not your home Wi-Fi), logged out of Emergent and everything else.
- [ ] It loads with no login wall, no "preview" interstitial, no platform banner you did not intend.
- [ ] Hold to light the first lamp. Tap through every lamp. Open the lamp card, the sixty second file and the evidence drawer. Make a wish card.
- [ ] The address you submit is the final deployed address, not the builder's preview.
- [ ] Run P8.25 on the deployed URL.

## G.2 Links

- [ ] Résumé opens in a private window (Drive shared as "anyone with the link"), and the button says it opens Google Drive.
- [ ] Each of the five GitHub repositories opens in a private window.
- [ ] Each receipt link opens in a private window; where it does not (ignored or local reports, PitDB's public default branch is the older version), the page says "evidence available on request" or the link is removed.
- [ ] The essay link, if there is one, opens.
- [ ] LinkedIn and email: confirmed. The INVITE ME TO AN INTERVIEW button appears only because the contact field is filled in, and opens an email addressed to you.
- [ ] No "see test" link is broken.

## G.3 The form (fields to fill, truthfully)

- [ ] Email: the same email as your Flow account (that is how the form checks Flow was active during the challenge).
- [ ] Role preference: growth internship.
- [ ] Availability: your true starting date (the page accepts later-graduating students).
- [ ] LinkedIn and contact fields: real ones.
- [ ] Public portfolio link: the final URL.
- [ ] Video: under 3:00, uploaded or linked as the form asks. Check that the link opens in a private window.
- [ ] The $3,000 answer: paste the Voice Reality Lab text from section G of the package. You may dictate any changes with Flow into the field, but you never need to claim it was dictated. It must still say it is a proposed use, not a purchase made, with informed consent for tests, and no private messages.
- [ ] If you applied before through a LinkedIn post, apply again here.
- [ ] Only real data. No guesses in any field.
- [ ] Read the whole form once more before pressing Submit; keep a screenshot of the confirmation with time.

## G.4 The optional post (LinkedIn or X)

Tag Wispr Flow and Emergent (use each platform's mention picker so the tags really link). Keep it honest: one discovery, how voice was used, no claim of outcomes. Post only after you have submitted and after the public URL passes the audit.

Draft, with the gated sentence in square brackets:

"324 tests passed. Phir ek audit ne 19 problems dhoondhe. Ship karte?

Wispr Flow aur Emergent ke India growth hiring challenge ke liye maine ek night page banaya: Ek Diya Se Doosra. Paanch projects, paanch inconvenient discoveries. Ek diya doosre se jalta hai.

[Maine page ke liye directions Wispr Flow se bolkar Emergent ko diye, result dekha, jo cheez mujhe khatki woh bolkar sudhari, aur before and after page par hai.] (Keep this sentence only if the receipts exist. Describe the real flaw in your own words.)

Pata hai kya? Sach yeh hai ki AI agents ne in projects ka kaafi code likha. Maine decisions liye, sawal uthaye, aur jo flattering tha woh waapas liya. Growth channel maine abhi own nahi kiya. Lamp six ek test hai jo maine run nahi kiya.

Link: [public URL]
@Wispr Flow @Emergent"

Note: the bracketed sentence is a model. Say it your way. Do not name the flaw unless it was real. Do not post the draft as written if it contains a "went wrong" you did not experience. Do not tag people for engagement. Do not mention the shortlist.

## G.5 The last-minute truth gate (stop and read, one by one)

- [ ] "Spoken with Wispr Flow" appears exactly twice on the page (Take 1 and Take 2).
- [ ] No voice-built claim anywhere (page, video, form, post) unless the receipts exist and the corrected detail is on the live page.
- [ ] Held-out numbers absent: 40.62 and 0.585; 629.70, 2.7, 26.5, 1.08.
- [ ] No festival date printed. The sign-off is correct for today.
- [ ] No claim of growth wins, channel ownership, measured lift, customers, production deployment or hiring outcome.
- [ ] No claim of Flow use before 1 November 2026 and no claim of how long you have used it.
- [ ] The person section: you decided, by yourself, to keep each sentence exactly or to cut it (the father's accident sentence is personal, the exam sequence and "unsuccessful entrance attempts", the debate result and the four research contributors are on the ledger's open list).
- [ ] The PitDB label is "Phir kya hua" unless you confirmed which approvals were yours.
- [ ] Footer line 4 is true on the deployed page. Footer line 5 is the variant that is true.
- [ ] TipIndex: be ready to answer any question about it in an interview. The ledger still lists your working knowledge as unconfirmed.
- [ ] Hinglish: you read every Hinglish line aloud and it sounds like you. Any line that does not, rewrite or cut.
- [ ] The video says nothing the page does not support.

After submitting, if you must fix something on the live page, fix only what the gate lists, and note what you changed and when. Keep the site up. Shortlist is 5 November.

### P8.25: Deployed-URL audit

Run this against the final public address, not the builder preview. If Emergent cannot reach the public address from its environment, do the MANUAL list below yourself.

**Say this:**
This is the last audit and it is about the live public address I will submit. Please load it from outside any login, the way a stranger would, and report. Don't change anything. Tell me whether it loads with no login wall and no preview wall. List every request, and whether anything came from a place other than the page's own address, including anything the hosting platform adds, such as a badge, an analytics script or a tracker. List every cookie that is set. Compare the live page with the build I have been testing: do the title, the description, the headline, the number of lamps, the footer lines and the share preview all match? Tell me what the share preview address is and whether the image opens by itself. Check that the unknown address page behaves. Check the page works on a phone sized screen and a laptop sized screen, and that the bad link line shows for a garbled address after the hash sign. If you cannot reach the public address from your environment, say so plainly; do not simulate it.

**Check after it builds:**
- No login or preview wall; the address works logged out.
- Zero third party requests, or each listed with its source, and a decision made about footer line four.
- Zero cookies, or each listed with its source.
- The live page matches the tested build in the details named.
- MANUAL list, always: private phone window on mobile data; open the browser's network panel and look for other domains; look at cookies; paste the link into WhatsApp to see the preview; open the résumé, repositories and receipts from the live page.

**If it is off:** Say "On the live address I saw [what you saw]; tell me whether it comes from my code or the platform, and do not change anything until I decide."

---

# Risks and cut order

**Main risks**
1. **No evidence of voice-building.** The package says the recording did not exist. If you do not capture the iteration in Pack 4 (and keep that detail on the live page), every voice-built claim has to go (C.6), and the challenge's central requirement is unmet. Record from the start.
2. **Platform injection.** The hosting or builder may add scripts, cookies, badges or analytics your code did not write. That could make footer line 4 and the "zero requests" rule false on the public URL. Audit the deployed page and then either remove it, or change the line to exactly what your code does, or delete it.
3. **Footer line 5 wording.** The drafted sentence "Only the two takes above were spoken with Wispr Flow" reads as if you did not build by voice. Use the variants in C.5.
4. **Fireworks and tiers on a mid-range Android.** If frames fall, lower the tier or cut the effect. Never cut content.
5. **Assistant guesses.** If Emergent cannot run a browser, its audit reports are guesses. Make it say so, and do the MANUAL checks.
6. **Clock.** The window closes with no published hour. Back-plan from S (A.1).
7. **Copy drift.** Pack prompts that rewrite or paraphrase copy. P8.6 and P8.24 are the guard.

**Cut order (short form):** tiny delights, loading moment, tab title, heavy fireworks, atmosphere, shared-link opening line and row count, extra wish buttons, the 404 page, the wish step itself (last resort, and give the closure a plain way to light the visitor's lamp). **Never cut:** the five lamps with Fair warnings, lamp six as proposed not run, plain-text twins, reduced motion and Calm, the sixty second file, the evidence drawer, the closure, honest footer lines, the network, claims, storage and fuzz audits, the video, and the form.
