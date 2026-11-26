# Package scripts

Reference for every `pnpm run` script declared in `package.json`, grouped by purpose. Entries marked **internal** are invoked only by Git hooks, CI or other scripts rather than as a contributor workflow.

Related guides: [CI/CD, branching and release workflow](ci-cd.md) for the hook and CI orchestration, and [acceptance tests](acceptance-tests.md) for the dedicated MongoDB setup.

## Install and build

| Script | Purpose |
|--------|---------|
| `prepare` | **Internal.** Post-install hook that installs the Husky Git hooks; skipped in CI and when dev dependencies are absent. |
| `build` | Build the production output with NestJS and SWC, then resolve path aliases and append the `.js` extensions ESM requires. |
| `typecheck` | Type-check the whole repository with the native TypeScript compiler. |

## Run

| Script | Purpose |
|--------|---------|
| `start` | Start the application without watch mode. |
| `start:dev` | Start the application in watch mode. |
| `start:debug` | Start the application in watch mode with the Node inspector enabled. |
| `start:prod` | Run the built output with `NODE_ENV=production`. |
| `start:prod:test` | **Internal.** Run the built output with `NODE_ENV=test`. |

## Lint and repository checks

| Script | Purpose |
|--------|---------|
| `lint` | Run Oxlint, ESLint and the GitHub Actions expression guard. |
| `lint:fix` | Apply Oxlint and ESLint fixes; the expression guard is not part of the fix path. |
| `lint:oxlint` | Run Oxlint only. |
| `lint:oxlint:fix` | Apply Oxlint fixes. |
| `lint:oxlint:staged:fix` | **Internal.** Run Oxlint on staged files only (pre-commit hook). |
| `lint:oxlint:check-rules` | Verify every Oxlint rule is configured or explicitly excluded. |
| `lint:eslint` | Run ESLint only. |
| `lint:eslint:fix` | Apply ESLint fixes. |
| `lint:eslint:staged:fix` | **Internal.** Run ESLint on staged files only (pre-commit hook). |
| `lint:eslint:inspect-config` | Open the ESLint config inspector. |
| `lint:eslint:check-rules` | Verify every ESLint rule is configured or explicitly excluded. |
| `lint:staged:fix` | **Internal.** Run both staged linters (pre-commit hook). |
| `check:secrets-in-built-output` | **Internal.** Scan `dist/` for secret values in the PR build job and before an image is published. |
| `check:dockerfile-pins` | **Internal.** Verify every registry `FROM` is digest-pinned and every final-stage APK package is version-pinned. |
| `check:dockerignore` | **Internal.** Verify `.dockerignore` still excludes the required paths and secret-file patterns. |
| `check:tracked-env-files` | **Internal.** Fail when a tracked `.env*` file is not one of the two intentionally tracked ones. |
| `check:licenses` | Verify dependency licenses against `configs/licenses/allowed-licenses.json`. |
| `check:workflows:expressions` | **Internal.** Verify GitHub Actions expressions are not interpolated into shell scripts. |

## Tests

| Script | Purpose |
|--------|---------|
| `test` | Run unit coverage, mutation and acceptance in order. |
| `test:unit` | Run the Vitest suite. |
| `test:unit:watch` | Run Vitest in watch mode. |
| `test:unit:cov` | Run Vitest with coverage (100% required). |
| `test:unit:staged` | **Internal.** Run the unit tests related to staged files (pre-commit hook). |
| `test:mutation` | Run Stryker with the committed incremental state. |
| `test:mutation:force` | Run Stryker without the incremental state. |
| `test:mutation:ci` | **Internal.** Run Stryker with the CI configuration. |
| `test:acceptance` | Build the application and run the two-phase Cucumber suite against the acceptance MongoDB. |
| `test:acceptance:skip-build` | Run the Cucumber suite without rebuilding. |

## Git, pull request and release helpers

| Script | Purpose |
|--------|---------|
| `validate:branch-name` | Validate the current branch name against `configs/validate-branch-name/.validate-branch-namerc.json`. |
| `script:create-branch` | Create a branch interactively with a conventional type and a kebab-case name. |
| `script:create-pull-request` | Open a pull request against `develop` from the current branch. |
| `script:create-release-changelog` | Generate the release changelog with semantic-release and write it to `RELEASE.md`. |
| `script:clean-pr-description` | Remove numbered diffhunk links from a pull request description. |

## Docker

| Script | Purpose |
|--------|---------|
| `docker:build` | Build the image for the host platform. |
| `docker:build:linux/amd64` | Build the image for `linux/amd64`. |
| `docker:build:linux/arm64` | Build the image for `linux/arm64`. |
| `docker:acceptance-tests:start` | Start the acceptance-test MongoDB and wait for its healthcheck. |
| `docker:acceptance-tests:stop` | Stop the acceptance-test MongoDB and keep its volume. |
| `docker:acceptance-tests:reset` | Discard the acceptance-test volume and start a fresh MongoDB. |
