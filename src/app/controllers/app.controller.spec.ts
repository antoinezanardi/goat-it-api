import { Test } from "@nestjs/testing";

import type { APIMetadata } from "@app/types/app.types";
import { AppController } from "@app/controllers/app.controller";
import { AppService } from "@app/providers/services/app.service";

describe("App Controller", () => {
  let appController: AppController;

  const mocks = {
    appService: {
      getApiMeta: vi.fn<() => APIMetadata>(),
    },
  };

  beforeEach(async() => {
    mocks.appService = {
      getApiMeta: vi.fn<() => APIMetadata>().mockReturnValue({
        name: "Goat It API",
        description: "API for Goat It application.",
        version: "1.0.0",
      }),
    };
    const moduleReference = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mocks.appService,
        },
      ],
    }).compile();

    appController = moduleReference.get<AppController>(AppController);
  });

  describe("getHello", () => {
    it("should return 'Hello World!' when called.", () => {
      expect(appController.getApiMetadata()).toStrictEqual<APIMetadata>({
        name: "Goat It API",
        description: "API for Goat It application.",
        version: "1.0.0",
      });
    });
  });
});