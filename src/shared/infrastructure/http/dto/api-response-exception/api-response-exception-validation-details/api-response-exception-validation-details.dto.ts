import { createZodDto } from "nestjs-zod";

import { API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO } from "@shared/infrastructure/http/dto/api-response-exception/api-response-exception-validation-details/api-response-exception-validation-details.dto.shape";

class ApiResponseExceptionValidationDetailsNestZodDto extends createZodDto(API_RESPONSE_EXCEPTION_VALIDATION_DETAILS_DTO) {}

export { ApiResponseExceptionValidationDetailsNestZodDto };