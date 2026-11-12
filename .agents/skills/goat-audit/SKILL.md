---
name: goat-audit
description: Use when the goat-auditor runs /goat-audit, when final-reviewer reviews a diff, when plan-writer plans file changes, or when brainstormer designs a spec in goat-it-api. Defines the 18 GOAT audit categories (681 checks, 138 Core, 13 Target: reach), [CODE-NN] check IDs, evidence, target, severity and grading rules, the release and platinum verdicts, diff and design triggers, the "GOAT audit decisions" protocol, and the report and triage templates.
---

# GOAT audit

## 1. Overview

The GOAT audit ("Greatest Of All Time" × Goat It) is a reusable, exhaustive, evidence-based audit of the whole `goat-it-api` repository across 18 professional dimensions. The bar is a god-tier professional API, not "no obvious bug". Judge the service, not the polish: evaluate the HTTP contract as a client and an operator would; a green pipeline never masks a missing control, a silent 500, an unindexed hot path or a test that asserts nothing.

A check is either a **conformance** check — the repository must match its documented decisions — or a **`Target: reach`** check — the platinum capability must exist, and a documented deferral is a `GAP`, not a pass. Conformance alone can be green while the service is not platinum-ready; §4.5 and §5.3 measure the difference.

The category checklists in `references/` **are the audit contract**. Each check has a stable ID, one evidence type, a default severity, optional `Look` globs and cited sources. Four consumers read this skill:

| Consumer | Mode | Reads | Output |
|----------|------|-------|--------|
| `goat-auditor` via `/goat-audit` | Full or partial audit | this file, all 18 references, the two templates, the mapped decision docs | `docs/audits/GOAT-AUDIT-*.md`, GitHub issues/advisories, decision notes |
| `final-reviewer` | Diff | this file, the in-scope sections of triggered references, mapped decision docs | "GOAT audit (diff mode)" block |
| `plan-writer` | Plan (shift-left) | this file, Core checks of triggered references, mapped decision docs, the spec's `## GOAT constraints` | `GOAT checks:` line per task |
| `brainstormer` | Design (shift-left) | this file, Core checks of triggered references, mapped decision docs | `## GOAT constraints` and `## Constraints accepted as risks` in the spec |

The orchestrator also reads §7 when the maintainer pushes back on a GOAT finding.

## 2. Iron rules

- **(a) Evidence for every claim.** A PASS, FAIL or N/A cites `file:line`, command output, an artifact path or a URL. No evidence, no verdict.
- **(b) No speculation.** A claim that cannot be proven is `⚠️ UNVERIFIED`, never FAIL and never PASS.
- **(c) Read-only.** Auditors never modify project files. The only writes allowed are the report, its run directory and approved decision notes. Tool-generated build and test artifacts (`dist/`, coverage output and the tracked Stryker incremental state) are expected side effects of the audit commands, not project edits: keep them and never revert or hand-edit them. Never bypass a permission denial; report it instead. `.agents/skills/goat-audit/**` is never writable: checklists are not auditor-editable.
- **(d) Library facts are verified, not remembered.** Any finding that depends on a library default, API or behaviour is confirmed with `docs-fetcher` (or Context7/`webfetch` when the subagent is unavailable) before it is reported (§8).
- **(e) Decisions are binding.** Read the mapped decision doc in full. A `## GOAT audit decisions` entry has already reshaped the checklist it belongs to (§7); the documented decisions listed in §7 are honored until their revisit condition is met.
- **(f) Read `docs/architecture.md`** in full before any audit, review or plan that touches project files.
- **(g) `Look` hints are starting points, never proof.** A glob tells you where evidence usually lives; the finding still needs `file:line`.
- **(h) Core gates, the full set audits.** Every change is gated on the **Core** checks of its triggered categories; the full set is for a full audit. A Core mark is part of the check contract, not a severity alias (§4.4).

## 3. Modes

