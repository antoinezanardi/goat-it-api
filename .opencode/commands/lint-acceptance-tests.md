# Lint acceptance tests conventions

## Task

Audit acceptance test files against the repository conventions defined in `tests/acceptance/README.md`.

- If the prompt specifies file paths, audit only those files.
- Otherwise, audit every file under `tests/acceptance/`.

The audit is **static analysis only** — never execute tests or run shell commands beyond the scoped lint/typecheck/acceptance commands specified in the quality gate (step 9). Deep semantic checks (coverage, mutation) are out of scope.

To protect the main context during the **audit phase**, files are NEVER read by the main agent: after classification, audit work is dispatched to parallel `general` subagents that return only structured violation summaries. During the **fix phase**, the main agent may read and edit files directly only for mechanical categories touching at most 2 files (step 8, *Direct fix allowance*); all other fixes remain delegated to subagents. The main agent aggregates, reports, asks for approval, then applies fixes.

Report all violations once in-chat, then use the question tool to validate with the user which violations to fix. **Never modify any file before explicit user approval.**

## Instructions

### 1. Load context

1. Load the `write-acceptance-test` skill from `.agents/skills/write-acceptance-test/SKILL.md`.
2. Read `tests/acceptance/README.md` in full.

### 2. Determine scope

- Paths given in the prompt → audit only those files.
- No paths → glob all files under `tests/acceptance/`.

### 3. Classify each file

Apply the rules **in order**, first match wins:

| #  | Rule                                                             | Type            |
|----|------------------------------------------------------------------|-----------------|
| 1  | Suffix `.feature`                                                | Feature         |
| 2  | Suffix `.given-steps.ts` or `.when-steps.ts` or `.then-steps.ts` | Step            |
| 3  | Suffix `.datatables.schemas.ts`                                  | DataTable       |
| 4  | Suffix `.fixture-set.ts`                                         | FixtureSet      |
| 5  | Suffix `-payload.ts`                                             | Payload         |
| 6  | Suffix `.steps.helpers.ts`                                       | StepHelper      |
| 7  | Path contains `fixtures/constants/` or `fixtures/types/`         | FixtureRegistry |
| 8  | Path contains `payloads/constants/` or `payloads/types/`         | PayloadRegistry |
| 9  | Path contains `support/helpers/` (not step helpers)              | SupportHelper   |
| 10 | Anything else under `tests/acceptance/`                          | Other           |

The type selects which per-type checklist applies alongside the universal checks.

### 4. Checklist reference

Audit subagents apply this checklist verbatim. Violations are recorded with rule tag + line number(s). Multiple occurrences of the same rule in one file collapse into a single entry listing all lines.

#### Universal checks (all types)

- **[AU1] No switch/case** — Use object maps or conditional chains. The project convention prohibits `switch`/`case` statements (see `AGENTS.md`).

#### Established patterns — do NOT flag

These recurring shapes are accepted codebase conventions. Auditors must not report them as violations or warnings:

- `Given` steps that fire HTTP for app-level health/metadata endpoints (e.g., `Given the client retrieves the application health`).
- `Object.freeze(createFake...({...}))` as payload wrapper pattern.
- `as const satisfies` on fixture set arrays.
- `shake()` from `radashi` in shared Then steps.
- `PAYLOADS as Record<string, ...>` type assertion in request given steps.
- Sync Then steps (no `async` needed for synchronous assertions).
- `z.coerce.number()` for non-optional numeric columns in DataTable schemas.
- `z.literal(...)` for exact-match columns in DataTable schemas.
- Computed property keys in DataTable schemas: `[KEY]: zCoerceOptionalStringArray()`.
- `REQUEST_PAYLOAD_OVERRIDE_ROW_SCHEMA` not using `zCoerceOptional*` because all columns are required strings.
- `console.info` and `console.error` in step definitions (allowed by `eslint/no-console` override for acceptance steps).

#### Feature file checks (`*.feature`)

