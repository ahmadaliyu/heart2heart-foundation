import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock, MapPin, User } from "lucide-react";

import { getTranslations } from "@/lib/i18n/server";
import { localePath } from "@/lib/i18n/config";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { events, getEvent } from "@/lib/data";
import { formatDate, formatTime } from "@/lib/utils";

export function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) return { title: "Event" };
  return { title: event.title, description: event.description };
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const resolved = await params;
  const { locale, t } = await getTranslations(params);
  const event = getEvent(resolved.slug);
  if (!event) notFound();

  const spacesLeft =
    event.capacity !== undefined && event.registered !== undefined
      ? Math.max(0, event.capacity - event.registered)
      : undefined;

  const canRegister = event.status === "OPEN" && Boolean(event.registrationUrl);

  const details = [
    {
      icon: CalendarDays,
      label: t("events.date"),
      value: formatDate(event.startsAt, locale, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    },
    {
      icon: Clock,
      label: t("events.time"),
      value: event.endsAt
        ? `${formatTime(event.startsAt, locale)} – ${formatTime(event.endsAt, locale)}`
        : formatTime(event.startsAt, locale),
    },
    { icon: MapPin, label: t("events.location"), value: event.location },
    { icon: User, label: t("events.organiser"), value: event.organiser },
  ];

  return (
    <>
      <header className="bg-wash border-b border-line">
        <div className="container-page py-10 sm:py-14">
          <Link
            href={localePath(locale, "/events")}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            {t("events.backToEvents")}
          </Link>

          <div className="mt-6 flex flex-wrap gap-2">
            <Badge tone="brand">{t(`events.kinds.${event.kind}`)}</Badge>
            {event.status === "FULL" ? <Badge tone="warning">{t("events.full")}</Badge> : null}
            {event.status === "PAST" ? <Badge tone="neutral">{t("events.past")}</Badge> : null}
          </div>

          <h1 className="mt-4 max-w-3xl text-3xl sm:text-4xl">{event.title}</h1>
        </div>
      </header>

      <div className="container-page grid gap-10 py-12 lg:grid-cols-[1.5fr_1fr] lg:gap-14">
        <div className="space-y-5 text-[1.0625rem] leading-[1.75] text-ink">
          <p>{event.description}</p>
        </div>

        <aside>
          <Card className="p-6 lg:sticky lg:top-24">
            <dl className="space-y-4">
              {details.map((detail) => (
                <div key={detail.label} className="min-w-0">
                  <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">
                    <detail.icon
                      aria-hidden="true"
                      className="size-4 shrink-0 text-plum-500"
                    />
                    {detail.label}
                  </dt>
                  <dd className="mt-1 pl-6 text-sm text-ink">{detail.value}</dd>
                </div>
              ))}
            </dl>

            {spacesLeft !== undefined && event.status !== "PAST" ? (
              <p className="mt-5 rounded-lg bg-sunken px-3 py-2 text-sm text-ink-muted">
                <span className="font-semibold text-ink">{spacesLeft}</span>{" "}
                {t("events.spacesLeft")}
              </p>
            ) : null}

            <div className="mt-6">
              {canRegister ? (
                <ButtonLink
                  href={event.registrationUrl ?? "#"}
                  fullWidth
                  size="lg"
                >
                  {t("events.register")}
                </ButtonLink>
              ) : (
                <p className="rounded-lg border border-line bg-canvas px-4 py-3 text-center text-sm font-semibold text-ink-muted">
                  {event.status === "FULL"
                    ? t("events.full")
                    : t("events.registrationClosed")}
                </p>
              )}
            </div>
          </Card>
        </aside>
      </div>
    </>
  );
}
