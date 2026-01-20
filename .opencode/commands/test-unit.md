---
description: Run unit tests with Vitest and related helpers.
agent: build
---

Run the project's unit tests (Vitest). This command executes the test suite using the repository's test config and environment.

Ensure all tests pass and coverage thresholds (100%) are met.

Prerequisites:

- Node.js: use the project's engine version (recommended in package.json).
- pnpm: the repository uses `pnpm` as the package manager.

Quick commands:

```bash
# Run unit tests with coverage (CI-quality; enforces 100% coverage)
pnpm run test:unit:cov

# Watch mode for development feedback
pnpm run test:unit:watch
```

What this does:

- `pnpm run test:unit:cov` runs the same tests with coverage enabled; this repo enforces `100%` coverage in CI so address any coverage regressions before merging.
- `pnpm run test:unit:watch` runs tests in watch mode for local TDD workflows.

Post-run checklist:

- If tests fail, inspect the failing test output and stack traces to identify the cause.
- If autofixable issues appear in tests (linters, formatting), run the appropriate lint commands (`pnpm run lint:fix`).
- If coverage drops, add tests or adjust implementation — the project requires full coverage for unit tests.
- Mutation tests will be run afterward, so ensure tests are robust enough to catch potential issues.
