---
name: challenge-plan
description: Rigorously challenge a new feature idea through structured questioning to produce a clear, complete, and implementation-ready plan before any code is written.
disable-model-invocation: true
---

## What I do

- **Actively explore the codebase** before asking any question — search for existing patterns, similar files, relevant domain concepts, and potential conflicts
- **Propose concrete answers** to each question based on codebase evidence, then ask the user to validate, correct, or extend the proposal
- Challenge vague or contradictory answers and push for specifics until every decision is unambiguous
- Produce a **zero-ambiguity Structured Plan** that a developer or AI agent can pick up and implement immediately without needing any additional information

## When to use me

- A new feature, endpoint, domain concept, or significant refactoring is being proposed
- You want a second opinion before opening a PR or writing the first line of code
- A design review is needed but no reviewer is available

---

## Core operating principle: propose, then validate

**Never ask an open question if the codebase already contains enough signal to form a reasonable answer.**

For every question in the workflow below:

1. Search the relevant source files, existing patterns, naming conventions, and domain objects
2. Formulate a concrete proposal backed by evidence (file paths, existing class names, existing method signatures)
3. Present the proposal to the user as: *"Based on [evidence], I propose [concrete answer]. Does this match your intent, or do you want to change it?"*
4. Only ask a fully open question when the codebase provides no signal at all

This keeps the conversation short and the plan grounded in the actual code that exists.

---

## Workflow

Work through the five dimensions **in order**, completing each before moving on.
Do **not** skip a dimension even if the feature seems small.

Before starting Dimension 1, **read and internalize**:

- `docs/ARCHITECTURE.md` — layer rules, data-flow, DI patterns
- `AGENTS.md` — naming conventions, import rules, constraints
- The existing bounded context structure under `src/contexts/`
- The existing test structure under `tests/`

---

### Dimension 1 — Why (Purpose & Motivation)

Goal: establish the concrete problem being solved and why it matters now.

For each point below, search first, then propose:

1. **Problem statement**: Ask the user for a one-sentence description of the pain. If they gave a feature name or description when invoking the skill, extract the implied problem from it and propose it back.
2. **Duplication check**: Search the codebase for any existing feature, endpoint, or domain concept that could already solve the problem. List what you find, or explicitly confirm nothing equivalent exists.
3. **Simpler alternative**: Look at existing domain objects, Zod validators, and repository methods. Propose whether the need could be met by a config change, a query parameter, or a small data fix — or confirm that a new feature is genuinely required.
4. **Definition of done**: Propose a concrete, testable outcome sentence (e.g. "A `GET /questions/:id` returns 404 with `QuestionNotFoundError` JSON when the question does not exist"). Ask the user to confirm or refine it.
5. **Urgency**: Ask what happens if this is NOT built. Is there a workaround?

Acceptance criteria:

- Single-sentence problem statement confirmed by user
- Confirmed no equivalent already exists (with search evidence)
- Confirmed that a new feature is the right solution
- Testable definition of done agreed

---

### Dimension 2 — What (Scope & Boundaries)

Goal: nail down exactly what is in scope and what is explicitly out of scope.

For each point below, search first, then propose:

1. **Entities / value-objects to create**: Based on the feature description, propose new domain types with suggested names following existing naming patterns in `src/contexts/`. Show the user where analogous types live.
2. **Entities / value-objects to modify**: Search for domain objects that would need to change. List them with the specific fields or methods that would be added/removed/renamed.
3. **API surface**: Search existing controllers for the HTTP method and route pattern to use. Propose the full route path and HTTP verb. If a similar endpoint exists, show it.
4. **Database / schema change**: Search existing Mongoose schemas. Propose the schema delta (new field, new collection, or no change). Include the field type and any index.
5. **Cross-context impact**: Search `src/contexts/` and `src/shared/` for anything that would be affected. List the files.
6. **Explicit out-of-scope**: Based on the scope above, propose a list of related concerns that are deliberately deferred. Ask the user to confirm or add to it.

Acceptance criteria:

- In-scope list with layer assignment (domain / application / infrastructure) confirmed
- Out-of-scope list confirmed
- API route and HTTP verb agreed
- DB schema delta agreed (or "no schema change")

---

### Dimension 3 — Who (Actors & Consumers)

Goal: identify every actor that produces or consumes this feature.

For each point below, search first, then propose:

1. **Trigger actor**: Search existing guards, decorators, and controller annotations. Propose who calls this feature (authenticated user, public caller, internal service, cron job). Show the evidence.
2. **Authorization**: Search for existing `@UseGuards`, roles, or permission decorators in the same context. Propose whether the new endpoint needs the same guard or a different one.
3. **Downstream consumers**: Ask if any other service, frontend, or job will consume the output of this feature. If the codebase contains integration tests or Bruno collection files (`configs/bruno/`), check them for hints.
4. **Existing use-case / repository reuse**: Search for existing use-cases or repository methods that the new feature could delegate to or compose with. List candidates.

