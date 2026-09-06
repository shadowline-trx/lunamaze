import test from 'node:test';
import assert from 'node:assert/strict';
import { bakeTerrain, terrainNoise } from '../lib/terrain.ts';

test('landscapes are reproducible from a shared seed', async () => {
  const a = await bakeTerrain(27, 64, () => false);
  const b = await bakeTerrain(27, 64, () => false);
  const c = await bakeTerrain(13, 64, () => false);
  assert.deepEqual(a.pixels, b.pixels);
  assert.notDeepEqual(a.pixels, c.pixels);
  assert.equal(a.pixels.length, 64 * 32 * 4);
  assert.ok(new Set(a.pixels).size > 100);
});

test('changing worlds can cancel stale terrain generation', async () => {
  assert.equal(await bakeTerrain(27, 64, () => true), null);
});

test('the continuous noise field has no longitude seam', () => {
  const noise = terrainNoise(27);
  for (const latitude of [-1, -.4, 0, .7, 1]) {
    const r = Math.cos(latitude), y = Math.sin(latitude);
    const left = noise(Math.cos(-Math.PI) * r, y, Math.sin(-Math.PI) * r);
    const right = noise(Math.cos(Math.PI) * r, y, Math.sin(Math.PI) * r);
    assert.ok(Math.abs(left - right) < 1e-12);
  }
});
