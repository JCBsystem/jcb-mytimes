---
name: create-test
description: Create Playwright e2e tests for this project. Use this skill when the user asks to write a test, add a test, create a spec, or add e2e coverage — even if they don't say "Playwright" explicitly. Also trigger for "add a spec for memories", "write tests for settings". If the user wants to browse/verify the app AND create tests together, use verify-and-test instead.
---

# Create Playwright E2E Test

You're writing Playwright e2e tests for the MyTimes app. The project has an established test infrastructure with shared helpers and a strict convention around selectors. Following these conventions keeps tests stable, readable, and easy to maintain as the app grows.

## Project layout

```
test/
├── playwright.config.ts    # Playwright config (baseURL: localhost:5173)
├── e2e/
│   ├── helpers.ts           # Shared helpers, test IDs, navigation, auth
│   ├── app.spec.ts          # Smoke test
│   ├── auth.spec.ts         # Sign up / login
│   ├── project.spec.ts      # Create project
│   └── memory.spec.ts       # Create memory
```

## Step-by-step workflow

### 1. Read the current helpers

Before writing anything, read `test/e2e/helpers.ts` to see what helpers and `tid` constants already exist. This prevents duplicating work and ensures you use the exact same test IDs the app already wires up.

### 2. Identify what the test needs

Break the user's request into discrete behaviors. Each behavior becomes one `test()` block — keep tests focused on a single thing so failures are easy to diagnose.

Ask yourself:
- What **navigation or setup** does this test need? (go to a page, sign up, create a project, etc.)
- What **actions** does the test perform? (click a button, fill a form, etc.)
- What **assertions** verify the behavior? (element visible, text content, URL change, etc.)

### 3. Add missing helpers and test IDs first

If the test requires a reusable action or a `data-testid` that doesn't exist yet in helpers.ts, add it there **before** writing the spec file. This is the most important convention — recurring actions live in helpers, not inlined in test files.

**Adding a new test ID:**
Add it to the `tid` object in helpers.ts, grouped under a comment section for the feature area:

```ts
// --- Settings ---
btnOpenSettings: "btn-open-settings",
inputDisplayName: "input-display-name",
btnSaveSettings: "btn-save-settings",
```

Use this naming convention for test IDs:
- Buttons: `btn-<action>` → `"btn-save-settings"`
- Inputs: `input-<field>` → `"input-display-name"`
- Links: `link-<destination>` → `"link-signup"`
- Views/pages: `view-<name>` → `"view-dashboard"`
- List items: `<thing>-item` → `"memory-item"`

**Adding a new helper function:**
Follow the existing pattern — accept `page: Page` as the first argument, use `testId()` and `tid` for all element access, and group under a comment section:

```ts
// --- Settings ---
export async function openSettings(page: Page) {
  await testId(page, tid.btnOpenSettings).click();
}

export async function updateDisplayName(page: Page, name: string) {
  await openSettings(page);
  await testId(page, tid.inputDisplayName).fill(name);
  await testId(page, tid.btnSaveSettings).click();
}
```

### 4. Write the spec file

Create or edit a `.spec.ts` file in `test/e2e/`. Follow this structure:

```ts
import { test, expect } from "@playwright/test";
import { createTestUser, signUpAndCreateProject, testId, tid } from "./helpers";

test.describe("Feature Name", () => {
  const user = createTestUser();

  test("specific behavior being tested", async ({ page }) => {
    // Setup — use helper functions
    await signUpAndCreateProject(page, user.email, user.password);

    // Act — use testId() for all element access
    await testId(page, tid.btnSomething).click();
    await testId(page, tid.inputSomething).fill("value");

    // Assert
    await expect(testId(page, tid.someElement)).toBeVisible();
    await expect(testId(page, tid.someElement)).toContainText("expected text");
  });
});
```

## Selector priority (this matters a lot)

Selectors are the #1 cause of flaky tests. The project enforces this strict priority:

1. **`data-testid` via `testId(page, tid.xxx)`** — the default for everything. These don't break when text, styling, or DOM structure changes.
2. **ARIA role** via `page.getByRole()` — acceptable only when testing accessibility behavior specifically.
3. **Text content** — avoid. Only use for asserting content, never for finding elements to interact with.
4. **CSS classes / DOM paths** — never. These are implementation details that change constantly.

The `testId()` helper is a thin wrapper around `page.getByTestId()`. Using it (rather than calling `getByTestId` directly) keeps a consistent pattern across all tests and makes the codebase easy to search.

## Rules to internalize

- **One behavior per test.** "Sign up and then create a memory" is two tests, not one — unless the test is specifically about the full onboarding flow.
- **Use `createTestUser()`** for credentials. It generates unique emails via `Date.now()` so tests don't collide.
- **Setup goes in `beforeEach` or helper calls**, not copy-pasted across tests. If you find yourself writing the same 3 lines in multiple tests, that's a helper.
- **Compose helpers.** `signUpAndCreateProject()` composes `signUp()` + `createProject()`. Build bigger flows from smaller pieces rather than writing monolithic setup functions.
- **Tell the user what `data-testid` attributes to add.** After writing the test, list any new `tid` values that need corresponding `data-testid="xxx"` attributes in the React components. This bridges the gap between test and implementation.
