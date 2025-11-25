import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { getEnvFilePath, validate } from "@src/infrastructure/api/config/helpers/env.helpers";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
      envFilePath: getEnvFilePath(),
    }),
  ],
})

export class AppConfigModule {}