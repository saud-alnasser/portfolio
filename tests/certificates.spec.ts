import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { parse as parseYaml } from 'yaml';
import { lowContrastPairs } from './contrast';
import { at, locales } from './pages';
import { strings } from '../src/lib/i18n';

// The certificate grid and the one dialog its cards open: the card is a link
// to its PDF, so a visitor with no script gets the document itself, and the
// script turns the click into the dialog showing the preview with the PDF one
// click away. What the page must not do is load any of the 27 previews with
// itself, which is what the dialog's empty <img> and the request count below
// assert.
//
// How many certificates there are, and how many name a document, is read from
// src/content/ the way tests/education.spec.ts reads it, so the number is the
// content rather than a number typed twice.

const content = fileURLToPath(new URL('../src/content/', import.meta.url));

type CertificateEntry = { name: Record<'en' | 'ar', string>; issuer: string; document?: string };

const certificates = readdirSync(path.join(content, 'certificates'))
  .filter((file) => file.endsWith('.yaml'))
  .sort()
  .map((file) => parseYaml(readFileSync(path.join(content, 'certificates', file), 'utf8')) as CertificateEntry);

const documented = certificates.filter((entry) => entry.document);

const grid = '[data-grid="certificates"]';
const cards = '[data-entry="certificate"]';
const dialog = '[data-certificate-dialog]';
const image = '[data-certificate-image]';
const link = '[data-certificate-link]';
const caption = '[data-certificate-caption]';
const close = '[data-certificate-close]';

// The number of tracks the grid lays its cards in, as the browser computes it.
const columnsOf = (page: Page) =>
  page.locator(grid).evaluate((node) => getComputedStyle(node).gridTemplateColumns.split(/\s+/).filter(Boolean).length);

// The reveal is a 500ms animation; a click waits it out first.
const settled = (page: Page) => page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished)));

