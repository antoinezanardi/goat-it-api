import { z } from "zod";

import { HEALTH_DETAILS_STATUS_ENUM } from "@src/infrastructure/api/health/constants/health.constants";

const APP_HEALTH_DETAILS_CHECK_DTO = z.strictObject({
  status: z.enum(HEALTH_DETAILS_STATUS_ENUM)
    .describe("Health status of the component"),
  message: z.string()
    .optional()
    .describe("Optional message providing additional information about the health status when it is not up")
    .meta({ example: "Database connection failed." }),
  responseTime: z.number()
    .optional()
    .describe("Optional response time in milliseconds for the health check"),
});

export type AppHealthDetailsCheckDto = z.infer<typeof APP_HEALTH_DETAILS_CHECK_DTO>;

export { APP_HEALTH_DETAILS_CHECK_DTO };