// Shared Playwright helpers: launch Chromium (uses the already-installed browser), watch console and network.
import { chromium } from 'playwright';
import { readdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { homedir } from 'node:os';
import { pathToFileURL } from 'node:url';

export const ROOT = resolve(new URL('..', import.meta.url).pathname);
export const VIEWPORTS = {
  phone: { width: 390, height: 844 },
  laptop: { width: 1366, height: 650 },
  wide: { width: 1850, height: 692 },
};

function findChromium() {
  const base = join(homedir(), '.cache', 'ms-playwright');
  if (!existsSync(base)) return undefined;
  const dirs = readdirSync(base).filter((d) => /^chromium-\d+$/.test(d)).sort().reverse();
  for (const d of dirs) {
    const exe = join(base, d, 'chrome-linux64', 'chrome');
    if (existsSync(exe)) return exe;
  }
  return undefined;
}

export async function launch(opts = {}) {
  return chromium.launch({ executablePath: findChromium(), args: ['--disable-dev-shm-usage'], ...opts });
}

export function fileUrl(name = 'index.html') {
  return pathToFileURL(join(ROOT, 'dist', name)).href;
}

/** New context + page that records console errors, page errors and any network request that is not file:/data:. */
export async function openPage(browser, { viewport = VIEWPORTS.phone, touch = false, reducedMotion = false, build = 'index.html', video, url, storage = true } = {}) {
  const ctx = await browser.newContext({
    viewport, hasTouch: touch, isMobile: touch, deviceScaleFactor: touch ? 2 : 1,
    reducedMotion: reducedMotion ? 'reduce' : 'no-preference',
    ...(video ? { recordVideo: { dir: video.dir, size: viewport } } : {}),
  });
  if (!storage) await ctx.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('disabled'); } }); });
  const page = await ctx.newPage();
  const log = { errors: [], requests: [] };
  page.on('console', (m) => { if (m.type() === 'error') log.errors.push(m.text()); });
  page.on('pageerror', (e) => log.errors.push('pageerror: ' + e.message));
  page.on('request', (r) => { const u = r.url(); if (!/^(file:|data:|blob:|about:)/.test(u) && !(url && u.startsWith(url.split('/').slice(0, 3).join('/')))) log.requests.push(u); });
  await page.goto(url || fileUrl(build));
  return { page, ctx, log };
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let pass = 0, failed = 0;
export function check(name, ok, detail = '') {
  if (ok) { pass++; console.log('  ok   ' + name); }
  else { failed++; console.log('  FAIL ' + name + (detail ? '  -> ' + detail : '')); }
}
export function summary() { console.log(`\n${pass} passed, ${failed} failed`); return failed; }
