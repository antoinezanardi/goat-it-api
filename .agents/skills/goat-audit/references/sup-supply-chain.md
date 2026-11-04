# SUP — Supply chain & dependencies

Third-party code and automation that enter the Goat It API repository, the CI install, the production image and the published `@goat-it/schemas` package: dependency inventory and freshness, vulnerability detection and response, pnpm install-time controls, lockfile and registry integrity, licenses, Renovate policy, published-package provenance, GitHub Actions pinning and env-file hygiene. The API ships one Node.js/NestJS runtime image plus one npm package from this workspace; both are in scope, while the game and admin clients keep their own supply chains.

**Decision doc:** `docs/security.md` (section `## GOAT audit decisions`). **Diff triggers:** see SKILL.md category index.

**Not in this category:** API keys, rate limiting, HTTP hardening → SEC · container image CVEs, base-image digest, non-root user, `.dockerignore` → PLAT · branch protection, release process, workflow permissions beyond action pinning → CICD · runtime timeouts, retries, cancellation → REL · alerting and log shipping → OPS

## Contents

- [1. Vulnerability management](#1-vulnerability-management)
- [2. Inventory and freshness](#2-inventory-and-freshness)
- [3. Licenses](#3-licenses)
- [4. Lockfile and registry integrity](#4-lockfile-and-registry-integrity)
- [5. Renovate and version tracking](#5-renovate-and-version-tracking)
- [6. Published package supply chain](#6-published-package-supply-chain)
- [7. Action pinning and CI inputs](#7-action-pinning-and-ci-inputs)
- [8. Sensitive files](#8-sensitive-files)
- [Sources](#sources)

## 1. Vulnerability management

- **[SUP-01] Full dependency audit is clean at high** — `pnpm audit --audit-level=high` without `--prod` exits 0; every remaining advisory is governed by [SUP-06] rather than ignored silently (verified: pnpm 12.16.1).
  Evidence: `command` · Diff: ✗ · Core: ✓ · Severity: high · Src: [3], [25]
- **[SUP-02] Shipped dependency audit is clean at high** — `pnpm audit --prod --audit-level=high` exits 0, so the `dependencies` installed into the production image carry no high or critical advisory (verified: pnpm 12.16.1).
  Evidence: `command` · Diff: ✗ · Core: ✓ · Severity: high · Src: [3], [25]
- **[SUP-03] Audit runs on every pull request** — The dependency-audit job runs on every pull request targeting `main` or `develop` and fails the pull request on a high or critical advisory.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `.github/workflows/build.yml`, `.github/actions/audit-dependencies/**` · Src: [3], [14]
- **[SUP-04] Scheduled audit catches new advisories** — A workflow with a `schedule:` trigger runs the full dependency audit at least weekly, so an advisory published against unchanged code is detected without a pull request.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `.github/workflows/**` · Src: [3], [14]
- **[SUP-05] No audit flag silently succeeds** — No audit invocation uses `--ignore-registry-errors`; `--ignore-unfixable` is absent or paired with a tracked, dated exception, and no step swallows the audit exit code.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/actions/**`, `.github/workflows/**`, `package.json` · Src: [3]
- **[SUP-06] Audit ignores are governed** — When an advisory is ignored, it is listed by GHSA ID with an owner and an expiry date, and no blanket CVE range, `auditConfig.ignoreCves` catch-all or `|| true` hides the result.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `package.json`, `pnpm-workspace.yaml` · Src: [3]
- **[SUP-07] Vulnerability alerts are enabled** — `gh api repos/{owner}/{repo}/vulnerability-alerts` returns 204, or the repository documents an equivalent OSV feed used by Renovate, so vulnerability pull requests have an advisory signal.
  Evidence: `command` · Diff: ✗ · Severity: medium · Src: [11], [19]

## 2. Inventory and freshness

- **[SUP-08] Outdated-major budget** — `pnpm outdated` reports no direct dependency more than one major version behind and no package untouched for more than 12 months without a documented exception.
  Evidence: `command` · Diff: ✗ · Severity: medium · Src: [5]
- **[SUP-09] No duplicate majors in the resolved graph** — The lockfile resolves each package to one major version, or every duplicate major is explained by an `overrides` entry with an exit condition; `pnpm ls` shows no accidental second major for a direct dependency.
  Evidence: `command` · Diff: ✗ · Severity: medium · Src: [1], [2]
- **[SUP-10] Dedupe check passes** — `pnpm dedupe --check` exits 0, so no two lockfile entries can be collapsed to the same version without a deliberate override (verified: pnpm 12.16.1).
  Evidence: `command` · Diff: ✗ · Severity: low · Src: [7]
- **[SUP-11] Overrides are justified** — Every `overrides` entry in the workspace manifest (today `conventional-changelog-writer: ^9.3.0`) links to an advisory or upstream issue and states its exit condition.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `pnpm-workspace.yaml` · Src: [2], [1]

## 3. Licenses

- **[SUP-12] License inventory is non-empty** — `pnpm licenses list --json` over the production dependency set is non-empty, lists every shipped package name and version, and is reviewed when dependencies change.
  Evidence: `command` · Diff: ✗ · Severity: high · Src: [4], [24]
- **[SUP-13] No unapproved copyleft in the shipped set** — No GPL, AGPL or SSPL license appears among production dependencies or their transitive packages without a documented legal exception naming the package and the obligation.
  Evidence: `command` · Diff: ✗ · Severity: high · Src: [4], [24]
- **[SUP-14] CI enforces the license allowlist** — A CI step parses `pnpm licenses list --json` against an allowlist and fails on an unknown or copyleft license, rather than relying on manual review.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/workflows/**`, `.github/actions/**` · Src: [4], [14]

## 4. Lockfile and registry integrity

- **[SUP-15] Lockfile is committed and current** — `pnpm-lock.yaml` is tracked, and `pnpm install --frozen-lockfile` succeeds on a clean checkout, so `package.json` and the lockfile cannot drift.
  Evidence: `command` · Diff: ✗ · Core: ✓ · Severity: high · Src: [6], [8]
- **[SUP-16] Every install is frozen** — Every CI install and the container build runs `pnpm install --frozen-lockfile`; no pipeline step runs `pnpm add` or `pnpm install <package>`.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `.github/actions/install-project/**`, `.github/workflows/**`, `Dockerfile` · Src: [6], [14]
- **[SUP-17] Registry is pinned to HTTPS** — Packages resolve only from `https://registry.npmjs.org` or a declared HTTPS mirror; no lockfile entry uses `http://`, a plain Git remote or an unqualified alternate registry.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `pnpm-lock.yaml`, `pnpm-workspace.yaml` · Src: [2], [8]
- **[SUP-18] No exotic resolutions enter the lockfile** — `pnpm-lock.yaml` contains no `git+`, `git://`, direct tarball URL or local `file:` resolution, and overrides never introduce one.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `pnpm-lock.yaml`, `pnpm-workspace.yaml` · Src: [1], [2]
- **[SUP-19] pnpm policy lives in the workspace file** — Install-policy settings (`overrides`, `allowBuilds`, `minimumReleaseAge`, `packages`) live in the workspace manifest; any registry configuration file holds only registry or authentication entries, never install-policy overrides.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `pnpm-workspace.yaml` · Src: [2]

## 5. Renovate and version tracking

- **[SUP-20] Renovate uses a hardened preset and pins digests** — The Renovate configuration extends a curated preset set such as `config:best-practices`, keeps `pinDigests: true`, and schedules lockfile maintenance weekly.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/renovate.json` · Src: [9], [10]
- **[SUP-21] Vulnerability alerts are enabled** — The Renovate configuration must set `osvVulnerabilityAlerts: true` (the option defaults to `false`) so advisories for direct dependencies produce fix pull requests when a fix exists; malicious-package detection warns and blocks rather than opening pull requests, and an absent option is a finding.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `.github/renovate.json` · Src: [10], [25]
- **[SUP-22] Automerge has release-age and check guardrails** — When Renovate automerge is enabled for third-party packages, it waits the documented release age and merges only through required checks or a merge queue; majors are never automerged, and the current age is recorded in `docs/security.md`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/renovate.json` · Src: [9], [10]
- **[SUP-23] Off-manifest versions are tracked** — Every pinned version outside the manifest and lockfile (package manager, Node version file, container base image) is updated by a built-in Renovate manager or a `customManagers` entry.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/renovate.json`, `Dockerfile`, `configs/node/.node-version`, `package.json` · Src: [10], [14]

## 6. Published package supply chain

- **[SUP-24] Workspace lockfile covers the published package** — The published package has no independent lockfile and is resolved by the root workspace lockfile, so one frozen install covers the API app and the package.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `packages/schemas/package.json`, `pnpm-workspace.yaml` · Src: [8]
- **[SUP-25] Published package uses OIDC provenance** — The publish workflow requests `id-token: write`, runs `pnpm publish --provenance` against `registry.npmjs.org`, and uses no long-lived npm token secret.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `.github/workflows/publish-schemas-package.yml`, `packages/schemas/package.json` · Src: [15], [17]
- **[SUP-26] Publishing is restricted to release branches** — The publish workflow triggers only on pushes to `main` and `develop` when the published package changes; no arbitrary branch, tag or `workflow_dispatch` ref can publish.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `.github/workflows/publish-schemas-package.yml` · Src: [14], [17]
- **[SUP-27] Published package contents are allowlisted** — The published package ships only `dist`, `LICENSE` and `README.md`; a prepublish build runs, generated declarations contain no `: any`, and the version is bumped before publishing per the repository DOD.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `packages/schemas/package.json`, `packages/schemas/tsdown.config.ts`, `packages/schemas/LICENSE` · Src: [20], [8], project: AGENTS.md

## 7. Action pinning and CI inputs

- **[SUP-28] Remote GitHub Actions are SHA-pinned** — Every `uses:` reference to a remote action or reusable workflow is pinned to a full 40-character commit SHA with the version in a comment; only local composite-action paths may be relative.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `.github/workflows/**`, `.github/actions/**` · Src: [14]
- **[SUP-29] No `pull_request_target` runs untrusted code** — No workflow uses `pull_request_target` to check out or execute a pull request head, and no workflow grants a write token to code from a fork.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `.github/workflows/**` · Src: [23], [14]
- **[SUP-30] Workflow permissions are least-privilege** — Every workflow declares a top-level `permissions` block (typically `contents: read`) and elevates individual jobs only for the scope they need; no workflow uses `write-all` or inherits default write permissions.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/workflows/**` · Src: [21], [14]
- **[SUP-31] CodeQL scans pull requests and the main branch** — CodeQL runs on every pull request targeting `main`/`develop` and on pushes to `main`, analyzes the TypeScript source, and uploads results with `security-events: write`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/workflows/build.yml`, `.github/workflows/release-creation.yml`, `.github/actions/code-ql/**` · Src: [22], [14]

## 8. Sensitive files

- **[SUP-32] Env files are git-ignored** — The repository ignore rules cover `.env` and every local or deployed variant such as `.env.*`, while only the template and test fixture are tracked, so a new local or production env file cannot be committed by accident.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `.gitignore`, `env/.env.example`, `env/.env.test` · Src: [12], [16]
- **[SUP-33] No local or deployed env file is tracked** — Only the tracked template and test fixture are committed; no `.env`, `.env.local`, `.env.staging` or `.env.production` is force-added.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `env/.env.example`, `env/.env.test` · Src: [12], [16]
- **[SUP-34] Tracked env files hold no live credentials** — The tracked template contains placeholders only and the test fixture contains test-only values; neither contains a production or staging API key, HMAC secret, DSN token, password or private key.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: critical · Look: `env/.env.example`, `env/.env.test` · Src: [12], [16], project: AGENTS.md
- **[SUP-35] Secret scanning and push protection are enabled** — `gh api repos/{owner}/{repo}` reports `security_and_analysis.secret_scanning.status == "enabled"` and `security_and_analysis.secret_scanning_push_protection.status == "enabled"`.
  Evidence: `command` · Diff: ✗ · Severity: high · Src: [12], [13], [18]

## Sources

[1] pnpm: Mitigating supply chain attacks — https://pnpm.io/supply-chain-security (fetched 2026-11-04; pnpm 12.16.1)
[2] pnpm: Settings (`pnpm-workspace.yaml`) — https://pnpm.io/settings (fetched 2026-11-04; pnpm 12.16.1)
[3] pnpm audit — https://pnpm.io/cli/audit (fetched 2026-11-04; pnpm 12.16.1)
[4] pnpm licenses — https://pnpm.io/cli/licenses (fetched 2026-11-04; pnpm 12.16.1)
[5] pnpm outdated — https://pnpm.io/cli/outdated (fetched 2026-11-04; pnpm 12.16.1)
[6] pnpm install — https://pnpm.io/cli/install (fetched 2026-11-04; pnpm 12.16.1)
[7] pnpm dedupe — https://pnpm.io/cli/dedupe (fetched 2026-11-04; pnpm 12.16.1)
[8] pnpm workspaces — https://pnpm.io/workspaces (fetched 2026-11-04; pnpm 12.16.1)
[9] Renovate: Upgrade best practices — https://docs.renovatebot.com/upgrade-best-practices/ (fetched 2026-11-04)
[10] Renovate: Configuration options — https://docs.renovatebot.com/configuration-options/ (fetched 2026-11-04)
[11] GitHub Docs: About Dependabot alerts — https://docs.github.com/en/code-security/dependabot/dependabot-alerts/about-dependabot-alerts (fetched 2026-11-04)
[12] GitHub Docs: About secret scanning — https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning (fetched 2026-11-04)
[13] GitHub Docs: About push protection — https://docs.github.com/en/code-security/secret-scanning/introduction/about-push-protection (fetched 2026-11-04)
[14] GitHub Docs: Security hardening for GitHub Actions — https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions (fetched 2026-11-04)
[15] npm Docs: Generating provenance statements — https://docs.npmjs.com/generating-provenance-statements (fetched 2026-11-04)
[16] OpenSSF Best Practices: Passing criteria — https://www.bestpractices.dev/en/criteria/0 (fetched 2026-11-04)
[17] GitHub Docs: About security hardening with OpenID Connect — https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect (fetched 2026-11-04)
[18] GitHub REST API: Get a repository (`security_and_analysis`) — https://docs.github.com/en/rest/repos/repos#get-a-repository (fetched 2026-11-04)
[19] GitHub REST API: Check if vulnerability alerts are enabled — https://docs.github.com/en/rest/repos/repos#check-if-vulnerability-alerts-are-enabled-for-a-repository (fetched 2026-11-04)
[20] npm Docs: `package.json` `files` — https://docs.npmjs.com/cli/v11/configuring-npm/package-json#files (fetched 2026-11-04)
[21] GitHub Docs: Workflow syntax — `permissions` — https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#permissions (fetched 2026-11-04)
[22] GitHub Docs: About code scanning with CodeQL — https://docs.github.com/en/code-security/code-scanning/introduction-to-code-scanning/about-code-scanning-with-codeql (fetched 2026-11-04)
[23] GitHub Docs: Workflow syntax — `pull_request` and `pull_request_target` — https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#onpull_requestpull_request_targetbranchesbranches-ignore (fetched 2026-11-04)
[24] SPDX License List — https://spdx.org/licenses/ (fetched 2026-11-04)
[25] GitHub Advisory Database — https://github.com/advisories (fetched 2026-11-04)
