// E8.3: the pure decision logic of the adaptive governor (no DOM, unit-tested). The host supplies the effect lists.
// SHED when EWMA > 21 ms for 45 frames AND p95 of the last 120 frames > 33 ms; cooldown 2.5 s doubling per shed in the
// last 60 s (cap 20 s); three sheds in 30 s also drop the tier and lock restores for 25 s. RESTORE one step after the
// EWMA stays below 14.5 ms for 12 s with no long task over 80 ms. A restored effect shed again within 8 s is pinned.
export function createGovernor() {
  const ring = new Float32Array(120);
  let e = 16.7, n = 0, frames = 0, over = 0, good = -1, cool = 0, lock = 0, quietUntil = 0, busySince = -1;
  const sheds = [], restoredAt = new Map(), restoredN = new Map(), pinned = new Set();
  const p95 = () => { const k = Math.min(n, 120), a = Array.from(ring.subarray(0, k)).sort((x, y) => x - y); return a[Math.floor(k * 0.95)] || 0; };
  return {
    get ewma() { return e; }, pinned,
    quiet(until) { quietUntil = Math.max(quietUntil, until); over = 0; good = -1; },
    step(dt, t, host, flags = {}) {
      dt = Math.min(dt, 100);
      if (frames < 60 || t < quietUntil) { frames++; return []; }
      e += 0.08 * (dt - e); ring[n++ % 120] = dt;
      over = e > 21 ? over + 1 : 0;
      if (flags.longTask) good = -1;
      e < 14.5 ? (good < 0 && (good = t)) : (good = -1);
      const out = [];
      if (over >= 45 && n >= 60 && p95() > 33 && t >= cool) {
        if (flags.busy) { if (busySince < 0) busySince = t; if (t - busySince < 1000) return out; }
        busySince = -1;
        const id = host.shedList()[0];
        if (id) { out.push({ type: 'shed', id }); if (restoredAt.has(id) && t - restoredAt.get(id) < 8000) pinned.add(id); }
        else if (host.canTierDown()) out.push({ type: 'tier-down' });
        while (sheds.length && t - sheds[0] > 60000) sheds.shift();
        sheds.push(t);
        const recent = sheds.length;
        cool = t + Math.min(20000, 2500 * 2 ** Math.max(0, recent - 1));
        if (sheds.filter((s) => t - s <= 30000).length >= 3 && host.canTierDown() && !out.some((a) => a.type === 'tier-down')) { out.push({ type: 'tier-down', thermal: true }); lock = t + 25000; }
        over = 0; good = -1;
      } else if (good >= 0 && t - good >= 12000 && t >= lock && !flags.noRestore) {
        const id = host.restoreList().find((i) => !pinned.has(i) && (restoredN.get(i) || 0) < 2);
        if (id) { out.push({ type: 'restore', id }); restoredAt.set(id, t); restoredN.set(id, (restoredN.get(id) || 0) + 1); }
        good = t; // the next step needs another 12 calm seconds
      }
      return out;
    },
  };
}
