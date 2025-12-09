import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO } from "@shared/infrastructure/http/dto/api-response-exception/api-response-exception-validation-details/api-response-exception-validation-details.dto";

const API_RESPONSE_EXCEPTION_DTO = z.strictObject({
  statusCode: z.number()
    .describe("HTTP status code of the error response."),
  message: z.string()
    .describe("Error message."),
  error: z.string()
    .describe("Short description of the HTTP error."),
  validationDetails: z.array(API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO)
    .optional()
    .describe("List of validation errors, when requested DTO validation fails."),
});

class ApiResponseExceptionDto extends createZodDto(API_RESPONSE_EXCEPTION_DTO) {}

export {
  API_RESPONSE_EXCEPTION_DTO,
  ApiResponseExceptionDto,
};