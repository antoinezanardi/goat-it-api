import { DEFAULT_CORS_CONFIG } from "@server/cors/cors.constants";

import type { CorsConfig } from "@src/server/cors/cors.types";

function buildCorsConfig(): CorsConfig {
  return {
    origin: process.env.CORS_ORIGIN ?? DEFAULT_CORS_CONFIG.origin,
    credentials: process.env.CORS_CREDENTIALS === "true",
    methods: DEFAULT_CORS_CONFIG.methods,
    allowedHeaders: DEFAULT_CORS_CONFIG.allowedHeaders,
  };
}

export { buildCorsConfig };