Acceptance criteria:

- Actor and trigger confirmed
- Authorization requirement explicitly stated (or explicitly "none")
- Reuse candidates confirmed or ruled out

---

### Dimension 4 — How (Design & Implementation)

Goal: validate the full technical approach and produce a complete, zero-ambiguity file list.

This is the most thorough dimension. Search extensively before proposing anything.

#### 4a — Data flow

Trace and propose the complete data flow following the hexagonal architecture:

```
HTTP Request
  → Controller method (propose method name and route decorator)
  → Zod DTO validation (propose DTO class name and shape, field by field)
  → Domain Command (propose command type name and fields)
  → UseCase.execute() (propose use-case class name)
  → Repository method (propose method name on the repository interface)
  → Domain entity returned (propose entity type name)
  → Response DTO mapped (propose response DTO class name and fields)
HTTP Response
```

For every step, reference the existing analogous file that the new file should mirror.

#### 4b — Complete file list

Produce a proposed file list covering **every** file that must be created or modified:

| File path                                           | Type    | Action | Mirrors                                             |
|-----------------------------------------------------|---------|--------|-----------------------------------------------------|
| `src/…/use-cases/create-foo/create-foo.use-case.ts` | UseCase | Create | `src/…/use-cases/create-bar/create-bar.use-case.ts` |
| …                                                   | …       | …      | …                                                   |

Include:

- Domain entity or value-object (`.types.ts`)
- Domain error(s) (`.errors.ts` — add to existing file or create new one?)
- Domain command (`.commands.ts`)
- Repository interface addition (`.repository.types.ts`)
- Mongoose repository implementation method
- Mongoose schema delta (`.schema.ts`) if needed
- Application DTO shapes (`.dto.shape.ts` and `.dto.ts`) — request and response separately
- Mapper(s)
- Use-case(s)
- Controller method addition or new controller
- Module registration update (`.module.ts`)
- Unit spec files (`.spec.ts`) — one per new file that is not excluded from coverage
- Faketory files (`.faketory.ts`)
- Mock files (`.mock.ts`)

Do not omit any file. Ask the user to confirm, add, or remove entries.

#### 4c — Domain errors

For each error that could occur, propose:

- Error class name (search `domain/errors/` for naming patterns)
- The exact condition that triggers it
- The HTTP status code it maps to (search `GlobalExceptionFilter` or existing error mappings)

#### 4d — Validation rules

For each field in every DTO, propose the Zod rule. Search existing DTO shapes for reusable validators in `src/shared/infrastructure/http/zod/validators/`. Flag any field that needs a new shared validator.

#### 4e — Test plan (Unit & Acceptance)

**Unit tests** — For every new use-case and controller, list:

- The success path (what the happy flow asserts)
- Every failure path (one `it` block per domain error or edge case)
- The mock return value that triggers each path

**Acceptance tests** — If the feature includes a new HTTP endpoint or changes an existing endpoint's behavior:

- Propose 1–3 acceptance test scenarios (Gherkin `.feature` format) that verify end-to-end behavior
- Identify required fixtures (pre-existing database state needed for each scenario)
- Identify required payloads (request bodies or parameters referenced in scenarios)
- Identify required step definitions (Given/When/Then steps that must be implemented or reused)
- Reference existing acceptance test patterns in `tests/acceptance/README.md` for naming and structure

See `tests/acceptance/README.md` section "How To: Add a New Acceptance Test" for the complete workflow and file structure.

Acceptance criteria for Dimension 4:

- Data flow traced end-to-end with concrete names
- Complete file list confirmed (no "TBD" or "…" entries remain)
- All domain errors named with HTTP mapping
- All DTO fields have explicit Zod rules
- Unit test plan covers 100% of branches
- Acceptance test scenarios proposed (if endpoint change) with fixture/payload/step requirements identified

---

### Dimension 5 — Risks & Unknowns

Goal: surface and mitigate risks before they become bugs or rework.

For each point, search the codebase for evidence before proposing:

1. **Regression surface**: Run a conceptual search — which existing use-cases, controllers, or shared utilities could be broken by the changes in Dimension 4b Modified Files? List them and confirm each is covered by an existing spec.
2. **Performance**: Given the DB schema and repository method proposed, is there a missing index, a potential N+1 query, or an unbounded result set? Propose a fix or confirm it is not an issue.
3. **Security**: Does the new endpoint expose data that should be scoped (e.g. a user can only see their own records)? Propose the scoping strategy or confirm it is not needed.
4. **Rollback**: Given whether a schema change is involved, propose the rollback strategy: feature flag, revert commit, or additive-only migration.
5. **Unknowns**: Ask the user explicitly: *"Is there anything about this feature that you are uncertain about or have not decided yet?"* Do not accept silence — push for a concrete answer.

