import { FastifyAdapter } from "@nestjs/platform-fastify";
import { Test } from "@nestjs/testing";

import { AppModule } from "@app/app.module";

import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import type { TestingModule } from "@nestjs/testing";

async function initAppForAcceptanceTests(): Promise<{ app: NestFastifyApplication; module: TestingModule }> {
  const module: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile();
  const app = module.createNestApplication<NestFastifyApplication>(new FastifyAdapter());

  await app.init();
  await app.getHttpAdapter().getInstance().ready();

  return { app, module };
}

export { initAppForAcceptanceTests };