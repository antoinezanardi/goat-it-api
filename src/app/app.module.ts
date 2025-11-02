import { Module } from "@nestjs/common";
import { LoggerModule } from "nestjs-pino";
import { AppConfigModule } from "@modules/config/config.module";

import { HealthModule } from "@src/infrastructure/api/health/health.module";
import { DatabaseModule } from "@src/infrastructure/database/database.module";

import { getLoggerConfiguration } from "@app/helpers/logger.helpers";
import { AppService } from "@app/providers/services/app.service";
import { AppController } from "@app/controllers/app.controller";

import { QuestionModule } from "@question/question.module";

@Module({
  imports: [AppConfigModule, LoggerModule.forRoot(getLoggerConfiguration()), HealthModule, DatabaseModule, QuestionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}