---
description: Create a test skeleton or complete an existing unit test for a given source file.
agent: build
---

Use this helper to create or finish a single colocated unit test file. Do NOT duplicate repository rules already documented in `tests/unit/README.md` — refer to that guide religiously for conventions, examples and coverage/mutation requirements.

When to use

- New source file needs a test scaffold.
- Existing spec is incomplete (missing assertions, missing mocks/faketories, uncovered branches).

Quick workflow

1. Identify the source file and the colocated spec path (replace `.ts` with `.spec.ts`).
2. Read `tests/unit/README.md` and find an existing spec that matches the file type (controller/use-case/repository/dto/helper). Follow its structure exactly.
3. Create or open the spec file and add small focused `it` tests — one assertion per `it` and one behavior per test.
4. Use existing faketories (`@faketories/...`) and mocks (`@mocks/...`) where possible; add them under `tests/shared/utils/faketories/` or `tests/unit/utils/mocks/` only when necessary.
5. Run the local checks: `pnpm run test:unit:cov`, `pnpm run typecheck`, `pnpm run lint`. Fix until green.

What this command does NOT replace

- The detailed per-file-type rules and examples in `tests/unit/README.md` — consult that file first.
- Repository-specific templates and edge-case patterns (Zod DTO metadata assertions, mutation testing expectations) — those live in the guide.

Practical tips (short)

- Keep tests minimal and deterministic; prefer faketories to ad-hoc objects.
- Mock external collaborators (use-cases, repositories, Mongoose `Model` methods) and inject via Nest testing module when required.
- For pure functions/validators, prefer direct calls and `it.each` for multiple input→output cases.
- Name tests: `should <expected behavior> when <condition>.`.

Reference

- Primary source of truth: `tests/unit/README.md` (read it before writing any test).
