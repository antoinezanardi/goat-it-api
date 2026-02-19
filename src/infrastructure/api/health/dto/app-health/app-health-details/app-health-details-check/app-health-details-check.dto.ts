import { createZodDto } from "nestjs-zod";

import { APP_HEALTH_DETAILS_CHECK_DTO } from "@src/infrastructure/api/health/dto/app-health/app-health-details/app-health-details-check/app-health-details-check.dto.shape";

class AppHealthDetailsCheckNestZodDto extends createZodDto(APP_HEALTH_DETAILS_CHECK_DTO) {}

export { AppHealthDetailsCheckNestZodDto };