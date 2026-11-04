// E6.4: Chalta card. A 6 second silent loop in which the wish writes itself in light beside a lit diya, recorded on
// the device from a canvas (MediaRecorder, no audio track) and shared only on a tap. The picture card stays the
// primary share; the moving card is a bonus. Nothing leaves the device unless the visitor shares it.
import copy from '../lib/copy.js';
import { getState } from '../lib/store.js';
import { emit } from '../lib/events.js';
import { announce } from '../lib/announce.js';
import { renderCard, themeById, W, H } from '../lib/cardRender.js';
import { cardContent, shareText, download } from '../lib/cardActions.js';
import { wishState } from '../lib/wishState.js';
import { mulberry32 } from '../lib/rand.js';
import { FOCUS } from './studio.js';

const X = copy.ui.extra, MW = 720, MH = 900, K = MW / W, DUR = 6;
const TYPES = ['video/mp4;codecs=avc1.42E01E', 'video/mp4;codecs=avc1.4D401E', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];
const pick = () => (window.MediaRecorder && MediaRecorder.isTypeSupported ? TYPES.find((t) => MediaRecorder.isTypeSupported(t)) : null) || null;
const ease = (t) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 4), clamp01 = (t) => Math.min(1, Math.max(0, t));

// one frame of the film at time t (0..6); periodic: harmonics are whole cycles per 6 s so frame 6.0 matches frame 0
export function frame(ctx, A, T, M, themeId, t, tier) {
  const th = themeById(themeId), f = FOCUS[themeId] || [540, 270], ph = (2 * Math.PI * t) / DUR;
  const lit = t < 0.8 ? ease(t / 0.8) : t < 5.4 ? 1 : 1 - ease((t - 5.4) / 0.6);
  const textA = t < 4.2 ? 1 : t < 5.4 ? 1 : 1 - ease((t - 5.4) / 0.6);
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#0A0705'; ctx.fillRect(0, 0, MW, MH);
  ctx.globalAlpha = 0.3 + 0.7 * lit; ctx.drawImage(A, 0, 0); ctx.globalAlpha = 1;
  // flame
  const n = Math.sin(ph * 7) * 0.5 + Math.sin(ph * 11 + 1) * 0.35 + Math.sin(ph * 3) * 0.4, s = (0.2 + 0.8 * lit) * K * (themeId === 'diya' ? 1 : 0.8), x = f[0] * K, y = (f[1] + (themeId === 'diya' ? 40 : 0)) * K, h = (92 + n * 8) * s / K * K, lean = n * 4 * s;
  const g = ctx.createRadialGradient(x, y - 40 * s, 0, x, y - 40 * s, 260 * s); g.addColorStop(0, `rgba(255,200,110,${0.5 * lit})`); g.addColorStop(1, 'rgba(255,200,110,0)');
  ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(x - 260 * s, y - 300 * s, 520 * s, 560 * s); ctx.globalCompositeOperation = 'source-over';
  for (const [w, k, col] of [[30, 1, '#FFB347'], [20, 0.78, '#FFD27A'], [9, 0.45, '#FFF3DC']]) {
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x, y); ctx.bezierCurveTo(x - w * s, y - h * k * 0.35, x - w * s * 0.9 + lean * k, y - h * k * 0.75, x + lean * k, y - h * k);
    ctx.bezierCurveTo(x + w * s * 0.9 + lean * k, y - h * k * 0.75, x + w * s, y - h * k * 0.35, x, y); ctx.fill();
  }
  // the words write themselves: a soft wipe led by a point of light
  const p = ease((t - 0.8) / 3.4), y0 = 150 * K, y1 = 1160 * K, sy = y0 + (y1 - y0) * p, soft = 36;
  if (p > 0 && textA > 0) {
    const m = M.getContext('2d'); m.setTransform(1, 0, 0, 1, 0, 0); m.globalCompositeOperation = 'source-over'; m.clearRect(0, 0, MW, MH); m.drawImage(T, 0, 0);
    m.globalCompositeOperation = 'destination-in'; const gg = m.createLinearGradient(0, sy - soft, 0, sy + soft); gg.addColorStop(0, '#000'); gg.addColorStop(1, 'rgba(0,0,0,0)'); m.fillStyle = gg; m.fillRect(0, 0, MW, MH);
    if (p >= 1) { m.globalCompositeOperation = 'source-over'; m.clearRect(0, 0, MW, MH); m.drawImage(T, 0, 0); }
    ctx.globalAlpha = textA; ctx.drawImage(M, 0, 0); ctx.globalAlpha = 1;
    if (p < 1) { const px = MW / 2 + Math.sin(p * 18) * (MW * 0.32), pg = ctx.createRadialGradient(px, sy, 0, px, sy, 40); pg.addColorStop(0, 'rgba(255,243,220,.95)'); pg.addColorStop(0.4, 'rgba(255,200,110,.5)'); pg.addColorStop(1, 'rgba(255,200,110,0)'); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = pg; ctx.fillRect(px - 40, sy - 40, 80, 80); ctx.globalCompositeOperation = 'source-over'; }
  }
  // sparkles while it holds
  if (t > 4.2 && t < 5.4 && tier !== 'low') {
    const r = mulberry32(5), cnt = tier === 'high' ? 6 : 3;
    for (let i = 0; i < cnt; i++) { const sx = (140 + r() * 800) * K, sy2 = (200 + r() * 900) * K, a = Math.sin(Math.PI * clamp01((t - 4.2 - i * 0.12) / 0.9)); if (a <= 0) continue; ctx.globalAlpha = a * 0.9; ctx.fillStyle = '#FFD27A'; ctx.beginPath(); ctx.moveTo(sx, sy2 - 9); ctx.lineTo(sx + 2.5, sy2 - 2.5); ctx.lineTo(sx + 9, sy2); ctx.lineTo(sx + 2.5, sy2 + 2.5); ctx.lineTo(sx, sy2 + 9); ctx.lineTo(sx - 2.5, sy2 + 2.5); ctx.lineTo(sx - 9, sy2); ctx.lineTo(sx - 2.5, sy2 - 2.5); ctx.closePath(); ctx.fill(); }
    ctx.globalAlpha = 1;
  }
}
const layer = (themeId, layers, content, seed) => { const c = document.createElement('canvas'); c.width = MW; c.height = MH; renderCard({ canvas: c, themeId, content, scale: K, layers, seed }); return c; };

