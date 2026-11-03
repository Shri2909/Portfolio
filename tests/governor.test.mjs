import test from 'node:test';
import assert from 'node:assert/strict';
import { createGovernor } from '../src/elev/governorCore.js';

function rig(ids = ['a', 'b', 'c', 'd']) {
  const on = new Set(ids), shedOrder = [], log = [];
  let tier = 0;
  const host = { shedList: () => ids.filter((i) => on.has(i)), restoreList: () => shedOrder.filter((i) => !on.has(i)).reverse(), canTierDown: () => tier < 2 };
  const g = createGovernor();
  const apply = (acts, t) => acts.forEach((a) => {
    log.push({ ...a, t });
    if (a.type === 'shed') { on.delete(a.id); shedOrder.push(a.id); } else if (a.type === 'restore') on.add(a.id); else if (a.type === 'tier-down') tier++;
  });
  const run = (dtF, ms, t0) => { let t = t0; for (const end = t0 + ms; t < end; t += dtF) apply(g.step(dtF, t, host), t); return t; };
  return { g, host, on, log, run, get tier() { return tier; } };
}

test('steady 33 ms: sheds in priority order with doubling cooldown, then thermal tier drop', () => {
  const r = rig(); r.run(34, 40000, 0);
  const sheds = r.log.filter((a) => a.type === 'shed');
  assert.deepEqual(sheds.slice(0, 3).map((a) => a.id), ['a', 'b', 'c']);
  assert.ok(sheds[1].t - sheds[0].t >= 2500 - 40 && sheds[2].t - sheds[1].t >= 5000 - 40, 'cooldown doubles');
  assert.ok(r.log.some((a) => a.type === 'tier-down' && a.thermal), 'three sheds within 30 s drop the tier');
  assert.ok(!r.log.some((a) => a.type === 'restore'));
});

test('a spike train alone does not shed (EWMA stays low)', () => {
  const r = rig(); let t = 0;
  for (let i = 0; i < 2000; i++) { const dt = i % 40 === 0 ? 90 : 16.7; t += dt; r.log.push(...r.g.step(dt, t, r.host)); }
  assert.equal(r.log.filter((a) => a.type === 'shed').length, 0);
});

test('recovery: after 12 s at 12 ms one effect is restored, no sooner', () => {
  const r = rig(); let t = r.run(34, 9000, 0);
  const n = r.log.filter((a) => a.type === 'shed').length; assert.ok(n >= 1);
  const t0 = t; t = r.run(12, 11000, t);
  assert.equal(r.log.filter((a) => a.type === 'restore').length, 0, 'not before 12 s');
  t = r.run(12, 3000, t);
  const rs = r.log.filter((a) => a.type === 'restore'); assert.ok(rs.length >= 1 && rs[0].t - t0 >= 12000);
  assert.equal(rs[0].id, r.log.filter((a) => a.type === 'shed').at(-1).id, 'last shed returns first');
});

test('flapping device: an effect shed again within 8 s of its restore is pinned for good', () => {
  const r = rig(['a']); let t = r.run(34, 8000, 0); assert.equal(r.log.filter((x) => x.type === 'shed').length, 1);
  t = r.run(12, 13000, t); assert.equal(r.log.filter((x) => x.type === 'restore').length, 1);
  t = r.run(34, 6000, t); // slow again, inside 8 s of the restore
  assert.ok(r.g.pinned.has('a'));
  r.run(12, 60000, t);
  assert.equal(r.log.filter((x) => x.type === 'restore').length, 1, 'never restored again');
});

test('saveData / Calm flags block restores', () => {
  const r = rig(); let t = r.run(34, 9000, 0);
  for (const end = t + 30000; t < end; t += 12) r.log.push(...r.g.step(12, t, r.host, { noRestore: true }));
  assert.equal(r.log.filter((a) => a.type === 'restore').length, 0);
});
