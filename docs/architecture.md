# Architecture and File-Placement Conventions

This guide is the canonical reference for **where a repository file belongs, how it is named, what may depend on it, and which companion files belong with it**.

It answers placement questions for every first-party file class in `goat-it-api` (NestJS 12 + Fastify 5 + Mongoose + Zod, ESM, hexagonal architecture). Detailed mechanics live in their own guides:

- [ci-cd.md](ci-cd.md) — branching, commits, hooks, pull requests, CI, deployment.
- [unit-tests.md](unit-tests.md) — Vitest unit-test conventions per file type.
- [acceptance-tests.md](acceptance-tests.md) — Cucumber, fixtures, payloads and step definitions.
- [faketories.md](faketories.md) — shared test-data factories.
- [mocks.md](mocks.md) — typed unit-test mock factories.
- [bruno.md](bruno.md) — Bruno API collection.

Those guides own their detailed procedures; this guide owns architecture, placement, naming and dependency direction.

## Table of Contents

- [1. File-placement decision tree](#1-file-placement-decision-tree)
- [2. Framework boundaries and dependency direction](#2-framework-boundaries-and-dependency-direction)
- [3. Layer responsibilities and unit ownership](#3-layer-responsibilities-and-unit-ownership)
- [4. Naming and companion rules](#4-naming-and-companion-rules)
- [5. Patterns](#5-patterns)
- [6. Aliases and imports](#6-aliases-and-imports)
- [7. Tests and test infrastructure](#7-tests-and-test-infrastructure)
- [8. Other repository file classes](#8-other-repository-file-classes)
- [9. Agent and workflow compliance](#9-agent-and-workflow-compliance)
- [10. Framework references](#10-framework-references)

## 1. File-placement decision tree

Apply the first matching rule.

1. **Is the file required by NestJS or the server bootstrap?** Use the framework entrypoint location: `src/main.ts`, `src/infrastructure/api/server/server.ts`, or a context root `<context>.module.ts`. Keep entrypoints thin; testable behavior belongs in an owned unit.
2. **Is it business behavior?** It belongs to a bounded context under `src/contexts/<context>/`. Pick the context that owns the aggregate, not the layer that consumes it.
3. **Is it cross-context infrastructure plumbing?** Auth, configuration, health, database and server bootstrap belong to `src/infrastructure/api/**` or `src/infrastructure/database/**`.
4. **Is it a reusable, context-free building block?** Put it in `src/shared/**`: domain helpers, value objects, rules, Zod validators, HTTP primitives, persistence helpers.
5. **Is it the application shell?** The root controller, app metadata DTO and app-level logging helpers belong to `src/app/**`.
6. **Is it a framework-agnostic contract published to other Goat It projects?** Define the source in `src/contexts/*` or `src/shared/*` and re-export it through the `packages/schemas` facade. The package never owns the source of truth.
7. **Which layer owns it inside the context?** `domain` (pure business), `application` (orchestration, DTOs, mappers) or `infrastructure` (HTTP and Mongoose adapters). See §3.
8. **Is it a test or test infrastructure?** Colocated `*.spec.ts` next to the source; shared faketories, mocks and helpers under `tests/`. See §7.
9. **Is it tooling, configuration or documentation?** `configs/`, `scripts/`, `docs/`, `env/`, `docker/`, `.github/`, `.opencode/` or `.agents/`. See §8.
10. **Nothing fits?** Stop and propose the new boundary through an approved design. Do not invent a new top-level folder or a `misc` bucket.

## 2. Framework boundaries and dependency direction

```text
src/
  main.ts                         # process entrypoint
  app/                            # application shell (root controller, metadata, logger)
  contexts/
    <context>/
      domain/                     # pure business types, rules, errors, repository ports
      application/                # use cases, DTOs, mappers
      infrastructure/             # HTTP controllers, Mongoose schemas and repositories
      <context>.module.ts         # NestJS wiring
  infrastructure/
    api/{auth,config,health,server}/
    database/
  shared/
    domain/
    application/
    infrastructure/
    types/
packages/schemas/                 # publishable facade re-exporting src/ and faketories
configs/                          # lint, test, build, release and tool configuration
scripts/                          # standalone repository tools
tests/{unit,shared,acceptance,mutation}/
docs/                             # maintained documentation
env/                              # environment files
docker/                           # acceptance-test containers
.github/                          # contribution docs, templates and workflows
.opencode/                        # OpenCode agents and commands
.agents/                          # agent skills
```

Normative import boundaries (the arrow means "may import"):

```text
domain  ←  application  ←  infrastructure
   ↑            ↑               ↑
   └────────────┴───────────────┴──→  shared
src/app  →  contexts, shared, infrastructure
src/infrastructure  →  shared
```

- **Domain** imports only domain code, `@shared/domain/*`, the generic utility types in `@shared/types/*`, and type-only utility types from `type-fest`. It must not import `application`, `infrastructure`, NestJS, Mongoose, Fastify or any runtime adapter.
- **Application** imports domain types and shared application/domain helpers. It may import the pure Zod validators under `@shared/infrastructure/http/zod/*`; those files contain schema helpers only and carry no HTTP runtime dependency.
- **Infrastructure** imports domain, application, shared, the cross-cutting `@src/infrastructure/*` adapters (auth decorators, Swagger constants) and framework packages. It must not import `@app/*`.
- **`src/app`** wires context modules and imports contexts, shared and `src/infrastructure` modules. It owns no business logic.
- **`src/infrastructure`** imports `@shared/*` only. It must not import contexts or `@app/*`, with one bootstrap exception: `src/infrastructure/api/server/server.ts` imports `AppModule` from `@app/app.module` to start the application.
- **`src/shared`** imports shared code only. It must not import `@app/*`, `@question/*` or `@question-theme/*` — with one documented exception: `src/shared/infrastructure/http/filters/global-exception/global-exception.filter.ts` imports context domain error classes because it is the single cross-context HTTP error composition point. Spec files may import contexts for test fixtures.
- **`packages/schemas`** is the publishing facade for `@goat-it/schemas`: its entrypoints re-export source from `src/contexts/*`, `src/shared/*` and faketories from `tests/shared/utils/faketories` through the aliases declared in `packages/schemas/tsconfig.json` and `packages/schemas/tsdown.config.ts`. The built `dist/` is standalone. It declares `zod` and `@faker-js/faker` as peer dependencies.
- **`configs/`** and **`scripts/`** are standalone. Scripts must not import application, context or shared aliases; configs are consumed by tools, not imported at runtime. Both may use relative imports to reach neighbouring files.
- **`tests/`** may import `src/` through the project aliases. Production code must never import `tests/`.

Cross-context dependencies are intentional:

- `question` imports `question-theme` DTO shapes, mappers, use cases, domain errors and the `QuestionTheme` entity type for theme assignment and validation.
- `question-theme` imports the `question` repository port, Mongoose schema, repository and active-status constant to count live questions and register the Mongoose model.
- A context's `domain` may import another context's domain **types** (for example `QuestionTheme` in `question.value-objects.ts`), but never its `application` or `infrastructure`.
- Context modules may import another context module (`QuestionModule` imports `QuestionThemeModule`). Where a port is consumed across contexts, prefer declaring it in the consumed context's module `exports` instead of re-registering the schema, repository and token.

## 3. Layer responsibilities and unit ownership

### 3.1 Domain (`src/contexts/<context>/domain/`)

Pure business model with no framework or persistence dependency.

| Directory       | Contents                                                                                                                                                                                     |
|-----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `types/`        | `<aggregate>.entities.ts` (entity type aliases), `<aggregate>.value-objects.ts`, `<aggregate>.commands.ts`, `<aggregate>.contracts.ts`, `<aggregate>.types.ts` (filters, sort fields, stats) |
| `constants/`    | `<aggregate>.constants.ts` — exported `UPPER_CASE` constants                                                                                                                                 |
| `rules/`        | `<aggregate>.rules.ts` — predicates, policies and pure helpers                                                                                                                               |
| `errors/`       | One subdirectory per error: `<error-name>/<error-name>.error.ts`                                                                                                                             |
| `repositories/` | `<aggregate>.repository.types.ts` (port type) and `<aggregate>.repository.constants.ts` (symbol token)                                                                                       |

Entities are **type aliases**, not classes: this repository models domain entities as `type Question = { ... }` in `domain/types/question.entities.ts`. Do not introduce `domain/entities/` or `domain/value-objects/` folders inside a context unless a future approved design changes that convention.

### 3.2 Application (`src/contexts/<context>/application/`)

Orchestrates domain behavior and adapts it to the outside world.

| Directory                      | Contents                                                                                                                             |
|--------------------------------|--------------------------------------------------------------------------------------------------------------------------------------|
| `use-cases/`                   | `<verb>-<aggregate>/<verb>-<aggregate>.use-case.ts`, or `<feature-group>/<verb>-<aggregate>/…` for grouped use cases                 |
| `dto/<feature>/`               | `<feature>.dto.shape.ts` (Zod schema + inferred type) and `<feature>.dto.ts` (nestjs-zod wrapper)                                    |
| `dto/<feature>/<sub-feature>/` | Nested shapes only when the parent shape composes them                                                                               |
| `dto/**/zod/`                  | Context-specific Zod validators and refinements                                                                                      |
| `mappers/`                     | Pure functions; the context-level `<aggregate>.mappers.ts` sits directly under `mappers/`, sub-mappers in `<unit>/<unit>.mappers.ts` |

Use cases receive repository ports through `@Inject(TOKEN)` and return domain entities or domain stats. They never import Mongoose, Fastify or controllers.

### 3.3 Infrastructure (`src/contexts/<context>/infrastructure/`)

Adapters that translate HTTP and MongoDB into domain calls.

| Directory                                              | Contents                                                                                                                                                |
|--------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| `http/controllers/<audience>-<aggregate>/`             | `<audience>-<aggregate>.controller.ts`; thin, decorated, maps DTOs to commands and entities to response DTOs                                            |
| `persistence/mongoose/schemas/`                        | `<aggregate>.mongoose.schema.ts` for the aggregate root; nested sub-schemas under `schemas/<name>/<name>.mongoose.schema.ts`                            |
| `persistence/mongoose/repository/`                     | `<aggregate>.mongoose.repository.ts` implementing the domain port                                                                                       |
| `persistence/mongoose/repository/pipelines/`           | `<aggregate>.mongoose.repository.pipeline.ts` for the root pipeline; grouped pipelines under `pipelines/<group>/<unit>.mongoose.repository.pipeline.ts` |
| `persistence/mongoose/repository/helpers/`             | Repository-private Mongoose helpers                                                                                                                     |
| `persistence/mongoose/mappers/`                        | `<aggregate>.mongoose.mappers.ts` (document ↔ entity)                                                                                                   |
| `persistence/mongoose/constants/`, `types/`, `errors/` | Persistence-private constants, types and infrastructure errors                                                                                          |

Use the plural `schemas/` directory.

### 3.4 Application shell (`src/app/`)

- `controllers/app.controller.ts` — root route.
- `dto/app-metadata/` — app metadata shape and wrapper.
- `helpers/logger.helpers.ts` — logger configuration.
- `providers/services/app.service.ts` — shell service.
- `types/app.types.ts` — shell types.
- `app.module.ts` — imports every context and infrastructure module; applies the global validation pipe, logger module and localization middleware.

### 3.5 Shared (`src/shared/`)

- `domain/`: `constants/`, `helpers/`, `rules/`, `types/`, `value-objects/`.
- `types/`: generic TypeScript utility types (`enum.types.ts`, `tuple.types.ts`) consumed by domain code across contexts.
- `application/`: `dto/` (constants, preprocessors, refinements, validators), `mappers/` (find-all, localization, sort, stats).
- `infrastructure/http/`: controllers, decorators, DTOs, errors, filters, middlewares, pipes, types, Zod validators.
- `infrastructure/persistence/mongoose/`: constants, helpers, schemas, types.

Shared code is imported by every layer. It must stay context-free, except the `GlobalExceptionFilter` composition point documented in §2 (spec files may import contexts for fixtures).

### 3.6 Cross-cutting infrastructure (`src/infrastructure/`)

- `api/auth/` — API-key guards, auth decorators, auth errors and helpers.
- `api/config/` — environment schema, config module, validators and services.
- `api/health/` — health controller, DTOs, mappers and service.
- `api/server/` — Fastify bootstrap, CORS, Swagger.
- `database/` — Mongoose connection module and service.

These adapters may import `@shared/*` and framework packages; they must not import context or app code, except `api/server/server.ts`, which imports `AppModule` to bootstrap the application. Context controllers may import the cross-cutting auth decorators and Swagger constants from `@src/infrastructure/*`.

### 3.7 Schemas package (`packages/schemas/`)

The `@goat-it/schemas` workspace package is the publishable facade for shared DTO shapes, constants and value objects. Its entrypoints re-export code from `src/contexts/*`, `src/shared/*` and faketories from `tests/shared/utils/faketories` through the aliases declared in `packages/schemas/tsconfig.json` and `packages/schemas/tsdown.config.ts`; the built `dist/` is what consumers install.

- Re-export new shapes through `package.json` exports and `tsdown.config.ts` entries.
- Bump the **patch** version when an existing export changes.
- Ask the user before adding a new export (see [AGENTS.md](../AGENTS.md) DOD items 4 and 5).
- The package declares `zod` and `@faker-js/faker` as peer dependencies.
- `index.ts` files in the package are the only allowed barrel/re-export files; they define the published entrypoints.

## 4. Naming and companion rules

| Artifact             | Directory                                                                            | Filename                                                                                 | Required companions                                                                                        |
|----------------------|--------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------|
| Entity types         | `domain/types/`                                                                      | `<aggregate>.entities.ts`                                                                | —                                                                                                          |
| Value-object types   | `domain/types/`                                                                      | `<aggregate>.value-objects.ts`                                                           | —                                                                                                          |
| Commands             | `domain/types/`                                                                      | `<aggregate>.commands.ts`                                                                | —                                                                                                          |
| Contracts            | `domain/types/`                                                                      | `<aggregate>.contracts.ts`                                                               | —                                                                                                          |
| Domain types         | `domain/types/`                                                                      | `<aggregate>.types.ts`                                                                   | —                                                                                                          |
| Domain constants     | `domain/constants/`                                                                  | `<aggregate>.constants.ts`                                                               | —                                                                                                          |
| Domain rules         | `domain/rules/`                                                                      | `<aggregate>.rules.ts`                                                                   | `<aggregate>.rules.spec.ts`                                                                                |
| Domain error         | `domain/errors/<error-name>/`                                                        | `<error-name>.error.ts`                                                                  | `<error-name>.error.spec.ts`, `GlobalExceptionFilter` mapping only when a specific HTTP status is required |
| Repository port      | `domain/repositories/`                                                               | `<aggregate>.repository.types.ts`                                                        | `<aggregate>.repository.constants.ts` token                                                                |
| Use case             | `application/use-cases/<verb>-<aggregate>/` or `<feature-group>/<verb>-<aggregate>/` | `<verb>-<aggregate>.use-case.ts`                                                         | `.spec.ts`, module provider                                                                                |
| DTO shape            | `application/dto/<feature>/`                                                         | `<feature>.dto.shape.ts`                                                                 | `<feature>.dto.shape.spec.ts`                                                                              |
| DTO wrapper          | `application/dto/<feature>/`                                                         | `<feature>.dto.ts`                                                                       | Required only when NestJS binds the DTO; nested shapes may stay shape-only                                 |
| Mapper               | `application/mappers/`                                                               | `<aggregate>.mappers.ts` at the root, `<unit>.mappers.ts` in `<unit>/`                   | `<unit>.mappers.spec.ts`                                                                                   |
| Controller           | `infrastructure/http/controllers/<audience>-<aggregate>/`                            | `<audience>-<aggregate>.controller.ts`                                                   | `.spec.ts`, module controller registration                                                                 |
| Mongoose schema      | `infrastructure/persistence/mongoose/schemas/` or `schemas/<name>/`                  | `<aggregate>.mongoose.schema.ts` / `<name>.mongoose.schema.ts`                           | — (excluded from coverage)                                                                                 |
| Mongoose repository  | `infrastructure/persistence/mongoose/repository/`                                    | `<aggregate>.mongoose.repository.ts`                                                     | `.spec.ts`, module provider                                                                                |
| Mongoose mapper      | `infrastructure/persistence/mongoose/mappers/`                                       | `<aggregate>.mongoose.mappers.ts`                                                        | `.spec.ts`                                                                                                 |
| Mongoose pipeline    | `infrastructure/persistence/mongoose/repository/pipelines/` or `pipelines/<group>/`  | `<aggregate>.mongoose.repository.pipeline.ts` / `<unit>.mongoose.repository.pipeline.ts` | — (excluded from coverage)                                                                                 |
| Mongoose helper      | `infrastructure/persistence/mongoose/repository/helpers/`                            | `<unit>.mongoose.helpers.ts`                                                             | `.spec.ts`                                                                                                 |
| Context module       | `src/contexts/<context>/`                                                            | `<context>.module.ts`                                                                    | — (excluded from coverage)                                                                                 |
| Shared helper        | `src/shared/domain/helpers/<unit>/`                                                  | `<unit>.helpers.ts`                                                                      | `.spec.ts`                                                                                                 |
| Shared mapper/helper | `src/shared/application/mappers/<unit>/`                                             | `<unit>.mappers.ts` or `<unit>.helpers.ts`                                               | `.spec.ts`                                                                                                 |
| Shared Zod validator | `src/shared/infrastructure/http/zod/validators/<kind>/`                              | `<kind>.zod.validators.ts`                                                               | `.spec.ts`, constants in `constants/`                                                                      |

Rules:

- Every independently understood production unit owns its file. When it has private sub-units or companions, it owns a directory containing the source and its colocated spec.
- One primary class per file. Functions and constants are declared first and exported at the end; DTO wrappers and Mongoose schemas declare their class then export it in an `export {}` block. Grouped infrastructure error files (for example `auth.errors.ts`) may contain closely related error classes.
- Files and directories are `kebab-case`; classes and types are `PascalCase`; functions and properties are `camelCase`; exported constants are `UPPER_CASE`.
- No default exports, barrel files, re-export-only files, or relative `./` / `../` imports **in `src/`, `tests/` and `packages/schemas/src/`**. Import the canonical module directly through an alias. `configs/` and `scripts/` may use relative imports to reach neighbouring files; `packages/schemas` entrypoints are the only allowed barrels.
- Do not create empty or ceremonial companions. Add `<unit>.types.ts` or `<unit>.constants.ts` only when the unit owns a private contract or constant.
- Owner-private types and constants stay beside their owner. Promote them to the context root only when multiple production units consume them. There is no context-wide `misc` bucket.
- Context and domain directory names are never pluralized (`question-theme/`, not `question-themes/`), even when the exported symbols name a collection (`QuestionTheme[]`).
- `ControllerPrefixes` remains the single enum exception, consumed for route string building.
- Test files use `<source-basename>.spec.ts` and live next to their source.

## 5. Patterns

### 5.1 Data flow

```text
Client → Controller → Zod DTO validation → domain command/options
       → Use case → repository port (symbol token) → Mongoose adapter
       → domain entity → mapper → response DTO → Client
```

Domain errors bubble up to `GlobalExceptionFilter`, which maps them to HTTP exceptions.

### 5.2 DTO shape + nestjs-zod wrapper

Every DTO bound to a controller follows the two-file pattern. Nested shapes that are only composed by a parent DTO may stay shape-only.

- `<feature>.dto.shape.ts` exports the Zod schema and its inferred type:

  ```ts
  const QUESTION_DTO = z.strictObject({
    id: zMongoId(),
    // ...
  });

  type QuestionDto = z.infer<typeof QUESTION_DTO>;

  export { QUESTION_DTO };
  export type { QuestionDto };
  ```

- `<feature>.dto.ts` wraps it for NestJS:

  ```ts
  class QuestionNestZodDto extends createZodDto(QUESTION_DTO) {}

  export { QuestionNestZodDto };
  ```

Response shapes use `z.strictObject`. Add `.describe()` and `.meta({ example })` to public fields. Reuse shared validators (`zMongoId`, `zIsoDateTime`, `zLimit`, `zLocalizedText`, `zLocalizedTexts`, …) and nested shapes instead of redefining fields. Request shapes that intentionally accept extra properties use a non-strict object and document that choice in the shape.

The wrapper class must remain a value import in controllers (`@Body()`, `@Query()`); `import type` breaks `ZodValidationPipe`.

### 5.3 Domain errors and `GlobalExceptionFilter`

- One error class per subdirectory: `domain/errors/<error-name>/<error-name>.error.ts`.
- The class extends `Error`, sets `this.name` in its constructor and carries structured context.
- Register every domain error that must produce a specific HTTP status in `GlobalExceptionFilter.domainErrorHttpExceptionFactories` at `src/shared/infrastructure/http/filters/global-exception/global-exception.filter.ts`. Errors intentionally left unmapped fall through to a 500 response. The filter derives the error code from the class name.

### 5.4 Domain rules

All business logic for an aggregate lives in `domain/rules/<aggregate>.rules.ts`:

- **Predicates** (`is*`, `has*`, `can*`): pure boolean functions.
- **Policies** (`ensure*`): enforce a rule and throw the matching domain error.
- **Helpers**: descriptive pure transformation or computation functions.

```ts
function isQuestionThemeArchived(status: QuestionThemeStatus): boolean {
  return status === "archived";
}

function ensureQuestionThemeIsNotArchivedForCreation(theme: QuestionTheme): void {
  if (isQuestionThemeArchived(theme.status)) {
    throw new QuestionThemeArchivedError(theme.id);
  }
}
```

Compose policies from predicates and test every branch.

### 5.5 Repository port, token and Mongoose adapter

- Port type: `domain/repositories/<aggregate>.repository.types.ts`.
- Injection token: `domain/repositories/<aggregate>.repository.constants.ts`:

  ```ts
  const QUESTION_REPOSITORY_TOKEN = Symbol("QuestionRepository");

  export { QUESTION_REPOSITORY_TOKEN };
  ```

- Adapter: `infrastructure/persistence/mongoose/repository/<aggregate>.mongoose.repository.ts`.
- Use cases inject the port: `@Inject(QUESTION_REPOSITORY_TOKEN) private readonly questionRepository: QuestionRepository`.
- The module registers `{ provide: QUESTION_REPOSITORY_TOKEN, useClass: QuestionMongooseRepository }`.

Repository methods return domain entities (`Question | undefined`, `Question[]`, stats), never Mongoose documents or DTOs. Map documents through `mongoose/mappers/`.

### 5.6 Mappers

- Application mappers convert DTOs to commands/contracts and entities to response DTOs.
- Persistence mappers convert Mongoose documents to entities.
- Mappers are pure and deterministic. Map only allowed fields explicitly; centralize date/locale normalization in the mapper, not in controllers or repositories.

### 5.7 Module registration

Context modules (`<context>.module.ts`) register:

- `MongooseModule.forFeature([...])` for every schema the context owns.
- Controllers.
- Use cases as providers.
- Repository `{ provide: TOKEN, useClass: Adapter }` providers.
- Exports only the use cases or ports another context actually consumes.

`src/app/app.module.ts` imports every context module and every cross-cutting module. Per-context modules never import `AppModule`.

## 6. Aliases and imports

Path aliases are mandatory in `src/`, `tests/` and `packages/schemas/src/`; relative imports are forbidden there.

| Alias                    | Resolves to                                                                              |
|--------------------------|------------------------------------------------------------------------------------------|
| `@package-json`          | `package.json` (test-only; in `src/`, use `readPackageJson()` instead of importing JSON) |
| `@src/*`                 | `src/*`                                                                                  |
| `@app/*`                 | `src/app/*`                                                                              |
| `@shared/*`              | `src/shared/*`                                                                           |
| `@configs/*`             | `configs/*`                                                                              |
| `@question/*`            | `src/contexts/question/*`                                                                |
| `@question-theme/*`      | `src/contexts/question-theme/*`                                                          |
| `@unit-tests/*`          | `tests/unit/*`                                                                           |
| `@mocks/*`               | `tests/unit/utils/mocks/*`                                                               |
| `@faketories/*`          | `tests/shared/utils/faketories/*`                                                        |
| `@test-helpers/*`        | `tests/shared/utils/helpers/*`                                                           |
| `@acceptance-tests/*`    | `tests/acceptance/*`                                                                     |
| `@acceptance-features/*` | `tests/acceptance/features/*`                                                            |
| `@acceptance-support/*`  | `tests/acceptance/support/*`                                                             |

Import groups are separated by blank lines: (1) `node:*`, (2) external packages, (3) internal aliases, (4) test aliases, (5) `import type`.

When adding a new bounded context, register its alias in `configs/swc/swc.config.json`, `configs/typescript/tsconfig.app.json` and `configs/vitest/vitest.config.ts`.

DTO wrapper classes and injected classes must stay value imports. Use `import type` only for type-only symbols. The linters keep `consistent-type-imports` off for this reason.

## 7. Tests and test infrastructure

- Unit specs are colocated with their source as `<source-basename>.spec.ts`.
- Shared faketories live under `tests/shared/utils/faketories/` and use the `@faketories/*` alias.
- Mock factories live under `tests/unit/utils/mocks/` and use the `@mocks/*` alias.
- Acceptance features, step definitions, support, fixtures and payloads live under `tests/acceptance/`.
- Coverage is enforced at 100% (`pnpm run test:unit:cov`). Mutation testing runs through Stryker (`configs/stryker/`).
- Coverage excludes `*.module.ts`, `**/mongoose/**/*.schema.ts`, `*.constants.ts`, `*.types.ts`, `*.dto.ts`, `*.pipeline.ts`, `*.commands.ts`, `*.contracts.ts`, `*.entities.ts` and `*.value-objects.ts`. Mutation excludes the same set except `*.dto.ts` (which stays under mutation testing) and excludes every `*.schema.ts` file, including `src/infrastructure/api/config/types/env.schema.ts`.
- Writing guide per file type: [unit-tests.md](unit-tests.md).
- Acceptance guide: [acceptance-tests.md](acceptance-tests.md).
- Faketories: [faketories.md](faketories.md). Mocks: [mocks.md](mocks.md).

## 8. Other repository file classes

| Location                                 | Responsibility                                                                                                                                                                                                         |
|------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `configs/`                               | ESLint, Vitest, Stryker, Cucumber, SWC, TypeScript, Nest, Node, lint-staged, commitlint, semantic-release, Bruno and branch-name configuration (the Oxlint config lives at the repository root, `oxlint.config.jsonc`) |
| `scripts/`                               | Standalone maintenance and validation scripts (`check-eslint-rules`, `check-oxlint-rules`, branch/PR/release helpers)                                                                                                  |
| `docs/`                                  | Maintained documentation, including this guide and the agent workflow artifacts under `docs/superpowers/`                                                                                                              |
| `configs/bruno/`                         | Bruno API collection (`configs/bruno/Goat It/`)                                                                                                                                                                        |
| `env/`                                   | `.env.example` and `.env.test` (tracked); `.env` is local-only and git-ignored                                                                                                                                         |
| `docker/`                                | Acceptance-test Docker Compose configuration                                                                                                                                                                           |
| `Dockerfile`, `.dockerignore`            | Production image build                                                                                                                                                                                                 |
| `.github/`                               | Contribution docs, PR template, Copilot instructions, Renovate config and workflows                                                                                                                                    |
| `.opencode/`                             | OpenCode agents and slash commands                                                                                                                                                                                     |
| `.agents/`                               | Agent skills                                                                                                                                                                                                           |
| `packages/schemas/`                      | Publishable `@goat-it/schemas` facade re-exporting `src/` and faketories                                                                                                                                               |
| `public/`                                | Static assets served by the app                                                                                                                                                                                        |
| `tests/mutation/`                        | Committed Stryker incremental state; coverage output is generated                                                                                                                                                      |
| `dist/`, coverage and report directories | Generated output only; never hand-edited as source                                                                                                                                                                     |

## 9. Agent and workflow compliance

This document is canonical. Do not copy its full contents into every prompt.

- Every agent, skill or command that can create, edit, move or delete repository files must read `docs/architecture.md` before that work. The read-only `docs-fetcher` agent and the `context7` skill are intentionally exempt: they cannot modify repository files.
- Design and spec authors identify placement boundaries and migration consequences.
- The plan-writer names exact paths for sources, specs, types, constants and helpers; records which companions are required or intentionally omitted; and accounts for consumers, imports, module registration and test routing.
- Implementers follow the planned paths. If repository reality conflicts with this guide or the plan, stop and surface the mismatch instead of inventing a rule.
- Debugger, investigator, review-fix, gatekeeper, test-writing, translation and config-edit workflows consult this guide before file edits.
- The final reviewer checks every created, edited or moved file for owner directory, source/spec pairing, type/constant scope, alias, layer dependency, module registration and test correctness.
- Specialist testing guides remain authoritative for their detailed procedures and are linked rather than duplicated.
- This guide does not add lint or test enforcement by itself. No agent commits; the user is the only one who runs `git add`, `git commit` and `git push`.

## 10. Framework references

- [NestJS modules](https://docs.nestjs.com/modules), [providers](https://docs.nestjs.com/providers), [controllers](https://docs.nestjs.com/controllers) and [custom providers](https://docs.nestjs.com/fundamentals/custom-providers).
- [Fastify](https://fastify.dev/docs/latest/) and the NestJS Fastify adapter.
- [Mongoose schemas](https://mongoosejs.com/docs/guide.html) and [NestJS MongoDB integration](https://docs.nestjs.com/techniques/mongodb).
- [Zod](https://zod.dev/) and [nestjs-zod](https://github.com/BenLorantfy/nestjs-zod).
- [Vitest](https://vitest.dev/) and [StrykerJS](https://stryker-mutator.io/).
- [Cucumber.js](https://github.com/cucumber/cucumber-js).
