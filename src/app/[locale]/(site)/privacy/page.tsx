import type { Metadata } from "next";

import { getTranslations } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale } from "@/lib/i18n/config";
import { PolicyPage } from "@/components/policy-page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "en");
  return { title: dict.privacy.title, description: dict.privacy.lede };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { t } = await getTranslations(params);
  return (
    <PolicyPage
      title={t("privacy.title")}
      lede={t("privacy.lede")}
      sections={t.list<{ title: string; body: string }>("privacy.sections")}
    />
  );
}
