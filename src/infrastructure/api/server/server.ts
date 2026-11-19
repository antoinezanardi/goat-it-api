import { NestFactory } from "@nestjs/core";
import { Logger } from "nestjs-pino";

import { setupResponseCachePolicy } from "@src/infrastructure/api/server/cache/helpers/cache.helpers";
import { AppConfigService } from "@src/infrastructure/api/config/providers/services/app-config.service";
import { NEST_APPLICATION_OPTIONS } from "@src/infrastructure/api/server/constants/server.constants";
import { createCorsConfig } from "@src/infrastructure/api/server/cors/helpers/cors.helpers";
import { createFastifyAdapter } from "@src/infrastructure/api/server/fastify/helpers/fastify.helpers";
import { setupRequestIdHooks } from "@src/infrastructure/api/server/request-id/helpers/request-id.helpers";
import { setupSecurityHeaders, setupSecurityHeadersRequestHook } from "@src/infrastructure/api/server/security-headers/helpers/security-headers.helpers";
import { getSwaggerUrl, setupSwaggerModule } from "@src/infrastructure/api/server/swagger/helpers/swagger.helpers";

import type { Type } from "@nestjs/common";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";

import type { FastifyTrustProxy } from "@src/infrastructure/api/server/fastify/types/fastify.types";

async function bootstrap(appModule: Type<unknown>, trustProxy: FastifyTrustProxy): Promise<NestFastifyApplication> {
  const fastifyAdapter = createFastifyAdapter(trustProxy);
  setupSecurityHeadersRequestHook(fastifyAdapter.getInstance());
  setupRequestIdHooks(fastifyAdapter.getInstance());

  const app = await NestFactory.create<NestFastifyApplication>(appModule, fastifyAdapter, NEST_APPLICATION_OPTIONS);

  const logger = app.get(Logger);
  const appConfigService = app.get<AppConfigService>(AppConfigService);

  const corsConfig = createCorsConfig(appConfigService.corsConfig);
  app.enableCors(corsConfig);

  setupSecurityHeaders(app);
  setupResponseCachePolicy(app);

  app.enableShutdownHooks();
  app.useLogger(logger);

  setupSwaggerModule(app);

  await app.listen(appConfigService.serverConfig);

  const appUrl = await app.getUrl();
  const documentationUrl = getSwaggerUrl(appUrl);

  logger.log(`🐐 Goat It API is running on: ${appUrl}`);
  logger.log(`📚 Swagger documentation is available on: ${documentationUrl}`);

  return app;
}

export { bootstrap };