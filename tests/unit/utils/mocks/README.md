Mock Factories (Unit Test Mocks)
================================

Location
--------

All shared mock factories used by unit tests live under:

`tests/unit/utils/mocks/`

Use path-alias imports from tests and code when referencing them, for example:

```ts
import { createMockedQuestionRepository } from "@mocks/contexts/question/infrastructure/persistence/mongoose/question.mongoose.repository.mock";
```

Purpose
-------

- Provide reusable, typed mock factories for unit tests (use-cases, controllers, repositories, adapters).
- Keep tests readable by centralizing mock setups and providing easy override points for edge cases.
- Encourage mocking at the domain port level (repository/use-case) instead of deep implementation details (Mongoose internals) when possible.

Key Conventions
---------------

- Factory signature: prefer `createMockedX(overrides?: Partial<MockedX> = {})`.
  - `MockedX` is a mapped type where each function is a `Mock<...>` from Vitest.
  - `overrides` lets tests replace specific methods to simulate errors or alternative scenarios.
- Use Vitest's global `vi` for mocks (the repo provides `vi` globally in test runs). Factories must return typed objects and rely on `vi.fn()` for functions.
- Always return objects that match the public interface used by the system under test (ports), not the internal implementation details.

Factory Implementation Pattern
------------------------------

Preferred minimal pattern used across the repo:

```ts
function createMockedThing(overrides: Partial<MockedThing> = {}): MockedThing {
  return {
    methodA: vi.fn<ThingStub["methodA"]>().mockResolvedValue(defaultA),
    methodB: vi.fn<ThingStub["methodB"]>().mockResolvedValue(defaultB),
    ...overrides,
  };
}
```

Why this pattern?
- It's concise.
- It makes it trivial for tests to override a single method:

```ts
const repo = createMockedQuestionRepository({ findById: vi.fn().mockResolvedValue(undefined) });
```

Examples
--------

- Repository mock (simulate not found):

```ts
const repo = createMockedQuestionRepository({
  findById: vi.fn().mockResolvedValue(undefined),
});

// Inject `repo` into the tested use-case/controller
```

- Use-case mock (simulate throwing an error):

```ts
const useCase = createMockedCreateQuestionUseCase({
  create: vi.fn().mockRejectedValue(new Error("db error")),
});
```

Naming
------

- Factories are named `createMocked<What>()` to make intent explicit and avoid ambiguity with faketory helpers (which use `createFake<Thing>`).
- Mock types follow `Mocked<What>` naming and are exported implicitly by the mock file.

Best Practices
--------------

1. Mock the public port used by the unit under test (for controllers -> use-cases, for use-cases -> repository tokens). Avoid mocking internal implementation unless you are writing repository unit tests.
2. Keep mocks deterministic in their defaults but always allow overrides for edge cases.
3. Make tests explicit about the behavior they expect: use overrides in the test rather than re-mocking inside the test body when possible.
4. Use `vi.fn()` with typed generic to keep the mock signature strictly typed (helps TypeScript and IDEs).
5. Always respect the return type of each method in the mock to avoid type mismatches.

Anti-patterns to Avoid
----------------------

- Creating factory variants inline in tests when a reusable override would do.
- Returning inconsistent shapes from the same factory across the test-suite.
- Performing side-effects (DB, network) inside mock factories.

PR Checklist when touching mocks
-------------------------------

1. Ensure any behavioral changes are covered by unit tests that use the mocks.
2. Keep the `createMockedX(overrides?)` pattern. If you need a different API, update this README first and explain the reasoning in the PR description.
3. Run linters and unit tests locally: `pnpm run lint` and `pnpm run test:unit:cov`.
4. Run type checking and the build: `pnpm run typecheck` and `pnpm run build`.
5. Run mutation tests: `pnpm run test:mutation` (recommended locally; CI will also run mutation tests).

Contacts & References
---------------------

- See `AGENTS.md` for repository editing rules and conventions.
- When adding a new bounded context mock, follow the repo's file layout conventions under `tests/unit/utils/mocks/contexts/<context>/...`.
