import { Inbox, TriangleAlert } from "lucide-react";

import { getTranslations } from "@/lib/i18n/server";
import { localePath, type Locale } from "@/lib/i18n/config";
import { requireSession } from "@/lib/session";
import { listRequests } from "@/lib/data";
import {
  appointmentStatuses,
  beneficiaryCategories,
  priorities,
  type AppointmentStatus,
  type BeneficiaryCategory,
  type Priority,
} from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterBar } from "@/components/portal/filter-bar";
import { PriorityBadge, StatusBadge } from "@/components/portal/status-badge";
import {
  CaseRefCell,
  PortalPageHeader,
  Table,
  TableWrap,
  Td,
  Th,
  Tr,
} from "@/components/portal/portal-ui";
import { formatDate, formatSlot, relativeDay } from "@/lib/utils";

export default async function RequestsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { locale, t } = await getTranslations(params);
  const query = await searchParams;
  const user = await requireSession();

  const requests = listRequests({
    status: appointmentStatuses.includes(query.status as AppointmentStatus)
      ? (query.status as AppointmentStatus)
      : undefined,
    category: beneficiaryCategories.includes(query.category as BeneficiaryCategory)
      ? (query.category as BeneficiaryCategory)
      : undefined,
    priority: priorities.includes(query.priority as Priority)
      ? (query.priority as Priority)
      : undefined,
    // `q` comes from the search field in the portal rail.
    search: query.q,
    // A therapist sees the cases assigned to them plus anything still unassigned
    // and waiting for review — otherwise new requests would be invisible to the
    // only person who can act on them.
  }).filter((request) =>
    user.role === "ADMIN"
      ? true
      : !request.assignedTherapistId || request.assignedTherapistId === user.id,
  );

  const base = localePath(locale as Locale, "/portal/requests");
  const columns = t.object<Record<string, string>>("portal.requests.columns");

  return (
    <>
      <PortalPageHeader
        title={t("portal.requests.title")}
        lede={t("portal.requests.lede")}
      />

      <div className="mb-5 space-y-3 rounded-2xl border border-line bg-surface p-4">
        <FilterBar
          label={t("portal.requests.filterStatus")}
          basePath={base}
          param="status"
          current={query.status}
          searchParams={query}
          options={(
            [
              "REQUESTED",
              "UNDER_REVIEW",
              "APPROVED",
              "SCHEDULED",
              "CONFIRMED",
              "COMPLETED",
              "FOLLOW_UP",
              "CLOSED",
            ] as AppointmentStatus[]
          ).map((status) => ({ value: status, label: t(`enums.status.${status}`) }))}
        />
        <FilterBar
          label={t("portal.requests.filterCategory")}
          basePath={base}
          param="category"
          current={query.category}
          searchParams={query}
          options={beneficiaryCategories.map((category) => ({
            value: category,
            label: t(`enums.categoryShort.${category}`),
          }))}
        />
        <FilterBar
          label={t("portal.requests.filterPriority")}
          basePath={base}
          param="priority"
          current={query.priority}
          searchParams={query}
          options={priorities.map((priority) => ({
            value: priority,
            label: t(`enums.priority.${priority}`),
          }))}
        />
      </div>

      {requests.length ? (
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th>{columns.ref}</Th>
                <Th>{columns.name}</Th>
                <Th>{columns.category}</Th>
                <Th>{columns.received}</Th>
                <Th>{columns.preferred}</Th>
                <Th>{columns.status}</Th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <Tr key={request.id}>
                  <Td>
                    <CaseRefCell
                      href={`${base}/${request.caseRef}`}
                      caseRef={request.caseRef}
                    />
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      <PriorityBadge priority={request.priority} />
                      {request.safeguardingFlag ? (
                        <Badge
                          tone="danger"
                          icon={<TriangleAlert aria-hidden="true" className="size-3" />}
                        >
                          {t("common.required")}
                        </Badge>
                      ) : null}
                    </div>
                  </Td>
                  <Td className="font-medium text-ink">{request.preferredName}</Td>
                  <Td className="text-ink-muted">
                    {t(`enums.categoryShort.${request.category}`)}
                    <span className="mt-0.5 block text-xs text-ink-faint">
                      {t(`enums.ageRange.${request.ageRange}`)}
                    </span>
                  </Td>
                  <Td className="text-ink-muted">
                    {relativeDay(request.createdAt, locale as Locale)}
                  </Td>
                  <Td className="text-ink-muted">
                    {formatDate(request.preferredDate, locale as Locale, {
                      day: "numeric",
                      month: "short",
                    })}
                    <span className="mt-0.5 block text-xs text-ink-faint">
                      {formatSlot(request.preferredTimeSlot, locale as Locale)}
                    </span>
                  </Td>
                  <Td>
                    <StatusBadge status={request.status} />
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </TableWrap>
      ) : (
        <EmptyState
          icon={<Inbox aria-hidden="true" className="size-5" />}
          title={t("portal.requests.empty")}
        />
      )}
    </>
  );
}
