---
name: write-acceptance-test
description: Write or complete a Cucumber/Gherkin acceptance test scenario for any feature in the Goat It API, following the conventions in docs/acceptance-tests.md (fixtures, payloads, step definitions, DataTable schemas, locale helpers).
disable-model-invocation: true
---

## What I do

- Identify the feature, audience (admin/public/app) and domain to determine the correct file locations.
- Write or complete `.feature` files with properly tagged, fully ordered scenarios.
- Add or reuse fixture sets and register them in `FIXTURE_REGISTRY`.
- Add or reuse payload constants and register them in `PAYLOADS`.
- Write `Given`, `When`, `Then` step definitions following the naming and regex conventions.
- Define DataTable schemas with `z.strictObject` + `zCoerceOptional*` helpers.
- Write step helpers (pure assertion functions) for non-trivial Then assertions.
- Run `pnpm run test:acceptance` until the suite is green.

## When to use me

- A new HTTP endpoint needs BDD coverage from feature file to step definitions.
- An existing feature scenario is missing validation-error or boundary-case coverage.
- Fixture sets or payloads need to be added for a new domain.

## Golden rule

**Always read `docs/acceptance-tests.md` before writing or completing any acceptance test.** It owns the lifecycle, World, feature/step/fixture/payload templates and the override DataTable format. This skill only adds the project-specific deltas and the file-naming table below.

## Lifecycle (verified in `tests/acceptance/support/hooks.ts`)

1. **BeforeAll**: loads `env/.env.test`, sets the per-worker server port and database name, connects MongoDB, spawns the app. The build is produced by the `test:acceptance` script **before** Cucumber starts — the hooks do not build.
2. **Before** (each scenario): drops and recreates all MongoDB collections; attaches `appProcess` to the world.
3. **After** (each failing scenario only): prints the app log tail and the world debug dump.
4. **AfterAll**: disconnects MongoDB and kills the app process.

## File naming conventions

| File type | Location | Naming pattern |
|---|---|---|
| Admin feature | `tests/acceptance/features/contexts/<domain>/admin/` | `<action>-<entity>-as-admin.feature` |
| Public feature | `tests/acceptance/features/contexts/<domain>/public/` | `<action>-<entity>.feature` |
| App feature | `tests/acceptance/features/app/` | `app-<feature>.feature` |
| Given steps | `tests/acceptance/features/step-definitions/contexts/<domain>/<audience>/` | `<domain>[-<sub>].given-steps.ts` |
| When steps | same | `<domain>[-<sub>].when-steps.ts` |
| Then steps | same | `<domain>[-<sub>].then-steps.ts` |
| DataTable schemas | same, `datatables/` subfolder | `<domain>.datatables.schemas.ts` with constants ending `_DATATABLE_ROW_SCHEMA` |
| Step helpers | same, `helpers/` subfolder | `<domain>.steps.helpers.ts` |
| Fixture set | `tests/acceptance/support/fixtures/<domain>/sets/` | `<set-name>.fixture-set.ts` |
| Fixture index | `tests/acceptance/support/fixtures/<domain>/` | `<domain>.fixtures.ts` |
| Payload | `tests/acceptance/support/payloads/<domain>/<type>/` | `<name>-<domain>.<type>-payload.ts` |

## Project-specific deltas

- Feature titles follow the audience pattern: `Feature: Create Question as Admin`, `Feature: List Questions`, `Feature: App Health`. Scenario names use present-participle phrasing (`Creating a question...`, `Trying to create a question...`).
- Scenario steps: `Given` → `And` → `When` → `And` → `Then` → `And`; no `Background`, no `But`, no `Scenario Outline`.
- Step functions declare `this: GoatItWorld`; regexes are anchored with `^`/`$`, end with `/u`, and use named capture groups.
- Every step that receives a `DataTable` validates it through a Zod schema before reading rows.
- Fixture sets are deterministic (no `faker`, `Math.random()` or `Date.now()`) and end with `as const satisfies ReturnType<typeof createFake...>[]`; ids use `createFakeObjectId("<hex>")`.
- Payloads are `Object.freeze(createFake...({ ...deterministic overrides }))`, reference fixture `_id`s with `.toString()`, and are registered in `PAYLOADS`.
- DataTable row schemas are `z.strictObject`; optional columns use `zCoerceOptional*`; required numeric columns use `z.coerce.number()`.
- No `switch`/`case` in steps or helpers (repository-wide convention).

The full templates, World API, override DataTable format and fixture registry mechanics are in `docs/acceptance-tests.md` — use them from there instead of re-deriving them.

## Checks to run when done

```bash
pnpm run test:acceptance   # requires Docker services; builds first
pnpm run typecheck
pnpm run lint
```

`.opencode/commands/lint-acceptance-tests.md` §4 is the **final audit checklist** (`[AU*]`, `[FT*]`, `[ST*]`, `[DS*]`, `[FS*]`, `[PL*]`, `[SH*]`). Verify the written files against it before considering work complete.

## Reference

- **Primary authoritative guide (read first):** `docs/acceptance-tests.md`
- Lifecycle and World: `tests/acceptance/support/hooks.ts`, `tests/acceptance/support/types/world.types.ts`
- Fixture registry: `tests/acceptance/support/fixtures/constants/fixture.constants.ts`
- Payload registry: `tests/acceptance/support/payloads/constants/payload.constants.ts`
- Shared steps: `tests/acceptance/features/step-definitions/shared/request/`
- DataTable helpers: `tests/acceptance/support/helpers/datatable.helpers.ts`
- Architecture and data flow: `docs/architecture.md` (read before creating or moving any file)
- Faketory conventions: `docs/faketories.md`
