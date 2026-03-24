import { test, expect } from "@playwright/test";
import { createTestUser, signUpAndCreateProject, testId, tid } from "./helpers";

test.describe("Create Memory", () => {
  const user = createTestUser();

  test("create a text memory", async ({ page }) => {
    await signUpAndCreateProject(page, user.email, user.password);

    // Open create memory flow
    await testId(page, tid.btnNewMemory).click();

    // Fill in memory content
    await testId(page, tid.inputMemoryTitle).fill("Beach sunset in Lofoten");
    await testId(page, tid.inputMemoryNote).fill(
      "Golden hour light reflecting off the fjord, seagulls overhead."
    );

    // Save
    await testId(page, tid.btnSaveMemory).click();

    // Memory should appear in the list
    await expect(testId(page, tid.memoryItem).first()).toContainText("Beach sunset in Lofoten");
  });
});
