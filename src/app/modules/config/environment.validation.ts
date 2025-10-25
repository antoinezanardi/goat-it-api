import { z } from "zod";

import type { ZodError } from "zod";

const DEFAULT_PORT = 3000;

const ENVIRONMENT_SCHEMA = z.object({
  PORT: z.coerce.number().default(DEFAULT_PORT),
});

const parseErrors = (error: ZodError): string => z.treeifyError(error).errors.join(" | ");

type Environment = z.infer<typeof ENVIRONMENT_SCHEMA>;

export { ENVIRONMENT_SCHEMA, parseErrors, type Environment };
