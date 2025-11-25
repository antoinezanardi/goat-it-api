import type { ENV_SCHEMA } from "@src/infrastructure/api/config/constants/env.constants";

import type { z } from "zod";

export type AppEnv = z.infer<typeof ENV_SCHEMA>;