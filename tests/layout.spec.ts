import { expect, test } from '@playwright/test';
import { pages } from './pages';

// The layout on a phone and under reduced motion (criterion 7): no horizontal
// scrolling at 360 pixels on any page, and nothing animates when the visitor
// asked for reduced motion.

test.describe('at 360 pixels wide', () => {
  test.use({ viewport: { width: 360, height: 780 } });

  for (const page of pages) {
    test(`${page} does not scroll horizontally`, async ({ page: browser }) => {
      await browser.goto(page);
      await browser.evaluate(() => document.fonts.ready);
      const width = await browser.evaluate(() => document.documentElement.scrollWidth);
      expect(width, `scrollWidth of ${page}`).toBeLessThanOrEqual(360);
    });
  }
});

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('nothing animates on /en/', async ({ page }) => {
    await page.goto('/en/');
    const animations = await page.evaluate(() =>
      document.getAnimations().map((animation) => {
        const effect = animation.effect as KeyframeEffect | null;
        const target = effect?.target as Element | null;
        return `${target?.tagName.toLowerCase() ?? '?'}: ${(animation as CSSAnimation).animationName ?? animation.id}`;
      }),
    );
    expect(animations).toEqual([]);
  });

  test('the reveal runs when motion is not reduced', async ({ browser }) => {
    // The opposite case, so the test above cannot pass because the animation
    // never existed.
    const context = await browser.newContext({ reducedMotion: 'no-preference', baseURL: test.info().project.use.baseURL });
    const page = await context.newPage();
    await page.goto('/en/');
    const count = await page.evaluate(() => document.getAnimations().length);
    await context.close();
    expect(count).toBeGreaterThan(0);
  });
});
