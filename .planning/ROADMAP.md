# Roadmap: MyTimes

## Overview

MyTimes goes from zero to a working personal memory app in three phases. Phase 1 establishes the foundation: project scaffolding, Firebase Auth with email/password, a callable Cloud Function that generates a nanoid project key and sets it as a custom claim when the user clicks "Create Project", and security rules that lock data to the claim owner. Phase 2 delivers the core value: creating, editing, deleting, and viewing memories with photos, tags, moods, and links -- all powered by real-time Firestore onSnapshot listeners. Phase 3 adds discovery (search, tag filtering, on-this-day) and the warm, responsive visual design that makes the app feel personal.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation & Auth** - Project setup, Firebase Auth with email/password, "Create Project" callable Cloud Function (nanoid claims), security rules
- [ ] **Phase 2: Memory CRUD & Real-time Feed** - Create/edit/delete memories with all fields, photo upload, real-time timeline and detail view
- [ ] **Phase 3: Discovery & Polish** - Search, tag filtering, on-this-day, responsive layout, warm visual design

## Phase Details

### Phase 1: Foundation & Auth
**Goal**: Users can sign up with email/password, create a project (which provisions their nanoid claim), and have a secure, isolated data space
**Depends on**: Nothing (first phase)
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05
**Success Criteria** (what must be TRUE):
  1. User can sign up with email/password and log in
  2. Firebase Auth persistence survives browser refresh (no manual session code)
  3. User can log out and be returned to a sign-in screen
  4. User clicks "Create Project" → callable Cloud Function generates nanoid, sets custom claim, user can proceed
  5. Security rules reject any request where the user's claim key does not match the data path (`project/{claimKey}/...`)
**Plans**: TBD

Plans:
- [ ] 01-01: Project scaffolding, Firebase config, Auth + Claims Cloud Function
- [ ] 01-02: Firestore security rules and data isolation verification

### Phase 2: Memory CRUD & Real-time Feed
**Goal**: Users can capture memories with text, photos, tags, moods, and links, then see them appear instantly in a live timeline
**Depends on**: Phase 1
**Requirements**: MEM-01, MEM-02, MEM-03, MEM-04, MEM-05, MEM-06, MEM-07, RT-01, BROWSE-01, BROWSE-02
**Success Criteria** (what must be TRUE):
  1. User can create a memory with text, and optionally attach a photo, tags, mood, and link
  2. User can edit any field of an existing memory and see changes reflected immediately
  3. User can delete a memory and have it disappear from the timeline without refresh
  4. Photos upload to Firebase Storage and display inline in the memory
  5. Timeline feed updates in real-time (new/edited/deleted memories appear without page reload)
**Plans**: TBD

Plans:
- [ ] 02-01: Memory data model, create/edit/delete operations, photo upload to Storage
- [ ] 02-02: Real-time listeners, timeline feed, memory detail view

**UI hint**: yes

### Phase 3: Discovery & Polish
**Goal**: Users can find past memories through search, tags, and on-this-day, all within a warm, responsive design
**Depends on**: Phase 2
**Requirements**: DISC-01, DISC-02, DISC-03, UI-01, UI-02
**Success Criteria** (what must be TRUE):
  1. User can search memories by text and see matching results
  2. User can filter the timeline by selecting a tag
  3. User sees an "On This Day" section showing memories from the same calendar date in previous years
  4. App layout is usable and attractive on both mobile (375px) and desktop (1440px)
  5. Visual design feels warm and personal, not corporate or sterile
**Plans**: TBD

Plans:
- [ ] 03-01: Search, tag filter, on-this-day feature
- [ ] 03-02: Responsive layout and warm visual design pass

**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Auth | 0/2 | Not started | - |
| 2. Memory CRUD & Real-time Feed | 0/2 | Not started | - |
| 3. Discovery & Polish | 0/2 | Not started | - |
