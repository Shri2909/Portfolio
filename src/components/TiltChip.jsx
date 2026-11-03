import { useEffect, useState } from 'react';
import { X } from '../lib/copy.js';
import { parallaxTarget } from '../lib/parallax.js';

// Opt-in device tilt for phones. Never asks for permission on load; iOS asks on tap only.
export default function TiltChip() {
  const [avail] = useState(() => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches && 'DeviceOrientationEvent' in window);
  const [on, setOn] = useState(false), [refused, setRefused] = useState(false);
  useEffect(() => {
    if (!on) { parallaxTarget(0, 0); return; }
    const h = (e) => { const g = Math.max(-12, Math.min(12, e.gamma || 0)), b = Math.max(-12, Math.min(12, (e.beta || 0) - 45)); parallaxTarget(g / 12, b / 12); };
    window.addEventListener('deviceorientation', h);
    return () => window.removeEventListener('deviceorientation', h);
  }, [on]);
  if (!avail || refused) return null;
  const toggle = async () => {
    if (on) return setOn(false);
    const D = window.DeviceOrientationEvent;
    if (D && typeof D.requestPermission === 'function') { try { if ((await D.requestPermission()) !== 'granted') return setRefused(true); } catch (e) { return setRefused(true); } }
    setOn(true);
  };
  return <button className="btn" aria-pressed={on} onClick={toggle}>{X('tilt')}</button>;
}
