import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { cleanupOpenApiDoc } from "nestjs-zod";

import { SWAGGER_DOCUMENTATION_PATH, SWAGGER_DOCUMENTATION_TITLE } from "@src/infrastructure/api/server/swagger/constants/swagger.constants";

import { readPackageJson } from "@shared/infrastructure/helpers/package-json/package-json.helpers";

import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import type { OpenAPIObject, SwaggerCustomOptions } from "@nestjs/swagger";

const packageJson = readPackageJson();

/**
 * Resolves the documentation URL against the server origin, so the health probe targets the same path the Swagger module is mounted on.
 */
function getSwaggerUrl(appUrl: string): string {
  const url = new URL(SWAGGER_DOCUMENTATION_PATH, appUrl);

  return url.href;
}

/**
 * Builds the document metadata from the package description and version, without any path.
 */
function getSwaggerConfig(): Omit<OpenAPIObject, "paths"> {
  const documentBuilder = new DocumentBuilder();

  return documentBuilder
    .setTitle(SWAGGER_DOCUMENTATION_TITLE)
    .setDescription(packageJson.description)
    .setVersion(packageJson.version)
    .build();
}

/**
 * Generates the OpenAPI document from the running app and cleans up the Zod-internal artefacts before it is served.
 */
function createSwaggerDocument(app: NestFastifyApplication): OpenAPIObject {
  const config = getSwaggerConfig();

  return cleanupOpenApiDoc(SwaggerModule.createDocument(app, config));
}

/**
 * Mounts the Swagger UI on the documentation path with the custom site title.
 */
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