import { useEffect, useState } from 'react';
export function useWindowSize() {
  const get = () => ({ w: window.innerWidth, h: window.innerHeight });
  const [s, set] = useState(get);
  useEffect(() => {
    let t = 0;
    const f = () => { clearTimeout(t); t = setTimeout(() => set(get()), 120); };
    window.addEventListener('resize', f);
    return () => { clearTimeout(t); window.removeEventListener('resize', f); };
  }, []);
  return s;
}
