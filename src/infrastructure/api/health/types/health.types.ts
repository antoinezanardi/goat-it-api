import type { APP_HEALTH_CHECK_RESULT_DTO } from "@src/infrastructure/api/health/dto/app-health/app-health.dto";

import type { z } from "zod";

type AppHealthCheckResult = z.infer<typeof APP_HEALTH_CHECK_RESULT_DTO>;

export type { AppHealthCheckResult };