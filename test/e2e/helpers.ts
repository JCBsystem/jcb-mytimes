import { type Page, expect } from "@playwright/test";

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

  // Memory
  btnNewMemory: "btn-new-memory",
  inputMemoryTitle: "input-memory-title",
  inputMemoryNote: "input-memory-note",
  btnSaveMemory: "btn-save-memory",
  memoryItem: "memory-item",
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
  await goToSignUp(page);
  await testId(page, tid.inputEmail).fill(email);
  await testId(page, tid.inputPassword).fill(password);
  await testId(page, tid.btnSignUp).click();
}

export async function login(page: Page, email: string, password: string) {
  await goToLogin(page);
  await testId(page, tid.inputEmail).fill(email);
  await testId(page, tid.inputPassword).fill(password);
  await testId(page, tid.btnLogin).click();
}

// --- Project ---

export async function createProject(page: Page) {
  await testId(page, tid.btnCreateProject).click();
  await expect(testId(page, tid.dashboardView)).toBeVisible();
}

// --- Full setup: sign up + create project ---

export async function signUpAndCreateProject(page: Page, email: string, password: string) {
  await signUp(page, email, password);
  await createProject(page);
}

// --- Test user factory ---

export function createTestUser() {
  return {
    email: `test-${Date.now()}@mytimes.test`,
    password: "TestPass123!",
  };
}
