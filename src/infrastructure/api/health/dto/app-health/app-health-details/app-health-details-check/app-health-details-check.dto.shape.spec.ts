import { ZodError } from "zod";

import { APP_HEALTH_DETAILS_CHECK_DTO } from "@src/infrastructure/api/health/dto/app-health/app-health-details/app-health-details-check/app-health-details-check.dto.shape";

describe("App Health Details Check DTO Shape", () => {
  let validAppHealthDetailsCheckDto: { status: string; message?: string; responseTime?: number };

  beforeEach(() => {
    validAppHealthDetailsCheckDto = {
      status: "up",
      message: "Connection successful",
      responseTime: 150,
    };
  });

  it("should pass validation when assigned valid values.", () => {
    expect(() => APP_HEALTH_DETAILS_CHECK_DTO.parse(validAppHealthDetailsCheckDto)).not.toThrow();
  });

  describe("status", () => {
    it("should pass validation when status is valid.", () => {
      const dto = { ...validAppHealthDetailsCheckDto, status: "up" };

      expect(() => APP_HEALTH_DETAILS_CHECK_DTO.parse(dto)).not.toThrow();
    });

    it("should throw zod error when status is invalid.", () => {
      const dtoWithInvalidStatus = { ...validAppHealthDetailsCheckDto, status: "invalid" };

      expect(() => APP_HEALTH_DETAILS_CHECK_DTO.parse(dtoWithInvalidStatus)).toThrow(ZodError);
    });

    it("should have correct description when accessing description.", () => {
      expect(APP_HEALTH_DETAILS_CHECK_DTO.shape.status.description).toBe("Health status of the component");
    });
  });

  describe("message", () => {
    it("should pass validation when message is valid.", () => {
      const dto = { ...validAppHealthDetailsCheckDto, message: "All good" };

      expect(() => APP_HEALTH_DETAILS_CHECK_DTO.parse(dto)).not.toThrow();
    });

    it("should throw zod error when message is invalid.", () => {
      const dtoWithInvalidMessage = { ...validAppHealthDetailsCheckDto, message: 123 };

      expect(() => APP_HEALTH_DETAILS_CHECK_DTO.parse(dtoWithInvalidMessage)).toThrow(ZodError);
    });

    it("should pass validation when message is absent.", () => {
      const { message: _message, ...dtoWithoutMessage } = validAppHealthDetailsCheckDto;

      expect(() => APP_HEALTH_DETAILS_CHECK_DTO.parse(dtoWithoutMessage)).not.toThrow();
    });

    it("should have correct description when accessing description.", () => {
      expect(APP_HEALTH_DETAILS_CHECK_DTO.shape.message.description).toBe("Optional message providing additional information about the health status when it is not up");
    });

    it("should have correct metadata when accessing metadata.", () => {
      const expectedMetadata = {
        description: "Optional message providing additional information about the health status when it is not up",
        example: "Database connection failed.",
      };

      expect(APP_HEALTH_DETAILS_CHECK_DTO.shape.message.meta()).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("responseTime", () => {
    it("should pass validation when responseTime is valid.", () => {
      const dto = { ...validAppHealthDetailsCheckDto, responseTime: 200 };

      expect(() => APP_HEALTH_DETAILS_CHECK_DTO.parse(dto)).not.toThrow();
    });

    it("should throw zod error when responseTime is invalid.", () => {
      const dtoWithInvalidResponseTime = { ...validAppHealthDetailsCheckDto, responseTime: "fast" };

      expect(() => APP_HEALTH_DETAILS_CHECK_DTO.parse(dtoWithInvalidResponseTime)).toThrow(ZodError);
    });

    it("should pass validation when responseTime is absent.", () => {
      const { responseTime: _responseTime, ...dtoWithoutResponseTime } = validAppHealthDetailsCheckDto;

      expect(() => APP_HEALTH_DETAILS_CHECK_DTO.parse(dtoWithoutResponseTime)).not.toThrow();
    });

    it("should have correct description when accessing description.", () => {
      expect(APP_HEALTH_DETAILS_CHECK_DTO.shape.responseTime.description).toBe("Optional response time in milliseconds for the health check");
    });
  });
});