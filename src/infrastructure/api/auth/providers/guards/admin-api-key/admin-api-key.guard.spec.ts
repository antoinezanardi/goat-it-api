import { Test } from "@nestjs/testing";
import { UnauthorizedException } from "@nestjs/common";

import { API_KEY_HEADER } from "@src/infrastructure/api/auth/constants/auth.constants";
import { validateReceivedApiKey } from "@src/infrastructure/api/auth/helpers/auth.helpers";
import { AdminApiKeyGuard } from "@src/infrastructure/api/auth/providers/guards/admin-api-key/admin-api-key.guard";
import { AppConfigService } from "@src/infrastructure/api/config/providers/services/app-config.service";

import { createMockedAppConfigService } from "@mocks/infrastructure/api/config/providers/services/app-config.service.mock";

import { createFakeAuthenticationConfigFromEnv } from "@faketories/infrastructure/api/config/config.faketory";

import type { ExecutionContext } from "@nestjs/common";
import type { Mock } from "vitest";

vi.mock(import("@src/infrastructure/api/auth/helpers/auth.helpers"));

describe("Admin Api Key Guard", () => {
  let adminApiKeyGuard: AdminApiKeyGuard;
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
        AdminApiKeyGuard,
        {
          provide: AppConfigService,
          useValue: mocks.services.appConfig,
        },
      ],
    }).compile();

    adminApiKeyGuard = testingModule.get<AdminApiKeyGuard>(AdminApiKeyGuard);
  });

  describe(AdminApiKeyGuard.prototype.canActivate, () => {
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
      await adminApiKeyGuard.canActivate(executionContextStub);

      expect(mocks.helpers.validateReceivedApiKey).toHaveBeenCalledExactlyOnceWith(
        "test-admin-api",
        "goat-it-api-key",
      );
    });

    it("should allow access when correct admin API key is provided.", async() => {
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
      const canActivate = await adminApiKeyGuard.canActivate(executionContextStub);

      expect(canActivate).toBeTruthy();
    });

    it("should deny access when incorrect admin API key is provided.", async() => {
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

      await expect(adminApiKeyGuard.canActivate(executionContextStub)).rejects.toThrowError(expectedError);
    });
  });
});