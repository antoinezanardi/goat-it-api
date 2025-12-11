import { ZodError } from "zod";

import type { AppHealthCheckDto, AppHealthCheckResultDto } from "@src/infrastructure/api/health/dto/app-health/app-health.dto";
import { APP_HEALTH_CHECK_RESULT_DTO, DOCS_ENDPOINT_HEALTH_CHECK_DTO, MONGOOSE_HEALTH_CHECK_DTO } from "@src/infrastructure/api/health/dto/app-health/app-health.dto";
import {
  HEALTH_DETAILS_STATUS_ENUM,
  MONGOOSE_HEALTH_KEY,
  DOCS_ENDPOINT_HEALTH_KEY,
} from "@src/infrastructure/api/health/constants/health.constants";

import { createFakeAppHealthCheckDto, createFakeAppHealthCheckResultDto } from "@faketories/infrastructure/api/health/health.faketory";

describe("App Health Dto", () => {
  let validAppHealthCheckResultDto: AppHealthCheckResultDto;
  let validAppHealthCheckDto: AppHealthCheckDto;

  beforeEach(() => {
    validAppHealthCheckResultDto = createFakeAppHealthCheckResultDto();
    validAppHealthCheckDto = createFakeAppHealthCheckDto();
  });

  it("should pass validation when assigned valid values.", () => {
    expect(() => APP_HEALTH_CHECK_RESULT_DTO.parse(validAppHealthCheckResultDto)).not.toThrowError();
  });

  describe("Mongoose Health Check Dto", () => {
    it("should throw a zod error when message is a non-string value.", () => {
      const invalid = Object.assign(validAppHealthCheckResultDto, {
        details: {
          [MONGOOSE_HEALTH_KEY]: { status: HEALTH_DETAILS_STATUS_ENUM[0], message: 123 },
          [DOCS_ENDPOINT_HEALTH_KEY]: validAppHealthCheckDto,
        },
      });

      expect(() => APP_HEALTH_CHECK_RESULT_DTO.parse(invalid)).toThrowError(ZodError);
    });

    describe("status", () => {
      it("should have correct description when accessing description.", () => {
        expect(MONGOOSE_HEALTH_CHECK_DTO.shape.status.description).toBe("Health status of the Mongoose (MongoDB) connection.");
      });
    });

    describe("message", () => {
      it("should have correct description when accessing description.", () => {
        expect(MONGOOSE_HEALTH_CHECK_DTO.shape.message.description).toBe("Optional message providing additional error information about the Mongoose connection health.");
      });

      it("should have correct metadata when accessing the meta.", () => {
        const expectedMetadata = {
          description: "Optional message providing additional error information about the Mongoose connection health.",
          example: "Failed to connect to MongoDB server.",
        };

        expect(MONGOOSE_HEALTH_CHECK_DTO.shape.message.meta()).toStrictEqual(expectedMetadata);
      });
    });
  });

  describe("Docs Endpoint Check Dto", () => {
    it("should throw a zod error when message is a non-string value.", () => {
      const invalid = Object.assign(validAppHealthCheckResultDto, {
        details: {
          [MONGOOSE_HEALTH_KEY]: validAppHealthCheckDto,
          [DOCS_ENDPOINT_HEALTH_KEY]: { status: HEALTH_DETAILS_STATUS_ENUM[0], message: 456 },
        },
      });

      expect(() => APP_HEALTH_CHECK_RESULT_DTO.parse(invalid)).toThrowError(ZodError);
    });

    describe("status", () => {
      it("should have correct description when accessing description.", () => {
        expect(DOCS_ENDPOINT_HEALTH_CHECK_DTO.shape.status.description).toBe("Health status of the API documentation endpoint.");
      });
    });

    describe("message", () => {
      it("should have correct description when accessing description.", () => {
        expect(DOCS_ENDPOINT_HEALTH_CHECK_DTO.shape.message.description).toBe("Optional message providing additional error information about the documentation endpoint health.");
      });

      it("should have correct metadata when accessing the meta.", () => {
        const expectedMetadata = {
          description: "Optional message providing additional error information about the documentation endpoint health.",
          example: "Documentation endpoint is unreachable.",
        };

        expect(DOCS_ENDPOINT_HEALTH_CHECK_DTO.shape.message.meta()).toStrictEqual(expectedMetadata);
      });
    });
  });

  describe("App Health Check Result Dto", () => {
    describe("status", () => {
      it("should have correct description when accessing description.", () => {
        expect(APP_HEALTH_CHECK_RESULT_DTO.shape.status.description).toBe("Overall health status of the application.");
      });
    });

    describe("details", () => {
      it("should have correct description when accessing description.", () => {
        expect(APP_HEALTH_CHECK_RESULT_DTO.shape.details.description).toBe("Detailed health status of individual components.");
      });
    });
  });
});