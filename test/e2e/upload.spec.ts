import { test, expect } from "@playwright/test";
import path from "path";
import {
  createTestUser,
  signUpAndCreateProject,
  testId,
  tid,
  openComposer,
} from "./helpers";

const FIXTURES = path.join(__dirname, "fixtures");

test.describe("Image upload", () => {
  const user = createTestUser();

  test("attaching an image shows preview and saves with memory", async ({
    page,
  }) => {
    await signUpAndCreateProject(page, user.email, user.password);
    await openComposer(page);

    // Attach the test image via the hidden file input
    const fileInput = testId(page, tid.inputImageFile);
    await fileInput.setInputFiles(path.join(FIXTURES, "test-image.png"));

    // Image preview should appear
    await expect(testId(page, tid.imagePreview)).toBeVisible();

    // Fill text and send
    await testId(page, tid.inputMemoryText).fill("Memory with image");
    await testId(page, tid.btnSendMemory).click();

    // Memory should appear in the feed
    await expect(testId(page, tid.memoryItem).first()).toContainText(
      "Memory with image",
      { timeout: 10000 }
    );
  });
});

test.skip("Audio upload", () => {
  const user = createTestUser();

  test("recording audio shows indicator and saves with memory", async ({
    page,
    context,
  }) => {
    // Grant microphone permission so MediaRecorder works
    await context.grantPermissions(["microphone"]);

    await signUpAndCreateProject(page, user.email, user.password);
    await openComposer(page);

    // Start recording
    await testId(page, tid.btnRecordAudio).click();

    // Wait a moment for some audio data
    await page.waitForTimeout(500);

    // Stop recording
    await testId(page, tid.btnRecordAudio).click();

    // Audio indicator should appear
    await expect(testId(page, tid.audioIndicator)).toBeVisible({
      timeout: 5000,
    });

    // Fill text and send
    await testId(page, tid.inputMemoryText).fill("Memory with voice");
    await testId(page, tid.btnSendMemory).click();

    // Memory should appear in the feed
    await expect(testId(page, tid.memoryItem).first()).toContainText(
      "Memory with voice",
      { timeout: 10000 }
    );
  });
});
