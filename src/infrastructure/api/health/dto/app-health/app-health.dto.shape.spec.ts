import { APP_HEALTH_DTO } from "@src/infrastructure/api/health/dto/app-health/app-health.dto.shape";

describe("App Health DTO Shape", () => {
  let validAppHealthDto: {
    status: string;
    details: {
      "mongoose": { status: string; message?: string; responseTime?: number };
      "goat-it-docs": { status: string; message?: string; responseTime?: number };
    };
  };

  beforeEach(() => {
    validAppHealthDto = {
      status: "ok",
      details: {
        "mongoose": { status: "up", message: "Connection successful", responseTime: 150 },
        "goat-it-docs": { status: "up", message: "Connection successful", responseTime: 200 },
      },
    };
  });

  it("should pass validation when assigned valid values.", () => {
    expect(() => APP_HEALTH_DTO.parse(validAppHealthDto)).not.toThrow();
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