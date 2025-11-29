import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { getEnvFilePath, validate } from "@src/infrastructure/api/config/helpers/env.helpers";
import { AppConfigService } from "@src/infrastructure/api/config/providers/services/app-config.service";

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
      envFilePath: getEnvFilePath(),
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})

export class AppConfigModule {}