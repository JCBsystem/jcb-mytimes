---
phase: 02-memory-crud-real-time-feed
plan: 01
subsystem: ui
tags: [react, typescript, tailwind, firebase-functions, media-recorder, composer]

# Dependency graph
requires:
  - phase: 01-foundation-auth
    provides: Auth infrastructure, MemoriesProvider with onSnapshot, createMemory/deleteMemory
provides:
  - MoodPicker component (1-5 emoji scale)
  - TagInput component (chip input with suggestions)
  - PeopleInput component (chip input for people names)
  - AudioRecorder component (MediaRecorder-based capture)
  - uploadAudioToMemory function (httpsCallable wrapper)
  - Enhanced BottomBar with expand row and all sub-components wired
  - allTags computed from existing memories for tag suggestions
affects: [02-02, discovery, polish]

# Tech tracking
tech-stack:
  added: []
  patterns: [expand-row-composer, chip-input, audio-capture-then-upload, pending-audio-buffer]

key-files:
  created:
    - web/src/components/MoodPicker.tsx
    - web/src/components/TagInput.tsx
    - web/src/components/PeopleInput.tsx
    - web/src/components/AudioRecorder.tsx
  modified:
    - web/src/components/BottomBar.tsx
    - web/src/lib/memories.ts
    - web/src/App.tsx

key-decisions:
  - "AudioRecorder is pure capture component -- upload handled by BottomBar after memory creation"
  - "Audio buffered as pendingAudio state, uploaded via uploadAudioToMemory after memoryId exists"
  - "Tag suggestions derived from existing memories via useMemo in AppShell"

patterns-established:
  - "Expand-row pattern: + button toggles extras above input row, rotate-45 turns + into x"
  - "Chip input pattern: Enter/comma to create, Backspace to delete last, X button per chip"
  - "Capture-then-upload: AudioRecorder only records, caller handles upload after memory exists"

requirements-completed: [MEM-01, MEM-02, MEM-03, MEM-04, RT-01]

# Metrics
duration: 3min
completed: 2026-03-24
---

# Phase 02 Plan 01: Composer Sub-components Summary

**Rich BottomBar composer with expand row for mood, tags, people, date override, and audio recording via MediaRecorder -- all wired through to Firestore create flow with real-time feed updates**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-24T14:23:31Z
- **Completed:** 2026-03-24T14:26:44Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments
- Built 4 sub-components: MoodPicker (5-emoji scale), TagInput (chip input with suggestions), PeopleInput (chip input), AudioRecorder (MediaRecorder capture)
- Enhanced BottomBar with + toggle expand row revealing mood, tags, people, and date override inputs
- Wired audio recording buffer and upload flow: AudioRecorder captures, BottomBar uploads via uploadAudioToMemory after memory creation
- Tag suggestions computed from existing memories via useMemo, passed through allTags prop
- Confirmed RT-01: MemoriesProvider wrapping AppShell with onSnapshot real-time listener remains active

## Task Commits

Each task was committed atomically:

1. **Task 1: Create sub-components and uploadAudioToMemory helper** - `537c7b3` (feat)
2. **Task 2: Enhance BottomBar with expand row, wire sub-components, update AppShell** - `d52e513` (feat)

## Files Created/Modified
- `web/src/components/MoodPicker.tsx` - 5-emoji mood selector with toggle on/off
- `web/src/components/TagInput.tsx` - Chip input with Enter/comma creation, suggestion filtering from allTags
- `web/src/components/PeopleInput.tsx` - Chip input for people names
- `web/src/components/AudioRecorder.tsx` - MediaRecorder-based mic capture, pure component
- `web/src/lib/memories.ts` - Added uploadAudioToMemory httpsCallable wrapper
- `web/src/components/BottomBar.tsx` - Full rewrite with expand row, all sub-components, audio buffer
- `web/src/App.tsx` - Added useMemo allTags, expanded handleSend signature, passes allTags to BottomBar

## Decisions Made
- AudioRecorder is a pure capture component with only `onRecorded` callback -- no memoryId or projectKey props. Upload responsibility stays with BottomBar's handleSend, which calls uploadAudioToMemory after the memory is created and has an ID.
- Audio is buffered as `pendingAudio` state in BottomBar rather than streamed, since we need the memoryId first.
- Tag suggestions are computed from all existing memories' tags via useMemo in AppShell, providing a simple frequency-agnostic suggestion list.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Known Stubs
None - all components are fully wired with real data sources.

## Next Phase Readiness
- Composer is complete with all optional fields flowing through to Firestore
- Ready for Plan 02: expand detail view, delete, and any remaining CRUD
- Real-time updates confirmed active via onSnapshot in MemoriesProvider

## Self-Check: PASSED

All 7 files verified present. Both task commits (537c7b3, d52e513) verified in git log.

---
*Phase: 02-memory-crud-real-time-feed*
*Completed: 2026-03-24*
