import { z } from "zod";

import { API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO } from "@shared/infrastructure/http/dto/api-response-exception/api-response-exception-validation-details/api-response-exception-validation-details.schema";

const API_RESPONSE_EXCEPTION_DTO = z.strictObject({
  statusCode: z.number()
    .describe("HTTP status code of the error response")
    .meta({ example: 400 }),
  message: z.string()
    .describe("Error message")
    .meta({ example: "The request could not be understood by the server due to malformed syntax." }),
  error: z.string()
    .describe("Short description of the HTTP error")
    .meta({ example: "Bad Request" }),
  validationDetails: z.array(API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO)
    .optional()
    .describe("List of validation errors, when requested DTO validation fails"),
});

export { API_RESPONSE_EXCEPTION_DTO };