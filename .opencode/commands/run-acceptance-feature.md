---
description: Run a single acceptance feature (Cucumber) against a running app instance.
agent: build
---

Run a single Cucumber feature file or tag. This is fast for iterating on feature files and step definitions.

Prerequisites:

- Test DB running (test the connection yourself). Use `pnpm run docker:acceptance-tests:start` if needed.

Quick commands:

```bash
# Run a single feature file
pnpm --silent run test:acceptance -- --parallel 1 $ARGUMENTS

# Run by tag
pnpm --silent run test:acceptance -- --tags $ARGUMENTS
```

What this does:

- Executes only the requested feature(s) or tag(s).
- Does not perform a production build when `SKIP_BUILD=true` is set.

Notes:

- Use `--parallel 1` to avoid flaky interactions when running against shared resources.
- Use `pnpm run test:acceptance:skip-build` only when the built app is up-to-date; otherwise, you may test an outdated binary. Useful when iterating on feature files or step definitions.
- If source files change that affect the built app, don't use the skip-build option to ensure the app binary is current.
