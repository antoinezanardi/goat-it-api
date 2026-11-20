import { SECONDS_TO_MILLISECONDS_FACTOR, THROTTLER_DEFAULT_TIER_NAME, THROTTLER_SUSTAINED_TIER_NAME } from "@src/infrastructure/api/server/throttler/constants/throttler.constants";

import type { ThrottlerModuleOptions, ThrottlerOptions } from "@nestjs/throttler";

import type { ThrottlerConfigFromEnv, ThrottlerTierConfigFromEnv } from "@src/infrastructure/api/config/types/config.types";

function createThrottlerOptions(name: string, tierConfig: ThrottlerTierConfigFromEnv): ThrottlerOptions {
  return {
    name,
    ttl: tierConfig.ttlSeconds * SECONDS_TO_MILLISECONDS_FACTOR,
    limit: tierConfig.limit,
  };
}

/**
 * Builds the `default` and `sustained` library tiers from the validated configuration, converting each window from seconds to the library's millisecond unit.
 *
 * No block duration is set, so every tier blocks for its own window length.
 */
function createThrottlerModuleOptions(throttlerConfig: ThrottlerConfigFromEnv): ThrottlerModuleOptions {
  return {
    throttlers: [
      createThrottlerOptions(THROTTLER_DEFAULT_TIER_NAME, throttlerConfig.default),
      createThrottlerOptions(THROTTLER_SUSTAINED_TIER_NAME, throttlerConfig.sustained),
    ],
  };
}

export { createThrottlerModuleOptions };