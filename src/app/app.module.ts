import { Module } from "@nestjs/common";
import { LoggerModule } from "nestjs-pino";

import { getLoggerConfiguration } from "@app/helpers/logger.helpers";
import { AppService } from "@app/providers/services/app.service";
import { AppController } from "@app/controllers/app.controller";

import { DatabaseModule } from "@modules/database/database.module";

@Module({
  imports: [
    LoggerModule.forRoot(getLoggerConfiguration()),
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}