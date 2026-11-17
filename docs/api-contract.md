# API contract

This document is the verified inventory of the actual HTTP surface of `goat-it-api` (NestJS 12 + Fastify 5, Zod validation): every route with its exact prefix taken from the controller decorators, the DTO/validation conventions, the unified error shape produced by `GlobalExceptionFilter`, the query-string conventions (limit, sort, filters), Swagger at `/docs`, and the published `@goat-it/schemas` package. It was written against the code on branch `feat/goat-audit`; every claim cites a repository path that exists. Gaps found during verification are recorded as Known limitations at the end.

## Framework and bootstrap

- Entrypoint `src/main.ts` calls `bootstrap(AppModule)` from `src/infrastructure/api/server/server.ts`, which creates the app with `createFastifyAdapter()` from `src/infrastructure/api/server/fastify/helpers/fastify.helpers.ts` (`NestFactory.create<NestFastifyApplication>`, `NEST_APPLICATION_OPTIONS` from `src/infrastructure/api/server/constants/server.constants.ts`), enables shutdown hooks, CORS, and Swagger, then listens on `SERVER_HOST`/`SERVER_PORT` (`env/.env.example`; schema in `src/infrastructure/api/config/schemas/env.schema.ts`; defaults `0.0.0.0:3000` in `src/infrastructure/api/config/constants/env.constants.ts`).
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

