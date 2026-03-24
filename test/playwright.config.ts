import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.BASE_URL || "http://localhost:5544";
const isExternal = baseURL !== "http://localhost:5544";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  ...(!isExternal && {
    webServer: {
      command: "pnpm --dir ../web dev",
      url: "http://localhost:5544",
      reuseExistingServer: !process.env.CI,
    },
  }),
});
