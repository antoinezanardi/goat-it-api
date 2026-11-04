# PERF — Performance

Query and response performance of the Goat It API: the indexing policy of the `questions` and `question_themes` collections, query and aggregation efficiency (theme-resolution pipeline, semantic sorts, random sampling, stats facets), N+1 avoidance across use cases and mappers, pagination and page-size bounds, payload size and response shape, and the HTTP caching posture (health `no-store`, non-cacheable API responses). Checks verify the code implements what `docs/performance.md` documents, and that the documented Known limitations (unindexed filter fields, `$expr` completeness scans, read-after-write round trips, unbounded list limits) are the only divergences.

**Decision doc:** `docs/performance.md` (section `## GOAT audit decisions`). **Diff triggers:** see SKILL.md category index.

**Not in this category:** Mongo schema definition → DATA · timeouts/retries → REL · rate limiting → SEC

## Contents

- [1. Indexes](#1-indexes)
- [2. Query efficiency](#2-query-efficiency)
- [3. N+1 avoidance](#3-n1-avoidance)
- [4. Pagination and bounds](#4-pagination-and-bounds)
- [5. Payload size and shape](#5-payload-size-and-shape)
- [6. Caching posture](#6-caching-posture)
- [Sources](#sources)

## 1. Indexes

- **[PERF-01] Unique slug index doubles as the dedup backstop** — `question_themes.slug` carries the repository's only unique index (`unique: true, index: true`) and doubles as the race-safe slug-deduplication backstop through duplicate key code `MONGO_DUPLICATE_KEY_ERROR_CODE = 11000`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question-theme/infrastructure/persistence/mongoose/schemas/**`, `src/shared/infrastructure/persistence/mongoose/constants/**` · Src: [9], project: docs/performance.md
- **[PERF-02] Nested themeId index serves the join paths** — `questions.themes.themeId` carries `index: true` and serves the cross-context `$lookup` and the live-count `$elemMatch` path.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/infrastructure/persistence/mongoose/schemas/**` · Src: [9], [15], project: docs/performance.md
- **[PERF-03] New indexes only for exercised query paths** — Every added top-level index targets a filterable/sortable field exercised by a find DTO (`status`, `category`, `cognitiveDifficulty`, `createdAt`, `isAdultContent`, `author.role`) and is recorded in `docs/performance.md`; no speculative or redundant index is added.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/infrastructure/persistence/mongoose/schemas/**`, `src/contexts/question/application/dto/**` · Src: [11], project: docs/performance.md
- **[PERF-04] Theme-stats compound index gap stays recorded** — The theme-stats inner match filters `themes.themeId` + `status` while only `themes.themeId` is indexed; a compound index is added when this lookup becomes a measured bottleneck, and until then the limitation stays recorded in `docs/performance.md`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question-theme/infrastructure/persistence/mongoose/repository/pipelines/**`, `src/contexts/question/infrastructure/persistence/mongoose/schemas/**` · Src: [6], [11], project: docs/performance.md
- **[PERF-05] Index set matches the documented policy** — Each collection's index set matches the index table in `docs/performance.md` (unique `slug` on `question_themes`, `themes.themeId` on `questions`, default `_id` only); adding or removing an index updates the table in the same change.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `src/contexts/question/infrastructure/persistence/mongoose/schemas/**`, `src/contexts/question-theme/infrastructure/persistence/mongoose/schemas/**` · Src: [11], project: docs/performance.md

## 2. Query efficiency

- **[PERF-06] List reads filter before resolving themes** — Question `findAll` and `findById` run one aggregation in the order match (filters or `_id`) → theme pipeline → sort → optional `$limit`; list endpoints never load an unfiltered collection into the application for slicing or mapping.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/contexts/question/infrastructure/persistence/mongoose/repository/**` · Src: [6], project: docs/performance.md
- **[PERF-07] Semantic sorts compute priority in-memory and clean up** — Semantic sorts (`status`, `cognitiveDifficulty`) add an in-memory `_sortPriority` computed with `$indexOfArray` and remove it with `$unset` afterwards; plain fields use a single `$sort` stage with `_id` as tiebreaker.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/shared/infrastructure/persistence/mongoose/helpers/**`, `src/contexts/question/domain/constants/**` · Src: [7], project: docs/performance.md
- **[PERF-08] Random read is bounded by the DTO limit** — `findRandom` runs match (active status + filters + locale conditions) → `$sample: { size: limit }` → theme pipeline → in-memory shuffle; the sample size equals the DTO-bounded limit and never approaches the collection size.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/contexts/question/infrastructure/persistence/mongoose/repository/**`, `src/contexts/question/application/dto/find-random-questions-body/**` · Src: [4], project: docs/performance.md
- **[PERF-09] One facet per stats call** — Question and theme stats are computed in a single `$facet` aggregation each; no per-bucket aggregation and no client-side grouping.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/infrastructure/persistence/mongoose/repository/pipelines/**`, `src/contexts/question-theme/infrastructure/persistence/mongoose/repository/pipelines/**` · Src: [5], project: docs/performance.md
- **[PERF-10] Theme reads stay point/range queries** — Theme `findAll` is `find(filter).sort(criteria).limit()` and `findById`, `findByIds` (`$in`) and `findBySlug` remain point/range queries built with the shared sort helper.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `src/contexts/question-theme/infrastructure/persistence/mongoose/repository/**` · Src: [10], project: docs/performance.md
- **[PERF-11] Live count uses the indexed element match** — `countLiveByThemeId` runs `countDocuments` with `$elemMatch` on the indexed `themes.themeId` plus `status $in [pending, active]`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/infrastructure/persistence/mongoose/repository/**` · Src: [14], [15], project: docs/performance.md
- **[PERF-12] Completeness `$expr` stays off the indexable paths** — The dynamic `$expr` completeness condition is used only where the shape requires it (questions, stats); themes and the random endpoint use the static or single-locale indexable variants.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/shared/infrastructure/persistence/mongoose/helpers/**`, `src/contexts/question/infrastructure/persistence/mongoose/repository/helpers/**`, `src/contexts/question-theme/infrastructure/persistence/mongoose/repository/helpers/**` · Src: [8], project: docs/performance.md

## 3. N+1 avoidance

- **[PERF-13] One lookup per query for theme resolution** — Question lists resolve themes with a single `$lookup` per query, never one lookup per question.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/contexts/question/infrastructure/persistence/mongoose/repository/pipelines/**` · Src: [6], project: docs/performance.md
- **[PERF-14] Creation resolves all themes in one call** — Question creation validates every referenced theme id with one `findByIds` call, not one lookup per theme.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question-theme/application/use-cases/get-question-themes-by-ids-or-throw/**`, `src/contexts/question/application/use-cases/create-question/**` · Src: [10], project: docs/performance.md
- **[PERF-15] Stats join once per call** — Theme stats count active questions with one `$lookup` per stats call, never one count per theme.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question-theme/infrastructure/persistence/mongoose/repository/pipelines/**` · Src: [6], project: docs/performance.md
- **[PERF-16] No per-item fetches anywhere** — No use case or mapper fetches per item in a loop; the only per-request overhead is the documented read-after-write double round trip on question writes.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/contexts/question/application/**`, `src/contexts/question-theme/application/**`, `src/contexts/question/infrastructure/persistence/mongoose/repository/**` · Src: [1], project: docs/performance.md

## 4. Pagination and bounds

- **[PERF-17] Shared limit coercion and default** — The shared `limit` validator coerces a non-negative integer with `LIMIT_DEFAULT = 50` and `LIMIT_MINIMUM = 0`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/shared/application/dto/zod/validators/limit/**` · Src: [2], project: docs/performance.md
- **[PERF-18] Unlimited means no limit stage** — `hasLimit` treats `undefined` and `0` as unlimited, and the adapter omits the `$limit` stage for them; `0` never produces a zero-result query.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/shared/domain/rules/limit/**`, `src/contexts/question/infrastructure/persistence/mongoose/repository/**` · Src: [10], project: docs/performance.md
- **[PERF-19] Limit-only pagination** — No offset, cursor or page parameter exists in any find DTO; list pagination is limit-only and documented as such.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/shared/domain/types/find/**`, `src/shared/application/mappers/find-all-query-dto/**`, `src/contexts/question/application/dto/**`, `src/contexts/question-theme/application/dto/**` · Src: [2], project: docs/performance.md
- **[PERF-20] Unbounded lists stay a documented limitation** — `limit=0` (unlimited) stays reachable on the four list endpoints and is recorded as a Known limitation in `docs/performance.md`; a server-side ceiling or cursor pagination added later updates the doc in the same change.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/shared/application/dto/zod/validators/limit/**`, `src/contexts/question/infrastructure/http/controllers/**`, `src/contexts/question-theme/infrastructure/http/controllers/**` · Src: [2], project: docs/performance.md
- **[PERF-21] Random limit bounded 1-50** — The random endpoint enforces `FIND_RANDOM_QUESTIONS_BODY_LIMIT_MINIMUM = 1` .. `FIND_RANDOM_QUESTIONS_BODY_LIMIT_MAXIMUM = 50` with default `FIND_RANDOM_QUESTIONS_BODY_LIMIT_DEFAULT = 20`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/application/dto/find-random-questions-body/**` · Src: [2], project: docs/performance.md
- **[PERF-22] ids filter capped at 100** — The `ids` filter accepts `QUESTION_IDS_FILTER_MINIMUM = 1` .. `QUESTION_IDS_FILTER_MAXIMUM = 100` unique values.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/application/dto/shared/constants/**` · Src: [2], project: docs/performance.md
- **[PERF-23] excludedIds capped at 5000** — The random `excludedIds` filter accepts `FIND_RANDOM_QUESTIONS_BODY_EXCLUDED_IDS_MINIMUM = 1` .. `FIND_RANDOM_QUESTIONS_BODY_EXCLUDED_IDS_MAXIMUM = 5000` unique values.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/application/dto/find-random-questions-body/**` · Src: [2], project: docs/performance.md
- **[PERF-24] Default sorts defined once** — Questions default to `createdAt` descending and themes to `slug` ascending, with `_id` tiebreakers, taken from the sort constants shared by the adapters.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `src/contexts/question/application/dto/shared/constants/**`, `src/contexts/question-theme/application/dto/shared/constants/**`, `src/shared/application/dto/zod/validators/sort/**` · Src: [2], project: docs/performance.md

## 5. Payload size and shape

- **[PERF-25] Document size structurally bounded** — Every question document is structurally bounded: ≤ 3 theme assignments, 1..5 source URLs, per-locale text entries ≤ 500 characters, per-locale text arrays ≤ 10 items, across at most 6 locales.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/contexts/question/domain/constants/**`, `src/shared/application/dto/zod/validators/localization/**` · Src: [2], project: docs/performance.md
- **[PERF-26] Response hydration is bounded** — Question responses embed at most 3 full theme snapshots per assignment, mappers perform no I/O while mapping, and response size is bounded by the document — never inflated by an extra fetch.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/contexts/question/application/mappers/**`, `src/contexts/question-theme/contracts/dto/**` · Src: [2], project: docs/performance.md
- **[PERF-27] Per-audience payload shape** — Game responses carry the resolved locale string(s) while admin responses carry the full partial per-locale records; neither audience receives fields it does not need.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/application/mappers/**`, `src/contexts/question-theme/contracts/dto/**` · Src: [2], project: docs/performance.md, project: docs/i18n.md
- **[PERF-28] Response shapes are strict** — Response DTOs use `z.strictObject` with documented fields, so no internal or persistence-only field reaches a response.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/application/dto/question/**`, `src/contexts/question-theme/contracts/dto/**` · Src: [16], project: docs/performance.md, project: docs/architecture.md §7.1
- **[PERF-29] Theme documents stay tiny** — Theme documents hold slug + 3 localized fields + optional color + timestamps; no sub-collections are embedded in theme documents.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `src/contexts/question-theme/infrastructure/persistence/mongoose/schemas/**` · Src: [2], project: docs/performance.md

## 6. Caching posture

- **[PERF-30] Health endpoint is no-store** — The health endpoint sets `Cache-Control` to `HEALTH_CACHE_CONTROL_VALUE` (`no-store`) through the shared constant, so probes never read a stale response.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/api/health/controllers/**`, `src/infrastructure/api/health/constants/**` · Src: [3], [12], project: docs/performance.md
- **[PERF-31] API responses are never shared-cacheable** — No controller or bootstrap code sets `public`/`max-age` caching on API responses; game responses vary per `Accept-Language` and auth identity and must never be served from a shared cache.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/contexts/question/infrastructure/http/controllers/**`, `src/contexts/question-theme/infrastructure/http/controllers/**`, `src/infrastructure/api/server/**` · Src: [3], [13], project: docs/performance.md
- **[PERF-32] Caching additions are documented first** — Before any response caching lands, `docs/performance.md` records the strategy with its variance keys (`Accept-Language`, API key, content) and the health endpoint keeps `no-store`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/infrastructure/http/controllers/**`, `src/infrastructure/api/server/**` · Src: [3], project: docs/performance.md
- **[PERF-33] Static assets are immutable-safe** — Files served from `public/` under `/public/` either change their URL when their content changes, or the serve-static setup adds long-lived cache headers; no mutable URL is served as immutable.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `src/app/app.module.ts`, `public/**` · Src: [3], [12]
- **[PERF-34] In-process caches stay bounded** — In-process caches (such as resolved configuration) are initialized once per process and never grow with request input.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/api/config/**` · Src: [1], project: docs/performance.md
- **[PERF-35] API TTFB budget** — Production p75 server response time for the paged list and by-id endpoints stays ≤ 800 ms (0.8-1.8 s needs improvement, > 1.8 s is poor).
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [1], project: docs/performance.md

## Sources

[1] Optimize Time to First Byte (web.dev): https://web.dev/articles/optimize-ttfb (fetched 2026-11-04)
[2] Performance budgets 101 (web.dev): https://web.dev/articles/performance-budgets-101 (fetched 2026-11-04)
[3] Prevent unnecessary network requests with the HTTP Cache (web.dev): https://web.dev/articles/http-cache (fetched 2026-11-04)
[4] MongoDB — $sample (aggregation): https://www.mongodb.com/docs/manual/reference/operator/aggregation/sample/ (fetched 2026-11-04)
[5] MongoDB — $facet (aggregation): https://www.mongodb.com/docs/manual/reference/operator/aggregation/facet/ (fetched 2026-11-04)
[6] MongoDB — $lookup (aggregation): https://www.mongodb.com/docs/manual/reference/operator/aggregation/lookup/ (fetched 2026-11-04)
[7] MongoDB — $indexOfArray (aggregation): https://www.mongodb.com/docs/manual/reference/operator/aggregation/indexOfArray/ (fetched 2026-11-04)
[8] MongoDB — $expr (query): https://www.mongodb.com/docs/manual/reference/operator/query/expr/ (fetched 2026-11-04)
[9] MongoDB — Unique Indexes: https://www.mongodb.com/docs/manual/core/index-unique/ (fetched 2026-11-04)
[10] Mongoose — Schemas (guide): https://mongoosejs.com/docs/guide.html (fetched 2026-11-04)
[11] MongoDB — Indexes: https://www.mongodb.com/docs/manual/indexes/ (fetched 2026-11-04)
[12] NestJS — Controllers: https://docs.nestjs.com/controllers (fetched 2026-11-04)
[13] Fastify — Reply: https://fastify.dev/docs/latest/Reference/Reply/ (fetched 2026-11-04)
[14] MongoDB — db.collection.countDocuments(): https://www.mongodb.com/docs/manual/reference/method/db.collection.countDocuments/ (fetched 2026-11-04)
[15] MongoDB — $elemMatch (query): https://www.mongodb.com/docs/manual/reference/operator/query/elemMatch/ (fetched 2026-11-04)
[16] Zod — API reference: https://zod.dev/api (fetched 2026-11-04)
