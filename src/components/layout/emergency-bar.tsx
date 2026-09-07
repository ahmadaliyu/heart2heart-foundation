import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { localePath, type Locale } from "@/lib/i18n/config";
import { translatorFor } from "@/lib/i18n/server";

/**
 * Sits above everything on every public page. The blueprint asks for a
 * prominent "Need help now?" pathway; putting it in the chrome rather than on
 * one page means it is one tap away wherever someone happens to land.
 *
 * Deliberately a thin strip rather than a banner — permanently loud is
 * permanently ignored, and the page underneath has to stay calm.
 */
export function EmergencyBar({ locale }: { locale: Locale }) {
  const t = translatorFor(locale);

  return (
    <div className="relative z-50 bg-emergency text-white">
      <div className="container-page flex h-10 items-center gap-3">
        <Link
          href={localePath(locale, "/emergency")}
          className="group inline-flex items-center gap-2.5"
        >
          <span
            aria-hidden="true"
            className="size-1.5 shrink-0 rounded-full bg-white/90"
          />
          <span className="eyebrow">{t("emergency.banner")}</span>
          <ArrowRight
            aria-hidden="true"
            className="size-3.5 shrink-0 transition-transform duration-250 group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </div>
  );
}
