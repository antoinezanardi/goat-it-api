# DATA — MongoDB collections, schemas, indexes, pipelines, migrations

The persisted data model of the Goat It API: the two MongoDB collections and their published names, the Mongoose schemas and how they mirror the domain entities (required fields, optional fields, enums, localized subdocuments, bounds, schema options), the declared and missing indexes, the theme-to-question reference model and its application-enforced integrity, the aggregation pipelines that join themes, sample random questions and compute both stats facets, the document and insert-payload types plus the mappers that keep persistence types inside infrastructure, the absence of migration tooling and the schema-evolution policy that replaces it, and the single database connection with its atomic single-document write model. Checks verify that the code implements what `docs/data-model.md` records, and that the documented migration and index limitations are the only divergences.

**Decision doc:** `docs/data-model.md` (section `## GOAT audit decisions`). **Diff triggers:** see SKILL.md category index.

**Not in this category:** query performance tuning and execution plans → PERF · HTTP DTO shapes and status codes → API · domain rules and invariants → LOGIC · container runtime and deployment configuration → PLAT

## Contents

- [1. Collection inventory and naming](#1-collection-inventory-and-naming)
- [2. Schema definition correctness](#2-schema-definition-correctness)
- [3. Indexes](#3-indexes)
- [4. References and integrity](#4-references-and-integrity)
- [5. Aggregation pipelines](#5-aggregation-pipelines)
- [6. Persistence contracts and mappers](#6-persistence-contracts-and-mappers)
- [7. Migrations and schema evolution](#7-migrations-and-schema-evolution)
- [8. Connection and transactions](#8-connection-and-transactions)
- [Sources](#sources)

## 1. Collection inventory and naming

- **[DATA-01] Every collection is named by a published constant and matches the documented inventory** — Every persisted collection name comes from the owning context's published persistence contract and is consumed by the schema decorator, repositories and pipelines instead of a repeated literal; the set of collections matches `docs/data-model.md`, and adding or removing one updates that document in the same change.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/contexts/**/contracts/persistence/**`, `src/contexts/**/infrastructure/persistence/mongoose/schemas/**`, `src/contexts/**/infrastructure/persistence/mongoose/repository/**` · Src: [1], [10], project: docs/data-model.md
- **[DATA-02] No stray, shadow or generated collections** — No schema, repository, script or container definition creates an additional application collection, a prefixed collection, a capped collection, a time-series collection or a view; a new persisted concept requires an approved design and a published constant.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/**/infrastructure/persistence/**`, `scripts/**`, `docker/**` · Src: [1], project: docs/data-model.md
- **[DATA-03] Collection names keep one documented casing** — Persisted collection names use the documented casing, while domain and TypeScript symbols keep their own casing; the mapping happens only at the persistence boundary and is recorded in `docs/data-model.md`.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `src/contexts/**/contracts/persistence/**`, `src/contexts/**/infrastructure/persistence/mongoose/schemas/**` · Src: [1], project: docs/data-model.md
- **[DATA-04] Each collection has exactly one owning context** — The schema, repository and token for a collection are registered only in that context's persistence module; no other context re-registers, mutates or owns the same collection.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/**/infrastructure/persistence/*.module.ts`, `src/app/app.module.ts` · Src: [10], project: docs/architecture.md §6.2

## 2. Schema definition correctness

- **[DATA-05] Every document schema mirrors its domain entity and the documented inventory** — Each Mongoose schema declares the same fields as its domain entity — required/optional, embedded subdocuments, enums, bounds and defaults — and the field-level inventory in `docs/data-model.md` is the reference; a schema/entity divergence is a finding even when the API currently works.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/contexts/question/infrastructure/persistence/mongoose/schemas/**`, `src/contexts/question-theme/infrastructure/persistence/mongoose/schemas/**`, `src/contexts/**/domain/types/**` · Src: [1], [10], project: docs/data-model.md
- **[DATA-06] Enums and bounds come from domain constants** — Every enum list, default, minimum and maximum used by a schema is imported from the domain constants or a published persistence contract; no schema file re-declares a value list, a status default or a collection name by hand.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/**/infrastructure/persistence/mongoose/schemas/**`, `src/contexts/**/domain/constants/**`, `src/contexts/**/contracts/persistence/**` · Src: [10], project: docs/architecture.md §8.1
- **[DATA-07] Localized subdocuments use the shared schemas** — Every localized text or text-array field uses the shared localization sub-schemas, exposes exactly the locale set documented in `docs/i18n.md` as optional entries, and stores no subdocument `_id` or timestamp.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/shared/infrastructure/persistence/mongoose/schemas/localization/**`, `src/contexts/**/infrastructure/persistence/mongoose/schemas/**` · Src: [10], [11], project: docs/data-model.md
- **[DATA-08] Schema options are centralized** — Top-level schemas use the shared options (`timestamps: true`, `versionKey: false`, `_id`/`id` enabled) and subdocuments use the shared subdocument options (`timestamps: false`, `_id`/`id` disabled); no schema silently overrides those defaults.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/shared/infrastructure/persistence/mongoose/constants/**`, `src/contexts/**/infrastructure/persistence/mongoose/schemas/**` · Src: [10], project: docs/data-model.md
- **[DATA-09] Mongoose strict mode stays enabled** — Schemas retain Mongoose's default strict behavior (no `strict: false`), and no write path bypasses schema enforcement, so unknown fields in a write are dropped or rejected instead of being persisted.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/**/infrastructure/persistence/mongoose/schemas/**`, `src/contexts/**/infrastructure/persistence/mongoose/repository/**` · Src: [10], project: docs/data-model.md
- **[DATA-10] Schema bounds, enums and defaults come from one source** — Every schema bound, enum and default is imported from its domain or contract source and agrees with the request DTO; a value changed on one side and not the other is a finding, and the current sets are recorded in `docs/data-model.md` and `docs/api-contract.md`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/**/infrastructure/persistence/mongoose/schemas/**`, `src/contexts/**/application/dto/**`, `src/contexts/**/domain/constants/**` · Src: [10], project: docs/api-contract.md
- **[DATA-11] Optional fields are absent, never null** — Every optional field declares `required: false` with no default or `default: undefined`, so an omitted value is stored as absent rather than `null`; the optional-field inventory lives in `docs/data-model.md`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/**/infrastructure/persistence/mongoose/schemas/**`, `src/shared/infrastructure/persistence/mongoose/schemas/**` · Src: [10], project: docs/data-model.md
- **[DATA-12] Schema files follow the placement convention** — Each schema lives in the plural `schemas/` directory, one class per file with its compiled schema constant exported beside it, and nested sub-schemas live in `schemas/<name>/` rather than being inlined into the parent file.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `src/contexts/**/infrastructure/persistence/mongoose/schemas/**`, `src/shared/infrastructure/persistence/mongoose/schemas/**` · Src: [10], project: docs/architecture.md §8.1

## 3. Indexes

- **[DATA-13] Natural-key uniqueness is enforced by a unique index** — Every natural key the domain requires unique declares both `unique: true` and `index: true`, and the ODM's duplicate-key error is translated to the owning domain's conflict error rather than surfacing a raw 500; the current unique keys are listed in `docs/data-model.md`.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/contexts/question-theme/infrastructure/persistence/mongoose/schemas/**`, `src/contexts/question-theme/infrastructure/persistence/mongoose/repository/helpers/**`, `src/shared/infrastructure/persistence/mongoose/constants/**` · Src: [2], [3], project: docs/data-model.md
- **[DATA-14] Reference paths are indexed** — Every field used as a cross-collection reference declares `index: true`, backing filters, counts and joins; the index inventory in `docs/data-model.md` is the reference.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/infrastructure/persistence/mongoose/schemas/**` · Src: [2], project: docs/data-model.md
- **[DATA-15] No speculative or duplicate index exists** — Beyond the implicit `_id` index and the indexes justified by an exercised query path and recorded in the documentation, no compound, sparse, partial, TTL, text, wildcard or duplicate index is declared; a new index names its query path and is recorded in the same change.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/**/infrastructure/persistence/mongoose/schemas/**` · Src: [2], project: docs/data-model.md
- **[DATA-16] The declared index set matches the documented inventory** — The documented index inventory lists every declared index with its collection, path and uniqueness, and no declared index is missing from the documentation or invented by it.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/**/infrastructure/persistence/mongoose/schemas/**` · Src: [2], project: docs/data-model.md
- **[DATA-17] Index build posture is explicit** — Index creation relies on Mongoose's startup index build with no explicit `syncIndexes` or `createIndexes` migration step; production index drift is recorded as a documented operational gap and is not silently assumed away.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/database/**`, `src/contexts/**/infrastructure/persistence/mongoose/schemas/**`, `scripts/**` · Src: [2], [10], project: docs/data-model.md

## 4. References and integrity

- **[DATA-18] Cross-collection references are typed ids with an explicit model target** — Every reference field is a required id of the persistence layer's id type; a string `ref` names the registered model (not the collection) and is added only when `populate()` is used; the reference inventory is recorded in `docs/data-model.md`.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/contexts/question/infrastructure/persistence/mongoose/schemas/**`, `src/contexts/question-theme/contracts/persistence/**` · Src: [10], [11], project: docs/architecture.md §5.4
- **[DATA-19] References stay single-directional and derived** — A referenced document stores no back-reference, count or denormalized usage of its referrers; usage is derived at query time, so there is one source of truth and no dual write to keep consistent.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question-theme/infrastructure/persistence/mongoose/schemas/**`, `src/contexts/question/infrastructure/persistence/mongoose/repository/pipelines/**` · Src: [1], project: docs/data-model.md
- **[DATA-20] Bounded-array invariants state their real guarantee** — For every bounded-array invariant, the schema validator documents the bound, the write path enforces it at read-check time, each `updateOne` is atomic per document, and a multi-operation `bulkWrite` is not atomic as a batch; any concurrency gap is recorded in the domain doc.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/contexts/question/infrastructure/persistence/mongoose/repository/**`, `src/contexts/question/domain/rules/**` · Src: [9], [8], project: docs/architecture.md §5.5
- **[DATA-21] Referenced-document existence is application-enforced on writes** — Every write that references another document validates its existence and eligibility through the provider context's published surface before writing; no database foreign key is assumed.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/application/use-cases/**`, `src/contexts/question-theme/application/use-cases/**`, `src/contexts/question/domain/rules/**` · Src: [9], [10], project: docs/architecture.md §5.5
- **[DATA-22] Archive protection counts live referrers** — Archiving a referenced document is refused while any live referrer exists; the count uses the eligibility predicate recorded in the domain doc, so terminal states do not block archiving.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/infrastructure/persistence/mongoose/repository/**`, `src/contexts/question-theme/application/use-cases/archive-question-theme/**` · Src: [1], project: docs/data-model.md, project: docs/architecture.md §5.4
- **[DATA-23] Referenced documents are validated on every write path** — Creation and assignment both refuse an ineligible referenced document through the published surface, and the rule is owned by the writing context rather than duplicated in persistence.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/application/use-cases/**`, `src/contexts/question/domain/rules/**`, `src/contexts/question-theme/domain/rules/**` · Src: [1], project: docs/architecture.md §5.3
- **[DATA-24] Cross-context persistence uses published contracts** — The theme-stats join and any cross-context read consume the published collection and field-name contracts; no cross-context pipeline hard-codes the other context's collection name, status value or nested theme field.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question-theme/infrastructure/persistence/mongoose/repository/pipelines/**`, `src/contexts/question/contracts/persistence/**`, `src/contexts/question-theme/contracts/persistence/**` · Src: [5], project: docs/architecture.md §5.4

## 5. Aggregation pipelines

- **[DATA-25] Cross-collection joins preserve parent cardinality** — A read that joins a referenced document uses an empty-array-preserving unwind, a join, a second preserving unwind, a group that rebuilds the embedded shape, a merge and a deterministic sort; a parent is never duplicated or dropped by the join.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/contexts/question/infrastructure/persistence/mongoose/repository/pipelines/**` · Src: [5], [13], project: docs/data-model.md
- **[DATA-26] Filtering, joining, sorting and limiting run in the documented order** — List reads apply filter `$match` stages before the theme join, then sort and the optional limit; no post-join stage changes which documents match or how many are returned.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/infrastructure/persistence/mongoose/repository/**` · Src: [13], project: docs/data-model.md
- **[DATA-27] Random reads are eligibility-filtered and bounded** — The random pipeline applies the documented eligibility predicate and request filters, samples with the DTO-bounded size before the join, and never returns an ineligible document; the sample size cannot exceed the documented range.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/contexts/question/infrastructure/persistence/mongoose/repository/**`, `src/contexts/question/application/dto/find-random-questions-body/**` · Src: [6], project: docs/data-model.md
- **[DATA-28] Every stats facet covers its documented dimensions** — One `$facet` produces every dimension recorded in the stats contract, terminal-state rows count only that state, and empty buckets map to zero or an empty record rather than `undefined`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/infrastructure/persistence/mongoose/repository/pipelines/**`, `src/contexts/question/infrastructure/persistence/mongoose/types/**` · Src: [7], project: docs/data-model.md
- **[DATA-29] Stats facets count only eligible documents and default to zero** — The stats join matches the documented eligibility predicate on the referenced side, `$ifNull` defaults a missing count to zero, and the facet returns the documented rows and counts.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question-theme/infrastructure/persistence/mongoose/repository/pipelines/**` · Src: [5], [7], project: docs/data-model.md
- **[DATA-30] Semantic sorts compute priority and clean it up** — Semantic sorts (`status`, `cognitiveDifficulty`) add a `_sortPriority` computed with `$indexOfArray`, apply one `$sort` and remove the helper with `$unset`; plain fields use a direct `$sort` with `_id` as the tiebreaker.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/shared/infrastructure/persistence/mongoose/helpers/**`, `src/contexts/**/infrastructure/persistence/mongoose/constants/**` · Src: [13], project: docs/data-model.md
- **[DATA-31] Pipelines are typed, centralized and composable** — Every pipeline is a standalone pipeline module exporting a typed stage array; repositories compose those arrays instead of embedding ad-hoc stages inline, and no pipeline imports application or HTTP code.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/**/infrastructure/persistence/mongoose/repository/pipelines/**`, `src/contexts/**/infrastructure/persistence/mongoose/types/**` · Src: [13], project: docs/architecture.md §8.1

## 6. Persistence contracts and mappers

- **[DATA-32] Document and insert types are derived, not duplicated** — Document types are derived from the schema with the ODM's hydrated-document type, insert payloads derive from the model or document type, and no hand-written interface duplicates the schema shape.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/**/infrastructure/persistence/mongoose/types/**`, `src/contexts/**/infrastructure/persistence/mongoose/schemas/**` · Src: [10], [12], project: docs/data-model.md
- **[DATA-33] Persistence types never leak into domain, application or HTTP** — Repository ports return domain entities or domain stats, mappers return domain types, and no Mongoose document, `Types.ObjectId`, schema class or aggregate type appears in domain, application or HTTP DTO shapes.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/contexts/**/domain/repositories/**`, `src/contexts/**/application/**`, `src/contexts/**/infrastructure/persistence/mongoose/mappers/**` · Src: [10], project: docs/architecture.md §4.1
- **[DATA-34] Insert-payload mappers convert every boundary type** — Each contract field is converted to its persistence representation (id type, array or embedded subdocument) before `create`; no repository passes a raw DTO or domain entity to the ODM.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/**/infrastructure/persistence/mongoose/mappers/**`, `src/contexts/**/infrastructure/persistence/mongoose/repository/**` · Src: [10], [12], project: docs/data-model.md
- **[DATA-35] Patch writes preserve omit-means-preserve** — PATCH payloads are flattened to dot-notation `$set` fields, undefined keys are stripped rather than written as null, and array-element updates use array filters so untouched assignments keep their values.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/shared/infrastructure/persistence/mongoose/helpers/**`, `src/contexts/**/infrastructure/persistence/mongoose/repository/**` · Src: [9], [10], project: docs/data-model.md
- **[DATA-36] Published persistence mappers stay pure** — A published persistence shape and its mapper import no ODM types, map fields one-to-one, and are consumed by the other context instead of importing the owner's schema.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question-theme/contracts/persistence/**`, `src/contexts/question/infrastructure/persistence/mongoose/mappers/**` · Src: [10], project: docs/architecture.md §5.4

## 7. Migrations and schema evolution

- **[DATA-37] The migration gap is documented and every schema change carries its data plan** — No migration tool or script exists; the absence of a migration policy is recorded as a known limitation, and every schema change names its backfill, compatibility and consumer steps in the pull request until a tool is adopted.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `package.json`, `scripts/**`, `src/contexts/**/infrastructure/persistence/mongoose/schemas/**` · Src: [4], project: docs/data-model.md
- **[DATA-38] Schema evolution stays backward-compatible by default** — New fields are optional or carry a safe default, a new required field ships only with a backfill plan, and a removed field is first made optional and left unread for a deprecation window; no code path silently transforms existing documents.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/**/infrastructure/persistence/mongoose/schemas/**`, `src/contexts/**/infrastructure/persistence/mongoose/mappers/**` · Src: [4], project: docs/data-model.md

## 8. Connection and transactions

- **[DATA-39] One bounded database connection is configured** — The database module registers a single asynchronous ODM connection built from validated settings, with documented selection/connect timeouts and bounded retries; no repository opens an ad-hoc second connection; the current values are recorded in `docs/data-model.md`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/database/**`, `src/infrastructure/api/config/schemas/**` · Src: [10], [14], project: docs/data-model.md
- **[DATA-40] Multi-document transactions are not required by the current model** — Related data is embedded in the question document, so assignment writes are single-document atomic and no multi-document transaction is used; an invariant that spans documents requires an explicit transaction design before it is introduced.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/infrastructure/persistence/mongoose/repository/**`, `src/contexts/question/infrastructure/persistence/mongoose/schemas/**` · Src: [8], [9], project: docs/architecture.md §5.5

## Sources

[1] MongoDB — Data Modeling: https://www.mongodb.com/docs/manual/data-modeling/ (fetched 2026-11-04)
[2] MongoDB — Indexes: https://www.mongodb.com/docs/manual/indexes/ (fetched 2026-11-04)
[3] MongoDB — Unique Indexes: https://www.mongodb.com/docs/manual/core/index-unique/ (fetched 2026-11-04)
[4] MongoDB — Schema Validation: https://www.mongodb.com/docs/manual/core/schema-validation/ (fetched 2026-11-04)
[5] MongoDB — $lookup (aggregation): https://www.mongodb.com/docs/manual/reference/operator/aggregation/lookup/ (fetched 2026-11-04)
[6] MongoDB — $sample (aggregation): https://www.mongodb.com/docs/manual/reference/operator/aggregation/sample/ (fetched 2026-11-04)
[7] MongoDB — $facet (aggregation): https://www.mongodb.com/docs/manual/reference/operator/aggregation/facet/ (fetched 2026-11-04)
[8] MongoDB — Transactions: https://www.mongodb.com/docs/manual/core/transactions/ (fetched 2026-11-04)
[9] MongoDB — Atomicity and Transactions: https://www.mongodb.com/docs/manual/core/write-operations-atomicity/ (fetched 2026-11-04)
[10] Mongoose — Schemas: https://mongoosejs.com/docs/guide.html (fetched 2026-11-04)
[11] Mongoose — Subdocuments: https://mongoosejs.com/docs/subdocs.html (fetched 2026-11-04)
[12] Mongoose — Model: https://mongoosejs.com/docs/api/model.html (fetched 2026-11-04)
[13] MongoDB — Aggregation Pipeline: https://www.mongodb.com/docs/manual/core/aggregation-pipeline/ (fetched 2026-11-04)
[14] Mongoose — Connections: https://mongoosejs.com/docs/connections.html (fetched 2026-11-04)
