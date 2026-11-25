import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { escapeAttr, resolveQuizPath, wrapHtmlDocument } from './server-helpers.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

test('escapeAttr escapes special HTML attribute characters', () => {
  assert.equal(escapeAttr('A & "B" <C>'), 'A &amp; &quot;B&quot; &lt;C&gt;');
});

test('wrapHtmlDocument wraps quiz fragment into a full UTF-8 HTML5 document', () => {
  const fragment = '<title>DA Klausurtrainer</title>\n<style>body{}</style>\n<div class="wrap">Hi</div>\n<script></script>';
  const doc = wrapHtmlDocument(fragment, {
    name: 'DA Klausurtrainer',
    description: 'Bayes Quiz',
  });

  assert.match(doc, /^<!DOCTYPE html>/);
  assert.match(doc, /<html lang="de">/);
  assert.match(doc, /<meta charset="utf-8">/);
  assert.match(doc, /<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">/);
  assert.match(doc, /<meta name="description" content="Bayes Quiz">/);
  assert.match(doc, /<meta property="og:title" content="DA Klausurtrainer">/);
  assert.match(doc, /<meta property="og:description" content="Bayes Quiz">/);
  assert.match(doc, /<\/head>\n<body>\n<div class="wrap">Hi<\/div>/);
});

test('wrapHtmlDocument leaves already-complete HTML5 documents unchanged', () => {
  const existing = '<!DOCTYPE html><html><head></head><body>OK</body></html>';
  assert.equal(wrapHtmlDocument(existing), existing);
});

test('app/quiz.html exists and wraps cleanly with embedded quiz data', () => {
  const quizPath = resolveQuizPath(ROOT);
  const raw = fs.readFileSync(quizPath, 'utf8');
  const wrapped = wrapHtmlDocument(raw);

  assert.match(wrapped, /<!DOCTYPE html>/);
  assert.match(wrapped, /const DATA = \[\{"id":/);
  assert.match(wrapped, /<title>DA Klausurtrainer<\/title>/);
});
