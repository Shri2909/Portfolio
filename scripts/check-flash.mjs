// E8.6 flash check (WCAG 2.3.1 general-flash, lean): CDP screencast frames are decoded in-page, relative luminance per pixel,
// a flash is an opposite pair of luminance changes >= 0.10 over >= 2.8% of the frame. Fails on > 3 per rolling second,
// on a single frame step changing > 20% of the frame by > 0.20, or on a saturated-red pair. Sequences: boot, hold diya, scroll through the acts, Calm toggle.
import { serve } from './e2e/serve.mjs';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const { srv, base } = serve(); const b = await chromium.launch({ args: ['--no-sandbox'] });
const IDS = ['night', 'baithak', 'lamp-1', 'lamp-2', 'lamp-3', 'pattern', 'voice', 'lamp-6', 'verdict', 'deeper', 'wish', 'closure'];
let bad = 0;
async function run(name, drive, mean = false) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true }); const p = await ctx.newPage(); const cdp = await ctx.newCDPSession(p);
  const frames = []; cdp.on('Page.screencastFrame', (f) => { frames.push({ t: f.metadata.timestamp * 1000, d: f.data }); cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {}); });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 40, maxWidth: 96, maxHeight: 192, everyNthFrame: 1 });
  await p.goto(base); await drive(p);
  await cdp.send('Page.stopScreencast');
  const stats = await p.evaluate(async ({ fr, mean }) => {
    const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    const out = []; let prev = null;
    for (const f of fr) {
      const i = new Image(); i.src = 'data:image/jpeg;base64,' + f.d; await i.decode(); const c = document.createElement('canvas'); c.width = i.width; c.height = i.height; const x = c.getContext('2d'); x.drawImage(i, 0, 0); const d = x.getImageData(0, 0, c.width, c.height).data;
      const L = new Float32Array(d.length / 4), R = new Float32Array(d.length / 4);
      for (let k = 0, j = 0; k < d.length; k += 4, j++) { L[j] = 0.2126 * lin(d[k]) + 0.7152 * lin(d[k + 1]) + 0.0722 * lin(d[k + 2]); R[j] = d[k] / Math.max(1, d[k] + d[k + 1] + d[k + 2]); }
      if (prev) { let up = 0, dn = 0, big = 0, red = 0; const n = L.length; for (let k = 0; k < n; k++) { const dl = L[k] - prev.L[k]; if (dl >= 0.1) up++; else if (dl <= -0.1) dn++; if (Math.abs(dl) > 0.2) big++; if ((R[k] >= 0.8) !== (prev.R[k] >= 0.8) && Math.abs(dl) >= 0.1) red++; } if (mean) { let a = 0, c2 = 0; for (let k = 0; k < n; k++) { a += prev.L[k]; c2 += L[k]; } const dm = (c2 - a) / n; out.push({ t: f.t, up: dm >= 0.1 ? 1 : 0, dn: dm <= -0.1 ? 1 : 0, big: Math.abs(dm) > 0.2 ? 1 : 0, red: 0 }); } else out.push({ t: f.t, up: up / n, dn: dn / n, big: big / n, red: red / n }); }
      prev = { L, R };
    }
    return out;
  }, { fr: frames.filter((f) => f.t - frames[0].t > 400), mean });
  const events = []; let worst = 0;
  for (const s of stats) {
    worst = Math.max(worst, s.big);
    if (s.big > 0.2) { console.log(`  FAIL ${name}: one frame step changes ${(100 * s.big).toFixed(0)}% of the frame by > 0.20`); bad++; }
    if (s.red >= 0.028) { console.log(`  FAIL ${name}: saturated-red flash pair`); bad++; }
    if (s.up >= 0.028) events.push({ t: s.t, s: 1 }); else if (s.dn >= 0.028) events.push({ t: s.t, s: -1 });
  }
  const dec = stats;
  let flashes = []; for (let i = 1; i < events.length; i++) if (events[i].s !== events[i - 1].s) flashes.push(events[i].t);
  let maxIn1s = 0; for (let i = 0; i < flashes.length; i++) maxIn1s = Math.max(maxIn1s, flashes.filter((t) => t >= flashes[i] && t < flashes[i] + 1000).length);
  console.log(`${name}: ${dec.length} frames, flashes max ${maxIn1s}/s, worst single-step area ${(100 * worst).toFixed(1)}%`);
  if (maxIn1s > 3) { console.log(`  FAIL ${name}: more than 3 flashes in one second`); bad++; }
  await ctx.close();
}
await run('boot', async (p) => { await p.waitForTimeout(6000); });
await run('hold diya', async (p) => { await p.waitForTimeout(4500); const h = await p.$('.home-wrap, [data-hold], #night button'); if (h) { const bb = await h.boundingBox(); await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2); await p.mouse.down(); await p.waitForTimeout(2500); await p.mouse.up(); } await p.waitForTimeout(3000); });
await run('acts', async (p) => { await p.waitForTimeout(4500); for (const id of IDS) { if (await p.$('#' + id)) { await p.evaluate((i) => document.getElementById(i).scrollIntoView({ behavior: 'smooth' }), id); await p.waitForTimeout(1300); } } }, true); // scrolling moves text pixel by pixel, so this sequence uses whole-frame mean luminance
await run('calm toggle', async (p) => { await p.waitForTimeout(4500); const c = await p.$('#calm-corner'); if (c) { await c.click(); await p.waitForTimeout(1200); await c.click(); await p.waitForTimeout(1200); } });
await b.close(); srv.close(); console.log(bad ? `check-flash: ${bad} problem(s)` : 'check-flash: clean'); process.exit(bad ? 1 : 0);
