import { z } from "zod";

import { APP_HEALTH_DETAILS_CHECK_DTO } from "@src/infrastructure/api/health/dto/app-health/app-health-details/app-health-details-check/app-health-details-check.schema";
import { DOCS_ENDPOINT_HEALTH_KEY, MONGOOSE_HEALTH_KEY } from "@src/infrastructure/api/health/constants/health.constants";

const APP_HEALTH_DETAILS_DTO = z.strictObject({
  [MONGOOSE_HEALTH_KEY]: APP_HEALTH_DETAILS_CHECK_DTO
    .describe("Health details of the Mongoose (MongoDB) connection"),
  [DOCS_ENDPOINT_HEALTH_KEY]: APP_HEALTH_DETAILS_CHECK_DTO
    .describe("Health details of the API Documentation endpoint"),
});

export { APP_HEALTH_DETAILS_DTO };
