import { DOCS_ENDPOINT_HEALTH_KEY, MONGOOSE_HEALTH_KEY } from "@src/infrastructure/api/health/constants/health.constants";
import type { AppHealthDto } from "@src/infrastructure/api/health/dto/app-health/app-health.dto.shape";

import type { HealthCheckResult } from "@nestjs/terminus";

/**
 * Narrows a Terminus health-check result to the public health DTO.
 *
 * Only the Mongoose connection and docs-endpoint indicators are forwarded; any other registered indicator is dropped.
 */
function createAppHealthDtoFromHealthCheckResult(healthCheckResult: HealthCheckResult): AppHealthDto {
  return {
    status: healthCheckResult.status,
    details: {
      [MONGOOSE_HEALTH_KEY]: healthCheckResult.details[MONGOOSE_HEALTH_KEY],
      [DOCS_ENDPOINT_HEALTH_KEY]: healthCheckResult.details[DOCS_ENDPOINT_HEALTH_KEY],
    },
  };
}

export { createAppHealthDtoFromHealthCheckResult };