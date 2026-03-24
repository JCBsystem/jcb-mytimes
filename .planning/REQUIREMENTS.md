# Requirements: MyTimes

**Defined:** 2026-03-24
**Core Value:** Effortlessly capture a memory and rediscover it later

## v1 Requirements

### Auth & Data Isolation

- [x] **AUTH-01**: User can sign up with email/password (Firebase Auth)
- [x] **AUTH-02**: User can log in with email/password
- [x] **AUTH-03**: User can log out
- [x] **AUTH-04**: User clicks "Create Project" → callable Cloud Function generates nanoid key and sets it as custom claim
- [ ] **AUTH-05**: Firestore security rules enforce claim-based data isolation (`project/{claimKey}/...`)

### Memory CRUD

- [ ] **MEM-01**: User can create a memory with text content
- [ ] **MEM-02**: User can attach a photo to a memory (Firebase Storage upload)
- [ ] **MEM-03**: User can add tags to a memory
- [ ] **MEM-04**: User can attach a mood/emoji to a memory
- [ ] **MEM-05**: User can add a link to a memory
- [ ] **MEM-06**: User can edit an existing memory
- [ ] **MEM-07**: User can delete a memory

### Real-time & Browsing

- [ ] **RT-01**: Firestore onSnapshot listeners at collection level for real-time updates
- [ ] **BROWSE-01**: User can view memories in a chronological timeline feed
- [ ] **BROWSE-02**: User can click a memory to see its full detail

### Discovery

- [ ] **DISC-01**: User can search memories by text content
- [ ] **DISC-02**: User can filter memories by tag
- [ ] **DISC-03**: User sees an "On This Day" section showing memories from the same date in previous years

### Design

- [ ] **UI-01**: Responsive layout works on mobile and desktop
- [ ] **UI-02**: Warm, personal visual design (not corporate/productivity)

## v2 Requirements

### Enhanced Media

- **MEDIA-01**: User can attach multiple photos to a memory
- **MEDIA-02**: User can add location data to a memory

### Discovery

- **DISC-04**: Random memory resurfacing ("surprise me")
- **DISC-05**: Full-text search with highlighting

### Auth

- **AUTH-06**: Google OAuth login option

## Out of Scope

| Feature | Reason |
|---------|--------|
| Sharing/social | Private app — personal memories only |
| Video uploads | Storage cost, complexity — defer to v2+ |
| AI search/summarization | Complexity — keep v1 simple |
| Offline support | Service workers add complexity — defer |
| Native mobile | Web-first, responsive covers mobile |
| Location capture | Geolocation API adds scope — defer to v2 |
| Google OAuth | Email/password only for v1 speed |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 1 | Complete |
| AUTH-02 | Phase 1 | Complete |
| AUTH-03 | Phase 1 | Complete |
| AUTH-04 | Phase 1 | Complete |
| AUTH-05 | Phase 1 | Pending |
| MEM-01 | Phase 2 | Pending |
| MEM-02 | Phase 2 | Pending |
| MEM-03 | Phase 2 | Pending |
| MEM-04 | Phase 2 | Pending |
| MEM-05 | Phase 2 | Pending |
| MEM-06 | Phase 2 | Pending |
| MEM-07 | Phase 2 | Pending |
| RT-01 | Phase 2 | Pending |
| BROWSE-01 | Phase 2 | Pending |
| BROWSE-02 | Phase 2 | Pending |
| DISC-01 | Phase 3 | Pending |
| DISC-02 | Phase 3 | Pending |
| DISC-03 | Phase 3 | Pending |
| UI-01 | Phase 3 | Pending |
| UI-02 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 20 total
- Mapped to phases: 20
- Unmapped: 0

---
*Requirements defined: 2026-03-24*
*Last updated: 2026-03-24 -- phase mappings added after roadmap creation*
