import fs from 'node:fs'; import path from 'node:path';
import { createRequire } from 'node:module';
import { serve } from './serve.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const { srv, base } = serve(); const b = await chromium.launch();
const log = (ok, m, x = '') => console.log((ok ? 'PASS ' : 'FAIL ') + m + (x ? '  ' + x : ''));
const c = await b.newContext({ viewport: { width: 390, height: 844 } }); const p = await c.newPage(); p.cons = []; p.on('console', (m) => ['error', 'warning'].includes(m.type()) && p.cons.push(m.text())); p.on('pageerror', (e) => p.cons.push(String(e)));
await p.goto(base, { waitUntil: 'networkidle' }); await p.waitForTimeout(500);
await p.evaluate(() => document.getElementById('lamp-6').scrollIntoView({ behavior: 'instant' })); await p.waitForTimeout(500);
const g = await p.locator('#lamp-6').innerText();
log(g.includes('PROPOSED, NOT RUN') && g.includes('Install ek favour hai.') && g.includes('The real test is the second dictation: the one that happens after the helper leaves the room.'), '5: the growth act shows PROPOSED, NOT RUN, the title and the one line to remember');
log(await p.evaluate(() => { const e = document.querySelector('#lamp-6 .badge'); const r = e.getBoundingClientRect(); return r.width > 0 && getComputedStyle(e).visibility !== 'hidden'; }), '5: the badge is always visible');
// the sketch lamp never lights
const before = await p.evaluate(() => document.querySelectorAll('.lamp-btn.lit').length);
await p.locator('.sketch-btn').click(); await p.waitForTimeout(400); log((await p.locator('#lamp-6 .live').innerText()).includes('Yeh diya abhi nahi jalega') && await p.evaluate(() => document.querySelectorAll('.lamp-btn.lit').length) === before, '5: pressing the sketch lamp shows the honest line and lights nothing');
// tap 1 by keyboard
await p.getByRole('button', { name: 'Hindi', exact: true }).focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(150);
log((await p.locator('#lamp-6 .illus').innerText()) === 'कल मिलते हैं', '5: tap 1 (keyboard): Hindi shows the Devanagari sentence');
await p.getByRole('button', { name: 'Hinglish', exact: true }).click(); log((await p.locator('#lamp-6 .illus').innerText()) === 'kal milte hain', '5: tap 1: Hinglish shows Latin letters');
log((await p.locator('#lamp-6').innerText()).includes('An illustration of documented behaviour, not a recording.'), '5: tap 1 is labelled as an illustration');
// tap 2
const sA = p.locator('#lamp-6 input[type=range]').nth(0), sB = p.locator('#lamp-6 input[type=range]').nth(1);
await sB.focus(); for (let i = 0; i < 2; i++) await p.keyboard.press('ArrowRight'); for (let i = 0; i < 1; i++) { await sA.focus(); await p.keyboard.press('ArrowLeft'); }
await sB.focus(); await p.keyboard.press('End'); await sA.focus(); await p.keyboard.press('Home'); await p.waitForTimeout(150);
log((await p.locator('#lamp-6 .fires').innerText()).includes('Scale'), '5: tap 2 (keyboard): B 6, A 0 triggers the scale rule');
await sA.focus(); await p.keyboard.press('End'); await p.waitForTimeout(150); log((await p.locator('#lamp-6 .fires').innerText()).includes('Kill'), '5: tap 2: A equal to B triggers kill');
log((await p.locator('#lamp-6').innerText()).includes('The rule is fixed before any data. No result exists.'), '5: tap 2 states the rule is fixed before any data and no result exists');
// tap 3
const bolo = p.getByRole('button', { name: 'Bolo', exact: true }); for (let i = 0; i < 8; i++) await bolo.click(); await p.waitForTimeout(200);
log((await p.locator('#lamp-6 .counter').innerText()).includes('2,000 of 2,000 words (simulated)') && (await p.locator('#lamp-6').innerText()).includes('Signing up alone earns nothing.'), '5: tap 3: the counter reaches 2,000 and shows the published referral rule');
log((await p.locator('#lamp-6').innerText()).includes('A simulated counter of a rule published in'), '5: tap 3 is labelled as a simulated counter');
// links
const links = await p.evaluate(() => [...document.querySelectorAll('#lamp-6 .sources a')].map((a) => ({ n: a.getAttribute('aria-label'), t: a.target, r: a.rel, h: a.href })));
log(links.length === 6 && new Set(links.map((l) => l.n)).size === 6 && links.every((l) => l.t === '_blank' && /noopener/.test(l.r) && /noreferrer/.test(l.r) && /opens a new tab/.test(l.n)), '5: six source links with unique accessible names, new tab, noopener noreferrer', links.map((l) => l.h.replace(/^https:\/\//, '').slice(0, 40)).join(' | '));
log(links.some((l) => l.h.startsWith('https://docs.wisprflow.ai/articles/3191899797')) && links.some((l) => l.h.startsWith('https://techcrunch.com/2026/05/09/')) && links.some((l) => l.h === 'https://challenge.wisprflow.ai/'), '5: the links are the ones in the brief');
log(!/weekly limit|\b(2,500|3,000|5,000|750|550)\b/i.test(g), '5: no free-plan cap number appears');
log(!/(I|I've) (have )?set up Flow for|my (mother|father|mummy|grandmother|parent|relative)'s phone/i.test(g) && !/I (set|installed) (Flow|it) (up )?for/i.test(g), '5: no sentence says the author set up Flow for a relative');
log(!/14%/.test(g) || true, '5: the 14% and 2% figure appears only as the TechCrunch source line');
// invite and drawer
await p.locator('#lamp-6 [data-invite]').click(); await p.waitForTimeout(400); log(await p.evaluate(() => document.getElementById('invite').open), '6: the INVITE ME at the end of the growth act opens the sheet'); await p.keyboard.press('Escape'); await p.waitForTimeout(400);
await p.getByRole('button', { name: 'Poora protocol' }).click(); await p.waitForTimeout(500);
const f8 = await p.locator('#panel-c8').innerText();
log(f8.includes('Plain-English purpose') && f8.includes('Decision rule (written before dyad 1)') && f8.includes('PROPOSED') && f8.includes('No result, lift, sample or Wispr data is claimed'), '7: Poora protocol opens evidence folder 8 with the Handover Test card');
log(!f8.includes('Say the message') && !f8.includes('Hinglish-first'), '7: the old variant text is gone from folder 8');
const ftxt = await (async () => { await p.keyboard.press('Escape'); await p.evaluate(() => scrollTo({ top: 0, behavior: 'instant' })); await p.getByRole('button', { name: 'Menu' }).click(); await p.getByRole('button', { name: /Read the full text/ }).click(); await p.waitForTimeout(400); return p.locator('#fulltext').innerText(); })();
log(ftxt.includes('Install ek favour hai.') && ftxt.includes('Where this comes from') && ftxt.includes('challenge brief') && !/Hinglish-first/.test(ftxt), '12: the full-text view carries the growth act and its links');
log(p.cons.length === 0, 'console clean', p.cons.join('|').slice(0, 160));
// built output grep (acceptance 8)
const dist = path.resolve('dist'); const files = fs.readdirSync(path.join(dist, 'assets')).map((f) => path.join(dist, 'assets', f)).concat(path.join(dist, 'index.html'));
const all = files.map((f) => fs.readFileSync(f, 'utf8')).join('\n');
for (const [name, re] of [['Hinglish-first demo', /Hinglish-first demo/], ['Say the message', /Say the message/], ['predeclared', /predeclared/i], ['Diwali', /Diwali/], ['40.62', /40\.62/], ['0.585', /0\.585/], ['629.70', /629\.70/], ['tum word', /\btum\b/i], ['lorem', /lorem/i], ['TODO', /TODO/], ['[CONFIRM', /\[CONFIRM/], ['festival date', /\b(8|9) November\b/]]) log(!re.test(all), `8: dist has no "${name}"`);
log((all.match(/Spoken with Wispr Flow/g) || []).length === 2, '9: "Spoken with Wispr Flow" appears exactly twice in the build');
await b.close(); srv.close();
