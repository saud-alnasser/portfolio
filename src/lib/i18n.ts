// Every string the interface shows, in both languages, keyed by locale. Content
// (names, summaries, dates) comes from src/content/; this file holds only the
// chrome around it: navigation labels, headings, status wordings, control
// labels. The Arabic is reviewed here without touching a template.
//
// Exports other pages and endpoints rely on:
//   Locale                  'en' | 'ar'
//   locales                 the locales with their direction and own name
//   strings[locale]         the UI strings for one locale
//   formatDate(locale, iso) a YYYY, YYYY-MM, or YYYY-MM-DD date for display
//   formatPeriod(locale, p) "start to end", or "start to present"
//   plural(locale, n, forms) the form of a noun that goes with a count

export type Locale = 'en' | 'ar';

// A noun that takes a count, in the forms the language distinguishes. Arabic
// has six; English needs two. `other` is the fallback every language ends in.
export type PluralForms = { other: string } & Partial<Record<Intl.LDMLPluralRule, string>>;

export const locales: ReadonlyArray<{
  code: Locale;
  dir: 'ltr' | 'rtl';
  // The language's name in itself, which is what a switch shows.
  name: string;
  // The Open Graph locale, in its language_TERRITORY form.
  ogLocale: string;
}> = [
  { code: 'en', dir: 'ltr', name: 'English', ogLocale: 'en_US' },
  { code: 'ar', dir: 'rtl', name: 'العربية', ogLocale: 'ar_SA' },
];

export function isLocale(value: unknown): value is Locale {
  return locales.some((l) => l.code === value);
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'en' ? 'ar' : 'en';
}

export function localeInfo(locale: Locale) {
  return locales.find((l) => l.code === locale)!;
}

const en = {
  skipToContent: 'Skip to content',
  nav: {
    label: 'Site',
    home: 'Home',
    work: 'Work',
    education: 'Education',
    cv: 'CV',
    // The language menu's accessible name.
    language: 'Language',
  },
  theme: {
    switchTo: 'Switch to',
    dark: 'Dark theme',
    light: 'Light theme',
  },
  // A card's fold: the control that shows or hides a list too long for the
  // card. {count} is the number and {noun} the form of the list's noun that
  // goes with it, from `nouns`.
  fold: {
    show: 'Show {count} {noun}',
    hide: 'Hide {count} {noun}',
    nouns: {
      courses: { one: 'course', other: 'courses' } as PluralForms,
      highlights: { one: 'highlight', other: 'highlights' } as PluralForms,
    },
  },
  titleSeparator: ' - ',
  // Between items of an inline list: technologies, courses, keywords.
  listSeparator: ', ',
  pages: {
    work: {
      title: 'Work',
      description: 'Projects and work experience of {name}.',
    },
    education: {
      title: 'Education',
      description: 'Studies and certificates of {name}.',
    },
  },
  home: {
    contact: 'Contact',
    email: 'Email',
    location: 'Location',
    sections: 'On this site',
    work: 'Projects and experience.',
    education: 'Studies and certificates.',
    cv: 'Experience, education, skills, and certifications on one page.',
    // What a section card says it holds: "19 projects", "27 certificates".
    // The count comes from the collection the section renders, never from
    // this file. {count} is the number and {noun} the form of the section's
    // noun that goes with it, from `nouns`.
    counts: {
      line: '{count} {noun}',
      nouns: {
        projects: { one: 'project', other: 'projects' } as PluralForms,
        experience: { one: 'position', other: 'positions' } as PluralForms,
        education: { one: 'institution', other: 'institutions' } as PluralForms,
        certificates: { one: 'certificate', other: 'certificates' } as PluralForms,
      },
    },
  },
  sections: {
    projects: 'Projects',
    experience: 'Experience',
    studies: 'Studies',
    certificates: 'Certificates',
    skills: 'Skills',
  },
  project: {
    repository: 'Repository',
    live: 'Live site',
    technologies: 'Technologies',
  },
  experience: {
    training: 'Practical training',
    highlights: 'Highlights',
  },
  education: {
    status: {
      completed: 'Completed',
      'certificate-pending': 'Course work completed, certificate pending',
      'in-progress': 'In progress',
    },
    courses: 'Courses',
    // The one node on the timeline that is not an institution: the phase of
    // online courses between school and university. It stands for every
    // certificate, so `count` says how many, with `noun` in the form the
    // number takes, and `link` leads to the certificates themselves.
    onlineCourses: {
      name: 'Online courses',
      count: '{count} {noun}',
      noun: { one: 'certificate', other: 'certificates' } as PluralForms,
      link: 'View the certificates',
    },
  },
  certificate: {
    view: 'View certificate',
  },
  // The CV page. Its section headings are the ones resume parsers expect;
  // the other sections reuse the site's headings above.
  cv: {
    title: 'Curriculum vitae',
    description:
      'The curriculum vitae of {name}: experience, education, skills, and certifications on one printable page, with PDF and JSON Resume downloads.',
    downloads: 'Downloads',
    downloadPdf: 'Download PDF',
    downloadJson: 'Download JSON Resume',
    summary: 'Summary',
    // The template names these two sections; the other headings on the page
    // are the site's own, above.
    experience: 'Work experience',
    skills: 'Key skills',
    certifications: 'Certifications',
  },
  period: {
    present: 'Present',
    to: 'to',
  },
};

export type Strings = typeof en;

