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
// Every document is then rendered again with the browser's print header and
// footer switched on, which is where a reader's own print dialog starts and
// where the document a reader generates through the download form therefore
// comes from. The resume must carry none of it and the CV must carry all of
// it; the second half is the control, without which the first would pass on a
// renderer that had quietly stopped drawing furniture at all.
//
// Each document is then rendered once more, filled through the download form
// the way a reader fills it, to .artifacts/ rather than dist/. That copy is
// the only one carrying contact details, and it exists so the extraction
// check has a contact line to run over; dist/ is what the deploy uploads, so
// nothing carrying a contact detail may be written there.
// Any of those renders running past the page budget fails the step naming the
// locale, the paper, and the count, here rather than in a pull request. So
// does a resume that fits its one page by less than 10mm at Letter, which is
// the near miss a page count cannot see and the one that widened the budget on
// 2026-09-10. Every resume render reports how much of its last page is unused,
// so the number is in the log rather than only in a failure. The remedy for
// either refusal is content, as the effort's spec constrains, never a smaller
// type size.

import { mkdir, readFile, stat } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCanvas } from '@napi-rs/canvas';
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
// written to. `pages` is what the document is allowed to run to, and
// `furniture` is whether the browser's print header and footer belong on it.
const documents = [
  // The CV keeps the furniture, which is the mechanism rather than a choice:
  // Chrome draws it in the paper margin, a document that breaks across pages
  // needs that margin on every one of them, and the CV runs to five. It is
  // therefore the control the resume's half of the check is read against.
  { route: 'cv', file: 'cv', pages: null, furniture: true },
  // One. It was two between 2026-09-10 and 2026-09-11, because the document
  // was one page under the fonts Windows resolves for the system stack and two
  // under the Linux runner's, and the runner renders what ships. Widening the
  // budget made the rule true and made the document a two-page short resume,
  // which is the one thing a short resume may not be, so this effort cut the
  // content instead and put the budget back.
  //
  // What makes one page hold this time is the floor beside it rather than the
  // count: a page count says "one page" on both sides of a near miss, and a
  // near miss is exactly what went wrong before.
  { route: 'resume', file: 'resume', pages: 1, furniture: false },
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

// The white space the resume's page box gives up and its article carries
// instead: `.cv-compact { padding: 10mm }` in src/styles/global.css. The
// headroom below is measured against the content box rather than the paper,
// so this has to come out of the distance a text run sits at. Written here
// with where it comes from, because the two have to move together: a document
// whose padding changed and whose constant did not would report headroom it
// does not have.
const PAGE_PADDING_MM = 10;

// The one number a page count cannot see: how much of the last page is still
// empty, in millimetres of the content box.
//
// This is the failure that widened the budget to two pages on 2026-09-10. The
// English resume cleared Letter by about 16 pixels on a developer's machine
// and took a second page on the Linux runner, because the system font stack
// resolves to different faces on the two and Saud has twice declined to bundle
// a print face. A page count says "one page" on both sides of that and says
// nothing at all about which side of it the document is standing on.
//
// It measures ink, by drawing the page and finding the lowest row that is not
// paper. The obvious cheaper measurement is the lowest text run's y from
// `getTextContent`, and it is wrong: that y is the run's **baseline**, and a
// descender, the rest of the line box, and any margin under it all sit below
// the baseline. The bias is font-dependent and it is not even signed the same
// way in both languages, so it cannot be corrected with a constant. Measured
// on 2026-09-11: the English resume at Letter reported 10.6mm of free height
// from baselines and had 9.8mm of it, which is **under this floor**. The one
// number that exists to stop 2026-09-10 from happening again was passing the
// document it was written for by about a descender.
//
// Drawn at three times the PDF's own scale, which puts a millimetre at about
// 17 rows, and anything that is not within a few levels of white counts as
// ink. Backgrounds are printed, so the page itself is white and there is no
// transparent-versus-white ambiguity to resolve.
const INK = 250;
const INK_SCALE = 3;

// How much content is on the last page, in millimetres of ink from its
// topmost row to its lowest. The mirror of the measurement below, and it
// exists for the failure rather than for the success: a document that runs
// over says so with a page count, and a page count does not say by how much.
//
// Without it the remedy for an overrun is guesswork, and the machine that
// decides is a CI runner rather than the one the cutting is done on: the
// English resume is one page here with 15mm to spare and two on the runner,
// because the system font stack resolves to different faces. So the failure
// carries the number the next cut has to beat.
async function overflowHeight(data) {
  const rows = await inkRows(data);
  if (rows === null) return null;
  return ((rows.bottom - rows.top) / INK_SCALE / 72) * 25.4;
}

// The topmost and lowest rows of the last page that are not paper, in device
// pixels of the render below. Both measurements above are a subtraction away
// from these, so the page is drawn once and read twice.
async function inkRows(data) {
  const task = getDocument({ data: new Uint8Array(data), standardFontDataUrl });
  try {
    const document = await task.promise;
    const page = await document.getPage(document.numPages);
    const viewport = page.getViewport({ scale: INK_SCALE });
    const canvas = createCanvas(Math.round(viewport.width), Math.round(viewport.height));
    await page.render({ canvas, viewport }).promise;
    const { data: pixels, width, height } = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);

    const inked = (y) => {
      for (let x = 0; x < width; x += 1) {
        const at = (y * width + x) * 4;
        if (pixels[at] < INK || pixels[at + 1] < INK || pixels[at + 2] < INK) return true;
      }
      return false;
    };

    let top = null;
    for (let y = 0; y < height && top === null; y += 1) if (inked(y)) top = y;
    if (top === null) return null;
    let bottom = null;
    for (let y = height - 1; y >= 0 && bottom === null; y -= 1) if (inked(y)) bottom = y;
    return { top, bottom, height };
  } finally {
    await task.destroy();
  }
}

