export const locales = ["en", "ua"] as const;
export const defaultLocale = "en" as const;
export type Locale = (typeof locales)[number];

export const localeLabels = {
  en: "English",
  ua: "Українська",
} as const;