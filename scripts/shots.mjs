import { chromium } from "playwright";

const jobs = JSON.parse(process.argv[2]);
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const ctx = await b.newContext({
  viewport: { width: 1280, height: 900 },
  deviceScaleFactor: 1.5,
});

for (const j of jobs) {
  const p = await ctx.newPage();
  if (j.w) await p.setViewportSize({ width: j.w, height: j.h || 900 });
  await p.goto(j.url, { waitUntil: "networkidle" });
  if (j.login) {
    await p.getByRole("button", { name: new RegExp(j.login, "i") }).click();
    await p.waitForURL(/dashboard/, { timeout: 15000 });
    if (j.then) await p.goto(j.then, { waitUntil: "networkidle" });
  }
  for (const sel of j.click || []) {
    await p.click(sel);
    await p.waitForTimeout(400);
  }
  if (j.scroll) {
    await p.evaluate((y) => window.scrollTo(0, y), j.scroll);
    await p.waitForTimeout(900);
  }
  await p.waitForTimeout(900);
  await p.screenshot({ path: j.out, fullPage: !!j.full });
  await p.close();
}

await b.close();
console.log("done");
