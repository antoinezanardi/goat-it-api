import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { HEALTH_DETAILS_STATUS_ENUM } from "@src/infrastructure/api/health/constants/health.constants";

const APP_HEALTH_DETAILS_CHECK_DTO = z.strictObject({
  status: z.enum(HEALTH_DETAILS_STATUS_ENUM)
    .describe("Health status of the component"),
  message: z.string()
    .optional()
    .describe("Optional message providing additional information about the health status when it is not up")
    .meta({ example: "Database connection failed." }),
});

class AppHealthDetailsCheckDto extends createZodDto(APP_HEALTH_DETAILS_CHECK_DTO) {}

export {
  APP_HEALTH_DETAILS_CHECK_DTO,
  AppHealthDetailsCheckDto,
};