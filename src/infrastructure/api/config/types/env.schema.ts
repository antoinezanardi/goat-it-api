import { z } from "zod";

import { DEFAULT_ENV_SERVER_HOST, DEFAULT_ENV_SERVER_PORT, DEFAULT_ENV_CORS_ORIGIN, DEFAULT_ENV_MONGODB_DATABASE, DEFAULT_ENV_MONGODB_HOST, DEFAULT_ENV_MONGODB_PORT } from "@src/infrastructure/api/config/types/env.constants";

const APP_ENV_SCHEMA = z.object({
  SERVER_HOST: z.string()
    .default(DEFAULT_ENV_SERVER_HOST),
  SERVER_PORT: z.coerce.number()
    .default(DEFAULT_ENV_SERVER_PORT),
  CORS_ORIGIN: z.string()
    .default(DEFAULT_ENV_CORS_ORIGIN),
  MONGODB_HOST: z.string()
    .default(DEFAULT_ENV_MONGODB_HOST),
  MONGODB_PORT: z.coerce.number()
    .default(DEFAULT_ENV_MONGODB_PORT),
  MONGODB_DATABASE: z.string()
    .default(DEFAULT_ENV_MONGODB_DATABASE),
});

export { APP_ENV_SCHEMA };