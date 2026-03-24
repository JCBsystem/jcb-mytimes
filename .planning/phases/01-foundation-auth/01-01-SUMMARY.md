---
phase: 01-foundation-auth
plan: 01
subsystem: auth
tags: [firebase-auth, react-context, react-router, custom-claims, httpsCallable]

# Dependency graph
requires: []
provides:
  - AuthProvider context with onAuthStateChanged listener
  - useAuth hook (signUp, login, logout, createProject, user, projectKey, loading)
  - AuthForm component with sign-up/login toggle
  - CreateProject component calling Cloud Function
  - ProtectedRoute guard with auth and projectKey checks
  - BrowserRouter setup with /login, /create-project, and / routes
affects: [02-memory-crud, ui-components, data-access]

# Tech tracking
tech-stack:
  added: []
  patterns: [AuthContext provider at root, useAuth hook pattern, claim-based route guarding, forced token refresh after custom claim set]

key-files:
  created:
    - web/src/lib/auth.tsx
    - web/src/components/AuthForm.tsx
    - web/src/components/CreateProject.tsx
    - web/src/components/ProtectedRoute.tsx
  modified:
    - web/src/App.tsx
    - web/src/main.tsx

key-decisions:
  - "Used .tsx extension for auth module since AuthProvider returns JSX"
  - "Combined sign-up and login in a single AuthForm with toggle for minimal UI"
  - "Route-level guards (LoginRoute, CreateProjectRoute) handle redirect logic inline in App.tsx"

patterns-established:
  - "AuthProvider at root: wrap App in main.tsx, all components access via useAuth()"
  - "Token refresh pattern: getIdToken(true) after custom claim changes before reading getIdTokenResult"
  - "Route guard pattern: ProtectedRoute checks user + projectKey, redirects to appropriate screen"

requirements-completed: [AUTH-01, AUTH-02, AUTH-03, AUTH-04]

# Metrics
duration: 3min
completed: 2026-03-24
---

# Phase 1 Plan 1: Auth & Project Setup Summary

**Firebase email/password auth with sign-up/login toggle, Create Project callable flow with forced token refresh, and route-guarded app shell**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-24T13:09:54Z
- **Completed:** 2026-03-24T13:12:58Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- AuthProvider with onAuthStateChanged listener and projectKey extraction from custom claims
- useAuth hook exposing signUp, login, logout, and createProject with forced token refresh
- AuthForm with email/password inputs, sign-up/login mode toggle, and error display
- CreateProject screen that calls httpsCallable and refreshes claims
- ProtectedRoute guard redirecting based on auth and projectKey state
- Full router setup with login, create-project, and app shell routes

## Task Commits

Each task was committed atomically:

1. **Task 1: Auth context, hooks, and helper functions** - `b80b702` (feat)
2. **Task 2: Auth UI components, routing, and app shell** - `8db8ee7` (feat)

## Files Created/Modified
- `web/src/lib/auth.tsx` - AuthProvider, useAuth hook, signUp/login/logout/createProject helpers
- `web/src/components/AuthForm.tsx` - Combined sign-up and login form with toggle
- `web/src/components/CreateProject.tsx` - Create project screen calling Cloud Function
- `web/src/components/ProtectedRoute.tsx` - Route guard checking user and projectKey
- `web/src/App.tsx` - BrowserRouter with routes for /login, /create-project, and /
- `web/src/main.tsx` - Wrapped App in AuthProvider

## Decisions Made
- Used `.tsx` extension for auth module since AuthProvider returns JSX (required by `tsc -b` build mode)
- Combined sign-up and login in a single AuthForm with toggle to minimize components
- Route-level redirect logic (LoginRoute, CreateProjectRoute) implemented inline in App.tsx rather than separate wrapper components

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Renamed auth.ts to auth.tsx for JSX compilation**
- **Found during:** Task 2 (build verification)
- **Issue:** Plan specified `web/src/lib/auth.ts` but the file contains JSX (`<AuthContext>`). While `tsc --noEmit` passed, `tsc -b` (used by `pnpm build`) does not process JSX in `.ts` files.
- **Fix:** Renamed to `auth.tsx` and updated all imports to reference `.tsx` extension
- **Files modified:** web/src/lib/auth.tsx (renamed), all consumer files (updated imports)
- **Verification:** `pnpm build` succeeds with zero errors
- **Committed in:** 8db8ee7 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Necessary for production build. No scope creep.

## Issues Encountered
None beyond the deviation documented above.

## User Setup Required
None - no external service configuration required. Firebase config is already committed and the createProject Cloud Function is already deployed.

## Known Stubs
- App shell displays placeholder text: "Your memories will appear here. Project: {projectKey}" -- this is intentional; the memory feed UI will be implemented in Phase 2 (01-02 plan).

## Next Phase Readiness
- Auth foundation complete: sign up, login, logout, project creation all functional
- ProtectedRoute pattern established for all future protected screens
- useAuth hook available for all components needing auth state or projectKey
- Ready for Firestore security rules and memory CRUD (Plan 01-02)

## Self-Check: PASSED

All 6 files verified present. Both commit hashes (b80b702, 8db8ee7) found in git log.

---
*Phase: 01-foundation-auth*
*Completed: 2026-03-24*
