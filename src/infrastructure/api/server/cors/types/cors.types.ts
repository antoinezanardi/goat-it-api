import type { NestFastifyApplication } from "@nestjs/platform-fastify";

type CorsConfig = NonNullable<Parameters<NestFastifyApplication["enableCors"]>[0]>;

export type { CorsConfig };