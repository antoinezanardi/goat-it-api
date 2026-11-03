const MONGOOSE_HEALTH_KEY = "mongoose";

const DOCS_ENDPOINT_HEALTH_KEY = "goat-it-docs";

const HEALTH_STATUS_ENUM = ["ok", "error", "degraded", "shutting_down"] as const;

const HEALTH_DETAILS_STATUS_ENUM = ["up", "degraded", "down"] as const;

const HEALTH_CACHE_CONTROL_VALUE = "no-store";

const HEALTH_CHECK_UNAVAILABLE_MESSAGE = "Application is not ready yet";

export {
  MONGOOSE_HEALTH_KEY,
  DOCS_ENDPOINT_HEALTH_KEY,
  HEALTH_STATUS_ENUM,
  HEALTH_DETAILS_STATUS_ENUM,
  HEALTH_CACHE_CONTROL_VALUE,
  HEALTH_CHECK_UNAVAILABLE_MESSAGE,
};