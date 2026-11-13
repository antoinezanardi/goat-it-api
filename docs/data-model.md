# Data model

This document is the verified inventory of the persisted data model of `goat-it-api` (MongoDB via Mongoose, NestJS 12): the exact collections, every field with type and bounds, the indexes declared in the schemas, the references between documents and how integrity is enforced, the aggregation pipelines used for reads and statistics, the connection/bootstrap setup, and the migration posture. It was written against the code on branch `feat/goat-audit`; every claim cites a repository path that exists. Gaps found during verification are recorded at the end.

## Connection and bootstrap

- `DatabaseModule` (`src/infrastructure/database/database.module.ts`) registers `MongooseModule.forRootAsync` with `DatabaseService` (`src/infrastructure/database/providers/database.service.ts`), which builds the URI `mongodb://<MONGODB_HOST>:<MONGODB_PORT>` and sets `dbName` to `MONGODB_DATABASE` (default `"goat-it"`, `src/infrastructure/api/config/constants/env.constants.ts`).
- Connection options: `serverSelectionTimeoutMS: 5000`, `connectTimeoutMS: 5000`, `retryDelay: 3000`, `retryAttempts: 5` (`src/infrastructure/database/constants/database.constants.ts`); connection lifecycle listeners log "connected"/"disconnected" (`database.service.ts`).
- Environment variables `MONGODB_HOST`, `MONGODB_PORT`, `MONGODB_DATABASE` are validated by `APP_ENV_SCHEMA` in `src/infrastructure/api/config/schemas/env.schema.ts` (port 1-65535, database name regex `^[\w-]+(?<!-)$`), mirrored in `env/.env.example`.
- Per-context persistence modules register exactly one Mongoose schema each: `QuestionPersistenceModule` (`src/contexts/question/infrastructure/persistence/question-persistence.module.ts`) and `QuestionThemePersistenceModule` (`src/contexts/question-theme/infrastructure/persistence/question-theme-persistence.module.ts`), both exporting their repository token.
- Acceptance tests run against a throwaway MongoDB: `docker/goat-it-api-acceptance-tests/docker-compose.yml` pins `image: mongo:9.0.8`, container `mongo-acceptance-tests`, port 27017, `MONGO_INITDB_DATABASE: goat-it-api-acceptance-tests`, a named volume `mongodb_data_container:/data/db`, and a `mongosh` ping healthcheck; started by the `docker:acceptance-tests:*` scripts in `package.json`. The volume survives `docker:acceptance-tests:stop` and is discarded by `docker:acceptance-tests:reset` (`down --volumes`). No production compose file exists in the repository — production MongoDB is external, configured by env.

## Collections

Exactly two collections exist. `grep "collection:"` across `src/` matches only the two schema decorators below; the names are published constants (not inline strings):

| Collection | Constant | Published from |
|---|---|---|
| `questions` | `QUESTION_MONGOOSE_COLLECTION_NAME` | `src/contexts/question/contracts/persistence/question.persistence.contracts.constants.ts` |
| `question_themes` | `QUESTION_THEME_MONGOOSE_COLLECTION_NAME` | `src/contexts/question-theme/contracts/persistence/question-theme.persistence.contracts.constants.ts` |

All documents use `DEFAULT_MONGOOSE_SCHEMA_OPTIONS` (`src/shared/infrastructure/persistence/mongoose/constants/mongoose.constants.ts`): `timestamps: true` (adds `createdAt`/`updatedAt` `Date`s), `versionKey: false`, `_id: true`, `id: true`. Subdocuments use `DEFAULT_SUBDOCUMENT_MONGOOSE_SCHEMA_OPTIONS` (same base with `timestamps: false`, `_id: false`, `id: false`).

## `questions` collection

Schema: `src/contexts/question/infrastructure/persistence/mongoose/schemas/question.mongoose.schema.ts`, with sub-schemas in `schemas/question-theme-assignment/`, `schemas/question-content/`, `schemas/question-author/`, `schemas/question-rejection/` (all under `.../persistence/mongoose/schemas/`). Field bounds come from `src/contexts/question/domain/constants/question.constants.ts`.

