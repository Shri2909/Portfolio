# Ek Diya Se Doosra

A night Deepavali portfolio for Shriniwas Kholkute (Wispr Flow India growth internship challenge). One lamp lights another: three lamp stories (Certgen, Blitz, Vigil), each in three levels, then the voice, the proposed growth test, the conversation and a self-paced deeper dive.

- `content/content.json`: all public text (production).
- `website_copy.md`: the copy the page is built from, including the three lamp stories word for word.
- `docs/`: truth ledger and truth check (what may be said, what is unconfirmed).
- `src/`: `template.html`, `styles.css`, `js/` (numbered modules), `review/`.
- `scripts/`: `build.py` (builds `dist/`), `test.mjs` (Playwright), `assets.mjs` (share image).
- `dist/`: build output (`index.html` production, `review.html` review). Committed.

Build and test:

```bash
python3 scripts/build.py
node scripts/test.mjs
```
