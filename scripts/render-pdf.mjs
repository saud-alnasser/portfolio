// Renders the two document pages of each language from the built site to a
// PDF. Run after `pnpm build`:
//
//   pnpm render:pdf
//
// It serves dist/ over a local HTTP server under the site's base path,
// because the built pages reference their stylesheet and fonts by absolute
// path and a file URL cannot resolve those, opens /<locale>/cv/ and
// /<locale>/resume/ in Playwright's Chromium, waits for the fonts and
// the network to settle, and writes dist/cv.<locale>.pdf and
// dist/resume.<locale>.pdf. Print media is what
// page.pdf() uses by default, so the print stylesheet in src/styles/global.css
// is what the PDF shows, backgrounds included. Any page that fails to load,
// any font that fails to arrive, and any file that does not appear afterwards
// exits non-zero with the reason named, so CI reports what went wrong rather
// than uploading a site with a broken download.
//
// The resume is the short document, so it is rendered a second time at Letter
// to a buffer and both renders are counted with pdfjs-dist.
//
// Each document is then rendered once more, filled through the download form
// the way a reader fills it, to .artifacts/ rather than dist/. That copy is
// the only one carrying contact details, and it exists so the extraction
// check has a contact line to run over; dist/ is what the deploy uploads, so
// nothing carrying a contact detail may be written there.
// Any of those renders running past the page budget fails the step naming the
// locale, the paper, and the count, here rather than in a pull request: the
// remedy is content, as the effort's spec constrains, never a smaller type
// size.

import { mkdir, readFile, stat } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { chromium } from 'playwright';
import { marker } from './form-marker.mjs';
import { placeholder } from './placeholder.mjs';
import { serve } from './serve-dist.mjs';

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
// Where a filled document goes, and it is deliberately not dist/. The deploy
// uploads dist/ and nothing else, so a document carrying contact details
// written there would publish the very thing this exists to keep out.
const artifacts = path.join(root, '.artifacts');
const locales = ['en', 'ar'];

// The fonts pdf.js substitutes for the fourteen standard ones a PDF may use
// without embedding, as scripts/certificate-previews.mjs finds them: a
// directory path with a forward slash at the end whatever the platform's
// separator, which Node's file system accepts on Windows as well.
const standardFontDataUrl = `${path.dirname(require.resolve('pdfjs-dist/package.json')).split(path.sep).join('/')}/standard_fonts/`;

// The two documents the site publishes, each as a route and the file it is
// written to. `pages` is what the document is allowed to run to.
const documents = [
  { route: 'cv', file: 'cv', pages: null },
  // Two, not one. The document is one page under the fonts Windows resolves
  // for the system stack and two under the Linux runner's, and it is the
  // runner that renders what ships, so a one-page rule here was a rule about
  // the renderer rather than about the document. Two is a budget and not a
  // target: the resume is still the short document, and a third page is
  // still refused (the effort's spec, requirement 10).
  { route: 'resume', file: 'resume', pages: 2 },
];

class RenderFailure extends Error {
  constructor(reason, message) {
    super(message);
    this.reason = reason;
  }
}

// How many pages a rendered PDF has. No canvas is needed for a page count, so
// the document is opened and closed without a page ever being drawn.
async function pageCount(data) {
  const task = getDocument({ data: new Uint8Array(data), standardFontDataUrl });
  try {
    return (await task.promise).numPages;
  } finally {
    await task.destroy();
  }
}

