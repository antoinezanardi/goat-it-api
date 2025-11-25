import { z } from "zod";

const DEFAULT_ENV_HOST = "0.0.0.0";

const DEFAULT_ENV_PORT = 3000;

const DEFAULT_ENV_CORS_ORIGIN = "*";

const ENV_SCHEMA = z.object({
  PORT: z.coerce.number().default(DEFAULT_ENV_PORT),
  HOST: z.string().default(DEFAULT_ENV_HOST),
  CORS_ORIGIN: z.string().default(DEFAULT_ENV_CORS_ORIGIN),
});

export { ENV_SCHEMA };