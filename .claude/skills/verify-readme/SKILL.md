---
name: verify-readme
description: Verify and update README.md to accurately reflect the current codebase — checks all scripts, deploy commands, skills, file structure, setup instructions, dev server config, tech stack, and test infrastructure. Use when the user says "verify the readme", "check the readme", "is the readme accurate", "audit the readme", "sync the readme", or "update the readme".
---

# Verify & Update README

Audit README.md against the actual codebase, report every discrepancy, and fix them.

## What to check

Run these checks in parallel where possible.

### 1. Project structure

Compare the directory tree documented in the README against what actually exists at the repo root.

- `ls` at repo root, compare against the "Project structure" section
- Flag directories/files that exist but aren't listed
- Flag entries listed in README that no longer exist

### 2. All scripts (root + workspaces)

Read `package.json` at root, `web/package.json`, and `functions/package.json`. Compare every script against what the README documents.

- Missing scripts: commands in README that don't exist in any package.json
- Undocumented scripts: useful scripts in package.json not mentioned in README
- Wrong commands: documented commands that differ from actual scripts
- Pay special attention to deploy commands — these must be exact

### 3. Setup instructions

- Do install commands reference the correct directories?
- Is the package manager correct (pnpm not npm)?
- Is the Node.js version requirement accurate? Check `.nvmrc`, `engines`, `volta`.
- Are all prerequisite tools listed?

### 4. Dev server & ports

- Read `web/vite.config.ts` or `web/package.json` for the actual dev port
- Read `test/playwright.config.ts` for the test base URL
- Compare against what README says
- All port references must be consistent

### 5. Tech stack claims

- Read `web/package.json` dependencies — verify React, Vite, Tailwind, shadcn, etc.
- Read `functions/package.json` — verify Firebase Functions deps
- Flag anything claimed but not installed, or major deps not mentioned

### 6. Claude Code skills

- Read `.claude/skills/` — list every skill directory
- Read each `SKILL.md` frontmatter for name and description
- Every skill should be documented in the README with its slash command and a one-line description of when to use it

### 7. Test infrastructure

- Check if `test/` exists and what test framework is used
- Read `test/playwright.config.ts` if present
- Document how to run tests

## Output format

Present findings as a checklist:

```
## README Verification Report

### Project Structure
- [x] web/ — exists
- [ ] test/ — exists but NOT in README

### Scripts
- [x] deploy:all — matches
- [ ] deploy:web — wrong description

### Skills
- [ ] /create-test — not in README
- [ ] /verify-and-test — not in README
- [ ] /verify-readme — not in README
```

## After reporting — auto-fix

Update the README to match reality. The code is the source of truth, not the README.

When updating:
- Preserve the existing tone and structure
- Only change lines that are factually wrong or missing
- Keep it concise — match the existing style
- Add a "Claude Code Skills" section if one doesn't exist, listing each skill with its slash command and a one-liner
- Add a "Testing" section if tests exist but aren't documented
- Ensure all deploy/dev scripts match the actual package.json commands exactly
- Ensure ports are consistent across all references
