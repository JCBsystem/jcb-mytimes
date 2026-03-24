# Requirements: MyTimes

**Defined:** 2026-03-24
**Core Value:** Effortlessly capture a memory and rediscover it later

## v1 Requirements

### Auth & Data Isolation

- [ ] **AUTH-01**: User can sign up and log in with Google (Firebase Auth)
- [ ] **AUTH-02**: User session persists across browser refresh
- [ ] **AUTH-03**: User can log out
- [ ] **AUTH-04**: Cloud Function generates nanoid key and sets it as custom claim on user creation
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

- **AUTH-06**: Email/password login option

## Out of Scope

| Feature | Reason |
|---------|--------|
| Sharing/social | Private app — personal memories only |
| Video uploads | Storage cost, complexity — defer to v2+ |
| AI search/summarization | Complexity — keep v1 simple |
| Offline support | Service workers add complexity — defer |
| Native mobile | Web-first, responsive covers mobile |
| Location capture | Geolocation API adds scope — defer to v2 |
| Email/password auth | Google-only for v1 speed |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | - | Pending |
| AUTH-02 | - | Pending |
| AUTH-03 | - | Pending |
| AUTH-04 | - | Pending |
| AUTH-05 | - | Pending |
| MEM-01 | - | Pending |
| MEM-02 | - | Pending |
| MEM-03 | - | Pending |
| MEM-04 | - | Pending |
| MEM-05 | - | Pending |
| MEM-06 | - | Pending |
| MEM-07 | - | Pending |
| RT-01 | - | Pending |
| BROWSE-01 | - | Pending |
| BROWSE-02 | - | Pending |
| DISC-01 | - | Pending |
| DISC-02 | - | Pending |
| DISC-03 | - | Pending |
| UI-01 | - | Pending |
| UI-02 | - | Pending |

**Coverage:**
- v1 requirements: 20 total
- Mapped to phases: 0
- Unmapped: 20 ⚠️

---
*Requirements defined: 2026-03-24*
*Last updated: 2026-03-24 after claims architecture + realtime listeners*
