import { createZodDto } from "nestjs-zod";

import { API_RESPONSE_EXCEPTION_DTO } from "@shared/infrastructure/http/dto/api-response-exception/api-response-exception.dto.shape";

class ApiResponseExceptionNestZodDto extends createZodDto(API_RESPONSE_EXCEPTION_DTO) {}

export { ApiResponseExceptionNestZodDto };