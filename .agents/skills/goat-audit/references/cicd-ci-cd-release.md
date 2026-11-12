# CICD — CI/CD, release & repository governance

Covers how code reaches production for this NestJS 12 + Fastify 5 API: GitHub Actions workflows (`.github/workflows/*.yml`) and composite actions (`.github/actions/*/action.yml`), the pull-request quality gates listed in `AGENTS.md`, rulesets and `CODEOWNERS`, semantic-release versioning with the `develop` → `main` release flow, the SSH deployment to the preproduction/staging and production VPS (`deploy-to-*.yml` + `.github/actions/deploy`), CI efficiency, the Husky/commitlint/branch-name/PR-title enforcement chain, and the `@goat-it/schemas` npm publication.

**Decision doc:** `docs/ci-cd.md` (section `## GOAT audit decisions`). **Diff triggers:** see SKILL.md category index.

**Not in this category:** dependency advisories, Renovate proposals, SBOM and attestation generation → SUP · image content, Dockerfile, image scanning → PLAT · post-deploy verification content, rollback procedure, monitors → OPS · timeout/retry semantics inside the app → REL · changelog readability, contribution docs → DOCS · `SECURITY.md`, private vulnerability reporting → SEC · CI test infrastructure (flakiness, browser matrix) → TEST · agent guideline files → AGENT

## Contents

