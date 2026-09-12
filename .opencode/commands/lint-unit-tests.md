# Lint unit tests conventions

## Task

Audit unit test spec files against the repository conventions defined in `tests/unit/README.md`.

- If the prompt specifies file paths, audit only those specs (accept both spec paths and source paths — for a source path, lint its colocated spec).
- Otherwise, audit every `*.spec.ts` under `src/`.

The audit is **static analysis only** — never execute tests. Deep semantic checks (branch coverage) are out of scope; coverage remains delegated to `pnpm run test:unit:cov`.

To protect the main context during the **audit phase**, spec files are NEVER read by the main agent: after classification, audit work is dispatched to parallel `general` subagents that return only structured violation summaries. During the **fix phase**, the main agent may read and edit spec files directly only for mechanical categories touching at most 2 files (step 8, *Direct fix allowance*); all other fixes remain delegated to subagents. The main agent aggregates, reports, asks for approval, then applies fixes.

Report all violations once in-chat, then use the question tool to validate with the user which violations to fix. **Never modify any file before explicit user approval.**

## Instructions

### 1. Load context

1. Load the `write-unit-test` skill from `.agents/skills/write-unit-test/SKILL.md`.
2. Read `tests/unit/README.md` in full.

### 2. Determine scope

- Paths given in the prompt → resolve each to its spec file (non-colocated cases follow §3/[U1]: a source path maps to its colocated `.spec.ts`).
- No paths → glob all `*.spec.ts` under `src/`.

### 3. Classify each spec file

Apply the rules **in order**, first match wins:

| # | Rule                                                                                                                                                                                                                                | Type       |
|---|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------|
| 1 | Suffix `.controller.spec.ts`                                                                                                                                                                                                        | Controller |
| 2 | Suffix `.use-case.spec.ts`                                                                                                                                                                                                          | Use-case   |
| 3 | Suffix `.repository.spec.ts`                                                                                                                                                                                                        | Repository |
| 4 | Suffix `.dto.shape.spec.ts` OR `.dto.zod.validators.spec.ts` OR `.dto.zod.refinement*.spec.ts` OR `.dto.zod.preprocessors.spec.ts`                                                                                                  | DTO        |
| 5 | Suffix `.error.spec.ts` OR `.errors.spec.ts`                                                                                                                                                                                        | Error      |
| 6 | Anything else (`.helpers.spec.ts`, `.mappers.spec.ts`, `.rules.spec.ts`, `.service.spec.ts`, `.guard.spec.ts`, `.decorator.spec.ts`, `.pipe.spec.ts`, `.filter.spec.ts`, `.middleware.spec.ts`, `.validators.spec.ts`, `*.spec.ts`) | Helper     |

The type selects which per-type checklist applies alongside the universal checks.

### 4. Checklist reference

Audit subagents apply this checklist verbatim. Violations are recorded with rule tag + line number (s). Multiple occurrences of the same rule in one file collapse into a single entry listing all lines.

#### Universal checks (all types)

