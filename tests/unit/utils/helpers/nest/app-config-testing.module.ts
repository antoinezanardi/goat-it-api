import { Global, Module } from "@nestjs/common";

import { AppConfigService } from "@src/infrastructure/api/config/providers/services/app-config.service";

import { createMockedAppConfigService } from "@mocks/infrastructure/api/config/providers/services/app-config.service.mock";

@Global()
@Module({
  providers: [
    {
      provide: AppConfigService,
      useValue: createMockedAppConfigService(),
    },
  ],
  exports: [AppConfigService],
})
class AppConfigTestingModule {}

export { AppConfigTestingModule };