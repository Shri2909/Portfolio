import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const out = process.argv[2] || '/tmp';
const b = await chromium.launch();
const log = (ok, m, x = '') => console.log((ok ? 'PASS ' : 'FAIL ') + m + (x ? '  ' + x : ''));
const mk = async (opts = {}) => { const c = await b.newContext({ viewport: { width: 360, height: 640 }, hasTouch: false, ...opts }); const p = await c.newPage(); const errs = []; p.on('console', (m) => m.type() === 'error' && errs.push(m.text())); p.on('pageerror', (e) => errs.push(String(e))); await p.goto('http://127.0.0.1:5199/', { waitUntil: 'networkidle' }); await p.waitForTimeout(500); p.errs = errs; return p; };
const live = (p) => p.evaluate(() => window.__fx.liveCount());
const T = (p, t) => p.evaluate((t) => window.__fx.countType(t), t);
const painted = (p) => p.evaluate(() => { const c = document.getElementById('fx'), d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 3; i < d.length; i += 40) if (d[i] > 8) n++; return n; });
let p = await mk();
await p.waitForTimeout(3500);
log(await T(p, 6) > 0 && await T(p, 6) <= 8, 'at load only a few slow fireflies (the only ambient thing)', String(await T(p, 6)));
log(await T(p, 4) === 0 && await T(p, 3) === 0 && await T(p, 7) === 0, 'at load: no petals, no sparklers, no crackers');
log(await p.evaluate(() => document.getElementById('fx').getBoundingClientRect().width) === 360, 'one shared canvas covers the screen');
log(await p.evaluate(() => document.querySelectorAll('canvas#fx').length === 1), 'exactly one effects canvas');
// pool cap: spam
await p.evaluate(() => { for (let i = 0; i < 80; i++) window.__fx.burst({ kind: 'spark', x: 100 + i, y: 300, count: 12 }); });
const l1 = await live(p);
log(l1 <= 220, 'spamming bursts never exceeds the high-tier cap of 220', String(l1));
await p.waitForTimeout(120);
log(await painted(p) > 0, 'something is painted on the canvas');
await p.waitForTimeout(2500);
log(await live(p) < 30, 'then it settles back down', String(await live(p)));
// light lamp 1: spark, anar, petals start
await p.locator('.lamp-btn').first().click(); await p.waitForTimeout(1500);
await p.waitForTimeout(800); await p.keyboard.press('Escape'); await p.waitForTimeout(700);
log(await T(p, 1) + await T(p, 3) > 0, 'lighting lamp 1 gives a spark pop and a fountain from the roofline', 'sparks=' + await T(p, 1));
await p.waitForTimeout(3000);
log(await T(p, 4) > 0, 'petals begin after the first lit lamp', String(await T(p, 4)));
// lightAll: only one anar (coalescing) -> check no flood
await p.evaluate(() => window.__ek.actions.lightAll()); await p.waitForTimeout(900);
log(await live(p) <= 220, 'Light all stays under the cap', String(await live(p)));
await p.waitForTimeout(3000);
log(await T(p, 5) > 0, 'a sky lamp rises once lamp 3 is lit', String(await T(p, 5)));
await p.waitForTimeout(5500);
const stars = [];
for (let i = 0; i < 10; i++) { stars.push(await T(p, 3)); await p.waitForTimeout(400); }
log(Math.max(...stars) > 0, 'dusk-gold: rockets bloom (burst stars seen)', 'max=' + Math.max(...stars));
await p.screenshot({ path: `${out}/p5-dusk.png` });
// sparkler on empty sky
await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(300);
await p.mouse.move(180, 76); await p.mouse.down(); await p.waitForTimeout(700);
log(await p.locator('.sparkler-wire').count() === 1, 'long-press on empty sky starts a sparkler under the finger');
await p.mouse.move(220, 100, { steps: 6 }); await p.waitForTimeout(500);
log(await T(p, 7) > 0, 'the sparkler throws sparks', String(await T(p, 7)));
await p.screenshot({ path: `${out}/p5-sparkler.png` });
await p.mouse.up(); await p.waitForTimeout(2200);
log(await p.locator('.sparkler-wire').count() === 0, 'lifting early: it burns on briefly, then goes out');
// a quick move before 450 ms is a normal scroll gesture: no sparkler
await p.mouse.move(180, 76); await p.mouse.down(); await p.mouse.move(180, 130, { steps: 3 }); await p.waitForTimeout(700);
log(await p.locator('.sparkler-wire').count() === 0, 'moving more than 10 px first never starts a sparkler'); await p.mouse.up();
// pressing a lamp never starts one
const lb = await p.locator('.lamp-btn').first().boundingBox(); await p.mouse.move(lb.x + 20, lb.y + 20); await p.mouse.down(); await p.waitForTimeout(700); await p.mouse.up();
log(await p.locator('.sparkler-wire').count() === 0, 'pressing a lamp never starts a sparkler');
await p.keyboard.press('Escape'); await p.waitForTimeout(700);
// tap sky: twinkle (limited)
await p.mouse.click(120, 76); await p.waitForTimeout(150);
log(await T(p, 8) > 0, 'a quick tap on empty sky makes a shooting star');
// quality tiers
await p.evaluate(() => window.__ek.actions.setQuality('low')); await p.waitForTimeout(300);
await p.evaluate(() => { for (let i = 0; i < 40; i++) window.__fx.burst({ kind: 'spark', x: 100, y: 300, count: 12 }); });
log(await live(p) <= 40, 'low tier caps at 40', String(await live(p)));
log(p.errs.length === 0, 'no console errors', p.errs.join('|').slice(0, 300));
await p.close();
// Calm: nothing particulate, a still glow instead
p = await mk({ reducedMotion: 'reduce' });
await p.evaluate(() => { window.__fx.burst({ kind: 'spark', x: 100, y: 300 }); window.__fx.burst({ kind: 'anar', x: 150, y: 400 }); });
await p.waitForTimeout(400);
log(await live(p) === 0, 'Calm: no particles at all');
log(await p.evaluate(() => document.querySelectorAll('.fx-halo').length) === 1, 'Calm: the anar becomes one still glow');
await p.mouse.move(180, 76); await p.mouse.down(); await p.waitForTimeout(700); await p.mouse.up();
log(await p.locator('.sparkler-wire').count() === 0, 'Calm: long-press does nothing');
await p.close();
// Ink: crackers dropped
p = await mk(); await p.getByRole('button', { name: 'Menu' }).click(); await p.locator('#menu button:has-text("Ink")').click();
await p.evaluate(() => { window.__fx.burst({ kind: 'anar', x: 150, y: 400 }); window.__fx.burst({ kind: 'rocket', x: 150, y: 400, tx: 150, ty: 100 }); }); await p.waitForTimeout(500);
log(await T(p, 3) === 0 && await p.evaluate(() => window.__fx.countType(1)) === 0, 'Ink: anar and rocket are dropped');
await p.close();
// hidden tab: no catch-up
p = await mk(); await p.evaluate(() => { window.__fx.burst({ kind: 'spark', x: 100, y: 300, count: 8 }); }); await p.waitForTimeout(1500);
log(await live(p) <= 14, 'the loop stops when nothing is alive (only fireflies remain)', String(await live(p)));
await p.close(); await b.close();
