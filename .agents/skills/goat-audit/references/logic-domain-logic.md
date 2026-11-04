# LOGIC — Domain logic & data correctness

Correctness of the Goat It API domain across the two bounded contexts (`question`, `question-theme`) and the shared kernel: question invariants (creation status derived from author role, 1-3 theme assignments with exactly one primary, unique source URLs, author display name, per-locale content caps), question-theme invariants (slug shape and uniqueness, fixed creation status, archive protection by live questions), which invariants are enforced at write time versus only at read time, the domain error model and its HTTP classification, repository contract correctness (ports, tokens, read-after-write semantics, atomic writes), and cross-context consistency through the published surface. Checks verify that the code implements exactly what the domain docs record, and that the documented Known limitations are the only divergences.

**Decision doc:** `docs/domain-logic.md` (section `## GOAT audit decisions`). **Diff triggers:** see SKILL.md category index.

**Not in this category:** schema shapes → DATA · query performance → PERF · validation of HTTP input → SEC/API · error HTTP mapping → API

## Contents

- [1. Question invariants](#1-question-invariants)
- [2. Question-theme invariants](#2-question-theme-invariants)
- [3. Write-time vs read-time enforcement](#3-write-time-vs-read-time-enforcement)
- [4. Error domain](#4-error-domain)
- [5. Repository contract correctness](#5-repository-contract-correctness)
- [6. Cross-context consistency](#6-cross-context-consistency)
- [Sources](#sources)

## 1. Question invariants

- **[LOGIC-01] Creation status is derived, never submitted** — The creation status is never client-controlled: the domain rule maps the author role to `active` (`admin`) or `pending` (any other creation role), typed `pending | active`, and every creation command goes through that derivation before persistence.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/contexts/question/domain/rules/**`, `src/contexts/question/application/mappers/**`, `src/contexts/question/domain/constants/**` · Src: project: docs/domain-logic.md
- **[LOGIC-02] Theme count 1-3 with exactly one primary** — Every question holds `QUESTION_THEME_ASSIGNMENTS_MIN_ITEMS = 1` to `QUESTION_THEME_ASSIGNMENTS_MAX_ITEMS = 3` theme assignments, with exactly one `isPrimary: true` (exactly-one-by-key refinement) and unique theme ids (unique-values-by-key refinement).
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/contexts/question/domain/constants/**`, `src/contexts/question/application/dto/question-creation/**`, `src/shared/application/dto/zod/refinements/**` · Src: [1], [6], project: docs/domain-logic.md
- **[LOGIC-03] Source URLs 1-5, valid and unique** — `QUESTION_SOURCE_URLS_MIN_ITEMS = 1` to `QUESTION_SOURCE_URLS_MAX_ITEMS = 5`, each entry a valid URL and all values unique across the array.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/domain/constants/**`, `src/contexts/question/application/dto/zod/validators/**` · Src: [1], [6], project: docs/domain-logic.md
- **[LOGIC-04] Author display name bounded** — The author display name respects `QUESTION_AUTHOR_NAME_MIN_LENGTH = 3` .. `QUESTION_AUTHOR_NAME_MAX_LENGTH = 30` on the author creation shape.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/domain/constants/**`, `src/contexts/question/application/dto/question-creation/**` · Src: [1], project: docs/domain-logic.md
- **[LOGIC-05] Per-locale content caps** — Per-locale text entries are trimmed strings of 1..500 characters, per-locale `trivia` arrays hold 1..10 items, and every localized text or texts object must carry at least one locale value.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/shared/application/dto/zod/validators/localization/**` · Src: [1], [6], project: docs/domain-logic.md
- **[LOGIC-06] No answer-correctness model** — Answers stay free text: no domain rule or validator compares answers or defines a correct-answer discriminator; correctness remains a game-side concern and is never re-introduced into the API.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `src/contexts/question/domain/rules/**`, `src/contexts/question/domain/types/**` · Src: project: docs/domain-logic.md
- **[LOGIC-07] Domain value lists have one source** — Categories (`trivia`, `lexicon`, `riddle`, `explanation`), cognitive difficulties (`easy`, `medium`, `hard`), statuses (`pending`, `active`, `archived`, `rejected`), rejection types and the semantic sort orders are defined once in the question constants and consumed everywhere else; no hand-written copy of a value list exists in the domain, DTOs or schemas.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/domain/constants/**`, `src/contexts/question/infrastructure/persistence/mongoose/schemas/**` · Src: project: docs/domain-logic.md
- **[LOGIC-08] Archive is the only status transition** — Archiving is the sole transition: it rejects an already-archived question and writes `status = archived`; no un-archive, activate or reject use case exists, and a new transition requires a product decision recorded in `docs/domain-logic.md`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/application/use-cases/archive-question/**`, `src/contexts/question/application/use-cases/**` · Src: project: docs/domain-logic.md

## 2. Question-theme invariants

- **[LOGIC-09] Slug shape and length** — Slugs match the kebab-case `SLUG_REGEX = /^[\da-z]+(?:-[\da-z]+)*$/u` with length `SLUG_MIN_LENGTH = 3` .. `SLUG_MAX_LENGTH = 50`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/shared/application/dto/zod/validators/string/**`, `src/contexts/question-theme/contracts/dto/zod/validators/**` · Src: [1], project: docs/domain-logic.md
- **[LOGIC-10] Slug uniqueness is double-enforced** — Theme creation and modification check slug availability first, and a unique Mongo index catches concurrent writes: duplicate key code `MONGO_DUPLICATE_KEY_ERROR_CODE = 11000` maps to the slug-already-exists error, never a raw 500.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/contexts/question-theme/application/use-cases/create-question-theme/**`, `src/contexts/question-theme/application/use-cases/modify-question-theme/**`, `src/contexts/question-theme/infrastructure/persistence/mongoose/repository/helpers/**` · Src: [2], [4], project: docs/domain-logic.md
- **[LOGIC-11] Creation status is fixed** — Theme creation status is fixed to the default `active` by the creation contract type; clients cannot submit a status on creation.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question-theme/domain/constants/**`, `src/contexts/question-theme/domain/repositories/**` · Src: [1], project: docs/domain-logic.md
- **[LOGIC-12] Archive protection by live questions** — Archiving a theme referenced by any live (`pending` + `active`) question is refused: the live count is read through the published count use case and the domain policy rejects with the referenced-by-live-questions error.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/contexts/question-theme/application/use-cases/archive-question-theme/**`, `src/contexts/question-theme/domain/rules/**`, `src/contexts/question/application/use-cases/count-live-questions-by-theme-id/**` · Src: [1], project: docs/domain-logic.md
- **[LOGIC-13] Live and active never interchanged** — Live counting matches `status in [pending, active]` and protects archiving; theme stats `activeQuestionCount` counts only `active` questions. The two concepts stay distinct everywhere they are consumed.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/infrastructure/persistence/mongoose/repository/**`, `src/contexts/question-theme/infrastructure/persistence/mongoose/repository/pipelines/**` · Src: project: docs/domain-logic.md, project: docs/architecture.md §5.4
- **[LOGIC-14] Required localized fields on creation** — `label`, `aliases` and `description` are required localized values on theme creation; a theme cannot be created without them.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question-theme/application/dto/question-theme-creation/**` · Src: [1], project: docs/domain-logic.md

## 3. Write-time vs read-time enforcement

- **[LOGIC-15] Schema validators are not the authority on updates** — The 3-theme maximum is read-checked on assignment and validated by Zod on creation; the exactly-one-primary rule is enforced by creation Zod and preserved by the demote/promote write pattern (there is no primary-count read-check), and concurrent promotions can race it (#1271, documented in `docs/domain-logic.md`); each assignment write is a single-document atomic operation; the Mongoose `themes` `minItems`/`maxItems` validators document the invariant and do not run on update pipelines, which the code never relies on.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/contexts/question/infrastructure/persistence/mongoose/schemas/**`, `src/contexts/question/domain/rules/**`, `src/contexts/question/application/use-cases/question-theme-assignment/**` · Src: [1], [4], project: docs/domain-logic.md, project: docs/architecture.md §5.5
- **[LOGIC-16] Assignment write path enforces the three rules at read-check time** — Assigning a theme rejects when the theme is already assigned, when the 3-theme maximum is reached, or when the theme is archived; the rejection is decided from a prior read and the write is a single-document update, so the concurrency race is the documented limitation in `docs/domain-logic.md`, never a silent pass.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `src/contexts/question/application/use-cases/question-theme-assignment/assign-theme-to-question/**`, `src/contexts/question/domain/rules/**` · Src: [1], project: docs/domain-logic.md
- **[LOGIC-17] Removal write path enforces its rules** — Removing a theme rejects a missing assignment and a primary assignment, and the question keeps at least 1 theme at read-check time; concurrent removals can race the minimum (#1271, documented in `docs/domain-logic.md`).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `src/contexts/question/application/use-cases/question-theme-assignment/remove-theme-from-question/**` · Src: [1], project: docs/domain-logic.md
- **[LOGIC-18] Modification contract is closed** — Modifying an assignment only allows `isPrimary: true` (promotion, which demotes every other assignment in the same single-document write; two concurrent promotions can race the one-primary invariant, #1271) and/or `isHint`; the contract type prevents any other field from being changed this way.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `src/contexts/question/application/use-cases/question-theme-assignment/modify-question-theme-assignment/**`, `src/contexts/question/domain/repositories/**` · Src: [1], project: docs/domain-logic.md
- **[LOGIC-19] Creation and update paths agree on invariants** — The same assignment invariants hold on every write path: creation enforces them through Zod refinements, assignment and modification through domain policies and single-document atomic writes; no individual write path persists duplicate theme ids, and the concurrent paths that can race the bounds are documented in `docs/domain-logic.md` and tracked in #1271.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/application/dto/question-creation/**`, `src/contexts/question/application/use-cases/question-theme-assignment/**` · Src: [1], [6], project: docs/domain-logic.md
- **[LOGIC-20] No per-theme question cap** — No maximum number of questions per theme exists in the domain constants or rules; the only theme/question count rule is archive protection, and `docs/domain-logic.md` records this limitation until a cap is decided.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `src/contexts/question/domain/constants/**`, `src/contexts/question-theme/domain/rules/**` · Src: project: docs/domain-logic.md

## 4. Error domain

- **[LOGIC-21] One error class per subdirectory** — Every domain error class lives alone in its `domain/errors/<error-name>/` subdirectory, extends `Error`, sets `this.name`, and carries the structured context its message needs.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/domain/errors/**`, `src/contexts/question-theme/domain/errors/**` · Src: project: docs/domain-logic.md, project: docs/architecture.md §7.4
- **[LOGIC-22] errorCode derived from the class name** — Every mapped domain error exposes a stable `errorCode` derived from its class name (the `Error` suffix is stripped and the rest kebab-cased); error classes carry no hand-written code that could drift from the class name.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/app/filters/global-exception/**`, `src/shared/infrastructure/http/errors/helpers/**` · Src: [5], project: docs/architecture.md §7.4
- **[LOGIC-23] No internals leak through exceptions** — Only client-actionable domain errors and Zod validation issues reach the client with their message; every unknown exception is logged and answered with a generic 500, so no infrastructure or persistence message leaves the API.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `src/app/filters/global-exception/**` · Src: [5], project: docs/architecture.md §7.4
- **[LOGIC-24] Write/read-back errors locked to 500** — The four write/read-back errors (`QuestionCreationError`, `QuestionThemeAssignmentCreationError`, `QuestionThemeAssignmentModificationError`, `QuestionThemeAssignmentRemovalError`) are intentionally unmapped and fall through to 500, with filter tests asserting that behavior.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/app/filters/global-exception/**`, `src/contexts/question/domain/errors/**` · Src: [5], project: docs/domain-logic.md, project: docs/architecture.md §7.4
- **[LOGIC-25] Published error surface stays closed** — The theme not-found error is the only theme error a consumer may throw; every other theme error stays provider-owned, and no consumer throws an unpublished provider error.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question-theme/domain/errors/**`, `src/contexts/question/application/use-cases/create-question/**` · Src: project: docs/domain-logic.md, project: docs/architecture.md §5.3
- **[LOGIC-26] Every error class is classified** — Each domain error class is either mapped to a specific 4xx in the global exception filter or intentionally falls through to 500 with a one-line justification recorded in the docs; new classes add their mapping or justification in the same change.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/app/filters/global-exception/**`, `src/contexts/question/domain/errors/**`, `src/contexts/question-theme/domain/errors/**` · Src: [5], project: docs/architecture.md §7.4

## 5. Repository contract correctness

- **[LOGIC-27] Ports are pure interfaces with symbol tokens** — Repository ports are pure interfaces with symbol tokens (`QUESTION_REPOSITORY_TOKEN`, `QUESTION_THEME_REPOSITORY_TOKEN`), implemented by infrastructure adapters, and never expose Mongoose documents or DTOs.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/domain/repositories/**`, `src/contexts/question-theme/domain/repositories/**` · Src: project: docs/domain-logic.md, project: docs/architecture.md §4.1
- **[LOGIC-28] Read-after-write semantics hold** — Question write methods return the entity or `undefined` because the adapter re-reads the document after writing; callers treat `undefined` as a failed write, and the re-read returns a fully mapped entity, never a partial document.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/domain/repositories/**`, `src/contexts/question/infrastructure/persistence/mongoose/repository/**` · Src: [4], project: docs/domain-logic.md
- **[LOGIC-29] Assignment writes are atomic** — Primary promotion/demotion runs as one `bulkWrite` with two `updateOne` operations (demote all, then promote or insert), never as separate updates and never through MongoDB transactions.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/contexts/question/infrastructure/persistence/mongoose/repository/**` · Src: [3], project: docs/architecture.md §5.5
- **[LOGIC-30] Repository contracts are pure domain types** — Repository contracts describe write input as pure domain types; they carry no framework or persistence types and cannot be widened to let callers bypass domain rules.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/domain/repositories/**`, `src/contexts/question-theme/domain/repositories/**` · Src: [1], project: docs/domain-logic.md
- **[LOGIC-31] Cross-context persistence uses published contracts** — Question reads embed theme snapshots through the published persistence contracts (collection name and usage field names); no pipeline hardcodes the other context's collection or field names.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/infrastructure/persistence/mongoose/repository/pipelines/**`, `src/contexts/question/contracts/persistence/**`, `src/contexts/question-theme/contracts/persistence/**` · Src: project: docs/domain-logic.md, project: docs/architecture.md §5.4

## 6. Cross-context consistency

- **[LOGIC-32] Cross-context calls stay read-only** — Cross-context calls are read-only validation/query calls with no distributed transaction; write invariants are enforced by the context that writes the aggregate, and cross-context consistency stays best-effort with races tested where they matter.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/application/use-cases/**`, `src/contexts/question-theme/application/use-cases/**` · Src: project: docs/architecture.md §5.5, project: docs/domain-logic.md
- **[LOGIC-33] Creation validates themes through the published use case** — Question creation loads every referenced theme in one call through the published get-themes-by-ids use case and rejects with `ReferencedQuestionThemeArchivedError` when any referenced theme is archived.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/contexts/question/application/use-cases/create-question/**`, `src/contexts/question-theme/application/use-cases/get-question-themes-by-ids-or-throw/**` · Src: [1], project: docs/domain-logic.md
- **[LOGIC-34] No logic duplication across contexts** — Shared domain value objects and rules (locale, localization, limits) live once in the shared kernel and are imported by both contexts; neither context re-implements a shared rule locally.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/shared/domain/value-objects/locale/**`, `src/contexts/question/domain/**`, `src/contexts/question-theme/domain/**` · Src: [1], project: docs/architecture.md §4.5
- **[LOGIC-35] Consumers use published predicates, not provider policies** — Consumers call pure published predicates/helpers and never another context's `ensure*` policies, which throw provider errors and would bind the consumer to provider error semantics.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/application/use-cases/**`, `src/contexts/question-theme/application/use-cases/**` · Src: project: docs/architecture.md §5.2

## Sources

[1] Microsoft — Designing validations in the domain model layer: https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/domain-model-layer-validations (fetched 2026-11-04)
[2] MongoDB — Unique Indexes: https://www.mongodb.com/docs/manual/core/index-unique/ (fetched 2026-11-04)
[3] Mongoose — Model.bulkWrite(): https://mongoosejs.com/docs/api/model.html#Model_bulkWrite (fetched 2026-11-04)
[4] Mongoose — Schemas (guide): https://mongoosejs.com/docs/guide.html (fetched 2026-11-04)
[5] NestJS — Exception filters: https://docs.nestjs.com/exception-filters (fetched 2026-11-04)
[6] Zod — API reference: https://zod.dev/api (fetched 2026-11-04)
