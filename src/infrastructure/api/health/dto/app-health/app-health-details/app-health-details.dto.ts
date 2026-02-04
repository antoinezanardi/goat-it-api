import { createZodDto } from "nestjs-zod";

import { APP_HEALTH_DETAILS_DTO } from "@src/infrastructure/api/health/dto/app-health/app-health-details/app-health-details.dto.shape";

class AppHealthDetailsNestZodDto extends createZodDto(APP_HEALTH_DETAILS_DTO) {}

export { AppHealthDetailsNestZodDto };