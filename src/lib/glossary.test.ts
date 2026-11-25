import test from 'node:test';
import assert from 'node:assert/strict';
import { findGlossaryEntry, GLOSSARY_ENTRIES, tokenizeWithGlossary } from './glossary';

test('glossary contains core exam terms with beginner explanations', () => {
  assert.ok(GLOSSARY_ENTRIES.length >= 45);
  const orEntry = findGlossaryEntry('odds-ratio');
  assert.ok(orEntry);
  assert.match(orEntry?.trap ?? '', /Wahrscheinlichkeit/);
});

test('tokenizer prefers longest match (posterior_predict before Posterior, Odds-Ratio before Odds)', () => {
  const segments = tokenizeWithGlossary(
    'Nutze posterior_predict statt posterior_epred, und verwechsle Odds-Ratio nicht mit Odds.'
  );
  const matchedTerms = segments.filter((s) => s.type === 'term').map((s) => s.content);
  assert.deepEqual(matchedTerms, ['posterior_predict', 'posterior_epred', 'Odds-Ratio', 'Odds']);
});

test('tokenizer respects word boundaries and does not match inside German words', () => {
  const segments = tokenizeWithGlossary('Dort oder morgen vor Ort gibt es keine Priorität.');
  const matchedTerms = segments.filter((s) => s.type === 'term').map((s) => s.content);
  assert.deepEqual(matchedTerms, []);
});

test('tokenizer recognizes short uppercase OR and unicode f²', () => {
  const segments = tokenizeWithGlossary('Die OR liegt bei 4.1 und f² beträgt 0.25.');
  const matched = segments
    .filter((s) => s.type === 'term')
    .map((s) => [s.content, s.entry?.id]);
  assert.deepEqual(matched, [
    ['OR', 'odds-ratio'],
    ['f²', 'f2'],
  ]);
});
