import { createFakeAppEnv } from "@faketories/infrastructure/api/config/env.faketory";

import type { Mock } from "vitest";

import type { AppEnv } from "@src/infrastructure/api/config/types/env.types";

type NestConfigServiceStub = {
  getOrThrow: (key: keyof AppEnv) => unknown;
};

type MockedNestConfigService = {
  [K in keyof NestConfigServiceStub]: Mock<NestConfigServiceStub[K]>;
};

function createMockedNestConfigService(appEnv: Partial<AppEnv> = {}, overrides: Partial<MockedNestConfigService> = {}): MockedNestConfigService {
  const fakeAppEnv = createFakeAppEnv(appEnv);

  return {
    getOrThrow: vi.fn<NestConfigServiceStub["getOrThrow"]>((key: keyof AppEnv) => fakeAppEnv[key]),
    ...overrides,
  };
}

export { createMockedNestConfigService };