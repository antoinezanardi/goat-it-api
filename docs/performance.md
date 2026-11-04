# Performance

This document records the performance posture of the Goat It API (`goat-it-api`): the indexing policy, the query and aggregation patterns used by the persistence adapters, pagination and page-size limits, payload size guidance, and the performance-relevant decisions already present in `file:docs/architecture.md`. It is based on the Mongoose schemas (`file:src/contexts/question/infrastructure/persistence/mongoose/`, `file:src/contexts/question-theme/infrastructure/persistence/mongoose/`), the repository implementations, the find DTOs (`file:src/contexts/question/application/dto/`, `file:src/contexts/question-theme/application/dto/`, `file:src/shared/application/dto/`) and the aggregation pipelines. Every claim cites the repository file it is based on.

## Indexing policy and current indexes

The only indexes in the two collections today are:

| Collection | Index | Source |
|---|---|---|
| `question_themes` | unique index on `slug` | `@Prop({ unique: true, index: true })` in `file:src/contexts/question-theme/infrastructure/persistence/mongoose/schemas/question-theme.mongoose.schema.ts` |
| `questions` | default `_id` index only | the schema defines no top-level index (`file:src/contexts/question/infrastructure/persistence/mongoose/schemas/question.mongoose.schema.ts`) |
| `questions` (subdocument) | `themes.themeId` | `@Prop({ type: Types.ObjectId, ref: "question_themes", index: true })` in `file:src/contexts/question/infrastructure/persistence/mongoose/schemas/question-theme-assignment/question-theme-assignment.mongoose.schema.ts` |

Both schemas use `DEFAULT_MONGOOSE_SCHEMA_OPTIONS` (`timestamps: true`, `versionKey: false`, `_id: true`, `id: true`) from `file:src/shared/infrastructure/persistence/mongoose/constants/mongoose.constants.ts`. The `slug` unique index doubles as the race-safe slug-deduplication backstop (duplicate key code `MONGO_DUPLICATE_KEY_ERROR_CODE = 11000`, same constants file, mapped in `file:src/contexts/question-theme/infrastructure/persistence/mongoose/repository/helpers/question-theme.mongoose.helpers.ts`).

## Query patterns

### Question reads (`file:src/contexts/question/infrastructure/persistence/mongoose/repository/question.mongoose.repository.ts`)

- `findAll` and `findById` run an aggregation: `$match` (filters from `file:src/contexts/question/infrastructure/persistence/mongoose/repository/helpers/question-filter.mongoose.helpers.ts`) → the theme-resolution pipeline → sort → optional `$limit`.
- The theme-resolution pipeline (`file:src/contexts/question/infrastructure/persistence/mongoose/repository/pipelines/question-theme-assignment/question-theme-assignment.mongoose.repository.pipeline.ts`) does `$unwind` themes → `$lookup` on `question_themes` (on the indexed `themes.themeId` and theme `_id`) → `$unwind` → `$group` → `$replaceWith` → `$set` with `$sortArray` (primary first, then by theme slug). This is the accepted cross-context `$lookup` documented in `file:docs/architecture.md` §5.4: "revisit only if ... the join becomes a measurable performance bottleneck".
- Sorting: plain fields use a single `$sort` stage with `_id` as tiebreaker; semantic fields (`status`, `cognitiveDifficulty`) add an in-memory `_sortPriority` computed with `$indexOfArray` and are removed with `$unset` afterwards — `buildMongooseAggregationSortStages` in `file:src/shared/infrastructure/persistence/mongoose/helpers/mongoose.helpers.ts`; orders come from `QUESTION_STATUS_SORT_ORDER` / `QUESTION_COGNITIVE_DIFFICULTY_SORT_ORDER` (`file:src/contexts/question/domain/constants/question.constants.ts`).
- `countLiveByThemeId`: `countDocuments` with `$elemMatch` on `themes.themeId` (indexed) plus `status $in [pending, active]` — used to protect theme archiving.
- `findRandom` (public game endpoint): `$match` (active status, filters, locale + per-locale translation-completeness conditions) → `$sample: { size: limit }` → theme pipeline → in-memory `shuffleArray`. `$sample` is inherently index-unfriendly.
- Stats: one `$facet` aggregation computing total, by status/category/difficulty/author-role/rejection-type and translation-completeness counts (`file:src/contexts/question/infrastructure/persistence/mongoose/repository/pipelines/question-stats/question-stats.mongoose.repository.pipeline.ts`).

### Question-theme reads (`file:src/contexts/question-theme/infrastructure/persistence/mongoose/repository/question-theme.mongoose.repository.ts`)

- `findAll` is a plain `find(filter).sort(criteria)` with an optional `.limit` (`buildMongooseSortCriteria` in `file:src/shared/infrastructure/persistence/mongoose/helpers/mongoose.helpers.ts`); `findById`, `findByIds` (`$in`) and `findBySlug` are point/range queries.
- Stats run one pipeline that first performs a cross-collection `$lookup` into `questions` counting active questions per theme (`QUESTION_THEME_ACTIVE_QUESTION_COUNT_LOOKUP_STAGE` in `file:src/contexts/question-theme/infrastructure/persistence/mongoose/repository/pipelines/question-theme-stats/question-theme-stats.mongoose.repository.pipeline.ts`), then a `$facet`. The inner `$match` filters on `themes.themeId` and `status = active` using the published question persistence fields (`file:src/contexts/question/contracts/persistence/question.persistence.contracts.constants.ts`).

