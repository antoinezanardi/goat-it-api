import { getMockedLoggerConstructor } from "@mocks/shared/nest/nest.mock";

vi.mock("@nestjs/common", async importActual => ({
  ...await importActual(),
  Logger: getMockedLoggerConstructor(),
}));

vi.mock("nestjs-zod", async importOriginal => {
  const actual = await importOriginal<Record<string, unknown>>();

  return {
    ...actual,
    cleanupOpenApiDoc: vi.fn((document: unknown) => document),
  };
});