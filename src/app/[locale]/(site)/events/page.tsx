import type { Metadata } from "next";
import { getTranslations } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale } from "@/lib/i18n/config";
import { PageHeader } from "@/components/ui/section";
import { EventExplorer } from "@/components/home/event-explorer";
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
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ period?: string }>;
}) {
  const { t } = await getTranslations(params);
  const { period } = await searchParams;
  return (
    <>
      <PageHeader
        image="/images/together.jpg"
        eyebrow={t("nav.events")}
        title={t("events.title")}
        lede={t("events.lede")}
      />
      <EventExplorer
        key={period || "upcoming"}
        events={[...upcomingEvents(), ...pastEvents()]}
        initialPast={period === "past"}
      />
    </>
  );
}
