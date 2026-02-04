import { z } from "zod";

import { HEALTH_STATUS_ENUM } from "@src/infrastructure/api/health/constants/health.constants";
import { APP_HEALTH_DETAILS_DTO } from "@src/infrastructure/api/health/dto/app-health/app-health-details/app-health-details.schema";

const APP_HEALTH_DTO = z.strictObject({
  status: z.enum(HEALTH_STATUS_ENUM)
    .describe("Overall health status of the application"),
  details: APP_HEALTH_DETAILS_DTO
    .describe("Detailed health status of individual checked components"),
});

export { APP_HEALTH_DTO };
