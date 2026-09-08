import { notFound } from "next/navigation";

import { features } from "@/lib/features";

export const metadata = {
  title: "Foundation portal",
  robots: { index: false, follow: false, nocache: true, noarchive: true },
};

export default function PortalRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Switched off in src/lib/features.ts. Guarding the layout rather than only
  // hiding the link means a disabled feature cannot be reached by typing the
  // URL either — including the sign-in screen itself.
  if (!features.staffPortal) notFound();

  return children;
}
