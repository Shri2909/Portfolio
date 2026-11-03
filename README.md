# Ek Diya Se Doosra

Shriniwas Kholkute's night page for Wispr Flow's India growth internship: one lamp lights another. Five projects, five lamps, one wish for one real person, and a lamp of your own at the end.

- Copy: `website_copy.md` (every visible word) is loaded into `src/data/copy.json`. Build briefs: `build_prompts.md` (packs 1 to 7; pack 8 is not built).
- Stack: React + Vite, no other runtime dependency, system fonts, no analytics, cookies, storage or third-party requests.
- `npm run dev` to work on it, `npm run build` to produce `dist/` and run the checks, `npm test` for the unit tests, `npm run check` to re-run the copy and build checks.
- Browser tests are in `scripts/e2e/` (start `npm run dev -- --port 5199` first); `scripts/smoke.mjs` tests the production build.
- Progress, open flags and every decision are in `BUILD_LOG.md`. Hosting is in `HOSTING.md`.
- The previous detective-style site is kept at git tag `detective-site-final`.
