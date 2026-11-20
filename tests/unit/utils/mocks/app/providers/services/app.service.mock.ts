import type { AppMetadataDto } from "@app/dto/app-metadata/app-metadata.dto.shape";

import { createFakeAppMetadata } from "@faketories/app/app.faketory";

import type { Mock } from "vitest";

type AppServiceStub = {
  getApiMeta: () => AppMetadataDto;
};

type MockedAppService = { [K in keyof AppServiceStub]: Mock<AppServiceStub[K]> };

function createMockedAppService(overrides: Partial<MockedAppService> = {}): MockedAppService {
  return {
    getApiMeta: vi.fn<AppServiceStub["getApiMeta"]>().mockReturnValue(createFakeAppMetadata()),
    ...overrides,
  };
}

export { createMockedAppService };