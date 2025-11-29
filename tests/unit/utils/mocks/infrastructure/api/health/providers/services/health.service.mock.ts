import { createFakeHealthCheckResult } from "@faketories/infrastructure/api/health/health.faketory";

import type { HealthCheckResult } from "@nestjs/terminus";
import type { Mock } from "vitest";

type HealthServiceStub = {
  checkAppHealth: () => Promise<HealthCheckResult>;
};

type MockedHealthService = { [K in keyof HealthServiceStub]: Mock<HealthServiceStub[K]> };

function createMockedHealthService(): MockedHealthService {
  return {
    checkAppHealth: vi.fn<HealthServiceStub["checkAppHealth"]>().mockResolvedValue(createFakeHealthCheckResult()),
  };
}

export { createMockedHealthService };