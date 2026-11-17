import { faker } from "@faker-js/faker";

import type { AppConfigService } from "@src/infrastructure/api/config/providers/services/app-config.service";

import { createFakeAuthenticationConfigFromEnv, createFakeCorsConfigFromEnv, createFakeLocalizationConfigFromEnv, createFakeMongoDatabaseConfigFromEnv, createFakeServerConfigFromEnv, createFakeThrottlerConfigFromEnv } from "@faketories/infrastructure/api/config/config.faketory";

type MockedAppConfigService = {
  serverConfig: AppConfigService["serverConfig"];
  serverBaseUrl: AppConfigService["serverBaseUrl"];
  corsConfig: AppConfigService["corsConfig"];
  mongoDbConfig: AppConfigService["mongoDbConfig"];
  localizationConfig: AppConfigService["localizationConfig"];
  throttlerConfig: AppConfigService["throttlerConfig"];
  authenticationConfig: AppConfigService["authenticationConfig"];
};

function createMockedAppConfigService(overrides: Partial<MockedAppConfigService> = {}): MockedAppConfigService {
  return {
    serverConfig: createFakeServerConfigFromEnv(),
    serverBaseUrl: faker.internet.url(),
    corsConfig: createFakeCorsConfigFromEnv(),
    mongoDbConfig: createFakeMongoDatabaseConfigFromEnv(),
    localizationConfig: createFakeLocalizationConfigFromEnv(),
    throttlerConfig: createFakeThrottlerConfigFromEnv(),
    authenticationConfig: createFakeAuthenticationConfigFromEnv(),
    ...overrides,
  };
}

export { createMockedAppConfigService };