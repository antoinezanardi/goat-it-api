# AGENTS.md — Goat It API

> Guidelines for agentic coding agents operating in this repository.
> Also referenced by `.github/copilot-instructions.md`: always read and follow this file.

## Documentation

In-depth guides live under `docs/` and `tests/`:

| File                                      | Purpose                                                                                   |
|-------------------------------------------|-------------------------------------------------------------------------------------------|
| `docs/ARCHITECTURE.md`                    | Hexagonal architecture, layers, data flow, DI patterns, branching/commit rules            |
| `docs/FAKETORIES.md`                      | Pointer to `tests/shared/utils/faketories/README.md`                                      |
| `docs/MOCKS.md`                           | Pointer to `tests/unit/utils/mocks/README.md`                                             |
| `docs/UNIT-TESTS.md`                      | Pointer to `tests/unit/README.md`                                                         |
| `docs/ACCEPTANCE-TESTS.md`                | Pointer to `tests/acceptance/README.md`                                                   |
| `docs/BRUNO.md`                           | Bruno API collection setup (`configs/bruno/Goat It/`)                                     |
| `tests/unit/README.md`                    | Full writing guide per file type (controllers, use-cases, repos, DTOs, helpers, errors)   |
| `tests/unit/utils/mocks/README.md`        | Mock factory conventions and anti-patterns                                                |
| `tests/shared/utils/faketories/README.md` | Faketory conventions, organization and anti-patterns                                      |
| `tests/acceptance/README.md`              | Acceptance test guide (Cucumber, fixtures, payloads, step definitions, DataTable helpers) |

---

## Agent Skills

Reusable agent workflows are encoded as **skills** — self-contained `SKILL.md` files that any compatible agent (OpenCode, Claude Code, …) can load on demand.

### Layout

```
.agents/skills/<name>/SKILL.md   # canonical — single source of truth
.opencode/commands/<name>.md     # slash-command entry point with $ARGUMENTS wiring
```

`.agents/skills/` is the authoritative location, discovered by both OpenCode and Claude Code.

### Skills with slash commands

These skills have OpenCode slash commands wired up in `.opencode/commands/`:

| Skill                   | Slash command            | Purpose                                                                |
|-------------------------|--------------------------|------------------------------------------------------------------------|
| `brainstorming`         | `/brainstorming`         | Explore intent, requirements and design before any creative/impl work  |
| `create-faketory`       | `/create-faketory`       | Scaffold a faketory for an entity, DTO, command or Mongoose document   |
| `create-mock`           | `/create-mock`           | Scaffold a typed Vitest mock factory for a repository or use-case port |
| `write-acceptance-test` | `/write-acceptance-test` | Write or complete a Cucumber acceptance test scenario                  |
| `write-unit-test`       | `/write-unit-test`       | Write or complete a unit test file following 100%-coverage conventions |
| `writing-plans`         | `/writing-plans`         | Create a comprehensive implementation plan from a spec or requirements |
| `writing-skills`        | `/writing-skills`        | Create, edit, or verify an agent skill                                 |

### Additional skills (no slash command)

These skills live in `.agents/skills/` and are loaded via the `skill` tool by name:

| Skill                     | Purpose                                                         |
|---------------------------|-----------------------------------------------------------------|
| `receiving-code-review`   | Process code review feedback with technical rigor               |
| `requesting-code-review`  | Verify work meets requirements before merging                   |
| `subagent-driven-development` | Execute implementation plans with independent subagent tasks |
| `systematic-debugging`    | Structured debugging before proposing fixes                     |
| `test-driven-development` | Red-green-refactor workflow before writing implementation code  |
| `using-superpowers`       | Session bootstrap — skill discovery and invocation rules        |

---

## Agent Definitions

Pre-configured agent definitions live under `.opencode/agents/`. These are adaptive persona configurations that combine a model, temperature, permission scope, and system prompt. They can be selected in the OpenCode agent switcher or dispatched as subagents by the orchestrator.

