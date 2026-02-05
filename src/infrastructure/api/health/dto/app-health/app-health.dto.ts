import { createZodDto } from "nestjs-zod";

import { APP_HEALTH_DTO } from "@src/infrastructure/api/health/dto/app-health/app-health.dto.shape";

class AppHealthNestZodDto extends createZodDto(APP_HEALTH_DTO) {}

export { AppHealthNestZodDto };