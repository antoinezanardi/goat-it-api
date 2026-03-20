---
name: write-acceptance-test
description: Write or complete a Cucumber/Gherkin acceptance test scenario for any feature in the Goat It API, following the conventions in tests/acceptance/README.md (fixtures, payloads, step definitions, DataTable schemas, locale helpers).
disable-model-invocation: true
---

## What I do

- Identify the feature, audience (admin/public) and domain to determine the correct file locations
- Write or complete `.feature` files with properly tagged scenarios
- Add or reuse fixture sets and register them in `FIXTURE_REGISTRY`
- Add or reuse payload constants and register them in `PAYLOADS`
- Write `Given`, `When`, `Then` step definitions following naming and regex conventions
- Define DataTable schemas using `z.strictObject` + `zCoerceOptional*` helpers
- Write step helpers (pure assertion functions) for non-trivial Then assertions
- Run `pnpm test:acceptance` (or `SKIP_BUILD=true pnpm test:acceptance`) until the suite is green

## When to use me

- A new HTTP endpoint needs BDD coverage from feature file to step definitions
- An existing feature scenario is missing validation-error or boundary-case coverage
- Fixture sets or payloads need to be added for a new domain

## Golden rule

**Always read `tests/acceptance/README.md` before writing or completing any acceptance test.** It contains authoritative templates, conventions, and reference links for every part of the acceptance test system.

## Lifecycle recap

The suite (hooks in `tests/acceptance/support/hooks.ts`):

1. **BeforeAll**: loads `.env.test`, optionally builds the app, connects MongoDB, spawns the app.
2. **Before** (each scenario): drops and recreates all MongoDB collections; attaches `appProcess` to world.
3. **After** (each scenario — failure only): flushes app log ring buffer; prints world debug dump.
4. **AfterAll**: disconnects MongoDB, kills app process.

## GoatItWorld quick reference

```typescript
// In any step function:
function (this: GoatItWorld) {
  // Set up payload (Given)
  this.payload = { ... };

  // Fire request (When)
  await this.fetchAndStoreResponse("/some/endpoint", createFetchOptions({
    apiKey: APP_ADMIN_API_KEY,
    method: "POST",
    body: this.payload,
  }));

  // Parse response (Then)
  const dto = this.expectLastResponseJson<MyDto>(MY_DTO_SCHEMA);

  // Assert HTTP status (Then, via shared step)
  // "the request should have succeeded with status code 201"
}
```

## Feature file template

```gherkin
@<domain> @<feature-slug> @<audience>

Feature: <Descriptive Feature Name>
  In order to <goal>
  As a <role> API client
  I want to <action>

  Scenario: Happy path description
    Given the database is populated with <domain> fixture set with name "<set-name>"
    And the request payload is set from scope "<scope>", type "<type>" and name "<name>"
    When <the audience> <performs the action> with the request payload
    Then the request should have succeeded with status code <2xx>
    And the response should contain the following <entity>:
      | field1 | field2 |
      | <SET>  | value  |

  Scenario: Validation error description
    Given the database is populated with <domain> fixture set with name "<set-name>"
    And the request payload is set from scope "<scope>", type "<type>" and name "<name>"
    When the request payload is overridden with the following values:
      | path  | type   | value |
      | field | string |       |
    And <the audience> <performs the action> with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code      | message        | path  | origin | minimum | inclusive |
      | too_small | Too small: ... | field | string | 1       | true      |
```

## Step definition templates

### Given — load fixture

```typescript
import { Given } from "@cucumber/cucumber";
import { loadFixture } from "@acceptance-support/fixtures/helpers/fixture.helpers";
import type { GoatItWorld } from "@acceptance-support/types/world.types";

Given(/^the database is populated with <domain> fixture set with name "(?<name>[^"]+)"$/u, async function (this: GoatItWorld, name: string) {
  await loadFixture(this, "<domain>", name as "<set-name>");
});
```

### When — fire HTTP request

```typescript
import { When } from "@cucumber/cucumber";
import { APP_ADMIN_API_KEY } from "@acceptance-support/constants/app.constants";
import { createFetchOptions } from "@acceptance-support/helpers/request.helpers";
import type { GoatItWorld } from "@acceptance-support/types/world.types";

When(/^the admin creates a new <entity> with the request payload$/u, async function (this: GoatItWorld) {
  const fetchOptions = createFetchOptions({
    apiKey: APP_ADMIN_API_KEY,
    method: "POST",
    body: this.payload,
  });
  await this.fetchAndStoreResponse("/<endpoint>", fetchOptions);
});
```

### Then — assert response

