# Phase 2: Memory CRUD & Real-time Feed - Context

**Gathered:** 2026-03-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can capture memories via a bottom-bar composer (text, image, tags, mood, people, eventDate, audio recording) and browse them in a date-grouped timeline on a single screen. Tap to expand a memory in-place for full detail and delete. Real-time updates via onSnapshot.

</domain>

<decisions>
## Implementation Decisions

### Composer Extras
- **D-01:** Expand row pattern — a "+" button next to the text input reveals a second row above with tags, mood, people, and date override inputs. Default state stays clean (just text + image + send).
- **D-02:** Mood picker — 1-5 emoji scale row (e.g. 😞 😐 🙂 😄 🤩). Tap to select, tap again to deselect.
- **D-03:** Tags — free-text chip input. Type a tag, press Enter or comma to create a chip. Show recent/used tags as suggestions below the input.

### Delete Interaction
- **D-04:** Delete only from expanded detail view. Trash icon visible in the expanded memory card. Confirmation dialog before delete.

### Detail View
- **D-05:** Expand in-place. Click a memory row to smoothly expand it showing: full text (no line-clamp), full-size image, all metadata (time, date, mood emoji, people, tags), audio player if present, and trash icon. Click again or click outside to collapse. No page navigation — stays on single screen.

### Audio Recording
- **D-06:** Build client-side recording UI in this phase. Mic button in the BottomBar (alongside image button). Uses browser MediaRecorder API. Records audio, uploads via existing `uploadAudio` Cloud Function (base64), `transcribeMemory` Cloud Function auto-triggers on Firestore write. Transcript displays in the expanded memory detail view.

### Claude's Discretion
- Animation/transition style for expand/collapse
- Exact emoji set for mood scale
- Tag suggestion algorithm (frequency-based vs recent-first)
- Audio recording indicator/waveform style
- Confirmation dialog design for delete

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Data Model
- `.planning/DATA-MODEL.md` — Memory object schema, field types, design decisions (text-only required, eventDate vs createdAt, mood as number, single image, audio+transcript)

### UI Concept
- `.planning/UI-CONCEPT.md` — Single-screen layout (search top, timeline middle, composer bottom), adaptive rows, design direction (warm/personal/minimal)

### Phase 1 Plans (for integration context)
- `.planning/phases/01-foundation-auth/01-01-PLAN.md` — Auth infrastructure, hooks, UI components, routing
- `.planning/phases/01-foundation-auth/01-02-PLAN.md` — Firestore security rules

### Requirements
- `.planning/REQUIREMENTS.md` — MEM-01 through MEM-07, RT-01, BROWSE-01, BROWSE-02 mapped to Phase 2

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `web/src/types/memory.ts` — Memory interface already defined with all fields
- `web/src/lib/memories.ts` — `createMemory()` and `deleteMemory()` Firestore operations, `uploadImage()` for Storage
- `web/src/hooks/useMemories.ts` — `onSnapshot` real-time listener, ordered by eventDate desc
- `web/src/lib/memories-context.tsx` — React context wrapping create/remove operations
- `web/src/lib/date-utils.ts` — `formatDateHeader()`, `formatTime()`, `groupMemoriesByDate()` using dayjs
- `web/src/components/ui/button.tsx` — shadcn Button component
- `web/src/components/ui/toast.tsx` — Toast notifications
- `functions/src/uploadAudio.ts` — Cloud Function: base64 audio → Firebase Storage, updates Firestore doc with voiceUrl
- `functions/src/transcribeMemory.ts` — Cloud Function: Firestore trigger on voice field, downloads audio → Claude API transcription → writes transcribedText

### Established Patterns
- shadcn/ui for UI components (Button, Toast)
- Tailwind CSS with stone color palette for warm feel
- `useAuth()` hook provides `projectKey` for all Firestore paths
- Context providers pattern (MemoriesProvider wraps authenticated shell)
- Lucide icons (ArrowUp, ImagePlus, X, Search already in use)
- Fixed header + fixed bottom bar + scrollable middle content

### Integration Points
- `BottomBar.tsx` — needs expand row, mood picker, tags input, people input, date picker, mic button
- `MemoryRow.tsx` — needs click-to-expand behavior with full detail view + trash icon
- `AppShell` in `App.tsx` — currently wires SearchBar + Timeline + BottomBar
- `memories-context.tsx` — `create()` already accepts tags, mood, people, eventDate — just needs BottomBar to pass them
- `memories.ts` — `createMemory()` already handles all optional fields

</code_context>

<specifics>
## Specific Ideas

- This is a **web app** — no native mobile gestures (no swipe-to-delete). Click-based interactions.
- The BottomBar expand row should feel like a chat composer with extras — similar to how messaging apps reveal formatting/attachment options.
- Mood emoji scale should be visually warm and friendly, not clinical.
- Tag chips should be small, rounded, stone-toned (matching existing `MemoryRow` tag style).

</specifics>

<deferred>
## Deferred Ideas

- MEM-05 (links as separate field) — links can live in text content for v1
- MEM-06 (edit memory) — delete is sufficient for v1
- Audio transcription population — Cloud Function exists, client just needs to display `transcribedText` field
- "On This Day" — Phase 3
- Tag filtering — Phase 3
- Multiple photos per memory — v2

</deferred>

---

*Phase: 02-memory-crud-real-time-feed*
*Context gathered: 2026-03-24*
