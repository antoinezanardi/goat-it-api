# AGENTS

This file is a concise, actionable guide for automated agents working in this repository.
It explains how to build, lint and run tests (including running a single test), plus
the coding conventions agents must follow (imports, types, naming, architecture, NestJS
conventions, and other repo-specific rules).

## Build / Run / Lint / Test commands

- Package manager: `pnpm` (exact version in `package.json` -> `packageManager`).
  - Unlike npm, `pnpm` does NOT require an extra `--` before flags. Pass arguments directly:
    `pnpm run test:unit -t "should create"` (correct) vs ~~`pnpm run test:unit -- -t "should create"`~~ (unnecessary).
- Node requirement: see `package.json` -> `engines.node` and `configs/node/.node-version`.
- Stack: NestJS 11 + Fastify 5, MongoDB/Mongoose, Zod + nestjs-zod, SWC builder.
- Dev server: `pnpm run start:dev` (nest start --watch)
- Build: `pnpm run build` (nest build via SWC); production: `pnpm run start:prod`
- Typecheck: `pnpm run typecheck` (tsgo -b --clean && tsgo -b --noEmit, native TS compiler)

- Linting (always run both linters):
  - Full lint: `pnpm run lint`         Full lint + fix: `pnpm run lint:fix`
  - ESLint only: `pnpm run lint:eslint` / `pnpm run lint:eslint:fix`
  - Oxlint only: `pnpm run lint:oxlint` / `pnpm run lint:oxlint:fix`

- Tests:
  - Full unit run:   `pnpm run test:unit`
  - With coverage:   `pnpm run test:unit:cov`
  - Watch mode:      `pnpm run test:unit:watch`
  - Mutation (Stryker): `pnpm run test:mutation` / `pnpm run test:mutation:force`
  - Acceptance (Cucumber): `pnpm run test:acceptance` (requires running Docker services)
  - Acceptance without rebuild: `pnpm run test:acceptance:skip-build`

Running a single unit test or file:

- By filename:     `pnpm run test:unit src/path/to/file.spec.ts`
- By test name:    `pnpm run test:unit --reporter=verbose -t "should create question"`
- Watch file:      `pnpm run test:unit:watch src/path/to/file.spec.ts`

Running acceptance tests:

- Full run:                 `pnpm run test:acceptance`
- Specific feature:         `pnpm run test:acceptance tests/acceptance/features/question/admin-create-question.feature`
- Specific scenario (line): `pnpm run test:acceptance tests/acceptance/features/question/admin-create-question.feature:8`
- By scenario name:         `pnpm run test:acceptance --name "should create a question"`
- By tag:                   `pnpm run test:acceptance --tags "@question-theme"`
- Multiple tags (OR):       `pnpm run test:acceptance --tags "@question-theme or @question"`
- Exclude tag:              `pnpm run test:acceptance --tags "not @slow"`
- By tag (AND):             `pnpm run test:acceptance --tags "@question-theme and @admin"`

**Mandatory quality gates** — agents MUST run all five commands below **in order**
before considering any task complete. **Do NOT skip any gate**, even for "trivial" changes:

1. `pnpm run lint:fix`
2. `pnpm run typecheck`
3. `pnpm run test:unit:cov`
4. `pnpm run test:mutation`
5. `pnpm run test:acceptance`

If any gate fails, fix the issue and re-run from that gate onward until all five pass.

> Gates 4 (mutation) and 5 (acceptance) are CI/post-commit gates. Pre-commit hooks run: `typecheck` → `validate:branch-name` → `lint:staged:fix` → `test:unit:staged`.

### Definition of Done (DOD) — Conditional Checklist

Evaluate all items at the end of implementation. Each applies only if its condition is met.

