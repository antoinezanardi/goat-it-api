import { faker } from "@faker-js/faker";

import { DOCS_ENDPOINT_HEALTH_KEY, MONGOOSE_HEALTH_KEY } from "@src/infrastructure/api/health/constants/health.constants";

import type { HealthCheckResult, HealthIndicatorResult } from "@nestjs/terminus";

function createFakeHealthIndicatorResult(healthIndicatorResult: Partial<HealthIndicatorResult> = {}): HealthIndicatorResult {
  return {
    [MONGOOSE_HEALTH_KEY]: {
      status: "up",
    },
    [DOCS_ENDPOINT_HEALTH_KEY]: {
      status: "down",
    },
    ...healthIndicatorResult,
  };
}

function createFakeHealthCheckResult(healthCheckResult: Partial<HealthCheckResult> = {}): HealthCheckResult {
  return {
    status: faker.helpers.arrayElement(["ok", "error", "shutting_down"]),
    info: createFakeHealthIndicatorResult(),
    error: createFakeHealthIndicatorResult(),
    details: createFakeHealthIndicatorResult(),
    ...healthCheckResult,
  };
}

export {
  createFakeHealthIndicatorResult,
  createFakeHealthCheckResult,
};