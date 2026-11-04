# Security

This document describes the application security of the Goat It API (`goat-it-api`): the NestJS 12 + Fastify 5 backend that serves quiz content (questions and question themes) to the Goat It web game. It records what the API enforces today, file by file, and where a control is missing, it is recorded under Known limitations. Related issues: #1263 (rate limiting, security headers, request body guard), #1262 (error tracking).

Last reviewed: 2026-11-04.

## Authentication

Route protection is decorator-based API-key authentication. There are no user accounts, sessions or tokens: the only two identities are two API keys — a game key and an admin key.

- `@GameAuth()` applies `GameApiKeyGuard` to the two game-facing controllers: `file:src/infrastructure/api/auth/providers/decorators/game-auth/game-auth.decorator.ts`, used by `file:src/contexts/question/infrastructure/http/controllers/question/question.controller.ts` and `file:src/contexts/question-theme/infrastructure/http/controllers/question-theme/question-theme.controller.ts`.
- `@AdminAuth()` applies `AdminApiKeyGuard` to the two admin controllers: `file:src/infrastructure/api/auth/providers/decorators/admin-auth/admin-auth.decorator.ts`, used by `file:src/contexts/question/infrastructure/http/controllers/admin-question/admin-question.controller.ts` and `file:src/contexts/question-theme/infrastructure/http/controllers/admin-question-theme/admin-question-theme.controller.ts`.

Both guards share one handler (`canActivateApiKeyGuardHandler`, `file:src/infrastructure/api/auth/helpers/auth.helpers.ts`) which:

1. reads the `goat-it-api-key` request header (`file:src/infrastructure/api/auth/constants/auth.constants.ts`);
2. hashes the received key with HMAC-SHA256 using the boot secret;
3. compares it with the expected hash using `node:crypto` `timingSafeEqual` — the length is checked first so an invalid key cannot leak length information;
4. throws `UnauthorizedException` when the key is missing or does not match (`file:src/infrastructure/api/auth/errors/auth.errors.ts`).

The plaintext keys (`API_KEY_HMAC_SECRET`, `ADMIN_API_KEY`, `GAME_API_KEY`) are read once at boot, converted into HMAC validators, and then deleted from `process.env` (`file:src/infrastructure/api/config/providers/services/app-config.service.ts`). Minimum lengths — 32 characters for the HMAC secret, 24 for each key — are enforced at boot by the env schema (`file:src/infrastructure/api/config/schemas/env.schema.ts`). Keys are high-entropy credentials, not passwords: `hashApiKey` documents that it must never be used for password hashing.

## Cross-origin resource sharing (CORS)

CORS is enabled at bootstrap and entirely configuration-driven (`file:src/infrastructure/api/server/server.ts`):

- the allowed origin is the validated `CORS_ORIGIN` env variable: either `*` or an `http(s)://` URL with a domain hostname — anything else fails boot (`file:src/infrastructure/api/config/validators/cors.validator.ts`, `file:src/infrastructure/api/config/validators/constants/cors.validator.constants.ts`);
- everything else is fixed by `createCorsConfig`: credentials are off, methods are `GET POST PUT DELETE PATCH OPTIONS`, allowed headers are `Content-Type` and `Authorization` (`file:src/infrastructure/api/server/cors/helpers/cors.helpers.ts`, `file:src/infrastructure/api/server/cors/constants/cors.constants.ts`);
- the default origin is `*` (`file:src/infrastructure/api/config/constants/env.constants.ts`). The custom `goat-it-api-key` header is absent from the allow-list, so browsers cannot present it cross-origin; the API is consumed server-side by the first-party game, and browsers are not expected to hold API keys.

## Input validation

Every request DTO is validated by the global `ZodValidationPipe` (`file:src/app/app.module.ts`):

- request shapes are non-strict `z.object` schemas — Zod strips unknown keys, so extra fields never reach a use case or the database (`docs/architecture.md` §7.1; shapes under `src/contexts/question/application/dto/**` and `src/contexts/question-theme/application/dto/**`);
- response shapes are `z.strictObject`, so emitted fields are explicit;
- shared Zod building blocks live in `src/shared/application/dto/zod/` (`validators/`, `refinements/`, `preprocessors/`); context-specific ones live under `src/contexts/<context>/application/dto/zod/`;
- sizes and counts are bounded by domain constants — author name 3–30 characters, 1–5 source URLs, 1–3 theme assignments (`file:src/contexts/question/domain/constants/question.constants.ts`) — and the env schema bounds ports and validates its own inputs at boot;
- a validation failure becomes a 400 carrying the Zod issues as `validationDetails` (`file:src/app/filters/global-exception/global-exception.filter.ts`).

## Error handling and information leakage

`GlobalExceptionFilter` is the single composition point for HTTP errors (`file:src/app/filters/global-exception/global-exception.filter.ts`), registered with `APP_FILTER` (`file:src/app/app.module.ts`). The policy (`docs/architecture.md` §7.4): a domain error gets a specific 4xx status only when the client can act on it.

- Client-actionable mappings: not-found (`QuestionNotFoundError`, `QuestionThemeNotFoundError`, `QuestionThemeAssignmentAbsentError`), bad-request (already-archived, referenced-theme-archived, max/min themes, primary assignment not removable), conflict (slug exists, assignment exists, theme referenced by live questions) — see the filter's `domainErrorHttpExceptionFactories`.
- Everything else — including the four write/read-back errors intentionally classified as 500 — falls through to a generic 500 body. Unknown-error messages are logged server-side and never sent to clients; clients only ever see the generic 500 body.
- Domain error responses include the domain message and an `errorCode` derived from the class name (`file:src/shared/infrastructure/http/errors/helpers/errors.helpers.ts`), which the web game uses to localize errors.

