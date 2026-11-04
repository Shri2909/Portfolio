# Three-lamp stories, levels and journey (user-supplied text, word for word)

Source for src/data/copy.json strings added or changed on 4 Nov 2026. The three lamp stories and the transition are Shriniwas's own text.

## 2. LAMP 01: CERTGEN

[KICKER] LAMP 01 — CERTGEN
### The Green Wall · Sab Green Tha. Par Kya Sab Theek Tha?
**324 Tests Passed. I Still Wasn't Convinced.**

A hiring assignment asked me to build a bulk certificate generator. Simple enough to make it work. But I wanted to build something that could survive when things went wrong.

Mera sawaal simple tha: agar hazaar students ke certificates ban rahe hain, toh ek galat entry ki wajah se baaki sab kyun rukenge?

So I mapped the entire workflow, designed the architecture, and chose background processing with fault isolation. AI agents helped with much of the implementation, while I directed the design and key product decisions.

Then came the interesting part.

324 tests passed. Everything was green.

Ab normally kya hota? Project complete. Screenshot lo. Aage badho.

But I wasn't convinced.

A separate audit uncovered 19 problems. I directed further remediation, made decisions about safeguards, resource limits, and authentication, and pushed for more corrections when the first fixes weren't sufficient.

I even dropped a QR-verification feature when it violated an existing requirement.

Feature impressive tha. Lekin requirement tod raha tha. Toh feature gaya, requirement nahi.

The remediation report eventually recorded zero open findings within its scope. Later local checks passed 479 main-suite and 232 audit-suite tests.

What I learned: Ownership doesn't mean defending everything you've built. It means having the courage to question it.

Apna banaya hua system khud challenge karna bhi ownership hai.

**Three things this reveals about me**

* Systems Thinking: I design complete workflows around real-world constraints, not just happy-path demonstrations.
* Product Judgment: I make difficult trade-offs and prioritize requirements over attractive extras.
* Extreme Ownership: When initial fixes aren't enough, I continue directing improvements instead of declaring premature success.

My growth connection: A dashboard full of green numbers doesn't automatically mean users are happy.
Numbers achhe dikh rahe hain, par kya user ko sach mein value mil rahi hai? That's the question I want to ask.

Evidence note: AI agents performed much of the coding, audits, and fixes. The results describe a tested prototype, not a production security guarantee.

---

## 3. LAMP 02: BLITZ

[KICKER] LAMP 02 — BLITZ
### The Number I Withdrew · Number Bada Tha. Par Sach?
**I Chose to Withdraw My Most Impressive Number.**

I wanted to build a high-performance stock-order matching engine. The challenge wasn't just making it fast. It was proving that the improvements were real.

Fast bolna aasaan hai. Lekin kitna fast? Aur uska proof kya hai?

I designed the workflow and architecture, and established an approach for comparing optimizations with simpler alternatives. AI agents handled much of the coding and benchmarking. I directed the evaluation and decisions about which claims were defensible.

Then came a number I could have proudly displayed.

1,205 nanoseconds.

Dekhne mein impressive tha. Resume par bhi achha lagta.

But an audit revealed that this headline came from an uncommitted version of the code. A more controlled historical run gave 1,850 nanoseconds.

And another claimed 3.1× advantage? It shrank to approximately 1.02×.

Ab do options the: impressive number bachao, ya sach accept karo.

I chose to withdraw or downgrade claims the evidence couldn't support. Later changes also made the replacement latency outdated.

What I learned: A smaller truth is worth more than a bigger claim you cannot defend.

Har achha dikhne wala number achha result nahi hota.

**Three things this reveals about me**

* Analytical Thinking: I approach improvements as hypotheses requiring fair comparisons.
* Independent Judgment: I'm willing to change a conclusion when better evidence contradicts it.
* Evidence-Driven Problem-Solving: I question measurement methods and investigate unexpected results before deciding what to change.

My growth connection: Imagine a campaign reporting thousands of sign-ups.
Sunne mein amazing hai. Lekin kitne log actually product use kar rahe hain? Kitne wapas aaye?
That's the difference between celebrating a number and understanding what it means.

Evidence note: AI agents performed much of the implementation, benchmarking, and investigation. The 1,850 ns result is historical; current latency has not been remeasured.

---

## 4. LAMP 03: VIGIL

[KICKER] LAMP 03 — VIGIL
### The Late Witness · System Bola Healthy. Maine Poochha, Pakka?
**The System Said Everything Was Fine. I Questioned Whether It Was.**

