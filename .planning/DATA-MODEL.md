# Data Model: Memory

**Defined:** 2026-03-24
**Status:** Agreed in discussion, not yet implemented

## Memory Object

| Field       | Type     | Required | Notes                                      |
|-------------|----------|----------|--------------------------------------------|
| text        | string   | yes      | Core content of the memory                 |
| createdAt   | datetime | yes      | Auto-generated, UTC                        |
| updatedAt   | datetime | yes      | Auto-generated on every edit, UTC          |
| eventDate   | datetime | yes      | User-set; defaults to createdAt if not provided, UTC |
| image       | string   | no       | Single image (Firebase Storage URL)        |
| people      | string[] | no       | Free-text names of people involved         |
| tags        | string[] | no       | User-applied tags for filtering            |
| mood        | number   | no       | Numeric value, maps to emoji in UI later   |
| audioUrl    | string   | no       | Voice recording (Firebase Storage URL)     |
| transcript  | string   | no       | Transcription of the audio recording       |

## Design Decisions

- **Text is the only required input.** Creation should feel instant — one field, hit save.
- **eventDate vs createdAt:** A memory might be captured days after it happened. eventDate lets the user backdate. Timeline sorts by eventDate.
- **Mood as number:** Keeps data layer clean. UI can map numbers to emojis without migrating data later.
- **Image:** Single photo per memory for v1. Multiple photos deferred to v2.
- **People:** Free-text names, not structured contacts. Enables filtering like "show me all memories with Sarah."
- **Audio:** audioUrl stores the recording path, transcript stores the text version. Transcript can be populated later (e.g. via a Cloud Function or client-side API). Search should include transcript text.

## Firestore Path

```
project/{claimKey}/data/memories/{memoryId}
```

## Timeline Sort Order

Sort by `eventDate` descending. Since eventDate defaults to createdAt when not set, all memories have a usable sort date.
