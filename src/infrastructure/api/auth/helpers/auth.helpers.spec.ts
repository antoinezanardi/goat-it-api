import { UnauthorizedException } from "@nestjs/common";

import { API_KEY_HEADER } from "@src/infrastructure/api/auth/constants/auth.constants";
import { InvalidApiKeyError, MissingApiKeyError } from "@src/infrastructure/api/auth/errors/auth.errors";
import { canActivateApiKeyGuardHandler, createApiKeyValidator, hashApiKey, validateReceivedApiKey } from "@src/infrastructure/api/auth/helpers/auth.helpers";
import type { AppConfigService } from "@src/infrastructure/api/config/providers/services/app-config.service";

import { createMockedAppConfigService } from "@mocks/infrastructure/api/config/providers/services/app-config.service.mock";
import { getMockedLoggerInstance } from "@mocks/shared/nest/nest.mock";

import type { ExecutionContext } from "@nestjs/common";

function createFakeExecutionContext(apiKey?: string, route?: string): ExecutionContext {
  const request = {
    headers: {
      [API_KEY_HEADER]: apiKey,
    },
    routeOptions: route === undefined ? undefined : { url: route },
  };

  return {
    switchToHttp: (): unknown => ({
      getRequest: (): unknown => request,
    }),
  } as unknown as ExecutionContext;
}

