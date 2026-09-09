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

export type Locale = 'en' | 'ar';

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
  },
  theme: {
    switchTo: 'Switch to',
    dark: 'Dark theme',
    light: 'Light theme',
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
  },
  theme: {
    switchTo: 'التبديل إلى',
    dark: 'الوضع الداكن',
    light: 'الوضع الفاتح',
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

export function formatPeriod(locale: Locale, period: { start: string; end?: string }): string {
  const start = formatDate(locale, period.start);
  const end = period.end ? formatDate(locale, period.end) : strings[locale].period.present;
  return `${start} ${strings[locale].period.to} ${end}`;
}
