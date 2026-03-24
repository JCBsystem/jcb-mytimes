# MyTimes

## What This Is

A personal memory app where users capture moments, thoughts, experiences, photos, and links — then revisit them over time. Data isolation is driven by Firebase custom claims: each user gets a nanoid-based project key set as a custom claim on signup, and all their data lives under `project/{claimKey}/data/`. Security rules enforce that users can only access their own data.

## Core Value

Users can effortlessly capture a memory in the moment and rediscover it later — the act of saving and finding again must feel instant and personal.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Firebase Auth with email/password (sign up + login)
- [ ] "Create Project" action calls Cloud Function → generates nanoid → sets custom claim
- [ ] Firestore data at `project/{claimKey}/data/...`
- [ ] Security rules enforce claim-based data isolation
- [ ] Firestore onSnapshot listeners for real-time updates
- [ ] Create memories with text, photo, tags, mood, links
- [ ] Upload images to Firebase Storage
- [ ] Timeline feed, search, tag filter, "On This Day"
- [ ] Responsive design

### Out of Scope

- Google OAuth — email/password only for v1
- Sharing/social features — private app
- Video uploads — storage cost
- AI search — keep v1 simple
- Offline support — defer to v2

## Context

- **Stack:** Vite + React (TypeScript) + shadcn/ui + Firebase (Auth, Firestore, Storage, Cloud Functions)
- **Architecture:** Custom claims-driven data isolation — nanoid key per user, used in Firestore paths and security rules
- **Target:** Personal use — the user is both builder and primary user
- **Design direction:** Warm, personal, minimal

## Constraints

- **Tech stack**: Vite + React (TypeScript) + shadcn + Firebase — non-negotiable
- **Timeline**: 3 hours — ship fast, cut scope aggressively
- **Auth**: Firebase Auth with email/password + custom claims for data isolation
- **Flow**: Sign up → "Create Project" → Cloud Function sets nanoid claim → start using app
- **Data model**: `project/{nanoidKey}/data/...` — claim-based security rules
- **Dates**: All datetimes stored in UTC. Use dayjs on the client for parsing/formatting/display
- **Folder structure**: `web/` for the React app, `functions/` for Firebase Cloud Functions — both at project root

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Nanoid custom claims for data isolation | Security rules use `request.auth.token.projectKey` — clean, scalable pattern | — Pending |
| Cloud Function for claim assignment | Claims require Admin SDK — callable function triggered by "Create Project" button | — Pending |
| Email/password auth | Simple, no OAuth config needed — fastest path | — Pending |
| Explicit "Create Project" step | User signs up first, then creates project — separates auth from data provisioning | — Pending |
| Firestore real-time listeners | onSnapshot at collection level — app feels instant without manual refresh | — Pending |
| dayjs for dates | Lightweight, modern, immutable — all storage in UTC, dayjs handles display conversion | — Pending |
| Firebase as full backend | Single platform for auth, database, storage, functions | — Pending |
| TypeScript | Type safety, better DX | — Pending |
| 3-hour constraint | Ship fast — coarse phases, cut scope aggressively | — Pending |

## Known Bugs / Time Hacks

| Issue | Impact | Fix |
|-------|--------|-----|
| Search reads ALL documents in-memory | Will not scale past ~1k memories | Replace with Algolia/Typesense/Meilisearch synced via Firestore triggers |
| Firestore has no native full-text search | Server-side `searchMemories` Cloud Function does brute-force string matching | Same as above — dedicated search engine |
| Tag filtering is client-side only | Works because onSnapshot loads all memories; breaks if listener is paginated | Move to server-side query or search engine |
| Firestore field name mismatch: `voice`/`transcribedText` vs TypeScript `audioUrl`/`transcript` | Runtime fallback in MemoryRow handles both names | Align field names in Cloud Function or migration |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-24 after architecture clarification (claims-based isolation)*
