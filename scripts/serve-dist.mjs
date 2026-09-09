// A static server over dist/, for anything that must run against the built
// output and never the live site: the Playwright tests start it from
// playwright.config.ts, and the PDF render imports `serve()` and closes it
// when done.
//
//   node scripts/serve-dist.mjs [port]
//
// A path ending in a slash serves its index.html, as GitHub Pages does. Run
// directly, the port defaults to 4173 and is printed once the server listens.
// It exits non-zero with the reason when dist/ has not been built, so a
// missing build reads as that rather than as every test failing to connect.

import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

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

// Serves `directory` on 127.0.0.1. Port 0 takes an ephemeral one. Resolves to
// the origin and a `close()`; throws `no-build` when the directory has no
// index.html.
export async function serve(directory, port = 0) {
  try {
    await stat(path.join(directory, 'index.html'));
  } catch {
    throw new Error(`no-build: ${path.relative(root, directory) || directory} has no index.html; run \`pnpm build\` first`);
  }

  const server = http.createServer(async (request, response) => {
    const url = new URL(request.url, 'http://localhost');
    let pathname = decodeURIComponent(url.pathname);
    if (pathname.endsWith('/')) pathname += 'index.html';
    const file = path.join(directory, pathname);
    if (!file.startsWith(directory + path.sep)) {
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

  await new Promise((resolve) => server.listen(port, '127.0.0.1', resolve));
  const { port: bound } = server.address();
  return { origin: `http://127.0.0.1:${bound}`, close: () => new Promise((resolve) => server.close(resolve)) };
}

const runDirectly = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (runDirectly) {
  const port = Number(process.argv[2] ?? process.env.PORT ?? 4173);
  try {
    const { origin } = await serve(dist, port);
    console.log(`serve-dist: serving dist/ at ${origin}/`);
  } catch (error) {
    console.error(`serve-dist: ${error.message}`);
    process.exit(1);
  }
}
