import { createFakeHealthCheckResult } from "@faketories/infrastructure/api/health/health.faketory";

import type { HealthCheckResult } from "@nestjs/terminus";
import type { Mock } from "vitest";

type HealthServiceStub = {
  checkAppHealth: () => Promise<HealthCheckResult>;
};

type MockedHealthService = { [K in keyof HealthServiceStub]: Mock<HealthServiceStub[K]> };

function createMockedHealthService(overrides: Partial<MockedHealthService> = {}): MockedHealthService {
  return {
    checkAppHealth: vi.fn<HealthServiceStub["checkAppHealth"]>().mockResolvedValue(createFakeHealthCheckResult()),
    ...overrides,
  };
}

export { createMockedHealthService };