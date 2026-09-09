import type { Metadata } from "next";

import { getTranslations } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale } from "@/lib/i18n/config";
import { PageHeader, Section, SectionHeading } from "@/components/ui/section";
import { ArticleCard, MaterialCard, VideoCard } from "@/components/cards";
import { publishedArticles, publishedMaterials, publishedVideos } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "en");
  return { title: dict.resources.title, description: dict.resources.lede };
}

export default async function ResourcesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await getTranslations(params);
  const articles = publishedArticles();
  const videos = publishedVideos();
  const materials = publishedMaterials();

  const jump = [
    { href: "#articles", label: t("resources.articles"), count: articles.length },
    { href: "#videos", label: t("resources.videos"), count: videos.length },
    { href: "#materials", label: t("resources.materials"), count: materials.length },
  ];

  return (
    <>
      <PageHeader image="/images/community.jpg" title={t("resources.title")} lede={t("resources.lede")}>
        <nav aria-label={t("resources.title")} className="flex flex-wrap gap-2">
          {jump.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface px-4 py-2 text-sm font-semibold text-brand-strong transition-colors hover:border-plum-300 hover:bg-tint"
            >
              {item.label}
              <span className="rounded-full bg-tint-strong px-1.5 text-xs text-brand-strong">
                {item.count}
              </span>
            </a>
          ))}
        </nav>
      </PageHeader>

      <Section id="articles" className="scroll-mt-20">
        <div className="container-page">
          <SectionHeading title={t("resources.articles")} as="h2" />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} locale={locale} t={t} />
            ))}
          </div>
        </div>
      </Section>

      <Section
        id="videos"
        tone="surface"
        className="scroll-mt-20 border-y border-line"
      >
        <div className="container-page">
          <SectionHeading title={t("resources.videos")} as="h2" />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} locale={locale} t={t} />
            ))}
          </div>
        </div>
      </Section>

      <Section id="materials" className="scroll-mt-20">
        <div className="container-page">
          <SectionHeading title={t("resources.materials")} as="h2" />
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {materials.map((material) => (
              <MaterialCard key={material.id} material={material} t={t} />
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}

