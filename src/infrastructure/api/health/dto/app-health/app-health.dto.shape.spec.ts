import type { AppHealthDto } from "@src/infrastructure/api/health/dto/app-health/app-health.dto.shape";
import { APP_HEALTH_DTO } from "@src/infrastructure/api/health/dto/app-health/app-health.dto.shape";

import { createFakeAppHealthDto } from "@faketories/infrastructure/api/health/health.faketory";

describe("App Health DTO Shape", () => {
  let validAppHealthDto: AppHealthDto;

  beforeEach(() => {
    validAppHealthDto = createFakeAppHealthDto();
  });

  it("should pass validation when assigned valid values.", () => {
    expect(() => APP_HEALTH_DTO.parse(validAppHealthDto)).not.toThrowError();
  });

  describe("status", () => {
    it("should have correct description when accessing description.", () => {
      expect(APP_HEALTH_DTO.shape.status.description).toBe("Overall health status of the application");
    });
  });

  describe("details", () => {
    it("should have correct description when accessing description.", () => {
      expect(APP_HEALTH_DTO.shape.details.description).toBe("Detailed health status of individual checked components");
    });
  });
});