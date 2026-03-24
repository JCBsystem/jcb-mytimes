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

The app runs at `http://localhost:5173` and connects to the live Firebase project.

## Deploy

```bash
# Deploy everything (functions, rules, hosting)
pnpm deploy:all

# Or deploy individually
pnpm deploy:web        # Build web + deploy hosting
pnpm deploy:functions  # Build + deploy Cloud Functions
pnpm deploy:rules      # Deploy Firestore security rules
```

## Project structure

```
web/           → React frontend (Vite)
functions/     → Firebase Cloud Functions
firestore.rules → Firestore security rules
firebase.json  → Firebase config
```
