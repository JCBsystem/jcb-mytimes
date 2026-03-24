# UI Concept

**Defined:** 2026-03-24
**Status:** Agreed in discussion, not yet implemented

## Core Principle

Single-screen app. The three core features live on one screen: search, timeline, and create. No page navigation for core flow.

## Layout

### Search — Top Bar
- Search input at the top of the screen
- Client-side instant filtering on loaded memories
- Filters by text content

### Timeline
- Vertical scroll of memories, grouped by date, sorted by time within each group (most recent first)
- Date section headers: friendly labels ("Today", "Yesterday", "March 20")
- Adaptive rows: text-only memories are compact (1-2 lines), memories with images get more visual space
- Each memory shows: text, time, mood, tags, people
- Image displayed inline if present
- Tap/click a memory to expand full detail or edit

### Create Memory — Bottom Bar
- Pinned bottom bar, always visible (chat-composer style)
- Text input + attach image button + send button
- Expands or opens a sheet for optional fields (tags, people, mood, eventDate)
- Text field is the primary input — type and send for fastest capture
- No modal or page navigation needed

## Design Direction

- Warm, personal, minimal
- Not corporate, not productivity-app
- Friendly date formatting ("3 months ago", "last March")
- Generous whitespace
- Mobile-first, responsive to desktop

## Screen Structure (top to bottom)

1. **Search bar** — top
2. **Timeline** — scrollable middle, grouped by date
3. **Bottom bar** — pinned create composer

## Decided

- Single-screen app: search + timeline + create
- Timeline grouped by date, sorted by time within each date
- Adaptive rows — not uniform cards, not a flat list
- Date headers use friendly labels
- Bottom bar composer for creation
- Search at top, client-side filtering

## Open / Deferred

- "On This Day" — deferred, not part of core screen
- Tag filtering — deferred
