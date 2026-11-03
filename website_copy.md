# EK DIYA SE DOOSRA: website copy (final draft)

Shriniwas Kholkute · Wispr Flow India growth internship · 3 November 2026

How to read this file: it is the page, top to bottom, in the order a visitor meets it. UI labels are in [BRACKETS]. Language mix is roughly 70% English and 30% Hinglish: English carries every fact, number and claim; Hinglish carries the hooks, the punchlines, the labels, the wish step and the closure. Anything in {curly braces} is filled in by the page at run time. Anything marked [CONFIRM] or [FILL IN] must be resolved before you publish (see the build notes at the end). All facts and numbers come from your Final Website Copy and content.json. Nothing here was spoken with Flow except the two 2 Nov takes.

---

## 0. PAGE META AND SHARE PREVIEW

- **Page title (tab):** Ek Diya Se Doosra (one lamp lights another) · Shriniwas Kholkute
- **Meta description:** 324 tests passed. Then an audit found 19 problems. Shriniwas Kholkute's night page for Wispr Flow's India growth internship: one lamp lights another. Ek diya jalaiye, aage badhaiye.
- **og:title / twitter:title:** 324 tests passed. 19 problems found. Ship karte?
- **og:description / twitter:description:** Ek diya pehle se jal raha hai. Baaki aapke haath se jalenge. A night page about five projects, by Shriniwas Kholkute.
- **og:image alt:** A dark page with one small lit lamp and five unlit lamps beside it, under the words "324 tests passed. 19 problems found."
- **WhatsApp share line for the site itself:** 324 tests passed. Phir ek audit ne 19 problems dhoondhe. Ship karte? {site link}

---

## 1. OPENING (dark page, one flame already lit)

[SMALL LABEL] EK DIYA SE DOOSRA · Shriniwas Kholkute

*(Only when the visitor arrives from a shared link, one small line above the headline.)*
- With a first name: {Name} ne yeh link bheja. Link mein likhi ginti: {N} diye.
- Without a name: Kisi ne yeh link bheja. Link mein likhi ginti: {N} diye.
- Always, in small type under it: *This number is written inside the link. It is not a visitor count and is not verified.*

# 324 tests passed. Then an audit found 19 problems.

**Ship karte? Imaandari se bataiye.**

Ek diya pehle se jal raha hai. Woh mera hai.
Baaki paanch aapke haath se jalenge.

[HOLD TO LIGHT THE FIRST LAMP]
Dabaye rakhiye. Tap ya Enter bhi chalega.

Jaldi mein hain? Ek minute mein poori kahani. → [THE 60-SECOND FILE]

*(Below the first screen:)*

Five projects. Five inconvenient discoveries. Aur ek sawaal: phir maine kya kiya?

I'm Shriniwas, a final-year VIT Pune engineering student applying for Wispr Flow's India growth internship. Strengths ki list nahi. Main aapko mushkil faisle dikhaunga.

**Alt text (night scene):** A dark page with one small flame lit on the left and a row of five unlit lamps leading away to the right.

---

## 2. LAMP 1: CERTGEN

[KICKER] LAMP 1 · CERTGEN · THE GREEN WALL
### Sab green tha

*(While holding:)* Lau aage badh rahi hai… *(When lit:)* Lamp 1 jal utha. Ab iska kissa.

**What happened**

Imagine a college generating thousands of certificates. One wrong entry shouldn't ruin the batch or crash the service. Bas itna hi kaam tha.

I mapped the workflow and architecture, made or approved product decisions, and used AI coding tools to implement the prototype. The prototype passed **324 tests**.

A separate audit found **19 problems**: one input consumed excessive processing time; another ballooned into an enormous response. Tests ne woh sawaal poochhe hi nahi the.

[GUESS THE AUDIT RESULT → REVEAL 19]
How many problems did the separate audit find?
[0] [3] [8] [19]
*Aapka andaza?*

