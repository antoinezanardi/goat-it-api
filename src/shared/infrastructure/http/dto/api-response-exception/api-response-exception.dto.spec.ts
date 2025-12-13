import { ZodError } from "zod";

import type { ApiResponseExceptionDto } from "@shared/infrastructure/http/dto/api-response-exception/api-response-exception.dto";
import { API_RESPONSE_EXCEPTION_DTO } from "@shared/infrastructure/http/dto/api-response-exception/api-response-exception.dto";

import { createFakeApiResponseExceptionDto } from "@faketories/shared/infrastructure/http/dto/api-response-exception/api-response-exception.faketory";

describe("Api Response Exception Dto", () => {
  let validApiResponseExceptionDto: ApiResponseExceptionDto;

  beforeEach(() => {
    validApiResponseExceptionDto = createFakeApiResponseExceptionDto();
  });

  it("should pass validation when assigned valid values.", () => {
    expect(() => API_RESPONSE_EXCEPTION_DTO.parse(validApiResponseExceptionDto)).not.toThrowError();
  });

  describe("statusCode", () => {
    it("should throw a zod error when assigned a non-number value.", () => {
      const invalidDto = Object.assign(validApiResponseExceptionDto, { statusCode: "invalid" });

      expect(() => API_RESPONSE_EXCEPTION_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(API_RESPONSE_EXCEPTION_DTO.shape.statusCode.description).toBe("HTTP status code of the error response.");
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const expectedMetadata = {
        description: "HTTP status code of the error response.",
        example: 400,
      };

      expect(API_RESPONSE_EXCEPTION_DTO.shape.statusCode.meta()).toStrictEqual(expectedMetadata);
    });
  });

  describe("message", () => {
    it("should throw a zod error when assigned a non-string value.", () => {
      const invalidDto = Object.assign(validApiResponseExceptionDto, { message: 123 });

      expect(() => API_RESPONSE_EXCEPTION_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(API_RESPONSE_EXCEPTION_DTO.shape.message.description).toBe("Error message.");
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const expectedMetadata = {
        description: "Error message.",
        example: "The request could not be understood by the server due to malformed syntax.",
      };

      expect(API_RESPONSE_EXCEPTION_DTO.shape.message.meta()).toStrictEqual(expectedMetadata);
    });
  });

  describe("error", () => {
    it("should throw a zod error when assigned a non-string value.", () => {
      const invalidDto = Object.assign(validApiResponseExceptionDto, { error: 123 });

      expect(() => API_RESPONSE_EXCEPTION_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(API_RESPONSE_EXCEPTION_DTO.shape.error.description).toBe("Short description of the HTTP error.");
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const expectedMetadata = {
        description: "Short description of the HTTP error.",
        example: "Bad Request",
      };

      expect(API_RESPONSE_EXCEPTION_DTO.shape.error.meta()).toStrictEqual(expectedMetadata);
    });
  });

  describe("validationDetails", () => {
    it("should throw a zod error when assigned a non-array value.", () => {
      const invalidDto = Object.assign(validApiResponseExceptionDto, { validationDetails: "invalid" });

      expect(() => API_RESPONSE_EXCEPTION_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(API_RESPONSE_EXCEPTION_DTO.shape.validationDetails.description).toBe("List of validation errors, when requested DTO validation fails.");
    });
  });
});