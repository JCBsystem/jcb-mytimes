import { test, expect } from "@playwright/test";
import { createTestUser, signUp, waitForProjectCreation } from "./helpers";

test.describe("Create Project", () => {
  test("auto-creates project after sign up", async ({ page }) => {
    const user = createTestUser();
    await signUp(page, user.email, user.password);

    // Should pass through /create-project
    await page.waitForURL("**/create-project", { timeout: 10000 });

    // Auto-creation should finish and redirect to /
    await waitForProjectCreation(page);
    await expect(page).toHaveURL("/");
  });
});
