import { redirect } from "next/navigation";
import { UserPlus } from "lucide-react";

import { getTranslations } from "@/lib/i18n/server";
import { localePath, type Locale } from "@/lib/i18n/config";
import { requireSession } from "@/lib/session";
import { staff } from "@/lib/data";
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
import { formatDateTime, initials } from "@/lib/utils";

export default async function UsersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await getTranslations(params);
  const user = await requireSession();
  if (user.role !== "ADMIN") redirect(localePath(locale as Locale, "/portal/dashboard"));

  const columns = t.object<Record<string, string>>("portal.users.columns");

  return (
    <>
      <PortalPageHeader
        title={t("portal.users.title")}
        lede={t("portal.users.lede")}
        action={
          <Button>
            <UserPlus aria-hidden="true" className="size-4" />
            {t("portal.users.invite")}
          </Button>
        }
      />

      <Alert tone="privacy" className="mb-5">
        Therapist accounts can read clinical case notes. Administrator accounts can
        arrange appointments and manage content but must not be given access to
        clinical notes when the real permission model is implemented.
      </Alert>

      <TableWrap>
        <Table>
          <thead>
            <tr>
              <Th>{columns.name}</Th>
              <Th>{columns.role}</Th>
              <Th>{columns.email}</Th>
              <Th>{columns.lastActive}</Th>
              <Th>{columns.status}</Th>
            </tr>
          </thead>
          <tbody>
            {staff.map((member) => (
              <Tr key={member.id}>
                <Td>
                  <span className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-tint-strong text-xs font-bold text-brand-strong"
                    >
                      {initials(member.name)}
                    </span>
                    <span>
                      <span className="block font-medium text-ink">{member.name}</span>
                      <span className="block text-xs text-ink-faint">{member.title}</span>
                    </span>
                  </span>
                </Td>
                <Td>
                  <Badge tone={member.role === "THERAPIST" ? "brand" : "neutral"}>
                    {t(`portal.users.roles.${member.role}`)}
                  </Badge>
                </Td>
                <Td className="text-ink-muted">{member.email}</Td>
                <Td className="whitespace-nowrap text-ink-muted">
                  {member.lastActiveAt
                    ? formatDateTime(member.lastActiveAt, locale as Locale)
                    : "—"}
                </Td>
                <Td>
                  <Badge tone={member.active ? "success" : "neutral"}>
                    {member.active ? t("portal.users.active") : t("portal.users.inactive")}
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
