import path from 'node:path';

const DEFAULT_META = {
  name: 'DA Klausurtrainer',
  description:
    'Interaktiver Klausurtrainer für Datenanalyse (Bayes-Regression mit R, stan_glm, logit, LOO, daatools) mit Multiple-Choice-Fragen, Karteikarten und Fehlerwiederholung.',
};

/**
 * Escapes text for safe insertion into HTML attribute values.
 * @param {string} value
 * @returns {string}
 */
export function escapeAttr(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

/**
 * Wraps the standalone app/quiz.html fragment in a standards-compliant HTML5
 * document with UTF-8 charset, viewport, and OpenGraph metadata while leaving
 * already-complete HTML documents untouched.
 * @param {string} rawHtml
 * @param {{ name?: string, description?: string }} [meta]
 * @returns {string}
 */
export function wrapHtmlDocument(rawHtml, meta = DEFAULT_META) {
  const html = String(rawHtml ?? '');
  if (/^\s*<!doctype\s+html/i.test(html)) {
    return html;
  }

  const title = escapeAttr(meta?.name || DEFAULT_META.name);
  const description = escapeAttr(meta?.description || DEFAULT_META.description);

  const headTags = [
    '<!DOCTYPE html>',
    '<html lang="de">',
    '<head>',
    '  <meta charset="utf-8">',
    '  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">',
    `  <meta name="description" content="${description}">`,
    `  <meta property="og:title" content="${title}">`,
    `  <meta property="og:description" content="${description}">`,
  ].join('\n');

  const bodyStartMatch = html.match(/<div\s+class="wrap"/i);
  if (!bodyStartMatch || bodyStartMatch.index === undefined) {
    return `${headTags}\n</head>\n<body>\n${html}\n</body>\n</html>\n`;
  }

  const headFragment = html.slice(0, bodyStartMatch.index).trim();
  const bodyFragment = html.slice(bodyStartMatch.index).trim();

  return `${headTags}\n${headFragment}\n</head>\n<body>\n${bodyFragment}\n</body>\n</html>\n`;
}

/**
 * Resolves the absolute path to app/quiz.html relative to the project root.
 * @param {string} rootDir
 * @returns {string}
 */
export function resolveQuizPath(rootDir) {
  return path.join(rootDir, 'app', 'quiz.html');
}
