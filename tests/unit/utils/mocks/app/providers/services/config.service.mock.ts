import { createFakeAppEnv } from "@factories/infrastructure/api/config/env.factory";

import type { Mock } from "vitest";

import type { AppEnv } from "@src/infrastructure/api/config/types/env.types";

type AppConfigServiceStub = {
  getOrThrow: (key: keyof AppEnv) => unknown;
};

type MockedAppConfigService = {
  [K in keyof AppConfigServiceStub]: Mock<AppConfigServiceStub[K]>;
};

function createMockedAppConfigService(appEnv: Partial<AppEnv> = {}): MockedAppConfigService {
  const fakeAppEnv = createFakeAppEnv(appEnv);

  return {
    getOrThrow: vi.fn<AppConfigServiceStub["getOrThrow"]>((key: keyof AppEnv) => fakeAppEnv[key]),
  };
}

export { createMockedAppConfigService };