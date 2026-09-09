import Link from "next/link";
import { ArrowRight, Mail, Phone } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { ThemeToggle } from "@/components/layout/theme";
import { localePath, type Locale } from "@/lib/i18n/config";
import { translatorFor } from "@/lib/i18n/server";
import { foundationLine } from "@/lib/data";

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = translatorFor(locale);
  const line = foundationLine();
  return (
    <footer className="bpa-footer">
      <div className="bpa-container">
        <div className="footer-grid">
          <div>
            <Logo reversed size="md" />
            <p className="footer-description">{t("footer.tagline")}</p>
            <p className="footer-description">
              Foundation Centre, Wuse II, Abuja
            </p>
            <div className="footer-contact">
              {line && (
                <a href={"tel:" + line.phone.replace(/\s/g, "")}>
                  <Phone size={17} />
                  {line.phone}
                </a>
              )}
              <a href="mailto:hello@heart2heart.ng">
                <Mail size={17} />
                hello@heart2heart.ng
              </a>
            </div>
          </div>
          <div className="footer-box">
            <h2>{t("home.resourcesTitle")}</h2>
            <p>{t("home.resourcesBody")}</p>
            <Link
              className="bpa-button bpa-button-outline"
              href={localePath(locale, "/resources")}
            >
              {t("nav.resources")}
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
        <nav className="footer-links" aria-label={t("footer.explore")}>
          {[
            ["/about", "nav.about"],
            ["/services", "nav.services"],
            ["/events", "nav.events"],
            ["/contact", "nav.contact"],
            ["/donate", "nav.donate"],
            ["/emergency", "nav.emergency"],
          ].map(([href, key]) => (
            <Link href={localePath(locale, href)} key={href}>
              {t(key)}
            </Link>
          ))}
        </nav>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} {t("meta.name")}. {t("footer.rights")}
          </p>
          <div className="flex flex-wrap gap-5">
            {[
              ["/privacy", "footer.privacy"],
              ["/safeguarding", "footer.safeguarding"],
              ["/accessibility", "footer.accessibility"],
              ["/terms", "footer.terms"],
            ].map(([href, key]) => (
              <Link href={localePath(locale, href)} key={href}>
                {t(key)}
              </Link>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <p>{t("footer.emergencyNote")}</p>
          <div className="footer-tools">
            <LocaleSwitcher tone="dark" />
            <ThemeToggle tone="dark" />
          </div>
        </div>
      </div>
    </footer>
  );
}
