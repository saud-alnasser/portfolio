// Renders the CV page of each language from the built site to a PDF. Run
// after `pnpm build`:
//
//   pnpm render:pdf
//
// It serves dist/ over a local HTTP server, because the built pages reference
// their stylesheet and fonts by absolute path and a file URL cannot resolve
// those, opens /<locale>/cv/ in Playwright's Chromium, waits for the fonts and
// the network to settle, and writes dist/cv.<locale>.pdf. Print media is what
// page.pdf() uses by default, so the print stylesheet in src/styles/global.css
// is what the PDF shows. Any page that fails to load, any font that fails to
// arrive, and any file that does not appear afterwards exits non-zero with the
// reason named, so CI reports what went wrong rather than uploading a site
// with a broken download.

import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const locales = ['en', 'ar'];

// The media types the CV page requests. Anything else is served as bytes,
// which is fine for a download the page does not depend on.
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
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

class RenderFailure extends Error {
  constructor(reason, message) {
    super(message);
    this.reason = reason;
  }
}

// A static server over dist/ on an ephemeral port. A path ending in a slash
// serves its index.html, as Pages does for the built site.
async function serve(directory) {
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
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  return { origin: `http://127.0.0.1:${port}`, close: () => new Promise((resolve) => server.close(resolve)) };
}

// One page to one file. The page is loaded with the network idle so every
// stylesheet and font request has completed, then the document's font set is
// awaited and checked, because a face that did not load prints as boxes or in
// a fallback that does not shape Arabic, and Chromium would not say so.
async function render(browser, origin, locale) {
  const route = `/${locale}/cv/`;
  const file = path.join(dist, `cv.${locale}.pdf`);
  const page = await browser.newPage();
  let fonts;
  try {
    const response = await page.goto(origin + route, { waitUntil: 'networkidle' });
    if (!response || !response.ok()) {
      throw new RenderFailure('page-not-loaded', `${route} answered ${response ? response.status() : 'nothing'}`);
    }
    fonts = await page.evaluate(async () => {
      await document.fonts.ready;
      return [...document.fonts].map((face) => ({ family: face.family, weight: face.weight, status: face.status }));
    });
    const failed = fonts.filter((face) => face.status === 'error');
    if (failed.length > 0) {
      const names = failed.map((face) => `${face.family} ${face.weight}`).join(', ');
      throw new RenderFailure('font-not-loaded', `${route}: ${names} failed to load`);
    }
    await page.pdf({ path: file, format: 'A4', printBackground: false });
  } finally {
    await page.close();
  }

  let size;
  try {
    size = (await stat(file)).size;
  } catch {
    throw new RenderFailure('file-not-written', `${path.relative(root, file)} was not written`);
  }
  if (size === 0) {
    throw new RenderFailure('file-not-written', `${path.relative(root, file)} is empty`);
  }
  const loaded = fonts.filter((face) => face.status === 'loaded').map((face) => `${face.family} ${face.weight}`);
  return `${path.relative(root, file)}: ${size} bytes${loaded.length > 0 ? `, fonts ${loaded.join(', ')}` : ''}`;
}

try {
  await stat(path.join(dist, 'index.html'));
} catch {
  console.error('render-pdf: no-build: dist/ has no index.html; run `pnpm build` first');
  process.exit(1);
}

const server = await serve(dist);
const browser = await chromium.launch();
try {
  for (const locale of locales) {
    console.log(await render(browser, server.origin, locale));
  }
} catch (error) {
  if (error instanceof RenderFailure) {
    console.error(`render-pdf: ${error.reason}: ${error.message}`);
  } else {
    console.error(`render-pdf: unexpected: ${error.stack ?? error}`);
  }
  process.exitCode = 1;
} finally {
  await browser.close();
  await server.close();
}
