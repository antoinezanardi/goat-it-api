import { ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";

import { createApiKeyValidator, hashApiKey } from "@src/infrastructure/api/auth/helpers/auth.helpers";
import { AppConfigService } from "@src/infrastructure/api/config/providers/services/app-config.service";

import { createMockedNestConfigService } from "@mocks/infrastructure/api/config/providers/services/nest-config.service.mock";

import { createFakeCorsConfigFromEnv, createFakeLocalizationConfigFromEnv, createFakeMongoDatabaseConfigFromEnv, createFakeServerConfigFromEnv } from "@faketories/infrastructure/api/config/config.faketory";

import type { Mock } from "vitest";
import type { TestingModule } from "@nestjs/testing";

import type { CorsConfigFromEnv, LocalizationConfigFromEnv, MongoDatabaseConfigFromEnv, ServerConfigFromEnv, AuthenticationConfigFromEnv } from "@src/infrastructure/api/config/types/config.types";

vi.mock(import("@src/infrastructure/api/auth/helpers/auth.helpers"));

describe("App Config Service", () => {
  let services: { appConfig: AppConfigService };
  let mocks: {
    services: {
      nestConfig: ReturnType<typeof createMockedNestConfigService>;
    };
    helpers: {
      hashApiKey: Mock;
      createApiKeyValidator: Mock;
    };
  };

  beforeEach(async() => {
    const apiKeyHmacSecret = "valid-hmac-secret-of-sufficient-length";
    const adminApiKey = "valid-admin-api-key-of-sufficient-length";
    const gameApiKey = "valid-game-api-key-of-sufficient-length";

    process.env.API_KEY_HMAC_SECRET = apiKeyHmacSecret;
    process.env.ADMIN_API_KEY = adminApiKey;
    process.env.GAME_API_KEY = gameApiKey;

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
          API_KEY_HMAC_SECRET: apiKeyHmacSecret,
          ADMIN_API_KEY: adminApiKey,
          GAME_API_KEY: gameApiKey,
        }),
      },
      helpers: {
        hashApiKey: vi.mocked(hashApiKey).mockReturnValue("hashed-api-key"),
        createApiKeyValidator: vi.mocked(createApiKeyValidator).mockReturnValue(() => true),
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
      mocks.services.nestConfig.getOrThrow.mockReturnValueOnce("https://0.0.0.0");
      mocks.services.nestConfig.getOrThrow.mockReturnValueOnce("8080");

      expect(services.appConfig.serverBaseUrl).toBe("https://0.0.0.0:8080");
    });

    it("should return server base url with http when host includes http scheme.", () => {
      mocks.services.nestConfig.getOrThrow.mockReturnValueOnce("http://127.0.0.0");
      mocks.services.nestConfig.getOrThrow.mockReturnValueOnce("8080");

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
      expect(services.appConfig.authenticationConfig).toStrictEqual<AuthenticationConfigFromEnv>({
        admin: {
          apiKeyValidator: expect.any(Function) as () => boolean,
        },
        game: {
          apiKeyValidator: expect.any(Function) as () => boolean,
        },
      });
    });
  });

  describe("computeAuthenticationConfigCache", () => {
    it("should throw error when one of the required env vars is not defined.", () => {
      mocks.services.nestConfig.getOrThrow.mockImplementation(() => {
        throw new Error("API_KEY_HMAC_SECRET is not defined");
      });

      expect(() => services.appConfig["computeAuthenticationConfigCache"]()).toThrowError("API_KEY_HMAC_SECRET is not defined");
    });

    it("should call hashApiKey for adminApiKey when config service is created.", () => {
      expect(mocks.helpers.hashApiKey).toHaveBeenNthCalledWith(1, "valid-admin-api-key-of-sufficient-length", "valid-hmac-secret-of-sufficient-length");
    });

    it("should call hashApiKey for gameApiKey when config service is created.", () => {
      expect(mocks.helpers.hashApiKey).toHaveBeenNthCalledWith(2, "valid-game-api-key-of-sufficient-length", "valid-hmac-secret-of-sufficient-length");
    });

    it("should call createApiKeyValidator for adminApiKey when config service is created.", () => {
      expect(mocks.helpers.createApiKeyValidator).toHaveBeenNthCalledWith(1, "hashed-api-key", "valid-hmac-secret-of-sufficient-length");
    });

    it("should call createApiKeyValidator for gameApiKey when config service is created.", () => {
      expect(mocks.helpers.createApiKeyValidator).toHaveBeenNthCalledWith(2, "hashed-api-key", "valid-hmac-secret-of-sufficient-length");
    });
  });

  describe("deleteSensitiveEnvVariables", () => {
    it("should delete api key hmac secret when computing authentication config cache.", () => {
      expect(process.env.API_KEY_HMAC_SECRET).toBeUndefined();
    });

    it("should delete admin api key when computing authentication config cache.", () => {
      expect(process.env.ADMIN_API_KEY).toBeUndefined();
    });

    it("should delete game api key when computing authentication config cache.", () => {
      expect(process.env.GAME_API_KEY).toBeUndefined();
    });
  });
});