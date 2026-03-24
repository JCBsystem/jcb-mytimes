# MyTimes

## What This Is

A personal memory app where users capture moments, thoughts, experiences, photos, and links — then revisit them over time. It's a private, searchable log of things that mattered to you. Each memory carries emotional context through mood tags, making revisiting feel personal rather than clinical.

## Core Value

Users can effortlessly capture a memory in the moment and rediscover it later — the act of saving and finding again must feel instant and personal.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Firebase Auth with email/password and Google login
- [ ] Create rich memories: text, photos, links, location, tags
- [ ] Attach mood/emoji to each memory
- [ ] Upload images to Firebase Storage
- [ ] Store memory data in Firestore
- [ ] Browse memories in a chronological timeline feed
- [ ] Full-text search across all memories
- [ ] Tag/categorize memories with user-applied labels
- [ ] "On this day" / random memory resurfacing
- [ ] Responsive design (works on mobile and desktop)

### Out of Scope

- Sharing/social features — this is a private, personal app
- Collaborative memories — single-user ownership per memory
- Video uploads — high storage cost, defer to future
- AI-powered search/summarization — keep v1 simple
- Native mobile app — web-first with responsive design
- Offline support — requires service workers, defer to v2

## Context

- **Stack:** Vite + vanilla React + shadcn/ui + Firebase (Auth, Firestore, Storage)
- **Target:** Personal use — the user is both builder and primary user
- **Inspiration:** The feeling of stumbling on an old photo or journal entry — that spark of "oh, I remember this"
- **Design direction:** Warm, personal, minimal — not a productivity tool aesthetic

## Constraints

- **Tech stack**: Vite + React + shadcn + Firebase — chosen, non-negotiable
- **Scope**: Small but meaningful slice — this is a focused build, not a full product
- **Storage**: Firebase Storage for images, Firestore for structured data
- **Auth**: Firebase Auth — each user gets private, isolated memories

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Firebase as full backend | Single platform for auth, database, storage — minimal backend code | — Pending |
| Rich memories over minimal | User wants text + photos + links + location + tags + mood | — Pending |
| All four discovery modes | Timeline, search, tags, and resurfacing all in v1 | — Pending |
| Responsive from start | Memories happen on the go — can't be desktop-only | — Pending |

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
*Last updated: 2026-03-24 after initialization*
