import type { Metadata } from "next";
import { CalendarDays } from "lucide-react";

import { getTranslations } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale } from "@/lib/i18n/config";
import { PageHeader, Section, SectionHeading } from "@/components/ui/section";
import { EmptyState } from "@/components/ui/empty-state";
import { EventCard } from "@/components/cards";
import { pastEvents, upcomingEvents } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "en");
  return { title: dict.events.title, description: dict.events.lede };
}

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await getTranslations(params);
  const upcoming = upcomingEvents();
  const past = pastEvents(4);

  return (
    <>
      <PageHeader title={t("events.title")} lede={t("events.lede")} />

      <Section>
        <div className="container-page">
          <SectionHeading title={t("events.upcoming")} as="h2" />
          <div className="mt-8">
            {upcoming.length ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcoming.map((event) => (
                  <EventCard key={event.slug} event={event} locale={locale} t={t} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<CalendarDays aria-hidden="true" className="size-5" />}
                title={t("events.noUpcoming")}
              />
            )}
          </div>
        </div>
      </Section>

      {past.length ? (
        <Section tone="sunken" className="border-t border-line">
          <div className="container-page">
            <SectionHeading title={t("events.past")} as="h2" />
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {past.map((event) => (
                <EventCard key={event.slug} event={event} locale={locale} t={t} />
              ))}
            </div>
          </div>
        </Section>
      ) : null}
    </>
  );
}
