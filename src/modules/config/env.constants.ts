import { z } from "zod";

const DEFAULT_PORT = 3000;

const ENV_SCHEMA = z.object({
  PORT: z.coerce.number().default(DEFAULT_PORT),
  HOST: z.string().default("http://localhost"),
});

export { ENV_SCHEMA };