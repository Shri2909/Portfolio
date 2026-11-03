import { useEffect } from 'react';
import SkyLayer from './SkyLayer.jsx';
import SkylineLayer from './SkylineLayer.jsx';
import Terrace from './Terrace.jsx';
import Dusk from './Dusk.jsx';
import { on } from '../../lib/events.js';
import { startPointerParallax } from '../../lib/parallax.js';
import { startDirector } from '../../lib/director.js';

// Fixed night stage behind the page. Order: sky, fx canvas, skyline, terrace, light overlays.
// Stage layers are decorative (aria-hidden); the only real control here is the string-light button inside Terrace.
export default function Stage() {
  useEffect(() => {
    startPointerParallax(); startDirector();
    const a = on('diya:lit', ({ x, y }) => { if (x || y) { const r = document.documentElement; r.style.setProperty('--cast-x', x + 'px'); r.style.setProperty('--cast-y', y + 'px'); } });
    // Reading veil: dim the scene by 25% while a section after #lamps is on screen.
    const ids = ['baithak', 'voice', 'lamp-6', 'verdict', 'wish', 'closure'], seen = new Set();
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => (e.isIntersecting ? seen.add(e.target.id) : seen.delete(e.target.id)));
      document.documentElement.dataset.veil = seen.size ? '1' : '0'; if (document.documentElement.dataset.elev !== '1') document.documentElement.dataset.act = seen.has('baithak') ? 'baithak' : seen.has('lamp-6') ? 'last' : seen.has('voice') ? 'voice' : '';
    }, { rootMargin: '-35% 0px -35% 0px' });
    ids.forEach((id) => { const el = document.getElementById(id); el && io.observe(el); });
    return () => { a(); io.disconnect(); };
  }, []);
  return (
    <div id="stage">
      <SkyLayer />
      <canvas id="fx" aria-hidden="true" />
      <div id="fx-glows" aria-hidden="true" />
      <SkylineLayer />
      <Terrace />
      <Dusk />
      <div id="cast" aria-hidden="true" /><div id="vignette" aria-hidden="true" /><div id="veil" aria-hidden="true" />
    </div>
  );
}
