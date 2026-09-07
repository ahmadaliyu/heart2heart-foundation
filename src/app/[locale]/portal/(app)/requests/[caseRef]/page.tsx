import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ShieldAlert, TriangleAlert } from "lucide-react";

import { getTranslations } from "@/lib/i18n/server";
import { localePath, type Locale } from "@/lib/i18n/config";
import { requireSession } from "@/lib/session";
import { getRequest, isMinor, therapists, staffName } from "@/lib/data";
import { nextStatuses } from "@/lib/status";
import { Card, CardHeader } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/field";
import { PriorityBadge, StatusBadge } from "@/components/portal/status-badge";
import { RevealContact } from "@/components/portal/reveal-contact";
import { PortalPageHeader } from "@/components/portal/portal-ui";
import { advanceStatusAction, assignTherapistAction } from "../../actions";
import { formatDate, formatDateTime, formatSlot } from "@/lib/utils";

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ locale: string; caseRef: string }>;
}) {
  const resolved = await params;
  const { locale, t } = await getTranslations(params);
  await requireSession();

  const request = getRequest(decodeURIComponent(resolved.caseRef));
  if (!request) notFound();

  const p = (path: string) => localePath(locale as Locale, path);
  const minor = isMinor(request.ageRange);
  const available = nextStatuses(request.status);

  const intake: { label: string; value: string }[] = [
    { label: t("counselling.fields.preferredName"), value: request.preferredName },
    { label: t("counselling.fields.category"), value: t(`enums.category.${request.category}`) },
    { label: t("counselling.fields.ageRange"), value: t(`enums.ageRange.${request.ageRange}`) },
    {
      label: t("counselling.fields.supportAreas"),
      value:
        request.supportAreas.map((area) => t(`enums.supportArea.${area}`)).join(", ") || "—",
    },
    { label: t("counselling.fields.language"), value: locale === "ha" ? "Hausa" : request.preferredLanguage === "ha" ? "Hausa" : "English" },
    {
      label: t("counselling.fields.preferredDate"),
      value: `${formatDate(request.preferredDate, locale as Locale)} · ${formatSlot(request.preferredTimeSlot, locale as Locale)}`,
    },
    { label: t("portal.common.created"), value: formatDateTime(request.createdAt, locale as Locale) },
    { label: t("portal.common.updated"), value: formatDateTime(request.updatedAt, locale as Locale) },
  ];

  return (
    <>
      <Link
        href={p("/portal/requests")}
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        {t("portal.common.backTo")} {t("portal.requests.title").toLowerCase()}
      </Link>

      <PortalPageHeader
        title={
          <span className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xl sm:text-2xl">{request.caseRef}</span>
            <StatusBadge status={request.status} />
            <PriorityBadge priority={request.priority} />
          </span>
        }
        lede={`${t("portal.requests.detailTitle")} · ${request.preferredName}`}
      />

      {/* Safeguarding notices come first and are impossible to scroll past. */}
      <div className="mb-6 space-y-3">
        {request.safeguardingFlag ? (
          <Alert
            tone="danger"
            title={t("portal.requests.safeguardingFlag")}
          >
            {t("portal.requests.safeguardingFlagBody")}
          </Alert>
        ) : null}

        {minor ? (
          <Alert tone="warning" title={t("portal.requests.minorNotice")}>
            {request.guardianAware === undefined ? null : (
              <p>
                {t("portal.requests.guardianAware")}:{" "}
                <strong>{request.guardianAware ? t("common.yes") : t("common.no")}</strong>
              </p>
            )}
          </Alert>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader title={t("portal.requests.intakeTitle")} />
            <dl className="divide-y divide-line">
              {intake.map((row) => (
                <div
                  key={row.label}
                  className="flex flex-wrap gap-x-6 gap-y-1 px-5 py-3 text-sm"
                >
                  <dt className="w-full text-xs font-semibold uppercase tracking-wide text-ink-faint sm:w-48">
                    {row.label}
                  </dt>
                  <dd className="flex-1 text-ink">{row.value}</dd>
                </div>
              ))}
            </dl>

            {request.reason ? (
              <div className="border-t border-line px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
                  {t("counselling.fields.reason")}
                </p>
                <p className="mt-2 leading-relaxed text-ink">{request.reason}</p>
              </div>
            ) : null}
          </Card>

          <Card>
            <CardHeader
              title={t("portal.requests.contactTitle")}
              description={t("portal.requests.contactMasked")}
            />
            <div className="space-y-4 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
                  {t("counselling.fields.contactMethod")}
                </p>
                <p className="mt-1 text-sm text-ink">
                  {t(`enums.contactMethod.${request.contactMethod}`)}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">
                  {t("counselling.fields.contactValue")}
                </p>
                <RevealContact value={request.contactValue} />
              </div>
            </div>
          </Card>
        </div>

        {/* --------------------------------------------------------- actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader title={t("portal.requests.actionsTitle")} />
            <div className="space-y-3 p-5">
              {available.length ? (
                available.map((status) => (
                  <form key={status} action={advanceStatusAction}>
                    <input type="hidden" name="caseRef" value={request.caseRef} />
                    <input type="hidden" name="status" value={status} />
                    <Button
                      type="submit"
                      fullWidth
                      variant={
                        status === "APPROVED" || status === "CONFIRMED"
                          ? "primary"
                          : status === "REJECTED" || status === "CANCELLED"
                            ? "danger"
                            : "secondary"
                      }
                    >
                      {t(`enums.status.${status}`)}
                    </Button>
                  </form>
                ))
              ) : (
                <p className="text-sm text-ink-muted">{t("enums.status.CLOSED")}</p>
              )}

              <p className="pt-1 text-xs leading-relaxed text-ink-faint">
                Only transitions the Foundation&rsquo;s process allows are offered here.
              </p>
            </div>
          </Card>

          <Card>
            <CardHeader title={t("portal.requests.assign")} />
            <form action={assignTherapistAction} className="space-y-3 p-5">
              <input type="hidden" name="caseRef" value={request.caseRef} />
              <p className="text-sm text-ink-muted">
                {t("portal.common.assignedTo")}:{" "}
                <strong className="text-ink">
                  {staffName(request.assignedTherapistId) ??
                    t("portal.requests.unassigned")}
                </strong>
              </p>
              <Select name="therapistId" defaultValue={request.assignedTherapistId ?? ""}>
                <option value="">—</option>
                {therapists().map((therapist) => (
                  <option key={therapist.id} value={therapist.id}>
                    {therapist.name}
                  </option>
                ))}
              </Select>
              <Button type="submit" fullWidth variant="secondary">
                {t("common.save")}
              </Button>
            </form>
          </Card>

          <Card className="border-tint-line bg-tint">
            <div className="flex gap-3 p-5">
              <ShieldAlert
                aria-hidden="true"
                className="mt-0.5 size-5 shrink-0 text-brand"
              />
              <div className="text-sm">
                <p className="font-semibold text-heading">
                  {t("portal.cases.confidentialNotice")}
                </p>
                <p className="mt-1 text-ink-muted">
                  {t("portal.login.confidentialityNote")}
                </p>
              </div>
            </div>
          </Card>

          <Link
            href={p(`/portal/cases/${request.caseRef}`)}
            className="flex items-center justify-between rounded-2xl border border-line bg-surface p-5 text-sm font-semibold text-brand transition-colors hover:border-plum-300"
          >
            {t("portal.dashboard.viewCase")}
            <Badge tone="brand">{t("portal.cases.title")}</Badge>
          </Link>
        </div>
      </div>

      {request.priority === "URGENT" && !request.safeguardingFlag ? (
        <Alert tone="warning" className="mt-6" title={t("enums.priority.URGENT")}>
          <p className="flex items-center gap-2">
            <TriangleAlert aria-hidden="true" className="size-4" />
            {t("portal.dashboard.urgentFlags")}
          </p>
        </Alert>
      ) : null}
    </>
  );
}
