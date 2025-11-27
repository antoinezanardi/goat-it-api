import { ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";

import { AppConfigService } from "@src/infrastructure/api/config/providers/services/app-config.service";

import { createMockedNestConfigService } from "@mocks/infrastructure/api/config/providers/services/nest-config.service.mock";

import { createFakeCorsConfigFromEnv, createFakeMongoDatabaseConfigFromEnv, createFakeServerConfigFromEnv } from "@faketories/infrastructure/api/config/config.faketory";

import type { TestingModule } from "@nestjs/testing";

import type { CorsConfigFromEnv, MongoDatabaseConfigFromEnv, ServerConfigFromEnv } from "@src/infrastructure/api/config/types/config.types";

describe("App Config Service", () => {
  let services: { appConfig: AppConfigService };
  let mocks: {
    services: {
      nestConfig: ReturnType<typeof createMockedNestConfigService>;
    };
  };

  beforeEach(async() => {
    mocks = {
      services: {
        nestConfig: createMockedNestConfigService({
          SERVER_HOST: "127.0.0.1",
          SERVER_PORT: 8080,
          CORS_ORIGIN: "everywhere",
          MONGODB_HOST: "localhost",
          MONGODB_PORT: 27_018,
          MONGODB_DATABASE: "goat-it-test",
        }),
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppConfigService,
        {
          provide: ConfigService,
          useValue: mocks.services.nestConfig,
        },
      ],
    }).compile();

    services = { appConfig: module.get<AppConfigService>(AppConfigService) };
  });

  describe("serverConfig", () => {
    it("should return server config from env when called.", () => {
      const expectedServerConfig = createFakeServerConfigFromEnv({
        host: "127.0.0.1",
        port: 8080,
      });

      expect(services.appConfig.serverConfig).toStrictEqual<ServerConfigFromEnv>(expectedServerConfig);
    });
  });

  describe("corsConfig", () => {
    it("should return cors config from env when called.", () => {
      const expectedCorsConfig = createFakeCorsConfigFromEnv({
        origin: "everywhere",
      });

      expect(services.appConfig.corsConfig).toStrictEqual<CorsConfigFromEnv>(expectedCorsConfig);
    });
  });

  describe("mongoDatabaseConfig", () => {
    it("should return mongo database config from env when called.", () => {
      const mongoDatabaseConfig = createFakeMongoDatabaseConfigFromEnv({
        host: "localhost",
        port: 27_018,
        database: "goat-it-test",
      });

      expect(services.appConfig.mongoDbConfig).toStrictEqual<MongoDatabaseConfigFromEnv>(mongoDatabaseConfig);
    });
  });
});