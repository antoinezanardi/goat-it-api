import { DEFAULT_CORS_CONFIG } from "@src/infrastructure/api/server/cors/constants/cors.constants";

import type { CorsConfigFromEnv } from "@src/infrastructure/api/config/types/config.types";
import type { CorsConfig } from "@src/infrastructure/api/server/cors/types/cors.types";

function createCorsConfig(corsConfigFromEnv: CorsConfigFromEnv): CorsConfig {
  return {
    origin: corsConfigFromEnv.origin,
    credentials: DEFAULT_CORS_CONFIG.credentials,
    methods: DEFAULT_CORS_CONFIG.methods,
    allowedHeaders: DEFAULT_CORS_CONFIG.allowedHeaders,
  };
}

export { createCorsConfig };