// Drafted by an agent and awaiting Saud's review. Nothing here is published
// before he has read it.
const ar: Strings = {
  skipToContent: 'انتقل إلى المحتوى',
  nav: {
    label: 'الموقع',
    home: 'الرئيسية',
    work: 'الأعمال',
    education: 'التعليم',
    cv: 'السيرة الذاتية',
    language: 'اللغة',
  },
  theme: {
    switchTo: 'التبديل إلى',
    dark: 'الوضع الداكن',
    light: 'الوضع الفاتح',
  },
  fold: {
    show: 'عرض {count} {noun}',
    hide: 'إخفاء {count} {noun}',
    // The counted noun in the form Arabic gives each range: one, two, three
    // to ten, eleven to ninety-nine, and the rest.
    nouns: {
      courses: { one: 'مقرر', two: 'مقرران', few: 'مقررات', many: 'مقرراً', other: 'مقرر' },
      highlights: { one: 'مهمة', two: 'مهمتان', few: 'مهام', many: 'مهمة', other: 'مهمة' },
    },
  },
  titleSeparator: ' - ',
  listSeparator: '، ',
  pages: {
    work: {
      title: 'الأعمال',
      description: 'مشاريع {name} وخبراته العملية.',
    },
    education: {
      title: 'التعليم',
      description: 'دراسة {name} وشهاداته.',
    },
  },
  home: {
    contact: 'التواصل',
    email: 'البريد الإلكتروني',
    location: 'الموقع الجغرافي',
    sections: 'في هذا الموقع',
    work: 'المشاريع والخبرات العملية.',
    education: 'الدراسة والشهادات.',
    cv: 'الخبرة العملية والتعليم والمهارات والشهادات في صفحة واحدة.',
    counts: {
      line: '{count} {noun}',
      // The counted noun of each section, in the forms Arabic gives each
      // range: one, two, three to ten, eleven to ninety-nine, and the rest.
      nouns: {
        projects: { one: 'مشروع', two: 'مشروعان', few: 'مشاريع', many: 'مشروعاً', other: 'مشروع' },
        experience: { one: 'وظيفة', two: 'وظيفتان', few: 'وظائف', many: 'وظيفة', other: 'وظيفة' },
        education: { one: 'جهة تعليمية', two: 'جهتان تعليميتان', few: 'جهات تعليمية', many: 'جهة تعليمية', other: 'جهة تعليمية' },
        certificates: { one: 'شهادة', two: 'شهادتان', few: 'شهادات', many: 'شهادة', other: 'شهادة' },
      },
    },
  },
  sections: {
    projects: 'المشاريع',
    experience: 'الخبرة العملية',
    studies: 'الدراسة',
    certificates: 'الشهادات',
    skills: 'المهارات',
  },
  project: {
    repository: 'المستودع',
    live: 'الموقع المنشور',
    technologies: 'التقنيات',
  },
  experience: {
    training: 'تدريب عملي',
    highlights: 'أبرز المهام',
  },
  education: {
    status: {
      completed: 'مكتمل',
      'certificate-pending': 'اكتملت المقررات الدراسية، ولم تصدر الشهادة بعد',
      'in-progress': 'قيد الدراسة',
    },
    courses: 'المقررات',
    onlineCourses: {
      name: 'الدورات الإلكترونية',
      count: '{count} {noun}',
      // The counted noun in the form Arabic gives each range, as `fold` above.
      noun: { one: 'شهادة', two: 'شهادتان', few: 'شهادات', many: 'شهادةً', other: 'شهادة' },
      link: 'عرض الشهادات',
    },
  },
  certificate: {
    view: 'عرض الشهادة',
  },
  cv: {
    title: 'السيرة الذاتية',
    description:
      'سيرة {name} الذاتية: الخبرة العملية والتعليم والمهارات والشهادات في صفحة واحدة قابلة للطباعة، مع تنزيلها بصيغة PDF وبصيغة JSON Resume.',
    downloads: 'التنزيلات',
    downloadPdf: 'تنزيل PDF',
    downloadJson: 'تنزيل JSON Resume',
    summary: 'الملخص',
    experience: 'الخبرة العملية',
    skills: 'المهارات الأساسية',
    certifications: 'الشهادات',
  },
  period: {
    present: 'الآن',
    to: 'إلى',
  },
};

export const strings: Record<Locale, Strings> = { en, ar };

// Fills "{name}" and similar slots in a string.
export function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => values[key] ?? match);
}

// Dates are authored once, in the JSON Resume form, and only their display is
// per language. Both languages use the Gregorian calendar and Latin digits, so
// a year reads the same in both and matches what the content file says.
const dateLocale: Record<Locale, string> = {
  en: 'en-GB',
  ar: 'ar-SA-u-ca-gregory-nu-latn',
};

export function formatDate(locale: Locale, iso: string | number): string {
  // A bare year read straight from YAML is a number; the content contract
  // stringifies it, but a caller outside the build may not have.
  const parts = String(iso).split('-').map(Number);
  const [year, month, day] = parts;
  const date = new Date(Date.UTC(year!, (month ?? 1) - 1, day ?? 1));
  const options: Intl.DateTimeFormatOptions =
    parts.length === 3
      ? { year: 'numeric', month: 'short', day: 'numeric' }
      : parts.length === 2
        ? { year: 'numeric', month: 'short' }
        : { year: 'numeric' };
  return new Intl.DateTimeFormat(dateLocale[locale], { ...options, timeZone: 'UTC' }).format(date);
}

// The form of a noun that goes with a count, by the language's own rules:
// plural('ar', 21, nouns.courses) is the form for eleven to ninety-nine.
export function plural(locale: Locale, count: number, forms: PluralForms): string {
  return forms[new Intl.PluralRules(locale).select(count)] ?? forms.other;
}

export function formatPeriod(locale: Locale, period: { start: string; end?: string }): string {
  const start = formatDate(locale, period.start);
  const end = period.end ? formatDate(locale, period.end) : strings[locale].period.present;
  return `${start} ${strings[locale].period.to} ${end}`;
}
