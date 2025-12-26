import { Test } from "@nestjs/testing";
import { UnauthorizedException } from "@nestjs/common";

import { API_KEY_HEADER } from "@src/infrastructure/api/auth/constants/auth.constants";
import { validateReceivedApiKey } from "@src/infrastructure/api/auth/helpers/auth.helpers";
import { GameApiKeyGuard } from "@src/infrastructure/api/auth/providers/guards/game-api-key/game-api-key.guard";
import { AppConfigService } from "@src/infrastructure/api/config/providers/services/app-config.service";

import { createMockedAppConfigService } from "@mocks/infrastructure/api/config/providers/services/app-config.service.mock";

import { createFakeAuthenticationConfigFromEnv } from "@faketories/infrastructure/api/config/config.faketory";

import type { ExecutionContext } from "@nestjs/common";
import type { Mock } from "vitest";

vi.mock(import("@src/infrastructure/api/auth/helpers/auth.helpers"));

describe("Game Api Key Guard", () => {
  let gameApiKeyGuard: GameApiKeyGuard;
  let mocks: {
    services: {
      appConfig: ReturnType<typeof createMockedAppConfigService>;
    };
    helpers: {
      validateReceivedApiKey: Mock;
    };
  };

  beforeEach(async() => {
    mocks = {
      services: {
        appConfig: createMockedAppConfigService({
          authenticationConfig: createFakeAuthenticationConfigFromEnv({
            admin: {
              apiKeyValidator: "test-admin-api",
            },
            game: {
              apiKeyValidator: "test-game-api",
            },
          }),
        }),
      },
      helpers: {
        validateReceivedApiKey: vi.mocked(validateReceivedApiKey),
      },
    };
    const testingModule = await Test.createTestingModule({
      providers: [
        GameApiKeyGuard,
        {
          provide: AppConfigService,
          useValue: mocks.services.appConfig,
        },
      ],
    }).compile();

    gameApiKeyGuard = testingModule.get<GameApiKeyGuard>(GameApiKeyGuard);
  });

  describe(GameApiKeyGuard.prototype.canActivate, () => {
    it("should validate received API key when called.", async() => {
      const fakeExecutionContext = {
        switchToHttp: (): unknown => ({
          getRequest: (): unknown => ({
            headers: {
              [API_KEY_HEADER]: "goat-it-api-key",
            },
          }),
        }),
      };
      const executionContextStub = fakeExecutionContext as unknown as ExecutionContext;
      await gameApiKeyGuard.canActivate(executionContextStub);

      expect(mocks.helpers.validateReceivedApiKey).toHaveBeenCalledExactlyOnceWith(
        "test-game-api",
        "goat-it-api-key",
      );
    });

    it("should allow access when correct game API key is provided.", async() => {
      const fakeExecutionContext = {
        switchToHttp: (): unknown => ({
          getRequest: (): unknown => ({
            headers: {
              [API_KEY_HEADER]: "goat-it-api-key",
            },
          }),
        }),
      };
      const executionContextStub = fakeExecutionContext as unknown as ExecutionContext;
      const canActivate = await gameApiKeyGuard.canActivate(executionContextStub);

      expect(canActivate).toBeTruthy();
    });

    it("should deny access when incorrect game API key is provided.", async() => {
      mocks.helpers.validateReceivedApiKey.mockRejectedValueOnce(new Error("Invalid API key"));
      const fakeExecutionContext = {
        switchToHttp: (): unknown => ({
          getRequest: (): unknown => ({
            headers: {
              [API_KEY_HEADER]: "invalid-api-key",
            },
          }),
        }),
      };
      const executionContextStub = fakeExecutionContext as unknown as ExecutionContext;
      const expectedError = new UnauthorizedException(new Error("Invalid API key"));

      await expect(gameApiKeyGuard.canActivate(executionContextStub)).rejects.toThrowError(expectedError);
    });
  });
});