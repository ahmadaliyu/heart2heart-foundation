import { features } from "@/lib/features";
import { localePath, type Locale } from "@/lib/i18n/config";

/**
 * Where a "get support" action should send someone.
 *
 * With counselling switched off there is no request journey to send them into,
 * and a dead end is worse than a redirect: someone who has read far enough to
 * press a button on this subject should land somewhere a person will answer.
 * So the actions point at Contact instead, and go back to the counselling
 * journey the moment the flag is on.
 */
export function supportHref(locale: Locale): string {
  return localePath(locale, features.counselling ? "/counselling" : "/contact");
}