Imagine a trading system receiving live market prices. Suddenly, a connection stops responding—but the system still believes everything is fine.

Screen par sab normal dikh raha hai. Lekin data hi purana hai. Ab bharosa kis par karein?

That's the problem I wanted Vigil to address.

I defined the requirements, designed the monitoring and reconnection workflows, and made key decisions about failure handling. AI agents helped implement and investigate the system.

Then I asked a question that changed the direction of the testing:

Were our tests actually proving what the system promised?

Tests pass ho rahe the. Lekin kya woh sahi sawaal pooch rahe the?

An AI-assisted investigation exposed a serious flaw: a reply arriving after its deadline could still make a failed connection appear healthy.

Matlab jawab late aaya, aur system ne maan liya—sab theek hai!

I directed corrective work, approved changes to the connection rules, and sought evidence that the correction would detect the original problem.

When the fix was deliberately removed, two targeted tests failed. Restored, all 105 local tests passed.

I also challenged performance measurements that weren't measuring what they claimed.

What I learned: Before celebrating a successful result, make sure you're testing the right definition of success.

Galat sawaal ka correct answer bhi kaam ka nahi.

**Three things this reveals about me**

* Systems Thinking: I translate complex problems into defined behaviors, workflows, and failure-handling decisions.
* Critical Thinking: I question whether passing tests actually prove what matters.
* Evidence-Driven Ownership: I direct corrective action and seek tests that can expose the original failure again.

My growth connection: A new Wispr Flow installation might look like success.
Lekin agar user agle din Flow use hi na kare, toh kya woh real adoption hai?
I want to understand what happens after the first interaction—not just count how many people started.

Evidence note: AI agents carried out much of the technical investigation and implementation. Verification was local and simulation-based, not a production deployment. Some individual decision attributions remain subject to verification...

---

## 5. THE TRANSITION AFTER ALL THREE LAMPS

### Three Lamps. One Pattern.

One project taught me not to trust green tests blindly.

Another taught me not to fall in love with impressive numbers.

The third taught me to question whether I was measuring the right thing in the first place.

*Teen alag projects. Teen alag challenges. Lekin ek aadat common thi.*

**I don't want to be right. I want to find out what's right.**

And that is exactly the mindset I want to bring to growth.

Because getting someone to install a product is one thing.

Getting them to genuinely love it, use it again, and make it part of their daily life?

*Woh asli challenge hai.*

**Which brings me to my next question: What happens after someone installs Wispr Flow?**

---



## LEVEL 1 summaries and capabilities

A hiring assignment asked me to build a bulk certificate generator. 324 tests passed. A separate audit uncovered 19 problems.
Extreme Ownership: When initial fixes aren't enough, I continue directing improvements instead of declaring premature success.

I wanted to build a high-performance stock-order matching engine. 1,205 nanoseconds. A more controlled historical run gave 1,850 nanoseconds.
Evidence-Driven Problem-Solving: I question measurement methods and investigate unexpected results before deciding what to change.

Imagine a trading system receiving live market prices. Suddenly, a connection stops responding—but the system still believes everything is fine. That's the problem I wanted Vigil to address.
Critical Thinking: I question whether passing tests actually prove what matters.


## LEVEL LABELS and JOURNEY

LEVEL 1 — Instantly visible
LEVEL 2 — Poora kissa
The complete story
LEVEL 3 — Inspect the evidence
For curious reviewers
The one capability this project best demonstrates
Repository
Three things this reveals about me
01 · Meet the person
Who I am, what drives me, what makes me different
02 · Three lamps, three decisions
CERTGEN → BLITZ → VIGIL
03 · Why Wispr Flow?
My genuine voice experience and what it revealed
04 · My India growth hypothesis
The Handover Test — proposed, not run
05 · Continue the conversation
Interview, résumé, GitHub, LinkedIn
06 · Go deeper
Evidence receipts, longer stories, personal details, visitor lamp, the essay link
Self-paced

## CHANGED LINES (counts three, not five)

324 tests passed. Then a separate audit found 19 problems. Shriniwas Kholkute's Deepavali-night page for Wispr Flow's India growth internship: three projects, one proposed test. Aaiye, chhat par.

Ek diya pehle se jal raha hai. Chaliye chhat par: teen projects, ek proposed test, aur ek lau jo aapke haath se aage jaayegi.

A dark terrace with one lit lamp, three unlit lamps and a faint dashed fourth lamp, under the words "324 tests passed. 19 problems found."

Teenon jal uthe.

Mere teen diye jal gaye. Ab ek aapka.