- **[U1] Location & naming** — Spec colocated with source as `SourceFile.spec.ts`. No `spec/` subfolders.
- **[U2] Vitest globals** — `describe`, `it`, `expect`, `vi`, `beforeEach`, `afterEach`, etc. are **globals** via Vitest `globals: true` (`configs/vitest/vitest.config.ts:19`). **Do NOT** import them from `"vitest"`; rely on globals. Only `import type { Mock, MockInstance } from "vitest"` for type-only imports is allowed. Flag any `import { describe, it, expect, vi } from "vitest"` as a violation.
- **[U3] Describe label rule** — Controllers, Use-cases, Repositories, Services, Errors, Helpers/mappers: symbol reference (`describe(ClassName, ...)`). DTOs (`.dto.shape.spec.ts`): string `"<DTOName> DTO Shape"` (e.g., `"Question DTO Shape"`) with nested per-field `describe("field", ...)` — file suffix is `.shape.spec.ts` because it tests the Zod shape of all fields. Never a free-form grouping string wrapping symbol describes.
- **[U4] Single-call assertions** — No `toHaveBeenCalledTimes(1)` combined with `toHaveBeenCalledWith(...)`. Use `toHaveBeenCalledExactlyOnceWith(...)`. Standalone `toHaveBeenCalledOnce()` (without argument matching) is acceptable.
- **[U5] Error swallowing** — No `.catch(() => null)`. Use try/catch with `void error` or `await expect(promise).rejects.toThrow(exactErrorInstance)`.
- **[U6] Type safety** — No `any`; no unsafe assertions without an `// Acceptable as ...` + `// oxlint-disable-next-line ...` comment pair.
- **[U7] Faketory sources** — Fake data from `@faketories/*`. No inline mock data factories — **except** DTO shape specs (`*.dto.shape.spec.ts`) which must use inline literals for `validDto` (see `[DT5]`).
- **[U8] `it.each` usage** — Always use `it.each` for parameterized tests. Don't write multiple `it(...)` for the same test with different inputs. `it.each` should always be typed like `it.each<T>([...])`. Do NOT flag tests that describe semantically different conditions or edge cases as mergeable — only pure input duplicates of identical test logic count.

#### Established patterns — do NOT flag

These recurring shapes are accepted codebase conventions. Auditors must not report them as violations or warnings:

- `vi.spyOn()` for module-level functions (preferred over `vi.mock()` due to `isolate: false` — see `tests/unit/README.md` "Mocking modules vs instances").
- `vi.mock()` for third-party modules not imported as real by other specs (e.g. `nestjs-zod`).
- Private method testing via `ClassName["privateMethod"](...)`.
- `import type { ... }` for type-only imports.
- `toStrictEqual<T>(expected)` for value equality with explicit type annotation.
- Nest `useValue` provider pattern for mock injection in `Test.createTestingModule`.
- `getModelToken(Schema.name)` for Mongoose model injection in repository tests.
- `vi.fn()` with typed generic for mock factories (e.g. `vi.fn<RepositoryStub["method"]>()`).
- `import packageJson from "@package-json" with { type: "json" }` for package.json assertions.
- String `describe("prop", ...)` for getter properties (e.g., `AppConfigService` getters `serverConfig`, `corsConfig`, etc.) — getters have no callable symbol reference, so a string label is the correct pattern and not a `[U3]`/`[HP2]` violation.
- Inline `validDto` literal in `*.dto.shape.spec.ts` (per new `[DT5]`) — not a `[U7]` violation.
- `describe(validatorFn, ...)` for Zod validator specs (`.validators.spec.ts` classified as Helper per §3 rule 6) — validators are pure functions with a symbol reference, so `[HP2]` symbol describe is the correct pattern, not a `[U3]` string-label violation.

#### Controller checks

- **[CT1] Test module** — Uses `Test.createTestingModule` with `controllers` and `providers` arrays. Mock use-cases injected via `{ provide: UseCaseClass, useValue: mock }`.
- **[CT2] Describe label** — String form `"<ControllerName> Controller"`, nested `describe(Controller.prototype.method, ...)`.
- **[CT3] Method delegation** — Each controller method asserts it calls the correct use-case method with `toHaveBeenCalledExactlyOnceWith`.
- **[CT4] DTO mapping** — When controller maps DTOs to commands, assert the mapping with `toStrictEqual`.
- **[CT5] Error propagation** — When use-cases throw domain errors, controller lets the exception bubble — assert rejection where appropriate.

#### Use-case checks

- **[UC1] Mock ports** — Repository ports mocked via `{ provide: REPOSITORY_TOKEN, useValue: mock }` in `Test.createTestingModule` providers.
- **[UC2] Describe label** — String form `"<UseCaseName> Use Case"` at top; nested `describe(UseCase.prototype.method, ...)`.
- **[UC3] Command mapping** — Assert use-case calls repository with correctly transformed data/commands.
- **[UC4] Domain errors** — Assert exact error class instances (not just message strings) with `rejects.toThrow(new SpecificError())`.
- **[UC5] Return values** — Assert return types with `toStrictEqual<Entity>(expected)`.

