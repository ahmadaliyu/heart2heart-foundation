/**
 * Locale configuration.
 *
 * Adding a language means adding an entry here and a matching JSON file in
 * src/messages — no page, route or component needs to change.
 */

export const locales = ["en", "ha"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, { native: string; english: string }> = {
  en: { native: "English", english: "English" },
  ha: { native: "Hausa", english: "Hausa" },
};

/** All locales currently read left-to-right; kept explicit for future additions. */
export const localeDirection: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  ha: "ltr",
};

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/** Strips a leading locale segment: "/ha/about" -> "/about". */
export function stripLocale(pathname: string): string {
  const segments = pathname.split("/");
  if (isLocale(segments[1])) {
    const rest = segments.slice(2).join("/");
    return rest ? `/${rest}` : "/";
  }
  return pathname;
}

/** Builds a locale-prefixed href: ("ha", "/about") -> "/ha/about". */
export function localePath(locale: Locale, path: string): string {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${clean}`;
}
