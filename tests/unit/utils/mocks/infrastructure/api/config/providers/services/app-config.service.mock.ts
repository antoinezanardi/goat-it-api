import { faker } from "@faker-js/faker";

import type { AppConfigService } from "@src/infrastructure/api/config/providers/services/app-config.service";

import { createFakeCorsConfigFromEnv, createFakeLocalizationConfigFromEnv, createFakeMongoDatabaseConfigFromEnv, createFakeServerConfigFromEnv } from "@faketories/infrastructure/api/config/config.faketory";

type MockedAppConfigService = {
  serverConfig: AppConfigService["serverConfig"];
  serverBaseUrl: AppConfigService["serverBaseUrl"];
  corsConfig: AppConfigService["corsConfig"];
  mongoDbConfig: AppConfigService["mongoDbConfig"];
  localizationConfig: AppConfigService["localizationConfig"];
};

function createMockedAppConfigService(appEnv: Partial<AppConfigService> = {}): MockedAppConfigService {
  return {
    serverConfig: createFakeServerConfigFromEnv(appEnv.serverConfig),
    serverBaseUrl: faker.internet.url(),
    corsConfig: createFakeCorsConfigFromEnv(appEnv.corsConfig),
    mongoDbConfig: createFakeMongoDatabaseConfigFromEnv(appEnv.mongoDbConfig),
    localizationConfig: createFakeLocalizationConfigFromEnv(appEnv.localizationConfig),
    ...appEnv,
  };
}

export { createMockedAppConfigService };