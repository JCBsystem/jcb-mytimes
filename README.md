# MyTimes

A personal memory app. Capture moments, thoughts, and experiences — then revisit them over time.

**Stack:** Vite + React 19 + TypeScript + Tailwind CSS 4 + shadcn + Firebase (Auth, Firestore, Storage, Cloud Functions) + Claude API (audio transcription)

## Setup

```bash
# Install dependencies (three workspaces)
cd web && pnpm install
cd ../functions && pnpm install
cd ../test && pnpm install
```

Requires:
- Node.js 22+
- pnpm
- Firebase CLI (`pnpm add -g firebase-tools`)
- Logged into Firebase (`firebase login`)

## Run locally

```bash
# From the repo root
pnpm dev
```

The app runs at `http://localhost:5544` and connects to the live Firebase project.

**Live:** https://jcb-mytime.web.app
**Console:** https://console.firebase.google.com/project/jcb-mytime

## Deploy

```bash
# Deploy everything (functions, rules, hosting)
pnpm deploy:all

# Or deploy individually
pnpm deploy:web        # Build web + deploy hosting
pnpm deploy:functions  # Build + deploy Cloud Functions
pnpm deploy:rules      # Deploy Firestore security rules
pnpm deploy:storage    # Deploy Storage security rules
```

## Architecture notes

- **Client-side image resize.** Before uploading, images are resized on the client via canvas to max 1920px wide and converted to JPEG at 82% quality (`web/src/lib/memories.ts`). The server (`uploadImage` Cloud Function) applies a second resize to max 1200px wide at JPEG quality 80 via sharp.
- **PWA support.** The app is installable as a mobile app via `vite-plugin-pwa` (manifest in `web/vite.config.ts`, install prompt via `web/src/hooks/usePwaInstall.ts`). Runs in standalone display mode.
- **Firestore offline persistence.** The Firestore client is initialized with `persistentLocalCache` and `persistentMultipleTabManager` (`web/src/lib/firebase.ts`), so reads/writes work offline and sync when connectivity returns.
- **Server-side search (IDs-only).** `searchMemories` returns only matching document IDs. The client already holds the full memory set via its `onSnapshot` listener and filters locally by those IDs (`web/src/lib/search.ts`).

## Testing

E2E tests use [Playwright](https://playwright.dev/) and live in `test/e2e/`.

```bash
# Run all e2e tests (starts dev server automatically)
cd test && pnpm test

# Run with visible browser
cd test && pnpm test:headed

# Interactive UI mode
cd test && pnpm test:ui
```

## Project structure

```
web/              → React frontend (Vite + PWA)
functions/        → Firebase Cloud Functions (TypeScript, sharp, Anthropic SDK)
test/             → Playwright e2e tests (own workspace with package.json)
firestore.rules   → Firestore security rules
storage.rules     → Storage security rules
firebase.json     → Firebase project config + Hosting rewrites
```

## Cloud Functions

| Function | Trigger | Description |
|----------|---------|-------------|
| `createProject` | `onCall` | Generates a nanoid project key, sets it as a custom claim on the user |
| `uploadImage` | `onCall` | Accepts base64 image (max 10 MB), resizes to max 1200px wide JPEG at quality 80 via sharp, uploads to Storage, updates memory doc with CDN URL |
| `uploadAudio` | `onCall` | Accepts base64 audio, uploads to Storage, updates the memory doc with CDN URL |
| `transcribeMemory` | `onDocumentWritten` | Detects new voice URLs on memory docs, sends audio to Claude for transcription |
| `searchMemories` | `onCall` | In-memory full-text search across all memories for a project (returns matching IDs) |
| `cdnImage` | `onRequest` | HTTP proxy that streams images/audio from Storage with 1-year cache headers, served via Firebase Hosting CDN rewrite at `/cdn/**` |

## Known Issues

- **No full-text search index.** `searchMemories` runs server-side but reads every document from Firestore and filters by string matching — no search engine behind it. Works for hundreds of memories, won't scale. Production fix: sync to a dedicated search engine (Algolia, Typesense, or Meilisearch) via Firestore triggers.
- **Client loads all memories.** The `onSnapshot` listener fetches every memory. Should be paginated in production (e.g. last 100), with search reaching the full dataset server-side.
- **Dual search is a time hack.** Client filters instantly from already-loaded memories while the server `searchMemories` call runs in parallel. Both exist because the client currently holds all data, but in production with a paginated listener the server would be the only path to the full dataset. The client-side filter would then only cover the loaded page.

## Claude Code Skills

Custom slash commands for use in [Claude Code](https://claude.com/claude-code) sessions:

| Command | Description |
|---------|-------------|
| `/create-test` | Generate a Playwright e2e test for a feature |
| `/verify-and-test` | Browse the running app in Chrome to verify a feature, then generate a test from what was observed |
| `/verify-readme` | Audit README.md against the codebase and auto-fix discrepancies |
