const mockedLogger = vi.hoisted(() => ({
  log: vi.fn<(message: unknown, ...optionalParameters: unknown[]) => void>(),
  warn: vi.fn<(message: unknown, ...optionalParameters: unknown[]) => void>(),
  verbose: vi.fn<(message: unknown, ...optionalParameters: unknown[]) => void>(),
  debug: vi.fn<(message: unknown, ...optionalParameters: unknown[]) => void>(),
  error: vi.fn<(message: unknown, trace?: string, ...optionalParameters: unknown[]) => void>(),
  fatal: vi.fn<(message: unknown, trace?: string, ...optionalParameters: unknown[]) => void>(),
}));

function mockNestCommon(): void {
  vi.mock("@nestjs/common", async importActual => ({
    ...await importActual(),
    Logger: vi.fn<() => typeof mockedLogger>(function logger() {
      return mockedLogger;
    }),
  }));
}

function getMockedLoggerInstance(): typeof mockedLogger {
  return mockedLogger;
}

export {
  mockNestCommon,
  getMockedLoggerInstance,
};