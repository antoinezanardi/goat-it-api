import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { cleanupOpenApiDoc } from "nestjs-zod";

import packageJson from "@package-json" with { type: "json" };

import { createSwaggerDocument, getSwaggerConfig, getSwaggerUrl, setupSwaggerModule } from "@src/infrastructure/api/server/swagger/helpers/swagger.helpers";

import type { OpenAPIObject, SwaggerCustomOptions } from "@nestjs/swagger";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import type { MockInstance } from "vitest";

describe("Swagger Helper", () => {
  let mocks: {
    DocumentBuilder: {
      setTitle: MockInstance;
      setDescription: MockInstance;
      setVersion: MockInstance;
      build: MockInstance;
    };
    SwaggerModule: {
      createDocument: MockInstance;
      setup: MockInstance;
    };
    cleanupOpenApiDoc: MockInstance;
  };

  beforeEach(() => {
    mocks = {
      DocumentBuilder: {
        setTitle: vi.spyOn(DocumentBuilder.prototype, "setTitle").mockReturnThis(),
        setDescription: vi.spyOn(DocumentBuilder.prototype, "setDescription").mockReturnThis(),
        setVersion: vi.spyOn(DocumentBuilder.prototype, "setVersion").mockReturnThis(),
        build: vi.spyOn(DocumentBuilder.prototype, "build").mockReturnValue({} as Omit<OpenAPIObject, "paths">),
      },
      SwaggerModule: {
        createDocument: vi.spyOn(SwaggerModule, "createDocument").mockReturnValue({ openapi: "3.0.0", paths: {}, components: { schemas: {} } } as OpenAPIObject),
        setup: vi.spyOn(SwaggerModule, "setup").mockReturnValue(undefined),
      },
      cleanupOpenApiDoc: vi.mocked(cleanupOpenApiDoc),
    };
  });

  describe(getSwaggerUrl, () => {
    it("should return correct swagger url when called.", () => {
      const appUrl = "http://localhost:3000";
      const expectedSwaggerUrl = "http://localhost:3000/docs";
      const swaggerUrl = getSwaggerUrl(appUrl);

      expect(swaggerUrl).toBe(expectedSwaggerUrl);
    });

    it("should not double-slash when base url ends with slash.", () => {
      expect(getSwaggerUrl("http://localhost:3000/")).toBe("http://localhost:3000/docs");
    });
  });

  describe(getSwaggerConfig, () => {
    it("should set title when called.", () => {
      getSwaggerConfig();

      expect(mocks.DocumentBuilder.setTitle).toHaveBeenCalledExactlyOnceWith("Goat It API Reference Documentation");
    });

    it("should set description when called.", () => {
      getSwaggerConfig();

      expect(mocks.DocumentBuilder.setDescription).toHaveBeenCalledExactlyOnceWith(packageJson.description);
    });

    it("should set version when called.", () => {
      getSwaggerConfig();

      expect(mocks.DocumentBuilder.setVersion).toHaveBeenCalledExactlyOnceWith(packageJson.version);
    });

    it("should build document when called.", () => {
      getSwaggerConfig();

      expect(mocks.DocumentBuilder.build).toHaveBeenCalledExactlyOnceWith();
    });
  });

  describe(createSwaggerDocument, () => {
    it("should create swagger document when called.", () => {
      const mockedApp = {} as NestFastifyApplication;
      createSwaggerDocument(mockedApp);

      expect(mocks.SwaggerModule.createDocument).toHaveBeenCalledExactlyOnceWith(mockedApp, {});
    });

    it("should clean up open api doc when called.", () => {
      const mockedApp = {} as NestFastifyApplication;
      const expectedDocument = { openapi: "3.0.0", paths: {}, components: { schemas: {} } } as OpenAPIObject;
      mocks.SwaggerModule.createDocument.mockReturnValue(expectedDocument);
      createSwaggerDocument(mockedApp);

      expect(mocks.cleanupOpenApiDoc).toHaveBeenCalledExactlyOnceWith(expectedDocument);
    });
  });

  describe(setupSwaggerModule, () => {
    it("should setup Swagger module when called.", () => {
      const mockedApp = {} as NestFastifyApplication;
      const expectedSwaggerOptions: SwaggerCustomOptions = {
        customSiteTitle: "Goat It API Reference Documentation",
      };
      setupSwaggerModule(mockedApp);

      expect(mocks.SwaggerModule.setup).toHaveBeenCalledExactlyOnceWith("/docs", mockedApp, undefined, expectedSwaggerOptions);
    });
  });
});