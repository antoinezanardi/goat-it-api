---
name: create-faketory
description: Scaffold a new faketory (test data factory) for a domain entity, DTO, command, or Mongoose document following Goat It API conventions, including correct placement, typing, faker usage and export style.
disable-model-invocation: true
---

## What I do

- Determine the correct file path under `tests/shared/utils/faketories/` by mirroring the source path
- Generate a typed factory function using `@faker-js/faker` with an `overrides` parameter
- Ensure the factory is pure, correctly exported, and passes lint/typecheck
- Remind you of anti-patterns and the checklist before finishing

## When to use me

- A new domain entity, DTO, command, or Mongoose document was added and needs a faketory
- An existing inline test object should be extracted into a reusable shared factory
- You need realistic, randomized test data that still allows deterministic overrides

## Placement rules

Base folder: `tests/shared/utils/faketories/`

Mirror the **source** path, replacing the layer segment with its faketory category:

| Source location                                         | Faketory location                                                                                   |
|---------------------------------------------------------|-----------------------------------------------------------------------------------------------------|
| `src/contexts/<ctx>/…/domain/entities/foo.types.ts`     | `tests/shared/utils/faketories/contexts/<ctx>/<feature>/entity/foo.entity.faketory.ts`              |
| `src/contexts/<ctx>/…/application/dto/foo.dto.shape.ts` | `tests/shared/utils/faketories/contexts/<ctx>/<feature>/dto/foo.dto.faketory.ts`                    |
| `src/contexts/<ctx>/…/domain/commands/foo.commands.ts`  | `tests/shared/utils/faketories/contexts/<ctx>/<feature>/commands/foo.commands.faketory.ts`          |
| `src/contexts/<ctx>/…/persistence/mongoose/…`           | `tests/shared/utils/faketories/contexts/<ctx>/<feature>/mongoose/foo.mongoose-document.faketory.ts` |
| `src/shared/…`                                          | `tests/shared/utils/faketories/shared/…`                                                            |

File suffix: `.faketory.ts`
Export function name: `createFake<EntityName>` (camelCase, no default export)

## Implementation pattern

```typescript
import { faker } from "@faker-js/faker";

import { FOO_STATUSES } from "@question/domain/value-objects/foo-status/foo-status.constants";

import type { Foo } from "@question/domain/entities/foo.types";

function createFakeFoo(overrides: Partial<Foo> = {}): Foo {
  return {
    id: faker.database.mongodbObjectId(),
    status: faker.helpers.arrayElement(FOO_STATUSES),
    name: faker.lorem.words(2),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(), ...overrides,
  };
}

export { createFakeFoo };
```

Key rules:

- `overrides` is always the **last** spread — it wins over all defaults
- Use `faker.database.mongodbObjectId()` for `id` / `_id` fields
- Use `faker.helpers.arrayElement(MY_CONSTANTS)` to pick from domain constant arrays
- Randomize **optional** fields that are not commonly asserted (`faker.datatype.boolean()` guard)
- Keep optional fields that **are** commonly asserted always present

## Faketory categories

| Folder       | Use for                                      |
|--------------|----------------------------------------------|
| `entity/`    | Full domain entity objects                   |
| `dto/`       | DTO shapes (must satisfy Zod validators)     |
| `commands/`  | Command objects passed to use-cases          |
| `mongoose/`  | Raw Mongoose document shapes (include `_id`) |
| `contracts/` | Cross-layer contract/interface shapes        |

Shared building blocks go in:
`tests/shared/utils/faketories/contexts/<ctx>/shared/<parts>.faketory.ts`

## Import in tests

```typescript
import { createFakeFoo } from "@faketories/contexts/question/foo/entity/foo.entity.faketory";

const foo = createFakeFoo({ id: "60af924f4f1a2563f8e8b456" });
```

## Checklist before committing

1. File placed under `tests/shared/utils/faketories/` mirroring the source path
2. Imports use path aliases (`@question/*`, `@shared/*`, `@faketories/*`) — no relative imports
3. Single named export `createFake<X>`, no default export
4. `overrides: Partial<T> = {}` parameter, spread last
5. All fields populated with `@faker-js/faker` values
6. Factory is pure — no DB calls, no network, no side effects
7. Run checks:
   ```bash
   pnpm run lint && pnpm run typecheck && pnpm run test:unit:cov
   ```

## Anti-patterns to avoid

- Hardcoding values that callers may want to override
- Omitting fields that the type requires (TypeScript will catch this)
- Returning different shapes from the same factory across calls (e.g. `Set` vs `string[]`)
- Performing side effects inside the factory

## Reference

- Full conventions and examples: `tests/shared/utils/faketories/README.md`
- Pointer doc: `docs/FAKETORIES.md`
- Path alias registration (new contexts): `configs/swc/swc.config.json`, `configs/typescript/tsconfig.app.json`, `configs/vitest/vitest.config.ts`
- Existing faketories to copy from:
  - `tests/shared/utils/faketories/contexts/question/entity/question.entity.faketory.ts`
  - `tests/shared/utils/faketories/contexts/question/question-theme/entity/question-theme.entity.faketory.ts`
  - `tests/shared/utils/faketories/shared/locale/locale.faketory.ts`
