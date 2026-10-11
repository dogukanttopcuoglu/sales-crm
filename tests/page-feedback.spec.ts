import { test, expect } from "@playwright/test";
import { crmRoutes } from "../components/crm/routes";

for (const route of crmRoutes) for (const [width, height] of [[1680, 1050], [1920, 1080], [2560, 1271], [2560, 1440]]) {
  test(`${route.slug}: feedback layout at ${width} × ${height}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.setViewportSize({ width, height });
    await page.goto(`/${route.slug}`);
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("header nav")).toHaveCount(1);
    const layout = await page.locator("main").evaluate(element => {
      const rect = element.getBoundingClientRect();
      return { x: rect.x, width: rect.width, top: rect.top, bottom: rect.bottom,
        documentWidth: document.documentElement.scrollWidth, titleSize: getComputedStyle(document.querySelector("h1")!).fontSize };
    });
    expect(layout.x).toBe(288);
    expect(layout.width).toBe(width - 288);
    expect(layout.top).toBe(198);
    expect(layout.bottom).toBeGreaterThanOrEqual(height - 1);
    expect(layout.documentWidth).toBeLessThanOrEqual(width);
    expect(layout.titleSize).toBe("20px");
    if (route.slug !== "companies" && route.slug !== "deals") {
      const bottom = await page.locator("main section").evaluateAll(sections => Math.max(...sections.map(section => section.getBoundingClientRect().bottom)));
      expect(bottom).toBeGreaterThanOrEqual(height - 20);
    }
    for (const trigger of await page.getByRole("combobox").all()) {
      const alignment = await trigger.evaluate(element => {
        const button = element.getBoundingClientRect();
        const caret = element.querySelector('[data-slot="filter-caret"]')!.getBoundingClientRect();
        return { rightInset: button.right - caret.right, centerDifference: Math.abs(button.y + button.height / 2 - caret.y - caret.height / 2) };
      });
      expect(alignment.rightInset).toBeCloseTo(13);
      expect(alignment.centerDifference).toBeLessThan(1);
    }
    expect(errors).toEqual([]);
    await page.screenshot({ path: `artifacts/feedback/${route.slug}-${width}x${height}.png`, fullPage: true });
  });
}

test("Companies feedback preserves filter spacing and adds selectable rows", async ({ page }) => {
  await page.setViewportSize({ width: 2560, height: 1271 });
  await page.goto("/companies");
  await expect(page.locator("tbody tr")).toHaveCount(25);
  const spacing = await page.evaluate(() => {
    const toolbar = document.querySelector(".crm-toolbar")!;
    const button = toolbar.querySelector("button")!.getBoundingClientRect();
    const table = document.querySelector("thead")!.getBoundingClientRect();
    return { bottomGap: table.top - button.bottom, gap: getComputedStyle(toolbar).gap, top: toolbar.getBoundingClientRect().top };
  });
  expect(spacing.top).toBe(129);
  expect(spacing.gap).toBe("9px");
  expect(spacing.bottomGap).toBe(16);
  await page.getByRole("checkbox", { name: "Select SAP", exact: true }).click();
  await expect(page.getByRole("checkbox", { name: "Select SAP", exact: true })).toBeChecked();
  await page.getByRole("combobox", { name: "Filter", exact: true }).click();
  await page.getByRole("option", { name: "Mark Daniels", exact: true }).click();
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await expect(page.locator("tbody")).toContainText("SAP");
});
