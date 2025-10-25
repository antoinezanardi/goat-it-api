import { createFakeApiMetadata } from "@factories/app/app.factory";

import type { Mock } from "vitest";

import type { APIMetadata } from "@app/types/app.types";

type MockedAppService = {
  getApiMeta: Mock<() => APIMetadata>;
};

function createMockedAppService(): MockedAppService {
  return {
    getApiMeta: vi.fn<() => APIMetadata>().mockReturnValue(createFakeApiMetadata()),
  };
}

export { createMockedAppService };