# SEC — Application security

Security of the running Goat It NestJS API: API-key authentication and authorization, Zod validation of every request reaching the HTTP boundary, response hardening and CORS, rate limiting and abuse controls, secret and configuration handling, error and log leakage, vulnerability disclosure, and Swagger exposure. The API is a server-to-server NestJS 12 + Fastify 5 service consumed by the first-party game; browser-only controls such as CSP nonces, cookie flags and DOM sinks belong to the web clients, not here. The known limitations recorded in `docs/security.md` (#1263 rate limiting, security headers and the request-body/content-type guard; #1262 error tracking; the `pino-http` request-metadata limitation; the missing `SECURITY.md`) are **binding documented decisions**: a conformance check whose criterion is exactly one of them is `DECIDED` (cite `docs/security.md:<line>`), never `FAIL`. A `Target: reach` check whose criterion matches one of them is `GAP`, never `DECIDED` and never `PASS`; its absence stays visible in the Platinum backlog. A check that demands a control not covered by that list is evaluated normally.

**Decision doc:** `docs/security.md` (section `## GOAT audit decisions`). **Diff triggers:** see SKILL.md category index.

**Not in this category:** dependency vulnerabilities, Renovate, `.env*` in git → SUP · workflows and CI governance → CICD · Docker image secrets, base image and non-root user → PLAT · error-tracking PII → PRIV · timeouts, retries, cancellation → REL · alerting and log shipping → OPS · Mongo schema and persistence validation → DATA

## Contents

- [1. Authentication and authorization](#1-authentication-and-authorization)
- [2. Input validation and injection](#2-input-validation-and-injection)
- [3. HTTP security headers and response hardening](#3-http-security-headers-and-response-hardening)
- [4. Rate limiting and abuse prevention](#4-rate-limiting-and-abuse-prevention)
- [5. Secrets and configuration](#5-secrets-and-configuration)
- [6. Error handling and information leakage](#6-error-handling-and-information-leakage)
- [7. Security logging](#7-security-logging)
- [8. Vulnerability disclosure](#8-vulnerability-disclosure)
- [9. Swagger and documentation exposure](#9-swagger-and-documentation-exposure)
- [Sources](#sources)

## 1. Authentication and authorization

- **[SEC-01] Every business route is guarded by the audience API key** — Every business controller route is protected by exactly one API-key guard matching its audience; only the routes documented as public in `docs/api-contract.md` are unguarded, and the public-route inventory is the document's, not the check's.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/contexts/question/infrastructure/http/controllers/**`, `src/contexts/question-theme/infrastructure/http/controllers/**`, `src/infrastructure/api/auth/providers/**` · Src: [11], [19], [2], project: docs/security.md
- **[SEC-02] API keys are compared in constant time** — Received keys are HMAC-SHA256 hashed with the boot secret and compared to a cached hash with `node:crypto` `timingSafeEqual`; byte lengths are compared first and no `===`, `==`, `Buffer.compare` or plaintext comparison touches key material (verified: node:crypto 26.13.0).
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/infrastructure/api/auth/helpers/**`, `src/infrastructure/api/auth/providers/**` · Src: [12], [37], project: docs/security.md
- **[SEC-03] Missing and invalid keys return the same 401 envelope** — A missing `goat-it-api-key` header and a wrong key both return HTTP 401 with the same body shape and no expected hash, key length, prefix or comparison detail; authentication failures never use 403 or 500.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/api/auth/helpers/**`, `src/infrastructure/api/auth/errors/**` · Src: [12], [18]
- **[SEC-04] The API key is read only from its dedicated header** — The only credential source is the `goat-it-api-key` request header; query strings, cookies, request bodies, `Authorization` and `X-Api-Key` are never accepted as API keys.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/api/auth/**` · Src: [5], project: docs/security.md
- **[SEC-05] Admin and game keys are not interchangeable** — Admin controllers validate only `ADMIN_API_KEY` and game controllers validate only `GAME_API_KEY`; presenting the game key to an admin route or the admin key to a game route returns 401. The configuration must reject equal `ADMIN_API_KEY` and `GAME_API_KEY` values at boot, because identical values make both guards accept the same key.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: critical · Look: `src/infrastructure/api/auth/providers/**`, `src/contexts/question/infrastructure/http/controllers/**`, `src/contexts/question-theme/infrastructure/http/controllers/**` · Src: [11], [19], [2], project: docs/security.md
- **[SEC-06] API key material has enforced minimum lengths** — The env schema rejects `API_KEY_HMAC_SECRET` below 32 characters and `ADMIN_API_KEY`/`GAME_API_KEY` below 24 characters, aborting startup instead of running with an undersized secret.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/infrastructure/api/config/schemas/**`, `src/infrastructure/api/auth/constants/**` · Src: [8], [25], project: docs/security.md
- **[SEC-07] Plaintext keys do not survive boot** — Once the authentication cache is built, `API_KEY_HMAC_SECRET`, `ADMIN_API_KEY` and `GAME_API_KEY` are deleted from `process.env`, so later code and child processes cannot read them from the environment.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/api/config/providers/**` · Src: [38], [8], project: docs/security.md
- **[SEC-08] API-key hashing is scoped to high-entropy tokens** — API-key hashing is documented and used only for API keys; no password, passphrase or user credential is hashed with HMAC-SHA256 or stored by the API.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `src/infrastructure/api/auth/helpers/**` · Src: [12], [8]
- **[SEC-09] Admin routes are mounted under the documented admin namespace** — Every admin-guarded controller is mounted under the documented admin namespace and every game-guarded controller outside it, so route prefixes and guard audiences cannot drift apart; the namespace is recorded in `docs/api-contract.md`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/infrastructure/http/controllers/**`, `src/contexts/question-theme/infrastructure/http/controllers/**`, `src/shared/infrastructure/http/controllers/**` · Src: [19], project: docs/architecture.md

## 2. Input validation and injection

- **[SEC-10] All request payloads are schema-validated before use** — A global Zod validation pipe parses every request body and query DTO against its schema before a controller or use case sees it, and every path ID is validated as a Mongo ObjectId (verified: nestjs-zod 5.5.0).
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/app/app.module.ts`, `src/contexts/question/application/dto/**`, `src/contexts/question-theme/application/dto/**`, `src/shared/infrastructure/http/pipes/**` · Src: [23], [32], project: docs/architecture.md
- **[SEC-11] Request schemas strip unknown keys** — Every request shape is a non-strict `z.object` or a `z.strictObject`, so unknown keys are stripped or rejected; no request schema uses `z.looseObject`, `.passthrough()` or `.catchall()` to forward unknown keys to a use case or MongoDB (verified: zod 4.6.7).
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/contexts/question/application/dto/**`, `src/contexts/question-theme/application/dto/**`, `src/shared/application/dto/**` · Src: [33], [1], project: docs/security.md
- **[SEC-12] Response schemas are strict** — Every response shape is a `z.strictObject` or a composition of strict objects, so serialization emits only declared fields and cannot expose an entity field added later.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/application/dto/**`, `src/contexts/question-theme/application/dto/**`, `src/shared/application/dto/**` · Src: [33], [32], project: docs/architecture.md
- **[SEC-13] Input sizes and collection counts are bounded** — Every string, array and numeric request field has an explicit bound sourced from domain or DTO constants; the current bounds are recorded in `docs/api-contract.md` and `docs/domain-logic.md`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/application/dto/**`, `src/contexts/question/domain/constants/**`, `src/shared/application/dto/zod/**` · Src: [1], [2], project: docs/security.md
- **[SEC-14] Path identifiers are validated as Mongo ObjectIds** — Every `:id` parameter is validated as a Mongo ObjectId before any Mongoose query is built; a missing, non-string or non-ObjectId value returns 400.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/shared/infrastructure/http/pipes/**`, `src/contexts/question/infrastructure/http/controllers/**`, `src/contexts/question-theme/infrastructure/http/controllers/**` · Src: [23], [29], [36]
- **[SEC-15] Validation failures are 400, never 500** — A Zod validation failure becomes HTTP 400 with `message: "Invalid request payload"`, `error: "Bad Request"`, `statusCode: 400` and a `validationDetails` array; it never falls through to the generic 500 path.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/app/filters/global-exception/**`, `src/app/app.module.ts` · Src: [24], [32], project: docs/security.md
- **[SEC-16] Repeated query parameters are handled explicitly** — Each query parameter is declared as a scalar or an explicit array; a repeated parameter such as `?limit=1&limit=2` either fails with 400 or is consumed by an array schema, never forwarded as an unexpected array to a mapper or repository (verified: fastify 5.12.8).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/application/dto/**`, `src/contexts/question-theme/application/dto/**`, `src/shared/application/dto/**` · Src: [30], [33]
- **[SEC-17] Mongo operators cannot enter a query from request data** — Request data reaches Mongoose only as Zod-parsed values or `Types.ObjectId` strings; no request key beginning with `$` or containing `.` is copied into a filter, update or aggregation pipeline, and no request object is spread into a Mongoose query.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/*/infrastructure/persistence/**`, `src/contexts/*/application/mappers/**`, `src/shared/application/dto/**` · Src: [13], [29], [36]
- **[SEC-18] Stored and returned URLs use an http/https allowlist** — Every URL stored or returned by the API, including question `sourceUrls`, is validated with an explicit `http:`/`https:` allowlist (`z.httpUrl()` or `z.url({ protocol: /^https?$/ })`), so `javascript:`, `data:` and `file:` schemes are rejected.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/application/dto/zod/**`, `src/contexts/question/application/dto/**` · Src: [33], [17], project: docs/security.md
- **[SEC-19] Request data is never deep-merged into prototypes or configuration** — Request bodies are consumed only as Zod-parsed values and never deep-merged into configuration objects, `Object.prototype` or class prototypes; dynamic-key maps use `Map` or `Object.create(null)`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/*/application/**`, `src/shared/application/**`, `src/infrastructure/api/config/**` · Src: [16], [6]

## 3. HTTP security headers and response hardening

- **[SEC-20] Baseline security headers are sent on every response** — Every response, including JSON success, 4xx/5xx, health, Swagger and static assets, carries `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer` or `strict-origin-when-cross-origin`, and a `Permissions-Policy` denying `camera`, `microphone`, `geolocation`, `payment` and `usb`.
  Evidence: `static` · Diff: ✓ · Target: reach · Severity: medium · Look: `src/infrastructure/api/server/**`, `src/app/app.module.ts` · Src: [7], [20], project: docs/security.md
- **[SEC-21] HSTS is scoped to HTTPS and reviewed** — `Strict-Transport-Security` is sent only on HTTPS responses with `max-age` ≥ 31536000; `includeSubDomains` and `preload` are present only when every subdomain is HTTPS-only and the domain is submitted to the preload list, otherwise the omission is documented.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/api/server/**` · Src: [7], project: docs/security.md
- **[SEC-22] JSON responses declare an explicit content type** — Every JSON success and error response sets `Content-Type: application/json; charset=utf-8`; only Swagger UI and static files are served as `text/html`, and no error is rendered as HTML.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `src/app/filters/global-exception/**`, `src/infrastructure/api/server/**` · Src: [7], [30]
- **[SEC-23] CORS origins and credentials are safe together** — `CORS_ORIGIN` is either an explicit `https://` allowlist or the documented `*` default, and a wildcard is used only while `credentials` is `false` and `goat-it-api-key` is absent from the allowed headers.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/api/server/cors/**`, `src/infrastructure/api/config/validators/**`, `env/.env.example` · Src: [21], project: docs/security.md
- **[SEC-24] CORS does not expose the API-key header to browsers** — `goat-it-api-key` is absent from `Access-Control-Allow-Headers`; only `Content-Type` and `Authorization` are allowed, and the preflight response never reflects an arbitrary requested header.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/api/server/cors/**` · Src: [21], project: docs/security.md
- **[SEC-25] Sensitive responses are not cacheable** — Health, authentication-failure, validation-error and Swagger responses set `Cache-Control: no-store`, and no authenticated JSON response is stored by a shared cache.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `src/infrastructure/api/health/**`, `src/app/filters/global-exception/**`, `src/infrastructure/api/server/swagger/**` · Src: [7], project: docs/operations.md

## 4. Rate limiting and abuse prevention

- **[SEC-26] Every business route is rate limited** — Every business route is covered by a throttler with an explicit window and budget configurable through validated integer environment variables, and no business route is exempt; a documented absence is a GAP, not a pass.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Target: reach · Severity: high · Look: `src/infrastructure/api/server/**`, `src/app/app.module.ts`, `env/.env.example` · Src: [22], [10], project: docs/security.md
- **[SEC-27] Throttled responses follow a stable 429 contract** — A throttled request returns HTTP 429 with `Retry-After` in seconds and the shared error envelope (`statusCode: 429`, `errorCode`), never a 500, an empty body or a silent drop.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `src/infrastructure/api/server/**`, `src/app/filters/global-exception/**` · Src: [22], [5]
- **[SEC-28] Client-IP trust is explicit** — When the limiter keys on client IP, proxy trust is off by default; with `trustProxy` enabled the deployment documents that the reverse proxy overwrites `X-Forwarded-For`, and an unresolvable client IP is limited under a shared fallback key rather than exempted (verified: fastify 5.12.8).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/api/server/**` · Src: [30], [10], project: docs/security.md
- **[SEC-29] Request bodies have an explicit size limit** — Body-bearing routes enforce an explicit Fastify/body-guard limit of at most 512 KiB and return 413 before buffering an oversized payload; the implicit Fastify default of 1 MiB is not the only control (verified: fastify 5.12.8).
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/infrastructure/api/server/**`, `src/app/app.module.ts` · Src: [30], [10], [31], project: docs/security.md
- **[SEC-30] Body-bearing routes accept JSON only** — `POST`, `PUT` and `PATCH` routes accept only `application/json` and return 415 for form-encoded, multipart or text bodies; no route parses a content type it does not consume.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/api/server/**`, `src/contexts/*/infrastructure/http/controllers/**` · Src: [30], [5], [31]
- **[SEC-31] No server-side JavaScript runs inside database queries** — No Mongoose filter, update or aggregation pipeline uses `$where`, `$function`, `$accumulator` or another server-side JavaScript operator, so request data can never execute inside MongoDB.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/*/infrastructure/persistence/**`, `src/shared/infrastructure/persistence/**` · Src: [13], [36], [6]
- **[SEC-32] Patterns applied to request data are ReDoS-safe** — Every regular expression applied to request data has no nested or overlapping quantifiers, runs on length-bounded input, and user input is never compiled into a `RegExp`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/api/config/validators/**`, `src/shared/application/dto/zod/**`, `src/contexts/*/application/dto/zod/**` · Src: [10], [6]

## 5. Secrets and configuration

- **[SEC-33] Secrets abort startup when missing; other configuration is validated with documented defaults** — Every secret variable has no default, so a missing or too-short value aborts startup; every other schema-backed variable is validated and falls back to its documented default. The current variable inventory is recorded in `docs/security.md` and `.env.example`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/api/config/schemas/**`, `src/infrastructure/api/config/helpers/**`, `src/infrastructure/api/config/config.module.ts` · Src: [25], [33], [3], project: docs/security.md
- **[SEC-34] Secrets have no defaults** — Every secret variable has no default in the schema, constants or tracked env template; a boot without it fails instead of falling back to a known value; the current variable inventory is recorded in `docs/security.md` and `.env.example`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/api/config/schemas/**`, `src/infrastructure/api/config/constants/**`, `env/.env.example` · Src: [8], project: docs/security.md
- **[SEC-35] Config getters never return plaintext secrets** — The application configuration facade exposes only non-secret configuration through getters; plaintext API keys are consumed once into HMAC validators and are never returned by a public getter, DTO, controller or mapper.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/api/config/providers/**`, `src/infrastructure/api/config/types/**` · Src: [8], project: docs/security.md
- **[SEC-36] Every production build runs the secret scan** — `pnpm run check:secrets-in-built-output` runs after `pnpm run build` in the CI build action and in the Docker build stage, and a non-zero exit fails the build.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/actions/build/**`, `Dockerfile`, `scripts/check-secrets-in-built-output.sh`, `package.json` · Src: [8], project: docs/security.md
- **[SEC-37] Built output contains no monitored secret value** — After a production build, `dist/**` contains none of the values of environment variables whose names contain `SECRET`, `TOKEN`, `PASSWORD`, `PRIVATE_KEY` or `API_KEY`, and the scan exits 0.
  Evidence: `artifact` · Diff: ✗ · Core: ✓ · Severity: critical · Src: [8], project: docs/security.md
- **[SEC-38] Environment-validation errors never echo values** — A failed environment validation aborts boot with a message that names the variable and the failed rule, never the submitted value, a parsed config dump or another variable's value.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/api/config/helpers/**`, `src/infrastructure/api/config/schemas/**` · Src: [9], project: docs/security.md
- **[SEC-39] Swagger and app metadata expose no configuration** — The generated OpenAPI document and `GET /` expose no environment values, secret names, database host/name, internal server URL, stack trace or example credential; only the package metadata and declared DTO fields are present.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/api/server/swagger/**`, `src/app/controllers/**`, `src/app/providers/**` · Src: [26], project: docs/security.md
- **[SEC-40] Health output is minimal** — `GET /health` returns only the overall status, per-check up/down details and `Cache-Control: no-store`; it contains no connection string, environment name, version, error message, stack or internal URL.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/api/health/**` · Src: [28], project: docs/operations.md

## 6. Error handling and information leakage

- **[SEC-41] One global exception filter composes every HTTP error** — Exactly one global catch-all exception filter is registered, so controller, use-case and repository errors all pass through one HTTP composition point.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/app/filters/global-exception/**`, `src/app/app.module.ts` · Src: [24], project: docs/architecture.md
- **[SEC-42] Unexpected errors return a generic 500** — Any non-HTTP, non-mapped error returns HTTP 500 with the fixed body `statusCode: 500`, `message: "Internal Server Error"` and no stack, file path, dependency name, query or original message (verified: @nestjs/common 12.3.2).
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/app/filters/global-exception/**` · Src: [24], [9], project: docs/security.md
- **[SEC-43] Domain errors map only to client-actionable statuses** — The domain-error mapping table maps only not-found, bad-request and conflict errors the client can act on; every other domain error, including the four write/read-back errors, falls through to 500 with a recorded one-line justification.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/app/filters/global-exception/**`, `src/contexts/*/domain/errors/**` · Src: [24], project: docs/architecture.md
- **[SEC-44] Error codes are derived from class names only** — `errorCode` is the kebab-case error class name without the `Error` suffix and never interpolates a message, ID, user input, query, environment value or secret.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `src/shared/infrastructure/http/errors/**` · Src: [9], project: docs/security.md
- **[SEC-45] Production 404 and 500 responses leak no internals** — On the production build, an unknown path and a forced 500 return no stack trace, source file path, framework or Node version, environment name, request header or database detail.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Look: `tests/acceptance/features/**` · Src: [9], project: docs/security.md
- **[SEC-46] Every error response matches the shared error shape** — Every error response conforms to the shared API error shape (`statusCode`, `message`, `error`, optional `errorCode` and `validationDetails`); no ad-hoc error object, upstream body or raw exception is serialized.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/app/filters/global-exception/**`, `src/shared/application/dto/**` · Src: [9], project: docs/architecture.md

## 7. Security logging

- **[SEC-47] Structured logging is installed at bootstrap** — Structured JSON logging is installed at bootstrap with buffered boot logs; production emits JSON and non-production may pretty-print, so boot and request logs share one pipeline.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `src/app/helpers/**`, `src/app/app.module.ts`, `src/infrastructure/api/server/server.ts` · Src: [35], [34]
- **[SEC-48] Logs never carry request bodies, headers or API keys** — No log call serializes a request body, request headers, cookies, `goat-it-api-key`, `Authorization` or an environment value; log records carry only method, route, status, error class/message and timing.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/app/helpers/**`, `src/app/filters/global-exception/**`, `src/infrastructure/api/auth/**`, `src/infrastructure/api/server/**` · Src: [14], [8], project: docs/security.md
- **[SEC-49] Logger redaction covers credential paths** — Pino `redact` paths cover `authorization`, `cookie`, `apiKey`, `gameKey`, `token`, `password` and `goat-it-api-key` at top level and under `req.headers` and `request.headers`, as defense in depth (verified: pino 10.3.1).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/app/helpers/**` · Src: [34], [14]
- **[SEC-50] Security-relevant events are logged** — Failed authentication (401), validation failures (400), throttling (429) and unhandled 500 errors each emit a structured event with a stable name, status and route, sampled or aggregated when noisy and containing no secret.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/api/auth/**`, `src/app/filters/global-exception/**`, `src/infrastructure/api/server/**` · Src: [14], [4], project: docs/security.md

## 8. Vulnerability disclosure

- **[SEC-51] Security policy file** — A `SECURITY.md` at the repository root or in `.github/` names the supported versions, the private reporting channel (GitHub private vulnerability reporting) and the expected response time.
  Evidence: `static` · Diff: ✓ · Target: reach · Severity: medium · Src: [40], [15], project: docs/security.md
- **[SEC-52] Private vulnerability reporting is enabled** — `gh api repos/{owner}/{repo}/private-vulnerability-reporting` returns `{"enabled": true}`, and the public repository lets external reporters open a private advisory.
  Evidence: `command` · Diff: ✗ · Severity: low · Src: [39]
- **[SEC-53] Sensitive findings are triaged as private draft advisories** — Every 🔒 finding (an exploitable path today, secret or personal-data exposure, a missing control that gives an attacker a roadmap) is filed as a private GitHub draft security advisory, or the maintainer explicitly chooses another private channel; non-sensitive findings go to public issues carrying the `🐐 goat-audit` label; the local report records the finding (its Appendix B artifact is the GHSA id and advisory URL), and no exploitable detail is referenced in any public issue, pull request, commit or other public artifact before remediation.
  Evidence: `manual` · Diff: ✗ · Severity: medium · Src: [41], project: docs/security.md

## 9. Swagger and documentation exposure

- **[SEC-54] Swagger is not publicly reachable in production** — `/docs` and `/docs-json` are disabled in production or protected by the admin API key; outside production they may stay open, and the choice is recorded in `docs/security.md`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/api/server/**`, `env/.env.example` · Src: [26], [27], project: docs/security.md
- **[SEC-55] OpenAPI output contains no secrets or internal hosts** — The generated OpenAPI document contains no API key value, HMAC secret, database name or host, internal server URL or example credential; the `goat-it-api-key` scheme is documented by header name only.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/api/server/swagger/**`, `src/contexts/*/infrastructure/http/controllers/**` · Src: [27], [5]

## Sources

[1] OWASP ASVS 5.0 V2 Validation and Business Logic — https://raw.githubusercontent.com/OWASP/ASVS/master/5.0/en/0x11-V2-Validation-and-Business-Logic.md (fetched 2026-11-04; ASVS 5.0.0)
[2] OWASP ASVS 5.0 V4 API and Web Service — https://raw.githubusercontent.com/OWASP/ASVS/master/5.0/en/0x13-V4-API-and-Web-Service.md (fetched 2026-11-04; ASVS 5.0.0)
[3] OWASP ASVS 5.0 V13 Configuration — https://raw.githubusercontent.com/OWASP/ASVS/master/5.0/en/0x22-V13-Configuration.md (fetched 2026-11-04; ASVS 5.0.0)
[4] OWASP ASVS 5.0 V16 Security Logging and Error Handling — https://raw.githubusercontent.com/OWASP/ASVS/master/5.0/en/0x25-V16-Security-Logging-and-Error-Handling.md (fetched 2026-11-04; ASVS 5.0.0)
[5] OWASP REST Security Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html (fetched 2026-11-04)
[6] OWASP Node.js Security Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html (fetched 2026-11-04)
[7] OWASP HTTP Security Response Headers Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html (fetched 2026-11-04)
[8] OWASP Secrets Management Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html (fetched 2026-11-04)
[9] OWASP Error Handling Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html (fetched 2026-11-04)
[10] OWASP Denial of Service Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html (fetched 2026-11-04)
[11] OWASP Authorization Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html (fetched 2026-11-04)
[12] OWASP Authentication Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html (fetched 2026-11-04)
[13] OWASP Injection Prevention Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_Cheat_Sheet.html (fetched 2026-11-04)
[14] OWASP Logging Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html (fetched 2026-11-04)
[15] OWASP Vulnerability Disclosure Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/Vulnerability_Disclosure_Cheat_Sheet.html (fetched 2026-11-04)
[16] OWASP Prototype Pollution Prevention Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/Prototype_Pollution_Prevention_Cheat_Sheet.html (fetched 2026-11-04)
[17] OWASP API Security Top 10 2023 — https://owasp.org/API-Security/editions/2023/en/0x11-t10/ (fetched 2026-11-04)
[18] NestJS Authentication — https://docs.nestjs.com/security/authentication (fetched 2026-11-04; NestJS 12 docs)
[19] NestJS Authorization — https://docs.nestjs.com/security/authorization (fetched 2026-11-04; NestJS 12 docs)
[20] NestJS Helmet — https://docs.nestjs.com/security/helmet (fetched 2026-11-04; NestJS 12 docs)
[21] NestJS CORS — https://docs.nestjs.com/security/cors (fetched 2026-11-04; NestJS 12 docs)
[22] NestJS Rate Limiting — https://docs.nestjs.com/security/rate-limiting (fetched 2026-11-04; NestJS 12 docs)
[23] NestJS Validation — https://docs.nestjs.com/techniques/validation (fetched 2026-11-04; NestJS 12 docs)
[24] NestJS Exception Filters — https://docs.nestjs.com/exception-filters (fetched 2026-11-04; NestJS 12 docs)
[25] NestJS Configuration — https://docs.nestjs.com/configuration (fetched 2026-11-04; NestJS 12 docs)
[26] NestJS OpenAPI Introduction — https://docs.nestjs.com/openapi/introduction (fetched 2026-11-04; NestJS 12 docs)
[27] NestJS OpenAPI Security — https://docs.nestjs.com/openapi/security (fetched 2026-11-04; NestJS 12 docs)
[28] NestJS Terminus Health Checks — https://docs.nestjs.com/recipes/terminus (fetched 2026-11-04; NestJS 12 docs)
[29] NestJS MongoDB — https://docs.nestjs.com/techniques/mongodb (fetched 2026-11-04; NestJS 12 docs)
[30] Fastify Server Reference (bodyLimit, trustProxy, request limits) — https://fastify.dev/docs/latest/Reference/Server/ (fetched 2026-11-04; Fastify 5.12.8)
[31] Fastify Recommendations — https://fastify.dev/docs/latest/Guides/Recommendations/ (fetched 2026-11-04; Fastify 5.12.8)
[32] nestjs-zod README and ZodValidationPipe — https://github.com/BenLorantfy/nestjs-zod (fetched 2026-11-04; nestjs-zod 5.5.0)
[33] Zod API Reference (objects, unknown keys, URL schema) — https://zod.dev/api (fetched 2026-11-04; zod 4.6.7)
[34] pino Redaction — https://github.com/pinojs/pino/blob/main/docs/redaction.md (fetched 2026-11-04; pino 10.3.1)
[35] nestjs-pino — https://github.com/iamolegga/nestjs-pino (fetched 2026-11-04; nestjs-pino 5.3.1)
[36] Mongoose Validation — https://mongoosejs.com/docs/validation.html (fetched 2026-11-04; Mongoose 9.11.4)
[37] Node.js crypto `timingSafeEqual` — https://nodejs.org/api/crypto.html#cryptotimingsafeequala-b (fetched 2026-11-04; Node.js 26.13.0)
[38] Node.js `process.env` — https://nodejs.org/api/process.html#processenv (fetched 2026-11-04; Node.js 26.13.0)
[39] GitHub REST API: Check private vulnerability reporting — https://docs.github.com/en/rest/repos/repos#check-if-private-vulnerability-reporting-is-enabled-for-a-repository (fetched 2026-11-04)
[40] GitHub Docs: Privately reporting a security vulnerability — https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability (fetched 2026-11-04)
[41] GitHub Docs: About repository security advisories — https://docs.github.com/en/code-security/security-advisories/working-with-repository-security-advisories/about-repository-security-advisories (fetched 2026-11-04)
