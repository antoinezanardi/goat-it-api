import { getMockedLoggerInstance } from "@mocks/shared/nest/nest.mock";

vi.mock("@nestjs/common", async importActual => ({
  ...await importActual(),
  Logger: vi.fn<() => ReturnType<typeof getMockedLoggerInstance>>(getMockedLoggerInstance),
}));