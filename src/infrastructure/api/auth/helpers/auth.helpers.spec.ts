import { UnauthorizedException } from "@nestjs/common";

import { InvalidApiKeyError, MissingApiKeyError } from "@src/infrastructure/api/auth/errors/auth.errors";
import { canActivateApiKeyGuardHandler, createApiKeyValidator, hashApiKey, validateReceivedApiKey } from "@src/infrastructure/api/auth/helpers/auth.helpers";
import type { AppConfigService } from "@src/infrastructure/api/config/providers/services/app-config.service";

import { createMockedAppConfigService } from "@mocks/infrastructure/api/config/providers/services/app-config.service.mock";

import type { ExecutionContext } from "@nestjs/common";

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

    it("should return true when the provided API key is valid.", () => {
      const apiKey = "my-secret-api";
      const hmacKey = "test-hmac";
      const hashedApiKey = hashApiKey(apiKey, hmacKey);
      const apiKeyValidator = createApiKeyValidator(hashedApiKey, hmacKey);

      expect(() => apiKeyValidator(apiKey)).not.toThrowError();
    });

    it("should throw InvalidApiKeyError when the provided API key is invalid.", () => {
      const apiKey = "my-secret-api";
      const hmacKey = "test-hmac";
      const hashedApiKey = hashApiKey(apiKey, hmacKey);
      const apiKeyValidator = createApiKeyValidator(hashedApiKey, hmacKey);

      expect(() => apiKeyValidator("invalid-api-key")).toThrowError(InvalidApiKeyError);
    });
  });

  describe(validateReceivedApiKey, () => {
    it("should throw MissingApiKeyError when received API key is not a string.", () => {
      const expectedError = new MissingApiKeyError();

      expect(() => validateReceivedApiKey("hashed-api-key", 12_345, "test-hmac")).toThrowError(expectedError);
    });

    it("should throw InvalidApiKeyError when received API key is invalid because not same length.", () => {
      const expectedError = new InvalidApiKeyError();
      const validApiKey = "valid-api-key";
      const hmacKey = "test-hmac";
      const hashedValidApiKey = hashApiKey(validApiKey, hmacKey);

      expect(() => validateReceivedApiKey(hashedValidApiKey, "short", hmacKey)).toThrowError(expectedError);
    });

    it("should throw InvalidApiKeyError when received API key is invalid because content does not match.", () => {
      const expectedError = new InvalidApiKeyError();
      const hmacKey = "test-hmac";
      const hashedValidApiKey = "hashed-api-key-for-comparison";

      expect(() => validateReceivedApiKey(hashedValidApiKey, "invalid-key-2", hmacKey)).toThrowError(expectedError);
    });

    it("should not throw an error when received API key is valid.", () => {
      const validApiKey = "valid-api-key";
      const hmacKey = "test-hmac";
      const hashedValidApiKey = hashApiKey(validApiKey, hmacKey);

      expect(() => validateReceivedApiKey(hashedValidApiKey, validApiKey, hmacKey)).not.toThrowError();
    });
  });

  describe(canActivateApiKeyGuardHandler, () => {
    let appConfigSevice: ReturnType<typeof createMockedAppConfigService>;

    beforeEach(() => {
      appConfigSevice = createMockedAppConfigService();
    });

    it("should return true when API key is valid for admin auth type.", () => {
      const fakeContext = {
        switchToHttp: (): unknown => ({
          getRequest: (): unknown => ({
            headers: {
              "x-api-key": "valid-admin-api-key-of-sufficient-length",
            },
          }),
        }),
      } as unknown as ExecutionContext;
      const isValid = canActivateApiKeyGuardHandler(fakeContext, appConfigSevice as unknown as AppConfigService, "admin");

      expect(isValid).toBeTruthy();
    });

    it("should return true when API key is valid for game auth type.", () => {
      const fakeContext = {
        switchToHttp: (): unknown => ({
          getRequest: (): unknown => ({
            headers: {
              "x-api-key": "valid-game-api-key-of-sufficient-length",
            },
          }),
        }),
      } as unknown as ExecutionContext;
      const isValid = canActivateApiKeyGuardHandler(fakeContext, appConfigSevice as unknown as AppConfigService, "game");

      expect(isValid).toBeTruthy();
    });

    it("should throw UnauthorizedException with error message when API key is invalid for admin auth type and error is type Error.", () => {
      vi.spyOn(appConfigSevice.authenticationConfig.admin, "apiKeyValidator").mockImplementation(() => {
        throw new InvalidApiKeyError();
      });

      const fakeContext = {
        switchToHttp: (): unknown => ({
          getRequest: (): unknown => ({
            headers: {
              "x-api-key": "invalid-api-key",
            },
          }),
        }),
      } as unknown as ExecutionContext;
      const expectedError = new UnauthorizedException("Invalid API key");

      expect(() => canActivateApiKeyGuardHandler(fakeContext, appConfigSevice as unknown as AppConfigService, "admin")).toThrowError(expectedError);
    });

    it("should throw UnauthorizedException with generic message when API key is invalid for game auth type and error is not type Error.", () => {
      vi.spyOn(appConfigSevice.authenticationConfig.game, "apiKeyValidator").mockImplementation(() => {
        // oxlint-disable-next-line only-throw-error no-throw-literal
        throw "Some string error";
      });

      const fakeContext = {
        switchToHttp: (): unknown => ({
          getRequest: (): unknown => ({
            headers: {
              "x-api-key": "invalid-api-key",
            },
          }),
        }),
      } as unknown as ExecutionContext;
      const expectedError = new UnauthorizedException("Unauthorized");

      expect(() => canActivateApiKeyGuardHandler(fakeContext, appConfigSevice as unknown as AppConfigService, "game")).toThrowError(expectedError);
    });
  });
});