Acceptance criteria:

- Regression surface mapped and confirmed safe
- At least one risk with mitigation documented
- Rollback strategy agreed

---

## Interrogation rules

- **Search before asking.** Use file search, content search, and directory listings to find existing patterns before posing any question.
- **Propose, then validate.** Every question must come with a concrete proposal backed by evidence. Never ask a fully open question if the codebase has signal.
- **One dimension at a time.** Complete acceptance criteria before advancing.
- **Reject vagueness.** If the user answers with "we'll figure it out", "something like X", or "TBD", respond: *"That is not specific enough. Based on [codebase evidence], my proposed answer is [Y]. Confirm or correct it."*
- **Catch contradictions.** If a new answer contradicts an earlier one, stop and surface the conflict before continuing.
- **Enforce conventions.** Validate every proposed name, path, and pattern against `AGENTS.md` and `docs/ARCHITECTURE.md`. Reject anything that violates project constraints (relative imports, `switch`/`case`, enums, magic numbers, default exports, etc.).
- **No TBDs in the final plan.** Every field in the Structured Plan output must be filled. If something is genuinely unknown, explicitly note it as a blocker and do not produce the plan until it is resolved.

---

## Output — Structured Plan

When all five dimensions are complete and all acceptance criteria are met, produce the **Structured Plan**.

**This plan must be complete enough that a developer or an AI agent can implement the feature immediately without asking any further questions.**
Every file path must be fully qualified. Every field must have a Zod rule. Every error must have a trigger and HTTP status. Every test case must name the mock setup.

```markdown
## Feature Plan: <Feature Name>

### Problem Statement

<One sentence — confirmed by user>

### Definition of Done

<Observable, testable outcome — confirmed by user>

### Scope

#### In scope

| Layer          | Item                              | Action   |
|----------------|-----------------------------------|----------|
| Domain         | FooEntity (types)                 | Create   |
| Domain         | FooNotFoundError                  | Create   |
| Application    | CreateFooUseCase                  | Create   |
| Application    | CreateFooDto (request)            | Create   |
| Application    | FooResponseDto (response)         | Create   |
| Infrastructure | FooController (POST /foo)         | Create   |
| Infrastructure | FooMongooseRepository.create()    | Create   |

#### Out of scope

- <Item — reason confirmed by user>

### Actors & Authorization

| Actor   | Trigger              | Guard / Permission        |
|---------|----------------------|---------------------------|
| <actor> | POST /foo HTTP call  | <GuardName or "none">     |

### Data Flow
```

POST /foo (FooController.create)
→ CreateFooDto validated by Zod (fields: id: z.string().uuid(), name: z.string().min(1))
→ mapped to CreateFooCommand { id: string, name: string }
→ CreateFooUseCase.execute(command)
→ FooRepository.create(command) → FooDocument | undefined
→ throws FooCreationError if undefined
→ mapped to FooResponseDto { id: string, name: string, createdAt: string }
→ 201 Created

