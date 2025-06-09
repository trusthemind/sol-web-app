import type { Locale } from "./i18n";

type TranslationKeys = {
  [key: string]: string | TranslationKeys;
};

let translationsCache: Record<Locale, TranslationKeys> = {} as Record<Locale, TranslationKeys>;

export async function getTranslations(locale: Locale): Promise<TranslationKeys> {
  if (translationsCache[locale]) {
    return translationsCache[locale];
  }

  try {
    // Load translations from public folder
    const response = await fetch(`/locales/${locale}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load translations for ${locale}`);
    }
    
    const translations = await response.json();
    translationsCache[locale] = translations;
    return translations;
  } catch (error) {
    console.error(`Error loading translations for ${locale}:`, error);
    // Fallback to empty object
    return {};
  }
}

export function clearTranslationsCache() {
  translationsCache = {} as Record<Locale, TranslationKeys>;
}