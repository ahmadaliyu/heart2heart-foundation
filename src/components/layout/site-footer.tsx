import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { ThemeToggle } from "@/components/layout/theme";
import { localePath, type Locale } from "@/lib/i18n/config";
import { translatorFor } from "@/lib/i18n/server";
import { foundationLine } from "@/lib/data";

const COLUMNS = [
  {
    heading: "footer.explore",
    links: [
      { href: "/about", key: "nav.about" },
      { href: "/services", key: "nav.services" },
      { href: "/resources", key: "nav.resources" },
      { href: "/events", key: "nav.events" },
    ],
  },
  {
    heading: "footer.support",
    links: [
      { href: "/counselling", key: "nav.getSupport" },
      { href: "/emergency", key: "nav.emergency" },
      { href: "/donate", key: "nav.donate" },
      { href: "/contact", key: "nav.contact" },
    ],
  },
  {
    heading: "footer.legal",
    links: [
      { href: "/privacy", key: "footer.privacy" },
      { href: "/safeguarding", key: "footer.safeguarding" },
      { href: "/accessibility", key: "footer.accessibility" },
      { href: "/terms", key: "footer.terms" },
    ],
  },
] as const;

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = translatorFor(locale);
  const line = foundationLine();
  const year = new Date().getFullYear();

  const contact = [
    { icon: MapPin, value: "Foundation Centre, Wuse II, Abuja", href: undefined },
    line
      ? { icon: Phone, value: line.phone, href: `tel:${line.phone.replace(/\s/g, "")}` }
      : null,
    { icon: Mail, value: "hello@heart2heart.ng", href: "mailto:hello@heart2heart.ng" },
  ].filter((row): row is NonNullable<typeof row> => row !== null);

  return (
    <footer className="relative bg-night-rich text-plum-200">
      {/* A hairline of amber across the top edge, so the footer reads as a
          deliberate close rather than the page simply running out. */}
      <div
        aria-hidden="true"
        className="h-px w-full bg-linear-to-r from-transparent via-amber-400/60 to-transparent"
      />

      <div className="container-page py-20">
        <div className="grid gap-14 lg:grid-cols-[1.5fr_repeat(3,1fr)] lg:gap-10">
          <div>
            <Logo reversed size="md" />
            <p className="mt-7 max-w-sm text-[0.9375rem] leading-relaxed text-plum-200/85">
              {t("footer.tagline")}
            </p>

            <ul className="mt-8 space-y-3.5">
              {contact.map((row) => (
                <li key={row.value} className="flex items-start gap-3 text-sm">
                  <row.icon
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-amber-400"
                  />
                  {row.href ? (
                    <a
                      href={row.href}
                      className="text-plum-200 transition-colors hover:text-white"
                    >
                      {row.value}
                    </a>
                  ) : (
                    <span className="text-plum-200">{row.value}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.heading} aria-label={t(column.heading)}>
              <h2 className="eyebrow text-amber-300">{t(column.heading)}</h2>
              <ul className="mt-6 space-y-3.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={localePath(locale, link.href)}
                      className="group inline-flex items-center gap-1.5 text-[0.9375rem] text-plum-200 transition-colors hover:text-white"
                    >
                      {t(link.key)}
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-3.5 opacity-0 transition-all duration-250 group-hover:translate-x-0.5 group-hover:opacity-70"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="eyebrow text-plum-300">{t("footer.emergencyNote")}</p>
            <p className="text-xs text-plum-300/80">
              © {year} {t("meta.name")}. {t("footer.rights")}
            </p>
          </div>
          <div className="flex items-center gap-5">
            <LocaleSwitcher tone="dark" />
            <ThemeToggle tone="dark" />
            <Link
              href={localePath(locale, "/portal/login")}
              className="eyebrow text-plum-300 transition-colors hover:text-white"
            >
              {t("nav.staffLogin")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
