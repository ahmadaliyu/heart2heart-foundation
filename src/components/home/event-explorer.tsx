"use client";
import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n/client";
import { EventCard } from "@/components/cards";
import type { FoundationEvent } from "@/lib/types";

export function EventExplorer({
  events,
  initialPast = false,
}: {
  events: FoundationEvent[];
  initialPast?: boolean;
}) {
  const { locale, t } = useI18n();
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("");
  const [past, setPast] = useState(initialPast);
  const [grouped, setGrouped] = useState(false);
  const filtered = useMemo(
    () =>
      events.filter(
        (event) =>
          (event.status === "PAST") === past &&
          (!kind || event.kind === kind) &&
          (event.title + " " + event.description + " " + event.location)
            .toLocaleLowerCase(locale)
            .includes(query.toLocaleLowerCase(locale)),
      ),
    [events, query, kind, past, locale],
  );
  const months = [
    ...new Set(filtered.map((event) => event.startsAt.slice(0, 7))),
  ];
  const cards = (items: FoundationEvent[]) => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((event) => (
        <EventCard key={event.slug} event={event} locale={locale} t={t} />
      ))}
    </div>
  );
  return (
    <section className="bpa-container py-12">
      <div className="event-filters">
        <input
          aria-label={t("common.search")}
          type="search"
          placeholder={t("common.search")}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <select
          aria-label={t("common.filter")}
          value={kind}
          onChange={(event) => setKind(event.target.value)}
        >
          <option value="">{t("common.all")}</option>
          {[...new Set(events.map((event) => event.kind))].map((value) => (
            <option value={value} key={value}>
              {t("events.kinds." + value)}
            </option>
          ))}
        </select>
      </div>
      <div className="event-toolbar">
        <div className="event-tabs">
          <button aria-pressed={!past} onClick={() => setPast(false)}>
            {t("events.upcoming")}
          </button>
          <button aria-pressed={past} onClick={() => setPast(true)}>
            {t("events.past")}
          </button>
        </div>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={grouped}
            onChange={(event) => setGrouped(event.target.checked)}
          />
          {locale === "ha" ? "Rarraba bisa wata" : "Group by month"}
        </label>
      </div>
      <p className="sr-only" role="status">
        {filtered.length} {t("nav.events")}
      </p>
      {!filtered.length ? (
        <p className="py-14 text-center">{t("common.noResults")}</p>
      ) : grouped ? (
        months.map((month) => (
          <div key={month}>
            <h2 className="event-month">
              {new Intl.DateTimeFormat(locale === "ha" ? "ha-NG" : "en-NG", {
                month: "long",
                year: "numeric",
              }).format(new Date(month + "-01T12:00:00"))}
            </h2>
            {cards(
              filtered.filter((event) => event.startsAt.startsWith(month)),
            )}
          </div>
        ))
      ) : (
        cards(filtered)
      )}
    </section>
  );
}
