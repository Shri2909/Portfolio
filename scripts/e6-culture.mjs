// E6 verification (lean): rangoli pad, card studio per theme, moving card, lantern sky, secrets, homely scheduler, Calm,
// privacy. Usage: node scripts/e6-culture.mjs   (serves dist/, needs a production build)
import { createRequire } from 'node:module';
import fs from 'node:fs';
import { serve } from './e2e/serve.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const { srv, base } = serve();
let fails = 0; const ok = (n, c, d = '') => { if (!c) fails++; console.log((c ? 'pass ' : 'FAIL ') + n + (d ? '  ' + d : '')); };
const browser = await chromium.launch({ args: ['--no-sandbox'] });
async function open(url = '', calm = false, vp = { width: 390, height: 844 }) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, hasTouch: vp.width < 600, isMobile: vp.width < 600, reducedMotion: calm ? 'reduce' : 'no-preference' });
  await ctx.addInitScript(() => { window.__ev = []; window.__store = 0; for (const n of ['localStorage', 'sessionStorage']) { try { const s = window[n]; const set = s.setItem.bind(s); s.setItem = (...a) => { window.__store++; return set(...a); }; } catch {} } for (const n of ['egg:found', 'moment:start', 'moment:end', 'movie:ready', 'kolam:changed']) addEventListener(n, (e) => window.__ev.push([n, e.detail])); });
  const page = await ctx.newPage(), errs = [], hosts = new Set();
  page.on('pageerror', (e) => errs.push(String(e))); page.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  page.on('request', (r) => { const u = new URL(r.url()); if (!/^(data|blob):/.test(u.protocol) && u.host !== new URL(base).host) hosts.add(u.host); });
  await page.goto(base + url); await page.waitForTimeout(2500); return { ctx, page, errs, hosts };
}
const q = (p, f, ...a) => p.evaluate(f, ...a);
const toWish = async (p) => { await q(p, () => document.getElementById('wish').scrollIntoView({ behavior: 'instant' })); await p.waitForTimeout(2600); };
const makeCard = async (p, text = 'Wishing you a very bright year ahead') => { await p.fill('#wish-text', text); await p.fill('#wish-to', 'Asha'); await p.click('.wish-form .make'); await p.waitForTimeout(2200); };

