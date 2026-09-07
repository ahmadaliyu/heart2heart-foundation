import { redirect } from "next/navigation";
import { BadgeCheck, Plus, TriangleAlert } from "lucide-react";

import { getTranslations } from "@/lib/i18n/server";
import { localePath, type Locale } from "@/lib/i18n/config";
import { requireSession } from "@/lib/session";
import { emergencyContacts } from "@/lib/data";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  PortalPageHeader,
  Table,
  TableWrap,
  Td,
  Th,
  Tr,
} from "@/components/portal/portal-ui";
import { formatDate } from "@/lib/utils";

export default async function PortalEmergencyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await getTranslations(params);
  const user = await requireSession();
  if (user.role !== "ADMIN") redirect(localePath(locale as Locale, "/portal/dashboard"));

  const unverified = emergencyContacts.filter((contact) => !contact.verified).length;

  return (
    <>
      <PortalPageHeader
        title={t("portal.emergency.title")}
        lede={t("portal.emergency.lede")}
        action={
          <Button>
            <Plus aria-hidden="true" className="size-4" />
            {t("portal.emergency.addContact")}
          </Button>
        }
      />

      {unverified > 0 ? (
        <Alert tone="warning" className="mb-5" title={t("portal.emergency.unverify")}>
          <p>
            {unverified} contact{unverified === 1 ? "" : "s"} not yet verified. Unverified
            contacts are hidden from the public emergency page — a number that does not
            connect is worse than no number at all.
          </p>
        </Alert>
      ) : null}

      <TableWrap>
        <Table>
          <thead>
            <tr>
              <Th>{t("portal.users.columns.name")}</Th>
              <Th>{t("emergency.categories.GENERAL")}</Th>
              <Th>{t("contact.phoneTitle")}</Th>
              <Th>{t("contact.hoursTitle")}</Th>
              <Th>{t("portal.emergency.lastVerified")}</Th>
              <Th className="text-right">{t("portal.common.actions")}</Th>
            </tr>
          </thead>
          <tbody>
            {emergencyContacts.map((contact) => (
              <Tr key={contact.id}>
                <Td className="font-medium text-ink">
                  {contact.name}
                  <span className="mt-0.5 block max-w-sm text-xs text-ink-faint">
                    {contact.description}
                  </span>
                </Td>
                <Td className="text-ink-muted">
                  {t(`emergency.categories.${contact.category}`)}
                </Td>
                <Td className="whitespace-nowrap font-mono text-xs text-ink">
                  {contact.phone}
                </Td>
                <Td className="text-ink-muted">{contact.hours}</Td>
                <Td>
                  {contact.verified && contact.verifiedAt ? (
                    <span className="flex items-center gap-2">
                      <Badge
                        tone="success"
                        icon={<BadgeCheck aria-hidden="true" className="size-3.5" />}
                      >
                        {formatDate(contact.verifiedAt, locale as Locale, {
                          day: "numeric",
                          month: "short",
                        })}
                      </Badge>
                    </span>
                  ) : (
                    <Badge
                      tone="warning"
                      icon={<TriangleAlert aria-hidden="true" className="size-3.5" />}
                    >
                      {t("portal.emergency.neverVerified")}
                    </Badge>
                  )}
                </Td>
                <Td className="text-right">
                  <Button size="sm" variant="secondary">
                    {contact.verified
                      ? t("portal.emergency.unverify")
                      : t("portal.emergency.verify")}
                  </Button>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableWrap>
    </>
  );
}
