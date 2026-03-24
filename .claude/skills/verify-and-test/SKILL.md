---
name: verify-and-test
description: Browse the running app in Chrome to verify a feature works, then generate a Playwright e2e test from what was observed. Use this skill when the user says things like "verify and test X", "check if X works and write a test", "browse the app and create tests", "verify the login", or anytime the user wants to both confirm a feature visually AND produce test coverage in one shot. Also trigger when the user finishes building a feature and wants it validated end-to-end.
---

# Verify & Test

This skill combines two things into one flow: **browse the running app in Chrome** to verify a feature actually works, then **generate a Playwright e2e test** that codifies exactly what you verified. The idea is simple — if you proved it works by clicking through it, you already have everything you need to write the test.

## The flow

```
User: "verify and test the login flow"
  │
  ├─ Phase 1: BROWSE — open Chrome, interact with the app, confirm it works
  │   ├─ Record every action: what you clicked, what you typed, what you waited for
  │   ├─ Record every assertion: what text appeared, what became visible, what URL changed
  │   └─ Note which elements have data-testid and which don't
  │
  ├─ Phase 2: REPORT — tell the user what worked and what's missing
  │   ├─ Feature status: working / broken / partially working
  │   ├─ Missing data-testid attributes that need adding to components
  │   └─ Any bugs or unexpected behavior observed
  │
  └─ Phase 3: GENERATE — write the Playwright test following create-test conventions
      ├─ Update helpers.ts with new tid constants and helper functions
      └─ Write or update the .spec.ts file
```

## Phase 1: Browse and verify

### Setup

1. Get the current browser tabs with `mcp__claude-in-chrome__tabs_context_mcp`
2. Check if the app is already open at `localhost:5544`. If not, create a new tab with `mcp__claude-in-chrome__tabs_create_mcp` and navigate to `http://localhost:5544`
3. If the app isn't running, tell the user: "The dev server doesn't seem to be running. Start it with `pnpm --dir web dev` and let me know."

### Interacting with the app

Walk through the feature step by step. For each step:

1. **Take a snapshot** with `mcp__claude-in-chrome__browser_snapshot` to understand the current page state
2. **Perform the action** — click, type, navigate using the Chrome tools
3. **Verify the result** — take another snapshot or read the page to confirm the expected outcome
4. **Log what happened** — keep a running record in this format:

```
STEP 1: Navigate to /login
  ACTION: mcp__claude-in-chrome__navigate → http://localhost:5544/login
  SAW: Login form with email + password inputs, "Sign In" button
  TESTID PRESENT: [input-email, input-password, btn-login] or MISSING: [none]

STEP 2: Fill email
  ACTION: mcp__claude-in-chrome__form_input → email field → "test@example.com"
  SAW: Field populated
  TESTID PRESENT: [input-email] or MISSING: [need data-testid on field]
```

This log is your source material for the test.

### What to look for while browsing

- **Does the feature work end-to-end?** Complete the full flow, don't stop at the first screen.
- **Are `data-testid` attributes present?** Check the page snapshot for elements that have them. Elements without them need to be flagged — the test will need them.
- **Are there errors?** Check the console with `mcp__claude-in-chrome__read_console_messages` if something seems off.
- **Timing issues?** Note if anything takes a while to load — tests may need explicit waits.

### Handling auth state

Many features require a logged-in user. If the feature you're testing needs auth:
1. First navigate to the login/signup page
2. Create an account or log in
3. Then proceed to the actual feature

Record the auth steps too — the test will need them in its setup.

## Phase 2: Report to the user

After browsing, give the user a clear summary:

```
## Verification: [Feature Name]

**Status**: Working / Broken / Partial

### What I verified
- ✓ Step 1 description
- ✓ Step 2 description
- ✗ Step 3 — [what went wrong]

### Missing data-testid attributes
These elements need `data-testid` added in the React components:
- Login button → needs `data-testid="btn-login"`
- Email input → needs `data-testid="input-email"`

### Bugs or issues found
- [anything unexpected]
```

If the feature is broken, stop here — no point writing a test for something that doesn't work. Help the user fix it first.

If `data-testid` attributes are missing, list them clearly so the user can add them. The tests you generate will reference them.

## Phase 3: Generate the test

Now translate your browsing session into a proper Playwright test. Follow the `create-test` skill conventions exactly.

### Step 1: Read current helpers

Read `test/e2e/helpers.ts` to see what already exists.

### Step 2: Map browser actions to test code

Translate your browsing log into test operations:

| Chrome action | Playwright equivalent |
|---|---|
| `navigate` to URL | `await page.goto("/path")` or `await page.waitForURL("**/path")` |
| `form_input` on a field | `await testId(page, tid.inputXxx).fill("value")` |
| `browser_click` on a button | `await testId(page, tid.btnXxx).click()` |
| Verified text is visible | `await expect(testId(page, tid.xxx)).toBeVisible()` |
| Verified text content | `await expect(testId(page, tid.xxx)).toContainText("text")` |
| Verified URL changed | `await page.waitForURL("**/expected-path")` |
| Waited for loading | `await expect(testId(page, tid.xxx)).toBeVisible({ timeout: 10000 })` |

### Step 3: Update helpers.ts

Add any new `tid` constants and helper functions before writing the spec. Follow the naming convention:
- Buttons: `btn-<action>`
- Inputs: `input-<field>`
- Links: `link-<destination>`
- Views: `view-<name>`
- Items: `<thing>-item`

If a multi-step action was performed during browsing (e.g. fill form + submit), and it could be reused by other tests, make it a helper function.

### Step 4: Write the spec

Write the `.spec.ts` file following the create-test conventions:
- Import from `./helpers`
- Use `test.describe` with a descriptive group name
- Use `createTestUser()` for credentials
- One behavior per `test()` block
- Setup via helper functions, not inline repetition
- All element access via `testId(page, tid.xxx)`

### Step 5: Summarize what was created

Tell the user:
1. What test file was created/updated
2. What was added to helpers.ts
3. What `data-testid` attributes need to be added to React components (if not already present)

## Important notes

- The app must be running at `localhost:5544` for browsing to work. The Playwright tests use the same URL.
- If the user says "verify X" without mentioning tests, still offer to generate the test — that's the whole point of this skill.
- If a feature is partially working, you can still write tests for the working parts and add skipped tests (`test.skip`) for the broken parts with a comment explaining what's broken.
- Record a GIF with `mcp__claude-in-chrome__gif_creator` if the flow is multi-step — the user will appreciate seeing the verification playback.
