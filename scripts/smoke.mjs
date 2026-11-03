// Browser smoke test (dev tool). Usage: node scripts/smoke.mjs <outDir> [baseUrl]
// Needs Playwright (preinstalled in the build container). Serves dist/ itself if no baseUrl is given.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const out = process.argv[2] || '/tmp/ek-smoke';
fs.mkdirSync(out, { recursive: true });
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png' };
let server, base = process.argv[3];
if (!base) {
  server = http.createServer((req, res) => {
    const f = path.join(root, 'dist', decodeURIComponent(req.url.split('?')[0]).replace(/\/$/, '/index.html'));
    if (!f.startsWith(path.join(root, 'dist')) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); res.end(fs.readFileSync(f));
  }).listen(0);
  base = 'http://127.0.0.1:' + server.address().port + '/';
}
const results = [];
const ok = (name, cond, extra = '') => { results.push([cond, name, extra]); console.log((cond ? 'PASS ' : 'FAIL ') + name + (extra ? '  ' + extra : '')); };
const browser = await chromium.launch();
const checks = (await import('./smoke-checks.mjs')).default;
await checks({ browser, base, out, ok });
await browser.close(); server && server.close();
const failed = results.filter((r) => !r[0]).length;
console.log(`\nsmoke: ${results.length - failed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
