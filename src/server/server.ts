import { NestFactory } from "@nestjs/core";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import { FastifyAdapter } from "@nestjs/platform-fastify";

import { AppModule } from "@app/app.module";

async function bootstrap(): Promise<NestFastifyApplication> {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.enableShutdownHooks();

  const host = process.env.HOST ?? "0.0.0.0";
  const port = Number.parseInt(process.env.PORT ?? "3000");
  await app.listen({ host, port });

  const appUrl = await app.getUrl();

  // TODO [+winston]: Replace with proper logger (Winston) Linked issue : https://github.com/antoinezanardi/goat-it-api/issues/21
  // eslint-disable-next-line no-console
  console.log(`🐐 Goat It API is running on: ${appUrl}`);

  return app;
}

export { bootstrap };