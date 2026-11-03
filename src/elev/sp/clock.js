// E5.5: the ghost flame. In the V3 dial the quarter hour between 06:00 (top) and 06:15 (three o'clock) becomes visible: a pale
// arc on the rim, a dashed tether with a travelling dot, and a doubled translucent flame at 12 o'clock whenever V3 shows the
// ghost state. The V3 range input, readouts, route toggle and MODEL badge are untouched. It is a model of one documented case.
import { tier, still, effect, alive, ticker } from './elev-kit.js';

const NS = 'http://www.w3.org/2000/svg';
export function mount(root) {
  const svg = root.querySelector('svg.dial'), flame = svg && svg.querySelector('.flame6'); if (!svg || !flame) return null;
  const g = document.createElementNS(NS, 'g'); g.setAttribute('class', 'ghost-e'); g.setAttribute('data-e', '1'); g.setAttribute('aria-hidden', 'true');
  const fl = (cls, dx, op) => `<g class="${cls}" transform="translate(${dx} -62)" opacity="${op}"><circle r="14" fill="rgba(255,179,71,.22)"/><path d="M0 8C-7 2-5-8 0-14C5-8 7 2 0 8Z" fill="#FFB347"/></g>`;
  const slices = tier() === 'high' ? fl('sl a', -2, 0.55) + fl('sl b', 3, 0.3) + fl('sl c', 0, 0.18) : fl('sl a', -2, 0.55) + fl('sl b', 3, 0.3);
  g.innerHTML = '<path class="arc" d="M0 -84 A84 84 0 0 1 84 0" fill="none" stroke="#F5A623" stroke-opacity=".5" stroke-width="3"/>' +
    '<path class="tether" d="M0 -84 A84 84 0 0 1 84 0" fill="none" stroke="#FFF3DC" stroke-opacity=".7" stroke-width="1.5" stroke-dasharray="4 3"/><circle class="dot" r="2.6" fill="#FFD27A" cx="0" cy="-84"/>' + slices;
  svg.insertBefore(g, svg.querySelector('.hand'));
  const dot = g.querySelector('.dot'); let stop = null, t0 = 0;
  const sync = () => {
    const on = flame.classList.contains('ghost'); g.dataset.on = on ? '1' : '0';
    stop && stop(); stop = null; if (!on || still() || tier() === 'low' || !alive('clock')) { dot.setAttribute('cx', 84 * Math.sin(0.5)); dot.setAttribute('cy', -84 * Math.cos(0.5)); return; }
    t0 = performance.now(); stop = ticker.add((dt, now) => { const k = ((now - t0) % 1800) / 1800, a = k * Math.PI / 2; dot.setAttribute('cx', (84 * Math.sin(a)).toFixed(1)); dot.setAttribute('cy', (-84 * Math.cos(a)).toFixed(1)); if (tier() === 'high') g.style.setProperty('--sh', Math.sin(now / 450).toFixed(2)); });
  };
  const mo = new MutationObserver(sync); mo.observe(flame, { attributes: true, attributeFilter: ['class'] }); sync();
  const unreg = effect('clock', { priority: 6, ms: 0.4, shed: () => { stop && stop(); stop = null; }, restore: sync });
  return () => { mo.disconnect(); stop && stop(); unreg(); g.remove(); };
}
