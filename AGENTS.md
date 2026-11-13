# AGENTS

This file is a concise, actionable guide for automated agents working in this repository.
It explains how to build, lint and run tests (including running a single test), the workflow
gates, and the code-style conventions that are not owned by another guide.

## Architecture — mandatory reading before any file change

[`docs/architecture.md`](docs/architecture.md) is the **single source of truth** for the top-level map,
file placement, naming, layer rules, dependency direction, cross-context published surface, module
wiring, DTO and error placement, and path aliases. This file does not restate those rules.

**Before planning work, or creating, editing, moving or deleting any repository file, you MUST read
`docs/architecture.md` in full.**

- Plan writers name exact paths and companion files from it.
- Implementers stop and surface a mismatch instead of inventing a rule.
- Reviewers check placement, companions, aliases, layer dependencies and module registration against it.

If this file and the guide disagree, the guide wins.

## Build / Run / Lint / Test commands

- Package manager: `pnpm` (exact version in `package.json` -> `packageManager`).
  - Unlike npm, `pnpm` does NOT require an extra `--` before flags. Pass arguments directly:
    `pnpm run test:unit -t "should create"` (correct) vs ~~`pnpm run test:unit -- -t "should create"`~~ (unnecessary).
- Node requirement: see `package.json` -> `engines.node` and `configs/node/.node-version`.
- Stack: NestJS 12 + Fastify 5, MongoDB/Mongoose, Zod + nestjs-zod, SWC builder, ESM (`"type": "module"`).
- Dev server: `pnpm run start:dev` (`nest start --watch`; the SWC output is executed through the `tsx/esm` loader, see `exec` in `configs/nest/nest-cli.config.json`)
- Build: `pnpm run build` (`nest build` via SWC, then `tsc-alias --resolve-full-paths` to append the `.js` extensions ESM requires); production: `pnpm run start:prod` (`node dist/main`)
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
- Specific feature:         `pnpm run test:acceptance tests/acceptance/features/contexts/question/admin/create-question-as-admin.feature`
- Specific scenario (line): `pnpm run test:acceptance tests/acceptance/features/contexts/question/admin/create-question-as-admin.feature:8`
- By scenario name:         `pnpm run test:acceptance --name "should create a question"`
- By tag:                   `pnpm run test:acceptance --tags "@question-theme"`
- Multiple tags (OR):       `pnpm run test:acceptance --tags "@question-theme or @question"`
- Exclude tag:              `pnpm run test:acceptance --tags "not @slow"`
- By tag (AND):             `pnpm run test:acceptance --tags "@question-theme and @admin"`

**Mandatory quality gates** — the orchestrator runs all five commands below **in order** through the
`gatekeeper` subagent before considering any task complete. **Do NOT skip any gate**, even for
"trivial" changes:

1. `pnpm run lint:fix`
2. `pnpm run typecheck`
3. `pnpm run test:unit:cov`
4. `pnpm run test:mutation`
5. `pnpm run test:acceptance`

If any gate fails, the gatekeeper fixes the issue and re-runs from that gate onward until all five pass.

Per-task agents (implementers and other task agents) run focused checks only: scoped lint
(`pnpm run lint:oxlint:fix <path>` and `pnpm run lint:eslint:fix <path>`), scoped unit tests
(`pnpm run test:unit <path>`), and acceptance scenarios with `--tags` when relevant. They MUST NOT
run the full `lint:fix`, `test:unit:cov`, `test:mutation` or `test:acceptance` suite; the gatekeeper
owns that. Never claim "done" before the full gate passes.

> Gates 4 (mutation) and 5 (acceptance) are CI/post-commit gates. Pre-commit hooks run: `typecheck` → `validate:branch-name` → `lint:staged:fix` → `test:unit:staged`.

**Incremental test state must be saved, never restored.** Gate 4 rewrites `tests/mutation/incremental/incremental.json` (Stryker incremental state, committed on purpose under `tests/mutation/`). The file produced by a gate run MUST stay in the working tree and be reported with the change so the user can commit it. Never revert it with `git checkout --`, `git restore`, `rm`, or by copying an older blob back — this also applies after gate 5 (acceptance) has run. A large diff is expected (test-ID renumbering); report its size with `git diff --stat` instead of discarding it.

### Definition of Done (DOD) — Conditional Checklist

Evaluate all items at the end of implementation. Each applies only if its condition is met.

