import assert from "node:assert/strict";
import test from "node:test";
import { WaterField } from "../site/water.js";

const field = () => new WaterField(96, 80);
const advance = (water, count) => { for (let i = 0; i < count; i++) water.step(); };
const difference = (a, b) => a.reduce((peak, value, i) => Math.max(peak, Math.abs(value - b[i])), 0);

test("water allocation rejects invalid or oversized grids", () => {
  for (const size of [[0, 80], [8, 7], [NaN, 10], [9.5, 10], [300, 300]]) {
    assert.throws(() => new WaterField(...size), RangeError);
  }
  assert.equal(new WaterField(222, 162).current.length, 35964);
});

test("undisturbed water and stationary pointers stay perfectly still", () => {
  const water = field();
  water.wake(30, 40, 30, 40, .2);
  water.wake(30, 40, 35, 40, 0);
  advance(water, 100);
  assert.equal(water.activity, 0);
  assert.ok(water.current.every(value => value === 0));
  assert.throws(() => water.wake(1, 2, NaN, 4, .2), RangeError);
  assert.throws(() => water.wake(1, 2, 3, 4, -1), RangeError);
});

test("a directional stroke pushes water ahead and pulls it in behind", () => {
  const water = field();
  water.wake(32, 40, 48, 40, .12);
  water.step();
  assert.ok(water.current[40 * 96 + 51] > 0);
  assert.ok(water.current[40 * 96 + 29] < 0);
});

test("reversing motion mirrors the wake instead of reusing an identical ring", () => {
  const right = field(), left = field();
  right.wake(32, 40, 48, 40, .12);
  left.wake(63, 40, 47, 40, .12);
  advance(right, 35);
  advance(left, 35);
  let error = 0;
  for (let y = 0; y < 80; y++) {
    for (let x = 0; x < 96; x++) {
      error = Math.max(error, Math.abs(right.current[y * 96 + x] - left.current[y * 96 + 95 - x]));
    }
  }
  assert.ok(error < .00001, `mirror error ${error}`);
  assert.ok(difference(right.current, left.current) > .01);
});

test("stronger motion generates stronger but bounded disturbance", () => {
  const slow = field(), fast = field();
  slow.wake(35, 40, 39, 40, .02);
  fast.wake(35, 40, 39, 40, .08);
  assert.ok(difference(fast.previous, slow.previous.map(value => value * 4)) < .00001);
  const extreme = field();
  extreme.wake(20, 40, 70, 40, 1000);
  assert.ok(extreme.previous.every(value => Math.abs(value) <= .650001));
});

test("subdividing a stroke preserves its deposited pressure", () => {
  const continuous = field(), sampled = field();
  continuous.wake(24, 40, 40, 40, .08);
  for (let i = 0; i < 22; i++) {
    sampled.wake(24 + i * 16 / 22, 40, 24 + (i + 1) * 16 / 22, 40, .08);
  }
  assert.ok(difference(continuous.previous, sampled.previous) < .00001);
});

test("ripples propagate beyond the brush rather than fading in place", () => {
  const water = field();
  water.wake(43, 40, 48, 40, .1);
  assert.equal(water.previous[60 * 96 + 46], 0);
  advance(water, 45);
  assert.ok(Math.abs(water.current[60 * 96 + 46]) > .0001);
});

test("waves superpose and interfere in the same field", () => {
  const a = field(), b = field(), combined = field();
  a.wake(24, 34, 29, 34, .035);
  b.wake(70, 46, 65, 46, .035);
  combined.wake(24, 34, 29, 34, .035);
  combined.wake(70, 46, 65, 46, .035);
  for (const water of [a, b, combined]) advance(water, 50);
  assert.ok(difference(combined.current, a.current.map((value, i) => value + b.current[i])) < .00001);
});

test("the edge sponge absorbs energy instead of preserving rectangular echoes", () => {
  const absorbed = field(), reflected = field();
  reflected.loss.fill(0);
  for (const water of [absorbed, reflected]) {
    water.wake(66, 40, 78, 40, .18);
    advance(water, 240);
  }
  const energy = water => water.current.reduce((sum, value, i) =>
    sum + value * value + (value - water.previous[i]) ** 2, 0);
  assert.ok(energy(absorbed) < energy(reflected) * .5);
  assert.ok(absorbed.current.slice(0, 96).every(value => value === 0));
});

test("sustained motion remains finite and settles below the idle threshold", () => {
  const water = field();
  let peak = 0;
  for (let i = 0; i < 600; i++) {
    water.wake(48 + 24 * Math.sin(i * .3), 40 + 15 * Math.cos(i * .27),
      48 + 24 * Math.sin((i + 1) * .3), 40 + 15 * Math.cos((i + 1) * .27), .32);
    peak = Math.max(peak, water.step());
  }
  assert.ok(water.current.every(Number.isFinite));
  assert.ok(peak < 8, `peak displacement ${peak}`);
  advance(water, 1200);
  assert.ok(water.activity < .0008, `residual activity ${water.activity}`);
  water.clear();
  assert.equal(water.activity, 0);
  assert.ok(water.current.every(value => value === 0));
  assert.ok(water.previous.every(value => value === 0));
});
