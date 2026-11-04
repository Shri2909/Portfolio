import test from 'node:test';
import assert from 'node:assert/strict';
import { makeKolam, kolamToSVG, presetSeeds } from '../src/elev/kolam.js';

test('same seed gives identical output', () => {
  assert.deepEqual(makeKolam({ seed: 7 }), makeKolam({ seed: 7 }));
  assert.notDeepEqual(makeKolam({ seed: 7 }).strokes, makeKolam({ seed: 8 }).strokes);
});
test('fold symmetry', () => {
  for (const { seed, folds } of presetSeeds) {
    const k = makeKolam({ seed, folds }), a = 2 * Math.PI / folds, c = Math.cos(a), s = Math.sin(a);
    const all = k.strokes.flatMap((x) => x.pts);
    for (const st of k.strokes.slice(0, 40)) for (const [x, y] of st.pts) {
      const rx = x * c - y * s, ry = x * s + y * c;
      assert.ok(all.some(([u, v]) => Math.hypot(u - rx, v - ry) < 1e-6), `rotation of a point is missing (seed ${seed})`);
    }
  }
});
test('lines go round the dots, never through them', () => {
  for (const { seed, folds } of presetSeeds) {
    const k = makeKolam({ seed, folds });
    for (const st of k.strokes) for (const [x, y] of st.pts) for (const d of k.dots) {
      const dist = Math.hypot(x - d.x, y - d.y);
      // a lens belongs to its own dot: its outline is at least half-width away; any other dot must clear 0.018
      assert.ok(dist >= 0.018 || (Math.abs(x) < 3 && dist >= 0.0), 'distance');
      if (dist < 0.018) assert.fail(`stroke point ${dist.toFixed(4)} from a dot (seed ${seed}, folds ${folds})`);
    }
  }
});
test('200 seeds give variety, svg is static', () => {
  const seen = new Set(); for (let i = 1; i <= 200; i++) { const k = makeKolam({ seed: i }); seen.add(k.folds + ':' + k.strokes.length); }
  assert.ok(seen.size >= 12, 'variety ' + seen.size);
  assert.match(kolamToSVG(makeKolam({ seed: 3 })), /^<svg /);
});
