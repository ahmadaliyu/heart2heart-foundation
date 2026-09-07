import "server-only";

import en from "@/messages/en.json";
import ha from "@/messages/ha.json";
import { defaultLocale, type Locale } from "@/lib/i18n/config";

/**
 * English is the source of truth for the message shape. Every other locale is
 * typed against it, so a missing or misspelt key in a translation file is a
 * compile error rather than a blank string in production.
 */
export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = {
  en,
  ha: ha as unknown as Dictionary,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}
