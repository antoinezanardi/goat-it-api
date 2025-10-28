import { NestFactory } from "@nestjs/core";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import { Logger } from "nestjs-pino";

import { AppModule } from "@app/app.module";

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

  const host = process.env.HOST ?? "0.0.0.0";
  const port = Number.parseInt(process.env.PORT ?? "3000");
  await app.listen({ host, port });

  const appUrl = await app.getUrl();

  logger.log(`🐐 Goat It API is running on: ${appUrl}`);

  return app;
}

export { bootstrap };