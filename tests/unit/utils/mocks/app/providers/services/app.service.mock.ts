import { createFakeAppMetadata } from "@factories/app/app.factory";

import type { Mock } from "vitest";

import type { AppMetadata } from "@app/types/app.types";

type AppServiceStub = {
  getApiMeta: () => AppMetadata;
};

type MockedAppService = { [K in keyof AppServiceStub]: Mock<AppServiceStub[K]> };

function createMockedAppService(): MockedAppService {
  return {
    getApiMeta: vi.fn<AppServiceStub["getApiMeta"]>().mockReturnValue(createFakeAppMetadata()),
  };
}

export { createMockedAppService };