| Agent | Mode | Model | Purpose |
|-------|------|-------|---------|
| `orchestrator` | primary | deepseek-v4-pro T:0.3 | **Default agent.** Drives the full cycle: detect spec → create branch → dispatch plan-writer → per-task implementer dispatch → final-reviewer → gatekeeper → commit proposal |
| `brainstormer` | primary | deepseek-v4-pro T:0.7 | **Interactive design partner.** Explores intent, asks clarifying questions, proposes 2-3 approaches. Never implements. Instructs user to switch back to `orchestrator`. |
| `receiving-code-review` | primary | deepseek-v4-pro T:0.3 | **Code review triage.** Evaluates PR/peer feedback with technical rigor: scan branch → read → understand → verify → evaluate → respond → dispatch gatekeeper |
| `plan-writer` | subagent | kimi-k2.7-code T:0.2 | Turns approved specs into detailed implementation plans with bite-sized TDD steps, complete code, no placeholders. Can only edit `docs/superpowers/plans/`. |
| `implementer` | subagent | deepseek-v4-flash T:0.2 | Implements ONE detailed task from a plan. Follows steps exactly, runs focused tests, self-reviews, reports DONE/BLOCKED/NEEDS_CONTEXT. Cannot commit. |
| `gatekeeper` | subagent | deepseek-v4-flash T:0.2 | Runs full 5-step quality gate: `lint:fix` → `typecheck` → `test:unit:cov` → `test:mutation` → `test:acceptance`. Auto-fixes failures. Cannot commit. |
| `final-reviewer` | subagent | deepseek-v4-flash T:0.1 | Reviews entire feature branch holistically: spec coverage, plan execution, code quality, architecture, cross-task consistency, DOD items. Does NOT run quality gates. |
| `debugger` | subagent | deepseek-v4-pro T:0.2 | Systematic 4-phase debugging. Root cause investigation → pattern analysis → hypothesis → implementation. Writes failing regression test first. Runs full quality gates after fix. |
| `investigator` | subagent | mimo-v2.5 T:0.2 | Lightweight parallel investigator for ONE independent problem. Cheap model for fan-out debugging. Returns root cause + minimal fix. |
| `tdd-writer` | subagent | kimi-k2.7-code T:0.1 | **TDD red-phase only.** Writes failing test(s) for one task, verifies they fail correctly, then STOPS. Does NOT write implementation. |

---

## Stack

- **Runtime**: Node.js – see `configs/node/.node-version` for the exact version
- **Framework**: NestJS 11 + Fastify 5
- **Language**: TypeScript (strict mode, `target: ES2021`, `module: preserve`)
- **Database**: MongoDB via Mongoose
- **Validation**: Zod + nestjs-zod
- **Package manager**: pnpm (never use npm or yarn) – see `package.json` for exact version
- **Test runner**: Vitest 4 + SWC (unit), Cucumber (acceptance), Stryker (mutation)
- **Linters**: all configured linters must pass — see `package.json` scripts and linter config files for the authoritative setup

---

## Build / Run / Lint / Test commands

- Package manager: `pnpm@11.1.2` (see `package.json` → `packageManager`).
  - Unlike npm, `pnpm` does NOT require an extra `--` before flags. Pass arguments directly:
    `pnpm test:unit -t "should create"` (correct) vs ~~`pnpm test:unit -- -t "should create"`~~ (unnecessary).
- Node requirement: >=26.3.0 (see `package.json` → `engines.node`).
- Build: `pnpm build` (nest build)
- Typecheck: `pnpm typecheck` (tsgo -b --clean && tsgo -b --noEmit, native TS compiler)

- Linting (always run both linters):
  - Full lint: `pnpm lint`         Full lint + fix: `pnpm lint:fix`
  - ESLint only: `pnpm lint:eslint` / `pnpm lint:eslint:fix`
  - Oxlint only: `pnpm lint:oxlint` / `pnpm lint:oxlint:fix`

