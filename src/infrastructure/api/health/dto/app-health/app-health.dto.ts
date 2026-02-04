import { createZodDto } from "nestjs-zod";

import { APP_HEALTH_DTO } from "@src/infrastructure/api/health/dto/app-health/app-health.schema";

class AppHealthDto extends createZodDto(APP_HEALTH_DTO) {}

export { AppHealthDto };