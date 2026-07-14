import { getMockedLoggerInstance } from "@mocks/shared/nest/nest.mock";

vi.mock("@nestjs/common", async importActual => ({
  ...await importActual(),
  Logger: vi.fn<() => ReturnType<typeof getMockedLoggerInstance>>(getMockedLoggerInstance),
}));

vi.mock("nestjs-zod", async importOriginal => {
  // Acceptable as importOriginal returns a module namespace that is spreadable at runtime but not typed as an object
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  const actual = await importOriginal() as Record<string, unknown>;

  return {
    ...actual,
    cleanupOpenApiDoc: vi.fn((document: unknown) => document),
  };
});