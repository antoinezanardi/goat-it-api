---
name: create-mock
description: Scaffold a typed Vitest mock factory for a repository port, use-case, or service following Goat It API conventions, including correct placement, vi.fn() typing and overrides pattern.
disable-model-invocation: true
---

## What I do

- Read `docs/architecture.md` (placement) and `docs/mocks.md` (authoritative conventions) before creating the file.
- Derive the correct path under `tests/unit/utils/mocks/` by mirroring the source path.
- Generate a typed `createMocked<X>` factory using `vi.fn()` with an `overrides` parameter.
- Keep mocks at the port/interface level, never at internal Mongoose details.

## When to use me

- A new repository interface, use-case, or service was added and tests need a typed mock.
- An inline `vi.fn()` setup inside a spec should be extracted into a reusable shared factory.
- You need a mock that can be overridden per-test to simulate errors or edge cases.

## Placement rules

Base folder: `tests/unit/utils/mocks/`. Mirror the source path, replacing the layer segment with `mocks`:

| Source location | Mock location |
|---|---|
| `src/contexts/<ctx>/domain/repositories/foo.repository.types.ts` | `tests/unit/utils/mocks/contexts/<ctx>/domain/repositories/foo.repository.mock.ts` |
| `src/contexts/<ctx>/application/use-cases/create-foo/create-foo.use-case.ts` | `tests/unit/utils/mocks/contexts/<ctx>/application/use-cases/create-foo.use-case.mock.ts` |
| `src/infrastructure/.../foo.service.ts` | `tests/unit/utils/mocks/infrastructure/.../foo.service.mock.ts` |

File suffix: `.mock.ts`. Factory name: `createMocked<WhatIsBeingMocked>` (`camelCase`, no default export).

## Minimal shape

```typescript
import type { Mock } from "vitest";

import type { FooRepository } from "@question/domain/repositories/foo.repository.types";

type FooRepositoryStub = {
  findAll: () => Promise<Foo[]>;
  findById: (id: string) => Promise<Foo | undefined>;
};

type MockedFooRepository = { [K in keyof FooRepositoryStub]: Mock<FooRepositoryStub[K]> };

function createMockedFooRepository(overrides: Partial<MockedFooRepository> = {}): MockedFooRepository {
  return {
    findAll: vi.fn<FooRepositoryStub["findAll"]>().mockResolvedValue([]),
    findById: vi.fn<FooRepositoryStub["findById"]>().mockResolvedValue(undefined),
    ...overrides,
  };
}

export { createMockedFooRepository };
export type { MockedFooRepository };
```

Project deltas on top of `docs/mocks.md`:

- `vi` is a global — never import it; only `import type { Mock } from "vitest"`.
- `overrides` is always the last spread.
- Export the `Mocked<What>` type too when tests need to reference the shape (this is allowed — do not suppress it).
- Default returns must match the method signature; use faketories from `@faketories/*` for realistic defaults.
- Mock the **port** in use-case/controller tests; mock the Mongoose `Model` only inside repository specs.
- Plain use cases are instantiated with `new`; only Nest classes use `Test.createTestingModule`.
- The documented `createMockedNestConfigService(appEnv, overrides?)` exception and every other convention are in `docs/mocks.md`.

## Checks to run when done

```bash
pnpm run lint
pnpm run typecheck
pnpm run test:unit:cov
```

## Reference

- **Authoritative guide (read first):** `docs/mocks.md`
- Architecture and placement: `docs/architecture.md` (read before creating or moving any file)
- Related skill: `create-faketory` (test data, as opposed to behaviour mocks)
- Existing mocks to copy from:
  - `tests/unit/utils/mocks/contexts/question/domain/repositories/question.repository.mock.ts`
  - `tests/unit/utils/mocks/contexts/question-theme/application/use-cases/get-question-themes-by-ids-or-throw.use-case.mock.ts`
