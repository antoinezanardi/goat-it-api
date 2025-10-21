# 🫶 Contributing to Goat It API

Thank you for your interest in contributing — we appreciate your time and help! This document explains how to prepare, test and submit changes so they integrate smoothly with the project workflow.

## Table of contents

- 📌 [High-level rules](#-high-level-rules)
- ✅ [Quick checklist](#-quick-checklist)
- 🛠️ [Getting started (commands)](#-getting-started-commands)
- 🔍 [Local checks to run before opening a PR](#-local-checks-to-run-before-opening-a-pr)
- 🌿 [Branching rules](#-branching-rules)
- ✍️ [Commit messages & PR titles (Conventional Commits)](#-commit-messages--pr-titles-conventional-commits)
- 🚦 [CI & merging](#-ci--merging)
- 🔒 [Security](#-security)
- 🧰 [Additional tips](#-additional-tips)
- 📞 [Contact / Questions](#-contact--questions)

---

## 📌 High-level rules

- The integration branch is `develop`. All contributions must be based on `develop` and opened as PRs targeting `develop`.
- The `main` branch is reserved for production releases. Only the release process may create PRs from `develop` to `main`.
- Every PR must pass the full CI pipeline before it can be merged (linting, type checks, unit tests, mutation tests, acceptance tests).
- Branch names and commit messages must follow the defined conventions (see below).

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

## 🛠️ Getting started (commands)

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

- Type-check

```bash
pnpm run typecheck
```

- Unit tests

Code coverage is set to a minimum threshold of 100%.

```bash
pnpm run test:unit
# coverage
pnpm run test:unit:cov
```

- Mutation tests (heavy — can be slow)

Mutation score is set to a minimum threshold of 100%.

```bash
pnpm run test:mutation
```

- Build

```bash
pnpm run build
```

- Branch name validation (same validation as CI)

```bash
pnpm run validate:branch-name
```

---

## 🌿 Branching rules

- Always branch from the latest `develop`.
- `main` is protected for production; do not open PRs against `main`.
- Branch names must follow the validation config at `configs/validate-branch-name/.validate-branch-namerc.json`.

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

> The repo includes a helper script (`scripts/create-git-branch.sh`) if you prefer a guided flow.

---

## ✍️ Commit messages & PR titles (Conventional Commits)

We use Conventional Commits. Commit messages and PR titles should follow the Conventional Commits header format. The repo's commitlint config is in `configs/commitlint/.commitlintrc.json` (it extends `@commitlint/config-conventional`). CI enforces these rules.

### Header format

```text
<type>(<scope>): <short summary>
```

### Optional body, optional breaking change & footer

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

- The PR title should be a valid Conventional Commit header (same format as the first line of a commit). When possible, use the same string as the main commit or the eventual squashed commit message. Maintainers may reword/squash on merge but will keep the final commit Conventional.

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
- If CI fails, fix locally, push, and wait for re-run.
- Maintainers will merge into `develop` once reviews pass and CI is green. Release automation handles promotion to `main`.

---

## 🔒 Security

- Never commit secrets or credentials. Use environment variables and CI secret storage.

---

## 🧰 Additional tips

- Prefer small, focused PRs for faster review.
- Open a draft PR early for large work to gather feedback.
- Document any new config or runtime env in the README.
- `CODEOWNERS` currently designates `@antoinezanardi` as the default owner for the repository — maintainers will be requested as reviewers automatically where applicable.

---

## 📞 Contact / Questions

If something is unclear, or you need help, comment on the PR or open an issue. Thanks for contributing — we appreciate your work! ❤️
