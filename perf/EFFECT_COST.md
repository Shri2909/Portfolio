# Effect cost table (perf build, 390x844, 4x CPU, software rasteriser)

ms is the EWMA per measured use where an effect calls measure(); otherwise the registered estimate. An effect over 2.0 ms is flagged.

| config | effect | kind | priority | ms | scale | shed | pinned |
|---|---|---|---|---|---|---|---|
| 390@4x high | sp-wall | canvas | 6 | 2.2 FLAG | 0 | 1 |  |
| 390@4x high | ambient-particles | canvas | 2 | 1.2 | 0 | 1 |  |
| 390@4x high | sp-price | dom | 6 | 1.2 | 1 | 0 |  |
| 390@4x high | canvas-dpr | canvas | 8 | 1 | 1 | 0 |  |
| 390@4x high | sp-late | dom | 6 | 1 | 1 | 0 |  |
| 390@4x high | particle-cap | canvas | 9 | 0.8 | 1 | 0 |  |
| 390@4x high | sp-baithak | dom | 6 | 0.8 | 1 | 0 |  |
| 390@4x high | sp-relay | dom | 6 | 0.6 | 1 | 0 |  |
| 390@4x high | sp-clock | dom | 6 | 0.4 | 1 | 0 |  |
| 390@4x high | lightmap-breath | canvas | 7 | 0.3 | 0 | 1 |  |
| 390@4x high | sp-proof | dom | 6 | 0.3 | 0 | 1 |  |
| 390@4x high | sp-voice | dom | 6 | 0.3 | 1 | 0 |  |
| 390@4x high | wake | dom | 8 | 0.2 | 1 | 0 |  |
| 390@4x high | pointer-parallax | dom | 3 | 0.2 | 0 | 1 |  |
| 390@4x high | flames | dom | 2 | 0.1 | 0 | 1 |  |
| 390@4x high | hold-heat | dom | 2 | 0.1 | 0 | 1 |  |
| 390@4x high | attract | dom | 5 | 0.1 | 0 | 1 |  |
| 390@4x high | touch | dom | 8 | 0.1 | 1 | 0 |  |
| 390@4x high | way | dom | 5 | 0.1 | 0 | 1 |  |
| 390@4x high | menu | dom | 5 | 0.1 | 0 | 1 |  |
| 390@4x high | focusflame | dom | 8 | 0.1 | 1 | 0 |  |
| 390@4x high | hop | dom | 5 | 0.1 | 0 | 1 |  |
| 390@4x high | invite | dom | 5 | 0.1 | 0 | 1 |  |
| 390@4x high | light-surfaces | dom | 6 | 0.015 | 0 | 1 |  |
| 390@4x high | lightmap-pool | canvas | 4 | 0.002 | 0 | 1 |  |
| 390@4x mid | sp-wall | canvas | 6 | 2.2 FLAG | 0 | 1 |  |
| 390@4x mid | ambient-particles | canvas | 2 | 1.2 | 0 | 1 |  |
| 390@4x mid | sp-price | dom | 6 | 1.2 | 1 | 0 |  |
| 390@4x mid | canvas-dpr | canvas | 8 | 1 | 1 | 0 |  |
| 390@4x mid | sp-late | dom | 6 | 1 | 1 | 0 |  |
| 390@4x mid | particle-cap | canvas | 9 | 0.8 | 1 | 0 |  |
| 390@4x mid | sp-baithak | dom | 6 | 0.8 | 1 | 0 |  |
| 390@4x mid | sp-relay | dom | 6 | 0.6 | 1 | 0 |  |
| 390@4x mid | sp-clock | dom | 6 | 0.4 | 1 | 0 |  |
| 390@4x mid | lightmap-breath | canvas | 7 | 0.3 | 0 | 1 |  |
| 390@4x mid | sp-proof | dom | 6 | 0.3 | 0 | 1 |  |
| 390@4x mid | sp-voice | dom | 6 | 0.3 | 1 | 0 |  |
| 390@4x mid | wake | dom | 8 | 0.2 | 1 | 0 |  |
| 390@4x mid | pointer-parallax | dom | 3 | 0.2 | 0 | 1 |  |
| 390@4x mid | flames | dom | 2 | 0.1 | 0 | 1 |  |
| 390@4x mid | hold-heat | dom | 2 | 0.1 | 0 | 1 |  |
| 390@4x mid | attract | dom | 5 | 0.1 | 0 | 1 |  |
| 390@4x mid | touch | dom | 8 | 0.1 | 1 | 0 |  |
| 390@4x mid | way | dom | 5 | 0.1 | 0 | 1 |  |
| 390@4x mid | menu | dom | 5 | 0.1 | 0 | 1 |  |
| 390@4x mid | focusflame | dom | 8 | 0.1 | 1 | 0 |  |
| 390@4x mid | hop | dom | 5 | 0.1 | 0 | 1 |  |
| 390@4x mid | invite | dom | 5 | 0.1 | 0 | 1 |  |
| 390@4x mid | light-surfaces | dom | 6 | 0.009 | 0 | 1 |  |
| 390@4x mid | lightmap-pool | canvas | 4 | 0 | 0 | 1 |  |
