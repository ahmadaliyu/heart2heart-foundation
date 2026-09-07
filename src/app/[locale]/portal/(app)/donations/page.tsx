import { redirect } from "next/navigation";
import { Download, Repeat, TrendingUp, Wallet } from "lucide-react";

import { getTranslations } from "@/lib/i18n/server";
import { localePath, type Locale } from "@/lib/i18n/config";
import { requireSession } from "@/lib/session";
import { donationStats, listDonations } from "@/lib/data";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  PortalPageHeader,
  StatCard,
  Table,
  TableWrap,
  Td,
  Th,
  Tr,
} from "@/components/portal/portal-ui";
import { formatDate, formatNaira } from "@/lib/utils";

const TONE: Record<string, BadgeTone> = {
  SUCCESSFUL: "success",
  PENDING: "warning",
  FAILED: "danger",
  REFUNDED: "neutral",
};

export default async function DonationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await getTranslations(params);
  const user = await requireSession();
  if (user.role !== "ADMIN") redirect(localePath(locale as Locale, "/portal/dashboard"));

  const stats = donationStats();
  const rows = listDonations();
  const columns = t.object<Record<string, string>>("portal.donations.columns");

  return (
    <>
      <PortalPageHeader
        title={t("portal.donations.title")}
        lede={t("portal.donations.lede")}
        action={
          <Button variant="secondary">
            <Download aria-hidden="true" className="size-4" />
            {t("portal.donations.export")}
          </Button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={t("portal.donations.total")}
          value={formatNaira(stats.total, locale as Locale)}
          hint={`${stats.count}`}
          icon={<Wallet aria-hidden="true" className="size-4" />}
        />
        <StatCard
          label={t("portal.donations.thisMonth")}
          value={formatNaira(stats.thisMonth, locale as Locale)}
          icon={<TrendingUp aria-hidden="true" className="size-4" />}
        />
        <StatCard
          label={t("portal.donations.average")}
          value={formatNaira(stats.average, locale as Locale)}
        />
        <StatCard
          label={t("portal.donations.recurring")}
          value={stats.recurringDonors}
          icon={<Repeat aria-hidden="true" className="size-4" />}
        />
      </div>

      <TableWrap>
        <Table>
          <thead>
            <tr>
              <Th>{columns.reference}</Th>
              <Th>{columns.donor}</Th>
              <Th>{columns.amount}</Th>
              <Th>{columns.designation}</Th>
              <Th>{columns.date}</Th>
              <Th>{columns.status}</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((donation) => (
              <Tr key={donation.id}>
                <Td className="font-mono text-xs text-ink-muted">{donation.reference}</Td>
                <Td className="font-medium text-ink">
                  {donation.anonymous
                    ? t("portal.donations.anonymousLabel")
                    : donation.donorName}
                  {donation.recurring ? (
                    <Badge tone="brand" className="ml-2">
                      {t("donate.monthly")}
                    </Badge>
                  ) : null}
                </Td>
                <Td className="whitespace-nowrap font-semibold text-ink">
                  {formatNaira(donation.amount, locale as Locale)}
                </Td>
                <Td className="text-ink-muted">
                  {t(`donate.designations.${donation.designation}`)}
                </Td>
                <Td className="whitespace-nowrap text-ink-muted">
                  {formatDate(donation.createdAt, locale as Locale, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </Td>
                <Td>
                  <Badge tone={TONE[donation.status] ?? "neutral"}>
                    {t(`enums.donationStatus.${donation.status}`)}
                  </Badge>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableWrap>
    </>
  );
}