{ // ---- phone, normal motion
  const { ctx, page, errs, hosts } = await open('#v1.7.Asha');
  await toWish(page);
  ok('pad disclosure mounted, collapsed', await q(page, () => { const d = document.querySelector('details.kpad'); return !!d && !d.open; }));
  await page.click('.kpad > summary'); await page.waitForTimeout(400);
  const box = await q(page, () => { const r = document.querySelector('.kpad-cv').getBoundingClientRect(); return [r.left, r.top + scrollY, r.width, r.height]; });
  await q(page, () => document.querySelector('.kpad-cv').scrollIntoView({ block: 'center', behavior: 'instant' })); await page.waitForTimeout(300);
  const bb = await q(page, () => { const r = document.querySelector('.kpad-cv').getBoundingClientRect(); return [r.left, r.top, r.width, r.height]; });
  await page.mouse.move(bb[0] + bb[2] * 0.6, bb[1] + bb[3] * 0.5); await page.mouse.down();
  for (let i = 1; i <= 30; i++) await page.mouse.move(bb[0] + bb[2] * (0.6 + 0.2 * Math.sin(i / 5)), bb[1] + bb[3] * (0.5 - 0.3 * i / 30), { steps: 1 });
  await page.mouse.up(); await page.waitForTimeout(300);
  // 12 folds + mirror: count lit pixels in 12 equal sectors
  await page.click('[data-folds="12"]'); await page.waitForTimeout(300);
  const sec = await q(page, () => { const c = document.querySelector('.kpad-cv'), x = c.getContext('2d'), n = c.width, d = x.getImageData(0, 0, n, n).data, S = new Array(12).fill(0); for (let y = 0; y < n; y++) for (let i = 0; i < n; i++) { const o = (y * n + i) * 4; if (d[o] > 200 && d[o + 1] > 170 && d[o + 2] > 120) { const a = Math.atan2(y - n / 2, i - n / 2); S[Math.floor(((a + Math.PI) / (2 * Math.PI)) * 12) % 12]++; } } return S; });
  const mx = Math.max(...sec), mn = Math.min(...sec);
  ok('drawing glows in all 12 sectors', mn > 0 && mx / Math.max(1, mn) < 2.2, JSON.stringify(sec));
  ok('kolam:changed fired', (await q(page, () => window.__ev.filter((e) => e[0] === 'kolam:changed').length)) >= 1);
  await page.click('[data-act="undo"]'); await page.click('[data-act="clear"]'); await page.focus('.kpad-cv');
  for (const k of ['Space', 'ArrowRight', 'ArrowRight', 'ArrowDown', 'ArrowDown', 'Space']) await page.keyboard.press(k);
  await page.waitForTimeout(300); ok('keyboard stroke is announced and drawn', await q(page, () => window.__ev.filter((e) => e[0] === 'kolam:changed').length) >= 2);
  await page.click('.kpad-pre[data-pre="4"]'); await page.waitForTimeout(2000);
  ok('preset fills the pad', await q(page, () => { const c = document.querySelector('.kpad-cv'), d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i] > 200 && d[i + 1] > 170) n++; return n > 300; }));
  ok('presets have names and 44px targets', await q(page, () => [...document.querySelectorAll('.kpad-pre')].every((b) => b.getAttribute('aria-label') && b.getBoundingClientRect().height >= 44 - 0.5 && b.getBoundingClientRect().width >= 40)));
  // card studio per theme
  await makeCard(page);
  ok('live flame canvas is over the art', await q(page, () => !!document.querySelector('.card-body canvas.live')));
  const sizes = [];
  for (let i = 0; i < 6; i++) {
    await q(page, (n) => document.querySelectorAll('.theme-dots [role=radio]')[n].click(), i); await page.waitForTimeout(700);
    const sz = await q(page, async () => { const orig = URL.createObjectURL; let s = 0; URL.createObjectURL = (b) => { s = b.size; return orig.call(URL, b); }; const btn = [...document.querySelectorAll('.grid2 .btn')].find((b) => /download/i.test(b.textContent)); btn && btn.click(); await new Promise((r) => setTimeout(r, 1500)); URL.createObjectURL = orig; return s; });
    sizes.push(sz);
  }
  ok('PNG export of every theme is under 300 KB', sizes.every((s) => s > 5000 && s <= 307200), JSON.stringify(sizes));
  // moving card
  await q(page, () => document.querySelectorAll('.theme-dots [role=radio]')[0].click()); await page.waitForTimeout(500);
  await q(page, () => document.querySelector('.movie-go').scrollIntoView({ block: 'center', behavior: 'instant' }));
  await page.click('.movie-go'); await page.waitForTimeout(7500);
  const mv = await q(page, () => window.__ev.find((e) => e[0] === 'movie:ready'));
  ok('moving card: 15 KB to 2.5 MB, silent, typed', !!mv && mv[1].size > 15000 && mv[1].size < 2.5e6 && mv[1].audio === 0 && !!mv[1].type, JSON.stringify(mv && mv[1]));
  ok('share/download button replaces the record button', await q(page, () => /share moving|download webm/i.test(document.querySelector('.movie-go').textContent)));
  // secrets
  const eggs = () => q(page, () => window.__ev.filter((e) => e[0] === 'egg:found').map((e) => e[1].id));
  await q(page, () => scrollTo({ top: 0, behavior: 'instant' })); await page.waitForTimeout(600);
  const moon = await q(page, () => { const r = document.querySelector('#stage .moon').getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; });
  for (let i = 0; i < 3; i++) { await q(page, ([x, y]) => document.body.dispatchEvent(new PointerEvent('pointerdown', { clientX: x, clientY: y, bubbles: true })), moon); await page.waitForTimeout(150); }
  ok('three moon taps wink', (await eggs()).includes('moon'));
  for (let i = 0; i < 3; i++) await q(page, ([x, y]) => document.body.dispatchEvent(new PointerEvent('pointerdown', { clientX: x, clientY: y, bubbles: true })), moon);
  ok('a second egg inside 20 s is ignored', (await eggs()).length === 1);
  // lanterns
  const ln = await open('#v1.7.Asha');
  await q(ln.page, () => document.getElementById('closure').scrollIntoView({ behavior: 'instant' })); await ln.page.waitForTimeout(1500);
  ok('seven lanterns for a row of 7', await q(ln.page, () => document.querySelector('canvas.lsky')?.dataset.lanterns) === '7');
  ok('caption line stays visible', await q(ln.page, () => /not a visitor count/i.test(document.querySelector('#closure .fine')?.textContent || '')));
  await ln.ctx.close();
  const lz = await open('#v1.zzz'); await q(lz.page, () => document.getElementById('closure').scrollIntoView({ behavior: 'instant' })); await lz.page.waitForTimeout(1500);
  ok('capped lantern sky (24 high, 16 mid) plus haze for a huge row', await q(lz.page, () => { const c = document.querySelector('canvas.lsky'); return ['16', '24'].includes(c.dataset.lanterns) && c.dataset.more === '1'; })); await lz.ctx.close();
  ok('no third-party hosts, no storage writes, no console errors', hosts.size === 0 && (await q(page, () => window.__store)) === 0 && errs.length === 0, [...hosts].join(',') + ' ' + errs.slice(0, 2).join(' | '));
  await ctx.close();
}
{ // ---- homely scheduler with a fake clock
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await ctx.newPage(); await page.clock.install(); await page.addInitScript(() => { window.__m = []; addEventListener('moment:start', (e) => window.__m.push([performance.now(), e.detail.id, 's'])); addEventListener('moment:end', (e) => window.__m.push([performance.now(), e.detail.id, 'e'])); });
  await page.goto(base); await page.clock.runFor(10000);
  ok('no moment before 18 s', (await q(page, () => window.__m.length)) === 0);
  for (let i = 0; i < 40; i++) await page.clock.runFor(15000);
  const m = await q(page, () => window.__m); const starts = m.filter((e) => e[2] === 's'), counts = {}; starts.forEach((e) => (counts[e[1]] = (counts[e[1]] || 0) + 1));
  ok('no moment plays more than twice and never more than 3 alive', Object.values(counts).every((n) => n <= 2) && (() => { let a = 0, mx = 0; for (const e of m) { a += e[2] === 's' ? 1 : -1; mx = Math.max(mx, a); } return mx <= 3; })(), JSON.stringify(counts));
  ok('moment nodes are aria-hidden', await q(page, () => [...document.querySelectorAll('[data-e]')].filter((e) => e.closest('#stage') || e.classList.contains('homely-chappal')).every((e) => e.getAttribute('aria-hidden') === 'true' || e.closest('[aria-hidden="true"]'))));
  await ctx.close();
}
{ // ---- Calm
  const { ctx, page, errs } = await open('#v1.7.Asha', true);
  await toWish(page);
  await makeCard(page, 'Calm card');
  await page.waitForTimeout(600);
  const c1 = await q(page, () => { const c = document.querySelector('.card-body canvas.live'); return c ? c.getContext('2d').getImageData(0, 0, c.width || 1, c.height || 1).data.some((v) => v) : false; });
  ok('Calm: live flame never draws', c1 === false);
  ok('Calm: pad still works', await q(page, () => !!document.querySelector('details.kpad')));
  await q(page, () => document.getElementById('closure').scrollIntoView({ behavior: 'instant' })); await page.waitForTimeout(1200);
  ok('Calm: lanterns in their final place', await q(page, () => document.querySelector('canvas.lsky')?.dataset.lanterns) === '7');
  ok('Calm: no console errors', errs.length === 0, errs.join(' | '));
  await ctx.close();
}
await browser.close(); srv.close();
console.log(fails ? `\n${fails} FAILED` : '\nall passed'); process.exit(fails ? 1 : 0);
