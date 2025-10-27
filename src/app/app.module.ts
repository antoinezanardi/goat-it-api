import { Module } from "@nestjs/common";
import { LoggerModule } from "nestjs-pino";

import { getLoggerConfiguration } from "@app/helpers/logger.helpers";
import { AppService } from "@app/providers/services/app.service";
import { AppController } from "@app/controllers/app.controller";

import { AppConfigModule } from "@modules/config/config.module";

@Module({
  imports: [AppConfigModule, LoggerModule.forRoot(getLoggerConfiguration())],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}