# AGENTS.md

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
- Run locally: `pnpm run lint`, `pnpm run typecheck`, `pnpm run test:unit:cov`.
- In the PR body: explain the goal, changes, impact and rollback plan.
- Mark the PR as requiring human review if the change is medium/high risk.

### Auditability and traceability

- Agents must leave clear, traceable commits and avoid committing secrets.
- Significant automated actions should be documented in the PR/issue (logs, rationale, checks executed).

### Exceptions and contact

- For any change not clearly covered by this policy, open an issue describing the proposal and request human confirmation before implementing.

## Project summary

- Name: goat-it-api
- Version: see `package.json`, it is managed by `semantic-release`.
- Primary language: TypeScript (ES2021 targeting CommonJS as NestJS requires it).
- Framework: NestJS (with Fastify adapter)
- Build tool / transpiler: swc (via NestJS builder and `unplugin-swc` for tests)
- Test runner: Vitest (with V8 coverage provider) with `100%` coverage thresholds enforced.
- Mutation testing: Stryker with `100%` mutation score goal.
- Linting: ESLint (flat-configs under `configs/eslint`)
- Package manager: `pnpm` (see `package.json` for `packageManager` field to specify the version)
- Node engine: Node.js `>= 24` (see `package.json` `engines` field)

## High-level architecture

- Entry point: `src/main.ts` — imports and calls the bootstrap function from `src/server/server.ts`.
- Server setup: `src/server/server.ts` — builds a Nest application using `AppModule`, uses `FastifyAdapter`, enables shutdown hooks, binds to `HOST` and `PORT` (defaults: `0.0.0.0:3000`), and logs the listen URL.
- Application module: `src/app/app.module.ts` — central wiring for controllers and providers.
- Example controller: `src/app/controllers/app.controller.ts` — exposes a single GET `/` endpoint returning API metadata.
- Example service: `src/app/providers/services/app.service.ts` — reads `package.json` (via the `@package-json` alias) and returns metadata.

## Key design decisions

- NestJS is chosen for structure and dependency injection.
- Fastify is chosen for performance (via `@nestjs/platform-fastify`).
- swc used as the build/transpile tool (fast compilation) and configured in `configs/swc/swc.config.json`.
- Path aliases are used to simplify imports (`@app`, `@server`, `@package-json`, etc.). These are defined in the SWC config and used by the test runner via alias config.

## Important files and locations

(Only the most relevant files for development and automated edits are listed here.)

- `package.json` — scripts, dependencies, devDependencies, engines, and package metadata.
- `tsconfig.json` — TypeScript project configuration (root-level config for IDEs and tsc operations). It references multiple `tsconfig.*.json` files for specific purposes under `configs/typescript`.
- `configs/swc/swc.config.json` — SWC configuration for building the application (paths, decorators, module type).
- `configs/nest/nest-cli.config.json` — Nest CLI configuration (sourceRoot, SWC builder, type checking behavior).
- `configs/vitest/vitest.config.ts` — Vitest configuration including path aliases and SWC plugin for tests.
- `configs/stryker/stryker.config.mjs` — Mutation testing configuration for Stryker.
- `src/main.ts` — simple bootstrap caller.
- `src/server/server.ts` — Nest/Fastify bootstrap logic.
- `src/app/app.module.ts` — Nest module.
- `src/app/controllers/app.controller.ts` — example controller.
- `src/app/providers/services/app.service.ts` — example service that reads `package.json`.
- `src/app/providers/services/app.service.spec.ts` — unit tests for `AppService`.
- `tests/unit/` — generated test outputs and coverage artifacts (`lcov`, `HTML` reports and other coverage files); do not add source unit tests here.
- `tests/unit/utils/` — shared test utilities, factories and mocks used across multiple test suites (project-wide helpers).
- `configs/eslint/*` — ESLint flat-configs and parser declarations used by `npm run lint:eslint`.
- `configs/oxlint/*` — OXLint configurations used by `npm run lint:oxlint`.

