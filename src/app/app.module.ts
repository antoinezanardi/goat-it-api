import { Module } from "@nestjs/common";
import { LoggerModule } from "nestjs-pino";

import { HealthModule } from "@src/infrastructure/api/health/health.module";
import { DatabaseModule } from "@src/infrastructure/database/database.module";

import { getLoggerConfiguration } from "@app/helpers/logger.helpers";
import { AppService } from "@app/providers/services/app.service";
import { AppController } from "@app/controllers/app.controller";

@Module({
  imports: [
    LoggerModule.forRoot(getLoggerConfiguration()),
    HealthModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}