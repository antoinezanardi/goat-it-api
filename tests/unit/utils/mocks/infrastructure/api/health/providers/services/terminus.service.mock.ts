import { createFakeHealthCheckResult, createFakeHealthIndicatorResult } from "@faketories/infrastructure/api/health/health.faketory";

import type { HealthCheckResult, HealthIndicatorResult } from "@nestjs/terminus";
import type { Mock } from "vitest";

type HealthCheckIndicatorServiceStub = {
  pingCheck: () => Promise<HealthIndicatorResult>;
};

type MockedHealthIndicatorService = {
  [K in keyof HealthCheckIndicatorServiceStub]: Mock<HealthCheckIndicatorServiceStub[K]>
};

type HealthCheckServiceStub = {
  check: (checks: (() => Promise<HealthIndicatorResult>)[]) => Promise<HealthCheckResult>;
};

type MockedHealthCheckService = { [K in keyof HealthCheckServiceStub]: Mock<HealthCheckServiceStub[K]> };

function createMockedTerminusHealthIndicatorService(): MockedHealthIndicatorService {
  return {
    pingCheck: vi.fn<HealthCheckIndicatorServiceStub["pingCheck"]>().mockResolvedValue(createFakeHealthIndicatorResult()),
  };
}

function createMockedTerminusHealthCheckService(): MockedHealthCheckService {
  return {
    check: vi.fn<HealthCheckServiceStub["check"]>().mockResolvedValue(createFakeHealthCheckResult()),
  };
}

export {
  createMockedTerminusHealthIndicatorService,
  createMockedTerminusHealthCheckService,
};