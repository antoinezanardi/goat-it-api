const mockedLogger = vi.hoisted(() => ({
  log: vi.fn<() => void>(),
  warn: vi.fn<() => void>(),
  info: vi.fn<() => void>(),
  danger: vi.fn<() => void>(),
  fatal: vi.fn<() => void>(),
}));

function mockNestCommon(): void {
  vi.mock("@nestjs/common", async importActual => ({
    ...await importActual(),
    Logger: vi.fn<() => object>(function logger() {
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