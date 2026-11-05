# TEST — Testing & QA

Effectiveness and reliability of the Goat It API test suites: the Vitest unit layer across controllers, use cases, repositories, mappers, helpers, errors and module graphs; the 100 % coverage gate and what its exclusion lists hide; Stryker mutation testing and its committed incremental state; the Cucumber acceptance suite against the built Fastify app and the Dockerized MongoDB sandbox; mocks, faketories and fixture/payload registries; the five mandatory quality gates and pre-commit hooks; determinism, isolation, assertion quality and tooling drift. The mechanical per-file spec and step checklist is also enforced by `/lint-unit-tests` and `/lint-acceptance-tests`; the checks below are the audit's independent contract and apply in full audits, while diff mode uses only the strategy checks `[TEST-23]`, `[TEST-24]` and `[TEST-25]`.

**Decision doc:** `docs/unit-tests.md` / `docs/acceptance-tests.md` (section `## GOAT audit decisions`). **Diff triggers:** see SKILL.md category index.

**Not in this category:** framework wiring, DI metadata and module composition correctness → STACK · domain invariants and error classification → LOGIC · CI job graph, required checks and artifact retention → CICD · dependency and secret scanning → SUP · runtime log operation and alerting → OPS · documentation drift outside the testing guides → DOCS · mechanical per-file formatting → `/lint-unit-tests` and `/lint-acceptance-tests` (the audit checks the outcomes, not the lint mechanics)

## Contents

