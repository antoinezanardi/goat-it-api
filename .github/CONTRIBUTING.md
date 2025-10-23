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
- 🐕 [Husky & git hooks](#-husky--git-hooks)
- 🧰 [Additional tips](#-additional-tips)
- 📞 [Contact / Questions](#-contact--questions)

---

## 📌 High-level rules

- The integration branch is `develop`. All contributions must be based on `develop` and opened as PRs targeting `develop`.
- Every PR must pass the full CI pipeline before it can be merged (linting, type checks, unit tests, mutation tests, acceptance tests).
- Branch names and commit messages must follow the defined conventions (see below).

> [!IMPORTANT]
> Please always target `develop` for PRs. `main` is protected and reserved for releases; PRs to `main` will be rejected.

---

## ✅ Quick checklist

- [ ] Fork the repository on GitHub
- [ ] Clone your fork locally
- [ ] Create a branch from `develop` following the branch naming rules
- [ ] Run local checks (typecheck, unit tests, mutation tests if possible)
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

Run these locally to speed up iteration — CI will run them again.

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

### Build

```bash
pnpm run build
```

### Branch name validation (same validation as CI)

```bash
pnpm run validate:branch-name
```

---

## 🌿 Branching rules

- Always branch from the latest `develop`.
- `main` is protected for production; do not open PRs against `main`.
- Branch names must follow the validation config at `configs/validate-branch-name/.validate-branch-namerc.json`.

> [!CAUTION]
> Branch names that do not match the configured pattern will be rejected by CI and/or hooks. Validate locally with `pnpm run validate:branch-name` before pushing.

### Pattern (regex)

```regex
^(feat|fix|docs|style|refactor|test|perf|build|ci|chore|revert)/.+$
```

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

We use Conventional Commits. Commit messages and PR titles should follow the Conventional Commits header format. The repo's commitlint config is in `configs/commitlint/.commitlintrc.json` (it extends `@commitlint/config-conventional`). CI enforces these rules.

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
> Commit messages and PR titles are enforced by `commitlint`. Non-conforming messages will cause CI failures. Use interactive rebase to correct message history before pushing if needed.

### Validate commit messages locally (optional)

```bash
# validate the message saved in .git/COMMIT_EDITMSG
npx --no-install @commitlint/cli --config configs/commitlint/.commitlintrc.json --edit .git/COMMIT_EDITMSG
```

### Notes

- If CI rejects commit messages, use interactive rebase to edit them locally before pushing.
- Keep commits focused; maintainers may request squashing before merge.

---

## 🚦 CI & merging

- All PRs must pass the CI checks before merge (lint, typecheck, unit tests, mutation tests, acceptance tests).
- If CI fails, fix locally, push, and wait for re-run. Your PR won't be merged until CI is green.
- Maintainers will merge into `develop` once reviews pass and CI is green. Release automation handles promotion to `main`.
- Please avoid force-pushing to shared branches after reviews start, as it can disrupt the review process.

---

## 🔒 Security

- Never commit secrets or credentials. Use environment variables and CI secret storage.

> [!CAUTION]
> Committing secrets (API keys, credentials, private keys) can expose systems and cause security incidents. If you accidentally commit a secret, rotate it immediately and notify maintainers.

---

## 🐕 Husky & git hooks

This repository uses Husky hooks stored in the `.husky/` directory to enforce some checks before commits are accepted locally.

> [!NOTE]
> Husky is configured in the repo and the hook scripts live in `.husky/` — you can inspect them directly if needed.

### Current hooks

- `.husky/commit-msg` — runs commitlint to validate commit messages:

  ```bash
  npx commitlint --config configs/commitlint/.commitlintrc.json --edit "$1"
  ```

  This ensures commit messages follow the Conventional Commits rules configured in `configs/commitlint/.commitlintrc.json`.

- `.husky/pre-commit` — validates branch names and runs linting/tests on staged files:

  ```bash
  <package-manager> run validate:branch-name
  <package-manager> run lint:staged:fix
  <package-manager> run test:unit:staged
  ```

  (You can run the same validation locally listed above. Use `<package-manager>` as `pnpm` or `npm` here.)

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
- `CODEOWNERS` currently designates `@antoinezanardi` as the default owner for the repository — maintainers will be requested as reviewers automatically where applicable.

---

## 📞 Contact / Questions

If something is unclear, or you need help, comment on the PR or open an issue. Thanks for contributing — we appreciate your work! ❤️
