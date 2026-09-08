import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

// The mapper from the content collections to a JSON Resume document for one
// language. The pages and the CV page read the same collections, so a value
// changed in one content file changes here without a second edit.
//
// Custom keys (`type` on a work entry, `status` on an education entry,
// `language` under `meta`) live inside section entries or inside `meta`, never
// at the top level: every 1.x schema permits them there, and the v1.0.0
// document that the project's own samples still cite forbids them at the root.
// See .aep/efforts/1-portfolio-site/evidence/research/json-resume-schema.md.

export const locales = ['en', 'ar'] as const;
export type Locale = (typeof locales)[number];

// The schema this document is written against. The property set is 1.3.1's,
// published from the monorepo; the archived repository's v1.0.0 URL, which the
// package's samples cite, is a stricter, older document.
export const schemaUrl =
  'https://raw.githubusercontent.com/jsonresume/jsonresume.org/master/packages/schema/schema.json';
const schemaVersion = 'v1.3.1';

// Read once per build, so both language documents carry the same time.
const buildTime = new Date();

type Localized = { en: string; ar?: string };

// Per-language text with a fallback to English. Ticket 05 is writing a shared
// `src/lib/localized.ts` in parallel; this local copy is reconciled with it at
// integration and exists only so this module builds on its own.
function pick(text: Localized, locale: Locale): string {
  return text[locale] ?? text.en;
}

function pickAll(texts: Localized[] | undefined, locale: Locale): string[] | undefined {
  if (!texts || texts.length === 0) return undefined;
  return texts.map((text) => pick(text, locale));
}

// A key with an undefined value is dropped by JSON.stringify, so the emitted
// document omits absent optional fields rather than carrying null or "".
function compact<T extends Record<string, unknown>>(record: T): T {
  return Object.fromEntries(Object.entries(record).filter(([, value]) => value !== undefined)) as T;
}

// A date in the content is YYYY, YYYY-MM, or YYYY-MM-DD; padded to one width
// the three forms compare correctly as strings.
function dateKey(date: string | undefined): string {
  return (date ?? '').padEnd(10, '0');
}

function byStartAscending<T extends { id: string; data: { period: { start: string } } }>(a: T, b: T): number {
  return dateKey(a.data.period.start).localeCompare(dateKey(b.data.period.start)) || a.id.localeCompare(b.id);
}

function byOrder<T extends { id: string; data: { order?: number } }>(a: T, b: T): number {
  const orderA = a.data.order ?? Number.POSITIVE_INFINITY;
  const orderB = b.data.order ?? Number.POSITIVE_INFINITY;
  if (orderA !== orderB) return orderA - orderB;
  return 0;
}

type Project = CollectionEntry<'projects'>;
type Experience = CollectionEntry<'experience'>;
type Education = CollectionEntry<'education'>;
type Certificate = CollectionEntry<'certificates'>;
type Skill = CollectionEntry<'skills'>;

// A project's public link: `live` first, then `repository`, and only for a
// public project. A described project carries no `url` key at all, because an
// empty string fails the schema's `format: uri`.
function projectUrl(project: Project): string | undefined {
  if (project.data.visibility !== 'public') return undefined;
  return project.data.links?.live ?? project.data.links?.repository;
}

function mapProject(project: Project, locale: Locale) {
  const { data } = project;
  return compact({
    name: data.name,
    description: pick(data.summary, locale),
    roles: [pick(data.role, locale)],
    keywords: data.technologies,
    startDate: data.period.start,
    endDate: data.period.end,
    url: projectUrl(project),
  });
}

function mapWork(entry: Experience, locale: Locale) {
  const { data } = entry;
  return compact({
    name: pick(data.organisation, locale),
    position: pick(data.position, locale),
    location: pick(data.location, locale),
    startDate: data.period.start,
    endDate: data.period.end,
    summary: pick(data.summary, locale),
    highlights: data.highlights.map((highlight) => pick(highlight, locale)),
    // Custom key: `employment` or `training`. The schema has no field for the
    // nature of a placement, so it is carried here beside `position`.
    type: data.kind,
  });
}

function mapEducation(entry: Education, locale: Locale) {
  const { data } = entry;
  return compact({
    institution: pick(data.institution, locale),
    area: pick(data.area, locale),
    studyType: pick(data.studyType, locale),
    startDate: data.period.start,
    // For a pending certificate this is the completion term of the course work,
    // and `status` below says the certificate is not yet issued.
    endDate: data.period.end,
    courses: pickAll(data.courses, locale),
    // Custom key: the academic status as authored, never reworded.
    status: data.status,
  });
}

function mapCertificate(entry: Certificate, locale: Locale) {
  const { data } = entry;
  return compact({
    name: pick(data.name, locale),
    issuer: data.issuer,
    date: data.date,
    url: data.url,
  });
}

function mapSkill(entry: Skill, locale: Locale) {
  const { data } = entry;
  return compact({
    name: pick(data.name, locale),
    level: data.level ? pick(data.level, locale) : undefined,
    keywords: data.keywords,
  });
}

// The document for one language. `site` is the site's address, from which the
// document's own canonical address is derived.
export async function resumeFor(locale: Locale, site: URL) {
  const profile = await getEntry('profile', 'profile');
  if (!profile) throw new Error('resume: the profile entry is missing from src/content/profile.yaml');

  const [projects, experience, education, certificates, skills] = await Promise.all([
    getCollection('projects', ({ data }) => data.visibility !== 'hidden'),
    getCollection('experience'),
    getCollection('education'),
    getCollection('certificates'),
    getCollection('skills'),
  ]);

  // Work newest first; education oldest first, so high school precedes
  // university; certificates by date with undated ones last; projects and
  // skills by their authored order, then projects newest first.
  experience.sort((a, b) => byStartAscending(b, a));
  education.sort(byStartAscending);
  certificates.sort(
    (a, b) => dateKey(a.data.date ?? '9999').localeCompare(dateKey(b.data.date ?? '9999')) || a.id.localeCompare(b.id),
  );
  projects.sort((a, b) => byOrder(a, b) || byStartAscending(b, a));
  skills.sort((a, b) => byOrder(a, b) || a.id.localeCompare(b.id));

  const { data: person } = profile;

  return {
    $schema: schemaUrl,
    basics: {
      name: pick(person.name, locale),
      label: pick(person.label, locale),
      email: person.email,
      url: site.href,
      summary: pick(person.summary, locale),
      // The content source carries one localized location text, so it goes in
      // `city` as written; there is no separate region or country code to map.
      location: { city: pick(person.location, locale) },
      profiles: person.profiles.map(({ network, username, url }) => ({ network, username, url })),
    },
    work: experience.map((entry) => mapWork(entry, locale)),
    education: education.map((entry) => mapEducation(entry, locale)),
    certificates: certificates.map((entry) => mapCertificate(entry, locale)),
    skills: skills.map((entry) => mapSkill(entry, locale)),
    projects: projects.map((entry) => mapProject(entry, locale)),
    meta: {
      canonical: new URL(`/${locale}/resume.json`, site).href,
      version: schemaVersion,
      // YYYY-MM-DDThh:mm:ss, the form the schema's description names, in UTC.
      lastModified: buildTime.toISOString().slice(0, 19),
      // Custom key: the language of every text field in this document.
      language: locale,
    },
  };
}

export type Resume = Awaited<ReturnType<typeof resumeFor>>;
