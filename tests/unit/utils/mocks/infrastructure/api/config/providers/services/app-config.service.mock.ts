import { faker } from "@faker-js/faker";

import type { AppConfigService } from "@src/infrastructure/api/config/providers/services/app-config.service";

import { createFakeAuthenticationConfigFromEnv, createFakeCorsConfigFromEnv, createFakeLocalizationConfigFromEnv, createFakeMongoDatabaseConfigFromEnv, createFakeServerConfigFromEnv } from "@faketories/infrastructure/api/config/config.faketory";

type MockedAppConfigService = {
  serverConfig: AppConfigService["serverConfig"];
  serverBaseUrl: AppConfigService["serverBaseUrl"];
  corsConfig: AppConfigService["corsConfig"];
  mongoDbConfig: AppConfigService["mongoDbConfig"];
  localizationConfig: AppConfigService["localizationConfig"];
  authenticationConfig: AppConfigService["authenticationConfig"];
};

function createMockedAppConfigService(appEnv: Partial<AppConfigService> = {}): MockedAppConfigService {
  return {
    serverConfig: createFakeServerConfigFromEnv(appEnv.serverConfig),
    serverBaseUrl: faker.internet.url(),
    corsConfig: createFakeCorsConfigFromEnv(appEnv.corsConfig),
    mongoDbConfig: createFakeMongoDatabaseConfigFromEnv(appEnv.mongoDbConfig),
    localizationConfig: createFakeLocalizationConfigFromEnv(appEnv.localizationConfig),
    authenticationConfig: createFakeAuthenticationConfigFromEnv(appEnv.authenticationConfig),
    ...appEnv,
  };
}

export { createMockedAppConfigService };