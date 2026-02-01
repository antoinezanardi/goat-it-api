Unit Tests — Guidelines
=======================

Table of contents
-----------------

- [Purpose & Location](#purpose--location)
- [Test config](#test-config)
- [Mutation tests](#mutation-tests)
- [How To: write tests per file type](#how-to-write-tests-per-file-type)
  - [General rules](#general-rules)
  - [Controller tests](#controller-tests)
  - [Use-case tests (application layer) or Services](#use-case-tests-application-layer-or-services)
  - [Repository tests (persistence adapters)](#repository-tests-persistence-adapters)
  - [DTOs and Zod validators](#dtos-and-zod-validators)
  - [Helpers and utilities (pure functions)](#helpers-and-utilities-pure-functions)
  - [Errors (domain & infra)](#errors-domain--infra)
  - [Mocks & Faketories (where and how)](#mocks--faketories-where-and-how)
  - [Mocking modules vs instances](#mocking-modules-vs-instances)
  - [Assertion style and helpers](#assertion-style-and-helpers)

Purpose & Location
------------------

- Purpose: describe how unit tests are configured and how to write them so they match repository conventions and pass quality gates.
- Location: unit tests live next to implementation files under `src/` as `*.spec.ts`. Test helpers, mocks and faketories live under `tests/` (see `tests/unit/` and `tests/shared/utils/faketories/`).

Test config
------------------

- Test runner: Vitest (globals enabled). Config: `configs/vitest/vitest.config.ts`.
- Coverage: V8 provider; coverage thresholds enforced at `100%` for statements, branches, functions and lines. Run: `pnpm run test:unit:cov`. Some files are excluded from coverage, see `configs/vitest/vitest.config.ts` for details.
- Test files: pattern `src/**/*.spec.ts` (colocated with source).
- Global setup / mocks: `tests/unit/setup/mocks.setup.ts` contains global test setup used by Vitest.
- Path aliases: tests use project aliases (examples: `@faketories/*`, `@mocks/*`, `@question/*`). Aliases are configured in SWC/TypeScript/Vitest configs.

Mutation tests
--------------

- Purpose: ensure tests detect and fail when code is changed in a way that alters behavior. This guards against false positives in tests.
- Tool: Stryker (config: `configs/stryker/stryker.config.mjs`). The project aims for a `100%` mutation score in CI; local incremental runs are supported and recorded under `tests/mutation/incremental/`.
- Commands: `pnpm run test:mutation` (incremental), `pnpm run test:mutation:force` (full run).
- Note: mutation testing is CPU intensive; run locally only when necessary and commit any updated incremental state files if produced.

How To: write tests per file type
--------------------------------

General rules
-------------

- Keep tests colocated: `src/.../<unit>.spec.ts`.
- One assertion per `it` block. If you need multiple verifications, create multiple `it` tests describing each expected behavior.
- Test names: follow the pattern `should <expected behavior> when <condition>.` (example: `it("should return all question themes when called.", ...)`).
- Use path aliases for imports; follow repository import order conventions.
- Use faketories (`@faketories/...`) to build test data and `@mocks/...` factories for dependency mocks. Never use manual mock objects inline. See [Mocks & Faketories (where and how)](#mocks--faketories-where-and-how) for details.
- Prefer existing mock/faketory factory functions. If none fit, add new mocks or factories under `tests/unit/utils/mocks/` or `tests/shared/utils/faketories/` mirroring the source path.
- Every test file contains a top-level `describe("<Name> <Type>", () => { ... })` block. The `<Name>` matches the class or module under test, and `<Type>` describes its role (example: `Question Theme Controller`).
- Every mock is stored in the main `describe` block's scope. See the examples below for patterns. No need to reset mocks between tests as Vitest does it automatically in the config between each test.
- For each function and method under test, create a nested `describe(<methodName>, () => { ... })` block containing all relevant `it` tests. The method should be referenced in the `describe` name as-is (example: `describe(myFunction, () => { ... })`).
- What to test in a function or method:
  - Positive/success paths.
  - Each error branch (throwing) separately
  - Boundary conditions (e.g., empty arrays, null/undefined inputs).
- When a method is quite simple and the assertions are only on its output, you must use `it.each([...])` to parametrize multiple input→output cases instead of writing multiple `it` blocks.
- When a test that asserts an error is thrown, use `await expect(promise).rejects.toThrowError(...)` syntax. The exact error instance should be asserted, not just the message.
- Test deterministic inputs→outputs and edge cases. Keep tests small and focused.
- Always use `toStrictEqual<T>(expected)` for value equality assertions to get type hinting and strict shape checks.
- Private methods must be tested too, via `ClassName["privateMethodName"](...)` syntax.

Controller tests
----------------

- Purpose: verify the HTTP layer wiring only — routing, DTO validation usage, response mapping and that controllers call the correct use-cases with the expected arguments.
- What to mock: all collaborators (use-cases, mappers, services). Do not call real repositories or start Nest application. Inject mocks via Nest `useValue` providers in unit tests.
  - What to assert:
    - Controller calls the expected use-case method with the correct command/DTO mapping.
    - Controller maps returned domain entities to DTOs (use `toStrictEqual` for DTO shape).
    - When use-cases throw domain errors, controller lets the exception bubble (global filter converts it) — assert rejection where appropriate.
    
- Template (`health.controller.spec.ts`):
```ts
describe("Health Controller", () => {
  let healthController: HealthController;
  let mocks: {
    services: {
      health: ReturnType<typeof createMockedHealthService>;
    };
  };

  beforeEach(async() => {
    mocks = {
      services: {
        health: createMockedHealthService(),
      },
    };
    const testingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthService,
          useValue: mocks.services.health,
        },
      ],
    }).compile();

    healthController = testingModule.get<HealthController>(HealthController);
  });

  describe(HealthController.prototype.check, () => {
    it("should check health from service when called.", async() => {
      await healthController.check();

      expect(mocks.services.health.checkAppHealth).toHaveBeenCalledExactlyOnceWith();
    });

    it("should return health check result without error and info fields when called.", async() => {
      const expectedHealthCheckResult: HealthCheckResult = {
        status: "ok",
        details: createFakeHealthIndicatorResult(),
      };
      mocks.services.health.checkAppHealth.mockResolvedValue(expectedHealthCheckResult);
      const actualHealthCheckResult = await healthController.check();

      expect(actualHealthCheckResult).toStrictEqual<HealthCheckResult>(expectedHealthCheckResult);
    });
  });
});
```

- More references:
  - `src/contexts/question/modules/question-theme/infrastructure/http/controllers/question-theme/question-theme.controller.spec.ts`
  - `src/contexts/question/infrastructure/http/controllers/admin-question/admin-question.controller.spec.ts`

Use-case tests (application layer) or Services
----------------------------------

- Purpose: validate business orchestration, domain rules and interactions with repository ports. Use cases are the heart of application tests.
- What to mock: repository ports (injected via symbol tokens), domain helpers that are pure functions, and any external services. Use mocks from `@mocks/...` factories.
- What to assert:
  - Use-case calls repository methods with correctly transformed data/commands.
  - Use-case returns domain entity when dependencies resolve.
  - Domain errors are thrown on invalid conditions (assert exact error classes).
  - Side-effects (e.g., calling `repository.update`) are asserted with `toHaveBeenCalledExactlyOnceWith`.

- Template (`get-question-themes-by-ids-or-throw.use-case.spec.ts`):
```ts
describe("Get Question Themes By Ids Or Throw Use Case", () => {
  let getQuestionThemesByIdsOrThrowUseCase: GetQuestionThemesByIdsOrThrowUseCase;
  
  // Top-level mocks object, populated in beforeEach and used by tests.
  let mocks: {
    repositories: {
      questionTheme: ReturnType<typeof createMockedQuestionThemeRepository>;
    };
  };

  beforeEach(async() => {
    mocks = {
      repositories: {
        questionTheme: createMockedQuestionThemeRepository(),
      },
    };

    const testingModule = await Test.createTestingModule({
      providers: [
        GetQuestionThemesByIdsOrThrowUseCase,
        {
          provide: QUESTION_THEME_REPOSITORY_TOKEN,
          useValue: mocks.repositories.questionTheme,
        },
      ],
    }).compile();

    getQuestionThemesByIdsOrThrowUseCase = testingModule.get<GetQuestionThemesByIdsOrThrowUseCase>(GetQuestionThemesByIdsOrThrowUseCase);
  });

  describe(GetQuestionThemesByIdsOrThrowUseCase.prototype.getByIdsOrThrow, () => {
    it("should call questionTheme.findByIds with the provided ids when called.", async() => {
      const themes = [
        createFakeQuestionTheme({ id: "theme-1" }),
        createFakeQuestionTheme({ id: "theme-2" }),
      ];
      const ids = new Set(themes.map(theme => theme.id));
      vi.mocked(mocks.repositories.questionTheme.findByIds).mockResolvedValueOnce(themes);
      await getQuestionThemesByIdsOrThrowUseCase.getByIdsOrThrow(ids);

      expect(mocks.repositories.questionTheme.findByIds).toHaveBeenCalledExactlyOnceWith(ids);
    });

    it("should call throwErrorForMissingQuestionThemeIds when some ids are missing.", async() => {
      const themes = [createFakeQuestionTheme({ id: "theme-1" })];
      const ids = new Set([...themes.map(theme => theme.id), "missing-theme-id"]);
      vi.mocked(mocks.repositories.questionTheme.findByIds).mockResolvedValueOnce(themes);
      const throwErrorForMissingQuestionThemeIdsStub = GetQuestionThemesByIdsOrThrowUseCase as unknown as { throwErrorForMissingQuestionThemeIds: () => void };
      const throwErrorForMissingQuestionThemeIdsMock = vi.spyOn(throwErrorForMissingQuestionThemeIdsStub, "throwErrorForMissingQuestionThemeIds").mockImplementation(vi.fn);

      await getQuestionThemesByIdsOrThrowUseCase.getByIdsOrThrow(ids);

      expect(throwErrorForMissingQuestionThemeIdsMock).toHaveBeenCalledExactlyOnceWith(ids, new Set(themes.map(theme => theme.id)));
    });

    it("should not call throwErrorForMissingQuestionThemeIds when all ids are found.", async() => {
      const themes = [
        createFakeQuestionTheme({ id: "theme-1" }),
        createFakeQuestionTheme({ id: "theme-2" }),
      ];
      const ids = new Set(themes.map(theme => theme.id));
      vi.mocked(mocks.repositories.questionTheme.findByIds).mockResolvedValueOnce(themes);
      const throwErrorForMissingQuestionThemeIdsStub = GetQuestionThemesByIdsOrThrowUseCase as unknown as { throwErrorForMissingQuestionThemeIds: () => void };
      const throwErrorForMissingQuestionThemeIdsMock = vi.spyOn(throwErrorForMissingQuestionThemeIdsStub, "throwErrorForMissingQuestionThemeIds").mockImplementation(vi.fn);
      await getQuestionThemesByIdsOrThrowUseCase.getByIdsOrThrow(ids);

      expect(throwErrorForMissingQuestionThemeIdsMock).not.toHaveBeenCalled();
    });

    it("should return found question themes when all ids are found.", async() => {
      const themes = [
        createFakeQuestionTheme({ id: "theme-1" }),
        createFakeQuestionTheme({ id: "theme-2" }),
      ];
      const ids = new Set(themes.map(theme => theme.id));
      vi.mocked(mocks.repositories.questionTheme.findByIds).mockResolvedValueOnce(themes);
      const foundThemes = await getQuestionThemesByIdsOrThrowUseCase.getByIdsOrThrow(ids);

      expect(foundThemes).toStrictEqual<QuestionTheme[]>(themes);
    });
  });

  describe("throwErrorForMissingQuestionThemeIds", () => {
    it("should throw QuestionThemeNotFoundError for first missing id when called.", () => {
      const requestedIds = new Set(["id-1", "id-2", "id-3"]);
      const foundIds = new Set(["id-1", "id-3"]);
      const expectedError = new QuestionThemeNotFoundError("id-2");

      expect(() => {
        GetQuestionThemesByIdsOrThrowUseCase["throwErrorForMissingQuestionThemeIds"](requestedIds, foundIds);
      }).toThrowError(expectedError);
    });

    it("should not throw any error when all ids are found.", () => {
      const requestedIds = new Set(["id-1", "id-2"]);
      const foundIds = new Set(["id-1", "id-2"]);

      expect(() => {
        GetQuestionThemesByIdsOrThrowUseCase["throwErrorForMissingQuestionThemeIds"](requestedIds, foundIds);
      }).not.toThrowError();
    });
  });
});
```

- More references: 
  - `src/contexts/question/modules/question-theme/application/use-cases/create-question-theme/create-question-theme.use-case.spec.ts`
  - `src/contexts/question/modules/question-theme/application/use-cases/find-question-themes/find-question-themes.use-case.spec.ts`

Repository tests (persistence adapters)
--------------------------------------

- Purpose: test adapter logic that translates between persistence (Mongoose documents) and domain entities and ensures queries/updates are performed as expected.
- Test style: prefer unit tests that mock the `Model` methods (`find`, `findOne`, `create`, `updateOne`, `aggregate`) using `vi.fn()` and returning fake documents. For heavier integration-like checks, use small fixture documents from faketories but avoid running a real DB in unit tests.
- What to assert:
  - Correct query/filter shape passed to `Model` methods.
  - Document → entity and entity → document mapping correctness (use mappers/faketories).
  - Error handling for missing documents or Mongo errors is mapped to domain or adapter errors.

- Template (`question-theme.mongoose.repository.spec.ts`):
```ts
  describe("Question Theme Mongoose Repository", () => {
    let repository: QuestionThemeMongooseRepository;

    const mocks = {
      models: {
        questionTheme: {
          find: vi.fn(),
          findOne: vi.fn(),
          create: vi.fn(),
          updateOne: vi.fn(),
        },
      },
      mappers: {
        questionTheme: {
          createQuestionThemeFromDocument: vi.fn(),
        },
      },
    } as const;

    beforeEach(async() => {
      const module = await Test.createTestingModule({
        providers: [
          QuestionThemeMongooseRepository,
          { 
            provide: getModelToken(QuestionThemeMongooseSchema.name), 
            useValue: mocks.models.questionTheme 
          },
        ],
      }).compile();

      repository = module.get(QuestionThemeMongooseRepository);
    });

    describe(QuestionThemeMongooseRepository.prototype.findAll, () => {
      it("should call model.find and map results.", async () => {
        const doc = createFakeQuestionThemeDocument();
        const entity = createFakeQuestionTheme();
        mocks.models.questionTheme.find.mockResolvedValue([doc]);
        mocks.mappers.questionTheme.createQuestionThemeFromDocument.mockReturnValue(entity);

        const result = await repository.findAll();

        expect(mocks.models.questionTheme.find).toHaveBeenCalledExactlyOnceWith();
        expect(mocks.mappers.questionTheme.createQuestionThemeFromDocument).toHaveBeenCalledExactlyOnceWith(doc);
        expect(result).toStrictEqual([entity]);
      });
    });

    describe(QuestionThemeMongooseRepository.prototype.findById, () => {
      it("should return undefined when model.findOne returns null.", async () => {
        mocks.models.questionTheme.findOne.mockResolvedValue(null);

        const result = await repository.findById("60af924f4f1a2563f8e8b45c");

        expect(result).toBeUndefined();
      });

      it("should map and return entity when document is found.", async () => {
        const doc = createFakeQuestionThemeDocument();
        const entity = createFakeQuestionTheme();
        mocks.models.questionTheme.findOne.mockResolvedValue(doc);
        mocks.mappers.questionTheme.createQuestionThemeFromDocument.mockReturnValue(entity);

        const result = await repository.findById(doc._id.toString());

        expect(result).toStrictEqual<QuestionTheme>(entity);
      });
    });
  });
```

- More references:
  - `src/contexts/question/infrastructure/persistence/mongoose/repository/question.mongoose.repository.spec.ts`
  - `src/contexts/question/modules/question-theme/infrastructure/persistence/mongoose/repository/question-theme.mongoose.repository.spec.ts`

DTOs and Zod validators
-------------------------------

- Purpose: validate DTO schemas (Zod) and small transformer/mappers that feed the HTTP edge. Tests are pure, fast and colocated with DTO code — no Nest wiring.

- Key rules:
  - Cover every DTO field with at least one positive (accepts) and one negative (rejects) test.
  - Use faketories (e.g. `createFakeQuestionDto`, `createFakeAdminQuestionDto`) to produce valid examples and make minimal per-test modifications for negative cases.
  - Prefer `DTO.parse(valid)` or `expect(() => DTO.parse(valid)).not.toThrow()` for positive tests; use `safeParse` when you need to inspect `success` / `error` details.
  - When asserting failures use `ZodError` (e.g. `expect(() => DTO.parse(bad)).toThrowError(ZodError)`) and inspect `parsed.error.errors` when necessary.
  - Assert Zod metadata (`.meta()`) and property metadata (`DTO.shape.field.meta()`) exactly with `toStrictEqual` so OpenAPI generation expectations are maintained.
  - For refinements and small validators (slugs, mongo ids, ISO datetimes) use `it.each` to enumerate valid/invalid inputs and assert `schema.safeParse(value).success`.

- Good DTO test pattern (based on `src/contexts/question/application/dto/question/question.dto.spec.ts` and `admin-question.dto.spec.ts`):

```ts
import { ZodError } from "zod";
import { ISO_DATE_TIME_EXAMPLE } from "@shared/infrastructure/http/zod/validators/string/constants/string.zod.validators.constants";

import type { QuestionDto } from "@question/application/dto/question/question.dto";
import { QUESTION_DTO } from "@question/application/dto/question/question.dto";

import { createFakeQuestionDto } from "@faketories/contexts/question/question-question.dto.faketory"; // adjust path

describe("Question DTO Specs", () => {
  let validQuestionDto: QuestionDto;

  beforeEach(() => {
    validQuestionDto = createFakeQuestionDto();
  });

  it("should pass validation when a valid QuestionDto is provided.", () => {
    expect(() => QUESTION_DTO.parse(validQuestionDto)).not.toThrowError();
  });

  describe("id", () => {
    it("should throw zod error when id is invalid.", () => {
      const dtoWithInvalidId = Object.assign({}, validQuestionDto, { id: "invalid" });

      expect(() => QUESTION_DTO.parse(dtoWithInvalidId)).toThrowError(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_DTO.shape.id.meta();
      const expectedMetadata = {
        description: "Question's unique identifier",
        example: "60af924f4f1a2563f8e8b456",
      };

      expect(metadata).toStrictEqual(expectedMetadata);
    });
  });

  // repeat per-field positive/negative checks (themes, content, status, createdAt, ...)
  describe("createdAt / updatedAt", () => {
    it("should throw zod error when createdAt is invalid.", () => {
      const dtoWithInvalidCreatedAt = Object.assign({}, validQuestionDto, { createdAt: "not-a-date" });

      expect(() => QUESTION_DTO.parse(dtoWithInvalidCreatedAt)).toThrowError(ZodError);
    });

    it("should have correct metadata for createdAt when accessed.", () => {
      const metadata = QUESTION_DTO.shape.createdAt.meta();
      const expectedMetadata = {
        description: "Question's creation date",
        example: ISO_DATE_TIME_EXAMPLE,
      };

      expect(metadata).toStrictEqual(expectedMetadata);
    });
  });
});
```

- Zod validator tests (based on `src/shared/infrastructure/http/zod/validators/string/string.zod.validators.spec.ts`):

```ts
import { zSlug, zMongoId, zIsoDateTime } from "@shared/infrastructure/http/zod/validators/string/string.zod.validators";
import { ISO_DATE_TIME_EXAMPLE, SLUG_MIN_LENGTH, SLUG_MAX_LENGTH } from "@shared/infrastructure/http/zod/validators/string/constants/string.zod.validators.constants";

describe("String Zod Validators", () => {
  describe(zSlug, () => {
    it.each([
      { test: "valid slug", value: "valid-slug", expected: true },
      { test: "too short", value: "a", expected: false },
    ])("$test", ({ value, expected }) => {
      const result = zSlug().safeParse(value);
      
      expect(result.success).toBe(expected);
    });

    it("should trim spaces from the slug value when parsing.", () => {
      const parsed = zSlug().parse("  valid-slug  ");
      
      expect(parsed).toBe("valid-slug");
    });
  });

  describe(zMongoId, () => {
    it.each([
      { test: "valid id", value: "507f1f77bcf86cd799439011", expected: true },
      { test: "invalid id", value: "invalid", expected: false },
    ])("$test", ({ value, expected }) => {
      expect(zMongoId().safeParse(value).success).toBe(expected);
    });
  });

  describe(zIsoDateTime, () => {
    it("should have correct example metadata when accessing the metadata.", () => {
      expect(zIsoDateTime().meta()).toHaveProperty("example", ISO_DATE_TIME_EXAMPLE);
    });
  });
});
```

- References:
  - `src/contexts/question/application/dto/question/question.dto.spec.ts`
  - `src/contexts/question/application/dto/admin-question/admin-question.dto.spec.ts`
  - `src/shared/infrastructure/http/zod/validators/string/string.zod.validators.spec.ts`

Notes:
- Use `Object.assign({}, validDto, { field: badValue })` to avoid mutating shared faketory output across tests.
- Prefer `DTO.parse` for positive tests and `safeParse` when you need to inspect `error` details.
- Keep each `it` focused to one assertion — split coverage into multiple `it` lines when needed.

Helpers and utilities (pure functions)
--------------------------------

- Purpose: fast, isolated unit tests for pure helpers (formatters, small transformers, date helpers, mapper helpers, policies, predicates).
- What to test: all branches, edge cases and boundary values. Use `it.each` for parametrized inputs→outputs where appropriate.
- What to mock: generally none — these functions should be pure. If they call external libs, prefer spying on the library to assert behavior.
 - Template (`date.helpers.spec.ts`):

 ```ts
import { describe, it, expect } from "vitest";
import { formatDate } from "@shared/.../date.helpers";

describe("Date Helpers", () => {
  describe(formatDate, () => {
    it.each<{
      test: string;
      input: Date;
      expected: string;
    }>([
      {
        test: "should format date to YYYY-MM-DD",
        input: new Date("2024-01-15T10:20:30Z"),
        expected: "2024-01-15",
      },
      {
        test: "should format date with leading zeros",
        input: new Date("2024-06-05T08:09:07Z"),
        expected: "2024-06-05",
      },
    ])("$test", ({ input, expected }) => {
      expect(formatDate(input)).toBe(expected);
    });
  });
});
```

- Reference: `src/shared/infrastructure/persistence/mongoose/helpers/mongoose.helpers.spec.ts`

Errors (domain & infra)
------------------------

- Purpose: ensure custom error classes expose the expected `name` and message and are distinguishable in the global filter.
- What to test: constructor message formatting, `name` property and instanceof checks where applicable.
 - Template (`question.errors.spec.ts`):

 ```ts
import { QuestionNotFoundError } from "./question.errors";

describe("Question Errors", () => {
  describe(QuestionNotFoundError, () => {
    it("should set name when instantiated.", () => {
      const error = new QuestionNotFoundError("123");
      
      expect(error.name).toBe("QuestionNotFoundError");
    });
    
    it("should format message correctly.", () => {
      const error = new QuestionNotFoundError("123");
      
      expect(error.message).toBe("Question with ID 123 not found.");
    });
  });
});
```

- Reference: `src/contexts/question/modules/question-theme/domain/errors/question-theme.errors.spec.ts`

Mocks & Faketories (where and how)
----------------------------------

- Mocks live in `tests/unit/utils/mocks/` and mirror source paths. Use factory functions like `createMockedFindQuestionThemesUseCase()` returning `vi.fn()`-based fields.
- Faketories live in `tests/shared/utils/faketories/` and produce domain entities, DTOs and mongoose documents using `@faker-js/faker`.
- When adding a new feature, add matching mock/faketory files following the repository mirroring pattern.
- You can refer to the [Faketories documentation](../../docs/FAKETORIES.md) for detailed guidance on creating and organizing faketories.
- You can refer to the [Mocks documentation](../../docs/MOCKS.md) for detailed guidance on creating and organizing mocks.

Mocking modules vs instances
---------------------------

- Module-level pure functions (mappers/helpers): mock with `vi.mock(import("..."))` at top of spec and use `vi.mocked()` to access typed mocks.
- Instance collaborators (use-cases/repositories/services): create mock factories and inject via Nest `useValue` providers.

Assertion style and helpers
-------------------------

- One assertion per `it` block.
- Use the repository's helper matchers when present (e.g. `toHaveBeenCalledExactlyOnceWith()`).
- For value equality use `toStrictEqual<T>(expected)` to include type hinting.
