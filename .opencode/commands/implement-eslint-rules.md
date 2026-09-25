# Implement missing ESLint rules

## Task

Interactively reconcile the ESLint flat configs with the rules available from ESLint core and its installed plugins, by running the checker script and handling two distinct categories:

- **Section A — Deprecated rules currently configured**: rules whose `meta.deprecated` is set and which are still present in a flat config. Present them so the user can turn each one `"off"`.
- **Section B — Rules not set at all** (neither activated nor off): rules absent from every flat config. Present them so the user can add each one.

Process both sections one rule at a time, inserting after user validation.

## Instructions

### 1. Run the checker script

Run `pnpm run lint:eslint:check-rules` and parse the output. It prints two sections:

- `Deprecated rules currently configured` (expected: 11) — grouped by plugin, each rule with its doc URL.
- `Rules not set at all` (expected: 219) — grouped by plugin, each rule with its doc URL.

The script exits with code `1` when either section is non-empty (this is expected).

### 2. Process Section A — deprecated rules (do this first)

For each deprecated configured rule, grouped by plugin alphabetically and rules alphabetically within each plugin:

#### a. Fetch and summarize the rule documentation

Use WebFetch on the rule's doc URL (e.g. `https://typescript-eslint.io/rules/no-loop-func`). Summarize its deprecation and recommended replacement in 1-2 sentences.

#### b. Locate the current value

Find the rule in its target file (see the mapping in §4) and read its current value. Examples:

- `@typescript-eslint/no-loop-func` → currently `"error"`
- `@typescript-eslint/no-restricted-imports` → currently `["error", { patterns: [...] }]`
- `unicorn/better-regex` → currently configured in `eslint-unicorn.flat-config.ts`

#### c. Present findings to user

Display in this format:

```
---
Rule: @typescript-eslint/no-loop-func (1/11)
Plugin: @typescript-eslint | Target: eslint-typescript.flat-config.ts
Doc: https://typescript-eslint.io/rules/no-loop-func

Summary: <1-2 sentence summary from the docs>

Current value: "error"
Proposed value: "off"
---
```

#### d. Ask user for validation

Use the Question tool with options:

- **Accept** — set the rule to `"off"`
- **Reject (skip)** — leave it as-is, move to the next one
- *(Custom answer is always available)* — user can type a different value

#### e. Apply the change

On accept (or custom value), replace the **existing value** with `"off"` using a surgical Edit (preserve the key, comments and ordering). For a rule configured with options (e.g. `["error", { ... }]`), replace the whole value with `"off"`.

#### f. Validate with lint

Run the config-load check for the edited file (see §5). If it passes, move on. If it fails, show the error, propose a fix or revert, and re-run.

### 3. Process Section B — rules not set at all

For each unset rule, grouped by plugin alphabetically and rules alphabetically within each plugin:

#### a. Fetch and summarize the rule documentation

Use WebFetch on the rule's doc URL. Summarize the rule's purpose in 1-2 sentences.

#### b. Present findings to user

```
---
Rule: unicorn/no-array-splice (1/219)
Plugin: unicorn | Target: eslint-unicorn.flat-config.ts
Doc: https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v76.0.0/docs/rules/no-array-splice.md

Summary: <1-2 sentence summary from the docs>

Proposed value: "error"
---
```

#### c. Ask user for validation

Use the Question tool with options:

- **Accept** — insert the rule with `"error"`
- **Reject (skip)** — skip this rule entirely, move to the next one
- *(Custom answer is always available)* — user can type a different value like `"off"` or `["error", { ... }]`

#### d. Insert the rule

On accept (or custom value):

1. Determine the target file from the mapping in §4.
2. Insert alphabetically within the plugin's rules block. Use the Edit tool with `oldString` being the rule line that would come immediately after, and `newString` being the new rule + that same after-line.
3. Format the value matching the existing config style:
   - Simple: `    "unicorn/no-array-splice": "error",`
   - With options: multi-line array, 2-space indentation, matching surrounding rules.

#### e. Validate with lint

Run the config-load check for the edited file (see §5). If it passes, move on. If it fails, show the error, propose a fix or revert, and re-run.

### 4. Plugin → target file mapping

| Rule prefix | Target file | Insertion block |
|---|---|---|
| *(core, no prefix)* | `configs/eslint/flat-configs/eslint-global.flat-config.ts` | `rules` (ESLint sections) |
| `@typescript-eslint` | `configs/eslint/flat-configs/eslint-typescript.flat-config.ts` | `// ---- TypeScript Rules -----` block |
| `unicorn` | `configs/eslint/flat-configs/eslint-unicorn.flat-config.ts` | its `rules` block |
| `import-x` | `configs/eslint/flat-configs/eslint-import.flat-config.ts` | `// ---- ESLint Import Rules -----` block |
| `vitest` | `configs/eslint/flat-configs/eslint-unit-tests.flat-config.ts` | vitest `rules` block |
| `@stylistic` | `configs/eslint/flat-configs/eslint-stylistic.flat-config.ts` | its `rules` block |

**Core rules are inserted only into `eslint-global.flat-config.ts`.** Core rules set to `"off"` in `eslint-typescript.flat-config.ts` are deliberate TypeScript overrides and must never be touched by this command.

### 5. Validation strategy

**Do not run a full-repo `pnpm run lint:eslint` after each insertion.** With up to 219 rules (214 unicorn) inserting `"error"`, a full lint per rule is prohibitively slow and would flood the run with expected violations.

Per-rule validation = confirm the config still loads and the rule name/options are valid:

```
pnpm exec eslint --config eslint.config.ts --print-config src/main.ts > /dev/null
```

For `vitest` rules, validate against a spec file path instead:

```
pnpm exec eslint --config eslint.config.ts --print-config src/main.spec.ts > /dev/null
```

A non-zero exit means the rule name or options are invalid → show the output, propose a fix, or revert.

**After all rules are processed**, run the full `pnpm run lint:eslint` once. Violations from newly enabled rules are **expected** and are not treated as command failures; report them so the user can address them rule by rule (this command configures rules, it does not fix source code).

### 6. Final validation

After all rules have been processed:

1. Run `pnpm run lint:eslint:check-rules` one final time.
2. Report a summary:
   - Total Section A rules disabled
   - Total Section B rules added
   - Total rules skipped
   - Remaining findings (if any)

## Key rules

- Always process Section A before Section B.
- Always process plugins alphabetically, rules alphabetically within each plugin.
- Never modify the six flat-config files listed in §4 for anything other than this command's rules.
- Preserve all existing comments and formatting.
- Use surgical Edit operations (never rewrite the whole file).
- If the WebFetch for a doc URL fails, still present the rule with "Doc unavailable" and continue.
- The proposed value defaults to `"error"` for Section B and `"off"` for Section A.
- **NEVER** batch rules, always process one by one, even if it takes time.