- **Full audit** — procedure in `.opencode/commands/goat-audit.md` (agent `goat-auditor`): preflight, evidence tiers, one explorer per category, library verification, adversarial verification, report, triage; evaluates every check of the selected categories.
- **Partial audit** — the same procedure restricted to a chosen subset of categories (the run always asks for the scope first; `categories <CODES>` skips the question). A partial report states the audited set in its header, prints `— not audited` for every other category in the scorecard, computes grades only for audited categories and labels the release verdict `partial (n/18)`. Its delta and Appendix B cover audited categories only.
- **Diff mode** — §10; used by `final-reviewer` on every review; evaluates the **Core** checks (§4.4) of the triggered categories, never the full set.
- **Plan mode (shift-left)** — `plan-writer` inherits the spec's `## GOAT constraints` when one exists, matches planned paths against the category index triggers **and the Decision doc column**, reads the triggered references' **Core** `Diff: ✓` checks and the mapped decision docs, and writes a `GOAT checks:` line in every task.
- **Design mode (shift-left at spec time)** — `brainstormer` has no paths yet: it maps the feature's design areas to categories (§6 design triggers), reads those references' **Core** checks that actually constrain the design (10–20 of them, never a whole category), and writes `## GOAT constraints` (check ID → design decision) and `## Constraints accepted as risks` in the spec. Every other check is deferred to plan and review.

A full audit is expensive: 18 explorer dispatches in waves of six over 681 checks (138 Core, 13 Target: reach), adversarial verification of every FAIL, a production build with coverage and mutation, a `dist/` inventory and secrets scan, and the opt-in runtime probes (acceptance suite, local built server, live GETs). Say so when offering the category choice; a partial audit costs proportionally less.

## 4. Check format, IDs, outcomes

### 4.1 Check line format

