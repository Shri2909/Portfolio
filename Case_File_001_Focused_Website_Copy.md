# CASE FILE 001 — THE FIRST ANSWER IS THE SUSPECT

*India Growth Internship · Shriniwas Kholkute · 3 November 2026*

## 324 tests passed. Then an audit found 19 problems.

**Would you have shipped it?**

Three projects. Three inconvenient discoveries. One investigation into what I did next.

I'm Shriniwas, a final-year VIT Pune engineering student applying for Wispr Flow's India growth internship. I build software, debate, write and study business strategy. Instead of listing strengths, I'll show you difficult decisions.

**[OPEN THE CASE]** · **[THE 60-SECOND FILE]**

---

## LAMP 01 — CERTGEN

The Green Wall · Sab Green Tha. Par Kya Sab Theek Tha?

324 Tests Passed. I Still Wasn't Convinced.

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

**What I learned:** Ownership doesn't mean defending everything you've built. It means having the courage to question it.

Apna banaya hua system khud challenge karna bhi ownership hai.

**Three things this reveals about me**

* Systems Thinking: I design complete workflows around real-world constraints, not just happy-path demonstrations.
* Product Judgment: I make difficult trade-offs and prioritize requirements over attractive extras.
* Extreme Ownership: When initial fixes aren't enough, I continue directing improvements instead of declaring premature success.

**My growth connection:** A dashboard full of green numbers doesn't automatically mean users are happy.
Numbers achhe dikh rahe hain, par kya user ko sach mein value mil rahi hai? That's the question I want to ask.

**Evidence note:** AI agents performed much of the coding, audits, and fixes. The results describe a tested prototype, not a production security guarantee.

**[GUESS THE AUDIT RESULT → REVEAL 19]** · **[CHECK THE RECEIPT]**

---

## LAMP 02 — BLITZ

The Number I Withdrew · Number Bada Tha. Par Sach?

I Chose to Withdraw My Most Impressive Number.

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

**What I learned:** A smaller truth is worth more than a bigger claim you cannot defend.

Har achha dikhne wala number achha result nahi hota.

**Three things this reveals about me**

* Analytical Thinking: I approach improvements as hypotheses requiring fair comparisons.
* Independent Judgment: I'm willing to change a conclusion when better evidence contradicts it.
* Evidence-Driven Problem-Solving: I question measurement methods and investigate unexpected results before deciding what to change.

**My growth connection:** Imagine a campaign reporting thousands of sign-ups.
Sunne mein amazing hai. Lekin kitne log actually product use kar rahe hain? Kitne wapas aaye?
That's the difference between celebrating a number and understanding what it means.

**Evidence note:** AI agents performed much of the implementation, benchmarking, and investigation. The 1,850 ns result is historical; current latency has not been remeasured.

**[CHECK THE RECEIPT]**

---

## LAMP 03 — VIGIL

The Late Witness · System Bola Healthy. Maine Poochha, Pakka?

The System Said Everything Was Fine. I Questioned Whether It Was.

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

**What I learned:** Before celebrating a successful result, make sure you're testing the right definition of success.

Galat sawaal ka correct answer bhi kaam ka nahi.

**Three things this reveals about me**

* Systems Thinking: I translate complex problems into defined behaviors, workflows, and failure-handling decisions.
* Critical Thinking: I question whether passing tests actually prove what matters.
* Evidence-Driven Ownership: I direct corrective action and seek tests that can expose the original failure again.

**My growth connection:** A new Wispr Flow installation might look like success.
Lekin agar user agle din Flow use hi na kare, toh kya woh real adoption hai?
I want to understand what happens after the first interaction—not just count how many people started.

**Evidence note:** AI agents carried out much of the technical investigation and implementation. Verification was local and simulation-based, not a production deployment. Some individual decision attributions remain subject to verification...

**[TEST THE LATE REPLY]** · **[SEE THE RECEIPT]**

---

## Three Lamps. One Pattern.

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

## THE PERSON BEHIND THE FILE

My father's accident brought serious financial pressure during my Class 12 exams. A gap year, unsuccessful entrance attempts, YouTube study and a ₹3,999 course formed my route to VIT Pune.

I coordinated four research contributors, placed second in a college debate, and enjoy business case studies, essays and Advaita Vedanta. I care about people as much as code.

**I didn't learn that every plan works. I learned to decide what to do when it doesn't.**

---

## THE FIRST CLUE WAS MY VOICE

Here's a real thought I spoke on **2 November 2026**: “Shouldn't the technology adapt to how we naturally think and communicate?”

Compare my hand-transcribed voice memo with Flow's actual text. It preserved the thought while cleaning the expression.

That matters more to me than “type faster”: **let people finish thinking.** A voice-to-builder exhibit will appear only with genuine build evidence.

For India growth, I'd test whether a **Hinglish-first demo for students and early-career users** beats a speed-focused pitch on **first usable dictations** and **a second dictation within a day**. **Proposed, not run.**

**[COMPARE THE TWO REAL TAKES]** · **[SEE THE GROWTH TEST]**

---

## YOUR VERDICT

AI helped implement and investigate. I mapped workflows, shaped architecture, made or approved decisions, identified bottlenecks, directed attempts to break the prototypes, and pursued fixes. I didn't personally write every line or discover every bug.

I haven't owned a growth channel or shipped these prototypes to customers. I want to earn that responsibility.

**I can't promise I'll always be right. I can show you what I do when I'm wrong.**

Choose one claim. Follow the evidence. Then ask me about the decision behind it.

**[INVITE ME TO AN INTERVIEW]** · **[VIEW MY RÉSUMÉ](https://drive.google.com/file/d/19DXFxUoCiynAvErP6KQVq-ArzV69Mgf2/view?usp=drive_link)** · **[EVIDENCE DRAWER]**

*Case file open for questions. The best interface gets out of the way. The best evidence doesn't.*