Rate limiting runs **before** authentication, so a business request can be answered `429` before `401`; see [Rate limiting](#rate-limiting).

## DTO and validation conventions

- Two-file pattern (documented in `docs/architecture.md` §7): a pure Zod **shape** in `<context>/application/dto/<feature>/` (or `contracts/dto/` for published shapes) plus a `createZodDto` **wrapper** class in `<context>/infrastructure/http/dto/<feature>/`. The wrapper is a value import in controllers — `import type` would silently break `ZodValidationPipe`.
- `ZodValidationPipe` is global (`APP_PIPE` in `app.module.ts`), so every `@Body()`/`@Query()` DTO is parsed by Zod.
- Request shapes use non-strict `z.object` deliberately: Zod strips unknown properties, so extra fields are dropped, never persisted (`docs/architecture.md` §7.1). Response shapes use `z.strictObject` with `.describe()`/`.meta()` on public fields — e.g. `QUESTION_DTO` in `src/contexts/question/application/dto/question/question.dto.shape.ts`.
- Every endpoint declares `@ZodResponse(...)` from `nestjs-zod` with its status and wrapper type; `setupSwaggerModule` runs `cleanupOpenApiDoc` over the generated document (`src/infrastructure/api/server/swagger/helpers/swagger.helpers.ts`).

## Unified error shape

`GlobalExceptionFilter` (`src/app/filters/global-exception/global-exception.filter.ts`, registered via `APP_FILTER`) is the single cross-context error composition point. Its branches, in order:

1. `ZodValidationException` → 400 with body `{ statusCode: 400, message: "Invalid request payload", error: "Bad Request", validationDetails: <zod issues> }` (the `sendZodValidationException` branch; body pinned by the filter spec). Each `validationDetails` entry is the pure shape `API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO` (`src/shared/application/dto/api-response-exception/api-response-exception-validation-details/api-response-exception-validation-details.dto.shape.ts`): `code`, `message`, `path`, optional `expected`/`received`/`origin`/`format`/`pattern`/`minimum`/`maximum`/`inclusive`/`keys`/`values`.
2. `HttpException` → the exception's own `getResponse()` is sent verbatim. This covers 401 from the guards, 400 from `MongoIdPipe`/localization, 429 from the throttler guard, 503 from the health service, etc.
3. Known domain error classes → mapped to a specific HTTP status with body `{ error: <HTTP exception message>, message: <domain message>, statusCode, errorCode }` where `errorCode = dash(<ClassName without the "Error" suffix>)` via `getDerivedErrorCodeFromClassName` (`src/shared/infrastructure/http/errors/helpers/errors.helpers.ts`, using radashi `dash`), e.g. `QuestionThemeReferencedByLiveQuestionsError` → `"question-theme-referenced-by-live-questions"`. Mapping table (`domainErrorHttpExceptionFactories`):

| Domain error | Status |
|---|---|
| `QuestionThemeNotFoundError`, `QuestionNotFoundError`, `QuestionThemeAssignmentAbsentError` | 404 |
| `QuestionThemeAlreadyArchivedError`, `ReferencedQuestionThemeArchivedError`, `QuestionAlreadyArchivedError`, `QuestionMaximumThemesError`, `QuestionMinimumThemesError`, `QuestionPrimaryThemeAssignmentNotRemovableError` | 400 |
| `QuestionThemeSlugAlreadyExistsError`, `QuestionThemeAssignmentAlreadyExistsError`, `QuestionThemeReferencedByLiveQuestionsError` | 409 |

**Anything else** → logged with `this.logger.error(...)` and the stock `new InternalServerErrorException()` body is sent verbatim (the `sendUnknownException` branch). The spec pins the exact exception instance (the filter spec), i.e. Nest's default 500 body `{ statusCode: 500, message: "Internal Server Error" }`. No custom 500 body exists.

Before those branches, the filter normalizes the Fastify transport errors it recognizes, keyed **only** on the Fastify error `code` carried by the thrown error itself (a 5xx Fastify error, which Nest leaves unmapped) or by the `cause` of the `HttpException` Nest's Fastify adapter builds for a 4xx one (`fastifyErrorHttpExceptionFactories` and `getFastifyErrorCode` in `src/app/filters/global-exception/global-exception.filter.ts`). Status and message alone never classify an error.

| Fastify code | Status | Body |
|---|---:|---|
| `FST_ERR_CTP_EMPTY_JSON_BODY`, `FST_ERR_CTP_INVALID_JSON_BODY`, `FST_ERR_CTP_INVALID_CONTENT_LENGTH` | 400 | `{ "statusCode": 400, "message": "Invalid request body", "error": "Bad Request" }` |
| `FST_ERR_CTP_BODY_TOO_LARGE` | 413 | `{ "statusCode": 413, "message": "Request body is too large", "error": "Payload Too Large" }` |
| `FST_ERR_CTP_INVALID_MEDIA_TYPE` | 415 | `{ "statusCode": 415, "message": "Unsupported Media Type", "error": "Unsupported Media Type" }` |
| `FST_ERR_HANDLER_TIMEOUT` | 503 | `{ "statusCode": 503, "message": "Request timed out", "error": "Service Unavailable" }` |

These envelopes carry no `errorCode` and never include the Fastify message, the route path or a stack trace. A request-receive timeout is not in this table: Fastify's low-level connection handler answers `408` `{ "statusCode": 408, "message": "Client Timeout", "error": "Request Timeout" }` before Nest runs, so `GlobalExceptionFilter` never sees it.

The `FST_ERR_HANDLER_TIMEOUT` envelope is only reachable for requests without a body: on Node 16+ a POST/PATCH request body completes before the handler runs and Fastify clears its handler timer (#1428).

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

## Response headers and caching

Every application response carries a fixed security-header set and the cache policy; the values and their rationale are recorded in [Security](security.md#http-security-headers). Two transport paths are the documented exception — a low-level `408` carries no application header, and a router-level `400`/`414` keeps the security headers but carries no `Permissions-Policy`, `Cache-Control` or `Vary` (see [Security § Known limitations](security.md#known-limitations)). Clients can rely on:

- `Content-Security-Policy`, `Strict-Transport-Security: max-age=31536000`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`, `Cross-Origin-Resource-Policy: same-site`, `Cross-Origin-Opener-Policy: same-origin` and a `Permissions-Policy` denying `camera`, `microphone`, `geolocation`, `payment` and `usb`;
- no `X-Powered-By` header;
- `Cache-Control: no-store` with `Vary: Accept-Language` on every JSON response, every error, every documentation response and every `OPTIONS` reply, so a client or an intermediary must not cache them;
- `Cache-Control: public, max-age=0` with `ETag` and `Last-Modified` on the game assets under `/public/` only, which a client re-fetches with a conditional request after a change.

These headers never change a status code or a body: every success and error shape documented above stays identical. CORS keeps its documented allow-list, so `goat-it-api-key` remains absent from `Access-Control-Allow-Headers` (see Known limitations).

## Rate limiting

`ApiThrottlerModule` (`src/infrastructure/api/server/throttler/throttler.module.ts`) registers a global throttler guard (`src/infrastructure/api/server/throttler/providers/guards/api-throttler/api-throttler.guard.ts`), so every route listed under [Route inventory](#route-inventory) except the probes is limited by two API-wide, per-client budgets. The values come from `THROTTLER_DEFAULT_TTL_SECONDS`/`THROTTLER_DEFAULT_LIMIT` and `THROTTLER_SUSTAINED_TTL_SECONDS`/`THROTTLER_SUSTAINED_LIMIT` (`src/infrastructure/api/config/schemas/env.schema.ts`; defaults `1`/`20` and `60`/`300` in `src/infrastructure/api/config/constants/env.constants.ts`).

- The guard runs before `@GameAuth()`/`@AdminAuth()` and before `ZodValidationPipe`, so an unauthenticated or schema-invalid business request still consumes budget and can be answered `429` before `401`/`400`. A request rejected by `LocalizationMiddleware` (invalid `Accept-Language`) never reaches the guard.
- The bucket is shared by every business route for one client and per tier: the key is a SHA-256 digest of the tier name and the library-normalized `request.ip` with no controller or handler component, so two routes never receive separate quotas.
- `GET /`, `GET /health` and `HEAD /health` skip both tiers and never carry rate-limit headers. `/docs`, `/docs-json`, `/public/**` and `OPTIONS` preflights are outside the Nest controller guard chain and are not limited by this guard.

Below the limit, business responses carry `X-RateLimit-Limit`, `X-RateLimit-Remaining` and `X-RateLimit-Reset` for the `default` tier, and `X-RateLimit-Limit-sustained`, `X-RateLimit-Remaining-sustained` and `X-RateLimit-Reset-sustained` for the `sustained` tier. The `Reset` values are whole seconds until the window resets, never epoch timestamps.

A blocked request returns exactly this body, with one plain `Retry-After` header in seconds and `Cache-Control: no-store`:

```json
{
  "statusCode": 429,
  "error": "Too Many Requests",
  "message": "Too many requests",
  "errorCode": "too-many-requests"
}
```

The guard throws an `HttpException`, so `GlobalExceptionFilter` sends the body verbatim (branch 2 of [Unified error shape](#unified-error-shape)); `too-many-requests` is an infrastructure code and is absent from the domain-error mapping table. The body never echoes the client IP, the storage key, the tier counters or any budget detail.

## Swagger at `/docs`

- Path constant `SWAGGER_DOCUMENTATION_PATH = "/docs"` and tags `APP`, `ADMIN`, `QUESTIONS`, `QUESTION_THEMES` in `src/infrastructure/api/server/swagger/constants/swagger.constants.ts`.
- `setupSwaggerModule` builds the document with `DocumentBuilder` (title "Goat It API Reference Documentation", description and version from `package.json` via `readPackageJson`) and serves the Swagger UI at `/docs` (`src/infrastructure/api/server/swagger/helpers/swagger.helpers.ts`).
- The docs endpoint doubles as the readiness target: `HealthService` pings it during `GET /health` (`src/infrastructure/api/health/providers/services/health.service.ts`).

## Published package `@goat-it/schemas`

- Package root `packages/schemas/` (`package.json` version `0.0.27`). Entrypoints (`packages/schemas/package.json` `exports` + `packages/schemas/src/*/index.ts`, built by `packages/schemas/tsdown.config.ts`): `./question`, `./question-theme`, `./shared/locale`, `./shared/error`, `./shared/constants`, `./testing/question`, `./testing/question-theme`, `./testing/shared`.
- It re-exports only pure, framework-free modules: DTO shapes (value + inferred types) such as `QUESTION_DTO`, `ADMIN_QUESTION_DTO`, `QUESTION_CREATION_DTO`, `QUESTION_THEME_DTO`, the query shapes, the `API_RESPONSE_EXCEPTION_DTO`, domain constants (`QUESTION_STATUSES`, `QUESTION_CATEGORIES`, `SORT_ORDERS`, `LOCALES`, …), validator constants, and the `createFake*` faketories under `./testing/*` (see the entrypoint files listed above; policy in `docs/architecture.md` §11).
- Declared consumers: `goat-it-web-game` (`"@goat-it/schemas": "^0.0.26"`) and `goat-it-web-admin` (`"@goat-it/schemas": "^0.0.26-beta"`) — sibling repositories outside this repo, verified in their respective `package.json` files.
- Versioning policy: bump the **patch** version when an existing export changes; ask the user before adding a new export (`docs/architecture.md` §11, `AGENTS.md` DOD items 4-5). `zod` and `@faker-js/faker` are peer dependencies.

## Known limitations

- **No API versioning prefix.** No `setGlobalPrefix`/`enableVersioning` exists (verified by grep across `src/`); all routes live at the root, so a breaking change cannot be released alongside a v1.
- **No pagination.** List endpoints expose only `limit` (0 = unlimited) — no `page`/`offset` and no cursor; a repeated sorted and limited query returns the same first results, so `limit=0` is the only way to retrieve the full result set.
- **500 responses carry no `errorCode`.** The generic 500 body is the stock Nest `InternalServerErrorException` body passed through verbatim (see Unified error shape); frontends cannot machine-differentiate unknown failures.
- **Browser API-key calls are unsupported.** CORS `allowedHeaders` is `["Content-Type", "Authorization"]` and deliberately excludes `goat-it-api-key` (`cors.constants.ts`, `auth.constants.ts`), so the API key stays server-side and a browser caller cannot authenticate cross-origin by design; `PUT` is still advertised in CORS methods although no PUT route exists — a minor mismatch to remove.
- **The public list cannot page to the end of large datasets**, and `theme-ids` has no upper bound (only min 1) unlike `ids` (max 100). The random-search body's `themeIds` array has no upper bound either (only min 1), unlike `excludedIds` (1–5000).
- **Browsers cannot read the rate-limit headers.** No `Access-Control-Expose-Headers` entry exists and CORS is unchanged, so cross-origin browser JavaScript cannot read `Retry-After` or the `X-RateLimit-*` headers, although server-side clients can. Revisit if browser API-key access is approved.
