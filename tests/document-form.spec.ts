import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { parse as parseYaml } from 'yaml';
import { lowContrastPairs } from './contrast';
import { at, locales } from './pages';
import { strings } from '../src/lib/i18n';

// The form a document page opens instead of downloading, and the document it
// produces. The site publishes no email address and no phone number, so this
// is the only path to a document that carries either, and it produces one in
// the reader's own browser: the values go into the two hidden slots the
// contact line already has, the page is printed, and the slots are emptied.
//
// window.print() is replaced before the page loads rather than left to run.
// A headless browser has no print dialog to complete, and what these tests are
// about is the state of the document at the moment printing is asked for,
// which is what a reader's print dialog would be handed.

const content = fileURLToPath(new URL('../src/content/', import.meta.url));
const profile = parseYaml(readFileSync(path.join(content, 'profile.yaml'), 'utf8')).profile;

const dialog = '[data-document-dialog]';
const control = '[data-document-download]';
const contact = '[data-cv-contact]';
const generate = '[data-document-generate]';
const close = '[data-document-close]';

const settled = (page: Page) => page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished)));

// Counts the print calls instead of making them, and lets a test fire the
// afterprint the browser would fire once a reader is done with the dialog.
async function stubPrint(page: Page) {
  await page.addInitScript(() => {
    (window as any).__prints = 0;
    window.print = () => {
      (window as any).__prints += 1;
    };
  });
}

const prints = (page: Page) => page.evaluate(() => (window as any).__prints as number);

// The value written into one contact slot, and whether the slot is showing.
// The value is the item's first span; the second is the separator bar, which
// is part of the line rather than part of the value.
async function slot(page: Page, which: 'email' | 'phone') {
  const item = page.locator(`${contact} [data-contact-slot="${which}"]`);
  return { text: ((await item.locator('span').first().textContent()) ?? '').trim(), hidden: await item.isHidden() };
}

