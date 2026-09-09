import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { parse as parseYaml } from 'yaml';
import { lowContrastPairs } from './contrast';
import { at, locales } from './pages';
import { fill, formatPeriod, plural, strings } from '../src/lib/i18n';
import { byDateAscending, byStartAscending } from '../src/lib/order';

// The education page: the timeline of institutions with one node for the
// online-courses phase, and the certificates under their own heading below it.
//
// What the page shows is read from src/content/ here, the way
// scripts/check-dist.mjs reads it, so an expectation is the content rather
// than a number typed twice: the courses the university entry lists, how many
// certificates there are, and the dates of the first and the last.

const content = fileURLToPath(new URL('../src/content/', import.meta.url));

function entries<T>(collection: string): T[] {
  const directory = path.join(content, collection);
  return readdirSync(directory)
    .filter((file) => file.endsWith('.yaml'))
    .sort()
    .map((file) => parseYaml(readFileSync(path.join(directory, file), 'utf8')) as T);
}

type Text = Record<'en' | 'ar', string>;
type EducationEntry = { institution: Text; status: string; period: { start: string }; courses?: Text[] };
type CertificateEntry = { name: Text; date?: string };

const education = entries<EducationEntry>('education').sort(byStartAscending);
const certificates = entries<CertificateEntry>('certificates');
const dated = certificates.filter((entry) => entry.date).sort(byDateAscending);

// The institution the timeline ends on, and the one whose certificate is
// pending: the same entry today, and the test says which it means either way.
const mostRecent = education[education.length - 1];
const pending = education.find((entry) => entry.status === 'certificate-pending')!;

// The phase runs from the earliest dated certificate to the latest.
const period = { start: String(dated[0].date), end: String(dated[dated.length - 1].date) };

const timeline = 'section[aria-labelledby="studies"] ol > li';
const node = '[data-courses-node]';

for (const locale of locales) {
  const t = strings[locale];
  const url = at(`/${locale}/education/`);

  test.describe(url, () => {
    test('shows the university as a card with its status and its courses folded', async ({ page }) => {
      await page.goto(url);
      const card = page.locator(timeline).filter({ has: page.locator(`[data-status="${pending.status}"]`) });
      await expect(card).toHaveCount(1);
      await expect(card.locator('[data-status]')).toHaveText(t.education.status['certificate-pending']);
      await expect(card).toContainText(pending.institution[locale]);

      const courses = pending.courses!;
      const fold = card.locator('details');
      const shown = { count: String(courses.length), noun: plural(locale, courses.length, t.fold.nouns.courses) };
      await expect(fold).not.toHaveAttribute('open');
      await expect(fold.locator('summary')).toContainText(fill(t.fold.show, shown));
      await expect(fold.locator('li').first()).not.toBeVisible();

      await fold.locator('summary').click();
      await expect(fold).toHaveAttribute('open', '');
      await expect(fold.locator('summary')).toContainText(fill(t.fold.hide, shown));
      await expect(fold.locator('li'), `the ${courses.length} courses of ${pending.institution.en}`).toHaveCount(
        courses.length,
      );
      await expect(fold.locator('li').first()).toBeVisible();
      // In the page's language, not the language the content was authored in.
      await expect(fold.locator('li').first()).toHaveText(courses[0][locale]);
      await expect(fold.locator('li').last()).toHaveText(courses[courses.length - 1][locale]);
    });

    test('reads in order of time, with the courses node before the most recent institution', async ({ page }) => {
      await page.goto(url);
      const items = page.locator(timeline);
      // The institutions and the one node, and nothing else: the certificates
      // have left the timeline.
      await expect(items).toHaveCount(education.length + 1);
      await expect(items.locator('[data-status]')).toHaveCount(education.length);

      const last = education.length;
      await expect(items.nth(last - 1).locator(node), 'the node sits before the last institution').toHaveCount(1);
      await expect(items.nth(last)).toContainText(mostRecent.institution[locale]);
    });

    test('counts every certificate on the node and dates it from the first to the last', async ({ page }) => {
      await page.goto(url);
      const courses = page.locator(node);
      await expect(courses).toContainText(t.education.onlineCourses.name);
      await expect(courses).toContainText(
        fill(t.education.onlineCourses.count, {
          count: String(certificates.length),
          noun: plural(locale, certificates.length, t.education.onlineCourses.noun),
        }),
      );
      await expect(courses).toContainText(formatPeriod(locale, period));
      await expect(courses).toHaveAttribute('href', '#certificates');
    });

    test('lists the certificates under the heading the node leads to', async ({ page }) => {
      await page.goto(url);
      // The anchor is the heading below the timeline, so an inbound link to
      // #certificates still lands on the certificates.
      const heading = page.locator('h2#certificates');
      await expect(heading).toHaveText(t.sections.certificates);
      await expect(page.locator(timeline).locator('h2#certificates')).toHaveCount(0);

      const list = page.locator('section[aria-labelledby="certificates"] > ul > li');
      await expect(list).toHaveCount(certificates.length);
      // In the order the site orders certificates: by date, the undated last.
      const ordered = [...certificates].sort(byDateAscending);
      await expect(list.first()).toContainText(ordered[0].name[locale]);
      await expect(list.last()).toContainText(ordered[ordered.length - 1].name[locale]);
    });

    test('meets the contrast criterion with the courses open', async ({ page, colorScheme }) => {
      // The contrast tests audit every page with its folds closed; the open
      // course list is the surface they cannot see.
      await page.goto(url);
      await page.evaluate(() => Promise.all(document.getAnimations().map((animation) => animation.finished)));
      await page.locator(`${timeline} details summary`).click();
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
      const found = results.violations.map((violation) => `${violation.id}: ${violation.help}`);
      expect(found, `${colorScheme} palette on ${url} with the courses open`).toEqual([]);
      expect(await page.evaluate(lowContrastPairs), `${colorScheme} palette on ${url} with the courses open`).toEqual(
        [],
      );
    });
  });

  test.describe(`${url} at 360 pixels wide`, () => {
    test.use({ viewport: { width: 360, height: 780 } });

    test('does not scroll horizontally with the courses open', async ({ page }) => {
      await page.goto(url);
      await page.evaluate(() => document.fonts.ready);
      await page.locator(`${timeline} details summary`).click();
      const width = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(width, `scrollWidth of ${url} with the courses open`).toBeLessThanOrEqual(360);
    });
  });

  test.describe(`${url} with JavaScript disabled`, () => {
    // Reduced motion with it, because the page's reveal is what a click waits
    // out and no script can be run to wait for it here.
    test.use({ javaScriptEnabled: false, reducedMotion: 'reduce' });

    test('opens the courses fold', async ({ page }) => {
      await page.goto(url);
      const fold = page.locator(`${timeline} details`);
      await fold.locator('summary').click();
      await expect(fold).toHaveAttribute('open', '');
      await expect(fold.locator('li')).toHaveCount(pending.courses!.length);
      await expect(fold.locator('li').first()).toBeVisible();
    });
  });
}
