import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test, type Page } from '@playwright/test';
import { parse as parseYaml } from 'yaml';
import { fill, plural, strings } from '../src/lib/i18n';
import { profileIcon } from '../src/lib/networks';
import { at, locales, type Locale } from './pages';

// The home page: the hero, the contact actions, the skill cards, and one card
// per section of the site. What the page says about the content is checked
// against src/content/ itself, read here the way scripts/check-dist.mjs reads
// it, so a count that drifts from the source fails rather than being believed.

const content = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'content');

// The YAML files of one collection that the site shows: every file that is not
// marked `visibility: hidden`, as scripts/check-dist.mjs puts it.
function visibleEntries(collection: string): string[] {
  const dir = path.join(content, collection);
  return readdirSync(dir)
    .filter((file) => file.endsWith('.yaml'))
    .filter((file) => !/^visibility:\s*hidden\s*$/m.test(readFileSync(path.join(dir, file), 'utf8')))
    .sort();
}

function entryData(...file: string[]): Record<string, any> {
  return parseYaml(readFileSync(path.join(content, ...file), 'utf8'));
}

const profile = entryData('profile.yaml').profile as {
  name: Record<Locale, string>;
  label: Record<Locale, string>;
  summary: Record<Locale, string>;
  location: Record<Locale, string>;
  email: string;
  profiles: { network: string; username: string; url: string }[];
};

const counted = {
  projects: visibleEntries('projects').length,
  experience: visibleEntries('experience').length,
  education: visibleEntries('education').length,
  certificates: visibleEntries('certificates').length,
};

const skillEntries = visibleEntries('skills').map((file) => entryData('skills', file));

// The line a section card shows for one collection, worded as the page words
// it: the number, and the form of the noun the language gives that number.
function countLine(locale: Locale, collection: keyof typeof counted): string {
  const t = strings[locale];
  const n = counted[collection];
  return fill(t.home.counts.line, { count: String(n), noun: plural(locale, n, t.home.counts.nouns[collection]) });
}

// Where each element sits in the document order of `main`, so reading order is
// asserted on the page rather than inferred from the template.
function positions(page: Page, selectors: string[]) {
  return page.evaluate((list) => {
    const nodes = Array.from(document.querySelectorAll('main, main *'));
    return list.map((selector) => {
      const element = document.querySelector(selector);
      return element ? nodes.indexOf(element) : -1;
    });
  }, selectors);
}

const reading = [
  'main h1',
  '[data-hero-label]',
  '[data-hero-summary]',
  '[data-contact-actions]',
  '[data-skill-grid]',
  '[data-section-grid]',
];

