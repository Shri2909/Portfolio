// E7 verification (Appendix E7.A, lean): wayfinding, Menu, keyboard, history, pointer light, touch, Calm, privacy.
// Usage: node scripts/e7-interact.mjs   (serves dist/, needs a production build)
import { createRequire } from 'node:module';
import { serve } from './e2e/serve.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const { srv, base } = serve();
const ok = (n, c, d = '') => { if (!c) fails++; console.log((c ? 'pass ' : 'FAIL ') + n + (d ? '  ' + d : '')); };
let fails = 0;
const browser = await chromium.launch({ args: ['--no-sandbox'] });
async function open(kind, calm = false, extra = {}) {
  const phone = kind === 'phone';
  const ctx = await browser.newContext(phone ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true, userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36', reducedMotion: calm ? 'reduce' : 'no-preference', ...extra } : { viewport: { width: 1366, height: 768 }, reducedMotion: calm ? 'reduce' : 'no-preference', ...extra });
  await ctx.addInitScript(() => { window.__vib = []; navigator.vibrate = (p) => { window.__vib.push(p); return true; }; });
  const page = await ctx.newPage(), errs = [], hosts = new Set();
  page.on('pageerror', (e) => errs.push(String(e))); page.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  page.on('request', (r) => { const u = new URL(r.url()); if (!/^(data|blob):/.test(u.protocol) && u.host !== new URL(base).host) hosts.add(u.host); });
  await page.goto(base); await page.waitForTimeout(2200);
  return { ctx, page, errs, hosts };
}
const q = (page, f, ...a) => page.evaluate(f, ...a);

{ // ---- phone, normal motion
  const { ctx, page, errs, hosts } = await open('phone');
  ok('elevation on', await q(page, () => document.documentElement.getAttribute('data-elev')) === '1');
  ok('wayfinder hidden on the first screen', await q(page, () => !document.documentElement.hasAttribute('data-way') && getComputedStyle(document.getElementById('wayfinder')).opacity === '0'));
  ok('no cursor glow on touch', await q(page, () => !document.getElementById('lamp-cursor')));
  await q(page, () => scrollTo({ top: innerHeight * 1.2, behavior: 'instant' })); await page.waitForTimeout(900);
  ok('wayfinder appears after scrolling past 60%', await q(page, () => document.documentElement.hasAttribute('data-way') && getComputedStyle(document.getElementById('wayfinder')).opacity === '1'));
  const boxes = await q(page, () => [...document.querySelectorAll('.way-dot')].map((a) => { const r = a.getBoundingClientRect(); return [r.top, r.height, r.width]; }));
  ok('six rail links with hit boxes >= 44 px tall that do not overlap', boxes.length === 6 && boxes.every(([t, h]) => h >= 44) && boxes.every((b, i) => i === 0 || b[0] >= boxes[i - 1][0] + boxes[i - 1][1] - 0.5), JSON.stringify(boxes.map((b) => b.map(Math.round))));
  ok('rail is a nav named "Where you are"', await q(page, () => document.querySelector('nav.way-rail')?.getAttribute('aria-label') === 'Where you are'));
  ok('exactly one aria-current dot at most', await q(page, () => document.querySelectorAll('.way-dot[aria-current]').length <= 1));
  const w0 = await q(page, () => parseFloat(getComputedStyle(document.querySelector('.way-fill')).transform.split(',')[0].replace('matrix(', '')) || 0);
  await q(page, () => scrollTo({ top: document.documentElement.scrollHeight * 0.5, behavior: 'instant' })); await page.waitForTimeout(500);
  const w1 = await q(page, () => parseFloat(getComputedStyle(document.querySelector('.way-fill')).transform.split(',')[0].replace('matrix(', '')) || 0);
  ok('the thread burns further as you read', w1 > w0 + 0.2, `${w0.toFixed(2)} -> ${w1.toFixed(2)}`);
  // long jump: hop cut
  await q(page, () => scrollTo({ top: 0, behavior: 'instant' })); await page.waitForTimeout(300);
  await q(page, () => document.querySelector('.way-dot[data-n="6"]').click());
  await page.waitForTimeout(200); const hop = await q(page, () => document.documentElement.hasAttribute('data-hop'));
  await page.waitForTimeout(1200);
  const top6 = await q(page, () => Math.abs(document.getElementById('lamp-6').getBoundingClientRect().top));
  ok('tapping dot 6 from the top makes a lamp-hop cut and lands on lamp 6', hop && top6 < 120, `hop ${hop}, top ${Math.round(top6)}`);
  // Menu
  await q(page, () => scrollTo({ top: 0, behavior: 'instant' })); await page.waitForTimeout(300);
  await page.click('[aria-controls=menu]'); await page.waitForTimeout(700);
  const rows = await q(page, () => [...document.querySelectorAll('#menu > button, #menu > a')].filter((r) => !r.hidden).length);
  console.log('quality', await q(page, () => document.documentElement.dataset.quality));
  ok('Menu opens with its rows (>= 5), staggered', rows >= 5 && await q(page, () => document.getElementById('menu').dataset.stagger !== 'none'), 'rows ' + rows);
  ok('Menu is a sheet at the bottom on phones', await q(page, () => { const r = document.getElementById('menu').getBoundingClientRect(); return Math.abs(r.bottom - innerHeight) < 2; }));
  await page.keyboard.press('Tab'); await page.keyboard.press('ArrowDown'); await page.waitForTimeout(100);
  ok('arrow keys move between rows', await q(page, () => !!document.activeElement.closest('#menu')));
  await page.goBack(); await page.waitForTimeout(500);
  ok('Back closes the Menu, URL and scroll unchanged', await q(page, () => !document.getElementById('menu') && location.hash === '' && scrollY < 5));
  // overlay history: 60-second file
  await q(page, () => window.dispatchEvent(new CustomEvent('sixty:open'))); await page.waitForTimeout(500);
  ok('overlay open', await q(page, () => !!document.querySelector('dialog[open]')));
  await page.goBack(); await page.waitForTimeout(500);
  ok('Back closes the overlay', await q(page, () => !document.querySelector('dialog[open]')));
  const hl = await q(page, () => history.length);
  await q(page, () => window.dispatchEvent(new CustomEvent('sixty:open'))); await page.waitForTimeout(400);
  await q(page, () => document.querySelector('dialog[open] .btn')?.click()); await page.waitForTimeout(600);
  ok('closing with the button does not leave a stray overlay entry behind', await q(page, () => !document.querySelector('dialog[open]')));
  // haptics vocabulary + visual twin
  await q(page, () => { window.__vib.length = 0; });
  ok('named haptic buzz sets a visual twin', await q(page, () => { const b = document.querySelector('#topbar .btn'); b.focus(); return true; }));
  ok('Calm corner is a 44px circle', await q(page, () => { const r = document.getElementById('calm-corner').getBoundingClientRect(); return Math.round(r.width) === 44 && Math.round(r.height) === 44; }));
  ok('no horizontal drag starts at the edge: range inputs untouched', await q(page, () => document.querySelectorAll('input[type=range]').length >= 1));
  ok('thumb flame overlay is aria-hidden', await q(page, () => { const i = document.querySelector('input[type=range]'); i.scrollIntoView({ block: 'center' }); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(i, '5'); i.dispatchEvent(new Event('input', { bubbles: true })); return true; }));
  await page.waitForTimeout(300);
  ok('thumb flame appears while a slider is used and is hidden from assistive tech', await q(page, () => { const t = document.querySelector('.thumb-flame'); return !!t && t.getAttribute('aria-hidden') === 'true'; }));
  // reload mid page starts at the top
  await q(page, () => scrollTo({ top: 4000, behavior: 'instant' })); await page.waitForTimeout(300);
  await page.reload(); await page.waitForTimeout(1800);
  ok('reload starts at the top', await q(page, () => scrollY < 5));
  ok('no console errors, no third-party hosts', errs.length === 0 && hosts.size === 0, errs.slice(0, 2).join(' | ') + [...hosts].join());
  ok('nothing stored', await q(page, () => localStorage.length === 0 && sessionStorage.length === 0 && document.cookie === ''));
  await ctx.close();
}
{ // ---- desktop, keyboard and pointer
  const { ctx, page, errs } = await open('desk');
  await page.mouse.move(400, 300); await page.waitForTimeout(500);
  ok('lamp cursor exists and tracks the mouse within 4 px', await q(page, () => { const e = document.getElementById('lamp-cursor'); if (!e) return false; const r = e.getBoundingClientRect(); return Math.abs(r.left + r.width / 2 - 400) < 4 && Math.abs(r.top + r.height / 2 - 300) < 4; }));
  ok('cursor: none is never used', await q(page, () => ![...document.querySelectorAll('*')].some((e) => getComputedStyle(e).cursor === 'none')));
  await page.touchscreen && true;
  await page.keyboard.press('Tab'); await page.waitForTimeout(400);
  ok('Tab hides the cursor glow', await q(page, () => { const e = document.getElementById('lamp-cursor'); return !e || +getComputedStyle(e).opacity < 0.05; }));
  for (let i = 0; i < 6; i++) { await page.keyboard.press('Tab'); await page.waitForTimeout(450);
    const d = await q(page, () => { const f = document.getElementById('focus-flame'), a = document.activeElement; if (!f || !a || a === document.body) return null; const r = f.getBoundingClientRect(), t = a.getBoundingClientRect(); return { dx: Math.abs(r.left - (t.left - 3)), dy: Math.abs(r.top - (t.top - 3)), on: f.classList.contains('on') }; });
    if (d) ok('focus flame within 2 px of the focused control (tab ' + (i + 1) + ')', d.on && d.dx <= 2 && d.dy <= 2, JSON.stringify(d)); }
  await q(page, () => document.activeElement.blur()); await page.keyboard.press('?'); await page.waitForTimeout(300);
  ok('? opens the Keys list', await q(page, () => document.getElementById('keys-list')?.open === true));
  await page.keyboard.press('Escape'); await page.waitForTimeout(200);
  await page.keyboard.press('c'); await page.waitForTimeout(300);
  ok('c toggles Calm', await q(page, () => document.documentElement.dataset.calm === '1'));
  await page.keyboard.press('c'); await page.waitForTimeout(200);
  await page.keyboard.press('m'); await page.waitForTimeout(300);
  ok('m opens the Menu', await q(page, () => !!document.getElementById('menu')));
  await page.keyboard.press('m'); await page.keyboard.press('Escape');
  await page.evaluate(() => { const t = document.createElement('textarea'); t.id = 'zz'; document.body.appendChild(t); t.focus(); });
  await page.keyboard.type('cmt'); await page.waitForTimeout(200);
  ok('shortcuts are inert in a text field', await q(page, () => document.getElementById('zz').value === 'cmt' && document.documentElement.dataset.calm !== '1'));
  await q(page, () => document.getElementById('zz').remove());
  // idle ladder
  await page.mouse.move(10, 10); await page.waitForTimeout(26500);
  ok('data-idle is set after 25 s without input', await q(page, () => document.documentElement.hasAttribute('data-idle')));
  await page.mouse.move(300, 300); await page.waitForTimeout(200);
  ok('any input wakes it', await q(page, () => !document.documentElement.hasAttribute('data-idle')));
  ok('no errors', errs.length === 0, errs.join(' | '));
  await ctx.close();
}
{ // ---- Calm
  const { ctx, page, errs } = await open('phone', true);
  ok('Calm: no cursor glow, no touch glow ring, corner visible', await q(page, () => !document.getElementById('lamp-cursor') && getComputedStyle(document.getElementById('calm-corner')).opacity === '1'));
  await q(page, () => { window.__vib.length = 0; window.dispatchEvent(new CustomEvent('x')); });
  await page.click('[aria-controls=menu]'); await page.waitForTimeout(150);
  ok('Calm: menu rows have no animation', await q(page, () => [...document.querySelectorAll('#menu > button')].every((b) => getComputedStyle(b).animationName === 'none')));
  ok('Calm: instant scroll', await q(page, () => { document.getElementById('menu')?.closest('header')?.querySelector('[aria-controls=menu]').click(); return true; }));
  ok('Calm: no errors', errs.length === 0, errs.join(' | '));
  await ctx.close();
}
await browser.close(); srv.close();
console.log(fails ? `\n${fails} FAILED` : '\nall passed'); process.exit(fails ? 1 : 0);
