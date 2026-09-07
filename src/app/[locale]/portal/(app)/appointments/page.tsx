import { CalendarDays } from "lucide-react";

import { getTranslations } from "@/lib/i18n/server";
import { localePath, type Locale } from "@/lib/i18n/config";
import { requireSession } from "@/lib/session";
import { listAppointments, staffName } from "@/lib/data";
import { isPast, isSameDay } from "@/lib/data/helpers";
import { Card, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
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
import { formatDate, formatTime } from "@/lib/utils";
import type { Appointment } from "@/lib/types";

export default async function AppointmentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await getTranslations(params);
  const user = await requireSession();
  const all = listAppointments(
    user.role === "THERAPIST" ? { therapistId: user.id } : undefined,
  );

  const today = all.filter((a) => isSameDay(a.scheduledFor, new Date()));
  const upcoming = all.filter(
    (a) => !isSameDay(a.scheduledFor, new Date()) && !isPast(a.scheduledFor),
  );
  const past = all
    .filter((a) => isPast(a.scheduledFor) && !isSameDay(a.scheduledFor, new Date()))
    .reverse();

  const p = (path: string) => localePath(locale as Locale, path);

  function AppointmentTable({ rows }: { rows: Appointment[] }) {
    if (!rows.length) {
      return (
        <EmptyState
          icon={<CalendarDays aria-hidden="true" className="size-5" />}
          title={t("portal.appointments.empty")}
        />
      );
    }

    return (
      <TableWrap>
        <Table>
          <thead>
            <tr>
              <Th>{t("portal.appointments.date")}</Th>
              <Th>{t("portal.appointments.time")}</Th>
              <Th>{t("portal.requests.columns.ref")}</Th>
              <Th>{t("portal.appointments.mode")}</Th>
              <Th>{t("portal.appointments.therapist")}</Th>
              <Th>{t("portal.requests.columns.status")}</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((appointment) => (
              <Tr key={appointment.id}>
                <Td className="whitespace-nowrap font-medium text-ink">
                  {formatDate(appointment.scheduledFor, locale as Locale, {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                </Td>
                <Td className="whitespace-nowrap text-ink-muted">
                  {formatTime(appointment.scheduledFor, locale as Locale)}
                  <span className="mt-0.5 block text-xs text-ink-faint">
                    {appointment.durationMinutes} {t("portal.appointments.minutes")}
                  </span>
                </Td>
                <Td>
                  <CaseRefCell
                    href={p(`/portal/cases/${appointment.caseRef}`)}
                    caseRef={appointment.caseRef}
                  />
                </Td>
                <Td className="text-ink-muted">
                  {t(`enums.appointmentMode.${appointment.mode}`)}
                  {appointment.location ? (
                    <span className="mt-0.5 block text-xs text-ink-faint">
                      {appointment.location}
                    </span>
                  ) : null}
                </Td>
                <Td className="text-ink-muted">{staffName(appointment.therapistId)}</Td>
                <Td>
                  <StatusBadge status={appointment.status} />
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableWrap>
    );
  }

  return (
    <>
      <PortalPageHeader
        title={t("portal.appointments.title")}
        lede={t("portal.appointments.lede")}
      />

      <div className="space-y-8">
        <section>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink-muted">
            {t("common.today")}
          </h2>
          <AppointmentTable rows={today} />
        </section>

        <section>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink-muted">
            {t("common.upcoming")}
          </h2>
          <AppointmentTable rows={upcoming} />
        </section>

        <section>
          <Card>
            <CardHeader title={t("portal.cases.appointmentHistory")} />
            <div className="p-5">
              <AppointmentTable rows={past} />
            </div>
          </Card>
        </section>
      </div>
    </>
  );
}
