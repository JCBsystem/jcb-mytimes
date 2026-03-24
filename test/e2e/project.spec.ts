import { test, expect } from "@playwright/test";
import { createTestUser, signUp, createProject, testId, tid } from "./helpers";

test.describe("Create Project", () => {
  const user = createTestUser();

  test("create a new project after sign up", async ({ page }) => {
    await signUp(page, user.email, user.password);
    await expect(testId(page, tid.createProjectView)).toBeVisible();

    await createProject(page);
    await expect(testId(page, tid.dashboardView)).toBeVisible();
  });
});
