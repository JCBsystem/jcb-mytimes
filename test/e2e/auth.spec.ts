import { test, expect } from "@playwright/test";
import { createTestUser, signUp, login, logout, waitForProjectCreation, testId, tid } from "./helpers";

test.describe("Auth", () => {
  const user = createTestUser();

  test("redirects unauthenticated user to /login", async ({ page }) => {
    await page.goto("/");
    await page.waitForURL("**/login");
    await expect(testId(page, tid.btnLogin)).toBeVisible();
  });

  test("sign up with email and password", async ({ page }) => {
    await signUp(page, user.email, user.password);
    await page.waitForURL("**/create-project", { timeout: 10000 });
  });

  test("login with email and password after project exists", async ({ page }) => {
    // First sign up and create project
    await signUp(page, user.email, user.password);
    await waitForProjectCreation(page);

    // Logout
    await logout(page);

    // Login again
    await login(page, user.email, user.password);
    await expect(testId(page, tid.dashboardView)).toBeVisible({ timeout: 10000 });
  });

  test("logout returns to login page", async ({ page }) => {
    await signUp(page, user.email, user.password);
    await waitForProjectCreation(page);
    await logout(page);
    await expect(testId(page, tid.btnLogin)).toBeVisible();
  });

  test("toggle between login and signup modes", async ({ page }) => {
    await page.goto("/login");

    // Should start in login mode
    await expect(testId(page, tid.btnLogin)).toBeVisible();

    // Switch to signup
    await testId(page, tid.linkSignUp).click();
    await expect(testId(page, tid.btnSignUp)).toBeVisible();

    // Switch back to login
    await testId(page, tid.linkLogin).click();
    await expect(testId(page, tid.btnLogin)).toBeVisible();
  });
});