- **[FT1] Tags placement** — Tags must be on the line immediately before `Feature:` (no blank lines between tags and `Feature:`).
- **[FT2] Tags format** — All tags must be lowercase kebab-case (no uppercase characters).
- **[FT3] No Background** — Each scenario is self-contained — no `Background:` keyword.
- **[FT4] No But keyword** — Use `And` to continue the most recent block type, never `But`.
- **[FT5] No Scenario Outline** — No `Scenario Outline:` or `Examples:` — use separate `Scenario:` blocks.
- **[FT6] Step ordering** — Scenario steps must follow `Given` → `And` → `When` → `And` → `Then` → `And` sequence. `Given` sets up DB state and payload. `When` fires HTTP. `Then` asserts response. Two consecutive same-keyword steps on adjacent step lines (ignoring DataTable rows between them) is a violation — e.g., `Given ...` followed immediately by `Given ...`, `When ...` followed by `When ...`, or `Then ...` followed by `Then ...` — the second must use `And`.
- **[FT7] Scenario assertion** — Each scenario must have at least one `Then` step (or an `And` after a `Then` that implies assertion).
- **[FT8] Feature path** — Feature files must be at `tests/acceptance/features/contexts/<context>/<audience>/<slug>.feature` or `tests/acceptance/features/app/<slug>.feature`. Flags if path doesn't match these patterns.
- **[FT9] Feature naming convention** — Feature file names and `Feature:` titles must follow the homogenized pattern:
  - **Admin features**: file `<action>-<entity>-as-admin.feature`, title `<Verb> <Entity> as Admin` (e.g., `create-question-as-admin.feature` → `Feature: Create Question as Admin`).
  - **Public features**: file `<action>-<entity>.feature`, title `<Verb> <Entity>` (e.g., `list-questions.feature` → `Feature: List Questions`).
  - **App features**: file `app-<feature>.feature`, title `App <Feature>` (e.g., `app-health.feature` → `Feature: App Health`).
  - **Scenario names**: use present participle phrasing — `Creating a question...`, `Archiving a question...`, `Getting question theme stats...`, `Listing all questions...`, `Trying to create a question...`. Non-compliant: imperative (`Create a question...`, `Get question theme stats...`) or present tense (`App serves...`).

#### Step definition checks (`*-steps.ts`)

These checks apply to actual step definition files (`*-steps.ts`), not to helper files.

- **[ST1] World declaration** — All step functions must declare `this: GoatItWorld` as first parameter.
- **[ST2] Regex `/u` flag** — Step regex patterns must end with `/u` flag.
- **[ST3] Regex anchors** — Step regex patterns must use `^` and `$` anchors. Verify by reading the exact regex line — do not assume from partial context.
- **[ST4] Named capture groups** — Regex must use named capture groups `(?<name>...)` for parameters.
- **[ST5] When steps pattern** — When steps must call `createFetchOptions(...)` then `this.fetchAndStoreResponse(...)`.
- **[ST6] Then steps pattern** — Then steps must call `this.expectLastResponseJson(...)` or `this.expectLastResponseText()` before asserting with `expect()`.
- **[ST8] File naming** — Step files must follow `<domain>[-<sub>].{given,when,then}-steps.ts` naming pattern.
- **[ST9] DataTable Zod validation** — Every step function that receives a `DataTable` parameter MUST call `validateDataTableAndGetFirstRow(dataTable, SCHEMA)` or `validateDataTableAndGetRows(dataTable, SCHEMA)` from `@acceptance-support/helpers/datatable.helpers` before using the data. Flags any step that receives `dataTable: DataTable` (or `queryDataTable`, `errorDataTable`, etc.) without validating it through a Zod schema.
- **[ST10] Step helper extraction** — If the same logic pattern appears in 3+ different step functions across the codebase, it must be extracted to a dedicated step helper file under `helpers/` in the appropriate `step-definitions/` subfolder. Flags repeated patterns (auth-check fetch wrappers, number parsing, iteration-and-assert loops, etc.) that should be consolidated. Additionally, step helpers that are reused across contexts (e.g., public and admin) must be placed in a shared location (e.g., `step-definitions/shared/`) rather than duplicated in each context's `helpers/` folder.

