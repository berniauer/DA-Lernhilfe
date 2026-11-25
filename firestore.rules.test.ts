import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Security Rules Structural & Dirty Dozen Verification Test Suite.
 * Verifies firestore.rules against firebase-blueprint.json invariants and
 * models the exact rule predicates for all 12 adversarial payloads from security_spec.md.
 */

const RULES_SRC = fs.readFileSync(path.resolve('firestore.rules'), 'utf8');
const BLUEPRINT = JSON.parse(fs.readFileSync(path.resolve('firebase-blueprint.json'), 'utf8'));

const SERVER_TIME = 1764084000000;
const ID_REGEX = new RegExp(BLUEPRINT.entities.UserProfile.properties.uid.pattern);

interface MockAuth {
  uid: string;
  emailVerified: boolean;
}

interface MockDoc {
  [key: string]: unknown;
}

function isValidId(id: unknown): boolean {
  return typeof id === 'string' && id.length >= 1 && id.length <= 128 && ID_REGEX.test(id);
}

function hasExactKeys(data: MockDoc, allowed: string[]): boolean {
  const keys = Object.keys(data);
  return allowed.every((k) => keys.includes(k)) && keys.every((k) => allowed.includes(k));
}

function affectedKeys(incoming: MockDoc, existing: MockDoc): string[] {
  const keys = new Set([...Object.keys(incoming), ...Object.keys(existing)]);
  return [...keys].filter((k) => JSON.stringify(incoming[k]) !== JSON.stringify(existing[k]));
}

function evalUserProfileCreate(auth: MockAuth | null, userId: string, data: MockDoc): boolean {
  if (!auth || !auth.emailVerified) return false;
  if (!isValidId(userId) || auth.uid !== userId) return false;
  if (!hasExactKeys(data, ['uid', 'displayName', 'createdAt', 'updatedAt'])) return false;
  if (!isValidId(data.uid) || data.uid !== auth.uid || data.uid !== userId) return false;
  if (typeof data.displayName !== 'string' || data.displayName.length > 100) return false;
  if (data.createdAt !== SERVER_TIME || data.updatedAt !== SERVER_TIME) return false;
  return true;
}

function evalJourneyWrite(
  mode: 'create' | 'update',
  auth: MockAuth | null,
  userId: string,
  progressId: string,
  parentExists: boolean,
  incoming: MockDoc,
  existing?: MockDoc
): boolean {
  if (!auth || !auth.emailVerified) return false;
  if (!isValidId(userId) || !isValidId(progressId) || progressId !== 'journey') return false;
  if (auth.uid !== userId || !parentExists) return false;
  if (!hasExactKeys(incoming, ['userId', 'stageIndex', 'completedCheckIds', 'createdAt', 'updatedAt'])) {
    return false;
  }
  if (!isValidId(incoming.userId) || incoming.userId !== auth.uid || incoming.userId !== userId) {
    return false;
  }
  if (
    typeof incoming.stageIndex !== 'number' ||
    !Number.isInteger(incoming.stageIndex) ||
    incoming.stageIndex < 0 ||
    incoming.stageIndex > 20
  ) {
    return false;
  }
  if (!Array.isArray(incoming.completedCheckIds) || incoming.completedCheckIds.length > 50) {
    return false;
  }
  if (
    incoming.completedCheckIds.length > 0 &&
    (typeof incoming.completedCheckIds[0] !== 'string' ||
      incoming.completedCheckIds[0].length < 1 ||
      incoming.completedCheckIds[0].length > 64)
  ) {
    return false;
  }
  if (mode === 'create') {
    return incoming.createdAt === SERVER_TIME && incoming.updatedAt === SERVER_TIME;
  }
  if (!existing) return false;
  if (incoming.userId !== existing.userId || incoming.createdAt !== existing.createdAt) return false;
  if (incoming.updatedAt !== SERVER_TIME) return false;
  const diff = affectedKeys(incoming, existing);
  return diff.every((k) => ['stageIndex', 'completedCheckIds', 'updatedAt'].includes(k));
}

