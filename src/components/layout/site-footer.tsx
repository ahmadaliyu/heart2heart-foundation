import Link from "next/link";
import { ArrowRight, Mail, Phone, Linkedin, Instagram, Facebook, Youtube } from "lucide-react";
import { FloatingTools } from "@/components/layout/floating-tools";
import { Logo } from "@/components/brand/logo";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { ThemeToggle } from "@/components/layout/theme";
import { localePath, type Locale } from "@/lib/i18n/config";
import { translatorFor } from "@/lib/i18n/server";

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = translatorFor(locale);
  return (
    <footer className="bpa-footer">
      <div className="bpa-container">
        <div className="footer-grid">
          <div>
            <Logo reversed size="md" />
            <p className="footer-description">{t("footer.tagline")}</p>
            <p className="footer-description">
              Kaduna, Nigeria
            </p>
            <div className="footer-contact">
              {["08034709661", "08029175028", "08132943547"].map(phone => (
                <a key={phone} href={"tel:" + phone}>
                  <Phone size={17} />
                  {phone}
                </a>
              ))}
              <a href="mailto:hello@heart2heart.ng">
                <Mail size={17} />
                hello@heart2heart.ng
              </a>
            </div>
          </div>
          <div className="footer-right"><div className="footer-box">
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
          <div className="footer-social-row">
            <Link className="bpa-button bpa-button-outline" href={localePath(locale, "/contact")}>{t("nav.contact")} <ArrowRight size={18} /></Link>
            <div className="footer-socials" aria-label="Social media">
              {[['LinkedIn', Linkedin], ['Instagram', Instagram], ['Facebook', Facebook], ['YouTube', Youtube]].map(([label, Icon]) => {
                const SocialIcon = Icon as typeof Linkedin;
                return <button key={String(label)} type="button" aria-disabled="true" aria-label={`${label} — coming soon`} title={`${label} — coming soon`}><SocialIcon size={29} /></button>;
              })}
              <button type="button" aria-disabled="true" aria-label="X — coming soon" title="X — coming soon"><svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true"><path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.6 5.5 22H2.3l8.2-9.4L.8 2h6.5l4.4 6.7L18.9 2ZM17.8 20h1.7L6.3 4H4.5z"/></svg></button>
            </div>
          </div></div>
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
      <FloatingTools locale={locale} />
    </footer>
  );
}