#### Repository checks

- **[RP1] Mock Model** — Mongoose Model mocked via `{ provide: getModelToken(Schema.name), useValue: mock }` with `vi.fn()` for `find`, `findOne`, `create`, `updateOne`, etc.
- **[RP2] Describe label** — String form `"<Name> Mongoose Repository"` or `"<Name> Repository"`.
- **[RP3] Query shape** — Assert correct filter/query passed to Model methods with `toHaveBeenCalledExactlyOnceWith`.
- **[RP4] Document→entity mapping** — Assert mapper is called with document, returns entity.
- **[RP5] Error handling** — Assert `undefined` return or domain error for missing documents.

#### DTO checks

- **[DT1] Zod parse** — Positive tests use `DTO.parse(valid)` or `expect(() => DTO.parse(valid)).not.toThrow()`.
- **[DT2] ZodError assertions** — Negative tests use `expect(() => DTO.parse(bad)).toThrow(ZodError)`.
- **[DT3] Metadata checks** — For every field that defines `.meta()` in the Zod schema, assert `DTO.shape.field.meta()` with `toStrictEqual` for description + example. Fields without `.meta()` in the schema are exempt — do not flag them.
- **[DT4] Per-field coverage** — Every field has at least one positive + one negative test.
- **[DT5] Inline valid DTO (shape specs)** — `*.dto.shape.spec.ts` must define `validDto` as an **inline literal**. The `beforeEach` assigns `validDto = { ... }` with a plain object literal — never `createFake*Dto()`, never a faketory call, never `Object.assign(validDto, {...})` (mutating). Negative tests use `{ ...validDto, field: badValue }` (spread copy). When testing parameterized valid values (e.g. `it.each` over enums), rebuild the DTO inline with `{ ...validDto, field: value }` — do NOT call faketories. Nested objects (e.g. `themes: [{ ... }]`) must also be inline literals. Remove ALL `@faketories/*` imports from shape spec files. Remove ALL `as SomeDto` or `as unknown as SomeDto` casts on DTO objects — the structural type on the `let` declaration handles typing. Flag any remaining faketory call, faketory import, or `as` cast in `*.dto.shape.spec.ts`.
- **[DT6] No DTO type annotation on validDto** — `*.dto.shape.spec.ts` must NOT use the DTO type name on `validDto`. The `let` declaration must use a structural type (e.g., `let validDto: { field: type; ... };`) or be untyped, with assignment in `beforeEach`. Never `let validDto: SomeDto` or `let validDto = {} as SomeDto`. OxLint flags `let validDto = { ... }` at top level as `require-hook`, so the `let` must be declared without initialization and assigned in `beforeEach`.

#### Helper checks

- **[HP1] Pure tests** — No infrastructure mocking of the unit under test. `vi.spyOn` acceptable for third-party deps. Exception: time-control utilities (`vi.useFakeTimers()`, `vi.advanceTimersByTime(...)`) are allowed for time-dependent helpers.
- **[HP2] Symbol describe** — `describe(functionName, ...)` for named functions; `describe("Description", ...)` only for file-level grouping when no single symbol applies.
- **[HP3] `it.each`** — Parametrized input→output cases use `it.each` with typed array.

#### Error checks

- **[ER1] Name property** — `expect(error.name).toBe("ErrorClassName")`.
- **[ER2] Message formatting** — Assert exact message string with `toStrictEqual` or `toBe`.
- **[ER3] Symbol describe** — `describe(ErrorClassName, ...)` at top level.

### 5. Dispatch audit subagents

During the audit phase the main agent must NOT read spec files itself — that is what overflows context (the fix-phase direct-fix allowance in step 8 is the only exception). Instead:

1. **Batch** — Group the classified specs by type in batches of 4-8 files per group (single-file input → one group of one; smaller remainders are acceptable).
2. **Dispatch** — Launch one `general` subagent per group via the Task tool, in parallel waves of at most ~6 concurrent tasks. Mark each task as read-only research/audit work.
3. **Prompt** — Use exactly this template per group, filling `<TYPE>`, listing the file paths:

   ```text
   You are auditing unit test spec files against repository conventions.
   This is a READ-ONLY audit: do NOT modify any file and do NOT run any test or shell command.
   NEVER run mutation testing (`pnpm run test:mutation`) or acceptance tests (`pnpm run test:acceptance`).

   Files to audit — type <TYPE>:
   - <path1>
   - <path2>

   Steps:
   1. Read `.opencode/commands/lint-unit-tests.md` section 4 IN FULL and apply the
      Universal checks, the "Established patterns — do NOT flag" block, the exact
      "<Type> checks" block named for this group's type — to every listed file.
   2. Read each listed spec file completely. Consult `tests/unit/README.md` only when
      needed to judge a pattern against the conventions.
   3. Record every violation with its tag + line number(s). Multiple occurrences of
      the same rule in one file collapse into a single entry listing all lines.

   Return EXACTLY this structure for each file, in the same order, nothing else:

   FILE: <path>
   STATUS: ✅ PASSED / ❌ FAILED / ⚠️ NEEDS HUMAN JUDGMENT
   VIOLATIONS:
   - [<tag>] :<lines> — <description including the expected pattern>
   WARNINGS:
   - [<tag>] — <what needs human judgment>

   Omit VIOLATIONS/WARNINGS sections when empty. No prose before or after.
   ```

4. **Collect & retry** — If an agent fails or returns truncated/malformed output, re-dispatch ONCE with HALF the files per batch (split into two tasks), preserving the original single-type grouping. If it still fails, mark its files ⚠️ `unaudited — manual review` in the report.

### 6. Report

Emit exactly one report block:

```markdown
# Unit Test Lint Report — <total> files scanned (<passed> passed)

| Status | File                      | Type       | Violations |
|--------|---------------------------|------------|------------|
| ❌     | src/path/to/file.spec.ts  | controller | V1, V2     |
| ⚠️     | src/path/to/other.spec.ts | use-case   | —          |

(✅ pass · ❌ violation · ⚠️ needs human judgment)
```

Table lists **only failing/warning files**, ordered by path — one row per file. Status precedence: a file with both violations and warnings shows ❌ (violations outrank warnings); list its violation IDs in the Violations column and mention the warnings in their entries below. Then list every violation, numbered sequentially:

```markdown
**V1** `src/path/to/file.spec.ts:38` — [CT3] Missing `toHaveBeenCalledExactlyOnceWith` — use instead of `toHaveBeenCalledTimes(1)` + `toHaveBeenCalledWith(...)`
**V2** `src/path/to/file.spec.ts:52` — [U3] Describe label should be `"<Name> Controller"` — found free-form label
```

Format per violation: ID → backticked `file:line(s)` → `[rule tag]` → concise description including the expected pattern.

Warnings carry no IDs — list them after the violations as unnumbered bullets, one per finding, in the form `- \`file:line (s)\` — <description>`.

### 7. Category-based fix approval

Immediately after the report, group every reported violation AND actionable warning (skip report-only warnings already accepted as conventions) by rule tag into fix **categories** (e.g. `U4 — single-call-assertions`, `CT3 — method-delegation`, `DT5 — faketory-usage`). Present the categories to the user via the question tool so they can approve which to fix, one category at a time (also offer "all categories" and "nothing — report only"; always allow a custom answer with specific categories/violation IDs).

Classify before asking: **mechanical** = unambiguous single-file edits; **judgmental** = requires writing new test logic or removal decisions that may affect coverage. State the split in the question description so the user can decide informedly.

### 8. Fix selected violations

Work through approved categories ONE at a time. **NO parallel work across categories** — complete each category fully (fix + verify) before starting the next. This prevents concurrent write races, revert conflicts, and inconsistent state across the working tree.

