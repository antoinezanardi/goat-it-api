# STACK — Framework & stack correctness

Correct use of the framework and library APIs this API is built on: NestJS 12 dependency injection, modules, lifecycle hooks and guards; the Fastify 5 adapter, CORS and reply semantics; Mongoose 9 connection and schema registration through `@nestjs/mongoose`; Zod 4 schemas and the `nestjs-zod` validation/serialization/OpenAPI bridge; the SWC builder, `tsc-alias` ESM extension rewriting and the `tsgo` typecheck gate; the `nestjs-pino` logger, `@nestjs/terminus` health checks and `@nestjs/swagger` document setup; and the Node/pnpm and `@nestjs/*` version alignment those pieces require. A check here fails when code or configuration misuses a documented API contract or relies on a deprecated, removed or version-specific behaviour of the installed major.

**Decision doc:** `docs/architecture.md` (section `## GOAT audit decisions`). **Diff triggers:** see SKILL.md category index.

**Not in this category:** layering, file placement, module ownership and the published surface → ARCH · TypeScript strictness, naming, lint health, magic values and error-handling style → CODE · container, environment variables and runtime platform → PLAT · secrets, authentication and input-hardening consequences → SEC · timeout, retry and failure-mode behaviour → REL · log content and PII → PRIV/OPS · test strategy and coverage → TEST · actual MongoDB indexes and query plans → DATA · dependency advisories and upgrade bots → SUP

## Contents

