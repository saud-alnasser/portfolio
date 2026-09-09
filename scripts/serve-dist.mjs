// Serves dist/ over HTTP for the Playwright tests, which must run against the
// built output and never the live site (.aep/efforts/1-portfolio-site/plan.md,
// "Testing Strategy"). Playwright starts it from playwright.config.ts:
//
//   node scripts/serve-dist.mjs [port]
//
// A path ending in a slash serves its index.html, as GitHub Pages does. The
// port defaults to 4173 and is printed once the server listens, which is what
// Playwright waits for. It exits non-zero with the reason when dist/ has not
// been built, so a missing build reads as that rather than as every test
// failing to connect.

import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const port = Number(process.argv[2] ?? process.env.PORT ?? 4173);

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.ttf': 'font/ttf',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

try {
  await stat(path.join(dist, 'index.html'));
} catch {
  console.error('serve-dist: no-build: dist/ has no index.html; run `pnpm build` first');
  process.exit(1);
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, 'http://localhost');
  let pathname = decodeURIComponent(url.pathname);
  if (pathname.endsWith('/')) pathname += 'index.html';
  const file = path.join(dist, pathname);
  if (!file.startsWith(dist + path.sep)) {
    response.writeHead(403).end();
    return;
  }
  try {
    const info = await stat(file);
    if (!info.isFile()) throw new Error('not a file');
  } catch {
    response.writeHead(404).end();
    return;
  }
  response.writeHead(200, { 'content-type': types[path.extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(response);
});

server.listen(port, '127.0.0.1', () => {
  console.log(`serve-dist: serving dist/ at http://127.0.0.1:${port}/`);
});
