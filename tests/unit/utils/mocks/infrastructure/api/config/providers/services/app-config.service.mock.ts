import type { AppConfigService } from "@src/infrastructure/api/config/providers/services/app-config.service";

import { createFakeCorsConfigFromEnv, createFakeMongoDatabaseConfigFromEnv, createFakeServerConfigFromEnv } from "@faketories/infrastructure/api/config/config.faketory";

type MockedAppConfigService = {
  serverConfig: AppConfigService["serverConfig"];
  corsConfig: AppConfigService["corsConfig"];
  mongoDbConfig: AppConfigService["mongoDbConfig"];
};

function createMockedAppConfigService(appEnv: Partial<AppConfigService> = {}): MockedAppConfigService {
  return {
    serverConfig: createFakeServerConfigFromEnv(appEnv.serverConfig),
    corsConfig: createFakeCorsConfigFromEnv(appEnv.corsConfig),
    mongoDbConfig: createFakeMongoDatabaseConfigFromEnv(appEnv.mongoDbConfig),
  };
}

export { createMockedAppConfigService };