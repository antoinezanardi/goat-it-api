import { Test } from "@nestjs/testing";

import { AppController } from "@app/controllers/app.controller";
import { AppService } from "@app/providers/services/app.service";

import { createMockedAppService } from "@mocks/app/providers/services/app.service.mock";

describe("App Controller", () => {
  let appController: AppController;
  let mocks: {
    services: {
      app: ReturnType<typeof createMockedAppService>;
    };
  };

  beforeEach(async() => {
    mocks = {
      services: {
        app: createMockedAppService(),
      },
    };
    const testingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mocks.services.app,
        },
      ],
    }).compile();

    appController = testingModule.get<AppController>(AppController);
  });

  describe(AppController.prototype.getApiMetadata, () => {
    it("should call Api metadata service method when called.", () => {
      appController.getApiMetadata();

      expect(mocks.services.app.getApiMeta).toHaveBeenCalledExactlyOnceWith();
    });
  });
});