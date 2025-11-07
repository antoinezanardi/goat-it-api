const mockedLogger = vi.hoisted(() => ({
  log: vi.fn<() => void>(),
  warn: vi.fn<() => void>(),
  verbose: vi.fn<() => void>(),
  debug: vi.fn<() => void>(),
  error: vi.fn<() => void>(),
  fatal: vi.fn<() => void>(),
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