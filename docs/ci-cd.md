# CI/CD, Branching and Release Workflow

This document owns the repository's branch, commit, hook, pull-request, CI, release and deployment rules.

File placement, naming and dependency rules belong to [architecture.md](architecture.md). Test mechanics belong to [unit-tests.md](unit-tests.md) and [acceptance-tests.md](acceptance-tests.md).

## Table of Contents

- [Branching](#branching)
- [Commits](#commits)
- [Pre-commit and commit-msg hooks](#pre-commit-and-commit-msg-hooks)
- [Pull requests](#pull-requests)
- [Repository rulesets](#repository-rulesets)
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
- [GOAT audit decisions](#goat-audit-decisions)

## Branching

- Integration branch: `develop`. All contributions start from `develop` and open pull requests targeting `develop`.
- `main` is release-only and protected. Do not open feature pull requests against `main`; only the release PR from `develop` is allowed.
- Branch naming convention: `<type>/<scope>-<short-desc>`, where `type` is one of `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `perf`, `build`, `ci`, `chore`, `revert`, `copilot` or `renovate`.
- Example: `feat/add-user-endpoint`.
- The validator (`configs/validate-branch-name/.validate-branch-namerc.json`, run through
  `pnpm run validate:branch-name`) only enforces `<type>/<non-empty suffix>`; the optional
  `<scope>-<short-desc>` part is a convention, not enforced.
- Pull requests targeting `develop` re-validate the head branch name in CI through
  `validate-branch-name.yml`; `Validate Branch Name 🌿` is a required check on `develop`, so a
  bypassed hook cannot merge a malformed branch name.
- Create a correctly named branch interactively with `pnpm run script:create-branch`.

## Commits

- Follow [Conventional Commits](https://www.conventionalcommits.org/): `<type>(<scope>): <short description>`.
- `commitlint` runs as a commit hook using `configs/commitlint/`.
- A commit must contain one coherent change; do not mix refactoring, features and dependency bumps without a clear reason.
- Never commit `.env.*` files containing real secrets. `.gitignore` ignores every `.env*` path at any depth and re-includes only `env/.env.example` and `env/.env.test`; `.env.example` is safe, a forcing `git add -f` is not.
- Commit types drive the release version. See [Versioning rules](#versioning-rules).

## Pre-commit and commit-msg hooks

Husky installs the hooks through `scripts/post-install-prepare.sh`.

- `.husky/pre-commit` runs, in order:
  1. `pnpm run typecheck`
  2. `pnpm run validate:branch-name`
  3. `pnpm run lint:staged:fix`
  4. `pnpm run check:workflows:expressions` — only when a staged path is under `.github/workflows/`, `.github/actions/` or is `scripts/check-workflow-run-expressions.ts`
  5. `pnpm run check:tracked-env-files`
  6. `pnpm run check:dockerfile-pins` and `pnpm run check:dockerignore` — only when a staged path is `Dockerfile`, `.dockerignore`, `scripts/check-dockerfile-pins.sh` or `scripts/check-dockerignore.sh`
  7. `pnpm run test:unit:staged`
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
- `develop` and `main` require merges through pull requests; the repository administrator's `RepositoryRole 5`
  bypass is the only standing exception.
- Human approval is waived by the recorded solo-maintainer exception ([CICD-14](#goat-audit-decisions)): the
  required approving review count is 0, while stale-approval dismissal, last-push approval and review-thread
  resolution are enabled so the gate is ready when a second reviewer exists. CODEOWNERS review stays off
  until a second owner exists.
- A standing `RepositoryRole 5` bypass exists on `main`, `develop` and `protected`; the only supported
  break-glass path is the time-limited procedure in [Repository rulesets](#repository-rulesets).

## Repository rulesets

Branch protection is enforced exclusively by repository rulesets; the legacy branch-protection API returns
`404 Branch not protected` for `main` and `develop`. Rulesets are cumulative: a push or merge must satisfy
every applicable ruleset, and a bypass actor on one ruleset does not bypass the others.

| Ruleset | Refs | Enforced rules | Bypass actors |
|---|---|---|---|
| `main` | `~DEFAULT_BRANCH` | deletion, non-fast-forward, pull request (merge only, thread resolution), 6 required checks | `RepositoryRole 5` |
| `develop` | `refs/heads/develop` | deletion, non-fast-forward, pull request (squash only, thread resolution), 2 required checks | `RepositoryRole 5` |
| `protected` | `~DEFAULT_BRANCH`, `refs/heads/develop` | the 14 strict CI checks, pull request, thread resolution | `RepositoryRole 5` |
| `branch-deletion` | `~DEFAULT_BRANCH`, `refs/heads/develop` | deletion, non-fast-forward | none |
| `shields` | `refs/heads/shields` | creation, deletion, non-fast-forward | none |

The `main`, `develop` and `protected` rulesets carry a `RepositoryRole 5` bypass; `branch-deletion` and
`shields` carry none. `shields` is BYOB's badge store; its rules allow normal fast-forward pushes while
deletion and force pushes stay blocked.

**Break-glass.** A blocked merge is the only supported emergency: add a single `User` actor (the maintainer)
with `bypass_mode: "pull_request"` to every applicable ruleset (`main` + `protected`, or `develop` +
`protected`), record the reason and the removal deadline in the pull request or issue, merge, and remove the
actor within 24 hours. `pull_request` mode bypasses pull-request rules only; it does not allow direct pushes,
deletion or force-push, and it is not applicable to deploy keys. The `RepositoryRole 5` entry on `main`,
`develop` and `protected` is the only standing bypass; do not add a `DeployKey` bypass or a new
`always`/`RepositoryRole` actor.

Repository administrators can still edit the rulesets themselves; the bypass list is a guardrail against
accidental direct and force pushes, not a boundary against an administrator.

Verify a ruleset with `gh api repos/{owner}/{repo}/rulesets/{id}` (the list endpoint omits `bypass_actors`)
and the effective rules with `gh api repos/{owner}/{repo}/rules/branches/{branch}`. The repository has no
audit log, so the pull request or issue carrying the break-glass record is the audit trail.

## Continuous integration

### Trigger and concurrency

- `build.yml` runs on every `pull_request` targeting `main` or `develop`.
- Every PR-triggered workflow declares the same concurrency group (`${{ github.workflow }}-${{ github.event.pull_request.number || github.run_id }}` with `cancel-in-progress: true`). A new push cancels the superseded `build.yml`, PR-title lint, branch-name validation and main-protection runs; a new edit cancels the superseded PR-title lint, branch-name validation and PR-description runs.
- `install` installs pnpm, Node (version from `configs/node/.node-version`) and cached dependencies with `pnpm install --frozen-lockfile`. Most jobs depend on it.

### Job graph

| Job                     | Needs        | Responsibility                                                                                         |
|-------------------------|--------------|--------------------------------------------------------------------------------------------------------|
| `code-ql`               | —            | CodeQL analysis for JavaScript/TypeScript (`github/codeql-action`).                                    |
| `lint-workflows`        | —            | Lint the GitHub Actions workflows with ActionLint.                                                     |
| `install`               | —            | Install pnpm, Node and project dependencies.                                                           |
| `docker-builds`         | —            | Run the `.dockerignore` and Dockerfile pin guards, then build the Docker image for `linux/amd64` and `linux/arm64` (no push). |
| `build`                 | `install`    | Typecheck, build the NestJS application and verify `dist/main.js`.                                     |
| `build-schemas-package` | `install`    | Typecheck `@goat-it/schemas`, build it with tsdown, run a `pnpm pack` sanity check and upload `dist/`. |
| `lint-codebase`         | `install`    | Run Oxlint and ESLint, plus the Oxlint rule inventory and linter option-parity checks, the workflow run-body expression check and the tracked-env-file guard. |
| `audit-dependencies`    | `install`    | Run `pnpm audit --prod --audit-level=low`, the full-tree `pnpm audit --audit-level=high` and the production license allowlist check. |
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
- **Base image and package pinning.** Both `FROM` lines carry the Node manifest-list `sha256` digest, and the production stage installs `tini=0.19.0-r3`. Renovate's `pinDigests: true` keeps the digests current, and its `apk` datasource rule in `.github/renovate.json` updates the Alpine package pin; the rule reads the Alpine `v3.24` branch, which must move with the Node base image. `scripts/check-dockerfile-pins.sh` (exposed as `pnpm run check:dockerfile-pins`) fails when a registry `FROM` lacks a digest or a final-stage `RUN apk add` package lacks a version; it runs in the `docker-build` composite action, so the required `Docker Build 🐳` jobs fail on a regression, and in the pre-commit hook when a guard input is staged. An upstream Alpine `-r` republish can make the required build red until the Renovate PR clears the 3-day release-age gate; bump the pin manually if the build must proceed sooner.
- **Build-context hygiene.** `scripts/check-dockerignore.sh` (exposed as `pnpm run check:dockerignore`) asserts the mandatory `.dockerignore` exclusions and rejects the known exact, trailing-slash and `**` patterns that would exclude a Dockerfile input; it runs before the build in the `docker-build` composite action and in the pre-commit hook when a guard input is staged. The Docker build remains the final check.
- **Tracked env files.** `scripts/check-tracked-env-files.sh` (exposed as `pnpm run check:tracked-env-files`) fails when the index contains any `.env*` path other than `env/.env.example` and `env/.env.test`; it runs in the `lint-codebase` composite action and in the pre-commit hook.
- **Least-privilege permissions and tokens.** Every workflow declares a top-level `permissions: contents: read` block. Jobs add only the scopes they need: CodeQL adds `actions: read` and `security-events: write`; SonarCloud adds `pull-requests: write`; PR hygiene jobs add `issues: write` and `pull-requests: write`; the schemas publication adds `id-token: write`. The release-PR and release-commit PR automation uses `SEMANTIC_RELEASE_TOKEN` (PAT) because a `GITHUB_TOKEN`-authored pull request does not trigger `pull_request` workflows; the job keeps only `contents: read`. The PAT needs `contents: write` for the tag push and GitHub release, `pull-requests: write` for PR create/edit/close and `issues: write` for labels and assignees (also recorded in [Secrets and environments](#secrets-and-environments)). The repository-level `can_approve_pull_request_reviews` setting is `false` and the default workflow-token permission is `read`, so a workflow cannot create or approve pull requests with `GITHUB_TOKEN`. Tokens are never exported at workflow or job scope: `GITHUB_TOKEN` and `SEMANTIC_RELEASE_TOKEN` are bound to the individual steps that call `gh`, semantic-release, the changelog script or the release-commit push, so third-party actions in the same job never inherit them.
- **No expressions in shell bodies.** `pnpm run check:workflows:expressions` (part of `pnpm run lint`, run by the `lint-codebase` job) fails when a `${{ … }}` expression appears inside a `run:` body in `.github/workflows/**` or `.github/actions/**`. Workflow values reach the shell through `env:` and quoted variables instead, which removes the template-injection path from the deploy, Docker and publication jobs.
- **Dependency audit.** `.github/actions/audit-dependencies` installs the project, runs `pnpm audit --prod --audit-level=low` (any production advisory blocks), then `pnpm audit --audit-level=high` (high or critical development advisories block) and finally the license check. The `audit-dependencies` job fails the build on either result. The scoped overrides and the accepted development findings are recorded in [dependencies.md](dependencies.md).
- **Scheduled audit.** `scheduled-dependency-audit.yml` runs every Monday at 05:00 UTC (and on `workflow_dispatch`) from the default branch. It repeats both blocking audits and writes the full dependency tree advisory counts to the job summary as a non-blocking report through `scripts/report-dependency-audit.sh`, which prints the same Markdown to standard output when `GITHUB_STEP_SUMMARY` is empty.
- **License allowlist.** `scripts/check-licenses.ts` builds the production SBOM with `pnpm sbom --sbom-format cyclonedx --prod` and compares each component's SPDX expression with `configs/licenses/allowed-licenses.json`. The closure is derived from the root `package.json` (`dependencies` and `optionalDependencies`) and the SBOM dependency graph, because the `--prod` SBOM lists dev-only packages too. Permissive licenses are allowed globally; `sentry` (`FSL-1.1-Apache-2.0`) and `caniuse-lite` (`CC-BY-4.0`) are package-scoped exceptions. A new copyleft, source-available or unknown expression fails the job.
- **Built-output secret scan.** `scripts/check-secrets-in-built-output.sh` (exposed as `pnpm run check:secrets-in-built-output`) scans `dist/` for the values of environment variables whose names contain `SECRET`, `TOKEN`, `PASSWORD`, `PRIVATE_KEY` or `API_KEY`. It runs in the `build` composite action and in the Docker build stage before `pnpm prune --prod`. It fails closed when the scan itself errors, and it never prints the secret value. Multiline values are only scanned through their first line; that limitation is documented in the script.
- **Mutation testing is retained.** The `mutation-tests` action and job, including the Stryker Dashboard integration, are retained. Its artifact upload steps follow the same SHA-pinning rule as every other third-party action.
- **Deploy host verification.** See [Deployment](#deployment) for the `known_hosts` requirement and strict host-key checking.

Health semantics and the post-deploy probe are documented in [operations.md](operations.md).

## Release workflow

### Release PR (develop → main)

`upsert-pr-release.yml` runs on every push to `develop` and on `workflow_dispatch`:

1. Install dependencies.
2. On every push and dispatch, merge `main` into `develop` locally and compute the next version/changelog with `pnpm run script:create-release-changelog`.
3. On every push and dispatch, find an open PR to `main` whose title contains `Release` (the workflow takes
   the first search result; it does not require a `Release` prefix) and create or update the PR titled
   `Release v<version>` with the latest changelog, the `🏷️ release` label and the maintainer as assignee. The
   PR stays open between releases so its body always reflects the current `develop`; the label and assignee are
   not reapplied when it already exists. The PR is created and edited with the PAT so the required
   `pull_request` workflows run.
4. On `workflow_dispatch` only ("Prepare release"), run the workflow from `develop` (Actions →
   `🔃️ Upsert PR Release Workflow` → Run workflow, or `gh workflow run upsert-pr-release.yml --ref develop`);
   every release job checks out `develop` regardless of the dispatch ref. The job creates or updates a single
   `chore(release): v<version>` pull request (`chore/release` → `develop`) containing the generated
   `CHANGELOG.md` section and the `package.json` version bump, then arms it for squash auto-merge.
   `chore/release` is automation-owned: it is force-pushed on each dispatch and must not be used for
   development. The version PR is short-lived; the release PR is not auto-merged. The generated notes filter
   the release commit itself, so it never appears as a change in `CHANGELOG.md`, the release PR body or the
   GitHub release.
5. The `Upsert Pull Request Release 🔃` job runs `scripts/check-release-changelog.sh`: it compares `package.json`
   on `develop`, the top `CHANGELOG.md` heading and the **full top section content** with the generated
   section. A new commit that keeps the same version but changes the changelog (a later fix, for example)
   keeps the guard red, so a stale release commit cannot be merged. Its required check on `main` stays red
   until the version PR auto-merges; the release PR body still updates while the guard is red.
6. If the version does not change but the changelog content does, run **Prepare release** again; the version PR
   is recreated for the same version with the updated content. When the version PR auto-merges, the resulting
   `develop` push updates the release PR and turns the guard green; the maintainer then merges the release PR
   manually. The merge creates the tag and GitHub release, and no `main → develop` sync is needed because the
   version commit was already on `develop`.

### Release creation (main)

`release-creation.yml` runs on every push to `main`:

1. Run CodeQL analysis (`code-ql`).
2. Install dependencies (`install`).
3. Run `semantic-release` with the repository config (`release.config.ts` at the repository root exposes
   `configs/semantic-release/release.config.ts`, which semantic-release discovers on its own) using
   `SEMANTIC_RELEASE_TOKEN` (`release`, needs `install`). The release run analyzes commits, generates the
   release notes and creates the Git tag and GitHub release; it does not push a release commit or update a
   branch.
4. The release tag points at the merged release PR, which already contains the changelog and version commit
   prepared on `develop`; there is no post-release commit and no `main → develop` sync.

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
| `feat!`, `fix!`, any type with `!` or a `BREAKING CHANGE:` footer | major      |
| `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `ci`, `chore` | patch      |
| `build`, `revert`                                                 | no release |

The changelog is grouped by commit type (features, bug fixes, docs, styles, refactor, performance, tests, CI, chore) and enriched with a dependency table.

The release commit is prepared on `develop` before the release PR: `CHANGELOG.md` and the bumped `package.json` are committed there, so the release tag and the in-repo changelog describe the same version.

A commit with `!` after its type, or with a `BREAKING CHANGE:` footer, analyzes to `major`. The rule is the first entry in `RELEASE_RULES` (`configs/semantic-release/release.config.ts`).

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
- Base images are digest-pinned and the production `tini` package is version-pinned before any layer is built, so the published image is reproducible from a commit.

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
- `validate-branch-name.yml`: on opened/edited/reopened/synchronize PRs targeting `develop`, validates `github.head_ref` with the same `validate-branch-name` package and `configs/validate-branch-name/.validate-branch-namerc.json` pattern as the pre-commit hook. `Validate Branch Name 🌿` is a required check on the `develop` ruleset.
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
- Container guards: `pnpm run check:dockerfile-pins` and `pnpm run check:dockerignore`.
- Tracked env files: `pnpm run check:tracked-env-files`.
- App build: `pnpm run build`; schemas build: `pnpm --filter @goat-it/schemas build`.
- Built-output secret scan: `pnpm run check:secrets-in-built-output` after a build.
- License allowlist: `pnpm run check:licenses` (builds the production SBOM from the installed tree).
- Workflow run-body expressions: `pnpm run check:workflows:expressions`.

## Secrets and environments

| Name                                                                                                                                                 | Type      | Used by                             |
|------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|-------------------------------------|
| `SEMANTIC_RELEASE_TOKEN`                                                                                                                             | secret    | Release creation, release PR and release-commit PR automation (`contents: write`, `pull-requests: write`, `issues: write`) |
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

## GOAT audit decisions

Recorded GOAT audit decisions. /goat-audit, final-reviewer and plan-writer honor these entries until their revisit condition is met.

### [CICD-14] Solo-maintainer review exception — Accepted risk (2026-11-26)

- **Finding:** `main`, `develop` and `protected` require zero approving reviews; `.github/CODEOWNERS` is inert for merging, and the repository has a single maintainer after the dormant write collaborators are removed.
- **Decision:** Keep `required_approving_review_count: 0` and record the solo-maintainer exception. Stale-approval dismissal, last-push approval and review-thread resolution stay enabled so the gate is ready when a second reviewer exists; `require_code_owner_review` stays off.
- **Rationale:** GitHub forbids a pull-request author from approving their own pull request; requiring one approval would block every maintainer-authored PR, and a bot approval is not a human review. The rulesets still require a pull request, green required checks and a resolved review thread.
- **Revisit when:** a second human with write or admin access is added, or `.github/CODEOWNERS` gains a second owner. Then set `required_approving_review_count: 1` on `main`, `develop` and `protected`, keep the other flags and enable `require_code_owner_review`.
- **Checklist change:** original criterion: `[CICD-14] Required review enforced — The rulesets require at least one approving review, dismissal of stale approvals on push and approval of the last push; a single-maintainer exception is recorded as a decision.` Rewritten: `[CICD-14] Required review enforced or solo-maintainer exception recorded — The rulesets either require at least one approving review with stale-approval dismissal and last-push approval, or the decision doc records a solo-maintainer exception with a revisit trigger; stale-approval dismissal and last-push approval stay enabled under the exception.`
- **Recorded by:** orchestrator final review (fix/ci-ruleset-governance)
