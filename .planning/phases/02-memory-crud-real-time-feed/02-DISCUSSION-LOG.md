# Phase 2: Memory CRUD & Real-time Feed - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-24
**Phase:** 02-memory-crud-real-time-feed
**Areas discussed:** Composer extras, Delete interaction, Detail view, Audio recording

---

## Composer Extras

### How should extra fields be accessed?

| Option | Description | Selected |
|--------|-------------|----------|
| Expand row | "+" button reveals second row with tags, mood, people, date | ✓ |
| Bottom sheet modal | Slide-up modal with form for all extra fields | |
| Inline hashtag parsing | Type #tag and @person in text, parsed on send | |

**User's choice:** Expand row
**Notes:** Aligns with UI-CONCEPT.md which says "Expands or opens a sheet for optional fields"

### How should the mood picker work?

| Option | Description | Selected |
|--------|-------------|----------|
| 1-5 emoji scale | Row of 5 emojis, tap to select/deselect | ✓ |
| Numeric slider | Drag slider 1-10 | |
| Free emoji picker | Full emoji palette | |

**User's choice:** 1-5 emoji scale
**Notes:** None

### How should tags be entered?

| Option | Description | Selected |
|--------|-------------|----------|
| Free-text chips | Type + Enter/comma, recent tags as suggestions | ✓ |
| Predefined + custom | Common tags as quick-tap + custom text field | |
| You decide | Claude picks | |

**User's choice:** Free-text chips
**Notes:** None

---

## Delete Interaction

| Option | Description | Selected |
|--------|-------------|----------|
| Swipe left | Swipe to reveal red delete button | |
| Trash icon in detail view | Delete only from expanded view | ✓ |
| Long-press menu | Context menu with Delete | |
| You decide | Claude picks | |

**User's choice:** Trash icon in detail view
**Notes:** User emphasized this is a web app — no swipe gestures

---

## Detail View

| Option | Description | Selected |
|--------|-------------|----------|
| Expand in-place | Click to expand row with full content + trash | ✓ |
| Full-screen overlay | Modal overlay for memory detail | |
| Slide-in panel | Side panel (desktop) or bottom sheet (mobile) | |

**User's choice:** Expand in-place
**Notes:** Stays on single screen per UI-CONCEPT.md. Web app — click interactions, not swipe.

---

## Audio Recording

| Option | Description | Selected |
|--------|-------------|----------|
| Build now | Mic button in BottomBar, MediaRecorder API, uses existing Cloud Functions | ✓ |
| Defer to Phase 3 | Skip audio UI, focus on text/image/tags/mood | |
| You decide | Claude judges fit | |

**User's choice:** Build now
**Notes:** Backend (uploadAudio + transcribeMemory Cloud Functions) already built. Only client-side recording UI needed.

---

## Claude's Discretion

- Animation/transition style for expand/collapse
- Exact emoji set for mood scale
- Tag suggestion algorithm
- Audio recording indicator style
- Confirmation dialog design

## Deferred Ideas

- MEM-05 (links as separate field) — links can live in text content
- MEM-06 (edit memory) — delete sufficient for v1
- "On This Day" — Phase 3
- Tag filtering — Phase 3
