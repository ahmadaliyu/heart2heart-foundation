/**
 * PHOTOGRAPHY GOES HERE.
 *
 * Every image slot on the site resolves through this one file, so swapping the
 * placeholder artwork for real photographs is a list of URLs and nothing else —
 * no component changes, no rebuilding of card layouts.
 *
 * Two things each value can be:
 *
 *   "/covers/area-drug-abuse.svg"                       a file in /public
 *   "https://images.unsplash.com/photo-1234?w=1600&q=80" a remote URL
 *
 * Remote hosts must be allowed in `next.config.ts` under `images.remotePatterns`
 * — `images.unsplash.com` already is. A plain <img> is used rather than
 * next/image, so any reachable URL works as-is.
 *
 * ---------------------------------------------------------------------------
 * A NOTE ON SUBJECT MATTER, WHICH MATTERS MORE THAN THE FORMAT
 *
 * These areas are child abuse, drug abuse, sexual abuse, exclusion and
 * gender-based violence. Stock photography for these subjects is overwhelmingly
 * pictures of distressed, often identifiable women and children — a person
 * with their head in their hands, a child behind a window. Someone arriving
 * here because one of these things is happening to them should not be met with
 * a staged photograph of it.
 *
 * What works instead: hands, groups in conversation, classrooms, community
 * gatherings, open landscapes, light. Non-identifying, and hopeful rather than
 * illustrative of the harm.
 * ---------------------------------------------------------------------------
 */

/** Cover art for each of the five areas of work, keyed by position. */
export const areaImages = [
  "/covers/area-child-abuse.svg",
  "/covers/area-drug-abuse.svg",
  "/covers/area-sexual-abuse.svg",
  "/covers/area-social-inclusion.svg",
  "/covers/area-gender-based-violence.svg",
] as const;

/** Cover art for the two groups the Foundation works with. */
export const audienceImages = [
  "/covers/audience-teenagers.svg",
  "/covers/audience-married-couples.svg",
] as const;

/**
 * True while the placeholders are still in place. Screens use it to decide
 * whether an image is worth giving prominence to — generated artwork reads as
 * texture and works as a band; a photograph earns a larger, more confident
 * treatment. Delete this and the branches that read it once real photography
 * is in.
 */
export const usingPlaceholderArt = [...areaImages, ...audienceImages].every((src) =>
  src.startsWith("/covers/"),
);
