import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { getEnvFilePath, validate } from "@src/infrastructure/api/config/helpers/env.helpers";
import { AppConfigService } from "@src/infrastructure/api/config/providers/services/app-config.service";

const APP_CONFIG_MODULE_READY = ConfigModule.forRoot({
  isGlobal: true,
  validate,
  envFilePath: getEnvFilePath(),
});

@Global()
@Module({
  imports: [APP_CONFIG_MODULE_READY],
  providers: [AppConfigService],
  exports: [AppConfigService],
})

class AppConfigModule {}

export {
  AppConfigModule,
  APP_CONFIG_MODULE_READY,
};