```markdown
- **[SEC-01] Every business route is guarded by the audience API key** — <pass criterion with exact values, names, thresholds>.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Target: reach · Severity: high · Look: `src/contexts/question/infrastructure/http/controllers/**` · Src: [11], project: docs/security.md
```

- **Evidence** — exactly one of: `static` (source/config/docs/grep), `artifact` (built `dist/` or generated files), `command` (tool output: `pnpm audit`, `gh api`, lint, tests…), `runtime` (running app: acceptance suite, local server, live URL), `manual` (needs a human: legal confirmation, credential rotation, visual judgment).
- **Diff** — `✓` only when Evidence is `static`; `✗` otherwise.
- **Core** — `✓` marks a check in the Core tier (§4.4); omitted otherwise. The category index records each category's Core count.
- **Target** — `reach` marks a platinum capability (§4.5); omitted means a conformance check. A reach check is never satisfied by a documented deferral.
- **Severity** — the default when the check fails (§5). Auditors may move it **one level** with a written justification in the finding.
- **Look** — optional repository globs; every glob matched at least one path when the file was written.
- **Src** — `[n]` indexes into the file's `## Sources`, and/or `project: <repo path>` (optionally `§<n>`).
- `(verified: <library> <x.y[.z]>)` marks a library-dependent criterion. Re-verify when the installed major or minor differs.
- A removed check leaves no line (§11); the category's IDs are compacted in the same change.
- **Criterion scope.** A criterion states an outcome that stays true as the product grows: it prescribes no single component, route, controller or feature as the only acceptable implementation, and component or file names belong in `Look` and `Src`, never inside the criterion. Business rules, value sets and field, collection or route inventories belong in the mapped decision doc, never inside the criterion; an example may illustrate a rule but must stay non-exhaustive.

### 4.2 IDs

- Format `<CODE>-<NN>`: two digits, zero-padded (`SEC-07`); three digits from 100 (`SEC-100`).
- IDs are unique per category and form a **gap-free sequence** `-01`…`-NN`: no gap, no duplicate.
- A removal or merge renumbers the category's remaining checks in file order, and every reference to them (this skill, agents, commands, templates) is updated in the same change, except a decision note attached to a removed check, which keeps the historical ID marked `(removed)` (§7).
- A new check takes the number after the category's last check; the next removal-driven renumbering restores file order.
- Always cite a check as `[SEC-07]` in reports, reviews and decisions.

### 4.3 Outcomes (full audit)

| Outcome | Meaning |
|---------|---------|
| `PASS` | Holds, with cited evidence. |
| `FAIL` | Violated; produces a finding (§9) and a severity. |
| `N/A` | The check does not apply (reason given). |
| `⚠️ UNVERIFIED` | Cannot be proven (e.g. Tier 3 probe skipped); reason given. |
| `DECIDED` | Covered by a documented decision outside the `## GOAT audit decisions` sections (e.g. a `docs/security.md` Known limitation); cite `doc:line`. A GOAT decision note never yields `DECIDED` — it amends the checklist (§7). Not valid for a `Target: reach` check. |
| `GAP` | A `Target: reach` capability is absent. The missing capability is recorded in the Platinum backlog (§5.3); a GAP is not a conformance FAIL and never contributes grade points. |

Every check of every triggered reference gets one of these outcomes in a full or partial audit. Never omit a check.

### 4.4 Core tier

`Core: ✓` marks the **138** checks that gate every change. `final-reviewer`'s diff mode, `plan-writer` and `brainstormer` evaluate the Core checks of the categories they trigger; a full audit evaluates all **681** checks.

- **Every critical check is Core.**
- A high check is Core when its failure can break a core flow, expose data, break the release or corrupt persisted data.
- A medium check is Core only when it encodes a project-wide invariant already enforced by `AGENTS.md`.
- The tier targets roughly 10–20 % of the set; the current 138 of 681 is 20.3 %, the accepted ceiling. The category index's `Core` column states each category's count and [AGENT-31] checks it.
- A Core check keeps its evidence type: diff mode evaluates the `Diff: ✓` ones and defers the `Diff: ✗` ones with a non-blocking ⚠️.

### 4.5 Target tier

`Target: reach` marks the **13** checks that define the platinum target rather than current conformance. The current set is `SEC-20`, `SEC-26`, `SEC-51`, `OPS-17`, `OPS-21`, `OPS-28`, `REL-07`, `REL-34`, `REL-35`, `API-44`, `DATA-37`, `PERF-20` and `PRIV-08`; the category index's `Reach` column states each category's count.

- A reach check is evaluated in full audits and in the mapped Core paths; its outcomes are `PASS`, `GAP` or `FAIL`. `GAP` means the capability is absent, whether or not the repository documents the deferral.
- A GAP is not a conformance FAIL: it adds no grade points and never blocks a merge by itself. It is reported in the Platinum backlog and in the `Platinum readiness` line (§5.3) so iteration reduces it over time.
- A decision note never turns a reach check into `DECIDED` and never rewrites the criterion to accept the absence. An Accepted risk may record an expiry and the reviewer, but the GAP remains until the capability lands. `Not applicable` and `False positive` still require the checklist amendment of §7.
- A reach check can be Core (`SEC-26`) or not. In diff mode a reach check that matches the diff reports `GAP` non-blocking; it never forces "Needs changes before merge".

## 5. Severity, grading, release verdict, priorities

### 5.1 Severity scale

| Level | Meaning |
|-------|---------|
| critical | Exploitable vulnerability or secret/PII exposure; production outage or data loss/corruption on a core flow; legal non-compliance with direct liability. |
| high | Likely client-visible failure, missing essential control, significant degradation of a core flow (e.g. an unauthenticated business route, unbounded resource use reachable by anyone, a release pipeline that can publish an unverified artifact, an unindexed hot query path). |
| medium | Real defect or best-practice gap with bounded impact or likelihood; maintainability risk with concrete cost. |
| low | Minor hygiene or polish; cheap improvement. |
| info | Observation or recommendation; no action required; never graded, never triaged. |

### 5.2 Grade per category

Points over CONFIRMED findings (after verification; DECIDED excluded): critical 10, high 5, medium 2, low 0.5, info 0.

| Grade | Rule |
|-------|------|
| 🐐 GOAT | 0 points, zero findings (info included) and zero `⚠️ UNVERIFIED` checks |
| 🏆 A | ≤ 2 points and no high/critical |
| ✅ B | ≤ 6 points and no critical |
| ⚠️ C | ≤ 12 points and no critical |
| 🟠 D | ≤ 25 points and at most 1 critical |
| ❌ F | otherwise (> 25 points or ≥ 2 critical) |

Append `⚠️ unverified` when more than 10 % of the category's checks are `⚠️ UNVERIFIED`; a category carrying that suffix is never 🐐 GOAT. `GAP` outcomes are excluded from the points and from the GOAT condition; they are measured by the platinum verdict below.

### 5.3 Release verdict, platinum readiness and priorities

- Release verdict: any confirmed critical → **Not ship-ready**; else any confirmed high → **Ship with follow-ups**; else **Ship-ready**. A partial run prefixes the verdict with `partial (n/18):`.
- Platinum readiness: **platinum-ready** only when the audited categories have zero `GAP`; otherwise `n gaps (P0 n · P1 n · P2 n · Polish n)`, using the check's default severity for the priority. A partial run prefixes it with `partial (n/18):`.
- Roadmap priorities: P0 = critical, P1 = high, P2 = medium, Polish = low. Info findings appear only in their category section. GAPs use the same priority scale and are listed in the Platinum backlog, never in the conformance remediation roadmap.

## 6. Category index

Each check belongs to exactly one category. Diff triggers activate when a changed path matches them. The **Decision doc** column is part of the matching: a changed decision doc triggers every category mapped to it. Triggers may name paths that do not exist yet; they activate when such a file is added. Two triggers currently name future paths — `.npmrc` and `src/**/logging/**` — and are intentionally kept.

| Code | Category | Reference file | Decision doc | Checks | Core | Reach | Diff triggers |
|------|----------|----------------|--------------|--------|------|-------|---------------|
| SEC | Application security | `references/sec-application-security.md` | `docs/security.md` | 55 | 12 | 3 | `src/infrastructure/api/auth/**`, `src/infrastructure/api/server/cors/**`, `src/shared/infrastructure/http/middlewares/**`, `src/app/filters/**`, `src/app/helpers/logger.helpers.ts`, `src/contexts/**/application/dto/**`, `src/shared/application/dto/**`, `src/infrastructure/api/config/**`, `env/**`, `src/main.ts`, `docker/**` |
| SUP | Supply chain & dependencies | `references/sup-supply-chain.md` | `docs/security.md` | 35 | 7 | 0 | `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `.github/renovate.json`, `.npmrc`, `packages/schemas/package.json`, `.github/workflows/**` |
| CICD | CI/CD, release & repository governance | `references/cicd-ci-cd-release.md` | `docs/ci-cd.md` | 40 | 8 | 0 | `.github/**`, `configs/semantic-release/**`, `configs/commitlint/**`, `configs/validate-branch-name/**`, `configs/lint-staged/**`, `.husky/**`, `scripts/**` |
| PLAT | Runtime platform (containers, config, deployment) | `references/plat-runtime-platform.md` | `docs/operations.md` | 40 | 8 | 0 | `Dockerfile`, `.dockerignore`, `docker/**`, `env/**`, `configs/node/**`, `configs/nest/**`, `configs/swc/**`, `configs/typescript/**`, `src/infrastructure/api/server/**`, `src/infrastructure/api/config/**`, `src/main.ts` |
| OPS | Observability & operations | `references/ops-observability-operations.md` | `docs/operations.md` | 30 | 6 | 3 | `src/infrastructure/api/health/**`, `src/infrastructure/api/server/**`, `src/app/helpers/logger.helpers.ts`, `docs/operations.md`, `.github/workflows/deploy-*.yml`, `.github/actions/**`, `src/main.ts` |
| REL | Reliability & resilience | `references/rel-reliability-resilience.md` | `docs/operations.md` | 35 | 7 | 3 | `src/infrastructure/**`, `src/contexts/**/infrastructure/**`, `src/shared/infrastructure/**`, `src/main.ts` |
| LOGIC | Domain logic & data correctness | `references/logic-domain-logic.md` | `docs/domain-logic.md` | 35 | 7 | 0 | `src/contexts/**/domain/**`, `src/contexts/**/application/**`, `src/shared/domain/**` |
| PERF | Performance | `references/perf-performance.md` | `docs/performance.md` | 35 | 7 | 1 | `src/contexts/**/infrastructure/persistence/**`, `src/contexts/**/application/use-cases/**`, `src/**/mappers/**` |
| I18N | Localization & Accept-Language handling | `references/i18n-localization.md` | `docs/i18n.md` | 26 | 6 | 0 | `src/shared/infrastructure/http/middlewares/localization/**`, `src/shared/domain/value-objects/locale/**`, `src/shared/application/dto/zod/validators/translation-completeness/**` |
| API | HTTP contract, OpenAPI, versioning, errors | `references/api-http-contract.md` | `docs/api-contract.md` | 45 | 9 | 1 | `src/contexts/**/application/dto/**`, `src/contexts/**/infrastructure/http/**`, `src/shared/application/dto/**`, `src/app/controllers/**`, `src/infrastructure/api/server/swagger/**`, `packages/schemas/**`, `configs/bruno/**` |
| DATA | MongoDB schema, indexes, migrations, integrity | `references/data-mongodb-model.md` | `docs/data-model.md` | 40 | 8 | 1 | `src/contexts/**/infrastructure/persistence/**`, `src/infrastructure/database/**`, `src/**/mongoose/**`, `docker/**` |
| ARCH | Architecture & design | `references/arch-architecture.md` | `docs/architecture.md` | 45 | 9 | 0 | any added, moved or deleted file under `src/`, `tests/`, `configs/`, `scripts/`, `packages/`; any changed import statement |
| STACK | Framework & stack correctness | `references/stack-framework-stack.md` | `docs/architecture.md` | 40 | 8 | 0 | `src/**`, `package.json`, `configs/nest/**`, `configs/swc/**`, `configs/typescript/**` |
| CODE | Code quality & conventions | `references/code-code-quality.md` | `docs/architecture.md` | 45 | 9 | 0 | any `*.ts` file, `tsconfig.json`, `eslint.config.ts`, `configs/eslint/**`, `oxlint.config.jsonc` |
| TEST | Testing & QA | `references/test-testing-qa.md` | `docs/unit-tests.md` if the evidence is under `tests/unit/**`, a `*.spec.ts`, `configs/vitest/**` or `configs/stryker/**`; `docs/acceptance-tests.md` if it is under `tests/acceptance/**` or `configs/cucumber/**` | 42 | 10 | 0 | `**/*.spec.ts`, `tests/**`, `configs/vitest/**`, `configs/stryker/**`, `configs/cucumber/**` |
| PRIV | Privacy & compliance | `references/priv-privacy-compliance.md` | `docs/privacy.md` | 28 | 5 | 1 | `src/**/logging/**`, `src/app/helpers/logger.helpers.ts`, `src/main.ts`, `docs/privacy.md`, `docker/**` |
| DOCS | Documentation & DX | `references/docs-documentation-dx.md` | `.github/CONTRIBUTING.md` | 30 | 6 | 0 | `docs/**`, `README.md`, `.github/*.md`, `.github/ISSUE_TEMPLATE/**`, `CHANGELOG.md`, `CODE_OF_CONDUCT.md`, `env/.env.example`, `package.json` (scripts) |
| AGENT | AI-agent tooling hygiene | `references/agent-agent-tooling.md` | `docs/architecture.md` | 35 | 6 | 0 | `AGENTS.md`, `.agents/**`, `.opencode/**`, `opencode.json`, `.github/copilot-instructions.md`, `mempalace.yaml` |

The category index totals **681 checks, 138 Core and 13 Target: reach checks**. [AGENT-31] verifies the `Checks`, `Core` and `Reach` columns against each reference file and [AGENT-32] verifies the check format, so a count change is a checklist change, not a report-only edit.

**Decision-doc mapping.** A changed decision doc triggers every category mapped to it: `docs/security.md` → SEC + SUP; `docs/operations.md` → PLAT + OPS + REL; `docs/architecture.md` → ARCH + STACK + CODE + AGENT; `docs/unit-tests.md` / `docs/acceptance-tests.md` → TEST; `.github/CONTRIBUTING.md` → DOCS; `docs/ci-cd.md` → CICD; `docs/domain-logic.md` → LOGIC; `docs/performance.md` → PERF; `docs/i18n.md` → I18N; `docs/api-contract.md` → API; `docs/data-model.md` → DATA; `docs/privacy.md` → PRIV.

Boundaries worth repeating: query and response performance → PERF; input-validation attack surface and authentication → SEC while the HTTP error shape and status mapping → API; what may be logged (secrets) → SEC while log operation → OPS; error-tracker data collection/PII → PRIV; domain invariants → LOGIC while schema and index definitions → DATA; duplicate CI runs → CICD; timeouts/retries/cancellation → REL; agent instruction files → AGENT while human docs → DOCS.

**Design triggers (spec time).** At spec time no path exists yet: `brainstormer` maps the feature's design areas to categories, states the resulting set in the spec, and reads those references. CODE and STACK are not design triggers — they stay at plan and review time.

| Design area the feature touches | Categories |
|---------------------------------|------------|
| New endpoint, route or controller action | API, SEC, REL, TEST (+ I18N if localized, + LOGIC if it carries a domain rule) |
| New domain rule, state or transition | LOGIC, TEST |
| New DTO or published contract | API, SEC, TEST |
| New persisted model or field | DATA, LOGIC, PERF, TEST |
| New dependency | SUP, ARCH, PERF |
| New environment variable or runtime configuration | PLAT, SEC |
| New workflow or release step | CICD, SUP |
| New document, runbook or decision record | DOCS |
| New agent, skill or command | AGENT |
| New locale or translation behaviour | I18N, API |
| Any project-file change | ARCH, TEST |

## 7. Decision-note protocol

**Location.** The category's decision doc (§6), inside a section `## GOAT audit decisions` that is always the **last H2** of the doc. The section is created with the first note, with this intro line:

`Recorded GOAT audit decisions. /goat-audit, final-reviewer and plan-writer honor these entries until their revisit condition is met.`

**New decision docs.** Every mapped decision doc exists today (`docs/security.md`, `docs/operations.md`, `docs/architecture.md`, `docs/ci-cd.md`, `docs/domain-logic.md`, `docs/performance.md`, `docs/i18n.md`, `docs/api-contract.md`, `docs/data-model.md`, `docs/privacy.md`, `docs/unit-tests.md`, `docs/acceptance-tests.md`, `.github/CONTRIBUTING.md`). If a future decision needs a missing doc, create it with an H1 title, one scope paragraph and the section, and register it in the `AGENTS.md` "Useful docs (`docs/`)" list — only when the agent's edit allowlist includes both files; otherwise stop and report the permission gap.

**Entry template.**

```markdown
### [<CODE>-<NN>] <Short imperative title> — <Accepted risk | Not applicable | False positive> (YYYY-MM-DD)

- **Finding:** <one sentence, including the original evidence `file:line` or resource>
- **Decision:** <what was decided>
- **Rationale:** <why>
- **Revisit when:** <observable trigger or date>
- **Checklist change:** <the exact criterion rewrite, or the removal and the renumbering it implies>
- **Recorded by:** /goat-audit (GOAT-AUDIT-YYYY-MM-DD) | orchestrator final review (<branch>)
```

**Kinds.** **Accepted risk** (valid finding consciously not fixed) · **Not applicable** (the check does not apply to this product; scope reason) · **False positive** (the finding was wrong; explain so the check is evaluated correctly next time).

**Checklist amendment.** A decision is history, never a permanent suppression: recording it also amends the checklist, through the ready-to-apply patch the run hands off (command §6.5 and §8.4; the auditor stays read-only). **Accepted risk** and **False positive** rewrite the criterion so it encodes the accepted deviation or the corrected rule and passes on the next run. **Not applicable** deletes the check, renumbers the category (§4.2, §11) and marks the note's ID `(removed)`. Until the amendment lands, the next run still reports the finding as `FAIL` with `decision recorded, checklist not yet amended — <doc>:<line>` instead of `DECIDED`. If the entry's "Revisit when" condition is observably met, evaluate the check normally and add `decision revisit triggered — <doc>:<line>` to the finding.

**Target: reach checks are never suppressed.** A decision note can record an Accepted risk, its reviewer and an expiry, but it cannot turn a reach check into `DECIDED` or rewrite the criterion to accept the absence: the GAP remains until the capability lands. `Not applicable` and `False positive` follow the normal amendment path and require the maintainer's approval; a `Not applicable` note deletes the check and renumbers the category.

**Existing documented decisions are binding too** (cite `file:line`, outcome `DECIDED`). Auditors therefore read each decision doc **in full**, not only its GOAT section:

- `docs/security.md` — Known limitations (#1263 rate limiting, security headers, request-body guard; #1262 error tracking; `pino-http` default request logging exposing headers/credentials; missing `SECURITY.md`) and deliberate choices.
- `docs/operations.md` — Out of scope (numeric SLOs, automatic rollback, remote log shipping, Sentry, Kubernetes probes) and reliability targets.
- `docs/architecture.md` — §13 Accepted exceptions, §5 published-surface and B-lite decisions, §7.4 intentionally-500 write errors.
- `docs/ci-cd.md` — documented branching, release, deployment and hook exceptions.
- `docs/domain-logic.md` — Known limitations and stated write-time/read-time enforcement.
- `docs/performance.md` — Known limitations (unindexed filter fields, `$expr` completeness scans, read-after-write round trips, unbounded list limits).
- `docs/i18n.md` — documented locale, fallback and applicability policy.
- `docs/api-contract.md` — Known limitations (no versioning prefix, no pagination, 500 without `errorCode`, CORS header mismatch, unbounded `theme-ids` / random `themeIds`).
- `docs/data-model.md` — migration posture and published persistence contracts.
- `docs/privacy.md` — data inventory, retention and logging policy, including the `pino-http` request-metadata limitation and log-retention ownership.
- `docs/unit-tests.md` and `docs/acceptance-tests.md` — documented conventions and deliberate exceptions.
- `.github/CONTRIBUTING.md` — documented workflow and hook exceptions.

## 8. Library verification and 🔒 sensitivity

- **Library verification.** A FAIL whose reasoning depends on a library's default, API or behaviour is confirmed by `docs-fetcher` (one dispatch per library, parallel allowed) before it is reported; the finding cites the documentation URL. A check carrying `(verified: <library> <version>)` is re-verified when the installed version differs in major or minor. A refuted claim discards the finding and is logged in "Discarded false positives".
- **🔒 sensitive finding.** Mark a finding 🔒 when it describes (a) an exploitable weakness with a concrete attack path today, (b) exposure of a secret, credential or personal data, or (c) a missing or misconfigured control whose public write-up would give an attacker a usable roadmap. Hardening/hygiene items without a concrete exploit path stay public (e.g. "pin actions by SHA", "add SECURITY.md"). Any category can produce a 🔒 finding. The maintainer can override the mark per finding during triage. Never publish 🔒 details in a public issue, comment or commit.

## 9. Finding formats

**Full report** (inside the category section):

```markdown
#### [SEC-01] Every business route is guarded — HIGH 🔒

- **Evidence:** `src/contexts/question/infrastructure/http/controllers/question/question.controller.ts:12` — <quoted fact>; `src/contexts/question-theme/infrastructure/http/controllers/question-theme/question-theme.controller.ts:12`
- **Impact:** <concrete consequence for this product>
- **Remediation:** <concrete steps>
- **References:** [SEC-01] sources; <docs-fetcher URL when relevant>
- **Verification:** CONFIRMED by verifier <batch id> | ADJUSTED high → medium: <reason>
```

**Platinum gap** (inside the category section and the Platinum backlog):

```markdown
#### [OPS-17] Error tracking — GAP (high)

- **Evidence:** `docs/security.md:85` — the tracker is documented as absent (#1262)
- **Missing capability:** an error-tracking service with 5xx spike alerts and PII scrubbing
- **Target:** wire the tracker with the privacy allow-list, then re-run OPS-17 and PRIV-10
```

**Diff mode** (`final-reviewer`): `` `[SEC-01]` `file:line` — expected pattern (severity) ``. For `Diff: ✗` checks whose `Look` matches a changed file, or whose category is triggered and the check carries no `Look`: `` ⚠️ `[SUP-01]` `package.json` — verify in next /goat-audit (requires command) ``. A reach check that matches reports `` GAP `[OPS-17]` — <capability> `` and never blocks.

## 10. Diff-mode procedure (final-reviewer)

1. List changed paths (commit range, or `git status` + `git diff HEAD` when no commits exist).
2. Match paths against the diff triggers **and the Decision doc column** (§6) → triggered categories; always state them in the report. Also detect changed import lines (`git diff -U0 <range> | grep -E '^[+-][^+-].*(import|from)'`) and trigger ARCH when any exist.
3. For each triggered category: read only the sections that contain in-scope checks (use the reference's `## Contents` and the `Look` globs), then read the mapped decision doc **in full** (iron rule (e)), applying its `## GOAT audit decisions` section and documented decisions.
4. Evaluate the **Core** `Diff: ✓` checks **whose `Look` globs match a changed path**, plus the category-wide Core `Diff: ✓` checks that carry no `Look`, against the changed files and the code directly affected inside them. For Core `Diff: ✗` checks whose `Look` globs match a changed file, or whose category is triggered and the check carries no `Look`, emit a non-blocking ⚠️ "verify in next /goat-audit". Non-Core checks are not evaluated in diff mode. A Core `Target: reach` check reports GAP, never FAIL, and never blocks.
5. Library-behavior claims → `docs-fetcher` (§8).
6. TEST in diff mode applies only its strategy checks — `[TEST-17]`, `[TEST-18]` and `[TEST-19]`; per-file spec and step conventions stay with `final-reviewer` §10/§11 and `/lint-unit-tests` / `/lint-acceptance-tests`.
7. Static analysis only; never run builds, tests or servers.
8. Map severities: critical → Critical, high → Important, medium/low/info → Minor. Only Critical and Important force "Needs changes before merge".

## 11. Maintaining the checklists

- Adding a check: take the number after the category's last check, all fields, a fetched source (never training data), `Look` globs that exist; mark it Core only under §4.4 and `Target: reach` only under §4.5.
- Marking Core: a check loses the mark when it no longer gates a change; every change to a mark updates the category index's `Core` column in the same change.
- Marking Target: `reach` is reserved for a platinum capability whose absence is a GAP, never for a conformance rule; every change to the mark updates the index's `Reach` column and the total in §6.
- Version-dependent checks: a `(verified: <library> <x.y[.z]>)` criterion is re-verified on a major or minor bump, and a changed default rewrites the criterion in the same change. Exact patch/minor values belong in `(verified: …)` metadata or the decision doc, never inside a durable pass criterion.
- Removing or merging a check: delete its line entirely, renumber the category's remaining checks in file order, and update every reference to a shifted ID in the same change; a decision note attached to a shifted check is updated to its new ID.
- Applying a decision note: an Accepted-risk or False-positive note rewrites the criterion so it encodes the deviation or the corrected rule and passes; a Not-applicable note deletes the check and renumbers the category (§4.2). The note keeps its ID, and a deleted check's note carries `(removed)` after it so [AGENT-32] does not treat it as active.
- Rewriting a check: rewrite the criterion in place; the ID moves only through a removal-driven renumbering. When a decision note is attached to the old criterion, the next run reports `decision revisit triggered — <doc>:<line>` so the maintainer re-decides it.
- Every `/goat-audit` run reports stale `Look` hints as [AGENT-33] and dead source links as [AGENT-34].
