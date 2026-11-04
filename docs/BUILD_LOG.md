# Build log

## 4 Nov 2026: rebuilt as Ek Diya Se Doosra

The site is a night Deepavali page: one lamp lights another. Earlier themes were removed entirely (code, content, docs, tests, share image).

- Structure: opening with the lamp row and hold-to-light, then the six-step journey (01 Meet the person, 02 Three lamps, 03 Why Wispr Flow, 04 The Handover Test, 05 Continue the conversation, 06 Go deeper).
- Three lamp stories (Certgen, Blitz, Vigil) are the user's text word for word, each in three levels (instantly visible, poora kissa, inspect the evidence).
- Visual: dark sky that warms with each lit lamp (tone 0 to 3, dusk-gold when all three are lit, warmer again when the visitor's lamp is lit), clay diya SVGs with CSS flames, system fonts only, no storage.
- Widgets kept and restyled: guess the audit result, the late reply, Take 1 vs Take 2 compare.
- Added: wish card and visitor lamp (made in the tab, nothing saved), Lamp 04 (proposed, not run).
- Not built from `build_prompts.md`: skyline, rangoli, particle effects, share link counts, haptics, Calm toggle, lamp-card transitions. Reduced motion shows final states.
- GitHub and LinkedIn buttons need `site.contact.github` and `site.contact.linkedin` (both empty).
- Tests: `node scripts/test.mjs`, 124 passed, 0 failed (includes the line-by-line check of the three lamp stories against `website_copy.md`).
