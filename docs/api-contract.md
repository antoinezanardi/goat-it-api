# API contract

This document is the verified inventory of the actual HTTP surface of `goat-it-api` (NestJS 12 + Fastify 5, Zod validation): every route with its exact prefix taken from the controller decorators, the DTO/validation conventions, the unified error shape produced by `GlobalExceptionFilter`, the query-string conventions (limit, sort, filters), Swagger at `/docs`, and the published `@goat-it/schemas` package. It was written against the code on branch `feat/goat-audit`; every claim cites a repository path that exists. Gaps found during verification are recorded as Known limitations at the end.

## Framework and bootstrap

- Entrypoint `src/main.ts` calls `bootstrap(AppModule)` from `src/infrastructure/api/server/server.ts`, which creates the app with `new FastifyAdapter()` (`NestFactory.create<NestFastifyApplication>`), enables shutdown hooks, CORS, and Swagger, then listens on `SERVER_HOST`/`SERVER_PORT` (`env/.env.example`; schema in `src/infrastructure/api/config/schemas/env.schema.ts`; defaults `0.0.0.0:3000` in `src/infrastructure/api/config/constants/env.constants.ts`).
- `src/app/app.module.ts` registers `ServeStaticModule` for `/public/`, the `ZodValidationPipe` as `APP_PIPE`, `GlobalExceptionFilter` as `APP_FILTER`, and the `LocalizationMiddleware` on `"*"` routes.
- There is **no** `setGlobalPrefix` and **no** `enableVersioning` call anywhere in `src/` — every route is mounted at the repository root (see Known limitations).
- CORS: `app.enableCors(createCorsConfig(...))` in `server.ts`; defaults in `src/infrastructure/api/server/cors/constants/cors.constants.ts` — `credentials: false`, methods `GET, POST, PUT, DELETE, PATCH, OPTIONS`, `allowedHeaders: ["Content-Type", "Authorization"]`; the `origin` comes from the `CORS_ORIGIN` env variable (default `*`).

## Route inventory

Prefixes come from `QUESTION_ROUTE_PREFIX = "questions"` (`src/contexts/question/infrastructure/http/controllers/question/constants/question.constants.ts`), `QUESTION_THEME_ROUTE_PREFIX = "question-themes"` (`src/contexts/question-theme/infrastructure/http/controllers/question-theme/constants/question-theme.constants.ts`) and `ControllerPrefixes` (`ADMIN = "admin"`, `HEALTH = "health"`) in `src/shared/infrastructure/http/controllers/controllers.enums.ts`. Path parameters named `id`/`themeId` are validated by `MongoIdPipe` (`src/shared/infrastructure/http/pipes/mongo/mongo-id/mongo-id.pipe.ts`), which throws a 400 `BadRequestException` for a non-ObjectId value.

