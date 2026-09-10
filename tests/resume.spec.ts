import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test, type Page } from '@playwright/test';
import { parse as parseYaml } from 'yaml';
import { formatPeriod, strings } from '../src/lib/i18n';
import { isCertification, isCourse, isShown, onResume } from '../src/lib/shown';
import { at, locales, type Locale } from './pages';

// The two documents: the CV, which holds everything the site shows, and the
// one-page resume, which holds what an application needs. Both are one
// component (src/components/CvDocument.astro), so what is asserted here is
// the part that differs: which sections each prints, in what order, and which
// entries each carries. The expectations are read from src/content/ itself,
// the way scripts/check-dist.mjs reads it, so a document that drifts from the
// source fails rather than being believed.

const content = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'content');

// The entries of one collection, parsed. They arrive untyped, as they do in
// scripts/check-dist.mjs, and are handed to the same predicates the site
// filters through (src/lib/shown.ts).
function entries(collection: string): any[] {
  const dir = path.join(content, collection);
  return readdirSync(dir)
    .filter((file) => file.endsWith('.yaml'))
    .sort()
    .map((file) => parseYaml(readFileSync(path.join(dir, file), 'utf8')));
}

const projects = entries('projects').filter((data) => isShown(data));
const certificates = entries('certificates');

const expected = {
  cv: {
    sections: ['summary', 'experience', 'education', 'skills', 'certifications', 'courses', 'projects'],
    projects: projects.length,
    certifications: certificates.filter((data) => isCertification(data)).length,
    courses: certificates.filter((data) => isCourse(data)).length,
  },
  resume: {
    // A marked certificate is optional and none is marked today, so the
    // section is expected only when the content carries one.
    sections: ['summary', 'experience', 'education', 'skills', 'projects'].concat(
      certificates.some((data) => onResume(data)) ? ['certifications'] : [],
    ),
    projects: projects.filter((data) => onResume(data)).length,
    certifications: certificates.filter((data) => onResume(data)).length,
    courses: 0,
  },
} as const;

// The course list under an education entry, in one language: the block the CV
// keeps and the resume drops. Each course is authored as an { en, ar } map.
function courseNames(locale: Locale): string[] {
  return entries('education').flatMap((data) => (data.courses ?? []).map((course: any) => course[locale] ?? course.en));
}

// The sections of a document, in the order the page prints them.
function sectionsOf(page: Page): Promise<string[]> {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll('article.cv [data-cv-section]')).map(
      (element) => element.getAttribute('data-cv-section') ?? '',
    ),
  );
}

for (const locale of locales) {
  for (const variant of ['cv', 'resume'] as const) {
    test.describe(`the ${variant} page in ${locale}`, () => {
      const route = at(`/${locale}/${variant}/`);

      test('prints its sections in the order the template fixes', async ({ page }) => {
        await page.goto(route);
        expect(await sectionsOf(page), `the sections of ${route}`).toEqual([...expected[variant].sections]);
      });

      test('carries exactly the entries the content marks for it', async ({ page }) => {
        await page.goto(route);
        const counts = expected[variant];
        await expect(page.locator('[data-cv-section="projects"] > ol > li')).toHaveCount(counts.projects);
        await expect(page.locator('[data-cv-section="certifications"] > ul > li')).toHaveCount(counts.certifications);
        await expect(page.locator('[data-cv-section="courses"] > ul > li')).toHaveCount(counts.courses);

        // Named, not only counted: the resume carries the two projects the
        // content marks and neither of the others.
        for (const project of projects) {
          const shown = variant === 'cv' || onResume(project);
          const heading = page.getByRole('heading', { name: project.name, exact: true });
          await expect(heading, `${project.name} on ${route}`).toHaveCount(shown ? 1 : 0);
        }
      });

      test('links its own PDF and the other document', async ({ page }) => {
        await page.goto(route);
        await expect(page.locator('[data-document-link="pdf"]')).toHaveAttribute(
          'href',
          at(`/${variant}.${locale}.pdf`),
        );
        const other = variant === 'cv' ? 'resume' : 'cv';
        await expect(page.locator(`[data-document-link="${other}"]`)).toHaveAttribute(
          'href',
          at(`/${locale}/${other}/`),
        );
      });
    });
  }

  test(`the CV page in ${locale} keeps its JSON Resume link and its course list`, async ({ page }) => {
    await page.goto(at(`/${locale}/cv/`));
    await expect(page.locator('[data-document-link="json"]')).toHaveAttribute(
      'href',
      at(`/${locale}/resume.json`),
    );
    // The course list under the education entry is what the resume drops.
    const course = courseNames(locale)[0];
    if (course) await expect(page.locator('[data-cv-section="education"]')).toContainText(course);
  });

  test(`the resume page in ${locale} is compact, drops the course list, and lists a skill group per line`, async ({
    page,
  }) => {
    await page.goto(at(`/${locale}/resume/`));
    await expect(page.locator('article.cv.cv-compact')).toHaveCount(1);

    const course = courseNames(locale)[0];
    if (course) await expect(page.locator('[data-cv-section="education"]')).not.toContainText(course);

    // One line per group rather than the CV's keyword columns, so the count
    // is the number of skill groups and each line names its group.
    const skills = entries('skills');
    const lines = page.locator('[data-cv-section="skills"] > ul > li');
    await expect(lines).toHaveCount(skills.length);
    await expect(page.locator('[data-cv-section="skills"] .cv-skills')).toHaveCount(0);
  });

  // The shorter project entry, which is a third of what buys the one page.
  // Asserted on both documents at once, because what matters is the
  // difference: the resume prints the name, the period, the role, and the
  // summary, and the CV prints those and the two lines the resume drops.
  test(`a project entry in ${locale} keeps its technologies and repository on the CV and drops them on the resume`, async ({
    page,
  }) => {
    const t = strings[locale];
    const marked = projects.filter((data) => onResume(data));

    await page.goto(at(`/${locale}/cv/`));
    for (const project of marked) {
      const entry = page.locator('[data-cv-section="projects"] > ol > li', { hasText: project.name });
      await expect(entry, `${project.name} on the CV`).toContainText(t.project.technologies);
      await expect(entry.locator(`a[href="${project.links.repository}"]`)).toHaveCount(1);
    }

    await page.goto(at(`/${locale}/resume/`));
    for (const project of marked) {
      const entry = page.locator('[data-cv-section="projects"] > ol > li', { hasText: project.name });
      // The four lines it does print, and nothing after them.
      await expect(entry.locator('h3')).toHaveText(project.name);
      await expect(entry.locator('p')).toHaveText([
        formatPeriod(locale, project.period),
        // The Arabic of a project field is optional in the contract, so the
        // page falls back to the English (src/lib/localized.ts) and the
        // expectation has to fall back with it, as line 56 does above.
        project.role[locale] ?? project.role.en,
        project.summary[locale] ?? project.summary.en,
      ]);
      await expect(entry, `${project.name} on the resume`).not.toContainText(t.project.technologies);
      await expect(entry.locator(`a[href="${project.links.repository}"]`)).toHaveCount(0);
    }
  });
}
