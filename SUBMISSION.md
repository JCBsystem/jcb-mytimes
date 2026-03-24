# Submission — Take-Home Assignment

## What I built

A single-screen memory capture app with a real-time timeline. The core loop: tap +, type what happened, optionally add a photo/mood/tags/people/voice memo, save. It appears instantly in a date-grouped timeline. You can expand, edit, delete, and search.

**Delivered features:**
- Create memories with text (required), photo, mood (1-5 emoji), tags, people, voice recording, and backdated event date
- Real-time timeline grouped by date with calendar markers, sorted by time
- Expand-in-place detail view with edit and delete
- Server-side search (Cloud Function) with instant client-side pre-filtering
- Audio recording with server-side transcription (Claude API)
- Image resize on client (canvas, max 1920px) and server (sharp, max 1200px)
- PWA — installable on mobile/desktop, standalone mode
- Firestore offline persistence
- Claim-based data isolation (nanoid per user, enforced in security rules)
- Auth with email/password, auto-provisioned project space
- E2E tests (Playwright)

## What I left out (and why)

- **"On This Day" resurfacing** — Emotionally powerful feature, but the timeline + search already prove the data model works. This is a query on eventDate month/day across years — straightforward to add, just didn't make the cut.
- **Multiple photos per memory** — Single image keeps the data model flat. Array of image URLs is the obvious next step but adds upload UX complexity.
- **Location capture** — Geolocation API is simple, but the UI to display/search by location is not. Deferred.
- **Sharing/social** — Explicitly out of scope. This is a private app.
- **Offline writes** — Firestore persistence handles offline reads. Offline writes technically work via Firestore's cache, but the Cloud Functions (image upload, audio) need connectivity. Didn't want to build optimistic UI that would lie about upload status.

## Assumptions

- **The user is the builder.** I'm building this for myself — one user, personal use. This shaped decisions like loading all memories via onSnapshot (fine for hundreds, not for millions) and using email/password auth (no OAuth complexity).
- **A memory is not a note.** Notes are structured, actionable, organizational. A memory is a moment — it has emotional weight. That's why mood exists as a first-class field, why people are tracked ("who was I with"), and why the eventDate is separate from createdAt (you might capture a memory days later).
- **Text is the only required field.** Everything else is enrichment. If creating a memory feels like filling out a form, people stop using it.
- **Search matters from day one.** The brief says "searchable" twice. Even with the time constraint, search needed to be server-side with a real endpoint — not just a client-side filter that won't scale.

## How I built this

I used Claude Code (Anthropic's CLI agent) as my primary development tool. The workflow:

1. **Discussion first** — Started with a conversation about the data model, UI layout, and feature priorities before writing any code. Documented decisions in `.planning/` files.
2. **Parallel agents** — Used Claude Code's subagent system to build independent pieces simultaneously (types/mock data, timeline component, composer/search bar). Then wired them together.
3. **Iterative verification** — Used the Chrome browser automation to visually verify features as they were built, then generated e2e tests from what was observed.
4. **Custom skills** — Built reusable slash commands (`/verify-and-test`, `/verify-readme`, `/create-test`) to standardize workflows across sessions.

Multiple Claude Code sessions ran in parallel — one handled auth/infrastructure, another handled the memory CRUD and UI, a third handled testing.

## Architecture decisions

### Data isolation via custom claims

Each user gets a nanoid project key set as a Firebase custom claim on signup. All their data lives under `project/{claimKey}/memories/`. Firestore security rules enforce that `request.auth.token.projectKey == projectKey`. This means:
- No server-side middleware needed for auth — rules handle it
- Clean per-user data partitioning
- Scales to multi-tenant without restructuring

### Search: honest tradeoffs

Firestore doesn't do full-text search. I had three options:

1. Client-side only — works since onSnapshot loads everything, but conceptually wrong
2. Algolia/Typesense — proper solution, but adds infrastructure for a 3-hour assignment
3. Cloud Function that reads all docs and filters in-memory — honest, documented, works for the scale

I went with option 3, but designed the contract for option 2: the function returns **only matching document IDs**, not full documents. The client already holds the data via its listener and filters locally by those IDs. When the listener is eventually paginated (only loading recent memories), the search endpoint is the only path to the full dataset — and it already works that way.

The limitation is documented in the code with `KNOWN BUG / TIME HACK` comments. In production, I'd sync to Typesense via Firestore triggers and swap the Cloud Function implementation — the client contract stays identical.

### eventDate vs createdAt

A memory might be captured days after it happened. The timeline sorts by `eventDate` (which defaults to `createdAt` when not set). This is a small data model decision with big UX impact — without it, a memory captured on Monday about something that happened Friday would appear in the wrong place.

### Mood as a number

Mood is stored as an integer (1-5), not an emoji string. The UI maps numbers to emojis. This means:
- The data layer is clean and queryable (e.g. "show me all memories where mood >= 4")
- The emoji mapping can change without a data migration
- Analytics can average mood over time

### Image pipeline

Phone cameras produce 5-12MB photos. The pipeline:
1. Client resizes via canvas to max 1920px, JPEG 82% quality (~200-500KB)
2. Base64 encoded, sent to Cloud Function
3. Cloud Function resizes again to max 1200px via sharp, uploads to Storage
4. Served via Firebase Hosting CDN with 1-year cache headers

Two resize steps because the client resize catches the biggest wins (10MB → 500KB) while the server ensures consistency regardless of client.

## What I'd tackle next

With a full day:
1. **"On This Day"** — Query memories matching today's month/day from previous years. Show as a banner above the timeline. This is the emotional hook that makes people glad they captured memories.
2. **Typesense search** — Replace the in-memory Cloud Function with a real search engine synced via Firestore triggers.
3. **Paginated timeline** — onSnapshot with a limit, infinite scroll, search reaching beyond the loaded window.
4. **Location** — Capture coordinates on creation, show on a map in the detail view.

With a week:
5. **Multiple photos** with a swipeable gallery
6. **Smart tags** — Auto-suggest tags from text content
7. **Export** — Download all memories as JSON or PDF
8. **Richer voice memos** — Inline waveform player, better recording UX

## Domain reflection

This problem space is genuinely interesting to me. Memory apps live at the intersection of personal data, emotional design, and retrieval — which means every technical decision has a UX consequence. The eventDate/createdAt split, the mood-as-number decision, the search architecture — none of these are purely technical. They're product decisions expressed in code. That's the kind of work I find most engaging.
