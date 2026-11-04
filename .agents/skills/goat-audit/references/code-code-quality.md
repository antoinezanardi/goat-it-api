# CODE — Code quality & conventions

How the TypeScript source of the API is written, typed, named, exported, linted and kept clean: compiler strictness across the `src`, spec, acceptance and ESLint projects; the ban on `any`, non-null assertions, enums, `switch`, inline exports and magic values; explicit return types and accessibility; the CRUD and boolean naming rules; the five-group import order and alias-only imports; the two-line lint-disable format that keeps Oxlint and ESLint honest; dead-code hygiene; and consistent error handling. A check here fails when code violates a convention that `AGENTS.md` already owns, even if the current diff "works".

**Decision doc:** `docs/architecture.md` (section `## GOAT audit decisions`). **Diff triggers:** see SKILL.md category index.

**Not in this category:** file placement, companions, dependency direction, module wiring and duplicated domain rules → ARCH · framework API misuse (NestJS DI runtime, Fastify, Mongoose, Zod/nestjs-zod, SWC build) → STACK · test strategy, assertions, coverage and mutation → TEST · docs drift → DOCS · unused or undeclared dependencies → SUP · log content and PII → PRIV/OPS · timeout and retry semantics → REL · CI job wiring → CICD · agent and skill files → AGENT

## Contents

