import { z } from "zod";

const DEFAULT_HOST = "0.0.0.0";

const DEFAULT_PORT = 3000;

const ENV_SCHEMA = z.object({
  PORT: z.coerce.number().default(DEFAULT_PORT),
  HOST: z.string().default(DEFAULT_HOST),
});

export { ENV_SCHEMA };