Note: Unit test source files (implementation tests) must be colocated with their corresponding source files under `src/` using the `*.spec.ts` pattern (for example `src/modules/users/users.service.spec.ts`).

## Project Directory Structure

This project follows a predictable, feature-oriented layout. When adding files or folders, prefer the locations and naming patterns below so that code, tests and tooling remain consistent.

Top-level folders (where to add things)

- `src/` — application source. Add new runtime code here.
  - `src/server/` — server bootstrap and adapter-related code (`server.ts`, server-specific setup).
  - `src/app/` — application wiring and small shared app-level controllers/providers (used for examples and global pieces).
  - `src/modules/` — long-lived feature modules. For a new feature create `src/modules/<feature-name>/` and put the module, controllers, services and types there.
  - `src/shared/` — reusable utilities, helpers, interfaces and cross-cutting concerns.

## Naming conventions (filenames and types)

- Use the NestJS style filename pattern: `<name>.<type>.ts` where `<type>` is one of `module`, `controller`, `service`, `dto`, `types`, `pipe`, `guard`, `interceptor`, etc. Examples:
  - `users.controller.ts`
  - `users.service.ts`
  - `users.module.ts`
  - `create-user.dto.ts`
  - `users.types.ts`
- DTOs: name DTO files after the action or entity (`create-user.dto.ts`, `update-user.dto.ts`). Keep DTOs colocated with the controller/service that consumes them.
- Types/enums/constants: use `<feature>.types.ts`, `<feature>.enum.ts`, `<feature>.constants.ts` as appropriate.
- Tests: keep unit tests next to the source file using the `.spec.ts` suffix (`users.service.spec.ts`). Never put unit tests in `tests/unit` for source files.
- Mocks & Factories: use `tests/unit/utils/mocks/` and `tests/unit/utils/factories/` and name files `<feature>.mock.ts` and `<feature>.factory.ts`.

## Where to put a new module / endpoint (concrete recipe)

1. Create a directory: `src/modules/<feature-name>/` (use `kebab-case` for folder names). A feature can be a subfolder if needed (e.g., `src/modules/users/auth/`).
2. Add files using the `<feature>.<type>.ts` pattern, for example:
   - `src/modules/tasks/tasks.module.ts`
   - `src/modules/tasks/tasks.controller.ts`
   - `src/modules/tasks/tasks.service.ts`
   - `src/modules/tasks/dto/create-task.dto.ts`
   - `src/modules/tasks/tasks.types.ts`
3. Add unit tests next to source files (`tasks.service.spec.ts`) and update `src/app/app.module.ts` to import the new module if it needs to be registered globally.

## Config and tooling files

- `configs/` holds tool configurations (ESLint, Oxlint, swc, vitest, stryker, etc.). Add new tool configs in a dedicated subfolder under `configs/` and reference them from scripts where needed.
- `scripts/` holds helper shell scripts used by CI or developer workflows. Name scripts with descriptive verbs (e.g., `create-git-branch.sh`).

## General rules and small reminders

- Prefer path aliases (e.g., `@app`, `@modules`, `@shared`) when importing across the project to keep imports stable across builds and tests.
- Keep controllers thin: business logic belongs in services.
- Tests must be added/updated alongside behavioral changes. Use `.spec.ts` naming and follow existing factory/mocks helpers.
- File and folder names should be consistent and predictable — prefer `kebab-case` for folders and the `<name>.<type>.ts` pattern for files.

## Examples

- New feature "auth":
  - `src/modules/auth/auth.module.ts`
  - `src/modules/auth/auth.controller.ts`
  - `src/modules/auth/auth.service.ts`
  - `src/modules/auth/dto/login.dto.ts`
  - `src/modules/auth/auth.service.spec.ts`

- Shared util:
  - `src/shared/validators/email.validator.ts`
  - `src/shared/index.ts` (optional barrel for shared exports)

Agent rule-of-thumb: If you're unsure where to place a file, prefer `src/modules/<feature>/` when it's feature-specific, `src/shared/` for cross-cutting utilities, and `configs/` for tooling/configuration.