- [1. Type safety](#1-type-safety)
- [2. Function and class conventions](#2-function-and-class-conventions)
- [3. Naming](#3-naming)
- [4. Exports and imports](#4-exports-and-imports)
- [5. Constants and magic numbers](#5-constants-and-magic-numbers)
- [6. Dead code and hygiene](#6-dead-code-and-hygiene)
- [7. Lint governance](#7-lint-governance)
- [8. Error handling](#8-error-handling)
- [Sources](#sources)

## 1. Type safety

- **[CODE-01] The strict compiler family stays on across every project** — `configs/typescript/tsconfig.app.json` keeps `strict`, `strictPropertyInitialization`, `strictBindCallApply`, `noImplicitAny` and `noFallthroughCasesInSwitch` enabled, and the spec, acceptance and ESLint tsconfigs extend it without disabling a strict-family flag.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `configs/typescript/tsconfig.app.json`, `configs/typescript/tsconfig.spec.json`, `configs/typescript/tsconfig.acceptance.json`, `configs/typescript/tsconfig.eslint.json` · Src: [1], [2], project: AGENTS.md
- **[CODE-02] `any` is absent from production and test source** — No annotation, `as any`, `any[]`, generic argument or default uses `any`; `typescript/no-explicit-any` and the `no-unsafe-*` family stay at `error`, and an untrusted value starts as `unknown`.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/**/*.ts`, `tests/**/*.ts`, `configs/eslint/flat-configs/eslint-typescript.flat-config.ts`, `oxlint.config.jsonc` · Src: [3], project: AGENTS.md
- **[CODE-03] Non-null assertions are not used to silence the compiler** — No production expression uses the `!` non-null assertion operator or an `as unknown as T` double cast; definite-assignment assertions are confined to Mongoose schema fields populated by Mongoose, and test doubles may use `as unknown as` only to bridge a typed mock to the class token it replaces; every other narrowing uses a guard, a Zod parse or `satisfies`.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: medium · Look: `src/**/*.ts`, `tests/**/*.ts` · Src: [3], project: AGENTS.md
- **[CODE-04] Enums are replaced by `as const` objects** — The `enum` keyword is absent except for the single `ControllerPrefixes` enum used for shared route string building; every other closed set is an `as const` object with an exported `UPPER_CASE` constant array, and `oxc/no-const-enum`, `typescript/no-mixed-enums` and `prefer-enum-initializers` stay at `error`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/**/*.ts`, `src/shared/infrastructure/http/controllers/controllers.enums.ts` · Src: [3], [4], project: AGENTS.md
- **[CODE-05] Type escape hatches are absent or justified** — Source contains zero `@ts-ignore` and `@ts-nocheck`; any `@ts-expect-error` states its reason; `ban-ts-comment` stays at `error`, and no temporary `as` cast exists without the two-line disable pair.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/**/*.ts`, `tests/**/*.ts` · Src: [3], project: AGENTS.md
- **[CODE-06] Untrusted values are `unknown` until narrowed** — Caught errors, JSON payloads, environment reads and third-party responses enter as `unknown` and are narrowed with `instanceof`, a Zod schema, a type guard or `Error.isError`; no catch clause annotates its variable with a concrete type.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/**/*.ts`, `src/infrastructure/api/config/**`, `src/app/filters/global-exception/**` · Src: [3], project: AGENTS.md
- **[CODE-07] `type` aliases are preferred and primitives are not wrapped** — Object shapes use `type`, not `interface` (`consistent-type-definitions: type`); no `type UserId = string`-style alias wraps a primitive; and `import type` is used only for symbols that are never read at runtime.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/**/*.ts`, `tests/**/*.ts` · Src: [3], project: AGENTS.md

## 2. Function and class conventions

- **[CODE-08] Every function declares its return type** — Exported and private functions, methods, mappers, helpers and guards declare an explicit return type (`: void`, `: Promise<T>`, `: boolean`…); only Vitest callbacks are exempt because Oxlint's type-aware analysis treats them as `void`-returning.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/**/*.ts` · Src: [3], project: AGENTS.md
- **[CODE-09] Every class member declares accessibility** — Fields, methods, accessors and static members carry `public`, `private` or `protected`; `explicit-member-accessibility` stays at `error`, and a class never relies on TypeScript's implicit `public`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/**/*.ts` · Src: [3], project: AGENTS.md
- **[CODE-10] Constructor injection uses `private readonly` parameters** — An injected dependency is declared as `private readonly <name>: <Type>` in the constructor signature, never assigned manually in the body, and `parameter-properties` allows only the `private readonly` form.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/**/*.ts` · Src: [3], project: AGENTS.md
- **[CODE-11] Functions stay within 30 lines** — `max-lines-per-function` stays at `error` with `max: 30`, `skipBlankLines` and `skipComments` in both linters; a longer function is split by responsibility, with spec files and faketories as the documented overrides.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `configs/eslint/eslint.constants.ts`, `oxlint.config.jsonc`, `src/**/*.ts` · Src: [4], [5], project: AGENTS.md
- **[CODE-12] Lines stay within 180 characters** — `MAX_LENGTH` is 180 and `@stylistic/max-len` enforces it (comments, template literals, regular expressions and import lines are ignored); a longer expression is wrapped rather than left to horizontal scrolling.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `configs/eslint/eslint.constants.ts`, `configs/eslint/flat-configs/eslint-stylistic.flat-config.ts` · Src: [5], project: AGENTS.md
- **[CODE-13] `switch`/`case` is not used** — `no-restricted-syntax` bans `SwitchStatement` and `SwitchCase`; a union is handled through a typed `Record<Union, T>` map, polymorphism, an object map or a conditional chain, and `typescript/switch-exhaustiveness-check` remains available for any legacy switch under review.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `configs/eslint/flat-configs/eslint-global.flat-config.ts`, `src/**/*.ts` · Src: [5], [6], project: AGENTS.md
- **[CODE-14] Ternaries assign values only** — A conditional expression produces a value and is never used for a side effect or statement; nested ternaries are banned (`unicorn/no-nested-ternary`, `eslint/no-nested-ternary`) and multi-line ternaries are flattened into a helper or an `if`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/**/*.ts` · Src: [5], [6], project: AGENTS.md

## 3. Naming

- **[CODE-15] Boolean names carry an allowed prefix** — A boolean variable, property or parameter starts with `is`, `has`, `can`, `should`, `was`, `were`, `are`, `does`, `did` or `must`; no boolean is named `active`, `enabled`, `valid` or `ready` without the prefix.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/**/*.ts`, `configs/eslint/eslint.constants.ts` · Src: [3], project: AGENTS.md
- **[CODE-16] CRUD verbs are `Create`, `Modify`, `Archive`, `Find` and `Remove`** — A patch operation is named `Modify*`, a soft delete `Archive*`, a detach `Remove*`, and a lookup `Find*`; `Update*` and hard-`Delete*` names are absent from use cases, commands, repository methods and route handlers.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/*/application/use-cases/**`, `src/contexts/*/domain/repositories/**` · Src: project: AGENTS.md, project: docs/architecture.md §8.1
- **[CODE-17] Casing follows the artifact type** — Files and directories are `kebab-case`, classes and types `PascalCase`, functions/methods/properties `camelCase`, and exported constants `UPPER_CASE`; `unicorn/filename-case` and `@typescript-eslint/naming-convention` stay at `error`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/**/*.ts`, `configs/eslint/eslint.constants.ts` · Src: [3], [4], project: AGENTS.md
- **[CODE-18] Constants are `UPPER_CASE` and carry their unit** — A numeric limit, duration or size constant uses an `UPPER_CASE` name with a unit suffix (`…_IN_MS`, `…_MS`, `…_SECONDS`, `…_BYTES`) and lives in a `*.constants.ts` file; a bare `TIMEOUT` or `LIMIT` is a finding.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `src/**/*.constants.ts` · Src: project: AGENTS.md, project: docs/architecture.md §4.1
- **[CODE-19] Names state domain meaning** — Repository methods, mappers and policies use the project vocabulary (`findById`, `countLiveByThemeId`, `createQuestionDtoFromEntity`, `ensureQuestionThemeIsNotArchivedForCreation`); abbreviations and placeholders (`data`, `info`, `tmp`, `handle`, `manager`) do not replace a domain name, and one primary class occupies each file.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/*/application/**`, `src/contexts/*/domain/**` · Src: [6], project: AGENTS.md, project: docs/architecture.md §4.1
- **[CODE-20] Artifact suffixes match their role** — Unit specs end `.spec.ts`, DTO shapes `.dto.shape.ts`, DTO wrappers `.dto.ts`, Mongoose schemas `.mongoose.schema.ts`, repositories `.mongoose.repository.ts`, pipelines `.mongoose.repository.pipeline.ts`, mappers `.mappers.ts`, rules `.rules.ts` and Nest helpers `.helpers.ts`; `vitest/consistent-test-filename` keeps the spec pattern.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `src/**/*.ts` · Src: [4], project: AGENTS.md, project: docs/architecture.md §8.1

## 4. Exports and imports

- **[CODE-21] Declarations precede a trailing export block** — Functions and constants are declared first and exported at the end; inline `export function` and `export const` are absent; a class may use `export class` because a file holds one primary class, while DTO wrappers and Mongoose schemas declare their class then export it in an `export {}` block.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/**/*.ts` · Src: [3], project: AGENTS.md, project: docs/architecture.md §8.3
- **[CODE-22] No default exports, barrels or type re-exports** — Production modules use named exports only; no default export, barrel file, re-export-only file or type re-export exists, except the `packages/schemas` entrypoint `index.ts` files and config files whose tooling requires a default export; types are imported from their canonical source.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: medium · Look: `src/**/*.ts`, `packages/schemas/src/**`, `configs/**/*.ts` · Src: [3], project: AGENTS.md, project: docs/architecture.md §8.3
- **[CODE-23] Imports use the five-group order** — Imports are separated by blank lines in the order (1) `node:*`, (2) external packages, (3) internal aliases, (4) test aliases and (5) `import type`; a file never interleaves them or relies on alphabetical sorting across groups.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `src/**/*.ts`, `tests/**/*.ts` · Src: [3], project: AGENTS.md, project: docs/architecture.md §9
- **[CODE-24] Imports are alias-based, duplicate-free and namespace-free** — No relative `./`/`../` specifier appears in `src/`, `tests/` or `packages/schemas/src/`; `import/no-duplicates` and `import/no-self-import` stay at `error`; namespace imports (`import * as`) are not used in production code and appear in tests only where a spy on a module export requires it.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/**/*.ts`, `tests/**/*.ts` · Src: [3], [4], project: AGENTS.md, project: docs/architecture.md §9
- **[CODE-25] One class per file, no loose class-file artifacts** — A class file contains only its class plus imports; module-level constants, types and helpers live in the nearest `constants/`, `types/` or `helpers/` folder, and `max-classes-per-file` stays at `error` with the narrow grouped-error override.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/**/*.ts`, `oxlint.config.jsonc` · Src: [3], project: AGENTS.md, project: docs/architecture.md §4.2
- **[CODE-26] Side-effect imports are limited to bootstrap prerequisites** — The only bare side-effect import allowed is `reflect-metadata` (and framework bootstrap modules in `main.ts`); production modules otherwise import only symbols they use, so tree-shaking and ESM evaluation order stay predictable.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `src/**/*.ts`, `configs/eslint/flat-configs/eslint-import.flat-config.ts` · Src: [3], project: docs/architecture.md §6.1

## 5. Constants and magic numbers

- **[CODE-27] No magic numbers except `0`, `1` and `-1`** — `no-magic-numbers` stays at `error` in both linters with only `0`, `-1`, `1`, array indexes and default values ignored; numeric limits, ports, retry counts and sizes come from named constants, with spec, faketory, constants and config overrides only.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: medium · Look: `configs/eslint/eslint.constants.ts`, `oxlint.config.jsonc`, `configs/eslint/flat-configs/eslint-global.flat-config.ts` · Src: [4], [5], project: AGENTS.md
- **[CODE-28] Limits and durations live in the nearest constants file** — A numeric limit, duration, retry count or buffer size is declared in the nearest `*.constants.ts` (context, layer or shared), named with its unit, exported `UPPER_CASE`, and imported by every consumer rather than duplicated as a literal.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/**/*.constants.ts` · Src: project: AGENTS.md, project: docs/architecture.md §4.1
- **[CODE-29] Domain strings are declared once** — Collection names, published field names, statuses, locales, route prefixes, sort fields, error codes and API paths come from a `*.constants.ts`, a published persistence contract or `@goat-it/schemas`; no production file repeats a domain string literal that another module already owns.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `src/contexts/*/domain/constants/**`, `src/contexts/*/contracts/persistence/**`, `src/shared/domain/constants/**` · Src: [6], project: docs/architecture.md §5.4, project: docs/architecture.md §8.1
- **[CODE-30] Duplicated literals and configuration are extracted** — An identical literal array, object, regular expression or default value appearing in two or more production files is defined once in a `*.constants.ts` or a pure helper and imported; a copy-pasted configuration block is a finding even when both copies currently agree.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/**/*.ts` · Src: [6], project: AGENTS.md

## 6. Dead code and hygiene

- **[CODE-31] No unfinished-work markers remain** — Source contains no `TODO`, `FIXME`, `XXX` or `HACK` marker; open work is tracked as a GitHub issue, and `no-warning-comments` stays off because grep is the proof.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `src/**/*.ts`, `tests/**/*.ts`, `scripts/**` · Src: [7], project: AGENTS.md
- **[CODE-32] No commented-out or unreachable code** — Source contains no run of commented-out statements (git history is the archive), no `if (false)`, no dead branch after an exhaustive narrowing, and no statement after `return`/`throw`; `no-unreachable`, `no-constant-condition` and `no-unnecessary-condition` stay at `error`.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `src/**/*.ts`, `tests/**/*.ts` · Src: [3], [7], project: AGENTS.md
- **[CODE-33] Production source does not log through `console`** — `no-console` stays at `error` for `src/`; application code uses the NestJS logger or the pino-backed `Logger`, and the only allowed `console.info`/`console.error` calls are in acceptance step helpers and CLI scripts with their scoped overrides.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/**/*.ts`, `oxlint.config.jsonc` · Src: [4], project: AGENTS.md
- **[CODE-34] No unused files, exports or lint configuration** — Every production module is reachable from `main.ts`, every flat config under `configs/eslint/flat-configs/` is imported by `eslint.config.ts`, every exported constant of `configs/eslint/eslint.constants.ts` is consumed by a configuration (imported or used inside the exported config it belongs to), and every Oxlint `overrides[].files` glob matches at least one tracked file.
  Evidence: `command` · Diff: ✗ · Severity: medium · Src: [5], project: AGENTS.md
- **[CODE-35] No empty or placeholder files** — No empty file, empty `export {}`, stub function returning `undefined` without a caller, or placeholder module exists in `src/`, `tests/` or `packages/schemas/src/`; `unicorn/no-empty-file` stays at `error`.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `src/**/*.ts`, `tests/**/*.ts`, `packages/schemas/src/**` · Src: [4], project: AGENTS.md

## 7. Lint governance

- **[CODE-36] Lint and typecheck gates are green** — `pnpm run lint` (Oxlint then ESLint) exits 0 with zero errors and zero warnings, and `pnpm run typecheck` (`tsgo -b --clean && tsgo -b --noEmit`) exits 0 with zero diagnostics; neither linter reports an unknown, missing or crashing rule.
  Evidence: `command` · Diff: ✗ · Core: ✓ · Severity: high · Src: [3], [4], project: AGENTS.md
- **[CODE-37] Disable directives use the two-line, rule-specific form** — Every `oxlint-disable-next-line` or `eslint-disable-next-line` names specific rules and is immediately preceded by `// Acceptable as <concise justification>`; production code has no file-level or block-level directive and no rule-less disable unless a decision note approves the instance, and a diff adds one only when no code change can satisfy the rule.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: medium · Look: `src/**/*.ts`, `tests/**/*.ts` · Src: [4], project: AGENTS.md
- **[CODE-38] Disable rule names use Oxlint namespacing** — A disable comment names rules with their plugin namespace (`typescript/no-…`, `unicorn/…`, `eslint/…`, `vitest/…`) and never uses the `@typescript-eslint/` or `@` prefix, so the same directive works in Oxlint and the ESLint bridge.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `src/**/*.ts`, `tests/**/*.ts` · Src: [4], project: AGENTS.md
- **[CODE-39] The Oxlint rule inventory is complete** — `pnpm run lint:oxlint:check-rules` exits 0: every rule exposed by the installed Oxlint (minus the documented plugin exclusions) is configured explicitly, on or off, in `oxlint.config.jsonc`, and the corresponding ESLint inventory script passes too.
  Evidence: `command` · Diff: ✗ · Severity: medium · Src: [4], project: scripts/check-oxlint-rules.ts
- **[CODE-40] The two linters do not drift** — `eslint.config.ts` spreads `oxlint.buildFromOxlintConfigFile("./oxlint.config.jsonc")` after the project configs, the package-ban blocks are composed after that bridge, `pnpm run lint` runs Oxlint before ESLint, and a rule configured in both places uses the same severity and options.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `eslint.config.ts`, `oxlint.config.jsonc`, `configs/eslint/flat-configs/eslint-boundaries.flat-config.ts` · Src: [4], [5], project: AGENTS.md

## 8. Error handling

- **[CODE-41] No exception is swallowed** — Every `catch` block and `.catch()` callback re-throws with context, returns a typed failure or maps to a domain error; none is empty, none returns a fallback value without recording the error, and `no-useless-catch` stays at `error`.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `src/**/*.ts`, `src/infrastructure/api/health/**`, `src/app/filters/global-exception/**` · Src: [3], [6], project: AGENTS.md
- **[CODE-42] Caught values are narrowed before use** — A catch variable is typed `unknown` (implicitly or explicitly) and narrowed with `Error.isError`, `instanceof` or a type guard before reading `.message`, `.name`, `.stack` or a custom field; `use-unknown-in-catch-callback-variable` stays at `error`.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `src/**/*.ts` · Src: [3], project: AGENTS.md
- **[CODE-43] Errors are domain classes with real context** — A thrown application error is a named class extending `Error`, defined in its domain error folder, carrying the identifiers the caller needs; no code throws a bare object, a string or an ad-hoc `new Error` where a domain error exists.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/contexts/*/domain/errors/**` · Src: [3], [6], project: docs/architecture.md §7.4
- **[CODE-44] Only `Error` instances are thrown** — `only-throw-error` and `prefer-promise-reject-errors` stay at `error`; no `throw "message"`, `throw { code }` or `Promise.reject("message")` appears, so stack traces and the global filter can rely on `Error`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `src/**/*.ts` · Src: [3], project: docs/architecture.md §7.4
- **[CODE-45] Promises are never left floating** — Every promise is awaited, returned or explicitly discarded with `void`; `no-floating-promises` and `no-misused-promises` stay at `error`, `promise/catch-or-return` and `promise/always-return` stay on, and `require-await` prevents an async function that never awaits.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `src/**/*.ts`, `configs/eslint/flat-configs/eslint-typescript.flat-config.ts`, `oxlint.config.jsonc` · Src: [3], project: AGENTS.md

## Sources

[1] TypeScript — TSConfig reference: https://www.typescriptlang.org/tsconfig/ (fetched 2026-11-04)
[2] TypeScript blog — Announcing TypeScript 6.0: https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/ (fetched 2026-11-04)
[3] typescript-eslint — Rules overview: https://typescript-eslint.io/rules/ (fetched 2026-11-04)
[4] Oxlint — Documentation: https://oxc.rs/docs/guide/usage/linter.html (fetched 2026-11-04)
[5] ESLint — Configuration files: https://eslint.org/docs/latest/use/configure/configuration-files (fetched 2026-11-04)
[6] Refactoring Guru — Code smells: https://refactoring.guru/refactoring/smells (fetched 2026-11-04)
[7] Google engineering practices — What to look for in a code review: https://google.github.io/eng-practices/review/reviewer/looking-for.html (fetched 2026-11-04)