```

### New Files
| File path                                                                          | Type              | Mirrors                                                      |
|------------------------------------------------------------------------------------|-------------------|--------------------------------------------------------------|
| `src/contexts/<ctx>/domain/entities/foo.types.ts`                                  | Entity type       | `src/contexts/<ctx>/domain/entities/bar.types.ts`            |
| `src/contexts/<ctx>/domain/errors/foo.errors.ts`                                   | Domain error      | `src/contexts/<ctx>/domain/errors/bar.errors.ts`             |
| `src/contexts/<ctx>/domain/commands/foo.commands.ts`                               | Command type      | …                                                            |
| `src/contexts/<ctx>/domain/repositories/foo.repository.types.ts`                   | Repo interface    | …                                                            |
| `src/contexts/<ctx>/domain/repositories/foo.repository.constants.ts`               | Injection token   | …                                                            |
| `src/contexts/<ctx>/application/use-cases/create-foo/create-foo.use-case.ts`       | UseCase           | …                                                            |
| `src/contexts/<ctx>/application/dto/create-foo/create-foo.dto.shape.ts`            | DTO shape         | …                                                            |
| `src/contexts/<ctx>/application/dto/create-foo/create-foo.dto.ts`                  | NestZod DTO       | …                                                            |
| `src/contexts/<ctx>/application/dto/foo-response/foo-response.dto.shape.ts`        | DTO shape         | …                                                            |
| `src/contexts/<ctx>/application/dto/foo-response/foo-response.dto.ts`              | NestZod DTO       | …                                                            |
| `src/contexts/<ctx>/infrastructure/http/controllers/foo.controller.ts`             | Controller        | …                                                            |
| `src/contexts/<ctx>/infrastructure/persistence/mongoose/repository/foo.repository.ts` | Repo impl      | …                                                            |
| `tests/…/create-foo.use-case.spec.ts`                                              | Unit spec         | …                                                            |
| `tests/…/foo.controller.spec.ts`                                                   | Unit spec         | …                                                            |
| `tests/…/create-foo.dto.shape.spec.ts`                                             | Unit spec         | …                                                            |
| `tests/…/foo.errors.spec.ts`                                                       | Unit spec         | …                                                            |
| `tests/shared/utils/faketories/…/foo.entity.faketory.ts`                           | Faketory          | …                                                            |
| `tests/shared/utils/faketories/…/create-foo.dto.faketory.ts`                       | Faketory          | …                                                            |
| `tests/unit/utils/mocks/…/foo.mongoose.repository.mock.ts`                         | Mock              | …                                                            |

### Modified Files
| File path                                              | Change summary                                      |
|--------------------------------------------------------|-----------------------------------------------------|
| `src/contexts/<ctx>/…/<ctx>.module.ts`                 | Register FooController, provide FOO_REPOSITORY_TOKEN|
| `src/contexts/<ctx>/…/foo.schema.ts`                   | Add `name: String` field                            |

### Domain Errors
| Error class       | Trigger condition                      | HTTP status |
|-------------------|----------------------------------------|-------------|
| FooNotFoundError  | Repository.findById returns undefined  | 404         |
| FooCreationError  | Repository.create returns undefined    | 500         |

### Validation Rules (DTOs)

**CreateFooDto**
| Field  | Zod rule                                       | Description / example           |
|--------|------------------------------------------------|---------------------------------|
| name   | `z.string().min(1).max(255).describe("…")`     | "The foo display name"          |

**FooResponseDto**
| Field      | Zod rule                                                   | Description / example           |
|------------|------------------------------------------------------------|---------------------------------|
| id         | `z.string().describe("…").meta({ example: "64a…" })`      | "Unique identifier"             |
| name       | `z.string().describe("…").meta({ example: "My foo" })`    | "The foo display name"          |
| createdAt  | `z.string().datetime().describe("…")`                     | "ISO 8601 creation timestamp"   |

### Test Plan
| Spec file                          | Test case description                                           | Mock setup                                      |
|------------------------------------|-----------------------------------------------------------------|-------------------------------------------------|
| `create-foo.use-case.spec.ts`      | should return created foo when repository resolves one          | `repo.create.mockResolvedValueOnce(fakeFoo)`    |
| `create-foo.use-case.spec.ts`      | should throw FooCreationError when repository returns undefined | `repo.create.mockResolvedValueOnce(undefined)`  |
| `foo.controller.spec.ts`           | should call useCase.execute with mapped command                 | default mock                                    |
| `create-foo.dto.shape.spec.ts`     | should accept valid name                                        | `createFakeCreateFooDto()`                      |
| `create-foo.dto.shape.spec.ts`     | should reject empty name                                        | `{ name: "" }`                                  |
| `foo.errors.spec.ts`               | should set correct name                                         | `new FooNotFoundError("id")`                    |

### Risks & Mitigations
| Risk                                      | Mitigation                                              |
|-------------------------------------------|---------------------------------------------------------|
| <risk identified from Dimension 5>        | <concrete mitigation>                                   |

### Rollback Strategy
<Exact steps: e.g. "Revert commit X; no schema migration to undo because field is additive and nullable.">

### Open Questions / Blockers
<None — or list any remaining unknowns that must be resolved before implementation starts>
```

---

## Checklist before handing off the plan

1. All five dimensions answered — no vague responses remain
2. Every new file has a fully qualified path, a type, and a "Mirrors" reference
3. Every modified file has a concrete change summary
4. All domain errors have a trigger condition and an HTTP status
5. Every DTO field has an explicit Zod rule with `.describe()` and `.meta({ example })`
6. Test plan covers every use-case success path and every failure/edge-case branch
7. At least one risk + mitigation documented
8. "Open Questions / Blockers" section is either empty or lists only non-blocking items
9. Plan validated against `docs/ARCHITECTURE.md` for layer correctness
10. Plan validated against `AGENTS.md` for naming, import, and constraint rules

---

## Reference

- Architecture guide: `docs/ARCHITECTURE.md`
- Agent conventions: `AGENTS.md`
- Unit test guide: `tests/unit/README.md`
- Mock conventions: `tests/unit/utils/mocks/README.md`
- Faketory conventions: `tests/shared/utils/faketories/README.md`
- Related skills: `write-unit-test`, `create-mock`, `create-faketory`