## Environment variables

- HOST (optional) — server host; default `0.0.0.0`.
- PORT (optional) — server port; default `3000`.

## Common scripts

From `package.json` (standard usage):

- Setup / lifecycle:
  - `pnpm install` — install dependencies (pnpm is the expected package manager).
- Development / runtime:
  - `pnpm run start` — run the app (uses Nest start with SWC builder as configured).
  - `pnpm run start:dev` — start in watch mode.
  - `pnpm run start:prod` — run the built `dist/main.js`.
- Build / typecheck:
  - `pnpm run build` — run `nest build` with `configs/nest/nest-cli.config.json` (swc builder).
  - `pnpm run typecheck` — run `tsc -b --clean && tsc -b --noEmit`.
- Linting:
  - `pnpm run lint` — run ESLint and Oxlint checks. Oxlint is run first, then ESLint.
  - `pnpm run lint:fix` — fix lint issues with ESLint and Oxlint where possible.
  - `pnpm run lint:eslint` — run only ESLint.
  - `pnpm run lint:oxlint` — run only Oxlint.
- Tests:
  - `pnpm run test` or `pnpm run test:unit` — run unit tests using Vitest.
  - `pnpm run test:unit:cov` — run unit tests with a coverage report. If coverage thresholds of `100%` are not met, the command fails.
  - `pnpm run test:unit:watch` — watch mode for unit tests.
- Mutation testing (expensive / CI):
  - `pnpm run test:mutation` — run Stryker (configurable via `configs/stryker`).
  - `pnpm run test:mutation:ci` — CI-oriented mutation run.
- Docker:
  - `pnpm run docker:build` — build a Docker image using `Dockerfile`.
  - `pnpm run docker:build:linux/amd64` — build a Linux AMD64 image.
  - `pnpm run docker:build:linux/arm64` — build a Linux ARM64 image.

## Testing conventions

- Test framework: Vitest with globals enabled.
- Test files live next to source with `*.spec.ts` pattern and Vitest is configured to include `src/**/*.spec.ts`.
- Tests use path aliases to reference source, mocks and factories.
- Coverage: V8 provider; coverage directory `tests/unit/coverage`. Coverage thresholds are enforced via config and currently set to `100%` for all metrics.
- Mocks and factories: under `tests/unit/utils/mocks` and `tests/unit/utils/factories`. Use the provided helpers to create consistent test doubles.
- `*.constants.ts` and `*.types.ts` files in `src/` don't require tests as they contain no logic.

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

This project includes a full acceptance (end-to-end) test ecosystem powered by Cucumber (Gherkin) and a small set of TypeScript helpers that build, start and exercise the real application binary.

### High-level contract / quick commands

Run the acceptance suite locally:

```bash
pnpm run test:acceptance
```

This command runs `cucumber-js` with `configs/cucumber/cucumber.json`, then generates an HTML report via `pnpm run test:cucumber:html-report`.

### What the acceptance runner does

- Before the Cucumber scenarios run, the acceptance helpers build the project (the hooks call `pnpm run build`).
- For each scenario the test harness starts a real instance of the built app using `pnpm run start:prod` (spawned by the helpers). The helper waits for the startup message on stdout (the helper looks for the string `Goat It API is running on`) before proceeding.
- After each scenario, the helper gracefully stops the app and force-kills it after a short grace period if it doesn't exit.

### Key paths and files

- Feature files under `tests/acceptance/features/`
  - Holds `.feature` files written in Gherkin. The cucumber config (`configs/cucumber/cucumber.json`) includes `tests/acceptance/features/**/*.feature`.
  - Organize features by domain, e.g., `tests/acceptance/features/app/metadata/app-metadata.feature`.
- Step definition under `tests/acceptance/features/step-definitions/`
  - Place step definition files next to their feature area. The project uses a readable naming convention: `*.given-steps.ts`, `*.when-steps.ts`, and `*.then-steps.ts` to separate step types.
  - Step definitions use `@cucumber/cucumber` API imports (Given/When/Then, Before, After, etc.).
