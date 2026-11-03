# Effect cost table (perf build, 390x844, 4x CPU, software rasteriser)

ms is the EWMA per measured use where an effect calls measure(); otherwise the registered estimate. An effect over 2.0 ms is flagged.

| config | effect | kind | priority | ms | scale | shed | pinned |
|---|---|---|---|---|---|---|---|
| 390@4x high | light-surfaces | dom | 6 | 2.236 FLAG | 1 | 0 |  |
| 390@4x high | ambient-particles | canvas | 2 | 1.2 | 1 | 0 |  |
| 390@4x high | canvas-dpr | canvas | 8 | 1 | 1 | 0 |  |
| 390@4x high | particle-cap | canvas | 9 | 0.8 | 1 | 0 |  |
| 390@4x high | lightmap-pool | canvas | 4 | 0.327 | 1 | 0 |  |
| 390@4x high | lightmap-breath | canvas | 7 | 0.3 | 1 | 0 |  |
| 390@4x high | pointer-parallax | dom | 3 | 0.2 | 1 | 0 |  |
| 390@4x high | flames | dom | 2 | 0.1 | 1 | 0 |  |
| 390@4x mid | light-surfaces | dom | 6 | 1.793 | 1 | 0 |  |
| 390@4x mid | ambient-particles | canvas | 2 | 1.2 | 0 | 1 |  |
| 390@4x mid | canvas-dpr | canvas | 8 | 1 | 1 | 0 |  |
| 390@4x mid | particle-cap | canvas | 9 | 0.8 | 1 | 0 |  |
| 390@4x mid | lightmap-breath | canvas | 7 | 0.3 | 1 | 0 |  |
| 390@4x mid | lightmap-pool | canvas | 4 | 0.217 | 1 | 0 |  |
| 390@4x mid | pointer-parallax | dom | 3 | 0.2 | 0 | 1 |  |
| 390@4x mid | flames | dom | 2 | 0.1 | 0 | 1 |  |