- **Direct fix allowance** — a mechanical category touching at most 2 files may be applied directly by the main agent (read + edit + scoped verification per section 9) instead of dispatching subagents.
- For each remaining category, dispatch ONE `general` subagent per category via the Task tool. The subagent receives ALL files for that category in a single prompt and fixes them sequentially. This avoids concurrent write races and inconsistent cross-batch state. **NEVER split a category into parallel batches** — multiple subagents writing to different files in the same category causes revert races and lost edits. The subagent must NOT run `pnpm run lint:fix` or `pnpm run test:unit:cov` — verification is done by the main agent after the subagent returns. **NEVER run mutation testing or acceptance tests in subagents.**
- Each subagent prompt must contain: exact file paths, the violations to fix with their tags/lines, the expected pattern from `tests/unit/README.md`, the current working-tree state (pre-existing modifications), and the structured `FILE / STATUS / NOTES` return format.
- Apply corrections following the exact patterns from `tests/unit/README.md` — never invent alternatives.
- Judgmental items may require adding or removing test cases; write them per the file-type pattern.
- Respect repo conventions: no comments (except allowed lint-disable/JSDoc forms), correct import grouping/order, no `any`.
- When a category is done, run focused lint + tests across its modified files **plus** `pnpm run test:unit:cov` (full coverage gate — fixes may add or reshape tests), and fix forward until green BEFORE moving to the next category.
- After each completed category, report its outcome (files changed, violations fixed, verification results) and ask the user whether to proceed to the next approved/pending category — do not chain categories silently.
- Do NOT touch anything beyond the approved categories' violations.
- Do NOT commit.

### 9. Verify (focused only)

Run scoped checks on modified files only — do NOT run other full suites, except the per-category `pnpm run test:unit:cov` gate mandated by step 8:

```bash
pnpm run test:unit <modified-spec-paths>
pnpm run lint:eslint:fix <modified-paths>
pnpm run lint:oxlint:fix <modified-paths>
```

If a focused test fails because the fix revealed a real convention conflict (e.g. renaming a describe broke a snapshot), fix forward and re-run until green.

Once every approved category is fixed, run the FULL quality gate on the whole repository (AGENTS.md gates, acceptance excluded):

```bash
pnpm run lint:fix
pnpm run typecheck
pnpm run test:unit:cov
```

Fix forward and re-run from the failing command until all three pass.

After the three gates pass, run mutation testing:

```bash
pnpm run test:mutation
```

If the score is below threshold (survived mutants), fix the issues, then re-run the **full gate sequence** (`pnpm run lint:fix` → `pnpm run typecheck` → `pnpm run test:unit:cov` → `pnpm run test:mutation`). Do **not** finish until `pnpm run test:mutation` passes the configured score threshold.

### 10. Finish

Report concisely:

- Files audited vs files changed.
- Violations fixed by rule tag; violations left untouched (if any).
- Focused test + lint results.
- If fixes were applied: report the per-category `pnpm run test:unit:cov` outcomes and the final full-gate results from step 9.
- If nothing was fixed, keep reminding that deep coverage was not assessed and suggest `pnpm run test:unit:cov`.

### 11. Lessons learned

After the finish report, run a short retrospective and offer to improve **this command**:

1. **Collect findings** from the session:
  - Warnings/violations the user accepted as-is (candidate whitelist entries) and categories they rejected.
  - Checklist rules applied too strictly or too loosely (false positives, missed patterns, ambiguous wording the agent had to interpret).
  - Subagent friction: truncated/malformed output, retries, prescribed fix mechanics that proved impossible, improvised deviations.
  - Any explicit user feedback during approval questions or fix reviews.
2. **Propose improvements** — map each finding to a concrete edit of `.opencode/commands/lint-unit-tests.md` (checklist rule, established-patterns entry, report format, dispatch/retry/fix-phase protocol). Present them as a table: improvement → lessons addressed, then ask via the question tool which to apply (allow multiple selection plus custom answers).
3. **Never modify the command without explicit user approval.**
4. **Apply approved edits** directly, verify each landed by re-reading/grepping the edited sections, and report where each change lives (section + approximate line).

Skip this step only when the user explicitly closes the session first; otherwise always offer it — even a clean audit may yield protocol refinements.
