"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getTranslations } from "../../lib/translation";
import type { Locale } from "@/src/lib/i18n";

type TranslationKeys = {
  [key: string]: string | TranslationKeys;
};

export function useTranslation() {
  const params = useParams();
  const locale = (params?.locale as Locale) || "en";
  const [translations, setTranslations] = useState<TranslationKeys>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTranslations() {
      setIsLoading(true);
      try {
        const t = await getTranslations(locale);
        setTranslations(t);
      } catch (error) {
        console.error("Failed to load translations:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadTranslations();
  }, [locale]);

  const t = (key: string, fallback?: string): string => {
    const keys = key.split(".");
    let value: any = translations;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return fallback || key;
      }
    }

    return typeof value === "string" ? value : fallback || key;
  };

  return { t, locale, isLoading };
}
