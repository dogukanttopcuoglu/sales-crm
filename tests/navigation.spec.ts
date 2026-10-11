import { test, expect } from "@playwright/test";
import { crmRoutes } from "../components/crm/routes";

for (const width of [1440, 390]) {
  test(`every sidebar destination opens at ${width}px`, async ({ page }) => {
    const failures: string[] = [];
    page.on("response", response => {
      if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`);
    });
    page.on("pageerror", error => failures.push(error.message));
    await page.setViewportSize({ width, height: 1024 });
    await page.goto("/companies");
    for (const route of crmRoutes) {
      if (width < 1024) await page.getByRole("button", { name: "Navigation" }).click();
      const navigation = page.getByRole("navigation", { name: "CRM navigation" });
      await navigation.locator(`a[href="/${route.slug}"]`).click();
      await expect(page).toHaveURL(new RegExp(`/${route.slug}$`));
      await expect(page.getByRole("heading", { name: route.title, exact: true }).first()).toBeVisible();
      if (width < 1024) await expect(page.getByRole("dialog")).not.toBeVisible();
      await page.waitForLoadState("networkidle");
    }
    expect(failures).toEqual([]);
  });
}

test("Q1 owner filter and slipping deal recovery actions", async ({ page }) => {
  await page.goto("/q1-forecast");
  await page.getByRole("combobox", { name: "Owner", exact: true }).click();
  await page.getByRole("option", { name: "Alex Santos", exact: true }).click();
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await expect(page.locator("tbody")).toContainText("$ 720,000");
  await page.goto("/slipping-deals");
  await page.getByRole("textbox", { name: "Search slipping deals" }).fill("Microsoft");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await expect(page.locator("tbody")).toContainText("Legal review");
  const task = page.getByRole("checkbox", { name: "Complete Resolve the legal blocker", exact: true });
  await task.check();
  await expect(task).toBeChecked();
  await task.uncheck();
  await expect(task).not.toBeChecked();
});
