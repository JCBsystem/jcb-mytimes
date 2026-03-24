import { test, expect } from "@playwright/test";
import { createTestUser, signUpAndCreateProject, testId, tid } from "./helpers";

test.describe("Create Memory", () => {
  test("create a text memory", async ({ page }) => {
    const user = createTestUser();
    await signUpAndCreateProject(page, user.email, user.password);

    // Type a memory
    await testId(page, tid.inputMemoryText).fill("Beach sunset in Lofoten");

    // Send button appears after typing
    await testId(page, tid.btnSendMemory).click();

    // Memory should appear in the timeline
    await expect(testId(page, tid.memoryItem).first()).toContainText("Beach sunset in Lofoten");
  });
});
