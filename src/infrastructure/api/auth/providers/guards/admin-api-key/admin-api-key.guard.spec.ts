import { Test } from "@nestjs/testing";

import { validateReceivedApiKey } from "@src/infrastructure/api/auth/helpers/auth.helpers";
import { AdminApiKeyGuard } from "@src/infrastructure/api/auth/providers/guards/admin-api-key/admin-api-key.guard";
import { AppConfigService } from "@src/infrastructure/api/config/providers/services/app-config.service";

import { createMockedAppConfigService } from "@mocks/infrastructure/api/config/providers/services/app-config.service.mock";

import { createFakeAuthenticationConfigFromEnv } from "@faketories/infrastructure/api/config/config.faketory";

import type { Mock } from "vitest";
import type { ExecutionContext } from "@nestjs/common";

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
              apiKey: "test-admin-api",
            },
            game: {
              apiKey: "test-game-api",
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
    it("should validate received API key when called.", () => {
      const fakeExecutionContext = {
        switchToHttp: (): unknown => ({
          getRequest: (): unknown => ({
            headers: {
              "goat-it-api-key": "goat-it-api-key",
            },
          }),
        }),
      };
      const executionContextStub = fakeExecutionContext as unknown as ExecutionContext;
      adminApiKeyGuard.canActivate(executionContextStub);

      expect(mocks.helpers.validateReceivedApiKey).toHaveBeenCalledExactlyOnceWith(
        "test-admin-api",
        "goat-it-api-key",
      );
    });

    it("should allow access when correct admin API key is provided.", () => {
      const fakeExecutionContext = {
        switchToHttp: (): unknown => ({
          getRequest: (): unknown => ({
            headers: {
              "goat-it-api-key": "goat-it-api-key",
            },
          }),
        }),
      };
      const executionContextStub = fakeExecutionContext as unknown as ExecutionContext;

      expect(adminApiKeyGuard.canActivate(executionContextStub)).toBeTruthy();
    });
  });
});