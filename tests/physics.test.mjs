import test from 'node:test';
import assert from 'node:assert/strict';
import { makeSpring, stepSpring, project, rubber, tracker } from '../src/elev/physicsCore.js';

const run = (s, fps, ms) => { const out = []; for (let t = 0; t < ms; t += 1000 / fps) { stepSpring(s, 1000 / fps); out.push([t, s.x]); } return out; };
test('critically damped never overshoots', () => {
  const s = makeSpring({ omega: 17, zeta: 1 }); s.target = 1;
  assert.ok(Math.max(...run(s, 60, 1500).map((p) => p[1])) <= 1.001);
});
test('zeta 0.5 overshoots 15 to 18 percent and settles inside 800 ms', () => {
  const s = makeSpring({ omega: 20, zeta: 0.5 }); s.target = 1;
  const r = run(s, 120, 1500), mx = Math.max(...r.map((p) => p[1]));
  assert.ok(mx > 1.14 && mx < 1.19, 'overshoot ' + mx);
  const last = r.findLast((p) => Math.abs(p[1] - 1) > 0.02); assert.ok(!last || last[0] < 800, 'settle ' + (last && last[0]));
});
test('stepping at 30, 60 and 120 fps agrees within 1 percent', () => {
  const at = (fps) => { const s = makeSpring({ omega: 16, zeta: 0.6 }); s.target = 1; return run(s, fps, 300).at(-1)[1]; };
  const a = at(30), b = at(60), c = at(120); assert.ok(Math.abs(a - c) < 0.01 && Math.abs(b - c) < 0.01, [a, b, c].join());
});
test('a spring goes to sleep exactly on its target', () => {
  const s = makeSpring({ omega: 25, zeta: 1 }); s.target = 3; let live = true, n = 0;
  while (live && n++ < 600) live = stepSpring(s, 16.7);
  assert.equal(live, false); assert.equal(s.x, 3); assert.equal(s.v, 0);
});
test('a 100 ms stall cannot explode', () => {
  const s = makeSpring({ omega: 30, zeta: 0.3 }); s.target = 1; stepSpring(s, 5000); assert.ok(Number.isFinite(s.x) && Math.abs(s.x) < 5);
});
test('project and rubber', () => {
  assert.equal(project(0, 0), 0); assert.ok(project(0, 1) > 400);
  assert.equal(rubber(5, 0, 10, 100), 5); assert.ok(rubber(-30, 0, 10, 100) < 0 && rubber(-30, 0, 10, 100) > -30);
});
test('tracker: a held finger releases with zero velocity', () => {
  const t = tracker(); for (let i = 0; i < 8; i++) t.push(i * 10, i * 5, 0);
  assert.ok(Math.abs(t.velocity(70).x - 0.5) < 0.01); assert.deepEqual(t.velocity(500), { x: 0, y: 0 });
});