function evalQuizItemCreate(
  auth: MockAuth | null,
  userId: string,
  itemId: string,
  parentExists: boolean,
  data: MockDoc
): boolean {
  if (!auth || !auth.emailVerified) return false;
  if (!isValidId(userId) || !isValidId(itemId) || auth.uid !== userId || !parentExists) return false;
  if (
    !hasExactKeys(data, [
      'userId',
      'itemId',
      'rightCount',
      'wrongCount',
      'lastResult',
      'createdAt',
      'updatedAt',
    ])
  ) {
    return false;
  }
  if (data.userId !== auth.uid || data.itemId !== itemId) return false;
  if (
    typeof data.rightCount !== 'number' ||
    !Number.isInteger(data.rightCount) ||
    data.rightCount < 0 ||
    data.rightCount > 10000
  ) {
    return false;
  }
  if (
    typeof data.wrongCount !== 'number' ||
    !Number.isInteger(data.wrongCount) ||
    data.wrongCount < 0 ||
    data.wrongCount > 10000
  ) {
    return false;
  }
  if (data.lastResult !== 0 && data.lastResult !== 1) return false;
  if (data.createdAt !== SERVER_TIME || data.updatedAt !== SERVER_TIME) return false;
  return true;
}

test('firestore.rules enforces all structural Eight Pillars invariants', () => {
  assert.match(RULES_SRC, /rules_version\s*=\s*'2';/);
  assert.match(RULES_SRC, /match \/\{document=\*\*\}\s*\{\s*allow read, write: if false;/);
  assert.match(RULES_SRC, /request\.auth\.token\.email_verified == true/);
  assert.match(RULES_SRC, /hasValidParentUser\(userId\)/);
  assert.match(RULES_SRC, /match \/users\/\{userId\}/);
  assert.match(RULES_SRC, /match \/progress\/\{progressId\}/);
  assert.match(RULES_SRC, /match \/quizItems\/\{itemId\}/);
  assert.match(RULES_SRC, /resource\.data\.userId == request\.auth\.uid/);
  // Verify allow list has no get()/exists() calls
  const listBlocks = RULES_SRC.match(/allow list:[\s\S]*?;/g) || [];
  assert.ok(listBlocks.length >= 3);
  for (const block of listBlocks) {
    assert.doesNotMatch(block, /\b(get|exists)\(/);
  }
});

test('Dirty Dozen #1-5: auth, cross-user PII, unverified email, shadow fields, UID spoof', () => {
  const unauth: MockAuth | null = null;
  const unverified: MockAuth = { uid: 'alice', emailVerified: false };
  const alice: MockAuth = { uid: 'alice', emailVerified: true };

  // #1 Unauthenticated
  assert.equal(
    evalJourneyWrite('create', unauth, 'alice', 'journey', true, {
      userId: 'alice',
      stageIndex: 0,
      completedCheckIds: [],
      createdAt: SERVER_TIME,
      updatedAt: SERVER_TIME,
    }),
    false
  );
  // #2 Cross-user access denied by isOwner(userId)
  assert.equal(
    evalUserProfileCreate({ uid: 'bob', emailVerified: true }, 'alice', {
      uid: 'bob',
      displayName: 'Bob',
      createdAt: SERVER_TIME,
      updatedAt: SERVER_TIME,
    }),
    false
  );
  // #3 Unverified email denied
  assert.equal(
    evalUserProfileCreate(unverified, 'alice', {
      uid: 'alice',
      displayName: 'Alice',
      createdAt: SERVER_TIME,
      updatedAt: SERVER_TIME,
    }),
    false
  );
  // #4 Shadow field injection denied
  assert.equal(
    evalUserProfileCreate(alice, 'alice', {
      uid: 'alice',
      displayName: 'Alice',
      isAdmin: true,
      createdAt: SERVER_TIME,
      updatedAt: SERVER_TIME,
    }),
    false
  );
  // #5 UID spoof denied
  assert.equal(
    evalUserProfileCreate(alice, 'alice', {
      uid: 'bob',
      displayName: 'Alice',
      createdAt: SERVER_TIME,
      updatedAt: SERVER_TIME,
    }),
    false
  );
});

test('Dirty Dozen #6-12: Master Gate, ID poisoning, timestamps, bounds, quiz enum', () => {
  const alice: MockAuth = { uid: 'alice', emailVerified: true };

  // #6 Orphaned write without parent user doc
  assert.equal(
    evalJourneyWrite('create', alice, 'alice', 'journey', false, {
      userId: 'alice',
      stageIndex: 0,
      completedCheckIds: [],
      createdAt: SERVER_TIME,
      updatedAt: SERVER_TIME,
    }),
    false
  );
  // #7 Invalid path ID with colon or excessive length
  assert.equal(
    evalQuizItemCreate(alice, 'alice', '01-Bayes:q0', true, {
      userId: 'alice',
      itemId: '01-Bayes:q0',
      rightCount: 1,
      wrongCount: 0,
      lastResult: 1,
      createdAt: SERVER_TIME,
      updatedAt: SERVER_TIME,
    }),
    false
  );
  assert.equal(isValidId('a'.repeat(129)), false);
  // #8 Forged timestamp on create
  assert.equal(
    evalJourneyWrite('create', alice, 'alice', 'journey', true, {
      userId: 'alice',
      stageIndex: 0,
      completedCheckIds: [],
      createdAt: SERVER_TIME - 5000,
      updatedAt: SERVER_TIME,
    }),
    false
  );
  // #9 Immutable createdAt mutation on update
  const existingJourney: MockDoc = {
    userId: 'alice',
    stageIndex: 0,
    completedCheckIds: [],
    createdAt: SERVER_TIME - 10000,
    updatedAt: SERVER_TIME - 10000,
  };
  assert.equal(
    evalJourneyWrite(
      'update',
      alice,
      'alice',
      'journey',
      true,
      { ...existingJourney, createdAt: SERVER_TIME, updatedAt: SERVER_TIME },
      existingJourney
    ),
    false
  );
  // #10 Bounds overflow & non-string array poisoning
  assert.equal(
    evalJourneyWrite(
      'update',
      alice,
      'alice',
      'journey',
      true,
      { ...existingJourney, stageIndex: 999, updatedAt: SERVER_TIME },
      existingJourney
    ),
    false
  );
  assert.equal(
    evalJourneyWrite(
      'update',
      alice,
      'alice',
      'journey',
      true,
      { ...existingJourney, completedCheckIds: [123], updatedAt: SERVER_TIME },
      existingJourney
    ),
    false
  );
  // #11 Quiz enum / counter tampering
  assert.equal(
    evalQuizItemCreate(alice, 'alice', '01-Bayes__q0', true, {
      userId: 'alice',
      itemId: '01-Bayes__q0',
      rightCount: -1,
      wrongCount: 0,
      lastResult: 2,
      createdAt: SERVER_TIME,
      updatedAt: SERVER_TIME,
    }),
    false
  );
  // #12 Valid legitimate payloads succeed
  assert.equal(
    evalUserProfileCreate(alice, 'alice', {
      uid: 'alice',
      displayName: 'Alice Studentin',
      createdAt: SERVER_TIME,
      updatedAt: SERVER_TIME,
    }),
    true
  );
  assert.equal(
    evalQuizItemCreate(alice, 'alice', '01-Bayes__q0', true, {
      userId: 'alice',
      itemId: '01-Bayes__q0',
      rightCount: 1,
      wrongCount: 0,
      lastResult: 1,
      createdAt: SERVER_TIME,
      updatedAt: SERVER_TIME,
    }),
    true
  );
});
