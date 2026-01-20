---
description: Create a new faketory (test data factory) for an entity following repository conventions.
agent: build
---

Use this command to scaffold a new faketory for an entity (or DTO/command/mongoose-document) so unit and acceptance tests can rely on consistent, reusable test data.

Why this matters

- The repository keeps test data factories under `tests/shared/utils/faketories/` and mirrors the source folder layout (context → module → artifact).
- Faketories are used everywhere in unit and acceptance tests; following the conventions keeps imports and types consistent and helps reach the required `100%` coverage quickly.

When to use

- You add a new domain entity, DTO, command, or mongoose document and you need a faketory to generate test instances.
- You need a small, deterministic helper to produce realistic test data for specs.

Placement & naming rules

- Base folder: `tests/shared/utils/faketories/`.
- Mirror the source location. Examples:
  - Entity: `src/contexts/question/modules/question-theme/domain/entities/question-theme.types.ts`
    → faketory: `tests/shared/utils/faketories/contexts/question/question-theme/entity/question-theme.entity.faketory.ts`
  - DTO: `src/contexts/question/modules/question/dto/question.dto.ts`
    → faketory: `tests/shared/utils/faketories/contexts/question/dto/question/question.dto.faketory.ts`
  - Shared value object: `src/shared/...`
    → faketory: `tests/shared/utils/faketories/shared/...`.

- File suffix: `.faketory.ts` (keep descriptive prefixes like `entity`, `dto`, `commands`, `mongoose-document`, `contracts` matching existing files).
- Export function name: `createFake<EntityName>` (camel case). Use a single factory per file that returns the concrete TypeScript type.

Type signature & implementation pattern

- Factory signature must accept an optional override object so callers can customize values while keeping defaults realistic:

  const createFakeX = (override: Partial<X> = {}): X => ({ ...defaults, ...override });

- Use `@faker-js/faker` for realistic values and `faker.database.mongodbObjectId()` for `id` fields.
- Use Date helpers for `createdAt` / `updatedAt` (`faker.date.anytime()` or `new Date()`); prefer `faker` for variety.
- Keep the returned object strictly typed to the entity/DTO type using the project's path aliases (example uses `@question/*` or `@shared/*`).

Minimal template (copy + adapt)

```typescript
// info: TypeScript faketory template
import { faker } from "@faker-js/faker";

import type { QuestionTheme } from "@question/modules/question-theme/domain/entities/question-theme.types";

function createFakeQuestionTheme(override: Partial<QuestionTheme> = {}): QuestionTheme {
  return {
    id: faker.database.mongodbObjectId(),
    slug: faker.lorem.slug(),
    label: {
      en: faker.lorem.words(2),
      fr: faker.lorem.words(2),
    },
    status: faker.helpers.arrayElement(["active", "archived"]),
    createdAt: faker.date.anytime(),
    updatedAt: faker.date.anytime(),
    ...override,
  };
}

export { createFakeQuestionTheme };
```

Advanced patterns and variations

- For DTO faketories, return the DTO type and populate fields with values that pass Zod validators (use `zMongoId()` pattern for ids).
- For command faketories (domain commands), name the file `*.commands.faketory.ts` and export `createFake<CommandName>Command`.
- For mongoose-document faketories, follow existing files under `mongoose-document/` and return a plain object shaped like the Mongoose document used in tests (include `_id` where appropriate).

Import examples in tests

```ts
import { createFakeQuestionTheme } from "@faketories/contexts/question/question-theme/entity/question-theme.entity.faketory";

const theme = createFakeQuestionTheme({ slug: "my-slug" });
```

Checklist when adding a faketory

1. Place the file under `tests/shared/utils/faketories/...` mirroring the source path.
2. Use path aliases when importing types (e.g., `@question/*`, `@shared/*`).
3. Export a single factory function named `createFakeX` returning the proper typed object.
4. Accept an `override: Partial<T>` parameter and spread it into the returned object.
5. Use `@faker-js/faker` to populate realistic defaults.
6. Run project checks: `pnpm run lint`, `pnpm run typecheck`, `pnpm run test:unit:cov` and ensure `100%` coverage.

If you need a quick filesystem scaffold

```bash
# Example: scaffold for QuestionTheme
mkdir -p tests/shared/utils/faketories/contexts/question/question-theme/entity
cat > tests/shared/utils/faketories/contexts/question/question-theme/entity/question-theme.entity.faketory.ts <<'TS'
// paste the template above and adapt types/fields
TS
```

Notes & best practices

- Keep faketories small and focused — prefer many small factories over giant multipurpose ones.
- Use faketories from tests (never recreate identical objects inline in many tests).
- Keep naming consistent with the rest of the repository (see existing faketories under `tests/shared/utils/faketories/` for examples).
- If you add a new bounded context, remember to add a path alias in SWC/TS/Vitest configs when necessary (see `AGENTS.md` instructions).

Next steps after creating a faketory

1. Update or create unit tests that use the factory.
2. Run `pnpm run test:unit:cov` and fix coverage gaps.
3. If the factory is shared across contexts, put it under `tests/shared/utils/faketories/shared/`.

Examples to copy from in this repo

- `tests/shared/utils/faketories/contexts/question/question-theme/entity/question-theme.entity.faketory.ts`
- `tests/shared/utils/faketories/contexts/question/dto/question/question.dto.faketory.ts`
- `tests/shared/utils/faketories/shared/locale/locale.faketory.ts`
