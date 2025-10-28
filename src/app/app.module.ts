import { Module } from "@nestjs/common";
import { LoggerModule } from "nestjs-pino";

import { getLoggerConfiguration } from "@app/helpers/logger.helpers";
import { AppService } from "@app/providers/services/app.service";
import { AppController } from "@app/controllers/app.controller";

@Module({
  imports: [LoggerModule.forRoot(getLoggerConfiguration())],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}