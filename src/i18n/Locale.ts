export const Locales = {
  EnUS: "en-US",
  EsMX: "es-MX",
} as const;

export type Locale = (typeof Locales)[keyof typeof Locales];

export const DefaultLocale = Locales.EnUS;

export const LocaleLabels: Record<Locale, string> = {
  [Locales.EnUS]: "English",
  [Locales.EsMX]: "Español",
};

export const isLocale = (value: string): value is Locale =>
  value === Locales.EnUS || value === Locales.EsMX;

export const localeHref = (locale: Locale, path: `/${string}`) =>
  locale === DefaultLocale
    ? path
    : `/${locale}${path === "/" ? "" : path}`;
