import { redirect } from "next/navigation";
import { Plus, Star } from "lucide-react";

import { getTranslations } from "@/lib/i18n/server";
import { localePath, type Locale } from "@/lib/i18n/config";
import { requireSession } from "@/lib/session";
import { articles, materials, videos } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import {
  PortalPageHeader,
  Table,
  TableWrap,
  Td,
  Th,
  Tr,
} from "@/components/portal/portal-ui";
import type { ContentStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const STATUS_TONE: Record<ContentStatus, "neutral" | "info" | "success" | "warning"> = {
  DRAFT: "neutral",
  REVIEW: "warning",
  PUBLISHED: "success",
  ARCHIVED: "neutral",
};

export default async function ContentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await getTranslations(params);
  const user = await requireSession();
  if (user.role !== "ADMIN") redirect(localePath(locale as Locale, "/portal/dashboard"));

  const columns = t.object<Record<string, string>>("portal.content.columns");

  return (
    <>
      <PortalPageHeader
        title={t("portal.content.title")}
        lede={t("portal.content.lede")}
        action={
          <Button>
            <Plus aria-hidden="true" className="size-4" />
            {t("portal.content.newArticle")}
          </Button>
        }
      />

      <div className="space-y-8">
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th>{columns.title}</Th>
                <Th>{columns.category}</Th>
                <Th>{columns.status}</Th>
                <Th>{columns.updated}</Th>
                <Th className="text-right">{t("portal.common.actions")}</Th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <Tr key={article.slug}>
                  <Td>
                    <span className="flex items-center gap-2 font-medium text-ink">
                      {article.featured ? (
                        <Star
                          aria-label={t("portal.content.featured")}
                          className="size-3.5 shrink-0 fill-amber-400 text-amber-400"
                        />
                      ) : null}
                      {article.title}
                    </span>
                    <span className="mt-0.5 block text-xs text-ink-faint">
                      {article.author} · {article.readingMinutes} {t("common.minutes")}
                    </span>
                  </Td>
                  <Td className="text-ink-muted">
                    {t(`enums.articleCategory.${article.category}`)}
                  </Td>
                  <Td>
                    <Badge tone={STATUS_TONE[article.status]}>
                      {t(`enums.contentStatus.${article.status}`)}
                    </Badge>
                  </Td>
                  <Td className="whitespace-nowrap text-ink-muted">
                    {formatDate(article.updatedAt, locale as Locale, {
                      day: "numeric",
                      month: "short",
                    })}
                  </Td>
                  <Td className="text-right">
                    <div className="inline-flex gap-2">
                      <Button size="sm" variant="secondary">
                        {article.status === "PUBLISHED"
                          ? t("portal.content.unpublish")
                          : article.status === "DRAFT"
                            ? t("portal.content.sendToReview")
                            : t("portal.content.publish")}
                      </Button>
                      <Button size="sm" variant="quiet">
                        {t("portal.content.archive")}
                      </Button>
                    </div>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </TableWrap>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader title={t("resources.videos")} description={`${videos.length}`} />
            <ul className="divide-y divide-line">
              {videos.map((video) => (
                <li
                  key={video.id}
                  className="flex items-center justify-between gap-3 px-5 py-3.5"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-ink">
                      {video.title}
                    </span>
                    <span className="block text-xs text-ink-faint">
                      {t(`enums.videoKind.${video.kind}`)} · {video.durationMinutes}{" "}
                      {t("resources.videoDuration")}
                    </span>
                  </span>
                  <Badge tone={STATUS_TONE[video.status]}>
                    {t(`enums.contentStatus.${video.status}`)}
                  </Badge>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHeader
              title={t("resources.materials")}
              description={`${materials.length}`}
            />
            <ul className="divide-y divide-line">
              {materials.map((material) => (
                <li
                  key={material.id}
                  className="flex items-center justify-between gap-3 px-5 py-3.5"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-ink">
                      {material.title}
                    </span>
                    <span className="block text-xs text-ink-faint">
                      {t(`enums.materialFormat.${material.format}`)} ·{" "}
                      {Math.round(material.sizeKb / 100) / 10} MB
                    </span>
                  </span>
                  <Badge tone={STATUS_TONE[material.status]}>
                    {t(`enums.contentStatus.${material.status}`)}
                  </Badge>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
