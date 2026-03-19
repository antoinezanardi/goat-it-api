---
name: create-mock
description: Scaffold a typed Vitest mock factory for a repository port, use-case, or service following Goat It API conventions, including correct placement, vi.fn() typing and overrides pattern.
disable-model-invocation: true
---

## What I do

- Determine the correct file path under `tests/unit/utils/mocks/` by mirroring the source path
- Generate a typed `createMocked<X>` factory using `vi.fn()` with an `overrides` parameter
- Keep mocks at the port/interface level (not internal Mongoose details)
- Remind you of anti-patterns and the checklist before finishing

## When to use me

- A new repository interface, use-case, or service was added and tests need a typed mock
- An inline `vi.fn()` setup inside a spec should be extracted into a reusable shared factory
- You need a mock that can be easily overridden per-test to simulate errors or edge cases

## Placement rules

Base folder: `tests/unit/utils/mocks/`

Mirror the **source** path exactly:

| Source location                                                    | Mock location                                                                                               |
|--------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------|
| `src/contexts/<ctx>/…/repositories/foo.repository.types.ts`        | `tests/unit/utils/mocks/contexts/<ctx>/infrastructure/persistence/mongoose/foo.mongoose.repository.mock.ts` |
| `src/contexts/<ctx>/…/use-cases/create-foo/create-foo.use-case.ts` | `tests/unit/utils/mocks/contexts/<ctx>/application/use-cases/create-foo.use-case.mock.ts`                   |
| `src/infrastructure/…/foo.service.ts`                              | `tests/unit/utils/mocks/infrastructure/…/foo.service.mock.ts`                                               |

File suffix: `.mock.ts`
Factory name: `createMocked<WhatIsBeingMocked>` (camelCase, no default export)

## Implementation pattern

```typescript
import type { Mock } from "vitest";

import type { FooRepository } from "@question/domain/repositories/foo.repository.types";

// 1. Stub type — mirrors the port interface exactly
type FooRepositoryStub = {
  findAll: () => Promise<Foo[]>; findById: (id: string) => Promise<Foo | undefined>; create: (payload: FooCreationPayload) => Promise<Foo | undefined>;
};

// 2. Mocked type — each method wrapped in Vitest Mock<>
type MockedFooRepository = { [K in keyof FooRepositoryStub]: Mock<FooRepositoryStub[K]> };

// 3. Factory with optional overrides
function createMockedFooRepository(overrides: Partial<MockedFooRepository> = {}): MockedFooRepository {
  return {
    findAll: vi.fn<FooRepositoryStub["findAll"]>().mockResolvedValue([]),
    findById: vi.fn<FooRepositoryStub["findById"]>().mockResolvedValue(undefined),
    create: vi.fn<FooRepositoryStub["create"]>().mockResolvedValue(undefined), ...overrides,
  };
}

export { createMockedFooRepository };
export type { MockedFooRepository };
```

Key rules:

- `vi` is a global — no need to import it
- `overrides` is always the **last** spread
- Default return values must match the method's return type (use faketories from `@faketories/*` for realistic defaults)
- Mock the **port** (interface), not the Mongoose model internals — except in repository unit tests

## Inject in tests via Nest testing module

```typescript
import { createMockedFooRepository } from "@mocks/contexts/question/infrastructure/persistence/mongoose/foo.mongoose.repository.mock";

const mocks = { repositories: { foo: createMockedFooRepository() } };

const module = await Test.createTestingModule({
  providers: [
    FooUseCase,
    {
      provide: FOO_REPOSITORY_TOKEN,
      useValue: mocks.repositories.foo
    },
  ],
}).compile();
```

## Override per test

```typescript
// Simulate not found
mocks.repositories.foo.findById.mockResolvedValueOnce(undefined);

// Simulate error
mocks.repositories.foo.create.mockRejectedValueOnce(new Error("db error"));

// Or pass at creation time
const failingRepo = createMockedFooRepository({
  create: vi.fn().mockRejectedValue(new Error("db error")),
});
```

## Mocking level by file type

| File type under test | What to mock                                                        |
|----------------------|---------------------------------------------------------------------|
| Use-case             | Repository ports via injection tokens                               |
| Controller           | Use-case classes via `useValue` providers                           |
| Repository           | Mongoose `Model` methods (`find`, `findOne`, `create`, `updateOne`) |
| Guard / Pipe         | Collaborating services via `useValue`                               |

## Checklist before committing

1. File placed under `tests/unit/utils/mocks/` mirroring the source path
2. Imports use path aliases — no relative imports
3. Single named export `createMocked<X>`, no default export
4. `overrides: Partial<MockedX> = {}` parameter, spread last
5. All methods wrapped with `vi.fn<StubType["method"]>()`
6. Default return values are typed and realistic (use faketories where helpful)
7. Run checks:
   ```bash
   pnpm run lint && pnpm run typecheck && pnpm run test:unit:cov
   ```

## Anti-patterns to avoid

- Mocking implementation internals (Mongoose schemas, private methods) from use-case or controller tests
- Creating factory variants inline in tests when a reusable override would suffice
- Returning inconsistent shapes from the same factory
- Performing side-effects (DB, network) inside mock factories

## Reference

- Full conventions and examples: `tests/unit/utils/mocks/README.md`
- Pointer doc: `docs/MOCKS.md`
- Related skill: `create-faketory` (for test data, as opposed to behaviour mocks)
- Existing mocks to copy from:
  - `tests/unit/utils/mocks/contexts/question/infrastructure/persistence/mongoose/question.mongoose.repository.mock.ts`
  - `tests/unit/utils/mocks/contexts/question/modules/question-theme/application/use-cases/get-question-themes-by-ids-or-throw.use-case.mock.ts`
