import { createFakeAppMetadata } from "@factories/app/app.factory";

import type { Mock } from "vitest";

import type { AppMetadata } from "@app/types/app.types";

type MockedAppService = {
  getApiMeta: Mock<() => AppMetadata>;
};

function createMockedAppService(): MockedAppService {
  return {
    getApiMeta: vi.fn<() => AppMetadata>().mockReturnValue(createFakeAppMetadata()),
  };
}

export { createMockedAppService };