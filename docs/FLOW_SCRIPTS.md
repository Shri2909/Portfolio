# Flow scripts: what to speak with Wispr Flow

Generated from `content/draft.json`. Dictate each segment with Flow into a plain text editor, save Flow's text untouched under the file name shown, then paste it into the matching field of `content/content.json` (see `docs/CLAUDE_CODE_PROMPTS.md`, Stage 15). Change any sentence that is not true for you; keep every number exactly. Check `docs/TRUTH_CHECK.md` first.

S01 (Exhibit 0) is done. S05 and S15 are written, not spoken. Do the first five first: S02, S03, S04, S06, S14.


## S02: The brief (1:00)

Save as `S02_brief.txt`

I'm Shriniwas Kholkute, a final-year B.Tech student in Instrumentation and Control at VIT Pune, with a CGPA of 8.43, graduating in May 2027.

I build systems where speed alone isn't enough. Blitz is a limit order book. Vigil is a heartbeat monitor. PitDB is a point-in-time query engine for market data. certgen is a bulk certificate backend. TipIndex is a market-data replay experiment.

Most of these are local prototypes, not production systems, and I'll say so every time.

I'm applying for the internship. I have no fixed start date, and I'm willing to relocate to Bengaluru. I downloaded Wispr Flow on 1 November and I've used it since.

This file is how I think, where I've been wrong, and how I fixed it. Start with the case against me.


## S03: Fair warning (1:30, about 30 seconds per reason)

Save as `S03_against.txt`

**Reason 1.** Card title (written on the page, do not speak): *Nothing I've built is in production.*

Everything I've built is a local prototype. Nothing is deployed, nothing has real users, and the numbers on this page come from my own machine. They show how I think and how I test. They don't show that I've run a system for customers.

**Reason 2.** Card title (written on the page, do not speak): *Agents wrote a lot of my code.*

AI coding agents wrote a substantial share of certgen and TipIndex. My part was setting the requirements, approving the plan, reviewing the results and hardening them after audits. If you want to know exactly which parts I wrote by hand, ask me, and I'll answer from the commit history.

**Reason 3.** Card title (written on the page, do not speak): *I have no growth results yet.*

I have never owned a growth channel or measured an activation lift. What I have is a habit of testing claims, and one small experiment on this page, run on myself, one person, which I label exactly that way.


## S04: Exhibit A, certgen (2:30 story, then three answers of about 30 seconds)

Save as `S04_certgen.txt`

**What I did.**

certgen was a take-home assignment: a backend that produces thousands of PDF certificates in one batch, up to 10,000 recipients per job, with a clear error for every bad row, background workers, individual downloads, and a ZIP and a CSV report.

Before writing code, I froze what version 1.0 had to do, and I recorded 13 architecture decisions. I chose to accept the good rows and report the bad ones, instead of rejecting a whole class because of one typo.

AI agents wrote a substantial share of the code. I set the requirements, approved the plan, and reviewed what came back.

**What didn't work.**

I had 324 passing tests and a version 1.0 release-candidate tag. Then a separate forensic audit found 19 issues.

One overlong email value made validation burn CPU in quadratic time. Extra unknown fields turned a small request into a huge error response. And some clients could starve everyone else.

The tests passed because they only checked what I had imagined.

**What I learned.**

Passing tests measure the cases you imagined, not the ones you didn't. A demo that works is not the same as a system you can trust.

**What I did next.**

For each finding, a failing test came first and the fix came second. Input was capped before parsing, error responses were limited in size, the host header was checked, requests got deadlines, clients got fair shares, and bearer tokens were added.

One fix is my favorite. A concurrent start-up failed 39 times out of 60 six-process rounds. After the database initialization was fixed, it failed zero times in 360 boots.

That does not make certgen production-secure, and I don't claim it is. Next time, I'd write the abuse cases before the happy path.

**Cross-examine: three fixed questions.**

*Which part did you personally write, and which did agents write?*

Agents wrote a substantial share of certgen, and the commit trailers say so. I set the requirements, froze the scope, recorded the 13 decisions, approved the plan, and reviewed and hardened the result. If you want a file-by-file account, ask me, and I'll give you one live.

*Why did 324 tests miss it?*

Because every test was a case I had imagined. The audit asked different questions: what happens with a hostile input, a flood of requests, or one greedy client? Tests check what you thought of.

*What would you change on day one?*

I'd threat-model before I wrote tests. I'd list how someone could abuse the system, write failing tests for those first, and only then build the happy path.


## S06: Exhibit B, TipIndex (2:30 story, then three answers of about 30 seconds)

