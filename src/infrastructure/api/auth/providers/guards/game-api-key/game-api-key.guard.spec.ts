import { Test } from "@nestjs/testing";

import { canActivateApiKeyGuardHandler } from "@src/infrastructure/api/auth/helpers/auth.helpers";
import { GameApiKeyGuard } from "@src/infrastructure/api/auth/providers/guards/game-api-key/game-api-key.guard";
import { AppConfigService } from "@src/infrastructure/api/config/providers/services/app-config.service";

import { createMockedAppConfigService } from "@mocks/infrastructure/api/config/providers/services/app-config.service.mock";

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
      canActivateApiKeyGuardHandler: Mock;
    };
  };

  beforeEach(async() => {
    mocks = {
      services: {
        appConfig: createMockedAppConfigService(),
      },
      helpers: {
        canActivateApiKeyGuardHandler: vi.mocked(canActivateApiKeyGuardHandler),
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
    it("should call canActivateApiKeyGuardHandler when called.", () => {
      const fakeExecutionContext = {} as ExecutionContext;

      gameApiKeyGuard.canActivate(fakeExecutionContext);

      expect(mocks.helpers.canActivateApiKeyGuardHandler).toHaveBeenCalledExactlyOnceWith(
        fakeExecutionContext,
        mocks.services.appConfig,
        "game",
      );
    });
  });
});