/**
 * Vertical-whitespace audit.
 *
 * Renders each page, then walks down the document looking for horizontal bands
 * that contain no painted content. Reports every empty run taller than the
 * threshold, with the elements on either side, so dead space can be found by
 * measurement rather than by squinting at screenshots.
 */
import { chromium } from "playwright";

const base = process.argv[2] || "http://localhost:3100";
const min = Number(process.argv[3] || 190);
const pages = [
  "/en", "/en/about", "/en/services", "/en/resources", "/en/events",
  "/en/donate", "/en/contact", "/en/emergency", "/en/counselling",
];

const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
let total = 0;

for (const path of pages) {
  const p = await ctx.newPage();
  await p.goto(base + path, { waitUntil: "networkidle" });
  await p.evaluate(async () => {
    const step = window.innerHeight * 0.7;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 70));
    }
    window.scrollTo(0, 0);
  });
  await p.waitForTimeout(900);

  const gaps = await p.evaluate((min) => {
    // Only *ink* counts: rendered text runs, images and vector graphics.
    // A section background spans the empty space, so counting backgrounds
    // would hide exactly the gaps this is looking for.
    const bands = [];
    const push = (r) => {
      if (r.width < 1 || r.height < 1) return;
      bands.push([r.top + window.scrollY, r.top + window.scrollY + r.height]);
    };

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      if (!n.textContent.trim()) continue;
      const el = n.parentElement;
      if (!el) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none") continue;
      if (parseFloat(cs.opacity) < 0.05) continue;
      if (el.closest("[hidden]")) continue;
      const range = document.createRange();
      range.selectNodeContents(n);
      for (const r of range.getClientRects()) push(r);
    }
    for (const el of document.querySelectorAll("img, svg, video, canvas")) {
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none") continue;
      if (parseFloat(cs.opacity) < 0.05) continue;
      push(el.getBoundingClientRect());
    }

    bands.sort((a, b) => a[0] - b[0]);
    const out = [];
    let reach = 0;
    for (const [top, bottom] of bands) {
      if (reach > 0 && top - reach > min) {
        out.push({ from: Math.round(reach), to: Math.round(top), size: Math.round(top - reach) });
      }
      reach = Math.max(reach, bottom);
    }
    // Name what sits on each side of the gap, so the cause is findable.
    const label = (y, dir) => {
      let best = null, bestD = Infinity;
      for (const el of document.querySelectorAll("h1,h2,h3,h4,p,li,a,button,section,div")) {
        const r = el.getBoundingClientRect();
        const top = r.top + window.scrollY, bot = top + r.height;
        const d = dir === "above" ? Math.abs(bot - y) : Math.abs(top - y);
        if (d < bestD && d < 6) {
          const txt = (el.textContent || "").trim().replace(/\\s+/g, " ").slice(0, 42);
          if (txt) { best = txt; bestD = d; }
        }
      }
      return best || "?";
    };
    for (const g of out) { g.above = label(g.from, "above"); g.below = label(g.to, "below"); }
    return out;
  }, min);

  if (gaps.length) {
    total += gaps.length;
    console.log(`\n${path}`);
    for (const g of gaps) console.log(`  ${String(g.size).padStart(4)}px  y ${g.from}→${g.to}\n        after: ${g.above}\n        before: ${g.below}`);
  }
  await p.close();
}

console.log(total ? `\n${total} gaps over ${min}px` : `\nNo gaps over ${min}px`);
await b.close();
