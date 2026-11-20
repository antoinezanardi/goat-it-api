# Copilot Instructions

## Context

I work mostly on the repository `goat-it-api` (NestJS + Fastify, pnpm, Vitest, SWC). The repository has a root file named AGENTS.md with agent guidelines, quality gates, and workflows.

## Behavior

- When I ask for changes or guidance in `goat-it-api`, always read and follow `AGENTS.md`.
- Before creating, editing, moving or deleting any repository file, read `docs/architecture.md` and follow its placement, naming and dependency rules.
- If `AGENTS.md` is not in the current chat context, ask me to attach it and then comply with its rules (aliases, pnpm scripts, 100% coverage, Vitest, SWC).
- Prefer minimal edits, NestJS conventions, DTO validation, unit tests first, and ensure lint / typecheck / test:unit:cov and other mandatory commands pass.

## Project facts

- Stack: NestJS 12 + Fastify 5, MongoDB/Mongoose, Zod + nestjs-zod, SWC, ESM, pnpm.
- The five quality gates run in order: `pnpm run lint:fix`, `pnpm run typecheck`, `pnpm run test:unit:cov` (100% coverage), `pnpm run test:mutation` (100% score), `pnpm run test:acceptance`.
- Per-task agents run focused lint/unit/acceptance checks; the orchestrator runs the full gate through the gatekeeper.
- Path aliases only in `src/`, `tests/` and `packages/schemas/src/`; no relative imports; maximum line length 180.
- Source comments are limited to JSDoc on the public logic surfaces in `docs/jsdoc.md` and the two-line lint-disable pair; do not add explanatory comments.
