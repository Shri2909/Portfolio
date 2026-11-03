import { createRequire } from 'node:module';
import { serve } from './serve.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const { srv, base } = serve(); const origin = new URL(base).origin;
const b = await chromium.launch(); const log = (ok, m, x = '') => console.log((ok ? 'PASS ' : 'FAIL ') + m + (x ? '  ' + x : ''));
const mk = async (w = 390, h = 844, hash = '', o = {}) => { const c = await b.newContext({ viewport: { width: w, height: h }, permissions: ['clipboard-read', 'clipboard-write'], ...o }); const p = await c.newPage(); p.cons = []; p.reqs = []; p.on('console', (m) => ['error', 'warning'].includes(m.type()) && p.cons.push(m.text())); p.on('pageerror', (e) => p.cons.push(String(e))); p.on('request', (r) => p.reqs.push(r.url())); await p.goto(base + hash, { waitUntil: 'networkidle' }); await p.waitForTimeout(500); return p; };
const esc = (p) => p.keyboard.press('Escape').then(() => p.waitForTimeout(500));
const lightAll = async (p) => { await p.evaluate(() => document.getElementById('lamp-menu-all')?.click()); };
let p = await mk(390, 844, '#v1.5.Asha');
// entry points
log(await p.locator('#topbar [data-invite]').count() === 1, 'top bar has an INVITE ME button (not a link)');
await p.locator('#topbar [data-invite]').click(); await p.waitForTimeout(400);
log(await p.evaluate(() => document.getElementById('invite').open && document.activeElement.id === 'invite-h'), '1: sheet opens and focus lands on its title');
const tab = []; for (let i = 0; i < 12; i++) { await p.keyboard.press('Tab'); tab.push(await p.evaluate(() => document.activeElement === document.body || !!document.activeElement.closest('#invite'))); }
log(tab.every(Boolean), '1: Tab stays inside the dialog');
const hrefs = await p.evaluate(() => [...document.querySelectorAll('#invite a[href]')].map((a) => ({ h: a.href, t: a.target, r: a.rel })));
const g = hrefs.find((x) => x.h.startsWith('https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=shrniwaskholkute2282%40gmail.com&su=')), o = hrefs.find((x) => x.h.startsWith('https://outlook.live.com/mail/0/deeplink/compose?to=')), m = hrefs.find((x) => x.h.startsWith('mailto:shrniwaskholkute2282@gmail.com?subject='));
log(!!g && g.t === '_blank' && /noopener/.test(g.r) && !!o && o.t === '_blank' && !!m, '2: Gmail, Outlook and mailto links have the exact formats', hrefs.map((x) => x.h.length).join('/'));
log(await p.locator('#invite-addr').innerText() === 'shrniwaskholkute2282@gmail.com', '2: the address is visible text');
const pre = async () => { await p.evaluate(() => (document.querySelector('#invite details').open = true)); return p.locator('#invite .preview').innerText(); };
log(!/lamp number/.test(await pre()), '4: before the visitor lights a lamp the message has no lamp-number line');
await p.getByRole('button', { name: 'Copy address' }).click(); await p.waitForTimeout(200);
log((await p.locator('#invite [role=status]').innerText()) === 'Address copied' && (await p.evaluate(() => navigator.clipboard.readText())) === 'shrniwaskholkute2282@gmail.com', '3: Copy address confirms and the clipboard holds it');
await p.getByRole('button', { name: 'Copy message' }).click(); await p.waitForTimeout(200);
log((await p.evaluate(() => navigator.clipboard.readText())).includes('Interview invitation: Shriniwas Kholkute'), '3: Copy message puts the whole message on the clipboard');
await p.evaluate(() => { Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => Promise.reject(new Error('no')) }, configurable: true }); document.execCommand = () => false; });
await p.getByRole('button', { name: 'Copy address' }).click(); await p.waitForTimeout(300);
log((await p.locator('#invite [role=status]').innerText()).includes('press Ctrl+C'), '3: with both copy paths failing the select-and-press line shows');
await esc(p); log(await p.evaluate(() => !document.getElementById('invite').open && document.activeElement === document.querySelector('#topbar [data-invite]')), '1: Escape closes and focus returns to the opener');
log(p.reqs.every((u) => u.startsWith(origin) || u.startsWith('data:')), '5: no request left the origin with the sheet open');
// 60-second dialog, fulltext
await p.evaluate(() => document.querySelector('.sixty-link a').click()); await p.waitForTimeout(400);
await p.locator('#sixty [data-invite]').click(); await p.waitForTimeout(400); log(await p.evaluate(() => document.getElementById('invite').open), '1: the 60-second dialog also opens the sheet'); await esc(p);
await p.getByRole('button', { name: 'Menu' }).click(); await p.getByRole('button', { name: /Read the full text/ }).click(); await p.waitForTimeout(400);
const ft = await p.locator('#fulltext').innerText(); log(ft.includes('shrniwaskholkute2282@gmail.com') && ft.includes('Open Gmail') && ft.includes('Interview invitation'), '14: full-text view shows address, Gmail link, mail link and the message');
await p.locator('#fulltext-close').click();
// unlit closure
await p.evaluate(() => document.getElementById('closure').scrollIntoView({ behavior: 'instant' })); await p.waitForTimeout(600);
const inv = await p.evaluate(() => { const els = [...document.querySelectorAll('#closure a, #closure button, #closure [tabindex]')]; return els.filter((e) => { const cs = getComputedStyle(e); let q = e, hidden = false; while (q && q !== document.body) { const c = getComputedStyle(q); if (c.visibility === 'hidden' || c.display === 'none') hidden = true; q = q.parentElement; } return !hidden && parseFloat(getComputedStyle(e.closest('.cl-fade') || e).opacity) < 0.05; }).length; });
log(inv === 0, '6: unlit closure has no invisible-but-focusable element', String(inv));
// lamp number after visitor lamp
await p.evaluate(() => document.getElementById('night').scrollIntoView({ behavior: 'instant' }));
for (let n = 0; n < 5; n++) { await p.locator('.lamp-btn').nth(n).focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(n === 0 ? 2300 : 900); if (n === 0) await esc(p); }
await p.waitForTimeout(3000); await p.evaluate(() => document.getElementById('closure').scrollIntoView({ behavior: 'instant' })); await p.waitForTimeout(8500);
await p.locator('#closure [data-invite]').click(); await p.waitForTimeout(400);
log(/lamp number on your page: 6/.test(await pre()) && !/page: 7/.test(await pre()), '4: after the visitor lamp the message says 6 (count 5 + 1), never 7');
await esc(p); await p.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
await p.locator('#topbar [data-invite]').click(); await p.waitForTimeout(300); log(/lamp number on your page: 6/.test(await pre()), '4: the top bar says 6 as well'); await esc(p);
log(p.cons.length === 0, '13: console clean', p.cons.join('|').slice(0, 200)); await p.context().close();
// layout across viewports
for (const [w, h] of [[1366, 768], [1366, 650], [1280, 720], [1536, 730], [1440, 900], [1920, 1080], [390, 844], [360, 640], [412, 915], [768, 1024]]) {
  const q = await mk(w, h);
  const r = await q.evaluate(() => { const lamps = [...document.querySelectorAll('.lamp-btn')]; const inside = lamps.every((l) => { const r = l.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth; }); const top = lamps.every((l) => { const r = l.getBoundingClientRect(), e = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 3); return e && l.contains(e); }); const s = document.querySelector('.status-line').getBoundingClientRect(), hl = document.querySelector('.hold-label').getBoundingClientRect(); return { inside, top, ov: document.documentElement.scrollWidth - innerWidth, gap: Math.round(hl.top - s.bottom) }; });
  log(r.inside && r.top && r.ov <= 0, `7: ${w}x${h}: six lamps inside the viewport, nothing on top of them, no sideways scroll`, JSON.stringify(r)); if (r.gap < 6) log(false, `9: gap between progress and hold hint ${r.gap}px`);
  await q.context().close(); }
