import { createThrottlerModuleOptions } from "@src/infrastructure/api/server/throttler/helpers/throttler.helpers";

import { createFakeThrottlerConfigFromEnv } from "@faketories/infrastructure/api/config/config.faketory";

import type { ThrottlerModuleOptions } from "@nestjs/throttler";

describe(createThrottlerModuleOptions, () => {
  it("should return the two named tiers with millisecond windows when called.", () => {
    const throttlerConfig = createFakeThrottlerConfigFromEnv({
      default: { ttlSeconds: 1, limit: 20 },
      sustained: { ttlSeconds: 60, limit: 300 },
    });
    const expectedOptions: ThrottlerModuleOptions = {
      throttlers: [
        { name: "default", ttl: 1000, limit: 20 },
        { name: "sustained", ttl: 60_000, limit: 300 },
      ],
    };

    expect(createThrottlerModuleOptions(throttlerConfig)).toStrictEqual(expectedOptions);
  });

  it("should convert each tier window from seconds to milliseconds independently when called.", () => {
    const throttlerConfig = createFakeThrottlerConfigFromEnv({
      default: { ttlSeconds: 2, limit: 7 },
      sustained: { ttlSeconds: 90, limit: 4321 },
    });
    const expectedOptions: ThrottlerModuleOptions = {
      throttlers: [
        { name: "default", ttl: 2000, limit: 7 },
        { name: "sustained", ttl: 90_000, limit: 4321 },
      ],
    };

    expect(createThrottlerModuleOptions(throttlerConfig)).toStrictEqual(expectedOptions);
  });
});