for (const locale of locales) {
  const url = at(`/${locale}/education/`);

  test.describe(url, () => {
    test('shows every certificate as a card, each with a document carrying its address', async ({ page }) => {
      await page.goto(url);
      await expect(page.locator(`${grid} > li`)).toHaveCount(certificates.length);
      await expect(page.locator(cards)).toHaveCount(certificates.length);

      const withDocument = page.locator(`${cards}[data-document]`);
      await expect(withDocument, `certificates naming a document on ${url}`).toHaveCount(documented.length);

      // Each is the link to its own PDF, with the preview and the caption the
      // dialog will show.
      const found = await withDocument.evaluateAll((nodes) =>
        nodes.map((node) => ({
          tag: node.tagName.toLowerCase(),
          href: node.getAttribute('href'),
          document: node.getAttribute('data-document'),
          preview: node.getAttribute('data-preview'),
          width: node.getAttribute('data-preview-width'),
          height: node.getAttribute('data-preview-height'),
          caption: node.getAttribute('data-caption'),
        })),
      );
      for (const [index, card] of found.entries()) {
        expect(card.tag, `card ${index} on ${url}`).toBe('a');
        expect(card.href, `card ${index} on ${url} links to its document`).toBe(card.document);
        expect(card.document, `card ${index} on ${url}`).toMatch(/\.pdf$/);
        expect(card.preview, `preview of card ${index} on ${url}`).toMatch(/\.webp$/);
        expect(Number(card.width), `preview width of card ${index} on ${url}`).toBeGreaterThan(0);
        expect(Number(card.height), `preview height of card ${index} on ${url}`).toBeGreaterThan(0);
        expect(card.caption, `caption of card ${index} on ${url}`).toBeTruthy();
      }
    });

    test('loads no preview with the page, and none until a card is opened', async ({ page }) => {
      const previews: string[] = [];
      page.on('request', (request) => {
        if (request.url().endsWith('.webp')) previews.push(request.url());
      });
      await page.goto(url);
      await settled(page);
      await expect(page.locator(`${dialog} ${image}`)).not.toHaveAttribute('src');
      expect(previews, `previews requested by ${url}`).toEqual([]);
    });

    test('opens the dialog on a click, with the preview and the PDF', async ({ page }) => {
      await page.goto(url);
      await settled(page);
      const card = page.locator(`${cards}[data-document]`).first();
      const expected = {
        preview: await card.getAttribute('data-preview'),
        document: await card.getAttribute('data-document'),
        caption: await card.getAttribute('data-caption'),
      };

      await expect(page.locator(dialog)).not.toHaveAttribute('open');
      await card.click();
      await expect(page.locator(dialog)).toHaveAttribute('open', '');
      await expect(page.locator(`${dialog} ${image}`)).toHaveAttribute('src', expected.preview!);
      await expect(page.locator(`${dialog} ${image}`)).toHaveAttribute('alt', expected.caption!);
      // The preview is a real file that arrives, not only an address, and the
      // dialog reserved its box before it did: the image's size attributes are
      // the card's, so the dialog does not grow when the file lands.
      await expect
        .poll(() => page.locator(`${dialog} ${image}`).evaluate((node) => (node as HTMLImageElement).naturalWidth), {
          message: `the preview of ${url} loads`,
        })
        .toBeGreaterThan(0);
      await expect(page.locator(`${dialog} ${image}`)).toHaveAttribute('width', (await card.getAttribute('data-preview-width'))!);
      await expect(page.locator(`${dialog} ${image}`)).toHaveAttribute('height', (await card.getAttribute('data-preview-height'))!);
      await expect(page.locator(`${dialog} ${link}`)).toHaveAttribute('href', expected.document!);
      await expect(page.locator(`${dialog} ${link}`)).toContainText(strings[locale].certificate.document);
      await expect(page.locator(`${dialog} ${caption}`)).toHaveText(expected.caption!);
      // The click opened the dialog rather than following the link.
      await expect(page).toHaveURL(new RegExp(`${url.replace(/\//g, '\\/')}$`));
    });

    test('closes on Escape and returns focus to the card that opened it', async ({ page }) => {
      await page.goto(url);
      await settled(page);
      const card = page.locator(`${cards}[data-document]`).nth(1);
      await card.click();
      await expect(page.locator(dialog)).toHaveAttribute('open', '');
      await page.keyboard.press('Escape');
      await expect(page.locator(dialog)).not.toHaveAttribute('open');
      await expect(card).toBeFocused();
    });

    test('closes on the close control and returns focus to the card', async ({ page }) => {
      await page.goto(url);
      await settled(page);
      const card = page.locator(`${cards}[data-document]`).first();
      await card.click();
      await expect(page.locator(`${dialog} ${close}`)).toHaveAccessibleName(strings[locale].certificate.close);
      await page.locator(`${dialog} ${close}`).click();
      await expect(page.locator(dialog)).not.toHaveAttribute('open');
      await expect(card).toBeFocused();
    });

    test('meets the contrast criterion with the dialog closed and open', async ({ page, colorScheme }) => {
      await page.goto(url);
      await settled(page);
      const audit = async (state: string) => {
        const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
        const found = results.violations.map((violation) => `${violation.id}: ${violation.help}`);
        expect(found, `${colorScheme} palette on ${url} with the dialog ${state}`).toEqual([]);
        expect(await page.evaluate(lowContrastPairs), `${colorScheme} palette on ${url} with the dialog ${state}`).toEqual(
          [],
        );
      };

      await audit('closed');
      await page.locator(`${cards}[data-document]`).first().click();
      await expect(page.locator(dialog)).toHaveAttribute('open', '');
      await audit('open');
    });
  });

  test.describe(`${url} at 360 pixels wide`, () => {
    test.use({ viewport: { width: 360, height: 780 } });

    test('lays the certificates in one column and does not scroll sideways', async ({ page }) => {
      await page.goto(url);
      await page.evaluate(() => document.fonts.ready);
      expect(await columnsOf(page), `columns of the certificate grid on ${url}`).toBe(1);
      const width = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(width, `scrollWidth of ${url}`).toBeLessThanOrEqual(360);
    });
  });

  test.describe(`${url} at 1440 pixels wide`, () => {
    test.use({ viewport: { width: 1440, height: 900 } });

    test('lays the certificates in two or more columns', async ({ page }) => {
      await page.goto(url);
      expect(await columnsOf(page), `columns of the certificate grid on ${url}`).toBeGreaterThanOrEqual(2);
    });
  });

  test.describe(`${url} with JavaScript disabled`, () => {
    test.use({ javaScriptEnabled: false, reducedMotion: 'reduce' });

    test('leaves every card the link to its PDF', async ({ page }) => {
      await page.goto(url);
      const found = await page.locator(`${cards}[data-document]`).evaluateAll((nodes) =>
        nodes.map((node) => ({ tag: node.tagName.toLowerCase(), href: node.getAttribute('href') })),
      );
      expect(found.length, `cards with a document on ${url}`).toBe(documented.length);
      for (const [index, card] of found.entries()) {
        expect(card.tag, `card ${index} on ${url} without script`).toBe('a');
        expect(card.href, `card ${index} on ${url} without script`).toMatch(/\.pdf$/);
      }
    });
  });
}

test.describe('at 1440 pixels wide', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test('the Arabic certificate grid fills from the right and the English from the left', async ({ page }) => {
    const firstTwo = async (path: string) => {
      await page.goto(path);
      const card = page.locator(cards);
      return { first: (await card.nth(0).boundingBox())!, second: (await card.nth(1).boundingBox())! };
    };

    const arabic = await firstTwo(at('/ar/education/'));
    expect(arabic.first.x, 'the first Arabic certificate sits right of the second').toBeGreaterThan(arabic.second.x);

    const english = await firstTwo(at('/en/education/'));
    expect(english.first.x, 'the first English certificate sits left of the second').toBeLessThan(english.second.x);
  });
});
