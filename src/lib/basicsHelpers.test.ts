import test from 'node:test';
import assert from 'node:assert/strict';
import {
  EVERYDAY_BAYES_SCENARIOS,
  computeEverydayBayes,
  translateProbability,
  countCompletedBasicsModules,
  verifyFirebaseCheckIdBudget,
} from './basicsHelpers';
import { BASICS_MODULES } from '../data/basicsData';

test('all Basics + Journey check IDs are unique, regex-safe, and fit Firestore 50-item cap', () => {
  const report = verifyFirebaseCheckIdBudget();
  assert.equal(report.total, report.uniqueCount, 'All check IDs must be globally unique');
  assert.equal(report.withinCap, true, `Expected <= 50 check IDs, got ${report.uniqueCount}`);
  assert.equal(report.allValidPattern, true, 'All check IDs must match Firestore ID_PATTERN');
  assert.equal(BASICS_MODULES.length, 8);
});

test('everyday Bayes scenarios compute accurate intuitive posteriors', () => {
  const smoke = EVERYDAY_BAYES_SCENARIOS.find((s) => s.id === 'smoke')!;
  const rain = EVERYDAY_BAYES_SCENARIOS.find((s) => s.id === 'rain')!;
  const resSmoke = computeEverydayBayes(smoke);
  const resRain = computeEverydayBayes(rain);

  // 1% * 95% / (1%*95% + 99%*10%) = 0.0095 / 0.1085 = 8.76%
  assert.ok(resSmoke.posteriorPct > 8.5 && resSmoke.posteriorPct < 9.0);
  // 35% * 85% / (35%*85% + 65%*15%) = 0.2975 / 0.395 = 75.3%
  assert.ok(resRain.posteriorPct > 75 && resRain.posteriorPct < 76);
});

test('Odds/Logit translator shows why doubling odds never exceeds 100%', () => {
  const at50 = translateProbability(50, 2);
  assert.equal(Number(at50.odds.toFixed(2)), 1.0);
  assert.equal(Number(at50.logit.toFixed(2)), 0.0);
  assert.ok(Math.abs(at50.shiftedP - 2 / 3) < 0.001);

  const at60 = translateProbability(60, 2);
  assert.equal(Number(at60.shiftedP.toFixed(2)), 0.75);
  assert.ok(at60.naiveWrongP > 1, 'Naive multiplication of probability would exceed 100%');
});

test('countCompletedBasicsModules counts only modules with all checks passed', () => {
  assert.equal(countCompletedBasicsModules({}), 0);
  assert.equal(countCompletedBasicsModules({ 'b01-1': true }), 0);
  assert.equal(countCompletedBasicsModules({ 'b01-1': true, 'b01-2': true }), 1);
  assert.equal(
    countCompletedBasicsModules({ 'b01-1': true, 'b01-2': true, 'c01-1': true }),
    1
  );
});
