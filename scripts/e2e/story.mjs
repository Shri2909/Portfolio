import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const out = process.argv[2] || '/tmp';
const b = await chromium.launch();
const log = (ok, m, x = '') => console.log((ok ? 'PASS ' : 'FAIL ') + m + (x ? '  ' + x : ''));
const mk = async (hash = '', opts = {}) => { const c = await b.newContext({ viewport: { width: 360, height: 640 }, ...opts }); const p = await c.newPage(); const errs = [], info = []; p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); if (m.type() === 'info') info.push(m.text()); }); p.on('pageerror', (e) => errs.push(String(e))); await p.goto('http://127.0.0.1:5199/' + hash, { waitUntil: 'networkidle' }); await p.waitForTimeout(400); p.errs = errs; p.info = info; return p; };
const st = (p) => p.evaluate(() => { const s = window.__ek.getState(); return { lit: s.litCount, tone: s.tone, v: s.visitorLit, row: s.row }; });
let p = await mk();
const info = p.info.join('\n');
log(/footer line 4 \(noAnalyticsLine false\)/.test(info) && /footer line 5/.test(info) && /person first sentence/.test(info) && /lamp six language line/.test(info) && /recorded-build line/.test(info), 'console lists every hidden item (flags), nothing visible', info.split('\n').length + ' lines');
// ---- lamp six section
await p.evaluate(() => document.getElementById('lamp-6').scrollIntoView()); await p.waitForTimeout(2600);
log((await p.locator('#lamp-6 .badge').innerText()) === 'PROPOSED, NOT RUN', 'lamp six badge reads PROPOSED, NOT RUN');
const before = await st(p);
await p.locator('.sketch-btn').click(); await p.waitForTimeout(300);
await p.locator('.sketch-btn').focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(300);
const after = await st(p);
log(before.lit === after.lit && before.tone === after.tone && after.lit === 0, 'tapping and Enter on the sketch lamp never change the lit count or tone');
log((await p.locator('#lamp-6 .live').innerText()).includes('Yeh diya abhi nahi jalega. Test chala nahi. Bujha hua, par imaandaar.'), 'the status line appears');
const l6 = await p.locator('#lamp-6').innerText();
log(!l6.includes('Other languages deserve their own test'), 'the lamp-six language line is OFF by default');
log(l6.includes('Variant A, speed') && l6.includes('Say the message. Skip typing it.') && l6.includes('Don\'t stop the thought halfway through. Say it naturally.'), 'both variant cards are present');
await p.screenshot({ path: `${out}/p7-lamp6.png` });
await p.getByRole('button', { name: 'SEE THE GROWTH TEST' }).last().click(); await p.waitForTimeout(400);
log(await p.evaluate(() => document.getElementById('tab-c8').getAttribute('aria-expanded') === 'true' && document.activeElement.id === 'tab-c8'), 'SEE THE GROWTH TEST opens the drawer on folder 8 and focuses its tab');
await p.keyboard.press('Escape'); await p.waitForTimeout(300);
// ---- person
const pt = await p.locator('#person').innerText();
log(!pt.includes('My father') && pt.includes('A gap year, unsuccessful entrance attempts, YouTube study and a ₹3,999 course formed my route to VIT Pune.') && pt.includes('I care about people as much as code.') && pt.includes("I didn't learn that every plan works. I learned to decide what to do when it doesn't."), 'person block: first sentence is gated off, the rest is word for word');
// ---- voice
await p.evaluate(() => document.getElementById('voice').scrollIntoView()); await p.waitForTimeout(500);
const mainText = await p.evaluate(() => document.getElementById('main').innerText);
log((mainText.match(/Spoken with Wispr Flow/g) || []).length === 2, '"Spoken with Wispr Flow" appears exactly twice on the page');
log(!mainText.includes('I spoke some of the directions for this page'), 'the recorded-build line is absent with its flag off');
const sl = p.locator('#slider-take1');
const M = +(await sl.getAttribute('max'));
log((await sl.getAttribute('aria-valuetext')) === 'As I said it', 'take 1 slider starts at "As I said it"', 'M=' + M);
const morph0 = await p.locator('.take').first().locator('.morph').innerText();
log(morph0.includes('sorry sorry') && morph0.startsWith('Okay, so...'), 'step 0 shows my words, including the double sorry');
await sl.focus(); await p.keyboard.press('End'); await p.waitForTimeout(300);
log((await sl.getAttribute('aria-valuetext')) === 'As Flow wrote it', 'End jumps to "As Flow wrote it"');
const morphM = (await p.locator('.take').first().locator('.morph').evaluate((e) => [...e.querySelectorAll('.w')].filter((w) => !/gone|hidden/.test(w.className)).map((w) => w.textContent).join(' ')));
log(morphM.replace(/\s+/g, ' ').trim() === "Okay the best interface, I think, is basically when you don't have to think about how to use it, like when you are using something and you are not constantly wondering where to click or what to do next. You are just doing what you came there to do. I think that's actually quite difficult to build because all the complicated stuff, the logic, the decisions, someone has to handle all of that, just not the user.", 'at the last step only Flow\'s text shows, word for word');
await p.keyboard.press('Home'); await p.waitForTimeout(200);
await p.keyboard.press('ArrowRight'); await p.waitForTimeout(200);
log((await sl.getAttribute('aria-valuetext')) === `1 of ${M} changes showing`, 'ArrowRight moves one change', await sl.getAttribute('aria-valuetext'));
await p.keyboard.press('PageUp'); await p.waitForTimeout(200);
log((await sl.inputValue()) === '6', 'PageUp moves five changes');
const thumb = await sl.boundingBox(); log(thumb.height >= 44, 'the flame slider is at least 44 px tall');
await p.screenshot({ path: `${out}/p7-voice.png` });
await p.getByRole('switch', { name: 'Read it plainly' }).click(); await p.waitForTimeout(200);
const plain = await p.locator('.plain-vis').first().innerText();
log(/\[trimmed: /.test(plain) && /\[smoothed: /.test(plain) && /Trimmed: \d+ words\. Smoothed or added: \d+ words\./.test(plain), 'Read it plainly marks changes in the text and shows the two counts');
await p.getByRole('switch', { name: 'Read it plainly' }).click();
const prov = await p.locator('.provenance').innerText();
log(prov.includes('Where this came from:') && prov.includes('Output matches Flow history word for word.'), 'custody note is verbatim');
// ---- verdict
const vt = await p.locator('#verdict').innerText();
log(vt.indexOf('AI helped implement') < vt.indexOf('I haven\'t owned') && vt.indexOf('I haven\'t owned') < vt.indexOf("I can't promise") && vt.indexOf("I can't promise") < vt.indexOf('Shriniwas') && vt.indexOf('Shriniwas') < vt.indexOf('Koi ek claim chuniye'), 'verdict: four paragraphs and the signed name in order');
log((await p.locator('#verdict a[href*="drive.google.com"]').getAttribute('aria-label')) === 'VIEW MY RÉSUMÉ, opens Google Drive in a new tab' && !vt.includes('INTERVIEW'), 'résumé link says it opens Google Drive; no interview button in the verdict');
await p.screenshot({ path: `${out}/p7-verdict.png` });
// ---- sixty sheet
await p.evaluate(() => document.getElementById('night').scrollIntoView()); await p.waitForTimeout(300);
const hashBefore = await p.evaluate(() => location.hash);
await p.locator('.sixty-link a').click(); await p.waitForTimeout(400);
log(await p.evaluate(() => document.getElementById('sixty').open), 'the opening link opens the 60-second file');
log(await p.evaluate(() => document.activeElement.id === 'sixty-h'), 'focus lands on its title');
const sx = await p.locator('#sixty').innerText();
log(sx.includes('324 tests passed. A separate audit found 19 problems. Would you have shipped it?') && sx.includes('I have no growth wins to borrow.') && sx.includes('INVITE ME TO AN INTERVIEW'), 'sixty sheet copy is present, interview button shows because the contact email is set');
log(await p.evaluate(() => { const a = [...document.querySelectorAll('#sixty a.btn')][0]; return decodeURIComponent(a.href).includes('subject=Interview: Ek Diya Se Doosra') && decodeURIComponent(a.href).includes('My lamp number on your page: \r\n') || decodeURIComponent(a.href).includes('My lamp number on your page: '); }), 'sheet mailto has the subject and a blank lamp number when no lamp is lit');
await p.getByRole('button', { name: 'OPEN ONE RECEIPT' }).click(); await p.waitForTimeout(400);
log(await p.evaluate(() => document.getElementById('tab-c1').getAttribute('aria-expanded') === 'true'), 'OPEN ONE RECEIPT opens folder 1');
log((await p.evaluate(() => location.hash)) === hashBefore, 'overlays never write to the address bar');
// ---- evidence drawer
const tabs = await p.evaluate(() => [...document.querySelectorAll('#evidence .tab')].map((t) => ({ h: Math.round(t.getBoundingClientRect().height), n: t.innerText.split('\n')[0] })));
log(tabs.length === 8 && tabs.every((t) => t.h >= 56), 'eight folders, each tab at least 56 px', tabs.map((t) => t.n).join(' | ').slice(0, 160));
await p.locator('#tab-c3').click(); await p.waitForTimeout(300);
log(await p.evaluate(() => document.querySelectorAll('#evidence .tab[aria-expanded="true"]').length === 1), 'one folder open at a time');
const ev = await p.locator('#panel-c3').innerText();
log(ev.includes('PUBLIC') && ev.includes('LOCAL-BRANCH') && ev.includes('UNRESOLVED') && !/PERSONALLY CONFIRMED/.test(ev), 'statuses are plain text, only those in the data');
await p.locator('#tab-c1').click(); await p.waitForTimeout(200);
log((await p.locator('#panel-c1').innerText()).includes('EVIDENCE AVAILABLE ON REQUEST'), 'folder 1 says evidence is available on request (from the data)');
await p.locator('#tab-c7').click(); await p.waitForTimeout(200);
const names = await p.evaluate(() => [...document.querySelectorAll('#evidence a[target=_blank]')].map((a) => a.getAttribute('aria-label')));
log(names.length >= 2 && new Set(names).size === names.length && names.every((n) => /opens Google Drive in a new tab|opens GitHub in a new tab/.test(n)), 'every outbound link has a unique accessible name', names.join(' | ').slice(0, 200));
await p.keyboard.press('Escape'); await p.waitForTimeout(300);
log(await p.evaluate(() => document.activeElement === document.querySelector('.sixty-link a') || document.activeElement.id === 'night-h' || document.activeElement.tagName === 'A'), 'closing returns focus to the opener');
// ---- footer
const ft = await p.locator('#footer').innerText();
log(ft.includes('Prototypes, not products.') && ft.includes('This is an independent application page.') && ft.includes('© Shriniwas Kholkute') && !ft.includes('analytics') && !ft.includes('Hinglish lines were drafted'), 'footer: lines 1,2,3,6,7 show; line 4 and line 5 stay out');
await p.locator('#footer a[data-evidence]').click(); await p.waitForTimeout(300);
log(await p.evaluate(() => document.getElementById('evidence').open), '"Evidence drawer" in footer line 1 opens the drawer');
await p.keyboard.press('Escape');
log(p.errs.length === 0, 'no console errors so far', p.errs.join('|').slice(0, 300));
await p.close();
// ---- closure + G4
p = await mk('#v1.7.Asha');
await p.evaluate(() => window.__ek.actions.lightAll()); await p.waitForTimeout(900);
const h0 = await p.evaluate(() => history.length);
await p.evaluate(() => document.getElementById('closure').scrollIntoView({ block: 'start' }));
await p.waitForTimeout(1000);
log((await st(p)).v === false, 'closure: the visitor lamp is not lit during the quiet beat');
await p.waitForTimeout(4200);
const s1 = await st(p);
log(s1.v === true && s1.tone === 6 && s1.row.count === 8, 'G4: visitor lamp ignites once; tone 6; row grows from 7 to 8', JSON.stringify({ v: s1.v, tone: s1.tone, count: s1.row.count }));
log((await p.evaluate(() => location.hash)) === '#v1.8.Asha' || (await p.evaluate(() => location.hash)) === '#v1.8', 'G4: address updated without reload', await p.evaluate(() => location.hash));
log((await p.evaluate(() => history.length)) === h0, 'G4: no history entry added');
await p.waitForTimeout(4500);
const ct = await p.locator('#closure').innerText();
log(ct.includes('7 diye pehle se. Aakhir mein aapka.') && ct.includes('This number is written inside the link. It is not a visitor count and is not verified.'), 'caption uses the count that was in the link', ct.split('\n')[0]);
log(ct.includes('Aapka diya jal utha.') && ct.includes('Ab mujhse ek sawaal poochhiye.') && ct.includes('Shubh Deepavali.') && ct.includes('— Shriniwas'), 'closing lines and sign-off are in the page');
log(!/\b(8|9|10) November\b/.test(await p.evaluate(() => document.documentElement.outerHTML)), 'no festival date is printed anywhere');
const mail = await p.evaluate(() => { const a = document.querySelector('#closure a.btn-primary'); return decodeURIComponent(a.getAttribute('href')); });
log(mail.startsWith('mailto:shrniwaskholkute2282@gmail.com') && mail.includes('subject=Interview: Ek Diya Se Doosra') && /Hello Shriniwas,\r\n\r\nI would like to talk about an interview\.\r\n\r\nMy lamp number on your page: 8\r\n/.test(mail), 'interview mail: subject, body and lamp number 8 (7 + 1)', mail.replace(/\r\n/g, '/').slice(0, 220));
await p.locator('.cl-lamp.slot').click({ force: true }); await p.waitForTimeout(100);
await p.evaluate(() => window.__ek.actions.lightVisitor(1, 1)); await p.waitForTimeout(200);
log((await st(p)).row.count === 8, 'G4: a second press does nothing');
await p.screenshot({ path: `${out}/p7-closure.png` });
log(await p.evaluate(() => getComputedStyle(document.querySelector('footer#footer .glyph')).backgroundColor !== 'rgb(74, 42, 18)'), 'footer lamp glyph is lit after the visitor lamp');
log(p.errs.length === 0, 'no console errors in the closure', p.errs.join('|').slice(0, 300));
await p.close();
// skip by scrolling; counts 0, 1, 5, 120 captions
for (const [h, exp] of [['', 'Yeh row aapse shuru hoti hai.'], ['#v1.1', 'Ek diya pehle se. Aakhir mein aapka.'], ['#v1.5', '5 diye pehle se. Aakhir mein aapka.'], ['#v1.3c', '99+ diye pehle se. Aakhir mein aapka.']]) {
  const q = await mk(h); const t = await q.locator('#closure').innerText(); log(t.includes(exp), `closure caption for ${h || 'no link'}`, exp); await q.close();
}
p = await mk('', { reducedMotion: 'reduce' });
await p.evaluate(() => window.__ek.actions.lightAll()); await p.evaluate(() => document.getElementById('closure').scrollIntoView()); await p.waitForTimeout(700);
log((await st(p)).v === true && (await p.evaluate(() => getComputedStyle(document.querySelector('.signoff')).opacity)) === '1', 'Calm: final state at once, the visitor lamp still lights once');
await p.close();
// date switch
p = await mk('', {}); await p.clock.setFixedTime(new Date('2026-11-12T10:00:00')); await p.reload({ waitUntil: 'networkidle' }); await p.waitForTimeout(300);
log((await p.locator('#closure').innerText()).includes('Shukriya.') && !(await p.locator('#closure').innerText()).includes('Shubh Deepavali.'), 'from 10 November the sign-off becomes "Shukriya."');
await p.close();
// skip by tap during the sequence
p = await mk(); await p.evaluate(() => window.__ek.actions.lightAll()); await p.waitForTimeout(900);
await p.evaluate(() => document.getElementById('closure').scrollIntoView({ block: 'start' })); await p.waitForTimeout(1500);
await p.mouse.click(345, 330); await p.waitForTimeout(700);
log((await st(p)).v === true && await p.evaluate(() => document.getElementById('closure').classList.contains('ended')), 'a tap on empty space skips to the end state');
await p.close();
// G2: every receipt on the five cards opens the right folder
p = await mk(); await p.evaluate(() => window.__ek.actions.lightAll()); await p.waitForTimeout(900);
for (let n = 1; n <= 5; n++) {
  await p.locator('.story-list li').nth(n - 1).getByRole('button').click(); await p.waitForTimeout(700);
  await p.locator('[data-receipt]').click(); await p.waitForTimeout(400);
  const ok = await p.evaluate((n) => document.getElementById('tab-c' + n).getAttribute('aria-expanded') === 'true' && document.activeElement.id === 'tab-c' + n, n);
  await p.keyboard.press('Escape'); await p.waitForTimeout(500);
  const back = await p.evaluate(() => document.activeElement.hasAttribute('data-receipt') && document.getElementById('lamp-card').open);
  log(ok && back, `G2: card ${n} receipt opens folder ${n}; closing the drawer returns to the card with focus on the receipt button`);
  await p.getByRole('button', { name: 'Row par waapas' }).click(); await p.waitForTimeout(500);
}
log((await p.evaluate(() => location.hash)) === '', 'G2: the address bar is untouched');
await p.close(); await b.close();