1. **Quality Gate**: Any code change → the orchestrator runs all 5 gate commands above through the gatekeeper.
2. **Bruno Collection**: Endpoint added/changed/deleted → update `.bru` files in `configs/bruno/Goat It/` following naming convention `<scope>-<verb>-<resource>[-by-id].bru`. See `docs/bruno.md`.
3. **Acceptance Test Scenarios**: API behavior changed → add/update Cucumber scenarios covering happy path and key error cases.
4. **Schemas Package — Existing Export Modified**: DTO shape or domain constant already in `@goat-it/schemas` modified → bump **patch** version in `packages/schemas/package.json`. Moving a shape from `application/dto` to `contracts/dto` while keeping the exported symbol stable is not a breaking package change and does not require a bump.
5. **Schemas Package — New Export Candidate**: New DTO shape/constant/value-object → **ask the user** whether to export. If yes: add re-export, update `package.json` exports + `tsdown.config.ts` entries, bump patch version.
6. **GlobalExceptionFilter**: New domain error class → classify it: add a mapping when a specific 4xx status is required, otherwise record why it intentionally falls through to 500. See `docs/architecture.md` §7.4.
7. **Faketories for New Types**: New entity/DTO/command/repository contract/published contract/Mongoose document → create faketory under `tests/shared/utils/faketories/` named `createFake<ConceptName>(<role>Overrides = {})` (the overrides parameter is role-named).
8. **Mock Factories for New Ports**: New repository port or use case → create mock factory under `tests/unit/utils/mocks/` named `createMocked<What>(overrides)`.
9. **NestJS Module Registration**: New controller/use-case/repository → register in the appropriate module. Persistence wiring goes in `infrastructure/persistence/<context>-persistence.module.ts`; published reverse dependencies go in `<context>-usage.module.ts`. Use `createUseCaseProvider` for plain use cases. Never re-register another context's schema, repository or token. See `docs/architecture.md` §6.
10. **Acceptance Test Infrastructure for New Domains**: New domain/MongoDB collection → update world types, fixture registry, payload types, fixture inserters.
11. **JSDoc**: Public logic surface added or changed → add/update its concise TSDoc block per `docs/jsdoc.md`; do not add explanatory, marker or commented-out comments.
12. **Documentation Drift**: A change to behavior, config, scripts, routes, environment variables or workflows → update every maintained guide that documents it in the same diff, including `docs/security.md`, `docs/operations.md` and `docs/privacy.md` for security, health, logging and retention changes.
13. **GOAT Audit Decisions**: A change that contradicts a documented decision → update the decision doc in the same diff; record a new decision note only with maintainer approval, per `.agents/skills/goat-audit/SKILL.md` §7.

## Project conventions & style

### TypeScript

- Strict mode — no `any`, no non-null assertions (`!`)
- Module system: ESM (`"type": "module"`) — never turn a class that Nest reads from `design:paramtypes` metadata into an `import type`: constructor-injected classes **and** DTOs used in decorated method params (`@Body()`, `@Query()`) must stay value imports, otherwise DI/`ZodValidationPipe` silently stop working. Both linters keep `consistent-type-imports` **off** for that reason.
- Prefer `type` over `interface` (`consistent-type-definitions: type`)
- Use `type` imports only for type-only symbols (never for injected classes)
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

### Constants

- No magic numbers (0, 1, -1 excepted) — extract to `*.constants.ts`

### Source comments

- Agents must not add explanatory comments, `TODO`/`FIXME` markers, section markers or commented-out code.
- The only allowed source comments are JSDoc on the public logic surfaces defined in `docs/jsdoc.md`, the two-line lint-disable pair below, and inline comments inside an `@example` sample.

### Lint disable comments (last resort)

- Two-line format:
  ```ts
  // Acceptable as <concise justification>
  // oxlint-disable-next-line <rule-name(s)>
  ```
- Never file-level or block-level disables without approval
- Rule names use oxlint namespacing (`typescript/no-...`, `unicorn/...`, `eslint/...`) — no `@` prefix

## Tests and test style

- Framework: Vitest with globals enabled (`describe`, `it`, `expect`, `vi`, `beforeEach`, `afterEach`)
- 100% coverage required (all branches, lines, functions)
- Coverage and mutation exclusion lists are authoritative in `configs/vitest/vitest.config.ts` and `configs/stryker/stryker.config.mjs`; do not copy or re-derive them. `*.module.ts` files are included in coverage and mutation scope, so every module has a colocated `.module.spec.ts`.
- Use `@nestjs/testing` `Test.createTestingModule` for NestJS providers
- One assertion per `it` block; `it.each` for parametrized cases — always typed: `it.each<T>([...])`
- Private methods tested via `ClassName["privateMethod"](...)`
- Top-level describe labels by file type:
  - Controllers: symbol reference `describe(ControllerClass, ...)`
  - Use-cases: symbol reference `describe(UseCaseClass, ...)`
  - Repositories: symbol reference `describe(RepositoryClass, ...)`
  - Services: symbol reference `describe(ServiceClass, ...)`
  - DTOs (`.dto.shape.spec.ts`): `"<DTOName> DTO Shape"` (string label)
  - Errors: symbol reference `describe(ClassName, ...)`
  - Helpers/mappers: symbol reference `describe(functionName, ...)`
