import { Module } from "@nestjs/common";
import { APP_FILTER, APP_PIPE } from "@nestjs/core";
import { ServeStaticModule } from "@nestjs/serve-static";
import { LoggerModule } from "nestjs-pino";
import { ZodValidationPipe } from "nestjs-zod";

import { QuestionThemeModule } from "@question-theme/question-theme.module";

import { AuthModule } from "@src/infrastructure/api/auth/auth.module";
import { AppConfigModule } from "@src/infrastructure/api/config/config.module";
import { HealthModule } from "@src/infrastructure/api/health/health.module";
import { DatabaseModule } from "@src/infrastructure/database/database.module";

import { AppController } from "@app/controllers/app.controller";
import { GlobalExceptionFilter } from "@app/filters/global-exception/global-exception.filter";
import { getLoggerConfiguration } from "@app/helpers/logger.helpers";
import { AppService } from "@app/providers/services/app.service";

import { LocalizationMiddleware } from "@shared/infrastructure/http/middlewares/localization/localization.middleware";

import { QuestionModule } from "@question/question.module";

import type { MiddlewareConsumer, NestModule } from "@nestjs/common";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: `${process.cwd()}/public`,
      serveRoot: "/public/",
    }),
    AppConfigModule,
    LoggerModule.forRoot(getLoggerConfiguration()),
    HealthModule,
    DatabaseModule,
    QuestionModule,
    QuestionThemeModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(LocalizationMiddleware)
      .forRoutes("*");
  }
}