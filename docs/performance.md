# Performance

This document records the performance posture of the Goat It API (`goat-it-api`): the indexing policy, the query and aggregation patterns used by the persistence adapters, pagination and page-size limits, payload size guidance, and the performance-relevant decisions already present in `file:docs/architecture.md`. It is based on the Mongoose schemas (`file:src/contexts/question/infrastructure/persistence/mongoose/`, `file:src/contexts/question-theme/infrastructure/persistence/mongoose/`), the repository implementations, the find DTOs (`file:src/contexts/question/application/dto/`, `file:src/contexts/question-theme/application/dto/`, `file:src/shared/application/dto/`) and the aggregation pipelines. Every claim cites the repository file it is based on.

## Indexing policy and current indexes

The context that owns a collection owns its indexes; a cross-context consumer requests an index from the owner and never declares it. `DEFAULT_MONGOOSE_SCHEMA_OPTIONS` (`file:src/shared/infrastructure/persistence/mongoose/constants/mongoose.constants.ts`) enables `autoIndex`, so missing indexes are built at application startup. Measure with `explain` before adding one, and do not add speculative indexes.

| Collection | Index | Source |
|---|---|---|
| `question_themes` | unique index on `slug` | `@Prop({ unique: true, index: true })` in `file:src/contexts/question-theme/infrastructure/persistence/mongoose/schemas/question-theme.mongoose.schema.ts` |
| `question_themes` | index on `status` | `@Prop({ index: true })` in the same schema |
| `questions` | compound `{ themes.themeId: 1, status: 1 }` | `QUESTION_MONGOOSE_SCHEMA.index(...)` in `file:src/contexts/question/infrastructure/persistence/mongoose/schemas/question.mongoose.schema.ts` |
| `questions` | default `_id` index only otherwise | the schema declares no other top-level index |

The `slug` unique index doubles as the race-safe slug-deduplication backstop (duplicate key code `MONGO_DUPLICATE_KEY_ERROR_CODE = 11000`, same constants file, mapped in `file:src/contexts/question-theme/infrastructure/persistence/mongoose/repository/helpers/question-theme.mongoose.helpers.ts`). The compound `questions` index is the indexed prefix for `countLiveByThemeId`, theme-filtered question lists and the theme-stats local/foreign join. The old standalone `themes.themeId` index is no longer declared; a deployment that already has it keeps it until it is dropped manually.

### Measurement

The index decisions were confirmed with `explain("executionStats")` on a 60-document dataset shaped like the acceptance fixtures:

- `countDocuments` with a `themes.$elemMatch.themeId` equality plus `status: { $in: [pending, active] }` selects the compound `{ themes.themeId: 1, status: 1 }` index (`themes.themeId_1_status_1`).
- A theme-filtered question list uses the same compound index for its `themes.themeId` predicate.
- The admin theme list with a `status` filter selects `question_themes.status_1` (`docsExamined` equals the number of archived themes).
- The theme-stats `$lookup` reports `indexesUsed: ["themes.themeId_1_status_1"]`, zero collection scans and zero document fetches for the joined side. A correlated `$expr`/`$in` sub-pipeline cannot use a multikey index, which is why the pipeline uses the local/foreign form.

Re-measure when a collection grows materially or a query shape changes. An index that the planner does not use is removed from the plan rather than kept speculatively.

Reproduce on the acceptance MongoDB (`pnpm run docker:acceptance-tests:start`) with a 60-document dataset:

```js
db.questions.find({ themes: { $elemMatch: { themeId: <id> } }, status: { $in: ["pending", "active"] } }).explain("executionStats");
db.question_themes.find({ status: "archived" }).explain("executionStats");
db.runCommand({
  explain: {
    aggregate: "question_themes",
    pipeline: [
      { $lookup: { from: "questions", localField: "_id", foreignField: "themes.themeId", pipeline: [{ $match: { status: "active" } }, { $count: "count" }], as: "activeQuestionLookup" } },
      { $match: { slug: "theme-0" } },
    ],
    cursor: {},
  },
  verbosity: "executionStats",
});
```

Read `winningPlan.indexName` (or `stages[].$lookup.indexesUsed`) plus `executionStats.totalDocsExamined` / `totalKeysExamined`.

## Query patterns

### Question reads (`file:src/contexts/question/infrastructure/persistence/mongoose/repository/question.mongoose.repository.ts`)

