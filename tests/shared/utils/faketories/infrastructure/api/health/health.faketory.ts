import { faker } from "@faker-js/faker";

import { DOCS_ENDPOINT_HEALTH_KEY, HEALTH_DETAILS_STATUS_ENUM, HEALTH_STATUS_ENUM, MONGOOSE_HEALTH_KEY } from "@src/infrastructure/api/health/constants/health.constants";
import type { AppHealthCheckDto, AppHealthCheckResultDto } from "@src/infrastructure/api/health/dto/app-health/app-health.dto";

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

function createFakeAppHealthCheckDto(appHealthCheckDto: Partial<AppHealthCheckDto> = {}): AppHealthCheckDto {
  return {
    status: faker.helpers.arrayElement(HEALTH_DETAILS_STATUS_ENUM),
    message: faker.datatype.boolean() ? faker.lorem.sentence() : undefined,
    ...appHealthCheckDto,
  };
}

function createFakeAppHealthCheckResultDto(appHealthCheckResultDto: Partial<AppHealthCheckResultDto> = {}): AppHealthCheckResultDto {
  return {
    status: faker.helpers.arrayElement(HEALTH_STATUS_ENUM),
    details: {
      [MONGOOSE_HEALTH_KEY]: createFakeAppHealthCheckDto(),
      [DOCS_ENDPOINT_HEALTH_KEY]: createFakeAppHealthCheckDto(),
    },
    ...appHealthCheckResultDto,
  };
}

export {
  createFakeHealthIndicatorResult,
  createFakeHealthCheckResult,
  createFakeAppHealthCheckDto,
  createFakeAppHealthCheckResultDto,
};