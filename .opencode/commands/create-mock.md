---
description: Scaffold a new unit-test mock factory following repository conventions.
agent: build
---

Use this command to scaffold a new reusable mock factory for unit tests. The repo centralizes shared mocks under `tests/unit/utils/mocks/` so tests remain readable and consistent.

Why this matters

- Centralized mocks improve readability and reduce duplication across unit tests.
- Factories with an `overrides` parameter make it trivial to simulate edge cases (not found, errors, alternative return shapes) without inline re-mocks.

When to use

- You're adding a new port (repository interface, use-case interface, external adapter) and need a typed mock for unit tests.
- You want to convert an inline test mock into a shared factory so other tests can reuse it.

Placement & naming rules

- Base folder: `tests/unit/utils/mocks/`.
- Mirror the source location to keep imports intuitive. Examples:
  - Port: `src/contexts/question/modules/question/infrastructure/persistence/question.repository.ts`
    → mock: `tests/unit/utils/mocks/contexts/question/infrastructure/persistence/question.repository.mock.ts`
  - Use-case: `src/contexts/question/modules/question/application/use-cases/create-question.use-case.ts`
    → mock: `tests/unit/utils/mocks/contexts/question/application/use-cases/create-question.use-case.mock.ts`

- File suffix: `.mock.ts`.
- Factory name: `createMocked<EntityOrPortName>` (e.g., `createMockedQuestionRepository`).
- Use `Mocked<EntityName>` type alias for the mapped mock type in the same file.

API signature & implementation pattern

- Always accept `overrides?: Partial<MockedX> = {}` so callers can replace specific methods.
- Prefer the concise direct-return pattern used across the repo:

```ts
import type { Mock } from "vitest";
import type { Question } from "@question/domain/entities/question.types";

type QuestionRepositoryStub = {
  findAll: () => Promise<Question[]>;
  findById: (id: string) => Promise<Question | undefined>;
  create: (payload: unknown) => Promise<Question>;
};

type MockedQuestionRepository = { [K in keyof QuestionRepositoryStub]: Mock<QuestionRepositoryStub[K]> };

function createMockedQuestionRepository(overrides: Partial<MockedQuestionRepository> = {}): MockedQuestionRepository {
  return {
    findAll: vi.fn<QuestionRepositoryStub["findAll"]>().mockResolvedValue([/* ... */]),
    findById: vi.fn<QuestionRepositoryStub["findById"]>().mockResolvedValue(/* default */),
    create: vi.fn<QuestionRepositoryStub["create"]>().mockResolvedValue(/* default */),
    ...overrides,
  };
}

export { createMockedQuestionRepository };
```

Notes

- Use Vitest's global `vi` (no need to import `vi` inside mock files) — tests run with `vi` available globally.
- Keep defaults realistic using faketories (`@faketories/...`) where useful so tests remain meaningful.
- Prefer mocking the public port used by the system under test. Only mock low-level frameworks (Mongoose models) when writing repository unit tests.

Examples

- Simulate not-found in a test:

```ts
const repo = createMockedQuestionRepository({ findById: vi.fn().mockResolvedValue(undefined) });
```

- Simulate error in a use-case mock:

```ts
const createUseCase = createMockedCreateQuestionUseCase({ create: vi.fn().mockRejectedValue(new Error("db error")) });
```

Checklist when adding a mock

1. Place file under `tests/unit/utils/mocks/` mirroring the source path.
2. Export a single factory `createMockedX(overrides?)` returning typed mocks.
3. Use `vi.fn` typed generics for each mock method.
4. Use faketories for default return values when applicable.
5. Run `pnpm run lint`, `pnpm run typecheck`, and `pnpm run test:unit:cov`.

If you need a scaffold snippet committed to a new file, run this command and adapt the generated template.

Reference

- Tests mocks README: `tests/unit/utils/mocks/README.md`
- Faketories README: `tests/shared/utils/faketories/README.md`
