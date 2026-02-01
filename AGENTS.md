# AGENTS.md

**Last Updated**: 2025-01-20  
**Document Version**: 2.0 (Enhanced with industry best practices)

## Table of Contents

### Core Documentation
1. [Purpose](#purpose)
2. [Agent guidelines](#agent-guidelines)
3. [Project summary](#project-summary)
4. [High-level architecture](#high-level-architecture)
5. [Key design decisions](#key-design-decisions)

### Project Structure and Organization
6. [Important files and locations](#important-files-and-locations)
7. [Path aliases](#path-aliases)
8. [Project Directory Structure](#project-directory-structure)
9. [Naming conventions (filenames and types)](#naming-conventions-filenames-and-types)
10. [Where to put a new bounded context / feature (concrete recipe)](#where-to-put-a-new-bounded-context--feature-concrete-recipe)
11. [Config and tooling files](#config-and-tooling-files)

### Development Patterns and Conventions
12. [DTO and validation patterns](#dto-and-validation-patterns)
13. [Repository pattern](#repository-pattern)
14. [Error handling patterns](#error-handling-patterns)
15. [API Design and REST conventions](#api-design-and-rest-conventions)
16. [Authentication and Security Patterns](#authentication-and-security-patterns)
17. [Dependency Injection and Provider Patterns](#dependency-injection-and-provider-patterns)
18. [Import and Export Conventions](#import-and-export-conventions)
19. [Performance and Scalability Considerations](#performance-and-scalability-considerations)

### Testing and Quality
20. [Testing conventions](#testing-conventions)
21. [Testing Anti-Patterns to Avoid](#testing-anti-patterns-to-avoid)
22. [Mutation testing (Stryker)](#mutation-testing-stryker)
23. [Acceptance tests](#acceptance-tests)
24. [Code Quality and Style Enforcement](#code-quality-and-style-enforcement)

### Anti-Patterns and Best Practices
25. [Common Pitfalls and Anti-Patterns to Avoid](#common-pitfalls-and-anti-patterns-to-avoid)
26. [Industry Best Practices Compliance](#industry-best-practices-compliance)

### Operational Guides
27. [Common scripts](#common-scripts)
28. [Linting, commits and release automation](#linting-commits-and-release-automation)
29. [CI/CD Workflows](#cicd-workflows)
30. [Docker](#docker)
31. [Minimal local setup for a developer/agent](#minimal-local-setup-for-a-developeragent)
32. [Environment variables](#environment-variables)

### Reference
33. [General rules and small reminders](#general-rules-and-small-reminders)
34. [Examples](#examples)
35. [Security and sensitive data](#security-and-sensitive-data)
36. [Conventions and coding style](#conventions-and-coding-style)
37. [What an agent must do before committing any change](#what-an-agent-must-do-before-committing-any-change)
38. [Examples of small tasks an agent may be asked to do](#examples-of-small-tasks-an-agent-may-be-asked-to-do)
39. [Notes and warnings](#notes-and-warnings)
40. [Contact and maintainers](#contact-and-maintainers)
41. [Contributing](#contributing)

---

## Purpose

This document is written for automated agents (AIs) and humans who will programmatically interact with the repository. It explains the project's goals, architecture, conventions, important files, workflows (build/test/lint/release), and provides step-by-step guidance and safety rules for making changes, writing tests and preparing PRs.

If you're an automated agent, follow the 'Agent guidelines' section closely. It contains rules for edits, testing, quality gates and examples of common tasks.

## Agent guidelines

This consolidated section presents the authoritative rules an agent (automated or human acting programmatically) must follow before, during and after making changes to the repository.

### Scope of allowed changes

- Low-risk edits (safe): typo fixes, documentation updates, non-functional adjustments (README, docs, local tool configs that are not sensitive), small test fixes and adding tests for existing code. These can be implemented on a dedicated branch and validated with the standard checks.
- Limited functional changes: small, isolated features or endpoints, or local refactors that do not change public contracts. Require unit tests, typechecking, full coverage and a human review is recommended before merge.
- High-risk changes (architecture, infra/CI, major refactors): forbidden without explicit human approval. Such changes require an RFC, multi-reviewer approvals, and additional validations (integration tests, CI mutation testing, staging deployment checks, etc.).

### Risk-based rules and additional checks

- Low-risk PRs (affecting < 10 files and not touching CI or secrets): run lint, typecheck, unit tests and coverage locally or via CI. If green, open a standard PR with at least one human reviewer.
- Medium-risk PRs (10–50 files, cross-cutting changes or public API changes): in addition to the above, include corner-case tests and require `pnpm run test:mutation` in CI where possible. Do not merge without at least one human reviewer and an explicit approval.
- High-risk PRs (> 50 files, API break, infra/CI changes): automated merges are prohibited. Provide a full description, rollback plan, impact checklist and get multiple human approvals.

### Files agents can and cannot modify

- Allowed without special approval: code under `src/`, tests and test helpers under `tests/`, non-sensitive tool configs under `configs/`, utility scripts under `scripts/`, and documentation files (`README.md`, `AGENTS.md`, docs).
- Forbidden or require explicit human approval: Git history rewrites (force-pushes that rewrite history), updates to `package.json` that bump major versions or lockfile for automated dependency updates (unless an established policy exists), files containing secrets (e.g. `.env` files with credentials), CI credential files or secrets stored in `configs/ci` (or similar), deployment keys and any file explicitly marked "do not edit by automation."
- Rule of thumb: if the change touches security, CI/deployment, git history, secrets or production configuration — stop, open a draft PR/issue describing the change and request human review.

### PR atomicity policy

- Single-purpose PRs: a PR should have one clear intent (bugfix, small feature, or focused refactor). Avoid multi-objective PRs.
- Diff size guidance: prefer small diffs (<10 files ideal). If larger diffs are unavoidable, explain the reason in the PR body and include a validation & rollback checklist.
- Tests required: any behavioral change must include unit tests covering the new behavior. Public API changes must be documented and complemented by integration tests if applicable.
- Commits: keep commits atomic and descriptive. Follow `commitlint` rules and existing project commit conventions.

### Abort / save procedure if gates fail

- Pre-merge: if `lint`, `typecheck`, or `test:unit:cov` fail locally, fix before pushing. If CI checks fail after push, mark the PR as blocked and open a corrective PR.
- Post-merge regression: revert the PR to roll back, notify maintainers and provide a minimal post-mortem (what broke, why, how fixed).
- Save work in progress: if an agent encounters blocking failures that require human context, create a clearly named WIP branch `wip/<ticket>-<short-desc>`, push it, and open an issue or draft PR requesting human assistance. Do not force a merge or bypass the checks.

### Operational checklist before opening a PR

- Identify the minimal set of files to change.
- Create a descriptive branch (`<type>/<scope>-<short-desc>`).
- Add or update tests (unit and integration where necessary).
- Run locally: `pnpm run lint`, `pnpm run typecheck`, `pnpm run test:unit:cov`, `pnpm run test:acceptance`.
- In the PR body: explain the goal, changes, impact and rollback plan.
- Mark the PR as requiring human review if the change is medium/high risk.

### Auditability and traceability

- Agents must leave clear, traceable commits and avoid committing secrets.
- Significant automated actions should be documented in the PR/issue (logs, rationale, checks executed).

### Exceptions and contact

- For any change not clearly covered by this policy, open an issue describing the proposal and request human confirmation before implementing.

## Project summary

- Name: `goat-it-api`
- Version: see `package.json`, it is managed by `semantic-release`.
- Primary language: TypeScript (ES2021 targeting CommonJS as NestJS requires it).
- Framework: NestJS (with Fastify adapter)
- Build tool / transpiler: `swc` (via NestJS builder and `unplugin-swc` for tests)
- Type checking: `tsgo` (native TypeScript preview from `@typescript/native-preview`, use `pnpm run typecheck`)
- Test runner: Vitest (with V8 coverage provider) with `100%` coverage thresholds enforced.
- Mutation testing: Stryker with `100%` mutation score goal.
- Acceptance tests: Cucumber with Gherkin feature files.
- Linting: ESLint (flat-configs under `configs/eslint`) and Oxlint (under `configs/oxlint`)
- Package manager: `pnpm` (see `package.json` for `packageManager` field to specify the version)
- Node engine: Node.js `>= 25.4.0` (see `package.json` `engines` field)
- Database: MongoDB with Mongoose ODM
- Validation: Zod schemas with `nestjs-zod` integration for DTO validation and OpenAPI schema generation

## High-level architecture

This project follows a **Hexagonal Architecture** (Ports and Adapters) combined with **Domain-Driven Design (DDD)** principles, organized by bounded contexts.

### Core architectural layers

1. **Domain Layer** (`domain/`): Contains business entities, value objects, repository interfaces (ports), and domain-specific errors. This layer has no external dependencies.
2. **Application Layer** (`application/`): Contains use cases, DTOs, and mappers. Orchestrates domain logic and defines the application's behavior.
3. **Infrastructure Layer** (`infrastructure/`): Contains concrete implementations of ports (adapters) — HTTP controllers, database repositories, external services. This layer implements interfaces defined in the domain.

### Entry points

- **Entry point**: `src/main.ts` — imports and calls the bootstrap function from `src/infrastructure/api/server/server.ts`.
- **Server setup**: `src/infrastructure/api/server/server.ts` — builds a Nest application using `AppModule`, uses `FastifyAdapter`, enables shutdown hooks, binds to env variables, sets up Swagger documentation, applies global exception filters, and logs the listen URL.
- **Application module**: `src/app/app.module.ts` — central wiring for infrastructure modules (`config`, `database`, `health`, `logging`) and bounded context modules.

### Bounded contexts' structure

The project organizes domain logic into bounded contexts under `src/contexts/`:

```
src/contexts/<context-name>/
├── <context-name>.module.ts          # Context root module
└── modules/
    └── <feature-name>/
        ├── <feature-name>.module.ts  # Feature module (wires all layers)
        ├── domain/
        │   ├── entities/             # Domain entities and their types
        │   ├── value-objects/        # Domain value objects (types and constants)
        │   ├── repositories/         # Repository interface (port) + token
        │   ├── contracts/            # Data contracts for modifications/operations
        │   ├── commands/             # Command types that wrap contracts with IDs
        │   └── errors/               # Domain-specific errors
        ├── application/
        │   ├── use-cases/            # Business logic operations
        │   ├── dto/                  # Zod-based DTOs for API
        │   └── mappers/              # Entity-to-DTO mappers
        └── infrastructure/
            ├── http/
            │   └── controllers/      # NestJS HTTP controllers (can be nested)
            └── persistence/
                └── mongoose/
                    ├── schema/       # Mongoose schema definitions
                    ├── repository/   # Repository implementation (adapter)
                    ├── mappers/      # Document-to-entity mappers
                    ├── types/        # Mongoose-specific types
                    └── constants/    # Collection names, etc.
```

## Key design decisions

- **NestJS** is chosen for structure and dependency injection.
- **Fastify** is chosen for performance (via `@nestjs/platform-fastify`).
- **swc** used as the build/transpile tool (fast compilation) and configured in `configs/swc/swc.config.json`.
- **tsgo** (native TypeScript from `@typescript/native-preview`) is used for type checking via `pnpm run typecheck`.
- **Hexagonal Architecture** with DDD is used to separate concerns and enable testability. Domain logic is isolated from infrastructure concerns.
- **Zod** with `nestjs-zod` provides runtime validation and automatic OpenAPI schema generation for DTOs.
- **Mongoose** is used as MongoDB ODM with custom schemas and repository implementations.
- **Path aliases** are used to simplify imports (`@app`, `@shared`, `@question`, `@faketories`, `@mocks`, etc.). These are defined in the SWC config, TypeScript configs, and Vitest config.
- **Repository pattern** with dependency injection tokens separates domain interfaces from infrastructure implementations.

## Important files and locations

(Only the most relevant files for development and automated edits are listed here.)

### Configuration files

- `package.json` — scripts, dependencies, devDependencies, engines, and package metadata.
- `tsconfig.json` — TypeScript project configuration (root-level config for IDEs). It references multiple `tsconfig.*.json` files for specific purposes under `configs/typescript`.
- `configs/swc/swc.config.json` — SWC configuration for building the application (paths, decorators, module type).
- `configs/nest/nest-cli.config.json` — Nest CLI configuration (sourceRoot, SWC builder, type checking behavior).
- `configs/vitest/vitest.config.ts` — Vitest configuration including path aliases and SWC plugin for tests.
- `configs/stryker/stryker.config.mjs` — Mutation testing configuration for Stryker.
- `configs/eslint/*` — ESLint flat-configs and parser declarations used by `pnpm run lint:eslint`.
- `configs/oxlint/*` — Oxlint configurations used by `pnpm run lint:oxlint`.

### Startup files

The main entry points for application startup:

- `src/main.ts` — simple bootstrap caller.
- `src/infrastructure/api/server/server.ts` — Nest/Fastify bootstrap logic.
- `src/app/app.module.ts` — Nest root module that imports infrastructure and context modules.
- `src/app/controllers/app.controller.ts` — root controller exposing API metadata.
- `src/app/providers/services/app.service.ts` — service that reads `package.json` for metadata.

### Infrastructure modules

Modules providing infrastructure capabilities and not specific to any bounded context:

- `src/infrastructure/api/server/` — Server bootstrap and Fastify adapter setup. Contains subdirectories:
  - `src/infrastructure/api/server/swagger/` — Swagger/OpenAPI documentation setup and helpers.
  - `src/infrastructure/api/server/cors/` — CORS configuration helpers.
- `src/infrastructure/api/config/` — Application configuration module using `@nestjs/config`.
- `src/infrastructure/api/health/` — Health check endpoints using `@nestjs/terminus`.
- `src/infrastructure/database/` — MongoDB/Mongoose database configuration and connection.

### Bounded contexts

Specific domain contexts are located under `src/contexts/`. For example:

- `src/contexts/question/` — Question bounded context containing question-theme feature module.

### Shared code

When functionality is shared across multiple contexts, it is placed under `src/shared/` organized by architectural layers:

- `src/shared/domain/` — Shared domain value objects (e.g., locale).
- `src/shared/application/` — Shared application utilities (e.g., mappers).
- `src/shared/infrastructure/` — Shared infrastructure code:
  - `src/shared/infrastructure/http/` — HTTP-related utilities:
    - `controllers/` — Base controller patterns and enums.
    - `decorators/` — Custom decorators (e.g., `@Localization`).
    - `pipes/` — Validation and transformation pipes (e.g., `MongoIdPipe`).
    - `middlewares/` — Request/response middlewares (e.g., `LocalizationMiddleware`).
    - `filters/` — Exception filters (e.g., `GlobalExceptionFilter`).
    - `validators/` — Zod validator helpers and custom validators.
    - `dto/` — Shared DTO definitions.
    - `types/` — HTTP-related TypeScript types.
  - `src/shared/infrastructure/persistence/` — Persistence-related utilities (Mongoose constants).

### Test utilities

- `tests/unit/setup/` — Vitest setup files for mocks.
- `tests/unit/utils/mocks/` — Mock implementations for unit tests (organized by module structure).
- `tests/shared/utils/faketories/` — Factory functions for creating test data (shared between unit and acceptance tests).

Note: Unit test source files (implementation tests) must be colocated with their corresponding source files under `src/` using the `*.spec.ts` pattern (for example `src/contexts/question/modules/question-theme/application/use-cases/find-all-question-themes/find-all-question-themes.use-case.spec.ts`).

## Path aliases

The project uses path aliases for cleaner imports. These are configured in `configs/swc/swc.config.json`, `configs/typescript/tsconfig.*.json`, and `configs/vitest/vitest.config.ts`.

### Available aliases

| Alias                    | Path                              | Description                                         |
|--------------------------|-----------------------------------|-----------------------------------------------------|
| `@package-json`          | `package.json`                    | Direct import of package.json                       |
| `@src/*`                 | `src/*`                           | Root source directory                               |
| `@app/*`                 | `src/app/*`                       | Application module (controllers, services, helpers) |
| `@shared/*`              | `src/shared/*`                    | Shared code (domain, application, infrastructure)   |
| `@question/*`            | `src/contexts/question/*`         | Question bounded context                            |
| `@configs/*`             | `configs/*`                       | Configuration files                                 |
| `@unit-tests/*`          | `tests/unit/*`                    | Unit test utilities                                 |
| `@faketories/*`          | `tests/shared/utils/faketories/*` | Test data factories                                 |
| `@mocks/*`               | `tests/unit/utils/mocks/*`        | Mock implementations                                |
| `@acceptance-tests/*`    | `tests/acceptance/*`              | Acceptance test root                                |
| `@acceptance-features/*` | `tests/acceptance/features/*`     | Acceptance feature files                            |
| `@acceptance-support/*`  | `tests/acceptance/support/*`      | Acceptance test support utilities                   |

### Usage example

```typescript
// Instead of relative imports like:
import { QuestionTheme } from "../../../domain/entities/question-theme.types";

// Use path aliases:
import { QuestionTheme } from "@question/modules/question-theme/domain/entities/question-theme.types";
```

When adding a new bounded context, add corresponding path aliases in:

1. `configs/swc/swc.config.json` (for runtime)
2. `configs/typescript/tsconfig.app.json` (for IDE/type checking)
3. `configs/vitest/vitest.config.ts` (for tests)

## Project Directory Structure

This project follows a **Hexagonal Architecture** with **DDD** layout. When adding files or folders, prefer the locations and naming patterns below so that code, tests and tooling remain consistent.

### Top-level folders

- `src/` — application source. Add new runtime code here.
  - `src/main.ts` — application entry point (bootstrap caller).
  - `src/app/` — application module (root module, controllers, services, helpers, types).
  - `src/contexts/` — bounded contexts containing domain features.
  - `src/shared/` — shared code organized by architectural layers:
    - `src/shared/domain/` — shared domain value objects.
    - `src/shared/application/` — shared application utilities (mappers).
    - `src/shared/infrastructure/` — shared infrastructure code (HTTP utilities, persistence helpers).
  - `src/infrastructure/` — infrastructure modules:
    - `src/infrastructure/api/` — API-related infrastructure (config, health, server with Swagger and CORS).
    - `src/infrastructure/database/` — database configuration and connection.
- `tests/` — test code organized by type:
  - `tests/unit/` — unit test setup, utilities, mocks, and coverage output.
  - `tests/shared/` — test utilities shared between unit and acceptance tests (faketories).
  - `tests/acceptance/` — Cucumber acceptance tests.
  - `tests/mutation/` — Stryker mutation testing output.
- `configs/` — tool configurations (ESLint, Oxlint, SWC, Vitest, Stryker, TypeScript, etc.).
- `scripts/` — helper shell scripts for CI/developer workflows.

## Naming conventions (filenames and types)

### File naming patterns

Use the NestJS-style filename pattern: `<name>.<type>.ts` where `<type>` indicates the file's purpose:

| Type          | Description                                 | Example                                     |
|---------------|---------------------------------------------|---------------------------------------------|
| `module`      | NestJS module                               | `question-theme.module.ts`                  |
| `controller`  | HTTP controller                             | `question-theme.controller.ts`              |
| `service`     | Business service                            | `app.service.ts`                            |
| `use-case`    | Application use case                        | `find-all-question-themes.use-case.ts`      |
| `dto`         | Data Transfer Object (Zod-based)            | `question-theme.dto.ts`                     |
| `types`       | TypeScript type definitions                 | `question-theme.types.ts`                   |
| `constants`   | Constant values                             | `question-theme.repository.constants.ts`    |
| `errors`      | Custom error classes                        | `question-theme.errors.ts`                  |
| `mappers`     | Data transformation functions               | `question-theme.dto.mappers.ts`             |
| `contracts`   | Domain modification contracts               | `question-theme.contracts.ts`               |
| `commands`    | Domain command types                        | `question-theme.commands.ts`                |
| `pipe`        | NestJS pipe                                 | `mongo-id.pipe.ts`                          |
| `guard`       | NestJS guard                                | `auth.guard.ts`                             |
| `interceptor` | NestJS interceptor                          | `logging.interceptor.ts`                    |
| `middleware`  | NestJS middleware                           | `localization.middleware.ts`                |
| `decorator`   | Custom decorator                            | `localization.decorator.ts`                 |
| `filter`      | NestJS exception filter                     | `global-exception.filter.ts`                |
| `validators`  | Validation helpers (Zod)                    | `string.zod.validators.ts`                  |
| `schema`      | Mongoose schema (use `.mongoose.schema.ts`) | `question-theme.mongoose.schema.ts`         |
| `repository`  | Repository implementation                   | `question-theme.mongoose.repository.ts`     |
| `spec`        | Unit test file                              | `question-theme.controller.spec.ts`         |
| `mock`        | Mock implementation for tests               | `find-all-question-themes.use-case.mock.ts` |
| `faketory`    | Test data factory                           | `question-theme.faketory.ts`                |
| `helpers`     | Helper functions                            | `setup.helpers.ts`                          |
| `enums`       | Enum definitions                            | `controllers.enums.ts`                      |

### Domain-Driven Design naming

- **Entities**: Place in `domain/entities/` with types defined in `<entity>.types.ts`.
- **Value Objects**: Place in `domain/value-objects/` with:
  - Types in `<vo>.types.ts`
  - Constants in `<vo>.constants.ts`
- **Repository interfaces**: Place in `domain/repositories/` with:
  - Interface types in `<entity>.repository.types.ts`
  - Injection token in `<entity>.repository.constants.ts`
- **Domain errors**: Place in `domain/errors/` as `<entity>.errors.ts`.
- **Contracts**: Place in `domain/contracts/` as `<entity>.contracts.ts` — define data shapes for modifications/operations.
- **Commands**: Place in `domain/commands/` as `<entity>.commands.ts` — wrap contracts with identifiers.
- **Use cases**: Place each use case in its own folder under `application/use-cases/<use-case-name>/`.

### Tests

- **Unit tests**: Keep next to the source file using `.spec.ts` suffix. Never put unit tests in `tests/unit/` for source files.
- **Mocks**: Place in `tests/unit/utils/mocks/` mirroring the source structure. Name files `<what>.mock.ts`.
- **Faketories**: Place in `tests/shared/utils/faketories/` mirroring the source structure. Name files `<what>.faketory.ts`.

### Folder naming

- Use `kebab-case` for all folder names.
- Use singular nouns for entity folders (e.g., `question-theme/` not `question-themes/`).
- Group related files in descriptive subfolders (e.g., `use-cases/find-all-question-themes/`).

## Where to put a new bounded context / feature (concrete recipe)

### Adding a new bounded context

1. Create directory: `src/contexts/<context-name>/` (use `kebab-case`).
2. Create root module: `src/contexts/<context-name>/<context-name>.module.ts`.
3. Add path alias in configs (swc, typescript, vitest) — e.g., `@<context-name>/*`.
4. Import the context module in `src/app/app.module.ts`.

### Adding a new feature module within a context

1. Create feature directory: `src/contexts/<context>/modules/<feature>/`.
2. Create the following structure:

```
src/contexts/<context>/modules/<feature>/
├── <feature>.module.ts                    # Feature module (wiring)
├── domain/
│   ├── entities/
│   │   └── <feature>.types.ts             # Entity type definition
│   ├── value-objects/                     # (if needed)
│   │   ├── <vo>.constants.ts              # Value object constants
│   │   └── <vo>.types.ts                  # Value object types
│   ├── repositories/
│   │   ├── <feature>.repository.types.ts  # Repository interface
│   │   └── <feature>.repository.constants.ts  # Injection token
│   ├── contracts/                         # (if needed)
│   │   └── <feature>.contracts.ts         # Modification contracts
│   ├── commands/                          # (if needed)
│   │   └── <feature>.commands.ts          # Command types
│   └── errors/
│       ├── <feature>.errors.ts            # Domain error classes
│       └── <feature>.errors.spec.ts       # Error tests
├── application/
│   ├── use-cases/
│   │   └── <action>-<feature>/
│   │       ├── <action>-<feature>.use-case.ts
│   │       └── <action>-<feature>.use-case.spec.ts
│   ├── dto/
│   │   └── <feature>.dto.ts               # Zod-based DTO
│   └── mappers/
│       ├── <feature>.dto.mappers.ts
│       └── <feature>.dto.mappers.spec.ts
└── infrastructure/
    ├── http/
    │   └── controllers/
    │       ├── <feature>/                 # Standard controller
    │       │   ├── <feature>.controller.ts
    │       │   └── <feature>.controller.spec.ts
    │       └── admin-<feature>/           # Admin controller (if needed)
    │           ├── admin-<feature>.controller.ts
    │           └── admin-<feature>.controller.spec.ts
    └── persistence/
        └── mongoose/
            ├── schema/
            │   └── <feature>.mongoose.schema.ts
            ├── repository/
            │   ├── <feature>.mongoose.repository.ts
            │   └── <feature>.mongoose.repository.spec.ts
            ├── mappers/
            │   ├── <feature>.mongoose.mappers.ts
            │   └── <feature>.mongoose.mappers.spec.ts
            ├── types/
            │   └── <feature>.mongoose.types.ts
            └── constants/
                └── <feature>.mongoose.constants.ts
```

3. Wire the module:

- Register Mongoose schema in module imports.
- Register controller.
- Register use cases and repository provider with injection token.

4. Add test utilities:

- Faketory: `tests/shared/utils/faketories/contexts/<context>/<feature>/<feature>.faketory.ts`
- Mocks: `tests/unit/utils/mocks/contexts/<context>/modules/<feature>/`

5. Import the feature module in the context's root module.

## Config and tooling files

- `configs/` holds tool configurations. Each tool has its own subfolder:
  - `configs/commitlint/` — Commitlint configuration for commit message validation.
  - `configs/cucumber/` — Cucumber configuration for acceptance tests.
  - `configs/eslint/` — ESLint flat-configs (stylistic and code-quality rules).
  - `configs/lint-staged/` — Lint-staged configurations for pre-commit hooks.
  - `configs/nest/` — NestJS CLI configuration.
  - `configs/node/` — Node.js configuration.
  - `configs/oxlint/` — Oxlint configuration.
  - `configs/semantic-release/` — Semantic-release configuration for automated releases.
  - `configs/stryker/` — Stryker mutation testing configuration.
  - `configs/swc/` — SWC compiler configuration (paths, decorators).
  - `configs/typescript/` — TypeScript configurations for different purposes (app, spec, acceptance, eslint).
  - `configs/validate-branch-name/` — Branch name validation rules.
  - `configs/vitest/` — Vitest test runner configuration.
- `scripts/` holds helper shell scripts. Name scripts with descriptive verbs (e.g., `create-git-branch.sh`, `create-pull-request.sh`).

## DTO and validation patterns

This project uses **Zod** with **nestjs-zod** for runtime validation and automatic OpenAPI schema generation.

### Creating a DTO

```typescript
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const MY_ENTITY_DTO = z.strictObject({
  id: z.string()
    .regex(/^[\da-f]{24}$/iu)
    .describe("Entity's unique MongoDB ObjectId."),
  name: z.string()
    .describe("Entity's name."),
  status: z.enum([
    "active",
    "archived"
  ])
    .describe("Entity's current status."),
  createdAt: zIsoDateTime()
    .describe("Entity's creation timestamp."),
});

class MyEntityDto extends createZodDto(MY_ENTITY_DTO) {
}

export { MY_ENTITY_DTO, MyEntityDto };
```

### Using DTOs in controllers

```typescript
import { ZodResponse } from "nestjs-zod";
import { HttpStatus } from "@nestjs/common";

@Get() @ZodResponse({
  status: HttpStatus.OK,
  type: [MyEntityDto],
}) public async
findAll()
:
Promise < MyEntityDto[] > {
  // ...
}
```

### Custom Zod validators

The project provides reusable Zod validator helpers in `src/shared/infrastructure/http/validators/zod/`:

#### String validators (`string.zod.validators.ts`)

- `zSlug()` — validates kebab-case slugs (min/max length, regex pattern).
- `zMongoId()` — validates MongoDB ObjectId format using the `validator` library.

Example usage:

```typescript
import { zSlug, zMongoId } from "@shared/infrastructure/http/zod/validators/string/string.zod.validators";

const MY_DTO = z.strictObject({
  id: zMongoId()
    .describe("Unique identifier."),
  slug: zSlug()
    .describe("URL-friendly slug.")
    .meta({ example: "my-entity-slug" }),
});
```

These validators are used consistently across DTOs to ensure validation is uniform and follows project standards.

## Repository pattern

### Defining the repository interface (port)

In `domain/repositories/<entity>.repository.types.ts`:

```typescript
import type { MyEntity } from "@context/modules/feature/domain/entities/my-entity.types";

type MyEntityRepository = {
  findAll: () => Promise<MyEntity[]>; findById: (id: string) => Promise<MyEntity | undefined>; create: (entity: MyEntity) => Promise<MyEntity>; update: (id: string, entity: Partial<MyEntity>) => Promise<MyEntity | undefined>;
};

export type { MyEntityRepository };
```

### Defining the injection token

In `domain/repositories/<entity>.repository.constants.ts`:

```typescript
const MY_ENTITY_REPOSITORY_TOKEN = Symbol("MyEntityRepository");

export { MY_ENTITY_REPOSITORY_TOKEN };
```

It must be defined as a `Symbol` to avoid collisions.

### Implementing the repository (adapter)

In `infrastructure/persistence/mongoose/repository/<entity>.mongoose.repository.ts`:

```typescript
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class MyEntityMongooseRepository implements MyEntityRepository {
  public constructor(@InjectModel(MyEntityMongooseSchema.name) private readonly model: Model<MyEntityMongooseDocument>,) {
  }

  public async findAll(): Promise<MyEntity[]> {
    const documents = await this.model.find();
    return documents.map(mapDocumentToEntity);
  }

  // ...
}
```

### Wiring in the module

```typescript

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MyEntityMongooseSchema.name,
        schema: MY_ENTITY_MONGOOSE_SCHEMA
      },
    ]),
  ],
  providers: [
    MyUseCase,
    {
      provide: MY_ENTITY_REPOSITORY_TOKEN,
      useClass: MyEntityMongooseRepository,
    },
  ],
})
export class MyFeatureModule {
}
```

## Error handling patterns

### Domain errors

Create custom error classes for domain-specific errors:

```typescript
// domain/errors/<entity>.errors.ts
class EntityNotFoundError extends Error {
  public constructor(entityId: string) {
    super(`Entity with id ${entityId} not found`);
    this.name = "EntityNotFoundError";
  }
}

class EntityAlreadyArchivedError extends Error {
  public constructor(entityId: string) {
    super(`Entity with id ${entityId} already has status 'archived'`);
    this.name = "EntityAlreadyArchivedError";
  }
}

export { EntityNotFoundError, EntityAlreadyArchivedError };
```

### Using errors in use cases

```typescript
public async
getById(id
:
string
):
Promise < MyEntity > {
  const entity = await this.repository.findById(id);
  if(!
entity
)
{
  throw new EntityNotFoundError(id);
}
return entity;
}
```

### Global exception filter

The project uses a `GlobalExceptionFilter` in `src/shared/infrastructure/http/filters/global-exception/global-exception.filter.ts` that:

- Catches all exceptions thrown in the application
- Converts domain errors to appropriate HTTP exceptions using a factory map
- Handles `ZodValidationException` and converts it to a structured `BadRequestException` with validation details
- Handles generic `HttpException` instances
- Logs unexpected errors and returns `InternalServerErrorException`

Domain errors must be registered in the `domainErrorHttpExceptionFactories` map to be automatically converted:

```typescript
private static readonly
domainErrorHttpExceptionFactories: Partial<Record<string, (error: Error) => HttpException>> = {
  [EntityNotFoundError.name]: error => new NotFoundException(error.message),
  [EntityAlreadyArchivedError.name]: error => new BadRequestException(error.message),
};
```

This ensures consistent error responses and proper HTTP status codes without cluttering domain or application layers with HTTP concerns.

## General rules and small reminders

- Prefer path aliases (e.g., `@app`, `@shared`, `@question`, `@faketories`) when importing across the project to keep imports stable across builds and tests.
- Follow Hexagonal Architecture: domain logic must not depend on infrastructure. Use repository interfaces (ports) in domain/application layers.
- Keep controllers thin: business logic belongs in use cases/services.
- Use dependency injection with tokens for repository implementations.
- Tests must be added/updated alongside behavioral changes. Use `.spec.ts` naming and follow existing faketory/mock helpers.
- File and folder names should be consistent and predictable — prefer `kebab-case` for folders and the `<name>.<type>.ts` pattern for files.
- Use Zod for all DTO validation; leverage `nestjs-zod` for automatic OpenAPI schema generation.

## Examples

### New bounded context "user"

```
src/contexts/user/
├── user.module.ts
└── modules/
    └── user/
        ├── user.module.ts
        ├── domain/
        │   ├── entities/user.types.ts
        │   ├── repositories/
        │   │   ├── user.repository.types.ts
        │   │   └── user.repository.constants.ts
        │   └── errors/user.errors.ts
        ├── application/
        │   ├── use-cases/
        │   │   ├── create-user/
        │   │   │   ├── create-user.use-case.ts
        │   │   │   └── create-user.use-case.spec.ts
        │   │   └── find-user-by-id/
        │   │       ├── find-user-by-id.use-case.ts
        │   │       └── find-user-by-id.use-case.spec.ts
        │   ├── dto/user.dto.ts
        │   └── mappers/user.dto.mappers.ts
        └── infrastructure/
            ├── http/controllers/
            │   ├── user.controller.ts
            │   └── user.controller.spec.ts
            └── persistence/mongoose/
                ├── schema/user.mongoose.schema.ts
                └── repository/
                    ├── user.mongoose.repository.ts
                    └── user.mongoose.repository.spec.ts
```

### Shared utility

```
src/shared/infrastructure/http/pipes/validation/
├── validation.pipe.ts
└── validation.pipe.spec.ts
```

### Test utilities for a new feature

```
tests/shared/utils/faketories/contexts/user/
└── user.faketory.ts

tests/unit/utils/mocks/contexts/user/modules/user/
├── application/use-cases/
│   └── create-user.use-case.mock.ts
└── infrastructure/persistence/mongoose/
    └── user.mongoose.types.mock.ts
```

Agent rule-of-thumb: If you're unsure where to place a file:

- Feature-specific domain/application/infrastructure code → `src/contexts/<context>/modules/<feature>/`
- Cross-cutting utilities → `src/shared/<layer>/`
- Configuration files → `configs/<tool>/`
- Test factories (faketories) → `tests/shared/utils/faketories/`
- Test mocks → `tests/unit/utils/mocks/`

## Common scripts

From `package.json` (standard usage):

### Setup / lifecycle

- `pnpm install` — install dependencies (pnpm is the expected package manager).
- `pnpm run prepare` — runs post-install script (Husky setup).

### Development / runtime

- `pnpm run start` — run the app (uses Nest start with SWC builder as configured).
- `pnpm run start:dev` — start in watch mode (hot reload).
- `pnpm run start:debug` — start in debug mode with watch.
- `pnpm run start:prod` — run the built `dist/main.js` in production mode.
- `pnpm run start:prod:test` — run the built app in test mode (used by acceptance tests).

### Build / typecheck

- `pnpm run build` — run `nest build` with `configs/nest/nest-cli.config.json` (swc builder).
- `pnpm run typecheck` — run `tsgo -b --clean && tsgo -b --noEmit` (uses native TypeScript preview).

### Linting

- `pnpm run lint` — run both Oxlint and ESLint checks (Oxlint first, then ESLint).
- `pnpm run lint:fix` — fix lint issues with both linters where possible.
- `pnpm run lint:eslint` — run only ESLint.
- `pnpm run lint:eslint:fix` — run ESLint with auto-fix.
- `pnpm run lint:eslint:inspect-config` — inspect ESLint config with config inspector.
- `pnpm run lint:oxlint` — run only Oxlint.
- `pnpm run lint:oxlint:fix` — run Oxlint with auto-fix.
- `pnpm run lint:staged:fix` — run linters on staged files only (used by pre-commit hook).

### Tests

- `pnpm run test` — run full test suite: unit tests with coverage, mutation tests and acceptance tests.
- `pnpm run test:unit` — run unit tests using Vitest.
- `pnpm run test:unit:cov` — run unit tests with the coverage report. Fails if `100%` threshold is not met.
- `pnpm run test:unit:watch` — watch mode for unit tests.
- `pnpm run test:unit:staged` — run unit tests for staged files only.

### Mutation testing (expensive / CI)

- `pnpm run test:mutation` — run Stryker with incremental mode (reuses previous results).
- `pnpm run test:mutation:force` — run Stryker from scratch (clears incremental cache).
- `pnpm run test:mutation:ci` — CI-oriented mutation run with CI-specific config.

### Acceptance tests

- `pnpm run test:acceptance` — run Cucumber acceptance tests (builds app first, then runs tests).
- `pnpm run test:acceptance:skip-build` — run acceptance tests without rebuilding (use when app is already built).
- `pnpm run test:cucumber:html-report` — generate the HTML report from Cucumber results.

### Docker

- `pnpm run docker:build` — build a Docker image named `goat-it-api`.
- `pnpm run docker:build:linux/amd64` — build a Linux AMD64 image.
- `pnpm run docker:build:linux/arm64` — build a Linux ARM64 image.
- `pnpm run docker:acceptance-tests:start` — start Docker containers for acceptance tests (MongoDB).
- `pnpm run docker:acceptance-tests:stop` — stop acceptance test containers.
- `pnpm run docker:acceptance-tests:reset` — restart acceptance test containers.

### Utility scripts

- `pnpm run script:create-branch` — interactive script to create a properly named git branch.
- `pnpm run script:create-pull-request` — script to create a pull request.
- `pnpm run script:create-release-changelog` — script to create release changelog.
- `pnpm run validate:branch-name` — validate current branch name against naming rules.

## Unit Testing conventions

Quick summary for unit tests — the full, authoritative guide lives at `tests/unit/README.md`. Read that file before writing or completing any unit test.

- Runner: Vitest (config: `configs/vitest/vitest.config.ts`).
- Test files: colocated with source under `src/` as `*.spec.ts`.
- Coverage: V8 provider, `100%` thresholds enforced (`pnpm run test:unit:cov`). Exclusions are defined in `configs/vitest/vitest.config.ts`.
- Test helpers: global setup/mocks at `tests/unit/setup/mocks.setup.ts`; mocks and faketories live in `tests/unit/utils/mocks/` and `tests/shared/utils/faketories/`.
- Short rules (refer to `tests/unit/README.md` for details): one assertion per `it`, use faketories and mock factories, prefer `it.each` for parametrized cases, and assert exact error classes when expecting throws.

If you need examples, templates or per-file-type rules (controllers, use-cases, repositories, DTOs, helpers), consult `tests/unit/README.md` — it is the source of truth.

## Mutation testing (Stryker)

- Stryker config located at `configs/stryker/stryker.config.mjs`. It runs Vitest as the test runner and uses TypeScript checker.
- The repo is configured for incremental mutation runs via `tests/mutation/incremental/incremental.json` — be careful when running mutation tests locally (they can be slow and CPU intensive).
- Important: to help CI reuse already-created mutants and keep CI runs fast, run mutation testing locally from time to time (for example, before large PRs, before releases, or at least monthly for active modules) and commit any updates to `tests/mutation/incremental/incremental.json`.
  - Run locally with: `pnpm run test:mutation` (this may take considerable time and CPU).
  - If the local run updates files under `tests/mutation/incremental/`, review and commit the updated `incremental.json` so CI can leverage the up-to-date incremental state.
  - Prefer running these heavy jobs on a developer workstation.
  - If running locally is infeasible, open an issue requesting a maintainer to run the incremental mutation update and attach the produced `incremental.json`.
- Note: do not bypass quality gates — updated incremental files should be produced by an honest Stryker run and included in a PR that also includes the reason (what changed) in the PR body.

## Acceptance tests

This project includes a full acceptance (end-to-end) test ecosystem powered by Cucumber (Gherkin) and a small set of TypeScript helpers that build, start and exercise the real application binary with a real MongoDB test database.

### High-level contract / quick commands

Run the acceptance suite locally:

```bash
# Full run (builds app, starts DB, runs tests)
pnpm run test:acceptance

# Skip build (use when app is already built and sources haven't changed since)
pnpm run test:acceptance:skip-build
```

This command runs `cucumber-js` with `configs/cucumber/cucumber.json`, then generates an HTML report via `pnpm run test:cucumber:html-report`.

### What the acceptance runner does

1. **Before all scenarios** (`BeforeAll` hook):

- Loads test environment configuration from `.env.test`.
- Builds the project by calling `pnpm run build` (unless `SKIP_BUILD=true`).
- Connects to the test MongoDB database.
- Starts a real instance of the built app using `pnpm run start:prod:test`.

2. **Before each scenario** (`Before` hook):

- Resets the test database (clears all collections).
- Provides the app process handle to the test world.

3. **After all scenarios** (`AfterAll` hook):

- Closes the database connection.
- Gracefully stops the app process (sends `SIGTERM`, then `SIGKILL` if needed).

### Test database

Acceptance tests use a real MongoDB instance. The database connection is configured via environment variables in `.env.test`:

- `DATABASE_HOST` — MongoDB host (e.g., `localhost`)
- `DATABASE_PORT` — MongoDB port (e.g., `27017`)
- `DATABASE_NAME` — Test database name

To start the test database locally using Docker:

```bash
pnpm run docker:acceptance-tests:start
```

To stop the test database:

```bash
pnpm run docker:acceptance-tests:stop
```

### Key paths and files

- **Feature files**: `tests/acceptance/features/`
  - Holds `.feature` files written in Gherkin.
  - Organized by context: `tests/acceptance/features/contexts/<context>/<feature>/`.
  - App-level features: `tests/acceptance/features/app/`.
- **Step definitions**: `tests/acceptance/features/step-definitions/`
  - Naming convention: `*.given-steps.ts`, `*.when-steps.ts`, `*.then-steps.ts`.
  - Shared steps: `tests/acceptance/features/step-definitions/shared/`.
- **Support files**: `tests/acceptance/support/`
  - `hooks.ts` — lifecycle hooks (`BeforeAll`, `Before`, `AfterAll`).
  - `helpers/` — setup helpers, database helpers.
  - `constants/` — shared constants (base URL, timeouts).
  - `types/` — TypeScript types and `GoatItWorld` definition.
  - `fixtures/` — test fixtures.
- **Reports**: `tests/acceptance/reports/`
  - `report.json`, `message.json`, `junit.xml` — Cucumber outputs.
  - `index.html` — generated HTML report.

### GoatItWorld

The custom `GoatItWorld` class exposes convenience methods used by step definitions:

- `fetchAndStoreResponse(path)` — performs HTTP GET and stores response.
- `expectLastResponseJson<T>(schema)` — validates response against Zod schema.
- `appProcess` — handle to the running app process.

### Writing features and step definitions

#### Features

```gherkin
@question @question-theme
Feature: 🏷️ List Question Themes

  Scenario: 🎉 Client requests all question themes
    Given the client requests all question themes
    Then the response status code should be 200
    And the response body should be a list of question themes
```

Conventions:

- Use descriptive tags for grouping (`@context`, `@feature`).
- Keep scenarios focused and idempotent.
- Use `Given-When-Then` structure.
- Use "the client" as the actor for HTTP calls.

#### Step definitions

```typescript
// given-steps.ts
import { Given } from "@cucumber/cucumber";

Given("the client requests all question themes", async function (this: GoatItWorld) {
  await this.fetchAndStoreResponse("/question-themes");
});

// then-steps.ts
import { Then } from "@cucumber/cucumber";
import { expect } from "expect";

Then("the response status code should be {int}", function (this: GoatItWorld, statusCode: number) {
  expect(this.lastResponse?.status).toBe(statusCode);
});
```

### Database fixtures

For tests that require pre-populated data, use fixtures:

```typescript
// tests/acceptance/support/fixtures/question-theme.fixtures.ts
import { createFakeQuestionTheme } from "@faketories/contexts/question/question-theme/entity/question-theme.entity.faketory";

async function seedQuestionThemes(count: number) {
  const themes = Array.from({ length: count }, () => createFakeQuestionTheme());
  // Insert into test database...
  return themes;
}
```

### Best practices for acceptance tests

- Add unit tests first and ensure `pnpm run test:unit:cov` passes before touching acceptance features.
- Keep feature files and step definitions deterministic.
- Always reset the database before each scenario (handled by `Before` hook).
- If you modify server startup logs, update the acceptance readiness matcher.
- Write scenarios for every new public API endpoint.
- Include negative/error case scenarios (404, 400, validation errors).

### Troubleshooting

- **Build failures**: Check `pnpm run build` output. Fix compile errors before running acceptance tests.
- **Server never ready**: Check `tests/acceptance/support/helpers/setup.helpers.ts` for readiness string; review `src/infrastructure/api/server/server.ts` startup logs.
- **Database connection fails**: Ensure test database is running (`pnpm run docker:acceptance-tests:start`).
- **Missing HTML report**: Ensure `tests/acceptance/reports/report.json` exists.

## Linting, commits and release automation

### Linting

- `pnpm run lint` runs both Oxlint (first) and ESLint checks.
- **Oxlint**: Fast linter configured under `configs/oxlint/oxlint.config.jsonc`. Use `pnpm run lint:oxlint` or `pnpm run lint:oxlint:fix`.
- **ESLint**: Full-featured linter using flat-config under `configs/eslint/`. Use `pnpm run lint:eslint` or `pnpm run lint:eslint:fix`.
- When dealing with lint issues, run the appropriate `:fix` command to auto-fix where possible.
- ESLint uses the stylistic plugin for formatting/style rules — no separate formatter (like Prettier) is used.
- Agents must consult and follow `configs/eslint/flat-configs/` when adding or modifying code.
- Agents should avoid disabling lint rules unless absolutely necessary; if a rule must be disabled, document the reason in code comments.

### Commit messages

- Validated by `commitlint` (config under `configs/commitlint/.commitlintrc.json`).
- Must follow Conventional Commits format: `<type>(<scope>): <description>`
- Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `perf`, `build`, `ci`, `chore`, `revert`
- Husky pre-commit hooks enforce commit message validation.

### Pre-commit hooks (Husky)

Located in `.husky/`:

- `commit-msg` — validates commit messages with commitlint.
- `pre-commit` — validates branch name and runs lint/tests on staged files.

Pre-commit runs:

1. `pnpm run validate:branch-name` — ensure branch follows naming rules.
2. `pnpm run lint:staged:fix` — lint and fix staged files.
3. `pnpm run test:unit:staged` — run unit tests for staged files.

### Branch naming

- Must match pattern: `^(feat|fix|docs|style|refactor|test|perf|build|ci|chore|revert)/.+$`
- Examples: `feat/add-user-endpoint`, `fix/validation-error`, `docs/update-readme`
- Validate with: `pnpm run validate:branch-name`

### Release automation

- Automated by `semantic-release` using `configs/semantic-release/release.config.mjs`.
- Version is automatically determined from commit messages.
- CHANGELOG is auto-generated.

## CI/CD Workflows

Located in `.github/workflows/`:

### Build workflow (`build.yml`)

Runs on pull requests to `main` and `develop`:

1. **CodeQL Scan** — security analysis
2. **Lint GitHub Workflows** — validate workflow files
3. **Install** — install dependencies
4. **Docker Builds** — build Docker images for `linux/amd64` and `linux/arm64`
5. **Build App** — compile the application
6. **Lint Codebase** — run ESLint and Oxlint
7. **Unit Tests** — run Vitest with coverage
8. **Mutation Tests** — run Stryker mutation testing
9. **Acceptance Tests** — run Cucumber tests
10. **SonarCloud Analysis** — code quality analysis

### Other workflows

- `deploy-to-production.yml` — deploy to production
- `deploy-to-staging.yml` — deploy to staging
- `docker-build-and-push.yml` — build and push Docker images
- `lint-pr-name-into-develop.yml` — validate PR titles
- `protect-main-branch.yml` — protect main branch
- `release-creation.yml` — create releases
- `upsert-pr-release.yml` — manage release PRs

## Docker

### Building images

- `pnpm run docker:build` — build image named `goat-it-api`.
- `pnpm run docker:build:linux/amd64` — build for Linux AMD64.
- `pnpm run docker:build:linux/arm64` — build for Linux ARM64.

### Acceptance test containers

```bash
# Start MongoDB for acceptance tests
pnpm run docker:acceptance-tests:start

# Stop containers
pnpm run docker:acceptance-tests:stop

# Reset (stop then start)
pnpm run docker:acceptance-tests:reset
```

Docker Compose file: `docker/goat-it-api-acceptance-tests/docker-compose.yml`

## Development workflow for an agent (checklist)

See the consolidated "Agent guidelines" section above for the full, authoritative guidance on agent behavior, checks and rules.

## Agent developer contract (inputs / outputs / error modes)

See the consolidated "Agent guidelines" section above for the full, authoritative guidance on agent behavior, checks and rules.

## Agent editing rules and best practices

See the consolidated "Agent guidelines" section above for the full, authoritative guidance on agent behavior, checks and rules.

## Agent testing and validation procedure (automated)

See the consolidated "Agent guidelines" section above for the full, authoritative guidance on agent behavior, checks and rules.

## Security and sensitive data

- Do not add private keys, credentials or secrets into the repository.
- If secret config is needed, reference environment variables and document them in a secure place (not in repo). An agent must never create commits containing secrets.

## Conventions and coding style

### TypeScript

- Follow TypeScript strictness (strict mode enabled).
- Use `type` keyword for type definitions (not `interface` for simple types).
- Prefer `const` assertions where appropriate.
- Use path aliases for imports.

### NestJS conventions

- Use NestJS decorators for dependency injection (`@Injectable`, `@Controller`, `@Module`, etc.).
- Controllers should be thin — delegate business logic to use cases/services.
- Use custom decorators for cross-cutting concerns (e.g., `@Localization()` for i18n).
- Use pipes for validation (e.g., `MongoIdPipe` for MongoDB ObjectId validation).
- Use middlewares for request-level concerns (e.g., `LocalizationMiddleware`).

### Architecture conventions

- **Hexagonal Architecture**: Domain must not depend on infrastructure.
- **Repository pattern**: Define interfaces in domain, implement in infrastructure.
- **Use cases**: One use case per business operation, named as verb-noun (e.g., `FindAllQuestionThemesUseCase`).
- **DTOs**: Use Zod schemas with `nestjs-zod` for validation and OpenAPI generation.
- **Mappers**: Create explicit mapper functions for entity-to-DTO and document-to-entity transformations.

### Testing conventions

- Unit tests are colocated with source files (`*.spec.ts`).
- Use faketories for test data generation.
- Use mocks for dependencies.
- Aim for 100% code coverage.
- Test edge cases and error conditions.

### Code style

- Linting and formatting enforced by ESLint and Oxlint.
- Agents must refer to `configs/eslint` and `configs/oxlint` for authoritative rule definitions.
- Ensure the code adheres to these configurations before opening a PR.

## Examples of small tasks an agent may be asked to do

### Feature development

- Add a new GET endpoint that returns computed data: create use case + controller + tests.
- Add a new POST endpoint with validation: create DTO + use case + controller + tests.
- Add a new bounded context with CRUD operations.

### Bug fixes

- Fix a failing unit test and add a regression test.
- Fix validation error handling in a controller.

### Testing

- Improve code coverage for a module by adding tests.
- Add acceptance tests for an existing endpoint.

### Refactoring

- Refactor a service to use the repository pattern.
- Extract shared logic into a utility function.

### Documentation

- Update API documentation (OpenAPI schemas via Zod DTOs).
- Update AGENTS.md with new conventions.

### Maintenance

- Update dependency versions and fix any type errors.
- Add missing error handling for edge cases.

## What an agent must do before committing any change

### Mandatory checks

1. **Lint**: `pnpm run lint` — fix all warnings and errors.
2. **Type check**: `pnpm run typecheck` — ensure no type errors.
3. **Unit tests with coverage**: `pnpm run test:unit:cov` — must pass with 100% coverage.
4. **Tests for changes**: Add or update unit tests for any changed/added behavior.
5. **Path aliases**: Ensure all imports use path aliases and remain valid.

### Recommended checks (before opening PR)

- `pnpm run test:mutation` — run mutation tests to ensure test quality.
- `pnpm run test:acceptance` — run acceptance tests for API changes.
- `pnpm run validate:branch-name` — ensure branch follows naming conventions.

### Quality gates summary

| Check            | Command                    | Required                        |
|------------------|----------------------------|---------------------------------|
| Linting          | `pnpm run lint`            | ✅ Yes                           |
| Type checking    | `pnpm run typecheck`       | ✅ Yes                           |
| Unit tests       | `pnpm run test:unit:cov`   | ✅ Yes (100% coverage)           |
| Mutation tests   | `pnpm run test:mutation`   | ⚠️ CI (but recommended locally) |
| Acceptance tests | `pnpm run test:acceptance` | ✅ Yes                           |

## API Design and REST conventions

This section documents the actual REST API patterns and conventions used in the codebase.

### Controller organization

- **Public controllers**: Located at `src/contexts/<context>/infrastructure/http/controllers/<feature>/`
  - Use `@GameAuth()` decorator for game client authentication
  - Endpoint prefix: `/<feature-name>` (e.g., `/question-themes`)
- **Admin controllers**: Located at `src/contexts/<context>/infrastructure/http/controllers/admin-<feature>/`
  - Use `@AdminAuth()` decorator for administrative authentication
  - Endpoint prefix: `/admin/<feature-name>` (e.g., `/admin/question-themes`)

Example from codebase:
```typescript
// Public controller
@GameAuth()
@Controller(ControllerPrefixes.QUESTION_THEMES)
export class QuestionThemeController { ... }

// Admin controller
@AdminAuth()
@Controller(`${ControllerPrefixes.ADMIN}/${ControllerPrefixes.QUESTION_THEMES}`)
export class AdminQuestionThemeController { ... }
```

### HTTP method conventions

The project follows RESTful conventions:

- `GET /<resource>` — List all resources
- `GET /<resource>/:id` — Get a single resource by ID
- `POST /<resource>` — Create a new resource
- `PATCH /<resource>/:id` — Update a resource
- `POST /<resource>/:id/<action>` — Perform a specific action (e.g., `/question-themes/:id/archive`)

### Response documentation

All endpoints must use:
- `@ApiOperation()` — Swagger documentation with tags, summary, description
- `@ZodResponse()` — Response schema with HTTP status code

Example:
```typescript
@Get()
@ApiOperation({
  tags: [SwaggerTags.QUESTION_THEMES],
  summary: "Get all question themes",
  description: "Returns a list of all active question themes.",
})
@ZodResponse({
  status: HttpStatus.OK,
  type: [QuestionThemeDto],
})
public async findAll(): Promise<QuestionThemeDto[]> { ... }
```

### Path parameter validation

Use `MongoIdPipe` for MongoDB ObjectId validation in path parameters:
```typescript
public async findById(@Param("id", MongoIdPipe) id: string): Promise<QuestionThemeDto> { ... }
```

### Controller responsibilities

Controllers must:
- Validate inputs (automatic via Zod DTOs)
- Call use cases with domain commands
- Map entities to DTOs before returning
- **Never** contain business logic
- **Never** directly access repositories

Example pattern:
```typescript
public async create(@Body() dto: QuestionThemeCreationDto): Promise<QuestionThemeDto> {
  // 1. Map DTO to domain command
  const command = createQuestionThemeCreationCommandFromDto(dto);
  
  // 2. Call use case
  const entity = await this.createUseCase.create(command);
  
  // 3. Map entity to DTO
  return createQuestionThemeDtoFromEntity(entity);
}
```

## Authentication and Security Patterns

This section documents the actual security implementation in the codebase.

### API Key Authentication

The project uses a **two-tier API key system** with HMAC-SHA256 hashing:

1. **Game API Key** — For regular game clients
2. **Admin API Key** — For administrative operations

### Security implementation details

**HMAC-SHA256 hashing with timing-safe comparison**:
```typescript
// Hash API key using HMAC-SHA256
function hashApiKey(apiKey: string, hmacKey: string): string {
  return createHmac("sha256", hmacKey)
    .update(apiKey)
    .digest("hex");
}

// Timing-safe comparison prevents timing attacks
const areKeysMatching = timingSafeEqual(expectedBuffer, receivedBuffer);
```

Location: `src/infrastructure/api/auth/helpers/auth.helpers.ts`

### API key configuration

API keys are configured via environment variables:
- `ADMIN_API_KEY` — Admin API key (minimum 24 characters)
- `GAME_API_KEY` — Game API key (minimum 24 characters)
- `API_KEY_HMAC_SECRET` — HMAC secret for hashing

Keys are validated and hashed at application startup in `AppConfigService`.

### Authentication guards

Two guards implement API key validation:
- `AdminApiKeyGuard` — For admin endpoints
- `GameApiKeyGuard` — For game endpoints

Both guards:
1. Extract API key from `goat-it-api-key` header
2. Validate using timing-safe comparison
3. Throw `UnauthorizedException` on failure

### Applying authentication

Use decorators at controller class level:
```typescript
@AdminAuth()  // For admin endpoints
@Controller(`${ControllerPrefixes.ADMIN}/${ControllerPrefixes.QUESTION_THEMES}`)
export class AdminQuestionThemeController { ... }

@GameAuth()  // For game endpoints
@Controller(ControllerPrefixes.QUESTIONS)
export class QuestionController { ... }
```

### Security best practices followed

✅ **Timing-safe comparison** — Prevents timing attacks  
✅ **HMAC-SHA256** — Industry-standard hashing for API keys  
✅ **Minimum key length** — 24 characters enforced  
✅ **Separation of concerns** — Game vs Admin API keys  
✅ **Environment-based configuration** — No hardcoded secrets  

### What NOT to do (security anti-patterns)

❌ **Never** compare API keys using `===` (vulnerable to timing attacks)  
❌ **Never** store plaintext API keys in code or configs  
❌ **Never** use simple hashing (MD5, SHA1) for API keys  
❌ **Never** skip validation for "development" environments  
❌ **Never** log API keys (even hashed)  

## Dependency Injection and Provider Patterns

### Repository injection pattern

The project uses **Symbol-based injection tokens** to avoid collisions:

```typescript
// 1. Define injection token (domain/repositories/*.repository.constants.ts)
export const QUESTION_THEME_REPOSITORY_TOKEN = Symbol("QuestionThemeRepository");

// 2. Inject in use case
@Injectable()
export class CreateQuestionThemeUseCase {
  public constructor(
    @Inject(QUESTION_THEME_REPOSITORY_TOKEN)
    private readonly questionThemeRepository: QuestionThemeRepository
  ) {}
}

// 3. Provide in module
@Module({
  providers: [
    CreateQuestionThemeUseCase,
    {
      provide: QUESTION_THEME_REPOSITORY_TOKEN,
      useClass: QuestionThemeMongooseRepository,
    },
  ],
})
export class QuestionThemeModule {}
```

### Use case dependency injection

Use cases are injected directly without tokens (NestJS handles class tokens automatically):
```typescript
@Controller(ControllerPrefixes.QUESTION_THEMES)
export class QuestionThemeController {
  public constructor(
    private readonly findAllQuestionThemesUseCase: FindAllQuestionThemesUseCase,
    private readonly findQuestionThemeByIdUseCase: FindQuestionThemeByIdUseCase,
  ) {}
}
```

### Service vs Use Case naming

- **Use cases**: Domain-specific operations (e.g., `CreateQuestionThemeUseCase`)
- **Services**: Infrastructure concerns (e.g., `AppConfigService`, `DatabaseService`)

### Injection token rules

**MUST use Symbol tokens for**:
- Repository interfaces (prevents naming collisions)
- Any interface-based injection

**CAN use class tokens for**:
- Use cases
- Services
- Any concrete class

## Import and Export Conventions

### Import order (enforced by ESLint)

The project enforces a specific import order:

1. Node.js built-in modules (e.g., `node:crypto`, `node:path`)
2. External dependencies (e.g., `@nestjs/common`, `mongoose`)
3. Internal path aliases (e.g., `@question/*`, `@shared/*`)
4. Type-only imports (grouped separately)

Example:
```typescript
import { timingSafeEqual, createHmac } from "node:crypto";

import { UnauthorizedException } from "@nestjs/common";
import { Model } from "mongoose";

import { API_KEY_HEADER } from "@src/infrastructure/api/auth/constants/auth.constants";
import { QuestionTheme } from "@question/modules/question-theme/domain/entities/question-theme.types";

import type { ExecutionContext } from "@nestjs/common";
import type { AppConfigService } from "@src/infrastructure/api/config/providers/services/app-config.service";
```

### Export conventions

**Named exports only** (no default exports):
```typescript
// ✅ Correct
export class CreateQuestionThemeUseCase { ... }
export { QUESTION_THEME_REPOSITORY_TOKEN };

// ❌ Incorrect
export default CreateQuestionThemeUseCase;
```

### Path alias usage

**Always use path aliases** instead of relative imports:
```typescript
// ✅ Correct
import { QuestionTheme } from "@question/modules/question-theme/domain/entities/question-theme.types";

// ❌ Incorrect
import { QuestionTheme } from "../../../domain/entities/question-theme.types";
```

### Type-only imports

Use `import type` for types to improve tree-shaking:
```typescript
import type { QuestionTheme } from "@question/modules/question-theme/domain/entities/question-theme.types";
import type { QuestionThemeRepository } from "@question/modules/question-theme/domain/repositories/question-theme.repository.types";
```

## Performance and Scalability Considerations

### Database query optimization

**Aggregation pipelines** for complex queries:
```typescript
// Example: Question repository uses aggregation for efficient filtering
export const QUESTION_MONGOOSE_REPOSITORY_PIPELINE = [
  { $match: { status: "active" } },
  { $lookup: { from: "questionthemes", localField: "themeId", foreignField: "_id", as: "theme" } },
  { $unwind: "$theme" },
];
```

Location: `src/contexts/question/infrastructure/persistence/mongoose/repository/pipelines/question.mongoose.repository.pipeline.ts`

### Lazy DTO mapping

DTOs are mapped **only when needed** (in controllers, not in repositories):
```typescript
// ✅ Correct: Repository returns domain entities
public async findAll(): Promise<QuestionTheme[]> {
  const documents = await this.model.find();
  return documents.map(mapDocumentToEntity);
}

// ✅ Correct: Controller maps entities to DTOs
public async findAll(): Promise<QuestionThemeDto[]> {
  const themes = await this.findAllUseCase.list();
  return themes.map(theme => createQuestionThemeDtoFromEntity(theme));
}
```

### Async/Await consistency

All repository operations and use cases use `async/await` consistently:
- No callback-based APIs
- Promises properly awaited
- Errors naturally propagate to global exception filter

### Localization caching

Locale is extracted once per request via middleware:
```typescript
// LocalizationMiddleware processes locale from Accept-Language header
// Stores in request object for reuse
request.localization = { locale, languageCode, countryCode };
```

### What NOT to do (performance anti-patterns)

❌ **Never** perform N+1 queries (use aggregation or populate)  
❌ **Never** map to DTOs in repositories  
❌ **Never** perform synchronous operations in request handlers  
❌ **Never** block the event loop with heavy computations  

## Testing Anti-Patterns to Avoid

Based on the codebase analysis, the following testing anti-patterns have been identified:

### Multiple assertions per test

**Rule**: Each test should contain **one and only one assertion**. If you need multiple assertions, create multiple tests.

```typescript
// ❌ Incorrect: Multiple assertions
it("should create and return question theme.", async() => {
  const result = await useCase.create(command);
  expect(result).toBeDefined();
  expect(result.slug).toBe(command.payload.slug);
  expect(result.status).toBe("active");
});

// ✅ Correct: Single assertion per test
it("should create question theme when called.", async() => {
  await useCase.create(command);
  
  expect(mocks.repositories.questionTheme.create).toHaveBeenCalledExactlyOnceWith(command.payload);
});

it("should return created question theme when called.", async() => {
  const expected = createFakeQuestionTheme();
  mocks.repositories.questionTheme.create.mockResolvedValueOnce(expected);
  
  const result = await useCase.create(command);
  
  expect(result).toStrictEqual(expected);
});
```

### Test naming conventions

Test labels must follow the pattern: `"should <expected behavior> when <condition>."`

```typescript
// ✅ Correct
it("should throw error when question theme slug already exists.", async() => { ... });
it("should create question theme when called.", async() => { ... });
it("should return all active question themes when called.", async() => { ... });

// ❌ Incorrect
it("tests the create method", async() => { ... });
it("should work correctly", async() => { ... });
```

### Mock setup anti-patterns

❌ **Never** mock the system under test  
❌ **Never** share mocks between test suites  
❌ **Never** forget to reset mocks (handled automatically by Vitest config)  
❌ **Never** use real services in unit tests  

## Code Quality and Style Enforcement

### Linting strategy

The project uses **two linters** for comprehensive checking:

1. **Oxlint** — Fast, performance-focused linter (runs first)
2. **ESLint** — Full-featured linter with custom rules

Run order: `pnpm run lint` → runs Oxlint first, then ESLint

### ESLint configuration structure

ESLint uses **flat-config** with modular rule files:
- `configs/eslint/flat-configs/eslint-global.flat-config.ts` — Global rules
- `configs/eslint/flat-configs/eslint-typescript.flat-config.ts` — TypeScript rules
- `configs/eslint/flat-configs/eslint-stylistic.flat-config.ts` — Formatting rules
- `configs/eslint/flat-configs/eslint-controllers.flat-config.ts` — Controller-specific rules
- `configs/eslint/flat-configs/eslint-unit-tests.flat-config.ts` — Test-specific rules

### Formatting approach

**No Prettier** — ESLint's stylistic plugin handles formatting:
- Indentation: 2 spaces
- Quotes: Double quotes
- Semicolons: Required
- Trailing commas: Multi-line only

### Type checking

The project uses **tsgo** (native TypeScript preview) instead of standard `tsc`:
```bash
pnpm run typecheck  # Runs: tsgo -b --clean && tsgo -b --noEmit
```

### Coverage requirements

**100% coverage enforced** for:
- Statements
- Branches
- Functions
- Lines

Excluded from coverage:
- `*.module.ts` — NestJS modules (wiring only)
- `*.schema.ts` — Mongoose schemas
- `*.constants.ts` — Constant definitions
- `*.types.ts` — Type definitions
- `*.contracts.ts` — Contract type definitions
- `*.commands.ts` — Command type definitions
- `*.pipeline.ts` — MongoDB aggregation pipelines

### When to disable rules

Only disable lint rules when:
1. There's a legitimate technical reason (document with comment)
2. TypeScript limitations require it (e.g., type assertions)
3. Generated code that can't be changed

```typescript
// ✅ Acceptable: Legitimate type assertion with explanation
// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
const swcJsc = SwcConfig.jsc as unknown as JscConfig;

// ❌ Unacceptable: Disabling without reason
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data: any = fetchData();
```

## Common Pitfalls and Anti-Patterns to Avoid

### Domain layer violations

❌ **Never** import infrastructure code in domain layer  
❌ **Never** throw HTTP exceptions in domain (use domain errors)  
❌ **Never** use NestJS decorators in domain layer  

```typescript
// ❌ Incorrect: Domain depends on infrastructure
import { NotFoundException } from "@nestjs/common";
throw new NotFoundException("Theme not found");

// ✅ Correct: Domain uses domain errors
export class QuestionThemeNotFoundError extends Error {
  public name = "QuestionThemeNotFoundError";
  public constructor(themeId: string) {
    super(`Question theme with id ${themeId} not found`);
  }
}
throw new QuestionThemeNotFoundError(id);
```

### Repository pattern violations

❌ **Never** call repositories directly from controllers  
❌ **Never** return DTOs from repositories (return entities)  
❌ **Never** perform business logic in repositories  

```typescript
// ❌ Incorrect: Controller calls repository directly
@Controller(ControllerPrefixes.QUESTION_THEMES)
export class QuestionThemeController {
  public constructor(
    @Inject(QUESTION_THEME_REPOSITORY_TOKEN)
    private readonly repository: QuestionThemeRepository
  ) {}
  
  public async findAll() {
    return this.repository.findAll();  // ❌ Bypasses use case
  }
}

// ✅ Correct: Controller calls use case
public constructor(
  private readonly findAllUseCase: FindAllQuestionThemesUseCase
) {}

public async findAll() {
  return this.findAllUseCase.list();  // ✅ Uses use case
}
```

### Use case anti-patterns

❌ **Never** inject controllers into use cases  
❌ **Never** inject HTTP-related services into use cases  
❌ **Never** handle HTTP concerns (status codes, headers) in use cases  

### DTO and validation anti-patterns

❌ **Never** use Zod schemas without `z.strictObject()` (allows extra properties)  
❌ **Never** skip `.describe()` for DTO properties (needed for OpenAPI)  
❌ **Never** forget `.meta({ example })` for better API documentation  

```typescript
// ❌ Incorrect: Missing strict validation
const MY_DTO = z.object({  // Allows extra properties
  id: z.string(),
});

// ✅ Correct: Strict validation
const MY_DTO = z.strictObject({
  id: zMongoId()
    .describe("Unique identifier")
    .meta({ example: "60af924f4f1a2563f8e8b456" }),
});
```

### Module organization anti-patterns

❌ **Never** create circular dependencies between modules  
❌ **Never** expose implementation details in module exports  
❌ **Never** import from `src/contexts/<other-context>` (contexts should be independent)  

### Test anti-patterns summary

❌ **Never** test private methods directly  
❌ **Never** use real database in unit tests  
❌ **Never** share test state between tests  
❌ **Never** test implementation details (focus on behavior)  
❌ **Never** skip tests or use `.only()` in commits  

## Industry Best Practices Compliance

This section validates the codebase against current industry standards.

### ✅ TypeScript best practices

- **Strict mode enabled** — Full type safety enforced
- **Type-only imports** — Better tree-shaking with `import type`
- **No `any` types** — Enforced by ESLint rules
- **Path aliases** — Cleaner imports, easier refactoring

### ✅ NestJS best practices

- **Modular architecture** — Bounded contexts with clear modules
- **Dependency injection** — Constructor-based DI with tokens
- **Guards for authorization** — Declarative security with decorators
- **Exception filters** — Centralized error handling

### ✅ API design best practices

- **RESTful conventions** — Standard HTTP methods and status codes
- **OpenAPI documentation** — Auto-generated from Zod schemas
- **Validation at edge** — DTOs validated before reaching use cases
- **Consistent error responses** — Global exception filter ensures uniformity

### ✅ Security best practices

- **Timing-safe comparison** — Prevents timing attacks
- **HMAC-SHA256** — Industry-standard for API keys
- **Environment-based secrets** — No hardcoded credentials
- **Separation of privileges** — Game vs Admin API keys

### ✅ Testing best practices

- **100% code coverage** — Enforced by CI
- **Unit + Integration + E2E** — Full testing pyramid
- **Mutation testing** — Ensures test quality (Stryker)
- **BDD acceptance tests** — Cucumber for user scenarios

### ✅ Database best practices

- **Repository pattern** — Abstraction over data access
- **Aggregation pipelines** — Efficient complex queries
- **Schema validation** — Mongoose schemas with types
- **Connection pooling** — Handled by Mongoose/MongoDB driver

### ✅ Performance best practices

- **Fastify** — High-performance HTTP server
- **SWC** — Fast transpilation (5-10x faster than Babel)
- **Lazy DTO mapping** — Only in controllers, not repositories
- **Async/await** — Non-blocking operations

### ✅ Observability and monitoring

- **Health checks** — `/health` endpoint with database status
- **Structured errors** — Consistent error format
- **Request logging** — Middleware-based logging (ready to add)

## Minimal local setup for a developer/agent

### Prerequisites

- **Node.js**: Version specified in `package.json` `engines` field.
- **pnpm**: Version specified in `package.json` `packageManager` field.
- **Docker**: For running the acceptance test database

### Package manager and commands

Install pnpm (if not present): <https://pnpm.io/installation>

```bash
# Clone the repository
git clone https://github.com/antoinezanardi/goat-it-api.git
cd goat-it-api

# Install dependencies
pnpm install
```

### Development server

```bash
# Start in development mode with hot reload
pnpm run start:dev

# Start in debug mode
pnpm run start:debug
```

### Running tests

```bash
# Unit tests (quick feedback)
pnpm run test:unit

# Unit tests with coverage (required for CI)
pnpm run test:unit:cov

# Unit tests in watch mode (development)
pnpm run test:unit:watch

# Acceptance tests (requires Docker for MongoDB)
pnpm run docker:acceptance-tests:start
pnpm run test:acceptance
```

### Full validation (before PR)

```bash
# Run all checks
pnpm run lint
pnpm run typecheck
pnpm run test:unit:cov
pnpm run test:mutation  # optional but recommended
pnpm run test:acceptance
```

## Notes and warnings

### Coverage requirements

- The project enforces `100%` code coverage. Any change must maintain full coverage.
- If you add new code, you must add corresponding unit tests.
- Coverage exclusions are defined in `configs/vitest/vitest.config.ts`.

### Mutation testing

- Mutation testing is expensive (CPU and time intensive).
- Run it selectively: locally before large PRs, or rely on CI.
- Use incremental mode (`pnpm run test:mutation`) to reuse previous results.
- Force mode (`pnpm run test:mutation:force`) clears cache and runs from scratch.

### Type checking

- The project uses `tsgo` (native TypeScript preview) for type checking.
- Run `pnpm run typecheck` to verify types.
- Type errors must be fixed before committing.

### Path aliases

- Always use path aliases in imports.
- When adding new bounded contexts, update all relevant configs (swc, typescript, vitest).

### Database

- MongoDB is used with Mongoose ODM.
- Acceptance tests require a running MongoDB instance.
- Use Docker for local database: `pnpm run docker:acceptance-tests:start`.

## Environment variables

### Application variables

| Variable          | Description                         | Default       |
|-------------------|-------------------------------------|---------------|
| `SERVER_HOST`     | Server host                         | `0.0.0.0`     |
| `SERVER_PORT`     | Server port                         | `3000`        |
| `NODE_ENV`        | Environment mode                    | `development` |
| `CORS_ORIGIN`     | CORS configuration (allowed origin) | `*`           |
| `FALLBACK_LOCALE` | Internationalization default locale | `en`          |

### Database variables

| Variable        | Description   | Default     |
|-----------------|---------------|-------------|
| `DATABASE_HOST` | MongoDB host  | `localhost` |
| `DATABASE_PORT` | MongoDB port  | `27017`     |
| `DATABASE_NAME` | Database name | `goat-it`   |

### Authentication variables

| Variable        | Description                                                          | Default |
|-----------------|----------------------------------------------------------------------|---------|
| `ADMIN_API_KEY` | Admin API key for protected ops. Must be at least 24 characters long | ❌       |
| `GAME_API_KEY`  | Game API key for protected ops. Must be at least 24 characters long  | ❌       |

### Test variables

| Variable     | Description                                     | Default |
|--------------|-------------------------------------------------|---------|
| `SKIP_BUILD` | Skip build in acceptance tests (`true`/`false`) | `false` |

## Contact and maintainers

- Author/maintainer: Antoine ZANARDI (antoine.zanardi@epitech.eu)
- GitHub issues: <https://github.com/antoinezanardi/goat-it-api/issues>

## Contributing

Please read the project's `.github/CONTRIBUTING.md` for the canonical contributor workflow, commit message rules, PR template and local check commands.

It contains the concrete step-by-step guidance contributors and automated agents should follow when proposing changes.

---

End of AGENTS.md