async function freeHeight(data) {
  const rows = await inkRows(data);
  if (rows === null) return null;
  // Rows below the lowest ink, as millimetres of paper, less the padding the
  // document carries there anyway.
  const mm = ((rows.height - 1 - rows.bottom) / INK_SCALE / 72) * 25.4;
  return mm - PAGE_PADDING_MM;
}

// The floor, in millimetres of the last page's content box at Letter.
//
// Not picked: derived from the one measurement this repository has. On
// 2026-09-10 the English resume cleared Letter here by about 16 pixels and
// took a second page on the runner. 10mm is about 38 pixels at the resume's
// print size, more than twice the gap that failed, and about two and a half
// lines of body text. Anyone moving it should know that is what it was
// measured against.
//
// Letter only. It is the shorter paper, so it is the one that binds; a
// document with headroom at Letter has more at A4.
const HEADROOM_MM = 10;

// A resume that fits by a hair fits nowhere else. `counts` carries a page
// count and a free height per paper; this refuses on either.
function refuseNearMiss(which, counts) {
  for (const { paper, count, free } of counts) {
    if (paper !== 'Letter' || count !== 1 || free === null) continue;
    if (free < HEADROOM_MM) {
      throw new RenderFailure(
        'resume-has-no-headroom',
        `${which} at ${paper} fits on one page with ${free.toFixed(1)}mm to spare, and the floor is ${HEADROOM_MM}mm; ` +
          'it renders here and the runner resolves the system font stack to different faces, which is how a one-page ' +
          'resume became two on 2026-09-10. Shorten the content, never the type size',
      );
    }
  }
}

// One paper's result, for the line the step prints. The free height is on
// every render rather than only on a failure: a number nobody can see is a
// number nobody notices moving.
function describe({ paper, count, free }) {
  const pages = `${count} ${count === 1 ? 'page' : 'pages'} at ${paper}`;
  return free === null || count !== 1 ? pages : `${pages} with ${free.toFixed(1)}mm free`;
}

// Every run of text in a rendered PDF, with the page it is on and where on
// that page it was placed, so two renders of the same document can be compared
// run for run rather than as one blob of text.
async function textRuns(data) {
  const task = getDocument({ data: new Uint8Array(data), standardFontDataUrl });
  const runs = [];
  try {
    const document = await task.promise;
    for (let number = 1; number <= document.numPages; number += 1) {
      const content = await (await document.getPage(number)).getTextContent();
      for (const item of content.items) {
        if (item.str.trim()) {
          runs.push({
            page: number,
            where: `${number} ${item.transform[4].toFixed(1)} ${item.transform[5].toFixed(1)} ${item.str}`,
            text: item.str,
          });
        }
      }
    }
  } finally {
    await task.destroy();
  }
  return runs;
}

