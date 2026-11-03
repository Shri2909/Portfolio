import { createRequire } from 'node:module';
import { serve } from './serve.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const { srv, base } = serve(); const b = await chromium.launch();
const log = (ok, m, x = '') => console.log((ok ? 'PASS ' : 'FAIL ') + m + (x ? '  ' + x : ''));
const mk = async (w = 390, h = 844, hash = '', o = {}) => { const c = await b.newContext({ viewport: { width: w, height: h }, permissions: ['clipboard-read', 'clipboard-write'], ...o }); const p = await c.newPage(); p.cons = []; p.on('console', (m) => ['error', 'warning'].includes(m.type()) && p.cons.push(m.text())); p.on('pageerror', (e) => p.cons.push(String(e))); await p.goto(base + hash, { waitUntil: 'networkidle' }); await p.waitForTimeout(600); return p; };
const esc = (p) => p.keyboard.press('Escape').then(() => p.waitForTimeout(500));
for (const [w, h] of [[390, 844], [1366, 768]]) {
  const p = await mk(w, h);
  const r = await p.evaluate(() => { const vis = (e) => { const r = e.getBoundingClientRect(), cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight && cs.visibility !== 'hidden' && parseFloat(cs.opacity) > 0.05; }; const t = document.body.innerText; return { invite: !!document.querySelector('#topbar [data-invite]'), chips: [...document.querySelectorAll('.lamp-btn .chip')].filter(vis).length, counter: /diye jal chuke/.test(document.querySelector('.status-line').innerText), growthBtn: [...document.querySelectorAll('button')].some((x) => /SEE THE GROWTH TEST/.test(x.innerText) && vis(x)), lightAll: [...document.querySelectorAll('button')].some((x) => /Sab diye ek saath/.test(x.innerText) && vis(x)), look: [...document.querySelectorAll('button')].some((x) => /^Ink$/.test(x.innerText) && vis(x)), lamps: [...document.querySelectorAll('.lamp-btn')].map((l) => l.getBoundingClientRect().bottom <= innerHeight) }; });
  log(!r.invite && !r.chips && !r.counter && !r.growthBtn && !r.lightAll && !r.look && r.lamps.every(Boolean), `1: ${w}x${h}: first screen has no INVITE ME, chips, counter, growth button, light-all or Look; all six lamps inside`, JSON.stringify(r));
  await p.context().close(); }