#### StepHelper checks (`*.steps.helpers.ts`)

These checks apply to step helper files only.

- **[ST7] No step registration in helpers** — Helper files (`*.steps.helpers.ts`) must NOT call `Given()`, `When()`, or `Then()` from `@cucumber/cucumber`.

#### DataTable schema checks (`*.datatables.schemas.ts`)

- **[DS1] Strict object** — Must use `z.strictObject({...})`, not `z.object({...})`.
- **[DS2] Schema naming** — Constants must end with `_DATATABLE_ROW_SCHEMA` suffix.
- **[DS3] Optional coercion** — Optional columns must use `zCoerceOptional*` helpers from `@acceptance-support/helpers/datatable.helpers`, not `z.coerce.string()` etc.

#### Fixture set checks (`*.fixture-set.ts`)

- **[FS1] Type assertion** — Set array must end with `as const satisfies ReturnType<typeof createFake...>[]`.
- **[FS2] No faker/random** — No `faker.` calls, `Math.random()`, or `Date.now()` — must be deterministic.
- **[FS3] Deterministic IDs** — Must use `createFakeObjectId("<hex>")` with hardcoded hex strings for `_id` fields.
- **[FS4] Named entry exports** — Individual entries referenced by payloads/assertions must be exported as named constants. Only flag if individual entries are imported elsewhere (in payloads or step helpers). If entries are only used inline within the set array, the rule does not apply.
- **[FS5] Set naming** — Set constant must use `_FIXTURE_SET` suffix.

#### Payload checks (`*-payload.ts`)

- **[PL1] Frozen payloads** — Must wrap with `Object.freeze(...)`.
- **[PL2] No faker/random** — No `faker.` calls, `Math.random()`, or `Date.now()`.
- **[PL3] Fixture ID refs** — Fixture entry IDs must use `.toString()` when used as string values in payloads.
- **[PL4] Payload naming** — Payload constant must use `_PAYLOAD` suffix.

#### Support helper checks (`support/helpers/*.ts`, not step helpers)

- **[SH1] No step registration** — Must NOT call `Given()`, `When()`, or `Then()`.

### 5. Dispatch audit subagents

During the audit phase the main agent must NOT read acceptance test files itself. Instead:

