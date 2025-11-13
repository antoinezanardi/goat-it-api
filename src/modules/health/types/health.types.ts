import { createZodDto } from "nestjs-zod";

import { HEALTH_CHECK_RESULT_SCHEMA } from "@modules/health/constants/health.constants";

import type { z } from "zod";

type AppHealthCheckResult = z.infer<typeof HEALTH_CHECK_RESULT_SCHEMA>;

class GetAppHealthCheckResultResponseDto extends createZodDto(HEALTH_CHECK_RESULT_SCHEMA) {}

export type { AppHealthCheckResult };

export { GetAppHealthCheckResultResponseDto };