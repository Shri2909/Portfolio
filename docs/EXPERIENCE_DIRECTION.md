# Experience direction: the curious-detective feeling

Read before every stage. This file decides HOW the page feels. The specs decide WHAT exists. Creativity lives in form, motion, structure and interaction. Facts never change: every number, claim and quote still comes from `content/content.json` and the truth ledger.

## The feeling, in one line

A warm study at night. A cup of tea, a lamp, a case file that someone left open for you. You are the clever guest. Every page quietly says: "Ooh, what's this? Tell me more." Never danger, never courtroom, never "caught". The detective is on the candidate's side of the table, not across it. The mystery is simply: who is this person, and how did he get here?

## Voice

- Second person, warm, playful, curious. Short sentences. Questions are welcome.
- The reader is "detective". Shriniwas is "the subject" only in labels; in prose he speaks as "I".
- Failures are "plot twists". Fixes are "what I did next". Limits are "fair warning". Audits are "a second pair of eyes". Tests are "clues".
- Positive vocabulary: curious, notice, discover, unlock, follow the string, found, solved, clue, lead, hunch, twist, next chapter, ah.
- Banned in UI chrome (never in his fact fields): cut, wrong, error, fail, reject, danger, miss, against, guilty, suspect, victim, crime, evidence of wrongdoing, interrogate, caught, trap.
- Humour: gentle, never at his expense, never at the reader's.

## The curiosity engine (why they keep scrolling)

Every chapter ends with a CHAPTER SEAL: a small folded note under the sheet with a one-line question about what comes next (see `chapters[].teaser` in content.json). Tapping it opens the next chapter; scrolling past it also works. Questions, never spoilers, never claims. The reader should always have one open question in mind.

Open loops planted early and paid off later:
- Opening: "Who is behind the tape?" -> answered when the tape peels.
- Brief: "Start with the honest limits" -> Fair warning pays it off.
- Fair warning: "Three limits. What does he do about them?" -> the Lab and the ledger.
- Exhibit A: "324 tests passed. What did the second pair of eyes ask?" -> the 19 findings.
- Exhibit B: "Where does a 40.6x win stop being true?" -> the boundary chart.
- Plot twists: "Which case is still open?" -> the one OPEN stamp.
- Roots: "Where does the habit of changing the plan come from?" -> the journey map.
- Lab: "What did he predict, in writing, before the test?" -> pre-registration.
- Closing: "What is your verdict, detective?"

## The nine chapters (the order is the story of his life, smoothly)

1. The Question (Exhibit 0): how he thinks, in his own voice, live.
2. The Briefing: who, in one minute; the leads to follow.
3. Fair Warning: his honest limits first. Disarms, creates trust.
4. The Builder's Bench (Exhibits A and B): how he builds, tests, finds out he was wrong, fixes it.
5. Plot Twists and Forks: the pattern behind all of it.
6. Roots (Beyond the code): philosophy, debate, Nashik, the drop year, JEE, VIT Pune. The "why" behind the habits.
7. The Voice Lab: he tests ideas on himself, prediction written first.
8. Field Notes on Wispr: what he noticed about India and the product, as hypotheses.
9. Closing Notes: three findings, an open invitation, "check my work".

## Signature devices (what nobody has seen on a portfolio)

Tier A = must ship. Tier B = ship if Tier A is solid. Tier C = only with time left. Never trade accessibility or load speed for a device.

| # | Device | Tier | What the reader feels | Honesty rule |
|---|---|---|---|---|
| 1 | The Opening: drag a red string and watch a real messy thought tidy itself, name revealed under peeling tape | A | "Whoa, I'm controlling this." | Real Flow takes only |
| 2 | Chapter Seals: folded note with a question at the end of each chapter | A | "I need to know." | Questions only, no claims |
| 3 | Lamp reveals margin notes: pencil marginalia visible only where the lamp/finger shines; each note is a source line | A | "There's more hidden here." | Notes are real sources |
| 4 | Make Your Call: guess first, then the reveal | A | "I want to be right." | Answers from ledger |
| 5 | Clue magnifiers + brass notebook + friendly rank (Curious visitor, Junior sleuth, Inspector, Chief Inspector) | A | Light play, zero pressure | No timers, no scores |
| 6 | Exhibit A: 324 tiles, a scan line, 19 brass tiles drop in | A | A small "ohh" | 324 and 19 only |
| 7 | Exhibit B boundary chart you can tap along; the unmeasured gap shown honestly | A | "He shows where he's wrong." | Two measured points only |
| 8 | Case Board: the leads as a cork board with pins and red strings that light up related exhibits | A | "Everything is connected." | Strings follow `exhibits[]` |
| 9 | Plot Twists ledger with rubber stamps and one OPEN stamp | A | Pattern recognition | Data from ledger |
| 10 | Thumbprint of the case: a decorative fingerprint whose ridges are drawn from the counts in the ledger and exhibits | B | A tiny art moment | Caption says "drawn from the numbers in this file; it measures nothing about a person" |
| 11 | Roots journey map: a hand-drawn route Nashik -> drop year -> JEE -> VIT Pune -> Bengaluru (dashed, "willing to relocate") that draws itself as you scroll, one stop per story beat | B | Warmth, human | Only confirmed stops; order confirmed by him |
| 12 | Cross-exam cards "Just one more thing...": fixed questions, written answers | A | Columbo charm | His recorded answers only |
| 13 | Voice Lab dumbbell chart with computed honest read | A | "He tests himself." | Computed, never written |
| 14 | Wispr field notes stepper (Observation -> Suggests -> First test) | A | "He did homework." | Sources linked |
| 15 | Evidence drawer with five-minute verify notes and Copy buttons | A | "I can check." | Real commands only |
| 16 | 90-second guided read | C | Fast path for busy founders | Only visible sections |
| 17 | Easter eggs: teacup slip, double-tap the seal for a stamp sound-less ripple, the coffee ring reveals a tiny note when tapped, type "elementary" anywhere for a gentle lamp flicker | B | Delight, shareable | No claims inside eggs |
| 18 | Exhibit Z: provenance of every segment (Spoken with Flow / Written from sources) | A | Trust | Flags are literal |

Everything is silent. No audio anywhere. Motion is gentle (250 to 450 ms, ease-out); reduced motion shows final states.

## "Unimaginable" without risk

Peak creativity here means: a first screen nobody has seen (computed word-diff you can scrub), a page that is itself a case file with working clues, honest charts that show where the candidate is wrong, and a reader who feels clever. It does NOT mean heavy WebGL, autoplay, sound, or anything that breaks on a mid-range phone. If an effect drops below 60 fps, remove the effect, keep the content.

## Every chapter must pass this checklist

1. Can a phone user, one-thumb, use every interaction?
2. Is there one thing to touch in the first five seconds?
3. Is there an open question at the end (Chapter Seal)?
4. Does every number show where it came from?
5. Is every word in the chrome warm? (Run the banned-word grep.)
6. Does it still work with motion reduced and localStorage off?
