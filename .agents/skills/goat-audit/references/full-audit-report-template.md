# Full audit report template

Skeleton of `docs/audits/GOAT-AUDIT-YYYY-MM-DD[-N].md`. Replace every `<…>` placeholder, keep the headings and their order, and never overwrite an existing report: the path is gitignored because the repository is public and the report lists unfixed weaknesses.

**Kind:** report skeleton, not a category checklist. **Diff triggers:** none — read by `/goat-audit` only. **Decision docs:** the category decision docs listed in the `goat-audit` SKILL.md index.

## Contents

- [Template](#template)
- [Field rules](#field-rules)
- [Sources](#sources)

## Template

````markdown
# Goat It API — GOAT Audit — YYYY-MM-DD[-N]

> **Date:** YYYY-MM-DD · **Branch / commit:** `<branch>` @ `<short-sha>` · **Working tree:** clean | <n> uncommitted entries
> **Scope:** full (18/18) | partial (<n>/18): <codes> · **Method:** <n> category explorers, <n> verifiers, <n> docs-fetcher dispatches
> **Tiers:** T1 ✓ · T2 ✓/✗/skipped · T3 acceptance ✓/✗/skipped · local runtime ✓/✗/skipped · live ✓/✗/skipped
> **Tools:** node `<x.y.z>` · pnpm `<x.y.z>` · gh `<x.y.z>`
> **Previous audit:** <report name or "none">

## 0. Verdict

<One paragraph: what the audit covered, the state of the service, the dominant risk theme.>

**Release verdict:** Ship-ready | Ship with follow-ups | Not ship-ready (prefixed `partial (<n>/18):` when the run covered a subset)

**Platinum readiness:** platinum-ready | n gaps (P0 n · P1 n · P2 n · Polish n) (prefixed `partial (<n>/18):` when the run covered a subset)

### Global scorecard

| Code | Category | Grade | Critical | High | Medium | Low | Info | GAP | Unverified | Comment |
|------|----------|-------|----------|------|--------|-----|------|-----|------------|---------|
| SEC | Application security | <🐐 GOAT / 🏆 A / ✅ B / ⚠️ C / 🟠 D / ❌ F[ ⚠️ unverified]> | n | n | n | n | n | n | n | <one line> |
| SUP | Supply chain & dependencies | <grade> | n | n | n | n | n | n | n | <one line> |
| CICD | CI/CD, release & repository governance | <grade> | n | n | n | n | n | n | n | <one line> |
| PLAT | Runtime platform (containers, config, deployment) | <grade> | n | n | n | n | n | n | n | <one line> |
| OPS | Observability & operations | <grade> | n | n | n | n | n | n | n | <one line> |
| REL | Reliability & resilience | <grade> | n | n | n | n | n | n | n | <one line> |
| LOGIC | Domain logic & data correctness | <grade> | n | n | n | n | n | n | n | <one line> |
| PERF | Performance | <grade> | n | n | n | n | n | n | n | <one line> |
| I18N | Localization & Accept-Language handling | <grade> | n | n | n | n | n | n | n | <one line> |
| API | HTTP contract, OpenAPI, versioning, errors | <grade> | n | n | n | n | n | n | n | <one line> |
| DATA | MongoDB schema, indexes, migrations, integrity | <grade> | n | n | n | n | n | n | n | <one line> |
| ARCH | Architecture & design | <grade> | n | n | n | n | n | n | n | <one line> |
| STACK | Framework & stack correctness | <grade> | n | n | n | n | n | n | n | <one line> |
| CODE | Code quality & conventions | <grade> | n | n | n | n | n | n | n | <one line> |
| TEST | Testing & QA | <grade> | n | n | n | n | n | n | n | <one line> |
| PRIV | Privacy & compliance | <grade> | n | n | n | n | n | n | n | <one line> |
| DOCS | Documentation & DX | <grade> | n | n | n | n | n | n | n | <one line> |
| AGENT | AI-agent tooling hygiene | <grade> | n | n | n | n | n | n | n | <one line> |

> **Grades:** 🐐 GOAT = 0 points, no finding of any severity and nothing unverified · 🏆 A · ✅ B · ⚠️ C · 🟠 D · ❌ F · `— not audited` for a category outside the run scope. An out-of-scope row shows `— not audited` in the Grade cell and `—` in every count cell. The `GAP` column counts `Target: reach` capabilities that are absent; GAPs do not change the grade and are listed in the Platinum backlog.

## 1. Top findings (P0 and P1)

<Findings ordered by severity then category, each with its `[ID]` link to §4.>

## 2. Remediation roadmap

### P0 — critical
- `[ID]` <one line>

### P1 — high
- `[ID]` <one line>

### P2 — medium
- `[ID]` <one line>

### Polish — low
- `[ID]` <one line>

### Platinum gaps — Target: reach
- `[ID]` <missing capability> — P0 | P1 | P2 | Polish · <evidence>

## 3. Changes since last audit

- **Resolved:** `[ID]` <title> (was FAIL on YYYY-MM-DD)
- **Still open:** `[ID]` <title>
- **New:** `[ID]` <title>
- **Regressed:** `[ID]` <title> (PASS or Resolved in <report>)
- **Newly decided:** `[ID]` <title> → <doc>:<line>
- **Still a gap:** `[ID]` <missing capability>
- **Closed gap:** `[ID]` <capability that now passes>

<On the first run: "First GOAT audit." On a partial run, state that the delta covers the audited categories only.>

## 4. Findings by category

### 4.1 SEC — Application security — <grade icon + letter>

<Counts line: PASS n · FAIL n · N/A n · GAP n · UNVERIFIED n · DECIDED n, then finding blocks in the skill's §9 format, then the N/A, GAP, unverified and decided lists with reasons. A category outside the run scope keeps its scorecard row and states "Not audited in this run." here.>

### 4.2 SUP — Supply chain & dependencies — <grade icon + letter>

…

### 4.3 CICD — CI/CD, release & repository governance — <grade icon + letter>

…

### 4.4 PLAT — Runtime platform (containers, config, deployment) — <grade icon + letter>

…

### 4.5 OPS — Observability & operations — <grade icon + letter>

…

### 4.6 REL — Reliability & resilience — <grade icon + letter>

…

### 4.7 LOGIC — Domain logic & data correctness — <grade icon + letter>

…

### 4.8 PERF — Performance — <grade icon + letter>

…

### 4.9 I18N — Localization & Accept-Language handling — <grade icon + letter>

…

### 4.10 API — HTTP contract, OpenAPI, versioning, errors — <grade icon + letter>

…

### 4.11 DATA — MongoDB schema, indexes, migrations, integrity — <grade icon + letter>

…

### 4.12 ARCH — Architecture & design — <grade icon + letter>

…

### 4.13 STACK — Framework & stack correctness — <grade icon + letter>

…

### 4.14 CODE — Code quality & conventions — <grade icon + letter>

…

### 4.15 TEST — Testing & QA — <grade icon + letter>

…

### 4.16 PRIV — Privacy & compliance — <grade icon + letter>

…

### 4.17 DOCS — Documentation & DX — <grade icon + letter>

…

### 4.18 AGENT — AI-agent tooling hygiene — <grade icon + letter>

…

## 5. Strengths

- <Concrete practice worth preserving, with evidence.>

## 6. Honored decisions

<Documented decisions honored as DECIDED. A GOAT decision note whose checklist amendment already landed no longer appears here: the rewritten criterion passes on its own and the note stays in the doc as history.>

| Check | Subject | Decision | Doc |
|-------|---------|----------|-----|
| `[ID]` | `<path or resource>` | Accepted risk / Not applicable / False positive | `docs/…md:<line>` |

## 7. Discarded false positives

| Check | Claim | Why it was refuted |
|-------|-------|--------------------|
| `[ID]` | <claim> | <verification source> |

## 8. Unverified checks

| Check | Why | How to verify |
|-------|-----|---------------|
| `[ID]` | Tier 3 skipped / probe unavailable | <command or manual step> |

## 9. Measured data

- **Build:** `pnpm run build` — <exit code, duration, warnings> (`evidence/build.txt`)
- **Artifact inventory:** `find dist -type f` / `du -ab dist` — <file count, largest files, unexpected artifacts> (`evidence/dist-inventory.txt`)
- **Secrets scan:** `pnpm run check:secrets-in-built-output` — <exit code, findings> (`evidence/secrets-scan.txt`)
- **Lint and typecheck:** `pnpm run lint` / `pnpm run typecheck` — <exit codes, counts> (`evidence/lint.txt`, `evidence/typecheck.txt`)
- **Coverage:** <statements/branches/functions/lines> (`evidence/unit-coverage.txt`)
- **Mutation:** <score, survivors, incremental-state change> (`evidence/mutation.txt`)
- **Acceptance:** <scenarios passed/failed/skipped, duration, or "not run"> (`evidence/acceptance.txt`)
- **Local headers:** <notable headers from `evidence/local-headers.txt`, with deviations>
- **Live headers:** <production/staging summary or "not probed">

## 10. GitHub follow-up log

This table is authoritative for triage resumability; Appendix B mirrors it.

| Finding | Decision | Artifact / decision doc | Date |
|---------|----------|------------------------|------|
| `[SEC-01]` | issue / advisory / comment / accepted-risk / not-applicable / false-positive / skipped | `#612` · `GHSA-xxxx-xxxx-xxxx` · `docs/security.md:80` · `null` | YYYY-MM-DD |

## Appendix A — Check status matrix

### SEC
- PASS: `[SEC-01]`, `[SEC-02]`, …
- FAIL: `[SEC-09]`, …
- N/A: `[SEC-…]` (<reason>)
- GAP: `[OPS-17]` (<missing capability>)
- UNVERIFIED: `[SEC-…]` (<reason>)
- DECIDED: `[SEC-…]` (`docs/security.md:<line>`)

<One block per audited category, category order of the skill; a full run has all 18. Every check of every audited reference appears exactly once.>

## Appendix B — Findings index (machine-readable)

```json
[
  {
    "id": "SEC-01",
    "fingerprint": "SEC-01::src/contexts/question/infrastructure/http/controllers/question/question.controller.ts",
    "title": "Every business route is guarded by the audience API key",
    "severity": "high",
    "status": "confirmed",
    "private": true,
    "decision": "advisory",
    "artifact": "GHSA-xxxx-xxxx-xxxx",
    "duplicate_of": null
  }
]
```
````

## Field rules

- `id` — the `[CODE-NN]` check ID; a finding keeps the ID of the check it violates.
- `fingerprint` — `<ID>::<subject>`; the subject is the normalized primary evidence path without line numbers (repo-relative) or a resource key (`gh:rulesets`, `live:production:/health`, `artifact:dist/main.js`).
- `title` — the check title, or a shorter subject when the finding is narrower than the check.
- `severity` — `critical` | `high` | `medium` | `low` | `info`. Info findings are indexed but never triaged.
- `status` — `confirmed` | `gap` | `decided` | `discarded`.
- `private` — `true` when the finding carries 🔒. A 🔒 finding never pairs with `decision: issue` or `comment`; only `advisory`, `accepted-risk`, `not-applicable`, `false-positive`, `skipped` or `pending` are valid, and public handling requires the maintainer to clear the mark first (command §6).
- `decision` — `issue` | `advisory` | `comment` | `accepted-risk` | `not-applicable` | `false-positive` | `skipped` | `pending`. A `gap` uses `issue` (feature or performance) or `skipped`; it never uses a decision note.
- `artifact` — `#612` | `GHSA-xxxx-xxxx-xxxx` | `docs/security.md:80` | `null`.
- `duplicate_of` — `null`, or the ID of the finding that reports the same evidence path and root cause in another category (e.g. `ARCH-16` ↔ `TEST-04`, `API-17` ↔ `STACK-20`, `REL-30` ↔ `PERF-20`, `SEC-48` ↔ `PRIV-07`). Triage creates one artifact for a duplicate group and records the same artifact on every member.
- Delta computation against the previous report compares fingerprints: **Resolved** (was FAIL, now PASS/N/A), **Still open**, **New**, **Regressed** (Resolved in an earlier report or PASS previously, now FAIL), **Newly decided** (now DECIDED), **Still a gap** (was GAP, still GAP), **Closed gap** (was GAP, now PASS).

## Sources

[1] GitHub Docs — REST API endpoints for repository security advisories: https://docs.github.com/en/rest/security-advisories/repository-advisories (fetched 2026-11-04, current)