- [1. NestJS 12 correctness](#1-nestjs-12-correctness)
- [2. Fastify 5 usage](#2-fastify-5-usage)
- [3. Mongoose 9 usage](#3-mongoose-9-usage)
- [4. Zod 4 and nestjs-zod](#4-zod-4-and-nestjs-zod)
- [5. Build and module system](#5-build-and-module-system)
- [6. Observability stack](#6-observability-stack)
- [7. Node and pnpm runtime alignment](#7-node-and-pnpm-runtime-alignment)
- [8. Framework-version hygiene](#8-framework-version-hygiene)
- [Sources](#sources)

## 1. NestJS 12 correctness

- **[STACK-01] DI metadata survives the import style** — Constructor-injected classes and DTOs used in decorated parameters (`@Body()`, `@Query()`, `@Param()`) are value imports, never `import type`; type-only symbols alone may use `import type`, and the linters keep `consistent-type-imports` off so `design:paramtypes` metadata and `ZodValidationPipe` keep working.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/**/*.ts`, `oxlint.config.jsonc` · Src: [2], project: AGENTS.md, project: docs/architecture.md §9
- **[STACK-02] Modules declare the graph explicitly** — Every module declares its `imports`, `controllers`, `providers` and `exports`; a provider is exported only when another module injects it, a module class is never injected as a provider, and a dynamic module is configured once and re-exported rather than reconfigured per importer.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `src/app/app.module.ts`, `src/contexts/*/*.module.ts`, `src/infrastructure/**/*.module.ts` · Src: [1], project: docs/architecture.md §6.2
- **[STACK-03] The logger module is registered exactly once** — `LoggerModule` is registered through `LoggerModule.forRoot(...)` or `forRootAsync(...)` in the root module; a feature module never imports the bare `LoggerModule` class, because `nestjs-pino` v5 is `@Global()` and a second registration silently registers `pino-http` again and logs every request twice.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `src/app/app.module.ts`, `src/**/*.module.ts` · Src: [23], project: docs/architecture.md §4.6
- **[STACK-04] Lifecycle hooks implement their interfaces and are awaited** — A class using `onModuleInit`, `onApplicationBootstrap`, `onModuleDestroy`, `beforeApplicationShutdown` or `onApplicationShutdown` implements the matching NestJS interface, returns `Promise<void>` for async work so Nest waits for it, and shutdown hooks are enabled with `app.enableShutdownHooks()` before listening.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/**/*.ts` · Src: [3], project: docs/architecture.md §6.1
- **[STACK-05] Controllers stay thin and delegate to use cases** — A controller only binds DTO wrappers and pipes, reads the localized request context, calls one use case and maps the entity to a response shape; it performs no repository or Mongoose access, no business rule and no HTTP-status mapping that belongs to `GlobalExceptionFilter`.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `src/contexts/*/infrastructure/http/controllers/**` · Src: [1], project: docs/architecture.md §4.3
- **[STACK-06] Guards and decorators use Nest metadata** — Authentication is applied through `@UseGuards` behind `@GameAuth()`/`@AdminAuth()` (or a registered `APP_GUARD`), never through manual header parsing in controllers; a guard implements `CanActivate` and returns a boolean or throws a NestJS HTTP exception.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/api/auth/**`, `src/contexts/*/infrastructure/http/controllers/**` · Src: [1], project: docs/architecture.md §4.6
- **[STACK-07] Injection tokens are exported by their owner** — A symbol token is declared in `<aggregate>.repository.constants.ts`, provided by the persistence module and exported before any consumer module injects it; a class token injected across a module boundary is listed in the owning module's `exports`.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `src/contexts/*/domain/repositories/*.constants.ts`, `src/contexts/*/infrastructure/persistence/*-persistence.module.ts` · Src: [2], project: docs/architecture.md §6.3
- **[STACK-08] Stateless providers keep the default singleton scope** — Controllers, use cases, repositories, guards and mappers do not opt into `Scope.REQUEST` or `Scope.TRANSIENT`; request-scoped providers are introduced only for per-request state and come with a documented reason, because they propagate the scope up the injection chain.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `src/**/*.ts` · Src: [2], project: docs/architecture.md §6.3

## 2. Fastify 5 usage

- **[STACK-09] Fastify is the only HTTP adapter** — `server.ts` creates the app with `NestFactory.create<NestFastifyApplication>(appModule, new FastifyAdapter(), { bufferLogs: true })`; no `ExpressAdapter`, `@nestjs/platform-express` dependency or Express middleware is present, and Fastify-specific reply types are used at the HTTP boundary.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/infrastructure/api/server/server.ts`, `package.json` · Src: [4], [11]
- **[STACK-10] Fastify 5 API contracts are respected** — The server calls `NestFastifyApplication.listen` with an options object (`{ port, host }`) as the project convention; the positional form (`listen(port, host)`) is a supported Nest wrapper and is not a Fastify 5 violation, while a raw Fastify instance must receive an options object. The server also uses `reply.hijack()` instead of assigning `reply.sent`, reads `request.socket` instead of `request.connection`, uses `reply.elapsedTime` instead of `getResponseTime()`, reads route metadata from `request.routeOptions`/`reply.routeOptions`, and passes a custom logger through `loggerInstance`, not `logger`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/api/server/**`, `src/app/filters/global-exception/**` · Src: [11], [9]
- **[STACK-11] CORS is configured explicitly and safely** — `app.enableCors(createCorsConfig(...))` receives an explicit `origin`, `methods`, `allowedHeaders` and `credentials`; credentials stay `false` while the origin is `*`, and enabling credentials requires an explicit origin list rather than a wildcard.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `src/infrastructure/api/server/cors/**`, `src/infrastructure/api/config/**` · Src: [25], [4]
- **[STACK-12] Payload and request limits are explicit or documented** — Fastify 5 defaults `bodyLimit` to 1,048,576 bytes (1 MiB) and `requestTimeout`/`connectionTimeout` to `0` (no timeout); the application either sets explicit `bodyLimit`, `requestTimeout` or `handlerTimeout` values for an internet-facing API or records reliance on the defaults in the operations documentation.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/api/server/server.ts`, `docs/operations.md` · Src: [9], project: docs/operations.md
- **[STACK-13] Reply handling is adapter-correct** — `GlobalExceptionFilter` sends through `FastifyReply.status(...).send(...)` and only branches to `ServerResponse` for the non-Fastify test host; it never writes `reply.raw` without `reply.hijack()` and never relies on a return value after manually replying.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/app/filters/global-exception/**` · Src: [10], [11]

## 3. Mongoose 9 usage

- **[STACK-14] One root connection is created through the asynchronous root-connection mechanism** — The database module configures exactly one root ODM connection from validated configuration, and no feature module creates a second root connection; the current factory shape lives in `Look`.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/infrastructure/database/**`, `src/app/app.module.ts` · Src: [5], project: docs/architecture.md §4.6
- **[STACK-15] Feature schemas are registered only by persistence modules** — `MongooseModule.forFeature` appears only in `<context>-persistence.module.ts`, registers the compiled schema under `Schema.name`, and the collection name comes from the published persistence contract rather than a literal in the module.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `src/contexts/*/infrastructure/persistence/*-persistence.module.ts`, `src/contexts/*/infrastructure/persistence/mongoose/schemas/**` · Src: [5], [13], project: docs/architecture.md §6.2
- **[STACK-16] The connection lifecycle is bounded and observable** — Connection attempts set both `serverSelectionTimeoutMS` and `connectTimeoutMS`, retries are bounded by `retryAttempts` and `retryDelay`, and `connected`/`disconnected` events are logged through the Nest logger so a lost database is visible.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/database/**` · Src: [5], [12]
- **[STACK-17] No removed or deprecated Mongoose options or signatures** — The codebase uses none of the removed connection options `useNewUrlParser`, `useUnifiedTopology`, `useCreateIndex` or `useFindAndModify`, none of the deprecated query options `new`, `returnOriginal`, `background` or `skipOriginalStackTraces`, and an update pipeline passed to `updateOne`, `updateMany` or `findOneAndUpdate` sets `updatePipeline: true` because Mongoose 9 rejects pipelines by default.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/**/*.ts` · Src: [12]
- **[STACK-18] Mongoose 9 typings are used** — Filters use `QueryFilter`, not the renamed `FilterQuery`; document `id` is treated as a string rather than `any`; and `create()`/`insertOne()` receive `Partial<RawDocType>`-compatible values without the removed generic parameter.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `src/**/*.ts` · Src: [12]

## 4. Zod 4 and nestjs-zod

- **[STACK-19] `ZodValidationPipe` is registered globally** — `AppModule` provides `{ provide: APP_PIPE, useClass: ZodValidationPipe }`, so every `@Body()`, `@Query()` and `@Param()` DTO wrapper is parsed before the handler runs; no controller re-declares the pipe and no raw object reaches a use case unvalidated.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/app/app.module.ts`, `src/contexts/*/infrastructure/http/controllers/**` · Src: [6], [17]
- **[STACK-20] The nestjs-zod integration uses supported APIs** — DTOs are created with `createZodDto`, responses use `@ZodResponse` (or `@ZodSerializerDto`), `ZodSerializerInterceptor` is registered as an `APP_INTERCEPTOR` so response parsing actually runs, and the OpenAPI document is passed through `cleanupOpenApiDoc`; the deprecated `validate`, `ZodGuard`, `createZodGuard`, `zodV3ToOpenAPI` and `@nest-zod/z` APIs are absent.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `src/**/*.dto.ts`, `src/**/*.controller.ts`, `src/infrastructure/api/server/swagger/**` · Src: [17]
- **[STACK-21] Strict responses and permissive requests are deliberate** — Response shapes use `z.strictObject`, request shapes use non-strict `z.object` because the API performs permissive parsing and Zod strips unknown properties, public fields carry `.describe()` and `.meta({ example })`, and shared validators/nested shapes are reused instead of redefined.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `src/contexts/*/application/dto/**`, `src/contexts/*/contracts/dto/**`, `src/shared/application/dto/**` · Src: [14], project: docs/architecture.md §7.1
- **[STACK-22] Zod schemas are interpreted, not compiled at runtime** — No production code calls `z.compile()` or imports `zod/compile`; compilation uses `new Function`, is unavailable under a strict CSP, adds about 7 KB gzipped, and would make the DTO shapes published through `@goat-it/schemas` dependent on an application-only optimisation.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/**/*.ts`, `packages/schemas/src/**` · Src: [16], project: docs/architecture.md §11
- **[STACK-23] Zod 4 deprecations are avoided** — String formats use the top-level forms (`z.email()`, `z.uuid()`, `z.url()`, `z.iso.datetime()`…), enums use `z.enum()` rather than `z.nativeEnum()`, objects use `z.strictObject()`/`z.looseObject()` rather than `.strict()`/`.passthrough()`, composition uses `.extend()` rather than `.merge()`, errors use the `error` parameter instead of `message`, `ZodError` formatting uses `z.treeifyError()` rather than `.format()`/`.flatten()`, and `z.promise()` is absent.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/**/*.ts`, `packages/schemas/src/**` · Src: [15], [14]
- **[STACK-24] Coercion traps are avoided** — Boolean inputs carried as strings (environment variables, query parameters) use `z.stringbool()` or an explicit enum, never `z.coerce.boolean()` (which is `Boolean(input)`, so `"false"` becomes `true`); `z.coerce.number()` is never applied to a value that may be an empty string without a guard, because `""` silently coerces to `0`.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `src/infrastructure/api/config/schemas/env.schema.ts`, `src/contexts/*/application/dto/**` · Src: [14], [15]

## 5. Build and module system

- **[STACK-25] The package is ESM end to end** — `package.json` declares `"type": "module"` and `"main": "dist/main.js"`, production source has no `require`/`module.exports`, relative imports in emitted code end in `.js`, and the production start command runs `node dist/main`.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `package.json`, `src/**/*.ts` · Src: [24], project: AGENTS.md
- **[STACK-26] SWC emits Nest-compatible decorator metadata** — `configs/swc/swc.config.json` parses TypeScript with `decorators: true`, enables `transform.legacyDecorator` and `transform.decoratorMetadata`, keeps class names (`keepClassNames: true`), maps the path aliases through `jsc.paths` and emits ES modules (`module.type: "es6"`).
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `configs/swc/swc.config.json` · Src: [18], project: AGENTS.md
- **[STACK-27] `nest-cli` drives the SWC builder and the dev loader** — `configs/nest/nest-cli.config.json` selects `builder.type: "swc"` with `swcrcPath: "configs/swc/swc.config.json"`, enables `typeCheck`, deletes `outDir` on build, and starts the SWC output through `node --import tsx/esm` so decorators and ESM resolve in watch mode.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `configs/nest/nest-cli.config.json` · Src: [18], project: AGENTS.md
- **[STACK-28] `tsc-alias` appends ESM extensions after the build** — The build runs `nest build` through SWC and then `tsc-alias -p configs/typescript/tsconfig.app.json --resolve-full-paths`, which rewrites alias specifiers and appends `.js` so the emitted ESM imports resolve under Node without a loader.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `package.json`, `configs/typescript/tsconfig.app.json` · Src: [19], [24], project: AGENTS.md
- **[STACK-29] TypeScript configuration matches the ESM/SWC pipeline** — The project tsconfigs keep `strict: true` (plus `strictPropertyInitialization`, `noImplicitAny` and `noFallthroughCasesInSwitch`), use `module: "preserve"` with `moduleResolution: "bundler"`, target `ES2023`, and set no TypeScript 6 deprecated option such as `baseUrl`, `moduleResolution: "node"`, `target: "es5"`, `outFile`, or `module: "amd" | "umd" | "systemjs"`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `configs/typescript/tsconfig.app.json`, `configs/typescript/tsconfig.spec.json`, `tsconfig.json` · Src: [20], [22]
- **[STACK-30] `tsgo` is the typecheck gate** — `pnpm run typecheck` runs `tsgo -b --clean && tsgo -b --noEmit` from `@typescript/native-preview`; it type-checks the SWC output contract without emitting, stays separate from `nest build`, and is a documented quality gate rather than an optional editor feature.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `package.json`, `configs/typescript/tsconfig.app.json` · Src: [21], project: AGENTS.md
- **[STACK-31] The built output resolves every alias at runtime** — A production build leaves no `@src/*`, `@app/*`, `@shared/*`, `@question/*` or `@question-theme/*` specifier in `dist/` and every relative import in emitted files ends with `.js`, so `node dist/main` starts without `MODULE_NOT_FOUND` or `ERR_MODULE_NOT_FOUND`.
  Evidence: `artifact` · Diff: ✗ · Severity: high · Src: [19], [24], project: AGENTS.md

## 6. Observability stack

- **[STACK-32] `nestjs-pino` bootstraps buffered application logs** — The app is created with `{ bufferLogs: true }`, `LoggerModule.forRoot(getLoggerConfiguration())` is registered once, and `app.useLogger(app.get(Logger))` installs the pino-backed Nest logger after the container is created.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `src/app/app.module.ts`, `src/app/helpers/logger.helpers.ts`, `src/infrastructure/api/server/server.ts` · Src: [23]
- **[STACK-33] Production logging is structured and transport-free** — `pino-pretty` is configured only when `NODE_ENV !== "production"`, production writes JSON to stdout without a worker-thread transport, and request/response logs come from `pino-http` rather than hand-written `console` calls.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/app/helpers/logger.helpers.ts` · Src: [23]
- **[STACK-34] Health checks cover the database and the documentation endpoint** — `TerminusModule` is imported, `HealthCheckService` runs both `MongooseHealthIndicator.pingCheck(...)` and `HttpHealthIndicator.pingCheck(...)`, and an unavailable dependency surfaces as `503 Service Unavailable` through the health controller.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `src/infrastructure/api/health/**` · Src: [8]
- **[STACK-35] Swagger is generated from the same DTO shapes** — The OpenAPI document is built with `DocumentBuilder`, `SwaggerModule.createDocument`, `cleanupOpenApiDoc` and `SwaggerModule.setup`, the documentation path/title come from constants, and documented response types are the `nestjs-zod` wrappers rather than hand-maintained schemas.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/api/server/swagger/**` · Src: [7], [17]
- **[STACK-36] Shutdown closes the server and flushes logs** — `app.enableShutdownHooks()` is called at bootstrap; if an asynchronous pino destination or transport is configured, shutdown exits through `enableShutdownHooks(undefined, { useProcessExit: true })` so buffered logs are not lost on `SIGTERM`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/api/server/server.ts`, `src/app/helpers/logger.helpers.ts` · Src: [3], [23]

## 7. Node and pnpm runtime alignment

- **[STACK-37] Node and pnpm versions agree everywhere** — `package.json` `engines.node`, `configs/node/.node-version`, the `Dockerfile` base image and `packageManager` declare one Node/pnpm pair, and CI installs from those same sources; the current pair is recorded in `(verified: node 26.13.0; pnpm 12.16.1)`.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `package.json`, `configs/node/.node-version`, `Dockerfile` · Src: project: AGENTS.md, project: package.json
- **[STACK-38] The declared Node major satisfies every dependency minimum** — The `engines.node` major is at least every production dependency's engine minimum (Fastify 5, Mongoose 9, `nestjs-pino` v5, NestJS 12, the native TypeScript preview), and no runtime API used by the application is newer than the declared engine; the current combination is recorded in `(verified: node 26; nestjs 12; fastify 5; mongoose 9; nestjs-pino 5)`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `package.json`, `configs/node/.node-version` · Src: [11], [12], [23], project: package.json

## 8. Framework-version hygiene

- **[STACK-39] `@nestjs/*` packages share one major** — `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-fastify`, `@nestjs/mongoose`, `@nestjs/config`, `@nestjs/swagger`, `@nestjs/terminus` and `@nestjs/axios` all resolve to the same 12.x major, and the Fastify adapter version matches `@nestjs/core` rather than a stale peer.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `package.json` · Src: [1], [4]
- **[STACK-40] No deprecated framework API or startup warning remains** — A build, a `pnpm run start:dev` boot and an acceptance run print no deprecation warning or diagnostic from NestJS, Fastify 5, Mongoose 9, Zod 4, `nestjs-zod`, `nestjs-pino` or SWC; every warning is fixed or recorded as a decision.
  Evidence: `command` · Diff: ✗ · Severity: medium · Src: [3], [11], [12], [17], [18]

## Sources

[1] NestJS — Modules: https://docs.nestjs.com/modules (fetched 2026-11-04)
[2] NestJS — Custom providers: https://docs.nestjs.com/fundamentals/custom-providers (fetched 2026-11-04)
[3] NestJS — Lifecycle events: https://docs.nestjs.com/fundamentals/lifecycle-events (fetched 2026-11-04)
[4] NestJS — Fastify adapter (performance): https://docs.nestjs.com/techniques/performance (fetched 2026-11-04)
[5] NestJS — MongoDB: https://docs.nestjs.com/techniques/mongodb (fetched 2026-11-04)
[6] NestJS — Validation: https://docs.nestjs.com/techniques/validation (fetched 2026-11-04)
[7] NestJS — OpenAPI: https://docs.nestjs.com/openapi/introduction (fetched 2026-11-04)
[8] NestJS — Terminus health checks: https://docs.nestjs.com/recipes/terminus (fetched 2026-11-04)
[9] Fastify — Server reference (`bodyLimit`, `requestTimeout`): https://fastify.dev/docs/latest/Reference/Server/ (fetched 2026-11-04)
[10] Fastify — Reply reference: https://fastify.dev/docs/latest/Reference/Reply/ (fetched 2026-11-04)
[11] Fastify — V5 migration guide: https://fastify.dev/docs/latest/Guides/Migration-Guide-V5/ (fetched 2026-11-04)
[12] Mongoose — Migrating from 8.x to 9.x: https://mongoosejs.com/docs/migrating_to_9.html (fetched 2026-11-04)
[13] Mongoose — Schemas guide: https://mongoosejs.com/docs/guide.html (fetched 2026-11-04)
[14] Zod — Defining schemas: https://zod.dev/api (fetched 2026-11-04)
[15] Zod — v4 migration guide: https://zod.dev/v4/changelog (fetched 2026-11-04)
[16] Zod — AOT compilation (`z.compile`): https://zod.dev/compile (fetched 2026-11-04)
[17] nestjs-zod — README: https://github.com/BenLorantfy/nestjs-zod (fetched 2026-11-04)
[18] SWC — Compilation configuration: https://swc.rs/docs/configuration/compilation (fetched 2026-11-04)
[19] tsc-alias — README: https://github.com/justkey007/tsc-alias (fetched 2026-11-04)
[20] TypeScript blog — Announcing TypeScript 6.0: https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/ (fetched 2026-11-04)
[21] TypeScript native preview (`typescript-go`, `tsgo`): https://github.com/microsoft/typescript-go (fetched 2026-11-04)
[22] TypeScript — TSConfig reference: https://www.typescriptlang.org/tsconfig/ (fetched 2026-11-04)
[23] nestjs-pino — README: https://github.com/iamolegga/nestjs-pino (fetched 2026-11-04)
[24] Node.js — Packages (`type`, `exports`, ESM): https://nodejs.org/api/packages.html (fetched 2026-11-04)
[25] NestJS — CORS: https://docs.nestjs.com/security/cors (fetched 2026-11-04)
