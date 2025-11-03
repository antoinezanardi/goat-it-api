import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

import { createSwaggerDocument, getSwaggerConfig, setupSwaggerModule } from "@server/helpers/swagger.helpers";

import type { OpenAPIObject } from "@nestjs/swagger";
import type { NestFastifyApplication } from "@nestjs/platform-fastify";
import type { Mock } from "vitest";

vi.mock(import("@nestjs/swagger"));

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

  describe(getSwaggerConfig, () => {
    it("should set title when called.", () => {
      getSwaggerConfig();

      expect(mocks.DocumentBuilder.setTitle).toHaveBeenCalledExactlyOnceWith("Goat It API");
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
  });

  describe(setupSwaggerModule, () => {
    it("should setup Swagger module when called.", () => {
      const mockedApp = {} as NestFastifyApplication;
      setupSwaggerModule(mockedApp);

      // oxlint-disable-next-line no-useless-undefined
      expect(SwaggerModule.setup).toHaveBeenCalledExactlyOnceWith("/docs", mockedApp, undefined);
    });
  });
});