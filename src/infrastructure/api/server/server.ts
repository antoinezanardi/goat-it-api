import { NestFactory } from "@nestjs/core";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import { Logger } from "nestjs-pino";

import { AppConfigService } from "@src/infrastructure/api/config/providers/services/app-config.service";
import { createCorsConfig } from "@src/infrastructure/api/server/cors/helpers/cors.helpers";
import { SWAGGER_DOCUMENTATION_PATH } from "@src/infrastructure/api/server/swagger/constants/swagger.constants";
import { setupSwaggerModule } from "@src/infrastructure/api/server/swagger/helpers/swagger.helpers";

import { AppModule } from "@app/app.module";

import type { NestFastifyApplication } from "@nestjs/platform-fastify";

async function bootstrap(): Promise<NestFastifyApplication> {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), { bufferLogs: true });

  const logger = app.get(Logger);
  const appConfigService = app.get<AppConfigService>(AppConfigService);

  const corsConfig = createCorsConfig(appConfigService.corsConfig);
  app.enableCors(corsConfig);

  app.enableShutdownHooks();
  app.useLogger(logger);

  setupSwaggerModule(app);
  app.useStaticAssets({
    root: `${process.cwd()}/public`,
    prefix: "/public/",
  });

  await app.listen(appConfigService.serverConfig);

  const appUrl = await app.getUrl();

  logger.log(`🐐 Goat It API is running on: ${appUrl}`);
  logger.log(`📚 Swagger documentation is available on: ${appUrl}${SWAGGER_DOCUMENTATION_PATH}`);

  return app;
}

export { bootstrap };