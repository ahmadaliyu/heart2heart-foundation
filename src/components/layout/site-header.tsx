"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown, Menu, Search, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { useI18n } from "@/lib/i18n/client";
import { localePath, stripLocale } from "@/lib/i18n/config";

const navigation = [
  {
    href: "/about",
    key: "nav.about",
    description: "about.lede",
    links: [
      ["/about", "about.missionTitle"],
      ["/about#team", "about.teamTitle"],
      ["/safeguarding", "footer.safeguarding"],
      ["/privacy", "footer.privacy"],
    ],
  },
  {
    href: "/services",
    key: "nav.services",
    description: "services.lede",
    links: [
      ["/services#areas", "services.areasTitle"],
      ["/services#audiences", "services.audiencesTitle"],
      ["/services#how", "services.howTitle"],
    ],
  },
  {
    href: "/resources",
    key: "nav.resources",
    description: "resources.lede",
    links: [
      ["/resources#articles", "resources.articles"],
      ["/resources#videos", "resources.videos"],
      ["/resources#materials", "resources.materials"],
    ],
  },
  {
    href: "/events",
    key: "nav.events",
    description: "events.lede",
    links: [
      ["/events", "events.upcoming"],
      ["/events?period=past", "events.past"],
    ],
  },
  {
    href: "/contact",
    key: "nav.contact",
    description: "home.ctaBody",
    links: [],
  },
  {
    href: "/donate",
    key: "home.donateCta",
    description: "home.donateBody",
    links: [],
  },
] as const;

export function SiteHeader() {
  const { locale, t } = useI18n();
  const pathname = usePathname();
  const [mobile, setMobile] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const header = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const close = () => {
    setExpanded(null);
    setMobile(false);
  };
  useEffect(close, [pathname]);
  useEffect(() => {
    function dismiss(event: PointerEvent) {
      if (!header.current?.contains(event.target as Node)) close();
    }
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, []);
  const selected = navigation.find((item) => item.href === expanded);
  return (
    <header
      ref={header}
      className="bpa-header"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          close();
          menuButton.current?.focus();
        }
      }}
    >
      <div className="bpa-container bpa-topbar">
        <Link
          href={localePath(locale, "/")}
          aria-label={t("meta.name")}
          onClick={close}
        >
          <Logo size="md" />
        </Link>
        <div className="bpa-utilities">
          <Link
            className="utility-pill utility-primary"
            href={localePath(locale, "/emergency")}
          >
            {t("nav.emergency")}
          </Link>
          <Link className="utility-pill" href={localePath(locale, "/contact")}>
            {t("nav.contact")}
          </Link>
          <Link
            className="utility-search"
            href={localePath(locale, "/search")}
            aria-label={t("common.search")}
          >
            <Search size={23} />
          </Link>
          <LocaleSwitcher />
        </div>
        <button
          ref={menuButton}
          className="bpa-menu-toggle"
          aria-label={mobile ? t("common.close") : t("common.menu")}
          aria-expanded={mobile}
          aria-controls="site-navigation"
          onClick={() => {
            setMobile(!mobile);
            setExpanded(null);
          }}
        >
          {mobile ? <X /> : <Menu />}
        </button>
      </div>
      <div
        className={"bpa-navigation " + (mobile ? "is-open" : "")}
        id="site-navigation"
      >
        <nav className="bpa-container" aria-label={t("common.menu")}>
          {navigation.map((item) => (
            <div className="bpa-nav-item" key={item.href}>
              {item.links.length ? (
                <button
                  aria-expanded={expanded === item.href}
                  aria-controls={"menu-" + item.key}
                  className={
                    stripLocale(pathname).startsWith(item.href)
                      ? "is-current"
                      : ""
                  }
                  onClick={() =>
                    setExpanded(expanded === item.href ? null : item.href)
                  }
                >
                  {t(item.key)}
                  <ChevronDown size={15} />
                </button>
              ) : (
                <Link
                  href={localePath(locale, item.href)}
                  onClick={close}
                  aria-current={
                    stripLocale(pathname) === item.href ? "page" : undefined
                  }
                >
                  {t(item.key)}
                </Link>
              )}
              {item.links.length > 0 && expanded === item.href && (
                <div className="bpa-mobile-subnav">
                  <Link href={localePath(locale, item.href)} onClick={close}>
                    {t("common.viewAll")} <ArrowRight size={16} />
                  </Link>
                  {item.links.map(([href, key]) => (
                    <Link
                      key={href}
                      href={localePath(locale, href)}
                      onClick={close}
                    >
                      {t(key)}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="bpa-mobile-utilities">
            <Link href={localePath(locale, "/emergency")} onClick={close}>
              {t("nav.emergency")}
            </Link>
            <Link href={localePath(locale, "/search")} onClick={close}>
              {t("common.search")}
            </Link>
            <LocaleSwitcher />
          </div>
        </nav>
      </div>
      {selected && (
        <div className="bpa-mega" id={"menu-" + selected.key}>
          <div className="bpa-container">
            <div className="bpa-mega-feature">
              <div>
                <h2>{t(selected.key)}</h2>
                <p>{t(selected.description)}</p>
                <Link
                  className="bpa-button"
                  href={localePath(locale, selected.href)}
                  onClick={close}
                >
                  {t("common.learnMore")} <ArrowRight size={16} />
                </Link>
              </div>
            </div>
            <div className="bpa-mega-links">
              {selected.links.map(([href, key]) => (
                <Link
                  href={localePath(locale, href)}
                  key={href}
                  onClick={close}
                >
                  {t(key)} <ArrowRight size={16} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
