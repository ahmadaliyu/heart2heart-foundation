import { redirect } from "next/navigation";
import { Plus } from "lucide-react";

import { getTranslations } from "@/lib/i18n/server";
import { localePath, type Locale } from "@/lib/i18n/config";
import { requireSession } from "@/lib/session";
import { events } from "@/lib/data";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  PortalPageHeader,
  Table,
  TableWrap,
  Td,
  Th,
  Tr,
} from "@/components/portal/portal-ui";
import { formatDate, formatTime } from "@/lib/utils";

const TONE: Record<string, BadgeTone> = {
  OPEN: "success",
  UPCOMING: "info",
  FULL: "warning",
  PAST: "neutral",
  CANCELLED: "danger",
};

export default async function PortalEventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await getTranslations(params);
  const user = await requireSession();
  if (user.role !== "ADMIN") redirect(localePath(locale as Locale, "/portal/dashboard"));

  const columns = t.object<Record<string, string>>("portal.events.columns");
  const sorted = [...events].sort(
    (a, b) => +new Date(b.startsAt) - +new Date(a.startsAt),
  );

  return (
    <>
      <PortalPageHeader
        title={t("portal.events.title")}
        lede={t("portal.events.lede")}
        action={
          <Button>
            <Plus aria-hidden="true" className="size-4" />
            {t("portal.events.newEvent")}
          </Button>
        }
      />

      <TableWrap>
        <Table>
          <thead>
            <tr>
              <Th>{columns.title}</Th>
              <Th>{columns.kind}</Th>
              <Th>{columns.date}</Th>
              <Th>{columns.location}</Th>
              <Th>{columns.registered}</Th>
              <Th>{columns.status}</Th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((event) => (
              <Tr key={event.slug}>
                <Td className="font-medium text-ink">
                  {event.title}
                  <span className="mt-0.5 block text-xs text-ink-faint">
                    {event.organiser}
                  </span>
                </Td>
                <Td className="text-ink-muted">{t(`events.kinds.${event.kind}`)}</Td>
                <Td className="whitespace-nowrap text-ink-muted">
                  {formatDate(event.startsAt, locale as Locale, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                  <span className="mt-0.5 block text-xs text-ink-faint">
                    {formatTime(event.startsAt, locale as Locale)}
                  </span>
                </Td>
                <Td className="text-ink-muted">{event.location}</Td>
                <Td className="text-ink-muted">
                  {event.registered !== undefined && event.capacity !== undefined ? (
                    <span>
                      <span className="font-semibold text-ink">{event.registered}</span> /{" "}
                      {event.capacity}
                    </span>
                  ) : (
                    "—"
                  )}
                </Td>
                <Td>
                  <Badge tone={TONE[event.status] ?? "neutral"}>{event.status}</Badge>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableWrap>
    </>
  );
}
