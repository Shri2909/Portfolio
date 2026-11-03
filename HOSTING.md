# Hosting Ek Diya Se Doosra

The site is a static folder: **`dist/`**. It has no server, database, analytics, cookies or storage. I did not deploy it.

## Build
```bash
npm install
SITE_URL=https://your-real-address.example npm run build
```
- `SITE_URL` is needed for the share preview. Without it the build still works but leaves out `og:image` and `og:url` (those must be absolute), and prints a warning.
- The build runs `scripts/check-build.mjs`. It fails on outside hosts, storage use, forbidden strings, gated lines switched on, or over-budget files.

## Deploy
Upload the contents of `dist/` to any static host (Netlify, Vercel static, Cloudflare Pages, GitHub Pages, an S3 bucket). Asset paths are relative, so it also works from a sub-folder. No redirects or server rules are needed. The content security policy is a `<meta>` tag inside `index.html`, so it travels with the file.

## After deploying, check by hand
1. Open the live address on a phone and look at the network tab: only files from your own address should load.
2. Paste the address into WhatsApp to yourself and look at the preview image.
3. Open `…/#v1.7.Asha` and confirm the banner appears.
4. Click every "OPEN THE … RECEIPT" link and the repository links in a private window. Some audit reports are local in the repositories, and PitDB's public default branch is the older version.
