import { test, expect } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

const phase = process.env.CRM_CAPTURE_PHASE === "before" ? "before" : "after";
for (const [width, height] of [[1440, 1024], [1680, 1050], [1920, 1080], [2560, 1440], [390, 844]]) {
  test(`EMEA desktop balance at ${width} × ${height}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => {
      if (message.type() !== "error") return;
      errors.push(message.text());
    });
    await page.setViewportSize({ width, height });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => Promise.all(Array.from(document.images)
      .filter(image => image.getBoundingClientRect().width > 0 && image.getBoundingClientRect().top < innerHeight)
      .map(image => image.decode())));
    const measurements = await page.evaluate(() => {
      const rect = (selector: string) => {
        const r = document.querySelector(selector)!.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height };
      };
      const input = document.querySelector("input")!;
      return {
        viewport: { width: innerWidth, height: innerHeight },
        dpr: devicePixelRatio,
        visualViewportScale: visualViewport?.scale,
        documentWidth: document.documentElement.scrollWidth,
        main: rect("main"), table: rect(".opportunities"),
        pipeline: rect('[aria-label="Pipeline by stage"]'),
        target: rect('[aria-label="Quarter target"]'),
        header: rect("header"), sidebar: rect("aside"),
        headingFontSize: getComputedStyle(document.querySelector("h1")!).fontSize,
        inputFontSize: getComputedStyle(input).fontSize,
        cssZoom: getComputedStyle(document.documentElement).zoom,
        transform: getComputedStyle(document.querySelector("main")!).transform,
      };
    });
    expect(measurements.viewport).toEqual({ width, height });
    expect(measurements.documentWidth).toBeLessThanOrEqual(width);
    expect(measurements.headingFontSize).toBe("20px");
    expect(measurements.transform).toBe("none");
    await expect(page.locator(".opportunities tbody tr")).toHaveCount(7);
    if (phase === "after" && width >= 1440) {
      expect(measurements.main.width).toBe(width - 288);
      expect(measurements.header.x).toBe(measurements.main.x);
      expect(measurements.header.width).toBe(measurements.main.width);
      expect(measurements.main.x).toBe(288);
      expect(measurements.target.width).toBeCloseTo(width === 1440 ? 368 : Math.min(440, Math.max(368, width * 0.2)));
      expect(measurements.table.width).toBeCloseTo(width - 330);
      expect(measurements.inputFontSize).toBe("16px");
    }
    if (width < 1024) {
      await page.getByRole("button", { name: "Navigation" }).click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(page.getByRole("dialog")).not.toBeVisible();
      expect(await page.getByRole("region", { name: "Scrollable opportunities table" })
        .evaluate(element => element.scrollWidth > element.clientWidth)).toBe(true);
    }
    expect(errors).toEqual([]);
    await mkdir("artifacts/large-screen", { recursive: true });
    await page.screenshot({ path: `artifacts/large-screen/${phase}-${width}x${height}.png`, fullPage: true });
    await writeFile(`artifacts/large-screen/${phase}-${width}x${height}.json`, JSON.stringify(measurements, null, 2));
    await writeFile(`artifacts/large-screen/${phase}-${width}x${height}-network.json`,
      JSON.stringify({ errors }, null, 2));
  });
}
