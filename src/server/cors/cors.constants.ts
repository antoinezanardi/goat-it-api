import type { CorsConfig } from "@src/server/cors/cors.types";

const DEFAULT_CORS_CONFIG: CorsConfig = {
  origin: "*",
  credentials: false,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

export { DEFAULT_CORS_CONFIG };