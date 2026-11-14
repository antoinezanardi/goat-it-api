# API — HTTP contract, OpenAPI, versioning, errors

The HTTP contract of the Goat It API as a NestJS 12 + Fastify 5 service: route inventory and REST semantics, the exact request contracts validated by Zod (limit, sort, question filters, random-search body, localization), the two response audiences (game and admin) and their strict shapes, the unified error envelope produced by the global exception filter with its 12 domain mappings and derived `errorCode`s, the OpenAPI document served at `/docs` and what it does and does not declare, the absence of global prefixing or versioning and the compatibility policy that replaces it, the Bruno collection as the runnable client, and the acceptance suites as the executable contract. Checks verify that the code implements what `docs/api-contract.md` records, and that the documented Known limitations are the only divergences.

**Decision doc:** `docs/api-contract.md` (section `## GOAT audit decisions`). **Diff triggers:** see SKILL.md category index.

**Not in this category:** input-validation attack surface and authentication → SEC · schema shapes and indexes → DATA · domain invariants → LOGIC · query performance and pagination tuning → PERF

## Contents

- [1. Route design and inventory](#1-route-design-and-inventory)
- [2. Request contracts](#2-request-contracts)
- [3. Response contracts](#3-response-contracts)
- [4. Error contract](#4-error-contract)
- [5. OpenAPI and Swagger](#5-openapi-and-swagger)
- [6. Versioning and compatibility](#6-versioning-and-compatibility)
- [7. Client tooling](#7-client-tooling)
- [8. Contract testing](#8-contract-testing)
- [Sources](#sources)

## 1. Route design and inventory

- **[API-01] Route prefixes have one declaration and one audience namespace** — Every controller prefix is declared once and never repeated as a literal, every administrative resource is mounted under the documented admin namespace, and every game resource stays outside it; the prefix inventory is recorded in `docs/api-contract.md`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/shared/infrastructure/http/controllers/**`, `src/contexts/**/infrastructure/http/controllers/**` · Src: [1], project: docs/api-contract.md
- **[API-02] REST resource naming and method semantics** — Resource segments are plural kebab-case nouns (`questions`, `question-themes`); no segment duplicates the HTTP method (`get`, `create`, `update`, `delete`) and the documented action/read subresources (`search/random`, `stats`, `archive`) are the only enumerated exceptions; reads use GET, creation uses POST with 201, partial modification uses PATCH and subresource detach uses DELETE; PUT is never exposed.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/**/infrastructure/http/controllers/**`, `src/shared/infrastructure/http/controllers/**` · Src: [1], [8], project: docs/api-contract.md
- **[API-03] Route inventory matches the documented contract exactly** — Every compiled controller route appears exactly once in the documented route inventory with the same method, path, audience, auth decorator and success status, and every inventory row resolves to a compiled route; adding, removing or renaming a route updates the documentation in the same change.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/**/infrastructure/http/controllers/**`, `src/app/controllers/**`, `src/infrastructure/api/health/controllers/**` · Src: [1], project: docs/api-contract.md
- **[API-04] Path identifiers are validated before use** — Every resource identifier path parameter follows the documented id naming for its depth (`id` at the top level, `<subresource>Id` for a nested resource) and is transformed by the shared Mongo id pipe, which rejects a missing, non-string or non-ObjectId value with 400 before any use case executes.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/shared/infrastructure/http/pipes/mongo/**`, `src/contexts/**/infrastructure/http/controllers/**` · Src: [1], [8], project: docs/api-contract.md
- **[API-05] Archive is an action subresource, not a hard delete** — Archiving is exposed as `POST /:id/archive`, returns the archived resource with 200, exists consistently for both aggregates, and no hard-delete route exists for either aggregate.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `src/contexts/**/infrastructure/http/controllers/**` · Src: [1], [8], project: docs/api-contract.md

## 2. Request contracts

- **[API-06] Validation is wired end-to-end** — Every `@Body()` and `@Query()` binding is schema-validated before its handler executes, every binding uses a schema-backed DTO imported as a value (never a bare type or a type-only import), and no controller parses raw request data manually.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/app/app.module.ts`, `src/contexts/**/infrastructure/http/dto/**`, `src/contexts/**/infrastructure/http/controllers/**` · Src: [2], [6], project: docs/api-contract.md
- **[API-07] Request shapes are permissive and strip unknown keys** — Request DTO shapes use a non-strict `z.object` deliberately, so unknown keys are stripped by Zod and never retained or persisted; no request shape uses `z.looseObject`, `.passthrough()` or `.catchall()`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/**/application/dto/**`, `src/shared/application/dto/**` · Src: [11], project: docs/api-contract.md, project: docs/architecture.md §7.1
- **[API-08] Limit semantics are shared and unambiguous** — `limit` is a coerced non-negative integer with the documented default, where `0` means unlimited; the same key and semantics are exposed on every list route, and no `page`/`offset` parameter exists anywhere; the default is recorded in `docs/api-contract.md`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/shared/application/dto/zod/validators/limit/**`, `src/contexts/**/application/dto/**` · Src: [11], project: docs/api-contract.md
- **[API-09] Sort contract is constrained per audience** — `sort-by` and `sort-order` are the only sort keys, `sort-order` accepts only the documented directions, and `sort-by` is restricted to the per-audience allowlist recorded in `docs/api-contract.md`; each resource's default field and direction are declared in constants and match the documented query contract.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/shared/application/dto/zod/validators/sort/**`, `src/contexts/**/application/dto/**`, `src/contexts/**/domain/constants/**` · Src: [11], project: docs/api-contract.md
- **[API-10] Question filter contract has explicit names and bounds** — The public question filter contract exposes only the documented filter names, each with an explicit bound and uniqueness rule; the current names and bounds are recorded in `docs/api-contract.md`, including any unbounded array recorded as a limitation.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/application/dto/**`, `src/contexts/question/application/dto/zod/validators/**` · Src: [11], project: docs/api-contract.md
- **[API-11] Random-search body is bounded** — The random body accepts only the documented filters, each with an explicit bound and uniqueness rule; `limit` and the id-exclusion array are bounded, and any unbounded array is recorded as a limitation in `docs/api-contract.md` until it is closed.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/contexts/question/application/dto/find-random-questions-body/**`, `src/contexts/question/application/dto/zod/validators/**` · Src: [11], project: docs/api-contract.md
- **[API-12] Theme query contract stays narrower than the question contract** — The theme list accepts only the documented query keys, the admin variant adds only the documented administrative filters, and no question-only filter is accepted on a theme route; the current contract is recorded in `docs/api-contract.md`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question-theme/application/dto/**`, `src/contexts/question-theme/contracts/dto/**` · Src: [11], project: docs/api-contract.md
- **[API-13] Localization input is validated on every route** — The localization middleware reads the first locale of `Accept-Language`, accepts only the locale set recorded in `docs/i18n.md`, falls back to the configured fallback locale when the header is absent or `*`, and answers 400 for an invalid locale before the handler runs.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/shared/infrastructure/http/middlewares/localization/**`, `src/shared/domain/value-objects/locale/**` · Src: [8], project: docs/api-contract.md

## 3. Response contracts

- **[API-14] Responses are strict, documented shapes** — Every response object DTO, including each element of a list response, is a `z.strictObject` with `.describe()`/`.meta()` on public fields; no persistence document, Mongoose type or internal mapper output is returned raw, and unknown fields cannot be serialized.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/contexts/**/application/dto/**`, `src/contexts/**/contracts/dto/**`, `src/shared/application/dto/**` · Src: [11], project: docs/architecture.md §7.1
- **[API-15] Public and admin response variants stay distinct** — Game responses expose resolved localized strings only, while admin responses expose the full per-locale records plus status and administrative detail; the two shapes are separate DTOs selected per controller audience and neither leaks the other's fields.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/application/dto/**`, `src/contexts/question-theme/contracts/dto/**`, `src/contexts/**/application/mappers/**` · Src: [11], project: docs/api-contract.md
- **[API-16] Success status codes are explicit and correct** — Every route declares its happy-path status explicitly: reads and PATCH return 200, creates return 201, archive actions return 200 and DELETE returns 200; no route relies on an implicit framework default and no 204 is used for a resource-returning route.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/contexts/**/infrastructure/http/controllers/**`, `src/app/controllers/**`, `src/infrastructure/api/health/controllers/**` · Src: [6], [8], project: docs/api-contract.md
- **[API-17] Response serialization is enforced at runtime** — Success payloads are serialized against their declared response schema before leaving the process, so a handler return value that drifts from the contract fails loudly instead of silently leaking fields; the same declaration supplies the OpenAPI success response.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/**/infrastructure/http/controllers/**`, `src/infrastructure/api/health/controllers/**` · Src: [6], project: docs/architecture.md §7.1
- **[API-18] List and single-resource envelopes are stable** — List endpoints return a bare JSON array and single-resource endpoints return a bare object; no ad-hoc `{ data: ... }` wrapper is introduced, and every success response from a resource endpoint is `application/json`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/**/infrastructure/http/controllers/**`, `src/shared/infrastructure/http/**` · Src: [8], project: docs/api-contract.md
- **[API-19] A list element has the single-resource shape** — For a given audience, the element type of a list response is exactly the single-resource response type (same fields, same localization and same nullability), so a client can reuse one parser for both.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/question/application/dto/**`, `src/contexts/question-theme/contracts/dto/**` · Src: [11], project: docs/api-contract.md
- **[API-20] CORS advertises only the headers and methods browser clients may use** — The CORS configuration allows only `Content-Type` and `Authorization`, never the `goat-it-api-key` header, and lists only methods that are implemented; an API-key-authenticated browser call is unsupported by design, and the limitation is recorded in `docs/api-contract.md`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/api/server/cors/**`, `src/infrastructure/api/auth/constants/**` · Src: [8], project: docs/api-contract.md

## 4. Error contract

- **[API-21] Validation failures produce the fixed 400 envelope** — A Zod validation failure is answered with 400 and `{ statusCode: 400, message: "Invalid request payload", error: "Bad Request", validationDetails: [...] }`, where each detail follows the pure validation-detail shape and no raw exception, stack or uncurated input dump is included.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/app/filters/global-exception/**`, `src/shared/application/dto/api-response-exception/**` · Src: [3], [6], project: docs/api-contract.md
- **[API-22] HTTP exceptions pass through unchanged** — Guard 401s, pipe 400s, localization 400s and health 503s keep their own status and their own response body; the global filter never wraps, re-labels or downgrades an HTTP exception.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/app/filters/global-exception/**`, `src/infrastructure/api/auth/**`, `src/shared/infrastructure/http/pipes/**` · Src: [3], project: docs/api-contract.md
- **[API-23] Domain errors map to the documented 4xx table** — Every mapped domain error appears in the mapping table with exactly one client-actionable status and the documented body shape; the current table is recorded in `docs/api-contract.md`.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/app/filters/global-exception/**`, `src/contexts/**/domain/errors/**` · Src: [3], project: docs/api-contract.md, project: docs/architecture.md §7.4
- **[API-24] `errorCode` is derived, stable and unique** — Every mapped domain error exposes an `errorCode` computed from the class name by stripping the `Error` suffix and kebab-casing the remainder, never hand-written; each mapped class yields a unique code and the derivation is covered by tests.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/app/filters/global-exception/**`, `src/shared/infrastructure/http/errors/helpers/**` · Src: [3], project: docs/api-contract.md
- **[API-25] The generic 500 body is the stock Nest shape** — An unknown or unclassified error is logged and answered with the stock `{ statusCode: 500, message: "Internal Server Error" }`; no domain, persistence or driver message reaches the client, and the missing `errorCode` on 500 is recorded as a known limitation.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/app/filters/global-exception/**` · Src: [3], project: docs/api-contract.md
- **[API-26] Write/read-back errors stay intentionally unmapped** — Every write/read-back error class is absent from the mapping table, falls through to 500, and is locked by filter tests; the current class list is recorded in `docs/domain-logic.md` and `docs/architecture.md` §7.4.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/app/filters/global-exception/**`, `src/contexts/question/domain/errors/**` · Src: [3], project: docs/architecture.md §7.4
- **[API-27] No internal detail leaks through an error response** — Error bodies never contain stack traces, Mongoose or MongoDB error text, file paths, query fragments or raw infrastructure exception messages; only curated domain messages, HTTP labels, validation details and derived error codes are exposed.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/app/filters/global-exception/**`, `src/shared/infrastructure/http/errors/**` · Src: [3], project: docs/api-contract.md
- **[API-28] Error status and content type are internally consistent** — Every error response is `application/json` with a numeric `statusCode` equal to the HTTP status line; no route returns an error payload with 200 and no API error is rendered as HTML.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/app/filters/global-exception/**`, `src/infrastructure/api/server/**` · Src: [3], [8]

## 5. OpenAPI and Swagger

- **[API-29] The Swagger UI is served at `/docs` outside production** — The application builds an OpenAPI document and serves the Swagger UI at `/docs` outside production; in production availability follows [SEC-54]. The acceptance suite fetches it over real HTTP and asserts 200 outside production, and the readiness target is an endpoint that exists in the environment it probes.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Look: `src/infrastructure/api/server/swagger/**`, `tests/acceptance/features/app/docs/**` · Src: [5], project: docs/api-contract.md
- **[API-30] Every operation has a summary, a description and a tag** — Each route declares a non-empty summary, a non-empty description and at least one tag from the shared Swagger tag constants; no route is left with framework-generated default metadata.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/**/infrastructure/http/controllers/**`, `src/app/controllers/**`, `src/infrastructure/api/server/swagger/constants/**` · Src: [5], project: docs/api-contract.md
- **[API-31] Success responses are generated from the runtime schemas** — Every route declares its success response with the response decorator and the same DTO wrapper used at runtime, so the generated OpenAPI schema and the serializer cannot drift apart.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/**/infrastructure/http/controllers/**`, `src/app/controllers/**`, `src/infrastructure/api/health/controllers/**` · Src: [5], [6], project: docs/api-contract.md
- **[API-32] The API-key security scheme is declared** — The OpenAPI document declares the API-key security scheme (the `goat-it-api-key` header) and every authenticated operation references it, while public operations declare an empty security requirement; a document that omits the scheme leaves generated clients unable to authenticate.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/api/server/swagger/**`, `src/infrastructure/api/auth/**` · Src: [5], [7], project: docs/api-contract.md
- **[API-33] Error responses are documented per operation** — Operations document their 4xx and 5xx responses with the shared error envelope (and the health route documents 503), not only the happy path; the validation 400, auth 401 and domain 404/409 are discoverable from the document.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/**/infrastructure/http/controllers/**`, `src/infrastructure/api/health/controllers/**`, `src/shared/application/dto/api-response-exception/**` · Src: [5], [7], project: docs/api-contract.md

## 6. Versioning and compatibility

- **[API-34] Contract changes are classified before shipping** — Any change to a public route, request field, response field, success status or `errorCode` is treated as a contract change and either stays backward-compatible or ships with a documented compatibility plan; an unclassified breaking change is a release blocker.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `packages/schemas/**`, `src/contexts/**/contracts/dto/**` · Src: [7], [10], project: docs/api-contract.md
- **[API-35] The versioning posture is explicit** — There is no global prefix and no URI, header or media-type versioning today; the absence is recorded as a known limitation in the API contract documentation, and introducing versioning is a documented decision rather than an accidental route rename.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/main.ts`, `src/infrastructure/api/server/**` · Src: [4], project: docs/api-contract.md
- **[API-36] The published package follows semver** — `@goat-it/schemas` bumps the patch version when an existing export changes and asks before adding a new export; the package version, entrypoint map and built entrypoints describe the same public surface, and every declared consumer resolves a compatible published range.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `packages/schemas/**`, `AGENTS.md` · Src: [10], project: docs/architecture.md §11, project: AGENTS.md
- **[API-37] Published exports stay pure and stable** — Only pure DTO shapes, constants, value objects, pure helpers and faketories are exported; DTO wrappers, controllers, Nest modules, Mongoose schemas and repositories are never exported, and moving a shape between the internal and published DTO layers keeps the exported symbol stable.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `packages/schemas/src/**`, `packages/schemas/package.json`, `packages/schemas/tsdown.config.ts` · Src: [10], project: docs/architecture.md §11
- **[API-38] Deprecation precedes removal** — Removing or renaming a public field or export requires a deprecation window or a major version; no field disappears silently from a DTO shape, an error code or the published package.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `packages/schemas/**`, `src/contexts/**/contracts/dto/**` · Src: [10], project: docs/architecture.md §11

## 7. Client tooling

- **[API-39] Bruno requests follow the repository naming convention** — Every request file follows `<scope>-<verb>-<resource>[-by-id].bru` and lives under the matching `admin/`, `play/` or `public/` folder; folder files and environment files keep their expected names.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `configs/bruno/Goat It/**` · Src: [9], project: docs/bruno.md, project: AGENTS.md
- **[API-40] The Bruno collection covers every documented route** — Every route in the route inventory has a corresponding request, no request targets a removed route, and any intentional gap is recorded in the collection documentation; adding a route adds or updates its request in the same change.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `configs/bruno/Goat It/**` · Src: [9], project: docs/bruno.md
- **[API-41] Bruno requests are runnable and secret-safe** — Authenticated requests inherit authentication and public requests carry none; every request reads the base URL and secrets from environment variables (`vars:secret` for credentials and ids), no request hard-codes a host or key, and example payloads mirror the acceptance-test shapes.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `configs/bruno/Goat It/**` · Src: [9], project: docs/bruno.md

## 8. Contract testing

- **[API-42] Acceptance suites cover every route's happy path** — Every route in the inventory has at least one acceptance scenario that sends a real HTTP request and asserts the success status and the response shape; adding a route adds a scenario in the same change.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `tests/acceptance/features/**` · Src: [8], project: docs/api-contract.md
- **[API-43] Error paths are executable contract tests** — Acceptance suites assert the 400 validation envelope, 401 authentication failure, 404 not found and 409 conflict for the endpoints that document them, so the error table is tested and not only described.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `tests/acceptance/features/**` · Src: [3], [8], project: docs/api-contract.md
- **[API-44] The OpenAPI document is smoke-tested and diffed** — The acceptance suite asserts that `/docs` answers 200 and serves the document, and a schema-diff or snapshot check detects an unintended contract change; a missing diff is a GAP, not a pass.
  Evidence: `static` · Diff: ✓ · Target: reach · Severity: low · Look: `tests/acceptance/features/app/docs/**`, `scripts/**` · Src: [5], project: docs/api-contract.md
- **[API-45] DTO shape specs lock the request/response contract** — DTO shape specs parse valid and invalid payloads for the top-level request and response shapes, assert that response shapes reject unknown keys and that request shapes strip them, and cover nested shapes through their parents.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/**/application/dto/**`, `src/contexts/**/contracts/dto/**`, `src/shared/application/dto/**` · Src: [11], project: docs/architecture.md §7.1

## Sources

[1] NestJS — Controllers: https://docs.nestjs.com/controllers (fetched 2026-11-04)
[2] NestJS — Validation: https://docs.nestjs.com/techniques/validation (fetched 2026-11-04)
[3] NestJS — Exception filters: https://docs.nestjs.com/exception-filters (fetched 2026-11-04)
[4] NestJS — Versioning: https://docs.nestjs.com/techniques/versioning (fetched 2026-11-04)
[5] NestJS — OpenAPI (Swagger) introduction: https://docs.nestjs.com/openapi/introduction (fetched 2026-11-04)
[6] nestjs-zod — README: https://github.com/BenLorantfy/nestjs-zod (fetched 2026-11-04)
[7] OpenAPI Specification 3.1.0: https://spec.openapis.org/oas/v3.1.0.html (fetched 2026-11-04)
[8] RFC 9110 — HTTP Semantics: https://www.rfc-editor.org/rfc/rfc9110.html (fetched 2026-11-04)
[9] Bruno — Documentation: https://docs.usebruno.com/ (fetched 2026-11-04)
[10] Semantic Versioning 2.0.0: https://semver.org/ (fetched 2026-11-04)
[11] Zod — API reference: https://zod.dev/api (fetched 2026-11-04)
