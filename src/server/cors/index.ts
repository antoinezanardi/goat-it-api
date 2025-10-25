import type { CorsConfig } from "@server/types/cors.types";

const DEFAULT_CORS_CONFIG: CorsConfig = {
  origin: "*",
  credentials: false,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// eslint-disable-next-line @typescript-eslint/naming-convention
const buildCorsConfig = (): CorsConfig => ({
  origin: process.env.CORS_ORIGIN ?? DEFAULT_CORS_CONFIG.origin,
  credentials: process.env.CORS_CREDENTIALS === "true",
  methods: DEFAULT_CORS_CONFIG.methods,
  allowedHeaders: DEFAULT_CORS_CONFIG.allowedHeaders,
});

export { buildCorsConfig, DEFAULT_CORS_CONFIG };