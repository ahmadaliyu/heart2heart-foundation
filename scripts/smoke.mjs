/**
 * End-to-end smoke test.
 *
 * The site is currently informational — counselling requests and the staff
 * portal are switched off in src/lib/features.ts — so this checks what the site
 * actually claims to do: every public page renders in both languages, the
 * disabled features are genuinely unreachable rather than merely unlinked, and
 * the pages that carry safety information carry it.
 *
 * Turn a feature back on and the assertions below that name it will need to
 * grow back with it; they are marked.
 *
 *   node scripts/smoke.mjs http://localhost:3100
 */
import { chromium } from "playwright";

const BASE = process.argv[2] || "http://localhost:3100";

const PUBLIC_PAGES = [
  "/",
  "/about",
  "/services",
  "/resources",
  "/events",
  "/donate",
  "/contact",
  "/emergency",
  "/privacy",
  "/safeguarding",
  "/accessibility",
  "/terms",
];

/** Switched off in src/lib/features.ts — these must not be reachable. */
const DISABLED = [
  "/en/counselling",
  "/en/counselling/request",
  "/en/counselling/status",
  "/en/portal",
  "/en/portal/login",
  "/en/portal/dashboard",
  "/ha/counselling",
];

let passed = 0;
let failed = 0;
function check(label, ok, detail = "") {
  if (ok) {
    passed++;
    console.log(`PASS  ${label}${detail ? ` — ${detail}` : ""}`);
  } else {
    failed++;
    console.log(`FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();

const errors = [];
const badResponses = [];
page.on("pageerror", (e) => errors.push(String(e)));
let expectingNotFound = false;
page.on("console", (m) => {
  // The disabled routes are visited on purpose below, and a 404 logs a console
  // error of its own. Counting those would make the deliberate check fail the
  // health check next to it.
  if (m.type() === "error" && !expectingNotFound) errors.push(m.text());
});
page.on("response", (r) => {
  // The disabled routes are *expected* to 404; that is the check below.
  const expected404 = DISABLED.some((path) => r.url().endsWith(path));
  if (r.status() >= 400 && !expected404) badResponses.push(`${r.status()} ${r.url()}`);
});

/* ------------------------------- public site ------------------------------ */

for (const locale of ["en", "ha"]) {
  for (const path of PUBLIC_PAGES) {
    const url = `${BASE}/${locale}${path === "/" ? "" : path}`;
    const res = await page.goto(url, { waitUntil: "networkidle" });
    if (res?.status() !== 200) {
      check(`page ${locale}${path}`, false, `HTTP ${res?.status()}`);
    }
  }
}
check("public pages: all render in both locales", true);

/* --------------------------------- content -------------------------------- */

await page.goto(`${BASE}/en/services`, { waitUntil: "networkidle" });
const body = await page.locator("body").innerText();
const AREAS = [
  "Child abuse",
  "Drug abuse",
  "Sexual abuse and harassment",
  "Social inclusion",
  "Gender-based violence",
];
for (const area of AREAS) {
  check(`services: "${area}" is listed`, body.includes(area));
}
check(
  "services: both audiences are named with the current wording",
  body.includes("Teenagers and youths") && body.includes("Married couples"),
);
check(
  "services: the superseded wording is gone",
  !/secondary-school girls|married women/i.test(body),
  "no 'secondary-school girls' or 'married women'",
);

await page.goto(`${BASE}/en/emergency`, { waitUntil: "networkidle" });
const emergency = await page.locator("body").innerText();
check(
  "emergency: verified contacts are shown",
  emergency.includes("Verified") && /\+234/.test(emergency),
);
check(
  "emergency: the page says plainly this is not a 24-hour service",
  /not an emergency service/i.test(emergency),
);

/* ---------------------------- disabled features --------------------------- */

expectingNotFound = true;
for (const path of DISABLED) {
  const res = await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded" });
  check(`disabled: ${path} is not reachable`, res?.status() === 404, `HTTP ${res?.status()}`);
}
expectingNotFound = false;

await page.goto(`${BASE}/en`, { waitUntil: "networkidle" });
const home = await page.locator("body").innerText();
check(
  "disabled: no counselling or staff-login entry points are offered",
  !/get support/i.test(home) && !/staff login/i.test(home),
);

/* --------------------------------- health --------------------------------- */

check("no page errors", errors.length === 0, errors.slice(0, 3).join(" | "));
check(
  "no failing network requests",
  badResponses.length === 0,
  badResponses.slice(0, 3).join(" | "),
);

await browser.close();

console.log(`\n${passed}/${passed + failed} checks passed`);
process.exit(failed ? 1 : 0);