for (const locale of locales) {
  for (const variant of ['cv', 'resume'] as const) {
    const url = at(`/${locale}/${variant}/`);
    const t = strings[locale];

    test.describe(`the download form on ${url}`, () => {
      test.beforeEach(async ({ page }) => {
        await stubPrint(page);
      });

      test('opens instead of downloading, and fills the contact line with what was typed', async ({ page }) => {
        await page.goto(url);
        await settled(page);
        await page.locator(control).click();
        await expect(page.locator(dialog)).toHaveAttribute('open', '');

        await page.locator('[data-document-field="email"]').fill('reader@example.com');
        await page.locator('[data-document-field="phone"]').fill('+966500000000');
        await page.locator(generate).click();

        await expect(page.locator(dialog)).not.toHaveAttribute('open');
        expect(await prints(page), `window.print() on ${url}`).toBe(1);

        // In the contact line, in order, at the position the email held
        // before this effort: the two slots come before the nationality.
        const items = await page.locator(`${contact} > li:not([hidden])`).allInnerTexts();
        const cleaned = items.map((item) => item.replace(/\|/g, '').trim());
        expect(cleaned.slice(0, 2)).toEqual(['reader@example.com', '+966500000000']);
        expect(cleaned[2]).toBe(profile.nationality[locale] ?? profile.nationality.en);
      });

      test('carries the one value when only one is typed', async ({ page }) => {
        await page.goto(url);
        await settled(page);
        await page.locator(control).click();
        await page.locator('[data-document-field="phone"]').fill('+966500000000');
        await page.locator(generate).click();

        expect(await slot(page, 'email')).toEqual({ text: '', hidden: true });
        expect((await slot(page, 'phone')).text).toContain('+966500000000');
        expect((await slot(page, 'phone')).hidden).toBe(false);
      });

      test('issues no network request while the form is open or generating', async ({ page }) => {
        await page.goto(url);
        await settled(page);

        // Everything from here on: opening the dialog, typing, generating.
        // The values are the reader's, and nothing may carry them anywhere.
        const requests: string[] = [];
        page.on('request', (request) => requests.push(request.url()));

        await page.locator(control).click();
        await page.locator('[data-document-field="email"]').fill('reader@example.com');
        await page.locator('[data-document-field="phone"]').fill('+966500000000');
        await page.locator(generate).click();
        await expect(page.locator(dialog)).not.toHaveAttribute('open');

        expect(requests, `requests made while generating on ${url}`).toEqual([]);
      });

      test('empties the slots again after printing, and again when dismissed', async ({ page }) => {
        await page.goto(url);
        await settled(page);
        await page.locator(control).click();
        await page.locator('[data-document-field="email"]').fill('reader@example.com');
        await page.locator(generate).click();
        expect((await slot(page, 'email')).hidden).toBe(false);

        // The afterprint path: what the browser fires once the reader is done
        // with the print dialog, whether they printed or cancelled.
        await page.evaluate(() => window.dispatchEvent(new Event('afterprint')));
        expect(await slot(page, 'email')).toEqual({ text: '', hidden: true });

        // The close path: a dialog dismissed rather than generated from
        // leaves the document exactly as it was published.
        await page.locator(control).click();
        await page.locator('[data-document-field="email"]').fill('reader@example.com');
        await page.keyboard.press('Escape');
        await expect(page.locator(dialog)).not.toHaveAttribute('open');
        expect(await slot(page, 'email')).toEqual({ text: '', hidden: true });
      });

      test('dismisses on Escape, on the close control, and on the backdrop, returning focus each time', async ({
        page,
      }) => {
        await page.goto(url);
        await settled(page);

        for (const dismiss of ['escape', 'control', 'backdrop'] as const) {
          await page.locator(control).click();
          await expect(page.locator(dialog)).toHaveAttribute('open', '');
          if (dismiss === 'escape') await page.keyboard.press('Escape');
          if (dismiss === 'control') await page.locator(close).click();
          // The backdrop is the area outside the dialog's own box, and a
          // click there arrives with the dialog itself as its target.
          if (dismiss === 'backdrop') await page.mouse.click(5, 5);
          await expect(page.locator(dialog), `dismissed by the ${dismiss}`).not.toHaveAttribute('open');
          await expect(page.locator(control), `focus after the ${dismiss}`).toBeFocused();
          expect(await slot(page, 'email'), `the email slot after the ${dismiss}`).toEqual({ text: '', hidden: true });
        }
      });

      test('downloads the published document from the way out inside the form', async ({ page }) => {
        await page.goto(url);
        await settled(page);
        await page.locator(control).click();
        const plain = page.locator(`${dialog} a[download]`);
        await expect(plain).toHaveAttribute('href', at(`/${variant}.${locale}.pdf`));

        const download = page.waitForEvent('download');
        await plain.click();
        expect((await download).url()).toContain(`/${variant}.${locale}.pdf`);
      });

      test('is completable by the keyboard alone, with both fields labelled', async ({ page }) => {
        await page.goto(url);
        await settled(page);

        // Reached by tabbing rather than clicked, and opened with the key a
        // link is opened with.
        await page.locator(control).focus();
        await page.keyboard.press('Enter');
        await expect(page.locator(dialog)).toHaveAttribute('open', '');

        await expect(page.locator('[data-document-field="email"]')).toHaveAccessibleName(t.cv.form.email);
        await expect(page.locator('[data-document-field="phone"]')).toHaveAccessibleName(t.cv.form.phone);
        await expect(page.locator(generate)).toHaveAccessibleName(t.cv.form.generate);
        await expect(page.locator(close)).toHaveAccessibleName(t.cv.form.close);

        await page.locator('[data-document-field="email"]').focus();
        await page.keyboard.type('reader@example.com');
        await page.keyboard.press('Tab');
        await page.keyboard.type('+966500000000');
        await page.locator(generate).focus();
        await page.keyboard.press('Enter');

        await expect(page.locator(dialog)).not.toHaveAttribute('open');
        expect((await slot(page, 'email')).text).toContain('reader@example.com');
        expect((await slot(page, 'phone')).text).toContain('+966500000000');
      });

      test('meets the contrast criterion with the form open', async ({ page, colorScheme }) => {
        await page.goto(url);
        await settled(page);
        // No second settle: opening the dialog cancels the page's reveal, and
        // a cancelled animation rejects the promise that waits on it.
        await page.locator(control).click();
        await expect(page.locator(dialog)).toHaveAttribute('open', '');

        const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
        expect(
          results.violations.map((violation) => `${violation.id}: ${violation.help}`),
          `${colorScheme} palette on ${url} with the form open`,
        ).toEqual([]);
        expect(await page.evaluate(lowContrastPairs), `${colorScheme} palette on ${url} with the form open`).toEqual([]);
      });
    });

    test.describe(`the download form on ${url} with reduced motion`, () => {
      test.use({ reducedMotion: 'reduce' });

      test('animates nothing when it opens', async ({ page }) => {
        await page.goto(url);
        await page.locator(control).click();
        await expect(page.locator(dialog)).toHaveAttribute('open', '');
        const animations = await page.evaluate(() => document.getAnimations().length);
        expect(animations, `animations with the form open on ${url}`).toBe(0);
      });
    });

    test.describe(`${url} with JavaScript disabled`, () => {
      test.use({ javaScriptEnabled: false, reducedMotion: 'reduce' });

      test('renders in full and leaves the control the link to the published PDF', async ({ page }) => {
        await page.goto(url);
        await expect(page.locator('article.cv')).toBeVisible();
        await expect(page.locator(contact)).toBeVisible();

        const found = await page.locator(control).evaluate((node) => ({
          tag: node.tagName.toLowerCase(),
          href: node.getAttribute('href'),
          download: node.hasAttribute('download'),
        }));
        expect(found).toEqual({ tag: 'a', href: at(`/${variant}.${locale}.pdf`), download: true });

        // The dialog is inert without script, and the document it would fill
        // is the published one: no address, no number, both slots hidden.
        await expect(page.locator(dialog)).not.toHaveAttribute('open');
        expect(await page.locator(contact).innerText()).not.toContain(profile.email);
        await expect(page.locator(`${contact} [data-contact-slot="email"]`)).toBeHidden();
        await expect(page.locator(`${contact} [data-contact-slot="phone"]`)).toBeHidden();
      });
    });
  }
}