- Assertion style: `toStrictEqual<T>(expected)` for value equality, `toHaveBeenCalledExactlyOnceWith(...)` for single-call assertions, `expect(() => synchronousCall()).toThrow(exactErrorInstance)` for synchronous errors (e.g., `DTO.parse(...)`) and `await expect(promise).rejects.toThrow(exactErrorInstance)` for async errors
- Vitest test callbacks (`describe`, `it`, `it.each`, `beforeEach`, `beforeAll`, `afterEach`, `afterAll`) do NOT need an explicit `: void` return-type annotation — oxlint's type-aware analysis automatically treats them as `void`-returning, even though the global `explicit-function-return-type` rule applies elsewhere. External reviewers may flag these as missing `: void`; this is a false positive for this codebase.
- Full per-file-type templates and edge cases live in `docs/unit-tests.md`.

### Mocks (`@mocks/*`)

- Named `createMocked<What>(overrides: Partial<MockedWhat> = {})`, return `vi.fn()`-based typed objects
- Mock at the boundary the SUT depends on: port for use cases, use case for controllers, Mongoose model for repositories
- Repository mocks live at `tests/unit/utils/mocks/contexts/<context>/domain/repositories/`
- Inject via `useValue` in `createTestingModule` for Nest classes; plain use cases are instantiated with `new`
- Full conventions live in `docs/mocks.md`.

- Infrastructure registration checklist:
  - New mock factory → inject via `useValue` in test module (no global registry)
  - New faketory → follow `tests/shared/utils/faketories/` layer organization
  - New bounded context → register path aliases in `configs/swc/swc.config.json`, `configs/typescript/tsconfig.app.json`, and `configs/vitest/vitest.config.ts`
  - New Bruno endpoint → add `.bru` file under `configs/bruno/Goat It/`

### Faketories (`@faketories/*`)

- Named `createFake<EntityName>(overrides: Partial<T> = {})`, spread overrides last
- Use `@faker-js/faker` for randomized values; randomize optional fields
- Organized by layer: `aggregate/`, `entity/`, `dto/`, `mongoose/{mongoose-document,mongoose-insert-payload}/`, `commands/`, `domain/`, `repository-contracts/`, `contracts/dto/`
- **DTO shape specs** (`*.dto.shape.spec.ts`): use inline literals for `validDto`, never faketories. Negative tests use `{ ...validDto, field: badValue }` (spread copy). No `as SomeDto` casts — use structural type on `let` declaration.
- Full conventions live in `docs/faketories.md`.

## Git / commit / PR expectations

- **Never commit unless the user explicitly asks for it.** Do not create commits autonomously.
- Do not commit `.env.*` files with real secrets (`.env.example` is safe).
- Husky pre-commit hooks are active; never bypass with `--no-verify`.
- Conventional commits enforced by commitlint: `type(scope): message`.
- Validate branch names: `pnpm run validate:branch-name`.
- Branches: `<type>/<scope>-<short-desc>` (e.g. `feat/add-user-endpoint`).
- Always propose a commit message once files changed: at the end of any session that modified the working tree, hand the user a ready-to-copy conventional commit message (`type(scope): summary` plus a grouped body) covering all working-tree changes, not only the last edit. Proposing is mandatory; committing remains forbidden.
- Use the `gh` CLI for GitHub work (issues, PRs, workflows, runs, reviews, comments, releases, secrets). Prefer `gh` subcommands and `gh api` over `curl` or the web UI. Read-only `gh` commands are allowed; destructive mutations are denied in `opencode.json`.

## Agent skills (`.agents/skills/`)

Each skill has a `SKILL.md` entry point. Load only the relevant skill for the task.

Available skills: `brainstorming`, `context7`, `create-faketory`, `create-mock`, `goat-audit`, `receiving-code-review`, `systematic-debugging`, `write-acceptance-test`, `write-unit-test`, `writing-plans`, `writing-skills`.

- **When writing unit tests** (including inside plans): always load the `write-unit-test` skill first and verify the result against the `.opencode/commands/lint-unit-tests.md` §4 checklist.
- **When writing acceptance tests** (including inside plans): always load the `write-acceptance-test` skill first and verify the result against the `.opencode/commands/lint-acceptance-tests.md` §4 checklist.
- **When creating faketories/mocks**: load `create-faketory` / `create-mock`.

## OpenCode commands (`.opencode/commands/`)

