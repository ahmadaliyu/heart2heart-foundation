import { CloudOff, LifeBuoy } from "lucide-react";

import { getTranslations } from "@/lib/i18n/server";
import { localePath } from "@/lib/i18n/config";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata = { robots: { index: false, follow: false } };

/** Served by the service worker when a navigation fails with no cached copy. */
export default async function OfflinePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await getTranslations(params);

  return (
    <div className="container-page flex justify-center py-20">
      <Card className="max-w-md p-8 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-sunken text-ink-muted">
          <CloudOff aria-hidden="true" className="size-7" />
        </div>
        <h1 className="mt-6 text-2xl">{t("offline.title")}</h1>
        <p className="mt-3 leading-relaxed text-ink-muted">{t("offline.body")}</p>

        <div className="mt-8 flex flex-col gap-3">
          <ButtonLink href={localePath(locale, "/emergency")} variant="emergency">
            <LifeBuoy aria-hidden="true" className="size-4" />
            {t("offline.emergencyStill")}
          </ButtonLink>
          <ButtonLink href={localePath(locale, "/")} variant="secondary">
            {t("notFound.home")}
          </ButtonLink>
        </div>
      </Card>
    </div>
  );
}
