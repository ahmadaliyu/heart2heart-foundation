import { redirect } from "next/navigation";

import { defaultLocale, isLocale, localePath } from "@/lib/i18n/config";
import { getSession } from "@/lib/session";

export default async function PortalIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolved = isLocale(locale) ? locale : defaultLocale;
  const session = await getSession();

  redirect(localePath(resolved, session ? "/portal/dashboard" : "/portal/login"));
}
