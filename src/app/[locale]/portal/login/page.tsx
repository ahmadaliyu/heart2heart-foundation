import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Lock, ShieldCheck } from "lucide-react";

import { getTranslations } from "@/lib/i18n/server";
import { localePath, type Locale } from "@/lib/i18n/config";
import { Logo } from "@/components/brand/logo";
import { Card } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/section";
import { LoginForm } from "@/components/portal/login-form";
import { demoAccounts, getSession } from "@/lib/session";

export default async function PortalLoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await getTranslations(params);
  const session = await getSession();
  if (session) redirect(localePath(locale as Locale, "/portal/dashboard"));

  return (
    <div className="relative min-h-dvh overflow-hidden bg-night-rich">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="drift absolute -left-40 top-0 size-[32rem] rounded-full bg-plum-500/25 blur-[110px]" />
      </div>

      <div className="container-page relative grid min-h-dvh items-center gap-16 py-14 lg:grid-cols-2 lg:gap-24">
        {/* The left half exists to make it obvious, before anyone types, what
            kind of data sits behind this screen. */}
        <div className="hidden lg:block">
          <Logo reversed size="md" />

          <h1 className="mt-14 max-w-lg text-display text-white">
            {t("portal.login.title")}
          </h1>
          <p className="mt-6 max-w-md text-lead text-plum-200">
            {t("portal.login.lede")}
          </p>

          <div className="mt-14 flex max-w-md gap-4 rounded-panel border border-white/12 bg-white/6 p-6">
            <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-amber-400" />
            <p className="text-sm leading-relaxed text-plum-100">
              {t("portal.login.confidentialityNote")}
            </p>
          </div>

          <Link
            href={localePath(locale as Locale, "/")}
            className="mt-12 inline-flex items-center gap-2 text-sm font-semibold text-plum-300 transition-colors hover:text-white"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            {t("portal.login.backToSite")}
          </Link>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 text-center lg:hidden">
            <Logo reversed size="sm" className="justify-center" />
          </div>

          <Card className="rounded-panel p-7 shadow-lg sm:p-9">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-tint text-brand">
              <Lock aria-hidden="true" className="size-5" />
            </span>

            <Eyebrow className="mt-7">{t("portal.title")}</Eyebrow>
            <h2 className="mt-4 text-title">{t("portal.login.title")}</h2>

            <div className="mt-8">
              <LoginForm accounts={demoAccounts()} />
            </div>
          </Card>

          <p className="mt-8 text-center text-xs leading-relaxed text-plum-300 lg:hidden">
            {t("portal.login.confidentialityNote")}
          </p>
        </div>
      </div>
    </div>
  );
}
