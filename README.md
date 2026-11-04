# Ek Diya Se Doosra

Shriniwas Kholkute's night page for Wispr Flow's India growth internship: one lamp lights another. Three project lamps (Certgen, Blitz, Vigil), one unlit lamp (an idea, not run), one wish for one real person, and a lamp of your own at the end.

- Copy: `website_copy_lamps.md` (the three lamp stories, levels, journey and latest lines), `website_copy_v3.md` and `website_copy.md` are the sources; everything visible lives in `src/data/copy.json`. Evidence bodies come from `reference/content.json`.
- Stack: React + Vite, no other runtime dependency, system fonts, no analytics, cookies, storage or third-party requests.
- `npm run dev` to work on it, `npm run build` to produce `dist/` and run the checks, `npm test` for the unit tests, `npm run check` to re-run the copy and build checks, `npm run check:gates` for the parity, flash, accessibility and shell gates.
- Browser tests and verification scripts are in `scripts/`; `scripts/e2e/` needs `npm run dev -- --port 5199` first.
- Progress, open flags and every decision are in `BUILD_LOG.md`; the elevation verification report is `ELEVATION_REPORT.md`. Hosting is in `HOSTING.md`. What may be said and what is unconfirmed: `docs/TRUTH_LEDGER.md`, `docs/TRUTH_CHECK.md`.