- **Reveal text:** The audit found 19 problems, two of them high. One crafted value caused disproportionate CPU work. A request of roughly 26 MB expanded into roughly 192 MB of response material. The tests hadn't asked those questions, and I directed more remediation.
- **After the reveal, if the guess was below 19:** Kam socha? Aap akele nahi hain. 324 tests ne bhi wahi socha.
- **After the reveal, if the guess was 19:** Bilkul sahi. Tests ko yeh nahi dikha tha.
- **Always-visible plain text:** 324 of 324 tests passed. A separate audit then found 19 problems, two of them high.
- **Status chip:** 324 / 324 tests pass

**Maine phir kya kiya** *(what I did next)*

Green screen pe ruk jaana aasaan tha. **I didn't defend the green screen.** Records show me approving safeguards, changing scope and directing more remediation when problems remained. Agents audited and fixed the code. The final report recorded zero open findings in its scope; later checks passed **479 main and 232 audit tests**.

**Fair warning**

It's still a prototype, not a security guarantee. Isse zyaada ka daava main nahi karta.

[OPEN THE CERTGEN RECEIPT]

---

## 3. LAMP 2: VIGIL

[KICKER] LAMP 2 · VIGIL · THE WATCHDOG THAT TRUSTED A LATE REPLY
### Der se aaya jawab

*(While holding:)* Lau aage badh rahi hai… *(When lit:)* Lamp 2 jal utha. Ek diya jala. Ab agla.

**What happened**

Vigil checked whether a data connection was alive, jaise phone par poochhna: "Hello? Aap wahin hain?"

Despite green tests, a reply arriving **after the deadline** could count as proof of health. Der se aaya jawab bhi "haan, zinda hoon" maan liya ja sakta tha.

[TEST THE LATE REPLY]
Khiskaiye aur dekhiye.
- [MODEL OF DOCUMENTED BEHAVIOR] A simulated connection, not real monitoring.
- **Which logic?** [Original logic] [Corrected logic]
- **When the reply arrives** *(slider, 0 to 6 seconds, starts at 2)* · **3-second deadline**
- **Readout, before the deadline:** Reply at {t} s, before the 3-second deadline. Counted as proof the connection is alive. Dono logic mein yahi hota hai.
- **Readout, after the deadline, original logic:** Reply at {t} s, after the 3-second deadline. Original logic: still counted as proof of health. Yahi dikkat thi.
- **Readout, after the deadline, corrected logic:** Reply at {t} s, after the 3-second deadline. Corrected logic: not counted as proof of current health.
- **Always-visible plain text:** A reply that arrives before the 3-second deadline counts as proof the connection is alive. In the original logic, a reply that arrived after the deadline could still count as proof of health. In the corrected logic it is not counted as proof of current health.

**Maine phir kya kiya** *(what I did next)*

Maine ek sawaal uthaya: kya yeh tests system ka asli vaada sach mein check karte hain?

I questioned whether the tests proved the system's real promise. An AI-assisted review found the defect and implemented an approval-gated correction.

When a verifier removed the correction, **two targeted tests failed**. Restored, the suite passed **105 tests**.

The question became: **does it deliver what someone depends on?**

**Fair warning**

Yeh sab simulated connections par hua tha. The 105 tests were verified locally in an agent session, not in CI, and there was no production deployment.

[OPEN THE VIGIL RECEIPT]

---

## 4. LAMP 3: BLITZ

[KICKER] LAMP 3 · BLITZ · THE NUMBER I WITHDREW
### Jo number maine waapas liya

*(When lit:)* Lamp 3 jal utha. Lau aage badh rahi hai.

**What happened**

A speed claim looked remarkable: **1,205 nanoseconds**. Woh number bahut achha lag raha tha. It had come from an uncommitted working tree.

Better-controlled measurement showed **1,850**. The advertised **3.1× advantage** shrank to **1.02×**.

**Maine phir kya kiya** *(what I did next)*

