---
description: Create a test skeleton or complete an existing unit test for a given source file.
agent: build
---

Use this helper when you need to add or finish unit tests for a single source file. The command explains a small, repeatable workflow and provides a copy‑pasteable test skeleton that mirrors this repository's conventions (co‑located `*.spec.ts`, one assertion per test, faketories/mocks, path aliases, naming rules).

When to use

- You have a new module/file and need a test scaffold.
- You started tests but they are incomplete (missing assertions or missing mocks/faketories).

High level steps

1. Identify the source file path (example): `src/contexts/question/modules/question-theme/application/use-cases/create-question-theme/create-question-theme.use-case.ts`.
2. Analyse project patterns by searching for similar test files (e.g., other `*.use-case.spec.ts` files in the same module or nearby).
3. Derive the test path by replacing `.ts` with `.spec.ts` and keeping it colocated: `.../create-question-theme.use-case.spec.ts`.
4. Create the test file if it doesn't exist and add the skeleton below, or open the existing test file to complete it.
5. Replace placeholders: SUT (system under test), dependencies, faketories and mock creators.
6. Write one `it` per observable behaviour and keep exactly one assertion per `it`.
7. Run the checks: `pnpm run test:unit:cov`, `pnpm run lint`, `pnpm run typecheck`.

Test skeleton guidance (what to put where)

- Imports: prefer path aliases defined in the project (`@faketories/*`, `@mocks/*`, `@question/*`, `@shared/*`).
- Faketories: add a small factory under `tests/shared/utils/faketories/...` if none exists. Name helpers `createFake<Entity>`.
- Mocks: add test doubles under `tests/unit/utils/mocks/...` that return `vi.fn()` functions mirroring real repository/use-case signatures.
- SUT construction: inject mocks using the real constructor. Do not mock the SUT itself.
- Naming: test titles must follow `should <expected behaviour> when <condition>.` and be precise.
- Assertions: exactly one `expect(...)` per `it` block. If you need multiple checks, split them into multiple `it` blocks.

Examples from repo style

- Controller tests usually verify status mapping and response DTOs; use faketories and use-case mocks.
- Use-case tests assert repository calls and returned entities.
- Repository tests use Mongoose in-memory documents or mappers and assert mapping correctness.
- The file to test can be a controller, use-case, repository, mapper, or utility test — follow the patterns used in similar files by searching by suffix (`*.controller.spec.ts`, `*.use-case.spec.ts`, etc).

Notes

- Always aim for `100%` coverage; add tests to cover uncovered lines/branches.
- Use a top `describe(...)` block named after the SUT class or function (e.g., `Create Question Theme Use Case`).
- Follow existing patterns in similar test files for structure and naming. Inspect nearby specs for examples.
- Always use faketories to create test data; avoid hardcoding objects inline.
- Use mocks to spy on dependencies and verify interactions (e.g., that a repository method was called with expected args).
- Keep tests isolated; do not share state between tests. Use `beforeEach` to reset mocks if needed.
- Prefer `toStrictEqual` with <expected> objects created via faketories for deep equality checks.
- Use `vi.fn()` to create mock functions and `vi.spyOn(...)` to spy on real implementations when needed.
- When tests are very similar, consider using `it.each` to reduce duplication while keeping one assertion per test case. In that case, you must follow repository patterns, like in `src/contexts/question/application/dto/shared/question-author/question-author.dto.spec.ts`.

Checklist after writing tests (run these commands)

1. `pnpm run test:unit:cov` — ensure `100%` coverage. Fix missing coverage by adding tests.
2. Mutation testing will be run in CI; ensure tests are robust and catch potential issues.
3. `pnpm run typecheck` — fix type errors.
4. `pnpm run lint` — fix lint issues.

When in doubt

- Open an existing spec nearby and mirror its structure (imports, describe/it naming, faketory usage). Example files you can copy from: `src/contexts/question/modules/question-theme/.../*.spec.ts`.
- If the feature is cross-cutting, add shared helpers under `tests/shared/utils/faketories/` and `tests/unit/utils/mocks/` following the repo patterns.
