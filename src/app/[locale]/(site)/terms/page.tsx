import { getTranslations } from "@/lib/i18n/server";
import { PolicyPage } from "@/components/policy-page";

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { t } = await getTranslations(params);

  // Placeholder terms. The Foundation's legal adviser must review and replace
  // these before launch — they are structured, not drafted.
  const sections = [
    {
      title: "Who we are",
      body: "This website and progressive web app are operated by Heart2Heart Foundation, Abuja, Nigeria. Using the site means accepting these terms.",
    },
    {
      title: "What this service is",
      body: "The platform provides information about the Foundation, educational resources, event listings, a donation facility and a private channel for requesting counselling. It is not a medical service and it is not an emergency service.",
    },
    {
      title: "Counselling requests",
      body: "Submitting a request does not guarantee an appointment. Requests are reviewed by qualified staff, and the Foundation may decline a request or refer it onward where that is the appropriate response.",
    },
    {
      title: "Your responsibilities",
      body: "Please give accurate contact details so we can reach you, and do not use the platform to send abusive, unlawful or deliberately false content.",
    },
    {
      title: "Content and resources",
      body: "Articles, videos and guides are general educational material. They are not personal advice and should not replace speaking to a qualified professional about your own situation.",
    },
    {
      title: "Donations",
      body: "Donations are processed by a licensed Nigerian payment provider. Receipts are issued to the email address given. Refund requests should be sent to the Foundation directly.",
    },
    {
      title: "Availability",
      body: "We aim to keep the platform available at all times but cannot guarantee uninterrupted service. Planned maintenance will be announced where possible.",
    },
    {
      title: "Changes to these terms",
      body: "We may update these terms. Material changes will be highlighted on this page with the date they take effect.",
    },
  ];

  return <PolicyPage title={t("terms.title")} lede={t("terms.lede")} sections={sections} />;
}