let p = await mk(390, 844);
const op0 = await p.evaluate(() => getComputedStyle(document.querySelector('#night .b2')).opacity);
await p.mouse.click(300, 600); await p.waitForTimeout(200);
log(+op0 < 0.9 && await p.evaluate(() => document.getElementById('night').dataset.beat) === '4', '1: the headline reveals in beats and a tap completes it', 'b2 opacity before tap ' + op0);
const ids = await p.evaluate(() => [...document.querySelectorAll('main > section')].map((s) => s.id));
log(JSON.stringify(ids) === JSON.stringify(['night', 'lamp-1', 'baithak', 'lamp-2', 'lamp-3', 'lamp-4', 'lamp-5', 'voice', 'lamp-6', 'verdict', 'wish', 'closure']), '2: running order is first screen, lamp 1, sitting room, lamps 2 to 5, voice, last lamp, verdict, wish, closure', ids.join(','));
log(await p.locator('#lamps, #row-breathes, #person').count() === 0, '2: the old #lamps list, #row-breathes and #person are gone');
// stop for lamp 1: tap a guess, Poora kissa
await p.evaluate(() => document.getElementById('lamp-1').scrollIntoView({ behavior: 'instant' })); await p.waitForTimeout(400);
await p.locator('#lamp-1 .opts label').nth(1).click(); await p.waitForTimeout(2200);
log((await p.locator('#lamp-1').innerText()).includes('19 findings · 2 high') && (await p.locator('#lamp-1').innerText()).includes('Kam socha?'), '3: lamp 1 stop: guess, reveal, new chip and the Kam socha line');
await p.locator('#lamp-1').getByRole('button', { name: /Full story: certgen receipt/i }).click(); await p.waitForTimeout(900);
const sheet = await p.locator('#lamp-card').innerText();
log(sheet.includes('Imagine a college generating thousands of certificates') && sheet.includes('479 main and 232 audit tests') && !sheet.includes('How many problems'), '3: Poora kissa opens the receipt sheet with the v2 text and no guess widget');
await esc(p);
log(await p.evaluate(() => !document.getElementById('lamp-card').open && document.activeElement.textContent.includes('Poora kissa')), '3: closing returns focus to the Poora kissa button');
// light lamp 1 by keyboard: no auto card
await p.evaluate(() => scrollTo({ top: 0, behavior: 'instant' })); await p.locator('.lamp-btn').first().focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(2600);
log(!(await p.evaluate(() => document.getElementById('lamp-card').open)) && await p.locator('.lamp-btn.lit').count() === 1, 'lamp 1 lights and no card opens by itself');
log((await p.locator('.lamp-btn .chip').first().innerText()).includes('CERTGEN'), 'the lamp label appears once it is lit');
// pass the flame from a stop
await p.evaluate(() => document.getElementById('lamp-2').scrollIntoView({ behavior: 'instant' })); await p.waitForTimeout(500);
log(await p.evaluate(() => !!document.querySelector('#topbar [data-invite]')), '6: the top-bar INVITE ME appears after the sitting room');
await p.locator('#lamp-2').getByRole('button', { name: /Lamp 2 ko chhuiye/ }).click(); await p.waitForTimeout(1500);
log(await p.locator('.lamp-btn.lit').count() === 2, '3: Lamp 2 ko chhuiye passes the flame and lights lamp 2');
log((await p.locator('#lamp-2').innerText()).includes('Lamp 2 jal utha'), '3: the stop shows the lit line');
await p.evaluate(() => document.getElementById('lamp-2').scrollIntoView({ behavior: 'instant' })); await p.waitForTimeout(300);
const w2 = await p.evaluate(() => [...document.querySelectorAll('#lamp-2 .panel p, #lamp-2 .panel h2, #lamp-2 .panel h3')].filter((e) => { const r = e.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight && !e.closest('.device') && !e.classList.contains('sr-only'); }).map((e) => e.innerText).join(' ').split(/\s+/).filter(Boolean).length);
log(w2 <= 60, '3: lamp 2 stop: about 45 words visible without scrolling, 60 allowed because it carries the terrace entry line (outside the interaction)', w2 + ' words');
// lamps 3..5 and the auto beat
for (const n of [3, 4, 5]) { await p.evaluate((n) => document.getElementById('lamp-' + n).scrollIntoView({ behavior: 'instant' }), n); await p.waitForTimeout(400); await p.locator('#lamp-' + n).getByRole('button', { name: new RegExp('Lamp ' + n + ' ko chhuiye') }).click(); await p.waitForTimeout(1500); }
log(await p.locator('.lamp-btn.lit').count() === 5 && await p.locator('#lamp-5 .auto-beat.on').count() === 1, '3: lamps 3 to 5 light from their stops and the auto beat plays after lamp 5');
log((await p.locator('#lamp-5 .auto-beat').innerText()).includes('Kisi ki roshni kam nahi hui'), '3: the auto-beat text is the new line');
// each device works on its stop
await p.evaluate(() => document.getElementById('lamp-3').scrollIntoView({ behavior: 'instant' })); await p.getByRole('button', { name: 'Tap 3.1×' }).click(); await p.waitForTimeout(1200);
log((await p.locator('#lamp-3 .device').innerText()).includes('1,850') && (await p.locator('#lamp-3').innerText()).includes('Chamak nahi, sach.'), '3: lamp 3: Tap 3.1× settles to the true number');
await p.evaluate(() => document.getElementById('lamp-2').scrollIntoView({ behavior: 'instant' })); await p.locator('#lamp-2 .late input[type=range]').evaluate((e) => { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(e, '11'); e.dispatchEvent(new Event('input', { bubbles: true })); }); await p.waitForTimeout(600);
log((await p.locator('#lamp-2 .caption').innerText()).includes('Lau jalti rahi'), '3: lamp 2 flame caption, original logic past the deadline'); await p.getByRole('button', { name: 'Corrected logic' }).click(); await p.waitForTimeout(300);
log((await p.locator('#lamp-2 .caption').innerText()).includes('Lau dheemi hui'), '3: lamp 2 flame caption, corrected logic');
// menu
await p.getByRole('button', { name: 'Menu' }).click(); const menu = await p.locator('#menu').innerText();
log(['Poora text padhiye', 'The 60-second file', 'Evidence drawer', 'Sab diye ek saath jalaiye', 'Aakhri diya', 'Deepavali', 'Ink'].every((t) => menu.includes(t)), 'Menu holds full text, 60-second file, evidence, light all, last lamp and Look', menu.replace(/\n/g, ' | '));
await p.keyboard.press('Escape');
// voice opens on Take 2, other take switches
await p.evaluate(() => document.getElementById('voice').scrollIntoView({ behavior: 'instant' })); await p.waitForTimeout(400);
log((await p.locator('#voice .take:visible').first().innerText()).includes('Take 2'), 'voice opens on Take 2'); await p.getByRole('button', { name: 'Doosra take' }).click(); log((await p.locator('#voice .take:visible').first().innerText()).includes('Take 1'), 'Doosra take shows Take 1');
// 60 second file
await p.evaluate(() => scrollTo({ top: 0, behavior: 'instant' })); await p.locator('.sixty-link a').click(); await p.waitForTimeout(400);
const six = await p.locator('#sixty').innerText();
log(six.includes('Namaste.') && six.includes('after the helper leaves the room') && six.includes('Take the whole walk') && !six.includes('Hinglish-first'), '60-second file: new copy and the third button');
await p.getByRole('button', { name: 'Take the whole walk' }).click(); await p.waitForTimeout(900); log(!(await p.evaluate(() => document.getElementById('sixty').open)), 'Take the whole walk closes the dialog');
// wish and verdict collapses
const wt = await p.evaluate(() => document.getElementById('wish').innerText); log(wt.includes('Mere paanch diye jal gaye') && await p.locator('#wish details.ideas').count() === 1 && await p.locator('#wish .privacy details').count() === 1, 'wish: two short lines, ideas and privacy collapsed');
log(!(await p.evaluate(() => document.getElementById('verdict').innerText)).includes('Koi ek claim chuniye'), 'verdict is shortened');
log(p.cons.length === 0, 'console clean', p.cons.join('|').slice(0, 200));
await b.close(); srv.close();
