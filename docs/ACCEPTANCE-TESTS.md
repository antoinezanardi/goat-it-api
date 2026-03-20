# Acceptance Tests Guide

This document points to `tests/acceptance/README.md` that contains the detailed "How To" and repository-specific examples. It briefly describes where acceptance tests live and the runtime expectations.

- Feature files live under `tests/acceptance/features/` as `*.feature` files; support code (hooks, world, fixtures, payloads, helpers) lives under `tests/acceptance/support/`.
- Runner: Cucumber.js with `tsx/cjs` for TypeScript transpilation. Tests run serially against a spawned production build of the app backed by a real MongoDB test database.
- Build: `pnpm test:acceptance`. Set `SKIP_BUILD=true` to skip the NestJS build when `dist/` is already up to date.

See `tests/acceptance/README.md` for the full writing guidelines (lifecycle, GoatItWorld, fixtures, payloads, step definitions, DataTable helpers, locale helpers).
