import { FolderOpen } from "lucide-react";

import { getTranslations } from "@/lib/i18n/server";
import { localePath, type Locale } from "@/lib/i18n/config";
import { requireSession } from "@/lib/session";
import { listCases, staffName } from "@/lib/data";
import { appointmentStatuses, type AppointmentStatus } from "@/lib/types";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterBar } from "@/components/portal/filter-bar";
import { StatusBadge } from "@/components/portal/status-badge";
import {
  CaseRefCell,
  PortalPageHeader,
  Table,
  TableWrap,
  Td,
  Th,
  Tr,
} from "@/components/portal/portal-ui";
import { formatDate } from "@/lib/utils";

export default async function CasesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { locale, t } = await getTranslations(params);
  const query = await searchParams;
  const user = await requireSession();

  const cases = listCases({
    therapistId: user.role === "THERAPIST" ? user.id : undefined,
    status: appointmentStatuses.includes(query.status as AppointmentStatus)
      ? (query.status as AppointmentStatus)
      : undefined,
  });

  const base = localePath(locale as Locale, "/portal/cases");

  return (
    <>
      <PortalPageHeader title={t("portal.cases.title")} lede={t("portal.cases.lede")} />

      <div className="mb-5 rounded-2xl border border-line bg-surface p-4">
        <FilterBar
          label={t("portal.requests.filterStatus")}
          basePath={base}
          param="status"
          current={query.status}
          searchParams={query}
          options={(
            ["CONFIRMED", "COMPLETED", "FOLLOW_UP", "CLOSED"] as AppointmentStatus[]
          ).map((status) => ({ value: status, label: t(`enums.status.${status}`) }))}
        />
      </div>

      {cases.length ? (
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th>{t("portal.requests.columns.ref")}</Th>
                <Th>{t("portal.requests.columns.name")}</Th>
                <Th>{t("portal.requests.columns.category")}</Th>
                <Th>{t("portal.cases.openedOn")}</Th>
                <Th>{t("portal.appointments.title")}</Th>
                <Th>{t("portal.common.assignedTo")}</Th>
                <Th>{t("portal.requests.columns.status")}</Th>
              </tr>
            </thead>
            <tbody>
              {cases.map((record) => (
                <Tr key={record.caseRef}>
                  <Td>
                    <CaseRefCell
                      href={`${base}/${record.caseRef}`}
                      caseRef={record.caseRef}
                    />
                  </Td>
                  <Td className="font-medium text-ink">{record.preferredName}</Td>
                  <Td className="text-ink-muted">
                    {t(`enums.categoryShort.${record.category}`)}
                  </Td>
                  <Td className="text-ink-muted">
                    {formatDate(record.openedAt, locale as Locale, {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </Td>
                  <Td className="text-ink-muted">{record.appointments.length}</Td>
                  <Td className="text-ink-muted">
                    {staffName(record.assignedTherapistId) ??
                      t("portal.requests.unassigned")}
                  </Td>
                  <Td>
                    <StatusBadge status={record.status} />
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </TableWrap>
      ) : (
        <EmptyState
          icon={<FolderOpen aria-hidden="true" className="size-5" />}
          title={t("portal.cases.empty")}
        />
      )}
    </>
  );
}