1. **Quality Gate**: Any code change → run all 5 gate commands above.
2. **Bruno Collection**: Endpoint added/changed/deleted → update `.bru` files in `configs/bruno/Goat It/` following naming convention `<scope>-<verb>-<resource>[-by-id].bru`.
3. **Acceptance Test Scenarios**: API behavior changed → add/update Cucumber scenarios covering happy path and key error cases.
4. **Schemas Package — Existing Export Modified**: DTO shape or domain constant already in `@goat-it/schemas` modified → bump **patch** version in `packages/schemas/package.json`.
5. **Schemas Package — New Export Candidate**: New DTO shape/constant/value-object → **ask the user** whether to export. If yes: add re-export, update `package.json` exports + `tsdown.config.ts` entries, bump patch version.
6. **GlobalExceptionFilter**: New domain error class → add mapping in `GlobalExceptionFilter.domainErrorHttpExceptionFactories` at `src/shared/infrastructure/http/filters/global-exception/global-exception.filter.ts`.
7. **Faketories for New Types**: New entity/DTO/command/contract/Mongoose document → create faketory under `tests/shared/utils/faketories/` named `createFake<ConceptName>(overrides)`.
8. **Mock Factories for New Ports**: New repository port or use case → create mock factory under `tests/unit/utils/mocks/` named `createMocked<What>(overrides)`.
9. **NestJS Module Registration**: New controller/use-case/repository → register in the appropriate module. See `docs/ARCHITECTURE.md` for DI patterns.
10. **Acceptance Test Infrastructure for New Domains**: New domain/MongoDB collection → update world types, fixture registry, payload types, fixture inserters.

## Repository structure

```
src/
  app/                  # App module, root controller
  contexts/
    question/           # Question bounded context (single aggregate)
      domain/           # constants/, types/, rules/, errors/, repositories/
      application/
      infrastructure/
      question.module.ts
    question-theme/     # Question-Theme bounded context
      domain/           # constants/, types/, rules/, errors/, repositories/
      application/
      infrastructure/
      question-theme.module.ts
  infrastructure/       # Cross-cutting (auth, health, config, database)
  shared/               # Shared domain, application, infrastructure utilities

tests/
  unit/                 # Vitest specs (mirrors src/ structure)
  shared/utils/
    faketories/         # Factory functions (uses @faker-js/faker)
    helpers/            # Shared test helpers
  acceptance/           # Cucumber feature files + step definitions
  mutation/             # Stryker incremental results (committed)
```

## Architecture

Each bounded context follows Clean Architecture / Hexagonal (Ports & Adapters):

- `domain/` — entities, value-objects, errors, commands, contracts, repository interfaces (ports)
- `application/` — use-cases, DTOs (Zod shapes + nestjs-zod wrappers), mappers
- `infrastructure/` — controllers, Mongoose repositories (adapters), HTTP pipes/filters/guards

**Data flow**: `Controller` → validates with Zod DTO → maps to domain command → `UseCase` → calls repository port → maps result to response DTO. Domain errors bubble up and are converted by `GlobalExceptionFilter`.

### Domain rules (`domain/rules/`)
- *Predicates* (`is*`, `has*`, `can*`): pure boolean functions
- *Policies* (`ensure*`): enforce business rules, throw domain errors
- *Helpers*: descriptive names for pure transformation functions

### Repository pattern
- Interface in `domain/repositories/*.repository.types.ts`
- Symbol injection token in `domain/repositories/*.repository.constants.ts`
- Mongoose implementation in `infrastructure/persistence/mongoose/repository/`
- Use `@Inject(TOKEN)` in use-cases; register with `{ provide: TOKEN, useClass: Implementation }`

## Path aliases

No relative `../` or `./` imports are permitted. Use path aliases everywhere.

| Alias                    | Resolves to                       |
|--------------------------|-----------------------------------|
| `@package-json`          | `package.json`                    |
| `@src/*`                 | `src/*`                           |
| `@app/*`                 | `src/app/*`                       |
| `@shared/*`              | `src/shared/*`                    |
| `@configs/*`             | `configs/*`                       |
| `@question/*`            | `src/contexts/question/*`         |
| `@question-theme/*`      | `src/contexts/question-theme/*`   |
| `@unit-tests/*`          | `tests/unit/*`                    |
| `@mocks/*`               | `tests/unit/utils/mocks/*`        |
| `@faketories/*`          | `tests/shared/utils/faketories/*` |
| `@test-helpers/*`        | `tests/shared/utils/helpers/*`    |
| `@acceptance-tests/*`    | `tests/acceptance/*`              |
| `@acceptance-features/*` | `tests/acceptance/features/*`     |
| `@acceptance-support/*`  | `tests/acceptance/support/*`      |

When adding a new bounded context, register its alias in `configs/swc/swc.config.json`, `configs/typescript/tsconfig.app.json`, and `configs/vitest/vitest.config.ts`.

