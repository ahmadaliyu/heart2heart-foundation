import type { Metadata } from "next";

import { getTranslations } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale, localePath } from "@/lib/i18n/config";
import { PolicyPage } from "@/components/policy-page";
import { Alert } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "en");
  return { title: dict.safeguarding.title, description: dict.safeguarding.lede };
}

export default async function SafeguardingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await getTranslations(params);

  return (
    <PolicyPage
      title={t("safeguarding.title")}
      lede={t("safeguarding.lede")}
      intro={t("safeguarding.intro")}
      sections={t.list<{ title: string; body: string }>("safeguarding.sections")}
    >
      <Alert tone="privacy" title={t("safeguarding.concernTitle")}>
        <p>{t("safeguarding.concernBody")}</p>
        <div className="mt-4">
          <ButtonLink href={localePath(locale, "/contact")} size="sm" variant="secondary">
            {t("contact.title")}
          </ButtonLink>
        </div>
      </Alert>
    </PolicyPage>
  );
}