- Tests:
  - Full unit run:   `pnpm test:unit`
  - With coverage:   `pnpm test:unit:cov`
  - Watch mode:      `pnpm test:unit:watch`
  - Mutation (Stryker): `pnpm test:mutation` / `pnpm test:mutation:force`
  - Acceptance (Cucumber): `pnpm test:acceptance` (requires running Docker services)

Running a single unit test or file:

- By filename:     `pnpm test:unit src/path/to/file.spec.ts`
- By test name:    `pnpm test:unit --reporter=verbose -t "Create Question Use Case"`
- Watch file:      `pnpm test:unit:watch src/path/to/file.spec.ts`

Running acceptance tests:

- Full run:                 `pnpm test:acceptance`
- Skip build (fast iteration, if `dist/` is already up to date): `SKIP_BUILD=true pnpm test:acceptance`
- Specific feature:         `pnpm test:acceptance tests/acceptance/features/question/admin-create-question.feature`
- Specific scenario (line): `pnpm test:acceptance tests/acceptance/features/question/admin-create-question.feature:8`
- By scenario name:         `pnpm test:acceptance --name "should create a question"`
- By tag:                   `pnpm test:acceptance --tags "@question-theme"`
- Multiple tags (OR):       `pnpm test:acceptance --tags "@question-theme or @question"`
- Exclude tag:              `pnpm test:acceptance --tags "not @slow"`
- By tag (AND):             `pnpm test:acceptance --tags "@question-theme and @admin"`

**Mandatory quality gates** — agents MUST run all five commands below **in order**
before considering any task complete. **Do NOT skip any gate**, even for "trivial" changes:

1. `pnpm lint:fix`
2. `pnpm typecheck`
3. `pnpm test:unit:cov`
4. `pnpm test:acceptance`
5. `pnpm test:mutation`

If any gate fails, fix the issue and re-run from that gate onward until all five pass.

### Agent Workflow Guardrails

**Agents MUST follow these rules:**

1. **NEVER auto-commit** — Under no circumstances should an agent create a git commit without explicit user request in the conversation.

2. **User explicitly requests commits** — Only create a commit when the user directly asks (e.g., "commit this", "create a commit with message X").

- Before committing, show the diff and proposed commit message
- Wait for confirmation
- Never assume silence is approval

3. **Definition of Done (DOD)** — After completing all implementation work, the agent MUST evaluate the conditional DOD checklist below. This is a mandatory end-of-work verification pass.

- Run the checklist **once at the end of all work**, not per-subtask
- In subagent workflows, **only the parent/orchestrating agent** runs the DOD — subagents skip it entirely
- For each item, check whether the condition is true based on what was changed, and if so, verify the action was completed
- If any verification fails, the agent **must attempt to fix** the issue, re-run the failing step, and only escalate to the user if it cannot be resolved automatically
- Report results (pass/fail) explicitly to the user
- Work is only "done" when all applicable DOD items pass

**Rationale**: Code integrity depends on intentional CI verification. User agency over git history is non-negotiable. The DOD ensures agents deliver complete, production-ready implementations.

---

### Definition of Done — Conditional Checklist