Slash commands available in OpenCode sessions:

- `/brainstorming`         – Explore intent, requirements and design before implementation
- `/goat-audit`            – Run the GOAT audit (full or partial across the 18 categories), then triage findings into GitHub issues, private advisories or decision notes
- `/implement-eslint-rules` – Reconcile the ESLint flat configs with available and deprecated rules
- `/implement-oxlint-rules` – Implement missing oxlint rules into `oxlint.config.jsonc`
- `/translate-questions`   – Translate not-fully-translated questions or mark them French-only
- `/lint-unit-tests`       – Audit spec files against unit testing conventions, then fix user-approved violations
- `/lint-acceptance-tests` – Audit acceptance test files against repository conventions, then fix user-approved violations

## GOAT audit (`.agents/skills/goat-audit/`)

The GOAT audit ("Greatest Of All Time" × Goat It) is the repository-wide, evidence-based audit across 18 categories. `goat-audit` is the audit contract; `/goat-audit` runs it through the read-only `goat-auditor` agent, and `final-reviewer`, `plan-writer` and `brainstormer` consume it in diff, plan and design modes.

- Reports live in gitignored `docs/audits/` because the repository is public and a report lists unfixed weaknesses. Never commit a report; never overwrite an existing one.
- Decisions recorded in a decision doc's `## GOAT audit decisions` section (category → doc mapping in the skill §6) are binding for later audits, reviews and plans until their revisit condition is met. Record one only with the maintainer's approval, through the skill §7 protocol.
- The audit never fixes anything. Findings are triaged into public issues, private draft security advisories (🔒 findings) or decision notes; fixes go through the normal orchestrator cycle.
- Never edit `.agents/skills/goat-audit/**` from an audit or review run: checklist amendments are handed off as ready-to-apply payloads and implemented through the normal cycle.
- The JSDoc requirement (surfaces, style, exclusions) is owned by `docs/jsdoc.md` and audited by `[CODE-46]`; it is not a lint-presence gate.

## Useful docs (`docs/`)

- `docs/superpowers/`        – Agent workflow artifacts: `specs/` (design specs from brainstormer), `plans/` (implementation plans from writing-plans).
- `docs/architecture.md`     – **Canonical** file placement, naming, dependency direction and companion rules. Read before any file change.
- `docs/ci-cd.md`            – Branching, commits, hooks, pull requests, CI and deployment.
- `docs/operations.md`       – Health/readiness contract, container health check, graceful shutdown and post-deploy verification.
- `docs/security.md`         – Security posture: authentication, validation, CORS, secrets, disclosure and known limitations.
- `docs/privacy.md`          – Data inventory, logging/telemetry PII policy, retention and legal posture.
- `docs/domain-logic.md`     – Question and question-theme domain rules, invariants and error contracts.
- `docs/performance.md`      – Indexing, query patterns, pagination and payload bounds.
- `docs/i18n.md`             – `Accept-Language` pipeline, locales, fallback and translation completeness.
- `docs/api-contract.md`     – HTTP surface, DTO/error conventions, Swagger, versioning and the published schemas package.
- `docs/data-model.md`       – MongoDB collections, fields, indexes, references and migration posture.
- `docs/audits/`             – Gitignored GOAT audit reports and run directories. Never committed.
- `docs/bruno.md`            – Bruno API collection setup.
- `docs/jsdoc.md`            – JSDoc scope, concise-TSDoc style, examples and enforcement.
- `docs/unit-tests.md`       – Full unit test writing guide per file type.
- `docs/mocks.md`            – Mock factory conventions.
- `docs/faketories.md`       – Faketory conventions.
- `docs/acceptance-tests.md` – Acceptance test guide (Cucumber, fixtures, payloads, steps).

The `tests/**/README.md` files are short pointers to these guides.

## MemPalace (persistent project memory)

MemPalace stores project context as searchable embeddings through the
`@rvboris/opencode-mempalace` plugin (`mempalace_memory` and `mempalace_status`).
All data stays on your machine. The plugin requires OpenCode V2 (V2 plugin API and the plural
`plugins` key); OpenCode V1 is incompatible.

- Project wing: `wing_project_goat-it-api` | Rooms: `architecture`, `workflow`, `decisions`, `bugs`, `setup`
- For codebase context: `mempalace_memory` with `mode: "search"`, `scope: "project"`, `room: "<room>"`,
  `query: "..."`. Omitting `room` searches only `workflow`; pass `architecture`, `decisions`, `bugs` or
  `setup` explicitly when relevant.
- File learnings after decisions: `mempalace_memory` with `mode: "save"` or `mode: "kg_add"`
- Write diary entries at session end: `mempalace_memory` with `mode: "diary_write"`

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