Save as `S06_tipindex.txt`

**What I did.**

TipIndex asks one question: when is an indexed lookup better than scanning every retained market-data message? It's a C++20 in-process log with selective replay. I tested it on a real Nasdaq ITCH sample of 268,744,780 messages, plus synthetic workloads.

The question comes from a published Jane Street article. It's not my invention, and I don't claim it is.

I chose the narrower Tier B plan over the more ambitious Tier C, approved each phase, and stopped at the phase boundaries. Agents wrote much of the code, and I studied it until I could explain it.

**What didn't work.**

Two things. First, my benchmark runs were contaminated. Process snapshots showed another agent session competing for the CPU core I had pinned, in 9 of 10 rounds. A second run broke my own quiet-machine threshold. I rejected both, for invalid conditions and not for bad-looking numbers, and used only a later clean run.

Second, the result itself. For a single symbol, the index used 40.6 times less CPU than a full scan. At 1,000 symbols, it lost, at 0.585 times.

**What I learned.**

I learned to decide what counts as a valid measurement before I see the number, and to publish the point where a result stops being true, not only its best case.

**What I did next.**

Two audits followed. The first found 26 issues and the second found 14 more, and the fixes are recorded in the project documentation.

I published both regimes in the README with the same caveat each time: one machine, one workload. They show where the index wins and where it loses. They don't predict production.

**Cross-examine: three fixed questions.**

*Can you explain the code the agents wrote?*

Yes. Early on, I wrote in a prompt file that I had zero working knowledge of the generated code. That file is still in the repo, and it's where my study started. I now have full working knowledge of TipIndex, so ask me about any part of it.

*Why should anyone trust one-machine numbers?*

They shouldn't, beyond what they show. I labelled them repo-reported, one machine, one workload. They show where the index wins and where it loses. They don't predict production.

*Why publish a result where your index loses?*

Because the loss is the more useful result. Knowing where the crossover is matters more than quoting the best case. And if a reader finds the loss on their own, they stop trusting everything else.


## S07: PitDB (0:30)

Save as `S07_pitdb.txt`

PitDB exists to prevent look-ahead bias in market-data queries. Tests produced a counterexample: a daylight-saving fold could admit a future event at an earlier cutoff, and duplicate keys and chunk boundaries could give wrong as-of answers.

An engine built to prevent look-ahead had look-ahead in it. I fixed it and resolved the issue before I put PitDB on my resume.

The lesson is to test the core promise first, not only the side features.


## S08: Setbacks (1:30)

Save as `S08_setbacks.txt`

During my Class 12 boards in Nashik, my father had an accident and fractured his L1. Our savings were depleted, and we couldn't afford tuition.

I took a drop year and prepared from YouTube. I attempted JEE twice without coaching, and both attempts were unsuccessful. Then I took a Physics Wallah batch that cost 3,999 rupees. Through my JEE score, I got into VIT Pune.

I'm not telling this for sympathy. It's why I'm calm when a plan fails: I've already had to change the plan and keep going. It's also why I like hard problems. I know what it feels like to work through one.


## S09: Forks in the road (3 forks, about 45 seconds each)

Save as `S09_decisions.txt`

**Fork 1: how certgen queues its jobs.**

The options were Redis with Celery, or SQLite in write-ahead-log mode with worker leases and fencing. I chose SQLite. For a take-home, it avoids running an external service, and the limits are written down: a single writer and first-in-first-out ordering.

What would change my mind: If the job needed several machines or many concurrent writers, I'd move to a real queue.

**Fork 2: the optional QR verification route in certgen.**

I built it on a branch. It failed a test I had said in advance was required, because the PDF changed. I did not merge it, and I put the time into the required features.

What would change my mind: The old test contract may have been too rigid. If I deliberately rewrote that test for the new PDF, and the feature then passed everything else, I'd merge it.

**Fork 3: TipIndex scope.**

The options were Tier B, which is narrower, or Tier C, which is more ambitious. I chose Tier B. A narrower result that I can verify and defend is worth more to me than a wider one I can't.

What would change my mind: If I had more time and a way to verify each added piece independently, I'd go for Tier C.


## S10: Philosophy (0:45)

Save as `S10_philosophy.txt`

I love philosophy. My father introduced me to Advaita Vedanta, and I took from it a habit of asking what is actually real here, beneath the first explanation.

I carry that into engineering. When a benchmark looks too good, I ask what the test is really measuring. It's the same question.


## S11: Debate and writing (0:30)

Save as `S11_debate.txt`

