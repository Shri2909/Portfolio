import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';

const CSP = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'";
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const strip = (v) => Array.isArray(v) ? v.map(strip) : v && typeof v === 'object'
  ? Object.fromEntries(Object.entries(v).filter(([k]) => !k.startsWith('_')).map(([k, x]) => [k, strip(x)])) : v;

// 1. Private notes (keys starting with "_") never reach the bundle.
// 2. Head tags are generated at build time from copy.json (link previews do not run scripts).
function copyPlugin() {
  let build = false;
  const copy = () => JSON.parse(fs.readFileSync('src/data/copy.json', 'utf8'));
  return {
    name: 'ek-diya-copy',
    enforce: 'pre',
    configResolved(c) { build = c.command === 'build'; },
    transform(code, id) {
      if (id.endsWith('/src/data/copy.json')) return { code: JSON.stringify(strip(JSON.parse(code))), map: null };
    },
    transformIndexHtml(html) {
      const s = copy().site;
      const url = (process.env.SITE_URL || '').replace(/\/$/, '');
      if (!url) console.warn('[ek-diya] SITE_URL is not set: og:image and og:url are omitted (they need absolute URLs).');
      const t = [
        build ? `<meta http-equiv="Content-Security-Policy" content="${CSP}">` : '',
        `<title>${esc(s.title)}</title>`,
        `<meta name="description" content="${esc(s.description)}">`,
        '<meta name="theme-color" content="#0A0705">',
        '<meta name="color-scheme" content="dark">',
        '<link rel="icon" type="image/svg+xml" href="favicon.svg">',
        '<meta property="og:type" content="website">',
        `<meta property="og:title" content="${esc(s.og.title)}">`,
        `<meta property="og:description" content="${esc(s.og.description)}">`,
        url ? `<meta property="og:url" content="${esc(url)}/">` : '',
        url ? `<meta property="og:image" content="${esc(url)}/og.png">` : '',
        url ? '<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">' : '',
        `<meta property="og:image:alt" content="${esc(s.og.imageAlt)}">`,
        '<meta name="twitter:card" content="summary_large_image">',
        `<meta name="twitter:title" content="${esc(s.og.title)}">`,
        `<meta name="twitter:description" content="${esc(s.og.description)}">`,
        url ? `<meta name="twitter:image" content="${esc(url)}/og.png">` : '',
        `<meta name="twitter:image:alt" content="${esc(s.og.imageAlt)}">`,
      ].filter(Boolean).join('\n');
      return html.replace('<!--HEAD_TAGS-->', t);
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [copyPlugin(), react()],
  build: { target: 'es2020', modulePreload: { polyfill: false }, assetsInlineLimit: 0, cssCodeSplit: false, sourcemap: false },
});
