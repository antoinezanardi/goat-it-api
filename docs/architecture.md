# Architecture and File-Placement Conventions

This guide is the canonical reference for **where a repository file belongs, how it is named, what may depend on it, and which companion files belong with it**.

It answers placement questions for every first-party file class in `goat-it-api` (NestJS 12 + Fastify 5 + Mongoose + Zod, ESM, hexagonal architecture). Detailed mechanics live in their own guides:

- [ci-cd.md](ci-cd.md) — branching, commits, hooks, pull requests, CI, deployment.
- [unit-tests.md](unit-tests.md) — Vitest unit-test conventions per file type.
- [acceptance-tests.md](acceptance-tests.md) — Cucumber, fixtures, payloads and step definitions.
- [faketories.md](faketories.md) — shared test-data factories.
- [mocks.md](mocks.md) — typed unit-test mock factories.
- [bruno.md](bruno.md) — Bruno API collection.
- [packages/schemas/README.md](../packages/schemas/README.md) — `@goat-it/schemas` entrypoints and usage.

Those guides own their detailed procedures; this guide owns architecture, placement, naming, dependency direction and enforcement.

## Table of Contents

- [1. Purpose and vocabulary](#1-purpose-and-vocabulary)
- [2. Top-level map](#2-top-level-map)
- [3. Dependency rules](#3-dependency-rules)
- [4. Layer rules](#4-layer-rules)
- [5. Cross-context collaboration](#5-cross-context-collaboration)
- [6. Composition root and modules](#6-composition-root-and-modules)
- [7. DTOs, validation and errors](#7-dtos-validation-and-errors)
- [8. Naming and placement](#8-naming-and-placement)
- [9. Aliases and imports](#9-aliases-and-imports)
- [10. Tests](#10-tests)
- [11. Published package](#11-published-package)
- [12. Enforcement](#12-enforcement)
- [13. Accepted exceptions](#13-accepted-exceptions)
- [14. Framework references](#14-framework-references)

## 1. Purpose and vocabulary

Apply this guide before creating, editing, moving or deleting a first-party file. If a rule and a plan disagree, stop and surface the mismatch instead of inventing a rule.

Normative keywords: **MUST**, **MUST NOT**, **SHOULD**, **MAY**.

Agents MUST read this guide before creating, editing, moving or deleting a repository file. Plans name exact paths and companions; implementers stop and surface a mismatch instead of inventing a rule; reviewers check placement, companions, aliases, layer dependencies and module registration.

This guide describes the **target** architecture. The #1264 migration is complete; any remaining accepted exception is listed in §13. Do not copy a pre-existing violation as a precedent.

| Term | Meaning |
|---|---|
| **Area** | One of `src/app`, `src/contexts`, `src/infrastructure`, `src/shared`, `packages/schemas`, `tests`, `configs`, `scripts`. |
| **Bounded context** | A business boundary under `src/contexts/<context>/`, with `domain`, `application`, `infrastructure` and an optional `contracts` facade. |
| **Layer** | `domain`, `application` or `infrastructure` inside a context, or the matching `shared` layer. |
| **Port** | A domain interface and its symbol token under `domain/repositories/`. |
| **Adapter** | An infrastructure implementation of a port. |
| **Repository contract** | A domain type describing input to a repository port, in `domain/repositories/<aggregate>.repository-contracts.types.ts`. |
| **Published contract** | A pure cross-context type, DTO shape, mapper, validator or persistence constant, in `contracts/`. |
| **Helper-local type** | A type used by a single implementation file, colocated as `<source-basename>.types.ts`. |
| **Command** | An application-layer message consumed by a use case. |
| **Entity** | A domain type alias with identity, modelled in `domain/types/<aggregate>.entities.ts`. |
| **Value object** | A behaviour-bearing immutable concept. Simple unions stay type aliases. |
| **DTO shape** | A pure Zod schema and its inferred type, in `application/dto/`. |
| **DTO wrapper** | A `createZodDto` class used by NestJS, in `infrastructure/http/dto/`. |
| **Published surface** | The explicit set of use cases, domain types/constants/rules/errors and `contracts/` a context exposes to other contexts. |
| **Shared kernel** | The layered, context-free `src/shared` area. |
| **Composition root** | `src/main.ts`, the only file that imports `AppModule`. |
| **Persistence module** | A module that owns a context's schema, repository and token. |
| **Usage module** | A module that exports a published use case another context consumes. |

## 2. Top-level map

### 2.1 Top-level tree and responsibilities

```text
src/
  main.ts                         # process entrypoint and composition root
  app/                            # application shell (root controller, metadata, logger)
  contexts/
    <context>/
      domain/                     # pure business types, rules, errors, repository ports
        types/                    # entities, value objects, aggregate types
        repositories/             # ports, tokens, repository contracts
      application/                # commands, use cases, DTO shapes, mappers, helpers
      infrastructure/             # HTTP controllers, DTO wrappers, Mongoose adapters, persistence/<context>-persistence.module.ts
      contracts/                  # optional published DTO shapes, mappers, validators, persistence contracts
        persistence/              # published constants, types and mappers
      <context>.module.ts         # NestJS feature wiring
      <context>-usage.module.ts   # optional published use case wiring
  infrastructure/
    api/{auth,config,health,server}/
    database/
  shared/
    domain/
    application/
    infrastructure/
    types/
packages/schemas/                 # publishable facade re-exporting pure DTO shapes and faketories
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

| Area | Responsibility |
|---|---|
| `src/contexts/<context>/domain` | Pure business types, rules, errors, repository ports and repository contracts. No framework, I/O, randomness or Zod. |
| `src/contexts/<context>/application` | Commands, use cases, DTO shapes, mappers, helpers. No `@nestjs/*`, Mongoose, Fastify or `nestjs-zod`. |
| `src/contexts/<context>/infrastructure` | HTTP controllers, DTO wrappers, Mongoose schemas/repositories, persistence mappers and pipelines. |
| `src/contexts/<context>/contracts` | Published cross-context DTO shapes, pure mappers, validators and persistence contracts (constants, types, mappers). A facade, not a layer. |
| `src/shared` | Shared kernel with layer subfolders plus type-only `types`. |
| `src/app` | Application shell and composition root. Owns no business logic; wires cross-context concerns such as the global HTTP exception filter. |
| `src/infrastructure` | Cross-cutting adapters: auth, config, health, server bootstrap, database. |
| `packages/schemas` | Publishable facade over pure contracts and faketories. |
| `tests` | Unit, shared utilities, acceptance and mutation state. |
| `configs`, `scripts` | Standalone tooling. |

Context and domain directory names are **singular** (`question-theme/`, not `question-themes/`). Do not invent a new top-level folder or a `misc` bucket; propose the boundary through an approved design.

### 2.2 Placement decision tree

Apply the first matching rule:

1. **Framework entrypoint?** `src/main.ts`, `src/infrastructure/api/server/server.ts`, `<context>.module.ts` or `<context>-usage.module.ts`. Keep entrypoints thin; testable behaviour belongs to an owned unit.
2. **Business behaviour?** `src/contexts/<context>/`, then pick the layer: domain, application or infrastructure. Pick the context that owns the aggregate, not the layer that consumes it.
3. **Cross-context published contract?** `<context>/contracts/` when another context actually consumes it.
4. **Cross-cutting infrastructure plumbing?** `src/infrastructure/api/**` or `src/infrastructure/database/**`.
5. **Reusable, context-free building block?** `src/shared/**`, following the shared-kernel layer rules and the two-context promotion rule.
6. **Application shell?** `src/app/**` — root controller, app metadata, logger, shell service, global HTTP exception filter.
7. **Test or test infrastructure?** Colocated `*.spec.ts`; shared faketories, mocks and helpers under `tests/`.
8. **Tooling, configuration or documentation?** `configs/`, `scripts/`, `docs/`, `env/`, `docker/`, `.github/`, `.opencode/` or `.agents/`.
9. **Nothing fits?** Stop and propose the new boundary through an approved design. Do not invent a new top-level folder or a `misc` bucket.

### 2.3 Repository file classes

| Location | Responsibility |
|---|---|
| `configs/` | ESLint, Vitest, Stryker, Cucumber, SWC, TypeScript, Nest, Node, lint-staged, commitlint, semantic-release, Bruno and branch-name configuration (the Oxlint config lives at the repository root, `oxlint.config.jsonc`) |
| `scripts/` | Standalone maintenance and validation scripts (`check-eslint-rules`, `check-oxlint-rules`, branch/PR/release helpers) |
| `docs/` | Maintained documentation, including this guide and the local (git-ignored) agent workflow artifacts under `docs/superpowers/` |
| `configs/bruno/` | Bruno API collection (`configs/bruno/Goat It/`) |
| `env/` | `.env.example` and `.env.test` (tracked); `.env` is local-only and git-ignored |
| `docker/` | Acceptance-test Docker Compose configuration |
| `Dockerfile`, `.dockerignore` | Production image build |
| `.github/` | Contribution docs, PR template, Copilot instructions, Renovate config and workflows |
| `.opencode/` | OpenCode agents and slash commands |
| `.agents/` | Agent skills |
| `packages/schemas/` | Publishable `@goat-it/schemas` facade re-exporting pure DTO shapes and faketories |
| `public/` | Static assets served by the app |
| `tests/mutation/` | Committed Stryker incremental state; coverage output is generated |
| `dist/`, coverage and report directories | Generated output only; never hand-edited as source |

## 3. Dependency rules

### 3.1 Target graph

```text
context domain      <- context application <- context infrastructure
shared/domain       <- shared/application  <- shared/infrastructure
src/app             -> contexts, shared, src/infrastructure
src/infrastructure  -> shared
other contexts      -> provider/contracts + published use cases + published domain types/constants/rules/errors
tests               -> src (through aliases)
configs/, scripts/  -> standalone
```

### 3.2 Allowed imports

| From | May import |
|---|---|
| context domain | own domain, another context's **published domain types/constants/pure rules/errors**, `shared/domain`, `shared/types`, type-only `type-fest` |
| context application | own domain, own application, own `contracts/`, another context's **published use cases and published surface**, `shared/domain`, `shared/application`, `shared/types`, `zod`, type-only `type-fest` |
| context infrastructure | own domain/application/infrastructure, own `contracts/`, another context's **published contracts and domain types** (never its application use cases or infrastructure), all shared layers, framework packages, cross-cutting `@src/infrastructure/*` |
| `contracts/` | own domain, `shared/domain`, `shared/application` (pure), `zod`, type-only `type-fest`. Never own application or infrastructure. |
| `shared/domain` | `shared/domain`, `shared/types`, type-only `type-fest` |
| `shared/application` | `shared/domain`, `shared/application`, `shared/types`, `zod`, type-only `type-fest` |
| `shared/infrastructure` | all shared layers, framework packages, plus the documented localization `AppConfigService` exception in §13 |
| `src/app` | contexts, all shared layers, `src/infrastructure` |
| `src/infrastructure` | all shared layers, framework packages |
| `tests` | `src` through aliases |
| `packages/schemas` | pure DTO shapes (application or contracts), constants, value objects, pure helpers and faketories from `tests/shared/utils/faketories` |

Type-only `type-fest` utilities are allowed in any pure layer. `shared/types` is type-only and usable by any layer.

Published domain types are **read-only snapshots**. A context MUST NOT mutate or persist another context's entity. If it needs only a subset, define a local read model and map the published type into it. Do not import the full entity by default.

### 3.3 Forbidden imports

- context domain → application, infrastructure, `contracts/`, `shared/application`, `shared/infrastructure`, `@nestjs/*`, `mongoose`, `fastify`, `nestjs-zod`, `node:*`;
- context application → infrastructure, `@nestjs/*`, `mongoose`, `fastify`, `nestjs-zod`;
- context `contracts/` → own or another context's application/infrastructure, `shared/infrastructure`;
- shared → contexts, `src/app`;
- `src/infrastructure` → contexts, `src/app`;
- production `src` → `tests`;
- another context's infrastructure, internal mappers, internal DTOs or Mongoose schemas;
- relative `./` / `../` imports in `src/`, `tests/` and `packages/schemas/src/`;
- default exports, barrel files or re-export-only files, except `packages/schemas` entrypoints.

### 3.4 Domain purity

Domain code MUST be pure and deterministic. It MUST NOT use `node:fs`, `node:crypto`, `process.cwd()`, clock, network or environment access. I/O and randomness belong to infrastructure. A domain operation that needs either receives a port or a pure function parameter.

## 4. Layer rules

### 4.1 Domain (`src/contexts/<context>/domain/`)

| Directory | Contents |
|---|---|
| `types/` | `<aggregate>.entities.ts`, `<aggregate>.value-objects.ts`, `<aggregate>.types.ts` (filters, sort fields, stats) |
| `constants/` | `<aggregate>.constants.ts` — exported `UPPER_CASE` constants |
| `rules/` | `<aggregate>.rules.ts` — predicates, policies and pure helpers |
| `errors/` | One subdirectory per error: `<error-name>/<error-name>.error.ts` |
| `repositories/` | `<aggregate>.repository.types.ts` (port), `<aggregate>.repository.constants.ts` (symbol token), `<aggregate>.repository-contracts.types.ts` (repository contracts) |

- Entities are **type aliases**, not classes. Invariants live in `ensure*` policies.
- Repository contracts live next to the port in `domain/repositories/<aggregate>.repository-contracts.types.ts`.
- Value objects: use `domain/types/<aggregate>.value-objects.ts` for simple unions and structural types. Promote to `domain/value-objects/<vo>/` only when the concept owns invariants, parsing, behaviour, multiple representations, or is shared across contexts.
- Do not mix class-based entities with type-alias entities.
- Repository ports return domain entities or domain stats, never Mongoose documents or DTOs.
- Domain MUST NOT import Zod. Validation happens at the boundary; domain policies enforce invariants.

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

### 4.2 Application (`src/contexts/<context>/application/`)

| Directory | Contents |
|---|---|
| `commands/` | `<aggregate>.commands.ts` — use-case input messages |
| `use-cases/` | `<verb>-<aggregate>/<verb>-<aggregate>.use-case.ts` at the folder root, or `<feature-group>/<verb>-<aggregate>/…`; secondary artifacts in `constants/`, `types/` and `helpers/` subfolders |
| `dto/<feature>/` | `<feature>.dto.shape.ts` (pure Zod schema + inferred type) |
| `dto/zod/` | Context-internal preprocessors, refinements and validators |
| `mappers/` | Pure functions; aggregate mapper at the root, sub-mappers in `<unit>/<unit>.mappers.ts` |
| `helpers/` | Pure application helpers in `<unit>/<unit>.helpers.ts` |

- Use-case folders contain only the use case and its spec at the root. Constants, types and helpers go in the kind subfolders beside it.
- A class file contains only its class. No module-level constants, types or helpers in a class file; place them in the nearest `constants/`, `types/` or `helpers/` folder.
- Use cases are plain classes. They MUST NOT import `@nestjs/*`, Mongoose, Fastify or `nestjs-zod`.
- Use cases may depend on domain ports, domain rules/constants/errors, own application mappers/collaborators, repository contracts, published contracts and published use cases. They MUST NOT depend on infrastructure or frameworks.
- DTO shapes are pure Zod. Wrappers live in infrastructure.
- Mappers are pure and deterministic. They map DTOs to commands/repository contracts and entities to response shapes.
- Commands are application messages; they MUST NOT leak into domain rules.

### 4.3 Infrastructure (`src/contexts/<context>/infrastructure/`)

| Directory | Contents |
|---|---|
| `http/controllers/<audience>-<aggregate>/` | `<audience>-<aggregate>.controller.ts` — thin, decorated, maps DTOs to commands and entities to response shapes; may contain `constants/`, `helpers/` and `types/` |
| `http/dto/<feature>/` | `<feature>.dto.ts` — NestJS wrapper around an application or published-contract DTO shape |
| `persistence/mongoose/schemas/` | `<aggregate>.mongoose.schema.ts`; nested sub-schemas under `schemas/<name>/<name>.mongoose.schema.ts`. The compiled `<AGGREGATE>_MONGOOSE_SCHEMA` constant beside the class is the only class-file constant exception |
| `persistence/mongoose/repository/` | `<aggregate>.mongoose.repository.ts` implementing the domain port; may contain `helpers/` and `types/` |
| `persistence/mongoose/repository/pipelines/` | Root pipeline and grouped pipelines under `pipelines/<feature>/<unit>.mongoose.repository.pipeline.ts` |
| `persistence/mongoose/repository/helpers/` | Repository-private Mongoose helpers; pure helpers keep `<unit>.helpers.ts` |
| `persistence/mongoose/repository/types/` | Repository-private type aliases |
| `persistence/mongoose/mappers/` | `<aggregate>.mongoose.mappers.ts` (document ↔ entity) |
| `persistence/mongoose/constants/`, `types/`, `errors/` | Persistence-private constants, types and infrastructure errors |
| `persistence/<context>-persistence.module.ts` | Schema, repository and token wiring; exports the token |

- Use plural `schemas/` everywhere.
- Pipeline groups use the feature name without a redundant `-pipeline` suffix (`question-stats/`, `question-theme-stats/`, `question-theme-assignment/`). File names always end `.mongoose.repository.pipeline.ts`.
- Controllers MUST NOT import another context's internals.
- Infrastructure MUST NOT import `@app/*` or another context's application use cases.

### 4.4 Contracts (`src/contexts/<context>/contracts/`)

`contracts/` exists only when a context publishes something another context consumes.

| Directory | Contents |
|---|---|
| `contracts/dto/<feature>/` | Published DTO shapes |
| `contracts/dto/<feature>.dto.mappers.ts` | Pure mappers for published shapes |
| `contracts/dto/zod/validators/<kind>/` | Validators owned by a published shape |
| `contracts/persistence/` | Published persistence contracts: collection names and published field names/status values in `<concept>.persistence.contracts.constants.ts`, structural shapes in `<concept>.persistence.contracts.types.ts`, pure persistence-to-domain mappers in `<concept>.persistence.mappers.ts` |

- `contracts/` is a facade, not a layer. It may import own domain, `shared/domain`, `shared/application` (pure) and `zod`. It MUST NOT import own application or infrastructure.
- `contracts/` holds **published contracts**. Repository contracts stay in `domain/repositories/<aggregate>.repository-contracts.types.ts`; do not mix the two.
- The owning context's application and infrastructure MAY import its own `contracts/`.
- Another context MAY import only the published surface. It MUST NOT import the provider's infrastructure, internal mappers, internal DTOs or non-published application code.
- Do not add to the published surface without a consumer and a lint allowlist update.

### 4.5 Shared (`src/shared/`)

- `domain/`: `constants/`, `rules/`, `types/`, `value-objects/`.
- `types/`: generic type-only utilities (`enum.types.ts`, `tuple.types.ts`) usable by any layer.
- `application/`: `dto/zod/` (preprocessors, refinements, validators), `mappers/` (find-all, localization, sort), `helpers/` (stats).
- `infrastructure/http/`: controllers, decorators, errors, middlewares, pipes, types.
- `infrastructure/persistence/mongoose/`: constants, helpers, schemas, types.
- `infrastructure/nest/helpers/`: NestJS provider helpers such as `createUseCaseProvider`.

Rules:

- Layered shared kernel: `shared/domain` ← `shared/application` ← `shared/infrastructure`.
- `shared` MUST NOT import a context or `src/app`.
- Promotion rule: code moves to `src/shared` only when it is used by at least two contexts, or is framework-wide by nature. Otherwise it stays owner-private.
- Pure Zod preprocessors, refinements and validators live under `shared/application/dto/zod/`.
- I/O and framework helpers live under `shared/infrastructure/`.
- **Accepted exception:** the localization middleware under `shared/infrastructure/http/middlewares/` imports `AppConfigService` from `src/infrastructure` because the repository has a single infrastructure area. This is recorded in §13; do not add new `shared → src/infrastructure` edges. If a second infrastructure area appears, move the middleware or introduce a narrow shared-owned config token.

### 4.6 Application shell and cross-cutting infrastructure

- `src/app/`: root controller, app metadata DTO, global HTTP exception filter, logger helpers, shell service, `app.module.ts`.
- `src/infrastructure/api/auth/`: API-key guards, auth decorators, auth errors and helpers.
- `src/infrastructure/api/config/`: environment schema, config module, validators and services.
- `src/infrastructure/api/health/`: health controller, DTOs, mappers and service.
- `src/infrastructure/api/server/`: Fastify bootstrap, CORS, Swagger.
- `src/infrastructure/database/`: Mongoose connection module and service.

`src/app` wires every context and cross-cutting module. It is the only area allowed to compose context domain errors into cross-context HTTP responses: `GlobalExceptionFilter` lives in `src/app/filters/global-exception/` and is registered with `APP_FILTER`. `src/infrastructure` imports `@shared/*` only, and `server.ts` receives the application module as a parameter.

## 5. Cross-context collaboration

### 5.1 Published surface

A context publishes only what another context actually consumes. Do not publish speculatively.

A context MAY publish:

- exported application use cases;
- published domain types, constants, pure rules and errors (read-only snapshots);
- a `contracts/` folder with DTO shapes/mappers/validators and persistence contracts.

Rules:

- Published use cases MUST accept and return primitives, published domain types or published contract types. They MUST NOT expose commands or internal types.
- The use case class is the stable token. Changes to its public method signature are breaking for consumers.
- Published domain types are read-only. A consumer MUST NOT mutate them or persist them directly. Prefer a local read model when only a subset is needed.
- Another context MUST import only the published surface. It MUST NOT import the provider's infrastructure, internal mappers, internal DTOs, Mongoose schemas or non-published application code.
- Every new published item updates the per-layer allowlist and the lint zones in the same PR.

### 5.2 The question / question-theme partnership

This table is the **published surface register** and the allowlist is **per consumer layer**, not a context-wide grant:

| Consumer | May import from the provider |
|---|---|
| `question/domain` | theme `domain/types`, `domain/constants`, `domain/rules`, `domain/errors` (read-only published domain) |
| `question/application` | the above, plus theme `application/use-cases/find-question-theme-by-id/**`, `application/use-cases/get-question-themes-by-ids-or-throw/**`, and theme `contracts/**` |
| `question/infrastructure` | theme `contracts/**` (DTO and persistence) and published theme domain types; **not** theme application use cases |
| `question/<context>.module.ts` | `question-theme.module.ts` and the two published theme use-case class tokens it injects |
| `question-theme/domain` | nothing from `question` |
| `question-theme/application` | `question/application/use-cases/count-live-questions-by-theme-id/**` |
| `question-theme/infrastructure` | `question/contracts/persistence/**` |
| `question-theme/<context>.module.ts` | `question-usage.module.ts` and the published count use-case class token it injects |

A module that wires a use case with `createUseCaseProvider` MUST import the published use-case class to use it as the `inject` token. That is wiring, not an application dependency; the application layer still imports only the published use case it calls.

Prefer pure published predicates/helpers. Do not call another context's `ensure*` policies: they throw provider errors and make the consumer depend on provider error semantics.

Exact published paths:

```text
question-theme publishes:
  src/contexts/question-theme/domain/types/question-theme.entities.ts
  src/contexts/question-theme/domain/types/question-theme.value-objects.ts
  src/contexts/question-theme/domain/constants/question-theme.constants.ts
  src/contexts/question-theme/domain/rules/question-theme.rules.ts
  src/contexts/question-theme/domain/errors/question-theme-not-found/**
  src/contexts/question-theme/application/use-cases/find-question-theme-by-id/**
  src/contexts/question-theme/application/use-cases/get-question-themes-by-ids-or-throw/**
  src/contexts/question-theme/contracts/**
  src/contexts/question-theme/contracts/persistence/question-theme.persistence.contracts.constants.ts
  src/contexts/question-theme/contracts/persistence/question-theme.persistence.contracts.types.ts

question publishes:
  src/contexts/question/application/use-cases/count-live-questions-by-theme-id/**
  src/contexts/question/contracts/persistence/question.persistence.contracts.constants.ts
```

`QUESTION_STATUS_ACTIVE` is published by the question persistence contract as a re-export of the question domain constant.

> `question` and `question-theme` are two co-deployed contexts sharing one MongoDB deployment and one team. The B-lite published surface is accepted. Do not add a published use case or contract without a consumer. Revisit only if a third context needs theme data, the published surface grows beyond a handful, or independent teams/deployments appear.

This is a deliberate partnership, not a general license. `QuestionModule` imports `QuestionThemeModule`; `QuestionThemeModule` imports `QuestionUsageModule`; `QuestionUsageModule` imports `QuestionPersistenceModule`. The module graph is acyclic.

### 5.3 Errors

- Errors are consumer-owned unless explicitly published.
- `ReferencedQuestionThemeArchivedError` is a question-creation rule and lives in `question/domain/errors/`.
- `QuestionThemeNotFoundError` is published by `question-theme/domain/errors/` and may be thrown by both contexts.
- A consumer MUST NOT throw an unpublished provider error.

### 5.4 Persistence

- Cross-context persistence joins are discouraged. When one remains, it MUST use a published persistence contract from `contracts/persistence/`, not a bare collection name.
- **Theme contract:** `src/contexts/question-theme/contracts/persistence/question-theme.persistence.contracts.constants.ts` publishes `QUESTION_THEME_MONGOOSE_COLLECTION_NAME`; `question-theme.persistence.contracts.types.ts` publishes `QuestionThemePersistenceShape` (structural shape, no Mongoose import).
- **Question contract:** `src/contexts/question/contracts/persistence/question.persistence.contracts.constants.ts` publishes `QUESTION_MONGOOSE_COLLECTION_NAME`, `QUESTION_STATUS_ACTIVE` and `QUESTION_THEME_USAGE_PERSISTENCE_FIELDS` (`status`, `themeId`).
- Question persistence uses `QuestionThemePersistenceShape` and the pure `createQuestionThemeFromPersistenceShape` mapper from the theme persistence contract; it MUST NOT import the theme schema or Mongoose mapper.
- The theme stats pipeline imports the question contract; it MUST NOT hardcode `"questions"`, `"status"` or `"themes.themeId"`.
- TypeScript structural assignability at the mapper call sites and acceptance tests cover the runtime contract. No dedicated pure-contract specs.

> Both contexts share one MongoDB deployment. Cross-context `$lookup` is accepted; collection and field names are published in `contracts/persistence` and covered by acceptance tests. Revisit only if the database is split or the join becomes a measurable performance bottleneck.

- **Live vs active:** `CountLiveQuestionsByThemeIdUseCase` counts `pending + active` questions and protects theme archive. Theme stats `activeQuestionCount` counts only `active` questions. The names are intentionally different; do not use “live” and “active” interchangeably.

### 5.5 Consistency

- Cross-context calls are read-only validation/query calls. They do not create a distributed transaction.
- Write invariants are enforced by the context that writes the aggregate.
- Cross-context consistency (theme archive vs live questions, question creation/assignment vs theme status) is best-effort. Test the race where it matters.
- Intra-question assignment writes MUST be atomic via conditional updates and update pipelines. This is the target tracked in #1271; do not use MongoDB transactions.
- The 3-theme maximum is enforced by the domain policy and the atomic write. The schema `maxItems` validator documents the invariant but is not the authority on updates.

### 5.6 Ceremony budget

This budget applies to **cross-context** ports, tokens, adapters, full public modules and ACL layers. It does not apply to repository ports inside a context, which are always required.

The current two-context B-lite model is accepted. Do not add cross-context ceremony while the models are identical. Upgrade from the published-use-case model only when a real driver appears:

- a separate deployment;
- a replaceable provider;
- multiple teams evolving the contexts independently;
- a third context needing the same data;
- the published surface growing beyond a handful of use cases/contracts;
- strict cross-context consistency becoming a requirement.

At that point, upgrade to full public ports/adapters, introduce transactions, or merge the contexts.

Known limitations of the B-lite model: the question/theme dependency is bidirectional at the contract level, the theme read model is shared, and the persistence `$lookup` relies on published field contracts. These are accepted for two co-deployed contexts and are the first things to revisit if the boundary grows.

## 6. Composition root and modules

### 6.1 Composition root

```ts
// src/main.ts
import { AppModule } from "@app/app.module";
import { bootstrap } from "@src/infrastructure/api/server/server";

void bootstrap(AppModule);
```

```ts
// src/infrastructure/api/server/server.ts
async function bootstrap(appModule: Type<unknown>): Promise<NestFastifyApplication> {
  const app = await NestFactory.create<NestFastifyApplication>(appModule, new FastifyAdapter(), { bufferLogs: true });
  // ...
}
```

- `src/main.ts` is the only file that imports `AppModule`.
- `server.ts` MUST NOT import `@app/*` or a context.

### 6.2 Module responsibilities

- `src/app/app.module.ts` imports every context and cross-cutting module.
- Every context with persistence has a persistence module; feature modules do not register schemas directly.
- A context module registers its controllers and use cases, and imports its persistence module.
- A persistence module registers the schema, the adapter and the token, and exports the token.
- A usage module imports the persistence module, provides a published use case, and exports it.
- A context module exports only the use cases or providers another context consumes.
- Consumers import the owning module or the usage module. They MUST NOT re-register another context's schema, repository or token.
- Avoid `forwardRef`. If a cycle appears, extract persistence wiring or revisit the boundary.

### 6.3 Use-case providers

Use cases are plain classes wired with `createUseCaseProvider`:

```ts
providers: [
  createUseCaseProvider(FindQuestionsUseCase, [QUESTION_REPOSITORY_TOKEN]),
]
```

The helper lives in `src/shared/infrastructure/nest/helpers/` and enforces the number of dependency tokens against the constructor at compile time. Token order MUST match constructor parameter order; module wiring tests assert multi-dependency injection.

- Do not list the class bare in `providers` and via `createUseCaseProvider` at the same time.
- Do not mix `@Inject()` with the `inject` array.
- Every class token injected across a module boundary MUST be exported by the owning module.
- Avoid factory cycles; mutual factory cycles can inject `null`/`undefined`.

### 6.4 Example graph

```text
QuestionModule
  ├── QuestionPersistenceModule
  └── QuestionThemeModule
        ├── QuestionThemePersistenceModule
        └── QuestionUsageModule
              └── QuestionPersistenceModule
```

- `QuestionPersistenceModule` exports `QUESTION_REPOSITORY_TOKEN`.
- `QuestionThemePersistenceModule` exports `QUESTION_THEME_REPOSITORY_TOKEN`.
- `QuestionUsageModule` exports `CountLiveQuestionsByThemeIdUseCase`.
- `QuestionModule` exports nothing.
- `QuestionThemeModule` exports the two theme lookup use cases.

## 7. DTOs, validation and errors

Request data flow:

```text
Client → Controller → Zod wrapper validation → application command
       → use case → repository port → Mongoose adapter
       → domain entity → mapper → response shape → Client
```

Domain errors bubble up to `GlobalExceptionFilter`, which maps client-actionable errors to HTTP exceptions.

### 7.1 DTO shapes and wrappers

For context-bound DTOs, the two-file pattern is:

- `<feature>.dto.shape.ts` — pure Zod schema and inferred type, in `application/dto/<feature>/` or `contracts/dto/<feature>/`.
- `<feature>.dto.ts` — `createZodDto` wrapper, in `infrastructure/http/dto/<feature>/`.

Nested shapes that are only composed by a parent may stay shape-only. Wrappers are required only when a controller binds the DTO or when Swagger must reference it as a named component. `nestjs-zod` inlines nested shapes into the parent OpenAPI schema, so an unused wrapper class cannot affect Swagger.

- Response shapes use `z.strictObject`. Add `.describe()` and `.meta({ example })` to public fields.
- Reuse shared validators and nested shapes instead of redefining fields.
- All request shapes use a non-strict `z.object` deliberately: the API performs permissive parsing, and Zod strips unknown properties, so extra fields are not retained or persisted. Response shapes remain `z.strictObject`.
- A wrapper may import a shape; a shape MUST NOT import a wrapper.
- A mapper or use case MUST NOT import a wrapper.
- The wrapper class MUST remain a value import in controllers (`@Body()`, `@Query()`); `import type` breaks `ZodValidationPipe`.
- The shared API exception shape is pure and lives in `shared/application/dto/`; it has no HTTP wrapper.

### 7.2 DTO families

| Family | Shape location | Wrapper location |
|---|---|---|
| Context shapes | `src/contexts/*/application/dto/` | `src/contexts/*/infrastructure/http/dto/` |
| Published context contracts | `src/contexts/*/contracts/dto/` | `src/contexts/*/infrastructure/http/dto/` |
| App metadata | `src/app/dto/app-metadata/` | `src/app/dto/app-metadata/` (app-shell exception) |
| API exception | `src/shared/application/dto/api-response-exception/` | no wrapper |
| Health | `src/infrastructure/api/health/dto/` | `src/infrastructure/api/health/dto/` (health-adapter exception) |

Only pure shapes, constants, value objects, pure helpers and faketories may be re-exported by `@goat-it/schemas`. The shared API exception shape is pure, has no HTTP wrapper, and lives in `shared/application/dto`. A wrapper only affects generated documentation when a controller or Swagger decorator references it.

### 7.3 Validator homes

- Shared pure preprocessors: `shared/application/dto/zod/preprocessors/<kind>/`.
- Shared pure refinements: `shared/application/dto/zod/refinements/<kind>/`.
- Shared pure validators: `shared/application/dto/zod/validators/<kind>/`.
- Context-internal validators: `<context>/application/dto/zod/{refinements,validators}/`.
- Published contract validators: `<context>/contracts/dto/zod/validators/<kind>/`.

Each validator's constants live in a `constants/` folder beside it, and its spec is colocated. Shape-owned constants that are not validator-specific live under `<context>/application/dto/<feature>/constants/` (for example `src/contexts/question/application/dto/shared/constants/question-sort.dto.constants.ts`). Do not create a generic `utils` bucket.

### 7.4 Errors and HTTP mapping

- One error class per subdirectory: `domain/errors/<error-name>/<error-name>.error.ts`.
- The class extends `Error`, sets `this.name` in its constructor and carries structured context.
- Map a domain error to a specific HTTP status only when the client can act on it (validation, not found, conflict, forbidden).
- Unexpected, invariant-violation and persistence-write failures MUST fall through to 500.
- Every new domain error must be classified in the PR: mapped, or intentionally 500 with a one-line justification.
- The four write/read-back errors are intentionally 500: `QuestionCreationError`, `QuestionThemeAssignmentCreationError`, `QuestionThemeAssignmentModificationError`, `QuestionThemeAssignmentRemovalError`.
- The filter MUST have tests asserting the 500 behaviour for those four errors, so the intent is locked.
- `GlobalExceptionFilter` is the single cross-context HTTP error composition point. It lives at `src/app/filters/global-exception/global-exception.filter.ts` and is registered with `APP_FILTER` in `AppModule`, so `src/shared` stays context-free.

## 8. Naming and placement

### 8.1 Artifact table

| Artifact | Directory | Filename | Required companions |
|---|---|---|---|
| Entity types | `domain/types/` | `<aggregate>.entities.ts` | — |
| Value-object types | `domain/types/` | `<aggregate>.value-objects.ts` | — |
| Domain types | `domain/types/` | `<aggregate>.types.ts` | — |
| Domain constants | `domain/constants/` | `<aggregate>.constants.ts` | — |
| Domain rules | `domain/rules/` | `<aggregate>.rules.ts` | `<aggregate>.rules.spec.ts` |
| Domain error | `domain/errors/<error-name>/` | `<error-name>.error.ts` | `.spec.ts`; HTTP mapping only when a specific status is required |
| Repository port | `domain/repositories/` | `<aggregate>.repository.types.ts` | `<aggregate>.repository.constants.ts` token |
| Repository contracts | `domain/repositories/` | `<aggregate>.repository-contracts.types.ts` | — |
| Commands | `application/commands/` | `<aggregate>.commands.ts` | — |
| Use case | `application/use-cases/<verb>-<aggregate>/` or `<feature-group>/<verb>-<aggregate>/` | `<verb>-<aggregate>.use-case.ts` | `.spec.ts`, module provider; secondary artifacts in `constants/`, `types/`, `helpers/` |
| DTO shape | `application/dto/<feature>/` | `<feature>.dto.shape.ts` | `.spec.ts` |
| DTO wrapper | `infrastructure/http/dto/<feature>/` | `<feature>.dto.ts` | Required only when NestJS binds the DTO or Swagger must reference it as a named component |
| Mapper | `application/mappers/` | `<aggregate>.mappers.ts` at the root; `<unit>/<unit>.mappers.ts` in subfolders | `.spec.ts` |
| Published contract shape | `contracts/dto/<feature>/` | `<feature>.dto.shape.ts` | `.spec.ts` when it owns logic |
| Published contract mapper | `contracts/dto/` | `<feature>.dto.mappers.ts` | `.spec.ts` |
| Published contract validator | `contracts/dto/zod/validators/<kind>/` | `<kind>.dto.zod.validators.ts` | `.spec.ts`, constants in `constants/` |
| Published persistence contract constants | `contracts/persistence/` | `<concept>.persistence.contracts.constants.ts` | — |
| Published persistence contract types | `contracts/persistence/` | `<concept>.persistence.contracts.types.ts` | — |
| Published persistence mapper | `contracts/persistence/` | `<concept>.persistence.mappers.ts` | `.spec.ts` |
| Shared pure DTO shape | `shared/application/dto/<feature>/` | `<feature>.dto.shape.ts` | `.spec.ts` |
| Controller | `infrastructure/http/controllers/<audience>-<aggregate>/` | `<audience>-<aggregate>.controller.ts` | `.spec.ts`, module registration; may contain `constants/`, `helpers/`, `types/` |
| Controller constants | `infrastructure/http/controllers/<audience>-<aggregate>/constants/` | `<aggregate>.constants.ts` | — |
| Mongoose schema | `infrastructure/persistence/mongoose/schemas/` | `<aggregate>.mongoose.schema.ts` / `<name>.mongoose.schema.ts` | — (excluded from coverage); the compiled schema constant is the only class-file constant exception |
| Mongoose repository | `infrastructure/persistence/mongoose/repository/` | `<aggregate>.mongoose.repository.ts` | `.spec.ts`, module provider |
| Mongoose mapper | `infrastructure/persistence/mongoose/mappers/` | `<aggregate>.mongoose.mappers.ts` | `.spec.ts` |
| Mongoose pipeline | `infrastructure/persistence/mongoose/repository/pipelines/` for the root, or `pipelines/<feature>/` | `<aggregate>.mongoose.repository.pipeline.ts` for the root, `<unit>.mongoose.repository.pipeline.ts` for grouped | — (excluded from coverage) |
| Mongoose helper | `infrastructure/persistence/mongoose/repository/helpers/` | `<unit>.mongoose.helpers.ts` only when Mongoose-specific; pure helpers `<unit>.helpers.ts`; local types `<unit>.helpers.types.ts` | `.spec.ts` |
| Persistence module | `infrastructure/persistence/` | `<context>-persistence.module.ts` | `.spec.ts` (module wiring) |
| Context module | `src/contexts/<context>/` | `<context>.module.ts` | `.spec.ts` (provider graph) |
| Usage module | `src/contexts/<context>/` | `<context>-usage.module.ts` | `.spec.ts` (provider graph) |
| Shared infrastructure helper | `shared/infrastructure/helpers/<unit>/` | `<unit>.helpers.ts` | `.spec.ts` |
| Shared Nest helper | `shared/infrastructure/nest/helpers/<unit>/` | `<unit>.helpers.ts` | `.spec.ts` |
| Shared mapper | `shared/application/mappers/<unit>/` | `<unit>.mappers.ts` | `.spec.ts` |
| Shared application helper | `shared/application/helpers/<unit>/` | `<unit>.helpers.ts` | `.spec.ts` |
| Shared Zod validator | `shared/application/dto/zod/validators/<kind>/` | `<kind>.zod.validators.ts` | `.spec.ts`, constants in `constants/` |
| Test | next to source | `<source-basename>.spec.ts` | — |

Companion test mechanics, test naming, mock and faketory conventions live in [unit-tests.md](unit-tests.md), [mocks.md](mocks.md) and [faketories.md](faketories.md); do not duplicate them here.

### 8.2 Folder anatomy

- One artifact family per folder.
- Kind subfolders: `constants/`, `types/`, `helpers/`, `mappers/`, `errors/`, `rules/`, `schemas/`, `pipelines/`.
- No loose constants, types or helpers beside a class file.
- A purely local type is colocated as `<source-basename>.types.ts`.
- A type shared by multiple files in one unit goes in `types/`.
- Constants go in the nearest `constants/`.
- Helpers go in the nearest `helpers/`.
- Specs are colocated; constants and types have no specs.
- Do not create empty kind folders.

### 8.3 Naming rules

- Files and directories are `kebab-case`; classes and types are `PascalCase`; functions and properties are `camelCase`; exported constants are `UPPER_CASE`.
- No default exports, barrel files, re-export-only files, or relative `./` / `../` imports in `src/`, `tests/` and `packages/schemas/src/`. `configs/` and `scripts/` may use relative imports. `packages/schemas` entrypoints are the only allowed barrels.
- One primary class per file. Functions and constants are declared first and exported at the end; DTO wrappers and Mongoose schemas declare their class then export it in an `export {}` block. Grouped infrastructure error files may contain closely related error classes.
- Context and domain directory names are never pluralized, even when the exported symbols name a collection.
- `ControllerPrefixes` remains the single enum exception. It holds only truly shared segments (`ADMIN`, `HEALTH`); context-specific route prefixes live in the owning context's controller constants.
- Mongoose schemas always use the plural `schemas/` directory.
- Pipeline groups use `pipelines/<feature>/` without a `-pipeline` suffix.
- Context-internal Zod lives under `application/dto/zod/`; published contract Zod lives under `contracts/dto/zod/`.
- Mappers: aggregate mapper at the root; sub-mappers in `<unit>/`; published mappers in `contracts/dto/`.
- Commands live in `application/commands/`.
- DTO wrappers live in `infrastructure/http/dto/`; they may wrap an `application/dto` or `contracts/dto` shape.
- Repository contracts live in `domain/repositories/*.repository-contracts.types.ts`; published contracts live in `contracts/`. Do not use one term for both.

## 9. Aliases and imports

Path aliases are mandatory in `src/`, `tests/` and `packages/schemas/src/`; relative imports are forbidden there.

| Alias | Resolves to |
|---|---|
| `@package-json` | `package.json` (test-only; in `src/`, use `readPackageJson()` instead of importing JSON) |
| `@src/*` | `src/*` |
| `@app/*` | `src/app/*` |
| `@shared/*` | `src/shared/*` |
| `@configs/*` | `configs/*` |
| `@question/*` | `src/contexts/question/*` |
| `@question-theme/*` | `src/contexts/question-theme/*` |
| `@unit-tests/*` | `tests/unit/*` |
| `@mocks/*` | `tests/unit/utils/mocks/*` |
| `@faketories/*` | `tests/shared/utils/faketories/*` |
| `@test-helpers/*` | `tests/shared/utils/helpers/*` |
| `@acceptance-tests/*` | `tests/acceptance/*` |
| `@acceptance-features/*` | `tests/acceptance/features/*` |
| `@acceptance-support/*` | `tests/acceptance/support/*` |

- Import groups are separated by blank lines: (1) `node:*`, (2) external packages, (3) internal aliases, (4) test aliases, (5) `import type`.
- When adding a new bounded context, register its alias in `configs/swc/swc.config.json`, `configs/typescript/tsconfig.app.json` and `configs/vitest/vitest.config.ts`.
- DTO wrapper classes and injected classes MUST stay value imports. Use `import type` only for type-only symbols. The linters keep `consistent-type-imports` off for this reason.
- Do not add a new alias for an existing area just for readability; `@src/*` remains the cross-cutting alias. Add a dedicated alias only through an approved design.

### 9.1 New context checklist

1. Register the context alias in `configs/swc/swc.config.json`, `configs/typescript/tsconfig.app.json` and `configs/vitest/vitest.config.ts`.
2. Define its published surface, if any; update §5.2 and the lint allowlist.
3. Add per-layer cross-context zones (domain, application, infrastructure, module) in the same PR.
4. Add a persistence module and a usage module when the context owns persistence or publishes a reverse dependency.
5. Add the context to the enforcement table in §12.1.

## 10. Tests

- Unit specs are colocated with their source as `<source-basename>.spec.ts`.
- Shared faketories, mocks and acceptance assets live under `tests/` (`tests/shared/utils/faketories/`, `tests/unit/utils/mocks/`, `tests/acceptance/`).
- Coverage is enforced at 100% (`pnpm run test:unit:cov`). Mutation testing runs through Stryker (`configs/stryker/`).
- Coverage and mutation exclude patterns are authoritative in `configs/vitest/vitest.config.ts` and `configs/stryker/stryker.config.mjs`; this guide states the policy and does not copy the lists.
- `*.module.ts` is in both coverage and mutation scope: every module has a colocated `.module.spec.ts` — see [unit-tests.md § Module wiring tests](unit-tests.md#module-wiring-tests).
- `*.dto.ts` stays under mutation testing; every `*.schema.ts` file, including `src/infrastructure/api/config/schemas/env.schema.ts`, is excluded from mutation.

| SUT | Boundary to mock |
|---|---|
| Use case | Repository **port** or published use case |
| Controller | Use case |
| Repository | Mongoose model/collection |
| Acceptance | Real HTTP + real database |

Test mechanics live in [unit-tests.md](unit-tests.md), [mocks.md](mocks.md), [faketories.md](faketories.md) and [acceptance-tests.md](acceptance-tests.md).

## 11. Published package

`packages/schemas` is the publishable facade for `@goat-it/schemas`. Entrypoints and usage are documented in [packages/schemas/README.md](../packages/schemas/README.md).

Context `contracts/` are for **inter-context runtime** imports. `packages/schemas` is the **external package API**. The two surfaces may overlap, but they are different boundaries: adding to one does not automatically add to the other.

Rules:

- Only pure, framework-free modules may be re-exported: DTO shapes from `application/dto` or `contracts/dto`, constants, value objects, pure helpers and faketories.
- The shared API exception shape lives in `shared/application/dto`; it is pure and has no HTTP wrapper.
- Never export DTO wrappers, controllers, Nest modules, Mongoose schemas/repositories, application use cases or internal mappers.
- When a shape moves from `application/dto` to `contracts/dto`, the entrypoint source path updates but the exported symbol stays stable. That is not a breaking API change.
- Entrypoint `index.ts` files are the only allowed barrels. Use explicit named exports; no `export *`.
- `./testing/*` entrypoints and the `@faker-js/faker` peer dependency are intentional. Faketories must stay framework-free.
- Bump the **patch** version when an existing export changes. Ask the user before adding a new export (see [AGENTS.md](../AGENTS.md) DOD items 4 and 5).
- The package declares `zod` and `@faker-js/faker` as peer dependencies.

## 12. Enforcement

Path and package boundaries are enforced by ESLint. Relative imports are enforced by Oxlint's `eslint/no-restricted-imports` with `^\\./` and `^\\.\\./` regex patterns, scoped to `src/**`, `tests/**` and `packages/schemas/src/**`; `configs/` and `scripts/` may use relative imports. `pnpm run lint` runs both.

### 12.1 Path zones

| # | Target (files that must not import) | Forbidden `from` |
|---|---|---|---|
| 1 | `src/contexts/*/domain/**/!(*.spec).ts` | `src/contexts/*/application/**`, `src/contexts/*/infrastructure/**` |
| 2 | `src/contexts/*/application/**/!(*.spec).ts` | `src/contexts/*/infrastructure/**` |
| 3 | `src/contexts/**/!(*.spec).ts` | `src/app/**` |
| 4 | `src/shared/domain/**/!(*.spec).ts` | `src/shared/application/**`, `src/shared/infrastructure/**` |
| 5 | `src/shared/application/**/!(*.spec).ts` | `src/shared/infrastructure/**` |
| 6 | `src/shared/domain/**/!(*.spec).ts`, `src/shared/application/**/!(*.spec).ts` | `src/contexts/**`, `src/app/**` |
| 7 | `src/**/!(*.spec).ts` | `tests/**` |
| 8 | `src/infrastructure/**/!(*.spec).ts` | `src/contexts/**`, `src/app/**` |
| 9 | `src/shared/infrastructure/**/!(*.spec).ts` | `src/contexts/**`, `src/app/**` |
| 10a | `src/contexts/*/domain/**/!(*.spec).ts` | `src/shared/application/**`, `src/shared/infrastructure/**`, `src/contexts/*/contracts/**` |
| 10b | `src/contexts/*/application/**/!(*.spec).ts` | `src/shared/infrastructure/**` |
| 10c | `src/contexts/*/contracts/**/!(*.spec).ts` | `src/contexts/*/application/**`, `src/contexts/*/infrastructure/**`, `src/shared/infrastructure/**` |
| 11a | `src/contexts/question/domain/**/!(*.spec).ts` | `src/contexts/question-theme/**` except published theme domain |
| 11b | `src/contexts/question/application/**/!(*.spec).ts` | `src/contexts/question-theme/{domain,application,infrastructure}/**` except published theme domain and the two theme use cases |
| 11c | `src/contexts/question/infrastructure/**/!(*.spec).ts` | `src/contexts/question-theme/{domain,application,infrastructure}/**` except published theme domain |
| 11d | `src/contexts/question/question.module.ts`, `src/contexts/question/question-usage.module.ts` | `src/contexts/question-theme/**` except `question-theme.module.ts` and the two published theme use cases |
| 12a | `src/contexts/question-theme/application/**/!(*.spec).ts` | `src/contexts/question/{application,contracts,domain,infrastructure}/**` except the count use case |
| 12b | `src/contexts/question-theme/infrastructure/**/!(*.spec).ts` | `src/contexts/question/{application,contracts,domain,infrastructure}/**` except `contracts/persistence/**` |
| 12c | `src/contexts/question-theme/question-theme.module.ts` | `src/contexts/question/**` except `question-usage.module.ts` and the published count use case |
| 13 | `src/contexts/question-theme/domain/**/!(*.spec).ts` | `src/contexts/question/**` |
| 14 | `src/contexts/question/contracts/**/!(*.spec).ts` | `src/contexts/question-theme/**` |
| 15 | `src/contexts/question-theme/contracts/**/!(*.spec).ts` | `src/contexts/question/**` |
| 16 | `src/contexts/*/application/**/!(*.spec).ts`, `src/contexts/*/domain/**/!(*.spec).ts`, `src/shared/application/**/!(*.spec).ts`, `src/shared/domain/**/!(*.spec).ts` | `src/infrastructure/**` |

Do not add production boundary-rule disables. The existing `unicorn/no-keyword-prefix` disables in the stats pipelines are not boundary rules and are out of scope.

When `from` is a glob, `except` entries MUST be glob patterns. Prefer directory-based `from` plus relative `except` entries for exact allowlists. The table is based on repository inspection; validate it with the actual `pnpm run lint:eslint` run before merge. New contexts add per-layer zones; see §9.1.

Zones 10c, 11b, 11c and 12b are implemented as one zone per provider subtree when the allowlist differs by subtree. Directory-based `from` keeps `except` relative and readable; the table states the logical rule, not the exact number of zone objects.

Zone 1 also catches any context's `application/**` or `infrastructure/**` imported from any context `domain/**`, including `question-theme`. Zone 11a is therefore specifically about the published **theme domain** surface; an import of a theme use case legitimately reports both zone 1 and zone 11a. Overlap is expected, not a configuration bug.

### 12.2 Package bans

| Scope | Forbidden |
|---|---|---|
| `src/contexts/*/domain/**`, `src/shared/domain/**` | `@nestjs/*`, `mongoose`, `fastify`, `nestjs-zod`, `zod` |
| `src/contexts/*/domain/**`, `src/shared/domain/**` | `node:*` |
| `src/contexts/*/application/**`, `src/shared/application/**` | `@nestjs/*`, `mongoose`, `fastify`, `nestjs-zod` |
| `src/contexts/*/contracts/**` | `@nestjs/*`, `mongoose`, `fastify`, `nestjs-zod`, own `application/**`, own `infrastructure/**` |

`zod` remains allowed in application and contracts; it is forbidden in domain. Type-only `type-fest` is allowed in pure layers. `shared/types` is type-only and usable everywhere.

Package bans use ESLint core `no-restricted-imports` in scoped flat-config blocks. Every block MUST be composed **after** `oxlint.buildFromOxlintConfigFile(...)` in `eslint.config.ts`: the Oxlint bridge emits a later `"no-restricted-imports": "off"` for `**/*.ts`, so a block placed before it is a silent no-op. Ban subpaths as well (`mongoose/*`, `fastify/*`, `nestjs-zod/*`) and exclude `**/*.spec.ts` / `**/*.d.ts` from the production ban blocks. The domain block covers `contexts/*/domain` and `shared/domain`; the application block covers `contexts/*/application` and `shared/application`; the contracts block covers `contexts/*/contracts`.

### 12.3 Rules

- `import-x/no-cycle` stays on.
- Add a new zone only with a passing codebase or with a documented accepted exception.
- When adding a cross-context dependency, update the published surface and the per-layer allowlist in the same PR.
- When `from` is a glob, `except` entries MUST be glob patterns. Prefer directory-based `from` plus relative `except` entries.
- Path zones resolve imports, so they also catch `@src/*` imports of forbidden paths; alias-based bans alone are not sufficient.
- Do not move the Oxlint bridge above the package-ban block. That silently disables package bans.
- Prove a new zone with a temporary forbidden import and a temporary allowed import; a clean lint alone does not prove the rule resolves aliases.
- Prove the relative-import ban separately: `./foo` and `../foo` must fail in `src/`, while the same imports in `configs/` and `scripts/` must pass.
- No dependency-cruiser, custom architecture script or separate CI job. Enforcement runs through the existing `pnpm run lint` / `pnpm run lint:eslint`.

## 13. Accepted exceptions

| Exception | Rule | Removal condition |
|---|---|---|
| `shared/infrastructure` localization middleware imports `src/infrastructure` `AppConfigService` | Accepted because there is one infrastructure area | A second infrastructure area appears; then move the middleware or introduce a narrow shared-owned token |

Every accepted exception MUST name a removal condition. Do not add a silent exception to the guide. Existing non-boundary lint disables (for example `unicorn/no-keyword-prefix` in the stats pipelines) are tracked by the lint policy, not this register.

## 14. Framework references

- [NestJS modules](https://docs.nestjs.com/modules), [providers](https://docs.nestjs.com/providers), [controllers](https://docs.nestjs.com/controllers), [custom providers](https://docs.nestjs.com/fundamentals/custom-providers) and [testing](https://docs.nestjs.com/fundamentals/unit-testing).
- [Fastify](https://fastify.dev/docs/latest/) and the NestJS Fastify adapter.
- [Mongoose schemas](https://mongoosejs.com/docs/guide.html) and [NestJS MongoDB integration](https://docs.nestjs.com/techniques/mongodb).
- [Zod](https://zod.dev/) and [nestjs-zod](https://github.com/BenLorantfy/nestjs-zod).
- [Vitest](https://vitest.dev/) and [StrykerJS](https://stryker-mutator.io/).
- [Cucumber.js](https://github.com/cucumber/cucumber-js).
- [eslint-plugin-import-x `no-restricted-paths`](https://github.com/un-ts/eslint-plugin-import-x/blob/master/docs/rules/no-restricted-paths.md).

This guide owns placement, naming, dependency and boundary rules. Test mechanics live in `unit-tests.md`, `mocks.md`, `faketories.md` and `acceptance-tests.md`; CI in `ci-cd.md`; operations in `operations.md`; package usage in `packages/schemas/README.md`. Do not duplicate them here.
