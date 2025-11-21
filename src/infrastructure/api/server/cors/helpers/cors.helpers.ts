import { DEFAULT_CORS_CONFIG } from "@src/infrastructure/api/server/cors/constants/cors.constants";

import type { CorsConfig } from "@src/infrastructure/api/server/cors/types/cors.types";

function createCorsConfig(): CorsConfig {
  return {
    origin: process.env.CORS_ORIGIN ?? DEFAULT_CORS_CONFIG.origin,
    credentials: process.env.CORS_CREDENTIALS === "true",
    methods: DEFAULT_CORS_CONFIG.methods,
    allowedHeaders: DEFAULT_CORS_CONFIG.allowedHeaders,
  };
}

export { createCorsConfig };