The headline was replaced. Later changes made even the replacement historical. **I chose the defensible story over the flattering one.** Chamak nahi, sach.

**Fair warning**

1,850 ns is a historical run, not today's number. Current latency has not been remeasured.

[OPEN THE BLITZ RECEIPT]

---

## 5. LAMP 4: TIPINDEX

[KICKER] LAMP 4 · TIPINDEX · THE AGENT STOPPED, THE WORK CONTINUED
### Agent ruka. Kaam nahi.

*(When lit:)* Lamp 4 jal utha. Ek diya jala. Ab agla.

**What happened**

Codex hit its limit during a long experiment and left an incomplete output. Beech raaste mein agent ruk gaya. File adhoori.

**Maine phir kya kiya** *(what I did next)*

I directed a handoff to Claude Code, approved a verified disk cleanup, and resumed from recorded checkpoints. The campaign record reports **820 completed measurement rounds**.

**A process shouldn't depend on one operator remembering everything.**

**Fair warning**

Agents wrote most of the code and ran most of the benchmarks in this project. These are one-laptop, limited-workload results, not product speedups. Product ka daava nahi.

[OPEN THE TIPINDEX RECEIPT]

---

## 6. LAMP 5: PITDB

[KICKER] LAMP 5 · PITDB · THE FUTURE APPEARED EARLY
### Future, waqt se pehle

*(When lit:)* Lamp 5 jal utha.

**What happened**

A database meant to answer "What was known then?" could, in one specific time-zone edge case, show a **06:15** event at **06:00**. Yaani 06:15 ki baat 06:00 par hi dikh jaati.

**Phir kya hua** *(what happened next)*
*[CONFIRM: switch this label to "Maine phir kya kiya" only if you confirm which approvals were yours.]*

Agents found and addressed the defect in a local remediation version; the claim was narrowed.

**Fair warning**

**That correction is not yet reflected in the public default branch.** Aur main yeh nahi keh raha ki har audit finding fix ho chuki hai.

[OPEN THE PITDB RECEIPT]

---

## 7. THE ROW BREATHES (after lamp 5, the room turns dusk-gold)

Paanch diye jal uthe.
Dekhiye: ek diya doosre se jala, aur pehle wale ki roshni kam nahi hui.

*Kamra ab thoda sunehra ho gaya.*

---

## 8. LAMP 6: PROPOSED, NOT RUN

*(Set apart from the row, dashed outline, no flame. It never fully lights.)*

[KICKER] LAMP 6 · PROPOSED, NOT RUN
### Yeh diya abhi bujha hai

**The idea**

For India growth, I'd test whether a **Hinglish-first demo for students and early-career users** beats a speed-focused pitch on **first usable dictations** and **a second dictation within a day**. **Proposed, not run.**

Shuruaat ek chhote group se: jo log sach mein Hindi-English mein messages likhte hain. I would not assume every Indian student uses Hinglish.

- Variant A, speed: "Say the message. Skip typing it."
- Variant B, expression: "Don't stop the thought halfway through. Say it naturally."

*[OPTIONAL, your call: Other languages deserve their own test; this one speaks only for Hindi-English.]*

**Fair warning**

This test has not been run, and no result is claimed. Koi sample, koi lift, koi number nahi.

[SEE THE GROWTH TEST]

*(If the visitor tries to light it:)* Yeh diya abhi nahi jalega. Test chala nahi. Bujha hua, par imaandaar.

---

## 9. IS FILE KE PEECHE KA INSAAN

[KICKER] THE PERSON BEHIND THE FILE
## Is file ke peeche ka insaan

