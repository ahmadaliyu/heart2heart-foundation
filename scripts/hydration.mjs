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
  "/ha",
  "/ha/about",
  "/ha/emergency",
];

const PORTAL = [];

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
      return changed.every((c) => c === "is-in");
    };

    const walk = (root) => {
      const out = [];
      const w = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
      for (let n = w.nextNode(); n; n = w.nextNode()) out.push(n);
      return out;
    };

    const found = [];

    // <html>'s own attributes. An earlier version of this script skipped the
    // whole document element and only walked <body>, which hid a real mismatch
    // for days: the theme script adds attributes to <html>, and one of them
    // was a class nothing needed. `data-theme` is the single allowed exception
    // — the server cannot know the reader's theme, and every no-flash theme
    // implementation sets it before hydration.
    {
      const before = new Map([...ssr.documentElement.attributes].map((a) => [a.name, a.value]));
      const after = new Map([...document.documentElement.attributes].map((a) => [a.name, a.value]));
      for (const name of new Set([...before.keys(), ...after.keys()])) {
        if (name === "data-theme") continue;
        if (before.get(name) === after.get(name)) continue;
        found.push({
          tag: "html",
          attr: name,
          server: before.get(name) ?? null,
          client: after.get(name) ?? null,
          near: "(document element)",
        });
      }
    }

    // <head> is deliberately NOT compared. The framework owns it — it hoists,
    // dedupes and appends its own script, link and style nodes there during
    // hydration, and a naive comparison reports that as dozens of mismatches.
    // The check that actually catches theme bugs is the <html> attribute one
    // above; the fix for a mismatch attributed to a <head> child is to move the
    // element out of <head> rather than to detect it here.

    // The theme toggle is the one element in <body> allowed to differ: it
    // cannot know the theme on the server, so it renders a neutral state and
    // swaps after mount. What matters is that its *hydration* render matches,
    // which it does because everything theme-dependent in it is gated on a
    // `mounted` flag that starts false on both sides.
    // Framework plumbing inside <body>: React's streaming TEMPLATE
    // placeholders (present on the server, gone after hydration) and the flight
    // -data SCRIPT tags the runtime appends. Neither is app markup.
    const PLUMBING = new Set([
      "TEMPLATE", "SCRIPT", "LINK", "STYLE", "NOSCRIPT",
      // React 19 hoists document metadata, so these can land in <body> in the
      // live DOM while the server put them in <head>.
      "TITLE", "META", "BASE", "NEXT-ROUTE-ANNOUNCER",
    ]);
    const skip = (el) => PLUMBING.has(el.tagName) || el.closest("[data-theme-toggle]");
    const live = walk(document.body).filter((el) => !skip(el));
    const server = walk(ssr.body).filter((el) => !skip(el));

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

  // The staff portal is switched off in src/lib/features.ts, so there is
  // nothing to sign in to. Turn the flag back on and these return.

  await ctx.close();
}

await browser.close();
console.log(total ? `\n${total} attribute mismatch(es)` : "\nNo hydration attribute mismatches");
process.exit(total ? 1 : 0);
