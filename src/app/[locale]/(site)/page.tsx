/* eslint-disable @next/next/no-img-element -- Local compressed images have explicit dimensions and native lazy loading. */
import Link from "next/link";
import { ArrowRight, HeartHandshake } from "lucide-react";
import { getTranslations } from "@/lib/i18n/server";
import { localePath } from "@/lib/i18n/config";
import { FeaturedSlider } from "@/components/home/featured-slider";
import { ProgramPanel } from "@/components/home/program-panel";
import { CountUp } from "@/components/motion";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, t } = await getTranslations(params);
  const path = (value: string) => localePath(locale, value);
  const programs = [
    {
      title: t("services.youthTitle"),
      body: t("services.youthBody"),
      href: path("/services#audiences"),
      image: "/images/community.jpg",
    },
    {
      title: t("services.couplesTitle"),
      body: t("services.couplesBody"),
      href: path("/services#audiences"),
      image: "/images/conversation.jpg",
    },
    {
      title: t("home.steps.three.title"),
      body: t("home.eventsBody"),
      href: path("/events"),
      image: "/images/together.jpg",
    },
  ];
  return (
    <>
      <section className="bpa-hero">
        <img
          src="/images/women-community.jpg"
          alt=""
          width={1920}
          height={2880}
          fetchPriority="high"
        />
        <div className="hero-shade" />
        <div className="bpa-hero-content">
          <span className="hero-emblem" aria-hidden="true">
            <HeartHandshake size={30} strokeWidth={1.5} />
          </span>
          <h1>{t("home.heroTitle")}</h1>
          <div className="hero-actions">
            <Link className="bpa-button" href={path("/about")}>
              {t("home.heroSecondary")}
              <ArrowRight size={17} />
            </Link>
            <Link className="bpa-button" href={path("/services")}>
              {t("home.heroPrimary")}
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
      <FeaturedSlider
        previous={t("common.back")}
        next={t("common.next")}
        slides={[
          {
            label: t("nav.resources"),
            title: t("home.resourcesTitle"),
            body: t("home.resourcesBody"),
            href: path("/resources"),
            action: t("common.learnMore"),
          },
          {
            label: t("nav.events"),
            title: t("home.eventsTitle"),
            body: t("home.eventsBody"),
            href: path("/events"),
            action: t("common.viewAll"),
          },
          {
            label: t("footer.privacy"),
            title: t("home.privacyTitle"),
            body: t.list("home.privacyPoints")[1],
            href: path("/privacy"),
            action: t("home.privacyLink"),
          },
        ]}
      />
      <section className="bpa-programs bpa-container">
        <div className="bpa-section-heading">
          <p>{t("home.servicesTitle")}</p>
          <h2>
            {t("home.whoTitle")}
            <br />
            <span>{t("home.heroAssurance")}</span>
          </h2>
        </div>
        <div className="program-stack">
          {programs.map((program, index) => (
            <ProgramPanel
              key={program.title}
              {...program}
              index={index}
              action={t("common.learnMore")}
            />
          ))}
        </div>
      </section>
      <section className="bpa-reach">
        <div className="bpa-container reach-grid">
          <div>
            <p className="bpa-kicker">{t("about.missionTitle")}</p>
            <h2>{t("home.ctaTitle")}</h2>
            <Link
              className="bpa-button bpa-button-outline"
              href={path("/about")}
            >
              {t("home.heroSecondary")}
              <ArrowRight size={17} />
            </Link>
          </div>
          <div className="reach-stat">
            <CountUp to={480} suffix="+" />
            <p>{t("home.statSessions")}</p>
          </div>
          <div className="reach-stat">
            <CountUp to={26} />
            <p>{t("home.statSchools")}</p>
          </div>
        </div>
      </section>
      <section className="bpa-commitments bpa-container" id="how">
        <div className="bpa-section-heading">
          <p>{t("home.howTitle")}</p>
          <h2>{t("home.privacyTitle")}</h2>
        </div>
        <div className="commitment-grid">
          {(["one", "two", "three", "four"] as const).map((key, index) => (
            <div key={key}>
              <span className="commitment-number">0{index + 1}</span>
              <h3>{t("home.steps." + key + ".title")}</h3>
              <p>{t("home.steps." + key + ".body")}</p>
            </div>
          ))}
        </div>
        <Link className="bpa-button bpa-button-blue" href={path("/privacy")}>
          {t("home.privacyLink")}
          <ArrowRight size={17} />
        </Link>
      </section>
      <section className="bpa-cta">
        <div className="cta-photo">
          <img
            src="/images/together.jpg"
            alt=""
            loading="lazy"
            width={1200}
            height={800}
          />
        </div>
        <div className="cta-copy">
          <h2>{t("home.donateTitle")}</h2>
          <p>{t("home.donateBody")}</p>
          <div className="hero-actions">
            <Link className="bpa-button bpa-button-gold" href={path("/donate")}>
              {t("home.donateCta")}
              <ArrowRight size={17} />
            </Link>
            <Link
              className="bpa-button bpa-button-blue"
              href={path("/contact")}
            >
              {t("nav.contact")}
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
