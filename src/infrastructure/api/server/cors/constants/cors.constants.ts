import type { CorsConfig } from "@src/infrastructure/api/server/cors/types/cors.types";

const DEFAULT_CORS_CONFIG = {
  origin: "*",
  credentials: false,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
} as const satisfies CorsConfig;

export { DEFAULT_CORS_CONFIG };