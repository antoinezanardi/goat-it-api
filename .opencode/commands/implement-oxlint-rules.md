# Implement missing oxlint rules

## Task

Interactively implement all missing oxlint rules into `configs/oxlint/oxlint.config.jsonc` by running the checker script, fetching documentation for each rule, cross-referencing with ESLint configs, and inserting after user validation.

## Instructions

### 1. Run the checker script

Run `pnpm run lint:oxlint:check-rules` and parse the output to get the list of missing rules grouped by plugin. Each rule has a name and a documentation URL.

### 2. Process rules one at a time

For each missing rule (process plugins alphabetically, rules alphabetically within each plugin):

#### a. Fetch and summarize the rule documentation

Use WebFetch on the rule's doc URL (e.g. `https://oxc.rs/docs/guide/usage/linter/rules/eslint/eqeqeq.html`). Summarize the rule's purpose in 1-2 sentences.

#### b. Search for an ESLint equivalent

Use the prefix mapping below to find whether the rule already exists in the ESLint flat configs:

| Oxlint plugin | ESLint rule prefix | ESLint config file |
|---|---|---|
| `eslint` | *(no prefix, bare name)* | `configs/eslint/flat-configs/eslint-global.flat-config.ts` |
| `typescript` | `@typescript-eslint/` | `configs/eslint/flat-configs/eslint-typescript.flat-config.ts` |
| `import` | `import/` | `configs/eslint/flat-configs/eslint-import.flat-config.ts` |
| `unicorn` | `unicorn/` | `configs/eslint/flat-configs/eslint-unicorn.flat-config.ts` |
| `vue` | `vue/` | `configs/eslint/flat-configs/eslint-vue.flat-config.ts` |
| `vitest` | `vitest/` | `configs/eslint/flat-configs/eslint-unit-tests.config.ts` |
| `promise` | *(no ESLint equivalent)* | — |
| `oxc` | *(no ESLint equivalent)* | — |
| `node` | *(no ESLint equivalent)* | — |

For example:
- `eslint/eqeqeq` → grep for `"eqeqeq"` in `eslint-global.flat-config.ts`
- `typescript/dot-notation` → grep for `"@typescript-eslint/dot-notation"` in `eslint-typescript.flat-config.ts`

If found, extract the full value (e.g. `"error"`, `"off"`, or `["error", { ... }]`).

#### c. Present findings to user

Display in this format:

```
---
Rule: eslint/eqeqeq (3/78)
Plugin: eslint | Target: main rules section
Doc: https://oxc.rs/docs/guide/usage/linter/rules/eslint/eqeqeq.html

Summary: <1-2 sentence summary from the docs>

ESLint match: "eqeqeq": "error" (in eslint-global.flat-config.ts)
  — OR —
ESLint match: none found

Proposed value: "error"
---
```

#### d. Ask user for validation

Use the Question tool with options:
- **Accept** — insert the rule with the proposed value
- **Reject (skip)** — skip this rule entirely, move to the next one
- *(Custom answer is always available)* — user can type a different value like `"off"` or `["error", {"allow": ["!!"]}]`

#### e. Insert the rule

If user accepted (or provided a custom value):

1. **Determine insertion target:**

| Oxlint plugin | Insert location | Section comment |
|---|---|---|
| `eslint` | Top-level `rules` | `// ---- ESLint rules ----` |
| `import` | Top-level `rules` | `// ---- Import rules ----` |
| `node` | Top-level `rules` | `// ---- Node Rules ----` |
| `oxc` | Top-level `rules` | `// ---- Oxc rules ----` |
| `promise` | Top-level `rules` | `// ---- Promise Rules -----` |
| `unicorn` | Top-level `rules` | `// ---- Unicorn Rules -----` |
| `vue` | Top-level `rules` | `// ---- Vue Rules -----` |
| `typescript` | First override (`**/*.ts`, `**/*.vue`) | `// ---- TypeScript rules ----` |
| `vitest` | Spec override (`**/*.spec.ts`) | Within the vitest rules block |

2. **For the `node` plugin (first time only):**
   - Add `"node"` to the `plugins` array in the config
   - Create a new `// ---- Node Rules ----` section between the Import and Oxc sections in the top-level `rules`

3. **Insert alphabetically:** Find the correct alphabetical position within the section. Use the Edit tool with `oldString` being the rule line that would come immediately after, and `newString` being the new rule + that same after-line.

4. **Format the value** matching the existing config style:
   - Simple: `    "plugin/rule-name": "error",`
   - With options: multi-line array, 2-space indentation, matching surrounding rules

#### f. Validate with lint

Run `pnpm run lint:oxlint` after insertion.

- **If lint passes:** Report success and move to the next rule.
- **If lint fails:**
  - Show the lint error output to the user
  - Propose a fix (e.g. adjust options, change severity, add to an override for specific files)
  - Ask user with Question tool:
    - **Accept proposed fix** — apply the fix, then re-run `pnpm run lint:oxlint`
    - **Revert** — undo the insertion (remove the rule line), move to next
    - *(Custom answer)* — user provides a different instruction
  - After applying fix or custom: re-run `pnpm run lint:oxlint`
  - Repeat this loop until lint passes or user chooses to revert

### 3. Final validation

After all rules have been processed:

1. Run `pnpm run lint:oxlint:check-rules` one final time
2. Report a summary:
   - Total rules added
   - Total rules skipped
   - Remaining missing rules (if any)

## Key rules

- Always process rules alphabetically within each plugin group
- Never modify ESLint config files — this command only touches `configs/oxlint/oxlint.config.jsonc`
- Preserve all existing JSONC comments in the config file
- Use surgical Edit operations (never rewrite the full file)
- If the WebFetch for a doc URL fails, still present the rule to the user with "Doc unavailable" and continue
- The proposed value defaults to `"error"` when no ESLint match is found
- When an ESLint match is `"off"`, propose `"off"` for the oxlint rule too (user may still override)
- **NEVER** batch rules, always process one by one, even if it takes time
