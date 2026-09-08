import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";

import { getTranslations } from "@/lib/i18n/server";
import { localePath } from "@/lib/i18n/config";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/ui/section";
import { ArticleCard } from "@/components/cards";
import { articles, getArticle, relatedArticles } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return articles
    .filter((article) => article.status === "PUBLISHED")
    .map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Article" };
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: { title: article.title, description: article.excerpt, type: "article" },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const resolved = await params;
  const { locale, t } = await getTranslations(params);
  const article = getArticle(resolved.slug);
  if (!article) notFound();

  const related = relatedArticles(article.slug, 3);

  return (
    <>
      <article>
        <header className="bg-wash border-b border-line">
          <div className="container-page max-w-3xl py-10 sm:py-14">
            <Link
              href={localePath(locale, "/resources")}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              {t("resources.backToResources")}
            </Link>

            <div className="mt-6">
              <Badge tone="brand">{t(`enums.articleCategory.${article.category}`)}</Badge>
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl">{article.title}</h1>

            <p className="mt-4 text-lg leading-relaxed text-ink-muted">{article.excerpt}</p>

            <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-faint">
              <span>
                {t("resources.articleBy")} {article.author}
              </span>
              <span aria-hidden="true">·</span>
              <time dateTime={article.publishedAt}>
                {formatDate(article.publishedAt, locale)}
              </time>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <Clock aria-hidden="true" className="size-3.5" />
                {article.readingMinutes} {t("common.minutes")}
              </span>
            </p>
          </div>
        </header>

        {/* Cover, bleeding the full width and overlapping the header edge so
            the article opens on the image rather than on another band. */}
        <div className="container-page max-w-4xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.image}
            alt=""
            className="-mt-6 aspect-16/7 w-full rounded-panel border border-line object-cover shadow-md"
          />
        </div>

        <div className="container-page max-w-3xl py-12">
          <div className="space-y-6 text-[1.0625rem] leading-[1.75] text-ink">
            {article.body.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <aside className="mt-12 rounded-2xl border border-tint-line bg-tint p-7">
            <h2 className="text-lg">{t("counselling.landingTitle")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              {t("counselling.landingLede")}
            </p>
            <div className="mt-5">
              <ButtonLink href={localePath(locale, "/counselling")}>
                {t("services.cta")}
              </ButtonLink>
            </div>
          </aside>
        </div>
      </article>

      {related.length > 0 ? (
        <Section tone="sunken" className="border-t border-line">
          <div className="container-page">
            <SectionHeading title={t("resources.relatedTitle")} as="h2" />
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ArticleCard key={item.slug} article={item} locale={locale} t={t} />
              ))}
            </div>
          </div>
        </Section>
      ) : null}
    </>
  );
}
