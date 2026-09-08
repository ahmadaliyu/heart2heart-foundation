"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CalendarDays,
  FolderOpen,
  Inbox,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Menu,
  Newspaper,
  Search,
  Settings,
  Users,
  Wallet,
  X,
} from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { ThemeToggle } from "@/components/layout/theme";
import { signOut } from "@/app/[locale]/portal/session-actions";
import { useI18n } from "@/lib/i18n/client";
import { localePath, stripLocale } from "@/lib/i18n/config";
import type { StaffUser } from "@/lib/types";
import { cn, initials } from "@/lib/utils";

const ICONS = {
  dashboard: LayoutDashboard,
  requests: Inbox,
  appointments: CalendarDays,
  cases: FolderOpen,
  content: Newspaper,
  events: CalendarDays,
  donations: Wallet,
  emergency: LifeBuoy,
  users: Users,
  settings: Settings,
} as const;

type NavKey = keyof typeof ICONS;
interface Group {
  label: string;
  items: { key: NavKey; href: string }[];
}

/**
 * Navigation is grouped, not a flat list of ten links.
 *
 * Grouping is what turns an admin panel into a tool someone can hold in their
 * head: the clinical surfaces sit together, the operational ones sit together,
 * and a therapist simply never sees the second set. The API has to enforce the
 * same boundary — a hidden link is a courtesy, not a control.
 */
const GROUPS: Record<StaffUser["role"], Group[]> = {
  THERAPIST: [
    { label: "Overview", items: [{ key: "dashboard", href: "/portal/dashboard" }] },
    {
      label: "Counselling",
      items: [
        { key: "requests", href: "/portal/requests" },
        { key: "appointments", href: "/portal/appointments" },
        { key: "cases", href: "/portal/cases" },
      ],
    },
  ],
  ADMIN: [
    { label: "Overview", items: [{ key: "dashboard", href: "/portal/dashboard" }] },
    {
      label: "Counselling",
      items: [
        { key: "requests", href: "/portal/requests" },
        { key: "appointments", href: "/portal/appointments" },
        { key: "cases", href: "/portal/cases" },
      ],
    },
    {
      label: "Foundation",
      items: [
        { key: "content", href: "/portal/content" },
        { key: "events", href: "/portal/events" },
        { key: "donations", href: "/portal/donations" },
        { key: "emergency", href: "/portal/emergency" },
      ],
    },
    {
      label: "Administration",
      items: [
        { key: "users", href: "/portal/users" },
        { key: "settings", href: "/portal/settings" },
      ],
    },
  ],
};

export function PortalShell({
  user,
  children,
}: {
  user: StaffUser;
  children: React.ReactNode;
}) {
  const { locale, t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const current = stripLocale(pathname);

  useEffect(() => setOpen(false), [pathname]);

  async function endSession() {
    await signOut();
    router.push(localePath(locale, "/portal/login"));
    router.refresh();
  }

  const isActive = (href: string) => current === href || current.startsWith(`${href}/`);

  const rail = (
    <div className="flex h-full flex-col">
      <div className="px-6 pb-6 pt-7">
        <Link href={localePath(locale, "/portal/dashboard")}>
          <Logo reversed size="sm" showSubtitle={false} />
        </Link>
        <p className="eyebrow mt-3 text-amber-300">{t("portal.title")}</p>
      </div>

      {/* Real search: submits to the requests list, which filters on `q`. */}
      <form
        action={localePath(locale, "/portal/requests")}
        className="relative px-4 pb-5"
      >
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-7 top-1/2 size-4 -translate-y-1/2 text-plum-300"
        />
        <input
          type="search"
          name="q"
          placeholder={t("portal.requests.search")}
          aria-label={t("portal.requests.search")}
          className="h-10 w-full rounded-full border border-white/12 bg-white/6 pl-10 pr-3 text-sm text-white placeholder:text-plum-300 focus-visible:border-white/30"
        />
      </form>

      <nav aria-label={t("portal.title")} className="flex-1 space-y-7 overflow-y-auto px-4 pb-6">
        {GROUPS[user.role].map((group) => (
          <div key={group.label}>
            <p className="eyebrow px-3 pb-3 text-plum-300/70">{group.label}</p>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const Icon = ICONS[item.key];
                const active = isActive(item.href);
                return (
                  <li key={item.href} className="relative">
                    {/* Amber marker on the active row — colour alone never
                        carries state here. */}
                    {active ? (
                      <span
                        aria-hidden="true"
                        className="absolute -left-2.5 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-amber-400"
                      />
                    ) : null}
                    <Link
                      href={localePath(locale, item.href)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors duration-200",
                        active
                          ? "bg-white/12 font-semibold text-white"
                          : "font-medium text-plum-200 hover:bg-white/6 hover:text-white",
                      )}
                    >
                      <Icon
                        aria-hidden="true"
                        className={cn("size-4 shrink-0", active ? "text-amber-300" : "text-plum-300")}
                      />
                      {t(`portal.nav.${item.key}`)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-white/6 p-3">
          <span
            aria-hidden="true"
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-plum-950"
          >
            {initials(user.name)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-white">
              {user.name}
            </span>
            <span className="eyebrow block truncate text-plum-300">
              {t(`portal.users.roles.${user.role}`)}
            </span>
          </span>
          <button
            type="button"
            onClick={endSession}
            className="shrink-0 rounded-lg p-2 text-plum-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <span className="sr-only">{t("portal.nav.signOut")}</span>
            <LogOut aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh bg-canvas lg:flex">
      <aside className="hidden w-72 shrink-0 bg-night-rich lg:block">
        <div className="sticky top-0 h-dvh">{rail}</div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-line bg-surface/85 backdrop-blur-xl">
          <div className="flex h-14 items-center justify-between gap-4 px-5 lg:px-8">
            <div className="flex items-center gap-3 lg:hidden">
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                className="inline-flex size-10 items-center justify-center rounded-full border border-line-strong"
              >
                <span className="sr-only">{t("common.menu")}</span>
                {open ? (
                  <X aria-hidden="true" className="size-5" />
                ) : (
                  <Menu aria-hidden="true" className="size-5" />
                )}
              </button>
              <Logo size="sm" showSubtitle={false} />
            </div>

            <p className="eyebrow hidden items-center gap-2 text-ink-faint lg:flex">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-success" />
              {t("portal.common.confidential")}
              <span aria-hidden="true">·</span>
              {t("portal.common.accessLogged")}
            </p>

            <div className="flex items-center gap-2.5">
              <LocaleSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </header>

        {open ? (
          <div className="bg-night-rich lg:hidden">{rail}</div>
        ) : null}

        <main className="flex-1 px-5 py-8 lg:px-8 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