| Field | Type | Constraints |
|---|---|---|
| `_id` | ObjectId | primary key from schema options (base type `MongooseCollectionSchemaBase`, `src/shared/infrastructure/persistence/mongoose/types/mongoose.types.ts`) |
| `themes` | array of `QuestionThemeAssignmentMongooseSchema` | required; `minItems: 1`, `maxItems: 3` (`QUESTION_THEME_ASSIGNMENTS_MIN_ITEMS`/`_MAX_ITEMS`) |
| `themes[].themeId` | `Types.ObjectId` | required; `ref: "question_themes"`; `index: true` (`question-theme-assignment.mongoose.schema.ts`) |
| `themes[].isPrimary` | Boolean | required, default `false` |
| `themes[].isHint` | Boolean | required, default `false` |
| `content` | `QuestionContentMongooseSchema` | required (`question-content.mongoose.schema.ts`) |
| `content.statement` / `content.answer` | `LocalizedText` (en/fr/es/de/it/pt optional strings) | required |
| `content.context` | `LocalizedText` | optional |
| `content.trivia` | `LocalizedTexts` (locale → string arrays) | optional |
| `category` | String | required; enum `QUESTION_CATEGORIES = ["trivia", "lexicon", "riddle", "explanation"]` |
| `cognitiveDifficulty` | String | required; enum `["easy", "medium", "hard"]` |
| `isAdultContent` | Boolean | required |
| `author` | `QuestionAuthorMongooseSchema` | required (`question-author.mongoose.schema.ts`) |
| `author.role` | String | required; enum `QUESTION_AUTHOR_ROLES = ["admin", "game", "ai"]` |
| `author.gameId` | `Types.ObjectId` | optional |
| `author.name` | String | optional |
| `status` | String | required; enum `QUESTION_STATUSES = ["pending", "active", "archived", "rejected"]` |
| `sourceUrls` | String array | required; `minItems: 1`, `maxItems: 5` (`QUESTION_SOURCE_URLS_MIN/MAX_ITEMS`) |
| `applicableLocales` | String array | optional, default `undefined`; values enum `LOCALES` (`src/shared/domain/value-objects/locale/locale.constants.ts`) |
| `rejection` | `QuestionRejectionMongooseSchema` | optional (`question-rejection.mongoose.schema.ts`) |
| `rejection.type` | String | required when present; enum `QUESTION_REJECTION_TYPES = ["inappropriate-content", "incorrect-information", "poor-quality", "duplicate-question", "other"]` |
| `rejection.comment` | String | optional |
| `createdAt`, `updatedAt` | Date / Date | from schema options (base type `MongooseCollectionSchemaBase`, `src/shared/infrastructure/persistence/mongoose/types/mongoose.types.ts`) |

The shared localization sub-schemas are `LocalizedTextMongooseSchema` and `LocalizedTextsMongooseSchema` in `src/shared/infrastructure/persistence/mongoose/schemas/localization/` (per-locale optional `String` / `String[]` props for `en`, `fr`, `es`, `de`, `it`, `pt`).

## `question_themes` collection

Schema: `src/contexts/question-theme/infrastructure/persistence/mongoose/schemas/question-theme.mongoose.schema.ts`.

| Field | Type | Constraints |
|---|---|---|
| `_id` | ObjectId | primary key from schema options |
| `slug` | String | required; `unique: true`; `index: true` |
| `label` | `LocalizedText` | required (`Partial<LocalizedText>`) |
| `aliases` | `LocalizedTexts` | required |
| `description` | `LocalizedText` | required |
| `color` | String | optional (hex color validated at the API boundary; `SLUG_REGEX`/`HEX_COLOR_REGEX` live in `src/shared/application/dto/zod/validators/string/constants/string.zod.validators.constants.ts`) |
| `status` | String | required; enum `QUESTION_THEME_STATUSES = ["active", "archived"]`; default `DEFAULT_QUESTION_THEME_STATUS = "active"` (`src/contexts/question-theme/domain/constants/question-theme.constants.ts`) |
| `createdAt`, `updatedAt` | Date / Date | from schema options |

## Indexes

Declared indexes (verified by grep for `index`/`unique` across all schema files):

