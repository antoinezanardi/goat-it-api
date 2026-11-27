# DOCS — Documentation & developer experience

Human-facing documentation and contributor experience of the Goat It API repository: the maintained `docs/` set and its registration in `AGENTS.md`, `docs/architecture.md` as the canonical placement guide, README onboarding and command truth, the GitHub community health files (`CONTRIBUTING`, issue forms, PR template, code of conduct, licence), the environment example, the Bruno collection and the OpenAPI contract, decision records, the generated changelog and script discoverability. Documentation must describe the repository as it is today, and a behaviour change updates its docs in the same change.

**Decision doc:** `.github/CONTRIBUTING.md` (section `## GOAT audit decisions`). **Diff triggers:** see SKILL.md category index.

**Not in this category:** `.agents/**`, `.opencode/**`, `AGENTS.md` and Copilot instruction accuracy → AGENT · security policy and vulnerability disclosure content → SEC · CI workflows, required checks and release automation → CICD · test-guide drift against test configuration and spec layout → TEST · environment-variable runtime behaviour and Node/pnpm parity across configs → PLAT · dependency licence inventory → SUP · code comments and docstrings → CODE

## Contents

- [1. Documentation set and registration](#1-documentation-set-and-registration)
- [2. README and onboarding](#2-readme-and-onboarding)
- [3. CONTRIBUTING and workflow](#3-contributing-and-workflow)
- [4. Environment example](#4-environment-example)
- [5. API documentation](#5-api-documentation)
- [6. Developer experience](#6-developer-experience)
- [Sources](#sources)

## 1. Documentation set and registration

- **[DOCS-01] Every maintained document is registered** — The root agent guide's useful-docs list names every maintained file under the docs tree (excluding the git-ignored agent workflow artifacts), each entry has a one-line purpose, and no listed document is missing from disk.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `AGENTS.md`, `docs/*.md` · Src: [1], [8], project: AGENTS.md
- **[DOCS-02] One canonical placement guide** — The architecture guide is the single source of truth for placement, naming, dependency direction and companions; every other document links to it for those rules instead of restating a different version, and it links back to the guides that own their procedures.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `docs/*.md`, `AGENTS.md`, `README.md`, `.github/CONTRIBUTING.md` · Src: [8], project: docs/architecture.md
- **[DOCS-03] Document names and headings are consistent** — Maintained documents use lowercase kebab-case `.md` names, start with a single H1 title and use heading levels without gaps; a renamed document keeps one canonical path and no duplicate stub remains.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `docs/*.md`, `README.md`, `.github/CONTRIBUTING.md` · Src: [8]
- **[DOCS-04] Each guide states its scope and audience** — Every maintained guide opens with a scope statement that says what it owns and what it does not, names its audience (contributor, operator, maintainer or agent) and links the neighbouring guides, so a reader knows where a rule belongs.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `docs/*.md` · Src: [8], project: docs/architecture.md
- **[DOCS-05] Decision records follow the protocol** — Every `## GOAT audit decisions` section is the last H2 of its decision document, opens with the protocol intro line, and each entry uses the dated heading and the six bullets (finding, decision, rationale, revisit when, checklist change, recorded by).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `docs/*.md`, `.github/CONTRIBUTING.md` · Src: [7], project: AGENTS.md
- **[DOCS-06] Workflow artifacts stay out of the maintained set** — `docs/superpowers/` holds only git-ignored agent specs and plans, is not registered as maintained documentation, and no maintained guide depends on a file that is absent from a fresh clone.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `docs/architecture.md`, `.gitignore`, `AGENTS.md` · Src: [1], project: AGENTS.md

## 2. README and onboarding

- **[DOCS-07] The README states purpose, setup and entry points** — The first screen names the product and gives a one-sentence, jargon-free purpose (a headless quiz-content API for the Goat It game), and the README has explicit sections or links for installation, run, build, tests, code analysis, releases, documentation and licence.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `README.md` · Src: [2], [3]
- **[DOCS-08] Every README command exists verbatim** — Every `pnpm run <script>` and `pnpm <script>` quoted in the README exists in `package.json` `scripts`, uses the documented package manager and passes the flags it names; no dead, renamed or npm-only command is advertised.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `README.md`, `package.json` · Src: [2], [3]
- **[DOCS-09] README prerequisites match the enforced toolchain** — The installation section names Node.js with the version source (`engines.node` and the node-version file), pnpm from the `packageManager` field and Docker for the acceptance database; it does not present an alternative package manager as the primary path.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `README.md`, `package.json`, `configs/node/.node-version` · Src: [2], [3]
- **[DOCS-10] README links and the documentation index resolve** — Every badge and relative link resolves, the documentation section lists exactly the maintained guides with current paths, and the release, issue and contribution links target the live repository rather than a placeholder.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `README.md`, `docs/*.md`, `CHANGELOG.md` · Src: [2], [3]
- **[DOCS-11] A fresh clone reaches a running server with documented steps only** — Following only the README (install, environment file, database, dev command) yields a running development server on the documented host and port; every prerequisite and manual step is written down, including the Docker start command for the acceptance database.
  Evidence: `command` · Diff: ✗ · Severity: high · Src: [2], [3], project: README.md

## 3. CONTRIBUTING and workflow

- **[DOCS-12] The contribution guide targets the integration branch** — `.github/CONTRIBUTING.md`, the README, the PR template and the PR helper script agree that contributions branch from `develop` and open pull requests against `develop`, while `main` receives only release pull requests; no document instructs a pull request to `main`.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `.github/CONTRIBUTING.md`, `.github/PULL_REQUEST_TEMPLATE.md`, `README.md`, `scripts/**` · Src: [3], [9], project: docs/ci-cd.md
- **[DOCS-13] The documented gates equal the enforced gates** — The contributing guide and README list the same five gates in the same order as the root agent guide (lint fix, typecheck, unit coverage, mutation, acceptance), name the same prerequisites and state that CI re-runs them.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `.github/CONTRIBUTING.md`, `AGENTS.md`, `package.json` · Src: [3], [6], project: AGENTS.md
- **[DOCS-14] Documented hooks equal the hook scripts** — The hook commands quoted in the contributing guide match `.husky/pre-commit` and `.husky/commit-msg` in order and content, and any note about bypassing hooks frames it as a discouraged exception rather than a copy-paste default.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/CONTRIBUTING.md`, `.husky/pre-commit`, `.husky/commit-msg` · Src: [6], project: docs/ci-cd.md
- **[DOCS-15] Issue forms collect actionable data** — Each issue form has a name, a description and at least one required field; the bug form requires reproduction steps, expected and actual behaviour and a version, and the issue-template config explicitly disables blank issues and exposes working contact links.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `.github/ISSUE_TEMPLATE/**` · Src: [9]
- **[DOCS-16] The PR template mirrors the enforced workflow** — The pull-request template asks for the linked issue and a description, and its checklist maps one-to-one to the enforced gates, branch and title rules, documentation update and code-of-conduct reading, with no missing and no invented gate.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/PULL_REQUEST_TEMPLATE.md`, `.github/CONTRIBUTING.md` · Src: [9], [3], project: AGENTS.md

## 4. Environment example

- **[DOCS-17] The environment example matches the environment schema** — Every variable accepted by the boot-time environment schema appears in the environment example with the same name, shape and default, and every example variable is consumed by the configuration layer; no orphan or missing variable remains.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `env/.env.example`, `src/infrastructure/api/config/schemas/env.schema.ts`, `src/infrastructure/api/config/constants/**` · Src: [3], [6], project: docs/architecture.md §7
- **[DOCS-18] Every environment variable is documented** — Each variable in the example carries a comment stating its purpose and, where relevant, its unit, allowed values, default and whether it is a secret, so an operator can configure the API without reading the schema.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `env/.env.example`, `src/infrastructure/api/config/schemas/env.schema.ts` · Src: [3], project: docs/operations.md
- **[DOCS-19] Tracked environment files carry no real secret** — The example is a template, the test environment holds test-only values, the local environment file is git-ignored, and no tracked environment file contains a production key, token, private key or HMAC secret.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `env/.env.example`, `env/.env.test`, `.gitignore` · Src: [3], project: docs/security.md §Secrets
- **[DOCS-20] Editor defaults agree with the conventions** — The editor defaults for indentation, end-of-line, charset and final-newline policy per file type equal the formatting rules stated in the root agent guide and enforced by the linters, including the documented line-length exception for Markdown and JSON.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `.editorconfig`, `AGENTS.md`, `eslint.config.ts` · Src: [3], project: AGENTS.md

## 5. API documentation

- **[DOCS-21] The Bruno guide matches the shipped collection** — The guide's environment list, folder list, setup steps and secret names match the files under the Bruno collection, and it names the running-server prerequisite and the base URL used by the local environment.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `docs/bruno.md`, `configs/bruno/Goat It/**` · Src: [3], [10]
- **[DOCS-22] The Bruno collection covers every endpoint** — Every controller route has a matching request in the collection (or an explicit documented exclusion), requests use the shared auth settings and secret variables, and no request hardcodes a credential or a host.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `configs/bruno/Goat It/**`, `src/**/*.controller.ts` · Src: [10], project: docs/bruno.md
- **[DOCS-23] The OpenAPI surface is reachable and documented** — Swagger is served at the documented path with the documented title and tags, every route and DTO is represented, and the documentation states whether the UI is environment-gated; a docs route left open on every environment is recorded as a known decision rather than left implicit.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/infrastructure/api/server/swagger/**`, `docs/*.md` · Src: [11], project: docs/security.md §Swagger
- **[DOCS-24] The API contract inventory matches the controllers** — The API contract document's route table lists every method, path, controller, authentication requirement and success status exactly as the controller decorators declare them; adding, moving or removing a route updates the table and its auth column.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `docs/*.md`, `src/**/*.controller.ts` · Src: [11], project: docs/api-contract.md
- **[DOCS-25] The contract's known limitations are current** — Every gap listed as a known limitation in the API contract document (versioning, pagination, error-code coverage, CORS header mismatch, unbounded filters) still applies to the code, and a fixed gap is removed from the list in the same change.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `docs/*.md`, `src/infrastructure/api/server/cors/**` · Src: [11], project: docs/api-contract.md

## 6. Developer experience

- **[DOCS-26] Every repository script is documented and discoverable** — Every `package.json` script has a one-line purpose somewhere a contributor can find it (README, contributing guide or a guide it links), internal scripts are marked internal, and script names follow the repository's `verb:object[:modifier]` convention with one verb per action.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `package.json`, `README.md`, `.github/CONTRIBUTING.md`, `docs/*.md` · Src: [3], [8]
- **[DOCS-27] Documented decisions are amended in the same change** — A diff that changes code or configuration so that a documented decision no longer holds updates the decision record in the same diff, marks a reversed decision as superseded and never leaves a doc that contradicts the code.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `docs/*.md`, `.github/CONTRIBUTING.md` · Src: [7], project: AGENTS.md
- **[DOCS-28] The changelog is generated and structurally stable** — The changelog lists releases newest first with SemVer versions, compare links and ISO dates, groups entries by the commit types configured for release automation, and dependency bumps are grouped rather than duplicated per package.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `CHANGELOG.md`, `configs/semantic-release/**` · Src: [4], [5], [6]
- **[DOCS-29] Security fixes are named in release notes** — When a release fixes a known vulnerability (CVE or GHSA) in the app or a shipped dependency, the changelog section and the GitHub release body name the identifier; a security release is never published as an unlabelled dependency bump.
  Evidence: `command` · Diff: ✗ · Severity: high · Src: [3], [4]
- **[DOCS-30] Documentation moves with the behaviour it describes** — A diff that adds, renames or removes a script, environment variable, config path, route, workflow or documented behaviour updates every document that mentions it (README, contributing guide, guides, API contract) in the same diff.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `README.md`, `.github/CONTRIBUTING.md`, `docs/*.md`, `package.json` · Src: [3], [8], project: AGENTS.md

## Sources

[1] GitHub Docs — Creating a default community health file: https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/creating-a-default-community-health-file (fetched 2026-11-04)
[2] GitHub Docs — About the repository README file: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes (fetched 2026-11-04)
[3] OpenSSF Best Practices — Passing criteria: https://www.bestpractices.dev/en/criteria/0 (fetched 2026-11-04)
[4] Keep a Changelog 1.1.0: https://keepachangelog.com/en/1.1.0/ (fetched 2026-11-04)
[5] Semantic Versioning 2.0.0: https://semver.org/ (fetched 2026-11-04)
[6] Conventional Commits 1.0.0: https://www.conventionalcommits.org/en/v1.0.0/ (fetched 2026-11-04)
[7] ADR Templates (Nygard, MADR 4.0.0): https://adr.github.io/adr-templates/ (fetched 2026-11-04)
[8] Diátaxis — Towards a theory of quality in documentation: https://diataxis.fr/quality/ (fetched 2026-11-04)
[9] GitHub Docs — About issue and pull request templates: https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/about-issue-and-pull-request-templates (fetched 2026-11-04)
[10] Bruno — Documentation: https://docs.usebruno.com/ (fetched 2026-11-04)
[11] OpenAPI Specification: https://spec.openapis.org/oas/latest.html (fetched 2026-11-04)
