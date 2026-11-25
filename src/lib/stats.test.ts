import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyOddsRatio,
  classifyCohenF2,
  computeBayesTest,
  computeBrierSkill,
  computeCohenF2,
  computeInteractionEffect,
  computeOptimalCutoff,
  computeOptimalQuantile,
  computeQuadraticVertex,
  evaluateCutoff,
  evaluateLooDifference,
  invLogit,
  logit,
  normQuantile,
  probToOdds,
} from './stats';

test('Bayes test matches exam basisrate example (1% defect, 90% sens, 5% FPR -> ~15.4%)', () => {
  const res = computeBayesTest(0.01, 0.9, 0.05, 1000);
  assert.ok(Math.abs(res.posterior - 0.1538) < 0.002);
  assert.equal(res.tp, 9);
  assert.equal(res.fp, 50);
});

test('Logit and Odds conversions match Beispielklausur WS26/27', () => {
  // Logit -0.43 -> p ≈ 0.394
  assert.ok(Math.abs(invLogit(-0.43) - 0.3941) < 0.002);
  assert.ok(Math.abs(logit(0.5)) < 1e-6);
  assert.ok(Math.abs(probToOdds(0.2) - 0.25) < 1e-6);
  // Day 10% + Night OR 4.1 -> ~31.3%, NOT 41%
  const nightP = applyOddsRatio(0.1, 4.1);
  assert.ok(Math.abs(nightP - 0.313) < 0.005);
});

test('Cohen f2 and classification match cheatsheet benchmarks', () => {
  const f2 = computeCohenF2(0.6, 0.55);
  assert.ok(Math.abs(f2 - 0.125) < 1e-6);
  assert.equal(classifyCohenF2(0.01), 'vernachlässigbar');
  assert.equal(classifyCohenF2(0.05), 'klein');
  assert.equal(classifyCohenF2(0.2), 'mittel');
  assert.equal(classifyCohenF2(0.4), 'groß');
});

test('Quadratic vertex matches exposure_time example (c=1.05, b1=-5.48, b2=42 -> ~1.115)', () => {
  const vertex = computeQuadraticVertex(1.05, -5.48, 42);
  assert.ok(Math.abs(vertex - 1.1152) < 0.002);
});

test('Interaction slope and difference match Waermepumpen Probeklausur B', () => {
  // temp5 = -1.58, daemmungneu = -15.25, temp5:daemmungneu = +1.05, ref = 5°C
  const at0C = computeInteractionEffect(-1.58, -15.25, 1.05, 0, 5);
  assert.ok(Math.abs(at0C.groupSlope - -0.53) < 1e-6);
  assert.ok(Math.abs(at0C.groupDiffAtX - -20.5) < 1e-6);
});

test('Optimal quantile and cutoff formulas match cheatsheet', () => {
  assert.equal(computeOptimalQuantile(3, 1), 0.75);
  assert.ok(Math.abs(computeOptimalCutoff(30, 300) - 30 / 330) < 1e-6);
  assert.ok(Math.abs(normQuantile(0.975) - 1.96) < 0.01);
});

test('Brier skill and LOO 2*se rule match Beispielklausur WS26/27', () => {
  const brier = computeBrierSkill(0.109, 0.25);
  assert.equal(brier.brierNull, 0.1875);
  assert.ok(Math.abs(brier.skill - 0.4187) < 0.005);

  const convincing = evaluateLooDifference(-222.8, 24.0);
  assert.equal(convincing.isConvincing, true);
  assert.ok(convincing.zRatio > 9);

  const tie = evaluateLooDifference(-3.1, 2.5);
  assert.equal(tie.isConvincing, false);
});

test('Cutoff evaluation reflects Klausur tradeoff at cutoff 0.30', () => {
  const at030 = evaluateCutoff(0.3, 30, 300);
  assert.ok(at030.tpr >= 0.75, `Expected TPR >= 0.75 at cutoff 0.30, got ${at030.tpr}`);
  assert.ok(at030.fpr <= 0.16, `Expected FPR <= 0.16 at cutoff 0.30, got ${at030.fpr}`);

  const at050 = evaluateCutoff(0.5, 30, 300);
  assert.ok(at050.tpr < at030.tpr);
  assert.ok(at050.fpr < at030.fpr);
});
