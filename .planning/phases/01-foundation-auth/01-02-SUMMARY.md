---
phase: 01-foundation-auth
plan: 02
subsystem: auth
tags: [firebase, firestore, security-rules, playwright, e2e]

requires:
  - phase: 01-01
    provides: "AuthProvider, useAuth hook, auth UI components, routing"
provides:
  - "Firestore security rules with claim-based data isolation"
  - "Playwright e2e test suite for auth flow"
  - "Toast-based error handling system"
  - "/signout route"
affects: [02-memory-capture, 03-rediscovery]

tech-stack:
  added: []
  patterns: [claim-based-security-rules, toast-error-handling]

key-files:
  created:
    - firestore.rules
    - test/e2e/auth.spec.ts
    - test/playwright.config.ts
    - web/src/components/ui/toast.tsx
  modified:
    - firebase.json
    - web/src/components/AuthForm.tsx
    - web/src/components/CreateProject.tsx
    - web/src/main.tsx
    - web/src/App.tsx
    - functions/src/index.ts

key-decisions:
  - "Auto-trigger createProject on mount instead of manual button click — smoother UX"
  - "Added toast provider for friendly error messages instead of inline error text"
  - "Mapped Firebase error codes to user-friendly messages"
  - "Added /signout route for programmatic logout"
  - "Added cors: true to Cloud Function for localhost dev"

patterns-established:
  - "Toast pattern: useToast() hook for error/success notifications"
  - "Friendly error mapping: Firebase error codes → human-readable messages"

requirements-completed: [AUTH-05]

duration: 15min
completed: 2026-03-24
---

# Phase 01-02: Security Rules & Auth Polish Summary

**Firestore claim-based security rules, e2e auth tests, toast error handling, and auto-project-creation flow**

## Performance

- **Duration:** 15 min
- **Tasks:** 2 (1 auto + 1 human-verify checkpoint)
- **Files modified:** 10

## Accomplishments
- Firestore security rules enforce data isolation via `request.auth.token.projectKey == projectKey`
- Default deny-all rule blocks any path not under `/project/{projectKey}/`
- Playwright e2e tests cover sign-up, login, logout, and session persistence
- Toast system for friendly error messages across auth flows
- Auto-create project on sign-up (no manual button click)
- `/signout` route for clean logout with redirect

## Task Commits

1. **Task 1: Firestore security rules and e2e auth test** - `b810eb0` (feat)
2. **Task 2: Human verification + polish** - `6e25b18` (feat)

## Files Created/Modified
- `firestore.rules` - Claim-based Firestore security rules
- `firebase.json` - Added firestore rules reference
- `test/e2e/auth.spec.ts` - Playwright e2e auth flow tests
- `test/playwright.config.ts` - Playwright config
- `web/src/components/ui/toast.tsx` - Toast provider and useToast hook
- `web/src/components/AuthForm.tsx` - Friendly error toasts
- `web/src/components/CreateProject.tsx` - Auto-trigger on mount
- `web/src/App.tsx` - Added /signout route
- `web/src/main.tsx` - Added ToastProvider
- `functions/src/index.ts` - Added cors: true for Cloud Function

## Decisions Made
- Auto-create project on mount for smoother onboarding UX
- Toast-based errors instead of inline — less visual clutter, auto-dismiss
- Firebase error code mapping for user-friendly messages

## Deviations from Plan
- CreateProject changed from manual button to auto-trigger on mount (user request)
- Added toast system (user request for better error UX)
- Added /signout route (user request)

## Issues Encountered
- Cloud Function CORS error from localhost — fixed with `cors: true` option
- Cloud Run IAM blocking requests — needs `invoker: "public"` on function (pending redeploy)

## Next Phase Readiness
- Auth foundation complete — sign-up, login, logout, project creation all working
- Security rules ready for data isolation
- Pending: Cloud Function redeploy with `invoker: "public"` for production

---
*Phase: 01-foundation-auth*
*Completed: 2026-03-24*
