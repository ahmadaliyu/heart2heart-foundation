import { redirect } from "next/navigation";

import { getTranslations } from "@/lib/i18n/server";
import { localeNames, locales, localePath, type Locale } from "@/lib/i18n/config";
import { requireSession } from "@/lib/session";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Select, TextInput } from "@/components/ui/field";
import { PortalPageHeader } from "@/components/portal/portal-ui";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await getTranslations(params);
  const user = await requireSession();
  if (user.role !== "ADMIN") redirect(localePath(locale as Locale, "/portal/dashboard"));

  return (
    <>
      <PortalPageHeader title={t("portal.settings.title")} lede={t("portal.settings.lede")} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title={t("portal.settings.orgTitle")} />
          <div className="space-y-4 p-5">
            <label className="block text-xs font-semibold uppercase tracking-wide text-ink-faint">
              {t("meta.name")}
              <TextInput defaultValue="Heart2Heart Foundation" className="mt-1.5" />
            </label>
            <label className="block text-xs font-semibold uppercase tracking-wide text-ink-faint">
              {t("contact.officeTitle")}
              <TextInput
                defaultValue="Kaduna, Nigeria"
                className="mt-1.5"
              />
            </label>
            <label className="block text-xs font-semibold uppercase tracking-wide text-ink-faint">
              {t("contact.emailTitle")}
              <TextInput defaultValue="hello@heart2heart.ng" className="mt-1.5" />
            </label>
            <label className="block text-xs font-semibold uppercase tracking-wide text-ink-faint">
              {t("contact.hoursTitle")}
              <TextInput defaultValue={t("contact.hours")} className="mt-1.5" />
            </label>
            <Button variant="secondary">{t("common.save")}</Button>
          </div>
        </Card>

        <Card>
          <CardHeader
            title={t("portal.settings.localeTitle")}
            description={t("portal.settings.localeBody")}
          />
          <ul className="divide-y divide-line">
            {locales.map((code) => (
              <li key={code} className="flex items-center justify-between gap-3 px-5 py-4">
                <span>
                  <span className="block text-sm font-medium text-ink">
                    {localeNames[code].english}
                  </span>
                  <span className="block font-mono text-xs text-ink-faint">
                    src/messages/{code}.json
                  </span>
                </span>
                <Badge tone={code === "en" ? "success" : "brand"}>
                  {code === "en" ? t("common.verified") : t("common.required")}
                </Badge>
              </li>
            ))}
          </ul>
          <p className="border-t border-line px-5 py-4 text-xs leading-relaxed text-ink-muted">
            The Hausa translation is a first draft and must be reviewed by a native
            speaker before launch — particularly the counselling, consent and
            safeguarding copy.
          </p>
        </Card>

        <Card>
          <CardHeader
            title={t("portal.settings.safeguardingTitle")}
            description={t("portal.settings.safeguardingBody")}
          />
          <div className="space-y-4 p-5">
            <label className="block text-xs font-semibold uppercase tracking-wide text-ink-faint">
              {t("portal.requests.safeguardingFlag")}
              <TextInput defaultValue="Dr. Amina Yusuf" className="mt-1.5" />
            </label>
            <label className="block text-xs font-semibold uppercase tracking-wide text-ink-faint">
              {t("contact.phoneTitle")}
              <TextInput defaultValue="+234 800 000 0000" className="mt-1.5" />
            </label>
            <Button variant="secondary">{t("common.save")}</Button>
          </div>
        </Card>

        <Card>
          <CardHeader
            title={t("portal.settings.retentionTitle")}
            description={t("portal.settings.retentionBody")}
          />
          <div className="space-y-4 p-5">
            <Select defaultValue="7" aria-label={t("portal.settings.retentionTitle")}>
              <option value="3">3 years after case closure</option>
              <option value="7">7 years after case closure</option>
              <option value="10">10 years after case closure</option>
            </Select>
            <p className="text-xs leading-relaxed text-ink-muted">
              Retention must be set against the Foundation&rsquo;s professional and legal
              obligations, and confirmed with its data-protection adviser. Records are
              securely destroyed at the end of the period.
            </p>
            <Button variant="secondary">{t("common.save")}</Button>
          </div>
        </Card>
      </div>
    </>
  );
}
