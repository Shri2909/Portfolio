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
    generateBundle() {
      const c = copy(), bad = c.ui.badLink.replace(/<\/?hi>/g, ''), again = c.ui.startAgain.replace(/<\/?hi>/g, '');
      this.emitFile({ type: 'asset', fileName: '404.html', source: `<!doctype html><html lang="en-IN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><meta name="color-scheme" content="dark"><meta name="theme-color" content="#0A0705">${build ? `<meta http-equiv="Content-Security-Policy" content="${CSP}">` : ''}<title>${esc(c.site.title)}</title><link rel="icon" type="image/svg+xml" href="/favicon.svg"><style>html,body{margin:0;background:#0A0705;color:#FFF3DC;font:18px/1.55 system-ui,sans-serif}main{min-height:100svh;display:grid;place-content:center;justify-items:center;gap:20px;padding:24px;text-align:center}svg{width:84px}p{margin:0;max-width:30ch;font-style:italic}a{display:inline-flex;align-items:center;min-height:48px;padding:0 22px;border-radius:999px;background:#F5A623;color:#16110C;font-weight:700;text-decoration:none}a:focus-visible{outline:3px solid #FFD27A;outline-offset:3px}</style></head><body><main><svg viewBox="0 0 120 90" aria-hidden="true"><path d="M20 42h56c0 22-12 34-28 34S20 64 20 42z" fill="#3a2412"/><ellipse cx="48" cy="42" rx="28" ry="7" fill="#2a1a0c"/><path d="M76 40q8-4 14-9" fill="none" stroke="#6b5a45" stroke-width="3" stroke-linecap="round"/></svg><p lang="hi-Latn">${esc(bad)}</p><a href="/" lang="hi-Latn">${esc(again)}</a></main></body></html>` });
    },
    transformIndexHtml: { order: 'post', handler(html, ctx) {
      const s = copy().site;
      const font = ctx && ctx.bundle ? Object.keys(ctx.bundle).find((k) => /fraunces-roman.*\.woff2$/.test(k)) : null;
      html = html.replace('<!--ELEV_POSTER-->', process.env.VITE_ELEVATION === '0' ? '' : '<style>html[data-elev="1"][data-open="cold"] #poster{display:block}html[data-elev="1"][data-open="cold"]:not([data-live]) #stage{visibility:hidden}#poster{display:none;position:fixed;inset:0;z-index:9;pointer-events:none;transition:opacity .24s ease}#poster.out{opacity:0}#poster i{position:absolute;left:var(--fx,46px);top:var(--fy,54svh);display:block;opacity:0;border-radius:50%}#poster .p-streak{width:2px;height:16px;border-radius:1px;background:#FFF3DC;transform-origin:50% 100%;animation:pst .09s .03s cubic-bezier(.25,1,.5,1) both}#poster .p-spark{width:3px;height:3px;margin:-1px 0 0 -1px;background:#FFF3DC;box-shadow:0 0 24px 6px #FFB347;animation:psp .6s .09s ease-out both}#poster .p-glow{width:140px;height:140px;margin:-70px 0 0 -70px;background:radial-gradient(circle,rgba(255,179,71,.30),rgba(255,179,71,0) 70%);animation:pgl .36s .2s cubic-bezier(.16,1,.3,1) both}@keyframes pst{0%{opacity:0;transform:translate(-20px,-20px) rotate(45deg)}30%{opacity:1}100%{opacity:0;transform:translate(0,0) rotate(45deg)}}@keyframes psp{0%{opacity:0}20%{opacity:1}45%{opacity:.5}100%{opacity:1}}@keyframes pgl{from{opacity:0;transform:scale(.2)}to{opacity:1;transform:scale(1)}}@media (prefers-reduced-motion:reduce){#poster i{animation:none!important;opacity:1}#poster .p-streak{display:none}}#poster .p-diya{display:none}html:not([data-elev="1"]) #poster{display:grid;place-items:center;background:#0A0705;z-index:1;transition:opacity .24s ease}html:not([data-elev="1"]) #poster i{display:none}html:not([data-elev="1"]) #poster .p-diya{display:block;width:120px;height:120px;margin-top:-22svh}#poster .p-fl{transform-origin:60px 70px;animation:pfl 2.6s ease-in-out infinite}@keyframes pfl{50%{transform:scale(.94,1.06) rotate(-1.5deg)}}@media (prefers-reduced-motion:reduce){#poster .p-fl{animation:none}}</style>');
      html = html.replace('<!--ELEV_POSTER_DIV-->', process.env.VITE_ELEVATION === '0' ? '' : '<div id="poster" aria-hidden="true"><i class="p-glow"></i><i class="p-streak"></i><i class="p-spark"></i><svg class="p-diya" viewBox="0 0 120 120"><defs><radialGradient id="pg"><stop offset="0" stop-color="#FFB347" stop-opacity=".35"/><stop offset="1" stop-color="#FFB347" stop-opacity="0"/></radialGradient></defs><circle cx="60" cy="62" r="58" fill="url(#pg)"/><path d="M32 70h56c0 22-12 34-28 34S32 92 32 70z" fill="#3a2412"/><ellipse cx="60" cy="70" rx="28" ry="7" fill="#2a1a0c"/><g class="p-fl"><path d="M60 30c8 10 12 18 12 26a12 12 0 0 1-24 0c0-8 4-16 12-26z" fill="#FF7A1A"/><path d="M60 38c5 7 8 13 8 18a8 8 0 0 1-16 0c0-5 3-11 8-18z" fill="#FFB347"/><path d="M60 46c3 4 4 8 4 11a4 4 0 0 1-8 0c0-3 1-7 4-11z" fill="#FFD27A"/></g></svg></div>');
      html = html.replace('<!--ELEV_BOOT-->', process.env.VITE_ELEVATION === '0' ? '' : '<script src="./elev-boot.js"></script>');
      html = html.replace('<!--FONT_PRELOAD-->', font ? `<link rel="preload" as="font" type="font/woff2" crossorigin href="./${font}">` : '');
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
    } },
  };
}

export default defineConfig({
  base: './',
  plugins: [copyPlugin(), react()],
  build: { target: 'es2020', modulePreload: { polyfill: false }, assetsInlineLimit: 0, cssCodeSplit: false, sourcemap: false,
    rollupOptions: { output: { chunkFileNames: (c) => (c.facadeModuleId && /\/src\/elev\//.test(c.facadeModuleId) ? 'assets/elev-[hash].js' : 'assets/[name]-[hash].js') } } },
});
