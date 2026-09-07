export const metadata = {
  title: "Foundation portal",
  robots: { index: false, follow: false, nocache: true, noarchive: true },
};

export default function PortalRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
