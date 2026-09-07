import { CircleCheck } from "lucide-react";

import { getTranslations } from "@/lib/i18n/server";
import { localePath } from "@/lib/i18n/config";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata = { robots: { index: false, follow: false } };

export default async function ThankYouPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ ref?: string }>;
}) {
  const { locale, t } = await getTranslations(params);
  const { ref } = await searchParams;

  return (
    <div className="container-page flex justify-center py-16 sm:py-24">
      <Card className="max-w-lg p-8 text-center sm:p-10">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-success-soft text-success">
          <CircleCheck aria-hidden="true" className="size-7" />
        </div>

        <h1 className="mt-6 text-3xl">{t("donate.thanksTitle")}</h1>
        <p className="mt-3 leading-relaxed text-ink-muted">{t("donate.thanksBody")}</p>

        {ref ? (
          <p className="mt-6 rounded-xl bg-sunken px-4 py-3">
            <span className="block text-xs font-semibold uppercase tracking-wide text-ink-faint">
              {t("donate.receiptRef")}
            </span>
            <span className="mt-1 block font-mono text-base font-semibold text-ink">
              {ref}
            </span>
          </p>
        ) : null}

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href={localePath(locale, "/")}>{t("notFound.home")}</ButtonLink>
          <ButtonLink href={localePath(locale, "/resources")} variant="secondary">
            {t("resources.title")}
          </ButtonLink>
        </div>
      </Card>
    </div>
  );
}
