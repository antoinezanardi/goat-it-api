# 🫶 Contributing to Goat It API

Thank you for your interest in contributing — we appreciate your time and help! This document explains how to prepare, test, and submit changes so they integrate smoothly with the project workflow.

## Table of contents

- 📌 [High-level rules](#-high-level-rules)
- ✅ [Quick checklist](#-quick-checklist)
- 🚀 [Getting started (commands)](#-getting-started-commands)
- 🔍 [Local checks to run before opening a PR](#-local-checks-to-run-before-opening-a-pr)
- 🌿 [Branching rules](#-branching-rules)
- ✍️ [Commit messages & PR titles (Conventional Commits)](#-commit-messages--pr-titles-conventional-commits)
- 🚦 [CI & merging](#-ci--merging)
- 🔒 [Security](#-security)
- 🤝 [Code of Conduct](#-code-of-conduct)
- 🐕 [Husky & git hooks](#-husky--git-hooks)
- 🧰 [Additional tips](#-additional-tips)
- 📞 [Contact / Questions](#-contact--questions)

---

## 📌 High-level rules

- The integration branch is `develop`. All contributions must be based on `develop` and opened as PRs targeting `develop`.
- Every PR must pass all required CI checks before it can be merged, including linting, type checks, unit tests with 100% coverage, mutation tests and acceptance tests.
- Branch names and commit messages must follow the defined conventions (see below).
- Before your first change, read the [architecture and file-placement conventions](../docs/architecture.md). The full branching, commit and CI reference lives in [docs/ci-cd.md](../docs/ci-cd.md).
- The [Documentation section of the README](../README.md#documentation) is the full guide index; start with [architecture](../docs/architecture.md), [JSDoc](../docs/jsdoc.md), [CI/CD](../docs/ci-cd.md), [unit tests](../docs/unit-tests.md), [acceptance tests](../docs/acceptance-tests.md), [mocks](../docs/mocks.md) and [faketories](../docs/faketories.md).

> [!IMPORTANT]
> Please always target `develop` for PRs. `main` is protected and reserved for releases; PRs to `main` will be rejected.

---

## ✅ Quick checklist

- [ ] Fork the repository on GitHub
- [ ] Clone your fork locally
- [ ] Create a branch from `develop` following the branch naming rules
- [ ] Run local checks (lint, typecheck, unit tests with coverage, mutation tests if possible, acceptance tests when Docker is available)
- [ ] Use Conventional Commits for commit messages
- [ ] Open a PR from your branch (on your fork) → target `develop` on upstream
- [ ] Ensure CI checks pass and address review comments

---

## 🚀 Getting started (commands)

> [!NOTE]
> This repo uses pnpm (see `package.json`).

### Clone and prepare

```bash
# clone your fork (replace <your-username>)
git clone git@github.com:<your-username>/goat-it-api.git
cd goat-it-api

# add the upstream remote
git remote add upstream https://github.com/antoinezanardi/goat-it-api.git
```

### Install dependencies

```bash
pnpm install
```

### Create a working branch from `develop`

```bash
# update local develop from upstream
git fetch upstream
git checkout -B develop upstream/develop

# create your feature branch
git checkout -b feat/short-description
```

### Helper script (optional)

You can use the included helper script to create a branch with validation in a guided flow.

```bash
pnpm run script:create-branch
```

---

## 🔍 Local checks to run before opening a PR

Run these locally to speed up iteration — CI will run them again. The five local quality gates are:

```bash
pnpm run lint:fix
pnpm run typecheck
pnpm run test:unit:cov
pnpm run test:mutation
pnpm run test:acceptance
```

The acceptance gate needs the disposable MongoDB: run `pnpm run docker:acceptance-tests:start` before the sequence (see [Acceptance tests](#acceptance-tests-docker-required) below).

Every `package.json` script, including internal hook/CI-only ones, is listed in [docs/scripts.md](../docs/scripts.md).

### Lint

```bash
pnpm run lint
# apply fixes
pnpm run lint:fix
```

### Type-check

```bash
pnpm run typecheck
```

### Unit tests

> [!NOTE]
> Code coverage is set to a minimum threshold of 100%.

```bash
pnpm run test:unit
# coverage
pnpm run test:unit:cov
```

### Mutation tests (heavy — can be slow)

> [!WARNING]
> Mutation testing is expensive and can take a long time locally. If you cannot run mutation tests on your machine, rely on CI for final verification — but aim to run unit tests and type checks locally before pushing.

> [!TIP]
> Use `pnpm run test:mutation` for incremental runs during development and `pnpm run test:mutation:ci` in CI contexts.

```bash
pnpm run test:mutation
```

### Acceptance tests (Docker required)

> [!NOTE]
> Acceptance tests build the app and require the Docker services defined in `docker/goat-it-api-acceptance-tests/docker-compose.yml`.

```bash
# start MongoDB
pnpm run docker:acceptance-tests:start
# run the suite
pnpm run test:acceptance
```

### Build

```bash
pnpm run build
```

### Branch name validation

```bash
pnpm run validate:branch-name
```

---

## 🌿 Branching rules

The canonical branching, commit, hook, PR and deployment reference is [docs/ci-cd.md](../docs/ci-cd.md).

- Always branch from the latest `develop`.
- `main` is protected for production; do not open PRs against `main`.
- Branch names must follow the validation config at `configs/validate-branch-name/.validate-branch-namerc.json`.

> [!CAUTION]
> Branch names that do not match the configured pattern are rejected by the pre-commit hook and re-validated by the `validate-branch-name` CI job on pull requests targeting `develop`. Validate locally with `pnpm run validate:branch-name` before pushing.

### Pattern (regex)

```regex
^(feat|fix|docs|style|refactor|test|perf|build|ci|chore|revert|copilot|renovate)/.+$
```

> [!NOTE]
> `copilot/` and `renovate/` are typically used by automated tooling.

### Examples

- ✅ `feat/add-login-endpoint`
- ✅ `fix/calc-rounding-error`
- ✅ `docs/update-readme`
- ❌ `feature/add-login` (use `feat`)
- ❌ `Add-login` (missing type)
- ❌ `feat_add_login` (must use `/`)

### Validate locally

```bash
pnpm run validate:branch-name
```

> [!TIP]
> The repo includes a helper script (`scripts/create-git-branch.sh`) if you prefer a guided flow.

---

## ✍️ Commit messages & PR titles (Conventional Commits)

We use Conventional Commits. Commit messages and PR titles should follow the Conventional Commits header format. The repo's commitlint config is in `configs/commitlint/.commitlintrc.json` (it extends `@commitlint/config-conventional`). CI validates PR titles against the commitlint type list; commit messages are validated by the local `commit-msg` hook.

### Header format

```text
<type>(<scope>): <short summary>
```

### Optional body, optional breaking change, and footer

```text
<optional body>

BREAKING CHANGE: <description>

Closes #<issue-number>
```

### Allowed common types

- `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `perf`, `build`, `ci`, `chore`, `revert`

### Examples

```text
feat(auth): add JWT refresh endpoint
```

```text
fix(payment): handle rounding error in total calculation

  Adjusted the aggregation to round at the end to avoid floating point drift.
```

### Breaking change example

```text
feat(api)!: remove legacy /v1 endpoints

This removes the v1 endpoints. Consumers must migrate to /v2.
```

### PR title rule

- The PR title should be a valid Conventional Commit header (the same format as the first line of a commit). When possible, use the same string as the main commit or the eventual squashed commit message. Maintainers may reword/squash on merge but will keep the final commit Conventional.

> [!IMPORTANT]
> PR titles are validated in CI; commit messages are validated by the local `commit-msg` hook. A non-conforming commit message is rejected when you commit — use interactive rebase to correct the history before pushing if one slips through.

### Validate commit messages locally (optional)

```bash
# validate the message saved in .git/COMMIT_EDITMSG
pnpm exec commitlint --config configs/commitlint/.commitlintrc.json --edit .git/COMMIT_EDITMSG
```

### Notes

- If the `commit-msg` hook rejects a message, fix it and commit again; if a non-conforming message was already committed (for example with `--no-verify`), use interactive rebase to correct it before pushing.
- Keep commits focused; maintainers may request squashing before merge.

---

## 🚦 CI & merging

The workflow reference lives in [docs/ci-cd.md](../docs/ci-cd.md); the maintainer release procedure lives in [docs/release.md](../docs/release.md).

- All PRs must pass every required CI job before merge, including lint, typecheck, unit tests with coverage, mutation tests and acceptance tests.
- If CI fails, fix locally, push, and wait for re-run. Your PR won't be merged until CI is green.
- `develop` and `main` require pull requests; no standing bypass actor exists on any ruleset that protects them.
- The repository is maintained by a single maintainer. The recorded solo-maintainer exception means a second human approval is not required today; the maintainer still reviews changes they did not author. When a second maintainer or code owner is added, the exception is revisited and one approval becomes mandatory. See [docs/ci-cd.md](../docs/ci-cd.md#repository-rulesets) and the `CICD-14` decision.
- Maintainers merge into `develop` once CI is green; release automation keeps the release pull request current, and the maintainer merges it into `main`. The full procedure is in [docs/release.md](../docs/release.md).
- Do not force-push shared branches. Automation-owned branches such as `chore/release` and `chore/sync-release-v<version>` are rewritten or created by the release workflow and must not be used for development. The only emergency bypass is the time-limited break-glass procedure in [docs/ci-cd.md](../docs/ci-cd.md#repository-rulesets).

---

## 🔒 Security

- Never commit secrets or credentials. Use environment variables and CI secret storage.
- Read [docs/security.md](../docs/security.md) before changing authentication, CORS, response headers, caching or error responses; it records the enforced controls and the accepted limitations.

> [!CAUTION]
> Committing secrets (API keys, credentials, private keys) can expose systems and cause security incidents. If you accidentally commit a secret, rotate it immediately and notify maintainers.

To report a vulnerability, use the [GitHub security advisory form](https://github.com/antoinezanardi/goat-it-api/security/advisories/new) instead of opening a public issue.

---

## 🤝 Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](../CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [antoine.zanardi@epitech.eu](mailto:antoine.zanardi@epitech.eu).

---

## 🐕 Husky & git hooks

This repository uses Husky hooks stored in the `.husky/` directory to enforce some checks before commits are accepted locally. The hook order is documented in [docs/ci-cd.md](../docs/ci-cd.md).

> [!NOTE]
> Husky is configured in the repo and the hook scripts live in `.husky/` — you can inspect them directly if needed.

### Current hooks

- `.husky/commit-msg` — runs commitlint to validate the pending commit message:

  ```bash
  pnpm exec commitlint --config configs/commitlint/.commitlintrc.json --edit "$1"
  ```

  This is the hook line verbatim: git passes the path of the pending commit message as `$1`, the same contract documented for [`commit-msg`](https://git-scm.com/docs/githooks#_commit_msg). Unlike the pre-commit hook below, it does not fall back to another package manager — keep `pnpm` on your `PATH`, or the hook exits `127` and git aborts the commit. It enforces the Conventional Commits rules configured in `configs/commitlint/.commitlintrc.json`.

- `.husky/pre-commit` — validates branch names, runs linting/tests on staged files and runs the repository guards whose inputs changed:

  ```bash
  <package-manager> run typecheck
  <package-manager> run validate:branch-name
  <package-manager> run lint:staged:fix
  <package-manager> run check:workflows:expressions   # only when workflows, actions or its script changed
  <package-manager> run check:tracked-env-files
  <package-manager> run check:dockerfile-pins         # only when Dockerfile, .dockerignore or a guard script changed
  <package-manager> run check:dockerignore            # only when Dockerfile, .dockerignore or a guard script changed
  <package-manager> run test:unit:staged
  ```

  (You can run the same validation locally as listed above. `<package-manager>` is `pnpm`, or `npm` when pnpm is not installed — a fallback that exists in `.husky/pre-commit` only, not in `.husky/commit-msg`.)

### Bypassing hooks

> [!CAUTION]
> Bypassing hooks with `--no-verify` skips important checks. Only use `git commit --no-verify` or `git push --no-verify` if you have a compelling reason or documented exception, and you understand the risks.

If you must bypass hooks temporarily (for example, when the checks are causing problems during a quick experimental commit):

```bash
git commit --no-verify -m "chore: temporary commit"
```

> [!WARNING]
> Resolve issues locally instead of bypassing hooks. The hooks exist to keep the repo healthy and to match CI expectations.
> CI will still run the checks on pushed commits, so bypassing hooks only affects local commits.

---

## 🧰 Additional tips

- Prefer small, focused PRs for faster review.
- Open a draft PR early for large work to gather feedback.
- Document any new config or runtime env in the README.
- Use the issue templates for bug reports and feature requests, and read the [architecture guide](../docs/architecture.md) before adding a new file.
- `CODEOWNERS` currently designates `@antoinezanardi` as the default owner for the repository — maintainers will be requested as reviewers automatically where applicable.

---

## 📞 Contact / Questions

If something is unclear, or you need help, comment on the PR or open an issue. Thanks for contributing — we appreciate your work! ❤️