## Secrets and configuration

- Configuration is validated against the Zod `APP_ENV_SCHEMA` at boot (`file:src/infrastructure/api/config/schemas/env.schema.ts`, `file:src/infrastructure/api/config/helpers/env.helpers.ts`) and loaded through `@nestjs/config` (`file:src/infrastructure/api/config/config.module.ts`). The three secret variables — `API_KEY_HMAC_SECRET`, `ADMIN_API_KEY`, `GAME_API_KEY` — have no default, so a missing or too-short value aborts startup. `SERVER_HOST`, `SERVER_PORT`, `CORS_ORIGIN`, `MONGODB_HOST`, `MONGODB_PORT`, `MONGODB_DATABASE` and `FALLBACK_LOCALE` are validated and fall back to their documented defaults (`file:src/infrastructure/api/config/constants/env.constants.ts`); in particular a missing `CORS_ORIGIN` defaults to `*`. `NODE_ENV` is read directly for bootstrap concerns (log transport and env-file selection) outside `@nestjs/config` (`file:src/app/helpers/logger.helpers.ts`, `file:src/infrastructure/api/config/helpers/env.helpers.ts`).
- The tracked env files hold no real secrets: `env/.env.example` is a template, `env/.env.test` carries test-only values, and `env/.env` is local-only and git-ignored (`.gitignore`). The Dockerfile copies no env files into the image — secrets are supplied by the deployment environment (`Dockerfile`).
- API key material is removed from `process.env` once consumed (`file:src/infrastructure/api/config/providers/services/app-config.service.ts`), and the production image build fails if secrets end up in the compiled output: `pnpm run check:secrets-in-built-output` (`Dockerfile:56`, `package.json`, `scripts/check-secrets-in-built-output.sh`).
- The production image runs as the non-root `node` user (`Dockerfile`).

## HTTP security headers

There is no global security-headers middleware today: no `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, `Content-Security-Policy` or `Referrer-Policy` is set. Two global middlewares are installed: the pino HTTP logger (`LoggerModule.forRoot(...)`) and the localization middleware (`file:src/app/app.module.ts`, `file:src/shared/infrastructure/http/middlewares/localization/localization.middleware.ts`). Tracked by #1263.

## Rate limiting

There is no rate limiting or throttling (no throttler module, no middleware): any client with a valid API key may issue unbounded requests today. Tracked by #1263.

## Request body guard

There is no explicit request-body guard: no `bodyLimit`, content-type or content-length policy is configured on the Fastify adapter (`file:src/infrastructure/api/server/server.ts`); only the framework's built-in defaults apply. An explicit, documented guard is tracked by #1263.

## Vulnerability disclosure

There is no `SECURITY.md` in the repository yet (recorded under Known limitations). Private vulnerability reporting is enabled on GitHub. During GOAT audit triage, non-sensitive findings are filed as public issues carrying the `🐐 goat-audit` label; 🔒 findings (an exploitable path today, secret or personal-data exposure, a missing control that gives an attacker a roadmap) are filed as private draft security advisories instead; the local report records the finding (its Appendix B artifact is the returned GHSA id and advisory URL), and no exploitable detail is referenced in any public artifact before remediation.

## Swagger documentation exposure

Swagger is enabled unconditionally: `setupSwaggerModule(app)` runs at bootstrap with no environment gate (`file:src/infrastructure/api/server/server.ts`), serving the OpenAPI UI at `/docs` (`file:src/infrastructure/api/server/swagger/constants/swagger.constants.ts`, `file:src/infrastructure/api/server/swagger/helpers/swagger.helpers.ts`). The docs route requires no API key and lists every endpoint — admin routes included — in every environment.

## Logging

Logging is pino via `nestjs-pino` (`file:src/app/app.module.ts`, `file:src/app/helpers/logger.helpers.ts`): pretty-printed in development, plain JSON in production, with `bufferLogs` and the pino logger installed at bootstrap (`file:src/infrastructure/api/server/server.ts`).

The intended policy is that log lines never carry secrets or personal data, and that the API keys are removed from `process.env` at boot. **That policy is not enforced by configuration today.** `getLoggerConfiguration` only sets the transport, so `pino-http` runs with its defaults: request logging is enabled and the default request serializer emits the request headers (including `goat-it-api-key`), the client address and port, and the `user-agent`. No `redact` or custom serializer is configured. This is recorded as a known limitation below; treat production logs as sensitive until it is fixed.

## Known limitations

- #1263 — rate limiting, global security headers and an explicit request-body guard are missing.
- #1262 — no error-tracking service is wired yet; the constraint for any future tracker (PII scrubbing) lives in `docs/privacy.md`.
- **Request logging leaks credentials and request metadata.** `pino-http` is installed with its defaults (`file:src/app/helpers/logger.helpers.ts`): request logging is enabled and the default serializer emits every request's headers (including `goat-it-api-key`), client address and port, and `user-agent`; no `redact` or custom serializer exists. Fix by disabling auto-logging or redacting the sensitive fields, then update this document.
- **No `SECURITY.md`.** The repository has no security policy file yet; private vulnerability reporting is enabled on GitHub.

Issue #1263 (rate limiting, security headers, request body guard) will extend this document when it lands.