- [1. Unit test conventions](#1-unit-test-conventions)
- [2. Coverage](#2-coverage)
- [3. Mutation testing](#3-mutation-testing)
- [4. Acceptance testing](#4-acceptance-testing)
- [5. Mocks and faketories](#5-mocks-and-faketories)
- [6. DOD and quality gates](#6-dod-and-quality-gates)
- [7. Test quality](#7-test-quality)
- [8. Test tooling hygiene](#8-test-tooling-hygiene)
- [Sources](#sources)

## 1. Unit test conventions

- **[TEST-01] Unit suite runs on Vitest with globals and shared setup** — The single unit-runner config enables `globals: true`, loads the shared setup file, anchors the root at the repository root and includes only co-located `src/**/*.spec.ts`; no spec imports `describe`, `it`, `expect` or `vi` from `vitest`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `configs/vitest/vitest.config.ts`, `src/**/*.spec.ts`, `tests/unit/setup/**` · Src: [1], [11], project: docs/unit-tests.md
- **[TEST-02] Nest providers compiled through `Test.createTestingModule`** — Every controller, module and Nest-provided service/repository spec builds its subject through `Test.createTestingModule`, injects collaborators through `useValue` providers and resolves the subject by class or token; no spec instantiates a decorated Nest class with `new`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/**/*.controller.spec.ts`, `src/**/*.module.spec.ts`, `src/**/*.repository.spec.ts` · Src: [11], project: docs/unit-tests.md
- **[TEST-03] One assertion per `it` block** — Each `it` block contains exactly one assertion statement; multi-outcome verifications are split into separate `it` blocks or a parametrized table, so a failure names the single violated expectation.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/**/*.spec.ts` · Src: [1], project: AGENTS.md
- **[TEST-04] Parametrized cases are typed `it.each<T>`** — Every `it.each` and `describe.each` call supplies an explicit row type parameter, and each row carries its input and expected output with no `any` or implicit widening.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/**/*.spec.ts` · Src: [1], project: docs/unit-tests.md
- **[TEST-05] Top-level describe labels follow the file type** — Controllers, use cases, repositories, services, errors and helpers/mappers use the class or function symbol as the top-level `describe` label; DTO shape specs use the string `"<DTOName> DTO Shape"`; every spec file has exactly one top-level describe.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/**/*.dto.shape.spec.ts`, `src/**/*.use-case.spec.ts`, `src/**/*.controller.spec.ts` · Src: [1], project: docs/unit-tests.md
- **[TEST-06] DTO shape specs use inline literals, not faketories** — `validDto` in a `*.dto.shape.spec.ts` is an inline literal declared with a structural type, negative cases spread-copy it, and the file imports no `@faketories/*` symbol and performs no `as SomeDto` cast.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/**/*.dto.shape.spec.ts` · Src: [1], project: docs/unit-tests.md
- **[TEST-07] Private members are exercised through bracket notation** — A private method or field under test is reached as `ClassName["privateMember"](…)` (or through the equivalent typed stub), so the spec proves the private branch without widening the production visibility.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/**/*.spec.ts` · Src: [1], project: docs/unit-tests.md
- **[TEST-08] Error paths assert the exact error instance** — Synchronous failures use `expect(() => call()).toThrow(<exact instance>)` and asynchronous failures use `await expect(promise).rejects.toThrow(<exact instance>)`; no error test accepts any thrown value or asserts only a free-text message.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/**/*.spec.ts` · Src: [1], project: AGENTS.md
- **[TEST-09] Test names follow the `should … when …` pattern** — Every `it` title and `it.each` row title states the expected behaviour first and the triggering condition second, ends with a period and names no implementation step.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `src/**/*.spec.ts` · Src: [1], project: docs/unit-tests.md
- **[TEST-10] Every Nest module has a wiring spec** — Each `*.module.ts` in coverage scope has a co-located `.module.spec.ts` that compiles the real module graph with mocked model tokens, resolves every registered use case and controller by class token and asserts multi-dependency injection; the compile itself proves no `forwardRef` or module cycle is required.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/**/*.module.ts`, `src/**/*.module.spec.ts` · Src: [11], project: docs/unit-tests.md

## 2. Coverage

- **[TEST-11] Coverage include covers every production source** — `coverage.include` selects all of `src/**/*.ts`, because Vitest otherwise reports only files imported during the run and a never-imported file escapes the threshold entirely.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `configs/vitest/vitest.config.ts` · Src: [2], [12]
- **[TEST-12] All four coverage metrics gated at 100 %** — `coverage.thresholds` sets `100: true`, which is the shortcut for statements, branches, functions and lines at 100; a lines-only threshold or per-file relaxation is not accepted.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `configs/vitest/vitest.config.ts` · Src: [2], [3], project: docs/unit-tests.md
- **[TEST-13] Coverage exclusions are narrow and authoritative** — The exclusion list in the Vitest config contains only constants, types, commands, DTO wrappers, entities, value objects, pipeline files and Mongoose schemas, is the single source of truth (no copy in prose), and no excluded class carries executable logic that a spec should exercise.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `configs/vitest/vitest.config.ts`, `docs/unit-tests.md` · Src: [2], [3], project: docs/architecture.md §10
- **[TEST-14] Coverage scope and spec inventory agree** — Every non-excluded production file under `src/` has a co-located spec, and every `*.module.ts` remains inside coverage and mutation scope with its wiring spec present; an exclusion added for one file does not silently drop a whole directory.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/**/*.ts`, `src/**/*.spec.ts`, `configs/vitest/vitest.config.ts` · Src: [2], project: docs/architecture.md §10
- **[TEST-15] No coverage ignore hints hide production code** — No file under `src/` contains `v8 ignore`, `c8 ignore` or `istanbul ignore` hints; untestable code moves to an excluded file class instead of being annotated out of the report.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/**/*.ts` · Src: [2], project: docs/unit-tests.md

## 3. Mutation testing

- **[TEST-16] Stryker is the single mutation authority and mutates production source** — The Stryker config selects `src/**/*.ts`, excludes specs and the documented non-executable file classes, enables the TypeScript checker, uses the Vitest runner with the unit config and keeps `ignoreStatic: false` so static mutants are not skipped.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `configs/stryker/stryker.config.mjs`, `package.json` · Src: [5], [7]
- **[TEST-17] Mutation score gates the build at 100** — `thresholds.high`, `thresholds.low` and `thresholds.break` are all 100, so any surviving mutant fails the run rather than only colouring the report; the CI variant inherits the same thresholds.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `configs/stryker/stryker.config.mjs`, `configs/stryker/stryker-ci.config.mjs` · Src: [5], [6]
- **[TEST-18] Incremental state is preserved and committed** — The incremental file lives under the mutation state directory and is tracked; a gate run rewrites it on purpose and the produced file must stay in the working tree and be reported with the change — never reverted with `git checkout --`, `git restore`, `rm` or an older blob, including after the acceptance gate.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `tests/mutation/incremental/incremental.json`, `configs/stryker/stryker.config.mjs` · Src: [6], project: AGENTS.md
- **[TEST-19] Mutation exclusions mirror coverage exclusions** — The Stryker `mutate` exclusions and the Vitest `coverage.exclude` list cover the same non-executable file classes; a file excluded from coverage is either excluded from mutation or mutated on purpose, with no class silently exempt from both gates.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `configs/stryker/stryker.config.mjs`, `configs/vitest/vitest.config.ts` · Src: [5], project: docs/architecture.md §10
- **[TEST-20] Local and CI mutation commands are distinct and documented** — The package scripts expose an incremental local run, a forced full run and a CI run that loads the CI config; documentation uses the incremental command for development and the CI command in CI, so a local run cannot overwrite the committed CI state by accident.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `package.json`, `docs/ci-cd.md` · Src: [5], [6], project: docs/unit-tests.md
- **[TEST-21] Surviving mutants are triaged, never suppressed blindly** — A non-empty survivor set is investigated as a missing assertion or a genuinely equivalent mutant; no `// Stryker disable` directive is added without a one-line justification, and an equivalent mutant is recorded rather than deleted from the report.
  Evidence: `command` · Diff: ✗ · Severity: high · Src: [5], [12]

## 4. Acceptance testing

- **[TEST-22] Cucumber loads the declared features, steps and support code** — The Cucumber config loads `tests/acceptance/features/**/*.feature`, requires both support and step-definition TypeScript, transpiles through `tsx/esm`, disables publishing, writes JUnit, JSON and message reports and runs four workers.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `configs/cucumber/cucumber.json` · Src: [8], [10], project: docs/acceptance-tests.md
- **[TEST-23] Every HTTP route has an acceptance scenario** — Every route exposed by the controllers is requested by at least one `.feature` scenario (directly or through a shared step), and any route deliberately left out is listed with a reason in the acceptance guide; a diff adding or changing a route adds or updates its scenario.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/**/*.controller.ts`, `tests/acceptance/features/**/*.feature` · Src: [12], project: docs/acceptance-tests.md
- **[TEST-24] New API behaviour ships with a happy-path and error-path scenario** — A change that adds or alters observable API behaviour adds or updates the matching feature with a success scenario and at least one key failure scenario (validation, authentication, not found or conflict), asserting status and body.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `tests/acceptance/features/**/*.feature`, `src/contexts/**/*.controller.ts` · Src: [12], project: AGENTS.md
- **[TEST-25] Bug fixes carry a regression test** — A `fix:` change adds or modifies a unit spec or acceptance scenario that fails without the fix and whose title names the fixed condition; of the last 20 `fix:` commits touching `src/`, every one also touches a `*.spec.ts` or `.feature`, with any exception justified in the commit or pull request.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `src/**/*.spec.ts`, `tests/acceptance/features/**/*.feature` · Src: [1], [12]
- **[TEST-26] Fixtures are registered with dependencies and inserters** — Every fixture set is registered in the fixture registry with its optional dependencies, every new domain has an inserter that writes through the world's Mongoose model, and dependency resolution is recursive with circular dependencies rejected.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `tests/acceptance/support/fixtures/**` · Src: [1], project: docs/acceptance-tests.md
- **[TEST-27] Payloads are deterministic and registry-addressed** — Every acceptance payload is built from faketories with concrete overrides (no unseeded faker value), references fixture entry ids where needed, and is registered under a scope/type/name triple that a shared Given step can resolve.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `tests/acceptance/support/payloads/**` · Src: [1], project: docs/acceptance-tests.md
- **[TEST-28] World and hooks isolate and clean up each run** — The custom world owns the last response, payload snapshot, app process and models; `BeforeAll` connects the database and starts the built app, `Before` resets the database and attaches the process, `After` prints diagnostics only on failure, and `AfterAll` closes the connection and kills the app process group.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `tests/acceptance/support/hooks.ts`, `tests/acceptance/support/types/world.types.ts`, `tests/acceptance/support/helpers/setup/**` · Src: [10], project: docs/acceptance-tests.md
- **[TEST-29] Every scenario starts from a clean database** — The per-scenario hook drops and recreates all collections before the scenario body runs, and no scenario depends on data, ordering or state produced by another scenario or by a previous worker.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `tests/acceptance/support/hooks.ts`, `tests/acceptance/support/helpers/test-database.helpers.ts`, `tests/acceptance/features/**/*.feature` · Src: [13], project: docs/acceptance-tests.md
- **[TEST-30] Retries never mask flakiness** — Neither the Cucumber config nor the acceptance command retries failed scenarios; if retries are ever enabled, a scenario that passes only on retry is reported as flaky and counted, never as passed.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `configs/cucumber/cucumber.json`, `.github/actions/acceptance-tests/**` · Src: [10]
- **[TEST-31] Acceptance runs the production build against the Dockerized database** — The suite builds the app first and starts the built process (`node dist/main`) against the locally Dockerized MongoDB, never against a development server or an in-memory database; the sandbox image is pinned to a released version rather than a moving tag.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `package.json`, `docker/goat-it-api-acceptance-tests/**`, `tests/acceptance/support/helpers/setup/**` · Src: [10], project: docs/ci-cd.md
- **[TEST-32] Step definitions are domain-organized and unambiguous** — Steps live under the matching domain/audience folder with `<domain>[-<sub>].<given|when|then>-steps.ts` names, use named capture groups, declare `this: GoatItWorld`, and no two definitions match the same Gherkin text; a new domain step appears only when no shared request step covers the action.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `tests/acceptance/features/step-definitions/**/*.ts` · Src: [8], [9], project: docs/acceptance-tests.md
- **[TEST-33] DataTable schemas are strict and coercing** — Every DataTable schema is a `z.strictObject` with the documented coercion helpers for optional cells, unknown or misspelled columns fail the scenario, and each schema is colocated under a `datatables/` folder beside its step file.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `tests/acceptance/features/step-definitions/**/datatables/**` · Src: [9], project: docs/acceptance-tests.md
- **[TEST-34] Failures are diagnosable without a rerun** — A failed scenario flushes the application log ring buffer, prints the world state (last request, payload and response) and leaves the JUnit/JSON reports under the acceptance reports directory, so a CI failure is explainable from the run artifacts alone.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `tests/acceptance/support/hooks.ts`, `tests/acceptance/support/helpers/setup/**`, `configs/cucumber/cucumber.json` · Src: [10], project: docs/acceptance-tests.md

## 5. Mocks and faketories

- **[TEST-35] Mock factories are named and typed `createMocked<What>`** — Every mock factory under the shared mocks tree is named `createMocked<What>(overrides: Partial<MockedWhat> = {})`, returns a `vi.fn()`-based object typed against the real contract and spreads overrides last; the documented `createMockedNestConfigService` argument exception is the only variant.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `tests/unit/utils/mocks/**`, `docs/mocks.md` · Src: [4], project: docs/mocks.md
- **[TEST-36] Mocks sit at the boundary the subject depends on** — Use cases mock the repository port or published use case, controllers mock the use case, repositories mock the Mongoose model, and no spec mocks the module it is testing or one of that module's own pure helpers.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `src/**/*.spec.ts`, `tests/unit/utils/mocks/**` · Src: [4], project: docs/architecture.md §10
- **[TEST-37] Faketories follow the `createFake<Concept>` signature** — Every faketory is named `createFake<ConceptName>`, accepts `Partial<T> = {}` as its last parameter and spreads that parameter last, uses faker for generated values, randomizes genuinely optional fields and exposes named exports only.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `tests/shared/utils/faketories/**`, `docs/faketories.md` · Src: [4], project: docs/faketories.md
- **[TEST-38] Faketories mirror the source layer organization** — Faketories are grouped by layer (`aggregate/`, `entity/`, `dto/`, `commands/`, `domain/`, `repository-contracts/`, `contracts/dto/`, `mongoose/`) and mirror the source path; published-contract DTO factories never mix with internal application DTO factories, and `question-theme` is a top-level context.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `tests/shared/utils/faketories/**` · Src: [1], project: docs/faketories.md
- **[TEST-39] Faketories draw from domain constants and shared helpers** — Enum-like fields use `faker.helpers.arrayElement` over the exported domain constant arrays, Mongoose ids use the shared ObjectId helper, and document faketories derive `id` from `_id`; no faketory hardcodes a domain value that a constant already publishes.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `tests/shared/utils/faketories/**`, `src/shared/domain/constants/**` · Src: [1], project: docs/faketories.md
- **[TEST-40] No ad-hoc mock or fake object is built inline** — Specs import shared mock and faketory factories instead of hand-writing a collaborator stub or a domain object literal; a missing factory is added under the shared trees rather than duplicated in a spec.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/**/*.spec.ts`, `tests/unit/utils/mocks/**`, `tests/shared/utils/faketories/**` · Src: [4], project: docs/unit-tests.md

## 6. DOD and quality gates

- **[TEST-41] The five quality gates run in order for every code change** — Any code change runs `pnpm run lint:fix`, `pnpm run typecheck`, `pnpm run test:unit:cov`, `pnpm run test:mutation` and `pnpm run test:acceptance` in that order before the task is considered complete; a failure is fixed and the sequence resumes from the failed gate, and no gate is skipped as trivial.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `AGENTS.md`, `package.json`, `docs/ci-cd.md` · Src: [1], project: AGENTS.md
- **[TEST-42] Pre-commit hooks run the four blocking checks in order** — The pre-commit hook runs typecheck, branch-name validation, staged lint fixes and staged unit tests in that order, and the commit-msg hook runs commitlint; the hook script fails fast and uses the repository package manager.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.husky/pre-commit`, `.husky/commit-msg`, `package.json` · Src: [1], project: docs/ci-cd.md
- **[TEST-43] Hooks are never bypassed** — No documented workflow, script, agent command or commit instruction uses `--no-verify`; bypassing is described only as a discouraged exception whose consequences are stated.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `AGENTS.md`, `docs/ci-cd.md`, `.github/CONTRIBUTING.md`, `.husky/pre-commit` · Src: [1], project: AGENTS.md
- **[TEST-44] Specs are co-located with their source** — Every first-party `*.spec.ts` sits next to the file it tests and uses the `<source-basename>.spec.ts` name; shared faketories, mocks and acceptance assets stay under `tests/` and never under `src/`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/**/*.spec.ts`, `tests/**` · Src: [12], project: docs/architecture.md §10
- **[TEST-45] The conditional DOD checklist is evaluated at the end of every task** — Every applicable DOD item is checked in the final report: gates, Bruno collection, acceptance scenarios, schemas package version, new error classification, faketories, mocks, module registration and acceptance infrastructure; an inapplicable item is explicitly marked N/A rather than omitted.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `AGENTS.md` · Src: [1], project: AGENTS.md
- **[TEST-46] A new domain updates the acceptance infrastructure** — Adding a bounded context or MongoDB collection updates the world model map, the fixture registry and inserters, the payload types and the fixture sets in the same change; no acceptance helper references a collection by an unregistered name.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `tests/acceptance/support/types/world.types.ts`, `tests/acceptance/support/fixtures/**`, `tests/acceptance/support/payloads/**` · Src: [1], project: AGENTS.md

## 7. Test quality

- **[TEST-47] Tests assert observable behaviour, not implementation detail** — Specs assert returned values, thrown errors and collaborator calls at the boundary; they do not assert private call order, internal counters or a component's internal state, and a refactor that preserves behaviour does not require a spec rewrite.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/**/*.spec.ts`, `tests/acceptance/features/**/*.feature` · Src: [12], [13]
- **[TEST-48] Time, randomness and ordering are controlled** — A spec that depends on the clock installs fake timers or fixes the system time and restores real timers afterward, a faketory value an assertion depends on is passed explicitly through overrides, and no test depends on unseeded faker output, real wall-clock dates or MongoDB natural ordering.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `src/**/*.spec.ts`, `tests/shared/utils/faketories/**`, `tests/acceptance/support/fixtures/**` · Src: [13], [1]
- **[TEST-49] No focused, skipped or placeholder tests in committed code** — No committed spec contains `.only`, `.skip`, `.todo`, `xit`, `xdescribe` or an empty test body; a temporarily disabled test is deleted or tracked by an issue, never merged as a silent skip.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `src/**/*.spec.ts`, `tests/acceptance/features/**/*.feature`, `configs/vitest/vitest.config.ts` · Src: [1], [4]

## 8. Test tooling hygiene

- **[TEST-50] Test scripts, aliases and configs stay in sync** — Every test script referenced by AGENTS.md, the README, the testing guides and the CI actions exists verbatim in `package.json`; every path alias used by the test trees is registered in the SWC, TypeScript and Vitest configs; the Stryker and Cucumber configs resolve the same source tree the scripts run.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `package.json`, `configs/vitest/vitest.config.ts`, `configs/stryker/stryker.config.mjs`, `configs/cucumber/cucumber.json` · Src: [2], [7], project: docs/architecture.md §9

## Sources

[1] JavaScript & Node.js testing best practices: https://github.com/goldbergyoni/javascript-testing-best-practices (fetched 2026-11-04)
[2] Coverage | Guide | Vitest: https://vitest.dev/guide/coverage.html (fetched 2026-11-04)
[3] coverage | Config | Vitest: https://vitest.dev/config/coverage (fetched 2026-11-04)
[4] Mocking | Guide | Vitest: https://vitest.dev/guide/mocking.html (fetched 2026-11-04)
[5] Configuration | StrykerJS: https://stryker-mutator.io/docs/stryker-js/configuration/ (fetched 2026-11-04)
[6] Incremental | StrykerJS: https://stryker-mutator.io/docs/stryker-js/incremental/ (fetched 2026-11-04)
[7] Vitest Runner | StrykerJS: https://stryker-mutator.io/docs/stryker-js/vitest-runner/ (fetched 2026-11-04)
[8] Writing better Gherkin | Cucumber: https://cucumber.io/docs/bdd/better-gherkin/ (fetched 2026-11-04)
[9] Anti-patterns | Cucumber: https://cucumber.io/docs/guides/anti-patterns/ (fetched 2026-11-04)
[10] Parallel execution | Cucumber: https://cucumber.io/docs/guides/parallel-execution/ (fetched 2026-11-04)
[11] Testing | NestJS: https://docs.nestjs.com/fundamentals/testing (fetched 2026-11-04)
[12] The Practical Test Pyramid: https://martinfowler.com/articles/practical-test-pyramid.html (fetched 2026-11-04)
[13] Eradicating Non-Determinism in Tests: https://martinfowler.com/articles/nonDeterminism.html (fetched 2026-11-04)
