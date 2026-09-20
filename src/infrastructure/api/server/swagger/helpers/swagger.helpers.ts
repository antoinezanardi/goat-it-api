import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { cleanupOpenApiDoc } from "nestjs-zod";

import { SWAGGER_DOCUMENTATION_PATH, SWAGGER_DOCUMENTATION_TITLE } from "@src/infrastructure/api/server/swagger/constants/swagger.constants";

import { readPackageJson } from "@shared/domain/helpers/package-json/package-json.helpers";

import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import type { OpenAPIObject, SwaggerCustomOptions } from "@nestjs/swagger";

const packageJson = readPackageJson();

function getSwaggerUrl(appUrl: string): string {
  const url = new URL(SWAGGER_DOCUMENTATION_PATH, appUrl);

  return url.href;
}

function getSwaggerConfig(): Omit<OpenAPIObject, "paths"> {
  const documentBuilder = new DocumentBuilder();

  return documentBuilder
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