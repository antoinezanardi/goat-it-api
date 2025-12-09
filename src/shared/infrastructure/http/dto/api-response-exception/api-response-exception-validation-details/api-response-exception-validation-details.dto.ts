import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO = z.strictObject({
  code: z.string()
    .describe("Validation error code."),
  message: z.string()
    .describe("Validation error message."),
  path: z.array(z.union([z.string(), z.number(), z.symbol()]))
    .describe("Path to the invalid property."),
  expected: z.string()
    .optional()
    .describe("Expected type of the invalid property value when applicable."),
  origin: z.string()
    .optional()
    .describe("Origin type of the invalid property value when applicable."),
  format: z.string()
    .optional()
    .describe("Expected high-level value format (e.g. 'uuid', 'email') when applicable."),
  pattern: z.string()
    .optional()
    .describe("Expected regex pattern when applicable."),
});

class ApiResponseExceptionValidationDetailsDto extends createZodDto(API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO) {}

export {
  API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO,
  ApiResponseExceptionValidationDetailsDto,
};