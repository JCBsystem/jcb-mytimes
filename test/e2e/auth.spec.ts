import { test, expect } from "@playwright/test";

test.describe("Auth Flow", () => {
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = "TestPass123!";

  test("sign up, create project, and reach app shell", async ({ page }) => {
    // Navigate to app -- should redirect to /login
    await page.goto("/");
    await page.waitForURL("**/login");

    // Switch to Sign Up mode
    await page.click("text=Need an account? Sign up");

    // Fill in credentials
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);

    // Submit sign up
    await page.click('button[type="submit"]');

    // Should redirect to create-project page
    await page.waitForURL("**/create-project", { timeout: 10000 });
    await expect(page.locator("text=Create My Space")).toBeVisible();

    // Click Create Project
    await page.click("text=Create My Space");

    // Should redirect to app shell after project creation
    await page.waitForURL("/", { timeout: 15000 });
    await expect(page.locator("text=MyTimes")).toBeVisible();
    await expect(page.locator("text=Log Out")).toBeVisible();
    // Verify project key is displayed
    await expect(page.locator("text=Project:")).toBeVisible();
  });

  test("logout and login again", async ({ page }) => {
    // Login with existing account
    await page.goto("/login");
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button[type="submit"]');

    // Wait for app shell (already has project, skips create-project)
    await page.waitForURL("/", { timeout: 10000 });
    await expect(page.locator("text=Log Out")).toBeVisible();

    // Log out
    await page.click("text=Log Out");

    // Should be back on login page
    await page.waitForURL("**/login", { timeout: 5000 });
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test("session persists across refresh", async ({ page }) => {
    // Login
    await page.goto("/login");
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button[type="submit"]');
    await page.waitForURL("/", { timeout: 10000 });

    // Refresh the page
    await page.reload();

    // Should still be on app shell (session persisted)
    await page.waitForURL("/", { timeout: 10000 });
    await expect(page.locator("text=MyTimes")).toBeVisible();
    await expect(page.locator("text=Log Out")).toBeVisible();
  });
});
