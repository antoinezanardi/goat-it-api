import { NestFactory } from "@nestjs/core";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import { Logger } from "nestjs-pino";

import { AppModule } from "@app/app.module";

import { SWAGGER_DOCUMENTATION_PATH } from "@server/constants/swagger.constants";
import { setupSwaggerModule } from "@server/helpers/swagger.helpers";

import type { NestFastifyApplication } from "@nestjs/platform-fastify";

async function bootstrap(): Promise<NestFastifyApplication> {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { bufferLogs: true },
  );

  const logger = app.get(Logger);

  app.enableShutdownHooks();
  app.useLogger(logger);

  setupSwaggerModule(app);
  app.useStaticAssets({
    root: `${process.cwd()}/public`,
    prefix: "/public/",
  });

  const host = process.env.HOST ?? "0.0.0.0";
  const port = Number.parseInt(process.env.PORT ?? "3000");
  await app.listen({ host, port });

  const appUrl = await app.getUrl();

  logger.log(`🐐 Goat It API is running on: ${appUrl}`);
  logger.log(`📚 Swagger documentation is available on: ${appUrl}${SWAGGER_DOCUMENTATION_PATH}`);

  return app;
}

export { bootstrap };