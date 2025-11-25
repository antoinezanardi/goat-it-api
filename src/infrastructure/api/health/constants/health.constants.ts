import { z } from "zod";

const MONGOOSE_HEALTH_KEY = "mongoose";

const DOCS_ENDPOINT_HEALTH_KEY = "goat-it-docs";

const HEALTH_STATUS_ENUM = ["ok", "error", "shutting_down"] as const;

const HEALTH_DETAILS_STATUS_ENUM = ["up", "down"] as const;

const HEALTH_CHECK_RESULT_SCHEMA = z.object({
  status: z.enum(HEALTH_STATUS_ENUM),
  details: z.object({
    [MONGOOSE_HEALTH_KEY]: z.object({
      status: z.enum(HEALTH_DETAILS_STATUS_ENUM),
    }),
    [DOCS_ENDPOINT_HEALTH_KEY]: z.object({
      status: z.enum(HEALTH_DETAILS_STATUS_ENUM),
    }),
  }),
});

export {
  MONGOOSE_HEALTH_KEY,
  DOCS_ENDPOINT_HEALTH_KEY,
  HEALTH_CHECK_RESULT_SCHEMA,
};