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

// ---- screen recording --------------------------------------------------------------------------
// Playwright's recordVideo needs a newer bundled ffmpeg than this machine has, so we record Chromium's screencast
// (CDP) and encode it ourselves with the ffmpeg that IS installed (it has the VP8 encoder: .webm output).
import { spawn } from 'node:child_process';
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';

function ffmpegPath() {
  const base = join(homedir(), '.cache', 'ms-playwright');
  const d = readdirSync(base).filter((x) => /^ffmpeg-\d+$/.test(x)).sort().reverse().find((x) => existsSync(join(base, x, 'ffmpeg-linux')));
  return d ? join(base, d, 'ffmpeg-linux') : 'ffmpeg';
}

export async function startRecording(page, { fps = 25 } = {}) {
  const cdp = await page.context().newCDPSession(page);
  const frames = [];
  cdp.on('Page.screencastFrame', (f) => {
    frames.push({ t: f.metadata.timestamp, buf: Buffer.from(f.data, 'base64') });
    cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {});
  });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 85, everyNthFrame: 1 });
  return {
    async stop(outFile) {
      await cdp.send('Page.stopScreencast').catch(() => {});
      if (!frames.length) throw new Error('no frames captured');
      const t0 = frames[0].t, t1 = frames[frames.length - 1].t + 0.6;
      const ff = spawn(ffmpegPath(), ['-hide_banner', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', 'pipe:0',
        '-an', '-c:v', 'libvpx', '-b:v', '1500k', '-crf', '10', '-pix_fmt', 'yuv420p', '-y', outFile], { stdio: ['pipe', 'inherit', 'inherit'] });
      const done = new Promise((res, rej) => { ff.on('close', (c) => (c === 0 ? res() : rej(new Error('ffmpeg exit ' + c)))); });
      let j = 0;
      for (let i = 0; t0 + i / fps <= t1; i++) {
        const tick = t0 + i / fps;
        while (j + 1 < frames.length && frames[j + 1].t <= tick) j++;
        if (!ff.stdin.write(frames[j].buf)) await new Promise((r) => ff.stdin.once('drain', r));
      }
      ff.stdin.end();
      await done;
      return { frames: frames.length, seconds: +(t1 - t0).toFixed(1) };
    },
  };
}

// ---- tests with modified data ---------------------------------------------------------------
// Takes dist/<build>, lets a function edit the embedded JSON (for example to add Lab results or repo links that do not exist
// in content.json yet), writes the copy next to the build and opens it. Production code stays free of any sample data.
export async function openWithData(browser, mutate, opts = {}) {
  const src = readFileSync(join(ROOT, 'dist', opts.build || 'index.html'), 'utf8');
  const m = src.match(/<script type="application\/json" id="cf-data">([\s\S]*?)<\/script>/);
  const data = JSON.parse(m[1].replace(/<\\\//g, '</'));
  mutate(data);
  const out = src.replace(m[0], () => '<script type="application/json" id="cf-data">' + JSON.stringify(data).replace(/<\//g, '<\\/') + '</script>');
  mkdirSync(join(ROOT, '.tmp'), { recursive: true });
  const file = join(ROOT, '.tmp', '_mutated.html');
  writeFileSync(file, out);
  const r = await openPage(browser, { ...opts, url: pathToFileURL(file).href });
  return r;
}
