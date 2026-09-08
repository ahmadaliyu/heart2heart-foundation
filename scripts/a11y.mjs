/**
 * Accessibility audit (axe-core, WCAG 2.1 A + AA).
 *
 * Automated checks catch roughly a third of real accessibility problems, so
 * this is a floor, not a certificate — keyboard and screen-reader testing on
 * the counselling flow still has to be done by a person before launch.
 *
 *   node scripts/a11y.mjs http://localhost:3100
 */
import { chromium } from "playwright";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const axePath = require.resolve("axe-core/axe.min.js");
const BASE = process.argv[2] || "http://localhost:3100";

const PAGES = [
  "/en",
  "/en/about",
  "/en/services",
  "/en/resources",
  "/en/resources/articles/school-pressure-and-what-actually-helps",
  "/en/events",
  "/en/donate",
  "/en/contact",
  "/en/emergency",
  "/en/privacy",
  "/en/safeguarding",
  "/ha",
  "/ha/emergency",
];

const PORTAL = [];

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

let total = 0;
const seen = new Map();
let ctx;
let page;
let theme = "light";

async function openContext(nextTheme) {
  theme = nextTheme;
  if (ctx) await ctx.close();
  ctx = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    colorScheme: theme,
  });
  page = await ctx.newPage();
}

async function audit(url) {
  await page.goto(BASE + url, { waitUntil: "networkidle" });
  // Contrast is theme-dependent, so assert the theme actually took effect
  // rather than trusting that it did — a silent failure here would turn the
  // dark pass into a second light pass that always agrees.
  //
  // Waited for rather than sampled: the attribute is set by an inline script
  // during parsing, and evaluating once right after navigation can land in the
  // gap before it runs. Sampling made this report a phantom failure roughly one
  // run in fifty.
  try {
    await page.waitForFunction(
      (want) => document.documentElement.getAttribute("data-theme") === want,
      theme,
      { timeout: 5000 },
    );
  } catch {
    const applied = await page.evaluate(() =>
      document.documentElement.getAttribute("data-theme"),
    );
    console.log(`\n[${theme}] ${url}\n  theme did not apply (data-theme=${applied})`);
    total += 1;
    return;
  }
  await page.addScriptTag({ path: axePath });
  const result = await page.evaluate(async () =>
    // @ts-expect-error injected global
    window.axe.run(document, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
    }),
  );

  const violations = result.violations;
  total += violations.length;
  if (violations.length) {
    console.log(`\n[${theme}] ${url}`);
    for (const v of violations) {
      console.log(`  [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length})`);
      console.log(`      ${v.nodes[0].target.join(" ")}`);
      seen.set(`${theme}/${v.id}`, (seen.get(`${theme}/${v.id}`) ?? 0) + v.nodes.length);
    }
  } else {
    console.log(`ok  [${theme}] ${url}`);
  }
}

// Both themes: the dark theme redefines every colour token, so a contrast
// failure there is invisible to a light-only audit.
for (const scheme of ["light", "dark"]) {
  await openContext(scheme);
  for (const url of PAGES) await audit(url);

  // The staff portal is switched off in src/lib/features.ts, so there is
  // nothing to sign in to. Turn the flag back on and these return.
}

await browser.close();

const count = (PAGES.length + PORTAL.length) * 2;
console.log(`\n${total} violation${total === 1 ? "" : "s"} across ${count} page renders (both themes)`);
if (seen.size) {
  console.log("\nBy rule:");
  for (const [id, count] of [...seen].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${id}: ${count} node(s)`);
  }
}
process.exit(total ? 1 : 0);