- `findAll` and `findById` run an aggregation: `$match` (filters from `file:src/contexts/question/infrastructure/persistence/mongoose/repository/helpers/question-filter.mongoose.helpers.ts`) → the theme-resolution pipeline → sort → optional `$limit`.
- The theme-resolution pipeline (`file:src/contexts/question/infrastructure/persistence/mongoose/repository/pipelines/question-theme-assignment/question-theme-assignment.mongoose.repository.pipeline.ts`) does `$unwind` themes → `$lookup` on `question_themes` (`localField: "themes.themeId"`, `foreignField: "_id"`, so the joined `_id` is indexed) → `$unwind` → `$group` → `$replaceWith` → `$set` with `$sortArray` (primary first, then by theme slug). This is the accepted cross-context `$lookup` documented in `file:docs/architecture.md` §5.4: "revisit only if ... the join becomes a measurable performance bottleneck".
- Sorting: plain fields use a single `$sort` stage with `_id` as tiebreaker; semantic fields (`status`, `cognitiveDifficulty`) add an in-memory `_sortPriority` computed with `$indexOfArray` and are removed with `$unset` afterwards — `buildMongooseAggregationSortStages` in `file:src/shared/infrastructure/persistence/mongoose/helpers/mongoose.helpers.ts`; orders come from `QUESTION_STATUS_SORT_ORDER` / `QUESTION_COGNITIVE_DIFFICULTY_SORT_ORDER` (`file:src/contexts/question/domain/constants/question.constants.ts`).
- `countLiveByThemeId`: `countDocuments` with `$elemMatch` on `themes.themeId` plus `status $in [pending, active]` — served by the compound `{ themes.themeId: 1, status: 1 }` index.
- `findRandom` (public game endpoint): `$match` (active status, filters, locale + per-locale translation-completeness conditions) → `$sample: { size: limit }` → theme pipeline → in-memory `shuffleArray`. `$sample` is inherently index-unfriendly.
- Stats: one `$facet` aggregation computing total, by status/category/difficulty/author-role/rejection-type and translation-completeness counts (`file:src/contexts/question/infrastructure/persistence/mongoose/repository/pipelines/question-stats/question-stats.mongoose.repository.pipeline.ts`).

### Question-theme reads (`file:src/contexts/question-theme/infrastructure/persistence/mongoose/repository/question-theme.mongoose.repository.ts`)

- `findAll` is a plain `find(filter).sort(criteria)` with an optional `.limit` (`buildMongooseSortCriteria` in `file:src/shared/infrastructure/persistence/mongoose/helpers/mongoose.helpers.ts`); `findById`, `findByIds` (`$in`) and `findBySlug` are point/range queries.
- Stats run one pipeline that first performs a cross-collection `$lookup` into `questions` counting active questions per theme (`QUESTION_THEME_ACTIVE_QUESTION_COUNT_LOOKUP_STAGE` in `file:src/contexts/question-theme/infrastructure/persistence/mongoose/repository/pipelines/question-theme-stats/question-theme-stats.mongoose.repository.pipeline.ts`), then a `$facet`. The inner `$match` filters on `themes.themeId` and `status = active` using the published question persistence fields (`file:src/contexts/question/contracts/persistence/question.persistence.contracts.constants.ts`).

### Write patterns

- Question writes (`create`, `archive`, `assignTheme`, `removeTheme`, `modifyThemeAssignment`, `modify`) all re-read the question afterwards with `findById` to return a fully mapped entity — a deliberate read-after-write double round trip (`file:src/contexts/question/infrastructure/persistence/mongoose/repository/question.mongoose.repository.ts`). The assignment writes use `updateOne` with a conditional filter and check `matchedCount`: a non-primary assignment is a conditional `$push`, a removal is a conditional `$pull`, and a primary assignment or promotion is one update pipeline (passed with `updatePipeline: true`) that demotes every other assignment and mutates the target in the same single-document write. The filter, not the schema validator or `runValidators`, enforces the duplicate, 1–3 and primary invariants.
- Question-theme writes return the updated document directly with `findByIdAndUpdate(..., { returnDocument: "after" })` (no extra read) and map duplicate-key errors (`file:src/contexts/question-theme/infrastructure/persistence/mongoose/repository/question-theme.mongoose.repository.ts`).

### N+1 risk assessment

No N+1 patterns were found: question lists resolve themes with a single `$lookup` per query (not per question), theme stats count questions in one `$lookup` per stats call, and question creation validates all theme IDs with one `findByIds` call (`file:src/contexts/question-theme/application/use-cases/get-question-themes-by-ids-or-throw/get-question-themes-by-ids-or-throw.use-case.ts`). The per-request overhead is the double round trip of question writes, documented above.

## Pagination and limits

