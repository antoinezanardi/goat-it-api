import { ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";

import { AppConfigService } from "@src/infrastructure/api/config/providers/services/app-config.service";

import { createMockedNestConfigService } from "@mocks/infrastructure/api/config/providers/services/nest-config.service.mock";

import { createFakeCorsConfigFromEnv, createFakeLocalizationConfigFromEnv, createFakeMongoDatabaseConfigFromEnv, createFakeServerConfigFromEnv } from "@faketories/infrastructure/api/config/config.faketory";

import type { TestingModule } from "@nestjs/testing";

import type { CorsConfigFromEnv, LocalizationConfigFromEnv, MongoDatabaseConfigFromEnv, ServerConfigFromEnv } from "@src/infrastructure/api/config/types/config.types";

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
          FALLBACK_LOCALE: "en",
          GAME_API_KEY: "valid-game-api-key-of-sufficient-length",
          ADMIN_API_KEY: "valid-admin-api-key-of-sufficient-length",
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

    it("should throw error when one of the required env vars is not defined.", () => {
      mocks.services.nestConfig.getOrThrow.mockImplementation(() => {
        throw new Error("SERVER_HOST is not defined");
      });

      expect(() => services.appConfig.serverConfig).toThrowError("SERVER_HOST is not defined");
    });
  });

  describe("serverBaseUrl", () => {
    it("should return server base url when called.", () => {
      expect(services.appConfig.serverBaseUrl).toBe("http://127.0.0.1:8080");
    });

    it("should return server base url with https when host includes https scheme.", () => {
      mocks.services.nestConfig.getOrThrow.mockImplementationOnce(() => "https://0.0.0.0");
      mocks.services.nestConfig.getOrThrow.mockImplementationOnce(() => "8080");

      expect(services.appConfig.serverBaseUrl).toBe("https://0.0.0.0:8080");
    });

    it("should return server base url with http when host includes http scheme.", () => {
      mocks.services.nestConfig.getOrThrow.mockImplementationOnce(() => "http://127.0.0.0");
      mocks.services.nestConfig.getOrThrow.mockImplementationOnce(() => "8080");

      expect(services.appConfig.serverBaseUrl).toBe("http://127.0.0.0:8080");
    });
  });

  describe("corsConfig", () => {
    it("should return cors config from env when called.", () => {
      const expectedCorsConfig = createFakeCorsConfigFromEnv({
        origin: "everywhere",
      });

      expect(services.appConfig.corsConfig).toStrictEqual<CorsConfigFromEnv>(expectedCorsConfig);
    });

    it("should throw error when one of the required env vars is not defined.", () => {
      mocks.services.nestConfig.getOrThrow.mockImplementation(() => {
        throw new Error("CORS_ORIGIN is not defined");
      });

      expect(() => services.appConfig.corsConfig).toThrowError("CORS_ORIGIN is not defined");
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

    it("should throw error when one of the required env vars is not defined.", () => {
      mocks.services.nestConfig.getOrThrow.mockImplementation(() => {
        throw new Error("MONGODB_HOST is not defined");
      });

      expect(() => services.appConfig.mongoDbConfig).toThrowError("MONGODB_HOST is not defined");
    });
  });

  describe("localizationConfig", () => {
    it("should return localization config from env when called.", () => {
      const localizationConfig = createFakeLocalizationConfigFromEnv({
        fallbackLocale: "en",
      });

      expect(services.appConfig.localizationConfig).toStrictEqual<LocalizationConfigFromEnv>(localizationConfig);
    });

    it("should throw error when one of the required env vars is not defined.", () => {
      mocks.services.nestConfig.getOrThrow.mockImplementation(() => {
        throw new Error("FALLBACK_LOCALE is not defined");
      });

      expect(() => services.appConfig.localizationConfig).toThrowError("FALLBACK_LOCALE is not defined");
    });
  });

  describe("authenticationConfig", () => {
    it("should return authentication config from env when called.", () => {
      expect(services.appConfig.authenticationConfig).toStrictEqual({
        admin: {
          apiKey: "valid-admin-api-key-of-sufficient-length",
        },
        game: {
          apiKey: "valid-game-api-key-of-sufficient-length",
        },
      });
    });

    it("should throw error when admin api key is not defined.", () => {
      mocks.services.nestConfig.getOrThrow.mockImplementationOnce(() => {
        throw new Error("ADMIN_API_KEY is not defined");
      });

      expect(() => services.appConfig.authenticationConfig).toThrowError("ADMIN_API_KEY is not defined");
    });

    it("should throw error when game api key is not defined.", () => {
      mocks.services.nestConfig.getOrThrow.mockImplementationOnce(() => "valid-admin-api-key-of-sufficient-length");
      mocks.services.nestConfig.getOrThrow.mockImplementationOnce(() => {
        throw new Error("GAME_API_KEY is not defined");
      });

      expect(() => services.appConfig.authenticationConfig).toThrowError("GAME_API_KEY is not defined");
    });
  });
});