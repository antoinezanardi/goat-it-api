---
description: Run a fast CI-like validation locally before creating a PR.
agent: build
---

Run either a fast or full CI-like validation locally before pushing code.

Quick commands:

```bash
# Fast local CI validation
pnpm run lint && pnpm run typecheck && pnpm run test:unit:cov

# Full CI validation (includes acceptance and mutation tests)
pnpm run lint && pnpm run typecheck && pnpm run test:unit:cov && pnpm run test:acceptance && pnpm run test:mutation
```

What this does:

- `pnpm run lint`: Lints the codebase to ensure coding standards are met.
- `pnpm run typecheck`: Runs TypeScript type checking to catch type errors.
- `pnpm run test:unit:cov`: Executes unit tests with coverage enforcement.
- `pnpm run test:acceptance`: Runs acceptance (end-to-end) tests against a real app binary and test database.
- `pnpm run test:mutation`: Performs mutation testing to assess test suite robustness.

Notes:

- For faster typechecks during development, consider running a targeted tsconfig (e.g., `tsgo -p configs/typescript/tsconfig.app.json`).
