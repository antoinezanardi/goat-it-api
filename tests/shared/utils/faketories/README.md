# Faketories (Test Data Factories)

## Location and path alias

All faketories live under:

```
tests/shared/utils/faketories/
```

Import them in test files via the `@faketories/*` path alias:

```ts
import { createFakeQuestion } from "@faketories/contexts/question/entity/question.entity.faketory";
```

## Purpose

Faketories produce ready-to-use, realistically randomized test objects for domain entities, DTOs,
commands, contracts, Mongoose documents, and infrastructure types. They are shared across unit and
acceptance tests to eliminate duplication and keep data realistic by default.

## Directory layout

```
tests/shared/utils/faketories/
  app/                                   # AppMetadata and top-level app shapes
  contexts/
    <context>/                           # One folder per bounded context (e.g. question/)
      aggregate/                         # Mongoose aggregate projections (joined documents)
      commands/                          # Domain command objects passed to use-cases
      contracts/                         # Cross-layer contract / input shapes
      dto/                               # Application-layer DTO shapes
        shared/                          # DTOs reused across multiple sub-features
        <feature>/                       # One sub-folder per DTO group
      entity/                            # Full domain entity objects
      mongoose/
        mongoose-document/               # Mongoose document stubs (include _id + id)
        mongoose-insert-payload/         # Raw insert payloads (no _id / id)
      <sub-feature>/                     # Sub-feature with its own layers (e.g. question-theme/)
        commands/
        contracts/
        dto/
        entity/
        mongoose/
  infrastructure/                        # Config, health, CORS, database helpers
  shared/                                # Cross-context shared shapes (locale, HTTP errors…)
```

Every file is named `<concept>.<category>.faketory.ts`:

| Category                  | Example filename                               |
|---------------------------|------------------------------------------------|
| `entity`                  | `question.entity.faketory.ts`                  |
| `dto`                     | `admin-question.dto.faketory.ts`               |
| `commands`                | `question.commands.faketory.ts`                |
| `contracts`               | `question.contracts.faketory.ts`               |
| `mongoose-document`       | `question.mongoose-document.faketory.ts`       |
| `mongoose-insert-payload` | `question.mongoose-insert-payload.faketory.ts` |

## Function signature

Every factory function follows this exact signature:

```ts
function createFakeConceptName(overrides: Partial<ConceptName> = {}): ConceptName {
  return {
    // ...faker defaults...
    ...overrides,
  };
}
```

Key rules:

- The parameter is named after its role (e.g. `question`, `creationDto`, `overrides`) — either
  name is acceptable, but it must be `Partial<T> = {}`.
- `...overrides` (or the parameter name) is always the **last** spread so it wins over all defaults.
- No default export — use a single named export per function.

## Faker usage patterns

### IDs

```ts
// Domain entity / DTO id (string)
id: faker.database.mongodbObjectId(),

// Mongoose _id (Types.ObjectId) — use the shared helper
import { createFakeObjectId } from "@faketories/infrastructure/database/database.faketory";

  _id: createFakeObjectId(), 
  id: documentId,   // string version derived from _id.toString()
```

### Picking from domain constants

Always use `faker.helpers.arrayElement` with the exported constant array — never hardcode values:

```ts
import { QUESTION_STATUSES } from "@question/domain/value-objects/question-status/question-status.constants";

status: faker.helpers.arrayElement(QUESTION_STATUSES),
```

### Optional fields

Use `faker.helpers.maybe` so the field is randomly present or absent — this surfaces brittle tests
that assume a particular presence:

```ts
  context: faker.helpers.maybe(createFakeLocalizedText), 
  trivia: faker.helpers.maybe(createFakeLocalizedTexts), 
  comment: faker.helpers.maybe(faker.lorem.sentence), 
  color: faker.helpers.maybe(() => faker.color.rgb({ casing: "upper" })),
```

Use `faker.helpers.maybe` only for fields that are genuinely optional on the type. For boolean
fields that are always required, use `faker.datatype.boolean()` directly:

```ts
  isPrimary: faker.datatype.boolean(), 
  isHint: faker.datatype.boolean(),
```

### Arrays

```ts
// Fixed-size unique arrays
sourceUrls: faker.helpers.uniqueArray(() => faker.internet.url(), 2), // Pick a random subset from an explicit set
  methods
:
faker.helpers.arrayElements([
  "GET",
  "POST",
  "PUT",
  "DELETE"
]),
```

### Dates

```ts
  createdAt: faker.date.past(),    // entity — created some time ago
  updatedAt: faker.date.recent(),  // entity — recently updated
  createdAt: faker.date.anytime(), // mongoose document / DTO — any point in time
  // ISO strings in DTOs:
  createdAt: faker.date.anytime().toISOString(),
```

### Sets

Some domain types use `Set<string>` instead of `string[]`:

```ts
sourceUrls: new Set(faker.helpers.uniqueArray(() => faker.internet.url(), 2)),
```

Check the actual TypeScript type before choosing between `Set` and `Array`.

## Conditional shapes (discriminated unions)

When the shape depends on a discriminant field, compute the discriminant first and then build the
rest of the object conditionally. Do **not** mutate the `overrides` parameter:

```ts
// From question.entity.faketory.ts — QuestionAuthor is a discriminated union on `role`
function createFakeQuestionAuthor(questionAuthor: Partial<QuestionAuthor> = {}): QuestionAuthor {
  const role = questionAuthor.role ?? faker.helpers.arrayElement(QUESTION_AUTHOR_ROLES);

  if (role === "game") {
    return {
      role,
      gameId: ("gameId" in questionAuthor ? questionAuthor.gameId : undefined) ?? faker.database.mongodbObjectId(),
      name: questionAuthor.name ?? faker.helpers.maybe(faker.person.fullName),
    };
  }
  return {
    role,
    name: questionAuthor.name ?? faker.helpers.maybe(faker.person.fullName),
  };
}
```

## Multiple exports from one file

A single file may export several related factories when they belong to the same concept:

```ts
// question.entity.faketory.ts exports:
export {
  createFakeQuestionThemeAssignment, createFakeQuestionContent, createFakeQuestionAuthor, createFakeQuestionRejection, createFakeQuestion,
};
```

Keep all exports in a single `export { ... }` block at the bottom of the file.

## Reusing other faketories

Compose faketories instead of duplicating faker calls. Import from the `@faketories/*` alias:

```ts
import { createFakeQuestionTheme } from "@faketories/contexts/question/question-theme/entity/question-theme.entity.faketory";
import { createFakeLocalizedText } from "@faketories/shared/locale/locale.faketory";
```

## Mongoose document faketories

Mongoose document faketories produce stub objects that mirror `HydratedDocument<T>`. They:

- Include both `_id: Types.ObjectId` and `id: string` (derived from `_id.toString()`).
- Derive `id` from the override `_id` when provided, so the two fields stay in sync:

```ts
function createFakeQuestionThemeDocument(overrides: Partial<QuestionThemeMongooseDocumentStub> = {}): QuestionThemeMongooseDocumentStub {
  const documentId = overrides._id?.toString() ?? faker.database.mongodbObjectId();
  return {
    _id: createFakeObjectId(documentId),
    id: documentId, // ...other fields...
    ...overrides,
  };
}
```

Import `createFakeObjectId` from `@faketories/infrastructure/database/database.faketory`.

## Infrastructure faketories

Faketories under `infrastructure/` cover config, health, CORS, and database helpers. Some of
these factories may import `vi` from `vitest` to produce mock functions (e.g. API key validators):

```ts
import { vi } from "vitest";

apiKeyValidator: vi.fn<(receivedApiKey: unknown) => void>(),
```

This is the only permitted side effect inside a faketory.

## Import order inside a faketory file

Follow the project-wide import order:

1. External packages (`@faker-js/faker`, `mongoose`, `vitest`)
2. Internal source aliases (`@question/*`, `@shared/*`, `@src/*`)
3. Faketory aliases (`@faketories/*`, `@mocks/*`)
4. Type imports last (`import type { … }`)

## Anti-patterns

- **Hardcoding domain values** — use `faker.helpers.arrayElement(MY_CONSTANTS)` instead.
- **Relative imports** — always use path aliases.
- **Default exports** — named exports only.
- **Inconsistent shapes** — do not return `Set` in one call and `string[]` in another for the same
  field; match the TypeScript type exactly.
- **Side effects** — no DB calls, no HTTP requests; `vi.fn()` mocks in config faketories are the
  only accepted exception.
- **Mutating the `overrides` parameter** — read from it, spread it last, never assign to it.
- **Omitting required fields** — TypeScript will catch this, but do not rely on partial objects
  accidentally satisfying the type.

## Checklist when adding or changing a faketory

1. File placed under `tests/shared/utils/faketories/` mirroring the source path.
2. Imports use path aliases — no relative `../` imports.
3. Named export(s) only, no default export.
4. `overrides: Partial<T> = {}` parameter, spread last.
5. All fields populated with `@faker-js/faker` values (or `createFakeObjectId` for ObjectId).
6. Optional fields use `faker.helpers.maybe(...)`.
7. Factory is pure — no DB calls, no network.
8. Run: `pnpm lint && pnpm typecheck && pnpm test:unit:cov`

## References

- `docs/FAKETORIES.md` — short pointer to this file.
- `AGENTS.md` — repository-level conventions.
- Path alias registration when adding a new context: `configs/swc/swc.config.json`,
  `configs/typescript/tsconfig.app.json`, `configs/vitest/vitest.config.ts`.
