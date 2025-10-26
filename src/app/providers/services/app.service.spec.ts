import { Test } from "@nestjs/testing";

import { AppService } from "@app/providers/services/app.service";

import type { AppMetadata } from "@app/types/app.types";

vi.mock(import("@package-json"), async importOriginal => ({
  default: {
    ...await importOriginal(),
    name: "goat-it-api",
    description: "API for Goat It application.",
    version: "1.0.0",
  },
}));

describe("App Service", () => {
  let services: { app: AppService };

  beforeEach(async() => {
    const testingModule = await Test.createTestingModule({ providers: [AppService] }).compile();

    services = { app: testingModule.get<AppService>(AppService) };
  });

  describe("getApiMeta", () => {
    it("should return Api metadata when called.", () => {
      expect(services.app.getApiMeta()).toStrictEqual<AppMetadata>({
        packageName: "goat-it-api",
        name: "Goat It API",
        description: "API for Goat It application.",
        version: "1.0.0",
      });
    });
  });
});