- [1. Workflow hardening and trigger surface](#1-workflow-hardening-and-trigger-surface)
- [2. CI completeness](#2-ci-completeness)
- [3. Rulesets and repository governance](#3-rulesets-and-repository-governance)
- [4. Release engineering](#4-release-engineering)
- [5. Hooks and commit, branch and PR-title enforcement](#5-hooks-and-commit-branch-and-pr-title-enforcement)
- [6. Deploy safety and credentials](#6-deploy-safety-and-credentials)
- [7. Schemas package publication](#7-schemas-package-publication)
- [8. Renovate and automation alignment](#8-renovate-and-automation-alignment)
- [Sources](#sources)

## 1. Workflow hardening and trigger surface

- **[CICD-01] Actions pinned to full commit SHAs** — Pin every remote `uses:` reference in `.github/workflows/*.yml` and in the composite actions `.github/actions/*/action.yml` (including sub-path actions such as `github/codeql-action/init` and `actions/cache/restore`) to a full 40-hex commit SHA followed by a version comment (`# v7`, `# v2.2.0`); only local `./.github/...` references are exempt, and no tag or branch ref (`@v4`, `@main`) remains.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `.github/workflows/*.yml`, `.github/actions/*/action.yml` · Src: [1], [4], [6]
- **[CICD-02] Read-only top-level permissions** — Every workflow declares a top-level `permissions:` block set to `contents: read` or `{}`, so no job inherits the repository default token scope.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `.github/workflows/*.yml` · Src: [1], [4], [7]
- **[CICD-03] No dangerous triggers** — No workflow uses `pull_request_target` or `issue_comment`, and pull-request automation runs on `pull_request`, whose token is read-only for forks; a `workflow_run` trigger exists only with a documented reason and checks out the trusted default branch, never the triggering PR head.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: critical · Look: `.github/workflows/*.yml` · Src: [1], [4], [7]
- **[CICD-04] No template injection in run steps** — No `run:` body or `actions/github-script` `script:` interpolates `${{ github.event.* }}` strings, `${{ inputs.* }}` or step outputs directly, in workflows and composite actions alike; values flow through `env:` and are used as quoted shell variables (`"$PR_TITLE"`).
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `.github/workflows/*.yml`, `.github/actions/*/action.yml` · Src: [4], [7]
- **[CICD-05] Every job has a timeout** — Every job that runs steps declares `timeout-minutes`; jobs that only call a reusable workflow rely on the callee's job timeouts.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `.github/workflows/*.yml` · Src: [7]
- **[CICD-06] Superseded PR runs cancelled** — Every `pull_request`-triggered workflow declares a `concurrency` group keyed on the workflow name and the head ref (`${{ github.workflow }}-${{ github.head_ref || github.run_id }}`) with `cancel-in-progress: true`, so a superseded push stops burning runner minutes.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `.github/workflows/*.yml` · Src: [7], [15]

## 2. CI completeness

- **[CICD-07] PR CI runs every AGENTS.md quality gate** — Pull requests to `develop` and `main` run the CI equivalents of the four `AGENTS.md` gates — `pnpm run lint` (ESLint and Oxlint), `pnpm run typecheck`, `pnpm run test:unit:cov`, `pnpm run test:acceptance` — each in a job that blocks the merge, alongside the mutation, dependency-audit and per-platform Docker-build jobs.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `.github/workflows/build.yml`, `.github/actions/*/action.yml`, `AGENTS.md` · Src: [8], project: AGENTS.md
- **[CICD-08] Gate failures fail the job** — No gate step is neutralized by `continue-on-error: true`, `|| true` or `set +e` unless a later step of the same job exits non-zero when that step's outcome is not `success`.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `.github/actions/*/action.yml`, `.github/workflows/*.yml` · Src: [1], project: AGENTS.md
- **[CICD-09] CI toolchain pinned to repository versions** — CI installs Node from the repository version file (`configs/node/.node-version`) and pnpm through the pinned setup action, and installs dependencies with `--frozen-lockfile`, so CI cannot drift from the committed lockfile or the declared engine.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/actions/install-project/action.yml`, `configs/node/.node-version` · Src: [8], project: AGENTS.md
- **[CICD-10] Scripts referenced by CI exist** — Every `pnpm run <script>` and `scripts/*` path invoked from workflows, composite actions and `.husky/*` hooks exists in `package.json` `scripts` or on disk.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/actions/*/action.yml`, `.github/workflows/*.yml`, `.husky/*`, `package.json`, `scripts/*.sh` · Src: [8], project: AGENTS.md
- **[CICD-11] CodeQL on every PR and on main** — CodeQL (`javascript,typescript`) runs on every pull request and on push to `main`, with `security-events: write` granted only to that job.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `.github/workflows/build.yml`, `.github/workflows/release-creation.yml`, `.github/actions/code-ql/action.yml` · Src: [2], [8]

## 3. Rulesets and repository governance

- **[CICD-12] Rulesets protect main and develop** — `gh api repos/{owner}/{repo}/rulesets` shows active branch rulesets targeting `refs/heads/main` and `refs/heads/develop` that block deletion and non-fast-forward pushes and require a pull request, since anyone able to push to a semantic-release branch can publish a release.
  Evidence: `command` · Diff: ✗ · Core: ✓ · Severity: high · Src: [2], [5]
- **[CICD-13] Required status checks match real jobs** — The rulesets require every blocking job of the pull-request workflow (including CodeQL, workflow lint, codebase lint, dependency audit, build, Docker builds per platform, unit and acceptance tests), the PR-title lint and, for `main`, the main-branch protection job, with `strict_required_status_checks_policy: true`; no required context names a renamed or deleted job.
  Evidence: `command` · Diff: ✗ · Severity: high · Src: [2], [5]
- **[CICD-14] Required review enforced** — The rulesets require at least one approving review, dismissal of stale approvals on push and approval of the last push; a single-maintainer exception is recorded as a decision.
  Evidence: `command` · Diff: ✗ · Severity: high · Src: [2], [5]
- **[CICD-15] No ruleset bypass actors** — The bypass list of every branch ruleset is empty, since a bypass actor makes protections unenforced for administrators.
  Evidence: `command` · Diff: ✗ · Severity: high · Src: [2], [5]
- **[CICD-16] Non-develop PRs to main blocked in CI** — The main-branch protection workflow comments and fails on every pull request to `main` whose head branch is not `develop`, and no workflow automation merges to `main` from any other branch.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `.github/workflows/protect-main-branch.yml` · Src: [2], project: docs/ci-cd.md
- **[CICD-17] CODEOWNERS has no errors** — `gh api repos/{owner}/{repo}/codeowners/errors` returns an empty `errors` array, because GitHub silently skips invalid lines.
  Evidence: `command` · Diff: ✗ · Severity: medium · Src: [11]
- **[CICD-18] Contribution scaffolding guides the gates** — The pull-request template and issue forms exist, and the PR template checklist requires the branch-name convention, a Conventional Commits title and the local quality gates before opening.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/PULL_REQUEST_TEMPLATE.md`, `.github/ISSUE_TEMPLATE/**`, `.github/CONTRIBUTING.md` · Src: [8], [12]

## 4. Release engineering

- **[CICD-19] Release branches match release workflows** — `branches` in `configs/semantic-release/release.config.mjs` lists only branches on which a workflow runs semantic-release or a documented dry-run version preview (the release-changelog script on `develop`), and the release step's `--extends` path points to that file (verified: semantic-release 25.0.9).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `configs/semantic-release/**`, `.github/workflows/release-creation.yml`, `.github/workflows/upsert-pr-release.yml` · Src: [13]
- **[CICD-20] Release publishes only from main** — The semantic-release job triggers on push to `main` only, checks out with `persist-credentials: false` and authenticates through a dedicated token, so a workflow token cannot publish a release from another branch.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `.github/workflows/release-creation.yml` · Src: [1], [8]
- **[CICD-21] Commit types map to SemVer** — `releaseRules` keep `feat` → minor, `fix` → patch and breaking changes (`!` or a `BREAKING CHANGE:` footer) → major; any extra patch-releasing type (`docs`, `style`, `refactor`, `perf`, `test`, `ci`, `chore`) is a documented choice.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `configs/semantic-release/**` · Src: [9], [10], [13], project: docs/ci-cd.md
- **[CICD-22] Release commit carries the changelog** — The release commit includes the generated changelog and the bumped manifest (changelog and git plugins with the changelog file and manifest assets), so the tag, the commit and the changelog heading stay aligned.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `configs/semantic-release/**`, `CHANGELOG.md` · Src: [10], [13]
- **[CICD-23] Main merged back into develop after release** — After a published release, the release workflow merges `main` into `develop` with a Conventional `chore:` message, and a merge conflict fails the job instead of force-pushing.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/workflows/release-creation.yml` · Src: [1], [10], project: docs/ci-cd.md
- **[CICD-24] Release process documented end to end** — A repository document describes the chain Conventional commit → release PR → merge to `main` → semantic-release tag and changelog → image build → production deploy, and states the branch rules and who may release.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `docs/ci-cd.md`, `.github/CONTRIBUTING.md` · Src: [8], [12], project: docs/ci-cd.md

## 5. Hooks and commit, branch and PR-title enforcement

- **[CICD-25] commit-msg hook runs commitlint** — The `commit-msg` hook runs commitlint with the repository configuration on the edited message, and that configuration extends `@commitlint/config-conventional`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.husky/*`, `configs/commitlint/**` · Src: [10], [14]
- **[CICD-26] pre-commit gates installed and scoped** — The `pre-commit` hook runs, in order, the typecheck, the branch-name validation, the staged lint fix and the staged unit tests, each wired to the same scripts CI runs.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.husky/*`, `configs/lint-staged/**`, `package.json` · Src: [8], project: AGENTS.md
- **[CICD-27] Hooks installed outside CI** — The hooks are installed by the post-install script outside CI (an `is-ci` guard keeps CI from installing them) and are never bypassed by a repository path.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `scripts/post-install-prepare.sh`, `package.json` · Src: [8], project: AGENTS.md
- **[CICD-28] CI re-enforces hook rules** — Because `--no-verify` skips hooks, a pull-request workflow validates the PR title against Conventional Commits on `opened`, `edited`, `reopened` and `synchronize`, and the branch-name validator can be re-run from the PR head.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `.github/workflows/lint-pr-name-into-develop.yml`, `configs/validate-branch-name/**` · Src: [10], [14], project: AGENTS.md
- **[CICD-29] One commit-type list everywhere** — The allowed types are identical across commitlint `type-enum` (`build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`), the PR-title regex, the branch-name pattern (plus bot prefixes `copilot` and `renovate`), the CodeRabbit title requirement and semantic-release `releaseRules`; no type (e.g. `tech`) is accepted in one place and rejected in another (verified: @commitlint/config-conventional 21.2.4).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `configs/commitlint/**`, `configs/validate-branch-name/**`, `configs/semantic-release/**`, `.github/workflows/lint-pr-name-into-develop.yml`, `.coderabbit.yaml` · Src: [10], [14]

## 6. Deploy safety and credentials

- **[CICD-30] Secrets scoped to the consuming step** — Secrets such as `GITHUB_TOKEN`, `GH_TOKEN` and `SEMANTIC_RELEASE_TOKEN` are set in the `env:`/`with:` of the step that uses them, not in workflow-level or job-level `env:` where every step (including third-party actions such as `pnpm/action-setup`) receives them; reusable-workflow calls pass an explicit `secrets:` map, never `secrets: inherit`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/workflows/*.yml` · Src: [1], [4], [7]
- **[CICD-31] No production credentials in pull-request jobs** — Jobs triggered by `pull_request` never receive production credentials (SSH keys, Docker Hub credentials, production server addresses); production secrets are reachable only from push-to-`develop`, `main`/release or environment-gated jobs.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `.github/workflows/build.yml` · Src: [1], [4]
- **[CICD-32] Deploy jobs use GitHub environments** — The staging and production publication/deploy jobs declare `environment:` and read credentials and server targets from environment-scoped secrets, not repository secrets.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `.github/workflows/deploy-*.yml`, `.github/workflows/docker-build-and-push.yml` · Src: [4], [16]
- **[CICD-33] Pinned SSH host key** — The deploy action connects with `StrictHostKeyChecking=yes` and a `known_hosts` entry supplied from a reviewed secret, never generated by `ssh-keyscan` at deploy time; no staging or production workflow passes `strict-host-key-checking: "no"`.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: critical · Look: `.github/actions/deploy/action.yml`, `.github/workflows/deploy-*.yml` · Src: [1], [4]
- **[CICD-34] Key material contained** — The private key is written with `chmod 600` and never echoed to logs, `set -x` is absent from secret-handling steps, and an `if: always()` step deletes the key file and kills `ssh-agent`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/actions/deploy/action.yml` · Src: [1], [4]
- **[CICD-35] Scoped registry credentials** — The CI `DOCKER_HUB_PASSWORD` secret holds a Docker Hub access token limited to the image repository, not the account password, and the VPS holds a pull-only credential.
  Evidence: `manual` · Diff: ✗ · Severity: high · Src: [1], [4]

## 7. Schemas package publication

- **[CICD-36] Schemas publication path-filtered and branch-scoped** — The schemas publication workflow runs only on push to `develop` or `main` when `packages/schemas/**` changed, and picks the `beta` dist-tag on `develop` and `latest` on `main`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/workflows/publish-schemas-package.yml` · Src: [17], project: docs/ci-cd.md
- **[CICD-37] Schemas publish uses OIDC provenance and never republishes** — The publication publishes with `--provenance` under a job-scoped `id-token: write`, and skips when the version already exists on npm instead of republishing the same version.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/workflows/publish-schemas-package.yml` · Src: [3], [17]
- **[CICD-38] Schemas version-bump discipline** — The patch version of the published package is bumped when an existing export changes and a new export is only added after explicit approval, per the `AGENTS.md` definition of done.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `packages/schemas/package.json`, `AGENTS.md` · Src: [9], project: AGENTS.md

## 8. Renovate and automation alignment

- **[CICD-39] Renovate maintains pins with a release-age floor** — Renovate keeps every GitHub Actions pin current (`pinDigests: true`), proposes only releases older than three days (`minimumReleaseAge`) and bases its PRs on `develop`, and its PRs run the standard CI pipeline.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/renovate.json` · Src: [6], project: docs/ci-cd.md
- **[CICD-40] Bot conditions not spoofable** — Conditions that skip or trust bots test `github.event.pull_request.user.login` or an app id, never `github.actor` (e.g. `if: github.actor != 'renovate[bot]'`).
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `.github/workflows/build.yml` · Src: [7]

## Sources

[1] OWASP Top 10 CI/CD Security Risks (CICD-SEC-1…10) — https://owasp.org/www-project-top-10-ci-cd-security-risks/ — fetched 2026-11-04 (live page)
[2] OpenSSF Scorecard check documentation — https://github.com/ossf/scorecard/blob/main/docs/checks.md — fetched 2026-11-04 (main branch)
[3] SLSA v1.2 Build track basics (L0–L3) — https://slsa.dev/spec/v1.2/build-track-basics — fetched 2026-11-04 (SLSA v1.2)
[4] GitHub Docs: Security hardening for GitHub Actions — https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions — fetched 2026-11-04 (live docs)
[5] GitHub Docs: About rulesets — https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets — fetched 2026-11-04 (live docs)
[6] Renovate: GitHub Actions manager — https://docs.renovatebot.com/modules/manager/github-actions/ — fetched 2026-11-04 (live docs)
[7] zizmor: Audit Rules — https://docs.zizmor.sh/audits/ — fetched 2026-11-04 (live docs)
[8] OpenSSF Best Practices: Passing criteria — https://www.bestpractices.dev/en/criteria/0 — fetched 2026-11-04 (live criteria)
[9] Semantic Versioning 2.0.0 — https://semver.org/ — fetched 2026-11-04 (SemVer 2.0.0)
[10] Conventional Commits 1.0.0 — https://www.conventionalcommits.org/en/v1.0.0/ — fetched 2026-11-04 (v1.0.0)
[11] GitHub Docs: About code owners — https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners — fetched 2026-11-04 (live docs)
[12] Google SRE book, Appendix E: Launch Coordination Checklist — https://sre.google/sre-book/launch-checklist/ — fetched 2026-11-04 (book text 2017)
[13] semantic-release: Configuration — https://semantic-release.gitbook.io/semantic-release/usage/configuration — fetched 2026-11-04 (semantic-release 25.0.9 installed)
[14] commitlint: @commitlint/config-conventional README — https://github.com/conventional-changelog/commitlint/blob/master/%40commitlint/config-conventional/README.md — fetched 2026-11-04 (@commitlint/config-conventional 21.2.4 installed)
[15] GitHub Docs: Control the concurrency of workflows and jobs — https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency — fetched 2026-11-04 (live docs)
[16] GitHub Docs: Deployments and environments — https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments — fetched 2026-11-04 (live docs)
[17] npm Docs: Generating provenance statements — https://docs.npmjs.com/generating-provenance-statements — fetched 2026-11-04 (live docs)