## Project conventions & style

### TypeScript
- Strict mode — no `any`, no non-null assertions (`!`)
- Prefer `type` over `interface` (`consistent-type-definitions: type`)
- Use `type` imports for type-only symbols (`consistent-type-imports`)
- All functions must have explicit return types (`explicit-function-return-type`)
- All class members must have explicit accessibility (`explicit-member-accessibility`)
- Constructor injection parameters use `private readonly` shorthand
- No enums — use `as const` objects with exported constant arrays (except for `ControllerPrefixes` enum in shared infrastructure which is used for route string building)
- No `switch`/`case` — use polymorphism, object maps, or conditional chains
- Ternaries for **value assignment only** — never for side effects
- Boolean variables/properties must be prefixed: `is`, `has`, `can`, `should`, `was`, `were`, `are`, `does`, `did`, `must`
- Never wrap primitive types in type aliases (no `type UserId = string`)
- No inline `export function` / `export const` — declare first, export at the end (classes may use inline `export class` since only one class per file)
- No type re-exports — import types from their canonical source

### Formatting
- Indent: 2 spaces; Quotes: double; Semicolons: always; Trailing commas: multiline
- Max line length: 180; Max lines per function: 30 (except tests)
- No final newline (except `.yml`, `.sh`, `.env*`, `.json`, `.md`); EOL: LF

### Naming
- Files/dirs: `kebab-case`; Classes/types: `PascalCase`
- Functions/methods/properties: `camelCase`; Exported constants: `UPPER_CASE`
- Test files: `<name>.spec.ts` co-located with source
- CRUD verbs: `Create`, `Modify` (not Update for patches), `Archive` (soft-delete), `Find`, `Remove` (detach)
- Import groups (blank line separated): (1) node:*, (2) external, (3) internal aliases, (4) test aliases, (5) `import type`

### DTOs
- Zod schema in `*.dto.shape.ts`: export `const FOO_DTO = z.object(...)` and `type FooDto = z.infer<typeof FOO_DTO>`. Use `z.strictObject` for response shapes. Add `.describe()` and `.meta({ example })`.
- nestjs-zod wrapper in `*.dto.ts`: `class FooNestZodDto extends createZodDto(FOO_DTO) {}`
- DTO shape tests cover every field with positive + negative tests.

### Errors
- Custom error classes extend `Error`, set `this.name` in constructor
- Each error class in its own subdirectory: `domain/errors/<error-name>/<error-name>.error.ts`
- Never throw strings or non-Error objects

### Constants
- No magic numbers (0, 1, -1 excepted) — extract to `*.constants.ts`

### Lint disable comments (last resort)
- Two-line format:
  ```ts
  // Acceptable as <concise justification>
  // oxlint-disable-next-line <rule-name(s)>
  ```
- Never file-level or block-level disables without approval
- Rule names use oxlint namespacing (`typescript/no-...`, `unicorn/...`, `eslint/...`) — no `@` prefix

## Tests and test style

- Framework: Vitest with globals enabled (`describe`, `it`, `expect`, `vi`, `beforeEach`)
- 100% coverage required (all branches, lines, functions)
- Excluded from coverage: `*.module.ts`, `**/mongoose/**/*.schema.ts`, `*.constants.ts`, `*.types.ts`, `*.dto.ts`, `*.pipeline.ts`, `*.commands.ts`, `*.contracts.ts`, `*.entities.ts`, `*.value-objects.ts`
- **Stryker mutation excludes differ**: mutation excludes `*.entities.ts` and `*.value-objects.ts` in addition to all coverage exclusions (`*.pipeline.ts`, `*.schema.ts`, `*.constants.ts`, `*.module.ts`, `*.types.ts`, `*.commands.ts`, `*.contracts.ts`). Only `*.dto.ts` files remain subject to mutation testing beyond standard source files.
- Use `@nestjs/testing` `Test.createTestingModule` for NestJS providers
- One assertion per `it` block; `it.each` for parametrized cases
- Private methods tested via `ClassName["privateMethod"](...)`

### Mocks (`@mocks/*`)
- Named `createMocked<What>(overrides: Partial<MockedWhat> = {})`, return `vi.fn()`-based typed objects
- Mock at the port level (repository/use-case interface), not internal Mongoose details
- Inject via Nest `useValue` providers in `createTestingModule`

