Faketories (Test Data Factories)
================================

Location
--------

This folder contains project-wide test data factories ("faketories") used by unit and acceptance tests:

`tests/shared/utils/faketories/`

Use path alias imports when referencing them from test code, for example:

```ts
import { createFakeQuestion } from "@faketories/contexts/question/entity/question.entity.faketory";
```

Purpose
-------

- Provide easy, readable, reusable generators for domain entities, DTOs and persistence documents.
- Keep test data realistic and varied (the project prefers randomized values by default to surface hidden assumptions).
- Centralize factory helpers to reduce duplication and maintenance cost.

Randomness and Reproducibility
-----------------------------

- Faketories produce randomized data using `@faker-js/faker` to help catch brittle tests.

API Conventions
---------------

- Function signature: prefer `createFakeThing(overrides?: Partial<Thing> = {})`.
  - `overrides` lets tests assert on specific fields.
- Factories should create valid objects for normal usage; tests that rely on particular values must pass them via `overrides`.

Organization and Shared Pieces
------------------------------

- Keep factories close to the feature they support. Typical layout (already used in the repo):

  ```text
  tests/shared/utils/faketories/
    contexts/<context>/
      <feature>/
        entity/
        dto/
        mongoose/
        commands/
        contracts/
  ```

- `entity/` - domain entity faketories (use when you need full domain objects used by application logic).
- `dto/` - data transfer object faketories (use for payload shapes defined by DTOs or for controller/service inputs).
- `mongoose/` - MongoDB document/payload faketories (use when you need raw mongoose documents or insert payload shapes).
- `commands/` - command object faketories (use for faketories that produce command objects sent to application use-cases).
- `contracts/` - contract/interface faketories (use for interface-shaped payloads and cross-layer contracts).


- Consolidate common building blocks (for example: content, author, theme-assignment) into a `shared` faketory inside the context to avoid duplication. Suggested path:

  `tests/shared/utils/faketories/contexts/<context>/shared/<parts>.faketory.ts`

Important Design Rules (do not break)
-----------------------------------

1. Always accept `overrides?: Partial<T>` as param. Tests must be able to set explicit values.
2. Do not randomly omit fields that tests commonly assert.
3. Keep factories single-responsibility: produce objects, do not perform DB operations or call external services.
4. Always use realistic data from `faker` (e.g. use `faker.internet.email()` for email fields, not hardcoded strings).
5. For optional fields that tests don't commonly assert, randomize their presence to help tests cover both cases.

Clarification: test reliability takes precedence — if an optional field is commonly asserted by tests, do not randomize its presence; keep it present (or let tests set it explicitly via `overrides`).


Examples
--------

- Create a domain entity with an override:

```ts
import { createFakeQuestion } from "@faketories/contexts/question/entity/question.entity.faketory";

const question = createFakeQuestion({ id: "60af924f4f1a2563f8e8b456" });
```


- Create a mongoose insert payload (different shape):

```ts
import { createFakeQuestionMongooseInsertPayload } from "@faketories/contexts/question/mongoose/mongoose-insert-payload/question.mongoose-insert-payload.faketory";

const payload = createFakeQuestionMongooseInsertPayload({ themes: [{ themeId: "60af..." }] });
```

Anti-patterns to Avoid
----------------------

- Returning inconsistent shapes for the same concept (e.g. one factory returns `Set` while another returns `string[]` with no conversion helper)
- Hardcoding values that tests may want to override.
- Factories that perform side effects (DB calls, network requests, etc).

PR Checklist when touching faketories
-----------------------------------

1. Ensure behavior changes in faketories are covered by the tests that use them (faketories themselves do not require dedicated unit tests and are excluded from coverage).
2. Run `pnpm run test:unit:cov` locally and ensure tests pass.
3. Update this README if you added new public faketory helpers or changed conventions.

Contacts & References
---------------------

- See `AGENTS.md` for repository-level agent and editing rules.
- Update path aliases if you add a new context: `configs/swc/swc.config.json`, `configs/typescript/tsconfig.app.json`, `configs/vitest/vitest.config.ts`.

If you have questions or want help consolidating duplicated faketory parts, open an issue or ping the maintainers.