- Support files under `tests/acceptance/support/`
  - `hooks.ts` — registers world constructor and wires lifecycle hooks (`BeforeAll` builds, `Before` starts the server, `After` stops it).
  - `helpers/` — implementation helpers used by the hooks and step definitions (for example `setup.helpers.ts` which builds and serves the app, and implements readiness/kill timeouts).
  - `constants/` — shared constants such as app base URL and reports' path.
  - `types/` and `world/` — the custom `GoatItWorld` is defined here and exposes convenience methods used by steps (for example `fetchAndStoreResponse`, `expectLastResponseJson`, and an `appProcess` handle).
- HTML and other reports under `tests/acceptance/reports/`
  - Cucumber produces `report.json`, `message.json` and `junit.xml` in this folder.
  - The HTML report generator reads `report.json` and writes `index.html`. Screenshots (if stored) go to `tests/acceptance/reports/screenshots`.

### Helpful implementation details agents must know

- The lifecycle helpers call `pnpm run build` synchronously before running scenarios. If the build fails, the whole acceptance run fails early.
- The server is started with `pnpm run start:prod` which runs the built `dist/main.js` — acceptance tests, therefore, exercise the exact production artifact produced by `pnpm run build`.
- **Readiness**: helpers wait for the application stdout to include the message `Goat It API is running on` within `APP_READINESS_TIMEOUT_MS` (currently 10_000 ms). If the message isn't observed, the process is killed and the scenario fails.
- **Shutdown**: tests send `SIGTERM` and wait; after `APP_FORCE_KILL_TIMEOUT_MS` (5_000 ms) the helpers send `SIGKILL` if needed.

### Writing features and step defs (conventions and examples)

- **Features**:
  - Use descriptive feature files and tags for grouping (see `@app @app-metadata` used in examples).
  - Keep scenarios focused and idempotent so they can run in CI in sequence.
  - Always use the `Given-When-Then` structure.
  - Always use `the client` as the actor who performs HTTP calls.
- **Step definitions**:
  - Keep step-definitions thin and call into `GoatItWorld` helpers for HTTP calls and assertions. Example usage seen in the repo:
    - Given steps call `await this.fetchAndStoreResponse("/")` to perform an HTTP call on root endpoint and save the response.
    - Then steps call `this.expectLastResponseJson<T>(SCHEMA)` to validate the last response body against a schema and return typed data for further assertions.
  - Prefer shared step libraries inside `tests/acceptance/features/step-definitions/shared/` for re-use.
- **World helpers**:
  - The `GoatItWorld` exposes state across steps (last fetch response, appProcess handle). Use it to share data between Given/When/Then steps if needed.

### Reporting and CI notes

- The cucumber runner outputs JSON and JUnit reports into `tests/acceptance/reports` (configured in `configs/cucumber/cucumber.json`).
- After Cucumber finishes, the repo runs `tests/acceptance/plugins/html-reporter/cucumber-html-reporter.ts` to generate an HTML report from `report.json`.

### Best practices for agents making changes that affect acceptance tests

- When adding new endpoints used by acceptance tests, add unit tests first and ensure `pnpm run test:unit:cov` remains green before touching acceptance features.
- Keep feature files and step definitions deterministic; avoid relying on external network calls in acceptance scenarios unless they are mocked/stubbed explicitly.
- If you modify server startup logs, update the acceptance readiness matcher (currently looks for `Goat It API is running on`).
- When adding new features, add corresponding acceptance scenarios to cover the end-to-end behavior.
- Always write scenarios for every new public API endpoint or significant behavior change.
- Scenario must also test negative/error cases where applicable (e.g., `404` for missing resources or `400` for invalid input with associated validation errors).

### Quick troubleshooting

- Inspect the `pnpm run build` output locally and fix compile errors when `pnpm run test:acceptance` fails due to a build failure.
- When the server never becomes ready: check `tests/acceptance/support/helpers/setup.helpers.ts` for the readiness string and review the server startup logs in `src/server/server.ts`.
- Ensure `tests/acceptance/reports/report.json` exists when the HTML report is empty or missing — cucumber writes it during the run and the HTML generator reads that file.

