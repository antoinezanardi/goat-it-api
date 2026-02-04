import { createZodDto } from "nestjs-zod";

import { APP_HEALTH_DETAILS_DTO } from "@src/infrastructure/api/health/dto/app-health/app-health-details/app-health-details.schema";

class AppHealthDetailsDto extends createZodDto(APP_HEALTH_DETAILS_DTO) {}

export { AppHealthDetailsDto };