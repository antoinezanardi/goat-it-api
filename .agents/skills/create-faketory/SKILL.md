---
name: create-faketory
description: Scaffold a new faketory (test data factory) for a domain entity, DTO, command, repository contract, or Mongoose document following Goat It API conventions, including correct placement, typing, faker usage and export style.
disable-model-invocation: true
---

## What I do

1. Identify the source type (entity, DTO, command, repository contract, Mongoose document) from the input.
2. Read `docs/architecture.md` (placement) and `docs/faketories.md` (authoritative conventions) before creating the file.
3. Derive the faketory path from the mapping below, then write the typed factory with an `overrides` parameter.
4. Verify the file with the checks listed at the end.

## When to use me

- A new domain entity, DTO, command, repository contract, or Mongoose document was added and needs a faketory.
- An existing inline test object should be extracted into a reusable shared factory.
- You need realistic, randomized test data that still allows deterministic overrides.

## Placement rules

Base folder: `tests/shared/utils/faketories/`. Mirror the source path, replacing the layer with the faketory category:

| Source location | Faketory path |
|---|---|
| `src/contexts/<ctx>/domain/types/foo.entities.ts` | `tests/shared/utils/faketories/contexts/<ctx>/entity/foo.entity.faketory.ts` |
| `src/contexts/<ctx>/application/dto/<feature>/foo.dto.shape.ts` | `tests/shared/utils/faketories/contexts/<ctx>/dto/<feature>/foo.dto.faketory.ts` |
| `src/contexts/<ctx>/application/commands/foo.commands.ts` | `tests/shared/utils/faketories/contexts/<ctx>/commands/foo.commands.faketory.ts` (optional `<concept>/` subfolder when a command spans several files) |
| `src/contexts/<ctx>/domain/repositories/<aggregate>.repository-contracts.types.ts` | `tests/shared/utils/faketories/contexts/<ctx>/repository-contracts/<concept>/<concept>.repository-contracts.faketory.ts` |
| `src/contexts/<ctx>/contracts/dto/<concept>/<concept>.dto.shape.ts` (published) | `tests/shared/utils/faketories/contexts/<ctx>/contracts/dto/<concept>/<concept>.dto.faketory.ts` |
| `src/contexts/<ctx>/infrastructure/persistence/mongoose/...` (document) | `tests/shared/utils/faketories/contexts/<ctx>/mongoose/mongoose-document/foo.mongoose-document.faketory.ts` |
| `src/contexts/<ctx>/infrastructure/persistence/mongoose/...` (insert payload) | `tests/shared/utils/faketories/contexts/<ctx>/mongoose/mongoose-insert-payload/foo.mongoose-insert-payload.faketory.ts` |
| `src/shared/...` | `tests/shared/utils/faketories/shared/...` |
| `src/infrastructure/...` | `tests/shared/utils/faketories/infrastructure/...` |

File suffix: `.faketory.ts`. Export name: `createFake<ConceptName>` (`PascalCase` concept, `camelCase` function, no default export).

## Minimal shape

```typescript
import { faker } from "@faker-js/faker";

import { FOO_STATUSES } from "@question/domain/constants/foo.constants";

import type { Foo } from "@question/domain/types/foo.entities";

function createFakeFoo(overrides: Partial<Foo> = {}): Foo {
  return {
    id: faker.database.mongodbObjectId(),
    status: faker.helpers.arrayElement(FOO_STATUSES),
    context: faker.helpers.maybe(faker.lorem.sentence), // optional field
    ...overrides,
  };
}

export { createFakeFoo };
```

Project deltas on top of `docs/faketories.md`:

- Path aliases only — no relative imports.
- `overrides` is always the last spread and is never mutated.
- Optional fields use `faker.helpers.maybe` — never `faker.datatype.boolean()` for presence.
- Mongoose document faketories expose both `_id` (`Types.ObjectId`) and `id` (string) derived from the same value.
- Domain constants drive random values: `faker.helpers.arrayElement(MY_CONSTANTS)`.

Directory layout, faker patterns, discriminated unions, Mongoose documents, import order, anti-patterns and the full checklist are owned by `docs/faketories.md` — read it before writing, do not re-derive them here.

## Reference files

| Type | File |
|---|---|
| Entity | `tests/shared/utils/faketories/contexts/question/entity/question.entity.faketory.ts` |
| Sibling-context entity | `tests/shared/utils/faketories/contexts/question-theme/entity/question-theme.entity.faketory.ts` |
| Mongoose document | `tests/shared/utils/faketories/contexts/question-theme/mongoose/mongoose-document/question-theme.mongoose-document.faketory.ts` |
| Insert payload | `tests/shared/utils/faketories/contexts/question/mongoose/mongoose-insert-payload/question.mongoose-insert-payload.faketory.ts` |
| DTO (response) | `tests/shared/utils/faketories/contexts/question/dto/question/question.dto.faketory.ts` |
| DTO (creation) | `tests/shared/utils/faketories/contexts/question/dto/question-creation/question-creation.dto.faketory.ts` |
| Commands | `tests/shared/utils/faketories/contexts/question/commands/question.commands.faketory.ts` |
| Repository contracts | `tests/shared/utils/faketories/contexts/question/repository-contracts/question.repository-contracts.faketory.ts` |
| Published DTO | `tests/shared/utils/faketories/contexts/question-theme/contracts/dto/question-theme/question-theme.dto.faketory.ts` |
| Shared locale | `tests/shared/utils/faketories/shared/locale/locale.faketory.ts` |
| Shared ObjectId helper | `tests/shared/utils/faketories/infrastructure/database/database.faketory.ts` |

## Checks to run when done

```bash
pnpm run lint
pnpm run typecheck
pnpm run test:unit:cov
```

## Reference

- **Authoritative guide (read first):** `docs/faketories.md`
- Architecture and placement: `docs/architecture.md` (read before creating or moving any file)