1. **Batch** — Group the classified files by type in batches of 4-8 files per group (single-file input → one group of one; smaller remainders are acceptable). **Exception for Step files**: when batching `*-steps.ts` files, include any co-located `*.steps.helpers.ts` files from the same directory in the same batch. **Exception for ST10**: the [ST10] step helper extraction check requires cross-referencing ALL step files and ALL step helpers across the entire codebase. Dispatch a dedicated ST10-only batch containing every `*-steps.ts` and `*.steps.helpers.ts` file (all directories, all contexts). This batch applies ONLY [ST10] — all other step checks are covered by the per-directory batches.
2. **Dispatch** — Launch one `general` subagent per group via the Task tool, in parallel waves of at most ~6 concurrent tasks. Mark each task as read-only research/audit work.
3. **Prompt** — Use exactly this template per group, filling `<TYPE>`, listing the file paths:

   ```text
   You are auditing acceptance test files against repository conventions.
   This is a READ-ONLY audit: do NOT modify any file and do NOT run any test or shell command.
   NEVER run acceptance tests (`pnpm run test:acceptance`).

   Files to audit — type <TYPE>:
   - <path1>
   - <path2>

    Steps:
    1. Read `.opencode/commands/lint-acceptance-tests.md` section 4 IN FULL and apply the
       Universal check, the "Established patterns — do NOT flag" block, the exact
       "<Type> checks" block named for this group's type — to every listed file.
    2. Read each listed file completely. Consult `tests/acceptance/README.md` only when
       needed to judge a pattern against the conventions.
    3. Record every violation with its tag + line number(s). Multiple occurrences of
       the same rule in one file collapse into a single entry listing all lines.
    4. Before returning, verify that every reported line number exists in its file
       (line number ≤ total lines). Remove any violation with an out-of-range line number
       — it is a hallucination.

   Return EXACTLY this structure for each file, in the same order, nothing else. Do NOT return markdown tables, summary blocks, or any prose before or after — ONLY the structure below. Non-compliant output will be rejected and the task re-dispatched.

   FILE: <path>
   STATUS: ✅ PASSED / ❌ FAILED / ⚠️ NEEDS HUMAN JUDGMENT
   VIOLATIONS:
   - [<tag>] :<lines> — <description including the expected pattern>
   WARNINGS:
   - [<tag>] — <what needs human judgment>

   Omit VIOLATIONS/WARNINGS sections when empty. No prose before or after.
   ```

   **ST10-only batch template** (for the dedicated cross-codebase ST10 batch):

   ```text
   You are auditing acceptance test step definitions for step helper extraction patterns.
   This is a READ-ONLY audit: do NOT modify any file and do NOT run any test or shell command.
   NEVER run acceptance tests (`pnpm run test:acceptance`).

   This batch checks [ST10] ONLY — all other checks are handled by per-directory batches.

   Files to audit — all Step and StepHelper files:
   - <path1>
   - <path2>
   - ... (every *-steps.ts and *.steps.helpers.ts file in the codebase)

    Steps:
    1. Read `.opencode/commands/lint-acceptance-tests.md` section 4 IN FULL and apply ONLY
       [ST10] Step helper extraction — to every listed file.
    2. Read each listed file completely.
    3. Identify logic patterns that appear in 3+ different step functions ACROSS the entire
       codebase (not just within this batch). Patterns include: auth-check fetch wrappers,
       number parsing, iteration-and-assert loops, response assertion helpers, etc.
    4. For each repeated pattern, list the specific files and line numbers where it appears,
       and recommend extraction to a shared helper location.

   Return EXACTLY this structure, nothing else:

   PATTERN: <description of the repeated logic>
   OCCURRENCES:
   - <file>:<line> — <brief context>
   - <file>:<line> — <brief context>
   RECOMMENDATION: <where to extract and what to name the helper>

   If no repeated patterns are found, return: NO ST10 VIOLATIONS FOUND

   Do NOT return markdown tables, summary blocks, or any prose before or after.
   ```

4. **Collect & retry** — If an agent fails or returns truncated/malformed output, re-dispatch ONCE with HALF the files per batch (split into two tasks), preserving the original single-type grouping. If it still fails, mark its files ⚠️ `unaudited — manual review` in the report. **Hallucination guard**: before returning, the subagent MUST verify that every reported line number exists in the file (line number ≤ total lines in that file). If a line number exceeds the file length, remove that violation from the output — it is a hallucination. The main agent should also spot-check a sample of reported line numbers against file contents.

### 6. Report

Emit exactly one report block:

```markdown
# Acceptance Test Lint Report — <total> files scanned (<passed> passed)

| Status | File                                                     | Type        | Violations |
|--------|----------------------------------------------------------|-------------|------------|
| ❌     | tests/acceptance/features/.../foo.feature                | feature     | V1, V2     |
| ⚠️     | tests/acceptance/support/fixtures/.../bar.fixture-set.ts | fixture-set | —          |

(✅ pass · ❌ violation · ⚠️ needs human judgment)
```

Table lists **only failing/warning files**, ordered by path — one row per file. Status precedence: a file with both violations and warnings shows ❌ (violations outrank warnings); list its violation IDs in the Violations column and mention the warnings in their entries below. Then list every violation, numbered sequentially:

```markdown
**V1** `tests/acceptance/features/.../foo.feature:12` — [FT1] Tags must be on the line immediately before `Feature:` — found blank line between tags and Feature
**V2** `tests/acceptance/features/.../foo.feature:25` — [FT6] Step ordering violated — `Then` appears before `When`
```

Format per violation: ID → backticked `file:line(s)` → `[rule tag]` → concise description including the expected pattern.

Warnings carry no IDs — list them after the violations as unnumbered bullets, one per finding, in the form `- \`file:line(s)\` — <description>`.

