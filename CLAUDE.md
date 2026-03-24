<!-- GSD:project-start source:PROJECT.md -->
## Project

**MyTimes**

A personal memory app where users capture moments, thoughts, experiences, photos, and links — then revisit them over time. Data isolation is driven by Firebase custom claims: each user gets a nanoid-based project key set as a custom claim on signup, and all their data lives under `project/{claimKey}/data/`. Security rules enforce that users can only access their own data.

**Core Value:** Users can effortlessly capture a memory in the moment and rediscover it later — the act of saving and finding again must feel instant and personal.

### Constraints

- **Tech stack**: Vite + React (TypeScript) + shadcn + Firebase — non-negotiable
- **Timeline**: 3 hours — ship fast, cut scope aggressively
- **Auth**: Firebase Auth with email/password + custom claims for data isolation
- **Flow**: Sign up → "Create Project" → Cloud Function sets nanoid claim → start using app
- **Data model**: `project/{nanoidKey}/data/...` — claim-based security rules
- **Deploys**: Firebase deploys are allowed for this project (override of global no-deploy rule)
<!-- GSD:project-end -->

<!-- GSD:stack-start source:STACK.md -->
## Technology Stack

Technology stack not yet documented. Will populate after codebase mapping or first phase.
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
