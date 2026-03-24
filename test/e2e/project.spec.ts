import { test, expect } from "@playwright/test";
import { createTestUser, signUp, waitForProjectCreation } from "./helpers";

test.describe("Create Project", () => {
  test("auto-creates project after sign up and reaches dashboard", async ({ page }) => {
    const user = createTestUser();
    await signUp(page, user.email, user.password);
    await waitForProjectCreation(page);
    await expect(page).toHaveURL("/");
  });
});
