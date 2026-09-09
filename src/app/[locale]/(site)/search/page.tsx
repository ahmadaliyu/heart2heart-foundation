import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { getTranslations } from "@/lib/i18n/server";
import { localePath } from "@/lib/i18n/config";
import { publishedArticles } from "@/lib/data";
import { PageHeader } from "@/components/ui/section";

export const metadata: Metadata = { title: "Search | Heart2Heart Foundation" };
export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale, t } = await getTranslations(params);
  const { q = "" } = await searchParams;
  const pages = [
    ["/about", "about.title", "about.lede"],
    ["/services", "services.title", "services.lede"],
    ["/resources", "resources.title", "resources.lede"],
    ["/events", "events.title", "events.lede"],
    ["/contact", "nav.contact", "home.ctaBody"],
    ["/donate", "home.donateTitle", "home.donateBody"],
    ["/emergency", "emergency.title", "emergency.lede"],
    ["/privacy", "footer.privacy", "home.privacyBody"],
  ].map(([href, title, body]) => ({
    href: localePath(locale, href),
    title: t(title),
    body: t(body),
  }));
  const items = [
    ...pages,
    ...publishedArticles().map((article) => ({
      href: localePath(locale, "/resources/articles/" + article.slug),
      title: article.title,
      body: article.excerpt,
    })),
  ];
  const query = q.trim().toLocaleLowerCase(locale);
  const results = query
    ? items.filter((item) =>
        (item.title + " " + item.body)
          .toLocaleLowerCase(locale)
          .includes(query),
      )
    : [];
  return (
    <>
      <PageHeader title={t("common.search")} />
      <section className="bpa-search bpa-container">
        <form
          action={localePath(locale, "/search")}
          className="bpa-search-form"
          role="search"
        >
          <label htmlFor="site-search" className="sr-only">
            {t("common.search")}
          </label>
          <input
            type="search"
            name="q"
            id="site-search"
            defaultValue={q}
            placeholder={t("common.search")}
            maxLength={160}
          />
          <button className="bpa-button" type="submit">
            <Search size={18} />
            {t("common.search")}
          </button>
        </form>
        {query && (
          <p role="status">
            {results.length
              ? results.length + " · " + q
              : t("common.noResults")}
          </p>
        )}
        {(query ? results : pages).map((item) => (
          <Link href={item.href} key={item.href} className="search-result">
            <h2>{item.title}</h2>
            <p>{item.body}</p>
          </Link>
        ))}
      </section>
    </>
  );
}
