import type { APP_ENV_SCHEMA } from "@src/infrastructure/api/config/types/env.schema";

import type { z } from "zod";

type AppEnv = z.infer<typeof APP_ENV_SCHEMA>;

export type { AppEnv };