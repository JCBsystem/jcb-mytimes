import { test, expect } from "@playwright/test";
import { createTestUser, signUp, signUpAndCreateProject, testId, tid } from "./helpers";

test.describe("Sign Up", () => {
  test("sign up redirects to create-project", async ({ page }) => {
    const user = createTestUser();
    await signUp(page, user.email, user.password);
    await page.waitForURL("**/create-project", { timeout: 10000 });
  });

  test("sign up and auto-create project reaches dashboard", async ({ page }) => {
    const user = createTestUser();
    await signUpAndCreateProject(page, user.email, user.password);
    await expect(page).toHaveURL("/");
  });

  test("signup form shows when toggling from login", async ({ page }) => {
    await page.goto("/login");
    await expect(testId(page, tid.btnLogin)).toBeVisible();

    await testId(page, tid.linkSignUp).click();
    await expect(testId(page, tid.btnSignUp)).toBeVisible();
  });
});
