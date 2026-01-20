---
description: Run acceptance (end-to-end) tests using Cucumber against a real app binary and test DB.
agent: build
---

Run the project's acceptance (Cucumber) tests. This command builds the app (unless skipped), starts a test MongoDB, launches the built binary and executes Gherkin scenarios.

Prerequisites:

- Node.js: use the project's engine version (recommended in package.json).
- pnpm: the repository uses `pnpm` as the package manager.
- Docker: required to run the test MongoDB used by the acceptance suite.

Quick commands:

```bash
# Full run (builds app, starts DB, runs acceptance suite)
pnpm run test:acceptance

# Skip the build step (use when the app is already built and unchanged between runs)
pnpm run test:acceptance:skip-build
```

What this does:

- Loads test env from `.env.test`.
- Unless `SKIP_BUILD=true` is set, runs `pnpm run build` to produce a production binary used by tests.
- Starts a MongoDB test container (via the project's Docker helper) and connects the acceptance runner to it.
- Launches the built app with `pnpm run start:prod:test` and runs Cucumber scenarios against the running process.
- Generates Cucumber reports (JSON / JUnit) and an HTML report via `pnpm run test:cucumber:html-report`.

Helper Docker commands:

```bash
# Start the DB used by acceptance tests
pnpm run docker:acceptance-tests:start

# Stop the DB containers
pnpm run docker:acceptance-tests:stop

# Restart / reset the DB containers
pnpm run docker:acceptance-tests:reset
```

Post-run checklist:

- If scenarios fail, inspect `tests/acceptance/reports/report.json` and `tests/acceptance/reports/junit.xml` for details.
- Check the app process logs (the acceptance runner prints readiness and failures) to troubleshoot startup or connectivity issues.
- If failures are caused by build regressions, run `pnpm run build` locally and fix compilation or runtime errors.
- If tests fail and the necessary fixes are made only on the acceptance tests side, you can rerun with skipping the build step using `pnpm run test:acceptance:skip-build`.

Notes and troubleshooting:

- Acceptance tests require a running MongoDB instance; use the Docker helpers above or provide an equivalent DB via `.env.test`.
- Use `pnpm run test:acceptance:skip-build` only when the built app is up-to-date; otherwise, you may test an outdated binary.
- The acceptance runner expects the built app to expose the same readiness log line as configured in `src/infrastructure/api/server/server.ts` — changes to startup logs may break readiness detection.
- Running the full acceptance suite may be slower than unit tests; run focused feature files during development with Cucumber tags if needed.
