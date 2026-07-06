# Unit Tests Guide (unit-level)

This document points to `tests/unit/README.md` that contains the detailed "How To" and repository-specific examples. It briefly describes where unit tests live and the coverage/mutation expectations.

- Tests are colocated under `src/` as `*.spec.ts` files; helpers, mocks and faketories live under `tests/`.
- Runner: Vitest (`isolate: false` for performance — modules are shared across test files in a thread). Coverage: V8 provider with 100% thresholds enforced. Mutation testing: Stryker (incremental mode available).
- Mocking rule: prefer `vi.spyOn()` over `vi.mock()` for module-level functions — `vi.mock()` is unreliable with `isolate: false` when another spec file loads the real module first. See `tests/unit/README.md` for details.

See `tests/unit/README.md` for the full writing guidelines per file type (controllers, use-cases, repositories, mappers, pipes, guards, filters, helpers).
