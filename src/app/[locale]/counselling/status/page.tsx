import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getTranslations } from "@/lib/i18n/server";
import { localePath } from "@/lib/i18n/config";
import { StatusLookup } from "@/components/counselling/status-lookup";

export const metadata = {
  title: "Check your request",
  robots: { index: false, follow: false, nocache: true },
};

export default async function StatusPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await getTranslations(params);

  return (
    <div className="container-page max-w-xl py-10 sm:py-14">
      <Link
        href={localePath(locale, "/counselling")}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        {t("common.back")}
      </Link>

      <h1 className="mt-6 text-3xl">{t("counselling.status.title")}</h1>
      <p className="mt-3 leading-relaxed text-ink-muted">{t("counselling.status.lede")}</p>

      <div className="mt-8">
        <StatusLookup />
      </div>
    </div>
  );
}
