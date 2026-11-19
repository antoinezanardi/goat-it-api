import { Global, Module } from "@nestjs/common";

import { APP_CONFIG_MODULE_READY } from "@src/infrastructure/api/config/helpers/config-module.helpers";
import { AppConfigService } from "@src/infrastructure/api/config/providers/services/app-config.service";

@Global()
@Module({
  imports: [APP_CONFIG_MODULE_READY],
  providers: [AppConfigService],
  exports: [AppConfigService],
})

class AppConfigModule {}

export { AppConfigModule };