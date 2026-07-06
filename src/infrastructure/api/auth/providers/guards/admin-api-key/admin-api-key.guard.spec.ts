import { Test } from "@nestjs/testing";

import * as authHelpers from "@src/infrastructure/api/auth/helpers/auth.helpers";
import { AdminApiKeyGuard } from "@src/infrastructure/api/auth/providers/guards/admin-api-key/admin-api-key.guard";
import { AppConfigService } from "@src/infrastructure/api/config/providers/services/app-config.service";

import { createMockedAppConfigService } from "@mocks/infrastructure/api/config/providers/services/app-config.service.mock";

import type { ExecutionContext } from "@nestjs/common";
import type { MockInstance } from "vitest";

describe("Admin Api Key Guard", () => {
  let adminApiKeyGuard: AdminApiKeyGuard;
  let mocks: {
    services: {
      appConfig: ReturnType<typeof createMockedAppConfigService>;
    };
    helpers: {
      canActivateApiKeyGuardHandler: MockInstance<typeof authHelpers.canActivateApiKeyGuardHandler>;
    };
  };

  beforeEach(async() => {
    mocks = {
      services: {
        appConfig: createMockedAppConfigService(),
      },
      helpers: {
        canActivateApiKeyGuardHandler: vi.spyOn(authHelpers, "canActivateApiKeyGuardHandler").mockReturnValue(true),
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
    it("should call canActivateApiKeyGuardHandler when called.", () => {
      const fakeExecutionContext = {} as ExecutionContext;

      adminApiKeyGuard.canActivate(fakeExecutionContext);

      expect(mocks.helpers.canActivateApiKeyGuardHandler).toHaveBeenCalledExactlyOnceWith(
        fakeExecutionContext,
        mocks.services.appConfig,
        "admin",
      );
    });
  });
});