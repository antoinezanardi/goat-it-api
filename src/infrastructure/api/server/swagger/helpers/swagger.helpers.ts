import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { cleanupOpenApiDoc } from "nestjs-zod";

import packageJson from "@package-json" with { type: "json" };

import { SWAGGER_DOCUMENTATION_PATH, SWAGGER_DOCUMENTATION_TITLE } from "@src/infrastructure/api/server/swagger/constants/swagger.constants";

import type { OpenAPIObject, SwaggerCustomOptions } from "@nestjs/swagger";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";

function getSwaggerUrl(appUrl: string): string {
  return new URL(SWAGGER_DOCUMENTATION_PATH, appUrl).toString();
}

function getSwaggerConfig(): Omit<OpenAPIObject, "paths"> {
  return new DocumentBuilder()
    .setTitle(SWAGGER_DOCUMENTATION_TITLE)
    .setDescription(packageJson.description)
    .setVersion(packageJson.version)
    .build();
}

function createSwaggerDocument(app: NestFastifyApplication): OpenAPIObject {
  const config = getSwaggerConfig();

  return cleanupOpenApiDoc(SwaggerModule.createDocument(app, config));
}

function setupSwaggerModule(app: NestFastifyApplication): void {
  const swaggerOptions: SwaggerCustomOptions = {
    customSiteTitle: SWAGGER_DOCUMENTATION_TITLE,
  };

  SwaggerModule.setup(SWAGGER_DOCUMENTATION_PATH, app, createSwaggerDocument(app), swaggerOptions);
}

export {
  getSwaggerUrl,
  getSwaggerConfig,
  createSwaggerDocument,
  setupSwaggerModule,
};