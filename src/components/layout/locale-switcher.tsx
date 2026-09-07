"use client";

import { usePathname, useRouter } from "next/navigation";
import { localeNames, locales, stripLocale, type Locale } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";

/**
 * Switching language keeps the reader on the same page rather than dropping
 * them at the home page — which matters most in the counselling flow, where
 * losing your place is the last thing you want.
 */
export function LocaleSwitcher({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { locale, t } = useI18n();

  function switchTo(next: Locale) {
    if (next === locale) return;
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000; samesite=lax`;
    const rest = stripLocale(pathname);
    router.push(`/${next}${rest === "/" ? "" : rest}`);
    router.refresh();
  }

  return (
    <div
      role="group"
      aria-label={t("meta.langLabel")}
      className={cn(
        "inline-flex items-center rounded-full border p-0.5",
        tone === "dark" ? "border-white/20 bg-white/8" : "border-line bg-surface",
        className,
      )}
    >
      {locales.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            onClick={() => switchTo(code)}
            aria-current={active ? "true" : undefined}
            className={cn(
              "eyebrow rounded-full px-2.5 py-1.5 transition-colors duration-200",
              active
                ? tone === "dark"
                  ? "bg-white text-plum-900"
                  : "bg-plum-700 text-white"
                : tone === "dark"
                  ? "text-white/60 hover:text-white"
                  : "text-ink-faint hover:text-brand-strong",
            )}
          >
            <span className="sr-only">{localeNames[code].english}</span>
            <span aria-hidden="true">{code.toUpperCase()}</span>
          </button>
        );
      })}
    </div>
  );
}