I debate, and I write essays. I placed second in a debate, and I wrote an essay for Berggruen. The documents are under my personal effects, and anything without a document is labelled self-reported.

Debate taught me to argue the other side first. That's why this file opens with the case against me.


## S12: Lab pre-registration (1:00)

Save as `S12_lab.txt`

Speak this before you run the Lab, so the prediction is on record first.

Before I run this, here is my prediction, written down in advance. I expect voice to be faster on longer, thinking-heavy tasks, and slower or equal on short, exact ones.

A task counts as usable if I could send it without editing a single word.

I'll do five paired tasks, typing against voice, and I'll alternate which goes first so practice doesn't favor one side. I'll report all five, including the ones where voice loses.

This is one person and five tasks. It's not a study.

**The five tasks (not spoken; you do them, alternating which side goes first):**

1. A reply to a friend's message, written in Hinglish in roman script.
2. A 100-word technical note about a bug.
3. A short status update, like one you'd send in a team chat.
4. A prompt to an AI tool for a coding task.
5. A sentence full of corrections and changes of mind.

S12b (your results) is recorded after you run the Lab. Send the five timings and Claude writes that script from your numbers.


## S13: What I know about Wispr (five observations of about 30 seconds, then a 45-second point of view)

Save as `S13_wispr.txt`

**Observation 1: India.**

India accounts for about 14 percent of Wispr's installs but about 2 percent of its in-app-purchase revenue, according to Sensor Tower data reported by TechCrunch on 9 May 2026.

That gap might be real, or it might be web billing, which in-app data doesn't count. So before I'd treat it as a revenue problem, my first test would be to compare paid conversion for the same Indian cohorts between app-store and web checkout.

**Observation 2: Hinglish.**

Wispr's Series B post, from 17 August 2026, says Hinglish output is romanised, not Devanagari. That tells me Hinglish is a product feature, not just a language setting.

My first test would be a first-run demo dictated in Hinglish against an English one, measured by whether the person reaches a second successful dictation the same day.

**Observation 3: testing intuition.**

Wispr's product-taste post, from 14 September 2026, says the Lens experiment in 2025 taught the team to test intuition against real behaviour.

I'd treat my own growth ideas the same way: write the prediction down before running the test. That is exactly what the Lab on this page does.

**Observation 4: awareness.**

In the mode-switching post, from 11 February 2026, Wispr says awareness work should simplify, invite, and be allowed to be incomplete.

For India, that suggests awareness content that shows one dictation, not a feature list. My first test would be two short assets, one dictation and one feature list, compared by how many people try Flow afterward.

**Observation 5: the cap.**

Wispr's India page promises free unlimited dictation, while the pricing page lists weekly caps: 2,000 words on desktop and 1,000 on iPhone, with Pro removing them.

The first time a user hits a cap is a trust moment. My first test would be to check what an Indian user sees at that moment, and whether it matches what the page promised.

**My point of view (a hypothesis, not a result).**

If I owned India activation, the first thing I'd test is whether a Hinglish dictation into a chat app, shown at first run, gets more people to a second dictation within a day than an English demo does. That's a hypothesis, not a result.


## S14: Closing argument (3:00)

Save as `S14_close.txt`

**Three findings (about 25 seconds each).**

First: I asked for two audits of TipIndex, and they found 26 issues and then 14 more, with the fixes recorded. certgen had 324 green tests and still faced a 19-finding audit. I'd rather hear it from an audit than from a user.

Second: TipIndex's index loses at 1,000 symbols, and I published that. I rejected benchmark runs that broke my own measurement rule, and I call my projects prototypes.

Third: My father's accident, a drop year, two unsuccessful attempts, a 3,999-rupee batch, and then VIT Pune. When the first plan fails, I change the plan and keep going.

**The closing line (about 20 seconds).**

I can't promise I'll be your best hire. What I can promise is that when I'm wrong, you'll hear it from me first, with the evidence and the fix. Everything in this file can be checked. Please check it.

**Three open questions, dated (about 20 seconds each).**

*Have you run a real growth experiment?*

No, not yet. The Voice Adoption Lab is my first, with one person, so treat it as a method, not a result. As of 3 November 2026.

*Did you write all the code yourself?*

No. Agents wrote a substantial share of certgen and TipIndex. I set the requirements, approved the phases, and reviewed and hardened the results. As of 3 November 2026.

*Did you use Flow before this challenge?*

No. I downloaded it on 1 November 2026, and everything on this page marked as spoken with Flow was dictated after that. As of 3 November 2026.

