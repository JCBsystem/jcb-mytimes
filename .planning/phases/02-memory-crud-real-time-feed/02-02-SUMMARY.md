---
phase: 02-memory-crud-real-time-feed
plan: 02
subsystem: ui
tags: [react, typescript, tailwind, lucide-react, dayjs, confirm-dialog, expand-in-place]

# Dependency graph
requires:
  - phase: 02-memory-crud-real-time-feed
    provides: BottomBar composer, MemoriesProvider with create/remove, Timeline with date grouping
provides:
  - ConfirmDialog reusable component with backdrop dismiss
  - MemoryRow expand-in-place detail view with full metadata, audio player, transcript
  - Delete with confirmation wired through to Firestore remove()
  - MOOD_EMOJI mapping (1-5 scale) replacing raw numbers in compact and expanded views
  - Click-outside-to-collapse expand behavior in Timeline
affects: [discovery, polish, 03-01, 03-02]

# Tech tracking
tech-stack:
  added: []
  patterns: [expand-in-place-detail, confirm-before-delete, mood-emoji-mapping, click-outside-collapse]

key-files:
  created:
    - web/src/components/ConfirmDialog.tsx
  modified:
    - web/src/components/MemoryRow.tsx
    - web/src/components/Timeline.tsx
    - web/src/App.tsx

key-decisions:
  - "Expand-in-place pattern: single expandedId state in Timeline, click toggles, click outside collapses"
  - "ConfirmDialog as standalone component (not shadcn AlertDialog) for simplicity and full control"
  - "MOOD_EMOJI mapping at module level for reuse in both compact and expanded views"
  - "Audio/transcript field mapping: handles Firestore voice/transcribedText to Memory audioUrl/transcript"

patterns-established:
  - "Expand-in-place: expandedId state in parent, isExpanded/onToggle props to child row"
  - "Confirm-before-delete: showConfirm local state in row, ConfirmDialog renders inline"
  - "Mood display: MOOD_EMOJI record maps 1-5 to emoji, used everywhere mood appears"

requirements-completed: [MEM-07, BROWSE-01, BROWSE-02]

# Metrics
duration: 5min
completed: 2026-03-24
---

# Phase 02 Plan 02: Expand Detail View & Delete Summary

**Expand-in-place memory detail view with full metadata display, MOOD_EMOJI mapping, audio player, and delete-with-confirmation dialog wired through Firestore remove()**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-24T14:31:00Z
- **Completed:** 2026-03-24T14:49:56Z
- **Tasks:** 2 (1 auto + 1 human-verify checkpoint)
- **Files modified:** 4

## Accomplishments
- Built ConfirmDialog component with backdrop overlay, destructive confirm button, and click-outside dismiss
- Rewrote MemoryRow with dual collapsed/expanded modes: compact rows with line-clamp and full detail view with all metadata, audio player, transcript, and trash icon
- Added MOOD_EMOJI mapping (1=sad through 5=star-eyes) replacing raw mood numbers in both compact and expanded views
- Wired delete flow: trash icon in expanded view triggers ConfirmDialog, confirm calls remove() from MemoriesContext, memory disappears via onSnapshot real-time listener
- Added expandedId state management in Timeline with click-outside-to-collapse behavior
- Human verification passed all test scenarios: create, expand, delete, audio recording

## Task Commits

Each task was committed atomically:

1. **Task 1: Create ConfirmDialog, enhance MemoryRow with expand-in-place detail view, update Timeline/AppShell wiring** - `8a9c393` (feat)
2. **Task 2: Verify full memory flow end-to-end** - checkpoint:human-verify (approved)

**Plan metadata:** (pending - docs commit)

## Files Created/Modified
- `web/src/components/ConfirmDialog.tsx` - Reusable confirmation dialog with backdrop dismiss and destructive action button
- `web/src/components/MemoryRow.tsx` - Expanded from simple row to dual-mode component with collapsed/expanded views, trash icon, audio player, transcript display
- `web/src/components/Timeline.tsx` - Added expandedId state, onToggle/onDelete prop passthrough, click-outside-to-collapse
- `web/src/App.tsx` - Wired handleDelete through to Timeline, added data-testid for dashboard view

## Decisions Made
- Used a standalone ConfirmDialog component rather than shadcn AlertDialog for full control over backdrop and styling without additional dependencies.
- Expand-in-place uses a single expandedId state in Timeline (only one memory expanded at a time) rather than per-row state, keeping the mental model simple.
- MOOD_EMOJI mapping defined at module level as a Record<number, string> for type safety and reuse.
- Audio player uses native HTML5 `<audio controls>` element, no third-party audio library needed.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Known Stubs
None - all components are fully wired with real data sources.

## Next Phase Readiness
- Phase 02 (Memory CRUD & Real-time Feed) is now complete with all 8 success criteria met
- Full memory lifecycle: create (with all optional fields), browse (date-grouped timeline), view detail (expand-in-place), delete (with confirmation)
- Real-time updates active via onSnapshot throughout
- Ready for Phase 03: Discovery & Polish (search, tag filter, on-this-day, responsive design)

## Self-Check: PASSED

All 4 files verified present. Task commit (8a9c393) verified in git log. SUMMARY.md created successfully.

---
*Phase: 02-memory-crud-real-time-feed*
*Completed: 2026-03-24*
