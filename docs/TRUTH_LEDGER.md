# Truth ledger

Status codes: **V** verified in his repo/resume or by him; **S** sourced from his Profile archive (repo-reported); **P** public source; **U** unverified, keep out of production until he confirms.

## Resume (all validated by him; use exactly)

| Claim | Status |
|---|---|
| VIT Pune, B.Tech Instrumentation and Control, Sep 2023 to May 2027, CGPA 8.43 | V |
| Blitz, Feb to May 2026: lock-free cache-line-aligned SPSC ring buffer, 4.41x P99.9 (7,770 ns to 1,762 ns); zero-heap object pool 3.45x (6,079 ns to 1,762 ns); ablation framework PROVEN/INCONCLUSIVE; only GTC orders rest, FOK DryRun, IOC remainder discarded, 5 tests | V |
| Vigil, Dec 2025 to Jan 2026: 6.1 us median, 7.5 us p99 over 20,000 PING/PONG; epoll reactor, 5,000 feeds at 6.4% CPU vs 31.5% thread-per-connection; libFuzzer 11.5M+ iterations under ASan, zero crashes | V |
| PitDB, Sep to Nov 2025: bitemporal AS OF, 11.92x; zone-map pushdown proves 99.6% of chunks irrelevant, 44x; cProfile found O(n^2) compaction, 2.24 s to 60.9 ms; pushdown speedup 11.7x to 629.7x over a 1000x synthetic scale sweep | V |
| QuantStorm 2026 National Algorithmic Trading Competition, national rank 65 in Round 1; market-making +3.8 PnL/deal (t about 8.5); 6-turn negotiation +13.1 PnL/deal, 90% win rate | V |

## certgen (take-home; repo-reported; AI agents wrote a substantial share)

- Bulk PDF certificates, up to 10,000 recipients per job, per-row validation, background workers, SQLite WAL job state with worker leases and fencing, ZIP and CSV manifest. S
- 13 architecture decision records; v1.0 required scope frozen before optional features. S
- 324 passing tests and a v1.0-rc tag; a separate forensic audit found 19 issues (quadratic CPU on overlong email, response amplification from unknown fields, resource starvation, host-origin and fairness issues, Unicode/rendering discrepancies). S
- Fixes: red regression test per finding, input caps, error-size limits, host checks, deadlines, per-client fairness, bearer tokens. No blanket security guarantee. S
- Concurrent boot failed 39 of 60 six-process rounds; 0 of 360 after the WAL initialization fix. S
- Optional QR verification route built on a branch, failed a predeclared required test, not merged; the old test contract may have been too rigid. S
- Throughput 83.7 / 139.3 / 167.6 certificates/s at 1/2/4 workers, single machine (do not use on the page unless he asks). S
- Authorship: commit trailers credit autonomous AI work. Never say he personally wrote every endpoint. V
- Whether he requested the audit: UNVERIFIED. Say "the audit found", not "I found". U

## TipIndex (repo-reported; AI agents (Codex, Claude Code) wrote much of the code)

- C++20 in-process publish/subscribe market-data log with selective replay; 268,744,780-message Nasdaq ITCH sample plus synthetic workloads; question inspired by a published Jane Street article (not his invention). S
- Chose Tier B over Tier C; approved phases; stopped at phase boundaries. S
- Contaminated benchmark: a second agent session competed on the pinned core in 9 of 10 rounds; a second run broke the predeclared quiet-machine threshold; both rejected, a later run accepted. S
- 40.6x less CPU for one symbol; 0.585x at 1,000 symbols (index loses). **U: the direction of "0.585" is worded two ways in the Profile. Confirm in the README before publishing.** The chart assumes ">1 means the index wins".
- 27.9% fewer read bytes is MODELED, not measured. S
- Audits: 26 findings then 14 more; fixes recorded in project docs; not independently rerun. Never write "closed 40 defects". S
- 48-entry research ledger. S
- F-01 polling budget: better p99 per poll, higher total work; cause not fully resolved. S
- The repo contains `PHASE_2_INTERVIEW_PREP_PROMPT.md` saying he had "zero working knowledge" of the generated code at that stage. He says he now has full working knowledge of TipIndex. The page's answer points to the file openly. U until he confirms he can answer any question about the code.

## PitDB failure story

Tests found a daylight-saving fold that could admit a future event at an earlier cutoff; duplicate keys and chunk boundaries could give wrong AS OF answers. He says it was found, fixed and resolved before the resume claim. S+V
**U:** the Profile says a 629.70x headline was retracted; the resume uses 629.7x as the end of a scale sweep. The PitDB README must word it the same way before anyone is pointed at it.

## Vigil

