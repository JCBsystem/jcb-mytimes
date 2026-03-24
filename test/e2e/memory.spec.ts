import { test, expect } from "@playwright/test";
import {
  createTestUser,
  signUpAndCreateProject,
  testId,
  tid,
  createMemory,
  openComposer,
} from "./helpers";

test.describe("Memory CRUD", () => {
  test("create a text-only memory and see it in the timeline", async ({
    page,
  }) => {
    const user = createTestUser();
    await signUpAndCreateProject(page, user.email, user.password);

    // Open composer via FAB
    await openComposer(page);
    await testId(page, tid.inputMemoryText).fill("Beach sunset in Lofoten");
    await testId(page, tid.btnSendMemory).click();

    // Memory appears in timeline
    await expect(testId(page, tid.memoryItem).first()).toContainText(
      "Beach sunset in Lofoten",
      { timeout: 10000 },
    );
  });

  test("create a memory with mood, tags, and people", async ({ page }) => {
    const user = createTestUser();
    await signUpAndCreateProject(page, user.email, user.password);

    // Open composer
    await openComposer(page);

    // Select mood 4 (😄)
    await testId(page, "mood-4").click();

    // Add a tag
    await testId(page, tid.inputTag).fill("nature");
    await testId(page, tid.inputTag).press("Enter");

    // Add a person
    await testId(page, tid.inputPerson).fill("Emma");
    await testId(page, tid.inputPerson).press("Enter");

    // Type memory text and send
    await testId(page, tid.inputMemoryText).fill(
      "Sunset at the lake, peaceful evening",
    );
    await testId(page, tid.btnSendMemory).click();

    // Memory appears with metadata
    const memory = testId(page, tid.memoryItem).first();
    await expect(memory).toContainText("Sunset at the lake", {
      timeout: 10000,
    });
    await expect(memory).toContainText("nature");
    await expect(memory).toContainText("Emma");
  });

  test("mood picker selects and deselects", async ({ page }) => {
    const user = createTestUser();
    await signUpAndCreateProject(page, user.email, user.password);

    await openComposer(page);

    // Select mood 3
    const mood3 = testId(page, "mood-3");
    await mood3.click();
    await expect(mood3).toHaveClass(/scale-125/);

    // Click again to deselect
    await mood3.click();
    await expect(mood3).not.toHaveClass(/scale-125/);
  });
});

test.describe("Memory Detail View", () => {
  test("click a memory to expand it in-place", async ({ page }) => {
    const user = createTestUser();
    await signUpAndCreateProject(page, user.email, user.password);

    await createMemory(page, "A detailed memory for expand test");

    // Click the memory to expand
    await testId(page, tid.memoryItem).first().click();

    // Detail view should be visible with full text and delete button
    await expect(testId(page, tid.memoryDetail)).toBeVisible();
    await expect(testId(page, tid.memoryDetail)).toContainText(
      "A detailed memory for expand test",
    );
    await expect(testId(page, tid.btnDeleteMemory)).toBeVisible();

    // Click again to collapse
    await testId(page, tid.memoryDetail).click();
    await expect(testId(page, tid.memoryDetail)).not.toBeVisible();
    await expect(testId(page, tid.memoryItem).first()).toBeVisible();
  });
});

test.describe("Delete Memory", () => {
  test("delete a memory from expanded view with confirmation", async ({
    page,
  }) => {
    const user = createTestUser();
    await signUpAndCreateProject(page, user.email, user.password);

    await createMemory(page, "Memory to be deleted");

    // Expand the memory
    await testId(page, tid.memoryItem).first().click();
    await expect(testId(page, tid.memoryDetail)).toBeVisible();

    // Click trash icon
    await testId(page, tid.btnDeleteMemory).click();

    // Confirm dialog should appear
    await expect(testId(page, tid.confirmDialog)).toBeVisible();
    await expect(testId(page, tid.confirmDialog)).toContainText(
      "Delete memory?",
    );

    // Confirm deletion
    await testId(page, tid.btnConfirmDelete).click();

    // Memory should disappear from timeline
    await expect(page.getByText("Memory to be deleted")).not.toBeVisible({
      timeout: 10000,
    });
  });

  test("cancel delete returns to expanded view", async ({ page }) => {
    const user = createTestUser();
    await signUpAndCreateProject(page, user.email, user.password);

    await createMemory(page, "Memory to keep");

    // Expand and click delete
    await testId(page, tid.memoryItem).first().click();
    await testId(page, tid.btnDeleteMemory).click();
    await expect(testId(page, tid.confirmDialog)).toBeVisible();

    // Cancel
    await testId(page, tid.btnCancelDelete).click();
    await expect(testId(page, tid.confirmDialog)).not.toBeVisible();

    // Memory still present
    await expect(testId(page, tid.memoryDetail)).toBeVisible();
    await expect(testId(page, tid.memoryDetail)).toContainText(
      "Memory to keep",
    );
  });
});
