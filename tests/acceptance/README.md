# Acceptance Tests — Guidelines

## Table of Contents

- [Purpose & Location](#purpose--location)
- [Stack & Config](#stack--config)
- [Directory Layout](#directory-layout)
- [How to Run](#how-to-run)
- [Lifecycle & Hooks](#lifecycle--hooks)
- [GoatItWorld (Custom World)](#goatitworld-custom-world)
- [Fixtures](#fixtures)
- [Payloads](#payloads)
- [Step Definitions](#step-definitions)
  - [General Rules](#general-rules)
  - [Given Steps](#given-steps)
  - [When Steps](#when-steps)
  - [Then Steps](#then-steps)
  - [Shared Steps](#shared-steps)
- [DataTable Helpers](#datatable-helpers)
- [Locale Helpers](#locale-helpers)
- [Request Helpers](#request-helpers)
- [Feature Files](#feature-files)
- [Logging & Debugging](#logging--debugging)
- [Path Aliases](#path-aliases)
- [How To: Add a New Acceptance Test](#how-to-add-a-new-acceptance-test)

---

## Purpose & Location

Acceptance tests verify end-to-end behavior of the HTTP API by exercising real HTTP endpoints against a running application backed by a real MongoDB test database. They complement unit tests by proving that all layers — controller, use-case, repository, database — integrate correctly.

Feature files live under `tests/acceptance/features/`. Support code (hooks, world, fixtures, payloads, helpers) lives under `tests/acceptance/support/`.

---

## Stack & Config

- **Framework**: [Cucumber.js](https://github.com/cucumber/cucumber-js) with BDD/Gherkin `.feature` files.
- **TypeScript transpilation**: `tsx/cjs` (via `requireModule` in Cucumber config) — no separate compilation step required.
- **HTTP client**: `ofetch` (auto-serializes JSON, captures responses regardless of HTTP status).
- **Assertions**: `expect` from the `expect` package (same API as Vitest/Jest).
- **Payload patching**: `radashi` (`crush` + `construct`) for deep-path overrides.
- **Cucumber config**: `configs/cucumber/cucumber.json`.
- **TypeScript config**: `configs/typescript/tsconfig.acceptance.json` (extends `tsconfig.app.json`; includes `src/**`, faketories, shared helpers, mock type stubs, and `tests/acceptance/**`).
- **Parallelism**: serial only (`"parallel": 1`) — scenarios share a single app process and database.
- **Reports output**: `tests/acceptance/reports/` — JUnit XML (`junit.xml`), JSON (`report.json`), and Cucumber message format (`message.json`).

---

## Directory Layout

```text
tests/acceptance/
  features/
    app/                             # App-level features (health, docs, metadata)
    contexts/
      question/                      # Domain features per audience
        admin/                       # Admin-facing question scenarios
        public/                      # Public-facing question scenarios
        question-theme/              # Question-theme management scenarios
    step-definitions/
      app/                           # Step implementations for app-level features
      contexts/
        question/
          admin/                     # Admin question Given/When/Then steps
          public/                    # Public question Given/When/Then steps
          question-theme/            # Question-theme Given/When/Then steps
      shared/
        locale/                      # Locale assertion helpers and datatable schemas
        request/                     # Shared Given/When/Then steps for request setup
  support/
    constants/                       # App URL, API keys, HTTP status lists, logging consts
    fixtures/
      constants/fixture.constants.ts # FIXTURE_REGISTRY + FIXTURE_INSERTERS
      helpers/fixture.helpers.ts     # loadFixture() with dependency resolution
      types/fixture.types.ts         # FixtureRegistry, FixtureDefinition, FixtureInserter types
      question/                      # question.fixtures.ts + sets/*.fixture-set.ts
      question-theme/                # question-theme.fixtures.ts + sets/*.fixture-set.ts
    helpers/
      datatable.helpers.ts           # zCoerceOptional* validators, validateDataTable* helpers
      request.helpers.ts             # createFetchOptions(), createFetchHeaders()
      setup/
        build.helpers.ts             # buildAppForAcceptanceTests()
        env.helpers.ts               # loadEnvTestConfig()
        http.helpers.ts              # waitForAppToBeReady()
        logging.helpers.ts           # RingBuffer, flushAndPrintLogTail, log handlers
        process.helpers.ts           # killAppProcess()
        setup.helpers.ts             # serveAppForAcceptanceTests(), printDebugOnScenarioFailure()
      test-database.helpers.ts       # connectToTestDatabase, resetTestDatabase, closeTestDatabaseConnection
    payloads/
      constants/payload.constants.ts # PAYLOADS registry keyed by scope/type/name
      types/payload.types.ts         # PayloadScope, PayloadType
      question/creation/             # COMPLETE_QUESTION_CREATION_PAYLOAD
      question/question-theme-assignment/ # PRIMARY_HISTORY_QUESTION_THEME_ASSIGNMENT_CREATE_PAYLOAD
      question-theme/creation/       # COMPLETE_QUESTION_THEME_CREATION_PAYLOAD
    types/
      app.types.ts                   # AppFetchOptions
      hooks.types.ts                 # AcceptanceHooksProcesses, AppLogsManager, AppLogsFlushResult
      world.types.ts                 # GoatItWorld class
  logs/                              # Per-run stdout/stderr of the app process (runtime only)
  plugins/html-reporter/             # HTML reporter plugin
  reports/                           # JUnit/JSON/message output files
```

---

## How to Run

```bash
# Full acceptance test suite (requires Docker services)
pnpm test:acceptance

# Skip the NestJS build step (useful when the dist/ is already fresh)
SKIP_BUILD=true pnpm test:acceptance
```

> **Prerequisites**: MongoDB must be running and reachable at the URL defined in `env/.env.test`. The suite builds the app (`pnpm build`) by default before spawning the server process. Set `SKIP_BUILD=true` to skip the build.

---

## Lifecycle & Hooks

All hooks live in `tests/acceptance/support/hooks.ts`. They execute in this order per test run:

### `BeforeAll`

1. Loads `env/.env.test` via `loadEnvTestConfig()`.
2. Optionally builds the app (`buildAppForAcceptanceTests()`) unless `SKIP_BUILD=true`.
3. Connects to MongoDB via `connectToTestDatabase()`.
4. Spawns `pnpm run start:prod:test` and waits for the HTTP health endpoint to respond (`serveAppForAcceptanceTests()`). The app listens on `http://0.0.0.0:4242`.
5. Stores the child process reference and log manager in the `processes` object.

### `Before` (each scenario)

1. Drops and recreates all MongoDB collections via `resetTestDatabase()` — every scenario starts with a clean database.
2. Attaches the app `ChildProcess` to `this.appProcess` on the `GoatItWorld` instance.

### `After` (each scenario — failure only)

1. If the scenario **failed**, flushes the app's stdout/stderr ring buffer and prints the tail to the console via `flushAndPrintLogTail()`.
2. Calls `printDebugOnScenarioFailure(world, scenario)` to print the World state (last request, last payload, last response) for debugging.

### `AfterAll`

1. Disconnects MongoDB via `closeTestDatabaseConnection()`.
2. Kills the app process via `killAppProcess()`.

---

## GoatItWorld (Custom World)

Defined in `tests/acceptance/support/types/world.types.ts`. Registered with `setWorldConstructor(GoatItWorld)` in hooks.

All step function bodies must declare `this: GoatItWorld`.

### Properties

| Property            | Type                                          | Description                                                                                               |
|---------------------|-----------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| `lastFetchResponse` | `FetchResponse<unknown> \| undefined`         | The raw `ofetch` response from the last HTTP call.                                                        |
| `appProcess`        | `ChildProcessWithoutNullStreams \| undefined` | Reference to the running app child process.                                                               |
| `models`            | `{ questions, questionThemes }`               | Mongoose `Model` instances for direct DB access in fixtures.                                              |
| `payload`           | `Record<string, unknown>`                     | The pending request body. Built by Given steps, consumed by When steps. Reset to `{}` after each request. |
| `lastPayload`       | `Record<string, unknown>`                     | Snapshot of `payload` taken just before each request fires.                                               |

### Methods

| Method                                           | Description                                                                                                                                               |
|--------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| `fetchAndStoreResponse(endpoint, fetchOptions?)` | Fires the request via the `ofetch` instance. Swallows `ofetch` errors so that non-2xx responses are still stored in `lastFetchResponse` without throwing. |
| `expectLastResponseJson<T>(schema)`              | Parses `lastFetchResponse._data` through the provided Zod schema and returns typed `T`. Throws if no response is stored.                                  |
| `expectLastResponseText()`                       | Returns `lastFetchResponse._data` as a raw string. Throws if the data is not a string.                                                                    |

### Internal details

- The `ofetch` instance is created once per world with `baseURL: http://0.0.0.0:4242`.
- The `onRequest` hook clears `lastFetchResponse`, snapshots `payload` into `lastPayload`, and resets `payload` to `{}`.
- The `onResponse` hook stores the raw response in `lastFetchResponse`.
- Mongoose models are registered directly from source schemas (`QUESTION_MONGOOSE_SCHEMA`, `QUESTION_THEME_MONGOOSE_SCHEMA`) so the same schema definitions used by the app are reused.

---

## Fixtures

Fixtures are pre-built sets of Mongoose document stubs inserted into the test database by `Given` steps. They provide a deterministic, known state for scenarios to query or reference.

### Registry and inserters

`tests/acceptance/support/fixtures/constants/fixture.constants.ts` defines two constants:

- **`FIXTURE_REGISTRY`**: maps `domain → name → { data, dependencies? }`.
  - `data`: a `readonly` array of Mongoose document stubs built using faketories from `@faketories/...`.
  - `dependencies`: optional array of `[domain, name]` tuples that must be loaded before this fixture.
- **`FIXTURE_INSERTERS`**: maps each domain to an async function that calls `world.models.<collection>.insertMany(data)`.

### Loading fixtures: `loadFixture`

```ts
import { loadFixture } from "@acceptance-support/fixtures/helpers/fixture.helpers";

await loadFixture(world, "question-theme", "five-question-themes");
await loadFixture(world, "question", "five-questions"); // auto-loads its question-theme dependency first
```

- Dependencies are resolved recursively and in declared order.
- Circular dependency detection throws an error immediately.
- The `loadedKeys` parameter is internal — never pass it when calling externally.

### Available fixture sets

| Domain           | Name                               | Dependencies                                      | Description                                              |
|------------------|------------------------------------|---------------------------------------------------|----------------------------------------------------------|
| `question-theme` | `five-question-themes`             | —                                                 | Five question themes (science, history, geography, …).   |
| `question-theme` | `two-english-only-question-themes` | —                                                 | Two themes with English labels only.                     |
| `question`       | `five-questions`                   | `question-theme/five-question-themes`             | Five questions referencing the five-question-themes set. |
| `question`       | `two-english-only-questions`       | `question-theme/two-english-only-question-themes` | Two questions with English content only.                 |

### Fixture entries

Individual document stubs within a set are exported as named constants (e.g., `FIVE_QUESTION_THEMES_FIXTURE_SCIENCE_ENTRY`) so that payloads can reference their `_id` values and assertions can compare specific records.

### Fixture file conventions

- Sets live under `support/fixtures/<domain>/sets/<set-name>.fixture-set.ts`.
- Each set is typed as `as const satisfies ReturnType<typeof createFake...Document>[]`.
- IDs are deterministic (hardcoded `Types.ObjectId` values) so payloads and assertions remain stable across runs.

### Adding a new fixture set

1. Create the set file under `support/fixtures/<domain>/sets/<set-name>.fixture-set.ts`.
2. Export individual entry constants you may need in payloads or assertions.
3. Register it in `FixtureRegistry` (type, `fixture.types.ts`) and `FIXTURE_REGISTRY` (constant, `fixture.constants.ts`).
4. Add a `FIXTURE_INSERTERS` entry if you are introducing a new domain.

---

## Payloads

Payloads are deterministic request body objects that are set by `Given` steps and consumed by `When` steps.

### Registry

`tests/acceptance/support/payloads/constants/payload.constants.ts` exports a `PAYLOADS` constant typed as:

```ts
Record<PayloadScope, Record<PayloadType, Record<string, object>>>
```

Addressed in feature files by three coordinates: **scope**, **type**, and **name**.

### Available payloads

| Scope                       | Type       | Name             | Description                                                                                                         |
|-----------------------------|------------|------------------|---------------------------------------------------------------------------------------------------------------------|
| `question`                  | `creation` | `complete`       | A complete valid question creation body. References `FIVE_QUESTION_THEMES_FIXTURE_SCIENCE_ENTRY._id` for theme IDs. |
| `question-theme`            | `creation` | `complete`       | A complete valid question-theme creation body.                                                                      |
| `question-theme-assignment` | `creation` | `primaryHistory` | A question-theme assignment body for the primary history theme.                                                     |

### Payload file conventions

- Files live under `support/payloads/<domain>/<type>/<name>-<domain>.<type>-payload.ts`.
- Payloads are built using faketories overridden with concrete, deterministic values (no `faker` randomness).
- They reference fixture entry `_id`s (e.g., `FIVE_QUESTION_THEMES_FIXTURE_SCIENCE_ENTRY._id.toString()`) to match what will be in the database.

### Overriding payload values

The shared `When` step `the request payload is overridden with the following values:` deep-patches `world.payload` using a DataTable:

```gherkin
When the request payload is overridden with the following values:
| path           | type    | value     |
| author.role    | string  | ai        |
| author.name    | string  | GoatItGPT |
| themes[0].isPrimary | boolean | false  |
| optional       | undefined |         |
```

- **`path`**: dot-notation or bracket-notation path into the payload object.
- **`type`**: one of `string`, `integer`, `float`, `boolean`, `array`, `undefined`.
- **`value`**: the new value (parsed according to `type`; leave empty for `undefined`).
- `array` values must be valid JSON arrays (e.g., `["a", "b"]`).
- `string` values wrapped in `"..."` or `'...'` have their quotes stripped.

Patching uses `crush` (flatten to dot paths) and `construct` (rebuild nested object) from `radashi`, so you can target deeply nested fields and array indices safely.

---

## Step Definitions

### General Rules

- Step files are named `<domain>[-<sub>].<given|when|then>-steps.ts` and colocated under the matching `step-definitions/` subfolder.
- Step regex patterns use named capture groups: `/^the admin retrieves the question with id "(?<id>[^"]+)"$/u`.
- All step functions declare `this: GoatItWorld` as their first parameter.
- Step helpers (pure assertion/utility functions) live in `helpers/` subfolders next to the step files. They are **not** step definitions — they are called by Then steps to keep step bodies readable.
- DataTable schemas live in `datatables/` subfolders next to the step files.

### Given Steps

`Given` steps set up the preconditions for a scenario: database state and request payload.

**Loading a fixture set:**

```gherkin
Given the database is populated with question themes fixture set with name "five-question-themes"
Given the database is populated with question fixture set with name "five-questions"
```

These steps call `loadFixture(world, domain, name)`. Domain-specific `Given` steps live alongside the domain's step files.

**Setting the request payload:**

```gherkin
Given the request payload is set from scope "question", type "creation" and name "complete"
```

This shared step looks up `PAYLOADS[scope][type][name]` and assigns the result to `world.payload`. An error is thrown if the combination does not exist.

### When Steps

`When` steps fire HTTP requests. Each step builds a `FetchOptions` object via `createFetchOptions()` and calls `this.fetchAndStoreResponse(endpoint, options)`.

**Typical pattern:**

```ts
When(/^the admin creates a new question with the request payload$/u, async function (this: GoatItWorld) {
  const fetchOptions = createFetchOptions({
    apiKey: APP_ADMIN_API_KEY,
    method: "POST",
    body: this.payload,
  });
  await this.fetchAndStoreResponse("/admin/questions", fetchOptions);
});
```

**Overriding the payload (shared When step):**

```gherkin
When the request payload is overridden with the following values:
| path  | type   | value |
| ...   | ...    | ...   |
```

See [Payloads — Overriding payload values](#overriding-payload-values) for the full DataTable format.

### Then Steps

`Then` steps assert on the response. They call `this.expectLastResponseJson<T>(ZOD_SCHEMA)` to parse `lastFetchResponse._data`, then use `expect` to assert.

**Typical pattern:**

```ts
Then(/^the response should contain the following admin question:$/u, function (this: GoatItWorld, dataTable: DataTable) {
  const row = validateDataTableAndGetFirstRow(dataTable, ADMIN_QUESTION_DATATABLE_SCHEMA);
  const question = this.expectLastResponseJson<AdminQuestionDto>(ADMIN_QUESTION_DTO);
  expectAdminQuestionDtoToMatch(question, row);
});
```

**The `<SET>` placeholder:**

When a DataTable cell contains `<SET>`, it means the field is expected to be present and truthy (non-null, non-empty), and its actual value is captured for reuse in later steps of the same scenario. This is used for generated IDs where the exact value cannot be known at authoring time.

### Shared Steps

Shared step definitions live under `features/step-definitions/shared/` and are available to all feature files.

#### Shared `Given` steps (`shared/request/request.given-steps.ts`)

| Step                                                                               | Action                                             |
|------------------------------------------------------------------------------------|----------------------------------------------------|
| `the request payload is set from scope "<scope>", type "<type>" and name "<name>"` | Sets `world.payload` from the `PAYLOADS` registry. |

#### Shared `When` steps (`shared/request/request.when-steps.ts`)

| Step                                                           | Action                                                                        |
|----------------------------------------------------------------|-------------------------------------------------------------------------------|
| `the request payload is overridden with the following values:` | Deep-patches `world.payload` using a DataTable of `path / type / value` rows. |

#### Shared `Then` steps (`shared/request/request.then-steps.ts`)

| Step                                                                                                       | Action                                                                                                                                                                |
|------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `the request should have succeeded with status code <N>`                                                   | Asserts `lastFetchResponse.status === N`. Validates `N` is a known success code.                                                                                      |
| `the request should have failed with status code <N> and the response should contain the following error:` | Asserts HTTP status and the `ApiResponseExceptionDto` shape (error, message, statusCode, optionally validationDetails).                                               |
| `the failed request's response should contain the following validation details:`                           | Parses `validationDetails` array and asserts each entry's fields (code, message, path, expected, origin, format, pattern, minimum, maximum, inclusive, keys, values). |

---

## DataTable Helpers

`tests/acceptance/support/helpers/datatable.helpers.ts`

All DataTable cells are raw strings. These helpers bridge the gap between Cucumber's string-only DataTable format and typed Zod schemas.

### Coercion validators

| Function                       | Returns                          | Behavior                                                                 |
|--------------------------------|----------------------------------|--------------------------------------------------------------------------|
| `zCoerceOptionalBoolean()`     | `ZodType<boolean \| undefined>`  | Empty string → `undefined`; `"true"` → `true`; `"false"` → `false`.      |
| `zCoerceOptionalString()`      | `ZodType<string \| undefined>`   | Empty string → `undefined`; any other string passes through.             |
| `zCoerceOptionalNumber()`      | `ZodType<number \| undefined>`   | Empty string → `undefined`; numeric string → `Number(value)`.            |
| `zCoerceOptionalStringArray()` | `ZodType<string[] \| undefined>` | Empty string → `undefined`; comma-separated string → trimmed `string[]`. |

### Row parsing helpers

```ts
// Parse all rows through schema, return T[]
validateDataTableAndGetRows(dataTable, SCHEMA);

// Parse only the first row, return T
validateDataTableAndGetFirstRow(dataTable, SCHEMA);
```

Both throw a descriptive error if the DataTable is empty or fails Zod validation.

### Defining a DataTable schema

```ts
import { z } from "zod";
import { zCoerceOptionalBoolean, zCoerceOptionalString } from "@acceptance-support/helpers/datatable.helpers";

const MY_DATATABLE_SCHEMA = z.strictObject({
  name: z.string(),
  isActive: zCoerceOptionalBoolean(),
  description: zCoerceOptionalString(),
});
```

Use `z.strictObject` to catch extra/misspelled columns at test time.

---

## Locale Helpers

`tests/acceptance/features/step-definitions/shared/locale/`

### `createZLocalizedDataTableRowSchema`

Creates a Zod schema for a DataTable where each row has a `locale` column and one localized field column:

```ts
const STATEMENT_ROW_SCHEMA = createZLocalizedDataTableRowSchema("statement");
// Produces: z.strictObject({ locale: z.enum(LOCALES), statement: z.string() })
```

Used for tables like:

```gherkin
| locale | statement                  |
| en     | Who discovered penicillin? |
| fr     | Qui a découvert ...        |
```

### Step helpers (`locale.steps.helpers.ts`)

- `expectLocalizedTextFieldToBe(entity, field, locale, expectedValue)` — asserts a single localized field matches an expected string.
- `expectLocalizedTextsFieldToBe(entity, field, locale, expectedValues)` — asserts an array-valued localized field (e.g. trivia) matches expected strings.

---

## Request Helpers

`tests/acceptance/support/helpers/request.helpers.ts`

### `createFetchOptions(options?)`

Builds an `ofetch` `FetchOptions` object from `AppFetchOptions`:

```ts
type AppFetchOptions = {
  apiKey?: string;       // If provided, sets the API key header (X-Api-Key)
  locale?: string;       // Sets Accept-Language header; defaults to "*"
  method?: string;       // HTTP method; defaults to ofetch's default (GET)
  body?: unknown;        // JSON-serialized as request body
};
```

If `apiKey` is `undefined`, no API key header is sent (tests the unauthenticated path).

```ts
// Authenticated GET
createFetchOptions({ apiKey: APP_ADMIN_API_KEY });

// Authenticated POST with payload
createFetchOptions({
  apiKey: APP_ADMIN_API_KEY,
  method: "POST",
  body: this.payload
});

// Unauthenticated (no API key header at all)
createFetchOptions();

// Scoped to a specific locale
createFetchOptions({
  apiKey: APP_ADMIN_API_KEY,
  locale: "fr"
});
```

---

## Feature Files

### Tagging convention

```gherkin
@question @create-question @admin

Feature: Create Question as Admin
```

Tags: `@<domain>`, `@<feature-slug>`, `@<audience>` (e.g. `@admin`, `@public`).

### Gherkin keyword semantics

| Keyword | Purpose                                                    |
|---------|------------------------------------------------------------|
| `Given` | Set up DB state (fixtures) and request payload.            |
| `When`  | Fire an HTTP request.                                      |
| `Then`  | Assert HTTP status code and response body.                 |
| `And`   | Continue the most recent `Given`, `When`, or `Then` block. |

### Standard scenario structure

```gherkin
Scenario: Creating a question with complete data as admin
Given the database is populated with question themes fixture set with name "five-question-themes"
And the request payload is set from scope "question", type "creation" and name "complete"
When the admin creates a new question with the request payload
Then the request should have succeeded with status code 201
And the response should contain the following admin question:
| id    | category | status |
| <SET> | trivia   | active |
```

### Validation error scenario structure

```gherkin
Scenario: Trying to create a question with empty English statement
Given the database is populated with question themes fixture set with name "five-question-themes"
And the request payload is set from scope "question", type "creation" and name "complete"
When the request payload is overridden with the following values:
| path                 | type   | value |
| content.statement.en | string |       |
And the admin creates a new question with the request payload
Then the request should have failed with status code 400 and the response should contain the following error:
| error       | statusCode | message                 | validationDetails |
| Bad Request | 400        | Invalid request payload | <SET>             |
And the failed request's response should contain the following validation details:
| code      | message                                           | path                 | origin | minimum | inclusive |
| too_small | Too small: expected string to have >=1 characters | content.statement.en | string | 1       | true      |
```

### `<SET>` placeholder

In a Then DataTable, `<SET>` in a cell means:

- The field must be present (non-null, non-undefined).
- The actual value is captured and can be reused by subsequent steps (e.g. referencing the generated `id` in a follow-up `When` step).

---

## Logging & Debugging

The acceptance suite captures the app's stdout and stderr into a fixed-size ring buffer during a test run. On scenario failure the buffer is flushed and the last `N` lines of application logs are printed alongside the World debug dump (last request URL, last payload, last response body).

Log files written to `tests/acceptance/logs/` during a run contain the full stdout/stderr of the spawned app process.

To force log output even on passing scenarios, add a breakpoint or temporarily change the condition in the `After` hook (`hooks.ts`).

---

## Path Aliases

| Alias                    | Resolves to                       |
|--------------------------|-----------------------------------|
| `@acceptance-support/*`  | `tests/acceptance/support/*`      |
| `@acceptance-features/*` | `tests/acceptance/features/*`     |
| `@faketories/*`          | `tests/shared/utils/faketories/*` |
| `@mocks/*`               | `tests/unit/utils/mocks/*`        |
| `@src/*`                 | `src/*`                           |
| `@question/*`            | `src/contexts/question/*`         |
| `@shared/*`              | `src/shared/*`                    |

---

## How To: Add a New Acceptance Test

Follow these steps when adding acceptance coverage for a new or existing feature.

### 1. Write the feature file

Create `tests/acceptance/features/contexts/<context>/<audience>/<feature-slug>.feature`.

- Add tags: `@<domain> @<feature-slug> @<audience>`.
- Write a `Feature:` block describing the capability.
- Add one `Scenario:` per behavior (happy path, each error path, boundary cases).
- Use existing shared steps where possible (`the request payload is set...`, `the request should have succeeded...`, etc.).

### 2. Add or reuse a fixture set

If the scenario needs pre-existing database data:

- Check if an existing fixture set under `support/fixtures/<domain>/sets/` covers your needs.
- If not, create a new `.fixture-set.ts` file using faketories from `@faketories/...` with deterministic IDs.
- Register the set in `FixtureRegistry` (type) and `FIXTURE_REGISTRY` (constant), and add a `FIXTURE_INSERTERS` entry if introducing a new domain.
- Export individual entry constants for any documents your payload or assertions will reference by ID.

### 3. Add or reuse a payload

If the scenario sends a request body:

- Check if an existing payload under `support/payloads/<domain>/<type>/` covers your needs.
- If not, create a new `<name>-<domain>.<type>-payload.ts` file. Build it using faketories with concrete overrides (no randomness). Reference fixture entry `_id`s where needed.
- Register it in the `PAYLOADS` constant (`payload.constants.ts`) under the correct `scope / type / name`.

### 4. Write step definitions

If the feature uses steps not yet implemented:

- **Given steps**: add to `tests/acceptance/features/step-definitions/contexts/<context>/<audience>/*.given-steps.ts` (use the `*.given-steps.ts` filename glob so multiple files may coexist).
  - For DB setup: call `loadFixture(world, domain, name)`.
- **When steps**: add to `tests/acceptance/features/step-definitions/contexts/<context>/<audience>/*.when-steps.ts`.
  - Build fetch options via `createFetchOptions({ apiKey, method, body })`.
  - Call `this.fetchAndStoreResponse(endpoint, fetchOptions)`.
- **Then steps**: add to `tests/acceptance/features/step-definitions/contexts/<context>/<audience>/*.then-steps.ts`.
  - Parse response with `this.expectLastResponseJson<T>(ZOD_SCHEMA)`.
  - Assert with `expect(actual).toStrictEqual(expected)` or a helper from `helpers/`.

### 5. Define DataTable schemas

For any new DataTable:

- Create or update `datatables/<domain>.datatables.schemas.ts` next to the step file.
- Use `z.strictObject({...})` so unknown columns fail fast.
- Use `zCoerceOptionalBoolean/String/Number/StringArray()` for optional columns (empty string → `undefined`).

### 6. Write step helpers (for Then steps)

For non-trivial response assertions:

- Create or update `helpers/<domain>.steps.helpers.ts` next to the step file.
- Helpers are pure functions — they take parsed DTO objects and DataTable rows, and use `expect` to assert. They do not register Cucumber steps.

### 7. Run the suite

```bash
pnpm test:acceptance
# or skip build if dist/ is up to date:
SKIP_BUILD=true pnpm test:acceptance
```

Fix any failures before merging. Acceptance tests must pass in CI alongside lint, typecheck, and unit tests.

---

## Contacts & References

- `AGENTS.md` — repository-wide conventions and stack overview.
- `docs/ARCHITECTURE.md` — hexagonal architecture and data flow.
- `tests/unit/README.md` — unit test guidelines.
- `tests/shared/utils/faketories/README.md` — faketory conventions.
- `tests/unit/utils/mocks/README.md` — mock factory conventions.