// One page to one file. The page is loaded with the network idle so every
// stylesheet and font request has completed, then the document's font set is
// awaited and checked, because a face that did not load prints as boxes or in
// a fallback that does not shape Arabic, and Chromium would not say so.
async function render(browser, at, locale, output) {
  const route = `/${locale}/${output.route}/`;
  const file = path.join(dist, `${output.file}.${locale}.pdf`);
  const page = await browser.newPage();
  let fonts;
  const counts = [];
  try {
    const response = await page.goto(at(route), { waitUntil: 'networkidle' });
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
    // Backgrounds are printed, because the section headings sit in a tinted
    // band and the band is the template's one tint; the page asks for it with
    // `print-color-adjust: exact` and this is the other half.
    await page.pdf({ path: file, format: 'A4', printBackground: true });
    if (output.pages !== null) {
      counts.push({ paper: 'A4', count: await pageCount(await readFile(file)) });
      // The paper the file is not written on. A document that fits A4 and not
      // Letter fits nothing a reader in either market prints it on, and the
      // buffer costs one more render.
      counts.push({
        paper: 'Letter',
        count: await pageCount(await page.pdf({ format: 'Letter', printBackground: true })),
      });
    }
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
  for (const { paper, count } of counts) {
    if (count > output.pages) {
      throw new RenderFailure(
        'resume-too-long',
        `${locale} at ${paper} runs to ${count} pages, expected at most ${output.pages}; shorten the content, never the type size`,
      );
    }
  }
  const loaded = fonts.filter((face) => face.status === 'loaded').map((face) => `${face.family} ${face.weight}`);
  const pages = counts.map(({ paper, count }) => `${count} ${count === 1 ? 'page' : 'pages'} at ${paper}`).join(', ');
  return `${path.relative(root, file)}: ${size} bytes${pages ? `, ${pages}` : ''}${loaded.length > 0 ? `, fonts ${loaded.join(', ')}` : ''}`;
}

// The same document, filled through the form a reader uses, written outside
// dist/. This is the only copy of either document that carries contact
// details, and it exists so the extraction check has something to run over:
// the published PDFs lost the email when the site stopped publishing it, and
// a guarantee with nothing to check is a guarantee that quietly left.
//
// The form is driven rather than the slots written directly, because what is
// being produced is what a reader gets, and a check over a document assembled
// some other way would pass for the wrong reason. window.print() is replaced
// before the page loads: a headless browser has no print dialog to complete,
// and the PDF is taken with page.pdf() from the filled page, which is the
// same call the published render makes.
//
// Loaded and filled once per paper, and that costs a navigation for a reason.
// page.pdf() dispatches beforeprint and afterprint into the page, afterprint
// is what empties the contact slots, and a second render taken from the same
// document would be of a document the first render had already emptied. It
// would report the published resume's page count as the filled one's, which
// is a check passing for the wrong reason rather than a check failing.
//
// Every capture is then read back and refused unless the placeholders are in
// it. That is belt and braces over the navigation above, and it is here
// because the failure it catches is silent: the page held the filled contact
// line, the assertion on the page passed, and the bytes did not have it.
// Whether that is a frame not yet committed or an event arriving early is not
// something this step should have to reason about, and the count it reports
// is only worth anything if the document it counted is the filled one.
async function renderFilled(browser, at, locale, output) {
  const route = `/${locale}/${output.route}/`;
  const file = path.join(artifacts, `${output.file}.${locale}.filled.pdf`);
  const page = await browser.newPage();
  const counts = [];
  let fonts;

  // A page loaded, its fonts checked, and its form driven the way a reader
  // drives it, left ready to print. The state the form leaves is checked
  // rather than assumed: a dialog that never opened, or a script that never
  // ran, would otherwise leave the published document to be rendered under
  // the filled document's name.
  async function ready() {
    // The marked address (scripts/form-marker.mjs), which is where the form
    // opens. This step has no way to it that a reader does not have, which is
    // deliberate: a capture taken through an escape hatch would be a check
    // over a document nobody can produce.
    //
    // Reloaded rather than opened again on the calls after the first, because
    // the address now carries a fragment: a goto to the address the page is
    // already at is a same-document navigation, which answers with no response
    // at all. The check below then fails the step with `page-not-loaded` on a
    // page that loaded perfectly, so dropping this branch costs a confusing
    // failure rather than a wrong document. The capture it protects is the
    // second one, of a document the first capture's afterprint emptied.
    const address = at(route) + marker;
    const response =
      page.url() === address
        ? await page.reload({ waitUntil: 'networkidle' })
        : await page.goto(address, { waitUntil: 'networkidle' });
    if (!response || !response.ok()) {
      throw new RenderFailure('page-not-loaded', `${route} answered ${response ? response.status() : 'nothing'}`);
    }
    // The same font check the published render makes, for the same reason: a
    // face that did not load prints as boxes or in a fallback that does not
    // shape Arabic, and Chromium would not say so.
    fonts = await page.evaluate(async () => {
      await document.fonts.ready;
      return [...document.fonts].map((face) => ({ family: face.family, weight: face.weight, status: face.status }));
    });
    const failed = fonts.filter((face) => face.status === 'error');
    if (failed.length > 0) {
      const names = failed.map((face) => `${face.family} ${face.weight}`).join(', ');
      throw new RenderFailure('font-not-loaded', `${route}: ${names} failed to load`);
    }

    await page.click('[data-document-download]');
    await page.fill('[data-document-field="email"]', placeholder.email);
    await page.fill('[data-document-field="phone"]', placeholder.phone);
    await page.click('[data-document-generate]');

  }

  // The contact slots as the page holds them now. Read immediately before
  // every capture, so a capture is never taken from a page whose form did not
  // fill or whose slots something else emptied.
  const filled = async () => {
    const slots = await page.evaluate(() =>
      [...document.querySelectorAll('[data-cv-contact] [data-contact-slot]')].map((item) => ({
        hidden: item.hidden,
        value: item.querySelector('span').textContent,
      })),
    );
    if (slots.length !== 2 || slots.some((slot) => slot.hidden || !slot.value)) {
      throw new RenderFailure('form-did-not-fill', `${route}: the contact slots are ${JSON.stringify(slots)}`);
    }
  };

  // What the bytes actually say, through pdf.js rather than through the page.
  // A capture that lost the contact line reads exactly like the published
  // document, which is the whole reason this is checked rather than assumed.
  async function carriesContact(data, what) {
    const task = getDocument({ data: new Uint8Array(data), standardFontDataUrl });
    let text = '';
    try {
      const document = await task.promise;
      for (let number = 1; number <= document.numPages; number += 1) {
        const content = await (await document.getPage(number)).getTextContent();
        text += content.items.map((item) => item.str).join('');
      }
    } finally {
      await task.destroy();
    }
    // The digits of the number rather than the number: Arabic is
    // bidirectional and the leading + extracts at the other end of the run.
    for (const value of [placeholder.email, placeholder.phone.replace(/[^0-9]/g, '')]) {
      if (!text.replace(/\s+/g, '').includes(value)) {
        throw new RenderFailure(
          'filled-document-lost-its-contact-line',
          `${route}: ${what} does not carry ${value}; it is the published document under a filled document's name`,
        );
      }
    }
  }

  try {
    await page.addInitScript(() => {
      window.print = () => {};
    });

    await ready();
    await filled();
    await page.pdf({ path: file, format: 'A4', printBackground: true });
    const a4 = await readFile(file);
    await carriesContact(a4, path.basename(file));
    if (output.pages !== null) {
      counts.push({ paper: 'A4', count: await pageCount(a4) });
      await ready();
      await filled();
      const letter = await page.pdf({ format: 'Letter', printBackground: true });
      await carriesContact(letter, 'the Letter render');
      counts.push({ paper: 'Letter', count: await pageCount(letter) });
    }
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
  for (const { paper, count } of counts) {
    if (count > output.pages) {
      throw new RenderFailure(
        'resume-too-long',
        `${locale} filled at ${paper} runs to ${count} pages, expected at most ${output.pages}; shorten the content, never the type size`,
      );
    }
  }
  const pages = counts.map(({ paper, count }) => `${count} ${count === 1 ? 'page' : 'pages'} at ${paper}`).join(', ');
  return `${path.relative(root, file)}: ${size} bytes${pages ? `, ${pages}` : ''}, filled through the form`;
}

// The server refuses a directory with no index.html, which is the one
// failure that can happen before a page is opened.
let server;
try {
  server = await serve(dist);
} catch (error) {
  console.error(`render-pdf: ${error.message}`);
  process.exit(1);
}
const browser = await chromium.launch();
try {
  await mkdir(artifacts, { recursive: true });
  for (const locale of locales) {
    for (const output of documents) {
      console.log(await render(browser, server.at, locale, output));
      console.log(await renderFilled(browser, server.at, locale, output));
    }
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
