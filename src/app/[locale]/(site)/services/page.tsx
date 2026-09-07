import type { Metadata } from "next";
import { GraduationCap, HeartHandshake, Info } from "lucide-react";

import { getTranslations } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale, localePath } from "@/lib/i18n/config";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button";
import { PageHeader, Section, SectionHeading } from "@/components/ui/section";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "en");
  return { title: dict.services.title, description: dict.services.lede };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await getTranslations(params);
  const how = t.list<{ title: string; body: string }>("services.how");

  const groups = [
    {
      icon: GraduationCap,
      title: t("services.girlsTitle"),
      body: t("services.girlsBody"),
      areas: t.list("services.girlsAreas"),
    },
    {
      icon: HeartHandshake,
      title: t("services.womenTitle"),
      body: t("services.womenBody"),
      areas: t.list("services.womenAreas"),
    },
  ];

  return (
    <>
      <PageHeader title={t("services.title")} lede={t("services.lede")}>
        <ButtonLink href={localePath(locale, "/counselling")} size="lg">
          {t("services.cta")}
        </ButtonLink>
      </PageHeader>

      <Section>
        <div className="container-page grid gap-6 lg:grid-cols-2">
          {groups.map((group) => (
            <Card key={group.title} className="p-7 sm:p-9">
              <div className="flex size-12 items-center justify-center rounded-xl bg-tint text-brand">
                <group.icon aria-hidden="true" className="size-6" strokeWidth={1.75} />
              </div>
              <h2 className="mt-5 text-2xl">{group.title}</h2>
              <p className="mt-3 leading-relaxed text-ink-muted">{group.body}</p>
              <ul className="mt-6 space-y-2.5">
                {group.areas.map((area) => (
                  <li key={area} className="flex gap-3 text-[0.9375rem] text-ink">
                    <span
                      aria-hidden="true"
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-amber-400"
                    />
                    {area}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="surface" className="border-y border-line">
        <div className="container-page">
          <SectionHeading title={t("services.howTitle")} align="center" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {how.map((item) => (
              <Card key={item.title} className="p-6">
                <h3 className="text-lg">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="container-page max-w-3xl">
          <Alert tone="info" title={t("services.limitsTitle")}>
            <p>{t("services.limitsBody")}</p>
            <p className="mt-3">
              <a href={localePath(locale, "/emergency")} className="font-semibold text-info">
                {t("nav.emergency")}
              </a>
            </p>
          </Alert>

          <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-tint-line bg-tint p-8 text-center">
            <Info aria-hidden="true" className="size-6 text-brand" />
            <p className="max-w-lg leading-relaxed text-ink">
              {t("counselling.landingLede")}
            </p>
            <ButtonLink href={localePath(locale, "/counselling")} size="lg">
              {t("services.cta")}
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
