---
name: write-unit-test
description: Write or complete a colocated Vitest unit test for any source file in the Goat It API, following the per-file-type conventions in docs/unit-tests.md (controllers, use-cases, repositories, module wiring, DTOs, helpers, errors).
disable-model-invocation: true
---

## What I do

- Identify the source file type and apply the matching template from `docs/unit-tests.md`.
- Instantiate plain use cases with `new`; wire Nest classes with `Test.createTestingModule` and typed mock factories from `@mocks/*`.
- Populate test data with faketories from `@faketories/*`.
- Write focused `it` blocks (one assertion each) covering success paths, error branches and edge cases.
- Ensure the spec compiles and `pnpm run test:unit:cov` stays green at 100%.

## When to use me

- A new source file has no spec yet and needs a skeleton.
- An existing spec is missing assertions, branches, or mock/faketory wiring.
- Coverage is below 100% and you need to add the missing `it` blocks.

## Golden rule

**Always read `docs/unit-tests.md` before writing or completing any test.** It owns the templates and edge-case patterns for every file type (controllers, use-cases, repositories, **module wiring**, DTOs/Zod validators, helpers, errors), plus assertion style and mocking rules. This skill only adds the project-specific deltas below — it does not restate the guide.

## File types and top-level describe labels

- Controllers: `describe(ControllerClass, ...)`, nested `describe(Controller.prototype.method, ...)`.
- Use-cases: `describe(UseCaseClass, ...)`, nested `describe(UseCase.prototype.method, ...)`.
- Repositories: `describe(RepositoryClass, ...)`.
- Services: `describe(ServiceClass, ...)`.
- Modules: `describe(ModuleClass, ...)` — compile the real module graph with mocked Mongoose model tokens (`docs/unit-tests.md` § Module wiring tests).
- DTO shapes: `describe("<DTOName> DTO Shape", ...)` with nested per-field groups.
- Errors: `describe(ErrorClassName, ...)`.
- Helpers/mappers: `describe(functionName, ...)`.

## Project-specific deltas

- Plain use cases: `new UseCase(mockRepository)`. `Test.createTestingModule` is only for Nest classes (controllers, repositories, services, guards, pipes, modules).
- Assertions: one per `it`; `toStrictEqual<T>(expected)`, `toHaveBeenCalledExactlyOnceWith(...)`, `rejects.toThrow(exactErrorInstance)`; typed `it.each<T>([...])` for parameterized cases.
- Private methods: `ClassName["privateMethod"](...)`.
- Mocking modules: the Vitest config uses `isolate: false`, so prefer `vi.spyOn()` on namespace imports over `vi.mock()`, which silently fails if another spec already loaded the real module. Use `vi.mock()` only for third-party modules no other spec imports for real.
- `@package-json`: only importable in specs. Inside `src/`, use `readPackageJson()` from `@shared/infrastructure/helpers/package-json/package-json.helpers`.
- DTO shape specs: `validDto` is an inline literal with a structural type (`let validDto: { ... }`), assigned in `beforeEach`; negative tests spread-copy it. Never use faketories or `as SomeDto` casts.
- Test callbacks (`describe`, `it`, `it.each`, hooks) do not need `: void`; oxlint treats them as void-returning.

## Coverage and mutation

The exclusion lists are authoritative in `configs/vitest/vitest.config.ts` and `configs/stryker/stryker.config.mjs` — read them instead of copying a list. Notes:

- `src/**/mongoose/**/*.schema.ts` is the only schema pattern excluded from coverage; other `*.schema.ts` files (for example `src/infrastructure/api/config/schemas/env.schema.ts`) are not covered by that exclusion.
- `*.module.ts` files are included in coverage and mutation scope: every module needs a colocated `.module.spec.ts`.

## Checks to run when done

```bash
pnpm run test:unit:cov   # must stay at 100%
pnpm run typecheck
pnpm run lint
```

## Final audit checklist

`.opencode/commands/lint-unit-tests.md` §4 is the **final audit checklist** (`[U*]`, `[CT*]`, `[UC*]`, `[RP*]`, `[DT*]`, `[HP*]`, `[ER*]`). Read it and verify the written spec against it before considering the task done — it is authoritative, not a mirror of this skill.

## Reference

- **Primary authoritative guide (read first):** `docs/unit-tests.md`
- Mock conventions: `docs/mocks.md`
- Faketory conventions: `docs/faketories.md`
- Architecture and data flow: `docs/architecture.md` (read before creating or moving any file)
- Coverage config: `configs/vitest/vitest.config.ts`
- Related skills: `create-mock`, `create-faketory`
