import { DOCS_ENDPOINT_HEALTH_KEY, MONGOOSE_HEALTH_KEY } from "@src/infrastructure/api/health/constants/health.constants";
import type { AppHealthDto } from "@src/infrastructure/api/health/dto/app-health/app-health.dto.shape";
import { createAppHealthDtoFromHealthCheckResult } from "@src/infrastructure/api/health/mappers/health.mappers";

import { createFakeAppHealthDto, createFakeHealthCheckResult } from "@faketories/infrastructure/api/health/health.faketory";

describe("Health Mappers", () => {
  describe(createAppHealthDtoFromHealthCheckResult, () => {
    it("should map a HealthCheckResult to an AppHealthDto when called.", () => {
      const healthCheckResult = createFakeHealthCheckResult();
      const appHealthDto = createAppHealthDtoFromHealthCheckResult(healthCheckResult);
      const expectedAppHealthDto = createFakeAppHealthDto({
        status: healthCheckResult.status,
        details: {
          [MONGOOSE_HEALTH_KEY]: healthCheckResult.details[MONGOOSE_HEALTH_KEY],
          [DOCS_ENDPOINT_HEALTH_KEY]: healthCheckResult.details[DOCS_ENDPOINT_HEALTH_KEY],
        },
      });

      expect(appHealthDto).toStrictEqual<AppHealthDto>(expectedAppHealthDto);
    });
  });
});