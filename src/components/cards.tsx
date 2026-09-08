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
 * Cover art is abstract, and deliberately so.
 *
 * Stock photography of distressed women is the last thing this audience should
 * meet before asking for help, so the covers are generated brand shapes — the
 * mark's two crossing ribbons at texture scale — rather than pictures of
 * people. Each is derived from the item's slug, so it is stable and distinct.
 * Real photography can replace them file for file; the constraint that should
 * survive is the subject matter, not the format.
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
      {/* The cover bleeds to the card's edges, so its negative margins have to
          cancel exactly the padding this size sets above. */}
      <div
        className={cn(
          "relative overflow-hidden border-b border-line",
          size === "lg" ? "-mx-7 -mt-7 mb-7 sm:-mx-9 sm:-mt-9 sm:mb-8" : "-mx-6 -mt-6 mb-6",
        )}
      >
        {/* A real <img>, not a CSS background: the cover is content, so it
            belongs in the DOM where assistive tech, print and lazy loading can
            all reach it. next/image is skipped deliberately — these are SVGs,
            which it cannot optimise, and avoiding it keeps `sharp` out of the
            dependency tree. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={article.image}
          alt=""
          loading="lazy"
          decoding="async"
          className={cn(
            "block w-full object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.04]",
            size === "lg" ? "aspect-16/9" : "aspect-16/10",
          )}
        />
        {/* Accent rule along the bottom edge of the cover, drawn on hover. */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-linear-to-r from-amber-400 to-plum-500 transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-x-100"
        />
      </div>

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
        className="relative flex aspect-16/10 items-center justify-center overflow-hidden bg-night"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={video.image}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.05]"
        />
        {/* Darkened towards the bottom so the duration stays legible whatever
            the thumbnail behind it does. */}
        <span className="absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-transparent" />
        {/* Solid dark rather than translucent white: a frosted button vanishes
            on a pale thumbnail, and the covers vary from near-white to night. */}
        <span className="relative flex size-14 items-center justify-center rounded-full bg-night/70 ring-1 ring-white/25 backdrop-blur-sm transition-all duration-400 ease-[var(--ease-out-soft)] group-hover:scale-110 group-hover:bg-night/85">
          <Play className="ml-0.5 size-5 fill-white text-white" />
        </span>
        <span className="eyebrow absolute bottom-4 right-4 rounded-full bg-black/55 px-2.5 py-1 text-white backdrop-blur-sm">
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