- `question_themes.slug` — `unique: true` + `index: true` (`question-theme.mongoose.schema.ts:20-24`). Backs the slug uniqueness rule; duplicate-key errors (`code 11000`, `MONGO_DUPLICATE_KEY_ERROR_CODE` in `mongoose.constants.ts`) are translated to `QuestionThemeSlugAlreadyExistsError` by `throwIfDuplicateKeyError` in `src/contexts/question-theme/infrastructure/persistence/mongoose/repository/helpers/question-theme.mongoose.helpers.ts`.
- `questions.themes.themeId` — `index: true` on the subdocument path (`question-theme-assignment.mongoose.schema.ts:12-17`), backing the theme-stats join and theme filters.
- Every collection also has the implicit `_id` index; no other index (compound, sparse, TTL) is declared anywhere. Query fields such as `questions.status`, `category`, `author.role`, `isAdultContent` have **no** dedicated indexes — this is a verified gap for large collections (see Migration posture below).

## References and integrity

- A question references its themes by `themes[].themeId` (`ObjectId`; the current `ref` is the collection name `"question_themes"`, which should name the registered model if `populate()` is ever used), not by slug. There is no back-reference: theme documents know nothing about questions; question usage is derived at query time.
- MongoDB has no foreign-key enforcement here, so integrity is application-enforced:
  - Theme existence on assignment is validated through the published `FindQuestionThemeByIdUseCase` / `GetQuestionThemesByIdsOrThrowUseCase` (published surface register, `docs/architecture.md` §5.2).
  - Archive protection: `QuestionThemeReferencedByLiveQuestionsError` (409 via `GlobalExceptionFilter`) when the theme still has live questions; `CountLiveQuestionsByThemeIdUseCase` counts `pending + active` (`src/contexts/question/infrastructure/persistence/mongoose/repository/question.mongoose.repository.ts` `countLiveByThemeId`).
  - Question creation rejects archived themes via `ReferencedQuestionThemeArchivedError` (`docs/architecture.md` §5.3).
  - The 3-theme maximum and 1-theme minimum are enforced by domain policies at read-check time; the schema `minItems`/`maxItems` validators document the invariant but are not the authority on updates (`docs/architecture.md` §5.5).
  - Cross-context consistency is deliberately best-effort (no distributed transaction, `docs/architecture.md` §5.5); assignment and removal are single-operation atomic writes (array operators), but assignment and removal filter on `_id` only and use an unconditional `$push`/`$pull`, so concurrent writes can race the 1–3 bound (known concurrency limitation tracked in #1271, no conditional `$expr` guard yet). Two concurrent promotions can likewise leave the question without exactly one primary. Primary promotion (`assignNewPrimaryTheme`) is an ordered two-operation `bulkWrite` whose operations are individually atomic but whose batch is not — it demotes all assignments then pushes the new one (`question.mongoose.repository.ts:185-221`), so a reader may observe the intermediate state and a second-operation failure leaves the demotion committed. Conditional primary updates are part of #1271.

## Aggregation pipelines

- **Question reads.** `findAll`, `findById` and `findRandom` aggregate with `QUESTION_MONGOOSE_REPOSITORY_PIPELINE` (`src/contexts/question/infrastructure/persistence/mongoose/repository/pipelines/question.mongoose.repository.pipeline.ts`, composed of `QUESTION_THEME_ASSIGNMENT_MONGOOSE_REPOSITORY_PIPELINE` in `pipelines/question-theme-assignment/`): `$unwind themes` (preserving empty arrays) → `$lookup` into `question_themes` on `themes.themeId` → second `$unwind` → `$group` (keep `_root`, rebuild `themes` with `{ theme, isPrimary, isHint }`) → `$replaceWith` merge → `$set` `$sortArray` (primary first, then `theme.slug` ascending). `findAll` prepends filter `$match` stages (`buildQuestionAggregationFilterStages`, `.../repository/helpers/question-filter.mongoose.helpers.ts`) and appends sort/limit stages; `findRandom` matches `status: "active"` + filters, then `$sample { size: limit }` before the pipeline, and shuffles the result client-side.
- **Sorting in aggregations.** `buildMongooseAggregationSortStages` (`src/shared/infrastructure/persistence/mongoose/helpers/mongoose.helpers.ts`) emits a plain `$sort` (with `_id` tiebreaker) except for semantic fields, which use `$addFields { _sortPriority: { $indexOfArray: [...] } }` + `$sort` + `$unset`: `cognitiveDifficulty` and `status` for questions (`QUESTION_SEMANTIC_SORT_ORDERS`, `src/contexts/question/infrastructure/persistence/mongoose/constants/question.mongoose.constants.ts`).
- **Question stats** (`pipelines/question-stats/question-stats.mongoose.repository.pipeline.ts`): one `$facet` with a `$count` total, `$group`-then-`$replaceRoot($arrayToObject)` rows for status/category/cognitiveDifficulty/author role/rejection type (rejection restricted to `status: "rejected"`), and fully/incompletely-translated counts via `buildIsFullyTranslatedMatchCondition` (`src/shared/infrastructure/persistence/mongoose/helpers/translation-completeness.mongoose.helpers.ts`; mandatory fields `content.statement`/`content.answer`, optional `content.context`/`content.trivia` per `QUESTION_TRANSLATION_COMPLETENESS_FIELD_SPECS`).
- **Theme stats** (`src/contexts/question-theme/infrastructure/persistence/mongoose/repository/pipelines/question-theme-stats/question-theme-stats.mongoose.repository.pipeline.ts`): `$lookup` into `questions` counting only `status: "active"` questions whose `themes.themeId` contains the theme id (field names via the published `QUESTION_THEME_USAGE_PERSISTENCE_FIELDS` contract, never hardcoded) → `$addFields activeQuestionCount` (`$ifNull`, default 0) → `$facet` (total, status rows, per-theme `byQuestionCount` sorted by slug projecting `themeId`/`themeSlug`/`activeQuestionCount`, translation-completeness counts with mandatory `label`/`aliases`/`description`).
- **Theme reads** do not aggregate: `findAll` uses `.find().sort().limit()` and `findById`/`findBySlug`/`findByIds` are direct queries (`src/contexts/question-theme/infrastructure/persistence/mongoose/repository/question-theme.mongoose.repository.ts`).

## Document types and insert payloads

- Document types: `QuestionMongooseDocument = HydratedDocument<QuestionMongooseSchema>` (`src/contexts/question/infrastructure/persistence/mongoose/types/question.mongoose.types.ts`) and `QuestionThemeMongooseDocument` (`.../question-theme/types/question-theme.mongoose.types.ts`); the aggregate shapes for `aggregate()` results (`QuestionAggregate`, `QuestionThemeAssignmentAggregate`) and the stats result shapes (`QuestionStatsAggregationResult`, `QuestionThemeStatsAggregationResult`) live in the same files.
- Insert payloads: `QuestionMongooseInsertPayload = Parameters<Model<...>["create"]>[0]` and `QuestionThemeAssignmentMongooseInsertPayload = QuestionMongooseDocument["themes"][number]` (`question.mongoose.types.ts`). `createQuestionMongooseInsertPayloadFromContract` (`src/contexts/question/infrastructure/persistence/mongoose/mappers/question.mongoose.mappers.ts`) converts contract `themeId` strings to `ObjectId`s and `sourceUrls` sets to arrays; theme inserts pass the creation contract to `model.create` directly (`question-theme.mongoose.repository.ts:68-76`).
- Writes are partial by design: `getCrushedDataForMongoPatchUpdate` flattens nested PATCH payloads into dot-notation `$set` fields, and Mongoose strips `undefined` keys, which is what makes the PATCH "omit ⇒ preserve" semantics work (`mongoose.helpers.ts`).

## Migration posture

- **No migration tooling exists.** Grep for migration tooling (`migrate`/`migration` across `package.json`, `scripts/`, `src/`, `docker/`) finds nothing: no migrate-mongo, no Mongoose migrations module, no dedicated scripts. The docker-compose database is disposable acceptance-test infrastructure (`docker/goat-it-api-acceptance-tests/docker-compose.yml`), and production MongoDB is external via env.
- Consequently there is **no documented manual policy** either: schema evolution relies on Mongoose defaults, and existing documents are never transformed in code. This is a verified known limitation: adding or changing a schema field requires hand-coordinated changes to data, schema, mappers and consumers, and the repository records no procedure for doing so. The policy gap is first visible at `src/contexts/question/infrastructure/persistence/mongoose/schemas/` and `src/contexts/question-theme/infrastructure/persistence/mongoose/schemas/` (the only schema authorities), with no counterpart migration directory anywhere in the repository.
- Indexes are also only declared in the schemas (see Indexes); nothing reconciles production indexes with the declarations beyond Mongoose's own index build at startup.