```typescript
import { Then } from "@cucumber/cucumber";
import { expect } from "expect";
import { validateDataTableAndGetFirstRow } from "@acceptance-support/helpers/datatable.helpers";
import { MY_DATATABLE_SCHEMA } from "@acceptance-features/step-definitions/contexts/<domain>/<audience>/datatables/<domain>.datatables.schemas";
import { MY_RESPONSE_DTO } from "@<domain>/application/dto/<entity>/<entity>.dto.shape";
import type { DataTable } from "@cucumber/cucumber";
import type { GoatItWorld } from "@acceptance-support/types/world.types";

Then(/^the response should contain the following <entity>:$/u, function (this: GoatItWorld, dataTable: DataTable) {
  const row = validateDataTableAndGetFirstRow(dataTable, MY_DATATABLE_SCHEMA);
  const dto = this.expectLastResponseJson<MyDto>(MY_RESPONSE_DTO);
  expect(dto.someField).toStrictEqual(row.someField);
});
```

## DataTable schema template

```typescript
import { z } from "zod";
import { zCoerceOptionalBoolean, zCoerceOptionalString } from "@acceptance-support/helpers/datatable.helpers";

const MY_ROW_SCHEMA = z.strictObject({
  id: z.string(),                      // required string
  isActive: zCoerceOptionalBoolean(),  // optional boolean (empty string → undefined)
  description: zCoerceOptionalString(), // optional string (empty string → undefined)
});

export { MY_ROW_SCHEMA };
```

## Fixture set template

```typescript
import type { QuestionThemeMongooseDocumentStub } from "@mocks/contexts/question/modules/question-theme/infrastructure/persistence/mongoose/question-theme.mongoose.types.mock";
import { createFakeQuestionThemeDocument } from "@faketories/contexts/question/question-theme/mongoose/mongoose-document/question-theme.mongoose-document.faketory";
import { createFakeObjectId } from "@faketories/infrastructure/database/database.faketory";

const MY_FIXTURE_ENTRY = createFakeQuestionThemeDocument({
  _id: createFakeObjectId("aabbccddeeff001122334455"), // ... deterministic field overrides
});

const MY_FIXTURE_SET = [
  MY_FIXTURE_ENTRY,
  // ...
] as const satisfies ReturnType<typeof createFakeQuestionThemeDocument>[];

export { MY_FIXTURE_SET, MY_FIXTURE_ENTRY };
```

## Payload template

```typescript
import { MY_FIXTURE_ENTRY } from "@acceptance-support/fixtures/<domain>/sets/my-set.fixture-set";

const MY_PAYLOAD = {
  // deterministic values; reference fixture IDs for foreign keys
  themeId: MY_FIXTURE_ENTRY._id.toString(),
  name: "Some Name",
} as const;

export { MY_PAYLOAD };
```

## Payload override types

| `type` in DataTable | Parsed as                                                     |
|---------------------|---------------------------------------------------------------|
| `string`            | Raw string (quotes stripped if wrapped in `"..."` or `'...'`) |
| `integer`           | `Number.parseInt(value, 10)`                                  |
| `float`             | `Number.parseFloat(value)`                                    |
| `boolean`           | `true` or `false`                                             |
| `array`             | `JSON.parse(value)` — must be a valid JSON array              |
| `undefined`         | `undefined` (removes the key from the payload)                |

## File naming conventions

| File type         | Location                                                                   | Naming pattern                            |
|-------------------|----------------------------------------------------------------------------|-------------------------------------------|
| Feature file      | `tests/acceptance/features/contexts/<domain>/<audience>/`                  | `<action>-<entity>-as-<audience>.feature` |
| Given steps       | `tests/acceptance/features/step-definitions/contexts/<domain>/<audience>/` | `<domain>[-<sub>].given-steps.ts`         |
| When steps        | same                                                                       | `<domain>[-<sub>].when-steps.ts`          |
| Then steps        | same                                                                       | `<domain>[-<sub>].then-steps.ts`          |
| DataTable schemas | same, `datatables/` subfolder                                              | `<domain>.datatables.schemas.ts`          |
| Step helpers      | same, `helpers/` subfolder                                                 | `<domain>.steps.helpers.ts`               |
| Fixture set       | `tests/acceptance/support/fixtures/<domain>/sets/`                         | `<set-name>.fixture-set.ts`               |
| Fixture index     | `tests/acceptance/support/fixtures/<domain>/`                              | `<domain>.fixtures.ts`                    |
| Payload           | `tests/acceptance/support/payloads/<scope>/<type>/`                        | `<name>-<scope>.<type>-payload.ts`        |

## Checks to run when done

```bash
SKIP_BUILD=true pnpm test:acceptance   # if dist/ is already built
pnpm test:acceptance                   # full run with build
pnpm run typecheck
pnpm run lint
```

## Reference

- **Primary authoritative guide (read first):** `tests/acceptance/README.md`
- Lifecycle and World: `tests/acceptance/support/hooks.ts`, `tests/acceptance/support/types/world.types.ts`
- Fixture registry: `tests/acceptance/support/fixtures/constants/fixture.constants.ts`
- Payload registry: `tests/acceptance/support/payloads/constants/payload.constants.ts`
- Shared steps: `tests/acceptance/features/step-definitions/shared/request/`
- DataTable helpers: `tests/acceptance/support/helpers/datatable.helpers.ts`
- Architecture and data-flow: `docs/ARCHITECTURE.md`
- Faketory conventions: `tests/shared/utils/faketories/README.md`