Teen projects mein se koi ek chuniye. Kya hua, maine kya kiya, aur kya abhi adhura hai: teeno batata hoon.

Mere teen diye bhi ek-ek karke jale. Jahan jawab adhura tha, wahan maine adhura hi likha.

THE THREE LAMPS

Chhat par hawa thandi hai. Lamp 1 jal chuka; do diye aur, haath badhaiye.

Teen diye jal uthe. Kisi ki roshni kam nahi hui.

Teen diye jal chuke. Ab ek awaaz suniye: meri, aur Flow ke likhe text ki.

Teen diye jal chuke, ek awaaz bhi suni. Ab chhat ke sabse door wale kone mein dekhiye: ek diya abhi bujha hai.

LAMP 04 · THE LAST LAMP · A TEST I HAVE NOT RUN

I also withdrew a flattering speed claim.

I coordinated four research contributors.

certgen: the QR branch was held to a pre-agreed requirement and not merged.

Outside the three projects: {OUTSIDE_TEST_LINE}.

an India protocol that says in advance what counts as no improvement.

Blitz 1,205 ns to 1,850 ns, 3.1× to about 1.02×.

four research contributors.

## LAMP 04 — THE UNLIT LAMP (user-supplied text, word for word)

### LAMP 04 — THE UNLIT LAMP

# Har Group Ka Ek Unpaid CEO Hota Hai.

*The person typing for everyone might be the person nobody thinks to help.*

Every college has one.

The class representative who sends the reminders. The club coordinator who writes the announcements. The person everyone tags when something needs to get done.

"Bro, ek message group mein daal de."

Again. And again.

**What if that person stopped typing?**

Not stopped communicating. Just stopped fighting the keyboard.

### My idea: The Group Admin Tax

I'd find the people who keep Indian communities running through messages and introduce them to Wispr Flow through a problem they already face.

No generic AI demo.

One real announcement. One natural explanation. Spoken in their own words and written directly into the app they're already using.

*Unki awaaz. Unka message. Bas typing ka extra kaam kam.*

Then comes the interesting part.

**Did they use it again the next day, without anyone reminding them?**

I'd test this first with consenting college representatives and club coordinators, comparing a generic speed demonstration with a demonstration built around their actual communication workload.

I'd measure repeat dictation, correction effort, and whether interested community members independently start using Flow.

If the approach works, I'd turn it into a replicable playbook for college clubs, student communities and other high-communication groups.

If it doesn't, I'd investigate why—and stop or change the campaign.

**The ambition isn't to reach a thousand people through a thousand advertisements.**

It's to discover whether helping one trusted communicator can naturally introduce Flow to others.

*Ek insaan jo sabke liye likhta hai. Pehle uska kaam aasaan banate hain.*

**Proposed, not executed. No growth results claimed.**

Architecture

1) Find one high-frequency communicator

A class rep, club organizer, coordinator or admin

2) Solve one recurring writing problem

Dictate real announcements and replies using Flow

3) Earn repeat use

The admin uses Flow again without your assistance

4) Offer a trusted demonstration

Interested members can opt in to see how the message was written

5) Acquire more habitual users

Test whether new members independently activate and return


## CHANGED LINES (growth)

LAMP 04 — THE UNLIT LAMP

The Group Admin Tax — proposed, not run

If it doesn't work, I'd investigate why—and stop or change the campaign.

final-year at VIT Pune; YouTube study and a ₹3,999 course.

I have no growth wins to borrow. But I've used Flow, and I want to discover whether helping one trusted communicator can naturally introduce Flow to others. Proposed, not run.

## CHANGED LINES (wish)

Type mat kijiye, bol dijiye. Likhna Flow ka kaam hai.

## CLOSURE (last page) and FOOTER, redrafted 4 Nov 2026

THE LAST LAMP IS YOURS

Aapka diya jal utha.

Ab ek sawaal ki baari hai.

Teen kahaniyan padhi, ek awaaz suni, ek bujha hua diya dekha. Ab jo bhi aapke mann mein atka ho, woh poochhiye. Jahan jawab pakka hai, wahan saboot dunga; jahan adhura hai, wahan adhura hi kahunga.

Ek email. Ek sawaal. Baaki baat wahin.

Ek diya doosre diye se jalta hai, aur pehle wale ki roshni kam nahi hoti. Aise hi aapka ek sawaal meri agli kahani ban sakta hai.

Darwaza khula hai, diya jal raha hai. The best interface gets out of the way. The best evidence doesn't.

Wispr Flow ke India growth internship challenge ke liye banaya hai. Prototypes, not products.
