import test from 'node:test';
import assert from 'node:assert/strict';
import { dragRotation, clampZoom, MAX_ZOOM } from '../lib/orbit.ts';
// Invert the shader's world-from-view transform for a fixed surface landmark.
function project(p, a, b) {
  const x = Math.cos(a) * p[0] - Math.sin(a) * p[2];
  const z = Math.sin(a) * p[0] + Math.cos(a) * p[2];
  return [x, -(Math.cos(b) * p[1] + Math.sin(b) * z)];
}
test('visible surface follows left, right, up and down drags', () => {
  const a = 0.35,
    b = -0.18;
  const landmark = [
    Math.sin(a) * Math.cos(b),
    -Math.sin(b),
    Math.cos(a) * Math.cos(b),
  ];
  for (const [dx, dy] of [
    [-30, 0],
    [30, 0],
    [0, -30],
    [0, 30],
  ]) {
    const next = dragRotation(a, b, dx, dy, 400);
    const screen = project(landmark, next.x, next.y);
    if (dx) assert.equal(Math.sign(screen[0]), Math.sign(dx));
    if (dy) assert.equal(Math.sign(screen[1]), Math.sign(dy));
  }
});
test('extreme zoom retains the entire globe and atmospheric margin', () => {
  assert.equal(clampZoom(100), MAX_ZOOM);
  assert.ok(MAX_ZOOM * 0.79 < 0.93);
  assert.ok(clampZoom(-100) > 0);
});
