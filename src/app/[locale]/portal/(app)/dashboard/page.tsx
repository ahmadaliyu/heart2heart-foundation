import Link from "next/link";
import {
  CalendarDays,
  CircleCheck,
  Inbox,
  Repeat,
  TriangleAlert,
} from "lucide-react";

import { getTranslations } from "@/lib/i18n/server";
import { localePath, type Locale } from "@/lib/i18n/config";
import { requireSession } from "@/lib/session";
import {
  dashboardStats,
  getStaff,
  listDonations,
  pendingRequests,
  todaysAppointments,
  upcomingAppointments,
} from "@/lib/data";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ButtonLink } from "@/components/ui/button";
import { PortalPageHeader, StatCard } from "@/components/portal/portal-ui";
import { PriorityBadge, StatusBadge } from "@/components/portal/status-badge";
import {
  firstName,
  formatDate,
  formatNaira,
  formatTime,
  relativeDay,
} from "@/lib/utils";

export default async function PortalDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await getTranslations(params);
  const user = await requireSession();
  const isTherapist = user.role === "THERAPIST";
  const scopeId = isTherapist ? user.id : undefined;

  const stats = dashboardStats(scopeId);
  const today = todaysAppointments(scopeId);
  const upcoming = upcomingAppointments(scopeId, 5);
  const pending = pendingRequests().slice(0, 4);
  const donations = listDonations(4);
  const p = (path: string) => localePath(locale as Locale, path);

  return (
    <>
      <PortalPageHeader
        eyebrow={formatDate(new Date(), locale as Locale, {
          weekday: "long",
          day: "numeric",
          month: "long",
        })}
        title={`${t("portal.dashboard.greeting")}, ${firstName(user.name)}`}
        lede={
          isTherapist
            ? t("portal.dashboard.therapistSubtitle")
            : t("portal.dashboard.adminSubtitle")
        }
      />

      {/* Today's count takes the night tile — it is the number that decides
          how the day goes. */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          tone="night"
          label={t("portal.dashboard.todayAppointments")}
          value={stats.today}
          hint={t("common.today")}
          icon={<CalendarDays aria-hidden="true" className="size-4" />}
          href={p("/portal/appointments")}
        />
        <StatCard
          label={t("portal.dashboard.pendingRequests")}
          value={stats.pending}
          icon={<Inbox aria-hidden="true" className="size-4" />}
          href={p("/portal/requests")}
        />
        <StatCard
          label={t("portal.dashboard.followUps")}
          value={stats.followUps}
          icon={<Repeat aria-hidden="true" className="size-4" />}
          href={p("/portal/cases")}
        />
        <StatCard
          label={t("portal.dashboard.urgentFlags")}
          value={stats.urgent}
          tone={stats.urgent > 0 ? "urgent" : "default"}
          icon={<TriangleAlert aria-hidden="true" className="size-4" />}
          href={p("/portal/requests?priority=URGENT")}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* ------------------------------------------------- today's diary */}
        <Card>
          <CardHeader
            title={t("portal.dashboard.todayAppointments")}
            action={
              <ButtonLink href={p("/portal/appointments")} size="sm" variant="secondary">
                {t("common.viewAll")}
              </ButtonLink>
            }
          />
          <div className="p-5">
            {today.length ? (
              <ol className="relative space-y-1 border-l border-line pl-6">
                {today.map((appointment) => (
                  <li key={appointment.id} className="relative">
                    <span
                      aria-hidden="true"
                      className="absolute -left-[1.9375rem] top-4 size-2.5 rounded-full bg-plum-500 ring-4 ring-surface"
                    />
                    <Link
                      href={p(`/portal/cases/${appointment.caseRef}`)}
                      className="flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-lilac"
                    >
                      <span className="font-mono text-sm font-medium text-brand-strong">
                        {formatTime(appointment.scheduledFor, locale as Locale)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm text-ink">
                          {t(`enums.appointmentMode.${appointment.mode}`)}
                          {appointment.location ? ` · ${appointment.location}` : ""}
                        </span>
                        <span className="mt-0.5 block font-mono text-xs text-ink-faint">
                          {appointment.caseRef}
                        </span>
                      </span>
                      <StatusBadge status={appointment.status} />
                    </Link>
                  </li>
                ))}
              </ol>
            ) : (
              <EmptyState
                icon={<CalendarDays aria-hidden="true" className="size-5" />}
                title={t("portal.dashboard.noAppointmentsToday")}
              />
            )}
          </div>
        </Card>

        {/* ---------------------------------------------- pending requests */}
        <Card>
          <CardHeader
            title={t("portal.dashboard.pendingRequests")}
            action={
              <ButtonLink href={p("/portal/requests")} size="sm" variant="secondary">
                {t("common.viewAll")}
              </ButtonLink>
            }
          />
          <div className="p-5">
            {pending.length ? (
              <ul className="space-y-2.5">
                {pending.map((request) => (
                  <li key={request.id}>
                    <Link
                      href={p(`/portal/requests/${request.caseRef}`)}
                      className="block rounded-xl border border-line p-4 transition-all duration-250 hover:-translate-y-0.5 hover:border-plum-300 hover:shadow-sm"
                    >
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-medium text-brand">
                          {request.caseRef}
                        </span>
                        <PriorityBadge priority={request.priority} />
                        {request.safeguardingFlag ? (
                          <Badge
                            tone="danger"
                            icon={<TriangleAlert aria-hidden="true" className="size-3" />}
                          >
                            {t("portal.requests.safeguardingFlag")}
                          </Badge>
                        ) : null}
                      </span>
                      <span className="mt-2 flex items-center justify-between gap-3">
                        <span className="text-sm text-ink">
                          {t(`enums.categoryShort.${request.category}`)}
                          <span className="text-ink-faint">
                            {" "}
                            · {relativeDay(request.createdAt, locale as Locale)}
                          </span>
                        </span>
                        <StatusBadge status={request.status} />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                icon={<CircleCheck aria-hidden="true" className="size-5" />}
                title={t("portal.dashboard.noPending")}
              />
            )}
          </div>
        </Card>
      </div>

      {/* --------------------------------------------------- upcoming + this month */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title={t("portal.dashboard.upcomingAppointments")} />
          <div className="p-5">
            {upcoming.length ? (
              <ul className="divide-y divide-line">
                {upcoming.map((appointment) => (
                  <li
                    key={appointment.id}
                    className="flex flex-wrap items-center gap-x-5 gap-y-1 py-3.5 first:pt-0 last:pb-0"
                  >
                    <span className="w-36 shrink-0 text-sm font-semibold text-ink">
                      {formatDate(appointment.scheduledFor, locale as Locale, {
                        day: "numeric",
                        month: "short",
                      })}
                      <span className="ml-2 font-mono text-xs font-normal text-ink-muted">
                        {formatTime(appointment.scheduledFor, locale as Locale)}
                      </span>
                    </span>
                    <Link
                      href={p(`/portal/cases/${appointment.caseRef}`)}
                      className="font-mono text-xs text-brand hover:underline"
                    >
                      {appointment.caseRef}
                    </Link>
                    <span className="text-sm text-ink-muted">
                      {getStaff(appointment.therapistId)?.name}
                    </span>
                    <span className="ml-auto">
                      <StatusBadge status={appointment.status} />
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState title={t("portal.appointments.empty")} />
            )}
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader title={t("portal.dashboard.analytics")} />
            <dl className="divide-y divide-line px-5">
              {[
                { label: t("portal.dashboard.newRequests"), value: stats.newThisMonth },
                { label: t("portal.dashboard.sessionsHeld"), value: stats.sessionsThisMonth },
                { label: t("portal.dashboard.casesClosed"), value: stats.closedThisMonth },
                ...(isTherapist
                  ? []
                  : [
                      {
                        label: t("portal.dashboard.donationsTotal"),
                        value: formatNaira(stats.donations.thisMonth, locale as Locale),
                      },
                    ]),
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-baseline justify-between gap-3 py-3.5"
                >
                  <dt className="text-sm text-ink-muted">{row.label}</dt>
                  <dd className="font-display text-xl text-heading">{row.value}</dd>
                </div>
              ))}
            </dl>
          </Card>

          {!isTherapist ? (
            <Card>
              <CardHeader
                title={t("portal.dashboard.recentDonations")}
                action={
                  <Link
                    href={p("/portal/donations")}
                    className="eyebrow text-brand hover:underline"
                  >
                    {t("common.viewAll")}
                  </Link>
                }
              />
              <ul className="divide-y divide-line px-5">
                {donations.map((donation) => (
                  <li
                    key={donation.id}
                    className="flex items-center justify-between gap-3 py-3"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm text-ink">
                        {donation.anonymous
                          ? t("portal.donations.anonymousLabel")
                          : donation.donorName}
                      </span>
                      <span className="eyebrow block text-ink-faint">
                        {relativeDay(donation.createdAt, locale as Locale)}
                      </span>
                    </span>
                    <span className="shrink-0 font-mono text-sm font-medium text-ink">
                      {formatNaira(donation.amount, locale as Locale)}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}

          {!isTherapist ? (
            <Card tone="night" className="p-5">
              <p className="eyebrow text-plum-300">{t("portal.donations.total")}</p>
              <p className="mt-4 font-display text-3xl leading-none text-white">
                {formatNaira(stats.donations.total, locale as Locale)}
              </p>
              <p className="mt-3 text-xs text-plum-300">
                {stats.donations.count} · {t("portal.donations.recurring")}{" "}
                {stats.donations.recurringDonors}
              </p>
            </Card>
          ) : null}
        </div>
      </div>
    </>
  );
}
