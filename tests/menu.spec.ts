import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { strings } from '../src/lib/i18n';
import { lowContrastPairs } from './contrast';
import { at, control, menu, otherLocale, pageList } from './pages';

// The language menu: it opens with a click and with Enter, lists both
// languages with the current one marked, leads to the same route in the
// other language from every page, and closes on Escape and on a click
// outside. It is a native <details>, so with JavaScript disabled the list is
// still reachable and its links still work; that context also checks that
// every page's content is there without a script.

// The languages as the menu names them, in their own script.
const names = { en: 'English', ar: 'العربية' } as const;

// The site's own navigation, beside the language menu in the same header: the
// same links in the same order on every page, with the resume after the CV,
// so a reader who found one document finds the other.
test.describe('the site navigation', () => {
  for (const { locale, path } of pageList) {
    const t = strings[locale];
    test(`lists the five links in order on ${path}`, async ({ page }) => {
      await page.goto(path);
      const links = page.locator(`body > header nav[aria-label="${t.nav.label}"] > ul > li > a`);
      await expect(links).toHaveText([t.nav.home, t.nav.work, t.nav.education, t.nav.cv, t.nav.resume]);
      await expect(links.nth(4)).toHaveAttribute('href', at(`/${locale}/resume/`));
    });
  }
});

test.describe('the language menu', () => {
  test('carries an icon and a name, and opens with a click', async ({ page }) => {
    await page.goto(at('/en/'));
    const details = page.locator(menu);
    const summary = details.locator('summary');
    await expect(details).not.toHaveAttribute('open');
    await expect(summary.locator('svg')).not.toHaveCount(0);
    await expect(summary).toHaveAccessibleName(/Language/);
    await expect(page.locator(control).locator('svg')).not.toHaveCount(0);

    await summary.click();
    await expect(details).toHaveAttribute('open', '');
    const items = details.locator('ul a');
    await expect(items).toHaveText([names.en, names.ar]);
    await expect(items.nth(0)).toHaveAttribute('aria-current', 'page');
    await expect(items.nth(1)).not.toHaveAttribute('aria-current');
    await expect(items.nth(1)).toHaveAttribute('href', at('/ar/'));
  });

  test('opens with Enter', async ({ page }) => {
    await page.goto(at('/en/'));
    const details = page.locator(menu);
    await details.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(details).toHaveAttribute('open', '');
    await expect(details.locator('ul a')).toHaveCount(2);
  });

  test('closes on Escape and returns focus to the control', async ({ page }) => {
    await page.goto(at('/en/'));
    const details = page.locator(menu);
    const summary = details.locator('summary');
    await summary.click();
    await expect(details).toHaveAttribute('open', '');
    await page.keyboard.press('Escape');
    await expect(details).not.toHaveAttribute('open');
    await expect(summary).toBeFocused();
  });

  test('closes on a click outside', async ({ page }) => {
    await page.goto(at('/en/'));
    const details = page.locator(menu);
    await details.locator('summary').click();
    await expect(details).toHaveAttribute('open', '');
    await page.locator('main h1').click();
    await expect(details).not.toHaveAttribute('open');
  });

  test('stays open on a click inside', async ({ page }) => {
    // So the dismissal does not swallow a click on the list itself.
    await page.goto(at('/en/'));
    const details = page.locator(menu);
    await details.locator('summary').click();
    await details.locator('ul').click({ position: { x: 2, y: 2 } });
    await expect(details).toHaveAttribute('open', '');
  });

  test('meets the contrast criterion open', async ({ page, colorScheme }) => {
    // The contrast tests audit every page with the menu closed; this is the
    // one surface they cannot see.
    await page.goto(at('/en/'));
    await page.evaluate(() => Promise.all(document.getAnimations().map((animation) => animation.finished)));
    await page.locator(menu).locator('summary').click();
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    const found = results.violations.map((violation) => `${violation.id}: ${violation.help}`);
    expect(found, `${colorScheme} palette with the menu open`).toEqual([]);
    expect(await page.evaluate(lowContrastPairs), `${colorScheme} palette with the menu open`).toEqual([]);
  });

  test('sits at the start of the header in Arabic', async ({ page }) => {
    // The header mirrors: the controls, at the end of the row, sit on the
    // left of the page in Arabic and on the right in English.
    await page.goto(at('/ar/'));
    const brand = await page.locator('body > header a').first().boundingBox();
    const menuBox = await page.locator(menu).boundingBox();
    expect(menuBox!.x, 'the menu is left of the name on the Arabic page').toBeLessThan(brand!.x);

    await page.goto(at('/en/'));
    const brandEn = await page.locator('body > header a').first().boundingBox();
    const menuEn = await page.locator(menu).boundingBox();
    expect(menuEn!.x, 'the menu is right of the name on the English page').toBeGreaterThan(brandEn!.x);
  });

  for (const { locale, route, path } of pageList) {
    const other = otherLocale(locale);
    test(`leads from ${path} to the same route in ${other}`, async ({ page }) => {
      await page.goto(path);
      const details = page.locator(menu);
      await details.locator('summary').click();
      const current = details.locator('ul a[aria-current="page"]');
      await expect(current).toHaveText(names[locale]);
      await details.locator('ul a').filter({ hasText: names[other] }).click();
      await expect(page).toHaveURL(new RegExp(`${at(`/${other}${route}`).replace(/\//g, '\\/')}$`));
      await expect(page.locator('html')).toHaveAttribute('lang', other);
    });
  }
});

test.describe('with JavaScript disabled', () => {
  test.use({ javaScriptEnabled: false });

  for (const { locale, route, path } of pageList) {
    const other = otherLocale(locale);
    test(`${path} shows its content and reaches ${other} through the list`, async ({ page }) => {
      await page.goto(path);
      const text = (await page.locator('main').innerText()).trim();
      expect(text.length, `main text on ${path}`).toBeGreaterThan(0);

      const details = page.locator(menu);
      await details.locator('summary').click();
      await expect(details).toHaveAttribute('open', '');
      await details.locator('ul a').filter({ hasText: names[other] }).click();
      await expect(page).toHaveURL(new RegExp(`${at(`/${other}${route}`).replace(/\//g, '\\/')}$`));
      await expect(page.locator('html')).toHaveAttribute('lang', other);
    });
  }
});
