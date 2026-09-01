import { DOCS_ENDPOINT_HEALTH_KEY, MONGOOSE_HEALTH_KEY } from "@src/infrastructure/api/health/constants/health.constants";
import { APP_HEALTH_DETAILS_DTO } from "@src/infrastructure/api/health/dto/app-health/app-health-details/app-health-details.dto.shape";

describe("App Health Details DTO Shape", () => {
  let validAppHealthDetailsDto: {
    "mongoose": { status: string; message?: string; responseTime?: number };
    "goat-it-docs": { status: string; message?: string; responseTime?: number };
  };

  beforeEach(() => {
    validAppHealthDetailsDto = {
      "mongoose": { status: "up", message: "Connection successful", responseTime: 150 },
      "goat-it-docs": { status: "up", message: "Connection successful", responseTime: 200 },
    };
  });

  it("should pass validation when assigned valid values.", () => {
    expect(() => APP_HEALTH_DETAILS_DTO.parse(validAppHealthDetailsDto)).not.toThrow();
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