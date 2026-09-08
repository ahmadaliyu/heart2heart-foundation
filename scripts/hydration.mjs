/**
 * Hydration attribute diff.
 *
 * Waiting for React to log a warning only finds a mismatch if you happen to
 * load the page in the state that triggers it. This compares the server HTML
 * against the hydrated DOM element by element instead, so a divergence shows up
 * whether or not React noticed — which is what the "attributes of the server
 * rendered HTML didn't match the client properties" error is reporting.
 *
 *   node scripts/hydration.mjs http://localhost:3100
 */
import { chromium } from "playwright";

const BASE = process.argv[2] || "http://localhost:3100";

const PAGES = [
  "/en",
  "/en/about",
  "/en/services",
  "/en/resources",
  "/en/events",
  "/en/donate",
  "/en/contact",
  "/en/emergency",
  "/en/privacy",
  "/en/safeguarding",
  "/en/accessibility",
  "/en/counselling",
  "/en/counselling/request?category=SCHOOL_GIRL",
  "/en/counselling/status",
  "/en/portal/login",
  "/ha",
  "/ha/about",
  "/ha/counselling",
  "/ha/emergency",
];

const PORTAL = [
  "/en/portal/dashboard",
  "/en/portal/requests",
  "/en/portal/appointments",
  "/en/portal/cases",
  "/en/portal/donations",
  "/en/portal/users",
  "/en/portal/settings",
];

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
let total = 0;

async function scan(page, url, theme) {
  await page.goto(BASE + url, { waitUntil: "networkidle" });
  await page.waitForTimeout(1400);

  const diffs = await page.evaluate(async (href) => {
    const html = await (await fetch(href, { cache: "no-store" })).text();
    const ssr = new DOMParser().parseFromString(html, "text/html");

    // Attributes something is *supposed* to change after mount. Everything
    // else is a genuine server/client divergence.
    const EXPECTED_ATTR = new Set(["data-theme", "style"]);
    const expectedValue = (name, before, after) => {
      if (name !== "class") return false;
      const only = (x, y) => x.split(/\s+/).filter((c) => c && !y.split(/\s+/).includes(c));
      const changed = [...only(after, before), ...only(before, after)];
      return changed.every((c) => c === "is-in" || c === "theme-ready");
    };

    const walk = (root) => {
      const out = [];
      const w = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
      for (let n = w.nextNode(); n; n = w.nextNode()) out.push(n);
      return out;
    };

    // Scoped to <body>. The framework injects its own <link>/<style>/<script>
    // into <head> during hydration, which is expected and not a mismatch.
    //
    // The theme toggle is the one element allowed to differ: it cannot know the
    // reader's theme on the server, so it renders a neutral state and swaps
    // after mount. That swap is deliberate — what matters is that its
    // *hydration* render matches, which it does because everything
    // theme-dependent in it is gated on a `mounted` flag that starts false on
    // both sides.
    // Framework plumbing: the runtime moves and appends its own script and
    // style nodes during hydration. None of it is app UI, and none of it can
    // be the source of an attribute mismatch on rendered markup.
    const PLUMBING = new Set([
      "SCRIPT", "LINK", "STYLE", "TEMPLATE", "NOSCRIPT", "NEXT-ROUTE-ANNOUNCER",
      // React 19 hoists document metadata, so <title>/<meta> can sit in <body>
      // in the live DOM and in <head> in the server HTML. Not app markup.
      "TITLE", "META", "BASE",
    ]);
    const skip = (el) => PLUMBING.has(el.tagName) || el.closest("[data-theme-toggle]");
    const live = walk(document.body).filter((el) => !skip(el));
    const server = walk(ssr.body).filter((el) => !skip(el));
    const found = [];

    for (let i = 0; i < Math.min(live.length, server.length); i++) {
      const L = live[i];
      const S = server[i];
      if (L.tagName !== S.tagName) {
        found.push({ kind: "structure", at: i, client: L.tagName, server: S.tagName });
        break; // past here the two trees no longer line up
      }
      const names = new Set([
        ...[...L.attributes].map((a) => a.name),
        ...[...S.attributes].map((a) => a.name),
      ]);
      for (const name of names) {
        if (EXPECTED_ATTR.has(name)) continue;
        const before = S.getAttribute(name);
        const after = L.getAttribute(name);
        if (before === after) continue;
        if (expectedValue(name, before ?? "", after ?? "")) continue;
        found.push({
          tag: L.tagName.toLowerCase(),
          attr: name,
          server: before,
          client: after,
          near: (L.textContent || "").trim().replace(/\s+/g, " ").slice(0, 48),
        });
      }
    }
    return found;
  }, BASE + url);

  if (diffs.length) {
    total += diffs.length;
    console.log(`\n[${theme}] ${url}`);
    for (const d of diffs.slice(0, 8)) {
      if (d.kind === "structure") {
        console.log(
          `  structure diverges at element ${d.at}: server <${d.server}> vs client <${d.client}>`,
        );
      } else {
        console.log(
          `  <${d.tag}> ${d.attr}\n      server: ${JSON.stringify(d.server)}\n      client: ${JSON.stringify(d.client)}\n      near:   ${d.near}`,
        );
      }
    }
    if (diffs.length > 8) console.log(`  …and ${diffs.length - 8} more`);
  }
}

for (const theme of ["light", "dark"]) {
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    colorScheme: theme,
  });
  const page = await ctx.newPage();

  for (const url of PAGES) await scan(page, url, theme);

  await page.goto(`${BASE}/en/portal/login`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Hauwa Bello/i }).click({ timeout: 60000 });
  await page.waitForURL(/dashboard/, { timeout: 30000 });
  for (const url of PORTAL) await scan(page, url, theme);

  await ctx.close();
}

await browser.close();
console.log(total ? `\n${total} attribute mismatch(es)` : "\nNo hydration attribute mismatches");
process.exit(total ? 1 : 0);
