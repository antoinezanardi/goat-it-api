import { Test } from "@nestjs/testing";

import { AppController } from "@app/controllers/app.controller";
import { AppService } from "@app/providers/services/app.service";

import { createFakeApiMetadata } from "@factories/app/app.factory";

import type { APIMetadata } from "@app/types/app.types";

describe("App Controller", () => {
  let appController: AppController;

  const mocks = {
    appService: {
      getApiMeta: vi.fn<() => APIMetadata>(),
    },
  };

  beforeEach(async() => {
    mocks.appService = {
      getApiMeta: vi.fn<() => APIMetadata>().mockReturnValue(createFakeApiMetadata()),
    };
    const testingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mocks.appService,
        },
      ],
    }).compile();

    appController = testingModule.get<AppController>(AppController);
  });

  describe(AppController.prototype.getApiMetadata, () => {
    it("should call Api metadata service method when called.", () => {
      appController.getApiMetadata();

      expect(mocks.appService.getApiMeta).toHaveBeenCalledExactlyOnceWith();
    });
  });
});