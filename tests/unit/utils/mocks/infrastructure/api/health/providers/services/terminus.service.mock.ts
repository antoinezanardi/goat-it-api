import { createFakeHealthCheckResult, createFakeHealthIndicatorResult } from "@factories/infrastructure/api/health/health.factory";

import type { HealthCheckResult, HealthIndicatorResult } from "@nestjs/terminus";
import type { Mock } from "vitest";

type MockedHealthIndicatorService = {
  pingCheck: Mock<() => Promise<HealthIndicatorResult>>;
};

type MockedHealthCheckService = {
  check: Mock<(checks: (() => Promise<HealthIndicatorResult>)[]) => Promise<HealthCheckResult>>;
};

function createMockedTerminusHealthIndicatorService(): MockedHealthIndicatorService {
  return {
    pingCheck: vi.fn<() => Promise<HealthIndicatorResult>>().mockResolvedValue(createFakeHealthIndicatorResult()),
  };
}

function createMockedTerminusHealthCheckService(): MockedHealthCheckService {
  return {
    check: vi.fn<(checks: (() => Promise<HealthIndicatorResult>)[]) => Promise<HealthCheckResult>>().mockResolvedValue(createFakeHealthCheckResult()),
  };
}

export {
  createMockedTerminusHealthIndicatorService,
  createMockedTerminusHealthCheckService,
};