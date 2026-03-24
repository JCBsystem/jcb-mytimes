# MyTimes

A personal memory app. Capture moments, thoughts, and experiences — then revisit them over time.

**Stack:** Vite + React + TypeScript + Tailwind + shadcn/ui + Firebase (Auth, Firestore, Storage, Cloud Functions)

## Setup

```bash
# Install dependencies
cd web && pnpm install
cd ../functions && pnpm install
```

Requires:
- Node.js 22+
- pnpm
- Firebase CLI (`npm install -g firebase-tools`)
- Logged into Firebase (`firebase login`)

## Run locally

```bash
# Start the web dev server
cd web && pnpm dev
```

The app runs at `http://localhost:5544` and connects to the live Firebase project.

## Deploy

```bash
# Deploy everything (functions, rules, hosting)
pnpm deploy:all

# Or deploy individually
pnpm deploy:web        # Build web + deploy hosting
pnpm deploy:functions  # Build + deploy Cloud Functions
pnpm deploy:rules      # Deploy Firestore security rules
```

## Testing

E2E tests use [Playwright](https://playwright.dev/) and live in `test/e2e/`.

```bash
# Run all e2e tests (starts dev server automatically)
cd test && npx playwright test

# Run a specific spec
cd test && npx playwright test e2e/memory.spec.ts
```

## Project structure

```
web/              → React frontend (Vite + PWA)
functions/        → Firebase Cloud Functions
test/e2e/         → Playwright end-to-end tests
firestore.rules   → Firestore security rules
firebase.json     → Firebase config
```

## Cloud Functions

| Function | Trigger | Description |
|----------|---------|-------------|
| `createProject` | `onCall` | Generates a nanoid project key, sets it as a custom claim on the user |
| `uploadAudio` | `onCall` | Accepts base64 audio, uploads to Storage, updates the memory doc with the URL |
| `transcribeMemory` | `onDocumentWritten` | Detects new voice URLs on memory docs, sends audio to Claude for transcription |
| `searchMemories` | `onCall` | In-memory full-text search across all memories for a project (returns matching IDs) |

## Known Issues

- **No full-text search index.** `searchMemories` runs server-side but reads every document from Firestore and filters by string matching — no search engine behind it. Works for hundreds of memories, won't scale. Production fix: sync to a dedicated search engine (Algolia, Typesense, or Meilisearch) via Firestore triggers.
- **Client loads all memories.** The `onSnapshot` listener fetches every memory. Should be paginated in production (e.g. last 100), with search reaching the full dataset server-side.

## Claude Code Skills

Custom slash commands for use in [Claude Code](https://claude.com/claude-code) sessions:

| Command | Description |
|---------|-------------|
| `/create-test` | Generate a Playwright e2e test for a feature |
| `/verify-and-test` | Browse the running app in Chrome to verify a feature, then generate a test from what was observed |
| `/verify-readme` | Audit README.md against the codebase and auto-fix discrepancies |
