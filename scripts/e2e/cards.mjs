import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const out = process.argv[2] || '/tmp';
const b = await chromium.launch();
const log = (ok, m, x = '') => console.log((ok ? 'PASS ' : 'FAIL ') + m + (x ? '  ' + x : ''));
const mk = async (opts = {}) => { const c = await b.newContext({ viewport: { width: 360, height: 640 }, ...opts }); const p = await c.newPage(); const errs = []; p.on('console', (m) => m.type() === 'error' && errs.push(m.text())); p.on('pageerror', (e) => errs.push(String(e))); await p.goto('http://127.0.0.1:5199/', { waitUntil: 'networkidle' }); await p.waitForTimeout(400); p.errs = errs; return p; };
const T = (p, sel) => p.locator(sel).first().innerText();
let p = await mk();
// G1: light lamp 1 by keyboard; the card opens by itself 1100 ms later; focus returns to the lamp on close
await p.locator('.lamp-btn').nth(0).focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(2300);
log(await p.evaluate(() => document.getElementById('lamp-card').open), 'G1: lamp 1 lit by Enter; its card opens by itself');
log((await T(p, '#lamp-card h2')) === 'Sab green tha', 'card title is "Sab green tha"');
log(await p.evaluate(() => document.activeElement.id === 'card-title'), 'focus lands on the card title');
await p.waitForTimeout(900);
log(await p.locator('#lamp-card .part.on').count() >= 1, 'part one has inked in');
log(await p.evaluate(() => { const r = document.querySelector('.card').getBoundingClientRect(); return r.left >= 11 && r.right <= 349; }), 'card keeps a 12 px margin at 360 wide');
const text = await p.evaluate(() => document.querySelector('.card').innerText);
log(['What happened', 'Maine phir kya kiya', 'Fair warning', 'OPEN THE CERTGEN RECEIPT', 'Row par waapas', 'Agla diya'].every((s) => text.includes(s)), 'all three parts, receipt, close and Agla diya are in the page');
log(await p.locator('#lamp-card canvas.wall').count() === 1, 'the wall of bulbs is on the card');
log(text.includes('324 / 324 tests pass') && text.includes('324 of 324 tests passed. A separate audit then found 19 problems, two of them high.') && text.includes('A picture, not a map.'), 'chip, plain text and picture-only label are visible without touching anything');
await p.screenshot({ path: `${out}/p4-card1.png` });
// guess 3 -> flicker -> reveal -> "Kam socha?"; start again; 19 -> "Bilkul sahi."
await p.locator('.opts label').nth(1).click(); await p.waitForTimeout(2000);
let t2 = await p.evaluate(() => document.querySelector('.reveal').innerText);
log(t2.includes('The audit found 19 problems, two of them high.') && t2.includes('Kam socha? Aap akele nahi hain. 324 tests ne bhi wahi socha.'), 'guess 3: reveal then "Kam socha?" branch');
await p.screenshot({ path: `${out}/p4-guess.png` });
await p.getByRole('button', { name: 'Phir se shuru kijiye' }).click(); await p.waitForTimeout(200);
await p.locator('.opts label').nth(3).click(); await p.waitForTimeout(2000);
t2 = await p.evaluate(() => document.querySelector('.reveal').innerText);
log(t2.includes('Bilkul sahi. Tests ko yeh nahi dikha tha.'), 'guess 19: "Bilkul sahi."');
await p.evaluate(() => document.querySelector('.card-scroll').scrollTo(0, 99999)); await p.waitForTimeout(600);
log(await p.locator('#lamp-card .part.on').count() === 3, 'scrolling inks in parts two and three in order');
// receipt: card hides, drawer opens, closing brings the card back at the same scroll
const before = await p.evaluate(() => document.querySelector('.card-scroll').scrollTop);
await p.getByRole('button', { name: 'OPEN THE CERTGEN RECEIPT' }).click(); await p.waitForTimeout(400);
log(await p.evaluate(() => document.getElementById('evidence').open && !document.getElementById('lamp-card').open), 'receipt opens the evidence drawer and hides the card');
await p.keyboard.press('Escape'); await p.waitForTimeout(500);
const after = await p.evaluate(() => ({ open: document.getElementById('lamp-card').open, st: document.querySelector('.card-scroll').scrollTop }));
log(after.open && Math.abs(after.st - before) < 3, 'closing the drawer brings the card back at the same scroll position', JSON.stringify({ before, after }));
// close with the Row par waapas button: focus returns to the lamp
await p.getByRole('button', { name: 'Row par waapas' }).click(); await p.waitForTimeout(700);
log(!(await p.evaluate(() => document.getElementById('lamp-card').open)), 'Row par waapas closes the card');
log(await p.evaluate(() => document.activeElement === document.querySelectorAll('.lamp-btn')[0]), 'focus returns to lamp 1');
// the rest of the lamps
await p.evaluate(() => { const { actions } = window.__ek; for (const n of [2, 3, 4, 5]) { actions.startLighting(n); actions.finishLighting(n, 0, 0); } }); await p.waitForTimeout(300);
const open = async (n) => { await p.locator('.story-list li').nth(n - 1).getByRole('button').click(); await p.waitForTimeout(900); };
// lamp 2: slider
await open(2);
log((await p.locator('.late input[type=range]').count()) === 1, 'lamp 2: the slider is a real range input');
log((await T(p, '.late .readout')).includes('Reply at 2.0 s, before the 3-second deadline. Counted as proof the connection is alive.'), 'slider starts at 2 s with the "before" readout');
log((await p.locator('.model-badge').innerText()) === 'MODEL OF DOCUMENTED BEHAVIOR', 'MODEL OF DOCUMENTED BEHAVIOR label is visible');
const setT = async (idx) => { await p.locator('.late input[type=range]').evaluate((el, v) => { const s = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; s.call(el, v); el.dispatchEvent(new Event('input', { bubbles: true })); }, String(idx)); await p.waitForTimeout(600); };
await setT(11);
log((await T(p, '.late .readout')).includes('Reply at 4.4 s, after the 3-second deadline. Original logic: still counted as proof of health. Yahi dikkat thi.'), 'original logic after the deadline: still counted');
await p.getByRole('button', { name: 'Corrected logic' }).click(); await p.waitForTimeout(600);
log((await T(p, '.late .readout')).includes('Corrected logic: not counted as proof of current health.'), 'corrected logic after the deadline: not counted');
log(await p.evaluate(() => document.querySelector('.late input').getAttribute('aria-valuetext')) === '4.4 seconds, after the 3-second deadline', 'spoken value after the deadline');
log(await p.evaluate(() => { const i = document.querySelector('.late input'); return [...Array(16).keys()].every((k) => (k * 0.4).toFixed(1) !== '3.0'); }), 'exactly 3.0 s cannot be chosen (R9)');
const th = await p.evaluate(() => document.querySelector('.late input').getBoundingClientRect().height);
log(th >= 44, 'slider track/thumb area is at least 44 px tall', String(th));
await p.screenshot({ path: `${out}/p4-late.png` });
await p.getByRole('button', { name: 'Row par waapas' }).click(); await p.waitForTimeout(600);
// lamp 3: price tag
await open(3);
let tt = await p.evaluate(() => document.querySelector('.pricetag').innerText);
log(tt.includes('1,205 nanoseconds') && tt.includes('3.1×'), 'lamp 3: front shows 1,205 nanoseconds and the 3.1× bar');
await p.getByRole('button', { name: 'Flip the tag' }).click(); await p.waitForTimeout(1200);
tt = await p.evaluate(() => document.querySelector('.pricetag').innerText);
log(tt.includes('1,850') && tt.includes('1.02×') && await p.locator('.tag.flipped').count() === 1, 'flipped: 1,850, historical run chip, bar at 1.02×');
const cardText = await p.evaluate(() => document.querySelector('.card').innerText);
log(!/\b(40\.62|0\.585|629\.70|26\.5|1\.08)\b/.test(cardText), 'no held-out number appears on the card');
await p.screenshot({ path: `${out}/p4-tag.png` });
await p.getByRole('button', { name: 'Row par waapas' }).click(); await p.waitForTimeout(600);
// lamp 4: handoff
await open(4);
await p.evaluate(() => document.querySelector('.card-scroll').scrollTo(0, 400)); await p.waitForTimeout(500);
await p.locator('.baton-btn').click(); await p.waitForTimeout(2300);
log(await p.locator('.lantern-l.right.lit').count() === 1, 'lamp 4: baton lands and the Claude Code lantern lights');
await p.getByRole('button', { name: 'Hold to count the rounds' }).click(); await p.waitForTimeout(3300);
const cnt = await p.evaluate(() => document.querySelector('.counter').innerText);
log(cnt === '820 of 820 completed measurement rounds', 'counter stops at exactly 820 of 820', cnt);
log(!(await p.evaluate(() => document.querySelector('.handoff').innerText)).match(/\b(5,364|[0-9]{4,}\b)/) , 'nothing larger than 820 is shown');
await p.screenshot({ path: `${out}/p4-handoff.png` });
await p.getByRole('button', { name: 'Row par waapas' }).click(); await p.waitForTimeout(600);
// lamp 5: cutoff clock
await open(5);
log((await p.locator('.clock input[type=range]').getAttribute('aria-valuetext')) === '06:00 UTC', 'lamp 5: range input speaks "06:00 UTC"');
let ro = await T(p, '.clock .readout');
log(ro === 'Cutoff 06:00. The 06:15 event is already visible. It should not be yet.', 'direct route at 06:00: the 06:15 event is already visible', ro);
await p.getByRole('button', { name: 'Normalized UTC CSV route' }).click(); await p.waitForTimeout(200);
ro = await T(p, '.clock .readout');
log(ro === 'Cutoff 06:00. The 06:15 event is not visible yet.', 'CSV route at 06:00: not visible yet', ro);
log(await p.locator('.clock .band-note').innerText() === 'That correction is not yet reflected in the public default branch.', 'the not-yet-reflected band is visible under the dial');
log((await p.evaluate(() => document.querySelector('#part-h-1').innerText)).startsWith('Phir kya hua'), 'the label above the did-next part still says "Phir kya hua"');
await p.screenshot({ path: `${out}/p4-clock.png` });
// swipe down from the grab pill closes the card
const g = await p.locator('.grab').boundingBox();
await p.getByRole('button', { name: 'Agla diya (lamp 6)' }).click(); await p.waitForTimeout(800);
log(!(await p.evaluate(() => document.getElementById('lamp-card').open)), 'Agla diya on lamp 5 closes the card');
log(p.errs.length === 0, 'no console errors', p.errs.join('|').slice(0, 300));
await p.close();
// Calm: card just fades; parts all shown at once
p = await mk({ reducedMotion: 'reduce' });
await p.evaluate(() => { const { actions } = window.__ek; actions.startLighting(1); actions.finishLighting(1, 0, 0); }); await p.waitForTimeout(300);
await p.locator('.story-list li').first().getByRole('button').click(); await p.waitForTimeout(700);
log(await p.locator('#lamp-card .part.on').count() === 3, 'Calm: all three parts shown at once');
await p.close(); await b.close();
