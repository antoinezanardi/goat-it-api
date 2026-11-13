# Triage and agent return templates

Copy-paste formats for `/goat-audit`: the explorer and verifier return contracts, the public issue body, the private advisory payload, the decision note and the follow-up log row.

**Kind:** triage and agent return templates, not a category checklist. **Diff triggers:** none — read by `/goat-audit` only.

## Contents

- [Explorer return](#explorer-return)
- [Verifier return](#verifier-return)
- [Public issue body](#public-issue-body)
- [Private advisory payload](#private-advisory-payload)
- [Decision note](#decision-note)
- [Follow-up log row](#follow-up-log-row)
- [Sources](#sources)

## Explorer return

One `explore` subagent per category returns the complete `categories/<CODE>.md` document inline. The conductor writes it to the run directory:

````markdown
# <CODE> — <Category> — results

Counts: PASS n · FAIL n · N/A n · UNVERIFIED n · DECIDED n

| ID | Outcome | Evidence or reason |
|----|---------|--------------------|
| [SEC-01] | PASS | `src/contexts/question/infrastructure/http/controllers/question/question.controller.ts:12` |
| [<CODE-NN>] | N/A | <reason the check does not apply> |

## Findings

<one block per FAIL in the report format of the skill (§9), without the Verification line>

## Needs docs

- [SEC-10] needs-docs: nestjs-zod — <claim to verify>

## Stale Look hints

- [<CODE-NN>] `<glob>` matches nothing
````

Explorer prompt contract:

- Give it: the category code, the paths of `SKILL.md`, the category reference file (read **in full**), `decisions.md`, `evidence/INDEX.md`, and the repository root.
- Rules: evaluate **every** check of the reference with an outcome and evidence; verify each `Look` glob still exists (missing → "Stale Look hints"); tag library-behavior claims `needs-docs: <library>`; never modify any file; return the complete category document inline and reply with a separate summary line of ≤ 150 words (path + outcome counts); the word limit applies to that summary, never to the inline document.

If the conductor receives an inline result, it writes `categories/<CODE>.md` itself.

## Verifier return

One fresh `explore` verifier per batch of ≤ 8 FAIL findings of one category returns the complete `verification/<CODE>-<n>.md` document inline. The conductor writes it to the run directory. One line per finding:

````markdown
[SEC-01] CONFIRMED
[I18N-04] REFUTED: an unknown locale already throws `BadRequestException` in `src/shared/infrastructure/http/middlewares/localization/localization.middleware.ts:44`
[SEC-26] ADJUSTED: high → medium, only a key-holding client can amplify requests
[SEC-20] DECIDED: docs/security.md:80
````

Verifier prompt contract: try to **refute** each finding; re-read every cited `file:line` and confirm the line exists (line number ≤ file length) and says what the finding claims; check the criterion really applies; check `decisions.md`; check the severity — a move from the checklist default needs a written justification inside the finding; without it, restore the default and record `ADJUSTED: <moved> → <default>, no written justification`. Outcome per finding: `CONFIRMED` · `REFUTED: <reason>` · `ADJUSTED: <from> → <to>, <reason>` (one level max) · `DECIDED: <doc>:<line>`. `DECIDED` applies only to documented decisions outside the `## GOAT audit decisions` sections; a GOAT entry never suppresses a finding — return `CONFIRMED` and annotate `decision recorded, checklist not yet amended — <doc>:<line>` (skill §7).

## Public issue body

Written to `issues/<ID>.md` and published with `gh issue create --title "<title>" --body-file … --label "<type label>" --label "🐐 goat-audit"`. Self-contained: the report is local and gitignored, so the issue must never depend on it. Sanitized: no 🔒 detail, no exploitable attack path, no secret or personal data.

````markdown
## Context

GOAT audit `<report-name>` on `<branch>` @ `<short-sha>` — **[<ID>] <check title>** (<CATEGORY>, severity **<level>**).

<Finding statement.>

**Evidence**
- `<file:line>` — <fact>
- <command/artifact excerpt>

## Impact

<Concrete impact.>

## Proposed fix

- <step>

## Acceptance criteria

- [ ] <verifiable criterion derived from the check's pass criterion>
- [ ] The GOAT audit check [<ID>] passes.

## GOAT finding

- Finding ID: `[<ID>]` · Report: `GOAT-AUDIT-YYYY-MM-DD[-N]` (local and gitignored; do not link it)
- Category: `<CODE>` · Severity: `<level>` · 🔒: no

## References

- GOAT audit check [<ID>] — `.agents/skills/goat-audit/references/<file>.md`
- <source URLs>
````

**Type mapping** (title prefix → label): `fix` → `🐛 bug` (defect) · `feat` → `🚀 feature` (missing capability) · `perf` → `⚡️ perf` · `refactor` → `🔩 refactor` · `test` → `✅ test` · `docs` → `📖 docs` · `ci` → `🔁 ci` · `chore` → `🧹 chore`. Title: lowercase imperative subject, no trailing period, scope = domain (`security`, `auth`, `questions`, `question-themes`, `mongo`, `docker`, `deps`, `i18n`, `api`, `ci`, …).

## Private advisory payload

Written to `advisories/<ID>.json`, then `gh api -X POST repos/antoinezanardi/goat-it-api/security-advisories --input docs/audits/.work/<report-name>/advisories/<ID>.json`. Record the returned `ghsa_id` and `html_url`. Drafts stay private until published — required because the repository is public. Private vulnerability reporting is enabled, but the audit files draft advisories through the repository advisories endpoint. Requires admin or security-manager in the repository; the command verifies `.permissions.admin`, so a security manager who is not an admin is handled manually.

```json
{
  "summary": "<title>",
  "description": "<the same Context / Impact / Proposed fix / Acceptance criteria / References sections as the issue body, in Markdown, including the affected repo path>",
  "severity": "critical|high|medium|low",
  "cve_id": null,
  "vulnerabilities": [
    {
      "package": { "ecosystem": "npm", "name": "@goat-it/schemas" },
      "vulnerable_version_range": "<range or null>",
      "patched_versions": null,
      "vulnerable_functions": null
    }
  ],
  "cwe_ids": ["CWE-79"]
}
```

Package rules:

- A finding in the published facade uses `"ecosystem": "npm"`, `"name": "@goat-it/schemas"` and the published `vulnerable_version_range`; `vulnerable_functions` names the exported function when one is affected.
- A runtime or repository finding uses `"ecosystem": "other"`, `"name": "goat-it-api"`, `"vulnerable_version_range": null`; the affected repository path belongs in the description.
- Omit `cve_id` when no CVE is known (or send `null`); omit `cwe_ids` when no CWE applies.

## Decision note

Appended to the mapped decision doc, inside its trailing `## GOAT audit decisions` section:

````markdown
### [SEC-54] <short title> — Accepted risk (2026-10-31)

- **Finding:** <one sentence with the evidence `file:line` for a public finding; for a 🔒 finding, a sanitized summary only — the exploitable detail, the vulnerable path and the secret location stay in the gitignored report or the private advisory>.
- **Decision:** <what was decided>.
- **Rationale:** <why>.
- **Revisit when:** <observable trigger or date>.
- **Checklist change:** <the exact criterion rewrite, or the removal and the renumbering it implies>.
- **Recorded by:** /goat-audit (GOAT-AUDIT-2026-10-31)
````

A decision note is appended to a tracked document and committed: never write 🔒 detail into it (skill §8). A public finding keeps its evidence path; a 🔒 finding cites the local report and, when one exists, the private advisory.

Kinds: **Accepted risk** · **Not applicable** · **False positive** (see skill §7). When a mapped decision doc does not exist yet, create it with its H1 title and one scope paragraph, and register it in the `AGENTS.md` "Useful docs (`docs/`)" list — only when both files are on the agent's edit allowlist.

## Follow-up log row

Appended to the report §10 after every decision (this is what makes triage resumable):

````markdown
| [SEC-09] | advisory | GHSA-xxxx-xxxx-xxxx | 2026-10-31 |
````

Also update the Appendix B item's `decision` and `artifact` fields in the same edit.

## Sources

[1] GitHub Docs — REST API endpoints for repository security advisories: https://docs.github.com/en/rest/security-advisories/repository-advisories (fetched 2026-11-04, current)
