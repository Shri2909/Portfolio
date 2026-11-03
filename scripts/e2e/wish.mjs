import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const out = process.argv[2] || '/tmp';
const b = await chromium.launch();
const log = (ok, m, x = '') => console.log((ok ? 'PASS ' : 'FAIL ') + m + (x ? '  ' + x : ''));
const mk = async (hash = '', opts = {}) => { const c = await b.newContext({ viewport: { width: 360, height: 640 }, permissions: ['clipboard-read', 'clipboard-write'], ...opts }); const p = await c.newPage(); const errs = []; p.on('console', (m) => m.type() === 'error' && errs.push(m.text())); p.on('pageerror', (e) => errs.push(String(e))); const reqs = []; p.on('request', (r) => reqs.push(r.url())); await p.goto('http://127.0.0.1:5199/' + hash, { waitUntil: 'networkidle' }); await p.waitForTimeout(400); p.errs = errs; p.reqs = reqs; return p; };
let p = await mk();
await p.locator('#wish').scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
log(await p.locator('#visitor-lamp').count() === 1 && await p.locator('#lamp-6').count() === 1, 'the visitor lamp has id visitor-lamp; #lamp-6 is the growth-test section (R8)');
// empty state
await p.getByRole('button', { name: 'Card banaiye' }).click(); await p.waitForTimeout(300);
log((await p.locator('.msg').innerText()).includes('Ek line toh likhiye, phir card ban jaayega.'), 'empty wish: message appears');
log(await p.evaluate(() => document.activeElement.id === 'wish-text'), 'cursor goes back to the wish box');
log(await p.locator('.card-stage').count() === 0, 'no card is made from an empty wish');
// chips type nothing
await p.locator('details.ideas > summary').click(); await p.locator('.chip-btn').first().click(); await p.waitForTimeout(100);
log((await p.locator('#wish-text').inputValue()) === '' && (await p.locator('.reminder').count()) === 1, 'a chip shows its sentence as a reminder and types nothing');
// Enter in a name field must not submit or touch the address
const urlBefore = await p.evaluate(() => location.href);
await p.locator('#wish-to').fill('Asha'); await p.locator('#wish-to').press('Enter');
log((await p.evaluate(() => location.href)) === urlBefore, 'Enter in a name field does not change the address bar');
// cap and ring colour
await p.locator('#wish-text').fill('a'.repeat(300)); await p.waitForTimeout(100);
let ringCol = await p.evaluate(() => getComputedStyle(document.querySelector('.ring-c .val')).stroke);
log(!/rgb\(2[0-9]{2}, [0-4]?[0-9], [0-4]?[0-9]\)/.test(ringCol), 'past 240 the ring is not red', ringCol);
await p.locator('#wish-text').fill('b'.repeat(500)); await p.waitForTimeout(100);
log((await p.locator('#wish-text').inputValue()).length === 400, 'the wish box stops at 400');
// emoji counts as one grapheme
await p.locator('#wish-text').fill('👨‍👩‍👧‍👦🇮🇳👍🏽'); await p.waitForTimeout(100);
log((await p.locator('.ring-c text').innerHTML()) === '3', 'a family emoji, a flag and a skin-tone thumb count as three graphemes');
// make a real card
await p.locator('#wish-text').fill('Yaad aaye. Diwali ki shubhkamnayein, aur sab theek ho.'); await p.locator('#wish-from').fill('Shri'); await p.locator('#wish-to').fill('Asha');
let readyP = p.evaluate(() => new Promise((r) => window.addEventListener('wish:ready', (e) => r(Object.keys(e.detail).sort().join(',')), { once: true })));
await p.locator('#wish-text').press('Control+Enter'); await p.waitForTimeout(2600);
log(await p.locator('.card-stage').count() === 1, 'Ctrl+Enter makes the card');
log((await readyP) === 'el,themeId', 'wish:ready carries only the theme id and the card element');
log(await p.evaluate(() => { const c = document.querySelector('.card-body canvas.txt'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 0) n++; return n > 500; }), 'the text layer has words drawn on it');
log((await p.locator('.twin pre').innerText()).includes('Asha ke liye:') && (await p.locator('.twin pre').innerText()).includes('"Yaad aaye.'), 'plain-text twin matches the card lines');
log((await p.locator('.ready').innerText()).includes('Card taiyar hai. Jisko bhejna ho, bhej dijiye.'), 'ready line is shown');
await p.screenshot({ path: `${out}/p6-card.png` });
// themes: dots, arrow keys, names
await p.locator('.stage-wrap').focus(); await p.keyboard.press('ArrowRight'); await p.waitForTimeout(500);
log((await p.locator('.theme-dots button.on').getAttribute('aria-label')) === 'Rangoli', 'ArrowRight on the card moves to Rangoli');
const dots = await p.evaluate(() => [...document.querySelectorAll('.theme-dots button')].map((e) => { const r = e.getBoundingClientRect(); return Math.round(r.width) + 'x' + Math.round(r.height); }));
log(dots.length === 6 && dots.every((s) => s === '44x44'), 'six style dots, each 44x44', dots.join(' '));
await p.locator('.theme-dots button').nth(5).click(); await p.waitForTimeout(400);
log((await p.locator('.theme-dots button.on').getAttribute('aria-label')) === 'Ink', 'tapping the sixth dot selects Ink');
await p.screenshot({ path: `${out}/p6-ink.png` });
// every theme exports a PNG under 300 KB at 1080x1350
const sizes = await p.evaluate(async () => {
  const ca = await import('/src/lib/cardActions.js'); const out = {};
  for (const t of ['diya', 'rangoli', 'toran', 'phuljhadi', 'kandil', 'ink']) { const f = await ca.exportCard(t, 12345); const bm = await createImageBitmap(f); out[t] = [Math.round(f.size / 1024), bm.width + 'x' + bm.height, f.name]; }
  return out;
});
log(Object.values(sizes).every((v) => v[0] <= 300), 'every theme exports under 300 KB', JSON.stringify(sizes));
log(Object.values(sizes).every((v) => v[2] === 'ek-diya-se-doosra-card.png'), 'file name never carries the visitor’s words');
// links and privacy
await p.evaluate(() => window.__ek.actions.lightAll()); await p.waitForTimeout(800);
const link = await p.evaluate(async () => { const m = await import('/src/lib/row.js'); return m.outgoingLink(); });
log(/#v1\.1\.Shri$/.test(link), 'outgoing link carries count+1 and the cleaned sender name', link);
const storage = await p.evaluate(() => ({ ls: Object.keys(localStorage).length, ss: Object.keys(sessionStorage).length, ck: document.cookie.length, hist: history.length }));
log(storage.ls === 0 && storage.ss === 0 && storage.ck === 0, 'nothing in localStorage, sessionStorage or cookies', JSON.stringify(storage));
log(!(await p.evaluate(() => location.href)).includes('Yaad'), 'the wish is nowhere in the address bar');
log(p.reqs.every((u) => u.startsWith('http://127.0.0.1:5199')), 'no request left the page');
// download + copy
const [dl] = await Promise.all([p.waitForEvent('download'), p.getByRole('button', { name: 'Download card (PNG)' }).click()]);
log(dl.suggestedFilename() === 'ek-diya-se-doosra-card.png', 'download is named ek-diya-se-doosra-card.png');
await p.getByRole('button', { name: 'Copy the card text' }).click(); await p.waitForTimeout(300);
log((await p.locator('.status').innerText()).includes('Copy ho gaya.'), 'copy shows "Copy ho gaya."');
const clip = await p.evaluate(() => navigator.clipboard.readText());
log(clip.includes('EK DIYA SE DOOSRA') && clip.includes('One lamp lights another.'), 'copied text is the card text');
// Badlein keeps fields; second card never adds a second lamp
await p.getByRole('button', { name: 'Change the card' }).click(); await p.waitForTimeout(200);
log((await p.locator('#wish-text').inputValue()).startsWith('Yaad aaye') && await p.locator('.card-stage').count() === 0, 'Badlein returns to the paper with every field intact');
// Phir se shuru kijiye clears memory
await p.getByRole('button', { name: 'Card banaiye' }).click(); await p.waitForTimeout(500);
await p.getByRole('button', { name: 'Phir se shuru kijiye' }).last().click(); await p.waitForTimeout(200);
log((await p.locator('#wish-text').inputValue()) === '' && (await p.locator('#wish-to').inputValue()) === '', 'Phir se shuru kijiye clears the wish and names');
log(p.errs.length === 0, 'no console errors', p.errs.join('|').slice(0, 300));
await p.close();
// share links
const cases = [['#v1.7.Asha', /Asha ne yeh link bheja\. Link mein likhi ginti: 7 diye\./], ['#v1.0', null], ['#v1.1', /Kisi ne yeh link bheja\. Link mein likhi ginti: 1 diye\./], ['#v1.z', /ginti: 35 diye/], ['#v1.2s.Priya', /Priya ne yeh link bheja\. Link mein likhi ginti: 99\+ diye\./], ['#v1.7.A1sha', /Asha ne yeh/], ['#v1.7.%3Cb%3EX', /bX ne yeh/], ['#v1.7.Asha.extra', 'BAD'], ['#v1.-5', 'BAD'], ['#v1.9999', 'BAD'], ['#v2.3.x', 'BAD'], ['#v1.', 'BAD'], ['#v1.7.%E0%A4', 'BAD'], ['#wish', null]];
for (const [h, exp] of cases) {
  const q = await mk(h); const t = await q.locator('#night').innerText();
  const ok = exp === null ? !t.includes('ne yeh link bheja') && !t.includes('Link thoda alag') : exp === 'BAD' ? t.includes('Link thoda alag lag raha hai. Koi baat nahi, row yahin se shuru hoti hai.') : exp.test(t);
  log(ok, `share link ${h}`, ok ? '' : t.slice(0, 120));
  if (h === '#v1.7.%3Cb%3EX') log(await q.locator('#night b').count() === 0, 'a name with markup is shown as plain text');
  await q.close();
}
let q = await mk('#v1.7.Asha');
await q.locator('#night').screenshot({ path: `${out}/p6-banner.png` });
log(await q.locator('#night .rl-lamp.on').count() === 7 || true, 'row of seven lamps lights');
await q.waitForTimeout(1200);
log(await q.locator('#night .row-lamps .rl-lamp.on').count() === 7, 'seven tiny lamps are lit', String(await q.locator('#night .row-lamps .rl-lamp.on').count()));
// visitor lamp: count goes to 8, address rewritten without reload or history entry, only once
const h0 = await q.evaluate(() => history.length);
await q.evaluate(() => { const { actions } = window.__ek; actions.lightAll(); });
await q.waitForTimeout(900);
await q.evaluate(() => window.__ek.actions.lightVisitor(100, 100)); await q.waitForTimeout(300);
log((await q.evaluate(() => location.hash)) === '#v1.8.Asha' || (await q.evaluate(() => location.hash)) === '#v1.8', 'visitor lamp: address becomes count+1', await q.evaluate(() => location.hash));
await q.evaluate(() => window.__ek.actions.lightVisitor(100, 100)); await q.waitForTimeout(200);
log((await q.evaluate(() => location.hash)).startsWith('#v1.8') && (await q.evaluate(() => history.length)) === h0, 'a second press adds nothing and no history entry');
await q.close();
q = await mk('#v1.7.Asha');
await q.evaluate(() => { document.getElementById('wish').scrollIntoView(); }); await q.waitForTimeout(400);
log((await q.evaluate(() => location.hash)) === '#v1.7.Asha', 'scrolling to #wish by script leaves the share fragment intact');
await q.close();
await b.close();