Each item below has a **condition** (when it applies), an **action** (what to do), and a **verification** (how to confirm it's done). Evaluate all items at the end of implementation.

#### 1. Quality Gate

- **Condition**: Any code change (feature, fix, refactor)
- **Action**: Run the full quality gate command:

   ```bash
   pnpm lint:fix && pnpm typecheck && pnpm test:unit:cov && pnpm test:acceptance && pnpm test:mutation
   ```

- Steps run left-to-right. If any step fails, fix the issue and re-run that step before proceeding to the next
- Mutation testing runs **last** because it is the slowest step — fix all preceding failures first
- **Verification**: All 5 steps pass

#### 2. Bruno Collection Synchronization

- **Condition**: Endpoint added, changed, or deleted (controller routes modified)
- **Action**: Add, modify, or remove `.bru` request files in `configs/bruno/Goat It/`
  - Follow naming convention: `<scope>-<verb>-<resource>[-by-id].bru` (e.g., `admin-create-question.bru`)
  - Follow folder structure: `admin/`, `play/`, `public/` organized by resource
  - Follow auth inheritance: `folder.bru` sets auth at folder level, individual requests use `auth: inherit`
  - Include request body, path params, and `seq` ordering number matching existing patterns
- **Verification**: Every endpoint in the codebase has a corresponding `.bru` request, and removed endpoints have no orphaned `.bru` files

#### 3. Acceptance Test Scenarios

- **Condition**: Feature added, changed, or removed that affects API behavior (new endpoint, changed response shape, new business rule, removed functionality)
- **Action**: Write or update acceptance test scenarios covering:
  - Happy path (success case)
  - Key error cases: validation failures (missing fields, wrong types, boundary values), not-found, authentication errors
  - Follow existing conventions: tags (`@<domain> @<feature-slug> @<audience>`), fixture sets, payloads, step definitions, DataTable schemas
- **Verification**: `pnpm test:acceptance` passes; scenarios cover success and key failure modes

#### 4. Schemas Package — Existing Export Modified

- **Condition**: A DTO shape (`*.dto.shape.ts`) or domain constant that is **already re-exported** from `@goat-it/schemas` is modified
- **Action**: Bump the **patch** version in `packages/schemas/package.json`
- **Verification**: Version number in `packages/schemas/package.json` is higher than before the change

#### 5. Schemas Package — New Export Candidate

- **Condition**: New DTO shape, constant, or value-object type created
- **Action**: **Ask the user** whether it should be exported from `@goat-it/schemas`. If yes:
  - Add re-export in the relevant `packages/schemas/src/<domain>/index.ts` barrel file
  - If a new sub-path is needed: add entry to `package.json` `exports` field + `tsdown.config.ts` `entry` array
  - Bump the **patch** version in `packages/schemas/package.json`
- **Verification**: If exported, the symbol is accessible via `@goat-it/schemas/<sub-path>`

#### 6. GlobalExceptionFilter Error Registration

- **Condition**: New domain error class created (under `domain/errors/`)
- **Action**: Add mapping in `GlobalExceptionFilter`'s `domainErrorHttpExceptionFactories` static map at `src/shared/infrastructure/http/filters/global-exception/global-exception.filter.ts`
- **Verification**: Error class name maps to the correct HTTP exception type (e.g., `BadRequestException`, `NotFoundException`)

#### 7. Faketories for New Types

- **Condition**: New entity, DTO, command, contract, or Mongoose document type created
- **Action**: Create corresponding faketory under `tests/shared/utils/faketories/` following conventions:
  - Naming: `createFake<ConceptName>(overrides: Partial<T> = {}): T`
  - Use `@faker-js/faker` for realistic values
  - Spread `overrides` last
  - Use `faker.helpers.maybe(...)` for optional fields
  - Mirror source path under the appropriate layer folder (`entity/`, `dto/`, `mongoose/`, `commands/`, `contracts/`)
- **Verification**: Faketory exists and is importable via `@faketories/*`

#### 8. Mock Factories for New Ports

- **Condition**: New repository port or use case created
- **Action**: Create corresponding mock factory under `tests/unit/utils/mocks/` following conventions:
  - Naming: `createMocked<What>(overrides: Partial<Mocked<What>> = {}): Mocked<What>`
  - Define a concrete `MockedWhat` mapped type: `type MockedWhat = { [K in keyof WhatStub]: Mock<WhatStub[K]> }`
  - Return `vi.fn()`-typed objects matching the port interface
  - Mirror source path under the mock directory structure
- **Verification**: Mock exists and is importable via `@mocks/*`

#### 9. NestJS Module Registration

- **Condition**: New controller, use case, or repository created
- **Action**: Register in the appropriate NestJS module:
  - Controllers → `controllers` array
  - Use cases → `providers` array
  - Repositories → `{ provide: TOKEN, useClass: Implementation }` in `providers`
  - Cross-module use cases → also add to `exports` array
  - New Mongoose schemas → `MongooseModule.forFeature(...)` in `imports`
  - New bounded context module → import in `app.module.ts`
- **Verification**: Application compiles and DI resolves at runtime (quality gate passes)

#### 10. Acceptance Test Infrastructure for New Domains

- **Condition**: New domain or MongoDB collection introduced that will be used in acceptance tests
- **Action**: Update acceptance test infrastructure:
  - Add Mongoose model to `GoatItWorld.models` in `tests/acceptance/support/types/world.types.ts`
  - Add domain to `FixtureRegistry` type in `tests/acceptance/support/fixtures/types/fixture.types.ts`
  - Add fixture sets to `FIXTURE_REGISTRY` in `tests/acceptance/support/fixtures/constants/fixture.constants.ts`
  - Add inserter function to `FIXTURE_INSERTERS` in the same file
  - Extend `PayloadScope` / `PayloadType` types if needed in `tests/acceptance/support/payloads/types/payload.types.ts`
  - Register payloads in `PAYLOADS` constant in `tests/acceptance/support/payloads/constants/payload.constants.ts`
- **Verification**: Acceptance test fixtures and payloads load without errors; `pnpm test:acceptance` passes

---

## Architecture

> Full guide: `docs/ARCHITECTURE.md`

```
src/
  app/                  # App module, root controller, metadata
  contexts/
    question/           # Question bounded context (single aggregate)
      domain/
        constants/      # Domain constants (sortable fields, value-object values)
        types/          # Type definitions (entities, commands, contracts, value-objects)
        rules/          # Domain logic (predicates, policies, helpers — unified)
        errors/         # Domain error classes (one folder per error)
        repositories/   # Port interfaces + injection tokens
      application/
      infrastructure/
      question.module.ts
    question-theme/     # Question-Theme bounded context (single aggregate)
      domain/
        constants/
        types/
        rules/
        errors/         # Domain error classes (one folder per error)
        repositories/
      application/
      infrastructure/
      question-theme.module.ts
  infrastructure/       # Cross-cutting API concerns (auth, health, config, database)
  shared/               # Shared domain, application, and infrastructure utilities

tests/
  unit/                 # Vitest specs (mirrors src/ structure)
  shared/utils/
    faketories/         # Factory functions for test data (uses @faker-js/faker)
    helpers/            # Shared test helpers
  acceptance/           # Cucumber feature files + step definitions
  mutation/             # Stryker incremental results (committed)
```

Each bounded context is a peer folder under `contexts/` with its own module. Each follows Clean Architecture / Hexagonal (Ports & Adapters) layers:

- `domain/` — entities, value-objects, errors, commands, contracts, repository interfaces (ports)
- `application/` — use-cases, DTOs (Zod shapes + nestjs-zod wrappers), mappers
- `infrastructure/` — controllers, Mongoose repositories (adapters), HTTP pipes/filters/guards

**Data flow**: `Controller` → validates with Zod DTO → maps to domain command → `UseCase` → calls repository port → maps result to response DTO. Domain errors bubble up and are converted by `GlobalExceptionFilter`.

### Domain patterns

- **Rules** (`domain/rules/`): all domain logic in a single directory per aggregate, distinguished by naming convention:
  - *Predicates* (`is*`, `has*`, `can*`): pure boolean functions for yes/no domain questions.
  - *Policies* (`ensure*`): enforce complex business rules; throw domain errors on violation; called by use-cases before state changes.
  - *Helpers* (descriptive names): pure transformation/computation functions.
- **Mappers** (`application/mappers/`, `infrastructure/persistence/mongoose/mappers/`): convert between persistence documents ↔ domain entities ↔ DTOs. Keep them pure, explicit and side-effect-free.

### Repository pattern

- Interface in `domain/repositories/*.repository.types.ts`.
- Symbol injection token in `domain/repositories/*.repository.constants.ts` (`export const FOO_TOKEN = Symbol("FooRepo")`).
- Mongoose implementation in `infrastructure/persistence/mongoose/repository/`.
- Use `@Inject(FOO_TOKEN)` in use-cases; register with `{ provide: FOO_TOKEN, useClass: FooMongooseRepository }` in the module.

---

## Path Aliases

Use path aliases everywhere — no relative `../` or `./` imports are permitted.

| Alias                    | Resolves to                       | Registered in         |
|--------------------------|-----------------------------------|-----------------------|
| `@package-json`          | `package.json`                    | tsconfig, vitest      |
| `@src/*`                 | `src/*`                           | tsconfig, swc, vitest |
| `@app/*`                 | `src/app/*`                       | tsconfig, swc, vitest |
| `@shared/*`              | `src/shared/*`                    | tsconfig, swc, vitest |
| `@configs/*`             | `configs/*`                       | tsconfig, swc, vitest |
| `@question/*`            | `src/contexts/question/*`         | tsconfig, swc, vitest |
| `@question-theme/*`      | `src/contexts/question-theme/*`   | tsconfig, swc, vitest |
| `@unit-tests/*`          | `tests/unit/*`                    | tsconfig, vitest      |
| `@mocks/*`               | `tests/unit/utils/mocks/*`        | tsconfig, vitest      |
| `@faketories/*`          | `tests/shared/utils/faketories/*` | tsconfig, vitest      |
| `@test-helpers/*`        | `tests/shared/utils/helpers/*`    | tsconfig, vitest      |
| `@acceptance-tests/*`    | `tests/acceptance/*`              | tsconfig only         |
| `@acceptance-features/*` | `tests/acceptance/features/*`     | tsconfig only         |
| `@acceptance-support/*`  | `tests/acceptance/support/*`      | tsconfig only         |

When adding a new bounded context, register its alias in `configs/swc/swc.config.json`, `configs/typescript/tsconfig.app.json`, and `configs/vitest/vitest.config.ts`. Acceptance-only aliases only need tsconfig registration.

---

## Code Style

### Formatting (enforced by ESLint Stylistic)

- **Indent**: 2 spaces (no tabs)
- **Quotes**: double quotes (`"`)
- **Semicolons**: always required
- **Trailing commas**: always on multiline
- **Max line length**: 180 characters
- **Max lines per function**: 30 (excluding comments/blanks) — does **not** apply to test files (`*.spec.ts`)
- **No final newline** (except `.yml`, `.sh`, `.env*`, `.json`, `.md`)
- **EOL**: LF

### TypeScript

- Strict mode — no `any`, no non-null assertions (`!`), no type casting without justification
- Prefer `type` over `interface` (`consistent-type-definitions: type`)
- Use `type` imports for type-only symbols (`consistent-type-imports`)
- All functions must have explicit return types (`explicit-function-return-type`)
- All class members must have explicit accessibility (`explicit-member-accessibility`)
- Constructor injection parameters use `private readonly` shorthand
- No enums — use `as const` objects with exported constant arrays instead
- No `switch`/`case` — use polymorphism, object maps, or conditional chains
- Ternaries are for **value assignment only** — never use a ternary to choose between function calls or side effects; use `if`/early-return instead
- Boolean variables/properties must be prefixed: `is`, `has`, `can`, `should`, `was`, `were`, `are`, `does`, `did`, `must`
- Never wrap primitive types in type aliases. Use the primitive directly. Type aliases should represent domain entities, value objects, or unions—not `string`, `number`, or `boolean`.
- Reserve type aliases for complex domain concepts: `type User = { id: string; name: string; }` or `type Result<T> = Success<T> | Failure`

### Naming conventions

- **Classes, interfaces, type aliases, type parameters**: `PascalCase`
- **Enum members**: `UPPER_CASE`
- **Exported variables and exported object literal properties**: `UPPER_CASE`
- **Functions, class methods, class properties, accessors**: `camelCase`
- **Files and directories**: `kebab-case`
- **Test files**: `<name>.spec.ts` co-located with the source file
- **CRUD operation verbs**: Use `Create` for new resources, `Modify` (not `Update`) for partial patches, `Archive` for soft-deletes, `Find` for retrieval, `Remove` for detaching associations. This applies to use cases, commands, contracts, DTOs and mappers (e.g., `ModifyQuestionThemeUseCase`, `QuestionThemeModificationCommand`).

### Imports order (enforced by `import/order`)

1. Node built-ins (`node:*`)
2. External packages
3. Internal aliases (`@src`, `@app`, `@shared`, `@configs`, `@question`)
4. Test-only aliases (`@unit-tests`, `@mocks`, `@faketories`, `@test-helpers`)
5. Type imports last (via `import type`)

Always use `node:` protocol for built-in modules (e.g., `import path from "node:path"`).
No default exports — only named exports (`import/no-default-export`).
No relative imports (`../` or `./`) — always use path aliases.

### Export Pattern

- Do NOT use inline `export function` or `export const` syntax — always declare first, export at the end.

- **Classes**: May use inline `export class` since only one class per file is allowed.

- **No type re-exports**: Never re-export types from a file that is not their original declaration. Import types from their canonical source (the file where they are defined). This prevents barrel-style indirection and keeps the dependency graph explicit.

### DTOs

- Zod schema in `*.dto.shape.ts`: export the `z.object(...)` const (named `FOO_DTO`) and the inferred `type FooDto = z.infer<typeof FOO_DTO>`. Use `z.strictObject` for response shapes. Add `.describe()` and `.meta({ example })` on fields to drive OpenAPI output. Boolean fields only require `.describe()` — `.meta({ example })` is not needed for booleans.
- nestjs-zod wrapper in `*.dto.ts`: `class FooNestZodDto extends createZodDto(FOO_DTO) {}` — intentionally tiny.
- DTO shape tests in `*.dto.shape.spec.ts`. Cover every field with at least one positive and one negative test.
- Shared Zod validators live in `src/shared/infrastructure/http/zod/validators/`.

### Errors

- Custom error classes extend `Error`, set `this.name` in the constructor
- Errors live in `domain/errors/<context>.errors.ts`
- Never throw plain strings or non-Error objects

### Constants

- Magic numbers are forbidden — extract to named constants in `*.constants.ts` files
- Numbers 0, 1, and -1 are allowed inline

### Lint Rule Disabling

Disabling lint rules is a **last resort** — exhaust refactoring, type narrowing, and helper extraction first.

When a disable is genuinely needed, use the **two-line format**:

```ts
// Acceptable as <concise justification explaining WHY the disable is safe>
// oxlint-disable-next-line <rule-name(s)>
suppressedCode();
```

- **Never** use file-level or block-level disables (`/* oxlint-disable */`, `/* eslint-disable */`) without explicit approval
- Multiple rules on one line are comma-separated: `// oxlint-disable-next-line rule-a, rule-b`
- Rule names use oxlint namespacing (`typescript/no-...`, `unicorn/...`, `eslint/...`) — no `@` prefix
- ESLint-specific rules use `eslint/` prefix: `// oxlint-disable-next-line eslint/no-underscore-dangle`

---

## Testing

> Full per-file-type writing guide for unit tests: `tests/unit/README.md`
> Mock factory conventions: `tests/unit/utils/mocks/README.md`
> Faketory conventions: `tests/shared/utils/faketories/README.md`
> Acceptance test guide: `tests/acceptance/README.md`

### Unit tests

> Full guide: `tests/unit/README.md`

- Framework: Vitest with globals enabled (`describe`, `it`, `expect`, `vi`, `beforeEach`)
- **100% coverage is required** — all branches, lines, functions (enforced by `thresholds: { 100: true }`)
- Excluded from coverage: `*.module.ts`, `**/mongoose/**/*.schema.ts`, `*.constants.ts`, `*.types.ts`, `*.dto.ts`, `*.pipeline.ts`, `*.commands.ts`, `*.contracts.ts`
- Use `@nestjs/testing` `Test.createTestingModule` for NestJS providers
- One assertion per `it` block; use `it.each` for parametrized input→output cases
- Private methods tested via `ClassName["privateMethod"](...)` syntax

### Mocks (`@mocks/*`)

> Full guide: `tests/unit/utils/mocks/README.md`

- Named `createMocked<What>(overrides: Partial<MockedWhat> = {})`, return `vi.fn()`-based typed objects
- Mock at the port level (repository interface / use-case interface), not internal Mongoose details
- Inject via Nest `useValue` providers in `createTestingModule`

### Faketories (`@faketories/*`)

> Full guide: `tests/shared/utils/faketories/README.md`

- Named `createFake<EntityName>(overrides: Partial<T> = {})`, spread overrides last
- Use `@faker-js/faker` for realistic randomized values; randomize optional fields to surface brittle tests
- Organized by layer: `entity/`, `dto/`, `mongoose/`, `commands/`, `contracts/`
- Factories must be pure — no DB calls, no network, no side effects

---

## Git Conventions

- **Branches**: `<type>/<scope>-<short-desc>` — e.g. `feat/add-user-endpoint`. Types: `feat`, `fix`, `docs`, `test`, `chore`, `style`, `refactor`, `perf`, `build`, `ci`, `revert`.
- **Commits**: Conventional Commits — `<type>(<scope>): <short description>`. Enforced by `commitlint`.
- **Pre-commit hooks** (Husky): typecheck → branch name validation → `lint:staged:fix` → `test:unit:staged`.
- **PRs**: small, single-purpose; must pass CI (lint + typecheck + unit coverage + mutation).

---

## Key Constraints

- **No `switch`/`case` or `do...while`** — banned by ESLint
- **No relative imports** — all imports must use path aliases
- **No default exports** — named exports only
- **No `console.*`** — use the NestJS logger
- **No magic numbers** — define constants in `*.constants.ts`
- **Max function params**: 8; **max nested callbacks**: 5; **max classes per file**: 1
- Prefer `const`, arrow callbacks, template literals, optional chaining, nullish coalescing
- `no-param-reassign` with `props: true` — never mutate parameters

---

## MemPalace (persistent project memory)

MemPalace is a local memory system that stores project context as searchable embeddings. It runs as an MCP server with tools (prefixed `mcp mempalace_*`). All data stays on your machine — no API keys, no cloud.

### What's in the palace

- **Drawers** of project files (code, docs, configs, tests) under wing `goat_it_api`
- Rooms: `app`, `contexts`, `infrastructure`, `shared`, `src`, `testing`, `documentation`, `configuration`, `packages`, `scripts`, `general`
- Future sessions will be auto-mined by the plugin (every 20 message pairs)

### How agents should use it

1. **For tasks involving codebase context** (architecture, patterns, past decisions): query MemPalace first:
   ```
   Search for patterns, decisions, or architecture related to the task
   ```
   Use `mcp mempalace_search` with the wing filter to find relevant drawers. Skip MemPalace for trivial or purely mechanical tasks.

2. **File learnings** to the knowledge graph after making decisions:
   Use `mcp mempalace_kg_add` to persist important decisions, conventions, or discoveries that future sessions should know.

3. **Write diary entries** at session end:
   Use `mcp mempalace_diary_write` to summarize what was accomplished.

### Key commands

- `mempalace search "query"` — semantic search across all project content
- `mempalace search "query" --wing goat_it_api --room app` — scoped search
- `mempalace status` — show drawer counts by room