describe("Auth Helpers", () => {
  describe(hashApiKey, () => {
    it("should return a hashed version of the provided API key when called.", () => {
      const apiKey = "my-secret-api-key";
      const hmacKey = "test-hmac";

      const hashedApiKey = hashApiKey(apiKey, hmacKey);

      expect(hashedApiKey).toBe("2889beb17aa4dd45adc091e693c98b498f029494a00c9ac926504ac03e42facb");
    });
  });

  describe(createApiKeyValidator, () => {
    it("should return a function that validates API keys when called.", () => {
      const hashedApiKey = "hashed-api-key";
      const apiKeyValidator = createApiKeyValidator(hashedApiKey, "test-hmac");

      expectTypeOf(apiKeyValidator).toBeFunction();
    });

    it("should not throw when the provided API key is valid.", () => {
      const apiKey = "my-secret-api";
      const hmacKey = "test-hmac";
      const hashedApiKey = hashApiKey(apiKey, hmacKey);
      const apiKeyValidator = createApiKeyValidator(hashedApiKey, hmacKey);

      expect(() => apiKeyValidator(apiKey)).not.toThrow();
    });

    it("should throw InvalidApiKeyError when the provided API key is invalid.", () => {
      const apiKey = "my-secret-api";
      const hmacKey = "test-hmac";
      const hashedApiKey = hashApiKey(apiKey, hmacKey);
      const apiKeyValidator = createApiKeyValidator(hashedApiKey, hmacKey);

      expect(() => apiKeyValidator("invalid-api-key")).toThrow(InvalidApiKeyError);
    });
  });

  describe(validateReceivedApiKey, () => {
    it("should throw MissingApiKeyError when received API key is not a string.", () => {
      const expectedError = new MissingApiKeyError();

      expect(() => validateReceivedApiKey("hashed-api-key", 12_345, "test-hmac")).toThrow(expectedError);
    });

    it("should throw InvalidApiKeyError when received API key is invalid because not same length.", () => {
      const expectedError = new InvalidApiKeyError();
      const hmacKey = "test-hmac";
      const hashedValidApiKey = "abcdef";

      expect(() => validateReceivedApiKey(hashedValidApiKey, "valid-api-key", hmacKey)).toThrow(expectedError);
    });

    it("should throw InvalidApiKeyError when received API key is invalid because content does not match.", () => {
      const expectedError = new InvalidApiKeyError();
      const hmacKey = "test-hmac";
      const hashedValidApiKey = hashApiKey("valid-api-key", hmacKey);

      expect(() => validateReceivedApiKey(hashedValidApiKey, "invalid-key-2", hmacKey)).toThrow(expectedError);
    });

    it("should not throw an error when received API key is valid.", () => {
      const validApiKey = "valid-api-key";
      const hmacKey = "test-hmac";
      const hashedValidApiKey = hashApiKey(validApiKey, hmacKey);

      expect(() => validateReceivedApiKey(hashedValidApiKey, validApiKey, hmacKey)).not.toThrow();
    });
  });

  describe(canActivateApiKeyGuardHandler, () => {
    let appConfigService: ReturnType<typeof createMockedAppConfigService>;
    let logger: ReturnType<typeof getMockedLoggerInstance>;

    beforeEach(() => {
      appConfigService = createMockedAppConfigService();
      logger = getMockedLoggerInstance();
    });

    it.each<{ test: string; authType: "admin" | "game"; apiKey: string }>([
      {
        test: "should return true when API key is valid for admin auth type.",
        authType: "admin",
        apiKey: "valid-admin-api-key-of-sufficient-length",
      },
      {
        test: "should return true when API key is valid for game auth type.",
        authType: "game",
        apiKey: "valid-game-api-key-of-sufficient-length",
      },
    ])("$test", ({ authType, apiKey }) => {
      const isValid = canActivateApiKeyGuardHandler(createFakeExecutionContext(apiKey), appConfigService as unknown as AppConfigService, authType, logger);

      expect(isValid).toBeTruthy();
    });

    it("should not emit an auth failed event when the API key is valid.", () => {
      canActivateApiKeyGuardHandler(createFakeExecutionContext("valid-admin-api-key-of-sufficient-length"), appConfigService as unknown as AppConfigService, "admin", logger);

      expect(logger.warn).not.toHaveBeenCalled();
    });

    it("should throw UnauthorizedException with error message when API key is invalid for admin auth type and error is type Error.", () => {
      vi.spyOn(appConfigService.authenticationConfig.admin, "apiKeyValidator").mockImplementation(() => {
        throw new InvalidApiKeyError();
      });
      const expectedError = new UnauthorizedException("Invalid API key");

      expect(() => canActivateApiKeyGuardHandler(
        createFakeExecutionContext("invalid-api-key"),
        appConfigService as unknown as AppConfigService,
        "admin",
        logger,
      )).toThrow(expectedError);
    });

    it("should throw UnauthorizedException with generic message when API key is invalid for game auth type and error is not type Error.", () => {
      vi.spyOn(appConfigService.authenticationConfig.game, "apiKeyValidator").mockThrow("Unexpected error");
      const expectedError = new UnauthorizedException("Unauthorized");

      expect(() => canActivateApiKeyGuardHandler(
        createFakeExecutionContext("invalid-api-key"),
        appConfigService as unknown as AppConfigService,
        "game",
        logger,
      )).toThrow(expectedError);
    });

    it("should emit the auth failed event with the invalid reason when the admin API key is invalid.", () => {
      vi.spyOn(appConfigService.authenticationConfig.admin, "apiKeyValidator").mockImplementation(() => {
        throw new InvalidApiKeyError();
      });

      try {
        canActivateApiKeyGuardHandler(createFakeExecutionContext("invalid-api-key", "/admin/questions"), appConfigService as unknown as AppConfigService, "admin", logger);
      } catch(error) {
        void error;
      }

      expect(logger.warn).toHaveBeenCalledExactlyOnceWith({
        event: "auth.failed",
        status: 401,
        route: "/admin/questions",
        audience: "admin",
        reason: "invalid",
      }, "API key authentication failed");
    });

    it("should emit the auth failed event with the missing reason when the API key is missing.", () => {
      vi.spyOn(appConfigService.authenticationConfig.game, "apiKeyValidator").mockImplementation(() => {
        throw new MissingApiKeyError();
      });

      try {
        canActivateApiKeyGuardHandler(createFakeExecutionContext(undefined, "/games/:id/questions"), appConfigService as unknown as AppConfigService, "game", logger);
      } catch(error) {
        void error;
      }

      expect(logger.warn).toHaveBeenCalledExactlyOnceWith({
        event: "auth.failed",
        status: 401,
        route: "/games/:id/questions",
        audience: "game",
        reason: "missing",
      }, "API key authentication failed");
    });

    it("should emit the auth failed event with the unknown reason when the validator throws an unexpected error.", () => {
      vi.spyOn(appConfigService.authenticationConfig.admin, "apiKeyValidator").mockThrow(new TypeError("Unexpected validator error"));

      try {
        canActivateApiKeyGuardHandler(createFakeExecutionContext("invalid-api-key", "/admin/questions"), appConfigService as unknown as AppConfigService, "admin", logger);
      } catch(error) {
        void error;
      }

      expect(logger.warn).toHaveBeenCalledExactlyOnceWith({
        event: "auth.failed",
        status: 401,
        route: "/admin/questions",
        audience: "admin",
        reason: "unknown",
      }, "API key authentication failed");
    });

    it("should emit the unknown route when the request carries no route options.", () => {
      vi.spyOn(appConfigService.authenticationConfig.admin, "apiKeyValidator").mockImplementation(() => {
        throw new InvalidApiKeyError();
      });

      try {
        canActivateApiKeyGuardHandler(createFakeExecutionContext("invalid-api-key"), appConfigService as unknown as AppConfigService, "admin", logger);
      } catch(error) {
        void error;
      }

      expect(logger.warn).toHaveBeenCalledWith({
        event: "auth.failed",
        status: 401,
        route: "unknown",
        audience: "admin",
        reason: "invalid",
      }, "API key authentication failed");
    });
  });
});