*[CONFIRM before publishing: the exam sequence, "unsuccessful entrance attempts", the debate result and the four research contributors are on the truth ledger's open list, and the first line is personal. Keep every sentence below exactly as written, or cut it.]*

My father's accident brought serious financial pressure during my Class 12 exams. A gap year, unsuccessful entrance attempts, YouTube study and a ₹3,999 course formed my route to VIT Pune.

I coordinated four research contributors, placed second in a college debate, and enjoy business case studies, essays and Advaita Vedanta. I care about people as much as code.

**I didn't learn that every plan works. I learned to decide what to do when it doesn't.**

---

## 10. SOCH POORI HONE DO (the voice section)

[KICKER] THE FIRST CLUE WAS MY VOICE
## Soch poori hone do
*Let people finish thinking.*

Here's a real thought I spoke on **2 November 2026**: "Shouldn't the technology adapt to how we naturally think and communicate?"

Dono ko saath rakh ke padhiye: meri hand-transcribed voice memo, aur Flow ka actual text. Thought wahi raha; bas expression saaf ho gaya.

That matters more to me than "type faster": **let people finish thinking.**

*[ONLY IF A REAL RECORDING EXISTS, and only if this live page is that build: I spoke some of the directions for this page through Wispr Flow into Emergent. Flow transcribed me; Emergent built the page; I looked at what it made and dictated a correction. The before and after are linked here. If there is no recording, delete this whole line.]*

[COMPARE THE TWO REAL TAKES]
Flame ko meri awaaz se Flow ke text tak khiskaiye. *(Arrow keys work too, or use "Read it plainly".)*
*Blue pencil: words Flow trimmed. Highlighted: words Flow smoothed or added.*
[Read it plainly] *(a toggle; trimmed and added words are marked in text, not only by colour)*

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

**Where this came from:** My Wispr Flow history · Wispr Flow · 2 Nov 2026 · Output matches Flow history word for word. "As I said it" is my own hand transcription of what I said, typed from my voice memo.

**Chip:** A real take, straight from my Flow history

**Alt text (compare):** Two columns of text for each take, my spoken words on the left and Flow's text on the right, joined by a glowing line.

---

## 11. SEEDHI BAAT (the verdict)

[KICKER] YOUR VERDICT
## Seedhi baat

AI helped implement and investigate. I mapped workflows, shaped architecture, made or approved decisions, identified bottlenecks, directed attempts to break the prototypes, and pursued fixes. I didn't personally write every line or discover every bug.

I haven't owned a growth channel or shipped these prototypes to customers. Yeh zimmedari main kamaana chahta hoon.

**I can't promise I'll always be right. I can show you what I do when I'm wrong.**

Koi ek claim chuniye. Uska evidence kholiye. Phir faisle ke baare mein mujhse poochhiye.

[VIEW MY RÉSUMÉ (opens Google Drive)] · [EVIDENCE DRAWER]

---

## 12. AB AAPKI BAARI (the wish step)

[KICKER] YOUR TURN
## Ab aapki baari

Is baar soan papdi nahi, ek wish.

Mere paanch diye ab roshan hain. Ab ek aur: aapka apna.

Ek real insaan sochiye. Do-teen line, jo sirf aap unse keh sakte hain. Generic forward nahi.

Bolkar likhiye, jaise unse baat kar rahe hon. Flow ya koi voice typing ho toh bol dijiye; nahi ho toh type bhi chalega.

Deepavali ho ya na ho: koi achhi khabar, koi purani yaad, ya bas "yaad aaye". Sab chalega.

*Write one short wish for one real person, in any language you like.*

**Kuch idea chahiye? Chuniye (optional):**
- Kisi ko, jinse aap is baar mil nahi paayenge.
- Kisi ko, jinhone aapko kabhi kuch sikhaya.
- Kisi ko, jise aapne kabhi theek se thank you nahi kaha.
- Kisi ko, jinse baat kiye bahut din ho gaye.

**Form labels**
- Kiske liye? (pehla naam, optional)
- Aapki wish: *placeholder:* Jaise unse baat kar rahe hon, waise likhiye…
- Aapka pehla naam (optional, link mein jaayega)

[Card banaiye]

**Privacy line (always visible under the form)**
Ek baat saaf: yeh page aapki wish upload ya save nahi karta; woh sirf aapke tab mein banti hai. Link mein sirf diyon ki ginti aur, agar aap likhein, aapka pehla naam hota hai. Jab aap card bhejte hain (WhatsApp ya copy), tab wish aur naam wahin tak jaate hain jahan aap bhejte hain. Bolkar likhte hain toh aapka voice tool apne niyam se chalega.
*In short: this page doesn't upload or save your wish. If you send the card, it goes only where you send it.*

**The card (rendered after "Card banaiye")**

> EK DIYA SE DOOSRA
>
> {Name} ke liye:
>
> "{wish}"
>
> — {YourName}
>
> Ek diya doosre diye se. Yahan se jalaiye: {link}
>
> *One lamp lights another.*

*(The {Name} and {YourName} lines are dropped if left empty.)*

[WhatsApp par bhejiye] · [Card ka text copy kijiye] · [Link copy kijiye] · [Badlein]
*(Each button also has an English aria-label.)*

**After the card is made:** Card taiyar hai. Jisko bhejna ho, bhej dijiye.

**Alt text (card):** A warm-gold card with a small lamp icon at the top, a short personal wish in the middle and the sender's first name at the bottom.

---

## 13. CLOSURE

**Row caption** (N is the count written in the link, shown as "99+" if larger)
{N} diye pehle se. Aakhir mein aapka. *(N=1: Ek diya pehle se. Aakhir mein aapka. · N=0: Yeh row aapse shuru hoti hai.)*
*This number is written inside the link. It is not a visitor count and is not verified.*

*(The visitor's lamp lights at the end of the row, the flame travelling from the last lamp.)*

[KICKER] YOUR LAMP IS LIT
## Aapka diya jal utha.
## Ab mujhse ek sawaal poochhiye.

Paanch projects mein se koi ek chuniye. Kya hua, maine kya kiya, aur kya abhi adhura hai: teeno batata hoon.

[INVITE ME TO AN INTERVIEW] *(renders only if contact is set; opens an email)*
Ek email. Ek lamp. Baaki baat wahin.

View my résumé · Evidence drawer

Mere paanch diye bhi ek-ek karke jale. Jahan jawab adhura tha, wahan maine adhura hi likha.

Sawaal poochhne ke liye yeh page khula hai. The best interface gets out of the way. The best evidence doesn't.

**Shubh Deepavali.**
**— Shriniwas**

*(Build note, not shown: after 9 November the sign-off swaps to "Shukriya. — Shriniwas". No festival date is printed anywhere on the page.)*

**Alt text (final row):** A long row of lit lamps, with the newest lamp at the right end glowing a little brighter.

---

## 14. EVIDENCE DRAWER (headings and intros; drawer bodies stay exactly as in content.json)

**[DRAWER TITLE]** Evidence drawer
**[DRAWER INTRO]** Every figure above has a source and a status. Statuses are plain text: PUBLIC, LOCAL-BRANCH, REPO-REPORTED, PERSONALLY CONFIRMED, UNRESOLVED, PROPOSED. Jahan jawab abhi adhura hai, wahan UNRESOLVED likha hai.

1. **CERTGEN: The green wall.** 324 tests, phir 19 findings, aur mera hissa kitna tha.
2. **VIGIL: The late witness.** Ek late reply, ek sawaal, aur do tests jo correction hatane par fail hue.
3. **BLITZ: The number I withdrew.** 1,205 se 1,850 tak ka poora hisaab, aur jo abhi remeasure nahi hua.
4. **TIPINDEX: The operator changed, the evidence stayed.** Handoff ka record, aur woh jawab jo abhi UNRESOLVED hain.
5. **PITDB: The future appeared early.** 06:15, 06:00 par: kya local branch par hai, aur kya public par.
6. **ROLES: Who designed, who executed, who verified?** Kisne kya kiya, seedhe shabdon mein.
7. **THE PERSON AND THE VOICE: Sources.** Voice takes kahan se aaye, aur kya abhi baaki hai.
8. **INDIA GROWTH TEST: The proposed protocol.** Poora protocol. Proposed, not run.

*Field labels inside each folder (unchanged):* Plain-English purpose · The central finding · My part · Recorded results · Where to inspect · Status · Other findings

---

## 15. THE 60-SECOND FILE (a dialog, also #sixty)

[LABEL] THE 60-SECOND FILE · *Jaldi mein hain? Yeh padhiye.*

**324 tests passed. A separate audit found 19 problems. Would you have shipped it?**

I'm Shriniwas, an engineering student applying to Wispr Flow's India growth internship. I mapped workflows and architectures, made or approved key design decisions, and used AI agents for implementation and investigation.

In one project, I approved further corrections after the first audit fixes weren't enough. In another, a watchdog called a late reply proof of a healthy connection. I questioned whether the tests actually proved the product's promise; the corrected test failed when its fix was removed.

I also withdrew a flattering speed claim, redirected an interrupted experiment between AI agents, and narrowed a database claim after a specific time-handling defect.

I have no growth wins to borrow. But I've used Flow, and I want to test whether a Hinglish-first demonstration helps Indian students reach their first useful dictation and return for another.

*I can't promise I'll always be right. I can show you what I do when I'm wrong.*

[OPEN ONE RECEIPT] · [INVITE ME TO AN INTERVIEW]

---

## 16. MICROCOPY

- **Skip link:** Skip to main content
- **Nav:** The lamps · Evidence · 60-second file
- **Dialog close:** Close
- **Hold hint:** Dabaye rakhiye. Tap ya Enter bhi chalega.
- **While holding (shown only during a hold; releasing early still lights the lamp):** Baati abhi garam ho rahi hai.
- **Progress:** {n} diye jal chuke, {5-n} baaki. *(at n=5: Paanchon jal uthe.)*
- **Lamp opens:** Kissa kholiye
- **Lamp card closes:** Row par waapas
- **Light all (for readers who skip the ritual):** Sab diye ek saath jalaiye
- **Unlit lamp, screen reader:** Lamp {n}, unlit. Press and hold, tap or press Enter to light it from lamp {n-1}.
- **Lit lamp, screen reader:** Lamp {n}, lit.
- **Reduced motion:** Motion off hai? Diye seedhe jal jaate hain, koi animation nahi.
- **Slider, assistive label:** When the reply arrives, in seconds *(spoken value: "{t} seconds, before the 3-second deadline" / "after the 3-second deadline")*
- **Empty wish:** Ek line toh likhiye, phir card ban jaayega.
- **Card ready:** Card taiyar hai. Jisko bhejna ho, bhej dijiye.
- **Copied:** Copy ho gaya. **Could not copy:** Copy nahi ho paya. Link select karke copy kar lijiye.
- **Under the card:** Yeh wish sirf is tab mein hai. Bhejna ho toh abhi bhej dijiye.
- **Invite link (top bar, only if contact is set):** [INVITE ME]
- **Start again:** Phir se shuru kijiye
- **Bad link:** Link thoda alag lag raha hai. Koi baat nahi, row yahin se shuru hoti hai.

---

## 17. FOOTER

- **Line 1:** Wispr Flow ke India growth internship challenge ke liye banaya hai. Prototypes, not products. Har number ka source aur status Evidence drawer mein hai.
- **Line 2:** AI agents wrote a substantial share of the code in these projects. I directed, approved and questioned. Kisne kya kiya, woh drawer mein hai, jitna main saabit kar sakta hoon.
- **Line 3 (privacy):** Yeh page aapki wish upload ya save nahi karta. Link mein sirf diyon ki ginti aur, agar aap likhein, aapka pehla naam hota hai.
- **Line 4:** [CONFIRM BEFORE PUBLISHING] Is page mein koi analytics, cookies ya third-party script nahi hai. *(Delete this line if the final build cannot back it.)*
- **Line 5 (how this page was made):** [FILL IN: the tool you actually used to build it.] The Hinglish lines were drafted with AI help and approved by me. Only the two takes above were spoken with Wispr Flow.
- **Line 6:** This is an independent application page. Wispr Flow and Emergent have not reviewed or endorsed it.
- **Line 7:** © Shriniwas Kholkute

---

## ALTERNATES

- **Opening headline, share-friendly version:** 324 tests passed. 19 problems found. Ship karte?
- **Closure caption, if the row is full:** Sab diye jal uthe. Ab mujhse poochhiye.

---

## BUILD NOTES (what you must do before publishing)

1. **Make the Hinglish yours.** An AI agent drafted every Hinglish line. Read each one aloud. Where it doesn't sound like you, rewrite it in your own words, ideally by dictating it with Flow. Keep every number and fact exactly as written. Only the two 2 Nov takes may carry "Spoken with Wispr Flow".
2. **Line 5 of the footer is required.** Name the tool you really used to build the page. If you did not build the live page by voice into Emergent, delete the gated line in section 10 and do not claim it anywhere (including the video). The challenge wants a voice-built page, and a recorded Flow-into-Emergent iteration does not exist yet in your materials.
3. **PitDB label.** Keep "Phir kya hua" until you confirm which approvals were yours; then switch to "Maine phir kya kiya" and say only what you approved.
4. **No-tracking line.** Keep footer line 4 only after checking the production build for analytics, cookies and third-party requests. The privacy line "save nahi karta" is true only if the page uses no localStorage or sessionStorage for lamp progress.
5. **The lamp count.** Put the count and the first name in the URL fragment (after #), not the query string. Show the count capped (for example "99+"), allow letters only and about 20 characters for the name, and render it as plain text. Keep the small English line saying it is not a visitor count. If you don't want that fine print, drop the count and keep only the lamp row.
6. **Section 9 (the person).** Confirm the exam sequence, the debate result and the four research contributors from the truth ledger's open items, and decide whether you want the first sentence public. Keep or cut it exactly as written.
7. **Diwali date.** Print none. Sources I found say Sunday 8 November 2026, and one said 9. Swap the sign-off to "Shukriya. — Shriniwas" after 9 November (a client-side date check is enough).
8. **Held-out numbers.** TipIndex 40.62× and 0.585, and PitDB 629.70×, 2.7×, 26.5× and 1.08×, appear nowhere. Keep it that way.
9. **TipIndex.** The closure promises "teeno batata hoon" (I'll tell you all three). Be ready to answer any TipIndex question live. The ledger still lists your full working knowledge as unconfirmed.
10. **Lamp 6** never fully lights and carries no thresholds, sample size or expected result.
11. **Receipt buttons** use one verb ("OPEN THE … RECEIPT") with the project name, so the links are unique for screen readers. The résumé link says it opens Google Drive; the interview button says it opens an email.
12. **Accessibility:** decorative lamp art gets empty alt text; the controls carry the names ("Light lamp 1, Certgen"). Real alt text stays on the share image and the card. Keep Hinglish out of aria labels and error strings; wrap visible Hinglish in `lang="hi-Latn"`; set the page to `lang="en-IN"`. Every interaction keeps its always-visible plain-text version.
13. **Receipt links:** verify each opens in a private mobile window. Per the evidence package, some audit reports are local or ignored in the repo, and PitDB's public main is the older version, so link to what really opens or write "evidence available on request".
14. **Single festival spelling:** "Deepavali" everywhere in the copy.
15. **Language mix:** a rough word-list count puts the visible page copy at about 70 to 75% English and 25 to 30% Hinglish (details in my reply). If you want more Hinglish, add it to the wish step, the hand-off lines between lamps and the closure. Do not add it to fact paragraphs.
