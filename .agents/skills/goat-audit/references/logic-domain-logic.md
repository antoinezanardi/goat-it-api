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

- **[LOGIC-01] Creation status is derived, never submitted** — Every creation command derives its initial status through a domain rule, and no creation DTO or contract accepts a status; the only creation input that feeds the derivation is the client-supplied `author.role`, validated against the creation role enum on the admin-only create route, with `admin` → `active` and any other creation role → `pending`, so the check states which roles the server trusts and where that trust is enforced; the derivation and its value mapping are recorded in `docs/domain-logic.md`.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/contexts/question/domain/rules/**`, `src/contexts/question/application/mappers/**`, `src/contexts/question/domain/constants/**` · Src: project: docs/domain-logic.md
- **[LOGIC-02] Cardinality and uniqueness invariants use the shared refinements** — Every bounded collection and every exactly-one/unique-by-key rule is expressed through the shared refinement helpers rather than hand-rolled per DTO; the current bounds and keys are recorded in `docs/domain-logic.md`.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/contexts/question/domain/constants/**`, `src/contexts/question/application/dto/question-creation/**`, `src/shared/application/dto/zod/refinements/**` · Src: [1], [6], project: docs/domain-logic.md
- **[LOGIC-03] Bounded arrays enforce their bounds, item format and uniqueness** — Every bounded list validates its minimum and maximum, each item's format and value uniqueness through the shared validator; the current bounds and formats are recorded in `docs/domain-logic.md`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/domain/constants/**`, `src/contexts/question/application/dto/zod/validators/**` · Src: [1], [6], project: docs/domain-logic.md
- **[LOGIC-04] String length bounds come from constants** — Every bounded string uses the documented minimum and maximum from named constants on its creation shape; the current bounds are recorded in `docs/domain-logic.md`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/domain/constants/**`, `src/contexts/question/application/dto/question-creation/**` · Src: [1], project: docs/domain-logic.md
- **[LOGIC-05] Localized text bounds are enforced by the shared localization validators** — Every localized field applies the shared per-entry length and per-locale item bounds and must carry at least one locale value; the current bounds live in the shared validator constants and `docs/domain-logic.md`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/shared/application/dto/zod/validators/localization/**` · Src: [1], [6], project: docs/domain-logic.md
- **[LOGIC-06] No answer-correctness model** — Answers stay free text: no domain rule or validator compares answers or defines a correct-answer discriminator; correctness remains a game-side concern and is never re-introduced into the API.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `src/contexts/question/domain/rules/**`, `src/contexts/question/domain/types/**` · Src: project: docs/domain-logic.md
- **[LOGIC-07] Domain value lists have one source** — Every closed value set is defined once in constants and consumed everywhere else; no hand-written copy exists in the domain, DTOs or schemas, and the current sets are recorded in `docs/domain-logic.md`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/domain/constants/**`, `src/contexts/question/infrastructure/persistence/mongoose/schemas/**` · Src: project: docs/domain-logic.md
- **[LOGIC-08] Status transitions are explicit and enumerated** — The only status transition implemented is the one recorded in the domain doc; no un-archive, re-activation or rejection path exists unless the doc records it, and a new transition requires a product decision recorded there.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/application/use-cases/archive-question/**`, `src/contexts/question/application/use-cases/**` · Src: project: docs/domain-logic.md

## 2. Question-theme invariants

- **[LOGIC-09] Natural-key shape and length are validated by shared validators** — Every natural key applies the shared format validator and the documented minimum and maximum length; the regex and bounds live in the shared validator constants and `docs/domain-logic.md`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/shared/application/dto/zod/validators/string/**`, `src/contexts/question-theme/contracts/dto/zod/validators/**` · Src: [1], project: docs/domain-logic.md
- **[LOGIC-10] Natural-key uniqueness is double-enforced** — Creation and modification check availability first, and a unique index catches concurrent writes; the ODM's duplicate-key error maps to the owning domain's already-exists error, never a raw 500; the current unique keys are recorded in `docs/domain-logic.md`.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/contexts/question-theme/application/use-cases/create-question-theme/**`, `src/contexts/question-theme/application/use-cases/modify-question-theme/**`, `src/contexts/question-theme/infrastructure/persistence/mongoose/repository/helpers/**` · Src: [2], [4], project: docs/domain-logic.md
- **[LOGIC-11] Creation status is fixed** — The creation contract type fixes the initial status to the documented default; clients cannot submit a status on creation, and the default is recorded in `docs/domain-logic.md`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question-theme/domain/constants/**`, `src/contexts/question-theme/domain/repositories/**` · Src: [1], project: docs/domain-logic.md
- **[LOGIC-12] Archive protection uses the provider's published count** — Archiving a referenced document reads the live count through the published use case and rejects with the owning domain error; the eligibility predicate is recorded in the domain doc.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/contexts/question-theme/application/use-cases/archive-question-theme/**`, `src/contexts/question-theme/domain/rules/**`, `src/contexts/question/application/use-cases/count-live-questions-by-theme-id/**` · Src: [1], project: docs/domain-logic.md
- **[LOGIC-13] Overlapping eligibility predicates are defined once and never interchanged** — Where two predicates overlap (a broad live set and a narrower active set), each has one definition and every consumer names the one it needs; the definitions and their consumers are recorded in `docs/domain-logic.md`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/infrastructure/persistence/mongoose/repository/**`, `src/contexts/question-theme/infrastructure/persistence/mongoose/repository/pipelines/**` · Src: project: docs/domain-logic.md, project: docs/architecture.md §5.4
- **[LOGIC-14] Required localized fields are required on creation** — Every localized field the domain marks required is required by the creation contract, so the aggregate cannot be created without it; the current required fields are recorded in `docs/domain-logic.md`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question-theme/application/dto/question-theme-creation/**` · Src: [1], project: docs/domain-logic.md

## 3. Write-time vs read-time enforcement

- **[LOGIC-15] Schema validators are not the authority on updates** — For every invariant enforced by a schema validator, the code also enforces it on the write path or records why it cannot; an update pipeline never relies on a schema validator that does not run on updates, and the concurrency limits are recorded in the domain doc.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/contexts/question/infrastructure/persistence/mongoose/schemas/**`, `src/contexts/question/domain/rules/**`, `src/contexts/question/application/use-cases/question-theme-assignment/**` · Src: [1], [4], project: docs/domain-logic.md, project: docs/architecture.md §5.5
- **[LOGIC-16] Every write path enforces its documented rules at read-check time** — Assignment rejects each condition the domain doc lists, from a prior read, and the write is a single-document update; a race that can still violate a bound is recorded as a limitation, never a silent pass.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `src/contexts/question/application/use-cases/question-theme-assignment/assign-theme-to-question/**`, `src/contexts/question/domain/rules/**` · Src: [1], project: docs/domain-logic.md
- **[LOGIC-17] Removal write path enforces its documented rules** — Removal rejects each condition the domain doc lists, from a prior read, and the aggregate keeps its documented minimum at read-check time; a race that can still violate the minimum is recorded as a limitation.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `src/contexts/question/application/use-cases/question-theme-assignment/remove-theme-from-question/**` · Src: [1], project: docs/domain-logic.md
- **[LOGIC-18] The modification contract is closed** — A modification contract exposes only the fields the domain allows to change through that path; a field the domain does not allow cannot be smuggled through the repository contract, and the allowed fields are recorded in `docs/domain-logic.md`.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `src/contexts/question/application/use-cases/question-theme-assignment/modify-question-theme-assignment/**`, `src/contexts/question/domain/repositories/**` · Src: [1], project: docs/domain-logic.md
- **[LOGIC-19] Creation and update paths agree on invariants** — The same assignment invariants hold on every write path: creation enforces them through Zod refinements, assignment and modification through domain policies and single-document atomic writes; no individual write path persists duplicate theme ids, and the concurrent paths that can race the bounds are documented in `docs/domain-logic.md` and tracked in #1271.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/application/dto/question-creation/**`, `src/contexts/question/application/use-cases/question-theme-assignment/**` · Src: [1], [6], project: docs/domain-logic.md
- **[LOGIC-20] Documented absences are real absences** — A limitation the domain doc records as not implemented is not implemented in the code; adding it requires a product decision recorded in `docs/domain-logic.md`.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `src/contexts/question/domain/constants/**`, `src/contexts/question-theme/domain/rules/**` · Src: project: docs/domain-logic.md

## 4. Error domain

- **[LOGIC-21] One error class per subdirectory** — Every domain error class lives alone in its `domain/errors/<error-name>/` subdirectory, extends `Error`, sets `this.name`, and carries the structured context its message needs.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/domain/errors/**`, `src/contexts/question-theme/domain/errors/**` · Src: project: docs/domain-logic.md, project: docs/architecture.md §7.4
- **[LOGIC-22] errorCode derived from the class name** — Every mapped domain error exposes a stable `errorCode` derived from its class name (the `Error` suffix is stripped and the rest kebab-cased); error classes carry no hand-written code that could drift from the class name.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/app/filters/global-exception/**`, `src/shared/infrastructure/http/errors/helpers/**` · Src: [5], project: docs/architecture.md §7.4
- **[LOGIC-23] No internals leak through exceptions** — Only client-actionable domain errors and Zod validation issues reach the client with their message; every unknown exception is logged and answered with a generic 500, so no infrastructure or persistence message leaves the API.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `src/app/filters/global-exception/**` · Src: [5], project: docs/architecture.md §7.4
- **[LOGIC-24] Write/read-back errors are intentionally 500 and test-locked** — Every error class that signals a failed write or read-back is absent from the mapping table and its 500 behavior is asserted by the filter spec; the current class list is recorded in `docs/domain-logic.md` and `docs/architecture.md` §7.4.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/app/filters/global-exception/**`, `src/contexts/question/domain/errors/**` · Src: [5], project: docs/domain-logic.md, project: docs/architecture.md §7.4
- **[LOGIC-25] The published error surface stays closed** — Only errors the architecture doc records as published may be thrown by a consumer; every other provider error stays provider-owned, and no consumer throws an unpublished provider error.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question-theme/domain/errors/**`, `src/contexts/question/application/use-cases/create-question/**` · Src: project: docs/domain-logic.md, project: docs/architecture.md §5.3
- **[LOGIC-26] Every error class is classified** — Each domain error class is either mapped to a specific 4xx in the global exception filter or intentionally falls through to 500 with a one-line justification recorded in the docs; new classes add their mapping or justification in the same change.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/app/filters/global-exception/**`, `src/contexts/question/domain/errors/**`, `src/contexts/question-theme/domain/errors/**` · Src: [5], project: docs/architecture.md §7.4

## 5. Repository contract correctness

- **[LOGIC-27] Ports are pure interfaces with symbol tokens** — Repository ports are pure interfaces with symbol tokens (`QUESTION_REPOSITORY_TOKEN`, `QUESTION_THEME_REPOSITORY_TOKEN`), implemented by infrastructure adapters, and never expose Mongoose documents or DTOs.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/domain/repositories/**`, `src/contexts/question-theme/domain/repositories/**` · Src: project: docs/domain-logic.md, project: docs/architecture.md §4.1
- **[LOGIC-28] Read-after-write semantics hold** — Question write methods return the entity or `undefined` because the adapter re-reads the document after writing; callers treat `undefined` as a failed write, and the re-read returns a fully mapped entity, never a partial document.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/domain/repositories/**`, `src/contexts/question/infrastructure/persistence/mongoose/repository/**` · Src: [4], project: docs/domain-logic.md
- **[LOGIC-29] Multi-operation assignment writes state their real guarantee** — A promotion runs as one ordered `bulkWrite` of two `updateOne` operations (demote all, then promote); each operation is atomic per document, but the batch is not atomic, so a reader may observe the intermediate state and a mid-batch failure leaves earlier operations committed. The domain doc records the guarantee and the tracked limitation.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/contexts/question/infrastructure/persistence/mongoose/repository/**` · Src: [3], project: docs/architecture.md §5.5
- **[LOGIC-30] Repository contracts are pure domain types** — Repository contracts describe write input as pure domain types; they carry no framework or persistence types and cannot be widened to let callers bypass domain rules.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/domain/repositories/**`, `src/contexts/question-theme/domain/repositories/**` · Src: [1], project: docs/domain-logic.md
- **[LOGIC-31] Cross-context persistence uses published contracts** — Question reads embed theme snapshots through the published persistence contracts (collection name and usage field names); no pipeline hardcodes the other context's collection or field names.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/infrastructure/persistence/mongoose/repository/pipelines/**`, `src/contexts/question/contracts/persistence/**`, `src/contexts/question-theme/contracts/persistence/**` · Src: project: docs/domain-logic.md, project: docs/architecture.md §5.4

## 6. Cross-context consistency

- **[LOGIC-32] Cross-context calls stay read-only** — Cross-context calls are read-only validation/query calls with no distributed transaction; write invariants are enforced by the context that writes the aggregate, and cross-context consistency stays best-effort with races tested where they matter.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/application/use-cases/**`, `src/contexts/question-theme/application/use-cases/**` · Src: project: docs/architecture.md §5.5, project: docs/domain-logic.md
- **[LOGIC-33] Creation validates referenced documents through the published use case** — Creation loads every referenced document in one call through the provider's published batch lookup and rejects with the documented domain error when any is ineligible.
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
