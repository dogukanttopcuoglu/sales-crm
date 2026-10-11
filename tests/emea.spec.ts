import { test, expect } from "@playwright/test";
for (const width of [1440, 768, 390]) {
  test(`EMEA layout at ${width}px`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    await page.setViewportSize({ width, height: 1024 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page.getByRole("heading", { name: "EMEA Enterprise", exact: true })).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => Promise.all(Array.from(document.images).filter(image => image.getBoundingClientRect().width > 0).map(image => image.decode())));
    await expect(page.locator(".opportunities tbody tr")).toHaveCount(7);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: `artifacts/emea-${width}.png`, fullPage: true });
    if (width < 1024) {
      await page.getByRole("button", { name: "Navigation" }).click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(page.getByRole("dialog")).not.toBeVisible();
      const scroll = page.getByRole("region", { name: "Scrollable opportunities table" });
      expect(await scroll.evaluate(e => e.scrollWidth > e.clientWidth)).toBe(true);
    }
    expect(errors).toEqual([]);
  });
}
test("search, owner, stage and close date filters", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1024 });
  await page.goto("/");
  await page.getByRole("textbox", { name: "Search opportunities" }).fill("SAP");
  await expect(page.locator(".opportunities tbody tr")).toHaveCount(1);
  await page.getByRole("textbox", { name: "Search opportunities" }).fill("unmatched");
  await expect(page.getByRole("status")).toHaveText("No opportunities match your filters.");
  await page.getByRole("button", { name: "View all deals" }).click();
  await page.getByRole("combobox", { name: "Owner", exact: true }).click();
  await page.getByRole("option", { name: "Sarah Jenkins" }).click();
  await expect(page.locator(".opportunities tbody tr")).toHaveCount(1);
  await page.getByRole("button", { name: "View all deals" }).click();
  await page.getByRole("button", { name: "Filters", exact: true }).click();
  await page.getByRole("combobox", { name: "Stage", exact: true }).click();
  await page.getByRole("option", { name: "Negotiation", exact: true }).click();
  await expect(page.locator(".opportunities tbody tr")).toHaveCount(2);
  await page.getByRole("button", { name: "Clear filters" }).click();
  await page.getByRole("combobox", { name: "Close date", exact: true }).click();
  await page.getByRole("option", { name: "This month", exact: true }).click();
  await expect(page.locator(".opportunities tbody tr")).toHaveCount(2);
});