- A late heartbeat could restore HEALTHY; late replies now rejected as liveness; tests added with the simulator. S
- Benchmark confound: every spawned thread inherited one CPU's pinning; fixed with affinity reset, per-thread CPU reporting, interleaved trials. S

## Wispr facts (public)

| Fact | Source |
|---|---|
| About 14% of installs vs about 2% of in-app-purchase revenue in India; web billing may explain part of the gap | TechCrunch citing Sensor Tower, 9 May 2026 (P) |
| Hinglish output is romanised, not Devanagari | Series B post, 17 Aug 2026, https://wisprflow.ai/post/series-b (P) |
| Wispr Lens (April to August 2025) taught them to test intuition against real behaviour | https://wisprflow.ai/post/hiring-for-product-taste, 14 Sep 2026 (P) |
| Awareness work should simplify, invite and be allowed to be incomplete | https://wisprflow.ai/post/mode-switching, 11 Feb 2026 (P) |
| India page says free "unlimited dictation"; pricing page lists caps (2,000 words/week desktop, 1,000 iPhone, unlimited Android for a limited time); Pro adds unlimited words | https://wisprflow.ai/pricing (P). Re-read live wording before publishing |
| Series B 17 Aug 2026, $280M at $2B led by Menlo; Flow launched 1 Oct 2024 | P (not used on the page unless asked) |

## Never claim

Growth wins; channel ownership; measured activation lift; Flow use before 1 Nov 2026; production deployment, customers or users for any project; interview or job outcomes; that he personally wrote agent-authored code; that Take 3's cleaned text is Flow's output; any number not in this ledger.

## Open items to confirm with Shriniwas

1. Direction of the 0.585 ratio in TipIndex README.
2. Whether he requested the certgen audit.
3. Take 3 cleaned-text source (decides if Take 3 can be shown).
4. TipIndex "full working knowledge": can he answer any question live.
5. Exam sequence: two JEE attempts without coaching, then Physics Wallah batch (Rs 3,999), then VIT Pune through his JEE score.
6. Debate second place and Berggruen essay wording; papers; scholarships; certificates (PDF or "self-reported").
7. Public repos match the page (PitDB fixes pushed, Vigil CI, Blitz and TipIndex working trees clean, certgen history).
8. Which tool built the page (for Exhibit Z `builtOn`).

## Addendum (from the Profile archive, repo-reported, added for ledger cases)

- Blitz: one headline benchmark of 1,205 ns lacked clean provenance; a reproducible clean-tree rerun gave 1,850 ns; a cache-line-layout advantage fell from about 3.1x to about 1.02x (commit f46a9cb). Slower defensible numbers were published. Never say "the engine is measured at exactly 1,850 ns in production". S, confirm before ledger case c2 goes live.
- TipIndex F-01: polling budget gives better p99 per poll but higher total work; cause not fully resolved. S.
- Vigil: every spawned thread inherited CPU-0 pinning; fixed with affinity reset, per-thread CPU reporting, interleaved trials; run-to-run instability disclosed. S.
- PitDB: full closure of 18 audit findings is NOT established. Say only what he said: the DST-fold issue was found, fixed and resolved before the resume claim. Never "eliminated look-ahead bias".

## Addendum, 3 Nov 2026 (from the Evidence Package, supplied by Shriniwas; repo-reported unless stated)

Now on the page, per the Final Website Copy and the drawer:
- certgen: 479 main-suite and 232 audit-suite tests (separate suites, not 711). About 26 MB request to about 192 MB response. Two of the 19 findings are high. Who commissioned the audit is still UNRESOLVED.
- Vigil: 105 of 105 tests; replacing the guard with `if (false)` fails exactly two targeted tests. Verified locally in an agent session, not CI. Simulated connections only.
- Blitz: 1,205 ns came from an uncommitted tree; 1,850 ns controlled run (historical, never current); 3.1x became about 1.02x; commit f46a9cb; 3,059 crossed-at-rest states in 110,000 replay events (2.78%), zero after remediation, latency not remeasured.
- TipIndex: 820 measured rounds; 5,364 original P6 files byte-identical; P7 attempts (9 of 10 contaminated, 3.52 s against 3.0 s, third passed). "Full working knowledge" is still UNRESOLVED until a live walkthrough.
- PitDB: 06:15 UTC record visible at a 06:00 UTC cutoff in one direct-ingestion DST fold; 346 local tests; the fix is on a local branch and public `main` is the older version.
- Voice: Take 1 and Take 2 only. Hand transcriptions are not automatically produced transcripts. No voice-to-builder recording exists yet.

Held out of production until confirmed (they conflict with the ledger above or with the resume): TipIndex 40.62x and 0.585 (direction of the ratio); PitDB 629.70x retraction, 2.7x memory comparison, 26.5x and 1.08x narrow and broad query figures.
