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
  - [Supply-chain security](#supply-chain-security)
- [Release workflow](#release-workflow)
  - [Release PR (develop → main)](#release-pr-develop--main)
  - [Release creation (main)](#release-creation-main)
  - [Versioning rules](#versioning-rules)
- [Deployment](#deployment)
  - [Staging](#staging)
  - [Production](#production)
  - [Docker image publication](#docker-image-publication)
  - [Post-deploy verification](#post-deploy-verification)
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
  4. `pnpm run check:workflows:expressions`
  5. `pnpm run test:unit:staged`
- `.husky/commit-msg` runs commitlint against the commit message:
  `pnpm exec commitlint --config configs/commitlint/.commitlintrc.json --edit "$1"`.

Never bypass the hooks with `--no-verify`.

## Pull requests

- Keep pull requests small and single-purpose.
- Target `develop`; `main` is reserved for releases. The only PR allowed to target `main` is the release PR from `develop`.
- The description must include the summary, the testing steps and any migration or configuration notes.
- Apply the label matching the change type (`feat`, `fix`, `docs`, `chore`, …).
- PR titles targeting `develop` are validated against the Conventional Commits regex by `lint-pr-name-into-develop.yml`:
  `^(?<type>build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)(?:\((?<scope>[\w-]+)\))?(?<breaking>!)?(?<subject>:\s.+)$`.
  The type list is computed at runtime from `type-enum` in `configs/commitlint/.commitlintrc.json`, the same rule commitlint applies to commit messages, so the PR title check and the commit-msg hook cannot drift apart.
- The release PR targeting `main` uses the title `Release v<version>` and is not validated by this workflow.
- `pnpm run script:create-pull-request` and `pnpm run script:clean-pr-description` automate the common PR workflow.
- `clean-pr-description.yml` strips numbered diffhunk links from PR descriptions automatically.

## Continuous integration

### Trigger and concurrency

- `build.yml` runs on every `pull_request` targeting `main` or `develop`.
- Every PR-triggered workflow declares the same concurrency group (`${{ github.workflow }}-${{ github.event.pull_request.number || github.run_id }}` with `cancel-in-progress: true`). A new push cancels the superseded `build.yml`, PR-title lint and main-protection runs; a new edit cancels the superseded PR-description run.
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
| `lint-codebase`         | `install`    | Run Oxlint, ESLint and the workflow run-body expression check.                                         |
| `audit-dependencies`    | `install`    | Run `pnpm audit --prod --audit-level=high` and the production license allowlist check.                 |
| `unit-tests`            | `install`    | Run `pnpm run test:unit:cov` and export test/coverage counts.                                          |
| `mutation-tests`        | `install`    | Run `pnpm run test:mutation:ci`, publish to the Stryker Dashboard and upload reports.                  |
| `acceptance-tests`      | `build`      | Run the Cucumber suite through the `acceptance-tests` composite action.                                |
| `sonarcloud`            | `unit-tests` | Run SonarCloud analysis with the unit-test coverage cache. Skipped when the PR author is `renovate[bot]`. |

All jobs must pass before a PR can be merged.

### Acceptance test job

The `acceptance-tests` composite action (`.github/actions/acceptance-tests/action.yml`) runs:

1. Install project dependencies.
2. `pnpm run docker:acceptance-tests:start` to start the MongoDB test containers and wait for the declared healthcheck (`docker compose up --wait`).
3. `pnpm run test:acceptance`, which builds once and runs both Cucumber phases through `scripts/run-acceptance-tests.sh` from `configs/cucumber/cucumber.config.ts`: the `default` profile (standard phase) and the serial `lowLimit` profile selecting `@rate-limit-429`.
4. Transform both JUnit reports into the aggregated `CUCUMBER_SCENARIOS_COUNT` environment variable and expose the scenario count as an output.
5. Upload the acceptance reports and logs as artifacts (retention: 2 days).
6. Fail the job if the acceptance run failed.
7. `pnpm run docker:acceptance-tests:stop` in an `always()` step.

### Supply-chain security

- **Action pinning.** Every third-party `uses:` entry in `.github/workflows/**` and `.github/actions/**` is pinned to a full 40-character commit SHA with a trailing version comment (`# vX.Y.Z`). Local composite actions (`./.github/actions/...`) are referenced by path. `renovate.json` extends `config:best-practices`, which keeps action digests updated, maintains the lockfile weekly, pins devDependencies and flags abandoned packages. `pinDigests: true`, `minimumReleaseAge: "3 days"` and `baseBranchPatterns: ["develop"]` configure the update policy.
- **Least-privilege permissions and tokens.** Every workflow declares a top-level `permissions: contents: read` block. Jobs add only the scopes they need: CodeQL adds `actions: read` and `security-events: write`; SonarCloud adds `pull-requests: write`; release-PR management adds `issues: write` and `pull-requests: write`; the schemas publication adds `id-token: write`. Tokens are never exported at workflow or job scope: `GITHUB_TOKEN` and `SEMANTIC_RELEASE_TOKEN` are bound to the individual steps that call `gh`, semantic-release or the changelog script, so third-party actions in the same job never inherit them.
- **No expressions in shell bodies.** `pnpm run check:workflows:expressions` (part of `pnpm run lint`, run by the `lint-codebase` job) fails when a `${{ … }}` expression appears inside a `run:` body in `.github/workflows/**` or `.github/actions/**`. Workflow values reach the shell through `env:` and quoted variables instead, which removes the template-injection path from the deploy, Docker and publication jobs.
- **Dependency audit.** `.github/actions/audit-dependencies` installs the project, runs `pnpm audit --prod --audit-level=high` and then the license check. The `audit-dependencies` job fails the build on high or critical production advisories. Development-only advisories do not block the pipeline.
- **Scheduled audit.** `scheduled-dependency-audit.yml` runs every Monday at 05:00 UTC (and on `workflow_dispatch`) from the default branch. It repeats the blocking production audit and writes the full dependency tree advisory counts to the job summary as a non-blocking report through `scripts/report-dependency-audit.sh`, which prints the same Markdown to standard output when `GITHUB_STEP_SUMMARY` is empty.
- **License allowlist.** `scripts/check-licenses.ts` builds the production SBOM with `pnpm sbom --sbom-format cyclonedx --prod` and compares each component's SPDX expression with `configs/licenses/allowed-licenses.json`. The closure is derived from the root `package.json` (`dependencies` and `optionalDependencies`) and the SBOM dependency graph, because the `--prod` SBOM lists dev-only packages too. Permissive licenses are allowed globally; `sentry` (`FSL-1.1-Apache-2.0`) and `caniuse-lite` (`CC-BY-4.0`) are package-scoped exceptions. A new copyleft, source-available or unknown expression fails the job.
- **Built-output secret scan.** `scripts/check-secrets-in-built-output.sh` (exposed as `pnpm run check:secrets-in-built-output`) scans `dist/` for the values of environment variables whose names contain `SECRET`, `TOKEN`, `PASSWORD`, `PRIVATE_KEY` or `API_KEY`. It runs in the `build` composite action and in the Docker build stage before `pnpm prune --prod`. It fails closed when the scan itself errors, and it never prints the secret value. Multiline values are only scanned through their first line; that limitation is documented in the script.
- **Mutation testing is retained.** The `mutation-tests` action and job, including the Stryker Dashboard integration, are retained. Its artifact upload steps follow the same SHA-pinning rule as every other third-party action.
- **Deploy host verification.** See [Deployment](#deployment) for the `known_hosts` requirement and strict host-key checking.

Health semantics and the post-deploy probe are documented in [operations.md](operations.md).

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
3. Run `semantic-release` with the repository config (`release.config.ts` at the repository root exposes
   `configs/semantic-release/release.config.ts`, which semantic-release discovers on its own) using
   `SEMANTIC_RELEASE_TOKEN` (`release`, needs `install`).
4. When a new release is published, merge `origin/main` back into `develop` with a
   `chore: sync release v<version> from main` merge commit and push `develop` (`sync-develop`, needs `release`).

The root entry point exists because semantic-release 26 merges its built-in default plugin list over the
`plugins` of a config passed through `--extends`; letting semantic-release discover the config from the
working directory keeps `configs/semantic-release/release.config.ts` authoritative.

In parallel, the workflow runs `unit-tests`, `mutation-tests` and `acceptance-tests` (all after `install`),
`badges` (after `unit-tests` and `acceptance-tests`) and `sonarcloud` (after `unit-tests`). The `release` job
needs only `install`; CodeQL and the test, badge and SonarCloud jobs do not gate publishing.

Creating the GitHub release triggers the production deployment workflow.

### Versioning rules

`configs/semantic-release/release.config.ts` targets the `main` and `develop` branches:

| Commit type                                                       | Release    |
|-------------------------------------------------------------------|------------|
| `feat`                                                            | minor      |
| `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `ci`, `chore` | patch      |
| `build`, `revert`                                                 | no release |

The changelog is grouped by commit type (features, bug fixes, docs, styles, refactor, performance, tests, CI, chore) and enriched with a dependency table.

## Deployment

### Staging

- Trigger: push to `develop`.
- Docker images are published with the `develop` tag for `linux/amd64` and `linux/arm64` in the `Docker Image Staging` environment.
- After publication, the `deploy-to-preproduction` job connects to the preproduction server over SSH and runs the remote update script. It uses the `PREPRODUCTION_SERVER_SSH_PRIVATE_KEY`, `PREPRODUCTION_SERVER_SSH_USER`, `PREPRODUCTION_SERVER_SSH_ADDRESS`, `PREPRODUCTION_SERVER_KNOWN_HOSTS` and `PREPRODUCTION_UPDATE_SCRIPT_FULL_PATH` secrets.
- After the deploy, it probes `PREPRODUCTION_API_URL` with the post-deploy health check.
- The workflow is named "Deploy To Staging"; the target server is the preproduction one.

### Production

- Trigger: GitHub `release: created` event (a release is created by semantic-release when `main` is updated).
- Docker images are published with the release tag and `latest` for `linux/amd64` and `linux/arm64` in the `Docker Image Production` environment.
- After publication, the `deploy-to-production` job connects to the production server over SSH and runs the remote update script using the `PRODUCTION_SERVER_SSH_PRIVATE_KEY`, `PRODUCTION_SERVER_SSH_USER`, `PRODUCTION_SERVER_SSH_ADDRESS`, `PRODUCTION_SERVER_KNOWN_HOSTS` and `PRODUCTION_UPDATE_SCRIPT_FULL_PATH` secrets.
- After the deploy, it probes `PRODUCTION_API_URL` with the post-deploy health check.

The shared `deploy` composite action validates that `strict-host-key-checking` is `yes` or `no` and defaults it to `yes`. When strict checking is enabled, `known-hosts` is required; the action writes it to `~/.ssh/known_hosts` and connects with `StrictHostKeyChecking=yes`. Passing `strict-host-key-checking: "no"` explicitly keeps the legacy behavior for an environment without known hosts. The action always cleans up the key material.

### Docker image publication

`docker-build-and-push.yml` is a reusable workflow called by both deployment workflows:

- Matrix over every requested platform and tag.
- Buildx builds each image and pushes it by digest.
- Digests are uploaded as artifacts.
- A second job merges the per-platform digests into a multi-architecture manifest list per tag and inspects the result.
- Authentication uses `DOCKER_HUB_USERNAME` / `DOCKER_HUB_PASSWORD`; the image name comes from the `DOCKER_REGISTRY_IMAGE` variable.

### Post-deploy verification

After the SSH deploy step, staging and production run `.github/actions/health-check`, which executes `scripts/post-deploy-health-check.sh` against `vars.PREPRODUCTION_API_URL` or `vars.PRODUCTION_API_URL`:

- 5 attempts, 5 seconds apart, with a 3-second request timeout each;
- only HTTP `200` passes; other statuses, timeouts and connection errors retry;
- the step fails the deployment job after the last failed attempt.

The probe targets the root liveness URL (`GET /`). It proves the deployed process answers; it does not prove MongoDB readiness, verify a build SHA or roll back. See [operations.md](operations.md#post-deploy-smoke-verification) for the operational contract.

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
- `renovate.json` configures dependency updates; Renovate PRs go through the standard CI pipeline. It extends `config:best-practices`, so lockfile maintenance runs weekly, devDependencies are pinned, action digests are maintained and abandoned packages are flagged. It also enables `osvVulnerabilityAlerts`, which opens fix PRs for known-vulnerable **direct** dependencies. `pinDigests: true`, `minimumReleaseAge: "3 days"` and `baseBranchPatterns: ["develop"]` configure the update policy.
- `scheduled-dependency-audit.yml` re-audits the production tree weekly; see [Supply-chain security](#supply-chain-security).

## Local CI reproduction

- Full gate: `pnpm run test` (unit coverage + mutation + acceptance).
- Unit coverage: `pnpm run test:unit:cov`.
- Mutation: `pnpm run test:mutation` (incremental) or `pnpm run test:mutation:ci` (CI config).
- Acceptance: `pnpm run test:acceptance` (builds first) or `pnpm run test:acceptance:skip-build` when `dist/` is current — both run the standard and the serial low-limit phase and fail if either fails.
- Docker services: `pnpm run docker:acceptance-tests:start`, `pnpm run docker:acceptance-tests:stop`, `pnpm run docker:acceptance-tests:reset` (discards the named `mongodb_data_container` volume before starting).
- Lint and typecheck: `pnpm run lint` and `pnpm run typecheck`.
- App build: `pnpm run build`; schemas build: `pnpm --filter @goat-it/schemas build`.
- Built-output secret scan: `pnpm run check:secrets-in-built-output` after a build.
- License allowlist: `pnpm run check:licenses` (builds the production SBOM from the installed tree).
- Workflow run-body expressions: `pnpm run check:workflows:expressions`.

## Secrets and environments

| Name                                                                                                                                                 | Type      | Used by                             |
|------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|-------------------------------------|
| `SEMANTIC_RELEASE_TOKEN`                                                                                                                             | secret    | Release creation and `develop` sync |
| `STRYKER_DASHBOARD_API_KEY`                                                                                                                          | secret    | Mutation tests dashboard            |
| `SONARCLOUD_TOKEN`                                                                                                                                   | secret    | SonarCloud analysis                 |
| `BYOB_TOKEN`                                                                                                                                         | secret    | Badge generation (`badges` action)  |
| `DOCKER_HUB_USERNAME`, `DOCKER_HUB_PASSWORD`                                                                                                         | secrets   | Docker image publication            |
| `PREPRODUCTION_SERVER_SSH_PRIVATE_KEY`, `PREPRODUCTION_SERVER_SSH_USER`, `PREPRODUCTION_SERVER_SSH_ADDRESS`, `PREPRODUCTION_SERVER_KNOWN_HOSTS`, `PREPRODUCTION_UPDATE_SCRIPT_FULL_PATH` | secrets   | Staging/preproduction deployment    |
| `PRODUCTION_SERVER_SSH_PRIVATE_KEY`, `PRODUCTION_SERVER_SSH_USER`, `PRODUCTION_SERVER_SSH_ADDRESS`, `PRODUCTION_SERVER_KNOWN_HOSTS`, `PRODUCTION_UPDATE_SCRIPT_FULL_PATH`             | secrets   | Production deployment               |
| `DOCKER_REGISTRY_IMAGE`                                                                                                                              | variable  | Docker image name                   |
| `DOCKER_HUB_STAGING_IMAGE_URL`, `DOCKER_HUB_PRODUCTION_IMAGE_URL`                                                                                    | variables | Environment URLs                    |
| `PREPRODUCTION_API_URL`, `PRODUCTION_API_URL`                                                                                                         | variables | Post-deploy liveness probe base URLs |

GitHub environments: `Stryker Dashboard` (mutation dashboard), `Docker Image Staging` (staging image publication and preproduction deploy) and `Docker Image Production` (production image publication and deploy). The deploy jobs declare their environment, so the `*_SERVER_*` secrets and the `PREPRODUCTION_API_URL`/`PRODUCTION_API_URL` variables can be scoped to it and take precedence over repository-level values. Environment protection rules (a `develop`-only staging deployment, and a reviewer plus a `main`/tag restriction on production) are repository settings, not workflow configuration.
