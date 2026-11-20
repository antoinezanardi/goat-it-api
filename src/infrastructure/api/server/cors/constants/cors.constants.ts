import { REQUEST_ID_RESPONSE_HEADER_NAME } from "@src/infrastructure/api/server/request-id/constants/request-id.constants";

import type { CorsConfig } from "@src/infrastructure/api/server/cors/types/cors.types";

const DEFAULT_CORS_CONFIG = {
  origin: "*",
  credentials: false,
  methods: ["GET", "POST", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: [REQUEST_ID_RESPONSE_HEADER_NAME],
} as const satisfies CorsConfig;

export { DEFAULT_CORS_CONFIG };