| Method | Path | Controller file | Auth | Success |
|---|---|---|---|---|
| GET | `/` | `src/app/controllers/app.controller.ts` | none | 200 `AppMetadataDto` |
| GET | `/health` | `src/infrastructure/api/health/controllers/health.controller.ts` | none | 200 `AppHealthDto`; 503 documented |
| GET | `/questions` | `src/contexts/question/infrastructure/http/controllers/question/question.controller.ts` | `@GameAuth()` | 200 `QuestionDto[]` |
| POST | `/questions/search/random` | same | `@GameAuth()` | 200 `QuestionDto[]` |
| GET | `/questions/:id` | same | `@GameAuth()` | 200 `QuestionDto` |
| GET | `/admin/questions` | `src/contexts/question/infrastructure/http/controllers/admin-question/admin-question.controller.ts` | `@AdminAuth()` | 200 `AdminQuestionDto[]` |
| GET | `/admin/questions/stats` | same | `@AdminAuth()` | 200 `QuestionStatsDto` |
| GET | `/admin/questions/:id` | same | `@AdminAuth()` | 200 `AdminQuestionDto` |
| POST | `/admin/questions` | same | `@AdminAuth()` | 201 `AdminQuestionDto` |
| PATCH | `/admin/questions/:id` | same | `@AdminAuth()` | 200 `AdminQuestionDto` |
| POST | `/admin/questions/:id/archive` | same | `@AdminAuth()` | 200 `AdminQuestionDto` |
| POST | `/admin/questions/:id/themes` | same | `@AdminAuth()` | 201 `AdminQuestionDto` |
| DELETE | `/admin/questions/:id/themes/:themeId` | same | `@AdminAuth()` | 200 `AdminQuestionDto` |
| PATCH | `/admin/questions/:id/themes/:themeId` | same | `@AdminAuth()` | 200 `AdminQuestionDto` |
| GET | `/question-themes` | `src/contexts/question-theme/infrastructure/http/controllers/question-theme/question-theme.controller.ts` | `@GameAuth()` | 200 `QuestionThemeDto[]` |
| GET | `/question-themes/:id` | same | `@GameAuth()` | 200 `QuestionThemeDto` |
| GET | `/admin/question-themes` | `src/contexts/question-theme/infrastructure/http/controllers/admin-question-theme/admin-question-theme.controller.ts` | `@AdminAuth()` | 200 `AdminQuestionThemeDto[]` |
| GET | `/admin/question-themes/stats` | same | `@AdminAuth()` | 200 `QuestionThemeStatsDto` |
| GET | `/admin/question-themes/:id` | same | `@AdminAuth()` | 200 `AdminQuestionThemeDto` |
| POST | `/admin/question-themes` | same | `@AdminAuth()` | 201 `AdminQuestionThemeDto` |
| PATCH | `/admin/question-themes/:id` | same | `@AdminAuth()` | 200 `AdminQuestionThemeDto` |
| POST | `/admin/question-themes/:id/archive` | same | `@AdminAuth()` | 200 `AdminQuestionThemeDto` |

Notes: the `@Controller(...)` decorator strings are `""` (AppController), `"health"`, `"questions"`, `"admin/questions"`, `"question-themes"` and `"admin/question-themes"` respectively (verified in the six controller files listed above). `POST /questions/search/random` is a search-style endpoint implemented as a POST carrying a filter body. Archive endpoints are `POST /:id/archive` and always return the archived resource (200), not 204. In both admin controllers `GET /stats` is declared before `GET /:id`.

## Authentication

- `@GameAuth()` applies `GameApiKeyGuard` and `@AdminAuth()` applies `AdminApiKeyGuard` (`src/infrastructure/api/auth/providers/decorators/game-auth/game-auth.decorator.ts`, `.../admin-auth/admin-auth.decorator.ts`; guards in `src/infrastructure/api/auth/providers/guards/`). `GET /` and `GET /health` are unauthenticated.
- The API key is read from the custom header `goat-it-api-key` (`API_KEY_HEADER` in `src/infrastructure/api/auth/constants/auth.constants.ts`).
- `src/infrastructure/api/auth/helpers/auth.helpers.ts` hashes the received key with HMAC-SHA256 (`API_KEY_HMAC_SECRET`) and compares with `timingSafeEqual`; on failure the guard throws `UnauthorizedException` (401). Keys come from `ADMIN_API_KEY` / `GAME_API_KEY` env variables (minimum 24 characters, `auth.constants.ts`; env schema in `src/infrastructure/api/config/schemas/env.schema.ts`).

## DTO and validation conventions

