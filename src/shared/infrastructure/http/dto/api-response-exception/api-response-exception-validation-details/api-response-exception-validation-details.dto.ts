import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO = z.strictObject({
  code: z.string()
    .describe("Validation error code")
    .meta({ example: "type_error" }),
  message: z.string()
    .describe("Validation error message")
    .meta({ example: "Expected type string but received type number" }),
  path: z.array(z.union([z.string(), z.number(), z.symbol()]))
    .describe("Path to the invalid property")
    .meta({ example: ["user", "age"] }),
  expected: z.string()
    .optional()
    .describe("Expected type of the invalid property value when applicable")
    .meta({ example: "string" }),
  origin: z.string()
    .optional()
    .describe("Origin type of the invalid property value when applicable")
    .meta({ example: "number" }),
  format: z.string()
    .optional()
    .describe("Expected high-level value format (e.g. 'uuid', 'email') when applicable")
    .meta({ example: "email" }),
  pattern: z.string()
    .optional()
    .describe("Expected regex pattern when applicable")
    .meta({ example: String.raw`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$` }),
  minimum: z.number()
    .optional()
    .describe("Expected minimum value when applicable")
    .meta({ example: 1 }),
  maximum: z.number()
    .optional()
    .describe("Expected maximum value when applicable")
    .meta({ example: 255 }),
  inclusive: z.boolean()
    .optional()
    .describe("Whether the minimum or maximum value is inclusive when applicable")
    .meta({ example: true }),
  keys: z.array(z.string())
    .optional()
    .describe("List unrecognized keys when applicable")
    .meta({ example: ["unexpectedKey1", "unexpectedKey2"] }),
  values: z.array(z.string())
    .optional()
    .describe("List unrecognized values when applicable")
    .meta({ example: ["unexpectedValue1", "unexpectedValue2"] }),
});

class ApiResponseExceptionValidationDetailsDto extends createZodDto(API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO) {}

export {
  API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO,
  ApiResponseExceptionValidationDetailsDto,
};