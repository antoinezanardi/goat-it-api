const MONGOOSE_HEALTH_KEY = "mongoose";

const DOCS_ENDPOINT_HEALTH_KEY = "goat-it-docs";

const HEALTH_STATUS_ENUM = ["ok", "error", "degraded", "shutting_down"] as const;

const HEALTH_DETAILS_STATUS_ENUM = ["up", "degraded", "down"] as const;

export {
  MONGOOSE_HEALTH_KEY,
  DOCS_ENDPOINT_HEALTH_KEY,
  HEALTH_STATUS_ENUM,
  HEALTH_DETAILS_STATUS_ENUM,
};