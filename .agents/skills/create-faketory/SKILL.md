---
name: create-faketory
description: Scaffold a new faketory (test data factory) for a domain entity, DTO, command, contract, or Mongoose document following Goat It API conventions, including correct placement, typing, faker usage and export style.
disable-model-invocation: true
---

## What I do

1. Identify the source type (entity, DTO, command, contract, Mongoose document) from the input.
2. Derive the correct faketory file path under `tests/shared/utils/faketories/` by mirroring the source path.
3. Generate the typed factory function(s) using `@faker-js/faker` with an `overrides` parameter.
4. Ensure the file is pure, uses path aliases, has no default export, and passes lint/typecheck.
5. Run the checklist before finishing.

## When to use me

- A new domain entity, DTO, command, contract, or Mongoose document was added and needs a faketory.
- An existing inline test object should be extracted into a reusable shared factory.
- You need realistic, randomized test data that still allows deterministic overrides.

## Placement rules

Base folder: `tests/shared/utils/faketories/`

Mirror the **source** path, replacing the layer segment with the faketory category:

| Source location                                                | Faketory path                                                                                                                     |
|----------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|
| `src/contexts/<ctx>/…/domain/entities/foo.types.ts`            | `tests/shared/utils/faketories/contexts/<ctx>/<feature>/entity/foo.entity.faketory.ts`                                            |
| `src/contexts/<ctx>/…/application/dto/foo.dto.shape.ts`        | `tests/shared/utils/faketories/contexts/<ctx>/<feature>/dto/foo.dto.faketory.ts`                                                  |
| `src/contexts/<ctx>/…/domain/commands/foo.commands.ts`         | `tests/shared/utils/faketories/contexts/<ctx>/<feature>/commands/foo.commands.faketory.ts`                                        |
| `src/contexts/<ctx>/…/domain/contracts/foo.contracts.ts`       | `tests/shared/utils/faketories/contexts/<ctx>/<feature>/contracts/foo.contracts.faketory.ts`                                      |
| `src/contexts/<ctx>/…/persistence/mongoose/…` (document)       | `tests/shared/utils/faketories/contexts/<ctx>/<feature>/mongoose/mongoose-document/foo.mongoose-document.faketory.ts`             |
| `src/contexts/<ctx>/…/persistence/mongoose/…` (insert payload) | `tests/shared/utils/faketories/contexts/<ctx>/<feature>/mongoose/mongoose-insert-payload/foo.mongoose-insert-payload.faketory.ts` |
| `src/shared/…`                                                 | `tests/shared/utils/faketories/shared/…`                                                                                          |
| `src/infrastructure/…`                                         | `tests/shared/utils/faketories/infrastructure/…`                                                                                  |

File suffix: `.faketory.ts`
Export function name: `createFake<ConceptName>` (PascalCase concept, camelCase function — no default export)

## Implementation pattern

### Standard factory (entity, DTO, command, contract)

```typescript
import { faker } from "@faker-js/faker";

import { FOO_STATUSES } from "@question/domain/value-objects/foo-status/foo-status.constants";

import type { Foo } from "@question/domain/entities/foo.types";

function createFakeFoo(overrides: Partial<Foo> = {}): Foo {
  return {
    id: faker.database.mongodbObjectId(),
    status: faker.helpers.arrayElement(FOO_STATUSES),
    name: faker.lorem.words(2),
    context: faker.helpers.maybe(faker.lorem.sentence),   // optional field
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(), ...overrides,
  };
}

export { createFakeFoo };
```

### Mongoose document factory

Mongoose document faketories produce stub objects that include both `_id: Types.ObjectId` and
`id: string`. The `id` is always derived from `_id` so they stay in sync:

```typescript
import { faker } from "@faker-js/faker";

import { createFakeObjectId } from "@faketories/infrastructure/database/database.faketory";

import type { FooMongooseDocumentStub } from "@mocks/contexts/question/…/foo.mongoose.types.mock";

function createFakeFooDocument(overrides: Partial<FooMongooseDocumentStub> = {}): FooMongooseDocumentStub {
  const documentId = overrides._id?.toString() ?? faker.database.mongodbObjectId();
  return {
    _id: createFakeObjectId(documentId),
    id: documentId, // ...other fields...
    ...overrides,
  };
}

export { createFakeFooDocument };
```

### Discriminated union factory

When the shape depends on a discriminant field, read the discriminant from `overrides` first, then
build the object conditionally. Never mutate the `overrides` parameter:

```typescript
function createFakeFooAuthor(overrides: Partial<FooAuthor> = {}): FooAuthor {
  const role = overrides.role ?? faker.helpers.arrayElement(FOO_AUTHOR_ROLES);

  if (role === "game") {
    return {
      role,
      gameId: ("gameId" in overrides ? overrides.gameId : undefined) ?? faker.database.mongodbObjectId(),
      name: overrides.name ?? faker.helpers.maybe(faker.person.fullName),
    };
  }
  return {
    role,
    name: overrides.name ?? faker.helpers.maybe(faker.person.fullName),
  };
}
```