- Two-file pattern (documented in `docs/architecture.md` §7): a pure Zod **shape** in `<context>/application/dto/<feature>/` (or `contracts/dto/` for published shapes) plus a `createZodDto` **wrapper** class in `<context>/infrastructure/http/dto/<feature>/`. The wrapper is a value import in controllers — `import type` would silently break `ZodValidationPipe`.
- `ZodValidationPipe` is global (`APP_PIPE` in `app.module.ts`), so every `@Body()`/`@Query()` DTO is parsed by Zod.
- Request shapes use non-strict `z.object` deliberately: Zod strips unknown properties, so extra fields are dropped, never persisted (`docs/architecture.md` §7.1). Response shapes use `z.strictObject` with `.describe()`/`.meta()` on public fields — e.g. `QUESTION_DTO` in `src/contexts/question/application/dto/question/question.dto.shape.ts`.
- Every endpoint declares `@ZodResponse(...)` from `nestjs-zod` with its status and wrapper type; `setupSwaggerModule` runs `cleanupOpenApiDoc` over the generated document (`src/infrastructure/api/server/swagger/helpers/swagger.helpers.ts`).

## Unified error shape

`GlobalExceptionFilter` (`src/app/filters/global-exception/global-exception.filter.ts`, registered via `APP_FILTER`) is the single cross-context error composition point. Its branches, in order:

1. `ZodValidationException` → 400 with body `{ statusCode: 400, message: "Invalid request payload", error: "Bad Request", validationDetails: <zod issues> }` (filter lines 55-66; body pinned by the spec at `global-exception.filter.spec.ts:116-130`). Each `validationDetails` entry is the pure shape `API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO` (`src/shared/application/dto/api-response-exception/api-response-exception-validation-details/api-response-exception-validation-details.dto.shape.ts`): `code`, `message`, `path`, optional `expected`/`received`/`origin`/`format`/`pattern`/`minimum`/`maximum`/`inclusive`/`keys`/`values`.
2. `HttpException` → the exception's own `getResponse()` is sent verbatim (filter lines 77-81). This covers 401 from the guards, 400 from `MongoIdPipe`/localization, 503 from the health service, etc.
3. Known domain error classes → mapped to a specific HTTP status with body `{ error: <HTTP exception message>, message: <domain message>, statusCode, errorCode }` where `errorCode = dash(<ClassName without the "Error" suffix>)` via `getDerivedErrorCodeFromClassName` (`src/shared/infrastructure/http/errors/helpers/errors.helpers.ts`, using radashi `dash`), e.g. `QuestionThemeReferencedByLiveQuestionsError` → `"question-theme-referenced-by-live-questions"`. Mapping table (filter lines 28-41):

| Domain error | Status |
|---|---|
| `QuestionThemeNotFoundError`, `QuestionNotFoundError`, `QuestionThemeAssignmentAbsentError` | 404 |
| `QuestionThemeAlreadyArchivedError`, `ReferencedQuestionThemeArchivedError`, `QuestionAlreadyArchivedError`, `QuestionMaximumThemesError`, `QuestionMinimumThemesError`, `QuestionPrimaryThemeAssignmentNotRemovableError` | 400 |
| `QuestionThemeSlugAlreadyExistsError`, `QuestionThemeAssignmentAlreadyExistsError`, `QuestionThemeReferencedByLiveQuestionsError` | 409 |

**Anything else** → logged with `this.logger.error(...)` and the stock `new InternalServerErrorException()` body is sent verbatim (filter lines 104-110). The spec pins the exact exception instance (`global-exception.filter.spec.ts:350-375`), i.e. Nest's default 500 body `{ statusCode: 500, message: "Internal Server Error" }`. No custom 500 body exists.

Four write/read-back errors are intentionally unmapped and fall through to 500: `QuestionCreationError`, `QuestionThemeAssignmentCreationError`, `QuestionThemeAssignmentModificationError`, `QuestionThemeAssignmentRemovalError` (`docs/architecture.md` §7.4).

The published consumer-side shape `API_RESPONSE_EXCEPTION_DTO` (`src/shared/application/dto/api-response-exception/api-response-exception.dto.shape.ts`, a `z.strictObject` with optional `validationDetails` and `errorCode`) documents the union of the bodies above; it is descriptive for consumers — the filter builds bodies inline and does not re-validate them with Zod at runtime.

## Query conventions: limit, sort, filters