// voice slider thumb is the topmost element
for (const [w, h] of [[390, 844], [360, 640], [412, 915]]) {
  const q = await mk(w, h);
  const ok = await q.evaluate(async (h) => { const c = document.querySelector('.take-card'); const top = c.getBoundingClientRect().top + scrollY; scrollTo({ top: top + 120, behavior: 'instant' }); await new Promise((r) => setTimeout(r, 300)); const i = document.querySelector('.slider-row input'), r = i.getBoundingClientRect(), e = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return { top: e === i, bottom: Math.round(r.bottom), vh: innerHeight }; }, h);
  log(ok.top, `8: ${w}x${h}: the voice slider is the topmost element at its thumb`, JSON.stringify(ok)); await q.context().close(); }
// menu and calm corner, targets, skyline, hold
p = await mk(390, 844);
await p.getByRole('button', { name: 'Menu' }).click(); const menu = await p.locator('#menu').innerText(); log(/Deepavali/.test(menu) && /Ink/.test(menu), '10: Menu holds Deepavali and Ink');
await p.getByRole('button', { name: 'Ink' }).click(); log(await p.evaluate(() => document.documentElement.dataset.ink) === '1', '10: Ink toggles in the menu'); await p.getByRole('button', { name: 'Deepavali' }).click();
await p.keyboard.press('Escape'); await p.waitForTimeout(300);
await p.locator('#calm-corner').click(); log(await p.evaluate(() => document.documentElement.dataset.calm) === '1' && await p.locator('#calm-corner').getAttribute('aria-pressed') === 'true', '10: the one Calm corner button toggles calm'); await p.locator('#calm-corner').click();
const lit0 = await p.evaluate(() => [...document.querySelectorAll('.win')].filter((e) => getComputedStyle(e).opacity === '1').length); log(lit0 >= 14 && lit0 <= 16, '11/G10: about 14 lit windows at first load', String(lit0));
const small = await p.evaluate(() => [...document.querySelectorAll('button,a[href],input,textarea,[role=radio],[role=switch]')].filter((e) => { const r = e.getBoundingClientRect(), cs = getComputedStyle(e); if (!r.width || !r.height || cs.visibility === 'hidden' || e.closest('.sr-only,dialog:not([open]),.fulltext')) return false; if (e.tagName === 'A' && e.closest('p,footer,li')) return false; return r.width < 44 || r.height < 44; }).map((e) => (e.getAttribute('aria-label') || e.innerText || e.className).slice(0, 30) + ' ' + Math.round(e.getBoundingClientRect().width) + 'x' + Math.round(e.getBoundingClientRect().height)));
log(small.length === 0, '12: no interactive element under 44x44 (inline text links excepted)', small.join(' | '));
const b0 = await p.locator('.lamp-btn').first().boundingBox(); await p.mouse.move(b0.x + b0.width / 2, b0.y + 20); await p.mouse.down(); await p.waitForTimeout(1200); await p.mouse.up(); await p.waitForTimeout(400);
log(await p.locator('.lamp-btn.lit').count() === 1, '9: press and hold still lights lamp 1');
log(p.cons.length === 0, '13: console clean', p.cons.join('|').slice(0, 200));
await b.close(); srv.close();
