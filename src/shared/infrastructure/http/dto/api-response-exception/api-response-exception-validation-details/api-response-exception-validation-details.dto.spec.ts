import { ZodError } from "zod";

import type { ApiResponseExceptionValidationDetailsDto } from "@shared/infrastructure/http/dto/api-response-exception/api-response-exception-validation-details/api-response-exception-validation-details.dto";
import { API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO } from "@shared/infrastructure/http/dto/api-response-exception/api-response-exception-validation-details/api-response-exception-validation-details.dto";

import { createFakeApiResponseExceptionValidationDetailsDto } from "@faketories/shared/infrastructure/http/dto/api-response-exception/api-response-exception.faketory";

describe("Api Response Exception Validation Details Dto", () => {
  let validApiResponseExceptionValidationDetailsDto: ApiResponseExceptionValidationDetailsDto;

  beforeEach(() => {
    validApiResponseExceptionValidationDetailsDto = createFakeApiResponseExceptionValidationDetailsDto();
  });

  it("should pass validation when assigned valid values.", () => {
    expect(() => API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO.parse(validApiResponseExceptionValidationDetailsDto)).not.toThrowError();
  });

  describe("code", () => {
    it("should throw a zod error when assigned a non-string value.", () => {
      const invalidDto = Object.assign(validApiResponseExceptionValidationDetailsDto, { code: 123 });

      expect(() => API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO.shape.code.description).toBe("Validation error code");
    });

    it("should have correct metadata when accessing the meta.", () => {
      const expectedMetadata = {
        description: "Validation error code",
        example: "type_error",
      };

      expect(API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO.shape.code.meta()).toStrictEqual(expectedMetadata);
    });
  });

  describe("message", () => {
    it("should throw a zod error when assigned a non-string value.", () => {
      const invalidDto = Object.assign(validApiResponseExceptionValidationDetailsDto, { message: 456 });

      expect(() => API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO.shape.message.description).toBe("Validation error message");
    });

    it("should have correct metadata when accessing the meta.", () => {
      const expectedMetadata = {
        description: "Validation error message",
        example: "Expected type string but received type number",
      };

      expect(API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO.shape.message.meta()).toStrictEqual(expectedMetadata);
    });
  });

  describe("path", () => {
    it("should throw a zod error when assigned a non-array value.", () => {
      const invalidDto = Object.assign(validApiResponseExceptionValidationDetailsDto, { path: "not-an-array" });

      expect(() => API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should throw a zod error when array items are of invalid types.", () => {
      const invalidDto = Object.assign(validApiResponseExceptionValidationDetailsDto, { path: ["valid", { obj: true }] });

      expect(() => API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO.shape.path.description).toBe("Path to the invalid property");
    });

    it("should have correct metadata when accessing the meta.", () => {
      const expectedMetadata = {
        description: "Path to the invalid property",
        example: ["user", "age"],
      };

      expect(API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO.shape.path.meta()).toStrictEqual(expectedMetadata);
    });
  });

  describe("expected", () => {
    it("should throw a zod error when assigned a non-string value (when present).", () => {
      const invalidDto = Object.assign(validApiResponseExceptionValidationDetailsDto, { expected: 789 });

      expect(() => API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO.shape.expected.description).toBe("Expected type of the invalid property value when applicable");
    });

    it("should have correct metadata when accessing the meta.", () => {
      const expectedMetadata = {
        description: "Expected type of the invalid property value when applicable",
        example: "string",
      };

      expect(API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO.shape.expected.meta()).toStrictEqual(expectedMetadata);
    });
  });

  describe("origin", () => {
    it("should throw a zod error when assigned a non-string value (when present).", () => {
      const invalidDto = Object.assign(validApiResponseExceptionValidationDetailsDto, { origin: 123 });

      expect(() => API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO.shape.origin.description).toBe("Origin type of the invalid property value when applicable");
    });

    it("should have correct metadata when accessing the meta.", () => {
      const expectedMetadata = {
        description: "Origin type of the invalid property value when applicable",
        example: "number",
      };

      expect(API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO.shape.origin.meta()).toStrictEqual(expectedMetadata);
    });
  });

  describe("format", () => {
    it("should throw a zod error when assigned a non-string value (when present).", () => {
      const invalidDto = Object.assign(validApiResponseExceptionValidationDetailsDto, { format: true });

      expect(() => API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO.shape.format.description).toBe("Expected high-level value format (e.g. 'uuid', 'email') when applicable");
    });

    it("should have correct metadata when accessing the meta.", () => {
      const expectedMetadata = {
        description: "Expected high-level value format (e.g. 'uuid', 'email') when applicable",
        example: "email",
      };

      expect(API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO.shape.format.meta()).toStrictEqual(expectedMetadata);
    });
  });

  describe("pattern", () => {
    it("should throw a zod error when assigned a non-string value (when present).", () => {
      const invalidDto = Object.assign(validApiResponseExceptionValidationDetailsDto, { pattern: 123 });

      expect(() => API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO.shape.pattern.description).toBe("Expected regex pattern when applicable");
    });

    it("should have correct metadata when accessing the meta.", () => {
      const expectedMetadata = {
        description: "Expected regex pattern when applicable",
        example: String.raw`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$`,
      };

      expect(API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO.shape.pattern.meta()).toStrictEqual(expectedMetadata);
    });
  });

  describe("minimum", () => {
    it("should throw a zod error when assigned a non-number value (when present).", () => {
      const invalidDto = Object.assign(validApiResponseExceptionValidationDetailsDto, { minimum: "NaN" });

      expect(() => API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO.shape.minimum.description).toBe("Expected minimum value when applicable");
    });

    it("should have correct metadata when accessing the meta.", () => {
      const expectedMetadata = {
        description: "Expected minimum value when applicable",
        example: 1,
      };

      expect(API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO.shape.minimum.meta()).toStrictEqual(expectedMetadata);
    });
  });

  describe("maximum", () => {
    it("should throw a zod error when assigned a non-number value (when present).", () => {
      const invalidDto = Object.assign(validApiResponseExceptionValidationDetailsDto, { maximum: "NaN" });

      expect(() => API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO.shape.maximum.description).toBe("Expected maximum value when applicable");
    });

    it("should have correct metadata when accessing the meta.", () => {
      const expectedMetadata = {
        description: "Expected maximum value when applicable",
        example: 255,
      };

      expect(API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO.shape.maximum.meta()).toStrictEqual(expectedMetadata);
    });
  });

  describe("inclusive", () => {
    it("should throw a zod error when assigned a non-boolean value (when present).", () => {
      const invalidDto = Object.assign(validApiResponseExceptionValidationDetailsDto, { inclusive: "true" });

      expect(() => API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO.shape.inclusive.description).toBe("Whether the minimum or maximum value is inclusive when applicable");
    });

    it("should have correct metadata when accessing the meta.", () => {
      const expectedMetadata = {
        description: "Whether the minimum or maximum value is inclusive when applicable",
        example: true,
      };

      expect(API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO.shape.inclusive.meta()).toStrictEqual(expectedMetadata);
    });
  });

  describe("keys", () => {
    it("should throw a zod error when assigned a non-array value (when present).", () => {
      const invalidDto = Object.assign(validApiResponseExceptionValidationDetailsDto, { keys: "not-an-array" });

      expect(() => API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should throw a zod error when array items are not strings.", () => {
      const invalidDto = Object.assign(validApiResponseExceptionValidationDetailsDto, { keys: ["a", 2] });

      expect(() => API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO.shape.keys.description).toBe("List unrecognized keys when applicable");
    });

    it("should have correct metadata when accessing the meta.", () => {
      const expectedMetadata = {
        description: "List unrecognized keys when applicable",
        example: ["unexpectedKey1", "unexpectedKey2"],
      };

      expect(API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO.shape.keys.meta()).toStrictEqual(expectedMetadata);
    });
  });

  describe("values", () => {
    it("should throw a zod error when assigned a non-array value (when present).", () => {
      const invalidDto = Object.assign(validApiResponseExceptionValidationDetailsDto, { values: "not-an-array" });

      expect(() => API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should throw a zod error when array items are not strings.", () => {
      const invalidDto = Object.assign(validApiResponseExceptionValidationDetailsDto, { values: ["a", 2] });

      expect(() => API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO.parse(invalidDto)).toThrowError(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO.shape.values.description).toBe("List unrecognized values when applicable");
    });

    it("should have correct metadata when accessing the meta.", () => {
      const expectedMetadata = {
        description: "List unrecognized values when applicable",
        example: ["unexpectedValue1", "unexpectedValue2"],
      };

      expect(API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO.shape.values.meta()).toStrictEqual(expectedMetadata);
    });
  });
});