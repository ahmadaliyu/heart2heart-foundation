import type { Metadata } from "next";
import {
  Compass,
  Eye,
  HeartHandshake,
  Lock,
  ShieldCheck,
  Signpost,
  Stethoscope,
} from "lucide-react";

import { getTranslations } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale, localePath } from "@/lib/i18n/config";
import { Card } from "@/components/ui/card";
import { Eyebrow, PageHeader, Section, SectionHeading } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/motion";
import { staff } from "@/lib/data";
import { initials } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "en");
  return { title: dict.about.title, description: dict.about.lede };
}

/** One mark per value, in the order the values are written. */
const VALUE_ICONS = [Lock, Stethoscope, HeartHandshake, Signpost] as const;

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await getTranslations(params);
  const barriers = t.list("about.barriers");
  const values = t.list<{ title: string; body: string }>("about.values");
  const team = staff.filter((member) => member.active);

  return (
    <>
      <PageHeader eyebrow={t("nav.about")} title={t("about.title")} lede={t("about.lede")} />

      {/* ------------------------------------------------ mission & vision
          The two most quotable sentences the Foundation has, so they get the
          page's one full-strength moment rather than a pair of matching white
          boxes. One night panel, two halves divided by a hairline: they are
          peers, and reading one should lead into the other. The statements
          themselves live in the message files — an earlier version had the
          English hard-coded in this file, so the Hausa page showed English. */}
      {/* `sm` because the panel supplies its own generous padding — stacking
          section padding on top of it left ~290px of nothing above and below. */}
      <Section size="sm">
        <div className="container-page">
          <Reveal>
            <div className="relative isolate overflow-hidden rounded-panel bg-night-rich px-6 py-12 text-white sm:px-12 lg:px-14 lg:py-16">
              <div
                aria-hidden="true"
                className="drift pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-amber-400/10 blur-3xl"
              />

              <div className="relative grid gap-12 lg:grid-cols-2 lg:gap-16">
                {[
                  { label: t("about.missionTitle"), text: t("about.mission"), icon: Compass },
                  { label: t("about.visionTitle"), text: t("about.vision"), icon: Eye },
                ].map(({ label, text, icon: Icon }, index) => (
                  <div
                    key={label}
                    className={
                      index === 1
                        ? "relative lg:pl-16 lg:before:absolute lg:before:inset-y-0 lg:before:left-0 lg:before:w-px lg:before:bg-white/15"
                        : "relative"
                    }
                  >
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-400/15 text-amber-300"
                      >
                        <Icon className="size-4.5" strokeWidth={1.75} />
                      </span>
                      <h2 className="eyebrow text-amber-300">{label}</h2>
                    </div>

                    <p className="mt-6 font-text text-[1.375rem] leading-[1.42] tracking-[-0.015em] text-white sm:text-[1.5rem]">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ------------------------------------------------------- barriers
          Previously a two-column grid whose left side held a heading and a
          button and then 200px of nothing. The heading now runs across the
          top and the evidence sits underneath it, which is also the order
          someone reads it in. */}
      <Section tone="surface" className="border-y border-line">
        <div className="container-page">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow={t("about.problemEyebrow")}
              title={t("about.problemTitle")}
              body={t("about.problemBody")}
              className="max-w-3xl"
            />
            <Reveal delay={80} className="shrink-0">
              <ButtonLink href={localePath(locale, "/services")} variant="secondary">
                {t("services.title")}
              </ButtonLink>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <h3 className="mt-12 eyebrow text-ink-faint">{t("about.barriersTitle")}</h3>
            <ul className="mt-5 grid gap-x-8 gap-y-px sm:grid-cols-2 lg:grid-cols-3">
              {barriers.map((barrier) => (
                <li
                  key={barrier}
                  className="flex items-start gap-3 border-t border-line py-4 text-sm leading-relaxed text-ink"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-amber-400"
                  />
                  {barrier}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={160}>
            <div className="mt-12 flex flex-col gap-6 rounded-panel border border-tint-line bg-tint p-7 sm:flex-row sm:items-start sm:p-9">
              <span
                aria-hidden="true"
                className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-surface text-brand shadow-xs"
              >
                <HeartHandshake className="size-5.5" strokeWidth={1.75} />
              </span>
              <div className="max-w-3xl">
                <h3 className="text-subtitle">{t("about.approachTitle")}</h3>
                <p className="mt-2.5 leading-relaxed text-ink-muted">
                  {t("about.approachBody")}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* --------------------------------------------------------- values */}
      <Section>
        <div className="container-page">
          <SectionHeading
            eyebrow={t("about.valuesEyebrow")}
            title={t("about.valuesTitle")}
          />

          <ul className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2">
            {values.map((value, index) => {
              const Icon = VALUE_ICONS[index] ?? Lock;
              return (
                <Reveal as="li" key={value.title} delay={index * 70} className="flex gap-5">
                  <span
                    aria-hidden="true"
                    className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-tint-line bg-tint text-brand"
                  >
                    <Icon className="size-5" strokeWidth={1.75} />
                  </span>
                  <div>
                    <h3 className="text-subtitle">{value.title}</h3>
                    <p className="mt-2 leading-relaxed text-ink-muted">{value.body}</p>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </Section>

      {/* ----------------------------------------------------------- team */}
      <Section tone="sunken" className="border-y border-line">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-16">
            <SectionHeading
              eyebrow={t("about.teamEyebrow")}
              title={t("about.teamTitle")}
              body={t("about.teamBody")}
            />

            <ul className="grid gap-4 sm:grid-cols-2">
              {team.map((member, index) => (
                <Reveal as="li" key={member.id} delay={index * 70}>
                  <Card className="flex h-full items-center gap-4 p-5">
                    <span
                      aria-hidden="true"
                      className="flex size-12 shrink-0 items-center justify-center rounded-full bg-plum-800 font-text text-sm font-semibold text-white"
                    >
                      {initials(member.name)}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold text-ink">{member.name}</span>
                      <span className="block text-sm text-ink-muted">{member.title}</span>
                    </span>
                  </Card>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* -------------------------------------------------- safeguarding */}
      <Section size="sm">
        <div className="container-page">
          <Reveal>
            <Card className="flex flex-col gap-6 p-7 sm:flex-row sm:items-center sm:gap-8 sm:p-9">
              <span
                aria-hidden="true"
                className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-tint text-brand"
              >
                <ShieldCheck className="size-6" strokeWidth={1.75} />
              </span>
              <div className="flex-1">
                <Eyebrow className="mb-2">{t("about.safeguardingTitle")}</Eyebrow>
                <p className="max-w-2xl leading-relaxed text-ink-muted">
                  {t("about.safeguardingBody")}
                </p>
              </div>
              <ButtonLink
                href={localePath(locale, "/safeguarding")}
                variant="secondary"
                className="shrink-0"
              >
                {t("about.safeguardingLink")}
              </ButtonLink>
            </Card>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
