import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { cleanupOpenApiDoc } from "nestjs-zod";

import { createSwaggerDocument, getSwaggerConfig, getSwaggerUrl, setupSwaggerModule } from "@src/infrastructure/api/server/swagger/helpers/swagger.helpers";

import type { OpenAPIObject, SwaggerCustomOptions } from "@nestjs/swagger";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import type { Mock } from "vitest";

vi.mock(import("@nestjs/swagger"));

vi.mock(import("nestjs-zod"));

vi.mock(import("@package-json"), async importOriginal => ({
  default: {
    ...await importOriginal(),
    description: "API for Goat It application.",
    version: "1.0.0",
  },
}));

describe("Swagger Helper", () => {
  let mocks: {
    DocumentBuilder: {
      setTitle: Mock;
      setDescription: Mock;
      setVersion: Mock;
      build: Mock;
    };
  };

  beforeEach(() => {
    mocks = {
      DocumentBuilder: {
        setTitle: vi.spyOn(DocumentBuilder.prototype, "setTitle").mockReturnThis(),
        setDescription: vi.spyOn(DocumentBuilder.prototype, "setDescription").mockReturnThis(),
        setVersion: vi.spyOn(DocumentBuilder.prototype, "setVersion").mockReturnThis(),
        build: vi.spyOn(DocumentBuilder.prototype, "build").mockReturnValue({} as Omit<OpenAPIObject, "paths">),
      },
    };
  });

  describe(getSwaggerUrl, () => {
    it("should return correct swagger url when called.", () => {
      const appUrl = "http://localhost:3000";
      const expectedSwaggerUrl = "http://localhost:3000/docs";
      const swaggerUrl = getSwaggerUrl(appUrl);

      expect(swaggerUrl).toBe(expectedSwaggerUrl);
    });
  });

  describe(getSwaggerConfig, () => {
    it("should set title when called.", () => {
      getSwaggerConfig();

      expect(mocks.DocumentBuilder.setTitle).toHaveBeenCalledExactlyOnceWith("Goat It API Reference Documentation");
    });

    it("should set description when called.", () => {
      getSwaggerConfig();

      expect(mocks.DocumentBuilder.setDescription).toHaveBeenCalledExactlyOnceWith("API for Goat It application.");
    });

    it("should set version when called.", () => {
      getSwaggerConfig();

      expect(mocks.DocumentBuilder.setVersion).toHaveBeenCalledExactlyOnceWith("1.0.0");
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

      expect(SwaggerModule.createDocument).toHaveBeenCalledExactlyOnceWith(mockedApp, {});
    });

    it("should clean up open api doc when called.", () => {
      const mockedApp = {} as NestFastifyApplication;
      const expectedDocument = {} as OpenAPIObject;
      vi.mocked(SwaggerModule.createDocument).mockReturnValue(expectedDocument);
      createSwaggerDocument(mockedApp);

      expect(cleanupOpenApiDoc).toHaveBeenCalledExactlyOnceWith(expectedDocument);
    });
  });

  describe(setupSwaggerModule, () => {
    it("should setup Swagger module when called.", () => {
      const mockedApp = {} as NestFastifyApplication;
      const expectedSwaggerOptions: SwaggerCustomOptions = {
        customSiteTitle: "Goat It API Reference Documentation",
      };
      setupSwaggerModule(mockedApp);

      expect(SwaggerModule.setup).toHaveBeenCalledExactlyOnceWith("/docs", mockedApp, undefined, expectedSwaggerOptions);
    });
  });
});