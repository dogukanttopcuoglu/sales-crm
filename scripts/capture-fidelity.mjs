import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

const routes = ["deals", "companies", "forecast", "activities", "contacts", "email-sequences", "strategic-aes", "mid-market", "sdr-team", "q1-forecast", "slipping-deals", "north-america", "emea-enterprise", "apac-expansion"];
const phase = process.argv[2] || "after";
const widths = process.argv.includes("--responsive") ? [1440, 1920, 2560, 768, 390] : [1440];
const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });
await mkdir("artifacts/fidelity", { recursive: true });
const report = [];
for (const route of routes) for (const width of widths) {
  const errors = [];
  const listener = error => errors.push(error.message);
  page.on("pageerror", listener);
  await page.setViewportSize({ width, height: width >= 2560 ? 1440 : width === 1920 ? 1080 : 1024 });
  await page.goto(`http://localhost:3000/${route}`);
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => Promise.all(Array.from(document.images).filter(image => image.getBoundingClientRect().width > 0).map(image => image.decode())));
  const measurements = await page.evaluate(() => {
    const rect = element => {
      const { x, y, width, height } = element.getBoundingClientRect();
      return { x, y, width, height };
    };
    const text = Array.from(document.querySelectorAll("main h2, main h3, main p, main span, header h1, header button"))
      .filter(element => element.children.length === 0 && element.textContent.trim()).map(element => ({ text: element.textContent.trim(), ...rect(element), size: getComputedStyle(element).fontSize }));
    return { viewport: [innerWidth, innerHeight], documentWidth: document.documentElement.scrollWidth,
      header: rect(document.querySelector("header")), main: rect(document.querySelector("main")),
      sections: Array.from(document.querySelectorAll("main section")).map(element => ({ label: element.getAttribute("aria-label"), ...rect(element) })),
      metrics: Array.from(document.querySelectorAll(".crm-card-metric")).map(rect), text };
  });
  await page.screenshot({ path: `artifacts/fidelity/${phase}-${route}-${width}.png` });
  report.push({ route, width, errors, ...measurements });
  page.removeListener("pageerror", listener);
}
await writeFile(`artifacts/fidelity/${phase}-measurements.json`, JSON.stringify(report, null, 2));
await browser.close();
console.log(`Captured ${report.length} pages; ${report.filter(item => item.errors.length || item.documentWidth > item.width).length} have errors or page overflow.`);