- Shared list pagination is limit-only (`FindAllOptions` in `file:src/shared/domain/types/find/find.types.ts`; `createFindAllOptionsFromQueryDto` in `file:src/shared/application/mappers/find-all-query-dto/find-all-query-dto.mappers.ts`). There is no offset, cursor or page parameter anywhere in the find DTOs.
- `limit` query param (`file:src/shared/application/dto/zod/validators/limit/limit.zod.validators.ts`): coerced non-negative integer, `LIMIT_DEFAULT = 50`, `LIMIT_MINIMUM = 0` where **0 means unlimited** (`LIMIT_DESCRIPTION`, `file:src/shared/application/dto/zod/validators/limit/constants/limit.zod.validators.constants.ts`). `hasLimit` treats `undefined` and `0` as no `$limit` stage (`file:src/shared/domain/rules/limit/limit.rules.ts`). **There is no maximum page size for list endpoints** — a client can request unlimited results.
- Random questions endpoint has its own bounded limit: `FIND_RANDOM_QUESTIONS_BODY_LIMIT_MINIMUM = 1`, `FIND_RANDOM_QUESTIONS_BODY_LIMIT_MAXIMUM = 50`, `FIND_RANDOM_QUESTIONS_BODY_LIMIT_DEFAULT = 20` (`file:src/contexts/question/application/dto/find-random-questions-body/constants/find-random-questions-body.dto.constants.ts`).
- Filter-size caps: `ids` filter `QUESTION_IDS_FILTER_MINIMUM = 1` .. `QUESTION_IDS_FILTER_MAXIMUM = 100` (`file:src/contexts/question/application/dto/shared/constants/question-ids-filter-query.dto.constants.ts`); random `excludedIds` `FIND_RANDOM_QUESTIONS_BODY_EXCLUDED_IDS_MINIMUM = 1` .. `FIND_RANDOM_QUESTIONS_BODY_EXCLUDED_IDS_MAXIMUM = 5000` (same random-body constants file). Both are unique-value filters (`file:src/contexts/question/application/dto/zod/validators/question.dto.zod.validators.ts`).
- Default sort: questions `createdAt` descending (`QUESTION_SORT_BY_DEFAULT`, `SORT_ORDER_DEFAULT` in `file:src/contexts/question/application/dto/shared/constants/question-sort.dto.constants.ts` and `file:src/shared/application/dto/zod/validators/sort/constants/sort.zod.validators.constants.ts`); themes `slug` ascending (`file:src/contexts/question-theme/application/dto/shared/constants/question-theme-sort.dto.constants.ts`).

## Payload size guidance

Document size is structurally bounded by the domain constants: ≤ 3 theme assignments and 1..5 source URLs per question; per-locale text entries ≤ 500 chars and per-locale text arrays ≤ 10 items across at most 6 locales (`file:src/contexts/question/domain/constants/question.constants.ts`, `file:src/shared/application/dto/zod/validators/localization/constants/localization.zod.validators.constants.ts`). Theme documents are tiny (slug + 3 localized fields + optional color). Responses embed full theme snapshots per assignment, so a question response carries up to 3 theme objects (`createQuestionDtoFromEntity` in `file:src/contexts/question/application/mappers/question.mappers.ts`).

### Request body cap

Request bodies are capped at 512 KiB (524,288 bytes) by Fastify's `bodyLimit` (`file:src/infrastructure/api/server/fastify/constants/fastify.constants.ts`). The largest documented bounded request is the random-question `excludedIds` payload: 5,000 24-character ObjectIds serialize to about 135 KB (131.9 KiB), leaving about 3.88× headroom under the cap.

The cap bounds **bytes only**. The random-search body's `themeIds` array still has no element-count maximum, so a payload that stays under 512 KiB can still carry an unbounded number of theme ids (see `docs/api-contract.md`); the cap does not replace the missing element-count bound.

### Translation-completeness filter cost

- Static mode (question themes, and the single-locale variant used by random questions) emits plain per-locale field conditions (`buildFieldCompleteCondition`) that regular indexes could serve (`file:src/shared/infrastructure/persistence/mongoose/helpers/translation-completeness.mongoose.helpers.ts`).
- Dynamic mode (questions, and both stats pipelines) resolves each document's own `applicableLocales` inside an `$expr` with `$map`/`$getField`/`$allElementsTrue` (`buildDynamicFieldCompleteCondition`, same file) — not indexable, scans the collection.
- The question completeness specs check 4 fields (2 mandatory, 2 optional) and the theme specs 3 mandatory fields (constants files listed above); the number of per-field conditions scales with the locale count (up to 6).

### Read cost per endpoint

