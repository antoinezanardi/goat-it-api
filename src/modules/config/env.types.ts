import type { ENV_SCHEMA } from "@modules/config/env.constants";

import type { z } from "zod";

export type Env = z.infer<typeof ENV_SCHEMA>;