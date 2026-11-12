# JSDoc Guide

This guide defines where JSDoc is required in `goat-it-api`, what each block must say, and what it must not say. It exists so IDE hovers, pull-request review and onboarding describe what TypeScript cannot express: side effects, lifecycle, invariants, failure behaviour, units and fallbacks. It is written for contributors, reviewers and agents.

File placement, naming and dependency direction are owned by [`architecture.md`](architecture.md); unit-test conventions are owned by [`unit-tests.md`](unit-tests.md). This guide only owns comment scope, style, enforcement and review.

## Table of Contents

- [1. Scope](#1-scope)
  - [1.1 Not documented in this pass](#11-not-documented-in-this-pass)
- [2. Style: concise TSDoc](#2-style-concise-tsdoc)
- [3. Examples](#3-examples)
- [4. Anti-patterns](#4-anti-patterns)
- [5. Enforcement and review](#5-enforcement-and-review)

## 1. Scope

JSDoc is required on the logic surfaces a maintainer must understand before changing a line: the places where a caller can be surprised by a throw, a side effect, a fallback, a unit or a MongoDB constraint. Each row below states the minimum a block must cover.

| Surface | Location | Required blocks |
|---|---|---|
| **Use case** | `src/contexts/**/application/use-cases/**/*.use-case.ts` | Class purpose; `@throws` on the public entry method for every domain error that can escape. |
| **Repository port** | `src/contexts/**/domain/repositories/**/*.repository.types.ts` | Type purpose; non-obvious method contracts, notably `undefined` return semantics and query shape. |
| **Repository adapter** | `src/contexts/**/infrastructure/persistence/mongoose/repository/**/*.mongoose.repository.ts` | Class purpose; public methods whose behaviour differs from the port (aggregation, duplicate-key translation, `undefined` on no match). |
| **Mapper** | `src/**/mappers/**/*.mappers.ts` and `src/contexts/**/contracts/persistence/**/*.persistence.mappers.ts` | Every exported mapper: source → target, plus localization, defaulting or date normalization. |
| **Domain rule** | `src/contexts/**/domain/rules/**/*.rules.ts` and `src/shared/domain/rules/**/*.rules.ts` | Every exported predicate, policy and helper; `@throws` on every `ensure*`. |
| **Service** | `src/**/providers/**/*.service.ts` | Class purpose; public methods with side effects or failure behaviour. |
| **HTTP boundary** | `src/infrastructure/api/auth/providers/guards/**/*.guard.ts`, `src/infrastructure/api/auth/providers/decorators/**/*.decorator.ts`, `src/shared/infrastructure/http/{decorators,middlewares,pipes}/**`, `src/app/filters/**/*.filter.ts` | Class or function purpose, and the rejection or HTTP status contract. |
| **Exported helper** | `src/**/helpers/**/*.helpers.ts` | Every exported helper, including fallbacks, sentinels and domain rules encoded in the helper. |
| **Shared or contract type** | `src/shared/**/*.types.ts`, `src/contexts/**/domain/repositories/*.repository-contracts.types.ts`, `src/contexts/**/contracts/persistence/*.types.ts` | Type purpose; non-obvious members only. |
| **Published DTO shape** | `*.dto.shape.ts` files re-exported by `packages/schemas/src/**/index.ts` under `src/contexts/**/application/dto/**`, `src/contexts/**/contracts/dto/**` and `src/shared/application/dto/**` | One top-level block on the schema constant and one on the inferred type. Field-level documentation stays in `.describe()` and `.meta()`; `z.infer` does not carry per-field TSDoc, so do **not** hand-write parallel interfaces or types to add per-field comments. |

### 1.1 Not documented in this pass

The following surfaces are intentionally out of scope for new blocks. Each is already covered by a stronger, self-checking contract; an existing block that already adds value may stay, but do not add new ones:

- **Domain error classes** — the class name, message and `GlobalExceptionFilter` mapping are the contract. Document `@throws` at the throwing surface instead, where a caller can act on it.
- **Entity, value-object and helper-local type aliases** — the field names are the contract; domain semantics live in [`domain-logic.md`](domain-logic.md). Self-describing aliases such as `locale.types.ts` and `package-json.helpers.types.ts` stay out of scope; only generic, utility or contract types with non-obvious members are documented.
- **Controllers, modules, `main.ts` and bootstrap/server wiring** — framework scaffolding whose behaviour is exercised by unit, module-wiring and acceptance tests.
- **DTO wrappers (`*.dto.ts`) and DTO shapes not re-exported by `@goat-it/schemas`** — they are not part of the published package surface.
- **Mongoose schemas, pipelines, commands, constants and private helpers** — structural or self-describing code; a comment would only restate the declaration.
- **Tests, faketories, mocks and setup files** — test names are the documentation.
- **Generated code** — `dist/`, coverage output and other generated artifacts are never hand-edited.

## 2. Style: concise TSDoc

### Placement and shape

- Put the block immediately above the declaration it documents, with no blank line in between.
- Start with a one-sentence summary in the present tense, ending with a period. Add a blank line before every additional paragraph or tag block.
- Use `/** … */` only. `/* … */` and `//` are not documentation.

### Say semantics, not syntax

- Document what the signature cannot express. If the name and the types already say it, do not repeat it.
- Keep the block short: hovers are read in a tooltip, not a page.

### Tags only when they add information

- `@param` — only for non-obvious parameters: units, constraints, side effects or defaults. Never for a parameter whose name and type are enough.
- `@returns` — only when the meaning of the result is not obvious, including `undefined` or empty-collection semantics.
- `@throws` — on every function that deliberately throws, naming when it throws and what the caller must handle. Quote the error class in backticks, for example `` `QuestionThemeNotFoundError` ``. Guards, pipes, filters, decorators and middleware may state the rejection and status contract in the summary instead when the framework raises the exception.
- `@remarks` — invariants, lifecycle, mutation boundaries, and Mongoose or transaction constraints that do not fit in the summary.
- `@example` — only when the wiring is not obvious from the signature.
- `@see` — to point at the related guide or symbol instead of duplicating its rules.

### Forbidden content

- Never put types in tags: no `@param {string}`, no `@returns {number}`. TypeScript already owns the types.
- No `@author`, `@since`, `@file` or `@type`, and no decorative separator made of dashes or asterisks.
- Respect the 180-character line limit from [`AGENTS.md`](../AGENTS.md).

### Per-surface expectations

- **`.types.ts`** — document a non-obvious member directly above the member, not in a block above the type.
- **Use cases** — describe the orchestration and the failure behaviour. `@throws` names the error in backticks and states when it is raised, so the HTTP mapping can be predicted without reading the method body.
- **Ports and adapters** — describe the query shape and the Mongo-specific constraints. State the `undefined` return semantics explicitly; a port that returns `undefined` and an adapter that returns `undefined` must agree on why.
- **Mappers** — state the source and target, then the normalization: localization, defaults, and date or `_id` conversion.
- **Rules** — state the invariant each predicate or policy protects, and the error raised by every `ensure*`.
- **Guards, pipes, filters, decorators and middleware** — state the rejection behaviour and the resulting HTTP status code.
- **Published DTO shapes** — the schema-constant block says what the schema validates; the inferred-type block says what consumers receive. Keep the two concise and non-duplicative.

## 3. Examples

### Use case

```ts
/**
 * Reads a single question theme and turns a missing theme into a domain error.
 */
export class FindQuestionThemeByIdUseCase {
  /**
   * Returns the theme matching the id.
   *
   * @throws `QuestionThemeNotFoundError` when no theme matches the id.
   */
  public async getById(id: string): Promise<QuestionTheme> {
    const questionTheme = await this.questionThemeRepository.findById(id);
    if (!questionTheme) {
      throw new QuestionThemeNotFoundError(id);
    }
    return questionTheme;
  }
}
```

### Repository port

```ts
/**
 * Persistence boundary for question themes: domain entities in, domain entities out.
 */
type QuestionThemeRepository = {
  /**
   * Returns `undefined` when no document matches, so the caller decides whether that is an error.
   */
  findById: (id: string) => Promise<QuestionTheme | undefined>;

  /**
   * `limit` is a maximum count: `undefined` or `0` retrieves the full filtered set.
   */
  findAll: (options: FindAllOptions<QuestionThemeSortableField, AdminQuestionThemeFilterOptions>) => Promise<QuestionTheme[]>;
};
```

### Repository adapter

```ts
/**
 * Mongoose adapter for `QuestionThemeRepository`.
 *
 * The unique `slug` index is translated into `QuestionThemeSlugAlreadyExistsError`; callers never see a raw `MongoServerError`.
 */
@Injectable()
export class QuestionThemeMongooseRepository implements QuestionThemeRepository {
  /**
   * Returns `undefined` when no document matches the id; unlike `FindQuestionThemeByIdUseCase`, it does not throw.
   */
  public async findById(id: string): Promise<QuestionTheme | undefined> {
    const questionThemeDocument = await this.questionThemeModel.findById(id);
    if (!questionThemeDocument) {
      return undefined;
    }
    return createQuestionThemeFromDocument(questionThemeDocument);
  }
}
```

### Mapper

```ts
/**
 * Maps one localized text to a single string for the requested locale.
 *
 * Falls back to `fallbackLocale`, then to a warning message, so a missing translation never yields an empty string.
 */
function createTranslationFromLocalizedText(localizedText: Partial<LocalizedText>, localizationConfig: LocalizationOptions): string {
  return pickLocalizedValue(localizedText, localizationConfig) ?? getUnknownLocaleWarningMessage(localizationConfig);
}
```

### Domain rule

```ts
/**
 * Protects the theme-archive invariant: a theme referenced by at least one live question must not be archived.
 *
 * @throws `QuestionThemeReferencedByLiveQuestionsError` when `liveQuestionCount` is greater than zero.
 */
function ensureNoLiveQuestionsReferenceTheme(liveQuestionCount: number, questionThemeId: string): void {
  if (liveQuestionCount > 0) {
    throw new QuestionThemeReferencedByLiveQuestionsError(questionThemeId, liveQuestionCount);
  }
}
```

### Guard

```ts
/**
 * Rejects requests without a valid `goat-it-api-key` header with a 401 Unauthorized.
 *
 * The game key is audience-specific: it cannot call admin routes.
 */
@Injectable()
export class GameApiKeyGuard implements CanActivate {
  public constructor(private readonly configService: AppConfigService) {}

  public canActivate(context: ExecutionContext): boolean {
    return canActivateApiKeyGuardHandler(context, this.configService, "game");
  }
}
```

### Exported helper

```ts
/**
 * Tells whether a find-all query is bounded: `undefined` and `0` both mean "return everything".
 */
function hasLimit(limit: FindAllOptions<string>["limit"]): limit is number {
  return limit !== undefined && limit !== 0;
}
```

## 4. Anti-patterns

- **Restating the name and the types** — `/** Returns the question theme. */` on `findById` adds nothing. State the `undefined` semantics or the thrown error instead.
- **Tagged types and filler** — `@param {string} id - The id.` is wrong twice: the type is already inferred, and the description repeats the parameter name.
- **Plain explanatory comments** — `// Build the filter query` above a call to `buildQuestionThemeFilterQuery` is noise. Explain non-obvious intent in a JSDoc block, or rename the code so it explains itself.
- **Duplicated constant and inferred-type blocks** — do not paste the same sentence on the schema constant and on the inferred type. The constant describes validation; the type describes what consumers receive.
- **Documenting out-of-scope surfaces** — no JSDoc on controllers, DTO wrappers or domain error classes. The `@throws` block on the throwing logic surface is the contract for an error class.
- **Decorative blocks** — no banner comments, no `@author`, no changelog entries in source; Git already carries that history.

## 5. Enforcement and review

- **Shape is linted.** Oxlint validates every JSDoc block through its `jsdoc` plugin: tag and property names, tags that must stay empty, and missing descriptions on `@param`, `@returns`, `@throws` and `@yields`. `@remarks` is enabled through `definedTags` in `oxlint.config.jsonc`, so it is not reported as an unknown tag.
- **Presence is reviewed.** Oxlint has no `require-jsdoc`-style presence rule, so an undocumented surface does not fail `pnpm run lint:oxlint` by itself. Presence is enforced by code review and by the GOAT audit check `[CODE-46]`.
- **The quality rules apply everywhere.** Pre-existing blocks in tests and other out-of-scope files still follow these rules: when the linter surfaces a malformed tag, fix the block instead of disabling the rule.
- **Final checklist** before requesting review:
  - every required surface from §1 has its block;
  - every block adds semantics that the signature does not already carry;
  - no `{Type}`, `@author`, `@since` or `@file`;
  - no plain explanatory `//` comments;
  - `pnpm run lint:oxlint` passes.

Related: file placement in [`architecture.md`](architecture.md), test conventions in [`unit-tests.md`](unit-tests.md), and workflow rules in [`AGENTS.md`](../AGENTS.md).
