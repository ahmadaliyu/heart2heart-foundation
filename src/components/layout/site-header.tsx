"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { ThemeToggle } from "@/components/layout/theme";
import { ButtonLink, buttonClass, iconShift } from "@/components/ui/button";
import { useScrolled } from "@/components/motion";
import { useI18n } from "@/lib/i18n/client";
import { localePath, stripLocale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

/**
 * Six items, deliberately — the brief rules out crowded navigation, and the
 * one action that matters is a button, not a link lost among the others.
 */
const NAV = [
  { href: "/about", key: "nav.about" },
  { href: "/services", key: "nav.services" },
  { href: "/resources", key: "nav.resources" },
  { href: "/events", key: "nav.events" },
  { href: "/donate", key: "nav.donate" },
  { href: "/contact", key: "nav.contact" },
] as const;

export function SiteHeader() {
  const { locale, t } = useI18n();
  const pathname = usePathname();
  const current = stripLocale(pathname);
  const scrolled = useScrolled(20);
  const [open, setOpen] = useState(false);

  // The home page opens on a night-ground hero, so the header starts
  // transparent there and only takes a surface once the reader scrolls past it.
  const overHero = current === "/" && !scrolled && !open;

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => current === href || current.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-400 ease-[var(--ease-out-soft)]",
        overHero
          ? "border-b border-transparent bg-transparent"
          : "border-b border-line bg-surface/85 shadow-xs backdrop-blur-xl",
      )}
    >
      <div className="container-page flex h-18 items-center justify-between gap-6">
        <Link
          href={localePath(locale, "/")}
          className="shrink-0"
          aria-label={t("meta.name")}
        >
          <Logo size="sm" reversed={overHero} showSubtitle={false} />
        </Link>

        <nav aria-label="Main" className="hidden items-center xl:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={localePath(locale, item.href)}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "underline-grow rounded-md px-3 py-2 text-sm font-semibold transition-colors duration-250",
                overHero
                  ? "text-white/80 hover:text-white aria-[current=page]:text-white"
                  : "text-ink-muted hover:text-heading aria-[current=page]:text-heading",
              )}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <ThemeToggle
            tone={overHero ? "dark" : "light"}
            className="hidden sm:inline-flex"
          />

          <LocaleSwitcher
            tone={overHero ? "dark" : "light"}
            className="hidden sm:inline-flex"
          />

          <ButtonLink
            href={localePath(locale, "/counselling")}
            size="sm"
            variant={overHero ? "inverse" : "primary"}
            className="hidden sm:inline-flex"
          >
            {t("nav.getSupport")}
            <ArrowRight aria-hidden="true" className={cn("size-3.5", iconShift)} />
          </ButtonLink>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className={cn(
              "inline-flex size-11 items-center justify-center rounded-full border transition-colors xl:hidden",
              overHero
                ? "border-white/25 text-white hover:bg-white/10"
                : "border-line-strong text-ink hover:bg-tint",
            )}
          >
            <span className="sr-only">{t("common.menu")}</span>
            {open ? (
              <X aria-hidden="true" className="size-5" />
            ) : (
              <Menu aria-hidden="true" className="size-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile sheet. Items stagger in so the panel feels opened rather than
          switched on. */}
      {open ? (
        <div id="mobile-nav" className="border-t border-line bg-surface xl:hidden">
          <nav aria-label="Main" className="container-page flex flex-col py-5">
            {NAV.map((item, index) => (
              <Link
                key={item.href}
                href={localePath(locale, item.href)}
                aria-current={isActive(item.href) ? "page" : undefined}
                style={{ animationDelay: `${index * 45}ms` }}
                className={cn(
                  "enter flex items-center justify-between border-b border-line py-4 font-display text-xl transition-colors",
                  isActive(item.href) ? "text-brand-strong" : "text-ink hover:text-brand-strong",
                )}
              >
                {t(item.key)}
                <ArrowRight aria-hidden="true" className="size-4 text-plum-400" />
              </Link>
            ))}

            <Link
              href={localePath(locale, "/counselling")}
              style={{ animationDelay: "290ms" }}
              className={buttonClass({
                size: "lg",
                fullWidth: true,
                className: "enter mt-6",
              })}
            >
              {t("nav.getSupport")}
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>

            <div className="mt-5 flex items-center justify-between gap-4">
              <span className="eyebrow text-ink-faint">{t("meta.langLabel")}</span>
              <div className="flex items-center gap-2.5">
                <LocaleSwitcher />
                <ThemeToggle />
              </div>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