export function mount() {
  const host = document.querySelector('.card-stage .actions'); if (!host) return () => {};
  if (host.querySelector('.movie-row')) return () => {};
  const row = document.createElement('div'); row.className = 'movie-row'; row.setAttribute('data-e', '1');
  row.innerHTML = `<button type="button" class="btn movie-go" aria-label="${X.movieAria}">${X.movieLabel}</button><p class="movie-note" role="status" aria-live="polite"></p>
    <div class="movie-view" hidden><canvas class="movie-cv" width="${MW}" height="${MH}" aria-hidden="true"></canvas><svg class="movie-ring" viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="15"/><circle class="v" cx="18" cy="18" r="15"/></svg></div>`;
  const grid = host.querySelector('.grid2'); grid ? grid.after(row) : host.prepend(row);
  const btn = row.querySelector('.movie-go'), note = row.querySelector('.movie-note'), view = row.querySelector('.movie-view'), pv = row.querySelector('.movie-cv'), ring = row.querySelector('.movie-ring .v');
  let busy = false, slowAsked = false, file = null, kind = '', abort = false;
  const onHide = () => { if (document.hidden) abort = true; }; document.addEventListener('visibilitychange', onHide);
  btn.addEventListener('click', async () => {
    if (file) { // share the finished film, else download it
      try { if (kind === 'mp4' && navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], text: shareText() }); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
      download(file); return;
    }
    if (busy) return;
    const q = getState().quality; if (q === 'low' && !slowAsked) { slowAsked = true; note.textContent = X.movieSlow; return; }
    const type = pick(); if (!type || !HTMLCanvasElement.prototype.captureStream) { note.textContent = X.movieFailed; return; }
    busy = true; abort = false; btn.disabled = true; note.textContent = ''; view.hidden = false;
    const wsv = wishState.get(), content = cardContent(), A = layer(wsv.theme, 'art', content, wsv.seed), T = layer(wsv.theme, 'text', content, wsv.seed), M = document.createElement('canvas'); M.width = MW; M.height = MH;
    const rc = document.createElement('canvas'); rc.width = MW; rc.height = MH; const ctx = rc.getContext('2d'), pctx = pv.getContext('2d'), calm = getState().calm;
    const fps = q === 'high' ? 30 : 24, stream = rc.captureStream(0), track = stream.getVideoTracks()[0], auto = !track || !track.requestFrame;
    const stream2 = auto ? rc.captureStream(fps) : stream, rec = new MediaRecorder(stream2, { mimeType: type, videoBitsPerSecond: 1600000 }), chunks = []; // no audio track is ever added
    rec.ondataavailable = (e) => e.data && e.data.size && chunks.push(e.data);
    const done = new Promise((res) => { rec.onstop = res; });
    let slow = 0, last = -1e9; const t0 = performance.now(); rec.start();
    await new Promise((resolve) => {
      const step = () => {
        const t = (performance.now() - t0) / 1000;
        if (abort || t >= DUR) return resolve();
        if (performance.now() - last >= 1000 / fps - 2) {
          last = performance.now(); const a = performance.now(); frame(ctx, A, T, M, wsv.theme, t, q);
          if (!calm) pctx.drawImage(rc, 0, 0); else if (t < 0.1) { frame(ctx, A, T, M, wsv.theme, 4.8, q); pctx.drawImage(rc, 0, 0); frame(ctx, A, T, M, wsv.theme, t, q); }
          if (!auto) track.requestFrame();
          ring.style.strokeDasharray = `${(t / DUR) * 94.2} 94.2`;
          slow = performance.now() - a > 33 ? slow + 1 : 0; if (slow >= 2) abort = true;
        }
        requestAnimationFrame(step);
      };
      step();
    });
    frame(ctx, A, T, M, wsv.theme, 0, q); if (!auto) track.requestFrame();
    rec.state !== 'inactive' && rec.stop(); await done; stream2.getTracks().forEach((x) => x.stop());
    view.hidden = true; busy = false; btn.disabled = false;
    if (abort || !chunks.length) { note.textContent = X.movieFailed; return; }
    const blob = new Blob(chunks, { type: type.split(';')[0] }); kind = /mp4/.test(type) ? 'mp4' : 'webm';
    file = new File([blob], 'ek-diya-se-doosra-card.' + kind, { type: blob.type });
    btn.textContent = kind === 'mp4' ? X.movieShare : X.movieDownloadWebm; note.textContent = kind === 'mp4' ? X.movieNoteMp4 : X.movieNoteWebm;
    announce(note.textContent); emit('movie:ready', { size: blob.size, type: blob.type, audio: stream2.getAudioTracks().length });
  });
  // a changed card makes the old film stale
  const un = wishState.subscribe(() => { if (file) { file = null; btn.textContent = X.movieLabel; note.textContent = ''; } });
  return () => { un(); document.removeEventListener('visibilitychange', onHide); row.remove(); };
}
