import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { validate } from "@modules/config/env.validation";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
  ],
})

export class AppConfigModule {}