# CI/CD, Branching and Release Workflow

This document owns the repository's branch, commit, hook, pull-request, CI, release and deployment rules.

File placement, naming and dependency rules belong to [architecture.md](architecture.md). Test mechanics belong to [unit-tests.md](unit-tests.md) and [acceptance-tests.md](acceptance-tests.md).

## Table of Contents

- [Branching](#branching)
- [Commits](#commits)
- [Pre-commit and commit-msg hooks](#pre-commit-and-commit-msg-hooks)
- [Pull requests](#pull-requests)
- [Continuous integration](#continuous-integration)
  - [Trigger and concurrency](#trigger-and-concurrency)
  - [Job graph](#job-graph)
  - [Acceptance test job](#acceptance-test-job)
- [Release workflow](#release-workflow)
  - [Release PR (develop → main)](#release-pr-develop--main)
  - [Release creation (main)](#release-creation-main)
  - [Versioning rules](#versioning-rules)
- [Deployment](#deployment)
  - [Staging](#staging)
  - [Production](#production)
  - [Docker image publication](#docker-image-publication)
- [Schemas package publication](#schemas-package-publication)
- [Repository hygiene workflows](#repository-hygiene-workflows)
- [Local CI reproduction](#local-ci-reproduction)
- [Secrets and environments](#secrets-and-environments)

## Branching

- Integration branch: `develop`. All contributions start from `develop` and open pull requests targeting `develop`.
- `main` is release-only and protected. Do not open feature pull requests against `main`; only the release PR from `develop` is allowed.
- Branch naming convention: `<type>/<scope>-<short-desc>`, where `type` is one of `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `perf`, `build`, `ci`, `chore`, `revert`, `copilot` or `renovate`.
- Example: `feat/add-user-endpoint`.
- The validator (`configs/validate-branch-name/.validate-branch-namerc.json`, run through
  `pnpm run validate:branch-name`) only enforces `<type>/<non-empty suffix>`; the optional
  `<scope>-<short-desc>` part is a convention, not enforced.
- Create a correctly named branch interactively with `pnpm run script:create-branch`.

## Commits

- Follow [Conventional Commits](https://www.conventionalcommits.org/): `<type>(<scope>): <short description>`.
- `commitlint` runs as a commit hook using `configs/commitlint/`.
- A commit must contain one coherent change; do not mix refactoring, features and dependency bumps without a clear reason.
- Never commit `.env.*` files containing real secrets. `.env.example` is safe.
- Commit types drive the release version. See [Versioning rules](#versioning-rules).

## Pre-commit and commit-msg hooks

Husky installs the hooks through `scripts/post-install-prepare.sh`.

- `.husky/pre-commit` runs, in order:
  1. `pnpm run typecheck`
  2. `pnpm run validate:branch-name`
  3. `pnpm run lint:staged:fix`
  4. `pnpm run test:unit:staged`
- `.husky/commit-msg` runs commitlint against the commit message:
  `pnpm exec commitlint --config configs/commitlint/.commitlintrc.json --edit "$1"`.

Never bypass the hooks with `--no-verify`.

## Pull requests

- Keep pull requests small and single-purpose.
- Target `develop`; `main` is reserved for releases. The only PR allowed to target `main` is the release PR from `develop`.
- The description must include the summary, the testing steps and any migration or configuration notes.
- Apply the label matching the change type (`feat`, `fix`, `docs`, `chore`, …).
- PR titles targeting `develop` are validated against the Conventional Commits regex by `lint-pr-name-into-develop.yml`:
  `^(?<type>build|tech|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)(?:\((?<scope>[\w-]+)\))?(?<breaking>!)?(?<subject>:\s.+)$`.
- The release PR targeting `main` uses the title `Release v<version>` and is not validated by this workflow.
- `pnpm run script:create-pull-request` and `pnpm run script:clean-pr-description` automate the common PR workflow.
- `clean-pr-description.yml` strips numbered diffhunk links from PR descriptions automatically.

## Continuous integration

### Trigger and concurrency

- `build.yml` runs on every `pull_request` targeting `main` or `develop`.
- A concurrency group cancels superseded runs for the same PR (`cancel-in-progress: true`).
- `install` installs pnpm, Node (version from `configs/node/.node-version`) and cached dependencies with `pnpm install --frozen-lockfile`. Most jobs depend on it.

### Job graph

| Job                     | Needs        | Responsibility                                                                                         |
|-------------------------|--------------|--------------------------------------------------------------------------------------------------------|
| `code-ql`               | —            | CodeQL analysis for JavaScript/TypeScript (`github/codeql-action`).                                    |
| `lint-workflows`        | —            | Lint the GitHub Actions workflows with ActionLint.                                                     |
| `install`               | —            | Install pnpm, Node and project dependencies.                                                           |
| `docker-builds`         | —            | Build the Docker image for `linux/amd64` and `linux/arm64` (no push).                                  |
| `build`                 | `install`    | Typecheck, build the NestJS application and verify `dist/main.js`.                                     |
| `build-schemas-package` | `install`    | Typecheck `@goat-it/schemas`, build it with tsdown, run a `pnpm pack` sanity check and upload `dist/`. |
| `lint-codebase`         | `install`    | Run Oxlint and ESLint.                                                                                 |
| `unit-tests`            | `install`    | Run `pnpm run test:unit:cov` and export test/coverage counts.                                          |
| `mutation-tests`        | `install`    | Run `pnpm run test:mutation:ci`, publish to the Stryker Dashboard and upload reports.                  |
| `acceptance-tests`      | `build`      | Run the Cucumber suite through the `acceptance-tests` composite action.                                |
| `sonarcloud`            | `unit-tests` | Run SonarCloud analysis with the unit-test coverage cache. Skipped for `renovate[bot]`.                |

All jobs must pass before a PR can be merged.

### Acceptance test job

The `acceptance-tests` composite action (`.github/actions/acceptance-tests/action.yml`) runs:

1. Install project dependencies.
2. `pnpm run docker:acceptance-tests:start` to start the MongoDB test containers.
3. `pnpm run test:acceptance` (build + Cucumber).
4. Transform the Cucumber report into environment variables and expose the scenario count as an output.
5. Upload the acceptance reports and logs as artifacts (retention: 2 days).
6. Fail the job if the acceptance run failed.
7. `pnpm run docker:acceptance-tests:stop` in an `always()` step.

## Release workflow

### Release PR (develop → main)

`upsert-pr-release.yml` runs on every push to `develop`:

1. Install dependencies.
2. Merge `main` into `develop` locally and compute the next version/changelog with `pnpm run script:create-release-changelog`.
3. Find an open PR to `main` whose title contains `Release` (the workflow takes the first search result;
   it does not require a `Release` prefix).
4. Create the PR titled `Release v<version>` with the generated changelog, the `🏷️ release` label and the
   maintainer as assignee. When the PR already exists, only its title and body are updated; the label and
   assignee are not reapplied.

### Release creation (main)

`release-creation.yml` runs on every push to `main`:

1. Run CodeQL analysis (`code-ql`).
2. Install dependencies (`install`).
3. Run `semantic-release` with `configs/semantic-release/release.config.mjs` using `SEMANTIC_RELEASE_TOKEN`
   (`release`, needs `install`).
4. When a new release is published, merge `origin/main` back into `develop` with a
   `chore: sync release v<version> from main` merge commit and push `develop` (`sync-develop`, needs `release`).

In parallel, the workflow runs `unit-tests`, `mutation-tests` and `acceptance-tests` (all after `install`),
`badges` (after `unit-tests` and `acceptance-tests`) and `sonarcloud` (after `unit-tests`). The `release` job
needs only `install`; CodeQL and the test, badge and SonarCloud jobs do not gate publishing.

Creating the GitHub release triggers the production deployment workflow.

### Versioning rules

`configs/semantic-release/release.config.mjs` targets the `main` and `develop` branches:

| Commit type                                                       | Release    |
|-------------------------------------------------------------------|------------|
| `feat`                                                            | minor      |
| `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `ci`, `chore` | patch      |
| `build`, `tech`, `revert`                                         | no release |

The changelog is grouped by commit type (features, bug fixes, docs, styles, refactor, performance, tests, CI, chore) and enriched with a dependency table.

## Deployment

### Staging

- Trigger: push to `develop`.
- Docker images are published with the `develop` tag for `linux/amd64` and `linux/arm64` in the `Docker Image Staging` environment.
- After publication, the `deploy-to-preproduction` job connects to the preproduction server over SSH and runs the remote update script. It uses the `PREPRODUCTION_SERVER_SSH_PRIVATE_KEY`, `PREPRODUCTION_SERVER_SSH_USER`, `PREPRODUCTION_SERVER_SSH_ADDRESS` and `PREPRODUCTION_UPDATE_SCRIPT_FULL_PATH` secrets.
- The workflow is named "Deploy To Staging"; the target server is the preproduction one.

### Production

- Trigger: GitHub `release: created` event (a release is created by semantic-release when `main` is updated).
- Docker images are published with the release tag and `latest` for `linux/amd64` and `linux/arm64` in the `Docker Image Production` environment.
- After publication, the `deploy-to-production` job connects to the production server over SSH and runs the remote update script using the `PRODUCTION_SERVER_SSH_PRIVATE_KEY`, `PRODUCTION_SERVER_SSH_USER`, `PRODUCTION_SERVER_SSH_ADDRESS` and `PRODUCTION_UPDATE_SCRIPT_FULL_PATH` secrets.

The shared `deploy` composite action starts an SSH agent, optionally writes `known_hosts`, runs the remote update script and always cleans up the key material. `strict-host-key-checking` defaults to `no` and the current deploy workflows do not pass `known-hosts`; hardening this is tracked separately.

### Docker image publication

`docker-build-and-push.yml` is a reusable workflow called by both deployment workflows:

- Matrix over every requested platform and tag.
- Buildx builds each image and pushes it by digest.
- Digests are uploaded as artifacts.
- A second job merges the per-platform digests into a multi-architecture manifest list per tag and inspects the result.
- Authentication uses `DOCKER_HUB_USERNAME` / `DOCKER_HUB_PASSWORD`; the image name comes from the `DOCKER_REGISTRY_IMAGE` variable.

## Schemas package publication

`publish-schemas-package.yml` runs on push to `develop` or `main` when `packages/schemas/**` changes:

- Reads the base version from `packages/schemas/package.json`.
- On `develop`, publishes `<version>-beta` with the `beta` dist-tag.
- On `main`, publishes `<version>` with the `latest` dist-tag.
- Skips publication when the version already exists on npm.
- Publishes with `pnpm publish --access public --provenance` (OIDC `id-token: write`).

Bump the patch version in `packages/schemas/package.json` when an existing export changes; ask before adding a new export (see `AGENTS.md` DOD items 4 and 5).

## Repository hygiene workflows

- `clean-pr-description.yml`: on opened/edited PRs targeting `develop`, removes numbered diffhunk links from the description.
- `lint-pr-name-into-develop.yml`: on opened/edited/reopened/synchronize PRs targeting `develop`, validates the PR title against Conventional Commits.
- `protect-main-branch.yml`: on PRs targeting `main`, comments and fails unless the head branch is `develop`.
- `renovate.json` configures dependency updates; Renovate PRs still go through the standard CI pipeline.

## Local CI reproduction

- Full gate: `pnpm run test` (unit coverage + mutation + acceptance).
- Unit coverage: `pnpm run test:unit:cov`.
- Mutation: `pnpm run test:mutation` (incremental) or `pnpm run test:mutation:ci` (CI config).
- Acceptance: `pnpm run test:acceptance` (builds first) or `pnpm run test:acceptance:skip-build` when `dist/` is current.
- Docker services: `pnpm run docker:acceptance-tests:start`, `pnpm run docker:acceptance-tests:stop`, `pnpm run docker:acceptance-tests:reset`.
- Lint and typecheck: `pnpm run lint` and `pnpm run typecheck`.
- App build: `pnpm run build`; schemas build: `pnpm --filter @goat-it/schemas build`.

## Secrets and environments

| Name                                                                                                                                                 | Type      | Used by                             |
|------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|-------------------------------------|
| `SEMANTIC_RELEASE_TOKEN`                                                                                                                             | secret    | Release creation and `develop` sync |
| `STRYKER_DASHBOARD_API_KEY`                                                                                                                          | secret    | Mutation tests dashboard            |
| `SONARCLOUD_TOKEN`                                                                                                                                   | secret    | SonarCloud analysis                 |
| `BYOB_TOKEN`                                                                                                                                         | secret    | Badge generation (`badges` action)  |
| `DOCKER_HUB_USERNAME`, `DOCKER_HUB_PASSWORD`                                                                                                         | secrets   | Docker image publication            |
| `PREPRODUCTION_SERVER_SSH_PRIVATE_KEY`, `PREPRODUCTION_SERVER_SSH_USER`, `PREPRODUCTION_SERVER_SSH_ADDRESS`, `PREPRODUCTION_UPDATE_SCRIPT_FULL_PATH` | secrets   | Staging/preproduction deployment    |
| `PRODUCTION_SERVER_SSH_PRIVATE_KEY`, `PRODUCTION_SERVER_SSH_USER`, `PRODUCTION_SERVER_SSH_ADDRESS`, `PRODUCTION_UPDATE_SCRIPT_FULL_PATH`             | secrets   | Production deployment               |
| `DOCKER_REGISTRY_IMAGE`                                                                                                                              | variable  | Docker image name                   |
| `DOCKER_HUB_STAGING_IMAGE_URL`, `DOCKER_HUB_PRODUCTION_IMAGE_URL`                                                                                    | variables | Environment URLs                    |

GitHub environments: `Stryker Dashboard`, `Docker Image Staging`, `Docker Image Production`.
