const mockedLogger = vi.hoisted(() => ({
  log: vi.fn<(message: unknown, ...optionalParameters: unknown[]) => void>(),
  warn: vi.fn<(message: unknown, ...optionalParameters: unknown[]) => void>(),
  verbose: vi.fn<(message: unknown, ...optionalParameters: unknown[]) => void>(),
  debug: vi.fn<(message: unknown, ...optionalParameters: unknown[]) => void>(),
  error: vi.fn<(message: unknown, trace?: string, ...optionalParameters: unknown[]) => void>(),
  fatal: vi.fn<(message: unknown, trace?: string, ...optionalParameters: unknown[]) => void>(),
}));

function getMockedLoggerInstance(): typeof mockedLogger {
  return mockedLogger;
}

const mockedLoggerConstructor = vi.fn<() => typeof mockedLogger>(getMockedLoggerInstance);

function getMockedLoggerConstructor(): typeof mockedLoggerConstructor {
  return mockedLoggerConstructor;
}

export {
  getMockedLoggerConstructor,
  getMockedLoggerInstance,
};