There is no pagination — no `page`/`offset` parameter exists anywhere in the query DTOs. Lists are capped/limited and sorted only:

- `limit` (`LIMIT_QUERY_KEY`, `src/shared/application/dto/constants/limit-query.dto.constants.ts`) — coerced integer, minimum 0, default 50; `0` means unlimited (`src/shared/application/dto/zod/validators/limit/limit.zod.validators.ts` and its `constants/`).
- `sort-by` / `sort-order` (`SORT_BY_QUERY_KEY`, `SORT_ORDER_QUERY_KEY`, `src/shared/application/dto/constants/sort-query.dto.constants.ts`) — `sort-order` ∈ `SORT_ORDERS = ["asc", "desc"]` (`src/shared/domain/constants/sort/sort.constants.ts`), shared default `"desc"`. Questions use `sort-by` default `createdAt` with the shared `desc` order (`QUESTION_SORT_BY_DEFAULT` in `src/contexts/question/application/dto/shared/constants/question-sort.dto.constants.ts`). Themes override both defaults: `sort-by` is `slug` and `sort-order` is `asc` (`QUESTION_THEME_SORT_BY_DEFAULT` / `QUESTION_THEME_SORT_ORDER_DEFAULT` in `src/contexts/question-theme/application/dto/shared/constants/question-theme-sort.dto.constants.ts`), used by both the public and admin theme query DTOs. Allowed `sort-by` fields: public questions `["createdAt", "updatedAt", "category", "cognitiveDifficulty"]`, admin questions adds `"status"` (`QUESTION_SORTABLE_FIELDS` / `ADMIN_QUESTION_SORTABLE_FIELDS` in `src/contexts/question/domain/constants/question.constants.ts`); public themes `["createdAt", "updatedAt", "slug"]`, admin themes adds `"status"` (`src/contexts/question-theme/domain/constants/question-theme.constants.ts`). Sortable-field validators are the shapes `FIND_QUESTIONS_QUERY_DTO`, `ADMIN_FIND_QUESTIONS_QUERY_DTO`, `FIND_QUESTION_THEMES_QUERY_DTO`, `ADMIN_FIND_QUESTION_THEMES_QUERY_DTO` in the respective `application/dto/*/` folders.
- Public question filters (`FIND_QUESTIONS_QUERY_DTO` + `src/contexts/question/application/dto/shared/constants/question-filter-query.dto.constants.ts`): `category`, `cognitive-difficulty`, `author-role`, `theme-ids` (array of MongoIds, min 1, no max), `ids` (array of MongoIds, min 1, max 100 — `question-ids-filter-query.dto.constants.ts`), `is-adult-content` (boolean). Admin adds `status` and `is-fully-translated` (`ADMIN_FIND_QUESTIONS_QUERY_DTO`). The public endpoint always adds the request locale to the filter options (`createPublicQuestionFilterOptionsFromQueryDto`, `src/contexts/question/application/mappers/question-filter-query-dto/question-filter-query-dto.mappers.ts`).
- Admin theme filters: `status` (optional enum) and `is-fully-translated` (`ADMIN_FIND_QUESTION_THEMES_QUERY_DTO`). The public theme endpoint accepts only `sort-by`, `sort-order`, `limit`.
- Random-search body (`FIND_RANDOM_QUESTIONS_BODY_DTO`): `limit` 1-50 default 20, `excludedIds` 1-5000 unique, `categories` and `cognitiveDifficulties` (enums, unique, OR logic), `themeIds` (array of MongoIds, min 1, no maximum), `isAdultContent` (`src/contexts/question/application/dto/find-random-questions-body/find-random-questions-body.dto.shape.ts` + its `constants/`).

## Localization

