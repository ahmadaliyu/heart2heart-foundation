import Link from "next/link";
import {
  ArrowRight,
  GraduationCap,
  HeartHandshake,
  Lock,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

import { getTranslations } from "@/lib/i18n/server";
import { localePath } from "@/lib/i18n/config";
import { ButtonLink, iconShift } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eyebrow, Section, SectionHeading } from "@/components/ui/section";
import { ArticleCard, EventCard, LinkArrow } from "@/components/cards";
import { LogoMark } from "@/components/brand/logo";
import { CountUp, Reveal } from "@/components/motion";
import { featuredArticles, upcomingEvents } from "@/lib/data";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await getTranslations(params);
  const articles = featuredArticles(3);
  const events = upcomingEvents(2);
  const steps = ["one", "two", "three", "four"] as const;
  const privacyPoints = t.list("home.privacyPoints");

  const stats = [
    { value: 480, suffix: "+", label: t("home.statSessions") },
    { value: 26, suffix: "", label: t("home.statSchools") },
    { value: 34, suffix: "", label: t("home.statVolunteers") },
    { value: 6, suffix: "", label: t("home.statYears") },
  ];

  return (
    <>
      {/* ================================================================ hero */}
      <section className="relative isolate -mt-18 overflow-hidden bg-night-rich">
        {/* Ambient, very slow. Decorative only — hidden from assistive tech and
            stilled entirely under reduced motion. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="drift absolute -left-32 top-10 size-[34rem] rounded-full bg-plum-500/25 blur-[100px]" />
          <div
            className="drift absolute -right-24 bottom-0 size-[28rem] rounded-full bg-amber-400/15 blur-[110px]"
            style={{ animationDelay: "-6s" }}
          />
        </div>

        <div className="container-page relative grid gap-16 pb-24 pt-38 sm:pb-28 sm:pt-42 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-20 lg:pb-32 lg:pt-46">
          <div>
            <div className="enter">
              <Eyebrow onDark>{t("home.heroAssurance")}</Eyebrow>
            </div>

            <h1
              className="enter mt-7 max-w-[15ch] text-hero text-white"
              style={{ animationDelay: "80ms" }}
            >
              {t("home.heroTitle")}
            </h1>

            <p
              className="enter mt-8 max-w-xl text-lead text-plum-200"
              style={{ animationDelay: "160ms" }}
            >
              {t("home.heroBody")}
            </p>

            <div
              className="enter mt-11 flex flex-col gap-3 sm:flex-row"
              style={{ animationDelay: "240ms" }}
            >
              <ButtonLink
                href={localePath(locale, "/counselling")}
                size="xl"
                variant="inverse"
              >
                {t("home.heroPrimary")}
                <ArrowRight aria-hidden="true" className={`size-5 ${iconShift}`} />
              </ButtonLink>
              <ButtonLink href="#how" size="xl" variant="outlineLight">
                {t("home.heroSecondary")}
              </ButtonLink>
            </div>

            <ul
              className="enter mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/12 pt-8"
              style={{ animationDelay: "320ms" }}
            >
              {[
                { icon: Lock, label: t("counselling.beforeYouStartTitle") },
                { icon: UserCheck, label: t("about.teamTitle") },
                { icon: ShieldCheck, label: t("footer.safeguarding") },
              ].map((item) => (
                <li
                  key={item.label}
                  className="flex items-center gap-2.5 text-sm text-plum-200"
                >
                  <item.icon aria-hidden="true" className="size-4 text-amber-400" />
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          {/* A reassurance panel rather than a photograph — this is what a
              first-time visitor actually needs to read before deciding. */}
          <div className="enter relative" style={{ animationDelay: "200ms" }}>
            <Card tone="glass" className="relative rounded-hero p-8 sm:p-10">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-amber-400/20 text-amber-300">
                <Lock aria-hidden="true" className="size-5" />
              </span>

              <h2 className="mt-7 text-[1.75rem] leading-tight text-white">
                {t("home.privacyTitle")}
              </h2>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-plum-200">
                {t("home.privacyBody")}
              </p>

              <ul className="mt-8 space-y-4">
                {privacyPoints.map((point) => (
                  <li key={point} className="flex gap-3.5 text-sm leading-relaxed text-white/90">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-400"
                    />
                    {point}
                  </li>
                ))}
              </ul>

              <Link
                href={localePath(locale, "/privacy")}
                className="mt-9 inline-block"
              >
                <LinkArrow onDark>{t("home.privacyLink")}</LinkArrow>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* ============================================================== stats */}
      <div className="border-b border-sand bg-cream">
        <div className="container-page grid grid-cols-2 gap-y-12 py-16 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 90} className="text-center">
              <p className="font-display text-5xl text-brand-strong sm:text-6xl">
                <CountUp to={stat.value} suffix={stat.suffix} />
              </p>
              <p className="eyebrow mt-4 text-ink-faint">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ======================================================= who we help */}
      <Section>
        <div className="container-page grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading
              eyebrow={t("nav.services")}
              title={t("home.whoTitle")}
              body={t("home.whoBody")}
            />
            <Reveal delay={120} className="mt-9">
              <Link href={localePath(locale, "/services")}>
                <LinkArrow>{t("home.servicesTitle")}</LinkArrow>
              </Link>
            </Reveal>
          </div>

          <div className="space-y-6">
            {[
              {
                icon: GraduationCap,
                title: t("services.girlsTitle"),
                body: t("services.girlsBody"),
                areas: t.list("services.girlsAreas").slice(0, 7),
                dark: true,
              },
              {
                icon: HeartHandshake,
                title: t("services.womenTitle"),
                body: t("services.womenBody"),
                areas: t.list("services.womenAreas").slice(0, 7),
                dark: false,
              },
            ].map((group, index) => (
              <Reveal key={group.title} delay={index * 120}>
                <Card
                  tone={group.dark ? "night" : "default"}
                  className="rounded-panel p-8 sm:p-10"
                >
                  <span
                    className={
                      group.dark
                        ? "flex size-13 items-center justify-center rounded-2xl bg-white/10 text-amber-300"
                        : "flex size-13 items-center justify-center rounded-2xl bg-tint text-brand"
                    }
                  >
                    <group.icon aria-hidden="true" className="size-6" strokeWidth={1.6} />
                  </span>

                  <h3
                    className={`mt-7 text-[1.75rem] leading-tight ${group.dark ? "text-white" : ""}`}
                  >
                    {group.title}
                  </h3>
                  <p
                    className={`mt-4 leading-relaxed ${group.dark ? "text-plum-200" : "text-ink-muted"}`}
                  >
                    {group.body}
                  </p>

                  <ul className="mt-7 flex flex-wrap gap-2">
                    {group.areas.map((area) => (
                      <li
                        key={area}
                        className={
                          group.dark
                            ? "rounded-full border border-white/15 bg-white/6 px-3.5 py-1.5 text-xs text-plum-100"
                            : "rounded-full border border-line bg-lilac px-3.5 py-1.5 text-xs text-ink-muted"
                        }
                      >
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

      {/* ======================================================= how it works */}
      <Section id="how" tone="surface" className="scroll-mt-24 border-y border-line">
        <div className="container-page">
          <SectionHeading
            eyebrow={t("counselling.landingTitle")}
            title={t("home.howTitle")}
            body={t("home.howBody")}
            align="center"
          />

          <ol className="relative mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {/* The connector sits behind the numerals on wide screens. */}
            <span
              aria-hidden="true"
              className="absolute left-0 right-0 top-6 hidden h-px bg-linear-to-r from-transparent via-line-strong to-transparent lg:block"
            />
            {steps.map((step, index) => (
              <Reveal key={step} delay={index * 110} as="li" className="relative">
                <span className="relative z-10 flex size-12 items-center justify-center rounded-full border border-line bg-surface font-display text-lg text-brand-strong shadow-sm">
                  {index + 1}
                </span>
                <h3 className="mt-6 text-xl leading-snug tracking-[-0.02em]">
                  {t(`home.steps.${step}.title`)}
                </h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-muted">
                  {t(`home.steps.${step}.body`)}
                </p>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={200} className="mt-12 text-center">
            <ButtonLink href={localePath(locale, "/counselling")} size="xl">
              {t("home.heroPrimary")}
              <ArrowRight aria-hidden="true" className={`size-5 ${iconShift}`} />
            </ButtonLink>
          </Reveal>
        </div>
      </Section>

      {/* ========================================================== resources */}
      <Section>
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow={t("resources.title")}
              title={t("home.resourcesTitle")}
              body={t("home.resourcesBody")}
            />
            <Reveal delay={100} className="pb-2">
              <Link href={localePath(locale, "/resources")}>
                <LinkArrow>{t("common.viewAll")}</LinkArrow>
              </Link>
            </Reveal>
          </div>

          <div className="mt-11 grid gap-6 lg:grid-cols-3">
            {articles.map((article, index) => (
              <Reveal
                key={article.slug}
                delay={index * 110}
                className={index === 0 ? "lg:col-span-2" : ""}
              >
                <ArticleCard
                  article={article}
                  locale={locale}
                  t={t}
                  size={index === 0 ? "lg" : "md"}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ============================================================= events */}
      {events.length > 0 ? (
        <Section tone="sunken" className="border-y border-line">
          <div className="container-page">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                eyebrow={t("events.upcoming")}
                title={t("home.eventsTitle")}
                body={t("home.eventsBody")}
              />
              <Reveal delay={100} className="pb-2">
                <Link href={localePath(locale, "/events")}>
                  <LinkArrow>{t("common.viewAll")}</LinkArrow>
                </Link>
              </Reveal>
            </div>

            <div className="mt-11 grid gap-6 lg:grid-cols-2">
              {events.map((event, index) => (
                <Reveal key={event.slug} delay={index * 110}>
                  <EventCard event={event} locale={locale} t={t} />
                </Reveal>
              ))}
            </div>
          </div>
        </Section>
      ) : null}

      {/* ============================================================= donate */}
      {/* `sm`: the band is one padded card, so it brings its own air. */}
      <Section tone="cream" size="sm">
        <div className="container-page">
          <Reveal>
            <div className="grid items-center gap-10 rounded-hero border border-sand bg-surface p-9 sm:p-12 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <Eyebrow>{t("nav.donate")}</Eyebrow>
                <h2 className="mt-6 max-w-xl text-title">{t("home.donateTitle")}</h2>
                <p className="mt-5 max-w-xl text-lead text-ink-muted">
                  {t("home.donateBody")}
                </p>
              </div>
              <div className="lg:justify-self-end">
                <ButtonLink href={localePath(locale, "/donate")} size="xl">
                  {t("home.donateCta")}
                  <ArrowRight aria-hidden="true" className={`size-5 ${iconShift}`} />
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ========================================================== final cta */}
      <section className="relative overflow-hidden bg-night-rich py-20 sm:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="drift absolute left-1/2 top-1/2 size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-plum-500/20 blur-[120px]" />
        </div>

        <div className="container-page relative text-center">
          <Reveal>
            <LogoMark reversed className="mx-auto h-14" />
            <h2 className="mx-auto mt-8 max-w-3xl text-display text-white">
              {t("home.ctaTitle")}
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lead text-plum-200">
              {t("home.ctaBody")}
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <ButtonLink
                href={localePath(locale, "/counselling")}
                size="xl"
                variant="inverse"
              >
                {t("home.heroPrimary")}
                <ArrowRight aria-hidden="true" className={`size-5 ${iconShift}`} />
              </ButtonLink>
              <ButtonLink
                href={localePath(locale, "/emergency")}
                size="xl"
                variant="outlineLight"
              >
                {t("nav.emergency")}
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
