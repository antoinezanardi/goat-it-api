import { Test } from "@nestjs/testing";

import packageJson from "@package-json" with { type: "json" };

import { AppService } from "@app/providers/services/app.service";

describe("App Service", () => {
  let services: { app: AppService };

  beforeEach(async() => {
    const testingModule = await Test.createTestingModule({ providers: [AppService] }).compile();

    services = { app: testingModule.get<AppService>(AppService) };
  });

  describe("getApiMeta", () => {
    it("should return Api metadata when called.", () => {
      expect(services.app.getApiMeta()).toStrictEqual({
        packageName: packageJson.name,
        name: "Goat It API",
        description: packageJson.description,
        version: packageJson.version,
      });
    });
  });
});