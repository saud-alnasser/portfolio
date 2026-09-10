import { expect, test } from '@playwright/test';
import { at, background, control, storageKey } from './pages';

// The themes: the page follows the system preference, the
// control overrides it, a reload keeps the choice, and print is always light.

const rootBackground = () =>
  getComputedStyle(document.documentElement).backgroundColor;

test('the page follows the system preference with nothing stored', async ({ page, colorScheme }) => {
  await page.goto(at('/en/'));
  expect(await page.evaluate((key) => localStorage.getItem(key), storageKey)).toBeNull();
  expect(await page.evaluate(rootBackground)).toBe(background[colorScheme === 'dark' ? 'dark' : 'light']);
});

test('the theme control switches the palette and a reload keeps it', async ({ page, colorScheme }) => {
  const initial = colorScheme === 'dark' ? 'dark' : 'light';
  const chosen = initial === 'dark' ? 'light' : 'dark';

  await page.goto(at('/en/'));
  await page.locator(control).click();
  expect(await page.evaluate(rootBackground)).toBe(background[chosen]);
  expect(await page.evaluate((key) => localStorage.getItem(key), storageKey)).toBe(chosen);
  await expect(page.locator('html')).toHaveAttribute('data-theme', chosen);

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', chosen);
  expect(await page.evaluate(rootBackground)).toBe(background[chosen]);

  // And back, so the control is not a one-way switch.
  await page.locator(control).click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', initial);
  expect(await page.evaluate(rootBackground)).toBe(background[initial]);
});

test('the control shows the icon of the theme it switches to', async ({ page, colorScheme }) => {
  // Under the light palette the control offers the dark theme, so it shows
  // the moon; under the dark palette, the sun. Both icons are in the markup
  // and the stylesheet shows one, with its label, so the visible icon and
  // the accessible name change together with the palette.
  const dark = colorScheme === 'dark';
  const moon = page.locator(`${control} svg[data-icon="moon"]`);
  const sun = page.locator(`${control} svg[data-icon="sun"]`);

  await page.goto(at('/en/'));
  await expect(dark ? sun : moon).toBeVisible();
  await expect(dark ? moon : sun).toBeHidden();
  await expect(page.locator(control)).toHaveAccessibleName(dark ? 'Switch to Light theme' : 'Switch to Dark theme');

  await page.locator(control).click();
  await expect(dark ? moon : sun).toBeVisible();
  await expect(dark ? sun : moon).toBeHidden();
  await expect(page.locator(control)).toHaveAccessibleName(dark ? 'Switch to Dark theme' : 'Switch to Light theme');
});

// Both document pages print the same way, because both are the same template
// (src/components/CvDocument.astro); the resume adds the compact size on top.
for (const route of ['/en/cv/', '/en/resume/'] as const) {
  test(`printing ${route} applies the light palette with dark stored`, async ({ page }) => {
    await page.addInitScript((key) => localStorage.setItem(key, 'dark'), storageKey);
    await page.goto(at(route));
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    expect(await page.evaluate(rootBackground), 'on screen the stored dark palette applies').toBe(background.dark);

    await page.emulateMedia({ media: 'print' });
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe('light');
    expect(await page.evaluate(rootBackground), 'in print the light palette applies').toBe(background.light);
    // The chrome around the document, and the download control above it, are
    // off the page.
    await expect(page.locator('body > header')).toBeHidden();
    await expect(page.locator('body > footer')).toBeHidden();
    await expect(page.locator('.cv-actions')).toBeHidden();

    // The heading bands are the one tint the template has, and a browser drops
    // background colours when printing unless the page insists. The band asks
    // for `print-color-adjust: exact`, and the render step prints backgrounds,
    // so the PDF shows what the screen shows: the light side of --band, since
    // print forces the light palette above.
    const band = await page.locator('.cv-band').first().evaluate((element) => {
      const style = getComputedStyle(element);
      return { background: style.backgroundColor, adjust: style.printColorAdjust };
    });
    expect(band.adjust, 'the band keeps its background on paper').toBe('exact');
    expect(band.background, 'in print the band takes the light --band from src/styles/global.css').toBe(
      'rgb(221, 232, 240)',
    );
  });
}

test('the resume prints a size smaller than the CV, and no smaller than 10pt', async ({ page }) => {
  // The one page the resume has is bought with the compact rules in
  // src/styles/global.css, keyed on the class its variant puts on the
  // article. 10pt is the floor the effort's spec sets: the content bends to
  // one page, never the type size.
  const rootSize = () => Number.parseFloat(getComputedStyle(document.documentElement).fontSize);

  await page.goto(at('/en/cv/'));
  await page.emulateMedia({ media: 'print' });
  const cv = await page.evaluate(rootSize);

  await page.goto(at('/en/resume/'));
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('article.cv.cv-compact')).toHaveCount(1);
  const resume = await page.evaluate(rootSize);

  // 10pt and 11pt, as the CSS states them, in the pixels a browser reports.
  expect(resume, 'the resume prints smaller than the CV').toBeLessThan(cv);
  expect(resume, 'the resume prints at 10pt and no smaller').toBeCloseTo((10 * 96) / 72, 1);
});
