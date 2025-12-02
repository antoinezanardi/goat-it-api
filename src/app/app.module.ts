import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { LoggerModule } from "nestjs-pino";

import { AppConfigModule } from "@src/infrastructure/api/config/config.module";
import { HealthModule } from "@src/infrastructure/api/health/health.module";
import { DatabaseModule } from "@src/infrastructure/database/database.module";

import { AppController } from "@app/controllers/app.controller";
import { getLoggerConfiguration } from "@app/helpers/logger.helpers";
import { AppService } from "@app/providers/services/app.service";

import { LocalizationMiddleware } from "@shared/infrastructure/http/middlewares/localization/localization.middleware";

import { QuestionModule } from "@question/question.module";

@Module({
  imports: [AppConfigModule, LoggerModule.forRoot(getLoggerConfiguration()), HealthModule, DatabaseModule, QuestionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(LocalizationMiddleware)
      .forRoutes("*");
  }
}