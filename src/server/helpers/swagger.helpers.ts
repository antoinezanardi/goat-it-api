import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import packageJson from "@package-json" with { type: "json" };

import { SWAGGER_DOCUMENTATION_PATH } from "@server/constants/swagger.constants";

import type { OpenAPIObject } from "@nestjs/swagger";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";

function getSwaggerConfig(): Omit<OpenAPIObject, "paths"> {
  return new DocumentBuilder()
    .setTitle("Goat It API")
    .setDescription(packageJson.description)
    .setVersion(packageJson.version)
    .build();
}

function createSwaggerDocument(app: NestFastifyApplication): OpenAPIObject {
  const config = getSwaggerConfig();

  return SwaggerModule.createDocument(app, config);
}

function setupSwaggerModule(app: NestFastifyApplication): void {
  SwaggerModule.setup(SWAGGER_DOCUMENTATION_PATH, app, createSwaggerDocument(app));
}

export {
  getSwaggerConfig,
  createSwaggerDocument,
  setupSwaggerModule,
};