| Endpoint | Pattern | Cost drivers |
|---|---|---|
| `GET /questions`, `GET /admin/questions` | aggregation: match → theme `$lookup` → sort → limit | unindexed filter fields; `$lookup` into `question_themes` (uses indexed `_id` + `themes.themeId`) |
| `GET /questions/:id`, `GET /admin/questions/:id` | aggregation with single `_id` match | `_id` lookup is cheap; the `$lookup` still runs even for the admin response, which embeds themes |
| `GET /question-themes`, `GET /admin/question-themes` | plain `find().sort().limit()` | `status` filtering uses the new status index; sorting by `createdAt`/`status` still needs an in-memory sort because the `_id` tiebreaker prevents a pure index sort |
| `POST /questions/search/random` | match → `$sample` → theme `$lookup` → in-memory shuffle | `$sample` scan; unindexed match fields |
| `GET /admin/questions/stats`, `GET /admin/question-themes/stats` | single `$facet` aggregation | full scan per bucket group; dynamic completeness `$expr`; theme stats add an indexed local/foreign `$lookup` per theme row |

## Performance decisions in docs/architecture.md

- Cross-context `$lookup` is accepted because both contexts share one MongoDB deployment; the join must be revisited "if the database is split or the join becomes a measurable performance bottleneck" (`file:docs/architecture.md` §5.4).
- Cross-context calls are read-only validation/query calls with no distributed transaction; consistency is best-effort and races should be tested (`file:docs/architecture.md` §5.5).
- Intra-question assignment writes must stay atomic via conditional updates/update pipelines, not MongoDB transactions (`file:docs/architecture.md` §5.5).

## Response caching

No API response is cacheable. One root Fastify `onSend` hook (`file:src/infrastructure/api/server/cache/helpers/cache.helpers.ts`) sets `Cache-Control: no-store` and merges `Vary: Accept-Language` on every response, because the bodies vary by the `Accept-Language` header and by the API-key audience — the audience is covered by `no-store` and deliberately never becomes a cache-key component. The merge keeps an existing `Vary` value and never duplicates a token. The variance key set is therefore exactly `Accept-Language` for every non-static response.

The single exception is a successful (`200`, `206`) or revalidated (`304`) file response under `/public/` that still carries the `@fastify/static` signature (`Cache-Control: public, max-age=0` plus `ETag`/`Last-Modified`). Those responses keep the plugin headers, their validators and `Accept-Ranges`, and gain no `Vary`: asset filenames are not content-hashed, so a positive `max-age` or `immutable` would pin a stale file, while `max-age=0` lets a cache store the asset and revalidate it with one conditional request per use. A path prefix alone does not qualify — `/public/unknown` is a `404` and is `no-store`, and the Swagger assets under `/docs/**` are `no-store`.

Enabling any real caching later needs a per-route policy, validators, a reviewed `Vary` set and this section updated before the code changes.

## Known limitations

- **Only the compound theme-usage index exists on `questions`.** `status` alone, `category`, `cognitiveDifficulty`, `createdAt`, `isAdultContent`, `author.role` and the sort fields remain unindexed; growing collections rely on collection scans for those paths. Add an index only after an `explain` measurement shows it is used (`file:src/contexts/question/infrastructure/persistence/mongoose/schemas/question.mongoose.schema.ts`).
- **`is-fully-translated` on questions is an `$expr` over `$map`/`$getField`** (`buildDynamicFieldCompleteCondition` in `file:src/shared/infrastructure/persistence/mongoose/helpers/translation-completeness.mongoose.helpers.ts`), which cannot use indexes — admin completeness filters and completeness stats scan the whole collection. Theme completeness filtering uses static per-field conditions instead, which is the indexable path (`buildFieldCompleteCondition`, same file).
- **Semantic sorts are in-memory**: `$indexOfArray` priorities are computed per result after filtering (`buildMongooseAggregationSortStages`), so `sort-by=status`/`cognitiveDifficulty` do not benefit from an index even if one existed.
- **Correlated `$expr` lookups cannot use multikey indexes.** The theme-stats pipeline therefore uses the indexed `localField`/`foreignField` form for `themes.themeId` and applies the `status` match in the sub-pipeline; a `$expr`/`$in` correlated form would scan `questions` per theme.
- **Concurrency is proven at the repository layer, not end-to-end.** The acceptance harness has no parallel-request helper, so the conditional filters and update pipelines are pinned by repository specs and the use-case interleaving tests; no acceptance scenario fires two simultaneous writes.
- **`$sample` random questions** cannot use indexes; the endpoint is bounded to 50 results but the pre-sample `$match` still scans unindexed filter fields.
- **Unbounded list endpoints**: `limit=0` (unlimited) is accepted on `GET /questions`, `GET /admin/questions`, `GET /question-themes`, `GET /admin/question-themes`; there is no hard ceiling server-side (verified in `file:src/shared/application/dto/zod/validators/limit/limit.zod.validators.ts`).
- **Read-after-write double round trips** on every question write add latency by design (verified in the repository implementation).
