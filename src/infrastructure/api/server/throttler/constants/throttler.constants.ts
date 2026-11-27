import { HttpStatus } from "@nestjs/common";

import type { ApiResponseExceptionDto } from "@shared/application/dto/api-response-exception/api-response-exception.dto.shape";

const THROTTLER_DEFAULT_TIER_NAME = "default";

const THROTTLER_SUSTAINED_TIER_NAME = "sustained";

const THROTTLER_SKIPPED_TIERS: Record<string, boolean> = {
  [THROTTLER_DEFAULT_TIER_NAME]: true,
  [THROTTLER_SUSTAINED_TIER_NAME]: true,
};

const SECONDS_TO_MILLISECONDS_FACTOR = 1000;

const RETRY_AFTER_HEADER_NAME = "Retry-After";

const MINIMUM_RETRY_AFTER_SECONDS = 1;

const TOO_MANY_REQUESTS_ERROR_BODY: ApiResponseExceptionDto = {
  statusCode: HttpStatus.TOO_MANY_REQUESTS,
  error: "Too Many Requests",
  message: "Too many requests",
  errorCode: "too-many-requests",
};

export {
  THROTTLER_DEFAULT_TIER_NAME,
  THROTTLER_SUSTAINED_TIER_NAME,
  THROTTLER_SKIPPED_TIERS,
  SECONDS_TO_MILLISECONDS_FACTOR,
  RETRY_AFTER_HEADER_NAME,
  MINIMUM_RETRY_AFTER_SECONDS,
  TOO_MANY_REQUESTS_ERROR_BODY,
};