import { DOCS_ENDPOINT_HEALTH_KEY, MONGOOSE_HEALTH_KEY } from "@src/infrastructure/api/health/constants/health.constants";
import type { AppHealthDetailsDto } from "@src/infrastructure/api/health/dto/app-health/app-health-details/app-health-details.dto";
import { APP_HEALTH_DETAILS_DTO } from "@src/infrastructure/api/health/dto/app-health/app-health-details/app-health-details.dto";

import { createFakeAppHealthDetailsDto } from "@faketories/infrastructure/api/health/health.faketory";

describe("App Health Details Dto", () => {
  let validAppHealthDetailsDto: AppHealthDetailsDto;

  beforeEach(() => {
    validAppHealthDetailsDto = createFakeAppHealthDetailsDto();
  });

  it("should pass validation when assigned valid values.", () => {
    expect(() => APP_HEALTH_DETAILS_DTO.parse(validAppHealthDetailsDto)).not.toThrowError();
  });

  describe(MONGOOSE_HEALTH_KEY, () => {
    it("should have correct description when accessing description.", () => {
      expect(APP_HEALTH_DETAILS_DTO.shape[MONGOOSE_HEALTH_KEY].description).toBe("Health details of the Mongoose (MongoDB) connection");
    });
  });

  describe(DOCS_ENDPOINT_HEALTH_KEY, () => {
    it("should have correct description when accessing description.", () => {
      expect(APP_HEALTH_DETAILS_DTO.shape[DOCS_ENDPOINT_HEALTH_KEY].description).toBe("Health details of the API Documentation endpoint");
    });
  });
});