## Linting, commits and release automation

- `pnpm run lint` runs both Oxlint and ESLint checks.
- ESLint is configured using a custom flat configuration under `configs/eslint`. Use `pnpm run lint:eslint` or `pnpm run lint:eslint:fix` to check/fix issues.
- Oxlint is configured under `configs/oxlint`. Use `pnpm run lint:oxlint` or `pnpm run lint:oxlint:fix` to check/fix issues.
- When dealing with lint issues, run the appropriate `:fix` command to auto-fix where possible, according to the error (ESLint or Oxlint).
- Linting & formatting: this project uses ESLint (with the stylistic plugin responsible for formatting/style rules) as the single source of truth for both linting and formatting. All lint and style rules are defined in the flat-config files under `configs/eslint` (see the `flat-configs/` subfolder). Agents must consult and follow these flat configs when adding or modifying code — do not apply separate formatters or rule sets that conflict with the project's ESLint configs.
- Commit messages are validated by `commitlint` (config under `configs/commitlint`).
- Husky and lint-staged are present in devDependencies: pre-commit hooks and staged lint/test flows are used in CI/hook scripts (see `configs/lint-staged` files).
- Release is automated by `semantic-release` using `configs/semantic-release/release.config.mjs`.

## Docker

- A `Dockerfile` exists at the repo root. Use `pnpm run docker:build` to build an image named `goat-it-api` locally.
- You can specify platform targets with `pnpm run docker:build:linux/amd64` or `pnpm run docker:build:linux/arm64`.

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

- Follow TypeScript strictness and use the NestJS idioms (decorators, providers, DI).
- Use single responsibility for services and controllers; controllers should be thin.
- Prefer small, focused unit tests with mocked dependencies.
- Linting and formatting are enforced by ESLint and Oxlint using the project's flat-configs. Agents must refer to `configs/eslint` and `configs/oxlint` for the authoritative rule definitions (stylistic and code-quality rules) and ensure code adheres to those configurations before opening a PR.

## Examples of small tasks an agent may be asked to do

- Add a new GET endpoint that returns computed data: create controller + service + tests.
- Fix a failing unit test and add a regression test.
- Improve code coverage for a module by adding tests.
- Refactor a service internals with preserved public API and tests.
- Update dependency versions and fix any type errors caused by the update.

## What an agent must do before committing any change

- Address warnings/errors from `pnpm run lint`.
- Execute `pnpm run typecheck`.
- Ensure `pnpm run test:unit:cov` passes and coverage remains `100%`.
- Update or add unit tests for changed/added behavior.
- Ensure path aliases and imports remain valid.

## Minimal local setup for a developer/agent

### Package manager and commands

Install pnpm (if not present): <https://pnpm.io/installation>

- Commands:

```bash
pnpm install
```

- Development server:

```bash
pnpm run start:dev
```

- Tests and checks:

```bash
pnpm run lint
pnpm run typecheck
pnpm run test:unit:cov
pnpm run test:mutation
pnpm run test:acceptance
```

## Notes and warnings

- The project currently enforces `100%` coverage in config. Ensure any changes maintain coverage.
- Mutation testing is expensive; run it selectively (CI preferred). Usually, run mutation tests locally before merging significant changes.
- There's a TODO in `src/server/server.ts` to replace `console` logging with a proper logger (`Winston`). If you modify logging behavior, ensure tests are updated accordingly.

## Contact and maintainers

- Author/maintainer: Antoine ZANARDI (antoine.zanardi@epitech.eu)
- GitHub issues: <https://github.com/antoinezanardi/goat-it-api/issues>

## Contributing

Please read the project's `.github/CONTRIBUTING.md` for the canonical contributor workflow, commit message rules, PR template and local check commands.

It contains the concrete step-by-step guidance contributors and automated agents should follow when proposing changes.

---

End of AGENTS.md
