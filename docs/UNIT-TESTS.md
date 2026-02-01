# Unit Tests Guide (unit-level)

This document points to `tests/unit/README.md` that contains the detailed "How To" and repository-specific examples. It briefly describes where unit tests live and the coverage/mutation expectations.

- Tests are colocated under `src/` as `*.spec.ts` files; helpers, mocks and faketories live under `tests/`.
- Runner: Vitest. Coverage: V8 provider with 100% thresholds enforced. Mutation testing: Stryker (incremental mode available).

See `tests/unit/README.md` for the full writing guidelines per file type (controllers, use-cases, repositories, mappers, pipes, guards, filters, helpers).
