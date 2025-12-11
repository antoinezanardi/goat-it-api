import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { DOCS_ENDPOINT_HEALTH_KEY, HEALTH_DETAILS_STATUS_ENUM, HEALTH_STATUS_ENUM, MONGOOSE_HEALTH_KEY } from "@src/infrastructure/api/health/constants/health.constants";

const MONGOOSE_HEALTH_CHECK_DTO = z.strictObject({
  status: z.enum(HEALTH_DETAILS_STATUS_ENUM)
    .describe("Health status of the Mongoose (MongoDB) connection."),
  message: z.string()
    .optional()
    .describe("Optional message providing additional error information about the Mongoose connection health.")
    .meta({ example: "Failed to connect to MongoDB server." }),
});

const DOCS_ENDPOINT_HEALTH_CHECK_DTO = z.strictObject({
  status: z.enum(HEALTH_DETAILS_STATUS_ENUM)
    .describe("Health status of the API documentation endpoint."),
  message: z.string()
    .optional()
    .describe("Optional message providing additional error information about the documentation endpoint health.")
    .meta({ example: "Documentation endpoint is unreachable." }),
});

const APP_HEALTH_CHECK_RESULT_DTO = z.object({
  status: z.enum(HEALTH_STATUS_ENUM)
    .describe("Overall health status of the application."),
  details: z.strictObject({
    [MONGOOSE_HEALTH_KEY]: MONGOOSE_HEALTH_CHECK_DTO,
    [DOCS_ENDPOINT_HEALTH_KEY]: DOCS_ENDPOINT_HEALTH_CHECK_DTO,
  }).describe("Detailed health status of individual components."),
});

class AppHealthCheckDto extends createZodDto(MONGOOSE_HEALTH_CHECK_DTO) {}

// oxlint-disable-next-line max-classes-per-file
class AppHealthCheckResultDto extends createZodDto(APP_HEALTH_CHECK_RESULT_DTO) {}

export {
  MONGOOSE_HEALTH_CHECK_DTO,
  DOCS_ENDPOINT_HEALTH_CHECK_DTO,
  APP_HEALTH_CHECK_RESULT_DTO,
  AppHealthCheckDto,
  AppHealthCheckResultDto,
};