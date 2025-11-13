import { Test } from "@nestjs/testing";

import { HealthController } from "@modules/health/controllers/health.controller";
import { HealthService } from "@modules/health/providers/services/health.service";

import { createMockedHealthService } from "@mocks/modules/health/providers/services/health.service.mock";

describe("Health Controller", () => {
  let healthController: HealthController;
  let mocks: {
    services: {
      health: ReturnType<typeof createMockedHealthService>;
    };
  };

  beforeEach(async() => {
    mocks = {
      services: {
        health: createMockedHealthService(),
      },
    };
    const testingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthService,
          useValue: mocks.services.health,
        },
      ],
    }).compile();

    healthController = testingModule.get<HealthController>(HealthController);
  });

  describe(HealthController.prototype.check, () => {
    it("should check health from service when called.", async() => {
      await healthController.check();

      expect(mocks.services.health.checkAppHealth).toHaveBeenCalledExactlyOnceWith();
    });
  });
});