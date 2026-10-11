import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests", fullyParallel: false,
  use: { baseURL: "http://localhost:3000", browserName: "chromium" },
  webServer: { command: "npm run build && npm run start", url: "http://localhost:3000", reuseExistingServer: true, timeout: 120000 },
});
