# Truth ledger

Status codes: **V** verified in his repo/resume or by him; **S** sourced from his Profile archive (repo-reported); **P** public source; **U** unverified, keep out of production until he confirms.

## Resume (all validated by him; use exactly)

| Claim | Status |
|---|---|
| VIT Pune, B.Tech Instrumentation and Control, Sep 2023 to May 2027, CGPA 8.43 | V |
| Blitz, Feb to May 2026: lock-free cache-line-aligned SPSC ring buffer, 4.41x P99.9 (7,770 ns to 1,762 ns); zero-heap object pool 3.45x (6,079 ns to 1,762 ns); ablation framework PROVEN/INCONCLUSIVE; only GTC orders rest, FOK DryRun, IOC remainder discarded, 5 tests | V |
| Vigil, Dec 2025 to Jan 2026: 6.1 us median, 7.5 us p99 over 20,000 PING/PONG; epoll reactor, 5,000 feeds at 6.4% CPU vs 31.5% thread-per-connection; libFuzzer 11.5M+ iterations under ASan, zero crashes | V |
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

2. Whether he requested the certgen audit.
3. Take 3 cleaned-text source (decides if Take 3 can be shown).
5. Exam sequence: two JEE attempts without coaching, then Physics Wallah batch (Rs 3,999), then VIT Pune through his JEE score.
6. Debate second place and Berggruen essay wording; papers; scholarships; certificates (PDF or "self-reported").
8. Which tool built the page (for Exhibit Z `builtOn`).

## Addendum (from the Profile archive, repo-reported, added for ledger cases)

- Blitz: one headline benchmark of 1,205 ns lacked clean provenance; a reproducible clean-tree rerun gave 1,850 ns; a cache-line-layout advantage fell from about 3.1x to about 1.02x (commit f46a9cb). Slower defensible numbers were published. Never say "the engine is measured at exactly 1,850 ns in production". S, confirm before ledger case c2 goes live.
- Vigil: every spawned thread inherited CPU-0 pinning; fixed with affinity reset, per-thread CPU reporting, interleaved trials; run-to-run instability disclosed. S.

## Addendum, 3 Nov 2026 (from the Evidence Package, supplied by Shriniwas; repo-reported unless stated)

Now on the page, per the Final Website Copy and the drawer:
- certgen: 479 main-suite and 232 audit-suite tests (separate suites, not 711). About 26 MB request to about 192 MB response. Two of the 19 findings are high. Who commissioned the audit is still UNRESOLVED.
- Vigil: 105 of 105 tests; replacing the guard with `if (false)` fails exactly two targeted tests. Verified locally in an agent session, not CI. Simulated connections only.
- Blitz: 1,205 ns came from an uncommitted tree; 1,850 ns controlled run (historical, never current); 3.1x became about 1.02x; commit f46a9cb; 3,059 crossed-at-rest states in 110,000 replay events (2.78%), zero after remediation, latency not remeasured.
- Voice: Take 1 and Take 2 only. Hand transcriptions are not automatically produced transcripts. No voice-to-builder recording exists yet.