### 7. Category-based fix approval

Immediately after the report, group every reported violation AND actionable warning (skip report-only warnings already accepted as conventions) by rule tag into fix **categories** (e.g. `FT1 — tags-placement`, `ST1 — world-declaration`, `FS2 — no-faker-random`). Present the categories to the user via the question tool so they can approve which to fix, one category at a time (also offer "all categories" and "nothing — report only"; always allow a custom answer with specific categories/violation IDs).

Classify before asking: **mechanical** = unambiguous single-file edits; **judgmental** = requires writing new test logic or removal decisions that may affect coverage. State the split in the question description so the user can decide informedly.

### 8. Fix selected violations

Work through approved categories ONE at a time. **NO parallel work across categories** — complete each category fully (fix + verify) before starting the next.

- **Direct fix allowance** — a mechanical category touching at most 2 files may be applied directly by the main agent (read + edit + scoped verification per section 9) instead of dispatching subagents.
- For each remaining category, dispatch ONE `general` subagent per category via the Task tool. The subagent receives ALL files for that category in a single prompt and fixes them sequentially. **NEVER split a category into parallel batches**. The subagent must NOT run `pnpm run test:acceptance` — verification is done by the main agent after the subagent returns. **NEVER run acceptance tests in subagents.**
- Each subagent prompt must contain: exact file paths, the violations to fix with their tags/lines, the expected pattern from `tests/acceptance/README.md`, the current working-tree state, and the structured `FILE / STATUS / NOTES` return format.
- Apply corrections following the exact patterns from `tests/acceptance/README.md` — never invent alternatives.
- When a category is done, run focused lint across its modified files, and fix forward until green BEFORE moving to the next category.
- After each completed category, report its outcome (files changed, violations fixed, verification results) and ask the user whether to proceed to the next approved/pending category.
- Do NOT touch anything beyond the approved categories' violations.
- Do NOT commit.

### 9. Verify (focused only)

Run scoped checks on modified files only:

```bash
pnpm run lint:eslint:fix <modified-paths>
pnpm run lint:oxlint:fix <modified-paths>
```

If a focused lint fails because the fix revealed a real convention conflict, fix forward and re-run until green.

Once every approved category is fixed, run the FULL quality gate on the whole repository:

```bash
pnpm run lint:fix
pnpm run typecheck
pnpm run test:acceptance
```

> `pnpm run test:acceptance` requires Docker services (MongoDB) to be running. If Docker is unavailable, skip the acceptance gate and note it in the finish report.

Fix forward and re-run from the failing command until all three pass.

> **Do NOT run `pnpm run test:unit:cov`, `pnpm run test:unit`, or `pnpm run test:mutation` at any point during this process.** Unit tests and mutation testing are out of scope for acceptance test linting.

### 10. Finish

Report concisely:

- Files audited vs files changed.
- Violations fixed by rule tag; violations left untouched (if any).
- Focused lint results.
- If fixes were applied: report the final full-gate results from step 9.
- If nothing was fixed, keep reminding that deep coverage was not assessed and suggest `pnpm run test:acceptance`.

### 11. Lessons learned

After the finish report, run a short retrospective and offer to improve **this command**:

1. **Collect findings** from the session:
   - Warnings/violations the user accepted as-is (candidate whitelist entries) and categories they rejected.
   - Checklist rules applied too strictly or too loosely (false positives, missed patterns, ambiguous wording).
   - Subagent friction: truncated/malformed output, retries, prescribed fix mechanics that proved impossible.
   - Any explicit user feedback during approval questions or fix reviews.
2. **Propose improvements** — map each finding to a concrete edit of `.opencode/commands/lint-acceptance-tests.md`. Present them as a table: improvement → lessons addressed, then ask via the question tool which to apply.
3. **Never modify the command without explicit user approval.**
4. **Apply approved edits** directly, verify each landed by re-reading/grepping the edited sections, and report where each change lives.

Skip this step only when the user explicitly closes the session first; otherwise always offer it.
