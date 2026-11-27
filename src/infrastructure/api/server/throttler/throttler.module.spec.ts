import { APP_GUARD, Reflector } from "@nestjs/core";
import { Test } from "@nestjs/testing";
import { getOptionsToken, ThrottlerStorage, ThrottlerStorageService } from "@nestjs/throttler";

import { AppConfigService } from "@src/infrastructure/api/config/providers/services/app-config.service";
import { THROTTLER_DEFAULT_TIER_NAME, THROTTLER_SUSTAINED_TIER_NAME } from "@src/infrastructure/api/server/throttler/constants/throttler.constants";
import { ApiThrottlerGuard } from "@src/infrastructure/api/server/throttler/providers/guards/api-throttler/api-throttler.guard";
import { ApiThrottlerModule } from "@src/infrastructure/api/server/throttler/throttler.module";

import { AppConfigTestingModule } from "@unit-tests/utils/helpers/nest/app-config-testing.module";

import { createMockedAppConfigService } from "@mocks/infrastructure/api/config/providers/services/app-config.service.mock";

import type { TestingModule } from "@nestjs/testing";
import type { ThrottlerModuleOptions } from "@nestjs/throttler";
import type { ThrottlerConfigFromEnv } from "@src/infrastructure/api/config/types/config.types";

describe(ApiThrottlerModule, () => {
  const throttlerConfig: ThrottlerConfigFromEnv = {
    default: { ttlSeconds: 2, limit: 40 },
    sustained: { ttlSeconds: 90, limit: 900 },
  };
  let module: TestingModule;

  beforeEach(async() => {
    module = await Test.createTestingModule({ imports: [AppConfigTestingModule, ApiThrottlerModule] })
      .overrideProvider(AppConfigService)
      .useValue(createMockedAppConfigService({ throttlerConfig }))
      .compile();
  });

  afterEach(async() => {
    await module.close();
  });

  it("should register the api throttler guard as an application guard when the module metadata is read.", () => {
    const reflector = new Reflector();

    expect(reflector.get("providers", ApiThrottlerModule)).toContainEqual({ provide: APP_GUARD, useClass: ApiThrottlerGuard });
  });

  it("should build the two named throttler tiers in milliseconds from the validated configuration when the module graph is compiled.", () => {
    const expectedOptions: ThrottlerModuleOptions = {
      throttlers: [
        { name: THROTTLER_DEFAULT_TIER_NAME, ttl: 2000, limit: 40 },
        { name: THROTTLER_SUSTAINED_TIER_NAME, ttl: 90_000, limit: 900 },
      ],
    };

    expect(module.get<ThrottlerModuleOptions>(getOptionsToken())).toStrictEqual(expectedOptions);
  });

  it("should provide the in-memory throttler storage when the module graph is compiled.", () => {
    expect(module.get(ThrottlerStorage)).toBeInstanceOf(ThrottlerStorageService);
  });
});