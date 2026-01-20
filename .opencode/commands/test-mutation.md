---
description: Run Stryker mutation testing in incremental or full mode.
agent: build
---

Run mutation tests with Stryker to evaluate the effectiveness of the unit test suite.

Prerequisites:

- Node.js: use the project's engine version (recommended in package.json).
- pnpm: this repository uses `pnpm` as the package manager.
- Stryker configuration present in `configs/stryker/stryker.config.mjs`.

Quick commands:

```bash
# Incremental (fast when incremental cache is present)
pnpm run test:mutation

# Full run (expensive; clears incremental cache)
pnpm run test:mutation:force
```

What this does:

- Runs Stryker mutation testing (may be slow). Prefer `pnpm run test:mutation` for everyday checks.
- If Stryker updates `tests/mutation/incremental/incremental.json`, review and commit the change so CI can reuse the cache.

Notes:

- Mutation testing is CPU- and time-intensive; run on a powerful machine or in CI.
- Use `--file` or Stryker filters (if configured) to limit the scope when iterating on a specific module.
