import { redirect } from "next/navigation";

import { PortalShell } from "@/components/portal/portal-shell";
import { getSession } from "@/lib/session";
import { defaultLocale, isLocale, localePath } from "@/lib/i18n/config";

export default async function PortalAppLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolved = isLocale(locale) ? locale : defaultLocale;

  const user = await getSession();
  if (!user) redirect(localePath(resolved, "/portal/login"));

  return <PortalShell user={user}>{children}</PortalShell>;
}