### Write patterns

- Question writes (`create`, `archive`, `assignTheme`, `removeTheme`, `modifyThemeAssignment`, `modify`) all re-read the question afterwards with `findById` to return a fully mapped entity — a deliberate read-after-write double round trip (`file:src/contexts/question/infrastructure/persistence/mongoose/repository/question.mongoose.repository.ts`). Primary promotion/demotion uses `bulkWrite` with two ordered `updateOne` operations whose operations are individually atomic but whose batch is not (same file), so a reader may observe the intermediate state and a mid-batch failure leaves the earlier operation committed; this matches the "conditional updates and update pipelines, not transactions" target in `file:docs/architecture.md` §5.5.
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

### Translation-completeness filter cost

- Static mode (question themes, and the single-locale variant used by random questions) emits plain per-locale field conditions (`buildFieldCompleteCondition`) that regular indexes could serve (`file:src/shared/infrastructure/persistence/mongoose/helpers/translation-completeness.mongoose.helpers.ts`).
- Dynamic mode (questions, and both stats pipelines) resolves each document's own `applicableLocales` inside an `$expr` with `$map`/`$getField`/`$allElementsTrue` (`buildDynamicFieldCompleteCondition`, same file) — not indexable, scans the collection.
- The question completeness specs check 4 fields (2 mandatory, 2 optional) and the theme specs 3 mandatory fields (constants files listed above); the number of per-field conditions scales with the locale count (up to 6).

### Read cost per endpoint

| Endpoint | Pattern | Cost drivers |
|---|---|---|
| `GET /questions`, `GET /admin/questions` | aggregation: match → theme `$lookup` → sort → limit | unindexed filter fields; `$lookup` into `question_themes` (uses indexed `_id` + `themes.themeId`) |
| `GET /questions/:id`, `GET /admin/questions/:id` | aggregation with single `_id` match | `_id` lookup is cheap; the `$lookup` still runs even for the admin response, which embeds themes |
| `GET /question-themes`, `GET /admin/question-themes` | plain `find().sort().limit()` | unindexed sort fields (`createdAt`, `status`) |
| `POST /questions/search/random` | match → `$sample` → theme `$lookup` → in-memory shuffle | `$sample` scan; unindexed match fields |
| `GET /admin/questions/stats`, `GET /admin/question-themes/stats` | single `$facet` aggregation | full scan per bucket group; dynamic completeness `$expr`; theme stats add a cross-collection `$lookup` per theme row |

## Performance decisions in docs/architecture.md

- Cross-context `$lookup` is accepted because both contexts share one MongoDB deployment; the join must be revisited "if the database is split or the join becomes a measurable performance bottleneck" (`file:docs/architecture.md` §5.4).
- Cross-context calls are read-only validation/query calls with no distributed transaction; consistency is best-effort and races should be tested (`file:docs/architecture.md` §5.5).
- Intra-question assignment writes must stay atomic via conditional updates/update pipelines, not MongoDB transactions (`file:docs/architecture.md` §5.5).

## Known limitations

- **No top-level indexes on `questions`.** `status`, `category`, `cognitiveDifficulty`, `createdAt`, `isAdultContent` and `author.role` are all filterable/sortable (public and admin find DTOs) yet unindexed; growing collections will rely on collection scans for these paths (verified: the question schema defines none, `file:src/contexts/question/infrastructure/persistence/mongoose/schemas/question.mongoose.schema.ts`).
- **`is-fully-translated` on questions is an `$expr` over `$map`/`$getField`** (`buildDynamicFieldCompleteCondition` in `file:src/shared/infrastructure/persistence/mongoose/helpers/translation-completeness.mongoose.helpers.ts`), which cannot use indexes — admin completeness filters and completeness stats scan the whole collection. Theme completeness filtering uses static per-field conditions instead, which is the indexable path (`buildFieldCompleteCondition`, same file).
- **Semantic sorts are in-memory**: `$indexOfArray` priorities are computed per result after filtering (`buildMongooseAggregationSortStages`), so `sort-by=status`/`cognitiveDifficulty` do not benefit from an index even if one existed.
- **No compound index for the theme-stats `$lookup`**: the inner match filters `themes.themeId` + `status`; only `themes.themeId` is indexed, so counting active questions per theme degrades with question volume.
- **`$sample` random questions** cannot use indexes; the endpoint is bounded to 50 results but the pre-sample `$match` still scans unindexed filter fields.
- **Unbounded list endpoints**: `limit=0` (unlimited) is accepted on `GET /questions`, `GET /admin/questions`, `GET /question-themes`, `GET /admin/question-themes`; there is no hard ceiling server-side (verified in `file:src/shared/application/dto/zod/validators/limit/limit.zod.validators.ts`).
- **Read-after-write double round trips** on every question write add latency by design (verified in the repository implementation).
