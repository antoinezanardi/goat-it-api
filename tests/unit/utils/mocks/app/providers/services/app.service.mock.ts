import { createFakeAppMetadata } from "@faketories/app/app.faketory";

import type { Mock } from "vitest";

import type { AppMetadata } from "@app/types/app.types";

type AppServiceStub = {
  getApiMeta: () => AppMetadata;
};

type MockedAppService = { [K in keyof AppServiceStub]: Mock<AppServiceStub[K]> };

function createMockedAppService(overrides: Partial<MockedAppService> = {}): MockedAppService {
  return {
    getApiMeta: vi.fn<AppServiceStub["getApiMeta"]>().mockReturnValue(createFakeAppMetadata()),
    ...overrides,
  };
}

export { createMockedAppService };