// A date and a time, whatever order and whatever separators the renderer's
// locale puts them in: Chrome's print header writes `9/11/26, 5:34 AM` here
// and something else on a machine set to another locale, and what is being
// recognised is a timestamp rather than one format of one.
const dateStamp = /\d{1,2}[/.-]\d{1,2}[/.-]\d{2,4},?\s+\d{1,2}:\d{2}(?::\d{2})?(?:\s*[AaPp]\.?[Mm]\.?)?/g;
// A page number, the way the print footer writes it: `3/5`.
const pageNumber = /\b\d+\s*\/\s*\d+\b/g;

// The letters and digits of a string, in one fixed order. The Arabic title is
// drawn shaped and extracts left to right one letter at a time, so it cannot
// be compared as a string: NFKC undoes the shaping, sorting undoes the order,
// and the Farsi yeh is folded to the Arabic one because that is the letter the
// shaped forms normalise to and, measured on the Arabic CV, the only code
// point the two sides differ by.
const letters = (value) =>
  [...value.normalize('NFKC').replaceAll('ی', 'ي')]
    .filter((character) => /\p{L}|\p{N}/u.test(character))
    .sort()
    .join('');

// Whether every letter of `wanted` is in `within`, as many times as `wanted`
// has it. Both are the sorted form above, so one walk forward answers it.
function carriesLetters(within, wanted) {
  let at = 0;
  for (const letter of wanted) {
    at = within.indexOf(letter, at);
    if (at === -1) {
      return false;
    }
    at += 1;
  }
  return true;
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
    // Backgrounds are printed. Nothing inside either document declares one
    // any more, since the tinted heading band this used to carry became a
    // rule and a border is not a background, so today it only paints the page
    // white rather than leaving it transparent. It stays because a renderer
    // told not to print backgrounds is one whose output depends on that
    // staying true, and that is not a thing a document should have to know.
    await page.pdf({ path: file, format: 'A4', printBackground: true });
    if (output.pages !== null) {
      const a4 = await readFile(file);
      counts.push({ paper: 'A4', count: await pageCount(a4), free: await freeHeight(a4), over: await overflowHeight(a4) });
      // The paper the file is not written on. A document that fits A4 and not
      // Letter fits nothing a reader in either market prints it on, and the
      // buffer costs one more render.
      const letter = await page.pdf({ format: 'Letter', printBackground: true });
      counts.push({ paper: 'Letter', count: await pageCount(letter), free: await freeHeight(letter), over: await overflowHeight(letter) });
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
  for (const { paper, count, over } of counts) {
    if (count > output.pages) {
      throw new RenderFailure(
        'resume-too-long',
        `${locale} at ${paper} runs to ${count} pages, expected at most ${output.pages}` +
          (over === null ? '' : `, with ${over.toFixed(1)}mm of content on the last one`) +
          `; cutting that much plus the ${HEADROOM_MM}mm floor brings it back. Shorten the content, never the type size`,
      );
    }
  }
  refuseNearMiss(`${locale} published`, counts);
  const loaded = fonts.filter((face) => face.status === 'loaded').map((face) => `${face.family} ${face.weight}`);
  const pages = counts.map(describe).join(', ');
  return `${path.relative(root, file)}: ${size} bytes${pages ? `, ${pages}` : ''}${loaded.length > 0 ? `, fonts ${loaded.join(', ')}` : ''}`;
}

// The same document once more, taken the way a reader's print dialog takes
// it: with "Headers and footers" ticked, which is where the dialog starts and
// where the file Saud generates therefore comes from. Nothing is written; what
// is being measured is what the renderer draws that the document did not.
//
// The furniture is found by subtracting the published render from this one.
// The switch adds the header and the footer and moves nothing else, so the
// runs this render has and the published file does not are the furniture and
// nothing but it. That subtraction is what keeps the document's own words from
// answering for the renderer's: the resume says the name in its header too,
// and a check over the whole extracted text would read that as a page title.
//
// The page box is the only switch a page has over any of this (the effort's
// evidence, print-furniture-and-the-page-box), so the resume, whose box has no
// margin, must come back with nothing, and the CV, whose box has one on every
// page it breaks over, must come back with all four fields on all of them.
// Without that second half the first passes on a renderer that has quietly
// stopped drawing furniture at all, which is a check that cannot fail.
async function renderFurniture(browser, at, locale, output) {
  const route = `/${locale}/${output.route}/`;
  const address = at(route);
  const file = path.join(dist, `${output.file}.${locale}.pdf`);
  const page = await browser.newPage();
  let title;
  let furnished;
  try {
    const response = await page.goto(address, { waitUntil: 'networkidle' });
    if (!response || !response.ok()) {
      throw new RenderFailure('page-not-loaded', `${route} answered ${response ? response.status() : 'nothing'}`);
    }
    // The same wait the published render makes. The two renders are compared
    // run for run, so a page whose fonts had not arrived would lay out
    // differently and every line of it would read as something the renderer
    // had added.
    await page.evaluate(() => document.fonts.ready);
    title = await page.title();
    furnished = await page.pdf({ format: 'A4', printBackground: true, displayHeaderFooter: true });
  } finally {
    await page.close();
  }

  const published = new Set((await textRuns(await readFile(file))).map((run) => run.where));
  const drawn = (await textRuns(furnished)).filter((run) => !published.has(run.where));
  const margins = new Map();
  for (const run of drawn) {
    margins.set(run.page, `${margins.get(run.page) ?? ''} ${run.text}`);
  }

  // The four fields the print dialog's one checkbox turns on together, each
  // looked for in what is left once whatever would answer for it has been
  // taken out: the address carries digits a date pattern matches, and a date
  // carries a slash a page number matches. The title is compared as a set of
  // letters rather than as a string, for the reason `letters` above gives.
  const reported = [];
  for (const [number, text] of [...margins].sort(([one], [two]) => one - two)) {
    const withoutAddress = text.replaceAll(address, ' ');
    const withoutStamp = withoutAddress.replace(dateStamp, ' ');
    const carried = [
      ['the page title', carriesLetters(letters(withoutAddress), letters(title))],
      ['the page address', text.includes(address)],
      ['a page number', withoutStamp.match(pageNumber) !== null],
      ['a date stamp', withoutAddress.match(dateStamp) !== null],
    ];
    reported.push({ number, carried });
  }

  if (!output.furniture) {
    const found = reported.flatMap(({ number, carried }) =>
      carried.filter(([, yes]) => yes).map(([field]) => `${field} on page ${number}`),
    );
    if (found.length > 0) {
      throw new RenderFailure(
        'print-furniture',
        `${locale} ${output.route} printed with the header and footer on carries ${found.join(', ')}; the browser draws those in the paper margin, so the page box has one again`,
      );
    }
    return `${route} with the header and footer on: nothing in the margin`;
  }

  const pages = await pageCount(furnished);
  const absent = [];
  for (let number = 1; number <= pages; number += 1) {
    const carried = reported.find((entry) => entry.number === number)?.carried ?? [];
    const missing = carried.length === 0 ? ['everything'] : carried.filter(([, yes]) => !yes).map(([field]) => field);
    if (missing.length > 0) {
      absent.push(`${missing.join(', ')} on page ${number}`);
    }
  }
  if (absent.length > 0) {
    throw new RenderFailure(
      'print-furniture-not-drawn',
      `${locale} ${output.route} printed with the header and footer on is missing ${absent.join(', ')}; it is the control the resume's check is read against, so a resume passing while this fails proves nothing`,
    );
  }
  return `${route} with the header and footer on: the title, the address, a page number and a date stamp on all ${pages} pages, the control`;
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
      counts.push({ paper: 'A4', count: await pageCount(a4), free: await freeHeight(a4), over: await overflowHeight(a4) });
      await ready();
      await filled();
      const letter = await page.pdf({ format: 'Letter', printBackground: true });
      await carriesContact(letter, 'the Letter render');
      counts.push({ paper: 'Letter', count: await pageCount(letter), free: await freeHeight(letter), over: await overflowHeight(letter) });
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
  for (const { paper, count, over } of counts) {
    if (count > output.pages) {
      throw new RenderFailure(
        'resume-too-long',
        `${locale} filled at ${paper} runs to ${count} pages, expected at most ${output.pages}` +
          (over === null ? '' : `, with ${over.toFixed(1)}mm of content on the last one`) +
          `; cutting that much plus the ${HEADROOM_MM}mm floor brings it back. Shorten the content, never the type size`,
      );
    }
  }
  refuseNearMiss(`${locale} filled`, counts);
  const pages = counts.map(describe).join(', ');
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
      console.log(await renderFurniture(browser, server.at, locale, output));
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
