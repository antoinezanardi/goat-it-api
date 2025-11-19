import { createFakeHealthCheckResult } from "@factories/infrastructure/api/health/health.factory";

import type { HealthCheckResult } from "@nestjs/terminus";
import type { Mock } from "vitest";

type MockedHealthService = {
  checkAppHealth: Mock<() => Promise<HealthCheckResult>>;
};

function createMockedHealthService(): MockedHealthService {
  return {
    checkAppHealth: vi.fn<() => Promise<HealthCheckResult>>().mockResolvedValue(createFakeHealthCheckResult()),
  };
}

export { createMockedHealthService };