### Multiple factories in one file

Group related sub-factories in a single file and export them together:

```typescript
function createFakeFooContent(overrides: Partial<FooContent> = {}): FooContent { …
}

function createFakeFooAuthor(overrides: Partial<FooAuthor> = {}): FooAuthor { …
}

function createFakeFoo(overrides: Partial<Foo> = {}): Foo { …
}

export { createFakeFooContent, createFakeFooAuthor, createFakeFoo };
```

## Faker cheat-sheet

| Use case                                  | Expression                                                                          |
|-------------------------------------------|-------------------------------------------------------------------------------------|
| String MongoDB id                         | `faker.database.mongodbObjectId()`                                                  |
| `Types.ObjectId`                          | `createFakeObjectId()` from `@faketories/infrastructure/database/database.faketory` |
| Pick from domain constant array           | `faker.helpers.arrayElement(MY_CONSTANTS)`                                          |
| Required boolean                          | `faker.datatype.boolean()`                                                          |
| Optional field (present ~50% of the time) | `faker.helpers.maybe(() => …)`                                                      |
| Optional field using an existing factory  | `faker.helpers.maybe(createFakeLocalizedText)`                                      |
| Unique URL array                          | `faker.helpers.uniqueArray(() => faker.internet.url(), 2)`                          |
| Random subset of a list                   | `faker.helpers.arrayElements(["GET", "POST", "PUT"])`                               |
| Entity dates                              | `faker.date.past()` / `faker.date.recent()`                                         |
| Mongoose document dates                   | `faker.date.anytime()`                                                              |
| DTO date strings                          | `faker.date.anytime().toISOString()`                                                |
| `Set<string>` field                       | `new Set(faker.helpers.uniqueArray(() => faker.internet.url(), 2))`                 |

**Do not** use `faker.datatype.boolean()` to randomly include/exclude an optional field — use
`faker.helpers.maybe` for that purpose.

## Import order inside a faketory file

1. External packages (`@faker-js/faker`, `mongoose`, `vitest`)
2. Internal source aliases (`@question/*`, `@shared/*`, `@src/*`)
3. Faketory/mock aliases (`@faketories/*`, `@mocks/*`)
4. Type imports last (`import type { … }`)

## Checklist before committing

1. File placed under `tests/shared/utils/faketories/` mirroring the source path.
2. All imports use path aliases — no relative `../` imports.
3. Named export(s) only — no default export.
4. `overrides: Partial<T> = {}` parameter, spread last.
5. All required fields populated with `@faker-js/faker` values.
6. Optional fields use `faker.helpers.maybe(…)`.
7. Mongoose documents have both `_id` (ObjectId) and `id` (string) derived together.
8. Discriminated union factories handle every variant without mutating `overrides`.
9. Factory is pure — no DB calls, no network requests.
10. Run: `pnpm lint && pnpm typecheck && pnpm test:unit:cov`

## Anti-patterns

- **Hardcoding domain values** — use `faker.helpers.arrayElement(MY_CONSTANTS)`.
- **Relative imports** — always use path aliases.
- **Default exports** — named exports only.
- **Mutating `overrides`** — read from it, spread it last, never assign to it.
- **Using `faker.datatype.boolean()` for optional presence** — use `faker.helpers.maybe` instead.
- **Mismatched shapes** — do not return `Set` where the type expects `string[]` or vice versa.
- **Side effects** — no DB calls, no HTTP; `vi.fn()` mocks in config/infra faketories are the only exception.

## Reference files

Full conventions: `tests/shared/utils/faketories/README.md`

Existing faketories to copy from:

| Type                   | File                                                                                                                                     |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| Entity                 | `tests/shared/utils/faketories/contexts/question/entity/question.entity.faketory.ts`                                                     |
| Sub-feature entity     | `tests/shared/utils/faketories/contexts/question/question-theme/entity/question-theme.entity.faketory.ts`                                |
| Mongoose document      | `tests/shared/utils/faketories/contexts/question/question-theme/mongoose/mongoose-document/question-theme.mongoose-document.faketory.ts` |
| Insert payload         | `tests/shared/utils/faketories/contexts/question/mongoose/mongoose-insert-payload/question.mongoose-insert-payload.faketory.ts`          |
| DTO (response)         | `tests/shared/utils/faketories/contexts/question/dto/question/question.dto.faketory.ts`                                                  |
| DTO (creation)         | `tests/shared/utils/faketories/contexts/question/dto/question-creation/question-creation.dto.faketory.ts`                                |
| Commands               | `tests/shared/utils/faketories/contexts/question/commands/question.commands.faketory.ts`                                                 |
| Contracts              | `tests/shared/utils/faketories/contexts/question/contracts/question.contracts.faketory.ts`                                               |
| Shared locale          | `tests/shared/utils/faketories/shared/locale/locale.faketory.ts`                                                                         |
| Shared ObjectId helper | `tests/shared/utils/faketories/infrastructure/database/database.faketory.ts`                                                             |
