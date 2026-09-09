import { expect, test } from '@playwright/test';
import { at, pages } from './pages';

// The layout on a phone and under reduced motion: no horizontal
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

test.describe('at 1440 pixels wide', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  // The layout's stated maximum is Tailwind's max-w-3xl, 48rem: the content
  // column fills it, centred, rather than hugging one side or shrinking.
  for (const page of pages) {
    test(`${page} fills the content column`, async ({ page: browser }) => {
      await browser.goto(page);
      const box = await browser.locator('main').boundingBox();
      expect(box, `main on ${page}`).not.toBeNull();
      expect(Math.round(box!.width), `main width on ${page}`).toBe(768);
      const left = box!.x;
      const right = 1440 - (box!.x + box!.width);
      expect(Math.abs(left - right), `main centred on ${page}`).toBeLessThanOrEqual(1);
    });
  }
});

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('nothing animates on /en/', async ({ page }) => {
    await page.goto(at('/en/'));
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
    await page.goto(at('/en/'));
    const count = await page.evaluate(() => document.getAnimations().length);
    await context.close();
    expect(count).toBeGreaterThan(0);
  });
});