- Infrastructure registration checklist:
  - New mock factory → inject via `useValue` in test module (no global registry)
  - New faketory → follow `tests/shared/utils/faketories/` layer organization
  - New bounded context → register path aliases in `configs/swc/swc.config.json`, `configs/typescript/tsconfig.app.json`, and `configs/vitest/vitest.config.ts`
  - New Bruno endpoint → add `.bru` file under `configs/bruno/Goat It/`

### Faketories (`@faketories/*`)
- Named `createFake<EntityName>(overrides: Partial<T> = {})`, spread overrides last
- Use `@faker-js/faker` for randomized values; randomize optional fields
- Organized by layer: `entity/`, `dto/`, `mongoose/`, `commands/`, `contracts/`

## Git / commit / PR expectations

- **Never commit unless the user explicitly asks for it.** Do not create commits autonomously.
- Do not commit `.env.*` files with real secrets (`.env.example` is safe).
- Husky pre-commit hooks are active; never bypass with `--no-verify`.
- Conventional commits enforced by commitlint: `type(scope): message`.
- Validate branch names: `pnpm run validate:branch-name`.
- Branches: `<type>/<scope>-<short-desc>` (e.g. `feat/add-user-endpoint`).

## Agent skills (`.agents/skills/`)

Each skill has a `SKILL.md` entry point. Load only the relevant skill for the task.

Available skills: `brainstorming`, `create-faketory`, `create-mock`, `receiving-code-review`, `write-acceptance-test`, `write-unit-test`, `writing-plans`, `writing-skills`.

- **When writing unit tests**: load the `write-unit-test` skill first.
- **When writing acceptance tests**: load the `write-acceptance-test` skill first.
- **When creating faketories/mocks**: load `create-faketory` / `create-mock`.

## OpenCode commands (`.opencode/commands/`)

Slash commands available in OpenCode sessions:

- `/brainstorming`         – Explore intent, requirements and design before implementation
- `/create-faketory`       – Scaffold a faketory for an entity, DTO, command or Mongoose document
- `/create-mock`           – Scaffold a typed Vitest mock factory for a repository or use-case port
- `/write-acceptance-test` – Write or complete a Cucumber acceptance test scenario
- `/write-unit-test`       – Write or complete a unit test file following 100%-coverage conventions
- `/writing-skills`        – Create, edit, or verify an agent skill

## Useful docs (`docs/`)

- `docs/superpowers/`              – Agent workflow artifacts: `specs/` (design specs from brainstormer), `plans/` (implementation plans from writing-plans).
- `docs/ARCHITECTURE.md`          – Hexagonal architecture, layers, data flow, DI patterns
- `docs/BRUNO.md`                 – Bruno API collection setup
- `tests/unit/README.md`          – Full unit test writing guide per file type
- `tests/unit/utils/mocks/README.md` – Mock factory conventions
- `tests/shared/utils/faketories/README.md` – Faketory conventions
- `tests/acceptance/README.md`    – Acceptance test guide (Cucumber, fixtures, payloads, steps)

## MemPalace (persistent project memory)

MemPalace stores project context as searchable embeddings. It runs as an MCP server
(prefixed `mcp_mempalace_*`). All data stays on your machine.

- Wing: `goat_it_api` | Rooms: `app`, `contexts`, `infrastructure`, `shared`, `src`, `testing`, `documentation`, `configuration`, `packages`, `scripts`, `general`
- For codebase context: `mcp mempalace_search "query" --wing goat_it_api`
- File learnings after decisions: `mcp mempalace_kg_add`
- Write diary entries at session end: `mcp mempalace_diary_write`

## Useful paths

- Vitest config:    `configs/vitest/vitest.config.ts`
- SWC config:       `configs/swc/swc.config.json`
- NestJS CLI config: `configs/nest/nest-cli.config.json`
- Stryker config:   `configs/stryker/stryker.config.mjs`
- ESLint config:    `eslint.config.ts` + `configs/eslint/flat-configs/`
- Oxlint config:    `oxlint.config.jsonc`
- Cucumber config:  `configs/cucumber/cucumber.json`
- Env files:        `env/`
- Test setup:       `tests/unit/setup/`
- Test utilities:   `tests/unit/utils/mocks/`, `tests/shared/utils/faketories/`
