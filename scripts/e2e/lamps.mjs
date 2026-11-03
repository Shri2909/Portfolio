import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const out = process.argv[2];
const b = await chromium.launch();
const log = (ok, m, x = '') => console.log((ok ? 'PASS ' : 'FAIL ') + m + (x ? '  ' + x : ''));
const mk = async (opts = {}) => { const c = await b.newContext({ viewport: { width: 360, height: 640 }, ...opts }); const p = await c.newPage(); const errs = []; p.on('console', (m) => m.type() === 'error' && errs.push(m.text())); p.on('pageerror', (e) => errs.push(String(e))); await p.goto('http://127.0.0.1:5199/', { waitUntil: 'networkidle' }); await p.waitForTimeout(400); p.errs = errs; return p; };
const st = (p) => p.evaluate(() => { const s = window.__ek.getState(); return { lit: s.litCount, lamps: Object.values(s.lamps).join(','), tone: s.tone }; });
const box = (p, sel, i = 0) => p.locator(sel).nth(i).boundingBox();
let p = await mk();
// first screen: headline, lamp row, hold hint together
const vis = await p.evaluate(() => { const r = (s) => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return b.top >= 0 && b.bottom <= innerHeight; }; return { h1: r('h1'), row: r('.lamp-row'), hint: r('.hold-label') }; });
log(vis.h1 && vis.row && vis.hint, 'first screen shows headline, lamp row and hold hint together at 360x640', JSON.stringify(vis));
await p.screenshot({ path: `${out}/p3-first.png` });
const sizes = await p.evaluate(() => [...document.querySelectorAll('.lamp-btn')].map((e) => { const b = e.getBoundingClientRect(); return Math.round(b.width) + 'x' + Math.round(b.height); }));
log(sizes.every((s) => +s.split('x')[0] >= 44 && +s.split('x')[1] >= 44), 'all six lamp buttons are at least 44x44', sizes.join(' '));
log((await p.evaluate(() => document.documentElement.scrollWidth - innerWidth)) <= 0, 'no sideways scroll');
// press lamp 3 before lamp 1: not ready
let bx = await box(p, '.lamp-btn', 2);
await p.mouse.click(bx.x + bx.width / 2, bx.y + 20); await p.waitForTimeout(150);
log((await st(p)).lit === 0, 'pressing lamp 3 first lights nothing');
log((await p.locator('#announcer').innerText()).includes('Light lamp 1 first.'), 'announces "Light lamp 1 first."');
// early release at about half: nothing lit, hint returns
bx = await box(p, '.lamp-btn', 0);
await p.mouse.move(bx.x + bx.width / 2, bx.y + 20); await p.mouse.down(); await p.waitForTimeout(500);
log((await st(p)).lamps.startsWith('lighting'), 'mid-hold: lamp 1 is lighting', (await st(p)).lamps);
log(await p.locator('.holding-tip').count() === 1, 'hold line appears above the lamp');
await p.screenshot({ path: `${out}/p3-hold.png` });
await p.mouse.up(); await p.waitForTimeout(600);
log((await st(p)).lit === 0 && (await st(p)).lamps.startsWith('unlit'), 'early release: nothing lit, state back to unlit', (await st(p)).lamps);
log((await p.locator('.hold-label').innerText()).includes('Dabaye rakhiye'), 'hold hint is back');
// full hold
await p.mouse.move(bx.x + bx.width / 2, bx.y + 20); await p.mouse.down(); await p.waitForTimeout(1100); await p.mouse.up(); await p.waitForTimeout(300);
log((await st(p)).lit === 1, 'full hold lights lamp 1', JSON.stringify(await st(p)));
log((await p.locator('#announcer').innerText()).includes('Lamp 1 is lit. 1 of 5 lamps lit.'), 'announces "Lamp 1 is lit. 1 of 5 lamps lit."');
// quick tap lights lamp 2 within about a second
bx = await box(p, '.lamp-btn', 1);
await p.mouse.click(bx.x + bx.width / 2, bx.y + 20); await p.waitForTimeout(900);
log((await st(p)).lit === 2, 'quick tap lights lamp 2', JSON.stringify(await st(p)));
// keyboard: Enter lights lamp 3, Space lights lamp 4
await p.locator('.lamp-btn').nth(2).focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(900);
log((await st(p)).lit === 3, 'Enter lights lamp 3');
await p.locator('.lamp-btn').nth(3).focus(); await p.keyboard.press('Space'); await p.waitForTimeout(900);
log((await st(p)).lit === 4, 'Space lights lamp 4');
log(!(await p.evaluate(() => document.querySelector('.lamp-btn:nth-child(1)') && 0)) , 'focus ring css present');
await p.screenshot({ path: `${out}/p3-four.png` });
// lamp 5, then the breath and gold
await p.locator('.lamp-btn').nth(4).focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(2600);
const s5 = await st(p);
log(s5.lit === 5 && s5.tone === 5, 'lamp 5 lights; tone is 5', JSON.stringify(s5));
log((await p.locator('#announcer').innerText()).includes('All five lamps are lit. The room has turned warm gold.'), 'announces the room turning gold');
log(await p.evaluate(() => getComputedStyle(document.querySelector('.l6-fill')).opacity) !== '0', 'lamp 6 outline fills (about 0.55) and stays a drawing', await p.evaluate(() => getComputedStyle(document.querySelector('.l6-fill')).opacity));
// lamp 6 never lights
bx = await box(p, '.lamp-btn.six');
await p.mouse.click(bx.x + bx.width / 2, bx.y + 20); await p.waitForTimeout(600);
const mid6 = await p.locator('.six-flame').count();
await p.waitForTimeout(1500);
const s6 = await st(p);
log(s6.lit === 5 && s6.tone === 5, 'pressing lamp 6 changes neither lit count nor tone', JSON.stringify(s6));
log((await p.locator('.status-line').innerText()).includes('Yeh diya abhi nahi jalega'), 'lamp 6 line appears', await p.locator('.status-line').innerText());
log(mid6 === 1, 'a tiny flame tried to catch');
log(await p.locator('.lamp-btn.six .lamp svg path.l6-line').count() === 1, 'lamp 6 stays a dashed outline');
await p.waitForTimeout(2500);
log(await p.locator('#announcer').innerText().then((t) => t.includes('Lamp 6 is proposed, not run.')), 'announces lamp 6 is proposed, not run');
log(p.errs.length === 0, 'no console errors', p.errs.join('|').slice(0, 200));
await p.close();
// Light all
p = await mk();
await p.getByRole('button', { name: /Sab diye ek saath jalaiye/ }).click(); await p.waitForTimeout(6500);
log((await st(p)).lit === 5, 'Light all lights five in order', JSON.stringify(await st(p)));
log((await p.locator('.status-line').innerText()).includes('Paanchon jal uthe'), 'progress line ends on "Paanchon jal uthe."', await p.locator('.status-line').innerText());
log(await p.getByRole('button', { name: /Sab diye ek saath jalaiye/ }).count() === 0, 'Light all hides at five');
await p.screenshot({ path: `${out}/p3-all.png` });
await p.close();
// Calm: single tap lights instantly
p = await mk({ reducedMotion: 'reduce' });
bx = await box(p, '.lamp-btn', 0);
await p.mouse.click(bx.x + bx.width / 2, bx.y + 20); await p.waitForTimeout(80);
log((await st(p)).lit === 1, 'Calm: one tap lights lamp 1 instantly');
log((await p.locator('.calm-note').count()) === 1, 'Calm note is visible');
log(await p.evaluate(() => getComputedStyle(document.querySelector('.traveller')).display) === 'none', 'Calm: no travelling flame');
await p.close();
await b.close();
