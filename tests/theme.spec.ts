import { expect, test } from '@playwright/test';
import { background, control, storageKey } from './pages';

// The themes (criterion 14): the page follows the system preference, the
// control overrides it, a reload keeps the choice, and print is always light.

const rootBackground = () =>
  getComputedStyle(document.documentElement).backgroundColor;

test('the page follows the system preference with nothing stored', async ({ page, colorScheme }) => {
  await page.goto('/en/');
  expect(await page.evaluate(() => localStorage.getItem('theme'))).toBeNull();
  expect(await page.evaluate(rootBackground)).toBe(background[colorScheme === 'dark' ? 'dark' : 'light']);
});

test('the theme control switches the palette and a reload keeps it', async ({ page, colorScheme }) => {
  const initial = colorScheme === 'dark' ? 'dark' : 'light';
  const chosen = initial === 'dark' ? 'light' : 'dark';

  await page.goto('/en/');
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

test('printing the CV page applies the light palette with dark stored', async ({ page }) => {
  await page.addInitScript((key) => localStorage.setItem(key, 'dark'), storageKey);
  await page.goto('/en/cv/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  expect(await page.evaluate(rootBackground), 'on screen the stored dark palette applies').toBe(background.dark);

  await page.emulateMedia({ media: 'print' });
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe('light');
  expect(await page.evaluate(rootBackground), 'in print the light palette applies').toBe(background.light);
  // The chrome around the document is off the page.
  await expect(page.locator('body > header')).toBeHidden();
  await expect(page.locator('body > footer')).toBeHidden();
});
