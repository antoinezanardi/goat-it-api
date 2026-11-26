import { Module } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { ServeStaticModule } from "@nestjs/serve-static";
import { LoggerModule } from "nestjs-pino";
import { ZodSerializerInterceptor, ZodValidationPipe } from "nestjs-zod";

import { AppConfigModule } from "@src/infrastructure/api/config/config.module";
import { HealthModule } from "@src/infrastructure/api/health/health.module";
import { ApiThrottlerModule } from "@src/infrastructure/api/server/throttler/throttler.module";
import { DatabaseModule } from "@src/infrastructure/database/database.module";

import { AppController } from "@app/controllers/app.controller";
import { GlobalExceptionFilter } from "@app/filters/global-exception/global-exception.filter";
import { getLoggerConfiguration } from "@app/helpers/logger.helpers";
import { AppService } from "@app/providers/services/app.service";

import { PUBLIC_ASSETS_PATH_PREFIX } from "@shared/infrastructure/http/constants/public-assets.constants";
import { LocalizationMiddleware } from "@shared/infrastructure/http/middlewares/localization/localization.middleware";

import { QuestionModule } from "@question/question.module";

import { QuestionThemeModule } from "@question-theme/question-theme.module";

import type { MiddlewareConsumer, NestModule } from "@nestjs/common";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: `${process.cwd()}/public`,
      serveRoot: PUBLIC_ASSETS_PATH_PREFIX,
    }),
    AppConfigModule,
    LoggerModule.forRoot(getLoggerConfiguration()),
    HealthModule,
    DatabaseModule,
    QuestionModule,
    QuestionThemeModule,
    ApiThrottlerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
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