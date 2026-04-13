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
| `executing-plans`       | `/executing-plans`       | Execute a written implementation plan with review checkpoints          |
| `write-acceptance-test` | `/write-acceptance-test` | Write or complete a Cucumber acceptance test scenario                  |
| `write-unit-test`       | `/write-unit-test`       | Write or complete a unit test file following 100%-coverage conventions |
| `writing-plans`         | `/writing-plans`         | Create a comprehensive implementation plan from a spec or requirements |
| `writing-skills`        | `/writing-skills`        | Create, edit, or verify an agent skill                                 |

### Additional skills (no slash command)

These skills live in `.agents/skills/` and are loaded via the `skill` tool by name:

| Skill                            | Purpose                                                        |
|----------------------------------|----------------------------------------------------------------|
| `dispatching-parallel-agents`    | Coordinate 2+ independent tasks without shared state           |
| `finishing-a-development-branch` | Guide completion of dev work — merge, PR, or cleanup           |
| `receiving-code-review`          | Process code review feedback with technical rigor              |
| `requesting-code-review`         | Verify work meets requirements before merging                  |
| `subagent-driven-development`    | Execute implementation plans with independent subagent tasks   |
| `systematic-debugging`           | Structured debugging before proposing fixes                    |
| `test-driven-development`        | Red-green-refactor workflow before writing implementation code |
| `using-git-worktrees`            | Create isolated git worktrees for feature work                 |
| `using-superpowers`              | Session bootstrap — skill discovery and invocation rules       |
| `verification-before-completion` | Run verification commands before claiming work is done         |

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

## Commands

### Build & type-check

```bash
pnpm build               # nest build
pnpm typecheck           # tsgo -b --clean && tsgo -b --noEmit (native TS compiler)
```

### Lint

```bash
pnpm lint                # oxlint then eslint (read-only)
pnpm lint:fix            # oxlint --fix then eslint --fix
```

### Unit tests

```bash
pnpm test:unit           # run all unit tests (no coverage)
pnpm test:unit:cov       # run unit tests with coverage (must stay at 100%)
pnpm test:unit:watch     # watch mode

# Run a SINGLE test file:
pnpm test:unit src/path/to/file.spec.ts

# Run tests matching a name pattern:
pnpm test:unit --reporter=verbose -t "Create Question Use Case"
```

### Other test suites

```bash
pnpm test:acceptance     # Cucumber e2e (requires running Docker services)
pnpm test:mutation       # Stryker mutation testing (slow, CI only)
pnpm test:mutation:force # Full mutation run (clears incremental cache)
```

### Quality gate (what CI runs)

```bash
pnpm lint && pnpm typecheck && pnpm test:unit:cov && pnpm test:acceptance && pnpm test:mutation
```

### Agent Workflow Guardrails

**Agents MUST follow these rules:**

1. **NEVER auto-commit** — Under no circumstances should an agent create a git commit without explicit user request in the conversation.

2. **Quality gate is part of "Definition of Done"** — When applicable to the work (e.g., after writing features, fixes, tests):

   ```bash
   pnpm lint:fix && pnpm typecheck && pnpm test:unit:cov && pnpm test:acceptance
   ```

- Run these checks before considering the work complete
- Report results (pass/fail) explicitly to the user
- **If any step fails, the agent MUST attempt to resolve the issue:**
  - Review error output and identify root cause
  - Apply fixes (e.g., reformat code, fix type errors, update tests)
  - Re-run the failing step to confirm resolution
  - Only escalate to the user if the issue cannot be resolved automatically
- For agents, work is only "done" when all of the above quality gate commands pass (if applicable)
- Mutation testing is a separate verification step run in CI and/or manually by the user; it is **not** part of the agent's quality gate commands
- Agents must **not** run mutation tests; instead, they must remind the user to run/verify mutation tests (or wait for CI) before merging significant changes

3. **User explicitly requests commits** — Only create a commit when the user directly asks (e.g., "commit this", "create a commit with message X").

- Before committing, show the diff and proposed commit message
- Wait for confirmation
- Never assume silence is approval

**Rationale**: Code integrity depends on intentional CI verification. User agency over git history is non-negotiable.

---

## Architecture

> Full guide: `docs/ARCHITECTURE.md`

```
src/
  app/                  # App module, root controller, metadata
  contexts/
    question/           # Bounded context: domain, application, infrastructure, modules/
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

Each bounded context follows Clean Architecture / Hexagonal (Ports & Adapters) layers:

- `domain/` — entities, value-objects, errors, commands, contracts, repository interfaces (ports)
- `application/` — use-cases, DTOs (Zod shapes + nestjs-zod wrappers), mappers
- `infrastructure/` — controllers, Mongoose repositories (adapters), HTTP pipes/filters/guards

**Data flow**: `Controller` → validates with Zod DTO → maps to domain command → `UseCase` → calls repository port → maps result to response DTO. Domain errors bubble up and are converted by `GlobalExceptionFilter`.

### Domain patterns

- **Predicates** (`domain/predicates/`): pure boolean functions for yes/no domain questions.
- **Policies** (`domain/policies/`): enforce complex business rules; throw domain errors on violation; called by use-cases before state changes.
- **Helpers** (`domain/helpers/`): pure transformation/computation functions.
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

- Named `createMocked<What>(overrides?: Partial<MockedWhat> = {})`, return `vi.fn()`-based typed objects
- Mock at the port level (repository interface / use-case interface), not internal Mongoose details
- Inject via Nest `useValue` providers in `createTestingModule`

### Faketories (`@faketories/*`)

> Full guide: `tests/shared/utils/faketories/README.md`

- Named `createFake<EntityName>(overrides?: Partial<T> = {})`, spread overrides last
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
