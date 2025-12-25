import { faker } from "@faker-js/faker";

import { DOCS_ENDPOINT_HEALTH_KEY, HEALTH_DETAILS_STATUS_ENUM, HEALTH_STATUS_ENUM, MONGOOSE_HEALTH_KEY } from "@src/infrastructure/api/health/constants/health.constants";
import type { AppHealthDetailsCheckDto } from "@src/infrastructure/api/health/dto/app-health/app-health-details/app-health-details-check/app-health-details-check.dto";
import type { AppHealthDetailsDto } from "@src/infrastructure/api/health/dto/app-health/app-health-details/app-health-details.dto";
import type { AppHealthDto } from "@src/infrastructure/api/health/dto/app-health/app-health.dto";

import type { HealthCheckResult, HealthIndicatorResult } from "@nestjs/terminus";

function createFakeHealthIndicatorResult(healthIndicatorResult: Partial<HealthIndicatorResult> = {}): HealthIndicatorResult {
  return {
    [MONGOOSE_HEALTH_KEY]: {
      status: faker.helpers.arrayElement(HEALTH_DETAILS_STATUS_ENUM),
    },
    [DOCS_ENDPOINT_HEALTH_KEY]: {
      status: faker.helpers.arrayElement(HEALTH_DETAILS_STATUS_ENUM),
    },
    ...healthIndicatorResult,
  };
}

function createFakeHealthCheckResult(healthCheckResult: Partial<HealthCheckResult> = {}): HealthCheckResult {
  return {
    status: faker.helpers.arrayElement(HEALTH_STATUS_ENUM),
    info: createFakeHealthIndicatorResult(),
    error: createFakeHealthIndicatorResult(),
    details: createFakeHealthIndicatorResult(),
    ...healthCheckResult,
  };
}

function createFakeAppHealthDetailsCheckDto(appHealthDetailsCheckDto: Partial<AppHealthDetailsCheckDto> = {}): AppHealthDetailsCheckDto {
  return {
    status: faker.helpers.arrayElement(HEALTH_DETAILS_STATUS_ENUM),
    message: faker.datatype.boolean() ? faker.lorem.sentence() : undefined,
    ...appHealthDetailsCheckDto,
  };
}

function createFakeAppHealthDetailsDto(appHealthDetailsDto: Partial<AppHealthDetailsDto> = {}): AppHealthDetailsDto {
  return {
    [MONGOOSE_HEALTH_KEY]: createFakeAppHealthDetailsCheckDto(),
    [DOCS_ENDPOINT_HEALTH_KEY]: createFakeAppHealthDetailsCheckDto(),
    ...appHealthDetailsDto,
  };
}

function createFakeAppHealthDto(appHealthDto: Partial<AppHealthDto> = {}): AppHealthDto {
  return {
    status: faker.helpers.arrayElement(HEALTH_STATUS_ENUM),
    details: createFakeAppHealthDetailsDto(),
    ...appHealthDto,
  };
}

export {
  createFakeHealthIndicatorResult,
  createFakeHealthCheckResult,
  createFakeAppHealthDetailsCheckDto,
  createFakeAppHealthDetailsDto,
  createFakeAppHealthDto,
};