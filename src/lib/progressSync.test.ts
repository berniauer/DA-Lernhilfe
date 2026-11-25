import test from 'node:test';
import assert from 'node:assert/strict';
import {
  toFirestoreQuizItemId,
  fromFirestoreQuizItemId,
  isValidFirestoreId,
  sanitizeDisplayName,
  sanitizeStageIndex,
  sanitizeCompletedCheckIds,
  mergeJourneyState,
  mergeQuizStores,
  classifyAuthError,
  MAX_DISPLAY_NAME_LENGTH,
  MAX_COMPLETED_CHECKS,
} from './progressSync';

test('quiz item ID conversion is Firestore-safe and reversible', () => {
  const localId = '01-Bayes:q12';
  const docId = toFirestoreQuizItemId(localId);
  assert.equal(docId, '01-Bayes__q12');
  assert.equal(isValidFirestoreId(docId), true);
  assert.equal(fromFirestoreQuizItemId(docId), localId);
});

test('sanitization enforces firebase-blueprint.json length and bounds', () => {
  assert.equal(sanitizeDisplayName('  Max Mustermann  '), 'Max Mustermann');
  assert.equal(sanitizeDisplayName('A'.repeat(250)).length, MAX_DISPLAY_NAME_LENGTH);
  assert.equal(sanitizeStageIndex(-5, 10), 0);
  assert.equal(sanitizeStageIndex(99, 10), 9);

  const rawChecks: Record<string, boolean> = {
    'check-01a': true,
    'bad:id': true,
    'check-02a': false,
    'check-01b': true,
  };
  for (let i = 0; i < 60; i++) {
    rawChecks[`extra_${i}`] = true;
  }
  const sanitized = sanitizeCompletedCheckIds(rawChecks);
  assert.equal(sanitized.length, MAX_COMPLETED_CHECKS);
  assert.equal(sanitized.includes('bad:id'), false);
  assert.equal(sanitized.includes('check-02a'), false);
});

test('mergeJourneyState unions checks and preserves furthest stage', () => {
  const local = { stageIndex: 3, completedChecks: { 's1-a': true, 's2-a': true } };
  const remote = { stageIndex: 1, completedChecks: { 's1-a': true, 's1-b': true } };
  const res = mergeJourneyState(local, remote, 10);

  assert.equal(res.needsRemoteWrite, true);
  assert.equal(res.merged.stageIndex, 3);
  assert.deepEqual(res.merged.completedChecks, {
    's1-a': true,
    's1-b': true,
    's2-a': true,
  });

  // When remote already contains everything, no redundant write needed
  const res2 = mergeJourneyState({ stageIndex: 1, completedChecks: { 's1-a': true } }, remote, 10);
  assert.equal(res2.needsRemoteWrite, false);
});

test('mergeQuizStores preserves local guest answers and merges counters', () => {
  const local = {
    '01-Bayes:q0': { r: 2, w: 1, last: 1 as const },
    '02-LinReg:k1': { r: 1, w: 0, last: 1 as const },
  };
  const remote = {
    '01-Bayes:q0': { r: 1, w: 1, last: 0 as const },
    '03-MCMC:q2': { r: 3, w: 0, last: 1 as const },
  };
  const { merged, itemsToUpload } = mergeQuizStores(local, remote);

  assert.deepEqual(merged['01-Bayes:q0'], { r: 2, w: 1, last: 1 });
  assert.deepEqual(merged['02-LinReg:k1'], { r: 1, w: 0, last: 1 });
  assert.deepEqual(merged['03-MCMC:q2'], { r: 3, w: 0, last: 1 });
  assert.deepEqual(itemsToUpload.sort(), ['01-Bayes:q0', '02-LinReg:k1']);
});

test('classifyAuthError returns user-friendly German explanations', () => {
  assert.match(classifyAuthError({ code: 'auth/popup-blocked' }), /Pop-ups/);
  assert.match(classifyAuthError({ code: 'auth/unauthorized-domain' }), /Authorized domains/);
  assert.match(classifyAuthError(new Error('Quota exceeded')), /Kontingent/);
});
