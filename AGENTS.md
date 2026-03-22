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
.opencode/skills/<name>/SKILL.md # thin wrapper; points to .agents/skills/<name>/SKILL.md
.opencode/commands/<name>.md     # slash-command entry point with $ARGUMENTS wiring
```

`.agents/skills/` is the authoritative location, discovered by both OpenCode and Claude Code.
`.opencode/skills/` contains only thin 3–5 line wrappers that say "load the canonical skill".

### Available skills

| Skill                   | Slash command            | Purpose                                                                                                                                             |
|-------------------------|--------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| `auto-learn`            | `/update-docs`           | Detect corrections to AI output, search docs for related guidance, and prompt user to update docs if gaps are found                                 |
| `create-faketory`       | `/create-faketory`       | Scaffold a faketory (test data factory) for an entity, DTO, command or Mongoose document                                                            |
| `create-mock`           | `/create-mock`           | Scaffold a typed Vitest mock factory for a repository or use-case port                                                                              |
| `write-unit-test`       | `/write-unit-test`       | Write or complete a unit test file following 100%-coverage conventions                                                                              |
| `write-acceptance-test` | `/write-acceptance-test` | Write or complete a Cucumber acceptance test scenario for any feature or endpoint                                                                   |
| `create-skill`          | `/create-skill`          | Scaffold a new agent skill following repository conventions                                                                                         |
| `challenge-plan`        | `/challenge-plan`        | Challenge a new feature idea by exploring the codebase, proposing evidence-backed answers, and producing a zero-ambiguity implementation-ready plan |

### Adding a new skill

1. Run `/create-skill <name and description>` — the `create-skill` skill handles the full workflow.
2. Or follow the steps in `.agents/skills/create-skill/SKILL.md` manually.

### AI Self-Learning via Auto-Learn

The `auto-learn` skill enables AI agents to learn from corrections and automatically update documentation.

It must be explicitly invoked at the start of an agent session by calling `skill({ name: "auto-learn" })` in the prompt configuration (see `build-with-autolearn` and `plan-with-autolearn` prompts as examples of this pattern).

For OpenCode agents, the skill is configured to run at session start via agent prompt instructions.

> **Full reference**: `.agents/skills/auto-learn/SKILL.md` — canonical source for workflow, doc file selection logic, and anti-patterns.

---

## Stack

- **Runtime**: Node.js – see `configs/node/.node-version` for the exact version
- **Framework**: NestJS 11 + Fastify 5
- **Language**: TypeScript (strict mode, `target: ES2021`, `module: ESNext`)
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
pnpm typecheck           # tsgo -b --noEmit (faster native TS compiler)
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
  - Work is only "done" when all quality gates pass (if applicable)
  - Mutation tests are not required for every change but should be run manually by the user before merging significant changes

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

| Alias             | Resolves to                       |
|-------------------|-----------------------------------|
| `@src/*`          | `src/*`                           |
| `@app/*`          | `src/app/*`                       |
| `@shared/*`       | `src/shared/*`                    |
| `@question/*`     | `src/contexts/question/*`         |
| `@mocks/*`        | `tests/unit/utils/mocks/*`        |
| `@faketories/*`   | `tests/shared/utils/faketories/*` |
| `@test-helpers/*` | `tests/shared/utils/helpers/*`    |
| `@configs/*`      | `configs/*`                       |

When adding a new bounded context, register its alias in `configs/swc/swc.config.json`, `configs/typescript/tsconfig.app.json`, and `configs/vitest/vitest.config.ts`.

---

## Code Style

### Formatting (enforced by ESLint Stylistic)

- **Indent**: 2 spaces (no tabs)
- **Quotes**: double quotes (`"`)
- **Semicolons**: always required
- **Trailing commas**: always on multiline
- **Max line length**: 180 characters
- **Max lines per function**: 30 (excluding comments/blanks)
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

### Naming conventions

- **Classes, interfaces, type aliases, type parameters**: `PascalCase`
- **Enum members**: `UPPER_CASE`
- **Exported variables and exported object literal properties**: `UPPER_CASE`
- **Functions, class methods, class properties, accessors**: `camelCase`
- **Files and directories**: `kebab-case`
- **Test files**: `<name>.spec.ts` co-located with the source file

### Imports order (enforced by `import/order`)

1. Node built-ins (`node:*`)
2. External packages
3. Internal aliases (`@src`, `@app`, `@shared`, `@configs`, `@question`)
4. Test-only aliases (`@unit-tests`, `@mocks`, `@faketories`, `@test-helpers`)
5. Type imports last (via `import type`)

Always use `node:` protocol for built-in modules (e.g., `import path from "node:path"`).
No default exports — only named exports (`import/no-default-export`).
No relative imports (`../` or `./`) — always use path aliases.

### DTOs

- Zod schema in `*.dto.shape.ts`: export the `z.object(...)` const (named `FOO_DTO`) and the inferred `type FooDto = z.infer<typeof FOO_DTO>`. Use `z.strictObject` for response shapes. Add `.describe()` and `.meta({ example })` on fields to drive OpenAPI output.
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
- Excluded from coverage: `*.module.ts`, `*.schema.ts`, `*.constants.ts`, `*.types.ts`, `*.dto.ts`, `*.pipeline.ts`, `*.commands.ts`, `*.contracts.ts`
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
