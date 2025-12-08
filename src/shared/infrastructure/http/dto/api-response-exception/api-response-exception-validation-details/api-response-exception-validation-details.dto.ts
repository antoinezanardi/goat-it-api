import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO = z.strictObject({
  code: z.string()
    .describe("Validation error code."),
  message: z.string()
    .describe("Validation error message."),
  expected: z.optional(z.string())
    .describe("Expected value or condition."),
  path: z.array(z.union([z.string(), z.number(), z.symbol()]))
    .describe("Path to the invalid property."),
});

class ApiResponseExceptionValidationDetailsDto extends createZodDto(API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO) {}

export {
  API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO,
  ApiResponseExceptionValidationDetailsDto,
};