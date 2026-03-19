---
name: write-unit-test
description: Write or complete a colocated Vitest unit test for any source file in the Goat It API, following the per-file-type conventions in tests/unit/README.md (controllers, use-cases, repositories, DTOs, helpers, errors).
disable-model-invocation: true
---

## What I do

- Identify the source file type and apply the matching test template
- Wire up the Nest testing module with typed mock factories from `@mocks/*`
- Populate test data with faketories from `@faketories/*`
- Write focused `it` blocks (one assertion each) covering success paths, error branches and edge cases
- Ensure the spec compiles and `pnpm run test:unit:cov` stays green at 100%

## When to use me

- A new source file has no spec yet and needs a skeleton
- An existing spec is missing assertions, branches, or mock/faketory wiring
- Coverage is below 100% and you need to add the missing `it` blocks

## Golden rule

**Always read `tests/unit/README.md` before writing or completing any test.** It contains authoritative templates and edge-case patterns for every file type. This skill summarises the most important conventions but is not a replacement for that guide.

## Per-file-type quick reference

### Controllers

Purpose: verify HTTP wiring only — routing, DTO mapping, use-case delegation.

```typescript
describe("Foo Controller", () => {
  let controller: FooController;
  let mocks: { useCases: { createFoo: ReturnType<typeof createMockedCreateFooUseCase> } };

  beforeEach(async () => {
    mocks = { useCases: { createFoo: createMockedCreateFooUseCase() } };
    const module = await Test.createTestingModule({
      controllers: [FooController],
      providers: [
        {
          provide: CreateFooUseCase,
          useValue: mocks.useCases.createFoo
        }
      ],
    }).compile();
    controller = module.get(FooController);
  });

  describe(FooController.prototype.create, () => {
    it("should call createFoo.create with the mapped command when called.", async () => {
      const dto = createFakeFooCreationDto();
      await controller.create(dto);
      expect(mocks.useCases.createFoo.create).toHaveBeenCalledExactlyOnceWith(/* expected command */);
    });
  });
});
```

### Use-cases

Purpose: validate business orchestration, repository calls, and domain error propagation.

```typescript
describe("Create Foo Use Case", () => {
  let useCase: CreateFooUseCase;
  let mocks: { repositories: { foo: ReturnType<typeof createMockedFooRepository> } };

  beforeEach(async () => {
    mocks = { repositories: { foo: createMockedFooRepository() } };
    const module = await Test.createTestingModule({
      providers: [
        CreateFooUseCase,
        {
          provide: FOO_REPOSITORY_TOKEN,
          useValue: mocks.repositories.foo
        },
      ],
    }).compile();
    useCase = module.get(CreateFooUseCase);
  });

  describe(CreateFooUseCase.prototype.create, () => {
    it("should return created foo when repository returns one.", async () => {
      const expected = createFakeFoo();
      mocks.repositories.foo.create.mockResolvedValueOnce(expected);
      const actual = await useCase.create(createFakeFooCreationCommand());
      expect(actual).toStrictEqual<Foo>(expected);
    });

    it("should throw FooCreationError when repository returns undefined.", async () => {
      mocks.repositories.foo.create.mockResolvedValueOnce(undefined);
      await expect(useCase.create(createFakeFooCreationCommand())).rejects.toThrow(new FooCreationError());
    });
  });
});
```

### Repositories

Purpose: test query shapes and document→entity mapping; mock the Mongoose `Model`.

```typescript
const mocks = {
  models: {
    foo: {
      find: vi.fn(),
      findOne: vi.fn(),
      create: vi.fn()
    }
  },
} as const;

// Inject via: { provide: getModelToken(FooSchema.name), useValue: mocks.models.foo }
```

### DTOs (`*.dto.shape.spec.ts`)

```typescript
describe("Foo DTO", () => {
  describe("fieldName", () => {
    it("should accept a valid value.", () => {
      expect(() => FOO_DTO.parse(createFakeFooDto())).not.toThrow();
    });

    it("should reject an invalid value.", () => {
      expect(() => FOO_DTO.parse({
        ...createFakeFooDto(),
        fieldName: "bad"
      })).toThrow(ZodError);
    });

    it("should have correct metadata.", () => {
      expect(FOO_DTO.shape.fieldName.meta()).toStrictEqual({
        description: "…",
        example: "…"
      });
    });
  });
});
```

### Helpers / pure functions

Use `it.each` for multiple input→output cases; no Nest module required:

```typescript
describe(myHelper, () => {
  it.each<{ input: X; expected: Y }>([
    { input: …,
  expected: …
},
])
  ("should return $expected when input is $input.", ({
                                                       input,
                                                       expected
                                                     }) => {
    expect(myHelper(input)).toStrictEqual(expected);
  });
});
```

### Errors

```typescript
describe(MyError, () => {
  it("should have correct name when constructed.", () => {
    expect(new MyError("id").name).toBe("MyError");
  });

  it("should format message correctly when constructed.", () => {
    expect(new MyError("id").message).toBe(`My error for id`);
  });
});
```

### Private methods

Access via bracket notation:

```typescript
myInstance["privateMethod"](arg);
MyClass["staticPrivateMethod"](arg);
```

## Structural conventions

- Top-level `describe`: `"<ClassName> <Role>"` (e.g. `"Create Foo Use Case"`)
- Nested `describe`: reference the method directly — `describe(FooClass.prototype.myMethod, ...)`
- Test name pattern: `"should <expected behavior> when <condition>."`
- One assertion per `it` — split multiple assertions into separate `it` blocks
- Use `toStrictEqual<T>(expected)` for value equality (keeps type hinting)
- Use `toHaveBeenCalledExactlyOnceWith(...)` for single-call assertions
- Use `await expect(promise).rejects.toThrow(exactErrorInstance)` for error assertions
- Use `it.each` instead of multiple identical `it` blocks that vary only in inputs

## Coverage exclusions (no spec needed)

`*.module.ts`, `*.schema.ts`, `*.constants.ts`, `*.types.ts`, `*.dto.ts`, `*.pipeline.ts`, `*.commands.ts`, `*.contracts.ts`

## Checks to run when done

```bash
pnpm run test:unit:cov   # must stay at 100%
pnpm run typecheck
pnpm run lint
```

## Reference

- **Primary authoritative guide (read first):** `tests/unit/README.md`
- Mock conventions: `tests/unit/utils/mocks/README.md` and `docs/MOCKS.md`
- Faketory conventions: `tests/shared/utils/faketories/README.md` and `docs/FAKETORIES.md`
- Architecture and data-flow: `docs/ARCHITECTURE.md`
- Coverage config: `configs/vitest/vitest.config.ts`
- Related skills: `create-mock`, `create-faketory`