- `LocalizationMiddleware` (`src/shared/infrastructure/http/middlewares/localization/localization.middleware.ts`) runs on all routes; it reads the first locale of the `Accept-Language` header, validates it against `LOCALES = ["en", "fr", "es", "de", "it", "pt"]` (`src/shared/domain/value-objects/locale/locale.constants.ts`), falls back to `FALLBACK_LOCALE` (env, default `"en"`), and throws 400 on an invalid header.
- Controllers receive the resolved options through the `@Localization()` decorator (`src/shared/infrastructure/http/decorators/localization/localization.decorator.ts`) and pass them to mappers/use cases.

## Swagger at `/docs`

- Path constant `SWAGGER_DOCUMENTATION_PATH = "/docs"` and tags `APP`, `ADMIN`, `QUESTIONS`, `QUESTION_THEMES` in `src/infrastructure/api/server/swagger/constants/swagger.constants.ts`.
- `setupSwaggerModule` builds the document with `DocumentBuilder` (title "Goat It API Reference Documentation", description and version from `package.json` via `readPackageJson`) and serves the Swagger UI at `/docs` (`src/infrastructure/api/server/swagger/helpers/swagger.helpers.ts`).
- The docs endpoint doubles as the readiness target: `HealthService` pings it during `GET /health` (`src/infrastructure/api/health/providers/services/health.service.ts`).

## Published package `@goat-it/schemas`

- Package root `packages/schemas/` (`package.json` version `0.0.26`). Entrypoints (`packages/schemas/package.json` `exports` + `packages/schemas/src/*/index.ts`, built by `packages/schemas/tsdown.config.ts`): `./question`, `./question-theme`, `./shared/locale`, `./shared/error`, `./shared/constants`, `./testing/question`, `./testing/question-theme`, `./testing/shared`.
- It re-exports only pure, framework-free modules: DTO shapes (value + inferred types) such as `QUESTION_DTO`, `ADMIN_QUESTION_DTO`, `QUESTION_CREATION_DTO`, `QUESTION_THEME_DTO`, the query shapes, the `API_RESPONSE_EXCEPTION_DTO`, domain constants (`QUESTION_STATUSES`, `QUESTION_CATEGORIES`, `SORT_ORDERS`, `LOCALES`, …), validator constants, and the `createFake*` faketories under `./testing/*` (see the entrypoint files listed above; policy in `docs/architecture.md` §11).
- Declared consumers: `goat-it-web-game` (`"@goat-it/schemas": "^0.0.26"`) and `goat-it-web-admin` (`"@goat-it/schemas": "^0.0.26-beta"`) — sibling repositories outside this repo, verified in their respective `package.json` files.
- Versioning policy: bump the **patch** version when an existing export changes; ask the user before adding a new export (`docs/architecture.md` §11, `AGENTS.md` DOD items 4-5). `zod` and `@faker-js/faker` are peer dependencies.

## Known limitations

- **No API versioning prefix.** No `setGlobalPrefix`/`enableVersioning` exists (verified by grep across `src/`); all routes live at the root, so a breaking change cannot be released alongside a v1.
- **No pagination.** List endpoints expose only `limit` (0 = unlimited) — no `page`/`offset` and no cursor; a repeated sorted and limited query returns the same first results, so `limit=0` is the only way to retrieve the full result set.
- **500 responses carry no `errorCode`.** The generic 500 body is the stock Nest `InternalServerErrorException` body passed through verbatim (see Unified error shape); frontends cannot machine-differentiate unknown failures.
- **Browser API-key calls are unsupported.** CORS `allowedHeaders` is `["Content-Type", "Authorization"]` and deliberately excludes `goat-it-api-key` (`cors.constants.ts`, `auth.constants.ts`), so the API key stays server-side and a browser caller cannot authenticate cross-origin by design; `PUT` is still advertised in CORS methods although no PUT route exists — a minor mismatch to remove.
- **The public list cannot page to the end of large datasets**, and `theme-ids` has no upper bound (only min 1) unlike `ids` (max 100). The random-search body's `themeIds` array has no upper bound either (only min 1), unlike `excludedIds` (1–5000).
