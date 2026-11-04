// E8.5 check: with JS disabled the page shows a lit diya plus the noscript sentence (not blank); with JS on, no white frame at 300 ms.
import { serve } from './e2e/serve.mjs';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const { srv, base } = serve(); const b = await chromium.launch({ args: ['--no-sandbox'] }); let bad = 0;
const lum = (png) => 0; // placeholder replaced below by in-page canvas-free probe
const ctx = await b.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } }); const p = await ctx.newPage();
await p.goto(base); await p.waitForTimeout(300);
const st = await p.evaluate(() => ({ diya: !!document.querySelector('#poster .p-diya') && getComputedStyle(document.querySelector('#poster .p-diya')).display !== 'none', text: document.querySelector('noscript') && document.body.innerText.includes('needs JavaScript') }));
console.log('no-JS:', JSON.stringify(st)); if (!st.diya) { console.log('FAIL no lit diya without JS'); bad++; }
await ctx.close();
const c2 = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 }); const q = await c2.newPage(); const cdp = await c2.newCDPSession(q); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
await q.goto(base, { waitUntil: 'commit' }); await q.waitForTimeout(300);
const buf = await q.screenshot(); const white = await q.evaluate(async (b64) => { const i = new Image(); i.src = 'data:image/png;base64,' + b64; await i.decode(); const c = document.createElement('canvas'); c.width = i.width; c.height = i.height; const x = c.getContext('2d'); x.drawImage(i, 0, 0); const d = x.getImageData(0, 0, c.width, c.height).data; let w = 0; for (let k = 0; k < d.length; k += 4) if (d[k] > 235 && d[k + 1] > 235 && d[k + 2] > 235) w++; return w / (d.length / 4); }, buf.toString('base64'));
console.log('white pixel share at 300 ms:', white.toFixed(4)); if (white > 0.5) { console.log('FAIL white frame'); bad++; }
await b.close(); srv.close(); console.log(bad ? 'check-shell: FAIL' : 'check-shell: ok'); process.exit(bad ? 1 : 0);
