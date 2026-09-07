import "server-only";

import { getDictionary } from "@/lib/i18n/dictionary";
import { createTranslator, type Messages, type Translator } from "@/lib/i18n/translate";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";

/**
 * Resolves the locale from a route param and returns a translator.
 * Every localised page calls this once at the top.
 */
export async function getTranslations(
  params: Promise<{ locale: string }> | { locale: string },
): Promise<{ locale: Locale; t: Translator }> {
  const resolved = await params;
  const locale: Locale = isLocale(resolved.locale) ? resolved.locale : defaultLocale;
  return { locale, t: createTranslator(getDictionary(locale) as unknown as Messages) };
}

export function translatorFor(locale: Locale): Translator {
  return createTranslator(getDictionary(locale) as unknown as Messages);
}
