import Link from "next/link";
import { ArrowRight, ArrowUpRight, Clock, Download, MapPin, Play } from "lucide-react";

import type {
  Article,
  FoundationEvent,
  MaterialResource,
  VideoResource,
} from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Translator } from "@/lib/i18n/translate";
import { cn, formatDate, formatTime } from "@/lib/utils";

/**
 * There is deliberately no photography anywhere in these cards. Stock imagery
 * of distressed women is the last thing this audience needs to meet before
 * asking for help, so the cards carry themselves on type, space and one
 * accent rule that draws on hover.
 */
export function ArticleCard({
  article,
  locale,
  t,
  size = "md",
}: {
  article: Article;
  locale: Locale;
  t: Translator;
  size?: "md" | "lg";
}) {
  return (
    <Card
      as="article"
      interactive
      className={cn(
        "group relative flex flex-col overflow-hidden",
        size === "lg" ? "p-7 sm:p-9" : "p-6",
      )}
    >
      {/* Accent rule along the top edge, drawn on hover. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-linear-to-r from-amber-400 to-plum-500 transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-x-100"
      />

      <div className="flex items-center justify-between gap-3">
        <span className="eyebrow text-accent">
          {t(`enums.articleCategory.${article.category}`)}
        </span>
        <span className="eyebrow inline-flex items-center gap-1.5 text-ink-faint">
          <Clock aria-hidden="true" className="size-3" />
          {article.readingMinutes} {t("common.minutes")}
        </span>
      </div>

      <h3
        className={cn(
          "mt-4 leading-[1.15] tracking-[-0.02em]",
          size === "lg" ? "text-3xl sm:text-[2.125rem]" : "text-xl",
        )}
      >
        <Link
          href={localePath(locale, `/resources/articles/${article.slug}`)}
          className="after:absolute after:inset-0 group-hover:text-brand"
        >
          {article.title}
        </Link>
      </h3>

      <p
        className={cn(
          "mt-3 flex-1 leading-relaxed text-ink-muted",
          size === "lg" ? "text-[1.0625rem]" : "text-sm",
        )}
      >
        {article.excerpt}
      </p>

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-line pt-4">
        <span className="eyebrow text-ink-faint">
          {formatDate(article.publishedAt, locale, { day: "numeric", month: "short", year: "numeric" })}
        </span>
        <span className="flex size-8 items-center justify-center rounded-full bg-tint text-brand transition-all duration-300 group-hover:bg-plum-700 group-hover:text-white">
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </span>
      </div>
    </Card>
  );
}

/**
 * The date sits in its own block on the left — the pattern people already read
 * as "an event", so the card needs no other explanation.
 */
export function EventCard({
  event,
  locale,
  t,
}: {
  event: FoundationEvent;
  locale: Locale;
  t: Translator;
}) {
  const start = new Date(event.startsAt);

  return (
    <Card as="article" interactive className="group relative flex gap-5 p-6">
      <div className="flex size-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-plum-950 text-white">
        <span className="font-display text-2xl leading-none">{start.getDate()}</span>
        <span className="eyebrow mt-1 text-amber-300">
          {formatDate(event.startsAt, locale, { month: "short" })}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="eyebrow text-accent">{t(`events.kinds.${event.kind}`)}</span>
          {event.status === "FULL" ? (
            <Badge tone="warning">{t("events.full")}</Badge>
          ) : null}
        </div>

        <h3 className="mt-2.5 text-xl leading-snug tracking-[-0.02em]">
          <Link
            href={localePath(locale, `/events/${event.slug}`)}
            className="after:absolute after:inset-0 group-hover:text-brand"
          >
            {event.title}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-muted">
          {event.description}
        </p>

        <dl className="mt-4 space-y-1.5 text-sm">
          <div>
            <dt className="sr-only">{t("events.time")}</dt>
            <dd className="flex items-center gap-2 text-ink-muted">
              <Clock aria-hidden="true" className="size-3.5 shrink-0 text-plum-400" />
              {formatTime(event.startsAt, locale)}
            </dd>
          </div>
          <div>
            <dt className="sr-only">{t("events.location")}</dt>
            <dd className="flex items-center gap-2 text-ink-muted">
              <MapPin aria-hidden="true" className="size-3.5 shrink-0 text-plum-400" />
              <span className="truncate">{event.location}</span>
            </dd>
          </div>
        </dl>
      </div>
    </Card>
  );
}

export function VideoCard({
  video,
  locale,
  t,
}: {
  video: VideoResource;
  locale: Locale;
  t: Translator;
}) {
  return (
    <Card as="article" interactive className="group flex flex-col overflow-hidden">
      <div
        aria-hidden="true"
        className="relative flex aspect-16/10 items-center justify-center bg-night-rich"
      >
        <span className="flex size-14 items-center justify-center rounded-full bg-white/12 backdrop-blur transition-transform duration-400 ease-[var(--ease-out-soft)] group-hover:scale-110">
          <Play className="ml-0.5 size-5 fill-white text-white" />
        </span>
        <span className="eyebrow absolute bottom-4 right-4 rounded-full bg-black/40 px-2.5 py-1 text-white">
          {video.durationMinutes} min
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <span className="eyebrow text-accent">
          {t(`enums.videoKind.${video.kind}`)}
        </span>
        <h3 className="mt-3 text-lg leading-snug tracking-[-0.02em]">{video.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
          {video.description}
        </p>
        <p className="eyebrow mt-5 text-ink-faint">
          {formatDate(video.publishedAt, locale, { day: "numeric", month: "short", year: "numeric" })}
        </p>
      </div>
    </Card>
  );
}

export function MaterialCard({
  material,
  t,
}: {
  material: MaterialResource;
  t: Translator;
}) {
  return (
    <Card as="article" interactive tone="cream" className="group flex gap-5 p-6">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-amber-400/25 text-accent">
        <Download aria-hidden="true" className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <span className="eyebrow text-accent">
          {t(`enums.materialFormat.${material.format}`)}
        </span>
        <h3 className="mt-2 text-lg leading-snug tracking-[-0.02em]">{material.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          {material.description}
        </p>
        <p className="eyebrow mt-4 flex items-center gap-2 text-brand">
          {t("common.download")}
          <span className="text-ink-faint">
            · {Math.round(material.sizeKb / 100) / 10} MB
          </span>
          <ArrowRight
            aria-hidden="true"
            className="size-3.5 transition-transform duration-250 group-hover:translate-x-1"
          />
        </p>
      </div>
    </Card>
  );
}

/** Inline "more" link with a sliding arrow. */
export function LinkArrow({
  children,
  onDark = false,
}: {
  children: React.ReactNode;
  onDark?: boolean;
}) {
  return (
    <span
      className={cn(
        "group/la inline-flex items-center gap-2 text-sm font-semibold",
        onDark ? "text-white" : "text-brand",
      )}
    >
      {children}
      <span
        className={cn(
          "flex size-7 items-center justify-center rounded-full transition-all duration-300",
          onDark
            ? "bg-white/12 group-hover/la:bg-white group-hover/la:text-plum-900"
            : "bg-tint group-hover/la:bg-plum-700 group-hover/la:text-white",
        )}
      >
        <ArrowRight aria-hidden="true" className="size-3.5" />
      </span>
    </span>
  );
}
