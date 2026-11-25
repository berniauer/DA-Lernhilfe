import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { resolveQuizPath, wrapHtmlDocument } from './scripts/server-helpers.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';

function loadMetadata() {
  try {
    const raw = fs.readFileSync(path.join(__dirname, 'metadata.json'), 'utf8');
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

export function createApp() {
  const app = express();
  const distDir = path.join(__dirname, 'dist');
  const quizPath = resolveQuizPath(__dirname);
  const metadata = loadMetadata();

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/app/quiz.html', (_req, res, next) => {
    fs.readFile(quizPath, 'utf8', (err, rawHtml) => {
      if (err) return next(err);
      res.status(200).type('text/html; charset=utf-8').send(wrapHtmlDocument(rawHtml, metadata));
    });
  });

  if (fs.existsSync(distDir)) {
    app.use(express.static(distDir));
    app.use((_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    app.use((_req, res, next) => {
      fs.readFile(quizPath, 'utf8', (err, rawHtml) => {
        if (err) return next(err);
        res.status(200).type('text/html; charset=utf-8').send(wrapHtmlDocument(rawHtml, metadata));
      });
    });
  }

  app.use((err, _req, res, _next) => {
    console.error('Server error:', err.message);
    res.status(500).type('text/plain; charset=utf-8').send('Internal Server Error');
  });

  return app;
}

const isEntrypoint =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isEntrypoint) {
  const app = createApp();
  app.listen(PORT, HOST, () => {
    console.log(`DA Klausurtrainer running at http://${HOST}:${PORT}`);
  });
}
