import { createZodDto } from "nestjs-zod";

import { API_RESPONSE_EXCEPTION_DTO } from "@shared/infrastructure/http/dto/api-response-exception/api-response-exception.schema";

class ApiResponseExceptionDto extends createZodDto(API_RESPONSE_EXCEPTION_DTO) {}

export { ApiResponseExceptionDto };