/**
 * Environment resolution check.
 *
 * `new URL(value)` throws on anything without a scheme. Because the site URL is
 * read inside `generateMetadata`, and that runs for every page during static
 * generation, one bad environment variable took the whole deployment down with
 * a message that named an unrelated page and redacted the real error:
 *
 *     Error occurred prerendering page "/en/about"
 *     [Error: An error occurred in the Server Components render...]
 *
 * These are the inputs a deployment dashboard actually produces. None of them
 * may throw.
 *
 *   node scripts/env.mjs
 */
// Imports the TypeScript source directly rather than a copy of its logic — a
// test that reimplements what it is testing proves nothing. Node strips the
// type annotations; run via `npm run test:env`, which passes the flag.
const { resolveSiteUrl } = await import("../src/lib/site-url.ts");

const CASES = [
  // [ label, env, expected origin or null to mean "must not throw" ]
  ["unset", {}, "http://localhost:3000"],
  ["empty string", { NEXT_PUBLIC_SITE_URL: "" }, "http://localhost:3000"],
  ["whitespace", { NEXT_PUBLIC_SITE_URL: "   " }, "http://localhost:3000"],
  ["no scheme", { NEXT_PUBLIC_SITE_URL: "heart2heart.ng" }, "https://heart2heart.ng"],
  ["www, no scheme", { NEXT_PUBLIC_SITE_URL: "www.heart2heart.ng" }, "https://www.heart2heart.ng"],
  ["https", { NEXT_PUBLIC_SITE_URL: "https://heart2heart.ng" }, "https://heart2heart.ng"],
  ["http", { NEXT_PUBLIC_SITE_URL: "http://localhost:3000" }, "http://localhost:3000"],
  ["trailing slash", { NEXT_PUBLIC_SITE_URL: "https://heart2heart.ng/" }, "https://heart2heart.ng"],
  ["padded", { NEXT_PUBLIC_SITE_URL: "  https://heart2heart.ng  " }, "https://heart2heart.ng"],
  ["nonsense", { NEXT_PUBLIC_SITE_URL: "::::" }, "http://localhost:3000"],
  ["vercel url", { VERCEL_URL: "h2h-abc123.vercel.app" }, "https://h2h-abc123.vercel.app"],
  [
    "vercel production url",
    { VERCEL_PROJECT_PRODUCTION_URL: "heart2heart.vercel.app" },
    "https://heart2heart.vercel.app",
  ],
  [
    "explicit wins over vercel",
    { NEXT_PUBLIC_SITE_URL: "https://heart2heart.ng", VERCEL_URL: "h2h-abc.vercel.app" },
    "https://heart2heart.ng",
  ],
];

let failed = 0;
const quiet = { warn: console.warn };
console.warn = () => {}; // the resolver warns by design; not under test here

for (const [label, env, expected] of CASES) {
  let actual;
  try {
    actual = resolveSiteUrl(env).origin;
  } catch (error) {
    quiet.warn(`FAIL  ${label.padEnd(26)} threw: ${error.message}`);
    failed++;
    continue;
  }
  if (actual !== expected) {
    quiet.warn(`FAIL  ${label.padEnd(26)} got ${actual}, expected ${expected}`);
    failed++;
  } else {
    quiet.warn(`ok    ${label.padEnd(26)} ${actual}`);
  }
}

console.warn = quiet.warn;
console.log(
  failed ? `\n${failed} of ${CASES.length} failed` : `\n${CASES.length} environment cases pass`,
);
process.exit(failed ? 1 : 0);
