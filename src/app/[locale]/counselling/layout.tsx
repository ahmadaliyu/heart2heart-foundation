import Link from "next/link";
import { notFound } from "next/navigation";
import { Lock } from "lucide-react";

import { EmergencyBar } from "@/components/layout/emergency-bar";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { ThemeToggle } from "@/components/layout/theme";
import { Logo } from "@/components/brand/logo";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale, localePath } from "@/lib/i18n/config";

/**
 * The counselling area gets its own, quieter chrome.
 *
 * No marketing navigation, no donate button, nothing to click away to by
 * accident — just the emergency pathway, the language switch and a standing
 * reminder that this part of the site is private. The whole subtree is
 * noindex, and next.config.ts sends no-store for these paths so no proxy or
 * service worker ever holds a copy.
 */
export const metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default async function CounsellingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <a href="#main" className="skip-link">
        {dict.common.skipToContent}
      </a>

      <EmergencyBar locale={locale} />

      <header className="border-b border-line bg-surface">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Link href={localePath(locale, "/")} aria-label={dict.meta.name}>
            <Logo size="sm" showSubtitle={false} />
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-full bg-tint px-3 py-1 text-xs font-semibold text-brand-strong sm:inline-flex">
              <Lock aria-hidden="true" className="size-3" />
              {dict.portal.common.confidential}
            </span>
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main id="main" className="flex-1">
        {children}
      </main>

      <footer className="border-t border-line bg-surface">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>{dict.footer.emergencyNote}</p>
          <div className="flex gap-4">
            <Link href={localePath(locale, "/privacy")} className="hover:underline">
              {dict.footer.privacy}
            </Link>
            <Link href={localePath(locale, "/safeguarding")} className="hover:underline">
              {dict.footer.safeguarding}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
