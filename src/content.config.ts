import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineCollection, z } from 'astro:content';
import { file, glob } from 'astro/loaders';

// The content contract. Every page and every CV output reads the collections
// declared here, and the build refuses an entry that does not fit. src/content/README.md
// documents the same fields for whoever edits the content.

// JSON Resume's own date pattern: YYYY, YYYY-MM, or YYYY-MM-DD. A date valid
// here is valid there, so the resume endpoint never has to reformat one.
// YAML reads an unquoted 2021-12-03 as a Date and a bare 2024 as a number, so
// both are turned back into the text that was written before the pattern runs.
export const iso8601 = z.preprocess(
  (value) => {
    if (value instanceof Date) return value.toISOString().slice(0, 10);
    if (typeof value === 'number') return String(value);
    return value;
  },
  z
    .string()
    .regex(
      /^([1-2][0-9]{3}-[0-1][0-9]-[0-3][0-9]|[1-2][0-9]{3}-[0-1][0-9]|[1-2][0-9]{3})$/,
      'a date is written YYYY, YYYY-MM, or YYYY-MM-DD',
    ),
);

// Text a visitor reads is authored per language. English is required; Arabic
// falls back to it, and the build reports the gap.
export const localized = z.object({
  en: z.string().min(1),
  ar: z.string().min(1).optional(),
});

// A link is a real URL or absent. An empty string fails JSON Resume's `uri`
// format, so it fails here first.
const url = z.string().url();

const period = z.object({
  start: iso8601,
  end: iso8601.optional(),
});

export const visibilities = ['public', 'described', 'hidden'] as const;
export const educationStatuses = ['completed', 'certificate-pending', 'in-progress'] as const;
export const experienceKinds = ['employment', 'training'] as const;
// Whether a project is finished. The education vocabulary where it fits:
// `certificate-pending` means nothing for a project and is not a value here.
export const projectStatuses = ['completed', 'in-progress'] as const;
// An online course completion, or a credential that is not one.
export const certificateKinds = ['course', 'certification'] as const;

export type Visibility = (typeof visibilities)[number];
export type ProjectStatus = (typeof projectStatuses)[number];
export type CertificateKind = (typeof certificateKinds)[number];

// Whether an entry appears on the short resume. Absent means no; the site
// reads it through src/lib/shown.ts and the JSON Resume document never
// carries it.
const resume = z.boolean().optional();

const profile = defineCollection({
  loader: file('./src/content/profile.yaml'),
  schema: z
    .object({
      name: localized,
      label: localized,
      summary: localized,
      // The resume's opening paragraph, and the only field it reads instead of
      // `summary`. One field served both documents until 2026-09-11, and what
      // it could say was decided by the resume's budget: the CV carries the
      // whole record while the resume carries two projects, so a paragraph
      // true of one names work the other has no entry for. Required, so the
      // resume cannot ship with a hole where its opening paragraph goes.
      resumeSummary: localized,
      email: z.string().email(),
      // Required, and authored as a fact rather than inferred from `location`:
      // a document that states a nationality is claiming one, and the two are
      // not the same thing for a person living where they do not hold it.
      nationality: localized,
      location: localized,
      profiles: z
        .array(
          z
            .object({
              network: z.string().min(1),
              username: z.string().min(1),
              url,
            })
            .strict(),
        )
        .default([]),
    })
    .strict(),
});

const projects = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/projects' }),
  schema: z
    .object({
      name: z.string().min(1),
      period,
      role: localized,
      summary: localized,
      technologies: z.array(z.string().min(1)),
      links: z
        .object({
          repository: url.optional(),
          live: url.optional(),
        })
        .strict()
        .optional(),
      visibility: z.enum(visibilities),
      // Required, so an entry cannot be finished by omission: a project is
      // shown only when it is `completed`, whatever its visibility says.
      status: z.enum(projectStatuses),
      resume,
      order: z.number().int().optional(),
    })
    .strict(),
});

const experience = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/experience' }),
  schema: z
    .object({
      organisation: localized,
      position: localized,
      location: localized,
      period,
      summary: localized,
      highlights: z.array(localized).default([]),
      kind: z.enum(experienceKinds),
    })
    .strict(),
});

const education = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/education' }),
  schema: z
    .object({
      institution: localized,
      area: localized,
      studyType: localized,
      period,
      status: z.enum(educationStatuses),
      courses: z.array(localized).optional(),
    })
    .strict(),
});

// A certificate's document: the path of its PDF relative to the certificates
// directory, as `files/code-with-mosh-react.pdf`, with its preview,
// `files/code-with-mosh-react.webp`, rendered beside it by
// `pnpm certificates:previews`. Both must exist, so an entry naming a file
// that is not there fails the build naming the file rather than shipping a
// dead link or a blank card, and a PDF added without its preview fails the
// same way until the command has run.
const certificatesDirectory = fileURLToPath(new URL('./content/certificates/', import.meta.url));
const certificateDocument = z
  .string()
  .regex(/^files\/[^/\\]+\.pdf$/, 'a document is written files/<name>.pdf')
  .superRefine((value, context) => {
    for (const relative of [value, value.replace(/\.pdf$/, '.webp')]) {
      if (!existsSync(path.join(certificatesDirectory, relative))) {
        context.addIssue({ code: 'custom', message: `${relative} does not exist under src/content/certificates/` });
      }
    }
  });

const certificates = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/certificates' }),
  schema: z
    .object({
      name: localized,
      issuer: z.string().min(1),
      // Required: the courses grid and the certifications grid are split on
      // it, so an entry without one has no place to render.
      kind: z.enum(certificateKinds),
      date: iso8601.optional(),
      url: url.optional(),
      document: certificateDocument.optional(),
      resume,
    })
    .strict(),
});

const skills = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/skills' }),
  schema: z
    .object({
      name: localized,
      keywords: z.array(z.string().min(1)),
      level: localized.optional(),
      order: z.number().int().optional(),
    })
    .strict(),
});

export const collections = { profile, projects, experience, education, certificates, skills };
