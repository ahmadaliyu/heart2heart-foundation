import type { Metadata } from "next";
import {
  Accessibility,
  GraduationCap,
  HandHeart,
  HeartHandshake,
  Info,
  Pill,
  ShieldAlert,
  ShieldX,
} from "lucide-react";

import { getTranslations } from "@/lib/i18n/server";
import { supportHref } from "@/lib/support-link";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale, localePath } from "@/lib/i18n/config";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/motion";
import { PageHeader, Section, SectionHeading } from "@/components/ui/section";
import { areaImages, audienceImages } from "@/lib/data/images";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "en");
  return { title: dict.services.title, description: dict.services.lede };
}

/**
 * One mark per area of work, in the order the copy lists them.
 *
 * Deliberately restrained: these are heavy subjects, and an illustration that
 * tries to depict them would be either euphemistic or distressing. A plain
 * symbol in the brand tint labels the card without dramatising it.
 */
const AREA_ICONS = [ShieldAlert, Pill, ShieldX, Accessibility, HandHeart] as const;

interface Area {
  title: string;
  body: string;
  includes: string[];
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await getTranslations(params);
  const areas = t.list<Area>("services.areas");
  const how = t.list<{ title: string; body: string }>("services.how");

  const audiences = [
    {
      icon: GraduationCap,
      title: t("services.youthTitle"),
      body: t("services.youthBody"),
      areas: t.list("services.youthAreas"),
    },
    {
      icon: HeartHandshake,
      title: t("services.couplesTitle"),
      body: t("services.couplesBody"),
      areas: t.list("services.couplesAreas"),
    },
  ];

  return (
    <>
      <PageHeader image="/images/community.jpg"
        eyebrow={t("nav.services")}
        title={t("services.title")}
        lede={t("services.lede")}
      >
        <ButtonLink href={supportHref(locale)} size="lg">
          {t("services.cta")}
        </ButtonLink>
      </PageHeader>

      {/* ------------------------------------------------- areas of work */}
      <Section id="areas">
        <div className="container-page">
          <SectionHeading
            eyebrow={t("services.areasEyebrow")}
            title={t("services.areasTitle")}
            body={t("services.areasLede")}
          />

          <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {areas.map((area, index) => {
              const Icon = AREA_ICONS[index] ?? ShieldAlert;
              return (
                <Reveal as="li" key={area.title} delay={index * 60} className="h-full">
                  <Card className="flex h-full flex-col overflow-hidden p-7">
                    <div className="relative -mx-7 -mt-7 mb-6 border-b border-line">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={areaImages[index] ?? areaImages[0]}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="block aspect-16/9 w-full object-cover"
                      />
                      <span
                        aria-hidden="true"
                        className="absolute bottom-0 left-7 flex size-12 translate-y-1/2 items-center justify-center rounded-xl border border-tint-line bg-surface text-brand shadow-sm"
                      >
                        <Icon className="size-6" strokeWidth={1.75} />
                      </span>
                    </div>

                    <h3 className="mt-6 text-subtitle">{area.title}</h3>
                    <p className="mt-2.5 flex-1 leading-relaxed text-ink-muted">
                      {area.body}
                    </p>

                    <ul className="mt-6 flex flex-wrap gap-2 border-t border-line pt-5">
                      {area.includes.map((item) => (
                        <li
                          key={item}
                          className="rounded-full border border-line bg-canvas px-2.5 py-1 text-xs font-semibold text-ink-muted"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </Section>

      {/* ---------------------------------------------------- audiences */}
      <Section id="audiences" tone="surface" className="border-y border-line">
        <div className="container-page">
          <SectionHeading
            eyebrow={t("services.audiencesEyebrow")}
            title={t("services.audiencesTitle")}
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {audiences.map((group, index) => (
              <Reveal key={group.title} delay={index * 80}>
                <Card className="flex h-full flex-col overflow-hidden p-7 sm:p-9">
                  <div className="relative -mx-7 -mt-7 mb-7 border-b border-line sm:-mx-9 sm:-mt-9">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={audienceImages[index] ?? audienceImages[0]}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="block aspect-16/7 w-full object-cover"
                    />
                  </div>

                  <span
                    aria-hidden="true"
                    className="flex size-12 items-center justify-center rounded-xl bg-tint text-brand"
                  >
                    <group.icon className="size-6" strokeWidth={1.75} />
                  </span>

                  <h3 className="mt-5 text-title">{group.title}</h3>
                  <p className="mt-3 leading-relaxed text-ink-muted">{group.body}</p>

                  <ul className="mt-7 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
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
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* --------------------------------------------------- how we work */}
      <Section id="how">
        <div className="container-page">
          <SectionHeading eyebrow={t("about.approachTitle")} title={t("services.howTitle")} />

          <ul className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2">
            {how.map((item, index) => (
              <Reveal as="li" key={item.title} delay={index * 60} className="flex gap-5">
                <span
                  aria-hidden="true"
                  className="eyebrow flex size-9 shrink-0 items-center justify-center rounded-full border border-tint-line bg-tint text-brand"
                >
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-subtitle">{item.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink-muted">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      {/* ------------------------------------------------------- limits */}
      <Section size="sm">
        <div className="container-page max-w-3xl">
          <Alert tone="info" title={t("services.limitsTitle")}>
            <p>{t("services.limitsBody")}</p>
            <p className="mt-4">
              <ButtonLink href={localePath(locale, "/emergency")} variant="secondary">
                <Info aria-hidden="true" className="size-4" />
                {t("nav.emergency")}
              </ButtonLink>
            </p>
          </Alert>
        </div>
      </Section>
    </>
  );
}


