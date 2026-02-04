import type { AppHealthDetailsCheckDto } from "@src/infrastructure/api/health/dto/app-health/app-health-details/app-health-details-check/app-health-details-check.dto";
import { APP_HEALTH_DETAILS_CHECK_DTO } from "@src/infrastructure/api/health/dto/app-health/app-health-details/app-health-details-check/app-health-details-check.schema";

import { createFakeAppHealthDetailsCheckDto } from "@faketories/infrastructure/api/health/health.faketory";

describe("App Health Details Check Dto", () => {
  let validAppHealthDetailsCheckDto: AppHealthDetailsCheckDto;

  beforeEach(() => {
    validAppHealthDetailsCheckDto = createFakeAppHealthDetailsCheckDto();
  });

  it("should pass validation when assigned valid values.", () => {
    expect(() => APP_HEALTH_DETAILS_CHECK_DTO.parse(validAppHealthDetailsCheckDto)).not.toThrowError();
  });

  describe("status", () => {
    it("should have correct description when accessing description.", () => {
      expect(APP_HEALTH_DETAILS_CHECK_DTO.shape.status.description).toBe("Health status of the component");
    });
  });

  describe("message", () => {
    it("should have correct description when accessing description.", () => {
      expect(APP_HEALTH_DETAILS_CHECK_DTO.shape.message.description).toBe("Optional message providing additional information about the health status when it is not up");
    });

    it("should have correct metadata when accessing metadata.", () => {
      const expectedMetadata = {
        description: "Optional message providing additional information about the health status when it is not up",
        example: "Database connection failed.",
      };

      expect(APP_HEALTH_DETAILS_CHECK_DTO.shape.message.meta()).toStrictEqual(expectedMetadata);
    });
  });
});