for (const locale of locales) {
  test.describe(`the home page in ${locale}`, () => {
    test('reads as a hero, then the contact actions, then the cards', async ({ page }) => {
      await page.goto(at(`/${locale}/`));

      await expect(page.locator('main h1')).toHaveText(profile.name[locale]);
      await expect(page.locator('[data-hero-label]')).toHaveText(profile.label[locale]);
      await expect(page.locator('[data-hero-summary]')).toHaveText(profile.summary[locale]);

      const found = await positions(page, reading);
      expect(found, `every part of ${reading.join(', ')} is on /${locale}/`).not.toContain(-1);
      for (let index = 1; index < found.length; index += 1) {
        expect(found[index], `${reading[index]} comes after ${reading[index - 1]}`).toBeGreaterThan(found[index - 1]!);
      }
    });

    test('says nothing the footer already says', async ({ page }) => {
      // Requirement 5: the contact details are actions, so the address is in
      // the link and the footer keeps its email line to itself.
      await page.goto(at(`/${locale}/`));
      const text = await page.locator('main').innerText();
      expect(text, `the email address in main on /${locale}/`).not.toContain(profile.email);
      await expect(page.locator('body > footer')).toContainText(profile.email);
    });

    test('offers the contact actions with icons and names', async ({ page }) => {
      await page.goto(at(`/${locale}/`));
      const actions = page.locator('[data-contact-actions] a');
      await expect(actions).toHaveCount(2 + profile.profiles.length);

      for (const action of await actions.all()) {
        await expect(action.locator('svg')).toHaveCount(1);
        await expect(action).toHaveAccessibleName(/\S/);
      }

      const email = page.locator('[data-contact="email"]');
      await expect(email).toHaveAttribute('href', `mailto:${profile.email}`);
      await expect(email.locator('svg')).toHaveAttribute('data-icon', 'mail');
      await expect(email).toHaveAccessibleName(strings[locale].home.email);

      const github = page.locator('[data-contact="github"]');
      await expect(github).toHaveAttribute('href', profile.profiles[0]!.url);
      await expect(github.locator('svg')).toHaveAttribute('data-icon', 'github');
      await expect(github).toHaveAccessibleName('GitHub');

      const cv = page.locator('[data-contact="cv"]');
      await expect(cv).toHaveAttribute('href', at(`/${locale}/cv/`));
      await expect(cv.locator('svg')).toHaveAttribute('data-icon', 'file');
      await expect(cv).toHaveAccessibleName(strings[locale].nav.cv);
    });

    test('shows every skill group as a card with its keywords', async ({ page }) => {
      await page.goto(at(`/${locale}/`));
      const cards = page.locator('[data-skill-card]');
      await expect(cards).toHaveCount(skillEntries.length);

      for (const entry of skillEntries) {
        const card = cards.filter({ has: page.getByRole('heading', { name: entry.name[locale], exact: true }) });
        await expect(card, `the card for ${entry.name.en}`).toHaveCount(1);
        await expect(card).toContainText(entry.keywords.join(strings[locale].listSeparator));
        if (entry.level) await expect(card).toContainText(entry.level[locale]);
      }
    });

    test('counts what each section holds', async ({ page }) => {
      await page.goto(at(`/${locale}/`));
      const cards = page.locator('[data-section-card]');
      await expect(cards).toHaveCount(3);

      const separator = strings[locale].listSeparator;
      const work = page.locator('[data-section-card="work"]');
      await expect(work).toHaveAttribute('href', at(`/${locale}/work/`));
      await expect(work.locator('[data-counts]')).toHaveText(
        [countLine(locale, 'projects'), countLine(locale, 'experience')].join(separator),
      );

      const education = page.locator('[data-section-card="education"]');
      await expect(education).toHaveAttribute('href', at(`/${locale}/education/`));
      await expect(education.locator('[data-counts]')).toHaveText(
        [countLine(locale, 'education'), countLine(locale, 'certificates')].join(separator),
      );

      // The CV is one document rather than a list of entries, so its card
      // says what it holds and counts nothing.
      const cv = page.locator('[data-section-card="cv"]');
      await expect(cv).toHaveAttribute('href', at(`/${locale}/cv/`));
      await expect(cv.locator('[data-counts]')).toHaveCount(0);
    });
  });
}

test('a network with a mark takes it, and one without falls back to the link icon', () => {
  // The only profile in the content source is GitHub; the fallback is what
  // every other network would render, so it is asserted where it is decided.
  expect(profileIcon('GitHub')).toBe('github');
  expect(profileIcon('github')).toBe('github');
  expect(profileIcon('Mastodon')).toBe('external-link');
});

// How many columns a grid lays out, from the browser rather than from the
// classes on it.
async function columnsOf(page: Page, selector: string): Promise<number> {
  return page
    .locator(selector)
    .evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(/\s+/).filter(Boolean).length);
}

const grids = { 'the skill grid': '[data-skill-grid]', 'the section grid': '[data-section-grid]' };

test.describe('the card grids at 360 pixels wide', () => {
  test.use({ viewport: { width: 360, height: 780 } });

  for (const locale of locales) {
    for (const [what, selector] of Object.entries(grids)) {
      test(`${what} is one column on /${locale}/`, async ({ page }) => {
        await page.goto(at(`/${locale}/`));
        expect(await columnsOf(page, selector)).toBe(1);
      });
    }
  }
});

test.describe('the card grids at 1440 pixels wide', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  for (const locale of locales) {
    for (const [what, selector] of Object.entries(grids)) {
      test(`${what} is two or more columns on /${locale}/`, async ({ page }) => {
        await page.goto(at(`/${locale}/`));
        expect(await columnsOf(page, selector)).toBeGreaterThanOrEqual(2);
      });
    }
  }

  test('the grids fill from the right in Arabic and from the left in English', async ({ page }) => {
    for (const [locale, direction] of [
      ['ar', 'right'],
      ['en', 'left'],
    ] as const) {
      await page.goto(at(`/${locale}/`));
      const cards = page.locator('[data-skill-card]');
      const first = await cards.first().boundingBox();
      const last = await cards.nth(1).boundingBox();
      expect(first, `the first skill card on /${locale}/`).not.toBeNull();
      if (direction === 'right') {
        expect(first!.x, `the first card starts at the right on /${locale}/`).toBeGreaterThan(last!.x);
      } else {
        expect(first!.x, `the first card starts at the left on /${locale}/`).toBeLessThan(last!.x);
      }
    }
  });
});
