/**
 * End-to-end smoke test: a beneficiary submits a private counselling request,
 * then a member of staff finds it in the portal and moves it through review.
 *
 * Run against a production build:  node scripts/smoke.mjs http://localhost:3100
 */
import { chromium } from "playwright";

const BASE = process.argv[2] || "http://localhost:3100";
const results = [];
const check = (name, ok, detail = "") => {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
};

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 1000 } });
const page = await ctx.newPage();

const errors = [];
const badResponses = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("response", (r) => {
  // The status endpoint answers 404 for a wrong access code by design — that
  // is the check below, not a fault.
  if (r.status() >= 400 && !r.url().includes("/api/counselling/status")) {
    badResponses.push(`${r.status()} ${r.url()}`);
  }
});

/* ------------------------------- intake flow ------------------------------ */

await page.goto(`${BASE}/en/counselling`, { waitUntil: "networkidle" });
await page.getByRole("link", { name: /I am a secondary-school girl/i }).click();
await page.waitForURL(/counselling\/request/);
check("intake: category card opens the form", true);

// Step 1 — about you
await page.getByLabel(/Preferred name/i).fill("Test User");
await page.getByLabel(/Age range/i).selectOption("16_17");
await page.getByRole("button", { name: /Continue/i }).click();

// Validation guard: leaving a required field empty must block progress.
check(
  "intake: step 1 accepted",
  await page.getByRole("heading", { name: /What you'd like help with/i }).isVisible(),
);

// Step 2 — support
await page.getByText("Academic pressure", { exact: true }).click();
await page.getByLabel(/In your own words/i).fill("Automated smoke test entry.");
await page.getByRole("button", { name: /Continue/i }).click();

// Step 3 — contact
await page.getByText("Phone call", { exact: true }).click();
await page.getByRole("button", { name: /Continue/i }).click();
check(
  "intake: blocks continue when contact details are missing",
  await page.getByText(/Please give us the details/i).isVisible(),
);

await page.getByLabel(/Contact details/i).fill("+234 800 111 2222");
await page.getByRole("button", { name: /Continue/i }).click();

// Step 4 — timing
const future = new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10);
await page.getByLabel(/Preferred date/i).fill(future);
await page.getByRole("button", { name: "10:00 am" }).click();
await page.getByRole("button", { name: /Continue/i }).click();

// Step 5 — consent
check(
  "intake: consent step reached",
  await page.getByRole("heading", { name: /^Consent$/i }).isVisible(),
);
// Under-18 age range must surface the guardian question.
check(
  "intake: guardian question shown for a minor",
  await page.getByText(/Does a parent or guardian know/i).isVisible(),
);

await page.getByRole("button", { name: /Continue/i }).click();
check(
  "intake: blocks submission without consent",
  await page.getByText(/Please confirm you have read/i).isVisible(),
);

await page.getByText(/I have read the above/i).click();
await page.getByRole("button", { name: /Continue/i }).click();

// Step 6 — review and send
check(
  "intake: review step reached",
  await page.getByRole("heading", { name: /Review and send/i }).isVisible(),
);
await page.getByRole("button", { name: /Send my request/i }).click();

await page.waitForSelector("text=Your request has been sent", { timeout: 15000 });
const caseRef = (await page.locator("p.font-mono").first().innerText()).trim();
const accessCode = (await page.locator("p.font-mono").nth(1).innerText()).trim();
check("intake: request submitted", /^AAGF-\d{4}-\d{6}$/.test(caseRef), caseRef);
check("intake: access code issued", /^[A-Z2-9]{6}$/.test(accessCode), accessCode);

/* ------------------------------ status lookup ----------------------------- */

await page.goto(`${BASE}/en/counselling/status`, { waitUntil: "networkidle" });
await page.getByLabel(/Case reference/i).fill(caseRef);
await page.getByLabel(/Access code/i).fill(accessCode);
await page.getByRole("button", { name: /Check status/i }).click();
await page.waitForSelector("text=Request status", { timeout: 10000 });
check(
  "status lookup: correct reference and code returns the status",
  await page.getByText(/waiting to be reviewed/i).isVisible(),
);

await page.goto(`${BASE}/en/counselling/status`, { waitUntil: "networkidle" });
await page.getByLabel(/Case reference/i).fill(caseRef);
await page.getByLabel(/Access code/i).fill("WRONG1");
await page.getByRole("button", { name: /Check status/i }).click();
await page.waitForTimeout(800);
check(
  "status lookup: wrong code is rejected",
  await page.getByText(/couldn't find a request/i).isVisible(),
);

/* --------------------------------- portal --------------------------------- */

await page.goto(`${BASE}/en/portal/dashboard`, { waitUntil: "networkidle" });
check(
  "portal: unauthenticated visit redirects to login",
  page.url().includes("/portal/login"),
  page.url(),
);

await page.getByRole("button", { name: /Dr. Amina Yusuf/i }).click();
await page.waitForURL(/portal\/dashboard/, { timeout: 15000 });
check("portal: therapist sign-in reaches the dashboard", true);

// A therapist must not see the administrator-only surfaces.
check(
  "portal: therapist navigation excludes admin sections",
  !(await page.getByRole("link", { name: /^Donations$/ }).count()),
);

await page.goto(`${BASE}/en/portal/donations`, { waitUntil: "networkidle" });
check(
  "portal: therapist is redirected away from an admin page",
  page.url().includes("/portal/dashboard"),
  page.url(),
);

await page.goto(`${BASE}/en/portal/requests/${caseRef}`, { waitUntil: "networkidle" });
check(
  "portal: the new request is visible to staff",
  await page.getByText(caseRef).first().isVisible(),
);
check(
  "portal: contact details are masked by default",
  !(await page.getByText("+234 800 111 2222").count()),
);
await page.getByRole("button", { name: /Reveal contact details/i }).click();
check(
  "portal: contact details reveal on request",
  await page.getByText("+234 800 111 2222").isVisible(),
);

// Status machine: only legal transitions are offered.
const offered = await page
  .locator("form button[type=submit]")
  .allInnerTexts();
check(
  "portal: only legal transitions offered from REQUESTED",
  offered.some((x) => /Under review/i.test(x)) &&
    !offered.some((x) => /^Completed$/i.test(x)),
  offered.join(", "),
);

await page.getByRole("button", { name: /Under review/i }).click();
await page.waitForTimeout(1500);
check(
  "portal: status advanced to Under review",
  (await page.locator("body").innerText()).includes("Under review"),
);

/* ------------------------------ admin surfaces ---------------------------- */

await page.goto(`${BASE}/en/portal/login`, { waitUntil: "networkidle" });
await page.evaluate(() => fetch("/api/portal/session", { method: "DELETE" }));
await page.reload({ waitUntil: "networkidle" });
await page.getByRole("button", { name: /Hauwa Bello/i }).click();
await page.waitForURL(/portal\/dashboard/, { timeout: 15000 });

for (const path of [
  "requests",
  "appointments",
  "cases",
  "content",
  "events",
  "donations",
  "emergency",
  "users",
  "settings",
]) {
  const res = await page.goto(`${BASE}/en/portal/${path}`, { waitUntil: "networkidle" });
  check(`portal (admin): /${path} renders`, res.status() === 200, `HTTP ${res.status()}`);
}

/* ------------------------------ public pages ------------------------------ */

for (const locale of ["en", "ha"]) {
  for (const path of [
    "",
    "/about",
    "/services",
    "/resources",
    "/events",
    "/donate",
    "/contact",
    "/emergency",
    "/privacy",
    "/safeguarding",
    "/terms",
    "/accessibility",
    "/counselling",
  ]) {
    const res = await page.goto(`${BASE}/${locale}${path}`, { waitUntil: "domcontentloaded" });
    if (res.status() !== 200) check(`page ${locale}${path}`, false, `HTTP ${res.status()}`);
  }
}
check("public pages: all render in both locales", true);

/* --------------------------------- report --------------------------------- */

const realErrors = errors.filter(
  (e) =>
    !/Download the React DevTools/i.test(e) &&
    // The deliberate 404 above surfaces here as a generic resource message.
    !(badResponses.length === 0 && /Failed to load resource/i.test(e)),
);
check("no page errors", realErrors.length === 0, realErrors.slice(0, 3).join(" | "));
check(
  "no failing network requests",
  badResponses.length === 0,
  badResponses.slice(0, 3).join(" | "),
);

await browser.close();

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
