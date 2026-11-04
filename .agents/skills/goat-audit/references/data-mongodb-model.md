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

- **[DATA-01] Exactly two collections, both named by published constants** — The application persists exactly two collections, `questions` and `question_themes`; each name is published from the owning context's persistence contract and is consumed by the schema decorator, repositories and pipelines instead of being repeated as a string literal.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/contexts/**/contracts/persistence/**`, `src/contexts/**/infrastructure/persistence/mongoose/schemas/**`, `src/contexts/**/infrastructure/persistence/mongoose/repository/**` · Src: [1], [10], project: docs/data-model.md
- **[DATA-02] No stray, shadow or generated collections** — No schema, repository, script or container definition creates an additional application collection, a prefixed collection, a capped collection, a time-series collection or a view; a new persisted concept requires an approved design and a published constant.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/**/infrastructure/persistence/**`, `scripts/**`, `docker/**` · Src: [1], project: docs/data-model.md
- **[DATA-03] Collection names keep one documented casing** — Collection names use snake_case (`questions`, `question_themes`) while domain and TypeScript symbols keep their own casing; the mismatch is intentional and mapped only at the persistence boundary.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `src/contexts/**/contracts/persistence/**`, `src/contexts/**/infrastructure/persistence/mongoose/schemas/**` · Src: [1], project: docs/data-model.md
- **[DATA-04] Each collection has exactly one owning context** — The schema, repository and token for a collection are registered only in that context's persistence module; no other context re-registers, mutates or owns the same collection.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/**/infrastructure/persistence/*.module.ts`, `src/app/app.module.ts` · Src: [10], project: docs/architecture.md §6.2

## 2. Schema definition correctness

- **[DATA-05] Both document schemas mirror their domain entities** — Question documents carry `themes` (1-3 assignments), required `content` with localized `statement`/`answer` and optional `context`/`trivia`, category and cognitive-difficulty enums, `isAdultContent`, an author with role plus optional gameId/name, 1-5 `sourceUrls`, optional `applicableLocales` and optional `rejection`; theme documents carry required `slug`, localized `label`/`aliases`/`description`, optional `color` and a status enum defaulting to `active`.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/contexts/question/infrastructure/persistence/mongoose/schemas/**`, `src/contexts/question-theme/infrastructure/persistence/mongoose/schemas/**`, `src/contexts/**/domain/types/**` · Src: [1], [10], project: docs/data-model.md
- **[DATA-06] Enums and bounds come from domain constants** — Every enum list, default, minimum and maximum used by a schema is imported from the domain constants or a published persistence contract; no schema file re-declares a value list, a status default or a collection name by hand.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/**/infrastructure/persistence/mongoose/schemas/**`, `src/contexts/**/domain/constants/**`, `src/contexts/**/contracts/persistence/**` · Src: [10], project: docs/architecture.md §8.1
- **[DATA-07] Localized subdocuments use the shared schemas** — Every localized text or text-array field uses the shared localization sub-schemas, exposes exactly the six supported locales as optional entries, and stores no subdocument `_id` or timestamp.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/shared/infrastructure/persistence/mongoose/schemas/localization/**`, `src/contexts/**/infrastructure/persistence/mongoose/schemas/**` · Src: [10], [11], project: docs/data-model.md
- **[DATA-08] Schema options are centralized** — Top-level schemas use the shared options (`timestamps: true`, `versionKey: false`, `_id`/`id` enabled) and subdocuments use the shared subdocument options (`timestamps: false`, `_id`/`id` disabled); no schema silently overrides those defaults.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/shared/infrastructure/persistence/mongoose/constants/**`, `src/contexts/**/infrastructure/persistence/mongoose/schemas/**` · Src: [10], project: docs/data-model.md
- **[DATA-09] Mongoose strict mode stays enabled** — Schemas retain Mongoose's default strict behavior (no `strict: false`), and no write path bypasses schema enforcement, so unknown fields in a write are dropped or rejected instead of being persisted.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/**/infrastructure/persistence/mongoose/schemas/**`, `src/contexts/**/infrastructure/persistence/mongoose/repository/**` · Src: [10], project: docs/data-model.md
- **[DATA-10] Schema bounds agree with the API bounds** — The `themes` 1-3 and `sourceUrls` 1-5 bounds, the locale set, the category/cognitive-difficulty/status enums and the rejection-type enum match the domain constants and the request DTO bounds; changing a bound updates the schema and the API contract together.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/**/infrastructure/persistence/mongoose/schemas/**`, `src/contexts/**/application/dto/**`, `src/contexts/**/domain/constants/**` · Src: [10], project: docs/api-contract.md
- **[DATA-11] Optional fields are absent, never null** — Optional fields declare `required: false` and either `default: undefined` or no default; omitted optional values (`applicableLocales`, `color`, `author.gameId`, `author.name`, `rejection`, `rejection.comment`) are stored as absent, not as null.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/**/infrastructure/persistence/mongoose/schemas/**`, `src/shared/infrastructure/persistence/mongoose/schemas/**` · Src: [10], project: docs/data-model.md
- **[DATA-12] Schema files follow the placement convention** — Each schema lives in the plural `schemas/` directory, one class per file with its compiled schema constant exported beside it, and nested sub-schemas live in `schemas/<name>/` rather than being inlined into the parent file.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `src/contexts/**/infrastructure/persistence/mongoose/schemas/**`, `src/shared/infrastructure/persistence/mongoose/schemas/**` · Src: [10], project: docs/architecture.md §8.1

## 3. Indexes

- **[DATA-13] Slug uniqueness is enforced by a unique index** — `question_themes.slug` declares both `unique: true` and `index: true`, and duplicate-key code `11000` is translated to the domain slug-already-exists error rather than surfacing a raw 500.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/contexts/question-theme/infrastructure/persistence/mongoose/schemas/**`, `src/contexts/question-theme/infrastructure/persistence/mongoose/repository/helpers/**`, `src/shared/infrastructure/persistence/mongoose/constants/**` · Src: [2], [3], project: docs/data-model.md
- **[DATA-14] The theme reference path is indexed** — `questions.themes.themeId` declares `index: true`, backing theme filters, live-question counts and the theme-stats join.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/infrastructure/persistence/mongoose/schemas/**` · Src: [2], project: docs/data-model.md
- **[DATA-15] No speculative or duplicate index exists** — Beyond the implicit `_id` index, the unique slug index and the nested theme-id index, no compound, sparse, partial, TTL, text, wildcard or duplicate index is declared; the absence of indexes on the current filter/sort fields is recorded as a documented gap, and a new index targets an exercised query path and is recorded in the same change.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/**/infrastructure/persistence/mongoose/schemas/**` · Src: [2], project: docs/data-model.md
- **[DATA-16] The declared index set matches the documented inventory** — The documented index inventory lists every declared index with its collection, path and uniqueness, and no declared index is missing from the documentation or invented by it.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/**/infrastructure/persistence/mongoose/schemas/**` · Src: [2], project: docs/data-model.md
- **[DATA-17] Index build posture is explicit** — Index creation relies on Mongoose's startup index build with no explicit `syncIndexes` or `createIndexes` migration step; production index drift is recorded as a documented operational gap and is not silently assumed away.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/database/**`, `src/contexts/**/infrastructure/persistence/mongoose/schemas/**`, `scripts/**` · Src: [2], [10], project: docs/data-model.md

## 4. References and integrity

- **[DATA-18] Theme references are ObjectIds with an explicit ref** — Each `themes[].themeId` is a required `Types.ObjectId` whose `ref` is the published theme collection name; no string id, slug or duplicated literal stands in for the reference.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/contexts/question/infrastructure/persistence/mongoose/schemas/**`, `src/contexts/question-theme/contracts/persistence/**` · Src: [10], [11], project: docs/architecture.md §5.4
- **[DATA-19] There is no back-reference from themes to questions** — Theme documents store no question ids, counts or denormalized usage; question usage is derived at query time, so there is one source of truth and no dual write to keep consistent.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question-theme/infrastructure/persistence/mongoose/schemas/**`, `src/contexts/question/infrastructure/persistence/mongoose/repository/pipelines/**` · Src: [1], project: docs/data-model.md
- **[DATA-20] Assignment writes are single-document atomic and the 1-3/one-primary bound is documented at its real guarantee** — Theme assignment, removal and modification each run as a single-document atomic update (array operators and paired `bulkWrite` operations) with no multi-document transaction; the 1-3 bound is read-checked on assignment and validated by schema validators on creation; the one-primary invariant is enforced by creation Zod and preserved by the demote/promote write pattern (there is no primary-count read-check); the `_id`-only filters let concurrent assignment, removal and promotion race both bounds (TOCTOU) — recorded in `docs/domain-logic.md` and `docs/data-model.md`, tracked in #1271.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/contexts/question/infrastructure/persistence/mongoose/repository/**`, `src/contexts/question/domain/rules/**` · Src: [9], [8], project: docs/architecture.md §5.5
- **[DATA-21] Theme existence is application-enforced on writes** — Question creation and theme assignment load referenced themes through the published theme lookups and reject a missing or archived theme before writing; no database foreign key is assumed.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/application/use-cases/**`, `src/contexts/question-theme/application/use-cases/**`, `src/contexts/question/domain/rules/**` · Src: [9], [10], project: docs/architecture.md §5.5
- **[DATA-22] Archive protection counts live questions** — Archiving a theme is refused while any question with status `pending` or `active` references it; the count matches `themes.themeId` plus `status $in [pending, active]`, so archived and rejected questions do not block archiving.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/infrastructure/persistence/mongoose/repository/**`, `src/contexts/question-theme/application/use-cases/archive-question-theme/**` · Src: [1], project: docs/data-model.md, project: docs/architecture.md §5.4
- **[DATA-23] Archived themes are rejected on every write path** — Question creation and theme assignment both refuse an archived theme through the published theme surface, and the rule is owned by the context that writes the question rather than duplicated in persistence.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/application/use-cases/**`, `src/contexts/question/domain/rules/**`, `src/contexts/question-theme/domain/rules/**` · Src: [1], project: docs/architecture.md §5.3
- **[DATA-24] Cross-context persistence uses published contracts** — The theme-stats join and any cross-context read consume the published collection and field-name contracts; no cross-context pipeline hard-codes the other context's collection name, status value or nested theme field.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question-theme/infrastructure/persistence/mongoose/repository/pipelines/**`, `src/contexts/question/contracts/persistence/**`, `src/contexts/question-theme/contracts/persistence/**` · Src: [5], project: docs/architecture.md §5.4

## 5. Aggregation pipelines

- **[DATA-25] The theme join preserves every question and rebuilds assignments** — Question reads run `$unwind` with empty-array preservation, `$lookup` into the theme collection, a second preserving `$unwind`, a `$group` that rebuilds each assignment as `{ theme, isPrimary, isHint }`, a `$replaceWith` merge and a `$sortArray` that orders the primary first then by theme slug; a valid question's stored assignments are all returned once, with no duplicated theme from the join.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/contexts/question/infrastructure/persistence/mongoose/repository/pipelines/**` · Src: [5], [13], project: docs/data-model.md
- **[DATA-26] Filtering, joining, sorting and limiting run in the documented order** — List reads apply filter `$match` stages before the theme join, then sort and the optional limit; no post-join stage changes which documents match or how many are returned.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/infrastructure/persistence/mongoose/repository/**` · Src: [13], project: docs/data-model.md
- **[DATA-27] Random reads are active-only and bounded by `$sample`** — The random pipeline matches `status: active` plus the request filters, applies `$sample` with the DTO-bounded size before the theme join, and never returns archived or pending questions; the sample size cannot exceed the documented 1-50 range.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/contexts/question/infrastructure/persistence/mongoose/repository/**`, `src/contexts/question/application/dto/find-random-questions-body/**` · Src: [6], project: docs/data-model.md
- **[DATA-28] The question-stats facet is complete and typed** — One `$facet` produces the total, status/category/cognitive-difficulty/author-role/rejection-type rows and the fully/incomplete translation counts; rejection rows count only rejected questions, and empty buckets map to zero or an empty record rather than `undefined`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/infrastructure/persistence/mongoose/repository/pipelines/**`, `src/contexts/question/infrastructure/persistence/mongoose/types/**` · Src: [7], project: docs/data-model.md
- **[DATA-29] The theme-stats facet joins active questions only** — The `$lookup` counts only `status: active` questions whose `themes.themeId` contains the theme id, `$ifNull` defaults `activeQuestionCount` to 0, and the `$facet` returns total, status rows, per-theme counts (id and slug as strings) and translation-completeness counts.
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
- **[DATA-34] Insert-payload mappers convert every boundary type** — Contract ids become `ObjectId`s, source-url sets become arrays and assignment contracts become the embedded subdocument shape before `create`; no repository passes a raw DTO or domain entity to the ODM.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/**/infrastructure/persistence/mongoose/mappers/**`, `src/contexts/**/infrastructure/persistence/mongoose/repository/**` · Src: [10], [12], project: docs/data-model.md
- **[DATA-35] Patch writes preserve omit-means-preserve** — PATCH payloads are flattened to dot-notation `$set` fields, undefined keys are stripped rather than written as null, and array-element updates use array filters so untouched assignments keep their values.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/shared/infrastructure/persistence/mongoose/helpers/**`, `src/contexts/**/infrastructure/persistence/mongoose/repository/**` · Src: [9], [10], project: docs/data-model.md
- **[DATA-36] Published persistence mappers stay pure** — The published theme persistence shape and its mapper import no ODM types, map fields one-to-one and are consumed by the question context instead of importing the theme schema.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question-theme/contracts/persistence/**`, `src/contexts/question/infrastructure/persistence/mongoose/mappers/**` · Src: [10], project: docs/architecture.md §5.4

## 7. Migrations and schema evolution

- **[DATA-37] The migration gap is documented and every schema change carries its data plan** — No migration tool or script exists; the absence of a migration policy is recorded as a known limitation, and every schema change names its backfill, compatibility and consumer steps in the pull request until a tool is adopted.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `package.json`, `scripts/**`, `src/contexts/**/infrastructure/persistence/mongoose/schemas/**` · Src: [4], project: docs/data-model.md
- **[DATA-38] Schema evolution stays backward-compatible by default** — New fields are optional or carry a safe default, a new required field ships only with a backfill plan, and a removed field is first made optional and left unread for a deprecation window; no code path silently transforms existing documents.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/**/infrastructure/persistence/mongoose/schemas/**`, `src/contexts/**/infrastructure/persistence/mongoose/mappers/**` · Src: [4], project: docs/data-model.md

## 8. Connection and transactions

- **[DATA-39] One bounded database connection is configured** — The database module registers a single asynchronous ODM connection built from validated host/port/database settings, with `serverSelectionTimeoutMS` and `connectTimeoutMS` of 5000, retry delay 3000 and 5 retry attempts; no repository opens an ad-hoc second connection.
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
