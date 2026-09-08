/**
 * The site's own base URL, resolved so that a misconfigured environment
 * variable can never break the build.
 *
 * This is not defensive programming for its own sake. `new URL(value)` throws
 * on anything without a scheme — `heart2heart.ng`, or an empty string from a
 * variable that exists in the dashboard but has no value. That throw happened
 * inside `generateMetadata`, which runs for every page during static
 * generation, so the whole build died on the first page it reached with:
 *
 *     Error occurred prerendering page "/en/about"
 *     [Error: An error occurred in the Server Components render...]
 *
 * — a message that names a page having nothing to do with the cause, and omits
 * the real error because production builds redact it. A deployment must not be
 * able to fail that opaquely over a missing "https://".
 */

const FALLBACK = "http://localhost:3000";

function parse(value: string | undefined): URL | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;

  // A bare hostname is what people actually paste into a dashboard field.
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    return new URL(candidate);
  } catch {
    return null;
  }
}

export function resolveSiteUrl(env: NodeJS.ProcessEnv = process.env): URL {
  const explicit = parse(env.NEXT_PUBLIC_SITE_URL);
  if (explicit) return explicit;

  // Vercel supplies these as bare hostnames, which is exactly the shape the
  // parser above is built to accept.
  const vercel =
    parse(env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL) ??
    parse(env.VERCEL_PROJECT_PRODUCTION_URL) ??
    parse(env.NEXT_PUBLIC_VERCEL_URL) ??
    parse(env.VERCEL_URL);
  if (vercel) return vercel;

  if (env.NEXT_PUBLIC_SITE_URL !== undefined) {
    // Set but unusable: say so once, loudly, rather than failing the build with
    // an unrelated page name.
    console.warn(
      `[site-url] NEXT_PUBLIC_SITE_URL is set to ${JSON.stringify(
        env.NEXT_PUBLIC_SITE_URL,
      )}, which is not a usable URL. Falling back to ${FALLBACK}. ` +
        "Canonical URLs, Open Graph tags and the manifest will be wrong until this is fixed.",
    );
  }

  return new URL(FALLBACK);
}

export const siteUrl = resolveSiteUrl();
