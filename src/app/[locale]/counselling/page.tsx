import Link from "next/link";
import { ArrowRight, Clock, GraduationCap, HeartHandshake, Lock, ShieldCheck } from "lucide-react";

import { getTranslations } from "@/lib/i18n/server";
import { localePath } from "@/lib/i18n/config";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";

export default async function CounsellingLandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await getTranslations(params);
  const beforeYouStart = t.list("counselling.beforeYouStart");

  const categories = [
    {
      value: "SCHOOL_GIRL",
      icon: GraduationCap,
      title: t("counselling.girlCard"),
      body: t("counselling.girlCardBody"),
    },
    {
      value: "MARRIED_WOMAN",
      icon: HeartHandshake,
      title: t("counselling.womanCard"),
      body: t("counselling.womanCardBody"),
    },
  ] as const;

  return (
    <div className="container-page max-w-3xl py-12 sm:py-16">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-tint text-brand">
        <Lock aria-hidden="true" className="size-6" strokeWidth={1.75} />
      </div>

      <h1 className="mt-6 text-3xl sm:text-4xl">{t("counselling.landingTitle")}</h1>
      <p className="mt-4 text-lg leading-relaxed text-ink-muted">
        {t("counselling.landingLede")}
      </p>

      {/* Category is chosen here rather than inside the form so the first
          decision is a single, easy one. It is carried through as a query
          parameter and can still be changed on step one. */}
      <section className="mt-10" aria-labelledby="choose-category">
        <h2 id="choose-category" className="text-lg">
          {t("counselling.chooseCategory")}
        </h2>
        <p className="mt-1.5 text-sm text-ink-muted">{t("counselling.categoryHint")}</p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {categories.map((category) => (
            <Link
              key={category.value}
              href={`${localePath(locale, "/counselling/request")}?category=${category.value}`}
              className="group rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-plum-400 hover:bg-tint"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-tint text-brand group-hover:bg-surface">
                <category.icon aria-hidden="true" className="size-5" strokeWidth={1.75} />
              </span>
              <span className="mt-4 block text-base font-semibold text-ink">
                {category.title}
              </span>
              <span className="mt-1.5 block text-sm leading-relaxed text-ink-muted">
                {category.body}
              </span>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
                {t("counselling.startForm")}
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <Card className="mt-10 border-tint-line bg-tint p-6">
        <h2 className="flex items-center gap-2 text-base font-semibold text-heading">
          <ShieldCheck aria-hidden="true" className="size-5 text-brand" />
          {t("counselling.beforeYouStartTitle")}
        </h2>
        <ul className="mt-4 space-y-2.5">
          {beforeYouStart.map((item) => (
            <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink">
              <Clock aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand" />
              {item}
            </li>
          ))}
        </ul>
      </Card>

      <div className="mt-10 flex flex-col items-start gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-ink">
            {t("counselling.alreadyRequested")}
          </p>
          <p className="mt-0.5 text-sm text-ink-muted">{t("counselling.status.lede")}</p>
        </div>
        <ButtonLink
          href={localePath(locale, "/counselling/status")}
          variant="secondary"
          className="shrink-0"
        >
          {t("counselling.checkStatus")}
        </ButtonLink>
      </div>
    </div>
  );
}
