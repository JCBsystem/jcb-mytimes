import { type Page, expect } from "@playwright/test";
import { nanoid } from "nanoid";

// --- Test IDs ---
export const tid = {
  // Navigation
  linkSignUp: "link-signup",
  linkLogin: "link-login",

  // Auth forms
  inputEmail: "input-email",
  inputPassword: "input-password",
  btnSignUp: "btn-signup",
  btnLogin: "btn-login",

  // Project
  btnCreateProject: "btn-create-project",
  createProjectView: "view-create-project",

  // Dashboard / Home
  dashboardView: "view-dashboard",
  btnLogout: "btn-logout",

  // Memory
  inputMemoryText: "input-memory-text",
  btnSendMemory: "btn-send-memory",
  memoryItem: "memory-item",

  // Composer (FAB + modal)
  btnNewMemory: "btn-new-memory",
  moodPicker: "mood-picker",
  inputTag: "input-tag",
  inputPerson: "input-person",

  // Uploads
  btnAddImage: "btn-add-image",
  inputImageFile: "input-image-file",
  imagePreview: "image-preview",
  btnRecordAudio: "btn-record-audio",
  audioIndicator: "audio-indicator",

  // Detail view & delete
  memoryDetail: "memory-detail",
  btnEditMemory: "btn-edit-memory",
  btnDeleteMemory: "btn-delete-memory",
  confirmDialog: "confirm-dialog",
  btnConfirmDelete: "btn-confirm-delete",
  btnCancelDelete: "btn-cancel-delete",
} as const;

// --- Helpers ---

export function testId(page: Page, id: string) {
  return page.getByTestId(id);
}

// --- Navigation ---

export async function goToHome(page: Page) {
  await page.goto("/");
}

export async function goToSignUp(page: Page) {
  await goToHome(page);
  await testId(page, tid.linkSignUp).click();
}

export async function goToLogin(page: Page) {
  await goToHome(page);
  await testId(page, tid.linkLogin).click();
}

// --- Auth ---

export async function signUp(page: Page, email: string, password: string) {
  await page.goto("/login");
  await testId(page, tid.linkSignUp).click();
  await testId(page, tid.inputEmail).fill(email);
  await testId(page, tid.inputPassword).fill(password);
  await testId(page, tid.btnSignUp).click();
}

export async function login(page: Page, email: string, password: string) {
  await page.goto("/login");
  await testId(page, tid.inputEmail).fill(email);
  await testId(page, tid.inputPassword).fill(password);
  await testId(page, tid.btnLogin).click();
}

export async function logout(page: Page) {
  await testId(page, tid.btnLogout).click();
  await page.waitForURL("**/login");
}

// --- Project ---
// CreateProject auto-fires on mount — no button click needed.
// After signup, wait for auto-project-creation to finish and land on dashboard.

export async function waitForProjectCreation(page: Page) {
  // After signup the page leaves /login → may briefly show /create-project → lands on /
  // Just wait until we're no longer on /login, then wait for /
  await page.waitForFunction(() => !window.location.pathname.includes("login"), {
    timeout: 15000,
  });
  await page.waitForURL("/", { timeout: 45000 });
}

// --- Full setup: sign up + auto-create project ---

export async function signUpAndCreateProject(
  page: Page,
  email: string,
  password: string
) {
  await signUp(page, email, password);
  await waitForProjectCreation(page);
}

// --- Memory helpers ---

export async function createMemory(page: Page, text: string) {
  await testId(page, tid.btnNewMemory).click();
  await testId(page, tid.inputMemoryText).fill(text);
  await testId(page, tid.btnSendMemory).click();
  await expect(testId(page, tid.memoryItem).first()).toContainText(text, {
    timeout: 10000,
  });
}

export async function openComposer(page: Page) {
  await testId(page, tid.btnNewMemory).click();
  await expect(testId(page, tid.inputMemoryText)).toBeVisible();
}

// --- Test user factory ---

export function createTestUser() {
  return {
    email: `test-${nanoid()}@mytimes.test`,
    password: "TestPass123!",
  };
}
