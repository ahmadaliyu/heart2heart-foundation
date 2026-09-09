import type { Metadata } from "next";

import { getTranslations } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n/dictionary";
import { isLocale } from "@/lib/i18n/config";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/section";
import { DonateForm } from "@/components/donate/donate-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : "en");
  return { title: dict.donate.title, description: dict.donate.lede };
}

export default async function DonatePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { t } = await getTranslations(params);
  const impact = t.list<{ amount: string; body: string }>("donate.impact");
  const otherWays = t.list("donate.otherWays");

  return (
    <>
      <PageHeader image="/images/together.jpg" title={t("donate.title")} lede={t("donate.lede")} />

      <div className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_1.1fr] lg:gap-14 lg:py-16">
        <div>
          <h2 className="text-2xl">{t("donate.impactTitle")}</h2>
          <ul className="mt-6 space-y-4">
            {impact.map((item) => (
              <li key={item.amount}>
                <Card className="flex gap-4 p-5">
                  <span className="font-display text-lg font-semibold text-brand-strong">
                    {item.amount}
                  </span>
                  <span className="text-sm leading-relaxed text-ink-muted">{item.body}</span>
                </Card>
              </li>
            ))}
          </ul>

          <div className="mt-10 rounded-2xl border border-amber-200 bg-tint-strong p-6">
            <h3 className="text-base font-semibold text-accent">
              {t("donate.otherWaysTitle")}
            </h3>
            <ul className="mt-3 space-y-2.5">
              {otherWays.map((way) => (
                <li key={way} className="flex gap-3 text-sm leading-relaxed text-ink">
                  <span
                    aria-hidden="true"
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-amber-500"
                  />
                  {way}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <DonateForm />
      </div>
    </>
  );
}

