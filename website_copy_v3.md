# EK DIYA SE DOOSRA V3: website copy (PART E of V3_IMPLEMENTATION_BRIEF.md, verbatim)

Extracted verbatim from the brief. Strings tagged [SAME] are unchanged from website_copy.md (v2), which stays as history; scripts/check-copy.mjs checks copy.json against this file, website_copy.md and reference/content.json.

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

## EVIDENCE FOLDER 8: THE HANDOVER TEST (cleaned from V3 brief PART F section 3: source ids such as H1 removed)

**Plain-English purpose.** Test whether a setup script for the family member who installs Flow on an older relative's phone (Hinglish on, their people's names added, first dictation a real message to someone they love) makes that relative dictate again on their own, after the helper has left the room.

**Audience and variants.** Pairs of a young helper (18 to 25) and a relative (parent, grandparent, aunt or uncle) who writes Hindi or Hinglish on WhatsApp, on an Android 13+ phone or an iPhone, free plan. A, Speed demo (control): the helper installs with default settings, says "Mummy, ye typing se kaafi tez hai. Bolke dekhiye.", the relative dictates a test sentence, the helper leaves. B, Handover script: the helper picks Hinglish in the language setting on the relative's own phone, adds five names that matter to the relative to the personal dictionary, and says "Mummy, ek message boliye jo aap Aarav ko bhejna chahti hain."; the text appears in Latin letters, the helper checks the names, the relative sends it in WhatsApp; the helper then leaves the room and the house for that session. Both arms: same phone mix, same follow-up card, same consent, same leave step. B bundles three changes (Hinglish, names, real message); a pilot cannot separate them.

**Design.** 12 dyads (6 and 6, assigned by coin flip), one week plus a day-7 call. Exploratory only. No significance claims. Twelve dyads cannot show cause; they can show whether the idea is worth real instrumentation.

**Metrics.** Primary: a first usable dictation (sent in a real chat with at most one small fix), then an unassisted second dictation within 24 hours of the first, when the helper was not in the room. Secondary: any unassisted dictation on day 7; names right on first try, out of the five; helper minutes spent on setup; total words in 7 days, descriptive only. Guardrails: any language setting changed away from Hinglish (and why); any weekly limit message seen; discomfort or "bahut mushkil hai" feedback; helper stress; any privacy concern. Any guardrail breach in B is reported first.

**Measurement.** With consent: the sent message arriving in the family chat (timestamp), the relative's one-tap answer ("bola ya type kiya?"), a photo of the Flow history or statistics screen where the app shows one, and a 3-question check by call on day 1 and day 7. I will not read chats or hold audio. No Wispr data is used.

**Decision rule (written before dyad 1).** Scale (to about 40 dyads, or hand the script to Wispr as a spec): B has at least 4 of 6 unassisted second dictations AND at least 2 more dyads than A. Change: B leads by exactly 1, or ties on the primary but is clearly better on names or day-7; re-cut the script and rerun. Kill this version: A equals or beats B on the primary, or B has any guardrail breach.

**Cost (my estimate, first run).** About ₹2,000 to ₹2,500: thank-you snacks for 12 dyads about ₹1,800, a printed one-page setup card and follow-up about ₹200, data and travel about ₹300. Free plan only; nobody is asked to pay.

**Risks.** Helper skill differs across dyads. People try harder when watched. Novelty in week one. Older users may stop for reasons unrelated to the script. Free-plan limits could hit mid-week. Consent: informed, spoken-and-written consent in the participant's language; adults only; free to stop any time; no audio recording; data deleted after the write-up.

Status: PROPOSED. The Handover Test. No result, lift, sample or Wispr data is claimed. Neither experiment has been run.

## GROWTH ACT extra strings (from PART E Act 5 and PART F section 4)

Help page: using Flow with multiple languages; Help page: your referral link; TechCrunch: voice AI in India; Wispr's India page; Wispr's challenge brief.
Scale: B has at least 4 of 6 and beats A by at least 2. Change: B leads by exactly 1, or ties on the primary but is clearly better on names or day-7. Kill this version: A equals or beats B on the primary, or B has any guardrail breach.
A pass prompt: Lamp {n} ko chhuiye, lau aage badhegi. Chip: 105 / 105 tests · simulated.
