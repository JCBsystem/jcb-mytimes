---
name: verify-readme
description: Verify and update README.md to accurately reflect the current codebase — checks all scripts, deploy commands, skills, file structure, setup instructions, dev server port, tech stack, Cloud Functions, and known issues. Use when the user says "verify the readme", "check the readme", "is the readme accurate", "audit the readme", "sync the readme", or "update the readme".
---

# Verify & Update README

Audit README.md against the actual codebase, report every discrepancy, and fix them.

## CRITICAL RULE: Nothing unverified

NEVER write anything into the README that you have not directly verified by reading the actual source code. Every claim must trace back to a specific file and line you read in this session.

- Do NOT summarize or paraphrase what you think code does — read it, understand it, then describe exactly what it does.
- Do NOT assume behavior from function names, file names, or comments alone — read the implementation.
- Do NOT add descriptions, labels, or explanations that go beyond what the code literally does.
- If you are unsure about something, flag it in the report as UNVERIFIED and ask the user — do NOT write it into the README.
- When describing known issues, use only the exact language from code comments or directly observable behavior. Do not editorialize or infer production fixes unless the code comments explicitly state them.

## What to check

Run these checks in parallel where possible.

### 1. Project structure

- `ls` at repo root, compare against the "Project structure" section
- Flag directories/files that exist but aren't listed
- Flag entries listed in README that no longer exist

### 2. All scripts (root + workspaces)

Read `package.json` at root, `web/package.json`, and `functions/package.json`. Compare every script against what the README documents.

- Missing: commands in README that don't exist in any package.json
- Undocumented: useful scripts not mentioned in README
- Wrong: documented commands that differ from actual scripts
- Deploy commands must be exact

### 3. Setup instructions

- Do install commands reference the correct directories?
- Is the package manager correct (pnpm not npm)?
- Is the Node.js version accurate? Check `engines` in package.json.
- Are all prerequisite tools listed?

### 4. Dev server & ports

- Read `web/vite.config.ts` for the actual dev port
- Read `test/playwright.config.ts` for the test base URL
- All port references in README must match reality

### 5. Tech stack

- Read `web/package.json` deps — verify React, Vite, Tailwind, shadcn, etc.
- Read `functions/package.json` — verify Firebase Functions deps
- Flag anything claimed but not installed, or major deps not mentioned

### 6. Claude Code skills

- List every skill in `.claude/skills/`
- Read each `SKILL.md` frontmatter for name and description
- Every skill should be in the README with its slash command and a one-liner

### 7. Test infrastructure

- Check if `test/` exists and what framework is used
- Document how to run tests if not already there

### 8. Cloud Functions

- Read `functions/src/index.ts` and every exported function file
- Read the actual implementation of each function — do not guess from the name
- List every Cloud Function with its trigger type and a description based on what the code actually does
- Every function should appear in a "Cloud Functions" section in the README

### 9. Known issues & missing features

- Scan source files for comments containing TODO, HACK, FIXME, DEMO, or "time-constrained"
- Read the full comment block around each match to understand the actual issue
- Only document issues that are explicitly called out in the code — do not infer issues
- Use the code comment's own wording as the basis for the README entry
- If the comment suggests a production fix, include it. If it doesn't, don't invent one.

## Output format

Present findings as a checklist grouped by section, using PASS/FAIL/WARN labels.

## After reporting — auto-fix

Update the README to match reality. The code is the source of truth, not the README.

When updating:
- Preserve the existing tone and structure
- Only change lines that are factually wrong or missing
- Keep it concise
- Every word you write must be backed by something you read in the code
- Add a "Cloud Functions" section if missing
- Add a "Known Issues" section if missing and there are code-documented issues
- Add a "Claude Code Skills" section if missing
- Add a "Testing" section if tests exist but aren't documented
- Ensure all scripts and ports match the actual codebase exactly
